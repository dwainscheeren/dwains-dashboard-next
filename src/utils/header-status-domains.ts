import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { getDeviceClassName, getDomainName, prettifyDomain } from './domain-names';
import { ddLocalize } from './localize';
import { isEntityFromHiddenDevice } from './device-admission';
import {
  getAreaConfigMap,
  getAreaHiddenEntityIdSet,
  getEntityConfigMap,
  getHiddenAreaIdSet,
  getHiddenPersonIdSet,
  resolveStatusEntityAreaId,
} from './entity-lookups';
import { getDeviceClassIcon, getDomainIcon } from './icons';
import { buildHousePowerUsage } from './power-usage';
import { getStateIndex } from './state-index';

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
const DOMAIN_CONFIG: Record<string, { icon: string }> = {
  light: { icon: getDomainIcon('light') },
  switch: { icon: getDomainIcon('switch') },
  fan: { icon: getDomainIcon('fan') },
  cover: { icon: getDomainIcon('cover') },
  lock: { icon: getDomainIcon('lock') },
  climate: { icon: getDomainIcon('climate') },
  media_player: { icon: getDomainIcon('media_player') },
  camera: { icon: getDomainIcon('camera') },
  person: { icon: getDomainIcon('person') },
  vacuum: { icon: getDomainIcon('vacuum') },
  alarm_control_panel: { icon: getDomainIcon('alarm_control_panel') }
};

// Binary sensor device classes configuration
const BINARY_SENSOR_CONFIG: Record<string, { icon: string }> = {
  window: { icon: getDeviceClassIcon('binary_sensor', 'window') },
  door: { icon: getDeviceClassIcon('binary_sensor', 'door') },
  motion: { icon: getDeviceClassIcon('binary_sensor', 'motion') },
  smoke: { icon: getDeviceClassIcon('binary_sensor', 'smoke') },
  gas: { icon: getDeviceClassIcon('binary_sensor', 'gas') },
  moisture: { icon: getDeviceClassIcon('binary_sensor', 'moisture') },
  occupancy: { icon: getDeviceClassIcon('binary_sensor', 'occupancy') },
  opening: { icon: getDeviceClassIcon('binary_sensor', 'opening') },
  presence: { icon: getDeviceClassIcon('binary_sensor', 'presence') },
  safety: { icon: getDeviceClassIcon('binary_sensor', 'safety') },
  tamper: { icon: 'mdi:lock-alert' },
  vibration: { icon: getDeviceClassIcon('binary_sensor', 'vibration') }
};

const STATUS_DOMAINS: ReadonlySet<string> = new Set(Object.keys(DOMAIN_CONFIG));
const STATUS_BINARY_SENSOR_CLASSES: ReadonlySet<string> = new Set(Object.keys(BINARY_SENSOR_CONFIG));

function entityDomain(entityId: string): string {
  const dot = entityId.indexOf('.');
  return dot === -1 ? entityId : entityId.slice(0, dot);
}

/**
 * Only these entities can end up in a status card, the rest is skipped. The
 * list is grouped per domain; the counts do not depend on the order between
 * domains and the order within a domain is kept.
 */
function statusCandidates(states: HomeAssistant['states']): HassEntity[] {
  const index = getStateIndex(states);
  const candidates: HassEntity[] = [];
  STATUS_DOMAINS.forEach((domain) => {
    index.byDomain.get(domain)?.forEach((state) => candidates.push(state));
  });
  index.byDomain.get('binary_sensor')?.forEach((state) => {
    if (STATUS_BINARY_SENSOR_CLASSES.has(state.attributes?.device_class)) candidates.push(state);
  });
  return candidates;
}

// Everything in the status filter apart from the state itself depends only on
// the entity registry and the dashboard config, so the answer is kept per
// entity until either of them is replaced.
const NO_REGISTRY = {};
const visibilityCache = new WeakMap<object, WeakMap<object, Map<string, boolean>>>();

function statusVisibilityCache(hass: HomeAssistant, config: object): Map<string, boolean> {
  const registryKey = (hass.entities as object | undefined) || NO_REGISTRY;
  let byConfig = visibilityCache.get(registryKey);
  if (!byConfig) {
    byConfig = new WeakMap();
    visibilityCache.set(registryKey, byConfig);
  }
  let cache = byConfig.get(config);
  if (!cache) {
    cache = new Map();
    byConfig.set(config, cache);
  }
  return cache;
}

function isStatusEntityVisible(hass: HomeAssistant, config: any, entityId: string): boolean {
  // Respect HA entity registry visibility
  const registry = hass.entities?.[entityId];
  if (registry?.hidden_by) return false;

  const entityReg = getEntityConfigMap(config).get(entityId);
  if (isEntityFromHiddenDevice(hass, config, entityReg || entityId)) {
    return false;
  }

  // Find the area of this entity (EXACT same logic as dialog)
  const entityAreaId = resolveStatusEntityAreaId(hass, config, entityId, entityReg);

  // Skip entities without area
  if (!entityAreaId) {
    return false;
  }

  if (!getAreaConfigMap(config).has(entityAreaId)) {
    return false;
  }

  // Skip entities from hidden areas
  if (getHiddenAreaIdSet(config).has(entityAreaId)) {
    return false;
  }

  // Check if entity is hidden in area configuration (same logic as area view)
  if (getAreaHiddenEntityIdSet(config, entityAreaId).has(entityId)) {
    return false;
  }

  // Check if person is hidden in settings
  if (getHiddenPersonIdSet(config).has(entityId) && entityDomain(entityId) === 'person') {
    return false;
  }

  return true;
}

export function getStatusDomains(hass: HomeAssistant, config: any): DomainCount[] {
  if (!hass?.states) return [];

  // If config is not loaded yet, don't show any entities until it is.
  const configLoaded = Boolean(config?.entities && config?.devices);
  const visibility = configLoaded ? statusVisibilityCache(hass, config) : undefined;

  // Use EXACTLY the same filtering logic as the working dialog
  const allEntities = !visibility ? [] : statusCandidates(hass.states).filter((entityState) => {
    // Check state availability
    if ((entityState as any).state === 'unavailable') return false;

    const entityId = (entityState as any).entity_id;
    let visible = visibility.get(entityId);
    if (visible === undefined) {
      visible = isStatusEntityVisible(hass, config, entityId);
      visibility.set(entityId, visible);
    }
    return visible;
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
    const domain = entityId ? entityDomain(entityId) : undefined;
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
          name: personData.on === 0
            ? ddLocalize(hass, 'person.nobody_home')
            : `${personData.on} ${ddLocalize(hass, 'person.home').toLowerCase()}`,
          icon: config.icon
        });
      } else {
        // Show home vs away: "2/4 home"
        result.push({
          domain: 'person',
          count: personData.on,
          name: `${personData.on}/${personData.total} ${ddLocalize(hass, 'person.home').toLowerCase()}`,
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
          name: getDomainName(hass, domain),
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
          name: getDeviceClassName(hass, deviceClass),
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

export function getDomainTitle(domain: string, hass?: HomeAssistant): string {
  return hass ? getDomainName(hass, domain) : prettifyDomain(domain);
}
