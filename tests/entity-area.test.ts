import { describe, expect, it } from 'vitest';
import { AreaEntityResolver } from '../src/utils/area-entity-resolver';
import { configEntityAreaId, isConfigEntityInArea, resolveStatusEntityAreaId } from '../src/utils/entity-lookups';
import type { DwainsDashboardConfig } from '../src/types/strategy';
import { entityState, hassWithStates } from './helpers';

// A motion sensor device in the hallway, with its light level entity moved to
// the living room in Home Assistant.
const config: DwainsDashboardConfig = {
  devices: [
    { device_id: 'dev-motion', name: 'Motion sensor', area_id: 'hallway' },
    { device_id: 'dev-plug', name: 'Plug', area_id: null },
  ],
  entities: [
    { entity_id: 'binary_sensor.motion', device_id: 'dev-motion', area_id: null },
    { entity_id: 'sensor.light_level', device_id: 'dev-motion', area_id: 'living_room' },
    { entity_id: 'switch.plug', device_id: 'dev-plug', area_id: null },
    { entity_id: 'light.ceiling', device_id: null, area_id: 'living_room' },
  ],
};

describe('configEntityAreaId', () => {
  it('uses the own area of the entity before the area of its device', () => {
    expect(configEntityAreaId(config, { area_id: 'living_room', device_id: 'dev-motion' })).toBe('living_room');
  });

  it('falls back to the area of the device', () => {
    expect(configEntityAreaId(config, { area_id: null, device_id: 'dev-motion' })).toBe('hallway');
  });

  it('has no area without an own area and a device area', () => {
    expect(configEntityAreaId(config, { area_id: null, device_id: 'dev-plug' })).toBeFalsy();
    expect(configEntityAreaId(config, { area_id: null, device_id: 'dev-missing' })).toBeFalsy();
    expect(configEntityAreaId(config, { area_id: null, device_id: null })).toBeFalsy();
  });
});

describe('isConfigEntityInArea', () => {
  it('places an entity with its own area only in that area', () => {
    const entity = { area_id: 'living_room', device_id: 'dev-motion' };
    expect(isConfigEntityInArea(config, entity, 'living_room')).toBe(true);
    expect(isConfigEntityInArea(config, entity, 'hallway')).toBe(false);
  });

  it('never matches an empty area id', () => {
    expect(isConfigEntityInArea(config, { area_id: null, device_id: 'dev-plug' }, '')).toBe(false);
  });
});

describe('AreaEntityResolver area membership', () => {
  const hass = hassWithStates([
    entityState('binary_sensor.motion', 'off'),
    entityState('sensor.light_level', '120'),
    entityState('switch.plug', 'on'),
    entityState('light.ceiling', 'on'),
  ]);

  it('shows an entity moved to another area only in that area', () => {
    const resolver = new AreaEntityResolver();
    const ids = (areaId: string) => resolver.areaEntities(areaId, hass, config).map((entity) => entity.entity_id);
    expect(ids('hallway')).toEqual(['binary_sensor.motion']);
    expect(ids('living_room')).toEqual(['sensor.light_level', 'light.ceiling']);
  });
});

describe('resolveStatusEntityAreaId', () => {
  it('uses the entity area, then the device area, then the registry', () => {
    const hass = hassWithStates([], { entities: { 'switch.other': { entity_id: 'switch.other', area_id: 'garden' } } });
    expect(resolveStatusEntityAreaId(hass, config, 'sensor.light_level')).toBe('living_room');
    expect(resolveStatusEntityAreaId(hass, config, 'binary_sensor.motion')).toBe('hallway');
    expect(resolveStatusEntityAreaId(hass, config, 'switch.other')).toBe('garden');
  });
});
