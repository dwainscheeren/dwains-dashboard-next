import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createElementRegistration,
  POLL_INTERVAL_MS,
  POLL_ROUNDS,
} from '../src/utils/element-registration';
import { element, FakeRegistry, flush, startHomeAssistant } from './fake-registry';

const quiet = () => ({ info: vi.fn(), warn: vi.fn() });

function setup(options: { registry?: FakeRegistry } = {}) {
  const host = { customElements: options.registry ?? new FakeRegistry() };
  const log = quiet();
  const registration = createElementRegistration({
    current: () => host.customElements,
    log,
  });
  let ready = false;
  void registration.ready.then(() => {
    ready = true;
  });
  return { host, log, registration, isReady: () => ready };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createElementRegistration', () => {
  it('defines elements and leaves names that another script already has alone', () => {
    const registry = new FakeRegistry();
    const oldDashboard = element();
    registry.define('ll-strategy-dashboard-dwains', oldDashboard);
    const { registration } = setup({ registry });
    const strategy = element();
    const alias = element();

    expect(registration.define('ll-strategy-dashboard-dwains-dashboard-next', strategy)).toBe(true);
    expect(registration.define('ll-strategy-dashboard-dwains', alias)).toBe(false);

    expect(registry.get('ll-strategy-dashboard-dwains-dashboard-next')).toBe(strategy);
    expect(registry.get('ll-strategy-dashboard-dwains')).toBe(oldDashboard);
  });

  it('defines its elements again when Home Assistant replaces the registry', async () => {
    const { host, log, registration, isReady } = setup();
    const strategy = element();
    const card = element();
    registration.define('ll-strategy-dashboard-dwains-dashboard-next', strategy);
    registration.define('dwains-dashboard-next-card', card);
    expect(isReady()).toBe(false);

    const registry = startHomeAssistant(host);
    await flush();

    expect(registry.get('ll-strategy-dashboard-dwains-dashboard-next')).toBe(strategy);
    expect(registry.get('dwains-dashboard-next-card')).toBe(card);
    expect(isReady()).toBe(true);
    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info.mock.calls[0]?.[0]).toContain('ll-strategy-dashboard-dwains-dashboard-next, dwains-dashboard-next-card');
    expect(log.info.mock.calls[0]?.[0]).toContain('(boot)');
  });

  it('only defines again what it defined itself', async () => {
    const registry = new FakeRegistry();
    registry.define('ll-strategy-dashboard-dwains', element());
    const { host, registration } = setup({ registry });
    registration.define('ll-strategy-dashboard-dwains', element());
    registration.define('ll-strategy-dashboard-dwains-dashboard-next', element());

    const replaced = startHomeAssistant(host);
    await flush();

    expect(replaced.get('ll-strategy-dashboard-dwains')).toBeUndefined();
    expect(replaced.get('ll-strategy-dashboard-dwains-dashboard-next')).toBeDefined();
  });

  it('keeps a name another script took in the new registry first', async () => {
    const { host, log, registration } = setup();
    registration.define('ll-strategy-dashboard-dwains', element());
    const other = element();

    const registry = startHomeAssistant(host, { bootSignal: false });
    registry.define('ll-strategy-dashboard-dwains', other);
    expect(registration.check('test')).toEqual([]);

    expect(registry.get('ll-strategy-dashboard-dwains')).toBe(other);
    expect(log.warn).not.toHaveBeenCalled();
  });

  it('keeps going when one element cannot be defined again', async () => {
    const { host, log, registration } = setup();
    const card = element();
    registration.define('dwains-dashboard-next-card', card);
    registration.define('dwains-heading-card', element());

    const registry = startHomeAssistant(host, { bootSignal: false });
    const define = registry.define.bind(registry);
    vi.spyOn(registry, 'define').mockImplementation((name, constructor) => {
      if (name === 'dwains-dashboard-next-card') throw new Error('broken');
      define(name, constructor);
    });

    expect(registration.check('test')).toEqual(['dwains-heading-card']);
    expect(log.warn).toHaveBeenCalledWith('Dwains Dashboard Next - Could not register dwains-dashboard-next-card', expect.any(Error));
  });

  it('notices the replacement by polling when the boot signal does not come', async () => {
    const { host, registration, isReady } = setup();
    const strategy = element();
    registration.define('ll-strategy-view-dwains-dashboard-next-view', strategy);

    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 3);
    expect(isReady()).toBe(false);

    const registry = startHomeAssistant(host, { bootSignal: false });
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);

    expect(registry.get('ll-strategy-view-dwains-dashboard-next-view')).toBe(strategy);
    expect(isReady()).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stops watching after the last poll round', async () => {
    const { isReady } = setup();

    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * (POLL_ROUNDS - 1));
    expect(isReady()).toBe(false);
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);

    expect(isReady()).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('is ready right away when Home Assistant has already replaced the registry', async () => {
    const registry = new FakeRegistry();
    registry.define('home-assistant', element());
    const { log, isReady } = setup({ registry });

    await flush();

    expect(isReady()).toBe(true);
    expect(log.info).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBeLessThanOrEqual(1);
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('defines elements in the new registry once it was replaced', async () => {
    const { host, registration } = setup();
    const before = host.customElements;
    const registry = startHomeAssistant(host);
    await flush();
    const card = element();

    expect(registration.define('dwains-dashboard-next-card', card)).toBe(true);

    expect(registry.get('dwains-dashboard-next-card')).toBe(card);
    expect(before.get('dwains-dashboard-next-card')).toBeUndefined();
  });

  it('follows every replacement it is asked to check', async () => {
    const { host, registration } = setup();
    const strategy = element();
    registration.define('ll-strategy-dashboard-dwains-dashboard-next', strategy);
    startHomeAssistant(host);
    await flush();

    const again = startHomeAssistant(host, { bootSignal: false });
    expect(registration.check('test')).toEqual(['ll-strategy-dashboard-dwains-dashboard-next']);
    expect(again.get('ll-strategy-dashboard-dwains-dashboard-next')).toBe(strategy);
    expect(registration.check('test')).toEqual([]);
  });

  it('uses plain characters in what it logs', async () => {
    const { host, log, registration } = setup();
    registration.define('dwains-dashboard-next-card', element());
    startHomeAssistant(host);
    await flush();

    expect(log.info.mock.calls[0]?.[0]).not.toMatch(/[\u2013\u2014\u2018\u2019\u201C\u201D\u2026]/);
  });
});
