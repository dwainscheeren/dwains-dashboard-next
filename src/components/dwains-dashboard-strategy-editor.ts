import {
  mdiArrowDown,
  mdiArrowLeft,
  mdiArrowUp,
  mdiCardAccountDetailsStarOutline,
  mdiChevronRight,
  mdiDrag,
  mdiEye,
  mdiEyeOff,
  mdiFloorPlan,
  mdiFormatListBulletedType,
  mdiHeartOutline,
  mdiHomeEditOutline,
  mdiPackageVariantClosedCheck,
  mdiPuzzleEditOutline,
  mdiShieldAccount,
  mdiThermometerWater,
  mdiTuneVariant,
  mdiViewDashboardEdit,
} from "@mdi/js";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { HomeAssistant } from "../types/home-assistant";
import type { DeviceConfig, DwainsDashboardConfig, HomeInformationCardKey, HomeSectionKey } from "../types/strategy";
import { openReplacementManager } from "./dwains-replacement-manager-dialog";
import {
  AREA_STRATEGY_GROUPS,
  AREA_STRATEGY_GROUP_ICONS,
  type AreaStrategyGroup
} from "../utils/area-entities";
import { countReplacementRules } from "../utils/blueprint-replacements";
import { getDeviceClassName, getDomainName } from "../utils/domain-names";
import { getDeviceClassIcon, getDomainColor, getDomainIcon } from "../utils/icons";
import { ddLocalize } from "../utils/localize";
import {
  DEFAULT_HOME_INFORMATION_CARDS,
  HOME_INFORMATION_CARD_META,
  HOME_SECTION_META,
  normalizeHiddenHomeInformationCards,
  normalizeHiddenHomeSections,
  normalizeHomeSectionsOrder,
} from "../utils/home-sections";
import { DD_NEXT_VERSION } from "../version";

// We'll create our own entity picker since ha-entity-picker is external
type SettingsPageKey =
  | "overview"
  | "dashboard"
  | "home"
  | "header"
  | "devices"
  | "people_areas"
  | "replacements"
  | "permissions"
  | "support";

interface SettingsPageItem {
  page: Exclude<SettingsPageKey, "overview">;
  group: "general" | "layout" | "advanced";
  icon: string;
  color: string;
  title: string;
  description: string;
  summary?: string;
}

interface DeviceVisibilityDevice {
  deviceId: string;
  name: string;
  areaId: string;
  areaName: string;
  entityCount: number;
  hidden: boolean;
}

interface DeviceVisibilityAreaGroup {
  areaId: string;
  areaName: string;
  devices: DeviceVisibilityDevice[];
}

interface DeviceVisibilityTypeGroup {
  key: string;
  label: string;
  icon: string;
  color: string;
  devices: DeviceVisibilityDevice[];
  areas: DeviceVisibilityAreaGroup[];
}

let rememberedSettingsPage: SettingsPageKey = "overview";
let rememberedSettingsPageAt = 0;
const SETTINGS_PAGE_RESTORE_MS = 8000;

function restoreSettingsPage(): SettingsPageKey {
  return Date.now() - rememberedSettingsPageAt < SETTINGS_PAGE_RESTORE_MS
    ? rememberedSettingsPage
    : "overview";
}

function rememberSettingsPage(page: SettingsPageKey): void {
  rememberedSettingsPage = page;
  rememberedSettingsPageAt = Date.now();
}

const SETTINGS_ICON_PATHS: Record<string, string> = {
  "mdi:card-account-details-star-outline": mdiCardAccountDetailsStarOutline,
  "mdi:chevron-right": mdiChevronRight,
  "mdi:floor-plan": mdiFloorPlan,
  "mdi:format-list-bulleted-type": mdiFormatListBulletedType,
  "mdi:heart-outline": mdiHeartOutline,
  "mdi:home-edit-outline": mdiHomeEditOutline,
  "mdi:package-variant-closed-check": mdiPackageVariantClosedCheck,
  "mdi:puzzle-edit-outline": mdiPuzzleEditOutline,
  "mdi:shield-account": mdiShieldAccount,
  "mdi:tune-variant": mdiTuneVariant,
  "mdi:view-dashboard-edit": mdiViewDashboardEdit,
};

