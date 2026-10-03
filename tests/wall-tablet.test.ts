import { beforeEach, describe, expect, it } from 'vitest';
import { formatLongDate } from '../src/utils/clock';
import {
  DEFAULT_WALL_TABLET_PREFS,
  burnInOffset,
  burnInRange,
  consumeWallTabletUrlParam,
  dashboardSegmentFromPath,
  invalidateWallTabletPrefs,
  isEditingDialogState,
  isHomeViewPath,
  isMediaSourceId,
  isOpenDialogState,
  isWallTabletStorageKey,
  normalizeWallTabletPrefs,
  parseWallTabletPrefs,
  parseWallTabletUrlParam,
  planIdleActions,
  readWallTabletPrefs,
  removeWallTabletUrlParam,
  sanitizeImageLink,
  screensaverSource,
  updateWallTabletPrefs,
  viewPathFromPath,
  wallTabletStorageKey,
  writeWallTabletPrefs,
} from '../src/utils/wall-tablet';

const MINUTE = 60_000;

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function throwingStorage() {
  return {
    getItem: (): string | null => {
      throw new Error('SecurityError');
    },
    setItem: (): void => {
      throw new Error('QuotaExceededError');
    },
  };
}

beforeEach(() => invalidateWallTabletPrefs());

describe('wall tablet preferences', () => {
  it('uses the defaults for missing or broken stored values', () => {
    expect(parseWallTabletPrefs(null)).toEqual(DEFAULT_WALL_TABLET_PREFS);
    expect(parseWallTabletPrefs('')).toEqual(DEFAULT_WALL_TABLET_PREFS);
    expect(parseWallTabletPrefs('{not json')).toEqual(DEFAULT_WALL_TABLET_PREFS);
    expect(parseWallTabletPrefs('42')).toEqual(DEFAULT_WALL_TABLET_PREFS);
  });

  it('returns to Home after 5 minutes and keeps the screensaver off by default', () => {
    expect(DEFAULT_WALL_TABLET_PREFS).toEqual({
      enabled: false,
      returnHomeMinutes: 5,
      screensaverMinutes: 0,
      dimLevel: 80,
      screensaverMode: 'clock',
      screensaverImage: '',
      screensaverImageName: '',
      slideshowFolder: '',
      slideshowFolderName: '',
      slideSeconds: 30,
      slideshowShuffle: true,
      photoFit: 'cover',
      photoDimLevel: 20,
      photoClock: true,
    });
  });

  it('only accepts the offered options', () => {
    expect(normalizeWallTabletPrefs({
      enabled: 'yes',
      returnHomeMinutes: 7,
      screensaverMinutes: '10',
      dimLevel: 50,
    })).toEqual({ ...DEFAULT_WALL_TABLET_PREFS, enabled: false, returnHomeMinutes: 5, screensaverMinutes: 10, dimLevel: 80 });

    expect(normalizeWallTabletPrefs({
      enabled: true,
      returnHomeMinutes: 0,
      screensaverMinutes: 30,
      dimLevel: 95,
    })).toEqual({ ...DEFAULT_WALL_TABLET_PREFS, enabled: true, returnHomeMinutes: 0, screensaverMinutes: 30, dimLevel: 95 });
  });

  it('keeps preferences stored by an older version and adds the photo defaults', () => {
    const stored = JSON.stringify({ enabled: true, returnHomeMinutes: 10, screensaverMinutes: 2, dimLevel: 60 });
    expect(parseWallTabletPrefs(stored)).toEqual({
      ...DEFAULT_WALL_TABLET_PREFS,
      enabled: true,
      returnHomeMinutes: 10,
      screensaverMinutes: 2,
      dimLevel: 60,
    });
  });

  it('only accepts the offered photo options', () => {
    expect(normalizeWallTabletPrefs({
      screensaverMode: 'video',
      slideSeconds: 7,
      slideshowShuffle: 'no',
      photoFit: 'stretch',
      photoDimLevel: 95,
      photoClock: 0,
    })).toMatchObject({
      screensaverMode: 'clock',
      slideSeconds: 30,
      slideshowShuffle: true,
      photoFit: 'cover',
      photoDimLevel: 20,
      photoClock: true,
    });

    expect(normalizeWallTabletPrefs({
      screensaverMode: 'slideshow',
      slideSeconds: '300',
      slideshowShuffle: false,
      photoFit: 'contain',
      photoDimLevel: 0,
      photoClock: false,
    })).toMatchObject({
      screensaverMode: 'slideshow',
      slideSeconds: 300,
      slideshowShuffle: false,
      photoFit: 'contain',
      photoDimLevel: 0,
      photoClock: false,
    });
  });

  it('keeps an image link, a media image and a media folder, and drops anything else', () => {
    expect(normalizeWallTabletPrefs({
      screensaverImage: '  /local/photo.jpg ',
      screensaverImageName: ' Hallway ',
      slideshowFolder: 'media-source://media_source/local/photos',
      slideshowFolderName: ' My media / photos ',
    })).toMatchObject({
      screensaverImage: '/local/photo.jpg',
      screensaverImageName: 'Hallway',
      slideshowFolder: 'media-source://media_source/local/photos',
      slideshowFolderName: 'My media / photos',
    });

    // A folder has to be a Home Assistant media id; names without a source are dropped.
    expect(normalizeWallTabletPrefs({
      screensaverImage: 'javascript:alert(1)',
      screensaverImageName: 'Photo',
      slideshowFolder: '/local/photos',
      slideshowFolderName: 'photos',
    })).toMatchObject({
      screensaverImage: '',
      screensaverImageName: '',
      slideshowFolder: '',
      slideshowFolderName: '',
    });
  });
});

