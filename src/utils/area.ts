import type { HomeAssistant, HassEntity } from '../types/home-assistant';
import type { AreaConfig, AreaData, AlertInfo, DomainCounts, EntityConfig } from '../types/strategy';
import { formatEntityStateWithUnit, formatValueWithUnit } from './unit-format';
import { getEntityRegistry } from './entity-registry';

// Area data is cached per area and reused as long as every input is the same
// object as before: the area, its entity list, the state object of each of
// those entities, the area's temperature and humidity sensors and the parts of
// hass and the config the result depends on. Home Assistant replaces a state
// object whenever that entity changes, so this is exact without a time limit.
interface AreaDataCacheEntry {
  area: AreaConfig;
  areaEntities: EntityConfig[];
  entityStates: Array<HassEntity | undefined>;
  areaRegistry: unknown;
  temperatureState: HassEntity | undefined;
  humidityState: HassEntity | undefined;
  formatEntityState: unknown;
  registry: unknown;
  areasOptions: unknown;
  /** Last states object the entry was checked against (states objects are never changed in place). */
  checkedStates: HomeAssistant['states'];
  data: AreaData;
}

const areaDataCache = new Map<string, AreaDataCacheEntry>();

// Export function to clear the cache from external components
export const clearAreaDataCache = (): void => {
  areaDataCache.clear();
};

export const clearAreaDataCacheForArea = (areaId: string): void => {
  areaDataCache.delete(areaId);
};

const cachedAreaData = (
  area: AreaConfig,
  hass: HomeAssistant,
  areaEntities: EntityConfig[],
  config: any
): AreaData | undefined => {
  const cached = areaDataCache.get(area.area_id);
  if (!cached) return undefined;

  const areaRegistry = hass.areas?.[area.area_id] as any;
  if (
    cached.area !== area ||
    cached.areaEntities !== areaEntities ||
    cached.areaRegistry !== areaRegistry ||
    cached.formatEntityState !== hass.formatEntityState ||
    cached.registry !== getEntityRegistry(hass) ||
    cached.areasOptions !== config?.areas_options ||
    cached.temperatureState !== (areaRegistry?.temperature_entity_id ? hass.states[areaRegistry.temperature_entity_id] : undefined) ||
    cached.humidityState !== (areaRegistry?.humidity_entity_id ? hass.states[areaRegistry.humidity_entity_id] : undefined)
  ) {
    return undefined;
  }

  if (cached.checkedStates === hass.states) return cached.data;
  const states = cached.entityStates;
  if (states.length !== areaEntities.length) return undefined;
  for (let index = 0; index < areaEntities.length; index++) {
    if (states[index] !== hass.states[areaEntities[index]!.entity_id]) return undefined;
  }
  cached.checkedStates = hass.states;
  return cached.data;
};

// Helper function to check if entity is hidden
const isEntityHidden = (entityId: string, domain: string, areaId: string, config?: any): boolean => {
  if (!config?.areas_options?.[areaId]?.groups_options?.[domain]?.hidden) {
    return false;
  }
  return config.areas_options[areaId].groups_options[domain].hidden.includes(entityId);
};

