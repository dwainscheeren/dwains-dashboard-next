import { describe, expect, it } from 'vitest';
import { getDeviceClassIcon, getDomainIcon } from '../src/utils/icons';

const PLAIN_CIRCLE = 'mdi:radiobox-blank';
const FALLBACK = 'mdi:shape-outline';

describe('device group icons', () => {
  it('gives binary sensors without a device class a recognizable icon', () => {
    expect(getDomainIcon('binary_sensor')).not.toBe(PLAIN_CIRCLE);
    expect(getDeviceClassIcon('binary_sensor')).toBe(getDomainIcon('binary_sensor'));
  });

  it('covers every Home Assistant binary sensor device class', () => {
    const classes = [
      'battery', 'battery_charging', 'carbon_monoxide', 'cold', 'connectivity', 'door', 'garage_door',
      'gas', 'heat', 'light', 'lock', 'moisture', 'motion', 'moving', 'occupancy', 'opening', 'plug',
      'power', 'presence', 'problem', 'running', 'safety', 'smoke', 'sound', 'tamper', 'update',
      'vibration', 'window',
    ];
    for (const deviceClass of classes) {
      const icon = getDeviceClassIcon('binary_sensor', deviceClass);
      expect(icon, deviceClass).not.toBe(getDomainIcon('binary_sensor'));
      expect(icon, deviceClass).toMatch(/^mdi:[a-z0-9-]+$/);
    }
    expect(getDeviceClassIcon('binary_sensor', 'carbon_monoxide')).toBe('mdi:molecule-co');
  });

  it('falls back to the domain icon for unknown device classes', () => {
    expect(getDeviceClassIcon('binary_sensor', 'something_new')).toBe(getDomainIcon('binary_sensor'));
    expect(getDeviceClassIcon('cover', 'something_new')).toBe(getDomainIcon('cover'));
  });

  it('has icons for the newer entity domains', () => {
    for (const domain of ['notify', 'assist_satellite', 'conversation', 'tts', 'stt', 'wake_word', 'datetime']) {
      expect(getDomainIcon(domain), domain).not.toBe(FALLBACK);
    }
  });
});
