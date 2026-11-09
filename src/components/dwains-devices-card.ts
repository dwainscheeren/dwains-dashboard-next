import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import type {
  DwainsDashboardConfig,
  AreaConfig,
  EntityConfig,
} from '../types/strategy';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import { sortAreas } from '../utils/area-entities';
import { isHiddenAsUnavailable } from '../utils/entity-availability';
import { getDevicesPageHiddenEntityIdSet, isConfigEntityInArea } from '../utils/entity-lookups';
import { updateStoredDashboardStrategy } from '../utils/dashboard-config-store';
import { isNonAdminUser } from '../utils/security';
import { getAreaIcon, getDomainIcon, getDeviceClassIcon, getDomainColor } from '../utils/icons';
import { getDomainName, getDeviceClassName } from '../utils/domain-names';
import { findReplacementAssignment, resolveEntityCardConfig } from '../utils/blueprint-replacements';
import { withTileTapActions } from '../utils/tile-tap';
import { areaEntityDisplayName } from '../utils/entity-names';
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
import type { HousePowerUsageSummary } from '../utils/power-usage';
import { subscribeEnergyPowerConfig } from '../utils/energy-prefs';
import { isRegistryEntryVisible } from '../utils/entity-visibility';
import { syncHassDarkThemeAttribute } from '../utils/theme';
import { formatValueWithUnit } from '../utils/unit-format';
import { TRANSLATIONS_LOADED_EVENT } from '../i18n';
import './utils/dd-card-host';
import { sharedHousePowerUsage } from './ui/dd-house-power-panel';
import { getEntityRegistry } from '../utils/entity-registry';
import { pageHeaderStyles } from './styles/page-header-styles';
import { roomActionStyles } from './styles/room-action-styles';
import { showConfirmDialog } from './utils/confirm-dialog';
import { masterActionConfirmationEnabled } from '../utils/master-action-confirmations';
import {
  countActiveEntities,
  getRoomAction,
  hasRoomAction,
  isDestructiveBulkAction,
  isRoomActionEntityActive,
  roomActionNeedsConfirmation,
  type BulkDomainAction,
} from '../utils/home-information';

const NEW_DEVICES_KEY = '__new_devices__';
const MAINTENANCE_KEY = '__maintenance__';
const MAINTENANCE_AREA_KEY = '__maintenance_no_area__';
const ENERGY_KEY = 'energy';
const DEVICES_OVERVIEW_KEY = '__overview__';
const LOW_BATTERY_THRESHOLD = 20;
const PERSON_DOMAIN = 'person';
const PERSON_AREA_KEY = '__people__';
// Delay before recording first seen devices, so a burst of renders saves once.
const DEVICE_TRACKING_DELAY_MS = 500;
/** Default card types that accept a `name` option. */
const NAMED_DEFAULT_CARD_TYPES: ReadonlySet<string> = new Set(['tile', 'thermostat', 'picture-entity', 'sensor']);

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

/** One device group, shown in the sidebar and on the overview. */
interface DeviceGroupCard {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  /** Extra class for the sidebar button. */
  className?: string;
  /** Short value in the sidebar badge (the subtitle is hidden there on desktop). */
  badge?: string;
  /** Number on the overview card icon, only for groups that need attention. */
  alertCount?: number;
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

  private _deviceTrackingTimer?: number;
  private _resizeHandler = () => this._checkMobile();
  private _locationHandler = () => this._handleLocationChanged();
  private _energyConfigUnsub?: () => void;

