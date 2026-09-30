import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DeviceConfig, DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { entityDeviceId } from './device-admission';
import { isHiddenAsUnavailable } from './entity-availability';
import { configEntityAreaId, getAreaHiddenEntityIdSet, getHiddenDeviceIdSet } from './entity-lookups';
import { getStateIndex } from './state-index';
import { isRegistryEntryVisible as isRegistryVisible } from './entity-visibility';
import { getEntityRegistry } from './entity-registry';

const EMPTY: EntityConfig[] = [];

function sameItems<T>(left: readonly T[], right: readonly T[]): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

interface AreaIndex {
  entities: EntityConfig[] | undefined;
  devices: DeviceConfig[] | undefined;
  registry: unknown;
  /** Config entities per area (own area, else device area), registry visible, in config order. */
  byArea: Map<string, EntityConfig[]>;
  memberIds: Map<string, Set<string>>;
  /** Entries for states that only carry the area in their attributes. */
  attributeEntities: Map<string, EntityConfig>;
}

interface AttributeMembers {
  states: HomeAssistant['states'];
  index: AreaIndex;
  byArea: Map<string, EntityConfig[]>;
}

interface ResolvedArea {
  states: HomeAssistant['states'];
  index: AreaIndex;
  entities: EntityConfig[];
}

interface FilteredArea {
  states: HomeAssistant['states'];
  source: EntityConfig[];
  /** State of each source entity when the result was computed. */
  sourceStates: Array<HassEntity | undefined>;
  config: DwainsDashboardConfig | undefined;
  registry: unknown;
  entities: EntityConfig[];
}

/**
 * Resolves the entities of each area. The config part is indexed once per
 * config and entity registry, the state part is resolved once per
 * `hass.states` object, and a result keeps its array identity while its
 * contents stay the same, so caches further down can compare by identity.
 * Returned arrays are shared and must not be mutated.
 */
export class AreaEntityResolver {
  private _index?: AreaIndex;
  private _attributeMembers?: AttributeMembers;
  private _resolved = new Map<string, ResolvedArea>();
  private _filtered = new Map<string, FilteredArea>();

  clear(): void {
    this._index = undefined;
    this._attributeMembers = undefined;
    this._resolved.clear();
    this._filtered.clear();
  }

  /**
   * Config entities in the area, directly or through their device, that have a
   * state and are not hidden, disabled or diagnostic in the entity registry,
   * followed by states that carry this area in their attributes.
   */
  areaEntities(areaId: string, hass: HomeAssistant, config: DwainsDashboardConfig | undefined): EntityConfig[] {
    const index = this._getIndex(hass, config);
    const cached = this._resolved.get(areaId);
    if (cached && cached.states === hass.states && cached.index === index) return cached.entities;

    const next: EntityConfig[] = [];
    for (const entity of index.byArea.get(areaId) || EMPTY) {
      if (hass.states[entity.entity_id]) next.push(entity);
    }
    const attributeMembers = this._getAttributeMembers(hass, index).get(areaId);
    if (attributeMembers) next.push(...attributeMembers);

    const entities = cached && cached.index === index && sameItems(cached.entities, next)
      ? cached.entities
      : next;
    this._resolved.set(areaId, { states: hass.states, index, entities });
    return entities;
  }

  /**
   * Area entities that are shown: hidden area entities, unavailable entities
   * (unless configured otherwise) and entities of hidden devices are left out.
   */
  filteredAreaEntities(areaId: string, hass: HomeAssistant, config: DwainsDashboardConfig | undefined): EntityConfig[] {
    const source = this.areaEntities(areaId, hass, config);
    const cached = this._filtered.get(areaId);
    if (cached && cached.source === source && cached.config === config && cached.registry === getEntityRegistry(hass)) {
      if (cached.states === hass.states) return cached.entities;
      // The result only depends on the states of the source entities.
      if (source.every((entity, index) => hass.states[entity.entity_id] === cached.sourceStates[index])) {
        cached.states = hass.states;
        return cached.entities;
      }
    }

    const hiddenInArea = getAreaHiddenEntityIdSet(config, areaId);
    const hiddenDevices = getHiddenDeviceIdSet(config);
    const hideUnavailable = config?.settings?.hide_unavailable_entities !== false;
    const next: EntityConfig[] = [];

    for (const entity of source) {
      const entityId = entity.entity_id;
      const state = hass.states[entityId];
      if (!state || !isRegistryVisible(getEntityRegistry(hass)[entityId])) continue;
      if (hiddenInArea.has(entityId)) continue;
      if (hideUnavailable && isHiddenAsUnavailable(state)) continue;
      if (hiddenDevices.size) {
        const deviceId = entityDeviceId(hass, entity);
        if (deviceId && hiddenDevices.has(deviceId)) continue;
      }
      next.push(entity);
    }

    const entities = cached && sameItems(cached.entities, next) ? cached.entities : next;
    this._filtered.set(areaId, {
      states: hass.states,
      source,
      sourceStates: source.map((entity) => hass.states[entity.entity_id]),
      config,
      registry: getEntityRegistry(hass),
      entities,
    });
    return entities;
  }

  private _getIndex(hass: HomeAssistant, config: DwainsDashboardConfig | undefined): AreaIndex {
    const entities = config?.entities;
    const devices = config?.devices;
    const registry = getEntityRegistry(hass);
    const current = this._index;
    if (current && current.entities === entities && current.devices === devices && current.registry === registry) {
      return current;
    }

    const byArea = new Map<string, EntityConfig[]>();
    const memberIds = new Map<string, Set<string>>();
    const add = (areaId: string, entity: EntityConfig) => {
      let list = byArea.get(areaId);
      let ids = memberIds.get(areaId);
      if (!list || !ids) {
        list = [];
        ids = new Set();
        byArea.set(areaId, list);
        memberIds.set(areaId, ids);
      }
      list.push(entity);
      ids.add(entity.entity_id);
    };

    for (const entity of entities || []) {
      const areaId = configEntityAreaId(config, entity);
      if (!areaId) continue;
      if (!isRegistryVisible(registry?.[entity.entity_id])) continue;
      add(areaId, entity);
    }

    const index: AreaIndex = {
      entities,
      devices,
      registry,
      byArea,
      memberIds,
      attributeEntities: new Map(),
    };
    this._index = index;
    this._attributeMembers = undefined;
    this._resolved.clear();
    return index;
  }

  private _getAttributeMembers(hass: HomeAssistant, index: AreaIndex): Map<string, EntityConfig[]> {
    const current = this._attributeMembers;
    if (current && current.states === hass.states && current.index === index) return current.byArea;

    const byArea = new Map<string, EntityConfig[]>();
    for (const state of getStateIndex(hass.states).withAreaAttribute) {
      const areaId = state.attributes.area_id as string;
      const entityId = state.entity_id;
      if (index.memberIds.get(areaId)?.has(entityId)) continue;
      if (!isRegistryVisible(getEntityRegistry(hass)[entityId])) continue;

      const key = `${areaId}\u0000${entityId}`;
      let entity = index.attributeEntities.get(key);
      if (!entity) {
        entity = { entity_id: entityId, area_id: areaId, hidden: false };
        index.attributeEntities.set(key, entity);
      }
      let list = byArea.get(areaId);
      if (!list) {
        list = [];
        byArea.set(areaId, list);
      }
      list.push(entity);
    }

    this._attributeMembers = { states: hass.states, index, byArea };
    return byArea;
  }
}
