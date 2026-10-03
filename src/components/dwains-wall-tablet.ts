import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { mdiClose, mdiCogOutline, mdiExitToApp, mdiMenu, mdiMenuOpen, mdiTabletDashboard } from '@mdi/js';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardSettings } from '../types/strategy';
import { formatClock, formatLongDate, msUntilNextMinute, type ClockSettings } from '../utils/clock';
import { ddLocale, ddLocalize } from '../utils/localize';
import { navigateHomeAssistant } from '../utils/navigation';
import { restrictNonAdminDashboardSettings, restrictNonAdminHaSidebar } from '../utils/security';
import { getDomainStates } from '../utils/state-index';
import { getEntityRegistry } from '../utils/entity-registry';
import { formatValueWithUnit } from '../utils/unit-format';
import { getWeatherIcon } from '../utils/weather';
import {
  browseMedia,
  collectSlideshowImages,
  createSlidePlaylist,
  resolveImageUrl,
} from '../utils/screensaver-media';
import {
  DEFAULT_WALL_TABLET_PREFS,
  WALL_TABLET_CHANGED_EVENT,
  WALL_TABLET_HOLD_ATTRIBUTE,
  WALL_TABLET_HOLD_MS,
  WALL_TABLET_PREVIEW_EVENT,
  WALL_TABLET_RESET_EVENT,
  WALL_TABLET_URL_PARAM,
  burnInOffset,
  burnInRange,
  consumeWallTabletUrlParam,
  dashboardSegmentFromPath,
  invalidateWallTabletPrefs,
  isEditingDialogState,
  isHomeViewPath,
  isOpenDialogState,
  isWallTabletStorageKey,
  planIdleActions,
  readWallTabletPrefs,
  screensaverSource,
  setWallTabletHaMenuPeek,
  updateWallTabletPrefs,
  viewPathFromPath,
  wallTabletHaMenuPeek,
  type WallTabletPrefs,
} from '../utils/wall-tablet';

// Input that counts as activity. All listeners are passive and only store a
// timestamp, so even a stream of pointermove events costs next to nothing.
const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'keydown', 'wheel', 'touchstart'] as const;
const PASSIVE_CAPTURE: AddEventListenerOptions = { passive: true, capture: true };
const HOLD_MOVE_TOLERANCE_PX = 12;
/** Keep the waking screensaver in place until the tap's click has landed on it. */
const WAKE_RELEASE_MS = 400;
const SCREENSAVER_MARGIN_PX = 24;
/** How far the clock in the corner of a photo moves against burn-in. */
const CORNER_SHIFT_PX = 14;
/** Crossfade between two photos; keep in step with the .ss-photo transition. */
const PHOTO_FADE_SECONDS = 1.6;
/** Read the folder again after this long, so new photos show up. */
const PLAYLIST_MAX_AGE_MS = 30 * 60_000;
/** Give up on a photo that takes longer than this to load. */
const PHOTO_LOAD_TIMEOUT_MS = 30_000;
/** Wait this long before trying the next photo after one failed. */
const PHOTO_RETRY_MS = 5000;
const CLOCK_TICK_MARGIN_MS = 50;
/** Ignore a click on the menu backdrop right after a long press opened the menu. */
const MENU_GUARD_MS = 400;
/** Below this width Home Assistant shows its sidebar as a drawer that has to be opened. */
const HA_NARROW_QUERY = '(max-width: 870px)';
const DIALOG_CLOSE_TIMEOUT_MS = 500;
const MAX_DIALOG_CLOSE_STEPS = 5;
/** The Home view can still be connecting after navigating to it, so the reset is sent again. */
const RESET_RETRY_DELAYS_MS = [150, 450];

/** One of the two stacked photo layers that fade into each other. */
interface PhotoLayer {
  url: string;
  /** Counts the photos this layer has shown; restarts its slow zoom. */
  loads: number;
}

/** Load an image before it is shown, so the crossfade never shows half a photo. */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => {
      image.src = '';
      reject(new Error('timeout'));
    }, PHOTO_LOAD_TIMEOUT_MS);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error('load failed'));
    };
    image.decoding = 'async';
    image.src = url;
  });
}

interface PendingHold {
  pointerId: number;
  x: number;
  y: number;
  timer: number;
}

function hasHoldAnchor(path: EventTarget[]): boolean {
  for (const node of path) {
    if (node instanceof Element && node.hasAttribute(WALL_TABLET_HOLD_ATTRIBUTE)) return true;
  }
  return false;
}

