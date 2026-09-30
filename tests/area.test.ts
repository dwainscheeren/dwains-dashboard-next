import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAreaDataCache,
  clearAreaDataCacheForArea,
  getAreaData,
  getEntityDomain,
  isEntityActive,
} from '../src/utils/area';
import {
  areaEntityDeviceLabel,
  getAreaGroupedEntities,
  getAreaGroupedEntitiesFromConfig,
  resolveAreaSortMode,
  sortAreas,
  stripAreaFromEntityName,
} from '../src/utils/area-entities';
import { NARROW_NBSP } from '../src/utils/unit-format';
import type { HassEntity } from '../src/types/home-assistant';
import { entityState, hassWithStates } from './helpers';

const u = (value: string, unit: string) => `${value}${NARROW_NBSP}${unit}`;

describe('getEntityDomain', () => {
  it('returns the part before the dot', () => {
    expect(getEntityDomain('light.kitchen')).toBe('light');
    expect(getEntityDomain('binary_sensor.door')).toBe('binary_sensor');
    expect(getEntityDomain('')).toBe('unknown');
  });
});

describe('isEntityActive', () => {
  it('treats on, open, playing and home as active', () => {
    for (const state of ['on', 'open', 'opening', 'closing', 'playing', 'home']) {
      expect(isEntityActive(entityState('switch.x', state))).toBe(true);
    }
    for (const state of ['off', 'closed', 'paused', 'not_home', 'unavailable']) {
      expect(isEntityActive(entityState('switch.x', state))).toBe(false);
    }
  });

  it('uses the HVAC action for climate entities', () => {
    expect(isEntityActive(entityState('climate.a', 'heat', { hvac_action: 'heating' }))).toBe(true);
    expect(isEntityActive(entityState('climate.a', 'heat', { hvac_action: 'idle' }))).toBe(false);
    expect(isEntityActive(entityState('climate.a', 'heat'))).toBe(false);
  });
});

describe('getAreaData', () => {
  const area = { area_id: 'living_room', name: 'Living room', icon: 'mdi:sofa', picture: null };
  const states: HassEntity[] = [
    entityState('sensor.temp', '21.5', { unit_of_measurement: '°C' }),
    entityState('sensor.humidity', 'unavailable', { unit_of_measurement: '%' }),
    entityState('light.ceiling', 'on'),
    entityState('light.reading', 'off'),
    entityState('light.hidden', 'on'),
    entityState('switch.tv', 'on'),
    entityState('cover.blind', 'closed'),
    entityState('lock.door', 'unlocked'),
    entityState('climate.heater', 'heat', { hvac_action: 'heating' }),
    entityState('media_player.tv', 'unavailable'),
    entityState('binary_sensor.motion', 'on', { device_class: 'motion' }),
    entityState('binary_sensor.window', 'on', { device_class: 'window' }),
    entityState('binary_sensor.smoke', 'off', { device_class: 'smoke' }),
    entityState('sensor.tv_power', '800', { unit_of_measurement: 'W' }),
    entityState('sensor.lamp_power', '450.4', { unit_of_measurement: 'W' }),
    entityState('sensor.broken_power', 'unknown', { unit_of_measurement: 'W' }),
    entityState('sensor.energy', '12.34', { unit_of_measurement: 'kWh' }),
  ];
  const makeHass = (list: HassEntity[] = states) =>
    hassWithStates(list, {
      areas: {
        living_room: { area_id: 'living_room', temperature_entity_id: 'sensor.temp', humidity_entity_id: 'sensor.humidity' },
      },
      formatEntityState: (state: HassEntity) => `${state.state}${state.attributes.unit_of_measurement ?? ''}`,
    });
  const entities = states.map((state) => ({ entity_id: state.entity_id }));
  const config = { areas_options: { living_room: { groups_options: { light: { hidden: ['light.hidden'] } } } } };

  beforeEach(() => clearAreaDataCache());

  it('summarizes climate, power, energy, counts and alerts for an area', () => {
    const data = getAreaData(area, makeHass(), entities, config);
    expect(data).toMatchObject({
      area_id: 'living_room',
      name: 'Living room',
      icon: 'mdi:sofa',
      picture: undefined,
      temperature: u('21.5', '°C'),
      humidity: undefined,
      wattage: u('1.3', 'kW'),
      totalEnergy: u('12.3', 'kWh'),
      alerts: [{ entity_id: 'binary_sensor.window', deviceClass: 'window' }],
    });
    expect(data.domains).toEqual({
      light: { total: 2, on: 1 },
      switch: { total: 1, on: 1 },
      fan: { total: 0, on: 0 },
      cover: { total: 1, on: 0 },
      climate: { total: 1, on: 1 },
      media_player: { total: 1, on: 0 },
      lock: { total: 1, on: 1 },
      motion: { total: 1, on: 1 },
    });
  });

  it('shows watts below one kilowatt', () => {
    const small = [entityState('sensor.a', '12.6', { unit_of_measurement: 'W' })];
    const data = getAreaData(area, makeHass(small), [{ entity_id: 'sensor.a' }]);
    expect(data.wattage).toBe(u('13', 'W'));
    expect(data.totalEnergy).toBeUndefined();
  });

  it('reflects a state change of any entity in the area', () => {
    const before = getAreaData(area, makeHass(), entities, config);
    expect(before.domains.lock).toEqual({ total: 1, on: 1 });

    const changed = states.map((state) => (state.entity_id === 'lock.door' ? entityState('lock.door', 'locked') : state));
    const after = getAreaData(area, makeHass(changed), entities, config);
    expect(after.domains.lock).toEqual({ total: 1, on: 0 });
  });

  it('serves repeated calls from the cache until it is cleared', () => {
    // The cache is keyed on object identity, like Home Assistant's own state objects.
    const hass = makeHass();
    const first = getAreaData(area, hass, entities, config);
    expect(getAreaData(area, hass, entities, config)).toBe(first);
    expect(getAreaData(area, { ...hass, states: { ...hass.states } }, entities, config)).toBe(first);
    clearAreaDataCacheForArea('living_room');
    expect(getAreaData(area, hass, entities, config)).not.toBe(first);
  });
});

