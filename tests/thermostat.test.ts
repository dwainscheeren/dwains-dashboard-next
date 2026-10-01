import { describe, expect, it } from 'vitest';
import {
  canStepTemperature,
  clampTemperature,
  formatTemperatureNumber,
  getThermostatActivity,
  getThermostatModel,
  pickAreaThermostatEntityId,
  roundToStep,
  stepDecimals,
  stepTemperature,
  thermostatStep,
} from '../src/utils/thermostat';
import { entityState } from './helpers';

const limits = { step: 0.5, min: 7, max: 35 };

describe('thermostatStep', () => {
  it('uses target_temp_step when it is a positive number', () => {
    expect(thermostatStep({ target_temp_step: 0.1 }, '°C')).toBe(0.1);
    expect(thermostatStep({ target_temp_step: '1' }, '°C')).toBe(1);
  });

  it('falls back to 0.5 for Celsius and 1 for Fahrenheit', () => {
    expect(thermostatStep({}, '°C')).toBe(0.5);
    expect(thermostatStep({ target_temp_step: 0 }, '°C')).toBe(0.5);
    expect(thermostatStep({ target_temp_step: 'abc' }, '°C')).toBe(0.5);
    expect(thermostatStep(undefined, '°F')).toBe(1);
    expect(thermostatStep({}, ' °f ')).toBe(1);
  });
});

describe('stepDecimals', () => {
  it('returns the decimals needed to show a step', () => {
    expect(stepDecimals(1)).toBe(0);
    expect(stepDecimals(0.5)).toBe(1);
    expect(stepDecimals(0.1)).toBe(1);
    expect(stepDecimals(0.25)).toBe(2);
    expect(stepDecimals(0.05)).toBe(2);
    expect(stepDecimals(0)).toBe(1);
  });
});

describe('clampTemperature and roundToStep', () => {
  it('keeps values between min and max', () => {
    expect(clampTemperature(5, 7, 35)).toBe(7);
    expect(clampTemperature(40, 7, 35)).toBe(35);
    expect(clampTemperature(21, 7, 35)).toBe(21);
    // Broken limits leave the value alone.
    expect(clampTemperature(21, 30, 10)).toBe(21);
  });

  it('rounds to the step without floating point noise', () => {
    expect(roundToStep(20.3, 0.5)).toBe(20.5);
    expect(roundToStep(20.2, 0.5)).toBe(20);
    expect(roundToStep(0.1 + 0.2, 0.1)).toBe(0.3);
    expect(roundToStep(70.4, 1)).toBe(70);
  });
});

describe('stepTemperature', () => {
  it('moves one step up or down from a value on the step grid', () => {
    expect(stepTemperature(21, 1, limits)).toBe(21.5);
    expect(stepTemperature(21, -1, limits)).toBe(20.5);
    expect(stepTemperature(70, 1, { step: 1, min: 45, max: 95 })).toBe(71);
  });

  it('moves a value between two steps to the next step in that direction', () => {
    expect(stepTemperature(20.3, 1, limits)).toBe(20.5);
    expect(stepTemperature(20.3, -1, limits)).toBe(20);
  });

  it('does not drift with small steps', () => {
    let value = 20;
    for (let i = 0; i < 7; i++) value = stepTemperature(value, 1, { step: 0.1, min: 5, max: 30 });
    expect(value).toBe(20.7);
    expect(stepTemperature(20.1, -1, { step: 0.1, min: 5, max: 30 })).toBe(20);
  });

  it('stays within min and max', () => {
    expect(stepTemperature(35, 1, limits)).toBe(35);
    expect(stepTemperature(7, -1, limits)).toBe(7);
    expect(stepTemperature(34.8, 1, limits)).toBe(35);
    expect(stepTemperature(40, -1, limits)).toBe(35);
  });

  it('reports whether a step changes the target', () => {
    expect(canStepTemperature(35, 1, limits)).toBe(false);
    expect(canStepTemperature(35, -1, limits)).toBe(true);
    expect(canStepTemperature(7, -1, limits)).toBe(false);
  });
});

