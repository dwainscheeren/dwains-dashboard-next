import { mdiClose } from "@mdi/js";
import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { fireEvent } from './utils/fire-event';

export interface DomainEntitiesDialogParams {
  domain: string;
  areaId?: string;
  config: DwainsDashboardConfig;
  filterByUnitOfMeasurement?: string;
  deviceClass?: string;
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

@customElement('dwains-domain-entities-dialog')
export class DwainsDomainEntitiesDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _params?: DomainEntitiesDialogParams;
  @state() private _groupedEntities: GroupedEntities = {};
  @state() private _loading = true;

  private _entityCards = new Map<string, HTMLElement>();
  private _updateInterval?: number;

  static override styles = css`
    :host {
      --mdc-dialog-min-width: 90vw;
      --mdc-dialog-max-width: 1200px;
      --mdc-dialog-max-height: 90vh;
      --mdc-dialog-z-index: 10;
      --dialog-backdrop-opacity: 0.4;
    }

    ha-dialog {
      --mdc-dialog-heading-ink-color: var(--primary-text-color);
      --mdc-dialog-content-ink-color: var(--primary-text-color);
      --dialog-content-padding: 0;
    }

    ha-dialog-header {
      --mdc-typography-headline6-font-size: 20px;
      --mdc-typography-headline6-font-weight: 500;
    }

    .content {
      padding: 0 !important;
      overflow: auto;
      max-height: calc(90vh - 120px);
    }

    .area-section {
      margin-bottom: 24px;
      background: var(--card-background-color);
      border-radius: 12px;
      overflow: hidden;
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--secondary-background-color);
      border-bottom: 1px solid var(--divider-color);
    }

    .area-header:has(.area-icon) {
      gap: 12px;
    }

    .area-header:not(:has(.area-icon)) {
      gap: 0;
    }

    .area-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--text-primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .area-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .area-name {
      font-size: 18px;
      font-weight: 500;
      flex: 1;
    }

    .entity-count {
      background: var(--primary-color);
      color: var(--text-primary-color);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
      padding: 16px;
    }

    .entity-card-wrapper {
      min-height: 60px;
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
        --mdc-dialog-min-width: 100vw;
        --mdc-dialog-max-width: 100vw;
        --mdc-dialog-min-height: 100vh;
        --mdc-dialog-max-height: 100vh;
      }

      ha-dialog {
        margin: 0 !important;
        border-radius: 0 !important;
        --mdc-dialog-container-elevation: 0;
        --ha-dialog-border-radius: 0px;
      }

      ha-dialog .mdc-dialog__surface {
        border-radius: 0 !important;
      }

      .content {
        max-height: calc(100vh - 60px);
        padding: 0 !important;
      }

      .area-section {
        margin-bottom: 16px;
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 900px) {
      .entities-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `;

  public async showDialog(params: DomainEntitiesDialogParams): Promise<void> {
    this._params = params;
    this._loading = true;
    await this._loadEntities();
  }

  public closeDialog(): void {
    this._params = undefined;
    this._groupedEntities = {};
    this._entityCards.clear();
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
  }

