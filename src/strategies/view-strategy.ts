import type { HomeAssistant } from '../types/home-assistant';
import { loadTranslations } from '../i18n';
import { ddLang } from '../utils/localize';
import type {
  LovelaceViewStrategy,
  LovelaceViewConfig,
  LovelaceViewStrategyConfig,
  DwainsDashboardConfig
} from '../types/strategy';

export class DwainsViewStrategy implements LovelaceViewStrategy {
  async generate(config: LovelaceViewStrategyConfig & DwainsDashboardConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    await loadTranslations(ddLang(hass));

    return {
      panel: true,
      cards: [
        {
          type: 'custom:dwains-dashboard-next-layout-card',
          areas: config.areas || [],
          devices: config.devices || [],
          entities: config.entities || [],
          floors: config.floors || [],
          settings: config.settings || {},
          areas_display: config.areas_display,
          floors_display: config.floors_display,
          areas_options: config.areas_options,
          favorites: config.favorites || [],
          home_custom_cards: config.home_custom_cards || [],
          pages: config.pages || [],
          blueprint_replacements: config.blueprint_replacements || {},
          device_admission: config.device_admission || {}
          // Remove hass from config - it's provided automatically by Home Assistant
        }
      ]
    };
  }
}
