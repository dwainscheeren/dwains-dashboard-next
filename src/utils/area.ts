import type { HomeAssistant, HassEntity } from '../types/home-assistant';
import type { AreaConfig, AreaData, AlertInfo, DomainCounts, EntityConfig } from '../types/strategy';

// Cache for area data to improve performance
const areaDataCache = new Map<string, { data: AreaData; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds

// Export function to clear the cache from external components
export const clearAreaDataCache = (): void => {
  areaDataCache.clear();
};

export const clearAreaDataCacheForArea = (areaId: string): void => {
  const prefix = `${areaId}-`;
  for (const key of areaDataCache.keys()) {
    if (key.startsWith(prefix)) {
      areaDataCache.delete(key);
    }
  }
};

// Helper function to check if entity is hidden
const isEntityHidden = (entityId: string, domain: string, areaId: string, config?: any): boolean => {
  if (!config?.areas_options?.[areaId]?.groups_options?.[domain]?.hidden) {
    return false;
  }
  return config.areas_options[areaId].groups_options[domain].hidden.includes(entityId);
};

export const getAreaData = (area: AreaConfig, hass: HomeAssistant, areaEntities: EntityConfig[], config?: any): AreaData => {
  // Create cache key that includes entity states hash for better invalidation
  const entityStatesHash = areaEntities
    .map(entity => `${entity.entity_id}:${hass.states[entity.entity_id]?.state}`)
    .join('|');
  const cacheKey = `${area.area_id}-${areaEntities.length}-${entityStatesHash.substring(0, 50)}`;

  const cached = areaDataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  // Get temperature, humidity, wattage and energy from area configuration
  let temperature: string | undefined;
  let humidity: string | undefined;
  let wattage: string | undefined;
  let totalEnergy: string | undefined;

  // Check if area has specific temperature/humidity entities assigned
  const areaRegistry = hass.areas[area.area_id];
  if (areaRegistry) {
    if ('temperature_entity_id' in areaRegistry) {
      const tempEntityId = (areaRegistry as any).temperature_entity_id;
      if (tempEntityId && hass.states[tempEntityId]) {
        const tempState = hass.states[tempEntityId];
        if (tempState.state !== 'unavailable' && tempState.state !== 'unknown') {
          temperature = hass.formatEntityState(tempState);
        }
      }
    }
    if ('humidity_entity_id' in areaRegistry) {
      const humidityEntityId = (areaRegistry as any).humidity_entity_id;
      if (humidityEntityId && hass.states[humidityEntityId]) {
        const humState = hass.states[humidityEntityId];
        if (humState.state !== 'unavailable' && humState.state !== 'unknown') {
          humidity = hass.formatEntityState(humState);
        }
      }
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
      wattage = `${(totalWattage / 1000).toFixed(1)} kW`;
    } else {
      wattage = `${Math.round(totalWattage)} W`;
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
      totalEnergy = `${(totalEnergyValue / 1000).toFixed(1)} MWh`;
    } else {
      totalEnergy = `${totalEnergyValue.toFixed(1)} kWh`;
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
  areaDataCache.set(cacheKey, { data: areaData, timestamp: Date.now() });

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
