import { describe, expect, it } from 'vitest';
import { ALWAYS_URGENT_DEVICE_CLASSES, applyStatusUrgency } from '../src/utils/status-urgency';
import {
  coverStatusKind,
  getGroupMemberIds,
  getStatusDomains,
  isCoverStatusActive,
  shouldSkipGroupEntity,
} from '../src/utils/header-status-domains';
import { isEntityVisibleInArea, isRegistryEntryVisible } from '../src/utils/entity-visibility';
import { AreaEntityResolver } from '../src/utils/area-entity-resolver';
import type { HassEntity } from '../src/types/home-assistant';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

function baseConfig(overrides: Partial<DwainsDashboardConfig> = {}): DwainsDashboardConfig {
  return {
    areas: [
      { area_id: 'living', name: 'Living room' },
      { area_id: 'attic', name: 'Attic' },
    ],
    devices: [
      { device_id: 'dev-plug', name: 'Plug', area_id: 'living' },
      { device_id: 'dev-hidden', name: 'Hidden plug', area_id: 'living' },
    ],
    entities: [],
    settings: {},
    ...overrides,
  } as DwainsDashboardConfig;
}

function coverChip(domains: ReturnType<typeof getStatusDomains>, kind: string) {
  return domains.find((item) => item.domain === 'cover' && item.statusKind === kind);
}

describe('isRegistryEntryVisible', () => {
  it('hides hidden, disabled, config and diagnostic entities', () => {
    expect(isRegistryEntryVisible(undefined)).toBe(true);
    expect(isRegistryEntryVisible({ entity_category: null })).toBe(true);
    expect(isRegistryEntryVisible({ hidden_by: 'user' })).toBe(false);
    expect(isRegistryEntryVisible({ hidden: true })).toBe(false);
    expect(isRegistryEntryVisible({ disabled_by: 'integration' })).toBe(false);
    expect(isRegistryEntryVisible({ entity_category: 'config' })).toBe(false);
    expect(isRegistryEntryVisible({ entity_category: 'diagnostic' })).toBe(false);
  });
});

describe('getStatusDomains visibility', () => {
  const states: HassEntity[] = [
    entityState('switch.tv', 'on'),
    entityState('switch.led_indicator', 'on'),
    entityState('switch.debug_mode', 'on'),
    entityState('switch.hidden_by_user', 'on'),
    entityState('switch.display_hidden', 'on'),
    entityState('switch.hidden_device', 'on'),
    entityState('switch.hidden_in_area', 'on'),
    entityState('switch.attic_fan', 'on'),
    entityState('switch.no_area', 'on'),
  ];
  const entities: Record<string, any> = {
    'switch.tv': { entity_id: 'switch.tv', device_id: 'dev-plug' },
    'switch.led_indicator': { entity_id: 'switch.led_indicator', device_id: 'dev-plug', entity_category: 'config' },
    'switch.debug_mode': { entity_id: 'switch.debug_mode', device_id: 'dev-plug', entity_category: 'diagnostic' },
    'switch.hidden_by_user': { entity_id: 'switch.hidden_by_user', area_id: 'living', hidden_by: 'user' },
    'switch.display_hidden': { entity_id: 'switch.display_hidden', area_id: 'living', hidden: true },
    'switch.hidden_device': { entity_id: 'switch.hidden_device', device_id: 'dev-hidden' },
    'switch.hidden_in_area': { entity_id: 'switch.hidden_in_area', area_id: 'living' },
    'switch.attic_fan': { entity_id: 'switch.attic_fan', area_id: 'attic' },
    'switch.no_area': { entity_id: 'switch.no_area' },
  };
  const config = baseConfig({
    entities: [
      { entity_id: 'switch.tv', device_id: 'dev-plug' },
      { entity_id: 'switch.led_indicator', device_id: 'dev-plug' },
      { entity_id: 'switch.debug_mode', device_id: 'dev-plug' },
      { entity_id: 'switch.hidden_by_user', area_id: 'living' },
      { entity_id: 'switch.display_hidden', area_id: 'living' },
      { entity_id: 'switch.hidden_device', device_id: 'dev-hidden' },
      { entity_id: 'switch.hidden_in_area', area_id: 'living' },
      { entity_id: 'switch.attic_fan', area_id: 'attic' },
      { entity_id: 'switch.no_area' },
    ],
    areas_display: { hidden: ['attic'] },
    areas_options: { living: { groups_options: { others: { hidden: ['switch.hidden_in_area'] } } } },
    device_admission: { hidden_devices: ['dev-hidden'] },
  });

  it('counts only the switches a room page shows', () => {
    const hass = hassWithStates(states, { entities });
    const domains = getStatusDomains(hass, config);
    const switches = domains.find((item) => item.domain === 'switch');
    expect(switches?.count).toBe(1);
    expect(switches?.entities).toEqual(['switch.tv']);
  });

  it('matches the entities of the room page', () => {
    const hass = hassWithStates(states, { entities });
    const resolver = new AreaEntityResolver();
    const roomSwitches = config.areas!
      .filter((area) => !config.areas_display?.hidden?.includes(area.area_id))
      .flatMap((area) => resolver.filteredAreaEntities(area.area_id, hass, config))
      .map((entity) => entity.entity_id)
      .filter((entityId) => entityId.startsWith('switch.') && hass.states[entityId]?.state === 'on');
    const statusSwitches = getStatusDomains(hass, config).find((item) => item.domain === 'switch')?.entities;
    expect(statusSwitches).toEqual(roomSwitches);
  });

  it('shows nothing until the dashboard config is loaded', () => {
    const hass = hassWithStates(states, { entities });
    expect(getStatusDomains(hass, { settings: {} } as DwainsDashboardConfig)).toEqual([]);
  });
});

