import type { HomeAssistant } from '../types/home-assistant';
import { ddLocalizePlural } from './localize';
import type { HousePowerUsageSummary, PowerEntitySummary, PowerSourceSummary } from './power-usage';

// Pure helpers for the Home information popups (people, climate and device
// groups) and the house power panel. The dialogs only render what these return.

/** Service calls the room and "all" actions of a popup can run. */
export type BulkDomainAction = 'turn_on' | 'turn_off' | 'open_cover' | 'close_cover' | 'lock' | 'unlock';

/** Domains whose entities are switched on and off. */
export const TOGGLE_DOMAINS: ReadonlySet<string> = new Set(['light', 'switch', 'fan', 'input_boolean']);

/** Rooms with this many entities or fewer take half the width on desktop. */
export const COMPACT_ROOM_MAX_ENTITIES = 2;

export function isCompactRoom(entityCount: number): boolean {
  return entityCount <= COMPACT_ROOM_MAX_ENTITIES;
}

export interface RoomGroupLike {
  areaId: string;
  areaName: string;
}

/**
 * Room groups in the order the dashboard shows its areas (`areaOrder`, the
 * area ids from `sortAreas`). Rooms that are not in that list, like hidden
 * outdoor areas, follow alphabetically.
 */
export function orderRoomGroups<T extends RoomGroupLike>(
  groups: readonly T[],
  areaOrder: readonly string[],
  locale?: string
): T[] {
  const position = new Map(areaOrder.map((areaId, index) => [areaId, index]));
  return [...groups].sort((a, b) => {
    const aIndex = position.get(a.areaId) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = position.get(b.areaId) ?? Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.areaName.localeCompare(b.areaName, locale);
  });
}

export function countActiveEntities(entityIds: readonly string[], isActive: (entityId: string) => boolean): number {
  let count = 0;
  for (const entityId of entityIds) {
    if (isActive(entityId)) count++;
  }
  return count;
}

export interface RoomSegmentItem {
  action: BulkDomainAction;
  /** Translation key of the action label. */
  labelKey: string;
  icon: string;
  /** Matches the current state of the room (all closed, something unlocked, ...). */
  current: boolean;
}

export type RoomAction =
  | {
      mode: 'toggle';
      /** What a press does: switch everything off when something is on, otherwise on. */
      action: 'turn_on' | 'turn_off';
      checked: boolean;
      activeCount: number;
      totalCount: number;
    }
  | { mode: 'segmented'; items: RoomSegmentItem[] };

/**
 * The action in the header of a room card. Switches get an "active/total"
 * toggle, but only when the room has more than one of them (a single entity
 * has its own switch). Covers get open/close and locks lock/unlock.
 * `activeCount` counts entities that are on, open or unlocked.
 */
export function getRoomAction(domain: string, activeCount: number, totalCount: number): RoomAction | undefined {
  if (totalCount <= 0) return undefined;

  if (TOGGLE_DOMAINS.has(domain)) {
    if (totalCount <= 1) return undefined;
    const checked = activeCount > 0;
    return { mode: 'toggle', action: checked ? 'turn_off' : 'turn_on', checked, activeCount, totalCount };
  }

  if (domain === 'cover') {
    return {
      mode: 'segmented',
      items: [
        { action: 'open_cover', labelKey: 'action.open_all', icon: 'mdi:arrow-up', current: activeCount > 0 },
        { action: 'close_cover', labelKey: 'action.close_all', icon: 'mdi:arrow-down', current: activeCount === 0 },
      ],
    };
  }

  if (domain === 'lock') {
    return {
      mode: 'segmented',
      items: [
        { action: 'lock', labelKey: 'action.lock_all', icon: 'mdi:lock-outline', current: activeCount === 0 },
        { action: 'unlock', labelKey: 'action.unlock_all', icon: 'mdi:lock-open-variant-outline', current: activeCount > 0 },
      ],
    };
  }

  return undefined;
}

/** Domains that get a room action: switches, covers and locks. */
export function hasRoomAction(domain: string): boolean {
  return TOGGLE_DOMAINS.has(domain) || domain === 'cover' || domain === 'lock';
}

/**
 * Whether an entity counts as on, open or unlocked for a room action.
 * Unavailable and unknown entities never count.
 */
export function isRoomActionEntityActive(
  state: { state?: string | null } | null | undefined,
  domain: string
): boolean {
  const value = String(state?.state ?? '').toLowerCase();
  if (!value || value === 'unavailable' || value === 'unknown') return false;
  if (domain === 'cover') return value === 'open' || value === 'opening';
  if (domain === 'lock') return value === 'unlocked' || value === 'unlocking' || value === 'open';
  return value === 'on';
}

/**
 * Whether a room action asks first. Unlocking always asks; everything else
 * follows the master action confirmation setting of the domain.
 */
export function roomActionNeedsConfirmation(action: BulkDomainAction, confirmationEnabled: boolean): boolean {
  return action === 'unlock' || confirmationEnabled;
}

/** Actions that switch something off, close it or unlock it. */
export function isDestructiveBulkAction(action: BulkDomainAction): boolean {
  return action === 'turn_off' || action === 'close_cover' || action === 'unlock';
}

