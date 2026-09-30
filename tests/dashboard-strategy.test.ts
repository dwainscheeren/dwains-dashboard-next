import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DwainsDashboardStrategy } from '../src/strategies/dashboard-strategy';
import { DwainsViewStrategy } from '../src/strategies/view-strategy';
import type { DwainsDashboardConfig, LovelaceCardConfig, LovelaceViewConfig } from '../src/types/strategy';
import { mockHass } from './helpers';
import { resetEnergyPowerConfigCache } from '../src/utils/energy-prefs';
import { getEntityRegistry } from '../src/utils/entity-registry';

// Keys that are not stored by the user: registry data is loaded live on every
// render and the rest are legacy fields the strategy does not own.
type NotPersistedKey = 'type' | 'areas' | 'devices' | 'entities' | 'floors' | 'views' | 'persons' | 'global_options';
type PersistedKey = Exclude<keyof DwainsDashboardConfig, NotPersistedKey>;

// One realistic value for every persisted key. The mapped type makes this a
// compile error (npm run type-check) when a new option is added to
// DwainsDashboardConfig without extending this contract test.
const PERSISTED: { [K in PersistedKey]-?: NonNullable<DwainsDashboardConfig[K]> } = {
  settings: {
    theme: 'dark',
    show_weather: true,
    weather_entity_id: 'weather.home',
    home_sections_order: ['favorites', 'areas', 'custom_cards'],
    home_information_cards_hidden: ['outdoor_climate'],
    home_outdoor_climate_areas: ['garden'],
    master_action_confirmations: { light: true },
  },
  areas_display: { hidden: ['garden'], order: ['kitchen', 'living_room'], sort_mode: 'custom' },
  floors_display: { order: ['first', 'ground'] },
  areas_options: {
    living_room: {
      card_size: 'large',
      entity_layout: 'ungrouped',
      entity_order: ['light.reading_lamp'],
      groups_options: { lights: { hidden: ['light.old'], order: ['light.reading_lamp'] } },
      custom_cards: [{ id: 'area-card-1', placement: 'top', card: { type: 'markdown', content: 'Hi' } }],
    },
  },
  favorites: ['light.reading_lamp', 'switch.plug'],
  home_custom_cards: [
    { id: 'home-card-1', card: { type: 'weather-forecast', entity: 'weather.home' } },
    { id: 'home-card-2', card: { type: 'custom:mushroom-title-card', title: 'Welcome' } },
  ],
  pages: [
    {
      id: 'energy',
      name: 'Energy',
      icon: 'mdi:flash',
      blueprint: 'blueprint:\n  name: Energy\ncard:\n  type: energy-distribution\n',
      source: 'https://github.com/dwainscheeren/dwains-dashboard-blueprints',
      inputs: { title: 'Energy' },
      card: { type: 'energy-distribution' },
    },
  ],
  blueprint_replacements: {
    area_cards: {
      by_domain: {
        light: { id: 'rep-1', name: 'Mushroom light', blueprint: 'blueprint:\n  name: x\ncard:\n  type: tile\n', enabled: true },
      },
    },
  },
  device_admission: { hidden_devices: ['dev-plug'], first_seen_devices: { 'dev-lamp': 1767225600000 } },
};

const PERSISTED_KEYS = Object.keys(PERSISTED) as PersistedKey[];

const storedConfig = () => ({
  type: 'custom:dwains-dashboard-next',
  title: 'My home',
  ...structuredClone(PERSISTED),
});

function viewByPath(views: LovelaceViewConfig[], path: string): LovelaceViewConfig {
  const view = views.find((candidate) => candidate.path === path);
  if (!view) throw new Error(`View ${path} not found`);
  return view;
}