describe('getThermostatModel', () => {
  it('returns nothing for missing, unavailable and unknown entities', () => {
    expect(getThermostatModel(undefined, '°C')).toBeUndefined();
    expect(getThermostatModel(entityState('climate.a', 'unavailable'), '°C')).toBeUndefined();
    expect(getThermostatModel(entityState('climate.a', 'unknown'), '°C')).toBeUndefined();
  });

  it('describes a thermostat with one target temperature', () => {
    const model = getThermostatModel(entityState('climate.a', 'heat', {
      current_temperature: 19.6,
      temperature: 21,
      min_temp: 5,
      max_temp: 30,
      target_temp_step: 0.5,
    }), '°C');
    expect(model).toMatchObject({ mode: 'single', current: 19.6, target: 21, min: 5, max: 30, step: 0.5, unit: '°C' });
  });

  it('uses a range for heat_cool with a low and high target', () => {
    const model = getThermostatModel(entityState('climate.a', 'heat_cool', {
      temperature: 21,
      target_temp_low: 19,
      target_temp_high: 24,
    }), '°C');
    expect(model).toMatchObject({ mode: 'range', targetLow: 19, targetHigh: 24 });
  });

  it('uses a range when there is no single target', () => {
    const model = getThermostatModel(entityState('climate.a', 'auto', {
      temperature: null,
      target_temp_low: 19,
      target_temp_high: 24,
    }), '°C');
    expect(model?.mode).toBe('range');
  });

  it('shows no target while off or without target attributes', () => {
    expect(getThermostatModel(entityState('climate.a', 'off', { temperature: 21 }), '°C')?.mode).toBe('none');
    expect(getThermostatModel(entityState('climate.a', 'fan_only', { current_temperature: 20 }), '°C')?.mode).toBe('none');
  });

  it('falls back to Home Assistant default limits per unit', () => {
    expect(getThermostatModel(entityState('climate.a', 'heat', { temperature: 21 }), '°C'))
      .toMatchObject({ min: 7, max: 35, step: 0.5 });
    expect(getThermostatModel(entityState('climate.a', 'heat', { temperature: 70 }), '°F'))
      .toMatchObject({ min: 45, max: 95, step: 1 });
  });
});

describe('pickAreaThermostatEntityId', () => {
  const states = {
    'climate.living': entityState('climate.living', 'heat'),
    'climate.office': entityState('climate.office', 'off'),
    'climate.broken': entityState('climate.broken', 'unavailable'),
    'light.lamp': entityState('light.lamp', 'on'),
  };

  it('picks the only climate entity of a room', () => {
    expect(pickAreaThermostatEntityId(['light.lamp', 'climate.living'], states)).toBe('climate.living');
    expect(pickAreaThermostatEntityId(['climate.office'], states)).toBe('climate.office');
  });

  it('picks nothing for rooms with no or several climate entities', () => {
    expect(pickAreaThermostatEntityId(['light.lamp'], states)).toBeUndefined();
    expect(pickAreaThermostatEntityId(['climate.living', 'climate.office'], states)).toBeUndefined();
  });

  it('picks nothing when the climate entity is unavailable or missing', () => {
    expect(pickAreaThermostatEntityId(['climate.broken'], states)).toBeUndefined();
    expect(pickAreaThermostatEntityId(['climate.missing'], states)).toBeUndefined();
  });
});

describe('getThermostatActivity', () => {
  it('prefers hvac_action over the mode', () => {
    expect(getThermostatActivity(entityState('climate.a', 'heat', { hvac_action: 'idle' }))).toBe('idle');
    expect(getThermostatActivity(entityState('climate.a', 'heat', { hvac_action: 'heating' }))).toBe('heat');
    expect(getThermostatActivity(entityState('climate.a', 'cool', { hvac_action: 'cooling' }))).toBe('cool');
  });

  it('falls back to the mode without an action', () => {
    expect(getThermostatActivity(entityState('climate.a', 'heat'))).toBe('heat');
    expect(getThermostatActivity(entityState('climate.a', 'heat_cool'))).toBe('auto');
    expect(getThermostatActivity(entityState('climate.a', 'off'))).toBe('off');
    expect(getThermostatActivity(entityState('climate.a', 'fan_only'))).toBe('fan');
  });
});

describe('formatTemperatureNumber', () => {
  it('uses a fixed number of decimals in the given language', () => {
    expect(formatTemperatureNumber(21, 1, 'en')).toBe('21.0');
    expect(formatTemperatureNumber(21.5, 1, 'nl')).toBe('21,5');
    expect(formatTemperatureNumber(70, 0, 'en')).toBe('70');
  });
});
