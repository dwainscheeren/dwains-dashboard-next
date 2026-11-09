import type { HomeAssistant } from './home-assistant';

export interface LovelaceStrategy {
  generate(config: LovelaceStrategyConfig, hass: HomeAssistant): Promise<LovelaceConfig>;
}

export interface LovelaceViewStrategy {
  generate(config: LovelaceViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig>;
}

export interface LovelaceStrategyConfig {
  type: string;
  [key: string]: any;
}

export interface LovelaceViewStrategyConfig {
  type: string;
  [key: string]: any;
}

export interface LovelaceConfig {
  title?: string;
  views: LovelaceViewConfig[];
}

export interface LovelaceViewConfig {
  title?: string;
  path?: string;
  icon?: string;
  cards?: LovelaceCardConfig[];
  type?: string;
  strategy?: LovelaceViewStrategyConfig;
  panel?: boolean;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: any;
}

export type HomeSectionKey = 'now_playing' | 'summaries' | 'cameras' | 'areas' | 'devices' | 'todos' | 'custom_cards' | 'favorites' | 'scenes';
export type HomeInformationCardKey = 'people' | 'climate' | 'outdoor_climate' | 'power' | 'device_groups';
export type MasterActionConfirmationDomain = 'light' | 'switch' | 'fan' | 'cover' | 'lock';
export type MasterActionConfirmationSettings = Partial<Record<MasterActionConfirmationDomain, boolean>>;

export interface DwainsDashboardSettings {
  theme?: string;
  showClock?: boolean;
  showGreeting?: boolean;
  showTemperature?: boolean;
  defaultView?: 'home' | 'area';
  weather_entity_id?: string;
  alarm_entity_id?: string;
  /** Show the alarm chip for `alarm_entity_id`. Default on. */
  show_alarm?: boolean;
  show_weather?: boolean;
  show_time?: boolean;
  show_notifications?: boolean;
  show_suggested_favorites?: boolean;
  hidden_persons?: string[];
  hide_unavailable_entities?: boolean;
  hide_unavailable_entities_on_devices?: boolean;
  /**
   * Drop the area name from entity names on pages and groups that already show
   * the area. Default on; only `false` turns it off.
   */
  hide_area_name_in_entity_names?: boolean;
  /**
   * Leave sensors that measure power or energy off the room pages. The
   * Energy page, the house power usage and the power badges still count the
   * power sensors among them. Default off; a room can make an exception with
   * `show_energy_sensors`.
   */
  hide_energy_sensors_on_area_pages?: boolean;
  show_recent_devices_panel?: boolean;
  /**
   * What a tap on a light, switch or fan tile does. `more-info` (default)
   * opens the details; `toggle` turns it on or off and holding opens the details.
   */
  tile_tap_action?: 'more-info' | 'toggle';
  restrict_non_admin_ha_sidebar?: boolean;
  restrict_non_admin_dashboard_settings?: boolean;
  home_sections_order?: HomeSectionKey[];
  home_sections_hidden?: HomeSectionKey[];
  home_information_cards_hidden?: HomeInformationCardKey[];
  /** Areas excluded from the House information climate average. */
  home_climate_excluded_areas?: string[];
  /** Outdoor areas shown in the Outdoor climate card and left out of the indoor average. */
  home_outdoor_climate_areas?: string[];
  home_camera_order?: string[];
  home_cameras_hidden?: string[];
  hidden_device_types?: string[];
  master_action_confirmations?: MasterActionConfirmationSettings;
  /** Scenes and scripts shown in the Home "Scenes & scripts" row, in order. */
  home_scenes?: string[];
  /** Thermostat in the room header for rooms with one climate entity. Default on. */
  show_area_thermostat?: boolean;
  /** Favorites of the room as a foldable group on the room page. Default on. */
  show_area_favorites?: boolean;
  /**
   * Show the Now playing bar on the room pages. When not set, the room pages
   * follow `now_playing_bar === 'all'`.
   */
  show_area_now_playing?: boolean;
  /**
   * Where the Now playing bar was shown before it became a Home section. Only
   * read as a fallback: for Home while `now_playing` is in neither
   * `home_sections_order` nor `home_sections_hidden`, and for the room pages
   * while `show_area_now_playing` is not set.
   */
  now_playing_bar?: 'off' | 'home' | 'all';
}

// New interfaces for areas configuration like Home Assistant
export interface EntitiesDisplay {
  hidden?: string[];
  order?: string[];
}

export type AreaCustomCardPlacement = 'top' | 'bottom' | string;

export interface AreaCustomCard {
  id: string;
  placement: AreaCustomCardPlacement;
  card: LovelaceCardConfig;
}

export interface HomeCustomCard {
  id: string;
  card: LovelaceCardConfig;
}

export type AreaEntityLayout = 'grouped' | 'ungrouped';

export interface AreaOptions {
  card_size?: 'small' | 'large';
  /** Group generated entity cards by domain, or show one freely ordered list. */
  entity_layout?: AreaEntityLayout;
  /** Order of generated domain sections when entity_layout is grouped. */
  group_order?: string[];
  /** Area-wide entity order used when entity_layout is ungrouped. */
  entity_order?: string[];
  groups_options?: Record<string, EntitiesDisplay>;
  /** Show power and energy sensors on this room page although `hide_energy_sensors_on_area_pages` is on. */
  show_energy_sensors?: boolean;
  // Custom Lovelace cards placed around the area sections.
  custom_cards?: AreaCustomCard[];
}

export type AreaSortMode = 'home_assistant' | 'custom' | 'alphabetical';

export interface AreasDisplay {
  hidden?: string[];
  order?: string[];
  sort_mode?: AreaSortMode;
}

// Een blueprint-pagina die de gebruiker heeft toegevoegd (DD3-stijl), volledig
// client-side opgeslagen in de lovelace-config.
export interface BlueprintPage {
  id: string;
  name: string;
  icon?: string;
  /** Ruwe blueprint-YAML (zodat hij later opnieuw ingevuld kan worden) */
  blueprint: string;
  /** Bron-URL (GitHub) waar de blueprint vandaan komt, voor update-checks */
  source?: string;
  /** Door de gebruiker ingevulde inputwaarden */
  inputs: Record<string, any>;
  /** De uiteindelijke, ingevulde kaart-config */
  card: LovelaceCardConfig;
}

export type BlueprintReplacementSurface = 'area_cards' | 'devices_cards';
export type BlueprintReplacementTargetKind = 'by_domain' | 'by_device_class' | 'by_entity';

export interface BlueprintReplacementAssignment {
  id: string;
  name: string;
  source?: string;
  version?: string;
  blueprint: string;
  inputs?: Record<string, any>;
  enabled?: boolean;
  custom_cards?: string[];
}

export interface BlueprintReplacementGroup {
  by_domain?: Record<string, BlueprintReplacementAssignment>;
  by_device_class?: Record<string, BlueprintReplacementAssignment>;
  by_entity?: Record<string, BlueprintReplacementAssignment>;
}

export interface BlueprintReplacements {
  area_cards?: BlueprintReplacementGroup;
  devices_cards?: BlueprintReplacementGroup;
}

export interface DeviceAdmission {
  /** Devices hidden in all of Dwains Dashboard. */
  hidden_devices?: string[];
  /** Entities hidden on the Devices page only, sorted. */
  hidden_entities?: string[];
  first_seen_devices?: Record<string, number>;
}

export interface FloorsDisplay {
  order?: string[];
}

// Global options interface
export interface GlobalOptions {
  show_welcome?: boolean;
  show_weather?: boolean;
  show_person_cards?: boolean;
  show_time?: boolean;
}

// Extended config interface
export interface DwainsDashboardConfig {
  type?: string;
  areas?: AreaConfig[];
  devices?: DeviceConfig[];
  entities?: EntityConfig[];
  floors?: FloorConfig[];
  views?: LovelaceViewConfig[];
  persons?: string[];
  settings?: DwainsDashboardSettings;
  // New fields from Home Assistant areas strategy
  areas_display?: AreasDisplay;
  floors_display?: FloorsDisplay;
  areas_options?: Record<string, AreaOptions>;
  // Favorites functionality
  favorites?: string[];
  // Lovelace cards added directly to the Home page.
  home_custom_cards?: HomeCustomCard[];
  // Global options for custom card
  global_options?: GlobalOptions;
  // Blueprint-pagina's (DD3-stijl), client-side toegevoegd
  pages?: BlueprintPage[];
  // Replace-card blueprints voor standaard entity-kaarten in area/devices views.
  blueprint_replacements?: BlueprintReplacements;
  // Device visibility and first-seen tracking for DD.
  device_admission?: DeviceAdmission;
}

export interface AreaConfig {
  area_id: string;
  name: string;
  picture?: string | null;
  icon?: string | null;
  floor_id?: string | null;
  temperature_entity_id?: string | null;
  humidity_entity_id?: string | null;
}

export interface DeviceConfig {
  device_id: string;
  name: string;
  area_id?: string | null;
  created_at?: string | null;
}

export interface EntityConfig {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  created_at?: string | null;
  hidden?: boolean;
}

export interface FloorConfig {
  floor_id: string;
  name: string;
}

export interface AreaData {
  area_id: string;
  name: string;
  icon?: string;
  picture?: string;
  temperature?: string;
  humidity?: string;
  wattage?: string;
  totalEnergy?: string;
  alerts: AlertInfo[];
  domains: DomainCounts;
}

export interface AlertInfo {
  entity_id: string;
  deviceClass?: string;
}

export interface DomainCounts {
  [domain: string]: {
    on: number;
    total: number;
  };
}
