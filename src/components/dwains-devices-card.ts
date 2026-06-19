import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import type {
  DwainsDashboardConfig,
  AreaConfig,
  DeviceAdmission,
  EntityConfig,
} from '../types/strategy';
import { ddLocalize } from '../utils/localize';
import { sortAreas } from '../utils/area-entities';
import { getDomainIcon, getDeviceClassIcon } from '../utils/icons';
import { getDomainName, getDeviceClassName } from '../utils/domain-names';
import { resolveEntityCardConfig } from '../utils/blueprint-replacements';
import {
  NEW_DEVICE_WINDOW_HOURS,
  buildRecentDeviceSummaries,
  deviceAdmission,
  ensureDeviceFirstSeenTracking,
  filterHiddenDeviceEntities,
  hiddenDeviceIds,
  shouldShowRecentDevicesPanel,
  type RecentDeviceSummary,
} from '../utils/device-admission';
import { ensureBottomNav } from './dwains-bottom-nav';
import './utils/dd-card-host';

const NEW_DEVICES_KEY = '__new_devices__';

/**
 * dwains-devices-card — herbouwt de "Devices"-pagina uit Dwains Dashboard 3.x.
 *
 * Layout, identiek aan de Home/area-weergave:
 *  - LINKS  een verticale lijst met device-types (domeinen).
 *  - RECHTS alle entiteiten van het gekozen device-type, gegroepeerd per area
 *           (area-koptekst + grid met kaarten via dd-card-host).
 *
 * De databouw, filtering (verborgen entiteiten/areas, diagnostic/config) en
 * styling volgen exact de patronen van dwains-layout-card zodat het er identiek
 * uitziet en aanvoelt.
 */
@customElement('dwains-devices-card')
export class DwainsDevicesCard extends LitElement {
  private _hass: any;
  private config?: DwainsDashboardConfig;

  @state() private _selectedDomain: string | null = null;
  @state() private _isMobile = false;
  @state() private _mobileNavOpen = false;

  private _resizeHandler = () => this._checkMobile();

  // hass-setter zoals dwains-page-card: werk child dd-card-host-elementen bij
  // i.p.v. een volledige re-render te forceren.
  set hass(hass: any) {
    this._hass = hass;
    ensureBottomNav(hass);
    const hosts = this.renderRoot?.querySelectorAll('dd-card-host');
    if (hosts) hosts.forEach((host: any) => (host.hass = hass));
  }
  get hass() {
    return this._hass;
  }

  setConfig(config: any) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    // Bewaar exact dezelfde velden als de layout-card binnenkrijgt.
    this.config = {
      areas: config.areas,
      devices: config.devices,
      entities: config.entities,
      floors: config.floors,
      areas_display: config.areas_display,
      areas_options: config.areas_options,
      settings: config.settings,
      blueprint_replacements: config.blueprint_replacements,
      device_admission: config.device_admission,
    };

    // Herstel evt. het device-type uit de URL (?dd_device=...).
    if (!this._selectedDomain) {
      const urlDomain = this._getUrlDomain();
      const data = this._buildData();
      if (urlDomain === NEW_DEVICES_KEY) {
        this._selectedDomain = NEW_DEVICES_KEY;
      } else if (urlDomain && data.has(urlDomain)) {
        this._selectedDomain = urlDomain;
      } else {
        const domains = this._sortedDomains(data);
        this._selectedDomain = domains[0] ?? null;
      }
    }
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    window.addEventListener('resize', this._resizeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
  }

