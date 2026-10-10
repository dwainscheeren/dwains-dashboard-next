import { LitElement, html, css, unsafeCSS, nothing, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import type {
  DwainsDashboardConfig,
  AreaConfig,
  DeviceAdmission,
  EntityConfig,
} from '../types/strategy';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import {
  AREA_STRATEGY_GROUPS,
  getAreaEntityGroupKey,
  getLegacyAreaGroupKey,
  sortAreas,
  type AreaStrategyGroup,
} from '../utils/area-entities';
import { getDomainIcon, getDeviceClassIcon, getDomainColor, getAreaIcon } from '../utils/icons';
import { getDomainName, getDeviceClassName } from '../utils/domain-names';
import { findReplacementAssignment, resolveDeviceViewCardConfig } from '../utils/blueprint-replacements';
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
import { isHassDarkTheme } from '../utils/theme';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../utils/unit-format';
import { stripAreaNameFromEntityName } from '../utils/entity-names';
import './utils/dd-card-host';
import './dwains-person-tile';
import './ui/dd-ui-primitives';
import { renderCompactDeviceTile } from './ui/dd-entity-tiles';

const NEW_DEVICES_KEY = '__new_devices__';
const MAINTENANCE_KEY = '__maintenance__';
const MAINTENANCE_AREA_KEY = '__maintenance_no_area__';
const ENERGY_KEY = 'energy';
const DEVICES_OVERVIEW_KEY = '__overview__';
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
    this._syncThemeAttribute();
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
      throw new Error(ddLocalize(this._hass, 'devices.invalid_configuration'));
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
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
      this._syncBottomNavDeviceContext();
    }
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncThemeAttribute();
    this._checkMobile();
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('dwains-dashboard-next-toggle-devices-nav', this._handleDevicesNavToggle);
    window.addEventListener('dwains-dashboard-next-mobile-nav-sheet', this._handleMobileNavSheet as EventListener);
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
    window.removeEventListener('dwains-dashboard-next-mobile-nav-sheet', this._handleMobileNavSheet as EventListener);
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

  private _tp = (key: string, count: number, vars?: Record<string, string | number>) =>
    ddLocalizePlural(this._hass, key, count, vars);

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

    const hiddenDeviceEntities = new Set(this.config?.device_admission?.hidden_entities || []);
    if (hiddenDeviceEntities.size) {
      filteredEntities = filteredEntities.filter((entity) => !hiddenDeviceEntities.has(entity.entity_id));
    }

    return filteredEntities;
  }

  private _getVisibleSortedAreas(): AreaConfig[] {
    if (!this.config?.areas) return [];
    return sortAreas(this.config.areas, this.config.areas_display, ddLocale(this._hass));
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

    data.forEach((byArea) => {
      byArea.forEach((bucket) => {
        bucket.entities = this._sortDeviceAreaEntities(bucket.area.area_id, bucket.entities);
      });
    });

    this._hiddenDeviceTypes().forEach((typeKey) => data.delete(typeKey));

    return data;
  }

  private _deviceEntityGroupKey(entityId: string): string {
    return getAreaEntityGroupKey(entityId, this._hass) || this._typeKeyFor(entityId) || entityId.split('.')[0] || 'other';
  }

  private _deviceGroupOrderIndex(areaId: string, groupKey: string): number {
    const configuredOrder = this.config?.areas_options?.[areaId]?.group_order || [];

    const direct = configuredOrder.indexOf(groupKey);
    if (direct >= 0) return direct;

    if (groupKey === 'cover_gates' && configuredOrder.includes('cover_shading')) {
      return configuredOrder.indexOf('cover_shading');
    }

    if (
      ['cover_openings', 'cover_shading', 'cover_gates'].includes(groupKey) &&
      configuredOrder.includes('cover')
    ) {
      return configuredOrder.indexOf('cover');
    }

    if ((AREA_STRATEGY_GROUPS as readonly string[]).includes(groupKey)) {
      const legacy = configuredOrder.indexOf(getLegacyAreaGroupKey(groupKey as AreaStrategyGroup));
      if (legacy >= 0) return legacy;
    }

    const defaultIndex = (AREA_STRATEGY_GROUPS as readonly string[]).indexOf(groupKey);
    return defaultIndex >= 0 ? configuredOrder.length + defaultIndex : Number.MAX_SAFE_INTEGER;
  }

  private _deviceConfiguredEntityOrder(areaId: string, groupKey: string): string[] {
    const areaOptions = this.config?.areas_options?.[areaId];
    if (!areaOptions) return [];

    if (areaOptions.entity_layout === 'ungrouped') {
      return areaOptions.entity_order || [];
    }

    const groupsOptions = areaOptions.groups_options || {};
    const direct = groupsOptions[groupKey]?.order;
    if (direct?.length) return direct;

    if (groupKey === 'cover_gates') {
      const formerCombined = groupsOptions.cover_shading?.order;
      if (formerCombined?.length) return formerCombined;
    }

    if (['cover_openings', 'cover_shading', 'cover_gates'].includes(groupKey)) {
      const formerCover = groupsOptions.cover?.order;
      if (formerCover?.length) return formerCover;
    }

    if ((AREA_STRATEGY_GROUPS as readonly string[]).includes(groupKey)) {
      const legacy = groupsOptions[getLegacyAreaGroupKey(groupKey as AreaStrategyGroup)]?.order;
      if (legacy?.length) return legacy;
    }

    return [];
  }

  private _sortDeviceAreaEntities(areaId: string, entities: EntityConfig[]): EntityConfig[] {
    const collator = new Intl.Collator(ddLocale(this._hass), { sensitivity: 'base', numeric: true });

    return [...entities].sort((a, b) => {
      const groupA = this._deviceEntityGroupKey(a.entity_id);
      const groupB = this._deviceEntityGroupKey(b.entity_id);

      if (groupA !== groupB) {
        const rankA = this._deviceGroupOrderIndex(areaId, groupA);
        const rankB = this._deviceGroupOrderIndex(areaId, groupB);
        if (rankA !== rankB) return rankA - rankB;
      }

      const order = this._deviceConfiguredEntityOrder(areaId, groupA);
      if (groupA === groupB && order.length) {
        const indexA = order.indexOf(a.entity_id);
        const indexB = order.indexOf(b.entity_id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
      }

      const nameA = this._hass.states[a.entity_id]?.attributes?.friendly_name ||
        this._hass.entities?.[a.entity_id]?.name ||
        a.entity_id;
      const nameB = this._hass.states[b.entity_id]?.attributes?.friendly_name ||
        this._hass.entities?.[b.entity_id]?.name ||
        b.entity_id;

      const deviceIdA = a.device_id || (this._hass.entities?.[a.entity_id] as any)?.device_id || '';
      const deviceIdB = b.device_id || (this._hass.entities?.[b.entity_id] as any)?.device_id || '';
      if (deviceIdA !== deviceIdB) {
        const deviceName = (deviceId: string, fallback: string) => {
          if (!deviceId) return fallback;
          return this.config?.devices?.find(item => item.device_id === deviceId)?.name || deviceId;
        };
        const byDevice = collator.compare(deviceName(deviceIdA, String(nameA)), deviceName(deviceIdB, String(nameB)));
        if (byDevice !== 0) return byDevice;
      }

      return collator.compare(String(nameA), String(nameB));
    });
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
      const orderedIds = this._sortDeviceAreaEntities(
        bucket.area.area_id,
        bucket.items.map((item) => ({ entity_id: item.entityId, area_id: bucket.area.area_id, hidden: false }))
      ).map((entity) => entity.entity_id);
      const orderIndex = new Map(orderedIds.map((entityId, index) => [entityId, index]));
      bucket.items.sort((a, b) =>
        (orderIndex.get(a.entityId) ?? Number.MAX_SAFE_INTEGER) -
        (orderIndex.get(b.entityId) ?? Number.MAX_SAFE_INTEGER)
      );
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
      parts.push(this._tp('devices.low_battery', summary.lowBatteryCount));
    }
    if (summary.unavailableDeviceCount) {
      parts.push(this._tp('devices.unavailable_device', summary.unavailableDeviceCount));
    }
    return parts.length ? parts.join(', ') : this._t('devices.all_good');
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
      return state.state === 'unknown' ? this._t('common.unknown') : this._t('common.unavailable');
    }

    const unit = state.attributes?.unit_of_measurement || '%';
    return formatValueWithUnit(state.state, unit);
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

  // Device types use the same concrete grouping model as the room view.
  private _typeKeyFor(entityId: string): string | undefined {
    const domain = entityId.split('.')[0];
    if (!domain) return undefined;
    if (domain === 'cover') {
      return getAreaEntityGroupKey(entityId, this._hass) || 'cover_shading';
    }
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
    if (key === MAINTENANCE_KEY) return this._t('devices.maintenance');
    if (key === ENERGY_KEY) return this._t('devices.energy');
    if (key === DEVICES_OVERVIEW_KEY) return this._t('navigation.overview');
    if (key === 'cover_openings') {
      return String(this._hass?.language || '').toLowerCase().startsWith('de') ? 'Fenster & Türen' : 'Windows & doors';
    }
    if (key === 'cover_shading') {
      return String(this._hass?.language || '').toLowerCase().startsWith('de') ? 'Beschattung' : 'Shading';
    }
    if (key === 'cover_gates') {
      return String(this._hass?.language || '').toLowerCase().startsWith('de') ? 'Tore' : 'Gates';
    }
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassName(this._hass, key.slice('binary_sensor.'.length));
    }
    return getDomainName(this._hass, key);
  }

  // Icoon voor een type-sleutel.
  private _typeIcon(key: string): string {
    if (key === MAINTENANCE_KEY) return 'mdi:wrench';
    if (key === ENERGY_KEY) return 'mdi:flash';
    if (key === DEVICES_OVERVIEW_KEY) return 'mdi:view-grid-outline';
    if (key === PERSON_DOMAIN) return 'mdi:account-group';
    if (key === 'cover_openings') return 'mdi:door-open';
    if (key === 'cover_shading') return 'mdi:blinds-horizontal';
    if (key === 'cover_gates') return 'mdi:gate';
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassIcon('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainIcon(key);
  }

  private _typeColor(key: string): string {
    if (key === MAINTENANCE_KEY) return 'var(--warning-color, #ff9800)';
    if (key === ENERGY_KEY) return getDomainColor('energy');
    if (key === DEVICES_OVERVIEW_KEY) return 'var(--primary-color)';
    if (key === 'cover_openings' || key === 'cover_shading' || key === 'cover_gates') {
      return getDomainColor('cover');
    }
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
          : domain === DEVICES_OVERVIEW_KEY || !domain
            ? 'mdi:format-list-bulleted-type'
          : domain
            ? this._typeIcon(domain)
            : 'mdi:format-list-bulleted-type',
        label: domain === NEW_DEVICES_KEY
          ? this._t('devices.new')
          : domain === MAINTENANCE_KEY
            ? this._t('devices.maintenance')
          : domain === ENERGY_KEY
            ? this._t('devices.energy')
          : domain === DEVICES_OVERVIEW_KEY || !domain
            ? this._t('devices.title')
          : domain
            ? this._typeName(domain)
            : this._t('devices.title'),
      },
    }));
  }

  protected override updated(changedProps: PropertyValues): void {
    if (changedProps.has('_hass')) {
      this._syncThemeAttribute();
    }
    if (changedProps.has('_selectedDomain')) {
      this._syncBottomNavDeviceContext();
    }
  }

  private _syncThemeAttribute(): void {
    this.toggleAttribute('data-theme-dark', isHassDarkTheme(this._hass, this));
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

    if (domain === DEVICES_OVERVIEW_KEY) {
      // Always available.
    } else if (domain === NEW_DEVICES_KEY) {
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
    if (entityId.startsWith('todo.')) {
      return { type: 'todo-list', entity: entityId };
    }

    return resolveDeviceViewCardConfig({
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
    this._updateUrlDomain(domain === DEVICES_OVERVIEW_KEY ? null : domain);
    this._syncBottomNavDeviceContext();
    this._closeMobileNav();
  }

  private _handleDevicesNavToggle = (event?: Event) => {
    if (!this._isMobile) return;
    if ((event as CustomEvent<{ open?: boolean }>)?.detail?.open) {
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-mobile-nav-sheet', {
        detail: { kind: 'devices' },
      }));
      this._mobileNavOpen = true;
      return;
    }
    const opening = !this._mobileNavOpen;
    if (opening) {
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-mobile-nav-sheet', {
        detail: { kind: 'devices' },
      }));
    }
    this._mobileNavOpen = opening;
  };

  private _handleMobileNavSheet = (event: CustomEvent<{ kind?: string }>) => {
    if (event.detail?.kind !== 'devices') {
      this._mobileNavOpen = false;
    }
  };

  private _closeMobileNav = () => {
    this._mobileNavOpen = false;
  };

  // ---- Render ---------------------------------------------------------------

  render() {
    if (!this._hass || !this.config) {
      return html`<div class="loading">${this._t('common.loading')}</div>`;
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
    if (this._selectedDomain === DEVICES_OVERVIEW_KEY) {
      // Always valid.
    } else if (this._selectedDomain === NEW_DEVICES_KEY) {
      if (!showNewDevicesMenu) {
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
    } else if (this._selectedDomain === MAINTENANCE_KEY) {
      if (!showMaintenanceMenu) {
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
    } else if (this._selectedDomain === ENERGY_KEY) {
      if (!showEnergyMenu) {
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
    } else if (!this._selectedDomain || !data.has(this._selectedDomain)) {
      this._selectedDomain = DEVICES_OVERVIEW_KEY;
    }

    return html`
      <div class="layout-container">
        ${this._renderSidebar(data, domains, newDevices, showNewDevicesMenu, maintenance, showMaintenanceMenu, showEnergyMenu)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain === NEW_DEVICES_KEY
              ? this._renderNewDevicesView(newDevices)
              : this._selectedDomain === MAINTENANCE_KEY
                ? this._renderMaintenanceView(maintenance)
              : this._selectedDomain === ENERGY_KEY
                ? this._renderEnergyView()
              : this._selectedDomain === DEVICES_OVERVIEW_KEY
                ? this._renderDevicesOverview(data, domains, newDevices, showNewDevicesMenu, maintenance, showMaintenanceMenu, showEnergyMenu)
              : this._renderDeviceView(data)}
          </div>
        </div>
      </div>
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

    const content = html`
      <nav class=${classMap(classes)}>
        ${!this._isMobile ? html`<div class="sidebar-title">${this._t('devices.title')}</div>` : nothing}
        <div class="area-list">
          <button
            class="area-button overview ${this._selectedDomain === DEVICES_OVERVIEW_KEY ? 'selected' : ''}"
            style=${`--domain-color: ${this._typeColor(DEVICES_OVERVIEW_KEY)};`}
            @click=${() => this._selectDomain(DEVICES_OVERVIEW_KEY)}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:view-grid-outline"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t('navigation.overview')}</div>
              <div class="device-menu-subtitle">${this._t('navigation.all_device_groups')}</div>
            </div>
            <span class="domain-count">${domains.length}</span>
            <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
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
                    <div class="area-name">${this._t('devices.new')}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp('devices.new', newDevices.length)}
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
                    <div class="area-name">${this._t('devices.maintenance')}</div>
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
                    <div class="area-name">${this._t('devices.energy')}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp('devices.live_power_sensor', energySummary.sensorCount)}
                    </div>
                  </div>
                  <span class="domain-count">${energySummary.sensorCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `
            : nothing}
          ${data.has(PERSON_DOMAIN) ? (() => {
            const byArea = data.get(PERSON_DOMAIN)!;
            const count = this._domainCount(byArea);
            const isSelected = this._selectedDomain === PERSON_DOMAIN;
            return html`
              <button
                class="area-button ${isSelected ? 'selected' : ''}"
                style=${`--domain-color: ${this._typeColor(PERSON_DOMAIN)};`}
                @click=${() => this._selectDomain(PERSON_DOMAIN)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(PERSON_DOMAIN)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(PERSON_DOMAIN)}</div>
                  <div class="device-menu-subtitle">${this._tp('common.entity', count)}</div>
                </div>
                <span class="domain-count">${count}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `;
          })() : nothing}
          ${domains.filter((domain) => domain !== PERSON_DOMAIN).map((domain) => {
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
                  <div class="device-menu-subtitle">${this._tp('common.entity', count)}</div>
                </div>
                <span class="domain-count">${count}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `;
          })}
        </div>
      </nav>
    `;
    return this._isMobile ? html`
      <dd-next-popup-shell
        .open=${this._mobileNavOpen}
        .navigationMenu=${true}
        .titleText=${this._t('devices.title')}
        icon="mdi:format-list-bulleted-type"
        .closeLabel=${this._t('common.close')}
        @dd-close=${this._closeMobileNav}
      >${content}</dd-next-popup-shell>
    ` : content;
  }

  private _renderDevicesOverview(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>,
    domains: string[],
    newDevices: RecentDeviceSummary[],
    showNewDevicesMenu: boolean,
    maintenance: Map<string, MaintenanceBucket>,
    showMaintenanceMenu: boolean,
    showEnergyMenu: boolean
  ) {
    const energySummary = this._energySummary();
    const cards: Array<{
      key: string;
      icon: string;
      title: string;
      subtitle: string;
      count: number;
      color: string;
    }> = [];

    if (showNewDevicesMenu) {
      cards.push({
        key: NEW_DEVICES_KEY,
        icon: 'mdi:new-box',
        title: this._t('devices.new'),
        subtitle: this._tp('devices.new', newDevices.length),
        count: newDevices.length,
        color: 'var(--primary-color)',
      });
    }

    if (showMaintenanceMenu) {
      const summary = this._maintenanceSummary(maintenance);
      cards.push({
        key: MAINTENANCE_KEY,
        icon: 'mdi:wrench',
        title: this._t('devices.maintenance'),
        subtitle: this._maintenanceSubtitle(maintenance),
        count: summary.totalCount,
        color: this._typeColor(MAINTENANCE_KEY),
      });
    }

    if (showEnergyMenu) {
      cards.push({
        key: ENERGY_KEY,
        icon: 'mdi:flash',
        title: this._t('devices.energy'),
        subtitle: this._tp('devices.live_power_sensor', energySummary.sensorCount),
        count: energySummary.sensorCount,
        color: this._typeColor(ENERGY_KEY),
      });
    }

    domains.forEach((domain) => {
      const byArea = data.get(domain);
      if (!byArea) return;
      const count = this._domainCount(byArea);
      cards.push({
        key: domain,
        icon: this._typeIcon(domain),
        title: this._typeName(domain),
        subtitle: this._tp('common.entity', count),
        count,
        color: this._typeColor(domain),
      });
    });

    return html`
      <div class="device-view devices-overview-view">
        ${this._renderDevicePageHeader({
          icon: 'mdi:format-list-bulleted-type',
          title: this._t('devices.title'),
          subtitle: this._tp('devices.group', cards.length),
          color: this._typeColor(DEVICES_OVERVIEW_KEY),
        })}

        <div class="devices-overview-grid">
          ${repeat(
            cards,
            (card) => card.key,
            (card) => html`
              <button
                class="devices-overview-card"
                type="button"
                style=${`--domain-color: ${card.color};`}
                @click=${() => this._selectDomain(card.key)}
              >
                <span class="overview-card-icon">
                  <ha-icon icon=${card.icon}></ha-icon>
                  <span class="overview-card-count">${card.count}</span>
                </span>
                <span class="overview-card-copy">
                  <strong>${card.title}</strong>
                  <small>${card.subtitle}</small>
                </span>
                <ha-icon class="overview-card-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `
          )}
        </div>
      </div>
    `;
  }

  private _renderDevicePageHeader(options: {
    icon: string;
    title: string;
    subtitle?: string;
    color: string;
    back?: boolean;
    actions?: unknown;
    className?: string;
  }) {
    return html`
      <dd-next-page-header
        class=${options.className || ''}
        .icon=${options.icon}
        .titleText=${options.title}
        .subtitle=${options.subtitle || ''}
        .accent=${options.color}
        .back=${Boolean(options.back)}
        .backLabel=${this._t('navigation.overview')}
        @dd-back=${() => this._selectDomain(DEVICES_OVERVIEW_KEY)}
      >
        ${options.actions ? html`<span slot="actions">${options.actions}</span>` : nothing}
      </dd-next-page-header>
    `;
  }

  private _renderDeviceView(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>
  ) {
    const domain = this._selectedDomain;
    if (!domain) return nothing;

    const byArea = data.get(domain);
    if (!byArea) return nothing;
    const roomStyle = !this._isSpecialDeviceType(domain);

    // Areas in zichtbare, gesorteerde volgorde (gefilterd op aanwezigheid).
    const orderedAreas = domain === PERSON_DOMAIN
      ? [...byArea.values()].map((bucket) => bucket.area)
      : this._getVisibleSortedAreas().filter((a) => byArea.has(a.area_id));
    const allEntities = [...byArea.values()].flatMap((bucket) => bucket.entities);
    const personEntities = domain === PERSON_DOMAIN
      ? [...new Map(allEntities.map((entity) => [entity.entity_id, entity])).values()]
      : [];
    const personArea = orderedAreas[0] || {
      area_id: PERSON_AREA_KEY,
      name: '',
      icon: 'mdi:account-group',
    };

    return html`
      <div class="device-view ${roomStyle ? 'room-style-device-view' : 'special-device-view'}">
        ${this._renderDevicePageHeader({
          icon: this._typeIcon(domain),
          title: this._typeName(domain),
          subtitle: this._tp('common.entity', this._domainCount(byArea)),
          color: this._typeColor(domain),
          back: true,
        })}

        ${this._renderDeviceGlobalActions(domain, allEntities)}

        ${domain === PERSON_DOMAIN
          ? html`
              <div class="person-device-grid ${this._entitiesGridClass(domain, true)}">
                ${repeat(
                  personEntities,
                  (entity) => entity.entity_id,
                  (entity) => this._renderRoomStyleEntityCard(entity, personArea)
                )}
              </div>
            `
          : html`
              <div class="device-room-groups">
                ${orderedAreas.map((area) => {
                  const bucket = byArea.get(area.area_id)!;
                  const compactRoom = bucket.entities.length <= 2;
                  return html`
                    <dd-next-room-group
                      class="device-room-group ${compactRoom ? 'half-room' : 'full-room'}"
                      .name=${area.name}
                      .icon=${getAreaIcon(area)}
                      .accent=${this._roomAccent(area)}
                      .compact=${compactRoom}
                    >
                      <span slot="actions">${this._renderDeviceRoomActions(domain, bucket.entities)}</span>
                      <div class=${this._entitiesGridClass(domain, roomStyle)}>
                        ${repeat(
                          bucket.entities,
                          (e) => e.entity_id,
                          (entity) => roomStyle
                            ? this._renderRoomStyleEntityCard(entity, area)
                            : this._renderEntityCard(entity, area)
                        )}
                      </div>
                    </dd-next-room-group>
                  `;
                })}
              </div>
            `}
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
        ${this._renderDevicePageHeader({
          icon: 'mdi:flash',
          title: this._t('devices.energy'),
          subtitle: this._t('devices.live_power_usage'),
          color: this._typeColor(ENERGY_KEY),
          back: true,
        })}

        ${summary.sensorCount
          ? html`
              <div class="energy-overview-grid">
                <section class="energy-overview-card total">
                  <div class="energy-overview-head">
                    <span class="energy-overview-icon">
                      <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
                    </span>
                    <div>
                      <h2>${this._t('devices.whole_house')}</h2>
                      <p>${this._tp('devices.live_power_sensor', summary.sensorCount)}</p>
                    </div>
                    <strong>${summary.formattedTotal}</strong>
                  </div>
                  ${this._renderEnergyStatisticsGraph(wholeHouseStatisticsEntities, this._t('devices.whole_house_history'))}
                </section>

                ${topArea ? html`
                  <section class="energy-overview-card top-area">
                    <div class="energy-overview-head">
                      <span class="energy-overview-icon">
                        <ha-icon icon=${topArea.icon}></ha-icon>
                      </span>
                      <div>
                        <h2>${this._t('devices.top_area')}</h2>
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
                <h2>${this._t('devices.no_power_title')}</h2>
                <p>${this._t('devices.no_power_description')}</p>
              </div>
            `}
      </div>
    `;
  }

  private _roomAccent(area: AreaConfig): string {
    // HA area registry does not expose a dedicated user-selectable color.
    // Prefer any configured runtime room color, then use the normal room
    // accent rather than the currently selected entity domain's color.
    const room = this._hass?.areas?.[area.area_id] as
      | { color?: string; icon_color?: string } | undefined;
    return room?.icon_color || room?.color || 'var(--primary-color)';
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
              <small>${this._tp('devices.power_entity', area.entities.length)}</small>
            </span>
          </button>
          <div class="energy-area-total">
            <span>${area.formattedTotal}</span>
            <small>${this._t('devices.total_now')}</small>
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
  ): Array<{ entity: string; name: string; color: string }> {
    const energyGraphPalette = [
      '#65A83F',
      '#E5B83B',
      '#239CB5',
      '#D98928',
      '#50A789',
      '#8065C7',
      '#AD7253',
      '#367DD5',
    ];

    return entities
      .filter((entity) => ['measurement', 'total', 'total_increasing'].includes(entity.stateClass || ''))
      .sort((a, b) => b.watts - a.watts)
      .slice(0, limit)
      .map((entity, index) => ({
        entity: entity.entityId,
        name: entity.name,
        color: energyGraphPalette[index % energyGraphPalette.length]!,
      }));
  }

  private _renderEnergyStatisticsGraph(
    entities: Array<{ entity: string; name: string; color: string }>,
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
    const orderedBuckets = this._orderedMaintenanceBuckets(maintenance);

    return html`
      <div class="device-view maintenance-view">
        ${this._renderDevicePageHeader({
          icon: 'mdi:wrench',
          title: this._t('devices.maintenance'),
          subtitle: this._maintenanceSubtitle(maintenance),
          color: this._typeColor(MAINTENANCE_KEY),
          back: true,
        })}

        ${orderedBuckets.length
          ? orderedBuckets.map((bucket) => html`
              <div class="domain-group maintenance-area-group">
                <div class="domain-header">
                  <div class="domain-header-title">
                    <ha-icon icon="mdi:floor-plan"></ha-icon>
                    <span>${bucket.area.name}</span>
                  </div>
                </div>
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
                <span>${this._t('devices.maintenance_empty')}</span>
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

  private _deviceGroupDomain(typeKey: string): string | undefined {
    if (['cover_openings', 'cover_shading', 'cover_gates'].includes(typeKey)) return 'cover';
    const domain = typeKey.split('.')[0] || typeKey;
    return ['light', 'switch', 'fan', 'input_boolean', 'cover', 'lock'].includes(domain)
      ? domain
      : undefined;
  }

  private _renderDeviceGlobalActions(typeKey: string, entities: EntityConfig[]) {
    const domain = this._deviceGroupDomain(typeKey);
    if (!domain || !entities.length) return nothing;
    return html`
      <div class="device-global-actions">
        ${this._renderDeviceBulkButtons(domain, entities, true)}
      </div>
    `;
  }

  private _renderDeviceRoomActions(typeKey: string, entities: EntityConfig[]) {
    const domain = this._deviceGroupDomain(typeKey);
    if (!domain || !entities.length) return nothing;

    const activeCount = entities.filter((entity) => {
      const state = this._hass.states?.[entity.entity_id];
      return state && this._roomStyleEntityActive(state, domain);
    }).length;

    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
      return html`
        <dd-next-room-actions
          mode="toggle"
          .accent=${getDomainColor(domain)}
          .activeCount=${activeCount}
          .totalCount=${entities.length}
          .toggleOnLabel=${this._t('action.turn_on_all')}
          .toggleOffLabel=${this._t('action.turn_off_all')}
          @dd-action=${(event: CustomEvent<{ action: string }>) =>
            void this._runDeviceBulkAction(entities, event.detail.action)}
        ></dd-next-room-actions>
      `;
    }

    if (domain === 'cover' || domain === 'lock') {
      const active = activeCount > 0;
      const items = domain === 'cover'
        ? [
            { action: 'open_cover', label: this._t('action.open_all'), icon: 'mdi:arrow-up', active },
            { action: 'close_cover', label: this._t('action.close_all'), icon: 'mdi:arrow-down', active: !active },
          ]
        : [
            { action: 'lock', label: this._t('action.lock_all'), icon: 'mdi:lock-outline', active: !active },
            { action: 'unlock', label: this._t('action.unlock_all'), icon: 'mdi:lock-open-variant-outline', active },
          ];

      return html`
        <dd-next-room-actions
          mode="segmented"
          .accent=${getDomainColor(domain)}
          .items=${items}
          @dd-action=${(event: CustomEvent<{ action: string }>) =>
            void this._runDeviceBulkAction(entities, event.detail.action)}
        ></dd-next-room-actions>
      `;
    }

    return nothing;
  }

  private _renderDeviceBulkButtons(domain: string, entities: EntityConfig[], withLabels: boolean) {
    const button = (label: string, icon: string, action: string) => html`
      <button
        class="device-bulk-action ${withLabels ? 'with-label' : 'icon-only'}"
        type="button"
        title=${label}
        aria-label=${label}
        style=${`--domain-color: ${getDomainColor(domain)};`}
        @click=${(event: Event) => {
          event.stopPropagation();
          void this._runDeviceBulkAction(entities, action);
        }}
      >
        <ha-icon icon=${icon}></ha-icon>
        ${withLabels ? html`<span>${label}</span>` : nothing}
      </button>
    `;

    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
      return html`
        ${button(this._t('action.turn_on_all'), 'mdi:power', 'turn_on')}
        ${button(this._t('action.turn_off_all'), 'mdi:power-off', 'turn_off')}
      `;
    }
    if (domain === 'cover') {
      return html`
        ${button(this._t('action.open_all'), 'mdi:arrow-up', 'open_cover')}
        ${button(this._t('action.close_all'), 'mdi:arrow-down', 'close_cover')}
      `;
    }
    if (domain === 'lock') {
      return html`
        ${button(this._t('action.unlock_all'), 'mdi:lock-open-variant-outline', 'unlock')}
        ${button(this._t('action.lock_all'), 'mdi:lock-outline', 'lock')}
      `;
    }
    return nothing;
  }

  private async _runDeviceBulkAction(entities: EntityConfig[], action: string): Promise<void> {
    const grouped = new Map<string, string[]>();
    for (const entity of entities) {
      if (!this._hass.states?.[entity.entity_id]) continue;
      const domain = entity.entity_id.split('.')[0] || '';
      const ids = grouped.get(domain) || [];
      ids.push(entity.entity_id);
      grouped.set(domain, ids);
    }

    try {
      for (const [domain, entityIds] of grouped) {
        if (['light', 'switch', 'fan', 'input_boolean'].includes(domain) && ['turn_on', 'turn_off'].includes(action)) {
          await this._hass.callService(domain, action, { entity_id: entityIds });
        } else if (domain === 'cover' && ['open_cover', 'close_cover'].includes(action)) {
          await this._hass.callService('cover', action, { entity_id: entityIds });
        } else if (domain === 'lock' && ['lock', 'unlock'].includes(action)) {
          await this._hass.callService('lock', action, { entity_id: entityIds });
        }
      }
    } catch (error) {
      console.warn(`Failed to run device bulk action ${action}`, error);
    }
  }

  private _renderEntityCard(entity: EntityConfig, area: AreaConfig) {
    if (!this._hass.states[entity.entity_id]) return nothing;
    return html`
      <dd-next-device-entity-card
        class="${this._entityWrapperClass(entity.entity_id)}"
        .hass=${this._hass}
        .config=${this.config}
        .entityId=${entity.entity_id}
        .areaName=${area.name}
        @dd-more-info=${(event: CustomEvent<{ entityId: string }>) => this._showMoreInfo(event.detail.entityId)}
      ></dd-next-device-entity-card>
    `;
  }

  private _isSpecialDeviceType(typeKey: string): boolean {
    return ['light', 'cover', 'cover_openings', 'cover_shading', 'cover_gates', 'climate', 'sensor'].includes(typeKey);
  }

  private _renderRoomStyleEntityCard(entity: EntityConfig, area: AreaConfig) {
    const state = this._hass.states[entity.entity_id];
    if (!state) return nothing;

    const replacement = findReplacementAssignment({
      hass: this._hass,
      config: this.config,
      entity,
      surface: 'devices_cards',
    });
    if (replacement && replacement.enabled !== false) {
      return html`
        <div class="entity-card-wrapper room-style-replacement-card">
          <dwains-dashboard-next-card-host
            framed
            .hass=${this._hass}
            .config=${this._entityCardConfig(entity.entity_id)}
          ></dwains-dashboard-next-card-host>
        </div>
      `;
    }

    const domain = entity.entity_id.split('.')[0] || 'unknown';
    const deviceClass = state.attributes?.device_class;
    const rawName = state.attributes?.friendly_name ||
      this._hass.entities?.[entity.entity_id]?.name ||
      entity.entity_id;
    const name = this.config?.settings?.hide_area_name_in_entity_names === true
      ? stripAreaNameFromEntityName(rawName, area.name)
      : rawName;

    if (domain === 'person') {
      return html`
        <dd-next-device-entity-card
          .hass=${this._hass}
          .config=${this.config}
          .entityId=${entity.entity_id}
          .areaName=${area.name}
          .displayName=${name}
          @dd-more-info=${(event: CustomEvent<{ entityId: string }>) => this._showMoreInfo(event.detail.entityId)}
        ></dd-next-device-entity-card>
      `;
    }

    const icon = this._hass.entities?.[entity.entity_id]?.icon ||
      state.attributes?.icon ||
      getDeviceClassIcon(domain, deviceClass) ||
      getDomainIcon(domain);
    const active = this._roomStyleEntityActive(state, domain);
    const unavailable = ['unavailable', 'unknown'].includes(String(state.state).toLowerCase()) &&
      !['scene', 'event'].includes(domain);
    const canToggle = ['switch', 'fan', 'input_boolean'].includes(domain);

    return renderCompactDeviceTile({
      name,
      status: formatEntityStateWithUnit(this._hass, state),
      icon,
      accent: getDomainColor(domain, deviceClass),
      active,
      unavailable,
      toggle: canToggle,
      onOpen: () => this._showMoreInfo(entity.entity_id),
      onToggle: () => void this._toggleRoomStyleEntity(entity.entity_id, domain, active),
      turnOnLabel: this._t('action.turn_on'),
      turnOffLabel: this._t('action.turn_off'),
    });
  }

  private _roomStyleEntityActive(state: any, domain: string): boolean {
    const value = String(state?.state || '').toLowerCase();
    if (domain === 'lock') return value === 'unlocked';
    if (domain === 'person') return value === 'home';
    if (domain === 'binary_sensor') return value === 'on';
    return ['on', 'open', 'opening', 'playing', 'active', 'home'].includes(value);
  }

  private async _toggleRoomStyleEntity(entityId: string, domain: string, active: boolean): Promise<void> {
    const serviceDomain = domain === 'input_boolean' ? 'input_boolean' : domain;
    try {
      await this._hass.callService(serviceDomain, active ? 'turn_off' : 'turn_on', { entity_id: entityId });
    } catch (error) {
      console.warn(`Failed to toggle ${entityId} from Devices view`, error);
    }
  }

  private _entitiesGridClass(typeKey: string, roomStyle = false): string {
    return [
      'entities-grid',
      roomStyle ? 'room-style-entities-grid' : 'special-entities-grid',
      (typeKey === 'cover' || typeKey.startsWith('cover_')) ? 'cover-entities-grid' : '',
      typeKey === 'light' ? 'light-entities-grid' : '',
      typeKey === 'sensor' ? 'sensor-entities-grid' : '',
      typeKey === 'climate' ? 'climate-entities-grid' : '',
      typeKey === 'binary_sensor.motion' ? 'motion-entities-grid' : '',
      typeKey === 'todo' ? 'todo-entities-grid' : '',
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
        ${this._renderDevicePageHeader({
          icon: 'mdi:new-box',
          title: this._t('devices.new'),
          subtitle: this._t('devices.new_description', { hours: NEW_DEVICE_WINDOW_HOURS }),
          color: this._typeColor(NEW_DEVICES_KEY),
          back: true,
        })}
        <section class="recent-devices new-devices-view">
          <div class="recent-grid">
            ${devices.length
              ? devices.map((device) => this._renderRecentDevice(device))
              : html`
                  <div class="recent-empty">
                    ${this._t('devices.new_empty', { hours: NEW_DEVICE_WINDOW_HOURS })}
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
              <span>${this._tp('common.entity', summary.entityCount)}</span>
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
    if (hours < 1) return this._t('devices.added_just_now');
    const relative = new Intl.RelativeTimeFormat(ddLocale(this._hass), { numeric: 'always' });
    if (hours < 24) return relative.format(-hours, 'hour');
    return relative.format(-Math.floor(hours / 24), 'day');
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
        alert(this._t('devices.save_visibility_failed', { error: String(e) }));
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

    .device-view {
      max-width: 1600px;
      margin: 0 auto;
    }

    .overview-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .devices-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 14px;
    }

    .devices-overview-card {
      --domain-color: var(--primary-color);
      min-height: 148px;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--domain-color) 15%, var(--divider-color));
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);
      display: grid;
      grid-template-rows: auto 1fr auto;
      align-items: start;
      text-align: left;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .devices-overview-card::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: color-mix(in srgb, var(--domain-color) 60%, transparent);
    }

    .devices-overview-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--domain-color) 32%, var(--divider-color));
      box-shadow: 0 20px 42px rgba(15, 23, 42, 0.1);
    }

    .overview-card-icon {
      width: 46px;
      height: 46px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
      position: relative;
    }

    .overview-card-icon ha-icon {
      --mdc-icon-size: 25px;
    }

    .overview-card-count {
      position: absolute;
      right: -10px;
      top: -9px;
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--domain-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--domain-color) 32%, transparent);
    }

    .overview-card-copy {
      align-self: end;
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .overview-card-copy strong {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.05;
    }

    .overview-card-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .overview-card-chevron {
      position: absolute;
      right: 14px;
      top: 14px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
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
      width: 100%;
      max-width: none;
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
      margin-bottom: 14px;
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
      --domain-color: ${unsafeCSS(getDomainColor('energy'))};
    }

    .energy-view {
      --domain-color: ${unsafeCSS(getDomainColor('energy'))};
      width: 100%;
      max-width: none;
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
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 14px;
      box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035);
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

    .device-global-actions {
      width: 100%;
      margin: -2px 0 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }

    .device-bulk-action {
      min-height: 36px;
      padding: 0 12px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      font: inherit;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.055),
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .device-bulk-action ha-icon {
      --mdc-icon-size: 17px;
      color: var(--domain-color, var(--primary-color));
    }

    .device-bulk-action.icon-only {
      width: 32px;
      height: 30px;
      min-height: 30px;
      padding: 0;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }

    .person-device-grid {
      margin: 0;
      align-items: start;
    }

    .device-room-groups {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      align-items: start;
    }

    .device-room-groups .device-room-group {
      grid-column: 1 / -1;
      margin-bottom: 0;
      min-width: 0;
    }

    .device-room-groups .device-room-group.half-room {
      grid-column: span 1;
    }

    .device-room-groups .device-room-group.half-room .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
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

    .entities-grid.todo-entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 760px));
      align-items: start;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
      min-width: 0;
    }

    .room-style-entities-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: stretch;
      gap: 8px;
    }

    .room-style-device-view .mobile-entity-avatar {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-radius: inherit;
    }

    /* The location map forms the lower card section and uses two thirds
       of that section's width, centred beneath the identity row. */
    .room-style-device-view .person-location-preview {
      width: 66.666%;
      height: 90px;
      margin-top: 10px;
      align-self: center;
      overflow: hidden;
      border-radius: 8px;
      pointer-events: none;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .room-style-replacement-card {
      min-height: 62px;
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
    /* Compact device headers and stable desktop grids */
    @media (max-width: 1180px) and (min-width: 769px) {
      .room-style-device-view .room-style-entities-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 769px) {
      .content-area {
        scrollbar-gutter: stable;
      }

      .special-device-view .entities-grid,
      .special-device-view .entities-grid.cover-entities-grid,
      .special-device-view .entities-grid.light-entities-grid,
      .special-device-view .entities-grid.sensor-entities-grid,
      .maintenance-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .room-style-device-view .room-style-entities-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .entities-grid.todo-entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .recent-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }






    /* Single mobile contract for the Devices view. */
    @media (max-width: 768px) {
      .content-area {
              padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
            }
      
            .domain-header {
              align-items: center;
              flex-direction: row;
            }
      
            .domain-header-title {
              justify-content: flex-start;
              text-align: left;
            }

      .sidebar {
        position: static;
        width: 100%;
        flex-basis: auto;
        height: auto;
        max-height: none;
        overflow: visible;
        scrollbar-gutter: auto;
        border: 0;
        background: transparent;
        transition: none;
      }
      

      

      
            .mobile-nav-overlay {
              position: fixed;
              inset: 0;
              background: rgba(8, 13, 24, 0.18);
              backdrop-filter: blur(3px);
              z-index: 140;
              opacity: 0;
              pointer-events: none;
              transition: opacity 0.3s ease;
            }
      
            .mobile-nav-overlay.open {
              opacity: 1;
              pointer-events: auto;
            }
      
            .mobile-device-picker-head {
              min-height: 34px;
              margin: 0 2px 8px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
            }
      
            .mobile-device-picker-title {
              min-width: 0;
              color: var(--primary-text-color);
              font-size: 18px;
              font-weight: 850;
              line-height: 1.1;
            }
      
            .mobile-device-picker-close {
              width: 34px;
              height: 34px;
              padding: 0;
              border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex: 0 0 auto;
              background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
              color: var(--primary-text-color);
              cursor: pointer;
            }
      
            .mobile-device-picker-close ha-icon {
              --mdc-icon-size: 21px;
            }
      
            .sidebar .area-list {
              display: grid;
              gap: 6px;
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
              font-weight: 800;
              line-height: 1.1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
      
            .sidebar .device-menu-subtitle,
            .sidebar .device-menu-chevron {
              display: block;
            }
      
            .sidebar .device-menu-subtitle {
              font-weight: 650;
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
      
            :host([data-theme-dark]) {

      

      
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
      
            .special-device-view .entities-grid,
            .special-device-view .entities-grid.cover-entities-grid,
            .special-device-view .entities-grid.light-entities-grid,
            .special-device-view .entities-grid.sensor-entities-grid {
              grid-template-columns: 1fr;
            }
      
            .room-style-device-view .room-style-entities-grid {
              grid-template-columns: 1fr;
              gap: 6px;
            }
      
            .room-style-device-view .domain-group,
            .maintenance-area-group {
              padding: 10px;
              margin-bottom: 10px;
            }
      
            .device-room-groups {
              grid-template-columns: 1fr;
              gap: 10px;
            }
      
            .device-room-groups .device-room-group,
            .device-room-groups .device-room-group.half-room {
              grid-column: 1;
            }
      
            .device-room-groups .device-room-group.half-room .entities-grid {
              grid-template-columns: 1fr !important;
            }
      
            .device-global-actions {
              margin-top: 0;
              justify-content: flex-end;
            }
      
            .device-bulk-action.with-label {
              min-height: 34px;
              padding: 0 10px;
              font-size: 11px;
            }
      
            .devices-overview-view {
              padding: 2px 0;
            }
      
            .devices-overview-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
            }
      
            .devices-overview-card {
              min-height: 128px;
              padding: 14px;
              border-radius: 8px;
            }
      
            .overview-card-icon {
              width: 42px;
              height: 42px;
            }
      
            .overview-card-copy strong {
              font-size: 16px;
              overflow-wrap: anywhere;
            }
      
            .overview-card-copy small {
              white-space: normal;
              line-height: 1.2;
            }
      
            .recent-header,
            .recent-device {
              align-items: stretch;
              grid-template-columns: 1fr;
            }
      
            .recent-header {
              flex-direction: column;
            }
      
            .maintenance-summary {
              width: auto;
            }
      
            .maintenance-grid {
              grid-template-columns: 1fr;
            }
      
            .maintenance-card {
              min-height: 62px;
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

      /* Match the Startseite top position and compact header height. */
            .content-area {
              padding-top: 10px !important;
            }
      
            /* Thermostat cards occupy half the phone width, while preserving the
               native card's internal width through the same 70% scaling. */
            .entities-grid.climate-entities-grid,
            .device-room-groups .device-room-group.half-room .entities-grid.climate-entities-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
            }
      
            .climate-entity-card {
              width: 100% !important;
              min-width: 0 !important;
              overflow: visible !important;
            }
    }
`;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-devices-card': DwainsDevicesCard;
  }
}
