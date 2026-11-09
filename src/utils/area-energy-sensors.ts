// Room pages can leave out the sensors that measure power or energy, such as
// the Powercalc sensors of every lamp (`hide_energy_sensors_on_area_pages`).
// Only the room pages change: the Energy page, the house power usage, the
// house total and the power badge of a room keep counting the power sensors
// among them.

import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig } from '../types/strategy';

/** Device classes of sensors that measure power or energy. */
const ENERGY_MONITORING_DEVICE_CLASSES: ReadonlySet<string> = new Set(['power', 'energy']);

/**
 * Units of power and energy (in lower case), for sensors that have no device
 * class. Milli and mega share a lower case spelling, which is fine here:
 * both are power or energy. Calories are left out: without a device class
 * they are usually fitness data, and with the `energy` class they count anyway.
 */
const ENERGY_MONITORING_UNITS: ReadonlySet<string> = new Set([
  'mw', 'w', 'kw', 'gw', 'tw', 'btu/h',
  'mwh', 'wh', 'kwh', 'gwh', 'twh',
  'j', 'kj', 'mj', 'gj',
]);

/**
 * True for a sensor that measures power or energy: the device class `power`
 * or `energy`, or without a device class a unit such as W or kWh. Sensors
 * with another device class (current, voltage, battery) are never counted.
 */
export function isEnergyMonitoringSensor(
  state: Pick<HassEntity, 'entity_id' | 'attributes'> | null | undefined
): boolean {
  if (!state || typeof state.entity_id !== 'string' || !state.entity_id.startsWith('sensor.')) return false;
  const deviceClass = String(state.attributes?.device_class ?? '').trim().toLowerCase();
  if (deviceClass) return ENERGY_MONITORING_DEVICE_CLASSES.has(deviceClass);
  return ENERGY_MONITORING_UNITS.has(String(state.attributes?.unit_of_measurement ?? '').trim().toLowerCase());
}

/**
 * True when the room page of `areaId` leaves power and energy sensors out:
 * the setting is on and the room has no exception.
 */
export function hidesEnergySensorsInArea(
  config: Pick<DwainsDashboardConfig, 'settings' | 'areas_options'> | null | undefined,
  areaId: string | null | undefined
): boolean {
  if (config?.settings?.hide_energy_sensors_on_area_pages !== true) return false;
  if (!areaId) return true;
  return config.areas_options?.[areaId]?.show_energy_sensors !== true;
}

/**
 * The entities a room page shows: `entities` without the power and energy
 * sensors when the room hides them. Returns `entities` itself when nothing
 * is left out. Entities without a state are kept; the room page decides
 * about those.
 */
export function areaPageEntities<T extends { entity_id: string }>(
  entities: T[],
  hass: Pick<HomeAssistant, 'states'> | null | undefined,
  config: Pick<DwainsDashboardConfig, 'settings' | 'areas_options'> | null | undefined,
  areaId: string | null | undefined
): T[] {
  if (!hidesEnergySensorsInArea(config, areaId)) return entities;
  const next = entities.filter((entity) => !isEnergyMonitoringSensor(hass?.states?.[entity.entity_id]));
  return next.length === entities.length ? entities : next;
}

/**
 * The config with the setting turned on or off. Off leaves the key out of the
 * stored config, like every default. The given config is not changed.
 */
export function withHideEnergySensors<T extends Pick<DwainsDashboardConfig, 'settings'>>(config: T, hide: boolean): T {
  const settings = { ...config.settings };
  if (hide) settings.hide_energy_sensors_on_area_pages = true;
  else delete settings.hide_energy_sensors_on_area_pages;
  return { ...config, settings };
}

/**
 * The config with the exception of one room turned on or off. Off leaves the
 * key out; the other options of the room stay. The given config is not changed.
 */
export function withAreaShowEnergySensors<T extends Pick<DwainsDashboardConfig, 'areas_options'>>(
  config: T,
  areaId: string,
  show: boolean
): T {
  const areaOptions = { ...config.areas_options?.[areaId] };
  if (show) areaOptions.show_energy_sensors = true;
  else delete areaOptions.show_energy_sensors;
  return { ...config, areas_options: { ...config.areas_options, [areaId]: areaOptions } };
}
