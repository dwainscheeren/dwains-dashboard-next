import type { HomeAssistant } from '../types/home-assistant';
import type { EntitiesDisplay } from '../types/strategy';

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
    return entity && hass.entities?.[entityId]?.area_id === areaId;
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
    const entity = hass.entities?.[entityId];
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
    } else if (domain === 'script' || domain === 'scene' || domain === 'automation') {
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

    // Skip hidden and diagnostic entities (check via hass.entities if available)
    const entityRegistry = hass.entities?.[entityId];
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
    } else if (domain === 'script' || domain === 'scene' || domain === 'automation') {
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

// Helper to strip area name from entity name
export function stripAreaFromEntityName(entityName: string, areaName: string): string {
  const lowerName = entityName.toLowerCase();
  const lowerArea = areaName.toLowerCase();

  if (lowerName.startsWith(lowerArea + ' ')) {
    return entityName.substring(areaName.length + 1);
  }

  return entityName;
}

// Helper to sort areas according to configuration
export function sortAreas(
  areas: any[],
  areasDisplay?: { hidden?: string[]; order?: string[] }
): any[] {
  // First make a copy of the array to avoid read-only issues
  let filteredAreas = [...areas];

  // Filter hidden areas
  if (areasDisplay?.hidden) {
    const hiddenSet = new Set(areasDisplay.hidden);
    filteredAreas = filteredAreas.filter(area => !hiddenSet.has(area.area_id));
  }

  // Sort by order
  if (areasDisplay?.order && areasDisplay.order.length > 0) {
    const orderedAreas = areasDisplay.order
      .map(areaId => filteredAreas.find(area => area.area_id === areaId))
      .filter(area => area !== undefined) as any[];

    // Add areas that are not in the order
    const orderedIds = new Set(areasDisplay.order);
    const remainingAreas = filteredAreas.filter(area => !orderedIds.has(area.area_id));

    const result = [...orderedAreas, ...remainingAreas];
    return result;
  }

  // Default alphabetical
  return filteredAreas.sort((a, b) => a.name.localeCompare(b.name));
}