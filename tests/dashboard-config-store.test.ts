import { describe, expect, it, vi } from 'vitest';
import { updateStoredDashboardConfig, updateStoredDashboardStrategy } from '../src/utils/dashboard-config-store';

/** A Home Assistant connection with one stored dashboard config and slow calls. */
function storedDashboard(initial: Record<string, any>, options: { failSaves?: number } = {}) {
  let stored = structuredClone(initial);
  let failSaves = options.failSaves ?? 0;
  const tick = () => new Promise((resolve) => setTimeout(resolve, 1));
  const callWS = vi.fn(async (msg: Record<string, any>): Promise<any> => {
    await tick();
    if (msg.type === 'lovelace/config') return structuredClone(stored);
    if (msg.type === 'lovelace/config/save') {
      if (failSaves > 0) {
        failSaves--;
        throw new Error('save failed');
      }
      stored = structuredClone(msg.config);
      return null;
    }
    throw new Error(`Unexpected WS call ${msg.type}`);
  });
  return { hass: { callWS } as any, callWS, stored: () => stored };
}

describe('updateStoredDashboardStrategy', () => {
  it('keeps both of two quick area option edits', async () => {
    const dashboard = storedDashboard({ strategy: { type: 'custom:dwains-dashboard-next', areas_options: {} } });
    const patchArea = (areaId: string, patch: Record<string, any>) =>
      updateStoredDashboardStrategy(dashboard.hass, 'dwains', (strategy) => ({
        ...strategy,
        areas_options: {
          ...strategy?.areas_options,
          [areaId]: { ...strategy?.areas_options?.[areaId], ...patch },
        },
      }));

    await Promise.all([
      patchArea('kitchen', { entity_order: ['light.a'] }),
      patchArea('kitchen', { group_order: ['lights'] }),
      patchArea('garden', { entity_order: ['switch.b'] }),
    ]);

    expect(dashboard.stored().strategy.areas_options).toEqual({
      kitchen: { entity_order: ['light.a'], group_order: ['lights'] },
      garden: { entity_order: ['switch.b'] },
    });
  });

  it('runs updates in order, each on the config the previous one wrote', async () => {
    const dashboard = storedDashboard({ strategy: { pages: [] } });
    const seen: number[] = [];
    const addPage = (id: number) => updateStoredDashboardStrategy(dashboard.hass, undefined, (strategy) => {
      seen.push(strategy?.pages.length);
      return { ...strategy, pages: [...strategy?.pages, { id }] };
    });

    await Promise.all([addPage(1), addPage(2), addPage(3)]);
    expect(seen).toEqual([0, 1, 2]);
    expect(dashboard.stored().strategy.pages.map((page: any) => page.id)).toEqual([1, 2, 3]);
  });

  it('does not save when the update returns nothing', async () => {
    const dashboard = storedDashboard({ views: [] });
    const result = await updateStoredDashboardStrategy(dashboard.hass, undefined, (strategy) =>
      strategy ? { ...strategy, favorites: [] } : null
    );
    expect(result).toBeNull();
    expect(dashboard.callWS).toHaveBeenCalledTimes(1);
    expect(dashboard.stored()).toEqual({ views: [] });
  });

  it('keeps the other parts of the stored config', async () => {
    const dashboard = storedDashboard({ title: 'Home', strategy: { type: 'x', settings: { a: 1 } } });
    await updateStoredDashboardStrategy(dashboard.hass, undefined, (strategy) => ({ ...strategy, favorites: ['light.a'] }));
    expect(dashboard.stored()).toEqual({ title: 'Home', strategy: { type: 'x', settings: { a: 1 }, favorites: ['light.a'] } });
  });
});

describe('updateStoredDashboardConfig', () => {
  it('passes the dashboard url path to both calls', async () => {
    const dashboard = storedDashboard({ strategy: {} });
    await updateStoredDashboardConfig(dashboard.hass, 'dwains', (config) => ({ ...config, touched: true }));
    expect(dashboard.callWS.mock.calls.map(([msg]) => [msg.type, msg.url_path])).toEqual([
      ['lovelace/config', 'dwains'],
      ['lovelace/config/save', 'dwains'],
    ]);
  });

  it('rejects a failed save without blocking the next update', async () => {
    const dashboard = storedDashboard({ strategy: { count: 0 } }, { failSaves: 1 });
    const increment = () => updateStoredDashboardStrategy(dashboard.hass, undefined, (strategy) => ({
      ...strategy,
      count: (strategy?.count ?? 0) + 1,
    }));

    const results = await Promise.allSettled([increment(), increment()]);
    expect(results.map((result) => result.status)).toEqual(['rejected', 'fulfilled']);
    expect(dashboard.stored().strategy.count).toBe(1);
  });

  it('continues after an update function throws', async () => {
    const dashboard = storedDashboard({ strategy: {} });
    const failing = updateStoredDashboardConfig(dashboard.hass, undefined, () => {
      throw new Error('bad update');
    });
    const next = updateStoredDashboardConfig(dashboard.hass, undefined, (config) => ({ ...config, ok: true }));
    await expect(failing).rejects.toThrow('bad update');
    await expect(next).resolves.toMatchObject({ ok: true });
  });
});
