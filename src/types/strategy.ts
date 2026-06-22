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

export type HomeSectionKey = 'cameras' | 'areas' | 'devices' | 'favorites';

export interface DwainsDashboardSettings {
  theme?: string;
  showClock?: boolean;
  showGreeting?: boolean;
  showTemperature?: boolean;
  defaultView?: 'home' | 'area';
  weather_entity_id?: string;
  alarm_entity_id?: string;
  show_weather?: boolean;
  show_time?: boolean;
  hidden_persons?: string[];
  hide_unavailable_entities?: boolean;
  show_recent_devices_panel?: boolean;
  restrict_non_admin_ha_sidebar?: boolean;
  restrict_non_admin_dashboard_settings?: boolean;
  home_sections_order?: HomeSectionKey[];
  home_sections_hidden?: HomeSectionKey[];
}

// New interfaces for areas configuration like Home Assistant
export interface EntitiesDisplay {
  hidden?: string[];
  order?: string[];
}

export interface AreaOptions {
  card_size?: 'small' | 'large';
  groups_options?: Record<string, EntitiesDisplay>;
  // Eigen Lovelace-kaarten die de gebruiker aan deze ruimte toevoegt
  cards?: LovelaceCardConfig[];
}

export interface AreasDisplay {
  hidden?: string[];
  order?: string[];
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
  hidden_devices?: string[];
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
  // Global options for custom card
  global_options?: GlobalOptions;
  // Blueprint-pagina's (DD3-stijl), client-side toegevoegd
  pages?: BlueprintPage[];
  // Replace-card blueprints voor standaard entity-kaarten in area/devices views.
  blueprint_replacements?: BlueprintReplacements;
  // Testfeature: devices in DD snel volledig verbergen/terugzetten.
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
