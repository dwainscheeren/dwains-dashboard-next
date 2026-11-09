import { mdiClose } from "@mdi/js";
import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import memoizeOne from 'memoize-one';

import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { getDeviceClassName, getDomainName } from '../utils/domain-names';
import { areaEntityDisplayName } from '../utils/entity-names';
import { isEntityVisibleInArea, isRegistryEntryVisible } from '../utils/entity-visibility';
import { getAreaIcon, getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import { fireEvent } from './utils/fire-event';
import { showConfirmDialog } from './utils/confirm-dialog';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../utils/unit-format';
import './utils/dd-card-host';
import './dwains-person-tile';
import { getEntityRegistry } from '../utils/entity-registry';
import { closeDialogThenNavigate } from '../utils/dialog-history';
import { getAreaConfigMap, getEntityConfigMap, resolveStatusEntityAreaId } from '../utils/entity-lookups';
import { getDomainStates } from '../utils/state-index';
import { sortAreas } from '../utils/area-entities';
import { masterActionConfirmationEnabled } from '../utils/master-action-confirmations';
import { tileTapToggles } from '../utils/tile-tap';
import { tileTap } from '../utils/tile-tap-directive';
import {
  TOGGLE_DOMAINS,
  countActiveEntities,
  getRoomAction,
  isCompactRoom,
  isDestructiveBulkAction,
  orderRoomGroups,
  personPresence,
  roomActionNeedsConfirmation,
  type BulkDomainAction,
} from '../utils/home-information';
import {
  SheetDragController,
  animateSheetIn,
  findDialogPanel,
  shouldAnimateSheet,
} from '../utils/sheet-drag-controller';
import { dialogSheetStyles } from './styles/dialog-sheet-styles';
import { homeInformationDialogStyles } from './styles/home-information-dialog-styles';
import { roomActionStyles } from './styles/room-action-styles';

export interface DomainEntitiesDialogParams {
  domain: string;
  areaId?: string;
  config: DwainsDashboardConfig;
  filterByUnitOfMeasurement?: string;
  deviceClass?: string;
  entityIds?: string[];
  viewAllLabel?: string;
  onViewAll?: () => void;
  customTitle?: string;
  customEntities?: string[];
  customDescription?: string;
  /**
   * Popup of a Home information card: rooms as cards with their own action,
   * compact entity rows and a header link to the Devices view (`onViewAll`).
   * People show as one group without a header.
   */
  homeInformation?: boolean;
  /** How a Home information popup presents its entities; 'devices' is the only one. */
  homeInformationPresentation?: 'devices';
  /** Devices view the popup belongs to (`light`, `binary_sensor.door`, ...); sets the header icon. */
  deviceViewKey?: string;
  /**
   * Room per entity, for entities that belong to a room in another way than
   * through their own area (the temperature sensor of an area). These skip
   * the room visibility rules: the caller already chose them.
   */
  entityAreas?: Record<string, string>;
}

interface GroupedEntities {
  [areaId: string]: {
    areaName: string;
    entities: EntityConfig[];
  };
}

interface RoomGroup {
  areaId: string;
  areaName: string;
  entities: EntityConfig[];
}

/** Group key of the People popup. */
const PEOPLE_GROUP = '__people__';
const OPTIMISTIC_ENTITY_STATE_TTL = 5000;

interface OptimisticEntityState {
  state: string;
  expiresAt: number;
}

@customElement('dwains-dashboard-next-domain-entities-dialog')
export class DwainsDomainEntitiesDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _params?: DomainEntitiesDialogParams;
  @state() private _groupedEntities: GroupedEntities = {};
  @state() private _loading = true;
  @state() private _optimisticEntityStates: Record<string, OptimisticEntityState> = {};

  private _entityCards = new Map<string, HTMLElement>();
  private _updateInterval?: number;
  private _mobileSheetAnimated = false;
  private _optimisticCleanupTimer?: number;
  private _sheetDrag = new SheetDragController(this, {
    getPanel: () => findDialogPanel(this.renderRoot?.querySelector('ha-dialog')),
    onClose: () => this.closeDialog(),
  });

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, vars);
  }

  private _tp(key: string, count: number): string {
    return ddLocalizePlural(this.hass, key, count);
  }

  static override styles = [dialogSheetStyles, css`
    .area-section {
      margin-bottom: 18px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      border-radius: 16px;
      overflow: hidden;
      box-shadow:
        0 14px 34px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 0;
      background: transparent;
      border-bottom: 0;
    }

    .area-header:has(.area-icon) {
      gap: 12px;
    }

    .area-header:not(:has(.area-icon)) {
      gap: 0;
    }

    .area-icon {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .area-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .area-name {
      font-size: 18px;
      font-weight: 850;
      flex: 1;
    }

    .entity-count {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 750;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(164px, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .domain-todo-list-card {
      grid-column: 1 / -1;
      min-width: 0;
    }

    .domain-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .domain-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 0 0 16px;
    }

    .domain-action-button {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.07),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .domain-action-button:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 26px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.07);
    }

    .domain-action-button:active {
      transform: scale(0.97);
    }

    .domain-action-button ha-icon {
      --mdc-icon-size: 18px;
      color: var(--domain-color, var(--primary-color));
    }

    .dialog-view-all {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      font: inherit;
      font-size: 13px;
      font-weight: 850;
      cursor: pointer;
      transition: transform 0.18s ease, background 0.18s ease;
    }

    .dialog-view-all:hover {
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      transform: translateY(-1px);
    }

    .dialog-view-all:active {
      transform: scale(0.97);
    }

    .dialog-view-all ha-icon {
      --mdc-icon-size: 18px;
    }

    .domain-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 132px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    /* Cards that turn on or off with a tap open the details when held. */
    .domain-entity-card.tap-toggles {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .domain-entity-card:active {
      transform: scale(0.985);
    }

    .domain-entity-card.is-active {
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
    }

    .domain-entity-card.is-unavailable {
      opacity: 0.62;
    }

    .domain-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .domain-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

    .domain-entity-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .domain-entity-action {
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease,
        opacity 0.18s ease;
    }

    .domain-entity-action:active {
      transform: scale(0.94);
    }

    .domain-entity-action:disabled {
      opacity: 0.36;
      cursor: not-allowed;
    }

    .domain-entity-toggle {
      width: 38px;
      height: 22px;
      justify-content: flex-start;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
    }

    .domain-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
    }

    .domain-entity-card.is-active .domain-entity-toggle {
      background: var(--entity-color);
    }

    .domain-entity-card.is-active .domain-entity-toggle::before {
      transform: translateX(16px);
    }

    .domain-entity-more,
    .domain-lock-action {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .domain-lock-action.is-unlocked {
      color: #ffffff;
      background: var(--entity-color);
      box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
    }

    .domain-entity-more ha-icon,
    .domain-lock-action ha-icon {
      --mdc-icon-size: 17px;
    }

    .domain-cover-actions {
      min-height: 32px;
      padding: 3px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.055),
        0 6px 14px rgba(15, 23, 42, 0.08);
    }

    .domain-cover-action {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      background: transparent;
    }

    .domain-cover-action.active {
      color: #ffffff;
      background: var(--entity-color);
      box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
    }

    .domain-cover-action ha-icon {
      --mdc-icon-size: 16px;
    }

    .domain-entity-copy {
      min-width: 0;
    }

    .domain-entity-meta {
      margin-bottom: 3px;
      color: color-mix(in srgb, var(--secondary-text-color) 78%, transparent);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .domain-entity-name {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.05;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .domain-entity-status {
      margin-top: 5px;
      color: color-mix(in srgb, var(--secondary-text-color) 84%, transparent);
      font-size: 12px;
      font-weight: 760;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      font-size: 16px;
      opacity: 0.6;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state ha-icon {
      --mdc-icon-size: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .empty-state-text {
      font-size: 16px;
      opacity: 0.6;
    }

    .custom-description {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--warning-color);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .custom-description ha-icon {
      --mdc-icon-size: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .custom-description p {
      margin: 0;
      line-height: 1.5;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .area-section {
        margin-bottom: 16px;
        border-radius: 14px;
      }

      .entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 12px;
      }

      .domain-entity-card {
        min-height: 126px;
      }
    }
  `, homeInformationDialogStyles, roomActionStyles];

  public async showDialog(params: DomainEntitiesDialogParams): Promise<void> {
    this._params = params;
    this._loading = true;
    this._mobileSheetAnimated = false;
    await this._loadEntities();
  }

  public closeDialog(): void {
    this._params = undefined;
    this._groupedEntities = {};
    this._optimisticEntityStates = {};
    this._entityCards.clear();
    this._mobileSheetAnimated = false;
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = undefined;
    }
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
    fireEvent(this, 'dialog-closed', { dialog: this.localName });
  }

  protected override updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && this._params && !this._loading) {
      this._reconcileOptimisticEntityStates();
      this._updateEntityCards();
    }

    this._animateMobileSheetIn();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._sheetDrag.attach();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._sheetDrag.detach();
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
  }

  private _animateMobileSheetIn(): void {
    if (this._mobileSheetAnimated || !this._params || !shouldAnimateSheet()) return;

    requestAnimationFrame(() => {
      if (animateSheetIn(findDialogPanel(this.renderRoot.querySelector('ha-dialog')))) {
        this._mobileSheetAnimated = true;
      }
    });
  }

  private async _loadEntities(): Promise<void> {
    if (!this._params || !this.hass) return;

    const { domain, areaId, config, filterByUnitOfMeasurement, deviceClass, entityIds, entityAreas } = this._params;
    const grouped: GroupedEntities = {};
    const areasMap = getAreaConfigMap(config);
    const entityConfigs = getEntityConfigMap(config);
    const registry = getEntityRegistry(this.hass);
    const isPerson = domain === 'person';

    // Only look at the given entities, or else at the states of the domain.
    const candidates: HassEntity[] = entityIds?.length
      ? entityIds.map(entityId => this.hass.states[entityId]).filter((state): state is HassEntity => Boolean(state))
      : [...getDomainStates(this.hass.states, domain)];

    const entities: EntityConfig[] = [];
    const seen = new Set<string>();

    candidates.forEach(entityState => {
      const entityId = entityState.entity_id;
      if (seen.has(entityId)) return;
      seen.add(entityId);

      if (entityId.split('.')[0] !== domain) return;
      if (!isRegistryEntryVisible(registry[entityId])) return;

      // People are not tied to a room: one group, whatever their state.
      if (isPerson) {
        entities.push({ entity_id: entityId, hidden: false });
        return;
      }

      if (entityState.state === 'unavailable') return;

      const entityConfig = entityConfigs.get(entityId);
      const assignedAreaId = entityAreas?.[entityId];
      const entityAreaId = assignedAreaId || resolveStatusEntityAreaId(this.hass, config, entityId, entityConfig);

      // Skip entities without area
      if (!entityAreaId) return;

      // Check area filter if specified
      if (areaId && entityAreaId !== areaId) return;

      // Same visibility rules as the room pages (hidden devices, hidden
      // areas and entities hidden in one of the area's groups).
      if (!assignedAreaId && !isEntityVisibleInArea(this.hass, config, entityId, entityAreaId, entityConfig)) return;

      // Apply unit_of_measurement filter if specified
      if (filterByUnitOfMeasurement) {
        if (entityState.attributes?.unit_of_measurement !== filterByUnitOfMeasurement) {
          return;
        }
      } else {
        // Device class filtering is still applied, but the dialog should show
        // all available entities so users can control off/closed items too.
        if (domain === 'binary_sensor' && deviceClass) {
          const entityDeviceClass = entityState.attributes?.device_class;
          if (entityDeviceClass !== deviceClass) return;
        }
      }

      entities.push({
        entity_id: entityId,
        area_id: entityAreaId,
        hidden: false
      });
    });

    if (isPerson) {
      if (entities.length) {
        grouped[PEOPLE_GROUP] = { areaName: this._t('home.people'), entities };
      }
    } else {
      entities.forEach(entity => {
        const entityAreaId = entity.area_id!;
        const area = areasMap.get(entityAreaId);
        if (!area) return;

        if (!grouped[entityAreaId]) {
          grouped[entityAreaId] = {
            areaName: area.name,
            entities: []
          };
        }
        grouped[entityAreaId].entities.push(entity);
      });
    }

    this._groupedEntities = grouped;
    this._loading = false;

    // Start update interval for live updates
    if (!this._updateInterval) {
      this._updateInterval = window.setInterval(() => {
        this._checkForEntityChanges();
      }, 1000);
    }
  }

  private _checkForEntityChanges(): void {
    if (!this._params || !this.hass || this._loading) return;

    const { domain, filterByUnitOfMeasurement, deviceClass } = this._params;
    let needsReload = false;

    // Check if any entities need to be added or removed
    Object.entries(this._groupedEntities).forEach(([_areaId, group]) => {
      group.entities.forEach(entity => {
        const state = this.hass!.states[entity.entity_id];
        if (!state) {
          needsReload = true;
          return;
        }

        const shouldBeVisible = this._shouldEntityBeVisible(state, domain, filterByUnitOfMeasurement, deviceClass);
        if (!shouldBeVisible) {
          needsReload = true;
        }
      });
    });

    if (needsReload) {
      this._loadEntities();
    }
  }

  private _shouldEntityBeVisible(entityState: any, domain: string, filterByUnitOfMeasurement?: string, deviceClass?: string): boolean {
    // People stay in the popup whatever their state.
    if (domain === 'person') return true;
    if (entityState.state === 'unavailable') return false;

    // Check unit_of_measurement filter if specified
    if (filterByUnitOfMeasurement) {
      if (entityState.attributes?.unit_of_measurement !== filterByUnitOfMeasurement) {
        return false;
      }
      return true;
    }

    if (domain === 'binary_sensor' && deviceClass) {
      return entityState.attributes?.device_class === deviceClass;
    }

    return true;
  }

  private _updateEntityCards(): void {
    this._entityCards.forEach((card, _entityId) => {
      if (card && 'hass' in card) {
        card.hass = this.hass;
      }
    });
  }

  render() {
    if (!this._params) return nothing;

    const { domain, filterByUnitOfMeasurement, deviceClass, customTitle } = this._params;
    let domainTitle = customTitle || this._getLocalizedDomainTitle(domain);
    if (filterByUnitOfMeasurement === 'W') {
      domainTitle = this._t('dialog.power_sensors');
    } else if (deviceClass) {
      const deviceClassTitles: Record<string, string> = {
        motion: this._t('dialog.motion_sensors'),
        door: this._t('dialog.door_sensors'),
        window: this._t('dialog.window_sensors'),
        smoke: this._t('dialog.smoke_sensors'),
        gas: this._t('dialog.gas_sensors'),
        moisture: this._t('dialog.moisture_sensors'),
        occupancy: this._t('dialog.occupancy_sensors'),
        opening: this._t('dialog.opening_sensors'),
        presence: this._t('dialog.presence_sensors'),
        safety: this._t('dialog.safety_sensors'),
        tamper: this._t('dialog.tamper_sensors'),
        vibration: this._t('dialog.vibration_sensors')
      };
      domainTitle = deviceClassTitles[deviceClass] || this._getLocalizedDomainTitle(domain);
    }

    const homeInformation = this._params.homeInformation === true;

    return html`
      <ha-dialog
        open
        width="large"
        @closed=${this.closeDialog}
        @cancel=${() => this.closeDialog()}
        .heading=${domainTitle}
        .type=${''}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="header">
          <div class="sheet-handle" aria-hidden="true"></div>
          <ha-icon-button
            slot="navigationIcon"
            .label=${this._t('common.close')}
            .path=${mdiClose}
            @click=${() => this.closeDialog()}
          ></ha-icon-button>
          ${homeInformation ? html`
            <span slot="title" class="dialog-title" style=${`--dialog-accent: ${this._headerColor()};`}>
              <span class="dialog-title-icon" aria-hidden="true">
                <ha-icon icon=${this._headerIcon()}></ha-icon>
              </span>
              <span class="dialog-title-text">${domainTitle}</span>
            </span>
          ` : html`<span slot="title">${domainTitle}</span>`}
          ${homeInformation && this._params.onViewAll ? html`
            <button
              slot="actionItems"
              class="dialog-header-link"
              type="button"
              aria-label=${this._params.viewAllLabel || this._t('navigation.open_devices')}
              @click=${this._handleViewAll}
            >
              <span class="label-long">${this._params.viewAllLabel || this._t('navigation.open_devices')}</span>
              <span class="label-short">${this._t('devices.title')}</span>
              <ha-icon icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
            </button>
          ` : nothing}
        </ha-dialog-header>

        <div class="content ${homeInformation ? 'home-information' : ''}">
          ${this._loading
            ? html`<div class="loading">${this._t('common.loading')}</div>`
            : this._renderContent()
          }
        </div>
      </ha-dialog>
    `;
  }

  /** Header icon of a Home information popup, from its Devices view key. */
  private _headerIcon(): string {
    const params = this._params;
    if (!params) return 'mdi:information-outline';
    const [viewDomain, viewDeviceClass] = (params.deviceViewKey || '').split('.');
    const domain = viewDomain || params.domain;
    const deviceClass = viewDeviceClass || params.deviceClass;
    if (domain === 'person') return 'mdi:account-group';
    if (domain === 'sensor' && !deviceClass) return 'mdi:home-thermometer-outline';
    return deviceClass ? getDeviceClassIcon(domain, deviceClass) : getDomainIcon(domain);
  }

  private _headerColor(): string {
    const params = this._params;
    if (!params) return getDomainColor('');
    const [viewDomain, viewDeviceClass] = (params.deviceViewKey || '').split('.');
    return this._entityColor(viewDomain || params.domain, viewDeviceClass || params.deviceClass);
  }

  private _renderContent() {
    // Handle custom entities (for unavailable entities modal)
    if (this._params?.customEntities) {
      return this._renderCustomEntities();
    }

    const entities = this._allDialogEntities();
    const entityCount = entities.length;

    if (entityCount === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t('dialog.active_empty')}
          </div>
        </div>
      `;
    }

    if (this._params?.homeInformation) {
      return this._renderHomeInformation(entities);
    }

    return html`
      ${this._renderViewAllAction()}
      ${this._renderDomainActions(entities)}
      ${repeat(
        this._orderedGroups(),
        group => group.areaId,
        group => this._renderAreaSection(group.areaId, group)
      )}
    `;
  }

  /** Room groups in the dashboard's area order. */
  private _orderedGroups(): RoomGroup[] {
    return this._orderGroups(this._groupedEntities, this._params?.config, ddLocale(this.hass));
  }

  private _orderGroups = memoizeOne((
    grouped: GroupedEntities,
    config: DwainsDashboardConfig | undefined,
    locale: string
  ): RoomGroup[] => {
    const groups = Object.entries(grouped).map(([areaId, group]) => ({ areaId, ...group }));
    if (!config || groups.length < 2) return groups;
    const areaOrder = sortAreas(config.areas || [], config.areas_display, locale).map(area => area.area_id as string);
    return orderRoomGroups(groups, areaOrder, locale);
  });

  private _renderHomeInformation(entities: EntityConfig[]) {
    if (this._params?.domain === 'person') {
      return html`
        <div class="person-grid">
          ${repeat(entities, entity => entity.entity_id, entity => this._renderPersonTile(entity.entity_id))}
        </div>
      `;
    }

    return html`
      ${this._renderDomainActions(entities)}
      <div class="room-grid">
        ${repeat(
          this._orderedGroups(),
          group => group.areaId,
          group => this._renderRoomCard(group)
        )}
      </div>
    `;
  }

  private _renderPersonTile(entityId: string) {
    const state = this.hass.states[entityId];
    if (!state) return nothing;

    const presence = personPresence(state.state);
    const name = state.attributes?.friendly_name || getEntityRegistry(this.hass)[entityId]?.name || entityId.split('.')[1] || entityId;
    const stateLabel = presence === 'unknown'
      ? this._t('person.no_location')
      : presence === 'home'
        ? this._t('person.home')
        : presence === 'away'
          ? this._t('person.away')
          : formatEntityStateWithUnit(this.hass, state);

    return html`
      <dwains-dashboard-next-person-tile
        .name=${name}
        .stateLabel=${stateLabel}
        .picture=${state.attributes?.entity_picture || ''}
        .icon=${getEntityRegistry(this.hass)[entityId]?.icon || state.attributes?.icon || getDomainIcon('person')}
        .presence=${presence}
        @click=${() => this._showMoreInfo(entityId)}
      ></dwains-dashboard-next-person-tile>
    `;
  }

  private _renderRoomCard(group: RoomGroup) {
    const domain = this._params?.domain || '';
    const area = getAreaConfigMap(this._params?.config).get(group.areaId);
    const accent = this._entityColor(domain, this._params?.deviceClass);
    const titleId = `room-${group.areaId}`;
    const sensorMeta = domain === 'sensor';

    return html`
      <section
        class="room-card ${isCompactRoom(group.entities.length) ? 'is-compact' : 'is-full'}"
        style=${`--room-accent: ${accent};`}
        aria-labelledby=${titleId}
      >
        <header class="room-head">
          <span class="room-icon" aria-hidden="true">
            <ha-icon icon=${area ? getAreaIcon(area) : 'mdi:home'}></ha-icon>
          </span>
          <h3 class="room-name" id=${titleId}>${group.areaName}</h3>
          ${this._renderRoomAction(group, domain)}
        </header>
        <div class="room-entities">
          ${repeat(
            group.entities,
            entity => entity.entity_id,
            entity => this._renderEntityCard(entity, sensorMeta ? this._sensorMeta(entity.entity_id) : '', 'row')
          )}
        </div>
      </section>
    `;
  }

  /** Small line above a sensor's name: what it measures. */
  private _sensorMeta(entityId: string): string {
    const deviceClass = this.hass.states[entityId]?.attributes?.device_class;
    return deviceClass ? getDeviceClassName(this.hass, deviceClass) : '';
  }

  private _renderRoomAction(group: RoomGroup, domain: string) {
    const entityIds = group.entities.map(entity => entity.entity_id).filter(entityId => this.hass.states[entityId]);
    const activeCount = countActiveEntities(entityIds, entityId => {
      const state = this._getEffectiveEntityState(this.hass.states[entityId]);
      return this._isEntityActiveForUi(state, domain);
    });
    const action = getRoomAction(domain, activeCount, entityIds.length);

    if (!action) {
      return html`<span class="room-count">${group.entities.length}</span>`;
    }

    if (action.mode === 'toggle') {
      const label = this._t(action.action === 'turn_off' ? 'action.turn_off_all' : 'action.turn_on_all');
      return html`
        <button
          class="room-toggle ${action.checked ? 'is-on' : ''}"
          type="button"
          role="switch"
          aria-checked=${action.checked ? 'true' : 'false'}
          aria-label=${`${group.areaName}: ${this._t('area_header.on_count', { active: action.activeCount, total: action.totalCount })}`}
          title=${label}
          @click=${() => this._runRoomAction(group, entityIds, action.action, label)}
        >
          <span aria-hidden="true">${action.activeCount}/${action.totalCount}</span>
          <span class="room-toggle-track" aria-hidden="true"></span>
        </button>
      `;
    }

    return html`
      <div class="room-segmented" role="group" aria-label=${group.areaName}>
        ${action.items.map(item => {
          const label = this._t(item.labelKey);
          return html`
            <button
              class="room-segment ${item.current ? 'is-current' : ''}"
              type="button"
              title=${label}
              aria-label=${this._t('action.entity_action', { action: label, name: group.areaName })}
              @click=${() => this._runRoomAction(group, entityIds, item.action, label)}
            >
              <ha-icon icon=${item.icon} aria-hidden="true"></ha-icon>
            </button>
          `;
        })}
      </div>
    `;
  }

  /**
   * The action of one room. Unlocking always asks first, everything else
   * follows the master action confirmation setting of the domain.
   */
  private async _runRoomAction(group: RoomGroup, entityIds: string[], action: BulkDomainAction, label: string): Promise<void> {
    if (!entityIds.length) return;
    const domain = this._params?.domain || '';
    const confirmationEnabled = masterActionConfirmationEnabled(this._params?.config?.settings, domain);

    if (roomActionNeedsConfirmation(action, confirmationEnabled)) {
      const confirmed = await showConfirmDialog(this, {
        hass: this.hass,
        title: label,
        message: this._t('action.confirm_master_action', { count: entityIds.length, area: group.areaName }),
        confirmLabel: label,
        destructive: isDestructiveBulkAction(action),
        container: this.renderRoot.querySelector('ha-dialog') || undefined,
      });
      if (!confirmed) return;
    }

    await this._executeBulkAction(entityIds, action);
  }

  private _renderViewAllAction() {
    if (!this._params?.onViewAll) return nothing;

    return html`
      <div class="domain-actions">
        <button
          class="dialog-view-all"
          type="button"
          @click=${this._handleViewAll}
        >
          <span>${this._params.viewAllLabel || this._t('common.view_all')}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  private _handleViewAll = (): void => {
    const action = this._params?.onViewAll;
    if (!action) {
      this.closeDialog();
      return;
    }
    // "View all" navigates to another page. Home Assistant closes this dialog
    // with history.back(), so wait for that step or it undoes the navigation.
    closeDialogThenNavigate(this.localName, () => this.closeDialog(), action);
  };

  private _renderCustomEntities() {
    const { customEntities, customDescription } = this._params!;

    if (!customEntities || customEntities.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t('dialog.problem_empty')}
          </div>
        </div>
      `;
    }

    return html`
      ${customDescription ? html`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${customDescription}</p>
        </div>
      ` : nothing}

      <div class="entity-section">
        <div class="entities-grid">
          ${repeat(
            customEntities,
            entityId => entityId,
            entityId => this._renderEntityCard({ entity_id: entityId, hidden: false })
          )}
        </div>
      </div>
    `;
  }

  private _allDialogEntities(): EntityConfig[] {
    return Object.values(this._groupedEntities).flatMap(group => group.entities);
  }

  private _renderDomainActions(entities: EntityConfig[]) {
    const domain = this._params?.domain || '';
    const entityIds = entities
      .map(entity => entity.entity_id)
      .filter(entityId => this.hass.states[entityId]);

    if (!entityIds.length) return nothing;

    const color = this._entityColor(domain);
    const actionButton = (label: string, icon: string, action: BulkDomainAction) => html`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${color};`}
        @click=${() => this._runBulkDomainAction(entityIds, action, label)}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span>${label}</span>
      </button>
    `;

    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.turn_on_all'), 'mdi:power', 'turn_on')}
          ${actionButton(this._t('action.turn_off_all'), 'mdi:power-off', 'turn_off')}
        </div>
      `;
    }

    if (domain === 'cover') {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.open_all'), 'mdi:arrow-up', 'open_cover')}
          ${actionButton(this._t('action.close_all'), 'mdi:arrow-down', 'close_cover')}
        </div>
      `;
    }

    if (domain === 'lock') {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.unlock_all'), 'mdi:lock-open-variant-outline', 'unlock')}
          ${actionButton(this._t('action.lock_all'), 'mdi:lock-outline', 'lock')}
        </div>
      `;
    }

    return nothing;
  }

  private _renderAreaSection(_areaId: string, group: { areaName: string; entities: EntityConfig[] }) {
    const areaIcon = _areaId === PEOPLE_GROUP
      ? 'mdi:account-group'
      : getAreaConfigMap(this._params?.config).get(_areaId)?.icon || '';

    return html`
      <div class="area-section">
        <div class="area-header">
          ${areaIcon ? html`
            <div class="area-icon">
              <ha-icon icon="${areaIcon}"></ha-icon>
            </div>
          ` : nothing}
          <div class="area-name">${group.areaName}</div>
          <div class="entity-count">${group.entities.length}</div>
        </div>
        <div class="entities-grid">
          ${repeat(
            group.entities,
            entity => entity.entity_id,
            entity => this._renderEntityCard(entity, group.areaName)
          )}
        </div>
      </div>
    `;
  }

  private _renderEntityCard(entity: EntityConfig, fallbackMeta?: string, layout: 'tile' | 'row' = 'tile') {
    const rawState = this.hass.states[entity.entity_id];
    if (!rawState) return nothing;

    const state = this._getEffectiveEntityState(rawState);
    const domain = entity.entity_id.split('.')[0] || 'unknown';
    if (domain === 'todo') {
      return html`
        <div class="domain-todo-list-card" data-entity=${entity.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{ type: 'todo-list', entity: entity.entity_id }}
          ></dwains-dashboard-next-card-host>
        </div>
      `;
    }

    const deviceClass = state.attributes?.device_class;
    const icon = getEntityRegistry(this.hass)[entity.entity_id]?.icon ||
      state.attributes?.icon ||
      getDeviceClassIcon(domain, deviceClass) ||
      getDomainIcon(domain);
    const fullName = state.attributes?.friendly_name || getEntityRegistry(this.hass)[entity.entity_id]?.name || entity.entity_id;
    // The card shows the area above the name, so the name can leave it out.
    const areaName = this._entityAreaName(entity);
    const name = areaEntityDisplayName(fullName, areaName, this._params?.config?.settings);
    const active = this._isEntityActiveForUi(state, domain);
    const unavailable = this._isUnavailable(state);
    const tapToggles = tileTapToggles(this._params?.config?.settings, entity.entity_id);
    const tapOptions = this._tileTapOptions(entity.entity_id, tapToggles);
    const holdHint = tapToggles ? this._t('tile.hold_for_details') : undefined;
    const classes = [
      'domain-entity-card',
      `domain-entity-${domain}`,
      layout === 'row' ? 'is-row' : '',
      active ? 'is-active' : 'is-off',
      unavailable ? 'is-unavailable' : '',
      tapToggles ? 'tap-toggles' : '',
    ].join(' ');

    if (layout === 'row') {
      // Rooms are already grouped, so the row only names what a sensor measures.
      return html`
        <article
          class=${classes}
          style=${`--entity-color: ${this._entityColor(domain, deviceClass)};`}
          role="button"
          tabindex="0"
          aria-label=${name}
          aria-description=${ifDefined(holdHint)}
          ${tileTap(tapOptions)}
        >
          <div class="domain-entity-icon" aria-hidden="true">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          <div class="domain-entity-copy">
            ${fallbackMeta ? html`<div class="domain-entity-meta">${fallbackMeta}</div>` : nothing}
            <div class="domain-entity-name">${name}</div>
            <div class="domain-entity-status">${this._entityStatusText(state, domain)}</div>
          </div>
          ${this._renderEntityActions(state, domain, active)}
        </article>
      `;
    }

    return html`
      <article
        class=${classes}
        style=${`--entity-color: ${this._entityColor(domain, deviceClass)};`}
        role="button"
        tabindex="0"
        aria-label=${fullName}
        aria-description=${ifDefined(holdHint)}
        ${tileTap(tapOptions)}
      >
        <div class="domain-entity-top">
          <div class="domain-entity-icon">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          ${this._renderEntityActions(state, domain, active)}
        </div>
        <div class="domain-entity-copy">
          <div class="domain-entity-meta">${fallbackMeta || areaName || this._t('dialog.no_area')}</div>
          <div class="domain-entity-name">${name}</div>
          <div class="domain-entity-status">${this._entityStatusText(state, domain)}</div>
        </div>
      </article>
    `;
  }

  private _renderEntityActions(state: any, domain: string, active: boolean) {
    const entityId = state?.entity_id;
    const actionKind = this._entityActionKind(domain);
    const unavailable = this._isUnavailable(state);
    const name = this._entityDisplayName(state);
    const labelFor = (action: string) => this._t('action.entity_action', { action, name });

    if (actionKind === 'toggle') {
      return html`
        <button
          class="domain-entity-action domain-entity-toggle"
          type="button"
          role="switch"
          aria-checked=${active ? 'true' : 'false'}
          title=${active ? this._t('action.turn_off') : this._t('action.turn_on')}
          aria-label=${name}
          ?disabled=${unavailable}
          @click=${(event: Event) => this._handleEntityToggle(event, state, domain)}
        ></button>
      `;
    }

    if (actionKind === 'cover') {
      return this._renderCoverActions(state);
    }

    if (actionKind === 'lock') {
      const unlocked = this._isEntityActiveForUi(state, domain);
      return html`
        <button
          class="domain-entity-action domain-lock-action ${unlocked ? 'is-unlocked' : ''}"
          type="button"
          title=${unlocked ? this._t('action.lock') : this._t('action.unlock')}
          aria-label=${labelFor(unlocked ? this._t('action.lock') : this._t('action.unlock'))}
          ?disabled=${unavailable}
          @click=${(event: Event) => this._handleLockAction(event, state)}
        >
          <ha-icon icon=${unlocked ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline'}></ha-icon>
        </button>
      `;
    }

    return html`
      <button
        class="domain-entity-action domain-entity-more"
        type="button"
        title=${this._t('action.more_info')}
        aria-label=${labelFor(this._t('action.more_info'))}
        @click=${(event: Event) => this._handleMoreInfo(event, entityId)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
  }

  private _renderCoverActions(state: any) {
    const value = String(state?.state || '').toLowerCase();
    const unavailable = this._isUnavailable(state);
    const canOpen = this._coverSupportsFeature(state, 1);
    const canClose = this._coverSupportsFeature(state, 2);
    const canStop = this._coverSupportsFeature(state, 8);
    const name = this._entityDisplayName(state);
    const labelFor = (action: string) => this._t('action.entity_action', { action, name });

    return html`
      <div class="domain-cover-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${canOpen ? html`
          <button
            class="domain-entity-action domain-cover-action ${value === 'opening' ? 'active' : ''}"
            type="button"
            title=${this._t('action.open')}
            aria-label=${labelFor(this._t('action.open'))}
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleCoverAction(event, state, 'open')}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        ` : nothing}
        ${canStop ? html`
          <button
            class="domain-entity-action domain-cover-action ${value === 'opening' || value === 'closing' ? 'active' : ''}"
            type="button"
            title=${this._t('action.stop')}
            aria-label=${labelFor(this._t('action.stop'))}
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleCoverAction(event, state, 'stop')}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        ` : nothing}
        ${canClose ? html`
          <button
            class="domain-entity-action domain-cover-action ${value === 'closing' ? 'active' : ''}"
            type="button"
            title=${this._t('action.close')}
            aria-label=${labelFor(this._t('action.close'))}
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleCoverAction(event, state, 'close')}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private async _runBulkDomainAction(entityIds: string[], action: BulkDomainAction, label: string): Promise<void> {
    const count = entityIds.length;
    const confirmed = await showConfirmDialog(this, {
      hass: this.hass,
      title: this._t('action.confirm_bulk', {
        action: label,
        entities: this._tp('common.entity', count),
      }),
      confirmLabel: label,
      destructive: isDestructiveBulkAction(action),
      // Render inside the modal so the confirmation stays reachable.
      container: this.renderRoot.querySelector('ha-dialog') || undefined,
    });

    if (!confirmed) return;
    await this._executeBulkAction(entityIds, action);
  }

  private async _executeBulkAction(entityIds: string[], action: BulkDomainAction): Promise<void> {
    const domain = this._params?.domain || '';
    const optimisticState = action === 'turn_on'
      ? 'on'
      : action === 'turn_off'
        ? 'off'
        : action === 'open_cover'
          ? 'open'
          : action === 'close_cover'
            ? 'closed'
            : action === 'unlock'
              ? 'unlocked'
              : action === 'lock'
                ? 'locked'
                : undefined;
    if (optimisticState) this._setOptimisticEntityStates(entityIds, optimisticState);

    try {
      if (TOGGLE_DOMAINS.has(domain)) {
        await this.hass.callService(domain, action, { entity_id: entityIds });
        return;
      }

      if (domain === 'cover') {
        await this.hass.callService('cover', action, { entity_id: entityIds });
        return;
      }

      if (domain === 'lock') {
        await this.hass.callService('lock', action, { entity_id: entityIds });
      }
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to run ${action} for ${domain}:`, err);
      this._showToast(this._t('entity.group_failed'));
    }
  }

  /**
   * Tap and hold of an entity card. With "tap turns on or off" a tap toggles
   * the entity and holding opens the details; otherwise a tap opens the details.
   */
  private _tileTapOptions(entityId: string, tapToggles: boolean) {
    const showMoreInfo = () => this._showMoreInfo(entityId);
    if (!tapToggles) return { tap: showMoreInfo };
    return { tap: () => void this._tapToggleEntity(entityId), hold: showMoreInfo };
  }

  /** Toggle from a tap on the card. An entity that can not switch opens its details. */
  private async _tapToggleEntity(entityId: string): Promise<void> {
    const rawState = this.hass?.states[entityId];
    if (!rawState) return;
    const state = this._getEffectiveEntityState(rawState);
    if (this._isUnavailable(state)) {
      this._showMoreInfo(entityId);
      return;
    }
    await this._toggleEntity(state, entityId.split('.')[0] || '');
  }

  private async _handleEntityToggle(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    await this._toggleEntity(state, domain);
  }

  private async _toggleEntity(state: any, domain: string): Promise<void> {
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        const turnOn = !this._isEntityActiveForUi(state, domain);
        this._setOptimisticEntityStates([entityId], turnOn ? 'on' : 'off');
        await this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', { entity_id: entityId });
        return;
      }
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle entity ${entityId}:`, err);
      this._showToast(this._t('entity.update_failed'));
      return;
    }

    this._showMoreInfo(entityId);
  }

  private async _handleCoverAction(event: Event, state: any, action: 'open' | 'stop' | 'close'): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    const service = action === 'open' ? 'open_cover' : action === 'close' ? 'close_cover' : 'stop_cover';
    const optimisticState = action === 'open' ? 'open' : action === 'close' ? 'closed' : undefined;
    if (optimisticState) this._setOptimisticEntityStates([entityId], optimisticState);

    try {
      await this.hass.callService('cover', service, { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to ${action} cover ${entityId}:`, err);
      this._showToast(this._t('entity.cover_failed'));
    }
  }

  private async _handleLockAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      const unlocked = this._isEntityActiveForUi(state, 'lock');
      this._setOptimisticEntityStates([entityId], unlocked ? 'locked' : 'unlocked');
      await this.hass.callService('lock', unlocked ? 'lock' : 'unlock', { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle lock ${entityId}:`, err);
      this._showToast(this._t('entity.lock_failed'));
    }
  }

  private _entityDisplayName(state: any): string {
    const entityId = String(state?.entity_id || '');
    return state?.attributes?.friendly_name || getEntityRegistry(this.hass)[entityId]?.name || entityId;
  }

  // Show a short message in Home Assistant's own snackbar.
  private _showToast(message: string): void {
    fireEvent(this, 'hass-notification', { message });
  }

  private _handleMoreInfo(event: Event, entityId?: string): void {
    event.stopPropagation();
    if (entityId) this._showMoreInfo(entityId);
  }

  private _showMoreInfo(entityId: string): void {
    const homeAssistant = document.querySelector('home-assistant');
    if (homeAssistant) {
      fireEvent(homeAssistant, 'hass-more-info', { entityId });
      return;
    }

    fireEvent(window, 'hass-more-info', { entityId });
  }

  private _entityActionKind(domain: string): 'toggle' | 'cover' | 'lock' | 'more' {
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return 'toggle';
    if (domain === 'cover') return 'cover';
    if (domain === 'lock') return 'lock';
    return 'more';
  }

  private _coverSupportsFeature(state: any, feature: number): boolean {
    const supported = Number(state?.attributes?.supported_features);
    if (!Number.isFinite(supported) || supported <= 0) {
      return feature === 1 || feature === 2;
    }

    return (supported & feature) !== 0;
  }

  private _entityStatusText(state: any, domain: string): string {
    if (!state) return '';
    const effectiveState = this._getEffectiveEntityState(state);
    const formatted = formatEntityStateWithUnit(this.hass, effectiveState);

    if (domain === 'light' && effectiveState.state === 'on' && typeof effectiveState.attributes?.brightness === 'number') {
      return this._t('entity.brightness', {
        value: Math.round((effectiveState.attributes.brightness / 255) * 100),
      });
    }

    if (domain === 'cover' && typeof effectiveState.attributes?.current_position === 'number') {
      return `${formatted} · ${formatValueWithUnit(effectiveState.attributes.current_position, '%')}`;
    }

    if (domain === 'climate') {
      const current = effectiveState.attributes?.current_temperature;
      const target = effectiveState.attributes?.temperature;
      const unit = this.hass?.config?.unit_system?.temperature || '°C';
      if (current !== undefined && target !== undefined) {
        return `${formatValueWithUnit(current, unit)} · ${this._t('entity.climate_set', { value: formatValueWithUnit(target, unit) })}`;
      }
      if (current !== undefined) return formatValueWithUnit(current, unit);
    }

    if (domain === 'media_player' && effectiveState.attributes?.media_title) {
      return `${formatted} · ${effectiveState.attributes.media_title}`;
    }

    return formatted;
  }

  private _getEffectiveEntityState<T extends { entity_id?: string; state?: string } | null | undefined>(state: T): T {
    const entityId = state?.entity_id;
    if (!entityId) return state;

    const optimistic = this._optimisticEntityStates[entityId];
    if (!optimistic || optimistic.expiresAt <= Date.now()) return state;

    const actualState = String(state?.state || '').toLowerCase();
    if (actualState === optimistic.state.toLowerCase()) return state;

    return {
      ...(state as NonNullable<T>),
      state: optimistic.state,
    } as T;
  }

  private _setOptimisticEntityStates(entityIds: string[], state: string): void {
    const uniqueEntityIds = [...new Set(entityIds.filter(Boolean))];
    if (!uniqueEntityIds.length) return;

    const expiresAt = Date.now() + OPTIMISTIC_ENTITY_STATE_TTL;
    const next = { ...this._optimisticEntityStates };
    uniqueEntityIds.forEach(entityId => {
      next[entityId] = { state, expiresAt };
    });
    this._optimisticEntityStates = next;
    this._scheduleOptimisticCleanup();
  }

  private _clearOptimisticEntityStates(entityIds: string[]): void {
    const uniqueEntityIds = [...new Set(entityIds.filter(Boolean))];
    if (!uniqueEntityIds.length) return;

    const next = { ...this._optimisticEntityStates };
    let changed = false;
    uniqueEntityIds.forEach(entityId => {
      if (next[entityId]) {
        delete next[entityId];
        changed = true;
      }
    });

    if (changed) this._optimisticEntityStates = next;
  }

  private _reconcileOptimisticEntityStates(): void {
    const entries = Object.entries(this._optimisticEntityStates);
    if (!entries.length) return;

    const now = Date.now();
    const next = { ...this._optimisticEntityStates };
    let changed = false;

    entries.forEach(([entityId, optimistic]) => {
      const actual = this.hass?.states?.[entityId]?.state;
      if (
        !actual ||
        optimistic.expiresAt <= now ||
        String(actual).toLowerCase() === optimistic.state.toLowerCase()
      ) {
        delete next[entityId];
        changed = true;
      }
    });

    if (changed) this._optimisticEntityStates = next;
  }

  private _scheduleOptimisticCleanup(): void {
    if (this._optimisticCleanupTimer !== undefined) return;

    const expiries = Object.values(this._optimisticEntityStates).map(entry => entry.expiresAt);
    if (!expiries.length) return;

    const nextExpiry = Math.min(...expiries);
    if (!Number.isFinite(nextExpiry)) return;

    const delay = Math.max(80, nextExpiry - Date.now() + 50);
    this._optimisticCleanupTimer = window.setTimeout(() => {
      this._optimisticCleanupTimer = undefined;
      this._reconcileOptimisticEntityStates();
      if (Object.keys(this._optimisticEntityStates).length) {
        this._scheduleOptimisticCleanup();
      }
    }, delay);
  }

  private _isUnavailable(state: any): boolean {
    return ['unavailable', 'unknown'].includes(String(state?.state || '').toLowerCase());
  }

  private _isEntityActiveForUi(state: any, domain: string): boolean {
    if (!state || this._isUnavailable(state)) return false;

    const value = String(state.state).toLowerCase();
    if (domain === 'cover') return ['open', 'opening'].includes(value);
    if (domain === 'lock') return value === 'unlocked';
    if (domain === 'climate') {
      const action = state.attributes?.hvac_action;
      return action && action !== 'idle' && action !== 'off';
    }
    if (domain === 'media_player') return ['playing', 'buffering'].includes(value);
    if (domain === 'vacuum') return ['cleaning', 'returning'].includes(value);
    if (domain === 'alarm_control_panel') return value.startsWith('armed') || ['arming', 'pending', 'triggered'].includes(value);
    if (domain === 'camera') return false;
    return !['off', 'closed', 'locked', 'not_home', 'idle'].includes(value);
  }

  private _entityColor(domain: string, deviceClass?: string): string {
    return getDomainColor(domain, deviceClass);
  }

  private _entityAreaName(entity: EntityConfig): string | undefined {
    const config = this._params?.config;
    const areaId = entity.area_id || resolveStatusEntityAreaId(this.hass, config, entity.entity_id);
    return areaId ? getAreaConfigMap(config).get(areaId)?.name : undefined;
  }

  private _getLocalizedDomainTitle(domain: string): string {
    return getDomainName(this.hass, domain);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-domain-entities-dialog': DwainsDomainEntitiesDialog;
  }
}
