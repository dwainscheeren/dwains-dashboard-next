import { describe, expect, it } from 'vitest';
import {
  formatEntityStateWithUnit,
  formatValueWithUnit,
  NARROW_NBSP,
  normalizeUnitSpacing,
} from '../src/utils/unit-format';
import { entityState, hassWithStates } from './helpers';

// Value and unit are joined by a narrow no-break space so they never wrap apart.
const u = (value: string, unit: string) => `${value}${NARROW_NBSP}${unit}`;

describe('formatValueWithUnit', () => {
  it('joins value and unit with a narrow no-break space', () => {
    expect(NARROW_NBSP).toBe('\u202F');
    expect(formatValueWithUnit(21.5, '°C')).toBe(u('21.5', '°C'));
    expect(formatValueWithUnit('1.2', ' kW ')).toBe(u('1.2', 'kW'));
    expect(formatValueWithUnit(0, '%')).toBe(u('0', '%'));
  });

  it('returns the bare value without a unit', () => {
    expect(formatValueWithUnit(42, '')).toBe('42');
    expect(formatValueWithUnit(42, null)).toBe('42');
    expect(formatValueWithUnit('on', undefined)).toBe('on');
  });
});

describe('normalizeUnitSpacing', () => {
  it('separates a unit that Home Assistant glued to the value', () => {
    expect(normalizeUnitSpacing('21.5°C', '°C')).toBe(u('21.5', '°C'));
    expect(normalizeUnitSpacing('45%', '%')).toBe(u('45', '%'));
  });

  it('replaces any existing spacing and keeps localized numbers', () => {
    expect(normalizeUnitSpacing('21,5 °C', '°C')).toBe(u('21,5', '°C'));
    expect(normalizeUnitSpacing('1.234   W', 'W')).toBe(u('1.234', 'W'));
    expect(normalizeUnitSpacing(u('7', 'kWh'), 'kWh')).toBe(u('7', 'kWh'));
  });

  it('leaves states that do not end with the unit alone', () => {
    expect(normalizeUnitSpacing('Unavailable', '°C')).toBe('Unavailable');
    expect(normalizeUnitSpacing('21.5', '')).toBe('21.5');
    expect(normalizeUnitSpacing('', 'W')).toBe('');
  });
});

describe('formatEntityStateWithUnit', () => {
  it('uses the Home Assistant formatter and normalizes the unit spacing', () => {
    const state = entityState('sensor.temp', '21.5', { unit_of_measurement: '°C' });
    const hass = hassWithStates([state], { formatEntityState: () => '21.5 °C' });
    expect(formatEntityStateWithUnit(hass, state)).toBe(u('21.5', '°C'));
  });

  it('falls back to the raw state when the formatter throws', () => {
    const state = entityState('sensor.temp', '21.5', { unit_of_measurement: '°C' });
    const hass = hassWithStates([state], {
      formatEntityState: () => {
        throw new Error('not ready');
      },
    });
    expect(formatEntityStateWithUnit(hass, state)).toBe('21.5');
  });
});
