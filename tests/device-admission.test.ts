import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildRecentDeviceSummaries,
  ensureDeviceFirstSeenTracking,
  entityDeviceId,
  filterHiddenDeviceEntities,
  hiddenDeviceIds,
  isEntityFromHiddenDevice,
  shouldShowRecentDevicesPanel,
} from '../src/utils/device-admission';
import type { DwainsDashboardConfig } from '../src/types/strategy';

const NOW = Date.parse('2026-09-30T12:00:00Z');
const hoursAgo = (hours: number) => new Date(NOW - hours * 3_600_000).toISOString();

const hass = {
  entities: {
    'light.registry_only': { entity_id: 'light.registry_only', device_id: 'dev-hidden' },
    'sensor.diag': { entity_id: 'sensor.diag', device_id: 'dev-new', entity_category: 'diagnostic' },
    'switch.hidden_by_user': { entity_id: 'switch.hidden_by_user', device_id: 'dev-other', hidden_by: 'user' },
  },
  devices: {
    'dev-registry-date': { id: 'dev-registry-date', created_at: hoursAgo(5) },
  },
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('hidden devices', () => {
  const config: DwainsDashboardConfig = { device_admission: { hidden_devices: ['dev-hidden'] } };

  it('reads the hidden device ids', () => {
    expect([...hiddenDeviceIds(config)]).toEqual(['dev-hidden']);
    expect(hiddenDeviceIds(undefined).size).toBe(0);
  });

  it('resolves the device of an entity from the config or the registry', () => {
    expect(entityDeviceId(hass, { entity_id: 'light.a', device_id: 'dev-a' })).toBe('dev-a');
    expect(entityDeviceId(hass, { entity_id: 'light.registry_only', device_id: null })).toBe('dev-hidden');
    expect(entityDeviceId(hass, 'light.registry_only')).toBe('dev-hidden');
    expect(entityDeviceId(hass, 'light.unknown')).toBe('');
  });

  it('detects entities of hidden devices', () => {
    expect(isEntityFromHiddenDevice(hass, config, 'light.registry_only')).toBe(true);
    expect(isEntityFromHiddenDevice(hass, config, { entity_id: 'light.a', device_id: 'dev-a' })).toBe(false);
    expect(isEntityFromHiddenDevice(hass, config, 'light.unknown')).toBe(false);
  });

  it('filters entities of hidden devices and keeps entities without a device', () => {
    const entities = [
      { entity_id: 'light.a', device_id: 'dev-a' },
      { entity_id: 'light.b', device_id: 'dev-hidden' },
      { entity_id: 'light.registry_only', device_id: null },
      { entity_id: 'input_boolean.guest', device_id: null },
    ];
    expect(filterHiddenDeviceEntities(hass, config, entities).map((entity) => entity.entity_id)).toEqual([
      'light.a',
      'input_boolean.guest',
    ]);
  });

  it('returns the same list when no device is hidden', () => {
    const entities = [{ entity_id: 'light.a', device_id: 'dev-a' }];
    expect(filterHiddenDeviceEntities(hass, {}, entities)).toBe(entities);
  });
});

describe('shouldShowRecentDevicesPanel', () => {
  it('is on unless the user turned it off', () => {
    expect(shouldShowRecentDevicesPanel(undefined)).toBe(true);
    expect(shouldShowRecentDevicesPanel({ settings: {} })).toBe(true);
    expect(shouldShowRecentDevicesPanel({ settings: { show_recent_devices_panel: false } })).toBe(false);
  });
});

describe('ensureDeviceFirstSeenTracking', () => {
  it('does nothing without devices', () => {
    expect(ensureDeviceFirstSeenTracking(hass, undefined)).toBeNull();
    expect(ensureDeviceFirstSeenTracking(hass, { devices: [] })).toBeNull();
  });

  it('records a first-seen time for new devices', () => {
    const result = ensureDeviceFirstSeenTracking(hass, {
      devices: [
        { device_id: 'dev-created', name: 'Created', created_at: hoursAgo(2) },
        { device_id: 'dev-registry-date', name: 'Registry date' },
        { device_id: 'dev-entity-date', name: 'Entity date' },
        { device_id: 'dev-no-date', name: 'No date' },
      ],
      entities: [
        { entity_id: 'sensor.b', device_id: 'dev-entity-date', created_at: hoursAgo(3) },
        { entity_id: 'sensor.a', device_id: 'dev-entity-date', created_at: hoursAgo(4) },
      ],
      device_admission: { hidden_devices: ['dev-created'] },
    });

    expect(result).toEqual({
      hidden_devices: ['dev-created'],
      first_seen_devices: {
        'dev-created': NOW - 2 * 3_600_000,
        'dev-registry-date': NOW - 5 * 3_600_000,
        // The oldest entity of the device wins.
        'dev-entity-date': NOW - 4 * 3_600_000,
        'dev-no-date': NOW,
      },
    });
  });

  it('keeps known devices and forgets removed ones', () => {
    const result = ensureDeviceFirstSeenTracking(hass, {
      devices: [{ device_id: 'dev-a', name: 'A', created_at: hoursAgo(1) }],
      device_admission: { first_seen_devices: { 'dev-a': 123, 'dev-removed': 456 } },
    });
    expect(result?.first_seen_devices).toEqual({ 'dev-a': 123 });
  });

  it('returns null when nothing changed', () => {
    expect(
      ensureDeviceFirstSeenTracking(hass, {
        devices: [{ device_id: 'dev-a', name: 'A' }],
        device_admission: { first_seen_devices: { 'dev-a': 123 } },
      })
    ).toBeNull();
  });
});

describe('buildRecentDeviceSummaries', () => {
  const baseConfig = (): DwainsDashboardConfig => ({
    areas: [
      { area_id: 'kitchen', name: 'Kitchen' },
      { area_id: 'attic', name: 'Attic' },
    ],
    areas_display: { hidden: ['attic'] },
    devices: [
      { device_id: 'dev-new', name: 'New plug', area_id: 'kitchen', created_at: hoursAgo(1) },
      { device_id: 'dev-older', name: 'Older lamp', area_id: 'kitchen', created_at: hoursAgo(30) },
      { device_id: 'dev-too-old', name: 'Old sensor', area_id: 'kitchen', created_at: hoursAgo(49) },
      { device_id: 'dev-no-area', name: 'Loose button', area_id: null, created_at: hoursAgo(1) },
      { device_id: 'dev-hidden-area', name: 'Attic fan', area_id: 'attic', created_at: hoursAgo(1) },
      { device_id: 'dev-area-from-entity', name: 'Remote', area_id: null, created_at: hoursAgo(2) },
      { device_id: 'dev-only-diag', name: 'Diag only', area_id: 'kitchen', created_at: hoursAgo(1) },
      { device_id: 'dev-future', name: 'Clock skew', area_id: 'kitchen', created_at: new Date(NOW + 3_600_000).toISOString() },
      { device_id: 'dev-first-seen', name: 'Migrated', area_id: 'kitchen' },
    ],
    entities: [
      { entity_id: 'switch.new_plug', device_id: 'dev-new' },
      { entity_id: 'sensor.new_plug_power', device_id: 'dev-new' },
      { entity_id: 'sensor.new_plug_energy', device_id: 'dev-new' },
      { entity_id: 'light.older', device_id: 'dev-older' },
      { entity_id: 'sensor.old', device_id: 'dev-too-old' },
      { entity_id: 'event.button', device_id: 'dev-no-area' },
      { entity_id: 'fan.attic', device_id: 'dev-hidden-area' },
      { entity_id: 'remote.tv', device_id: 'dev-area-from-entity', area_id: 'kitchen' },
      { entity_id: 'sensor.diag', device_id: 'dev-only-diag' },
      { entity_id: 'sensor.clock', device_id: 'dev-future' },
      { entity_id: 'light.migrated', device_id: 'dev-first-seen' },
    ],
    device_admission: {
      hidden_devices: ['dev-older'],
      first_seen_devices: { 'dev-first-seen': NOW - 10 * 3_600_000 },
    },
  });

  it('lists devices added in the last 48 hours, newest first', () => {
    const summaries = buildRecentDeviceSummaries(hass, baseConfig());
    expect(summaries.map((summary) => summary.device.device_id)).toEqual([
      'dev-new',
      'dev-area-from-entity',
      'dev-first-seen',
      'dev-older',
    ]);
  });

  it('summarizes area, domains, entity count and visibility', () => {
    const [newest] = buildRecentDeviceSummaries(hass, baseConfig());
    expect(newest).toMatchObject({
      areaName: 'Kitchen',
      domains: ['sensor', 'switch'],
      entityCount: 3,
      createdAtMs: NOW - 3_600_000,
      hidden: false,
    });

    const older = buildRecentDeviceSummaries(hass, baseConfig()).find((s) => s.device.device_id === 'dev-older');
    expect(older?.hidden).toBe(true);
  });

  it('respects the limit', () => {
    expect(buildRecentDeviceSummaries(hass, baseConfig(), 2)).toHaveLength(2);
  });

  it('returns nothing without devices', () => {
    expect(buildRecentDeviceSummaries(hass, undefined)).toEqual([]);
    expect(buildRecentDeviceSummaries(hass, { devices: [] })).toEqual([]);
  });
});