/** Close open Home Assistant dialogs the way the user would: with history.back(). */
async function closeOpenDialogs(): Promise<void> {
  for (let step = 0; step < MAX_DIALOG_CLOSE_STEPS && isOpenDialogState(window.history.state); step++) {
    await new Promise<void>((resolve) => {
      let timer = 0;
      const done = () => {
        window.removeEventListener('popstate', done);
        window.clearTimeout(timer);
        resolve();
      };
      timer = window.setTimeout(done, DIALOG_CLOSE_TIMEOUT_MS);
      window.addEventListener('popstate', done);
      window.history.back();
    });
  }
}

/**
 * dwains-dashboard-next-wall-tablet: runs wall tablet mode for this device.
 * Lives in document.body next to the bottom navigation (see ensureWallTablet)
 * and only listens for input while the mode is on and the dashboard is shown.
 * Hiding the Home Assistant header and sidebar is done by the shell sync of
 * the bottom navigation, which reads the same preferences.
 */
@customElement('dwains-dashboard-next-wall-tablet')
export class DwainsWallTablet extends LitElement {
  public dashSegment = '';
  private _hass?: HomeAssistant;
  private _settings?: DwainsDashboardSettings;
  private _prefs: Readonly<WallTabletPrefs> = DEFAULT_WALL_TABLET_PREFS;
  private _active = false;
  private _lastActivity = 0;
  private _done = { returnHome: false, screensaver: false };
  private _idleTimer?: number;
  private _hold?: PendingHold;
  private _tickTimer?: number;
  private _wakeTimer?: number;
  private _burnInStep = 0;
  private _menuOpenedAt = 0;
  private _returningHome = false;
  private _consumingUrl = false;
  private _weatherState?: HassEntity;
  /** Changes whenever the photos are stopped; running photo work then gives up. */
  private _photoRun = 0;
  private _photoTimer?: number;
  private _playlistFolder = '';
  private _playlistImages: string[] = [];
  private _playlistLoadedAt = 0;

  @state() private _menuOpen = false;
  @state() private _screensaver = false;
  @state() private _waking = false;
  @state() private _time = '';
  @state() private _date = '';
  @state() private _offset = { x: 0, y: 0 };
  @state() private _photoLayers: [PhotoLayer, PhotoLayer] = [{ url: '', loads: 0 }, { url: '', loads: 0 }];
  @state() private _frontLayer = 0;
  @state() private _photoShown = false;
  /** The image or folder could not be shown: fall back to the clock. */
  @state() private _photoFailed = false;

  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    // Only the visible screensaver shows live data (the weather).
    if (!this._screensaver || !hass) return;
    if (old?.locale !== hass.locale || old?.language !== hass.language) {
      this._updateClock();
    }
    if (this._resolveWeather() !== this._weatherState) this.requestUpdate();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  /** Called by ensureWallTablet on every hass update: cheap checks only. */
  public sync(hass: HomeAssistant, settings: DwainsDashboardSettings | undefined, dashSegment: string): void {
    this.dashSegment = dashSegment;
    if (settings !== this._settings) {
      this._settings = settings;
      if (this._menuOpen || this._screensaver) this.requestUpdate();
    }
    this.hass = hass;
    this._refresh();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('location-changed', this._refresh);
    window.addEventListener('popstate', this._refresh);
    window.addEventListener(WALL_TABLET_CHANGED_EVENT, this._refresh);
    window.addEventListener(WALL_TABLET_PREVIEW_EVENT, this._handlePreview);
    window.addEventListener('storage', this._handleStorage);
    this._refresh();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('location-changed', this._refresh);
    window.removeEventListener('popstate', this._refresh);
    window.removeEventListener(WALL_TABLET_CHANGED_EVENT, this._refresh);
    window.removeEventListener(WALL_TABLET_PREVIEW_EVENT, this._handlePreview);
    window.removeEventListener('storage', this._handleStorage);
    this._stop();
  }

  /** "Show screensaver now" on the settings page; also works while the mode is off. */
  private _handlePreview = (): void => {
    if (!this._onDashboard()) return;
    this._prefs = readWallTabletPrefs(this.dashSegment);
    this._showScreensaver(true);
  };

  private _onDashboard(): boolean {
    return Boolean(this.dashSegment) && dashboardSegmentFromPath(window.location.pathname) === this.dashSegment;
  }

  /** Start or stop the mode when the preferences or the location changed. */
  private _refresh = (): void => {
    if (!this.dashSegment) return;
    const onDashboard = this._onDashboard();
    if (onDashboard && !this._consumingUrl && window.location.search.includes(WALL_TABLET_URL_PARAM)) {
      // Stores the choice and fires a change event that runs this again.
      this._consumingUrl = true;
      try {
        if (consumeWallTabletUrlParam(this.dashSegment, window.location, window.history)) return;
      } finally {
        this._consumingUrl = false;
      }
    }

    const prefs = readWallTabletPrefs(this.dashSegment);
    const prefsChanged = prefs !== this._prefs;
    this._prefs = prefs;
    const active = prefs.enabled && onDashboard;
    if (active !== this._active) {
      if (active) this._start();
      else this._stop();
    } else if (active && prefsChanged) {
      if (this._screensaver && prefs.screensaverMinutes === 0) this._hideScreensaver();
      if (this._screensaver) {
        this.requestUpdate();
        this._startPhotos();
      }
      this._checkIdle();
    }
  };

