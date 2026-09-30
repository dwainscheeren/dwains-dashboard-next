import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { getAreaConfigMap, getDeviceConfigMap, getEntityConfigMap } from './entity-lookups';
import { isEntityVisibleInArea } from './entity-visibility';
import { getEnergyPowerConfig, type EnergyPowerConfig, type PowerTerm } from './energy-prefs';
import { getAreaIcon } from './icons';
import { getDomainStates } from './state-index';
import { getEntityRegistry } from './entity-registry';

export interface PowerEntitySummary {
  entityId: string;
  name: string;
  areaId: string;
  areaName: string;
  icon: string;
  watts: number;
  formatted: string;
  unit: string;
  stateClass?: string;
}

export interface PowerAreaSummary {
  areaId: string;
  name: string;
  icon: string;
  totalWatts: number;
  formattedTotal: string;
  entities: PowerEntitySummary[];
  percentage: number;
}

/** A sensor from the Home Assistant energy settings that the house total is based on. */
export interface PowerSourceSummary {
  entityId: string;
  name: string;
  role: 'grid' | 'solar' | 'battery';
  /** Signed reading of the sensor itself, in watts. */
  watts: number;
  /** -1 when the reading is subtracted (grid export, battery charging). */
  sign: 1 | -1;
}

export interface HousePowerUsageSummary {
  totalWatts: number;
  formattedTotal: string;
  /** Number of live power sensors the total is based on (0 when there is no total). */
  sensorCount: number;
  areas: PowerAreaSummary[];
  /** 'energy' when the total comes from the energy settings, 'rooms' when it is the sum of the rooms. */
  basis: 'energy' | 'rooms';
  /** Energy settings sensors used for the total (empty for 'rooms'). */
  sources: PowerSourceSummary[];
  /** Live power sensors in the rooms (the per-room breakdown). */
  roomSensorCount: number;
  /** Sum of the per-room breakdown. */
  roomTotalWatts: number;
}

const UNIT_TO_WATTS: Record<string, number> = {
  mW: 0.001,
  W: 1,
  kW: 1000,
  MW: 1000000,
};

/**
 * House power usage and the per-room breakdown.
 *
 * When the Home Assistant energy settings have a grid power sensor, the total
 * is the house consumption computed from the energy settings:
 *
 *   total = grid + solar + battery   (clamped at 0)
 *
 * where grid is the net grid power (import minus export), solar the solar
 * production and battery the net battery power (discharge minus charge).
 * Unavailable solar or battery sensors count as 0. Otherwise the total is the
 * sum of the power sensors in the visible rooms.
 *
 * The rooms always come from the power sensors in the rooms. Sensors of the
 * grid meter, solar inverter and battery devices from the energy settings are
 * left out there, because they measure the whole house or production rather
 * than a consumer.
 */
export function buildHousePowerUsage(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | undefined,
  energy: EnergyPowerConfig | null | undefined = getEnergyPowerConfig(hass)
): HousePowerUsageSummary {
  const entities = getLivePowerEntities(hass, config, getMeterExclusions(hass, config, energy));
  const areas = new Map<string, PowerAreaSummary>();
  const areasById = getAreaConfigMap(config);

  entities.forEach((entity) => {
    let area = areas.get(entity.areaId);
    const configArea = areasById.get(entity.areaId);
    if (!area) {
      area = {
        areaId: entity.areaId,
        name: entity.areaName,
        icon: configArea ? getAreaIcon(configArea) : 'mdi:home',
        totalWatts: 0,
        formattedTotal: '0 W',
        entities: [],
        percentage: 0,
      };
      areas.set(entity.areaId, area);
    }

    area.totalWatts += entity.watts;
    area.entities.push(entity);
  });

  const sortedAreas = [...areas.values()]
    .map((area) => {
      const sortedEntities = [...area.entities].sort((a, b) => b.watts - a.watts);
      return {
        ...area,
        formattedTotal: formatPowerWatts(area.totalWatts),
        entities: sortedEntities,
      };
    })
    .filter((area) => area.totalWatts > 0)
    .sort((a, b) => b.totalWatts - a.totalWatts);

  const roomTotalWatts = sortedAreas.reduce((total, area) => total + area.totalWatts, 0);
  const maxAreaWatts = Math.max(...sortedAreas.map((area) => area.totalWatts), 0);
  const areasWithPercent = sortedAreas.map((area) => ({
    ...area,
    percentage: maxAreaWatts > 0
      ? Math.max(6, Math.min(100, Math.round((area.totalWatts / maxAreaWatts) * 100)))
      : 0,
  }));

  const energyTotal = hass ? computeEnergyHousePower(hass, energy) : null;
  if (energyTotal) {
    return {
      totalWatts: energyTotal.watts,
      formattedTotal: formatPowerWatts(energyTotal.watts),
      sensorCount: energyTotal.sources.length,
      areas: areasWithPercent,
      basis: 'energy',
      sources: energyTotal.sources,
      roomSensorCount: entities.length,
      roomTotalWatts,
    };
  }

  return {
    totalWatts: roomTotalWatts,
    formattedTotal: entities.length ? formatPowerWatts(roomTotalWatts) : '',
    sensorCount: entities.length,
    areas: areasWithPercent,
    basis: 'rooms',
    sources: [],
    roomSensorCount: entities.length,
    roomTotalWatts,
  };
}

