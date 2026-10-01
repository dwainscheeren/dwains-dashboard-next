import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig } from '../types/strategy';
import { isEntityFromHiddenDevice } from './device-admission';
import {
  getAreaConfigMap,
  getAreaHiddenEntityIdSet,
  getEntityConfigMap,
  getHiddenAreaIdSet,
  resolveStatusEntityAreaId,
} from './entity-lookups';
import { getEntityRegistry } from './entity-registry';
import { isRegistryEntryVisible } from './entity-visibility';
import { shouldSkipGroupEntity } from './header-status-domains';

// Pure helpers for the "Now playing" bar: which media players it shows, in
// which order, and which buttons a player supports.

/** Where the bar is shown: nowhere, on Home, or on Home and the room pages. */
export type NowPlayingMode = 'off' | 'home' | 'all';

/** Bits of `supported_features` (MediaPlayerEntityFeature in Home Assistant). */
export const MEDIA_PLAYER_FEATURE = {
  PAUSE: 1,
  NEXT_TRACK: 32,
  PLAY: 16384,
} as const;

/**
 * A paused player stays in the bar for this long after it was paused, so it
 * can be resumed from the bar. The time comes from the player's last_changed.
 */
export const NOW_PLAYING_PAUSED_GRACE_MS = 5 * 60 * 1000;

const PLAYING_STATES: ReadonlySet<string> = new Set(['playing', 'buffering']);

// Attributes the bar shows. Other attribute updates of a playing player, like
// the media position or the volume, do not need a render.
const NOW_PLAYING_ATTRIBUTES = [
  'media_title',
  'media_artist',
  'media_album_artist',
  'media_series_title',
  'app_name',
  'entity_picture',
  'entity_picture_local',
  'media_content_type',
  'supported_features',
  'friendly_name',
] as const;

export function normalizeNowPlayingMode(value: unknown): NowPlayingMode {
  return value === 'off' || value === 'all' ? value : 'home';
}

/** Whether the bar is shown on this view for the given setting. */
export function isNowPlayingShownOn(mode: NowPlayingMode, view: string | null | undefined): boolean {
  if (mode === 'off') return false;
  if (view === 'home') return true;
  return mode === 'all' && view === 'area';
}

export function isPlayingState(state: string | null | undefined): boolean {
  return PLAYING_STATES.has(String(state || ''));
}

export function supportsMediaFeature(state: HassEntity | undefined, feature: number): boolean {
  const features = Number(state?.attributes?.supported_features);
  return Number.isFinite(features) && (features & feature) !== 0;
}

/**
 * Whether the play/pause button can be shown: a playing player needs pause
 * support and a paused player needs play support. `shownState` is the state
 * the bar shows, which can be an optimistic one.
 */
export function canTogglePlayback(state: HassEntity | undefined, shownState = state?.state): boolean {
  return supportsMediaFeature(state, isPlayingState(shownState) ? MEDIA_PLAYER_FEATURE.PAUSE : MEDIA_PLAYER_FEATURE.PLAY);
}

export function canSkipToNextTrack(state: HassEntity | undefined): boolean {
  return supportsMediaFeature(state, MEDIA_PLAYER_FEATURE.NEXT_TRACK);
}

function changedAt(state: HassEntity): number {
  const time = Date.parse(state.last_changed);
  return Number.isFinite(time) ? time : 0;
}

/** Playing, or paused for at most `graceMs`. */
export function isNowPlayingCandidate(
  state: HassEntity,
  now: number,
  graceMs: number = NOW_PLAYING_PAUSED_GRACE_MS
): boolean {
  if (isPlayingState(state.state)) return true;
  if (state.state !== 'paused') return false;
  const changed = Date.parse(state.last_changed);
  return Number.isFinite(changed) && now - changed <= graceMs;
}

export interface PickNowPlayingOptions {
  now: number;
  graceMs?: number;
  isVisible?: (entityId: string) => boolean;
}

/**
 * The media players for the bar, most relevant first: playing players before
 * paused ones, and within each group the most recently changed first. Group
 * players are left out when one of their members is in the list as well.
 */