export const getAreaData = (area: AreaConfig, hass: HomeAssistant, areaEntities: EntityConfig[], config?: any): AreaData => {
  const cached = cachedAreaData(area, hass, areaEntities, config);
  if (cached) return cached;

  // Get temperature, humidity, wattage and energy from area configuration
  let temperature: string | undefined;
  let humidity: string | undefined;
  let wattage: string | undefined;
  let totalEnergy: string | undefined;

  // Use the temperature and humidity sensors assigned to the area in Home Assistant.
  const areaRegistry = hass.areas[area.area_id] as any;
  const temperatureEntityId = areaRegistry?.temperature_entity_id;
  const humidityEntityId = areaRegistry?.humidity_entity_id;

  if (temperatureEntityId) {
    const state = hass.states[temperatureEntityId];
    if (state && state.state !== 'unavailable' && state.state !== 'unknown') {
      temperature = formatEntityStateWithUnit(hass, state);
    }
  }
  if (humidityEntityId) {
    const state = hass.states[humidityEntityId];
    if (state && state.state !== 'unavailable' && state.state !== 'unknown') {
      humidity = formatEntityStateWithUnit(hass, state);
    }
  }

  // Calculate total wattage from sensors with unit_of_measurement 'W'
  let totalWattage = 0;
  let hasWattageData = false;

  areaEntities.forEach(entity => {
    const state = hass.states[entity.entity_id];
    if (!state) return;

    // Skip hidden entities
    const domain = getEntityDomain(entity.entity_id);
    if (isEntityHidden(entity.entity_id, domain, area.area_id, config)) {
      return;
    }

    // Check if entity is a sensor with wattage unit
    if (entity.entity_id.startsWith('sensor.') &&
        state.attributes.unit_of_measurement === 'W' &&
        state.state !== 'unavailable' &&
        state.state !== 'unknown') {
      const wattageValue = parseFloat(state.state);
      if (!isNaN(wattageValue)) {
        totalWattage += wattageValue;
        hasWattageData = true;
      }
    }
  });

  // Format wattage display
  if (hasWattageData) {
    if (totalWattage >= 1000) {
      wattage = formatValueWithUnit((totalWattage / 1000).toFixed(1), 'kW');
    } else {
      wattage = formatValueWithUnit(Math.round(totalWattage), 'W');
    }
  }

  // Calculate total energy consumption from sensors with unit_of_measurement 'kWh'
  let totalEnergyValue = 0;
  let hasEnergyData = false;

  areaEntities.forEach(entity => {
    const state = hass.states[entity.entity_id];
    if (!state) return;

    // Skip hidden entities
    const domain = getEntityDomain(entity.entity_id);
    if (isEntityHidden(entity.entity_id, domain, area.area_id, config)) {
      return;
    }

    // Check if entity is a sensor with energy unit
    if (entity.entity_id.startsWith('sensor.') &&
        state.attributes.unit_of_measurement === 'kWh' &&
        state.state !== 'unavailable' &&
        state.state !== 'unknown') {
      const energyValue = parseFloat(state.state);
      if (!isNaN(energyValue)) {
        totalEnergyValue += energyValue;
        hasEnergyData = true;
      }
    }
  });

  // Format energy display
  if (hasEnergyData) {
    if (totalEnergyValue >= 1000) {
      totalEnergy = formatValueWithUnit((totalEnergyValue / 1000).toFixed(1), 'MWh');
    } else {
      totalEnergy = formatValueWithUnit(totalEnergyValue.toFixed(1), 'kWh');
    }
  }

  // Active alerts (binary sensors)
  const alerts: AlertInfo[] = [];
  const domainCounts: DomainCounts = {
    light: { total: 0, on: 0 },
    switch: { total: 0, on: 0 },
    fan: { total: 0, on: 0 },
    cover: { total: 0, on: 0 },
    climate: { total: 0, on: 0 },
    media_player: { total: 0, on: 0 },
    lock: { total: 0, on: 0 },
    motion: { total: 0, on: 0 }
  };

  areaEntities.forEach(entity => {
    const state = hass.states[entity.entity_id];
    if (!state) return;

    const domain = getEntityDomain(entity.entity_id);

    // Skip hidden entities
    if (isEntityHidden(entity.entity_id, domain, area.area_id, config)) {
      return;
    }

    if (domain in domainCounts) {
      const domainCount = domainCounts[domain];
      if (!domainCount) return;

      domainCount.total++;

      const isOn = state.state !== 'off' &&
                   state.state !== 'unavailable' &&
                   state.state !== 'unknown' &&
                   state.state !== 'closed' &&
                   state.state !== 'locked';

      if (domain === 'climate') {
        if (state.attributes.hvac_action &&
            state.attributes.hvac_action !== 'idle' &&
            state.attributes.hvac_action !== 'off') {
          domainCount.on++;
        } else if (!state.attributes.hvac_action && state.state !== 'off') {
          domainCount.on++;
        }
      } else if (isOn) {
        domainCount.on++;
      }
    }

    // Handle motion sensors separately
    if (entity.entity_id.startsWith('binary_sensor.') &&
        state.attributes.device_class === 'motion') {
      const motionCount = domainCounts['motion'];
      if (motionCount) {
        motionCount.total++;
        if (state.state === 'on') {
          motionCount.on++;
        }
      }
    }

    // Check for other alerts (excluding motion which is now separate)
    if (entity.entity_id.startsWith('binary_sensor.') &&
        state.state === 'on' &&
        state.attributes.device_class) {
      const alertClasses = ['door', 'window', 'moisture', 'smoke'];
      if (alertClasses.includes(state.attributes.device_class)) {
        alerts.push({
          entity_id: entity.entity_id,
          deviceClass: state.attributes.device_class
        });
      }
    }
  });

  const areaData: AreaData = {
    area_id: area.area_id,
    name: area.name,
    icon: area.icon || undefined,
    picture: area.picture || undefined,
    temperature,
    humidity,
    wattage,
    totalEnergy,
    alerts,
    domains: domainCounts
  };

  // Cache the result
  areaDataCache.set(area.area_id, {
    area,
    areaEntities,
    entityStates: areaEntities.map(entity => hass.states[entity.entity_id]),
    areaRegistry,
    temperatureState: temperatureEntityId ? hass.states[temperatureEntityId] : undefined,
    humidityState: humidityEntityId ? hass.states[humidityEntityId] : undefined,
    formatEntityState: hass.formatEntityState,
    registry: getEntityRegistry(hass),
    areasOptions: config?.areas_options,
    checkedStates: hass.states,
    data: areaData,
  });

  return areaData;
};

export const getEntityDomain = (entityId: string): string => {
  const [domain] = entityId.split('.');
  return domain || 'unknown';
};

export const isEntityActive = (state: HassEntity): boolean => {
  const domain = getEntityDomain(state.entity_id);

  if (domain === 'climate') {
    return state.attributes.hvac_action !== undefined &&
           state.attributes.hvac_action !== 'off' &&
           state.attributes.hvac_action !== 'idle';
  }

  return ['on', 'open', 'opening', 'closing', 'playing', 'home'].includes(state.state);
};
