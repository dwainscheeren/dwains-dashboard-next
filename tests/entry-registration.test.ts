import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { element, FakeRegistry, flush, startHomeAssistant } from './fake-registry';

// The entry loads these with import(). Each records when it is loaded, so the
// tests can tell whether that happened before Home Assistant replaced the
// registry. Registered again for every test, after the module cache is reset.
const loaded: string[] = [];
const CARD_MODULES: Record<string, () => Record<string, unknown>> = {
  '../src/components/dwains-dashboard-card': () => ({ DwainsDashboardCard: class {} }),
  '../src/components/cards/dwains-flexbox-card': () => ({ DwainsFlexboxCard: class {} }),
  '../src/components/cards/dwains-heading-card': () => ({ DwainsHeadingCard: class {} }),
  '../src/components/dwains-layout-card': () => ({}),
  '../src/components/dwains-page-card': () => ({}),
  '../src/components/dwains-devices-card': () => ({}),
  '../src/components/dwains-bottom-nav': () => ({}),
};

const STRATEGIES = [
  'll-strategy-dashboard-dwains-dashboard-next',
  'll-strategy-view-dwains-dashboard-next-view',
  'll-strategy-dashboard-dwains',
  'll-strategy-view-dwains-view',
];
const CARDS = [
  'dwains-dashboard-next-card',
  'dwains-flexbox-card',
  'dwains-heading-card',
  'dwains-dashboard-card',
];

let host: { customElements: FakeRegistry; [key: string]: unknown };

async function loadEntry(registry: FakeRegistry) {
  host = {
    customElements: registry,
    location: { pathname: '/dd-next/home', search: '', hash: '' },
    history: { state: null, replaceState: vi.fn() },
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    setTimeout: (callback: () => void, ms: number) => setTimeout(callback, ms),
  };
  vi.stubGlobal('window', host);
  // In a browser the bare global is window.customElements.
  Object.defineProperty(globalThis, 'customElements', {
    configurable: true,
    get: () => host.customElements,
  });
  vi.stubGlobal('document', { querySelector: () => null });
  vi.stubGlobal('HTMLElement', class {});
  await import('../src/index');
}

/** Lets the entry's dynamic imports and the definitions after them finish. */
async function settle() {
  await flush(20);
  await vi.dynamicImportSettled();
  await flush(20);
}

beforeEach(() => {
  loaded.length = 0;
  vi.resetModules();
  for (const [path, exports] of Object.entries(CARD_MODULES)) {
    vi.doMock(path, () => {
      loaded.push(path);
      return exports();
    });
  }
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'info').mockImplementation(() => undefined);
});

afterEach(() => {
  delete (globalThis as { customElements?: unknown }).customElements;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('entry when it runs before Home Assistant replaces the registry', () => {
  it('ends up with the strategies and cards in the registry Home Assistant uses', async () => {
    const browserRegistry = new FakeRegistry();
    await loadEntry(browserRegistry);
    await settle();

    expect(browserRegistry.names()).toEqual(STRATEGIES);
    // Loading the cards now would define them in the registry that is about
    // to be replaced.
    expect(loaded).toEqual([]);

    const registry = startHomeAssistant(host);
    await settle();

    for (const name of STRATEGIES) {
      expect(registry.get(name), name).toBe(browserRegistry.get(name));
    }
    for (const name of CARDS) {
      expect(registry.get(name), name).toBeDefined();
      expect(browserRegistry.get(name), name).toBeUndefined();
    }
    expect(loaded).toHaveLength(7);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('ll-strategy-dashboard-dwains-dashboard-next'));
  });

  it('leaves the old Dwains Dashboard strategy names alone when that has them', async () => {
    const browserRegistry = new FakeRegistry();
    const oldDashboard = element();
    browserRegistry.define('ll-strategy-dashboard-dwains', oldDashboard);
    await loadEntry(browserRegistry);

    const registry = startHomeAssistant(host);
    await settle();

    expect(browserRegistry.get('ll-strategy-dashboard-dwains')).toBe(oldDashboard);
    expect(registry.get('ll-strategy-dashboard-dwains')).toBeUndefined();
    expect(registry.get('ll-strategy-dashboard-dwains-dashboard-next')).toBeDefined();
  });

  it('can still generate the dashboard after the replacement', async () => {
    await loadEntry(new FakeRegistry());
    const registry = startHomeAssistant(host);
    await settle();

    const strategy: any = registry.get('ll-strategy-dashboard-dwains-dashboard-next');
    expect(typeof strategy.generate).toBe('function');
    expect(typeof strategy.getConfigElement).toBe('function');
  });
});

describe('entry when Home Assistant is already running', () => {
  it('loads the cards right away into the current registry', async () => {
    const registry = new FakeRegistry();
    registry.define('home-assistant', element());
    await loadEntry(registry);
    await settle();

    for (const name of [...STRATEGIES, ...CARDS]) {
      expect(registry.get(name), name).toBeDefined();
    }
    expect(loaded).toHaveLength(7);
    expect(console.info).not.toHaveBeenCalled();
  });
});