describe('resolveAreaSortMode', () => {
  it('uses the stored mode, or custom for legacy configs with an order', () => {
    expect(resolveAreaSortMode({ sort_mode: 'home_assistant', order: ['a'] })).toBe('home_assistant');
    expect(resolveAreaSortMode({ order: ['a'] })).toBe('custom');
    expect(resolveAreaSortMode({ order: [] })).toBe('alphabetical');
    expect(resolveAreaSortMode(undefined)).toBe('alphabetical');
  });
});

describe('sortAreas', () => {
  const areas = [
    { area_id: 'room_10', name: 'Room 10' },
    { area_id: 'attic', name: 'attic' },
    { area_id: 'room_2', name: 'Room 2' },
    { area_id: 'garage', name: 'Garage' },
  ];
  const ids = (list: { area_id: string }[]) => list.map((area) => area.area_id);

  it('sorts alphabetically with natural numbers by default', () => {
    expect(ids(sortAreas(areas))).toEqual(['attic', 'garage', 'room_2', 'room_10']);
  });

  it('keeps the Home Assistant order', () => {
    expect(ids(sortAreas(areas, { sort_mode: 'home_assistant' }))).toEqual(ids(areas));
  });

  it('applies a custom order and appends areas that are not in it', () => {
    expect(ids(sortAreas(areas, { sort_mode: 'custom', order: ['garage', 'deleted_area', 'room_2'] }))).toEqual([
      'garage',
      'room_2',
      'room_10',
      'attic',
    ]);
  });

  it('removes hidden areas in every mode', () => {
    for (const sort_mode of ['home_assistant', 'custom', 'alphabetical'] as const) {
      expect(ids(sortAreas(areas, { sort_mode, hidden: ['attic'], order: ['attic', 'garage'] }))).not.toContain('attic');
    }
  });

  it('does not reorder the array it was given', () => {
    const input = [...areas];
    sortAreas(input);
    expect(input).toEqual(areas);
  });
});

