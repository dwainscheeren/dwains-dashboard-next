import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, AreaConfig, DeviceConfig, EntityConfig, FloorConfig } from '../types/strategy';
import './dwains-layout-card';  // Import the file to register the custom element

/**
 * Simple Custom Card wrapper for DwainsLayoutCard
 * Based on the original dwains-dashboard-layout.js approach
 */
export class DwainsDashboardCard extends LitElement {
  static getConfigElement() {
    return document.createElement("dwains-dashboard-next-card-editor");
  }

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public cards: any[] = [];
  @property({ attribute: false }) public config: any = {};
  @state() private _dashboardConfig?: DwainsDashboardConfig;
  @state() private _isLoading = true;

  /**
   * Called when card configuration is set
   * Required by Custom Card API
   */
  setConfig(config: any): void {
    this.config = config;
    this._isLoading = true;

    // Generate dashboard config if hass is available
    if (this.hass) {
      this._generateDashboardConfig();
    }
  }

  /**
   * Generate dashboard config by fetching data from Home Assistant
   */
  private async _generateDashboardConfig(): Promise<void> {
    if (!this.hass) return;

    try {
      this._isLoading = true;

      // Fetch data from Home Assistant (same as strategy)
      const [areas, devices, entities, floors] = await Promise.all([
        this.hass.callWS<{ area_id: string; name: string; picture: string | null; icon: string | null; floor_id?: string | null; temperature_entity_id?: string | null; humidity_entity_id?: string | null }[]>({ type: 'config/area_registry/list' }),
        this.hass.callWS<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }[]>({ type: 'config/device_registry/list' }),
        this.hass.callWS<{ entity_id: string; area_id: string | null; device_id: string | null; hidden_by: string | null; entity_category: string | null; created_at?: string | null }[]>({ type: 'config/entity_registry/list' }),
        this.hass.callWS<{ floor_id: string; name: string; icon: string | null; level: number }[]>({ type: 'config/floor_registry/list' }).catch(() => [])
      ]);

      console.log(`Custom Card: Found ${areas.length} areas, ${devices.length} devices, ${entities.length} entities, ${floors.length} floors`);

      // Convert to our format
      const areaConfigs: AreaConfig[] = areas.map(area => ({
        area_id: area.area_id,
        name: area.name,
        picture: area.picture || undefined,
        icon: area.icon || undefined,
        floor_id: area.floor_id || undefined,
        temperature_entity_id: area.temperature_entity_id || undefined,
        humidity_entity_id: area.humidity_entity_id || undefined,
      }));

      const deviceConfigs: DeviceConfig[] = devices.map(device => ({
        device_id: device.id,
        name: device.name,
        area_id: device.area_id || undefined,
        created_at: device.created_at || undefined,
      }));

      const entityConfigs: EntityConfig[] = entities.map(entity => ({
        entity_id: entity.entity_id,
        area_id: entity.area_id || undefined,
        device_id: entity.device_id || undefined,
        created_at: entity.created_at || undefined,
        hidden: !!entity.hidden_by,
      }));

      const floorConfigs: FloorConfig[] = floors.map(floor => ({
        floor_id: floor.floor_id,
        name: floor.name,
      }));

      // Expose entity registry on hass so inner components can respect visibility (hidden_by)
      // This mirrors what the strategy path does
      (this.hass as any).entities = entities.reduce((acc: any, entity: any) => {
        acc[entity.entity_id] = entity;
        return acc;
      }, {});

      (this.hass as any).devices = devices.reduce((acc: any, device: any) => {
        acc[device.id] = device;
        return acc;
      }, {});

      // Create dashboard config
      this._dashboardConfig = {
        ...this._convertToStrategyConfig(this.config),
        areas: areaConfigs,
        devices: deviceConfigs,
        entities: entityConfigs,
        floors: floorConfigs,
      };

      this._isLoading = false;
      this._updateCards();

      // Ensure we navigate to home view after loading
      setTimeout(() => {
        this._navigateToHome();
      }, 100);

      // Optional: simple debug helper in console
      (window as any).ddDebugEntity = (entityId: string) => {
        const state = this.hass?.states?.[entityId];
        const registry = (this.hass as any)?.entities?.[entityId];
        console.log('[Dwains] Debug entity', entityId, { state, registry });
        return { state, registry };
      };

    } catch (error) {
      console.error('Failed to generate dashboard config:', error);
      this._isLoading = false;
    }
  }

  /**
   * Convert custom card config to strategy config format
   */
  private _convertToStrategyConfig(cardConfig: any): any {
    const { type, ...dashboardConfig } = cardConfig;

    // Provide default config if none specified
    const defaultConfig = {
      areas_options: {},
      global_options: {
        show_welcome: true,
        show_weather: true,
        show_person_cards: true,
      },
      views: [],
      persons: [],
      favorites: [],
    };

    return {
      ...defaultConfig,
      ...dashboardConfig,
    };
  }

  /**
   * Update the cards with current dashboard config
   */
  private _updateCards(): void {
    if (!this._dashboardConfig || !this.hass) {
      this.cards = [];
      return;
    }

    this.cards = [html`
      <dwains-dashboard-next-layout-card
        .hass=${this.hass}
        .config=${this._dashboardConfig}
      ></dwains-dashboard-next-layout-card>
    `];
  }

  /**
   * Navigate to home view programmatically
   */
  private _navigateToHome(): void {
    const layoutCard = this.shadowRoot?.querySelector('dwains-dashboard-next-layout-card') as any;
    if (layoutCard && layoutCard._selectedView !== 'home') {
      // Force the layout card to show home view
      layoutCard._selectedView = 'home';
      layoutCard._selectedArea = null;
      layoutCard.requestUpdate();
      console.log('Custom Card: Navigated to home view');
    }
  }

  /**
   * Return card size for masonry view
   */
  getCardSize(): number {
    return 10;
  }

  /**
   * Return grid options for sections view
   */
  getGridOptions(): { rows: number; columns: string; min_rows: number } {
    return {
      rows: 10,
      columns: 'full',
      min_rows: 10,
    };
  }

  /**
   * Return default stub config for card picker
   */
  static getStubConfig(): any {
    return {
      type: "custom:dwains-dashboard-next-card",
      global_options: {
        show_welcome: true,
        show_weather: true,
        show_person_cards: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #dwains_dashboard {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", sans-serif !important;
      }

      dwains-dashboard-next-layout-card {
        width: 100%;
        height: 100%;
        display: block;
      }
    `;
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('hass') && this.hass) {
      // Generate dashboard config when hass becomes available
      if (!this._dashboardConfig) {
        this._generateDashboardConfig();
      } else {
        // Just update the cards if we already have config
        this._updateCards();
      }
    }
  }

  render() {
    if (this._isLoading || !this._dashboardConfig) {
      return html`
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; font-size: 18px;">
          Loading Dwains Dashboard...
        </div>
      `;
    }

    if (!this.cards || this.cards.length === 0) {
      return html`
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; font-size: 18px;">
          No dashboard content available
        </div>
      `;
    }

    return html`
      <div id="dwains_dashboard">
        ${this.cards.map((card) => html`${card}`)}
      </div>
    `;
  }
}

// Export class for registration in index.ts
