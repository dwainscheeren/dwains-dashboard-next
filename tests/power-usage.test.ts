import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getEnergyPowerConfig,
  loadEnergyPowerConfig,
  parseEnergyPowerConfig,
  parsePowerTerms,
  resetEnergyPowerConfigCache,
  subscribeEnergyPowerConfig,
  type EnergyPowerConfig,
} from '../src/utils/energy-prefs';
import {
  buildHousePowerUsage,
  computeEnergyHousePower,
  getSignedPowerValueWatts,
} from '../src/utils/power-usage';
import type { HomeAssistant } from '../src/types/home-assistant';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { NARROW_NBSP } from '../src/utils/unit-format';
import { entityState, hassWithStates } from './helpers';

// Shape of a real SmartHomeShop P1 setup (Home Assistant 2026.8, storage minor version 3).
const P1_PREFS = {
  energy_sources: [
    {
      type: 'grid',
      stat_energy_from: 'sensor.p1_grid_import_energy',
      stat_energy_to: 'sensor.p1_grid_export_energy',
      stat_cost: null,
      entity_energy_price: 'sensor.electricity_price',
      number_energy_price: null,
      stat_compensation: null,
      entity_energy_price_export: null,
      number_energy_price_export: null,
      cost_adjustment_day: 0,
      name: 'P1 meter',
      power_config: {
        stat_rate_from: 'sensor.p1_power_consumed',
        stat_rate_to: 'sensor.p1_power_produced',
      },
      stat_rate: 'sensor.energy_grid_p1_net_power',
    },
    { type: 'gas', stat_energy_from: 'sensor.p1_gas', stat_cost: null, entity_energy_price: null, number_energy_price: null },
    { type: 'water', stat_energy_from: 'sensor.p1_water', stat_cost: null, entity_energy_price: null, number_energy_price: null },
  ],
  device_consumption: [],
  device_consumption_water: [],
};

const watt = (entityId: string, value: string | number, unit = 'W', extra: Record<string, any> = {}) =>
  entityState(entityId, String(value), { unit_of_measurement: unit, device_class: 'power', ...extra });

describe('parsePowerTerms', () => {
  it('reads the three power_config variants and a plain stat_rate', () => {
    expect(parsePowerTerms({ stat_rate_from: 'sensor.in', stat_rate_to: 'sensor.out' }, 'sensor.net')).toEqual([
      { entityId: 'sensor.in', sign: 1 },
      { entityId: 'sensor.out', sign: -1 },
    ]);
    expect(parsePowerTerms({ stat_rate_inverted: 'sensor.inv' })).toEqual([{ entityId: 'sensor.inv', sign: -1 }]);
    expect(parsePowerTerms({ stat_rate: 'sensor.std' }, 'sensor.other')).toEqual([{ entityId: 'sensor.std', sign: 1 }]);
    expect(parsePowerTerms(undefined, 'sensor.net')).toEqual([{ entityId: 'sensor.net', sign: 1 }]);
    expect(parsePowerTerms('nonsense', 42)).toEqual([]);
  });
});

