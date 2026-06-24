import type { HomeAssistant } from '../types/home-assistant';
import { prettifyDomain } from './domain-names';
import { isEntityFromHiddenDevice } from './device-admission';
import { getDeviceClassIcon, getDomainIcon } from './icons';
import { buildHousePowerUsage } from './power-usage';

export interface DomainCount {
  domain: string;
  count: number;
  name: string;
  icon: string;
  value?: string;
  deviceClass?: string;
  entities?: string[]; // de 'aan'-entiteiten van dit domein
}

// Constants for state checks
const STATES_OFF = ['closed', 'locked', 'off', 'false', 'not_home', 'idle'];
const UNAVAILABLE_STATES = ['unavailable', 'unknown'];
const ACTIVE_MEDIA_PLAYER_STATES = ['playing', 'buffering'];
const ACTIVE_VACUUM_STATES = ['cleaning', 'returning'];
const ACTIVE_ALARM_STATES = ['arming', 'pending', 'triggered'];

// Domain configuration with icons and names
const DOMAIN_CONFIG: Record<string, { icon: string; name: string }> = {
  light: { icon: getDomainIcon('light'), name: 'Lights' },
  switch: { icon: getDomainIcon('switch'), name: 'Switches' },
  fan: { icon: getDomainIcon('fan'), name: 'Fans' },
  cover: { icon: getDomainIcon('cover'), name: 'Covers' },
  lock: { icon: getDomainIcon('lock'), name: 'Locks' },
  climate: { icon: getDomainIcon('climate'), name: 'Climate' },
  media_player: { icon: getDomainIcon('media_player'), name: 'Media Players' },
  camera: { icon: getDomainIcon('camera'), name: 'Cameras' },
  person: { icon: getDomainIcon('person'), name: 'People' },
  vacuum: { icon: getDomainIcon('vacuum'), name: 'Vacuums' },
  alarm_control_panel: { icon: getDomainIcon('alarm_control_panel'), name: 'Alarm Systems' }
};

// Binary sensor device classes configuration
const BINARY_SENSOR_CONFIG: Record<string, { icon: string; name: string }> = {
  window: { icon: getDeviceClassIcon('binary_sensor', 'window'), name: 'Windows' },
  door: { icon: getDeviceClassIcon('binary_sensor', 'door'), name: 'Doors' },
  motion: { icon: getDeviceClassIcon('binary_sensor', 'motion'), name: 'Motion' },
  smoke: { icon: getDeviceClassIcon('binary_sensor', 'smoke'), name: 'Smoke Detectors' },
  gas: { icon: getDeviceClassIcon('binary_sensor', 'gas'), name: 'Gas Detectors' },
  moisture: { icon: getDeviceClassIcon('binary_sensor', 'moisture'), name: 'Moisture' },
  occupancy: { icon: getDeviceClassIcon('binary_sensor', 'occupancy'), name: 'Occupancy' },
  opening: { icon: getDeviceClassIcon('binary_sensor', 'opening'), name: 'Openings' },
  presence: { icon: getDeviceClassIcon('binary_sensor', 'presence'), name: 'Presence' },
  safety: { icon: getDeviceClassIcon('binary_sensor', 'safety'), name: 'Safety' },
  tamper: { icon: 'mdi:lock-alert', name: 'Tamper' },
  vibration: { icon: getDeviceClassIcon('binary_sensor', 'vibration'), name: 'Vibration' }
};

