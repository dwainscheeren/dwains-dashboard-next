import type { HomeAssistant } from '../types/home-assistant';

// Reads the power sensors from the Home Assistant energy settings
// (`energy/get_prefs`). The house power total is based on these sensors
// when they are configured, so a grid meter (P1) plus smart plugs or a solar
// inverter are not added up twice.
//
// Structure used (Home Assistant 2026.x, storage minor version 3):
//   energy_sources: [
//     { type: 'grid', stat_energy_from, stat_energy_to,
//       stat_rate?,                       // net power, positive = import
//       power_config?: { stat_rate? | stat_rate_inverted? | stat_rate_from? + stat_rate_to? } },
//     { type: 'solar', stat_energy_from, stat_rate? },   // production
//     { type: 'battery', stat_energy_from, stat_energy_to,
//       stat_rate?, power_config? },       // positive = discharge
//     { type: 'gas' | 'water', ... }      // ignored
//   ],
//   device_consumption: [{ stat_consumption, stat_rate? }]
// Older versions stored the grid as `flow_from: [{ stat_energy_from }]`,
// `flow_to: [{ stat_energy_to }]` and `power: [{ stat_rate, power_config? }]`;
// both shapes are read. Anything unexpected is skipped.

/** One sensor of a power sum. `sign` -1 subtracts the sensor (export, charging). */
export interface PowerTerm {
  entityId: string;
  sign: 1 | -1;
}

export interface EnergyPowerConfig {
  /** Net grid power, positive while importing. One entry per term of every grid connection. */
  grid: PowerTerm[];
  /** Solar production. */
  solar: PowerTerm[];
  /** Net battery power, positive while discharging. */
  battery: PowerTerm[];
  /** Grid, solar and battery sensors (energy and power). Their devices are meters, not consumers. */
  sourceEntityIds: string[];
  /** Power sensors of individual devices in the energy settings. These are always consumers. */
  deviceRateEntityIds: string[];
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Terms of one power measurement. The original sensors in `power_config` are
 * preferred over the `stat_rate` sensor Home Assistant generates from them,
 * because they always have a state and have a readable name.
 */
export function parsePowerTerms(powerConfig: unknown, statRate?: unknown): PowerTerm[] {
  const config = asRecord(powerConfig);
  const from = asString(config?.stat_rate_from);
  const to = asString(config?.stat_rate_to);
  if (from || to) {
    const terms: PowerTerm[] = [];
    if (from) terms.push({ entityId: from, sign: 1 });
    if (to) terms.push({ entityId: to, sign: -1 });
    return terms;
  }
  const inverted = asString(config?.stat_rate_inverted);
  if (inverted) return [{ entityId: inverted, sign: -1 }];
  const standard = asString(config?.stat_rate) || asString(statRate);
  return standard ? [{ entityId: standard, sign: 1 }] : [];
}

function termSensorIds(powerConfig: unknown, statRate: unknown): string[] {
  const config = asRecord(powerConfig);
  return [
    config?.stat_rate,
    config?.stat_rate_inverted,
    config?.stat_rate_from,
    config?.stat_rate_to,
    statRate,
  ].map(asString).filter((id): id is string => Boolean(id));
}

/** Parses `energy/get_prefs`. Returns null when no grid, solar or battery source is configured. */
export function parseEnergyPowerConfig(prefs: unknown): EnergyPowerConfig | null {
  const root = asRecord(prefs);
  if (!root) return null;

  const result: EnergyPowerConfig = {
    grid: [],
    solar: [],
    battery: [],
    sourceEntityIds: [],
    deviceRateEntityIds: [],
  };
  const sourceIds = new Set<string>();
  const addSourceIds = (...ids: unknown[]) => {
    ids.forEach((id) => {
      const entityId = asString(id);
      if (entityId) sourceIds.add(entityId);
    });
  };
  let hasSource = false;

  for (const item of asArray(root.energy_sources)) {
    const source = asRecord(item);
    if (!source) continue;

    if (source.type === 'grid') {
      hasSource = true;
      result.grid.push(...parsePowerTerms(source.power_config, source.stat_rate));
      addSourceIds(source.stat_energy_from, source.stat_energy_to, ...termSensorIds(source.power_config, source.stat_rate));
      // Legacy grid format.
      asArray(source.flow_from).forEach((flow) => addSourceIds(asRecord(flow)?.stat_energy_from));
      asArray(source.flow_to).forEach((flow) => addSourceIds(asRecord(flow)?.stat_energy_to));
      asArray(source.power).forEach((entry) => {
        const power = asRecord(entry);
        if (!power) return;
        result.grid.push(...parsePowerTerms(power.power_config, power.stat_rate));
        addSourceIds(...termSensorIds(power.power_config, power.stat_rate));
      });
    } else if (source.type === 'solar') {
      hasSource = true;
      const statRate = asString(source.stat_rate);
      if (statRate) result.solar.push({ entityId: statRate, sign: 1 });
      addSourceIds(source.stat_energy_from, statRate);
    } else if (source.type === 'battery') {
      hasSource = true;
      result.battery.push(...parsePowerTerms(source.power_config, source.stat_rate));
      addSourceIds(source.stat_energy_from, source.stat_energy_to, ...termSensorIds(source.power_config, source.stat_rate));
    }
  }

  for (const item of asArray(root.device_consumption)) {
    const statRate = asString(asRecord(item)?.stat_rate);
    if (statRate) result.deviceRateEntityIds.push(statRate);
  }

  if (!hasSource) return null;
  result.sourceEntityIds = [...sourceIds];
  return result;
}

// ---- Cache -----------------------------------------------------------------

// The energy settings rarely change, so they are fetched once and refreshed
// in the background after a while. Failures (energy not set up, no access)
// are cached as "no energy settings" so they are not retried on every render.
const REFRESH_AFTER_MS = 10 * 60 * 1000;

interface EnergyPrefsCache {
  value: EnergyPowerConfig | null;
  loadedAt: number;
}

let cache: EnergyPrefsCache | undefined;
let pending: Promise<EnergyPowerConfig | null> | undefined;
const listeners = new Set<() => void>();

function sameConfig(left: EnergyPowerConfig | null | undefined, right: EnergyPowerConfig | null): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right);
}

