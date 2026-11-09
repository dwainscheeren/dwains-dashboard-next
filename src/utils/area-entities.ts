import type { HomeAssistant } from '../types/home-assistant';
import type { AreasDisplay, AreaSortMode, EntitiesDisplay } from '../types/strategy';
import { getCollator } from './intl-cache';
import { getEntityRegistry } from './entity-registry';
import { stripAreaNameFromEntityName } from './entity-names';

// Group types as Home Assistant uses them
export const AREA_STRATEGY_GROUPS = [
  'lights',
  'climate',
  'covers',
  'media_players',
  'security',
  'motion',
  'actions',
  'others',
] as const;

export const AREA_STRATEGY_GROUP_ICONS = {
  lights: 'mdi:lamps',
  climate: 'mdi:home-thermometer',
  covers: 'mdi:blinds-horizontal',
  media_players: 'mdi:multimedia',
  security: 'mdi:security',
  motion: 'mdi:motion-sensor',
  actions: 'mdi:robot',
  others: 'mdi:shape',
};

export const AREA_STRATEGY_GROUP_TITLES = {
  lights: 'Lighting',
  climate: 'Climate',
  covers: 'Covers',
  media_players: 'Media',
  security: 'Security',
  motion: 'Motion',
  actions: 'Actions',
  others: 'Others',
};

export type AreaStrategyGroup = (typeof AREA_STRATEGY_GROUPS)[number];

// Room pages group covers by what they do. Each group gets its own quick
// control tile in the room header.
export const AREA_COVER_GROUPS = ['cover_shading', 'cover_openings', 'cover_gates'] as const;

export type AreaCoverGroup = (typeof AREA_COVER_GROUPS)[number];

const OPENING_COVER_CLASSES = new Set(['door', 'window']);
const GATE_CLASSES = new Set(['garage', 'garage_door', 'gate']);
const OPENING_SENSOR_CLASSES = new Set(['door', 'window', 'opening']);
const MOTION_SENSOR_CLASSES = new Set(['motion', 'moving', 'occupancy', 'presence']);
const SAFETY_SENSOR_CLASSES = new Set([
  'smoke',
  'gas',
  'carbon_monoxide',
  'moisture',
  'safety',
  'tamper',
  'problem',
  'heat',
  'cold',
]);

interface DeviceClassState {
  attributes?: { device_class?: unknown } | null;
}

interface DeviceClassRegistryEntry {
  device_class?: unknown;
  original_device_class?: unknown;
}

function entityDeviceClass(
  state: DeviceClassState | null | undefined,
  registryEntry: DeviceClassRegistryEntry | null | undefined
): string {
  // The state attribute already includes a device class set by the user.
  const value = state?.attributes?.device_class ??
    registryEntry?.device_class ??
    registryEntry?.original_device_class;
  return typeof value === 'string' ? value.toLowerCase() : '';
}

export function isAreaCoverGroup(groupKey: string | undefined): groupKey is AreaCoverGroup {
  return (AREA_COVER_GROUPS as readonly string[]).includes(groupKey || '');
}

/**
 * The room page group of an entity. Most entities are grouped by domain.
 * Covers, binary sensors and alarm panels are grouped by meaning, so a door
 * sensor sits next to the door it watches and a smoke detector next to the
 * alarm. Input selects join the selects.
 */
export function getAreaEntityGroupKey(
  entityId: string,
  state?: DeviceClassState | null,
  registryEntry?: DeviceClassRegistryEntry | null
): string {
  const domain = entityId.split('.')[0] || '';

  if (domain === 'cover') {
    const deviceClass = entityDeviceClass(state, registryEntry);
    if (GATE_CLASSES.has(deviceClass)) return 'cover_gates';
    if (OPENING_COVER_CLASSES.has(deviceClass)) return 'cover_openings';
    // Blinds, shades, shutters, curtains, awnings, dampers and covers without a class.
    return 'cover_shading';
  }

  if (domain === 'binary_sensor') {
    const deviceClass = entityDeviceClass(state, registryEntry);
    if (GATE_CLASSES.has(deviceClass)) return 'cover_gates';
    if (OPENING_SENSOR_CLASSES.has(deviceClass)) return 'cover_openings';
    if (MOTION_SENSOR_CLASSES.has(deviceClass)) return 'motion';
    if (SAFETY_SENSOR_CLASSES.has(deviceClass)) return 'safety';
    return 'binary_sensor';
  }

  if (domain === 'alarm_control_panel') return 'safety';
  if (domain === 'input_select') return 'select';
  return domain;
}

