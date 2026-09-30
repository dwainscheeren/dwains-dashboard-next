// Registry data is loaded live by the editor and must never be written back.
export const LIVE_DATA_KEYS = ['areas', 'devices', 'entities', 'floors'] as const;

// Keep every stored dashboard option, including keys the editor does not
// manage itself (blueprint pages, Home custom cards, future options).
export function persistableConfig(config: any): Record<string, any> {
  const result: Record<string, any> = { ...(config || {}) };
  LIVE_DATA_KEYS.forEach((key) => delete result[key]);
  return result;
}
