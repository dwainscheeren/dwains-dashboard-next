// Wall tablet mode belongs to one device (browser), not to the dashboard: the
// dashboard configuration is shared by every device that opens it. The
// preferences are therefore kept in localStorage, per dashboard url path, and
// never go through the dashboard config save path.

export const WALL_TABLET_MINUTE_OPTIONS = [0, 1, 2, 5, 10, 30] as const;
export const WALL_TABLET_DIM_OPTIONS = [60, 80, 95] as const;
/** What the screensaver shows: only the clock, one image or a slideshow of photos. */
export const WALL_TABLET_SCREENSAVER_MODES = ['clock', 'image', 'slideshow'] as const;
export type WallTabletScreensaverMode = (typeof WALL_TABLET_SCREENSAVER_MODES)[number];
/** Seconds a photo of the slideshow stays on screen. */
export const WALL_TABLET_SLIDE_SECONDS_OPTIONS = [10, 30, 60, 300, 900] as const;
/** Darkness of the photos, in percent. */
export const WALL_TABLET_PHOTO_DIM_OPTIONS = [0, 20, 40, 60] as const;
/** `cover` fills the screen and may cut off the edges, `contain` shows the whole photo. */
export const WALL_TABLET_PHOTO_FITS = ['cover', 'contain'] as const;
export type WallTabletPhotoFit = (typeof WALL_TABLET_PHOTO_FITS)[number];
/** Home Assistant media ids start with this, for example `media-source://media_source/local/photos`. */
export const MEDIA_SOURCE_PREFIX = 'media-source://';
/** `?dd_kiosk=1` turns the mode on for this device, `?dd_kiosk=0` turns it off. */
export const WALL_TABLET_URL_PARAM = 'dd_kiosk';
/**
 * Elements with this attribute open the wall tablet menu when pressed and held
 * (the header clock and the greeting on Home).
 */
export const WALL_TABLET_HOLD_ATTRIBUTE = 'data-dd-wall-tablet-hold';
export const WALL_TABLET_HOLD_MS = 3000;
/** Fired on window when the preferences or the session state change. */
export const WALL_TABLET_CHANGED_EVENT = 'dwains-dashboard-next-wall-tablet-changed';
/**
 * Fired on window, cancelable, when the tablet returns to Home after
 * inactivity. A view with unsaved changes cancels it to keep them.
 */
export const WALL_TABLET_RESET_EVENT = 'dwains-dashboard-next-wall-tablet-reset';
/** Fired on window by the settings page to show the screensaver right away. */
export const WALL_TABLET_PREVIEW_EVENT = 'dwains-dashboard-next-wall-tablet-preview';

const STORAGE_PREFIX = 'dd-next-wall-tablet:';
const MINUTE_MS = 60_000;

export interface WallTabletPrefs {
  enabled: boolean;
  /** Minutes without input before returning to Home; 0 is off. */
  returnHomeMinutes: number;
  /** Minutes without input before the screensaver shows; 0 is off. */
  screensaverMinutes: number;
  /** Darkness of the screensaver, in percent. */
  dimLevel: number;
  screensaverMode: WallTabletScreensaverMode;
  /** The image of the `image` mode: a link, or a Home Assistant media id. */
  screensaverImage: string;
  /** Name of that image when it was chosen from the Home Assistant media. */
  screensaverImageName: string;
  /** The Home Assistant media folder of the `slideshow` mode. */
  slideshowFolder: string;
  slideshowFolderName: string;
  /** Seconds each photo of the slideshow stays on screen. */
  slideSeconds: number;
  slideshowShuffle: boolean;
  photoFit: WallTabletPhotoFit;
  /** Darkness of the photos, in percent. */
  photoDimLevel: number;
  /** Show the clock, date and weather on the photos. */
  photoClock: boolean;
}

