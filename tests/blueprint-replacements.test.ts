import { describe, expect, it, vi } from 'vitest';
import {
  countReplacementAssignments,
  countReplacementRules,
  defaultEntityCardConfig,
  findReplacementAssignment,
  resolveEntityCardConfig,
} from '../src/utils/blueprint-replacements';
import type { BlueprintReplacementAssignment, DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

const hass = hassWithStates([
  entityState('light.dimmable', 'on', { supported_color_modes: ['color_temp'], brightness: 120, friendly_name: 'Dimmable' }),
  entityState('light.onoff', 'off', { supported_color_modes: ['onoff'] }),
  entityState('cover.blind', 'open', { supported_features: 15 }),
  entityState('cover.garage', 'closed', { supported_features: 3 }),
  entityState('sensor.power', '120', { unit_of_measurement: 'W' }),
  entityState('sensor.status', 'ok'),
  entityState('binary_sensor.hall_motion', 'off', { device_class: 'motion', friendly_name: 'Hall motion' }),
  entityState('binary_sensor.door', 'off', { device_class: 'door' }),
  entityState('switch.plug', 'on', { friendly_name: 'Coffee plug' }),
]);

const assignment = (name: string, card = 'tile', extra: Partial<BlueprintReplacementAssignment> = {}) => ({
  id: name,
  name,
  blueprint: [
    'blueprint:',
    `  name: ${name}`,
    '  input:',
    '    icon:',
    '      type: icon-picker',
    '      default: mdi:star',
    'card:',
    `  type: ${card}`,
    '  entity: $replace_with_input_entity$',
    '  name: $replace_with_input_name$ ($replace_with_input_area$)',
    '  icon: $icon$',
    '  domain: $replace_with_input_domain$',
    '  device_class: $replace_with_input_device_class$',
  ].join('\n'),
  ...extra,
});

describe('defaultEntityCardConfig', () => {
  it('picks a dedicated card for climate, camera and media players', () => {
    expect(defaultEntityCardConfig('climate.living', hass)).toEqual({ type: 'thermostat', entity: 'climate.living' });
    expect(defaultEntityCardConfig('camera.door', hass)).toEqual({
      type: 'picture-entity',
      entity: 'camera.door',
      camera_view: 'live',
    });
    expect(defaultEntityCardConfig('media_player.tv', hass)).toEqual({ type: 'media-control', entity: 'media_player.tv' });
  });

  it('adds brightness and color temperature features to dimmable lights', () => {
    expect(defaultEntityCardConfig('light.dimmable', hass)).toEqual({
      type: 'tile',
      entity: 'light.dimmable',
      state_content: ['state', 'brightness'],
      tap_action: { action: 'toggle' },
      hold_action: { action: 'more-info' },
      features_position: 'bottom',
      features: [{ type: 'light-brightness' }, { type: 'light-color-temp' }],
    });
  });

  it('keeps on/off lights simple', () => {
    const card = defaultEntityCardConfig('light.onoff', hass);
    expect(card.state_content).toBe('state');
    expect(card).not.toHaveProperty('features');
  });

  it('adds a position slider only to covers that support it', () => {
    expect(defaultEntityCardConfig('cover.blind', hass).features).toEqual([
      { type: 'cover-open-close' },
      { type: 'cover-position' },
    ]);
    expect(defaultEntityCardConfig('cover.garage', hass).features).toEqual([{ type: 'cover-open-close' }]);
  });

  it('shows a graph for measurement sensors and a tile otherwise', () => {
    expect(defaultEntityCardConfig('sensor.power', hass)).toMatchObject({ type: 'sensor', graph: 'line', hours_to_show: 24 });
    expect(defaultEntityCardConfig('sensor.status', hass)).toEqual({ type: 'tile', entity: 'sensor.status' });
  });

  it('shows when motion was last seen', () => {
    expect(defaultEntityCardConfig('binary_sensor.hall_motion', hass).state_content).toEqual(['state', 'last_changed']);
    expect(defaultEntityCardConfig('binary_sensor.door', hass)).toEqual({ type: 'tile', entity: 'binary_sensor.door' });
  });

  it('falls back to a tile', () => {
    expect(defaultEntityCardConfig('switch.plug', hass)).toEqual({ type: 'tile', entity: 'switch.plug' });
    expect(defaultEntityCardConfig('light.missing')).toMatchObject({ type: 'tile', state_content: 'state' });
  });
});

describe('findReplacementAssignment', () => {
  const byEntity = assignment('By entity');
  const byDeviceClass = assignment('By device class');
  const byDomain = assignment('By domain');
  const devicesOnly = assignment('Devices only');
  const config: DwainsDashboardConfig = {
    blueprint_replacements: {
      area_cards: {
        by_entity: { 'binary_sensor.hall_motion': byEntity },
        by_device_class: { 'binary_sensor:motion': byDeviceClass },
        by_domain: { binary_sensor: byDomain },
      },
      devices_cards: {
        by_domain: { switch: devicesOnly },
      },
    },
  };
  const find = (entity: string, surface: 'area_cards' | 'devices_cards' = 'area_cards') =>
    findReplacementAssignment({ hass, config, entity, surface });

  it('prefers entity over device class over domain', () => {
    expect(find('binary_sensor.hall_motion')).toBe(byEntity);
    expect(find('binary_sensor.other_motion')).toBe(byDomain);
    const motionHass = hassWithStates([entityState('binary_sensor.kitchen_motion', 'off', { device_class: 'motion' })]);
    expect(findReplacementAssignment({ hass: motionHass, config, entity: 'binary_sensor.kitchen_motion', surface: 'area_cards' })).toBe(byDeviceClass);
    expect(find('binary_sensor.door')).toBe(byDomain);
  });

  it('falls back to the rules of the other surface', () => {
    expect(find('switch.plug', 'area_cards')).toBe(devicesOnly);
    expect(find('binary_sensor.door', 'devices_cards')).toBe(byDomain);
  });

  it('returns undefined without a matching rule', () => {
    expect(find('light.onoff')).toBeUndefined();
    expect(findReplacementAssignment({ hass, config: {}, entity: 'light.onoff', surface: 'area_cards' })).toBeUndefined();
  });
});

describe('resolveEntityCardConfig', () => {
  const config = (rule: BlueprintReplacementAssignment): DwainsDashboardConfig => ({
    areas: [{ area_id: 'kitchen', name: 'Kitchen' }],
    devices: [{ device_id: 'dev-plug', name: 'Plug', area_id: 'kitchen' }],
    entities: [{ entity_id: 'switch.plug', device_id: 'dev-plug', area_id: null }],
    blueprint_replacements: { area_cards: { by_domain: { switch: rule } } },
  });

  it('fills the replacement blueprint with entity values and input defaults', () => {
    const card = resolveEntityCardConfig({
      hass,
      config: config(assignment('Mushroom', 'custom:mushroom-entity-card')),
      entity: 'switch.plug',
      surface: 'area_cards',
    });
    expect(card).toEqual({
      type: 'custom:mushroom-entity-card',
      entity: 'switch.plug',
      name: 'Coffee plug (Kitchen)',
      icon: 'mdi:star',
      domain: 'switch',
      device_class: '',
    });
  });

  it('uses the stored inputs over the defaults', () => {
    const card = resolveEntityCardConfig({
      hass,
      config: config(assignment('Mushroom', 'tile', { inputs: { icon: 'mdi:coffee' } })),
      entity: { entity_id: 'switch.plug', device_id: 'dev-plug' },
      surface: 'area_cards',
    });
    expect(card.icon).toBe('mdi:coffee');
  });

  it('uses the default card when the rule is disabled', () => {
    const card = resolveEntityCardConfig({
      hass,
      config: config(assignment('Off', 'tile', { enabled: false })),
      entity: 'switch.plug',
      surface: 'area_cards',
    });
    expect(card).toEqual({ type: 'tile', entity: 'switch.plug' });
  });

  it('uses the default card when the blueprint is broken', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const card = resolveEntityCardConfig({
      hass,
      config: config({ id: 'broken', name: 'Broken', blueprint: 'card:\n  type: tile\n' }),
      entity: 'switch.plug',
      surface: 'area_cards',
    });
    expect(card).toEqual({ type: 'tile', entity: 'switch.plug' });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('replacement counters', () => {
  it('counts assignments in a group', () => {
    expect(countReplacementAssignments(undefined)).toBe(0);
    expect(
      countReplacementAssignments({
        by_domain: { light: assignment('a'), switch: assignment('b') },
        by_entity: { 'light.a': assignment('c') },
      })
    ).toBe(3);
  });

  it('counts a rule used on both surfaces once', () => {
    expect(countReplacementRules(undefined)).toBe(0);
    expect(
      countReplacementRules({
        area_cards: { by_domain: { light: assignment('a') }, by_device_class: { 'sensor:power': assignment('b') } },
        devices_cards: { by_domain: { light: assignment('a'), fan: assignment('c') } },
      })
    ).toBe(3);
  });
});
