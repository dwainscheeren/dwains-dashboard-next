import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  countedPowerSensorsOf,
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
  createHousePowerUsageMemo,
  getSignedPowerValueWatts,
} from '../src/utils/power-usage';
import { buildUpstreamRates, splitUpstreamPower } from '../src/utils/power-hierarchy';
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

/** A loop guard that breaks makes the test fail instead of hanging the run. */
const LOOKUP_LIMIT = 1000;
const endlessLoop = () => new Error('endless loop: a loop guard is missing');

/** Links that throw once they are read far more often than any real hierarchy needs. */
function guardedLinks(links: Record<string, string>): Record<string, string> {
  let lookups = 0;
  const count = () => {
    if (++lookups > LOOKUP_LIMIT) throw endlessLoop();
  };
  return new Proxy(links, {
    get(target, key, receiver) {
      count();
      return Reflect.get(target, key, receiver);
    },
    getOwnPropertyDescriptor(target, key) {
      count();
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });
}

/** A device whose upstream link throws once it is read far too often. */
function guardedDevice(link: { consumption?: string; rate?: string; includedIn?: string }) {
  let reads = 0;
  return {
    consumption: link.consumption,
    rate: link.rate,
    get includedIn() {
      if (++reads > LOOKUP_LIMIT) throw endlessLoop();
      return link.includedIn;
    },
  };
}

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
      grid: [], solar: [], battery: [], sourceEntityIds: [], deviceRateEntityIds: [], upstreamRates: {},
    });
    // Devices without a hierarchy and without a source change nothing.
    expect(parseEnergyPowerConfig({
      energy_sources: [],
      device_consumption: [{ stat_consumption: 'sensor.washer_energy', stat_rate: 'sensor.washer_power' }],
    })).toBeNull();
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
    upstreamRates: {},
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

  it('only recomputes when a power sensor, the config or the registry changes', () => {
    const memo = createHousePowerUsageMemo();
    const first = hass();
    const summary = memo(first, config);

    const withLight = { ...first, states: { ...first.states, 'light.lamp': entityState('light.lamp', 'on') } } as HomeAssistant;
    expect(memo(withLight, config)).toBe(summary);

    const withTemperature = {
      ...withLight,
      states: { ...withLight.states, 'sensor.temperature': entityState('sensor.temperature', '21', { unit_of_measurement: '°C' }) },
    } as HomeAssistant;
    expect(memo(withTemperature, config)).toBe(summary);

    const withPower = {
      ...withTemperature,
      states: { ...withTemperature.states, 'sensor.tv_power': watt('sensor.tv_power', 200, 'W', { friendly_name: 'TV power' }) },
    } as HomeAssistant;
    const next = memo(withPower, config);
    expect(next).not.toBe(summary);
    expect(next.areas.find((area) => area.areaId === 'living')?.totalWatts).toBe(200);

    const configCopy = { ...config };
    const afterConfig = memo(withPower, configCopy);
    expect(afterConfig).not.toBe(next);
    expect(memo(withPower, configCopy)).toBe(afterConfig);
    expect(memo({ ...withPower, entities: { ...entities } } as HomeAssistant, configCopy)).not.toBe(afterConfig);
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

  it('picks up changed settings after ten minutes', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2026-11-09T10:00:00Z'));
      let answer: unknown = P1_PREFS;
      const hass = hassWithPrefs(async () => answer);
      const listener = vi.fn();
      subscribeEnergyPowerConfig(listener);
      const first = await loadEnergyPowerConfig(hass);
      answer = CIRCUIT_PREFS;

      vi.setSystemTime(new Date('2026-11-09T10:09:00Z'));
      expect(getEnergyPowerConfig(hass)).toBe(first);
      // A refresh would only call Home Assistant after a tick, so wait one.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(hass.callWS).toHaveBeenCalledTimes(1);
      expect(getEnergyPowerConfig(hass)).toBe(first);

      vi.setSystemTime(new Date('2026-11-09T10:11:00Z'));
      // Reading the stale settings starts a refresh in the background; the old
      // settings stay in use while the new ones load.
      expect(getEnergyPowerConfig(hass)).toBe(first);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(hass.callWS).toHaveBeenCalledTimes(2);
      const next = getEnergyPowerConfig(hass);
      expect(next).not.toBe(first);
      expect(next?.upstreamRates).toEqual({
        'sensor.light_power': 'sensor.general_power',
        'sensor.plugs_power': 'sensor.general_power',
      });
      expect(getEnergyPowerConfig(hass)).toBe(next);
      expect(listener).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the last settings when a refresh fails', async () => {
    let fail = false;
    const hass = hassWithPrefs(async () => {
      if (fail) throw new Error('Connection lost');
      return CIRCUIT_PREFS;
    });
    const first = await loadEnergyPowerConfig(hass);
    fail = true;
    expect(await loadEnergyPowerConfig(hass)).toBe(first);
    expect(getEnergyPowerConfig(hass)?.upstreamRates).toEqual({
      'sensor.light_power': 'sensor.general_power',
      'sensor.plugs_power': 'sensor.general_power',
    });
  });

  it('keeps the same object when the settings did not change', async () => {
    const hass = hassWithPrefs(async () => CIRCUIT_PREFS);
    const first = await loadEnergyPowerConfig(hass);
    const second = await loadEnergyPowerConfig(hass);
    expect(second).toBe(first);
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

// A meter that measures every circuit of the electric panel (issue #29): the
// main line with the circuits below it as "Upstream device" in the energy settings.
const CIRCUIT_PREFS = {
  energy_sources: [],
  device_consumption: [
    { stat_consumption: 'sensor.general_energy', stat_rate: 'sensor.general_power', name: 'General' },
    { stat_consumption: 'sensor.light_energy', stat_rate: 'sensor.light_power', included_in_stat: 'sensor.general_energy' },
    { stat_consumption: 'sensor.plugs_energy', stat_rate: 'sensor.plugs_power', included_in_stat: 'sensor.general_energy' },
  ],
  device_consumption_water: [],
};

describe('device hierarchy of the energy settings', () => {
  it('links the power sensor of every device to the one upstream of it', () => {
    const config = parseEnergyPowerConfig(CIRCUIT_PREFS)!;
    expect(config).not.toBeNull();
    expect(config.grid).toEqual([]);
    expect(config.upstreamRates).toEqual({
      'sensor.light_power': 'sensor.general_power',
      'sensor.plugs_power': 'sensor.general_power',
    });
    expect(config.deviceRateEntityIds).toEqual(['sensor.general_power', 'sensor.light_power', 'sensor.plugs_power']);
  });

  it('skips an upstream device without a power sensor', () => {
    expect(buildUpstreamRates([
      { consumption: 'sensor.main_energy', rate: 'sensor.main_power' },
      { consumption: 'sensor.floor_energy', includedIn: 'sensor.main_energy' },
      { consumption: 'sensor.desk_energy', rate: 'sensor.desk_power', includedIn: 'sensor.floor_energy' },
    ])).toEqual({ 'sensor.desk_power': 'sensor.main_power' });
  });

  it('drops links to unknown devices and to the device itself', () => {
    expect(buildUpstreamRates([
      { consumption: 'sensor.a_energy', rate: 'sensor.a_power', includedIn: 'sensor.gone_energy' },
      { consumption: 'sensor.b_energy', rate: 'sensor.b_power', includedIn: 'sensor.b_energy' },
      { consumption: 'sensor.c_energy', includedIn: 'sensor.a_energy' },
    ])).toEqual({});
  });

  it('breaks a loop that was stored by hand', () => {
    const upstream = buildUpstreamRates([
      { consumption: 'sensor.a_energy', rate: 'sensor.a_power', includedIn: 'sensor.b_energy' },
      { consumption: 'sensor.b_energy', rate: 'sensor.b_power', includedIn: 'sensor.a_energy' },
      { consumption: 'sensor.c_energy', rate: 'sensor.c_power', includedIn: 'sensor.a_energy' },
    ]);
    expect(upstream).toEqual({ 'sensor.b_power': 'sensor.a_power', 'sensor.c_power': 'sensor.a_power' });
  });

  it('breaks a longer loop that runs through devices without a power sensor', () => {
    const upstream = buildUpstreamRates([
      { consumption: 'sensor.a_energy', rate: 'sensor.a_power', includedIn: 'sensor.x_energy' },
      { consumption: 'sensor.x_energy', includedIn: 'sensor.b_energy' },
      { consumption: 'sensor.b_energy', rate: 'sensor.b_power', includedIn: 'sensor.a_energy' },
    ]);
    expect(upstream).toEqual({ 'sensor.b_power': 'sensor.a_power' });
  });

  it('stops on a loop between devices without a power sensor', () => {
    expect(buildUpstreamRates([
      guardedDevice({ consumption: 'sensor.a_energy', rate: 'sensor.a_power', includedIn: 'sensor.x_energy' }),
      guardedDevice({ consumption: 'sensor.x_energy', includedIn: 'sensor.y_energy' }),
      guardedDevice({ consumption: 'sensor.y_energy', includedIn: 'sensor.x_energy' }),
    ])).toEqual({});
  });

  it('lists every device power sensor once', () => {
    const config = parseEnergyPowerConfig({
      energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.import' }],
      device_consumption: [
        { stat_consumption: 'sensor.a_energy', stat_rate: 'sensor.shared_power' },
        { stat_consumption: 'sensor.b_energy', stat_rate: 'sensor.shared_power' },
      ],
    })!;
    expect(config.deviceRateEntityIds).toEqual(['sensor.shared_power']);
  });

  it('ignores broken entries', () => {
    const config = parseEnergyPowerConfig({
      energy_sources: [{ type: 'solar', stat_energy_from: 'sensor.solar_energy' }],
      device_consumption: [null, 'x', { stat_rate: 42, included_in_stat: ['nope'] }, { stat_consumption: 'sensor.ok', stat_rate: 'sensor.ok_power' }],
    })!;
    expect(config.upstreamRates).toEqual({});
    expect(config.deviceRateEntityIds).toEqual(['sensor.ok_power']);
  });
});

describe('countedPowerSensorsOf', () => {
  it('counts every power sensor without energy settings or without a hierarchy', () => {
    expect(countedPowerSensorsOf(undefined)).toBeNull();
    expect(countedPowerSensorsOf(null)).toBeNull();
    expect(countedPowerSensorsOf(parseEnergyPowerConfig({
      ...P1_PREFS,
      device_consumption: [{ stat_consumption: 'sensor.washer_energy', stat_rate: 'sensor.washer_power' }],
    }))).toBeNull();
    // A hierarchy of devices without power sensors gives no links for power.
    expect(countedPowerSensorsOf(parseEnergyPowerConfig({
      ...P1_PREFS,
      device_consumption: [
        { stat_consumption: 'sensor.main_energy' },
        { stat_consumption: 'sensor.washer_energy', stat_rate: 'sensor.washer_power', included_in_stat: 'sensor.main_energy' },
      ],
    }))).toBeNull();
  });

  it('only counts the power sensors of the devices in the energy settings with a hierarchy', () => {
    const energy = parseEnergyPowerConfig({
      ...CIRCUIT_PREFS,
      device_consumption: [
        ...CIRCUIT_PREFS.device_consumption,
        { stat_consumption: 'sensor.oven_energy', stat_rate: 'sensor.oven_power' },
        { stat_consumption: 'sensor.dryer_energy' },
      ],
    });
    expect([...countedPowerSensorsOf(energy)!]).toEqual([
      'sensor.general_power',
      'sensor.light_power',
      'sensor.plugs_power',
      'sensor.oven_power',
    ]);
  });

  it('gives the same set for the same energy settings object', () => {
    const energy = parseEnergyPowerConfig(CIRCUIT_PREFS);
    expect(countedPowerSensorsOf(energy)).toBe(countedPowerSensorsOf(energy));
    expect(countedPowerSensorsOf(parseEnergyPowerConfig(CIRCUIT_PREFS))).not.toBe(countedPowerSensorsOf(energy));
  });
});

describe('splitUpstreamPower', () => {
  it('takes every reading off the sensor above it', () => {
    const shares = splitUpstreamPower(
      new Map([['sensor.general', 3200], ['sensor.light', 900], ['sensor.plugs', 1500]]),
      { 'sensor.light': 'sensor.general', 'sensor.plugs': 'sensor.general' }
    );
    expect(Object.fromEntries(shares)).toEqual({ 'sensor.general': 800, 'sensor.light': 900, 'sensor.plugs': 1500 });
  });

  it('follows a chain and skips sensors that are not counted', () => {
    const upstream = { 'sensor.c': 'sensor.p', 'sensor.p': 'sensor.g' };
    expect(Object.fromEntries(splitUpstreamPower(new Map([['sensor.g', 2000], ['sensor.p', 800], ['sensor.c', 300]]), upstream)))
      .toEqual({ 'sensor.g': 1200, 'sensor.p': 500, 'sensor.c': 300 });
    // Without the middle sensor the leaf is taken off the top one.
    expect(Object.fromEntries(splitUpstreamPower(new Map([['sensor.g', 2000], ['sensor.c', 300]]), upstream)))
      .toEqual({ 'sensor.g': 1700, 'sensor.c': 300 });
  });

  it('never gives a sensor less than 0 W', () => {
    const shares = splitUpstreamPower(new Map([['sensor.main', 500], ['sensor.sub', 650]]), { 'sensor.sub': 'sensor.main' });
    expect(Object.fromEntries(shares)).toEqual({ 'sensor.main': 0, 'sensor.sub': 650 });
  });

  it('stops on a loop instead of hanging', () => {
    const shares = splitUpstreamPower(new Map([['sensor.a', 100], ['sensor.b', 50]]), { 'sensor.a': 'sensor.b', 'sensor.b': 'sensor.a' });
    expect(Object.fromEntries(shares)).toEqual({ 'sensor.a': 50, 'sensor.b': 0 });
  });

  it('stops on a loop between sensors without a reading', () => {
    const shares = splitUpstreamPower(
      new Map([['sensor.c', 10]]),
      guardedLinks({ 'sensor.c': 'sensor.x', 'sensor.x': 'sensor.y', 'sensor.y': 'sensor.x' })
    );
    expect(Object.fromEntries(shares)).toEqual({ 'sensor.c': 10 });
  });

  it('keeps a negative reading that has nothing below it', () => {
    // The 0 W floor is only for sensors that had something taken off.
    expect(splitUpstreamPower(new Map([['sensor.export', -300]]), {}).get('sensor.export')).toBe(-300);
  });

  it('only follows own keys of the links', () => {
    const inherited = Object.create({ 'sensor.light': 'sensor.general' }) as Record<string, string>;
    const shares = splitUpstreamPower(new Map([['sensor.general', 3200], ['sensor.light', 900]]), inherited);
    expect(Object.fromEntries(shares)).toEqual({ 'sensor.general': 3200, 'sensor.light': 900 });
  });

  it('counts a share left over from rounding as 0 W', () => {
    // 1005 + 995 taken off 2000 is about 1e-13 in floating point.
    const shares = splitUpstreamPower(
      new Map([['sensor.general', 2000], ['sensor.light', 1.005 * 1000], ['sensor.plugs', 995]]),
      { 'sensor.light': 'sensor.general', 'sensor.plugs': 'sensor.general' }
    );
    expect(shares.get('sensor.general')).toBe(0);
    // A real reading below 0.5 W is kept when nothing was taken off it.
    expect(splitUpstreamPower(new Map([['sensor.standby', 0.3]]), {}).get('sensor.standby')).toBe(0.3);
  });
});

describe('buildHousePowerUsage with a device hierarchy', () => {
  const baseConfig = (overrides: Partial<DwainsDashboardConfig> = {}) => ({
    areas: [
      { area_id: 'meter_cupboard', name: 'Meter cupboard' },
      { area_id: 'living', name: 'Living room' },
    ],
    devices: [{ device_id: 'dev-monitor', name: 'Panel monitor', area_id: 'meter_cupboard' }],
    entities: [
      { entity_id: 'sensor.general_power', device_id: 'dev-monitor' },
      { entity_id: 'sensor.light_power', device_id: 'dev-monitor' },
      { entity_id: 'sensor.plugs_power', device_id: 'dev-monitor' },
      { entity_id: 'sensor.fridge_power', area_id: 'living' },
    ],
    settings: {},
    ...overrides,
  }) as DwainsDashboardConfig;

  const states = (general: string | number = 3200) => [
    watt('sensor.general_power', general, 'W', { friendly_name: 'General', state_class: 'measurement' }),
    watt('sensor.light_power', 900, 'W', { friendly_name: 'Light' }),
    watt('sensor.plugs_power', 1.5, 'kW', { friendly_name: 'Plugs' }),
  ];

  it('counts the main line and its circuits once (issue #29)', () => {
    const summary = buildHousePowerUsage(hassWithStates(states()), baseConfig(), parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.basis).toBe('rooms');
    expect(summary.totalWatts).toBe(3200);
    expect(summary.sensorCount).toBe(3);
    expect(summary.outsideAreaEntities).toEqual([]);
    const room = summary.areas.find((area) => area.areaId === 'meter_cupboard')!;
    expect(room.totalWatts).toBe(3200);
    expect(room.entities.map((entity) => [entity.entityId, entity.watts, entity.measuredWatts])).toEqual([
      ['sensor.plugs_power', 1500, 1500],
      ['sensor.light_power', 900, 900],
      ['sensor.general_power', 800, 3200],
    ]);
    expect(room.entities.find((entity) => entity.entityId === 'sensor.general_power')?.formatted).toBe(`800${NARROW_NBSP}W`);
  });

  it('adds everything up without the hierarchy, as before', () => {
    const summary = buildHousePowerUsage(hassWithStates(states()), baseConfig(), null);
    expect(summary.totalWatts).toBe(3200 + 900 + 1500);
  });

  it('splits the circuits over their own rooms', () => {
    const config = baseConfig({
      entities: [
        { entity_id: 'sensor.general_power', device_id: 'dev-monitor' },
        { entity_id: 'sensor.light_power', device_id: 'dev-monitor', area_id: 'living' },
        { entity_id: 'sensor.plugs_power', device_id: 'dev-monitor' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.areas.map((area) => [area.areaId, area.totalWatts])).toEqual([['meter_cupboard', 2300], ['living', 900]]);
    expect(summary.totalWatts).toBe(3200);
  });

  it('keeps the grid meter total and limits the rooms to the energy settings devices', () => {
    const prefs = { ...CIRCUIT_PREFS, energy_sources: P1_PREFS.energy_sources };
    const summary = buildHousePowerUsage(
      hassWithStates([
        ...states(),
        watt('sensor.p1_power_consumed', 3.4, 'kW'),
        watt('sensor.p1_power_produced', 0),
        watt('sensor.fridge_power', 120, 'W', { friendly_name: 'Fridge' }),
      ]),
      baseConfig(),
      parseEnergyPowerConfig(prefs)
    );
    expect(summary.basis).toBe('energy');
    expect(summary.energySettingsDevicesOnly).toBe(true);
    expect(summary.totalWatts).toBe(3400);
    expect(summary.sensorCount).toBe(2);
    expect(summary.roomTotalWatts).toBe(3200);
    expect(summary.roomSensorCount).toBe(3);
    expect(summary.areas.map((area) => area.areaId)).toEqual(['meter_cupboard']);
  });

  it('still counts the untracked part of a main line without an area', () => {
    const config = baseConfig({
      devices: [],
      entities: [
        { entity_id: 'sensor.general_power' },
        { entity_id: 'sensor.light_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.basis).toBe('rooms');
    expect(summary.roomTotalWatts).toBe(2400);
    expect(summary.totalWatts).toBe(3200);
    expect(summary.sensorCount).toBe(3);
    expect(summary.outsideAreaEntities.map((entity) => [entity.entityId, entity.watts, entity.measuredWatts, entity.areaId]))
      .toEqual([['sensor.general_power', 800, 3200, '']]);
  });

  it('leaves out a hidden main line without an area', () => {
    const config = baseConfig({
      devices: [],
      entities: [
        { entity_id: 'sensor.general_power' },
        { entity_id: 'sensor.light_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const hass = hassWithStates(states(), {
      entities: { 'sensor.general_power': { entity_id: 'sensor.general_power', hidden_by: 'user' } },
    });
    const summary = buildHousePowerUsage(hass, config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.outsideAreaEntities).toEqual([]);
    expect(summary.totalWatts).toBe(2400);
  });

  it('counts a main line and its circuits in a hidden room like ones without an area', () => {
    const config = baseConfig({ areas_display: { hidden: ['meter_cupboard'] } } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.areas).toEqual([]);
    expect(summary.outsideAreaEntities.map((entity) => [entity.entityId, entity.watts])).toEqual([
      ['sensor.general_power', 800],
      ['sensor.light_power', 900],
      ['sensor.plugs_power', 1500],
    ]);
    expect(summary.sensorCount).toBe(3);
    expect(summary.totalWatts).toBe(3200);
  });

  it('counts a main line in an area the dashboard does not know like one without an area', () => {
    const config = baseConfig({
      devices: [],
      entities: [
        { entity_id: 'sensor.general_power', area_id: 'ghost' },
        { entity_id: 'sensor.light_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.outsideAreaEntities.map((entity) => [entity.entityId, entity.watts])).toEqual([['sensor.general_power', 800]]);
    expect(summary.totalWatts).toBe(3200);
  });

  it('leaves out a main line hidden in the groups of a room that is shown', () => {
    const config = baseConfig({
      areas_options: { meter_cupboard: { groups_options: { sensor: { hidden: ['sensor.general_power'] } } } },
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.outsideAreaEntities).toEqual([]);
    expect(summary.totalWatts).toBe(2400);
  });

  it('leaves out a main line without an area that belongs to a hidden device', () => {
    const config = baseConfig({
      devices: [{ device_id: 'dev-main', name: 'Main meter' }],
      entities: [
        { entity_id: 'sensor.general_power', device_id: 'dev-main' },
        { entity_id: 'sensor.light_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
      device_admission: { hidden_devices: ['dev-main'] },
    } as unknown as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.outsideAreaEntities).toEqual([]);
    expect(summary.totalWatts).toBe(2400);
  });

  it('counts a circuit without an area for the whole house', () => {
    const config = baseConfig({
      entities: [
        { entity_id: 'sensor.general_power', device_id: 'dev-monitor' },
        { entity_id: 'sensor.light_power' },
        { entity_id: 'sensor.plugs_power', device_id: 'dev-monitor' },
      ],
      devices: [{ device_id: 'dev-monitor', name: 'Panel monitor', area_id: 'meter_cupboard' }],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(hassWithStates(states()), config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    // Like Home Assistant: the light circuit counts on its own and is taken off General.
    expect(summary.outsideAreaEntities.map((entity) => [entity.entityId, entity.watts])).toEqual([['sensor.light_power', 900]]);
    expect(summary.areas.flatMap((area) => area.entities.map((entity) => [entity.entityId, entity.watts]))).toEqual([
      ['sensor.plugs_power', 1500],
      ['sensor.general_power', 800],
    ]);
    expect(summary.roomTotalWatts).toBe(2300);
    expect(summary.totalWatts).toBe(3200);
    expect(summary.sensorCount).toBe(3);
  });

  it('leaves out a hidden circuit without an area, so it stays part of the main line', () => {
    const config = baseConfig({
      entities: [
        { entity_id: 'sensor.general_power', device_id: 'dev-monitor' },
        { entity_id: 'sensor.light_power' },
        { entity_id: 'sensor.plugs_power', device_id: 'dev-monitor' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const hass = hassWithStates(states(), {
      entities: { 'sensor.light_power': { entity_id: 'sensor.light_power', hidden_by: 'user' } },
    });
    const summary = buildHousePowerUsage(hass, config, parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.outsideAreaEntities).toEqual([]);
    expect(summary.areas.flatMap((area) => area.entities.map((entity) => [entity.entityId, entity.watts]))).toEqual([
      ['sensor.general_power', 1700],
      ['sensor.plugs_power', 1500],
    ]);
    expect(summary.totalWatts).toBe(3200);
  });

  it('leaves out power sensors that are not in the energy settings (issue #29)', () => {
    const config = baseConfig({
      entities: [
        ...baseConfig().entities!,
        { entity_id: 'sensor.monitor_spare_power', device_id: 'dev-monitor' },
        { entity_id: 'sensor.tv_power', area_id: 'living' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(
      hassWithStates([
        ...states(),
        watt('sensor.fridge_power', 120, 'W', { friendly_name: 'Fridge' }),
        watt('sensor.tv_power', 89, 'W', { friendly_name: 'TV' }),
        watt('sensor.monitor_spare_power', 15),
      ]),
      config,
      parseEnergyPowerConfig(CIRCUIT_PREFS)
    );
    // Home Assistant shows 3200 W: the fridge and the TV are fed by General as well.
    expect(summary.energySettingsDevicesOnly).toBe(true);
    expect(summary.basis).toBe('rooms');
    expect(summary.totalWatts).toBe(3200);
    expect(summary.sensorCount).toBe(3);
    expect(summary.areas.map((area) => [area.areaId, area.totalWatts])).toEqual([['meter_cupboard', 3200]]);
    expect(summary.areas[0]!.entities.map((entity) => entity.entityId)).not.toContain('sensor.monitor_spare_power');
  });

  it('keeps counting every power sensor when the energy settings have no hierarchy', () => {
    // Grid energy without a power sensor keeps the settings without making the total grid based.
    const prefs = {
      energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.import' }],
      device_consumption: CIRCUIT_PREFS.device_consumption.map(({ included_in_stat: _upstream, ...device }) => device),
    };
    const energy = parseEnergyPowerConfig(prefs);
    expect(energy?.deviceRateEntityIds).toEqual(['sensor.general_power', 'sensor.light_power', 'sensor.plugs_power']);
    const summary = buildHousePowerUsage(
      hassWithStates([...states(), watt('sensor.fridge_power', 120, 'W', { friendly_name: 'Fridge' })]),
      baseConfig(),
      energy
    );
    expect(summary.energySettingsDevicesOnly).toBe(false);
    expect(summary.basis).toBe('rooms');
    expect(summary.totalWatts).toBe(3200 + 900 + 1500 + 120);
    expect(summary.sensorCount).toBe(4);
  });

  it('keeps a main line that is the grid power sensor as well as a device', () => {
    const prefs = {
      ...CIRCUIT_PREFS,
      energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.general_energy', power_config: { stat_rate: 'sensor.general_power' } }],
    };
    const summary = buildHousePowerUsage(
      hassWithStates([...states(), watt('sensor.fridge_power', 120, 'W', { friendly_name: 'Fridge' })]),
      baseConfig(),
      parseEnergyPowerConfig(prefs)
    );
    expect(summary.basis).toBe('energy');
    expect(summary.sources.map((source) => source.entityId)).toEqual(['sensor.general_power']);
    expect(summary.totalWatts).toBe(3200);
    // The device rates are kept although their device is the grid meter.
    expect(summary.areas.flatMap((area) => area.entities.map((entity) => [entity.entityId, entity.watts]))).toEqual([
      ['sensor.plugs_power', 1500],
      ['sensor.light_power', 900],
      ['sensor.general_power', 800],
    ]);
    expect(summary.roomTotalWatts).toBe(3200);
  });

  it('keeps the reading of the main line when a circuit is unavailable', () => {
    const list = states();
    list[1] = entityState('sensor.light_power', 'unavailable', { unit_of_measurement: 'W' });
    const summary = buildHousePowerUsage(hassWithStates(list), baseConfig(), parseEnergyPowerConfig(CIRCUIT_PREFS));
    const general = summary.areas[0]!.entities.find((entity) => entity.entityId === 'sensor.general_power')!;
    expect(general.watts).toBe(1700);
    expect(summary.totalWatts).toBe(3200);
  });

  it('counts the circuits in full when they read more than the main line', () => {
    const summary = buildHousePowerUsage(
      hassWithStates([watt('sensor.general_power', 3000), watt('sensor.light_power', 1800), watt('sensor.plugs_power', 1500)]),
      baseConfig(),
      parseEnergyPowerConfig(CIRCUIT_PREFS)
    );
    // Deliberate: readings that arrive at different moments never make the house use less.
    expect(summary.totalWatts).toBe(3300);
  });

  it('follows three levels and mixed units', () => {
    const prefs = {
      energy_sources: [],
      device_consumption: [
        ...CIRCUIT_PREFS.device_consumption,
        { stat_consumption: 'sensor.desk_energy', stat_rate: 'sensor.desk_power', included_in_stat: 'sensor.plugs_energy' },
      ],
    };
    const config = baseConfig({
      entities: [...baseConfig().entities!, { entity_id: 'sensor.desk_power', device_id: 'dev-monitor' }],
    } as Partial<DwainsDashboardConfig>);
    const summary = buildHousePowerUsage(
      hassWithStates([
        watt('sensor.general_power', 3.2, 'kW'),
        watt('sensor.light_power', 900),
        watt('sensor.plugs_power', 1.5, 'kW'),
        watt('sensor.desk_power', 200),
      ]),
      config,
      parseEnergyPowerConfig(prefs)
    );
    const shares = Object.fromEntries(summary.areas[0]!.entities.map((entity) => [entity.entityId, entity.watts]));
    expect(shares).toEqual({
      'sensor.general_power': 800,
      'sensor.light_power': 900,
      'sensor.plugs_power': 1300,
      'sensor.desk_power': 200,
    });
    expect(summary.totalWatts).toBe(3200);
  });

  it('lists a main line without an area but keeps the grid total', () => {
    const config = baseConfig({
      devices: [],
      entities: [
        { entity_id: 'sensor.general_power' },
        { entity_id: 'sensor.light_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
    } as Partial<DwainsDashboardConfig>);
    const prefs = { ...CIRCUIT_PREFS, energy_sources: P1_PREFS.energy_sources };
    const summary = buildHousePowerUsage(
      hassWithStates([...states(), watt('sensor.p1_power_consumed', 3.4, 'kW'), watt('sensor.p1_power_produced', 0)]),
      config,
      parseEnergyPowerConfig(prefs)
    );
    expect(summary.basis).toBe('energy');
    expect(summary.totalWatts).toBe(3400);
    expect(summary.outsideAreaEntities.map((entity) => entity.entityId)).toEqual(['sensor.general_power']);
  });

  it('drops a room whose only sensor is a main line with nothing left', () => {
    const config = baseConfig({
      entities: [
        { entity_id: 'sensor.general_power', area_id: 'meter_cupboard' },
        { entity_id: 'sensor.light_power', area_id: 'living' },
        { entity_id: 'sensor.plugs_power', area_id: 'living' },
      ],
      devices: [],
    } as Partial<DwainsDashboardConfig>);
    // 1.005 kW is 1004.9999999999999 W, so General keeps about 1e-13 W before rounding.
    const summary = buildHousePowerUsage(
      hassWithStates([watt('sensor.general_power', 2000), watt('sensor.light_power', 1.005, 'kW'), watt('sensor.plugs_power', 995)]),
      config,
      parseEnergyPowerConfig(CIRCUIT_PREFS)
    );
    expect(summary.areas.map((area) => area.areaId)).toEqual(['living']);
    expect(summary.totalWatts).toBeCloseTo(2000, 6);
  });

  it('counts the circuits in full when the main line is unavailable', () => {
    const summary = buildHousePowerUsage(hassWithStates(states('unavailable')), baseConfig(), parseEnergyPowerConfig(CIRCUIT_PREFS));
    expect(summary.totalWatts).toBe(2400);
    expect(summary.sensorCount).toBe(2);
  });

  it('recomputes once the energy settings with the hierarchy are loaded', async () => {
    resetEnergyPowerConfigCache();
    const memo = createHousePowerUsageMemo();
    const config = baseConfig();
    const plain = hassWithStates(states());
    // Before the energy settings are loaded the readings are added up.
    expect(memo(plain, config).totalWatts).toBe(5600);

    const withPrefs = { ...plain, callWS: vi.fn(async () => CIRCUIT_PREFS) } as unknown as HomeAssistant;
    await loadEnergyPowerConfig(withPrefs);
    expect(memo(withPrefs, config).totalWatts).toBe(3200);
    resetEnergyPowerConfigCache();
  });
});