describe('isEntityVisibleInArea', () => {
  it('requires a known, visible area', () => {
    const hass = hassWithStates([entityState('light.a', 'on')]);
    const config = baseConfig({ areas_display: { hidden: ['attic'] } });
    expect(isEntityVisibleInArea(hass, config, 'light.a', 'living')).toBe(true);
    expect(isEntityVisibleInArea(hass, config, 'light.a', 'attic')).toBe(false);
    expect(isEntityVisibleInArea(hass, config, 'light.a', 'garage')).toBe(false);
    expect(isEntityVisibleInArea(hass, config, 'light.a', null)).toBe(false);
  });
});

describe('group entities', () => {
  it('reads group members of the same domain', () => {
    const group = entityState('cover.all_blinds', 'open', {
      entity_id: ['cover.left', 'cover.right', 'light.other', 'cover.all_blinds', 42],
    });
    expect(getGroupMemberIds(group)).toEqual(['cover.left', 'cover.right']);
    expect(getGroupMemberIds(entityState('cover.left', 'open'))).toEqual([]);
  });

  it('skips a group only when a member is counted', () => {
    const group = entityState('cover.all_blinds', 'open', { entity_id: ['cover.left', 'cover.right'] });
    expect(shouldSkipGroupEntity(group, (id) => id === 'cover.right')).toBe(true);
    expect(shouldSkipGroupEntity(group, () => false)).toBe(false);
    expect(shouldSkipGroupEntity(entityState('cover.left', 'open'), () => true)).toBe(false);
  });

  const config = baseConfig({
    entities: [
      { entity_id: 'cover.all_blinds', area_id: 'living' },
      { entity_id: 'cover.left', area_id: 'living' },
      { entity_id: 'cover.right', area_id: 'living' },
      { entity_id: 'cover.garage_group', area_id: 'living' },
      { entity_id: 'cover.garage_door', area_id: 'attic' },
    ],
    areas_display: { hidden: ['attic'] },
  });

  it('does not count a cover group on top of its members', () => {
    const hass = hassWithStates([
      entityState('cover.all_blinds', 'closed', { entity_id: ['cover.left', 'cover.right'] }),
      entityState('cover.left', 'closed'),
      entityState('cover.right', 'closed'),
    ]);
    const shading = coverChip(getStatusDomains(hass, config), 'shading');
    expect(shading?.count).toBe(2);
    expect(shading?.entities).toEqual(['cover.left', 'cover.right']);
  });

  it('skips a group inside its own kind', () => {
    const hass = hassWithStates([
      entityState('cover.all_blinds', 'open', {
        device_class: 'window',
        entity_id: ['cover.left', 'cover.right'],
      }),
      entityState('cover.left', 'open', { device_class: 'window' }),
      entityState('cover.right', 'closed', { device_class: 'window' }),
    ]);
    const windows = coverChip(getStatusDomains(hass, config), 'window');
    expect(windows?.count).toBe(1);
    expect(windows?.entities).toEqual(['cover.left']);
  });

  it('counts a group whose members are not shown on the dashboard', () => {
    const hass = hassWithStates([
      entityState('cover.garage_group', 'open', { device_class: 'garage', entity_id: ['cover.garage_door'] }),
      entityState('cover.garage_door', 'open', { device_class: 'garage' }),
    ]);
    expect(coverChip(getStatusDomains(hass, config), 'gate')?.entities).toEqual(['cover.garage_group']);
  });

  it('keeps skipping the group when a member becomes unavailable', () => {
    const hass = hassWithStates([
      entityState('cover.all_blinds', 'closed', { entity_id: ['cover.left', 'cover.right'] }),
      entityState('cover.left', 'closed'),
      entityState('cover.right', 'unavailable'),
    ]);
    expect(coverChip(getStatusDomains(hass, config), 'shading')?.entities).toEqual(['cover.left']);
  });
});

