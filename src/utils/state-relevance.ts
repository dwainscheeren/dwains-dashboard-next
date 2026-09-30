import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { isHiddenAsUnavailable } from './entity-availability';

// Home Assistant replaces `hass` on every state change of any entity. These
// helpers decide whether such a change can affect what a view shows, so the
// view can skip rendering for unrelated changes. When in doubt they answer
// "relevant": an extra render is cheap compared to showing stale data.

export type StateChangePredicate = (
  entityId: string,
  oldState: HassEntity | undefined,
  newState: HassEntity | undefined
) => boolean;

/** True when anything on hass other than `states` was replaced or removed. */
export function hassChangedOutsideStates(oldHass: HomeAssistant, newHass: HomeAssistant): boolean {
  const oldRecord = oldHass as unknown as Record<string, unknown>;
  const newRecord = newHass as unknown as Record<string, unknown>;
  for (const key in newRecord) {
    if (key !== 'states' && oldRecord[key] !== newRecord[key]) return true;
  }
  for (const key in oldRecord) {
    if (key !== 'states' && !(key in newRecord)) return true;
  }
  return false;
}

// Key counts of states objects seen before. The new states of one update are
// the old states of the next, so removed entities can usually be ruled out
// without walking the old object again.
const stateKeyCounts = new WeakMap<object, number>();

function countKeys(states: Record<string, unknown>): number {
  let count = stateKeyCounts.get(states);
  if (count === undefined) {
    count = 0;
    for (const _key in states) count++;
    stateKeyCounts.set(states, count);
  }
  return count;
}

/**
 * True when an entity was added, removed or replaced between the two states
 * objects and `isRelevant` accepts that change.
 */
export function hasRelevantStateChange(
  oldStates: HomeAssistant['states'] | undefined,
  newStates: HomeAssistant['states'] | undefined,
  isRelevant: StateChangePredicate
): boolean {
  if (oldStates === newStates) return false;
  if (!oldStates || !newStates) return true;

  let newCount = 0;
  let sharedCount = 0;
  for (const entityId in newStates) {
    newCount++;
    const newState = newStates[entityId];
    const oldState = oldStates[entityId];
    if (oldState !== undefined) sharedCount++;
    if (oldState !== newState && isRelevant(entityId, oldState, newState)) return true;
  }
  stateKeyCounts.set(newStates, newCount);

  if (sharedCount === countKeys(oldStates)) return false;
  for (const entityId in oldStates) {
    if (newStates[entityId] === undefined && isRelevant(entityId, oldStates[entityId], undefined)) return true;
  }
  return false;
}

function entityDomain(entityId: string): string {
  const dot = entityId.indexOf('.');
  return dot === -1 ? entityId : entityId.slice(0, dot);
}

/** An update entity changed its state, or appeared or disappeared (Home summaries). */
export function isUpdateEntityStateChange(
  entityId: string,
  oldState: HassEntity | undefined,
  newState: HassEntity | undefined
): boolean {
  return entityId.startsWith('update.') && oldState?.state !== newState?.state;
}

// On Home these domains only matter through their state: status cards, area
// badges and area counts. Attribute updates, like a light's brightness or a
// media player's position, are not shown there.
const HOME_STATE_DOMAINS: ReadonlySet<string> = new Set([
  'light',
  'switch',
  'fan',
  'cover',
  'lock',
  'media_player',
  'vacuum',
  'alarm_control_panel',
]);

// These domains show attributes on Home (people, cameras, weather, to-do lists).
const HOME_ENTITY_DOMAINS: ReadonlySet<string> = new Set(['person', 'camera', 'weather', 'todo']);

// Binary sensor classes used by the status cards and the area badges and alerts.
const HOME_BINARY_SENSOR_CLASSES: ReadonlySet<string> = new Set([
  'door',
  'gas',
  'moisture',
  'motion',
  'occupancy',
  'opening',
  'presence',
  'safety',
  'smoke',
  'tamper',
  'vibration',
  'window',
]);

const POWER_UNITS: ReadonlySet<string> = new Set(['w', 'kw', 'mw']);

function isHomeBinarySensor(state: HassEntity): boolean {
  return HOME_BINARY_SENSOR_CLASSES.has(state.attributes?.device_class);
}

/** Sensors used by the power card and the area wattage. */
function isPowerSensor(state: HassEntity): boolean {
  const attributes = state.attributes;
  if (!attributes) return false;
  return POWER_UNITS.has(String(attributes.unit_of_measurement || '').trim().toLowerCase()) ||
    String(attributes.device_class || '').toLowerCase() === 'power';
}

/**
 * Whether a state change can affect the Home view. `explicitEntityIds` holds
 * entities Home shows directly: favorites, the weather and alarm entities and
 * the temperature and humidity sensors of the areas.
 */
export function isHomeRelevantStateChange(
  entityId: string,
  oldState: HassEntity | undefined,
  newState: HassEntity | undefined,
  explicitEntityIds: ReadonlySet<string>
): boolean {
  if (explicitEntityIds.has(entityId)) return true;
  // Added or removed entities change area membership and counts.
  if (!oldState || !newState) return true;
  // Unavailable entities are left out of the area lists and device counts.
  if (isHiddenAsUnavailable(oldState) !== isHiddenAsUnavailable(newState)) return true;
  // States can place entities in an area through their attributes.
  if (oldState.attributes?.area_id !== newState.attributes?.area_id) return true;

  const domain = entityDomain(entityId);
  if (HOME_STATE_DOMAINS.has(domain)) return oldState.state !== newState.state;
  if (HOME_ENTITY_DOMAINS.has(domain)) return true;
  if (domain === 'climate') {
    return oldState.state !== newState.state ||
      oldState.attributes?.hvac_action !== newState.attributes?.hvac_action;
  }
  if (domain === 'update') return oldState.state !== newState.state;
  if (domain === 'binary_sensor') {
    if (!isHomeBinarySensor(oldState) && !isHomeBinarySensor(newState)) return false;
    return oldState.state !== newState.state ||
      oldState.attributes?.device_class !== newState.attributes?.device_class;
  }
  if (domain === 'sensor') return isPowerSensor(oldState) || isPowerSensor(newState);
  return false;
}
