import type { HomeAssistant } from '../types/home-assistant';
import { prettifyDomain } from './domain-names';
import { isEntityFromHiddenDevice } from './device-admission';

export interface DomainCount {
  domain: string;
  count: number;
  name: string;
  icon: string;
  deviceClass?: string;
  entities?: string[]; // de 'aan'-entiteiten van dit domein
}

// Constants for state checks
const STATES_OFF = ['closed', 'locked', 'off', 'false', 'not_home', 'idle'];
const UNAVAILABLE_STATES = ['unavailable', 'unknown'];

// Domain configuration with icons and names
const DOMAIN_CONFIG: Record<string, { icon: string; name: string }> = {
  light: { icon: 'mdi:lightbulb', name: 'Lights' },
  switch: { icon: 'mdi:light-switch', name: 'Switches' },
  fan: { icon: 'mdi:fan', name: 'Fans' },
  cover: { icon: 'mdi:window-shutter', name: 'Covers' },
  lock: { icon: 'mdi:lock', name: 'Locks' },
  climate: { icon: 'mdi:thermostat', name: 'Climate' },
  media_player: { icon: 'mdi:play-circle', name: 'Media Players' },
  camera: { icon: 'mdi:camera', name: 'Cameras' },
  person: { icon: 'mdi:account', name: 'People' },
  vacuum: { icon: 'mdi:robot-vacuum', name: 'Vacuums' },
  alarm_control_panel: { icon: 'mdi:security', name: 'Alarm Systems' }
};

// Binary sensor device classes configuration
const BINARY_SENSOR_CONFIG: Record<string, { icon: string; name: string }> = {
  window: { icon: 'mdi:window-open', name: 'Windows' },
  door: { icon: 'mdi:door-open', name: 'Doors' },
  motion: { icon: 'mdi:motion-sensor', name: 'Motion' },
  smoke: { icon: 'mdi:smoke-detector-alert', name: 'Smoke Detectors' },
  gas: { icon: 'mdi:gas-cylinder', name: 'Gas Detectors' },
  moisture: { icon: 'mdi:water-alert', name: 'Moisture' },
  occupancy: { icon: 'mdi:home-account', name: 'Occupancy' },
  opening: { icon: 'mdi:door', name: 'Openings' },
  presence: { icon: 'mdi:motion-sensor', name: 'Presence' },
  safety: { icon: 'mdi:shield-check', name: 'Safety' },
  tamper: { icon: 'mdi:lock-alert', name: 'Tamper' },
  vibration: { icon: 'mdi:vibrate', name: 'Vibration' }
};

export function getStatusDomains(hass: HomeAssistant, config: any): DomainCount[] {
  if (!hass?.states) return [];

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

      const isOn = !STATES_OFF.includes((entityState as any).state) &&
                   !UNAVAILABLE_STATES.includes((entityState as any).state);

      // Special handling for different domains
      if (domain === 'climate') {
        // Check if climate is actively heating/cooling
        if ((entityState as any).attributes?.hvac_action &&
            (entityState as any).attributes.hvac_action !== 'idle' &&
            (entityState as any).attributes.hvac_action !== 'off') {
          if (domainCount) addOn(domainCount, entityId);
        } else if (!(entityState as any).attributes?.hvac_action && (entityState as any).state !== 'off') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'person') {
        // Count persons who are home
        if ((entityState as any).state === 'home') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'media_player') {
        // Count active media players (playing, paused)
        if (['playing', 'paused'].includes((entityState as any).state)) {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'cover') {
        // Count open covers
        if ((entityState as any).state === 'open' || (entityState as any).state === 'opening') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'lock') {
        // Count unlocked locks
        if ((entityState as any).state === 'unlocked') {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'vacuum') {
        // Count active vacuums
        if (['cleaning', 'returning', 'docked'].includes((entityState as any).state)) {
          if (domainCount) addOn(domainCount, entityId);
        }
      } else if (domain === 'alarm_control_panel') {
        // Count armed alarms
        if ((entityState as any).state?.includes('armed')) {
          if (domainCount) addOn(domainCount, entityId);
        }
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
  if (!hass?.states) return undefined;

  let totalWattage = 0;
  let hasWattageEntities = false;

  Object.values(hass.states).forEach(entity => {
    if (isEntityFromHiddenDevice(hass, config, (entity as any).entity_id)) {
      return;
    }

    // Look for power/wattage sensors
    if ((entity as any).entity_id?.includes('power') ||
        (entity as any).entity_id?.includes('wattage') ||
        (entity as any).entity_id?.includes('consumption')) {

      const state = parseFloat((entity as any).state);
      if (!isNaN(state) && (entity as any).attributes?.unit_of_measurement === 'W') {
        totalWattage += state;
        hasWattageEntities = true;
      }
    }
  });

  return hasWattageEntities ? `${Math.round(totalWattage)} W` : undefined;
}

export function getDomainTitle(domain: string): string {
  return DOMAIN_CONFIG[domain]?.name || prettifyDomain(domain);
}