export type PersonPresence = 'home' | 'away' | 'zone' | 'unknown';

/** A person without a (working) device tracker reports unknown or unavailable. */
export function personPresence(state: string | null | undefined): PersonPresence {
  const value = String(state ?? '').toLowerCase();
  if (!value || value === 'unknown' || value === 'unavailable') return 'unknown';
  if (value === 'home') return 'home';
  if (value === 'not_home') return 'away';
  return 'zone';
}

/** An entity in a statistics-graph card config. */
export interface StatisticsGraphEntity {
  entity: string;
  name: string;
}

/** State classes Home Assistant keeps long term statistics for. */
const STATISTICS_STATE_CLASSES: ReadonlySet<string> = new Set(['measurement', 'total', 'total_increasing']);

/**
 * The power sensors to draw in a statistics graph: only sensors with long
 * term statistics, the highest readings first, at most `limit`. A graph
 * draws the reading, so an upstream device is ranked by its reading
 * (`measuredWatts`), not by the untracked part it adds to its room.
 */
export function pickPowerStatisticsEntities(
  entities: readonly (Pick<PowerEntitySummary, 'entityId' | 'name' | 'watts' | 'stateClass'> &
    Partial<Pick<PowerEntitySummary, 'measuredWatts'>>)[],
  limit: number
): StatisticsGraphEntity[] {
  const reading = (entity: { watts: number; measuredWatts?: number }) => entity.measuredWatts ?? entity.watts;
  return entities
    .filter((entity) => STATISTICS_STATE_CLASSES.has(entity.stateClass || ''))
    .sort((a, b) => reading(b) - reading(a))
    .slice(0, Math.max(0, limit))
    .map((entity) => ({ entity: entity.entityId, name: entity.name }));
}

/**
 * The energy settings sensors (grid, solar, battery) for the whole house
 * graph, once each and only when they have long term statistics.
 */
export function pickEnergySourceStatisticsEntities(
  sources: readonly Pick<PowerSourceSummary, 'entityId' | 'name'>[],
  states: HomeAssistant['states'] | undefined
): StatisticsGraphEntity[] {
  const seen = new Set<string>();
  const picked: StatisticsGraphEntity[] = [];
  for (const source of sources) {
    if (seen.has(source.entityId)) continue;
    seen.add(source.entityId);
    const stateClass = String(states?.[source.entityId]?.attributes?.state_class || '').toLowerCase();
    if (STATISTICS_STATE_CLASSES.has(stateClass)) picked.push({ entity: source.entityId, name: source.name });
  }
  return picked;
}

/**
 * True for an upstream device in the energy settings whose downstream
 * sensors are counted too: it only adds its untracked part to its room.
 */
export function hasUntrackedPowerShare(entity: Pick<PowerEntitySummary, 'watts' | 'measuredWatts'>): boolean {
  return Math.round(entity.measuredWatts - entity.watts) >= 1;
}

/**
 * The number of power sensors the house total counts. A total that is not
 * based on the grid says so when only the devices in the energy settings
 * count. With the grid the count is the number of energy settings sensors
 * the total is based on (grid, solar and battery), as before.
 */
export function powerSensorCountLabel(
  hass: HomeAssistant | undefined,
  summary: Pick<HousePowerUsageSummary, 'basis' | 'sensorCount' | 'energySettingsDevicesOnly'>
): string {
  return ddLocalizePlural(
    hass,
    summary.basis === 'rooms' && summary.energySettingsDevicesOnly
      ? 'devices.energy_settings_power_sensor'
      : 'devices.live_power_sensor',
    summary.sensorCount
  );
}

/**
 * True when the whole house card should say how much is measured in the
 * areas: the total comes from the energy settings, or a device of the energy
 * settings that is in no room, such as a main meter, adds its share to it.
 */
export function showsPowerMeasuredInAreas(
  summary: Pick<HousePowerUsageSummary, 'basis' | 'roomSensorCount' | 'totalWatts' | 'roomTotalWatts'>
): boolean {
  if (summary.roomSensorCount <= 0) return false;
  return summary.basis === 'energy' || Math.round(summary.totalWatts - summary.roomTotalWatts) >= 1;
}

/**
 * Lines of the whole house graph: the energy settings sensors when the total
 * comes from them, otherwise the biggest power sensors, the devices of the
 * energy settings that are in no room (such as a main meter) included.
 */
export function wholeHousePowerGraphEntities(
  summary: Pick<HousePowerUsageSummary, 'basis' | 'sources' | 'areas' | 'outsideAreaEntities'>,
  states: HomeAssistant['states'] | undefined,
  limit: number
): StatisticsGraphEntity[] {
  if (summary.basis === 'energy') return pickEnergySourceStatisticsEntities(summary.sources, states);
  return pickPowerStatisticsEntities(
    [...summary.outsideAreaEntities, ...summary.areas.flatMap((area) => area.entities)],
    limit
  );
}

/** Width of a share bar: the share of the total, at least 4% so it stays visible. */
export function powerSharePercentage(watts: number, totalWatts: number): number {
  if (!(totalWatts > 0)) return 0;
  return Math.max(4, Math.min(100, Math.round((watts / totalWatts) * 100)));
}