/**
 * Sort covers into their room groups in one pass. Entities that are not
 * covers are skipped.
 */
export function groupAreaCovers<T extends { entity_id: string }>(
  entities: readonly T[],
  states: Record<string, DeviceClassState | undefined>
): Record<AreaCoverGroup, T[]> {
  const groups: Record<AreaCoverGroup, T[]> = {
    cover_shading: [],
    cover_openings: [],
    cover_gates: [],
  };
  for (const entity of entities) {
    if (!entity.entity_id.startsWith('cover.')) continue;
    const groupKey = getAreaEntityGroupKey(entity.entity_id, states[entity.entity_id]);
    if (isAreaCoverGroup(groupKey)) groups[groupKey].push(entity);
  }
  return groups;
}

/** The covers that an "open all" or "close all" action for a room acts on. */
export function selectAreaCovers<T extends { entity_id: string }>(
  entities: readonly T[],
  states: Record<string, DeviceClassState | undefined>,
  groupKey?: AreaCoverGroup
): T[] {
  if (!groupKey) return entities.filter((entity) => entity.entity_id.startsWith('cover.'));
  return groupAreaCovers(entities, states)[groupKey];
}

/**
 * Group keys that older configurations used for the same entities. Gates were
 * part of shading for a while, all covers used to share one group and input
 * selects had a group of their own.
 */
export function legacyAreaGroupKeys(groupKey: string): string[] {
  if (groupKey === 'cover_gates') return ['cover_shading', 'cover'];
  if (groupKey === 'cover_shading' || groupKey === 'cover_openings') return ['cover'];
  if (groupKey === 'select') return ['input_select'];
  return [];
}

/** The broad settings group that a room group belongs to. */
export function areaStrategyGroupForKey(groupKey: string): AreaStrategyGroup {
  if ((AREA_STRATEGY_GROUPS as readonly string[]).includes(groupKey)) {
    return groupKey as AreaStrategyGroup;
  }
  if (groupKey === 'light') return 'lights';
  if (['climate', 'humidifier', 'water_heater', 'fan'].includes(groupKey)) return 'climate';
  if (groupKey === 'cover' || isAreaCoverGroup(groupKey)) return 'covers';
  if (groupKey === 'media_player') return 'media_players';
  if (['alarm_control_panel', 'lock', 'camera', 'binary_sensor', 'safety'].includes(groupKey)) return 'security';
  if (groupKey === 'motion') return 'motion';
  if (['script', 'scene', 'automation', 'todo', 'event'].includes(groupKey)) return 'actions';
  return 'others';
}

/**
 * The position of a room group in a saved group order. Uses the group's own
 * key first, then the keys older versions saved and finally the broad
 * settings group, which is what the settings editor stores.
 */
export function areaGroupOrderIndex(order: readonly string[], groupKey: string): number | undefined {
  if (!order.length) return undefined;
  for (const key of [groupKey, ...legacyAreaGroupKeys(groupKey)]) {
    const index = order.indexOf(key);
    if (index >= 0) return index;
  }
  const strategyGroup = areaStrategyGroupForKey(groupKey);
  const index = order.findIndex((key) => areaStrategyGroupForKey(key) === strategyGroup);
  return index >= 0 ? index : undefined;
}

/** The saved entity order of a room group, read from older keys when the group has none. */
export function resolveAreaGroupEntityOrder(
  groupsOptions: Record<string, EntitiesDisplay | undefined> | undefined,
  groupKey: string
): string[] {
  if (!groupsOptions) return [];
  for (const key of [groupKey, ...legacyAreaGroupKeys(groupKey)]) {
    const order = groupsOptions[key]?.order;
    if (order?.length) return order;
  }
  return [];
}

const LEGACY_CARD_PLACEMENT_GROUPS = new Map([
  // Covers without a class are shading, so that is where most old cards belong.
  ['cover', 'cover_shading'],
  ['input_select', 'select'],
  ['alarm_control_panel', 'safety'],
]);

/**
 * Custom cards placed in a group that no longer exists on its own move to the
 * group that took over its entities.
 */