  private _handleStorage = (event: StorageEvent): void => {
    // Another tab of this browser changed the preferences.
    if (event.key !== null && !isWallTabletStorageKey(event.key)) return;
    invalidateWallTabletPrefs(event.key);
    this._refresh();
  };

  private _start(): void {
    this._active = true;
    this._lastActivity = Date.now();
    this._done.returnHome = false;
    this._done.screensaver = false;
    for (const type of ACTIVITY_EVENTS) window.addEventListener(type, this._handleActivity, PASSIVE_CAPTURE);
    // Not passive: a long press must not open the browser's context menu.
    window.addEventListener('contextmenu', this._handleContextMenu, true);
    document.addEventListener('visibilitychange', this._checkIdle);
    this._checkIdle();
  }

  private _stop(): void {
    const wasActive = this._active;
    this._active = false;
    for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, this._handleActivity, PASSIVE_CAPTURE);
    window.removeEventListener('contextmenu', this._handleContextMenu, true);
    document.removeEventListener('visibilitychange', this._checkIdle);
    this._clearIdleTimer();
    this._cancelHold();
    this._hideScreensaver();
    this._menuOpen = false;
    if (wasActive && this.dashSegment) setWallTabletHaMenuPeek(false, this.dashSegment);
  }

  // ---- Inactivity ---------------------------------------------------------

  private _handleActivity = (event: Event): void => {
    this._lastActivity = Date.now();
    if (this._done.returnHome || this._done.screensaver) {
      this._done.returnHome = false;
      this._done.screensaver = false;
    }
    // All actions ran and no timer is left: start counting again.
    if (this._idleTimer === undefined) this._checkIdle();

    switch (event.type) {
      case 'pointerdown':
        this._maybeStartHold(event as PointerEvent);
        break;
      case 'pointermove': {
        // Moving the mouse does not wake the screensaver: only a tap, click or
        // key does, and that first one never reaches the control below.
        const pointer = event as PointerEvent;
        if (this._hold?.pointerId === pointer.pointerId) this._cancelHoldWhenMoved(pointer);
        break;
      }
      case 'pointerup':
      case 'pointercancel':
        if (this._hold?.pointerId === (event as PointerEvent).pointerId) this._cancelHold();
        break;
      case 'wheel':
        if (this._screensaver) this._hideScreensaver();
        break;
      default:
        break;
    }
  };

  /** The single idle timer: run what is due and wait for the next action. */
  private _checkIdle = (): void => {
    this._clearIdleTimer();
    if (!this._active) return;
    const plan = planIdleActions(Date.now() - this._lastActivity, this._prefs, this._done);
    if (plan.returnHome) {
      this._done.returnHome = true;
      void this._returnHome();
    }
    if (plan.screensaver) {
      this._done.screensaver = true;
      this._showScreensaver();
    }
    if (plan.nextCheckMs !== null) {
      this._idleTimer = window.setTimeout(this._checkIdle, plan.nextCheckMs + 25);
    }
  };

  private _clearIdleTimer(): void {
    if (this._idleTimer !== undefined) {
      window.clearTimeout(this._idleTimer);
      this._idleTimer = undefined;
    }
  }

  private async _returnHome(): Promise<void> {
    if (this._returningHome) return;
    this._returningHome = true;
    const startedAt = this._lastActivity;
    try {
      this._menuOpen = false;
      // An open editor dialog can hold unsaved work: leave everything as it is.
      if (isEditingDialogState(window.history.state)) return;
      await closeOpenDialogs();
      if (!this._active || this._lastActivity !== startedAt) return;
      // A view with unsaved changes (dashboard settings) cancels the reset.
      if (!this._requestReset()) return;

      setWallTabletHaMenuPeek(false, this.dashSegment);
      if (!isHomeViewPath(viewPathFromPath(window.location.pathname))) {
        navigateHomeAssistant(`/${this.dashSegment}/home`);
        for (const delay of RESET_RETRY_DELAYS_MS) {
          window.setTimeout(() => {
            if (this._active && this._lastActivity === startedAt) this._requestReset();
          }, delay);
        }
      }
      window.scrollTo(0, 0);
    } finally {
      this._returningHome = false;
    }
  }

  private _requestReset(): boolean {
    const event = new CustomEvent(WALL_TABLET_RESET_EVENT, {
      cancelable: true,
      detail: { dashSegment: this.dashSegment },
    });
    window.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  // ---- Long press way out ---------------------------------------------------

  private _maybeStartHold(event: PointerEvent): void {
    if (this._hold || this._menuOpen || this._screensaver) return;
    if (event.button !== 0 || !event.isPrimary) return;
    if (!hasHoldAnchor(event.composedPath())) return;
    const timer = window.setTimeout(() => {
      this._hold = undefined;
      this._openMenu();
    }, WALL_TABLET_HOLD_MS);
    this._hold = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, timer };
  }

  private _cancelHoldWhenMoved(event: PointerEvent): void {
    const hold = this._hold;
    if (!hold) return;
    if (Math.abs(event.clientX - hold.x) > HOLD_MOVE_TOLERANCE_PX || Math.abs(event.clientY - hold.y) > HOLD_MOVE_TOLERANCE_PX) {
      this._cancelHold();
    }
  }

  private _cancelHold(): void {
    if (!this._hold) return;
    window.clearTimeout(this._hold.timer);
    this._hold = undefined;
  }

  private _handleContextMenu = (event: Event): void => {
    if (this._hold || this._screensaver) event.preventDefault();
  };

  // ---- Menu -------------------------------------------------------------------

  private _openMenu(): void {
    if (!this._active) return;
    this._menuOpen = true;
    this._menuOpenedAt = Date.now();
    try {
      navigator.vibrate?.(20);
    } catch {
      // Vibration is optional.
    }
  }

  private _closeMenu = (): void => {
    this._menuOpen = false;
  };

  private _handleBackdropClick = (): void => {
    if (Date.now() - this._menuOpenedAt < MENU_GUARD_MS) return;
    this._closeMenu();
  };

  private _handleMenuKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    // Keep keyboard focus inside the menu.
    const buttons = Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('.menu button'));
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = this.renderRoot instanceof ShadowRoot ? this.renderRoot.activeElement : null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  private _exitWallTablet = (): void => {
    this._menuOpen = false;
    updateWallTabletPrefs(this.dashSegment, { enabled: false });
  };

  private _toggleHaMenu = (): void => {
    this._menuOpen = false;
    if (wallTabletHaMenuPeek()) {
      setWallTabletHaMenuPeek(false, this.dashSegment);
      return;
    }
    // The bottom navigation shows the sidebar again on this change event.
    setWallTabletHaMenuPeek(true, this.dashSegment);
    if (!window.matchMedia(HA_NARROW_QUERY).matches) return;
    // On narrow screens the sidebar is a drawer: open it once it is back.
    window.setTimeout(() => {
      const main = document.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main');
      (main || document.querySelector('home-assistant'))?.dispatchEvent(
        new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true })
      );
    }, 50);
  };

  private _openSettings = (): void => {
    this._menuOpen = false;
    if (!isHomeViewPath(viewPathFromPath(window.location.pathname))) {
      navigateHomeAssistant(`/${this.dashSegment}/home`);
    }
    const open = () => window.dispatchEvent(new CustomEvent('dwains-dashboard-next-open-settings'));
    open();
    window.setTimeout(open, 90);
    window.setTimeout(open, 240);
  };

  // ---- Screensaver -----------------------------------------------------------

  private _clockSettings(): ClockSettings {
    return {
      language: ddLocale(this._hass),
      time_format: this._hass?.locale?.time_format,
      time_zone: this._hass?.locale?.time_zone,
    };
  }

  private _updateClock(): void {
    const now = new Date();
    const settings = this._clockSettings();
    const serverTimeZone = this._hass?.config?.time_zone;
    this._time = formatClock(now, settings, serverTimeZone).time;
    this._date = formatLongDate(now, settings, serverTimeZone);
  }

  private _showScreensaver(preview = false): void {
    if (this._screensaver || (!this._active && !preview)) return;
    this._menuOpen = false;
    this._cancelHold();
    this._burnInStep = 0;
    this._offset = { x: 0, y: 0 };
    this._waking = false;
    this._updateClock();
    this._screensaver = true;
    window.addEventListener('keydown', this._handleScreensaverKey, true);
    this._scheduleTick();
    this._startPhotos();
  }

  private _hideScreensaver = (): void => {
    if (this._tickTimer !== undefined) {
      window.clearTimeout(this._tickTimer);
      this._tickTimer = undefined;
    }
    if (this._wakeTimer !== undefined) {
      window.clearTimeout(this._wakeTimer);
      this._wakeTimer = undefined;
    }
    window.removeEventListener('keydown', this._handleScreensaverKey, true);
    this._stopPhotos();
    this._screensaver = false;
    this._waking = false;
    this._weatherState = undefined;
  };

  // ---- Screensaver photos -----------------------------------------------------

  private _startPhotos(): void {
    this._stopPhotos();
    const source = screensaverSource(this._prefs);
    if (source.kind === 'clock' || !this._hass) return;
    const run = this._photoRun;
    if (source.kind === 'image') void this._showImage(source.image, run);
    else void this._runSlideshow(source.folder, run);
  }

  private _stopPhotos(): void {
    this._photoRun += 1;
    if (this._photoTimer !== undefined) {
      window.clearTimeout(this._photoTimer);
      this._photoTimer = undefined;
    }
    if (this._photoShown || this._photoFailed || this._photoLayers.some((layer) => layer.url)) {
      this._photoLayers = [{ url: '', loads: 0 }, { url: '', loads: 0 }];
      this._frontLayer = 0;
      this._photoShown = false;
      this._photoFailed = false;
    }
  }

  private async _loadPhoto(image: string, run: number): Promise<boolean> {
    const hass = this._hass;
    if (!hass) return false;
    try {
      const url = await resolveImageUrl(hass, image);
      await preloadImage(url);
      if (run !== this._photoRun) return false;
      this._presentPhoto(url);
      return true;
    } catch {
      return false;
    }
  }

  /** Put a loaded photo on the hidden layer and fade to it. */
  private _presentPhoto(url: string): void {
    const target = this._photoShown ? 1 - this._frontLayer : this._frontLayer;
    const layers: [PhotoLayer, PhotoLayer] = [this._photoLayers[0], this._photoLayers[1]];
    layers[target] = { url, loads: layers[target]!.loads + 1 };
    this._photoLayers = layers;
    this._frontLayer = target;
    this._photoShown = true;
  }

  private async _showImage(image: string, run: number): Promise<void> {
    const shown = await this._loadPhoto(image, run);
    if (!shown && run === this._photoRun) this._photoFailed = true;
  }

  private async _runSlideshow(folder: string, run: number): Promise<void> {
    const hass = this._hass;
    if (!hass) return;
    const stale = folder !== this._playlistFolder ||
      !this._playlistImages.length ||
      Date.now() - this._playlistLoadedAt > PLAYLIST_MAX_AGE_MS;
    if (stale) {
      let images: string[] = [];
      try {
        images = await collectSlideshowImages((id) => browseMedia(hass, id), folder);
      } catch {
        images = [];
      }
      if (run !== this._photoRun) return;
      this._playlistFolder = folder;
      this._playlistImages = images;
      this._playlistLoadedAt = Date.now();
    }
    if (!this._playlistImages.length) {
      this._photoFailed = true;
      return;
    }

    const playlist = createSlidePlaylist(this._playlistImages, this._prefs.slideshowShuffle);
    const step = async (): Promise<void> => {
      if (run !== this._photoRun) return;
      const image = playlist.next();
      const shown = image ? await this._loadPhoto(image, run) : false;
      if (run !== this._photoRun) return;
      // A photo that fails (removed, no connection) is skipped after a short wait.
      const wait = shown ? this._prefs.slideSeconds * 1000 : PHOTO_RETRY_MS;
      this._photoTimer = window.setTimeout(() => void step(), wait);
    };
    void step();
  }

  /** Once a minute: update the clock and move it a little against burn-in. */
  private _scheduleTick(): void {
    this._tickTimer = window.setTimeout(() => {
      this._tickTimer = undefined;
      if (!this._screensaver) return;
      this._updateClock();
      this._moveClock();
      this._scheduleTick();
    }, msUntilNextMinute(Date.now()) + CLOCK_TICK_MARGIN_MS);
  }

  private _moveClock(): void {
    const content = this.renderRoot.querySelector<HTMLElement>('.ss-content');
    if (!content) return;
    this._burnInStep += 1;
    // In the corner of a photo the clock only shifts a little.
    const corner = content.classList.contains('corner');
    this._offset = burnInOffset(
      this._burnInStep,
      corner ? CORNER_SHIFT_PX : burnInRange(window.innerWidth, content.offsetWidth, SCREENSAVER_MARGIN_PX),
      corner ? CORNER_SHIFT_PX : burnInRange(window.innerHeight, content.offsetHeight, SCREENSAVER_MARGIN_PX)
    );
  }

  private _handleScreensaverKey = (event: KeyboardEvent): void => {
    // A key only wakes the screen; it must not also activate a control.
    event.preventDefault();
    event.stopPropagation();
    this._hideScreensaver();
  };

  private _handleOverlayPointerDown = (event: PointerEvent): void => {
    // The first tap only wakes the screen. The overlay stays in place (fading
    // out) until the click of this tap landed on it, not on a control below.
    event.preventDefault();
    event.stopPropagation();
    this._waking = true;
  };

  private _handleOverlayPointerUp = (): void => {
    if (this._wakeTimer !== undefined) window.clearTimeout(this._wakeTimer);
    this._wakeTimer = window.setTimeout(this._hideScreensaver, WAKE_RELEASE_MS);
  };

  private _handleOverlayClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this._hideScreensaver();
  };

  private _swallow = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  private _resolveWeather(): HassEntity | undefined {
    const hass = this._hass;
    if (!hass?.states || this._settings?.show_weather === false) return undefined;
    const chosenId = this._settings?.weather_entity_id;
    const chosen = chosenId ? hass.states[chosenId] : undefined;
    if (chosen) return chosen;
    const registry = getEntityRegistry(hass);
    return getDomainStates(hass.states, 'weather').find((state) => !registry[state.entity_id]?.hidden_by);
  }

  private _weatherTemperature(weather: HassEntity): string {
    const attributes = weather.attributes || {};
    const temperature = attributes.temperature ?? attributes.current_temperature ?? attributes.native_temperature;
    if (temperature === undefined || temperature === null || temperature === '') return '';
    const unit = attributes.temperature_unit || attributes.native_temperature_unit ||
      this._hass?.config?.unit_system?.temperature || '';
    return formatValueWithUnit(temperature, unit);
  }

  private _weatherCondition(weather: HassEntity): string {
    if (!weather.state || weather.state === 'unknown' || weather.state === 'unavailable') return '';
    try {
      const formatted = this._hass?.formatEntityState?.(weather);
      if (formatted && formatted !== weather.state) return formatted;
    } catch {
      // Fall back to the raw condition below.
    }
    return weather.state.replace(/[-_]/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase());
  }

  // ---- Rendering ----------------------------------------------------------------

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('_screensaver') && this._screensaver) {
      const overlay = this.renderRoot.querySelector<HTMLElement>('.screensaver');
      try {
        // The top layer puts it above open dialogs as well.
        overlay?.showPopover?.();
      } catch {
        // Without the Popover API the overlay still covers the page.
      }
    }
    if (changed.has('_menuOpen') && this._menuOpen) {
      this.renderRoot.querySelector<HTMLButtonElement>('.menu .menu-row')?.focus();
    }
  }

  protected render() {
    if (!this._menuOpen && !this._screensaver) return nothing;
    return html`
      ${this._menuOpen ? this._renderMenu() : nothing}
      ${this._screensaver ? this._renderScreensaver() : nothing}
    `;
  }

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this._hass, key, vars);
  }

  private _icon(path: string) {
    return html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${path}></path></svg>`;
  }

  private _renderMenuRow(icon: string, label: string, onClick: () => void, description?: string) {
    return html`
      <button class="menu-row" type="button" @click=${onClick}>
        <span class="menu-row-icon">${this._icon(icon)}</span>
        <span class="menu-row-copy">
          <span class="menu-row-label">${label}</span>
          ${description ? html`<span class="menu-row-description">${description}</span>` : nothing}
        </span>
      </button>
    `;
  }

  private _renderMenu() {
    const canOpenHaMenu = !restrictNonAdminHaSidebar(this._hass, this._settings);
    const canOpenSettings = !restrictNonAdminDashboardSettings(this._hass, this._settings);
    const peek = wallTabletHaMenuPeek();
    return html`
      <div class="menu-backdrop" @click=${this._handleBackdropClick}></div>
      <div
        class="menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dd-wall-tablet-menu-title"
        @keydown=${this._handleMenuKeydown}
      >
        <div class="menu-header">
          <span class="menu-header-icon">${this._icon(mdiTabletDashboard)}</span>
          <span class="menu-heading">
            <strong id="dd-wall-tablet-menu-title">${this._t('kiosk.title')}</strong>
            <small>${this._t('kiosk.menu_subtitle')}</small>
          </span>
          <button class="menu-close" type="button" aria-label=${this._t('common.close')} title=${this._t('common.close')} @click=${this._closeMenu}>
            ${this._icon(mdiClose)}
          </button>
        </div>
        <div class="menu-list">
          ${canOpenHaMenu
            ? this._renderMenuRow(
                peek ? mdiMenuOpen : mdiMenu,
                this._t(peek ? 'kiosk.menu_hide_ha_menu' : 'kiosk.menu_open_ha_menu'),
                this._toggleHaMenu
              )
            : nothing}
          ${canOpenSettings
            ? this._renderMenuRow(mdiCogOutline, this._t('sidebar.dashboard_settings'), this._openSettings)
            : nothing}
          ${this._renderMenuRow(mdiExitToApp, this._t('kiosk.menu_exit'), this._exitWallTablet, this._t('kiosk.menu_exit_description'))}
        </div>
      </div>
    `;
  }

  private _renderScreensaver() {
    const prefs = this._prefs;
    const source = screensaverSource(prefs);
    // Photo layout: the photo fills the screen and the clock sits in a corner.
    const photoLayout = source.kind !== 'clock' && !this._photoFailed;
    const showClock = !photoLayout || prefs.photoClock;
    const weather = showClock ? this._resolveWeather() : undefined;
    this._weatherState = weather;
    const temperature = weather ? this._weatherTemperature(weather) : '';
    const condition = weather && temperature ? this._weatherCondition(weather) : '';
    const classes = [
      'screensaver',
      this._waking ? 'waking' : '',
      photoLayout ? 'photo-layout' : '',
      photoLayout && this._photoShown ? 'has-photo' : '',
      photoLayout && prefs.photoFit === 'contain' ? 'fit-contain' : '',
      source.kind === 'image' ? 'is-still' : '',
    ].filter(Boolean).join(' ');
    const slideSeconds = prefs.slideSeconds + PHOTO_FADE_SECONDS;
    return html`
      <div
        class=${classes}
        popover="manual"
        role="button"
        tabindex="-1"
        aria-label=${this._t('kiosk.screensaver_wake')}
        data-dim=${photoLayout ? nothing : String(prefs.dimLevel)}
        style=${`--dd-wall-tablet-dim: ${prefs.dimLevel / 100}; --dd-wall-tablet-photo-dim: ${prefs.photoDimLevel / 100}; --dd-wall-tablet-slide: ${slideSeconds}s;`}
        @pointerdown=${this._handleOverlayPointerDown}
        @pointerup=${this._handleOverlayPointerUp}
        @pointercancel=${this._handleOverlayPointerUp}
        @click=${this._handleOverlayClick}
        @contextmenu=${this._swallow}
      >
        ${photoLayout ? html`
          <div class="ss-photos" aria-hidden="true">
            ${this._photoLayers.map((layer, index) => layer.url ? html`
              <img
                class="ss-photo zoom-${layer.loads % 2} ${index === this._frontLayer ? 'is-front' : ''}"
                src=${layer.url}
                alt=""
                draggable="false"
              />
            ` : nothing)}
          </div>
          <div class="ss-shade ${showClock ? 'with-clock' : ''}" aria-hidden="true"></div>
        ` : nothing}
        ${showClock ? html`
          <div
            class="ss-content ${photoLayout ? 'corner' : ''}"
            style=${`transform: translate3d(${this._offset.x}px, ${this._offset.y}px, 0);`}
          >
            <div class="ss-time">${this._time}</div>
            <div class="ss-date">${this._date}</div>
            ${weather && temperature ? html`
              <div class="ss-weather">
                <ha-icon icon=${getWeatherIcon(weather.state)}></ha-icon>
                <span class="ss-temperature">${temperature}</span>
                ${condition ? html`<span class="ss-condition">${condition}</span>` : nothing}
              </div>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      width: 0;
      height: 0;
      overflow: visible;
      -webkit-tap-highlight-color: transparent;
    }

    .icon {
      width: 22px;
      height: 22px;
      fill: currentColor;
      flex: 0 0 auto;
    }

    /* ---- Menu ---- */
    .menu-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.32);
    }

    .menu {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 1001;
      box-sizing: border-box;
      width: min(360px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      transform: translate(-50%, -50%);
      padding: 8px;
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
      font-family: var(--ha-font-family-body, Roboto, sans-serif);
    }

    .menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 4px 12px 8px;
    }

    .menu-header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      flex: 0 0 auto;
    }

    .menu-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .menu-heading strong {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    .menu-heading small,
    .menu-row-description {
      font-size: 13px;
      line-height: 1.3;
      color: var(--secondary-text-color, #727272);
    }

    .menu-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color, #727272);
      cursor: pointer;
      flex: 0 0 auto;
    }

    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .menu-row {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      min-height: 52px;
      padding: 8px 12px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      touch-action: manipulation;
    }

    .menu-row:hover,
    .menu-close:hover {
      background: color-mix(in srgb, var(--primary-text-color, #212121) 6%, transparent);
    }

    .menu-row:focus-visible,
    .menu-close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }

    .menu-row-icon {
      display: inline-flex;
      color: var(--secondary-text-color, #727272);
    }

    .menu-row-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .menu-row-label {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.3;
    }

    /* ---- Screensaver ---- */
    .screensaver {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: 0;
      overflow: hidden;
      background: rgba(0, 0, 0, var(--dd-wall-tablet-dim, 0.8));
      color: rgba(255, 255, 255, 0.9);
      font-family: var(--ha-font-family-body, Roboto, sans-serif);
      cursor: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      touch-action: none;
      animation: dd-wall-tablet-fade-in 1.2s ease backwards;
      transition: opacity 0.25s ease;
    }

    .screensaver::backdrop {
      background: transparent;
    }

    .screensaver[data-dim='95'] {
      color: rgba(255, 255, 255, 0.62);
    }

    .screensaver.waking {
      animation: none;
      opacity: 0;
    }

    .ss-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      max-width: calc(100vw - 48px);
      text-align: center;
      transition: transform 2s ease;
      will-change: transform;
    }

    /* ---- Screensaver photos ---- */
    .screensaver.has-photo {
      background: #000000;
      color: #ffffff;
    }

    .ss-photos,
    .ss-shade {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    /* Two stacked photos: the new one fades in over the previous one. */
    .ss-photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.6s ease;
      will-change: opacity, transform;
      -webkit-user-drag: none;
    }

    .ss-photo.is-front {
      opacity: 1;
    }

    .fit-contain .ss-photo {
      object-fit: contain;
    }

    /* A slow zoom keeps a photo from standing still on the screen. Each layer
       alternates between the two, which restarts the movement per photo. */
    .screensaver:not(.fit-contain) .ss-photo.zoom-0 {
      animation: dd-wall-tablet-zoom-in var(--dd-wall-tablet-slide, 32s) linear both;
    }

    .screensaver:not(.fit-contain) .ss-photo.zoom-1 {
      animation: dd-wall-tablet-zoom-out var(--dd-wall-tablet-slide, 32s) linear both;
    }

    .screensaver.is-still:not(.fit-contain) .ss-photo {
      animation: dd-wall-tablet-zoom-in 90s ease-in-out infinite alternate both;
    }

    .ss-shade {
      background: rgba(0, 0, 0, var(--dd-wall-tablet-photo-dim, 0.2));
      opacity: 0;
      transition: opacity 1.6s ease;
    }

    .has-photo .ss-shade {
      opacity: 1;
    }

    /* Extra shade behind the clock, so it stays readable on a bright photo. */
    .ss-shade.with-clock {
      background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.14) 26%, rgba(0, 0, 0, 0) 44%),
        rgba(0, 0, 0, var(--dd-wall-tablet-photo-dim, 0.2));
    }

    .ss-content.corner {
      position: absolute;
      left: clamp(28px, 4vw, 60px);
      bottom: clamp(28px, 4vw, 60px);
      align-items: flex-start;
      gap: 4px;
      max-width: calc(100vw - 2 * clamp(28px, 4vw, 60px));
      text-align: left;
      text-shadow: 0 1px 14px rgba(0, 0, 0, 0.5);
    }

    .corner .ss-time {
      font-size: clamp(44px, 8vw, 104px);
      font-weight: 400;
    }

    .corner .ss-date {
      font-size: clamp(16px, 2.2vw, 26px);
      opacity: 0.94;
    }

    .corner .ss-weather {
      margin-top: 6px;
      font-size: clamp(15px, 2vw, 22px);
      opacity: 0.94;
    }

    .corner .ss-weather ha-icon {
      --mdc-icon-size: clamp(20px, 2.6vw, 28px);
    }

    .ss-time {
      font-size: clamp(64px, 15vw, 168px);
      font-weight: 300;
      line-height: 1;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .ss-date {
      font-size: clamp(18px, 3vw, 30px);
      font-weight: 400;
      opacity: 0.8;
    }

    .ss-weather {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
      font-size: clamp(18px, 2.6vw, 26px);
      opacity: 0.8;
    }

    .ss-weather ha-icon {
      --mdc-icon-size: clamp(24px, 3.2vw, 34px);
    }

    .ss-condition {
      opacity: 0.75;
    }

    @keyframes dd-wall-tablet-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes dd-wall-tablet-zoom-in {
      from { transform: scale(1); }
      to { transform: scale(1.07) translate3d(-0.8%, -0.5%, 0); }
    }

    @keyframes dd-wall-tablet-zoom-out {
      from { transform: scale(1.07) translate3d(0.8%, 0.5%, 0); }
      to { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .screensaver,
      .ss-content {
        animation: none;
        transition: none;
      }

      .ss-photo,
      .screensaver:not(.fit-contain) .ss-photo.zoom-0,
      .screensaver:not(.fit-contain) .ss-photo.zoom-1,
      .screensaver.is-still:not(.fit-contain) .ss-photo {
        animation: none;
        transition: opacity 0.2s linear;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-wall-tablet': DwainsWallTablet;
  }
}

/** Keep exactly one wall tablet controller in document.body and give it hass. */
export function ensureWallTablet(
  hass: HomeAssistant,
  settings: DwainsDashboardSettings | undefined,
  dashSegment: string
): void {
  if (!hass || !dashSegment) return;
  let el = document.querySelector('dwains-dashboard-next-wall-tablet') as DwainsWallTablet | null;
  if (!el) {
    el = document.createElement('dwains-dashboard-next-wall-tablet') as DwainsWallTablet;
    document.body.appendChild(el);
  }
  el.sync(hass, settings, dashSegment);
}