/** Fetches the energy settings (at most one request at a time) and updates the cache. */
export function loadEnergyPowerConfig(hass: HomeAssistant | undefined): Promise<EnergyPowerConfig | null> {
  if (pending) return pending;
  if (!hass || typeof hass.callWS !== 'function') return Promise.resolve(cache?.value ?? null);

  pending = Promise.resolve()
    .then(() => hass.callWS<unknown>({ type: 'energy/get_prefs' }))
    .then((prefs) => parseEnergyPowerConfig(prefs))
    .catch(() => null)
    .then((value) => {
      const changed = !cache || !sameConfig(cache.value, value);
      cache = { value, loadedAt: Date.now() };
      pending = undefined;
      if (changed) listeners.forEach((listener) => listener());
      return value;
    });
  return pending;
}

/**
 * The cached energy power config: `undefined` while it was never loaded,
 * `null` when there is none. Starts a (background) fetch when the cache is
 * missing or old; subscribers are told when the result changes.
 */
export function getEnergyPowerConfig(hass: HomeAssistant | undefined): EnergyPowerConfig | null | undefined {
  if (!cache || Date.now() - cache.loadedAt > REFRESH_AFTER_MS) {
    void loadEnergyPowerConfig(hass);
  }
  return cache?.value;
}

/** Calls `listener` whenever the cached energy power config changes. Returns an unsubscribe function. */
export function subscribeEnergyPowerConfig(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** For tests. */
export function resetEnergyPowerConfigCache(): void {
  cache = undefined;
  pending = undefined;
  listeners.clear();
}