export const DEFAULT_WALL_TABLET_PREFS: Readonly<WallTabletPrefs> = Object.freeze({
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

const MAX_LINK_LENGTH = 2000;
const MAX_NAME_LENGTH = 200;

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

/** The dashboard url path of a pathname, like the rest of the dashboard resolves it. */
export function dashboardSegmentFromPath(pathname: string): string {
  const segment = pathname.split('/')[1];
  return segment && segment !== 'lovelace' ? segment : 'lovelace';
}

/** The view path of a pathname: `/dashboard/devices` gives `devices`. */
export function viewPathFromPath(pathname: string): string {
  return pathname.split('/')[2] || '';
}

/** Whether a view path is the Home view of the dashboard. */
export function isHomeViewPath(path: string): boolean {
  return !path || path === 'home' || path === '0' || path === 'overview';
}

export function wallTabletStorageKey(dashSegment: string): string {
  return `${STORAGE_PREFIX}${dashSegment || 'lovelace'}`;
}

export function isWallTabletStorageKey(key: string | null | undefined): boolean {
  return typeof key === 'string' && key.startsWith(STORAGE_PREFIX);
}

function pickOption(value: unknown, options: readonly number[], fallback: number): number {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof number === 'number' && options.includes(number) ? number : fallback;
}

function pickName<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && (options as readonly string[]).includes(value) ? value as T : fallback;
}

function pickText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function isMediaSourceId(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(MEDIA_SOURCE_PREFIX) && value.length > MEDIA_SOURCE_PREFIX.length;
}

/**
 * An image link that may be shown: a Home Assistant media id, a path on this
 * Home Assistant (`/local/photo.jpg`) or an http(s) address. Anything else
 * gives an empty string.
 */
export function sanitizeImageLink(value: unknown): string {
  const link = pickText(value, MAX_LINK_LENGTH);
  if (!link) return '';
  if (isMediaSourceId(link)) return link;
  if (/^https?:\/\/[^\s]+$/i.test(link)) return link;
  // A path, but not a protocol-relative address (`//host/photo.jpg`).
  if (/^\/(?!\/)[^\s]*$/.test(link)) return link;
  return '';
}

/** Preferences with every unknown or invalid value replaced by its default. */
export function normalizeWallTabletPrefs(value: unknown): WallTabletPrefs {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const defaults = DEFAULT_WALL_TABLET_PREFS;
  const screensaverImage = sanitizeImageLink(record.screensaverImage);
  const slideshowFolder = isMediaSourceId(record.slideshowFolder) ? pickText(record.slideshowFolder, MAX_LINK_LENGTH) : '';
  return {
    enabled: record.enabled === true,
    returnHomeMinutes: pickOption(record.returnHomeMinutes, WALL_TABLET_MINUTE_OPTIONS, defaults.returnHomeMinutes),
    screensaverMinutes: pickOption(record.screensaverMinutes, WALL_TABLET_MINUTE_OPTIONS, defaults.screensaverMinutes),
    dimLevel: pickOption(record.dimLevel, WALL_TABLET_DIM_OPTIONS, defaults.dimLevel),
    screensaverMode: pickName(record.screensaverMode, WALL_TABLET_SCREENSAVER_MODES, defaults.screensaverMode),
    screensaverImage,
    screensaverImageName: screensaverImage ? pickText(record.screensaverImageName, MAX_NAME_LENGTH) : '',
    slideshowFolder,
    slideshowFolderName: slideshowFolder ? pickText(record.slideshowFolderName, MAX_NAME_LENGTH) : '',
    slideSeconds: pickOption(record.slideSeconds, WALL_TABLET_SLIDE_SECONDS_OPTIONS, defaults.slideSeconds),
    slideshowShuffle: record.slideshowShuffle !== false,
    photoFit: pickName(record.photoFit, WALL_TABLET_PHOTO_FITS, defaults.photoFit),
    photoDimLevel: pickOption(record.photoDimLevel, WALL_TABLET_PHOTO_DIM_OPTIONS, defaults.photoDimLevel),
    photoClock: record.photoClock !== false,
  };
}

export type ScreensaverSource =
  | { kind: 'clock' }
  | { kind: 'image'; image: string }
  | { kind: 'slideshow'; folder: string };

/**
 * What the screensaver shows for these preferences. The image and slideshow
 * modes fall back to the clock until an image or a folder is chosen.
 */
export function screensaverSource(
  prefs: Pick<WallTabletPrefs, 'screensaverMode' | 'screensaverImage' | 'slideshowFolder'>
): ScreensaverSource {
  if (prefs.screensaverMode === 'image' && prefs.screensaverImage) {
    return { kind: 'image', image: prefs.screensaverImage };
  }
  if (prefs.screensaverMode === 'slideshow' && prefs.slideshowFolder) {
    return { kind: 'slideshow', folder: prefs.slideshowFolder };
  }
  return { kind: 'clock' };
}

export function parseWallTabletPrefs(raw: string | null | undefined): WallTabletPrefs {
  if (!raw) return { ...DEFAULT_WALL_TABLET_PREFS };
  try {
    return normalizeWallTabletPrefs(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_WALL_TABLET_PREFS };
  }
}

/**
 * The value of `?dd_kiosk`: `true` to turn the mode on (1, true, on, yes or no
 * value), `false` to turn it off (0, false, off, no), `null` when the parameter
 * is missing or has another value.
 */
export function parseWallTabletUrlParam(search: string): boolean | null {
  let value: string | null;
  try {
    value = new URLSearchParams(search).get(WALL_TABLET_URL_PARAM);
  } catch {
    return null;
  }
  if (value === null) return null;
  const normalized = value.trim().toLowerCase();
  if (['', '1', 'true', 'on', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'off', 'no'].includes(normalized)) return false;
  return null;
}

/**
 * The url (path, query and hash) without the `dd_kiosk` parameter, or `null`
 * when the url has no such parameter.
 */
export function removeWallTabletUrlParam(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!url.searchParams.has(WALL_TABLET_URL_PARAM)) return null;
  url.searchParams.delete(WALL_TABLET_URL_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

// ---- Stored preferences -----------------------------------------------------
// Read on every hass update by the shell sync, so they are cached in memory and
// only read from localStorage once per dashboard (or after another tab wrote
// them, see invalidateWallTabletPrefs).

const cache = new Map<string, Readonly<WallTabletPrefs>>();

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    // Access can throw in private or restricted contexts.
    return undefined;
  }
}