describe('cover status kinds', () => {
  it('sorts covers by device class', () => {
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'window' }))).toBe('window');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'door' }))).toBe('door');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'garage' }))).toBe('gate');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'garage_door' }))).toBe('gate');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'gate' }))).toBe('gate');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'blind' }))).toBe('shading');
    expect(coverStatusKind(entityState('cover.a', 'open', { device_class: 'awning' }))).toBe('shading');
    expect(coverStatusKind(entityState('cover.a', 'open'))).toBe('shading');
    expect(coverStatusKind(undefined)).toBe('shading');
  });

  it('counts windows, doors and gates while they are open', () => {
    for (const device_class of ['window', 'door', 'gate']) {
      expect(isCoverStatusActive(entityState('cover.a', 'open', { device_class })), device_class).toBe(true);
      expect(isCoverStatusActive(entityState('cover.a', 'opening', { device_class })), device_class).toBe(true);
      expect(isCoverStatusActive(entityState('cover.a', 'closed', { device_class })), device_class).toBe(false);
      expect(isCoverStatusActive(entityState('cover.a', 'closing', { device_class, current_position: 20 })), device_class)
        .toBe(true);
      expect(isCoverStatusActive(entityState('cover.a', 'closed', { device_class, current_position: 0 })), device_class)
        .toBe(false);
    }
  });

  it('counts shading while it is (partly) closed', () => {
    expect(isCoverStatusActive(entityState('cover.a', 'closed', { device_class: 'shutter' }))).toBe(true);
    expect(isCoverStatusActive(entityState('cover.a', 'closing', { device_class: 'blind' }))).toBe(true);
    expect(isCoverStatusActive(entityState('cover.a', 'open', { device_class: 'curtain' }))).toBe(false);
    expect(isCoverStatusActive(entityState('cover.a', 'open', { current_position: 60 }))).toBe(true);
    expect(isCoverStatusActive(entityState('cover.a', 'open', { current_position: 100 }))).toBe(false);
    // Without a position attribute only the state counts.
    expect(isCoverStatusActive(entityState('cover.a', 'open', { current_position: null }))).toBe(false);
  });

  it('counts awnings while they are rolled out', () => {
    expect(isCoverStatusActive(entityState('cover.a', 'open', { device_class: 'awning' }))).toBe(true);
    expect(isCoverStatusActive(entityState('cover.a', 'closed', { device_class: 'awning' }))).toBe(false);
    expect(isCoverStatusActive(entityState('cover.a', 'closed', { device_class: 'awning', current_position: 30 })))
      .toBe(true);
  });

  it('ignores unavailable and unknown covers', () => {
    expect(isCoverStatusActive(entityState('cover.a', 'unavailable', { device_class: 'window' }))).toBe(false);
    expect(isCoverStatusActive(entityState('cover.a', 'unknown', { current_position: 50 }))).toBe(false);
    expect(isCoverStatusActive(undefined)).toBe(false);
  });

  const config = baseConfig({
    entities: [
      'cover.kitchen_window', 'cover.bathroom_window', 'cover.front_door', 'cover.garage', 'cover.driveway',
      'cover.living_blind', 'cover.bedroom_shutter', 'cover.terrace_awning', 'cover.test_blind',
    ].map((entity_id) => ({ entity_id, area_id: 'living' })),
  });

  it('shows one chip per kind with the active covers', () => {
    const hass = hassWithStates([
      entityState('cover.kitchen_window', 'open', { device_class: 'window' }),
      entityState('cover.bathroom_window', 'closed', { device_class: 'window', current_position: 30 }),
      entityState('cover.front_door', 'closed', { device_class: 'door' }),
      entityState('cover.garage', 'open', { device_class: 'garage' }),
      entityState('cover.driveway', 'opening', { device_class: 'gate' }),
      entityState('cover.living_blind', 'closed', { device_class: 'blind' }),
      entityState('cover.bedroom_shutter', 'open', { device_class: 'shutter', current_position: 100 }),
      entityState('cover.terrace_awning', 'open', { device_class: 'awning' }),
      entityState('cover.test_blind', 'open', { current_position: 40 }),
    ]);
    const domains = getStatusDomains(hass, config);
    const covers = domains.filter((item) => item.domain === 'cover');

    expect(covers.map((item) => item.statusKind)).toEqual(['window', 'gate', 'shading']);
    expect(coverChip(domains, 'window')).toMatchObject({
      count: 2,
      name: 'Windows',
      icon: 'mdi:window-open',
      entities: ['cover.kitchen_window', 'cover.bathroom_window'],
    });
    expect(coverChip(domains, 'door')).toBeUndefined();
    expect(coverChip(domains, 'gate')).toMatchObject({
      count: 2,
      name: 'Gates',
      entities: ['cover.garage', 'cover.driveway'],
    });
    expect(coverChip(domains, 'shading')).toMatchObject({
      count: 3,
      name: 'Shading',
      entities: ['cover.living_blind', 'cover.terrace_awning', 'cover.test_blind'],
    });
    // No device class on the chips, so View all opens the covers group.
    expect(covers.every((item) => item.deviceClass === undefined)).toBe(true);
  });

  it('shows a door chip for open door covers', () => {
    const hass = hassWithStates([entityState('cover.front_door', 'open', { device_class: 'door' })]);
    expect(coverChip(getStatusDomains(hass, config), 'door')).toMatchObject({
      count: 1,
      name: 'Doors',
      icon: 'mdi:door-open',
    });
  });
});

