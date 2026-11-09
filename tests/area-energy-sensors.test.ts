import { describe, expect, it } from 'vitest';
import {
  areaPageEntities,
  hidesEnergySensorsInArea,
  isEnergyMonitoringSensor,
  withAreaShowEnergySensors,
  withHideEnergySensors,
} from '../src/utils/area-energy-sensors';
import { resetAreaLayout } from '../src/utils/settings-reset';
import { buildHousePowerUsage } from '../src/utils/power-usage';
import { getAreaData } from '../src/utils/area';
import { AreaEntityResolver } from '../src/utils/area-entity-resolver';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

const HIDE = { settings: { hide_energy_sensors_on_area_pages: true } } as DwainsDashboardConfig;

describe('isEnergyMonitoringSensor', () => {
  it('finds power and energy sensors by their device class', () => {
    expect(isEnergyMonitoringSensor(entityState('sensor.lamp_power', '6', { device_class: 'power', unit_of_measurement: 'W' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.lamp_energy', '1.2', { device_class: 'energy', unit_of_measurement: 'kWh' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.lamp_power', '6', { device_class: 'Power ' }))).toBe(true);
  });

  it('falls back to the unit for sensors without a device class', () => {
    expect(isEnergyMonitoringSensor(entityState('sensor.a', '6', { unit_of_measurement: 'W' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.b', '1', { unit_of_measurement: 'kWh' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.c', '1', { unit_of_measurement: 'MW' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.d', '21', { unit_of_measurement: '°C' }))).toBe(false);
    // Written in another case, other power and energy units.
    expect(isEnergyMonitoringSensor(entityState('sensor.f', '1', { unit_of_measurement: 'kw' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.g', '1', { unit_of_measurement: 'TW' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.h', '1', { unit_of_measurement: 'BTU/h' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.i', '1', { unit_of_measurement: 'kJ' }))).toBe(true);
    // Calories without a device class are usually fitness data, not energy use.
    expect(isEnergyMonitoringSensor(entityState('sensor.j', '1', { unit_of_measurement: 'kcal' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('sensor.j2', '1', { device_class: 'energy', unit_of_measurement: 'kcal' }))).toBe(true);
    expect(isEnergyMonitoringSensor(entityState('sensor.k', '1', { unit_of_measurement: 'A' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('sensor.e', 'on', {}))).toBe(false);
  });

  it('keeps sensors with another device class, also with a power like unit', () => {
    expect(isEnergyMonitoringSensor(entityState('sensor.current', '0.4', { device_class: 'current', unit_of_measurement: 'A' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('sensor.voltage', '230', { device_class: 'voltage', unit_of_measurement: 'V' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('sensor.battery', '80', { device_class: 'battery', unit_of_measurement: '%' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('sensor.odd', '5', { device_class: 'temperature', unit_of_measurement: 'W' }))).toBe(false);
  });

  it('only looks at sensors', () => {
    expect(isEnergyMonitoringSensor(entityState('input_number.power', '6', { unit_of_measurement: 'W' }))).toBe(false);
    expect(isEnergyMonitoringSensor(entityState('binary_sensor.power', 'on', { device_class: 'power' }))).toBe(false);
    expect(isEnergyMonitoringSensor(undefined)).toBe(false);
    expect(isEnergyMonitoringSensor(null)).toBe(false);
  });
});

describe('hidesEnergySensorsInArea', () => {
  it('is off by default', () => {
    expect(hidesEnergySensorsInArea(undefined, 'kitchen')).toBe(false);
    expect(hidesEnergySensorsInArea({ settings: {} } as DwainsDashboardConfig, 'kitchen')).toBe(false);
  });

  it('hides them in every room once turned on', () => {
    expect(hidesEnergySensorsInArea(HIDE, 'kitchen')).toBe(true);
  });

  it('hides them when no room is given and the setting is on', () => {
    expect(hidesEnergySensorsInArea(HIDE, null)).toBe(true);
    expect(hidesEnergySensorsInArea(HIDE, undefined)).toBe(true);
  });

  it('lets a room show them anyway', () => {
    const config = { ...HIDE, areas_options: { kitchen: { show_energy_sensors: true } } } as DwainsDashboardConfig;
    expect(hidesEnergySensorsInArea(config, 'kitchen')).toBe(false);
    expect(hidesEnergySensorsInArea(config, 'office')).toBe(true);
  });
});

describe('areaPageEntities', () => {
  const states = [
    entityState('light.ceiling', 'on'),
    entityState('sensor.ceiling_power', '6', { device_class: 'power', unit_of_measurement: 'W' }),
    entityState('sensor.ceiling_energy', '1.2', { device_class: 'energy', unit_of_measurement: 'kWh' }),
    entityState('sensor.temperature', '21', { device_class: 'temperature', unit_of_measurement: '°C' }),
  ];
  const hass = hassWithStates(states);
  const entities = states.map((state) => ({ entity_id: state.entity_id }));

  it('leaves the list alone while the setting is off', () => {
    expect(areaPageEntities(entities, hass, { settings: {} } as DwainsDashboardConfig, 'office')).toBe(entities);
  });

  it('leaves out power and energy sensors when the room hides them', () => {
    expect(areaPageEntities(entities, hass, HIDE, 'office').map((entity) => entity.entity_id))
      .toEqual(['light.ceiling', 'sensor.temperature']);
  });

  it('keeps them in a room with an exception', () => {
    const config = { ...HIDE, areas_options: { office: { show_energy_sensors: true } } } as DwainsDashboardConfig;
    expect(areaPageEntities(entities, hass, config, 'office')).toBe(entities);
  });

  it('returns the list itself when nothing is left out', () => {
    const plain = [{ entity_id: 'light.ceiling' }, { entity_id: 'sensor.temperature' }];
    expect(areaPageEntities(plain, hass, HIDE, 'office')).toBe(plain);
  });

  it('follows a sensor that becomes a power sensor', () => {
    const changed = hassWithStates([...states.slice(0, 3), entityState('sensor.temperature', '5', { device_class: 'power', unit_of_measurement: 'W' })]);
    expect(areaPageEntities(entities, changed, HIDE, 'office').map((entity) => entity.entity_id)).toEqual(['light.ceiling']);
  });

  it('keeps every entity without states', () => {
    expect(areaPageEntities(entities, undefined, HIDE, 'office')).toBe(entities);
  });

  it('keeps entities without a state, as the room page decides about those', () => {
    const withUnknown = [...entities, { entity_id: 'sensor.not_loaded' }];
    expect(areaPageEntities(withUnknown, hass, HIDE, 'office').map((entity) => entity.entity_id))
      .toEqual(['light.ceiling', 'sensor.temperature', 'sensor.not_loaded']);
  });
});

describe('storing the setting', () => {
  it('turns the setting on and leaves it out of the config when off', () => {
    const config = { settings: { show_area_favorites: false } } as DwainsDashboardConfig;
    const on = withHideEnergySensors(config, true);
    expect(on.settings).toEqual({ show_area_favorites: false, hide_energy_sensors_on_area_pages: true });
    const off = withHideEnergySensors(on, false);
    expect(off.settings).toEqual({ show_area_favorites: false });
    expect('hide_energy_sensors_on_area_pages' in off.settings!).toBe(false);
    // The given config is not changed.
    expect(config.settings).toEqual({ show_area_favorites: false });
  });

  it('turns the exception of one room on and off and keeps its other options', () => {
    const config = {
      areas_options: { office: { entity_layout: 'ungrouped' }, kitchen: { group_order: ['light'] } },
    } as DwainsDashboardConfig;
    const on = withAreaShowEnergySensors(config, 'office', true);
    expect(on.areas_options).toEqual({
      office: { entity_layout: 'ungrouped', show_energy_sensors: true },
      kitchen: { group_order: ['light'] },
    });
    const off = withAreaShowEnergySensors(on, 'office', false);
    expect(off.areas_options).toEqual({ office: { entity_layout: 'ungrouped' }, kitchen: { group_order: ['light'] } });
    expect(config.areas_options!.office).toEqual({ entity_layout: 'ungrouped' });
    // A room without options gets the key only when turned on.
    expect(withAreaShowEnergySensors({} as DwainsDashboardConfig, 'garage', true).areas_options).toEqual({ garage: { show_energy_sensors: true } });
  });

  it('keeps the exception of a room when its layout is reset', () => {
    expect(resetAreaLayout({ entity_layout: 'ungrouped', entity_order: ['light.a'], show_energy_sensors: true }))
      .toEqual({ show_energy_sensors: true });
  });
});

// Regression guards: the power numbers and the shared list of a room must not
// start reading the setting. Only the cards of the room page filter.
describe('the power numbers ignore the setting', () => {
  const config = {
    ...HIDE,
    areas: [{ area_id: 'office', name: 'Office' }],
    entities: [
      { entity_id: 'sensor.ceiling_power', area_id: 'office' },
      { entity_id: 'sensor.desk_power', area_id: 'office' },
    ],
  } as DwainsDashboardConfig;
  const states = [
    entityState('sensor.ceiling_power', '6', { device_class: 'power', unit_of_measurement: 'W' }),
    entityState('sensor.desk_power', '120', { device_class: 'power', unit_of_measurement: 'W' }),
  ];

  it('keeps counting hidden sensors in the house power usage', () => {
    const summary = buildHousePowerUsage(hassWithStates(states), config, null);
    expect(summary.totalWatts).toBe(126);
    expect(summary.areas[0]?.entities.map((entity) => entity.entityId)).toEqual(['sensor.desk_power', 'sensor.ceiling_power']);
  });

  it('keeps them in the shared list of the room that the header and badges use', () => {
    // Only the room page cards filter them; the shared list stays complete.
    const resolver = new AreaEntityResolver();
    const ids = resolver.filteredAreaEntities('office', hassWithStates(states), config).map((entity) => entity.entity_id);
    expect(ids).toEqual(['sensor.ceiling_power', 'sensor.desk_power']);
  });

  it('keeps counting hidden sensors in the power badge of the room', () => {
    const area = { area_id: 'office', name: 'Office', picture: null };
    const hass = hassWithStates(states, { areas: { office: { area_id: 'office' } } });
    const data = getAreaData(area as any, hass, config.entities!, config);
    expect(data.wattage).toMatch(/^126/);
  });
});
