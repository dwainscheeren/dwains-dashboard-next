import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
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
import { getDomainIcon, getDeviceClassIcon, getDomainColor } from '../utils/icons';
import { getDomainName, getDeviceClassName } from '../utils/domain-names';
import { resolveEntityCardConfig } from '../utils/blueprint-replacements';
import {
  NEW_DEVICE_WINDOW_HOURS,
  buildRecentDeviceSummaries,
  ensureDeviceFirstSeenTracking,
  filterHiddenDeviceEntities,
  hiddenDeviceIds,
  shouldShowRecentDevicesPanel,
  type RecentDeviceSummary,
} from '../utils/device-admission';
import { ensureBottomNav } from './dwains-bottom-nav';
import { fireEvent } from './utils/fire-event';
import { buildHousePowerUsage, type PowerAreaSummary, type PowerEntitySummary } from '../utils/power-usage';
import './utils/dd-card-host';

const NEW_DEVICES_KEY = '__new_devices__';
const MAINTENANCE_KEY = '__maintenance__';
const MAINTENANCE_AREA_KEY = '__maintenance_no_area__';
const ENERGY_KEY = 'energy';
const LOW_BATTERY_THRESHOLD = 20;
const PERSON_DOMAIN = 'person';
const PERSON_AREA_KEY = '__people__';

interface MaintenanceItem {
  entityId: string;
  deviceId?: string;
  areaId: string;
  name: string;
  stateLabel: string;
  icon: string;
  kind: 'battery' | 'unavailable';
}

interface MaintenanceBucket {
  area: AreaConfig;
  items: MaintenanceItem[];
}

interface MaintenanceSummary {
  lowBatteryCount: number;
  unavailableDeviceCount: number;
  totalCount: number;
}

/**
 * dwains-dashboard-next-devices-card — herbouwt de "Devices"-pagina uit Dwains Dashboard 3.x.
 *
 * Layout, identiek aan de Home/area-weergave:
 *  - LINKS  een verticale lijst met device-types (domeinen).
 *  - RECHTS alle entiteiten van het gekozen device-type, gegroepeerd per area
 *           (area-koptekst + grid met kaarten via dwains-dashboard-next-card-host).
 *
 * De databouw, filtering (verborgen entiteiten/areas, diagnostic/config) en
 * styling volgen exact de patronen van dwains-dashboard-next-layout-card zodat het er identiek
 * uitziet en aanvoelt.
 */
@customElement('dwains-dashboard-next-devices-card')
export class DwainsDevicesCard extends LitElement {
  private _hass: any;
  private config?: DwainsDashboardConfig;

  @state() private _selectedDomain: string | null = null;
  @state() private _isMobile = false;
  @state() private _mobileNavOpen = false;
  private _pendingDomainSelection: string | null = null;

  private _resizeHandler = () => this._checkMobile();
  private _locationHandler = () => this._handleLocationChanged();