describe('status chip icons', () => {
  const config = baseConfig({
    entities: ['window', 'door', 'smoke', 'moisture', 'tamper']
      .map((name) => ({ entity_id: `binary_sensor.${name}`, area_id: 'living' })),
  });

  it('uses the active icon of alert sensors', () => {
    const hass = hassWithStates(['window', 'door', 'smoke', 'moisture', 'tamper']
      .map((name) => entityState(`binary_sensor.${name}`, 'on', { device_class: name })));
    const icons = Object.fromEntries(getStatusDomains(hass, config)
      .filter((item) => item.domain === 'binary_sensor')
      .map((item) => [item.deviceClass, item.icon]));
    expect(icons).toEqual({
      window: 'mdi:window-open',
      door: 'mdi:door-open',
      smoke: 'mdi:smoke-detector-alert',
      moisture: 'mdi:water-alert',
      tamper: 'mdi:lock-alert',
    });
  });
});

describe('urgent safety sensors', () => {
  it('shows each active urgent class and omits inactive or unavailable sensors', () => {
    const classes = [...ALWAYS_URGENT_DEVICE_CLASSES];
    const active = classes.map(deviceClass => entityState(`binary_sensor.${deviceClass}`, 'on', { device_class: deviceClass }));
    const hass = hassWithStates([
      ...active,
      entityState('binary_sensor.co_clear', 'off', { device_class: 'carbon_monoxide' }),
      entityState('binary_sensor.co_unavailable', 'unavailable', { device_class: 'carbon_monoxide' }),
    ]);
    const config = baseConfig({
      entities: Object.keys(hass.states).map(entity_id => ({ entity_id, area_id: 'living' })),
    });

    const statuses = applyStatusUrgency(getStatusDomains(hass, config), false);
    expect(statuses).toHaveLength(classes.length);
    for (const deviceClass of classes) {
      expect(statuses).toContainEqual(expect.objectContaining({
        domain: 'binary_sensor',
        deviceClass,
        urgent: true,
        count: 1,
        entities: [`binary_sensor.${deviceClass}`],
      }));
    }
  });
});
