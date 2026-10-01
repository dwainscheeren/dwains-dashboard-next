import { describe, expect, it } from 'vitest';
import {
  MEDIA_PLAYER_FEATURE,
  NOW_PLAYING_PAUSED_GRACE_MS,
  canSkipToNextTrack,
  canTogglePlayback,
  getNowPlayingArtworkUrl,
  getNowPlayingLabels,
  isNowPlayingCandidate,
  isNowPlayingPlayerVisible,
  isNowPlayingRelevantStateChange,
  isNowPlayingShownOn,
  normalizeNowPlayingMode,
  nowPlayingRoomName,
  pickNowPlayingEntityIds,
  supportsMediaFeature,
} from '../src/utils/now-playing';
import type { HassEntity } from '../src/types/home-assistant';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

const NOW = Date.parse('2026-10-01T12:00:00Z');

function player(
  entityId: string,
  state: string,
  changedSecondsAgo: number,
  attributes: Record<string, any> = {}
): HassEntity {
  const changed = new Date(NOW - changedSecondsAgo * 1000).toISOString();
  return { ...entityState(entityId, state, attributes), last_changed: changed, last_updated: changed };
}

describe('now playing mode', () => {
  it('defaults to Home only', () => {
    expect(normalizeNowPlayingMode(undefined)).toBe('home');
    expect(normalizeNowPlayingMode('nonsense')).toBe('home');
    expect(normalizeNowPlayingMode('off')).toBe('off');
    expect(normalizeNowPlayingMode('all')).toBe('all');
  });

  it('shows the bar on the views of the chosen mode', () => {
    expect(isNowPlayingShownOn('home', 'home')).toBe(true);
    expect(isNowPlayingShownOn('home', 'area')).toBe(false);
    expect(isNowPlayingShownOn('all', 'area')).toBe(true);
    expect(isNowPlayingShownOn('all', 'settings')).toBe(false);
    expect(isNowPlayingShownOn('off', 'home')).toBe(false);
  });
});

describe('supported features', () => {
  const all = MEDIA_PLAYER_FEATURE.PAUSE | MEDIA_PLAYER_FEATURE.PLAY | MEDIA_PLAYER_FEATURE.NEXT_TRACK;

  it('reads bits of supported_features', () => {
    expect(supportsMediaFeature(player('media_player.a', 'playing', 0, { supported_features: all }), MEDIA_PLAYER_FEATURE.NEXT_TRACK)).toBe(true);
    expect(supportsMediaFeature(player('media_player.a', 'playing', 0, { supported_features: 1 }), MEDIA_PLAYER_FEATURE.NEXT_TRACK)).toBe(false);
    expect(supportsMediaFeature(player('media_player.a', 'playing', 0), MEDIA_PLAYER_FEATURE.PAUSE)).toBe(false);
    expect(supportsMediaFeature(undefined, MEDIA_PLAYER_FEATURE.PAUSE)).toBe(false);
  });

  it('needs pause support while playing and play support while paused', () => {
    const pauseOnly = player('media_player.a', 'playing', 0, { supported_features: MEDIA_PLAYER_FEATURE.PAUSE });
    expect(canTogglePlayback(pauseOnly)).toBe(true);
    expect(canTogglePlayback(pauseOnly, 'paused')).toBe(false);
    const playOnly = player('media_player.a', 'paused', 0, { supported_features: MEDIA_PLAYER_FEATURE.PLAY });
    expect(canTogglePlayback(playOnly)).toBe(true);
    expect(canTogglePlayback(playOnly, 'playing')).toBe(false);
  });

  it('only offers next track when supported', () => {
    expect(canSkipToNextTrack(player('media_player.a', 'playing', 0, { supported_features: all }))).toBe(true);
    expect(canSkipToNextTrack(player('media_player.a', 'playing', 0, { supported_features: 1 | 16384 }))).toBe(false);
  });
});