describe('stripAreaFromEntityName', () => {
  it('removes the area name prefix, ignoring case', () => {
    expect(stripAreaFromEntityName('Kitchen Ceiling light', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaFromEntityName('kitchen spots', 'Kitchen')).toBe('Spots');
    expect(stripAreaFromEntityName('Woonkamer plafond lamp', 'woonkamer')).toBe('Plafond lamp');
  });

  it('accepts dashes and underscores as separators', () => {
    expect(stripAreaFromEntityName('Living room - Floor lamp', 'Living room')).toBe('Floor lamp');
    expect(stripAreaFromEntityName('Living room_floor_lamp', 'Living room')).toBe('Floor_lamp');
    expect(stripAreaFromEntityName('Kitchen-spots', 'Kitchen')).toBe('Spots');
  });

  it('only strips a whole word prefix', () => {
    expect(stripAreaFromEntityName('Kitchenette lamp', 'Kitchen')).toBe('Kitchenette lamp');
    expect(stripAreaFromEntityName('Ceiling light', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaFromEntityName('Lamp in the kitchen', 'Kitchen')).toBe('Lamp in the kitchen');
  });

  it('never returns an empty name', () => {
    expect(stripAreaFromEntityName('Kitchen', 'Kitchen')).toBe('Kitchen');
    expect(stripAreaFromEntityName('Kitchen - ', 'Kitchen')).toBe('Kitchen - ');
    expect(stripAreaFromEntityName('', 'Kitchen')).toBe('');
    expect(stripAreaFromEntityName('Kitchen lamp', '')).toBe('Kitchen lamp');
  });

  it('keeps brand style capitalization of the first word', () => {
    expect(stripAreaFromEntityName('Office iMac', 'Office')).toBe('iMac');
  });
});

describe('areaEntityDeviceLabel', () => {
  it('shows the device name when it adds information', () => {
    expect(areaEntityDeviceLabel('Power', 'Kitchen dishwasher', 'Kitchen')).toBe('Dishwasher');
    expect(areaEntityDeviceLabel('Ceiling light', 'Hue bulb', 'Kitchen')).toBe('Hue bulb');
  });

  it('hides the device name when it repeats the entity name or the area', () => {
    expect(areaEntityDeviceLabel('Plafond lamp', 'Woonkamer plafond lamp', 'Woonkamer')).toBeUndefined();
    expect(areaEntityDeviceLabel('Plafond lamp', 'plafond lamp', 'Woonkamer')).toBeUndefined();
    expect(areaEntityDeviceLabel('Dishwasher power', 'Dishwasher', 'Kitchen')).toBeUndefined();
    expect(areaEntityDeviceLabel('Spots', 'Kitchen', 'Kitchen')).toBeUndefined();
    expect(areaEntityDeviceLabel('Spots', null, 'Kitchen')).toBeUndefined();
    expect(areaEntityDeviceLabel('Spots', '  ', 'Kitchen')).toBeUndefined();
  });
});

describe('area entity grouping', () => {
  const states = [
    entityState('light.b', 'on', { friendly_name: 'Bravo light' }),
    entityState('light.a', 'on', { friendly_name: 'Alpha light' }),
    entityState('fan.ceiling', 'off'),
    entityState('cover.blind', 'open'),
    entityState('binary_sensor.window', 'off', { device_class: 'window' }),
    entityState('binary_sensor.motion', 'off', { device_class: 'motion' }),
    entityState('binary_sensor.leak', 'off', { device_class: 'moisture' }),
    entityState('media_player.tv', 'off'),
    entityState('lock.front', 'locked'),
    entityState('scene.movie', 'scening'),
    entityState('switch.plug', 'on'),
    entityState('sensor.temp', '20'),
    entityState('light.diag', 'on'),
    entityState('light.hidden', 'on'),
    entityState('update.firmware', 'off'),
  ];
  const registry = Object.fromEntries(
    states.map((state) => [state.entity_id, { entity_id: state.entity_id, area_id: 'living_room' }])
  ) as Record<string, any>;
  registry['light.diag'].entity_category = 'diagnostic';
  registry['light.hidden'].hidden_by = 'user';
  const hass = hassWithStates(states, { entities: registry });

  it('groups config entities by domain and device class', () => {
    const grouped = getAreaGroupedEntitiesFromConfig(
      [...states.map((state) => ({ entity_id: state.entity_id })), { entity_id: 'light.no_state' }],
      hass
    );
    expect(grouped).toEqual({
      lights: ['light.a', 'light.b'],
      climate: ['fan.ceiling'],
      covers: ['binary_sensor.window', 'cover.blind'],
      media_players: ['media_player.tv'],
      security: ['binary_sensor.leak', 'lock.front'],
      motion: ['binary_sensor.motion'],
      actions: ['scene.movie'],
      others: ['sensor.temp', 'switch.plug'],
    });
  });

  it('applies hidden entities and a custom order per group', () => {
    const grouped = getAreaGroupedEntitiesFromConfig(states, hass, {
      lights: { order: ['light.b', 'light.a'] },
      others: { hidden: ['sensor.temp'] },
    });
    expect(grouped.lights).toEqual(['light.b', 'light.a']);
    expect(grouped.others).toEqual(['switch.plug']);
  });

  it('finds area entities through the entity registry', () => {
    const grouped = getAreaGroupedEntities('living_room', hass);
    expect(grouped.lights).toEqual(['light.a', 'light.b']);
    expect(grouped.security).toEqual(['lock.front']);
    expect(getAreaGroupedEntities('kitchen', hass).lights).toEqual([]);
  });
});
