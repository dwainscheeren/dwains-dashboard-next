import {
  mdiArrowDown,
  mdiArrowLeft,
  mdiArrowUp,
  mdiCardAccountDetailsStarOutline,
  mdiChevronRight,
  mdiDelete,
  mdiDrag,
  mdiEye,
  mdiEyeOff,
  mdiFloorPlan,
  mdiFormatListBulletedType,
  mdiGestureTapButton,
  mdiHeartOutline,
  mdiHomeEditOutline,
  mdiPencil,
  mdiPuzzleEditOutline,
  mdiShieldAccount,
  mdiStarOutline,
  mdiThermometerWater,
  mdiViewDashboardEdit,
} from "@mdi/js";
import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import memoizeOne from "memoize-one";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { HomeAssistant } from "../types/home-assistant";
import type { AreaCustomCard, AreaEntityLayout, AreaSortMode, DeviceConfig, DwainsDashboardConfig, HomeCustomCard, HomeInformationCardKey, HomeSectionKey, LovelaceCardConfig, MasterActionConfirmationDomain } from "../types/strategy";
import { openReplacementManager } from "./dwains-replacement-manager-dialog";
import {
  AREA_STRATEGY_GROUPS,
  AREA_STRATEGY_GROUP_ICONS,
  areaStrategyGroupForKey,
  resolveAreaSortMode,
  sortAreas,
  type AreaStrategyGroup
} from "../utils/area-entities";
import { countReplacementRules, domainReplacementEntries, setDomainReplacement } from "../utils/blueprint-replacements";
import { persistableConfig } from "../utils/dashboard-config";
import { isHiddenAsUnavailable } from "../utils/entity-availability";
import { areaEntityDisplayName, hidesAreaNameInEntityNames } from "../utils/entity-names";
import {
  getAreaHiddenEntityIdSet,
  getDevicesPageHiddenEntityIdSet,
  isConfigEntityInArea,
  resolveStatusEntityAreaId,
} from "../utils/entity-lookups";
import { isAreaNowPlayingEnabled } from "../utils/now-playing";
import { tileTapAction, type TileTapAction } from "../utils/tile-tap";
import { withAreaShowEnergySensors, withHideEnergySensors } from "../utils/area-energy-sensors";
import { getDeviceClassName, getDomainName } from "../utils/domain-names";
import { getDeviceClassIcon, getDomainColor, getDomainIcon } from "../utils/icons";
import { ddLocale, ddLocalize, ddLocalizePlural } from "../utils/localize";
import {
  DEFAULT_HOME_INFORMATION_CARDS,
  HOME_INFORMATION_CARD_META,
  HOME_SECTION_META,
  normalizeHiddenHomeInformationCards,
  normalizeHiddenHomeSections,
  normalizeHomeSectionsOrder,
  resolveHiddenHomeSections,
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
import { DD_NEXT_VERSION } from "../version";
import { moveItemTo, sameItems, sameOrder } from "../utils/list-order";
import {
  isAreaLayoutDefault,
  isAreasDisplayDefault,
  isDeviceVisibilityDefault,
  resetAreaLayout,
  resetAreasDisplay,
  resetDeviceVisibility,
} from "../utils/settings-reset";
import {
  countHidden,
  groupHiddenIds,
  groupVisibility,
  hidesOnToggle,
  idsVisibility,
  withIdsHidden,
  type GroupVisibility,
} from "../utils/visibility";
import {
  MASTER_ACTION_CONFIRMATION_DOMAINS,
  masterActionConfirmationEnabled,
} from "../utils/master-action-confirmations";
import { showCardEditorDialog } from "./utils/show-card-editor-dialog";
import { fireEvent } from "./utils/fire-event";
import { showConfirmDialog } from "./utils/confirm-dialog";
import { getEntityRegistry, setFullEntityRegistry } from "../utils/entity-registry";
import { dashboardSegmentFromPath, readWallTabletPrefs } from "../utils/wall-tablet";
import "./dwains-wall-tablet-settings";

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
  group: "general" | "layout" | "advanced" | "device";
  icon: string;
  color: string;
  title: string;
  description: string;
  /** Short facts, shown as chips that wrap. */
  summary?: string[];
}

/** An entity the Devices page can show. People have no area. */
interface DeviceVisibilityEntry {
  entityId: string;
  typeKey: string;
  areaId: string;
  deviceId?: string;
}

/** A device in an area of a type, or the entities without a device (no `deviceId`). */
interface DeviceVisibilityDeviceNode {
  deviceId?: string;
  name: string;
  /** Hidden in all of Dwains Dashboard. */
  hidden: boolean;
  entityIds: string[];
}

interface DeviceVisibilityAreaNode {
  areaId: string;
  areaName: string;
  entityIds: string[];
  devices: DeviceVisibilityDeviceNode[];
}

interface DeviceVisibilityTypeNode {
  key: string;
  label: string;
  icon: string;
  color: string;
  entityIds: string[];
  areas: DeviceVisibilityAreaNode[];
}

interface HomeCameraSetting {
  entityId: string;
  name: string;
  areaId: string;
  areaName: string;
  state: string;
}

