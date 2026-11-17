// Registry data is loaded live by the editor and must never be written back.
export const LIVE_DATA_KEYS = ['areas', 'devices', 'entities', 'floors'] as const;

// Keep every stored dashboard option, including keys the editor does not
// manage itself (blueprint pages, Home custom cards, future options).
export function persistableConfig(config: any): Record<string, any> {
  const result: Record<string, any> = { ...(config || {}) };
  LIVE_DATA_KEYS.forEach((key) => delete result[key]);
  return result;
}

/** Settings editable by the strategy editor, with legacy omissions normalized. */
export function settingsEditorConfig(config: any): Record<string, any> {
  return {
    ...persistableConfig(config),
    type: 'custom:dwains-dashboard-next',
    areas_display: config?.areas_display || {},
    floors_display: config?.floors_display || {},
    areas_options: config?.areas_options || {},
    blueprint_replacements: config?.blueprint_replacements || {},
    device_admission: config?.device_admission || {},
    favorites: config?.favorites || [],
    pages: config?.pages || [],
    home_custom_cards: config?.home_custom_cards || [],
    settings: config?.settings || {},
  };
}

type ConfigRecord = Record<string, unknown>;

export interface DashboardSettingsDraft {
  baseline: ConfigRecord;
  edited: ConfigRecord;
}

export class DashboardSettingsConflict extends Error {
  constructor(readonly path: string) {
    super(`Dashboard setting changed while editing: ${path}`);
    this.name = 'DashboardSettingsConflict';
  }
}

function isRecord(value: unknown): value is ConfigRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasKey(config: ConfigRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(config, key);
}

function sameSetting(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, index) => sameSetting(value, b[index]));
  }
  if (isRecord(a) && isRecord(b)) {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length &&
      keys.every(key => hasKey(b, key) && sameSetting(a[key], b[key]));
  }
  return false;
}

export function createDashboardSettingsDraft(baseline: ConfigRecord, edited: ConfigRecord): DashboardSettingsDraft | undefined {
  return sameSetting(baseline, edited) ? undefined : { baseline, edited };
}

/** Apply only edited keys to the latest stored strategy. Arrays keep their order and are replaced as a unit. */
export function applyDashboardSettingsDraft(current: ConfigRecord, draft: DashboardSettingsDraft): ConfigRecord {
  return mergeSettings(current, settingsEditorConfig(current), draft.baseline, draft.edited, '');
}

function mergeSettings(
  current: ConfigRecord,
  comparable: ConfigRecord,
  baseline: ConfigRecord,
  edited: ConfigRecord,
  prefix: string
): ConfigRecord {
  const result = new Map(Object.entries(current));
  const keys = new Set([...Object.keys(baseline), ...Object.keys(edited)]);
  for (const key of keys) {
    const before = hasKey(baseline, key) ? baseline[key] : undefined;
    const next = hasKey(edited, key) ? edited[key] : undefined;
    if (sameSetting(before, next)) continue;

    const latest = hasKey(comparable, key) ? comparable[key] : undefined;
    const path = prefix ? `${prefix}.${key}` : key;
    if (isRecord(next) && (isRecord(before) || before === undefined) && (isRecord(latest) || latest === undefined)) {
      if (latest === undefined && before !== undefined) throw new DashboardSettingsConflict(path);
      const raw = result.get(key);
      result.set(key, mergeSettings(isRecord(raw) ? raw : {}, latest ?? {}, before ?? {}, next, path));
      continue;
    }

    if (!sameSetting(latest, before) && !sameSetting(latest, next)) {
      throw new DashboardSettingsConflict(path);
    }
    if (next === undefined) result.delete(key);
    else result.set(key, next);
  }
  return Object.fromEntries(result);
}
