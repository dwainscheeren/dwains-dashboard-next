import { describe, expect, it } from 'vitest';
import { AreaEntityResolver } from '../src/utils/area-entity-resolver';
import {
  isHiddenAsUnavailable,
  isUnknownNormalForDomain,
  splitHiddenUnavailableEntities,
} from '../src/utils/entity-availability';
import { isHomeRelevantStateChange } from '../src/utils/state-relevance';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

describe('isHiddenAsUnavailable', () => {
  it('hides unavailable entities of every domain', () => {
    for (const entityId of ['light.a', 'sensor.a', 'button.a', 'input_button.a', 'scene.a', 'event.a']) {
      expect(isHiddenAsUnavailable(entityState(entityId, 'unavailable'))).toBe(true);
    }
  });

  it('keeps never used buttons, scenes and events that are unknown', () => {
    for (const entityId of ['button.restart', 'input_button.doorbell', 'scene.movie', 'event.slaapkamer_schakelaar_knop_3']) {
      expect(isHiddenAsUnavailable(entityState(entityId, 'unknown'))).toBe(false);
    }
  });

  it('hides unknown entities of other domains, scripts and automations included', () => {
    for (const entityId of ['sensor.temp', 'light.a', 'script.run', 'automation.night', 'binary_sensor.door']) {
      expect(isHiddenAsUnavailable(entityState(entityId, 'unknown'))).toBe(true);
    }
  });

  it('keeps entities with a normal state', () => {
    expect(isHiddenAsUnavailable(entityState('button.restart', '2026-09-30T12:00:00+00:00'))).toBe(false);
    expect(isHiddenAsUnavailable(entityState('light.a', 'off'))).toBe(false);
  });

  it('names the domains where unknown is normal', () => {
    expect(isUnknownNormalForDomain('event')).toBe(true);
    expect(isUnknownNormalForDomain('script')).toBe(false);
  });
});

describe('splitHiddenUnavailableEntities', () => {
  it('counts only the entities the filter hides', () => {
    const states = {
      'light.a': entityState('light.a', 'unavailable'),
      'sensor.a': entityState('sensor.a', 'unknown'),
      'button.a': entityState('button.a', 'unknown'),
      'event.a': entityState('event.a', 'unavailable'),
      'switch.a': entityState('switch.a', 'on'),
    };
    const result = splitHiddenUnavailableEntities(
      ['light.a', 'sensor.a', 'button.a', 'event.a', 'switch.a', 'missing.a'],
      states
    );
    expect(result).toEqual({ unavailable: ['light.a', 'event.a'], unknown: ['sensor.a'] });
  });
});

describe('AreaEntityResolver unavailable filter', () => {
  const config: DwainsDashboardConfig = {
    devices: [{ device_id: 'dev-switch', name: 'Schakelaar', area_id: 'bedroom' }],
    entities: [
      { entity_id: 'event.slaapkamer_schakelaar_knop_1', device_id: 'dev-switch' },
      { entity_id: 'event.slaapkamer_schakelaar_knop_3', device_id: 'dev-switch' },
      { entity_id: 'button.identify', device_id: 'dev-switch' },
      { entity_id: 'scene.bedtime', area_id: 'bedroom' },
      { entity_id: 'sensor.battery', device_id: 'dev-switch' },
      { entity_id: 'light.ceiling', area_id: 'bedroom' },
    ],
  };
  const states = [
    entityState('event.slaapkamer_schakelaar_knop_1', '2026-09-30T08:00:00+00:00'),
    entityState('event.slaapkamer_schakelaar_knop_3', 'unknown'),
    entityState('button.identify', 'unknown'),
    entityState('scene.bedtime', 'unknown'),
    entityState('sensor.battery', 'unknown'),
    entityState('light.ceiling', 'unavailable'),
  ];

  it('shows never used events, buttons and scenes but hides other unknown and unavailable entities', () => {
    const hass = hassWithStates(states);
    const ids = new AreaEntityResolver().filteredAreaEntities('bedroom', hass, config).map((entity) => entity.entity_id);
    expect(ids).toEqual([
      'event.slaapkamer_schakelaar_knop_1',
      'event.slaapkamer_schakelaar_knop_3',
      'button.identify',
      'scene.bedtime',
    ]);
  });

  it('hides an unavailable event entity', () => {
    const hass = hassWithStates(states.map((state) =>
      state.entity_id === 'event.slaapkamer_schakelaar_knop_3' ? entityState(state.entity_id, 'unavailable') : state
    ));
    const ids = new AreaEntityResolver().filteredAreaEntities('bedroom', hass, config).map((entity) => entity.entity_id);
    expect(ids).not.toContain('event.slaapkamer_schakelaar_knop_3');
    expect(ids).toContain('event.slaapkamer_schakelaar_knop_1');
  });

  it('shows everything when the filter is turned off', () => {
    const hass = hassWithStates(states);
    const ids = new AreaEntityResolver()
      .filteredAreaEntities('bedroom', hass, { ...config, settings: { hide_unavailable_entities: false } })
      .map((entity) => entity.entity_id);
    expect(ids).toHaveLength(6);
  });
});

describe('isHomeRelevantStateChange and the unavailable filter', () => {
  const none = new Set<string>();

  it('renders when a button comes back from unavailable as unknown', () => {
    expect(isHomeRelevantStateChange(
      'button.identify',
      entityState('button.identify', 'unavailable'),
      entityState('button.identify', 'unknown'),
      none
    )).toBe(true);
  });

  it('skips a first button press, which does not change what Home shows', () => {
    expect(isHomeRelevantStateChange(
      'button.identify',
      entityState('button.identify', 'unknown'),
      entityState('button.identify', '2026-09-30T12:00:00+00:00'),
      none
    )).toBe(false);
  });

  it('still renders when another entity becomes unknown', () => {
    expect(isHomeRelevantStateChange(
      'sensor.battery',
      entityState('sensor.battery', '80'),
      entityState('sensor.battery', 'unknown'),
      none
    )).toBe(true);
  });
});
