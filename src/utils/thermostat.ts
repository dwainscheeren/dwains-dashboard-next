import type { HassEntity } from '../types/home-assistant';

// Pure helpers for the thermostat in the room header: which climate entity it
// controls, which target it can change and how a step up or down is rounded.

/**
 * How the target temperature of a thermostat can be shown:
 * - `single`: one target temperature that the header can raise and lower
 * - `range`: a low and high target (heat_cool), shown without step buttons
 * - `none`: no target (for example while the thermostat is off)
 */
export type ThermostatTargetMode = 'single' | 'range' | 'none';

export interface ThermostatLimits {
  step: number;
  min: number;
  max: number;
}

export interface ThermostatModel extends ThermostatLimits {
  mode: ThermostatTargetMode;
  current?: number;
  target?: number;
  targetLow?: number;
  targetHigh?: number;
  unit: string;
}

// Home Assistant's climate defaults, used when an entity leaves them out.
const DEFAULT_LIMITS_CELSIUS = { min: 7, max: 35 };
const DEFAULT_LIMITS_FAHRENHEIT = { min: 45, max: 95 };
const UNAVAILABLE_STATES: ReadonlySet<string> = new Set(['unavailable', 'unknown']);
// Tolerance for floating point noise, for example 20.1 / 0.1 = 200.99999999999997.
const EPSILON = 1e-9;

export function toFiniteNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') return undefined;
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function isFahrenheit(unit: string | null | undefined): boolean {
  return /f$/i.test(String(unit || '').trim());
}

/** The entity's `target_temp_step`, or 1 for °F and 0.5 for °C. */
export function thermostatStep(attributes: Record<string, any> | undefined, unit: string | null | undefined): number {
  const step = toFiniteNumber(attributes?.target_temp_step);
  if (step !== undefined && step > 0) return step;
  return isFahrenheit(unit) ? 1 : 0.5;
}

/** Decimals needed to show values of this step: 1 for 0.5, 0 for 1, 2 for 0.25. */
export function stepDecimals(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 1;
  for (let decimals = 0; decimals < 3; decimals++) {
    const scaled = step * 10 ** decimals;
    if (Math.abs(scaled - Math.round(scaled)) < EPSILON * 10 ** decimals) return decimals;
  }
  return 3;
}

export function clampTemperature(value: number, min: number, max: number): number {
  if (!(min <= max)) return value;
  return Math.min(max, Math.max(min, value));
}

/** Round to the nearest multiple of the step, without floating point noise. */
export function roundToStep(value: number, step: number): number {
  if (!(step > 0)) return value;
  const rounded = Math.round(value / step + EPSILON) * step;
  return Number(rounded.toFixed(stepDecimals(step)));
}

/**
 * The target after one press of plus (1) or minus (-1): the next multiple of
 * the step in that direction, kept between min and max. A target between two
 * steps, like 20.3 with step 0.5, moves to 20.5 or 20.0.
 */
export function stepTemperature(current: number, direction: 1 | -1, limits: ThermostatLimits): number {
  const { step, min, max } = limits;
  if (!(step > 0)) return clampTemperature(current, min, max);
  const units = current / step;
  const base = direction > 0 ? Math.floor(units + EPSILON) : Math.ceil(units - EPSILON);
  const next = Number(((base + direction) * step).toFixed(stepDecimals(step)));
  return clampTemperature(next, min, max);
}

/** Whether plus or minus would change the target. */
export function canStepTemperature(current: number, direction: 1 | -1, limits: ThermostatLimits): boolean {
  return stepTemperature(current, direction, limits) !== current;
}

/**
 * What the header thermostat can show for a climate entity, or undefined when
 * the entity is missing, unavailable or unknown.
 */
export function getThermostatModel(state: HassEntity | undefined, unit: string): ThermostatModel | undefined {
  if (!state || UNAVAILABLE_STATES.has(String(state.state))) return undefined;

  const attributes = state.attributes || {};
  const defaults = isFahrenheit(unit) ? DEFAULT_LIMITS_FAHRENHEIT : DEFAULT_LIMITS_CELSIUS;
  let min = toFiniteNumber(attributes.min_temp) ?? defaults.min;
  let max = toFiniteNumber(attributes.max_temp) ?? defaults.max;
  if (min > max) [min, max] = [max, min];

  const target = toFiniteNumber(attributes.temperature);
  const targetLow = toFiniteNumber(attributes.target_temp_low);
  const targetHigh = toFiniteNumber(attributes.target_temp_high);
  const hasRange = targetLow !== undefined && targetHigh !== undefined;

  let mode: ThermostatTargetMode = 'none';
  if (state.state !== 'off') {
    if (hasRange && (state.state === 'heat_cool' || target === undefined)) mode = 'range';
    else if (target !== undefined) mode = 'single';
  }

  return {
    mode,
    current: toFiniteNumber(attributes.current_temperature),
    target,
    targetLow,
    targetHigh,
    min,
    max,
    step: thermostatStep(attributes, unit),
    unit,
  };
}

/**
 * The climate entity the room header controls: the only climate entity among
 * the visible entities of the room, as long as it is available. Rooms with
 * several climate entities keep the climate button that opens a list.
 */
export function pickAreaThermostatEntityId(
  entityIds: readonly string[],
  states: Record<string, HassEntity | undefined>
): string | undefined {
  let found: string | undefined;
  for (const entityId of entityIds) {
    if (!entityId.startsWith('climate.')) continue;
    if (found) return undefined;
    found = entityId;
  }
  if (!found) return undefined;
  const state = states[found];
  return state && !UNAVAILABLE_STATES.has(String(state.state)) ? found : undefined;
}

/**
 * The colour group of the mode chip: what the thermostat is doing (hvac_action)
 * or, without an action, the mode it is in.
 */
export type ThermostatActivity = 'heat' | 'cool' | 'dry' | 'fan' | 'auto' | 'idle' | 'off';

export function getThermostatActivity(state: HassEntity | undefined): ThermostatActivity {
  const action = String(state?.attributes?.hvac_action ?? '').toLowerCase();
  const mode = String(state?.state ?? '').toLowerCase();
  const value = action || mode;
  switch (value) {
    case 'heating':
    case 'preheating':
    case 'defrosting':
    case 'heat':
      return 'heat';
    case 'cooling':
    case 'cool':
      return 'cool';
    case 'drying':
    case 'dry':
      return 'dry';
    case 'fan':
    case 'fan_only':
      return 'fan';
    case 'heat_cool':
    case 'auto':
      return 'auto';
    case 'off':
      return 'off';
    default:
      return 'idle';
  }
}

const numberFormats = new Map<string, Intl.NumberFormat>();

/** A temperature with a fixed number of decimals in the user's language. */
export function formatTemperatureNumber(value: number, decimals: number, locale?: string): string {
  const key = `${locale || ''}|${decimals}`;
  let format = numberFormats.get(key);
  if (!format) {
    try {
      format = new Intl.NumberFormat(locale || undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      format = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    numberFormats.set(key, format);
  }
  return format.format(value);
}