  private _checkMobile() {
    const wasMobile = this._isMobile;
    this._isMobile = window.innerWidth <= 768;
    if (wasMobile !== this._isMobile) {
      this._mobileNavOpen = false;
    }
  }

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this._hass, key, vars);

  // ---- URL-persistentie (?dd_device=<domain>) ------------------------------

  private _getUrlDomain(): string | null {
    try {
      return new URL(window.location.href).searchParams.get('dd_device');
    } catch {
      return null;
    }
  }

  private _updateUrlDomain(domain: string | null) {
    try {
      const url = new URL(window.location.href);
      if (domain) url.searchParams.set('dd_device', domain);
      else url.searchParams.delete('dd_device');
      window.history.replaceState(window.history.state, '', url.toString());
    } catch {
      /* negeer */
    }
  }

  // ---- Databouw + filtering -------------------------------------------------

  // Replica van layout-card._getAreaEntities (zonder cache): verzamelt de
  // entiteiten van een area op basis van entity.area_id of het area_id van het
  // bijbehorende device, en slaat hidden/diagnostic/config over.
  private _getAreaEntities(areaId: string): EntityConfig[] {
    const entities: EntityConfig[] = [];
    const processedEntities = new Set<string>();

    if (this.config?.entities) {
      const areaDevices = new Set<string>();
      if (this.config.devices) {
        this.config.devices.forEach((device) => {
          if (device.area_id === areaId) {
            areaDevices.add(device.device_id);
          }
        });
      }

      this.config.entities.forEach((entity) => {
        if (
          entity.area_id === areaId ||
          (entity.device_id && areaDevices.has(entity.device_id))
        ) {
          const registry = this._hass.entities?.[entity.entity_id];
          if (
            registry?.hidden_by ||
            registry?.entity_category === 'diagnostic' ||
            registry?.entity_category === 'config'
          ) {
            return;
          }
          entities.push(entity);
          processedEntities.add(entity.entity_id);
        }
      });
    }

    // Entiteiten uit hass die nog niet in config zitten.
    Object.values(this._hass.states).forEach((state: any) => {
      if (
        !processedEntities.has(state.entity_id) &&
        state.attributes?.area_id === areaId
      ) {
        const registry = this._hass.entities?.[state.entity_id];
        if (
          registry?.hidden_by ||
          registry?.entity_category === 'diagnostic' ||
          registry?.entity_category === 'config'
        ) {
          return;
        }
        entities.push({
          entity_id: state.entity_id,
          area_id: areaId,
          hidden: false,
        });
      }
    });

    return entities;
  }

  // Replica van layout-card._getFilteredAreaEntities.
  private _getFilteredAreaEntities(areaId: string): EntityConfig[] {
    let filteredEntities = this._getAreaEntities(areaId);

    // Respecteer HA entity-registry zichtbaarheid en categorieën.
    filteredEntities = filteredEntities.filter((entity) => {
      const registry = this._hass.entities?.[entity.entity_id];
      return !(
        registry?.hidden_by ||
        registry?.entity_category === 'diagnostic' ||
        registry?.entity_category === 'config'
      );
    });

    // Verborgen entiteiten via areas_options[areaId].groups_options[*].hidden.
    if (this.config?.areas_options) {
      const areaOptions = this.config.areas_options[areaId];
      if (areaOptions?.groups_options) {
        const hiddenEntityIds = new Set<string>();
        for (const groupOptions of Object.values(areaOptions.groups_options)) {
          if (groupOptions.hidden) {
            groupOptions.hidden.forEach((entityId) =>
              hiddenEntityIds.add(entityId)
            );
          }
        }
        filteredEntities = filteredEntities.filter(
          (entity) => !hiddenEntityIds.has(entity.entity_id)
        );
      }
    }

    // Verberg onbeschikbare/onbekende entiteiten indien geconfigureerd.
    if (this.config?.settings?.hide_unavailable_entities === true) {
      filteredEntities = filteredEntities.filter((entity) => {
        const state = this._hass.states[entity.entity_id];
        return state && state.state !== 'unavailable' && state.state !== 'unknown';
      });
    }

    filteredEntities = filterHiddenDeviceEntities(this._hass, this.config, filteredEntities);

    return filteredEntities;
  }

  private _getVisibleSortedAreas(): AreaConfig[] {
    if (!this.config?.areas) return [];
    return sortAreas(this.config.areas, this.config.areas_display);
  }

  // Bouw Map<domain, Map<areaId, { area, entities }>> over alle zichtbare,
  // gesorteerde areas en hun gefilterde entiteiten.
  private _buildData(): Map<
    string,
    Map<string, { area: AreaConfig; entities: EntityConfig[] }>
  > {
    const data = new Map<
      string,
      Map<string, { area: AreaConfig; entities: EntityConfig[] }>
    >();

    if (!this._hass) return data;

    const areas = this._getVisibleSortedAreas();
    for (const area of areas) {
      const entities = this._getFilteredAreaEntities(area.area_id);
      for (const entity of entities) {
        const typeKey = this._typeKeyFor(entity.entity_id);
        if (!typeKey) continue;

        let byArea = data.get(typeKey);
        if (!byArea) {
          byArea = new Map();
          data.set(typeKey, byArea);
        }
        let bucket = byArea.get(area.area_id);
        if (!bucket) {
          bucket = { area, entities: [] };
          byArea.set(area.area_id, bucket);
        }
        bucket.entities.push(entity);
      }
    }

    return data;
  }

  // Type-sleutel per entiteit: binary_sensors splitsen we op device-class
  // (motion → "Motion"), de rest groepeert op domein.
  private _typeKeyFor(entityId: string): string | undefined {
    const domain = entityId.split('.')[0];
    if (!domain) return undefined;
    if (domain === 'binary_sensor') {
      const dc = this._hass?.states?.[entityId]?.attributes?.device_class;
      if (dc) return `binary_sensor.${dc}`;
      return 'binary_sensor';
    }
    return domain;
  }

  // Leesbare naam voor een type-sleutel (domein of binary_sensor.<class>).
  private _typeName(key: string): string {
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassName(this._hass, key.slice('binary_sensor.'.length));
    }
    return getDomainName(this._hass, key);
  }

  // Icoon voor een type-sleutel.
  private _typeIcon(key: string): string {
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassIcon('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainIcon(key);
  }

  // Aanwezige device-types, alfabetisch gesorteerd op getDomainTitle.
  private _sortedDomains(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>
  ): string[] {
    return [...data.keys()].sort((a, b) =>
      this._typeName(a).localeCompare(this._typeName(b))
    );
  }

  private _domainCount(
    byArea: Map<string, { area: AreaConfig; entities: EntityConfig[] }>
  ): number {
    let count = 0;
    byArea.forEach((bucket) => (count += bucket.entities.length));
    return count;
  }

  private _entityCardConfig(entityId: string): any {
    return resolveEntityCardConfig({
      hass: this._hass,
      config: this.config,
      entity: entityId,
      surface: 'devices_cards',
    });
  }

  // ---- Selectie -------------------------------------------------------------

  private _selectDomain(domain: string) {
    this._selectedDomain = domain;
    this._updateUrlDomain(domain);
    this._closeMobileNav();
  }

  private _toggleMobileNav = () => {
    this._mobileNavOpen = !this._mobileNavOpen;
  };

  private _closeMobileNav = () => {
    this._mobileNavOpen = false;
  };

  // ---- Render ---------------------------------------------------------------

  render() {
    if (!this._hass || !this.config) {
      return html`<div class="loading">Loading...</div>`;
    }

    const data = this._buildData();
    const domains = this._sortedDomains(data);
    this._ensureDeviceTracking();
    const newDevices = this._newDevices();
    const hiddenCount = hiddenDeviceIds(this.config).size;
    const showNewDevicesMenu = newDevices.length > 0 || hiddenCount > 0;

    if (domains.length === 0 && !showNewDevicesMenu) {
      return html`
        <div class="layout-container">
          ${this._renderMobileOverlay()}
          <div class="main-content">
            <div class="content-area">
              <div class="device-view">
                <div class="empty">${this._t('devices.empty')}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Zorg dat er een geldige selectie is.
    if (this._selectedDomain === NEW_DEVICES_KEY) {
      if (!showNewDevicesMenu) {
        this._selectedDomain = domains[0] ?? null;
      }
    } else if (!this._selectedDomain || !data.has(this._selectedDomain)) {
      this._selectedDomain = domains[0] ?? (showNewDevicesMenu ? NEW_DEVICES_KEY : null);
    }

    return html`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar(data, domains, newDevices, showNewDevicesMenu)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain === NEW_DEVICES_KEY
              ? this._renderNewDevicesView(newDevices)
              : this._renderDeviceView(data)}
          </div>
        </div>
      </div>
      ${this._renderMobileFAB()}
    `;
  }

  private _renderMobileOverlay() {
    if (!this._isMobile) return nothing;
    return html`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen ? 'open' : ''}"
        @click=${this._closeMobileNav}
      ></div>
    `;
  }

  private _renderMobileFAB() {
    if (!this._isMobile) return nothing;
    return html`
      <button
        class="mobile-fab ${this._mobileNavOpen ? 'hidden' : ''}"
        @click=${this._toggleMobileNav}
        title=${this._t('devices.title')}
      >
        <ha-icon icon="mdi:format-list-bulleted-type"></ha-icon>
        <span class="fab-label">${this._t('devices.title')}</span>
      </button>
    `;
  }

  private _renderSidebar(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>,
    domains: string[],
    newDevices: RecentDeviceSummary[],
    showNewDevicesMenu: boolean
  ) {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen,
    };

    return html`
      <nav class=${classMap(classes)}>
        <div class="sidebar-title">${this._t('devices.title')}</div>
        <div class="area-list">
          ${showNewDevicesMenu
            ? html`
                <button
                  class="area-button new-devices ${this._selectedDomain === NEW_DEVICES_KEY ? 'selected' : ''}"
                  @click=${() => this._selectDomain(NEW_DEVICES_KEY)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:new-box"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">New devices</div>
                  </div>
                  <span class="domain-count">${newDevices.length}</span>
                </button>
              `
            : nothing}
          ${domains.map((domain) => {
            const byArea = data.get(domain)!;
            const count = this._domainCount(byArea);
            const isSelected = this._selectedDomain === domain;
            return html`
              <button
                class="area-button ${isSelected ? 'selected' : ''}"
                @click=${() => this._selectDomain(domain)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(domain)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(domain)}</div>
                </div>
                <span class="domain-count">${count}</span>
              </button>
            `;
          })}
        </div>
      </nav>
    `;
  }

  private _renderDeviceView(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>
  ) {
    const domain = this._selectedDomain;
    if (!domain) return nothing;

    const byArea = data.get(domain);
    if (!byArea) return nothing;

    // Areas in zichtbare, gesorteerde volgorde (gefilterd op aanwezigheid).
    const orderedAreas = this._getVisibleSortedAreas().filter((a) =>
      byArea.has(a.area_id)
    );

    return html`
      <div class="device-view">
        <div class="device-header">
          <ha-icon icon=${this._typeIcon(domain)}></ha-icon>
          <h1 class="device-title">${this._typeName(domain)}</h1>
        </div>

        ${orderedAreas.map((area) => {
          const bucket = byArea.get(area.area_id)!;
          return html`
            <div class="domain-group">
              <div class="domain-header">
                <ha-icon icon="mdi:floor-plan"></ha-icon>
                <span>${area.name}</span>
              </div>
              <div class="entities-grid">
                ${repeat(
                  bucket.entities,
                  (e) => e.entity_id,
                  (entity) => this._renderEntityCard(entity)
                )}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEntityCard(entity: EntityConfig) {
    const state = this._hass.states[entity.entity_id];
    if (!state) return nothing;

    return html`
      <div class="entity-card-wrapper">
        <dd-card-host
          .hass=${this._hass}
          .config=${this._entityCardConfig(entity.entity_id)}
        ></dd-card-host>
      </div>
    `;
  }

  private _renderNewDevicesView(devices: RecentDeviceSummary[]) {
    const hiddenCount = hiddenDeviceIds(this.config).size;
    return html`
      <div class="device-view">
        <section class="recent-devices new-devices-view">
          <div class="recent-header">
            <div>
              <div class="recent-title">
                <ha-icon icon="mdi:new-box"></ha-icon>
                <span>New devices</span>
                <span class="recent-count">${devices.length}</span>
              </div>
              <div class="recent-subtitle">
                Devices added to Home Assistant in the last ${NEW_DEVICE_WINDOW_HOURS} hours.
              </div>
            </div>
            ${hiddenCount
              ? html`
                  <button class="text-action" @click=${this._showAllHiddenDevices}>
                    Show ${hiddenCount} hidden
                  </button>
                `
              : nothing}
          </div>
          <div class="recent-grid">
            ${devices.length
              ? devices.map((device) => this._renderRecentDevice(device))
              : html`
                  <div class="recent-empty">
                    No devices were added to Home Assistant in the last ${NEW_DEVICE_WINDOW_HOURS} hours.
                  </div>
                `}
          </div>
        </section>
      </div>
    `;
  }

  private _newDevices(limit = 999): RecentDeviceSummary[] {
    if (!this._hass || !shouldShowRecentDevicesPanel(this.config)) return [];
    return buildRecentDeviceSummaries(this._hass, this.config, limit);
  }

  private _ensureDeviceTracking(): void {
    const nextAdmission = ensureDeviceFirstSeenTracking(this._hass, this.config);
    if (!nextAdmission) return;
    this.config = {
      ...this.config,
      device_admission: nextAdmission,
    };
    void this._saveDeviceAdmission(nextAdmission, true);
  }

  private _renderRecentDevice(summary: RecentDeviceSummary) {
    const area = summary.areaName || 'No area';
    return html`
      <div class="recent-device ${summary.hidden ? 'is-hidden' : ''}">
        <div class="recent-device-main">
          <div class="recent-device-icon">
            <ha-icon icon=${summary.hidden ? 'mdi:eye-off-outline' : 'mdi:devices'}></ha-icon>
          </div>
          <div class="recent-device-copy">
            <div class="recent-device-name">${summary.device.name}</div>
            <div class="recent-device-meta">
              <span>${area}</span>
              <span>${summary.entityCount} entities</span>
              <span>${this._formatAddedAge(summary.createdAtMs)}</span>
            </div>
            <div class="recent-domains">
              ${summary.domains.slice(0, 4).map((domain) => html`
                <span>${getDomainName(this._hass, domain)}</span>
              `)}
            </div>
          </div>
        </div>
        <button
          class=${summary.hidden ? 'device-action show' : 'device-action'}
          @click=${() =>
            summary.hidden
              ? this._showDeviceInDD(summary.device.device_id)
              : this._hideDeviceInDD(summary.device.device_id)}
        >
          <ha-icon icon=${summary.hidden ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
          <span>${summary.hidden ? 'Show in DD' : 'Hide in DD'}</span>
        </button>
      </div>
    `;
  }

  private _getDashboardUrlPath(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    if (!seg || seg === 'lovelace') return undefined;
    return seg;
  }

  private _formatAddedAge(createdAtMs: number): string {
    const diffMs = Math.max(0, Date.now() - createdAtMs);
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    if (hours < 1) return 'Added just now';
    if (hours < 24) return `Added ${hours}h ago`;
    return `Added ${Math.floor(hours / 24)}d ago`;
  }

  private _hideDeviceInDD(deviceId: string): void {
    const hidden = new Set(deviceAdmission(this.config).hidden_devices || []);
    hidden.add(deviceId);
    void this._saveDeviceAdmission({ ...deviceAdmission(this.config), hidden_devices: Array.from(hidden) });
  }

  private _showDeviceInDD(deviceId: string): void {
    const hidden = new Set(deviceAdmission(this.config).hidden_devices || []);
    hidden.delete(deviceId);
    void this._saveDeviceAdmission({ ...deviceAdmission(this.config), hidden_devices: Array.from(hidden) });
  }

  private _showAllHiddenDevices = (): void => {
    void this._saveDeviceAdmission({ ...deviceAdmission(this.config), hidden_devices: [] });
  };

  private async _saveDeviceAdmission(nextAdmission: DeviceAdmission, silent = false): Promise<void> {
    this.config = {
      ...this.config,
      device_admission: nextAdmission,
    };
    this.requestUpdate();

    try {
      const urlPath = this._getDashboardUrlPath();
      const base = urlPath ? { url_path: urlPath } : {};
      const lovelaceConfig: any = await this._hass.callWS({ type: 'lovelace/config', ...base });
      const strat = lovelaceConfig?.strategy || {};
      await this._hass.callWS({
        type: 'lovelace/config/save',
        ...base,
        config: {
          ...lovelaceConfig,
          strategy: {
            ...strat,
            device_admission: nextAdmission,
          },
        },
      });
    } catch (e) {
      console.error('❌ Device visibility save failed:', e);
      if (!silent) {
        alert(`Could not save device visibility:\n${String(e)}`);
      }
    }
  }

  static override styles = css`
    :host {
      display: block;
    }

    .loading,
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    /* Layout Container */
    .layout-container {
      display: flex;
      height: 100vh;
      position: relative;
    }

    /* Sidebar */
    .sidebar {
      width: 250px;
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 1;
      overflow-y: auto;
    }

    .sidebar-title {
      padding: 16px 16px 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .area-list {
      padding: 8px;
    }

    .area-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-button.new-devices {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: 1px solid rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }

    .area-button.new-devices.selected {
      border-color: transparent;
    }

    .area-button.new-devices .area-icon {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .area-button.new-devices.selected .area-icon {
      color: var(--text-primary-color);
    }

    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .area-info {
      flex: 1;
      min-width: 0;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .domain-count {
      flex-shrink: 0;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .area-button.selected .domain-count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
      }
    }

    .device-view {
      max-width: 1600px;
      margin: 0 auto;
    }

    .device-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .device-header ha-icon {
      --mdc-icon-size: 28px;
      color: var(--primary-color);
    }

    .device-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .recent-devices {
      margin-bottom: 18px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
    }

    .new-devices-view {
      margin-bottom: 0;
    }

    .recent-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    .recent-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
    }

    .recent-title ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .recent-count {
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
      font-size: 12px;
      font-weight: 700;
    }

    .recent-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.4;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 8px;
    }

    .recent-empty {
      grid-column: 1 / -1;
      padding: 24px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      color: var(--secondary-text-color);
      text-align: center;
      background: var(--primary-background-color);
      font-size: 13px;
    }

    .recent-device {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--primary-background-color);
    }

    .recent-device.is-hidden {
      opacity: 0.72;
    }

    .recent-device-main {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      min-width: 0;
    }

    .recent-device-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }

    .recent-device-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .recent-device-copy {
      min-width: 0;
    }

    .recent-device-name {
      font-weight: 650;
      font-size: 14px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .recent-device-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .recent-domains {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 7px;
    }

    .recent-domains span {
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
    }

    .device-action,
    .text-action {
      border: 0;
      border-radius: 999px;
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .device-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 11px;
      background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
      color: var(--warning-color, #f57c00);
    }

    .device-action.show {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
    }

    .device-action ha-icon {
      --mdc-icon-size: 16px;
    }

    .text-action {
      padding: 8px 10px;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }

    /* Domain (per area) groups */
    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 280px;
        height: 100%;
        transform: translateX(100%);
        z-index: 100;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .mobile-fab {
        position: fixed;
        bottom: calc(84px + env(safe-area-inset-bottom, 0px));
        right: 24px;
        height: 56px;
        padding: 0 20px 0 16px;
        border-radius: 28px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 98;
        transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      }

      .mobile-fab:hover {
        background: var(--primary-color);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .mobile-fab:active {
        transform: scale(0.96);
      }

      .mobile-fab.hidden {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.8);
      }

      .mobile-fab ha-icon {
        --mdc-icon-size: 24px;
      }

      .mobile-fab .fab-label {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }

      .recent-header,
      .recent-device {
        align-items: stretch;
        grid-template-columns: 1fr;
      }

      .recent-header {
        flex-direction: column;
      }

      .device-action {
        justify-content: center;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-devices-card': DwainsDevicesCard;
  }
}