describe('screensaver image links', () => {
  it('accepts paths, http(s) addresses and media ids', () => {
    expect(sanitizeImageLink('/local/photo.jpg')).toBe('/local/photo.jpg');
    expect(sanitizeImageLink('https://example.com/a.png?size=2')).toBe('https://example.com/a.png?size=2');
    expect(sanitizeImageLink('HTTP://example.com/a.png')).toBe('HTTP://example.com/a.png');
    expect(sanitizeImageLink('media-source://image_upload/abc')).toBe('media-source://image_upload/abc');
  });

  it('rejects everything else', () => {
    expect(sanitizeImageLink('')).toBe('');
    expect(sanitizeImageLink(undefined)).toBe('');
    expect(sanitizeImageLink(42)).toBe('');
    expect(sanitizeImageLink('photo.jpg')).toBe('');
    expect(sanitizeImageLink('//example.com/photo.jpg')).toBe('');
    expect(sanitizeImageLink('javascript:alert(1)')).toBe('');
    expect(sanitizeImageLink('data:image/png;base64,AAAA')).toBe('');
    expect(sanitizeImageLink('/local/my photo.jpg')).toBe('');
    expect(sanitizeImageLink('media-source://')).toBe('');
  });

  it('tells media ids from links', () => {
    expect(isMediaSourceId('media-source://media_source/local/a.jpg')).toBe(true);
    expect(isMediaSourceId('/local/a.jpg')).toBe(false);
    expect(isMediaSourceId(null)).toBe(false);
  });
});

