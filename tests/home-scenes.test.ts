import { describe, expect, it } from 'vitest';
import {
  addHomeScene,
  filterHomeSceneCandidates,
  homeSceneDomain,
  moveHomeScene,
  moveHomeSceneTo,
  normalizeHomeScenes,
  pickableHomeSceneIds,
  removeHomeScene,
  resolveHomeSceneItems,
} from '../src/utils/home-scenes';
import { isHomeRelevantStateChange } from '../src/utils/state-relevance';

const state = (entity_id: string, value: string) => ({ entity_id, state: value });

describe('homeSceneDomain', () => {
  it('accepts scene and script ids only', () => {
    expect(homeSceneDomain('scene.movie')).toBe('scene');
    expect(homeSceneDomain('script.good_night')).toBe('script');
    expect(homeSceneDomain('light.kitchen')).toBeUndefined();
    expect(homeSceneDomain('scene')).toBeUndefined();
    expect(homeSceneDomain('scene.')).toBeUndefined();
    expect(homeSceneDomain('.movie')).toBeUndefined();
    expect(homeSceneDomain(42)).toBeUndefined();
  });
});

describe('normalizeHomeScenes', () => {
  it('keeps scene and script ids once, in stored order', () => {
    expect(normalizeHomeScenes(['script.b', 'scene.a', 'light.x', 'script.b', null, 7, 'scene.a', 'scene.c']))
      .toEqual(['script.b', 'scene.a', 'scene.c']);
  });

  it('returns an empty list for missing or broken settings', () => {
    expect(normalizeHomeScenes()).toEqual([]);
    expect(normalizeHomeScenes(null)).toEqual([]);
    expect(normalizeHomeScenes('scene.a' as unknown as string[])).toEqual([]);
  });
});

describe('home scene list helpers', () => {
  const list = ['scene.a', 'script.b', 'scene.c'];

  it('adds to the end once', () => {
    expect(addHomeScene(list, 'script.d')).toEqual(['scene.a', 'script.b', 'scene.c', 'script.d']);
    expect(addHomeScene(list, 'scene.a')).toEqual(list);
    expect(addHomeScene(list, 'light.kitchen')).toEqual(list);
    expect(addHomeScene(undefined, 'scene.a')).toEqual(['scene.a']);
  });

  it('removes an item', () => {
    expect(removeHomeScene(list, 'script.b')).toEqual(['scene.a', 'scene.c']);
    expect(removeHomeScene(list, 'scene.missing')).toEqual(list);
  });

  it('moves an item up and down', () => {
    expect(moveHomeScene(list, 'script.b', -1)).toEqual(['script.b', 'scene.a', 'scene.c']);
    expect(moveHomeScene(list, 'script.b', 1)).toEqual(['scene.a', 'scene.c', 'script.b']);
  });

  it('does not move past either end or unknown items', () => {
    expect(moveHomeScene(list, 'scene.a', -1)).toEqual(list);
    expect(moveHomeScene(list, 'scene.c', 1)).toEqual(list);
    expect(moveHomeScene(list, 'scene.missing', 1)).toEqual(list);
  });

  it('moves an item to a drop position', () => {
    expect(moveHomeSceneTo(list, 'scene.c', 0)).toEqual(['scene.c', 'scene.a', 'script.b']);
    expect(moveHomeSceneTo(list, 'scene.a', 2)).toEqual(['script.b', 'scene.c', 'scene.a']);
    expect(moveHomeSceneTo(list, 'scene.a', 99)).toEqual(['script.b', 'scene.c', 'scene.a']);
    expect(moveHomeSceneTo(list, 'scene.a', 0)).toEqual(list);
    expect(moveHomeSceneTo(list, 'scene.missing', 0)).toEqual(list);
  });

  it('never changes the list it is given', () => {
    const stored = ['scene.a', 'script.b'];
    moveHomeScene(stored, 'scene.a', 1);
    moveHomeSceneTo(stored, 'script.b', 0);
    addHomeScene(stored, 'scene.c');
    removeHomeScene(stored, 'scene.a');
    expect(stored).toEqual(['scene.a', 'script.b']);
  });
});

