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
import { ddLocalize } from '../utils/localize';
import { restrictNonAdminDashboardSettings } from '../utils/security';

export class DwainsDashboardStrategy implements LovelaceStrategy {
  async generate(config: LovelaceStrategyConfig, hass: HomeAssistant): Promise<LovelaceConfig> {
    console.log('Dwains Dashboard Next Strategy');
    console.log('Config received:', config);

    // Fetch data from Home Assistant
    const [areas, devices, entities, floors] = await Promise.all([
      hass.callWS<{ area_id: string; name: string; picture: string | null; icon: string | null; floor_id?: string | null; temperature_entity_id?: string | null; humidity_entity_id?: string | null }[]>({ type: 'config/area_registry/list' }),
      hass.callWS<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }[]>({ type: 'config/device_registry/list' }),
      hass.callWS<{ entity_id: string; area_id: string | null; device_id: string | null; hidden_by: string | null; entity_category: string | null; created_at?: string | null }[]>({ type: 'config/entity_registry/list' }),
      hass.callWS<{ floor_id: string; name: string; icon: string | null; level: number }[]>({ type: 'config/floor_registry/list' }).catch(() => [])
    ]);

    console.log(`Found ${areas.length} areas, ${devices.length} devices, ${entities.length} entities, ${floors.length} floors`);

    // Debug: Check devices area assignments
    console.log('Devices met area_id:', devices.filter(d => d.area_id).map(d => ({
      name: d.name,
      id: d.id,
      area_id: d.area_id
    })));

    console.log('Devices zonder area_id count:', devices.filter(d => !d.area_id).length);

    // Debug: Check entity-to-area resolution
    const entitiesWithResolvedAreas = entities.map(entity => {
      const directAreaId = entity.area_id;
      const deviceAreaId = entity.device_id ? devices.find(d => d.id === entity.device_id)?.area_id : null;
      const resolvedAreaId = directAreaId || deviceAreaId;
      return {
        entity_id: entity.entity_id,
        direct_area_id: directAreaId,
        device_id: entity.device_id,
        device_area_id: deviceAreaId,
        resolved_area_id: resolvedAreaId
      };
    });

    console.log('Entities met resolved area_id:', entitiesWithResolvedAreas.filter(e => e.resolved_area_id).slice(0, 10));
    console.log('Entities zonder resolved area_id count:', entitiesWithResolvedAreas.filter(e => !e.resolved_area_id).length);

    // Store floors in hass object for easy access
    if (floors.length > 0) {
      hass.floors = floors.reduce((acc: any, floor: any) => {
        acc[floor.floor_id] = floor;
        return acc;
      }, {});
    }

    // Store areas in hass object for easy access
    hass.areas = areas.reduce((acc: any, area: any) => {
      acc[area.area_id] = area;
      return acc;
    }, {});

    // Store entities registry in hass for easy access
    hass.entities = entities.reduce((acc: any, entity: any) => {
      acc[entity.entity_id] = entity;
      return acc;
    }, {});

    hass.devices = devices.reduce((acc: any, device: any) => {
      acc[device.id] = device;
      return acc;
    }, {});

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
      type: 'custom:dwains-view'
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
      cards: [{ type: 'custom:dwains-devices-card', ...dashboardConfig }],
    });

    for (const page of pages) {
      views.push({
        title: page.name,
        path: page.id,
        icon: page.icon || 'mdi:puzzle',
        cards: [{ type: 'custom:dwains-page-card', page, settings: dashboardConfig.settings || {} }]
      });
    }

    if (canManageDashboard) {
      // "+"-tab om nieuwe blueprints toe te voegen (alleen icoon).
      views.push({
        icon: 'mdi:plus',
        path: 'add-blueprint',
        cards: [{ type: 'custom:dwains-page-card', add: true, settings: dashboardConfig.settings || {} }]
      });
    }

    return {
      title: config.title || 'Dwains Dashboard',
      views
    };
  }

  static async getConfigElement(): Promise<any> {
    await import('../components/dwains-dashboard-strategy-editor');
    return document.createElement('dwains-dashboard-strategy-editor');
  }
}
