import type { HassEntity } from '../types/home-assistant';
import { isHiddenAsUnavailable } from './entity-availability';
import { isRegistryEntryVisible, type RegistryVisibilityFields } from './entity-visibility';

// The "Scenes & scripts" row on Home: scenes and scripts the user picked in
// Dashboard settings, stored in order as `settings.home_scenes`.

export type HomeSceneDomain = 'scene' | 'script';

export interface HomeSceneItem {
  entityId: string;
  domain: HomeSceneDomain;
  /** Shown disabled: the entity is unavailable and unavailable entities are not hidden. */
  unavailable: boolean;
}

export interface HomeSceneCandidate {
  entityId: string;
  name: string;
  areaName?: string;
}

/** The domain of a scene or script entity id, or undefined for anything else. */
export function homeSceneDomain(entityId: unknown): HomeSceneDomain | undefined {
  if (typeof entityId !== 'string') return undefined;
  const dot = entityId.indexOf('.');
  if (dot <= 0 || dot === entityId.length - 1) return undefined;
  const domain = entityId.slice(0, dot);
  return domain === 'scene' || domain === 'script' ? domain : undefined;
}

/** The stored list with only scene and script ids, each once, in stored order. */
export function normalizeHomeScenes(ids?: readonly unknown[] | null): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (!homeSceneDomain(id) || seen.has(id as string)) continue;
    seen.add(id as string);
    result.push(id as string);
  }
  return result;
}

/** Add a scene or script at the end; the list is returned unchanged for duplicates and other domains. */
export function addHomeScene(ids: readonly unknown[] | null | undefined, entityId: string): string[] {
  const list = normalizeHomeScenes(ids);
  if (!homeSceneDomain(entityId) || list.includes(entityId)) return list;
  return [...list, entityId];
}

export function removeHomeScene(ids: readonly unknown[] | null | undefined, entityId: string): string[] {
  return normalizeHomeScenes(ids).filter(id => id !== entityId);
}

/** Move an item one place up (-1) or down (1). Moving past either end changes nothing. */
export function moveHomeScene(
  ids: readonly unknown[] | null | undefined,
  entityId: string,
  direction: -1 | 1
): string[] {
  const list = normalizeHomeScenes(ids);
  const index = list.indexOf(entityId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= list.length) return list;
  [list[index], list[target]] = [list[target]!, list[index]!];
  return list;
}

/** Move an item to `targetIndex`, as a drag and drop does. */
export function moveHomeSceneTo(
  ids: readonly unknown[] | null | undefined,
  entityId: string,
  targetIndex: number
): string[] {
  const list = normalizeHomeScenes(ids);
  const index = list.indexOf(entityId);
  if (index < 0 || !Number.isInteger(targetIndex)) return list;
  const target = Math.max(0, Math.min(list.length - 1, targetIndex));
  if (target === index) return list;
  list.splice(index, 1);
  list.splice(target, 0, entityId);
  return list;
}

/**
 * The picked items Home shows, in stored order. Deleted and disabled entities
 * (no state) and entities hidden in Home Assistant are skipped. Unavailable
 * entities follow the "hide unavailable entities" setting: hidden when it is
 * on, otherwise shown disabled.
 */
export function resolveHomeSceneItems(
  ids: readonly unknown[] | null | undefined,
  states: Record<string, Pick<HassEntity, 'entity_id' | 'state'> | undefined>,
  registry: Record<string, RegistryVisibilityFields | undefined>,
  hideUnavailable: boolean
): HomeSceneItem[] {
  const items: HomeSceneItem[] = [];
  for (const entityId of normalizeHomeScenes(ids)) {
    const state = states[entityId];
    if (!state) continue;
    const entry = registry[entityId];
    if (entry && (entry.hidden_by || entry.hidden === true || entry.disabled_by)) continue;
    const unavailable = isHiddenAsUnavailable(state);
    if (unavailable && hideUnavailable) continue;
    items.push({ entityId, domain: homeSceneDomain(entityId)!, unavailable });
  }
  return items;
}

/** Scene and script entity ids that can be picked: they have a state and are visible in the registry. */
export function pickableHomeSceneIds(
  states: Record<string, unknown>,
  registry: Record<string, RegistryVisibilityFields | undefined>
): string[] {
  return Object.keys(states).filter(entityId =>
    Boolean(homeSceneDomain(entityId)) && isRegistryEntryVisible(registry[entityId])
  );
}

/**
 * Candidates that are not picked yet and match the search query on name,
 * area or entity id, sorted by name.
 */
export function filterHomeSceneCandidates(
  candidates: readonly HomeSceneCandidate[],
  picked: readonly string[],
  query: string,
  locale?: string
): HomeSceneCandidate[] {
  const pickedSet = new Set(picked);
  const needle = query.trim().toLocaleLowerCase(locale);
  return candidates
    .filter(candidate => !pickedSet.has(candidate.entityId))
    .filter(candidate => {
      if (!needle) return true;
      return [candidate.name, candidate.areaName || '', candidate.entityId]
        .some(value => value.toLocaleLowerCase(locale).includes(needle));
    })
    .sort((left, right) =>
      left.name.localeCompare(right.name, locale) || left.entityId.localeCompare(right.entityId)
    );
}
