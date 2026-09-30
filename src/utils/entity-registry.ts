import type { HomeAssistant } from '../types/home-assistant';

/**
 * Home Assistant's own `hass.entities` only holds the display fields of enabled
 * entities: a `hidden` flag, but no `hidden_by`, `disabled_by` or `created_at`.
 * Dwains Dashboard also needs those, so the full entity registry that the
 * strategy loads is kept here. `hass` itself is shared with the rest of Home
 * Assistant and must not be overwritten.
 */
export interface EntityRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  hidden_by?: string | null;
  hidden?: boolean;
  disabled_by?: string | null;
  entity_category?: string | null;
  created_at?: string | null;
  name?: string | null;
  icon?: string | null;
  [key: string]: unknown;
}

export type EntityRegistry = Record<string, EntityRegistryEntry>;

const EMPTY_REGISTRY: EntityRegistry = {};

let fullRegistry: EntityRegistry = EMPTY_REGISTRY;

/** Store the full entity registry as loaded by the strategy or the settings editor. */
export function setFullEntityRegistry(entries: readonly EntityRegistryEntry[] | null | undefined): void {
  const next: EntityRegistry = {};
  (entries || []).forEach((entry) => {
    if (entry?.entity_id) next[entry.entity_id] = entry;
  });
  fullRegistry = next;
}

let cachedLive: unknown;
let cachedFull: EntityRegistry | undefined;
let cachedMerged: EntityRegistry = EMPTY_REGISTRY;

function mergeEntry(
  full: EntityRegistryEntry | undefined,
  live: EntityRegistryEntry | undefined
): EntityRegistryEntry {
  if (!live) return full!;
  const merged: EntityRegistryEntry = { ...full, ...live };
  // Home Assistant's live display entry is authoritative for "hidden", but only
  // has a boolean. Keep hidden_by in step so every check sees the current state.
  if (typeof live.hidden === 'boolean') {
    merged.hidden_by = live.hidden ? (live.hidden_by || full?.hidden_by || 'user') : null;
  }
  return merged;
}

/**
 * The entity registry to read from: Home Assistant's live entries merged over
 * the stored full registry (which adds disabled entities and the extra
 * fields). The same object is returned until either source changes, so it can
 * be used as a cache key.
 */
export function getEntityRegistry(hass: HomeAssistant | undefined | null): EntityRegistry {
  const live = (hass as any)?.entities as EntityRegistry | undefined;
  if (live === cachedLive && fullRegistry === cachedFull) return cachedMerged;

  const merged: EntityRegistry = {};
  for (const entityId in fullRegistry) {
    merged[entityId] = mergeEntry(fullRegistry[entityId], live?.[entityId]);
  }
  if (live) {
    for (const entityId in live) {
      if (!merged[entityId]) merged[entityId] = mergeEntry(undefined, live[entityId]);
    }
  }

  cachedLive = live;
  cachedFull = fullRegistry;
  cachedMerged = merged;
  return merged;
}