export function migrateAreaCardPlacement(placement: string): string {
  const domainMatch = /^domain:([^:]+):(\d+)$/.exec(placement);
  if (domainMatch) {
    const groupKey = LEGACY_CARD_PLACEMENT_GROUPS.get(domainMatch[1]!);
    return groupKey ? `domain:${groupKey}:${domainMatch[2]}` : placement;
  }
  if (placement.startsWith('after:')) {
    const groupKey = LEGACY_CARD_PLACEMENT_GROUPS.get(placement.slice('after:'.length));
    return groupKey ? `after:${groupKey}` : placement;
  }
  return placement;
}

type AreaEntitiesByGroup = Record<AreaStrategyGroup, string[]>;

interface AreaGroupsDisplayOptions {
  [group: string]: EntitiesDisplay | undefined;
}

export function getAreaGroupedEntities(
  areaId: string,
  hass: HomeAssistant,
  displayOptions?: AreaGroupsDisplayOptions
): AreaEntitiesByGroup {
  // Get all entities for this area
  const allEntities = Object.keys(hass.states);
  const areaEntities = allEntities.filter((entityId) => {
    const entity = hass.states[entityId];
    return entity && getEntityRegistry(hass)[entityId]?.area_id === areaId;
  });

      // Group entities by domain
  const grouped: AreaEntitiesByGroup = {
    lights: [],
    climate: [],
    covers: [],
    media_players: [],
    security: [],
    motion: [],
    actions: [],
    others: [],
  };

  areaEntities.forEach((entityId) => {
    const domain = entityId.split('.')[0];
    const state = hass.states[entityId];

    // Skip hidden and diagnostic entities
    const entity = getEntityRegistry(hass)[entityId];
    if (entity?.hidden_by || entity?.entity_category === 'diagnostic' || entity?.entity_category === 'config') {
      return;
    }

    // Group based on domain and device class
    if (domain === 'light') {
      grouped.lights.push(entityId);
    } else if (domain === 'climate' || domain === 'humidifier' || domain === 'water_heater' || domain === 'fan') {
      grouped.climate.push(entityId);
    } else if (domain === 'cover') {
      grouped.covers.push(entityId);
    } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
               ['door', 'garage_door', 'window'].includes(state.attributes.device_class)) {
      grouped.covers.push(entityId);
    } else if (domain === 'media_player') {
      grouped.media_players.push(entityId);
    } else if (domain === 'alarm_control_panel' || domain === 'lock' || domain === 'camera') {
      grouped.security.push(entityId);
    } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
               ['motion', 'occupancy', 'presence'].includes(state.attributes.device_class)) {
      grouped.motion.push(entityId);
    } else if (domain === 'script' || domain === 'scene' || domain === 'automation' || domain === 'todo') {
      grouped.actions.push(entityId);
    } else if (domain === 'switch' || domain === 'button' || domain === 'input_boolean' ||
               domain === 'vacuum' || domain === 'lawn_mower' || domain === 'valve' ||
               domain === 'select' || domain === 'number' || domain === 'input_select' ||
               domain === 'input_number' || domain === 'counter' || domain === 'timer') {
      grouped.others.push(entityId);
    }
  });

  // Apply display options (hidden/order) per group
  Object.keys(grouped).forEach((group) => {
    const groupKey = group as AreaStrategyGroup;
    const options = displayOptions?.[groupKey];

    if (options?.hidden) {
      const hiddenSet = new Set(options.hidden);
      grouped[groupKey] = grouped[groupKey].filter(entity => !hiddenSet.has(entity));
    }

    if (options?.order) {
      grouped[groupKey] = sortByOrder(grouped[groupKey], options.order);
    } else {
      // Sort alphabetically by friendly name
      grouped[groupKey].sort((a, b) => {
        const nameA = hass.states[a]?.attributes?.friendly_name || a;
        const nameB = hass.states[b]?.attributes?.friendly_name || b;
        return nameA.localeCompare(nameB);
      });
    }
  });

  return grouped;
}

