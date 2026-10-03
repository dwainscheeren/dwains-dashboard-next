import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { closeDialogThenNavigate } from '../src/utils/dialog-history';

const DIALOG = 'dwains-dashboard-next-domain-entities-dialog';

/** A window with just the history and event parts the helper uses. */
function fakeWindow(state: unknown) {
  const listeners = new Set<() => void>();
  return {
    history: { state } as History,
    addEventListener: ((type: string, listener: () => void) => {
      if (type === 'popstate') listeners.add(listener);
    }) as Window['addEventListener'],
    removeEventListener: ((type: string, listener: () => void) => {
      if (type === 'popstate') listeners.delete(listener);
    }) as Window['removeEventListener'],
    setTimeout: ((handler: () => void, timeout?: number) =>
      setTimeout(handler, timeout)) as unknown as Window['setTimeout'],
    clearTimeout: ((handle?: number) => clearTimeout(handle)) as Window['clearTimeout'],
    popstate: () => [...listeners].forEach((listener) => listener()),
    listenerCount: () => listeners.size,
  };
}

describe('closeDialogThenNavigate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates right away when the dialog has no history entry', () => {
    const win = fakeWindow(null);
    const calls: string[] = [];

    closeDialogThenNavigate(DIALOG, () => calls.push('close'), () => calls.push('navigate'), win);

    expect(calls).toEqual(['close', 'navigate']);
    expect(win.listenerCount()).toBe(0);
  });

  it('navigates right away when another dialog owns the history entry', () => {
    const win = fakeWindow({ dialog: 'ha-more-info-dialog' });
    const calls: string[] = [];

    closeDialogThenNavigate(DIALOG, () => calls.push('close'), () => calls.push('navigate'), win);

    expect(calls).toEqual(['close', 'navigate']);
  });

  it('waits for the back step of the dialog before navigating', () => {
    const win = fakeWindow({ dialog: DIALOG });
    const calls: string[] = [];

    closeDialogThenNavigate(DIALOG, () => calls.push('close'), () => calls.push('navigate'), win);
    expect(calls).toEqual(['close']);

    // The back step lands; other popstate listeners still get to run first.
    win.popstate();
    expect(calls).toEqual(['close']);

    vi.advanceTimersByTime(0);
    expect(calls).toEqual(['close', 'navigate']);
    expect(win.listenerCount()).toBe(0);
  });

  it('navigates once, also when the fallback timer and popstate both fire', () => {
    const win = fakeWindow({ dialog: DIALOG });
    const navigate = vi.fn();

    closeDialogThenNavigate(DIALOG, () => undefined, navigate, win);
    win.popstate();
    vi.advanceTimersByTime(5000);

    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('navigates after the fallback when no back step arrives', () => {
    const win = fakeWindow({ dialog: DIALOG });
    const navigate = vi.fn();

    closeDialogThenNavigate(DIALOG, () => undefined, navigate, win);
    vi.advanceTimersByTime(999);
    expect(navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(win.listenerCount()).toBe(0);
  });
});