describe('what the screensaver shows', () => {
  it('shows the clock until an image or a folder is chosen', () => {
    expect(screensaverSource(DEFAULT_WALL_TABLET_PREFS)).toEqual({ kind: 'clock' });
    expect(screensaverSource({ screensaverMode: 'image', screensaverImage: '', slideshowFolder: 'media-source://a/b' }))
      .toEqual({ kind: 'clock' });
    expect(screensaverSource({ screensaverMode: 'slideshow', screensaverImage: '/local/a.jpg', slideshowFolder: '' }))
      .toEqual({ kind: 'clock' });
  });

  it('uses the image or the folder of the chosen mode', () => {
    const chosen = { screensaverImage: '/local/a.jpg', slideshowFolder: 'media-source://a/b' };
    expect(screensaverSource({ ...chosen, screensaverMode: 'image' })).toEqual({ kind: 'image', image: '/local/a.jpg' });
    expect(screensaverSource({ ...chosen, screensaverMode: 'slideshow' })).toEqual({ kind: 'slideshow', folder: 'media-source://a/b' });
    expect(screensaverSource({ ...chosen, screensaverMode: 'clock' })).toEqual({ kind: 'clock' });
  });
});

describe('wall tablet storage', () => {

  it('stores the preferences per dashboard url path', () => {
    const storage = memoryStorage();
    writeWallTabletPrefs('wall', { ...DEFAULT_WALL_TABLET_PREFS, enabled: true, screensaverMinutes: 2 }, storage);

    expect(JSON.parse(storage.data.get(wallTabletStorageKey('wall'))!)).toMatchObject({
      enabled: true,
      screensaverMinutes: 2,
    });
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(true);
    expect(readWallTabletPrefs('other', storage).enabled).toBe(false);
    expect(wallTabletStorageKey('')).toBe(wallTabletStorageKey('lovelace'));
  });

  it('reads storage once and serves later reads from memory', () => {
    const storage = memoryStorage({
      [wallTabletStorageKey('wall')]: JSON.stringify({ enabled: true }),
    });
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(true);

    storage.data.set(wallTabletStorageKey('wall'), JSON.stringify({ enabled: false }));
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(true);

    // Another tab wrote it: the storage event invalidates the cached value.
    invalidateWallTabletPrefs(wallTabletStorageKey('wall'));
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(false);
  });

  it('keeps earlier choices when the mode is turned on again', () => {
    const storage = memoryStorage();
    updateWallTabletPrefs('wall', { enabled: true, returnHomeMinutes: 0 }, storage);
    updateWallTabletPrefs('wall', { enabled: false }, storage);
    const prefs = updateWallTabletPrefs('wall', { enabled: true }, storage);
    expect(prefs).toMatchObject({ enabled: true, returnHomeMinutes: 0 });
  });

  it('keeps working when localStorage throws', () => {
    const storage = throwingStorage();
    expect(readWallTabletPrefs('wall', storage)).toEqual(DEFAULT_WALL_TABLET_PREFS);
    const prefs = updateWallTabletPrefs('wall', { enabled: true }, storage);
    expect(prefs.enabled).toBe(true);
    // Until reload the choice lives in memory.
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(true);
  });

  it('recognizes its own storage keys', () => {
    expect(isWallTabletStorageKey(wallTabletStorageKey('wall'))).toBe(true);
    expect(isWallTabletStorageKey('dd-next-mobile-entity-layout')).toBe(false);
    expect(isWallTabletStorageKey(null)).toBe(false);
  });
});