  private async _loadEntities(): Promise<void> {
    if (!this._params || !this.hass) return;

    const { domain, areaId, config, filterByUnitOfMeasurement, deviceClass } = this._params;
    const grouped: GroupedEntities = {};

    // Get all areas
    const areas = config.areas || [];
    const areasMap = new Map(areas.map(area => [area.area_id, area]));

    // Get all Home Assistant entities instead of just configured ones
    const allHassEntities = Object.values(this.hass.states);

    // Filter entities from all HA entities
    const entities: EntityConfig[] = [];

    allHassEntities.forEach(entityState => {
      const entityId = entityState.entity_id;
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
        // For unit filtered entities, only check if they're available
        if (entityState.state === 'unavailable') return;
      } else {
        // Apply domain-specific filters for active entities
        let shouldInclude = false;

        if (domain === 'climate') {
          shouldInclude = entityState.state !== 'off';
        } else if (domain === 'binary_sensor') {
          // Check device class filter if specified
          if (deviceClass) {
            const entityDeviceClass = entityState.attributes?.device_class;
            if (entityDeviceClass !== deviceClass) return;
          }
          shouldInclude = entityState.state === 'on';
        } else if (domain === 'light') {
          shouldInclude = entityState.state === 'on';
        } else if (domain === 'switch') {
          shouldInclude = entityState.state === 'on';
        } else if (domain === 'cover') {
          shouldInclude = entityState.state === 'open' || entityState.state === 'opening';
        } else if (domain === 'lock') {
          shouldInclude = entityState.state === 'unlocked';
        } else if (domain === 'person') {
          // For persons, show all (home and away) but not unavailable
          shouldInclude = entityState.state !== 'unavailable' && entityState.state !== 'unknown';
        } else if (domain === 'media_player') {
          shouldInclude = ['playing', 'paused'].includes(entityState.state);
        } else if (domain === 'fan') {
          shouldInclude = entityState.state === 'on';
        } else if (domain === 'vacuum') {
          shouldInclude = ['cleaning', 'returning', 'docked'].includes(entityState.state);
        } else if (domain === 'alarm_control_panel') {
          shouldInclude = entityState.state.includes('armed');
        } else {
          // For other domains, show all available entities
          shouldInclude = true;
        }

        if (!shouldInclude) return;
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

    const { domain, filterByUnitOfMeasurement } = this._params;
    let needsReload = false;

    // Check if any entities need to be added or removed
    Object.entries(this._groupedEntities).forEach(([_areaId, group]) => {
      group.entities.forEach(entity => {
        const state = this.hass!.states[entity.entity_id];
        if (!state) {
          needsReload = true;
          return;
        }

        const shouldBeVisible = this._shouldEntityBeVisible(state, domain, filterByUnitOfMeasurement);
        const isCurrentlyVisible = this._entityCards.has(entity.entity_id);

        if (shouldBeVisible !== isCurrentlyVisible) {
          needsReload = true;
        }
      });
    });

    if (needsReload) {
      this._loadEntities();
    }
  }

  private _shouldEntityBeVisible(entityState: any, domain: string, filterByUnitOfMeasurement?: string): boolean {
    if (entityState.state === 'unavailable') return false;

    // Check unit_of_measurement filter if specified
    if (filterByUnitOfMeasurement) {
      if (entityState.attributes?.unit_of_measurement !== filterByUnitOfMeasurement) {
        return false;
      }
      return true;
    }

    // Apply domain-specific filters
    if (domain === 'climate') {
      return entityState.state !== 'off';
    }
    if (domain === 'binary_sensor' || domain === 'light' || domain === 'switch') {
      return entityState.state === 'on';
    }
    if (domain === 'cover') {
      return entityState.state === 'open';
    }
    if (domain === 'lock') {
      return entityState.state === 'unlocked';
    }
    if (domain === 'person') {
      // For persons, show all (home and away) but not unavailable
      return entityState.state !== 'unavailable' && entityState.state !== 'unknown';
    }
    if (domain === 'media_player') {
      return entityState.state === 'playing';
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
        .heading=${domainTitle}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="heading">
          <ha-icon-button
            slot="navigationIcon"
            dialogAction="cancel"
            .label=${this.hass.localize("ui.common.close")}
            .path=${mdiClose}
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

    const entityCount = Object.values(this._groupedEntities)
      .reduce((sum, group) => sum + group.entities.length, 0);

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
      ${repeat(
        Object.entries(this._groupedEntities),
        ([areaId]) => areaId,
        ([areaId, group]) => this._renderAreaSection(areaId, group)
      )}
    `;
  }

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
            entity => this._renderEntityCard(entity)
          )}
        </div>
      </div>
    `;
  }

  private _renderEntityCard(entity: EntityConfig) {
    const state = this.hass.states[entity.entity_id];
    if (!state) return nothing;

    return html`
      <div class="entity-card-wrapper">
        ${until(this._createEntityCard(entity), html`<div>Loading...</div>`)}
      </div>
    `;
  }

  private async _createEntityCard(entity: EntityConfig): Promise<TemplateResult> {
    const domain = entity.entity_id.split('.')[0];
    let cardType = 'tile';

    // Determine card type based on domain
    if (domain === 'climate') {
      cardType = 'thermostat';
    } else if (domain === 'camera') {
      cardType = 'picture-entity';
    } else if (domain === 'media_player') {
      cardType = 'media-control';
    }

    const cardConfig = {
      type: cardType,
      entity: entity.entity_id,
      ...(domain === 'camera' ? { camera_view: 'live' } : {})
    };

    // Wait for custom element to be defined
    const cardElement = `hui-${cardType}-card`;
    await customElements.whenDefined(cardElement);

    // Create and configure the card
    const card = document.createElement(cardElement) as any;
    card.hass = this.hass;
    card.setConfig(cardConfig);

    // Store reference for updates
    this._entityCards.set(entity.entity_id, card);

    return html`${card}`;
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