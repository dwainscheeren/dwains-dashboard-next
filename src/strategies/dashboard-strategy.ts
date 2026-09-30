import type { HomeAssistant } from '../types/home-assistant';
import type {
  LovelaceStrategy,
  LovelaceConfig,
  LovelaceStrategyConfig,
  AreaConfig,
  DeviceConfig,
  EntityConfig,
  FloorConfig,
  DwainsDashboardConfig
} from '../types/strategy';
import { ddLang, ddLocalize } from '../utils/localize';
import { loadTranslations } from '../i18n';
import { setFullEntityRegistry } from '../utils/entity-registry';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import { getEnergyPowerConfig } from '../utils/energy-prefs';

export class DwainsDashboardStrategy implements LovelaceStrategy {
  async generate(config: LovelaceStrategyConfig, hass: HomeAssistant): Promise<LovelaceConfig> {
    // Start loading the energy settings (house power total) in the
    // background, so they are usually known before the first render.
    getEnergyPowerConfig(hass);

    await loadTranslations(ddLang(hass));

    // Fetch data from Home Assistant
    const [areas, devices, entities, floors] = await Promise.all([
      hass.callWS<{ area_id: string; name: string; picture: string | null; icon: string | null; floor_id?: string | null; temperature_entity_id?: string | null; humidity_entity_id?: string | null }[]>({ type: 'config/area_registry/list' }),
      hass.callWS<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }[]>({ type: 'config/device_registry/list' }),
      hass.callWS<{ entity_id: string; area_id: string | null; device_id: string | null; hidden_by: string | null; entity_category: string | null; created_at?: string | null }[]>({ type: 'config/entity_registry/list' }),
      hass.callWS<{ floor_id: string; name: string; icon: string | null; level: number }[]>({ type: 'config/floor_registry/list' }).catch(() => [])
    ]);

    // Keep the full entity registry for Dwains Dashboard itself. hass.areas,
    // hass.devices and hass.floors from Home Assistant are already complete,
    // and hass is shared with the rest of Home Assistant, so it is not changed.
    setFullEntityRegistry(entities);

    // Convert to our config format
    const areaConfigs: AreaConfig[] = areas.map(area => ({
      area_id: area.area_id,
      name: area.name,
      picture: area.picture,
      icon: area.icon,
      floor_id: area.floor_id,
      temperature_entity_id: area.temperature_entity_id,
      humidity_entity_id: area.humidity_entity_id
    }));

    const deviceConfigs: DeviceConfig[] = devices.map(device => ({
      device_id: device.id,
      name: device.name_by_user || device.name,
      area_id: device.area_id,
      created_at: device.created_at
    }));

    const entityConfigs: EntityConfig[] = entities.map(entity => ({
      entity_id: entity.entity_id,
      area_id: entity.area_id,
      device_id: entity.device_id,
      created_at: entity.created_at
    }));

    const floorConfigs: FloorConfig[] = floors.map(floor => ({
      floor_id: floor.floor_id,
      name: floor.name
    }));

    // Store data in hass object for access in views
    const dashboardConfig: DwainsDashboardConfig = {
      areas: areaConfigs,
      devices: deviceConfigs,
      entities: entityConfigs,
      floors: floorConfigs,
      settings: config.settings || {},
      // Pass through the areas configuration from the strategy config
      areas_display: config.areas_display,
      floors_display: config.floors_display,
      areas_options: config.areas_options,
      // Pass through favorites configuration
      favorites: config.favorites || [],
      // Pass through Lovelace cards added to the Home page
      home_custom_cards: config.home_custom_cards || [],
      // Pass through blueprint-pagina's
      pages: config.pages || [],
      // Pass through replace-card blueprints
      blueprint_replacements: config.blueprint_replacements || {},
      // Pass through device admission / hidden devices
      device_admission: config.device_admission || {}
    };

    // Create config for views
    const viewConfig = {
      ...dashboardConfig,
      type: 'custom:dwains-dashboard-next-view'
    };

    // Bouw de views: Home (de Dwains-kaart) + één tab per blueprint-pagina + een "+"-tab.
    const pages = config.pages || [];
    const canManageDashboard = !restrictNonAdminDashboardSettings(hass, dashboardConfig.settings);
    const views: any[] = [
      {
        strategy: viewConfig,
        title: ddLocalize(hass, 'sidebar.home'),
        icon: 'mdi:home',
        path: 'home'
      }
    ];

    // Devices-view (DD3-stijl): device-types links, entiteiten per area rechts.
    views.push({
      title: ddLocalize(hass, 'devices.title'),
      path: 'devices',
      icon: 'mdi:format-list-bulleted-type',
      panel: true,
      cards: [{ type: 'custom:dwains-dashboard-next-devices-card', ...dashboardConfig }],
    });

    for (const page of pages) {
      views.push({
        title: page.name,
        path: page.id,
        icon: page.icon || 'mdi:puzzle',
        cards: [{ type: 'custom:dwains-dashboard-next-page-card', page, settings: dashboardConfig.settings || {} }]
      });
    }

    if (canManageDashboard) {
      // "+"-tab om nieuwe blueprints toe te voegen (alleen icoon).
      views.push({
        icon: 'mdi:plus',
        path: 'add-blueprint',
        cards: [{ type: 'custom:dwains-dashboard-next-page-card', add: true, settings: dashboardConfig.settings || {} }]
      });
    }

    return {
      title: config.title || 'Dwains Dashboard',
      views
    };
  }

  static async getConfigElement(): Promise<any> {
    await import('../components/dwains-dashboard-strategy-editor');
    return document.createElement('dwains-dashboard-next-strategy-editor');
  }
}