  // hass-setter zoals dwains-dashboard-next-page-card: werk child dwains-dashboard-next-card-host-elementen bij
  // i.p.v. een volledige re-render te forceren.
  set hass(hass: any) {
    this._hass = hass;
    this._syncThemeAttribute();
    ensureBottomNav(hass, this.config?.settings);
    this._syncBottomNavDeviceContext();
    const hosts = this.renderRoot?.querySelectorAll(
      'dwains-dashboard-next-card-host, dwains-dashboard-next-house-power-panel, dwains-dashboard-next-house-power-total'
    );
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
      const showEnergyMenu = this._showEnergyMenu();
      if (urlDomain === NEW_DEVICES_KEY) {
        this._selectedDomain = NEW_DEVICES_KEY;
      } else if (urlDomain === MAINTENANCE_KEY) {
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
    this._syncThemeAttribute(true);
    this._checkMobile();
    window.addEventListener(TRANSLATIONS_LOADED_EVENT, this._handleTranslationsLoaded);
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('dwains-dashboard-next-toggle-devices-nav', this._handleDevicesNavToggle);
    window.addEventListener('dwains-dashboard-next-select-device-domain', this._handleSelectDeviceDomain as EventListener);
    window.addEventListener('dwains-dashboard-next-open-devices-overview', this._handleOpenOverview);
    window.addEventListener('location-changed', this._locationHandler);
    window.addEventListener('popstate', this._locationHandler);
    // The house power total switches to the energy settings once they are loaded.
    this._energyConfigUnsub = subscribeEnergyPowerConfig(() => this.requestUpdate());
    this._handleLocationChanged();
    this._syncBottomNavDeviceContext();
  }

  private _handleTranslationsLoaded = (): void => {
    this.requestUpdate();
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(TRANSLATIONS_LOADED_EVENT, this._handleTranslationsLoaded);
    window.removeEventListener('resize', this._resizeHandler);
    window.removeEventListener('dwains-dashboard-next-toggle-devices-nav', this._handleDevicesNavToggle);
    window.removeEventListener('dwains-dashboard-next-select-device-domain', this._handleSelectDeviceDomain as EventListener);
    window.removeEventListener('dwains-dashboard-next-open-devices-overview', this._handleOpenOverview);
    window.removeEventListener('location-changed', this._locationHandler);
    window.removeEventListener('popstate', this._locationHandler);
    if (this._deviceTrackingTimer !== undefined) {
      window.clearTimeout(this._deviceTrackingTimer);
      this._deviceTrackingTimer = undefined;
    }
    this._energyConfigUnsub?.();
    this._energyConfigUnsub = undefined;
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

  /** The back button of the bottom navigation. */
  private _handleOpenOverview = () => {
    this._selectDomain(DEVICES_OVERVIEW_KEY);
  };

  private _handleSelectDeviceDomain = (event: CustomEvent<{ domain?: string }>) => {
    const domain = event.detail?.domain;
    if (!domain) return;

    this._pendingDomainSelection = domain;
    this._applyPendingDomainSelection();
    this.requestUpdate();
  };

  // ---- Databouw + filtering -------------------------------------------------

  // Replica van layout-card._getAreaEntities (zonder cache): verzamelt de
  // entiteiten van een area op basis van entity.area_id, of anders het area_id
  // van het bijbehorende device, en slaat hidden/diagnostic/config over.
  private _getAreaEntities(areaId: string): EntityConfig[] {
    const entities: EntityConfig[] = [];
    const processedEntities = new Set<string>();

    const config = this.config;
    if (config?.entities) {
      config.entities.forEach((entity) => {
        if (isConfigEntityInArea(config, entity, areaId)) {
          if (!isRegistryEntryVisible(getEntityRegistry(this._hass)[entity.entity_id])) {
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
        if (!isRegistryEntryVisible(getEntityRegistry(this._hass)[state.entity_id])) {
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

    // Same registry rules as the room pages (hidden, disabled, config and diagnostic).
    filteredEntities = filteredEntities.filter((entity) =>
      isRegistryEntryVisible(getEntityRegistry(this._hass)[entity.entity_id])
    );

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
        return state && !isHiddenAsUnavailable(state);
      });
    }

    filteredEntities = filterHiddenDeviceEntities(this._hass, this.config, filteredEntities);

    // Entities hidden for this page only in the Devices page settings.
    const hiddenOnDevicesPage = getDevicesPageHiddenEntityIdSet(this.config);
    if (hiddenOnDevicesPage.size) {
      filteredEntities = filteredEntities.filter((entity) => !hiddenOnDevicesPage.has(entity.entity_id));
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

      const registry = getEntityRegistry(this._hass)[entityId];
      // Diagnostic battery sensors do count here, hidden and disabled entities do not.
      if (registry?.hidden_by || registry?.hidden === true || registry?.disabled_by) return;

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
      parts.push(this._tp('devices.low_battery', summary.lowBatteryCount));
    }
    if (summary.unavailableDeviceCount) {
      parts.push(this._tp('devices.unavailable_device', summary.unavailableDeviceCount));
    }
    return parts.length ? parts.join(', ') : this._t('devices.all_good');
  }

  /** Energy is only listed when there is a power total to show. */
  private _showEnergyMenu(summary: HousePowerUsageSummary = this._energySummary()): boolean {
    return summary.sensorCount > 0;
  }

  /**
   * New devices is only listed when there are new devices, or when the
   * panel was switched on explicitly in the settings.
   */
  private _showNewDevicesMenu(newDevices: RecentDeviceSummary[] = this._newDevices()): boolean {
    if (!shouldShowRecentDevicesPanel(this.config)) return false;
    return newDevices.length > 0 || this.config?.settings?.show_recent_devices_panel === true;
  }

  private _energySummary(): HousePowerUsageSummary {
    return sharedHousePowerUsage(this._hass, this.config);
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
        return isRegistryEntryVisible(getEntityRegistry(this._hass)[entity.entity_id]);
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
    if (key === MAINTENANCE_KEY) return this._t('devices.maintenance');
    if (key === ENERGY_KEY) return this._t('devices.energy');
    if (key === DEVICES_OVERVIEW_KEY) return this._t('navigation.overview');
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
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassIcon('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainIcon(key);
  }

  private _typeColor(key: string): string {
    if (key === MAINTENANCE_KEY) return 'var(--warning-color, #ff9800)';
    if (key === ENERGY_KEY) return '#d88e20';
    if (key === DEVICES_OVERVIEW_KEY) return 'var(--primary-color)';
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
        overview: domain === DEVICES_OVERVIEW_KEY || !domain,
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
    this._scheduleDeviceTracking();
  }

  private _syncThemeAttribute(force = false): void {
    syncHassDarkThemeAttribute(this, this._hass, force);
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
    const canShowNewDevices = showNewDevicesMenu ?? this._showNewDevicesMenu();
    // Maintenance is always listed ("Everything looks good" when empty).
    const canShowMaintenance = showMaintenanceMenu ?? true;
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

  private _entityCardConfig(entityId: string, areaName?: string): any {
    if (entityId.startsWith('todo.')) {
      return { type: 'todo-list', entity: entityId };
    }

    const params = {
      hass: this._hass,
      config: this.config,
      entity: entityId,
      surface: 'devices_cards' as const,
    };
    const assignment = findReplacementAssignment(params);
    // Blueprint replacements keep their own naming and actions.
    if (assignment && assignment.enabled !== false) return resolveEntityCardConfig(params);

    // A standard tile follows the "Tapping a tile" setting.
    const cardConfig = withTileTapActions(resolveEntityCardConfig(params), this.config?.settings);
    // The area group already shows the area, so the default cards drop it from
    // the entity name.
    if (!areaName || !NAMED_DEFAULT_CARD_TYPES.has(cardConfig.type) || cardConfig.name !== undefined) {
      return cardConfig;
    }

    const fullName = this._hass.states?.[entityId]?.attributes?.friendly_name;
    if (typeof fullName !== 'string' || !fullName) return cardConfig;
    const name = areaEntityDisplayName(fullName, areaName, this.config?.settings);
    return name === fullName ? cardConfig : { ...cardConfig, name };
  }

  // ---- Selectie -------------------------------------------------------------

  private _selectDomain(domain: string) {
    const changed = this._selectedDomain !== domain;
    this._pendingDomainSelection = null;
    this._selectedDomain = domain;
    this._updateUrlDomain(domain === DEVICES_OVERVIEW_KEY ? null : domain);
    this._syncBottomNavDeviceContext();
    this._closeMobileNav();
    if (changed) this._scrollToTop();
  }

  /** A new group starts at the top: the content area on wide screens, the page on phones. */
  private _scrollToTop(): void {
    const contentArea = this.shadowRoot?.querySelector('.content-area') as HTMLElement | null;
    if (contentArea) contentArea.scrollTop = 0;
    if (this._isMobile && window.scrollY > 0) window.scrollTo(0, 0);
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
      return html`<div class="loading">${this._t('common.loading')}</div>`;
    }

    const data = this._buildData();
    const domains = this._sortedDomains(data);
    const newDevices = this._newDevices();
    const showNewDevicesMenu = this._showNewDevicesMenu(newDevices);
    const maintenance = this._buildMaintenanceData();
    const showMaintenanceMenu = true;
    const energySummary = this._energySummary();
    const showEnergyMenu = this._showEnergyMenu(energySummary);
    this._applyPendingDomainSelection(data, showNewDevicesMenu, showMaintenanceMenu, showEnergyMenu);
    const groups = this._deviceGroupCards(
      data, domains, newDevices, showNewDevicesMenu, maintenance, energySummary, showEnergyMenu
    );

    if (!groups.length) {
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
    if (this._selectedDomain === DEVICES_OVERVIEW_KEY) {
      // Always valid.
    } else if (this._selectedDomain === NEW_DEVICES_KEY) {
      if (!showNewDevicesMenu) {
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
    } else if (this._selectedDomain === MAINTENANCE_KEY) {
      // Always listed.
    } else if (this._selectedDomain === ENERGY_KEY) {
      if (!showEnergyMenu) {
        this._selectedDomain = DEVICES_OVERVIEW_KEY;
      }
    } else if (!this._selectedDomain || !data.has(this._selectedDomain)) {
      this._selectedDomain = DEVICES_OVERVIEW_KEY;
    }

    return html`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar(groups)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain === NEW_DEVICES_KEY
              ? this._renderNewDevicesView(newDevices)
              : this._selectedDomain === MAINTENANCE_KEY
                ? this._renderMaintenanceView(maintenance)
              : this._selectedDomain === ENERGY_KEY
                ? this._renderEnergyView()
              : this._selectedDomain === DEVICES_OVERVIEW_KEY
                ? this._renderDevicesOverview(groups)
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

  /**
   * Every device group, in sidebar and overview order. The sidebar badge of
   * the overview and the "N device groups" line both count this list.
   */
  private _deviceGroupCards(
    data: Map<string, Map<string, { area: AreaConfig; entities: EntityConfig[] }>>,
    domains: string[],
    newDevices: RecentDeviceSummary[],
    showNewDevicesMenu: boolean,
    maintenance: Map<string, MaintenanceBucket>,
    energySummary: HousePowerUsageSummary,
    showEnergyMenu: boolean
  ): DeviceGroupCard[] {
    const cards: DeviceGroupCard[] = [];

    if (showNewDevicesMenu) {
      cards.push({
        key: NEW_DEVICES_KEY,
        icon: 'mdi:new-box',
        title: this._t('devices.new'),
        subtitle: this._tp('devices.new', newDevices.length),
        color: 'var(--primary-color)',
        className: 'new-devices',
        badge: String(newDevices.length),
      });
    }

    const maintenanceSummary = this._maintenanceSummary(maintenance);
    cards.push({
      key: MAINTENANCE_KEY,
      icon: 'mdi:wrench',
      title: this._t('devices.maintenance'),
      subtitle: this._maintenanceSubtitle(maintenance),
      color: this._typeColor(MAINTENANCE_KEY),
      className: 'maintenance',
      badge: maintenanceSummary.totalCount ? String(maintenanceSummary.totalCount) : undefined,
      alertCount: maintenanceSummary.totalCount || undefined,
    });

    if (showEnergyMenu) {
      cards.push({
        key: ENERGY_KEY,
        icon: 'mdi:flash',
        title: this._t('devices.energy'),
        subtitle: energySummary.formattedTotal,
        color: this._typeColor(ENERGY_KEY),
        className: 'energy',
        badge: energySummary.formattedTotal,
      });
    }

    domains.forEach((domain) => {
      const byArea = data.get(domain);
      if (!byArea) return;
      const count = this._domainCount(byArea);
      if (!count) return;
      cards.push({
        key: domain,
        icon: this._typeIcon(domain),
        title: this._typeName(domain),
        subtitle: this._tp('common.entity', count),
        color: this._typeColor(domain),
        badge: String(count),
      });
    });

    return cards;
  }

  private _renderSidebar(groups: DeviceGroupCard[]) {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen,
    };

    return html`
      <nav class=${classMap(classes)}>
        <div class="sidebar-title">${this._t('devices.title')}</div>
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
              <div class="device-menu-subtitle">${this._tp('devices.group', groups.length)}</div>
            </div>
            <span class="domain-count">${groups.length}</span>
            <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
          ${repeat(
            groups,
            (group) => group.key,
            (group) => html`
              <button
                class="area-button ${group.className || ''} ${this._selectedDomain === group.key ? 'selected' : ''}"
                style=${`--domain-color: ${group.color};`}
                @click=${() => this._selectDomain(group.key)}
              >
                <div class="area-icon">
                  <ha-icon icon=${group.icon}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${group.title}</div>
                  <div class="device-menu-subtitle">${group.subtitle}</div>
                </div>
                ${group.badge ? html`<span class="domain-count">${group.badge}</span>` : nothing}
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `
          )}
        </div>
      </nav>
    `;
  }

  private _renderDevicesOverview(groups: DeviceGroupCard[]) {
    return html`
      <div class="device-view devices-overview-view">
        ${this._renderDevicePageHeader({
          icon: 'mdi:format-list-bulleted-type',
          title: this._t('devices.title'),
          subtitle: this._tp('devices.group', groups.length),
          color: this._typeColor(DEVICES_OVERVIEW_KEY),
        })}

        <div class="devices-overview-grid">
          ${repeat(
            groups,
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
                  ${card.alertCount ? html`<span class="overview-card-count">${card.alertCount}</span>` : nothing}
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

  /**
   * Page header in the same style as the room pages (see page-header-styles).
   * Small actions such as a count sit at the top right; wider content such as
   * the energy total or the maintenance summary moves below the title on
   * phones.
   */
  private _renderDevicePageHeader(options: {
    icon: string;
    title: string;
    subtitle?: string;
    color: string;
    back?: boolean;
    actions?: unknown;
    wideActions?: boolean;
    className?: string;
  }) {
    const classes = ['dd-page-header', 'device-page-header'];
    if (options.className) classes.push(options.className);

    return html`
      <header class=${classes.join(' ')} style=${`--domain-color: ${options.color};`}>
        <div class="dd-page-header-top">
          ${options.back ? html`
            <button
              class="dd-page-header-button dd-page-header-back"
              type="button"
              title=${this._t('navigation.back_devices')}
              aria-label=${this._t('navigation.back_devices')}
              @click=${() => this._selectDomain(DEVICES_OVERVIEW_KEY)}
            >
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          ` : nothing}
          <div class="dd-page-header-identity">
            <span class="dd-page-header-icon">
              <ha-icon icon=${options.icon}></ha-icon>
            </span>
            <div class="dd-page-header-copy">
              <h1 class="dd-page-header-title">${options.title}</h1>
              ${options.subtitle ? html`
                <div class="dd-page-header-subtitle"><span>${options.subtitle}</span></div>
              ` : nothing}
            </div>
          </div>
          ${options.actions ? html`
            <div class="dd-page-header-actions ${options.wideActions ? 'is-content' : ''}">${options.actions}</div>
          ` : nothing}
        </div>
      </header>
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
        ${this._renderDevicePageHeader({
          icon: this._typeIcon(domain),
          title: this._typeName(domain),
          subtitle: this._tp('common.entity', this._domainCount(byArea)),
          color: this._typeColor(domain),
          back: true,
        })}

        ${orderedAreas.map((area) => {
          const bucket = byArea.get(area.area_id)!;
          return html`
            <div class="domain-group">
              <div class="domain-header" style=${`--room-accent: ${this._typeColor(domain)};`}>
                <div class="domain-header-title">
                  <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                  <span>${area.name}</span>
                </div>
                ${this._renderRoomAction(area, domain, bucket.entities)}
              </div>
              <div class=${this._entitiesGridClass(domain)}>
                ${repeat(
                  bucket.entities,
                  (e) => e.entity_id,
                  (entity) => this._renderEntityCard(entity, domain === PERSON_DOMAIN ? undefined : area.name)
                )}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  /**
   * The action of one room on a device page: an "active/total" switch for
   * lights, switches and fans (when the room has more than one), open/close
   * for covers and lock/unlock for locks.
   */
  private _renderRoomAction(area: AreaConfig, domain: string, entities: EntityConfig[]) {
    if (!hasRoomAction(domain)) return nothing;
    const entityIds = entities.map((entity) => entity.entity_id).filter((entityId) => this._hass.states[entityId]);
    const activeCount = countActiveEntities(entityIds, (entityId) =>
      isRoomActionEntityActive(this._hass.states[entityId], domain)
    );
    const action = getRoomAction(domain, activeCount, entityIds.length);
    if (!action) return nothing;

    if (action.mode === 'toggle') {
      const label = this._t(action.action === 'turn_off' ? 'action.turn_off_all' : 'action.turn_on_all');
      return html`
        <button
          class="room-toggle ${action.checked ? 'is-on' : ''}"
          type="button"
          role="switch"
          aria-checked=${action.checked ? 'true' : 'false'}
          aria-label=${`${area.name}: ${this._t('area_header.on_count', { active: action.activeCount, total: action.totalCount })}`}
          title=${label}
          @click=${() => void this._runRoomAction(area, domain, entityIds, action.action, label)}
        >
          <span aria-hidden="true">${action.activeCount}/${action.totalCount}</span>
          <span class="room-toggle-track" aria-hidden="true"></span>
        </button>
      `;
    }

    return html`
      <div class="room-segmented" role="group" aria-label=${area.name}>
        ${action.items.map((item) => {
          const label = this._t(item.labelKey);
          return html`
            <button
              class="room-segment ${item.current ? 'is-current' : ''}"
              type="button"
              title=${label}
              aria-label=${this._t('action.entity_action', { action: label, name: area.name })}
              @click=${() => void this._runRoomAction(area, domain, entityIds, item.action, label)}
            >
              <ha-icon icon=${item.icon} aria-hidden="true"></ha-icon>
            </button>
          `;
        })}
      </div>
    `;
  }

  /** Unlocking always asks first; the rest follows the master action confirmations. */
  private async _runRoomAction(
    area: AreaConfig,
    domain: string,
    entityIds: string[],
    action: BulkDomainAction,
    label: string
  ): Promise<void> {
    if (!entityIds.length) return;
    const confirmationEnabled = masterActionConfirmationEnabled(this.config?.settings, domain);
    if (roomActionNeedsConfirmation(action, confirmationEnabled)) {
      const confirmed = await showConfirmDialog(this, {
        hass: this._hass,
        title: label,
        message: this._t('action.confirm_master_action', { count: entityIds.length, area: area.name }),
        confirmLabel: label,
        destructive: isDestructiveBulkAction(action),
      });
      if (!confirmed) return;
    }

    try {
      await this._hass.callService(domain, action, { entity_id: entityIds });
    } catch (err) {
      console.warn(`Failed to run ${action} for ${domain}:`, err);
      fireEvent(this, 'hass-notification', { message: this._t('entity.group_failed') });
    }
  }

  private _renderEnergyView() {
    return html`
      <div class="device-view energy-view">
        ${this._renderDevicePageHeader({
          icon: 'mdi:flash',
          title: this._t('devices.energy'),
          subtitle: this._t('devices.live_power_usage'),
          color: this._typeColor(ENERGY_KEY),
          back: true,
          wideActions: true,
          actions: html`
            <dwains-dashboard-next-house-power-total
              .hass=${this._hass}
              .config=${this.config}
            ></dwains-dashboard-next-house-power-total>
          `,
        })}

        <dwains-dashboard-next-house-power-panel
          navigable-areas
          .hass=${this._hass}
          .config=${this.config}
          @dd-power-area-selected=${(event: CustomEvent<{ areaId: string }>) => this._navigateToArea(event.detail.areaId)}
        ></dwains-dashboard-next-house-power-panel>
      </div>
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

  private _renderEntityCard(entity: EntityConfig, areaName?: string) {
    const state = this._hass.states[entity.entity_id];
    if (!state) return nothing;

    return html`
      <div class="${this._entityWrapperClass(entity.entity_id)}">
        <dwains-dashboard-next-card-host
          .hass=${this._hass}
          .config=${this._entityCardConfig(entity.entity_id, areaName)}
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
          actions: html`<span class="device-header-count">${devices.length}</span>`,
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

  /**
   * Users that can not save the dashboard are skipped: Home Assistant only
   * lets administrators save a dashboard config.
   */
  private _canTrackDevices(): boolean {
    return Boolean(this._hass && this.config && !isNonAdminUser(this._hass));
  }

  /** Records first seen devices after rendering, at most once per burst of renders. */
  private _scheduleDeviceTracking(): void {
    if (this._deviceTrackingTimer !== undefined || !this._canTrackDevices()) return;
    this._deviceTrackingTimer = window.setTimeout(() => {
      this._deviceTrackingTimer = undefined;
      this._ensureDeviceTracking();
    }, DEVICE_TRACKING_DELAY_MS);
  }

  private _ensureDeviceTracking(): void {
    if (!this._canTrackDevices()) return;
    const nextAdmission = ensureDeviceFirstSeenTracking(this._hass, this.config);
    if (!nextAdmission) return;
    this.config = {
      ...this.config,
      device_admission: nextAdmission,
    };
    this.requestUpdate();
    void this._saveDeviceFirstSeen();
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

  private async _saveDeviceFirstSeen(): Promise<void> {
    const hass = this._hass;
    const config = this.config;
    if (!config) return;

    try {
      // Queued behind other dashboard saves. The tracking is applied to the
      // latest stored admission, so hidden devices changed meanwhile are kept.
      await updateStoredDashboardStrategy(hass, this._getDashboardUrlPath(), (strategy) => {
        const stored = strategy || {};
        const nextAdmission = ensureDeviceFirstSeenTracking(hass, {
          ...config,
          device_admission: stored.device_admission,
        });
        return nextAdmission ? { ...stored, device_admission: nextAdmission } : null;
      });
    } catch (e) {
      console.error('❌ Device visibility save failed:', e);
    }
  }

  static override styles = [css`
    /* Fill the space below the Home Assistant toolbar, like the room pages.
       Only the sidebar and the content area scroll, so the page itself never
       gets a second scrollbar. */
    :host {
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
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
      height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
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
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 16px;
      /* Set while the bottom navigation is shown on wide screens (wall tablet mode). */
      padding-bottom: var(--dd-next-bottom-nav-space, 16px);
    }
    @media (max-width: 768px) {
      /* Phones scroll the page itself, like the room pages. */
      :host {
        height: auto;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container {
        display: block;
        height: auto;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content {
        display: block;
        overflow: visible;
      }

      .content-area {
        padding: 0 10px calc(104px + env(safe-area-inset-bottom, 0px));
        overflow: visible;
      }

      .domain-header {
        flex-wrap: wrap;
      }
    }

    /* Same width as the room pages. */
    .device-view {
      max-width: 1400px;
      margin: 0 auto;
    }

    .device-header-count {
      min-width: 40px;
      height: 40px;
      padding: 0 12px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: color-mix(in srgb, var(--domain-color) 14%, var(--card-background-color));
      color: color-mix(in srgb, var(--domain-color) 82%, var(--primary-text-color));
      font-size: 15px;
      font-weight: 750;
      font-variant-numeric: tabular-nums;
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

    .entities-grid.todo-entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 760px));
      align-items: start;
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

      :host([data-theme-dark]) {
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

      .maintenance-grid {
        grid-template-columns: 1fr;
      }

      .maintenance-card {
        min-height: 62px;
      }

    }
  `, pageHeaderStyles, roomActionStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-devices-card': DwainsDevicesCard;
  }
}
