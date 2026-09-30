import type { HomeAssistant } from '../types/home-assistant';
import type { AreaConfig, AreaOptions, DeviceConfig, DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { getEntityRegistry } from './entity-registry';

// Lookup tables derived from the dashboard config. Home Assistant sets `hass`
// on every state change, while the config only changes when the registries or
// the dashboard settings change. Building these once per config object turns
// the per-state `Array.find` / `includes` calls into constant time lookups.
//
// Every table is cached on the identity of the config part it is built from,
// so a new config object (the config is always replaced, never mutated) simply
// produces new tables.

const EMPTY_SET: ReadonlySet<string> = new Set<string>();

function memoByIdentity<K extends object, V>(build: (key: K) => V): (key: K | null | undefined, fallback: V) => V {
  const cache = new WeakMap<K, V>();
  return (key, fallback) => {
    if (!key) return fallback;
    let value = cache.get(key);
    if (value === undefined) {
      value = build(key);
      cache.set(key, value);
    }
    return value;
  };
}

/** First match wins, like `Array.prototype.find`. */
function firstById<T, K extends keyof T>(items: readonly T[], idKey: K): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    const id = item?.[idKey] as unknown as string;
    if (id !== undefined && id !== null && !map.has(id)) map.set(id, item);
  }
  return map;
}

const entityMapCache = memoByIdentity((entities: EntityConfig[]) => firstById(entities, 'entity_id'));
const deviceMapCache = memoByIdentity((devices: DeviceConfig[]) => firstById(devices, 'device_id'));
const areaMapCache = memoByIdentity((areas: AreaConfig[]) => firstById(areas, 'area_id'));
const stringSetCache = memoByIdentity((values: string[]) => new Set(values) as ReadonlySet<string>);
const groupsHiddenCache = memoByIdentity((groupsOptions: NonNullable<AreaOptions['groups_options']>) => {
  const hidden = new Set<string>();
  for (const groupOptions of Object.values(groupsOptions)) {
    groupOptions?.hidden?.forEach((entityId) => hidden.add(entityId));
  }
  return hidden as ReadonlySet<string>;
});

const EMPTY_ENTITY_MAP = new Map<string, EntityConfig>();
const EMPTY_DEVICE_MAP = new Map<string, DeviceConfig>();
const EMPTY_AREA_MAP = new Map<string, AreaConfig>();

export function getEntityConfigMap(config?: DwainsDashboardConfig | null): ReadonlyMap<string, EntityConfig> {
  return entityMapCache(config?.entities, EMPTY_ENTITY_MAP);
}

export function getDeviceConfigMap(config?: DwainsDashboardConfig | null): ReadonlyMap<string, DeviceConfig> {
  return deviceMapCache(config?.devices, EMPTY_DEVICE_MAP);
}

export function getAreaConfigMap(config?: DwainsDashboardConfig | null): ReadonlyMap<string, AreaConfig> {
  return areaMapCache(config?.areas, EMPTY_AREA_MAP);
}

/** Devices hidden through device admission. Read only, shared between callers. */
export function getHiddenDeviceIdSet(config?: DwainsDashboardConfig | null): ReadonlySet<string> {
  return stringSetCache(config?.device_admission?.hidden_devices, EMPTY_SET);
}

/** Areas hidden in the dashboard area settings. */
export function getHiddenAreaIdSet(config?: DwainsDashboardConfig | null): ReadonlySet<string> {
  return stringSetCache(config?.areas_display?.hidden, EMPTY_SET);
}

/** Persons hidden in the dashboard settings. */
export function getHiddenPersonIdSet(config?: DwainsDashboardConfig | null): ReadonlySet<string> {
  return stringSetCache(config?.settings?.hidden_persons, EMPTY_SET);
}

/** Every entity hidden in any group of this area. */
export function getAreaHiddenEntityIdSet(
  config: DwainsDashboardConfig | null | undefined,
  areaId: string
): ReadonlySet<string> {
  return groupsHiddenCache(config?.areas_options?.[areaId]?.groups_options, EMPTY_SET);
}

/**
 * Area of a config entity, the way Home Assistant assigns it: the entity's own
 * area when it has one, otherwise the area of its device. An entity with its
 * own area is never also part of the area of its device.
 */
export function configEntityAreaId(
  config: DwainsDashboardConfig | null | undefined,
  entity: Pick<EntityConfig, 'area_id' | 'device_id'>
): string | null | undefined {
  if (entity.area_id) return entity.area_id;
  if (!entity.device_id) return undefined;
  return getDeviceConfigMap(config).get(entity.device_id)?.area_id;
}

/** Whether a config entity belongs to the area. See `configEntityAreaId`. */
export function isConfigEntityInArea(
  config: DwainsDashboardConfig | null | undefined,
  entity: Pick<EntityConfig, 'area_id' | 'device_id'>,
  areaId: string
): boolean {
  return Boolean(areaId) && configEntityAreaId(config, entity) === areaId;
}

/**
 * Area of an entity as used by the status cards: the entity's own area, then
 * the area of its device from the config, then the Home Assistant registry.
 */
export function resolveStatusEntityAreaId(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | null | undefined,
  entityId: string,
  entityConfig: EntityConfig | undefined = getEntityConfigMap(config).get(entityId)
): string | null | undefined {
  return (entityConfig && configEntityAreaId(config, entityConfig)) || getEntityRegistry(hass)[entityId]?.area_id;
}