function readPowerTerms(
  hass: HomeAssistant,
  terms: PowerTerm[],
  role: PowerSourceSummary['role']
): { watts: number; sources: PowerSourceSummary[] } | null {
  let watts = 0;
  const sources: PowerSourceSummary[] = [];
  for (const term of terms) {
    const state = hass.states?.[term.entityId];
    const value = getSignedPowerValueWatts(state);
    if (value === null) continue;
    watts += term.sign * value;
    sources.push({
      entityId: term.entityId,
      name: state?.attributes?.friendly_name || term.entityId,
      role,
      watts: value,
      sign: term.sign,
    });
  }
  return sources.length ? { watts, sources } : null;
}

/**
 * House consumption from the energy settings: net grid power plus solar
 * production plus net battery power. Null when no grid power sensor is
 * configured or none of them has a numeric state.
 */
export function computeEnergyHousePower(
  hass: HomeAssistant,
  energy: EnergyPowerConfig | null | undefined
): { watts: number; sources: PowerSourceSummary[] } | null {
  if (!energy?.grid.length) return null;
  const grid = readPowerTerms(hass, energy.grid, 'grid');
  if (!grid) return null;

  const solar = readPowerTerms(hass, energy.solar, 'solar');
  const battery = readPowerTerms(hass, energy.battery, 'battery');
  const watts = grid.watts + Math.max(0, solar?.watts ?? 0) + (battery?.watts ?? 0);

  return {
    watts: Math.max(0, watts),
    sources: [...grid.sources, ...(solar?.sources ?? []), ...(battery?.sources ?? [])],
  };
}

interface MeterExclusions {
  entityIds: ReadonlySet<string>;
  deviceIds: ReadonlySet<string>;
  keep: ReadonlySet<string>;
}

const NO_EXCLUSIONS: MeterExclusions = { entityIds: new Set(), deviceIds: new Set(), keep: new Set() };

/**
 * Sensors that are not a consumer in a room: the grid, solar and battery
 * sensors of the energy settings and every other power sensor of their
 * devices (a P1 meter also reports phase power, peaks and so on). Power
 * sensors of individual devices in the energy settings are always kept.
 */
function getMeterExclusions(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | undefined,
  energy: EnergyPowerConfig | null | undefined
): MeterExclusions {
  if (!energy) return NO_EXCLUSIONS;
  const configEntities = getEntityConfigMap(config);
  const entityIds = new Set<string>(energy.sourceEntityIds);
  [...energy.grid, ...energy.solar, ...energy.battery].forEach((term) => entityIds.add(term.entityId));
  const deviceIds = new Set<string>();
  entityIds.forEach((entityId) => {
    const deviceId = getEntityRegistry(hass)[entityId]?.device_id || configEntities.get(entityId)?.device_id;
    if (deviceId) deviceIds.add(deviceId);
  });
  return { entityIds, deviceIds, keep: new Set(energy.deviceRateEntityIds) };
}

function isMeterEntity(
  hass: HomeAssistant,
  entityId: string,
  entityConfig: EntityConfig | undefined,
  exclusions: MeterExclusions
): boolean {
  const registry = getEntityRegistry(hass)[entityId];
  // Sensors made by the energy integration are always derived grid or battery values.
  if (registry?.platform === 'energy') return true;
  if (exclusions.keep.has(entityId)) return false;
  if (exclusions.entityIds.has(entityId)) return true;
  if (!exclusions.deviceIds.size) return false;
  const deviceId = entityConfig?.device_id || registry?.device_id;
  return Boolean(deviceId && exclusions.deviceIds.has(deviceId));
}