describe('dd_kiosk url parameter', () => {
  it('parses on and off values', () => {
    expect(parseWallTabletUrlParam('?dd_kiosk=1')).toBe(true);
    expect(parseWallTabletUrlParam('?dd_kiosk=true')).toBe(true);
    expect(parseWallTabletUrlParam('?dd_kiosk')).toBe(true);
    expect(parseWallTabletUrlParam('?dd_area=kitchen&dd_kiosk=0')).toBe(false);
    expect(parseWallTabletUrlParam('?dd_kiosk=off')).toBe(false);
  });

  it('ignores a missing or unknown value', () => {
    expect(parseWallTabletUrlParam('')).toBeNull();
    expect(parseWallTabletUrlParam('?dd_area=kitchen')).toBeNull();
    expect(parseWallTabletUrlParam('?dd_kiosk=maybe')).toBeNull();
  });

  it('removes only the dd_kiosk parameter from the url', () => {
    expect(removeWallTabletUrlParam('http://ha.local:8123/wall/home?dd_kiosk=1')).toBe('/wall/home');
    expect(removeWallTabletUrlParam('http://ha.local:8123/wall/home?dd_area=kitchen&dd_kiosk=0#top'))
      .toBe('/wall/home?dd_area=kitchen#top');
    expect(removeWallTabletUrlParam('http://ha.local:8123/wall/home?dd_area=kitchen')).toBeNull();
    expect(removeWallTabletUrlParam('not a url')).toBeNull();
  });

  it('stores the choice and cleans up the url while keeping the history state', () => {
    const storage = memoryStorage();
    const calls: Array<[unknown, string]> = [];
    const history = {
      state: { dialog: undefined, keep: true },
      replaceState(state: unknown, _unused: string, url?: string | URL | null) {
        calls.push([state, String(url)]);
      },
    };

    const handled = consumeWallTabletUrlParam(
      'wall',
      { href: 'http://ha.local/wall/devices?dd_kiosk=1', search: '?dd_kiosk=1' },
      history,
      storage
    );
    expect(handled).toBe(true);
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(true);
    expect(calls).toEqual([[history.state, '/wall/devices']]);

    consumeWallTabletUrlParam(
      'wall',
      { href: 'http://ha.local/wall/home?dd_kiosk=0', search: '?dd_kiosk=0' },
      history,
      storage
    );
    expect(readWallTabletPrefs('wall', storage).enabled).toBe(false);
  });

  it('does nothing without the parameter', () => {
    const storage = memoryStorage();
    const history = { state: null, replaceState: () => { throw new Error('not expected'); } };
    expect(consumeWallTabletUrlParam('wall', { href: 'http://ha.local/wall/home', search: '' }, history, storage))
      .toBe(false);
    expect(storage.data.size).toBe(0);
  });
});

describe('dashboard paths', () => {
  it('resolves the dashboard and view of a pathname', () => {
    expect(dashboardSegmentFromPath('/wall-tablet/home')).toBe('wall-tablet');
    expect(dashboardSegmentFromPath('/lovelace/0')).toBe('lovelace');
    expect(dashboardSegmentFromPath('/')).toBe('lovelace');
    expect(viewPathFromPath('/wall/devices')).toBe('devices');
    expect(viewPathFromPath('/wall')).toBe('');
  });

  it('knows the paths of the Home view', () => {
    expect(isHomeViewPath('')).toBe(true);
    expect(isHomeViewPath('home')).toBe(true);
    expect(isHomeViewPath('0')).toBe(true);
    expect(isHomeViewPath('devices')).toBe(false);
  });
});

describe('planIdleActions', () => {
  const none = { returnHome: false, screensaver: false };

  it('waits for the first action that is due', () => {
    expect(planIdleActions(0, { returnHomeMinutes: 5, screensaverMinutes: 2 }, none)).toEqual({
      returnHome: false,
      screensaver: false,
      nextCheckMs: 2 * MINUTE,
    });
    expect(planIdleActions(90_000, { returnHomeMinutes: 5, screensaverMinutes: 2 }, none).nextCheckMs).toBe(30_000);
  });

  it('runs actions that are due and schedules the rest', () => {
    const plan = planIdleActions(2 * MINUTE, { returnHomeMinutes: 5, screensaverMinutes: 2 }, none);
    expect(plan).toEqual({ returnHome: false, screensaver: true, nextCheckMs: 3 * MINUTE });

    const later = planIdleActions(5 * MINUTE, { returnHomeMinutes: 5, screensaverMinutes: 2 }, {
      returnHome: false,
      screensaver: true,
    });
    expect(later).toEqual({ returnHome: true, screensaver: false, nextCheckMs: null });
  });

  it('runs both actions when they are due at the same time', () => {
    expect(planIdleActions(5 * MINUTE + 10, { returnHomeMinutes: 5, screensaverMinutes: 5 }, none)).toEqual({
      returnHome: true,
      screensaver: true,
      nextCheckMs: null,
    });
  });

  it('needs no timer when both options are off or done', () => {
    expect(planIdleActions(10 * MINUTE, { returnHomeMinutes: 0, screensaverMinutes: 0 }, none).nextCheckMs).toBeNull();
    expect(planIdleActions(10 * MINUTE, { returnHomeMinutes: 1, screensaverMinutes: 2 }, {
      returnHome: true,
      screensaver: true,
    })).toEqual({ returnHome: false, screensaver: false, nextCheckMs: null });
  });

  it('treats a clock that went backwards as fresh activity', () => {
    expect(planIdleActions(-5000, { returnHomeMinutes: 1, screensaverMinutes: 0 }, none).nextCheckMs).toBe(MINUTE);
  });
});

