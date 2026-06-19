export const getDomainIcon = (domain: string): string => {
  const icons: Record<string, string> = {
    light: 'mdi:lightbulb',
    switch: 'mdi:flash',
    sensor: 'mdi:eye',
    binary_sensor: 'mdi:radiobox-blank',
    cover: 'mdi:window-shutter',
    climate: 'mdi:thermostat',
    fan: 'mdi:fan',
    lock: 'mdi:lock',
    media_player: 'mdi:play-circle',
    camera: 'mdi:camera',
    vacuum: 'mdi:robot-vacuum',
    person: 'mdi:account',
    automation: 'mdi:robot',
    script: 'mdi:script-text',
    scene: 'mdi:palette',
    sun: 'mdi:white-balance-sunny',
    weather: 'mdi:weather-cloudy'
  };
  return icons[domain] || 'mdi:home';
};

export const getAlertIcon = (deviceClass?: string): string => {
  if (!deviceClass) return 'mdi:alert';

  const icons: Record<string, string> = {
    door: 'mdi:door-open',
    window: 'mdi:window-open',
    motion: 'mdi:motion-sensor',
    moisture: 'mdi:water-alert',
    smoke: 'mdi:smoke-detector-alert',
    problem: 'mdi:alert-circle',
    safety: 'mdi:shield-alert',
    heat: 'mdi:fire-alert',
    cold: 'mdi:snowflake-alert',
    gas: 'mdi:gas-cylinder',
    vibration: 'mdi:vibrate'
  };
  return icons[deviceClass] || 'mdi:alert';
};

export const getDeviceClassIcon = (domain: string, deviceClass?: string): string => {
  if (!deviceClass) return getDomainIcon(domain);

  const domainIcons: Record<string, Record<string, string>> = {
    binary_sensor: {
      door: 'mdi:door',
      window: 'mdi:window-closed',
      motion: 'mdi:motion-sensor',
      occupancy: 'mdi:home-account',
      moisture: 'mdi:water',
      smoke: 'mdi:smoke-detector',
      heat: 'mdi:thermometer-alert',
      cold: 'mdi:snowflake',
      gas: 'mdi:gas-cylinder',
      vibration: 'mdi:vibrate',
      battery: 'mdi:battery',
      battery_charging: 'mdi:battery-charging',
      plug: 'mdi:power-plug',
      power: 'mdi:flash',
      presence: 'mdi:account-check',
      problem: 'mdi:alert-circle',
      safety: 'mdi:shield-check',
      lock: 'mdi:lock',
      opening: 'mdi:door',
      sound: 'mdi:volume-high',
      update: 'mdi:update',
      light: 'mdi:lightbulb'
    },
    sensor: {
      temperature: 'mdi:thermometer',
      humidity: 'mdi:water-percent',
      illuminance: 'mdi:brightness-7',
      pressure: 'mdi:gauge',
      battery: 'mdi:battery',
      power: 'mdi:flash',
      energy: 'mdi:lightning-bolt',
      current: 'mdi:current-ac',
      voltage: 'mdi:flash-triangle',
      carbon_dioxide: 'mdi:molecule-co2',
      carbon_monoxide: 'mdi:molecule-co'
    },
    cover: {
      garage: 'mdi:garage',
      gate: 'mdi:gate',
      blind: 'mdi:blinds',
      curtain: 'mdi:curtains',
      damper: 'mdi:air-filter',
      door: 'mdi:door-closed',
      shade: 'mdi:roller-shade',
      shutter: 'mdi:window-shutter',
      window: 'mdi:window-closed'
    }
  };

  return domainIcons[domain]?.[deviceClass] || getDomainIcon(domain);
};

export const getAreaIcon = (area: { icon?: string | null; name: string }): string => {
  if (area.icon) return area.icon;

  // Default icons based on area name
  const nameIcons: Record<string, string> = {
    'living room': 'mdi:sofa',
    'bedroom': 'mdi:bed',
    'kitchen': 'mdi:silverware-fork-knife',
    'bathroom': 'mdi:shower',
    'garage': 'mdi:garage',
    'garden': 'mdi:flower',
    'office': 'mdi:desk',
    'hallway': 'mdi:door',
    'basement': 'mdi:home-floor-b',
    'attic': 'mdi:home-roof'
  };

  const lowerName = area.name.toLowerCase();
  for (const [key, icon] of Object.entries(nameIcons)) {
    if (lowerName.includes(key)) return icon;
  }

  return 'mdi:home';
};