describe('isNowPlayingCandidate', () => {
  it('accepts playing and buffering players', () => {
    expect(isNowPlayingCandidate(player('media_player.a', 'playing', 3600), NOW)).toBe(true);
    expect(isNowPlayingCandidate(player('media_player.a', 'buffering', 3600), NOW)).toBe(true);
  });

  it('keeps paused players for the grace period only', () => {
    expect(isNowPlayingCandidate(player('media_player.a', 'paused', 60), NOW)).toBe(true);
    expect(isNowPlayingCandidate(player('media_player.a', 'paused', NOW_PLAYING_PAUSED_GRACE_MS / 1000 + 1), NOW)).toBe(false);
  });

  it('ignores idle, off and unavailable players', () => {
    expect(isNowPlayingCandidate(player('media_player.a', 'idle', 1), NOW)).toBe(false);
    expect(isNowPlayingCandidate(player('media_player.a', 'off', 1), NOW)).toBe(false);
    expect(isNowPlayingCandidate(player('media_player.a', 'unavailable', 1), NOW)).toBe(false);
  });
});

describe('pickNowPlayingEntityIds', () => {
  it('lists playing players first, most recently changed first', () => {
    const states = [
      player('media_player.old', 'playing', 600),
      player('media_player.paused', 'paused', 10),
      player('media_player.new', 'playing', 30),
      player('media_player.idle', 'idle', 5),
      player('media_player.stale', 'paused', 3600),
      entityState('light.lamp', 'on'),
    ];
    expect(pickNowPlayingEntityIds(states, { now: NOW })).toEqual([
      'media_player.new',
      'media_player.old',
      'media_player.paused',
    ]);
  });

  it('leaves out hidden players', () => {
    const states = [player('media_player.a', 'playing', 10), player('media_player.b', 'playing', 5)];
    expect(pickNowPlayingEntityIds(states, { now: NOW, isVisible: (id) => id !== 'media_player.b' }))
      .toEqual(['media_player.a']);
  });

  it('leaves out a group player when one of its members is listed', () => {
    const states = [
      player('media_player.everywhere', 'playing', 1, { entity_id: ['media_player.kitchen', 'media_player.living'] }),
      player('media_player.kitchen', 'playing', 20),
    ];
    expect(pickNowPlayingEntityIds(states, { now: NOW })).toEqual(['media_player.kitchen']);
  });
});

describe('getNowPlayingLabels', () => {
  it('uses the media title and artist', () => {
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { media_title: 'Song', media_artist: 'Band' }), 'Speaker'))
      .toEqual({ title: 'Song', artist: 'Band' });
  });

  it('falls back to the album artist, series and app name', () => {
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { media_title: 'Song', media_album_artist: 'Various' }), 'Speaker').artist)
      .toBe('Various');
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { media_title: 'Pilot', media_series_title: 'The Show' }), 'TV').artist)
      .toBe('The Show');
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { media_title: 'News', app_name: 'Radio 1' }), 'Speaker'))
      .toEqual({ title: 'News', artist: 'Radio 1' });
  });

  it('uses the app or player name as title without media title', () => {
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { app_name: 'Netflix' }), 'TV'))
      .toEqual({ title: 'Netflix', artist: '' });
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0, { friendly_name: 'Kitchen speaker' }), 'x'))
      .toEqual({ title: 'Kitchen speaker', artist: '' });
    expect(getNowPlayingLabels(player('media_player.a', 'playing', 0), 'Fallback').title).toBe('Fallback');
  });
});

describe('getNowPlayingArtworkUrl', () => {
  const hassUrl = (path: string) => `https://ha.example${path}`;

  it('makes Home Assistant paths absolute', () => {
    const state = player('media_player.a', 'playing', 0, { entity_picture: '/api/media_player_proxy/media_player.a?token=x' });
    expect(getNowPlayingArtworkUrl(state, hassUrl)).toBe('https://ha.example/api/media_player_proxy/media_player.a?token=x');
    expect(getNowPlayingArtworkUrl(state)).toBe('/api/media_player_proxy/media_player.a?token=x');
  });

  it('prefers the local picture and keeps absolute URLs', () => {
    expect(getNowPlayingArtworkUrl(player('media_player.a', 'playing', 0, {
      entity_picture: 'https://cdn.example/cover.jpg',
      entity_picture_local: '/api/media_player_proxy/a',
    }), hassUrl)).toBe('https://ha.example/api/media_player_proxy/a');
    expect(getNowPlayingArtworkUrl(player('media_player.a', 'playing', 0, { entity_picture: 'https://cdn.example/cover.jpg' }), hassUrl))
      .toBe('https://cdn.example/cover.jpg');
  });

  it('returns nothing without a picture', () => {
    expect(getNowPlayingArtworkUrl(player('media_player.a', 'playing', 0), hassUrl)).toBeUndefined();
    expect(getNowPlayingArtworkUrl(undefined, hassUrl)).toBeUndefined();
  });
});

