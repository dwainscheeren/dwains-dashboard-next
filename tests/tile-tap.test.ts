import { describe, expect, it, vi } from 'vitest';
import {
  TILE_HOLD_MOVE_TOLERANCE_PX,
  TILE_HOLD_MS,
  TileHoldGesture,
  isFromNestedControl,
  tileTapAction,
  tileTapToggles,
  withTileTapActions,
  type HoldTimers,
} from '../src/utils/tile-tap';

/** Timers that only run when the test says so. */
function manualTimers() {
  let nextId = 1;
  const pending = new Map<number, { callback: () => void; ms: number }>();
  const timers: HoldTimers = {
    set: (callback, ms) => {
      const id = nextId++;
      pending.set(id, { callback, ms });
      return id;
    },
    clear: (id) => {
      pending.delete(id);
    },
  };
  return {
    timers,
    pending,
    fire() {
      const entries = [...pending.entries()];
      pending.clear();
      entries.forEach(([, entry]) => entry.callback());
    },
  };
}

const TOGGLE = { tile_tap_action: 'toggle' as const };

describe('tileTapAction', () => {
  it('opens the details by default', () => {
    expect(tileTapAction(undefined)).toBe('more-info');
    expect(tileTapAction({})).toBe('more-info');
    expect(tileTapAction({ tile_tap_action: 'more-info' })).toBe('more-info');
  });

  it('turns on or off when chosen', () => {
    expect(tileTapAction(TOGGLE)).toBe('toggle');
  });

  it('ignores unknown values', () => {
    expect(tileTapAction({ tile_tap_action: 'explode' as any })).toBe('more-info');
  });
});

describe('tileTapToggles', () => {
  it('only toggles lights, switches, fans and input booleans', () => {
    expect(tileTapToggles(TOGGLE, 'light.kitchen')).toBe(true);
    expect(tileTapToggles(TOGGLE, 'switch.coffee')).toBe(true);
    expect(tileTapToggles(TOGGLE, 'fan.attic')).toBe(true);
    expect(tileTapToggles(TOGGLE, 'input_boolean.guest_mode')).toBe(true);
    expect(tileTapToggles(TOGGLE, 'cover.garage')).toBe(false);
    expect(tileTapToggles(TOGGLE, 'lock.front_door')).toBe(false);
    expect(tileTapToggles(TOGGLE, 'sensor.temperature')).toBe(false);
  });

  it('never toggles while the default is used', () => {
    expect(tileTapToggles(undefined, 'light.kitchen')).toBe(false);
    expect(tileTapToggles({}, 'switch.coffee')).toBe(false);
  });
});

describe('withTileTapActions', () => {
  it('gives a standard switch tile tap to toggle and hold for details', () => {
    expect(withTileTapActions({ type: 'tile', entity: 'switch.coffee' }, TOGGLE)).toEqual({
      type: 'tile',
      entity: 'switch.coffee',
      tap_action: { action: 'toggle' },
      hold_action: { action: 'more-info' },
    });
  });

  it('leaves cards alone while the default is used', () => {
    const card = { type: 'tile', entity: 'switch.coffee' };
    expect(withTileTapActions(card, undefined)).toBe(card);
    expect(withTileTapActions(card, {})).toBe(card);
  });

  it('keeps actions a card already has', () => {
    const light = {
      type: 'tile',
      entity: 'light.kitchen',
      tap_action: { action: 'toggle' },
      hold_action: { action: 'more-info' },
    };
    expect(withTileTapActions(light, TOGGLE)).toBe(light);

    const custom = { type: 'tile', entity: 'fan.attic', tap_action: { action: 'navigate', navigation_path: '/x' } };
    expect(withTileTapActions(custom, TOGGLE)).toEqual({
      ...custom,
      hold_action: { action: 'more-info' },
    });
  });

  it('leaves other card types and domains alone', () => {
    const sensor = { type: 'sensor', entity: 'sensor.power' };
    const cover = { type: 'tile', entity: 'cover.garage' };
    const noEntity = { type: 'tile' };
    expect(withTileTapActions(sensor, TOGGLE)).toBe(sensor);
    expect(withTileTapActions(cover, TOGGLE)).toBe(cover);
    expect(withTileTapActions(noEntity, TOGGLE)).toBe(noEntity);
  });
});