@customElement("dwains-dashboard-next-strategy-editor")
export class DwainsDashboardStrategyEditor extends LitElement {
  private _hass?: HomeAssistant;
  private _fetchDataPromise?: Promise<void>;
  private _registryData?: {
    areas: Array<{ area_id: string; name: string; picture: string | null; icon: string | null }>;
    devices: Array<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }>;
    entities: Array<{ entity_id: string; area_id: string | null; device_id: string | null; created_at?: string | null }>;
  };

  @property({ attribute: false })
  public set hass(value: HomeAssistant | undefined) {
    const oldValue = this._hass;
    this._hass = value;
    // Always fetch fresh data when hass becomes available
    if (value && !oldValue) {
      void this._fetchData();
      void this._fetchDashboardInfo();
    }
  }

  public get hass() {
    return this._hass;
  }

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this._hass, key, vars);

  @state()
  private _config?: DwainsDashboardConfig;

  @state()
  private _area?: string;

  @state()
  private _loading = true;

  @state()
  private _draggedAreaId?: string;

  @state()
  private _dragOverIndex?: number;

  @state()
  private _draggedHomeSection?: HomeSectionKey;

  @state()
  private _dragOverHomeSectionIndex?: number;

  @state()
  private _draggedEntityId?: string;

  @state()
  private _draggedEntityGroup?: string;

  @state()
  private _dragOverEntityIndex?: number;

  @state()
  private _showEntityPicker = false;

  @state()
  private _entitySearchFilter = '';

  @state()
  private _showWeatherPicker = false;

  @state()
  private _weatherSearchFilter = '';

  @state()
  private _showAlarmPicker = false;

  @state()
  private _alarmSearchFilter = '';

  @state()
  private _settingsPage: SettingsPageKey = restoreSettingsPage();

  // Dashboard-eigenschappen (naam + sidebar-icoon)
  @state() private _dashboardId?: string;
  @state() private _dashboardTitle = '';
  @state() private _dashboardIcon = '';

  private _getDashboardUrlPath(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    if (!seg || seg === 'lovelace') return undefined;
    return seg;
  }

  private async _fetchDashboardInfo(): Promise<void> {
    if (!this._hass) return;
    try {
      const urlPath = this._getDashboardUrlPath();
      if (!urlPath) return; // standaard dashboard kan niet zo aangepast worden
      const dashboards: any[] = await this._hass.callWS({ type: 'lovelace/dashboards/list' });
      const db = (dashboards || []).find((d) => d.url_path === urlPath);
      if (db) {
        this._dashboardId = db.id;
        this._dashboardTitle = db.title || '';
        this._dashboardIcon = db.icon || '';
      }
    } catch (e) {
      console.warn('Dashboard-info ophalen mislukt:', e);
    }
  }

  private async _saveDashboardInfo(): Promise<void> {
    if (!this._hass || !this._dashboardId) return;
    try {
      await this._hass.callWS({
        type: 'lovelace/dashboards/update',
        dashboard_id: this._dashboardId,
        title: this._dashboardTitle || 'Dashboard',
        icon: this._dashboardIcon || undefined,
      });
      console.log('✅ Dashboard-naam/icoon opgeslagen');
    } catch (e) {
      console.error('❌ Dashboard bijwerken mislukt:', e);
      alert(this._t('strategy.save_name_failed', { error: String(e) }));
    }
  }

  private _onDashboardTitleChanged(e: any) {
    this._dashboardTitle = e.target.value;
  }

  private _onDashboardTitleCommit() {
    this._saveDashboardInfo();
  }

  private _onDashboardIconChanged(e: any) {
    this._dashboardIcon = e.detail?.value ?? e.target?.value ?? '';
    this._saveDashboardInfo();
  }

  public async setConfig(config: any): Promise<void> {
    // Only store the user configuration, not live data
    this._config = {
      type: config?.type || "custom:dwains-dashboard-next",
      areas_display: config?.areas_display || {},
      areas_options: config?.areas_options || {},
      blueprint_replacements: config?.blueprint_replacements || {},
      device_admission: config?.device_admission || {},
      favorites: config?.favorites || [],
      settings: config?.settings || {},
      // These will be populated from live data
      areas: [],
      devices: [],
      entities: [],
      floors: []
    };

    if (this.hass) {
      this._loading = !this._registryData;
      void this._fetchData();
    } else {
      this._loading = true;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Always fetch fresh data when component connects
    if (this.hass) {
      void this._fetchData();
    }
  }

  private async _fetchData() {
    if (!this.hass) return;

    if (this._registryData) {
      this._applyRegistryData(this._registryData.areas, this._registryData.devices, this._registryData.entities);
      this._loading = false;
      return;
    }

    if (this._fetchDataPromise) {
      return this._fetchDataPromise;
    }

    this._loading = true;
    this._fetchDataPromise = this._loadRegistryData();
    try {
      await this._fetchDataPromise;
    } finally {
      this._fetchDataPromise = undefined;
    }
  }

  private async _loadRegistryData() {
    const hass = this.hass;
    if (!hass) return;

    try {
      const [areas, devices, entities] = await Promise.all([
        hass.callWS<{ area_id: string; name: string; picture: string | null; icon: string | null }[]>({
          type: 'config/area_registry/list'
        }),
        hass.callWS<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }[]>({
          type: 'config/device_registry/list'
        }),
        hass.callWS<{ entity_id: string; area_id: string | null; device_id: string | null; created_at?: string | null }[]>({
          type: 'config/entity_registry/list'
        })
      ]);

      this._registryData = { areas, devices, entities };
      this._applyRegistryData(areas, devices, entities);

      this._loading = false;
      this.requestUpdate();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      this._loading = false;
    }
  }

  private _applyRegistryData(
    areas: Array<{ area_id: string; name: string; picture: string | null; icon: string | null }>,
    devices: Array<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }>,
    entities: Array<{ entity_id: string; area_id: string | null; device_id: string | null; created_at?: string | null }>
  ): void {
    if (!this.hass) return;

    this.hass.areas = areas.reduce((acc: any, area: any) => {
      acc[area.area_id] = area;
      return acc;
    }, {});

    this.hass.entities = entities.reduce((acc: any, entity: any) => {
      acc[entity.entity_id] = entity;
      return acc;
    }, {});

    this.hass.devices = devices.reduce((acc: any, device: any) => {
      acc[device.id] = device;
      return acc;
    }, {});

    this._config = {
      ...(this._config || { type: "custom:dwains-dashboard-next" }),
      areas: areas.map(area => ({
        area_id: area.area_id,
        name: area.name,
        picture: area.picture,
        icon: area.icon
      })),
      devices: devices.map(device => ({
        device_id: device.id,
        name: device.name_by_user || device.name,
        area_id: device.area_id,
        created_at: device.created_at
      })),
      entities: entities.map(entity => ({
        entity_id: entity.entity_id,
        area_id: entity.area_id,
        device_id: entity.device_id,
        created_at: entity.created_at
      }))
    };
  }

  protected render() {
    if (!this._config) {
      return this._renderLoadingShell();
    }

    if (!this.hass || this._loading) {
      return this._renderLoadingShell();
    }

    return this._area ? this._renderAreaEditor() : this._renderAreasEditor();
  }

  private _renderLoadingShell() {
    return html`
      <div class="editor-container settings-loading-shell" aria-busy="true">
        <div class="settings-overview-hero settings-overview-hero-skeleton">
          <div>
            <h2>Dwains Dashboard settings</h2>
            <p>Loading dashboard data...</p>
            <div class="settings-version-chip">
              ${this._renderSettingsIcon("mdi:package-variant-closed-check")}
              <span>Loaded version</span>
              <strong>v${DD_NEXT_VERSION}</strong>
            </div>
          </div>
          ${this._renderSettingsIcon("mdi:tune-variant", "settings-hero-icon")}
        </div>
        <section class="settings-nav-section">
          <h3>Loading</h3>
          <div class="settings-nav-list">
            ${[0, 1, 2, 3].map(() => html`
              <div class="settings-nav-item settings-nav-item-skeleton">
                <span class="settings-nav-icon skeleton-block"></span>
                <span class="settings-skeleton-copy">
                  <span></span>
                  <small></small>
                </span>
              </div>
            `)}
          </div>
        </section>
      </div>
    `;
  }

  private _renderAreasEditor() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return this._settingsPage === "overview"
      ? this._renderSettingsOverview()
      : this._renderSettingsDetailPage(this._settingsPage);
  }

  private _renderSettingsOverview() {
    const groups: Array<{ key: SettingsPageItem["group"]; title: string }> = [
      { key: "general", title: "General" },
      { key: "layout", title: "Dashboard layout" },
      { key: "advanced", title: "Advanced" },
    ];
    const items = this._settingsOverviewItems();

    return html`
      <div class="editor-container">
        <div class="settings-overview-hero">
          <div>
            <h2>Dwains Dashboard settings</h2>
            <p>Choose a section to configure. Changes are still saved with the Save button below.</p>
            <div class="settings-version-chip">
              ${this._renderSettingsIcon("mdi:package-variant-closed-check")}
              <span>Loaded version</span>
              <strong>v${DD_NEXT_VERSION}</strong>
            </div>
          </div>
          ${this._renderSettingsIcon("mdi:tune-variant", "settings-hero-icon")}
        </div>

        ${groups.map((group) => {
          const groupItems = items.filter((item) => item.group === group.key);
          if (!groupItems.length) return nothing;

          return html`
            <section class="settings-nav-section">
              <h3>${group.title}</h3>
              <div class="settings-nav-list">
                ${groupItems.map((item) => this._renderSettingsNavItem(item))}
              </div>
            </section>
          `;
        })}
      </div>
    `;
  }

  private _settingsOverviewItems(): SettingsPageItem[] {
    const areaCount = Object.keys(this.hass?.areas || {}).length;
    const visibleHomeSections = this._getHomeSectionsOrder()
      .filter((section) => !this._getHiddenHomeSections().has(section))
      .length;
    const visibleHouseInfoCards = DEFAULT_HOME_INFORMATION_CARDS
      .filter((card) => !this._getHiddenHomeInformationCards().has(card))
      .length;
    const deviceTypeCount = this._getDeviceTypeOptions().length;
    const hiddenDeviceTypeCount = this._getHiddenDeviceTypes().size;
    const personCount = Object.values(this.hass?.states || {})
      .filter((state: any) => state.entity_id?.startsWith("person."))
      .length;
    const favoriteCount = this._config?.favorites?.length || 0;
    const replacementCount = this._replacementCount();
    const hiddenDeviceCount = this._getHiddenDeviceIds().size;
    const devicesUnavailableMode = this._config?.settings?.hide_unavailable_entities_on_devices === false
      ? "Unavailable shown"
      : "Unavailable hidden";

    return [
      {
        page: "dashboard",
        group: "general",
        icon: "mdi:view-dashboard-edit",
        color: "var(--primary-color)",
        title: "Dashboard",
        description: "Name and sidebar icon.",
        summary: this._dashboardTitle || "Current dashboard",
      },
      {
        page: "home",
        group: "general",
        icon: "mdi:home-edit-outline",
        color: "#0ea5e9",
        title: "Home page",
        description: "Section order, house information and favorites.",
        summary: `${visibleHomeSections} sections · ${visibleHouseInfoCards}/${DEFAULT_HOME_INFORMATION_CARDS.length} house cards · ${favoriteCount} favorites`,
      },
      {
        page: "header",
        group: "general",
        icon: "mdi:card-account-details-star-outline",
        color: "#22a06b",
        title: "Header & status",
        description: "Time, weather, notifications and alarm chip.",
        summary: `${this._config?.settings?.show_notifications === false ? "Notifications hidden" : "Notifications shown"} · ${this._config?.settings?.alarm_entity_id ? "Alarm selected" : "No alarm selected"}`,
      },
      {
        page: "people_areas",
        group: "layout",
        icon: "mdi:floor-plan",
        color: "#8b5cf6",
        title: "People & areas",
        description: "Visible people, rooms and room entity order.",
        summary: `${personCount} people · ${areaCount} areas`,
      },
      {
        page: "devices",
        group: "layout",
        icon: "mdi:format-list-bulleted-type",
        color: "#0891b2",
        title: "Devices page",
        description: "Entity visibility and device type groups.",
        summary: `${deviceTypeCount - hiddenDeviceTypeCount}/${deviceTypeCount} types visible · ${hiddenDeviceCount} hidden devices · ${devicesUnavailableMode}`,
      },
      {
        page: "replacements",
        group: "layout",
        icon: "mdi:puzzle-edit-outline",
        color: "#7c3aed",
        title: "Blueprint replacements",
        description: "Replace default cards with blueprint cards.",
        summary: `${replacementCount} active`,
      },
      {
        page: "permissions",
        group: "advanced",
        icon: "mdi:shield-account",
        color: "#ef4444",
        title: "User permissions",
        description: "Restrictions for non-admin users.",
        summary: this._config?.settings?.restrict_non_admin_ha_sidebar || this._config?.settings?.restrict_non_admin_dashboard_settings
          ? "Restrictions enabled"
          : "Default access",
      },
      {
        page: "support",
        group: "advanced",
        icon: "mdi:heart-outline",
        color: "#f59e0b",
        title: "Support",
        description: "Donation links and SmartHomeShop.io.",
        summary: "Optional",
      },
    ];
  }

  private _renderSettingsNavItem(item: SettingsPageItem) {
    return html`
      <button
        class="settings-nav-item"
        type="button"
        style=${`--settings-item-color: ${item.color};`}
        @click=${() => this._openSettingsPage(item.page)}
      >
        <div class="settings-nav-icon">
          ${this._renderSettingsIcon(item.icon)}
        </div>
        <div class="settings-nav-copy">
          <div class="settings-nav-title">${item.title}</div>
          <div class="settings-nav-description">${item.description}</div>
        </div>
        ${item.summary ? html`<span class="settings-nav-summary">${item.summary}</span>` : nothing}
        ${this._renderSettingsIcon("mdi:chevron-right", "settings-nav-chevron")}
      </button>
    `;
  }

  private _renderSettingsIcon(icon: string, className = "") {
    const path = SETTINGS_ICON_PATHS[icon];
    if (!path) {
      return html`<ha-icon class=${className} icon=${icon}></ha-icon>`;
    }

    return html`
      <svg class=${className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${path}></path>
      </svg>
    `;
  }

  private _openSettingsPage(page: Exclude<SettingsPageKey, "overview">): void {
    this._settingsPage = page;
    rememberSettingsPage(page);
    this._closeInlinePickers();
  }

  private _backToSettingsOverview = (): void => {
    this._settingsPage = "overview";
    rememberSettingsPage("overview");
    this._closeInlinePickers();
  };

  private _closeInlinePickers(): void {
    this._showEntityPicker = false;
    this._showWeatherPicker = false;
    this._showAlarmPicker = false;
  }

  private _renderSettingsDetailPage(page: SettingsPageKey) {
    const item = this._settingsOverviewItems().find((candidate) => candidate.page === page);
    if (!item) return this._renderSettingsOverview();

    return html`
      <div class="editor-container">
        <div class="settings-detail-toolbar">
          <button class="settings-back-button" type="button" @click=${this._backToSettingsOverview}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            <span>All settings</span>
          </button>
          <div class="settings-detail-title">
            <span>${item.title}</span>
            <small>${item.description}</small>
          </div>
        </div>
        <div class="settings-detail-content">
          ${this._renderSettingsPageContent(page)}
        </div>
      </div>
    `;
  }

  private _renderSettingsPageContent(page: SettingsPageKey) {
    switch (page) {
      case "dashboard":
        return this._renderDashboardSettingsPanel();
      case "home":
        return html`
          ${this._renderHomeLayoutSettingsPanel()}
          ${this._renderFavoritesSettingsPanel()}
        `;
      case "header":
        return html`
          ${this._renderTimeSettingsPanel()}
          ${this._renderNotificationSettingsPanel()}
          ${this._renderWeatherSettingsPanel()}
          ${this._renderAlarmSettingsPanel()}
        `;
      case "devices":
        return this._renderEntityDisplaySettingsPanel();
      case "people_areas":
        return html`
          ${this._renderPersonsSettingsPanel()}
          ${this._renderAreasSettingsPanel()}
        `;
      case "replacements":
        return this._renderReplacementsSettingsPanel();
      case "permissions":
        return this._renderPermissionsSettingsPanel();
      case "support":
        return this._renderSupportSection();
      default:
        return nothing;
    }
  }

  private _renderSettingsPanel(icon: string, title: string, description: string, content: unknown) {
    return html`
      <ha-expansion-panel expanded outlined>
        <div slot="header">
          <ha-icon icon=${icon}></ha-icon>
          ${title}
        </div>
        <p class="description">${description}</p>
        ${content}
      </ha-expansion-panel>
    `;
  }

  private _renderSupportSection() {
    return html`
      <div class="sponsoring-section">
        <div class="sponsoring-header">
          <ha-icon icon="mdi:heart"></ha-icon>
          <h3>Support Dwains Dashboard</h3>
        </div>
        <p class="sponsoring-text">
          I built Dwains Dashboard as a free, open-source project in my spare time alongside my job.
          My main daily venture is <strong>SmartHomeShop.io</strong>, where I develop hardware solutions for Home Assistant and ESPHome.
        </p>

        <div class="sponsor-label">Please consider a donation</div>
        <div class="sponsor-chips">
          <a class="sponsor-chip" href="https://github.com/sponsors/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:github"></ha-icon><span>GitHub Sponsor</span>
          </a>
          <a class="sponsor-chip" href="https://www.paypal.me/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:cash"></ha-icon><span>PayPal</span>
          </a>
          <a class="sponsor-chip" href="https://www.buymeacoffee.com/FAkYvrx" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:coffee"></ha-icon><span>Buy me a coffee</span>
          </a>
        </div>

        <div class="sponsor-divider"></div>

        <div class="sponsor-label">Or help me by checking out my shop</div>
        <a class="sponsor-chip primary" href="https://smarthomeshop.io/en" target="_blank" rel="noopener noreferrer">
          <ha-icon icon="mdi:shopping"></ha-icon><span>Visit SmartHomeShop.io</span>
        </a>
      </div>
    `;
  }

  private _renderDashboardSettingsPanel() {
    if (!this._dashboardId) {
      return this._renderSettingsPanel(
        "mdi:view-dashboard",
        "Dashboard",
        "The default Home Assistant dashboard name cannot be edited here.",
        html`<div class="empty-settings-card">Open a Dwains Dashboard instance to edit its name and sidebar icon.</div>`
      );
    }

    return this._renderSettingsPanel(
      "mdi:view-dashboard",
      "Dashboard",
      this._t('strategy.dashboard_desc'),
      html`
        <div class="dashboard-settings">
          <div class="dd-field">
            <label>${this._t('strategy.name')}</label>
            <input
              class="dd-input"
              type="text"
              .value=${this._dashboardTitle}
              @input=${this._onDashboardTitleChanged}
              @change=${this._onDashboardTitleCommit}
            />
          </div>
          <ha-icon-picker
            .label=${this._t('strategy.sidebar_icon')}
            .value=${this._dashboardIcon}
            @value-changed=${this._onDashboardIconChanged}
          ></ha-icon-picker>
        </div>
      `
    );
  }

  private _renderHomeLayoutSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:home-edit-outline",
      "Home layout",
      "Choose the order of the home page sections. Summaries show active Home Assistant repairs, updates and discovered devices.",
      html`
        ${this._renderHomeSectionOrder()}
        ${this._renderHomeInformationCardSettings()}
      `
    );
  }

  private _renderReplacementsSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:puzzle-edit-outline",
      "Blueprint replacements",
      "Replace standard entity cards in area and devices views with replace-card blueprints.",
      html`
        <div class="replacement-section">
          <div class="replacement-summary">
            <div>
              <div class="replacement-count">${this._replacementCount()} active replacement${this._replacementCount() === 1 ? '' : 's'}</div>
              <div class="replacement-help">Domain rules apply to both area and devices views, like DD3.</div>
            </div>
            <ha-button appearance="accent" @click=${this._openReplacementManager}>
              <ha-icon icon="mdi:puzzle-edit-outline"></ha-icon>
              Manage replacements
            </ha-button>
          </div>
        </div>
      `
    );
  }

  private _renderFavoritesSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:star",
      "Favorites",
      "Choose entities that you always want to see on the home page.",
      html`
        <div class="favorites-section">
          <div class="favorite-suggestions-toggle">
            <ha-formfield label="Show suggested favorites from Home Assistant">
              <ha-switch
                .checked=${this._config?.settings?.show_suggested_favorites !== false}
                @change=${this._toggleSuggestedFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              Adds entities Home Assistant predicts you use often next to your pinned favorites.
            </p>
          </div>
          <div class="entity-picker">
            <div class="entity-picker-header">
              <h4>Selected Entities</h4>
              <mwc-button @click=${this._addFavoriteEntity} outlined>
                <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Add Entity
              </mwc-button>
            </div>

            ${this._renderSelectedEntities()}

            ${this._showEntityPicker ? this._renderEntityPicker() : ''}
          </div>
        </div>
      `
    );
  }

  private _renderTimeSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:clock-outline",
      "Time & Date",
      "Configure the display of time and date in the header.",
      html`
        <div class="time-section">
          <div class="time-toggle">
            <ha-formfield label="Show time and date in header">
              <ha-switch
                .checked=${this._config?.settings?.show_time !== false}
                @change=${this._toggleTimeDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `
    );
  }

  private _renderNotificationSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:bell-outline",
      "Notifications",
      "Show or hide Dwains Dashboard notification buttons and badges.",
      html`
        <div class="notifications-section">
          <div class="notifications-toggle">
            <ha-formfield label="Show notifications in Dwains Dashboard">
              <ha-switch
                .checked=${this._config?.settings?.show_notifications !== false}
                @change=${this._toggleNotificationsDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `
    );
  }

  private _renderWeatherSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:weather-cloudy",
      "Weather",
      "Choose which weather entity to display in the header, or disable weather display entirely.",
      html`
        <div class="weather-section">
          <div class="weather-toggle">
            <ha-formfield label="Show weather in header">
              <ha-switch
                .checked=${this._config?.settings?.show_weather !== false}
                @change=${this._toggleWeatherDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${this._config?.settings?.show_weather !== false ? html`
            <div class="weather-picker">
              <div class="weather-picker-header">
                <h4>Selected Weather Entity</h4>
                <mwc-button @click=${this._addWeatherEntity} outlined>
                  <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  Select Weather
                </mwc-button>
              </div>

              ${this._renderSelectedWeatherEntity()}

              ${this._showWeatherPicker ? this._renderWeatherPicker() : ''}
            </div>
          ` : ''}
        </div>
      `
    );
  }

  private _renderAlarmSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:shield-home-outline",
      "Alarm",
      "Choose which alarm entity to show on the home page. If no alarm is selected, the alarm chip will be hidden.",
      html`
        <div class="alarm-section">
          <div class="alarm-picker">
            <div class="alarm-picker-header">
              <h4>Selected Alarm Entity</h4>
              <mwc-button @click=${this._addAlarmEntity} outlined>
                <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 8px;">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Select Alarm
              </mwc-button>
            </div>

            ${this._renderSelectedAlarmEntity()}

            ${this._showAlarmPicker ? this._renderAlarmPicker() : ''}
          </div>
        </div>
      `
    );
  }

  private _renderEntityDisplaySettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:eye-off",
      "Devices page",
      "Configure how entities and device type groups are displayed.",
      html`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield label="Hide unavailable/unknown entities on Devices page">
              <ha-switch
                .checked=${this._config?.settings?.hide_unavailable_entities_on_devices !== false}
                @change=${this._toggleHideUnavailableEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              Enabled by default. Entities with 'unavailable' or 'unknown' states are hidden from normal Devices pages, but still appear in Maintenance.
            </p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield label="Show New devices menu">
              <ha-switch
                .checked=${this._config?.settings?.show_recent_devices_panel !== false}
                @change=${this._toggleRecentDevicesPanel}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              Shows devices added to Home Assistant in the last 48 hours, with a quick option to hide complete devices from Dwains Dashboard.
            </p>
          </div>
          ${this._renderDeviceTypeVisibilitySettings()}
          ${this._renderHiddenDeviceVisibility()}
        </div>
      `
    );
  }

  private _renderPermissionsSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:shield-account",
      "User permissions",
      "Optional restrictions for Home Assistant users without administrator rights.",
      html`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield label="Restrict Home Assistant menu for non-admin users">
              <ha-switch
                .checked=${this._config?.settings?.restrict_non_admin_ha_sidebar === true}
                @change=${this._toggleRestrictNonAdminHaSidebar}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              When enabled, non-admin users will not see the Home Assistant sidebar/menu from this dashboard. The mobile menu only shows their own profile settings.
            </p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield label="Restrict Dwains Dashboard editing for non-admin users">
              <ha-switch
                .checked=${this._config?.settings?.restrict_non_admin_dashboard_settings === true}
                @change=${this._toggleRestrictNonAdminDashboardSettings}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              When enabled, non-admin users cannot open Dwains Dashboard settings or change dashboard content such as custom area cards and blueprint pages.
            </p>
          </div>
        </div>
      `
    );
  }

  private _renderPersonsSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:account-multiple",
      "People",
      "Configure which persons are visible in the person cards and dashboard.",
      html`
        <div class="persons-section">
          ${this._renderPersonsConfiguration()}
        </div>
      `
    );
  }

  private _renderAreasSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:floor-plan",
      "Areas",
      "Configure which areas are visible and in what order they are shown.",
      this._renderAreasConfiguration()
    );
  }

  private _renderAreasConfiguration() {
    if (!this.hass || !this._config) return nothing;

    const areas = Object.values(this.hass.areas || {});
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const areaOrder = this._config.areas_display?.order || [];
    const sortedAreas = [...areas].sort((a, b) => {
      const aIndex = areaOrder.indexOf(a.area_id);
      const bIndex = areaOrder.indexOf(b.area_id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    return html`
      <div class="sortable-container ${this._draggedAreaId ? 'dragging' : ''}">
        ${repeat(
          sortedAreas,
          (area) => area.area_id,
          (area, index) => {
            const isHidden = hiddenAreas.has(area.area_id);
            const isDragging = this._draggedAreaId === area.area_id;
            const isDragOver = this._dragOverIndex === index && this._draggedAreaId && this._draggedAreaId !== area.area_id;

            return html`
              <div
                class="sortable-item ${isHidden ? "hidden" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}"
                data-area-id="${area.area_id}"
                data-index="${index}"
                draggable="true"
                @dragstart=${(e: DragEvent) => this._handleAreaDragStart(e, area.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${(e: DragEvent) => this._handleAreaDragOver(e, index)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${(e: DragEvent) => this._handleAreaDrop(e, index)}
              >
                <div class="area-item">
                  <div class="handle">
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  ${area.icon ? html`
                    <ha-icon
                      .icon=${area.icon}
                      class="area-icon"
                    ></ha-icon>
                  ` : nothing}
                  <span class="area-name clickable" @click=${() => this._editArea(area.area_id)}>
                    ${area.name}
                    <ha-icon icon="mdi:chevron-right" class="chevron"></ha-icon>
                  </span>
                  <div class="area-actions">
                    <ha-icon-button
                      .label=${isHidden ? "Show" : "Hide"}
                      .path=${isHidden ? mdiEye : mdiEyeOff}
                      @click=${() => this._toggleAreaVisibility(area.area_id)}
                    ></ha-icon-button>
                  </div>
                </div>
              </div>
            `;
          }
        )}
      </div>
    `;
  }

  private _renderAreaEditor() {
    if (!this.hass || !this._config || !this._area) {
      return nothing;
    }

    const area = this.hass.areas[this._area];
    if (!area) {
      return nothing;
    }

    // Get all entities for this area (from entity registry and via states)
    const areaEntities: { entity_id: string }[] = [];
    const seenEntities = new Set<string>();

    // Get entities from registry first
    if (this._config.entities) {
      // Get all devices in this area
      const areaDevices = new Set<string>();
      if (this._config.devices) {
        this._config.devices.forEach(device => {
          if (device.area_id === this._area) {
            areaDevices.add(device.device_id);
          }
        });
      }

      // Get entities via registry (direct or via device)
      this._config.entities.forEach(entity => {
        if (entity.area_id === this._area ||
            (entity.device_id && areaDevices.has(entity.device_id))) {
          areaEntities.push({ entity_id: entity.entity_id });
          seenEntities.add(entity.entity_id);
        }
      });
    }

    // Also check states for entities that might not be in registry
    if (this.hass?.states) {
      Object.values(this.hass.states).forEach(state => {
        if (!seenEntities.has(state.entity_id)) {
          const entityRegistry = this.hass?.entities?.[state.entity_id];
          if (entityRegistry?.area_id === this._area) {
            areaEntities.push({ entity_id: state.entity_id });
          }
        }
      });
    }

    // Get grouped entities WITHOUT filtering hidden ones
    const groups = this._getAreaGroupedEntitiesWithoutFiltering(
      areaEntities,
      this.hass
    );

    return html`
      <div class="editor-container">
        <div class="toolbar">
          <ha-icon-button
            .path=${mdiArrowLeft}
            .label=${this._t('strategy.back')}
            @click=${() => { this._area = undefined; }}
          ></ha-icon-button>
          <h2>${area.name}</h2>
        </div>

        <div class="area-help">
          <ha-svg-icon .path=${mdiThermometerWater} class="area-help-icon"></ha-svg-icon>
          <div class="area-help-text">
            <p>
              To show temperature and humidity sensors in the overview, link a sensor to this room in Home Assistant via
              <button class="link" @click=${this._editAreaRegistry}>edit the room</button>.
            </p>
            <p>
              The wattage badge automatically sums all power sensors (unit 'W') in this room that are visible (not hidden in the UI).
            </p>
          </div>
        </div>

        ${AREA_STRATEGY_GROUPS.map((group) => {
          // Get ALL entities for this group (don't filter hidden ones)
          const allGroupEntities = groups[group] || [];
          const groupOptions = this._config!.areas_options?.[this._area!]?.groups_options?.[group];
          const hiddenEntities = new Set(groupOptions?.hidden || []);
          const entityOrder = groupOptions?.order || [];

          // Sort entities according to order
          const sortedEntities = [...allGroupEntities].sort((a, b) => {
            const aIndex = entityOrder.indexOf(a);
            const bIndex = entityOrder.indexOf(b);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            // Sort by friendly name
            const nameA = this.hass!.states[a]?.attributes?.friendly_name || a;
            const nameB = this.hass!.states[b]?.attributes?.friendly_name || b;
            return nameA.localeCompare(nameB);
          });

          if (allGroupEntities.length === 0) {
            return nothing;
          }

          return html`
            <ha-expansion-panel expanded outlined>
              <div slot="header">
                <ha-icon icon=${AREA_STRATEGY_GROUP_ICONS[group]}></ha-icon>
                ${this._getGroupTitle(group)}
              </div>
              <div class="sortable-container ${this._draggedEntityGroup === group ? 'dragging' : ''}">
                ${repeat(
                  sortedEntities,
                  (entityId) => entityId,
                  (entityId, index) => {
                    const state = this.hass!.states[entityId];
                    const isHidden = hiddenEntities.has(entityId);
                    const isDragging = this._draggedEntityId === entityId && this._draggedEntityGroup === group;
                    const isDragOver = this._dragOverEntityIndex === index &&
                                      this._draggedEntityGroup === group &&
                                      this._draggedEntityId &&
                                      this._draggedEntityId !== entityId;

                    return html`
                      <div
                        class="sortable-item ${isHidden ? "hidden" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}"
                        data-entity-id="${entityId}"
                        data-index="${index}"
                        draggable="true"
                        @dragstart=${(e: DragEvent) => this._handleEntityDragStart(e, entityId, group)}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${(e: DragEvent) => this._handleEntityDragOver(e, group, index)}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${(e: DragEvent) => this._handleEntityDrop(e, group, index)}
                      >
                        <div class="entity-item">
                          <div class="handle">
                            <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                          </div>
                          <ha-state-icon
                            .stateObj=${state}
                            class="entity-icon"
                          ></ha-state-icon>
                          <span class="entity-name">
                            ${state?.attributes?.friendly_name || entityId}
                          </span>
                          <ha-icon-button
                            .label=${isHidden ? "Show" : "Hide"}
                            .path=${isHidden ? mdiEye : mdiEyeOff}
                            @click=${() => this._toggleEntityVisibility(entityId, group)}
                          ></ha-icon-button>
                        </div>
                      </div>
                    `;
                  }
                )}
              </div>
            </ha-expansion-panel>
          `;
        })}
      </div>
    `;
  }

  private _getHomeSectionsOrder(): HomeSectionKey[] {
    return normalizeHomeSectionsOrder(this._config?.settings?.home_sections_order);
  }

  private _getHiddenHomeSections(): Set<HomeSectionKey> {
    return new Set(normalizeHiddenHomeSections(this._config?.settings?.home_sections_hidden));
  }

  private _getHiddenHomeInformationCards(): Set<HomeInformationCardKey> {
    return new Set(normalizeHiddenHomeInformationCards(this._config?.settings?.home_information_cards_hidden));
  }

  private _setHomeSectionsOrder(order: HomeSectionKey[]): void {
    if (!this._config) return;

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        home_sections_order: normalizeHomeSectionsOrder(order),
      },
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleHomeSectionEnabled(section: HomeSectionKey): void {
    if (!this._config) return;

    const hidden = new Set(this._getHiddenHomeSections());
    if (hidden.has(section)) {
      hidden.delete(section);
    } else {
      hidden.add(section);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        home_sections_hidden: normalizeHiddenHomeSections([...hidden]),
      },
    };

    this._fireConfigChanged(newConfig);
  }

  private _moveHomeSection(section: HomeSectionKey, direction: -1 | 1): void {
    const order = this._getHomeSectionsOrder();
    const index = order.indexOf(section);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= order.length) return;

    const next = [...order];
    [next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!];
    this._setHomeSectionsOrder(next);
  }

  private _resetHomeSectionsOrder = (): void => {
    if (!this._config) return;

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        home_sections_order: normalizeHomeSectionsOrder(),
        home_sections_hidden: [],
      },
    };

    this._fireConfigChanged(newConfig);
  };

  private _toggleHomeInformationCardEnabled(card: HomeInformationCardKey): void {
    if (!this._config) return;

    const hidden = new Set(this._getHiddenHomeInformationCards());
    if (hidden.has(card)) {
      hidden.delete(card);
    } else {
      hidden.add(card);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        home_information_cards_hidden: normalizeHiddenHomeInformationCards([...hidden]),
      },
    };

    this._fireConfigChanged(newConfig);
  }

  private _renderHomeSectionOrder() {
    const order = this._getHomeSectionsOrder();
    const hiddenSections = this._getHiddenHomeSections();

    return html`
      <div class="home-layout-section">
        <div class="home-section-list ${this._draggedHomeSection ? 'dragging' : ''}">
          ${repeat(
            order,
            section => section,
            (section, index) => {
              const meta = HOME_SECTION_META[section];
              const enabled = !hiddenSections.has(section);
              const isDragging = this._draggedHomeSection === section;
              const isDragOver = this._dragOverHomeSectionIndex === index &&
                this._draggedHomeSection &&
                this._draggedHomeSection !== section;

              return html`
                <div
                  class="home-section-item ${enabled ? '' : 'disabled'} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
                  draggable="true"
                  data-section=${section}
                  data-index=${index}
                  @dragstart=${(e: DragEvent) => this._handleHomeSectionDragStart(e, section)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${(e: DragEvent) => this._handleHomeSectionDragOver(e, index)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${(e: DragEvent) => this._handleHomeSectionDrop(e, index)}
                >
                  <div class="home-section-handle">
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon">
                    <ha-icon icon=${meta.icon}></ha-icon>
                  </div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${meta.label}</div>
                    <div class="home-section-description">${meta.description}</div>
                  </div>
                  <div class="home-section-actions">
                    <button
                      class="home-section-toggle ${enabled ? 'enabled' : ''}"
                      type="button"
                      title=${enabled ? 'Hide section' : 'Show section'}
                      aria-label=${enabled ? `Hide ${meta.label}` : `Show ${meta.label}`}
                      aria-pressed=${enabled ? 'true' : 'false'}
                      @click=${() => this._toggleHomeSectionEnabled(section)}
                    >
                      <ha-icon icon=${enabled ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                    </button>
                    <ha-icon-button
                      .label="Move up"
                      .path=${mdiArrowUp}
                      .disabled=${index === 0}
                      @click=${() => this._moveHomeSection(section, -1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label="Move down"
                      .path=${mdiArrowDown}
                      .disabled=${index === order.length - 1}
                      @click=${() => this._moveHomeSection(section, 1)}
                    ></ha-icon-button>
                  </div>
                </div>
              `;
            }
          )}
        </div>
        <button class="home-layout-reset" type="button" @click=${this._resetHomeSectionsOrder}>
          Reset default layout
        </button>
      </div>
    `;
  }

  private _renderHomeInformationCardSettings() {
    const hiddenCards = this._getHiddenHomeInformationCards();
    const visibleCount = DEFAULT_HOME_INFORMATION_CARDS.filter(card => !hiddenCards.has(card)).length;

    return html`
      <div class="home-info-card-section">
        <div class="home-info-card-header">
          <div>
            <h4>House information cards</h4>
            <p>Choose which cards are shown inside the House information section on Home.</p>
          </div>
          <span>${visibleCount}/${DEFAULT_HOME_INFORMATION_CARDS.length} visible</span>
        </div>
        <div class="home-info-card-list">
          ${DEFAULT_HOME_INFORMATION_CARDS.map(card => {
            const meta = HOME_INFORMATION_CARD_META[card];
            const enabled = !hiddenCards.has(card);

            return html`
              <div class="home-info-card-item ${enabled ? 'enabled' : 'disabled'}">
                <div class="home-section-icon">
                  <ha-icon icon=${meta.icon}></ha-icon>
                </div>
                <div class="home-section-copy">
                  <div class="home-section-title">${meta.label}</div>
                  <div class="home-section-description">${meta.description}</div>
                </div>
                <ha-switch
                  .checked=${enabled}
                  @change=${() => this._toggleHomeInformationCardEnabled(card)}
                ></ha-switch>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderDeviceTypeVisibilitySettings() {
    const options = this._getDeviceTypeOptions();
    if (!options.length) return nothing;

    const hidden = this._getHiddenDeviceTypes();
    const visibleCount = options.filter((option) => !hidden.has(option.key)).length;

    return html`
      <div class="device-types-visibility">
        <div class="device-types-header">
          <div>
            <h4>Devices page types</h4>
            <p>Choose which device type groups are shown in the Devices page sidebar.</p>
          </div>
          <span>${visibleCount}/${options.length} visible</span>
        </div>
        <div class="device-types-grid">
          ${options.map((option) => {
            const enabled = !hidden.has(option.key);
            return html`
              <div
                class="device-type-option ${enabled ? 'enabled' : 'disabled'}"
                style=${`--device-type-color: ${option.color};`}
              >
                <div class="device-type-icon">
                  <ha-icon icon=${option.icon}></ha-icon>
                </div>
                <div class="device-type-copy">
                  <div class="device-type-name">${option.label}</div>
                  <div class="device-type-count">${option.count === 1 ? '1 entity' : `${option.count} entities`}</div>
                </div>
                <ha-switch
                  .checked=${enabled}
                  @change=${(event: Event) => this._setDeviceTypeVisible(option.key, (event.target as any).checked)}
                ></ha-switch>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHiddenDeviceVisibility() {
    const groups = this._getDeviceVisibilityGroups();
    const hiddenDevices = this._getHiddenDeviceIds();
    const allDeviceIds = this._uniqueDeviceIdsFromGroups(groups);
    const hiddenKnownDeviceCount = allDeviceIds.filter((deviceId) => hiddenDevices.has(deviceId)).length;

    if (groups.length === 0) {
      return html`
        <div class="device-admission-section">
          <div class="device-types-header">
            <div>
              <h4>Hidden devices</h4>
              <p>No devices with visible entities were found.</p>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="device-admission-section">
        <div class="device-types-header">
          <div>
            <h4>Hidden devices</h4>
            <p>Hide complete devices from Dwains Dashboard. Devices are grouped by device type and area.</p>
          </div>
          <span>${hiddenKnownDeviceCount}/${allDeviceIds.length} hidden</span>
        </div>

        <div class="device-admission-global-actions">
          <button
            type="button"
            ?disabled=${hiddenKnownDeviceCount === 0}
            @click=${() => this._setDevicesHidden(allDeviceIds, false)}
          >
            <ha-icon icon="mdi:eye-outline"></ha-icon>
            Show all devices
          </button>
          <button
            type="button"
            ?disabled=${allDeviceIds.length === 0 || hiddenKnownDeviceCount >= allDeviceIds.length}
            @click=${() => this._setDevicesHidden(allDeviceIds, true)}
          >
            <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            Hide all devices
          </button>
        </div>

        <div class="device-admission-groups">
          ${repeat(
            groups,
            (group) => group.key,
            (group, index) => {
              const groupDeviceIds = this._uniqueDeviceIds(group.devices);
              const hiddenInGroup = groupDeviceIds.filter((deviceId) => hiddenDevices.has(deviceId)).length;
              return html`
                <ha-expansion-panel outlined ?expanded=${index === 0}>
                  <div slot="header" class="device-admission-panel-header" style=${`--device-type-color: ${group.color};`}>
                    <span class="device-type-icon small">
                      <ha-icon icon=${group.icon}></ha-icon>
                    </span>
                    <span>${group.label}</span>
                    <small>${groupDeviceIds.length - hiddenInGroup}/${groupDeviceIds.length} visible</small>
                  </div>

                  <div class="device-admission-panel">
                    <div class="device-admission-group-actions">
                      <button
                        type="button"
                        ?disabled=${hiddenInGroup === 0}
                        @click=${() => this._setDevicesHidden(groupDeviceIds, false)}
                      >
                        Show type
                      </button>
                      <button
                        type="button"
                        ?disabled=${hiddenInGroup === groupDeviceIds.length}
                        @click=${() => this._setDevicesHidden(groupDeviceIds, true)}
                      >
                        Hide type
                      </button>
                    </div>

                    ${repeat(
                      group.areas,
                      (areaGroup) => `${group.key}-${areaGroup.areaId}`,
                      (areaGroup) => {
                        const areaDeviceIds = this._uniqueDeviceIds(areaGroup.devices);
                        const hiddenInArea = areaDeviceIds.filter((deviceId) => hiddenDevices.has(deviceId)).length;
                        return html`
                          <section class="device-admission-area">
                            <div class="device-admission-area-header">
                              <div>
                                <strong>${areaGroup.areaName}</strong>
                                <span>${areaDeviceIds.length - hiddenInArea}/${areaDeviceIds.length} visible</span>
                              </div>
                              <div class="device-admission-area-actions">
                                <button
                                  type="button"
                                  ?disabled=${hiddenInArea === 0}
                                  @click=${() => this._setDevicesHidden(areaDeviceIds, false)}
                                >
                                  Show area
                                </button>
                                <button
                                  type="button"
                                  ?disabled=${hiddenInArea === areaDeviceIds.length}
                                  @click=${() => this._setDevicesHidden(areaDeviceIds, true)}
                                >
                                  Hide area
                                </button>
                              </div>
                            </div>
                            <div class="device-admission-device-list">
                              ${repeat(
                                areaGroup.devices,
                                (device) => `${group.key}-${device.deviceId}`,
                                (device) => this._renderDeviceVisibilityRow(device, group)
                              )}
                            </div>
                          </section>
                        `;
                      }
                    )}
                  </div>
                </ha-expansion-panel>
              `;
            }
          )}
        </div>
      </div>
    `;
  }

  private _renderDeviceVisibilityRow(device: DeviceVisibilityDevice, group: DeviceVisibilityTypeGroup) {
    const visible = !device.hidden;
    return html`
      <div
        class="device-admission-device ${visible ? "visible" : "hidden"}"
        style=${`--device-type-color: ${group.color};`}
      >
        <div class="device-type-icon">
          <ha-icon icon=${group.icon}></ha-icon>
        </div>
        <div class="device-admission-copy">
          <div class="device-type-name">${device.name}</div>
          <div class="device-type-count">
            ${device.entityCount === 1 ? "1 entity" : `${device.entityCount} entities`} · ${visible ? "Visible in DD" : "Hidden in DD"}
          </div>
        </div>
        <ha-switch
          .checked=${visible}
          @change=${(event: Event) => this._setDeviceHidden(device.deviceId, !(event.target as any).checked)}
        ></ha-switch>
      </div>
    `;
  }

  private _getDeviceVisibilityGroups(): DeviceVisibilityTypeGroup[] {
    if (!this.hass || !this._config) return [];

    const deviceById = this._getAllDevicesById();
    const hiddenDevices = this._getHiddenDeviceIds();
    const entityRecords = new Map<string, { entityId: string; deviceId?: string | null; areaId?: string | null }>();

    (this._config.entities || []).forEach((entity) => {
      entityRecords.set(entity.entity_id, {
        entityId: entity.entity_id,
        deviceId: entity.device_id,
        areaId: entity.area_id,
      });
    });

    Object.values(this.hass.entities || {}).forEach((entity: any) => {
      entityRecords.set(entity.entity_id, {
        entityId: entity.entity_id,
        deviceId: entity.device_id,
        areaId: entity.area_id,
      });
    });

    const typeDeviceEntities = new Map<string, Map<string, Set<string>>>();

    entityRecords.forEach((record) => {
      const deviceId = record.deviceId;
      if (!deviceId || !deviceById.has(deviceId)) return;
      if (!this._isDeviceManagedEntity(record.entityId)) return;

      const typeKey = this._deviceTypeKeyForEntityId(record.entityId);
      if (!typeKey || typeKey === "person") return;

      let devicesForType = typeDeviceEntities.get(typeKey);
      if (!devicesForType) {
        devicesForType = new Map();
        typeDeviceEntities.set(typeKey, devicesForType);
      }

      let entityIds = devicesForType.get(deviceId);
      if (!entityIds) {
        entityIds = new Set();
        devicesForType.set(deviceId, entityIds);
      }
      entityIds.add(record.entityId);
    });

    return [...typeDeviceEntities.entries()]
      .map(([key, deviceMap]) => {
        const devices = [...deviceMap.entries()]
          .map(([deviceId, entityIds]) => {
            const device = deviceById.get(deviceId)!;
            const area = this._deviceVisibilityArea(device, [...entityIds]);
            if (!area) return undefined;
            return {
              deviceId,
              name: device.name || deviceId,
              areaId: area.areaId,
              areaName: area.areaName,
              entityCount: entityIds.size,
              hidden: hiddenDevices.has(deviceId),
            };
          })
          .filter((device): device is DeviceVisibilityDevice => Boolean(device))
          .sort((a, b) => a.areaName.localeCompare(b.areaName) || a.name.localeCompare(b.name));

        const areaMap = new Map<string, DeviceVisibilityAreaGroup>();
        devices.forEach((device) => {
          let areaGroup = areaMap.get(device.areaId);
          if (!areaGroup) {
            areaGroup = {
              areaId: device.areaId,
              areaName: device.areaName,
              devices: [],
            };
            areaMap.set(device.areaId, areaGroup);
          }
          areaGroup.devices.push(device);
        });

        const areas = [...areaMap.values()].sort((a, b) => a.areaName.localeCompare(b.areaName));

        return {
          key,
          label: this._deviceTypeName(key),
          icon: this._deviceTypeIcon(key),
          color: this._deviceTypeColor(key),
          devices,
          areas,
        };
      })
      .filter((group) => group.devices.length > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _getAllDevicesById(): Map<string, DeviceConfig> {
    const devices = new Map<string, DeviceConfig>();

    (this._config?.devices || []).forEach((device) => {
      devices.set(device.device_id, device);
    });

    Object.values(this.hass?.devices || {}).forEach((device: any) => {
      if (!device?.id || devices.has(device.id)) return;
      devices.set(device.id, {
        device_id: device.id,
        name: device.name_by_user || device.name || device.id,
        area_id: device.area_id,
        created_at: device.created_at,
      });
    });

    return devices;
  }

  private _isDeviceManagedEntity(entityId: string): boolean {
    const registry = this.hass?.entities?.[entityId];
    if (registry?.hidden_by || registry?.entity_category === "diagnostic" || registry?.entity_category === "config") {
      return false;
    }
    return !!entityId.includes(".");
  }

  private _deviceVisibilityArea(device: DeviceConfig, entityIds: string[]): { areaId: string; areaName: string } | undefined {
    const registryDevice = this.hass?.devices?.[device.device_id];
    const hiddenAreas = new Set(this._config?.areas_display?.hidden || []);

    const resolveArea = (areaId?: string | null) => {
      if (!areaId || hiddenAreas.has(areaId)) return undefined;
      const area = this._config?.areas?.find((item) => item.area_id === areaId);
      return area ? { areaId: area.area_id, areaName: area.name } : undefined;
    };

    const fromDevice = resolveArea(device.area_id || registryDevice?.area_id);
    if (fromDevice) return fromDevice;

    for (const entityId of entityIds) {
      const configEntity = this._config?.entities?.find((entity) => entity.entity_id === entityId);
      const fromEntity = resolveArea(configEntity?.area_id || this.hass?.entities?.[entityId]?.area_id);
      if (fromEntity) return fromEntity;
    }

    return undefined;
  }

  private _getHiddenDeviceIds(): Set<string> {
    return new Set(
      (this._config?.device_admission?.hidden_devices || [])
        .filter((deviceId): deviceId is string => typeof deviceId === "string" && deviceId.length > 0)
    );
  }

  private _setDeviceHidden(deviceId: string, hidden: boolean): void {
    this._setDevicesHidden([deviceId], hidden);
  }

  private _setDevicesHidden(deviceIds: string[], hidden: boolean): void {
    if (!this._config) return;

    const nextHidden = this._getHiddenDeviceIds();
    deviceIds.forEach((deviceId) => {
      if (!deviceId) return;
      if (hidden) {
        nextHidden.add(deviceId);
      } else {
        nextHidden.delete(deviceId);
      }
    });

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      device_admission: {
        ...this._config.device_admission,
        hidden_devices: [...nextHidden].sort(),
      },
    };

    this._fireConfigChanged(newConfig);
  }

  private _uniqueDeviceIds(devices: DeviceVisibilityDevice[]): string[] {
    return [...new Set(devices.map((device) => device.deviceId))];
  }

  private _uniqueDeviceIdsFromGroups(groups: DeviceVisibilityTypeGroup[]): string[] {
    return [...new Set(groups.flatMap((group) => group.devices.map((device) => device.deviceId)))];
  }

  private _getDeviceTypeOptions(): Array<{ key: string; label: string; icon: string; color: string; count: number }> {
    if (!this.hass || !this._config) return [];

    const counts = new Map<string, number>();
    const processed = new Set<string>();
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const deviceAreas = new Map((this._config.devices || []).map((device) => [device.device_id, device.area_id]));

    const addEntity = (entityId: string, areaId?: string | null, deviceId?: string | null) => {
      if (!entityId || processed.has(entityId)) return;
      const registry = this.hass?.entities?.[entityId];
      if (registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') return;

      const resolvedAreaId = areaId || (deviceId ? deviceAreas.get(deviceId) : undefined) || registry?.area_id;
      if (!resolvedAreaId || hiddenAreas.has(resolvedAreaId)) return;
      if (this._isEntityHiddenInAreaOptions(resolvedAreaId, entityId)) return;

      const state = this.hass?.states?.[entityId];
      if (this._config?.settings?.hide_unavailable_entities_on_devices !== false &&
          (!state || state.state === 'unavailable' || state.state === 'unknown')) {
        return;
      }

      const key = this._deviceTypeKeyForEntityId(entityId);
      if (!key) return;

      processed.add(entityId);
      counts.set(key, (counts.get(key) || 0) + 1);
    };

    (this._config.entities || []).forEach((entity) => addEntity(entity.entity_id, entity.area_id, entity.device_id));

    Object.values(this.hass.states || {}).forEach((state: any) => {
      addEntity(state.entity_id, state.attributes?.area_id, this.hass?.entities?.[state.entity_id]?.device_id);
    });

    const hiddenPersons = new Set(this._config.settings?.hidden_persons || []);
    Object.values(this.hass.states || {}).forEach((state: any) => {
      const entityId = state.entity_id;
      if (!entityId?.startsWith('person.') || processed.has(entityId) || hiddenPersons.has(entityId)) return;
      if (this.hass?.entities?.[entityId]?.hidden_by) return;
      processed.add(entityId);
      counts.set('person', (counts.get('person') || 0) + 1);
    });

    return [...counts.entries()]
      .map(([key, count]) => ({
        key,
        label: this._deviceTypeName(key),
        icon: this._deviceTypeIcon(key),
        color: this._deviceTypeColor(key),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _isEntityHiddenInAreaOptions(areaId: string, entityId: string): boolean {
    const areaOptions = this._config?.areas_options?.[areaId];
    if (!areaOptions?.groups_options) return false;

    return Object.values(areaOptions.groups_options).some((groupOptions) =>
      groupOptions.hidden?.includes(entityId)
    );
  }

  private _deviceTypeKeyForEntityId(entityId: string): string | undefined {
    const domain = entityId.split('.')[0];
    if (!domain) return undefined;
    if (domain === 'binary_sensor') {
      const deviceClass = this.hass?.states?.[entityId]?.attributes?.device_class;
      return deviceClass ? `binary_sensor.${deviceClass}` : 'binary_sensor';
    }
    return domain;
  }

  private _deviceTypeName(key: string): string {
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassName(this.hass, key.slice('binary_sensor.'.length));
    }
    return getDomainName(this.hass, key);
  }

  private _deviceTypeIcon(key: string): string {
    if (key === 'person') return 'mdi:account-group';
    if (key.startsWith('binary_sensor.')) {
      return getDeviceClassIcon('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainIcon(key);
  }

  private _deviceTypeColor(key: string): string {
    if (key.startsWith('binary_sensor.')) {
      return getDomainColor('binary_sensor', key.slice('binary_sensor.'.length));
    }
    return getDomainColor(key);
  }

  private _getHiddenDeviceTypes(): Set<string> {
    return new Set(
      (this._config?.settings?.hidden_device_types || [])
        .filter((typeKey): typeKey is string => typeof typeKey === 'string' && typeKey.length > 0)
    );
  }

  private _setDeviceTypeVisible(typeKey: string, visible: boolean): void {
    if (!this._config) return;

    const hidden = this._getHiddenDeviceTypes();
    if (visible) {
      hidden.delete(typeKey);
    } else {
      hidden.add(typeKey);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        hidden_device_types: [...hidden].sort(),
      },
    };

    this._fireConfigChanged(newConfig);
  }

  private _getGroupTitle(group: string): string {
    const titles: Record<string, string> = {
      lights: "Lighting",
      climate: "Climate",
      media_players: "Media Players",
      covers: "Covers",
      security: "Security",
      motion: "Motion",
      actions: "Actions",
      others: "Sensors"
    };
    return titles[group] || group;
  }

  private _getAreaGroupedEntitiesWithoutFiltering(
    areaEntities: { entity_id: string }[],
    hass: HomeAssistant
  ): Record<AreaStrategyGroup, string[]> {
    const grouped = {
      lights: [] as string[],
      climate: [] as string[],
      covers: [] as string[],
      media_players: [] as string[],
      security: [] as string[],
      motion: [] as string[],
      actions: [] as string[],
      others: [] as string[],
    };

    areaEntities.forEach((entity) => {
      const entityId = entity.entity_id;
      const domain = entityId.split('.')[0];
      const state = hass.states[entityId];

      if (!state) return;

      // Skip hidden and diagnostic entities
      const entityRegistry = hass.entities?.[entityId];
      if (entityRegistry?.hidden_by || entityRegistry?.entity_category === 'diagnostic' || entityRegistry?.entity_category === 'config') {
        return;
      }

      // Group based on domain
      if (domain === 'light') {
        grouped.lights.push(entityId);
      } else if (domain === 'climate' || domain === 'humidifier' || domain === 'water_heater' || domain === 'fan') {
        grouped.climate.push(entityId);
      } else if (domain === 'cover') {
        grouped.covers.push(entityId);
      } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
                 ['door', 'garage_door', 'window'].includes(state.attributes.device_class)) {
        grouped.covers.push(entityId);
      } else if (domain === 'media_player') {
        grouped.media_players.push(entityId);
      } else if (domain === 'alarm_control_panel' || domain === 'lock' || domain === 'camera') {
        grouped.security.push(entityId);
      } else if (domain === 'binary_sensor' && state?.attributes?.device_class &&
                 ['motion', 'occupancy', 'presence'].includes(state.attributes.device_class)) {
        grouped.motion.push(entityId);
      } else if (domain === 'script' || domain === 'scene' || domain === 'automation') {
        grouped.actions.push(entityId);
      } else if (domain === 'switch' || domain === 'button' || domain === 'input_boolean' ||
                 domain === 'vacuum' || domain === 'lawn_mower' || domain === 'valve' ||
                  domain === 'select' || domain === 'number' || domain === 'input_select' ||
                  domain === 'input_number' || domain === 'counter' || domain === 'timer' ||
                  domain === 'sensor') {
        grouped.others.push(entityId);
      }
    });

    return grouped;
  }

  private _handleHomeSectionDragStart(e: DragEvent, section: HomeSectionKey): void {
    this._draggedHomeSection = section;

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", section);
    }
  }

  private _handleHomeSectionDragEnd = (): void => {
    this._draggedHomeSection = undefined;
    this._dragOverHomeSectionIndex = undefined;
  };

  private _handleHomeSectionDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    this._dragOverHomeSectionIndex = index;

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  private _handleHomeSectionDragLeave = (e: DragEvent): void => {
    const currentTarget = e.currentTarget as HTMLElement | null;
    const relatedTarget = e.relatedTarget as Node | null;

    if (!currentTarget?.contains(relatedTarget)) {
      this._dragOverHomeSectionIndex = undefined;
    }
  };

  private _handleHomeSectionDrop(e: DragEvent, dropIndex: number): void {
    e.preventDefault();

    const dragged = this._draggedHomeSection;
    if (!dragged) return;

    const order = this._getHomeSectionsOrder();
    const draggedIndex = order.indexOf(dragged);

    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      this._handleHomeSectionDragEnd();
      return;
    }

    const next = [...order];
    const [item] = next.splice(draggedIndex, 1);
    next.splice(dropIndex, 0, item!);
    this._setHomeSectionsOrder(next);
    this._handleHomeSectionDragEnd();
  }

  private _handleAreaDragStart(e: DragEvent, areaId: string): void {
    this._draggedAreaId = areaId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', areaId);
    }
  }

  private _handleAreaDragEnd(): void {
    this._draggedAreaId = undefined;
    this._dragOverIndex = undefined;
  }

  private _handleAreaDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    this._dragOverIndex = index;
  }

  private _handleAreaDragLeave(e: DragEvent): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('sortable-item')) {
      this._dragOverIndex = undefined;
    }
  }

  private _handleAreaDrop(e: DragEvent, dropIndex: number): void {
    e.preventDefault();

    if (!this._draggedAreaId || !this._config) return;

    const areas = Object.values(this.hass!.areas || {});
    const areaOrder = this._config.areas_display?.order || [];

    // Sort areas according to current order
    const sortedAreas = [...areas].sort((a, b) => {
      const aIndex = areaOrder.indexOf(a.area_id);
      const bIndex = areaOrder.indexOf(b.area_id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    // Find the dragged item's current index
    const draggedIndex = sortedAreas.findIndex(area => area.area_id === this._draggedAreaId);

    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      this._draggedAreaId = undefined;
      this._dragOverIndex = undefined;
      return;
    }

    // Reorder the areas
    const newSortedAreas = [...sortedAreas];
    const [removed] = newSortedAreas.splice(draggedIndex, 1);
    if (!removed) return;

    newSortedAreas.splice(dropIndex, 0, removed);

    // Create new order array
    const order = newSortedAreas.map(area => area.area_id);

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      areas_display: {
        ...this._config!.areas_display,
        order
      }
    };

    this._fireConfigChanged(newConfig);
    this._draggedAreaId = undefined;
    this._dragOverIndex = undefined;
  }

  private _handleEntityDragStart(e: DragEvent, entityId: string, group: string): void {
    this._draggedEntityId = entityId;
    this._draggedEntityGroup = group;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', entityId);
    }
  }

  private _handleEntityDragEnd(): void {
    this._draggedEntityId = undefined;
    this._draggedEntityGroup = undefined;
    this._dragOverEntityIndex = undefined;
  }

  private _handleEntityDragOver(e: DragEvent, group: string, index: number): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (this._draggedEntityGroup === group) {
      this._dragOverEntityIndex = index;
    }
  }

  private _handleEntityDragLeave(e: DragEvent): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('sortable-item')) {
      this._dragOverEntityIndex = undefined;
    }
  }

  private _handleEntityDrop(e: DragEvent, group: string, dropIndex: number): void {
    e.preventDefault();

    if (!this._draggedEntityId || !this._config || !this._area || this._draggedEntityGroup !== group) return;

    // Get entities for this group
    const areaEntities: { entity_id: string }[] = [];
    const seenEntities = new Set<string>();

    // Get entities from registry first
    if (this._config.entities) {
      // Get all devices in this area
      const areaDevices = new Set<string>();
      if (this._config.devices) {
        this._config.devices.forEach(device => {
          if (device.area_id === this._area) {
            areaDevices.add(device.device_id);
          }
        });
      }

      // Get entities via registry
      this._config.entities.forEach(entity => {
        if (entity.area_id === this._area ||
            (entity.device_id && areaDevices.has(entity.device_id))) {
          areaEntities.push({ entity_id: entity.entity_id });
          seenEntities.add(entity.entity_id);
        }
      });
    }

    // Get grouped entities
    const groups = this._getAreaGroupedEntitiesWithoutFiltering(areaEntities, this.hass!);
    const allGroupEntities = groups[group as keyof typeof groups] || [];
    const groupOptions = this._config.areas_options?.[this._area]?.groups_options?.[group];
    const entityOrder = groupOptions?.order || [];

    // Sort entities according to current order
    const sortedEntities = [...allGroupEntities].sort((a, b) => {
      const aIndex = entityOrder.indexOf(a);
      const bIndex = entityOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      const nameA = this.hass!.states[a]?.attributes?.friendly_name || a;
      const nameB = this.hass!.states[b]?.attributes?.friendly_name || b;
      return nameA.localeCompare(nameB);
    });

    // Find the dragged item's current index
    const draggedIndex = sortedEntities.findIndex(entityId => entityId === this._draggedEntityId);

    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      this._draggedEntityId = undefined;
      this._draggedEntityGroup = undefined;
      this._dragOverEntityIndex = undefined;
      return;
    }

    // Reorder the entities
    const newSortedEntities = [...sortedEntities];
    const [removed] = newSortedEntities.splice(draggedIndex, 1);
    if (!removed) return;

    newSortedEntities.splice(dropIndex, 0, removed);

    // Create new order array
    const order = newSortedEntities;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      areas_options: {
        ...this._config!.areas_options,
        [this._area]: {
          ...this._config!.areas_options?.[this._area],
          groups_options: {
            ...this._config!.areas_options?.[this._area]?.groups_options,
            [group]: {
              ...this._config!.areas_options?.[this._area]?.groups_options?.[group],
              order
            }
          }
        }
      }
    };

    this._fireConfigChanged(newConfig);
    this._draggedEntityId = undefined;
    this._draggedEntityGroup = undefined;
    this._dragOverEntityIndex = undefined;
  }



  private _toggleAreaVisibility(area: string): void {
    const hidden = [...(this._config!.areas_display?.hidden || [])];
    const index = hidden.indexOf(area);

    if (index === -1) {
      hidden.push(area);
    } else {
      hidden.splice(index, 1);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      areas_display: {
        ...this._config!.areas_display,
        hidden
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleEntityVisibility(entityId: string, group: string): void {

    const hidden = [...(this._config!.areas_options?.[this._area!]?.groups_options?.[group]?.hidden || [])];
    const index = hidden.indexOf(entityId);

    if (index === -1) {
      hidden.push(entityId);
    } else {
      hidden.splice(index, 1);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      areas_options: {
        ...this._config!.areas_options,
        [this._area!]: {
          ...this._config!.areas_options?.[this._area!],
          groups_options: {
            ...this._config!.areas_options?.[this._area!]?.groups_options,
            [group]: {
              ...this._config!.areas_options?.[this._area!]?.groups_options?.[group],
              hidden
            }
          }
        }
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _editArea(area: string): void {
    this._area = area;
  }

  private _addFavoriteEntity(): void {
    this._showEntityPicker = true;
    this._entitySearchFilter = '';
  }

  private _addWeatherEntity(): void {
    this._showWeatherPicker = true;
    this._weatherSearchFilter = '';
  }

  private _addAlarmEntity(): void {
    this._showAlarmPicker = true;
    this._alarmSearchFilter = '';
  }

  private _renderSelectedWeatherEntity() {
    const weatherEntityId = this._config?.settings?.weather_entity_id;

    if (!weatherEntityId) {
      return html`
        <div class="no-weather">
          <p>No weather entity selected. Will use first available weather entity.</p>
        </div>
      `;
    }

    const state = this.hass?.states[weatherEntityId];
    const friendlyName = state?.attributes?.friendly_name || weatherEntityId;

    return html`
      <div class="selected-weather-entity" data-entity-id="${weatherEntityId}">
        <ha-state-icon
          .stateObj=${state}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${friendlyName}</span>
        <button
          class="remove-button"
          title="Remove"
          @click=${() => this._removeWeatherEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `;
  }

  private _renderSelectedAlarmEntity() {
    const alarmEntityId = this._config?.settings?.alarm_entity_id;

    if (!alarmEntityId) {
      return html`
        <div class="no-alarm">
          <p>No alarm entity selected. The alarm chip is hidden on the home page.</p>
        </div>
      `;
    }

    const state = this.hass?.states[alarmEntityId];
    const friendlyName = state?.attributes?.friendly_name || alarmEntityId;

    return html`
      <div class="selected-alarm-entity" data-entity-id="${alarmEntityId}">
        <ha-state-icon
          .stateObj=${state}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${friendlyName}</span>
        <button
          class="remove-button"
          title="Remove"
          @click=${() => this._removeAlarmEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `;
  }

  private _renderSelectedEntities() {
    const favorites = this._config?.favorites || [];

    if (favorites.length === 0) {
      return html`
        <div class="no-favorites">
                          <p>No favorites selected yet.</p>
        </div>
      `;
    }

    return html`
      <div class="selected-entities">
        ${repeat(
          favorites,
          (entityId) => entityId,
          (entityId) => {
            const state = this.hass?.states[entityId];
            const friendlyName = state?.attributes?.friendly_name || entityId;

            return html`
              <div class="selected-entity" data-entity-id="${entityId}">
                <ha-state-icon
                  .stateObj=${state}
                  class="entity-icon"
                ></ha-state-icon>
                <span class="entity-name">${friendlyName}</span>
                <button
                  class="remove-button"
                  title="Remove"
                  @click=${() => this._removeFavoriteEntity(entityId)}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            `;
          }
        )}
      </div>
    `;
  }

  private _renderWeatherPicker() {
    const allEntities = Object.keys(this.hass?.states || {});
    const weatherEntities = allEntities.filter(entityId =>
      entityId.startsWith('weather.') &&
      this.hass?.states[entityId]?.state !== 'unavailable'
    );

    const filteredWeatherEntities = weatherEntities.filter(entityId => {
      if (!this._weatherSearchFilter) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLowerCase().includes(this._weatherSearchFilter.toLowerCase()) ||
             entityId.toLowerCase().includes(this._weatherSearchFilter.toLowerCase());
    });

    return html`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>Select Weather Entity</h4>
            <button
              class="close-button"
              title="Close"
              @click=${() => this._showWeatherPicker = false}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label="Search weather entities..."
              .value=${this._weatherSearchFilter}
              @input=${(e: Event) => this._weatherSearchFilter = (e.target as HTMLInputElement).value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${repeat(
              filteredWeatherEntities.slice(0, 20), // Limit to 20 results for weather
              (entityId) => entityId,
              (entityId) => {
                const state = this.hass?.states[entityId];
                const friendlyName = state?.attributes?.friendly_name || entityId;

                return html`
                  <div class="entity-option" @click=${() => this._selectWeatherEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </div>
                `;
              }
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderAlarmPicker() {
    const allEntities = Object.keys(this.hass?.states || {});
    const alarmEntities = allEntities.filter(entityId =>
      entityId.startsWith('alarm_control_panel.') &&
      !this.hass?.entities?.[entityId]?.hidden_by
    );

    const filteredAlarmEntities = alarmEntities.filter(entityId => {
      if (!this._alarmSearchFilter) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLowerCase().includes(this._alarmSearchFilter.toLowerCase()) ||
             entityId.toLowerCase().includes(this._alarmSearchFilter.toLowerCase());
    });

    return html`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>Select Alarm Entity</h4>
            <button
              class="close-button"
              title="Close"
              @click=${() => this._showAlarmPicker = false}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label="Search alarm entities..."
              .value=${this._alarmSearchFilter}
              @input=${(e: Event) => this._alarmSearchFilter = (e.target as HTMLInputElement).value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${repeat(
              filteredAlarmEntities.slice(0, 20),
              (entityId) => entityId,
              (entityId) => {
                const state = this.hass?.states[entityId];
                const friendlyName = state?.attributes?.friendly_name || entityId;

                return html`
                  <div class="entity-option" @click=${() => this._selectAlarmEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </div>
                `;
              }
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderEntityPicker() {
    const allEntities = Object.keys(this.hass?.states || {});
    const filteredEntities = allEntities.filter(entityId => {
      if (!this._entitySearchFilter) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLowerCase().includes(this._entitySearchFilter.toLowerCase()) ||
             entityId.toLowerCase().includes(this._entitySearchFilter.toLowerCase());
    });

    const favorites = this._config?.favorites || [];
    const availableEntities = filteredEntities.filter(entityId => !favorites.includes(entityId));

    return html`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>Select Entity</h4>
            <button
              class="close-button"
              title="Close"
              @click=${() => this._showEntityPicker = false}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <ha-textfield
              .label="Search..."
              .value=${this._entitySearchFilter}
              @input=${(e: Event) => this._entitySearchFilter = (e.target as HTMLInputElement).value}
            ></ha-textfield>
          </div>

          <div class="entity-list">
            ${repeat(
              availableEntities.slice(0, 50), // Limit to 50 results
              (entityId) => entityId,
              (entityId) => {
                const state = this.hass?.states[entityId];
                const friendlyName = state?.attributes?.friendly_name || entityId;

                return html`
                  <div class="entity-option" @click=${() => this._selectEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </div>
                `;
              }
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _selectWeatherEntity(entityId: string): void {
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        weather_entity_id: entityId
      }
    };

    this._fireConfigChanged(newConfig);
    this._showWeatherPicker = false;
  }

  private _selectAlarmEntity(entityId: string): void {
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        alarm_entity_id: entityId
      }
    };

    this._fireConfigChanged(newConfig);
    this._showAlarmPicker = false;
  }

  private _removeWeatherEntity(): void {
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        weather_entity_id: undefined
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _removeAlarmEntity(): void {
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        alarm_entity_id: undefined
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleTimeDisplay(e: Event): void {
    const target = e.target as any;
    const showTime = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_time: showTime
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleWeatherDisplay(e: Event): void {
    const target = e.target as any;
    const showWeather = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_weather: showWeather
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleNotificationsDisplay(e: Event): void {
    const target = e.target as any;
    const showNotifications = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_notifications: showNotifications
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleSuggestedFavorites(e: Event): void {
    const target = e.target as any;
    const showSuggestedFavorites = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_suggested_favorites: showSuggestedFavorites
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleHideUnavailableEntities(e: Event): void {
    const target = e.target as any;
    const hideUnavailable = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        hide_unavailable_entities_on_devices: hideUnavailable
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleRecentDevicesPanel(e: Event): void {
    const target = e.target as any;
    const showPanel = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_recent_devices_panel: showPanel
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleRestrictNonAdminHaSidebar(e: Event): void {
    const target = e.target as any;
    const restrict = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        restrict_non_admin_ha_sidebar: restrict
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleRestrictNonAdminDashboardSettings(e: Event): void {
    const target = e.target as any;
    const restrict = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        restrict_non_admin_dashboard_settings: restrict
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _selectEntity(entityId: string): void {
    const favorites = [...(this._config?.favorites || [])];
    if (!favorites.includes(entityId)) {
      favorites.push(entityId);

      const newConfig: DwainsDashboardConfig = {
        ...this._config!,
        favorites
      };

      this._fireConfigChanged(newConfig);
    }

    this._showEntityPicker = false;
  }

  private _removeFavoriteEntity(entityId: string): void {
    const favorites = [...(this._config?.favorites || [])];
    const index = favorites.indexOf(entityId);
    if (index > -1) {
      favorites.splice(index, 1);

      const newConfig: DwainsDashboardConfig = {
        ...this._config!,
        favorites
      };

      this._fireConfigChanged(newConfig);
    }
  }

  private _renderPersonsConfiguration() {
    if (!this.hass?.states) {
      return html`<p>No persons found</p>`;
    }

    // Get all person entities
    const personEntities = Object.keys(this.hass.states)
      .filter(entityId => entityId.startsWith('person.'))
      .map(entityId => {
        const state = this.hass!.states[entityId];
        return {
          entity_id: entityId,
          state,
          friendly_name: state?.attributes?.friendly_name || entityId
        };
      })
      .sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));

    if (personEntities.length === 0) {
      return html`
        <div class="no-persons">
          <p>No person entities found in your Home Assistant configuration.</p>
          <p style="font-size: 12px; color: var(--secondary-text-color);">
            Add person entities to see them here.
          </p>
        </div>
      `;
    }

    const hiddenPersons = new Set(this._config?.settings?.hidden_persons || []);

    return html`
      <div class="persons-list">
        ${repeat(
          personEntities,
          (person) => person.entity_id,
          (person) => {
            const isHidden = hiddenPersons.has(person.entity_id);

            return html`
              <div class="person-item ${isHidden ? 'hidden' : ''}">
                <ha-state-icon
                  .stateObj=${person.state}
                  class="person-icon"
                ></ha-state-icon>
                <span class="person-name">${person.friendly_name}</span>
                <span class="person-state ${person.state?.state === 'home' ? 'home' : 'away'}">
                  ${person.state?.state === 'home' ? 'Home' : 'Away'}
                </span>
                <ha-icon-button
                  .label=${isHidden ? "Show" : "Hide"}
                  .path=${isHidden ? mdiEye : mdiEyeOff}
                  @click=${() => this._togglePersonVisibility(person.entity_id)}
                ></ha-icon-button>
              </div>
            `;
          }
        )}
      </div>
    `;
  }

  private _togglePersonVisibility(personId: string): void {
    const hiddenPersons = [...(this._config?.settings?.hidden_persons || [])];
    const index = hiddenPersons.indexOf(personId);

    if (index === -1) {
      hiddenPersons.push(personId);
    } else {
      hiddenPersons.splice(index, 1);
    }

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        hidden_persons: hiddenPersons
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _editAreaRegistry(ev: Event): void {
    ev.stopPropagation();
    // This would open the area registry dialog in Home Assistant
    // For now, we'll just show an alert
          alert(this._t('strategy.edit_area_alert'));
  }

  private _openReplacementManager(): void {
    if (!this.hass || !this._config) return;
    openReplacementManager(this.hass, this._config, (config) => {
      this._fireConfigChanged(config);
      this.requestUpdate();
    });
  }

  private _replacementCount(): number {
    return countReplacementRules(this._config?.blueprint_replacements);
  }

  private _fireConfigChanged(config: DwainsDashboardConfig): void {
    rememberSettingsPage(this._settingsPage);

    this._config = {
      ...this._config,
      ...config
    };

    // Only save essential configuration, not live data
    const cleanConfig = {
      type: "custom:dwains-dashboard-next",
      areas_display: config.areas_display || {},
      areas_options: config.areas_options || {},
      blueprint_replacements: config.blueprint_replacements || {},
      device_admission: config.device_admission || {},
      favorites: config.favorites || [],
      settings: config.settings || {}
    };

    const event = new CustomEvent("config-changed", {
      detail: { config: cleanConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .editor-container {
        padding: 16px;
      }

      .settings-overview-hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        max-width: 720px;
        margin: 0 auto 18px;
        padding: 22px 24px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background:
          radial-gradient(circle at top right, color-mix(in srgb, var(--primary-color) 12%, transparent), transparent 42%),
          var(--card-background-color);
        box-shadow: 0 8px 26px rgba(15, 23, 42, 0.06);
      }

      .settings-overview-hero h2 {
        margin: 0;
        color: var(--primary-text-color);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .settings-overview-hero p {
        margin: 6px 0 0;
        color: var(--secondary-text-color);
        font-size: 13px;
        line-height: 1.45;
      }

      .settings-version-chip {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding: 7px 10px;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
      }

      .settings-version-chip ha-icon,
      .settings-version-chip svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
        --mdc-icon-size: 16px;
      }

      .settings-version-chip strong {
        color: var(--primary-text-color);
        font-weight: 800;
      }

      .settings-overview-hero > ha-icon,
      .settings-overview-hero > svg {
        flex: 0 0 auto;
        width: 48px;
        height: 48px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        fill: currentColor;
        --mdc-icon-size: 26px;
      }

      .settings-overview-hero > svg {
        padding: 11px;
        box-sizing: border-box;
      }

      .settings-nav-section {
        max-width: 720px;
        margin: 0 auto 16px;
      }

      .settings-nav-section h3 {
        margin: 0 0 8px;
        padding: 0 14px;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .settings-nav-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .settings-nav-item {
        width: 100%;
        min-height: 76px;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto 24px;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        border: 0;
        border-bottom: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        background: transparent;
        text-align: left;
        cursor: pointer;
        font: inherit;
      }

      .settings-nav-item:last-child {
        border-bottom: 0;
      }

      .settings-nav-item:hover {
        background: color-mix(in srgb, var(--settings-item-color) 5%, transparent);
      }

      .settings-nav-icon {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: var(--settings-item-color);
      }

      .settings-nav-icon ha-icon,
      .settings-nav-icon svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
        --mdc-icon-size: 24px;
      }

      .settings-nav-copy {
        min-width: 0;
      }

      .settings-nav-title {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 700;
        line-height: 1.2;
      }

      .settings-nav-description {
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .settings-nav-summary {
        justify-self: end;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px 10px;
        border-radius: 999px;
        color: var(--settings-item-color);
        background: color-mix(in srgb, var(--settings-item-color) 10%, transparent);
        font-size: 12px;
        font-weight: 700;
      }

      .settings-nav-chevron {
        color: var(--secondary-text-color);
        width: 22px;
        height: 22px;
        fill: currentColor;
        --mdc-icon-size: 22px;
      }

      .settings-loading-shell {
        min-height: 420px;
      }

      .settings-overview-hero-skeleton {
        opacity: 0.92;
      }

      .settings-nav-item-skeleton {
        pointer-events: none;
        cursor: default;
      }

      .skeleton-block,
      .settings-skeleton-copy span,
      .settings-skeleton-copy small {
        position: relative;
        overflow: hidden;
        background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
      }

      .skeleton-block::after,
      .settings-skeleton-copy span::after,
      .settings-skeleton-copy small::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--card-background-color) 70%, transparent), transparent);
        animation: settings-skeleton-shimmer 1.2s ease-in-out infinite;
      }

      .settings-skeleton-copy {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .settings-skeleton-copy span,
      .settings-skeleton-copy small {
        display: block;
        border-radius: 999px;
      }

      .settings-skeleton-copy span {
        width: 180px;
        height: 14px;
      }

      .settings-skeleton-copy small {
        width: 260px;
        max-width: 100%;
        height: 10px;
      }

      @keyframes settings-skeleton-shimmer {
        to {
          transform: translateX(100%);
        }
      }

      .settings-detail-toolbar {
        max-width: 940px;
        margin: 0 auto 14px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 16px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color));
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
      }

      .settings-back-button {
        width: auto;
        min-width: 0;
        height: 36px;
        padding: 0 12px 0 10px;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, transparent);
        box-shadow: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
      }

      .settings-back-button ha-icon {
        --mdc-icon-size: 18px;
      }

      .settings-back-button span {
        white-space: nowrap;
      }

      .settings-detail-title {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .settings-detail-title span {
        color: var(--primary-text-color);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
      }

      .settings-detail-title small {
        margin-top: 2px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .settings-detail-content {
        max-width: 940px;
        margin: 0 auto;
      }

      .empty-settings-card {
        margin: 0 16px 16px;
        padding: 18px;
        border: 1px dashed var(--divider-color);
        border-radius: 10px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        text-align: center;
      }

      .dashboard-settings {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0 8px;
      }
      .dashboard-settings ha-icon-picker {
        width: 100%;
      }

      @media (max-width: 700px) {
        .settings-overview-hero,
        .settings-nav-section,
        .settings-detail-content,
        .settings-detail-toolbar {
          max-width: none;
        }

        .settings-overview-hero {
          align-items: flex-start;
          padding: 18px;
        }

        .settings-overview-hero > ha-icon,
        .settings-overview-hero > svg {
          width: 40px;
          height: 40px;
          --mdc-icon-size: 22px;
        }

        .settings-overview-hero > svg {
          padding: 9px;
        }

        .settings-nav-item {
          grid-template-columns: 40px minmax(0, 1fr) 22px;
          gap: 12px;
          min-height: 72px;
          padding: 12px;
        }

        .settings-nav-icon {
          width: 40px;
          height: 40px;
        }

        .settings-nav-summary {
          grid-column: 2 / -1;
          justify-self: start;
          max-width: 100%;
          margin-top: -4px;
        }

        .settings-nav-chevron {
          grid-column: 3;
          grid-row: 1;
        }

        .settings-detail-toolbar {
          margin: 0 0 12px;
          padding: 10px 12px;
          border-radius: 14px;
        }

        .settings-detail-title span {
          font-size: 17px;
        }

        .settings-detail-title small {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .home-layout-section {
        display: grid;
        gap: 18px;
        padding: 0 16px 16px;
      }

      .home-section-list,
      .home-info-card-list {
        display: grid;
        gap: 8px;
      }

      .home-section-item,
      .home-info-card-item {
        display: grid;
        grid-template-columns: 32px 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        transition: border-color 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease, transform 0.16s ease;
      }

      .home-info-card-item {
        grid-template-columns: 42px minmax(0, 1fr) auto;
      }

      .home-info-card-section {
        display: grid;
        gap: 10px;
      }

      .home-info-card-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 16px;
        padding: 0 2px;
      }

      .home-info-card-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        color: var(--primary-text-color);
      }

      .home-info-card-header p {
        margin: 4px 0 0;
        font-size: 13px;
        line-height: 1.35;
        color: var(--secondary-text-color);
      }

      .home-info-card-header span {
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 800;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-radius: 999px;
        padding: 6px 10px;
      }

      .home-section-item.dragging {
        opacity: 0.5;
        transform: scale(0.99);
      }

      .home-section-item.drag-over {
        border-color: var(--primary-color);
        box-shadow:
          inset 0 0 0 1px var(--primary-color),
          0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .home-section-item.disabled,
      .home-info-card-item.disabled {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 78%, var(--secondary-background-color));
      }

      .home-section-handle {
        display: flex;
        color: var(--secondary-text-color);
        cursor: grab;
      }

      .home-section-handle:active {
        cursor: grabbing;
      }

      .home-section-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }

      .home-section-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-section-item.disabled .home-section-icon,
      .home-info-card-item.disabled .home-section-icon {
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
      }

      .home-section-copy {
        min-width: 0;
      }

      .home-section-title {
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .home-section-description {
        margin-top: 2px;
        font-size: 12px;
        line-height: 1.35;
        color: var(--secondary-text-color);
      }

      .home-section-actions {
        display: inline-flex;
        gap: 2px;
      }

      .home-section-toggle {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: pointer;
      }

      .home-section-toggle.enabled {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .home-section-toggle ha-icon {
        --mdc-icon-size: 20px;
      }

      .home-layout-reset {
        justify-self: start;
        border: 0;
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      @media (max-width: 600px) {
        .home-section-item {
          grid-template-columns: 28px 36px minmax(0, 1fr);
        }

        .home-info-card-item {
          grid-template-columns: 36px minmax(0, 1fr) auto;
        }

        .home-section-icon {
          width: 36px;
          height: 36px;
        }

        .home-section-actions {
          grid-column: 2 / -1;
          justify-self: start;
        }

        .home-info-card-header {
          align-items: start;
          flex-direction: column;
          gap: 8px;
        }
      }

      .dd-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .dd-field label {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .dd-input {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 14px;
        font-size: 1rem;
        color: var(--primary-text-color);
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        outline: none;
        transition: border-color .2s ease;
      }
      .dd-input:focus {
        border-color: var(--primary-color);
      }

      /* Sponsoring Section Styles */
      .sponsoring-section {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color, var(--primary-color)));
        color: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      }

      .sponsoring-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        pointer-events: none;
      }

      .sponsoring-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
      }

      .sponsoring-header ha-icon {
        --mdc-icon-size: 28px;
        color: #ffeb3b;
        animation: heartbeat 2s infinite;
      }

      @keyframes heartbeat {
        0%, 50%, 100% { transform: scale(1); }
        25% { transform: scale(1.1); }
      }

      .sponsoring-header h3 {
        margin: 0;
        font-size: 21px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .sponsoring-text {
        position: relative;
        z-index: 1;
        margin: 0 0 16px 0;
        line-height: 1.6;
        font-size: 13px;
        opacity: 0.95;
      }
      .sponsoring-text strong { font-weight: 700; }

      .sponsor-label {
        position: relative;
        z-index: 1;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 10px;
        opacity: 0.95;
      }

      .sponsor-chips {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .sponsor-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 16px;
        border-radius: 999px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.35);
        transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      }
      .sponsor-chip ha-icon { --mdc-icon-size: 18px; }
      .sponsor-chip:hover {
        background: rgba(255, 255, 255, 0.28);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      }
      .sponsor-chip.primary {
        background: #fff;
        color: var(--primary-color);
        border-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      }
      .sponsor-chip.primary:hover { filter: brightness(0.97); }

      .sponsor-divider {
        position: relative;
        z-index: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.25);
        margin: 18px 0;
      }

      @media (max-width: 600px) {
        .sponsoring-section { padding: 20px; margin-bottom: 20px; }
        .sponsoring-header h3 { font-size: 20px; }
        .sponsor-chips { flex-direction: column; }
        .sponsor-chip { justify-content: center; }
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: -16px -16px 16px -16px;
        padding: 8px;
        background: var(--primary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .toolbar ha-icon-button {
        color: var(--primary-text-color);
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 24px;
        flex: 0 0 auto;
      }

      .toolbar h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        flex: 1;
        padding: 0 4px;
      }

      ha-expansion-panel {
        margin-bottom: 8px;
        --expansion-panel-summary-padding: 0 16px;
      }

      ha-expansion-panel [slot="header"] {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .description {
        margin: 16px;
        color: var(--secondary-text-color);
      }

      .area-help {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin: 0 0px 16px 0px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      .area-help-icon {
        --mdc-icon-size: 24px;
      }
      .area-help-text p {
        margin: 0 0 6px 0;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .sortable-container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 16px 16px 16px;
      }

      .sortable-item {
        position: relative;
        background: var(--card-background-color);
        border-radius: 4px;
        box-shadow: var(--card-box-shadow, none);
        transition: all 0.2s ease;
        user-select: none;
        cursor: grab;
      }

      .sortable-item:active {
        cursor: grabbing;
      }

      .sortable-item.hidden {
        opacity: 0.5;
      }

      .sortable-item:hover {
        background: var(--secondary-background-color);
      }

      .sortable-item.dragging {
        opacity: 0.4;
        transform: scale(0.95);
        transition: none;
      }

      .sortable-container.dragging .sortable-item {
        transition: transform 0.2s ease;
      }

      .sortable-container.dragging .sortable-item:not(.dragging):hover {
        transform: translateY(2px);
      }

      .sortable-item.drag-over {
        position: relative;
      }

      .sortable-item.drag-over::before {
        content: '';
        position: absolute;
        top: -2px;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--primary-color);
        border-radius: 2px;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }

      .area-item,
      .entity-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 16px;
        min-height: 48px;
      }

      .sortable-item:hover {
        background: var(--secondary-background-color);
      }

      .handle {
        cursor: grab;
        margin-right: 8px;
        display: flex;
        align-items: center;
        padding: 8px 4px;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
      }

      .handle:hover {
        background: var(--primary-background-color);
        border-radius: 4px;
        color: var(--primary-color);
      }

      .handle:active {
        cursor: grabbing;
      }

      .handle ha-svg-icon {
        --mdc-icon-size: 20px;
      }

      .area-icon,
      .entity-icon {
        margin-right: 16px;
      }

      .area-name,
      .entity-name {
        flex: 1;
      }

      .area-name.clickable {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .area-name.clickable:hover {
        color: var(--primary-color);
      }

      .area-name .chevron {
        --mdc-icon-size: 20px;
        opacity: 0.6;
      }

      .area-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      button.link {
        color: var(--primary-color);
        text-decoration: none;
        background: none;
        border: none;
        cursor: pointer;
        font-size: inherit;
        padding: 0;
      }

      ha-icon-button[disabled] {
        opacity: 0.5;
        pointer-events: none;
      }

      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
      }

      .favorites-section,
      .time-section,
      .weather-section,
      .alarm-section,
      .entity-display-section,
      .replacement-section {
        padding: 0 16px 16px 16px;
      }

      .replacement-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .replacement-count {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .replacement-help {
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }

      .replacement-summary ha-button ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 6px;
      }

      @media (max-width: 600px) {
        .replacement-summary {
          align-items: stretch;
          flex-direction: column;
        }
      }

      .time-toggle,
      .weather-toggle,
      .favorite-suggestions-toggle,
      .hide-unavailable-toggle {
        margin-bottom: 16px;
      }

      .time-toggle ha-formfield,
      .weather-toggle ha-formfield,
      .favorite-suggestions-toggle ha-formfield,
      .hide-unavailable-toggle ha-formfield {
        --mdc-typography-body2-font-size: 14px;
      }

      .toggle-description {
        margin: 8px 0 0 0;
        font-size: 12px;
        color: var(--secondary-text-color);
        line-height: 1.4;
        padding-left: 16px;
        border-left: 3px solid var(--divider-color);
      }

      .device-types-visibility {
        margin-top: 20px;
        display: grid;
        gap: 12px;
      }

      .device-admission-section {
        margin-top: 24px;
        display: grid;
        gap: 12px;
      }

      .device-types-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
      }

      .device-types-header h4 {
        margin: 0;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 700;
      }

      .device-types-header p {
        margin: 4px 0 0;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.35;
      }

      .device-types-header > span {
        flex: 0 0 auto;
        padding: 6px 10px;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font-size: 12px;
        font-weight: 800;
      }

      .device-types-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 8px;
      }

      .device-type-option {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        transition: opacity 0.16s ease, border-color 0.16s ease, background 0.16s ease;
      }

      .device-type-option.enabled {
        border-color: color-mix(in srgb, var(--device-type-color) 24%, var(--divider-color));
      }

      .device-type-option.disabled {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 78%, var(--secondary-background-color));
      }

      .device-type-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--device-type-color);
        background: color-mix(in srgb, var(--device-type-color) 13%, transparent);
      }

      .device-type-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .device-type-copy {
        min-width: 0;
      }

      .device-type-name {
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-type-count {
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1;
      }

      .device-admission-global-actions,
      .device-admission-group-actions,
      .device-admission-area-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .device-admission-global-actions button,
      .device-admission-group-actions button,
      .device-admission-area-actions button {
        min-height: 34px;
        border: 0;
        border-radius: 999px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .device-admission-global-actions button[disabled],
      .device-admission-group-actions button[disabled],
      .device-admission-area-actions button[disabled] {
        opacity: 0.42;
        cursor: not-allowed;
      }

      .device-admission-global-actions ha-icon {
        --mdc-icon-size: 16px;
      }

      .device-admission-groups {
        display: grid;
        gap: 8px;
      }

      .device-admission-groups ha-expansion-panel,
      .device-admission-area,
      .device-admission-device {
        content-visibility: auto;
      }

      .device-admission-groups ha-expansion-panel {
        contain-intrinsic-size: auto 86px;
      }

      .device-admission-panel-header {
        width: 100%;
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
      }

      .device-type-icon.small {
        width: 34px;
        height: 34px;
        border-radius: 9px;
      }

      .device-type-icon.small ha-icon {
        --mdc-icon-size: 19px;
      }

      .device-admission-panel-header > span:not(.device-type-icon) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--primary-text-color);
        font-weight: 800;
      }

      .device-admission-panel-header small {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 700;
      }

      .device-admission-panel {
        display: grid;
        gap: 12px;
        padding: 0 16px 16px;
      }

      .device-admission-group-actions {
        justify-content: flex-end;
      }

      .device-admission-area {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: color-mix(in srgb, var(--card-background-color) 82%, var(--secondary-background-color));
        contain-intrinsic-size: auto 180px;
      }

      .device-admission-area-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .device-admission-area-header strong {
        display: block;
        color: var(--primary-text-color);
        font-size: 14px;
        line-height: 1.2;
      }

      .device-admission-area-header span {
        display: block;
        margin-top: 2px;
        color: var(--secondary-text-color);
        font-size: 12px;
      }

      .device-admission-device-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 8px;
      }

      .device-admission-device {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--device-type-color) 22%, var(--divider-color));
        border-radius: 10px;
        background: var(--card-background-color);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        contain-intrinsic-size: auto 64px;
      }

      .device-admission-device.hidden {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 74%, var(--secondary-background-color));
      }

      .device-admission-copy {
        min-width: 0;
      }

      @media (max-width: 600px) {
        .device-types-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .device-types-grid {
          grid-template-columns: 1fr;
        }

        .device-admission-panel {
          padding: 0 10px 12px;
        }

        .device-admission-area-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .device-admission-device-list {
          grid-template-columns: 1fr;
        }
      }

      .entity-picker,
      .weather-picker,
      .alarm-picker {
        width: 100%;
      }

      .weather-picker-header,
      .alarm-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .weather-picker-header h4,
      .alarm-picker-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .no-weather,
      .no-alarm {
        text-align: center;
        padding: 24px;
        color: var(--secondary-text-color);
      }

      .selected-weather-entity,
      .selected-alarm-entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }

      .selected-weather-entity .entity-icon,
      .selected-alarm-entity .entity-icon {
        --mdc-icon-size: 24px;
      }

      .selected-weather-entity .entity-name,
      .selected-alarm-entity .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .entity-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .entity-picker-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .no-favorites {
        text-align: center;
        padding: 24px;
        color: var(--secondary-text-color);
      }

      .selected-entities {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .selected-entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }

      .selected-entity .entity-icon {
        --mdc-icon-size: 24px;
      }

      .selected-entity .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .remove-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--error-color, #f44336);
        transition: all 0.2s ease;
        width: 36px;
        height: 36px;
      }

      .remove-button:hover {
        background: var(--error-color, #f44336);
        color: white;
        transform: scale(1.1);
      }

      .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
        width: 36px;
        height: 36px;
      }

      .close-button:hover {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        transform: scale(1.1);
      }

      .entity-picker-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .entity-picker-content {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 24px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .entity-picker-content .entity-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .entity-search {
        margin-bottom: 16px;
      }

      .entity-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .entity-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--primary-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .entity-option:hover {
        background: var(--secondary-background-color);
      }

      .entity-option .entity-icon {
        --mdc-icon-size: 24px;
      }

      .entity-option .entity-name {
        flex: 1;
        font-size: 14px;
      }

      .entity-option .entity-id {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-family: var(--font-family-code);
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
      }

      .persons-section {
        padding: 0 16px 16px 16px;
      }

      .persons-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .person-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        transition: all 0.2s ease;
      }

      .person-item:hover {
        background: var(--secondary-background-color);
      }

      .person-item.hidden {
        opacity: 0.5;
        background: var(--disabled-background-color, var(--secondary-background-color));
      }

      .person-icon {
        --mdc-icon-size: 32px;
        flex-shrink: 0;
      }

      .person-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
      }

      .person-state {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .person-state.home {
        background: var(--success-color, #4caf50);
        color: white;
      }

      .person-state.away {
        background: var(--warning-color, #ff9800);
        color: white;
      }

      .no-persons {
        text-align: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dwains-dashboard-next-strategy-editor": DwainsDashboardStrategyEditor;
  }
}