export function getLivePowerEntities(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | undefined,
  exclusions: MeterExclusions = NO_EXCLUSIONS
): PowerEntitySummary[] {
  if (!hass?.states) return [];

  const configEntities = getEntityConfigMap(config);
  const areasById = getAreaConfigMap(config);

  // Only sensors can report live power (see getLivePowerValueWatts).
  return getDomainStates(hass.states, 'sensor')
    .map((state) => {
      const watts = getLivePowerValueWatts(state);
      if (watts === null) return undefined;
      const entityId = state.entity_id;
      const configEntity = configEntities.get(entityId);
      if (isMeterEntity(hass, entityId, configEntity, exclusions)) return undefined;

      const areaId = resolvePowerEntityAreaId(hass, config, entityId, configEntity);
      if (!areaId) return undefined;
      if (!isEntityVisibleInArea(hass, config, entityId, areaId, configEntity)) return undefined;

      const area = areasById.get(areaId);
      if (!area) return undefined;

      const stateClass = normalizeStateClass(state.attributes?.state_class);
      const entity: PowerEntitySummary = {
        entityId,
        name: state.attributes?.friendly_name || entityId,
        areaId,
        areaName: area.name,
        icon: state.attributes?.icon || 'mdi:flash',
        watts,
        formatted: formatPowerWatts(watts),
        unit: normalizePowerUnit(state.attributes?.unit_of_measurement) || 'W',
      };
      if (stateClass) entity.stateClass = stateClass;
      return entity;
    })
    .filter((entity): entity is PowerEntitySummary => Boolean(entity));
}

export function getLivePowerValueWatts(state: HassEntity | undefined): number | null {
  if (!state?.entity_id?.startsWith('sensor.')) return null;
  const watts = getSignedPowerValueWatts(state);
  return watts === null ? null : Math.max(0, watts);
}

/** Power reading in watts, keeping the sign (export or charging is negative). */
export function getSignedPowerValueWatts(state: HassEntity | undefined): number | null {
  if (!state) return null;
  if (state.state === 'unavailable' || state.state === 'unknown') return null;

  const unit = normalizePowerUnit(state.attributes?.unit_of_measurement);
  const deviceClass = String(state.attributes?.device_class || '').toLowerCase();
  if (!unit && deviceClass !== 'power') return null;

  const value = Number.parseFloat(state.state);
  if (!Number.isFinite(value)) return null;

  const multiplier = unit ? (UNIT_TO_WATTS[unit] ?? 1) : 1;
  return value * multiplier;
}

export function formatPowerWatts(watts: number): string {
  if (!Number.isFinite(watts)) return '';
  if (watts >= 10000) return `${(watts / 1000).toFixed(0)} kW`;
  if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
  return `${Math.round(watts)} W`;
}

function resolvePowerEntityAreaId(
  hass: HomeAssistant,
  config: DwainsDashboardConfig | undefined,
  entityId: string,
  entityConfig?: EntityConfig
): string | null {
  if (entityConfig?.area_id) return entityConfig.area_id;

  const registry = getEntityRegistry(hass)[entityId];
  if (registry?.area_id) return registry.area_id;

  const deviceId = entityConfig?.device_id || registry?.device_id;
  if (deviceId) {
    const configDevice = getDeviceConfigMap(config).get(deviceId);
    if (configDevice?.area_id) return configDevice.area_id;

    const hassDevice = hass.devices?.[deviceId];
    if (hassDevice?.area_id) return hassDevice.area_id;
  }

  const stateAreaId = hass.states?.[entityId]?.attributes?.area_id;
  return typeof stateAreaId === 'string' && stateAreaId ? stateAreaId : null;
}

function normalizePowerUnit(unit: unknown): keyof typeof UNIT_TO_WATTS | undefined {
  const raw = String(unit || '').trim();
  if (raw in UNIT_TO_WATTS) return raw as keyof typeof UNIT_TO_WATTS;

  const normalized = raw.toLowerCase();
  if (normalized === 'w') return 'W';
  if (normalized === 'kw') return 'kW';
  if (normalized === 'mw') return 'MW';

  return undefined;
}

function normalizeStateClass(stateClass: unknown): string | undefined {
  const normalized = String(stateClass || '').trim().toLowerCase();
  return ['measurement', 'total', 'total_increasing'].includes(normalized) ? normalized : undefined;
}