// Alternatieve versie voor Dwains Dashboard die met EntityConfig werkt
export function getAreaGroupedEntitiesFromConfig(
  areaEntities: { entity_id: string }[],
  hass: HomeAssistant,
  displayOptions?: AreaGroupsDisplayOptions
): AreaEntitiesByGroup {
  // Group entities by domain
  const grouped: AreaEntitiesByGroup = {
    lights: [],
    climate: [],
    covers: [],
    media_players: [],
    security: [],
    motion: [],
    actions: [],
    others: [],
  };

  areaEntities.forEach((entity) => {
    const entityId = entity.entity_id;
    const domain = entityId.split('.')[0];
    const state = hass.states[entityId];

    // Skip if state doesn't exist
    if (!state) return;

    // Skip hidden and diagnostic entities (check via getEntityRegistry(hass) if available)
    const entityRegistry = getEntityRegistry(hass)[entityId];
    if (entityRegistry?.hidden_by || entityRegistry?.entity_category === 'diagnostic' || entityRegistry?.entity_category === 'config') {
      return;
    }

    // Group based on domain and device class
    if (domain === 'light') {
      grouped.lights.push(entityId);
    } else if (domain === 'climate' || domain === 'humidifier' || domain === 'water_heater' || domain === 'fan') {
      grouped.climate.push(entityId);
    } else if (domain === 'cover') {
      grouped.covers.push(entityId);
    } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
               ['door', 'garage_door', 'window'].includes(state.attributes.device_class)) {
      grouped.covers.push(entityId);
    } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
               ['motion', 'occupancy', 'presence'].includes(state.attributes.device_class)) {
      grouped.motion.push(entityId);
    } else if (domain === 'binary_sensor') {
      grouped.security.push(entityId);
    } else if (domain === 'media_player') {
      grouped.media_players.push(entityId);
    } else if (domain === 'alarm_control_panel' || domain === 'lock' || domain === 'camera') {
      grouped.security.push(entityId);
    } else if (domain === 'script' || domain === 'scene' || domain === 'automation' || domain === 'todo') {
      grouped.actions.push(entityId);
    } else if (domain === 'switch' || domain === 'button' || domain === 'input_boolean' ||
               domain === 'vacuum' || domain === 'lawn_mower' || domain === 'valve' ||
               domain === 'select' || domain === 'number' || domain === 'input_select' ||
               domain === 'input_number' || domain === 'counter' || domain === 'timer' ||
               domain === 'sensor') {
      grouped.others.push(entityId);
    }
  });

  // Apply display options (hidden/order) per group
  Object.keys(grouped).forEach((group) => {
    const groupKey = group as AreaStrategyGroup;
    const options = displayOptions?.[groupKey];

    if (options?.hidden) {
      const hiddenSet = new Set(options.hidden);
      grouped[groupKey] = grouped[groupKey].filter(entity => !hiddenSet.has(entity));
    }

    if (options?.order) {
      grouped[groupKey] = sortByOrder(grouped[groupKey], options.order);
    } else {
      // Sort alphabetically by friendly name
      grouped[groupKey].sort((a, b) => {
        const nameA = hass.states[a]?.attributes?.friendly_name || a;
        const nameB = hass.states[b]?.attributes?.friendly_name || b;
        return nameA.localeCompare(nameB);
      });
    }
  });

  return grouped;
}

function sortByOrder(items: string[], order: string[]): string[] {
  const orderMap = new Map(order.map((item, index) => [item, index]));

  // Make a copy of the array before sorting
  return [...items].sort((a, b) => {
    const indexA = orderMap.get(a);
    const indexB = orderMap.get(b);

    if (indexA !== undefined && indexB !== undefined) {
      return indexA - indexB;
    }
    if (indexA !== undefined) {
      return -1;
    }
    if (indexB !== undefined) {
      return 1;
    }
    return a.localeCompare(b);
  });
}

/**
 * Remove a leading area name from an entity name, so a tile on the
 * "Living room" page shows "Ceiling light" instead of "Living room Ceiling light".
 * The area name must be followed by a space, dash or underscore, the match
 * ignores case and the result is never empty (the original name is returned then).
 * See `stripAreaNameFromEntityName` for the version that also looks at the end.
 */
export function stripAreaFromEntityName(entityName: string, areaName: string): string {
  return stripAreaNameFromEntityName(entityName, areaName, { atEnd: false });
}

/**
 * The secondary line of an entity tile on an area page. It shows the device
 * name (without the area prefix) when that adds information, and nothing when
 * the device name is missing or already part of the displayed entity name.
 */