function notifyChanged(dashSegment: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(WALL_TABLET_CHANGED_EVENT, { detail: { dashSegment } }));
}

export function readWallTabletPrefs(
  dashSegment: string,
  storage: StorageLike | undefined = browserStorage()
): Readonly<WallTabletPrefs> {
  const key = wallTabletStorageKey(dashSegment);
  const cached = cache.get(key);
  if (cached) return cached;

  let raw: string | null = null;
  try {
    raw = storage?.getItem(key) ?? null;
  } catch {
    raw = null;
  }
  const prefs = Object.freeze(parseWallTabletPrefs(raw));
  cache.set(key, prefs);
  return prefs;
}

/** Store new preferences for this device; they apply right away. */
export function writeWallTabletPrefs(
  dashSegment: string,
  prefs: WallTabletPrefs,
  storage: StorageLike | undefined = browserStorage()
): Readonly<WallTabletPrefs> {
  const key = wallTabletStorageKey(dashSegment);
  const next = Object.freeze(normalizeWallTabletPrefs(prefs));
  cache.set(key, next);
  try {
    storage?.setItem(key, JSON.stringify(next));
  } catch {
    // Without storage the choice lasts until the page is reloaded.
  }
  notifyChanged(dashSegment);
  return next;
}

export function updateWallTabletPrefs(
  dashSegment: string,
  patch: Partial<WallTabletPrefs>,
  storage: StorageLike | undefined = browserStorage()
): Readonly<WallTabletPrefs> {
  return writeWallTabletPrefs(dashSegment, { ...readWallTabletPrefs(dashSegment, storage), ...patch }, storage);
}

export function isWallTabletEnabled(dashSegment: string): boolean {
  return readWallTabletPrefs(dashSegment).enabled;
}

/** Forget cached preferences, for example after another tab changed them. */
export function invalidateWallTabletPrefs(storageKey?: string | null): void {
  if (storageKey) cache.delete(storageKey);
  else cache.clear();
}

/**
 * Apply `?dd_kiosk=1` or `?dd_kiosk=0` from the current url to this device and
 * remove the parameter from the url. Returns true when the url had one.
 */
export function consumeWallTabletUrlParam(
  dashSegment: string,
  location: Pick<Location, 'href' | 'search'>,
  history: Pick<History, 'replaceState' | 'state'>,
  storage: StorageLike | undefined = browserStorage()
): boolean {
  const enabled = parseWallTabletUrlParam(location.search);
  if (enabled === null) return false;

  // Remove the parameter first: storing fires a change event that reads the url again.
  const next = removeWallTabletUrlParam(location.href);
  if (next !== null) {
    try {
      history.replaceState(history.state, '', next);
    } catch {
      // Keep the parameter; storing below still applies it.
    }
  }
  updateWallTabletPrefs(dashSegment, { enabled }, storage);
  return true;
}

