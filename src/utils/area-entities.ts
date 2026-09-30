import type { HomeAssistant } from '../types/home-assistant';
import type { AreasDisplay, AreaSortMode, EntitiesDisplay } from '../types/strategy';
import { getCollator } from './intl-cache';
import { getEntityRegistry } from './entity-registry';

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

// Characters that may sit between an area name and the rest of an entity name:
// whitespace, hyphen, underscore, colon and the en/em dash.
const AREA_NAME_SEPARATORS = /^[\s\-_:\u2013\u2014]+/;

function capitalizeFirstWord(name: string): string {
  const firstWord = name.split(/\s/, 1)[0] || '';
  // Keep brand style names like "iPhone" or "HomePod" untouched, like Home Assistant does.
  if (firstWord !== firstWord.toLowerCase()) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Remove a leading area name from an entity name, so a tile on the
 * "Living room" page shows "Ceiling light" instead of "Living room Ceiling light".
 * The area name must be followed by a space, dash or underscore, the match
 * ignores case and the result is never empty (the original name is returned then).
 */
export function stripAreaFromEntityName(entityName: string, areaName: string): string {
  const name = String(entityName ?? '');
  const area = String(areaName ?? '').trim();
  if (!name || !area || name.length <= area.length) return name;

  const prefix = name.slice(0, area.length);
  if (prefix.toLocaleLowerCase() !== area.toLocaleLowerCase()) return name;

  const rest = name.slice(area.length);
  const separator = rest.match(AREA_NAME_SEPARATORS);
  if (!separator) return name;

  const stripped = rest.slice(separator[0].length).trim();
  return stripped ? capitalizeFirstWord(stripped) : name;
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