let rememberedSettingsPage: SettingsPageKey = "overview";
let rememberedSettingsPageAt = 0;
const SETTINGS_PAGE_RESTORE_MS = 8000;
const UNGROUPED_ENTITY_DRAG_GROUP = '__ungrouped__';

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
  "mdi:gesture-tap-button": mdiGestureTapButton,
  "mdi:heart-outline": mdiHeartOutline,
  "mdi:home-edit-outline": mdiHomeEditOutline,
  "mdi:puzzle-edit-outline": mdiPuzzleEditOutline,
  "mdi:shield-account": mdiShieldAccount,
  "mdi:star-outline": mdiStarOutline,
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
  private _draggedHomeSection?: HomeSectionKey;

  @state()
  private _dragOverHomeSectionIndex?: number;

  @state()
  private _draggedHomeCamera?: string;

  @state()
  private _dragOverHomeCameraIndex?: number;

  @state()
  private _draggedHomeScene?: string;

  @state()
  private _dragOverHomeSceneIndex?: number;

  @state()
  private _showHomeScenePicker = false;

  @state()
  private _homeSceneSearch = '';

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
  private _draggedAreaCustomCardId?: string;

  /** Types opened in the Devices page visibility tree. */
  @state()
  private _expandedDeviceTypes: ReadonlySet<string> = new Set();

  /** The group order of the room in the settings was changed, so it can be copied to every room. */
  @state()
  private _areaGroupOrderChanged = false;

  /**
   * Order shown while an item of an order list is dragged. The list follows
   * the pointer and the order is saved on drop.
   */
  @state()
  private _dragPreview?: { list: string; order: readonly string[] };

  /** Entity groups folded in the room settings. */
  @state()
  private _collapsedAreaGroups: ReadonlySet<string> = new Set();

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
  private _settingsPage: SettingsPageKey = restoreSettingsPage();

  @state()
  private _homeSettingsDetail: 'overview' | 'house_information' | 'climate' | 'outdoor_climate' | 'cameras' | 'custom_cards' | 'scenes' = 'overview';

  /** Page that opened the Favorites page with a "Manage favorites" link, for its back button. */
  @state()
  private _favoritesReturnPage?: "home" | "areas";

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
    } catch (e) {
      console.error('❌ Dashboard bijwerken mislukt:', e);
      this._showToast(this._t('strategy.save_name_failed', { error: String(e) }));
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
      ...persistableConfig(config),
      type: config?.type || "custom:dwains-dashboard-next",
      areas_display: config?.areas_display || {},
      floors_display: config?.floors_display || {},
      areas_options: config?.areas_options || {},
      blueprint_replacements: config?.blueprint_replacements || {},
      device_admission: config?.device_admission || {},
      favorites: config?.favorites || [],
      pages: config?.pages || [],
      home_custom_cards: config?.home_custom_cards || [],
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

    // Keep the full entity registry privately; hass is shared with Home Assistant.
    setFullEntityRegistry(entities);

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
      { key: "layout", title: this._t('settings.dashboard_layout') },
      { key: "advanced", title: this._t('settings.advanced') },
      { key: "device", title: this._t('kiosk.group_title') },
    ];
    const items = this._settingsOverviewItems();

    return html`
      <div class="editor-container">
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
        <p class="settings-version-footer">
          ${this._t('settings.loaded_version')} <strong>v${DD_NEXT_VERSION}</strong>
        </p>
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
      ? this._t('settings.unavailable_shown')
      : this._t('settings.unavailable_hidden');
    const areasUnavailableMode = this._config?.settings?.hide_unavailable_entities === false
      ? this._t('settings.unavailable_shown')
      : this._t('settings.unavailable_hidden');
    const areaSortMode = resolveAreaSortMode(this._config?.areas_display);
    const protectedMasterActionCount = MASTER_ACTION_CONFIRMATION_DOMAINS
      .filter((domain) => masterActionConfirmationEnabled(this._config?.settings, domain))
      .length;

    return [
      {
        page: "dashboard",
        group: "general",
        icon: "mdi:view-dashboard-edit",
        color: "var(--primary-color)",
        title: this._t('settings.dashboard'),
        description: this._t('settings.dashboard_description'),
        summary: [this._dashboardTitle || this._t('settings.current_dashboard')],
      },
      {
        page: "home",
        group: "general",
        icon: "mdi:home-edit-outline",
        color: "#0ea5e9",
        title: this._t('settings.home_page'),
        description: this._t('settings.home_page_description'),
        summary: [
          this._tp('settings.section_count', visibleHomeSections),
          this._t('settings.house_cards', { visible: visibleHouseInfoCards, total: DEFAULT_HOME_INFORMATION_CARDS.length }),
          this._tp('common.favorite', favoriteCount),
        ],
      },
      {
        page: "favorites",
        group: "general",
        icon: "mdi:star-outline",
        color: "#f59e0b",
        title: this._t('favorites.title'),
        description: this._t('settings.favorites_page_description'),
        summary: [
          this._tp('common.favorite', favoriteCount),
          this._t(this._config?.settings?.show_suggested_favorites === false
            ? 'settings.favorite_suggestions_off'
            : 'settings.favorite_suggestions_on'),
        ],
      },
      {
        page: "header",
        group: "general",
        icon: "mdi:card-account-details-star-outline",
        color: "#22a06b",
        title: this._t('settings.header_status'),
        description: this._t('settings.header_status_description'),
        summary: [
          this._config?.settings?.show_notifications === false ? this._t('settings.notifications_hidden') : this._t('settings.notifications_shown'),
          !this._config?.settings?.alarm_entity_id
            ? this._t('settings.no_alarm_selected')
            : this._config.settings.show_alarm === false
              ? this._t('settings.alarm_hidden')
              : this._t('settings.alarm_selected'),
        ],
      },
      {
        page: "controls",
        group: "general",
        icon: "mdi:gesture-tap-button",
        color: "#d97706",
        title: this._t('settings.controls_confirmations'),
        description: this._t('settings.controls_confirmations_description'),
        summary: [
          this._t(tileTapAction(this._config?.settings) === 'toggle'
            ? 'settings.tile_tap_summary_toggle'
            : 'settings.tile_tap_summary_more_info'),
          this._t('settings.controls_confirmations_summary', { count: protectedMasterActionCount }),
        ],
      },
      {
        page: "people",
        group: "layout",
        icon: "mdi:account-group-outline",
        color: "#8b5cf6",
        title: this._t('settings.people'),
        description: this._t('settings.people_description'),
        summary: [this._tp('common.person', personCount)],
      },
      {
        page: "areas",
        group: "layout",
        icon: "mdi:floor-plan",
        color: "#14b8a6",
        title: this._t('settings.areas'),
        description: this._t('settings.areas_description'),
        summary: [
          this._tp('common.area', areaCount),
          this._t(`settings.area_order_${areaSortMode}`),
          areasUnavailableMode,
        ],
      },
      {
        page: "devices",
        group: "layout",
        icon: "mdi:format-list-bulleted-type",
        color: "#0891b2",
        title: this._t('settings.devices_page'),
        description: this._t('settings.devices_page_description'),
        summary: [
          this._t('settings.types_visible', { visible: deviceTypeCount - hiddenDeviceTypeCount, total: deviceTypeCount }),
          this._t('settings.hidden_devices_count', { count: hiddenDeviceCount }),
          this._tp('settings.hidden_entities_count', this._getDevicesPageHiddenEntityIds().size),
          devicesUnavailableMode,
        ],
      },
      {
        page: "replacements",
        group: "layout",
        icon: "mdi:puzzle-edit-outline",
        color: "#7c3aed",
        title: this._t('settings.blueprint_replacements'),
        description: this._t('settings.blueprint_replacements_description'),
        summary: [this._tp('common.active', replacementCount)],
      },
      {
        page: "permissions",
        group: "advanced",
        icon: "mdi:shield-account",
        color: "#ef4444",
        title: this._t('settings.user_permissions'),
        description: this._t('settings.user_permissions_description'),
        summary: [
          this._config?.settings?.restrict_non_admin_ha_sidebar || this._config?.settings?.restrict_non_admin_dashboard_settings
            ? this._t('settings.restrictions_enabled')
            : this._t('settings.default_access'),
        ],
      },
      {
        page: "support",
        group: "advanced",
        icon: "mdi:heart-outline",
        color: "#f59e0b",
        title: this._t('settings.support'),
        description: this._t('settings.support_description'),
        summary: [this._t('settings.optional')],
      },
      {
        page: "wall_tablet",
        group: "device",
        icon: "mdi:tablet-dashboard",
        color: "#64748b",
        title: this._t('kiosk.title'),
        description: this._t('kiosk.description'),
        summary: [
          readWallTabletPrefs(dashboardSegmentFromPath(window.location.pathname)).enabled
            ? this._t('kiosk.summary_on')
            : this._t('kiosk.summary_off'),
        ],
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
          ${item.summary?.length
            ? html`
                <div class="settings-nav-summary">
                  ${item.summary.filter(Boolean).map((part) => html`<span>${part}</span>`)}
                </div>
              `
            : nothing}
        </div>
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

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has("_settingsPage")) {
      // The settings page host shows a different save bar for device settings.
      this.dispatchEvent(new CustomEvent("dwains-dashboard-next-settings-page-changed", {
        detail: { page: this._settingsPage },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _openSettingsPage(page: Exclude<SettingsPageKey, "overview">): void {
    this._settingsPage = page;
    this._favoritesReturnPage = undefined;
    rememberSettingsPage(page);
    this._closeInlinePickers();
  }

  private _backToSettingsOverview = (): void => {
    this._settingsPage = "overview";
    this._favoritesReturnPage = undefined;
    rememberSettingsPage("overview");
    this._closeInlinePickers();
  };

  /** "Manage favorites" link: opens the Favorites page, whose back button returns here. */
  private _openFavoritesFrom(page: "home" | "areas", event?: Event): void {
    event?.stopPropagation();
    this._openSettingsPage("favorites");
    this._favoritesReturnPage = page;
  }

  private _renderManageFavoritesLink(page: "home" | "areas") {
    return html`
      <button class="link manage-favorites-link" type="button" @click=${(event: Event) => this._openFavoritesFrom(page, event)}>
        ${this._t('settings.manage_favorites')}
      </button>
    `;
  }

  private _closeInlinePickers(): void {
    this._showEntityPicker = false;
    this._showWeatherPicker = false;
    this._showAlarmPicker = false;
    this._showHomeScenePicker = false;
  }

  private _homeSettingsDetailHeader(): { title: string; description: string; backLabel: string } | undefined {
    if (this._homeSettingsDetail === 'overview') return undefined;

    if (this._homeSettingsDetail === 'climate') {
      return {
        title: this._t('home.indoor_climate'),
        description: this._t('settings.home_climate_areas_description'),
        backLabel: this._t('home_section.devices.label'),
      };
    }

    if (this._homeSettingsDetail === 'outdoor_climate') {
      return {
        title: this._t('home.outdoor_climate'),
        description: this._t('settings.home_outdoor_climate_areas_description'),
        backLabel: this._t('home_section.devices.label'),
      };
    }

    const section: HomeSectionKey = this._homeSettingsDetail === 'house_information'
      ? 'devices'
      : this._homeSettingsDetail;
    const meta = HOME_SECTION_META[section];
    return {
      title: this._t(meta.labelKey),
      description: this._t(meta.descriptionKey),
      backLabel: this._t('settings.home_page'),
    };
  }

  private _backFromHomeSettingsDetail = (): void => {
    this._homeSettingsDetail = this._homeSettingsDetail === 'climate' || this._homeSettingsDetail === 'outdoor_climate'
      ? 'house_information'
      : 'overview';
    this._closeInlinePickers();
  };

  private _renderSettingsDetailPage(page: SettingsPageKey) {
    const item = this._settingsOverviewItems().find((candidate) => candidate.page === page);
    if (!item) return this._renderSettingsOverview();

    const homeDetail = page === 'home' ? this._homeSettingsDetailHeader() : undefined;
    const returnPage = page === 'favorites' ? this._favoritesReturnPage : undefined;
    const returnItem = returnPage
      ? this._settingsOverviewItems().find((candidate) => candidate.page === returnPage)
      : undefined;
    const title = homeDetail?.title || item.title;
    const description = homeDetail?.description || item.description;
    const backLabel = homeDetail?.backLabel || returnItem?.title || this._t('settings.all_settings');
    const backAction = homeDetail
      ? this._backFromHomeSettingsDetail
      : returnPage
        ? () => this._openSettingsPage(returnPage)
        : this._backToSettingsOverview;

    return html`
      <div class="editor-container">
        <div class="settings-detail-toolbar">
          <button class="settings-back-button" type="button" @click=${backAction}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            <span>${backLabel}</span>
          </button>
          <div class="settings-detail-title">
            <span>${title}</span>
            <small>${description}</small>
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
        return this._renderHomeLayoutSettingsPanel();
      case "header":
        return html`
          ${this._renderTimeSettingsPanel()}
          ${this._renderNotificationSettingsPanel()}
          ${this._renderWeatherSettingsPanel()}
          ${this._renderAlarmSettingsPanel()}
        `;
      case "controls":
        return html`
          ${this._renderTileTapSettingsPanel()}
          ${this._renderMasterActionConfirmationSettingsPanel()}
        `;
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

  private _renderTileTapSettingsPanel() {
    const current = tileTapAction(this._config?.settings);
    const modes: Array<{ mode: TileTapAction; icon: string; title: string; description: string }> = [
      {
        mode: 'more-info',
        icon: 'mdi:card-text-outline',
        title: this._t('settings.tile_tap_more_info'),
        description: this._t('settings.tile_tap_more_info_description'),
      },
      {
        mode: 'toggle',
        icon: 'mdi:gesture-tap-hold',
        title: this._t('settings.tile_tap_toggle'),
        description: this._t('settings.tile_tap_toggle_description'),
      },
    ];

    return this._renderSettingsPanel(
      "mdi:gesture-tap",
      this._t('settings.tile_tap_title'),
      this._t('settings.tile_tap_description'),
      html`
        <div class="tile-tap-section">
          <div class="area-order-modes tile-tap-modes" role="radiogroup" aria-label=${this._t('settings.tile_tap_title')}>
            ${modes.map(({ mode, icon, title, description }) => html`
              <button
                type="button"
                class="area-order-mode ${current === mode ? 'selected' : ''}"
                role="radio"
                aria-checked=${current === mode ? 'true' : 'false'}
                @click=${() => this._setTileTapAction(mode)}
              >
                <ha-icon .icon=${icon}></ha-icon>
                <span>
                  <strong>${title}</strong>
                  <small>${description}</small>
                </span>
              </button>
            `)}
          </div>
        </div>
      `
    );
  }

  private _setTileTapAction(mode: TileTapAction): void {
    if (!this._config || tileTapAction(this._config.settings) === mode) return;
    const settings = { ...this._config.settings };
    // The default is left out of the stored config.
    if (mode === 'toggle') settings.tile_tap_action = 'toggle';
    else delete settings.tile_tap_action;
    this._fireConfigChanged({ ...this._config, settings });
  }

  private _renderMasterActionConfirmationSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:gesture-tap-button",
      this._t('settings.master_confirmations'),
      this._t('settings.master_confirmations_description'),
      html`
        <div class="master-confirmation-section">
          <div class="master-confirmation-note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${this._t('settings.master_confirmations_note')}</span>
          </div>
          <div class="master-confirmation-list">
            ${MASTER_ACTION_CONFIRMATION_DOMAINS.map((domain) => {
              const enabled = masterActionConfirmationEnabled(this._config?.settings, domain);
              return html`
                <label
                  class="master-confirmation-row"
                  style=${`--master-confirmation-color: ${getDomainColor(domain)};`}
                >
                  <span class="master-confirmation-icon">
                    <ha-icon icon=${getDomainIcon(domain)}></ha-icon>
                  </span>
                  <span class="master-confirmation-copy">
                    <strong>${getDomainName(this.hass, domain)}</strong>
                    <small>${this._t(`settings.confirm_${domain}_description`)}</small>
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
      `
    );
  }

  private _renderSupportSection() {
    return html`
      <div class="sponsoring-section">
        <div class="sponsoring-header">
          <ha-icon icon="mdi:heart"></ha-icon>
          <h3>${this._t('support.title')}</h3>
        </div>
        <p class="sponsoring-text">${this._t('support.description')}</p>

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
        html`<div class="empty-settings-card">${this._t('settings.open_instance')}</div>`
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

  private _openHomeSectionDetail(section: HomeSectionKey): void {
    const detail = this._homeSectionDetail(section);
    if (!detail) return;
    this._homeSettingsDetail = detail;
    this._closeInlinePickers();
  }

  private _renderHomeLayoutSettingsPanel() {
    if (this._homeSettingsDetail === 'climate') {
      return this._renderSettingsPanel(
        "mdi:home-thermometer-outline",
        this._t('home.indoor_climate'),
        this._t('settings.home_climate_areas_description'),
        this._renderHomeClimateAreaSettings()
      );
    }

    if (this._homeSettingsDetail === 'outdoor_climate') {
      return this._renderSettingsPanel(
        "mdi:sun-thermometer-outline",
        this._t('home.outdoor_climate'),
        this._t('settings.home_outdoor_climate_areas_description'),
        this._renderHomeOutdoorClimateAreaSettings()
      );
    }

    if (this._homeSettingsDetail === 'house_information') {
      return this._renderSettingsPanel(
        "mdi:home-edit-outline",
        this._t('settings.house_information_cards'),
        this._t('settings.house_information_cards_description'),
        this._renderHomeInformationCardSettings()
      );
    }

    if (this._homeSettingsDetail === 'cameras') {
      const meta = HOME_SECTION_META.cameras;
      return this._renderSettingsPanel(
        meta.icon,
        this._t(meta.labelKey),
        this._t(meta.descriptionKey),
        this._renderHomeCameraSettings()
      );
    }

    if (this._homeSettingsDetail === 'custom_cards') {
      const meta = HOME_SECTION_META.custom_cards;
      return this._renderSettingsPanel(
        meta.icon,
        this._t(meta.labelKey),
        this._t(meta.descriptionKey),
        this._renderHomeCustomCardsSettings()
      );
    }

    if (this._homeSettingsDetail === 'scenes') {
      const meta = HOME_SECTION_META.scenes;
      return this._renderSettingsPanel(
        meta.icon,
        this._t(meta.labelKey),
        this._t(meta.descriptionKey),
        this._renderHomeScenesSettings()
      );
    }

    return this._renderSettingsPanel(
      "mdi:home-edit-outline",
      this._t('settings.home_layout'),
      this._t('settings.home_layout_description'),
      this._renderHomeSectionOrder()
    );
  }

  private _renderReplacementsSettingsPanel() {
    const entries = this._replacementEntries();
    return this._renderSettingsPanel(
      "mdi:puzzle-edit-outline",
      this._t('settings.blueprint_replacements'),
      this._t('settings.replace_description'),
      html`
        <div class="replacement-section">
          <div class="replacement-summary">
            <div>
              <div class="replacement-count">${this._tp('common.active', this._replacementCount())}</div>
              <div class="replacement-help">${this._t('replacement.views_description')}</div>
            </div>
            <ha-button appearance="accent" @click=${() => this._openReplacementManager()}>
              <ha-icon icon="mdi:plus"></ha-icon>
              ${this._t('replacement.assign')}
            </ha-button>
          </div>
          ${entries.length ? html`
            <div class="home-info-card-list replacement-list">
              ${repeat(
                entries,
                (entry) => entry.domain,
                ({ domain, assignment }) => {
                  const enabled = assignment.enabled !== false;
                  const domainName = getDomainName(this.hass, domain);
                  return html`
                    <div class="home-info-card-item ${enabled ? '' : 'disabled'}">
                      <div class="home-section-icon"><ha-icon .icon=${getDomainIcon(domain)}></ha-icon></div>
                      <div class="home-section-copy">
                        <div class="home-section-title">${domainName}</div>
                        <div class="home-section-description">
                          ${assignment.name}${assignment.version ? ` (v${assignment.version})` : ''}
                        </div>
                      </div>
                      <div class="home-section-actions">
                        <ha-switch
                          .checked=${enabled}
                          aria-label=${this._t('replacement.enabled_label', { domain: domainName })}
                          title=${this._t('replacement.enabled_label', { domain: domainName })}
                          @change=${(event: Event) =>
                            this._setReplacementEnabled(domain, (event.target as HTMLInputElement).checked)}
                        ></ha-switch>
                        <ha-icon-button
                          .label=${this._t('common.edit')}
                          .path=${mdiPencil}
                          @click=${() => this._openReplacementManager(domain)}
                        ></ha-icon-button>
                        <ha-icon-button
                          .label=${this._t('common.delete')}
                          .path=${mdiDelete}
                          @click=${() => this._removeReplacement(domain)}
                        ></ha-icon-button>
                      </div>
                    </div>
                  `;
                }
              )}
            </div>
          ` : html`<div class="home-camera-settings-empty">${this._t('replacement.empty')}</div>`}
        </div>
      `
    );
  }

  private _replacementEntries() {
    return domainReplacementEntries(this._config?.blueprint_replacements).sort((a, b) =>
      getDomainName(this.hass, a.domain).localeCompare(getDomainName(this.hass, b.domain))
    );
  }

  private _setReplacementEnabled(domain: string, enabled: boolean): void {
    if (!this._config) return;
    const current = domainReplacementEntries(this._config.blueprint_replacements)
      .find((entry) => entry.domain === domain)?.assignment;
    if (!current) return;
    this._fireConfigChanged({
      ...this._config,
      blueprint_replacements: setDomainReplacement(this._config.blueprint_replacements, domain, { ...current, enabled }),
    });
  }

  private async _removeReplacement(domain: string): Promise<void> {
    const domainName = getDomainName(this.hass, domain);
    const confirmed = await showConfirmDialog(this, {
      hass: this.hass,
      title: this._t('replacement.remove_confirm', { domain: domainName }),
      message: this._t('replacement.remove_message', { domain: domainName }),
      confirmLabel: this._t('common.delete'),
      destructive: true,
    });
    if (!confirmed || !this._config) return;
    this._fireConfigChanged({
      ...this._config,
      blueprint_replacements: setDomainReplacement(this._config.blueprint_replacements, domain, undefined),
    });
  }

  private _renderFavoritesSettingsPanel() {
    return this._renderSettingsPanel(
      "mdi:star",
      this._t('favorites.title'),
      this._t('settings.favorites_page_description'),
      html`
        <div class="favorites-section">
          <div class="favorite-suggestions-toggle">
            <ha-formfield .label=${this._t('settings.show_suggested_favorites')}>
              <ha-switch
                .checked=${this._config?.settings?.show_suggested_favorites !== false}
                @change=${this._toggleSuggestedFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              ${this._t('settings.suggested_favorites_description')}
            </p>
          </div>
          <div class="entity-picker">
            <div class="entity-picker-header">
              <h4>${this._t('settings.selected_entities')}</h4>
              <ha-button appearance="outlined" size="s" @click=${this._addFavoriteEntity}>
                <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t('settings.add_entity')}
              </ha-button>
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
      this._t('settings.time_date'),
      this._t('settings.time_date_description'),
      html`
        <div class="time-section">
          <div class="time-toggle">
            <ha-formfield .label=${this._t('settings.show_time')}>
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
      this._t('home.notifications'),
      this._t('settings.notifications_description'),
      html`
        <div class="notifications-section">
          <div class="notifications-toggle">
            <ha-formfield .label=${this._t('settings.show_notifications')}>
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
      this._t('domain.weather'),
      this._t('settings.weather_description'),
      html`
        <div class="weather-section">
          <div class="weather-toggle">
            <ha-formfield .label=${this._t('settings.show_weather')}>
              <ha-switch
                .checked=${this._config?.settings?.show_weather !== false}
                @change=${this._toggleWeatherDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${this._config?.settings?.show_weather !== false ? html`
            <div class="weather-picker">
              <div class="weather-picker-header">
                <h4>${this._t('settings.selected_weather')}</h4>
                <ha-button appearance="outlined" size="s" @click=${this._addWeatherEntity}>
                  <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  ${this._t('settings.select_weather')}
                </ha-button>
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
      this._t('domain.alarm_control_panel'),
      this._t('settings.alarm_description'),
      html`
        <div class="alarm-section">
          <div class="alarm-toggle">
            <ha-formfield .label=${this._t('settings.show_alarm')}>
              <ha-switch
                .checked=${Boolean(this._config?.settings?.alarm_entity_id) && this._config?.settings?.show_alarm !== false}
                .disabled=${!this._config?.settings?.alarm_entity_id}
                @change=${this._toggleAlarmDisplay}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.show_alarm_description')}</p>
          </div>
          <div class="alarm-picker">
            <div class="alarm-picker-header">
              <h4>${this._t('settings.selected_alarm')}</h4>
              <ha-button appearance="outlined" size="s" @click=${this._addAlarmEntity}>
                <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t('settings.select_alarm')}
              </ha-button>
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
      this._t('settings.devices_page'),
      this._t('settings.devices_description'),
      html`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.hide_unavailable_devices')}>
              <ha-switch
                .checked=${this._config?.settings?.hide_unavailable_entities_on_devices !== false}
                @change=${this._toggleHideUnavailableEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.hide_unavailable_devices_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.show_new_devices')}>
              <ha-switch
                .checked=${this._config?.settings?.show_recent_devices_panel !== false}
                @change=${this._toggleRecentDevicesPanel}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.show_new_devices_description')}</p>
          </div>
          ${this._renderDeviceVisibilityTree()}
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
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.restrict_ha_menu')}>
              <ha-switch
                .checked=${this._config?.settings?.restrict_non_admin_ha_sidebar === true}
                @change=${this._toggleRestrictNonAdminHaSidebar}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.restrict_ha_menu_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.restrict_editing')}>
              <ha-switch
                .checked=${this._config?.settings?.restrict_non_admin_dashboard_settings === true}
                @change=${this._toggleRestrictNonAdminDashboardSettings}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.restrict_editing_description')}</p>
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
    return this._renderSettingsPanel(
      "mdi:floor-plan",
      this._t('settings.areas'),
      this._t('settings.areas_page_description'),
      html`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.hide_unavailable_areas')}>
              <ha-switch
                .checked=${this._config?.settings?.hide_unavailable_entities !== false}
                @change=${this._toggleHideUnavailableAreaEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.hide_unavailable_areas_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.hide_area_name')}>
              <ha-switch
                .checked=${hidesAreaNameInEntityNames(this._config?.settings)}
                @change=${this._toggleHideAreaName}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.hide_area_name_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.hide_energy_sensors')}>
              <ha-switch
                .checked=${this._config?.settings?.hide_energy_sensors_on_area_pages === true}
                @change=${this._toggleHideEnergySensors}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.hide_energy_sensors_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('thermostat.setting_label')}>
              <ha-switch
                .checked=${this._config?.settings?.show_area_thermostat !== false}
                @change=${this._toggleAreaThermostat}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('thermostat.setting_description')}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.show_area_favorites')}>
              <ha-switch
                .checked=${this._config?.settings?.show_area_favorites !== false}
                @change=${this._toggleAreaFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              ${this._t('settings.show_area_favorites_description')}
              ${this._renderManageFavoritesLink('areas')}
            </p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t('settings.show_area_now_playing')}>
              <ha-switch
                .checked=${isAreaNowPlayingEnabled(this._config?.settings)}
                @change=${this._toggleAreaNowPlaying}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t('settings.show_area_now_playing_description')}</p>
          </div>
          ${this._renderAreasConfiguration()}
        </div>
      `
    );
  }

  private _renderAreasConfiguration() {
    if (!this.hass || !this._config) return nothing;

    const areas = Object.values(this.hass.areas || {});
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const sortMode = resolveAreaSortMode(this._config.areas_display);
    const storedAreas = sortAreas(
      areas,
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    );
    const areaById = new Map(storedAreas.map((area) => [area.area_id, area]));
    const sortedAreas = this._previewOrder('areas', storedAreas.map((area) => area.area_id))
      .map((areaId) => areaById.get(areaId)!);
    const sortModes: Array<{ mode: AreaSortMode; icon: string }> = [
      { mode: 'home_assistant', icon: 'mdi:home-assistant' },
      { mode: 'custom', icon: 'mdi:drag-vertical' },
      { mode: 'alphabetical', icon: 'mdi:sort-alphabetical-ascending' },
    ];

    return html`
      <section class="area-order-settings" aria-labelledby="area-order-title">
        <div class="area-order-heading">
          <strong id="area-order-title">${this._t('settings.area_order_title')}</strong>
          <span>${this._t('settings.area_order_description')}</span>
        </div>
        <div class="area-order-modes" role="radiogroup" aria-label=${this._t('settings.area_order_title')}>
          ${sortModes.map(({ mode, icon }) => html`
            <button
              type="button"
              class="area-order-mode ${sortMode === mode ? 'selected' : ''}"
              role="radio"
              aria-checked=${sortMode === mode ? 'true' : 'false'}
              @click=${() => this._setAreaSortMode(mode)}
            >
              <ha-icon .icon=${icon}></ha-icon>
              <span>
                <strong>${this._t(`settings.area_order_${mode}`)}</strong>
                <small>${this._t(`settings.area_order_${mode}_description`)}</small>
              </span>
            </button>
          `)}
        </div>
        ${sortMode === 'custom' ? html`
          <p class="area-order-hint">${this._t('settings.area_order_drag_hint')}</p>
        ` : nothing}
      </section>

      <div class="sortable-container ${sortMode === 'custom' ? 'is-custom-order' : ''} ${this._draggedAreaId ? 'dragging' : ''}">
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
                .draggable=${sortMode === 'custom'}
                @dragstart=${(e: DragEvent) => sortMode === 'custom' && this._handleAreaDragStart(e, area.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${(e: DragEvent) => sortMode === 'custom' && this._handleAreaDragOver(e, index)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${(e: DragEvent) => sortMode === 'custom' && this._handleAreaDrop(e, index)}
              >
                <div class="area-item">
                  <div class="handle ${sortMode !== 'custom' ? 'disabled' : ''}" aria-hidden="true">
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  ${area.icon ? html`
                    <ha-icon
                      .icon=${area.icon}
                      class="area-icon"
                    ></ha-icon>
                  ` : nothing}
                  <button
                    type="button"
                    class="area-name clickable"
                    aria-label=${`${this._t('common.edit')}: ${area.name}`}
                    @click=${() => this._editArea(area.area_id)}
                  >
                    <span class="area-name-text">${area.name}</span>
                    <ha-icon icon="mdi:chevron-right" class="chevron" aria-hidden="true"></ha-icon>
                  </button>
                  <div class="area-actions">
                    ${sortMode === 'custom' ? html`
                      <ha-icon-button
                        .label=${this._t('settings.move_up')}
                        .path=${mdiArrowUp}
                        .disabled=${index === 0}
                        @click=${() => this._moveArea(area.area_id, -1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t('settings.move_down')}
                        .path=${mdiArrowDown}
                        .disabled=${index === sortedAreas.length - 1}
                        @click=${() => this._moveArea(area.area_id, 1)}
                      ></ha-icon-button>
                    ` : nothing}
                    <ha-icon-button
                      .label=${this._t(isHidden ? 'common.show' : 'common.hide')}
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
      <div class="settings-reset-row">
        <button
          class="home-layout-reset"
          type="button"
          ?disabled=${isAreasDisplayDefault(this._config.areas_display)}
          @click=${this._resetAreasConfiguration}
        >
          ${this._t('settings.reset_area_list')}
        </button>
      </div>
    `;
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

    // Config entities of this area plus states that only the registry places here.
    const areaEntities = this._areaEditorEntities(this._area);

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
    const displayedUngroupedEntities = this._previewOrder(this._entityDragList(UNGROUPED_ENTITY_DRAG_GROUP), sortedUngroupedEntities);
    const customCards = this._getAreaEditorCustomCards();
    const storedGroupedSections = this._sortAreaStrategyGroups(
      AREA_STRATEGY_GROUPS.filter((group) =>
        (groups[group] || []).length > 0 || customCards.some((entry) =>
          entry.placement === `after:${group}` ||
          this._domainCustomCardPlacementIndex(entry.placement, group) !== undefined
        )
      )
    );
    const groupedSections = this._previewOrder(`area-groups:${this._area}`, storedGroupedSections);

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
              ${this._t('settings.area_sensor_help_before')}
              <button class="link" @click=${this._editAreaRegistry}>${this._t('settings.edit_room')}</button>${this._t('settings.area_sensor_help_after')}
            </p>
            <p>
              ${this._t('settings.area_power_help')}
            </p>
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


        ${this._config.settings?.hide_energy_sensors_on_area_pages === true ? html`
          <section class="area-entity-layout-settings area-energy-sensors-settings">
            <ha-formfield .label=${this._t('settings.area_show_energy_sensors')}>
              <ha-switch
                .checked=${areaOptions.show_energy_sensors === true}
                @change=${this._toggleAreaShowEnergySensors}
              ></ha-switch>
            </ha-formfield>
            <span class="area-energy-sensors-description">${this._t('settings.area_show_energy_sensors_description')}</span>
          </section>
        ` : nothing}

        <section class="area-entity-layout-settings">
          <div class="area-entity-layout-copy">
            <strong>${this._t('settings.area_entity_layout_title')}</strong>
            <span>${this._t('settings.area_entity_layout_description')}</span>
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
                <small>${this._t('settings.area_entity_layout_grouped_description')}</small>
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
                <small>${this._t('settings.area_entity_layout_ungrouped_description')}</small>
              </span>
            </button>
          </div>
        </section>

        ${entityLayout === 'ungrouped' ? html`
          <ha-expansion-panel expanded outlined>
            <div slot="header">
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              ${this._t('settings.area_entity_order')}
            </div>
            <p class="area-order-hint secondary">${this._t('settings.area_entity_order_hint')}</p>
            <div class="sortable-container dragging-enabled ${this._draggedEntityGroup === UNGROUPED_ENTITY_DRAG_GROUP ? 'dragging' : ''}">
              ${this._getAreaEditorFreeCardsForSlot(customCards, 0, displayedUngroupedEntities, entityGroupById)
                .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
              ${repeat(
                displayedUngroupedEntities,
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
                          ${this._areaEditorEntityName(entityId, area.name)}
                          <small>${this._getGroupTitle(entityGroup)}</small>
                        </span>
                        <div class="entity-order-buttons">
                          <ha-icon-button
                            .label=${this._t('settings.move_up')}
                            .path=${mdiArrowUp}
                            .disabled=${index === 0}
                            @click=${() => this._moveUngroupedEntity(sortedUngroupedEntities, index, -1)}
                          ></ha-icon-button>
                          <ha-icon-button
                            .label=${this._t('settings.move_down')}
                            .path=${mdiArrowDown}
                            .disabled=${index === sortedUngroupedEntities.length - 1}
                            @click=${() => this._moveUngroupedEntity(sortedUngroupedEntities, index, 1)}
                          ></ha-icon-button>
                        </div>
                        <ha-icon-button
                          .label=${isHidden ? this._t('common.show') : this._t('common.hide')}
                          .path=${isHidden ? mdiEye : mdiEyeOff}
                          @click=${() => this._toggleEntityVisibility(entityId, entityGroup)}
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${this._getAreaEditorFreeCardsForSlot(customCards, index + 1, displayedUngroupedEntities, entityGroupById)
                      .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
                  `;
                }
              )}
              ${this._renderAreaCustomCardDropZone(`ungrouped:${sortedUngroupedEntities.length}`)}
            </div>
          </ha-expansion-panel>
        ` : repeat(groupedSections, (group) => group, (group, groupIndex) => {
          // Get ALL entities for this group (don't filter hidden ones)
          const allGroupEntities = groups[group] || [];
          const groupOptions = this._config!.areas_options?.[this._area!]?.groups_options?.[group];
          const hiddenEntities = new Set(groupOptions?.hidden || []);
          const entityOrder = groupOptions?.order || [];

          // Stored order, or the order of a drag in progress.
          const sortedEntities = this._previewOrder(
            this._entityDragList(group),
            this._sortEntityIds(allGroupEntities, entityOrder)
          );
          const groupHiddenCount = countHidden(allGroupEntities, hiddenEntities);
          const groupVisibilityState = groupVisibility(allGroupEntities.length, groupHiddenCount);

          return html`
            <div
              class="area-entity-section ${groupVisibilityState === 'hidden' ? 'is-hidden' : ''} ${this._draggedEntitySection === group ? 'dragging' : ''} ${this._dragOverEntitySection === group ? 'drag-over' : ''}"
              @dragover=${(event: DragEvent) => this._handleEntitySectionDragOver(event, group)}
              @drop=${(event: DragEvent) => this._handleEntitySectionDrop(event, group, storedGroupedSections)}
            >
              <ha-expansion-panel
                outlined
                .expanded=${!this._collapsedAreaGroups.has(group)}
                @expanded-changed=${(event: CustomEvent<{ expanded: boolean }>) => this._handleAreaGroupExpandedChanged(event, group)}
              >
                <div slot="header" class="area-entity-section-header">
                  <ha-icon icon=${AREA_STRATEGY_GROUP_ICONS[group]}></ha-icon>
                  <span class="area-entity-section-title">
                    ${this._getGroupTitle(group)}
                    ${groupVisibilityState !== 'visible' ? html`
                      <small>${this._t('settings.visible_count', {
                        visible: allGroupEntities.length - groupHiddenCount,
                        total: allGroupEntities.length,
                      })}</small>
                    ` : nothing}
                  </span>
                  <span class="area-entity-section-actions">
                    ${allGroupEntities.length ? this._renderVisibilityButton(
                      groupVisibilityState,
                      hidesOnToggle(groupVisibilityState) ? this._t('settings.hide_group') : this._t('settings.show_group'),
                      () => this._setAreaEntityGroupHidden(group, allGroupEntities, hidesOnToggle(groupVisibilityState))
                    ) : nothing}
                    <ha-icon-button
                      .label=${this._t('settings.move_up')}
                      .path=${mdiArrowUp}
                      .disabled=${groupIndex === 0}
                      @click=${(event: Event) => this._moveEntitySection(event, storedGroupedSections, groupIndex, -1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t('settings.move_down')}
                      .path=${mdiArrowDown}
                      .disabled=${groupIndex === groupedSections.length - 1}
                      @click=${(event: Event) => this._moveEntitySection(event, storedGroupedSections, groupIndex, 1)}
                    ></ha-icon-button>
                    <button
                      class="area-entity-section-handle"
                      type="button"
                      draggable="true"
                      title=${this._t('layout.drag_group')}
                      aria-label=${this._t('layout.drag_group')}
                      @click=${(event: Event) => event.stopPropagation()}
                      @dragstart=${(event: DragEvent) => this._handleEntitySectionDragStart(event, group, storedGroupedSections)}
                      @dragend=${this._handleEntitySectionDragEnd}
                    >
                      <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                    </button>
                  </span>
                </div>
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
                            ${this._areaEditorEntityName(entityId, area.name)}
                          </span>
                          <ha-icon-button
                            .label=${isHidden ? this._t('common.show') : this._t('common.hide')}
                            .path=${isHidden ? mdiEye : mdiEyeOff}
                            @click=${() => this._toggleEntityVisibility(entityId, group)}
                          ></ha-icon-button>
                        </div>
                      </div>
                      ${this._getAreaEditorDomainCardsForSlot(customCards, group, index + 1, sortedEntities.length)
                        .map((entry) => this._renderAreaCustomCardEditorRow(entry))}
                    `;
                  }
                )}
                  ${this._renderAreaCustomCardDropZone(`domain:${group}:${sortedEntities.length}`)}
                </div>
              </ha-expansion-panel>
            </div>
          `;
        })}
        ${customCards.length || this._draggedAreaCustomCardId
          ? this._renderAreaCustomCardPlacement(customCards, 'bottom', this._t('layout.custom_cards_bottom'))
          : nothing}
        <div class="settings-reset-row area-editor-reset-row">
          ${entityLayout === 'grouped' ? html`
            <button
              class="home-layout-reset"
              type="button"
              title=${this._t('settings.apply_group_order_all_description')}
              ?disabled=${!this._areaGroupOrderChanged}
              @click=${this._applyAreaGroupOrderToAllAreas}
            >
              ${this._t('settings.apply_group_order_all')}
            </button>
          ` : nothing}
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${isAreaLayoutDefault(areaOptions)}
            @click=${this._resetAreaLayout}
          >
            ${this._t('settings.reset_room_layout')}
          </button>
        </div>
      </div>
    `;
  }

  /** Entity name in the room settings, like the room page shows it. */
  private _areaEditorEntityName(entityId: string, areaName: string): string {
    const fullName = this.hass?.states?.[entityId]?.attributes?.friendly_name || entityId;
    return areaEntityDisplayName(String(fullName), areaName, this._config?.settings);
  }

  private _getHomeSectionsOrder(): HomeSectionKey[] {
    return normalizeHomeSectionsOrder(this._config?.settings?.home_sections_order);
  }

  private _getHiddenHomeSections(): Set<HomeSectionKey> {
    return new Set(resolveHiddenHomeSections(this._config?.settings));
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
      const registry = getEntityRegistry(this.hass)[entityId];
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

  private _moveHomeCamera(entityId: string, direction: -1 | 1): void {
    const order = this._getHomeCameraSettings().map(camera => camera.entityId);
    const index = order.indexOf(entityId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target]!, order[index]!];
    this._setHomeCameraOrder(order);
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

    // Order and hidden list are saved together, so sections that older
    // settings hide (Now playing) stay hidden once they are managed here.
    const newConfig: DwainsDashboardConfig = {
      ...this._config,
      settings: {
        ...this._config.settings,
        home_sections_order: normalizeHomeSectionsOrder(order),
        home_sections_hidden: [...this._getHiddenHomeSections()],
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
    const order = this._previewOrder('home-sections', this._getHomeSectionsOrder());
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

              const detail = this._homeSectionDetail(section);
              const isFavorites = section === 'favorites';
              const hasDetail = Boolean(detail) || isFavorites;
              return html`
                <div
                  class="home-section-item ${enabled ? '' : 'disabled'} ${hasDetail ? 'has-detail' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
                  draggable="true"
                  data-section=${section}
                  data-index=${index}
                  @click=${() => isFavorites ? this._openFavoritesFrom('home') : detail && this._openHomeSectionDetail(section)}
                  @dragstart=${(e: DragEvent) => this._handleHomeSectionDragStart(e, section)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${(e: DragEvent) => this._handleHomeSectionDragOver(e, index)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${(e: DragEvent) => this._handleHomeSectionDrop(e, index)}
                >
                  <div class="home-section-handle" @click=${(event: Event) => event.stopPropagation()}>
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon">
                    <ha-icon icon=${meta.icon}></ha-icon>
                  </div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(meta.labelKey)}</div>
                    <div class="home-section-description">
                      ${this._t(meta.descriptionKey)}
                      ${isFavorites ? this._renderManageFavoritesLink('home') : nothing}
                    </div>
                  </div>
                  ${hasDetail ? html`<ha-svg-icon class="home-section-detail-chevron" .path=${mdiChevronRight}></ha-svg-icon>` : nothing}
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
                    <ha-icon-button
                      .label=${this._t('settings.move_up')}
                      .path=${mdiArrowUp}
                      .disabled=${index === 0}
                      @click=${() => this._moveHomeSection(section, -1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t('settings.move_down')}
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
          ${this._t('settings.reset_layout')}
        </button>
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

  private async _deleteHomeCustomCard(id: string): Promise<void> {
    const confirmed = await showConfirmDialog(this, {
      hass: this.hass,
      title: this._t('layout.delete_card_confirm'),
      message: this._t('layout.delete_card_message'),
      confirmLabel: this._t('common.delete'),
      destructive: true,
    });
    if (!confirmed) return;
    this._updateHomeCustomCards(this._getHomeCustomCards().filter(card => card.id !== id));
  }

  private _moveHomeCustomCard(id: string, direction: -1 | 1): void {
    const cards = this._getHomeCustomCards();
    const index = cards.findIndex(card => card.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= cards.length) return;

    const next = [...cards];
    [next[index], next[target]] = [next[target]!, next[index]!];
    this._updateHomeCustomCards(next);
  }

  private _renderHomeCustomCardsSettings() {
    const cards = this._getHomeCustomCards();

    return html`
      <div class="home-info-card-section home-custom-card-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t('settings.home_custom_cards')}</h4>
            <p>${this._t('settings.home_custom_cards_description')}</p>
          </div>
          <button class="home-custom-card-add" type="button" @click=${this._addHomeCustomCard}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t('settings.add_home_card')}
          </button>
        </div>
        ${cards.length ? html`
          <div class="home-custom-card-settings-list">
            ${repeat(
              cards,
              entry => entry.id,
              (entry, index) => html`
                <div class="home-info-card-item home-custom-card-settings-item">
                  <div class="home-section-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._homeCustomCardTitle(entry)}</div>
                    <div class="home-section-description">${this._homeCustomCardSubtitle(entry)}</div>
                  </div>
                  <div class="home-section-actions">
                    <ha-icon-button
                      .label=${this._t('settings.move_up')}
                      .path=${mdiArrowUp}
                      .disabled=${index === 0}
                      @click=${() => this._moveHomeCustomCard(entry.id, -1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t('settings.move_down')}
                      .path=${mdiArrowDown}
                      .disabled=${index === cards.length - 1}
                      @click=${() => this._moveHomeCustomCard(entry.id, 1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t('common.edit')}
                      .path=${mdiPencil}
                      @click=${() => this._editHomeCustomCard(entry.id)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t('common.delete')}
                      .path=${mdiDelete}
                      @click=${() => this._deleteHomeCustomCard(entry.id)}
                    ></ha-icon-button>
                  </div>
                </div>
              `
            )}
          </div>
        ` : html`
          <div class="home-camera-settings-empty">${this._t('settings.no_home_custom_cards')}</div>
        `}
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

  private _renderHomeClimateAreaSettings() {
    if (!this._config || !this.hass) return nothing;
    const excluded = this._getExcludedHomeClimateAreas();
    const outdoor = this._getHomeOutdoorClimateAreas();
    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    const areas = sortAreas(this._config.areas || [], { ...this._config.areas_display, hidden: [] }, ddLocale(this.hass))
      .filter(area => !hiddenAreas.has(area.area_id));
    return html`
      <div class="home-info-card-section home-climate-area-settings">
        <div class="home-info-card-header"><div><h4>${this._t('settings.home_climate_areas_title')}</h4><p>${this._t('settings.home_climate_areas_description')}</p></div></div>
        <div class="home-info-card-list">
          ${areas.map(area => {
            // Outdoor areas are always left out of the indoor average.
            const isOutdoor = outdoor.has(area.area_id);
            const included = !isOutdoor && !excluded.has(area.area_id);
            return html`
              <div class="home-info-card-item ${included ? 'enabled' : 'disabled'}">
                <div class="home-section-icon"><ha-icon icon=${area.icon || 'mdi:floor-plan'}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${area.name}</div>
                  ${isOutdoor ? html`<div class="home-section-description">${this._t('settings.home_climate_area_outdoor')}</div>` : nothing}
                </div>
                <ha-switch
                  .checked=${included}
                  ?disabled=${isOutdoor}
                  @change=${(event: Event) => this._toggleHomeClimateArea(area.area_id, (event.target as any).checked)}
                ></ha-switch>
              </div>
            `;
          })}
        </div>
      </div>
    `;
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

  private _renderHomeOutdoorClimateAreaSettings() {
    if (!this._config || !this.hass) return nothing;
    const outdoor = this._getHomeOutdoorClimateAreas();
    // Hidden areas are listed too: a garden or roof is often hidden from the
    // dashboard but still has the outdoor sensors.
    const areas = sortAreas(this._config.areas || [], { ...this._config.areas_display, hidden: [] }, ddLocale(this.hass));
    return html`
      <div class="home-info-card-section home-climate-area-settings">
        <div class="home-info-card-header"><div><h4>${this._t('settings.home_outdoor_climate_areas_title')}</h4><p>${this._t('settings.home_outdoor_climate_areas_description')}</p></div></div>
        <div class="home-info-card-list">
          ${areas.map(area => { const isOutdoor = outdoor.has(area.area_id); return html`
            <div class="home-info-card-item ${isOutdoor ? 'enabled' : 'disabled'}">
              <div class="home-section-icon"><ha-icon icon=${area.icon || 'mdi:floor-plan'}></ha-icon></div>
              <div class="home-section-copy"><div class="home-section-title">${area.name}</div></div>
              <ha-switch .checked=${isOutdoor} @change=${(event: Event) => this._toggleHomeOutdoorClimateArea(area.area_id, (event.target as any).checked)}></ha-switch>
            </div>
          `; })}
        </div>
      </div>
    `;
  }

  private _renderHomeInformationCardSettings() {
    const hiddenCards = this._getHiddenHomeInformationCards();
    const visibleCount = DEFAULT_HOME_INFORMATION_CARDS.filter(card => !hiddenCards.has(card)).length;

    return html`
      <div class="home-info-card-section home-information-card-settings">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t('settings.house_information_cards')}</h4>
            <p>${this._t('settings.house_information_cards_description')}</p>
          </div>
          <span>${this._t('settings.visible_count', { visible: visibleCount, total: DEFAULT_HOME_INFORMATION_CARDS.length })}</span>
        </div>
        <div class="home-info-card-list">
          ${DEFAULT_HOME_INFORMATION_CARDS.map(card => {
            const meta = HOME_INFORMATION_CARD_META[card];
            const enabled = !hiddenCards.has(card);
            const detail = card === 'climate' || card === 'outdoor_climate' ? card : undefined;
            const clickable = Boolean(detail);

            return html`
              <div
                class="home-info-card-item ${enabled ? 'enabled' : 'disabled'} ${clickable ? 'has-detail' : ''}"
                @click=${() => { if (detail) this._homeSettingsDetail = detail; }}
              >
                <div class="home-section-icon"><ha-icon icon=${meta.icon}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${this._t(meta.labelKey)}</div>
                  <div class="home-section-description">${this._t(meta.descriptionKey)}</div>
                </div>
                <div class="home-info-card-actions" @click=${(event: Event) => event.stopPropagation()}>
                  ${clickable ? html`<ha-svg-icon class="home-section-detail-chevron" .path=${mdiChevronRight}></ha-svg-icon>` : nothing}
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
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHomeCameraSettings() {
    const storedCameras = this._getHomeCameraSettings();
    const cameraById = new Map(storedCameras.map(camera => [camera.entityId, camera]));
    const cameras = this._previewOrder('home-cameras', storedCameras.map(camera => camera.entityId))
      .map(entityId => cameraById.get(entityId)!);
    const hidden = new Set(this._config?.settings?.home_cameras_hidden || []);
    const visibleCount = cameras.filter(camera => !hidden.has(camera.entityId)).length;

    return html`
      <div class="home-info-card-section home-camera-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t('settings.home_camera_cards')}</h4>
            <p>${this._t('settings.home_camera_cards_description')}</p>
          </div>
          ${cameras.length
            ? html`<span>${this._t('settings.visible_count', { visible: visibleCount, total: cameras.length })}</span>`
            : nothing}
        </div>
        ${cameras.length ? html`
          <div class="home-camera-settings-list ${this._draggedHomeCamera ? 'dragging' : ''}">
            ${repeat(
              cameras,
              camera => camera.entityId,
              (camera, index) => {
                const enabled = !hidden.has(camera.entityId);
                const unavailable = ['unavailable', 'unknown'].includes(String(this.hass?.states[camera.entityId]?.state || '').toLowerCase());
                const isDragging = this._draggedHomeCamera === camera.entityId;
                const isDragOver = this._dragOverHomeCameraIndex === index && isDragging === false && Boolean(this._draggedHomeCamera);
                return html`
                  <div
                    class="home-section-item home-camera-settings-item ${enabled ? '' : 'disabled'} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
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
                      <div class="home-section-description">
                        ${camera.areaName} · ${unavailable ? this._t('common.unavailable') : camera.state}
                      </div>
                    </div>
                    <div class="home-section-actions">
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
                      <ha-icon-button
                        .label=${this._t('settings.move_up')}
                        .path=${mdiArrowUp}
                        .disabled=${index === 0}
                        @click=${() => this._moveHomeCamera(camera.entityId, -1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t('settings.move_down')}
                        .path=${mdiArrowDown}
                        .disabled=${index === cameras.length - 1}
                        @click=${() => this._moveHomeCamera(camera.entityId, 1)}
                      ></ha-icon-button>
                    </div>
                  </div>
                `;
              }
            )}
          </div>
          <button class="home-layout-reset" type="button" @click=${this._resetHomeCameraSettings}>
            ${this._t('settings.reset_camera_cards')}
          </button>
        ` : html`<div class="home-camera-settings-empty">${this._t('settings.home_camera_cards_empty')}</div>`}
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

  private _homeSceneAreaName(entityId: string): string | undefined {
    if (!this.hass || !this._config) return undefined;
    const areaId = resolveStatusEntityAreaId(this.hass, this._config, entityId);
    if (!areaId) return undefined;
    return (this._config.areas || []).find(area => area.area_id === areaId)?.name ||
      this.hass.areas?.[areaId]?.name ||
      undefined;
  }

  private _homeSceneName(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name ||
      getEntityRegistry(this.hass)[entityId]?.name ||
      entityId;
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

  private _openHomeScenePicker = (): void => {
    this._homeSceneSearch = '';
    this._showHomeScenePicker = true;
  };

  private _addHomeScene(entityId: string): void {
    this._setHomeScenes(addHomeScene(this._getHomeScenes(), entityId));
    this._showHomeScenePicker = false;
  }

  private _removeHomeScene(entityId: string): void {
    this._setHomeScenes(removeHomeScene(this._getHomeScenes(), entityId));
  }

  private _moveHomeScene(entityId: string, direction: -1 | 1): void {
    this._setHomeScenes(moveHomeScene(this._getHomeScenes(), entityId, direction));
  }

  private _renderHomeScenesSettings() {
    const picked = this._previewOrder('home-scenes', this._getHomeScenes());

    return html`
      <div class="home-info-card-section home-scene-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t('scenes.settings_title')}</h4>
            ${picked.length ? html`<p>${this._t('scenes.settings_help')}</p>` : nothing}
          </div>
          <button class="home-custom-card-add" type="button" @click=${this._openHomeScenePicker}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t('scenes.add')}
          </button>
        </div>
        ${picked.length ? html`
          <div class="home-camera-settings-list ${this._draggedHomeScene ? 'dragging' : ''}">
            ${repeat(
              picked,
              entityId => entityId,
              (entityId, index) => {
                const state = this.hass?.states[entityId];
                const name = this._homeSceneName(entityId);
                const areaName = this._homeSceneAreaName(entityId);
                const unavailable = Boolean(state && isHiddenAsUnavailable(state));
                const details = !state
                  ? `${this._t('scenes.missing')} · ${entityId}`
                  : [this._homeSceneTypeLabel(entityId), areaName, unavailable ? this._t('common.unavailable') : '']
                    .filter(Boolean)
                    .join(' · ');
                const isDragging = this._draggedHomeScene === entityId;
                const isDragOver = this._dragOverHomeSceneIndex === index && !isDragging && Boolean(this._draggedHomeScene);
                return html`
                  <div
                    class="home-section-item home-scene-settings-item ${state && !unavailable ? '' : 'disabled'} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
                    draggable="true"
                    data-entity-id=${entityId}
                    @dragstart=${(event: DragEvent) => this._handleHomeSceneDragStart(event, entityId)}
                    @dragend=${this._handleHomeSceneDragEnd}
                    @dragover=${(event: DragEvent) => this._handleHomeSceneDragOver(event, index)}
                    @dragleave=${this._handleHomeSceneDragLeave}
                    @drop=${(event: DragEvent) => this._handleHomeSceneDrop(event, index)}
                  >
                    <div class="home-section-handle"><ha-svg-icon .path=${mdiDrag}></ha-svg-icon></div>
                    <div class="home-section-icon">
                      <ha-icon icon=${state ? this._homeSceneIcon(entityId) : 'mdi:help-circle-outline'}></ha-icon>
                    </div>
                    <div class="home-section-copy">
                      <div class="home-section-title">${name}</div>
                      <div class="home-section-description">${details}</div>
                    </div>
                    <div class="home-section-actions">
                      <ha-icon-button
                        .label=${this._t('settings.move_up')}
                        .path=${mdiArrowUp}
                        .disabled=${index === 0}
                        @click=${() => this._moveHomeScene(entityId, -1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t('settings.move_down')}
                        .path=${mdiArrowDown}
                        .disabled=${index === picked.length - 1}
                        @click=${() => this._moveHomeScene(entityId, 1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t('scenes.remove_named', { name })}
                        .path=${mdiDelete}
                        @click=${() => this._removeHomeScene(entityId)}
                      ></ha-icon-button>
                    </div>
                  </div>
                `;
              }
            )}
          </div>
        ` : html`
          <div class="home-camera-settings-empty">${this._t('scenes.settings_empty')}</div>
        `}
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
      <div class="entity-picker-modal" @click=${(event: Event) => {
        if (event.target === event.currentTarget) this._showHomeScenePicker = false;
      }}>
        <div class="entity-picker-content" role="dialog" aria-modal="true" aria-label=${this._t('scenes.picker_title')}>
          <div class="entity-picker-header">
            <h4>${this._t('scenes.picker_title')}</h4>
            <button
              class="close-button"
              type="button"
              title=${this._t('common.close')}
              aria-label=${this._t('common.close')}
              @click=${() => this._showHomeScenePicker = false}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              placeholder=${this._t('scenes.search')}
              aria-label=${this._t('scenes.search')}
              .value=${this._homeSceneSearch}
              @input=${(event: Event) => this._homeSceneSearch = (event.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${repeat(
              options,
              option => option.entityId,
              option => html`
                <button type="button" class="entity-option home-scene-option" @click=${() => this._addHomeScene(option.entityId)}>
                  <ha-icon class="entity-icon" icon=${this._homeSceneIcon(option.entityId)}></ha-icon>
                  <span class="entity-name">
                    <span class="home-scene-option-name">${option.name}</span>
                    <span class="home-scene-option-meta">
                      ${[this._homeSceneTypeLabel(option.entityId), option.areaName].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span class="entity-id">${option.entityId}</span>
                </button>
              `
            )}
            ${options.length === 0 ? html`
              <div class="entity-picker-hint empty">${this._t('scenes.no_results')}</div>
            ` : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _handleHomeSceneDragStart(event: DragEvent, entityId: string): void {
    this._draggedHomeScene = entityId;
    this._startDragPreview('home-scenes', this._getHomeScenes());
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', entityId);
    }
  }

  private _handleHomeSceneDragEnd = (): void => {
    this._draggedHomeScene = undefined;
    this._dragOverHomeSceneIndex = undefined;
    this._cancelDragPreview('home-scenes');
  };

  private _handleHomeSceneDragOver(event: DragEvent, index: number): void {
    if (!this._draggedHomeScene) return;
    event.preventDefault();
    this._dragOverHomeSceneIndex = index;
    this._moveDragPreview('home-scenes', this._draggedHomeScene, index);
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  private _handleHomeSceneDragLeave = (event: DragEvent): void => {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;
    if (!currentTarget?.contains(relatedTarget)) this._dragOverHomeSceneIndex = undefined;
  };

  private _handleHomeSceneDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const dragged = this._draggedHomeScene;
    if (!dragged) return;
    this._moveDragPreview('home-scenes', dragged, dropIndex);
    const next = this._finishDragPreview('home-scenes', this._getHomeScenes());
    this._handleHomeSceneDragEnd();
    if (next) this._setHomeScenes(next);
  }

  /**
   * Devices page visibility as a tree: type > area > device > entity. The
   * type eye hides the type group in the sidebar, the area and entity eyes
   * hide entities on the Devices page only and the device switch hides a
   * complete device in all of Dwains Dashboard.
   */
  private _renderDeviceVisibilityTree() {
    const types = this._getDeviceVisibilityTree();
    if (!types.length) {
      return html`
        <div class="device-visibility-section">
          <div class="device-types-header">
            <div>
              <h4>${this._t('settings.devices_page_types')}</h4>
              <p>${this._t('settings.no_hidden_devices')}</p>
            </div>
          </div>
        </div>
      `;
    }

    const hiddenTypes = this._getHiddenDeviceTypes();
    const visibleTypeCount = types.filter((type) => !hiddenTypes.has(type.key)).length;

    return html`
      <div class="device-visibility-section">
        <div class="device-types-header">
          <div>
            <h4>${this._t('settings.devices_page_types')}</h4>
            <p>${this._t('settings.devices_visibility_description')}</p>
          </div>
          <span>${this._t('settings.visible_count', { visible: visibleTypeCount, total: types.length })}</span>
        </div>
        <div class="device-visibility-tree">
          ${repeat(types, (type) => type.key, (type) => this._renderDeviceVisibilityType(type))}
        </div>
        <div class="settings-reset-row">
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${isDeviceVisibilityDefault(this._config?.settings, this._config?.device_admission)}
            @click=${this._resetDeviceVisibility}
          >
            ${this._t('settings.reset_devices_visibility')}
          </button>
        </div>
      </div>
    `;
  }

  private _renderDeviceVisibilityType(type: DeviceVisibilityTypeNode) {
    // The eye shows the choices made on this page; the count also leaves out
    // the entities of hidden devices.
    const typeHidden = this._getHiddenDeviceTypes().has(type.key);
    const entitiesVisibility = idsVisibility(type.entityIds, this._getDevicesPageHiddenEntityIds());
    const visibility: GroupVisibility = typeHidden ? 'hidden' : entitiesVisibility;
    const visibleCount = typeHidden
      ? 0
      : type.entityIds.length - countHidden(type.entityIds, this._getDeviceVisibilityHiddenEntities());
    const expandable = type.areas.length > 0;
    const expanded = expandable && this._expandedDeviceTypes.has(type.key);

    return html`
      <section
        class="device-visibility-type is-${visibility} ${expanded ? 'open' : ''}"
        style=${`--device-type-color: ${type.color};`}
      >
        <div class="device-visibility-type-row">
          <button
            class="device-visibility-type-toggle"
            type="button"
            aria-expanded=${expandable ? (expanded ? 'true' : 'false') : nothing}
            ?disabled=${!expandable}
            @click=${() => this._toggleExpandedDeviceType(type.key)}
          >
            <span class="device-type-icon small"><ha-icon icon=${type.icon}></ha-icon></span>
            <span class="device-visibility-copy">
              <strong>${type.label}</strong>
              <small>${this._t('settings.visible_count', { visible: visibleCount, total: type.entityIds.length })}</small>
            </span>
            ${expandable ? html`
              <ha-icon class="device-visibility-chevron" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
            ` : nothing}
          </button>
          ${this._renderVisibilityButton(
            visibility,
            hidesOnToggle(visibility) ? this._t('settings.hide_type') : this._t('settings.show_type'),
            () => this._toggleDeviceTypeVisibility(type, entitiesVisibility)
          )}
        </div>
        ${expanded ? html`
          <div class="device-visibility-areas">
            ${repeat(type.areas, (area) => area.areaId, (area) => this._renderDeviceVisibilityArea(type, area, typeHidden))}
          </div>
        ` : nothing}
      </section>
    `;
  }

  private _renderDeviceVisibilityArea(type: DeviceVisibilityTypeNode, area: DeviceVisibilityAreaNode, typeHidden: boolean) {
    const hiddenCount = countHidden(area.entityIds, this._getDeviceVisibilityHiddenEntities());
    const visibility = idsVisibility(area.entityIds, this._getDevicesPageHiddenEntityIds());
    const hide = hidesOnToggle(visibility);

    return html`
      <section class="device-visibility-area ${typeHidden ? 'type-hidden' : ''}">
        <div class="device-visibility-area-header">
          <span class="device-visibility-copy">
            <strong>${area.areaName}</strong>
            <small>${this._t('settings.visible_count', { visible: area.entityIds.length - hiddenCount, total: area.entityIds.length })}</small>
          </span>
          ${this._renderVisibilityButton(
            visibility,
            hide ? this._t('settings.hide_area') : this._t('settings.show_area'),
            () => this._setDevicesPageEntitiesHidden(area.entityIds, hide)
          )}
        </div>
        ${repeat(
          area.devices,
          (device) => `${type.key}-${area.areaId}-${device.deviceId || ''}`,
          (device) => this._renderDeviceVisibilityDevice(type, area, device)
        )}
      </section>
    `;
  }

  private _renderDeviceVisibilityDevice(
    type: DeviceVisibilityTypeNode,
    area: DeviceVisibilityAreaNode,
    device: DeviceVisibilityDeviceNode
  ) {
    const deviceId = device.deviceId;
    return html`
      <div class="device-visibility-device ${device.hidden ? 'device-hidden' : ''}">
        ${deviceId ? html`
          <div class="device-visibility-device-row">
            <ha-icon class="device-visibility-device-icon" icon="mdi:devices" aria-hidden="true"></ha-icon>
            <span class="device-visibility-copy">
              <strong>${device.name}</strong>
              <small>${this._t(device.hidden ? 'settings.device_hidden_everywhere' : 'settings.device_visible_everywhere')}</small>
            </span>
            <ha-switch
              .checked=${!device.hidden}
              aria-label=${device.name}
              @change=${(event: Event) => this._setDeviceHidden(deviceId, !(event.target as any).checked)}
            ></ha-switch>
          </div>
        ` : nothing}
        <div class="device-visibility-entities">
          ${repeat(
            device.entityIds,
            (entityId) => entityId,
            (entityId) => this._renderDeviceVisibilityEntity(type, area, entityId, device.hidden)
          )}
        </div>
      </div>
    `;
  }

  private _renderDeviceVisibilityEntity(
    type: DeviceVisibilityTypeNode,
    area: DeviceVisibilityAreaNode,
    entityId: string,
    deviceHidden: boolean
  ) {
    const hidden = this._getDevicesPageHiddenEntityIds().has(entityId);
    const visibility: GroupVisibility = hidden || deviceHidden ? 'hidden' : 'visible';
    const state = this.hass?.states?.[entityId];
    const fullName = String(state?.attributes?.friendly_name || entityId);

    return html`
      <div class="device-visibility-entity is-${visibility}">
        ${state
          ? html`<ha-state-icon class="device-visibility-entity-icon" .hass=${this.hass} .stateObj=${state}></ha-state-icon>`
          : html`<ha-icon class="device-visibility-entity-icon" icon=${type.icon}></ha-icon>`}
        <span class="device-visibility-entity-name" title=${fullName}>
          ${areaEntityDisplayName(fullName, area.areaName, this._config?.settings)}
        </span>
        ${deviceHidden
          ? html`<span class="device-visibility-entity-note">${this._t('settings.hidden_with_device')}</span>`
          : this._renderVisibilityButton(
            visibility,
            hidden ? this._t('common.show') : this._t('common.hide'),
            () => this._setDevicesPageEntitiesHidden([entityId], !hidden)
          )}
      </div>
    `;
  }

  private _toggleExpandedDeviceType(typeKey: string): void {
    const next = new Set(this._expandedDeviceTypes);
    if (next.has(typeKey)) next.delete(typeKey);
    else next.add(typeKey);
    this._expandedDeviceTypes = next;
  }

  /**
   * The type eye: a hidden type is shown again, a type whose entities are all
   * hidden one by one shows them again, and otherwise the type is hidden.
   */
  private _toggleDeviceTypeVisibility(type: DeviceVisibilityTypeNode, entitiesVisibility: GroupVisibility): void {
    if (this._getHiddenDeviceTypes().has(type.key)) {
      this._setDeviceTypeVisible(type.key, true);
    } else if (entitiesVisibility === 'hidden') {
      this._setDevicesPageEntitiesHidden(type.entityIds, false);
    } else {
      this._setDeviceTypeVisible(type.key, false);
    }
  }

  /** Entities hidden on the Devices page only. */
  private _getDevicesPageHiddenEntityIds(): ReadonlySet<string> {
    return getDevicesPageHiddenEntityIdSet(this._config);
  }

  /** Entities the Devices page leaves out: hidden on that page or part of a hidden device. */
  private _getDeviceVisibilityHiddenEntities(): ReadonlySet<string> {
    return this._deviceVisibilityHiddenEntities(this._getDeviceVisibilityEntries(), this._config?.device_admission);
  }

  private _deviceVisibilityHiddenEntities = memoizeOne((
    entries: DeviceVisibilityEntry[],
    admission: DwainsDashboardConfig['device_admission']
  ): ReadonlySet<string> => {
    const hiddenDevices = new Set(admission?.hidden_devices || []);
    const hidden = new Set<string>((admission?.hidden_entities || []).filter(Boolean));
    entries.forEach((entry) => {
      if (entry.deviceId && hiddenDevices.has(entry.deviceId)) hidden.add(entry.entityId);
    });
    return hidden;
  });

  private _setDevicesPageEntitiesHidden(entityIds: string[], hidden: boolean): void {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      device_admission: {
        ...this._config.device_admission,
        hidden_entities: withIdsHidden(this._config.device_admission?.hidden_entities, entityIds, hidden).sort(),
      },
    });
  }

  /** Entities the Devices page can show, with their type, area and device. */
  private _getDeviceVisibilityEntries(): DeviceVisibilityEntry[] {
    if (!this.hass || !this._config) return [];
    return this._deviceVisibilityEntries(this.hass.states, this._config, getEntityRegistry(this.hass));
  }

  private _deviceVisibilityEntries = memoizeOne((
    states: HomeAssistant['states'],
    config: DwainsDashboardConfig,
    registry: ReturnType<typeof getEntityRegistry>
  ): DeviceVisibilityEntry[] => {
    const entries: DeviceVisibilityEntry[] = [];
    const processed = new Set<string>();
    const knownAreas = new Set((config.areas || []).map((area) => area.area_id));
    const hiddenAreas = new Set(config.areas_display?.hidden || []);
    const deviceAreas = new Map((config.devices || []).map((device) => [device.device_id, device.area_id]));
    const hideUnavailable = config.settings?.hide_unavailable_entities_on_devices !== false;

    const addEntity = (entityId: string, areaId?: string | null, deviceId?: string | null) => {
      if (!entityId || processed.has(entityId)) return;
      const entry = registry[entityId];
      if (entry?.hidden_by || entry?.entity_category === 'diagnostic' || entry?.entity_category === 'config') return;

      const resolvedAreaId = areaId || (deviceId ? deviceAreas.get(deviceId) : undefined) || entry?.area_id;
      if (!resolvedAreaId || !knownAreas.has(resolvedAreaId) || hiddenAreas.has(resolvedAreaId)) return;
      if (getAreaHiddenEntityIdSet(config, resolvedAreaId).has(entityId)) return;

      const state = states[entityId];
      if (hideUnavailable && (!state || isHiddenAsUnavailable(state))) return;

      const typeKey = this._deviceTypeKeyForEntityId(entityId);
      if (!typeKey) return;

      processed.add(entityId);
      entries.push({
        entityId,
        typeKey,
        areaId: resolvedAreaId,
        deviceId: deviceId || entry?.device_id || undefined,
      });
    };

    (config.entities || []).forEach((entity) => addEntity(entity.entity_id, entity.area_id, entity.device_id));
    Object.values(states || {}).forEach((state: any) => {
      addEntity(state.entity_id, state.attributes?.area_id, registry[state.entity_id]?.device_id);
    });

    // People have their own group, without areas or devices.
    const hiddenPersons = new Set(config.settings?.hidden_persons || []);
    Object.values(states || {}).forEach((state: any) => {
      const entityId = state.entity_id;
      if (!entityId?.startsWith('person.') || processed.has(entityId) || hiddenPersons.has(entityId)) return;
      if (registry[entityId]?.hidden_by) return;
      processed.add(entityId);
      entries.push({ entityId, typeKey: 'person', areaId: '' });
    });

    return entries;
  });

  private _getDeviceVisibilityTree(): DeviceVisibilityTypeNode[] {
    if (!this.hass || !this._config) return [];
    return this._deviceVisibilityTree(this._getDeviceVisibilityEntries(), this._config, ddLocale(this.hass));
  }

  private _deviceVisibilityTree = memoizeOne((
    entries: DeviceVisibilityEntry[],
    config: DwainsDashboardConfig,
    locale: string
  ): DeviceVisibilityTypeNode[] => {
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
    const devicesById = this._getAllDevicesById();
    const hiddenDevices = new Set(config.device_admission?.hidden_devices || []);
    const orderedAreas = sortAreas(config.areas || [], { ...config.areas_display, hidden: [] }, locale);
    const areaIndex = new Map(orderedAreas.map((area, index) => [area.area_id, index]));
    const areaNames = new Map(orderedAreas.map((area) => [area.area_id, area.name]));
    const entityName = (entityId: string) => String(this.hass?.states?.[entityId]?.attributes?.friendly_name || entityId);
    const byName = (a: string, b: string) => collator.compare(entityName(a), entityName(b));

    const byType = new Map<string, DeviceVisibilityEntry[]>();
    entries.forEach((entry) => {
      const list = byType.get(entry.typeKey) || [];
      list.push(entry);
      byType.set(entry.typeKey, list);
    });

    return [...byType.entries()]
      .map(([key, typeEntries]) => {
        const byArea = new Map<string, DeviceVisibilityEntry[]>();
        typeEntries.forEach((entry) => {
          if (!entry.areaId) return;
          const list = byArea.get(entry.areaId) || [];
          list.push(entry);
          byArea.set(entry.areaId, list);
        });

        const areas = [...byArea.entries()]
          .sort(([a], [b]) => (areaIndex.get(a) ?? Number.MAX_SAFE_INTEGER) - (areaIndex.get(b) ?? Number.MAX_SAFE_INTEGER))
          .map(([areaId, areaEntries]): DeviceVisibilityAreaNode => {
            const byDevice = new Map<string, string[]>();
            areaEntries.forEach((entry) => {
              const deviceKey = entry.deviceId && devicesById.has(entry.deviceId) ? entry.deviceId : '';
              const list = byDevice.get(deviceKey) || [];
              list.push(entry.entityId);
              byDevice.set(deviceKey, list);
            });
            const devices = [...byDevice.entries()]
              .map(([deviceId, entityIds]): DeviceVisibilityDeviceNode => ({
                deviceId: deviceId || undefined,
                name: deviceId ? devicesById.get(deviceId)?.name || deviceId : '',
                hidden: Boolean(deviceId) && hiddenDevices.has(deviceId),
                entityIds: entityIds.sort(byName),
              }))
              // Entities without a device come last.
              .sort((a, b) => Number(!a.deviceId) - Number(!b.deviceId) || collator.compare(a.name, b.name));
            return {
              areaId,
              areaName: areaNames.get(areaId) || areaId,
              entityIds: devices.flatMap((device) => device.entityIds),
              devices,
            };
          });

        return {
          key,
          label: this._deviceTypeName(key),
          icon: this._deviceTypeIcon(key),
          color: this._deviceTypeColor(key),
          entityIds: areas.length ? areas.flatMap((area) => area.entityIds) : typeEntries.map((entry) => entry.entityId),
          areas,
        };
      })
      .sort((a, b) => collator.compare(a.label, b.label));
  });

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

  private _getHiddenDeviceIds(): Set<string> {
    return new Set(
      (this._config?.device_admission?.hidden_devices || [])
        .filter((deviceId): deviceId is string => typeof deviceId === "string" && deviceId.length > 0)
    );
  }

  private _setDeviceHidden(deviceId: string, hidden: boolean): void {
    if (!this._config) return;

    const nextHidden = this._getHiddenDeviceIds();
    if (hidden) nextHidden.add(deviceId);
    else nextHidden.delete(deviceId);

    this._fireConfigChanged({
      ...this._config,
      device_admission: {
        ...this._config.device_admission,
        hidden_devices: [...nextHidden].sort(),
      },
    });
  }

  private _getDeviceTypeOptions(): Array<{ key: string; label: string; icon: string; color: string; count: number }> {
    return this._getDeviceVisibilityTree().map((type) => ({
      key: type.key,
      label: type.label,
      icon: type.icon,
      color: type.color,
      count: type.entityIds.length,
    }));
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

  private _setAreaEntityLayout(
    layout: AreaEntityLayout,
    entities: string[] = [],
    entityGroupById: Map<string, AreaStrategyGroup> = new Map()
  ): void {
    if (!this._config || !this._area) return;
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

  private _moveUngroupedEntity(order: string[], index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const nextOrder = [...order];
    const [entityId] = nextOrder.splice(index, 1);
    if (!entityId) return;
    nextOrder.splice(targetIndex, 0, entityId);
    this._saveUngroupedEntityOrder(nextOrder);
  }

  /** Config entities of the area: their own area, otherwise the area of their device. */
  private _configAreaEntities(areaId: string): { entity_id: string }[] {
    const config = this._config;
    return (config?.entities || [])
      .filter(entity => isConfigEntityInArea(config, entity, areaId))
      .map(entity => ({ entity_id: entity.entity_id }));
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
      const entityRegistry = getEntityRegistry(hass)[entityId];
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
      } else if (domain === 'script' || domain === 'scene' || domain === 'automation' || domain === 'todo') {
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

  /** The order to show: the drag preview of this list, else the stored order. */
  private _previewOrder<T extends string>(list: string, order: readonly T[]): T[] {
    const preview = this._dragPreview;
    if (preview?.list === list && sameItems(preview.order, order)) return [...preview.order] as T[];
    return [...order];
  }

  private _startDragPreview(list: string, order: readonly string[]): void {
    this._dragPreview = { list, order: [...order] };
  }

  private _moveDragPreview(list: string, item: string | undefined, index: number): void {
    const preview = this._dragPreview;
    if (!item || !preview || preview.list !== list) return;
    const next = moveItemTo(preview.order, item, index);
    if (next !== preview.order) this._dragPreview = { list, order: next };
  }

  /** Ends the drag preview; returns its order when it differs from the stored order. */
  private _finishDragPreview(list: string, stored: readonly string[]): string[] | undefined {
    const preview = this._dragPreview;
    if (preview?.list !== list) return undefined;
    this._dragPreview = undefined;
    if (!sameItems(preview.order, stored) || sameOrder(preview.order, stored)) return undefined;
    return [...preview.order];
  }

  private _cancelDragPreview(list: string): void {
    if (this._dragPreview?.list === list) this._dragPreview = undefined;
  }

  private _handleHomeSectionDragStart(e: DragEvent, section: HomeSectionKey): void {
    this._draggedHomeSection = section;
    this._startDragPreview('home-sections', this._getHomeSectionsOrder());

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", section);
    }
  }

  private _handleHomeSectionDragEnd = (): void => {
    this._draggedHomeSection = undefined;
    this._dragOverHomeSectionIndex = undefined;
    this._cancelDragPreview('home-sections');
  };

  private _handleHomeSectionDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    this._dragOverHomeSectionIndex = index;
    this._moveDragPreview('home-sections', this._draggedHomeSection, index);

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

    this._moveDragPreview('home-sections', dragged, dropIndex);
    const next = this._finishDragPreview('home-sections', this._getHomeSectionsOrder());
    if (next) this._setHomeSectionsOrder(next as HomeSectionKey[]);
    this._handleHomeSectionDragEnd();
  }

  private _handleHomeCameraDragStart(event: DragEvent, entityId: string): void {
    this._draggedHomeCamera = entityId;
    this._startDragPreview('home-cameras', this._getHomeCameraSettings().map(camera => camera.entityId));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', entityId);
    }
  }

  private _handleHomeCameraDragEnd = (): void => {
    this._draggedHomeCamera = undefined;
    this._dragOverHomeCameraIndex = undefined;
    this._cancelDragPreview('home-cameras');
  };

  private _handleHomeCameraDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this._dragOverHomeCameraIndex = index;
    this._moveDragPreview('home-cameras', this._draggedHomeCamera, index);
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

    this._moveDragPreview('home-cameras', dragged, dropIndex);
    const next = this._finishDragPreview('home-cameras', this._getHomeCameraSettings().map(camera => camera.entityId));
    if (next) this._setHomeCameraOrder(next);
    this._handleHomeCameraDragEnd();
  }

  /** Asks before a reset that throws away choices made in the settings. */
  private _confirmReset(title: string, message: string): Promise<boolean> {
    return showConfirmDialog(this, {
      hass: this.hass,
      title,
      message,
      confirmLabel: this._t('settings.reset'),
      destructive: true,
    });
  }

  private _resetAreasConfiguration = async (): Promise<void> => {
    if (!this._config || isAreasDisplayDefault(this._config.areas_display)) return;
    if (!await this._confirmReset(this._t('settings.reset_area_list_confirm'), this._t('settings.reset_area_list_message'))) return;
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      areas_display: resetAreasDisplay(this._config.areas_display),
    });
  };

  private _resetAreaLayout = async (): Promise<void> => {
    const areaId = this._area;
    if (!this._config || !areaId || isAreaLayoutDefault(this._config.areas_options?.[areaId])) return;
    if (!await this._confirmReset(this._t('settings.reset_room_layout_confirm'), this._t('settings.reset_room_layout_message'))) return;
    if (!this._config || this._area !== areaId) return;
    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [areaId]: resetAreaLayout(this._config.areas_options?.[areaId]),
      },
    });
  };

  private _resetDeviceVisibility = async (): Promise<void> => {
    if (!this._config || isDeviceVisibilityDefault(this._config.settings, this._config.device_admission)) return;
    if (!await this._confirmReset(this._t('settings.reset_devices_visibility_confirm'), this._t('settings.reset_devices_visibility_message'))) return;
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      ...resetDeviceVisibility(this._config.settings, this._config.device_admission),
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

  /** Area ids in the order of the area list, hidden areas included. */
  private _sortedAreaIds(): string[] {
    return sortAreas(
      Object.values(this.hass?.areas || {}),
      { ...this._config?.areas_display, hidden: [] },
      ddLocale(this.hass)
    ).map((area) => area.area_id);
  }

  private _handleAreaDragStart(e: DragEvent, areaId: string): void {
    this._draggedAreaId = areaId;
    this._startDragPreview('areas', this._sortedAreaIds());
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', areaId);
    }
  }

  private _handleAreaDragEnd(): void {
    this._draggedAreaId = undefined;
    this._dragOverIndex = undefined;
    this._cancelDragPreview('areas');
  }

  private _handleAreaDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    this._dragOverIndex = index;
    this._moveDragPreview('areas', this._draggedAreaId, index);
  }

  private _handleAreaDragLeave(e: DragEvent): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('sortable-item')) {
      this._dragOverIndex = undefined;
    }
  }

  private _handleAreaDrop(e: DragEvent, dropIndex: number): void {
    e.preventDefault();

    if (
      !this._draggedAreaId ||
      !this._config ||
      resolveAreaSortMode(this._config.areas_display) !== 'custom'
    ) return;

    this._moveDragPreview('areas', this._draggedAreaId, dropIndex);
    const order = this._finishDragPreview('areas', this._sortedAreaIds());
    this._handleAreaDragEnd();
    if (!order) return;

    this._fireConfigChanged({
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        order,
      },
    });
  }

  private _moveArea(areaId: string, direction: -1 | 1): void {
    if (
      !this._config ||
      !this.hass ||
      resolveAreaSortMode(this._config.areas_display) !== 'custom'
    ) return;

    const areas = sortAreas(
      Object.values(this.hass.areas || {}),
      { ...this._config.areas_display, hidden: [] },
      ddLocale(this.hass)
    );
    const currentIndex = areas.findIndex((area) => area.area_id === areaId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= areas.length) return;

    const reordered = [...areas];
    const [area] = reordered.splice(currentIndex, 1);
    if (!area) return;
    reordered.splice(targetIndex, 0, area);

    this._fireConfigChanged({
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        order: reordered.map((entry) => entry.area_id),
      },
    });
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

  // Room pages save their own group keys (cover_shading, safety, ...); the
  // shared mapping puts them in the broad group shown here.
  private _strategyGroupForOrderKey(groupKey: string): AreaStrategyGroup {
    return areaStrategyGroupForKey(groupKey);
  }

  private _sortAreaStrategyGroups(groups: readonly AreaStrategyGroup[]): AreaStrategyGroup[] {
    const configuredOrder = this._config?.areas_options?.[this._area || '']?.group_order || [];
    if (!configuredOrder.length) return [...groups];

    const projectedOrder: AreaStrategyGroup[] = [];
    configuredOrder.forEach((groupKey) => {
      const strategyGroup = this._strategyGroupForOrderKey(groupKey);
      if (!projectedOrder.includes(strategyGroup)) projectedOrder.push(strategyGroup);
    });
    const order = new Map(projectedOrder.map((group, index) => [group, index]));
    return groups
      .map((group, fallbackIndex) => ({ group, fallbackIndex }))
      .sort((a, b) => {
        const aIndex = order.get(a.group);
        const bIndex = order.get(b.group);
        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
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
    const previousOrder = this._config.areas_options?.[this._area]?.group_order || [];
    const previousByGroup = new Map<AreaStrategyGroup, string[]>();
    previousOrder.forEach((groupKey) => {
      const strategyGroup = this._strategyGroupForOrderKey(groupKey);
      const entries = previousByGroup.get(strategyGroup) || [];
      if (!entries.includes(groupKey)) entries.push(groupKey);
      previousByGroup.set(strategyGroup, entries);
    });
    const groupOrder = completeOrder.flatMap(group => previousByGroup.get(group) || [group]);

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...this._config.areas_options?.[this._area],
          group_order: groupOrder,
        },
      },
    });
    this._areaGroupOrderChanged = true;
  }

  /** Copies the group order of this room to every room. */
  private _applyAreaGroupOrderToAllAreas = async (): Promise<void> => {
    const areaId = this._area;
    if (!this._config || !areaId || !this._areaGroupOrderChanged) return;
    const confirmed = await showConfirmDialog(this, {
      hass: this.hass,
      title: this._t('settings.apply_group_order_all_confirm'),
      message: this._t('settings.apply_group_order_all_description'),
      confirmLabel: this._t('common.apply'),
    });
    if (!confirmed || !this._config || this._area !== areaId) return;

    const currentOrder = this._config.areas_options?.[areaId]?.group_order;
    const order = currentOrder?.length ? [...currentOrder] : [...AREA_STRATEGY_GROUPS];
    const areasOptions = { ...this._config.areas_options };
    const areaIds = new Set([
      ...(this._config.areas || []).map((area) => area.area_id),
      ...Object.keys(this.hass?.areas || {}),
    ]);
    areaIds.forEach((id) => {
      areasOptions[id] = { ...areasOptions[id], group_order: [...order] };
    });

    this._fireConfigChanged({ ...this._config, areas_options: areasOptions });
    this._areaGroupOrderChanged = false;
    this._showToast(this._t('settings.apply_group_order_all_done'));
  };

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
    this._startDragPreview(`area-groups:${this._area}`, orderedGroups);
    event.dataTransfer?.setData('text/plain', group);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private _handleEntitySectionDragOver(event: DragEvent, group: AreaStrategyGroup): void {
    const dragged = this._draggedEntitySection;
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this._dragOverEntitySection = group;
    const list = `area-groups:${this._area}`;
    const index = this._dragPreview?.list === list ? this._dragPreview.order.indexOf(group) : -1;
    if (index >= 0) this._moveDragPreview(list, dragged, index);
  }

  private _handleEntitySectionDrop(
    event: DragEvent,
    targetGroup: AreaStrategyGroup,
    orderedGroups: AreaStrategyGroup[]
  ): void {
    const draggedGroup = this._draggedEntitySection;
    if (!draggedGroup) return;
    event.preventDefault();
    event.stopPropagation();

    this._handleEntitySectionDragOver(event, targetGroup);
    const reordered = this._finishDragPreview(`area-groups:${this._area}`, orderedGroups);
    if (reordered) this._saveEntitySectionOrder(reordered as AreaStrategyGroup[]);
    this._handleEntitySectionDragEnd();
  }

  private _moveEntitySection(
    event: Event,
    orderedGroups: AreaStrategyGroup[],
    index: number,
    direction: -1 | 1
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedGroups.length) return;
    const reordered = [...orderedGroups];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(targetIndex, 0, moved);
    this._saveEntitySectionOrder(reordered);
  }

  private _handleEntitySectionDragEnd = (): void => {
    this._draggedEntitySection = undefined;
    this._dragOverEntitySection = undefined;
    this._cancelDragPreview(`area-groups:${this._area}`);
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

  /** Drag preview list of the entities of a group (or the free order) in this room. */
  private _entityDragList(group: string): string {
    return `entities:${this._area}:${group}`;
  }

  /** Entities of the room settings as listed: config entities plus states with this area in the registry. */
  private _areaEditorEntities(areaId: string): { entity_id: string }[] {
    const entities = this._configAreaEntities(areaId);
    const seen = new Set(entities.map((entity) => entity.entity_id));
    const registry = getEntityRegistry(this.hass);
    Object.values(this.hass?.states || {}).forEach((state) => {
      if (!seen.has(state.entity_id) && registry[state.entity_id]?.area_id === areaId) {
        entities.push({ entity_id: state.entity_id });
      }
    });
    return entities;
  }

  /** Stored order of the entities of a group, or of all entities in the free order. */
  private _sortedGroupEntities(group: string): string[] {
    if (!this._area || !this.hass) return [];
    const groups = this._getAreaGroupedEntitiesWithoutFiltering(this._areaEditorEntities(this._area), this.hass);
    const areaOptions = this._config?.areas_options?.[this._area];
    if (group === UNGROUPED_ENTITY_DRAG_GROUP) {
      return this._sortEntityIds(
        AREA_STRATEGY_GROUPS.flatMap((groupKey) => groups[groupKey] || []),
        areaOptions?.entity_order || []
      );
    }
    return this._sortEntityIds(
      groups[group as AreaStrategyGroup] || [],
      areaOptions?.groups_options?.[group]?.order || []
    );
  }

  private _handleEntityDragStart(e: DragEvent, entityId: string, group: string): void {
    this._handleAreaCustomCardDragEnd();
    this._draggedEntityId = entityId;
    this._draggedEntityGroup = group;
    this._startDragPreview(this._entityDragList(group), this._sortedGroupEntities(group));
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', entityId);
    }
  }

  private _handleEntityDragEnd(): void {
    if (this._draggedEntityGroup) this._cancelDragPreview(this._entityDragList(this._draggedEntityGroup));
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
      this._moveDragPreview(this._entityDragList(group), this._draggedEntityId, index);
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

    const list = this._entityDragList(group);
    this._moveDragPreview(list, this._draggedEntityId, dropIndex);
    const order = this._finishDragPreview(list, this._sortedGroupEntities(group));
    this._handleEntityDragEnd();
    if (!order) return;

    if (group === UNGROUPED_ENTITY_DRAG_GROUP) {
      this._saveUngroupedEntityOrder(order);
      return;
    }

    const areaOptions = this._config.areas_options?.[this._area];
    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...areaOptions,
          groups_options: {
            ...areaOptions?.groups_options,
            [group]: {
              ...areaOptions?.groups_options?.[group],
              order,
            },
          },
        },
      },
    });
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
    this._collapsedAreaGroups = new Set();
    this._areaGroupOrderChanged = false;
  }

  private _handleAreaGroupExpandedChanged(event: CustomEvent<{ expanded: boolean }>, group: string): void {
    if (event.target !== event.currentTarget) return;
    const collapsed = !event.detail?.expanded;
    if (this._collapsedAreaGroups.has(group) === collapsed) return;
    const next = new Set(this._collapsedAreaGroups);
    if (collapsed) next.add(group);
    else next.delete(group);
    this._collapsedAreaGroups = next;
  }

  /**
   * Hides or shows a whole entity group of the room. Hiding stores the
   * entities the group has now, so entities added later are still shown.
   */
  private _setAreaEntityGroupHidden(group: string, entityIds: string[], hidden: boolean): void {
    if (!this._config || !this._area) return;
    const areaOptions = this._config.areas_options?.[this._area];
    const groupOptions = areaOptions?.groups_options?.[group];

    this._fireConfigChanged({
      ...this._config,
      areas_options: {
        ...this._config.areas_options,
        [this._area]: {
          ...areaOptions,
          groups_options: {
            ...areaOptions?.groups_options,
            [group]: {
              ...groupOptions,
              hidden: groupHiddenIds(groupOptions?.hidden, entityIds, hidden),
            },
          },
        },
      },
    });
  }

  private _visibilityIcon(visibility: GroupVisibility): string {
    if (visibility === 'hidden') return 'mdi:eye-off-outline';
    return visibility === 'partial' ? 'mdi:eye-minus-outline' : 'mdi:eye-outline';
  }

  /** Eye button of a group: shows whether it is visible, partly hidden or hidden. */
  private _renderVisibilityButton(visibility: GroupVisibility, label: string, onClick: () => void) {
    return html`
      <button
        class="visibility-button is-${visibility}"
        type="button"
        title=${label}
        aria-label=${label}
        aria-pressed=${visibility === 'hidden' ? 'false' : 'true'}
        @click=${(event: Event) => {
          event.stopPropagation();
          onClick();
        }}
        @keydown=${(event: KeyboardEvent) => event.stopPropagation()}
      >
        <ha-icon icon=${this._visibilityIcon(visibility)}></ha-icon>
      </button>
    `;
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
          <p>${this._t('settings.no_weather_fallback')}</p>
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
          title=${this._t('common.remove')}
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
          <p>${this._t('settings.no_alarm')}</p>
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
          title=${this._t('common.remove')}
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
            <h4>${this._t('settings.select_weather_title')}</h4>
            <button
              class="close-button"
              title=${this._t('common.close')}
              @click=${() => this._showWeatherPicker = false}
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
              placeholder=${this._t('settings.search_weather')}
              aria-label=${this._t('settings.search_weather')}
              .value=${this._weatherSearchFilter}
              @input=${(e: Event) => this._weatherSearchFilter = (e.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${repeat(
              filteredWeatherEntities.slice(0, 20), // Limit to 20 results for weather
              (entityId) => entityId,
              (entityId) => {
                const state = this.hass?.states[entityId];
                const friendlyName = state?.attributes?.friendly_name || entityId;

                return html`
                  <button type="button" class="entity-option" @click=${() => this._selectWeatherEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </button>
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
      !getEntityRegistry(this.hass)[entityId]?.hidden_by
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
            <h4>${this._t('settings.select_alarm_title')}</h4>
            <button
              class="close-button"
              title=${this._t('common.close')}
              @click=${() => this._showAlarmPicker = false}
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
              placeholder=${this._t('settings.search_alarm')}
              aria-label=${this._t('settings.search_alarm')}
              .value=${this._alarmSearchFilter}
              @input=${(e: Event) => this._alarmSearchFilter = (e.target as HTMLInputElement).value}
            />
          </div>

          <div class="entity-list">
            ${repeat(
              filteredAlarmEntities.slice(0, 20),
              (entityId) => entityId,
              (entityId) => {
                const state = this.hass?.states[entityId];
                const friendlyName = state?.attributes?.friendly_name || entityId;

                return html`
                  <button type="button" class="entity-option" @click=${() => this._selectAlarmEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </button>
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
                  <button type="button" class="entity-option" @click=${() => this._selectEntity(entityId)}>
                    <ha-state-icon
                      .stateObj=${state}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${friendlyName}</span>
                    <span class="entity-id">${entityId}</span>
                  </button>
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
    const settings = this._config!.settings;
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...settings,
        alarm_entity_id: entityId,
        // Picking an alarm after it was removed shows the chip again.
        show_alarm: settings?.alarm_entity_id ? settings.show_alarm : true,
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
        alarm_entity_id: undefined,
        show_alarm: false,
      }
    };

    this._fireConfigChanged(newConfig);
  }

  private _toggleAlarmDisplay = (e: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        show_alarm: Boolean((e.target as any).checked),
      },
    });
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

  private _toggleHideAreaName = (e: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        hide_area_name_in_entity_names: Boolean((e.target as any).checked),
      },
    });
  };

  private _toggleHideEnergySensors = (e: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged(withHideEnergySensors(this._config, Boolean((e.target as any).checked)));
  };

  private _toggleAreaShowEnergySensors = (e: Event): void => {
    if (!this._config || !this._area) return;
    this._fireConfigChanged(withAreaShowEnergySensors(this._config, this._area, Boolean((e.target as any).checked)));
  };

  private _toggleAreaFavorites = (e: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        show_area_favorites: Boolean((e.target as any).checked),
      },
    });
  };

  private _toggleAreaNowPlaying = (e: Event): void => {
    if (!this._config) return;
    this._fireConfigChanged({
      ...this._config,
      settings: {
        ...this._config.settings,
        show_area_now_playing: Boolean((e.target as any).checked),
      },
    });
  };

  private _toggleAreaThermostat(e: Event): void {
    const target = e.target as any;
    const newConfig: DwainsDashboardConfig = {
      ...this._config!,
      settings: {
        ...this._config!.settings,
        show_area_thermostat: Boolean(target.checked)
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
                <ha-state-icon
                  .stateObj=${person.state}
                  class="person-icon"
                ></ha-state-icon>
                <span class="person-name">${person.friendly_name}</span>
                <span class="person-state ${person.state?.state === 'home' ? 'home' : 'away'}">
                  ${person.state?.state === 'home' ? this._t('person.home') : this._t('person.away')}
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
    // Point the user to the Home Assistant area settings.
    this._showToast(this._t('strategy.edit_area_alert'));
  }

  // Show a short message in Home Assistant's own snackbar.
  private _showToast(message: string): void {
    fireEvent(this, 'hass-notification', { message });
  }

  private _openReplacementManager(initialDomain?: string): void {
    if (!this.hass || !this._config) return;
    openReplacementManager(this.hass, this._config, (config) => {
      if (!this._config) return;
      this._fireConfigChanged({ ...this._config, blueprint_replacements: config.blueprint_replacements || {} });
      this.requestUpdate();
    }, initialDomain);
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

    // Save the complete user configuration, but never the live registry data.
    const merged = this._config;
    const cleanConfig = {
      ...persistableConfig(merged),
      type: "custom:dwains-dashboard-next",
      areas_display: merged.areas_display || {},
      floors_display: merged.floors_display || {},
      areas_options: merged.areas_options || {},
      blueprint_replacements: merged.blueprint_replacements || {},
      device_admission: merged.device_admission || {},
      favorites: merged.favorites || [],
      pages: merged.pages || [],
      home_custom_cards: merged.home_custom_cards || [],
      settings: merged.settings || {}
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
        grid-template-columns: 44px minmax(0, 1fr) 24px;
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

      /* Summary facts wrap instead of being cut off. */
      .settings-nav-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }

      .settings-nav-summary span {
        max-width: 100%;
        padding: 4px 9px;
        border-radius: 999px;
        color: var(--settings-item-color);
        background: color-mix(in srgb, var(--settings-item-color) 10%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }

      .settings-version-footer {
        max-width: 720px;
        margin: 4px auto 0;
        padding: 0 14px;
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .settings-version-footer strong {
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
        .settings-nav-section,
        .settings-version-footer,
        .settings-detail-content,
        .settings-detail-toolbar {
          max-width: none;
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
          margin-top: 6px;
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

      .home-scene-settings-section {
        padding: 0 16px 16px;
      }

      .home-scene-settings-section .home-custom-card-add {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      .home-scene-option .entity-name {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .home-scene-option-meta {
        color: var(--secondary-text-color);
        font-size: 12px;
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
        opacity: 0.42;
        cursor: default;
      }

      .home-layout-reset:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .settings-reset-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0 0;
      }

      .area-editor-reset-row {
        margin: 16px;
      }

      @media (max-width: 600px) {
        .home-section-item {
          grid-template-columns: 28px 36px minmax(0, 1fr);
        }

        .home-section-item.has-detail {
          grid-template-columns: 28px 36px minmax(0, 1fr) 20px;
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

        .home-camera-settings-section,
        .home-custom-card-settings-section,
        .home-scene-settings-section {
          padding-inline: 10px;
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

      .area-entity-section-header {
        width: 100%;
        min-width: 0;
      }

      .area-entity-section-header > span:not(.area-entity-section-actions) {
        min-width: 0;
        flex: 1;
      }

      .area-entity-section-title small {
        margin-left: 8px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
      }

      .area-entity-section.is-hidden ha-expansion-panel {
        opacity: 0.62;
      }

      .visibility-button {
        width: 36px;
        height: 36px;
        padding: 0;
        display: inline-grid;
        place-items: center;
        flex: 0 0 auto;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color);
        background: transparent;
        cursor: pointer;
      }

      .visibility-button:hover {
        background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        color: var(--primary-text-color);
      }

      .visibility-button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }

      .visibility-button.is-partial {
        color: var(--primary-color);
      }

      .visibility-button.is-hidden {
        color: var(--disabled-text-color, var(--secondary-text-color));
      }

      .visibility-button ha-icon {
        --mdc-icon-size: 20px;
      }

      .area-entity-section-actions {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        flex: 0 0 auto;
      }

      .area-entity-section-actions ha-icon-button {
        width: 36px;
        height: 36px;
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

      .area-energy-sensors-settings {
        gap: 4px;
      }

      .area-entity-layout-copy span,
      .area-energy-sensors-description,
      .entity-name small {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.4;
      }

      .area-entity-layout-settings .area-order-modes,
      .tile-tap-modes {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .tile-tap-section {
        padding: 0 16px 16px;
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

        .area-entity-layout-settings .area-order-modes,
        .tile-tap-modes {
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
        align-self: stretch;
        gap: 4px;
        min-width: 0;
        min-height: 40px;
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 6px;
        background: none;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      .area-name.clickable:hover {
        color: var(--primary-color);
      }

      .area-name.clickable:focus-visible,
      .entity-option:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .area-name-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
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

      .manage-favorites-link {
        display: inline;
        margin-left: 4px;
        font-weight: 600;
        line-height: inherit;
      }

      .manage-favorites-link:hover,
      .manage-favorites-link:focus-visible {
        text-decoration: underline;
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

      .replacement-list {
        margin-top: 12px;
      }

      .replacement-section .home-camera-settings-empty {
        margin-top: 12px;
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
      .alarm-toggle,
      .favorite-suggestions-toggle,
      .hide-unavailable-toggle {
        margin-bottom: 16px;
      }

      .time-toggle ha-formfield,
      .weather-toggle ha-formfield,
      .alarm-toggle ha-formfield,
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

      .device-visibility-section {
        margin-top: 20px;
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

      .device-type-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        color: var(--device-type-color);
        background: color-mix(in srgb, var(--device-type-color) 13%, transparent);
      }

      .device-type-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .device-type-icon.small {
        width: 34px;
        height: 34px;
        border-radius: 9px;
      }

      .device-type-icon.small ha-icon {
        --mdc-icon-size: 19px;
      }

      /* Devices page visibility tree: type > area > device > entity. */
      .device-visibility-tree {
        display: grid;
        gap: 8px;
      }

      .device-visibility-type {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
        content-visibility: auto;
        contain-intrinsic-size: auto 58px;
      }

      .device-visibility-type.open {
        border-color: color-mix(in srgb, var(--device-type-color) 30%, var(--divider-color));
      }

      .device-visibility-type-row {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 8px 6px 6px;
      }

      .device-visibility-type-toggle {
        flex: 1;
        min-width: 0;
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 6px;
        border: 0;
        border-radius: 10px;
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .device-visibility-type-toggle:disabled {
        cursor: default;
      }

      .device-visibility-type-toggle:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }

      .device-visibility-type.is-hidden .device-visibility-type-toggle {
        opacity: 0.58;
      }

      .device-visibility-copy {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 2px;
      }

      .device-visibility-copy strong {
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-visibility-copy small {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 1.2;
      }

      .device-visibility-chevron {
        flex: 0 0 auto;
        color: var(--secondary-text-color);
        transition: transform 0.18s ease;
        --mdc-icon-size: 20px;
      }

      .device-visibility-type.open .device-visibility-chevron {
        transform: rotate(180deg);
      }

      .device-visibility-areas {
        display: grid;
        gap: 10px;
        padding: 0 12px 12px;
      }

      .device-visibility-area {
        display: grid;
        gap: 6px;
        padding: 8px 8px 10px 12px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--card-background-color) 82%, var(--secondary-background-color));
      }

      .device-visibility-area.type-hidden {
        opacity: 0.58;
      }

      .device-visibility-area-header,
      .device-visibility-device-row,
      .device-visibility-entity {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .device-visibility-device-row {
        min-height: 40px;
        padding-right: 2px;
      }

      .device-visibility-device-icon {
        flex: 0 0 auto;
        color: var(--secondary-text-color);
        --mdc-icon-size: 20px;
      }

      .device-visibility-device.device-hidden .device-visibility-device-row .device-visibility-copy {
        opacity: 0.62;
      }

      .device-visibility-entities {
        display: grid;
        gap: 2px;
      }

      .device-visibility-device-row + .device-visibility-entities {
        margin-left: 15px;
        padding-left: 15px;
        border-left: 2px solid var(--divider-color);
      }

      .device-visibility-entity {
        min-height: 36px;
      }

      .device-visibility-entity.is-hidden .device-visibility-entity-icon,
      .device-visibility-entity.is-hidden .device-visibility-entity-name {
        opacity: 0.5;
      }

      .device-visibility-entity-icon {
        flex: 0 0 auto;
        color: var(--device-type-color);
        --mdc-icon-size: 20px;
      }

      .device-visibility-entity-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .device-visibility-entity-note {
        flex: 0 0 auto;
        padding-right: 8px;
        color: var(--secondary-text-color);
        font-size: 12px;
      }

      @media (max-width: 600px) {
        .device-types-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .device-visibility-areas {
          padding: 0 8px 10px;
        }

        .device-visibility-device-row + .device-visibility-entities {
          margin-left: 8px;
          padding-left: 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .device-visibility-chevron {
          transition: none;
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
        width: 100%;
        margin: 0;
        padding: 12px;
        border: 0;
        background: var(--primary-background-color);
        color: inherit;
        font: inherit;
        text-align: left;
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

      /* Reduced motion: no heartbeat, pulse or shimmer loops and
         near-instant transitions. */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0s !important;
          scroll-behavior: auto !important;
        }

        .sponsoring-header ha-icon {
          animation: none;
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
