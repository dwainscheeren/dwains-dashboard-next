import type {
  DeviceAdmission,
  DeviceConfig,
  DwainsDashboardConfig,
  EntityConfig,
} from '../types/strategy';
import type { HomeAssistant } from '../types/home-assistant';

export interface RecentDeviceSummary {
  device: DeviceConfig;
  areaName: string;
  domains: string[];
  entityCount: number;
  createdAt: string;
  createdAtMs: number;
  hidden: boolean;
}

export const NEW_DEVICE_WINDOW_HOURS = 48;
const NEW_DEVICE_WINDOW_MS = NEW_DEVICE_WINDOW_HOURS * 60 * 60 * 1000;

export function hiddenDeviceIds(config?: DwainsDashboardConfig): Set<string> {
  return new Set(config?.device_admission?.hidden_devices || []);
}

export function deviceAdmission(config?: DwainsDashboardConfig): DeviceAdmission {
  return config?.device_admission || {};
}

export function entityDeviceId(
  hass: HomeAssistant | any,
  entity: EntityConfig | string
): string {
  const entityId = typeof entity === 'string' ? entity : entity.entity_id;
  return (
    (typeof entity === 'string' ? '' : entity.device_id || '') ||
    hass?.entities?.[entityId]?.device_id ||
    ''
  );
}

export function isEntityFromHiddenDevice(
  hass: HomeAssistant | any,
  config: DwainsDashboardConfig | undefined,
  entity: EntityConfig | string
): boolean {
  const deviceId = entityDeviceId(hass, entity);
  return !!deviceId && hiddenDeviceIds(config).has(deviceId);
}

export function filterHiddenDeviceEntities(
  hass: HomeAssistant | any,
  config: DwainsDashboardConfig | undefined,
  entities: EntityConfig[]
): EntityConfig[] {
  const hidden = hiddenDeviceIds(config);
  if (!hidden.size) return entities;
  return entities.filter((entity) => {
    const deviceId = entityDeviceId(hass, entity);
    return !deviceId || !hidden.has(deviceId);
  });
}

export function shouldShowRecentDevicesPanel(config?: DwainsDashboardConfig): boolean {
  return config?.settings?.show_recent_devices_panel !== false;
}

export function ensureDeviceFirstSeenTracking(
  hass: HomeAssistant | any,
  config: DwainsDashboardConfig | undefined
): DeviceAdmission | null {
  if (!config?.devices?.length) return null;

  const admission = deviceAdmission(config);
  const nextFirstSeen = { ...(admission.first_seen_devices || {}) };
  const currentDeviceIds = new Set(config.devices.map((device) => device.device_id));
  const entityCreatedAtByDevice = deviceEntityCreatedAtMap(hass, config);
  const now = Date.now();
  let changed = false;

  for (const device of config.devices) {
    if (nextFirstSeen[device.device_id]) continue;
    nextFirstSeen[device.device_id] =
      deviceCreatedAtMs(hass, device) ||
      entityCreatedAtByDevice.get(device.device_id) ||
      now;
    changed = true;
  }

  for (const deviceId of Object.keys(nextFirstSeen)) {
    if (currentDeviceIds.has(deviceId)) continue;
    delete nextFirstSeen[deviceId];
    changed = true;
  }

  if (!changed) return null;
  return {
    ...admission,
    first_seen_devices: nextFirstSeen,
  };
}

export function buildRecentDeviceSummaries(
  hass: HomeAssistant | any,
  config: DwainsDashboardConfig | undefined,
  limit = 6
): RecentDeviceSummary[] {
  if (!config?.devices?.length) return [];

  const now = Date.now();
  const cutoff = now - NEW_DEVICE_WINDOW_MS;

  const hidden = hiddenDeviceIds(config);
  const firstSeen = deviceAdmission(config).first_seen_devices || {};
  const entitiesByDevice = new Map<string, EntityConfig[]>();
  const entityCreatedAtByDevice = deviceEntityCreatedAtMap(hass, config);
  for (const entity of config.entities || []) {
    const deviceId = entityDeviceId(hass, entity);
    if (!deviceId) continue;

    const registry = hass?.entities?.[entity.entity_id];
    if (registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') {
      continue;
    }
    const list = entitiesByDevice.get(deviceId) || [];
    list.push(entity);
    entitiesByDevice.set(deviceId, list);
  }

  return config.devices
    .map((device) => {
      const createdAtMs =
        deviceCreatedAtMs(hass, device) ||
        entityCreatedAtByDevice.get(device.device_id) ||
        firstSeen[device.device_id] ||
        null;
      if (!createdAtMs || createdAtMs < cutoff || createdAtMs > now + 60_000) {
        return null;
      }
      const entities = entitiesByDevice.get(device.device_id) || [];
      const domains = Array.from(
        new Set(
          entities
            .map((entity) => entity.entity_id.split('.')[0] || '')
            .filter(Boolean)
        )
      ).sort();
      return {
        device,
        areaName: areaNameFor(config, device.area_id || ''),
        domains,
        entityCount: entities.length,
        createdAt: device.created_at || hass?.devices?.[device.device_id]?.created_at || '',
        createdAtMs,
        hidden: hidden.has(device.device_id),
      };
    })
    .filter((summary): summary is RecentDeviceSummary => !!summary && summary.entityCount > 0)
    .sort((a, b) => b.createdAtMs - a.createdAtMs || a.device.name.localeCompare(b.device.name))
    .slice(0, limit);
}

function deviceEntityCreatedAtMap(
  hass: HomeAssistant | any,
  config: DwainsDashboardConfig
): Map<string, number> {
  const entityCreatedAtByDevice = new Map<string, number>();
  for (const entity of config.entities || []) {
    const deviceId = entityDeviceId(hass, entity);
    if (!deviceId) continue;

    const entityCreatedAtMs = timestampMs(entity.created_at || hass?.entities?.[entity.entity_id]?.created_at);
    if (!entityCreatedAtMs) continue;

    const current = entityCreatedAtByDevice.get(deviceId);
    if (!current || entityCreatedAtMs < current) {
      entityCreatedAtByDevice.set(deviceId, entityCreatedAtMs);
    }
  }
  return entityCreatedAtByDevice;
}

function deviceCreatedAtMs(hass: HomeAssistant | any, device: DeviceConfig): number | null {
  return timestampMs(device.created_at || hass?.devices?.[device.device_id]?.created_at);
}

function timestampMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function areaNameFor(config: DwainsDashboardConfig, areaId: string): string {
  if (!areaId) return '';
  return config.areas?.find((area) => area.area_id === areaId)?.name || areaId;
}