describe('isNowPlayingRelevantStateChange', () => {
  const base = player('media_player.a', 'playing', 10, { media_title: 'Song', media_position: 10 });

  it('is relevant for state changes, new and removed players', () => {
    expect(isNowPlayingRelevantStateChange('media_player.a', base, { ...base, state: 'paused' })).toBe(true);
    expect(isNowPlayingRelevantStateChange('media_player.a', undefined, base)).toBe(true);
    expect(isNowPlayingRelevantStateChange('media_player.a', base, undefined)).toBe(true);
  });

  it('is relevant when a shown attribute changes', () => {
    expect(isNowPlayingRelevantStateChange('media_player.a', base, {
      ...base,
      attributes: { ...base.attributes, media_title: 'Next song' },
    })).toBe(true);
  });

  it('ignores attributes the bar does not show, idle players and other domains', () => {
    expect(isNowPlayingRelevantStateChange('media_player.a', base, {
      ...base,
      attributes: { ...base.attributes, media_position: 42 },
    })).toBe(false);
    const idle = player('media_player.a', 'idle', 10, { volume_level: 0.2 });
    expect(isNowPlayingRelevantStateChange('media_player.a', idle, {
      ...idle,
      attributes: { volume_level: 0.4, media_title: 'x' },
    })).toBe(false);
    expect(isNowPlayingRelevantStateChange('light.a', base, { ...base, state: 'off' })).toBe(false);
  });
});

describe('isNowPlayingPlayerVisible', () => {
  const config = {
    areas: [
      { area_id: 'living', name: 'Living room' },
      { area_id: 'attic', name: 'Attic' },
    ],
    devices: [{ device_id: 'dev-hidden', name: 'Hidden speaker', area_id: 'living' }],
    entities: [
      { entity_id: 'media_player.living', area_id: 'living' },
      { entity_id: 'media_player.attic', area_id: 'attic' },
      { entity_id: 'media_player.hidden_in_area', area_id: 'living' },
      { entity_id: 'media_player.device_hidden', device_id: 'dev-hidden' },
      { entity_id: 'media_player.spotify' },
    ],
    areas_display: { hidden: ['attic'] },
    areas_options: { living: { groups_options: { media_player: { hidden: ['media_player.hidden_in_area'] } } } },
    device_admission: { hidden_devices: ['dev-hidden'] },
    settings: {},
  } as unknown as DwainsDashboardConfig;
  const hass = hassWithStates([], {
    entities: {
      'media_player.registry_hidden': { entity_id: 'media_player.registry_hidden', hidden: true },
      'media_player.device_hidden': { entity_id: 'media_player.device_hidden', device_id: 'dev-hidden' },
    },
  });

  it('shows players in visible areas and players without an area', () => {
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.living')).toBe(true);
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.spotify')).toBe(true);
  });

  it('hides players that are hidden anywhere in the dashboard', () => {
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.attic')).toBe(false);
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.hidden_in_area')).toBe(false);
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.device_hidden')).toBe(false);
    expect(isNowPlayingPlayerVisible(hass, config, 'media_player.registry_hidden')).toBe(false);
  });

  it('names the room of a player', () => {
    expect(nowPlayingRoomName(hass, config, 'media_player.living')).toBe('Living room');
    expect(nowPlayingRoomName(hass, config, 'media_player.spotify')).toBeUndefined();
  });
});
