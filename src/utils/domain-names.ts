import { ddLang } from './localize';

/**
 * Nette, leesbare namen voor entiteit-domeinen (device-types).
 * Engels is de standaard; Nederlands wordt gekozen op basis van de HA-taal.
 * Onbekende domeinen vallen terug op een "geprettificeerde" naam
 * (underscores → spaties, elk woord met hoofdletter).
 */
const DOMAIN_NAMES: Record<'en' | 'nl', Record<string, string>> = {
  en: {
    light: 'Lights',
    switch: 'Switches',
    fan: 'Fans',
    cover: 'Covers',
    lock: 'Locks',
    climate: 'Climate',
    media_player: 'Media players',
    camera: 'Cameras',
    person: 'People',
    vacuum: 'Vacuums',
    alarm_control_panel: 'Alarm',
    binary_sensor: 'Binary sensors',
    sensor: 'Sensors',
    scene: 'Scenes',
    script: 'Scripts',
    automation: 'Automations',
    button: 'Buttons',
    number: 'Numbers',
    select: 'Selectors',
    input_boolean: 'Toggles',
    input_number: 'Numbers',
    input_select: 'Selectors',
    input_button: 'Buttons',
    input_text: 'Text fields',
    water_heater: 'Water heaters',
    humidifier: 'Humidifiers',
    siren: 'Sirens',
    valve: 'Valves',
    update: 'Updates',
    weather: 'Weather',
    sun: 'Sun',
    device_tracker: 'Device trackers',
    remote: 'Remotes',
    image: 'Images',
    todo: 'To-do lists',
    calendar: 'Calendars',
    lawn_mower: 'Lawn mowers',
    text: 'Text fields',
    date: 'Dates',
    time: 'Times',
    timer: 'Timers',
  },
  nl: {
    light: 'Lampen',
    switch: 'Schakelaars',
    fan: 'Ventilatoren',
    cover: 'Zonwering',
    lock: 'Sloten',
    climate: 'Klimaat',
    media_player: 'Mediaspelers',
    camera: "Camera's",
    person: 'Personen',
    vacuum: 'Stofzuigers',
    alarm_control_panel: 'Alarm',
    binary_sensor: 'Binaire sensoren',
    sensor: 'Sensoren',
    scene: 'Scènes',
    script: 'Scripts',
    automation: 'Automatiseringen',
    button: 'Knoppen',
    number: 'Nummers',
    select: 'Keuzelijsten',
    input_boolean: 'Schakelaars',
    input_number: 'Nummers',
    input_select: 'Keuzelijsten',
    input_button: 'Knoppen',
    input_text: 'Tekstvelden',
    water_heater: 'Boilers',
    humidifier: 'Luchtbevochtigers',
    siren: 'Sirenes',
    valve: 'Kleppen',
    update: 'Updates',
    weather: 'Weer',
    sun: 'Zon',
    device_tracker: 'Apparaatlocatie',
    remote: 'Afstandsbedieningen',
    image: 'Afbeeldingen',
    todo: 'Takenlijsten',
    calendar: "Agenda's",
    lawn_mower: 'Grasmaaiers',
    text: 'Tekstvelden',
    date: 'Datums',
    time: 'Tijden',
    timer: 'Timers',
  },
};

/**
 * Leesbare namen voor (binary_)sensor device-classes, zodat een motion-sensor
 * als "Motion" verschijnt i.p.v. "Binary sensors".
 */
const DEVICE_CLASS_NAMES: Record<'en' | 'nl', Record<string, string>> = {
  en: {
    motion: 'Motion',
    moving: 'Motion',
    occupancy: 'Occupancy',
    presence: 'Presence',
    door: 'Doors',
    garage_door: 'Garage doors',
    window: 'Windows',
    opening: 'Openings',
    smoke: 'Smoke',
    gas: 'Gas',
    carbon_monoxide: 'Carbon monoxide',
    moisture: 'Moisture',
    safety: 'Safety',
    tamper: 'Tamper',
    vibration: 'Vibration',
    sound: 'Sound',
    lock: 'Locks',
    battery: 'Battery',
    battery_charging: 'Charging',
    connectivity: 'Connectivity',
    power: 'Power',
    plug: 'Plugs',
    problem: 'Problems',
    heat: 'Heat',
    cold: 'Cold',
    light: 'Light',
    running: 'Running',
    update: 'Updates',
    door_lock: 'Locks',
  },
  nl: {
    motion: 'Beweging',
    moving: 'Beweging',
    occupancy: 'Aanwezigheid',
    presence: 'Aanwezigheid',
    door: 'Deuren',
    garage_door: 'Garagedeuren',
    window: 'Ramen',
    opening: 'Openingen',
    smoke: 'Rook',
    gas: 'Gas',
    carbon_monoxide: 'Koolmonoxide',
    moisture: 'Vocht',
    safety: 'Veiligheid',
    tamper: 'Sabotage',
    vibration: 'Trilling',
    sound: 'Geluid',
    lock: 'Sloten',
    battery: 'Batterij',
    battery_charging: 'Opladen',
    connectivity: 'Verbinding',
    power: 'Stroom',
    plug: 'Stekkers',
    problem: 'Problemen',
    heat: 'Hitte',
    cold: 'Kou',
    light: 'Licht',
    running: 'Actief',
    update: 'Updates',
    door_lock: 'Sloten',
  },
};

/** Leesbare, gelokaliseerde naam voor een device-class. */
export function getDeviceClassName(hass: any, deviceClass: string): string {
  const lang = ddLang(hass);
  return (
    DEVICE_CLASS_NAMES[lang]?.[deviceClass] ??
    DEVICE_CLASS_NAMES.en[deviceClass] ??
    prettifyDomain(deviceClass)
  );
}

/** Maak van een ruw domein ("binary_sensor") een leesbare naam ("Binary Sensor"). */
export function prettifyDomain(domain: string): string {
  return domain
    .split('_')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Leesbare, gelokaliseerde naam voor een domein. */
export function getDomainName(hass: any, domain: string): string {
  const lang = ddLang(hass);
  return (
    DOMAIN_NAMES[lang]?.[domain] ??
    DOMAIN_NAMES.en[domain] ??
    prettifyDomain(domain)
  );
}