describe('Home Assistant dialog history states', () => {
  it('detects an open dialog', () => {
    expect(isOpenDialogState({ dialog: 'ha-more-info-dialog', open: true })).toBe(true);
    expect(isOpenDialogState({ dialog: 'ha-more-info-dialog', dialogParams: {} })).toBe(true);
    expect(isOpenDialogState({ dialog: 'ha-more-info-dialog', open: false })).toBe(false);
    expect(isOpenDialogState(null)).toBe(false);
    expect(isOpenDialogState({ dialog: '' })).toBe(false);
  });

  it('keeps editor dialogs open because they can hold unsaved work', () => {
    expect(isEditingDialogState({ dialog: 'dwains-dashboard-next-card-editor-dialog', open: true })).toBe(true);
    expect(isEditingDialogState({ dialog: 'dwains-dashboard-next-blueprint-dialog', open: true })).toBe(true);
    expect(isEditingDialogState({ dialog: 'ha-more-info-dialog', open: true })).toBe(false);
    expect(isEditingDialogState({ dialog: 'dwains-dashboard-next-card-editor-dialog', open: false })).toBe(false);
  });
});

describe('screensaver burn-in protection', () => {
  it('keeps the clock inside the screen', () => {
    expect(burnInRange(1000, 600, 24)).toBe(176);
    expect(burnInRange(400, 600, 24)).toBe(0);
    expect(burnInRange(Number.NaN, 600, 24)).toBe(0);
  });

  it('starts in the center and stays within the range', () => {
    expect(burnInOffset(0, 200, 100)).toEqual({ x: 0, y: 0 });
    for (let step = 0; step < 500; step++) {
      const { x, y } = burnInOffset(step, 200, 100);
      expect(Math.abs(x)).toBeLessThanOrEqual(200);
      expect(Math.abs(y)).toBeLessThanOrEqual(100);
    }
  });

  it('moves to a clearly different spot every minute', () => {
    for (let step = 0; step < 120; step++) {
      const current = burnInOffset(step, 200, 100);
      const next = burnInOffset(step + 1, 200, 100);
      const distance = Math.hypot(next.x - current.x, next.y - current.y);
      expect(distance).toBeGreaterThan(40);
    }
  });

  it('is deterministic and stays put without room to move', () => {
    expect(burnInOffset(7, 200, 100)).toEqual(burnInOffset(7, 200, 100));
    expect(burnInOffset(7, 0, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe('formatLongDate', () => {
  // 30 September 2026, 23:30 UTC: already 1 October in Amsterdam.
  const NOW = new Date(Date.UTC(2026, 8, 30, 23, 30));

  it('follows the language and the server time zone setting', () => {
    const expected = new Intl.DateTimeFormat('nl', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Amsterdam',
    }).format(NOW);
    expect(formatLongDate(NOW, { language: 'nl', time_zone: 'server' }, 'Europe/Amsterdam')).toBe(expected);
    expect(expected.toLowerCase()).toContain('oktober');
  });
});