export function areaEntityDeviceLabel(
  displayName: string,
  deviceName: string | null | undefined,
  areaName: string
): string | undefined {
  const device = String(deviceName ?? '').trim();
  if (!device) return undefined;
  const label = stripAreaFromEntityName(device, areaName);
  const normalizedLabel = label.toLocaleLowerCase();
  const normalizedDevice = device.toLocaleLowerCase();
  const normalizedArea = String(areaName ?? '').trim().toLocaleLowerCase();
  const normalizedName = String(displayName ?? '').trim().toLocaleLowerCase();
  if (!normalizedName) return label;
  if (normalizedLabel === normalizedArea || normalizedDevice === normalizedArea) return undefined;
  if (normalizedName === normalizedLabel || normalizedName.startsWith(`${normalizedLabel} `)) return undefined;
  if (normalizedName === normalizedDevice || normalizedName.startsWith(`${normalizedDevice} `)) return undefined;
  return label;
}

/**
 * Older configurations only stored an order after the user moved an area.
 * Preserve that behavior while allowing new configurations to select a mode.
 */
export function resolveAreaSortMode(areasDisplay?: AreasDisplay): AreaSortMode {
  if (areasDisplay?.sort_mode) return areasDisplay.sort_mode;
  return areasDisplay?.order?.length ? 'custom' : 'alphabetical';
}

// Keep every area surface on the same ordering rules.
export function sortAreas(
  areas: any[],
  areasDisplay?: AreasDisplay,
  locale?: string
): any[] {
  // First make a copy of the array to avoid read-only issues
  let filteredAreas = [...areas];

  // Filter hidden areas
  if (areasDisplay?.hidden) {
    const hiddenSet = new Set(areasDisplay.hidden);
    filteredAreas = filteredAreas.filter(area => !hiddenSet.has(area.area_id));
  }

  const sortMode = resolveAreaSortMode(areasDisplay);

  // The registry list is already returned in Home Assistant's configured order.
  if (sortMode === 'home_assistant') {
    return filteredAreas;
  }

  if (sortMode === 'custom' && areasDisplay?.order?.length) {
    const orderedAreas = areasDisplay.order
      .map(areaId => filteredAreas.find(area => area.area_id === areaId))
      .filter(area => area !== undefined) as any[];

    // Add areas that are not in the order
    const orderedIds = new Set(areasDisplay.order);
    const remainingAreas = filteredAreas.filter(area => !orderedIds.has(area.area_id));

    return [...orderedAreas, ...remainingAreas];
  }

  const collator = getCollator(locale, {
    numeric: true,
    sensitivity: 'base',
  });
  return filteredAreas.sort((a, b) => collator.compare(a.name, b.name));
}

/**
 * Custom cards of a freely ordered room page that would fall outside its
 * list: `ungrouped:N` past the last entity shown, and cards placed in or
 * after a type group (`domain:<group>:N`, `after:<group>`) that has no
 * entity on the page, for example because its entities are hidden. The room
 * page shows these at the end, so hiding entities never hides a card. The
 * `ungrouped:` cards come first, in the order of their place in the list;
 * the others follow in the order they are stored.
 */
export function overflowingUngroupedCustomCards<T extends { placement: string }>(
  cards: readonly T[],
  entityCount: number,
  groupsOnPage: ReadonlySet<string>
): T[] {
  const ungroupedSlot = (card: T): number | undefined => {
    const match = /^ungrouped:(\d+)$/.exec(card.placement);
    return match ? Number(match[1]) : undefined;
  };
  return cards.filter((card) => {
    const slot = ungroupedSlot(card);
    if (slot !== undefined) return slot > entityCount;
    const domain = /^domain:(.+):\d+$/.exec(card.placement);
    if (domain) return !groupsOnPage.has(domain[1]!);
    if (card.placement.startsWith('after:')) return !groupsOnPage.has(card.placement.slice('after:'.length));
    return false;
  })
    // Group cards sort after every place; sort is stable, so cards with the
    // same place, and the group cards among themselves, keep their stored order.
    .sort((a, b) => (ungroupedSlot(a) ?? Number.MAX_SAFE_INTEGER) - (ungroupedSlot(b) ?? Number.MAX_SAFE_INTEGER));
}
