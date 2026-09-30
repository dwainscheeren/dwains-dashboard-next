import type { HassEntity } from '../types/home-assistant';

type StateLike = Pick<HassEntity, 'entity_id' | 'state'>;

// Entities of these domains have no state of their own: their state is the
// time they were last used, and `unknown` until then. A button that was never
// pressed, a scene that was never activated and an event entity that has not
// seen an event yet are working entities, so `unknown` does not hide them.
// `unavailable` still does.
const UNKNOWN_IS_NORMAL_DOMAINS: ReadonlySet<string> = new Set([
  'button',
  'input_button',
  'scene',
  'event',
]);

function entityDomain(entityId: string): string {
  const dot = entityId.indexOf('.');
  return dot === -1 ? entityId : entityId.slice(0, dot);
}

/** Whether `unknown` is the normal state of a never used entity of this domain. */
export function isUnknownNormalForDomain(domain: string): boolean {
  return UNKNOWN_IS_NORMAL_DOMAINS.has(domain);
}

/**
 * Whether the "hide unavailable entities" settings hide this entity:
 * `unavailable` always, `unknown` unless it is the normal state of the domain.
 */
export function isHiddenAsUnavailable(state: StateLike): boolean {
  if (state.state === 'unavailable') return true;
  return state.state === 'unknown' && !isUnknownNormalForDomain(entityDomain(state.entity_id));
}

/**
 * Entities the "hide unavailable entities" settings hide, split by state.
 * Entities without a state are left out.
 */
export function splitHiddenUnavailableEntities(
  entityIds: Iterable<string>,
  states: Record<string, StateLike | undefined>
): { unavailable: string[]; unknown: string[] } {
  const unavailable: string[] = [];
  const unknown: string[] = [];
  for (const entityId of entityIds) {
    const state = states[entityId];
    if (!state || !isHiddenAsUnavailable(state)) continue;
    if (state.state === 'unavailable') unavailable.push(entityId);
    else unknown.push(entityId);
  }
  return { unavailable, unknown };
}