export function pickNowPlayingEntityIds(
  states: readonly HassEntity[],
  options: PickNowPlayingOptions
): string[] {
  const { now, graceMs = NOW_PLAYING_PAUSED_GRACE_MS, isVisible } = options;
  const candidates = states.filter((state) =>
    typeof state?.entity_id === 'string' &&
    state.entity_id.startsWith('media_player.') &&
    isNowPlayingCandidate(state, now, graceMs) &&
    (!isVisible || isVisible(state.entity_id))
  );
  const ids = new Set(candidates.map((state) => state.entity_id));
  return candidates
    .filter((state) => !shouldSkipGroupEntity(state, (memberId) => ids.has(memberId)))
    .sort((left, right) => {
      const playing = Number(isPlayingState(right.state)) - Number(isPlayingState(left.state));
      if (playing) return playing;
      const changed = changedAt(right) - changedAt(left);
      if (changed) return changed;
      return left.entity_id.localeCompare(right.entity_id);
    })
    .map((state) => state.entity_id);
}

/**
 * Whether a media player is shown in the bar, with the same rules as the rest
 * of the dashboard: hidden, disabled and diagnostic entities, entities of
 * hidden devices, entities in hidden areas and entities hidden in their area
 * are left out. Players without an area (for example a Spotify account) are
 * shown, because they often have no room.
 */
export function isNowPlayingPlayerVisible(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | null | undefined,
  entityId: string
): boolean {
  if (!isRegistryEntryVisible(getEntityRegistry(hass)[entityId])) return false;
  const entityConfig = getEntityConfigMap(config).get(entityId);
  if (isEntityFromHiddenDevice(hass, config || undefined, entityConfig || entityId)) return false;
  const areaId = resolveStatusEntityAreaId(hass, config, entityId, entityConfig);
  if (!areaId || !getAreaConfigMap(config).has(areaId)) return true;
  return !getHiddenAreaIdSet(config).has(areaId) && !getAreaHiddenEntityIdSet(config, areaId).has(entityId);
}

/** Room name of a player, when it is in a known area. */
export function nowPlayingRoomName(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | null | undefined,
  entityId: string
): string | undefined {
  const areaId = resolveStatusEntityAreaId(hass, config, entityId);
  return areaId ? getAreaConfigMap(config).get(areaId)?.name || undefined : undefined;
}

export interface NowPlayingLabels {
  title: string;
  /** Artist, show or app; empty when there is nothing to add to the title. */
  artist: string;
}

/** Title and artist line for a player, with fallbacks for apps and radio. */
export function getNowPlayingLabels(state: HassEntity, fallbackName: string): NowPlayingLabels {
  const attributes = state.attributes || {};
  const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
  const mediaTitle = text(attributes.media_title);
  const appName = text(attributes.app_name);
  const title = mediaTitle || appName || text(attributes.friendly_name) || fallbackName;
  const artist = text(attributes.media_artist) ||
    text(attributes.media_album_artist) ||
    text(attributes.media_series_title) ||
    (mediaTitle && appName !== title ? appName : '');
  return { title, artist: artist === title ? '' : artist };
}

/** Picture URL of the media, made absolute when Home Assistant gives a path. */
export function getNowPlayingArtworkUrl(
  state: HassEntity | undefined,
  hassUrl?: (path: string) => string
): string | undefined {
  const picture = state?.attributes?.entity_picture_local || state?.attributes?.entity_picture;
  if (typeof picture !== 'string' || !picture) return undefined;
  if (picture.startsWith('/') && !picture.startsWith('//') && typeof hassUrl === 'function') {
    try {
      return hassUrl(picture);
    } catch {
      return picture;
    }
  }
  return picture;
}

/**
 * Whether a state change can change the bar: a media player that changed its
 * state, appeared or disappeared, or a playing or paused player that changed
 * one of the attributes the bar shows.
 */
export function isNowPlayingRelevantStateChange(
  entityId: string,
  oldState: HassEntity | undefined,
  newState: HassEntity | undefined
): boolean {
  if (!entityId.startsWith('media_player.')) return false;
  if (!oldState || !newState) return true;
  if (oldState.state !== newState.state) return true;
  if (!isPlayingState(newState.state) && newState.state !== 'paused') return false;
  return NOW_PLAYING_ATTRIBUTES.some((key) => oldState.attributes?.[key] !== newState.attributes?.[key]);
}