describe('parseEnergyPowerConfig', () => {
  it('reads a P1 grid connection with separate import and export power sensors', () => {
    const config = parseEnergyPowerConfig(P1_PREFS)!;
    expect(config.grid).toEqual([
      { entityId: 'sensor.p1_power_consumed', sign: 1 },
      { entityId: 'sensor.p1_power_produced', sign: -1 },
    ]);
    expect(config.solar).toEqual([]);
    expect(config.battery).toEqual([]);
    expect(config.sourceEntityIds).toEqual(expect.arrayContaining([
      'sensor.p1_grid_import_energy',
      'sensor.p1_grid_export_energy',
      'sensor.p1_power_consumed',
      'sensor.p1_power_produced',
      'sensor.energy_grid_p1_net_power',
    ]));
    expect(config.sourceEntityIds).not.toContain('sensor.p1_gas');
  });

  it('reads the legacy grid format, solar, battery and device power sensors', () => {
    const config = parseEnergyPowerConfig({
      energy_sources: [
        {
          type: 'grid',
          flow_from: [{ stat_energy_from: 'sensor.import_t1' }, { stat_energy_from: 'sensor.import_t2' }],
          flow_to: [{ stat_energy_to: 'sensor.export_t1' }],
          power: [{ stat_rate: 'sensor.grid_power' }],
          cost_adjustment_day: 0,
        },
        { type: 'solar', stat_energy_from: 'sensor.solar_energy', stat_rate: 'sensor.solar_power' },
        {
          type: 'battery',
          stat_energy_from: 'sensor.battery_out',
          stat_energy_to: 'sensor.battery_in',
          power_config: { stat_rate_inverted: 'sensor.battery_charge_power' },
          stat_rate: 'sensor.battery_generated',
        },
      ],
      device_consumption: [
        { stat_consumption: 'sensor.washer_energy', stat_rate: 'sensor.washer_power' },
        { stat_consumption: 'sensor.dryer_energy' },
      ],
    })!;
    expect(config.grid).toEqual([{ entityId: 'sensor.grid_power', sign: 1 }]);
    expect(config.solar).toEqual([{ entityId: 'sensor.solar_power', sign: 1 }]);
    expect(config.battery).toEqual([{ entityId: 'sensor.battery_charge_power', sign: -1 }]);
    expect(config.deviceRateEntityIds).toEqual(['sensor.washer_power']);
    expect(config.sourceEntityIds).toEqual(expect.arrayContaining([
      'sensor.import_t1', 'sensor.import_t2', 'sensor.export_t1', 'sensor.solar_energy', 'sensor.battery_in',
    ]));
  });

  it('returns null without grid, solar or battery sources', () => {
    expect(parseEnergyPowerConfig(null)).toBeNull();
    expect(parseEnergyPowerConfig('nope')).toBeNull();
    expect(parseEnergyPowerConfig({ energy_sources: 'broken' })).toBeNull();
    expect(parseEnergyPowerConfig({ energy_sources: [{ type: 'gas', stat_energy_from: 'sensor.gas' }] })).toBeNull();
    expect(parseEnergyPowerConfig({ energy_sources: [null, 3, { type: 'grid' }] })).toEqual({
      grid: [], solar: [], battery: [], sourceEntityIds: [], deviceRateEntityIds: [],
    });
  });
});

describe('computeEnergyHousePower', () => {
  const energy = (overrides: Partial<EnergyPowerConfig>): EnergyPowerConfig => ({
    grid: [
      { entityId: 'sensor.consumed', sign: 1 },
      { entityId: 'sensor.produced', sign: -1 },
    ],
    solar: [],
    battery: [],
    sourceEntityIds: [],
    deviceRateEntityIds: [],
    ...overrides,
  });

  it('uses the net grid power', () => {
    const hass = hassWithStates([watt('sensor.consumed', 640), watt('sensor.produced', 0)]);
    expect(computeEnergyHousePower(hass, energy({}))?.watts).toBe(640);
  });

  it('adds solar production and net battery power', () => {
    const hass = hassWithStates([
      watt('sensor.consumed', 0),
      watt('sensor.produced', 2, 'kW'),
      watt('sensor.solar', 3, 'kW'),
      watt('sensor.battery', -500),
    ]);
    // Exporting 2 kW while the panels make 3 kW and the battery charges with 500 W:
    // (0 - 2000) + 3000 + (-500) = 500 W used in the house.
    const result = computeEnergyHousePower(hass, energy({
      solar: [{ entityId: 'sensor.solar', sign: 1 }],
      battery: [{ entityId: 'sensor.battery', sign: 1 }],
    }));
    expect(result?.watts).toBe(500);
    expect(result?.sources.map((source) => source.role)).toEqual(['grid', 'grid', 'solar', 'battery']);
  });

  it('counts an unavailable solar sensor as zero and never goes below zero', () => {
    const hass = hassWithStates([
      watt('sensor.consumed', 0),
      watt('sensor.produced', 800),
      entityState('sensor.solar', 'unavailable', { unit_of_measurement: 'W' }),
    ]);
    const result = computeEnergyHousePower(hass, energy({ solar: [{ entityId: 'sensor.solar', sign: 1 }] }));
    expect(result?.watts).toBe(0);
    expect(result?.sources.map((source) => source.entityId)).toEqual(['sensor.consumed', 'sensor.produced']);
  });

  it('returns null when no grid sensor has a value', () => {
    const hass = hassWithStates([
      entityState('sensor.consumed', 'unavailable', { unit_of_measurement: 'W' }),
      entityState('sensor.produced', 'unknown', { unit_of_measurement: 'W' }),
    ]);
    expect(computeEnergyHousePower(hass, energy({}))).toBeNull();
    expect(computeEnergyHousePower(hass, null)).toBeNull();
    expect(computeEnergyHousePower(hass, energy({ grid: [] }))).toBeNull();
  });

  it('keeps the sign of power readings', () => {
    expect(getSignedPowerValueWatts(watt('sensor.x', -1.5, 'kW'))).toBe(-1500);
    expect(getSignedPowerValueWatts(entityState('sensor.x', '12', { device_class: 'power' }))).toBe(12);
    expect(getSignedPowerValueWatts(entityState('sensor.x', '12', { unit_of_measurement: 'kWh' }))).toBeNull();
  });
});