  // hass-setter zoals dwains-dashboard-next-page-card: werk child dwains-dashboard-next-card-host-elementen bij
  // i.p.v. een volledige re-render te forceren.
  set hass(hass: any) {
    this._hass = hass;
    ensureBottomNav(hass, this.config?.settings);
    this._syncBottomNavDeviceContext();
    const hosts = this.renderRoot?.querySelectorAll('dwains-dashboard-next-card-host');
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
    if (this._hass) ensureBottomNav(this._hass, this.config.settings);

    // Herstel evt. het device-type uit de URL (?dd_device=...).
    const urlDomain = this._getUrlDomain();
    if (urlDomain) {
      this._pendingDomainSelection = urlDomain;
    }

    if (!this._selectedDomain) {
      const data = this._buildData();
      const maintenance = this._buildMaintenanceData();
      const showMaintenanceMenu = this._maintenanceSummary(maintenance).totalCount > 0;
      const showEnergyMenu = this._showEnergyMenu();
      if (urlDomain === NEW_DEVICES_KEY) {
        this._selectedDomain = NEW_DEVICES_KEY;
      } else if (urlDomain === MAINTENANCE_KEY && showMaintenanceMenu) {
        this._selectedDomain = MAINTENANCE_KEY;
      } else if (urlDomain === ENERGY_KEY && showEnergyMenu) {
        this._selectedDomain = ENERGY_KEY;
      } else if (urlDomain && data.has(urlDomain)) {
        this._selectedDomain = urlDomain;
      } else {
        const domains = this._sortedDomains(data);
        this._selectedDomain = domains[0] ?? null;
      }
      this._syncBottomNavDeviceContext();
    }
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('dwains-dashboard-next-toggle-devices-nav', this._handleDevicesNavToggle);
    window.addEventListener('dwains-dashboard-next-select-device-domain', this._handleSelectDeviceDomain as EventListener);
    window.addEventListener('location-changed', this._locationHandler);
    window.addEventListener('popstate', this._locationHandler);
    this._handleLocationChanged();
    this._syncBottomNavDeviceContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
    window.removeEventListener('dwains-dashboard-next-toggle-devices-nav', this._handleDevicesNavToggle);
    window.removeEventListener('dwains-dashboard-next-select-device-domain', this._handleSelectDeviceDomain as EventListener);
    window.removeEventListener('location-changed', this._locationHandler);
    window.removeEventListener('popstate', this._locationHandler);
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

  private _handleLocationChanged(): void {
    const urlDomain = this._getUrlDomain();
    if (!urlDomain) return;

    this._pendingDomainSelection = urlDomain;
    this._applyPendingDomainSelection();
    this.requestUpdate();
  }

  private _handleSelectDeviceDomain = (event: CustomEvent<{ domain?: string }>) => {
    const domain = event.detail?.domain;
    if (!domain) return;

    this._pendingDomainSelection = domain;
    this._applyPendingDomainSelection();
    this.requestUpdate();
  };

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

    // Verberg onbeschikbare/onbekende entiteiten standaard in de normale devices-view.
    // De Maintenance-view blijft ze wel tonen.
    if (this.config?.settings?.hide_unavailable_entities_on_devices !== false) {
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

    this._addPersonData(data);
    this._hiddenDeviceTypes().forEach((typeKey) => data.delete(typeKey));

    return data;
  }

  private _buildMaintenanceData(): Map<string, MaintenanceBucket> {
    const buckets = new Map<string, MaintenanceBucket>();
    if (!this._hass || !this.config) return buckets;

    const hiddenDevices = hiddenDeviceIds(this.config);
    Object.values(this._hass.states).forEach((state: any) => {
      const entityId = state?.entity_id;
      if (!entityId) return;

      const registry = this._hass.entities?.[entityId];
      if (registry?.hidden_by) return;

      const deviceId = this._deviceIdForEntity(entityId, registry);
      if (deviceId && hiddenDevices.has(deviceId)) return;

      const kind = this._maintenanceKind(entityId, state);
      if (!kind) return;

      const area = this._maintenanceAreaForEntity(entityId, state, registry);
      if (!area) return;
      let bucket = buckets.get(area.area_id);
      if (!bucket) {
        bucket = { area, items: [] };
        buckets.set(area.area_id, bucket);
      }
      bucket.items.push({
        entityId,
        deviceId,
        areaId: area.area_id,
        name: state.attributes?.friendly_name || registry?.name || entityId,
        stateLabel: this._formatMaintenanceState(state, kind),
        icon: this._maintenanceIcon(entityId, state, kind),
        kind,
      });
    });

    buckets.forEach((bucket) => {
      bucket.items.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'unavailable' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    });

    return buckets;
  }

  private _maintenanceSummary(buckets: Map<string, MaintenanceBucket>): MaintenanceSummary {
    let lowBatteryCount = 0;
    const unavailableDevices = new Set<string>();
    let unavailableEntityFallbackCount = 0;

    buckets.forEach((bucket) => {
      bucket.items.forEach((item) => {
        if (item.kind === 'battery') {
          lowBatteryCount += 1;
          return;
        }
        if (item.deviceId) {
          unavailableDevices.add(item.deviceId);
        } else {
          unavailableEntityFallbackCount += 1;
        }
      });
    });

    const unavailableDeviceCount = unavailableDevices.size + unavailableEntityFallbackCount;
    return {
      lowBatteryCount,
      unavailableDeviceCount,
      totalCount: lowBatteryCount + unavailableDeviceCount,
    };
  }

  private _maintenanceSubtitle(buckets: Map<string, MaintenanceBucket>): string {
    const summary = this._maintenanceSummary(buckets);
    const parts: string[] = [];
    if (summary.lowBatteryCount) {
      parts.push(`${summary.lowBatteryCount} low ${summary.lowBatteryCount === 1 ? 'battery' : 'batteries'}`);
    }
    if (summary.unavailableDeviceCount) {
      parts.push(`${summary.unavailableDeviceCount} unavailable ${summary.unavailableDeviceCount === 1 ? 'device' : 'devices'}`);
    }
    return parts.length ? parts.join(', ') : 'Everything looks good';
  }

  private _showEnergyMenu(): boolean {
    return true;
  }

  private _energySummary() {
    return buildHousePowerUsage(this._hass, this.config);
  }

  private _maintenanceKind(entityId: string, state: any): MaintenanceItem['kind'] | undefined {
    if (state.state === 'unavailable') return 'unavailable';
    if (this._isLowBatteryEntity(entityId, state)) return 'battery';
    return undefined;
  }

  private _isLowBatteryEntity(entityId: string, state: any): boolean {
    const domain = entityId.split('.')[0];
    const deviceClass = state.attributes?.device_class;
    if (deviceClass !== 'battery') return false;

    if (domain === 'binary_sensor') {
      return state.state === 'on';
    }

    const value = Number(state.state);
    return Number.isFinite(value) && value <= LOW_BATTERY_THRESHOLD;
  }

  private _deviceIdForEntity(entityId: string, registry?: any): string | undefined {
    return registry?.device_id || this.config?.entities?.find((entity) => entity.entity_id === entityId)?.device_id;
  }

  private _maintenanceAreaForEntity(entityId: string, state: any, registry?: any): AreaConfig | undefined {
    const configEntity = this.config?.entities?.find((entity) => entity.entity_id === entityId);
    const deviceId = this._deviceIdForEntity(entityId, registry);
    const device = deviceId ? this.config?.devices?.find((item) => item.device_id === deviceId) : undefined;
    const hassDevice = deviceId ? this._hass?.devices?.[deviceId] : undefined;
    const areaId =
      registry?.area_id ||
      configEntity?.area_id ||
      state.attributes?.area_id ||
      device?.area_id ||
      hassDevice?.area_id;

    if (!areaId || (this.config?.areas_display?.hidden || []).includes(areaId)) return undefined;

    const area = areaId ? this.config?.areas?.find((item) => item.area_id === areaId) : undefined;
    if (area) return area;

    return undefined;
  }

  private _maintenanceIcon(entityId: string, state: any, kind: MaintenanceItem['kind']): string {
    if (kind === 'battery') return 'mdi:battery-alert';
    const domain = entityId.split('.')[0] || '';
    return state.attributes?.icon || getDomainIcon(domain) || 'mdi:help-box';
  }

  private _formatMaintenanceState(state: any, kind: MaintenanceItem['kind']): string {
    if (kind === 'unavailable') {
      return state.state === 'unknown' ? 'Unknown' : 'Unavailable';
    }

    const unit = state.attributes?.unit_of_measurement || '%';
    return `${state.state}${unit}`;
  }

  private _addPersonData(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>
  ): void {
    const personEntities = this._getVisiblePersonEntities();
    if (!personEntities.length) return;

    let byArea = data.get(PERSON_DOMAIN);
    if (!byArea) {
      byArea = new Map();
      data.set(PERSON_DOMAIN, byArea);
    }

    const existingPersonIds = new Set<string>();
    byArea.forEach((bucket) =>
      bucket.entities.forEach((entity) => existingPersonIds.add(entity.entity_id))
    );

    const peopleBucket = byArea.get(PERSON_AREA_KEY) ?? {
      area: {
        area_id: PERSON_AREA_KEY,
        name: getDomainName(this._hass, PERSON_DOMAIN),
        icon: 'mdi:account-group',
      },
      entities: [],
    };

    peopleBucket.entities = [
      ...peopleBucket.entities,
      ...personEntities.filter((entity) => !existingPersonIds.has(entity.entity_id)),
    ];

    if (peopleBucket.entities.length) {
      byArea.set(PERSON_AREA_KEY, peopleBucket);
    }
  }

  private _getVisiblePersonEntities(): EntityConfig[] {
    if (!this._hass || !this.config) return [];

    const hiddenPersons = new Set(this.config.settings?.hidden_persons || []);
    return Object.values(this._hass.states)
      .filter((entity: any) => {
        if (!entity.entity_id?.startsWith(`${PERSON_DOMAIN}.`)) return false;
        if (hiddenPersons.has(entity.entity_id)) return false;
        return !this._hass.entities?.[entity.entity_id]?.hidden_by;
      })
      .sort((a: any, b: any) => {
        const aName = a.attributes?.friendly_name || a.entity_id;
        const bName = b.attributes?.friendly_name || b.entity_id;
        return String(aName).localeCompare(String(bName));
      })
      .map((entity: any) => ({
        entity_id: entity.entity_id,
        area_id: PERSON_AREA_KEY,
        hidden: false,
      }));
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

  private _hiddenDeviceTypes(): Set<string> {
    return new Set(
      (this.config?.settings?.hidden_device_types || [])
        .filter((typeKey): typeKey is string => typeof typeKey === 'string' && typeKey.length > 0)
    );
  }

  // Leesbare naam voor een type-sleutel (domein of binary_sensor.<class>).
  private _typeName(key: string): string {
    if (key === MAINTENANCE_KEY) return 'Maintenance';
    if (key === ENERGY_KEY) return 'Energy';
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassName(this._hass, key.slice('binary_sensor.'.length));
    }
    return getDomainName(this._hass, key);
  }

  // Icoon voor een type-sleutel.
  private _typeIcon(key: string): string {
    if (key === MAINTENANCE_KEY) return 'mdi:wrench';
    if (key === ENERGY_KEY) return 'mdi:flash';
    if (key === PERSON_DOMAIN) return 'mdi:account-group';
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassIcon('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainIcon(key);
  }

  private _typeColor(key: string): string {
    if (key === MAINTENANCE_KEY) return 'var(--warning-color, #ff9800)';
    if (key === ENERGY_KEY) return '#d88e20';
    if (key.startsWith('binary_sensor.')) {
      return getDomainColor('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainColor(key);
  }

  private _syncBottomNavDeviceContext(): void {
    const domain = this._selectedDomain;
    window.dispatchEvent(new CustomEvent('dwains-dashboard-next-device-context-changed', {
      detail: {
        domain,
        icon: domain === NEW_DEVICES_KEY
          ? 'mdi:new-box'
          : domain === MAINTENANCE_KEY
            ? 'mdi:wrench'
          : domain === ENERGY_KEY
            ? 'mdi:flash'
          : domain
            ? this._typeIcon(domain)
            : 'mdi:format-list-bulleted-type',
        label: domain === NEW_DEVICES_KEY
          ? 'New devices'
          : domain === MAINTENANCE_KEY
            ? 'Maintenance'
          : domain === ENERGY_KEY
            ? 'Energy'
          : domain
            ? this._typeName(domain)
            : this._t('devices.title'),
      },
    }));
  }

  protected override updated(changedProps: PropertyValues): void {
    if (changedProps.has('_selectedDomain')) {
      this._syncBottomNavDeviceContext();
    }
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

  private _applyPendingDomainSelection(
    data?: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>,
    showNewDevicesMenu?: boolean,
    showMaintenanceMenu?: boolean,
    showEnergyMenu?: boolean
  ): boolean {
    if (!this._hass || !this.config) return false;

    const domain = this._pendingDomainSelection || this._getUrlDomain();
    if (!domain) return false;

    const currentData = data ?? this._buildData();
    const canShowNewDevices = showNewDevicesMenu ?? (
      shouldShowRecentDevicesPanel(this.config) &&
      this._newDevices().length > 0
    );
    const canShowMaintenance = showMaintenanceMenu ?? (
      this._maintenanceSummary(this._buildMaintenanceData()).totalCount > 0
    );
    const canShowEnergy = showEnergyMenu ?? this._showEnergyMenu();

    if (domain === NEW_DEVICES_KEY) {
      if (!canShowNewDevices) return false;
    } else if (domain === MAINTENANCE_KEY) {
      if (!canShowMaintenance) return false;
    } else if (domain === ENERGY_KEY) {
      if (!canShowEnergy) return false;
    } else if (!currentData.has(domain)) {
      return false;
    }

    this._pendingDomainSelection = null;
    if (this._selectedDomain !== domain) {
      this._selectedDomain = domain;
      this._syncBottomNavDeviceContext();
    }
    return true;
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
    this._pendingDomainSelection = null;
    this._selectedDomain = domain;
    this._updateUrlDomain(domain);
    this._syncBottomNavDeviceContext();
    this._closeMobileNav();
  }

  private _toggleMobileNav = () => {
    this._mobileNavOpen = !this._mobileNavOpen;
  };

  private _handleDevicesNavToggle = (event?: Event) => {
    if (!this._isMobile) return;
    if ((event as CustomEvent<{ open?: boolean }>)?.detail?.open) {
      this._mobileNavOpen = true;
      return;
    }
    this._toggleMobileNav();
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
    const showNewDevicesMenu = shouldShowRecentDevicesPanel(this.config) && (newDevices.length > 0 || hiddenCount > 0);
    const maintenance = this._buildMaintenanceData();
    const showMaintenanceMenu = this._maintenanceSummary(maintenance).totalCount > 0;
    const showEnergyMenu = this._showEnergyMenu();
    this._applyPendingDomainSelection(data, showNewDevicesMenu, showMaintenanceMenu, showEnergyMenu);

    if (domains.length === 0 && !showNewDevicesMenu && !showMaintenanceMenu && !showEnergyMenu) {
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
    } else if (this._selectedDomain === MAINTENANCE_KEY) {
      if (!showMaintenanceMenu) {
        this._selectedDomain = domains[0] ?? (showNewDevicesMenu ? NEW_DEVICES_KEY : null);
      }
    } else if (this._selectedDomain === ENERGY_KEY) {
      if (!showEnergyMenu) {
        this._selectedDomain = domains[0] ?? (showMaintenanceMenu ? MAINTENANCE_KEY : showNewDevicesMenu ? NEW_DEVICES_KEY : null);
      }
    } else if (!this._selectedDomain || !data.has(this._selectedDomain)) {
      this._selectedDomain = domains[0] ?? (showEnergyMenu ? ENERGY_KEY : showMaintenanceMenu ? MAINTENANCE_KEY : showNewDevicesMenu ? NEW_DEVICES_KEY : null);
    }

    return html`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar(data, domains, newDevices, showNewDevicesMenu, maintenance, showMaintenanceMenu, showEnergyMenu)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain === NEW_DEVICES_KEY
              ? this._renderNewDevicesView(newDevices)
              : this._selectedDomain === MAINTENANCE_KEY
                ? this._renderMaintenanceView(maintenance)
              : this._selectedDomain === ENERGY_KEY
                ? this._renderEnergyView()
              : this._renderDeviceView(data)}
          </div>
        </div>
      </div>
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

  private _renderSidebar(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>,
    domains: string[],
    newDevices: RecentDeviceSummary[],
    showNewDevicesMenu: boolean,
    maintenance: Map<string, MaintenanceBucket>,
    showMaintenanceMenu: boolean,
    showEnergyMenu: boolean
  ) {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen,
    };
    const energySummary = this._energySummary();

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
                    <div class="device-menu-subtitle">
                      ${newDevices.length === 1 ? '1 new device' : `${newDevices.length} new devices`}
                    </div>
                  </div>
                  <span class="domain-count">${newDevices.length}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
            : nothing}
          ${showMaintenanceMenu
            ? html`
                <button
                  class="area-button maintenance ${this._selectedDomain === MAINTENANCE_KEY ? 'selected' : ''}"
                  style=${`--domain-color: ${this._typeColor(MAINTENANCE_KEY)};`}
                  @click=${() => this._selectDomain(MAINTENANCE_KEY)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:wrench"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">Maintenance</div>
                    <div class="device-menu-subtitle">${this._maintenanceSubtitle(maintenance)}</div>
                  </div>
                  <span class="domain-count">${this._maintenanceSummary(maintenance).totalCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
            : nothing}
          ${showEnergyMenu
            ? html`
                <button
                  class="area-button energy ${this._selectedDomain === ENERGY_KEY ? 'selected' : ''}"
                  style=${`--domain-color: ${this._typeColor(ENERGY_KEY)};`}
                  @click=${() => this._selectDomain(ENERGY_KEY)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:flash"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">Energy</div>
                    <div class="device-menu-subtitle">
                      ${energySummary.sensorCount === 1
                        ? '1 live power sensor'
                        : `${energySummary.sensorCount} live power sensors`}
                    </div>
                  </div>
                  <span class="domain-count">${energySummary.sensorCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
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
                style=${`--domain-color: ${this._typeColor(domain)};`}
                @click=${() => this._selectDomain(domain)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(domain)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(domain)}</div>
                  <div class="device-menu-subtitle">${count === 1 ? '1 entity' : `${count} entities`}</div>
                </div>
                <span class="domain-count">${count}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
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
    const orderedAreas = domain === PERSON_DOMAIN
      ? [...byArea.values()].map((bucket) => bucket.area)
      : this._getVisibleSortedAreas().filter((a) => byArea.has(a.area_id));

    return html`
      <div class="device-view">
        <div class="device-header" style=${`--domain-color: ${this._typeColor(domain)};`}>
          <div class="device-title-wrap">
            <ha-icon icon=${this._typeIcon(domain)}></ha-icon>
            <h1 class="device-title">${this._typeName(domain)}</h1>
          </div>
        </div>

        ${orderedAreas.map((area) => {
          const bucket = byArea.get(area.area_id)!;
          return html`
            <div class="domain-group">
              <div class="domain-header">
                <div class="domain-header-title">
                  <ha-icon icon="mdi:floor-plan"></ha-icon>
                  <span>${area.name}</span>
                </div>
              </div>
              <div class=${this._entitiesGridClass(domain)}>
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

  private _renderEnergyView() {
    const summary = this._energySummary();
    const topArea = summary.areas[0];
    const wholeHouseStatisticsEntities = this._energyStatisticsEntities(
      summary.areas.flatMap((area) => area.entities),
      8
    );

    return html`
      <div class="device-view energy-view">
        <div class="device-header energy-header" style=${`--domain-color: ${this._typeColor(ENERGY_KEY)};`}>
          <div class="device-title-wrap">
            <ha-icon icon="mdi:flash"></ha-icon>
            <div>
              <h1 class="device-title">Energy</h1>
              <div class="energy-header-subtitle">Live power usage by area</div>
            </div>
          </div>
          <div class="energy-header-total">
            <span>${summary.formattedTotal}</span>
            <small>${summary.sensorCount === 1 ? '1 live power sensor' : `${summary.sensorCount} live power sensors`}</small>
          </div>
        </div>

        ${summary.sensorCount
          ? html`
              <div class="energy-overview-grid">
                <section class="energy-overview-card total">
                  <div class="energy-overview-head">
                    <span class="energy-overview-icon">
                      <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
                    </span>
                    <div>
                      <h2>Whole house</h2>
                      <p>${summary.sensorCount === 1 ? '1 live power sensor' : `${summary.sensorCount} live power sensors`}</p>
                    </div>
                    <strong>${summary.formattedTotal}</strong>
                  </div>
                  ${this._renderEnergyStatisticsGraph(wholeHouseStatisticsEntities, 'Whole house power history')}
                </section>

                ${topArea ? html`
                  <section class="energy-overview-card top-area">
                    <div class="energy-overview-head">
                      <span class="energy-overview-icon">
                        <ha-icon icon=${topArea.icon}></ha-icon>
                      </span>
                      <div>
                        <h2>Top area</h2>
                        <p>${topArea.name}</p>
                      </div>
                      <strong>${topArea.formattedTotal}</strong>
                    </div>
                    <div class="energy-top-entities">
                      ${topArea.entities.slice(0, 3).map((entity) => this._renderEnergyEntityMini(entity, topArea.totalWatts))}
                    </div>
                  </section>
                ` : nothing}
              </div>

              <div class="energy-areas-grid">
                ${repeat(
                  summary.areas,
                  (area) => area.areaId,
                  (area) => this._renderEnergyAreaCard(area)
                )}
              </div>
            `
          : html`
              <div class="energy-empty">
                <ha-icon icon="mdi:flash-off-outline"></ha-icon>
                <h2>No live power sensors found</h2>
                <p>Energy will appear here when Home Assistant has visible power sensors with W, kW or MW units.</p>
              </div>
            `}
      </div>
    `;
  }

  private _renderEnergyAreaCard(area: PowerAreaSummary) {
    const canNavigate = !area.areaId.startsWith('__');
    return html`
      <section class="energy-area-card">
        <header class="energy-area-head">
          <button
            class="energy-area-title"
            type="button"
            @click=${() => canNavigate ? this._navigateToArea(area.areaId) : undefined}
            ?disabled=${!canNavigate}
          >
            <span class="energy-area-icon">
              <ha-icon icon=${area.icon}></ha-icon>
            </span>
            <span>
              <strong>${area.name}</strong>
              <small>${area.entities.length === 1 ? '1 power entity' : `${area.entities.length} power entities`}</small>
            </span>
          </button>
          <div class="energy-area-total">
            <span>${area.formattedTotal}</span>
            <small>Total now</small>
          </div>
        </header>

        ${this._renderEnergyStatisticsGraph(
          this._energyStatisticsEntities(area.entities, 6),
          `${area.name} power history`
        )}

        <div class="energy-entity-list">
          ${repeat(
            area.entities,
            (entity) => entity.entityId,
            (entity) => this._renderEnergyEntityRow(entity, area.totalWatts)
          )}
        </div>
      </section>
    `;
  }

  private _renderEnergyEntityMini(entity: PowerEntitySummary, areaTotalWatts: number) {
    const percentage = this._energyEntityPercentage(entity, areaTotalWatts);
    return html`
      <button
        class="energy-entity-mini"
        type="button"
        style=${`--power-width: ${percentage}%`}
        @click=${() => this._showMoreInfo(entity.entityId)}
      >
        <span>${entity.name}</span>
        <strong>${entity.formatted}</strong>
      </button>
    `;
  }

  private _renderEnergyEntityRow(entity: PowerEntitySummary, areaTotalWatts: number) {
    const percentage = this._energyEntityPercentage(entity, areaTotalWatts);
    return html`
      <button
        class="energy-entity-row"
        type="button"
        style=${`--power-width: ${percentage}%`}
        @click=${() => this._showMoreInfo(entity.entityId)}
      >
        <span class="energy-entity-icon">
          <ha-icon icon=${entity.icon}></ha-icon>
        </span>
        <span class="energy-entity-copy">
          <strong>${entity.name}</strong>
          <small>${entity.areaName}</small>
          <span class="energy-entity-bar" aria-hidden="true"><span></span></span>
        </span>
        <span class="energy-entity-value">${entity.formatted}</span>
      </button>
    `;
  }

  private _energyEntityPercentage(entity: PowerEntitySummary, areaTotalWatts: number): number {
    if (areaTotalWatts <= 0) return 0;
    return Math.max(4, Math.min(100, Math.round((entity.watts / areaTotalWatts) * 100)));
  }

  private _energyStatisticsEntities(
    entities: PowerEntitySummary[],
    limit: number
  ): Array<{ entity: string; name: string }> {
    return entities
      .filter((entity) => ['measurement', 'total', 'total_increasing'].includes(entity.stateClass || ''))
      .sort((a, b) => b.watts - a.watts)
      .slice(0, limit)
      .map((entity) => ({ entity: entity.entityId, name: entity.name }));
  }

  private _renderEnergyStatisticsGraph(
    entities: Array<{ entity: string; name: string }>,
    label: string
  ) {
    if (!entities.length) return nothing;

    const graphConfig = {
      type: 'statistics-graph',
      entities,
      days_to_show: 1,
      period: '5minute',
      stat_types: ['mean'],
      chart_type: 'line',
      hide_legend: true,
      fit_y_data: true,
      min_y_axis: 0,
    };

    return html`
      <dwains-dashboard-next-card-host
        class="energy-statistics-card"
        aria-label=${label}
        .hass=${this._hass}
        .config=${graphConfig}
      ></dwains-dashboard-next-card-host>
    `;
  }

  private _renderMaintenanceView(maintenance: Map<string, MaintenanceBucket>) {
    const summary = this._maintenanceSummary(maintenance);
    const orderedBuckets = this._orderedMaintenanceBuckets(maintenance);

    return html`
      <div class="device-view maintenance-view">
        <div class="device-header maintenance-header" style=${`--domain-color: ${this._typeColor(MAINTENANCE_KEY)};`}>
          <div class="device-title-wrap">
            <ha-icon icon="mdi:wrench"></ha-icon>
            <div>
              <h1 class="device-title">Maintenance</h1>
              <div class="maintenance-header-subtitle">${this._maintenanceSubtitle(maintenance)}</div>
            </div>
          </div>
          <div class="maintenance-summary">
            <span>
              <ha-icon icon="mdi:battery-alert"></ha-icon>
              ${summary.lowBatteryCount}
            </span>
            <span>
              <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
              ${summary.unavailableDeviceCount}
            </span>
          </div>
        </div>

        ${orderedBuckets.length
          ? orderedBuckets.map((bucket) => html`
              <div class="maintenance-area-group">
                <button
                  class="maintenance-area-title"
                  type="button"
                  @click=${() => this._navigateToArea(bucket.area.area_id)}
                  ?disabled=${bucket.area.area_id === MAINTENANCE_AREA_KEY}
                >
                  <span>${bucket.area.name}</span>
                  <span>${bucket.items.length}</span>
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>
                <div class="maintenance-grid">
                  ${repeat(
                    bucket.items,
                    (item) => item.entityId,
                    (item) => this._renderMaintenanceCard(item)
                  )}
                </div>
              </div>
            `)
          : html`
              <div class="maintenance-empty">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                <span>No low batteries or unavailable devices right now.</span>
              </div>
            `}
      </div>
    `;
  }

  private _orderedMaintenanceBuckets(maintenance: Map<string, MaintenanceBucket>): MaintenanceBucket[] {
    const areaOrder = new Map(this._getVisibleSortedAreas().map((area, index) => [area.area_id, index]));
    return [...maintenance.values()].sort((a, b) => {
      const aOrder = areaOrder.get(a.area.area_id) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = areaOrder.get(b.area.area_id) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.area.name.localeCompare(b.area.name);
    });
  }

  private _renderMaintenanceCard(item: MaintenanceItem) {
    return html`
      <button
        class="maintenance-card ${item.kind}"
        type="button"
        @click=${() => this._showMoreInfo(item.entityId)}
      >
        <div class="maintenance-card-icon">
          <ha-icon icon=${item.icon}></ha-icon>
          ${item.kind === 'unavailable'
            ? html`<span class="maintenance-alert-dot">!</span>`
            : nothing}
        </div>
        <div class="maintenance-card-copy">
          <div class="maintenance-card-title">${item.name}</div>
          <div class="maintenance-card-state">${item.stateLabel}</div>
        </div>
      </button>
    `;
  }

  private _showMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private _navigateToArea(areaId: string): void {
    if (!areaId || areaId === MAINTENANCE_AREA_KEY) return;
    const seg = window.location.pathname.split('/')[1] || 'lovelace';
    const url = new URL(window.location.href);
    url.pathname = `/${seg}/home`;
    url.searchParams.set('dd_area', areaId);
    url.searchParams.delete('dd_device');
    window.history.pushState(null, '', url.toString());
    const ev = new Event('location-changed', { bubbles: true, composed: true });
    (ev as any).detail = { replace: false };
    window.dispatchEvent(ev);
  }

  private _renderEntityCard(entity: EntityConfig) {
    const state = this._hass.states[entity.entity_id];
    if (!state) return nothing;

    return html`
      <div class="${this._entityWrapperClass(entity.entity_id)}">
        <dwains-dashboard-next-card-host
          .hass=${this._hass}
          .config=${this._entityCardConfig(entity.entity_id)}
        ></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  private _entitiesGridClass(typeKey: string): string {
    return [
      'entities-grid',
      typeKey === 'cover' ? 'cover-entities-grid' : '',
      typeKey === 'light' ? 'light-entities-grid' : '',
      typeKey === 'sensor' ? 'sensor-entities-grid' : '',
      typeKey === 'binary_sensor.motion' ? 'motion-entities-grid' : '',
    ].filter(Boolean).join(' ');
  }

  private _entityWrapperClass(entityId: string): string {
    const domain = entityId.split('.')[0] || '';
    const deviceClass = this._hass.states?.[entityId]?.attributes?.device_class;
    return [
      'entity-card-wrapper',
      `${domain}-entity-card`,
      domain === 'binary_sensor' && ['motion', 'occupancy', 'presence'].includes(String(deviceClass))
        ? 'motion-entity-card'
      : '',
    ].filter(Boolean).join(' ');
  }

  private _renderNewDevicesView(devices: RecentDeviceSummary[]) {
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
    return html`
      <div class="recent-device ${summary.hidden ? 'is-hidden' : ''}">
        <div class="recent-device-main">
          <div class="recent-device-icon">
            <ha-icon icon=${summary.hidden ? 'mdi:eye-off-outline' : 'mdi:devices'}></ha-icon>
          </div>
          <div class="recent-device-copy">
            <div class="recent-device-name">${summary.device.name}</div>
            <div class="recent-device-meta">
              <span>${summary.areaName}</span>
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
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .recent-device,
    .restore-button {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
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
      --domain-color: var(--primary-color);
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
      background: var(--domain-color);
      color: var(--text-primary-color);
    }

    .area-button.new-devices {
      --domain-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: 1px solid rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }

    .area-button.new-devices.selected {
      background: var(--domain-color);
      border-color: transparent;
      color: var(--text-primary-color);
    }

    .area-button.new-devices .area-icon {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .area-button.new-devices.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      color: var(--domain-color);
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

    .device-menu-subtitle {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-menu-chevron {
      display: none;
      flex-shrink: 0;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
    }

    .area-button.selected .device-menu-subtitle,
    .area-button.selected .device-menu-chevron {
      color: var(--text-primary-color);
      opacity: 0.88;
    }

    .domain-count {
      flex-shrink: 0;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--domain-color) 11%, var(--secondary-background-color));
      color: var(--domain-color);
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
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }

      .domain-header {
        align-items: flex-start;
        flex-direction: column;
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
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .device-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .device-header ha-icon {
      --mdc-icon-size: 28px;
      color: var(--domain-color, var(--primary-color));
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

    .area-button.maintenance {
      --domain-color: var(--warning-color, #ff9800);
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

    .maintenance-view {
      max-width: 1200px;
    }

    .maintenance-header {
      align-items: flex-start;
      margin-bottom: 22px;
    }

    .maintenance-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
    }

    .maintenance-summary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .maintenance-summary span {
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      color: var(--domain-color);
      font-size: 13px;
      font-weight: 800;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .maintenance-summary ha-icon {
      --mdc-icon-size: 17px;
    }

    .maintenance-area-group {
      margin-bottom: 18px;
    }

    .maintenance-area-title {
      min-height: 34px;
      margin: 0 0 7px;
      padding: 0 4px;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 760;
    }

    .maintenance-area-title:disabled {
      cursor: default;
    }

    .maintenance-area-title span:first-child {
      color: var(--primary-text-color);
    }

    .maintenance-area-title span:nth-child(2) {
      min-width: 21px;
      height: 21px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .maintenance-area-title ha-icon {
      --mdc-icon-size: 18px;
    }

    .maintenance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .maintenance-card {
      min-height: 56px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      transition:
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease;
    }

    .maintenance-card:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .maintenance-card-icon {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }

    .maintenance-card.battery .maintenance-card-icon {
      background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
      color: var(--warning-color, #ff9800);
    }

    .maintenance-card.unavailable .maintenance-card-icon {
      background: color-mix(in srgb, var(--secondary-text-color) 10%, var(--secondary-background-color));
      color: color-mix(in srgb, var(--secondary-text-color) 86%, var(--primary-text-color));
    }

    .maintenance-card-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .maintenance-alert-dot {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--warning-color, #ff9800);
      color: #ffffff;
      font-size: 11px;
      font-weight: 900;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .maintenance-card-copy {
      min-width: 0;
    }

    .maintenance-card-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 750;
      line-height: 1.16;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .maintenance-card-state {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 550;
      line-height: 1.2;
    }

    .maintenance-empty {
      min-height: 180px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--secondary-text-color);
      background: var(--card-background-color);
    }

    .maintenance-empty ha-icon {
      --mdc-icon-size: 22px;
      color: var(--success-color, #4caf50);
    }

    .area-button.energy {
      --domain-color: #d88e20;
    }

    .energy-view {
      --domain-color: #d88e20;
      max-width: 1320px;
    }

    .energy-header {
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .energy-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .energy-header-total {
      min-width: 150px;
      padding: 9px 12px;
      border-radius: 12px;
      display: grid;
      justify-items: end;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .energy-header-total span {
      color: var(--primary-text-color);
      font-size: 24px;
      font-weight: 950;
      line-height: 1;
    }

    .energy-header-total small,
    .energy-overview-head p,
    .energy-area-title small,
    .energy-area-total small,
    .energy-entity-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    .energy-overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(260px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    .energy-overview-card,
    .energy-area-card {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
    }

    .energy-overview-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-overview-head {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-overview-icon,
    .energy-area-icon,
    .energy-entity-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
    }

    .energy-overview-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
    }

    .energy-overview-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .energy-overview-head h2 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .energy-overview-head p {
      margin: 4px 0 0;
    }

    .energy-overview-head strong {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      white-space: nowrap;
    }

    .energy-statistics-card {
      display: block;
      min-height: 150px;
      margin-top: 12px;
      border-radius: 12px;
      overflow: hidden;
      background: color-mix(in srgb, var(--domain-color) 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 12px;
    }

    .energy-top-entities {
      margin-top: 12px;
      display: grid;
      gap: 7px;
    }

    .energy-entity-mini {
      min-height: 30px;
      padding: 0 9px;
      border: 0;
      border-radius: 9px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      background:
        linear-gradient(90deg,
          color-mix(in srgb, var(--domain-color) 16%, transparent) 0 var(--power-width),
          var(--secondary-background-color) var(--power-width) 100%);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-size: 12px;
      font-weight: 800;
    }

    .energy-entity-mini span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-mini strong {
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 12px;
    }

    .energy-area-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-area-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-area-title {
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
    }

    .energy-area-title:disabled {
      cursor: default;
    }

    .energy-area-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    .energy-area-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .energy-area-title strong {
      display: block;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.12;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-area-title small {
      display: block;
      margin-top: 3px;
    }

    .energy-area-total {
      display: grid;
      justify-items: end;
      gap: 2px;
    }

    .energy-area-total span {
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .energy-entity-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .energy-entity-row {
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      transition:
        border-color 0.16s ease,
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .energy-entity-row:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .energy-entity-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .energy-entity-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .energy-entity-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .energy-entity-copy strong {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-bar {
      position: relative;
      height: 5px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--secondary-background-color));
    }

    .energy-entity-bar span {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--domain-color), #f5c85b);
    }

    .energy-entity-value {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-empty {
      min-height: 280px;
      padding: 32px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .energy-empty ha-icon {
      --mdc-icon-size: 34px;
      color: var(--domain-color);
    }

    .energy-empty h2 {
      margin: 4px 0 0;
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 850;
    }

    .energy-empty p {
      max-width: 430px;
      margin: 0;
      font-size: 13px;
      line-height: 1.45;
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
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
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

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card {
      min-height: 72px;
    }

    .light-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .motion-entity-card {
      min-height: 72px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .sidebar-title {
        padding: 4px 8px 12px;
        font-size: 16px;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-list {
        display: grid;
        gap: 8px;
        padding: 0;
      }

      .sidebar .area-button {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        min-height: 70px;
        height: auto;
        margin-bottom: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected {
        background: rgba(255, 255, 255, 0.98);
        border-color: color-mix(in srgb, var(--domain-color) 34%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--domain-color);
        transform: none;
      }

      .sidebar .area-icon {
        width: 46px;
        height: 46px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--domain-color) 10%, transparent);
        color: var(--domain-color);
      }

      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 25px;
      }

      .sidebar .area-button.selected .area-icon {
        background: color-mix(in srgb, var(--domain-color) 14%, transparent);
        color: var(--domain-color);
      }

      .sidebar .area-name {
        margin: 0;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .device-menu-subtitle,
      .sidebar .device-menu-chevron {
        display: block;
      }

      .sidebar .area-button.selected .device-menu-subtitle,
      .sidebar .area-button.selected .device-menu-chevron {
        color: var(--secondary-text-color);
        opacity: 1;
      }

      .sidebar .device-menu-chevron {
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .area-button.selected .device-menu-chevron {
        color: var(--domain-color);
        transform: translateX(2px);
      }

      .sidebar .domain-count {
        display: none;
      }

      @media (prefers-color-scheme: dark) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar-title {
          color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
        }

        .sidebar .area-button {
          border-color: rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .sidebar .area-button:hover {
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .sidebar .area-button.selected {
          border-color: color-mix(in srgb, var(--domain-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--domain-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--domain-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.new-devices {
          background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color));
          border-color: color-mix(in srgb, var(--primary-color) 24%, transparent);
        }

        .sidebar .area-icon {
          background: color-mix(in srgb, var(--domain-color) 20%, transparent);
          color: var(--domain-color);
        }

        .sidebar .area-button.selected .area-icon,
        .sidebar .area-button.new-devices.selected .area-icon {
          background: color-mix(in srgb, var(--domain-color) 24%, transparent);
          color: var(--domain-color);
        }

        .sidebar .device-menu-subtitle,
        .sidebar .device-menu-chevron,
        .sidebar .area-button.selected .device-menu-subtitle,
        .sidebar .area-button.selected .device-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .device-menu-chevron {
          color: var(--domain-color);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.cover-entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.light-entities-grid {
        grid-template-columns: 1fr;
      }

      .entities-grid.sensor-entities-grid,
      .entities-grid.motion-entities-grid {
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

      .maintenance-header {
        gap: 12px;
      }

      .maintenance-summary {
        width: 100%;
      }

      .maintenance-grid {
        grid-template-columns: 1fr;
      }

      .maintenance-card {
        min-height: 62px;
      }

      .energy-header {
        align-items: stretch;
        flex-direction: column;
      }

      .energy-header-total {
        justify-items: start;
      }

      .energy-overview-grid,
      .energy-areas-grid {
        grid-template-columns: 1fr;
      }

      .energy-overview-head,
      .energy-area-head {
        grid-template-columns: 40px minmax(0, 1fr);
      }

      .energy-overview-head strong,
      .energy-area-total {
        grid-column: 1 / -1;
        justify-self: stretch;
        justify-items: start;
        margin-top: 4px;
      }

      .energy-area-card,
      .energy-overview-card {
        border-radius: 10px;
      }

      .energy-entity-row {
        grid-template-columns: 36px minmax(0, 1fr);
      }

      .energy-entity-value {
        grid-column: 2;
        justify-self: start;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-devices-card': DwainsDevicesCard;
  }
}
