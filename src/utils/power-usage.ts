import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { isEntityFromHiddenDevice } from './device-admission';

export interface PowerEntitySummary {
  entityId: string;
  name: string;
  areaId: string;
  areaName: string;
  icon: string;
  watts: number;
  formatted: string;
  unit: string;
}

export interface PowerAreaSummary {
  areaId: string;
  name: string;
  icon: string;
  totalWatts: number;
  formattedTotal: string;
  entities: PowerEntitySummary[];
  percentage: number;
  trend: number[];
}

export interface HousePowerUsageSummary {
  totalWatts: number;
  formattedTotal: string;
  sensorCount: number;
  areas: PowerAreaSummary[];
}

const UNIT_TO_WATTS: Record<string, number> = {
  mW: 0.001,
  W: 1,
  kW: 1000,
  MW: 1000000,
};

export function buildHousePowerUsage(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | undefined
): HousePowerUsageSummary {
  const entities = getLivePowerEntities(hass, config);
  const areas = new Map<string, PowerAreaSummary>();

  entities.forEach((entity) => {
    let area = areas.get(entity.areaId);
    if (!area) {
      area = {
        areaId: entity.areaId,
        name: entity.areaName,
        icon: entity.icon,
        totalWatts: 0,
        formattedTotal: '0 W',
        entities: [],
        percentage: 0,
        trend: [],
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
        trend: sortedEntities.map((entity) => entity.watts),
      };
    })
    .filter((area) => area.totalWatts > 0)
    .sort((a, b) => b.totalWatts - a.totalWatts);

  const totalWatts = sortedAreas.reduce((total, area) => total + area.totalWatts, 0);
  const maxAreaWatts = Math.max(...sortedAreas.map((area) => area.totalWatts), 0);
  const areasWithPercent = sortedAreas.map((area) => ({
    ...area,
    percentage: maxAreaWatts > 0
      ? Math.max(6, Math.min(100, Math.round((area.totalWatts / maxAreaWatts) * 100)))
      : 0,
  }));

  return {
    totalWatts,
    formattedTotal: entities.length ? formatPowerWatts(totalWatts) : 'No data',
    sensorCount: entities.length,
    areas: areasWithPercent,
  };
}

export function getLivePowerEntities(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | undefined
): PowerEntitySummary[] {
  if (!hass?.states) return [];

  const configEntities = new Map(
    (config?.entities || []).map((entity) => [entity.entity_id, entity])
  );
  const areasById = new Map((config?.areas || []).map((area) => [area.area_id, area]));

  return Object.values(hass.states)
    .map((state) => {
      const entityId = state.entity_id;
      const configEntity = configEntities.get(entityId);
      const watts = getLivePowerValueWatts(state);
      if (watts === null) return undefined;
      if (!isVisiblePowerEntity(hass, config, entityId, configEntity)) return undefined;

      const areaId = resolvePowerEntityAreaId(hass, config, entityId, configEntity);
      if (!areaId) return undefined;

      const area = areasById.get(areaId);
      if (!area) return undefined;

      return {
        entityId,
        name: state.attributes?.friendly_name || entityId,
        areaId,
        areaName: area.name,
        icon: state.attributes?.icon || 'mdi:flash',
        watts,
        formatted: formatPowerWatts(watts),
        unit: normalizePowerUnit(state.attributes?.unit_of_measurement) || 'W',
      };
    })
    .filter((entity): entity is PowerEntitySummary => Boolean(entity));
}

export function getLivePowerValueWatts(state: HassEntity | undefined): number | null {
  if (!state?.entity_id?.startsWith('sensor.')) return null;
  if (state.state === 'unavailable' || state.state === 'unknown') return null;

  const unit = normalizePowerUnit(state.attributes?.unit_of_measurement);
  const deviceClass = String(state.attributes?.device_class || '').toLowerCase();
  if (!unit && deviceClass !== 'power') return null;

  const value = Number.parseFloat(state.state);
  if (!Number.isFinite(value)) return null;

  const multiplier = unit ? (UNIT_TO_WATTS[unit] ?? 1) : 1;
  return Math.max(0, value * multiplier);
}

export function formatPowerWatts(watts: number): string {
  if (!Number.isFinite(watts)) return 'No data';
  if (watts >= 10000) return `${(watts / 1000).toFixed(0)} kW`;
  if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
  return `${Math.round(watts)} W`;
}

function isVisiblePowerEntity(
  hass: HomeAssistant,
  config: DwainsDashboardConfig | undefined,
  entityId: string,
  entityConfig?: EntityConfig
): boolean {
  const registry = hass.entities?.[entityId];
  if (registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') {
    return false;
  }

  if (isEntityFromHiddenDevice(hass, config, entityConfig || entityId)) return false;

  const areaId = resolvePowerEntityAreaId(hass, config, entityId, entityConfig);
  if (!areaId) return false;

  const hiddenAreas = config?.areas_display?.hidden || [];
  if (hiddenAreas.includes(areaId)) return false;
  if (!config?.areas?.some((area) => area.area_id === areaId)) return false;

  const areaOptions = config?.areas_options?.[areaId];
  if (areaOptions?.groups_options) {
    for (const groupOptions of Object.values(areaOptions.groups_options)) {
      if (groupOptions.hidden?.includes(entityId)) return false;
    }
  }

  return true;
}

function resolvePowerEntityAreaId(
  hass: HomeAssistant,
  config: DwainsDashboardConfig | undefined,
  entityId: string,
  entityConfig?: EntityConfig
): string | null {
  if (entityConfig?.area_id) return entityConfig.area_id;

  const registry = hass.entities?.[entityId];
  if (registry?.area_id) return registry.area_id;

  const deviceId = entityConfig?.device_id || registry?.device_id;
  if (deviceId) {
    const configDevice = config?.devices?.find((device) => device.device_id === deviceId);
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