describe('buildHousePowerUsage', () => {
  const config = {
    areas: [
      { area_id: 'meter_cupboard', name: 'Meter cupboard' },
      { area_id: 'living', name: 'Living room' },
      { area_id: 'laundry', name: 'Laundry' },
    ],
    devices: [
      { device_id: 'dev-p1', name: 'P1 meter', area_id: 'meter_cupboard' },
      { device_id: 'dev-plug', name: 'TV plug', area_id: 'living' },
      { device_id: 'dev-washer', name: 'Washer', area_id: 'laundry' },
    ],
    entities: [
      { entity_id: 'sensor.p1_power_consumed', device_id: 'dev-p1' },
      { entity_id: 'sensor.p1_power_produced', device_id: 'dev-p1' },
      { entity_id: 'sensor.p1_power_consumed_phase_1', device_id: 'dev-p1' },
      { entity_id: 'sensor.p1_available_grid_power', device_id: 'dev-p1' },
      { entity_id: 'sensor.energy_grid_p1_net_power', device_id: 'dev-p1' },
      { entity_id: 'sensor.tv_power', device_id: 'dev-plug' },
      { entity_id: 'sensor.tv_plug_power_limit', device_id: 'dev-plug' },
      { entity_id: 'sensor.washer_power', device_id: 'dev-washer' },
    ],
    settings: {},
  } as DwainsDashboardConfig;

  const entities: Record<string, any> = {
    'sensor.p1_power_consumed': { entity_id: 'sensor.p1_power_consumed', device_id: 'dev-p1', platform: 'esphome' },
    'sensor.p1_power_produced': { entity_id: 'sensor.p1_power_produced', device_id: 'dev-p1', platform: 'esphome' },
    'sensor.p1_power_consumed_phase_1': { entity_id: 'sensor.p1_power_consumed_phase_1', device_id: 'dev-p1', platform: 'esphome' },
    'sensor.p1_available_grid_power': { entity_id: 'sensor.p1_available_grid_power', device_id: 'dev-p1', platform: 'smarthomeshop' },
    'sensor.energy_grid_p1_net_power': { entity_id: 'sensor.energy_grid_p1_net_power', device_id: 'dev-p1', platform: 'energy' },
    'sensor.tv_power': { entity_id: 'sensor.tv_power', device_id: 'dev-plug', platform: 'shelly' },
    'sensor.tv_plug_power_limit': { entity_id: 'sensor.tv_plug_power_limit', device_id: 'dev-plug', platform: 'shelly', entity_category: 'config' },
    'sensor.washer_power': { entity_id: 'sensor.washer_power', device_id: 'dev-washer', platform: 'shelly' },
  };

  const hass = (): HomeAssistant => hassWithStates([
    watt('sensor.p1_power_consumed', 0.9, 'kW', { friendly_name: 'Power consumed' }),
    watt('sensor.p1_power_produced', 0, 'kW', { friendly_name: 'Power produced' }),
    watt('sensor.p1_power_consumed_phase_1', 0.4, 'kW'),
    watt('sensor.p1_available_grid_power', 16, 'kW'),
    watt('sensor.energy_grid_p1_net_power', 900),
    watt('sensor.tv_power', 120, 'W', { friendly_name: 'TV power' }),
    watt('sensor.tv_plug_power_limit', 3600),
    watt('sensor.washer_power', 400, 'W', { friendly_name: 'Washer power' }),
  ], { entities });

  it('uses the grid meter for the total and keeps consumers per area', () => {
    const summary = buildHousePowerUsage(hass(), config, parseEnergyPowerConfig(P1_PREFS));
    expect(summary.basis).toBe('energy');
    expect(summary.totalWatts).toBe(900);
    expect(summary.formattedTotal).toBe(`900${NARROW_NBSP}W`);
    expect(summary.sources.map((source) => source.name)).toEqual(['Power consumed', 'Power produced']);
    expect(summary.sensorCount).toBe(2);
    expect(summary.areas.map((area) => [area.areaId, area.totalWatts])).toEqual([['laundry', 400], ['living', 120]]);
    expect(summary.roomSensorCount).toBe(2);
    expect(summary.roomTotalWatts).toBe(520);
  });

  it('keeps power sensors of individual devices from the energy settings', () => {
    const prefs = {
      ...P1_PREFS,
      device_consumption: [{ stat_consumption: 'sensor.p1_power_consumed_phase_1_energy', stat_rate: 'sensor.p1_power_consumed_phase_1' }],
    };
    const summary = buildHousePowerUsage(hass(), config, parseEnergyPowerConfig(prefs));
    expect(summary.areas.map((area) => area.areaId)).toContain('meter_cupboard');
    expect(summary.areas.find((area) => area.areaId === 'meter_cupboard')?.entities.map((entity) => entity.entityId))
      .toEqual(['sensor.p1_power_consumed_phase_1']);
  });

  it('falls back to the sum of the areas without energy settings', () => {
    const summary = buildHousePowerUsage(hass(), config, null);
    expect(summary.basis).toBe('rooms');
    expect(summary.sources).toEqual([]);
    // Only the energy integration's own sensor and the config entity are left out.
    expect(summary.totalWatts).toBe(900 + 0 + 400 + 16000 + 120 + 400);
    expect(summary.sensorCount).toBe(6);
  });

  it('leaves meter devices out of the area sum when only grid energy is configured', () => {
    const prefs = {
      energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.p1_power_consumed', stat_energy_to: null, cost_adjustment_day: 0 }],
      device_consumption: [],
    };
    const summary = buildHousePowerUsage(hass(), config, parseEnergyPowerConfig(prefs));
    expect(summary.basis).toBe('rooms');
    expect(summary.totalWatts).toBe(520);
  });

  it('falls back to the areas when the grid meter is unavailable', () => {
    const states = hass();
    states.states['sensor.p1_power_consumed'] = entityState('sensor.p1_power_consumed', 'unavailable', { unit_of_measurement: 'kW' });
    states.states['sensor.p1_power_produced'] = entityState('sensor.p1_power_produced', 'unavailable', { unit_of_measurement: 'kW' });
    const summary = buildHousePowerUsage(states, config, parseEnergyPowerConfig(P1_PREFS));
    expect(summary.basis).toBe('rooms');
    expect(summary.totalWatts).toBe(520);
  });

  it('reports no total without any power sensor', () => {
    const summary = buildHousePowerUsage(hassWithStates([]), config, null);
    expect(summary.sensorCount).toBe(0);
    expect(summary.formattedTotal).toBe('');
  });
});