describe('resolveHomeSceneItems', () => {
  const states = {
    'scene.movie': state('scene.movie', '2026-09-30T20:00:00+00:00'),
    'scene.never': state('scene.never', 'unknown'),
    'scene.broken': state('scene.broken', 'unavailable'),
    'script.night': state('script.night', 'on'),
    'script.hidden': state('script.hidden', 'off'),
    'script.unknown': state('script.unknown', 'unknown'),
  };
  const registry = {
    'script.hidden': { hidden_by: 'user' },
  };
  const picked = ['script.night', 'scene.deleted', 'scene.movie', 'script.hidden', 'scene.broken', 'scene.never', 'script.unknown'];

  it('skips deleted and hidden entities and keeps the picked order', () => {
    expect(resolveHomeSceneItems(picked, states, registry, true)).toEqual([
      { entityId: 'script.night', domain: 'script', unavailable: false },
      { entityId: 'scene.movie', domain: 'scene', unavailable: false },
      { entityId: 'scene.never', domain: 'scene', unavailable: false },
    ]);
  });

  it('shows unavailable entities disabled when they are not hidden', () => {
    expect(resolveHomeSceneItems(picked, states, registry, false)).toEqual([
      { entityId: 'script.night', domain: 'script', unavailable: false },
      { entityId: 'scene.movie', domain: 'scene', unavailable: false },
      { entityId: 'scene.broken', domain: 'scene', unavailable: true },
      { entityId: 'scene.never', domain: 'scene', unavailable: false },
      { entityId: 'script.unknown', domain: 'script', unavailable: true },
    ]);
  });

  it('skips entities that are not scenes or scripts', () => {
    expect(resolveHomeSceneItems(['light.kitchen'], { 'light.kitchen': state('light.kitchen', 'on') }, {}, true)).toEqual([]);
  });

  it('skips entities hidden through the display registry and disabled entities', () => {
    expect(resolveHomeSceneItems(
      ['scene.movie', 'script.night'],
      states,
      { 'scene.movie': { hidden: true }, 'script.night': { disabled_by: 'user' } },
      true
    )).toEqual([]);
  });
});

describe('pickableHomeSceneIds', () => {
  it('lists visible scenes and scripts', () => {
    const states = {
      'scene.a': {},
      'script.b': {},
      'script.hidden': {},
      'scene.config': {},
      'light.c': {},
    };
    const registry = {
      'script.hidden': { hidden_by: 'integration' },
      'scene.config': { entity_category: 'config' },
    };
    expect(pickableHomeSceneIds(states, registry)).toEqual(['scene.a', 'script.b']);
  });
});

describe('filterHomeSceneCandidates', () => {
  const candidates = [
    { entityId: 'script.good_night', name: 'Good night' },
    { entityId: 'scene.movie', name: 'Movie time', areaName: 'Living room' },
    { entityId: 'scene.dinner', name: 'Dinner', areaName: 'Kitchen' },
  ];

  it('leaves out picked items and sorts by name', () => {
    expect(filterHomeSceneCandidates(candidates, ['scene.dinner'], '').map(c => c.entityId))
      .toEqual(['script.good_night', 'scene.movie']);
  });

  it('matches the name, the area and the entity id without regard to case', () => {
    expect(filterHomeSceneCandidates(candidates, [], 'MOVIE').map(c => c.entityId)).toEqual(['scene.movie']);
    expect(filterHomeSceneCandidates(candidates, [], 'kitchen').map(c => c.entityId)).toEqual(['scene.dinner']);
    expect(filterHomeSceneCandidates(candidates, [], 'script.').map(c => c.entityId)).toEqual(['script.good_night']);
    expect(filterHomeSceneCandidates(candidates, [], '  night ').map(c => c.entityId)).toEqual(['script.good_night']);
    expect(filterHomeSceneCandidates(candidates, [], 'garage')).toEqual([]);
  });
});

describe('Home relevance of picked scenes and scripts', () => {
  const oldScene = { entity_id: 'scene.movie', state: 'unknown', attributes: {} } as any;
  const newScene = { ...oldScene, state: '2026-10-01T08:00:00+00:00' };
  const oldScript = { entity_id: 'script.night', state: 'off', attributes: {} } as any;
  const newScript = { ...oldScript, state: 'on' };

  it('renders Home again for picked entities only', () => {
    const picked = new Set(normalizeHomeScenes(['scene.movie', 'script.night']));
    expect(isHomeRelevantStateChange('scene.movie', oldScene, newScene, picked)).toBe(true);
    expect(isHomeRelevantStateChange('script.night', oldScript, newScript, picked)).toBe(true);
    expect(isHomeRelevantStateChange('scene.movie', oldScene, newScene, new Set())).toBe(false);
    expect(isHomeRelevantStateChange('script.night', oldScript, newScript, new Set())).toBe(false);
  });
});
