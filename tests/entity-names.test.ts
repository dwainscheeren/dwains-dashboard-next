import { describe, expect, it } from 'vitest';
import {
  areaEntityDisplayName,
  registryEntityDisplayName,
  escapeRegExp,
  hidesAreaNameInEntityNames,
  stripAreaNameFromEntityName,
} from '../src/utils/entity-names';

describe('stripAreaNameFromEntityName', () => {
  it('removes the area name at the start', () => {
    expect(stripAreaNameFromEntityName('Kitchen Ceiling light', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaNameFromEntityName('kitchen spots', 'Kitchen')).toBe('Spots');
    expect(stripAreaNameFromEntityName('Living room - Floor lamp', 'Living room')).toBe('Floor lamp');
    expect(stripAreaNameFromEntityName('Living room: Floor lamp', 'Living room')).toBe('Floor lamp');
    expect(stripAreaNameFromEntityName('Kitchen-spots', 'Kitchen')).toBe('Spots');
  });

  it('removes the area name at the end', () => {
    expect(stripAreaNameFromEntityName('Deckenlampe Wohnzimmer', 'Wohnzimmer')).toBe('Deckenlampe');
    expect(stripAreaNameFromEntityName('Ceiling light - Kitchen', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaNameFromEntityName('Ceiling light | kitchen', 'Kitchen')).toBe('Ceiling light');
  });

  it('removes the area name between brackets', () => {
    expect(stripAreaNameFromEntityName('Ceiling light (Kitchen)', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaNameFromEntityName('Ceiling light [ Kitchen ]', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaNameFromEntityName('[Kitchen] Ceiling light', 'Kitchen')).toBe('Ceiling light');
    expect(stripAreaNameFromEntityName('(kitchen)spots', 'Kitchen')).toBe('Spots');
  });

  it('removes the area name at both ends', () => {
    expect(stripAreaNameFromEntityName('Kitchen spots (Kitchen)', 'Kitchen')).toBe('Spots');
  });

  it('leaves compound words untouched', () => {
    expect(stripAreaNameFromEntityName('Wohnzimmerlampe', 'Wohnzimmer')).toBe('Wohnzimmerlampe');
    expect(stripAreaNameFromEntityName('Kitchenette lamp', 'Kitchen')).toBe('Kitchenette lamp');
    expect(stripAreaNameFromEntityName('Lampe Wohnzimmerdecke', 'Wohnzimmer')).toBe('Lampe Wohnzimmerdecke');
    expect(stripAreaNameFromEntityName('Ceiling light', 'Kitchen')).toBe('Ceiling light');
  });

  it('treats regex characters in the area name literally', () => {
    expect(stripAreaNameFromEntityName('Room (1) Lamp', 'Room (1)')).toBe('Lamp');
    expect(stripAreaNameFromEntityName('Lamp Room (1)', 'Room (1)')).toBe('Lamp');
    expect(stripAreaNameFromEntityName('A+B Lamp', 'A+B')).toBe('Lamp');
    expect(stripAreaNameFromEntityName('AAB Lamp', 'A+B')).toBe('AAB Lamp');
    expect(stripAreaNameFromEntityName('Lamp [x.y]', 'x.y')).toBe('Lamp');
    expect(stripAreaNameFromEntityName('Lamp xzy', 'x.y')).toBe('Lamp xzy');
    expect(stripAreaNameFromEntityName('Lamp $^*?{}', '$^*?{}')).toBe('Lamp');
  });

  it('never returns an empty name', () => {
    expect(stripAreaNameFromEntityName('Kitchen', 'Kitchen')).toBe('Kitchen');
    expect(stripAreaNameFromEntityName('kitchen', 'Kitchen')).toBe('kitchen');
    expect(stripAreaNameFromEntityName('(Kitchen)', 'Kitchen')).toBe('(Kitchen)');
    expect(stripAreaNameFromEntityName('Kitchen - ', 'Kitchen')).toBe('Kitchen - ');
    expect(stripAreaNameFromEntityName('Kitchen Kitchen', 'Kitchen')).toBe('Kitchen');
    expect(stripAreaNameFromEntityName('', 'Kitchen')).toBe('');
  });

  it('keeps the name without an area', () => {
    expect(stripAreaNameFromEntityName('Kitchen lamp', '')).toBe('Kitchen lamp');
    expect(stripAreaNameFromEntityName('Kitchen lamp', undefined)).toBe('Kitchen lamp');
    expect(stripAreaNameFromEntityName('Kitchen lamp', '   ')).toBe('Kitchen lamp');
  });

  it('matches any whitespace inside the area name', () => {
    expect(stripAreaNameFromEntityName('Living  room lamp', 'Living room')).toBe('Lamp');
  });

  it('keeps brand style capitalization of the first word', () => {
    expect(stripAreaNameFromEntityName('Office iMac', 'Office')).toBe('iMac');
  });

  it('keeps the area name at the end when it is part of the sentence', () => {
    expect(stripAreaNameFromEntityName('Lamp in the kitchen', 'Kitchen')).toBe('Lamp in the kitchen');
    expect(stripAreaNameFromEntityName('Licht im Wohnzimmer', 'Wohnzimmer')).toBe('Licht im Wohnzimmer');
    expect(stripAreaNameFromEntityName('Lamp van de keuken', 'Keuken')).toBe('Lamp van de keuken');
    expect(stripAreaNameFromEntityName('Lumière de la cuisine', 'Cuisine')).toBe('Lumière de la cuisine');
    // A bracket or punctuation still marks the area name.
    expect(stripAreaNameFromEntityName('Lamp in the corner (Kitchen)', 'Kitchen')).toBe('Lamp in the corner');
    expect(stripAreaNameFromEntityName('Spot by the door - Kitchen', 'Kitchen')).toBe('Spot by the door');
  });

  it('can leave the end of the name alone', () => {
    expect(stripAreaNameFromEntityName('Lamp in the kitchen', 'Kitchen', { atEnd: false })).toBe('Lamp in the kitchen');
    expect(stripAreaNameFromEntityName('Kitchen lamp', 'Kitchen', { atEnd: false })).toBe('Lamp');
  });
});

describe('escapeRegExp', () => {
  it('escapes every special character', () => {
    const special = '.*+?^${}()|[]\\';
    expect(new RegExp(`^${escapeRegExp(special)}$`).test(special)).toBe(true);
  });
});

describe('area entity display names', () => {
  it('strips the area name unless the setting is turned off', () => {
    expect(hidesAreaNameInEntityNames(undefined)).toBe(true);
    expect(hidesAreaNameInEntityNames({})).toBe(true);
    expect(hidesAreaNameInEntityNames({ hide_area_name_in_entity_names: true })).toBe(true);
    expect(hidesAreaNameInEntityNames({ hide_area_name_in_entity_names: false })).toBe(false);
    expect(areaEntityDisplayName('Kitchen lamp', 'Kitchen', {})).toBe('Lamp');
    expect(areaEntityDisplayName('Kitchen lamp', 'Kitchen', { hide_area_name_in_entity_names: false })).toBe('Kitchen lamp');
    expect(areaEntityDisplayName('Kitchen lamp', undefined, {})).toBe('Kitchen lamp');
  });
});


describe('entity-only naming setting', () => {
  const full = 'Shelly Power Strip 3D Drucker';
  it('keeps the existing full-name behavior by default', () => {
    expect(registryEntityDisplayName(full, 'Büro', {}, '3D Drucker')).toBe(full);
  });
  it('uses the registry entity name when explicitly enabled', () => {
    expect(registryEntityDisplayName(full, 'Büro', { use_entity_name_only: true }, '3D Drucker')).toBe('3D Drucker');
  });
  it('handles area stripping independently of the entity-only setting', () => {
    const name = 'Deckenlampe Schlafzimmer';
    expect(registryEntityDisplayName('Device ' + name, 'Schlafzimmer', { use_entity_name_only: true }, name)).toBe('Deckenlampe');
    expect(registryEntityDisplayName('Device ' + name, 'Schlafzimmer', { use_entity_name_only: true, hide_area_name_in_entity_names: false }, name)).toBe(name);
  });
  it('falls back to the full name when registry has no distinct name', () => {
    expect(registryEntityDisplayName(full, 'Büro', { use_entity_name_only: true }, null)).toBe(full);
    expect(registryEntityDisplayName(full, 'Büro', { use_entity_name_only: true }, '')).toBe(full);
  });
});