describe('energy settings cache', () => {
  beforeEach(() => resetEnergyPowerConfigCache());

  const hassWithPrefs = (answer: () => Promise<unknown>): HomeAssistant =>
    ({ states: {}, callWS: vi.fn(answer) } as unknown as HomeAssistant);

  it('loads once, caches the result and notifies subscribers', async () => {
    const hass = hassWithPrefs(async () => P1_PREFS);
    const listener = vi.fn();
    subscribeEnergyPowerConfig(listener);

    expect(getEnergyPowerConfig(hass)).toBeUndefined();
    expect(getEnergyPowerConfig(hass)).toBeUndefined();
    const loaded = await loadEnergyPowerConfig(hass);

    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(loaded?.grid).toHaveLength(2);
    expect(getEnergyPowerConfig(hass)).toBe(loaded);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('treats errors as no energy settings', async () => {
    const hass = hassWithPrefs(async () => {
      throw { code: 'not_found', message: 'No prefs' };
    });
    expect(await loadEnergyPowerConfig(hass)).toBeNull();
    expect(getEnergyPowerConfig(hass)).toBeNull();
  });

  it('does nothing without a connection', async () => {
    expect(await loadEnergyPowerConfig(hassWithStates([]))).toBeNull();
    expect(getEnergyPowerConfig(undefined)).toBeUndefined();
  });
});
