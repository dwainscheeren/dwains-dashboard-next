import { describe, expect, it } from 'vitest';
import { getGroupMemberIds, getStatusDomains, shouldSkipGroupEntity } from '../src/utils/header-status-domains';
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

function countFor(domains: ReturnType<typeof getStatusDomains>, domain: string): number {
  return domains.find((item) => item.domain === domain)?.count ?? 0;
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
      entityState('cover.all_blinds', 'open', { entity_id: ['cover.left', 'cover.right'] }),
      entityState('cover.left', 'open'),
      entityState('cover.right', 'open'),
    ]);
    const covers = getStatusDomains(hass, config).find((item) => item.domain === 'cover');
    expect(covers?.count).toBe(2);
    expect(covers?.entities).toEqual(['cover.left', 'cover.right']);
  });

  it('counts a group whose members are not shown on the dashboard', () => {
    const hass = hassWithStates([
      entityState('cover.garage_group', 'open', { entity_id: ['cover.garage_door'] }),
      entityState('cover.garage_door', 'open'),
    ]);
    expect(countFor(getStatusDomains(hass, config), 'cover')).toBe(1);
  });

  it('keeps skipping the group when a member becomes unavailable', () => {
    const hass = hassWithStates([
      entityState('cover.all_blinds', 'open', { entity_id: ['cover.left', 'cover.right'] }),
      entityState('cover.left', 'open'),
      entityState('cover.right', 'unavailable'),
    ]);
    const covers = getStatusDomains(hass, config).find((item) => item.domain === 'cover');
    expect(covers?.entities).toEqual(['cover.left']);
  });
});
