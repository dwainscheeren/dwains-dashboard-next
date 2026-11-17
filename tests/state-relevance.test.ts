import { describe, expect, it } from 'vitest';
import { isCoverStatusChange, isHomeRelevantStateChange } from '../src/utils/state-relevance';
import { entityState } from './helpers';

const NONE: ReadonlySet<string> = new Set();

function homeRelevant(
  entityId: string,
  oldState: ReturnType<typeof entityState>,
  newState: ReturnType<typeof entityState>,
  explicit: ReadonlySet<string> = NONE
): boolean {
  return isHomeRelevantStateChange(entityId, oldState, newState, explicit);
}

describe('cover relevance on Home', () => {
  it('skips position ticks of a moving cover', () => {
    const before = entityState('cover.blind', 'closing', { device_class: 'blind', current_position: 60 });
    const after = entityState('cover.blind', 'closing', { device_class: 'blind', current_position: 50 });
    expect(isCoverStatusChange(before, after)).toBe(false);
    expect(homeRelevant('cover.blind', before, after)).toBe(false);
  });

  it('skips position changes of an open window that stays open', () => {
    const before = entityState('cover.window', 'open', { device_class: 'window', current_position: 40 });
    const after = entityState('cover.window', 'open', { device_class: 'window', current_position: 70 });
    expect(homeRelevant('cover.window', before, after)).toBe(false);
  });

  it('renders when a cover opens or closes', () => {
    const open = entityState('cover.window', 'open', { device_class: 'window', current_position: 100 });
    const closed = entityState('cover.window', 'closed', { device_class: 'window', current_position: 0 });
    expect(homeRelevant('cover.window', open, closed)).toBe(true);
    expect(homeRelevant('cover.window', closed, open)).toBe(true);
  });

  it('renders when a position change moves a cover in or out of its chip', () => {
    // A blind that leaves its fully open position counts as "Shading closed".
    const up = entityState('cover.blind', 'open', { current_position: 100 });
    const lowered = entityState('cover.blind', 'open', { current_position: 90 });
    expect(homeRelevant('cover.blind', up, lowered)).toBe(true);
    expect(homeRelevant('cover.blind', lowered, up)).toBe(true);
  });

  it('renders when the device class moves a cover to another chip', () => {
    const blind = entityState('cover.a', 'open', { current_position: 100 });
    const window = entityState('cover.a', 'open', { device_class: 'window', current_position: 100 });
    expect(homeRelevant('cover.a', blind, window)).toBe(true);
  });

  it('always renders for explicit entities', () => {
    const before = entityState('cover.blind', 'closing', { current_position: 60 });
    const after = entityState('cover.blind', 'closing', { current_position: 50 });
    expect(homeRelevant('cover.blind', before, after, new Set(['cover.blind']))).toBe(true);
  });
});

it('updates Home as soon as a carbon monoxide sensor activates or clears', () => {
  const id = 'binary_sensor.hall_co';
  const off = entityState(id, 'off', { device_class: 'carbon_monoxide' });
  const on = entityState(id, 'on', { device_class: 'carbon_monoxide' });

  expect(homeRelevant(id, off, on)).toBe(true);
  expect(homeRelevant(id, on, off)).toBe(true);
});
