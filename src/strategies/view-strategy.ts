import type { HomeAssistant } from '../types/home-assistant';
import type {
  LovelaceViewStrategy,
  LovelaceViewConfig,
  LovelaceViewStrategyConfig,
  DwainsDashboardConfig
} from '../types/strategy';

export class DwainsViewStrategy implements LovelaceViewStrategy {
  async generate(config: LovelaceViewStrategyConfig & DwainsDashboardConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    console.log('Dwains View Strategy generate called', config);

    // Set floors in hass if available
    if (config.floors) {
      (hass as any).floors = config.floors.reduce((acc, floor) => {
        acc[floor.floor_id] = floor;
        return acc;
      }, {} as Record<string, any>);
    }

    return {
      panel: true,
      cards: [
        {
          type: 'custom:dwains-layout-card',
          areas: config.areas || [],
          devices: config.devices || [],
          entities: config.entities || [],
          floors: config.floors || [],
          settings: config.settings || {},
          areas_display: config.areas_display,
          floors_display: config.floors_display,
          areas_options: config.areas_options,
          favorites: config.favorites || [],
          pages: config.pages || [],
          blueprint_replacements: config.blueprint_replacements || {},
          device_admission: config.device_admission || {}
          // Remove hass from config - it's provided automatically by Home Assistant
        }
      ]
    };
  }
}
