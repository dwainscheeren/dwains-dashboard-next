import { describe, expect, it } from 'vitest';
import { LIVE_DATA_KEYS, persistableConfig } from '../src/utils/dashboard-config';

const editorConfig = () => ({
  type: 'custom:dwains-dashboard-next',
  title: 'My home',
  settings: { theme: 'dark', home_sections_hidden: ['todos'] },
  favorites: ['light.reading_lamp'],
  home_custom_cards: [{ id: 'home-card-1', card: { type: 'markdown', content: 'Hello' } }],
  pages: [{ id: 'energy', name: 'Energy', blueprint: 'card:\n  type: energy\n', inputs: {}, card: { type: 'energy' } }],
  areas_options: { kitchen: { card_size: 'small' } },
  blueprint_replacements: { devices_cards: { by_domain: {} } },
  device_admission: { hidden_devices: ['dev-1'] },
  // A key a future version might add; the editor must not drop it.
  some_future_option: { enabled: true },
  // Live registry data that the editor loads for its own UI.
  areas: [{ area_id: 'kitchen', name: 'Kitchen' }],
  devices: [{ device_id: 'dev-1', name: 'Plug' }],
  entities: [{ entity_id: 'switch.plug' }],
  floors: [{ floor_id: 'ground', name: 'Ground floor' }],
});

describe('persistableConfig', () => {
  it('strips the live registry data', () => {
    const result = persistableConfig(editorConfig());
    for (const key of ['areas', 'devices', 'entities', 'floors']) {
      expect(result).not.toHaveProperty(key);
    }
  });

  it('keeps every stored option, including keys the editor does not manage', () => {
    const { areas, devices, entities, floors, ...stored } = editorConfig();
    expect(persistableConfig(editorConfig())).toEqual(stored);
  });

  it('keeps title, pages and Home custom cards untouched', () => {
    const input = editorConfig();
    const result = persistableConfig(input);
    expect(result.title).toBe('My home');
    expect(result.pages).toEqual(input.pages);
    expect(result.home_custom_cards).toEqual(input.home_custom_cards);
  });

  it('does not mutate the config it was given', () => {
    const input = editorConfig();
    const before = structuredClone(input);
    persistableConfig(input);
    expect(input).toEqual(before);
  });

  it('returns an empty object for a missing config', () => {
    expect(persistableConfig(undefined)).toEqual({});
    expect(persistableConfig(null)).toEqual({});
  });

  it('only treats registry lists as live data', () => {
    expect([...LIVE_DATA_KEYS]).toEqual(['areas', 'devices', 'entities', 'floors']);
  });
});
