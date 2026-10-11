import {
  mdiArrowDown,
  mdiArrowUp,
  mdiCardAccountDetailsStarOutline,
  mdiChevronRight,
  mdiDelete,
  mdiDrag,
  mdiFloorPlan,
  mdiFormatListBulletedType,
  mdiGestureTapButton,
  mdiHeart,
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
import type { AreaCustomCard, AreaEntityLayout, AreaSortMode, DeviceConfig, DwainsDashboardConfig, HomeCustomCard, HomeInformationCardKey, HomeSectionKey, LovelaceCardConfig, MasterActionConfirmationDomain } from "../types/strategy";
import { openReplacementManager } from "./dwains-replacement-manager-dialog";
import {
  AREA_STRATEGY_GROUPS,
  AREA_STRATEGY_GROUP_ICONS,
  getAreaEntityGroupKey,
  getLegacyAreaGroupKey,
  resolveAreaSortMode,
  sortAreas,
  type AreaStrategyGroup
} from "../utils/area-entities";
import { countReplacementRules } from "../utils/blueprint-replacements";
import { isHiddenAsUnavailable } from "../utils/entity-availability";
import { resolveStatusEntityAreaId } from "../utils/entity-lookups";
import { normalizeNowPlayingMode } from "../utils/now-playing";
import { getDeviceClassName, getDomainName } from "../utils/domain-names";
import { getDeviceClassIcon, getDomainColor, getDomainIcon } from "../utils/icons";
import { ddLocale, ddLocalize, ddLocalizePlural } from "../utils/localize";
import { stripAreaNameFromEntityName } from "../utils/entity-names";
import {
  DEFAULT_HOME_INFORMATION_CARDS,
  HOME_INFORMATION_CARD_META,
  HOME_SECTION_META,
  normalizeHiddenHomeInformationCards,
  normalizeHiddenHomeSections,
  normalizeHomeSectionsOrder,
} from "../utils/home-sections";
import {
  addHomeScene,
  filterHomeSceneCandidates,
  homeSceneDomain,
  moveHomeScene,
  normalizeHomeScenes,
  pickableHomeSceneIds,
  removeHomeScene,
  type HomeSceneCandidate,
} from "../utils/home-scenes";
import { getEntityRegistry } from "../utils/entity-registry";
import { dashboardSegmentFromPath } from "../utils/wall-tablet";
import {
  commitPendingWallTabletPrefs,
  discardPendingWallTabletPrefs,
  readPendingWallTabletPrefs,
} from "./dwains-wall-tablet-settings";
import { DD_NEXT_VERSION } from "../version";
import {
  MASTER_ACTION_CONFIRMATION_DOMAINS,
  masterActionConfirmationEnabled,
} from "../utils/master-action-confirmations";
import { showCardEditorDialog } from "./utils/show-card-editor-dialog";

// We'll create our own entity picker since ha-entity-picker is external
type SettingsPageKey =
  | "overview"
  | "dashboard"
  | "home"
  | "header"
  | "controls"
  | "devices"
  | "people"
  | "areas"
  | "favorites"
  | "replacements"
  | "permissions"
  | "support"
  | "wall_tablet";

interface SettingsPageItem {
  page: Exclude<SettingsPageKey, "overview">;
  group: "general" | "content" | "behavior" | "support";
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
  entityIds: string[];
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

interface HomeCameraSetting {
  entityId: string;
  name: string;
  areaId: string;
  areaName: string;
  state: string;
}

const UNGROUPED_ENTITY_DRAG_GROUP = '__ungrouped__';

const SETTINGS_ICON_PATHS: Record<string, string> = {
  "mdi:card-account-details-star-outline": mdiCardAccountDetailsStarOutline,
  "mdi:chevron-right": mdiChevronRight,
  "mdi:floor-plan": mdiFloorPlan,
  "mdi:format-list-bulleted-type": mdiFormatListBulletedType,
  "mdi:gesture-tap-button": mdiGestureTapButton,
  "mdi:heart": mdiHeart,
  "mdi:heart-outline": mdiHeartOutline,
  "mdi:home-edit-outline": mdiHomeEditOutline,
  "mdi:package-variant-closed-check": mdiPackageVariantClosedCheck,
  "mdi:puzzle-edit-outline": mdiPuzzleEditOutline,
  "mdi:shield-account": mdiShieldAccount,
  "mdi:tune-variant": mdiTuneVariant,
  "mdi:view-dashboard-edit": mdiViewDashboardEdit,
};


type SettingsRegistryData = {
  areas: Array<{ area_id: string; name: string; picture: string | null; icon: string | null }>;
  devices: Array<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }>;
  entities: Array<{ entity_id: string; area_id: string | null; device_id: string | null; created_at?: string | null }>;
};

let settingsRegistryCache: SettingsRegistryData | undefined;
let settingsRegistryRefreshPromise: Promise<SettingsRegistryData | undefined> | undefined;

@customElement("dwains-dashboard-next-strategy-editor")
export class DwainsDashboardStrategyEditor extends LitElement {
  @property({ type: Boolean }) public inlineBackNavigation = true;
  private _hass?: HomeAssistant;
  private _fetchDataPromise?: Promise<void>;
  private _registryData?: SettingsRegistryData;
  private _scrollbarGutterTargets = new Map<HTMLElement, string>();

  @property({ attribute: false })
  public set hass(value: HomeAssistant | undefined) {
    const oldValue = this._hass;
    this._hass = value;
    // Use the already available frontend panel metadata immediately so the
    // dashboard summary does not flash a placeholder while WS data loads.
    if (value && !this._dashboardTitle) {
      this._dashboardTitle = this._getDashboardPanelTitle();
    }
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

  private _tp = (key: string, count: number) =>
    ddLocalizePlural(this._hass, key, count);

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
  private _areaPreviewOrder?: string[];

  @state()
  private _expandedDeviceTypes = new Set<string>();

  @state()
  private _draggedHomeSection?: HomeSectionKey;

  @state()
  private _dragOverHomeSectionIndex?: number;

  @state()
  private _homeSectionPreviewOrder?: HomeSectionKey[];

  @state()
  private _draggedHomeCamera?: string;
  private _draggedHomeCustomCard?: string;

  @state()
  private _dragOverHomeCameraIndex?: number;

  @state()
  private _draggedEntityId?: string;

  @state()
  private _draggedEntityGroup?: string;

  @state()
  private _dragOverEntityIndex?: number;

  @state()
  private _draggedEntitySection?: AreaStrategyGroup;

  @state()
  private _dragOverEntitySection?: AreaStrategyGroup;

  @state()
  private _areaGroupPreviewOrder?: AreaStrategyGroup[];

  @state()
  private _collapsedAreaEntityGroups = new Set<AreaStrategyGroup>();

  @state()
  private _areaGroupOrderDirty = false;

  @state()
  private _draggedAreaCustomCardId?: string;

  @state()
  private _dragOverAreaCustomCardTarget?: { placement: string; index: number };

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
  private _showHomeScenePicker = false;

  @state()
  private _homeSceneSearch = '';

  @state()
  private _settingsPage: SettingsPageKey = "overview";

  @state()
  private _homeSettingsDetail: 'overview' | 'house_information' | 'climate' | 'outdoor_climate' | 'cameras' | 'custom_cards' | 'scenes' = 'overview';

  // Dashboard-eigenschappen (naam + sidebar-icoon)
  @state() private _dashboardId?: string;
  @state() private _dashboardTitle = '';
  @state() private _dashboardIcon = '';

  private _getDashboardUrlPath(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    if (!seg || seg === 'lovelace') return undefined;
    return seg;
  }

  private _getDashboardPanelTitle(): string {
    const urlPath = this._getDashboardUrlPath();
    if (!urlPath) return '';
    const panel = (this._hass as any)?.panels?.[urlPath];
    return typeof panel?.title === 'string' ? panel.title : '';
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
      floors_display: config?.floors_display || {},
      areas_options: config?.areas_options || {},
      blueprint_replacements: config?.blueprint_replacements || {},
      device_admission: config?.device_admission || {},
      favorites: config?.favorites || [],
      pages: config?.pages || [],
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
    this._stabilizeSettingsScrollbar();
    queueMicrotask(() => this._emitSettingsPageContext());
    // Always fetch fresh data when component connects
    if (this.hass) {
      void this._fetchData();
    }
  }

  disconnectedCallback() {
    this._restoreSettingsScrollbar();
    super.disconnectedCallback();
  }


  private async _fetchData() {
    if (!this.hass) return;

    if (this._registryData) {
      this._applyRegistryData(this._registryData.areas, this._registryData.devices, this._registryData.entities);
      this._loading = false;
      return;
    }

    if (settingsRegistryCache) {
      this._registryData = settingsRegistryCache;
      this._applyRegistryData(settingsRegistryCache.areas, settingsRegistryCache.devices, settingsRegistryCache.entities);
      this._loading = false;
      this.requestUpdate();

      // Refresh once in the background so reopening Settings is instant without keeping stale data forever.
      if (!settingsRegistryRefreshPromise) {
        settingsRegistryRefreshPromise = this._loadRegistryData(false).finally(() => {
          settingsRegistryRefreshPromise = undefined;
        });
      }
      return;
    }

    if (this._fetchDataPromise) {
      return this._fetchDataPromise;
    }

    this._loading = true;
    this._fetchDataPromise = this._loadRegistryData(true).then(() => undefined);
    try {
      await this._fetchDataPromise;
    } finally {
      this._fetchDataPromise = undefined;
    }
  }

  private async _loadRegistryData(showLoading: boolean): Promise<SettingsRegistryData | undefined> {
    const hass = this.hass;
    if (!hass) return undefined;

    if (showLoading) this._loading = true;

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

      const data: SettingsRegistryData = { areas, devices, entities };
      settingsRegistryCache = data;
      this._registryData = data;
      this._applyRegistryData(areas, devices, entities);
      this._loading = false;
      this.requestUpdate();
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      this._loading = false;
      this.requestUpdate();
      return undefined;
    }
  }

  private _applyRegistryData(
    areas: Array<{ area_id: string; name: string; picture: string | null; icon: string | null }>,
    devices: Array<{ id: string; name: string; name_by_user: string | null; area_id: string | null; created_at?: string | null }>,
    entities: Array<{ entity_id: string; area_id: string | null; device_id: string | null; created_at?: string | null }>
  ): void {
    if (!this.hass) return;

    // Keep Home Assistant's own live registries intact. In particular,
    // hass.entities is the frontend display registry and contains derived fields
    // such as display_precision. Replacing it with config/entity_registry/list
    // entries breaks hass.formatEntityState() until the frontend is reloaded.
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
      <div class="editor-container dd-flat-settings dd-settings-overview settings-loading-shell" aria-busy="true">
        <section class="settings-nav-section">
          <h3>${this._t('settings.loading')}</h3>
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
      { key: "general", title: this._t('settings.general') },
      { key: "content", title: this._t('settings.content_display') },
      { key: "behavior", title: this._t('settings.behavior_access') },
      { key: "support", title: this._t('settings.about_support') },
    ];
    const items = this._settingsOverviewItems();

    return html`
      <div class="editor-container dd-flat-settings dd-settings-overview">
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
        <div class="dd-settings-version-footer">Dwains Dashboard Next · v${DD_NEXT_VERSION}</div>
      </div>
    `;
  }

  private _settingsOverviewItems(): SettingsPageItem[] {
    const areaCount = Object.keys(this.hass?.areas || {}).length;
    const visibleHomeSections = this._getHomeSectionsOrder()
      .filter((section) => !this._getHiddenHomeSections().has(section))
      .length;
    const deviceTypeCount = this._getDeviceTypeOptions().length;
    const hiddenDeviceTypeCount = this._getHiddenDeviceTypes().size;
    const personCount = Object.values(this.hass?.states || {})
      .filter((state: any) => state.entity_id?.startsWith("person."))
      .length;
    const hiddenPersonCount = new Set(this._config?.settings?.hidden_persons || []).size;
    const visiblePersonCount = Math.max(0, personCount - hiddenPersonCount);
    const totalHomeSections = this._getHomeSectionsOrder().length;
    const statusActiveCount = [
      this._config?.settings?.show_time !== false,
      this._config?.settings?.show_notifications !== false,
      this._config?.settings?.show_weather !== false,
      Boolean(this._config?.settings?.alarm_entity_id) && this._config?.settings?.show_alarm !== false,
      visiblePersonCount > 0,
    ].filter(Boolean).length;
    const replacementCount = this._replacementCount();
    const protectedMasterActionCount = MASTER_ACTION_CONFIRMATION_DOMAINS
      .filter((domain) => masterActionConfirmationEnabled(this._config?.settings, domain))
      .length;
    const favoriteCount = (this._config?.favorites || []).length;

    return [
      {
        page: "dashboard",
        group: "general",
        icon: "mdi:view-dashboard-edit",
        color: "#3b82f6",
        title: this._t('settings.dashboard'),
        description: this._t('settings.dashboard_description'),
        summary: this._dashboardTitle || this._getDashboardPanelTitle() || undefined,
      },
      {
        page: "home",
        group: "general",
        icon: "mdi:home-edit-outline",
        color: "#3b82f6",
        title: this._t('settings.home_page'),
        description: this._t('settings.home_page_description'),
        summary: this._t('settings.visible_count', { visible: visibleHomeSections, total: totalHomeSections }),
      },
      {
        page: "areas",
        group: "general",
        icon: "mdi:floor-plan",
        color: "#3b82f6",
        title: this._t('settings.areas'),
        description: this._t('settings.areas_description'),
        summary: this._tp('common.area', areaCount),
      },
      {
        page: "devices",
        group: "general",
        icon: "mdi:format-list-bulleted-type",
        color: "#3b82f6",
        title: this._t('settings.devices_page'),
        description: this._t('settings.devices_page_description'),
        summary: this._t('settings.types_visible', { visible: deviceTypeCount - hiddenDeviceTypeCount, total: deviceTypeCount }),
      },
      {
        page: "header",
        group: "content",
        icon: "mdi:information-outline",
        color: "#8b5cf6",
        title: this._t('settings.header_status'),
        description: this._t('settings.header_status_description'),
        summary: this._tp('common.active', statusActiveCount),
      },
      {
        page: "favorites",
        group: "content",
        icon: "mdi:star-outline",
        color: "#8b5cf6",
        title: this._t('favorites.title'),
        description: this._t('settings.favorites_global_description'),
        summary: this._tp('common.favorite', favoriteCount),
      },
      {
        page: "replacements",
        group: "content",
        icon: "mdi:puzzle-edit-outline",
        color: "#8b5cf6",
        title: this._t('settings.blueprint_replacements'),
        description: this._t('settings.blueprint_replacements_description'),
        summary: this._tp('common.active', replacementCount),
      },
      {
        page: "controls",
        group: "behavior",
        icon: "mdi:gesture-tap-button",
        color: "#0f9f8f",
        title: this._t('settings.controls_confirmations'),
        description: this._t('settings.controls_confirmations_description'),
        summary: this._t('settings.controls_confirmations_summary', { count: protectedMasterActionCount }),
      },
      {
        page: "permissions",
        group: "behavior",
        icon: "mdi:shield-account",
        color: "#0f9f8f",
        title: this._t('settings.user_permissions'),
        description: this._t('settings.user_permissions_description'),
        summary: this._config?.settings?.restrict_non_admin_ha_sidebar || this._config?.settings?.restrict_non_admin_dashboard_settings
          ? this._t('settings.restrictions_enabled')
          : this._t('settings.default_access'),
      },
      {
        page: "wall_tablet",
        group: "behavior",
        icon: "mdi:tablet-dashboard",
        color: "#0f9f8f",
        title: this._t('kiosk.title'),
        description: this._t('kiosk.description'),
        summary: readPendingWallTabletPrefs(dashboardSegmentFromPath(window.location.pathname)).enabled
          ? this._t('kiosk.summary_on')
          : this._t('kiosk.summary_off'),
      },
      {
        page: "support",
        group: "support",
        icon: "mdi:heart",
        color: "var(--primary-color)",
        title: this._t('settings.support'),
        description: this._t('settings.support_description'),
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
        <div class="settings-nav-icon ${item.group === 'support' ? 'support-gradient' : ''}">
          ${item.group === 'support'
            ? html`
                <svg class="settings-nav-gradient-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <linearGradient id="dd-support-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: var(--primary-color)"></stop>
                      <stop offset="50%" style="stop-color: color-mix(in srgb, var(--primary-color) 45%, var(--accent-color, #e8a400))"></stop>
                      <stop offset="100%" style="stop-color: var(--accent-color, #e8a400)"></stop>
                    </linearGradient>
                  </defs>
                  <path d=${SETTINGS_ICON_PATHS[item.icon] || mdiHeart} fill="url(#dd-support-icon-gradient)"></path>
                </svg>
              `
            : this._renderSettingsIcon(item.icon)}
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
    if (page === "devices") this._expandedDeviceTypes = new Set();
    this._closeInlinePickers();
    this._emitSettingsPageContext();
    this._resetSettingsScrollPosition();
  }

  public _restoreSettingsNavigation(page: string, areaId?: string): void {
    const validPages: SettingsPageKey[] = [
      "overview", "dashboard", "home", "header", "controls", "devices",
      "people", "areas", "favorites", "replacements", "permissions", "wall_tablet", "support"
    ];
    const nextPage = validPages.includes(page as SettingsPageKey)
      ? page as SettingsPageKey
      : "overview";

    this._settingsPage = nextPage;
    this._area = nextPage === "areas" && areaId && this.hass?.areas?.[areaId]
      ? areaId
      : undefined;
    this._areaGroupOrderDirty = false;
    if (this._area) this._collapsedAreaEntityGroups = new Set(AREA_STRATEGY_GROUPS);
    this._closeInlinePickers();
    this._emitSettingsPageContext();
  }

  public _commitDeviceSettings(): void {
    commitPendingWallTabletPrefs(dashboardSegmentFromPath(window.location.pathname));
  }

  public _discardDeviceSettings(): void {
    discardPendingWallTabletPrefs(dashboardSegmentFromPath(window.location.pathname));
  }

  public _backToSettingsOverview = (): void => {
    if (this._area) {
      this._area = undefined;
      this._areaGroupOrderDirty = false;
      this._emitSettingsPageContext();
      this._resetSettingsScrollPosition();
      return;
    }
    this._settingsPage = "overview";
    this._expandedDeviceTypes = new Set();
    this._closeInlinePickers();
    this._emitSettingsPageContext();
    this._resetSettingsScrollPosition();
  };

  private _emitSettingsPageContext(): void {
    const overview = this._settingsPage === "overview";
    const areaName = this._area ? this.hass?.areas?.[this._area]?.name : undefined;
    const pageTitle = overview
      ? this._t('sidebar.dashboard_settings')
      : areaName
        ? areaName
        : this._settingsPageTitle(this._settingsPage);
    const pageDescription = overview
      ? this._t('settings.subtitle')
      : areaName
        ? this._t('settings.area_detail_header_description')
        : this._settingsPageDescription(this._settingsPage);
    this.dispatchEvent(new CustomEvent("dd-settings-page-changed", {
      detail: {
        page: this._settingsPage,
        areaId: this._area,
        title: pageTitle,
        parentTitle: areaName ? this._settingsPageTitle("areas") : undefined,
        description: pageDescription,
      },
      bubbles: true,
      composed: true,
    }));
  }

  private _closeInlinePickers(): void {
    this._showEntityPicker = false;
    this._showWeatherPicker = false;
    this._showAlarmPicker = false;
  }

  private _stabilizeSettingsScrollbar(): void {
    const visited = new Set<Node>();
    let node: Node | null = this;

    while (node && !visited.has(node)) {
      visited.add(node);

      if (node instanceof HTMLElement && !this._scrollbarGutterTargets.has(node)) {
        this._scrollbarGutterTargets.set(node, node.style.scrollbarGutter);
        node.style.scrollbarGutter = "stable";
      }

      if (node.parentNode) {
        node = node.parentNode;
        continue;
      }

      const root = node.getRootNode();
      node = root instanceof ShadowRoot ? root.host : null;
    }

    for (const target of [document.documentElement, document.body]) {
      if (target && !this._scrollbarGutterTargets.has(target)) {
        this._scrollbarGutterTargets.set(target, target.style.scrollbarGutter);
        target.style.scrollbarGutter = "stable";
      }
    }
  }

  private _restoreSettingsScrollbar(): void {
    for (const [target, previousValue] of this._scrollbarGutterTargets) {
      target.style.scrollbarGutter = previousValue;
    }
    this._scrollbarGutterTargets.clear();
  }

  private _resetSettingsScrollPosition(): void {
    void this.updateComplete.then(() => {
      window.requestAnimationFrame(() => {
        const visited = new Set<Node>();
        let node: Node | null = this;

        while (node && !visited.has(node)) {
          visited.add(node);

          if (node instanceof HTMLElement) {
            node.scrollTop = 0;
          }

          if (node.parentNode) {
            node = node.parentNode;
            continue;
          }

          const root = node.getRootNode();
          node = root instanceof ShadowRoot ? root.host : null;
        }

        document.scrollingElement?.scrollTo({ top: 0, behavior: "auto" });
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    });
  }

  public _settingsPageDescription(page: SettingsPageKey): string {
    switch (page) {
      case "dashboard":
        return this._t('settings.dashboard_page_description');
      case "home":
        return this._t('settings.home_layout_description');
      case "header":
        return this._t('settings.header_page_description');
      case "controls":
        return this._t('settings.controls_page_description');
      case "devices":
        return this._t('settings.devices_description');
      case "people":
        return this._t('settings.people_page_description');
      case "areas":
        return this._t('settings.areas_page_description');
      case "favorites":
        return this._t('settings.favorites_global_description');
      case "replacements":
        return this._t('settings.replace_description');
      case "permissions":
        return this._t('settings.permissions_description');
      case "support":
        return this._t('settings.support_page_description');
      default:
        return "";
    }
  }

  private _renderSettingsDetailPage(page: SettingsPageKey) {
    const item = this._settingsOverviewItems().find((candidate) => candidate.page === page);
    if (!item) return this._renderSettingsOverview();

    return html`
      <div class="editor-container dd-flat-settings">
        ${this.inlineBackNavigation ? html`<div class="dd-native-editor-subpage-back">
          <button type="button" class="dd-native-back-button"
            @click=${this._backToSettingsOverview}
            title=${this._t('common.back')}
            aria-label=${this._t('common.back')}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
        </div>` : nothing}
        <div class="settings-detail-content dd-flat-content">
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
        return this._renderHomeLayoutSettingsPanel();
      case "header":
        return this._renderHeaderStatusSettingsPanel();
      case "controls":
        return this._renderMasterActionConfirmationSettingsPanel();
      case "devices":
        return this._renderEntityDisplaySettingsPanel();
      case "people":
        return this._renderPersonsSettingsPanel();
      case "areas":
        return this._renderAreasSettingsPanel();
      case "favorites":
        return this._renderFavoritesSettingsPanel();
      case "replacements":
        return this._renderReplacementsSettingsPanel();
      case "permissions":
        return this._renderPermissionsSettingsPanel();
      case "support":
        return this._renderSupportSection();
      case "wall_tablet":
        return this._renderSettingsPanel(
          "mdi:tablet-dashboard",
          this._t('kiosk.title'),
          this._t('kiosk.panel_description'),
          html`<dwains-dashboard-next-wall-tablet-settings .hass=${this.hass}></dwains-dashboard-next-wall-tablet-settings>`
        );
      default:
        return nothing;
    }
  }

  private _settingsPageTitle(page: SettingsPageKey): string {
    switch (page) {
      case "dashboard": return this._t('settings.dashboard');
      case "home": return this._t('settings.home_page');
      case "header": return this._t('settings.header_status');
      case "controls": return this._t('settings.controls_confirmations');
      case "devices": return this._t('settings.devices_page');
      case "people": return this._t('settings.people');
      case "areas": return this._t('settings.areas');
      case "favorites": return this._t('favorites.title');
      case "replacements": return this._t('settings.blueprint_replacements');
      case "permissions": return this._t('settings.user_permissions');
      case "support": return this._t('settings.support');
      case "wall_tablet": return this._t('kiosk.title');
      default: return "";
    }
  }

  private _renderSettingsPanel(icon: string, title: string, description: string, content: unknown) {
    const isPageRoot = this._settingsPageTitle(this._settingsPage) === title;

    return html`
      <section class="dd-settings-section ${isPageRoot ? 'page-root' : ''}">
        ${!isPageRoot ? html`
          <div class="dd-settings-section-header">
            <span class="dd-settings-section-icon"><ha-icon icon=${icon}></ha-icon></span>
            <span class="dd-settings-section-copy">
              <strong>${title}</strong>
              ${description ? html`<small>${description}</small>` : nothing}
            </span>
          </div>
        ` : nothing}
        <div class="dd-settings-section-content">${content}</div>
      </section>
    `;
  }

  private _renderToggleSetting(
    icon: string,
    title: string,
    description: string,
    checked: boolean,
    onChange: (event: Event) => void
  ) {
    return html`
      <div class="dd-setting-row">
        <span class="dd-setting-row-icon"><ha-icon icon=${icon}></ha-icon></span>
        <span class="dd-setting-row-copy">
          <strong>${title}</strong>
          ${description ? html`<small>${description}</small>` : nothing}
        </span>
        <ha-switch .checked=${checked} @change=${onChange}></ha-switch>
      </div>
    `;
  }

  private _renderLinkedToggleSetting(
    icon: string,
    title: string,
    description: string,
    checked: boolean,
    onChange: (event: Event) => void
  ) {
    return html`
      <div class="dd-setting-row dd-setting-row-with-link">
        <span class="dd-setting-row-icon"><ha-icon icon=${icon}></ha-icon></span>
        <span class="dd-setting-row-copy">
          <strong>${title}</strong>
          <small>
            ${description}
            <button
              class="dd-settings-inline-link"
              type="button"
              @click=${(event: Event) => {
                event.stopPropagation();
                this._openSettingsPage('favorites');
              }}
            >${this._t('settings.manage_favorites')}</button>
          </small>
        </span>
        <ha-switch .checked=${checked} @change=${onChange}></ha-switch>
      </div>
    `;
  }

  private _renderMasterActionConfirmationSettingsPanel() {
    return html`
      <div class="master-confirmation-section dd-simple-settings-stack">
        <div class="master-confirmation-list">
          ${MASTER_ACTION_CONFIRMATION_DOMAINS.map((domain) => {
            const enabled = masterActionConfirmationEnabled(this._config?.settings, domain);
            return html`
              <label class="master-confirmation-row">
                <span class="master-confirmation-icon">
                  <ha-icon icon=${getDomainIcon(domain)}></ha-icon>
                </span>
                <span class="master-confirmation-copy">
                  <strong>${getDomainName(this.hass, domain)}</strong>
                </span>
                <span class="master-confirmation-control">
                  <span>${this._t(enabled ? 'settings.confirmation_required' : 'settings.runs_immediately')}</span>
                  <ha-switch
                    .checked=${enabled}
                    @change=${(event: Event) => this._toggleMasterActionConfirmation(domain, event)}
                  ></ha-switch>
                </span>
              </label>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderSupportSection() {
    return html`
      <div class="sponsoring-section dd-support-flat">
        <div class="sponsor-label">${this._t('support.donation')}</div>
        <div class="sponsor-chips">
          <a class="sponsor-chip" href="https://github.com/sponsors/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:github"></ha-icon><span>${this._t('support.github')}</span>
          </a>
          <a class="sponsor-chip" href="https://www.paypal.me/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:cash"></ha-icon><span>PayPal</span>
          </a>
          <a class="sponsor-chip" href="https://www.buymeacoffee.com/FAkYvrx" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:coffee"></ha-icon><span>${this._t('support.buy_coffee')}</span>
          </a>
        </div>

        <div class="sponsor-divider"></div>

        <div class="sponsor-label">${this._t('support.shop_prompt')}</div>
        <a class="sponsor-chip primary" href="https://smarthomeshop.io/en" target="_blank" rel="noopener noreferrer">
          <ha-icon icon="mdi:shopping"></ha-icon><span>${this._t('support.visit_shop')}</span>
        </a>
      </div>
    `;
  }

  private _renderDashboardSettingsPanel() {
    if (!this._dashboardId) {
      return this._renderSettingsPanel(
        "mdi:view-dashboard",
        this._t('settings.dashboard'),
        this._t('settings.default_dashboard_locked'),
        html`
          <div class="empty-settings-card">
            <strong>${this._t('settings.default_dashboard_locked')}</strong>
            <span>${this._t('settings.open_instance')}</span>
          </div>
        `
      );
    }

    return this._renderSettingsPanel(
      "mdi:view-dashboard",
      this._t('settings.dashboard'),
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

  private _homeSectionDetail(section: HomeSectionKey): typeof this._homeSettingsDetail | undefined {
    if (section === 'devices') return 'house_information';
    if (section === 'cameras') return 'cameras';
    if (section === 'custom_cards') return 'custom_cards';
    if (section === 'scenes') return 'scenes';
    return undefined;
  }

  private _renderHomeLayoutSettingsPanel() {
    this._homeSettingsDetail ||= "overview";
    return html`
      <section class="dd-home-layout-panel">
        ${this._renderHomeSectionOrder()}
      </section>
    `;
  }

  private _replacementEntries(): Array<{ target: string; assignment: any }> {
    const replacements = this._config?.blueprint_replacements;
    if (!replacements) return [];
    const targets = new Set<string>();
    for (const surface of ['area_cards', 'devices_cards'] as const) {
      Object.keys(replacements[surface]?.by_domain || {}).forEach((target) => targets.add(target));
    }
    return [...targets]
      .sort((a, b) => getDomainName(this.hass, a).localeCompare(getDomainName(this.hass, b)))
      .map((target) => ({
        target,
        assignment:
          replacements.area_cards?.by_domain?.[target] ||
          replacements.devices_cards?.by_domain?.[target],
      }))
      .filter((entry) => Boolean(entry.assignment));
  }

  private _setReplacementEnabled(target: string, enabled: boolean): void {
    if (!this._config) return;
    const replacements = structuredClone(this._config.blueprint_replacements || {});
    for (const surface of ['area_cards', 'devices_cards'] as const) {
      const assignment = replacements[surface]?.by_domain?.[target];
      if (assignment) assignment.enabled = enabled;
    }
    this._fireConfigChanged({ ...this._config, blueprint_replacements: replacements });
  }

  private _removeReplacement(target: string): void {
    if (!this._config) return;
    const replacements = structuredClone(this._config.blueprint_replacements || {});
    for (const surface of ['area_cards', 'devices_cards'] as const) {
      if (replacements[surface]?.by_domain) delete replacements[surface]!.by_domain![target];
    }
    this._fireConfigChanged({ ...this._config, blueprint_replacements: replacements });
  }

  private _renderReplacementsSettingsPanel() {
    const entries = this._replacementEntries();

    return this._renderSettingsPanel(
      "mdi:puzzle-edit-outline",
      this._t('settings.blueprint_replacements'),
      this._t('settings.replace_description'),
      html`
        <div class="replacement-section dd-replacement-settings">
          ${entries.length ? html`
            <div class="dd-replacement-list">
              ${entries.map(({ target, assignment }) => {
                const enabled = assignment.enabled !== false;
                return html`
                  <div class="dd-replacement-row ${enabled ? '' : 'disabled'}">
                    <span class="dd-replacement-domain-icon">
                      <ha-icon icon=${getDomainIcon(target)}></ha-icon>
                    </span>
                    <span class="dd-replacement-copy">
                      <strong>${getDomainName(this.hass, target)}</strong>
                      <small>${assignment.name}${assignment.version ? ` · v${assignment.version}` : ''}</small>
                    </span>
                    <span class="dd-replacement-actions">
                      <label class="dd-replacement-enabled" title=${enabled ? this._t('common.disable') : this._t('common.enable')}>
                        <ha-switch
                          .checked=${enabled}
                          @change=${() => this._setReplacementEnabled(target, !enabled)}
                        ></ha-switch>
                      </label>
                      <button
                        class="dd-icon-text-button danger"
                        type="button"
                        title=${this._t('common.delete')}
                        aria-label=${this._t('common.delete')}
                        @click=${() => this._removeReplacement(target)}
                      ><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                    </span>
                  </div>
                `;
              })}
            </div>
          ` : html`<div class="dd-replacement-empty">${this._t('replacement.empty')}</div>`}

          <div class="dd-replacement-footer">
            <ha-button appearance="accent" @click=${this._openReplacementManager}>
              <ha-icon icon="mdi:plus"></ha-icon>
              ${this._t('replacement.assign')}
            </ha-button>
          </div>
        </div>
      `
    );
  }

  private _renderFavoritesSettingsPanel() {
    const suggestedEnabled = this._config?.settings?.show_suggested_favorites !== false;

    return this._renderSettingsPanel(
      "mdi:star-outline",
      this._t('favorites.title'),
      this._t('settings.favorites_global_description'),
      html`
        <div class="favorites-section dd-favorites-inline">
          <div class="dd-favorites-options-card">
            ${this._renderToggleSetting(
              "mdi:star-plus-outline",
              this._t('settings.show_suggested_favorites'),
              this._t('settings.suggested_favorites_description'),
              suggestedEnabled,
              this._toggleSuggestedFavorites
            )}
          </div>

          <div class="entity-picker dd-favorites-picker dd-favorites-list-card">
            <div class="dd-inline-action-row dd-favorites-list-head">
              <strong>${this._t('settings.manual_favorites')} ${this._t('favorites.title')}</strong>
              <button class="home-custom-card-add dd-favorites-add" type="button" @click=${this._addFavoriteEntity}>
                <ha-icon icon="mdi:plus"></ha-icon>
                ${this._t('common.add')}
              </button>
            </div>
            ${this._renderSelectedEntities()}
            ${this._showEntityPicker ? this._renderEntityPicker() : nothing}
          </div>
        </div>
      `
    );
  }

  private _renderHeaderStatusSettingsPanel() {
    const weatherEnabled = this._config?.settings?.show_weather !== false;
    const weatherId = this._config?.settings?.weather_entity_id;
    const weatherState = weatherId ? this.hass?.states?.[weatherId] : undefined;
    const weatherName = weatherId
      ? (weatherState?.attributes?.friendly_name || weatherId)
      : this._t('settings.no_weather_fallback');

    const alarmId = this._config?.settings?.alarm_entity_id;
    const alarmEnabled = Boolean(alarmId) && this._config?.settings?.show_alarm !== false;
    const alarmState = alarmId ? this.hass?.states?.[alarmId] : undefined;
    const alarmName = alarmId
      ? (alarmState?.attributes?.friendly_name || alarmId)
      : this._t('settings.no_alarm_short');

    return html`
      <div class="dd-header-status-settings">
        <div class="dd-header-status-list">
          ${this._renderToggleSetting(
            "mdi:clock-outline",
            this._t('settings.time_date'),
            "",
            this._config?.settings?.show_time !== false,
            this._toggleTimeDisplay
          )}
          ${this._renderToggleSetting(
            "mdi:bell-outline",
            this._t('home.notifications'),
            "",
            this._config?.settings?.show_notifications !== false,
            this._toggleNotificationsDisplay
          )}

          <div class="dd-header-feature">
            <div class="dd-header-feature-row">
              <span class="dd-setting-row-icon"><ha-icon icon="mdi:weather-cloudy"></ha-icon></span>
              <span class="dd-setting-row-copy">
                <strong>${this._t('domain.weather')}</strong>
                <small>${weatherName}</small>
              </span>
              <span class="dd-header-feature-actions">
                <button class="dd-inline-text-button" type="button" @click=${this._addWeatherEntity}>
                  ${this._t('common.select')}
                </button>
                <ha-switch .checked=${weatherEnabled} @change=${this._toggleWeatherDisplay}></ha-switch>
              </span>
            </div>
            ${this._showWeatherPicker ? this._renderWeatherPicker() : nothing}
          </div>

          <div class="dd-header-feature">
            <div class="dd-header-feature-row">
              <span class="dd-setting-row-icon"><ha-icon icon="mdi:shield-home-outline"></ha-icon></span>
              <span class="dd-setting-row-copy">
                <strong>${this._t('domain.alarm_control_panel')}</strong>
                <small>${alarmName}</small>
              </span>
              <span class="dd-header-feature-actions">
                <button class="dd-inline-text-button" type="button" @click=${this._addAlarmEntity}>
                  ${this._t('common.select')}
                </button>
                <ha-switch
                  .checked=${alarmEnabled}
                  .disabled=${!alarmId}
                  @change=${this._toggleAlarmDisplay}
                ></ha-switch>
              </span>
            </div>
            ${this._showAlarmPicker ? this._renderAlarmPicker() : nothing}
          </div>
        </div>

        <div class="dd-status-people-card">
          <div class="dd-header-feature-row dd-status-people-heading">
            <span class="dd-setting-row-icon"><ha-icon icon="mdi:account-group-outline"></ha-icon></span>
            <span class="dd-setting-row-copy">
              <strong>${this._t('settings.people')}</strong>
              <small>${this._t('settings.people_page_description')}</small>
            </span>
          </div>
          <div class="dd-status-people-list">
            ${this._renderPersonsConfiguration()}
          </div>
        </div>
      </div>
    `;
  }

  private _renderEntityDisplaySettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:eye-off",
      this._t('settings.devices_page'),
      this._t('settings.devices_description'),
      html`
        <div class="entity-display-section">
          <div class="dd-settings-list dd-settings-list-spaced">
            ${this._renderToggleSetting(
              "mdi:eye-off-outline",
              this._t('settings.hide_unavailable_devices'),
              this._t('settings.hide_unavailable_devices_description'),
              this._config?.settings?.hide_unavailable_entities_on_devices !== false,
              this._toggleHideUnavailableEntities
            )}
            ${this._renderToggleSetting(
              "mdi:history",
              this._t('settings.show_new_devices'),
              this._t('settings.show_new_devices_description'),
              this._config?.settings?.show_recent_devices_panel !== false,
              this._toggleRecentDevicesPanel
            )}
          </div>
          ${this._renderDeviceVisibilitySettings()}
        </div>
      `
    );
  }

  private _renderPermissionsSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:shield-account",
      this._t('settings.user_permissions'),
      this._t('settings.permissions_description'),
      html`
        <div class="entity-display-section">
          <div class="dd-settings-list">
            ${this._renderToggleSetting(
              "mdi:menu",
              this._t('settings.restrict_ha_menu_short'),
              this._t('settings.restrict_ha_menu_description'),
              this._config?.settings?.restrict_non_admin_ha_sidebar === true,
              this._toggleRestrictNonAdminHaSidebar
            )}
            ${this._renderToggleSetting(
              "mdi:pencil-off-outline",
              this._t('settings.restrict_editing_short'),
              this._t('settings.restrict_editing_description'),
              this._config?.settings?.restrict_non_admin_dashboard_settings === true,
              this._toggleRestrictNonAdminDashboardSettings
            )}
          </div>
        </div>
      `
    );
  }

  private _renderPersonsSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:account-multiple",
      this._t('settings.people'),
      this._t('settings.people_page_description'),
      html`
        <div class="persons-section">
          ${this._renderPersonsConfiguration()}
        </div>
      `
    );
  }

  private _renderAreasSettingsPanel() {
    const areaNowPlayingEnabled = this._config?.settings?.show_area_now_playing ??
      (normalizeNowPlayingMode(this._config?.settings?.now_playing_bar) === 'all');

    return this._renderSettingsPanel(
      "mdi:floor-plan",
      this._t('settings.areas'),
      this._t('settings.areas_page_description'),
      html`
        <div class="entity-display-section">
          <div class="dd-settings-list dd-settings-list-spaced">
            ${this._renderToggleSetting(
              "mdi:form-textbox",
              this._t('settings.hide_area_name_in_entity_names'),
              this._t('settings.hide_area_name_in_entity_names_description'),
              this._config?.settings?.hide_area_name_in_entity_names === true,
              this._toggleHideAreaNameInEntityNames
            )}
            ${this._renderToggleSetting(
              "mdi:eye-off-outline",
              this._t('settings.hide_unavailable_areas'),
              this._t('settings.hide_unavailable_areas_description'),
              this._config?.settings?.hide_unavailable_entities !== false,
              this._toggleHideUnavailableAreaEntities
            )}
            ${this._renderLinkedToggleSetting(
              "mdi:star-outline",
              this._t('settings.show_area_favorites'),
              this._t('settings.show_area_favorites_description'),
              this._config?.settings?.show_area_favorites !== false,
              this._toggleAreaFavorites
            )}
            ${this._renderToggleSetting(
              "mdi:music-circle-outline",
              this._t('settings.show_area_now_playing'),
              this._t('settings.show_area_now_playing_description'),
              areaNowPlayingEnabled,
              this._toggleAreaNowPlaying
            )}
            ${this._renderToggleSetting(
              "mdi:thermostat",
              this._t('thermostat.setting_label'),
              this._t('thermostat.setting_description'),
              this._config?.settings?.show_area_thermostat !== false,
              this._toggleAreaThermostat
            )}
          </div>
          ${this._renderAreasConfiguration()}
        </div>
      `
    );
  }

  private _toggleAreaFavorites = (event: Event): void => {
    if (!this._config) return;
    const target = event.target as any;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        show_area_favorites: Boolean(target.checked),
      },
    });
  };

  private _toggleAreaNowPlaying = (event: Event): void => {
    if (!this._config) return;
    const target = event.target as any;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        show_area_now_playing: Boolean(target.checked),
      },
    });
  };

  private _toggleAreaThermostat = (event: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, show_area_thermostat: (event.target as any).checked },
    });
  };

  private _renderAreasConfiguration() {
    if (!this.hass || !this._config) return nothing;

    const areas = Object.values(this.hass.areas || {});
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const sortMode = resolveAreaSortMode(this._config.areas_display);
    const baseSortedAreas = sortAreas(
      areas,
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    );
    const previewIndex = new Map((this._areaPreviewOrder || []).map((id, index) => [id, index]));
    const sortedAreas = sortMode === 'custom' && this._areaPreviewOrder
      ? [...baseSortedAreas].sort((a, b) =>
          (previewIndex.get(a.area_id) ?? Number.MAX_SAFE_INTEGER) -
          (previewIndex.get(b.area_id) ?? Number.MAX_SAFE_INTEGER)
        )
      : baseSortedAreas;
    const sortModes: Array<{ mode: AreaSortMode; icon: string }> = [
      { mode: 'home_assistant', icon: 'mdi:home-assistant' },
      { mode: 'alphabetical', icon: 'mdi:sort-alphabetical-ascending' },
      { mode: 'custom', icon: 'mdi:drag-vertical' },
    ];

    return html`
      <section class="area-order-settings" aria-labelledby="area-order-title">
        <div class="area-order-heading">
          <strong id="area-order-title">${this._t('settings.area_order_title')}</strong>
        </div>
        <div class="area-sort-segmented" role="radiogroup" aria-label=${this._t('settings.area_order_title')}>
          ${sortModes.map(({ mode, icon }) => html`
            <button
              type="button"
              class="area-sort-segment ${sortMode === mode ? 'selected' : ''}"
              role="radio"
              aria-checked=${sortMode === mode ? 'true' : 'false'}
              @click=${() => this._setAreaSortMode(mode)}
            >
              <ha-icon .icon=${icon}></ha-icon>
              <span>${this._t(`settings.area_order_${mode}`)}</span>
            </button>
          `)}
        </div>

        ${sortMode === 'custom' ? html`
          <p class="area-order-list-hint">${this._t('settings.area_order_drag_hint')}</p>
        ` : nothing}

        <div class="sortable-container area-settings-sortable ${sortMode === 'custom' ? 'is-custom-order' : ''} ${this._draggedAreaId ? 'dragging' : ''}">
        ${repeat(
          sortedAreas,
          (area) => area.area_id,
          (area, index) => {
            const isHidden = hiddenAreas.has(area.area_id);
            const isDragging = this._draggedAreaId === area.area_id;
            const isDragOver = this._dragOverIndex === index && this._draggedAreaId && this._draggedAreaId !== area.area_id;

            return html`
              <div
                class="sortable-item dd-area-sortable-row ${isHidden ? "hidden" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}"
                data-area-id="${area.area_id}"
                data-index="${index}"
                .draggable=${sortMode === 'custom'}
                @dragstart=${(event: DragEvent) => sortMode === 'custom' && this._handleAreaDragStart(event, area.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${(event: DragEvent) => sortMode === 'custom' && this._handleAreaDragOver(event, index)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${(event: DragEvent) => sortMode === 'custom' && this._handleAreaDrop(event, index)}
              >
                <div class="area-item">
                  ${sortMode === 'custom' ? html`
                    <div class="handle" aria-hidden="true">
                      <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                    </div>
                  ` : nothing}
                  <ha-icon .icon=${area.icon || 'mdi:floor-plan'} class="area-icon"></ha-icon>
                  <span class="area-name clickable" @click=${() => this._editArea(area.area_id)}>
                    ${area.name}
                    <ha-icon icon="mdi:chevron-right" class="chevron"></ha-icon>
                  </span>
                  <div class="area-actions">
                    <button
                      class="dd-visibility-button ${isHidden ? 'hidden' : ''}"
                      type="button"
                      title=${this._t(isHidden ? 'common.show' : 'common.hide')}
                      aria-label=${this._t(isHidden ? 'common.show' : 'common.hide')}
                      @click=${(event: Event) => {
                        event.stopPropagation();
                        this._toggleAreaVisibility(area.area_id);
                      }}
                    >
                      <ha-icon icon=${isHidden ? 'mdi:eye' : 'mdi:eye-off'}></ha-icon>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }
        )}
        </div>
        <button
          class="home-layout-reset area-list-reset"
          type="button"
          ?disabled=${hiddenAreas.size === 0 && sortMode === 'alphabetical'}
          @click=${this._resetAreasConfiguration}
        >
          ${this._t('settings.reset_layout')}
        </button>
      </section>
    `;
  }

  private _areaEntityDisplayName(entityId: string): string {
    const rawName = this.hass?.states?.[entityId]?.attributes?.friendly_name
      || (this.hass?.entities?.[entityId] as any)?.name
      || entityId;

    if (this._config?.settings?.hide_area_name_in_entity_names !== true || !this._area) {
      return rawName;
    }

    const areaName = this.hass?.areas?.[this._area]?.name
      || this._config?.areas?.find(area => area.area_id === this._area)?.name;

    return stripAreaNameFromEntityName(rawName, areaName);
  }

  private _getAreaEditorCustomCards(): AreaCustomCard[] {
    if (!this._config || !this._area) return [];
    const cards = this._config.areas_options?.[this._area]?.custom_cards;
    return Array.isArray(cards)
      ? cards.filter((entry) => entry?.id && entry?.card && typeof entry.card === 'object')
      : [];
  }

  private _areaCustomCardTitle(entry: AreaCustomCard): string {
    const card = entry.card as any;
    const entityId = typeof card?.entity === 'string' ? card.entity : '';
    const entityName = entityId
      ? this.hass?.states?.[entityId]?.attributes?.friendly_name
      : undefined;
    const type = String(card?.type || 'card').replace(/^custom:/, '').replace(/-/g, ' ');
    return String(card?.title || card?.name || entityName || type);
  }

  private _areaCustomCardSubtitle(entry: AreaCustomCard): string {
    const type = String((entry.card as any)?.type || 'card').replace(/^custom:/, '');
    return type;
  }

  private _areaCustomCardPlacementIndex(cards: AreaCustomCard[], entry: AreaCustomCard): number {
    const cardIndex = cards.findIndex((candidate) => candidate.id === entry.id);
    if (cardIndex < 0) return 0;
    return cards.slice(0, cardIndex).filter((candidate) => candidate.placement === entry.placement).length;
  }

  private _domainCustomCardPlacementIndex(placement: string, group: string): number | undefined {
    const prefix = `domain:${group}:`;
    if (!placement.startsWith(prefix)) return undefined;
    const index = Number(placement.slice(prefix.length));
    return Number.isFinite(index) && index >= 0 ? index : undefined;
  }

  private _getAreaEditorDomainCardsForSlot(
    cards: AreaCustomCard[],
    group: AreaStrategyGroup,
    slotIndex: number,
    entityCount: number
  ): AreaCustomCard[] {
    const placement = `domain:${group}:${slotIndex}`;
    return cards.filter((entry) => {
      if (entry.placement === placement) return true;
      const domainIndex = this._domainCustomCardPlacementIndex(entry.placement, group);
      if (slotIndex === entityCount && domainIndex !== undefined && domainIndex > entityCount) return true;
      return slotIndex === entityCount && entry.placement === `after:${group}`;
    });
  }

  private _areaEditorFreeSlotForCard(
    entry: AreaCustomCard,
    entities: string[],
    entityGroupById: Map<string, AreaStrategyGroup>
  ): number | undefined {
    const freeMatch = /^ungrouped:(\d+)$/.exec(entry.placement);
    if (freeMatch) return Math.min(entities.length, Number(freeMatch[1]));

    const domainMatch = /^domain:([^:]+):(\d+)$/.exec(entry.placement);
    const afterMatch = /^after:(.+)$/.exec(entry.placement);
    const group = (domainMatch?.[1] || afterMatch?.[1]) as AreaStrategyGroup | undefined;
    if (!group || !AREA_STRATEGY_GROUPS.includes(group)) return undefined;

    const groupEntityIndexes = entities
      .map((entityId, index) => entityGroupById.get(entityId) === group ? index : -1)
      .filter((index) => index >= 0);
    if (!groupEntityIndexes.length) return entities.length;
    if (afterMatch) return Math.min(entities.length, groupEntityIndexes[groupEntityIndexes.length - 1]! + 1);

    const domainIndex = Number(domainMatch?.[2] || 0);
    if (domainIndex <= 0) return groupEntityIndexes[0];
    if (domainIndex >= groupEntityIndexes.length) {
      return Math.min(entities.length, groupEntityIndexes[groupEntityIndexes.length - 1]! + 1);
    }
    return groupEntityIndexes[domainIndex];
  }

  private _getAreaEditorFreeCardsForSlot(
    cards: AreaCustomCard[],
    slotIndex: number,
    entities: string[],
    entityGroupById: Map<string, AreaStrategyGroup>
  ): AreaCustomCard[] {
    return cards.filter((entry) =>
      entry.placement !== 'top' &&
      entry.placement !== 'bottom' &&
      this._areaEditorFreeSlotForCard(entry, entities, entityGroupById) === slotIndex
    );
  }

  private _renderAreaCustomCardEditorRow(entry: AreaCustomCard) {
    const cards = this._getAreaEditorCustomCards();
    const placementIndex = this._areaCustomCardPlacementIndex(cards, entry);
    const isDragging = this._draggedAreaCustomCardId === entry.id;
    const isDragOver = this._dragOverAreaCustomCardTarget?.placement === entry.placement &&
      this._dragOverAreaCustomCardTarget.index === placementIndex;

    return html`
      <div
        class="sortable-item custom-card-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
        draggable="true"
        @dragstart=${(event: DragEvent) => this._handleAreaCustomCardDragStart(event, entry.id)}
        @dragend=${this._handleAreaCustomCardDragEnd}
        @dragover=${(event: DragEvent) => this._handleAreaCustomCardDragOver(event, entry.placement, placementIndex)}
        @drop=${(event: DragEvent) => this._handleAreaCustomCardDrop(event, entry.placement, placementIndex)}
      >
        <div class="entity-item">
          <div class="handle"><ha-svg-icon .path=${mdiDrag}></ha-svg-icon></div>
          <span class="custom-card-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></span>
          <span class="entity-name">
            ${this._areaCustomCardTitle(entry)}
            <small>${this._t('layout.custom_cards')} · ${this._areaCustomCardSubtitle(entry)}</small>
          </span>
          <span class="custom-card-badge">${this._t('layout.drag_card')}</span>
        </div>
      </div>
    `;
  }

  private _renderAreaCustomCardPlacement(
    cards: AreaCustomCard[],
    placement: 'top' | 'bottom',
    label: string
  ) {
    const placementCards = cards.filter((entry) => entry.placement === placement);
    if (!placementCards.length && !this._draggedAreaCustomCardId) return nothing;
    const dragOver = this._dragOverAreaCustomCardTarget?.placement === placement &&
      this._dragOverAreaCustomCardTarget.index === placementCards.length;

    return html`
      <section
        class="area-custom-card-placement ${dragOver ? 'drag-over' : ''}"
        @dragover=${(event: DragEvent) => this._handleAreaCustomCardDragOver(event, placement, placementCards.length)}
        @drop=${(event: DragEvent) => this._handleAreaCustomCardDrop(event, placement, placementCards.length)}
      >
        <div class="area-custom-card-placement-title">
          <ha-icon icon=${placement === 'top' ? 'mdi:format-vertical-align-top' : 'mdi:format-vertical-align-bottom'}></ha-icon>
          <span>${label}</span>
        </div>
        <div class="sortable-container area-custom-card-list">
          ${placementCards.map((entry) => this._renderAreaCustomCardEditorRow(entry))}
          ${!placementCards.length ? html`<span class="area-custom-card-empty">${this._t('layout.drag_card')}</span>` : nothing}
        </div>
      </section>
    `;
  }

  private _renderAreaCustomCardDropZone(placement: string) {
    if (!this._draggedAreaCustomCardId) return nothing;
    const dragOver = this._dragOverAreaCustomCardTarget?.placement === placement;
    return html`
      <div
        class="area-custom-card-drop-zone ${dragOver ? 'drag-over' : ''}"
        @dragover=${(event: DragEvent) => this._handleAreaCustomCardDragOver(event, placement, Number.POSITIVE_INFINITY)}
        @drop=${(event: DragEvent) => this._handleAreaCustomCardDrop(event, placement, Number.POSITIVE_INFINITY)}
      >
        <ha-icon icon="mdi:cards-outline"></ha-icon>
        <span>${this._t('layout.drag_card')}</span>
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
    const areaOptions = this._config.areas_options?.[this._area] || {};
    const entityLayout: AreaEntityLayout = areaOptions.entity_layout === 'ungrouped' ? 'ungrouped' : 'grouped';
    const entityGroupById = new Map<string, AreaStrategyGroup>();
    AREA_STRATEGY_GROUPS.forEach((group) => {
      (groups[group] || []).forEach((entityId) => entityGroupById.set(entityId, group));
    });
    const allAreaEntityIds = AREA_STRATEGY_GROUPS.flatMap((group) => groups[group] || []);
    const ungroupedOrder = areaOptions.entity_order || [];
    const sortedUngroupedEntities = this._sortEntityIds(allAreaEntityIds, ungroupedOrder);
    const customCards = this._getAreaEditorCustomCards();
    const baseGroupedSections = this._sortAreaStrategyGroups(
      AREA_STRATEGY_GROUPS.filter((group) =>
        (groups[group] || []).length > 0 || customCards.some((entry) =>
          entry.placement === `after:${group}` ||
          this._domainCustomCardPlacementIndex(entry.placement, group) !== undefined
        )
      )
    );
    const groupedSections = this._draggedEntitySection && this._areaGroupPreviewOrder
      ? this._areaGroupPreviewOrder.filter((group) => baseGroupedSections.includes(group))
      : baseGroupedSections;
    const areaEntityLayoutIsDefault =
      areaOptions.entity_layout === undefined &&
      !(areaOptions.group_order?.length) &&
      !(areaOptions.entity_order?.length) &&
      !Object.values(areaOptions.groups_options || {}).some((options) =>
        Boolean(options?.hidden?.length || options?.order?.length)
      ) &&
      !customCards.some((entry) => entry.placement.startsWith('ungrouped:'));

    return html`
      <div class="editor-container area-detail-editor">
        <div class="area-help">
          <ha-svg-icon .path=${mdiThermometerWater} class="area-help-icon"></ha-svg-icon>
          <div class="area-help-text">
            <p>${this._t('settings.area_climate_power_help')}</p>
          </div>
        </div>

        ${customCards.length || this._draggedAreaCustomCardId ? html`
          <section class="area-custom-cards-settings">
            <div class="area-entity-layout-copy">
              <strong>${this._t('layout.custom_cards')}</strong>
              <span>${this._t('settings.area_entity_order_hint')}</span>
            </div>
            ${this._renderAreaCustomCardPlacement(customCards, 'top', this._t('layout.custom_cards_top'))}
          </section>
        ` : nothing}


        <section class="area-entity-layout-settings">
          <div class="area-entity-layout-heading">
            <strong>${this._t('settings.area_entity_layout_title')}</strong>
          </div>
          <div class="area-order-modes">
            <button
              class="area-order-mode ${entityLayout === 'grouped' ? 'selected' : ''}"
              type="button"
              @click=${() => this._setAreaEntityLayout('grouped', sortedUngroupedEntities, entityGroupById)}
            >
              <ha-icon icon="mdi:format-list-group"></ha-icon>
              <span>
                <strong>${this._t('settings.area_entity_layout_grouped')}</strong>
              </span>
            </button>
            <button
              class="area-order-mode ${entityLayout === 'ungrouped' ? 'selected' : ''}"
              type="button"
              @click=${() => this._setAreaEntityLayout('ungrouped')}
            >
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              <span>
                <strong>${this._t('settings.area_entity_layout_ungrouped')}</strong>
              </span>
            </button>
          </div>
          <p class="area-entity-layout-hint">${this._t('settings.area_entity_order_hint')}</p>

        ${entityLayout === 'ungrouped' ? html`
          <section class="area-free-order-section">
            <div class="area-free-order-header">
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              <strong>${this._t('settings.area_entity_order')}</strong>
            </div>
            <div class="sortable-container dragging-enabled ${this._draggedEntityGroup === UNGROUPED_ENTITY_DRAG_GROUP ? 'dragging' : ''}">
              ${this._getAreaEditorFreeCardsForSlot(customCards, 0, sortedUngroupedEntities, entityGroupById)
                .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
              ${repeat(
                sortedUngroupedEntities,
                (entityId) => entityId,
                (entityId, index) => {
                  const state = this.hass!.states[entityId];
                  const entityGroup = entityGroupById.get(entityId) || 'others';
                  const isHidden = new Set(areaOptions.groups_options?.[entityGroup]?.hidden || []).has(entityId);
                  const isDragging = this._draggedEntityId === entityId && this._draggedEntityGroup === UNGROUPED_ENTITY_DRAG_GROUP;
                  const isDragOver = this._dragOverEntityIndex === index &&
                    this._draggedEntityGroup === UNGROUPED_ENTITY_DRAG_GROUP &&
                    this._draggedEntityId && this._draggedEntityId !== entityId;

                  return html`
                    <div
                      class="sortable-item ${isHidden ? 'hidden' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
                      draggable="true"
                      @dragstart=${(e: DragEvent) => this._handleEntityDragStart(e, entityId, UNGROUPED_ENTITY_DRAG_GROUP)}
                      @dragend=${this._handleEntityDragEnd}
                      @dragover=${(e: DragEvent) => this._handleAreaEditorDragOver(e, UNGROUPED_ENTITY_DRAG_GROUP, index)}
                      @dragleave=${this._handleEntityDragLeave}
                      @drop=${(e: DragEvent) => this._handleAreaEditorDrop(e, UNGROUPED_ENTITY_DRAG_GROUP, index)}
                    >
                      <div class="entity-item">
                        <div class="handle"><ha-svg-icon .path=${mdiDrag}></ha-svg-icon></div>
                        <ha-state-icon .stateObj=${state} class="entity-icon"></ha-state-icon>
                        <span class="entity-name">
                          ${this._areaEntityDisplayName(entityId)}
                          <small>${this._getGroupTitle(entityGroup)}</small>
                        </span>
                        <button
                          class="dd-visibility-button ${isHidden ? 'hidden' : ''}"
                          type="button"
                          title=${isHidden ? this._t('common.show') : this._t('common.hide')}
                          aria-label=${isHidden ? this._t('common.show') : this._t('common.hide')}
                          @click=${(event: Event) => {
                            event.stopPropagation();
                            this._toggleEntityVisibility(entityId, entityGroup);
                          }}
                        >
                          <ha-icon icon=${isHidden ? 'mdi:eye' : 'mdi:eye-off'}></ha-icon>
                        </button>
                      </div>
                    </div>
                    ${this._getAreaEditorFreeCardsForSlot(customCards, index + 1, sortedUngroupedEntities, entityGroupById)
                      .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
                  `;
                }
              )}
              ${this._renderAreaCustomCardDropZone(`ungrouped:${sortedUngroupedEntities.length}`)}
            </div>
          </section>
        ` : groupedSections.map((group) => {
          // Get ALL entities for this group (don't filter hidden ones)
          const allGroupEntities = groups[group] || [];
          const concreteGroupOptions = this._config!.areas_options?.[this._area!]?.groups_options?.[group];
          const formerCombinedGroupOptions = group === 'cover_gates'
            ? this._config!.areas_options?.[this._area!]?.groups_options?.cover_shading
            : undefined;
          const legacyGroupOptions = this._config!.areas_options?.[this._area!]?.groups_options?.[getLegacyAreaGroupKey(group)];
          const groupOptions = concreteGroupOptions || formerCombinedGroupOptions || legacyGroupOptions;
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
          });          const groupHiddenCount = allGroupEntities.filter((entityId) => hiddenEntities.has(entityId)).length;
          const groupVisible = groupHiddenCount < allGroupEntities.length;
          const groupPartial = groupHiddenCount > 0 && groupHiddenCount < allGroupEntities.length;
          const groupOpen = !this._collapsedAreaEntityGroups.has(group);

          return html`
            <div
              class="area-entity-section ${groupOpen ? 'open' : ''} ${this._draggedEntitySection === group ? 'dragging' : ''} ${this._dragOverEntitySection === group ? 'drag-over' : ''}"
              @dragover=${(event: DragEvent) => this._handleEntitySectionDragOver(event, group)}
              @drop=${(event: DragEvent) => this._handleEntitySectionDrop(event, group, groupedSections)}
            >
              <div
                class="area-entity-section-card"
                @click=${() => this._toggleAreaEntityGroup(group)}
              >
                <div
                  class="area-entity-section-header"
                  draggable="true"
                  @dragstart=${(event: DragEvent) => this._handleEntitySectionDragStart(event, group, groupedSections)}
                  @dragend=${this._handleEntitySectionDragEnd}
                >
                  <div
                    class="area-entity-section-handle"
                    title=${this._t('layout.drag_group')}
                    aria-label=${this._t('layout.drag_group')}
                    @click=${(event: Event) => event.stopPropagation()}
                  >
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <ha-icon
                    class="area-entity-section-icon"
                    icon=${AREA_STRATEGY_GROUP_ICONS[group]}
                    style=${`--area-group-color: ${this._getAreaStrategyGroupColor(group)};`}
                  ></ha-icon>
                  <span class="area-entity-section-title">${this._getGroupTitle(group)}</span>
                  ${this._renderVisibilityButton(
                    groupVisible,
                    groupPartial,
                    groupVisible ? this._t('settings.hide_section') : this._t('settings.show_section'),
                    () => this._setAreaEntityGroupHidden(group, allGroupEntities, groupVisible)
                  )}
                  <button
                    class="dd-integrated-chevron area-entity-section-chevron"
                    type="button"
                    aria-expanded=${groupOpen ? 'true' : 'false'}
                    @click=${(event: Event) => {
                      event.stopPropagation();
                      this._toggleAreaEntityGroup(group);
                    }}
                  >
                    <ha-icon icon=${groupOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                  </button>
                </div>
                ${groupOpen ? html`
                  <div class="sortable-container ${this._draggedEntityGroup === group ? 'dragging' : ''}">
                ${this._getAreaEditorDomainCardsForSlot(customCards, group, 0, sortedEntities.length)
                  .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
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
                        @dragover=${(e: DragEvent) => this._handleAreaEditorDragOver(e, group, index)}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${(e: DragEvent) => this._handleAreaEditorDrop(e, group, index)}
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
                            ${this._areaEntityDisplayName(entityId)}
                          </span>
                          <button
                            class="dd-visibility-button ${isHidden ? 'hidden' : ''}"
                            type="button"
                            title=${isHidden ? this._t('common.show') : this._t('common.hide')}
                            aria-label=${isHidden ? this._t('common.show') : this._t('common.hide')}
                            @click=${(event: Event) => {
                              event.stopPropagation();
                              this._toggleEntityVisibility(entityId, group);
                            }}
                          >
                            <ha-icon icon=${isHidden ? 'mdi:eye' : 'mdi:eye-off'}></ha-icon>
                          </button>
                        </div>
                      </div>
                      ${this._getAreaEditorDomainCardsForSlot(customCards, group, index + 1, sortedEntities.length)
                        .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
                    `;
                  }
                )}
                  ${this._renderAreaCustomCardDropZone(`domain:${group}:${sortedEntities.length}`)}
                  </div>
                ` : nothing}
              </div>
            </div>
          `;
        })}
        ${customCards.length || this._draggedAreaCustomCardId
          ? this._renderAreaCustomCardPlacement(customCards, 'bottom', this._t('layout.custom_cards_bottom'))
          : nothing}
        <div class="area-layout-actions">
          ${entityLayout === 'grouped' ? html`
            <button
              class="home-layout-reset area-apply-type-order"
              type="button"
              ?disabled=${!this._areaGroupOrderDirty}
              @click=${this._applyAreaGroupOrderToAllAreas}
            >
              ${this._t('settings.apply_type_order_all_rooms')}
            </button>
          ` : nothing}
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${areaEntityLayoutIsDefault}
            @click=${this._resetAreaEntitySettings}
          >
            ${this._t('settings.reset_layout')}
          </button>
        </div>
        </section>
      </div>
    `;
  }

  private _getHomeSectionsOrder(): HomeSectionKey[] {
    return normalizeHomeSectionsOrder(this._config?.settings?.home_sections_order);
  }

  private _getHiddenHomeSections(): Set<HomeSectionKey> {
    const hidden = new Set(normalizeHiddenHomeSections(this._config?.settings?.home_sections_hidden));
    const settings = this._config?.settings;
    const explicitlyManaged =
      (settings?.home_sections_order || []).includes('now_playing') ||
      (settings?.home_sections_hidden || []).includes('now_playing');

    if (!explicitlyManaged && normalizeNowPlayingMode(settings?.now_playing_bar) === 'off') {
      hidden.add('now_playing');
    }
    return hidden;
  }

  private _getHiddenHomeInformationCards(): Set<HomeInformationCardKey> {
    return new Set(normalizeHiddenHomeInformationCards(this._config?.settings?.home_information_cards_hidden));
  }

  private _getHomeCameraSettings(): HomeCameraSetting[] {
    if (!this._config || !this.hass) return [];

    const areas = sortAreas(this._config.areas || [], this._config.areas_display, ddLocale(this.hass));
    const areaById = new Map(areas.map(area => [area.area_id, area]));
    const areaIndex = new Map(areas.map((area, index) => [area.area_id, index]));
    const deviceArea = new Map((this._config.devices || []).map(device => [device.device_id, device.area_id || '']));
    const configuredEntities = new Map((this._config.entities || []).map(entity => [entity.entity_id, entity]));
    const cameraIds = new Set([
      ...(this._config.entities || []).map(entity => entity.entity_id),
      ...Object.keys(this.hass.states || {}),
    ].filter(entityId => entityId.startsWith('camera.')));

    const cameras = [...cameraIds].flatMap(entityId => {
      const state = this.hass!.states[entityId];
      const registry = this.hass!.entities?.[entityId];
      const configured = configuredEntities.get(entityId);
      if (!state || registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') return [];

      const deviceId = configured?.device_id || registry?.device_id || '';
      const areaId = configured?.area_id || registry?.area_id || deviceArea.get(deviceId) || '';
      const area = areaById.get(areaId);
      if (!area) return [];

      return [{
        entityId,
        name: state.attributes?.friendly_name || registry?.name || entityId,
        areaId,
        areaName: area.name,
        state: this.hass!.formatEntityState(state),
      }];
    });

    cameras.sort((a, b) => {
      const areaDifference = (areaIndex.get(a.areaId) ?? Number.MAX_SAFE_INTEGER) -
        (areaIndex.get(b.areaId) ?? Number.MAX_SAFE_INTEGER);
      return areaDifference || a.name.localeCompare(b.name);
    });

    const configuredOrder = this._config.settings?.home_camera_order || [];
    const orderIndex = new Map(configuredOrder.map((entityId, index) => [entityId, index]));
    return cameras.sort((a, b) => {
      const ai = orderIndex.get(a.entityId);
      const bi = orderIndex.get(b.entityId);
      if (ai !== undefined || bi !== undefined) {
        return (ai ?? Number.MAX_SAFE_INTEGER) - (bi ?? Number.MAX_SAFE_INTEGER);
      }
      return 0;
    });
  }

  private _setHomeCameraOrder(order: string[]): void {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, home_camera_order: order },
    });
  }

  private _toggleHomeCamera(entityId: string): void {
    if (!this._config) return;
    const hidden = new Set(this._config.settings?.home_cameras_hidden || []);
    hidden.has(entityId) ? hidden.delete(entityId) : hidden.add(entityId);
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, home_cameras_hidden: [...hidden] },
    });
  }

  private _resetHomeCameraSettings = (): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        home_camera_order: [],
        home_cameras_hidden: [],
      },
    });
  };

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
        home_sections_order: this._getHomeSectionsOrder(),
        home_sections_hidden: normalizeHiddenHomeSections([...hidden]),
      },
    };

    this._fireConfigChanged(newConfig);
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
    const storedOrder = this._getHomeSectionsOrder();
    const order = this._draggedHomeSection && this._homeSectionPreviewOrder
      ? this._homeSectionPreviewOrder
      : storedOrder;
    const hiddenSections = this._getHiddenHomeSections();
    const activeDetail = this._homeSettingsDetail;
    const defaultHomeOrder = normalizeHomeSectionsOrder();
    const homeLayoutIsDefault =
      hiddenSections.size === 0 &&
      storedOrder.length === defaultHomeOrder.length &&
      storedOrder.every((section, index) => section === defaultHomeOrder[index]);

    const sectionIsOpen = (section: HomeSectionKey) => {
      if (section === 'devices') return activeDetail === 'house_information' || activeDetail === 'climate' || activeDetail === 'outdoor_climate';
      return this._homeSectionDetail(section) === activeDetail;
    };

    const toggleDetail = (section: HomeSectionKey) => {
      const detail = this._homeSectionDetail(section);
      if (!detail) return;
      this._homeSettingsDetail = sectionIsOpen(section) ? 'overview' : detail;
      this._closeInlinePickers();
    };

    const renderDetail = (section: HomeSectionKey) => {
      if (!sectionIsOpen(section)) return nothing;
      if (section === 'cameras') return this._renderHomeCameraSettings();
      if (section === 'custom_cards') return this._renderHomeCustomCardsSettings();
      if (section === 'scenes') return this._renderHomeScenesSettings();
      if (section === 'devices') {
        return html`<div class="dd-home-house-information">${this._renderHomeInformationCardSettings()}</div>`;
      }
      return nothing;
    };

    return html`
      <div class="home-layout-section dd-home-flat-layout">
        <div class="home-section-list ${this._draggedHomeSection ? 'dragging' : ''}">
          ${order.map((section, index) => {
            const meta = HOME_SECTION_META[section];
            const enabled = !hiddenSections.has(section);
            const detail = this._homeSectionDetail(section);
            const open = sectionIsOpen(section);
            const isDragging = this._draggedHomeSection === section;
            const isDragOver = this._dragOverHomeSectionIndex === index &&
              Boolean(this._draggedHomeSection) &&
              this._draggedHomeSection !== section;

            return html`
              <div class="dd-home-section-block ${open ? 'open' : ''}">
                <div
                  class="home-section-item ${enabled ? '' : 'disabled'} ${detail ? 'has-detail' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
                  draggable="true"
                  data-section=${section}
                  data-index=${index}
                  @click=${() => detail && toggleDetail(section)}
                  @dragstart=${(event: DragEvent) => this._handleHomeSectionDragStart(event, section)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${(event: DragEvent) => this._handleHomeSectionDragOver(event, index)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${(event: DragEvent) => this._handleHomeSectionDrop(event, index)}
                >
                  <div class="home-section-handle" @click=${(event: Event) => event.stopPropagation()}>
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon"><ha-icon icon=${meta.icon}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(meta.labelKey)}</div>
                    <div class="home-section-description">
                      ${this._t(meta.descriptionKey)}
                      ${section === 'favorites' ? html`
                        <button
                          class="dd-settings-inline-link"
                          type="button"
                          @click=${(event: Event) => {
                            event.stopPropagation();
                            this._openSettingsPage('favorites');
                          }}
                        >${this._t('settings.manage_favorites')}</button>
                      ` : nothing}
                    </div>
                  </div>
                  <div class="home-section-actions" @click=${(event: Event) => event.stopPropagation()}>
                    <button
                      class="home-section-toggle ${enabled ? 'enabled' : ''}"
                      type="button"
                      title=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-label=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-pressed=${enabled ? 'true' : 'false'}
                      @click=${() => this._toggleHomeSectionEnabled(section)}
                    >
                      <ha-icon icon=${enabled ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                    </button>
                  </div>
                  ${detail ? html`
                    <button
                      class="dd-integrated-chevron"
                      type="button"
                      aria-expanded=${open ? 'true' : 'false'}
                      @click=${(event: Event) => {
                        event.stopPropagation();
                        toggleDetail(section);
                      }}
                    >
                      <ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                    </button>
                  ` : nothing}
                </div>
                ${open ? html`<div class="dd-home-inline-detail">${renderDetail(section)}</div>` : nothing}
              </div>
            `;
          })}
        </div>
        <button
          class="home-layout-reset"
          type="button"
          ?disabled=${homeLayoutIsDefault}
          @click=${this._resetHomeSectionsOrder}
        >
          ${this._t('settings.reset_layout')}
        </button>
      </div>
    `;
  }

  private _getHomeScenes(): string[] {
    return normalizeHomeScenes(this._config?.settings?.home_scenes);
  }

  private _setHomeScenes(ids: string[]): void {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, home_scenes: ids },
    });
  }

  private _homeSceneName(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name ||
      getEntityRegistry(this.hass)[entityId]?.name ||
      entityId;
  }

  private _homeSceneAreaName(entityId: string): string | undefined {
    if (!this.hass || !this._config) return undefined;
    const areaId = resolveStatusEntityAreaId(this.hass, this._config, entityId);
    if (!areaId) return undefined;
    return (this._config.areas || []).find(area => area.area_id === areaId)?.name || this.hass.areas?.[areaId]?.name || undefined;
  }

  private _homeSceneIcon(entityId: string): string {
    const domain = homeSceneDomain(entityId) || 'scene';
    return getEntityRegistry(this.hass)[entityId]?.icon ||
      this.hass?.states[entityId]?.attributes?.icon ||
      getDomainIcon(domain);
  }

  private _homeSceneTypeLabel(entityId: string): string {
    return this._t(homeSceneDomain(entityId) === 'script' ? 'scenes.type_script' : 'scenes.type_scene');
  }

  private _renderHomeScenesSettings() {
    const picked = this._getHomeScenes();
    return html`
      <div class="dd-inline-section">
        <div class="dd-inline-action-row dd-inline-action-only">
          <button class="home-custom-card-add" type="button" @click=${() => { this._homeSceneSearch = ''; this._showHomeScenePicker = true; }}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t('scenes.add')}
          </button>
        </div>
        ${picked.length ? html`
          <div class="dd-flat-sublist">
            ${picked.map((entityId, index) => {
              const state = this.hass?.states[entityId];
              const unavailable = Boolean(state && isHiddenAsUnavailable(state));
              const name = this._homeSceneName(entityId);
              const meta = !state
                ? this._t('scenes.missing')
                : [this._homeSceneTypeLabel(entityId), this._homeSceneAreaName(entityId), unavailable ? this._t('common.unavailable') : ''].filter(Boolean).join(' · ');
              return html`
                <div class="dd-flat-subitem-row ${!state || unavailable ? 'disabled' : ''}">
                  <div class="home-section-icon"><ha-icon icon=${state ? this._homeSceneIcon(entityId) : "mdi:help-circle-outline"}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${name}</div>
                    <div class="home-section-description">${meta}</div>
                  </div>
                  <div class="home-section-actions">
                    <ha-icon-button .label=${this._t('settings.move_up')} .path=${mdiArrowUp} .disabled=${index === 0}
                      @click=${() => this._setHomeScenes(moveHomeScene(picked, entityId, -1))}></ha-icon-button>
                    <ha-icon-button .label=${this._t('settings.move_down')} .path=${mdiArrowDown} .disabled=${index === picked.length - 1}
                      @click=${() => this._setHomeScenes(moveHomeScene(picked, entityId, 1))}></ha-icon-button>
                    <ha-icon-button .label=${this._t('common.delete')} .path=${mdiDelete}
                      @click=${() => this._setHomeScenes(removeHomeScene(picked, entityId))}></ha-icon-button>
                  </div>
                </div>
              `;
            })}
          </div>
        ` : html`<div class="dd-empty-state">${this._t('scenes.settings_empty')}</div>`}
        ${this._showHomeScenePicker ? this._renderHomeScenePicker(picked) : nothing}
      </div>
    `;
  }

  private _renderHomeScenePicker(picked: string[]) {
    const registry = getEntityRegistry(this.hass);
    const candidates = pickableHomeSceneIds(this.hass?.states || {}, registry).map(entityId => {
      const candidate: HomeSceneCandidate = { entityId, name: this._homeSceneName(entityId) };
      const areaName = this._homeSceneAreaName(entityId);
      if (areaName) candidate.areaName = areaName;
      return candidate;
    });
    const options = filterHomeSceneCandidates(candidates, picked, this._homeSceneSearch, ddLocale(this.hass));
    return html`
      <div class="entity-picker-modal" @click=${(event: Event) => { if (event.target === event.currentTarget) this._showHomeScenePicker = false; }}>
        <div class="entity-picker-content" role="dialog" aria-modal="true" aria-label=${this._t('scenes.picker_title')}>
          <div class="entity-picker-header">
            <h4>${this._t('scenes.picker_title')}</h4>
            <button class="close-button" type="button" title=${this._t('common.close')} @click=${() => this._showHomeScenePicker = false}>×</button>
          </div>
          <div class="entity-search">
            <input class="entity-search-input" type="search" placeholder=${this._t('scenes.search')} .value=${this._homeSceneSearch}
              @input=${(event: Event) => this._homeSceneSearch = (event.target as HTMLInputElement).value} />
          </div>
          <div class="entity-list">
            ${options.map(option => html`
              <button type="button" class="entity-option" @click=${() => {
                this._setHomeScenes(addHomeScene(picked, option.entityId));
                this._showHomeScenePicker = false;
              }}>
                <ha-icon class="entity-icon" icon=${this._homeSceneIcon(option.entityId)}></ha-icon>
                <span class="entity-name">${option.name}</span>
                <span class="entity-id">${[this._homeSceneTypeLabel(option.entityId), option.areaName].filter(Boolean).join(' · ')}</span>
              </button>
            `)}
            ${options.length ? nothing : html`<div class="entity-picker-hint empty">${this._t('scenes.no_results')}</div>`}
          </div>
        </div>
      </div>
    `;
  }
  private _getHomeCustomCards(): HomeCustomCard[] {
    const cards = this._config?.home_custom_cards;
    if (!Array.isArray(cards)) return [];

    return cards.filter(entry =>
      Boolean(entry?.id) &&
      Boolean(entry?.card) &&
      typeof entry.card === 'object' &&
      typeof entry.card.type === 'string'
    );
  }

  private _createHomeCustomCardId(): string {
    return `home-card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private _homeCustomCardTitle(entry: HomeCustomCard): string {
    const config = entry.card as Record<string, any>;
    const entityId = typeof config.entity === 'string' ? config.entity : '';
    return config.title || config.name ||
      this.hass?.states?.[entityId]?.attributes?.friendly_name ||
      entityId ||
      config.type.replace(/^custom:/, '');
  }

  private _homeCustomCardSubtitle(entry: HomeCustomCard): string {
    return entry.card.type.replace(/^custom:/, '');
  }

  private _updateHomeCustomCards(cards: HomeCustomCard[]): void {
    if (!this._config) return;
    this._fireConfigChanged({ ...this._config, home_custom_cards: cards });
  }

  private _addHomeCustomCard(): void {
    showCardEditorDialog(this, {
      areaName: this._t('home_section.custom_cards.label'),
      onSave: (card: LovelaceCardConfig) => {
        this._updateHomeCustomCards([
          ...this._getHomeCustomCards(),
          { id: this._createHomeCustomCardId(), card },
        ]);
      },
    });
  }

  private _editHomeCustomCard(id: string): void {
    const cards = this._getHomeCustomCards();
    const entry = cards.find(card => card.id === id);
    if (!entry) return;

    showCardEditorDialog(this, {
      card: entry.card,
      areaName: this._t('home_section.custom_cards.label'),
      onSave: (card: LovelaceCardConfig) => {
        this._updateHomeCustomCards(cards.map(current => current.id === id ? { ...current, card } : current));
      },
    });
  }

  private _deleteHomeCustomCard(id: string): void {
    if (!confirm(this._t('layout.delete_card_confirm'))) return;
    this._updateHomeCustomCards(this._getHomeCustomCards().filter(card => card.id !== id));
  }

  private _renderHomeCustomCardsSettings() {
    const cards = this._getHomeCustomCards();

    const onDragStart = (event: DragEvent, id: string) => {
      this._draggedHomeCustomCard = id;
      event.dataTransfer?.setData('text/plain', id);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    };

    const onDrop = (event: DragEvent, targetIndex: number) => {
      event.preventDefault();
      const id = this._draggedHomeCustomCard || event.dataTransfer?.getData('text/plain');
      this._draggedHomeCustomCard = undefined;
      const current = this._getHomeCustomCards();
      const from = current.findIndex((entry) => entry.id === id);
      if (from < 0 || from === targetIndex) return;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      if (!moved) return;
      next.splice(targetIndex, 0, moved);
      this._updateHomeCustomCards(next);
    };

    return html`
      <div class="dd-inline-section">
        <div class="dd-inline-action-row dd-inline-action-only">
          <button class="home-custom-card-add" type="button" @click=${this._addHomeCustomCard}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t('common.add')}
          </button>
        </div>
        ${cards.length ? html`
          <div class="dd-flat-sublist">
            ${cards.map((entry, index) => html`
              <div
                class="dd-flat-subitem-row dd-draggable-subitem"
                draggable="true"
                @dragstart=${(event: DragEvent) => onDragStart(event, entry.id)}
                @dragend=${() => { this._draggedHomeCustomCard = undefined; }}
                @dragover=${(event: DragEvent) => event.preventDefault()}
                @drop=${(event: DragEvent) => onDrop(event, index)}
              >
                <div class="home-section-handle"><ha-svg-icon .path=${mdiDrag}></ha-svg-icon></div>
                <div class="home-section-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${this._homeCustomCardTitle(entry)}</div>
                  <div class="home-section-description">${this._homeCustomCardSubtitle(entry)}</div>
                </div>
                <div class="dd-inline-actions">
                  <button type="button" class="dd-icon-action" aria-label=${this._t('common.edit')} @click=${() => this._editHomeCustomCard(entry.id)}>
                    <ha-icon icon="mdi:pencil"></ha-icon>
                  </button>
                  <button type="button" class="dd-icon-action" aria-label=${this._t('common.delete')} @click=${() => this._deleteHomeCustomCard(entry.id)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </button>
                </div>
              </div>
            `)}
          </div>
        ` : html`<div class="dd-empty-state">${this._t('settings.no_home_custom_cards')}</div>`}
      </div>
    `;
  }

  private _getExcludedHomeClimateAreas(): Set<string> {
    return new Set(this._config?.settings?.home_climate_excluded_areas || []);
  }

  private _toggleHomeClimateArea(areaId: string, included: boolean): void {
    if (!this._config) return;
    const excluded = this._getExcludedHomeClimateAreas();
    if (included) excluded.delete(areaId); else excluded.add(areaId);
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, home_climate_excluded_areas: [...excluded] },
    });
  }

  private _getHomeOutdoorClimateAreas(): Set<string> {
    return new Set(this._config?.settings?.home_outdoor_climate_areas || []);
  }

  private _toggleHomeOutdoorClimateArea(areaId: string, outdoor: boolean): void {
    if (!this._config) return;
    const areas = this._getHomeOutdoorClimateAreas();
    if (outdoor) areas.add(areaId); else areas.delete(areaId);
    this._fireConfigChanged({
      ...this._config,
      settings: { ...this._config.settings, home_outdoor_climate_areas: [...areas] },
    });
  }

  private _renderHomeClimateAreaSettings() {
    if (!this._config || !this.hass) return nothing;
    const excluded = this._getExcludedHomeClimateAreas();
    const outdoor = this._getHomeOutdoorClimateAreas();
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const areas = sortAreas(
      Object.values(this.hass.areas || {}),
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    ).filter((area) => !hiddenAreas.has(area.area_id));

    return html`
      <div class="home-info-card-section home-climate-area-settings dd-climate-area-settings">
        <p class="dd-inline-description dd-climate-description">${this._t('settings.home_climate_areas_description')}</p>
        <div class="home-info-card-list">
          ${areas.map((area) => {
            const isOutdoor = outdoor.has(area.area_id);
            const included = !isOutdoor && !excluded.has(area.area_id);
            return html`
              <div class="home-info-card-item ${included ? 'enabled' : 'disabled'}">
                <div class="home-section-icon"><ha-icon icon=${area.icon || 'mdi:floor-plan'}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${area.name}</div>
                  ${isOutdoor ? html`<div class="home-section-description">${this._t('settings.home_climate_area_outdoor')}</div>` : nothing}
                </div>
                <div class="dd-climate-actions">
                  <button
                    class="home-section-toggle ${included ? 'enabled' : ''}"
                    type="button"
                    ?disabled=${isOutdoor}
                    title=${included ? this._t('common.hide') : this._t('common.show')}
                    aria-label=${included ? this._t('common.hide') : this._t('common.show')}
                    aria-pressed=${included ? 'true' : 'false'}
                    @click=${() => !isOutdoor && this._toggleHomeClimateArea(area.area_id, !included)}
                  >
                    <ha-icon icon=${included ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHomeOutdoorClimateAreaSettings() {
    if (!this._config || !this.hass) return nothing;
    const outdoor = this._getHomeOutdoorClimateAreas();
    const areas = sortAreas(
      Object.values(this.hass.areas || {}),
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    );

    return html`
      <div class="home-info-card-section home-climate-area-settings dd-climate-area-settings">
        <p class="dd-inline-description dd-climate-description">${this._t('settings.home_outdoor_climate_areas_description')}</p>
        <div class="home-info-card-list">
          ${areas.map((area) => {
            const selected = outdoor.has(area.area_id);
            return html`
              <div class="home-info-card-item ${selected ? 'enabled' : 'disabled'}">
                <div class="home-section-icon"><ha-icon icon=${area.icon || 'mdi:floor-plan'}></ha-icon></div>
                <div class="home-section-copy"><div class="home-section-title">${area.name}</div></div>
                <div class="dd-climate-actions">
                  <button
                    class="home-section-toggle ${selected ? 'enabled' : ''}"
                    type="button"
                    title=${selected ? this._t('common.hide') : this._t('common.show')}
                    aria-label=${selected ? this._t('common.hide') : this._t('common.show')}
                    aria-pressed=${selected ? 'true' : 'false'}
                    @click=${() => this._toggleHomeOutdoorClimateArea(area.area_id, !selected)}
                  >
                    <ha-icon icon=${selected ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHomeInformationCardSettings() {
    const hiddenCards = this._getHiddenHomeInformationCards();

    const detailFor = (card: HomeInformationCardKey): 'climate' | 'outdoor_climate' | undefined =>
      card === 'climate' || card === 'outdoor_climate' ? card : undefined;

    const toggleDetail = (detail: 'climate' | 'outdoor_climate') => {
      this._homeSettingsDetail = this._homeSettingsDetail === detail ? 'house_information' : detail;
      this._closeInlinePickers();
    };

    return html`
      <div class="dd-inline-section">
        <div class="dd-flat-sublist">
          ${DEFAULT_HOME_INFORMATION_CARDS.map((card) => {
            const meta = HOME_INFORMATION_CARD_META[card];
            const enabled = !hiddenCards.has(card);
            const detail = detailFor(card);
            const open = detail ? this._homeSettingsDetail === detail : false;

            return html`
              <div class="dd-flat-subitem ${open ? 'open' : ''}">
                <div class="dd-flat-subitem-row ${detail ? 'has-detail' : ''}" @click=${() => detail && toggleDetail(detail)}>
                  <div class="home-section-icon"><ha-icon icon=${meta.icon}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(meta.labelKey)}</div>
                  </div>
                  <div class="home-info-card-actions" @click=${(event: Event) => event.stopPropagation()}>
                    <button
                      class="home-section-toggle ${enabled ? 'enabled' : ''}"
                      type="button"
                      title=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-label=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-pressed=${enabled ? 'true' : 'false'}
                      @click=${() => this._toggleHomeInformationCardEnabled(card)}
                    >
                      <ha-icon icon=${enabled ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                    </button>
                  </div>
                  ${detail ? html`
                    <button
                      class="dd-integrated-chevron"
                      type="button"
                      aria-expanded=${open ? 'true' : 'false'}
                      @click=${(event: Event) => {
                        event.stopPropagation();
                        toggleDetail(detail);
                      }}
                    >
                      <ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                    </button>
                  ` : nothing}
                </div>
                ${detail === 'climate' && open ? html`<div class="dd-flat-subdetail">${this._renderHomeClimateAreaSettings()}</div>` : nothing}
                ${detail === 'outdoor_climate' && open ? html`<div class="dd-flat-subdetail">${this._renderHomeOutdoorClimateAreaSettings()}</div>` : nothing}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHomeCameraSettings() {
    const cameras = this._getHomeCameraSettings();
    const hidden = new Set(this._config?.settings?.home_cameras_hidden || []);
    const cameraLayoutIsDefault =
      (this._config?.settings?.home_camera_order || []).length === 0 &&
      hidden.size === 0;

    return html`
      <div class="dd-inline-section">
        ${cameras.length ? html`
          <div class="dd-flat-sublist">
            ${cameras.map((camera, index) => {
              const enabled = !hidden.has(camera.entityId);
              const unavailable = ['unavailable', 'unknown'].includes(String(this.hass?.states[camera.entityId]?.state || '').toLowerCase());
              const dragOver = this._dragOverHomeCameraIndex === index &&
                Boolean(this._draggedHomeCamera) &&
                this._draggedHomeCamera !== camera.entityId;
              return html`
                <div
                  class="dd-flat-subitem-row dd-draggable-subitem ${dragOver ? 'drag-over' : ''}"
                  draggable="true"
                  @dragstart=${(event: DragEvent) => this._handleHomeCameraDragStart(event, camera.entityId)}
                  @dragend=${this._handleHomeCameraDragEnd}
                  @dragover=${(event: DragEvent) => this._handleHomeCameraDragOver(event, index)}
                  @dragleave=${this._handleHomeCameraDragLeave}
                  @drop=${(event: DragEvent) => this._handleHomeCameraDrop(event, index)}
                >
                  <div class="home-section-handle"><ha-svg-icon .path=${mdiDrag}></ha-svg-icon></div>
                  <div class="home-section-icon"><ha-icon icon="mdi:cctv"></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${camera.name}</div>
                    <div class="home-section-description">${camera.areaName} · ${unavailable ? this._t('common.unavailable') : camera.state}</div>
                  </div>
                  <div class="home-info-card-actions">
                    <button
                      class="home-section-toggle ${enabled ? 'enabled' : ''}"
                      type="button"
                      title=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-label=${enabled ? this._t('settings.hide_section') : this._t('settings.show_section')}
                      aria-pressed=${enabled ? 'true' : 'false'}
                      @click=${() => this._toggleHomeCamera(camera.entityId)}
                    >
                      <ha-icon icon=${enabled ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon>
                    </button>
                  </div>
                </div>
              `;
            })}
          </div>
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${cameraLayoutIsDefault}
            @click=${this._resetHomeCameraSettings}
          >
            ${this._t('settings.reset_camera_cards')}
          </button>
        ` : html`<div class="dd-empty-state">${this._t('settings.home_camera_cards_empty')}</div>`}
      </div>
    `;
  }

  private _toggleExpandedDeviceType(typeKey: string): void {
    const next = new Set(this._expandedDeviceTypes);
    if (next.has(typeKey)) next.delete(typeKey);
    else next.add(typeKey);
    this._expandedDeviceTypes = next;
  }

  private _visibilityIcon(visible: boolean, partial = false): string {
    if (!visible) return "mdi:eye-off-outline";
    return partial ? "mdi:eye-minus-outline" : "mdi:eye-outline";
  }

  private _renderVisibilityButton(
    visible: boolean,
    partial: boolean,
    label: string,
    onClick: () => void
  ) {
    return html`
      <button
        class="dd-visibility-button ${visible ? 'visible' : 'hidden'} ${partial ? 'partial' : ''}"
        type="button"
        title=${label}
        aria-label=${label}
        aria-pressed=${visible ? 'true' : 'false'}
        @click=${(event: Event) => {
          event.stopPropagation();
          onClick();
        }}
      >
        <ha-icon icon=${this._visibilityIcon(visible, partial)}></ha-icon>
      </button>
    `;
  }

  private _renderDeviceVisibilitySettings() {
    const options = this._getDeviceTypeOptions();
    if (!options.length) return nothing;

    const groupsByKey = new Map(this._getDeviceVisibilityGroups().map((group) => [group.key, group]));
    const hiddenTypes = this._getHiddenDeviceTypes();
    const hiddenEntities = this._getHiddenDeviceEntityIds();
    const deviceLayoutIsDefault =
      hiddenTypes.size === 0 &&
      hiddenEntities.size === 0 &&
      this._getHiddenDeviceIds().size === 0;

    return html`
      <section class="device-visibility-section">
        <div class="device-types-header">
          <div>
            <h4>${this._t('settings.devices_page_types')}</h4>
            <p>${this._t('settings.devices_page_types_description')}</p>
          </div>
        </div>

        <div class="device-admission-groups">
          ${options.map((option) => {
            const group = groupsByKey.get(option.key);
            const globallyVisible = !hiddenTypes.has(option.key);
            const devices = group?.devices || [];
            const entityIds = [...new Set(devices.flatMap((device) => device.entityIds))];
            const total = entityIds.length || option.count;
            const hiddenInGroup = entityIds.filter((entityId) => hiddenEntities.has(entityId)).length;
            const visibleInGroup = globallyVisible ? Math.max(0, total - hiddenInGroup) : 0;
            const partial = globallyVisible && hiddenInGroup > 0 && hiddenInGroup < total;
            const expanded = Boolean(group?.areas.length) && this._expandedDeviceTypes.has(option.key);

            return html`
              <section
                class="device-type-panel ${expanded ? 'open' : ''} ${globallyVisible ? '' : 'disabled'}"
                style=${`--device-type-color: ${option.color};`}
              >
                <div
                  class="device-type-panel-row expandable"
                  @click=${() => this._toggleExpandedDeviceType(option.key)}
                >
                  <span class="device-type-icon small"><ha-icon icon=${option.icon}></ha-icon></span>
                  <span class="device-type-heading">
                    <strong>${option.label}</strong>
                    <small>${this._t('settings.visible_count', { visible: visibleInGroup, total })}</small>
                  </span>
                  ${this._renderVisibilityButton(
                    globallyVisible,
                    partial,
                    globallyVisible ? this._t('settings.hide_type') : this._t('settings.show_type'),
                    () => this._setDeviceTypeVisible(option.key, !globallyVisible)
                  )}
                  <button
                    class="dd-integrated-chevron device-type-chevron"
                    type="button"
                    aria-expanded=${expanded ? 'true' : 'false'}
                    @click=${(event: Event) => {
                      event.stopPropagation();
                      this._toggleExpandedDeviceType(option.key);
                    }}
                  >
                    <ha-icon icon=${expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                  </button>
                </div>

                ${expanded && group ? html`
                  <div class="device-admission-panel">
                    ${group.areas.map((areaGroup) => {
                      const areaEntityIds = [...new Set(areaGroup.devices.flatMap((device) => device.entityIds))];
                      const hiddenInArea = areaEntityIds.filter((entityId) => hiddenEntities.has(entityId)).length;
                      const areaVisible = hiddenInArea < areaEntityIds.length;
                      const areaPartial = hiddenInArea > 0 && hiddenInArea < areaEntityIds.length;

                      return html`
                        <section class="device-admission-area">
                          <div class="device-admission-area-header">
                            <span class="device-type-heading device-area-heading">
                              <strong>${areaGroup.areaName}</strong>
                              <small>${this._t('settings.visible_count', {
                                visible: areaEntityIds.length - hiddenInArea,
                                total: areaEntityIds.length,
                              })}</small>
                            </span>
                            ${this._renderVisibilityButton(
                              areaVisible,
                              areaPartial,
                              areaVisible ? this._t('settings.hide_area') : this._t('settings.show_area'),
                              () => this._setEntitiesHidden(areaEntityIds, areaVisible)
                            )}
                          </div>
                          <div class="device-admission-device-list">
                            ${areaGroup.devices.flatMap((device) =>
                              device.entityIds.map((entityId) => this._renderDeviceEntityVisibilityRow(entityId, device, group))
                            )}
                          </div>
                        </section>
                      `;
                    })}
                  </div>
                ` : nothing}
              </section>
            `;
          })}
        </div>
        <button
          class="home-layout-reset area-list-reset"
          type="button"
          ?disabled=${deviceLayoutIsDefault}
          @click=${this._resetDeviceVisibility}
        >
          ${this._t('settings.reset_layout')}
        </button>
      </section>
    `;
  }

  private _showEntityInfo(entityId: string): void {
    if (!entityId || !this.hass?.states?.[entityId]) return;

    const homeAssistant = document.querySelector("home-assistant");
    const target = homeAssistant || this;
    target.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  private _entityVisibilityName(entityId: string): string {
    const state = this.hass?.states?.[entityId];
    return state?.attributes?.friendly_name
      || (this.hass?.entities?.[entityId] as any)?.name
      || entityId;
  }

  private _renderDeviceEntityVisibilityRow(
    entityId: string,
    device: DeviceVisibilityDevice,
    group: DeviceVisibilityTypeGroup
  ) {
    const visible = !this._getHiddenDeviceEntityIds().has(entityId) && !this._getHiddenDeviceIds().has(device.deviceId);
    const interactive = Boolean(this.hass?.states?.[entityId]);

    return html`
      <div
        class="device-admission-device ${visible ? "visible" : "hidden"} ${interactive ? "interactive" : ""}"
        role=${interactive ? "button" : "group"}
        tabindex=${interactive ? "0" : "-1"}
        @click=${() => interactive && this._showEntityInfo(entityId)}
        @keydown=${(event: KeyboardEvent) => {
          if (!interactive || (event.key !== "Enter" && event.key !== " ")) return;
          event.preventDefault();
          this._showEntityInfo(entityId);
        }}
      >
        <div class="device-type-icon"><ha-icon icon=${group.icon}></ha-icon></div>
        <div class="device-admission-copy">
          <div class="device-type-name">${this._entityVisibilityName(entityId)}</div>
        </div>
        ${this._renderVisibilityButton(
          visible,
          false,
          visible ? this._t('common.hide') : this._t('common.show'),
          () => this._setEntityHidden(entityId, visible)
        )}
      </div>
    `;
  }

  private _getDeviceVisibilityGroups(): DeviceVisibilityTypeGroup[] {
    if (!this.hass || !this._config) return [];

    const deviceById = this._getAllDevicesById();
    const hiddenDevices = this._getHiddenDeviceIds();
    const collator = new Intl.Collator(ddLocale(this.hass), {
      numeric: true,
      sensitivity: "base",
    });
    const orderedAreas = sortAreas(
      this._config.areas || [],
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    );
    const areaOrder = new Map(orderedAreas.map((area, index) => [area.area_id, index]));
    const compareArea = (a: { areaId: string; areaName: string }, b: { areaId: string; areaName: string }) => {
      const aIndex = areaOrder.get(a.areaId) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = areaOrder.get(b.areaId) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex || collator.compare(a.areaName, b.areaName);
    };
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
      const device = deviceById.get(deviceId)!;
      const area = this._deviceVisibilityArea(device, [record.entityId]);
      if (!area || !this._isDeviceManagedEntity(record.entityId, area.areaId)) return;

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
              entityIds: [...entityIds].sort((a, b) => collator.compare(a, b)),
              hidden: hiddenDevices.has(deviceId),
            };
          })
          .filter((device): device is DeviceVisibilityDevice => Boolean(device))
          .sort((a, b) => compareArea(a, b) || collator.compare(a.name, b.name));

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

        const areas = [...areaMap.values()].sort(compareArea);

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
      .sort((a, b) => collator.compare(a.label, b.label));
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

  private _isDeviceManagedEntity(entityId: string, areaId?: string): boolean {
    const registry = this.hass?.entities?.[entityId] as any;
    const state = this.hass?.states?.[entityId];

    if (
      !state ||
      registry?.hidden_by ||
      registry?.disabled_by ||
      registry?.entity_category === "diagnostic" ||
      registry?.entity_category === "config"
    ) {
      return false;
    }

    if (areaId && this._isEntityHiddenInAreaOptions(areaId, entityId)) {
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

    if (this._config?.settings?.hide_unavailable_entities_on_devices !== false) {
      return undefined;
    }

    return {
      areaId: '__unassigned__',
      areaName: this._t('settings.unassigned_area'),
    };
  }

  private _getHiddenDeviceEntityIds(): Set<string> {
    return new Set(
      (this._config?.device_admission?.hidden_entities || [])
        .filter((entityId): entityId is string => typeof entityId === "string" && entityId.length > 0)
    );
  }

  private _setEntityHidden(entityId: string, hidden: boolean): void {
    this._setEntitiesHidden([entityId], hidden);
  }

  private _setEntitiesHidden(entityIds: string[], hidden: boolean): void {
    if (!this._config) return;
    const nextHidden = this._getHiddenDeviceEntityIds();
    entityIds.forEach((entityId) => {
      if (!entityId) return;
      if (hidden) nextHidden.add(entityId);
      else nextHidden.delete(entityId);
    });
    this._fireConfigChanged({
      ...this._config,
      device_admission: {
        ...this._config.device_admission,
        hidden_entities: [...nextHidden].sort(),
      },
    });
  }

  private _resetDeviceVisibility = (): void => {
    if (!this._config) return;
    this._expandedDeviceTypes = new Set();
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        hidden_device_types: [],
      },
      device_admission: {
        ...this._config.device_admission,
        hidden_entities: [],
        hidden_devices: [],
      },
    });
  };

  private _getHiddenDeviceIds(): Set<string> {
    return new Set(
      (this._config?.device_admission?.hidden_devices || [])
        .filter((deviceId): deviceId is string => typeof deviceId === "string" && deviceId.length > 0)
    );
  }

  private _getDeviceTypeOptions(): Array<{ key: string; label: string; icon: string; color: string; count: number }> {
    return this._getDeviceVisibilityGroups()
      .map((group) => ({
        key: group.key,
        label: group.label,
        icon: group.icon,
        color: group.color,
        count: group.devices.reduce((total, device) => total + device.entityCount, 0),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, ddLocale(this.hass)));
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
    return getDomainName(this.hass, group);
  }

  private _sortEntityIds(entityIds: string[], order: string[]): string[] {
    const orderIndex = new Map(order.map((entityId, index) => [entityId, index]));
    return [...entityIds].sort((a, b) => {
      const aIndex = orderIndex.get(a);
      const bIndex = orderIndex.get(b);
      if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
      if (aIndex !== undefined) return -1;
      if (bIndex !== undefined) return 1;
      const nameA = this.hass?.states[a]?.attributes?.friendly_name || a;
      const nameB = this.hass?.states[b]?.attributes?.friendly_name || b;
      return nameA.localeCompare(nameB, ddLocale(this.hass));
    });
  }

  private _getAreaStrategyGroupColor(group: AreaStrategyGroup): string {
    if (group === 'cover_openings') return getDomainColor('binary_sensor', 'opening');
    if (group === 'cover_shading' || group === 'cover_gates') return getDomainColor('cover');
    if (group === 'motion') return getDomainColor('binary_sensor', 'motion');
    if (group === 'safety') return getDomainColor('binary_sensor', 'smoke');
    return getDomainColor(group);
  }

  private _resetAreaEntitySettings = (): void => {
    if (!this._config || !this._area) return;
    const current = this._config.areas_options?.[this._area] || {};
    const groupOrderChanged = Boolean(current.group_order?.length);
    const nextAreaOptions = { ...current };
    delete nextAreaOptions.entity_layout;
    delete nextAreaOptions.group_order;
    delete nextAreaOptions.entity_order;
    delete nextAreaOptions.groups_options;
    if (Array.isArray(nextAreaOptions.custom_cards)) {
      nextAreaOptions.custom_cards = nextAreaOptions.custom_cards.map((entry) =>
        entry.placement.startsWith('ungrouped:') ? { ...entry, placement: 'bottom' } : entry
      );
    }
    this._collapsedAreaEntityGroups = new Set(AREA_STRATEGY_GROUPS);
    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: nextAreaOptions,
      },
    });
    if (groupOrderChanged) this._areaGroupOrderDirty = true;
  };

  private _setAreaEntityLayout(
    layout: AreaEntityLayout,
    entities: string[] = [],
    entityGroupById: Map<string, AreaStrategyGroup> = new Map()
  ): void {
    if (!this._config || !this._area) return;
    if (layout === 'grouped') {
      this._collapsedAreaEntityGroups = new Set(AREA_STRATEGY_GROUPS);
    }
    const areaOptions = this._config.areas_options?.[this._area];
    const customCards = (areaOptions?.custom_cards || []).map((entry) => {
      if (layout !== 'grouped' || !entry.placement.startsWith('ungrouped:')) return entry;

      const slotIndex = Math.min(
        entities.length,
        Math.max(0, Number(entry.placement.slice('ungrouped:'.length)) || 0)
      );
      if (slotIndex >= entities.length) return { ...entry, placement: 'bottom' };

      const targetEntityId = entities[slotIndex];
      const targetGroup = targetEntityId ? entityGroupById.get(targetEntityId) : undefined;
      if (!targetGroup) return { ...entry, placement: 'bottom' };
      const domainIndex = entities
        .slice(0, slotIndex)
        .filter((entityId) => entityGroupById.get(entityId) === targetGroup)
        .length;
      return { ...entry, placement: `domain:${targetGroup}:${domainIndex}` };
    });

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...areaOptions,
          entity_layout: layout,
          custom_cards: customCards,
        },
      },
    });
  }

  private _saveUngroupedEntityOrder(order: string[]): void {
    if (!this._config || !this._area) return;
    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...this._config.areas_options?.[this._area],
          entity_order: order,
        },
      },
    });
  }

  private _getAreaGroupedEntitiesWithoutFiltering(
    areaEntities: { entity_id: string }[],
    hass: HomeAssistant
  ): Record<AreaStrategyGroup, string[]> {
    const grouped = Object.fromEntries(
      AREA_STRATEGY_GROUPS.map((group) => [group, [] as string[]])
    ) as Record<AreaStrategyGroup, string[]>;

    areaEntities.forEach((entity) => {
      const entityId = entity.entity_id;
      if (!hass.states[entityId]) return;

      const entityRegistry = hass.entities?.[entityId];
      if (entityRegistry?.hidden_by || entityRegistry?.entity_category === 'diagnostic' || entityRegistry?.entity_category === 'config') {
        return;
      }

      const group = getAreaEntityGroupKey(entityId, hass);
      if (group) grouped[group].push(entityId);
    });

    return grouped;
  }

  private _handleHomeSectionDragStart(e: DragEvent, section: HomeSectionKey): void {
    this._draggedHomeSection = section;
    this._homeSectionPreviewOrder = [...this._getHomeSectionsOrder()];

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", section);

      const dragImage = document.createElement("div");
      dragImage.style.position = "fixed";
      dragImage.style.left = "-10000px";
      dragImage.style.top = "-10000px";
      dragImage.style.width = "1px";
      dragImage.style.height = "1px";
      dragImage.style.opacity = "0";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      window.requestAnimationFrame(() => dragImage.remove());
    }
  }

  private _handleHomeSectionDragEnd = (): void => {
    this._draggedHomeSection = undefined;
    this._dragOverHomeSectionIndex = undefined;
    this._homeSectionPreviewOrder = undefined;
  };

  private _handleHomeSectionDragOver(e: DragEvent, index: number): void {
    e.preventDefault();

    const dragged = this._draggedHomeSection;
    if (dragged) {
      const preview = [...(this._homeSectionPreviewOrder || this._getHomeSectionsOrder())];
      const fromIndex = preview.indexOf(dragged);
      if (fromIndex !== -1 && fromIndex !== index) {
        const [item] = preview.splice(fromIndex, 1);
        preview.splice(index, 0, item!);
        this._homeSectionPreviewOrder = preview;
      }
    }

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

    const currentOrder = this._getHomeSectionsOrder();
    const previewOrder = this._homeSectionPreviewOrder;

    if (
      previewOrder &&
      previewOrder.length === currentOrder.length &&
      previewOrder.some((section, index) => section !== currentOrder[index])
    ) {
      this._setHomeSectionsOrder(previewOrder);
    } else {
      const draggedIndex = currentOrder.indexOf(dragged);
      if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
        const next = [...currentOrder];
        const [item] = next.splice(draggedIndex, 1);
        next.splice(dropIndex, 0, item!);
        this._setHomeSectionsOrder(next);
      }
    }

    this._handleHomeSectionDragEnd();
  }

  private _handleHomeCameraDragStart(event: DragEvent, entityId: string): void {
    this._draggedHomeCamera = entityId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', entityId);
    }
  }

  private _handleHomeCameraDragEnd = (): void => {
    this._draggedHomeCamera = undefined;
    this._dragOverHomeCameraIndex = undefined;
  };

  private _handleHomeCameraDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this._dragOverHomeCameraIndex = index;
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  private _handleHomeCameraDragLeave = (event: DragEvent): void => {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;
    if (!currentTarget?.contains(relatedTarget)) this._dragOverHomeCameraIndex = undefined;
  };

  private _handleHomeCameraDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const dragged = this._draggedHomeCamera;
    if (!dragged) return;

    const order = this._getHomeCameraSettings().map(camera => camera.entityId);
    const draggedIndex = order.indexOf(dragged);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      this._handleHomeCameraDragEnd();
      return;
    }

    const [camera] = order.splice(draggedIndex, 1);
    order.splice(dropIndex, 0, camera!);
    this._setHomeCameraOrder(order);
    this._handleHomeCameraDragEnd();
  }

  private _resetAreasConfiguration = (): void => {
    if (!this._config) return;
    this._areaPreviewOrder = undefined;
    this._fireConfigChanged({
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        hidden: [],
        order: [],
        sort_mode: undefined,
      },
    });
  };

  private _setAreaSortMode(sortMode: AreaSortMode): void {
    if (!this._config || !this.hass) return;

    const existingOrder = this._config.areas_display?.order || [];
    const registryOrder = Object.values(this.hass.areas || {}).map((area) => area.area_id);
    const order = sortMode === 'custom' && existingOrder.length === 0
      ? registryOrder
      : existingOrder;

    this._fireConfigChanged({
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        sort_mode: sortMode,
        order,
      },
    });
  }

  private _handleAreaDragStart(e: DragEvent, areaId: string): void {
    this._draggedAreaId = areaId;
    this._areaPreviewOrder = sortAreas(
      Object.values(this.hass?.areas || {}),
      { ...this._config?.areas_display, hidden: [] },
      ddLocale(this.hass)
    ).map((area) => area.area_id);

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', areaId);
      const dragImage = document.createElement("div");
      dragImage.style.position = "fixed";
      dragImage.style.left = "-10000px";
      dragImage.style.top = "-10000px";
      dragImage.style.width = "1px";
      dragImage.style.height = "1px";
      dragImage.style.opacity = "0";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      window.requestAnimationFrame(() => dragImage.remove());
    }
  }

  private _handleAreaDragEnd(): void {
    this._draggedAreaId = undefined;
    this._dragOverIndex = undefined;
    this._areaPreviewOrder = undefined;
  }

  private _handleAreaDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    const dragged = this._draggedAreaId;
    if (dragged) {
      const preview = [...(this._areaPreviewOrder || [])];
      const fromIndex = preview.indexOf(dragged);
      if (fromIndex !== -1 && fromIndex !== index) {
        const [item] = preview.splice(fromIndex, 1);
        preview.splice(index, 0, item!);
        this._areaPreviewOrder = preview;
      }
    }
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._dragOverIndex = index;
  }

  private _handleAreaDragLeave(e: DragEvent): void {
    const currentTarget = e.currentTarget as HTMLElement | null;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!currentTarget?.contains(relatedTarget)) this._dragOverIndex = undefined;
  }

  private _handleAreaDrop(e: DragEvent, _dropIndex: number): void {
    e.preventDefault();

    if (
      !this._draggedAreaId ||
      !this._config ||
      resolveAreaSortMode(this._config.areas_display) !== 'custom'
    ) return;

    if (this._areaPreviewOrder?.length) {
      this._fireConfigChanged({
        ...this._config,
        areas_display: {
          ...this._config.areas_display,
          order: [...this._areaPreviewOrder],
        },
      });
    }

    this._handleAreaDragEnd();
  }

  private _handleAreaCustomCardDragStart(event: DragEvent, cardId: string): void {
    this._draggedAreaCustomCardId = cardId;
    this._dragOverAreaCustomCardTarget = undefined;
    this._handleEntityDragEnd();
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `custom-card:${cardId}`);
    }
  }

  private _handleAreaCustomCardDragEnd = (): void => {
    this._draggedAreaCustomCardId = undefined;
    this._dragOverAreaCustomCardTarget = undefined;
  };

  private _handleAreaCustomCardDragOver(event: DragEvent, placement: string, index: number): void {
    if (!this._draggedAreaCustomCardId) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this._dragOverAreaCustomCardTarget = { placement, index };
  }

  private _handleAreaCustomCardDrop(event: DragEvent, placement: string, index: number): void {
    if (!this._draggedAreaCustomCardId) return;
    event.preventDefault();
    event.stopPropagation();
    this._moveAreaEditorCustomCard(this._draggedAreaCustomCardId, placement, index);
    this._handleAreaCustomCardDragEnd();
  }

  private _moveAreaEditorCustomCard(cardId: string, placement: string, placementIndex: number): void {
    if (!this._config || !this._area) return;
    const cards = [...this._getAreaEditorCustomCards()];
    const currentIndex = cards.findIndex((entry) => entry.id === cardId);
    if (currentIndex < 0) return;

    const current = cards[currentIndex];
    if (!current) return;
    const currentPlacementIndex = cards
      .slice(0, currentIndex)
      .filter((entry) => entry.placement === current.placement)
      .length;
    const [moved] = cards.splice(currentIndex, 1);
    if (!moved) return;

    let nextPlacementIndex = placementIndex;
    if (moved.placement === placement && currentPlacementIndex < placementIndex) {
      nextPlacementIndex = Math.max(0, placementIndex - 1);
    }
    moved.placement = placement;

    let seen = 0;
    let insertAt = cards.length;
    for (let index = 0; index < cards.length; index += 1) {
      if (cards[index]?.placement !== placement) continue;
      if (seen >= nextPlacementIndex) {
        insertAt = index;
        break;
      }
      seen += 1;
    }
    cards.splice(insertAt, 0, moved);

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...this._config.areas_options?.[this._area],
          custom_cards: cards,
        },
      },
    });
  }

  private _areaGroupOrderIndex(group: AreaStrategyGroup, configuredOrder: readonly string[]): number | undefined {
    const direct = configuredOrder.indexOf(group);
    if (direct >= 0) return direct;

    if (group === 'cover_gates') {
      const formerCombined = configuredOrder.indexOf('cover_shading');
      if (formerCombined >= 0) return formerCombined;
    }

    const legacy = configuredOrder.indexOf(getLegacyAreaGroupKey(group));
    return legacy >= 0 ? legacy : undefined;
  }

  private _sortAreaStrategyGroups(groups: readonly AreaStrategyGroup[]): AreaStrategyGroup[] {
    const configuredOrder = this._config?.areas_options?.[this._area || '']?.group_order || [];
    if (!configuredOrder.length) return [...groups];

    return groups
      .map((group, fallbackIndex) => ({ group, fallbackIndex }))
      .sort((a, b) => {
        const aIndex = this._areaGroupOrderIndex(a.group, configuredOrder);
        const bIndex = this._areaGroupOrderIndex(b.group, configuredOrder);
        if (aIndex !== undefined && bIndex !== undefined) {
          if (aIndex !== bIndex) return aIndex - bIndex;
          return a.fallbackIndex - b.fallbackIndex;
        }
        if (aIndex !== undefined) return -1;
        if (bIndex !== undefined) return 1;
        return a.fallbackIndex - b.fallbackIndex;
      })
      .map(({ group }) => group);
  }

  private _saveEntitySectionOrder(visibleOrder: AreaStrategyGroup[]): void {
    if (!this._config || !this._area) return;

    const completeOrder = [
      ...visibleOrder,
      ...AREA_STRATEGY_GROUPS.filter(group => !visibleOrder.includes(group)),
    ];

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...this._config.areas_options?.[this._area],
          group_order: completeOrder,
        },
      },
    });
    this._areaGroupOrderDirty = true;
  }

  private _applyAreaGroupOrderToAllAreas = (): void => {
    if (!this._config || !this._area || !this._areaGroupOrderDirty) return;

    const currentOrder = this._config.areas_options?.[this._area]?.group_order;
    const order = currentOrder?.length ? [...currentOrder] : [...AREA_STRATEGY_GROUPS];
    const nextAreaOptions = { ...this._config.areas_options };

    (this._config.areas || []).forEach((area) => {
      nextAreaOptions[area.area_id] = {
        ...nextAreaOptions[area.area_id],
        group_order: [...order],
      };
    });

    this._fireConfigChanged({
      ...this._config,
      areas_options: nextAreaOptions,
    });
    this._areaGroupOrderDirty = false;
  };

  private _toggleAreaEntityGroup(group: AreaStrategyGroup): void {
    const next = new Set(this._collapsedAreaEntityGroups);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    this._collapsedAreaEntityGroups = next;
  }

  private _setAreaEntityGroupHidden(
    group: AreaStrategyGroup,
    entityIds: string[],
    hidden: boolean
  ): void {
    if (!this._config || !this._area) return;

    const concrete = this._config.areas_options?.[this._area]?.groups_options?.[group];
    const formerCombined = group === 'cover_gates'
      ? this._config.areas_options?.[this._area]?.groups_options?.cover_shading
      : undefined;
    const legacy = this._config.areas_options?.[this._area]?.groups_options?.[getLegacyAreaGroupKey(group)];
    const current = concrete || formerCombined || legacy;
    const nextHidden = new Set(
      (current?.hidden || []).filter((entityId) => entityIds.includes(entityId))
    );
    entityIds.forEach((entityId) => {
      if (hidden) nextHidden.add(entityId);
      else nextHidden.delete(entityId);
    });

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...this._config.areas_options?.[this._area],
          groups_options: {
            ...this._config.areas_options?.[this._area]?.groups_options,
            [group]: {
              ...current,
              hidden: [...nextHidden],
            },
          },
        },
      },
    });
  }

  private _handleEntitySectionDragStart(
    event: DragEvent,
    group: AreaStrategyGroup,
    orderedGroups: AreaStrategyGroup[]
  ): void {
    event.stopPropagation();
    this._handleEntityDragEnd();
    this._handleAreaCustomCardDragEnd();
    this._draggedEntitySection = group;
    this._dragOverEntitySection = undefined;
    this._areaGroupPreviewOrder = [...orderedGroups];
    event.dataTransfer?.setData('text/plain', group);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private _handleEntitySectionDragOver(event: DragEvent, group: AreaStrategyGroup): void {
    const dragged = this._draggedEntitySection;
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

    const preview = [...(this._areaGroupPreviewOrder || [])];
    const fromIndex = preview.indexOf(dragged);
    const targetIndex = preview.indexOf(group);
    if (fromIndex >= 0 && targetIndex >= 0 && fromIndex !== targetIndex) {
      const [moved] = preview.splice(fromIndex, 1);
      if (moved) preview.splice(targetIndex, 0, moved);
      this._areaGroupPreviewOrder = preview;
    }
    this._dragOverEntitySection = group;
  }

  private _handleEntitySectionDrop(
    event: DragEvent,
    _targetGroup: AreaStrategyGroup,
    orderedGroups: AreaStrategyGroup[]
  ): void {
    if (!this._draggedEntitySection) return;
    event.preventDefault();
    event.stopPropagation();

    const reordered = this._areaGroupPreviewOrder?.length
      ? [...this._areaGroupPreviewOrder]
      : [...orderedGroups];
    this._saveEntitySectionOrder(reordered);
    this._handleEntitySectionDragEnd();
  }

  private _handleEntitySectionDragEnd = (): void => {
    this._draggedEntitySection = undefined;
    this._dragOverEntitySection = undefined;
    this._areaGroupPreviewOrder = undefined;
  };

  private _handleAreaEditorDragOver(event: DragEvent, group: string, index: number): void {
    if (this._draggedAreaCustomCardId) {
      const placement = group === UNGROUPED_ENTITY_DRAG_GROUP
        ? `ungrouped:${index}`
        : `domain:${group}:${index}`;
      this._handleAreaCustomCardDragOver(event, placement, Number.POSITIVE_INFINITY);
      return;
    }
    this._handleEntityDragOver(event, group, index);
  }

  private _handleAreaEditorDrop(event: DragEvent, group: string, index: number): void {
    if (this._draggedAreaCustomCardId) {
      const placement = group === UNGROUPED_ENTITY_DRAG_GROUP
        ? `ungrouped:${index}`
        : `domain:${group}:${index}`;
      this._handleAreaCustomCardDrop(event, placement, Number.POSITIVE_INFINITY);
      return;
    }
    this._handleEntityDrop(event, group, index);
  }

  private _handleEntityDragStart(e: DragEvent, entityId: string, group: string): void {
    this._handleAreaCustomCardDragEnd();
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
    const isUngrouped = group === UNGROUPED_ENTITY_DRAG_GROUP;
    const allGroupEntities = isUngrouped
      ? AREA_STRATEGY_GROUPS.flatMap((groupKey) => groups[groupKey] || [])
      : groups[group as keyof typeof groups] || [];
    const concreteGroupOptions = this._config.areas_options?.[this._area]?.groups_options?.[group];
    const formerCombinedGroupOptions = group === 'cover_gates'
      ? this._config.areas_options?.[this._area]?.groups_options?.cover_shading
      : undefined;
    const legacyGroup = (AREA_STRATEGY_GROUPS as readonly string[]).includes(group)
      ? getLegacyAreaGroupKey(group as AreaStrategyGroup)
      : undefined;
    const legacyGroupOptions = legacyGroup
      ? this._config.areas_options?.[this._area]?.groups_options?.[legacyGroup]
      : undefined;
    const groupOptions = concreteGroupOptions || formerCombinedGroupOptions || legacyGroupOptions;
    const entityOrder = isUngrouped
      ? this._config.areas_options?.[this._area]?.entity_order || []
      : groupOptions?.order || [];

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

    if (isUngrouped) {
      this._saveUngroupedEntityOrder(order);
      this._handleEntityDragEnd();
      return;
    }

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
    const concrete = this._config!.areas_options?.[this._area!]?.groups_options?.[group];
    const formerCombined = group === 'cover_gates'
      ? this._config!.areas_options?.[this._area!]?.groups_options?.cover_shading
      : undefined;
    const legacyGroup = (AREA_STRATEGY_GROUPS as readonly string[]).includes(group)
      ? getLegacyAreaGroupKey(group as AreaStrategyGroup)
      : undefined;
    const legacy = legacyGroup
      ? this._config!.areas_options?.[this._area!]?.groups_options?.[legacyGroup]
      : undefined;
    const hidden = [...((concrete || formerCombined || legacy)?.hidden || [])];
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
    this._areaGroupOrderDirty = false;
    this._collapsedAreaEntityGroups = new Set(AREA_STRATEGY_GROUPS);
    this._emitSettingsPageContext();
    this._resetSettingsScrollPosition();
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

  private _renderSelectedEntities() {
    const favorites = this._config?.favorites || [];

    if (favorites.length === 0) {
      return html`
        <div class="no-favorites">
          <p>${this._t('favorites.empty')}</p>
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
                  title=${this._t('common.remove')}
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
    const selectedId = this._config?.settings?.weather_entity_id;
    const query = this._weatherSearchFilter.trim().toLocaleLowerCase(ddLocale(this.hass));
    const weatherEntities = Object.keys(this.hass?.states || {})
      .filter((entityId) => {
        if (!entityId.startsWith('weather.')) return false;
        const registry = this.hass?.entities?.[entityId] as any;
        return !registry?.hidden_by && !registry?.disabled_by;
      })
      .sort((left, right) => {
        const leftName = this.hass?.states[left]?.attributes?.friendly_name || left;
        const rightName = this.hass?.states[right]?.attributes?.friendly_name || right;
        return leftName.localeCompare(rightName, ddLocale(this.hass));
      });

    const filteredWeatherEntities = weatherEntities.filter((entityId) => {
      if (!query) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLocaleLowerCase(ddLocale(this.hass)).includes(query) ||
        entityId.toLocaleLowerCase(ddLocale(this.hass)).includes(query);
    });

    return html`
      <div class="entity-picker-modal" role="dialog" aria-modal="true">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t('settings.select_weather_title')}</h4>
            <button class="close-button" type="button" title=${this._t('common.close')} @click=${() => this._showWeatherPicker = false}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              aria-label=${this._t('settings.search_weather')}
              placeholder=${this._t('settings.search_weather')}
              .value=${this._weatherSearchFilter}
              @input=${(e: Event) => this._weatherSearchFilter = (e.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${filteredWeatherEntities.map((entityId) => {
              const state = this.hass?.states[entityId];
              const friendlyName = state?.attributes?.friendly_name || entityId;
              const selected = entityId === selectedId;
              return html`
                <button
                  class="entity-option ${selected ? 'selected' : ''}"
                  type="button"
                  @click=${() => this._selectWeatherEntity(entityId)}
                >
                  <ha-state-icon .stateObj=${state} class="entity-icon"></ha-state-icon>
                  <span class="entity-option-copy">
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </span>
                  ${selected ? html`<ha-icon class="entity-selected-icon" icon="mdi:check-circle"></ha-icon>` : nothing}
                </button>
              `;
            })}
            ${filteredWeatherEntities.length === 0 ? html`
              <div class="entity-picker-hint empty">${this._t('settings.no_entities_found')}</div>
            ` : nothing}
          </div>

          ${selectedId ? html`
            <div class="entity-picker-footer">
              <button class="dd-inline-text-button" type="button" @click=${this._clearWeatherEntity}>
                ${this._t('common.clear_selection')}
              </button>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderAlarmPicker() {
    const selectedId = this._config?.settings?.alarm_entity_id;
    const query = this._alarmSearchFilter.trim().toLocaleLowerCase(ddLocale(this.hass));
    const alarmEntities = Object.keys(this.hass?.states || {})
      .filter((entityId) => {
        if (!entityId.startsWith('alarm_control_panel.')) return false;
        const registry = this.hass?.entities?.[entityId] as any;
        return !registry?.hidden_by && !registry?.disabled_by;
      })
      .sort((left, right) => {
        const leftName = this.hass?.states[left]?.attributes?.friendly_name || left;
        const rightName = this.hass?.states[right]?.attributes?.friendly_name || right;
        return leftName.localeCompare(rightName, ddLocale(this.hass));
      });

    const filteredAlarmEntities = alarmEntities.filter((entityId) => {
      if (!query) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLocaleLowerCase(ddLocale(this.hass)).includes(query) ||
        entityId.toLocaleLowerCase(ddLocale(this.hass)).includes(query);
    });

    return html`
      <div class="entity-picker-modal" role="dialog" aria-modal="true">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t('settings.select_alarm_title')}</h4>
            <button class="close-button" type="button" title=${this._t('common.close')} @click=${() => this._showAlarmPicker = false}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              aria-label=${this._t('settings.search_alarm')}
              placeholder=${this._t('settings.search_alarm')}
              .value=${this._alarmSearchFilter}
              @input=${(e: Event) => this._alarmSearchFilter = (e.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${filteredAlarmEntities.map((entityId) => {
              const state = this.hass?.states[entityId];
              const friendlyName = state?.attributes?.friendly_name || entityId;
              const selected = entityId === selectedId;
              return html`
                <button
                  class="entity-option ${selected ? 'selected' : ''}"
                  type="button"
                  @click=${() => this._selectAlarmEntity(entityId)}
                >
                  <ha-state-icon .stateObj=${state} class="entity-icon"></ha-state-icon>
                  <span class="entity-option-copy">
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </span>
                  ${selected ? html`<ha-icon class="entity-selected-icon" icon="mdi:check-circle"></ha-icon>` : nothing}
                </button>
              `;
            })}
            ${filteredAlarmEntities.length === 0 ? html`
              <div class="entity-picker-hint empty">${this._t('settings.no_entities_found')}</div>
            ` : nothing}
          </div>

          ${selectedId ? html`
            <div class="entity-picker-footer">
              <button class="dd-inline-text-button" type="button" @click=${this._clearAlarmEntity}>
                ${this._t('common.clear_selection')}
              </button>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderEntityPicker() {
    const allEntities = Object.keys(this.hass?.states || {});
    const query = this._entitySearchFilter.trim().toLocaleLowerCase(ddLocale(this.hass));
    const filteredEntities = allEntities.filter(entityId => {
      if (!query) return true;
      const state = this.hass?.states[entityId];
      const friendlyName = state?.attributes?.friendly_name || entityId;
      return friendlyName.toLocaleLowerCase(ddLocale(this.hass)).includes(query) ||
             entityId.toLocaleLowerCase(ddLocale(this.hass)).includes(query);
    }).sort((left, right) => {
      const leftName = this.hass?.states[left]?.attributes?.friendly_name || left;
      const rightName = this.hass?.states[right]?.attributes?.friendly_name || right;
      return leftName.localeCompare(rightName, ddLocale(this.hass));
    });

    const favorites = this._config?.favorites || [];
    const availableEntities = filteredEntities.filter(entityId => !favorites.includes(entityId));
    const visibleEntities = query ? availableEntities : availableEntities.slice(0, 50);

    return html`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t('settings.select_entity_title')}</h4>
            <button
              class="close-button"
              title=${this._t('common.close')}
              @click=${() => this._showEntityPicker = false}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              placeholder=${this._t('settings.search')}
              aria-label=${this._t('settings.search')}
              .value=${this._entitySearchFilter}
              @input=${(e: Event) => this._entitySearchFilter = (e.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${repeat(
              visibleEntities,
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
            ${visibleEntities.length === 0 ? html`
              <div class="entity-picker-hint empty">${this._t('settings.no_entities_found')}</div>
            ` : nothing}
            ${!query && availableEntities.length > visibleEntities.length ? html`
              <div class="entity-picker-hint">
                ${this._t('settings.entity_picker_limited', {
                  count: visibleEntities.length,
                  total: availableEntities.length,
                })}
              </div>
            ` : nothing}
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

  private _clearWeatherEntity = (): void => {
    if (!this._config) return;
    const settings = { ...this._config.settings } as Record<string, any>;
    delete settings.weather_entity_id;
    this._fireConfigChanged({ ...this._config, settings });
    this._showWeatherPicker = false;
  };

  private _clearAlarmEntity = (): void => {
    if (!this._config) return;
    const settings = { ...this._config.settings } as Record<string, any>;
    delete settings.alarm_entity_id;
    settings.show_alarm = false;
    this._fireConfigChanged({ ...this._config, settings });
    this._showAlarmPicker = false;
  };

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

  private _toggleAlarmDisplay = (e: Event): void => {
    const target = e.target as any;
    const showAlarm = Boolean(target.checked);

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_alarm: showAlarm,
      },
    };

    this._fireConfigChanged(newConfig);
  };

  private _toggleMasterActionConfirmation(
    domain: MasterActionConfirmationDomain,
    event: Event
  ): void {
    const target = event.target as any;
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        master_action_confirmations: {
          ...this._config!.settings?.master_action_confirmations,
          [domain]: Boolean(target.checked),
        },
      },
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

  private _toggleHideAreaNameInEntityNames(e: Event): void {
    const target = e.target as any;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        hide_area_name_in_entity_names: Boolean(target.checked)
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleHideUnavailableAreaEntities(e: Event): void {
    const target = e.target as any;
    const hideUnavailable = target.checked;

    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        hide_unavailable_entities: hideUnavailable
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
      return html`<p>${this._t('settings.no_persons')}</p>`;
    }

    const personEntities = Object.keys(this.hass.states)
      .filter(entityId => entityId.startsWith('person.'))
      .map(entityId => {
        const state = this.hass!.states[entityId];
        return {
          entity_id: entityId,
          state,
          friendly_name: state?.attributes?.friendly_name || entityId,
          picture: state?.attributes?.entity_picture as string | undefined,
        };
      })
      .sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));

    if (personEntities.length === 0) {
      return html`
        <div class="no-persons">
          <p>${this._t('settings.no_person_entities')}</p>
          <p style="font-size: 12px; color: var(--secondary-text-color);">
            ${this._t('settings.add_person_entities_hint')}
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
                <span class="person-avatar">
                  ${person.picture
                    ? html`<img src=${person.picture} alt="" loading="lazy" />`
                    : html`<ha-icon icon="mdi:account" class="person-icon"></ha-icon>`}
                </span>
                <span class="person-name">${person.friendly_name}</span>
                ${this._renderVisibilityButton(
                  !isHidden,
                  false,
                  isHidden ? this._t('common.show') : this._t('common.hide'),
                  () => this._togglePersonVisibility(person.entity_id)
                )}
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

    this._config = {
      ...this._config,
      ...config
    };

    // Only save essential configuration, not live data
    const cleanConfig = {
      type: "custom:dwains-dashboard-next",
      areas_display: config.areas_display || {},
      floors_display: config.floors_display || {},
      areas_options: config.areas_options || {},
      blueprint_replacements: config.blueprint_replacements || {},
      device_admission: config.device_admission || {},
      favorites: config.favorites || [],
      pages: config.pages || [],
      home_custom_cards: config.home_custom_cards || [],
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

      .dd-native-editor-subpage-back {
        display: flex;
        align-items: center;
        min-height: 30px;
        max-width: 1060px;
        margin: 0 auto 6px;
        padding: 0 12px;
        box-sizing: border-box;
      }
      .dd-native-back-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
        -webkit-tap-highlight-color: transparent;
      }
      .dd-native-back-button ha-icon { --mdc-icon-size: 16px; }
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
        max-width: 1060px;
        margin: 0 auto 12px;
      }

      .settings-nav-section h3 {
        min-height: 30px;
        margin: 0 0 6px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        color: var(--secondary-text-color);
        font-size: 12px;
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
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px 10px;
        border-radius: 999px;
        color: var(--secondary-text-color);
        background: color-mix(in srgb, var(--secondary-text-color) 7%, transparent);
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
        max-width: 1060px;
        margin: 0 auto;
      }

      .empty-settings-card {
        margin: 0;
        padding: 16px;
        display: grid;
        gap: 5px;
        border: 1px dashed var(--divider-color);
        border-radius: 10px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        text-align: left;
      }

      .empty-settings-card strong {
        color: var(--primary-text-color);
        font-size: 13px;
      }

      .empty-settings-card span {
        font-size: 12px;
        line-height: 1.4;
      }

      .dashboard-settings {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 0;
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

      .home-section-item.has-detail,
      .home-info-card-item.has-detail {
        cursor: pointer;
      }

      .home-section-item.has-detail:hover,
      .home-info-card-item.has-detail:hover {
        border-color: color-mix(in srgb, var(--primary-color) 48%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color));
      }

      .home-section-detail-chevron {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
        color: var(--secondary-text-color);
      }

      .home-section-item > .home-section-detail-chevron {
        margin-left: -2px;
      }

      .home-info-card-actions {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .home-info-card-section {
        display: grid;
        gap: 10px;
      }

      .home-information-card-settings,
      .home-climate-area-settings {
        padding: 0 16px 16px;
      }

      .home-camera-settings-section {
        padding: 0 16px 16px;
      }

      .home-custom-card-settings-section {
        padding: 0 16px 16px;
      }

      .home-custom-card-settings-list {
        display: grid;
        gap: 8px;
      }

      .home-custom-card-add {
        min-height: 36px;
        padding: 8px 12px;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-weight: 800;
        cursor: pointer;
      }

      .home-custom-card-add ha-icon {
        --mdc-icon-size: 18px;
      }

      .home-custom-card-settings-item .home-section-actions {
        align-items: center;
      }

      .home-camera-settings-list {
        display: grid;
        gap: 8px;
      }

      .home-camera-settings-empty {
        padding: 18px;
        border: 1px dashed var(--divider-color);
        border-radius: 10px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        text-align: center;
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
        opacity: 0.28;
        transform: none;
      }

      .home-section-item.drag-over {
        background: color-mix(in srgb, var(--primary-color) 4%, transparent);
      }

      .home-section-list.dragging .dd-home-section-block {
        transition: transform 0.14s ease, opacity 0.14s ease;
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
        display: block;
      }

      .home-section-copy .home-section-title,
      .home-section-copy .home-section-description {
        display: block;
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

      .home-section-item.has-detail {
        grid-template-columns: 32px 42px minmax(0, 1fr) 20px auto;
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

      .home-layout-reset:disabled {
        color: var(--disabled-text-color, var(--secondary-text-color));
        background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
        cursor: default;
        opacity: 0.55;
      }

      .area-apply-type-order:not(:disabled) {
        color: var(--primary-color);
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

      .area-entity-section {
        position: relative;
        border-radius: 8px;
        transition: opacity 0.16s ease, outline-color 0.16s ease, background-color 0.16s ease;
      }

      .area-entity-section.dragging {
        opacity: 0.46;
      }

      .area-entity-section.drag-over {
        outline: 2px solid var(--primary-color);
        outline-offset: 3px;
        background: color-mix(in srgb, var(--primary-color) 5%, transparent);
      }

      .area-entity-section-card {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
      }

      .area-entity-section-header {
        position: relative;
        width: 100%;
        min-width: 0;
        min-height: 58px;
        display: grid;
        grid-template-columns: 36px 34px minmax(0, 1fr) 44px;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 8px;
        box-sizing: border-box;
        cursor: pointer;
      }

      .area-entity-section-card .sortable-container {
        padding-top: 8px;
        border-top: 1px solid var(--divider-color);
      }

      .area-entity-section-icon {
        color: var(--primary-color);
        --mdc-icon-size: 22px;
      }

      .area-entity-section-title {
        min-width: 0;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-entity-section-handle {
        width: 36px;
        height: 36px;
        padding: 0;
        display: inline-grid;
        place-items: center;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: grab;
        touch-action: none;
      }

      .area-entity-section-handle:active {
        cursor: grabbing;
      }

      .area-entity-section-handle ha-svg-icon {
        width: 20px;
        height: 20px;
      }

      .area-entity-section-chevron {
        bottom: 0;
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

      .area-order-settings {
        margin: 0 16px 16px;
        padding: 16px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .area-order-heading {
        display: grid;
        gap: 4px;
        margin-bottom: 12px;
      }

      .area-order-heading strong {
        font-size: 15px;
      }

      .area-order-heading span,
      .area-order-mode small,
      .area-order-hint {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .area-order-modes {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .area-order-mode {
        min-width: 0;
        min-height: 72px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .area-order-mode:hover {
        border-color: var(--primary-color);
      }

      .area-order-mode.selected {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 3px 0 0 var(--primary-color);
      }

      .area-order-mode ha-icon {
        flex: 0 0 auto;
        color: var(--primary-color);
      }

      .area-order-mode span {
        min-width: 0;
        display: grid;
        gap: 3px;
      }

      .area-order-mode strong {
        font-size: 13px;
      }

      .area-order-hint {
        margin: 12px 0 0;
      }

      .area-entity-layout-settings {
        margin: 0 16px 16px;
        padding: 16px;
        display: grid;
        gap: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .area-entity-layout-copy {
        display: grid;
        gap: 4px;
      }

      .area-entity-layout-copy strong {
        font-size: 15px;
      }

      .area-entity-layout-copy span,
      .entity-name small {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .area-entity-layout-settings .area-order-modes {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .entity-name small {
        display: block;
        font-weight: 400;
      }

      .entity-order-buttons {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
      }

      @media (max-width: 700px) {
        .area-order-modes {
          grid-template-columns: 1fr;
        }

        .area-entity-layout-settings .area-order-modes {
          grid-template-columns: 1fr;
        }

        .area-order-mode {
          min-height: 0;
        }

        .entity-order-buttons ha-icon-button {
          width: 36px;
          height: 36px;
        }
      }

      .sortable-container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 16px 16px 16px;
      }

      .area-custom-cards-settings {
        margin: 0 16px 16px;
        padding: 14px;
        display: grid;
        gap: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .area-custom-card-placement {
        overflow: hidden;
        border: 1px dashed color-mix(in srgb, var(--primary-color) 35%, var(--divider-color));
        border-radius: 8px;
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color));
      }

      .area-custom-card-placement.drag-over,
      .area-custom-card-drop-zone.drag-over {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      }

      .area-custom-card-placement-title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        color: var(--primary-text-color);
        font-size: 13px;
        font-weight: 600;
      }

      .area-custom-card-placement-title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }

      .area-custom-card-list {
        padding: 0 8px 8px;
      }

      .area-custom-card-empty {
        padding: 10px 12px;
        color: var(--secondary-text-color);
        font-size: 12px;
      }

      .custom-card-item {
        border: 1px solid color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 6%, var(--card-background-color));
        cursor: grab;
      }

      .custom-card-item:active {
        cursor: grabbing;
      }

      .custom-card-icon {
        width: 36px;
        height: 36px;
        margin-right: 12px;
        display: grid;
        place-items: center;
        flex: 0 0 36px;
        border-radius: 6px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color));
      }

      .custom-card-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .custom-card-badge {
        flex: 0 0 auto;
        padding: 4px 8px;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font-size: 11px;
        font-weight: 600;
      }

      .area-custom-card-drop-zone {
        min-height: 38px;
        margin: 4px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px dashed var(--divider-color);
        border-radius: 6px;
        color: var(--secondary-text-color);
        font-size: 12px;
      }

      .area-custom-card-drop-zone ha-icon {
        --mdc-icon-size: 18px;
      }

      .sortable-item {
        position: relative;
        background: var(--card-background-color);
        border-radius: 4px;
        box-shadow: var(--card-box-shadow, none);
        transition: all 0.2s ease;
        user-select: none;
        cursor: default;
      }

      .sortable-container.is-custom-order .sortable-item {
        cursor: grab;
      }

      .sortable-container.is-custom-order .sortable-item:active {
        cursor: grabbing;
      }

      .handle.disabled {
        opacity: 0.25;
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
        padding: 10px 12px;
        min-height: 52px;
        box-sizing: border-box;
      }

      .area-detail-editor .sortable-item {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .area-detail-editor .entity-item .dd-visibility-button {
        width: 34px;
        height: 34px;
        margin-left: auto;
        flex: 0 0 auto;
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
      .master-confirmation-section,
      .entity-display-section,
      .replacement-section {
        padding: 0 16px 16px 16px;
      }

      .master-confirmation-section {
        display: grid;
        gap: 12px;
      }

      .master-confirmation-note {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px;
        border-radius: 8px;
        color: var(--secondary-text-color);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--secondary-background-color));
        font-size: 13px;
        line-height: 1.45;
      }

      .master-confirmation-note ha-icon {
        flex: 0 0 auto;
        color: var(--primary-color);
        --mdc-icon-size: 20px;
      }

      .master-confirmation-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }

      .master-confirmation-row {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        min-height: 62px;
        padding: 10px 12px;
        cursor: pointer;
      }

      .master-confirmation-row + .master-confirmation-row {
        border-top: 1px solid var(--divider-color);
      }

      .master-confirmation-row:hover {
        background: color-mix(in srgb, var(--primary-color) 4%, transparent);
      }

      .master-confirmation-icon {
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: var(--master-confirmation-color);
        background: color-mix(in srgb, var(--master-confirmation-color) 12%, transparent);
      }

      .master-confirmation-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .master-confirmation-copy {
        min-width: 0;
        display: grid;
        gap: 3px;
      }

      .master-confirmation-copy strong {
        color: var(--primary-text-color);
        font-size: 14px;
        line-height: 1.3;
      }

      .master-confirmation-copy small {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .master-confirmation-control {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .master-confirmation-control > span {
        max-width: 130px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        text-align: right;
      }

      @media (max-width: 600px) {
        .master-confirmation-section {
          padding-inline: 10px;
        }

        .master-confirmation-row {
          grid-template-columns: 38px minmax(0, 1fr) auto;
          gap: 10px;
          padding-inline: 10px;
        }

        .master-confirmation-icon {
          width: 38px;
          height: 38px;
        }

        .master-confirmation-control > span {
          display: none;
        }
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
        color: var(--secondary-text-color);
        background: color-mix(in srgb, var(--secondary-text-color) 7%, transparent);
        font-size: 12px;
        font-weight: 700;
      }

      .device-types-grid {
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .device-type-option {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        min-height: 60px;
        padding: 8px 12px;
        border: 0;
        border-radius: 0;
        background: transparent;
        transition: opacity 0.16s ease, background 0.16s ease;
      }

      .device-type-option + .device-type-option {
        border-top: 1px solid var(--divider-color);
      }

      .device-type-option.enabled {
        border-color: var(--divider-color);
      }

      .device-type-option.disabled {
        opacity: 0.58;
        background: color-mix(in srgb, var(--card-background-color) 78%, var(--secondary-background-color));
      }

      .device-type-icon {
        width: 42px;
        height: 42px;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--device-type-color);
        background: transparent;
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

      .entity-search-input {
        width: 100%;
        min-height: 44px;
        box-sizing: border-box;
        padding: 0 14px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        outline: none;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
      }

      .entity-search-input:focus {
        border-color: var(--primary-color);
      }

      .entity-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .entity-picker-hint {
        padding: 10px 14px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .entity-picker-hint.empty {
        text-align: center;
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
        padding: 0;
      }

      .persons-list {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .person-item {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 60px;
        padding: 8px 12px;
        background: transparent;
        border-radius: 0;
        border: 0;
        transition: background 0.2s ease, opacity 0.2s ease;
      }

      .person-item + .person-item {
        border-top: 1px solid var(--divider-color);
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

      /* Integrated settings UI: single authoritative layout */
      .dd-flat-settings {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        scroll-padding-top: 96px;
      }

      .settings-detail-content,
      .home-section-item,
      .dd-flat-subitem-row {
        scroll-margin-top: 96px;
      }

      .dd-flat-settings .settings-nav-section,
      .dd-flat-settings .settings-detail-content,
      .dd-settings-version-footer,
      .dd-subpage-header {
        max-width: 1060px;
        margin-inline: auto;
      }

      .dd-settings-overview .settings-nav-section:first-of-type {
        margin-top: 0;
      }

      .dd-settings-version-footer {
        margin-top: 22px;
        padding-top: 14px;
        border-top: 0;
        color: var(--secondary-text-color);
        font-size: 11px;
        text-align: center;
      }

      .dd-settings-version-footer::before {
        content: "";
        display: block;
        width: 28px;
        height: 1px;
        margin: 0 auto 10px;
        background: var(--divider-color);
      }

      .dd-subpage-header {
        height: 42px;
        min-height: 42px;
        margin-top: 0;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0;
        box-sizing: border-box;
        border: 0;
        border-radius: 0;
        background: transparent;
      }

      .dd-subpage-back {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        display: inline-grid;
        place-items: center;
        border: 0;
        border-radius: 999px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, transparent);
        cursor: pointer;
      }

      .dd-subpage-back ha-icon {
        --mdc-icon-size: 20px;
      }

      .dd-subpage-title {
        min-width: 0;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 17px;
        font-weight: 800;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dd-settings-page-description {
        max-width: 760px;
        margin: 0 0 14px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.45;
      }

      .dd-settings-section {
        min-width: 0;
        margin-bottom: 10px;
      }

      .dd-settings-section:not(.page-root) {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-settings-section-header {
        min-height: 60px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        box-sizing: border-box;
      }

      .dd-settings-section-icon,
      .dd-setting-row-icon {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        color: var(--primary-color);
      }

      .dd-settings-section-icon ha-icon {
        --mdc-icon-size: 23px;
      }

      .dd-settings-section-copy,
      .dd-setting-row-copy {
        min-width: 0;
        display: grid;
        gap: 3px;
      }

      .dd-settings-section-copy strong,
      .dd-setting-row-copy strong {
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.25;
      }

      .dd-settings-section-copy small,
      .dd-setting-row-copy small {
        max-width: 720px;
        color: var(--secondary-text-color);
        font-size: 11px;
        line-height: 1.4;
        font-weight: 400;
      }

      .dd-settings-section:not(.page-root) > .dd-settings-section-content {
        border-top: 1px solid var(--divider-color);
      }

      .dd-settings-section.page-root > .dd-settings-section-content {
        min-width: 0;
      }

      .dd-settings-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-settings-section:not(.page-root) .dd-settings-list {
        border: 0;
        border-radius: 0;
      }

      .dd-settings-list-spaced {
        margin-bottom: 18px;
      }

      .dd-setting-row {
        min-height: 60px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        box-sizing: border-box;
        cursor: default;
      }

      .dd-setting-row + .dd-setting-row {
        border-top: 1px solid var(--divider-color);
      }

      .dd-setting-row-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .dd-setting-row ha-switch {
        justify-self: end;
      }

      .dd-home-layout-panel,
      .dd-inline-section {
        min-width: 0;
      }

      .dd-home-page-description,
      .dd-inline-description {
        margin: 0;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
        font-weight: 400;
      }

      .dd-home-page-description {
        margin-bottom: 14px;
      }

      .dd-home-flat-layout {
        padding-top: 0;
      }

      .dd-home-flat-layout.home-layout-section {
        padding-inline: 0;
      }

      .dd-home-section-block {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-home-section-block.open {
        background: color-mix(in srgb, var(--primary-color) 1.5%, var(--card-background-color));
      }

      .dd-home-section-block > .home-section-item {
        position: relative;
        min-height: 54px;
        grid-template-columns: 22px 40px minmax(0, 1fr) 44px;
        gap: 6px;
        padding: 5px 12px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      .dd-home-section-block.open > .home-section-item::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: var(--divider-color);
        pointer-events: none;
      }

      .dd-home-flat-layout .home-section-icon,
      .dd-flat-sublist .home-section-icon,
      .dd-climate-area-settings .home-section-icon {
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      .dd-home-flat-layout .home-section-icon {
        width: 40px;
        height: 40px;
      }

      .dd-home-flat-layout .home-section-icon ha-icon {
        --mdc-icon-size: 23px;
      }

      .dd-home-flat-layout .home-section-item.disabled .home-section-icon,
      .dd-flat-sublist .home-info-card-item.disabled .home-section-icon,
      .dd-climate-area-settings .home-info-card-item.disabled .home-section-icon {
        background: transparent;
      }

      .dd-home-flat-layout .home-section-toggle,
      .dd-flat-sublist .home-section-toggle {
        border: 1px solid color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
        border-radius: 999px;
        background: transparent;
        box-shadow: none;
      }

      .dd-home-flat-layout .home-section-toggle.enabled,
      .dd-flat-sublist .home-section-toggle.enabled {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 5%, transparent);
      }

      .dd-home-section-block .home-section-description {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dd-home-section-block .home-section-actions,
      .home-info-card-actions {
        display: grid;
        grid-template-columns: 44px;
        align-items: center;
        justify-content: end;
        justify-items: center;
        justify-self: end;
        width: 44px;
        margin: 0;
      }

      .dd-icon-action {
        display: inline-grid;
        place-items: center;
        border: 0;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: pointer;
      }

      .dd-icon-action ha-icon {
        --mdc-icon-size: 19px;
      }

      .dd-integrated-chevron {
        position: absolute;
        left: 50%;
        bottom: 0;
        z-index: 1;
        width: 30px;
        height: 15px;
        display: grid;
        place-items: center;
        margin: 0;
        padding: 0;
        transform: translateX(-50%);
        border: 0;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: pointer;
      }

      .dd-home-section-block.open > .home-section-item .dd-integrated-chevron,
      .dd-flat-subitem.open > .dd-flat-subitem-row .dd-integrated-chevron {
        color: var(--primary-color);
        background: transparent;
      }

      .dd-integrated-chevron ha-icon {
        width: 14px;
        height: 14px;
        --mdc-icon-size: 14px;
      }

      .dd-home-inline-detail {
        margin-left: 72px;
        padding: 5px 0 8px 10px;
        border-left: 1px solid color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .dd-flat-subdetail {
        margin-left: 18px;
        padding: 3px 0 0 10px;
        border-left: 1px solid color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .dd-home-house-information .dd-inline-section {
        padding-bottom: 0;
      }

      .dd-flat-sublist,
      .dd-climate-area-settings .home-info-card-list {
        display: grid;
        gap: 0;
        overflow: hidden;
        border-top: 0;
      }

      .dd-home-house-information .dd-flat-sublist {
        overflow: visible;
      }

      .dd-flat-subitem + .dd-flat-subitem,
      .dd-flat-subitem-row + .dd-flat-subitem-row {
        border-top: 1px solid var(--divider-color);
      }

      .dd-flat-subitem.open > .dd-flat-subitem-row {
        border-bottom: 0;
      }

      .dd-flat-subitem.open > .dd-flat-subitem-row::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: var(--divider-color);
        pointer-events: none;
      }

      .dd-flat-subitem-row {
        position: relative;
        min-height: 50px;
        display: grid;
        grid-template-columns: 36px minmax(0, 1fr) 48px;
        align-items: center;
        gap: 9px;
        padding: 6px 12px 6px 0;
        box-sizing: border-box;
      }

      .dd-flat-subitem-row.has-detail {
        cursor: pointer;
      }

      .dd-draggable-subitem {
        grid-template-columns: 22px 40px minmax(0, 1fr) 48px;
        cursor: grab;
      }

      .dd-flat-subitem-row .home-section-icon {
        width: 36px;
        height: 36px;
      }

      .dd-inline-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2px;
        white-space: nowrap;
      }

      .dd-icon-action {
        width: 32px;
        height: 32px;
        border-radius: 999px;
      }

      .dd-climate-area-settings {
        padding: 0;
      }

      .dd-climate-area-settings .home-info-card-item {
        min-height: 0;
        display: grid;
        grid-template-columns: 32px minmax(0, 1fr) 48px;
        align-items: center;
        gap: 10px;
        margin: 0;
        padding: 4px 12px 4px 8px;
        border: 0;
        border-bottom: 1px solid var(--divider-color);
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      .dd-climate-area-settings .home-info-card-item:last-child {
        border-bottom: 0;
      }

      .dd-climate-area-settings .home-section-icon {
        width: 32px;
        height: 32px;
      }

      .dd-climate-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: end;
        width: 48px;
      }

      .dd-climate-actions ha-switch {
        transform: scale(.9);
        transform-origin: center;
      }

      .dd-favorite-suggestions-row ha-switch {
        transform: scale(.9);
        transform-origin: right center;
      }

      .dd-climate-description {
        padding: 6px 8px;
      }

      .dd-inline-action-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        margin: 0;
        padding: 8px 8px;
      }

      .home-custom-card-add {
        width: auto;
        min-height: 34px;
        padding: 7px 12px;
      }

      .dd-empty-state,
      .no-favorites {
        margin: 8px 0 2px;
        padding: 14px 10px;
        border: 0;
        border-radius: 0;
        background: transparent;
        color: var(--secondary-text-color);
        text-align: center;
        font-size: 12px;
        line-height: 1.45;
      }

      .dd-favorites-inline {
        display: grid;
        gap: 16px;
        padding: 0;
      }

      .dd-favorites-options-card,
      .dd-favorites-list-card {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-favorites-options-card .dd-setting-row {
        min-height: 64px;
        margin: 0;
        border: 0;
        border-radius: 0;
      }

      .dd-favorites-options-card .dd-setting-row-icon {
        color: var(--primary-color);
      }

      .dd-favorites-picker {
        padding: 0;
      }

      .dd-favorites-list-card .dd-inline-action-row {
        padding: 10px 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .dd-favorites-list-head {
        justify-content: space-between;
      }

      .dd-favorites-list-head > strong {
        color: var(--primary-text-color);
        font-family: var(--ha-font-family-body, inherit);
        font-size: 15px;
        font-weight: 700;
        line-height: 1.25;
      }

      .dd-favorites-list-card .selected-entities {
        padding: 10px 12px 12px;
      }

      .dd-favorites-list-card .no-favorites {
        margin: 0;
        padding: 18px 12px;
      }

      @media (min-width: 701px) {
        .dd-flat-settings {
          padding-top: 8px;
        }

        .dd-flat-settings:not(.dd-settings-overview) .settings-detail-content {
          width: 100%;
          margin-top: 0;
        }
      }

      @media (max-width: 700px) {
        .dd-flat-settings {
          padding-inline: 10px;
        }

        .dd-flat-settings .settings-nav-section,
        .dd-flat-settings .settings-detail-content,
        .dd-subpage-header,
        .dd-settings-version-footer {
          max-width: none;
        }

        .dd-subpage-header {
          margin-bottom: 10px;
        }
      }

      @media (max-width: 600px) {
        .dd-settings-page-description {
          margin-bottom: 10px;
        }

        .dd-settings-section-header,
        .dd-setting-row {
          grid-template-columns: 36px minmax(0, 1fr) auto;
          padding-inline: 8px;
        }

        .dd-settings-section-icon,
        .dd-setting-row-icon {
          width: 36px;
          height: 36px;
        }

        .dd-home-page-description {
          margin-bottom: 10px;
        }

        .dd-home-flat-layout.home-layout-section {
          padding-inline: 0;
        }

        .dd-home-flat-layout .home-section-list {
          width: 100%;
        }

        .dd-home-section-block > .home-section-item,
        .dd-home-section-block > .home-section-item.has-detail {
          grid-template-columns: 18px 40px minmax(0, 1fr) 40px;
          gap: 6px;
          padding: 7px 8px;
        }

        .dd-home-section-block .home-section-icon {
          width: 40px;
          height: 40px;
        }

        .dd-home-section-block .home-section-icon ha-icon {
          --mdc-icon-size: 23px;
        }

        .dd-home-section-block .home-section-actions {
          grid-template-columns: 40px;
          width: 40px;
          justify-self: end;
        }

        .home-info-card-actions {
          grid-template-columns: 40px;
          width: 40px;
          justify-self: end;
        }

        .dd-integrated-chevron {
          height: 14px;
        }

        .dd-home-section-block .home-section-title {
          font-size: 14px;
        }

        .dd-home-section-block .home-section-description {
          font-size: 11px;
          line-height: 1.3;
        }

        .dd-home-inline-detail {
          margin-left: 52px;
          padding: 4px 0 6px 10px;
        }

        .dd-flat-subdetail {
          margin-left: 18px;
          padding: 2px 0 0 10px;
        }

        .dd-flat-subitem-row {
          grid-template-columns: 36px minmax(0, 1fr) 40px;
          gap: 8px;
          padding: 6px 8px 6px 0;
        }

        .dd-draggable-subitem {
          grid-template-columns: 20px 36px minmax(0, 1fr) 40px;
        }

        .dd-flat-subitem-row .home-section-icon {
          width: 36px;
          height: 36px;
        }

        .dd-flat-subitem-row .home-section-toggle {
          width: 36px;
          height: 36px;
        }

        .dd-climate-area-settings .home-info-card-item {
          grid-template-columns: 30px minmax(0, 1fr) 48px;
          padding: 4px 10px 4px 8px;
        }

        .dd-climate-area-settings .home-section-icon {
          width: 30px;
          height: 30px;
        }

        .dd-inline-action-row {
          padding-right: 8px;
        }

        .dd-settings-version-footer {
          margin-top: 18px;
          font-size: 10px;
        }
      }


      /* Settings consistency pass */
      .settings-nav-section {
        margin-bottom: 14px;
      }

      .settings-nav-section h3 {
        min-height: 34px;
        margin: 0 0 6px;
        padding: 0 4px;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 700;
      }

      .settings-nav-item {
        min-height: 70px;
        grid-template-columns: 36px minmax(0, 1fr) auto 24px;
        gap: 12px;
        padding: 10px 14px;
      }

      .settings-nav-icon {
        width: 36px;
        height: 36px;
        border-radius: 0;
        color: var(--settings-item-color);
        background: transparent;
      }

      .settings-nav-icon ha-icon,
      .settings-nav-icon svg,
      .settings-nav-gradient-icon {
        width: 25px;
        height: 25px;
        fill: currentColor;
        --mdc-icon-size: 25px;
      }

      .settings-nav-icon.support-gradient {
        color: inherit;
      }

      .settings-nav-gradient-icon {
        overflow: visible;
      }

      .dd-header-status-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-header-status-list > .dd-setting-row,
      .dd-header-feature-row {
        min-height: 60px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        box-sizing: border-box;
      }

      .dd-header-status-list > .dd-setting-row {
        border: 0;
        border-radius: 0;
      }

      .dd-header-status-list > .dd-setting-row + .dd-setting-row,
      .dd-header-feature {
        border-top: 1px solid var(--divider-color);
      }

      .dd-header-feature-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        white-space: nowrap;
      }

      .dd-header-status-settings {
        display: grid;
        gap: 16px;
      }

      .dd-status-people-card {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-status-people-card .dd-status-people-heading {
        min-height: 60px;
      }

      .dd-status-people-card .dd-status-people-list {
        padding: 12px;
        border-top: 1px solid var(--divider-color);
      }

      .dd-status-people-card .persons-list {
        border: 0;
        border-radius: 0;
      }

      .dd-now-playing-settings {
        margin: 0;
        padding: 0 12px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      }

      .dd-now-playing-settings .dd-now-playing-heading {
        min-height: 68px;
        padding-inline: 0;
      }

      .dd-now-playing-icon {
        color: var(--primary-color) !important;
      }

      .dd-now-playing-segments {
        width: 100%;
        margin: 0;
      }

      .dd-now-playing-segments .area-sort-segment {
        min-height: 48px;
      }

      .dd-now-playing-segments .area-sort-segment ha-icon {
        --mdc-icon-size: 19px;
      }

      .dd-inline-text-button,
      .dd-icon-text-button {
        min-height: 32px;
        padding: 0 8px;
        border: 0;
        border-radius: 8px;
        color: var(--primary-color);
        background: transparent;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .dd-inline-text-button:hover,
      .dd-icon-text-button:hover {
        background: color-mix(in srgb, var(--primary-color) 7%, transparent);
      }

      .dd-settings-inline-link {
        display: inline;
        width: auto;
        margin: 0 0 0 4px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--primary-color);
        font: inherit;
        font-size: inherit;
        font-weight: 650;
        line-height: inherit;
        vertical-align: baseline;
        cursor: pointer;
      }

      .dd-settings-inline-link:hover {
        text-decoration: underline;
      }

      .dd-setting-row-with-link {
        cursor: default;
      }

      .dd-icon-text-button {
        width: 32px;
        padding: 0;
        display: inline-grid;
        place-items: center;
      }

      .dd-icon-text-button.danger {
        color: var(--error-color, #f44336);
        border: 1px solid color-mix(in srgb, var(--error-color, #f44336) 28%, var(--divider-color));
        background: color-mix(in srgb, var(--error-color, #f44336) 6%, var(--card-background-color));
      }

      .dd-icon-text-button.danger:hover {
        background: color-mix(in srgb, var(--error-color, #f44336) 11%, var(--card-background-color));
      }

      .dd-icon-text-button ha-icon {
        --mdc-icon-size: 18px;
      }

      .master-confirmation-section.dd-simple-settings-stack {
        gap: 8px;
        padding: 0;
      }

      .master-confirmation-note {
        padding: 4px 2px 8px;
        border-radius: 0;
        color: var(--secondary-text-color);
        background: transparent;
        font-size: 12px;
      }

      .master-confirmation-note ha-icon {
        color: #0f9f8f;
        --mdc-icon-size: 18px;
      }

      .master-confirmation-list {
        border-radius: 12px;
      }

      .master-confirmation-row {
        grid-template-columns: 40px minmax(0, 1fr) auto;
        gap: 8px;
        min-height: 60px;
        padding: 8px 12px;
      }

      .master-confirmation-icon {
        width: 40px;
        height: 40px;
        border-radius: 0;
        color: #0f9f8f;
        background: transparent;
      }

      .master-confirmation-control {
        gap: 0;
      }

      .master-confirmation-control > span {
        display: none;
      }

      .entity-display-section {
        padding: 0;
      }

      .entity-display-section > .dd-settings-list-spaced {
        margin-bottom: 16px;
      }

      .area-order-settings {
        width: 100%;
        margin: 0 0 16px;
        padding: 14px;
        box-sizing: border-box;
        border-radius: 12px;
      }

      .area-order-settings .area-order-list-hint {
        margin: 12px 0 0;
      }

      .area-order-settings .area-settings-sortable {
        margin-top: 12px;
      }

      .area-settings-sortable {
        padding: 0;
        gap: 8px;
      }

      .area-settings-sortable .dd-area-sortable-row {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
        box-shadow: none;
      }

      .area-settings-sortable .dd-area-sortable-row .area-item {
        min-height: 62px;
        padding: 8px 12px;
        box-sizing: border-box;
      }

      .area-settings-sortable .sortable-item.dragging {
        opacity: 0.28;
        transform: none;
      }

      .area-settings-sortable .sortable-item.drag-over::before {
        display: none;
      }

      .area-settings-sortable .sortable-item.drag-over {
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color));
      }

      .area-settings-sortable .handle {
        margin-right: 0;
        padding: 6px 2px;
        background: transparent;
      }

      .area-detail-editor .area-entity-section-header {
        cursor: grab;
      }

      .area-detail-editor .area-entity-section-header:active {
        cursor: grabbing;
      }

      .area-detail-editor .area-entity-section-handle {
        cursor: inherit;
      }

      .area-settings-sortable .area-icon {
        width: 40px;
        margin-right: 6px;
        color: var(--primary-color);
        --mdc-icon-size: 22px;
      }

      .device-visibility-section {
        margin-top: 20px;
        display: grid;
        gap: 10px;
      }

      .device-admission-groups {
        display: grid;
        gap: 8px;
      }

      .device-type-panel {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
        content-visibility: auto;
        contain-intrinsic-size: auto 70px;
      }

      .device-type-panel.open {
        background: color-mix(in srgb, var(--primary-color) 1.5%, var(--card-background-color));
      }

      .device-type-panel.disabled {
        opacity: 0.58;
      }

      .device-type-panel-row {
        position: relative;
        min-height: 62px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) 44px;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        box-sizing: border-box;
      }

      .device-type-panel-row.expandable {
        cursor: pointer;
      }

      .device-type-panel-row .device-type-icon.small {
        width: 40px;
        height: 40px;
        border-radius: 0;
        color: var(--primary-color);
        background: transparent;
      }

      .device-type-heading {
        min-width: 0;
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .device-type-heading strong {
        min-width: 0;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-type-heading small {
        flex: 0 0 auto;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
      }

      .dd-visibility-button {
        width: 40px;
        height: 40px;
        display: inline-grid;
        place-items: center;
        justify-self: end;
        padding: 0;
        border: 1px solid color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
        border-radius: 999px;
        color: var(--primary-color);
        background: transparent;
        cursor: pointer;
      }

      .dd-visibility-button.hidden {
        color: var(--secondary-text-color);
        border-color: var(--divider-color);
      }

      .dd-visibility-button.partial {
        border-style: dashed;
      }

      .dd-visibility-button ha-icon {
        --mdc-icon-size: 20px;
      }

      .device-type-chevron {
        left: 50%;
        bottom: -1px;
      }

      .device-type-panel.open > .device-type-panel-row {
        border-bottom: 1px solid var(--divider-color);
      }

      .device-admission-panel {
        display: grid;
        gap: 0;
        padding: 0;
      }

      .device-admission-area {
        display: grid;
        gap: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
      }

      .device-admission-area + .device-admission-area {
        border-top: 1px solid var(--divider-color);
      }

      .device-admission-area-header {
        min-height: 52px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 44px;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 6px 52px;
        box-sizing: border-box;
      }

      .device-admission-device-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0;
        padding: 0 12px 8px 52px;
      }

      .device-admission-device {
        min-height: 52px;
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) 44px;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border: 0;
        border-top: 1px solid var(--divider-color);
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      .device-admission-device .device-type-icon {
        width: 34px;
        height: 34px;
        color: var(--primary-color);
      }

      .device-admission-device.hidden {
        opacity: 0.52;
        background: transparent;
      }

      .device-admission-copy .device-type-count {
        margin-top: 2px;
      }

      ha-expansion-panel {
        border-radius: 12px;
        overflow: hidden;
      }

      @media (max-width: 700px) {
        .settings-nav-item {
          grid-template-columns: 32px minmax(0, 1fr) auto 20px;
          gap: 8px;
          padding-inline: 10px;
        }

        .settings-nav-icon {
          width: 32px;
          height: 32px;
        }

        .settings-nav-icon ha-icon,
        .settings-nav-icon svg,
        .settings-nav-gradient-icon {
          width: 22px;
          height: 22px;
          --mdc-icon-size: 22px;
        }

        .dd-header-status-list > .dd-setting-row,
        .dd-header-feature-row {
          grid-template-columns: 36px minmax(0, 1fr) auto;
          padding-inline: 8px;
        }

        .dd-header-feature-actions {
          gap: 4px;
        }

        .device-type-heading {
          flex-wrap: wrap;
          gap: 2px 8px;
        }

        .device-type-heading small {
          width: 100%;
        }

        .device-admission-area-header {
          padding-left: 12px;
        }

        .device-admission-device-list {
          padding-left: 12px;
        }
      }

      /* Final settings layout pass */
      .dd-flat-settings {
        max-width: 920px;
        margin-inline: auto;
      }

      .dd-flat-settings .settings-nav-section,
      .dd-flat-settings .settings-detail-content,
      .dd-flat-settings .dd-settings-version-footer {
        max-width: none;
        width: 100%;
      }

      .settings-nav-section h3 {
        min-height: 28px;
        margin: 0 0 7px;
        padding: 0 2px;
        font-size: 14px;
        font-weight: 750;
        color: var(--primary-text-color);
      }

      .settings-nav-section + .settings-nav-section {
        margin-top: 18px;
      }

      .area-sort-segmented {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--secondary-background-color);
      }

      .area-sort-segment,
      .area-detail-editor .area-entity-layout-settings .area-order-mode {
        min-width: 0;
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 8px 10px;
        border: 0;
        border-right: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        background: transparent;
        font: inherit;
        font-size: 12px;
        font-weight: 650;
        cursor: pointer;
        box-shadow: none;
      }

      .area-sort-segment:last-child {
        border-right: 0;
      }

      .area-sort-segment:hover,
      .area-detail-editor .area-entity-layout-settings .area-order-mode:hover {
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--primary-color) 4%, transparent);
      }

      .area-sort-segment.selected,
      .area-detail-editor .area-entity-layout-settings .area-order-mode.selected {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
      }

      .area-sort-segment ha-icon,
      .area-detail-editor .area-entity-layout-settings .area-order-mode ha-icon {
        color: currentColor;
        --mdc-icon-size: 18px;
      }

      .area-detail-editor .area-entity-layout-settings .area-order-mode strong {
        color: inherit;
        font-size: 12px;
        font-weight: 650;
      }

      .area-order-list-hint {
        margin: 0 2px 8px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .dd-integrated-chevron ha-icon {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 18px;
      }

      .dd-integrated-chevron {
        width: 34px;
        height: 18px;
      }

      .persons-list .person-item {
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) 44px;
        gap: 8px;
      }

      .persons-list .dd-visibility-button {
        justify-self: end;
      }

      .master-confirmation-control {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }

      .master-confirmation-control > span {
        display: block;
        min-width: 116px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        text-align: right;
      }

      .device-type-panel {
        --device-type-color: var(--primary-color);
      }

      .device-type-panel-row .device-type-icon.small,
      .device-type-panel .device-admission-device .device-type-icon {
        color: var(--device-type-color);
      }

      .device-type-panel .dd-visibility-button {
        color: var(--device-type-color);
        border-color: color-mix(in srgb, var(--device-type-color) 30%, var(--divider-color));
      }

      .device-type-panel .dd-visibility-button.hidden {
        color: var(--secondary-text-color);
        border-color: var(--divider-color);
      }

      .device-admission-device-list {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        padding: 0 12px 12px 52px;
      }

      .device-admission-device {
        min-width: 0;
        min-height: 62px;
        grid-template-columns: 32px minmax(0, 1fr) 38px;
        gap: 7px;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
      }

      .device-admission-device + .device-admission-device {
        border-top: 1px solid var(--divider-color);
      }

      .device-admission-device.hidden {
        background: color-mix(in srgb, var(--secondary-background-color) 70%, var(--card-background-color));
      }

      .device-admission-device .dd-visibility-button {
        width: 34px;
        height: 34px;
      }

      .device-admission-copy {
        min-width: 0;
      }

      .device-admission-copy .device-type-name {
        display: -webkit-box;
        overflow: hidden;
        white-space: normal;
        text-overflow: clip;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow-wrap: break-word;
        word-break: normal;
        font-size: 12px;
        font-weight: 650;
        line-height: 1.2;
      }

      .device-admission-copy .device-type-count {
        font-size: 10px;
      }

      .dd-replacement-settings {
        padding: 0;
        display: grid;
        gap: 12px;
      }

      .dd-replacement-list {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .dd-replacement-row {
        min-height: 62px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
      }

      .dd-replacement-row + .dd-replacement-row {
        border-top: 1px solid var(--divider-color);
      }

      .dd-replacement-row.disabled {
        opacity: 0.55;
      }

      .dd-replacement-domain-icon {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .dd-replacement-domain-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .dd-replacement-copy {
        min-width: 0;
        display: grid;
        gap: 3px;
      }

      .dd-replacement-copy strong {
        font-size: 14px;
      }

      .dd-replacement-copy small {
        overflow: hidden;
        color: var(--secondary-text-color);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dd-replacement-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      .dd-replacement-enabled {
        display: inline-flex;
        align-items: center;
        margin: 0;
      }

      .dd-replacement-empty {
        padding: 18px;
        border: 1px dashed var(--divider-color);
        border-radius: 12px;
        color: var(--secondary-text-color);
        font-size: 12px;
        text-align: center;
      }

      .dd-replacement-footer {
        display: flex;
        justify-content: flex-start;
      }

      .dd-replacement-footer ha-button ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 5px;
      }

      @media (max-width: 700px) {
        .dd-flat-settings {
          max-width: none;
        }

        .area-sort-segmented {
          grid-template-columns: 1fr;
        }

        .area-sort-segment {
          justify-content: center;
          text-align: center;
          border-right: 0;
          border-bottom: 1px solid var(--divider-color);
        }

        .area-sort-segment:last-child {
          border-bottom: 0;
        }

        .device-admission-device-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          padding-left: 12px;
        }

        .master-confirmation-control > span {
          min-width: 0;
          max-width: 110px;
        }

        .dd-replacement-row {
          grid-template-columns: 36px minmax(0, 1fr);
        }

        .dd-replacement-actions {
          grid-column: 2;
          justify-self: start;
        }
      }

      /* Settings correction pass */
      .dd-flat-settings {
        width: 100%;
        max-width: none;
        margin-inline: 0;
        padding: 24px 20px 20px;
        box-sizing: border-box;
      }

      @media (min-width: 701px) {
        .dd-flat-settings {
          padding-top: 24px;
        }

        .dd-flat-settings:not(.dd-settings-overview) .settings-detail-content {
          margin-top: 0;
        }
      }

      .dd-flat-settings .dd-setting-row-icon,
      .dd-flat-settings .dd-settings-section-icon {
        color: var(--primary-color);
      }

      .dd-flat-settings ha-switch {
        --switch-checked-color: var(--primary-color);
        --md-switch-selected-track-color: var(--primary-color);
        --md-switch-selected-focus-track-color: var(--primary-color);
        --md-switch-selected-hover-track-color: var(--primary-color);
        --md-switch-selected-pressed-track-color: var(--primary-color);
      }

      .dd-flat-settings .dd-visibility-button:not(.hidden) {
        color: var(--primary-color);
        border-color: color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
      }

      .dd-flat-settings .area-sort-segment.selected,
      .dd-flat-settings .area-order-mode.selected {
        color: var(--primary-color);
        border-color: color-mix(in srgb, var(--primary-color) 32%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color));
      }

      .device-type-panel-row > .device-type-icon.small {
        color: var(--device-type-color);
      }

      .device-type-panel .device-admission-device .device-type-icon {
        color: var(--secondary-text-color);
      }

      .device-type-panel .dd-visibility-button,
      .device-type-panel .dd-visibility-button.hidden {
        color: var(--device-type-color);
        border-color: color-mix(in srgb, var(--device-type-color) 30%, var(--divider-color));
      }

      .device-type-panel .dd-visibility-button.hidden {
        color: var(--secondary-text-color);
        border-color: var(--divider-color);
      }

      .device-type-panel-row .device-type-heading {
        flex-wrap: nowrap;
        gap: 8px;
      }

      .device-type-panel-row .device-type-heading small {
        width: auto;
      }

      .device-area-heading {
        display: grid;
        gap: 2px;
        align-items: center;
      }

      .device-area-heading small {
        width: 100%;
      }

      .device-admission-device {
        min-height: 56px;
        padding: 6px 8px;
      }

      .device-admission-copy .device-type-name {
        display: -webkit-box;
        overflow: hidden;
        white-space: normal;
        text-overflow: clip;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        line-height: 1.2;
        overflow-wrap: break-word;
        word-break: normal;
      }

      .dd-replacement-footer {
        justify-content: flex-end;
      }

      @media (max-width: 700px) {
        .dd-flat-settings {
          padding: 18px 10px 16px;
        }

        .device-type-panel-row .device-type-heading {
          flex-wrap: nowrap;
        }

        .device-type-panel-row .device-type-heading small {
          width: auto;
        }

        .device-area-heading {
          display: grid;
        }

        .device-area-heading small {
          width: 100%;
        }
      }

      /* Settings entity picker, people, areas and device hierarchy */
      .entity-picker-content {
        box-sizing: border-box;
      }

      .entity-option {
        width: 100%;
        border: 1px solid transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      .entity-option.selected {
        border-color: color-mix(in srgb, var(--primary-color) 42%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      }

      .entity-option-copy {
        min-width: 0;
        flex: 1;
        display: grid;
        gap: 2px;
      }

      .entity-option-copy .entity-name,
      .entity-option-copy .entity-id {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .entity-selected-icon {
        flex: 0 0 auto;
        color: var(--primary-color);
        --mdc-icon-size: 20px;
      }

      .entity-picker-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--divider-color);
      }

      .persons-list {
        overflow: visible;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 8px;
        border: 0;
        border-radius: 0;
        background: transparent;
      }

      .persons-list .person-item {
        min-width: 0;
        min-height: 0;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) 34px;
        align-items: center;
        gap: 8px;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
      }

      .persons-list .person-item + .person-item {
        border-top: 1px solid var(--divider-color);
      }

      .person-avatar {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: 999px;
        background: var(--secondary-background-color);
      }

      .person-avatar img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .person-avatar .person-icon {
        margin: 0;
        --mdc-icon-size: 25px;
      }

      .persons-list .person-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 650;
      }

      .persons-list .dd-visibility-button {
        width: 30px;
        height: 30px;
      }

      .area-sort-segment {
        align-items: center;
        line-height: 1.2;
      }

      .area-sort-segment > span,
      .area-sort-segment ha-icon {
        align-self: center;
      }

      .area-settings-sortable .dd-area-sortable-row .area-item {
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr) 48px;
        align-items: center;
        gap: 6px;
      }

      .area-settings-sortable.is-custom-order .dd-area-sortable-row .area-item {
        grid-template-columns: 22px 46px minmax(0, 1fr) 48px;
      }

      .area-settings-sortable .handle {
        width: 22px;
        height: 40px;
        display: grid;
        place-items: center;
        margin: 0;
        padding: 0;
      }

      .area-settings-sortable .area-icon {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        margin: 0;
        --mdc-icon-size: 25px;
      }

      .area-settings-sortable .area-name {
        min-width: 0;
        margin: 0;
      }

      .area-settings-sortable .area-actions {
        width: 48px;
        justify-content: flex-end;
      }

      .device-area-heading {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .device-area-heading {
        display: inline-flex !important;
        flex-wrap: nowrap !important;
        align-items: baseline;
        gap: 8px;
        min-width: 0;
        white-space: nowrap;
      }

      .device-area-heading strong {
        flex: 0 1 auto;
        min-width: 0;
      }

      .device-area-heading small {
        width: auto !important;
        flex: 0 0 auto;
        white-space: nowrap;
      }

      .device-admission-device {
        min-height: 44px;
        padding: 4px 7px;
        grid-template-columns: 30px minmax(0, 1fr) 34px;
        gap: 6px;
      }

      .device-admission-device .device-type-icon {
        width: 30px;
        height: 30px;
      }

      .device-admission-device .device-type-icon ha-icon {
        --mdc-icon-size: 18px;
      }

      .device-admission-device .dd-visibility-button {
        width: 32px;
        height: 32px;
      }

      .device-admission-device-list {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .device-admission-device {
        min-height: 58px;
        align-items: center;
        cursor: default;
      }

      .device-admission-device.interactive {
        cursor: pointer;
      }

      .device-admission-device.interactive:hover {
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color));
        border-color: color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
      }

      .device-admission-copy {
        align-self: center;
        display: flex;
        min-width: 0;
        flex-direction: column;
        justify-content: center;
      }

      .device-admission-copy .device-type-name {
        font-size: 11.5px;
        line-height: 1.18;
        overflow-wrap: normal;
        word-break: normal;
        hyphens: none;
      }

      .device-admission-copy .device-type-count {
        margin-top: 2px;
        font-size: 9.5px;
      }

      @media (max-width: 820px) {
        .device-admission-device-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 520px) {
        .device-admission-device-list {
          grid-template-columns: 1fr;
        }
      }


      .area-detail-editor {
        padding: 16px;
      }

      .area-detail-editor > .toolbar {
        min-height: 42px;
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 10px;
        padding: 0;
        background: transparent;
        border: 0;
      }

      .area-detail-editor > .toolbar ha-icon-button {
        width: 38px;
        height: 38px;
        --mdc-icon-button-size: 38px;
        --mdc-icon-size: 22px;
      }

      .area-detail-editor > .toolbar h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 800;
      }

      .area-detail-editor .area-help {
        margin: 0 0 12px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: color-mix(in srgb, var(--secondary-background-color) 72%, var(--card-background-color));
      }

      .area-detail-editor .area-help-icon {
        color: var(--secondary-text-color);
      }

      .area-detail-editor .area-help-text p {
        margin: 0;
      }

      .area-detail-editor .area-help-text p + p {
        margin-top: 5px;
      }

      .area-detail-editor .area-entity-layout-settings {
        margin: 0 0 12px;
        padding: 14px;
        border-radius: 12px;
        overflow: hidden;
      }

      .area-detail-editor .area-entity-layout-settings > .area-entity-section,
      .area-detail-editor .area-entity-layout-settings > .area-free-order-section {
        margin: 0;
      }

      .area-detail-editor .area-entity-layout-settings > .area-entity-section > ha-expansion-panel {
        margin-bottom: 0;
      }

      .area-entity-layout-hint {
        margin: 0;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .area-detail-editor .area-entity-section {
        margin: 0 0 8px;
      }

      .area-detail-editor .area-entity-section ha-expansion-panel,
      .area-detail-editor > ha-expansion-panel {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }

      .area-detail-editor .area-entity-section-header {
        min-height: 52px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
      }

      .area-detail-editor .area-entity-section-header > ha-icon {
        justify-self: center;
        color: var(--primary-color);
        --mdc-icon-size: 22px;
      }

      .area-detail-editor .area-entity-section .sortable-container {
        padding: 0 10px 8px;
      }

      .area-detail-editor .area-entity-section .sortable-item {
        border-radius: 9px;
      }

      .area-detail-editor .area-entity-section .entity-item {
        min-height: 46px;
        padding: 4px 6px;
      }

      .area-list-reset {
        margin-top: 10px;
      }

      .area-layout-actions {
        margin-top: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .area-layout-actions .home-layout-reset {
        margin: 0;
      }

      /* Area room editor final consistency */
      .master-confirmation-note ha-icon,
      .master-confirmation-icon {
        color: var(--primary-color);
      }

      .area-detail-editor .area-entity-layout-settings {
        padding: 10px 12px 12px;
        gap: 8px;
      }

      .area-detail-editor .area-entity-layout-settings .area-order-modes {
        gap: 0;
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--secondary-background-color);
      }

      .area-detail-editor .area-entity-layout-settings .area-order-mode:last-child {
        border-right: 0;
      }

      .area-detail-editor .area-entity-section-header {
        min-height: 52px;
        grid-template-columns: 28px 32px minmax(0, 1fr) 40px;
        gap: 8px;
        padding: 6px 12px 8px;
      }

      .area-detail-editor .area-entity-section-handle {
        width: 28px;
        height: 36px;
      }

      .area-detail-editor .area-entity-section-header > ha-icon {
        justify-self: center;
        --mdc-icon-size: 21px;
      }

      .area-detail-editor .area-entity-section-title {
        justify-self: start;
        text-align: left;
      }

      .area-detail-editor .area-entity-section .sortable-container {
        gap: 0;
        padding: 0;
        border-top: 1px solid var(--divider-color);
      }

      .area-detail-editor .area-entity-section .sortable-item {
        border: 0;
        border-radius: 0;
        background: transparent;
      }

      .area-detail-editor .area-entity-section .sortable-item + .sortable-item {
        border-top: 1px solid var(--divider-color);
      }

      .area-detail-editor .area-entity-section .entity-item {
        min-height: 48px;
        padding: 5px 10px;
      }

      .area-detail-editor .area-entity-section .sortable-item:hover {
        background: color-mix(in srgb, var(--primary-color) 3%, transparent);
      }

      /* Area room editor behavior + hierarchy */
      .area-entity-layout-heading {
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .area-entity-layout-heading > strong { font-size: 14px; }
      .area-reset-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      }
      .area-reset-button ha-icon { --mdc-icon-size: 17px; }

      .area-free-order-section {
        overflow: hidden;
        margin: 0 0 8px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }
      .area-free-order-header {
        min-height: 52px;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        box-sizing: border-box;
      }
      .area-free-order-header ha-icon {
        justify-self: center;
        color: var(--primary-color);
        --mdc-icon-size: 21px;
      }
      .area-free-order-header strong { font-size: 14px; }
      .area-free-order-section .sortable-container {
        gap: 0;
        padding: 0;
        border-top: 1px solid var(--divider-color);
      }
      .area-free-order-section .sortable-item {
        border: 0;
        border-radius: 0;
        background: transparent;
      }
      .area-free-order-section .sortable-item + .sortable-item {
        border-top: 1px solid var(--divider-color);
      }
      .area-free-order-section .entity-item {
        min-height: 48px;
        padding: 5px 10px 5px 18px;
      }

      .area-detail-editor .area-entity-section-header {
        grid-template-columns: 18px 40px minmax(0, 1fr) 40px;
        gap: 6px;
        padding: 7px 8px 9px;
      }
      .area-detail-editor .area-entity-section-handle {
        width: 18px;
        height: 40px;
      }
      .area-detail-editor .area-entity-section-header > ha-icon {
        width: 40px;
        justify-self: center;
        color: var(--area-group-color, var(--primary-color));
        --mdc-icon-size: 23px;
      }
      .area-detail-editor .area-entity-section-title { font-size: 14px; }
      .area-detail-editor .area-entity-section .entity-item {
        padding-left: 18px;
        background: color-mix(in srgb, var(--secondary-background-color) 44%, transparent);
      }
      .area-detail-editor .area-entity-section .entity-icon {
        color: var(--secondary-text-color);
      }
      .area-detail-editor .area-entity-section .sortable-item:hover .entity-item {
        background: color-mix(in srgb, var(--secondary-background-color) 72%, transparent);
      }

      @media (max-width: 700px) {
        .persons-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .area-settings-sortable .dd-area-sortable-row .area-item {
          grid-template-columns: 40px minmax(0, 1fr) 40px;
        }

        .area-settings-sortable.is-custom-order .dd-area-sortable-row .area-item {
          grid-template-columns: 18px 40px minmax(0, 1fr) 40px;
        }

        .area-settings-sortable .area-icon {
          width: 40px;
          height: 40px;
          --mdc-icon-size: 23px;
        }

        .area-settings-sortable .handle {
          width: 18px;
        }

        .area-settings-sortable .area-actions {
          width: 40px;
        }
      }

      @media (max-width: 430px) {
        .persons-list {
          grid-template-columns: 1fr;
        }
      }

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dwains-dashboard-next-strategy-editor": DwainsDashboardStrategyEditor;
  }
}
