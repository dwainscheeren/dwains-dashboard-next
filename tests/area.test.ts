import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAreaDataCache,
  clearAreaDataCacheForArea,
  getAreaData,
  getEntityDomain,
  isEntityActive,
} from '../src/utils/area';
import {
  areaEntityDeviceLabel,
  areaGroupOrderIndex,
  areaStrategyGroupForKey,
  getAreaEntityGroupKey,
  getAreaGroupedEntities,
  getAreaGroupedEntitiesFromConfig,
  groupAreaCovers,
  legacyAreaGroupKeys,
  migrateAreaCardPlacement,
  overflowingUngroupedCustomCards,
  resolveAreaGroupEntityOrder,
  resolveAreaSortMode,
  selectAreaCovers,
  sortAreas,
  stripAreaFromEntityName,
} from '../src/utils/area-entities';
import { NARROW_NBSP } from '../src/utils/unit-format';
import { loadEnergyPowerConfig, resetEnergyPowerConfigCache } from '../src/utils/energy-prefs';
import type { HassEntity, HomeAssistant } from '../src/types/home-assistant';
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

  describe('with a device hierarchy in the energy settings', () => {
    const circuits = [
      entityState('sensor.general_power', '3200', { unit_of_measurement: 'W' }),
      entityState('sensor.light_power', '900', { unit_of_measurement: 'W' }),
      entityState('sensor.plugs_power', '1500', { unit_of_measurement: 'W' }),
    ];
    const circuitEntities = circuits.map((state) => ({ entity_id: state.entity_id }));
    const prefs = {
      energy_sources: [],
      device_consumption: [
        { stat_consumption: 'sensor.general_energy', stat_rate: 'sensor.general_power' },
        { stat_consumption: 'sensor.light_energy', stat_rate: 'sensor.light_power', included_in_stat: 'sensor.general_energy' },
        { stat_consumption: 'sensor.plugs_energy', stat_rate: 'sensor.plugs_power', included_in_stat: 'sensor.general_energy' },
      ],
    };

    afterEach(() => resetEnergyPowerConfigCache());

    it('counts a main meter and its circuits in the same room once', async () => {
      resetEnergyPowerConfigCache();
      const hass = makeHass(circuits);
      // Before the energy settings are loaded everything is added up, as before.
      expect(getAreaData(area, hass, circuitEntities).wattage).toBe(u('5.6', 'kW'));

      await loadEnergyPowerConfig({ ...hass, callWS: vi.fn(async () => prefs) } as unknown as HomeAssistant);
      // Same area, same states: the loaded hierarchy still gives a new result.
      expect(getAreaData(area, hass, circuitEntities).wattage).toBe(u('3.2', 'kW'));
    });

    it('keeps the full reading of a main meter whose circuits are in other rooms', async () => {
      resetEnergyPowerConfigCache();
      const hass = makeHass(circuits);
      await loadEnergyPowerConfig({ ...hass, callWS: vi.fn(async () => prefs) } as unknown as HomeAssistant);
      expect(getAreaData(area, hass, [{ entity_id: 'sensor.general_power' }]).wattage).toBe(u('3.2', 'kW'));
    });

    it('only counts the power sensors of the devices in the energy settings (issue #29)', async () => {
      resetEnergyPowerConfigCache();
      const fridge = entityState('sensor.fridge_power', '120', { unit_of_measurement: 'W' });
      const hass = makeHass([...circuits, fridge]);
      const roomEntities = [...circuitEntities, { entity_id: 'sensor.fridge_power' }];
      expect(getAreaData(area, hass, roomEntities).wattage).toBe(u('5.7', 'kW'));

      await loadEnergyPowerConfig({ ...hass, callWS: vi.fn(async () => prefs) } as unknown as HomeAssistant);
      // The fridge is fed by the main meter too, like on the Power dashboard of Home Assistant.
      expect(getAreaData(area, hass, roomEntities).wattage).toBe(u('3.2', 'kW'));
      // A room with only sensors outside the energy settings has no power badge.
      expect(getAreaData({ ...area, area_id: 'kitchen' }, hass, [{ entity_id: 'sensor.fridge_power' }]).wattage).toBeUndefined();
    });

    it('follows changed energy settings for the same area and states', async () => {
      resetEnergyPowerConfigCache();
      const fridge = entityState('sensor.fridge_power', '120', { unit_of_measurement: 'W' });
      const hass = makeHass([...circuits, fridge]);
      const roomEntities = [...circuitEntities, { entity_id: 'sensor.fridge_power' }];
      const load = (answer: unknown) =>
        loadEnergyPowerConfig({ ...hass, callWS: vi.fn(async () => answer) } as unknown as HomeAssistant);

      await load(prefs);
      expect(getAreaData(area, hass, roomEntities).wattage).toBe(u('3.2', 'kW'));
      // The fridge is added to the energy settings; the links stay the same.
      await load({
        ...prefs,
        device_consumption: [...prefs.device_consumption, { stat_consumption: 'sensor.fridge_energy', stat_rate: 'sensor.fridge_power' }],
      });
      expect(getAreaData(area, hass, roomEntities).wattage).toBe(u('3.3', 'kW'));
      // Settings without the hierarchy: every power sensor counts again.
      await load({
        energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.import' }],
        device_consumption: prefs.device_consumption.map(({ stat_consumption, stat_rate }) => ({ stat_consumption, stat_rate })),
      });
      expect(getAreaData(area, hass, roomEntities).wattage).toBe(u('5.7', 'kW'));
    });

    it('counts every power sensor when the energy settings have no hierarchy', async () => {
      resetEnergyPowerConfigCache();
      const fridge = entityState('sensor.fridge_power', '120', { unit_of_measurement: 'W' });
      const hass = makeHass([...circuits, fridge]);
      const flat = {
        energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.import' }],
        device_consumption: prefs.device_consumption.map(({ stat_consumption, stat_rate }) => ({ stat_consumption, stat_rate })),
      };
      await loadEnergyPowerConfig({ ...hass, callWS: vi.fn(async () => flat) } as unknown as HomeAssistant);
      expect(getAreaData(area, hass, [...circuitEntities, { entity_id: 'sensor.fridge_power' }]).wattage).toBe(u('5.7', 'kW'));
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

describe('getAreaEntityGroupKey', () => {
  const key = (entityId: string, deviceClass?: string) =>
    getAreaEntityGroupKey(entityId, entityState(entityId, 'off', deviceClass ? { device_class: deviceClass } : {}));

  it('sorts covers into openings, shading and gates by device class', () => {
    expect(key('cover.front_door', 'door')).toBe('cover_openings');
    expect(key('cover.skylight', 'window')).toBe('cover_openings');
    expect(key('cover.garage', 'garage')).toBe('cover_gates');
    expect(key('cover.driveway', 'gate')).toBe('cover_gates');
    for (const deviceClass of ['blind', 'shade', 'shutter', 'curtain', 'awning', 'damper']) {
      expect(key(`cover.${deviceClass}`, deviceClass)).toBe('cover_shading');
    }
    expect(key('cover.unknown_type')).toBe('cover_shading');
  });

  it('ignores the case of the device class', () => {
    expect(key('cover.garage', 'Garage')).toBe('cover_gates');
    expect(key('binary_sensor.front', 'DOOR')).toBe('cover_openings');
  });

  it('groups binary sensors by meaning', () => {
    for (const deviceClass of ['door', 'window', 'opening']) {
      expect(key('binary_sensor.contact', deviceClass)).toBe('cover_openings');
    }
    for (const deviceClass of ['garage_door', 'gate']) {
      expect(key('binary_sensor.gate', deviceClass)).toBe('cover_gates');
    }
    for (const deviceClass of ['motion', 'moving', 'occupancy', 'presence']) {
      expect(key('binary_sensor.room', deviceClass)).toBe('motion');
    }
    for (const deviceClass of ['smoke', 'gas', 'carbon_monoxide', 'moisture', 'safety', 'tamper', 'problem', 'heat', 'cold']) {
      expect(key('binary_sensor.alert', deviceClass)).toBe('safety');
    }
    expect(key('binary_sensor.battery', 'battery')).toBe('binary_sensor');
    expect(key('binary_sensor.no_class')).toBe('binary_sensor');
  });

  it('puts alarm panels with safety and input selects with selects', () => {
    expect(key('alarm_control_panel.house')).toBe('safety');
    expect(key('input_select.mode')).toBe('select');
    expect(key('select.fan_speed')).toBe('select');
  });

  it('keeps the domain for every other entity', () => {
    expect(key('light.ceiling')).toBe('light');
    expect(key('input_boolean.guest_mode')).toBe('input_boolean');
    expect(key('sensor.temperature', 'temperature')).toBe('sensor');
  });

  it('falls back to the registry device class without a state', () => {
    expect(getAreaEntityGroupKey('cover.garage', undefined, { original_device_class: 'garage' })).toBe('cover_gates');
    expect(getAreaEntityGroupKey('binary_sensor.hall', null, { device_class: 'presence' })).toBe('motion');
  });
});

describe('room group compatibility with older configs', () => {
  it('maps room groups to the broad settings groups', () => {
    expect(areaStrategyGroupForKey('cover_shading')).toBe('covers');
    expect(areaStrategyGroupForKey('cover_openings')).toBe('covers');
    expect(areaStrategyGroupForKey('cover_gates')).toBe('covers');
    expect(areaStrategyGroupForKey('cover')).toBe('covers');
    expect(areaStrategyGroupForKey('safety')).toBe('security');
    expect(areaStrategyGroupForKey('motion')).toBe('motion');
    expect(areaStrategyGroupForKey('light')).toBe('lights');
    expect(areaStrategyGroupForKey('select')).toBe('others');
    expect(areaStrategyGroupForKey('covers')).toBe('covers');
  });

  it('lists the keys older versions saved for a group', () => {
    expect(legacyAreaGroupKeys('cover_gates')).toEqual(['cover_shading', 'cover']);
    expect(legacyAreaGroupKeys('cover_shading')).toEqual(['cover']);
    expect(legacyAreaGroupKeys('cover_openings')).toEqual(['cover']);
    expect(legacyAreaGroupKeys('select')).toEqual(['input_select']);
    expect(legacyAreaGroupKeys('light')).toEqual([]);
  });

  it('reads a group order saved with the single cover group', () => {
    const order = ['cover', 'light', 'motion'];
    expect(areaGroupOrderIndex(order, 'cover_shading')).toBe(0);
    expect(areaGroupOrderIndex(order, 'cover_openings')).toBe(0);
    expect(areaGroupOrderIndex(order, 'cover_gates')).toBe(0);
    expect(areaGroupOrderIndex(order, 'light')).toBe(1);
  });

  it('prefers the own key, then shading for gates, then the old cover group', () => {
    const order = ['light', 'cover', 'cover_shading', 'cover_gates'];
    expect(areaGroupOrderIndex(order, 'cover_gates')).toBe(3);
    expect(areaGroupOrderIndex(['light', 'cover', 'cover_shading'], 'cover_gates')).toBe(2);
    expect(areaGroupOrderIndex(order, 'cover_openings')).toBe(1);
  });

  it('falls back to the broad group the settings editor saved', () => {
    const order = ['lights', 'security', 'covers'];
    expect(areaGroupOrderIndex(order, 'cover_openings')).toBe(2);
    expect(areaGroupOrderIndex(order, 'safety')).toBe(1);
    expect(areaGroupOrderIndex(order, 'light')).toBe(0);
    expect(areaGroupOrderIndex(order, 'media_player')).toBeUndefined();
    expect(areaGroupOrderIndex([], 'light')).toBeUndefined();
  });

  it('reads the entity order of a group from older keys', () => {
    const groupsOptions = {
      cover: { order: ['cover.b', 'cover.a'] },
      cover_shading: { order: ['cover.gate', 'cover.blind'] },
      input_select: { order: ['input_select.mode'] },
      cover_openings: { order: [] },
    };
    expect(resolveAreaGroupEntityOrder(groupsOptions, 'cover_gates')).toEqual(['cover.gate', 'cover.blind']);
    expect(resolveAreaGroupEntityOrder(groupsOptions, 'cover_shading')).toEqual(['cover.gate', 'cover.blind']);
    // An empty saved order does not hide the older one.
    expect(resolveAreaGroupEntityOrder(groupsOptions, 'cover_openings')).toEqual(['cover.b', 'cover.a']);
    expect(resolveAreaGroupEntityOrder({ cover: { order: ['cover.b'] } }, 'cover_gates')).toEqual(['cover.b']);
    expect(resolveAreaGroupEntityOrder(groupsOptions, 'select')).toEqual(['input_select.mode']);
    expect(resolveAreaGroupEntityOrder(groupsOptions, 'light')).toEqual([]);
    expect(resolveAreaGroupEntityOrder(undefined, 'light')).toEqual([]);
  });

  it('moves custom cards of old groups to the group that took over', () => {
    expect(migrateAreaCardPlacement('domain:cover:2')).toBe('domain:cover_shading:2');
    expect(migrateAreaCardPlacement('after:cover')).toBe('after:cover_shading');
    expect(migrateAreaCardPlacement('domain:input_select:0')).toBe('domain:select:0');
    expect(migrateAreaCardPlacement('domain:alarm_control_panel:1')).toBe('domain:safety:1');
    expect(migrateAreaCardPlacement('domain:cover_openings:1')).toBe('domain:cover_openings:1');
    expect(migrateAreaCardPlacement('domain:light:0')).toBe('domain:light:0');
    expect(migrateAreaCardPlacement('domain:constructor:0')).toBe('domain:constructor:0');
    expect(migrateAreaCardPlacement('ungrouped:3')).toBe('ungrouped:3');
    expect(migrateAreaCardPlacement('bottom')).toBe('bottom');
  });
});

describe('area cover groups', () => {
  const states = [
    entityState('cover.blind', 'open', { device_class: 'blind' }),
    entityState('cover.awning', 'closed', { device_class: 'awning' }),
    entityState('cover.plain', 'closed'),
    entityState('cover.front_door', 'closed', { device_class: 'door' }),
    entityState('cover.garage', 'open', { device_class: 'garage' }),
    entityState('binary_sensor.window', 'on', { device_class: 'window' }),
    entityState('light.ceiling', 'on'),
  ];
  const hass = hassWithStates(states);
  const entities = states.map((state) => ({ entity_id: state.entity_id }));
  const ids = (list: { entity_id: string }[]) => list.map((entity) => entity.entity_id);

  it('sorts only covers into their groups', () => {
    const groups = groupAreaCovers(entities, hass.states);
    expect(ids(groups.cover_shading)).toEqual(['cover.blind', 'cover.awning', 'cover.plain']);
    expect(ids(groups.cover_openings)).toEqual(['cover.front_door']);
    expect(ids(groups.cover_gates)).toEqual(['cover.garage']);
  });

  it('selects the covers an open or close action for a group acts on', () => {
    expect(ids(selectAreaCovers(entities, hass.states, 'cover_gates'))).toEqual(['cover.garage']);
    expect(ids(selectAreaCovers(entities, hass.states, 'cover_openings'))).toEqual(['cover.front_door']);
    expect(ids(selectAreaCovers(entities, hass.states, 'cover_shading'))).toEqual(['cover.blind', 'cover.awning', 'cover.plain']);
  });

  it('selects every cover without a group', () => {
    expect(ids(selectAreaCovers(entities, hass.states))).toEqual([
      'cover.blind',
      'cover.awning',
      'cover.plain',
      'cover.front_door',
      'cover.garage',
    ]);
  });

  it('treats covers without a state as shading', () => {
    expect(ids(selectAreaCovers([{ entity_id: 'cover.gone' }], {}, 'cover_shading'))).toEqual(['cover.gone']);
  });
});

describe('overflowingUngroupedCustomCards', () => {
  const card = (placement: string) => ({ id: placement, placement });

  it('finds cards placed past the last entity shown', () => {
    const cards = [card('ungrouped:0'), card('ungrouped:3'), card('ungrouped:4'), card('ungrouped:9')];
    expect(overflowingUngroupedCustomCards(cards, 3, new Set(['light'])).map((entry) => entry.placement))
      .toEqual(['ungrouped:4', 'ungrouped:9']);
  });

  it('finds cards of a type group with no entity on the page', () => {
    const cards = [card('domain:sensor:1'), card('domain:light:0'), card('after:sensor'), card('after:light')];
    expect(overflowingUngroupedCustomCards(cards, 2, new Set(['light'])).map((entry) => entry.placement))
      .toEqual(['domain:sensor:1', 'after:sensor']);
  });

  it('leaves cards at the top, at the bottom and in a shown group alone', () => {
    const cards = [card('top'), card('bottom'), card('domain:light:5')];
    expect(overflowingUngroupedCustomCards(cards, 1, new Set(['light']))).toEqual([]);
  });

  it('puts the cards past the end in the order of their place, the group cards after them', () => {
    const cards = [
      card('ungrouped:9'),
      card('domain:sensor:0'),
      card('ungrouped:6'),
      { id: 'second at 6', placement: 'ungrouped:6' },
      card('after:sensor'),
    ];
    expect(overflowingUngroupedCustomCards(cards, 3, new Set(['light'])).map((entry) => entry.id))
      .toEqual(['ungrouped:6', 'second at 6', 'ungrouped:9', 'domain:sensor:0', 'after:sensor']);
  });

  it('shows every placed card at the end of an empty list', () => {
    const cards = [card('ungrouped:0'), card('ungrouped:1'), card('domain:cover_shading:0')];
    expect(overflowingUngroupedCustomCards(cards, 0, new Set()).map((entry) => entry.placement))
      .toEqual(['ungrouped:1', 'domain:cover_shading:0']);
  });
});