describe('TileHoldGesture', () => {
  it('opens the details after holding long enough and swallows the click that follows', () => {
    const clock = manualTimers();
    const onHold = vi.fn();
    const gesture = new TileHoldGesture(onHold, clock.timers);

    gesture.down(1, 100, 100);
    expect(clock.pending.size).toBe(1);
    expect([...clock.pending.values()][0]!.ms).toBe(TILE_HOLD_MS);
    clock.fire();

    expect(onHold).toHaveBeenCalledTimes(1);
    gesture.cancel(); // finger lifted
    expect(gesture.consumeClick()).toBe(true);
    // Only the click that ends the hold is swallowed.
    expect(gesture.consumeClick()).toBe(false);
  });

  it('treats a short press as a tap', () => {
    const clock = manualTimers();
    const onHold = vi.fn();
    const gesture = new TileHoldGesture(onHold, clock.timers);

    gesture.down(1, 100, 100);
    gesture.cancel();

    expect(clock.pending.size).toBe(0);
    expect(onHold).not.toHaveBeenCalled();
    expect(gesture.consumeClick()).toBe(false);
  });

  it('stops the hold when the finger moves to scroll', () => {
    const clock = manualTimers();
    const onHold = vi.fn();
    const gesture = new TileHoldGesture(onHold, clock.timers);

    gesture.down(1, 100, 100);
    gesture.move(1, 100 + TILE_HOLD_MOVE_TOLERANCE_PX, 100);
    expect(gesture.pending).toBe(true);

    gesture.move(1, 100, 100 + TILE_HOLD_MOVE_TOLERANCE_PX + 1);
    expect(gesture.pending).toBe(false);
    clock.fire();
    expect(onHold).not.toHaveBeenCalled();
  });

  it('ignores moves of another pointer', () => {
    const clock = manualTimers();
    const gesture = new TileHoldGesture(vi.fn(), clock.timers);

    gesture.down(1, 100, 100);
    gesture.move(2, 400, 400);
    expect(gesture.pending).toBe(true);
  });

  it('starts every press clean, so a click that never came is not swallowed later', () => {
    const clock = manualTimers();
    const gesture = new TileHoldGesture(vi.fn(), clock.timers);

    gesture.down(1, 0, 0);
    clock.fire();
    // The details opened and the click landed elsewhere. The next press is a normal tap.
    gesture.down(2, 0, 0);
    gesture.cancel();
    expect(gesture.consumeClick()).toBe(false);
  });

  it('opens the details once for a context menu during a press', () => {
    const clock = manualTimers();
    const onHold = vi.fn();
    const gesture = new TileHoldGesture(onHold, clock.timers);

    // Android can send its long press menu before the hold timer runs out.
    gesture.down(1, 0, 0);
    expect(gesture.contextMenu()).toBe(true);
    expect(gesture.pending).toBe(false);
    clock.fire();
    expect(onHold).not.toHaveBeenCalled();
    expect(gesture.consumeClick()).toBe(true);
  });

  it('does not open the details twice when the menu comes after the hold', () => {
    const clock = manualTimers();
    const gesture = new TileHoldGesture(vi.fn(), clock.timers);

    gesture.down(1, 0, 0);
    clock.fire();
    expect(gesture.contextMenu()).toBe(false);
  });

  it('opens the details for a right click or the menu key without a press', () => {
    const gesture = new TileHoldGesture(vi.fn(), manualTimers().timers);
    expect(gesture.contextMenu()).toBe(true);
  });
});

describe('isFromNestedControl', () => {
  const node = (selectorMatch: boolean) => ({ matches: () => selectorMatch }) as unknown as EventTarget;
  const tile = node(false);
  const path = (...nodes: unknown[]) => ({ composedPath: () => nodes as EventTarget[] });

  it('is true for the switch inside the tile', () => {
    const button = node(true);
    expect(isFromNestedControl(path(button, tile), tile)).toBe(true);
  });

  it('is true for an icon inside a button', () => {
    const icon = node(false);
    const button = node(true);
    expect(isFromNestedControl(path(icon, button, tile), tile)).toBe(true);
  });

  it('is false for the tile itself and plain content', () => {
    const name = node(false);
    expect(isFromNestedControl(path(tile), tile)).toBe(false);
    expect(isFromNestedControl(path(name, tile), tile)).toBe(false);
  });

  it('stops looking at the tile, so a button around the tile does not count', () => {
    const outerButton = node(true);
    expect(isFromNestedControl(path(tile, outerButton), tile)).toBe(false);
  });

  it('skips nodes without matches, such as text and the window', () => {
    expect(isFromNestedControl(path({}, tile), tile)).toBe(false);
  });
});
