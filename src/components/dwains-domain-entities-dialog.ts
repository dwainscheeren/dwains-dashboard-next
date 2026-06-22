import { mdiClose } from "@mdi/js";
import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { fireEvent } from './utils/fire-event';

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
}

interface GroupedEntities {
  [areaId: string]: {
    areaName: string;
    entities: EntityConfig[];
  };
}

type BulkDomainAction = 'turn_on' | 'turn_off' | 'open_cover' | 'close_cover' | 'lock' | 'unlock';

@customElement('dwains-domain-entities-dialog')
export class DwainsDomainEntitiesDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _params?: DomainEntitiesDialogParams;
  @state() private _groupedEntities: GroupedEntities = {};
  @state() private _loading = true;

  private _entityCards = new Map<string, HTMLElement>();
  private _updateInterval?: number;
  private _mobileSheetAnimated = false;

  static override styles = css`
    :host {
      --mdc-dialog-min-width: 90vw;
      --mdc-dialog-max-width: 1200px;
      --mdc-dialog-max-height: 90vh;
      --mdc-dialog-z-index: 10;
      --dialog-backdrop-opacity: 0.4;
      -webkit-tap-highlight-color: transparent;
    }

    ha-dialog {
      --mdc-dialog-heading-ink-color: var(--primary-text-color);
      --mdc-dialog-content-ink-color: var(--primary-text-color);
      --dialog-content-padding: 0;
      --ha-dialog-scrim-backdrop-filter: brightness(72%) blur(2px);
      --mdc-dialog-scrim-color: rgba(0, 0, 0, 0.28);
    }

    ha-dialog-header {
      --mdc-typography-headline6-font-size: 20px;
      --mdc-typography-headline6-font-weight: 500;
    }

    .sheet-handle {
      display: none;
    }

    .content {
      padding: 16px 18px 22px !important;
      overflow: auto;
      max-height: calc(90vh - 120px);
      background: var(--primary-background-color);
    }

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

    /* Responsive design */
    @media (max-width: 600px) {
      :host {
        --mdc-dialog-min-width: min(calc(100vw - 4px), 480px);
        --mdc-dialog-max-width: min(calc(100vw - 4px), 480px);
        --mdc-dialog-min-height: calc(100dvh - 54px);
        --mdc-dialog-max-height: calc(100dvh - 54px);
        --ha-dialog-min-height: calc(100dvh - 54px);
        --ha-dialog-max-height: calc(100dvh - 54px);
        --vertical-align-dialog: flex-end;
        --dialog-surface-margin-top: 54px;
        --dialog-container-padding: 0;
        --ha-dialog-scrim-backdrop-filter: brightness(66%) blur(2px);
        --mdc-dialog-scrim-color: rgba(0, 0, 0, 0.34);
      }

      ha-dialog {
        margin: 0 !important;
        border-radius: 24px 24px 0 0 !important;
        --mdc-dialog-container-elevation: 0 18px 50px rgba(15, 23, 42, 0.28);
        --ha-dialog-border-radius: 24px 24px 0 0;
        --ha-dialog-show-duration: 1ms;
        --show-duration: 1ms;
        --ha-dialog-hide-duration: 160ms;
        --hide-duration: 160ms;
      }

      ha-dialog .mdc-dialog__surface {
        border-radius: 24px 24px 0 0 !important;
        overflow: hidden;
      }

      ha-dialog-header {
        position: relative;
        padding-top: 22px;
      }

      .sheet-handle {
        display: block;
        position: absolute;
        top: 8px;
        left: 50%;
        width: 38px;
        height: 4px;
        border-radius: 999px;
        transform: translateX(-50%);
        background: color-mix(in srgb, var(--secondary-text-color) 24%, transparent);
      }

      .content {
        max-height: calc(100dvh - 148px);
        padding: 12px 12px calc(84px + env(safe-area-inset-bottom, 0px)) !important;
      }

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
  `;

  public async showDialog(params: DomainEntitiesDialogParams): Promise<void> {
    this._params = params;
    this._loading = true;
    this._mobileSheetAnimated = false;
    await this._loadEntities();
  }

  public closeDialog(): void {
    this._params = undefined;
    this._groupedEntities = {};
    this._entityCards.clear();
    this._mobileSheetAnimated = false;
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = undefined;
    }
    fireEvent(this, 'dialog-closed', { dialog: this.localName });
  }

  protected override updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && this._params && !this._loading) {
      this._updateEntityCards();
    }

    this._animateMobileSheetIn();
  }

  private _animateMobileSheetIn(): void {
    if (
      this._mobileSheetAnimated ||
      !this._params ||
      typeof window === 'undefined' ||
      !window.matchMedia('(max-width: 600px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    requestAnimationFrame(() => {
      const haDialog = this.renderRoot.querySelector('ha-dialog') as HTMLElement | null;
      const haDialogRoot = haDialog?.shadowRoot;
      const waDialog = haDialogRoot?.querySelector('wa-dialog') as HTMLElement | null;
      const waDialogRoot = waDialog?.shadowRoot;
      const panel = (
        waDialogRoot?.querySelector('[part~="panel"]') ||
        waDialogRoot?.querySelector('dialog') ||
        haDialogRoot?.querySelector('.mdc-dialog__surface') ||
        haDialogRoot?.querySelector('[part~="surface"]')
      ) as HTMLElement | null;

      if (!panel?.animate) return;

      this._mobileSheetAnimated = true;

      panel.animate(
        [
          { transform: 'translate3d(0, 100%, 0)', opacity: 0.98 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ],
        {
          duration: 280,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        }
      );
    });
  }

  private async _loadEntities(): Promise<void> {
    if (!this._params || !this.hass) return;

    const { domain, areaId, config, filterByUnitOfMeasurement, deviceClass, entityIds } = this._params;
    const grouped: GroupedEntities = {};
    const entityIdFilter = entityIds?.length ? new Set(entityIds) : undefined;

    // Get all areas
    const areas = config.areas || [];
    const areasMap = new Map(areas.map(area => [area.area_id, area]));

    // Get all Home Assistant entities instead of just configured ones
    const allHassEntities = Object.values(this.hass.states);

    // Filter entities from all HA entities
    const entities: EntityConfig[] = [];

    allHassEntities.forEach(entityState => {
      const entityId = entityState.entity_id;
      if (entityIdFilter && !entityIdFilter.has(entityId)) return;
      const registry = this.hass.entities?.[entityId];
      if (registry?.hidden_by) return;
      const entityDomain = entityId.split('.')[0];

      // Check domain
      if (entityDomain !== domain) return;

      // Check state availability
      if (!entityState || entityState.state === 'unavailable') return;

      // Find the area of this entity (same logic as original version)
      const entityReg = config.entities?.find(e => e.entity_id === entityId);
      const deviceReg = entityReg && entityReg.device_id ?
        config.devices?.find(d => d.device_id === entityReg.device_id) : null;
      const entityAreaId = entityReg?.area_id || deviceReg?.area_id || this.hass?.entities?.[entityId]?.area_id;

      // Skip entities without area
      if (!entityAreaId) return;

      // Check area filter if specified
      if (areaId && entityAreaId !== areaId) return;

      // Check if area exists in our areas map
      if (!entityAreaId || !areasMap.has(entityAreaId)) return;

      // Check if entity is hidden
      const groupKey = entityDomain;
      const hiddenEntities = config.areas_options?.[entityAreaId]?.groups_options?.[groupKey]?.hidden || [];
      if (hiddenEntities.includes(entityId)) return;

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

      // Create EntityConfig-like object
      entities.push({
        entity_id: entityId,
        area_id: entityAreaId,
        hidden: false
      });
    });

    // Group by area (or by status for persons)
    entities.forEach(entity => {
      const entityState = this.hass!.states[entity.entity_id];

      if (domain === 'person') {
        // For persons, group by location/status instead of area
        const location = entityState?.state || 'unknown';
        const locationKey = location === 'home' ? 'home' : 'away';
            const locationName = location === 'home' ? 'Home' :
                          location === 'away' ? 'Away' :
                          location === 'not_home' ? 'Away' :
                            `${location.charAt(0).toUpperCase()}${location.slice(1)}`;

        if (!grouped[locationKey]) {
          grouped[locationKey] = {
            areaName: locationName,
            entities: []
          };
        }
        grouped[locationKey].entities.push(entity);
      } else {
        // For other domains, group by area as usual
        const areaId = entity.area_id!;
        const area = areasMap.get(areaId);
        if (!area) return;

        if (!grouped[areaId]) {
          grouped[areaId] = {
            areaName: area.name,
            entities: []
          };
        }
        grouped[areaId].entities.push(entity);
      }
    });

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
      domainTitle = 'Power Sensors';
    } else if (deviceClass) {
      // Use device class specific title
      const deviceClassTitles: Record<string, string> = {
        motion: 'Motion Sensors',
        door: 'Door Sensors',
        window: 'Window Sensors',
        smoke: 'Smoke Detectors',
        gas: 'Gas Detectors',
        moisture: 'Moisture Sensors',
        occupancy: 'Occupancy Sensors',
        opening: 'Opening Sensors',
        presence: 'Presence Sensors',
        safety: 'Safety Sensors',
        tamper: 'Tamper Sensors',
        vibration: 'Vibration Sensors'
      };
      domainTitle = deviceClassTitles[deviceClass] || `${deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1)} Sensors`;
    }

    return html`
      <ha-dialog
        open
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
            .label=${this.hass.localize("ui.common.close")}
            .path=${mdiClose}
            @click=${() => this.closeDialog()}
          ></ha-icon-button>
          <span slot="title">${domainTitle}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._loading
            ? html`<div class="loading">Loading...</div>`
            : this._renderContent()
          }
        </div>
      </ha-dialog>
    `;
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
            No active entities found
          </div>
        </div>
      `;
    }

    return html`
      ${this._renderViewAllAction()}
      ${this._renderDomainActions(entities)}
      ${repeat(
        Object.entries(this._groupedEntities),
        ([areaId]) => areaId,
        ([areaId, group]) => this._renderAreaSection(areaId, group)
      )}
    `;
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
          <span>${this._params.viewAllLabel || 'View all'}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  private _handleViewAll = (): void => {
    const action = this._params?.onViewAll;
    this.closeDialog();
    action?.();
  };

  private _renderCustomEntities() {
    const { customEntities, customDescription } = this._params!;

    if (!customEntities || customEntities.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            No problematic entities found
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
          ${actionButton('Turn on all', 'mdi:power', 'turn_on')}
          ${actionButton('Turn off all', 'mdi:power-off', 'turn_off')}
        </div>
      `;
    }

    if (domain === 'cover') {
      return html`
        <div class="domain-actions">
          ${actionButton('Open all', 'mdi:arrow-up', 'open_cover')}
          ${actionButton('Close all', 'mdi:arrow-down', 'close_cover')}
        </div>
      `;
    }

    if (domain === 'lock') {
      return html`
        <div class="domain-actions">
          ${actionButton('Unlock all', 'mdi:lock-open-variant-outline', 'unlock')}
          ${actionButton('Lock all', 'mdi:lock-outline', 'lock')}
        </div>
      `;
    }

    return nothing;
  }

  private _renderAreaSection(_areaId: string, group: { areaName: string; entities: EntityConfig[] }) {
    // Get area icon from config
    let areaIcon = '';
    if (this._params?.config?.areas) {
      const area = this._params.config.areas.find(a => a.area_id === _areaId);
      if (area?.icon) {
        areaIcon = area.icon;
      }
    }

    // Special handling for person domain
    if (this._params?.domain === 'person') {
      if (_areaId === 'home') {
        areaIcon = 'mdi:home-account';
      } else if (_areaId === 'away') {
        areaIcon = 'mdi:account-arrow-right';
      } else {
        areaIcon = 'mdi:account-question';
      }
    }

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

  private _renderEntityCard(entity: EntityConfig, fallbackMeta?: string) {
    const state = this.hass.states[entity.entity_id];
    if (!state) return nothing;

    const domain = entity.entity_id.split('.')[0] || 'unknown';
    const deviceClass = state.attributes?.device_class;
    const icon = this.hass.entities?.[entity.entity_id]?.icon ||
      state.attributes?.icon ||
      getDeviceClassIcon(domain, deviceClass) ||
      getDomainIcon(domain);
    const name = state.attributes?.friendly_name || this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
    const active = this._isEntityActiveForUi(state, domain);
    const unavailable = this._isUnavailable(state);
    const classes = [
      'domain-entity-card',
      `domain-entity-${domain}`,
      active ? 'is-active' : 'is-off',
      unavailable ? 'is-unavailable' : '',
    ].join(' ');

    return html`
      <article
        class=${classes}
        style=${`--entity-color: ${this._entityColor(domain, deviceClass)};`}
        role="button"
        tabindex="0"
        aria-label=${name}
        @click=${() => this._showMoreInfo(entity.entity_id)}
        @keydown=${(event: KeyboardEvent) => this._handleEntityKeydown(event, entity.entity_id)}
      >
        <div class="domain-entity-top">
          <div class="domain-entity-icon">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          ${this._renderEntityActions(state, domain, active)}
        </div>
        <div class="domain-entity-copy">
          <div class="domain-entity-meta">${fallbackMeta || this._entityAreaName(entity) || 'No area'}</div>
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

    if (actionKind === 'toggle') {
      return html`
        <button
          class="domain-entity-action domain-entity-toggle"
          type="button"
          title=${active ? 'Turn off' : 'Turn on'}
          aria-label=${active ? 'Turn off' : 'Turn on'}
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
          title=${unlocked ? 'Lock' : 'Unlock'}
          aria-label=${unlocked ? 'Lock' : 'Unlock'}
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
        title="More info"
        aria-label="More info"
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

    return html`
      <div class="domain-cover-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${canOpen ? html`
          <button
            class="domain-entity-action domain-cover-action ${value === 'opening' ? 'active' : ''}"
            type="button"
            title="Open"
            aria-label="Open"
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
            title="Stop"
            aria-label="Stop"
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
            title="Close"
            aria-label="Close"
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
    const domain = this._params?.domain || '';
    const count = entityIds.length;
    const confirmed = window.confirm(`${label} ${count} ${count === 1 ? 'entity' : 'entities'}?`);

    if (!confirmed) return;

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
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
      console.warn(`Failed to run ${action} for ${domain}:`, err);
    }
  }

  private _handleEntityKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private async _handleEntityToggle(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        await this.hass.callService('homeassistant', 'toggle', { entity_id: entityId });
        return;
      }
    } catch (err) {
      console.warn(`Failed to toggle entity ${entityId}:`, err);
    }

    this._showMoreInfo(entityId);
  }

  private async _handleCoverAction(event: Event, state: any, action: 'open' | 'stop' | 'close'): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    const service = action === 'open' ? 'open_cover' : action === 'close' ? 'close_cover' : 'stop_cover';

    try {
      await this.hass.callService('cover', service, { entity_id: entityId });
    } catch (err) {
      console.warn(`Failed to ${action} cover ${entityId}:`, err);
      this._showMoreInfo(entityId);
    }
  }

  private async _handleLockAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      const unlocked = this._isEntityActiveForUi(state, 'lock');
      await this.hass.callService('lock', unlocked ? 'lock' : 'unlock', { entity_id: entityId });
    } catch (err) {
      console.warn(`Failed to toggle lock ${entityId}:`, err);
      this._showMoreInfo(entityId);
    }
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
    const formatted = this.hass.formatEntityState(state);

    if (domain === 'light' && state.state === 'on' && typeof state.attributes?.brightness === 'number') {
      return `${Math.round((state.attributes.brightness / 255) * 100)}% brightness`;
    }

    if (domain === 'cover' && typeof state.attributes?.current_position === 'number') {
      return `${formatted} · ${state.attributes.current_position}%`;
    }

    if (domain === 'climate') {
      const current = state.attributes?.current_temperature;
      const target = state.attributes?.temperature;
      const unit = this.hass?.config?.unit_system?.temperature || '°C';
      if (current !== undefined && target !== undefined) return `${current}${unit} · set ${target}${unit}`;
      if (current !== undefined) return `${current}${unit}`;
    }

    if (domain === 'media_player' && state.attributes?.media_title) {
      return `${formatted} · ${state.attributes.media_title}`;
    }

    return formatted;
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
    if (domain === 'media_player') return ['playing', 'paused'].includes(value);
    return !['off', 'closed', 'locked', 'not_home', 'idle'].includes(value);
  }

  private _entityColor(domain: string, deviceClass?: string): string {
    return getDomainColor(domain, deviceClass);
  }

  private _entityAreaName(entity: EntityConfig): string | undefined {
    const config = this._params?.config;
    const entityReg = config?.entities?.find(e => e.entity_id === entity.entity_id);
    const deviceReg = entityReg?.device_id
      ? config?.devices?.find(device => device.device_id === entityReg.device_id)
      : undefined;
    const areaId = entity.area_id || entityReg?.area_id || deviceReg?.area_id || this.hass?.entities?.[entity.entity_id]?.area_id;

    return config?.areas?.find(area => area.area_id === areaId)?.name;
  }

  private _getLocalizedDomainTitle(domain: string): string {
    const titles: Record<string, string> = {
      light: 'Lights',
      switch: 'Switches',
      climate: 'Climate',
      binary_sensor: 'Sensors',
      sensor: 'Sensors',
      person: 'People',
      camera: 'Cameras',
      media_player: 'Media Players',
      cover: 'Covers',
      lock: 'Locks',
      fan: 'Fans',
      vacuum: 'Vacuums',
      alarm_control_panel: 'Alarm Systems'
    };
    return titles[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-domain-entities-dialog': DwainsDomainEntitiesDialog;
  }
}
