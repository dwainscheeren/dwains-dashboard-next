import type { HassEntity, HomeAssistant } from '../types/home-assistant';

// Several helpers only look at a few domains, but walking every state of a
// large installation is the expensive part. Home Assistant never changes a
// states object in place (a change produces a new object), so the states can
// be grouped once per states object and shared by every helper.

export interface StateIndex {
  /** States per entity domain, in the order of the states object. */
  byDomain: ReadonlyMap<string, readonly HassEntity[]>;
  /** States with an `area_id` attribute, in the order of the states object. */
  withAreaAttribute: readonly HassEntity[];
}

const EMPTY: readonly HassEntity[] = [];
const indexes = new WeakMap<object, StateIndex>();

export function getStateIndex(states: HomeAssistant['states']): StateIndex {
  let index = indexes.get(states);
  if (index) return index;

  const byDomain = new Map<string, HassEntity[]>();
  const withAreaAttribute: HassEntity[] = [];
  for (const key in states) {
    const state = states[key];
    const entityId = state?.entity_id;
    if (typeof entityId !== 'string') continue;

    const dot = entityId.indexOf('.');
    const domain = dot === -1 ? entityId : entityId.slice(0, dot);
    let list = byDomain.get(domain);
    if (!list) {
      list = [];
      byDomain.set(domain, list);
    }
    list.push(state!);

    const areaId = state!.attributes?.area_id;
    if (typeof areaId === 'string' && areaId) withAreaAttribute.push(state!);
  }

  index = { byDomain, withAreaAttribute };
  indexes.set(states, index);
  return index;
}

/** States of one domain, in the order of the states object. */
export function getDomainStates(states: HomeAssistant['states'], domain: string): readonly HassEntity[] {
  return getStateIndex(states).byDomain.get(domain) || EMPTY;
}
