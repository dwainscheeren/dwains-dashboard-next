import { LitElement, html, css, unsafeCSS, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import memoizeOne from 'memoize-one';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, AreaConfig, EntityConfig, AreaData, AreaCustomCard, EntitiesDisplay, HomeCustomCard, HomeInformationCardKey, HomeSectionKey, MasterActionConfirmationDomain } from '../types/strategy';
import { getAreaData, clearAreaDataCache, clearAreaDataCacheForArea } from '../utils/area';
import { getAlertIcon, getAreaIcon, getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { getStatusDomains, getTotalWattage, type DomainCount as StatusDomainCount } from '../utils/header-status-domains';
import { getDeviceClassName, getDomainName } from '../utils/domain-names';
import { filterHiddenDeviceEntities } from '../utils/device-admission';
import { findReplacementAssignment, resolveEntityCardConfig } from '../utils/blueprint-replacements';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import { AREA_STRATEGY_GROUPS, getAreaEntityGroupKey, getLegacyAreaGroupKey, sortAreas, type AreaStrategyGroup } from '../utils/area-entities';
import { navigateHomeAssistant } from '../utils/navigation';
import { isHassDarkTheme } from '../utils/theme';
import { HOME_SECTION_META, normalizeHiddenHomeInformationCards, normalizeHiddenHomeSections, normalizeHomeSectionsOrder } from '../utils/home-sections';
import { buildHousePowerUsage } from '../utils/power-usage';
import { normalizeHomeScenes, resolveHomeSceneItems, type HomeSceneItem } from '../utils/home-scenes';
import { getEntityRegistry } from '../utils/entity-registry';
import { getDomainStates } from '../utils/state-index';
import { pickAreaThermostatEntityId } from '../utils/thermostat';
import './dwains-area-thermostat';
import {
  isNowPlayingPlayerVisible,
  normalizeNowPlayingMode,
  nowPlayingRoomName,
  pickNowPlayingEntityIds,
} from '../utils/now-playing';
import type { NowPlayingPlayer } from './dwains-now-playing-bar';
import './dwains-now-playing-bar';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../utils/unit-format';
import { stripAreaNameFromEntityName } from '../utils/entity-names';
import { pageHeaderStyles } from './styles/page-header-styles';
import { roomAreaStyles } from './styles/layout-card-styles';
import { showDomainEntitiesDialog } from './utils/show-domain-entities-dialog';
import { showCardEditorDialog } from './utils/show-card-editor-dialog';
import { ensureBottomNav } from './dwains-bottom-nav';
import { makeDialogManager } from './utils/make-dialog-manager';
import './dwains-dashboard-strategy-editor';
import './utils/dd-card-host';
import './utils/dd-tile-host';
import './ui/dd-ui-primitives';
import './ui/dd-entity-tiles';
import { fireEvent } from './utils/fire-event';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import {
  masterActionConfirmationEnabled,
  normalizeMasterActionConfirmationDomain,
} from '../utils/master-action-confirmations';

// Use DomainCount from header-status-domains utility
type DomainCount = StatusDomainCount;
type DwainsSelectedView = 'home' | 'area' | 'settings';
type PictureTextTone = 'light' | 'dark';
const SETTINGS_HISTORY_STATE_KEY = 'dwainsDashboardNextSettingsOpen';
const SETTINGS_HISTORY_RESTORE_MS = 15000;
type PictureContrastCacheValue = PictureTextTone | 'pending';
const SIDEBAR_WIDTH_STORAGE_KEY = 'dd-next-area-sidebar-width';
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'dd-next-area-sidebar-collapsed';
const AREA_EDIT_MODE_STORAGE_KEY = 'dd-next-area-edit-mode';
const AREA_EDIT_MODE_RESTORE_MS = 30000;
const OPTIMISTIC_ENTITY_STATE_TTL = 5000;
const SIDEBAR_DEFAULT_WIDTH = 250;
const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 660;
const SIDEBAR_COLLAPSE_THRESHOLD = 96;
const AREA_HEADER_STICK_SCROLL = 76;
const AREA_HEADER_UNSTICK_SCROLL = 38;
const AREA_HEADER_REVEAL_SCROLL = 88;
const MOBILE_INITIAL_HOME_AREAS = 12;
const MOBILE_INITIAL_ENTITY_GROUPS = 4;
const MOBILE_INITIAL_ENTITY_CARDS = 12;
const UNGROUPED_AREA_EDIT_GROUP = '__ungrouped__';

interface CachedAreaData {
  data: AreaData;
  timestamp: number;
}

interface PersistentNotification {
  notification_id: string;
  title?: string | null;
  message: string;
  created_at?: string;
}

interface MobileEntityGroup {
  key: string;
  name: string;
  icon: string;
  entities: EntityConfig[];
}

interface HousePowerRoom {
  areaId: string;
  name: string;
  icon: string;
  watts: number;
  formatted: string;
  percentage: number;
}

interface HousePowerUsage {
  totalWatts: number;
  formattedTotal: string;
  sensorCount: number;
  rooms: HousePowerRoom[];
}

interface HouseClimateMetric {
  kind: 'temperature' | 'humidity';
  label: string;
  value: string;
  count: number;
  icon: string;
  color: string;
  entityIds: string[];
}

interface HouseClimateSummary {
  sensorCount: number;
  metrics: HouseClimateMetric[];
}

type HouseClimateScope = 'indoor' | 'outdoor';

interface HomeAreaCamera {
  areaId: string;
  areaName: string;
  areaIcon: string;
  entityId: string;
  name: string;
  state: string;
  imageUrl?: string;
}

type HomeSummaryKey = 'repairs' | 'updates' | 'discovered';

interface HomeSummaryCard {
  key: HomeSummaryKey;
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  count: number;
  path: string;
}

interface NormalizedAreaCustomCard {
  id: string;
  placement: string;
  card: any;
}

interface OptimisticEntityState {
  state: string;
  expiresAt: number;
}

interface AreaStatusBadge {
  key: string;
  className: string;
  domain: string;
  deviceClass?: string;
  icon: string;
  count: number;
  color: string;
}

interface ConfirmationDialogState {
  title: string;
  message: string;
  confirmLabel: string;
  destructive: boolean;
}

@customElement('dwains-dashboard-next-layout-card')
export class DwainsLayoutCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DwainsDashboardConfig;

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  private _tp = (key: string, count: number) =>
    ddLocalizePlural(this.hass, key, count);

  @state() private _selectedArea: string | null = null;
  @state() private _selectedView: DwainsSelectedView | null = null;
  @state() private _isMobile = false;
  @state() private _headerExpanded = false;
  @state() private _headerCompact = false;
  @state() private _headerStatusCanScrollLeft = false;
  @state() private _headerStatusCanScrollRight = false;
  private _favoritesRenderVersion = 0;
  @state() private _currentTime = '';
  @state() private _currentDate = '';
  @state() private _mobileNavOpen = false;
  @state() private _editMode = false;
  @state() private _notificationsOpen = false;
  @state() private _persistentNotifications: PersistentNotification[] = [];
  @state() private _notificationsLoading = false;
  @state() private _notificationsError = '';
  @state() private _areaHeaderStuck = false;
  @state() private _areaHeaderRevealed = false;
  @state() private _areaQuickPage = 0;
  @state() private _mobileEntityLayout: 'rail' | 'grid' = 'rail';
  @state() private _mobileHomeAreasLayout: 'rail' | 'grid' = 'rail';
  @state() private _mobileHomeDevicesLayout: 'rail' | 'grid' = 'rail';
  @state() private _mobileHomeFavoritesLayout: 'rail' | 'grid' = 'rail';
  @state() private _mobileHomeCamerasLayout: 'rail' | 'grid' = 'rail';
  @state() private _areaSidebarWidth = SIDEBAR_DEFAULT_WIDTH;
  @state() private _areaSidebarCollapsed = false;
  @state() private _isResizingSidebar = false;
  @state() private _repairsIssueCount = 0;
  @state() private _discoveredDeviceCount = 0;
  @state() private _suggestedFavoriteEntities: string[] = [];
  @state() private _customCardDrag: { areaId: string; cardId: string } | null = null;
  @state() private _customCardDragOver: { areaId: string; placement: string; index: number } | null = null;
  @state() private _generatedCardDrag: { areaId: string; entityId: string; groupKey: string } | null = null;
  @state() private _generatedCardDragOver: { areaId: string; entityId: string; groupKey: string } | null = null;
  @state() private _generatedGroupDrag: { areaId: string; groupKey: string } | null = null;
  @state() private _generatedGroupDragOver: { areaId: string; groupKey: string } | null = null;
  @state() private _optimisticEntityStates: Record<string, OptimisticEntityState> = {};
  @state() private _renderAllMobileHomeAreas = false;
  @state() private _renderAllMobileAreaEntities = false;
  @state() private _collapsedAreaGroups: Record<string, boolean> = {};
  @state() private _settingsDirty = false;
  @state() private _deviceSettingsDirty = false;
  @state() private _settingsSavePending = false;
  @state() private _settingsSaveError = '';
  @state() private _settingsPageKey = 'overview';
  @state() private _settingsPageTitle = '';
  @state() private _settingsPageParentTitle = '';
  @state() private _settingsPageDescription = '';
  @state() private _confirmationDialog: ConfirmationDialogState | null = null;
  @state() private _housePowerDialogOpen = false;

  // Performance optimizations
  private _areaEntitiesCache = new Map<string, { entities: EntityConfig[], timestamp: number }>();
  private _areaDataCache = new Map<string, CachedAreaData>();
  private _domainCountsCache = new Map<string, DomainCount[]>();

  private _CACHE_DURATION = 5000; // 5 seconds
  private _timeInterval?: number;
  private _resizeObserver?: ResizeObserver;
  private _persistentNotificationsUnsub?: () => void;
  private _persistentNotificationsLoaded = false;
  private _homeSummariesLoaded = false;
  private _homeSummariesRefreshInterval?: number;
  private _favoriteSuggestionsLoaded = false;
  private _favoriteSuggestionsLoading = false;
  private _areaHeaderScrollRaf?: number;
  private _headerStatusScrollRaf?: number;
  private _pendingAreaScrollTop = 0;
  private _optimisticCleanupTimer?: number;
  private _lastAreaScrollTop = 0;
  private _areaScrollUpDistance = 0;
  private _pictureContrastCache = new Map<string, PictureContrastCacheValue>();
  private _sidebarResizePointerId?: number;
  private _areaSidebarScrollTop = 0;
  private _areaSidebarRestoreRaf?: number;
  private _progressiveRenderCancel?: () => void;
  private _pendingSettingsConfig?: Partial<DwainsDashboardConfig>;
  private _settingsEditorInitialized = false;
  private _settingsRestorePageKey = 'overview';
  private _settingsRestoreAreaId?: string;
  private _confirmationResolve?: (confirmed: boolean) => void;

  // Debounce timers
  private _updateDebounceTimer?: number;

  // Required by Home Assistant
  setConfig(config: DwainsDashboardConfig) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;

    // Restore the settings view only immediately after a settings interaction/save.
    // A stale browser history marker must never reopen DD settings later by itself.
    if (!this._selectedView) {
      const savedSettingsState = window.history.state?.[SETTINGS_HISTORY_STATE_KEY];
      const settingsStateFresh = Boolean(
        savedSettingsState &&
        typeof savedSettingsState === 'object' &&
        typeof savedSettingsState.updatedAt === 'number' &&
        Date.now() - savedSettingsState.updatedAt <= SETTINGS_HISTORY_RESTORE_MS
      );
      const urlArea = this._getUrlArea();

      if (settingsStateFresh) {
        this._selectedArea = null;
        this._selectedView = 'settings';
        this._settingsRestorePageKey = typeof savedSettingsState.page === 'string'
          ? savedSettingsState.page
          : 'overview';
        this._settingsRestoreAreaId = typeof savedSettingsState.areaId === 'string'
          ? savedSettingsState.areaId
          : undefined;
      } else {
        if (savedSettingsState) this._setSettingsHistoryState(false);
        if (urlArea && config.areas?.some(a => a.area_id === urlArea)) {
          this._selectedArea = urlArea;
          this._selectedView = 'area';
        } else {
          this._selectedView = 'home';
        }
      }
    }
    this._restoreAreaEditMode();
  }

  private _getUrlArea(): string | null {
    try {
      return new URL(window.location.href).searchParams.get('dd_area');
    } catch {
      return null;
    }
  }

  private _updateUrlArea(areaId: string | null) {
    try {
      const url = new URL(window.location.href);
      if (areaId) url.searchParams.set('dd_area', areaId);
      else url.searchParams.delete('dd_area');
      window.history.replaceState(window.history.state, '', url.toString());
    } catch {
      /* negeer */
    }
  }

  private _setSettingsHistoryState(open: boolean): void {
    try {
      const current = window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : {};
      const next = { ...current };
      if (open) {
        next[SETTINGS_HISTORY_STATE_KEY] = {
          page: this._settingsPageKey || 'overview',
          areaId: this._settingsRestoreAreaId,
          updatedAt: Date.now(),
        };
      } else {
        delete next[SETTINGS_HISTORY_STATE_KEY];
      }
      window.history.replaceState(next, '', window.location.href);
    } catch {
      /* history state can be unavailable in restricted contexts */
    }
  }

  private _syncBottomNavAreaContext(): void {
    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    const settingsSelected = this._selectedView === 'settings';
    window.dispatchEvent(new CustomEvent('dwains-dashboard-next-area-context-changed', {
      detail: {
        areaId: this._selectedView === 'area' ? this._selectedArea : null,
        icon: settingsSelected ? 'mdi:pencil' : area ? getAreaIcon(area) : 'mdi:home',
        name: settingsSelected ? this._t('sidebar.dashboard_settings') : area?.name || this._t('sidebar.home'),
        view: this._selectedView || 'home',
      },
    }));
  }

  private _canManageDashboard(): boolean {
    return !restrictNonAdminDashboardSettings(this.hass, this.config?.settings);
  }

  private _areaEditModeStorageKey(): string {
    return `${AREA_EDIT_MODE_STORAGE_KEY}:${this._getDashboardUrlPath() || 'default'}`;
  }

  private _rememberAreaEditMode(areaId: string | null): void {
    try {
      const key = this._areaEditModeStorageKey();
      if (!areaId) {
        window.sessionStorage.removeItem(key);
        return;
      }
      window.sessionStorage.setItem(key, JSON.stringify({
        areaId,
        updatedAt: Date.now(),
      }));
    } catch {
      /* ignore storage failures */
    }
  }

  private _restoreAreaEditMode(): void {
    if (!this._canManageDashboard()) {
      this._editMode = false;
      this._rememberAreaEditMode(null);
      return;
    }

    try {
      const raw = window.sessionStorage.getItem(this._areaEditModeStorageKey());
      if (!raw) return;
      const stored = JSON.parse(raw) as { areaId?: string; updatedAt?: number };
      const isFresh = typeof stored.updatedAt === 'number' &&
        Date.now() - stored.updatedAt <= AREA_EDIT_MODE_RESTORE_MS;

      if (!stored.areaId || !isFresh) {
        this._rememberAreaEditMode(null);
        return;
      }

      if (this._selectedView === 'area' && this._selectedArea === stored.areaId) {
        this._editMode = true;
      }
    } catch {
      this._rememberAreaEditMode(null);
    }
  }

  private _showNotificationsUi(): boolean {
    return this.config?.settings?.show_notifications !== false;
  }

  private _showSuggestedFavoritesUi(): boolean {
    return this.config?.settings?.show_suggested_favorites !== false;
  }

  private _hasUsagePredictionComponent(): boolean {
    return Boolean(this.hass?.config?.components?.includes('usage_prediction'));
  }

  private _isFavoriteEntityVisible(entityId: string): boolean {
    const state = this.hass?.states?.[entityId];
    const registry = this.hass?.entities?.[entityId] as any;
    return Boolean(
      state &&
      state.state !== 'unavailable' &&
      state.state !== 'unknown' &&
      !registry?.hidden_by &&
      !registry?.hidden
    );
  }

  private _getManualFavoriteEntities(): string[] {
    const seen = new Set<string>();
    return (this.config?.favorites || []).filter((entityId) => {
      if (seen.has(entityId)) return false;
      seen.add(entityId);
      return this._isFavoriteEntityVisible(entityId);
    });
  }

  private _getEffectiveFavoriteEntities(): string[] {
    const manualFavorites = this._getManualFavoriteEntities();
    if (!this._showSuggestedFavoritesUi()) return manualFavorites;

    const limit = Math.max(8, manualFavorites.length);
    if (manualFavorites.length >= limit) return manualFavorites.slice(0, limit);

    const seen = new Set(manualFavorites);
    const suggestedFavorites = this._suggestedFavoriteEntities.filter((entityId) => {
      if (seen.has(entityId)) return false;
      if (!this._isFavoriteEntityVisible(entityId)) return false;
      seen.add(entityId);
      return true;
    });

    return [...manualFavorites, ...suggestedFavorites].slice(0, limit);
  }

  private _ensureFavoriteSuggestionsFeature(): void {
    if (!this.hass || !this._showSuggestedFavoritesUi()) return;
    if (this._favoriteSuggestionsLoaded || this._favoriteSuggestionsLoading) return;
    if (!this._hasUsagePredictionComponent()) {
      this._favoriteSuggestionsLoaded = true;
      this._suggestedFavoriteEntities = [];
      return;
    }
    if (this._getManualFavoriteEntities().length >= 8) {
      return;
    }

    void this._loadFavoriteSuggestions();
  }

  private async _loadFavoriteSuggestions(): Promise<void> {
    if (!this.hass || this._favoriteSuggestionsLoading) return;

    this._favoriteSuggestionsLoading = true;
    try {
      const result = await this.hass.callWS<{ entities?: string[] }>({
        type: 'usage_prediction/common_control',
      });
      this._suggestedFavoriteEntities = Array.isArray(result?.entities)
        ? result.entities.filter((entityId): entityId is string => typeof entityId === 'string')
        : [];
    } catch (err) {
      console.debug('Dwains Dashboard: favorite suggestions are not available.', err);
      this._suggestedFavoriteEntities = [];
    } finally {
      this._favoriteSuggestionsLoading = false;
      this._favoriteSuggestionsLoaded = true;
    }
  }

  private _ensurePersistentNotificationsFeature(): void {
    if (!this._showNotificationsUi() || !this.hass || this._persistentNotificationsLoaded) return;

    this._persistentNotificationsLoaded = true;
    void this._loadPersistentNotifications(false);
    void this._ensurePersistentNotificationsSubscription();
  }

  static getStubConfig() {
    return {
      type: 'custom:dwains-dashboard-next-layout-card',
      areas: [],
      devices: [],
      entities: [],
      floors: [],
      settings: {},
      favorites: []
    };
  }

  static override styles = [css`
    dwains-dashboard-next-now-playing.inline{
      display: block;
      margin: 0 0 18px;
    }
    .room-header dwains-dashboard-next-area-thermostat{
      flex: 0 0 auto;
      min-width: 0;
      max-width: 100%;
    }
    @media (max-width: 768px) {
      dwains-dashboard-next-now-playing.floating{
        position: fixed;
        left: max(12px, env(safe-area-inset-left, 0px));
        right: max(12px, env(safe-area-inset-right, 0px));
        bottom: calc(76px + env(safe-area-inset-bottom, 0px));
        z-index: 140;
        max-width: 560px;
        margin: 0 auto;
      }
      .layout-container.has-floating-now-playing .home-view,
.layout-container.has-floating-now-playing .content-area.area-content-area{
        padding-bottom: calc(190px + env(safe-area-inset-bottom, 0px));
      }
      .room-header dwains-dashboard-next-area-thermostat{
        width: 100%;
        min-width: 0;
        flex-basis: 100%;
      }
    }
    :host{
      display: block;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    button,
.area-button,
.home-status-card,
.status-card-compact,
.mobile-area-card,
.house-person-mini,
.person-card,
.favorite-card-wrapper,
.favorite-quick-action,
.mobile-domain-master,
.mobile-layout-toggle,
.mobile-entity-card,
.mobile-entity-action,
.mobile-cover-action,
.mobile-entity-toggle,
.area-badge,
.area-quick-control,
.dd-edit-toggle,
.unavailable-entities-icon,
.dd-add-card,
.dd-custom-card-wrap.editing{
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .dd-static-icon{
      width: 20px;
      height: 20px;
      display: block;
      flex: 0 0 auto;
      fill: currentColor;
      pointer-events: none;
    }

    .mobile-area-card,
.home-camera-card,
.home-summary-card,
.home-status-card,
.favorite-card-wrapper{
      contain: layout style paint;
    }

    .home-camera-section,
.home-status-section,
.home-todos-section,
.home-custom-cards-section,
.home-summaries-section,
.mobile-domain-group{
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    :host{
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container{
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
.layout-container.sidebar-resizing *{
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar{
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content{
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar{
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar{
      transition: none;
    }

    .sidebar-resize-handle{
      flex: 0 0 10px;
      width: 10px;
      align-self: stretch;
      margin-left: -5px;
      margin-right: -5px;
      position: relative;
      z-index: 4;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    .sidebar-resize-handle::before{
      content: '';
      position: absolute;
      top: 14px;
      bottom: 14px;
      left: 4px;
      width: 2px;
      border-radius: 999px;
      background: transparent;
      transition: background 0.16s ease, box-shadow 0.16s ease;
    }

    .sidebar-resize-handle:hover::before,
.sidebar-resize-handle:focus-visible::before,
.layout-container.sidebar-resizing .sidebar-resize-handle::before{
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible{
      outline: none;
    }

    .sidebar-collapse-toggle{
      position: absolute;
      top: 50%;
      left: calc(var(--area-sidebar-width) - 17px);
      z-index: 6;
      width: 34px;
      height: 54px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      color: var(--primary-text-color);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        top 0.16s ease,
        left 0.16s ease,
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .sidebar-collapse-toggle:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon{
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed{
      left: 0;
      top: 50%;
      width: 34px;
      min-width: 34px;
      height: 54px;
      padding: 0;
      border-left: 0;
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, var(--card-background-color) 98%, transparent);
      transform: translateY(-50%);
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
    }

    .sidebar-collapse-label{
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label{
      display: inline;
    }

    /* Main Content */
    .main-content{
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header{
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact{
      padding: 8px 16px;
    }

    .header-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time{
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date{
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background: var(--secondary-background-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover{
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon{
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact{
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section{
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll{
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar{
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 60px;
      position: relative;
    }

    .status-card-compact:hover{
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact{
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon{
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact{
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .status-card-title-compact{
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('light'))}) 15%, transparent);
    }

    .status-card-compact.light ha-icon{
      color: var(--status-color, ${unsafeCSS(getDomainColor('light'))});
    }

    .status-card-compact.switch .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('switch'))}) 15%, transparent);
    }

    .status-card-compact.switch ha-icon{
      color: var(--status-color, ${unsafeCSS(getDomainColor('switch'))});
    }

    .status-card-compact.binary_sensor .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('sensor'))}) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon{
      color: var(--status-color, ${unsafeCSS(getDomainColor('sensor'))});
    }

    .status-card-compact.person .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('sensor'))}) 15%, transparent);
    }

    .status-card-compact.person ha-icon{
      color: var(--status-color, ${unsafeCSS(getDomainColor('sensor'))});
    }

    .status-card-compact.wattage .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('energy'))}) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon{
      color: var(--status-color, ${unsafeCSS(getDomainColor('energy'))});
    }

    /* Header Expand Button */
    .header-expand-button{
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }

    .header-expand-button:hover{
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after{
      content: attr(data-extra-count);
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    /* Area List */
    .area-list{
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section{
      margin-bottom: 16px;
    }

    .floor-header{
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3{
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button{
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      height: 125px;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      min-width: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover{
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button{
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture{
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark{
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .area-button.has-picture:hover .area-background{
      opacity: 0.8;
    }

    /* Area content structure */
    .area-content{
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section{
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section{
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
.area-button.has-picture .area-sensors{
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon{
      position: absolute;
      left: -25px;
      bottom: -25px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-main-icon{
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon{
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges{
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon{
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info{
      flex: 1;
    }

    .area-menu-chevron{
      display: none;
    }

    .home-notification-shortcut{
      box-sizing: border-box;
      position: relative;
      z-index: 2;
      min-width: 42px;
      height: 28px;
      margin-left: auto;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      cursor: pointer;
      color: #dc2626;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        inset 0 0 0 1px rgba(220, 38, 38, 0.08),
        0 6px 14px rgba(220, 38, 38, 0.1);
    }

    .home-notification-shortcut ha-icon{
      --mdc-icon-size: 15px;
    }

    .home-notification-count{
      min-width: 0;
      height: auto;
      padding: 0;
      border-radius: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: inherit;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name{
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors{
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--error-color);
      color: var(--text-primary-color);
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area{
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
    }

    .content-area.settings-content-area{
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view{
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 104px;
      box-sizing: border-box;
    }

    .settings-page-header{
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      margin: 0 0 16px;
      padding: 16px 18px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
          color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color)) 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
    }

    .settings-page-back,
.settings-secondary,
.settings-primary{
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-back ha-icon{
      --mdc-icon-size: 22px;
    }

    .settings-page-title{
      min-width: 0;
    }

    .settings-page-title h1{
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }
    .settings-breadcrumb-parent{
      color: var(--secondary-text-color);
      font-weight: 700;
    }
    .settings-breadcrumb-separator{
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }

    .settings-page-title p{
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-page-actions,
.settings-page-bottom-actions{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }

    .settings-secondary,
.settings-primary{
      min-height: 40px;
      padding: 0 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-secondary{
      background: transparent;
      color: var(--primary-color);
    }

    .settings-primary{
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled{
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-save-error{
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--error-color) 12%, var(--card-background-color));
      color: var(--error-color);
      font-weight: 750;
      font-size: 13px;
    }

    .settings-page-editor{
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor{
      display: block;
    }

    .settings-page-bottom-actions{
      display: none;
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area{
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Home View */
    .home-view{
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome{
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content{
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header{
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-header-meta{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 14px;
      min-width: 0;
    }

    .welcome-user{
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar{
      border: 0;
      padding: 0;
      display: inline-flex;
      width: 52px;
      height: 52px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      appearance: none;
      -webkit-appearance: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border-radius: 999px;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.1),
        0 0 0 3px rgba(255, 255, 255, 0.72);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .welcome-avatar:hover{
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon{
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-copy{
      min-width: 0;
    }

    .welcome-text{
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .welcome-greeting{
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name{
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title{
      display: none;
    }

    .welcome-return{
      display: block;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .welcome-actions{
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action{
      position: relative;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .welcome-action:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-notification-action{
      width: 44px;
      padding: 0 4px;
      border: 0;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      height: 44px;
      border-radius: 999px;
      color: var(--secondary-text-color);
      background: transparent;
      box-shadow: none;
    }

    .welcome-notification-action:hover{
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
      box-shadow: none;
    }

    .welcome-notification-action .welcome-action-badge{
      top: -1px;
      right: -3px;
    }

    .welcome-settings-action{
      margin-left: 2px;
    }

    .welcome-action ha-icon{
      --mdc-icon-size: 22px;
    }

    .welcome-action:active{
      transform: scale(0.96);
    }

    .welcome-action-badge{
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--error-color);
      color: #fff;
      font-size: 10px;
      font-weight: 850;
      line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .welcome-time-section{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time{
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date{
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed{
      background: ${unsafeCSS(getDomainColor('lock'))};
      color: #ffffff;
    }

    .welcome-alarm.alarm-unknown{
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .welcome-alarm.alarm-disarmed{
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered{
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover{
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon{
      --mdc-icon-size: 18px;
    }

    .alarm-text{
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0%{ opacity: 1; }
      50%{ opacity: 0.7; }
      100%{ opacity: 1; }
    }

    .welcome-weather{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color));
      color: var(--primary-color);
      border-radius: 20px;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent);
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather .weather-temp{
      color: var(--primary-text-color);
    }

    .welcome-weather:hover{
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon{
      --mdc-icon-size: 20px;
    }

    .weather-temp{
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label{
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome{
        text-align: left;
        margin: -10px -10px 16px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      }

      .welcome-content{
        padding: 0;
      }

      .welcome-header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user{
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar{
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon{
        --mdc-icon-size: 21px;
      }

      .welcome-text{
        display: block;
      }

      .welcome-greeting,
.welcome-name{
        display: none;
      }

      .welcome-title{
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return{
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section{
        display: none;
      }

      .welcome-actions{
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action:not(.welcome-notification-action){
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon{
        --mdc-icon-size: 21px;
      }

      .welcome-subheader{
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow: visible;
        flex-wrap: wrap;
        padding: 12px 12px 24px;
        margin-inline: -12px;
        margin-bottom: -22px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar{
        display: none;
      }

      .welcome-alarm,
.welcome-weather{
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
.weather-temp{
        font-size: 15px;
      }

      .weather-label{
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome{
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header{
        gap: 10px;
      }

      .welcome-avatar{
        width: 36px;
        height: 36px;
      }

      .welcome-title{
        font-size: 14px;
      }

      .welcome-return{
        font-size: 11px;
      }

      .welcome-action{
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
.welcome-weather{
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
.weather-temp{
        font-size: 14px;
      }

      .weather-label{
        font-size: 10px;
      }
    }

    /* Home Status Cards */
    .home-status-section{
      margin-bottom: 48px;
    }

    .home-status-heading{
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon{
      --mdc-icon-size: 20px;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-camera-section{
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon{
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-camera-section .mobile-layout-toggle{
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section{
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon{
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-summaries-section .mobile-layout-toggle.active{
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-todos-section{
      margin-bottom: 36px;
    }

    .home-todos-section .home-status-heading ha-icon{
      color: #7c3aed;
      background: color-mix(in srgb, #7c3aed 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #7c3aed 8%, transparent);
    }

    .home-todos-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-todo-card,
.home-todo-card dwains-dashboard-next-card-host{
      display: block;
      min-width: 0;
    }

    .home-custom-cards-section{
      margin-bottom: 36px;
    }

    .home-custom-cards-section .home-status-heading ha-icon{
      color: #0ea5a8;
      background: color-mix(in srgb, #0ea5a8 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #0ea5a8 20%, transparent);
    }

    .home-custom-cards-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-custom-card,
.home-custom-card dwains-dashboard-next-card-host{
      display: block;
      min-width: 0;
    }

    .home-summary-list{
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card{
      appearance: none;
      width: 100%;
      min-height: 68px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 13px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-summary-card:hover{
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active{
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      color: var(--summary-color);
      background: color-mix(in srgb, var(--summary-color) 14%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-icon ha-icon{
      --mdc-icon-size: 21px;
    }

    .home-summary-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title{
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle{
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron{
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-camera-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card{
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      display: flex;
      align-items: stretch;
      padding: 0;
      background: color-mix(in srgb, var(--primary-text-color) 12%, var(--card-background-color));
      color: #ffffff;
      cursor: pointer;
      text-align: left;
      box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .home-camera-card:hover{
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
.home-camera-placeholder{
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder{
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon{
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after{
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background:
        linear-gradient(180deg,
          rgba(7, 11, 18, 0) 0%,
          rgba(7, 11, 18, 0.34) 42%,
          rgba(7, 11, 18, 0.84) 100%);
      pointer-events: none;
    }

    .home-camera-content{
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
.home-camera-count{
      min-width: 36px;
      height: 36px;
      border-radius: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      backdrop-filter: blur(12px);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }

    .home-camera-area-icon ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-camera-count{
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon{
      --mdc-icon-size: 14px;
    }

    .home-camera-copy{
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name{
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta{
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      font-weight: 720;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-home-section,
.mobile-section-heading{
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas{
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action{
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card{
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 156px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 14px 30px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .layout-container.sidebar-collapsed .mobile-area-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture{
      min-height: 176px;
      color: var(--mobile-area-picture-text-color, #ffffff);
      border-color: rgba(255, 255, 255, 0.16);
      background: #182044;
      --mobile-area-picture-text-color: #ffffff;
      --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --mobile-area-picture-overlay:
        linear-gradient(180deg, rgba(12, 18, 32, 0.02) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.84) 100%),
        linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
    }

    .layout-container.sidebar-collapsed .mobile-area-picture{
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after{
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
.layout-container.sidebar-collapsed .mobile-area-copy{
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top{
      display: var(--mobile-area-top-display, flex);
      grid-template-columns: minmax(0, 1fr) max-content;
      align-items: flex-start;
      justify-content: var(--mobile-area-top-justify, space-between);
      gap: var(--mobile-area-top-gap, 8px);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon{
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 13%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon{
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon{
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge{
      min-width: 25px;
      height: 25px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 999px;
      color: var(--area-badge-color, var(--primary-color));
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
      font-size: 11px;
      font-weight: 850;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon{
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge{
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name{
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta{
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 56%, transparent);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,
.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section{
      margin-bottom: 32px;
    }

    .person-cards-grid{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card{
      --person-color: #8a94a6;
      --person-bg: color-mix(in srgb, var(--person-color) 8%, var(--card-background-color));
      position: relative;
      min-height: 98px;
      padding: 16px 18px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 18px;
      background:
        radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--person-color) 15%, transparent), transparent 42%),
        var(--person-bg);
      cursor: pointer;
      box-shadow:
        0 16px 34px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px rgba(255, 255, 255, 0.34);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
    }

    .person-card::after{
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: var(--person-color);
      opacity: 0.34;
    }

    .person-card.home{
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away{
      --person-color: ${unsafeCSS(getDomainColor('alarm_control_panel'))};
      --person-bg: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 9%, var(--card-background-color));
    }

    .person-card.unknown{
      --person-color: ${unsafeCSS(getDomainColor('sensor'))};
      --person-bg: color-mix(in srgb, ${unsafeCSS(getDomainColor('sensor'))} 8%, var(--card-background-color));
    }

    .person-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active{
      transform: scale(0.988);
    }

    .person-card:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper{
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar{
      width: 64px;
      height: 64px;
      border-radius: 22px;
      overflow: hidden;
      background: color-mix(in srgb, var(--person-color) 14%, var(--secondary-background-color));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid color-mix(in srgb, var(--person-color) 26%, rgba(255, 255, 255, 0.84));
      box-shadow: 0 12px 24px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon{
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator{
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 26px;
      height: 26px;
      background: var(--person-color);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-background-color);
      box-shadow: 0 8px 18px color-mix(in srgb, var(--person-color) 26%, transparent);
    }

    .person-home-indicator ha-icon{
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info{
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name{
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status{
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 6px;
      min-height: 27px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--person-color) 12%, transparent);
      color: var(--person-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status ha-icon{
      --mdc-icon-size: 15px;
    }

    .person-details{
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 7px;
      align-items: flex-end;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-left: auto;
      max-width: 170px;
    }

    .person-battery,
.person-distance{
      display: flex;
      align-items: center;
      gap: 5px;
      min-height: 28px;
      font-size: 12px;
      font-weight: 800;
      color: color-mix(in srgb, var(--primary-text-color) 72%, transparent);
      background: rgba(255, 255, 255, 0.62);
      padding: 0 9px;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .person-battery ha-icon,
.person-distance ha-icon{
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon{
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"]{
      color: var(--error-color);
    }

    .person-distance ha-icon{
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid{
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card{
        padding: 16px;
      }

      .person-avatar{
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon{
        --mdc-icon-size: 36px;
      }

      .person-name{
        font-size: 16px;
      }

      .person-status{
        font-size: 13px;
      }

      .person-details{
        gap: 8px;
      }

      .person-battery,
.person-distance{
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card{
      background: var(--card-background-color);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
    }

    .home-status-card::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .home-status-card:hover{
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before{
      opacity: 1;
    }

    .home-status-card .status-card-icon{
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon{
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon{
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge{
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .home-status-card .status-card-title{
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges{
      position: absolute;
      top: 5px;
      right: 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: calc(59% - 24px);
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;
    }

    .info-badge{
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 10%, var(--card-background-color));
      color: var(--badge-color, var(--primary-text-color));
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid color-mix(in srgb, var(--badge-color, var(--divider-color)) 18%, transparent);
    }

    .info-badge ha-icon{
      --mdc-icon-size: 14px;
    }

    .info-badge.light{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('light'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('light'))});
    }

    .info-badge.switch{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('switch'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('switch'))});
    }

    .info-badge.climate{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('climate'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('climate'))});
    }

    .info-badge.media_player{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('media_player'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('media_player'))});
    }

    .info-badge.cover{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('cover'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('cover'))});
    }

    .info-badge.fan{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('fan'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('fan'))});
    }

    .info-badge.motion{
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('sensor'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('sensor'))});
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge{
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon{
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count{
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable{
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover{
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host{
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view{
      max-width: 1400px;
      margin: 0 auto;
    }

    .area-header{
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .area-title{
      font-size: 28px;
      font-weight: 400;
      margin: 0 0 16px 0;
      flex: 1;
    }

    .unavailable-entities-icon{
      background: var(--warning-color);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      margin-bottom: 16px;
    }

    .unavailable-entities-icon:hover{
      background: var(--error-color);
      transform: scale(1.1);
    }

    .unavailable-entities-icon ha-icon{
      --mdc-icon-size: 18px;
      color: white;
    }

    .unavailable-count{
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--error-color);
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 600;
      min-width: 16px;
      text-align: center;
      line-height: 1.2;
    }

    /* Area Badges */
    .area-badges{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .area-badge{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 24px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .area-badge:hover{
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .area-badge ha-icon{
      --mdc-icon-size: 20px;
    }

    .area-badge.light-toggle{
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.light-toggle ha-icon{
      color: var(--warning-color);
    }

    .area-badge.switch-toggle{
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.switch-toggle ha-icon{
      color: var(--info-color);
    }

    .area-badge.wattage{
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.wattage ha-icon{
      color: var(--warning-color);
    }

    .area-badge.energy{
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.energy ha-icon{
      color: var(--info-color);
    }

    /* Entities Section */
    .entities-section{
      display: grid;
      gap: 16px;
    }

    .domain-group{
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon{
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper{
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
.light-entity-card,
.motion-entity-card{
      min-height: 72px;
    }

    .sensor-entity-card{
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
.light-entity-card dwains-dashboard-next-card-host,
.sensor-entity-card dwains-dashboard-next-card-host,
.motion-entity-card dwains-dashboard-next-card-host{
      display: block;
    }

    .mobile-area-overview,
.mobile-entities-section{
      display: none;
    }

    .area-view .mobile-entities-section{
      display: grid;
      position: relative;
      z-index: 2;
    }

    .area-header-metrics{
      display: none;
    }

    .mobile-area-metrics{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-area-metric,
.area-header-metric{
      min-height: 64px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--metric-color) 10%, var(--card-background-color));
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 12%, transparent);
    }

    .mobile-area-metric.temperature,
.area-header-metric.temperature{
      --metric-color: ${unsafeCSS(getDomainColor('climate'))};
    }

    .mobile-area-metric.humidity,
.area-header-metric.humidity{
      --metric-color: ${unsafeCSS(getDomainColor('humidity'))};
    }

    .mobile-area-metric.power,
.area-header-metric.power{
      --metric-color: ${unsafeCSS(getDomainColor('energy'))};
    }

    .mobile-area-metric.energy,
.area-header-metric.energy{
      --metric-color: ${unsafeCSS(getDomainColor('energy'))};
    }

    .metric-ring{
      width: 44px;
      height: 44px;
      position: relative;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background:
        conic-gradient(var(--metric-color) 0deg var(--metric-angle), rgba(15, 23, 42, 0.08) var(--metric-angle) 270deg, transparent 270deg 360deg);
    }

    .metric-ring::after{
      content: "";
      position: absolute;
      inset: 5px;
      border-radius: inherit;
      background: color-mix(in srgb, var(--card-background-color) 92%, #ffffff);
    }

    .metric-ring.metric-icon{
      background: color-mix(in srgb, var(--metric-color) 15%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
    }

    .metric-ring.metric-icon::after{
      display: none;
    }

    .metric-ring.metric-icon ha-icon{
      --mdc-icon-size: 22px;
      color: var(--metric-color);
    }

    .metric-value{
      position: relative;
      z-index: 1;
      color: color-mix(in srgb, var(--primary-text-color) 74%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1;
    }

    .metric-copy{
      min-width: 0;
    }

    .metric-label{
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
    }

    .metric-range{
      margin-top: 4px;
      color: color-mix(in srgb, var(--primary-text-color) 38%, transparent);
      font-size: 10px;
      font-weight: 800;
      line-height: 1;
    }

    .metric-reading{
      margin-top: 3px;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .mobile-entities-section{
      gap: 22px;
    }

    .mobile-domain-group{
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group.group-editing{
      border-radius: 8px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, background-color 0.16s ease;
    }

    .mobile-domain-group.group-dragging{
      opacity: 0.46;
    }

    .mobile-domain-group.group-drag-over{
      outline: 2px solid var(--primary-color);
      outline-offset: 7px;
      background: color-mix(in srgb, var(--primary-color) 5%, transparent);
    }

    .mobile-domain-group:not(.menu-open){
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open{
      z-index: 1200;
    }

    .mobile-domain-header{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-domain-header-actions{
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
    }

    .mobile-domain-order-button,
.mobile-domain-drag-handle{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent);
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .mobile-domain-drag-handle{
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-drag-handle:active{
      cursor: grabbing;
    }

    .mobile-domain-order-button:disabled{
      opacity: 0.28;
      cursor: default;
    }

    .mobile-domain-order-button ha-icon,
.mobile-domain-drag-handle ha-icon{
      --mdc-icon-size: 18px;
    }

    .mobile-layout-toggle{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 72%, #ffffff);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-layout-toggle.active{
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active{
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-layout-toggle.static{
      cursor: default;
      pointer-events: none;
    }

    .mobile-section-icon{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .mobile-section-icon ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-summaries-section .mobile-section-icon.summaries{
      color: #f59e0b;
    }

    .home-todos-section .mobile-section-icon.todos{
      color: #7c3aed;
    }

    .home-custom-cards-section .mobile-section-icon.custom-cards{
      color: #0ea5a8;
    }

    .mobile-domain-title-copy{
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label{
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count{
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-master{
      --mobile-domain-accent: var(--primary-color);
      min-width: 58px;
      height: 30px;
      padding: 0 5px 0 7px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-master.domain-light{
      --mobile-domain-accent: #e89a17;
    }

    .mobile-domain-master.domain-switch,
.mobile-domain-master.domain-input_boolean{
      --mobile-domain-accent: #3275d6;
    }

    .mobile-domain-master.domain-cover{
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master.domain-fan{
      --mobile-domain-accent: #2d9d79;
    }

    .mobile-domain-master.domain-lock{
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master.active{
      border-color: color-mix(in srgb, var(--mobile-domain-accent) 42%, transparent);
      background: color-mix(in srgb, var(--mobile-domain-accent) 11%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master:active{
      transform: scale(0.94);
    }

    .mobile-domain-master ha-icon{
      --mdc-icon-size: 16px;
    }

    .mobile-domain-master-track{
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      transition: background-color 0.18s ease;
    }

    .mobile-domain-master-track::after{
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .mobile-domain-master.active .mobile-domain-master-track{
      background: var(--mobile-domain-accent);
    }

    .mobile-domain-master.active .mobile-domain-master-track::after{
      transform: translateX(10px);
    }

    .mobile-domain-master-actions{
      --mobile-domain-accent: var(--primary-color);
      height: 30px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      z-index: 1202;
    }

    .mobile-domain-master-actions.domain-cover{
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master-actions.domain-lock{
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master-action{
      width: 34px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-domain-master-action + .mobile-domain-master-action{
      border-left: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .mobile-domain-master-action:hover,
.mobile-domain-master-action.active{
      background: color-mix(in srgb, var(--mobile-domain-accent) 12%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master-action:active{
      transform: scale(0.88);
    }

    .mobile-domain-master-action ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-entity-rail{
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar{
      display: none;
    }

    .mobile-entities-section.layout-grid{
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-tile-host{
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-replacement-card{
      box-sizing: border-box;
      flex: 0 0 260px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-replacement-card dwains-dashboard-next-card-host{
      display: block;
      width: 100%;
    }

    .mobile-todo-list-card{
      box-sizing: border-box;
      flex: 0 0 min(100%, 520px);
      width: min(100%, 520px);
      min-width: min(100%, 320px);
      scroll-snap-align: start;
    }

    .mobile-todo-list-card dwains-dashboard-next-card-host{
      display: block;
      width: 100%;
    }

    .mobile-entities-section.layout-grid .mobile-entity-replacement-card{
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-todo-list-card{
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-tile-host{
          min-height: 0;
          padding: 0;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top{
          gap: 6px;
        }
      }

      .mobile-entity-status{
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-select{
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select{
        width: 100%;
        height: 34px;
        padding: 0 34px 0 12px;
        border: 0;
        border-radius: 999px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--entity-color) 10%, var(--secondary-background-color));
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        line-height: 34px;
        cursor: pointer;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 16%, transparent),
          0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .mobile-entity-select select:focus{
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled{
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon{
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    /* Bewerk-toggle in de area-header */
    .area-header{ display: flex; align-items: center; gap: 8px; }
    .dd-edit-toggle{
      margin-left: auto;
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 50%;
      border: none; cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color .2s ease, color .2s ease;
    }
    .dd-edit-toggle:hover{ background: rgba(var(--rgb-primary-color, 3,169,244), .14); }
    .dd-edit-toggle.active{ background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .dd-edit-toggle.danger:hover{ background: rgba(var(--rgb-error-color, 244,67,54), .16); color: var(--error-color, #f44336); }
    .dd-edit-toggle ha-icon{ --mdc-icon-size: 20px; }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider{
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page{
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .dd-add-page:hover{
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon{ --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card{ margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host{ display: block; }

    /* Area custom card slots */
    .dd-custom-section{
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain{
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing{
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over{
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }

    .dd-custom-slot-title{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon{
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid{
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      container-type: inline-size;
    }

    .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
      --dd-card-default-column: span 4;
      grid-column: var(--dd-card-grid-column, var(--dd-card-default-column));
      min-height: var(--dd-card-grid-min-height, 0);
    }

    .dd-custom-card-wrap{
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing{
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-generated-card-wrap{
      display: contents;
    }

    .dd-generated-card-wrap.editing{
      position: relative;
      display: block;
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
      cursor: grab;
      outline: 1px dashed color-mix(in srgb, var(--primary-color) 38%, var(--divider-color));
      outline-offset: 2px;
      border-radius: 12px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, transform 0.16s ease;
    }

    .dd-generated-card-wrap.editing > .mobile-entity-card,
.dd-generated-card-wrap.editing > .mobile-entity-replacement-card,
.dd-generated-card-wrap.editing > .mobile-todo-list-card{
      width: 100%;
      min-width: 0;
      pointer-events: none;
    }

    .dd-generated-card-wrap.editing.is-hidden > :not(.dd-generated-card-toolbar){
      opacity: 0.38;
      filter: saturate(0.45);
    }

    .dd-generated-card-wrap.editing.dragging{
      opacity: 0.42;
      cursor: grabbing;
    }

    .dd-generated-card-wrap.editing.drag-over{
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 14%, transparent);
      transform: translateY(-2px);
    }

    .dd-generated-card-toolbar{
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 6;
      display: flex;
      gap: 4px;
      padding: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dd-generated-card-toolbar button{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .dd-generated-card-toolbar button:first-child{
      color: var(--primary-color);
      cursor: grab;
    }

    .dd-generated-card-toolbar button:hover,
.dd-generated-card-toolbar button:focus-visible{
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      outline: none;
    }

    .dd-generated-card-toolbar ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-entities-section.layout-grid .dd-generated-card-wrap.editing{
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .dd-custom-card-wrap.dragging{
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over{
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar{
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar{ display: flex; }
    .dd-card-toolbar button{
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover{ color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon{ --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag{
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active{
      cursor: grabbing;
    }

    .dd-add-card-inline,
.dd-add-card{
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover{
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline{
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon{
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon{ --mdc-icon-size: 22px; }

    .dd-domain-add-card{
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
.dd-domain-add-card.drag-over{
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
.entities-grid .dd-domain-add-card{
      min-width: 0;
    }

    .entities-grid > .dd-custom-card-wrap.dd-grid-full,
.mobile-entities-section.layout-grid .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full{
      grid-column: 1 / -1;
      width: 100%;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
.mobile-entity-rail .dd-domain-add-card{
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full{
      flex-basis: calc(100% - 20px);
    }

    .mobile-entity-rail .dd-domain-add-card{
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
.mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{
      min-height: 138px;
    }

    @container (max-width: 899px) {
      .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
        --dd-card-default-column: span 6;
      }
    }

    @container (max-width: 559px) {
      .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
        --dd-card-default-column: span 12;
      }
    }

    .entity-card-wrapper.loading{
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton{
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0%{ background-position: 200% 0; }
      100%{ background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar{
        position: static;
        width: 100%;
        flex-basis: auto;
        height: auto;
        max-height: none;
        overflow: visible;
        scrollbar-gutter: auto;
        border: 0;
        background: transparent;
        transition: none;
      }

      .sidebar-resize-handle{
        display: none;
      }

      .sidebar-collapse-toggle{
        display: none;
      }

      .floor-areas{
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button{
        margin-bottom: 8px;
      }



      .mobile-nav-overlay{
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open{
        opacity: 1;
        pointer-events: auto;
      }

      .global-header{
        padding: 12px;
      }

      .header-time{
        font-size: 20px;
      }



      .entities-grid{
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after{
        right: -8px;
      }

      .mobile-home-section,
.home-camera-section,
.home-status-section,
.home-todos-section,
.home-custom-cards-section,
.home-favorites-section,
.home-summaries-section,
.mobile-domain-group,
.mobile-entities-section.layout-grid .mobile-entity-tile-host{
        content-visibility: visible;
        contain-intrinsic-size: auto;
      }
    }

    /* Favorites Section */
    .favorites-section{
      margin-bottom: 24px;
    }

    .favorites-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper{
      --favorite-color: var(--primary-color);
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 116px;
      padding: 14px 14px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 9px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper:hover{
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active{
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
.favorite-quick-action:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
.favorite-card-wrapper.is-idle{
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light{
      --favorite-color: ${unsafeCSS(getDomainColor('light'))};
    }

    .favorite-card-wrapper.favorite-switch{
      --favorite-color: ${unsafeCSS(getDomainColor('switch'))};
    }

    .favorite-card-wrapper.favorite-cover{
      --favorite-color: ${unsafeCSS(getDomainColor('cover'))};
    }

    .favorite-card-wrapper.favorite-binary_sensor,
.favorite-card-wrapper.favorite-motion{
      --favorite-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .favorite-card-wrapper.favorite-climate,
.favorite-card-wrapper.favorite-weather{
      --favorite-color: ${unsafeCSS(getDomainColor('climate'))};
    }

    .favorite-card-wrapper.favorite-media_player{
      --favorite-color: ${unsafeCSS(getDomainColor('media_player'))};
    }

    .favorite-card-wrapper.favorite-person{
      --favorite-color: #3f9b6d;
    }

    .favorite-card-wrapper.favorite-sun{
      --favorite-color: #2d7eea;
    }

    .favorite-top,
.favorite-body{
      position: relative;
      z-index: 1;
    }

    .favorite-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon{
      width: 31px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon{
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action{
      --toggle-track: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      width: 38px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      color: transparent;
      background: var(--toggle-track);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
      font: inherit;
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-quick-action::before{
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper.is-active .favorite-quick-action{
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before{
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action{
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before{
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon{
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon{
      display: none;
    }

    .favorite-quick-action:active{
      transform: scale(0.94);
    }

    .favorite-name{
      color: inherit;
      margin-top: 2px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .favorite-state{
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area{
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([data-theme-dark]){
      .favorite-card-wrapper {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 90%, #ffffff 4%),
            color-mix(in srgb, var(--card-background-color) 98%, #000000 3%));
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.045),
          inset 0 0 0 1px rgba(255, 255, 255, 0.045);
      }

      .favorite-card-wrapper:hover {
        box-shadow:
          0 18px 34px rgba(0, 0, 0, 0.36),
          inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 30%, transparent);
      }

      .favorite-quick-action {
        --toggle-track: rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 5px 12px rgba(0, 0, 0, 0.28);
      }

      .favorite-card-wrapper.info-only .favorite-quick-action {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(248, 250, 252, 0.82);
      }
    }


    /* Toast Notification */
    .toast{
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      padding: 12px 24px;
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .toast.show{
      opacity: 1;
    }

    /* Confirmation Dialog */
    .confirmation-dialog{
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.48);
      backdrop-filter: blur(2px);
      z-index: 1100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.18s ease;
    }

    .confirmation-dialog.show{
      opacity: 1;
      pointer-events: auto;
    }

    .confirmation-content{
      box-sizing: border-box;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 20px;
      width: min(420px, calc(100vw - 32px));
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
      outline: none;
      transform: scale(0.96);
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .confirmation-dialog.show .confirmation-content{
      transform: scale(1);
    }

    .confirmation-title{
      font-size: 18px;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .confirmation-message{
      margin-bottom: 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.5;
    }

    .confirmation-actions{
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .notifications-title{
      min-width: 0;
    }

    .notifications-actions{
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .notifications-icon-button,
.notification-dismiss{
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      -webkit-tap-highlight-color: transparent;
    }

    .notifications-icon-button{
      width: 34px;
      height: 34px;
    }

    .notifications-icon-button ha-icon{
      --mdc-icon-size: 18px;
    }

    .notifications-list{
      padding: 10px;
    }

    .notification-row{
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: start;
      padding: 11px 10px;
      margin-bottom: 8px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }

    .notification-row:last-child{
      margin-bottom: 0;
    }

    .notification-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.11);
      color: var(--primary-color);
    }

    .notification-icon ha-icon{
      --mdc-icon-size: 21px;
    }

    .notification-title{
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .notification-message{
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .notification-date{
      margin-top: 7px;
      color: color-mix(in srgb, var(--secondary-text-color) 74%, transparent);
      font-size: 11px;
      font-weight: 650;
    }

    .notification-dismiss{
      width: 32px;
      height: 32px;
      color: var(--secondary-text-color);
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-dismiss ha-icon{
      --mdc-icon-size: 17px;
    }

    .notifications-empty,
.notifications-error,
.notifications-loading{
      min-height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 18px;
      color: var(--secondary-text-color);
      text-align: center;
      font-size: 13px;
      font-weight: 600;
    }

    .notifications-empty ha-icon,
.notifications-error ha-icon,
.notifications-loading ha-icon{
      --mdc-icon-size: 28px;
      color: var(--primary-color);
    }

    @media (max-width: 1024px) {
    }

    .confirmation-button{
      min-height: 40px;
      padding: 9px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 650;
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .confirmation-button.cancel{
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .confirmation-button.confirm{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .confirmation-button.confirm.destructive{
      background: var(--error-color, #db4437);
      color: #fff;
    }

    .confirmation-button:hover{
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Area Badges Styling */
    .area-badges{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0px; /* 16px;*/
    }

    .area-badge{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: default;
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 10%, var(--card-background-color));
      color: var(--area-badge-color, var(--primary-text-color));
      border: 1px solid color-mix(in srgb, var(--area-badge-color, var(--divider-color)) 20%, transparent);
    }

    .area-badge ha-icon{
      --mdc-icon-size: 18px;
    }

    /* Domain-specific badge colors */
    .area-badge.light{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('light'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('light'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('light'))}) 20%, transparent);
    }

    .area-badge.switch{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('switch'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('switch'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('switch'))}) 20%, transparent);
    }

    .area-badge.climate{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('climate'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('climate'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('climate'))}) 20%, transparent);
    }

    .area-badge.motion.active{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('sensor'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('sensor'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('sensor'))}) 20%, transparent);
    }

    .area-badge.cover{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))}) 20%, transparent);
    }

    .area-badge.media_player{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('media_player'))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('media_player'))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('media_player'))}) 20%, transparent);
    }

    .area-badge.temperature{
      background: color-mix(in srgb, var(--cyan-color) 10%, var(--card-background-color));
      color: var(--cyan-color);
      border-color: color-mix(in srgb, var(--cyan-color) 20%, transparent);
    }

    .area-badge.humidity{
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
      border-color: color-mix(in srgb, var(--blue-color) 20%, transparent);
    }

    .area-badge.wattage{
      background: color-mix(in srgb, var(--yellow-color) 10%, var(--card-background-color));
      color: var(--yellow-color);
      border-color: color-mix(in srgb, var(--yellow-color) 20%, transparent);
    }

    .area-badge.energy{
      background: color-mix(in srgb, var(--indigo-color) 10%, var(--card-background-color));
      color: var(--indigo-color);
      border-color: color-mix(in srgb, var(--indigo-color) 20%, transparent);
    }

    /* Toggle button badges */
    .area-badge.light-toggle,
.area-badge.switch-toggle{
      cursor: pointer;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }

    .area-badge.light-toggle:hover,
.area-badge.switch-toggle:hover{
      background: color-mix(in srgb, var(--primary-color) 90%, black);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .area-badges{
        padding: 12px;
        gap: 6px;
      }

      .area-badge{
        padding: 6px 10px;
        font-size: 13px;
      }

      .area-badge ha-icon{
        --mdc-icon-size: 16px;
      }
    }

    /* Header Expanded Content Styling */
    .global-header.expanded{
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content{
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from{
        opacity: 0;
        transform: translateY(-10px);
      }
      to{
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites{
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section{
      width: 100%;
    }

    .favorites-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon{
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3{
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper{
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile{
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      border: 1px dashed var(--divider-color);
    }

    .no-favorites ha-icon{
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p{
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button{
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-expand-button:hover{
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon{
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button{
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content{
        padding: 12px;
      }

      .favorites-grid{
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button{
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon{
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
.status-card-compact{
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
.status-card-compact.cover{
      --status-color: ${unsafeCSS(getDomainColor('cover'))};
    }

    .home-status-card.binary_sensor,
.home-status-card.motion,
.status-card-compact.binary_sensor,
.status-card-compact.motion{
      --status-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .home-status-card.light,
.status-card-compact.light{
      --status-color: ${unsafeCSS(getDomainColor('light'))};
    }

    .home-status-card.switch,
.status-card-compact.switch{
      --status-color: ${unsafeCSS(getDomainColor('switch'))};
    }

    .home-status-card.climate,
.status-card-compact.climate{
      --status-color: ${unsafeCSS(getDomainColor('climate'))};
    }

    .home-status-card.person,
.status-card-compact.person{
      --status-color: #3f9b6d;
    }

    .home-status-card.media_player,
.status-card-compact.media_player{
      --status-color: ${unsafeCSS(getDomainColor('media_player'))};
    }

    .home-status-card.fan,
.status-card-compact.fan{
      --status-color: ${unsafeCSS(getDomainColor('fan'))};
    }

    .home-status-card.wattage,
.home-status-card.house-power-card,
.home-status-card.energy,
.status-card-compact.wattage,
.status-card-compact.energy{
      --status-color: ${unsafeCSS(getDomainColor('energy'))};
    }

    .home-status-grid{
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card{
      min-height: 134px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .home-status-card::before{
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before{
      opacity: 0.85;
    }

    .home-status-card .status-card-icon{
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon{
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon{
      transform: none;
    }

    .home-status-card .status-card-badge{
      top: -8px;
      right: -8px;
      width: auto;
      min-width: 24px;
      height: 24px;
      padding: 0 7px;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 5px 12px color-mix(in srgb, var(--status-color) 28%, transparent);
    }

    .home-status-card .status-card-title{
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title{
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value{
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card{
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card{
      --status-color: ${unsafeCSS(getDomainColor('energy'))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card{
      --status-color: ${unsafeCSS(getDomainColor('room_climate'))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head{
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
.home-status-card.house-climate-card .house-climate-icon,
.home-status-card.house-power-card .house-power-icon{
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
.house-climate-copy,
.house-power-copy{
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
.house-climate-title,
.house-power-title{
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
.house-persons-empty,
.house-climate-subtitle,
.house-power-subtitle,
.house-power-empty{
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head{
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric{
      min-width: 0;
      min-height: 48px;
      padding: 8px 9px;
      border: 0;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      align-items: center;
      column-gap: 8px;
      background: color-mix(in srgb, var(--metric-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 14%, transparent);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .house-climate-metric:active{
      transform: scale(0.97);
    }

    .house-climate-metric-icon{
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
.house-climate-metric-label{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value{
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label{
      font-size: 10px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head{
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total{
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list{
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room{
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon{
      width: 26px;
      height: 26px;
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-power-room-icon ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
.house-power-room-value{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name{
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value{
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar{
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: ${unsafeCSS(getDomainColor('energy'))};
    }

    .house-persons-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini{
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-background-color) 78%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .house-person-mini:active{
      transform: scale(0.97);
    }

    .house-person-mini.is-home{
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away{
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 10%, var(--card-background-color));
    }

    .house-person-avatar{
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-person-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
.house-person-mini-state{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name{
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state{
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1.1;
    }

    .header-status-scroll{
      gap: 8px;
      padding: 2px 2px 4px 12px;
    }

    .status-card-compact{
      flex: 0 0 auto;
      min-width: 92px;
      max-width: 150px;
      min-height: 70px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 7px 12px 9px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    }

    .status-card-compact:hover{
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact{
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon{
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact{
      top: -7px;
      right: -8px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--status-color) 26%, transparent);
    }

    .status-card-compact .status-card-title-compact{
      width: 100%;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
      opacity: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .status-card-compact.has-value .status-card-title-compact{
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact{
      width: 100%;
      margin-top: 1px;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .home-status-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin: 0;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-section{
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading{
        display: none;
      }

      .home-summaries-section{
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading{
        display: none;
      }

      .home-todos-section{
        margin: 0 -10px 18px;
      }

      .home-todos-section .home-status-heading{
        display: none;
      }

      .home-todos-grid{
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-custom-cards-section{
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-custom-cards-section .home-status-heading{
        display: none;
      }

      .home-custom-cards-grid{
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-summary-list{
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card{
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon{
        width: 36px;
        height: 36px;
      }

      .home-camera-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar{
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid{
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card{
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content{
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name{
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar{
        display: none;
      }

      .home-status-card{
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card{
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card{
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card{
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title{
        font-size: 15px;
      }

      .status-card-compact{
        min-width: 88px;
      }

      .home-view{
        max-width: none;
      }

      .person-cards-section{
        display: none;
      }

      .home-status-heading{
        display: none;
      }

      .mobile-home-section{
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title{
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label{
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action{
        appearance: none;
        min-width: 66px;
        height: 28px;
        padding: 0 10px 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 850;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          transform 0.18s ease;
      }

      .mobile-section-action ha-icon{
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active{
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail{
        display: flex;
        gap: 10px;
        margin-block: 0 -16px;
        padding: 3px 18px 32px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar{
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 3px 18px 32px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card{
        appearance: none;
        position: relative;
        box-sizing: border-box;
        flex: 0 0 152px;
        min-width: 0;
        min-height: 130px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        font: inherit;
        box-shadow: 0 12px 28px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        text-align: left;
        scroll-snap-align: start;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .mobile-home-section.layout-grid .mobile-area-card{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail{
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active{
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture{
        min-height: 146px;
        color: var(--mobile-area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.16);
        background: #182044;
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-card.has-picture.text-dark{
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture{
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
.mobile-area-copy{
        position: relative;
        z-index: 2;
      }

      .mobile-area-top{
        display: var(--mobile-area-top-display, flex);
        grid-template-columns: minmax(0, 1fr) max-content;
        align-items: flex-start;
        justify-content: var(--mobile-area-top-justify, space-between);
        gap: var(--mobile-area-top-gap, 8px);
      }

      .mobile-area-icon{
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 13%, transparent);
      }

      .mobile-area-icon ha-icon{
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon{
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge{
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 999px;
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
        font-size: 11px;
        font-weight: 850;
      }

      .mobile-area-card.has-picture .mobile-area-badge{
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon{
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light{
        --area-badge-color: ${unsafeCSS(getDomainColor('light'))};
      }

      .mobile-area-badge.cover{
        --area-badge-color: ${unsafeCSS(getDomainColor('cover'))};
      }

      .mobile-area-badge.motion{
        --area-badge-color: ${unsafeCSS(getDomainColor('sensor'))};
      }

      .mobile-area-name{
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta{
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta{
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
.mobile-area-card.has-picture .mobile-area-meta{
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon{
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
.mobile-area-card.has-picture.text-dark .mobile-area-meta{
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section{
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading{
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card{
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
.home-status-section.layout-grid .house-climate-card,
.home-status-section.layout-grid .house-power-card{
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid{
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before{
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon{
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon{
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge{
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      :host([data-theme-dark]){
        .home-welcome {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 7%) 0%,
              color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.34),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        .welcome-avatar {
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.34),
            0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        .welcome-action:not(.welcome-notification-action) {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 84%, #ffffff 8%),
              color-mix(in srgb, var(--card-background-color) 94%, #000000 6%));
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .mobile-area-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mobile-area-card:not(.has-picture) .mobile-area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
        }

        .mobile-area-badge {
          background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 20%, transparent);
        }

        .home-status-card.house-persons-card {
          --status-color: #8ea8ff;
        }

        .home-status-card.house-power-card {
          --status-color: ${unsafeCSS(getDomainColor('energy'))};
        }

        .home-status-card.house-climate-card {
          --status-color: ${unsafeCSS(getDomainColor('room_climate'))};
        }

        .house-person-mini {
          background: color-mix(in srgb, var(--card-background-color) 78%, #ffffff 5%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .house-climate-metric {
          background: color-mix(in srgb, var(--metric-color) 18%, var(--card-background-color));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        }

        .house-power-room-icon {
          background: color-mix(in srgb, var(--status-color) 20%, transparent);
        }

        .house-power-bar {
          background: color-mix(in srgb, var(--status-color) 13%, var(--card-background-color));
        }

        .house-person-mini.is-home {
          background: color-mix(in srgb, #2f9b62 20%, var(--card-background-color));
        }

        .house-person-mini.is-away {
          background: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 16%, var(--card-background-color));
        }

        .home-summary-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .home-summary-icon {
          background: color-mix(in srgb, var(--summary-color) 20%, transparent);
        }
      }

      .home-favorites-section{
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow: visible;
      }

      .home-favorites-section .favorites-header{
        display: none;
      }

      .home-favorites-section .mobile-section-heading{
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin-block: 0 -32px;
        padding: 3px 18px 32px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar{
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper{
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid{
          grid-template-columns: 1fr;
        }
      }
    }

    /* Area status/action pills */
    .area-badges{
      gap: 8px;
      align-items: center;
      margin-bottom: 18px;
    }

    .area-badge{
      min-height: 38px;
      padding: 9px 15px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      box-shadow: none;
    }

    .area-badge ha-icon{
      --mdc-icon-size: 17px;
    }

    .area-badge.cover{
      background: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))}) 12%, var(--card-background-color));
      border-color: color-mix(in srgb, var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))}) 22%, transparent);
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))});
    }

    .area-badge.cover ha-icon{
      color: var(--area-badge-color, ${unsafeCSS(getDomainColor('cover'))});
    }

    .area-badge.light-toggle,
.area-badge.switch-toggle{
      min-width: 132px;
      justify-content: center;
      cursor: pointer;
      background: #089987;
      border-color: #089987;
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(8, 153, 135, 0.18);
    }

    .area-badge.light-toggle ha-icon{
      color: #ffc400;
    }

    .area-badge.switch-toggle ha-icon{
      color: #1f86d9;
    }

    .area-badge.light-toggle:hover,
.area-badge.switch-toggle:hover{
      background: #078b7b;
      border-color: #078b7b;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(8, 153, 135, 0.24);
    }

    .area-badge.light-toggle:active,
.area-badge.switch-toggle:active{
      transform: translateY(0);
      box-shadow: 0 5px 14px rgba(8, 153, 135, 0.18);
    }

    /* Room header */
    .area-header{
      position: relative;
      isolation: isolate;
      z-index: 0;
      min-height: 138px;
      margin-bottom: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 12%, rgba(0, 0, 0, 0.06));
      background:
        linear-gradient(135deg,
          var(--card-background-color) 0%,
          color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
    }

    .area-header::before{
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 56px 56px;
      opacity: 0.38;
    }

    .area-header-background{
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      filter: saturate(1.05) contrast(1.02);
    }

    .area-header.has-picture{
      border-color: rgba(255, 255, 255, 0.16);
      background: #172321;
      color: var(--area-header-picture-text-color, #ffffff);
      --area-header-picture-text-color: #ffffff;
      --area-header-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.18);
      --area-header-picture-control-border: rgba(255, 255, 255, 0.16);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(13, 24, 23, 0.84), rgba(13, 24, 23, 0.46)),
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
    }

    .area-header.has-picture.text-dark{
      --area-header-picture-text-color: #0f172a;
      --area-header-picture-muted-text-color: rgba(15, 23, 42, 0.72);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.72);
      --area-header-picture-control-border: rgba(15, 23, 42, 0.08);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.48)),
        linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    }

    .area-header.has-picture::before{
      z-index: 1;
      background: var(--area-header-picture-overlay);
      background-size: auto, 56px 56px, 56px 56px;
      opacity: 1;
    }

    .area-header-content{
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .area-title-group{
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .area-mobile-toolbar{
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: auto minmax(0, max-content) auto;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .area-mobile-round{
      width: 42px;
      height: 42px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 88%, #ffffff);
      color: #182044;
      cursor: pointer;
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(15, 23, 42, 0.06);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease,
        color 0.18s ease;
    }

    .area-mobile-round:hover{
      transform: translateY(-1px);
      box-shadow:
        0 14px 28px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(15, 23, 42, 0.08);
    }

    .area-mobile-round ha-icon,
.area-mobile-round .dd-static-icon{
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .area-mobile-home{
      display: none;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .layout-container.sidebar-collapsed .area-mobile-home{
      display: inline-flex;
    }

    .area-mobile-quick-controls{
      grid-column: 2;
      justify-self: start;
      max-width: 100%;
      min-height: 40px;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .area-mobile-quick-controls.empty{
      visibility: hidden;
    }

    .area-quick-control{
      min-width: 60px;
      height: 34px;
      padding: 0 7px 0 9px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .area-quick-control:active{
      transform: scale(0.96);
    }

    .area-quick-main{
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .area-quick-control ha-icon{
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .area-quick-count{
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      white-space: nowrap;
    }

    .area-quick-switch{
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.12);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.05),
        inset 0 1px 3px rgba(15, 23, 42, 0.12);
      transition:
        background-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-quick-switch::after{
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .area-quick-control.active{
      background: #182044;
      color: #ffffff;
    }

    .area-quick-control.light.active{
      color: #ffd047;
    }

    .area-quick-control.switch.active{
      color: #58a9ff;
    }

    .area-quick-control.cover.active{
      color: #b984ff;
    }

    .area-quick-control.fan.active{
      color: #55bda4;
    }

    .area-quick-control.climate.active{
      color: #51aadd;
    }

    .area-quick-control.active .area-quick-switch{
      background: currentColor;
    }

    .area-quick-control.active .area-quick-switch::after{
      transform: translateX(10px);
    }

    .area-quick-direction{
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
      color: currentColor;
    }

    .area-quick-direction ha-icon{
      --mdc-icon-size: 16px;
    }

    .area-quick-control.has-actions{
      padding-right: 4px;
      cursor: default;
    }

    .area-quick-control.has-actions:active{
      transform: none;
    }

    .area-quick-actions{
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
    }

    .area-quick-action{
      width: 25px;
      height: 24px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: currentColor;
      cursor: pointer;
      transition: background-color 0.18s ease, transform 0.18s ease;
    }

    .area-quick-action + .area-quick-action{
      border-left: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    }

    .area-quick-action:hover{
      background: color-mix(in srgb, currentColor 10%, transparent);
    }

    .area-quick-action:active{
      transform: scale(0.86);
    }

    .area-quick-action ha-icon{
      --mdc-icon-size: 15px;
    }

    .area-mobile-actions{
      grid-column: 3;
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .area-mobile-edit{
      position: relative;
    }

    .area-mobile-edit.active{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-mobile-actions .unavailable-entities-icon{
      width: 42px;
      height: 42px;
      margin: 0;
      border-radius: 999px;
    }

    .area-desktop-back{
      display: none;
      width: 42px;
      height: 42px;
      padding: 0;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-desktop-back:hover{
      transform: translateY(-1px);
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.24),
        inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    }

    .area-desktop-back:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .area-desktop-back ha-icon,
.area-desktop-back .dd-static-icon{
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .layout-container.sidebar-collapsed .area-desktop-back{
      display: none;
    }

    .area-title-copy{
      min-width: 0;
    }

    .area-subtitle{
      display: block;
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 55%, transparent);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
    }

    .area-header-icon{
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--primary-color) 13%, var(--card-background-color));
      color: var(--primary-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .area-header-icon ha-icon{
      --mdc-icon-size: 26px;
    }

    .area-header.has-picture .area-header-icon{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow: inset 0 0 0 1px var(--area-header-picture-control-border);
    }

    .area-title{
      margin: 0;
      color: var(--primary-text-color);
      font-size: clamp(30px, 3.1vw, 44px);
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
      overflow-wrap: anywhere;
    }

    .area-header.has-picture .area-subtitle{
      color: var(--area-header-picture-muted-text-color, rgba(255, 255, 255, 0.76));
    }

    .area-header.has-picture .area-title{
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header-actions{
      display: none;
      align-items: center;
      gap: 10px;
      flex: 0 0 auto;
    }

    .area-header .dd-edit-toggle{
      margin-left: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color);
    }

    .area-header .dd-edit-toggle:hover,
.area-header .dd-edit-toggle.active{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-header.has-picture .dd-edit-toggle{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header .unavailable-entities-icon{
      margin-bottom: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(255, 152, 0, 0.14);
      color: var(--warning-color);
    }

    .area-header .unavailable-entities-icon ha-icon{
      color: var(--warning-color);
    }

    .area-header.has-picture .unavailable-entities-icon{
      background: var(--area-header-picture-control-bg);
    }

    .area-header.has-picture .unavailable-entities-icon ha-icon{
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header.has-picture .area-mobile-round,
.area-header.has-picture .area-mobile-quick-controls,
.area-header.has-picture .area-mobile-actions .unavailable-entities-icon{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.18),
        inset 0 0 0 1px var(--area-header-picture-control-border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .area-header .area-badges{
      display: none;
    }

    .area-header.has-picture .area-badge:not(.light-toggle):not(.switch-toggle){
      background: var(--area-header-picture-control-bg);
      border-color: var(--area-header-picture-control-border);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    @media (min-width: 769px) {
      .area-header{
        min-height: 166px;
        padding: 20px 22px 22px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "nav actions"
          "title metrics"
          "controls metrics";
        align-items: start;
        column-gap: 24px;
        row-gap: 8px;
        border-color: color-mix(in srgb, var(--divider-color) 70%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      }

      .area-header::before{
        opacity: 0;
      }

      .area-header-content{
        grid-area: title;
        align-self: start;
        margin-top: 2px;
      }

      .area-mobile-toolbar{
        display: contents;
      }

      .area-mobile-home{
        grid-area: nav;
        display: inline-flex;
        align-self: start;
        justify-self: start;
        width: 44px;
        height: 44px;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-mobile-quick-controls{
        grid-area: controls;
        min-height: 42px;
        width: min(520px, 100%);
        max-width: 100%;
        margin-top: 4px;
        margin-left: 0;
        align-self: start;
        justify-self: start;
      }

      .area-mobile-quick-controls.count-1{
        width: min(420px, 100%);
      }

      .area-mobile-quick-controls.count-1 .area-quick-control{
        flex: 1 1 auto;
        justify-content: space-between;
      }

      .area-mobile-quick-controls.empty{
        min-height: 0;
        margin: 0;
      }

      .area-mobile-actions{
        grid-area: actions;
        position: relative;
        top: auto;
        right: auto;
        z-index: 5;
        align-self: start;
        justify-self: end;
      }

      .area-header-metrics{
        grid-area: metrics;
        position: relative;
        z-index: 3;
        min-width: 0;
        max-width: min(34vw, 360px);
        margin: 2px 56px 0 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
      }

      .area-header-metric{
        min-width: 132px;
        min-height: 44px;
        padding: 8px 12px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header-metric .metric-ring::after{
        inset: 4px;
      }

      .area-header-metric .metric-ring.metric-icon ha-icon{
        --mdc-icon-size: 17px;
      }

      .area-header-metric .metric-label{
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .area-header-metric .metric-reading{
        margin-top: 2px;
        font-size: 13px;
      }

      .area-title-group{
        gap: 0;
      }

      .area-header-icon{
        display: none;
      }

      .area-title{
        font-size: clamp(24px, 2.4vw, 34px);
        line-height: 1.04;
      }

      .area-subtitle{
        margin-top: 3px;
      }

      .layout-container.sidebar-collapsed .area-mobile-home{
        position: relative;
        top: auto;
        left: auto;
      }

      .layout-container.sidebar-collapsed .area-header-content{
        padding-left: 0;
      }

      .layout-container.sidebar-collapsed .area-mobile-quick-controls{
        margin-left: 0;
      }
    }

    @media (max-width: 768px) {
      :host{
        height: auto;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container{
        display: block;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content{
        display: block;
        min-height: 100dvh;
        overflow: visible;
      }

      .content-area{
        padding: 0;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
        overscroll-behavior: auto;
        -webkit-overflow-scrolling: auto;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area{
        padding-bottom: 0;
      }

      .content-area.area-content-area{
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area{
        padding: 0;
      }

      .home-view{
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view{
        width: 100%;
        margin: 0;
        padding: 8px 10px calc(152px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-actions{
        display: none;
      }

      .settings-page-editor{
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .settings-page-bottom-actions{
        position: sticky;
        bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        z-index: 5;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        margin: 12px 0 0;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
      }

      .settings-page-bottom-actions .settings-secondary,
.settings-page-bottom-actions .settings-primary{
        width: 100%;
      }

      .global-header.mobile{
        margin: -10px -10px 0;
        padding: 12px 14px 22px;
        border-bottom: 0;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .header-content{
        display: block;
      }

      .global-header.mobile .header-status-section{
        width: 100%;
      }

      .global-header.mobile .header-status-scroll{
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact{
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact{
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact{
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button{
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-header{
        position: relative;
        top: auto;
        z-index: 3;
        min-height: 146px;
        margin: 0 -10px 20px;
        padding: calc(14px + env(safe-area-inset-top, 0px)) 22px 24px;
        align-items: center;
        gap: 10px;
        overflow: visible;
        border-radius: 0 0 8px 8px;
        border: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 88%, transparent) 76%,
            color-mix(in srgb, var(--card-background-color) 58%, transparent) 100%);
        backdrop-filter: blur(22px);
        box-shadow: none;
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          box-shadow 0.2s ease,
          background-color 0.2s ease;
      }

      .area-header.has-metrics{
        min-height: 248px;
      }

      .area-header.is-stuck{
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: 122px;
        margin-top: 0;
        margin-bottom: 20px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 18px 10px;
        gap: 7px;
        border-radius: 0;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
      }

      .area-header::before{
        opacity: 0;
      }

      .area-header::after{
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -34px;
        height: 58px;
        z-index: 1;
        pointer-events: none;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 66%, transparent) 0%,
            transparent 100%);
        filter: blur(10px);
        opacity: 0;
        transition: opacity 0.18s ease;
      }

      .area-header.is-stuck::after{
        opacity: 1;
      }

      .area-mobile-toolbar{
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }

      .area-mobile-round{
        width: 38px;
        height: 38px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-round ha-icon,
.area-mobile-round .dd-static-icon{
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-mobile-round{
        width: 34px;
        height: 34px;
      }

      .area-header.is-stuck .area-mobile-round ha-icon{
        --mdc-icon-size: 18px;
      }

      .area-mobile-home{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        justify-self: start;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-header.has-picture .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.72), rgba(8, 10, 15, 0.76)),
          rgba(10, 12, 18, 0.72);
        color: #ffffff;
        backdrop-filter: blur(14px);
        box-shadow:
          0 14px 32px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      .area-mobile-quick-controls{
        grid-column: 2;
        justify-self: center;
        max-width: 100%;
        min-height: 40px;
        padding: 4px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow:
          0 9px 22px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-quick-controls.empty{
        visibility: hidden;
      }

      .area-header.is-stuck .area-mobile-quick-controls{
        min-height: 36px;
        padding: 3px;
      }

      .area-quick-control{
        min-width: 58px;
        height: 34px;
        padding: 0 6px 0 8px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease;
      }

      .area-quick-main{
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .area-quick-control ha-icon{
        --mdc-icon-size: 17px;
        flex: 0 0 auto;
      }

      .area-quick-count{
        color: currentColor;
        font-size: 11px;
        font-weight: 850;
        line-height: 1;
        white-space: nowrap;
      }

      .area-quick-switch{
        position: relative;
        width: 26px;
        height: 16px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.12);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.05),
          inset 0 1px 3px rgba(15, 23, 42, 0.12);
        transition:
          background-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .area-quick-switch::after{
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
        transition: transform 0.18s ease;
      }

      .area-quick-control.active .area-quick-switch{
        background: currentColor;
      }

      .area-quick-control.active .area-quick-switch::after{
        transform: translateX(10px);
      }

      .area-quick-direction{
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        color: currentColor;
      }

      .area-quick-direction ha-icon{
        --mdc-icon-size: 16px;
      }

      .area-header.is-stuck .area-quick-control{
        min-width: 50px;
        height: 30px;
        padding: 0 5px 0 7px;
        gap: 4px;
      }

      .area-header.is-stuck .area-quick-control ha-icon{
        --mdc-icon-size: 15px;
      }

      .area-header.is-stuck .area-quick-count{
        font-size: 10px;
      }

      .area-header.is-stuck .area-quick-switch{
        width: 22px;
        height: 14px;
      }

      .area-header.is-stuck .area-quick-switch::after{
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
      }

      .area-header.is-stuck .area-quick-control.active .area-quick-switch::after{
        transform: translateX(8px);
      }

      .area-header.is-stuck .area-quick-direction{
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-quick-direction ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-quick-control:active{
        transform: scale(0.94);
      }

      .area-quick-control.active{
        background: #182044;
        color: #ffffff;
      }

      .area-quick-control.light.active{
        color: #ffd047;
      }

      .area-quick-control.switch.active{
        color: #58a9ff;
      }

      .area-quick-control.cover.active{
        color: #b984ff;
      }

      .area-quick-control.fan.active{
        color: #55bda4;
      }

      .area-quick-control.climate.active{
        color: #51aadd;
      }

      .area-mobile-edit{
        position: relative;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-mobile-actions{
        grid-column: 3;
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .area-mobile-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: #f44336;
        color: #ffffff;
        box-shadow:
          0 12px 26px rgba(244, 67, 54, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      }

      .area-mobile-actions .unavailable-entities-icon ha-icon{
        color: #ffffff;
        --mdc-icon-size: 19px;
      }

      .area-mobile-actions .unavailable-count{
        top: -6px;
        right: -6px;
        background: #ff9800;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 92%, transparent);
      }

      .area-mobile-edit.active{
        background: var(--primary-color);
      }

      .area-header-content{
        position: relative;
        z-index: 3;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .area-header.is-stuck .area-header-content{
        gap: 6px;
      }

      .area-header-icon{
        display: none;
      }

      .area-title-group{
        width: 100%;
        justify-content: center;
        gap: 0;
        min-width: 0;
        text-align: center;
      }

      .area-title{
        max-width: min(260px, calc(100vw - 122px));
        margin: 0 auto;
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-header.is-stuck .area-title{
        font-size: 14px;
      }

      .area-subtitle{
        display: block;
        margin-top: 2px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 750;
        line-height: 1.1;
      }

      .area-header.is-stuck .area-subtitle{
        margin-top: 1px;
        font-size: 11px;
      }

      .area-header-metrics{
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 4px;
        transition:
          gap 0.2s ease,
          margin 0.2s ease;
      }

      .area-header-metric{
        min-height: 72px;
        padding: 12px;
        border-radius: 10px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 6%, var(--card-background-color)) 100%);
        box-shadow:
          0 12px 24px rgba(15, 23, 42, 0.06),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          border-radius 0.2s ease;
      }

      .area-header-metric .metric-ring{
        width: 46px;
        height: 46px;
        transition:
          width 0.2s ease,
          height 0.2s ease;
      }

      .area-header-metric .metric-ring::after{
        transition: inset 0.2s ease;
      }

      .area-header-metric .metric-value,
.area-header-metric .metric-label,
.area-header-metric .metric-range,
.area-header-metric .metric-reading{
        transition:
          font-size 0.2s ease,
          opacity 0.2s ease;
      }

      .area-header.is-stuck .area-header-metrics{
        gap: 8px;
        margin-top: 0;
      }

      .area-header.is-stuck .area-header-metric{
        min-height: 40px;
        padding: 6px 9px;
        gap: 8px;
        border-radius: 8px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.05),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-header.is-stuck .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header.is-stuck .area-header-metric .metric-ring::after{
        inset: 4px;
      }

      .area-header.is-stuck .area-header-metric .metric-value{
        font-size: 9px;
      }

      .area-header.is-stuck .area-header-metric .metric-label{
        font-size: 11px;
      }

      .area-header.is-stuck .area-header-metric .metric-reading{
        font-size: 10px;
      }

      .area-header.is-stuck .area-header-metric .metric-range{
        opacity: 0;
        height: 0;
        margin-top: 0;
        overflow: hidden;
      }

      .area-header-actions{
        display: none;
      }

      .area-header .area-badges{
        position: relative;
        z-index: 3;
        width: 100%;
        display: none;
      }

      .area-header .area-badge{
        min-height: 34px;
        flex: 0 0 auto;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 850;
        box-shadow: none;
      }

      .area-header .area-badge.light-toggle,
.area-header .area-badge.switch-toggle{
        min-width: 128px;
        justify-content: center;
      }

      .area-header.has-picture{
        background:
          linear-gradient(180deg,
            rgba(23, 35, 33, 0.74) 0%,
            rgba(23, 35, 33, 0.58) 72%,
            rgba(23, 35, 33, 0.22) 100%);
      }

      .area-header.has-picture .area-subtitle{
        color: rgba(255, 255, 255, 0.72);
      }

      .area-content-area .area-header{
        min-height: 252px;
        margin: 0 -10px 18px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 18px 18px;
        justify-content: flex-start;
        overflow: hidden;
        border-radius: 0 0 22px 22px;
        color: #ffffff;
        background:
          radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.22), transparent 24%),
          linear-gradient(145deg, #182044 0%, #26374d 48%, #586c82 100%);
        box-shadow:
          0 16px 34px rgba(15, 23, 42, 0.14),
          inset 0 -1px 0 rgba(255, 255, 255, 0.24);
      }

      .area-content-area .area-header.has-metrics{
        min-height: 312px;
      }

      .area-content-area .area-header.has-picture{
        background: #0f172a;
      }

      .area-content-area .area-header-background{
        inset: 0;
        background-position: center;
        background-size: cover;
        transform: scale(1.015);
        filter: saturate(1.08) contrast(1.02);
      }

      .area-content-area .area-header::before{
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(4, 9, 16, 0.2) 0%,
            rgba(4, 9, 16, 0.02) 36%,
            rgba(4, 9, 16, 0.24) 70%,
            rgba(4, 9, 16, 0.64) 100%);
      }

      .area-content-area .area-header::after{
        bottom: -22px;
        height: 46px;
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            color-mix(in srgb, var(--primary-background-color) 86%, transparent) 100%);
        filter: blur(14px);
      }

      .area-content-area .area-mobile-toolbar{
        position: static;
        display: block;
        width: 100%;
        height: 0;
      }

      .area-content-area .area-mobile-home{
        top: calc(18px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        position: absolute;
        top: calc(18px + env(safe-area-inset-top, 0px));
        right: 18px;
        z-index: 6;
        grid-column: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.56);
        background: rgba(255, 255, 255, 0.9);
        color: #14181f;
        backdrop-filter: blur(18px);
        box-shadow:
          0 14px 30px rgba(8, 13, 24, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.62);
      }

      .area-content-area .area-mobile-round ha-icon,
.area-content-area .area-mobile-round .dd-static-icon,
.area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon{
        --mdc-icon-size: 22px;
        width: 22px;
        height: 22px;
        color: currentColor;
      }

      .area-content-area .area-mobile-camera{
        display: inline-flex;
      }

      .area-content-area .area-mobile-edit{
        background: rgba(255, 255, 255, 0.92);
        color: #14181f;
      }

      .area-content-area .area-mobile-edit.active{
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .area-content-area .area-mobile-actions .unavailable-entities-icon{
        background: rgba(244, 67, 54, 0.94);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.34);
      }

      .area-content-area .area-mobile-actions .unavailable-count{
        top: -5px;
        right: -5px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
      }

      .area-content-area .area-header-content{
        position: absolute;
        top: calc(25px + env(safe-area-inset-top, 0px));
        left: 84px;
        right: 84px;
        width: auto;
        z-index: 4;
        justify-content: center;
        pointer-events: none;
      }

      .area-content-area .area-title-group{
        width: 100%;
      }

      .area-content-area .area-title{
        max-width: 100%;
        color: #ffffff;
        font-size: 17px;
        font-weight: 850;
        line-height: 1.05;
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle{
        color: rgba(255, 255, 255, 0.82);
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-mobile-quick-controls{
        position: absolute;
        left: 18px;
        right: auto;
        bottom: 18px;
        z-index: 5;
        justify-self: auto;
        max-width: calc(100% - 36px);
        min-height: 42px;
        padding: 5px;
        overflow-x: auto;
        scrollbar-width: none;
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 30px rgba(8, 13, 24, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.66);
      }

      .area-content-area .area-mobile-quick-controls::-webkit-scrollbar{
        display: none;
      }

      .area-content-area .area-mobile-quick-controls.empty{
        display: none;
      }

      .area-content-area .area-header-metrics{
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 72px;
        z-index: 4;
        width: auto;
        margin: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        bottom: 18px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: 18px;
      }

      .area-content-area .area-header-metric{
        min-height: 58px;
        padding: 9px 10px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(16px);
        box-shadow:
          0 14px 28px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.62),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header-metric .metric-value,
.area-content-area .area-header-metric .metric-label,
.area-content-area .area-header-metric .metric-range,
.area-content-area .area-header-metric .metric-reading{
        color: #182044;
      }

      .area-content-area .area-header.is-stuck{
        min-height: 88px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 10px;
        border-radius: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 86%, transparent) 100%);
        color: var(--primary-text-color);
        backdrop-filter: blur(22px);
      }

      .area-content-area .area-header.is-stuck .area-header-background{
        opacity: 0;
      }

      .area-content-area .area-header.is-stuck::before{
        background: transparent;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: calc(8px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
.area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-actions{
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 100px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-subtitle{
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck .area-header-metrics{
        display: none;
      }

      .area-content-area .area-header{
        min-height: 214px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f8 100%);
        color: var(--primary-text-color);
      }

      .area-content-area .area-header.has-metrics{
        min-height: 214px;
      }

      .area-content-area .area-header.has-picture{
        color: #ffffff;
      }

      .area-content-area .area-header:not(.has-picture)::before{
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.18) 46%,
            rgba(226, 235, 242, 0.78) 100%);
      }

      .area-content-area .area-mobile-home{
        top: calc(16px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        top: calc(16px + env(safe-area-inset-top, 0px));
        right: 18px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow:
          0 12px 26px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.68);
      }

      .area-content-area .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-header-content{
        top: calc(88px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-header.has-metrics .area-header-content{
        right: 112px;
      }

      .area-content-area .area-title-group{
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-title{
        margin: 0;
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 29px;
        font-weight: 900;
        line-height: 0.98;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-title{
        color: #ffffff;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle{
        margin-top: 6px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-subtitle{
        color: rgba(255, 255, 255, 0.78);
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-header-metrics{
        top: calc(90px + env(safe-area-inset-top, 0px));
        right: 18px;
        bottom: auto;
        left: auto;
        width: auto;
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: auto;
      }

      .area-content-area .area-header-metric{
        min-height: 32px;
        padding: 5px 9px 5px 6px;
        gap: 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(16px);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.52),
          0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .area-content-area .area-header.has-picture .area-header-metric{
        background: rgba(255, 255, 255, 0.66);
        box-shadow:
          0 10px 22px rgba(8, 13, 24, 0.16),
          inset 0 0 0 1px rgba(255, 255, 255, 0.22);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 22px;
        height: 22px;
        background: color-mix(in srgb, var(--metric-color) 14%, transparent);
        box-shadow: none;
      }

      .area-content-area .area-header-metric .metric-ring::after{
        display: none;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon{
        --mdc-icon-size: 15px;
        color: var(--metric-color);
      }

      .area-content-area .area-header-metric .metric-value{
        font-size: 10px;
      }

      .area-content-area .area-header-metric .metric-label{
        display: none;
      }

      .area-content-area .area-header-metric .metric-reading{
        margin-top: 0;
        color: #101827;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
      }

      .area-content-area .area-header-metric .metric-range{
        display: none;
      }

      .area-content-area .area-mobile-quick-controls{
        top: calc(154px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        bottom: auto;
        margin: 0;
        justify-content: flex-start;
        max-width: calc(100% - 48px);
        width: max-content;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        top: calc(154px + env(safe-area-inset-top, 0px));
        bottom: auto;
      }

      .area-content-area .area-header.has-metrics.has-quick-controls{
        min-height: 214px;
      }

      .area-content-area .area-header.is-stuck{
        min-height: 84px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(13px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 106px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        font-size: 16px;
      }

      .area-content-area .area-header{
        box-sizing: border-box;
        min-height: calc(146px + env(safe-area-inset-top, 0px));
        margin: 0 -10px 18px;
        padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.1),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
      }

      .area-content-area .area-header.has-metrics,
.area-content-area .area-header.has-quick-controls,
.area-content-area .area-header.has-metrics.has-quick-controls{
        min-height: calc(154px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture{
        min-height: calc(178px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture.has-metrics,
.area-content-area .area-header.has-picture.has-quick-controls{
        min-height: calc(186px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.has-picture)::before{
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 42%, transparent) 0%,
            transparent 52%,
            color-mix(in srgb, var(--primary-color) 5%, transparent) 100%);
        opacity: 1;
      }

      .area-content-area .area-header::after{
        bottom: -20px;
        height: 40px;
        opacity: 0.88;
        filter: blur(12px);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) 0%,
            transparent 82%);
      }

      .area-content-area .area-mobile-home{
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        top: calc(14px + env(safe-area-inset-top, 0px));
        right: 18px;
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.12),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 62%, transparent);
      }

      .area-content-area .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-mobile-round ha-icon,
.area-content-area .area-mobile-round .dd-static-icon,
.area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon{
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-header-content{
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.has-metrics .area-header-content{
        right: 136px;
      }

      .area-content-area .area-title{
        max-width: 100%;
        font-size: 25px;
        font-weight: 900;
        line-height: 1.02;
        letter-spacing: 0;
      }

      .area-content-area .area-subtitle{
        margin-top: 3px;
        padding-bottom: 5px;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header-metrics{
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: auto;
      }

      .area-content-area .area-header-metric{
        min-height: 29px;
        height: 29px;
        min-width: 96px;
        padding: 4px 9px 4px 5px;
        gap: 6px;
        border-radius: 999px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 4%, var(--card-background-color)) 100%);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-content-area .area-header.has-picture .area-header-metric{
        background: rgba(255, 255, 255, 0.76);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 21px;
        height: 21px;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header-metric .metric-copy{
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .area-content-area .area-header-metric .metric-reading{
        max-width: 62px;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 12px;
        font-weight: 950;
        text-overflow: ellipsis;
      }

      .area-content-area .area-mobile-quick-controls,
.area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        top: auto;
        bottom: 8px;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        overflow-x: auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header:not(.has-metrics) .area-mobile-quick-controls{
        top: auto;
        bottom: 8px;
        right: 20px;
        width: auto;
        max-width: none;
      }

      .area-content-area .area-mobile-quick-controls.count-2{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-3{
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-4,
.area-content-area .area-mobile-quick-controls.count-5{
        display: flex;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .area-content-area .area-mobile-quick-controls.count-4 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-5 > .area-quick-control{
        flex: 0 0 auto;
        width: auto;
        min-width: 88px;
      }

      .area-content-area .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-quick-control{
        min-width: 48px;
        width: 100%;
        height: 30px;
        padding: 0 6px 0 8px;
        justify-content: space-between;
      }

      .area-content-area .area-quick-control ha-icon{
        --mdc-icon-size: 16px;
      }

      .area-content-area .area-quick-count{
        font-size: 10px;
      }

      .area-content-area .area-quick-switch{
        width: 24px;
        height: 15px;
      }

      .area-content-area .area-quick-switch::after{
        top: 3px;
        left: 3px;
        width: 9px;
        height: 9px;
      }

      .area-content-area .area-quick-control.active .area-quick-switch::after{
        transform: translateX(9px);
      }

      .area-content-area .area-quick-direction{
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-quick-direction ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home{
        background: rgba(10, 16, 38, 0.86);
        color: #ffffff;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home ha-icon,
.area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home .dd-static-icon{
        color: #ffffff;
        opacity: 1;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-actions .area-mobile-round{
        background: rgba(255, 255, 255, 0.86);
        color: #0f172a;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.22),
          inset 0 0 0 1px rgba(255, 255, 255, 0.34);
        backdrop-filter: blur(18px) saturate(1.22);
        -webkit-backdrop-filter: blur(18px) saturate(1.22);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-quick-controls,
.area-content-area .area-header.has-picture:not(.is-stuck).has-metrics .area-mobile-quick-controls{
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 32px rgba(0, 0, 0, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        backdrop-filter: blur(18px) saturate(1.18);
        -webkit-backdrop-filter: blur(18px) saturate(1.18);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control{
        color: rgba(15, 23, 42, 0.66);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active{
        background: color-mix(in srgb, var(--domain-color, #182044) 16%, rgba(15, 23, 42, 0.06));
        color: var(--domain-color, #182044);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.light{
        --domain-color: #d99a12;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.switch{
        --domain-color: #2f73d6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.cover{
        --domain-color: #7c4fc7;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.fan{
        --domain-color: #15967f;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.climate{
        --domain-color: #2f9ed6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-switch{
        background: rgba(15, 23, 42, 0.16);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active .area-quick-switch{
        background: var(--domain-color, #182044);
      }

      .area-content-area .area-header{
        position: relative;
        top: auto;
        z-index: 3;
      }

      .area-content-area .area-header.is-stuck,
.area-content-area .area-header.is-stuck.has-metrics,
.area-content-area .area-header.is-stuck.has-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics.has-quick-controls,
.area-content-area .area-header.is-stuck.has-picture,
.area-content-area .area-header.is-stuck.has-picture.has-metrics,
.area-content-area .area-header.is-stuck.has-picture.has-quick-controls{
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: calc(62px + env(safe-area-inset-top, 0px));
        margin-bottom: 4px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 14px 7px;
        border-radius: 0;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: calc(9px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
.area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon{
        width: 36px;
        height: 36px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(10px + env(safe-area-inset-top, 0px));
        left: 66px;
        right: 66px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        font-size: 15px;
        line-height: 1.05;
      }

      .area-content-area .area-header.is-stuck .area-subtitle{
        display: block;
        margin-top: 2px;
        padding-bottom: 0;
        color: color-mix(in srgb, var(--secondary-text-color) 88%, var(--primary-text-color) 12%);
        font-size: 11px;
        font-weight: 800;
        line-height: 1.05;
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck::after,
.area-content-area .area-header.is-stuck .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.has-quick-controls .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck .area-header-metrics,
.area-content-area .area-header.is-stuck .area-badges{
        display: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed{
        overflow: visible;
      }

      .area-content-area .area-header.is-stuck.is-revealed::before{
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: calc(154px + env(safe-area-inset-top, 0px));
        display: block;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.12),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
        pointer-events: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content{
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content{
        right: 136px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-title{
        font-size: 25px;
        line-height: 1.02;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-subtitle{
        display: block;
        margin-top: 3px;
        padding-bottom: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-title,
.area-content-area .area-header.is-stuck.is-revealed.has-picture .area-subtitle{
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics{
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: calc(110px + env(safe-area-inset-top, 0px));
        bottom: auto;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-2{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-3{
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.empty{
        display: none;
      }

      /*
       * Mobile HA already lays the dashboard out below the iOS/top safe area.
       * Adding env(safe-area-inset-top) inside DD Next a second time creates the
       * large empty strip visible above the home greeting and room controls.
       */
      .home-welcome{
        padding-top: 16px;
      }

      .area-content-area .area-header:not(.is-stuck),
.area-content-area .area-header:not(.is-stuck).has-metrics,
.area-content-area .area-header:not(.is-stuck).has-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics.has-quick-controls{
        min-height: 174px;
      }

      .area-content-area .area-header:not(.is-stuck).has-picture,
.area-content-area .area-header:not(.is-stuck).has-picture.has-metrics,
.area-content-area .area-header:not(.is-stuck).has-picture.has-quick-controls{
        min-height: 194px;
      }

      .area-content-area .area-mobile-home,
.area-content-area .area-mobile-actions{
        top: 14px;
      }

      .area-content-area .area-header-content,
.area-content-area .area-header.has-metrics .area-header-content{
        top: 58px;
      }

      .area-content-area .area-header-metrics{
        top: 63px;
      }

      /*
       * Quick controls are compact controls,
not a full-width second toolbar.
       * Keeping them content-sized prevents the switch thumb from ending up
       * visually detached at the far right edge of the header.
       */
      .area-content-area .area-mobile-quick-controls,
.area-content-area .area-header.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        right: auto;
        bottom: 10px;
        left: 20px;
        width: max-content;
        max-width: calc(100% - 40px);
        display: flex;
        grid-template-columns: none;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        max-width: calc(100% - 154px);
      }

      .area-content-area .area-mobile-quick-controls > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-1 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-2 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-3 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-4 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-5 > .area-quick-control{
        width: auto;
        min-width: 88px;
        flex: 0 0 auto;
      }

      .area-content-area .area-header.is-stuck,
.area-content-area .area-header.is-stuck.has-metrics,
.area-content-area .area-header.is-stuck.has-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics.has-quick-controls{
        min-height: 62px;
        padding-top: 8px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: 9px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: 10px;
      }

      .area-content-area .area-header.is-stuck.is-revealed,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics.has-quick-controls{
        min-height: 174px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content{
        top: 58px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics{
        top: 63px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
        left: 20px;
        right: auto;
        width: max-content;
        max-width: calc(100% - 40px);
        display: flex;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls{
        max-width: calc(100% - 154px);
      }

      /* Keep the expanded room header geometrically honest: earlier variants used a
         short physical header plus absolutely-positioned content,
which could overlap
         the subtitle and the first controls row on iPhone-sized viewports. */
      .area-content-area .area-header:not(.is-stuck),
.area-content-area .area-header:not(.is-stuck).has-metrics,
.area-content-area .area-header:not(.is-stuck).has-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics.has-quick-controls{
        min-height: calc(174px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.is-stuck).has-picture,
.area-content-area .area-header:not(.is-stuck).has-picture.has-metrics,
.area-content-area .area-header:not(.is-stuck).has-picture.has-quick-controls{
        min-height: calc(194px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.is-stuck) .area-mobile-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics .area-mobile-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
      }

      .area-content-area .area-header.is-stuck.is-revealed,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics.has-quick-controls{
        min-height: calc(174px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck.is-revealed::before{
        height: 100%;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
      }

      .area-view .entities-section,
.area-view .dd-custom-section{
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section{
        display: none;
      }

      .mobile-area-overview{
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section{
        display: grid;
        position: relative;
        z-index: 2;
      }







      .mobile-area-picker-head{
        min-height: 42px;
        margin: 0 2px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .mobile-area-picker-title{
        min-width: 0;
        color: var(--primary-text-color);
        font-size: 20px;
        font-weight: 850;
        line-height: 1.1;
      }

      .mobile-area-picker-close{
        width: 38px;
        height: 38px;
        padding: 0;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
      }

      .mobile-area-picker-close ha-icon{
        --mdc-icon-size: 21px;
      }

      .sidebar .area-list{
        padding: 0;
      }

      .sidebar .floor-section{
        margin-bottom: 12px;
      }

      .sidebar .floor-header{
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3{
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button{
        min-height: 64px;
        height: auto;
        margin-bottom: 8px;
        padding: 11px 12px 11px 56px;
        border-radius: 9px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 97%, #ffffff),
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)));
        box-shadow:
          0 10px 22px rgba(15, 23, 42, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .sidebar .area-button.home-button{
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon{
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
.sidebar .area-button.home-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 88%, #ffffff 10%),
            var(--primary-color));
        color: var(--text-primary-color);
        box-shadow:
          0 14px 28px color-mix(in srgb, var(--primary-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .sidebar .area-content{
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section{
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section{
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon{
        position: absolute;
        left: -44px;
        top: 50%;
        bottom: auto;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        transform: translateY(-50%);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        box-shadow: none;
      }

      .sidebar .area-main-icon ha-icon{
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture{
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected{
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background{
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
.sidebar .area-button.has-picture .area-info-badges,
.sidebar .area-button.has-picture .area-main-icon{
        z-index: 1;
      }

      .sidebar .area-info-badges{
        position: relative;
        top: auto;
        right: auto;
        grid-column: 2;
        grid-row: 1 / span 2;
        max-width: 130px;
        justify-content: flex-end;
        align-self: center;
        gap: 5px;
      }

      .sidebar .area-name{
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors{
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors{
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge{
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon{
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count{
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge{
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
.sidebar .area-button.selected .area-icon{
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header{
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3{
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
.sidebar .area-button.home-button{
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto 22px;
        align-items: center;
        gap: 12px;
        min-height: 68px;
        height: auto;
        margin: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover{
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected,
.sidebar .area-button.home-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 58%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 10%);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 4px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent);
      }

      .sidebar .area-button.home-button .area-icon,
.sidebar .area-icon,
.sidebar .area-main-icon{
        position: relative;
        left: auto;
        top: auto;
        bottom: auto;
        grid-column: 1;
        grid-row: 1;
        width: 46px;
        height: 46px;
        border-radius: 8px;
        transform: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
        box-shadow: none;
      }

      .sidebar .area-button.home-button .area-icon{
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
.sidebar .area-icon ha-icon{
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content{
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
.sidebar .area-top-section{
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section{
        display: contents;
      }

      .sidebar .area-name{
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors{
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges{
        position: relative;
        top: auto;
        right: auto;
        grid-column: 3;
        grid-row: 1;
        max-width: 104px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        z-index: 1;
      }

      .sidebar .area-menu-chevron{
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut{
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron{
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture{
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected{
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background{
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
.sidebar .area-button.has-picture .area-name,
.sidebar .area-button.has-picture .area-sensors,
.sidebar .area-button.has-picture .area-menu-chevron,
.sidebar .area-button.has-picture .area-info-badges,
.sidebar .area-button.has-picture .area-main-icon,
.sidebar .area-button.has-picture .area-icon{
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after{
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name{
        width: fit-content;
        max-width: 100%;
        padding: 4px 8px;
        margin-left: -2px;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(8, 13, 24, 0.66), rgba(8, 13, 24, 0.28));
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
      }

      .sidebar .area-button.has-picture .area-main-icon,
.sidebar .area-button.has-picture .area-icon{
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
.sidebar .area-button.has-picture .area-menu-chevron{
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron{
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
.sidebar .area-button.has-picture.text-dark .area-icon{
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge{
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay{
        z-index: 140 !important;
        background: rgba(8, 13, 24, 0.18);
        backdrop-filter: blur(3px);
      }

      :host([data-theme-dark]){




        .sidebar .floor-header h3 {
          color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        }

        .sidebar .area-button {
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
        }

        .sidebar .area-button.selected,
        .sidebar .area-button.home-button.selected {
          border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--primary-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.has-picture {
          border-color: rgba(255, 255, 255, 0.08);
          background: #17202b;
        }

        .sidebar .area-button.has-picture .area-background {
          opacity: 0.58;
        }

        .sidebar .area-button.has-picture:hover .area-background {
          opacity: 0.66;
        }

        .sidebar .area-main-icon,
        .sidebar .area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-button.selected .area-main-icon,
        .sidebar .area-button.selected .area-icon {
          background: color-mix(in srgb, var(--primary-color) 24%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-menu-chevron,
        .sidebar .area-button.selected .area-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .area-menu-chevron {
          color: var(--primary-color);
        }

        .sidebar .area-sensors,
        .sidebar .area-bottom-section {
          color: color-mix(in srgb, var(--primary-text-color) 68%, transparent);
        }

        .sidebar .info-badge {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .home-notification-shortcut {
          color: #ff9a9a;
          background: rgba(239, 68, 68, 0.16);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.18);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .home-content-area{
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section{
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow: visible !important;
      }

      .home-view .home-favorites-section .favorites-grid{
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper{
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }

    /* Settings shell correction */
    .settings-page-view{
      width: min(840px, calc(100% - 32px));
      padding-top: 18px;
    }

    @media (max-width: 768px) {
      .settings-page-view{
        width: 100%;
      }
    }

    /* Room navigation: fixed media slot for either a photo or the HA pictogram. */
    .area-media{
      position: relative;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-color) 9%, var(--secondary-background-color));
    }

    .area-media-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .area-media-icon{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-color) 82%, var(--primary-text-color));
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color)),
          color-mix(in srgb, var(--primary-color) 6%, var(--secondary-background-color)));
    }

    .area-media-icon ha-icon{
      --mdc-icon-size: 34px;
    }

    @media (min-width: 769px) {
      .sidebar .room-area-button{
        display: grid;
        grid-template-columns: 74px minmax(0, 1fr);
        align-items: stretch;
        gap: 10px;
        min-height: 92px;
        height: 92px;
        padding: 8px;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      }

      .sidebar .room-area-button.has-picture{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        border-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      }

      .sidebar .room-area-button.has-picture::after{
        display: none;
      }

      .sidebar .room-area-button.selected,
.sidebar .room-area-button.has-picture.selected{
        color: var(--primary-text-color);
        border-color: color-mix(in srgb, var(--primary-color) 58%, transparent);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
        box-shadow:
          0 10px 22px color-mix(in srgb, var(--primary-color) 12%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
      }

      .sidebar .room-area-button .area-media{
        width: 74px;
        height: 74px;
        align-self: center;
        grid-column: 1;
      }

      .sidebar .room-area-button .area-content{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        gap: 7px;
        min-width: 0;
        height: auto;
        grid-column: 2;
      }

      .sidebar .room-area-button .area-top-section{
        min-width: 0;
        margin: 0;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        color: var(--primary-text-color);
        text-shadow: none;
        font-size: 14px;
        font-weight: 850;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 3px;
        color: var(--secondary-text-color);
        text-shadow: none;
        font-size: 11px;
        font-weight: 650;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        width: 100%;
        max-width: none;
        overflow: hidden;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 27px;
        height: 21px;
        padding: 0 5px;
        flex: 0 0 auto;
        color: var(--badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 11%, var(--card-background-color));
        border: 1px solid color-mix(in srgb, var(--badge-color, var(--primary-color)) 20%, transparent);
        box-shadow: none;
        backdrop-filter: none;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 12px;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10px;
      }

      .sidebar .room-area-button .area-menu-chevron,
.sidebar .room-area-button .area-main-icon{
        display: none;
      }
    }

    @media (max-width: 768px) {
      .sidebar .room-area-button{
        display: grid;
        grid-template-columns: 64px minmax(0, 1fr);
        gap: 10px;
        min-height: 80px;
        padding: 8px;
      }

      .sidebar .room-area-button .area-media{
        width: 64px;
        height: 64px;
      }

      .sidebar .room-area-button .area-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        gap: 6px;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        gap: 4px;
        max-width: none;
        overflow: hidden;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 26px;
        height: 21px;
        padding: 0 5px;
      }

      .sidebar .room-area-button .area-menu-chevron{
        display: none;
      }
    }


    /*
     * iOS/mobile room switcher: keep the room photo as a very soft card
     * background while preserving the small media preview at full contrast.
     * The legacy picture treatment darkened the complete card and its overlay
     * could visually escape the rounded corners.
     */
    @media (max-width: 768px) {
      .sidebar .room-area-button{
        overflow: hidden;
        isolation: isolate;
        border-radius: 12px;
      }

      .sidebar .room-area-button.has-picture{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        border-color: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .sidebar .room-area-button.has-picture.selected{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color));
        border-color: color-mix(in srgb, var(--primary-color) 46%, transparent);
      }

      .sidebar .room-area-button.has-picture .area-background{
        inset: 0;
        z-index: 0;
        opacity: 0.13;
        transform: none;
        border-radius: inherit;
        background-position: center;
        background-size: cover;
        pointer-events: none;
      }

      .sidebar .room-area-button.has-picture:hover .area-background{
        opacity: 0.16;
      }

      .sidebar .room-area-button.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        border-radius: inherit;
        background: color-mix(in srgb, var(--card-background-color) 34%, transparent);
        pointer-events: none;
      }

      .sidebar .room-area-button.has-picture .area-media,
      .sidebar .room-area-button.has-picture .area-content,
      .sidebar .room-area-button.has-picture .area-info-badges{
        position: relative;
        z-index: 2;
      }

      .sidebar .room-area-button.has-picture .area-media{
        overflow: hidden;
        border-radius: 10px;
        background: var(--secondary-background-color);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      }

      .sidebar .room-area-button.has-picture .area-media-picture{
        opacity: 1;
        transform: none;
        filter: none;
      }

      .sidebar .room-area-button.has-picture .area-name{
        width: auto;
        max-width: 100%;
        margin: 0;
        padding: 0;
        color: var(--primary-text-color);
        background: transparent;
        text-shadow: none;
        backdrop-filter: none;
      }

      .sidebar .room-area-button.has-picture .area-sensors{
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .sidebar .room-area-button.has-picture .info-badge{
        backdrop-filter: none;
      }
    }

    /* Favorites are a dedicated layer between house information and room content. */
    .area-favorites-toggle{
      width: calc(100% - 32px);
      min-height: 40px;
      margin: 0 16px 10px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 82%, transparent);
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .area-favorites-toggle-main{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      font-size: 14px;
      font-weight: 850;
    }

    .area-favorites-toggle-main > ha-icon{
      --mdc-icon-size: 18px;
      color: var(--primary-color);
    }

    .area-favorites-count{
      color: var(--secondary-text-color);
      font-weight: 700;
    }

    .global-header .header-expanded-content{
      padding-top: 0;
    }

    .global-header .header-favorites .favorites-header{
      display: none;
    }

    .mobile-domain-master{
      min-width: 76px;
    }

    .mobile-domain-master-count{
      min-width: 25px;
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
    }

    /* Window/door/opening state is expressed by its icon/status badge,
not a tinted whole card. */
    .mobile-entity-card.mobile-entity-binary_sensor.device-window.is-active,
.mobile-entity-card.mobile-entity-binary_sensor.device-door.is-active,
.mobile-entity-card.mobile-entity-binary_sensor.device-opening.is-active{
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
    }


    /* Final desktop room redesign: compact sidebar cards + compact room header. */
    @media (min-width: 769px) {
      .sidebar .room-area-button{
        grid-template-columns: 58px minmax(0, 1fr);
        gap: 8px;
        min-height: 76px;
        height: 76px;
        padding: 8px;
        margin-bottom: 7px;
        border-radius: 11px;
        box-shadow: 0 5px 14px color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      }

      .sidebar .room-area-button .area-media{
        width: 58px;
        height: 58px;
        border-radius: 9px;
      }

      .sidebar .room-area-button .area-media-icon{
        color: color-mix(in srgb, var(--primary-color) 84%, var(--primary-text-color));
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 27px;
      }

      .sidebar .room-area-button .area-content{
        gap: 4px;
        justify-content: center;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 13px;
        font-weight: 850;
        line-height: 1.15;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 2px;
        font-size: 10px;
        line-height: 1.15;
      }

      .sidebar .room-area-button .area-info-badges{
        gap: 3px;
        min-height: 19px;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 24px;
        height: 19px;
        padding: 0 4px;
        border-radius: 999px;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9px;
      }

      .sidebar .room-area-button.selected,
.sidebar .room-area-button.has-picture.selected{
        border-color: color-mix(in srgb, var(--primary-color) 54%, transparent);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
        box-shadow:
          0 7px 18px color-mix(in srgb, var(--primary-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .area-header.area-header-desktop-compact{
        position: relative;
        min-height: 0;
        margin: 0 0 18px;
        padding: 14px 16px;
        display: grid;
        grid-template-columns: 68px minmax(190px, 1fr) auto auto;
        align-items: center;
        gap: 16px;
        overflow: visible;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 98%, var(--primary-background-color));
        color: var(--primary-text-color);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
      }

      .area-header.area-header-desktop-compact::before{
        display: none;
      }

      .area-desktop-room-media{
        position: relative;
        width: 68px;
        height: 68px;
        overflow: hidden;
        border-radius: 10px;
        background: color-mix(in srgb, var(--primary-color) 8%, var(--secondary-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .area-desktop-room-picture{
        position: absolute;
        inset: 0;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }

      .area-desktop-room-icon{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-color) 86%, var(--primary-text-color));
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
      }

      .area-desktop-room-icon ha-icon{
        --mdc-icon-size: 31px;
      }

      .area-desktop-room-copy{
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }

      .area-header-desktop-compact .area-title{
        margin: 0;
        font-size: clamp(26px, 2.15vw, 36px);
        line-height: 1;
        color: var(--primary-text-color);
      }

      .area-desktop-room-meta{
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 750;
        line-height: 1.2;
        white-space: nowrap;
      }

      .area-header-desktop-compact .area-header-metrics{
        position: static;
        z-index: auto;
        min-width: 0;
        max-width: none;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 8px;
      }

      .area-header-desktop-compact .area-header-metric{
        min-width: 132px;
        min-height: 44px;
        padding: 7px 11px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-desktop-compact .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header-desktop-compact .area-header-metric .metric-label{
        font-size: 9px;
      }

      .area-header-desktop-compact .area-header-metric .metric-reading{
        font-size: 13px;
      }

      .area-header-desktop-compact .area-header-actions{
        position: static;
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: max-content;
      }

      .area-header-desktop-compact .area-header-actions .unavailable-entities-icon,
.area-header-desktop-compact .area-header-actions .area-mobile-camera,
.area-header-desktop-compact .area-header-actions .dd-edit-toggle{
        width: 42px;
        height: 42px;
        margin: 0;
        border-radius: 999px;
      }

      .area-header-desktop-compact .area-mobile-toolbar,
.area-header-desktop-compact .area-mobile-home,
.area-header-desktop-compact .area-mobile-quick-controls,
.area-header-desktop-compact .area-badges,
.area-header-desktop-compact .area-header-content{
        display: none;
      }
    }

    @media (min-width: 769px) and (max-width: 1120px) {
      .area-header.area-header-desktop-compact{
        grid-template-columns: 58px minmax(150px, 1fr) auto;
        gap: 12px;
      }

      .area-desktop-room-media{
        width: 58px;
        height: 58px;
      }

      .area-header-desktop-compact .area-header-metrics{
        grid-column: 2;
        justify-content: flex-start;
        margin-top: 4px;
      }

      .area-header-desktop-compact .area-header-actions{
        grid-column: 3;
        grid-row: 1 / span 2;
      }
    }


    /* Responsive room UI v3 — desktop reference is the base;
       mobile only changes flow,
scale and navigation. */

    .global-header{
      padding: 8px 16px 6px;
      border-bottom: 0;
      background: var(--primary-background-color);
    }

    .global-header .header-content{
      width: 100%;
      min-height: 54px;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-sizing: border-box;
    }

    .header-status-section{
      min-width: 0;
      flex: 1 1 auto;
    }

    .header-status-scroll{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .header-status-scroll::-webkit-scrollbar{ display: none; }

    .status-card-compact{
      width: auto;
      min-width: 140px;
      max-width: 194px;
      height: 50px;
      min-height: 50px;
      padding: 7px 9px 7px 12px;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr);
      grid-template-rows: 1fr 1fr;
      align-items: center;
      column-gap: 8px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 10px rgba(15, 23, 42, 0.045);
    }

    .status-card-compact .status-card-icon-compact{
      grid-column: 1;
      grid-row: 1 / span 2;
      position: relative;
      width: 34px;
      height: 34px;
      margin: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--status-color);
      background: color-mix(in srgb, var(--status-color) 12%, var(--card-background-color));
    }

    .status-card-compact .status-card-icon-compact ha-icon{ --mdc-icon-size: 19px; }

    .status-card-badge-compact{
      top: -7px;
      right: -11px;
      min-width: 18px;
      height: 20px;
      padding: 0 4px;
      box-sizing: border-box;
      font-size: 10px;
      line-height: 1;
    }

    .status-card-compact .status-card-title-compact{
      grid-column: 2;
      grid-row: 1;
      align-self: end;
      margin: 0;
      overflow: hidden;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.08;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-card-compact:not(.has-value){
      grid-template-rows: 1fr;
    }

    .status-card-compact:not(.has-value) .status-card-title-compact{
      grid-row: 1;
      align-self: center;
      display: flex;
      align-items: center;
      min-height: 34px;
      margin: 0;
    }

    .status-card-compact .status-card-subtitle-compact{
      grid-column: 2;
      grid-row: 2;
      align-self: start;
      margin-top: 2px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
      line-height: 1.08;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-time-weather{
      min-width: 116px;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
    }

    .header-time{ font-size: 21px; line-height: 1; }
    .header-date{ font-size: 12px; line-height: 1.1; }
    .weather-compact{ padding: 3px 9px; }

    .area-content-area{
      padding: 8px 16px 16px;
    }

    .room-header-media{
      grid-area: media;
      position: relative;
      width: 220px;
      height: 176px;
      align-self: center;
      overflow: hidden;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }

    .room-header-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .room-header-icon{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-color) 86%, var(--primary-text-color));
      background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
    }

    .room-header-icon ha-icon{ --mdc-icon-size: 52px; }

    .room-header-copy{
      grid-area: copy;
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }

    .room-header-breadcrumb{
      min-height: 18px;
      margin-bottom: 1px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .room-header-home-link{
      width: 20px;
      height: 20px;
      margin: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      color: var(--secondary-text-color);
      background: transparent;
      cursor: pointer;
    }

    .room-header-home-link:hover{
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .room-header-home-link ha-icon{ --mdc-icon-size: 14px; }
    .room-header-breadcrumb-chevron{ --mdc-icon-size: 12px; opacity: 0.7; }

    .room-header-device-count{
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 750;
    }

    .room-header-summary{
      margin-top: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
      overflow: visible;
    }

    .room-header-summary::-webkit-scrollbar{
      display: none;
    }

    .room-summary-item{
      min-height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      white-space: nowrap;
    }

    button.room-summary-item{
      min-width: 46px;
      padding: 5px 10px;
      border: 0;
      font: inherit;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--room-summary-color) 12%, transparent),
        0 5px 12px rgba(15, 23, 42, 0.035);
      transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
    }

    button.room-summary-item:hover{
      transform: translateY(-1px);
      filter: brightness(1.03);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--room-summary-color) 18%, transparent),
        0 8px 16px rgba(15, 23, 42, 0.06);
    }

    button.room-summary-item:active{
      transform: translateY(0) scale(0.97);
    }

    .room-summary-item ha-icon{ --mdc-icon-size: 17px; }
    .room-summary-item.temperature ha-icon{ color: ${unsafeCSS(getDomainColor('temperature'))}; }
    .room-summary-item.humidity ha-icon{ color: ${unsafeCSS(getDomainColor('humidity'))}; }
    .room-summary-item.power ha-icon{ color: ${unsafeCSS(getDomainColor('energy'))}; }

    .room-summary-item.status{
      border-radius: 999px;
      color: var(--room-summary-color);
      background: color-mix(in srgb, var(--room-summary-color) 10%, var(--card-background-color));
    }

    .room-header-camera-preview{
      grid-area: camera;
      position: relative;
      width: 100%;
      height: 176px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color));
      color: #fff;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.06),
        0 7px 18px rgba(15, 23, 42, 0.07);
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .room-header-camera-preview:hover{
      transform: translateY(-1px);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.08),
        0 10px 22px rgba(15, 23, 42, 0.1);
    }

    .room-header-camera-image,
.room-header-camera-stream{
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .room-header-camera-image{
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .room-header-camera-placeholder{
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    .room-header-camera-placeholder ha-icon{
      --mdc-icon-size: 38px;
    }

    .room-header-camera-live{
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      min-height: 26px;
      padding: 0 9px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      color: #fff;
      background: rgba(15, 23, 42, 0.78);
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      backdrop-filter: blur(8px);
    }

    .room-header-camera-live-dot{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #20c77a;
      box-shadow: 0 0 0 3px rgba(32, 199, 122, 0.14);
    }

    .room-header-actions{
      grid-area: actions;
      grid-column: auto;
      grid-row: auto;
      position: static !important;
      inset: auto !important;
      min-width: 42px;
      height: 100%;
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      align-self: stretch;
      gap: 10px;
      transform: none !important;
    }

    .room-header-actions .unavailable-entities-icon,
.room-header-actions .dd-edit-toggle{
      width: 38px;
      height: 38px;
      margin: 0;
      border-radius: 999px;
      flex: 0 0 auto;
    }

    .room-header-back{ display: none; }

    .room-favorites-block{
      width: 100%;
      margin: 0;
      overflow: visible;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
    }

    .room-favorites-header{
      margin-bottom: 0 !important;
    }

    .room-favorites-block:not(.is-collapsed) .room-favorites-header{
      margin-bottom: 6px !important;
    }

    .room-favorites-icon{
      color: var(--primary-color);
    }

    .room-favorites-content{
      margin: 0;
    }

    .room-favorites-content .favorites-header{
      display: none;
    }

    .room-favorites-content .favorites-section{
      margin: 0;
    }

    .sidebar .room-area-button{
      min-height: 84px !important;
      height: 84px !important;
      padding: 6px !important;
      grid-template-columns: 72px minmax(0, 1fr) !important;
      align-items: center;
      gap: 8px !important;
      margin-bottom: 6px;
      border-radius: 10px;
    }

    .sidebar .room-area-button .area-media{
      width: 72px !important;
      height: 70px !important;
      align-self: center;
      border-radius: 8px;
    }

    .sidebar .room-area-button .area-media-icon ha-icon{ --mdc-icon-size: 30px; }

    .sidebar .room-area-button .area-content{
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px !important;
    }

    .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
      font-size: 13px;
      line-height: 1.1;
      font-weight: 850;
    }

    .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
      margin-top: 1px;
      font-size: 10px;
      line-height: 1.1;
    }

    .sidebar .room-area-button .area-info-badges{
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      gap: 3px;
      overflow: hidden;
    }

    .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
      min-width: 22px;
      height: 19px;
      padding: 0 4px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border-radius: 999px;
      line-height: 1;
    }

    .sidebar .room-area-button .info-badge ha-icon{
      width: 11px;
      height: 11px;
      flex: 0 0 11px;
      display: block;
      --mdc-icon-size: 11px;
      line-height: 0;
    }

    .sidebar .room-area-button .badge-count{
      height: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      line-height: 11px;
    }

    .room-domain-icon{
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
      color: var(--domain-color);
      background: transparent;
    }

    .room-domain-icon ha-icon{ --mdc-icon-size: 18px; }

    .mobile-domain-title-chevron{
      margin-left: 1px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }

    .dd-generated-card-leading-drag-handle,
.dd-generated-card-visibility{
      width: 30px;
      height: 30px;
      padding: 0;
      border: 0;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      background: transparent;
      pointer-events: auto;
    }

    .dd-generated-card-leading-drag-handle{
      width: 22px;
      height: 40px;
      margin: 0;
      padding: 0;
      border-radius: 4px;
      cursor: grab;
      color: var(--secondary-text-color);
      background: transparent;
    }

    .dd-generated-card-leading-drag-handle:active{ cursor: grabbing; }

    .dd-generated-card-leading-drag-handle ha-icon{
      --mdc-icon-size: 20px;
    }

    .dd-generated-card-visibility ha-icon{
      --mdc-icon-size: 19px;
    }

    .dd-generated-card-visibility{
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    }

    .dd-generated-card-leading-drag-handle:hover{
      background: var(--primary-background-color);
      color: var(--primary-color);
    }

    .dd-generated-card-visibility:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    @media (max-width: 1180px) and (min-width: 769px) {

      .room-header-media{
        width: 170px;
        height: 148px;
      }

      .room-header-camera-preview{
        height: 148px;
      }
    }

    @media (max-width: 768px) {
      .global-header{ padding: 8px 10px 6px; }

      .area-content-area{ padding: 8px 10px 88px; }

      .room-header-back{
        grid-area: back;
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        border-radius: 999px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .room-header-media{
        width: 64px;
        height: 64px;
        border-radius: 9px;
      }

      .room-header-icon ha-icon{ --mdc-icon-size: 30px; }
      .room-header-breadcrumb{ display: none; }
      .room-header-device-count{ font-size: 10px; }

      .room-header-summary{
        gap: 5px;
        flex-wrap: wrap;
      }

      .room-summary-item{ font-size: 10px; }

      .room-header-camera-preview{
        width: 100%;
        height: 148px;
        border-radius: 10px;
      }

      .room-header-actions{
        grid-area: actions;
        grid-column: auto;
        grid-row: auto;
        height: auto;
        align-self: start;
        flex-direction: column;
        gap: 6px;
        margin-left: 0 !important;
      }

      .room-header-actions .unavailable-entities-icon,
.room-header-actions .dd-edit-toggle{
        width: 34px;
        height: 34px;
      }

      .room-favorites-toggle{
        min-height: 36px;
      }
    }


    /* Room context: global house information and Favorites form one subtle visual zone. */
    .global-header.room-context{
      background: color-mix(in srgb, var(--secondary-background-color) 34%, var(--card-background-color));
      border-bottom-color: transparent;
      box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--divider-color) 42%, transparent);
    }

    .global-header.room-context .room-favorites-block{
      margin-top: 10px !important;
      margin-bottom: 0 !important;
      background: color-mix(in srgb, var(--card-background-color) 78%, transparent);
      box-shadow: none;
    }

    .global-header.room-context .room-favorites-block::after{
      display: none;
    }

    /* Desktop room header follow-up:
       - left identity block matches the full height of all three metric pills
       - metric pills are about 10% smaller and tightly stacked
       - status badges stay fully visible
       - actions stay aligned with the room title */
    @media (min-width: 769px) {

      .room-header-title-row{
        min-height: 38px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 7px;
      }

      .room-header-title-row .room-header-home-link{
        flex: 0 0 30px;
        width: 30px;
        height: 30px;
      }

      .room-header-title-row .room-header-home-link ha-icon{
        --mdc-icon-size: 20px;
      }

      .room-header-title-row .room-header-home-chevron{
        flex: 0 0 auto;
      }

      .room-header-device-count{
        font-size: 13px;
        line-height: 1.15;
        margin: 0 !important;
      }

      .room-header-summary{
        min-height: 34px !important;
        margin-top: 2px !important;
        margin-bottom: 0 !important;
        padding: 2px 0 !important;
        align-items: center !important;
        gap: 7px !important;
        overflow: visible !important;
      }

      .room-header-summary.is-empty{
        min-height: 0 !important;
        padding: 0 !important;
      }

      .room-summary-item{
        min-height: 30px !important;
        font-size: 12px;
        line-height: 1 !important;
      }

      button.room-summary-item{
        min-width: 46px !important;
        padding: 6px 10px !important;
      }

      .room-summary-item ha-icon{
        --mdc-icon-size: 17px !important;
      }

      .room-header-actions{
        height: 150px !important;
        align-self: center !important;
        justify-content: flex-start !important;
        gap: 8px !important;
        padding: 0 !important;
      }

      .room-header-actions .dd-edit-toggle,
.room-header-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
        margin: 0 !important;
      }
    }

    .room-header-title-row{
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .room-header-title-row .area-title{
      min-width: 0;
      margin: 0;
    }

    @media (max-width: 768px) {
      .room-header-title-row .room-header-home-link{
        display: none;
      }
    }

    /* Final polish for global meta, Favorites and expandable room sections. */
    @media (min-width: 769px) {
      .global-header{
        padding-right: 28px;
      }

      .header-time-weather{
        min-width: 204px;
        height: 50px;
        flex: 0 0 auto;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .header-time-section{
        min-width: 82px;
        align-items: flex-end;
        justify-content: center;
        gap: 1px;
        line-height: 1;
      }

      .header-time{
        font-size: 18px;
        line-height: 1.05;
      }

      .header-date{
        font-size: 10px;
        line-height: 1.05;
      }

      .weather-compact{
        min-height: 30px;
        padding: 3px 9px;
        box-sizing: border-box;
      }
    }

    .room-favorites-block{
      position: relative;
      box-sizing: border-box;
      overflow: visible !important;
      margin-bottom: 11px !important;
    }

    .room-favorites-block::after{
      content: "";
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: -7px;
      width: auto;
      height: 1px;
      border-radius: 999px;
      background: var(--divider-color);
      opacity: 0.28;
      pointer-events: none;
    }

    .room-favorites-content .favorites-grid{
      gap: 6px;
    }

    .room-favorites-content .favorite-tile-wrapper{
      --row-size: 54px;
      --ha-card-border-radius: 8px;
      min-height: 54px;
      font-size: 0.94em;
    }

    .room-favorites-content .favorite-tile-wrapper > hui-tile-card{
      --row-size: 54px;
      --ha-card-border-radius: 8px;
      min-height: 54px;
    }

    .room-favorites-title{
      pointer-events: none;
    }

    .mobile-domain-center-chevron{
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1;
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0.78;
    }

    .mobile-domain-title-chevron{
      display: none !important;
    }

    @media (max-width: 768px) {
      .room-favorites-content .favorite-tile-wrapper,
.room-favorites-content .favorite-tile-wrapper > hui-tile-card{
        --row-size: 50px;
        min-height: 50px;
      }
    }


    /* Keep expandable headers visually centered and use a single{
      min-height: 38px;
    }

    .mobile-domain-leading-chevron{
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
      opacity: 0.78;
      pointer-events: none;
    }

    .mobile-domain-leading-drag-handle{
      width: 22px;
      height: 40px;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 4px;
      display: grid;
      place-items: center;
      flex: 0 0 22px;
      color: var(--secondary-text-color);
      background: transparent;
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-leading-drag-handle:hover{
      background: var(--primary-background-color);
      color: var(--primary-color);
    }

    .mobile-domain-leading-drag-handle:active{
      cursor: grabbing;
    }

    .mobile-domain-leading-drag-handle ha-icon{
      --mdc-icon-size: 20px;
    }

    .mobile-domain-center-chevron,
.mobile-domain-title-chevron{
      display: none !important;
    }

    /* Compact Favorites row with a quiet divider before the room header. */
    .room-favorites-block{
      margin-bottom: 12px !important;
    }

    .room-favorites-block::after{
      left: 12px;
      right: 12px;
      bottom: -7px;
      width: auto;
      height: 1px;
      transform: none;
      background: var(--divider-color);
      opacity: 0.42;
    }

    /* Compact sidebar: denser rooms,
slimmer badges,
vertically centered badge contents. */
    .sidebar .floor-section{
      margin: 0 0 10px;
    }

    .sidebar .floor-header{
      padding: 5px 8px 3px;
      margin-bottom: 2px;
    }

    .sidebar .floor-areas{
      gap: 4px;
    }

    .sidebar .area-button.home-button{
      margin-bottom: 10px !important;
    }

    @media (min-width: 769px) {
      .sidebar .room-area-button{
        margin-bottom: 0;
      }

      .sidebar .room-area-button .area-content{
        gap: 5px;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 14px;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 2px;
        font-size: 11px;
      }

      .sidebar .room-area-button .area-info-badges{
        gap: 3px;
        min-height: 20px;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 22px;
        height: 19px;
        padding: 0 4px;
        display: inline-grid;
        grid-template-columns: 11px max-content;
        align-items: center;
        justify-content: center;
        column-gap: 2px;
        line-height: 1;
      }

      .sidebar .room-area-button .info-badge ha-icon,
.sidebar .room-area-button.has-picture .info-badge ha-icon{
        width: 11px;
        height: 11px;
        display: block;
        align-self: center;
        --mdc-icon-size: 11px;
        line-height: 0;
        transform: translateY(-0.5px);
      }

      .sidebar .room-area-button .badge-count,
.sidebar .room-area-button.has-picture .badge-count{
        height: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        font-size: 9px;
        line-height: 11px;
        transform: translateY(0.5px);
      }
    }

    /* Desktop meta uses the available horizontal space: time/date stacked, weather beside it. */
    @media (min-width: 769px) {
      .header-time-weather{
        min-width: 176px;
        height: 50px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .header-time-section{
        min-width: 76px;
        align-items: flex-end;
        justify-content: center;
        gap: 1px;
        padding: 0;
        background: transparent;
        border: 0;
        box-shadow: none;
      }

      .header-time{
        font-size: 18px;
        line-height: 1.05;
      }

      .header-date{
        font-size: 10px;
        line-height: 1.05;
      }

      .weather-compact{
        min-height: 30px;
        padding: 3px 9px;
      }

      .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px;
      }

      .weather-temp-compact{
        font-size: 11px;
      }
    }

    /* Room follow-up: restore functional group drag handles. The title was intentionally
       non-interactive in normal mode{
      pointer-events: auto;
    }

    /* Expanded favorites content keeps the same inset as generated room content. */
    .room-favorites-content{
      padding: 6px 9px 9px;
    }

    /* Final mobile room-view pass: compact room header and desktop-like area picker cards. */
    @media (max-width: 768px) {
      /* Room header: top row for navigation/identity/actions{
        min-height: 0 !important;
        padding: 10px !important;
        grid-template-columns: 42px 60px minmax(0, 1fr) 76px !important;
        grid-template-rows: auto auto !important;
        grid-template-areas:
          "back media copy actions"
          "metrics metrics metrics metrics" !important;
        column-gap: 9px !important;
        row-gap: 10px !important;
        align-items: center !important;
      }

      /* Area picker sheet: compact chrome and enough clearance above the bottom navigation. */


      .mobile-area-picker-head{
        min-height: 34px !important;
        margin: 0 2px 8px !important;
      }

      .mobile-area-picker-title{
        font-size: 18px !important;
        line-height: 1.1 !important;
      }

      .mobile-area-picker-close{
        width: 34px !important;
        height: 34px !important;
      }



      .sidebar .area-list{
        gap: 4px !important;
      }

      .sidebar .floor-section{
        gap: 5px !important;
        margin-bottom: 8px !important;
      }

      .sidebar .floor-areas{
        gap: 4px !important;
      }

      .sidebar .floor-header{
        padding: 4px 6px 2px !important;
      }

      .sidebar .floor-header h3{
        font-size: 13px !important;
        font-weight: 760 !important;
      }

      /* Mobile room cards mirror the compact information hierarchy of the desktop sidebar. */
      .sidebar .room-area-button{
        min-height: 72px !important;
        height: auto !important;
        padding: 8px 10px !important;
        display: grid !important;
        grid-template-columns: 52px minmax(0, 1fr) !important;
        grid-template-rows: auto !important;
        align-items: center !important;
        column-gap: 10px !important;
        border-radius: 9px !important;
      }

      .sidebar .room-area-button .area-media{
        grid-column: 1 !important;
        grid-row: 1 !important;
        position: relative !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        align-self: center !important;
        overflow: hidden;
        border-radius: 8px !important;
      }

      .sidebar .room-area-button .area-media-icon,
.sidebar .room-area-button .area-media-picture{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon{
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 26px !important;
      }

      .sidebar .room-area-button .area-content{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        min-height: 52px !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        align-items: center !important;
        column-gap: 8px !important;
      }

      .sidebar .room-area-button .area-top-section{
        grid-column: 1 !important;
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 3px !important;
      }

      .sidebar .room-area-button .area-name{
        width: 100% !important;
        margin: 0 !important;
        overflow: hidden;
        font-size: 15px !important;
        font-weight: 800 !important;
        line-height: 1.1 !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .room-area-button .area-sensors{
        width: 100% !important;
        margin-top: 3px !important;
        overflow: hidden;
        font-size: 11px !important;
        font-weight: 650 !important;
        line-height: 1.1 !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .room-area-button .area-info-badges{
        grid-column: 2 !important;
        position: static !important;
        width: 74px !important;
        max-width: 74px !important;
        min-width: 74px !important;
        margin: 0 0 0 auto !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        align-content: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 22px !important;
        height: 19px !important;
        padding: 0 5px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9px !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        width: 14px !important;
        min-width: 14px !important;
        height: 19px !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 15px !important;
        line-height: 19px !important;
      }

      .sidebar .room-area-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 52%, transparent) !important;
        background: color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) !important;
        box-shadow:
          inset 3px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 6px 14px rgba(15, 23, 42, 0.07) !important;
      }

      /* Home row stays compact and visually subordinate to room cards. */
      .sidebar .area-button.home-button{
        min-height: 54px !important;
        height: 54px !important;
        padding: 7px 10px !important;
        display: grid !important;
        grid-template-columns: 40px minmax(0, 1fr) 20px !important;
        align-items: center !important;
        gap: 10px !important;
        margin: 0 0 7px !important;
      }

      .sidebar .area-button.home-button .area-icon{
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: 40px !important;
        height: 40px !important;
        transform: none !important;
        border-radius: 8px !important;
      }

      .sidebar .area-button.home-button .area-info{
        grid-column: 2 !important;
        min-width: 0 !important;
      }

      .sidebar .area-button.home-button .area-menu-chevron{
        grid-column: 3 !important;
        justify-self: end !important;
      }
    }

    /* 1.8.10x desktop density and hierarchy follow-up */
    @media (min-width: 769px) {
      .content-area{
        scrollbar-gutter: stable;
      }

      .welcome-notification-action{
        width: 48px;
        height: 48px;
        border-radius: 999px;
        background: transparent;
        box-shadow: none;
      }

      .welcome-notification-action ha-icon{
        --mdc-icon-size: 26px;
      }

      .welcome-settings-action{
        width: 44px;
        height: 44px;
        border-radius: 999px;
      }

      .home-status-grid{
        align-items: start;
      }

      .home-status-card{
        min-height: 104px;
        padding: 12px;
      }

      .home-status-card .status-card-icon{
        width: 42px;
        height: 42px;
        margin-bottom: 10px;
      }

      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        min-height: 0;
        height: auto;
        align-self: start;
        padding: 12px;
        gap: 8px;
      }

      .house-persons-grid{
        margin-top: 2px;
      }

      .house-climate-grid{
        gap: 7px;
      }

      .house-climate-metric{
        min-height: 42px;
        padding: 6px 8px;
      }

      .house-power-list{
        margin-top: 2px;
      }

      .global-header.room-context .room-favorites-block{
        border-color: color-mix(in srgb, var(--primary-color) 12%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 3%, var(--card-background-color));
      }

      .global-header.room-context .room-favorites-header{
        min-height: 38px !important;
        padding: 7px 9px !important;
      }

      .global-header.room-context .room-favorites-title{
        min-height: 24px !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-title-label{
        font-size: 15px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-count{
        font-size: 10px !important;
        font-weight: 650 !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon{
        width: 22px !important;
        height: 22px !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon ha-icon{
        --mdc-icon-size: 18px !important;
      }

      .room-header-title-row{
        gap: 5px;
      }

      .room-header-home-link{
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 8%, transparent);
        color: var(--primary-color);
      }

      .room-header-home-link:hover{
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }

      .room-header-home-link ha-icon{
        --mdc-icon-size: 19px;
      }

      .room-header-home-chevron{
        flex: 0 0 auto;
        color: var(--secondary-text-color);
        --mdc-icon-size: 16px;
        opacity: 0.7;
      }
    }

    @media (max-width: 768px) {
      .room-header-home-chevron{
        display: none;
      }
    }

    /* Follow-up: keep requested density changes coherent instead of content-dependent. */
    @media (min-width: 769px) {
      /* House information uses two intentional heights:
         detailed summary cards are equal; simple active-status cards are compact and equal. */
      .home-status-grid{
        align-items: start;
      }

      .home-status-card{
        box-sizing: border-box;
        height: 94px;
        min-height: 94px;
        padding: 10px 12px;
        justify-content: flex-start;
        gap: 7px;
      }

      .home-status-card .status-card-icon{
        width: 38px;
        height: 38px;
        margin: 0;
      }

      .home-status-card .status-card-icon ha-icon{
        --mdc-icon-size: 21px;
      }

      .home-status-card .status-card-title{
        margin: 0;
        font-size: 14px;
        line-height: 1.1;
      }

      .home-status-card.has-value .status-card-value{
        margin: 0;
      }

      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        height: 162px;
        min-height: 162px;
        padding: 12px;
        gap: 8px;
        overflow: hidden;
      }

      .house-person-mini{
        min-height: 36px;
        padding: 4px 6px;
      }

      .house-person-avatar{
        width: 24px;
        height: 24px;
      }

      .house-climate-metric{
        min-height: 44px;
      }

      .house-power-list{
        gap: 3px;
      }

      .house-power-room{
        grid-template-columns: 20px minmax(0, 1fr) auto;
        column-gap: 6px;
        row-gap: 2px;
      }

      .house-power-room-icon{
        width: 20px;
        height: 20px;
        border-radius: 7px;
      }

      .house-power-room-icon ha-icon{
        --mdc-icon-size: 13px;
      }

      .house-power-bar{
        height: 3px;
      }

      /* The Home affordance should read as navigation,
not as a second room tile. */
      .room-header-home-link{
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        box-shadow: none;
        color: var(--primary-color);
      }

      .room-header-home-link:hover{
        background: color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .room-header-home-link ha-icon{
        --mdc-icon-size: 18px;
      }

      /* Favorites matches the generated type header in height,
typography and interaction. */
      .global-header.room-context .room-favorites-block{
        background: var(--card-background-color);
        border-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
      }

      .global-header.room-context .room-favorites-header{
        height: 38px !important;
        min-height: 38px !important;
        padding: 7px 9px !important;
        box-sizing: border-box;
        transition: background-color 0.16s ease, box-shadow 0.16s ease;
      }

      .global-header.room-context .room-favorites-header:hover{
        background: color-mix(in srgb, var(--primary-color) 5%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .global-header.room-context .room-favorites-title{
        min-height: 24px !important;
        align-items: center !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-leading-chevron,
.global-header.room-context .room-favorites-title .room-domain-icon,
.global-header.room-context .room-favorites-title .mobile-domain-title-copy,
.global-header.room-context .room-favorites-title .mobile-domain-count{
        align-self: center;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-title-copy{
        align-items: center !important;
        line-height: 1 !important;
      }

      /* Keep the title block at the same vertical position even when no active room badge exists. */
      .room-header-summary{
        min-height: 22px;
      }

      .room-header-summary.is-empty{
        visibility: hidden;
        pointer-events: none;
      }
    }

    /* Home information density: fixed outer heights, content-aware inner grids. */
    @media (min-width: 769px) {
      /* Normalize section rhythm across Home. */
      .home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        margin-bottom: 36px;
      }

      /* Detailed Home information cards stay equal in outer height. */
      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        height: 162px;
        min-height: 162px;
      }

      /* Simple active-status cards are exactly half the detailed-card height. */
      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card){
        height: 81px;
        min-height: 81px;
        padding: 9px 11px 7px;
        display: grid;
        grid-template-rows: 34px minmax(0, 1fr);
        align-items: start;
        gap: 0;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-icon{
        width: 34px;
        height: 34px;
        margin: 0;
        align-self: start;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-icon ha-icon{
        --mdc-icon-size: 19px;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-title{
        width: 100%;
        min-height: 30px;
        margin: 0;
        display: flex;
        align-items: center;
        align-self: stretch;
        font-size: 13px;
        line-height: 1.05;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value{
        grid-template-rows: 30px auto minmax(0, 1fr);
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value .status-card-value{
        margin: 0;
        font-size: 17px;
        line-height: 1;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value .status-card-title{
        min-height: 18px;
        font-size: 10px;
      }

      /* Compact status count pills like the room badges: smaller and shifted outward. */
      .home-status-card .status-card-badge{
        top: -5px;
        right: -14px;
        min-width: 20px;
        height: 20px;
        padding: 0 5px;
        font-size: 10px;
        line-height: 20px;
        box-shadow: 0 3px 8px color-mix(in srgb, var(--status-color) 24%, transparent);
      }

      /* Person grid fills the available matrix according to the actual HA person count. */
      .house-persons-grid{
        flex: 1 1 auto;
        min-height: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }

      .house-persons-card.persons-1 .house-persons-grid{
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr);
      }

      .house-persons-card.persons-2 .house-persons-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: minmax(0, 1fr);
      }

      .house-persons-card.persons-3 .house-persons-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      .house-persons-card.persons-3 .house-person-mini:last-child{
        grid-column: 1 / -1;
      }

      .house-person-mini{
        min-height: 0;
        height: 100%;
        padding: 6px 8px;
      }

      .house-persons-card.persons-1 .house-person-mini{
        justify-content: center;
      }

      .house-persons-card.persons-1 .house-person-avatar{
        width: 34px;
        height: 34px;
      }

      .house-persons-card.persons-1 .house-person-mini-name{
        font-size: 13px;
      }

      .house-persons-card.persons-1 .house-person-mini-state{
        font-size: 11px;
      }

      /* Climate metrics consume the full remaining body height when only one or two metrics exist. */
      .house-climate-grid{
        flex: 1 1 auto;
        min-height: 0;
        align-items: stretch;
      }

      .house-climate-card.metrics-1 .house-climate-grid{
        grid-template-columns: minmax(0, 1fr);
      }

      .house-climate-card.metrics-2 .house-climate-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .house-climate-card.metrics-1 .house-climate-metric,
.house-climate-card.metrics-2 .house-climate-metric{
        min-height: 0;
        height: 100%;
        padding: 10px 12px;
        grid-template-columns: 34px minmax(0, 1fr);
        column-gap: 10px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-icon,
.house-climate-card.metrics-2 .house-climate-metric-icon{
        width: 34px;
        height: 34px;
        border-radius: 10px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-icon ha-icon,
.house-climate-card.metrics-2 .house-climate-metric-icon ha-icon{
        --mdc-icon-size: 19px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-value,
.house-climate-card.metrics-2 .house-climate-metric-value{
        font-size: 18px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-label,
.house-climate-card.metrics-2 .house-climate-metric-label{
        font-size: 11px;
      }

      /* Power keeps a stable card height; empty state sits in the visual center of the body. */
      .house-power-empty{
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 6px;
        text-align: center;
      }

      /* Home Favorites uses the same section-header language as the other Home sections. */
      .home-favorites-section .favorites-header{
        min-height: 30px;
        margin: 0 0 14px;
        padding: 0;
        border: 0;
        display: flex;
        align-items: center;
        gap: 9px;
        color: var(--primary-text-color);
        font-size: 20px;
        font-weight: 850;
        line-height: 1.1;
      }

      .home-favorites-section .favorites-header ha-icon{
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        --mdc-icon-size: 20px;
        color: #f59e0b;
        background: color-mix(in srgb, #f59e0b 13%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
      }

      .home-favorites-section .favorites-header span{
        display: inline-flex;
        align-items: center;
        min-height: 30px;
      }
    }

    /* Final visual consistency pass for Home and room header. */
    @media (min-width: 769px) {
      /* Home status count badges match the compact room/header badge proportions. */
      .home-status-card .status-card-badge{
        top: -6px;
        right: -11px;
        min-width: 18px;
        height: 20px;
        padding: 0 4px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        line-height: 1;
        box-shadow: 0 3px 8px color-mix(in srgb, var(--status-color) 22%, transparent);
      }

      /* Place simple status labels in the exact visual center between icon tile and accent line. */
      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card):not(.has-value) .status-card-title{
        position: absolute;
        left: 11px;
        right: 11px;
        bottom: 9px;
        min-height: 18px;
        margin: 0;
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 1;
      }

      /* Room meta: time/date equals status-card height; weather is slightly larger but still secondary. */
      .global-header.room-context .header-time-weather{
        height: 50px;
        gap: 12px;
      }

      .global-header.room-context .header-time-section{
        width: 94px;
        min-width: 94px;
        height: 50px;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
      }

      .global-header.room-context .header-time{
        font-size: 24px;
        line-height: 1;
      }

      .global-header.room-context .header-date{
        margin-top: 3px;
        font-size: 11px;
        line-height: 1;
      }

      .global-header.room-context .weather-compact{
        min-height: 38px;
        padding: 0 12px;
        gap: 7px;
        border-radius: 999px;
      }

      .global-header.room-context .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px;
      }

      .global-header.room-context .weather-temp-compact{
        font-size: 13px;
      }

      /* Filled Home breadcrumb reads like navigation but remains distinct from the large room icon. */
      .room-header-home-link ha-icon{
        --mdc-icon-size: 19px;
      }

      /* Sidebar Home follows the room-card rhythm while remaining a special global destination. */
      .sidebar .area-button.home-button{
        min-height: 68px !important;
        height: 68px !important;
        padding: 8px 10px !important;
        grid-template-columns: 50px minmax(0, 1fr) auto 20px !important;
        gap: 9px !important;
        border-color: color-mix(in srgb, var(--primary-color) 18%, var(--divider-color)) !important;
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color)) !important;
      }

      .sidebar .area-button.home-button .area-icon{
        width: 50px !important;
        height: 50px !important;
        border-radius: 9px !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      }

      .sidebar .area-button.home-button .area-icon ha-icon{
        --mdc-icon-size: 25px !important;
      }

      .sidebar .area-button.home-button .area-name{
        font-size: 14px;
        font-weight: 850;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color)) !important;
        box-shadow:
          inset 3px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent),
          0 6px 14px rgba(15, 23, 42, 0.06) !important;
      }

      /* Room metric pills: direct icons{
        width: 24px !important;
        height: 30px !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      /* Climate card uses exactly the same temperature/humidity colors as the room view. */
      .house-climate-metric.temperature{ --metric-color: ${unsafeCSS(getDomainColor('climate'))} !important; }
      .house-climate-metric.humidity{ --metric-color: ${unsafeCSS(getDomainColor('humidity'))} !important; }

      /* Climate metric icons are direct,
slightly larger icons without a second circle. */
      .house-climate-metric-icon{
        width: 28px !important;
        height: 34px !important;
        border-radius: 0 !important;
        background: transparent !important;
      }

      .house-climate-metric-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      /* Desktop section headings are labels,
not buttons: color only,
no chip/background. */
      .home-status-heading ha-icon,
.home-camera-section .home-status-heading ha-icon,
.home-summaries-section .home-status-heading ha-icon,
.home-todos-section .home-status-heading ha-icon,
.home-custom-cards-section .home-status-heading ha-icon,
.home-favorites-section .favorites-header ha-icon{
        width: 24px !important;
        height: 24px !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .home-status-heading ha-icon{ color: var(--primary-color); }
      .home-camera-section .home-status-heading ha-icon{ color: #ef4444; }
      .home-summaries-section .home-status-heading ha-icon{ color: #c56f12; }
      .home-todos-section .home-status-heading ha-icon{ color: #7c3aed; }
      .home-custom-cards-section .home-status-heading ha-icon{ color: #0ea5a8; }
      .home-favorites-section .favorites-header ha-icon{ color: #f59e0b; }
    }

    .house-power-dialog-handle{
      display: none;
    }
    .house-power-dialog-subtitle{ margin-top: 3px; color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }

    .house-power-dialog-total{
      min-height: 72px;
      margin-bottom: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 10px;
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 14%, transparent);
    }

    .house-power-dialog-total span{ font-size: 28px; font-weight: 950; line-height: 1; }
    .house-power-dialog-total small{ margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; font-weight: 750; }

    .house-power-dialog-areas{ display: grid; gap: 10px; }
    .house-power-dialog-area{
      padding: 11px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-background-color) 72%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .house-power-dialog-area-head{
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
    }

    .house-power-dialog-area-icon{
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: ${unsafeCSS(getDomainColor('energy'))};
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 10%, transparent);
    }

    .house-power-dialog-area-icon ha-icon{ --mdc-icon-size: 17px; }
    .house-power-dialog-area-name{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 850; }

    .house-power-dialog-bar{
      position: relative;
      height: 5px;
      margin: 8px 0 6px 38px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 10%, var(--secondary-background-color));
    }

    .house-power-dialog-bar span{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: ${unsafeCSS(getDomainColor('energy'))};
    }

    .house-power-dialog-entities{
      margin-left: 38px;
      display: grid;
      gap: 2px;
    }

    .house-power-dialog-entity{
      width: 100%;
      min-height: 30px;
      padding: 4px 6px;
      border: 0;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .house-power-dialog-entity:hover{
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 7%, transparent);
    }

    .house-power-dialog-entity span{
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .house-power-dialog-entity strong{ font-size: 12px; white-space: nowrap; }
    .house-power-dialog-empty{
      min-height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      text-align: center;
    }

    @media (max-width: 768px) {

      .house-power-dialog-handle{
        display: none !important;
      }
    }

    /* Desktop Home alignment and section rhythm. */
    @media (min-width: 769px) {
      .home-view,
.home-welcome,
.home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        width: 100%;
        max-width: none;
        box-sizing: border-box;
      }

      .home-status-heading,
.home-favorites-section .favorites-header{
        margin-bottom: 10px !important;
      }

      .home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        margin-bottom: 28px !important;
      }

      .home-welcome{
        margin-bottom: 28px !important;
      }

      /* House information uses one six-column master grid:
       * large summary cards are exactly two columns wide; status cards one.
       * This keeps every status tile at half the width of a large card. */
      .home-status-primary-grid{
        width: 100%;
        max-width: none !important;
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        grid-auto-rows: 77px;
        gap: 8px 10px;
        align-items: stretch;
      }

      .favorites-grid,
.home-summary-list{
        width: 100%;
        max-width: none !important;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        align-items: stretch;
      }

      .home-status-primary-grid > .home-status-card:not(.compact-status){
        width: 100%;
        min-width: 0;
        grid-column: span 2 !important;
        grid-row: span 2;
      }

      .home-status-primary-grid > .home-status-card.compact-status{
        width: 100%;
        min-width: 0;
        min-height: 0;
        height: auto;
        grid-column: span 1 !important;
        grid-row: span 1;
      }

      /* Favorites/Summary cards use the same column width as a primary House Information card. */
      .home-favorites-section .favorite-card-wrapper,
.home-summary-list .home-summary-card{
        width: 100%;
        min-width: 0;
      }

      /* Room Favorites: hard vertical centering across chevron,
star,
text and count. */
      .global-header.room-context .room-favorites-header{
        display: flex !important;
        align-items: center !important;
      }

      .global-header.room-context .room-favorites-title{
        height: 24px !important;
        min-height: 24px !important;
        display: flex !important;
        align-items: center !important;
        gap: 7px !important;
      }

      .global-header.room-context .room-favorites-title > *,
.global-header.room-context .room-favorites-title .mobile-domain-title-copy,
.global-header.room-context .room-favorites-title .mobile-domain-title-label,
.global-header.room-context .room-favorites-title .mobile-domain-count{
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        align-self: center !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-leading-chevron{
        transform: translateY(0) !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transform: translateY(0) !important;
      }

      /* Home sidebar item: no photo-like icon tile,
stronger global distinction,
readable selection. */
      .sidebar .area-button.home-button .area-icon{
        width: 32px !important;
        height: 32px !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .sidebar .area-button.home-button .area-icon ha-icon{
        --mdc-icon-size: 25px !important;
        color: var(--primary-color) !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 24%, var(--divider-color)) !important;
      }

      .sidebar .area-button.home-button.selected{
        color: var(--primary-text-color) !important;
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 42%, var(--divider-color)) !important;
      }

      .sidebar .area-button.home-button.selected .area-name,
.sidebar .area-button.home-button.selected .area-menu-chevron{
        color: var(--primary-text-color) !important;
      }

      .sidebar .area-button.home-button.selected .area-icon ha-icon{
        color: var(--primary-color) !important;
      }

      /* Status counts match room badges: near-circle,
never pill-shaped for 1–2 digits. */
      .home-status-card .status-card-badge{
        min-width: 20px !important;
        width: 20px !important;
        height: 20px !important;
        padding: 0 !important;
        border-radius: 999px !important;
      }
    }

    /* Richer power dialog mirrors the Devices > Energy information density. */
    .house-power-dialog{
      width: min(900px, calc(100vw - 32px));
    }

    .house-power-dialog-overview{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    .house-power-dialog-overview-card{
      min-width: 0;
      padding: 13px;
      border-radius: 11px;
      background: var(--card-background-color);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent),
        0 8px 22px rgba(15, 23, 42, 0.04);
    }

    .house-power-dialog-overview-head{
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      align-items: center;
      gap: 9px;
    }

    .house-power-dialog-overview-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: ${unsafeCSS(getDomainColor('energy'))};
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 10%, transparent);
    }

    .house-power-dialog-overview-icon ha-icon{ --mdc-icon-size: 21px; }
    .house-power-dialog-overview-head strong{ display: block; font-size: 14px; font-weight: 850; }
    .house-power-dialog-overview-head small{ display: block; margin-top: 3px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; }
    .house-power-dialog-overview-head b{ font-size: 20px; font-weight: 950; white-space: nowrap; }

    .house-power-statistics-card{
      display: block;
      min-height: 132px;
      margin-top: 10px;
      border-radius: 10px;
      overflow: hidden;
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 10px;
    }

    .house-power-dialog-top-entities{
      margin-top: 10px;
      display: grid;
      gap: 5px;
    }

    .house-power-dialog-top-entities button{
      min-height: 30px;
      padding: 0 9px;
      border: 0;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 5%, transparent);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .house-power-dialog-entity.detailed{
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 42px;
      padding: 5px 6px;
    }

    .house-power-dialog-entity-icon{
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: ${unsafeCSS(getDomainColor('energy'))};
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 9%, transparent);
    }

    .house-power-dialog-entity-icon ha-icon{ --mdc-icon-size: 17px; }

    .house-power-dialog-entity-copy{
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .house-power-dialog-entity-copy > strong{
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    .house-power-dialog-entity-copy > small{
      color: var(--secondary-text-color);
      font-size: 10px;
    }

    .house-power-dialog-entity-bar{
      position: relative;
      height: 3px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 10%, var(--secondary-background-color));
    }

    .house-power-dialog-entity-bar span{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--entity-power-width, 0%);
      min-width: 3px;
      border-radius: inherit;
      background: ${unsafeCSS(getDomainColor('energy'))};
    }

    .house-power-dialog-entity.detailed > b{
      font-size: 12px;
      white-space: nowrap;
    }

    @media (max-width: 1100px) and (min-width: 769px) {
      .home-status-primary-grid{
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .favorites-grid,
.home-summary-list{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .home-status-primary-grid,
.home-status-secondary-grid{
        display: contents;
      }

      .home-status-stack{
        display: contents;
      }

      .house-power-dialog-overview{
        grid-template-columns: 1fr;
      }
    }

    /* Compact Home Favorites and clearer sidebar Home state. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        min-height: 81px !important;
        height: 81px !important;
        padding: 9px 10px !important;
        display: grid !important;
        grid-template-columns: 38px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 9px !important;
      }

      .home-favorites-section .favorite-icon{
        width: 38px !important;
        height: 38px !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0;
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        gap: 3px;
      }

      .home-favorites-section .favorite-name{
        margin: 0 !important;
        font-size: 13px !important;
        line-height: 1.05 !important;
        -webkit-line-clamp: 1 !important;
      }

      .home-favorites-section .favorite-area{
        margin: 0 !important;
        font-size: 9px !important;
        line-height: 1 !important;
      }

      .home-favorites-section .favorite-end{
        min-width: 48px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 4px;
      }

      .home-favorites-section .favorite-quick-action{
        width: 38px !important;
        height: 22px !important;
        flex: 0 0 auto;
      }

      .home-favorites-section .favorite-end-state,
.home-favorites-section .favorite-info-state{
        max-width: 76px;
        color: var(--secondary-text-color);
        font-size: 9px;
        font-weight: 750;
        line-height: 1.05;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .home-favorites-section .favorite-info-state{
        font-size: 12px;
        color: var(--primary-text-color);
      }

      .home-favorites-section .favorite-state{
        display: none !important;
      }

      /* Unselected Home must not resemble a selected room. */
      .sidebar .area-button.home-button{
        background: var(--card-background-color) !important;
        border-color: color-mix(in srgb, var(--primary-color) 16%, var(--divider-color)) !important;
        box-shadow:
          inset 3px 0 0 color-mix(in srgb, var(--primary-color) 60%, transparent),
          0 5px 12px rgba(15, 23, 42, 0.04) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 46%, var(--divider-color)) !important;
        box-shadow:
          inset 4px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 12%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }

      .sidebar .room-area-button.selected{
        background: color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) !important;
      }
    }

    @media (max-width: 1250px) and (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
    }

    .house-power-dialog-actions{
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
    }

    .house-power-dialog-energy-link{
      min-height: 36px;
      padding: 0 11px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: ${unsafeCSS(getDomainColor('energy'))};
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 14%, transparent);
      font: inherit;
      font-size: 12px;
      font-weight: 850;
      cursor: pointer;
    }

    .house-power-dialog-energy-link:hover{
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('energy'))} 15%, var(--card-background-color));
    }

    .house-power-dialog-energy-link ha-icon{
      --mdc-icon-size: 17px;
    }

    @media (max-width: 768px) {
      .house-power-dialog-energy-link span{
        display: none;
      }

      .house-power-dialog-energy-link{
        width: 36px;
        padding: 0;
      }
    }

    /* Final Home polish: compact Favorites, clear Home state, exact room-Favorites centering. */
    @media (min-width: 769px) {
      .home-favorites-section .favorite-card-wrapper{
        height: 84px !important;
        min-height: 84px !important;
        grid-template-columns: 34px minmax(0, 1fr) 46px !important;
        gap: 8px !important;
        padding: 9px 10px !important;
      }
      .home-favorites-section .favorite-icon{
        width: 34px !important;
        height: 34px !important;
      }
      .home-favorites-section .favorite-icon ha-icon{ --mdc-icon-size: 19px !important; }
      .home-favorites-section .favorite-body{
        gap: 2px !important;
        overflow: visible !important;
      }
      .home-favorites-section .favorite-name{
        display: -webkit-box !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        font-size: 12px !important;
        line-height: 1.08 !important;
      }
      .home-favorites-section .favorite-area{
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
      }
      .home-favorites-section .favorite-end{
        width: 46px !important;
        min-width: 46px !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
      }
      .home-favorites-section .favorite-quick-action{ margin: 0 auto !important; }
      .home-favorites-section .favorite-end-state{
        width: 100% !important;
        max-width: none !important;
        text-align: center !important;
        font-size: 9px !important;
        line-height: 1 !important;
      }
      .home-favorites-section .favorite-info-state{
        width: 100% !important;
        max-width: none !important;
        text-align: center !important;
        color: var(--favorite-color) !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-color) 20%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.045) !important;
      }
      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 48%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 11%, transparent) !important;
      }
      .sidebar .room-area-button.selected{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
      }
    }

    .room-favorites-title,
.room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon,
.room-favorites-title .mobile-domain-title-copy,
.room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      height: 24px !important;
      min-height: 24px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 24px !important;
      vertical-align: middle !important;
      transform: none !important;
    }
    .room-favorites-title{
      gap: 6px !important;
    }
    .room-favorites-title .mobile-domain-title-copy{
      gap: 5px !important;
    }
    .house-power-dialog-energy-link{
      min-height: 30px !important;
      padding: 0 10px !important;
      margin-left: 2px !important;
      font-size: 11px !important;
    }
    @media (max-width: 768px) {
      .house-power-dialog-energy-link span{ display: inline !important; }
      .house-power-dialog-energy-link{ width: auto !important; }
    }

    /* Final visual cleanup for Home favorites and room Favorites header. */
    @media (min-width: 769px) {
      .home-favorites-section .favorite-card-wrapper{
        min-height: 84px !important;
        height: 84px !important;
        padding: 9px 10px !important;
        grid-template-columns: 38px minmax(0, 1fr) 50px !important;
        align-items: center !important;
        gap: 9px !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0 !important;
        align-self: center !important;
        gap: 3px !important;
      }

      .home-favorites-section .favorite-name{
        max-width: 100% !important;
        margin: 0 !important;
        display: -webkit-box !important;
        -webkit-box-orient: vertical !important;
        -webkit-line-clamp: 2 !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        font-size: 13px !important;
        line-height: 1.08 !important;
      }

      .home-favorites-section .favorite-area{
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        font-size: 9px !important;
        line-height: 1.05 !important;
      }

      .home-favorites-section .favorite-end{
        width: 50px !important;
        min-width: 50px !important;
        height: 48px !important;
        display: grid !important;
        grid-template-rows: 26px 14px !important;
        align-content: center !important;
        justify-items: center !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-quick-action{
        width: 40px !important;
        height: 24px !important;
        margin: 0 !important;
      }

      .home-favorites-section .favorite-end-state{
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        color: var(--secondary-text-color) !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        line-height: 12px !important;
        text-align: center !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-info-state{
        width: 100% !important;
        max-width: none !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: var(--favorite-color) !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: center !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--secondary-background-color) 72%, var(--card-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.05) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 38%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }
    }

    .room-favorites-header{
      min-height: 38px !important;
      height: 38px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    .room-favorites-title{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1 !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon{
      width: 18px !important;
      height: 18px !important;
      min-height: 18px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 0 !important;
      transform: none !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron{
      --mdc-icon-size: 16px !important;
    }

    .room-favorites-title .room-favorites-icon ha-icon{
      --mdc-icon-size: 18px !important;
    }

    .room-favorites-title .mobile-domain-title-copy{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 20px !important;
      transform: translateY(0.5px) !important;
    }

    .room-favorites-title .mobile-domain-title-label{
      font-size: 15px !important;
    }

    .room-favorites-title .mobile-domain-count{
      font-size: 10px !important;
    }


    /* 2026-09 Home polish: readable favorites, clear Home state, exact Favorites header alignment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)) !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        min-height: 86px !important;
        height: auto !important;
        padding: 10px 12px !important;
        display: grid !important;
        grid-template-columns: 40px minmax(0, 1fr) auto !important;
        align-items: center !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-icon{
        width: 40px !important;
        height: 40px !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0 !important;
        overflow: visible !important;
        align-self: center !important;
        gap: 3px !important;
      }

      .home-favorites-section .favorite-name,
.home-favorites-section .favorite-area{
        max-width: 100% !important;
        display: block !important;
        overflow: visible !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: initial !important;
      }

      .home-favorites-section .favorite-name{
        margin: 0 !important;
        font-size: 13px !important;
        line-height: 1.12 !important;
      }

      .home-favorites-section .favorite-area{
        margin: 0 !important;
        font-size: 10px !important;
        line-height: 1.12 !important;
      }

      .home-favorites-section .favorite-end{
        width: auto !important;
        min-width: 0 !important;
        height: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
      }

      .home-favorites-section .favorite-end-state{
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        color: var(--favorite-color) !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        text-align: right !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-quick-action{
        width: 40px !important;
        height: 24px !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }

      .home-favorites-section .favorite-info-state{
        width: auto !important;
        max-width: none !important;
        height: auto !important;
        display: block !important;
        color: var(--favorite-color) !important;
        font-size: 15px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: right !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 9%, var(--secondary-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-color) 22%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.045) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 20%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 46%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 12%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }
    }

    .room-favorites-header{
      min-height: 40px !important;
      height: 40px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    .room-favorites-title,
.room-favorites-title .mobile-domain-title-copy{
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 1.15 !important;
      transform: none !important;
    }

    .room-favorites-title{
      gap: 6px !important;
    }

    .room-favorites-title .mobile-domain-title-copy{
      gap: 5px !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon{
      width: 18px !important;
      height: 18px !important;
      min-height: 18px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      align-self: center !important;
      line-height: 0 !important;
      transform: none !important;
    }

    .room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 1.15 !important;
      transform: none !important;
      vertical-align: middle !important;
    }


    /* 2026-09-30 final entity-card system: compact favorites + four-column room controls. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid,
.room-favorites-content .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        width: 100% !important;
        height: 58px !important;
        min-height: 58px !important;
        padding: 7px 8px !important;
        box-sizing: border-box !important;
        display: grid !important;
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 7px !important;
        overflow: hidden !important;
        border-radius: 8px !important;
      }

      .home-favorites-section .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 36px !important;
        height: 36px !important;
        margin: 0 !important;
        align-self: center !important;
        border-radius: 8px !important;
      }

      .home-favorites-section .favorite-icon ha-icon,
.room-favorites-content .favorite-icon ha-icon{
        --mdc-icon-size: 19px !important;
      }

      .home-favorites-section .favorite-body,
.room-favorites-content .favorite-body{
        min-width: 0 !important;
        height: 36px !important;
        align-self: center !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 3px !important;
        overflow: hidden !important;
      }

      .home-favorites-section .favorite-name,
.room-favorites-content .favorite-name{
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        display: block !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        font-size: 10.5px !important;
        font-weight: 850 !important;
        line-height: 1.05 !important;
        letter-spacing: -0.12px !important;
      }

      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta{
        min-width: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 3px !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        font-size: 9.5px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
      }

      .home-favorites-section .favorite-area,
.room-favorites-content .favorite-area{
        min-width: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        color: var(--secondary-text-color) !important;
        font-size: inherit !important;
        line-height: inherit !important;
      }

      .home-favorites-section .favorite-meta-separator,
.room-favorites-content .favorite-meta-separator{
        flex: 0 0 auto !important;
        color: color-mix(in srgb, var(--secondary-text-color) 72%, transparent) !important;
      }

      .home-favorites-section .favorite-inline-state,
.room-favorites-content .favorite-inline-state{
        flex: 0 0 auto !important;
        color: var(--favorite-color) !important;
        font-weight: 850 !important;
      }

      .home-favorites-section .favorite-card-wrapper.is-off .favorite-inline-state,
.home-favorites-section .favorite-card-wrapper.is-idle .favorite-inline-state,
.room-favorites-content .favorite-card-wrapper.is-off .favorite-inline-state,
.room-favorites-content .favorite-card-wrapper.is-idle .favorite-inline-state{
        color: var(--secondary-text-color) !important;
      }

      .home-favorites-section .favorite-end,
.room-favorites-content .favorite-end{
        width: auto !important;
        min-width: 0 !important;
        height: 36px !important;
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-quick-action,
.room-favorites-content .favorite-quick-action{
        width: 38px !important;
        height: 22px !important;
        margin: 0 !important;
      }

      .favorite-cover-actions{
        min-height: 30px;
        padding: 2px;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 4px 10px rgba(15, 23, 42, 0.06);
      }

      .favorite-cover-action{
        width: 25px;
        height: 25px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
        background: transparent;
        cursor: pointer;
      }

      .favorite-cover-action ha-icon{ --mdc-icon-size: 15px; }

      .favorite-cover-action.active{
        color: #fff;
        background: var(--favorite-color);
      }

      .mobile-light-control-row{
        width: 100%;
        min-width: 0;
        margin-top: 8px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 8px;
      }

      .mobile-light-mode-buttons{
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .mobile-light-mode-button{
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-text-color) 64%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
        cursor: pointer;
      }

      .mobile-light-mode-button ha-icon{ --mdc-icon-size: 16px; }

      .mobile-light-mode-button.active{
        color: var(--entity-color);
        background: color-mix(in srgb, var(--entity-color) 15%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        appearance: none;
        width: 100%;
        height: 5px;
        margin: 0;
        border: 0;
        border-radius: 999px;
        outline: none;
        background: color-mix(in srgb, var(--primary-text-color) 13%, transparent);
        cursor: pointer;
      }

      .mobile-light-control-row.mode-brightness .mobile-light-control-slider{
        background: linear-gradient(90deg, ${unsafeCSS(getDomainColor('light'))} 0%, #f0bd45 100%);
      }

      .mobile-light-control-row.mode-color_temp .mobile-light-control-slider{
        background: linear-gradient(90deg, #f4a340 0%, #ffe4aa 43%, #d9ecff 66%, #7eb9ff 100%);
      }

      .mobile-light-control-row.mode-color .mobile-light-control-slider{
        background: linear-gradient(
          90deg,
          #ff3b30 0%,
          #ff9500 16%,
          #ffcc00 30%,
          #34c759 45%,
          #00c7be 58%,
          #007aff 72%,
          #5856d6 84%,
          #af52de 92%,
          #ff2d55 100%
        );
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        appearance: none;
        width: 15px;
        height: 15px;
        border: 2px solid var(--entity-color);
        border-radius: 50%;
        background: var(--card-background-color);
        box-shadow: 0 2px 5px rgba(15, 23, 42, 0.12);
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 13px;
        height: 13px;
        border: 2px solid var(--entity-color);
        border-radius: 50%;
        background: var(--card-background-color);
      }

      .mobile-cover-position{
        width: 100%;
        margin-top: 10px;
      }

      .mobile-cover-position input[type="range"]{
        background: linear-gradient(90deg, var(--entity-color) 0%, var(--entity-color) 100%) !important;
      }

      .mobile-entity-brightness{
        display: none !important;
      }
    }


    /* 2026-09-30 entity-card refinements */
    @media (min-width: 769px) {
      /* Favorites: identical component in Home and room header; use every pixel for text. */
      .home-favorites-section .favorite-card-wrapper,
.header-favorites .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        grid-template-columns: 32px minmax(0, 1fr) auto !important;
        gap: 5px !important;
        padding: 6px 7px !important;
      }

      .home-favorites-section .favorite-icon,
.header-favorites .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 32px !important;
        height: 32px !important;
      }

      .home-favorites-section .favorite-body,
.header-favorites .favorite-body,
.room-favorites-content .favorite-body{
        height: 32px !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-name,
.header-favorites .favorite-name,
.room-favorites-content .favorite-name{
        font-size: 10px !important;
        letter-spacing: -0.2px !important;
      }

      .home-favorites-section .favorite-name.is-long,
.header-favorites .favorite-name.is-long,
.room-favorites-content .favorite-name.is-long{
        font-size: 9px !important;
        letter-spacing: -0.28px !important;
      }

      .home-favorites-section .favorite-name.is-very-long,
.header-favorites .favorite-name.is-very-long,
.room-favorites-content .favorite-name.is-very-long{
        font-size: 8px !important;
        letter-spacing: -0.32px !important;
      }

      .home-favorites-section .favorite-meta,
.header-favorites .favorite-meta,
.room-favorites-content .favorite-meta{
        font-size: 8.7px !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-quick-action,
.header-favorites .favorite-quick-action,
.room-favorites-content .favorite-quick-action{
        width: 36px !important;
        height: 21px !important;
      }

      .home-favorites-section .favorite-end,
.header-favorites .favorite-end,
.room-favorites-content .favorite-end{
        height: 32px !important;
        margin-left: 2px !important;
      }

      .header-favorites .favorites-grid,
.room-favorites-content .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      .mobile-light-control-row{
        margin-top: 6px !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        gap: 7px !important;
      }

      .mobile-light-mode-buttons{
        order: 2;
        gap: 3px !important;
      }

      .mobile-light-control-slider{
        order: 1;
      }

      .mobile-light-mode-button{
        width: 27px !important;
        height: 27px !important;
      }

      /* Slightly stronger sliders/thumbs for lights and covers. */
      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 6px !important;
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 16px !important;
        height: 16px !important;
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 14px !important;
        height: 14px !important;
      }

      .mobile-cover-position{
        margin-top: 7px !important;
      }

      /* A cover percentage describes the open position,
so fill from the left up to that value. */
      .mobile-cover-position input[type="range"]{
        background: linear-gradient(
          90deg,
          var(--entity-color) 0%,
          var(--entity-color) var(--cover-position),
          color-mix(in srgb, var(--primary-text-color) 13%, transparent) var(--cover-position),
          color-mix(in srgb, var(--primary-text-color) 13%, transparent) 100%
        ) !important;
      }
    }


    /* 2026-10-01 entity/favorites refinement: compact vertical rhythm and clean controls. */
    @media (min-width: 769px) {

      .mobile-light-control-row{
        margin-top: 8px !important;
        margin-bottom: 0 !important;
        min-height: 27px !important;
        align-items: center !important;
      }

      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 8px !important;
      }

      .mobile-light-control-slider::-webkit-slider-runnable-track,
.mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-track,
.mobile-cover-position input[type="range"]::-moz-range-track{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-progress{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-cover-position{
        margin-top: 8px !important;
        margin-bottom: 0 !important;
        min-height: 8px !important;
      }

      .mobile-cover-position input[type="range"]{
        display: block !important;
      }

      /* Favorites: same compact rhythm on Home and in rooms. */
      .home-favorites-section .favorites-header{
        margin-bottom: 8px !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
        padding: 2px 0 4px !important;
      }

      .home-favorites-section .favorites-section,
.home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorites-section,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

      .room-favorites-content{
        padding-top: 2px !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

      /* A value-only favorite uses exactly the same visual slot as the light toggle. */
      .home-favorites-section .favorite-status-pill,
.room-favorites-content .favorite-status-pill{
        width: 38px !important;
        height: 22px !important;
        box-sizing: border-box !important;
        flex: 0 0 38px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 999px !important;
        color: var(--favorite-color) !important;
        background: color-mix(in srgb, var(--favorite-color) 12%, var(--card-background-color)) !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }

      .home-favorites-section .favorite-end,
.room-favorites-content .favorite-end{
        min-width: 38px !important;
      }

      /* With a toggle,
the area line is the only secondary text; no duplicate state. */
      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta{
        gap: 0 !important;
      }

      /* Keep the same title-to-card distance as the other generated entity groups. */
      .room-favorites-content .favorites-grid{
        padding-top: 2px !important;
      }

      /* Preserve the shadow around the Home cards instead of clipping it at the card edge. */
      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        clip-path: none !important;
      }
    }


    /* 2026-10-01: restore the 1.9.0 slider geometry and final room/home rhythm. */
    @media (min-width: 769px) {
      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 5px !important;
      }

      .mobile-light-control-slider::-webkit-slider-runnable-track,
.mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-track,
.mobile-cover-position input[type="range"]::-moz-range-track{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-progress{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 15px !important;
        height: 15px !important;
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 13px !important;
        height: 13px !important;
      }

      /* Favorites sit close to their header,
with the same compact rhythm as entity groups. */
      .home-favorites-section{
        overflow: visible !important;
      }

      .home-favorites-section .favorites-header{
        margin-bottom: 6px !important;
      }

      .home-favorites-section .favorites-grid,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

    }

    /* 2026-10-01: restore 1.9.0 controls + final favorites spacing/shadows. */
    @media (min-width: 769px) {
      /*
       * Keep the 1.9.6 implementation code available,
but do not render the
       * added light sliders/mode buttons or the cover-position slider.
       * This restores the visible control behavior of 1.9.0:
       * lights = normal toggle,
covers = open/stop/close buttons.
       */

      .room-favorites-block:not(.is-collapsed) .room-favorites-header{
        margin-bottom: 2px !important;
      }

      .room-favorites-content,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
        margin-top: 0 !important;
      }

      /*
       * Home has a more specific overflow-x rule than the room view.
       * Override it so the shadow belongs to each individual favorite tile
       * and is not clipped at the bottom.
       */
      .home-view .home-favorites-section,
.home-view .home-favorites-section .favorites-grid,
.home-view .home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper{
        clip-path: none !important;
      }
    }

    /* 2026-10-01: definitive room-grid/favorite spacing pass. */
    @media (min-width: 769px) {

      /*
       * Favorites: the room header has its own 6px content padding,
which
       * doubled the intended header-to-card distance. Remove only that
       * top padding; the other insets remain unchanged.
       */
      .room-favorites-content{
        padding-top: 0 !important;
      }

      .room-favorites-content .favorites-grid{
        padding-top: 0 !important;
      }

      .home-favorites-section .favorites-header{
        margin-bottom: 6px !important;
      }
    }

    /* 2026-10-01: match the 1.9.0 favorite spacing and shadow behavior. */
    @media (min-width: 769px) {

      /* Home favorites must not use paint containment,
otherwise their card shadows are clipped. */
      .home-favorites-section{
        content-visibility: visible !important;
        contain: layout style !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid,
.home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
      }
    }

    /* 2026-10-01: Favorites spacing and Home card-shadow fix. */
    @media (min-width: 769px) {
      /* Cards directly follow the room Favorites header. */
      .room-favorites-block:not(.is-collapsed) .room-favorites-header{
        margin-bottom: 0 !important;
      }
      .room-favorites-content,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
      }

      /* Home Favorites: keep individual card shadows visible,
as on room pages. */
      .home-favorites-section,
.home-favorites-section .favorites-grid,
.home-favorites-section .favorites-section{
        overflow: visible !important;
      }
      .home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
        clip-path: none !important;
      }
    }


    /* 2026-10-01: Home favorites should match the room-card shadow treatment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-header{
        margin-bottom: 0 !important;
      }

      .home-favorites-section .favorites-grid{
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      /* Do not let Home-section paint/content containment clip card shadows. */
      .home-favorites-section{
        content-visibility: visible !important;
        contain: none !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        contain: layout style !important;
        overflow: visible !important;
      }
    }


    /* 2026-10-01: Home favorites should match the room-card shadow treatment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-header{
        margin-bottom: 0 !important;
      }

      .home-favorites-section .favorites-grid{
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      .home-favorites-section{
        content-visibility: visible !important;
        contain: none !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        contain: layout style !important;
        overflow: visible !important;
      }
    }

    /* 2026-10-01: desktop room/entity scale — 20% larger, four columns. */
    @media (min-width: 769px) {

      /* Sidebar room tiles: target the actual room tile class; do not override generic area buttons. */
      .sidebar .room-area-button{
        display: grid !important;
        grid-template-columns: 89px minmax(0, 1fr) !important;
        align-items: stretch !important;
        gap: 12px !important;
        min-height: 110px !important;
        height: 110px !important;
        padding: 10px !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
      }

      .sidebar .room-area-button .area-media{
        width: 89px !important;
        height: 89px !important;
        align-self: center !important;
      }
      .sidebar .room-area-button .area-media-icon{
        width: 89px !important;
        height: 89px !important;
      }
      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 41px !important;
      }

      .sidebar .room-area-button .area-content{
        min-width: 0 !important;
        height: 100% !important;
        justify-content: center !important;
        gap: 8px !important;
      }
      .sidebar .room-area-button .area-name{
        font-size: 16.8px !important;
        line-height: 1.1 !important;
      }
      .sidebar .room-area-button .area-sensors{
        margin-top: 4px !important;
        font-size: 13.2px !important;
        line-height: 1.1 !important;
      }
      .sidebar .room-area-button .area-info-badges{
        gap: 5px !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }
      .sidebar .room-area-button .info-badge{
        min-width: 32px !important;
        height: 25px !important;
        padding: 0 8px !important;
        font-size: 13px !important;
        flex: 0 0 auto !important;
      }
      .sidebar .room-area-button .info-badge ha-icon{ --mdc-icon-size: 15px !important; }
      .sidebar .room-area-button .badge-count{ font-size: 13px !important; }
      .sidebar .room-area-button .info-badge-overflow{
        min-width: 20px !important;
        width: 20px !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 16px !important;
        font-weight: 900 !important;
        letter-spacing: 1px !important;
      }

      /* Room header status badges: about 30% larger{
        min-height: 24px !important;
        gap: 5px !important;
        align-items: center !important;
      }

      /* Room-view time/weather: move the cluster slightly left and keep the Home weather treatment. */
      .global-header.room-context{ padding-right: 20px !important; }
      .global-header.room-context .header-time-weather{ gap: 6px !important; }
      .global-header.room-context .weather-compact{
        background: var(--secondary-background-color) !important;
        color: var(--primary-text-color) !important;
      }
      .global-header.room-context .weather-compact ha-icon{ color: var(--primary-text-color) !important; }
    }
    /* 2026-10-01: desktop room-view follow-up — final scoped overrides. */
    @media (min-width: 769px) {

      /* Sidebar: reserve one slot for the ellipsis whenever badges are hidden. */
      .sidebar .room-area-button .area-info-badges{
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: visible !important;
        flex-wrap: nowrap !important;
      }
      .sidebar .room-area-button .info-badge-overflow{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 18px !important;
        width: 18px !important;
        min-width: 18px !important;
        height: 19px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        letter-spacing: 1px !important;
      }

      /* Room header meta: move the whole time/weather cluster slightly left and tighten the gap. */
      .global-header.room-context{
        padding-right: 36px !important;
      }
      .global-header.room-context .header-time-weather{
        gap: 5px !important;
        transform: translateX(-2px) !important;
      }
      .global-header.room-context .weather-compact{
        background: var(--secondary-background-color) !important;
        color: var(--primary-text-color) !important;
        box-shadow: none !important;
      }
      .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
        color: var(--primary-text-color) !important;
      }
    }
    /* 2026-10-01: header status carousel. */
    .header-status-section{
      position: relative;
      min-width: 0;
    }

    .header-status-section .header-status-scroll{
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      padding-inline: 30px;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scroll-padding-inline: 30px;
    }

    .header-status-section .header-status-scroll > .status-card-compact{
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .header-status-section .header-status-scroll::-webkit-scrollbar{
      display: none;
    }

    .header-status-scroll-button{
      position: absolute;
      top: 50%;
      z-index: 4;
      width: 24px;
      height: 24px;
      padding: 0;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      border-radius: 999px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.12);
      cursor: pointer;
    }

    .header-status-scroll-button:hover{
      background: var(--secondary-background-color);
    }

    .header-status-scroll-button ha-icon{
      --mdc-icon-size: 17px;
    }

    .header-status-scroll-button-left{
      left: 2px;
    }

    .header-status-scroll-button-right{
      right: 2px;
    }



    /* 2026-10-01: final responsive room/sidebar follow-up. */
    @media (min-width: 769px) {

      /* Sidebar room tile and icon scale continuously with the tile width. */
      .sidebar .room-area-button{
        container-type: inline-size;
        grid-template-columns: clamp(64px, 30cqw, 110px) minmax(0, 1fr) !important;
        min-height: clamp(82px, 36cqw, 120px) !important;
        height: clamp(82px, 36cqw, 120px) !important;
        gap: clamp(8px, 3cqw, 12px) !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: clamp(28px, 11cqw, 42px) !important;
      }

      /* The badge row uses the full remaining width; the TS calculation decides
         how many badges plus the overflow marker are rendered. */
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }

      /* Keep room meta and favorites aligned with the right edge of the view. */
      .global-header.room-context .header-time-weather{
        margin-left: auto !important;
        justify-self: end !important;
      }

      .global-header.room-context .room-favorites-content .favorites-grid{
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    /* The room weather pill must not fall back to HA's neutral secondary background. */
    .global-header.room-context .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header.room-context .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }

    /* Selection lists: icon is always the leading element{
      direction: ltr !important;
      display: grid !important;
      grid-template-columns: 46px minmax(0, 1fr) !important;
      grid-template-areas: "icon content" !important;
      align-items: center !important;
    }

    /* Weather should use the dashboard accent instead of the neutral gray pill. */
    .global-header .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }

    /* Sidebar room tiles: badge overflow follows the continuously calculated width. */
    @media (min-width: 769px) {
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        grid-template-columns: none !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }
    }

    /* 2026-10-01: final responsive room-view overrides. */
    @media (min-width: 769px) {

      /* Sidebar room tiles scale with their actual width. */
      .sidebar .room-area-button{
        container-type: inline-size !important;
        grid-template-columns: clamp(64px, 30cqw, 110px) minmax(0, 1fr) !important;
        min-height: clamp(82px, 36cqw, 120px) !important;
        height: clamp(82px, 36cqw, 120px) !important;
        gap: clamp(8px, 3cqw, 12px) !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: clamp(28px, 11cqw, 42px) !important;
      }

      /* The TS calculation controls how many badges fit; CSS no longer caps the row. */
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }

      /* Keep weather/time and favorites aligned to the right edge. */
      .global-header.room-context .header-time-weather{
        margin-left: auto !important;
        justify-self: end !important;
      }

      .global-header.room-context .room-favorites-content .favorites-grid{
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    /* Weather must keep the accent treatment; later room-specific rules must not turn it gray. */
    .global-header.room-context .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header.room-context .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }


    /* 2026-10-02: refine room tile proportions and unify weather styling. */
    @media (min-width: 769px) {
      /*
       * Room-header metric pills: keep the larger{
        gap: 8px !important;
      }

      /*
       * Sidebar room tiles: make the card less cramped,
but keep the media
       * slot fixed so resizing the sidebar never changes the room icon size.
       */
      .sidebar .room-area-button{
        container-type: normal !important;
        display: grid !important;
        grid-template-columns: 74px minmax(0, 1fr) !important;
        align-items: stretch !important;
        gap: 9px !important;
        min-height: 88px !important;
        height: 88px !important;
        padding: 7px !important;
      }

      .sidebar .room-area-button .area-media{
        grid-column: 1 !important;
        grid-row: 1 !important;
        width: 74px !important;
        height: 74px !important;
        min-width: 74px !important;
        min-height: 74px !important;
        max-width: 74px !important;
        max-height: 74px !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-media-icon{
        width: 74px !important;
        height: 74px !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 31px !important;
      }

      /*
       * Three rows next to the fixed icon:
       * 1. room name
       * 2. temperature / humidity / power
       * 3. status badges
       *
       * Equal 4px gaps above and below the values row keep the stack balanced.
       */
      .sidebar .room-area-button .area-content{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        width: 100% !important;
        height: 74px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: stretch !important;
        gap: 4px !important;
        overflow: hidden !important;
      }

      .sidebar .room-area-button .area-top-section{
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        display: contents !important;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        min-width: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        color: var(--primary-text-color) !important;
        text-shadow: none !important;
        font-size: 14px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        min-width: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        color: var(--secondary-text-color) !important;
        text-shadow: none !important;
        font-size: 11px !important;
        font-weight: 650 !important;
        line-height: 1 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static !important;
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 4px !important;
        overflow: hidden !important;
      }

      /*
       * Sidebar badges: slightly larger than the previous version,
with the
       * icon and count centered together.
       */
      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 24px !important;
        height: 18px !important;
        padding: 0 5px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        font-size: 9.5px !important;
        line-height: 1 !important;
        flex: 0 0 auto !important;
        box-sizing: border-box !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 10px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9.5px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 15px !important;
        width: 15px !important;
        min-width: 15px !important;
        height: 18px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      /*
       * Startseite and room-view weather use the same compact blue-accent pill.
       */
      .global-header .weather-compact,
.global-header.room-context .weather-compact{
        min-height: 38px !important;
        height: 38px !important;
        padding: 0 12px !important;
        gap: 7px !important;
        border-radius: 999px !important;
        box-sizing: border-box !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
      }

      .global-header .weather-compact .weather-icon-compact ha-icon,
.global-header.room-context .weather-compact .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px !important;
        color: var(--primary-color) !important;
      }

      .global-header .weather-compact .weather-temp-compact,
.global-header.room-context .weather-compact .weather-temp-compact{
        font-size: 13px !important;
        color: var(--primary-text-color) !important;
        line-height: 1 !important;
      }

      /*
       * Keep the corrected favorites icon column so favorite names cannot
       * overlap their icons.
       */
      .room-favorites-content .favorites-grid{
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 8px !important;
        width: 100% !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        grid-template-columns: 41px minmax(0, 1fr) auto !important;
      }

      .home-favorites-section .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 41px !important;
        height: 41px !important;
      }

      .home-favorites-section .favorite-icon ha-icon,
.room-favorites-content .favorite-icon ha-icon{
        --mdc-icon-size: 22px !important;
      }

      .home-favorites-section .favorite-body,
.room-favorites-content .favorite-body{
        height: 41px !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }

      .home-favorites-section .favorite-name,
.room-favorites-content .favorite-name{
        min-width: 0 !important;
        max-width: 100% !important;
        font-size: 12.1px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta,
.home-favorites-section .favorite-area,
.room-favorites-content .favorite-area{
        min-width: 0 !important;
        max-width: 100% !important;
        font-size: 10.9px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
    }

    /*
     * 2026-10-01 mobile Home parity pass.
     * Match the desktop component rhythm while retaining mobile rail/grid switching.
     */
    @media (max-width: 768px) {
      .home-status-section .home-status-grid{
        display: flex !important;
        align-items: stretch !important;
        gap: 10px !important;
        margin: 0 !important;
        padding: 2px 18px 16px !important;
        overflow-x: auto !important;
        overflow-y: visible !important;
        scroll-padding: 18px !important;
        scroll-snap-type: x proximity !important;
        scrollbar-width: none !important;
      }

      .home-status-section .home-status-grid::-webkit-scrollbar{
        display: none !important;
      }

      .home-status-section.layout-grid .home-status-grid{
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        align-items: stretch !important;
        gap: 10px !important;
        overflow: visible !important;
        scroll-snap-type: none !important;
      }

      .home-status-section .home-status-card.compact-status{
        flex: 0 0 118px !important;
        width: 118px !important;
        min-width: 118px !important;
        min-height: 102px !important;
        padding: 12px !important;
        border-radius: 15px !important;
      }

      .home-status-section.layout-grid .home-status-card.compact-status{
        width: 100% !important;
        min-width: 0 !important;
        min-height: 100px !important;
        flex: none !important;
      }

      .home-status-section .home-status-card.house-persons-card,
.home-status-section .home-status-card.house-climate-card,
.home-status-section .home-status-card.house-power-card{
        flex: 0 0 238px !important;
        width: 238px !important;
        min-width: 238px !important;
        min-height: 124px !important;
        padding: 13px !important;
      }

      .home-status-section.layout-grid .home-status-card.house-persons-card,
.home-status-section.layout-grid .home-status-card.house-climate-card,
.home-status-section.layout-grid .home-status-card.house-power-card{
        grid-column: 1 / -1 !important;
        width: 100% !important;
        min-width: 0 !important;
        flex: none !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-icon{
        width: 38px !important;
        height: 38px !important;
        margin-bottom: 10px !important;
        border-radius: 11px !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-icon ha-icon{
        --mdc-icon-size: 20px !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-title{
        font-size: 13px !important;
        line-height: 1.12 !important;
      }

      .mobile-area-card{
        flex-basis: 148px !important;
        min-height: 116px !important;
        height: 116px !important;
        padding: 12px !important;
        border-radius: 16px !important;
      }

      .mobile-area-card.has-picture{
        min-height: 116px !important;
        height: 116px !important;
      }

      .mobile-home-section.layout-grid .mobile-area-card{
        height: 118px !important;
        min-height: 118px !important;
      }

      .mobile-area-icon{
        width: 38px !important;
        height: 38px !important;
        border-radius: 12px !important;
      }

      .mobile-area-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .mobile-area-badges{
        display: grid !important;
        grid-template-columns: repeat(2, var(--mobile-area-badge-width, max-content)) !important;
        grid-auto-rows: 22px !important;
        justify-content: end !important;
        align-content: start !important;
        gap: 4px !important;
        max-width: 82px !important;
        overflow: visible !important;
      }

      .mobile-area-badge{
        box-sizing: border-box;
        width: var(--mobile-area-badge-width, auto) !important;
        min-width: 22px !important;
        height: 22px !important;
        padding: var(--mobile-area-badge-padding, 0 6px) !important;
        gap: 3px !important;
        font-size: 10px !important;
      }

      .mobile-area-badge ha-icon{
        --mdc-icon-size: 13px !important;
      }

      .mobile-area-name{
        font-size: 14px !important;
      }

      .mobile-area-meta{
        margin-top: 3px !important;
        font-size: 11px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        display: grid !important;
        grid-template-columns: 38px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: start !important;
        gap: 9px !important;
        height: 104px !important;
        min-height: 104px !important;
        padding: 12px !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorite-icon{
        grid-column: 1 !important;
        grid-row: 1 !important;
        width: 38px !important;
        height: 38px !important;
        align-self: start !important;
        margin: 0 !important;
      }

      .home-favorites-section .favorite-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .home-favorites-section .favorite-body{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        align-self: start !important;
        padding-top: 1px !important;
      }

      .home-favorites-section .favorite-end{
        grid-column: 3 !important;
        grid-row: 1 !important;
        align-self: start !important;
        justify-self: end !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .home-favorites-section .favorite-name{
        margin-top: 0 !important;
        font-size: 14px !important;
        line-height: 1.08 !important;
      }

      .home-favorites-section .favorite-area{
        margin-top: 5px !important;
        font-size: 10px !important;
      }

      .sidebar .room-area-button{
        display: grid !important;
        grid-template-columns: 54px minmax(0, 1fr) !important;
        align-items: center !important;
        gap: 12px !important;
        min-height: 78px !important;
        height: 78px !important;
        padding: 10px 12px !important;
        border-radius: 12px !important;
        overflow: visible !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        position: relative !important;
        width: 54px !important;
        height: 54px !important;
        min-width: 54px !important;
        min-height: 54px !important;
        left: auto !important;
        top: auto !important;
        transform: none !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 26px !important;
      }

      .sidebar .room-area-button .area-content{
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 8px !important;
        min-width: 0 !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-top-section{
        grid-column: 1 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-name{
        margin: 0 !important;
        font-size: 15px !important;
        line-height: 1.08 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-sensors{
        margin-top: 5px !important;
        font-size: 11.5px !important;
        line-height: 1.05 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-info-badges{
        position: relative !important;
        grid-column: 2 !important;
        grid-row: 1 !important;
        display: grid !important;
        grid-template-columns: repeat(2, max-content) !important;
        grid-auto-rows: 22px !important;
        justify-content: end !important;
        align-content: center !important;
        gap: 4px !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        overflow: visible !important;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 25px !important;
        height: 22px !important;
        padding: 0 7px !important;
        gap: 3px !important;
        font-size: 10.5px !important;
        box-sizing: border-box !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 13px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10.5px !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        min-width: 22px !important;
        width: 22px !important;
        height: 22px !important;
        font-size: 16px !important;
      }

      .sidebar .room-area-button .area-menu-chevron{
        display: none !important;
      }
    }


    @media (min-width: 769px) {
      /*
       * Final sizing pass:
       * - sidebar room content grows slightly while remaining inside the
       *   fixed media tile;
       * - room-view header and all of its contents grow by roughly 10%;
       * - the weather pill uses the same explicit treatment on Home and rooms.
       */
      .sidebar .room-area-button{
        grid-template-columns: 74px minmax(0, 1fr) !important;
        min-height: 88px !important;
        height: 88px !important;
        gap: 9px !important;
        padding: 7px !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 74px !important;
        height: 74px !important;
        min-width: 74px !important;
        min-height: 74px !important;
        max-width: 74px !important;
        max-height: 74px !important;
      }

      .sidebar .room-area-button .area-content{
        width: 100% !important;
        height: 74px !important;
        gap: 4px !important;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 15px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        font-size: 11.5px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 27px !important;
        height: 20px !important;
        padding: 0 6px !important;
        gap: 3px !important;
        font-size: 10px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10px !important;
      }

      /*
       * Room header: increase the current responsive geometry by about 10%.
       * Keep the same proportions between media,
copy{
        grid-template-columns: clamp(165px, 22cqw, 242px) minmax(0, 1fr) auto auto !important;
        min-height: clamp(106px, 12.1cqw, 128px) !important;
      }

      /*
       * Explicitly scope the weather treatment to the actual header/time
       * container as well. This prevents the Home weather pill from falling
       * back to the generic gray .weather-compact styling.
       */
      .global-header .header-time-weather .weather-compact{
        min-height: 38px !important;
        height: 38px !important;
        padding: 0 12px !important;
        gap: 7px !important;
        border-radius: 999px !important;
        box-sizing: border-box !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
      }

      .global-header .header-time-weather .weather-compact .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px !important;
        color: var(--primary-color) !important;
      }

      .global-header .header-time-weather .weather-compact .weather-temp-compact{
        font-size: 13px !important;
        line-height: 1 !important;
        color: var(--primary-text-color) !important;
      }
    }

    
    /* 2026-10-03: restore stable desktop room geometry and final responsive overrides. */
    @media (min-width: 769px) {

      /* Sidebar room content should nearly fill the height of the media tile. */
      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 16px !important;
        line-height: 1.08 !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        font-size: 13px !important;
        line-height: 1.12 !important;
        margin-top: 2px !important;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 29px !important;
        height: 22px !important;
        padding: 0 6px !important;
        gap: 3px !important;
        font-size: 11px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 12px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 11px !important;
      }

    }


    /*
     * FINAL compact desktop room-header geometry.
     * One 132px band: image, camera and complete metric stack align exactly.
     */
    @media (min-width: 769px) {

      .dd-page-card,
.dd-page-card > *,
.dd-page-card dwains-dashboard-next-card-host{
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
    }

    ${roomAreaStyles}

    ${pageHeaderStyles}

    /* Room header: exact v1.11.0 header styling with only the two requested structural deviations. */
    .dd-page-header-with-media{
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 18px;
      align-items: stretch;
      min-width: 0;
    }

    .dd-page-header-media-tile{
      position: relative;
      width: 220px;
      height: auto;
      min-height: 0;
      max-height: none;
      align-self: stretch;
      overflow: hidden;
      border-radius: 14px;
      background: color-mix(in srgb, var(--ph-accent) 10%, var(--ph-surface));
    }

    .dd-page-header-room-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .dd-page-header-room-icon{
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--ph-accent) 14%, var(--ph-surface));
      color: var(--ph-accent);
    }

    .dd-page-header-room-icon ha-icon{
      --mdc-icon-size: 52px;
    }

    .dd-page-header-main{
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 14px;
      padding-top: 0;
      box-sizing: border-box;
    }

    .dd-page-header-title-row{
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dd-page-header-title-row .dd-page-header-title{
      min-width: 0;
    }

    .dd-page-header-home{
      width: 36px;
      height: 36px;
    }

    .dd-page-header-home ha-icon{
      --mdc-icon-size: 21px;
    }


    /* 2026-10-06 room-view alignment follow-up.
       The room content scrolls with a reserved scrollbar gutter, while the global
       header does not. Reserve the same space on the header's right side so its
       status rail and Favorites end on the same visual edge as the room cards. */
    @media (min-width: 769px) {
      .global-header.room-context{
        padding-left: 16px !important;
        padding-right: 32px !important;
      }

      .global-header.room-context .header-content,
      .global-header.room-context .room-favorites-block{
        width: 100% !important;
        max-width: 1400px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .header-status-section{
        overflow: hidden !important;
      }

      .global-header.room-context .header-status-scroll{
        padding-inline: 0 !important;
        scroll-padding-inline: 0 !important;
      }

      .global-header.room-context .header-status-section.can-scroll-left .header-status-scroll{
        padding-left: 20px !important;
        scroll-padding-left: 20px !important;
      }

      .global-header.room-context .header-status-section.can-scroll-right .header-status-scroll{
        padding-right: 20px !important;
        scroll-padding-right: 20px !important;
      }

      .global-header.room-context .header-status-scroll-button-left{
        left: 2px !important;
      }

      .global-header.room-context .header-status-scroll-button-right{
        right: 2px !important;
      }

      .global-header.room-context .status-card-compact{
        width: max-content !important;
        min-width: 140px !important;
        max-width: none !important;
        grid-template-columns: 32px max-content !important;
      }

      .global-header.room-context .status-card-compact .status-card-title-compact{
        overflow: visible !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
      }

      .global-header.room-context .header-content{
        gap: 8px !important;
      }

      .global-header.room-context .header-time-weather{
        gap: 8px !important;
        transform: none !important;
      }

      .global-header.room-context .header-time-section{
        width: auto !important;
        min-width: 0 !important;
      }

      .global-header.room-context .room-favorites-block,
      .global-header.room-context .room-favorites-content,
      .global-header.room-context .room-favorites-content .favorites-section,
      .global-header.room-context .room-favorites-content .favorites-grid{
        width: 100% !important;
        max-width: none !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .room-global-now-playing{
        width: 100% !important;
        max-width: 1400px !important;
        margin: 10px auto 0 !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .room-global-now-playing > dwains-dashboard-next-now-playing{
        width: 100% !important;
        margin: 0 !important;
      }
    }

    /* 2026-10-05 room/home consistency pass. */
    .favorite-name {
      display: block !important;
      min-width: 0;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: initial !important;
    }

    .dd-page-header-with-media {
      align-items: stretch;
    }

    .dd-page-header-main {
      justify-content: flex-start;
      align-self: stretch;
    }

    .dd-page-header-main .dd-page-header-top {
      align-items: flex-start;
    }

    .dd-page-header-title-row {
      display: flex;
      align-items: center;
      min-height: 26px;
      line-height: 1;
    }

    .dd-page-header-title-row .dd-page-header-title {
      margin: 0;
      align-self: center;
    }

    .dd-page-header-title-row .dd-page-header-home {
      width: 26px;
      height: 26px;
      min-width: 26px;
      padding: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--primary-color);
    }

    .dd-page-header-title-row .dd-page-header-home:hover {
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .dd-page-header-title-row .dd-page-header-home ha-icon {
      --mdc-icon-size: 21px;
      width: 21px;
      height: 21px;
    }

    .dd-page-header-title-chevron {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      color: var(--ph-muted);
      opacity: 0.72;
    }

    .dd-page-header-button > ha-icon,
    .dd-page-header-home > ha-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      margin: 0;
      transform: none;
    }

    .dd-page-header-actions .dd-page-header-button {
      display: inline-grid;
      place-items: center;
    }

    .home-status-secondary-grid.is-only-row {
      margin-top: 0;
      grid-template-columns: none;
      grid-auto-flow: column;
      grid-auto-columns: minmax(130px, 1fr);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .home-status-secondary-grid.is-only-row::-webkit-scrollbar {
      display: none;
    }

    .home-todos-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 420px));
      justify-content: start;
    }

    .home-custom-cards-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      justify-content: start;
    }

    .home-custom-card.is-wide {
      grid-column: span 2;
    }

    .dd-custom-grid > .dd-custom-card-wrap {
      --dd-card-default-column: span 3;
    }

    .dd-custom-grid > .dd-custom-card-wrap.dd-grid-wide {
      --dd-card-default-column: span 6;
    }

    .home-todo-card,
    .home-custom-card,
    .area-view .mobile-todo-list-card,
    .area-view .mobile-entity-replacement-card,
    .dd-custom-card-wrap {
      font-family: var(--ha-font-family-body, inherit);
      font-size: 13px;
      line-height: 1.3;
      --ha-card-header-font-size: 15px;
      --ha-font-size-l: 15px;
      --ha-font-size-m: 13px;
      --ha-font-size-s: 11px;
    }

    @media (min-width: 769px) {
      .area-view .mobile-todo-list-card {
        grid-column: span 2 !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        flex: none !important;
      }

      .room-favorites-content .favorites-grid {
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 768px) {
      .dd-room-compact .dd-page-header-home {
        width: 38px;
        height: 38px;
        min-width: 38px;
        border-radius: 999px;
        background: var(--ph-control);
        color: var(--ph-text);
      }

      .dd-room-compact .dd-page-header-home ha-icon {
        --mdc-icon-size: 21px;
        width: 21px;
        height: 21px;
      }

      .home-custom-cards-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .home-custom-card.is-wide {
        grid-column: auto;
      }

      .area-view .mobile-todo-list-card {
        grid-column: 1 / -1 !important;
      }
    }

    /* Sidebar room content: keep the established tile/media geometry
       and use a compact, vertically centered copy stack. */
    @media (min-width: 769px) {
      .sidebar .room-area-button .area-content {
        height: 100% !important;
        min-height: 0 !important;
        align-self: stretch !important;
        justify-content: center !important;
        gap: 0 !important;
      }

      .sidebar .room-area-button .area-top-section {
        margin: 0 !important;
        gap: 0 !important;
      }

      .sidebar .room-area-button .area-sensors {
        margin-top: 2px !important;
      }

      .sidebar .room-area-button .area-info-badges {
        margin-top: 6px !important;
        gap: 5px !important;
      }

      .sidebar .room-area-button .info-badge {
        min-width: 31px !important;
        height: 26px !important;
        padding: 0 7px !important;
        font-size: 12px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon {
        --mdc-icon-size: 15px !important;
      }

      .sidebar .room-area-button .badge-count {
        font-size: 12px !important;
      }
    }

    /* Final mobile room sizing: make the entity list about 10% larger without
       changing the desktop room grid. */
    @media (max-width: 768px) {
      .area-view .mobile-domain-title-label,
      .mobile-domain-title-label {
        font-size: 20px;
      }

      .area-view .mobile-domain-count,
      .mobile-domain-count {
        font-size: 13px;
      }

      .mobile-domain-header {
        margin-bottom: 11px;
      }

      .mobile-domain-title {
        gap: 9px;
      }

      .mobile-layout-toggle {
        width: 33px;
        height: 33px;
      }

      .mobile-layout-toggle ha-icon {
        --mdc-icon-size: 19px;
      }

      .mobile-domain-master {
        min-width: 64px;
        height: 33px;
        padding: 0 6px 0 8px;
        gap: 7px;
      }

      .mobile-domain-master ha-icon {
        --mdc-icon-size: 18px;
      }

      .mobile-domain-master-track {
        width: 29px;
        height: 18px;
      }

      .mobile-domain-master-track::after {
        top: 3px;
        left: 3px;
        width: 12px;
        height: 12px;
      }

      .mobile-domain-master.active .mobile-domain-master-track::after {
        transform: translateX(11px);
      }

      .mobile-domain-master-actions {
        height: 33px;
      }

      .mobile-domain-master-action {
        width: 37px;
        height: 33px;
      }

      .mobile-domain-master-action ha-icon {
        --mdc-icon-size: 19px;
      }

      .mobile-entity-card {
        flex-basis: 180px;
        min-height: 141px;
        padding: 15px;
      }

      .mobile-entities-section.layout-grid .mobile-entity-tile-host {
        min-height: 0;
        padding: 0;
      }

      .mobile-entity-status {
        font-size: 12px;
      }

      .mobile-entity-select select {
        height: 37px;
        font-size: 13px;
        line-height: 37px;
      }

      .mobile-entity-select ha-icon {
        --mdc-icon-size: 20px;
      }

      .home-favorites-section.layout-grid {
        width: auto;
        max-width: none;
      }
    }

    /* Final mobile house-power popup shell: same visual system as Home Information dialogs. */
    @media (max-width: 768px) {

      .house-power-dialog-energy-link {
        grid-column: 2 !important;
        grid-row: 2 !important;
        justify-self: start !important;
        width: auto !important;
        min-height: 30px !important;
        margin: 0 !important;
        padding: 0 10px !important;
        font-size: 11px !important;
      }

      .house-power-dialog-energy-link span {
        display: inline !important;
      }

      .house-power-dialog-overview,
      .house-power-dialog-areas {
        margin-left: 12px !important;
        margin-right: 12px !important;
      }

      .house-power-dialog-overview {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 10px !important;
        margin-bottom: 10px !important;
      }

      .house-power-dialog-overview-card,
      .house-power-dialog-area {
        padding: 11px !important;
        border-radius: 12px !important;
      }

      .house-power-statistics-card {
        min-height: 112px !important;
      }
    }

    @media (max-width: 768px) {
      /* Compact energy presentation: same visual density as the other Home Information popups. */
      .house-power-dialog-overview-card {
        padding: 10px !important;
        border-radius: 12px !important;
        background: var(--card-background-color) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
        box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
      }

      .house-power-dialog-overview-head {
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        gap: 9px !important;
      }

      .house-power-dialog-overview-icon {
        width: 36px !important;
        height: 36px !important;
        border-radius: 9px !important;
      }

      .house-power-dialog-overview-head strong {
        font-size: 13px !important;
      }

      .house-power-dialog-overview-head small {
        margin-top: 2px !important;
        font-size: 10px !important;
      }

      .house-power-dialog-overview-head b {
        font-size: 18px !important;
      }

      .house-power-statistics-card {
        min-height: 112px !important;
        height: auto !important;
        margin-top: 8px !important;
        overflow: visible !important;
      }

      .house-power-dialog-area {
        padding: 9px 10px !important;
        border-radius: 12px !important;
        background: var(--card-background-color) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
        box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
      }

      .house-power-dialog-area-head {
        grid-template-columns: 32px minmax(0, 1fr) auto !important;
        gap: 8px !important;
      }

      .house-power-dialog-area-icon {
        width: 32px !important;
        height: 32px !important;
      }

      .house-power-dialog-entities {
        margin-left: 0 !important;
        margin-top: 7px !important;
      }

      .house-power-dialog-entity.detailed {
        min-height: 44px !important;
        padding: 5px 7px !important;
      }
    }


    @media (max-width: 768px) {

      .house-power-dialog-energy-link {
        grid-column: 2 !important;
        grid-row: 2 !important;
        justify-self: start !important;
        width: auto !important;
        min-height: 30px !important;
        margin: 0 !important;
        padding: 0 10px !important;
        border-radius: 999px !important;
        font-size: 11px !important;
      }

      .house-power-dialog-content {
        padding: 12px 12px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
        box-sizing: border-box !important;
        background: var(--primary-background-color) !important;
      }

      .house-power-dialog-overview,
      .house-power-dialog-areas {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }

    .notifications-actions {
      gap: 7px !important;
    }

    .notifications-icon-button {
      width: 38px !important;
      height: 38px !important;
      background: transparent !important;
      color: var(--primary-text-color) !important;
      transition: background-color .16s ease, color .16s ease, transform .16s ease;
    }

    .notifications-icon-button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
    }

    .notifications-icon-button.destructive {
      color: var(--error-color, #db4437) !important;
    }

    .notifications-icon-button.refresh {
      color: var(--primary-color) !important;
    }

    .notifications-icon-button.close {
      color: var(--primary-text-color) !important;
    }

    .notifications-icon-button ha-icon {
      --mdc-icon-size: 20px !important;
    }

    .notifications-list {
      padding: 12px !important;
      background: var(--primary-background-color) !important;
    }

    .notification-row {
      padding: 11px !important;
      border-radius: 10px !important;
      background: var(--card-background-color) !important;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
      box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
    }

    .notification-dismiss {
      width: 34px !important;
      height: 34px !important;
      color: var(--error-color, #db4437) !important;
      background: transparent !important;
    }

    .notification-dismiss:hover {
      background: color-mix(in srgb, var(--error-color, #db4437) 9%, transparent) !important;
    }

    .notification-dismiss ha-icon {
      --mdc-icon-size: 18px !important;
    }

    @media (max-width: 768px) {

      .notifications-list {
        padding: 12px 12px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .notifications-actions {
        gap: 3px !important;
      }

      .notifications-icon-button {
        width: 36px !important;
        height: 36px !important;
      }

      .notification-row {
        grid-template-columns: 38px minmax(0, 1fr) 34px !important;
        gap: 9px !important;
      }
    }





  `, pageHeaderStyles, roomAreaStyles];

  connectedCallback() {
    super.connectedCallback();
    this._syncThemeAttribute();
    this._loadMobileEntityLayoutPreference();
    this._loadAreaSidebarWidthPreference();
    this._loadAreaSidebarCollapsedPreference();
    this._checkMobile();
    this._setupEventListeners();
    window.addEventListener('dwains-dashboard-next-toggle-area-nav', this._handleAreaNavToggle);
    window.addEventListener('dwains-dashboard-next-mobile-nav-sheet', this._handleMobileNavSheet as EventListener);
    window.addEventListener('dwains-dashboard-next-open-settings', this._handleOpenSettingsEvent);
    window.addEventListener('dwains-dashboard-next-open-home', this._handleOpenHomeEvent);
    this._startTimeUpdate();
    this._initializeObservers();
    makeDialogManager(this);
    requestAnimationFrame(() => this._restorePendingRoomDragScroll());
    window.setTimeout(() => this._restorePendingRoomDragScroll(), 120);
    window.setTimeout(() => this._restorePendingRoomDragScroll(), 420);
  }

  protected override willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);

    if (changedProps.has('config') && this.hass) {
      this._clearEntityCardsCache();
      ensureBottomNav(this.hass, this.config?.settings);
      if (!this._canManageDashboard() && this._editMode) {
        this._editMode = false;
        this._rememberAreaEditMode(null);
      }
    }

    // Handle hass updates for live entity state changes
    if (changedProps.has('hass') && this.hass) {
      this._syncThemeAttribute();
      // Houd de mobiele onderbalk levend en up-to-date.
      ensureBottomNav(this.hass, this.config?.settings);
      this._syncBottomNavAreaContext();
      this._reconcileOptimisticEntityStates();
      if (!this._canManageDashboard() && this._editMode) {
        this._editMode = false;
        this._rememberAreaEditMode(null);
      }

      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass && this._shouldUpdateEntities(oldHass, this.hass)) {
        this._invalidateChangedAreaCaches(oldHass, this.hass);
      }
    }
  }

  private _scheduleHeaderStatusScrollState(): void {
    if (this._headerStatusScrollRaf !== undefined) {
      cancelAnimationFrame(this._headerStatusScrollRaf);
    }

    this._headerStatusScrollRaf = requestAnimationFrame(() => {
      this._headerStatusScrollRaf = undefined;
      this._updateHeaderStatusScrollState();
    });
  }

  private _updateHeaderStatusScrollState(): void {
    const scrollContainer = this.shadowRoot?.querySelector('.header-status-scroll') as HTMLElement | null;
    if (!scrollContainer) {
      if (this._headerStatusCanScrollLeft || this._headerStatusCanScrollRight) {
        this._headerStatusCanScrollLeft = false;
        this._headerStatusCanScrollRight = false;
      }
      return;
    }

    const maxScrollLeft = Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth);
    const canScrollLeft = scrollContainer.scrollLeft > 1;
    const canScrollRight = scrollContainer.scrollLeft < maxScrollLeft - 1;

    if (this._headerStatusCanScrollLeft !== canScrollLeft) {
      this._headerStatusCanScrollLeft = canScrollLeft;
    }
    if (this._headerStatusCanScrollRight !== canScrollRight) {
      this._headerStatusCanScrollRight = canScrollRight;
    }
  }

  private _handleHeaderStatusScroll = (): void => {
    this._scheduleHeaderStatusScrollState();
  };

  private _handleHeaderStatusWheel = (event: WheelEvent): void => {
    const scrollContainer = event.currentTarget as HTMLElement | null;
    if (!scrollContainer || scrollContainer.scrollWidth <= scrollContainer.clientWidth) return;

    // A vertical mouse wheel should move the horizontal status rail directly.
    // Trackpads that already provide a horizontal delta keep their native axis.
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    }
  };

  private _scrollHeaderStatus(direction: -1 | 1): void {
    const scrollContainer = this.shadowRoot?.querySelector('.header-status-scroll') as HTMLElement | null;
    if (!scrollContainer) return;

    const firstCard = scrollContainer.querySelector('.status-card-compact') as HTMLElement | null;
    if (!firstCard) return;

    const styles = getComputedStyle(scrollContainer);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const cardStep = firstCard.getBoundingClientRect().width + gap;
    const pageStep = Math.max(cardStep, scrollContainer.clientWidth * 0.72);

    scrollContainer.scrollBy({
      left: direction * pageStep,
      behavior: 'smooth',
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('dwains-dashboard-next-toggle-area-nav', this._handleAreaNavToggle);
    window.removeEventListener('dwains-dashboard-next-mobile-nav-sheet', this._handleMobileNavSheet as EventListener);
    window.removeEventListener('dwains-dashboard-next-open-settings', this._handleOpenSettingsEvent);
    window.removeEventListener('dwains-dashboard-next-open-home', this._handleOpenHomeEvent);
    window.removeEventListener('pointermove', this._handleSidebarResizeMove);
    window.removeEventListener('pointerup', this._handleSidebarResizeEnd);
    window.removeEventListener('pointercancel', this._handleSidebarResizeEnd);
    this._persistentNotificationsUnsub?.();
    this._persistentNotificationsUnsub = undefined;
    this._cleanupEventListeners();
    this._cleanupObservers();
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
    }
    if (this._homeSummariesRefreshInterval) {
      clearInterval(this._homeSummariesRefreshInterval);
      this._homeSummariesRefreshInterval = undefined;
    }
    if (this._areaHeaderScrollRaf) {
      cancelAnimationFrame(this._areaHeaderScrollRaf);
      this._areaHeaderScrollRaf = undefined;
    }
    if (this._headerStatusScrollRaf !== undefined) {
      cancelAnimationFrame(this._headerStatusScrollRaf);
      this._headerStatusScrollRaf = undefined;
    }
    if (this._areaSidebarRestoreRaf !== undefined) {
      cancelAnimationFrame(this._areaSidebarRestoreRaf);
      this._areaSidebarRestoreRaf = undefined;
    }
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
    if (this._progressiveRenderCancel) {
      this._progressiveRenderCancel();
      this._progressiveRenderCancel = undefined;
    }
    this._confirmationResolve?.(false);
    this._confirmationResolve = undefined;
    this._confirmationDialog = null;
  }

  private _setupEventListeners() {
    window.addEventListener('resize', this._handleResize);
    window.addEventListener('scroll', this._handleWindowScroll, { passive: true });
    this.addEventListener('show-more-info', this._handleShowMoreInfo);
  }

  private _cleanupEventListeners() {
    window.removeEventListener('resize', this._handleResize);
    window.removeEventListener('scroll', this._handleWindowScroll);
    this.removeEventListener('show-more-info', this._handleShowMoreInfo);
  }

  private _handleResize = () => {
    this._checkMobile();
    if (!this._isMobile) {
      const clampedWidth = this._clampAreaSidebarWidth(this._areaSidebarWidth);
      if (clampedWidth !== this._areaSidebarWidth) {
        this._areaSidebarWidth = clampedWidth;
      }
    }
    this._updateAreaHeaderScrollState();
  };

  private _isDesktopAreaSidebarCollapsed(): boolean {
    return this._areaSidebarCollapsed && !this._isMobile;
  }

  private _handleSidebarScroll = (event: Event) => {
    if (this._isMobile) return;

    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      this._areaSidebarScrollTop = target.scrollTop;
    }
  };

  private _restoreAreaSidebarScroll(): void {
    if (this._isMobile || this._isDesktopAreaSidebarCollapsed()) return;

    if (this._areaSidebarRestoreRaf !== undefined) {
      cancelAnimationFrame(this._areaSidebarRestoreRaf);
    }

    this._areaSidebarRestoreRaf = requestAnimationFrame(() => {
      this._areaSidebarRestoreRaf = undefined;
      const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLElement | null;
      if (!sidebar) return;

      const maxScrollTop = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
      const nextScrollTop = Math.min(this._areaSidebarScrollTop, maxScrollTop);
      if (Math.abs(sidebar.scrollTop - nextScrollTop) > 1) {
        sidebar.scrollTop = nextScrollTop;
      }
    });
  }

  private _handleContentScroll = (event: Event) => {
    if (!this._isMobile || this._selectedView !== 'area') {
      if (this._areaHeaderStuck) this._areaHeaderStuck = false;
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || target?.scrollTop || 0;
    this._pendingAreaScrollTop = scrollTop;

    if (this._areaHeaderScrollRaf) return;

    this._areaHeaderScrollRaf = requestAnimationFrame(() => {
      this._areaHeaderScrollRaf = undefined;
      this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop, true);
    });
  };

  private _handleWindowScroll = () => {
    if (!this._isMobile || this._selectedView !== 'area') return;

    this._pendingAreaScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (this._areaHeaderScrollRaf) return;

    this._areaHeaderScrollRaf = requestAnimationFrame(() => {
      this._areaHeaderScrollRaf = undefined;
      this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop, true);
    });
  };

  private _restorePendingRoomDragScroll(): boolean {
    if (this._selectedView !== 'area' || !this._selectedArea) return false;

    let snapshot: {
      areaId: string;
      pathname: string;
      contentScrollTop: number;
      windowScrollX: number;
      windowScrollY: number;
      expiresAt: number;
    } | null = null;

    try {
      const raw = window.sessionStorage.getItem('dd-next-room-dnd-scroll');
      if (raw) snapshot = JSON.parse(raw);
    } catch {
      return false;
    }

    if (
      !snapshot ||
      snapshot.expiresAt < Date.now() ||
      snapshot.areaId !== this._selectedArea ||
      snapshot.pathname !== window.location.pathname
    ) {
      try { window.sessionStorage.removeItem('dd-next-room-dnd-scroll'); } catch {}
      return false;
    }

    const restore = () => {
      const contentArea = this.shadowRoot?.querySelector('.content-area') as HTMLElement | null;
      if (contentArea && Math.abs(contentArea.scrollTop - snapshot!.contentScrollTop) > 1) {
        contentArea.scrollTop = snapshot!.contentScrollTop;
      }
      if (
        Math.abs(window.scrollX - snapshot!.windowScrollX) > 1 ||
        Math.abs(window.scrollY - snapshot!.windowScrollY) > 1
      ) {
        window.scrollTo(snapshot!.windowScrollX, snapshot!.windowScrollY);
      }
    };

    requestAnimationFrame(restore);
    window.setTimeout(restore, 90);
    window.setTimeout(restore, 240);
    window.setTimeout(restore, 600);
    window.setTimeout(restore, 1200);
    window.setTimeout(() => {
      restore();
      try { window.sessionStorage.removeItem('dd-next-room-dnd-scroll'); } catch {}
    }, 1800);

    return true;
  }

  private _scrollContentAreaToTop(): void {
    const scrollContainer = this.shadowRoot?.querySelector('.content-area') as HTMLElement | null;
    const scrollTargets = new Set<HTMLElement>();

    if (scrollContainer) {
      scrollTargets.add(scrollContainer);
    }

    const addScrollableAncestors = (start: Node | null) => {
      let node: Node | null = start;

      while (node) {
        if (node instanceof HTMLElement) {
          scrollTargets.add(node);
        }

        if (node.parentNode) {
          node = node.parentNode;
          continue;
        }

        const root = node.getRootNode();
        node = root instanceof ShadowRoot ? root.host : null;
      }
    };

    addScrollableAncestors(scrollContainer || this);

    for (const target of scrollTargets) {
      target.scrollTop = 0;
      target.scrollLeft = 0;
    }

    const scrollingElement = document.scrollingElement as HTMLElement | null;
    if (scrollingElement) {
      scrollingElement.scrollTop = 0;
      scrollingElement.scrollLeft = 0;
    }

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
    window.scrollTo(0, 0);
  }

  private _resetAreaHeaderScrollState(scrollToTop = false): void {
    if (this._areaHeaderScrollRaf) {
      cancelAnimationFrame(this._areaHeaderScrollRaf);
      this._areaHeaderScrollRaf = undefined;
    }
    if (scrollToTop) {
      this._scrollContentAreaToTop();
    }
    this._pendingAreaScrollTop = 0;
    if (this._areaHeaderStuck) this._areaHeaderStuck = false;
    if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
    this._lastAreaScrollTop = 0;
    this._areaScrollUpDistance = 0;
  }

  private _resetAreaHeaderAfterNavigation(): void {
    if (this._restorePendingRoomDragScroll()) return;
    this._resetAreaHeaderScrollState(true);
    requestAnimationFrame(() => {
      if (!this._restorePendingRoomDragScroll()) this._resetAreaHeaderScrollState(true);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!this._restorePendingRoomDragScroll()) this._resetAreaHeaderScrollState(true);
    }));
    window.setTimeout(() => {
      if (!this._restorePendingRoomDragScroll()) this._resetAreaHeaderScrollState(true);
    }, 80);
    window.setTimeout(() => {
      if (!this._restorePendingRoomDragScroll()) this._resetAreaHeaderScrollState(true);
    }, 220);
  }

  private _resetProgressiveMobileRender(): void {
    this._renderAllMobileHomeAreas = !this._isMobile;
    this._renderAllMobileAreaEntities = !this._isMobile;

    if (this._progressiveRenderCancel) {
      this._progressiveRenderCancel();
      this._progressiveRenderCancel = undefined;
    }
  }

  private _scheduleProgressiveMobileRender(): void {
    if (!this._isMobile) {
      this._renderAllMobileHomeAreas = true;
      this._renderAllMobileAreaEntities = true;
      return;
    }

    if (this._renderAllMobileHomeAreas && this._renderAllMobileAreaEntities) return;
    if (this._progressiveRenderCancel) return;

    const renderRest = () => {
      this._progressiveRenderCancel = undefined;
      this._renderAllMobileHomeAreas = true;
      this._renderAllMobileAreaEntities = true;
    };
    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: () => void, options?: { timeout: number }) => number)
      | undefined;
    const cancelIdle = (window as any).cancelIdleCallback as
      | ((handle: number) => void)
      | undefined;

    if (requestIdle && cancelIdle) {
      const handle = requestIdle(renderRest, { timeout: 450 });
      this._progressiveRenderCancel = () => cancelIdle(handle);
    } else {
      const handle = window.setTimeout(renderRest, 90);
      this._progressiveRenderCancel = () => window.clearTimeout(handle);
    }
  }

  private _updateAreaHeaderScrollState(): void {
    const scrollContainer = this.shadowRoot?.querySelector('.content-area') as HTMLElement | null;
    if (!this._isMobile || this._selectedView !== 'area' || !scrollContainer) {
      if (this._areaHeaderStuck) this._areaHeaderStuck = false;
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      return;
    }
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || scrollContainer.scrollTop || 0;
    this._setAreaHeaderStuckForScroll(scrollTop, false);
  }

  private _setAreaHeaderStuckForScroll(scrollTop: number, fromScroll: boolean): void {
    if (!this._isMobile || this._selectedView !== 'area') {
      if (this._areaHeaderStuck) this._areaHeaderStuck = false;
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      this._lastAreaScrollTop = 0;
      this._areaScrollUpDistance = 0;
      return;
    }

    if (!fromScroll) {
      this._lastAreaScrollTop = scrollTop;
      this._areaScrollUpDistance = 0;
      const shouldStick = scrollTop > AREA_HEADER_STICK_SCROLL;
      if (this._areaHeaderStuck !== shouldStick) {
        this._areaHeaderStuck = shouldStick;
      }
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      return;
    }

    const previousScrollTop = this._lastAreaScrollTop;
    const delta = scrollTop - previousScrollTop;
    this._lastAreaScrollTop = scrollTop;

    if (scrollTop <= 2) {
      this._areaScrollUpDistance = 0;
      if (this._areaHeaderStuck) this._areaHeaderStuck = false;
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      return;
    }

    if (delta < -1) {
      this._areaScrollUpDistance += Math.abs(delta);
    } else if (delta > 1) {
      this._areaScrollUpDistance = 0;
    }

    let shouldStick = this._areaHeaderStuck;
    let shouldReveal = this._areaHeaderRevealed;

    if (delta > 1 && scrollTop > AREA_HEADER_STICK_SCROLL) {
      shouldStick = true;
      shouldReveal = false;
    }

    if (this._areaHeaderStuck && this._areaScrollUpDistance >= 18 && scrollTop > AREA_HEADER_REVEAL_SCROLL) {
      shouldReveal = true;
    }

    if (scrollTop <= AREA_HEADER_UNSTICK_SCROLL) {
      shouldStick = false;
      shouldReveal = false;
    }

    if (this._areaHeaderStuck !== shouldStick) {
      this._areaHeaderStuck = shouldStick;
    }
    if (this._areaHeaderRevealed !== shouldReveal) {
      this._areaHeaderRevealed = shouldReveal;
    }
  }

  private _handleShowMoreInfo = (e: Event) => {
    const event = e as CustomEvent;
    fireEvent(this, 'hass-more-info', { entityId: event.detail.entityId });
  };

  private _checkMobile() {
    const wasMobile = this._isMobile;
    this._isMobile = window.innerWidth <= 768;
    if (wasMobile !== this._isMobile) {
      this._mobileNavOpen = false;
    }
  }

  private _startTimeUpdate() {
    this._updateTime();
    this._timeInterval = window.setInterval(() => this._updateTime(), 60000);
  }

  private _updateTime() {
    const now = new Date();
    this._currentTime = now.toLocaleTimeString(this.hass?.language || 'en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    this._currentDate = now.toLocaleDateString(this.hass?.language || 'en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  private _loadMobileEntityLayoutPreference(): void {
    try {
      const savedEntityLayout = window.localStorage.getItem('dd-next-mobile-entity-layout');
      const savedAreasLayout = window.localStorage.getItem('dd-next-mobile-home-areas-layout');
      const savedDevicesLayout = window.localStorage.getItem('dd-next-mobile-home-devices-layout');
      const savedFavoritesLayout = window.localStorage.getItem('dd-next-mobile-home-favorites-layout');
      const savedCamerasLayout = window.localStorage.getItem('dd-next-mobile-home-cameras-layout');
      if (savedEntityLayout === 'rail' || savedEntityLayout === 'grid') this._mobileEntityLayout = savedEntityLayout;
      if (savedAreasLayout === 'rail' || savedAreasLayout === 'grid') this._mobileHomeAreasLayout = savedAreasLayout;
      if (savedDevicesLayout === 'rail' || savedDevicesLayout === 'grid') this._mobileHomeDevicesLayout = savedDevicesLayout;
      if (savedFavoritesLayout === 'rail' || savedFavoritesLayout === 'grid') this._mobileHomeFavoritesLayout = savedFavoritesLayout;
      if (savedCamerasLayout === 'rail' || savedCamerasLayout === 'grid') this._mobileHomeCamerasLayout = savedCamerasLayout;
    } catch {
      // localStorage can be unavailable in private or restricted contexts.
    }
  }

  private _loadAreaSidebarWidthPreference(): void {
    try {
      const rawWidth = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
      if (!rawWidth) return;

      const width = Number(rawWidth);
      if (Number.isFinite(width)) {
        this._areaSidebarWidth = this._clampAreaSidebarWidth(width);
      }
    } catch {
      // Preference persistence is best-effort only.
    }
  }

  private _saveAreaSidebarWidthPreference(width: number): void {
    try {
      window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(Math.round(width)));
    } catch {
      // Preference persistence is best-effort only.
    }
  }

  private _loadAreaSidebarCollapsedPreference(): void {
    try {
      this._areaSidebarCollapsed = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
      // Preference persistence is best-effort only.
    }
  }

  private _saveAreaSidebarCollapsedPreference(collapsed: boolean): void {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, collapsed ? 'true' : 'false');
    } catch {
      // Preference persistence is best-effort only.
    }
  }

  private _clampAreaSidebarWidth(width: number): number {
    const viewportMax = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.floor(window.innerWidth * 0.46)));
    return Math.round(Math.max(SIDEBAR_MIN_WIDTH, Math.min(viewportMax, width)));
  }

  private _startSidebarResize = (event: PointerEvent): void => {
    if (this._isMobile || event.button !== 0) return;

    event.preventDefault();
    this._sidebarResizePointerId = event.pointerId;
    this._isResizingSidebar = true;
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    window.addEventListener('pointermove', this._handleSidebarResizeMove);
    window.addEventListener('pointerup', this._handleSidebarResizeEnd);
    window.addEventListener('pointercancel', this._handleSidebarResizeEnd);
  };

  private _handleSidebarResizeMove = (event: PointerEvent): void => {
    if (!this._isResizingSidebar || this._isMobile) return;
    if (this._sidebarResizePointerId !== undefined && event.pointerId !== this._sidebarResizePointerId) return;

    const container = this.renderRoot?.querySelector('.layout-container') as HTMLElement | null;
    const left = container?.getBoundingClientRect().left ?? 0;
    const rawWidth = event.clientX - left;
    if (rawWidth <= SIDEBAR_COLLAPSE_THRESHOLD) {
      this._areaSidebarCollapsed = true;
      return;
    }

    if (this._areaSidebarCollapsed) {
      this._areaSidebarCollapsed = false;
    }
    this._areaSidebarWidth = this._clampAreaSidebarWidth(rawWidth);
  };

  private _handleSidebarResizeEnd = (event?: PointerEvent): void => {
    if (!this._isResizingSidebar) return;
    if (
      event &&
      this._sidebarResizePointerId !== undefined &&
      event.pointerId !== this._sidebarResizePointerId
    ) {
      return;
    }

    this._isResizingSidebar = false;
    this._sidebarResizePointerId = undefined;
    this._saveAreaSidebarWidthPreference(this._areaSidebarWidth);
    this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed);
    window.removeEventListener('pointermove', this._handleSidebarResizeMove);
    window.removeEventListener('pointerup', this._handleSidebarResizeEnd);
    window.removeEventListener('pointercancel', this._handleSidebarResizeEnd);
  };

  private _toggleAreaSidebarCollapsed = (event?: Event): void => {
    event?.stopPropagation();
    if (this._isMobile) return;

    this._areaSidebarCollapsed = !this._areaSidebarCollapsed;
    this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed);
    if (!this._areaSidebarCollapsed) {
      this._areaSidebarWidth = this._clampAreaSidebarWidth(this._areaSidebarWidth || SIDEBAR_DEFAULT_WIDTH);
      this._saveAreaSidebarWidthPreference(this._areaSidebarWidth);
    }
  };

  private _handleSidebarResizeKeydown = (event: KeyboardEvent): void => {
    if (this._isMobile) return;

    let nextWidth = this._areaSidebarWidth;
    if (event.key === 'ArrowLeft') {
      nextWidth -= event.shiftKey ? 40 : 20;
    } else if (event.key === 'ArrowRight') {
      nextWidth += event.shiftKey ? 40 : 20;
    } else if (event.key === 'Home') {
      nextWidth = SIDEBAR_MIN_WIDTH;
    } else if (event.key === 'End') {
      nextWidth = SIDEBAR_MAX_WIDTH;
    } else {
      return;
    }

    event.preventDefault();
    this._areaSidebarWidth = this._clampAreaSidebarWidth(nextWidth);
    this._saveAreaSidebarWidthPreference(this._areaSidebarWidth);
  };

  private _toggleMobileEntityLayout = (event?: Event): void => {
    event?.stopPropagation();
    this._mobileEntityLayout = this._mobileEntityLayout === 'rail' ? 'grid' : 'rail';
    try {
      window.localStorage.setItem('dd-next-mobile-entity-layout', this._mobileEntityLayout);
    } catch {
      // Preference persistence is best-effort only.
    }
  };

  private _toggleMobileHomeAreasLayout = (event?: Event): void => {
    event?.stopPropagation();
    this._mobileHomeAreasLayout = this._mobileHomeAreasLayout === 'rail' ? 'grid' : 'rail';
    try {
      window.localStorage.setItem('dd-next-mobile-home-areas-layout', this._mobileHomeAreasLayout);
    } catch {
      // Preference persistence is best-effort only.
    }
  };

  private _toggleMobileHomeDevicesLayout = (event?: Event): void => {
    event?.stopPropagation();
    this._mobileHomeDevicesLayout = this._mobileHomeDevicesLayout === 'rail' ? 'grid' : 'rail';
    try {
      window.localStorage.setItem('dd-next-mobile-home-devices-layout', this._mobileHomeDevicesLayout);
    } catch {
      // Preference persistence is best-effort only.
    }
  };

  private _toggleMobileHomeFavoritesLayout = (event?: Event): void => {
    event?.stopPropagation();
    this._mobileHomeFavoritesLayout = this._mobileHomeFavoritesLayout === 'rail' ? 'grid' : 'rail';
    try {
      window.localStorage.setItem('dd-next-mobile-home-favorites-layout', this._mobileHomeFavoritesLayout);
    } catch {
      // Preference persistence is best-effort only.
    }
  };

  private _toggleMobileHomeCamerasLayout = (event?: Event): void => {
    event?.stopPropagation();
    this._mobileHomeCamerasLayout = this._mobileHomeCamerasLayout === 'rail' ? 'grid' : 'rail';
    try {
      window.localStorage.setItem('dd-next-mobile-home-cameras-layout', this._mobileHomeCamerasLayout);
    } catch {
      // Preference persistence is best-effort only.
    }
  };

  private _initializeObservers() {
    // Resize Observer for responsive updates
    this._resizeObserver = new ResizeObserver(() => {
      this._debouncedUpdate();
    });

    if (this.shadowRoot) {
      this._resizeObserver.observe(this.shadowRoot.host);
    }
  }

  private _cleanupObservers() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  private _hasAreaClimateDisplayMetadataChanges(
    oldHass: HomeAssistant,
    newHass: HomeAssistant
  ): boolean {
    const areaIds = new Set([
      ...Object.keys(oldHass.areas || {}),
      ...Object.keys(newHass.areas || {}),
    ]);

    for (const areaId of areaIds) {
      const oldArea = oldHass.areas?.[areaId] as any;
      const newArea = newHass.areas?.[areaId] as any;
      const oldTemperature = oldArea?.temperature_entity_id;
      const newTemperature = newArea?.temperature_entity_id;
      const oldHumidity = oldArea?.humidity_entity_id;
      const newHumidity = newArea?.humidity_entity_id;

      if (oldTemperature !== newTemperature || oldHumidity !== newHumidity) return true;

      const entityIds = new Set<string>(
        [oldTemperature, newTemperature, oldHumidity, newHumidity].filter(Boolean) as string[]
      );
      for (const entityId of entityIds) {
        const oldEntry = oldHass.entities?.[entityId] as any;
        const newEntry = newHass.entities?.[entityId] as any;
        if (oldEntry?.display_precision !== newEntry?.display_precision) return true;
      }
    }

    return false;
  }

  protected override shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config || !this.hass) return false;

    // Always update for config or view changes
    if (changedProps.has('config') ||
        changedProps.has('_selectedView') ||
        changedProps.has('_selectedArea') ||
        changedProps.has('_headerExpanded') ||
        changedProps.has('_currentTime')) {
      return true;
    }

    // For hass updates, only update if relevant entities changed
    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;

      if (this._hasUpdateEntityChanges(oldHass, this.hass)) return true;
      if (this._hasAreaClimateDisplayMetadataChanges(oldHass, this.hass)) return true;

      // Check if any visible entities changed
      const relevantEntities = this._getRelevantEntities();
      return relevantEntities.some(entityId =>
        oldHass.states[entityId] !== this.hass.states[entityId]
      );
    }

    return true;
  }

  protected override updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    this._scheduleHeaderStatusScrollState();

    // Handle hass updates for live entity state changes
    if (changedProps.has('hass') && this.hass) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass) {
        this._updateEntityCards(oldHass, this.hass);
      }

      // Update favorite tile cards when hass changes
      if (this._headerExpanded) {
        this._renderFavoriteTileCards();
      }

      this._ensurePersistentNotificationsFeature();

      if (!this._homeSummariesLoaded) {
        this._homeSummariesLoaded = true;
        void this._loadHomeAssistantSummaries();
        this._homeSummariesRefreshInterval = window.setInterval(
          () => void this._loadHomeAssistantSummaries(),
          5 * 60 * 1000
        );
      }

      this._ensureFavoriteSuggestionsFeature();
    }

    if (changedProps.has('config')) {
      if (this._showNotificationsUi()) {
        this._ensurePersistentNotificationsFeature();
      } else {
        this._notificationsOpen = false;
        this._persistentNotificationsLoaded = false;
        this._persistentNotifications = [];
      }

      if (!this._showSuggestedFavoritesUi()) {
        this._favoriteSuggestionsLoaded = false;
        this._favoriteSuggestionsLoading = false;
        this._suggestedFavoriteEntities = [];
      } else {
        this._ensureFavoriteSuggestionsFeature();
      }
    }

    if (
      changedProps.has('_selectedView') ||
      changedProps.has('_selectedArea') ||
      changedProps.has('config')
    ) {
      this._syncBottomNavAreaContext();
      this._restoreAreaSidebarScroll();
    }

    if (changedProps.has('_isMobile')) {
      this._restoreAreaSidebarScroll();
    }

    // Render favorite tile cards when header becomes expanded
    if (changedProps.has('_headerExpanded') && this._headerExpanded && this.hass) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        this._renderFavoriteTileCards();
      }, 0);
    }

    if (changedProps.has('_selectedView') || changedProps.has('_selectedArea')) {
      this._resetProgressiveMobileRender();

      if (this._selectedView === 'area') {
        if (!this._restorePendingRoomDragScroll()) {
          this._resetAreaHeaderAfterNavigation();
        }
      } else {
        this._resetAreaHeaderScrollState(false);
      }
    } else if (changedProps.has('config') && this._selectedView === 'area') {
      this._restorePendingRoomDragScroll();
    }

    if (
      changedProps.has('_selectedView') ||
      changedProps.has('_selectedArea') ||
      changedProps.has('_isMobile') ||
      (this._isMobile && (!this._renderAllMobileHomeAreas || !this._renderAllMobileAreaEntities))
    ) {
      this._scheduleProgressiveMobileRender();
    }

    if (this._selectedView === 'settings') {
      this._syncSettingsEditor();
    }
  }

  private _syncThemeAttribute(): void {
    this.toggleAttribute('data-theme-dark', isHassDarkTheme(this.hass, this));
  }

  private _getRelevantEntities(): string[] {
    if (!this.config) return [];

    if (this._selectedView === 'settings') {
      return [];
    }

    if (this._selectedView === 'area' && this._selectedArea) {
      const areaEntities = this._getAreaEntities(this._selectedArea);
      return areaEntities.map(e => e.entity_id);
    }

    // For home view, return entities that affect status counts
    return this.config.entities?.map(e => e.entity_id) || [];
  }

  private _debouncedUpdate = () => {
    if (this._updateDebounceTimer) {
      clearTimeout(this._updateDebounceTimer);
    }
    this._updateDebounceTimer = window.setTimeout(() => {
      this.requestUpdate();
    }, 100);
  };

  render() {
    if (!this.hass || !this.config) {
      return html`<div class="loading">${this._t('common.loading')}</div>`;
    }

    const floatingNowPlaying = this._isMobile && !this._mobileNavOpen && this._getNowPlayingPlayers().length > 0;
    const layoutClasses = {
      'layout-container': true,
      'has-floating-now-playing': floatingNowPlaying,
      'sidebar-resizing': this._isResizingSidebar,
      'sidebar-collapsed': this._isDesktopAreaSidebarCollapsed(),
    };

    return html`
      <div
        class=${classMap(layoutClasses)}
        style=${`--area-sidebar-width: ${this._areaSidebarWidth}px;`}
      >
        ${this._renderSidebar()}
        ${!this._isMobile ? this._renderSidebarResizeHandle() : nothing}
        <div class="main-content">
          ${this._selectedView === 'area' && !this._isMobile ? this._renderGlobalHeader() : nothing}
          <div
            class="content-area ${this._selectedView === 'home' ? 'home-content-area' : ''} ${this._selectedView === 'area' ? 'area-content-area' : ''} ${this._selectedView === 'settings' ? 'settings-content-area' : ''}"
            @scroll=${this._handleContentScroll}
          >
            ${this._selectedView === 'home'
              ? this._renderHomeView()
              : this._selectedView === 'area' && this._selectedArea
                ? this._renderAreaView()
                : this._selectedView === 'settings'
                  ? this._renderSettingsView()
                  : nothing}
          </div>
        </div>
      </div>
      ${floatingNowPlaying ? this._renderNowPlayingBar(true) : nothing}
      ${this._renderToast()}
      ${this._renderConfirmationDialog()}
      ${this._renderHousePowerDialog()}
      ${this._renderNotificationsPanel()}
    `;
  }

  private _renderSidebarResizeHandle() {
    const collapsed = this._isDesktopAreaSidebarCollapsed();

    return html`
      <button
        class="sidebar-collapse-toggle ${collapsed ? 'is-collapsed' : ''}"
        type="button"
        title=${collapsed ? this._t('sidebar.show') : this._t('sidebar.collapse')}
        aria-label=${collapsed ? this._t('sidebar.show') : this._t('sidebar.collapse')}
        @click=${this._toggleAreaSidebarCollapsed}
      >
        <ha-icon icon=${collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}></ha-icon>
      </button>
      ${collapsed ? nothing : html`
      <button
        class="sidebar-resize-handle"
        type="button"
        role="separator"
        aria-label=${this._t('sidebar.resize')}
        aria-orientation="vertical"
        aria-valuemin=${SIDEBAR_MIN_WIDTH}
        aria-valuemax=${SIDEBAR_MAX_WIDTH}
        aria-valuenow=${this._areaSidebarWidth}
        title=${this._t('sidebar.resize_drag')}
        @pointerdown=${this._startSidebarResize}
        @keydown=${this._handleSidebarResizeKeydown}
      ></button>
      `}
    `;
  }


  private _homeNowPlayingEnabled(): boolean {
    const settings = this.config?.settings;
    const explicitlyManaged =
      (settings?.home_sections_order || []).includes('now_playing') ||
      (settings?.home_sections_hidden || []).includes('now_playing');

    if (explicitlyManaged) {
      return !(settings?.home_sections_hidden || []).includes('now_playing');
    }

    return normalizeNowPlayingMode(settings?.now_playing_bar) !== 'off';
  }

  private _areaNowPlayingEnabled(): boolean {
    const settings = this.config?.settings;
    if (settings?.show_area_now_playing !== undefined) {
      return settings.show_area_now_playing;
    }
    return normalizeNowPlayingMode(settings?.now_playing_bar) === 'all';
  }

  private _nowPlayingShown(): boolean {
    if (this._selectedView === 'home') return this._homeNowPlayingEnabled();
    if (this._selectedView === 'area') return this._areaNowPlayingEnabled();
    return false;
  }

  private _getNowPlayingPlayers(): NowPlayingPlayer[] {
    if (!this.hass || !this._nowPlayingShown()) return [];
    return this._nowPlayingPlayers(this.hass, this.hass.states, this.config, getEntityRegistry(this.hass), this._currentTime);
  }

  private _nowPlayingPlayers = memoizeOne((
    hass: HomeAssistant,
    states: HomeAssistant['states'],
    config: DwainsDashboardConfig,
    _registry: unknown,
    _clock: string
  ): NowPlayingPlayer[] => pickNowPlayingEntityIds(getDomainStates(states, 'media_player'), {
    now: Date.now(),
    isVisible: (entityId) => isNowPlayingPlayerVisible(hass, config, entityId),
  }).map((entityId) => ({ entityId, roomName: nowPlayingRoomName(hass, config, entityId) })));

  private _renderNowPlayingBar(floating: boolean) {
    const players = this._getNowPlayingPlayers();
    if (!players.length) return nothing;
    return html`
      <dwains-dashboard-next-now-playing class=${floating ? 'floating' : 'inline'} .hass=${this.hass} .players=${players} .floating=${floating}></dwains-dashboard-next-now-playing>
    `;
  }
  private _renderNotificationsPanel() {
    if (!this._showNotificationsUi()) return nothing;

    const count = this._persistentNotifications.length;
    const hasNotifications = count > 0;

    return html`
      <dd-next-popup-shell
        .open=${this._notificationsOpen}
        .titleText=${this._t('home.notifications')}
        .titleCount=${count}
        icon="mdi:bell-outline"
        .accent=${getDomainColor('notification')}
        .closeLabel=${this._t('common.close')}
        @dd-close=${this._closeNotifications}
      >
        <div slot="actions" class="notifications-actions">
          ${hasNotifications ? html`
            <button
              class="notifications-icon-button destructive"
              type="button"
              title=${this._t('common.dismiss_all')}
              aria-label=${this._t('common.dismiss_all')}
              @click=${this._dismissAllPersistentNotifications}
            >
              <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
            </button>
          ` : nothing}
        </div>

        <div class="notifications-list">
          ${this._notificationsLoading && !hasNotifications
            ? html`
                <div class="notifications-loading">
                  <ha-icon icon="mdi:loading"></ha-icon>
                  <span>${this._t('home.notifications_loading')}</span>
                </div>
              `
            : this._notificationsError
              ? html`
                  <div class="notifications-error">
                    <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                    <span>${this._notificationsError}</span>
                  </div>
                `
              : hasNotifications
                ? this._persistentNotifications.map((notification) =>
                    this._renderPersistentNotification(notification)
                  )
                : html`
                    <div class="notifications-empty">
                      <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                      <span>${this._t('home.notifications_empty')}</span>
                    </div>
                  `}
        </div>
      </dd-next-popup-shell>
    `;
  }

  private _renderPersistentNotification(notification: PersistentNotification) {
    return html`
      <article class="notification-row">
        <div class="notification-icon">
          <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
        </div>
        <div class="notification-copy">
          <div class="notification-title">${notification.title || this._t('home.notification')}</div>
          <div class="notification-message">${notification.message}</div>
          ${notification.created_at ? html`
            <div class="notification-date">${this._formatNotificationDate(notification.created_at)}</div>
          ` : nothing}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title=${this._t('common.dismiss')}
          aria-label=${this._t('common.dismiss')}
          @click=${() => this._dismissPersistentNotification(notification.notification_id)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </button>
      </article>
    `;
  }

  private _renderSidebar() {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen
    };
    const showNotifications = this._showNotificationsUi();
    const hasNotifications = showNotifications && this._persistentNotifications.length > 0;

    const content = html`
      <nav class=${classMap(classes)} @scroll=${this._handleSidebarScroll}>
        <div class="area-list">
          <div
            class="area-button home-button ${this._selectedView === 'home' ? 'selected' : ''} ${hasNotifications ? 'has-notifications' : ''}"
            role="button"
            tabindex="0"
            @click=${() => this._selectView('home')}
            @keydown=${this._handleHomeNavigationKeydown}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t('sidebar.home')}</div>
            </div>
            ${this._renderHomeNotificationShortcut()}
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </div>

          ${this._renderAreaButtons()}
        </div>
      </nav>
    `;
    return this._isMobile ? html`
      <dd-next-popup-shell
        .open=${this._mobileNavOpen}
        .navigationMenu=${true}
        .titleText=${this._t('home.areas')}
        icon="mdi:view-grid-outline"
        .closeLabel=${this._t('common.close')}
        @dd-close=${this._closeMobileNav}
      >${content}</dd-next-popup-shell>
    ` : content;
  }

  private _renderHomeNotificationShortcut() {
    if (!this._showNotificationsUi()) return nothing;

    const count = this._persistentNotifications.length;
    if (!count) return nothing;

    const label = `${count} persistent ${count === 1 ? 'notification' : 'notifications'}`;
    const displayCount = count > 99 ? '99+' : String(count);

    return html`
      <button
        class="home-notification-shortcut"
        type="button"
        title=${label}
        aria-label=${label}
        @click=${this._openNotificationsFromHomeShortcut}
      >
        <ha-icon icon="mdi:bell-outline"></ha-icon>
        <span class="home-notification-count">${displayCount}</span>
      </button>
    `;
  }

  private _groupAreasByFloor(areas: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};

    areas.forEach(area => {
      // Use floor_id from the area itself
      let floorName = 'no_floor';

      if (area.floor_id && this.config?.floors) {
        const floor = this.config.floors.find((f: any) => f.floor_id === area.floor_id);
        if (floor?.name) {
          floorName = floor.name;
        }
      }

      if (!grouped[floorName]) {
        grouped[floorName] = [];
      }
      grouped[floorName]!.push(area);
    });

    return grouped;
  }

  private _getVisibleSortedAreas(): AreaConfig[] {
    if (!this.config?.areas) return [];

    // Use the sortAreas helper from the area-entities utils
    return sortAreas(this.config.areas, this.config.areas_display, ddLocale(this.hass));
  }

  private _renderAreaButtons() {
    if (!this.config?.areas) return nothing;

    // Get visible areas (filtered and sorted)
    const visibleAreas = this._getVisibleSortedAreas();

    // Group areas by floor
    const groupedAreas = this._groupAreasByFloor(visibleAreas);

    // The floor registry is returned in Home Assistant's configured order.
    // Keep an explicit DD floor order when one exists, and place unassigned last.
    const configuredFloors = [...(this.config.floors || [])];
    const explicitFloorOrder = this.config.floors_display?.order || [];
    if (explicitFloorOrder.length) {
      const orderIndex = new Map(explicitFloorOrder.map((id, index) => [id, index]));
      configuredFloors.sort((a, b) =>
        (orderIndex.get(a.floor_id) ?? Number.MAX_SAFE_INTEGER) -
        (orderIndex.get(b.floor_id) ?? Number.MAX_SAFE_INTEGER)
      );
    }
    const floorNameIndex = new Map(configuredFloors.map((floor, index) => [floor.name, index]));
    const floorCollator = new Intl.Collator(ddLocale(this.hass), { numeric: true, sensitivity: 'base' });
    const sortedFloors = Object.entries(groupedAreas).sort(([a], [b]) => {
      if (a === 'no_floor') return 1;
      if (b === 'no_floor') return -1;
      const aIndex = floorNameIndex.get(a);
      const bIndex = floorNameIndex.get(b);
      if (aIndex !== undefined || bIndex !== undefined) {
        return (aIndex ?? Number.MAX_SAFE_INTEGER) - (bIndex ?? Number.MAX_SAFE_INTEGER);
      }
      return floorCollator.compare(a, b);
    });

    return sortedFloors.map(([floorName, areas]) => {
      const floorTitle = floorName === 'no_floor' ?
        this.hass.localize('ui.components.area-picker.no_floor') || this._t('home.unassigned_spaces') :
        floorName;

      return html`
        <div class="floor-section">
          <div class="floor-header">
            <h3>${floorTitle}</h3>
          </div>
          <div class="floor-areas">
            ${repeat(
              areas,
      area => area.area_id,
              area => this._renderAreaButton(area)
            )}
          </div>
        </div>
      `;
    });
  }

  private _sidebarAreaBadgeLimit(totalBadges = Number.MAX_SAFE_INTEGER): number {
    /*
     * The sidebar area list is deliberately a single-column list. Calculate
     * badge capacity from that actual tile width so the result grows
     * monotonically as the sidebar is widened.
     */
    const tileWidth = Math.max(0, this._areaSidebarWidth - 16);

    // The room icon slot is fixed at 74px, independent of sidebar width.
    const mediaWidth = 74;
    const contentGap = 9;
    const contentWidth = Math.max(0, tileWidth - 14 - mediaWidth - contentGap);

    // Approximate rendered width of the slightly enlarged badge geometry.
    const badgeWidth = 44;
    const badgeGap = 4;
    const overflowWidth = 15;

    const capacityWithoutOverflow = Math.max(
      1,
      Math.floor((contentWidth + badgeGap) / (badgeWidth + badgeGap))
    );

    if (totalBadges <= capacityWithoutOverflow) {
      return Math.min(8, totalBadges);
    }

    // Reserve room for the visible "…" marker whenever more badges exist.
    const capacityWithOverflow = Math.max(
      1,
      Math.floor(Math.max(0, contentWidth - overflowWidth - badgeGap) / (badgeWidth + badgeGap))
    );

    return Math.min(8, capacityWithOverflow);
  }

  private _renderAreaButton(area: any) {
    const areaData = this._getCachedAreaData(area);
    const isSelected = this._selectedArea === area.area_id;
    const hasPicture = Boolean(area.picture);
    const allBadges = this._getAreaStatusBadges(areaData);
    const mobileHasMoreBadges = this._isMobile && allBadges.length > 4;
    const badgeLimit = this._isMobile
      ? (mobileHasMoreBadges ? 3 : Math.min(4, allBadges.length))
      : this._sidebarAreaBadgeLimit(allBadges.length);
    const hasMoreBadges = this._isMobile
      ? mobileHasMoreBadges
      : allBadges.length > badgeLimit;
    const badges = allBadges.slice(0, badgeLimit);
    const sensorSummary = [
      areaData.temperature,
      areaData.humidity,
      areaData.wattage,
    ].filter(Boolean).join(' • ');

    return html`
      <button
        class="area-button room-area-button ${isSelected ? 'selected' : ''} ${hasPicture ? 'has-picture' : 'has-icon'}"
        @click=${() => this._selectArea(area.area_id)}
      >
        ${hasPicture ? html`
          <div
            class="area-list-picture"
            aria-hidden="true"
            style=${`background-image: url('${area.picture}');`}
          ></div>
        ` : nothing}

        <div class="area-media" aria-hidden="true">
          ${hasPicture
            ? html`<div class="area-media-picture" style=${`background-image: url('${area.picture}');`}></div>`
            : html`
                <div class="area-media-icon">
                  <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                </div>
              `}
        </div>

        <div class="area-content">
          <div class="area-top-section">
            <div class="area-name">${area.name}</div>
            <div class="area-sensors ${sensorSummary ? '' : 'is-empty'}">
              ${sensorSummary || '\u00A0'}
            </div>
          </div>
          <div class="area-info-badges">
            ${badges.map((badge) =>
              badge.domain === 'light'
                ? html`
                    <span
                      class="info-badge ${badge.className} clickable"
                      style=${`--badge-color: ${badge.color}; --area-badge-color: ${badge.color};`}
                      @click=${(event: Event) => this._handleLightToggle(event, area.area_id)}
                    >
                      <ha-icon icon=${badge.icon}></ha-icon>
                      <span class="badge-count">${badge.count}</span>
                    </span>
                  `
                : html`
                    <span
                      class="info-badge ${badge.className}"
                      style=${`--badge-color: ${badge.color}; --area-badge-color: ${badge.color};`}
                    >
                      <ha-icon icon=${badge.icon}></ha-icon>
                      <span class="badge-count">${badge.count}</span>
                    </span>
                  `
            )}
            ${hasMoreBadges ? html`
              <span
                class="info-badge info-badge-overflow"
                title="Weitere aktive Status"
                aria-label="Weitere aktive Status"
              >…</span>
            ` : nothing}
          </div>
        </div>
      </button>
    `;
  }

  private _renderGlobalHeader() {
    const classes = {
      'global-header': true,
      'compact': this._headerCompact,
      'expanded': this._headerExpanded && this._selectedView !== 'area',
      'room-context': this._selectedView === 'area',
      'mobile': this._isMobile
    };
    const favoriteCount = this._getEffectiveFavoriteEntities().length;

    return html`
      <header class=${classMap(classes)}>
        <div class="header-content">
          ${this._renderHeaderStatusCards()}

          ${!this._isMobile ? html`
            <div class="header-time-weather">
              ${this._renderWeatherDisplay()}
              ${this.config?.settings?.show_time !== false ? html`
                <div class="header-time-section">
                  <div class="header-time">${this._currentTime}</div>
                  <div class="header-date">${this._currentDate}</div>
                </div>
              ` : nothing}
            </div>
          ` : nothing}
        </div>

        ${this._selectedView === 'area' && !this._isMobile && this.config?.settings?.show_area_favorites !== false
          ? this._renderRoomFavoritesBlock()
          : nothing}

        ${this._selectedView === 'area' && !this._isMobile && this._areaNowPlayingEnabled() ? html`
          <div class="room-global-now-playing">
            ${this._renderNowPlayingBar(false)}
          </div>
        ` : nothing}

        ${favoriteCount && this._selectedView !== 'area' ? html`
          <button
            class="area-favorites-toggle"
            type="button"
            aria-expanded=${this._headerExpanded ? 'true' : 'false'}
            @click=${this._toggleHeader}
          >
            <span class="area-favorites-toggle-main">
              <ha-icon icon="mdi:star"></ha-icon>
              <span>${this._t('favorites.title')}</span>
              <span class="area-favorites-count">(${favoriteCount})</span>
            </span>
            <ha-icon icon=${this._headerExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
          </button>
        ` : nothing}

        ${this._selectedView !== 'area' ? html`
          <div class="header-expanded-content" style=${this._headerExpanded ? '' : 'display:none'}>
            <div class="header-favorites">
              ${this._renderFavoritesSection()}
            </div>
          </div>
        ` : nothing}
      </header>
    `;
  }

  private _renderWeatherDisplay() {
    if (!this._weatherDisplayEnabled()) return nothing;

    const weatherEntity = this._getWeatherEntity();
    if (!weatherEntity) return nothing;
    const temperature = this._formatWeatherTemperature(weatherEntity);
    if (!temperature) return nothing;

    return html`
      <div
        class="weather-compact"
        title=${this._weatherTitle(weatherEntity)}
        aria-label=${this._weatherTitle(weatherEntity)}
        @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
      >
        <div class="weather-icon-compact">
          <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
        </div>
        <div class="weather-temp-compact">
          ${temperature}
        </div>
      </div>
    `;
  }

  private _renderHeaderStatusCards() {
    const domains = this._getStatusDomains();
    const statusSectionClasses = [
      'header-status-section',
      this._headerStatusCanScrollLeft ? 'can-scroll-left' : '',
      this._headerStatusCanScrollRight ? 'can-scroll-right' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div class=${statusSectionClasses}>
        ${this._headerStatusCanScrollLeft ? html`
          <button
            class="header-status-scroll-button header-status-scroll-button-left"
            type="button"
            title="Vorherige Status"
            aria-label="Vorherige Status"
            @click=${() => this._scrollHeaderStatus(-1)}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        ` : nothing}

        <div
          class="header-status-scroll"
          @scroll=${this._handleHeaderStatusScroll}
          @wheel=${this._handleHeaderStatusWheel}
        >
          ${repeat(
            domains,
            d => `${d.domain}-${d.deviceClass || d.name}`,
            domain => html`
              <div
                class="status-card-compact ${domain.domain} ${domain.value ? 'has-value' : ''} header-card"
                style=${this._domainStatusStyle(domain.domain, domain.deviceClass)}
                @click=${() => this._handleStatusCardClick(domain)}
                data-domain=${domain.domain}
                title=${this._statusCardTitle(domain)}
                aria-label=${this._statusCardTitle(domain)}
              >
                <div class="status-card-icon-compact">
                  <ha-icon icon=${domain.icon}></ha-icon>
                  ${domain.count > 0 ? html`
                    <div class="status-card-badge-compact">${domain.count}</div>
                  ` : nothing}
                </div>
                <div class="status-card-title-compact">${domain.value || this._statusCardTitle(domain)}</div>
                ${domain.value ? html`<div class="status-card-subtitle-compact">${domain.domain === 'wattage' ? this._t('entity.power_usage') : domain.name}</div>` : nothing}
              </div>
            `
          )}
        </div>

        ${this._headerStatusCanScrollRight ? html`
          <button
            class="header-status-scroll-button header-status-scroll-button-right"
            type="button"
            title="Weitere Status"
            aria-label="Weitere Status"
            @click=${() => this._scrollHeaderStatus(1)}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private _domainStatusStyle(domain: string, deviceClass?: string): string {
    return `--status-color: ${this._statusColor(domain, deviceClass)};`;
  }

  private _isAlarmTriggered(): boolean {
    const alarm = this._getAlarmEntity();
    if (!alarm) return false;
    return String(alarm.state || '').toLowerCase() === 'triggered';
  }

  private _binarySensorBadgeColor(deviceClass?: string): string {
    // Status badges normally use the exact colour of their type.
    // Only a triggered alarm may override relevant badge colours with red.
    const alarmRelevant = ['motion', 'window', 'door', 'opening', 'garage_door'].includes(
      String(deviceClass || '')
    );
    if (alarmRelevant && this._isAlarmTriggered()) {
      return getDomainColor('alarm_control_panel');
    }
    return getDomainColor('binary_sensor', deviceClass);
  }

  private _statusColor(domain: string, deviceClass?: string): string {
    return domain === 'binary_sensor'
      ? this._binarySensorBadgeColor(deviceClass)
      : getDomainColor(domain, deviceClass);
  }

  private _isUrgentStatus(domain: string, deviceClass?: string): boolean {
    return this._statusColor(domain, deviceClass) === getDomainColor('alarm_control_panel');
  }

  private _getAreaStatusBadges(areaData: AreaData): AreaStatusBadge[] {
    const badges: AreaStatusBadge[] = [];
    const addDomain = (domain: string, className = domain) => {
      const count = areaData.domains[domain]?.on || 0;
      if (!count) return;
      badges.push({
        key: domain,
        className,
        domain,
        icon: getDomainIcon(domain),
        count,
        color: getDomainColor(domain),
      });
    };

    // Keep the same semantic order everywhere: controls first, then sensor states.
    addDomain('light');
    addDomain('switch');
    addDomain('cover');
    addDomain('climate');
    addDomain('media_player');
    addDomain('fan');
    addDomain('lock');

    const motionCount = areaData.domains.motion?.on || 0;
    if (motionCount) {
      badges.push({
        key: 'binary_sensor:motion',
        className: 'motion',
        domain: 'binary_sensor',
        deviceClass: 'motion',
        icon: getDeviceClassIcon('binary_sensor', 'motion'),
        count: motionCount,
        color: this._binarySensorBadgeColor('motion'),
      });
    }

    // Do not collapse unlike binary-sensor states into one red "!". A window,
    // door, moisture alarm and smoke alarm each keep their own icon and colour.
    const alertCounts = new Map<string, number>();
    areaData.alerts.forEach((alert) => {
      const deviceClass = alert.deviceClass || 'problem';
      alertCounts.set(deviceClass, (alertCounts.get(deviceClass) || 0) + 1);
    });
    const alertOrder = ['window', 'door', 'moisture', 'smoke'];
    [...alertCounts.entries()]
      .sort(([a], [b]) => {
        const ai = alertOrder.indexOf(a);
        const bi = alertOrder.indexOf(b);
        return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) -
          (bi === -1 ? Number.MAX_SAFE_INTEGER : bi) ||
          a.localeCompare(b);
      })
      .forEach(([deviceClass, count]) => {
        badges.push({
          key: `binary_sensor:${deviceClass}`,
          className: `binary-${deviceClass}`,
          domain: 'binary_sensor',
          deviceClass,
          icon: getAlertIcon(deviceClass),
          count,
          color: this._binarySensorBadgeColor(deviceClass),
        });
      });

    return badges
      .map((badge, index) => ({ badge, index }))
      .sort((a, b) => {
        const urgentA = this._isUrgentStatus(a.badge.domain, a.badge.deviceClass);
        const urgentB = this._isUrgentStatus(b.badge.domain, b.badge.deviceClass);
        if (urgentA !== urgentB) return urgentA ? -1 : 1;
        return a.index - b.index;
      })
      .map(({ badge }) => badge);
  }

  private _statusCardTitle(domain: DomainCount): string {
    if (domain.domain === 'cover' && domain.statusKind === 'window') {
      const label = this._statusPair('status.window_open');
      return domain.count === 1 ? label.singular : label.plural;
    }
    if (domain.domain === 'cover' && domain.statusKind === 'door') {
      const label = this._statusPair('status.door_open');
      return domain.count === 1 ? label.singular : label.plural;
    }
    if (domain.domain === 'cover' && domain.statusKind === 'gate') {
      const german = String(this.hass?.language || this.hass?.locale?.language || '').toLowerCase().startsWith('de');
      return german
        ? (domain.count === 1 ? 'Tor offen' : 'Tore offen')
        : (domain.count === 1 ? 'Gate open' : 'Gates open');
    }
    if (domain.domain === 'cover' && domain.statusKind === 'shading') {
      const german = String(this.hass?.language || this.hass?.locale?.language || '').toLowerCase().startsWith('de');
      return german ? 'Beschattung geschlossen' : 'Shading closed';
    }
    if (domain.domain === 'cover') return domain.name;
    const activeLabel = this._statusCardActiveLabel(domain);
    if (activeLabel) {
      return domain.count === 1 ? activeLabel.singular : activeLabel.plural;
    }
    return domain.name;
  }

  private _statusLabel(key: string, count: number, plural = true): string {
    const localized = plural ? this._tp(key, count) : this._t(key, { count });
    const prefix = String(count);
    return localized.startsWith(prefix) ? localized.slice(prefix.length).trim() : localized;
  }

  private _statusPair(key: string, plural = true): { singular: string; plural: string } {
    return {
      singular: this._statusLabel(key, 1, plural),
      plural: this._statusLabel(key, 2, plural),
    };
  }

  private _statusCardActiveLabel(domain: DomainCount): { singular: string; plural: string } | undefined {
    if (domain.domain === 'person') return undefined;

    if (domain.domain === 'light') return this._statusPair('status.light_on');
    if (domain.domain === 'switch') return this._statusPair('status.switch_on');
    if (domain.domain === 'cover') return this._statusPair('status.cover_open');
    if (domain.domain === 'fan') return this._statusPair('status.fan_on');
    if (domain.domain === 'lock') return this._statusPair('status.lock_unlocked');
    if (domain.domain === 'climate') return this._statusPair('status.climate_active');
    if (domain.domain === 'media_player') return this._statusPair('status.media_playing');
    if (domain.domain === 'vacuum') return this._statusPair('status.vacuum_cleaning');
    if (domain.domain === 'alarm_control_panel') return this._statusPair('status.alarm_armed');

    if (domain.domain === 'binary_sensor') {
      switch (domain.deviceClass) {
        case 'door': return this._statusPair('status.door_open');
        case 'window': return this._statusPair('status.window_open');
        case 'opening': return this._statusPair('status.opening_open');
        case 'motion': return this._statusPair('status.motion_detected', false);
        case 'smoke': return this._statusPair('status.smoke_detected', false);
        case 'gas': return this._statusPair('status.gas_detected', false);
        case 'moisture': return this._statusPair('status.moisture_detected', false);
        case 'occupancy': return this._statusPair('status.occupancy_detected', false);
        case 'presence': return this._statusPair('status.presence_detected', false);
        case 'tamper': return this._statusPair('status.tamper_detected', false);
        case 'vibration': return this._statusPair('status.vibration_detected', false);
        case 'safety': return this._statusPair('status.safety_active', false);
        default: return undefined;
      }
    }

    return undefined;
  }

  private _entityAreaName(entityId: string): string | undefined {
    const entityReg = this.config?.entities?.find(e => e.entity_id === entityId);
    const deviceReg = entityReg?.device_id
      ? this.config?.devices?.find(d => d.device_id === entityReg.device_id)
      : null;
    const areaId = entityReg?.area_id || deviceReg?.area_id || this.hass?.entities?.[entityId]?.area_id;
    return this.config?.areas?.find(a => a.area_id === areaId)?.name;
  }

  private _renderHomeView() {
    const sections = this._getVisibleHomeSections();

    return html`
      <div class="home-view">
        ${this._renderHomeWelcome()}
        ${sections.map(section => this._renderHomeSection(section))}
      </div>
    `;
  }

  private _getHomeSectionsOrder(): HomeSectionKey[] {
    return normalizeHomeSectionsOrder(this.config?.settings?.home_sections_order);
  }

  private _getVisibleHomeSections(): HomeSectionKey[] {
    const hidden = new Set(normalizeHiddenHomeSections(this.config?.settings?.home_sections_hidden));
    const forceAreas = this._isDesktopAreaSidebarCollapsed();
    return this._getHomeSectionsOrder().filter(section => !hidden.has(section) || (forceAreas && section === 'areas'));
  }

  private _homeInformationCardVisible(card: HomeInformationCardKey): boolean {
    const hidden = new Set(normalizeHiddenHomeInformationCards(this.config?.settings?.home_information_cards_hidden));
    return !hidden.has(card);
  }

  private _renderHomeSection(section: HomeSectionKey) {
    switch (section) {
      case 'now_playing':
        return !this._isMobile ? this._renderNowPlayingBar(false) : nothing;
      case 'summaries':
        return this._renderHomeSummaries();
      case 'cameras':
        return this._renderHomeCameras();
      case 'areas':
        return this._renderMobileHomeAreas();
      case 'devices':
        return this._renderHomeStatusCards();
      case 'todos':
        return this._renderHomeTodos();
      case 'custom_cards':
        return this._renderHomeCustomCards();
      case 'favorites':
        return this._renderFavorites();
      case 'scenes':
        return this._renderHomeScenes();
      default:
        return nothing;
    }
  }

  private _getHomeSceneItems(): HomeSceneItem[] {
    return resolveHomeSceneItems(
      normalizeHomeScenes(this.config?.settings?.home_scenes),
      this.hass?.states || {},
      getEntityRegistry(this.hass),
      this.config?.settings?.hide_unavailable_entities !== false
    );
  }

  private _homeSceneName(entityId: string): string {
    return this.hass?.states[entityId]?.attributes?.friendly_name ||
      getEntityRegistry(this.hass)[entityId]?.name || entityId;
  }

  private _scriptLastRunText(state: any): string {
    const timestamp = Date.parse(state?.attributes?.last_triggered || '');
    return Number.isFinite(timestamp) ? this._formatRelativeTime(timestamp) : this._t('scenes.not_run');
  }

  private _renderHomeScenes() {
    const items = this._getHomeSceneItems();
    if (!items.length) return nothing;
    const title = this._t('home_section.scenes.label');
    return html`
      <section class="home-summaries-section home-scenes-section">
        <div class="home-status-heading">
          <ha-icon icon=${HOME_SECTION_META.scenes.icon}></ha-icon>
          <span>${title}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon"><ha-icon icon=${HOME_SECTION_META.scenes.icon}></ha-icon></span>
            <span class="mobile-section-title-label">${title}</span>
          </div>
        </div>
        <div class="home-summary-list">
          ${items.map(item => {
            const state = this.hass.states[item.entityId];
            if (!state) return nothing;
            const name = this._homeSceneName(item.entityId);
            const meta = item.unavailable
              ? this._t('common.unavailable')
              : item.domain === 'scene'
                ? this._sceneLastActivatedText(state)
                : this._scriptLastRunText(state);
            return html`
              <button
                class="home-summary-card ${item.domain}"
                type="button"
                ?disabled=${item.unavailable}
                @click=${() => this._runHomeScene(item)}
              >
                <span class="home-summary-icon"><ha-icon icon=${getDomainIcon(item.domain)}></ha-icon></span>
                <span class="home-summary-copy">
                  <span class="home-summary-title">${name}</span>
                  <span class="home-summary-subtitle">${meta}</span>
                </span>
                <span class="home-summary-chevron"><ha-icon icon="mdi:play"></ha-icon></span>
              </button>
            `;
          })}
        </div>
      </section>
    `;
  }

  private async _runHomeScene(item: HomeSceneItem): Promise<void> {
    if (item.unavailable) return;
    const name = this._homeSceneName(item.entityId);
    try {
      await this.hass.callService(item.domain, 'turn_on', { entity_id: item.entityId });
      this._showToast(this._t(item.domain === 'scene' ? 'scenes.activated_named' : 'scenes.started_named', { name }));
    } catch (err) {
      console.warn(`Failed to run ${item.entityId}:`, err);
      this._showToast(this._t(item.domain === 'scene' ? 'scenes.scene_failed' : 'scenes.script_failed', { name }));
    }
  }
  private _renderHomeSummaries() {
    const summaries = this._getHomeSummaryCards();
    if (!summaries.length) return nothing;

    return html`
      <section class="home-summaries-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
          <span>${this._t('home.summaries')}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon summaries"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>
            <span class="mobile-section-title-label">${this._t('home.summaries')}</span>
          </div>
        </div>
        <div class="home-summary-list">
          ${repeat(
            summaries,
            summary => summary.key,
            summary => html`
              <button
                class="home-summary-card ${summary.key}"
                type="button"
                style=${`--summary-color: ${summary.color};`}
                @click=${() => this._openHomeAssistantPage(summary.path)}
              >
                <span class="home-summary-icon">
                  <ha-icon icon=${summary.icon}></ha-icon>
                </span>
                <span class="home-summary-copy">
                  <span class="home-summary-title">${summary.label}</span>
                  <span class="home-summary-subtitle">${summary.subtitle}</span>
                </span>
                <span class="home-summary-chevron">
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </span>
              </button>
            `
          )}
        </div>
      </section>
    `;
  }

  private _renderHomeTodos() {
    const todoEntities = this._getHomeTodoEntities();
    if (!todoEntities.length) return nothing;

    const sectionTitle = this._t('home_section.todos.label');

    return html`
      <section class="home-todos-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${sectionTitle}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon todos"><ha-icon icon="mdi:format-list-checks"></ha-icon></span>
            <span class="mobile-section-title-label">${sectionTitle}</span>
          </div>
        </div>
        <div class="home-todos-grid">
          ${repeat(
            todoEntities,
            entityId => entityId,
            entityId => html`
              <div class="home-todo-card" data-entity=${entityId}>
                <dwains-dashboard-next-card-host
                  eager
                  framed
                  .hass=${this.hass}
                  .config=${{
                    type: 'todo-list',
                    entity: entityId,
                    title: this.hass.states[entityId]?.attributes?.friendly_name ||
                      this.hass.entities?.[entityId]?.name ||
                      entityId,
                  }}
                ></dwains-dashboard-next-card-host>
              </div>
            `
          )}
        </div>
      </section>
    `;
  }

  private _getHomeCustomCards(): HomeCustomCard[] {
    const cards = this.config?.home_custom_cards;
    if (!Array.isArray(cards)) return [];

    return cards.filter(entry =>
      Boolean(entry?.id) &&
      Boolean(entry?.card) &&
      typeof entry.card === 'object' &&
      typeof entry.card.type === 'string'
    );
  }

  private _renderHomeCustomCards() {
    const cards = this._getHomeCustomCards();
    if (!cards.length) return nothing;

    const sectionTitle = this._t('home_section.custom_cards.label');
    return html`
      <section class="home-custom-cards-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cards-outline"></ha-icon>
          <span>${sectionTitle}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon custom-cards"><ha-icon icon="mdi:cards-outline"></ha-icon></span>
            <span class="mobile-section-title-label">${sectionTitle}</span>
          </div>
        </div>
        <div class="home-custom-cards-grid">
          ${repeat(
            cards,
            entry => entry.id,
            entry => html`
              <div class="home-custom-card ${this._customCardNeedsWideLayout(entry.card) ? 'is-wide' : ''}">
                <dwains-dashboard-next-card-host
                  eager
                  .hass=${this.hass}
                  .config=${entry.card}
                ></dwains-dashboard-next-card-host>
              </div>
            `
          )}
        </div>
      </section>
    `;
  }

  private _getHomeTodoEntities(): string[] {
    return Object.keys(this.hass?.states || {})
      .filter(entityId => entityId.startsWith('todo.'))
      .filter(entityId => {
        const state = this.hass.states[entityId];
        const registry = this.hass.entities?.[entityId] as any;
        if (!state) return false;
        return !['unavailable', 'unknown'].includes(String(state.state).toLowerCase()) &&
          !registry?.hidden_by &&
          !registry?.disabled_by &&
          registry?.entity_category !== 'diagnostic' &&
          registry?.entity_category !== 'config';
      })
      .sort((left, right) => {
        const leftName = this.hass.states[left]?.attributes?.friendly_name || this.hass.entities?.[left]?.name || left;
        const rightName = this.hass.states[right]?.attributes?.friendly_name || this.hass.entities?.[right]?.name || right;
        return String(leftName).localeCompare(String(rightName), this.hass.language);
      });
  }

  private _getHomeSummaryCards(): HomeSummaryCard[] {
    const cards: HomeSummaryCard[] = [];
    const updateCount = this._getUpdateEntityCount();

    if (this._repairsIssueCount > 0) {
      cards.push({
        key: 'repairs',
        label: this._t('home.repairs'),
        subtitle: this._tp('summary.issue', this._repairsIssueCount),
        icon: 'mdi:wrench',
        color: '#f59e0b',
        count: this._repairsIssueCount,
        path: '/config/repairs',
      });
    }

    if (updateCount > 0) {
      cards.push({
        key: 'updates',
        label: this._t('home.updates'),
        subtitle: this._tp('summary.update_available', updateCount),
        icon: 'mdi:package-up',
        color: '#0ea5e9',
        count: updateCount,
        path: '/config/updates',
      });
    }

    if (this._discoveredDeviceCount > 0) {
      cards.push({
        key: 'discovered',
        label: this._t('home.devices_discovered'),
        subtitle: this._tp('summary.device_to_add', this._discoveredDeviceCount),
        icon: 'mdi:devices',
        color: '#1494aa',
        count: this._discoveredDeviceCount,
        path: '/config/integrations',
      });
    }

    return cards;
  }

  private _openHomeAssistantPage(path: string): void {
    this._closeMobileNav();
    navigateHomeAssistant(path);
  }

  private _renderHomeWelcome() {
    const userName = this.hass?.user?.name || 'User';
    const greeting = this._getGreeting();
    const weatherEntity = this._weatherDisplayEnabled() ? this._getWeatherEntity() : undefined;
    const weatherTemperature = this._formatWeatherTemperature(weatherEntity);
    const userPicture = this._getWelcomeUserPicture(userName);
    const alarmContent = this._renderHomeAlarm();

    return html`
      <div class="home-welcome">
        <div class="welcome-content">
          <div class="welcome-header">
            <div class="welcome-user">
              <button
                class="welcome-avatar"
                type="button"
                title=${this._t('navigation.profile_settings')}
                aria-label=${this._t('navigation.profile_settings')}
                @click=${this._openProfileSettings}
              >
                ${userPicture
                  ? html`<img src=${userPicture} alt=${userName} />`
                  : html`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy">
                <div class="welcome-text">
                  <span class="welcome-greeting">${greeting},</span>
                  <span class="welcome-name">${userName}</span>
                  <span class="welcome-title">${greeting}, ${userName}</span>
                </div>
              </div>
            </div>
            <div class="welcome-header-meta">
              ${!this._isMobile && weatherEntity && weatherTemperature ? html`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(weatherEntity)}
                  aria-label=${this._weatherTitle(weatherEntity)}
                  @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
                >
                  <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
                  <span class="weather-temp">${weatherTemperature}</span>
                </div>
              ` : nothing}
              <div class="welcome-time-section">
                <div class="welcome-time">${this._currentTime}</div>
                <div class="welcome-date">${this._currentDate}</div>
              </div>
              <div class="welcome-actions">
                ${this._showNotificationsUi() ? html`
                  <button
                    class="welcome-action welcome-notification-action"
                    type="button"
                    title=${this._t('home.notifications')}
                    @click=${this._openNotifications}
                  >
                    <ha-icon icon="mdi:bell-outline"></ha-icon>
                    ${this._persistentNotifications.length
                      ? html`<span class="welcome-action-badge">${this._persistentNotifications.length}</span>`
                      : nothing}
                  </button>
                ` : nothing}
                ${this._canManageDashboard() ? html`
                  <button
                    class="welcome-action welcome-settings-action"
                    type="button"
                    title=${this._t('sidebar.dashboard_settings')}
                    @click=${this._openDashboardSettings}
                  >
                    <ha-icon icon="mdi:pencil"></ha-icon>
                  </button>
                ` : nothing}
              </div>
            </div>
          </div>
          ${alarmContent !== nothing || (this._isMobile && weatherTemperature) ? html`
            <div class="welcome-subheader">
              ${alarmContent}
              ${this._isMobile && weatherEntity && weatherTemperature ? html`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(weatherEntity)}
                  aria-label=${this._weatherTitle(weatherEntity)}
                  @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
                >
                  <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
                  <span class="weather-temp">${weatherTemperature}</span>
                </div>
              ` : nothing}
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderHomeStatusCards() {
    const domains = this._getStatusDomains();
    const visibleDomains = this._homeInformationCardVisible('device_groups')
      ? domains.filter(d =>
          d.domain !== 'person' &&
          d.domain !== 'wattage' &&
          d.domain !== 'camera'
        )
      : [];
    const gridMode = this._mobileHomeDevicesLayout === 'grid';

    const renderStatusCard = (domain: DomainCount) => html`
      <div
        class="home-status-card compact-status ${domain.domain} ${domain.value ? 'has-value' : ''}"
        style=${this._domainStatusStyle(domain.domain, domain.deviceClass)}
        @click=${() => this._handleStatusCardClick(domain)}
        data-domain=${domain.domain}
        title=${this._statusCardTitle(domain)}
        aria-label=${this._statusCardTitle(domain)}
      >
        <div class="status-card-icon">
          <ha-icon icon=${domain.icon}></ha-icon>
          ${domain.count > 0 ? html`
            <div class="status-card-badge">${domain.count}</div>
          ` : nothing}
        </div>
        ${domain.value ? html`<div class="status-card-value">${domain.value}</div>` : nothing}
        <div class="status-card-title">${this._statusCardTitle(domain)}</div>
      </div>
    `;

    const primaryCards = [
      this._homeInformationCardVisible('people') ? this._renderHousePersonsStatusCard() : nothing,
      this._homeInformationCardVisible('climate') ? this._renderHouseClimateStatusCard('indoor') : nothing,
      this._homeInformationCardVisible('outdoor_climate') ? this._renderHouseClimateStatusCard('outdoor') : nothing,
      this._homeInformationCardVisible('power') ? this._renderHousePowerStatusCard() : nothing,
    ].filter(card => card !== nothing);

    if (!primaryCards.length && !visibleDomains.length) return nothing;

    const heading = html`
      <div class="home-status-heading">
        <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
        <span>${this._t('home.house_information')}</span>
      </div>
      <div class="mobile-section-heading">
        <div class="mobile-section-title">
          <button
            class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
            type="button"
            title=${gridMode ? this._t('home.swipe_house_information') : this._t('home.show_all_house_information')}
            aria-label=${gridMode ? this._t('home.switch_house_information_swipe') : this._t('home.show_all_house_information')}
            @click=${this._toggleMobileHomeDevicesLayout}
          >
            <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
          </button>
          <span class="mobile-section-title-label">${this._t('home.house_information')}</span>
        </div>
      </div>
    `;

    if (this._isMobile) {
      return html`
        <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
          ${heading}
          <div class="home-status-grid">
            ${primaryCards}
            ${visibleDomains.map(renderStatusCard)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
        ${heading}

        <div class="home-status-primary-grid">
          ${primaryCards}
          ${visibleDomains.map(renderStatusCard)}
        </div>
      </div>
    `;
  }

  private _renderHomeCameras() {
    const cameras = this._getHomeAreaCameras();
    if (!cameras.length) return nothing;
    const gridMode = this._mobileHomeCamerasLayout === 'grid';

    return html`
      <section class="home-camera-section layout-${this._mobileHomeCamerasLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span>${this._t('home.cameras')}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
              type="button"
              title=${gridMode ? this._t('home.swipe_cameras') : this._t('home.show_all_cameras')}
              aria-label=${gridMode ? this._t('home.switch_cameras_swipe') : this._t('home.show_all_cameras')}
              @click=${this._toggleMobileHomeCamerasLayout}
            >
              <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t('home.cameras')}</span>
          </div>
        </div>
        <div class="home-camera-grid">
          ${repeat(
            cameras,
            camera => `${camera.areaId}-${camera.entityId}`,
            camera => this._renderHomeCameraCard(camera)
          )}
        </div>
      </section>
    `;
  }

  private _renderHomeCameraCard(camera: HomeAreaCamera) {
    return html`
      <button
        class="home-camera-card"
        type="button"
        title=${camera.name}
        @click=${() => this._showMoreInfo(camera.entityId)}
      >
        ${camera.imageUrl
          ? html`<div class="home-camera-image" style=${`background-image: url('${camera.imageUrl}');`}></div>`
          : html`
              <div class="home-camera-placeholder">
                <ha-icon icon="mdi:cctv"></ha-icon>
              </div>
            `}
        <div class="home-camera-content">
          <div class="home-camera-top">
            <div class="home-camera-area-icon">
              <ha-icon icon=${camera.areaIcon}></ha-icon>
            </div>
          </div>
          <div class="home-camera-copy">
            <div class="home-camera-name">${camera.name}</div>
            <div class="home-camera-meta">${camera.areaName} · ${camera.state}</div>
          </div>
        </div>
      </button>
    `;
  }

  private _getHomeAreaCameras(): HomeAreaCamera[] {
    const cameras: HomeAreaCamera[] = [];
    const hiddenCameras = new Set(this.config?.settings?.home_cameras_hidden || []);
    const configuredOrder = this.config?.settings?.home_camera_order || [];
    const orderIndex = new Map(configuredOrder.map((entityId, index) => [entityId, index]));

    this._getVisibleSortedAreas().forEach(area => {
      const cameraEntities = this._getFilteredAreaEntities(area.area_id)
        .filter(entity => entity.entity_id.startsWith('camera.'))
        .filter(entity => !hiddenCameras.has(entity.entity_id))
        .filter(entity => {
          const state = this.hass?.states?.[entity.entity_id]?.state;
          return Boolean(state && state !== 'unavailable' && state !== 'unknown');
        });

      cameraEntities.forEach(cameraEntity => {
        const stateObj = this.hass.states[cameraEntity.entity_id];
        const name = stateObj?.attributes?.friendly_name || cameraEntity.entity_id;
        const state = stateObj ? this.hass.formatEntityState(stateObj) : this._t('common.unknown');
        const imageUrl = this._getCameraImageUrl(cameraEntity.entity_id);
        const camera: HomeAreaCamera = {
          areaId: area.area_id,
          areaName: area.name,
          areaIcon: getAreaIcon(area),
          entityId: cameraEntity.entity_id,
          name,
          state,
        };

        if (imageUrl) camera.imageUrl = imageUrl;
        cameras.push(camera);
      });
    });

    return cameras.sort((a, b) => {
      const ai = orderIndex.get(a.entityId);
      const bi = orderIndex.get(b.entityId);
      if (ai !== undefined || bi !== undefined) {
        return (ai ?? Number.MAX_SAFE_INTEGER) - (bi ?? Number.MAX_SAFE_INTEGER);
      }
      return 0;
    });
  }

  private _getCameraImageUrl(entityId: string): string | undefined {
    const stateObj = this.hass?.states?.[entityId];
    if (!stateObj) return undefined;

    const entityPicture = stateObj.attributes?.entity_picture;
    const token = stateObj.attributes?.access_token;
    const baseUrl = typeof entityPicture === 'string' && entityPicture
      ? entityPicture
      : token
        ? `/api/camera_proxy/${entityId}?token=${encodeURIComponent(token)}`
        : '';

    if (!baseUrl) return undefined;

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}dd_cache=${encodeURIComponent(stateObj.last_updated || stateObj.last_changed || '')}`;
  }

  private _renderHousePowerStatusCard() {
    const powerUsage = this._getHousePowerUsage();
    if (!powerUsage.sensorCount) return nothing;

    const subtitle = powerUsage.sensorCount
      ? this._tp('devices.live_power_sensor', powerUsage.sensorCount)
      : this._t('home.no_live_power_sensors');

    return html`
      <div
        class="home-status-card house-power-card wattage ${powerUsage.sensorCount ? 'has-power' : 'is-empty'}"
        style=${this._domainStatusStyle('wattage')}
        @click=${this._openHousePowerDialog}
        @keydown=${this._handleHousePowerKeydown}
        data-domain="wattage"
        role="button"
        tabindex="0"
        aria-label=${`${this._t('home.house_power_usage')}: ${powerUsage.formattedTotal}`}
      >
        <div class="house-power-head">
          <div class="status-card-icon house-power-icon">
            <ha-icon icon="mdi:flash"></ha-icon>
          </div>
          <div class="house-power-copy">
            <div class="house-power-title">${this._t('home.house_power_usage')}</div>
            <div class="house-power-subtitle">${subtitle}</div>
          </div>
          <div class="house-power-total">${powerUsage.formattedTotal}</div>
        </div>
        ${powerUsage.rooms.length ? html`
          <div class="house-power-list" aria-label=${this._t('home.house_power_usage')}>
            ${repeat(
              powerUsage.rooms,
              room => room.areaId,
              room => this._renderHousePowerRoom(room)
            )}
          </div>
        ` : html`
          <div class="house-power-empty">${this._t('home.no_room_power_usage')}</div>
        `}
      </div>
    `;
  }

  private _houseClimateTitle(scope: HouseClimateScope): string {
    return scope === 'outdoor' ? this._t('home.outdoor_climate') : this._t('home.indoor_climate');
  }

  private _renderHouseClimateStatusCard(scope: HouseClimateScope) {
    const climate = this._getHouseClimateSummary(scope);
    if (!climate.metrics.length) return nothing;
    const title = this._houseClimateTitle(scope);

    return html`
      <div
        class="home-status-card house-climate-card sensor ${scope} metrics-${Math.min(climate.metrics.length, 4)}"
        style=${this._domainStatusStyle('room_climate')}
        @click=${() => this._showHouseClimateEntities(undefined, scope)}
        @keydown=${(event: KeyboardEvent) => this._handleHouseClimateKeydown(event, scope)}
        data-domain="sensor"
        role="button"
        tabindex="0"
        aria-label=${title}
      >
        <div class="house-climate-head">
          <div class="status-card-icon house-climate-icon">
            <ha-icon icon=${scope === 'outdoor' ? 'mdi:sun-thermometer-outline' : 'mdi:home-thermometer-outline'}></ha-icon>
          </div>
          <div class="house-climate-copy">
            <div class="house-climate-title">${title}</div>
            <div class="house-climate-subtitle">
              ${this._tp('common.sensor', climate.sensorCount)}
            </div>
          </div>
        </div>
        <div class="house-climate-grid">
          ${climate.metrics.map(metric => html`
            <button
              class="house-climate-metric ${metric.kind}"
              style=${`--metric-color: ${metric.color};`}
              type="button"
              @click=${(event: Event) => {
                event.stopPropagation();
                this._showHouseClimateEntities(metric.kind, scope);
              }}
            >
              <span class="house-climate-metric-icon">
                <ha-icon icon=${metric.icon}></ha-icon>
              </span>
              <span class="house-climate-metric-copy">
                <span class="house-climate-metric-value">${metric.value}</span>
                <span class="house-climate-metric-label">${metric.label}</span>
              </span>
            </button>
          `)}
        </div>
      </div>
    `;
  }

  private _renderHousePowerRoom(room: HousePowerRoom) {
    return html`
      <div class="house-power-room">
        <span class="house-power-room-icon">
          <ha-icon icon=${room.icon}></ha-icon>
        </span>
        <span class="house-power-room-name">${room.name}</span>
        <span class="house-power-room-value">${room.formatted}</span>
        <span
          class="house-power-bar"
          aria-hidden="true"
          style=${`--power-width: ${room.percentage}%`}
        >
          <span class="house-power-bar-fill"></span>
        </span>
      </div>
    `;
  }

  private _handleHousePowerKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._openHousePowerDialog();
  };

  private _openHousePowerDialog = () => {
    this._housePowerDialogOpen = true;
  };

  private _closeHousePowerDialog = () => {
    this._housePowerDialogOpen = false;
  };

  private _openEnergyFromPowerDialog = () => {
    this._closeHousePowerDialog();
    this._openDeviceDomain('energy');
  };

  private _renderHousePowerDialog() {
    if (!this._housePowerDialogOpen) return nothing;

    const usage = buildHousePowerUsage(this.hass, this.config);
    const topArea = usage.areas[0];
    const wholeHouseStats = this._housePowerStatisticsEntities(
      usage.areas.flatMap(area => area.entities),
      8
    );

    return html`
      <dd-next-popup-shell
        open
        wide
        .titleText=${this._t('home.house_power_usage')}
        icon="mdi:flash"
        .accent=${getDomainColor('wattage')}
        .closeLabel=${this._t('common.close')}
        @dd-close=${this._closeHousePowerDialog}
      >
        <button
          slot="header-extra"
          class="house-power-dialog-energy-link"
          type="button"
          @click=${this._openEnergyFromPowerDialog}
        >
          <span>${this._houseInfoEnergyViewLabel()}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>

        <div class="house-power-dialog-content">
          <div class="house-power-dialog-overview">
            <section class="house-power-dialog-overview-card">
              <div class="house-power-dialog-overview-head">
                <span class="house-power-dialog-overview-icon"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon></span>
                <div>
                  <strong>${this._t('devices.whole_house')}</strong>
                  <small>${this._tp('devices.live_power_sensor', usage.sensorCount)}</small>
                </div>
                <b>${usage.formattedTotal || '0 W'}</b>
              </div>
              ${this._renderHousePowerStatisticsGraph(wholeHouseStats, this._t('devices.whole_house_history'))}
            </section>

            ${topArea ? html`
              <section class="house-power-dialog-overview-card">
                <div class="house-power-dialog-overview-head">
                  <span class="house-power-dialog-overview-icon"><ha-icon icon=${topArea.icon}></ha-icon></span>
                  <div>
                    <strong>${this._t('devices.top_area')}</strong>
                    <small>${topArea.name}</small>
                  </div>
                  <b>${topArea.formattedTotal}</b>
                </div>
                <div class="house-power-dialog-top-entities">
                  ${topArea.entities.slice(0, 3).map(entity => html`
                    <button type="button" @click=${() => this._showMoreInfo(entity.entityId)}>
                      <span>${entity.name}</span>
                      <strong>${entity.formatted}</strong>
                    </button>
                  `)}
                </div>
              </section>
            ` : nothing}
          </div>

          ${usage.areas.length ? html`
            <div class="house-power-dialog-areas">
              ${usage.areas.map(area => html`
                <section class="house-power-dialog-area">
                  <div class="house-power-dialog-area-head">
                    <span class="house-power-dialog-area-icon"><ha-icon icon=${area.icon}></ha-icon></span>
                    <span class="house-power-dialog-area-name">${area.name}</span>
                    <strong>${area.formattedTotal}</strong>
                  </div>
                  ${this._renderHousePowerStatisticsGraph(
                    this._housePowerStatisticsEntities(area.entities, 6),
                    `${area.name} power history`
                  )}
                  <div class="house-power-dialog-entities">
                    ${area.entities.map(entity => {
                      const pct = area.totalWatts > 0
                        ? Math.max(4, Math.min(100, Math.round((entity.watts / area.totalWatts) * 100)))
                        : 0;
                      return html`
                        <button
                          class="house-power-dialog-entity detailed"
                          type="button"
                          style=${`--entity-power-width: ${pct}%`}
                          @click=${() => this._showMoreInfo(entity.entityId)}
                        >
                          <span class="house-power-dialog-entity-icon"><ha-icon icon=${entity.icon}></ha-icon></span>
                          <span class="house-power-dialog-entity-copy">
                            <strong>${entity.name}</strong>
                            <small>${area.name}</small>
                            <span class="house-power-dialog-entity-bar"><span></span></span>
                          </span>
                          <b>${entity.formatted}</b>
                        </button>
                      `;
                    })}
                  </div>
                </section>
              `)}
            </div>
          ` : html`
            <div class="house-power-dialog-empty">${this._t('home.no_room_power_usage')}</div>
          `}
        </div>
      </dd-next-popup-shell>
    `;
  }

  private _handleHouseClimateKeydown(event: KeyboardEvent, scope: HouseClimateScope): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showHouseClimateEntities(undefined, scope);
  }

  private _showHouseClimateEntities(kind?: HouseClimateMetric['kind'], scope: HouseClimateScope = 'indoor'): void {
    const climate = this._getHouseClimateSummary(scope);
    const metrics = kind
      ? climate.metrics.filter(metric => metric.kind === kind)
      : climate.metrics;
    const entityIds = metrics.flatMap(metric => metric.entityIds);

    if (!entityIds.length) {
      this._openDeviceDomain('sensor');
      return;
    }

    const title = kind
      ? (kind === 'temperature' ? this._t('home.temperature') : this._t('home.humidity'))
      : this._houseClimateTitle(scope);

    showDomainEntitiesDialog(this, {
      domain: 'sensor',
      config: this.config,
      entityIds,
      customTitle: title,
      homeInformation: true,
      homeInformationPresentation: 'devices',
      deviceClass: kind,
      deviceViewKey: 'sensor',
      viewAllLabel: this._houseInfoDeviceViewLabel(),
      onViewAll: () => this._openDeviceDomain('sensor'),
    });
  }

  private _renderHousePersonsStatusCard() {
    const personEntities = this._getVisiblePersonEntities();
    const subtitle = personEntities.length
      ? this._t('person.home').replace(/^./, first => first.toLocaleUpperCase(this.hass?.language || 'de'))
      : this._t('home.no_people');

    return html`
      <div
        class="home-status-card house-persons-card person persons-${Math.min(personEntities.length, 4)}"
        style=${this._domainStatusStyle('person')}
        @click=${() => this._showPersonEntities()}
        data-domain="person"
      >
        <div class="house-persons-head">
          <div class="status-card-icon house-persons-icon">
            <ha-icon icon="mdi:account-group"></ha-icon>
          </div>
          <div class="house-persons-copy">
            <div class="house-persons-title">${this._t('home.people')}</div>
            <div class="house-persons-subtitle">${subtitle}</div>
          </div>
        </div>
        ${personEntities.length ? html`
          <div class="house-persons-grid">
            ${repeat(
              personEntities.slice(0, 4),
              person => person.entity_id,
              person => this._renderHousePersonMini(person)
            )}
          </div>
        ` : html`
          <div class="house-persons-empty">${this._t('home.no_visible_people')}</div>
        `}
      </div>
    `;
  }

  private _renderHousePersonMini(person: any) {
    const name = person.attributes?.friendly_name || person.entity_id.split('.')[1];
    const picture = person.attributes?.entity_picture;
    const stateLabel = this._formatPersonState(person);
    const presenceClass = person.state === 'home'
      ? 'is-home'
      : person.state === 'not_home'
        ? 'is-away'
        : 'is-zone';

    return html`
      <button
        class="house-person-mini ${presenceClass}"
        type="button"
        aria-label=${`${name}: ${stateLabel}`}
        @click=${(event: Event) => this._handleHousePersonClick(event, person.entity_id)}
      >
        <span class="house-person-avatar">
          ${picture ? html`
            <img src=${picture} alt=${name}>
          ` : html`
            <ha-icon icon="mdi:account"></ha-icon>
          `}
        </span>
        <span class="house-person-mini-copy">
          <span class="house-person-mini-name">${name}</span>
          <span class="house-person-mini-state">${stateLabel}</span>
        </span>
      </button>
    `;
  }

  private _handleHousePersonClick(event: Event, entityId: string) {
    event.stopPropagation();
    this._showMoreInfo(entityId);
  }

  private _getVisiblePersonEntities(): any[] {
    if (!this.hass || !this.config) return [];

    const hiddenPersons = new Set(this.config.settings?.hidden_persons || []);
    return Object.values(this.hass.states).filter(
      (entity: any) =>
        entity.entity_id.startsWith('person.') &&
        !hiddenPersons.has(entity.entity_id) &&
        !this.hass.entities?.[entity.entity_id]?.hidden_by
    );
  }

  private _formatPersonState(person: any): string {
    if (person.state === 'home') return this._t('person.home');
    if (person.state === 'not_home') return this._t('person.away');
    if (!person.state || person.state === 'unknown') return this._t('common.unknown');
    if (person.state === 'unavailable') return this._t('common.unavailable');

    return String(person.state)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private _weatherDisplayEnabled(): boolean {
    return this.config?.settings?.show_weather !== false &&
      this.config?.global_options?.show_weather !== false;
  }

  private _formatWeatherTemperature(weatherEntity?: any): string {
    if (!weatherEntity) return '';

    const attributes = weatherEntity.attributes || {};
    const temperature = attributes.temperature ??
      attributes.current_temperature ??
      attributes.apparent_temperature ??
      attributes.native_temperature;

    if (temperature === undefined || temperature === null || temperature === '') return '';

    const unit = attributes.temperature_unit ||
      attributes.native_temperature_unit ||
      this.hass?.config?.unit_system?.temperature ||
      '';

    return formatValueWithUnit(temperature, unit);
  }

  private _weatherTitle(weatherEntity?: any): string {
    const temperature = this._formatWeatherTemperature(weatherEntity);
    const condition = this._formatWeatherCondition(weatherEntity?.state);

    const outside = this._t('home.outside').toLocaleLowerCase(ddLocale(this.hass));
    if (temperature && condition) return `${temperature} ${outside}, ${condition}`;
    if (temperature) return `${temperature} ${outside}`;
    return condition || this._t('home.outside_weather');
  }

  private _formatWeatherCondition(state?: string): string {
    if (!state || state === 'unknown' || state === 'unavailable') return '';

    return state
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private _getHousePowerUsage(): HousePowerUsage {
    const powerUsage = buildHousePowerUsage(this.hass, this.config);
    const rooms = powerUsage.areas.slice(0, 4).map(area => ({
      areaId: area.areaId,
      name: area.name,
      icon: area.icon,
      watts: area.totalWatts,
      formatted: area.formattedTotal,
      percentage: area.percentage,
    }));

    return {
      totalWatts: powerUsage.totalWatts,
      formattedTotal: powerUsage.formattedTotal,
      sensorCount: powerUsage.sensorCount,
      rooms,
    };
  }

  private _getHouseClimateSummary(scope: HouseClimateScope = 'indoor'): HouseClimateSummary {
    const values: Record<HouseClimateMetric['kind'], Array<{ value: number; unit: string; entityIds: string[] }>> = { temperature: [], humidity: [] };
    const excludedAreas = new Set(this.config?.settings?.home_climate_excluded_areas || []);
    const outdoorAreas = new Set(this.config?.settings?.home_outdoor_climate_areas || []);
    const areas = scope === 'outdoor'
      ? (this.config?.areas || []).filter(area => outdoorAreas.has(area.area_id))
      : this._getVisibleSortedAreas().filter(area => !excludedAreas.has(area.area_id) && !outdoorAreas.has(area.area_id));

    areas.forEach(area => {
      const areaRegistry = this.hass?.areas?.[area.area_id] as any;
      (['temperature', 'humidity'] as const).forEach(kind => {
        const entityId = kind === 'temperature' ? areaRegistry?.temperature_entity_id : areaRegistry?.humidity_entity_id;
        if (!entityId) return;
        const state = this.hass?.states?.[entityId];
        if (!state || state.state === 'unavailable' || state.state === 'unknown') return;
        const value = Number.parseFloat(state.state);
        if (!Number.isFinite(value)) return;
        values[kind].push({ value, unit: String(state.attributes?.unit_of_measurement || (kind === 'temperature' ? this.hass?.config?.unit_system?.temperature || '°C' : '%')), entityIds: [entityId] });
      });
    });

    const metrics: HouseClimateMetric[] = [];
    const temperature = this._houseClimateMetric('temperature', values.temperature, scope);
    const humidity = this._houseClimateMetric('humidity', values.humidity, scope);
    if (temperature) metrics.push(temperature);
    if (humidity) metrics.push(humidity);
    return { sensorCount: values.temperature.length + values.humidity.length, metrics };
  }

  private _houseClimateMetric(
    kind: HouseClimateMetric['kind'],
    values: Array<{ value: number; unit: string; entityIds: string[] }>,
    scope: HouseClimateScope = 'indoor'
  ): HouseClimateMetric | undefined {
    if (!values.length) return undefined;

    const average = values.reduce((total, item) => total + item.value, 0) / values.length;
    const unit = values[0]?.unit || (kind === 'temperature' ? '°C' : '%');
    const value = formatValueWithUnit(kind === 'temperature' ? average.toFixed(1) : Math.round(average), unit);
    const averaged = scope === 'indoor' || values.length > 1;

    return {
      kind,
      label: kind === 'temperature'
        ? this._t(averaged ? 'home.average_temperature' : 'home.temperature')
        : this._t(averaged ? 'home.average_humidity' : 'home.humidity'),
      value,
      count: values.length,
      icon: kind === 'temperature' ? getDeviceClassIcon('sensor', 'temperature') : getDeviceClassIcon('sensor', 'humidity'),
      color: getDomainColor('sensor', kind),
      entityIds: [...new Set(values.flatMap(item => item.entityIds))],
    };
  }

  private _renderMobileHomeAreas() {
    const areas = this._getVisibleSortedAreas();
    if (!areas.length) return nothing;
    const desktopCollapsed = this._isDesktopAreaSidebarCollapsed();
    const layout = desktopCollapsed ? 'grid' : this._mobileHomeAreasLayout;
    const gridMode = layout === 'grid';
    const renderedAreas = this._isMobile && !this._renderAllMobileHomeAreas && areas.length > MOBILE_INITIAL_HOME_AREAS
      ? areas.slice(0, MOBILE_INITIAL_HOME_AREAS)
      : areas;

    return html`
      <section class="mobile-home-section mobile-home-areas layout-${layout}">
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            ${desktopCollapsed ? html`
              <span class="mobile-section-icon" aria-hidden="true">
                <ha-icon icon="mdi:view-grid-outline"></ha-icon>
              </span>
            ` : html`
              <button
                class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
                type="button"
                title=${gridMode ? this._t('home.swipe_areas') : this._t('home.show_all_areas')}
                aria-label=${gridMode ? this._t('home.switch_areas_swipe') : this._t('home.show_all_areas')}
                @click=${this._toggleMobileHomeAreasLayout}
              >
                <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
              </button>
            `}
            <span class="mobile-section-title-label">${this._t('home.areas')}</span>
          </div>
        </div>
        <div class="mobile-area-rail">
          ${repeat(
            renderedAreas,
            area => area.area_id,
            area => this._renderMobileHomeAreaCard(area, gridMode)
          )}
        </div>
      </section>
    `;
  }

  private _renderMobileHomeAreaCard(area: AreaConfig, gridMode = true) {
    const entities = this._getFilteredAreaEntities(area.area_id);
    const areaData = this._getCachedAreaData(area);
    const deviceCount = this._getAreaDeviceCount(area.area_id, entities);
    const hasPicture = Boolean(area.picture);
    const sensorSummary = [
      areaData.temperature,
      areaData.humidity,
      areaData.wattage
    ].filter(Boolean).join(' • ');
    const meta = sensorSummary || (deviceCount === 1 ? '1 device' : `${deviceCount} devices`);
    const badges = this._getAreaStatusBadges(areaData);
    const compactBadges = this._isMobile && !gridMode;
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';

    return html`
      <button
        class="mobile-area-card ${hasPicture ? 'has-picture' : ''} ${pictureContrastClass}"
        type="button"
        @click=${() => this._selectArea(area.area_id)}
      >
        ${hasPicture ? html`
          <div class="mobile-area-picture" style=${`background-image: url('${area.picture}');`}></div>
        ` : nothing}
        <div class="mobile-area-top" style=${`--mobile-area-icon-size: ${compactBadges ? '100%' : '56px'}; --mobile-area-icon-height: ${compactBadges ? 'auto' : '56px'}; --mobile-area-icon-glyph-size: ${compactBadges ? '24px' : '30px'}; --mobile-area-top-display: ${compactBadges ? 'grid' : 'flex'}; --mobile-area-top-justify: ${compactBadges ? 'flex-start' : 'space-between'}; --mobile-area-top-gap: ${compactBadges ? '4px' : '8px'}; --mobile-area-badge-width: ${compactBadges ? '36px' : 'max-content'}; --mobile-area-badge-padding: ${compactBadges ? '0 4px' : '0 6px'};`}>
          <div class="mobile-area-icon">
            <ha-icon icon=${getAreaIcon(area)}></ha-icon>
          </div>
          <div class="mobile-area-badges">
            ${badges.slice(0, 4).map(badge => html`
              <span
                class="mobile-area-badge ${badge.className}"
                style=${`--area-badge-color: ${badge.color};`}
              >
                <ha-icon icon=${badge.icon}></ha-icon>
                <span>${badge.count}</span>
              </span>
            `)}
          </div>
        </div>
        <div class="mobile-area-copy">
          <div class="mobile-area-name">${area.name}</div>
          <div class="mobile-area-meta">${meta}</div>
        </div>
      </button>
    `;
  }

  private _getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return this._t('home.good_morning');
    if (hour < 18) return this._t('home.good_afternoon');
    return this._t('home.good_evening');
  }

  private _renderHomeAlarm() {
    const alarm = this._getAlarmEntity();
    if (!alarm) return nothing;

    const state = alarm?.state || '';
    const isArmed = ['armed_away', 'armed_home', 'armed_night', 'armed_vacation'].includes(state);
    const isDisarmed = state === 'disarmed';
    const isTriggered = state === 'triggered';

    const getAlarmIcon = () => {
      if (isTriggered) return 'mdi:shield-alert';
      if (isArmed) return 'mdi:shield-check';
      if (isDisarmed) return 'mdi:shield-off';
      return 'mdi:shield-alert';
    };

    const getAlarmText = () => {
      if (isTriggered) return this._t('domain.alarm_control_panel');
      if (isArmed) return this._t('home.alarm_armed');
      if (isDisarmed) return this._t('home.alarm_disarmed');
      return this._t('domain.alarm_control_panel');
    };

    const getAlarmClass = () => {
      if (isTriggered) return 'alarm-triggered';
      if (isArmed) return 'alarm-armed';
      if (isDisarmed) return 'alarm-disarmed';
      return 'alarm-unknown';
    };

    return html`
      <div class="welcome-alarm ${getAlarmClass()}" @click=${() => this._showMoreInfo(alarm?.entity_id || '')}>
        <ha-icon icon=${getAlarmIcon()}></ha-icon>
        <span class="alarm-text">${getAlarmText()}</span>
          </div>
    `;
  }

  private _renderFavorites() {
    const available = this._getEffectiveFavoriteEntities();
    if (available.length === 0) return nothing;
    const gridMode = this._mobileHomeFavoritesLayout === 'grid';

    return html`
      <div class="favorites-section home-favorites-section layout-${this._mobileHomeFavoritesLayout}">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <span>${this._t('favorites.title')}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
              type="button"
              title=${gridMode ? this._t('favorites.swipe') : this._t('favorites.show_all')}
              aria-label=${gridMode ? this._t('favorites.switch_swipe') : this._t('favorites.show_all')}
              @click=${this._toggleMobileHomeFavoritesLayout}
            >
              <ha-icon icon=${gridMode ? 'mdi:view-agenda-outline' : 'mdi:view-grid-outline'}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t('favorites.title')}</span>
          </div>
        </div>
        <div class="favorites-grid">
          ${repeat(
            available,
            entityId => entityId,
            entityId => this._renderFavoriteCard(entityId)
          )}
        </div>
      </div>
    `;
  }

  private _renderFavoriteCard(entityId: string) {
    const rawState = this.hass.states[entityId];
    const registry = this.hass.entities?.[entityId];
    if (!rawState || registry?.hidden_by) return nothing;

    const state = this._getEffectiveEntityState(rawState);
    const domain = entityId.split('.')[0] || 'unknown';
    const deviceClass = state.attributes?.device_class;
    const rawName = state.attributes?.friendly_name || registry?.name || entityId;
    const formattedState = this._favoriteDisplayState(state, domain);
    const areaName = this._entityAreaName(entityId);
    const name = this.config?.settings?.hide_area_name_in_entity_names === true && areaName
      ? stripAreaNameFromEntityName(rawName, areaName)
      : rawName;
    const icon = registry?.icon || state.attributes?.icon || getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const activeState = this._favoriteActiveState(state, domain);
    const supportsToggle = this._favoriteSupportsQuickToggle(domain);
    const favoriteColorDomain =
      domain === 'cover'
        ? 'opening'
        : domain === 'sensor' && (deviceClass === 'temperature' || deviceClass === 'humidity')
          ? deviceClass
          : domain === 'sensor' && deviceClass === 'power'
            ? 'wattage'
            : domain;
    const favoriteColor = favoriteColorDomain === 'opening'
      ? getDomainColor('binary_sensor', 'opening')
      : getDomainColor(favoriteColorDomain, deviceClass);
    const classes = [
      'favorite-card-wrapper',
      `favorite-${domain}`,
      deviceClass ? `favorite-${deviceClass}` : '',
      activeState,
      supportsToggle ? 'can-toggle' : 'info-only',
    ].filter(Boolean).join(' ');

    return html`
      <article
        class=${classes}
        style=${`--favorite-color: ${favoriteColor};`}
        data-entity=${entityId}
        role="button"
        tabindex="0"
        @click=${() => this._showMoreInfo(entityId)}
        @keydown=${(event: KeyboardEvent) => this._handleFavoriteKeydown(event, entityId)}
      >
        <div class="favorite-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="favorite-body">
          <div
            class="favorite-name"
            title=${name}
          >${name}</div>
          <div class="favorite-meta">
            ${areaName ? html`<span class="favorite-area">${areaName}</span>` : nothing}
          </div>
        </div>
        <div class="favorite-end">
          ${domain === 'cover'
            ? this._renderFavoriteCoverActions(state)
            : supportsToggle ? html`
              <button
                class="favorite-quick-action"
                type="button"
                title=${this._favoriteQuickTitle(state, domain)}
                @click=${(event: Event) => this._handleFavoriteQuickAction(event, state, domain)}
              >
                <ha-icon icon=${this._favoriteQuickIcon(state, domain)}></ha-icon>
              </button>
            ` : formattedState ? html`
              <div class="favorite-status-pill" title=${formattedState}>${formattedState}</div>
            ` : nothing}
        </div>
      </article>
    `;
  }

  private _favoriteDisplayState(state: any, domain: string): string {
    if (domain === 'light' && String(state?.state || '').toLowerCase() === 'on' && typeof state?.attributes?.brightness === 'number') {
      return `${Math.round((Number(state.attributes.brightness) / 255) * 100)} %`;
    }

    if (domain === 'cover' && typeof state?.attributes?.current_position === 'number') {
      return `${Math.round(Number(state.attributes.current_position))} %`;
    }

    return this._formatFavoriteState(state);
  }

  private _renderFavoriteCoverActions(state: any) {
    const value = String(state?.state || '').toLowerCase();
    const unavailable = ['unavailable', 'unknown'].includes(value);
    const canOpen = this._coverSupportsFeature(state, 1);
    const canClose = this._coverSupportsFeature(state, 2);

    return html`
      <div class="favorite-cover-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${canOpen ? html`
          <button
            class="favorite-cover-action ${value === 'opening' ? 'active' : ''}"
            type="button"
            title=${this._t('action.open')}
            aria-label=${this._t('action.open')}
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleMobileCoverAction(event, state, 'open')}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        ` : nothing}
        ${canClose ? html`
          <button
            class="favorite-cover-action ${value === 'closing' ? 'active' : ''}"
            type="button"
            title=${this._t('action.close')}
            aria-label=${this._t('action.close')}
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleMobileCoverAction(event, state, 'close')}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private _handleFavoriteKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private _formatFavoriteState(state: any): string {
    const effectiveState = this._getEffectiveEntityState(state);

    return formatEntityStateWithUnit(this.hass, effectiveState);
  }

  private _getEffectiveEntityState<T extends { entity_id?: string; state?: string } | null | undefined>(state: T): T {
    const entityId = state?.entity_id;
    if (!entityId) return state;

    const optimistic = this._optimisticEntityStates[entityId];
    if (!optimistic || optimistic.expiresAt <= Date.now()) return state;

    const actualState = String(state?.state || '').toLowerCase();
    if (actualState === optimistic.state.toLowerCase()) return state;

    return {
      ...(state as NonNullable<T>),
      state: optimistic.state,
    } as T;
  }

  private _setOptimisticEntityState(entityId: string, state: string): void {
    this._setOptimisticEntityStates([entityId], state);
  }

  private _setOptimisticEntityStates(entityIds: string[], state: string): void {
    const uniqueEntityIds = [...new Set(entityIds.filter(Boolean))];
    if (!uniqueEntityIds.length) return;

    const expiresAt = Date.now() + OPTIMISTIC_ENTITY_STATE_TTL;
    const next = { ...this._optimisticEntityStates };
    uniqueEntityIds.forEach((entityId) => {
      next[entityId] = { state, expiresAt };
    });
    this._optimisticEntityStates = next;
    this._scheduleOptimisticCleanup();
  }

  private _clearOptimisticEntityStates(entityIds: string[]): void {
    const uniqueEntityIds = [...new Set(entityIds.filter(Boolean))];
    if (!uniqueEntityIds.length) return;

    const next = { ...this._optimisticEntityStates };
    let changed = false;
    uniqueEntityIds.forEach((entityId) => {
      if (next[entityId]) {
        delete next[entityId];
        changed = true;
      }
    });

    if (changed) this._optimisticEntityStates = next;
  }

  private _reconcileOptimisticEntityStates(): void {
    const entries = Object.entries(this._optimisticEntityStates);
    if (!entries.length) return;

    const now = Date.now();
    const next = { ...this._optimisticEntityStates };
    let changed = false;

    entries.forEach(([entityId, optimistic]) => {
      const actual = this.hass?.states?.[entityId]?.state;
      if (
        !actual ||
        optimistic.expiresAt <= now ||
        String(actual).toLowerCase() === optimistic.state.toLowerCase()
      ) {
        delete next[entityId];
        changed = true;
      }
    });

    if (changed) this._optimisticEntityStates = next;
  }

  private _scheduleOptimisticCleanup(): void {
    if (this._optimisticCleanupTimer !== undefined) return;

    const expiries = Object.values(this._optimisticEntityStates).map(entry => entry.expiresAt);
    if (!expiries.length) return;

    const nextExpiry = Math.min(...expiries);
    if (!Number.isFinite(nextExpiry)) return;

    const delay = Math.max(80, nextExpiry - Date.now() + 50);
    this._optimisticCleanupTimer = window.setTimeout(() => {
      this._optimisticCleanupTimer = undefined;
      this._reconcileOptimisticEntityStates();
      if (Object.keys(this._optimisticEntityStates).length) {
        this._scheduleOptimisticCleanup();
      }
    }, delay);
  }

  private _favoriteActiveState(state: any, domain: string): string {
    const value = String(state?.state || '').toLowerCase();
    if (['unavailable', 'unknown'].includes(value)) return 'is-idle';
    if (domain === 'cover') return ['open', 'opening'].includes(value) ? 'is-active' : 'is-off';
    if (domain === 'lock') return value === 'unlocked' ? 'is-active' : 'is-off';
    if (domain === 'climate') {
      const action = state?.attributes?.hvac_action;
      return action && action !== 'idle' && action !== 'off' ? 'is-active' : 'is-idle';
    }
    if (['off', 'closed', 'locked', 'not_home', 'idle'].includes(value)) return 'is-off';
    return 'is-active';
  }

  private _favoriteSupportsQuickToggle(domain: string): boolean {
    return ['light', 'switch', 'fan', 'input_boolean', 'cover', 'lock'].includes(domain);
  }

  private _favoriteQuickIcon(state: any, domain: string): string {
    const value = String(state?.state || '').toLowerCase();
    if (domain === 'cover') return ['open', 'opening'].includes(value) ? 'mdi:arrow-down' : 'mdi:arrow-up';
    if (domain === 'lock') return value === 'unlocked' ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline';
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return 'mdi:power';
    return 'mdi:chevron-right';
  }

  private _favoriteQuickTitle(state: any, domain: string): string {
    const value = String(state?.state || '').toLowerCase();
    if (domain === 'cover') return this._t(['open', 'opening'].includes(value) ? 'action.close' : 'action.open');
    if (domain === 'lock') return this._t(value === 'unlocked' ? 'action.lock' : 'action.unlock');
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return this._t(value === 'off' ? 'action.turn_on' : 'action.turn_off');
    return this._t('action.more_info');
  }

  private async _handleFavoriteQuickAction(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;
    const affectedEntityIds = [entityId];

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        const turnOn = !this._isEntityActiveForUi(state, domain);
        this._setOptimisticEntityState(entityId, turnOn ? 'on' : 'off');
        await this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', { entity_id: entityId });
        return;
      }
      if (domain === 'cover') {
        const open = ['open', 'opening'].includes(String(state.state).toLowerCase());
        this._setOptimisticEntityState(entityId, open ? 'closed' : 'open');
        await this.hass.callService('cover', open ? 'close_cover' : 'open_cover', { entity_id: entityId });
        return;
      }
      if (domain === 'lock') {
        const unlocked = String(state.state).toLowerCase() === 'unlocked';
        this._setOptimisticEntityState(entityId, unlocked ? 'locked' : 'unlocked');
        await this.hass.callService('lock', unlocked ? 'lock' : 'unlock', { entity_id: entityId });
        return;
      }
    } catch (err) {
      this._clearOptimisticEntityStates(affectedEntityIds);
      console.warn(`Failed to run favorite quick action for ${entityId}:`, err);
      this._showToast(this._t('entity.update_failed'));
      return;
    }

    this._showMoreInfo(entityId);
  }





  private _areaTileState(active: number, total: number, kind: 'on' | 'open'): string {
    if (kind === 'open') {
      if (total === 1) return this._t(active ? 'common.open' : 'common.closed');
      return active ? this._t('area_header.open_count', { active, total }) : this._t('common.closed');
    }
    if (total === 1) return this._t(active ? 'common.on' : 'common.off');
    return active ? this._t('area_header.on_count', { active, total }) : this._t('common.off');
  }

  private _areaQuickControlCount(entities: EntityConfig[], thermostatEntityId?: string): number {
    let count = 0;
    if (entities.some(entity => entity.entity_id.startsWith('light.'))) count++;
    if (entities.some(entity => entity.entity_id.startsWith('switch.'))) count++;

    const coverGroups = new Set(
      entities
        .filter(entity => entity.entity_id.startsWith('cover.'))
        .map(entity => getAreaEntityGroupKey(entity.entity_id, this.hass))
        .filter((key): key is 'cover_shading' | 'cover_openings' | 'cover_gates' =>
          key === 'cover_shading' || key === 'cover_openings' || key === 'cover_gates'
        )
    );
    count += coverGroups.size;

    if (entities.some(entity => entity.entity_id.startsWith('fan.'))) count++;
    if (entities.some(entity => entity.entity_id.startsWith('climate.'))) count++;
    if (thermostatEntityId) count++;
    return count;
  }

  private _handleAreaQuickScroll = (event: Event): void => {
    if (!this._isMobile) return;
    const rail = event.currentTarget as HTMLElement;
    const pageCount = Number(rail.dataset.pageCount || 1);
    if (pageCount <= 1) {
      if (this._areaQuickPage !== 0) this._areaQuickPage = 0;
      return;
    }
    const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth);
    const nextPage = Math.max(
      0,
      Math.min(pageCount - 1, Math.round((rail.scrollLeft / maxScroll) * (pageCount - 1)))
    );
    if (nextPage !== this._areaQuickPage) this._areaQuickPage = nextPage;
  };

  private _scrollAreaQuickToPage(page: number): void {
    const rail = this.renderRoot.querySelector<HTMLElement>('.room-header .dd-page-header-strip');
    if (!rail) return;
    const pageCount = Number(rail.dataset.pageCount || 1);
    const clamped = Math.max(0, Math.min(pageCount - 1, page));
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const left = pageCount <= 1 ? 0 : (maxScroll * clamped) / (pageCount - 1);
    rail.scrollTo({ left, behavior: 'smooth' });
  }

  private _renderAreaQuickTiles(areaId: string, entities: EntityConfig[]) {
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    const covers = entities.filter(e => e.entity_id.startsWith('cover.'));
    const coverGroups = {
      cover_shading: covers.filter(e => getAreaEntityGroupKey(e.entity_id, this.hass) === 'cover_shading'),
      cover_openings: covers.filter(e => getAreaEntityGroupKey(e.entity_id, this.hass) === 'cover_openings'),
      cover_gates: covers.filter(e => getAreaEntityGroupKey(e.entity_id, this.hass) === 'cover_gates'),
    } as const;
    const fans = entities.filter(e => e.entity_id.startsWith('fan.'));
    const climates = entities.filter(e => e.entity_id.startsWith('climate.'));

    if (!lights.length && !switches.length && !covers.length && !fans.length && !climates.length) {
      return nothing;
    }

    const toggleTile = (
      kind: 'light' | 'switch' | 'fan',
      total: number,
      active: number,
      icons: [string, string],
      actionKey: [string, string],
      onClick: () => void
    ) => {
      const isOn = active > 0;
      const label = this._t(`domain.${kind}`);
      const state = this._areaTileState(active, total, 'on');
      const fullState = this._areaTileState(total, total, 'on');
      const offState = this._areaTileState(0, total, 'on');
      const action = this._t(isOn ? actionKey[1] : actionKey[0], { active, total });
      return html`
        <button
          class="dd-room-tile ${kind} ${isOn ? 'is-on' : ''}"
          type="button"
          aria-pressed=${isOn ? 'true' : 'false'}
          title=${action}
          aria-label=${`${label}: ${state}. ${action}`}
          @click=${onClick}
        >
          <span class="dd-room-tile-icon">
            <ha-icon icon=${isOn ? icons[1] : icons[0]}></ha-icon>
          </span>
          <span class="dd-room-tile-copy">
            <span class="dd-room-tile-label">${label}</span>
            <span class="dd-room-tile-state-slot">
            <span class="dd-room-tile-state">${state}</span>
            <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${fullState}</span>
            <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${offState}</span>
          </span>
          </span>
          <span class="dd-room-tile-switch" aria-hidden="true"></span>
        </button>
      `;
    };

    const renderCoverTile = (
      groupKey: 'cover_shading' | 'cover_openings' | 'cover_gates',
      groupCovers: EntityConfig[]
    ) => {
      if (!groupCovers.length) return nothing;
      const openCount = this._countActiveEntities(groupCovers, 'cover');
      const label = this._mobileGroupName(groupKey);
      const highlighted = groupKey === 'cover_shading'
        ? openCount === 0
        : openCount > 0;
      const icon = groupKey === 'cover_shading' && openCount === 0
        ? 'mdi:blinds-horizontal-closed'
        : this._mobileGroupIcon(groupKey);
      return html`
        <div class="dd-room-tile cover has-actions ${highlighted ? 'is-on' : ''}">
          <span class="dd-room-tile-icon">
            <ha-icon icon=${icon}></ha-icon>
          </span>
          <span class="dd-room-tile-copy">
            <span class="dd-room-tile-label">${label}</span>
            <span class="dd-room-tile-state-slot">
              <span class="dd-room-tile-state">${this._areaTileState(openCount, groupCovers.length, 'open')}</span>
              <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${this._areaTileState(groupCovers.length, groupCovers.length, 'open')}</span>
              <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${this._areaTileState(0, groupCovers.length, 'open')}</span>
            </span>
          </span>
          <span class="dd-room-tile-actions">
            <button
              class="dd-room-tile-action"
              type="button"
              title=${this._t('action.open_all')}
              aria-label=${`${label}: ${this._t('action.open_all')}`}
              @click=${() => void this._setAreaCoverState(areaId, true, groupKey)}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button
              class="dd-room-tile-action"
              type="button"
              title=${this._t('action.close_all')}
              aria-label=${`${label}: ${this._t('action.close_all')}`}
              @click=${() => void this._setAreaCoverState(areaId, false, groupKey)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
          </span>
        </div>
      `;
    };

    const activeClimates = this._countActiveEntities(climates, 'climate');
    const singleClimateState = climates.length === 1 ? this.hass.states[climates[0]!.entity_id] : undefined;
    const currentTemperature = singleClimateState?.attributes?.current_temperature;
    const temperatureUnit = (this.hass.config as any)?.unit_system?.temperature || '°';
    const climateValue = currentTemperature !== undefined && currentTemperature !== null
      ? formatValueWithUnit(currentTemperature, temperatureUnit)
      : this._tp('common.entity', climates.length);

    return html`
      <div class="dd-room-tiles">
        ${lights.length ? toggleTile(
          'light',
          lights.length,
          this._countActiveEntities(lights, 'light'),
          ['mdi:lightbulb-outline', 'mdi:lightbulb'],
          ['action.lights_on_summary', 'action.lights_off_summary'],
          () => this._toggleAreaLights(areaId)
        ) : nothing}
        ${switches.length ? toggleTile(
          'switch',
          switches.length,
          this._countActiveEntities(switches, 'switch'),
          ['mdi:power-plug-off-outline', 'mdi:power-plug'],
          ['action.switches_on_summary', 'action.switches_off_summary'],
          () => this._toggleAreaSwitches(areaId)
        ) : nothing}
        ${renderCoverTile('cover_shading', coverGroups.cover_shading)}
        ${renderCoverTile('cover_openings', coverGroups.cover_openings)}
        ${renderCoverTile('cover_gates', coverGroups.cover_gates)}
        ${fans.length ? toggleTile(
          'fan',
          fans.length,
          this._countActiveEntities(fans, 'fan'),
          ['mdi:fan-off', 'mdi:fan'],
          ['action.fans_on_summary', 'action.fans_off_summary'],
          () => this._toggleAreaFans(areaId)
        ) : nothing}
        ${climates.length ? html`
          <button
            class="dd-room-tile climate ${activeClimates > 0 ? 'is-on' : ''}"
            type="button"
            title=${this._t('action.open_climate_controls')}
            aria-label=${`${this._t('domain.climate')}: ${climateValue}. ${this._t('action.open_climate_controls')}`}
            @click=${() => this._openAreaClimateControls(areaId, climates)}
          >
            <span class="dd-room-tile-icon">
              <ha-icon icon=${getDomainIcon('climate')}></ha-icon>
            </span>
            <span class="dd-room-tile-copy">
              <span class="dd-room-tile-label">${this._t('domain.climate')}</span>
              <span class="dd-room-tile-state">${climateValue}</span>
            </span>
            <ha-icon class="dd-room-tile-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private _renderAreaCompactBar(
    area: AreaConfig,
    areaData: AreaData,
    deviceLabel: string,
    backButton: unknown,
    actions: unknown,
    tiles: unknown
  ) {
    const visible = this._areaHeaderStuck;
    const readings = [areaData.temperature, areaData.humidity].filter(Boolean).join(' · ');
    return html`
      <div class="dd-room-compact ${visible ? 'is-visible' : ''}" ?inert=${!visible} aria-hidden=${visible ? 'false' : 'true'}>
        <div class="dd-room-compact-panel">
          <div class="dd-room-compact-bar">
            ${backButton}
            <div class="dd-room-compact-title">
              <strong>${area.name}</strong>
              <span>${readings || deviceLabel}</span>
            </div>
            <div class="dd-page-header-actions">${actions}</div>
          </div>
          ${visible && this._areaHeaderRevealed ? tiles : nothing}
        </div>
      </div>
    `;
  }

  private _renderAreaHeaderReadings(areaData: AreaData) {
    return [
      areaData.temperature ? html`
        <span class="dd-page-header-reading temperature" title=${this._t('home.temperature')}>
          <ha-icon icon="mdi:thermometer" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t('home.temperature')}</span>
          ${areaData.temperature}
        </span>
      ` : nothing,
      areaData.humidity ? html`
        <span class="dd-page-header-reading humidity" title=${this._t('home.humidity')}>
          <ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t('home.humidity')}</span>
          ${areaData.humidity}
        </span>
      ` : nothing,
      areaData.wattage ? html`
        <span class="dd-page-header-reading wattage" title=${this._t('entity.power_usage')}>
          <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t('entity.power_usage')}</span>
          ${areaData.wattage}
        </span>
      ` : nothing,
    ];
  }

  private _renderAreaMobileCameraAction(entities: EntityConfig[]) {
    const camera = entities.find(entity => {
      if (!entity.entity_id.startsWith('camera.')) return false;
      const state = this.hass?.states?.[entity.entity_id]?.state;
      return Boolean(state && state !== 'unavailable' && state !== 'unknown');
    });
    if (!camera) return nothing;

    return html`
      <button
        class="dd-page-header-button"
        type="button"
        title=${this._t('action.open_camera')}
        aria-label=${this._t('action.open_camera')}
        @click=${() => this._showMoreInfo(camera.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `;
  }

  private _openAreaClimateControls(areaId: string, climates: EntityConfig[]): void {
    if (climates.length === 0) return;
    if (climates.length === 1) {
      this._showMoreInfo(climates[0]!.entity_id);
      return;
    }

    showDomainEntitiesDialog(this, {
      domain: 'climate',
      areaId,
      config: this.config,
      customTitle: getDomainName(this.hass, 'climate'),
      customEntities: climates.map(entity => entity.entity_id),
    });
  }

  private async _toggleAreaSwitches(areaId: string) {
    const entities = this._getFilteredAreaEntities(areaId);
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    if (switches.length === 0) return;

    const allOff = this._areAllEntitiesOff(switches, 'switch');
    const confirmed = await this._confirmMasterActionIfNeeded('switch', allOff, switches.length, areaId);
    if (!confirmed) return;

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = switches.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, allOff ? 'on' : 'off');

    try {
      await this.hass.callService('switch', service, {
        entity_id: entityIds
      });

      this._showToast(this._t(allOff ? 'action.all_switches_on' : 'action.all_switches_off'));
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle switches in area ${areaId}:`, err);
      this._showToast(this._t('entity.switches_failed'));
    }
  }

  private async _toggleAreaFans(areaId: string) {
    const entities = this._getFilteredAreaEntities(areaId);
    const fans = entities.filter(entity => entity.entity_id.startsWith('fan.'));
    if (fans.length === 0) return;

    const allOff = this._areAllEntitiesOff(fans, 'fan');
    const confirmed = await this._confirmMasterActionIfNeeded('fan', allOff, fans.length, areaId);
    if (!confirmed) return;
    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = fans.map(entity => entity.entity_id);

    this._setOptimisticEntityStates(entityIds, allOff ? 'on' : 'off');

    try {
      await this.hass.callService('fan', service, { entity_id: entityIds });
      this._showToast(this._t(allOff ? 'action.all_fans_on' : 'action.all_fans_off'));
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle fans in area ${areaId}:`, err);
      this._showToast(this._t('entity.fans_failed'));
    }
  }

  private async _setAreaCoverState(
    areaId: string,
    open: boolean,
    groupKey?: 'cover_shading' | 'cover_openings' | 'cover_gates'
  ) {
    const entities = this._getFilteredAreaEntities(areaId);
    const covers = entities.filter(e =>
      e.entity_id.startsWith('cover.') &&
      (!groupKey || getAreaEntityGroupKey(e.entity_id, this.hass) === groupKey)
    );
    if (covers.length === 0) return;

    const confirmed = await this._confirmMasterActionIfNeeded('cover', open, covers.length, areaId);
    if (!confirmed) return;

    const service = open ? 'open_cover' : 'close_cover';
    const entityIds = covers.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, open ? 'open' : 'closed');

    try {
      await this.hass.callService('cover', service, {
        entity_id: entityIds
      });

      this._showToast(this._t(open ? 'action.open_all' : 'action.close_all'));
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to ${open ? 'open' : 'close'} covers in area ${areaId}:`, err);
      this._showToast(this._t('entity.covers_failed'));
    }
  }

  private _renderAreaView() {
    if (!this._selectedArea) return nothing;

    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    if (!area) return nothing;

    const visibleAreaEntities = this._getFilteredAreaEntities(this._selectedArea);
    const areaEntities = this._editMode
      ? this._getEditableAreaEntities(this._selectedArea)
      : visibleAreaEntities;
    const areaData = this._getCachedAreaData(area);
    const hasPicture = Boolean(area.picture);
    const deviceCount = this._getAreaDeviceCount(area.area_id, visibleAreaEntities);
    const thermostatEntityId = this._areaThermostatEntityId(visibleAreaEntities);
    const quickControlEntities = thermostatEntityId
      ? visibleAreaEntities.filter(entity => entity.entity_id !== thermostatEntityId)
      : visibleAreaEntities;
    const deviceLabel = this._tp('common.device', deviceCount);
    const tiles = this._renderAreaQuickTiles(area.area_id, quickControlEntities);
    const hasStrip = tiles !== nothing || Boolean(thermostatEntityId);
    const quickControlCount = this._areaQuickControlCount(quickControlEntities, thermostatEntityId);
    const quickPageCount = Math.max(1, Math.ceil(quickControlCount / 3));
    const activeQuickPage = Math.min(this._areaQuickPage, quickPageCount - 1);

    // Keep the current Home navigation semantics, but place it in the same
    // structural slot that the v1.11.0 header styles expect.
    const homeButton = html`
      <button
        class="dd-page-header-button dd-page-header-home"
        type="button"
        title=${this._t('sidebar.home')}
        aria-label=${this._t('navigation.back_home')}
        @click=${() => this._selectView('home')}
      >
        <ha-icon icon="mdi:home"></ha-icon>
      </button>
    `;

    const headerActionEntities = this._getEditableAreaEntities(area.area_id);
    const actions = html`
      ${this._renderAreaMobileCameraAction(headerActionEntities)}
      ${this._renderUnavailableEntitiesIcon(area.area_id)}
      ${this._canManageDashboard() ? html`
        <button
          class="dd-page-header-button ${this._editMode ? 'is-active' : ''}"
          type="button"
          aria-pressed=${this._editMode ? 'true' : 'false'}
          title=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
          aria-label=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
          @click=${this._toggleEditMode}
        >
          <ha-icon icon=${this._editMode ? 'mdi:check' : 'mdi:view-dashboard-edit-outline'}></ha-icon>
        </button>
      ` : nothing}
    `;

    return html`
      <div class="area-view">
        ${this._isMobile
          ? this._renderAreaCompactBar(area, areaData, deviceLabel, homeButton, actions, tiles)
          : nothing}

        <header class="dd-page-header room-header ${hasPicture ? 'has-room-background' : ''}">
          ${hasPicture && !this._isMobile ? html`
            <div
              class="dd-page-header-room-background"
              aria-hidden="true"
              style=${`background-image: url('${area.picture}');`}
            ></div>
          ` : nothing}
          <div class="dd-page-header-with-media">
            <div class="dd-page-header-media-tile" aria-hidden="true">
              ${hasPicture
                ? html`<div class="dd-page-header-room-picture" style=${`background-image: url('${area.picture}');`}></div>`
                : html`
                    <div class="dd-page-header-room-icon">
                      <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                    </div>
                  `}
            </div>

            <div class="dd-page-header-main">
              <div class="dd-page-header-top">
                <div class="dd-page-header-identity">
                  <div class="dd-page-header-copy">
                    <div class="dd-page-header-title-row">
                      ${homeButton}
                      <ha-icon class="dd-page-header-title-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
                      <h1 class="dd-page-header-title">${area.name}</h1>
                    </div>
                    <div class="dd-page-header-subtitle">
                      <span class="dd-page-header-device-label">${deviceLabel}</span>
                      ${this._renderAreaHeaderReadings(areaData)}
                    </div>
                  </div>
                </div>
                <div class="dd-page-header-actions">${actions}</div>
              </div>

              <div class="dd-room-quick-wrap">
                <div
                  class="dd-page-header-strip ${hasStrip ? '' : 'is-placeholder'}"
                  aria-hidden=${hasStrip ? 'false' : 'true'}
                  data-page-count=${quickPageCount}
                  data-control-count=${quickControlCount}
                  style=${!this._isMobile && quickControlCount > 3
                    ? `--dd-room-quick-columns: ${Math.ceil(quickControlCount / 2)};`
                    : ''}
                  @scroll=${this._handleAreaQuickScroll}
                >
                  ${hasStrip ? html`
                    ${tiles}
                    ${thermostatEntityId ? html`
                      <dwains-dashboard-next-area-thermostat
                        .hass=${this.hass}
                        .entityId=${thermostatEntityId}
                        .roomName=${area.name}
                        .compactVertical=${this._isMobile}
                      ></dwains-dashboard-next-area-thermostat>
                    ` : nothing}
                  ` : nothing}
                </div>
                ${this._isMobile && hasStrip && quickPageCount > 1 ? html`
                  <div class="dd-room-quick-dots" aria-label="Schnellsteuerung Seiten">
                    ${Array.from({ length: quickPageCount }, (_, index) => html`
                      <button
                        class="dd-room-quick-dot ${index === activeQuickPage ? 'active' : ''}"
                        type="button"
                        aria-label=${`Seite ${index + 1} von ${quickPageCount}`}
                        aria-current=${index === activeQuickPage ? 'true' : 'false'}
                        @click=${() => this._scrollAreaQuickToPage(index)}
                      ></button>
                    `)}
                  </div>
                ` : nothing}
              </div>
            </div>
          </div>
        </header>

        ${this._renderCustomCardSlot(area.area_id, 'top', this._t('layout.custom_cards_top'))}
        ${this._renderMobileEntitiesSection(area, areaEntities)}
        ${this._renderCustomCardSlot(area.area_id, 'bottom', this._t('layout.custom_cards_bottom'))}
      </div>
    `;
  }

  private _renderRoomFavoritesBlock() {
    const favoriteCount = this._getEffectiveFavoriteEntities().length;
    if (!favoriteCount) return nothing;

    const toggleFavorites = () => this._toggleHeader();
    const onFavoritesKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleFavorites();
    };

    return html`
      <section class="room-favorites-block ${this._headerExpanded ? '' : 'is-collapsed'}">
        <div
          class="mobile-domain-header room-favorites-header expandable-header"
          role="button"
          tabindex="0"
          aria-expanded=${this._headerExpanded ? 'true' : 'false'}
          @click=${toggleFavorites}
          @keydown=${onFavoritesKeydown}
        >
          <div class="mobile-domain-title room-favorites-title">
            <ha-icon
              class="mobile-domain-leading-chevron"
              icon=${this._headerExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
              aria-hidden="true"
            ></ha-icon>
            <span class="room-domain-icon room-favorites-icon" aria-hidden="true">
              <ha-icon icon="mdi:star"></ha-icon>
            </span>
            <span class="mobile-domain-title-copy">
              <span class="mobile-domain-title-label">${this._t('favorites.title')}</span>
              <span class="mobile-domain-count">(${favoriteCount})</span>
            </span>
          </div>

        </div>

        <div class="room-favorites-content" style=${this._headerExpanded ? '' : 'display:none'}>
          ${this._renderFavoritesSection()}
        </div>
      </section>
    `;
  }

  private _toggleEditMode = () => {
    if (!this._canManageDashboard()) {
      this._editMode = false;
      this._rememberAreaEditMode(null);
      return;
    }
    this._editMode = !this._editMode;
    this._rememberAreaEditMode(
      this._editMode && this._selectedView === 'area' ? this._selectedArea : null
    );
  };

  // Area custom cards, grouped by placement around the standard area sections.
  private _renderCustomCardSlot(areaId: string, placement: string, label: string, afterDomain = false) {
    const canEdit = this._canManageDashboard();
    if (!canEdit && this._editMode) this._editMode = false;

    const cards = this._getAreaCustomCards(areaId).filter(entry => entry.placement === placement);
    if (cards.length === 0 && !this._editMode) return nothing;

    const dragOver = this._customCardDragOver?.areaId === areaId &&
      this._customCardDragOver.placement === placement &&
      this._customCardDragOver.index === cards.length;

    const classes = {
      'dd-custom-section': true,
      'after-domain': afterDomain,
      editing: this._editMode && canEdit,
      'drag-over': Boolean(dragOver),
    };

    return html`
      <div
        class=${classMap(classes)}
        @dragover=${(event: DragEvent) => this._handleCustomSlotDragOver(event, areaId, placement, cards.length)}
        @drop=${(event: DragEvent) => this._handleCustomCardDrop(event, areaId, placement, cards.length)}
      >
        ${(this._editMode && canEdit) || cards.length
          ? html`
              <div class="dd-custom-slot-head">
                <div class="dd-custom-slot-title">
                  <ha-icon icon="mdi:cards-outline"></ha-icon>
                  <span>${this._editMode && canEdit ? label : this._t('layout.custom_cards')}</span>
                </div>
                ${this._editMode && canEdit ? html`
                  <button class="dd-add-card-inline" @click=${() => this._addCard(areaId, placement, cards.length)}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    <span>${this._t('layout.add_card')}</span>
                  </button>
                ` : nothing}
              </div>
            `
          : nothing}
        <div class="dd-custom-grid">
          ${repeat(
            cards,
            entry => entry.id,
            (entry, index) => this._renderCustomCard(areaId, entry, index)
          )}
        </div>
      </div>
    `;
  }

  private _renderCustomCard(areaId: string, entry: NormalizedAreaCustomCard, index: number) {
    const dragging = this._customCardDrag?.areaId === areaId && this._customCardDrag.cardId === entry.id;
    const dragOver = this._customCardDragOver?.areaId === areaId &&
      this._customCardDragOver.placement === entry.placement &&
      this._customCardDragOver.index === index;

    const classes = {
      'dd-custom-card-wrap': true,
      'dd-grid-full': entry.card?.grid_options?.columns === 'full',
      'dd-grid-wide': this._customCardNeedsWideLayout(entry.card),
      editing: this._editMode,
      dragging,
      'drag-over': dragOver,
    };

    // dwains-dashboard-next-card-host manages the HA card in its own light DOM.
    return html`
      <div
        class=${classMap(classes)}
        style=${styleMap(this._customCardGridStyle(entry.card))}
        .draggable=${this._editMode}
        @dragstart=${(event: DragEvent) => this._handleCustomCardDragStart(event, areaId, entry.id)}
        @dragover=${(event: DragEvent) => this._handleCustomSlotDragOver(event, areaId, entry.placement, index)}
        @drop=${(event: DragEvent) => this._handleCustomCardDrop(event, areaId, entry.placement, index)}
        @dragend=${this._clearCustomCardDragState}
      >
        <div class="dd-card-toolbar">
          <button class="drag" title=${this._t('layout.drag_card')} aria-label=${this._t('layout.drag_card')}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button title=${this._t('common.edit')} @click=${() => this._editCard(areaId, entry.id)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button class="del" title=${this._t('common.delete')} @click=${() => this._deleteCard(areaId, entry.id)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dwains-dashboard-next-card-host .hass=${this.hass} .config=${entry.card}></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  private _customCardNeedsWideLayout(card: any): boolean {
    const type = String(card?.type || '').replace(/^custom:/, '');
    return [
      'todo-list',
      'calendar',
      'map',
      'history-graph',
      'statistics-graph',
      'logbook',
    ].includes(type);
  }

  private _customCardGridStyle(card: any): Record<string, string> {
    const options = card?.grid_options;
    if (!options || typeof options !== 'object') return {};

    const styles: Record<string, string> = {};
    if (options.columns === 'full') {
      styles['--dd-card-grid-column'] = '1 / -1';
    } else if (typeof options.columns === 'number' && Number.isFinite(options.columns)) {
      const columns = Math.max(1, Math.min(12, Math.round(options.columns)));
      styles['--dd-card-grid-column'] = `span ${columns}`;
    }

    if (typeof options.rows === 'number' && Number.isFinite(options.rows)) {
      const rows = Math.max(1, Math.min(12, Math.round(options.rows)));
      styles['--dd-card-grid-min-height'] = `${rows * 56 + (rows - 1) * 8}px`;
    }

    return styles;
  }

  private _getDomainSlotCustomCards(
    areaId: string,
    groupKey: string,
    slotIndex: number,
    entityCount: number
  ): NormalizedAreaCustomCard[] {
    const placement = this._customCardPlacementInDomain(groupKey, slotIndex);
    const legacyAfterPlacement = this._customCardPlacementAfter(groupKey);
    const legacyCoverGroup = groupKey === 'cover_openings' ? 'cover' : undefined;

    return this._getAreaCustomCards(areaId).filter(entry => {
      if (entry.placement === placement) return true;
      const domainPlacementIndex = this._domainCustomCardPlacementIndex(entry.placement, groupKey);
      if (slotIndex === entityCount && domainPlacementIndex !== undefined && domainPlacementIndex > entityCount) {
        return true;
      }
      if (legacyCoverGroup) {
        const legacyPlacement = this._customCardPlacementInDomain(legacyCoverGroup, slotIndex);
        if (entry.placement === legacyPlacement) return true;
        const legacyIndex = this._domainCustomCardPlacementIndex(entry.placement, legacyCoverGroup);
        if (slotIndex === entityCount && legacyIndex !== undefined && legacyIndex > entityCount) return true;
        if (slotIndex === entityCount && entry.placement === this._customCardPlacementAfter(legacyCoverGroup)) return true;
      }
      return slotIndex === entityCount && entry.placement === legacyAfterPlacement;
    });
  }

  private _domainCustomCardPlacementIndex(placement: string, groupKey: string): number | undefined {
    const prefix = `domain:${groupKey}:`;
    if (!placement.startsWith(prefix)) return undefined;
    const index = Number(placement.slice(prefix.length));
    return Number.isFinite(index) && index >= 0 ? index : undefined;
  }

  private _placementIndexForCard(
    entry: NormalizedAreaCustomCard,
    placementCounts: Map<string, number>
  ): number {
    const index = placementCounts.get(entry.placement) || 0;
    placementCounts.set(entry.placement, index + 1);
    return index;
  }

  private _renderDomainCustomCardSlot(
    areaId: string,
    groupKey: string,
    slotIndex: number,
    entityCount: number
  ) {
    const canEdit = this._canManageDashboard();
    if (!canEdit && this._editMode) this._editMode = false;

    const placement = this._customCardPlacementInDomain(groupKey, slotIndex);
    const cards = this._getDomainSlotCustomCards(areaId, groupKey, slotIndex, entityCount);
    const domainPlacementCardCount = cards.filter(entry => entry.placement === placement).length;
    const placementCounts = new Map<string, number>();
    const dragOver = this._customCardDragOver?.areaId === areaId &&
      this._customCardDragOver.placement === placement &&
      this._customCardDragOver.index === domainPlacementCardCount;

    if (cards.length === 0 && !this._editMode) return nothing;

    return html`
      ${cards.map(entry => this._renderCustomCard(
        areaId,
        entry,
        this._placementIndexForCard(entry, placementCounts)
      ))}
      ${this._editMode && canEdit && slotIndex === entityCount ? html`
        <button
          class="dd-add-card dd-domain-add-card dd-domain-add-card-final ${dragOver ? 'drag-over' : ''}"
          @click=${() => this._addCard(areaId, placement, domainPlacementCardCount)}
          @dragover=${(event: DragEvent) => this._handleCustomSlotDragOver(event, areaId, placement, domainPlacementCardCount)}
          @drop=${(event: DragEvent) => this._handleCustomCardDrop(event, areaId, placement, domainPlacementCardCount)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t('layout.add_card')}</span>
        </button>
      ` : nothing}
    `;
  }

  private _renderUngroupedCustomCardSlot(areaId: string, slotIndex: number, entityCount: number) {
    const canEdit = this._canManageDashboard();
    if (!canEdit && this._editMode) this._editMode = false;

    const placement = `ungrouped:${Math.max(0, slotIndex)}`;
    const cards = this._getAreaCustomCards(areaId).filter((entry) => entry.placement === placement);
    const dragOver = this._customCardDragOver?.areaId === areaId &&
      this._customCardDragOver.placement === placement &&
      this._customCardDragOver.index === cards.length;
    if (!cards.length && !this._editMode) return nothing;

    return html`
      ${cards.map((entry, index) => this._renderCustomCard(areaId, entry, index))}
      ${this._editMode && canEdit && slotIndex === entityCount ? html`
        <button
          class="dd-add-card dd-domain-add-card dd-domain-add-card-final ${dragOver ? 'drag-over' : ''}"
          @click=${() => this._addCard(areaId, placement, cards.length)}
          @dragover=${(event: DragEvent) => this._handleCustomSlotDragOver(event, areaId, placement, cards.length)}
          @drop=${(event: DragEvent) => this._handleCustomCardDrop(event, areaId, placement, cards.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t('layout.add_card')}</span>
        </button>
      ` : nothing}
    `;
  }

  // Dispatch een show-dialog event voor een (native HA) dialog dat al
  // geregistreerd is. De dialog-manager maakt het element aan.
  private _fireNativeDialog(tag: string, dialogParams: any) {
    this.dispatchEvent(new CustomEvent('show-dialog', {
      bubbles: true,
      composed: true,
      detail: { dialogTag: tag, dialogImport: () => Promise.resolve(), dialogParams },
    }));
  }

  private _customCardPlacementAfter(groupKey: string): string {
    return `after:${groupKey}`;
  }

  private _customCardPlacementInDomain(groupKey: string, index: number): string {
    return `domain:${groupKey}:${Math.max(0, index)}`;
  }

  private _customCardId(): string {
    return `area-card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private _getAreaCustomCards(areaId: string): NormalizedAreaCustomCard[] {
    const options: any = this.config?.areas_options?.[areaId] || {};
    return Array.isArray(options.custom_cards)
      ? options.custom_cards
          .map((entry: any, index: number) => ({
            id: String(entry?.id || `generated-${index}`),
            placement: String(entry?.placement || 'bottom'),
            card: entry?.card,
          }))
          .filter((entry: NormalizedAreaCustomCard) => entry.card && typeof entry.card === 'object')
      : [];
  }

  private _getPersistableAreaCustomCards(areaId: string): AreaCustomCard[] {
    return this._getAreaCustomCards(areaId).map(entry => ({
      id: entry.id,
      placement: entry.placement || 'bottom',
      card: entry.card,
    }));
  }

  private _normalizeAreaCustomCardsForSave(customCards: AreaCustomCard[]): AreaCustomCard[] {
    return customCards.map(entry => ({
      id: entry.id.startsWith('generated-') ? this._customCardId() : entry.id,
      placement: entry.placement || 'bottom',
      card: entry.card,
    }));
  }

  private _insertIndexForPlacement(cards: AreaCustomCard[], placement: string, placementIndex: number): number {
    let seenInPlacement = 0;
    let lastInPlacement = -1;

    for (let index = 0; index < cards.length; index += 1) {
      const candidate = cards[index];
      if (!candidate || candidate.placement !== placement) continue;
      if (seenInPlacement >= placementIndex) return index;
      seenInPlacement += 1;
      lastInPlacement = index;
    }

    return lastInPlacement >= 0 ? lastInPlacement + 1 : cards.length;
  }

  private _insertAreaCustomCard(areaId: string, card: any, placement: string, placementIndex: number): void {
    const cards = this._getPersistableAreaCustomCards(areaId);
    const insertAt = this._insertIndexForPlacement(cards, placement, placementIndex);
    cards.splice(insertAt, 0, {
      id: this._customCardId(),
      placement,
      card,
    });
    void this._saveAreaCustomCards(areaId, cards);
  }

  private _replaceAreaCustomCard(areaId: string, cardId: string, card: any): void {
    const cards = this._getPersistableAreaCustomCards(areaId);
    const index = cards.findIndex(entry => entry.id === cardId);
    if (index < 0) return;
    const existing = cards[index];
    if (!existing) return;
    cards[index] = { ...existing, card };
    void this._saveAreaCustomCards(areaId, cards);
  }

  private _addCard(areaId: string, placement = 'bottom', placementIndex = Number.POSITIVE_INFINITY) {
    if (!this._canManageDashboard()) return;
    // Probeer HA's eigen kaart-picker (+ visuele editor). Die is geladen zodra
    // je 'm één keer in een normaal dashboard hebt gebruikt.
    if (customElements.get('hui-dialog-create-card')) {
      const areaName = this.config?.areas?.find(a => a.area_id === areaId)?.name || 'Dwains';
      const lovelaceConfig = {
        views: [{
          title: areaName,
          type: 'sections',
          sections: [{ type: 'grid', cards: [] }],
        }],
      };
      this._fireNativeDialog('hui-dialog-create-card', {
        lovelaceConfig,
        path: [0, 0],
        saveConfig: (newConfig: any) => {
          const newCards = newConfig?.views?.[0]?.sections?.[0]?.cards || [];
          const added = newCards[newCards.length - 1];
          if (added) {
            this._insertAreaCustomCard(areaId, added, placement, placementIndex);
          }
        },
      });
    } else {
      this._addCardYaml(areaId, placement, placementIndex);
    }
  }

  private _editCard(areaId: string, cardId: string) {
    if (!this._canManageDashboard()) return;
    const existing = this._getAreaCustomCards(areaId).find(entry => entry.id === cardId)?.card;
    if (!existing) return;

    // Probeer HA's eigen visuele kaart-editor (formulier + code-toggle).
    if (customElements.get('hui-dialog-edit-card')) {
      const sectionConfig = { type: 'grid', cards: [existing] };
      const lovelaceConfig = {
        views: [{
          title: 'Dwains',
          type: 'sections',
          sections: [sectionConfig],
        }],
      };
      this._fireNativeDialog('hui-dialog-edit-card', {
        lovelaceConfig,
        cardConfig: existing,
        sectionConfig,
        saveCardConfig: (newCard: any) => {
          if (newCard?.type) this._replaceAreaCustomCard(areaId, cardId, newCard);
        },
      });
    } else {
      this._editCardYaml(areaId, cardId);
    }
  }

  private _addCardYaml(areaId: string, placement = 'bottom', placementIndex = Number.POSITIVE_INFINITY) {
    if (!this._canManageDashboard()) return;
    showCardEditorDialog(this, {
      areaName: this.config?.areas?.find(a => a.area_id === areaId)?.name,
      onSave: (card) => {
        this._insertAreaCustomCard(areaId, card, placement, placementIndex);
      },
    });
  }

  private _editCardYaml(areaId: string, cardId: string) {
    if (!this._canManageDashboard()) return;
    const existing = this._getAreaCustomCards(areaId).find(entry => entry.id === cardId)?.card;
    if (!existing) return;
    showCardEditorDialog(this, {
      card: existing,
      areaName: this.config?.areas?.find(a => a.area_id === areaId)?.name,
      onSave: (card) => {
        this._replaceAreaCustomCard(areaId, cardId, card);
      },
    });
  }

  private _deleteCard(areaId: string, cardId: string) {
    if (!this._canManageDashboard()) return;
    if (!confirm(this._t('layout.delete_card_confirm'))) return;
    const cards = this._getPersistableAreaCustomCards(areaId).filter(entry => entry.id !== cardId);
    void this._saveAreaCustomCards(areaId, cards);
  }

  private _handleCustomCardDragStart(event: DragEvent, areaId: string, cardId: string): void {
    if (!this._editMode || !this._canManageDashboard()) {
      event.preventDefault();
      return;
    }

    this._clearGeneratedCardDragState();
    this._customCardDrag = { areaId, cardId };
    this._customCardDragOver = null;
    event.dataTransfer?.setData('text/plain', cardId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  private _handleCustomSlotDragOver(event: DragEvent, areaId: string, placement: string, index: number): void {
    if (!this._editMode || !this._customCardDrag || this._customCardDrag.areaId !== areaId) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this._customCardDragOver = { areaId, placement, index };
  }

  private _handleCustomCardDrop(event: DragEvent, areaId: string, placement: string, placementIndex: number): void {
    if (!this._customCardDrag || this._customCardDrag.areaId !== areaId) return;
    event.preventDefault();
    event.stopPropagation();

    this._moveAreaCustomCard(areaId, this._customCardDrag.cardId, placement, placementIndex);
    this._clearCustomCardDragState();
  }

  private _moveAreaCustomCard(areaId: string, cardId: string, placement: string, placementIndex: number): void {
    const cards = this._getPersistableAreaCustomCards(areaId);
    const currentIndex = cards.findIndex(entry => entry.id === cardId);
    if (currentIndex < 0) return;

    const currentCard = cards[currentIndex];
    if (!currentCard) return;
    const currentPlacement = currentCard.placement || 'bottom';
    const currentPlacementIndex = cards
      .slice(0, currentIndex)
      .filter(entry => entry.placement === currentPlacement)
      .length;
    const [card] = cards.splice(currentIndex, 1);
    if (!card) return;
    let nextPlacementIndex = placementIndex;
    if (currentPlacement === placement && currentPlacementIndex < placementIndex) {
      nextPlacementIndex = Math.max(0, placementIndex - 1);
    }

    card.placement = placement;
    const insertAt = this._insertIndexForPlacement(cards, placement, nextPlacementIndex);
    cards.splice(insertAt, 0, card);
    void this._saveAreaCustomCards(areaId, cards);
  }

  private _clearCustomCardDragState = (): void => {
    this._customCardDrag = null;
    this._customCardDragOver = null;
  };

  private _getDashboardUrlPath(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    if (!seg || seg === 'lovelace') return undefined;
    return seg;
  }

  private async _saveAreaCustomCards(areaId: string, customCards: AreaCustomCard[]): Promise<void> {
    const cardsToSave = this._normalizeAreaCustomCardsForSave(customCards);
    await this._saveAreaOptionsPatch(areaId, { custom_cards: cardsToSave });
  }

  private async _saveAreaOptionsPatch(areaId: string, patch: Record<string, any>): Promise<void> {
    if (!this._canManageDashboard()) return;
    const keepEditing = this._editMode && this._selectedView === 'area' && this._selectedArea === areaId;
    if (keepEditing) this._rememberAreaEditMode(areaId);

    // Update local config immediately so drag and visibility actions feel responsive.
    const prevOptions: any = this.config.areas_options || {};
    this.config = {
      ...this.config,
      areas_options: {
        ...prevOptions,
        [areaId]: { ...(prevOptions[areaId] || {}), ...patch },
      },
    };
    if (keepEditing) this._editMode = true;
    this.requestUpdate();

    try {
      const urlPath = this._getDashboardUrlPath();
      const base = urlPath ? { url_path: urlPath } : {};
      const lovelaceConfig: any = await this.hass.callWS({ type: 'lovelace/config', ...base });
      if (lovelaceConfig && lovelaceConfig.strategy) {
        const strat = lovelaceConfig.strategy;
        const stratOptions = strat.areas_options || {};
        const newConfig = {
          ...lovelaceConfig,
          strategy: {
            ...strat,
            areas_options: {
              ...stratOptions,
              [areaId]: { ...(stratOptions[areaId] || {}), ...patch },
            },
          },
        };
        await this.hass.callWS({ type: 'lovelace/config/save', ...base, config: newConfig });
        console.log('✅ Area options saved for', areaId);
      } else {
        console.warn('⚠️ No dashboard strategy found; area options were not saved', lovelaceConfig);
      }
    } catch (e) {
      console.error('❌ Saving area options failed:', e);
      alert(this._t('layout.save_card_failed', { error: String(e) }));
    }
  }

  private _renderMobileEntitiesSection(area: AreaConfig, entities: EntityConfig[]) {
    const orderedEntities = this._sortAreaEntities(area.area_id, entities);
    if (this.config?.areas_options?.[area.area_id]?.entity_layout === 'ungrouped') {
      return this._renderUngroupedAreaEntities(area, orderedEntities);
    }

    const groups = this._sortAreaEntityGroups(
      area.area_id,
      this._mobileEntityGroups(area.area_id, orderedEntities)
    );
    if (!groups.length) return nothing;
    const renderedGroups = this._isMobile && !this._editMode && !this._renderAllMobileAreaEntities && groups.length > MOBILE_INITIAL_ENTITY_GROUPS
      ? groups.slice(0, MOBILE_INITIAL_ENTITY_GROUPS)
      : groups;

    return html`
      <section class="mobile-entities-section layout-${this._mobileEntityLayout}">
        ${renderedGroups.map((group) => {
          const hasActions = this._mobileControllableEntities(group.entities).length > 0;
          const collapseKey = `${area.area_id}:${group.key}`;
          const groupCollapsed = !this._editMode && Boolean(this._collapsedAreaGroups[collapseKey]);
          const groupDomain = group.entities[0]?.entity_id.split('.')[0] || group.key;
          const groupDeviceClass = group.entities[0]
            ? this.hass.states[group.entities[0].entity_id]?.attributes?.device_class
            : undefined;
          const groupColor = group.key === 'cover_openings'
            ? getDomainColor('binary_sensor', 'opening')
            : (group.key === 'cover_shading' || group.key === 'cover_gates')
              ? getDomainColor('cover')
              : group.key === 'motion'
                ? getDomainColor('binary_sensor', 'motion')
                : group.key === 'safety'
                  ? getDomainColor('binary_sensor', 'smoke')
                  : getDomainColor(groupDomain, groupDeviceClass);
          const renderedEntities = this._isMobile && !this._editMode && !this._renderAllMobileAreaEntities && group.entities.length > MOBILE_INITIAL_ENTITY_CARDS
            ? group.entities.slice(0, MOBILE_INITIAL_ENTITY_CARDS)
            : group.entities;
          const renderedEntityIds = renderedEntities.map(entity => entity.entity_id);

          return html`
            <div
              class=${classMap({
                'mobile-domain-group': true,
                'group-editing': this._editMode && this._canManageDashboard(),
                'group-dragging': this._generatedGroupDrag?.areaId === area.area_id &&
                  this._generatedGroupDrag.groupKey === group.key,
                'group-drag-over': this._generatedGroupDragOver?.areaId === area.area_id &&
                  this._generatedGroupDragOver.groupKey === group.key,
                'is-collapsed': groupCollapsed,
              })}
              @dragover=${(event: DragEvent) => this._handleGeneratedGroupDragOver(event, area.area_id, group.key)}
              @drop=${(event: DragEvent) => this._handleGeneratedGroupDrop(
                event,
                area.area_id,
                group.key,
                groups.map(item => item.key)
              )}
            >
              <div
                class="mobile-domain-header expandable-header"
                role="button"
                tabindex="0"
                aria-expanded=${groupCollapsed ? 'false' : 'true'}
                @click=${() => {
                  if (this._editMode) return;
                  this._collapsedAreaGroups = {
                    ...this._collapsedAreaGroups,
                    [collapseKey]: !groupCollapsed,
                  };
                }}
                @keydown=${(event: KeyboardEvent) => {
                  if (this._editMode || (event.key !== 'Enter' && event.key !== ' ')) return;
                  event.preventDefault();
                  this._collapsedAreaGroups = {
                    ...this._collapsedAreaGroups,
                    [collapseKey]: !groupCollapsed,
                  };
                }}
              >
                <div
                  class="mobile-domain-title"
                  style=${`--domain-color: ${groupColor};`}
                >
                  ${this._editMode && this._canManageDashboard() ? html`
                    <button
                      class="mobile-domain-leading-drag-handle"
                      type="button"
                      draggable="true"
                      title=${this._t('layout.drag_group')}
                      aria-label=${this._t('layout.drag_group')}
                      @click=${(event: Event) => event.stopPropagation()}
                      @dragstart=${(event: DragEvent) => this._handleGeneratedGroupDragStart(
                        event,
                        area.area_id,
                        group.key
                      )}
                      @dragend=${this._clearGeneratedGroupDragState}
                    >
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </button>
                  ` : html`
                    <ha-icon
                      class="mobile-domain-leading-chevron"
                      icon=${groupCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
                      aria-hidden="true"
                    ></ha-icon>
                  `}
                  <span class="room-domain-icon" aria-hidden="true">
                    <ha-icon icon=${group.key === 'todo' ? 'mdi:clipboard-list-outline' : this._mobileGroupIcon(group.key)}></ha-icon>
                  </span>
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${group.name}</span>
                    ${group.entities.length > 0 ? html`
                      <span class="mobile-domain-count">(${group.entities.length})</span>
                    ` : nothing}
                  </span>
                </div>

                <div
                  class="mobile-domain-header-actions"
                  @click=${(event: Event) => event.stopPropagation()}
                  @keydown=${(event: KeyboardEvent) => event.stopPropagation()}
                >
                  ${hasActions ? this._renderMobileDomainMaster(group) : nothing}
                </div>
	              </div>
	              <div class="mobile-entity-rail" style=${groupCollapsed ? 'display:none' : ''}>
	                ${this._renderDomainCustomCardSlot(area.area_id, group.key, 0, renderedEntities.length)}
	                ${repeat(
	                  renderedEntities,
	                  entity => entity.entity_id,
	                  (entity, index) => html`
                      ${this._renderEditableGeneratedCard(area, entity, group.key, index, renderedEntityIds)}
                      ${this._renderDomainCustomCardSlot(area.area_id, group.key, index + 1, renderedEntities.length)}
                    `
	                )}
	              </div>
	            </div>
	          `;
	        })}
      </section>
    `;
  }

  private _renderUngroupedAreaEntities(area: AreaConfig, entities: EntityConfig[]) {
    const hasPlacedCustomCards = this._getAreaCustomCards(area.area_id).some((entry) =>
      entry.placement.startsWith('ungrouped:') ||
      entry.placement.startsWith('domain:') ||
      entry.placement.startsWith('after:')
    );
    if (!entities.length && !hasPlacedCustomCards && !this._editMode) return nothing;

    const gridMode = this._mobileEntityLayout === 'grid';
    const groupTotals = new Map<string, number>();
    entities.forEach((entity) => {
      const key = this._mobileEntityTypeKey(entity.entity_id) || 'other';
      groupTotals.set(key, (groupTotals.get(key) || 0) + 1);
    });

    const groupIndexes = new Map<string, number>();
    return html`
      <section class="mobile-entities-section area-ungrouped-entities layout-${this._mobileEntityLayout}">
        <div class="mobile-domain-group area-ungrouped-group">
          <div class="mobile-domain-header">
            <div class="mobile-domain-title">
              <button
                class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
                type="button"
                title=${gridMode ? this._t('layout.swipe_cards') : this._t('layout.show_all_cards')}
                aria-label=${gridMode ? this._t('layout.switch_swipe_cards') : this._t('layout.show_all_cards')}
                @click=${this._toggleMobileEntityLayout}
              >
                <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
              </button>
              <span class="mobile-domain-title-copy">
                <span class="mobile-domain-title-label">${this._t('layout.entities')}</span>
                <span class="mobile-domain-count">(${this._tp('common.entity', entities.length)})</span>
              </span>
            </div>
          </div>
          <div class="mobile-entity-rail">
            ${this._renderUngroupedCustomCardSlot(area.area_id, 0, entities.length)}
            ${entities.map((entity, entityIndex) => {
              const groupKey = this._mobileEntityTypeKey(entity.entity_id) || 'other';
              const groupIndex = groupIndexes.get(groupKey) || 0;
              const groupTotal = groupTotals.get(groupKey) || 0;
              groupIndexes.set(groupKey, groupIndex + 1);
              return html`
                ${groupIndex === 0
                  ? this._renderDomainCustomCardSlot(area.area_id, groupKey, 0, groupTotal)
                  : nothing}
                ${this._renderEditableGeneratedCard(
                  area,
                  entity,
                  UNGROUPED_AREA_EDIT_GROUP,
                  entityIndex,
                  entities.map(item => item.entity_id)
                )}
                ${this._renderDomainCustomCardSlot(area.area_id, groupKey, groupIndex + 1, groupTotal)}
                ${this._renderUngroupedCustomCardSlot(area.area_id, entityIndex + 1, entities.length)}
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }

  private _renderMobileDomainMaster(group: MobileEntityGroup) {
    const entities = this._mobileControllableEntities(group.entities);
    if (!entities.length) return nothing;

    const domain = entities[0]!.entity_id.split('.')[0] || group.key;
    const activeCount = entities.filter((entity) => {
      const state = this._getEffectiveEntityState(this.hass.states[entity.entity_id]);
      return this._isEntityActiveForUi(state, domain);
    }).length;
    const active = activeCount > 0;

    if (domain === 'cover') {
      return this._renderMobileDomainActions(
        domain,
        entities,
        [
          { turnOn: true, label: this._t('action.open_all'), icon: 'mdi:arrow-up', active },
          { turnOn: false, label: this._t('action.close_all'), icon: 'mdi:arrow-down', active: !active },
        ]
      );
    }

    if (domain === 'lock') {
      return this._renderMobileDomainActions(
        domain,
        entities,
        [
          { turnOn: false, label: this._t('action.lock_all'), icon: 'mdi:lock-outline', active: !active },
          { turnOn: true, label: this._t('action.unlock_all'), icon: 'mdi:lock-open-variant-outline', active },
        ]
      );
    }

    const label = this._mobileDomainMasterLabel(domain, active, activeCount, entities.length);
    const icon = this._mobileDomainMasterIcon(domain, active);

    return html`
      <button
        class="mobile-domain-master domain-${domain} ${active ? 'active' : ''}"
        type="button"
        title=${label}
        aria-label=${label}
        aria-pressed=${active ? 'true' : 'false'}
        @click=${(event: Event) => {
          event.stopPropagation();
          void this._requestMobileGroupState(entities, !active, domain);
        }}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span class="mobile-domain-master-count">${activeCount}/${entities.length}</span>
        <span class="mobile-domain-master-track" aria-hidden="true"></span>
      </button>
    `;
  }

  private _renderMobileDomainActions(
    domain: string,
    entities: EntityConfig[],
    actions: Array<{ turnOn: boolean; label: string; icon: string; active: boolean }>
  ) {
    return html`
      <div class="mobile-domain-master-actions domain-${domain}" role="group">
        ${actions.map(action => html`
          <button
            class="mobile-domain-master-action ${action.active ? 'active' : ''}"
            type="button"
            title=${action.label}
            aria-label=${action.label}
            @click=${(event: Event) => {
              event.stopPropagation();
              void this._requestMobileGroupState(entities, action.turnOn, domain);
            }}
          >
            <ha-icon icon=${action.icon}></ha-icon>
          </button>
        `)}
      </div>
    `;
  }

  private _mobileDomainMasterLabel(domain: string, active: boolean, activeCount: number, total: number): string {
    if (domain === 'light') {
      return this._t(active ? 'action.lights_off_summary' : 'action.lights_on_summary', {
        active: activeCount,
        total,
      });
    }
    if (domain === 'cover') {
      return this._t(active ? 'action.covers_close_summary' : 'action.covers_open_summary', {
        active: activeCount,
        total,
      });
    }
    if (domain === 'fan') {
      return this._t(active ? 'action.fans_off_summary' : 'action.fans_on_summary', {
        active: activeCount,
        total,
      });
    }
    if (domain === 'lock') {
      return this._t(active ? 'action.lock' : 'action.unlock');
    }
    return this._t(active ? 'action.switches_off_summary' : 'action.switches_on_summary', {
      active: activeCount,
      total,
    });
  }

  private _mobileDomainMasterIcon(domain: string, active: boolean): string {
    if (domain === 'light') return active ? 'mdi:lightbulb' : 'mdi:lightbulb-outline';
    if (domain === 'switch') return active ? 'mdi:power-plug' : 'mdi:power-plug-off-outline';
    if (domain === 'fan') return active ? 'mdi:fan' : 'mdi:fan-off';
    if (domain === 'cover') return active ? 'mdi:window-shutter-open' : 'mdi:window-shutter';
    if (domain === 'lock') return active ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline';
    return active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline';
  }

  private _customCardDomainGroupKeys(areaId: string): string[] {
    const groupKeys: string[] = [];

    this._getAreaCustomCards(areaId).forEach((entry) => {
      let groupKey: string | undefined;
      if (entry.placement.startsWith('domain:')) {
        const match = /^domain:(.+):\d+$/.exec(entry.placement);
        groupKey = match?.[1];
      } else if (entry.placement.startsWith('after:')) {
        groupKey = entry.placement.slice('after:'.length);
      }

      if (groupKey === 'cover') groupKey = 'cover_openings';
      if (groupKey && !groupKeys.includes(groupKey)) groupKeys.push(groupKey);
    });

    return groupKeys;
  }

  private _mobileEntityGroups(areaId: string, entities: EntityConfig[]): MobileEntityGroup[] {
    const grouped = entities.reduce((acc, entity) => {
      const key = this._mobileEntityTypeKey(entity.entity_id);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entity);
      return acc;
    }, {} as Record<string, EntityConfig[]>);

    // A domain can contain custom cards even after its final generated card is hidden.
    // Keep that section available so hiding a generated card never removes custom content.
    this._customCardDomainGroupKeys(areaId).forEach((groupKey) => {
      if (!grouped[groupKey]) grouped[groupKey] = [];
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const ai = (AREA_STRATEGY_GROUPS as readonly string[]).indexOf(a);
        const bi = (AREA_STRATEGY_GROUPS as readonly string[]).indexOf(b);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
        return this._mobileGroupName(a).localeCompare(this._mobileGroupName(b));
      })
      .map(([key, groupEntities]) => ({
        key,
        name: this._mobileGroupName(key),
        icon: this._mobileGroupIcon(key),
        entities: groupEntities,
      }));
  }

  private _sortAreaEntityGroups(areaId: string, groups: MobileEntityGroup[]): MobileEntityGroup[] {
    const configuredOrder = this.config?.areas_options?.[areaId]?.group_order || [];
    if (!configuredOrder.length) return groups;

    const groupIndex = (groupKey: string): number | undefined => {
      const direct = configuredOrder.indexOf(groupKey);
      if (direct >= 0) return direct;
      if (groupKey === 'cover_gates' && configuredOrder.includes('cover_shading')) {
        return configuredOrder.indexOf('cover_shading');
      }
      if ((groupKey === 'cover_openings' || groupKey === 'cover_shading' || groupKey === 'cover_gates') && configuredOrder.includes('cover')) {
        return configuredOrder.indexOf('cover');
      }

      if ((AREA_STRATEGY_GROUPS as readonly string[]).includes(groupKey)) {
        const legacy = configuredOrder.indexOf(getLegacyAreaGroupKey(groupKey as AreaStrategyGroup));
        if (legacy >= 0) return legacy;
      }
      return undefined;
    };

    return groups
      .map((group, fallbackIndex) => ({ group, fallbackIndex }))
      .sort((a, b) => {
        const aIndex = groupIndex(a.group.key);
        const bIndex = groupIndex(b.group.key);
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

  private _sortAreaEntities(areaId: string, entities: EntityConfig[]): EntityConfig[] {
    const areaOptions = this.config?.areas_options?.[areaId];
    const ungrouped = areaOptions?.entity_layout === 'ungrouped';
    const ungroupedOrder = new Map((areaOptions?.entity_order || []).map((entityId, index) => [entityId, index]));

    return [...entities].sort((a, b) => {
      if (ungrouped) {
        const aIndex = ungroupedOrder.get(a.entity_id);
        const bIndex = ungroupedOrder.get(b.entity_id);
        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
        if (aIndex !== undefined) return -1;
        if (bIndex !== undefined) return 1;
      } else {
        const aGroup = this._mobileEntityTypeKey(a.entity_id);
        const bGroup = this._mobileEntityTypeKey(b.entity_id);
        if (aGroup === bGroup && aGroup) {
          const directOptions = areaOptions?.groups_options?.[aGroup];
          const formerCombinedShadingOptions = aGroup === 'cover_gates'
            ? areaOptions?.groups_options?.cover_shading
            : undefined;
          const formerCoverOptions = (aGroup === 'cover_openings' || aGroup === 'cover_shading' || aGroup === 'cover_gates')
            ? areaOptions?.groups_options?.cover
            : undefined;
          const legacyOptions = (AREA_STRATEGY_GROUPS as readonly string[]).includes(aGroup)
            ? areaOptions?.groups_options?.[getLegacyAreaGroupKey(aGroup as AreaStrategyGroup)]
            : undefined;
          const groupOrder = directOptions?.order || formerCombinedShadingOptions?.order || formerCoverOptions?.order || legacyOptions?.order || [];
          const aIndex = groupOrder.indexOf(a.entity_id);
          const bIndex = groupOrder.indexOf(b.entity_id);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
        }
      }

      const nameA = this.hass.states[a.entity_id]?.attributes?.friendly_name || a.entity_id;
      const nameB = this.hass.states[b.entity_id]?.attributes?.friendly_name || b.entity_id;

      const deviceIdA = a.device_id || (this.hass.entities?.[a.entity_id] as any)?.device_id || '';
      const deviceIdB = b.device_id || (this.hass.entities?.[b.entity_id] as any)?.device_id || '';
      if (deviceIdA !== deviceIdB) {
        const deviceName = (deviceId: string, fallback: string) => {
          if (!deviceId) return fallback;
          return this.config?.devices?.find(item => item.device_id === deviceId)?.name || deviceId;
        };
        const byDevice = deviceName(deviceIdA, nameA).localeCompare(
          deviceName(deviceIdB, nameB),
          ddLocale(this.hass)
        );
        if (byDevice !== 0) return byDevice;
      }

      return nameA.localeCompare(nameB, ddLocale(this.hass));
    });
  }

  private _renderEditableGeneratedCard(
    area: AreaConfig,
    entity: EntityConfig,
    groupKey: string,
    index: number,
    orderedEntityIds: string[]
  ) {
    if (!this._editMode || !this._canManageDashboard()) {
      return this._renderMobileEntityCard(area, entity);
    }

    const hidden = this._isAreaEntityHidden(area.area_id, entity.entity_id);
    const dragging = this._generatedCardDrag?.areaId === area.area_id &&
      this._generatedCardDrag.entityId === entity.entity_id;
    const dragOver = this._generatedCardDragOver?.areaId === area.area_id &&
      this._generatedCardDragOver.entityId === entity.entity_id &&
      this._generatedCardDragOver.groupKey === groupKey;

    return html`
      <div
        class=${classMap({
          'dd-generated-card-wrap': true,
          editing: true,
          'is-hidden': hidden,
          dragging,
          'drag-over': dragOver,
        })}
        draggable="true"
        @dragstart=${(event: DragEvent) => this._handleGeneratedCardDragStart(event, area.area_id, entity.entity_id, groupKey)}
        @dragover=${(event: DragEvent) => this._handleGeneratedCardDragOver(event, area.area_id, entity.entity_id, groupKey)}
        @drop=${(event: DragEvent) => this._handleGeneratedCardDrop(event, area.area_id, groupKey, index, orderedEntityIds)}
        @dragend=${this._clearGeneratedCardDragState}
        @click=${(event: Event) => event.stopPropagation()}
      >
        ${this._renderMobileEntityCard(area, entity, { areaId: area.area_id, hidden })}
      </div>
    `;
  }

  private _handleGeneratedGroupDragStart(event: DragEvent, areaId: string, groupKey: string): void {
    if (!this._editMode || !this._canManageDashboard()) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
    (event.currentTarget as HTMLElement | null)?.blur();
    this._clearCustomCardDragState();
    this._clearGeneratedCardDragState();
    this._generatedGroupDrag = { areaId, groupKey };
    this._generatedGroupDragOver = null;
    event.dataTransfer?.setData('text/plain', groupKey);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private _handleGeneratedGroupDragOver(event: DragEvent, areaId: string, groupKey: string): void {
    const drag = this._generatedGroupDrag;
    if (!this._editMode || !drag || drag.areaId !== areaId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this._generatedGroupDragOver = { areaId, groupKey };
  }

  private _handleGeneratedGroupDrop(
    event: DragEvent,
    areaId: string,
    targetGroupKey: string,
    orderedGroupKeys: string[]
  ): void {
    const drag = this._generatedGroupDrag;
    if (!drag || drag.areaId !== areaId) return;

    event.preventDefault();
    event.stopPropagation();
    const currentIndex = orderedGroupKeys.indexOf(drag.groupKey);
    const targetIndex = orderedGroupKeys.indexOf(targetGroupKey);
    if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) {
      this._clearGeneratedGroupDragState();
      return;
    }

    const reordered = [...orderedGroupKeys];
    const [moved] = reordered.splice(currentIndex, 1);
    if (moved) reordered.splice(targetIndex, 0, moved);

    const contentArea = this.shadowRoot?.querySelector('.content-area') as HTMLElement | null;
    const contentScrollTop = contentArea?.scrollTop ?? 0;
    const windowScrollX = window.scrollX;
    const windowScrollY = window.scrollY;

    const activeElement = this.shadowRoot?.activeElement as HTMLElement | null;
    activeElement?.blur();

    const restoreScroll = () => {
      if (contentArea && Math.abs(contentArea.scrollTop - contentScrollTop) > 1) {
        contentArea.scrollTop = contentScrollTop;
      }
      if (Math.abs(window.scrollY - windowScrollY) > 1 || Math.abs(window.scrollX - windowScrollX) > 1) {
        window.scrollTo(windowScrollX, windowScrollY);
      }
    };

    const restoreAfterRender = () => {
      void this.updateComplete.then(() => {
        requestAnimationFrame(() => {
          restoreScroll();
          requestAnimationFrame(restoreScroll);
        });
      });
    };

    try {
      window.sessionStorage.setItem('dd-next-room-dnd-scroll', JSON.stringify({
        areaId,
        pathname: window.location.pathname,
        contentScrollTop,
        windowScrollX,
        windowScrollY,
        expiresAt: Date.now() + 10000,
      }));
    } catch {
      // Scroll restoration is best-effort only.
    }

    const savePromise = this._saveAreaOptionsPatch(areaId, { group_order: reordered });
    this._clearGeneratedGroupDragState();

    // The local reorder and the later Lovelace config-save can both rerender the room.
    // Restore after both phases so dropping a group never navigates the viewport to the top.
    restoreAfterRender();
    void savePromise.finally(() => {
      restoreAfterRender();
      window.setTimeout(restoreScroll, 80);
      window.setTimeout(restoreScroll, 220);
    });
  }

  private _clearGeneratedGroupDragState = (): void => {
    this._generatedGroupDrag = null;
    this._generatedGroupDragOver = null;
  };

  private _handleGeneratedCardDragStart(
    event: DragEvent,
    areaId: string,
    entityId: string,
    groupKey: string
  ): void {
    if (!this._editMode || !this._canManageDashboard()) {
      event.preventDefault();
      return;
    }

    this._clearCustomCardDragState();
    this._generatedCardDrag = { areaId, entityId, groupKey };
    this._generatedCardDragOver = null;
    event.dataTransfer?.setData('text/plain', entityId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private _handleGeneratedCardDragOver(
    event: DragEvent,
    areaId: string,
    entityId: string,
    groupKey: string
  ): void {
    const drag = this._generatedCardDrag;
    if (!this._editMode || !drag || drag.areaId !== areaId || drag.groupKey !== groupKey) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this._generatedCardDragOver = { areaId, entityId, groupKey };
  }

  private _handleGeneratedCardDrop(
    event: DragEvent,
    areaId: string,
    groupKey: string,
    dropIndex: number,
    orderedEntityIds: string[]
  ): void {
    const drag = this._generatedCardDrag;
    if (!drag || drag.areaId !== areaId || drag.groupKey !== groupKey) return;

    event.preventDefault();
    event.stopPropagation();

    const currentIndex = orderedEntityIds.indexOf(drag.entityId);
    if (currentIndex < 0) {
      this._clearGeneratedCardDragState();
      return;
    }

    const reordered = [...orderedEntityIds];
    const [moved] = reordered.splice(currentIndex, 1);
    if (!moved) {
      this._clearGeneratedCardDragState();
      return;
    }
    reordered.splice(Math.max(0, Math.min(dropIndex, reordered.length)), 0, moved);

    if (groupKey === UNGROUPED_AREA_EDIT_GROUP) {
      void this._saveAreaOptionsPatch(areaId, { entity_order: reordered });
      this._clearGeneratedCardDragState();
      return;
    }

    const strategyGroups = new Set(
      reordered.map(entityId => this._areaStrategyGroupKey(entityId) || groupKey)
    );
    const useMobileGroup = strategyGroups.size !== 1;
    const storageGroup = useMobileGroup ? groupKey : Array.from(strategyGroups)[0] || groupKey;
    const areaOptions = this.config?.areas_options?.[areaId];
    const groupsOptions = areaOptions?.groups_options || {};
    const groupOptions = groupsOptions[storageGroup] ||
      (storageGroup === 'cover_gates' ? groupsOptions.cover_shading : undefined) ||
      ((storageGroup === 'cover_openings' || storageGroup === 'cover_shading' || storageGroup === 'cover_gates') ? groupsOptions.cover : undefined) ||
      {};
    const editableEntities = this._getEditableAreaEntities(areaId);
    const eligibleEntityIds = editableEntities
      .filter(entity => useMobileGroup
        ? this._mobileEntityTypeKey(entity.entity_id) === groupKey
        : (this._areaStrategyGroupKey(entity.entity_id) || groupKey) === storageGroup)
      .map(entity => entity.entity_id);
    const existingOrder = groupOptions.order || [];
    const baseOrder = [
      ...existingOrder.filter((entityId, index) =>
        eligibleEntityIds.includes(entityId) && existingOrder.indexOf(entityId) === index),
      ...eligibleEntityIds.filter(entityId => !existingOrder.includes(entityId)),
    ];
    const movedIds = new Set(reordered);
    let movedIndex = 0;
    const mergedOrder = baseOrder.map(entityId =>
      movedIds.has(entityId) ? reordered[movedIndex++] || entityId : entityId
    );

    void this._saveAreaOptionsPatch(areaId, {
      groups_options: {
        ...groupsOptions,
        [storageGroup]: {
          ...groupOptions,
          order: mergedOrder,
        },
      },
    });
    this._clearGeneratedCardDragState();
  }

  private _clearGeneratedCardDragState = (): void => {
    this._generatedCardDrag = null;
    this._generatedCardDragOver = null;
  };

  private _isAreaEntityHidden(areaId: string, entityId: string): boolean {
    const groupsOptions = this.config?.areas_options?.[areaId]?.groups_options || {};
    return Object.values(groupsOptions).some(group => group.hidden?.includes(entityId));
  }

  private _toggleGeneratedCardVisibility(event: Event, areaId: string, entityId: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this._canManageDashboard()) return;

    const areaOptions = this.config?.areas_options?.[areaId];
    const groupsOptions = areaOptions?.groups_options || {};
    const currentlyHidden = this._isAreaEntityHidden(areaId, entityId);
    const nextGroups: Record<string, EntitiesDisplay> = Object.fromEntries(
      Object.entries(groupsOptions).map(([key, options]) => [
        key,
        { ...options, hidden: (options.hidden || []).filter(id => id !== entityId) },
      ])
    );

    if (!currentlyHidden) {
      const storageGroup = this._areaStrategyGroupKey(entityId) ||
        this._mobileEntityTypeKey(entityId) ||
        'others';
      const storageOptions = nextGroups[storageGroup] || {};
      nextGroups[storageGroup] = {
        ...storageOptions,
        hidden: [...(storageOptions.hidden || []), entityId],
      };
    }

    void this._saveAreaOptionsPatch(areaId, { groups_options: nextGroups });
  }

  private _areaStrategyGroupKey(entityId: string): string | undefined {
    return getAreaEntityGroupKey(entityId, this.hass) || this._mobileEntityTypeKey(entityId);
  }

  private _mobileEntityTypeKey(entityId: string): string | undefined {
    const concrete = getAreaEntityGroupKey(entityId, this.hass);
    if (concrete) return concrete;
    const domain = entityId.split('.')[0];
    return domain || undefined;
  }

  private _mobileGroupName(key: string): string {
    const german = String(this.hass?.language || this.hass?.locale?.language || '').toLowerCase().startsWith('de');
    if (key === 'cover_openings') return german ? 'Fenster & Türen' : 'Windows & doors';
    if (key === 'cover_shading') return german ? 'Beschattung' : 'Shading';
    if (key === 'cover_gates') return german ? 'Tore' : 'Gates';
    if (key === 'motion') return german ? 'Bewegung & Präsenz' : 'Motion & presence';
    if (key === 'safety') return german ? 'Sicherheit & Warnmelder' : 'Safety & alarms';
    return getDomainName(this.hass, key);
  }

  private _mobileGroupIcon(key: string): string {
    if (key === 'motion') return 'mdi:motion-sensor';
    if (key === 'safety') return 'mdi:shield-alert-outline';
    if (key === 'cover_openings') return 'mdi:door-open';
    if (key === 'cover_shading') return 'mdi:blinds-horizontal';
    if (key === 'cover_gates') return 'mdi:gate';
    return getDomainIcon(key);
  }

  private _areaReplacementCardConfig(entityId: string): any | null {
    const assignment = findReplacementAssignment({
      hass: this.hass,
      config: this.config,
      entity: entityId,
      surface: 'area_cards',
    });

    if (!assignment || assignment.enabled === false) return null;

    return resolveEntityCardConfig({
      hass: this.hass,
      config: this.config,
      entity: entityId,
      surface: 'area_cards',
    });
  }

  private _renderAreaReplacementCard(entityId: string, cardConfig: any) {
    return html`
      <div class="mobile-entity-replacement-card" data-entity=${entityId}>
        <dwains-dashboard-next-card-host
          framed
          .hass=${this.hass}
          .config=${cardConfig}
        ></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  private _renderMobileEntityCard(
    area: AreaConfig,
    entity: EntityConfig,
    editControls?: { areaId: string; hidden: boolean }
  ) {
    const rawState = this.hass.states[entity.entity_id];
    if (!rawState) return nothing;

    const state = this._getEffectiveEntityState(rawState);
    const domain = entity.entity_id.split('.')[0] || 'unknown';
    if (domain === 'todo') return this._renderTodoListCard(entity);

    const deviceClass = state.attributes?.device_class;
    const replacementConfig = this._areaReplacementCardConfig(entity.entity_id);
    if (replacementConfig) return this._renderAreaReplacementCard(entity.entity_id, replacementConfig);

    const icon = ['select', 'input_select'].includes(domain)
      ? getDomainIcon(domain)
      : this.hass.entities?.[entity.entity_id]?.icon || state.attributes?.icon || getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const rawName = state.attributes?.friendly_name || this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
    const name = this.config?.settings?.hide_area_name_in_entity_names === true
      ? stripAreaNameFromEntityName(rawName, area.name)
      : rawName;
    const active = this._isEntityActiveForUi(state, domain);
    const actionKind = this._mobileEntityActionKind(domain);
    const unavailable = ['unavailable', 'unknown'].includes(String(state.state).toLowerCase());
    const unknownIsNormal = domain === 'scene' || domain === 'event';
    const hasInlineSelect = this._mobileEntityHasInlineSelect(domain, state);

    // 1.9.0 interaction model: lights use their normal toggle;
    // covers use their normal open/stop/close buttons.
    const statusText = this._mobileEntityStatusText(state, domain);

    const classes = [
      `mobile-entity-${domain}`,
      deviceClass ? `device-${deviceClass}` : '',
      `action-${actionKind}`,
      hasInlineSelect ? 'has-inline-select' : '',
    ].filter(Boolean).join(' ');

    const accent = this._mobileEntityColor(domain, deviceClass);
    const actionMode = actionKind === 'toggle'
      ? 'toggle'
      : actionKind === 'cover'
        ? 'cover'
        : actionKind === 'lock'
          ? 'lock'
          : actionKind === 'scene'
            ? 'scene'
            : 'none';

    return html`
      <dd-next-compact-entity-tile
        class="mobile-entity-tile-host ${classes}"
        variant="compact"
        .name=${name}
        .status=${statusText}
        .icon=${icon}
        .accent=${accent}
        .active=${active}
        .unavailable=${unavailable && !unknownIsNormal}
        .editing=${Boolean(editControls)}
        .selectOptions=${hasInlineSelect ? this._mobileEntitySelectOptions(state) : undefined}
        .selectedOption=${String(state.state)}
        @dd-select=${(event: CustomEvent<{ option: string }>) => this._handleMobileSelectChange(event, state, domain)}
        @dd-open=${() => this._showMoreInfo(entity.entity_id)}
      >
        ${editControls ? html`
          <button
            slot="leading"
            class="dd-generated-card-leading-drag-handle"
            type="button"
            title=${this._t('layout.drag_card')}
            aria-label=${this._t('layout.drag_card')}
            @click=${(event: Event) => event.stopPropagation()}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
        ` : nothing}

        ${editControls ? html`
          <button
            slot="actions"
            class="dd-generated-card-visibility"
            type="button"
            title=${this._t(editControls.hidden ? 'common.show' : 'common.hide')}
            aria-label=${this._t(editControls.hidden ? 'common.show' : 'common.hide')}
            aria-pressed=${editControls.hidden ? 'true' : 'false'}
            @click=${(event: Event) => this._toggleGeneratedCardVisibility(event, editControls.areaId, entity.entity_id)}
          >
            <ha-icon icon=${editControls.hidden ? 'mdi:eye' : 'mdi:eye-off-outline'}></ha-icon>
          </button>
        ` : actionMode !== 'none' ? html`
          <dd-next-entity-actions
            slot="actions"
            .mode=${actionMode}
            .accent=${accent}
            .active=${active}
            .unavailable=${unavailable}
            .state=${String(state.state || '')}
            .canOpen=${this._coverSupportsFeature(state, 1)}
            .canClose=${this._coverSupportsFeature(state, 2)}
            .canStop=${this._coverSupportsFeature(state, 8)}
            .turnOnLabel=${this._t('action.turn_on')}
            .turnOffLabel=${this._t('action.turn_off')}
            .openLabel=${this._t('action.open')}
            .stopLabel=${this._t('action.stop')}
            .closeLabel=${this._t('action.close')}
            .lockLabel=${this._t('action.lock')}
            .unlockLabel=${this._t('action.unlock')}
            .activateLabel=${this._t('action.activate')}
            @dd-action=${(event: CustomEvent<{ action: string }>) => {
              if (actionKind === 'toggle') {
                void this._handleMobileEntityToggle(event, state, domain);
              } else if (actionKind === 'cover') {
                void this._handleMobileCoverAction(event, state, event.detail.action as 'open' | 'stop' | 'close');
              } else if (actionKind === 'lock') {
                void this._handleMobileLockAction(event, state);
              } else if (actionKind === 'scene') {
                void this._handleMobileSceneAction(event, state);
              }
            }}
          ></dd-next-entity-actions>
        ` : nothing}

      </dd-next-compact-entity-tile>
    `;
  }

  private _renderTodoListCard(entity: EntityConfig) {
    return html`
      <div class="mobile-todo-list-card" data-entity=${entity.entity_id}>
        <dwains-dashboard-next-card-host
          eager
          .hass=${this.hass}
          .config=${{ type: 'todo-list', entity: entity.entity_id }}
        ></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  private _mobileEntityHasInlineSelect(domain: string, state: any): boolean {
    return ['select', 'input_select'].includes(domain) && Array.isArray(state?.attributes?.options);
  }

  private _mobileEntitySelectOptions(state: any): string[] {
    const selected = String(state?.state || '');
    const options = Array.isArray(state?.attributes?.options)
      ? state.attributes.options.map((option: unknown) => String(option))
      : [];

    if (selected && !['unknown', 'unavailable'].includes(selected.toLowerCase()) && !options.includes(selected)) {
      return [selected, ...options];
    }

    return options;
  }

  private async _handleMobileEntityToggle(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        const turnOn = !this._isEntityActiveForUi(state, domain);
        this._setOptimisticEntityState(entityId, turnOn ? 'on' : 'off');
        await this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', { entity_id: entityId });
        return;
      }
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle mobile entity ${entityId}:`, err);
      this._showToast(this._t('entity.update_failed'));
      return;
    }

    this._showMoreInfo(entityId);
  }

  private async _handleMobileSelectChange(event: CustomEvent<{ option: string }>, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    const option = event.detail.option;
    if (!entityId || option === undefined) return;

    this._setOptimisticEntityState(entityId, option);

    try {
      await this.hass.callService(domain === 'input_select' ? 'input_select' : 'select', 'select_option', {
        entity_id: entityId,
        option,
      });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to select option for ${entityId}:`, err);
      this._showToast(this._t('entity.selector_failed'));
    }
  }

  private async _handleMobileCoverAction(event: Event, state: any, action: 'open' | 'stop' | 'close'): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    const service = action === 'open' ? 'open_cover' : action === 'close' ? 'close_cover' : 'stop_cover';
    const optimisticState = action === 'open' ? 'open' : action === 'close' ? 'closed' : undefined;
    if (optimisticState) this._setOptimisticEntityState(entityId, optimisticState);

    try {
      await this.hass.callService('cover', service, { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to ${action} cover ${entityId}:`, err);
      this._showToast(this._t('entity.cover_failed'));
    }
  }

  private async _handleMobileLockAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      const unlocked = this._isEntityActiveForUi(state, 'lock');
      this._setOptimisticEntityState(entityId, unlocked ? 'locked' : 'unlocked');
      await this.hass.callService('lock', unlocked ? 'lock' : 'unlock', { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle lock ${entityId}:`, err);
      this._showToast(this._t('entity.lock_failed'));
    }
  }

  private async _handleMobileSceneAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      await this.hass.callService('scene', 'turn_on', { entity_id: entityId });
      this._showToast(this._t('action.scene_activated'));
    } catch (err) {
      console.warn(`Failed to activate scene ${entityId}:`, err);
      this._showMoreInfo(entityId);
    }
  }

  private _mobileControllableEntities(entities: EntityConfig[]): EntityConfig[] {
    return entities.filter(entity => {
      const domain = entity.entity_id.split('.')[0] || '';
      return Boolean(this.hass.states[entity.entity_id]) && this._mobileEntitySupportsToggle(domain);
    });
  }

  private _masterActionLabel(domain: MasterActionConfirmationDomain, turnOn: boolean): string {
    if (domain === 'cover') {
      return this._t(turnOn ? 'action.open_all' : 'action.close_all');
    }
    if (domain === 'lock') {
      return this._t(turnOn ? 'action.unlock_all' : 'action.lock_all');
    }
    return this._t(turnOn ? 'action.turn_on_all' : 'action.turn_off_all');
  }

  private _masterActionIsDestructive(domain: MasterActionConfirmationDomain, turnOn: boolean): boolean {
    return domain === 'lock' ? turnOn : !turnOn;
  }

  private _areaDisplayName(areaId: string): string {
    return this.config?.areas?.find(area => area.area_id === areaId)?.name || areaId;
  }

  private async _confirmMasterActionIfNeeded(
    domain: string,
    turnOn: boolean,
    entityCount: number,
    areaId: string
  ): Promise<boolean> {
    const normalizedDomain = normalizeMasterActionConfirmationDomain(domain);
    if (!normalizedDomain || !masterActionConfirmationEnabled(this.config?.settings, normalizedDomain)) {
      return true;
    }

    const actionLabel = this._masterActionLabel(normalizedDomain, turnOn);
    return this._showConfirmation(
      actionLabel,
      this._t('action.confirm_master_action', {
        count: entityCount,
        area: this._areaDisplayName(areaId),
      }),
      {
        confirmLabel: actionLabel,
        destructive: this._masterActionIsDestructive(normalizedDomain, turnOn),
      }
    );
  }

  private async _requestMobileGroupState(
    entities: EntityConfig[],
    turnOn: boolean,
    domain: string
  ): Promise<void> {
    const confirmed = await this._confirmMasterActionIfNeeded(
      domain,
      turnOn,
      entities.length,
      this._selectedArea || ''
    );
    if (!confirmed) return;
    await this._setMobileGroupState(entities, turnOn, domain);
  }

  private async _setMobileGroupState(
    entities: EntityConfig[],
    turnOn: boolean,
    requestedDomain: string
  ): Promise<void> {
    const grouped = this._mobileControllableEntities(entities).reduce((acc, entity) => {
      const domain = entity.entity_id.split('.')[0] || '';
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(entity.entity_id);
      return acc;
    }, {} as Record<string, string[]>);

    const affectedEntityIds: string[] = [];

    try {
      await Promise.all(Object.entries(grouped).map(([domain, entityIds]) => {
        if (!entityIds.length) return Promise.resolve();

        if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
          affectedEntityIds.push(...entityIds);
          this._setOptimisticEntityStates(entityIds, turnOn ? 'on' : 'off');
          return this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', {
            entity_id: entityIds,
          });
        }

        if (domain === 'cover') {
          affectedEntityIds.push(...entityIds);
          this._setOptimisticEntityStates(entityIds, turnOn ? 'open' : 'closed');
          return this.hass.callService('cover', turnOn ? 'open_cover' : 'close_cover', {
            entity_id: entityIds,
          });
        }

        if (domain === 'lock') {
          affectedEntityIds.push(...entityIds);
          this._setOptimisticEntityStates(entityIds, turnOn ? 'unlocked' : 'locked');
          return this.hass.callService('lock', turnOn ? 'unlock' : 'lock', {
            entity_id: entityIds,
          });
        }

        return Promise.resolve();
      }));

      const count = Object.values(grouped).reduce((total, entityIds) => total + entityIds.length, 0);
      const normalizedDomain = normalizeMasterActionConfirmationDomain(requestedDomain);
      if (count && normalizedDomain) {
        this._showToast(this._masterActionToast(normalizedDomain, turnOn));
      }
    } catch (err) {
      this._clearOptimisticEntityStates(affectedEntityIds);
      console.warn('Failed to run mobile group action:', err);
      this._showToast(this._t('entity.group_failed'));
    }
  }

  private _mobileEntitySupportsToggle(domain: string): boolean {
    return ['light', 'switch', 'fan', 'input_boolean', 'cover', 'lock'].includes(domain);
  }

  private _masterActionToast(domain: MasterActionConfirmationDomain, turnOn: boolean): string {
    if (domain === 'light') return this._t(turnOn ? 'action.all_lights_on' : 'action.all_lights_off');
    if (domain === 'switch') return this._t(turnOn ? 'action.all_switches_on' : 'action.all_switches_off');
    if (domain === 'fan') return this._t(turnOn ? 'action.all_fans_on' : 'action.all_fans_off');
    return this._masterActionLabel(domain, turnOn);
  }

  private _mobileEntityActionKind(domain: string): 'toggle' | 'cover' | 'lock' | 'scene' | 'more' {
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return 'toggle';
    if (domain === 'cover') return 'cover';
    if (domain === 'lock') return 'lock';
    if (domain === 'scene') return 'scene';
    return 'more';
  }

  private _coverSupportsFeature(state: any, feature: number): boolean {
    const supported = Number(state?.attributes?.supported_features);
    if (!Number.isFinite(supported) || supported <= 0) {
      return feature === 1 || feature === 2;
    }
    return (supported & feature) !== 0;
  }

  private _mobileEntityStatusText(state: any, domain: string): string {
    if (!state) return '';
    const formatted = this._formatFavoriteState(state);

    if (domain === 'scene') {
      return this._sceneLastActivatedText(state);
    }

    if (domain === 'event') {
      return this._eventLastTriggeredText(state);
    }

    if (domain === 'light') {
      const lightState = String(state.state || '').toLowerCase();
      if (lightState === 'on' || lightState === 'off') {
        const status = lightState === 'on' ? 'An' : 'Aus';
        const brightness = state.attributes?.brightness;
        if (typeof brightness === 'number' && Number.isFinite(brightness)) {
          return `${status} · ${formatValueWithUnit(Math.round((brightness / 255) * 100), '%')}`;
        }
        return status;
      }
    }

    if (domain === 'cover' && typeof state.attributes?.current_position === 'number') {
      return `${formatted} · ${formatValueWithUnit(state.attributes.current_position, '%')}`;
    }

    if (domain === 'climate') {
      const current = state.attributes?.current_temperature;
      const target = state.attributes?.temperature;
      const unit = this.hass?.config?.unit_system?.temperature || '°C';
      if (current !== undefined && target !== undefined) return `${formatValueWithUnit(current, unit)} · ${this._t('entity.climate_set', { value: formatValueWithUnit(target, unit) })}`;
      if (current !== undefined) return formatValueWithUnit(current, unit);
    }

    if (domain === 'media_player' && state.attributes?.media_title) {
      return `${formatted} · ${state.attributes.media_title}`;
    }

    return formatted;
  }

  private _sceneLastActivatedText(state: any): string {
    const value = String(state?.state || '').toLowerCase();
    const candidate = value && !['unknown', 'unavailable'].includes(value)
      ? state.state
      : state?.last_changed || state?.last_updated;
    const timestamp = Date.parse(candidate);

    if (!Number.isFinite(timestamp)) {
      return this._t('entity.not_activated');
    }

    return this._formatRelativeTime(timestamp);
  }

  private _eventLastTriggeredText(state: any): string {
    const value = String(state?.state || '').toLowerCase();
    if (value === 'unavailable') return this._t('common.unavailable');

    const timestamp = Date.parse(state?.last_changed || state?.last_updated || '');
    if (!Number.isFinite(timestamp)) {
      return this._t('entity.no_events');
    }

    if (value && value !== 'unknown') {
      return `${this._formatFavoriteState(state)} · ${this._formatRelativeTime(timestamp)}`;
    }

    return this._formatRelativeTime(timestamp);
  }

  private _formatRelativeTime(timestamp: number): string {
    const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
    const absSeconds = Math.abs(diffSeconds);
    const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
      ['year', 365 * 24 * 60 * 60],
      ['month', 30 * 24 * 60 * 60],
      ['week', 7 * 24 * 60 * 60],
      ['day', 24 * 60 * 60],
      ['hour', 60 * 60],
      ['minute', 60],
      ['second', 1],
    ];
    const [unit, unitSeconds] = units.find(([, seconds]) => absSeconds >= seconds) || ['second', 1];
    const value = Math.round(diffSeconds / unitSeconds);

    try {
      const language = (this.hass as any)?.locale?.language || navigator.language || undefined;
      return new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(value, unit);
    } catch {
      if (absSeconds < 60) return 'just now';
      const count = Math.abs(value);
      return `${count} ${unit}${count === 1 ? '' : 's'} ${value < 0 ? 'ago' : 'from now'}`;
    }
  }

  private _isEntityActiveForUi(state: any, domain: string): boolean {
    if (!state || ['unavailable', 'unknown'].includes(String(state.state))) return false;
    const value = String(state.state).toLowerCase();
    if (domain === 'cover') return ['open', 'opening'].includes(value);
    if (domain === 'lock') return value === 'unlocked';
    if (domain === 'climate') {
      const action = state.attributes?.hvac_action;
      return action && action !== 'idle' && action !== 'off';
    }
    if (domain === 'media_player') return ['playing', 'buffering'].includes(value);
    if (domain === 'vacuum') return ['cleaning', 'returning'].includes(value);
    if (domain === 'alarm_control_panel') return value.startsWith('armed') || ['arming', 'pending', 'triggered'].includes(value);
    if (domain === 'camera') return false;
    return !['off', 'closed', 'locked', 'not_home', 'idle'].includes(value);
  }

  private _mobileEntityColor(domain: string, deviceClass?: string): string {
    if (domain === 'cover') return getDomainColor('cover', deviceClass);
    if (domain === 'sensor' && (deviceClass === 'temperature' || deviceClass === 'humidity')) {
      return getDomainColor(deviceClass, deviceClass);
    }
    if (domain === 'sensor' && deviceClass === 'power') return getDomainColor('wattage');
    return getDomainColor(domain, deviceClass);
  }

  private _housePowerStatisticsEntities(
    entities: Array<{ entityId: string; name: string; watts: number; stateClass?: string }>,
    limit: number
  ): Array<{ entity: string; name: string }> {
    return entities
      .filter(entity => ['measurement', 'total', 'total_increasing'].includes(entity.stateClass || ''))
      .sort((a, b) => b.watts - a.watts)
      .slice(0, limit)
      .map(entity => ({ entity: entity.entityId, name: entity.name }));
  }

  private _renderHousePowerStatisticsGraph(
    entities: Array<{ entity: string; name: string }>,
    label: string
  ) {
    if (!entities.length) return nothing;

    return html`
      <dwains-dashboard-next-card-host
        class="house-power-statistics-card"
        aria-label=${label}
        .hass=${this.hass}
        .config=${{
          type: 'statistics-graph',
          entities,
          days_to_show: 1,
          period: '5minute',
          stat_types: ['mean'],
          chart_type: 'line',
          hide_legend: true,
          fit_y_data: true,
          min_y_axis: 0,
        }}
      ></dwains-dashboard-next-card-host>
    `;
  }

  private _renderToast() {
    // TODO: Implement toast state management
    return nothing;
  }

  private _renderConfirmationDialog() {
    const dialog = this._confirmationDialog;
    if (!dialog) return nothing;

    return html`
      <div
        class="confirmation-dialog show"
        role="presentation"
        @click=${() => this._resolveConfirmation(false)}
      >
        <div
          class="confirmation-content"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dd-confirmation-title"
          aria-describedby="dd-confirmation-message"
          tabindex="0"
          @click=${(event: Event) => event.stopPropagation()}
          @keydown=${this._handleConfirmationKeydown}
        >
          <div id="dd-confirmation-title" class="confirmation-title">${dialog.title}</div>
          <div id="dd-confirmation-message" class="confirmation-message">${dialog.message}</div>
          <div class="confirmation-actions">
            <button
              class="confirmation-button cancel"
              type="button"
              @click=${() => this._resolveConfirmation(false)}
            >
              ${this._t('common.cancel')}
            </button>
            <button
              class=${`confirmation-button confirm ${dialog.destructive ? 'destructive' : ''}`}
              type="button"
              @click=${() => this._resolveConfirmation(true)}
            >
              ${dialog.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Helper Methods

  private _getWeatherEntity() {
    if (this.config?.settings?.weather_entity_id) {
      const chosen = this.hass.states[this.config.settings.weather_entity_id];
      if (chosen && !this.hass.entities?.[chosen.entity_id]?.hidden_by) {
        return chosen;
      }
    }

    // Fallback to first visible weather entity
    return Object.values(this.hass.states).find(state =>
      state.entity_id.startsWith('weather.') &&
      !this.hass.entities?.[state.entity_id]?.hidden_by
    );
  }

  private _getAlarmEntity() {
    if (this.config?.settings?.show_alarm === false) {
      return undefined;
    }

    const configuredAlarmId = this.config?.settings?.alarm_entity_id;
    if (!configuredAlarmId) {
      return undefined;
    }

    const chosen = this.hass.states[configuredAlarmId];
    if (chosen && !this.hass.entities?.[chosen.entity_id]?.hidden_by) {
      return chosen;
    }

    return undefined;
  }

  private _getStatusDomains(): DomainCount[] {
    // Check cache first
    const cacheKey = 'status_domains';
    const cached = this._domainCountsCache.get(cacheKey);
    if (cached && cached.length > 0 && (cached[0] as any).timestamp && Date.now() - (cached[0] as any).timestamp < this._CACHE_DURATION) {
      return cached;
    }

    // Use the new comprehensive status domains calculation
    const result = getStatusDomains(this.hass, this.config);

    // Add wattage badge if available
    const totalWattage = getTotalWattage(this.hass, this.config);
    if (totalWattage) {
      result.unshift({
        domain: 'wattage',
        count: 0,
        name: 'Power usage',
        value: totalWattage,
        icon: 'mdi:flash'
      });
    }

    result.sort((a, b) => {
      const urgentA = this._isUrgentStatus(a.domain, a.deviceClass);
      const urgentB = this._isUrgentStatus(b.domain, b.deviceClass);
      return urgentA === urgentB ? 0 : urgentA ? -1 : 1;
    });

    // Add timestamp for cache
    const timestamp = Date.now();
    result.forEach((item: any) => item.timestamp = timestamp);

    // Cache the result
    if (result.length > 0) {
    this._domainCountsCache.set(cacheKey, result);
    }

    return result;
  }

  // Note: getTotalWattage is now handled by the header-status-domains utility

  private _getAreaDeviceCount(areaId: string, entities: EntityConfig[] = []): number {
    const deviceIds = new Set<string>();

    this.config?.devices?.forEach(device => {
      if (device.area_id === areaId) {
        deviceIds.add(device.device_id);
      }
    });

    entities.forEach(entity => {
      if (entity.device_id) {
        deviceIds.add(entity.device_id);
      }
    });

    return deviceIds.size;
  }

  private _isEntityRegistryExcluded(entityId: string): boolean {
    const registry = this.hass.entities?.[entityId] as any;
    return Boolean(
      registry?.hidden_by ||
      registry?.disabled_by ||
      registry?.entity_category === 'config' ||
      registry?.entity_category === 'diagnostic'
    );
  }

  private _getAreaEntities(areaId: string): EntityConfig[] {
    // Check cache first
    const cached = this._areaEntitiesCache.get(areaId);
    if (cached && Date.now() - cached.timestamp < this._CACHE_DURATION) {
      return cached.entities;
    }

    const entities: EntityConfig[] = [];
    const processedEntities = new Set<string>();

    // Get entities from config
    if (this.config?.entities) {
      const areaDevices = new Set<string>();
      if (this.config.devices) {
        this.config.devices.forEach(device => {
          if (device.area_id === areaId) {
            areaDevices.add(device.device_id);
          }
        });
      }

      this.config.entities.forEach(entity => {
        if (entity.area_id === areaId ||
            (entity.device_id && areaDevices.has(entity.device_id))) {
          if (!this.hass.states[entity.entity_id] || this._isEntityRegistryExcluded(entity.entity_id)) {
            return;
          }
          entities.push(entity);
          processedEntities.add(entity.entity_id);
        }
      });
    }

    // Add entities from hass that aren't in config
    Object.values(this.hass.states).forEach(state => {
      if (!processedEntities.has(state.entity_id) &&
          state.attributes?.area_id === areaId) {
        if (this._isEntityRegistryExcluded(state.entity_id)) {
          return;
        }
        entities.push({
          entity_id: state.entity_id,
          area_id: areaId,
          hidden: false
        });
      }
    });

    // Cache the result
    this._areaEntitiesCache.set(areaId, {
      entities,
      timestamp: Date.now()
    });

    return entities;
  }

  private _getFilteredAreaEntities(areaId: string): EntityConfig[] {
    const entities = this._getAreaEntities(areaId);

    let filteredEntities = entities;

    // Always respect HA entity registry visibility and categories
    filteredEntities = filteredEntities.filter(entity => {
      return Boolean(this.hass.states[entity.entity_id]) &&
        !this._isEntityRegistryExcluded(entity.entity_id);
    });

    // Filter hidden entities if configured
    if (this.config?.areas_options) {
      const areaOptions = this.config.areas_options[areaId];
      if (areaOptions?.groups_options) {
        // Get all hidden entity IDs for this area (same logic as old version)
        const hiddenEntityIds = new Set<string>();
        for (const groupOptions of Object.values(areaOptions.groups_options)) {
          if (groupOptions.hidden) {
            groupOptions.hidden.forEach(entityId => hiddenEntityIds.add(entityId));
          }
        }

    // Filter out hidden entities
        filteredEntities = filteredEntities.filter(entity => !hiddenEntityIds.has(entity.entity_id));
      }
    }

    // Filter unavailable/unknown entities by default unless explicitly disabled.
    if (this.config?.settings?.hide_unavailable_entities !== false) {
      filteredEntities = filteredEntities.filter(entity => {
        const state = this.hass.states[entity.entity_id];
        return state && state.state !== 'unavailable' && state.state !== 'unknown';
      });
    }

    filteredEntities = filterHiddenDeviceEntities(this.hass, this.config, filteredEntities);

    return filteredEntities;
  }

  private _getEditableAreaEntities(areaId: string): EntityConfig[] {
    let entities = this._getAreaEntities(areaId).filter(entity => {
      return Boolean(this.hass.states[entity.entity_id]) &&
        !this._isEntityRegistryExcluded(entity.entity_id);
    });

    // Area-hidden entities remain in edit mode so they can be enabled again in place.
    if (this.config?.settings?.hide_unavailable_entities !== false) {
      entities = entities.filter(entity => {
        const state = this.hass.states[entity.entity_id];
        return state && state.state !== 'unavailable' && state.state !== 'unknown';
      });
    }

    return filterHiddenDeviceEntities(this.hass, this.config, entities);
  }

  private _getUnavailableAreaEntities(areaId: string): { unavailable: string[], unknown: string[] } {
    let entities = this._getAreaEntities(areaId);
    const unavailable: string[] = [];
    const unknown: string[] = [];

    entities = entities.filter(entity => {
      return !this._isEntityRegistryExcluded(entity.entity_id);
    });

    const areaOptions = this.config?.areas_options?.[areaId];
    if (areaOptions?.groups_options) {
      const hiddenEntityIds = new Set<string>();
      for (const groupOptions of Object.values(areaOptions.groups_options)) {
        groupOptions.hidden?.forEach(entityId => hiddenEntityIds.add(entityId));
      }
      entities = entities.filter(entity => !hiddenEntityIds.has(entity.entity_id));
    }

    entities = filterHiddenDeviceEntities(this.hass, this.config, entities);

    entities.forEach(entity => {
      const state = this.hass.states[entity.entity_id];
      if (!state) return;

      if (state.state === 'unavailable') {
        unavailable.push(entity.entity_id);
      } else if (state.state === 'unknown') {
        unknown.push(entity.entity_id);
      }
    });

    return { unavailable, unknown };
  }

  private _renderUnavailableEntitiesIcon(areaId: string) {
    // Only show icon if hiding unavailable entities is enabled
    if (this.config?.settings?.hide_unavailable_entities === false) {
      return nothing;
    }

    const unavailableEntities = this._getUnavailableAreaEntities(areaId);
    const totalUnavailable = unavailableEntities.unavailable.length + unavailableEntities.unknown.length;

    if (totalUnavailable === 0) {
      return nothing;
    }

    const label = this._t('settings.hidden_unavailable_count', { count: totalUnavailable });
    return html`
      <button
        class="dd-page-header-button is-warning"
        type="button"
        title=${label}
        aria-label=${label}
        @click=${() => this._showUnavailableEntitiesModal(areaId)}
      >
        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
        <span class="dd-page-header-badge" aria-hidden="true">${totalUnavailable}</span>
      </button>
    `;
  }

  private _formatAssignedAreaClimate(areaId: string, kind: 'temperature' | 'humidity'): string | undefined {
    const areaRegistry = this.hass?.areas?.[areaId] as any;
    const entityId = kind === 'temperature'
      ? areaRegistry?.temperature_entity_id
      : areaRegistry?.humidity_entity_id;
    if (!entityId) return undefined;

    const state = this.hass?.states?.[entityId];
    if (!state || state.state === 'unavailable' || state.state === 'unknown') return undefined;
    return formatEntityStateWithUnit(this.hass, state);
  }

  private _withFreshAreaClimateFormatting(areaId: string, data: AreaData): AreaData {
    return {
      ...data,
      temperature: this._formatAssignedAreaClimate(areaId, 'temperature'),
      humidity: this._formatAssignedAreaClimate(areaId, 'humidity'),
    };
  }

  private _getCachedAreaData(area: AreaConfig): AreaData {
    // The structural area data can be cached, but temperature/humidity formatting
    // must always use the current Home Assistant display settings (precision, locale, etc.).
    const cached = this._areaDataCache.get(area.area_id);
    if (cached && Date.now() - cached.timestamp < this._CACHE_DURATION) {
      return this._withFreshAreaClimateFormatting(area.area_id, cached.data);
    }

    const entities = this._getFilteredAreaEntities(area.area_id);
    const data = getAreaData(area, this.hass, entities, this.config);

    this._areaDataCache.set(area.area_id, {
      data,
      timestamp: Date.now()
    });

    return this._withFreshAreaClimateFormatting(area.area_id, data);
  }

  private _getPictureContrastClass(picture?: string | null): string {
    if (!picture) return '';

    const cached = this._pictureContrastCache.get(picture);
    if (!cached) {
      this._pictureContrastCache.set(picture, 'pending');
      void this._analyzePictureContrast(picture);
      return 'text-light';
    }

    return cached === 'dark' ? 'text-dark' : 'text-light';
  }

  private async _analyzePictureContrast(picture: string): Promise<void> {
    try {
      const tone = await this._calculatePictureTextTone(picture);
      this._pictureContrastCache.set(picture, tone);
    } catch {
      // If canvas access is blocked by CORS, keep the safer dark overlay with light text.
      this._pictureContrastCache.set(picture, 'light');
    }

    this.requestUpdate();
  }

  private _calculatePictureTextTone(picture: string): Promise<PictureTextTone> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';

      image.onload = () => {
        try {
          const sampleSize = 28;
          const canvas = document.createElement('canvas');
          canvas.width = sampleSize;
          canvas.height = sampleSize;

          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          context.drawImage(image, 0, 0, sampleSize, sampleSize);
          const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
          const regions = [
            { x0: 0.1, x1: 0.7, y0: 0.2, y1: 0.75 },
            { x0: 0.08, x1: 0.72, y0: 0.56, y1: 0.96 },
            { x0: 0.18, x1: 0.82, y0: 0.18, y1: 0.82 },
          ];
          const luminances = regions.map(region => {
            const startX = Math.floor(region.x0 * sampleSize);
            const endX = Math.ceil(region.x1 * sampleSize);
            const startY = Math.floor(region.y0 * sampleSize);
            const endY = Math.ceil(region.y1 * sampleSize);
            let total = 0;
            let count = 0;

            for (let y = startY; y < endY; y++) {
              for (let x = startX; x < endX; x++) {
                const index = (y * sampleSize + x) * 4;
                const alpha = (pixels[index + 3] ?? 255) / 255;
                const r = (pixels[index] ?? 255) * alpha + 255 * (1 - alpha);
                const g = (pixels[index + 1] ?? 255) * alpha + 255 * (1 - alpha);
                const b = (pixels[index + 2] ?? 255) * alpha + 255 * (1 - alpha);
                total += (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
                count++;
              }
            }

            return count ? total / count : 0;
          });

          const darkestTextArea = Math.min(...luminances);
          resolve(darkestTextArea > 170 ? 'dark' : 'light');
        } catch (err) {
          reject(err);
        }
      };

      image.onerror = () => reject(new Error('Image could not be loaded'));
      image.src = picture;
    });
  }

  // Note: getDomainTitle is now handled by the header-status-domains utility

  private _countActiveEntities(entities: EntityConfig[], domain: string): number {
    return entities.filter(entity => {
      const state = this._getEffectiveEntityState(this.hass.states[entity.entity_id]);
      return this._isEntityActiveForUi(state, domain);
    }).length;
  }

  private _areAllEntitiesOff(entities: EntityConfig[], domain: string): boolean {
    return this._countActiveEntities(entities, domain) === 0;
  }

  // Event Handlers
  private async _confirmDiscardSettings(): Promise<boolean> {
    if (this._selectedView !== 'settings' || !this._settingsDirty) return true;
    return this._showConfirmation(
      this._t('settings.discard_title'),
      this._t('settings.discard_confirm'),
      {
        confirmLabel: this._t('settings.discard_action'),
        destructive: true,
      }
    );
  }

  private _clearSettingsEditState(): void {
    const editor = this.renderRoot?.querySelector('dwains-dashboard-next-strategy-editor') as any;
    editor?._discardDeviceSettings?.();
    this._pendingSettingsConfig = undefined;
    this._deviceSettingsDirty = false;
    this._settingsDirty = false;
    this._settingsSaveError = '';
    this._settingsSavePending = false;
    this._settingsEditorInitialized = false;
    this._settingsPageKey = 'overview';
    this._settingsRestorePageKey = 'overview';
    this._settingsRestoreAreaId = undefined;
    this._settingsPageTitle = '';
    this._settingsPageParentTitle = '';
    this._settingsPageDescription = '';
  }

  private async _selectView(view: DwainsSelectedView) {
    if (view !== 'settings' && !(await this._confirmDiscardSettings())) return;
    this._setSettingsHistoryState(view === 'settings');
    this._resetAreaHeaderScrollState(view === 'area');
    this._selectedView = view;
    if (view === 'home') {
      this._selectedArea = null;
      this._editMode = false;
      this._rememberAreaEditMode(null);
      this._updateUrlArea(null);
      this._clearSettingsEditState();
    } else if (view === 'settings') {
      this._selectedArea = null;
      this._editMode = false;
      this._rememberAreaEditMode(null);
      this._updateUrlArea(null);
      this._pendingSettingsConfig = undefined;
      this._deviceSettingsDirty = false;
      this._settingsDirty = false;
      this._settingsSaveError = '';
      this._settingsEditorInitialized = false;
      this._settingsPageKey = 'overview';
      this._settingsPageTitle = '';
      this._settingsPageParentTitle = '';
      this._settingsPageDescription = '';
    }
    this._syncBottomNavAreaContext();
    this._closeMobileNav();
  }

  private async _selectArea(areaId: string) {
    if (!(await this._confirmDiscardSettings())) return;
    this._setSettingsHistoryState(false);
    this._resetAreaHeaderScrollState(true);
    this._areaQuickPage = 0;
    this._selectedArea = areaId;
    this._selectedView = 'area';
    this._editMode = false;
    this._rememberAreaEditMode(null);
    this._clearSettingsEditState();
    this._closeMobileNav();
    this._updateUrlArea(areaId);
    this._syncBottomNavAreaContext();
  }

  private _handleHomeNavigationKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this._selectView('home');
  };

  private _toggleHeader() {
    this._headerExpanded = !this._headerExpanded;
  }

  private _toggleMobileNav() {
    const opening = !this._mobileNavOpen;
    if (opening) {
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-mobile-nav-sheet', {
        detail: { kind: 'areas' },
      }));
    }
    this._mobileNavOpen = opening;
  }

  private _handleAreaNavToggle = () => {
    if (!this._isMobile) return;
    this._toggleMobileNav();
  };

  private _handleMobileNavSheet = (event: CustomEvent<{ kind?: string }>) => {
    if (event.detail?.kind !== 'areas') {
      this._mobileNavOpen = false;
    }
  };

  private _handleOpenSettingsEvent = () => {
    this._openDashboardSettings();
  };

  private _handleOpenHomeEvent = () => {
    this._selectView('home');
  };

  private _openDeviceDomain(domain: string): void {
    this._navigateToDeviceDomain(domain);
    const isBinarySensorDeviceClass = domain.startsWith('binary_sensor.');
    const deviceClass = isBinarySensorDeviceClass ? domain.slice('binary_sensor.'.length) : undefined;
    const detail = {
      domain,
      icon: domain === 'person'
        ? 'mdi:account-group'
        : deviceClass
          ? getDeviceClassIcon('binary_sensor', deviceClass)
          : getDomainIcon(domain),
      label: deviceClass ? getDeviceClassName(this.hass, deviceClass) : getDomainName(this.hass, domain),
    };
    const dispatchDomainSelection = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get('dd_device') !== domain) return;
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-select-device-domain', { detail }));
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-device-context-changed', { detail }));
    };

    dispatchDomainSelection();
    [120, 360].forEach((delay) => window.setTimeout(dispatchDomainSelection, delay));
  }

  private _navigateToDeviceDomain(domain: string | null): void {
    const segment = window.location.pathname.split('/')[1] || 'lovelace';
    const params = new URLSearchParams();
    if (domain) params.set('dd_device', domain);
    const query = params.toString();
    navigateHomeAssistant(`/${segment}/devices${query ? `?${query}` : ''}`);
  }

  private _renderFavoritesSection() {
    const availableFavorites = this._getEffectiveFavoriteEntities();
    if (availableFavorites.length === 0) {
      return nothing;
    }

    return html`
      <div class="favorites-section">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <h3>${this._t('favorites.title')}</h3>
        </div>
        <div class="favorites-grid">
          ${repeat(
            availableFavorites,
            (entityId) => entityId,
            (entityId) => this._renderFavoriteCard(entityId)
          )}
        </div>
      </div>
    `;
  }

  private async _renderFavoriteTileCards(): Promise<void> {
    if (!this.shadowRoot || !this.hass) return;
    if (!this._headerExpanded) return;
    const version = ++this._favoritesRenderVersion;

    const wrappers = this.shadowRoot?.querySelectorAll('dwains-dashboard-next-tile-host.favorite-tile-wrapper');
    if (!wrappers) return;

    wrappers.forEach((wrapper: Element) => {
      // Safety check: ensure wrapper exists and is connected
      if (!wrapper || !wrapper.isConnected) {
        return;
      }

      const entityId = (wrapper as HTMLElement).getAttribute('entity') as string | null;

      if (!entityId) return;

      // Bail if a newer render started or header collapsed
      if (version !== this._favoritesRenderVersion || !this._headerExpanded) {
        return;
      }

      // Hand off to dwains-dashboard-next-tile-host which safely manages lifecycle
      (wrapper as any).hass = this.hass;
    });
  }

  private async _loadHomeAssistantSummaries(): Promise<void> {
    if (!this.hass) return;

    const [repairsIssueCount, discoveredDeviceCount] = await Promise.all([
      this._fetchRepairsIssueCount(),
      this._fetchDiscoveredDeviceCount(),
    ]);

    if (this._repairsIssueCount !== repairsIssueCount) {
      this._repairsIssueCount = repairsIssueCount;
    }
    if (this._discoveredDeviceCount !== discoveredDeviceCount) {
      this._discoveredDeviceCount = discoveredDeviceCount;
    }
  }

  private async _fetchRepairsIssueCount(): Promise<number> {
    try {
      const response = await this.hass.callWS<any>({ type: 'repairs/list_issues' });
      const issues = this._extractCollection(response?.issues ?? response);
      return issues.filter(item => !this._isSummaryItemDismissed(item)).length;
    } catch (err) {
      return 0;
    }
  }

  private async _fetchDiscoveredDeviceCount(): Promise<number> {
    const messageTypes = [
      'config_entries/flow/progress',
      'config_entries/discovery_info',
      'config_entries/discovery_info/list',
      'config_entries/get_discovery_info',
    ];

    for (const type of messageTypes) {
      try {
        const response = await this.hass.callWS<any>({ type });
        const count = this._countDiscoveryItems(response);
        if (count > 0) return count;
      } catch (err) {
        // Different HA versions expose different discovery endpoints.
      }
    }

    return 0;
  }

  private _getUpdateEntityCount(): number {
    return Object.values(this.hass?.states || {}).filter((entity: any) =>
      entity.entity_id?.startsWith('update.') &&
      entity.state === 'on'
    ).length;
  }

  private _hasUpdateEntityChanges(oldHass: HomeAssistant, newHass: HomeAssistant): boolean {
    const updateEntityIds = new Set([
      ...Object.keys(oldHass.states || {}).filter(entityId => entityId.startsWith('update.')),
      ...Object.keys(newHass.states || {}).filter(entityId => entityId.startsWith('update.')),
    ]);

    for (const entityId of updateEntityIds) {
      const oldState = oldHass.states[entityId];
      const newState = newHass.states[entityId];
      if (oldState?.state !== newState?.state) return true;
    }

    return false;
  }

  private _extractCollection(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') return Object.values(value);
    return [];
  }

  private _isSummaryItemDismissed(item: any): boolean {
    return Boolean(
      item?.dismissed ||
      item?.ignored ||
      item?.is_ignored ||
      item?.status === 'ignored' ||
      item?.status === 'dismissed'
    );
  }

  private _countDiscoveryItems(value: any): number {
    if (!value) return 0;

    if (Array.isArray(value)) {
      return value.filter(item => !this._isSummaryItemDismissed(item)).length;
    }

    if (typeof value !== 'object') return 0;

    if (this._looksLikeDiscoveryItem(value)) {
      return this._isSummaryItemDismissed(value) ? 0 : 1;
    }

    const explicitCollection = value.discovered ?? value.discovery ?? value.flows ?? value.entries ?? value.items;
    if (explicitCollection) return this._countDiscoveryItems(explicitCollection);

    return (Object.values(value) as any[]).reduce<number>(
      (total, child) => total + this._countDiscoveryItems(child),
      0
    );
  }

  private _looksLikeDiscoveryItem(value: any): boolean {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return Boolean(
      value.flow_id ||
      value.handler ||
      value.source ||
      value.context ||
      value.integration ||
      value.domain
    );
  }

  private _closeMobileNav() {
    this._mobileNavOpen = false;
  }

  private _showMoreInfo(entityId: string) {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private _syncSettingsEditor(): void {
    const editor = this.renderRoot?.querySelector('dwains-dashboard-next-strategy-editor') as any;
    if (!editor || !this.hass || !this.config) return;

    editor.hass = this.hass;
    if (!this._settingsEditorInitialized) {
      this._settingsEditorInitialized = true;
      const restorePage = this._settingsRestorePageKey || this._settingsPageKey || 'overview';
      const restoreArea = this._settingsRestoreAreaId;
      void editor.setConfig(this.config).then(() => {
        editor._restoreSettingsNavigation?.(restorePage, restoreArea);
      });
    }
  }

  private _handleSettingsConfigChanged = (event: Event): void => {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ config?: Partial<DwainsDashboardConfig> }>).detail;
    this._pendingSettingsConfig = detail?.config;
    this._settingsDirty = Boolean(this._pendingSettingsConfig) || this._deviceSettingsDirty;
    this._settingsSaveError = '';
  };

  private _handleDeviceSettingsChanged = (event: Event): void => {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ dirty?: boolean }>).detail;
    this._deviceSettingsDirty = Boolean(detail?.dirty);
    this._settingsDirty = Boolean(this._pendingSettingsConfig) || this._deviceSettingsDirty;
    this._settingsSaveError = '';
  };

  private _handleSettingsPageChanged = (event: Event): void => {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ page?: string; areaId?: string; title?: string; parentTitle?: string; description?: string }>).detail || {};
    this._settingsPageKey = detail.page || 'overview';
    this._settingsRestorePageKey = this._settingsPageKey;
    this._settingsRestoreAreaId = detail.areaId || undefined;
    this._settingsPageTitle = detail.title || '';
    this._settingsPageParentTitle = detail.parentTitle || '';
    this._settingsPageDescription = detail.description || '';
    this._setSettingsHistoryState(true);
  };

  private _settingsBackToOverview = (): void => {
    const editor = this.renderRoot?.querySelector('dwains-dashboard-next-strategy-editor') as any;
    editor?._backToSettingsOverview?.();
  };

  private _settingsSecondaryAction = (): void => {
    this._closeSettingsPage();
  };

  private _closeSettingsPage = async (): Promise<void> => {
    if (!(await this._confirmDiscardSettings())) return;
    this._clearSettingsEditState();
    await this._selectView('home');
  };

  private async _saveSettingsPage(): Promise<void> {
    if ((!this._pendingSettingsConfig && !this._deviceSettingsDirty) || this._settingsSavePending || !this.hass) return;
    if (!this._canManageDashboard()) return;

    this._settingsSavePending = true;
    this._settingsSaveError = '';
    this._setSettingsHistoryState(true);

    try {
      if (this._pendingSettingsConfig) {
        const urlPath = this._getDashboardUrlPath();
        const base = urlPath ? { url_path: urlPath } : {};
        const lovelaceConfig: any = await this.hass.callWS({ type: 'lovelace/config', ...base });
        const strategy = lovelaceConfig?.strategy || {};
        const nextStrategy = {
          ...strategy,
          ...this._pendingSettingsConfig,
        };
        const nextConfig = {
          ...lovelaceConfig,
          strategy: nextStrategy,
        };

        await this.hass.callWS({ type: 'lovelace/config/save', ...base, config: nextConfig });

        this.config = {
          ...this.config,
          ...this._pendingSettingsConfig,
        };
      }

      const editor = this.renderRoot?.querySelector('dwains-dashboard-next-strategy-editor') as any;
      editor?._commitDeviceSettings?.();

      this._pendingSettingsConfig = undefined;
      this._deviceSettingsDirty = false;
      this._settingsDirty = false;
      this._settingsSaveError = '';
      this._settingsEditorInitialized = false;
      this.requestUpdate();
    } catch (err) {
      console.error('Failed to save Dwains Dashboard settings:', err);
      this._settingsSaveError = this._t('error.settings_save', { error: String(err) });
    } finally {
      this._settingsSavePending = false;
    }
  }

  private _renderSettingsView(): TemplateResult {
    const canSave = this._settingsDirty && !this._settingsSavePending;
    const onSubpage = this._settingsPageKey !== 'overview';
    const title = this._settingsPageTitle || this._t('sidebar.dashboard_settings');
    const description = this._settingsPageDescription || this._t('settings.subtitle');
    const secondaryLabel = this._settingsDirty ? this._t('common.cancel') : this._t('common.close');

    return html`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title=${onSubpage ? this._t('common.back') : this._t('common.close')}
            aria-label=${onSubpage ? this._t('common.back') : this._t('common.close')}
            @click=${onSubpage ? this._settingsBackToOverview : this._closeSettingsPage}
          >
            <ha-icon icon=${onSubpage ? 'mdi:arrow-left' : 'mdi:close'}></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>
              ${this._settingsPageParentTitle
                ? html`<span class="settings-breadcrumb-parent">${this._settingsPageParentTitle}</span>
                    <ha-icon class="settings-breadcrumb-separator" icon="mdi:chevron-right"></ha-icon>
                    <span>${title}</span>`
                : title}
            </h1>
            <p>${description}</p>
          </div>
          <div class="settings-page-actions">
            <button type="button" class="settings-secondary" @click=${this._settingsSecondaryAction}>
              ${secondaryLabel}
            </button>
            <button
              type="button"
              class="settings-primary"
              ?disabled=${!canSave}
              @click=${this._saveSettingsPage}
            >
              ${this._settingsSavePending ? this._t('common.saving') : this._t('common.save')}
            </button>
          </div>
        </header>
        ${this._settingsSaveError
          ? html`<div class="settings-save-error">${this._settingsSaveError}</div>`
          : nothing}
        <div
          class="settings-page-editor"
          @config-changed=${this._handleSettingsConfigChanged}
          @dwains-dashboard-next-device-settings-changed=${this._handleDeviceSettingsChanged}
          @dd-settings-page-changed=${this._handleSettingsPageChanged}
        >
          <dwains-dashboard-next-strategy-editor .inlineBackNavigation=${false}></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-page-bottom-actions">
          <button type="button" class="settings-secondary" @click=${this._settingsSecondaryAction}>
            ${secondaryLabel}
          </button>
          <button
            type="button"
            class="settings-primary"
            ?disabled=${!canSave}
            @click=${this._saveSettingsPage}
          >
            ${this._settingsSavePending ? this._t('common.saving') : this._t('common.save')}
          </button>
        </div>
      </section>
    `;
  }

  private _getWelcomeUserPicture(userName: string): string | undefined {
    const normalizedUserName = userName.trim().toLowerCase();
    const personEntities = Object.values(this.hass?.states || {}).filter(
      (entity: any) => entity.entity_id?.startsWith('person.')
    );
    const matchingPerson = personEntities.find((entity: any) =>
      String(entity.attributes?.friendly_name || '').trim().toLowerCase() === normalizedUserName
    );
    const fallbackPerson = personEntities.find((entity: any) => entity.attributes?.entity_picture);
    return (matchingPerson || fallbackPerson)?.attributes?.entity_picture;
  }

  private _openDashboardSettings = () => {
    if (!this._canManageDashboard()) return;
    this._setSettingsHistoryState(true);
    this._resetAreaHeaderScrollState(true);
    this._selectedArea = null;
    this._selectedView = 'settings';
    this._editMode = false;
    this._rememberAreaEditMode(null);
    this._updateUrlArea(null);
    this._pendingSettingsConfig = undefined;
    this._settingsDirty = false;
    this._settingsSaveError = '';
    this._settingsEditorInitialized = false;
    this._settingsPageKey = 'overview';
    this._settingsRestorePageKey = 'overview';
    this._settingsRestoreAreaId = undefined;
    this._settingsPageTitle = '';
    this._settingsPageParentTitle = '';
    this._settingsPageDescription = '';
    this._setSettingsHistoryState(true);
    this._closeMobileNav();
    this._syncBottomNavAreaContext();
    this.updateComplete.then(() => this._scrollContentAreaToTop());
  };

  private _openProfileSettings = () => {
    navigateHomeAssistant('/profile/general');
  };

  private _openNotificationsFromHomeShortcut = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this._closeMobileNav();
    this._openNotifications();
  };

  private _openNotifications = () => {
    if (!this._showNotificationsUi()) return;

    this._notificationsOpen = true;
    this._persistentNotificationsLoaded = true;
    void this._loadPersistentNotifications(true);
    void this._ensurePersistentNotificationsSubscription();
  };

  private _closeNotifications = () => {
    this._notificationsOpen = false;
  };

  private async _loadPersistentNotifications(showError = true): Promise<void> {
    if (!this.hass || !this._showNotificationsUi()) return;

    this._notificationsLoading = true;
    if (showError) this._notificationsError = '';

    try {
      const notifications = await this.hass.callWS<PersistentNotification[]>({
        type: 'persistent_notification/get',
      });
      this._persistentNotifications = this._sortPersistentNotifications(
        this._normalizePersistentNotifications(notifications)
      );
      this._notificationsError = '';
    } catch (err) {
      if (showError || this._notificationsOpen) {
        console.error('Failed to load persistent notifications:', err);
        this._notificationsError = this._t('error.notifications_load');
      }
    } finally {
      this._notificationsLoading = false;
    }
  }

  private async _ensurePersistentNotificationsSubscription(): Promise<void> {
    if (!this._showNotificationsUi() || this._persistentNotificationsUnsub || !this.hass) return;

    const connection = (this.hass as any).connection;
    if (!connection?.subscribeMessage) return;

    try {
      const unsub = await connection.subscribeMessage(
        (event: any) => this._handlePersistentNotificationEvent(event),
        { type: 'persistent_notification/subscribe' }
      );
      if (typeof unsub === 'function') {
        this._persistentNotificationsUnsub = () => {
          void unsub();
        };
      }
    } catch (err) {
      console.warn('Persistent notification subscription unavailable:', err);
    }
  }

  private _handlePersistentNotificationEvent(event: any): void {
    if (!this._showNotificationsUi()) return;

    const type = event?.type;
    const notifications = this._normalizePersistentNotifications(event?.notifications);

    if (type === 'current') {
      this._persistentNotifications = this._sortPersistentNotifications(notifications);
      this._notificationsError = '';
      return;
    }

    if (type === 'removed') {
      const removedIds = new Set(notifications.map((notification) => notification.notification_id));
      this._persistentNotifications = this._persistentNotifications.filter(
        (notification) => !removedIds.has(notification.notification_id)
      );
      return;
    }

    if (type === 'added' || type === 'updated') {
      const next = new Map(
        this._persistentNotifications.map((notification) => [notification.notification_id, notification])
      );
      notifications.forEach((notification) => next.set(notification.notification_id, notification));
      this._persistentNotifications = this._sortPersistentNotifications([...next.values()]);
    }
  }

  private _normalizePersistentNotifications(input: any): PersistentNotification[] {
    const rawNotifications = Array.isArray(input) ? input : Object.values(input || {});
    return rawNotifications
      .map((item: any) => ({
        notification_id: String(item?.notification_id || ''),
        title: item?.title || null,
        message: String(item?.message || ''),
        created_at: item?.created_at ? String(item.created_at) : undefined,
      }))
      .filter((notification) => notification.notification_id);
  }

  private _sortPersistentNotifications(notifications: PersistentNotification[]): PersistentNotification[] {
    return [...notifications].sort((a, b) => {
      const bTime = b.created_at ? Date.parse(b.created_at) : 0;
      const aTime = a.created_at ? Date.parse(a.created_at) : 0;
      return bTime - aTime;
    });
  }

  private _formatNotificationDate(createdAt: string): string {
    const timestamp = Date.parse(createdAt);
    if (!Number.isFinite(timestamp)) return createdAt;

    return new Date(timestamp).toLocaleString(this.hass?.language || undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private _dismissPersistentNotification = async (notificationId: string) => {
    const previous = this._persistentNotifications;
    this._persistentNotifications = previous.filter(
      (notification) => notification.notification_id !== notificationId
    );

    try {
      await this.hass.callService('persistent_notification', 'dismiss', {
        notification_id: notificationId,
      });
      this._notificationsError = '';
    } catch (err) {
      console.error('Failed to dismiss persistent notification:', err);
      this._persistentNotifications = previous;
      this._notificationsError = this._t('error.notification_dismiss');
    }
  };

  private _dismissAllPersistentNotifications = async () => {
    const previous = this._persistentNotifications;
    this._persistentNotifications = [];

    try {
      await this.hass.callService('persistent_notification', 'dismiss_all');
      this._notificationsError = '';
    } catch (err) {
      console.error('Failed to dismiss all persistent notifications:', err);
      this._persistentNotifications = previous;
      this._notificationsError = this._t('error.notifications_dismiss_all');
    }
  };

  private _handleStatusCardClick(domain: DomainCount) {
    if (domain.domain === 'person') {
      this._showPersonEntities();
    } else if (domain.domain === 'wattage') {
      this._showWattageEntities();
    } else {
      this._showHouseStatusEntities(domain);
    }
  }

  private _houseInfoDeviceViewLabel(): string {
    return String(this.hass?.language || '').toLowerCase().startsWith('de')
      ? 'Geräteansicht öffnen'
      : 'Open device view';
  }

  private _houseInfoEnergyViewLabel(): string {
    return String(this.hass?.language || '').toLowerCase().startsWith('de')
      ? 'Energiesensoren anzeigen'
      : 'View energy sensors';
  }

  private _showHouseStatusEntities(domain: DomainCount) {
    const entityIds = domain.entities || [];
    if (!entityIds.length) {
      this._openDeviceDomain(this._statusDeviceDomainKey(domain));
      return;
    }

    showDomainEntitiesDialog(this, {
      domain: domain.domain,
      config: this.config,
      deviceClass: domain.deviceClass,
      entityIds,
      customTitle: domain.name,
      homeInformation: true,
      homeInformationPresentation: 'devices',
      deviceViewKey: this._statusDeviceDomainKey(domain),
      viewAllLabel: this._houseInfoDeviceViewLabel(),
      onViewAll: () => this._openDeviceDomain(this._statusDeviceDomainKey(domain)),
    });
  }

  private _statusDeviceDomainKey(domain: DomainCount): string {
    if (domain.domain === 'cover') {
      if (domain.statusKind === 'shading') return 'cover_shading';
      if (domain.statusKind === 'gate') return 'cover_gates';
      if (domain.statusKind === 'window' || domain.statusKind === 'door') return 'cover_openings';
    }
    return domain.deviceClass ? `${domain.domain}.${domain.deviceClass}` : domain.domain;
  }

  private _showPersonEntities() {
    // TODO: Implement person entities dialog
    showDomainEntitiesDialog(this, {
      domain: 'person',
      config: this.config,
      entityIds: this._getVisiblePersonEntities().map(person => person.entity_id),
      customTitle: this._t('home.people'),
      homeInformation: true,
      homeInformationPresentation: 'devices',
      deviceViewKey: 'person',
      viewAllLabel: this._houseInfoDeviceViewLabel(),
      onViewAll: () => this._openDeviceDomain('person'),
    });
  }

  private _showWattageEntities() {
    showDomainEntitiesDialog(this, {
      domain: 'sensor',
      config: this.config,
      filterByUnitOfMeasurement: 'W'
    });
  }

  private _handleLightToggle(e: Event, areaId: string) {
    e.stopPropagation(); // Prevent area selection
    this._toggleAreaLights(areaId);
  }

  private _shouldUpdateEntities(oldHass: HomeAssistant, newHass: HomeAssistant): boolean {
    // Check if any entity states changed that would require updates
    const relevantDomains = ['light', 'switch', 'climate', 'media_player', 'camera', 'cover', 'lock', 'binary_sensor', 'person', 'sensor', 'fan'];

    return Object.keys(newHass.states).some(entityId => {
      const domain = entityId.split('.')[0];
      if (!domain || !relevantDomains.includes(domain)) return false;

      const oldState = oldHass.states[entityId];
      const newState = newHass.states[entityId];

      // Check if state changed (not just timestamp)
      return oldState?.state !== newState?.state ||
             oldState?.attributes !== newState?.attributes;
    });
  }

  private _updateEntityCards(_oldHass: HomeAssistant, newHass: HomeAssistant): void {
    if (!this.shadowRoot) return;

    this.shadowRoot
      .querySelectorAll(
        'dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host, hui-card, hui-tile-card, hui-entity-card, hui-thermostat-card, hui-picture-entity-card, hui-media-control-card'
      )
      .forEach((card: any) => {
        if (card.hass !== newHass) {
          card.hass = newHass;
        }
      });
  }

  private _clearEntityCardsCache(): void {
    this._areaDataCache.clear();
    // Also clear domain counts cache to prevent stale data
    this._domainCountsCache.clear();
    // Clear the external area data cache in utils/area.ts
    clearAreaDataCache();
  }

  private _invalidateChangedAreaCaches(oldHass: HomeAssistant, newHass: HomeAssistant): void {
    const changedAreaIds = new Set<string>();
    let hasChangedEntity = false;

    for (const entity of this.config?.entities || []) {
      const entityId = entity.entity_id;
      const oldState = oldHass.states[entityId];
      const newState = newHass.states[entityId];

      if (oldState === newState) continue;
      if (oldState?.state === newState?.state && oldState?.attributes === newState?.attributes) continue;

      hasChangedEntity = true;
      if (entity.area_id) {
        changedAreaIds.add(entity.area_id);
      }
    }

    if (hasChangedEntity) {
      this._domainCountsCache.clear();
    }

    changedAreaIds.forEach(areaId => {
      this._areaDataCache.delete(areaId);
      clearAreaDataCacheForArea(areaId);
    });
  }

  private _showUnavailableEntitiesModal(areaId: string) {
    const unavailableEntities = this._getUnavailableAreaEntities(areaId);
    // Combine unavailable and unknown entities
    const allProblematicEntities = [
      ...unavailableEntities.unavailable,
      ...unavailableEntities.unknown
    ];

    // Show the unavailable entities in the shared domain dialog.
    showDomainEntitiesDialog(this, {
      domain: 'unavailable',
      areaId: areaId,
      config: this.config,
      customTitle: this._t('settings.hidden_unavailable_title'),
      customEntities: allProblematicEntities,
      customDescription: this._t('settings.hidden_unavailable_description'),
      viewAllLabel: this._houseInfoDeviceViewLabel(),
      onViewAll: () => this._navigateToDeviceDomain('__maintenance__'),
    });
  }

  private _areaThermostatEntityId(entities: EntityConfig[]): string | undefined {
    if (this.config?.settings?.show_area_thermostat === false) return undefined;
    return pickAreaThermostatEntityId(entities.map(entity => entity.entity_id), this.hass.states);
  }
  private async _toggleAreaLights(areaId: string) {
    const entities = this._getFilteredAreaEntities(areaId);
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    if (lights.length === 0) return;

    const allOff = this._areAllEntitiesOff(lights, 'light');
    const confirmed = await this._confirmMasterActionIfNeeded('light', allOff, lights.length, areaId);
    if (!confirmed) return;

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = lights.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, allOff ? 'on' : 'off');

    try {
      await this.hass.callService('light', service, {
        entity_id: entityIds
      });

      this._showToast(this._t(allOff ? 'action.all_lights_on' : 'action.all_lights_off'));
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle lights in area ${areaId}:`, err);
      this._showToast(this._t('entity.lights_failed'));
    }
  }

  private _resolveConfirmation(confirmed: boolean): void {
    const resolve = this._confirmationResolve;
    this._confirmationResolve = undefined;
    this._confirmationDialog = null;
    resolve?.(confirmed);
  }

  private _handleConfirmationKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this._resolveConfirmation(false);
  };

  private _showConfirmation(
    title: string,
    message: string,
    options: { confirmLabel?: string; destructive?: boolean } = {}
  ): Promise<boolean> {
    if (this._confirmationResolve) {
      this._resolveConfirmation(false);
    }

    return new Promise(resolve => {
      this._confirmationResolve = resolve;
      this._confirmationDialog = {
        title,
        message,
        confirmLabel: options.confirmLabel || title,
        destructive: options.destructive === true,
      };

      void this.updateComplete.then(() => {
        this.shadowRoot?.querySelector<HTMLElement>('.confirmation-content')?.focus();
      });
    });
  }

  private _showToast(message: string) {
    // TODO: Implement proper toast notification
    console.log('Toast:', message);
  }


}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-layout-card': DwainsLayoutCard;
  }
}
