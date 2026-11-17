import type { AreaData } from '../types/strategy';
import { getAlertIcon, getDeviceClassIcon, getDomainIcon } from './icons';
import { isUrgentStatus, sortUrgentFirst, statusColor } from './status-urgency';

/** One status badge of an area in the sidebar or on a mobile area card. */
export interface AreaStatusBadge {
  key: string;
  className: string;
  domain: string;
  deviceClass?: string;
  icon: string;
  count: number;
  color: string;
  urgent: boolean;
}

// Controls first, then motion, then the alerts.
const DOMAIN_ORDER = ['light', 'switch', 'cover', 'climate', 'media_player', 'fan', 'lock'];
const ALERT_ORDER = ['window', 'door', 'moisture', 'smoke'];

// The lock badge counts unlocked locks.
const DOMAIN_BADGE_ICONS: Record<string, string> = {
  lock: 'mdi:lock-open-variant',
};

function alertRank(deviceClass: string): number {
  const index = ALERT_ORDER.indexOf(deviceClass);
  return index === -1 ? ALERT_ORDER.length : index;
}

/**
 * The status badges of an area: active lights, switches, covers, climate,
 * media players, fans, unlocked locks and motion, then one badge per alert
 * type with its own icon and colour. Urgent badges come first.
 */
export function buildAreaStatusBadges(areaData: AreaData, alarmTriggered: boolean): AreaStatusBadge[] {
  const badges: AreaStatusBadge[] = [];
  const add = (badge: Omit<AreaStatusBadge, 'color' | 'urgent'>) => {
    const urgent = isUrgentStatus(badge, alarmTriggered);
    badges.push({ ...badge, urgent, color: statusColor(badge, urgent) });
  };

  DOMAIN_ORDER.forEach(domain => {
    const count = areaData.domains[domain]?.on || 0;
    if (count) {
      add({ key: domain, className: domain, domain, icon: DOMAIN_BADGE_ICONS[domain] || getDomainIcon(domain), count });
    }
  });

  const motion = areaData.domains.motion?.on || 0;
  if (motion) {
    add({
      key: 'binary_sensor.motion',
      className: 'motion',
      domain: 'binary_sensor',
      deviceClass: 'motion',
      icon: getDeviceClassIcon('binary_sensor', 'motion'),
      count: motion,
    });
  }

  const alertCounts = new Map<string, number>();
  areaData.alerts.forEach(alert => {
    const deviceClass = alert.deviceClass || 'problem';
    alertCounts.set(deviceClass, (alertCounts.get(deviceClass) || 0) + 1);
  });
  [...alertCounts.entries()]
    .sort(([a], [b]) => alertRank(a) - alertRank(b) || a.localeCompare(b))
    .forEach(([deviceClass, count]) => {
      add({
        key: `binary_sensor.${deviceClass}`,
        className: `alert-${deviceClass}`,
        domain: 'binary_sensor',
        deviceClass,
        icon: getAlertIcon(deviceClass),
        count,
      });
    });

  return sortUrgentFirst(badges);
}

// getAreaData() keeps returning the same object while an area is unchanged,
// so the badges are built once per area data object and alarm state.
const badgeCache = new WeakMap<AreaData, { alarmTriggered: boolean; badges: AreaStatusBadge[] }>();

export function getAreaStatusBadges(areaData: AreaData, alarmTriggered: boolean): AreaStatusBadge[] {
  const cached = badgeCache.get(areaData);
  if (cached && cached.alarmTriggered === alarmTriggered) return cached.badges;
  const badges = buildAreaStatusBadges(areaData, alarmTriggered);
  badgeCache.set(areaData, { alarmTriggered, badges });
  return badges;
}

/** Places on a mobile area card: four badges, or three and the overflow marker. */
export const MOBILE_AREA_BADGE_LIMIT = 4;

/** Never more than this many badges on a sidebar area, plus the overflow marker. */
export const SIDEBAR_AREA_BADGE_MAX = 8;

// Geometry of the desktop sidebar, see .floor-areas, .area-button,
// .area-info-badges and .sidebar .info-badge in layout-card-styles.ts.
const SIDEBAR_TILE_MIN_WIDTH = 178;
const SIDEBAR_TILE_GAP = 8;
const SIDEBAR_TILE_PADDING = 16;
const SIDEBAR_BADGE_AREA_RATIO = 0.59;
const SIDEBAR_BADGE_AREA_INSET = 24;
const SIDEBAR_BADGE_WIDTH = 44;
const SIDEBAR_BADGE_GAP = 6;
const SIDEBAR_BADGE_ROWS = 3;

/**
 * How many badge places fit on a sidebar area, measured from the width of the
 * area list; the overflow marker takes one place. Index 0 is for a floor with
 * one area per row, index 1 for two areas per row and so on; the last entry is
 * for full rows. The area grid uses `repeat(auto-fit, minmax(178px, 1fr))`, so
 * a floor with fewer areas than columns gets wider tiles.
 */
export function sidebarAreaBadgeLimits(listWidth: number): number[] {
  if (!(listWidth > 0)) return [];
  const tracks = Math.max(1, Math.floor((listWidth + SIDEBAR_TILE_GAP) / (SIDEBAR_TILE_MIN_WIDTH + SIDEBAR_TILE_GAP)));
  const limits: number[] = [];
  for (let columns = 1; columns <= tracks; columns++) {
    const tileWidth = (listWidth - SIDEBAR_TILE_GAP * (columns - 1)) / columns;
    const badgeArea = (tileWidth - 2 * SIDEBAR_TILE_PADDING) * SIDEBAR_BADGE_AREA_RATIO - SIDEBAR_BADGE_AREA_INSET;
    const perRow = Math.max(1, Math.floor((badgeArea + SIDEBAR_BADGE_GAP) / (SIDEBAR_BADGE_WIDTH + SIDEBAR_BADGE_GAP)));
    limits.push(Math.min(SIDEBAR_AREA_BADGE_MAX + 1, perRow * SIDEBAR_BADGE_ROWS));
  }
  return limits;
}

/** The badge places for an area in a floor with `areasInFloor` areas. */
export function sidebarAreaBadgeLimit(limits: readonly number[], areasInFloor: number): number {
  if (!limits.length) return SIDEBAR_AREA_BADGE_MAX + 1;
  const columns = Math.max(1, Math.min(limits.length, areasInFloor));
  return limits[columns - 1]!;
}

/**
 * The badges to show within `places` places and at most `maxBadges` badges.
 * When there are more, one place goes to a "+N" marker with the number of
 * badges left out.
 */
export function limitAreaStatusBadges(
  badges: readonly AreaStatusBadge[],
  places: number,
  maxBadges = places
): { visible: AreaStatusBadge[]; hidden: number } {
  if (badges.length <= places && badges.length <= maxBadges) return { visible: [...badges], hidden: 0 };
  const shown = Math.max(1, Math.min(maxBadges, places - 1));
  return { visible: badges.slice(0, shown), hidden: badges.length - shown };
}
