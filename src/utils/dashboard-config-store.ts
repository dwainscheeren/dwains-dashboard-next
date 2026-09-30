import type { HomeAssistant } from '../types/home-assistant';

// Several places change the stored dashboard config: area options on the area
// pages, the settings page, blueprint pages and the device tracking of the
// devices page. Each one reads `lovelace/config`, changes a part and writes
// the whole config back. Two of those running at the same time read the same
// config, and the second write undoes the first. Running them one after
// another, each reading the config written by the one before, prevents that.

export type StoredLovelaceConfig = Record<string, any>;

/**
 * Returns the config to save, or `null`/`undefined` to leave the stored
 * config as it is. Called with the latest stored config.
 */
export type StoredConfigUpdate = (config: StoredLovelaceConfig) => StoredLovelaceConfig | null | undefined;

type ConfigCaller = Pick<HomeAssistant, 'callWS'>;

let queueTail: Promise<unknown> = Promise.resolve();

/**
 * Queues a read-modify-write of the stored dashboard config. Updates run one
 * at a time in the order they were queued; each one reads the latest stored
 * config right before it writes. A failed update rejects its own promise and
 * does not stop the updates queued after it.
 *
 * Resolves with the saved config, or `null` when `update` chose not to save.
 */
export function updateStoredDashboardConfig(
  hass: ConfigCaller,
  urlPath: string | undefined,
  update: StoredConfigUpdate
): Promise<StoredLovelaceConfig | null> {
  const run = async (): Promise<StoredLovelaceConfig | null> => {
    const base = urlPath ? { url_path: urlPath } : {};
    const current = await hass.callWS<StoredLovelaceConfig>({ type: 'lovelace/config', ...base });
    const next = update(current);
    if (!next) return null;
    await hass.callWS({ type: 'lovelace/config/save', ...base, config: next });
    return next;
  };

  const result = queueTail.then(run, run);
  queueTail = result.catch(() => undefined);
  return result;
}

/**
 * Queues an update of the dashboard strategy options. `update` receives the
 * stored strategy (or `undefined` when the dashboard has none) and returns the
 * new strategy, or `null`/`undefined` to leave the stored config as it is.
 */
export function updateStoredDashboardStrategy(
  hass: ConfigCaller,
  urlPath: string | undefined,
  update: (strategy: Record<string, any> | undefined, config: StoredLovelaceConfig) => Record<string, any> | null | undefined
): Promise<StoredLovelaceConfig | null> {
  return updateStoredDashboardConfig(hass, urlPath, (config) => {
    const strategy = update(config?.strategy, config);
    if (!strategy) return null;
    return { ...config, strategy };
  });
}
