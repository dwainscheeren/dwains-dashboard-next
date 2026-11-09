// What a tap on a tile does. By default a tap opens the details (more info)
// and the switch on the tile turns it on or off. With `tile_tap_action:
// toggle` a tap turns lights, switches and fans on or off and holding the
// tile opens the details, like the tile card of Home Assistant.

import type { DwainsDashboardSettings, LovelaceCardConfig } from '../types/strategy';

export type TileTapAction = 'more-info' | 'toggle';

/** Domains whose tiles turn on or off with a tap when that is chosen. */
export const TILE_TAP_TOGGLE_DOMAINS: readonly string[] = Object.freeze([
  'light',
  'switch',
  'fan',
  'input_boolean',
]);

/** How long a tile has to be held before the details open, like Home Assistant. */
export const TILE_HOLD_MS = 500;

/** A finger that moves further than this is scrolling, not holding. */
export const TILE_HOLD_MOVE_TOLERANCE_PX = 10;

export function tileTapAction(settings?: DwainsDashboardSettings): TileTapAction {
  return settings?.tile_tap_action === 'toggle' ? 'toggle' : 'more-info';
}

/** True when a tap on the tile of this entity turns it on or off. */
export function tileTapToggles(settings: DwainsDashboardSettings | undefined, entityId: string): boolean {
  if (tileTapAction(settings) !== 'toggle') return false;
  return TILE_TAP_TOGGLE_DOMAINS.includes(entityId.split('.')[0] || '');
}

/**
 * Gives a standard tile card on the Devices page the tap and hold actions of
 * the setting. Light tiles already toggle on a tap; actions a card brings
 * itself are kept.
 */
export function withTileTapActions(
  cardConfig: LovelaceCardConfig,
  settings: DwainsDashboardSettings | undefined
): LovelaceCardConfig {
  const entityId = typeof cardConfig?.entity === 'string' ? cardConfig.entity : '';
  if (cardConfig?.type !== 'tile' || !entityId || !tileTapToggles(settings, entityId)) return cardConfig;
  if (cardConfig.tap_action && cardConfig.hold_action) return cardConfig;
  return {
    ...cardConfig,
    tap_action: cardConfig.tap_action ?? { action: 'toggle' },
    hold_action: cardConfig.hold_action ?? { action: 'more-info' },
  };
}

export interface HoldTimers {
  set(callback: () => void, ms: number): number;
  clear(id: number): void;
}

const windowTimers: HoldTimers = {
  set: (callback, ms) => window.setTimeout(callback, ms),
  clear: (id) => window.clearTimeout(id),
};

/**
 * Tells a hold apart from a tap. `down` starts the hold timer, moving too far
 * or lifting the finger early stops it. After a hold (or a context menu) the
 * click that ends the press is swallowed, so it does not toggle as well.
 * Every new press starts clean, so a click that never arrives does not linger.
 */
export class TileHoldGesture {
  private _timer?: number;
  private _start?: { pointerId: number; x: number; y: number };
  private _held = false;

  constructor(
    private readonly _onHold: () => void,
    private readonly _timers: HoldTimers = windowTimers,
    private readonly _holdMs = TILE_HOLD_MS,
    private readonly _tolerancePx = TILE_HOLD_MOVE_TOLERANCE_PX
  ) {}

  /** A press started. */
  down(pointerId: number, x: number, y: number): void {
    this.cancel();
    this._held = false;
    this._start = { pointerId, x, y };
    this._timer = this._timers.set(() => {
      this._timer = undefined;
      this._start = undefined;
      this._held = true;
      this._onHold();
    }, this._holdMs);
  }

  /** The pointer moved; far enough means the page is being scrolled. */
  move(pointerId: number, x: number, y: number): void {
    const start = this._start;
    if (!start || start.pointerId !== pointerId) return;
    if (Math.abs(x - start.x) > this._tolerancePx || Math.abs(y - start.y) > this._tolerancePx) {
      this.cancel();
    }
  }

  /** The press ended or was taken over (scroll, second finger, leaving the tile). */
  cancel(): void {
    if (this._timer !== undefined) this._timers.clear(this._timer);
    this._timer = undefined;
    this._start = undefined;
  }

  /**
   * A context menu was asked for: a long press on Android, a right click or
   * the menu key. True when the details should open now, which happens once
   * per press.
   */
  contextMenu(): boolean {
    if (this._held) return false;
    this.cancel();
    this._held = true;
    return true;
  }

  /** True once, for the click that ends a hold. That click must not tap. */
  consumeClick(): boolean {
    if (!this._held) return false;
    this._held = false;
    return true;
  }

  get pending(): boolean {
    return this._timer !== undefined;
  }
}

const NESTED_CONTROL_SELECTOR = 'button, select, input, textarea, a[href], [role="switch"], [role="slider"]';

/**
 * True when the event started on a control inside the tile, such as the
 * switch or the cover buttons. Those keep their own tap and hold.
 */
export function isFromNestedControl(event: Pick<Event, 'composedPath'>, tile: EventTarget): boolean {
  for (const node of event.composedPath()) {
    if (node === tile) return false;
    const matches = (node as Partial<Element>).matches;
    if (typeof matches === 'function' && matches.call(node, NESTED_CONTROL_SELECTOR)) return true;
  }
  return false;
}