export function getStatusDomains(hass: HomeAssistant, config: any): DomainCount[] {
  if (!hass?.states) return [];

  const configuredAreaIds = new Set((config?.areas || []).map((area: any) => area.area_id).filter(Boolean));

  // Use EXACTLY the same filtering logic as the working dialog
  const allEntities = Object.values(hass.states).filter((entityState) => {
    // If config is not loaded yet, skip filtering
    if (!config?.entities || !config?.devices) {
      return false; // Don't show any entities until config is loaded
    }

    const entityId = (entityState as any).entity_id;

    // Respect HA entity registry visibility
    const registry = hass.entities?.[entityId];
    if (registry?.hidden_by) return false;

    // Check state availability
    if (!entityState || (entityState as any).state === 'unavailable') return false;

    const entityReg = config.entities?.find((e: any) => e.entity_id === entityId);
    if (isEntityFromHiddenDevice(hass, config, entityReg || entityId)) {
      return false;
    }

    // Find the area of this entity (EXACT same logic as dialog)
    const deviceReg = entityReg && entityReg.device_id ?
      config.devices?.find((d: any) => d.device_id === entityReg.device_id) : null;
    const entityAreaId = entityReg?.area_id || deviceReg?.area_id || hass?.entities?.[entityId]?.area_id;

    // Skip entities without area
    if (!entityAreaId) {
      return false;
    }

    if (!configuredAreaIds.has(entityAreaId)) {
      return false;
    }

    // Skip entities from hidden areas
    const hiddenAreas = config.areas_display?.hidden || [];
    if (hiddenAreas.includes(entityAreaId)) {
      return false;
    }

    // Check if entity is hidden in area configuration (same logic as area view)
    const areaOptions = config.areas_options?.[entityAreaId];
    if (areaOptions?.groups_options) {
      // Check all groups for hidden entities
      for (const groupOptions of Object.values(areaOptions.groups_options)) {
        if ((groupOptions as any).hidden?.includes(entityId)) {
          return false;
        }
      }
    }

    // Check if person is hidden in settings
    const domain = entityId.split('.')[0];
    if (domain === 'person') {
      const hiddenPersons = config.settings?.hidden_persons || [];
      if (hiddenPersons.includes(entityId)) {
        return false;
      }
    }

    return true;
  });

  // Count entities per domain (incl. de 'aan'-entiteit-ids)
  const domainCounts: Record<string, { total: number; on: number; entities: string[] }> = {};

  // Initialize domain counts
  Object.keys(DOMAIN_CONFIG).forEach(domain => {
    domainCounts[domain] = { total: 0, on: 0, entities: [] };
  });

  // Binary sensors with device classes
  const binarySensorCounts: Record<string, { total: number; on: number; entities: string[] }> = {};
  Object.keys(BINARY_SENSOR_CONFIG).forEach(deviceClass => {
    binarySensorCounts[deviceClass] = { total: 0, on: 0, entities: [] };
  });

  const addOn = (bucket: { on: number; entities: string[] }, id: string) => {
    bucket.on++;
    bucket.entities.push(id);
  };

  // Count all entities
  allEntities.forEach(entityState => {
    const entityId = (entityState as any).entity_id;
    const domain = entityId?.split('.')[0];
    if (!domain) return;

    // Skip unavailable entities
    if (UNAVAILABLE_STATES.includes((entityState as any).state)) return;



    // Handle regular domains
    if (domain in domainCounts) {
      const domainCount = domainCounts[domain];
      if (domainCount) {
        domainCount.total++;
      }

      const state = String((entityState as any).state || '').toLowerCase();
      const isOn = !STATES_OFF.includes(state) &&
                   !UNAVAILABLE_STATES.includes(state);

      // Special handling for different domains
      if (domain === 'climate') {
        // Check if climate is actively heating/cooling
        if ((entityState as any).attributes?.hvac_action &&
            String((entityState as any).attributes.hvac_action).toLowerCase() !== 'idle' &&
            String((entityState as any).attributes.hvac_action).toLowerCase() !== 'off') {
          if (domainCount) addOn(domainCount, entityId);
        } else if (!(entityState as any).attributes?.hvac_action && state !== 'off') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'person') {
        // Count persons who are home
        if (state === 'home') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'media_player') {
        // Count only actively playing media players. Paused is not considered "on".
        if (ACTIVE_MEDIA_PLAYER_STATES.includes(state)) {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'cover') {
        // Count open covers
        if (state === 'open' || state === 'opening') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'lock') {
        // Count unlocked locks
        if (state === 'unlocked') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'vacuum') {
        // Count only moving/cleaning vacuums. Docked is not considered "on".
        if (ACTIVE_VACUUM_STATES.includes(state)) {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'alarm_control_panel') {
        // Count only armed/alarming states. "disarmed" must not match.
        if (state.startsWith('armed') || ACTIVE_ALARM_STATES.includes(state)) {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'camera') {
        // Cameras often report "recording" permanently; keep them in the dedicated Cameras section, not House information.
      } else if (isOn) {
        // For other domains (light, switch, fan, etc.) use simple on/off logic
        if (domainCount) addOn(domainCount, entityId);


      }
    }

    // Handle binary sensors with device classes
    if (domain === 'binary_sensor' && (entityState as any).attributes?.device_class) {
      const deviceClass = (entityState as any).attributes.device_class;
      if (deviceClass in binarySensorCounts) {
        const sensorCount = binarySensorCounts[deviceClass];
        if (sensorCount) {
          sensorCount.total++;
          if ((entityState as any).state === 'on') {
            addOn(sensorCount, entityId);
          }
        }
      }
    }
  });



  const result: DomainCount[] = [];

  // Add persons badge FIRST (always show if there are persons)
  const personData = domainCounts['person'];
  if (personData && personData.total > 0) {
    const config = DOMAIN_CONFIG['person'];
    if (config) {
      // Logic: if <= 2 persons, show home count, if > 2 persons, show home vs total
      if (personData.total <= 2) {
        // Show individual status: "2 home" or "1 home" etc
        result.push({
          domain: 'person',
          count: personData.on,
                  name: personData.on === personData.total ? `${personData.on} home` :
          personData.on === 0 ? 'Nobody home' : `${personData.on} home`,
          icon: config.icon
        });
      } else {
        // Show home vs away: "2/4 home"
        result.push({
          domain: 'person',
          count: personData.on,
          name: `${personData.on}/${personData.total} home`,
          icon: config.icon
        });
      }
    }
  }

  // Add other domain cards - only show if something is on (excluding person)
  Object.entries(domainCounts).forEach(([domain, data]) => {
    if (domain === 'person') return; // Already handled above
    if (data.total > 0 && data.on > 0) {
      const config = DOMAIN_CONFIG[domain];
      if (config) {
        result.push({
          domain,
          count: data.on,
          name: config.name,
          icon: config.icon,
          entities: data.entities
        });
      }
    }
  });

  // Add binary sensor cards - only show if something is active
  Object.entries(binarySensorCounts).forEach(([deviceClass, data]) => {
    if (data.total > 0 && data.on > 0) {
      const config = BINARY_SENSOR_CONFIG[deviceClass];
      if (config) {
        result.push({
          domain: 'binary_sensor',
          deviceClass,
          count: data.on,
          name: config.name,
          icon: config.icon,
          entities: data.entities
        });
      }
    }
  });

  // No need to sort - persons already added first, others follow in order

  return result;
}

export function getTotalWattage(hass: HomeAssistant, config?: any): string | undefined {
  const summary = buildHousePowerUsage(hass, config);
  return summary.sensorCount ? summary.formattedTotal : undefined;
}

export function getDomainTitle(domain: string): string {
  return DOMAIN_CONFIG[domain]?.name || prettifyDomain(domain);
}
