import { describe, expect, it } from 'vitest';
import {
  DEFAULT_HOME_INFORMATION_CARDS,
  DEFAULT_HOME_SECTIONS_ORDER,
  HOME_INFORMATION_CARD_META,
  HOME_SECTION_META,
  normalizeHiddenHomeInformationCards,
  normalizeHiddenHomeSections,
  normalizeHomeSectionsOrder,
} from '../src/utils/home-sections';
import { hasDdTranslation } from '../src/utils/localize';

describe('normalizeHomeSectionsOrder', () => {
  it('returns the default order when nothing is stored', () => {
    expect(normalizeHomeSectionsOrder()).toEqual(DEFAULT_HOME_SECTIONS_ORDER);
    expect(normalizeHomeSectionsOrder([])).toEqual(DEFAULT_HOME_SECTIONS_ORDER);
  });

  it('keeps a complete stored order', () => {
    const order = ['favorites', 'summaries', 'areas', 'cameras', 'devices', 'todos', 'custom_cards'];
    expect(normalizeHomeSectionsOrder(order)).toEqual(order);
  });

  it('drops unknown and duplicate sections', () => {
    expect(normalizeHomeSectionsOrder(['areas', 'weather', 'areas', 42, null, 'cameras'])).toEqual([
      'areas',
      'cameras',
      'devices',
      'todos',
      'custom_cards',
      'favorites',
      'summaries',
    ]);
  });

  it('inserts sections added in a newer version next to their default neighbours', () => {
    // An order saved before "todos" and "summaries" existed.
    expect(normalizeHomeSectionsOrder(['cameras', 'areas', 'devices', 'custom_cards', 'favorites'])).toEqual([
      'cameras',
      'areas',
      'devices',
      'todos',
      'custom_cards',
      'favorites',
      'summaries',
    ]);
  });
});

describe('normalizeHiddenHomeSections', () => {
  it('keeps only known sections once', () => {
    expect(normalizeHiddenHomeSections(['todos', 'todos', 'unknown', 'cameras'])).toEqual(['todos', 'cameras']);
    expect(normalizeHiddenHomeSections(undefined)).toEqual([]);
  });
});

describe('normalizeHiddenHomeInformationCards', () => {
  it('accepts the outdoor climate card', () => {
    expect(normalizeHiddenHomeInformationCards(['outdoor_climate'])).toEqual(['outdoor_climate']);
  });

  it('keeps only known cards once', () => {
    expect(normalizeHiddenHomeInformationCards(['power', 'weather', 'power', 'people', 7])).toEqual(['power', 'people']);
    expect(normalizeHiddenHomeInformationCards()).toEqual([]);
  });
});

describe('home section metadata', () => {
  it('describes every section and information card', () => {
    expect(Object.keys(HOME_SECTION_META).sort()).toEqual([...DEFAULT_HOME_SECTIONS_ORDER].sort());
    expect(Object.keys(HOME_INFORMATION_CARD_META).sort()).toEqual([...DEFAULT_HOME_INFORMATION_CARDS].sort());
    expect(DEFAULT_HOME_INFORMATION_CARDS).toContain('outdoor_climate');
  });

  it('only uses translation keys that exist', () => {
    const metas = [...Object.values(HOME_SECTION_META), ...Object.values(HOME_INFORMATION_CARD_META)];
    for (const meta of metas) {
      expect(hasDdTranslation(meta.labelKey), meta.labelKey).toBe(true);
      expect(hasDdTranslation(meta.descriptionKey), meta.descriptionKey).toBe(true);
      expect(meta.icon).toMatch(/^mdi:[a-z0-9-]+$/);
    }
  });
});
