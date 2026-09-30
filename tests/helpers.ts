import { vi } from 'vitest';
import type { HassEntity, HomeAssistant } from '../src/types/home-assistant';

export const AREA_REGISTRY = [
  {
    area_id: 'living_room',
    name: 'Living room',
    picture: null,
    icon: 'mdi:sofa',
    floor_id: 'ground',
    temperature_entity_id: 'sensor.living_temperature',
    humidity_entity_id: null,
  },
  { area_id: 'kitchen', name: 'Kitchen', picture: '/local/kitchen.jpg', icon: null, floor_id: 'ground' },
  { area_id: 'garden', name: 'Garden', picture: null, icon: null, floor_id: null },
];

export const DEVICE_REGISTRY = [
  { id: 'dev-lamp', name: 'Hue bulb', name_by_user: 'Reading lamp', area_id: 'living_room', created_at: '2026-09-01T10:00:00Z' },
  { id: 'dev-plug', name: 'Smart plug', name_by_user: null, area_id: null },
];

export const ENTITY_REGISTRY = [
  { entity_id: 'light.reading_lamp', area_id: null, device_id: 'dev-lamp', hidden_by: null, entity_category: null },
  { entity_id: 'switch.plug', area_id: 'kitchen', device_id: 'dev-plug', hidden_by: null, entity_category: null },
  { entity_id: 'sensor.living_temperature', area_id: 'living_room', device_id: null, hidden_by: null, entity_category: null },
];

export const FLOOR_REGISTRY = [
  { floor_id: 'ground', name: 'Ground floor', icon: null, level: 0 },
  { floor_id: 'first', name: 'First floor', icon: null, level: 1 },
];

export interface MockHassOptions {
  language?: string;
  isAdmin?: boolean;
  floorsFail?: boolean;
  /** Answer for `energy/get_prefs`; without it the call fails like it does when energy is not set up. */
  energyPrefs?: unknown;
}

/** A minimal hass object whose callWS answers the registry list calls. */
export function mockHass(options: MockHassOptions = {}): HomeAssistant {
  const callWS = vi.fn(async (msg: { type: string }) => {
    switch (msg.type) {
      case 'config/area_registry/list':
        return structuredClone(AREA_REGISTRY);
      case 'config/device_registry/list':
        return structuredClone(DEVICE_REGISTRY);
      case 'config/entity_registry/list':
        return structuredClone(ENTITY_REGISTRY);
      case 'config/floor_registry/list':
        if (options.floorsFail) throw new Error('unknown command');
        return structuredClone(FLOOR_REGISTRY);
      case 'energy/get_prefs':
        if (options.energyPrefs === undefined) throw new Error('No prefs');
        return structuredClone(options.energyPrefs);
      default:
        throw new Error(`Unexpected WS call ${msg.type}`);
    }
  });

  return {
    states: {},
    areas: {},
    devices: {},
    entities: {},
    user: { id: 'user-1', name: 'Dwain', is_admin: options.isAdmin ?? true },
    language: options.language ?? 'en',
    locale: { language: options.language ?? 'en' },
    callWS,
  } as unknown as HomeAssistant;
}

export function entityState(entityId: string, state: string, attributes: Record<string, any> = {}): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: '2026-09-30T12:00:00Z',
    last_updated: '2026-09-30T12:00:00Z',
    context: { id: 'ctx', parent_id: null, user_id: null },
  };
}

/** A hass object with the given states and optional registry lookups. */
export function hassWithStates(states: HassEntity[], extra: Record<string, any> = {}): HomeAssistant {
  return {
    states: Object.fromEntries(states.map((state) => [state.entity_id, state])),
    areas: {},
    devices: {},
    entities: {},
    language: 'en',
    locale: { language: 'en' },
    ...extra,
  } as unknown as HomeAssistant;
}