// ---- Session state ----------------------------------------------------------
// "Open Home Assistant menu" from the wall tablet menu shows the Home Assistant
// sidebar again until the tablet returns to Home or the dashboard is left.

let haMenuPeek = false;

export function wallTabletHaMenuPeek(): boolean {
  return haMenuPeek;
}

export function setWallTabletHaMenuPeek(peek: boolean, dashSegment: string): void {
  if (haMenuPeek === peek) return;
  haMenuPeek = peek;
  notifyChanged(dashSegment);
}

// ---- Inactivity ---------------------------------------------------------------

export interface IdleActionsDone {
  returnHome: boolean;
  screensaver: boolean;
}

export interface IdlePlan {
  /** Return to Home now. */
  returnHome: boolean;
  /** Show the screensaver now. */
  screensaver: boolean;
  /** Milliseconds until the next action is due, `null` when none is left. */
  nextCheckMs: number | null;
}

/**
 * Which inactivity actions are due after `idleMs` without input, and when the
 * next one is. Actions that already ran since the last input are skipped.
 */
export function planIdleActions(
  idleMs: number,
  prefs: Pick<WallTabletPrefs, 'returnHomeMinutes' | 'screensaverMinutes'>,
  done: IdleActionsDone
): IdlePlan {
  const plan: IdlePlan = { returnHome: false, screensaver: false, nextCheckMs: null };
  const consider = (minutes: number, alreadyDone: boolean, key: 'returnHome' | 'screensaver') => {
    if (minutes <= 0 || alreadyDone) return;
    const remaining = minutes * MINUTE_MS - Math.max(0, idleMs);
    if (remaining <= 0) {
      plan[key] = true;
    } else if (plan.nextCheckMs === null || remaining < plan.nextCheckMs) {
      plan.nextCheckMs = remaining;
    }
  };
  consider(prefs.returnHomeMinutes, done.returnHome, 'returnHome');
  consider(prefs.screensaverMinutes, done.screensaver, 'screensaver');
  return plan;
}

// ---- Home Assistant dialogs -------------------------------------------------
// Home Assistant's dialog manager pushes a history entry `{ dialog, open: true }`
// for an open dialog and closes it again on history.back().

function dialogState(state: unknown): { dialog: string; open?: unknown } | undefined {
  if (!state || typeof state !== 'object') return undefined;
  const dialog = (state as { dialog?: unknown }).dialog;
  return typeof dialog === 'string' && dialog ? state as { dialog: string; open?: unknown } : undefined;
}

/** Whether a history state belongs to an open Home Assistant dialog. */
export function isOpenDialogState(state: unknown): boolean {
  const entry = dialogState(state);
  return Boolean(entry && entry.open !== false);
}

/**
 * Whether the open dialog edits something (a card editor or a blueprint
 * dialog). Closing it could throw away work, so the tablet then stays put.
 */
export function isEditingDialogState(state: unknown): boolean {
  if (!isOpenDialogState(state)) return false;
  const tag = dialogState(state)!.dialog.toLowerCase();
  return tag.includes('edit') || tag.includes('blueprint') || tag.includes('replacement');
}

// ---- Screensaver burn-in protection -----------------------------------------

/** How far the clock may move from the center along one axis, in pixels. */
export function burnInRange(viewport: number, box: number, margin: number): number {
  if (!Number.isFinite(viewport) || !Number.isFinite(box)) return 0;
  return Math.max(0, Math.floor((viewport - box) / 2 - Math.max(0, margin)));
}

const fraction = (value: number) => value - Math.floor(value);

/**
 * Offset of the clock from the center for one minute of the screensaver. Step 0
 * is the center; every next step jumps to a far away spot (a low-discrepancy
 * sequence), so no pixel stays lit for long and the whole range gets used.
 */
export function burnInOffset(step: number, rangeX: number, rangeY: number): { x: number; y: number } {
  const safeStep = Number.isFinite(step) ? Math.max(0, Math.floor(step)) : 0;
  const unitX = fraction(0.5 + safeStep * 0.6180339887) * 2 - 1;
  const unitY = fraction(0.5 + safeStep * 0.7548776662) * 2 - 1;
  const x = Math.round(unitX * Math.max(0, rangeX));
  const y = Math.round(unitY * Math.max(0, rangeY));
  // Avoid -0, which reads oddly in styles and tests.
  return { x: x || 0, y: y || 0 };
}