async function layoutCardFor(config: Record<string, any>, hass = mockHass()): Promise<LovelaceCardConfig> {
  const dashboard = await new DwainsDashboardStrategy().generate(config as any, hass);
  const home = viewByPath(dashboard.views, 'home');
  const view = await new DwainsViewStrategy().generate(home.strategy as any, hass);
  const card = view.cards?.[0];
  if (!card) throw new Error('Layout card missing');
  return card;
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

describe('dashboard settings pass-through', () => {
  it('covers every persisted key in this contract', () => {
    expect(PERSISTED_KEYS.sort()).toEqual([
      'areas_display',
      'areas_options',
      'blueprint_replacements',
      'device_admission',
      'favorites',
      'floors_display',
      'home_custom_cards',
      'pages',
      'settings',
    ]);
  });

  it.each(PERSISTED_KEYS)('passes %s to the Home view strategy', async (key) => {
    const dashboard = await new DwainsDashboardStrategy().generate(storedConfig(), mockHass());
    const home = viewByPath(dashboard.views, 'home');
    expect(home.strategy?.type).toBe('custom:dwains-dashboard-next-view');
    expect(home.strategy?.[key]).toEqual(PERSISTED[key]);
  });

  it.each(PERSISTED_KEYS)('passes %s through the view strategy to the layout card', async (key) => {
    const card = await layoutCardFor(storedConfig());
    expect(card.type).toBe('custom:dwains-dashboard-next-layout-card');
    expect(card[key]).toEqual(PERSISTED[key]);
  });

  it.each(PERSISTED_KEYS)('passes %s to the Devices view card', async (key) => {
    const dashboard = await new DwainsDashboardStrategy().generate(storedConfig(), mockHass());
    const card = viewByPath(dashboard.views, 'devices').cards?.[0];
    expect(card?.type).toBe('custom:dwains-dashboard-next-devices-card');
    expect(card?.[key]).toEqual(PERSISTED[key]);
  });

  it('keeps Home custom cards when the config has no other options', async () => {
    const homeCustomCards = PERSISTED.home_custom_cards;
    const card = await layoutCardFor({
      type: 'custom:dwains-dashboard-next',
      home_custom_cards: structuredClone(homeCustomCards),
    });
    expect(card.home_custom_cards).toEqual(homeCustomCards);
  });

  it('fills safe defaults for a fresh dashboard', async () => {
    const card = await layoutCardFor({ type: 'custom:dwains-dashboard-next' });
    expect(card).toMatchObject({
      settings: {},
      favorites: [],
      home_custom_cards: [],
      pages: [],
      blueprint_replacements: {},
      device_admission: {},
    });
    expect(card.areas_display).toBeUndefined();
    expect(card.floors_display).toBeUndefined();
    expect(card.areas_options).toBeUndefined();
  });

  it('does not share mutable defaults between renders', async () => {
    const first = await layoutCardFor({ type: 'custom:dwains-dashboard-next' });
    first.home_custom_cards.push({ id: 'leak', card: { type: 'markdown' } });
    const second = await layoutCardFor({ type: 'custom:dwains-dashboard-next' });
    expect(second.home_custom_cards).toEqual([]);
  });
});

describe('DwainsDashboardStrategy', () => {
  it('loads the registries and starts loading the energy settings', async () => {
    resetEnergyPowerConfigCache();
    const hass = mockHass();
    await new DwainsDashboardStrategy().generate(storedConfig(), hass);
    const types = vi.mocked(hass.callWS).mock.calls.map(([msg]) => msg.type).sort();
    expect(types).toEqual([
      'config/area_registry/list',
      'config/device_registry/list',
      'config/entity_registry/list',
      'config/floor_registry/list',
      'energy/get_prefs',
    ]);
  });

  it('maps the registries into the layout card config', async () => {
    const card = await layoutCardFor(storedConfig());
    expect(card.areas).toEqual([
      {
        area_id: 'living_room',
        name: 'Living room',
        picture: null,
        icon: 'mdi:sofa',
        floor_id: 'ground',
        temperature_entity_id: 'sensor.living_temperature',
        humidity_entity_id: null,
      },
      {
        area_id: 'kitchen',
        name: 'Kitchen',
        picture: '/local/kitchen.jpg',
        icon: null,
        floor_id: 'ground',
        temperature_entity_id: undefined,
        humidity_entity_id: undefined,
      },
      {
        area_id: 'garden',
        name: 'Garden',
        picture: null,
        icon: null,
        floor_id: null,
        temperature_entity_id: undefined,
        humidity_entity_id: undefined,
      },
    ]);
    // The user-given device name wins over the integration name.
    expect(card.devices).toEqual([
      { device_id: 'dev-lamp', name: 'Reading lamp', area_id: 'living_room', created_at: '2026-09-01T10:00:00Z' },
      { device_id: 'dev-plug', name: 'Smart plug', area_id: null, created_at: undefined },
    ]);
    expect(card.entities.map((entity: any) => entity.entity_id)).toEqual([
      'light.reading_lamp',
      'switch.plug',
      'sensor.living_temperature',
    ]);
    expect(card.floors).toEqual([
      { floor_id: 'ground', name: 'Ground floor' },
      { floor_id: 'first', name: 'First floor' },
    ]);
  });

  it('leaves the shared hass object alone and keeps the full entity registry itself', async () => {
    const hass = mockHass();
    const before = { areas: hass.areas, devices: hass.devices, entities: hass.entities, floors: hass.floors };
    await new DwainsDashboardStrategy().generate(storedConfig(), hass);
    // hass is shared with the rest of Home Assistant and must not be replaced.
    expect(hass.areas).toBe(before.areas);
    expect(hass.devices).toBe(before.devices);
    expect(hass.entities).toBe(before.entities);
    expect(hass.floors).toBe(before.floors);
    expect(getEntityRegistry(hass)['switch.plug']?.area_id).toBe('kitchen');
  });

  it('still renders when the floor registry is unavailable', async () => {
    const card = await layoutCardFor(storedConfig(), mockHass({ floorsFail: true }));
    expect(card.floors).toEqual([]);
    expect(card.home_custom_cards).toEqual(PERSISTED.home_custom_cards);
  });

  it('builds Home, Devices, one tab per blueprint page and the add tab', async () => {
    const dashboard = await new DwainsDashboardStrategy().generate(storedConfig(), mockHass());
    expect(dashboard.title).toBe('My home');
    expect(dashboard.views.map((view) => view.path)).toEqual(['home', 'devices', 'energy', 'add-blueprint']);

    const page = viewByPath(dashboard.views, 'energy');
    expect(page).toMatchObject({ title: 'Energy', icon: 'mdi:flash' });
    expect(page.cards?.[0]).toEqual({
      type: 'custom:dwains-dashboard-next-page-card',
      page: PERSISTED.pages[0],
      settings: PERSISTED.settings,
    });
  });

  it('uses the default title and localized view titles', async () => {
    const dashboard = await new DwainsDashboardStrategy().generate(
      { type: 'custom:dwains-dashboard-next' },
      mockHass({ language: 'nl' })
    );
    expect(dashboard.title).toBe('Dwains Dashboard');
    expect(viewByPath(dashboard.views, 'devices').title).toBe('Apparaten');
    expect(dashboard.views.map((view) => view.path)).toEqual(['home', 'devices', 'add-blueprint']);
  });

  it('hides the add blueprint tab for restricted non-admin users', async () => {
    const config = storedConfig();
    config.settings.restrict_non_admin_dashboard_settings = true;
    const nonAdmin = await new DwainsDashboardStrategy().generate(config, mockHass({ isAdmin: false }));
    expect(nonAdmin.views.map((view) => view.path)).toEqual(['home', 'devices', 'energy']);

    const admin = await new DwainsDashboardStrategy().generate(config, mockHass({ isAdmin: true }));
    expect(admin.views.map((view) => view.path)).toContain('add-blueprint');
  });
});

describe('DwainsViewStrategy', () => {
  it('renders a single panel layout card', async () => {
    const view = await new DwainsViewStrategy().generate(
      { type: 'custom:dwains-dashboard-next-view', ...structuredClone(PERSISTED) },
      mockHass()
    );
    expect(view.panel).toBe(true);
    expect(view.cards).toHaveLength(1);
    expect(view.cards?.[0]).toMatchObject({
      type: 'custom:dwains-dashboard-next-layout-card',
      areas: [],
      devices: [],
      entities: [],
      floors: [],
      ...PERSISTED,
    });
  });

  it('does not put hass into the card config', async () => {
    const hass = mockHass();
    const view = await new DwainsViewStrategy().generate({ type: 'custom:dwains-dashboard-next-view' }, hass);
    expect(Object.values(view.cards?.[0] || {})).not.toContain(hass);
    expect(view.cards?.[0]).not.toHaveProperty('hass');
  });
});
