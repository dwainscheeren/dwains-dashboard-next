export interface HomeAssistant {
  states: { [entityId: string]: HassEntity };
  areas: { [areaId: string]: AreaRegistryEntry };
  devices: { [deviceId: string]: DeviceRegistryEntry };
  entities: { [entityId: string]: EntityRegistryEntry };
  floors?: { [floorId: string]: FloorRegistryEntry };
  user: HassUser;
  language: string;
  config: HassConfig;
  themes: any;
  localize: (key: string, ...args: any[]) => string;
  callWS: <T>(msg: WebSocketRequest) => Promise<T>;
  callService: (domain: string, service: string, serviceData?: any) => Promise<void>;
  formatEntityState: (stateObj: HassEntity) => string;
  formatEntityAttributeValue: (stateObj: HassEntity, attribute: string) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { [key: string]: any };
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  picture: string | null;
  icon: string | null;
  floor_id?: string | null;
  labels?: string[];
}

export interface DeviceRegistryEntry {
  id: string;
  name: string;
  name_by_user: string | null;
  area_id: string | null;
  created_at?: string | null;
  modified_at?: string | null;
  labels?: string[];
}

export interface EntityRegistryEntry {
  entity_id: string;
  name: string | null;
  icon: string | null;
  platform: string;
  config_entry_id: string | null;
  device_id: string | null;
  area_id: string | null;
  hidden_by?: string | null;
  entity_category?: string | null;
  created_at?: string | null;
  modified_at?: string | null;
  labels?: string[];
}

export interface FloorRegistryEntry {
  floor_id: string;
  name: string;
  icon: string | null;
  level: number;
}

export interface HassUser {
  id: string;
  name: string;
  is_owner: boolean;
  is_admin: boolean;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: {
    length: string;
    mass: string;
    temperature: string;
    volume: string;
  };
  location_name: string;
  time_zone: string;
  components: string[];
  config_dir: string;
  allowlist_external_dirs: string[];
  allowlist_external_urls: string[];
  version: string;
  config_source: string;
  recovery_mode: boolean;
  state: string;
  external_url: string | null;
  internal_url: string | null;
  currency: string;
  country: string | null;
  language: string;
}

export interface WebSocketRequest {
  id?: number;
  type: string;
  [key: string]: any;
}
