import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, AreaConfig, EntityConfig, AreaData, AreaCustomCard, HomeInformationCardKey, HomeSectionKey } from '../types/strategy';
import { getAreaData, clearAreaDataCache, clearAreaDataCacheForArea } from '../utils/area';
import { getAreaIcon, getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { getStatusDomains, getTotalWattage, type DomainCount as StatusDomainCount } from '../utils/header-status-domains';
import { getDeviceClassName, getDomainName } from '../utils/domain-names';
import { filterHiddenDeviceEntities } from '../utils/device-admission';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import { sortAreas } from '../utils/area-entities';
import { navigateHomeAssistant } from '../utils/navigation';
import { normalizeHiddenHomeInformationCards, normalizeHiddenHomeSections, normalizeHomeSectionsOrder } from '../utils/home-sections';
import { buildHousePowerUsage } from '../utils/power-usage';
import { showDomainEntitiesDialog } from './utils/show-domain-entities-dialog';
import { showCardEditorDialog } from './utils/show-card-editor-dialog';
import { ensureBottomNav } from './dwains-bottom-nav';
import { makeDialogManager } from './utils/make-dialog-manager';
import './dwains-dashboard-strategy-editor';
import './utils/dd-card-host';
import './utils/dd-tile-host';
import { fireEvent } from './utils/fire-event';
import { ddLocalize } from '../utils/localize';

// Use DomainCount from header-status-domains utility
type DomainCount = StatusDomainCount;
type DwainsSelectedView = 'home' | 'area' | 'settings';
type PictureTextTone = 'light' | 'dark';
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
const ICON_ARROW_LEFT = 'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z';

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

interface HomeAreaCamera {
  areaId: string;
  areaName: string;
  areaIcon: string;
  entityId: string;
  name: string;
  state: string;
  imageUrl?: string;
  count: number;
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

@customElement('dwains-dashboard-next-layout-card')
export class DwainsLayoutCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DwainsDashboardConfig;

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  @state() private _selectedArea: string | null = null;
  @state() private _selectedView: DwainsSelectedView | null = null;
  @state() private _isMobile = false;
  @state() private _headerExpanded = false;
  @state() private _headerCompact = false;
  private _favoritesRenderVersion = 0;
  @state() private _currentTime = '';
  @state() private _currentDate = '';
  @state() private _mobileNavOpen = false;
  @state() private _hasRelevantStateChanges = false;
  @state() private _editMode = false;
  @state() private _notificationsOpen = false;
  @state() private _persistentNotifications: PersistentNotification[] = [];
  @state() private _notificationsLoading = false;
  @state() private _notificationsError = '';
  @state() private _mobileDomainMenu: { areaId: string; groupKey: string } | null = null;
  @state() private _areaHeaderStuck = false;
  @state() private _areaHeaderRevealed = false;
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
  @state() private _optimisticEntityStates: Record<string, OptimisticEntityState> = {};
  @state() private _renderAllMobileHomeAreas = false;
  @state() private _renderAllMobileAreaEntities = false;
  @state() private _settingsDirty = false;
  @state() private _settingsSavePending = false;
  @state() private _settingsSaveError = '';

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
  private _mobileDomainMenuPortal?: HTMLElement;
  private _areaHeaderScrollRaf?: number;
  private _pendingAreaScrollTop = 0;
  private _optimisticCleanupTimer?: number;
  private _lastAreaScrollTop = 0;
  private _areaScrollUpDistance = 0;
  private _pictureContrastCache = new Map<string, PictureContrastCacheValue>();
  private _sidebarResizePointerId?: number;
  private _progressiveRenderCancel?: () => void;
  private _pendingSettingsConfig?: Partial<DwainsDashboardConfig>;
  private _settingsEditorInitialized = false;

  // Debounce timers
  private _updateDebounceTimer?: number;

  // Required by Home Assistant
  setConfig(config: DwainsDashboardConfig) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;

    // Set initial view — herstel evt. de area uit de URL (?dd_area=...)
    if (!this._selectedView) {
      const urlArea = this._getUrlArea();
      if (urlArea && config.areas?.some(a => a.area_id === urlArea)) {
        this._selectedArea = urlArea;
        this._selectedView = 'area';
      } else {
        this._selectedView = 'home';
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

  private _syncBottomNavAreaContext(): void {
    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    const settingsSelected = this._selectedView === 'settings';
    window.dispatchEvent(new CustomEvent('dwains-dashboard-next-area-context-changed', {
      detail: {
        areaId: this._selectedView === 'area' ? this._selectedArea : null,
        icon: settingsSelected ? 'mdi:cog-outline' : area ? getAreaIcon(area) : 'mdi:home',
        name: settingsSelected ? 'Settings' : area?.name || 'Home',
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

  static override styles = css`
    :host {
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
    .mobile-domain-more,
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
    .dd-custom-card-wrap.editing {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .dd-static-icon {
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
    .favorite-card-wrapper {
      contain: layout style paint;
    }

    .mobile-home-section,
    .home-camera-section,
    .home-status-section,
    .home-favorites-section,
    .home-summaries-section,
    .mobile-domain-group {
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    /* Layout Container */
    .layout-container {
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
    .layout-container.sidebar-resizing * {
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar {
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content {
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar {
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar {
      transition: none;
    }

    .sidebar-resize-handle {
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

    .sidebar-resize-handle::before {
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
    .layout-container.sidebar-resizing .sidebar-resize-handle::before {
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible {
      outline: none;
    }

    .sidebar-collapse-toggle {
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

    .sidebar-collapse-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed {
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

    .sidebar-collapse-label {
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label {
      display: inline;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header {
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact {
      padding: 8px 16px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date {
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background: var(--secondary-background-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon {
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact {
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section {
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar {
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact {
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

    .status-card-compact:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact {
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

    .status-card-title-compact {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #e1a129) 15%, transparent);
    }

    .status-card-compact.light ha-icon {
      color: var(--status-color, #e1a129);
    }

    .status-card-compact.switch .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #2f6fd6) 15%, transparent);
    }

    .status-card-compact.switch ha-icon {
      color: var(--status-color, #2f6fd6);
    }

    .status-card-compact.binary_sensor .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #df5b63) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon {
      color: var(--status-color, #df5b63);
    }

    .status-card-compact.person .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #6d7891) 15%, transparent);
    }

    .status-card-compact.person ha-icon {
      color: var(--status-color, #6d7891);
    }

    .status-card-compact.wattage .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, #d88e20) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon {
      color: var(--status-color, #d88e20);
    }

    /* Header Expand Button */
    .header-expand-button {
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

    .header-expand-button:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after {
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
    .area-list {
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section {
      margin-bottom: 16px;
    }

    .floor-header {
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button {
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

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button {
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture {
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark {
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background {
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

    .area-button.has-picture:hover .area-background {
      opacity: 0.8;
    }

    /* Area content structure */
    .area-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
    .area-button.has-picture .area-sensors {
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon {
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

    .area-button.selected .area-main-icon {
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon {
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info {
      flex: 1;
    }

    .area-menu-chevron {
      display: none;
    }

    .home-notification-shortcut {
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

    .home-notification-shortcut ha-icon {
      --mdc-icon-size: 15px;
    }

    .home-notification-count {
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e13f3f;
      color: #ffffff;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors {
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts {
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
    .content-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
    }

    .content-area.settings-content-area {
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view {
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 104px;
      box-sizing: border-box;
    }

    .settings-page-header {
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
    .settings-primary {
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-title {
      min-width: 0;
    }

    .settings-page-title h1 {
      margin: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }

    .settings-page-title p {
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-page-actions,
    .settings-page-bottom-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }

    .settings-secondary,
    .settings-primary {
      min-height: 40px;
      padding: 0 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-secondary {
      background: transparent;
      color: var(--primary-color);
    }

    .settings-primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-save-error {
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--error-color) 12%, var(--card-background-color));
      color: var(--error-color);
      font-weight: 750;
      font-size: 13px;
    }

    .settings-page-editor {
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor {
      display: block;
    }

    .settings-page-bottom-actions {
      display: none;
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Home View */
    .home-view {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome {
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content {
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-user {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar {
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

    .welcome-avatar:hover {
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon {
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-copy {
      min-width: 0;
    }

    .welcome-text {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .welcome-greeting {
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name {
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title {
      display: none;
    }

    .welcome-return {
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

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action {
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

    .welcome-action:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-action ha-icon {
      --mdc-icon-size: 22px;
    }

    .welcome-action:active {
      transform: scale(0.96);
    }

    .welcome-action-badge {
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

    .welcome-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time {
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed {
      background: var(--error-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-disarmed {
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered {
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon {
      --mdc-icon-size: 18px;
    }

    .alarm-text {
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .welcome-weather {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon {
      --mdc-icon-size: 20px;
    }

    .weather-temp {
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label {
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome {
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

      .welcome-content {
        padding: 0;
      }

      .welcome-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user {
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar {
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-text {
        display: block;
      }

      .welcome-greeting,
      .welcome-name {
        display: none;
      }

      .welcome-title {
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return {
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section {
        display: none;
      }

      .welcome-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-subheader {
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar {
        display: none;
      }

      .welcome-alarm,
      .welcome-weather {
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
      .weather-temp {
        font-size: 15px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome {
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header {
        gap: 10px;
      }

      .welcome-avatar {
        width: 36px;
        height: 36px;
      }

      .welcome-title {
        font-size: 14px;
      }

      .welcome-return {
        font-size: 11px;
      }

      .welcome-action {
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
      .welcome-weather {
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
      .weather-temp {
        font-size: 14px;
      }

      .weather-label {
        font-size: 10px;
      }
    }

    /* Home Status Cards */
    .home-status-section {
      margin-bottom: 48px;
    }

    .home-status-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon {
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

    .home-camera-section {
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-camera-section .mobile-layout-toggle {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section {
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-summaries-section .mobile-layout-toggle.active {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-summary-list {
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card {
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

    .home-summary-card:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active {
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon {
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

    .home-summary-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-summary-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card {
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

    .home-camera-card:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
    .home-camera-placeholder {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon {
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after {
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

    .home-camera-content {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
    .home-camera-count {
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

    .home-camera-area-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-count {
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon {
      --mdc-icon-size: 14px;
    }

    .home-camera-copy {
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name {
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta {
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
    .mobile-section-heading {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas {
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card {
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

    .layout-container.sidebar-collapsed .mobile-area-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture {
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

    .layout-container.sidebar-collapsed .mobile-area-picture {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
    .layout-container.sidebar-collapsed .mobile-area-copy {
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .layout-container.sidebar-collapsed .mobile-area-icon {
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

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon {
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon {
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge {
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

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge {
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name {
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta {
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
    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section {
      margin-bottom: 32px;
    }

    .person-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card {
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

    .person-card::after {
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

    .person-card.home {
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away {
      --person-color: #d88e20;
      --person-bg: color-mix(in srgb, #d88e20 9%, var(--card-background-color));
    }

    .person-card.unknown {
      --person-color: #7c67c7;
      --person-bg: color-mix(in srgb, #7c67c7 8%, var(--card-background-color));
    }

    .person-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active {
      transform: scale(0.988);
    }

    .person-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar {
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

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon {
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator {
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

    .person-home-indicator ha-icon {
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info {
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status {
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

    .person-status ha-icon {
      --mdc-icon-size: 15px;
    }

    .person-details {
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
    .person-distance {
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
    .person-distance ha-icon {
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon {
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"] {
      color: var(--error-color);
    }

    .person-distance ha-icon {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card {
        padding: 16px;
      }

      .person-avatar {
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon {
        --mdc-icon-size: 36px;
      }

      .person-name {
        font-size: 16px;
      }

      .person-status {
        font-size: 13px;
      }

      .person-details {
        gap: 8px;
      }

      .person-battery,
      .person-distance {
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card {
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

    .home-status-card::before {
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

    .home-status-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before {
      opacity: 1;
    }

    .home-status-card .status-card-icon {
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge {
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

    .home-status-card .status-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges {
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

    .info-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .info-badge.light {
      background: color-mix(in srgb, var(--badge-color, #e1a129) 10%, var(--card-background-color));
      color: var(--badge-color, #e1a129);
    }

    .info-badge.switch {
      background: color-mix(in srgb, var(--badge-color, #2f6fd6) 10%, var(--card-background-color));
      color: var(--badge-color, #2f6fd6);
    }

    .info-badge.climate {
      background: color-mix(in srgb, var(--badge-color, #34a6d8) 10%, var(--card-background-color));
      color: var(--badge-color, #34a6d8);
    }

    .info-badge.media_player {
      background: color-mix(in srgb, var(--badge-color, #7c67c7) 10%, var(--card-background-color));
      color: var(--badge-color, #7c67c7);
    }

    .info-badge.cover {
      background: color-mix(in srgb, var(--badge-color, #1494aa) 10%, var(--card-background-color));
      color: var(--badge-color, #1494aa);
    }

    .info-badge.fan {
      background: color-mix(in srgb, var(--badge-color, #2b8fcb) 10%, var(--card-background-color));
      color: var(--badge-color, #2b8fcb);
    }

    .info-badge.motion {
      background: color-mix(in srgb, var(--badge-color, #df5b63) 10%, var(--card-background-color));
      color: var(--badge-color, #df5b63);
    }

    .info-badge.alerts {
      background: color-mix(in srgb, var(--error-color) 10%, var(--card-background-color));
      color: var(--error-color);
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge {
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon {
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count {
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host {
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view {
      max-width: 1400px;
      margin: 0 auto;
    }

    .area-header {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .area-title {
      font-size: 28px;
      font-weight: 400;
      margin: 0 0 16px 0;
      flex: 1;
    }

    .unavailable-entities-icon {
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

    .unavailable-entities-icon:hover {
      background: var(--error-color);
      transform: scale(1.1);
    }

    .unavailable-entities-icon ha-icon {
      --mdc-icon-size: 18px;
      color: white;
    }

    .unavailable-count {
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
    .area-badges {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .area-badge {
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

    .area-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .area-badge ha-icon {
      --mdc-icon-size: 20px;
    }

    .area-badge.light-toggle {
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.light-toggle ha-icon {
      color: var(--warning-color);
    }

    .area-badge.switch-toggle {
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.switch-toggle ha-icon {
      color: var(--info-color);
    }

    .area-badge.wattage {
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.wattage ha-icon {
      color: var(--warning-color);
    }

    .area-badge.energy {
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.energy ha-icon {
      color: var(--info-color);
    }

    /* Entities Section */
    .entities-section {
      display: grid;
      gap: 16px;
    }

    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
    .light-entity-card,
    .motion-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    .mobile-area-overview,
    .mobile-entities-section {
      display: none;
    }

    .area-view .mobile-entities-section {
      display: grid;
      position: relative;
      z-index: 2;
    }

    .area-header-metrics {
      display: none;
    }

    .mobile-area-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-area-metric,
    .area-header-metric {
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
    .area-header-metric.temperature {
      --metric-color: #7c67c7;
    }

    .mobile-area-metric.humidity,
    .area-header-metric.humidity {
      --metric-color: #34a6d8;
    }

    .mobile-area-metric.power,
    .area-header-metric.power {
      --metric-color: #d88e20;
    }

    .mobile-area-metric.energy,
    .area-header-metric.energy {
      --metric-color: #7c67c7;
    }

    .metric-ring {
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

    .metric-ring::after {
      content: "";
      position: absolute;
      inset: 5px;
      border-radius: inherit;
      background: color-mix(in srgb, var(--card-background-color) 92%, #ffffff);
    }

    .metric-ring.metric-icon {
      background: color-mix(in srgb, var(--metric-color) 15%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
    }

    .metric-ring.metric-icon::after {
      display: none;
    }

    .metric-ring.metric-icon ha-icon {
      --mdc-icon-size: 22px;
      color: var(--metric-color);
    }

    .metric-value {
      position: relative;
      z-index: 1;
      color: color-mix(in srgb, var(--primary-text-color) 74%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1;
    }

    .metric-copy {
      min-width: 0;
    }

    .metric-label {
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
    }

    .metric-range {
      margin-top: 4px;
      color: color-mix(in srgb, var(--primary-text-color) 38%, transparent);
      font-size: 10px;
      font-weight: 800;
      line-height: 1;
    }

    .metric-reading {
      margin-top: 3px;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .mobile-entities-section {
      gap: 22px;
    }

    .mobile-domain-group {
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group:not(.menu-open) {
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open {
      z-index: 1200;
    }

    .mobile-domain-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-layout-toggle {
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

    .mobile-layout-toggle.active {
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active {
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-domain-title-copy {
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-more {
      width: 32px;
      height: 32px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-more.active {
      background: rgba(255, 255, 255, 0.78);
      color: var(--primary-text-color);
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.16);
    }

    .mobile-domain-more:active {
      transform: scale(0.94);
    }

    .mobile-domain-more ha-icon {
      --mdc-icon-size: 20px;
    }

    .mobile-entity-rail {
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar {
      display: none;
    }

    .mobile-entities-section.layout-grid {
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      contain: layout style;
      flex: 0 0 164px;
      min-width: 0;
      min-height: 128px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      scroll-snap-align: start;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .mobile-entity-card:active {
      transform: scale(0.985);
      }

      .mobile-entity-card.is-active {
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
      }

      .mobile-entity-card.is-unavailable {
        opacity: 0.62;
      }

    .mobile-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .mobile-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

      .mobile-entity-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .mobile-entity-action {
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border: 0;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease,
          opacity 0.18s ease;
      }

      .mobile-entity-action:active {
        transform: scale(0.94);
      }

      .mobile-entity-action:disabled {
        opacity: 0.36;
        cursor: not-allowed;
      }

      .mobile-entity-toggle {
        width: 38px;
        height: 22px;
        justify-content: flex-start;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.07),
          0 4px 10px rgba(15, 23, 42, 0.08);
      }

    .mobile-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
      }

      .mobile-entity-card.is-active .mobile-entity-toggle {
        background: var(--entity-color);
      }

    .mobile-entity-card.is-active .mobile-entity-toggle::before {
      transform: translateX(16px);
    }

      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .mobile-lock-action.is-unlocked {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-entity-more ha-icon,
      .mobile-scene-action ha-icon,
      .mobile-lock-action ha-icon {
        --mdc-icon-size: 17px;
      }

      .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 6px 14px rgba(15, 23, 42, 0.08);
      }

      .mobile-cover-action {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        background: transparent;
      }

      .mobile-cover-action.active {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
      }

      .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 30px;
        padding: 3px;
        gap: 2px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 24px;
        height: 24px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 15px;
      }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-card {
          min-height: 138px;
          padding: 12px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top {
          gap: 6px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-icon {
          width: 34px;
          height: 34px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-actions {
          min-height: 28px;
          padding: 2px;
          gap: 1px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action {
          width: 23px;
          height: 23px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
          --mdc-icon-size: 14px;
        }
      }

    .mobile-entity-meta {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

      .mobile-entity-name {
        margin-top: 3px;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 900;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .mobile-entity-status {
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-content {
        min-width: 0;
      }

      .mobile-entity-card.has-inline-select {
        min-height: 170px;
        justify-content: flex-start;
        gap: 10px;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-content {
        margin-top: auto;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-status {
        display: none;
      }

      .mobile-entity-select {
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select {
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

      .mobile-entity-select select:focus {
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    @media (min-width: 769px) {
      .area-view .mobile-entities-section {
        gap: 28px;
        margin-top: 20px;
      }

      .area-view .mobile-domain-group {
        min-width: 0;
      }

      .area-view .mobile-domain-header {
        padding: 0;
        margin-bottom: 12px;
      }

      .area-view .mobile-layout-toggle {
        display: none;
      }

      .area-view .mobile-domain-title {
        gap: 0;
      }

      .area-view .mobile-domain-title-label {
        font-size: 20px;
      }

      .area-view .mobile-domain-count {
        font-size: 12px;
      }

      .area-view .mobile-domain-more {
        background: transparent;
      }

      .area-view .mobile-entity-rail,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
        gap: 14px;
        margin: 0;
        padding: 0;
        overflow: visible;
        scroll-padding: 0;
        scroll-snap-type: none;
        align-items: stretch;
      }

      .area-view .mobile-entity-card,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-card {
        width: 100%;
        min-width: 0;
        min-height: 152px;
        flex: none;
        padding: 16px;
        border-radius: 12px;
        scroll-snap-align: none;
      }

      .area-view .mobile-entity-card:hover {
        transform: translateY(-1px);
        box-shadow:
          0 16px 32px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px rgba(15, 23, 42, 0.045);
      }

      .area-view .mobile-entity-card.has-inline-select {
        min-height: 178px;
      }

      .area-view .mobile-entity-icon,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
      }

      .area-view .mobile-entity-icon ha-icon {
        --mdc-icon-size: 21px;
      }

      .area-view .mobile-entity-name {
        font-size: 15px;
      }

      .area-view .mobile-entity-status {
        font-size: 11px;
      }

      .area-view .mobile-cover-actions,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        gap: 3px;
      }

      .area-view .mobile-cover-action,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 26px;
        height: 26px;
      }

      .area-view .mobile-cover-action ha-icon,
      .area-view .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-view .mobile-entity-rail .dd-custom-card-wrap,
      .area-view .mobile-entity-rail .dd-domain-add-card,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
        width: 100%;
        min-width: 0;
        flex: none;
        scroll-snap-align: none;
      }
    }

    @media (min-width: 1200px) {
      .area-view .mobile-entity-rail,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      }
    }

    /* Bewerk-toggle in de area-header */
    .area-header { display: flex; align-items: center; gap: 8px; }
    .dd-edit-toggle {
      margin-left: auto;
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 50%;
      border: none; cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color .2s ease, color .2s ease;
    }
    .dd-edit-toggle:hover { background: rgba(var(--rgb-primary-color, 3,169,244), .14); }
    .dd-edit-toggle.active { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .dd-edit-toggle.danger:hover { background: rgba(var(--rgb-error-color, 244,67,54), .16); color: var(--error-color, #f44336); }
    .dd-edit-toggle ha-icon { --mdc-icon-size: 20px; }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider {
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page {
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
    .dd-add-page:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon { --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card { margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host { display: block; }

    /* Area custom card slots */
    .dd-custom-section {
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain {
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing {
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head {
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

    .dd-custom-slot-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .dd-custom-card-wrap {
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing {
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-custom-card-wrap.dragging {
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar {
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar { display: flex; }
    .dd-card-toolbar button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover { color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon { --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag {
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active {
      cursor: grabbing;
    }

    .dd-add-card-inline,
    .dd-add-card {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover {
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline {
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon {
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon { --mdc-icon-size: 22px; }

    .dd-domain-add-card {
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
    .dd-domain-add-card.drag-over {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
    .entities-grid .dd-domain-add-card {
      min-width: 0;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entity-rail .dd-domain-add-card {
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail .dd-domain-add-card {
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      min-height: 138px;
    }

    .entity-card-wrapper.loading {
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 280px;
        flex-basis: auto;
        height: 100%;
        transform: translateX(100%);
        z-index: 121;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar-resize-handle {
        display: none;
      }

      .sidebar-collapse-toggle {
        display: none;
      }

      .floor-areas {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button {
        margin-bottom: 8px;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .global-header {
        padding: 12px;
      }

      .header-time {
        font-size: 20px;
      }



      .entities-grid {
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after {
        right: -8px;
      }
    }

    /* Favorites Section */
    .favorites-section {
      margin-bottom: 24px;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper {
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

    .favorite-card-wrapper:hover {
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active {
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
    .favorite-quick-action:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
    .favorite-card-wrapper.is-idle {
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light {
      --favorite-color: #e1a129;
    }

    .favorite-card-wrapper.favorite-switch {
      --favorite-color: #2f6fd6;
    }

    .favorite-card-wrapper.favorite-cover {
      --favorite-color: #1494aa;
    }

    .favorite-card-wrapper.favorite-binary_sensor,
    .favorite-card-wrapper.favorite-motion {
      --favorite-color: #df5b63;
    }

    .favorite-card-wrapper.favorite-climate,
    .favorite-card-wrapper.favorite-weather {
      --favorite-color: #34a6d8;
    }

    .favorite-card-wrapper.favorite-media_player {
      --favorite-color: #7c67c7;
    }

    .favorite-card-wrapper.favorite-person {
      --favorite-color: #6d7891;
    }

    .favorite-card-wrapper.favorite-sun {
      --favorite-color: #2d7eea;
    }

    .favorite-top,
    .favorite-body {
      position: relative;
      z-index: 1;
    }

    .favorite-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action {
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

    .favorite-quick-action::before {
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

    .favorite-card-wrapper.is-active .favorite-quick-action {
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before {
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action {
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before {
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon {
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon {
      display: none;
    }

    .favorite-quick-action:active {
      transform: scale(0.94);
    }

    .favorite-name {
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

    .favorite-state {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (prefers-color-scheme: dark) {
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
    .toast {
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

    .toast.show {
      opacity: 1;
    }

    /* Confirmation Dialog */
    .confirmation-dialog {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .confirmation-dialog.show {
      opacity: 1;
      pointer-events: auto;
    }

    .confirmation-content {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .confirmation-dialog.show .confirmation-content {
      transform: scale(1);
    }

    .confirmation-title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .confirmation-message {
      margin-bottom: 24px;
      opacity: 0.8;
    }

    .confirmation-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .notifications-overlay {
      position: fixed;
      inset: 0;
      z-index: 1040;
      opacity: 0;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(2px);
      transition: opacity 0.22s ease;
    }

    .notifications-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .notifications-panel {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 1041;
      width: min(520px, calc(100vw - 48px));
      max-height: min(78vh, 620px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(22px);
      transform: translate3d(-50%, -46%, 0) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition:
        transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.2s ease;
    }

    .notifications-panel.open {
      transform: translate3d(-50%, -50%, 0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .notifications-panel::before {
      content: "";
      width: 42px;
      height: 4px;
      margin: 10px auto 2px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.14);
    }

    .notifications-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 12px 14px 10px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .notifications-title {
      min-width: 0;
    }

    .notifications-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 850;
      line-height: 1.15;
    }

    .notifications-title-row ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
    }

    .notifications-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
    }

    .notifications-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .notifications-icon-button,
    .notification-dismiss {
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

    .notifications-icon-button {
      width: 34px;
      height: 34px;
    }

    .notifications-icon-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .notifications-list {
      overflow-y: auto;
      padding: 10px;
    }

    .notification-row {
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

    .notification-row:last-child {
      margin-bottom: 0;
    }

    .notification-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.11);
      color: var(--primary-color);
    }

    .notification-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .notification-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .notification-message {
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .notification-date {
      margin-top: 7px;
      color: color-mix(in srgb, var(--secondary-text-color) 74%, transparent);
      font-size: 11px;
      font-weight: 650;
    }

    .notification-dismiss {
      width: 32px;
      height: 32px;
      color: var(--secondary-text-color);
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-dismiss ha-icon {
      --mdc-icon-size: 17px;
    }

    .notifications-empty,
    .notifications-error,
    .notifications-loading {
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
    .notifications-loading ha-icon {
      --mdc-icon-size: 28px;
      color: var(--primary-color);
    }

    @media (max-width: 1024px) {
      .notifications-panel {
        top: auto;
        bottom: calc(18px + env(safe-area-inset-bottom, 0px));
        width: min(460px, calc(100vw - 28px));
        max-height: min(70vh, 620px);
        transform: translate3d(-50%, calc(100% + 48px), 0);
      }

      .notifications-panel.open {
        transform: translate3d(-50%, 0, 0);
      }
    }

    .confirmation-button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .confirmation-button.cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .confirmation-button.confirm {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .confirmation-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Area Badges Styling */
    .area-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0px; /* 16px;*/
    }

    .area-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: default;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }

    .area-badge ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Domain-specific badge colors */
    .area-badge.light {
      background: color-mix(in srgb, var(--area-badge-color, #e1a129) 10%, var(--card-background-color));
      color: var(--area-badge-color, #e1a129);
      border-color: color-mix(in srgb, var(--area-badge-color, #e1a129) 20%, transparent);
    }

    .area-badge.switch {
      background: color-mix(in srgb, var(--area-badge-color, #2f6fd6) 10%, var(--card-background-color));
      color: var(--area-badge-color, #2f6fd6);
      border-color: color-mix(in srgb, var(--area-badge-color, #2f6fd6) 20%, transparent);
    }

    .area-badge.climate {
      background: color-mix(in srgb, var(--area-badge-color, #34a6d8) 10%, var(--card-background-color));
      color: var(--area-badge-color, #34a6d8);
      border-color: color-mix(in srgb, var(--area-badge-color, #34a6d8) 20%, transparent);
    }

    .area-badge.motion.active {
      background: color-mix(in srgb, var(--area-badge-color, #df5b63) 10%, var(--card-background-color));
      color: var(--area-badge-color, #df5b63);
      border-color: color-mix(in srgb, var(--area-badge-color, #df5b63) 20%, transparent);
    }

    .area-badge.cover {
      background: color-mix(in srgb, var(--area-badge-color, #1494aa) 10%, var(--card-background-color));
      color: var(--area-badge-color, #1494aa);
      border-color: color-mix(in srgb, var(--area-badge-color, #1494aa) 20%, transparent);
    }

    .area-badge.media_player {
      background: color-mix(in srgb, var(--area-badge-color, #7c67c7) 10%, var(--card-background-color));
      color: var(--area-badge-color, #7c67c7);
      border-color: color-mix(in srgb, var(--area-badge-color, #7c67c7) 20%, transparent);
    }

    .area-badge.temperature {
      background: color-mix(in srgb, var(--cyan-color) 10%, var(--card-background-color));
      color: var(--cyan-color);
      border-color: color-mix(in srgb, var(--cyan-color) 20%, transparent);
    }

    .area-badge.humidity {
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
      border-color: color-mix(in srgb, var(--blue-color) 20%, transparent);
    }

    .area-badge.wattage {
      background: color-mix(in srgb, var(--yellow-color) 10%, var(--card-background-color));
      color: var(--yellow-color);
      border-color: color-mix(in srgb, var(--yellow-color) 20%, transparent);
    }

    .area-badge.energy {
      background: color-mix(in srgb, var(--indigo-color) 10%, var(--card-background-color));
      color: var(--indigo-color);
      border-color: color-mix(in srgb, var(--indigo-color) 20%, transparent);
    }

    /* Toggle button badges */
    .area-badge.light-toggle,
    .area-badge.switch-toggle {
      cursor: pointer;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }

    .area-badge.light-toggle:hover,
    .area-badge.switch-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 90%, black);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .area-badges {
        padding: 12px;
        gap: 6px;
      }

      .area-badge {
        padding: 6px 10px;
        font-size: 13px;
      }

      .area-badge ha-icon {
        --mdc-icon-size: 16px;
      }
    }

    /* Header Expanded Content Styling */
    .global-header.expanded {
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content {
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites {
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section {
      width: 100%;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper {
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile {
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites {
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

    .no-favorites ha-icon {
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p {
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button {
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

    .header-expand-button:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon {
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button {
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content {
        padding: 12px;
      }

      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button {
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon {
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
    .status-card-compact {
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
    .status-card-compact.cover {
      --status-color: #1494aa;
    }

    .home-status-card.binary_sensor,
    .home-status-card.motion,
    .status-card-compact.binary_sensor,
    .status-card-compact.motion {
      --status-color: #df5b63;
    }

    .home-status-card.light,
    .status-card-compact.light {
      --status-color: #e1a129;
    }

    .home-status-card.switch,
    .status-card-compact.switch {
      --status-color: #2f6fd6;
    }

    .home-status-card.climate,
    .home-status-card.house-climate-card,
    .status-card-compact.climate {
      --status-color: #34a6d8;
    }

    .home-status-card.person,
    .status-card-compact.person {
      --status-color: #6d7891;
    }

    .home-status-card.media_player,
    .status-card-compact.media_player {
      --status-color: #7c67c7;
    }

    .home-status-card.fan,
    .status-card-compact.fan {
      --status-color: #2b8fcb;
    }

    .home-status-card.wattage,
    .home-status-card.house-power-card,
    .home-status-card.energy,
    .status-card-compact.wattage,
    .status-card-compact.energy {
      --status-color: #d88e20;
    }

    .home-status-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card {
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

    .home-status-card::before {
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before {
      opacity: 0.85;
    }

    .home-status-card .status-card-icon {
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: none;
    }

    .home-status-card .status-card-badge {
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

    .home-status-card .status-card-title {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card {
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card {
      --status-color: #d88e20;
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card {
      --status-color: #34a6d8;
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
    .home-status-card.house-climate-card .house-climate-icon,
    .home-status-card.house-power-card .house-power-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
    .house-climate-copy,
    .house-power-copy {
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
    .house-climate-title,
    .house-power-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
    .house-persons-empty,
    .house-climate-subtitle,
    .house-power-subtitle,
    .house-power-empty {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric {
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

    .house-climate-metric:active {
      transform: scale(0.97);
    }

    .house-climate-metric-icon {
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
    .house-climate-metric-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value {
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label {
      font-size: 10px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list {
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon {
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

    .house-power-room-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
    .house-power-room-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar {
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, #d88e20, #f4c34d);
    }

    .house-persons-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini {
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

    .house-person-mini:active {
      transform: scale(0.97);
    }

    .house-person-mini.is-home {
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away {
      background: color-mix(in srgb, #df5b63 10%, var(--card-background-color));
    }

    .house-person-avatar {
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

    .house-person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
    .house-person-mini-state {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1.1;
    }

    .header-status-scroll {
      gap: 10px;
      padding: 2px 2px 4px;
    }

    .status-card-compact {
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

    .status-card-compact:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact {
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

    .status-card-compact .status-card-title-compact {
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

    .status-card-compact.has-value .status-card-title-compact {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact {
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
      .home-status-grid {
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

      .home-camera-section {
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading {
        display: none;
      }

      .home-summaries-section {
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading {
        display: none;
      }

      .home-summary-list {
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card {
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon {
        width: 36px;
        height: 36px;
      }

      .home-camera-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar {
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card {
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content {
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name {
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar {
        display: none;
      }

      .home-status-card {
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card {
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title {
        font-size: 15px;
      }

      .status-card-compact {
        min-width: 88px;
      }

      .home-view {
        max-width: none;
      }

      .person-cards-section {
        display: none;
      }

      .home-status-heading {
        display: none;
      }

      .mobile-home-section {
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label {
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action {
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

      .mobile-section-action ha-icon {
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active {
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail {
        display: flex;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar {
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card {
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

      .mobile-home-section.layout-grid .mobile-area-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail {
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active {
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture {
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

      .mobile-area-card.has-picture.text-dark {
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
      .mobile-area-copy {
        position: relative;
        z-index: 2;
      }

      .mobile-area-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }

      .mobile-area-icon {
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

      .mobile-area-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge {
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

      .mobile-area-card.has-picture .mobile-area-badge {
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light {
        --area-badge-color: #e1a129;
      }

      .mobile-area-badge.cover {
        --area-badge-color: #1494aa;
      }

      .mobile-area-badge.motion {
        --area-badge-color: #df5b63;
      }

      .mobile-area-name {
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta {
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
      .mobile-area-card.has-picture .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
      .mobile-area-card.has-picture.text-dark .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section {
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
      .home-status-section.layout-grid .house-climate-card,
      .home-status-section.layout-grid .house-power-card {
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid {
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before {
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge {
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      @media (prefers-color-scheme: dark) {
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

        .welcome-action {
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
          --status-color: #f2b447;
        }

        .home-status-card.house-climate-card {
          --status-color: #64c8e8;
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
          background: color-mix(in srgb, #df5b63 16%, var(--card-background-color));
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

      .home-favorites-section {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow-x: clip;
      }

      .home-favorites-section .favorites-header {
        display: none;
      }

      .home-favorites-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 0;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar {
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper {
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    /* Area status/action pills */
    .area-badges {
      gap: 8px;
      align-items: center;
      margin-bottom: 18px;
    }

    .area-badge {
      min-height: 38px;
      padding: 9px 15px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      box-shadow: none;
    }

    .area-badge ha-icon {
      --mdc-icon-size: 17px;
    }

    .area-badge.cover {
      background: color-mix(in srgb, var(--area-badge-color, #1494aa) 12%, var(--card-background-color));
      border-color: color-mix(in srgb, var(--area-badge-color, #1494aa) 22%, transparent);
      color: var(--area-badge-color, #1494aa);
    }

    .area-badge.cover ha-icon {
      color: var(--area-badge-color, #1494aa);
    }

    .area-badge.light-toggle,
    .area-badge.switch-toggle {
      min-width: 132px;
      justify-content: center;
      cursor: pointer;
      background: #089987;
      border-color: #089987;
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(8, 153, 135, 0.18);
    }

    .area-badge.light-toggle ha-icon {
      color: #ffc400;
    }

    .area-badge.switch-toggle ha-icon {
      color: #1f86d9;
    }

    .area-badge.light-toggle:hover,
    .area-badge.switch-toggle:hover {
      background: #078b7b;
      border-color: #078b7b;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(8, 153, 135, 0.24);
    }

    .area-badge.light-toggle:active,
    .area-badge.switch-toggle:active {
      transform: translateY(0);
      box-shadow: 0 5px 14px rgba(8, 153, 135, 0.18);
    }

    /* Room header */
    .area-header {
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

    .area-header::before {
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

    .area-header-background {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      filter: saturate(1.05) contrast(1.02);
    }

    .area-header.has-picture {
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

    .area-header.has-picture.text-dark {
      --area-header-picture-text-color: #0f172a;
      --area-header-picture-muted-text-color: rgba(15, 23, 42, 0.72);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.72);
      --area-header-picture-control-border: rgba(15, 23, 42, 0.08);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.48)),
        linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    }

    .area-header.has-picture::before {
      z-index: 1;
      background: var(--area-header-picture-overlay);
      background-size: auto, 56px 56px, 56px 56px;
      opacity: 1;
    }

    .area-header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .area-title-group {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .area-mobile-toolbar {
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: auto minmax(0, max-content) auto;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .area-mobile-round {
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

    .area-mobile-round:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 28px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(15, 23, 42, 0.08);
    }

    .area-mobile-round ha-icon,
    .area-mobile-round .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .area-mobile-home {
      display: none;
      background: #182044;
      color: #ffffff;
    }

    .layout-container.sidebar-collapsed .area-mobile-home {
      display: inline-flex;
    }

    .area-mobile-quick-controls {
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

    .area-mobile-quick-controls.empty {
      visibility: hidden;
    }

    .area-quick-control {
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

    .area-quick-control:active {
      transform: scale(0.96);
    }

    .area-quick-main {
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .area-quick-control ha-icon {
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .area-quick-count {
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      white-space: nowrap;
    }

    .area-quick-switch {
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

    .area-quick-switch::after {
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

    .area-quick-control.active {
      background: #182044;
      color: #ffffff;
    }

    .area-quick-control.light.active {
      color: #ffd047;
    }

    .area-quick-control.switch.active {
      color: #58a9ff;
    }

    .area-quick-control.cover.active {
      color: #b984ff;
    }

    .area-quick-control.active .area-quick-switch {
      background: currentColor;
    }

    .area-quick-control.active .area-quick-switch::after {
      transform: translateX(10px);
    }

    .area-quick-direction {
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

    .area-quick-direction ha-icon {
      --mdc-icon-size: 16px;
    }

    .area-mobile-actions {
      grid-column: 3;
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .area-mobile-edit {
      position: relative;
    }

    .area-mobile-edit.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-mobile-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      display: block;
      border-radius: 50%;
      background: #3b73ff;
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 88%, #ffffff);
    }

    .area-mobile-actions .unavailable-entities-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      border-radius: 999px;
    }

    .area-desktop-back {
      display: none;
      width: 42px;
      height: 42px;
      padding: 0;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: #182044;
      color: #ffffff;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.2),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-desktop-back:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.24),
        inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    }

    .area-desktop-back:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .area-desktop-back ha-icon,
    .area-desktop-back .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .layout-container.sidebar-collapsed .area-desktop-back {
      display: none;
    }

    .area-title-copy {
      min-width: 0;
    }

    .area-subtitle {
      display: block;
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 55%, transparent);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
    }

    .area-header-icon {
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

    .area-header-icon ha-icon {
      --mdc-icon-size: 26px;
    }

    .area-header.has-picture .area-header-icon {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow: inset 0 0 0 1px var(--area-header-picture-control-border);
    }

    .area-title {
      margin: 0;
      color: var(--primary-text-color);
      font-size: clamp(30px, 3.1vw, 44px);
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
      overflow-wrap: anywhere;
    }

    .area-header.has-picture .area-subtitle {
      color: var(--area-header-picture-muted-text-color, rgba(255, 255, 255, 0.76));
    }

    .area-header.has-picture .area-title {
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header-actions {
      display: none;
      align-items: center;
      gap: 10px;
      flex: 0 0 auto;
    }

    .area-header .dd-edit-toggle {
      margin-left: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color);
    }

    .area-header .dd-edit-toggle:hover,
    .area-header .dd-edit-toggle.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-header.has-picture .dd-edit-toggle {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header .unavailable-entities-icon {
      margin-bottom: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(255, 152, 0, 0.14);
      color: var(--warning-color);
    }

    .area-header .unavailable-entities-icon ha-icon {
      color: var(--warning-color);
    }

    .area-header.has-picture .unavailable-entities-icon {
      background: var(--area-header-picture-control-bg);
    }

    .area-header.has-picture .unavailable-entities-icon ha-icon {
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header.has-picture .area-mobile-round,
    .area-header.has-picture .area-mobile-quick-controls,
    .area-header.has-picture .area-mobile-actions .unavailable-entities-icon {
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.18),
        inset 0 0 0 1px var(--area-header-picture-control-border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .area-header .area-badges {
      display: none;
    }

    .area-header.has-picture .area-badge:not(.light-toggle):not(.switch-toggle) {
      background: var(--area-header-picture-control-bg);
      border-color: var(--area-header-picture-control-border);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    @media (min-width: 769px) {
      .area-header {
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

      .area-header::before {
        opacity: 0;
      }

      .area-header-content {
        grid-area: title;
        align-self: start;
        margin-top: 2px;
      }

      .area-mobile-toolbar {
        display: contents;
      }

      .area-mobile-home {
        grid-area: nav;
        display: inline-flex;
        align-self: start;
        justify-self: start;
        width: 44px;
        height: 44px;
        background: #182044;
        color: #ffffff;
        box-shadow:
          0 12px 26px rgba(15, 23, 42, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      }

      .area-mobile-quick-controls {
        grid-area: controls;
        min-height: 42px;
        width: min(520px, 100%);
        max-width: 100%;
        margin-top: 4px;
        margin-left: 0;
        align-self: start;
        justify-self: start;
      }

      .area-mobile-quick-controls.count-1 {
        width: min(420px, 100%);
      }

      .area-mobile-quick-controls.count-1 .area-quick-control {
        flex: 1 1 auto;
        justify-content: space-between;
      }

      .area-mobile-quick-controls.empty {
        min-height: 0;
        margin: 0;
      }

      .area-mobile-actions {
        grid-area: actions;
        position: relative;
        top: auto;
        right: auto;
        z-index: 5;
        align-self: start;
        justify-self: end;
      }

      .area-header-metrics {
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

      .area-header-metric {
        min-width: 132px;
        min-height: 44px;
        padding: 8px 12px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-metric .metric-ring {
        width: 30px;
        height: 30px;
      }

      .area-header-metric .metric-ring::after {
        inset: 4px;
      }

      .area-header-metric .metric-ring.metric-icon ha-icon {
        --mdc-icon-size: 17px;
      }

      .area-header-metric .metric-label {
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .area-header-metric .metric-reading {
        margin-top: 2px;
        font-size: 13px;
      }

      .area-title-group {
        gap: 0;
      }

      .area-header-icon {
        display: none;
      }

      .area-title {
        font-size: clamp(24px, 2.4vw, 34px);
        line-height: 1.04;
      }

      .area-subtitle {
        margin-top: 3px;
      }

      .layout-container.sidebar-collapsed .area-mobile-home {
        position: relative;
        top: auto;
        left: auto;
      }

      .layout-container.sidebar-collapsed .area-header-content {
        padding-left: 0;
      }

      .layout-container.sidebar-collapsed .area-mobile-quick-controls {
        margin-left: 0;
      }
    }

    @media (max-width: 768px) {
      .content-area {
        padding: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area {
        padding-bottom: 0;
      }

      .content-area.area-content-area {
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area {
        padding: 0;
      }

      .home-view {
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view {
        width: 100%;
        margin: 0;
        padding: 10px 10px calc(164px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-header {
        grid-template-columns: auto minmax(0, 1fr);
        gap: 12px;
        margin: 0 0 10px;
        padding: 14px 14px;
        border-radius: 0 0 18px 18px;
        border-top: 0;
      }

      .settings-page-title h1 {
        font-size: 22px;
      }

      .settings-page-actions {
        display: none;
      }

      .settings-page-editor {
        border-radius: 18px;
      }

      .settings-page-bottom-actions {
        position: sticky;
        bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        z-index: 5;
        display: flex;
        justify-content: flex-end;
        margin: 12px 0 0;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
      }

      .global-header.mobile {
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

      .global-header.mobile .header-content {
        display: block;
      }

      .global-header.mobile .header-status-section {
        width: 100%;
      }

      .global-header.mobile .header-status-scroll {
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact {
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact {
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact {
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button {
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-header {
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

      .area-header.has-metrics {
        min-height: 248px;
      }

      .area-header.is-stuck {
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

      .area-header::before {
        opacity: 0;
      }

      .area-header::after {
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

      .area-header.is-stuck::after {
        opacity: 1;
      }

      .area-mobile-toolbar {
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }

      .area-mobile-round {
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
      .area-mobile-round .dd-static-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-mobile-round {
        width: 34px;
        height: 34px;
      }

      .area-header.is-stuck .area-mobile-round ha-icon {
        --mdc-icon-size: 18px;
      }

      .area-mobile-home {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        justify-self: start;
        background: #182044;
        color: #ffffff;
        box-shadow:
          0 12px 26px rgba(15, 23, 42, 0.22),
          inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      }

      .area-header.has-picture .area-mobile-home {
        background: rgba(24, 32, 68, 0.94);
        color: #ffffff;
        backdrop-filter: blur(14px);
        box-shadow:
          0 12px 28px rgba(0, 0, 0, 0.24),
          inset 0 0 0 1px rgba(255, 255, 255, 0.14);
      }

      .area-mobile-quick-controls {
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

      .area-mobile-quick-controls.empty {
        visibility: hidden;
      }

      .area-header.is-stuck .area-mobile-quick-controls {
        min-height: 36px;
        padding: 3px;
      }

      .area-quick-control {
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

      .area-quick-main {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .area-quick-control ha-icon {
        --mdc-icon-size: 17px;
        flex: 0 0 auto;
      }

      .area-quick-count {
        color: currentColor;
        font-size: 11px;
        font-weight: 850;
        line-height: 1;
        white-space: nowrap;
      }

      .area-quick-switch {
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

      .area-quick-switch::after {
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

      .area-quick-control.active .area-quick-switch {
        background: currentColor;
      }

      .area-quick-control.active .area-quick-switch::after {
        transform: translateX(10px);
      }

      .area-quick-direction {
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

      .area-quick-direction ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-header.is-stuck .area-quick-control {
        min-width: 50px;
        height: 30px;
        padding: 0 5px 0 7px;
        gap: 4px;
      }

      .area-header.is-stuck .area-quick-control ha-icon {
        --mdc-icon-size: 15px;
      }

      .area-header.is-stuck .area-quick-count {
        font-size: 10px;
      }

      .area-header.is-stuck .area-quick-switch {
        width: 22px;
        height: 14px;
      }

      .area-header.is-stuck .area-quick-switch::after {
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
      }

      .area-header.is-stuck .area-quick-control.active .area-quick-switch::after {
        transform: translateX(8px);
      }

      .area-header.is-stuck .area-quick-direction {
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-quick-direction ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-quick-control:active {
        transform: scale(0.94);
      }

      .area-quick-control.active {
        background: #182044;
        color: #ffffff;
      }

      .area-quick-control.light.active {
        color: #ffd047;
      }

      .area-quick-control.switch.active {
        color: #58a9ff;
      }

      .area-quick-control.cover.active {
        color: #b984ff;
      }

      .area-mobile-edit {
        position: relative;
        background: #182044;
        color: #ffffff;
      }

      .area-mobile-actions {
        grid-column: 3;
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .area-mobile-actions .unavailable-entities-icon {
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

      .area-mobile-actions .unavailable-entities-icon ha-icon {
        color: #ffffff;
        --mdc-icon-size: 19px;
      }

      .area-mobile-actions .unavailable-count {
        top: -6px;
        right: -6px;
        background: #ff9800;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 92%, transparent);
      }

      .area-mobile-edit.active {
        background: var(--primary-color);
      }

      .area-mobile-dot {
        position: absolute;
        top: 3px;
        right: 3px;
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #3867ff;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 90%, transparent);
      }

      .area-header-content {
        position: relative;
        z-index: 3;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .area-header.is-stuck .area-header-content {
        gap: 6px;
      }

      .area-header-icon {
        display: none;
      }

      .area-title-group {
        width: 100%;
        justify-content: center;
        gap: 0;
        min-width: 0;
        text-align: center;
      }

      .area-title {
        max-width: min(260px, calc(100vw - 122px));
        margin: 0 auto;
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-header.is-stuck .area-title {
        font-size: 14px;
      }

      .area-subtitle {
        display: block;
        margin-top: 2px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 750;
        line-height: 1.1;
      }

      .area-header.is-stuck .area-subtitle {
        margin-top: 1px;
        font-size: 11px;
      }

      .area-header-metrics {
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

      .area-header-metric {
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

      .area-header-metric .metric-ring {
        width: 46px;
        height: 46px;
        transition:
          width 0.2s ease,
          height 0.2s ease;
      }

      .area-header-metric .metric-ring::after {
        transition: inset 0.2s ease;
      }

      .area-header-metric .metric-value,
      .area-header-metric .metric-label,
      .area-header-metric .metric-range,
      .area-header-metric .metric-reading {
        transition:
          font-size 0.2s ease,
          opacity 0.2s ease;
      }

      .area-header.is-stuck .area-header-metrics {
        gap: 8px;
        margin-top: 0;
      }

      .area-header.is-stuck .area-header-metric {
        min-height: 40px;
        padding: 6px 9px;
        gap: 8px;
        border-radius: 8px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.05),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-header.is-stuck .area-header-metric .metric-ring {
        width: 30px;
        height: 30px;
      }

      .area-header.is-stuck .area-header-metric .metric-ring::after {
        inset: 4px;
      }

      .area-header.is-stuck .area-header-metric .metric-value {
        font-size: 9px;
      }

      .area-header.is-stuck .area-header-metric .metric-label {
        font-size: 11px;
      }

      .area-header.is-stuck .area-header-metric .metric-reading {
        font-size: 10px;
      }

      .area-header.is-stuck .area-header-metric .metric-range {
        opacity: 0;
        height: 0;
        margin-top: 0;
        overflow: hidden;
      }

      .area-header-actions {
        display: none;
      }

      .area-header .area-badges {
        position: relative;
        z-index: 3;
        width: 100%;
        display: none;
      }

      .area-header .area-badge {
        min-height: 34px;
        flex: 0 0 auto;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 850;
        box-shadow: none;
      }

      .area-header .area-badge.light-toggle,
      .area-header .area-badge.switch-toggle {
        min-width: 128px;
        justify-content: center;
      }

      .area-header.has-picture {
        background:
          linear-gradient(180deg,
            rgba(23, 35, 33, 0.74) 0%,
            rgba(23, 35, 33, 0.58) 72%,
            rgba(23, 35, 33, 0.22) 100%);
      }

      .area-header.has-picture .area-subtitle {
        color: rgba(255, 255, 255, 0.72);
      }

      .area-content-area .area-header {
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

      .area-content-area .area-header.has-metrics {
        min-height: 312px;
      }

      .area-content-area .area-header.has-picture {
        background: #0f172a;
      }

      .area-content-area .area-header-background {
        inset: 0;
        background-position: center;
        background-size: cover;
        transform: scale(1.015);
        filter: saturate(1.08) contrast(1.02);
      }

      .area-content-area .area-header::before {
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(4, 9, 16, 0.2) 0%,
            rgba(4, 9, 16, 0.02) 36%,
            rgba(4, 9, 16, 0.24) 70%,
            rgba(4, 9, 16, 0.64) 100%);
      }

      .area-content-area .area-header::after {
        bottom: -22px;
        height: 46px;
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            color-mix(in srgb, var(--primary-background-color) 86%, transparent) 100%);
        filter: blur(14px);
      }

      .area-content-area .area-mobile-toolbar {
        position: static;
        display: block;
        width: 100%;
        height: 0;
      }

      .area-content-area .area-mobile-home {
        top: calc(18px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
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
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
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
      .area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon {
        --mdc-icon-size: 22px;
        width: 22px;
        height: 22px;
        color: currentColor;
      }

      .area-content-area .area-mobile-camera {
        display: inline-flex;
      }

      .area-content-area .area-mobile-edit {
        background: rgba(255, 255, 255, 0.92);
        color: #14181f;
      }

      .area-content-area .area-mobile-edit.active {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .area-content-area .area-mobile-dot {
        top: 4px;
        right: 4px;
        background: #3867ff;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
      }

      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        background: rgba(244, 67, 54, 0.94);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.34);
      }

      .area-content-area .area-mobile-actions .unavailable-count {
        top: -5px;
        right: -5px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
      }

      .area-content-area .area-header-content {
        position: absolute;
        top: calc(25px + env(safe-area-inset-top, 0px));
        left: 84px;
        right: 84px;
        width: auto;
        z-index: 4;
        justify-content: center;
        pointer-events: none;
      }

      .area-content-area .area-title-group {
        width: 100%;
      }

      .area-content-area .area-title {
        max-width: 100%;
        color: #ffffff;
        font-size: 17px;
        font-weight: 850;
        line-height: 1.05;
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle {
        color: rgba(255, 255, 255, 0.82);
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-mobile-quick-controls {
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

      .area-content-area .area-mobile-quick-controls::-webkit-scrollbar {
        display: none;
      }

      .area-content-area .area-mobile-quick-controls.empty {
        display: none;
      }

      .area-content-area .area-header-metrics {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 72px;
        z-index: 4;
        width: auto;
        margin: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
        bottom: 18px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: 18px;
      }

      .area-content-area .area-header-metric {
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

      .area-content-area .area-header-metric .metric-ring {
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header-metric .metric-value,
      .area-content-area .area-header-metric .metric-label,
      .area-content-area .area-header-metric .metric-range,
      .area-content-area .area-header-metric .metric-reading {
        color: #182044;
      }

      .area-content-area .area-header.is-stuck {
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

      .area-content-area .area-header.is-stuck .area-header-background {
        opacity: 0;
      }

      .area-content-area .area-header.is-stuck::before {
        background: transparent;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
      .area-content-area .area-header.is-stuck .area-mobile-actions {
        top: calc(8px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
      .area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon {
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-actions {
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 100px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-subtitle {
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-mobile-quick-controls,
      .area-content-area .area-header.is-stuck .area-header-metrics {
        display: none;
      }

      .area-content-area .area-header {
        min-height: 214px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f8 100%);
        color: var(--primary-text-color);
      }

      .area-content-area .area-header.has-metrics {
        min-height: 214px;
      }

      .area-content-area .area-header.has-picture {
        color: #ffffff;
      }

      .area-content-area .area-header:not(.has-picture)::before {
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.18) 46%,
            rgba(226, 235, 242, 0.78) 100%);
      }

      .area-content-area .area-mobile-home {
        top: calc(16px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
        top: calc(16px + env(safe-area-inset-top, 0px));
        right: 18px;
      }

      .area-content-area .area-mobile-round,
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow:
          0 12px 26px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.68);
      }

      .area-content-area .area-mobile-home {
        background: #182044;
        color: #ffffff;
      }

      .area-content-area .area-header-content {
        top: calc(88px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-header.has-metrics .area-header-content {
        right: 112px;
      }

      .area-content-area .area-title-group {
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-title {
        margin: 0;
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 29px;
        font-weight: 900;
        line-height: 0.98;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-title {
        color: #ffffff;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle {
        margin-top: 6px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-subtitle {
        color: rgba(255, 255, 255, 0.78);
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-header-metrics {
        top: calc(90px + env(safe-area-inset-top, 0px));
        right: 18px;
        bottom: auto;
        left: auto;
        width: auto;
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: auto;
      }

      .area-content-area .area-header-metric {
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

      .area-content-area .area-header.has-picture .area-header-metric {
        background: rgba(255, 255, 255, 0.66);
        box-shadow:
          0 10px 22px rgba(8, 13, 24, 0.16),
          inset 0 0 0 1px rgba(255, 255, 255, 0.22);
      }

      .area-content-area .area-header-metric .metric-ring {
        width: 22px;
        height: 22px;
        background: color-mix(in srgb, var(--metric-color) 14%, transparent);
        box-shadow: none;
      }

      .area-content-area .area-header-metric .metric-ring::after {
        display: none;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon {
        --mdc-icon-size: 15px;
        color: var(--metric-color);
      }

      .area-content-area .area-header-metric .metric-value {
        font-size: 10px;
      }

      .area-content-area .area-header-metric .metric-label {
        display: none;
      }

      .area-content-area .area-header-metric .metric-reading {
        margin-top: 0;
        color: #101827;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
      }

      .area-content-area .area-header-metric .metric-range {
        display: none;
      }

      .area-content-area .area-mobile-quick-controls {
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

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
        top: calc(154px + env(safe-area-inset-top, 0px));
        bottom: auto;
      }

      .area-content-area .area-header.has-metrics.has-quick-controls {
        min-height: 214px;
      }

      .area-content-area .area-header.is-stuck {
        min-height: 84px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(13px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 106px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        font-size: 16px;
      }

      .area-content-area .area-header {
        box-sizing: border-box;
        min-height: calc(146px + env(safe-area-inset-top, 0px));
        margin: 0 -10px 12px;
        padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.72), transparent 28%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 99%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, #dff4fb 8%) 100%);
        box-shadow:
          0 10px 28px rgba(15, 23, 42, 0.08),
          inset 0 -1px 0 color-mix(in srgb, var(--divider-color) 55%, transparent);
      }

      .area-content-area .area-header.has-metrics,
      .area-content-area .area-header.has-quick-controls,
      .area-content-area .area-header.has-metrics.has-quick-controls {
        min-height: calc(154px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture {
        min-height: calc(178px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture.has-metrics,
      .area-content-area .area-header.has-picture.has-quick-controls {
        min-height: calc(186px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.has-picture)::before {
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.54) 0%,
            rgba(255, 255, 255, 0.14) 58%,
            rgba(226, 235, 242, 0.38) 100%);
      }

      .area-content-area .area-header::after {
        bottom: -16px;
        height: 30px;
        opacity: 0.55;
        filter: blur(10px);
      }

      .area-content-area .area-mobile-home {
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions {
        top: calc(14px + env(safe-area-inset-top, 0px));
        right: 18px;
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-mobile-round,
      .area-content-area .area-mobile-actions .unavailable-entities-icon {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.12),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 62%, transparent);
      }

      .area-content-area .area-mobile-home {
        background: #182044;
        color: #ffffff;
      }

      .area-content-area .area-mobile-round ha-icon,
      .area-content-area .area-mobile-round .dd-static-icon,
      .area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-header-content {
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.has-metrics .area-header-content {
        right: 136px;
      }

      .area-content-area .area-title {
        max-width: 100%;
        font-size: 25px;
        font-weight: 900;
        line-height: 1.02;
        letter-spacing: 0;
      }

      .area-content-area .area-subtitle {
        margin-top: 3px;
        padding-bottom: 5px;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header-metrics {
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics {
        bottom: auto;
      }

      .area-content-area .area-header-metric {
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

      .area-content-area .area-header.has-picture .area-header-metric {
        background: rgba(255, 255, 255, 0.76);
      }

      .area-content-area .area-header-metric .metric-ring {
        width: 21px;
        height: 21px;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header-metric .metric-copy {
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .area-content-area .area-header-metric .metric-reading {
        max-width: 62px;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 12px;
        font-weight: 950;
        text-overflow: ellipsis;
      }

      .area-content-area .area-mobile-quick-controls,
      .area-content-area .area-header.has-metrics .area-mobile-quick-controls {
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

      .area-content-area .area-header:not(.has-metrics) .area-mobile-quick-controls {
        top: auto;
        bottom: 8px;
        right: 20px;
        width: auto;
        max-width: none;
      }

      .area-content-area .area-mobile-quick-controls.count-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-quick-control {
        min-width: 48px;
        width: 100%;
        height: 30px;
        padding: 0 6px 0 8px;
        justify-content: space-between;
      }

      .area-content-area .area-quick-control ha-icon {
        --mdc-icon-size: 16px;
      }

      .area-content-area .area-quick-count {
        font-size: 10px;
      }

      .area-content-area .area-quick-switch {
        width: 24px;
        height: 15px;
      }

      .area-content-area .area-quick-switch::after {
        top: 3px;
        left: 3px;
        width: 9px;
        height: 9px;
      }

      .area-content-area .area-quick-control.active .area-quick-switch::after {
        transform: translateX(9px);
      }

      .area-content-area .area-quick-direction {
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-quick-direction ha-icon {
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home {
        background: rgba(10, 16, 38, 0.86);
        color: #ffffff;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home ha-icon,
      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home .dd-static-icon {
        color: #ffffff;
        opacity: 1;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-actions .area-mobile-round {
        background: rgba(255, 255, 255, 0.86);
        color: #0f172a;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.22),
          inset 0 0 0 1px rgba(255, 255, 255, 0.34);
        backdrop-filter: blur(18px) saturate(1.22);
        -webkit-backdrop-filter: blur(18px) saturate(1.22);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-quick-controls,
      .area-content-area .area-header.has-picture:not(.is-stuck).has-metrics .area-mobile-quick-controls {
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 32px rgba(0, 0, 0, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        backdrop-filter: blur(18px) saturate(1.18);
        -webkit-backdrop-filter: blur(18px) saturate(1.18);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control {
        color: rgba(15, 23, 42, 0.66);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active {
        background: color-mix(in srgb, var(--domain-color, #182044) 16%, rgba(15, 23, 42, 0.06));
        color: var(--domain-color, #182044);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.light {
        --domain-color: #d99a12;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.switch {
        --domain-color: #2f73d6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.cover {
        --domain-color: #7c4fc7;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-switch {
        background: rgba(15, 23, 42, 0.16);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active .area-quick-switch {
        background: var(--domain-color, #182044);
      }

      .area-content-area .area-header {
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
      .area-content-area .area-header.is-stuck.has-picture.has-quick-controls {
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: calc(62px + env(safe-area-inset-top, 0px));
        margin-bottom: 4px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 14px 7px;
        border-radius: 0;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
      .area-content-area .area-header.is-stuck .area-mobile-actions {
        top: calc(9px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
      .area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon {
        width: 36px;
        height: 36px;
      }

      .area-content-area .area-header.is-stuck .area-header-content {
        top: calc(10px + env(safe-area-inset-top, 0px));
        left: 66px;
        right: 66px;
      }

      .area-content-area .area-header.is-stuck .area-title {
        font-size: 15px;
        line-height: 1.05;
      }

      .area-content-area .area-header.is-stuck .area-subtitle {
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
      .area-content-area .area-header.is-stuck .area-badges {
        display: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed {
        overflow: visible;
      }

      .area-content-area .area-header.is-stuck.is-revealed::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: calc(154px + env(safe-area-inset-top, 0px));
        display: block;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.72), transparent 28%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 99%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, #dff4fb 8%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.12),
          inset 0 -1px 0 color-mix(in srgb, var(--divider-color) 55%, transparent);
        pointer-events: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content {
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content {
        right: 136px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-title {
        font-size: 25px;
        line-height: 1.02;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-subtitle {
        display: block;
        margin-top: 3px;
        padding-bottom: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-title,
      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-subtitle {
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics {
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
      .area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls {
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

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls.count-1 {
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.empty {
        display: none;
      }

      .area-view .entities-section,
      .area-view .dd-custom-section {
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section {
        display: none;
      }

      .mobile-area-overview {
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section {
        display: grid;
        position: relative;
        z-index: 2;
      }

      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .sidebar .area-list {
        padding: 0;
      }

      .sidebar .floor-section {
        margin-bottom: 12px;
      }

      .sidebar .floor-header {
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3 {
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button {
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

      .sidebar .area-button.home-button {
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
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

      .sidebar .area-content {
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section {
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section {
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon {
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

      .sidebar .area-main-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture {
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected {
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon {
        z-index: 1;
      }

      .sidebar .area-info-badges {
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

      .sidebar .area-name {
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge {
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon {
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count {
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
      .sidebar .area-button.selected .area-icon {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header {
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3 {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
      .sidebar .area-button.home-button {
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

      .sidebar .area-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.34);
        background: rgba(255, 255, 255, 0.98);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.home-button .area-icon,
      .sidebar .area-icon,
      .sidebar .area-main-icon {
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

      .sidebar .area-button.home-button .area-icon {
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content {
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
      .sidebar .area-top-section {
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section {
        display: contents;
      }

      .sidebar .area-name {
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges {
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

      .sidebar .area-menu-chevron {
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut {
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron {
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture {
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
      .sidebar .area-button.has-picture .area-name,
      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after {
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name {
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
      .sidebar .area-button.has-picture .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron {
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
      .sidebar .area-button.has-picture.text-dark .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay {
        z-index: 120 !important;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
      }

      @media (prefers-color-scheme: dark) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

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

      .home-view,
      .home-content-area {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section .favorites-grid {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper {
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._loadMobileEntityLayoutPreference();
    this._loadAreaSidebarWidthPreference();
    this._loadAreaSidebarCollapsedPreference();
    this._checkMobile();
    this._setupEventListeners();
    window.addEventListener('dwains-dashboard-next-toggle-area-nav', this._handleAreaNavToggle);
    window.addEventListener('dwains-dashboard-next-open-settings', this._handleOpenSettingsEvent);
    window.addEventListener('dwains-dashboard-next-open-home', this._handleOpenHomeEvent);
    this._startTimeUpdate();
    this._initializeObservers();
    makeDialogManager(this);
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
        // Mark component for re-render to show live updates
        this._hasRelevantStateChanges = true;
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('dwains-dashboard-next-toggle-area-nav', this._handleAreaNavToggle);
    window.removeEventListener('dwains-dashboard-next-open-settings', this._handleOpenSettingsEvent);
    window.removeEventListener('dwains-dashboard-next-open-home', this._handleOpenHomeEvent);
    window.removeEventListener('pointermove', this._handleSidebarResizeMove);
    window.removeEventListener('pointerup', this._handleSidebarResizeEnd);
    window.removeEventListener('pointercancel', this._handleSidebarResizeEnd);
    this._persistentNotificationsUnsub?.();
    this._persistentNotificationsUnsub = undefined;
    this._removeMobileDomainMenuPortal();
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
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
    if (this._progressiveRenderCancel) {
      this._progressiveRenderCancel();
      this._progressiveRenderCancel = undefined;
    }
  }

  private _setupEventListeners() {
    window.addEventListener('resize', this._handleResize);
    this.addEventListener('show-more-info', this._handleShowMoreInfo);
  }

  private _cleanupEventListeners() {
    window.removeEventListener('resize', this._handleResize);
    this.removeEventListener('show-more-info', this._handleShowMoreInfo);
  }

  private _handleResize = () => {
    this._closeMobileDomainMenu();
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

  private _handleContentScroll = (event: Event) => {
    if (!this._isMobile || this._selectedView !== 'area') {
      if (this._areaHeaderStuck) this._areaHeaderStuck = false;
      if (this._areaHeaderRevealed) this._areaHeaderRevealed = false;
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    const scrollTop = target?.scrollTop || 0;
    this._pendingAreaScrollTop = scrollTop;

    if (this._areaHeaderScrollRaf) return;

    this._areaHeaderScrollRaf = requestAnimationFrame(() => {
      this._areaHeaderScrollRaf = undefined;
      this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop, true);
    });
  };

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
    this._resetAreaHeaderScrollState(true);
    requestAnimationFrame(() => this._resetAreaHeaderScrollState(true));
    requestAnimationFrame(() => requestAnimationFrame(() => this._resetAreaHeaderScrollState(true)));
    window.setTimeout(() => this._resetAreaHeaderScrollState(true), 80);
    window.setTimeout(() => this._resetAreaHeaderScrollState(true), 220);
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
    this._setAreaHeaderStuckForScroll(scrollContainer.scrollTop, false);
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
    }

    // Reset the state changes flag after render
    if (this._hasRelevantStateChanges) {
      this._hasRelevantStateChanges = false;
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
        this._resetAreaHeaderAfterNavigation();
      } else {
        this._resetAreaHeaderScrollState(false);
      }
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
      return html`<div class="loading">Loading...</div>`;
    }

    const layoutClasses = {
      'layout-container': true,
      'sidebar-resizing': this._isResizingSidebar,
      'sidebar-collapsed': this._isDesktopAreaSidebarCollapsed(),
    };

    return html`
      <div
        class=${classMap(layoutClasses)}
        style=${`--area-sidebar-width: ${this._areaSidebarWidth}px;`}
      >
        ${this._renderMobileOverlay()}
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
      ${this._renderToast()}
      ${this._renderConfirmationDialog()}
      ${this._renderNotificationsPanel()}
    `;
  }

  private _renderSidebarResizeHandle() {
    const collapsed = this._isDesktopAreaSidebarCollapsed();

    return html`
      <button
        class="sidebar-collapse-toggle ${collapsed ? 'is-collapsed' : ''}"
        type="button"
        title=${collapsed ? 'Show area sidebar' : 'Collapse area sidebar'}
        aria-label=${collapsed ? 'Show area sidebar' : 'Collapse area sidebar'}
        @click=${this._toggleAreaSidebarCollapsed}
      >
        <ha-icon icon=${collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}></ha-icon>
      </button>
      ${collapsed ? nothing : html`
      <button
        class="sidebar-resize-handle"
        type="button"
        role="separator"
        aria-label="Resize area sidebar"
        aria-orientation="vertical"
        aria-valuemin=${SIDEBAR_MIN_WIDTH}
        aria-valuemax=${SIDEBAR_MAX_WIDTH}
        aria-valuenow=${this._areaSidebarWidth}
        title="Drag to resize area sidebar"
        @pointerdown=${this._startSidebarResize}
        @keydown=${this._handleSidebarResizeKeydown}
      ></button>
      `}
    `;
  }

  private _renderMobileOverlay() {
    if (!this._isMobile) return nothing;

    return html`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen ? 'open' : ''}"
        @click=${this._closeMobileNav}
      ></div>
    `;
  }

  private _renderNotificationsPanel() {
    if (!this._showNotificationsUi()) return nothing;

    const count = this._persistentNotifications.length;
    const hasNotifications = count > 0;

    return html`
      <div
        class="notifications-overlay ${this._notificationsOpen ? 'open' : ''}"
        @click=${this._closeNotifications}
      ></div>
      <section
        class="notifications-panel ${this._notificationsOpen ? 'open' : ''}"
        aria-hidden=${this._notificationsOpen ? 'false' : 'true'}
      >
        <div class="notifications-head">
          <div class="notifications-title">
            <div class="notifications-title-row">
              <ha-icon icon="mdi:bell-outline"></ha-icon>
              <span>Notifications</span>
            </div>
            <div class="notifications-subtitle">
              ${hasNotifications
                ? `${count} persistent ${count === 1 ? 'notification' : 'notifications'}`
                : 'Persistent notifications from Home Assistant'}
            </div>
          </div>
          <div class="notifications-actions">
            ${hasNotifications ? html`
              <button
                class="notifications-icon-button"
                type="button"
                title="Dismiss all"
                @click=${this._dismissAllPersistentNotifications}
              >
                <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
              </button>
            ` : nothing}
            <button
              class="notifications-icon-button"
              type="button"
              title="Refresh"
              @click=${() => this._loadPersistentNotifications(true)}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <button
              class="notifications-icon-button"
              type="button"
              title="Close"
              @click=${this._closeNotifications}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        </div>

        <div class="notifications-list">
          ${this._notificationsLoading && !hasNotifications
            ? html`
                <div class="notifications-loading">
                  <ha-icon icon="mdi:loading"></ha-icon>
                  <span>Loading notifications...</span>
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
                      <span>No persistent notifications</span>
                    </div>
                  `}
        </div>
      </section>
    `;
  }

  private _renderPersistentNotification(notification: PersistentNotification) {
    return html`
      <article class="notification-row">
        <div class="notification-icon">
          <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
        </div>
        <div class="notification-copy">
          <div class="notification-title">${notification.title || 'Notification'}</div>
          <div class="notification-message">${notification.message}</div>
          ${notification.created_at ? html`
            <div class="notification-date">${this._formatNotificationDate(notification.created_at)}</div>
          ` : nothing}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title="Dismiss"
          @click=${() => this._dismissPersistentNotification(notification.notification_id)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
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

    return html`
      <nav class=${classMap(classes)}>
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
    return sortAreas(this.config.areas, this.config.areas_display);
  }

  private _renderAreaButtons() {
    if (!this.config?.areas) return nothing;

    // Get visible areas (filtered and sorted)
    const visibleAreas = this._getVisibleSortedAreas();

    // Group areas by floor
    const groupedAreas = this._groupAreasByFloor(visibleAreas);

    // Sort floors so that "no_floor" comes last
    const sortedFloors = Object.entries(groupedAreas).sort(([a], [b]) => {
      if (a === 'no_floor') return 1;
      if (b === 'no_floor') return -1;
      return a.localeCompare(b);
    });

    return sortedFloors.map(([floorName, areas]) => {
      const floorTitle = floorName === 'no_floor' ?
        this.hass.localize('ui.components.area-picker.no_floor') || 'Unassigned spaces' :
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

  private _renderAreaButton(area: any) {
        const areaData = this._getCachedAreaData(area);
        const isSelected = this._selectedArea === area.area_id;
    const hasPicture = area.picture ? true : false;
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';

        return html`
          <button
            class="area-button ${isSelected ? 'selected' : ''} ${hasPicture ? 'has-picture' : ''} ${pictureContrastClass}"
            @click=${() => this._selectArea(area.area_id)}
          >
            ${hasPicture ? html`
              <div class="area-background" style="background-image: url('${area.picture}');"></div>
            ` : nothing}

            <div class="area-content">
              <!-- Top section: Name and sensors -->
              <div class="area-top-section">
              <div class="area-name">${area.name}</div>
              ${areaData.temperature || areaData.humidity || areaData.wattage ? html`
                <div class="area-sensors">
                  ${[
                    areaData.temperature,
                    areaData.humidity,
                    areaData.wattage
                  ].filter(Boolean).join(' • ')}
                </div>
              ` : nothing}
            </div>

              <!-- Bottom section: Icon and badges -->
              <div class="area-bottom-section">
                <!-- Left: Main area icon -->
                <div class="area-main-icon">
                  <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                </div>

                <!-- Right: Info badges -->
                <div class="area-info-badges">
                  ${areaData.domains.light && areaData.domains.light.on > 0 ? html`
                    <span class="info-badge light clickable"
                          style=${this._domainBadgeStyle('light')}
                          @click=${(e: Event) => this._handleLightToggle(e, area.area_id)}>
                      <ha-icon icon=${getDomainIcon('light')}></ha-icon>
                      <span class="badge-count">${areaData.domains.light.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.switch && areaData.domains.switch.on > 0 ? html`
                    <span class="info-badge switch" style=${this._domainBadgeStyle('switch')}>
                      <ha-icon icon=${getDomainIcon('switch')}></ha-icon>
                      <span class="badge-count">${areaData.domains.switch.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.climate && areaData.domains.climate.on > 0 ? html`
                    <span class="info-badge climate" style=${this._domainBadgeStyle('climate')}>
                      <ha-icon icon=${getDomainIcon('climate')}></ha-icon>
                      <span class="badge-count">${areaData.domains.climate.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.media_player && areaData.domains.media_player.on > 0 ? html`
                    <span class="info-badge media_player" style=${this._domainBadgeStyle('media_player')}>
                      <ha-icon icon=${getDomainIcon('media_player')}></ha-icon>
                      <span class="badge-count">${areaData.domains.media_player.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.cover && areaData.domains.cover.on > 0 ? html`
                    <span class="info-badge cover" style=${this._domainBadgeStyle('cover')}>
                      <ha-icon icon=${getDomainIcon('cover')}></ha-icon>
                      <span class="badge-count">${areaData.domains.cover.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.fan && areaData.domains.fan.on > 0 ? html`
                    <span class="info-badge fan" style=${this._domainBadgeStyle('fan')}>
                      <ha-icon icon=${getDomainIcon('fan')}></ha-icon>
                      <span class="badge-count">${areaData.domains.fan.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.motion && areaData.domains.motion.on > 0 ? html`
                    <span class="info-badge motion" style=${this._domainBadgeStyle('binary_sensor', 'motion')}>
                      <ha-icon icon=${getDeviceClassIcon('binary_sensor', 'motion')}></ha-icon>
                      <span class="badge-count">${areaData.domains.motion.on}</span>
                    </span>
                  ` : nothing}

            ${areaData.alerts.length > 0 ? html`
                    <span class="info-badge alerts">
                      <ha-icon icon="mdi:alert-circle"></ha-icon>
                      <span class="badge-count">${areaData.alerts.length}</span>
                    </span>
            ` : nothing}
                </div>
              </div>
            </div>
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
        `;
  }

  private _renderGlobalHeader() {
    const classes = {
      'global-header': true,
      'compact': this._headerCompact,
      'expanded': this._headerExpanded,
      'mobile': this._isMobile
    };

    return html`
      <header class=${classMap(classes)}>
        <div class="header-content">
          ${this._renderHeaderStatusCards()}

          ${!this._isMobile ? html`
            <div class="header-time-weather">
              ${this.config?.settings?.show_time !== false ? html`
                <div class="header-time-section">
              <div class="header-time">${this._currentTime}</div>
              <div class="header-date">${this._currentDate}</div>
            </div>
          ` : nothing}
          ${this._renderWeatherDisplay()}
            </div>
          ` : nothing}
        </div>

        <!-- Expanded content section (always in DOM to avoid Lit marker invalidation) -->
        <div class="header-expanded-content" style=${this._headerExpanded ? '' : 'display:none'}>
          <div class="header-favorites">
            ${this._renderFavoritesSection()}
          </div>
        </div>

        ${this._selectedView !== 'home' ? this._renderHeaderExpandButton() : nothing}
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

    return html`
      <div class="header-status-section">
        <div class="header-status-scroll">
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
                ${domain.value ? html`<div class="status-card-subtitle-compact">${domain.name}</div>` : nothing}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private _renderHeaderExpandButton() {
    const extraCount = this._getHiddenStatusCount();

    return html`
      <button
        class="header-expand-button"
        @click=${this._toggleHeader}
        data-extra-count=${ifDefined(extraCount || undefined)}
      >
        <ha-icon icon=${this._headerExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
      </button>
    `;
  }

  private _domainStatusStyle(domain: string, deviceClass?: string): string {
    return `--status-color: ${getDomainColor(domain, deviceClass)};`;
  }

  private _domainBadgeStyle(domain: string, deviceClass?: string): string {
    const color = getDomainColor(domain, deviceClass);
    return `--badge-color: ${color}; --area-badge-color: ${color};`;
  }

  private _statusCardTitle(domain: DomainCount): string {
    const activeLabel = this._statusCardActiveLabel(domain);
    if (activeLabel) {
      if (domain.count === 1 && domain.entities?.length === 1) {
        const areaName = this._entityAreaName(domain.entities[0]!);
        return areaName ? `${activeLabel.singular} in ${areaName}` : activeLabel.singular;
      }
      return activeLabel.plural;
    }

    // Bij precies 1 actief: toon de ruimte ("Motion in Slaapkamer").
    if (domain.domain !== 'person' && domain.count === 1 && domain.entities?.length === 1) {
      const areaName = this._entityAreaName(domain.entities[0]!);
      if (areaName) return `${domain.name} in ${areaName}`;
    }
    return domain.name;
  }

  private _statusCardActiveLabel(domain: DomainCount): { singular: string; plural: string } | undefined {
    if (domain.domain === 'person') return undefined;

    if (domain.domain === 'light') return { singular: 'Light on', plural: 'Lights on' };
    if (domain.domain === 'switch') return { singular: 'Switch on', plural: 'Switches on' };
    if (domain.domain === 'cover') return { singular: 'Cover open', plural: 'Covers open' };
    if (domain.domain === 'fan') return { singular: 'Fan on', plural: 'Fans on' };
    if (domain.domain === 'lock') return { singular: 'Lock unlocked', plural: 'Locks unlocked' };
    if (domain.domain === 'climate') return { singular: 'Climate active', plural: 'Climate active' };
    if (domain.domain === 'media_player') return { singular: 'Media player playing', plural: 'Media players playing' };
    if (domain.domain === 'vacuum') return { singular: 'Vacuum cleaning', plural: 'Vacuums cleaning' };
    if (domain.domain === 'alarm_control_panel') return { singular: 'Alarm armed', plural: 'Alarms armed' };

    if (domain.domain === 'binary_sensor') {
      switch (domain.deviceClass) {
        case 'door':
          return { singular: 'Door open', plural: 'Doors open' };
        case 'window':
          return { singular: 'Window open', plural: 'Windows open' };
        case 'opening':
          return { singular: 'Opening open', plural: 'Openings open' };
        case 'motion':
          return { singular: 'Motion detected', plural: 'Motion detected' };
        case 'smoke':
          return { singular: 'Smoke detected', plural: 'Smoke detected' };
        case 'gas':
          return { singular: 'Gas detected', plural: 'Gas detected' };
        case 'moisture':
          return { singular: 'Moisture detected', plural: 'Moisture detected' };
        case 'occupancy':
          return { singular: 'Occupancy detected', plural: 'Occupancy detected' };
        case 'presence':
          return { singular: 'Presence detected', plural: 'Presence detected' };
        case 'tamper':
          return { singular: 'Tamper detected', plural: 'Tamper detected' };
        case 'vibration':
          return { singular: 'Vibration detected', plural: 'Vibration detected' };
        case 'safety':
          return { singular: 'Safety active', plural: 'Safety active' };
        default:
          return { singular: `${domain.name} active`, plural: `${domain.name} active` };
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
      case 'summaries':
        return this._renderHomeSummaries();
      case 'cameras':
        return this._renderHomeCameras();
      case 'areas':
        return this._renderMobileHomeAreas();
      case 'devices':
        return this._renderHomeStatusCards();
      case 'favorites':
        return this._renderFavorites();
      default:
        return nothing;
    }
  }

  private _renderHomeSummaries() {
    const summaries = this._getHomeSummaryCards();
    if (!summaries.length) return nothing;

    return html`
      <section class="home-summaries-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
          <span>Summaries</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle active"
              type="button"
              title="Summaries"
              aria-label="Summaries"
            >
              <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
            </button>
            <span class="mobile-section-title-label">Summaries</span>
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

  private _getHomeSummaryCards(): HomeSummaryCard[] {
    const cards: HomeSummaryCard[] = [];
    const updateCount = this._getUpdateEntityCount();

    if (this._repairsIssueCount > 0) {
      cards.push({
        key: 'repairs',
        label: 'Repairs',
        subtitle: `${this._repairsIssueCount} ${this._repairsIssueCount === 1 ? 'issue' : 'issues'}`,
        icon: 'mdi:wrench',
        color: '#f59e0b',
        count: this._repairsIssueCount,
        path: '/config/repairs',
      });
    }

    if (updateCount > 0) {
      cards.push({
        key: 'updates',
        label: 'Updates',
        subtitle: `${updateCount} ${updateCount === 1 ? 'update' : 'updates'} available`,
        icon: 'mdi:package-up',
        color: '#0ea5e9',
        count: updateCount,
        path: '/config/updates',
      });
    }

    if (this._discoveredDeviceCount > 0) {
      cards.push({
        key: 'discovered',
        label: 'Devices discovered',
        subtitle: `${this._discoveredDeviceCount} ${this._discoveredDeviceCount === 1 ? 'device' : 'devices'} to add`,
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
                title="Profile settings"
                aria-label="Profile settings"
                @click=${this._openProfileSettings}
              >
                ${userPicture
                  ? html`<img src=${userPicture} alt=${userName} />`
                  : html`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy">
                <div class="welcome-text">
                  <span class="welcome-greeting">${greeting}</span>
                  <span class="welcome-name">, ${userName}!</span>
                  <span class="welcome-title">Hello, ${userName}</span>
                </div>
                <div class="welcome-return">${this._getHomeSnapshotText(weatherEntity)}</div>
              </div>
            </div>
            <div class="welcome-actions">
              ${this._canManageDashboard() ? html`
                <button
                  class="welcome-action"
                  type="button"
                  title=${this._t('sidebar.dashboard_settings')}
                  @click=${this._openDashboardSettings}
                >
                  <ha-icon icon="mdi:cog-outline"></ha-icon>
                </button>
              ` : nothing}
              ${this._showNotificationsUi() ? html`
                <button
                  class="welcome-action"
                  type="button"
                  title="Notifications"
                  @click=${this._openNotifications}
                >
                  <ha-icon icon="mdi:bell-outline"></ha-icon>
                  ${this._persistentNotifications.length
                    ? html`<span class="welcome-action-badge">${this._persistentNotifications.length}</span>`
                    : nothing}
                </button>
              ` : nothing}
            </div>
            <div class="welcome-time-section">
              <div class="welcome-time">${this._currentTime}</div>
              <div class="welcome-date">${this._currentDate}</div>
            </div>
          </div>
          ${alarmContent !== nothing || weatherTemperature ? html`
            <div class="welcome-subheader">
              ${alarmContent}
              ${weatherEntity && weatherTemperature ? html`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(weatherEntity)}
                  aria-label=${this._weatherTitle(weatherEntity)}
                  @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
                >
                  <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
                  <span class="weather-temp">${weatherTemperature}</span>
                  <span class="weather-label">Outside</span>
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
    const cards = [
      this._homeInformationCardVisible('people') ? this._renderHousePersonsStatusCard() : nothing,
      this._homeInformationCardVisible('climate') ? this._renderHouseClimateStatusCard() : nothing,
      this._homeInformationCardVisible('power') ? this._renderHousePowerStatusCard() : nothing,
      ...visibleDomains.map(domain => html`
        <div
          class="home-status-card ${domain.domain} ${domain.value ? 'has-value' : ''}"
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
      `),
    ].filter(card => card !== nothing);

    if (!cards.length) return nothing;

    return html`
      <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
          <span>House information</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
              type="button"
              title=${gridMode ? 'Swipe house information' : 'Show all house information'}
              aria-label=${gridMode ? 'Switch house information to swipe cards' : 'Show all house information'}
              @click=${this._toggleMobileHomeDevicesLayout}
            >
              <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
            </button>
            <span class="mobile-section-title-label">House information</span>
          </div>
          <button
            class="mobile-section-action"
            type="button"
            @click=${this._openMobileDeviceSwitcher}
          >
            <span>See all</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
        <div class="home-status-grid">
          ${cards}
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
          <span>Cameras</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
              type="button"
              title=${gridMode ? 'Swipe cameras' : 'Show all cameras'}
              aria-label=${gridMode ? 'Switch cameras to swipe cards' : 'Show all cameras'}
              @click=${this._toggleMobileHomeCamerasLayout}
            >
              <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
            </button>
            <span class="mobile-section-title-label">Cameras</span>
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
            ${camera.count > 1 ? html`
              <div class="home-camera-count">
                <ha-icon icon="mdi:cctv"></ha-icon>
                <span>${camera.count}</span>
              </div>
            ` : nothing}
          </div>
          <div class="home-camera-copy">
            <div class="home-camera-name">${camera.areaName}</div>
            <div class="home-camera-meta">${camera.name} · ${camera.state}</div>
          </div>
        </div>
      </button>
    `;
  }

  private _getHomeAreaCameras(): HomeAreaCamera[] {
    const cameras: HomeAreaCamera[] = [];

    this._getVisibleSortedAreas().forEach(area => {
      const cameraEntities = this._getFilteredAreaEntities(area.area_id)
        .filter(entity => entity.entity_id.startsWith('camera.'))
        .filter(entity => {
          const state = this.hass?.states?.[entity.entity_id]?.state;
          return Boolean(state && state !== 'unavailable' && state !== 'unknown');
        });

      if (!cameraEntities.length) return;

      const cameraEntity = cameraEntities[0]!;
      const stateObj = this.hass.states[cameraEntity.entity_id];
      const name = stateObj?.attributes?.friendly_name || cameraEntity.entity_id;
      const state = stateObj ? this.hass.formatEntityState(stateObj) : 'Unknown';
      const imageUrl = this._getCameraImageUrl(cameraEntity.entity_id);
      const camera: HomeAreaCamera = {
        areaId: area.area_id,
        areaName: area.name,
        areaIcon: getAreaIcon(area),
        entityId: cameraEntity.entity_id,
        name,
        state,
        count: cameraEntities.length,
      };

      if (imageUrl) {
        camera.imageUrl = imageUrl;
      }

      cameras.push(camera);
    });

    return cameras;
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
      ? `${powerUsage.sensorCount} live power ${powerUsage.sensorCount === 1 ? 'sensor' : 'sensors'}`
      : 'No live power sensors';

    return html`
      <div
        class="home-status-card house-power-card wattage ${powerUsage.sensorCount ? 'has-power' : 'is-empty'}"
        @click=${() => this._openDeviceDomain('energy')}
        @keydown=${this._handleHousePowerKeydown}
        data-domain="wattage"
        role="button"
        tabindex="0"
        aria-label=${`House power usage: ${powerUsage.formattedTotal}`}
      >
        <div class="house-power-head">
          <div class="status-card-icon house-power-icon">
            <ha-icon icon="mdi:flash"></ha-icon>
          </div>
          <div class="house-power-copy">
            <div class="house-power-title">House power usage</div>
            <div class="house-power-subtitle">${subtitle}</div>
          </div>
          <div class="house-power-total">${powerUsage.formattedTotal}</div>
        </div>
        ${powerUsage.rooms.length ? html`
          <div class="house-power-list" aria-label="Top rooms by power usage">
            ${repeat(
              powerUsage.rooms,
              room => room.areaId,
              room => this._renderHousePowerRoom(room)
            )}
          </div>
        ` : html`
          <div class="house-power-empty">No room power usage right now</div>
        `}
      </div>
    `;
  }

  private _renderHouseClimateStatusCard() {
    const climate = this._getHouseClimateSummary();
    if (!climate.metrics.length) return nothing;

    return html`
      <div
        class="home-status-card house-climate-card sensor"
        @click=${() => this._showHouseClimateEntities()}
        @keydown=${this._handleHouseClimateKeydown}
        data-domain="sensor"
        role="button"
        tabindex="0"
        aria-label="Indoor climate"
      >
        <div class="house-climate-head">
          <div class="status-card-icon house-climate-icon">
            <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>
          </div>
          <div class="house-climate-copy">
            <div class="house-climate-title">Indoor climate</div>
            <div class="house-climate-subtitle">
              ${climate.sensorCount === 1 ? '1 climate sensor' : `${climate.sensorCount} climate sensors`}
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
                this._showHouseClimateEntities(metric.kind);
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
    this._openDeviceDomain('energy');
  };

  private _handleHouseClimateKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showHouseClimateEntities();
  };

  private _showHouseClimateEntities(kind?: HouseClimateMetric['kind']): void {
    const climate = this._getHouseClimateSummary();
    const metrics = kind
      ? climate.metrics.filter(metric => metric.kind === kind)
      : climate.metrics;
    const entityIds = metrics.flatMap(metric => metric.entityIds);

    if (!entityIds.length) {
      this._openDeviceDomain('sensor');
      return;
    }

    const title = kind
      ? metrics[0]?.label || 'Indoor climate'
      : 'Indoor climate';

    showDomainEntitiesDialog(this, {
      domain: 'sensor',
      config: this.config,
      entityIds,
      customTitle: title,
      viewAllLabel: 'View sensors',
      onViewAll: () => this._openDeviceDomain('sensor'),
    });
  }

  private _renderHousePersonsStatusCard() {
    const personEntities = this._getVisiblePersonEntities();
    const homeCount = personEntities.filter(person => person.state === 'home').length;
    const subtitle = personEntities.length
      ? `${homeCount}/${personEntities.length} home`
      : 'No people';

    return html`
      <div
        class="home-status-card house-persons-card person"
        @click=${() => this._openDeviceDomain('person')}
        data-domain="person"
      >
        <div class="house-persons-head">
          <div class="status-card-icon house-persons-icon">
            <ha-icon icon="mdi:account-group"></ha-icon>
          </div>
          <div class="house-persons-copy">
            <div class="house-persons-title">People</div>
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
          <div class="house-persons-empty">No visible persons configured</div>
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
    if (!person.state || person.state === 'unknown') return 'Unknown';
    if (person.state === 'unavailable') return 'Unavailable';

    return String(person.state)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private _getHomeSnapshotText(weatherEntity?: any): string {
    const parts: string[] = [];
    const personEntities = this._getVisiblePersonEntities();

    if (personEntities.length) {
      const homeCount = personEntities.filter(person => person.state === 'home').length;
      parts.push(`${homeCount}/${personEntities.length} home`);
    }

    if (this._showNotificationsUi() && this._persistentNotifications.length) {
      const count = this._persistentNotifications.length;
      parts.push(`${count} ${count === 1 ? 'notification' : 'notifications'}`);
    }

    const attentionCount = this._getHomeSummaryCards()
      .reduce((total, summary) => total + summary.count, 0);
    if (attentionCount) {
      parts.push(attentionCount === 1 ? '1 item needs attention' : `${attentionCount} items need attention`);
    }

    const weatherText = this._formatWeatherSnapshot(weatherEntity);
    if (weatherText && parts.length < 3) {
      parts.push(weatherText);
    }

    return parts.slice(0, 3).join(' · ') || 'Everything looks calm';
  }

  private _formatWeatherSnapshot(weatherEntity?: any): string {
    const temperature = this._formatWeatherTemperature(weatherEntity);
    if (!temperature) return '';

    return `${temperature} outside`;
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

    return `${temperature}${unit}`;
  }

  private _weatherTitle(weatherEntity?: any): string {
    const temperature = this._formatWeatherTemperature(weatherEntity);
    const condition = this._formatWeatherCondition(weatherEntity?.state);

    if (temperature && condition) return `${temperature} outside, ${condition}`;
    if (temperature) return `${temperature} outside`;
    return condition || 'Outside weather';
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

  private _getHouseClimateSummary(): HouseClimateSummary {
    const values: Record<HouseClimateMetric['kind'], Array<{ value: number; unit: string; entityId: string }>> = {
      temperature: [],
      humidity: [],
    };

    this._getVisibleSortedAreas().forEach(area => {
      this._getFilteredAreaEntities(area.area_id).forEach(entity => {
        const state = this.hass?.states?.[entity.entity_id];
        if (!state || !state.entity_id?.startsWith('sensor.')) return;

        const deviceClass = String(state.attributes?.device_class || '').toLowerCase();
        if (deviceClass !== 'temperature' && deviceClass !== 'humidity') return;

        const value = Number.parseFloat(state.state);
        if (!Number.isFinite(value)) return;

        values[deviceClass].push({
          value,
          unit: String(state.attributes?.unit_of_measurement || (deviceClass === 'temperature'
            ? this.hass?.config?.unit_system?.temperature || '°C'
            : '%')),
          entityId: entity.entity_id,
        });
      });
    });

    const metrics: HouseClimateMetric[] = [];
    const temperature = this._houseClimateMetric('temperature', values.temperature);
    const humidity = this._houseClimateMetric('humidity', values.humidity);
    if (temperature) metrics.push(temperature);
    if (humidity) metrics.push(humidity);

    return {
      sensorCount: values.temperature.length + values.humidity.length,
      metrics,
    };
  }

  private _houseClimateMetric(
    kind: HouseClimateMetric['kind'],
    values: Array<{ value: number; unit: string; entityId: string }>
  ): HouseClimateMetric | undefined {
    if (!values.length) return undefined;

    const average = values.reduce((total, item) => total + item.value, 0) / values.length;
    const unit = values[0]?.unit || (kind === 'temperature' ? '°C' : '%');
    const value = kind === 'temperature'
      ? `${average.toFixed(1)} ${unit}`
      : `${Math.round(average)}${unit}`;

    return {
      kind,
      label: kind === 'temperature' ? 'Average temp' : 'Average humidity',
      value,
      count: values.length,
      icon: kind === 'temperature' ? getDeviceClassIcon('sensor', 'temperature') : getDeviceClassIcon('sensor', 'humidity'),
      color: kind === 'temperature' ? getDomainColor('sensor', 'temperature') : getDomainColor('sensor', 'humidity'),
      entityIds: values.map(item => item.entityId),
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
              <span class="mobile-layout-toggle active" aria-hidden="true">
                <ha-icon icon="mdi:view-grid-outline"></ha-icon>
              </span>
            ` : html`
              <button
                class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
                type="button"
                title=${gridMode ? 'Swipe areas' : 'Show all areas'}
                aria-label=${gridMode ? 'Switch areas to swipe cards' : 'Show all areas'}
                @click=${this._toggleMobileHomeAreasLayout}
              >
                <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
              </button>
            `}
            <span class="mobile-section-title-label">Areas</span>
          </div>
          ${desktopCollapsed ? nothing : html`
            <button
              class="mobile-section-action"
              type="button"
              @click=${this._openMobileAreaSwitcher}
            >
              <span>See all</span>
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          `}
        </div>
        <div class="mobile-area-rail">
          ${repeat(
            renderedAreas,
            area => area.area_id,
            area => this._renderMobileHomeAreaCard(area)
          )}
        </div>
      </section>
    `;
  }

  private _renderMobileHomeAreaCard(area: AreaConfig) {
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
    const badges: Array<{ className: string; icon: string; count: number; color: string }> = [];
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';

    if (areaData.domains.cover?.on) {
      badges.push({
        className: 'cover',
        icon: getDomainIcon('cover'),
        count: areaData.domains.cover.on,
        color: getDomainColor('cover'),
      });
    }
    if (areaData.domains.light?.on) {
      badges.push({
        className: 'light',
        icon: getDomainIcon('light'),
        count: areaData.domains.light.on,
        color: getDomainColor('light'),
      });
    }
    if (areaData.domains.motion?.on) {
      badges.push({
        className: 'motion',
        icon: getDeviceClassIcon('binary_sensor', 'motion'),
        count: areaData.domains.motion.on,
        color: getDomainColor('binary_sensor', 'motion'),
      });
    }

    return html`
      <button
        class="mobile-area-card ${hasPicture ? 'has-picture' : ''} ${pictureContrastClass}"
        type="button"
        @click=${() => this._selectArea(area.area_id)}
      >
        ${hasPicture ? html`
          <div class="mobile-area-picture" style=${`background-image: url('${area.picture}');`}></div>
        ` : nothing}
        <div class="mobile-area-top">
          <div class="mobile-area-icon">
            <ha-icon icon=${getAreaIcon(area)}></ha-icon>
          </div>
          <div class="mobile-area-badges">
            ${badges.slice(0, 2).map(badge => html`
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
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  private _renderHomeAlarm() {
    const alarm = this._getAlarmEntity();
    if (!alarm) return nothing;

    const state = alarm?.state || '';
    const isArmed = ['armed_away', 'armed_home', 'armed_night', 'armed_vacation'].includes(state);
    const isDisarmed = state === 'disarmed';

    const getAlarmIcon = () => {
      if (isArmed) return 'mdi:shield-check';
      if (isDisarmed) return 'mdi:shield-off';
      return 'mdi:shield-alert';
    };

    const getAlarmText = () => {
      if (isArmed) return 'Armed';
      if (isDisarmed) return 'Disarmed';
      return 'Alarm';
    };

    const getAlarmClass = () => {
      if (isArmed) return 'alarm-armed';
      if (isDisarmed) return 'alarm-disarmed';
      return 'alarm-triggered';
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
              title=${gridMode ? 'Swipe favorites' : 'Show all favorites'}
              aria-label=${gridMode ? 'Switch favorites to swipe cards' : 'Show all favorites'}
              @click=${this._toggleMobileHomeFavoritesLayout}
            >
              <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
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
    const name = state.attributes?.friendly_name || registry?.name || entityId;
    const formattedState = this._formatFavoriteState(state);
    const areaName = this._entityAreaName(entityId);
    const icon = registry?.icon || state.attributes?.icon || getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const activeState = this._favoriteActiveState(state, domain);
    const supportsToggle = this._favoriteSupportsQuickToggle(domain);
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
        data-entity=${entityId}
        role="button"
        tabindex="0"
        @click=${() => this._showMoreInfo(entityId)}
        @keydown=${(event: KeyboardEvent) => this._handleFavoriteKeydown(event, entityId)}
      >
        <div class="favorite-top">
          <div class="favorite-icon">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          <button
            class="favorite-quick-action"
            type="button"
            title=${this._favoriteQuickTitle(state, domain)}
            @click=${(event: Event) => this._handleFavoriteQuickAction(event, state, domain)}
          >
            <ha-icon icon=${this._favoriteQuickIcon(state, domain)}></ha-icon>
          </button>
        </div>
        <div class="favorite-body">
          <div class="favorite-name">${name}</div>
          <div class="favorite-state">${formattedState}</div>
          ${areaName ? html`<div class="favorite-area">${areaName}</div>` : nothing}
        </div>
      </article>
    `;
  }

  private _handleFavoriteKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private _formatFavoriteState(state: any): string {
    const effectiveState = this._getEffectiveEntityState(state);

    try {
      return this.hass.formatEntityState(effectiveState);
    } catch {
      return String(effectiveState?.state || '');
    }
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

  private _renderStaticIcon(path: string): TemplateResult {
    return html`
      <svg class="dd-static-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${path}></path>
      </svg>
    `;
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
    if (domain === 'cover') return ['open', 'opening'].includes(value) ? 'Close' : 'Open';
    if (domain === 'lock') return value === 'unlocked' ? 'Lock' : 'Unlock';
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return value === 'off' ? 'Turn on' : 'Turn off';
    return 'More info';
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
      this._showToast('Could not update entity');
      return;
    }

    this._showMoreInfo(entityId);
  }



  private _renderAreaView() {
    if (!this._selectedArea) return nothing;

    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    if (!area) return nothing;

    const areaEntities = this._getFilteredAreaEntities(this._selectedArea);
    const areaData = this._getCachedAreaData(area);
    const hasPicture = area.picture ? true : false;
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';
    const deviceCount = this._getAreaDeviceCount(area.area_id, areaEntities);
    const hasHeaderMetrics = Boolean(areaData.temperature || areaData.humidity);
    const hasMobileQuickControls = areaEntities.some(entity =>
      entity.entity_id.startsWith('light.') ||
      entity.entity_id.startsWith('switch.') ||
      entity.entity_id.startsWith('cover.')
    );
    const deviceLabel = deviceCount === 1 ? '1 device' : `${deviceCount} devices`;
    const stickyMetrics = [
      areaData.temperature,
      areaData.humidity,
    ].filter(Boolean).join(' · ');
    const areaSubtitle = this._areaHeaderStuck && !this._areaHeaderRevealed && stickyMetrics ? stickyMetrics : deviceLabel;

    return html`
      <div class="area-view">
        <div class="area-header ${hasPicture ? 'has-picture' : ''} ${pictureContrastClass} ${hasHeaderMetrics ? 'has-metrics' : ''} ${hasMobileQuickControls ? 'has-quick-controls' : ''} ${this._areaHeaderStuck ? 'is-stuck' : ''} ${this._areaHeaderRevealed ? 'is-revealed' : ''}">
          ${hasPicture ? html`
            <div class="area-header-background" style="background-image: url('${area.picture}');"></div>
          ` : nothing}
          <div class="area-mobile-toolbar">
            <button
              class="area-mobile-round area-mobile-home"
              title="Home"
              aria-label="Back to home"
              @click=${() => this._selectView('home')}
            >
              ${this._renderStaticIcon(ICON_ARROW_LEFT)}
            </button>
            ${this._renderAreaMobileQuickControls(area.area_id, areaEntities)}
            <div class="area-mobile-actions">
              ${this._renderAreaMobileCameraAction(areaEntities)}
              ${this._renderUnavailableEntitiesIcon(area.area_id)}
              ${this._canManageDashboard() ? html`
                <button
                  class="area-mobile-round area-mobile-edit ${this._editMode ? 'active' : ''}"
                  title=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
                  @click=${this._toggleEditMode}
                >
                  <ha-icon icon=${this._editMode ? 'mdi:check' : 'mdi:pencil'}></ha-icon>
                  <span class="area-mobile-dot"></span>
                </button>
              ` : nothing}
            </div>
          </div>
          <div class="area-header-content">
            ${this._isDesktopAreaSidebarCollapsed() ? html`
              <button
                class="area-desktop-back"
                type="button"
                title="Back to home"
                aria-label="Back to home"
                @click=${() => this._selectView('home')}
              >
                ${this._renderStaticIcon(ICON_ARROW_LEFT)}
              </button>
            ` : nothing}
            <div class="area-title-group">
              <div class="area-header-icon">
                <ha-icon icon=${getAreaIcon(area)}></ha-icon>
              </div>
              <div class="area-title-copy">
                <h1 class="area-title">${area.name}</h1>
                <div class="area-subtitle">${areaSubtitle}</div>
              </div>
            </div>
            <div class="area-header-actions">
              ${this._renderUnavailableEntitiesIcon(area.area_id)}
              ${this._canManageDashboard() ? html`
                <button
                  class="dd-edit-toggle ${this._editMode ? 'active' : ''}"
                  title=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
                  @click=${this._toggleEditMode}
                >
                  <ha-icon icon=${this._editMode ? 'mdi:check' : 'mdi:pencil'}></ha-icon>
                </button>
              ` : nothing}
            </div>
          </div>
          ${this._renderAreaHeaderMetrics(areaData)}
          ${this._renderAreaBadges(area, areaEntities, areaData)}
        </div>

        ${this._renderCustomCardSlot(area.area_id, 'top', this._t('layout.custom_cards_top'))}
        ${this._renderMobileEntitiesSection(area, areaEntities)}
        ${this._renderCustomCardSlot(area.area_id, 'bottom', this._t('layout.custom_cards_bottom'))}
      </div>
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
          ${this._editMode && canEdit && cards.length === 0
            ? html`
                <button class="dd-add-card" @click=${() => this._addCard(areaId, placement, 0)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                  <span>${this._t('layout.add_card')}</span>
                </button>
              `
            : nothing}
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
      editing: this._editMode,
      dragging,
      'drag-over': dragOver,
    };

    // dwains-dashboard-next-card-host manages the HA card in its own light DOM.
    return html`
      <div
        class=${classMap(classes)}
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

  private _getDomainSlotCustomCards(
    areaId: string,
    groupKey: string,
    slotIndex: number,
    entityCount: number
  ): NormalizedAreaCustomCard[] {
    const placement = this._customCardPlacementInDomain(groupKey, slotIndex);
    const legacyAfterPlacement = this._customCardPlacementAfter(groupKey);

    return this._getAreaCustomCards(areaId).filter(entry => {
      if (entry.placement === placement) return true;
      const domainPlacementIndex = this._domainCustomCardPlacementIndex(entry.placement, groupKey);
      if (slotIndex === entityCount && domainPlacementIndex !== undefined && domainPlacementIndex > entityCount) {
        return true;
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
      ${this._editMode && canEdit ? html`
        <button
          class="dd-add-card dd-domain-add-card ${dragOver ? 'drag-over' : ''}"
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
      this._fireNativeDialog('hui-dialog-create-card', {
        lovelaceConfig: { views: [{ title: areaName, cards: [] }] },
        path: [0],
        saveConfig: (newConfig: any) => {
          const newCards = newConfig?.views?.[0]?.cards || [];
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
      this._fireNativeDialog('hui-dialog-edit-card', {
        lovelaceConfig: { views: [{ title: 'Dwains', cards: [existing] }] },
        path: [0, 0],
        saveConfig: (newConfig: any) => {
          const newCard = newConfig?.views?.[0]?.cards?.[0];
          if (newCard) {
            this._replaceAreaCustomCard(areaId, cardId, newCard);
          }
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
    if (!this._canManageDashboard()) return;
    const keepEditing = this._editMode && this._selectedView === 'area' && this._selectedArea === areaId;
    if (keepEditing) this._rememberAreaEditMode(areaId);

    const cardsToSave = this._normalizeAreaCustomCardsForSave(customCards);
    // Update local config immutably (HA freezes config objects).
    const prevOptions: any = this.config.areas_options || {};
    this.config = {
      ...this.config,
      areas_options: {
        ...prevOptions,
        [areaId]: { ...(prevOptions[areaId] || {}), custom_cards: cardsToSave },
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
              [areaId]: { ...(stratOptions[areaId] || {}), custom_cards: cardsToSave },
            },
          },
        };
        await this.hass.callWS({ type: 'lovelace/config/save', ...base, config: newConfig });
        console.log('✅ Eigen kaarten opgeslagen voor', areaId);
      } else {
        console.warn('⚠️ Geen strategy in lovelace config — opslaan overgeslagen', lovelaceConfig);
      }
    } catch (e) {
      console.error('❌ Opslaan eigen kaarten mislukt:', e);
      alert(this._t('layout.save_card_failed', { error: String(e) }));
    }
  }

  private _renderAreaBadges(area: AreaConfig, entities: EntityConfig[], areaData: AreaData) {
    const badges: TemplateResult[] = [];

    // Domain count badges (first)

    // Lights count badge
    if (areaData.domains.light && areaData.domains.light.on > 0) {
      badges.push(html`
        <div class="area-badge light" style=${this._domainBadgeStyle('light')}>
          <ha-icon icon=${getDomainIcon('light')}></ha-icon>
          <span>${areaData.domains.light.on} on</span>
        </div>
      `);
    }

    // Switches count badge
    if (areaData.domains.switch && areaData.domains.switch.on > 0) {
      badges.push(html`
        <div class="area-badge switch" style=${this._domainBadgeStyle('switch')}>
          <ha-icon icon=${getDomainIcon('switch')}></ha-icon>
          <span>${areaData.domains.switch.on} on</span>
        </div>
      `);
    }

    // Climate count badge
    if (areaData.domains.climate && areaData.domains.climate.on > 0) {
      badges.push(html`
        <div class="area-badge climate" style=${this._domainBadgeStyle('climate')}>
          <ha-icon icon=${getDomainIcon('climate')}></ha-icon>
                            <span>${areaData.domains.climate.on} active</span>
        </div>
      `);
    }

    // Motion sensors count badge
    const motionEntities = entities.filter(e =>
      e.entity_id.startsWith('binary_sensor.') &&
      this.hass?.states[e.entity_id]?.attributes?.device_class === 'motion' &&
      this.hass?.states[e.entity_id]?.state === 'on'
    );

    if (motionEntities.length > 0) {
      badges.push(html`
        <div class="area-badge motion active" style=${this._domainBadgeStyle('binary_sensor', 'motion')}>
          <ha-icon icon=${getDeviceClassIcon('binary_sensor', 'motion')}></ha-icon>
                            <span>${motionEntities.length} active</span>
        </div>
      `);
    }

    // Covers count badge
    if (areaData.domains.cover && areaData.domains.cover.on > 0) {
      badges.push(html`
        <div class="area-badge cover" style=${this._domainBadgeStyle('cover')}>
          <ha-icon icon=${getDomainIcon('cover')}></ha-icon>
          <span>${areaData.domains.cover.on} open</span>
        </div>
      `);
    }

    // Media players count badge
    if (areaData.domains.media_player && areaData.domains.media_player.on > 0) {
      badges.push(html`
        <div class="area-badge media_player" style=${this._domainBadgeStyle('media_player')}>
          <ha-icon icon=${getDomainIcon('media_player')}></ha-icon>
                            <span>${areaData.domains.media_player.on} active</span>
        </div>
      `);
    }

    // Toggle buttons section

    // Light toggle
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    if (lights.length > 0) {
      const allOff = this._areAllEntitiesOff(lights, 'light');
      badges.push(html`
        <button
          class="area-badge light-toggle"
          @click=${() => this._toggleAreaLights(area.area_id)}
        >
          <ha-icon icon=${allOff ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off'}></ha-icon>
                            <span>${allOff ? 'All lights on' : 'All lights off'}</span>
        </button>
      `);
    }

    // Switch toggle
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    if (switches.length > 0) {
      const allOff = this._areAllEntitiesOff(switches, 'switch');
      badges.push(html`
        <button
          class="area-badge switch-toggle"
          @click=${() => this._toggleAreaSwitches(area.area_id)}
        >
          <ha-icon icon=${allOff ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}></ha-icon>
          <span>${allOff ? 'All switches on' : 'All switches off'}</span>
        </button>
      `);
    }

    // Wattage badge
    if (areaData.wattage) {
      badges.push(html`
        <div class="area-badge wattage">
          <ha-icon icon="mdi:flash"></ha-icon>
          <span>${areaData.wattage}</span>
        </div>
      `);
    }

    // Energy badge
    if (areaData.totalEnergy) {
      badges.push(html`
        <div class="area-badge energy">
          <ha-icon icon="mdi:lightning-bolt"></ha-icon>
          <span>${areaData.totalEnergy}</span>
        </div>
      `);
    }

    // Temperature badge
    if (areaData.temperature) {
      badges.push(html`
        <div class="area-badge temperature">
          <ha-icon icon="mdi:thermometer"></ha-icon>
          <span>${areaData.temperature}</span>
        </div>
      `);
    }

    // Humidity badge
    if (areaData.humidity) {
      badges.push(html`
        <div class="area-badge humidity">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span>${areaData.humidity}</span>
        </div>
      `);
    }

    return badges.length > 0 ? html`
      <div class="area-badges">
        ${badges}
      </div>
    ` : nothing;
  }

  private _renderAreaMobileQuickControls(areaId: string, entities: EntityConfig[]) {
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    const covers = entities.filter(e => e.entity_id.startsWith('cover.'));

    if (!lights.length && !switches.length && !covers.length) {
      return html`<div class="area-mobile-quick-controls empty"></div>`;
    }

    const activeLights = this._countActiveEntities(lights, 'light');
    const activeSwitches = this._countActiveEntities(switches, 'switch');
    const openCovers = this._countActiveEntities(covers, 'cover');
    const lightsActive = activeLights > 0;
    const switchesActive = activeSwitches > 0;
    const coversOpen = openCovers > 0;
    const controlsCount = [lights.length, switches.length, covers.length].filter(Boolean).length;

    return html`
      <div class="area-mobile-quick-controls count-${controlsCount}">
        ${lights.length ? html`
          <button
            class="area-quick-control light ${lightsActive ? 'active' : ''}"
            title=${lightsActive ? `Turn all lights off (${activeLights}/${lights.length} on)` : `Turn all lights on (${lights.length})`}
            aria-label=${lightsActive ? `Turn all lights off, ${activeLights} of ${lights.length} are on` : `Turn all lights on, ${lights.length} lights`}
            @click=${() => this._toggleAreaLights(areaId)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${lightsActive ? 'mdi:lightbulb' : 'mdi:lightbulb-outline'}></ha-icon>
              <span class="area-quick-count">${activeLights}/${lights.length}</span>
            </span>
            <span class="area-quick-switch" aria-hidden="true"></span>
          </button>
        ` : nothing}
        ${switches.length ? html`
          <button
            class="area-quick-control switch ${switchesActive ? 'active' : ''}"
            title=${switchesActive ? `Turn all switches off (${activeSwitches}/${switches.length} on)` : `Turn all switches on (${switches.length})`}
            aria-label=${switchesActive ? `Turn all switches off, ${activeSwitches} of ${switches.length} are on` : `Turn all switches on, ${switches.length} switches`}
            @click=${() => this._toggleAreaSwitches(areaId)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${switchesActive ? 'mdi:power-plug' : 'mdi:power-plug-off-outline'}></ha-icon>
              <span class="area-quick-count">${activeSwitches}/${switches.length}</span>
            </span>
            <span class="area-quick-switch" aria-hidden="true"></span>
          </button>
        ` : nothing}
        ${covers.length ? html`
          <button
            class="area-quick-control cover ${coversOpen ? 'active' : ''}"
            title=${coversOpen ? `Close all covers (${openCovers}/${covers.length} open)` : `Open all covers (${covers.length})`}
            aria-label=${coversOpen ? `Close all covers, ${openCovers} of ${covers.length} are open` : `Open all covers, ${covers.length} covers`}
            @click=${() => this._toggleAreaCovers(areaId, true)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${coversOpen ? 'mdi:window-shutter-open' : 'mdi:window-shutter'}></ha-icon>
              <span class="area-quick-count">${openCovers}/${covers.length}</span>
            </span>
            <span class="area-quick-direction" aria-hidden="true">
              <ha-icon icon=${coversOpen ? 'mdi:arrow-down' : 'mdi:arrow-up'}></ha-icon>
            </span>
          </button>
        ` : nothing}
      </div>
    `;
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
        class="area-mobile-round area-mobile-camera"
        title="Camera"
        aria-label="Open camera"
        @click=${() => this._showMoreInfo(camera.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `;
  }

  private _renderAreaHeaderMetrics(areaData: AreaData) {
    const metrics = [
      areaData.temperature ? this._renderMobileAreaMetric('temperature', 'Temp', areaData.temperature, 0, 30, 'area-header-metric') : nothing,
      areaData.humidity ? this._renderMobileAreaMetric('humidity', 'Humidity', areaData.humidity, 20, 90, 'area-header-metric') : nothing,
    ].filter((item) => item !== nothing);

    if (!metrics.length) return nothing;

    return html`
      <div class="area-header-metrics">
        ${metrics}
      </div>
    `;
  }

  private _renderMobileAreaMetric(
    kind: 'temperature' | 'humidity' | 'power' | 'energy',
    label: string,
    value: string,
    min?: number,
    max?: number,
    className = 'mobile-area-metric'
  ) {
    const hasRange = typeof min === 'number' && typeof max === 'number';
    const numeric = this._numericValue(value);
    const progress = hasRange && numeric !== null ? Math.max(0, Math.min(1, (numeric - min) / (max - min))) : 0.65;
    const angle = Math.round(progress * 270);
    const isHeaderMetric = className.includes('area-header-metric');
    const icon = kind === 'temperature'
      ? 'mdi:thermometer'
      : kind === 'humidity'
        ? 'mdi:water-percent'
        : kind === 'power'
          ? 'mdi:flash'
          : kind === 'energy'
            ? 'mdi:lightning-bolt'
            : 'mdi:gauge';

    return html`
      <div class="${className} ${kind}">
        <div class="metric-ring ${!hasRange || isHeaderMetric ? 'metric-icon' : ''}" style=${`--metric-angle: ${angle}deg;`}>
          ${hasRange && !isHeaderMetric
            ? html`<span class="metric-value">${value}</span>`
            : html`<ha-icon icon=${icon}></ha-icon>`}
        </div>
        <div class="metric-copy">
          <div class="metric-label">${label}</div>
          ${hasRange && !isHeaderMetric
            ? html`<div class="metric-range">${min} - ${max}</div>`
            : html`<div class="metric-reading">${value}</div>`}
        </div>
      </div>
    `;
  }

  private _renderMobileEntitiesSection(area: AreaConfig, entities: EntityConfig[]) {
    const groups = this._mobileEntityGroups(entities);
    if (!groups.length) return nothing;
    const renderedGroups = this._isMobile && !this._renderAllMobileAreaEntities && groups.length > MOBILE_INITIAL_ENTITY_GROUPS
      ? groups.slice(0, MOBILE_INITIAL_ENTITY_GROUPS)
      : groups;

    return html`
      <section class="mobile-entities-section layout-${this._mobileEntityLayout}">
        ${renderedGroups.map(group => {
          const hasActions = this._mobileControllableEntities(group.entities).length > 0;
          const gridMode = this._mobileEntityLayout === 'grid';
          const renderedEntities = this._isMobile && !this._renderAllMobileAreaEntities && group.entities.length > MOBILE_INITIAL_ENTITY_CARDS
            ? group.entities.slice(0, MOBILE_INITIAL_ENTITY_CARDS)
            : group.entities;

          return html`
            <div class="mobile-domain-group ${this._isMobileDomainMenuOpen(area.area_id, group.key) ? 'menu-open' : ''}">
              <div class="mobile-domain-header">
                <div class="mobile-domain-title">
                  <button
                    class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
                    type="button"
                    title=${gridMode ? 'Swipe cards' : 'Show all cards'}
                    aria-label=${gridMode ? 'Switch to swipe cards' : 'Show all cards'}
                    @click=${this._toggleMobileEntityLayout}
                  >
                    <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
                  </button>
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${group.name}</span>
                    <span class="mobile-domain-count">(${group.entities.length} ${group.entities.length === 1 ? 'item' : 'items'})</span>
                  </span>
                </div>
                ${hasActions ? html`
                  <button
                    class="mobile-domain-more ${this._isMobileDomainMenuOpen(area.area_id, group.key) ? 'active' : ''}"
                    type="button"
                    title=${group.name}
                    @click=${(event: Event) => this._toggleMobileDomainMenu(event, area.area_id, group)}
                  >
                    <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                  </button>
                ` : nothing}
	              </div>
	              <div class="mobile-entity-rail">
	                ${this._renderDomainCustomCardSlot(area.area_id, group.key, 0, renderedEntities.length)}
	                ${repeat(
	                  renderedEntities,
	                  entity => entity.entity_id,
	                  (entity, index) => html`
                      ${this._renderMobileEntityCard(area, entity)}
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

  private _isMobileDomainMenuOpen(areaId: string, groupKey: string): boolean {
    return this._mobileDomainMenu?.areaId === areaId && this._mobileDomainMenu.groupKey === groupKey;
  }

  private _toggleMobileDomainMenu(event: Event, areaId: string, group: MobileEntityGroup): void {
    event.stopPropagation();
    const anchor = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    if (this._isMobileDomainMenuOpen(areaId, group.key)) {
      this._closeMobileDomainMenu();
      return;
    }

    this._mobileDomainMenu = { areaId, groupKey: group.key };
    if (anchor) this._openMobileDomainMenuPortal(anchor, group);
  }

  private _closeMobileDomainMenu(): void {
    this._mobileDomainMenu = null;
    this._removeMobileDomainMenuPortal();
  }

  private _removeMobileDomainMenuPortal(): void {
    this._mobileDomainMenuPortal?.remove();
    this._mobileDomainMenuPortal = undefined;
  }

  private _openMobileDomainMenuPortal(anchor: HTMLElement, group: MobileEntityGroup): void {
    this._removeMobileDomainMenuPortal();

    if (!this._mobileControllableEntities(group.entities).length) return;

    const actions = this._mobileGroupActionLabels(group.key);
    const portal = document.createElement('div');
    portal.setAttribute('data-dd-mobile-domain-menu', '');
    Object.assign(portal.style, {
      position: 'static',
      pointerEvents: 'none',
    });

    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.setAttribute('aria-label', 'Close');
    Object.assign(backdrop.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      padding: '0',
      border: '0',
      background: 'rgba(0, 0, 0, 0.52)',
      cursor: 'default',
      pointerEvents: 'auto',
      WebkitTapHighlightColor: 'transparent',
    });
    backdrop.addEventListener('click', () => this._closeMobileDomainMenu());

    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    const rect = anchor.getBoundingClientRect();
    const menuWidth = 178;
    const menuHeight = 94;
    const viewportGap = 10;
    const left = Math.max(viewportGap, Math.min(window.innerWidth - menuWidth - viewportGap, rect.right - menuWidth));
    const preferredTop = rect.bottom + 8;
    const top = preferredTop + menuHeight > window.innerHeight - viewportGap
      ? Math.max(viewportGap, rect.top - menuHeight - 8)
      : preferredTop;

    Object.assign(menu.style, {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: '2147483647',
      width: `${menuWidth}px`,
      overflow: 'hidden',
      borderRadius: '10px',
      background: 'var(--card-background-color, #fff)',
      color: 'var(--primary-text-color, #111827)',
      boxShadow: '0 18px 42px rgba(15, 23, 42, 0.26), inset 0 0 0 1px rgba(255, 255, 255, 0.56)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      pointerEvents: 'auto',
    });
    menu.addEventListener('click', (portalEvent) => portalEvent.stopPropagation());

    menu.appendChild(this._createMobileDomainMenuButton(actions.offLabel, actions.offIcon, () => {
      void this._setMobileGroupState(group.entities, false);
    }, true));
    menu.appendChild(this._createMobileDomainMenuButton(actions.onLabel, actions.onIcon, () => {
      void this._setMobileGroupState(group.entities, true);
    }, false));

    portal.append(backdrop, menu);
    document.body.appendChild(portal);
    this._mobileDomainMenuPortal = portal;
  }

  private _createMobileDomainMenuButton(label: string, icon: string, action: () => void, hasDivider: boolean): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'menuitem');
    Object.assign(button.style, {
      width: '100%',
      minHeight: '46px',
      padding: '0 12px 0 14px',
      border: '0',
      borderBottom: hasDivider ? '1px solid rgba(15, 23, 42, 0.12)' : '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      background: 'transparent',
      color: 'inherit',
      font: 'inherit',
      fontSize: '15px',
      fontWeight: '700',
      textAlign: 'left',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
    });

    const labelNode = document.createElement('span');
    labelNode.textContent = label;

    const iconNode = document.createElement('ha-icon');
    iconNode.setAttribute('icon', icon);
    iconNode.style.setProperty('--mdc-icon-size', '22px');
    iconNode.style.flex = '0 0 auto';

    button.append(labelNode, iconNode);
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      action();
    });

    return button;
  }

  private _mobileGroupActionLabels(groupKey: string): { offLabel: string; onLabel: string; offIcon: string; onIcon: string } {
    if (groupKey === 'cover') {
      return {
        offLabel: 'Close All',
        onLabel: 'Open All',
        offIcon: 'mdi:window-shutter',
        onIcon: 'mdi:window-shutter-open',
      };
    }

    if (groupKey === 'lock') {
      return {
        offLabel: 'Lock All',
        onLabel: 'Unlock All',
        offIcon: 'mdi:lock-outline',
        onIcon: 'mdi:lock-open-variant-outline',
      };
    }

    if (groupKey === 'light') {
      return {
        offLabel: 'Turn Off All',
        onLabel: 'Turn On All',
        offIcon: 'mdi:lightbulb-off',
        onIcon: 'mdi:lightbulb',
      };
    }

    if (groupKey === 'fan') {
      return {
        offLabel: 'Turn Off All',
        onLabel: 'Turn On All',
        offIcon: 'mdi:fan-off',
        onIcon: 'mdi:fan',
      };
    }

    return {
      offLabel: 'Turn Off All',
      onLabel: 'Turn On All',
      offIcon: 'mdi:toggle-switch-off',
      onIcon: 'mdi:toggle-switch',
    };
  }

  private _mobileEntityGroups(entities: EntityConfig[]): MobileEntityGroup[] {
    const grouped = entities.reduce((acc, entity) => {
      const key = this._mobileEntityTypeKey(entity.entity_id);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entity);
      return acc;
    }, {} as Record<string, EntityConfig[]>);

    const order = ['light', 'switch', 'cover', 'climate', 'scene', 'event', 'motion', 'binary_sensor', 'sensor', 'media_player', 'fan', 'lock', 'camera', 'vacuum'];

    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        return this._mobileGroupName(a).localeCompare(this._mobileGroupName(b));
      })
      .map(([key, groupEntities]) => ({
        key,
        name: this._mobileGroupName(key),
        icon: this._mobileGroupIcon(key),
        entities: groupEntities,
      }));
  }

  private _mobileEntityTypeKey(entityId: string): string | undefined {
    const domain = entityId.split('.')[0];
    if (!domain) return undefined;
    if (domain === 'binary_sensor') {
      const deviceClass = this.hass.states[entityId]?.attributes?.device_class;
      return deviceClass === 'motion' ? 'motion' : 'binary_sensor';
    }
    return domain;
  }

  private _mobileGroupName(key: string): string {
    if (key === 'light') return 'Lighting';
    if (key === 'switch') return 'Switches';
    if (key === 'cover') return 'Covers';
    if (key === 'climate') return 'Climate Control';
    if (key === 'motion') return 'Motion';
    return getDomainName(this.hass, key);
  }

  private _mobileGroupIcon(key: string): string {
    if (key === 'motion') return 'mdi:motion-sensor';
    return getDomainIcon(key);
  }

  private _renderMobileEntityCard(area: AreaConfig, entity: EntityConfig) {
    const rawState = this.hass.states[entity.entity_id];
    if (!rawState) return nothing;

    const state = this._getEffectiveEntityState(rawState);
    const domain = entity.entity_id.split('.')[0] || 'unknown';
    const deviceClass = state.attributes?.device_class;
    const icon = this.hass.entities?.[entity.entity_id]?.icon || state.attributes?.icon || getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const name = state.attributes?.friendly_name || this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
    const active = this._isEntityActiveForUi(state, domain);
    const actionKind = this._mobileEntityActionKind(domain);
    const unavailable = ['unavailable', 'unknown'].includes(String(state.state).toLowerCase());
    const unknownIsNormal = domain === 'scene' || domain === 'event';
    const hasInlineSelect = this._mobileEntityHasInlineSelect(domain, state);
    const classes = [
      'mobile-entity-card',
      `mobile-entity-${domain}`,
      `action-${actionKind}`,
      active ? 'is-active' : 'is-off',
      hasInlineSelect ? 'has-inline-select' : '',
      unavailable && !unknownIsNormal ? 'is-unavailable' : '',
    ].join(' ');

    return html`
      <article
        class=${classes}
        style=${`--entity-color: ${this._mobileEntityColor(domain, deviceClass)};`}
        role="button"
        tabindex="0"
        aria-label=${name}
        @click=${() => this._showMoreInfo(entity.entity_id)}
        @keydown=${(event: KeyboardEvent) => this._handleMobileEntityKeydown(event, entity.entity_id)}
      >
        <div class="mobile-entity-top">
          <div class="mobile-entity-icon">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          ${this._renderMobileEntityActions(state, domain, active)}
        </div>
        <div class="mobile-entity-content">
          <div class="mobile-entity-meta">${area.name}</div>
          <div class="mobile-entity-name">${name}</div>
          <div class="mobile-entity-status">${this._mobileEntityStatusText(state, domain)}</div>
        </div>
        ${hasInlineSelect ? this._renderMobileEntitySelect(state, domain) : nothing}
      </article>
    `;
  }

  private _handleMobileEntityKeydown(event: KeyboardEvent, entityId: string): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('button, select, input, textarea, a')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private _mobileEntityHasInlineSelect(domain: string, state: any): boolean {
    return ['select', 'input_select'].includes(domain) && Array.isArray(state?.attributes?.options);
  }

  private _renderMobileEntitySelect(state: any, domain: string) {
    const options = this._mobileEntitySelectOptions(state);
    const selected = String(state?.state || '');
    const unavailable = ['unavailable', 'unknown'].includes(selected.toLowerCase()) || options.length === 0;

    return html`
      <label
        class="mobile-entity-select"
        @click=${(event: Event) => event.stopPropagation()}
        @keydown=${(event: KeyboardEvent) => event.stopPropagation()}
      >
        <select
          aria-label="Select option"
          ?disabled=${unavailable}
          @change=${(event: Event) => this._handleMobileSelectChange(event, state, domain)}
        >
          ${options.map(option => html`
            <option value=${option} ?selected=${option === selected}>${option}</option>
          `)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </label>
    `;
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

  private _renderMobileEntityActions(state: any, domain: string, active: boolean) {
    const entityId = state?.entity_id;
    const actionKind = this._mobileEntityActionKind(domain);
    const unavailable = ['unavailable', 'unknown'].includes(String(state?.state || '').toLowerCase());

    if (actionKind === 'toggle') {
      return html`
        <button
          class="mobile-entity-action mobile-entity-toggle"
          type="button"
          title=${active ? 'Turn off' : 'Turn on'}
          aria-label=${active ? 'Turn off' : 'Turn on'}
          ?disabled=${unavailable}
          @click=${(event: Event) => this._handleMobileEntityToggle(event, state, domain)}
        ></button>
      `;
    }

    if (actionKind === 'cover') {
      return this._renderMobileCoverActions(state);
    }

    if (actionKind === 'lock') {
      const unlocked = this._isEntityActiveForUi(state, domain);
      return html`
        <button
          class="mobile-entity-action mobile-lock-action ${unlocked ? 'is-unlocked' : ''}"
          type="button"
          title=${unlocked ? 'Lock' : 'Unlock'}
          aria-label=${unlocked ? 'Lock' : 'Unlock'}
          ?disabled=${unavailable}
          @click=${(event: Event) => this._handleMobileLockAction(event, state)}
        >
          <ha-icon icon=${unlocked ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline'}></ha-icon>
        </button>
      `;
    }

    if (actionKind === 'scene') {
      return html`
        <button
          class="mobile-entity-action mobile-scene-action"
          type="button"
          title="Activate"
          aria-label="Activate"
          @click=${(event: Event) => this._handleMobileSceneAction(event, state)}
        >
          <ha-icon icon="mdi:play"></ha-icon>
        </button>
      `;
    }

    return html`
      <button
        class="mobile-entity-action mobile-entity-more"
        type="button"
        title="More info"
        aria-label="More info"
        @click=${(event: Event) => this._handleMobileMoreInfo(event, entityId)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
  }

  private _renderMobileCoverActions(state: any) {
    const value = String(state?.state || '').toLowerCase();
    const unavailable = ['unavailable', 'unknown'].includes(value);
    const canOpen = this._coverSupportsFeature(state, 1);
    const canClose = this._coverSupportsFeature(state, 2);
    const canStop = this._coverSupportsFeature(state, 8);

    return html`
      <div class="mobile-cover-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${canOpen ? html`
          <button
            class="mobile-entity-action mobile-cover-action ${value === 'opening' ? 'active' : ''}"
            type="button"
            title="Open"
            aria-label="Open"
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleMobileCoverAction(event, state, 'open')}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        ` : nothing}
        ${canStop ? html`
          <button
            class="mobile-entity-action mobile-cover-action ${value === 'opening' || value === 'closing' ? 'active' : ''}"
            type="button"
            title="Stop"
            aria-label="Stop"
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleMobileCoverAction(event, state, 'stop')}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        ` : nothing}
        ${canClose ? html`
          <button
            class="mobile-entity-action mobile-cover-action ${value === 'closing' ? 'active' : ''}"
            type="button"
            title="Close"
            aria-label="Close"
            ?disabled=${unavailable}
            @click=${(event: Event) => this._handleMobileCoverAction(event, state, 'close')}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        ` : nothing}
      </div>
    `;
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
      this._showToast('Could not update entity');
      return;
    }

    this._showMoreInfo(entityId);
  }

  private async _handleMobileSelectChange(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const target = event.currentTarget as HTMLSelectElement | null;
    const entityId = state?.entity_id;
    const option = target?.value;
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
      this._showToast('Could not update selector');
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
      this._showToast('Could not update cover');
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
      this._showToast('Could not update lock');
    }
  }

  private async _handleMobileSceneAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      await this.hass.callService('scene', 'turn_on', { entity_id: entityId });
      this._showToast('Scene activated');
    } catch (err) {
      console.warn(`Failed to activate scene ${entityId}:`, err);
      this._showMoreInfo(entityId);
    }
  }

  private _handleMobileMoreInfo(event: Event, entityId?: string): void {
    event.stopPropagation();
    if (entityId) this._showMoreInfo(entityId);
  }

  private _mobileControllableEntities(entities: EntityConfig[]): EntityConfig[] {
    return entities.filter(entity => {
      const domain = entity.entity_id.split('.')[0] || '';
      return Boolean(this.hass.states[entity.entity_id]) && this._mobileEntitySupportsToggle(domain);
    });
  }

  private async _setMobileGroupState(entities: EntityConfig[], turnOn: boolean): Promise<void> {
    const grouped = this._mobileControllableEntities(entities).reduce((acc, entity) => {
      const domain = entity.entity_id.split('.')[0] || '';
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(entity.entity_id);
      return acc;
    }, {} as Record<string, string[]>);

    this._closeMobileDomainMenu();

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
      if (count) this._showToast(`${count} ${count === 1 ? 'entity' : 'entities'} turned ${turnOn ? 'on' : 'off'}`);
    } catch (err) {
      this._clearOptimisticEntityStates(affectedEntityIds);
      console.warn('Failed to run mobile group action:', err);
      this._showToast('Could not update group');
    }
  }

  private _mobileEntitySupportsToggle(domain: string): boolean {
    return ['light', 'switch', 'fan', 'input_boolean', 'cover', 'lock'].includes(domain);
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

    if (domain === 'light' && state.state === 'on' && typeof state.attributes?.brightness === 'number') {
      return `${Math.round((state.attributes.brightness / 255) * 100)}% brightness`;
    }

    if (domain === 'cover' && typeof state.attributes?.current_position === 'number') {
      return `${formatted} · ${state.attributes.current_position}%`;
    }

    if (domain === 'climate') {
      const current = state.attributes?.current_temperature;
      const target = state.attributes?.temperature;
      const unit = this.hass?.config?.unit_system?.temperature || '°C';
      if (current !== undefined && target !== undefined) return `${current}${unit} · set ${target}${unit}`;
      if (current !== undefined) return `${current}${unit}`;
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
      return 'Not activated yet';
    }

    return this._formatRelativeTime(timestamp);
  }

  private _eventLastTriggeredText(state: any): string {
    const value = String(state?.state || '').toLowerCase();
    if (value === 'unavailable') return 'Unavailable';

    const timestamp = Date.parse(state?.last_changed || state?.last_updated || '');
    if (!Number.isFinite(timestamp)) {
      return 'No events yet';
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
    return getDomainColor(domain, deviceClass);
  }

  private _numericValue(value: string): number | null {
    const match = String(value).replace(',', '.').match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private _renderToast() {
    // TODO: Implement toast state management
    return nothing;
  }

  private _renderConfirmationDialog() {
    // TODO: Implement confirmation dialog state management
    return nothing;
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

  private _getHiddenStatusCount(): string {
    // TODO: Calculate hidden status cards count
    return '';
  }

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
          const registry = this.hass.entities?.[entity.entity_id];
          if (!this.hass.states[entity.entity_id] ||
              registry?.hidden_by ||
              (registry as any)?.disabled_by ||
              registry?.entity_category === 'diagnostic' ||
              registry?.entity_category === 'config') {
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
        const registry = this.hass.entities?.[state.entity_id];
        if (registry?.hidden_by ||
            (registry as any)?.disabled_by ||
            registry?.entity_category === 'diagnostic' ||
            registry?.entity_category === 'config') {
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
      const registry = this.hass.entities?.[entity.entity_id];
      return Boolean(this.hass.states[entity.entity_id]) &&
        !(registry?.hidden_by ||
          (registry as any)?.disabled_by ||
          registry?.entity_category === 'diagnostic' ||
          registry?.entity_category === 'config');
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

    // Filter unavailable/unknown entities if configured
    if (this.config?.settings?.hide_unavailable_entities === true) {
      filteredEntities = filteredEntities.filter(entity => {
        const state = this.hass.states[entity.entity_id];
        return state && state.state !== 'unavailable' && state.state !== 'unknown';
      });
    }

    filteredEntities = filterHiddenDeviceEntities(this.hass, this.config, filteredEntities);

    return filteredEntities;
  }

  private _getUnavailableAreaEntities(areaId: string): { unavailable: string[], unknown: string[] } {
    let entities = this._getAreaEntities(areaId);
    const unavailable: string[] = [];
    const unknown: string[] = [];

    entities = entities.filter(entity => {
      const registry = this.hass.entities?.[entity.entity_id];
      return !(registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config');
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
    if (this.config?.settings?.hide_unavailable_entities !== true) {
      return nothing;
    }

    const unavailableEntities = this._getUnavailableAreaEntities(areaId);
    const totalUnavailable = unavailableEntities.unavailable.length + unavailableEntities.unknown.length;

    if (totalUnavailable === 0) {
      return nothing;
    }

    return html`
      <button
        class="unavailable-entities-icon"
        @click=${() => this._showUnavailableEntitiesModal(areaId)}
        title="Show ${totalUnavailable} hidden unavailable/unknown entities"
      >
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span class="unavailable-count">${totalUnavailable}</span>
      </button>
    `;
  }

  private _getCachedAreaData(area: AreaConfig): AreaData {
    // Check cache first
    const cached = this._areaDataCache.get(area.area_id);
    if (cached && Date.now() - cached.timestamp < this._CACHE_DURATION) {
      return cached.data;
    }

    const entities = this._getFilteredAreaEntities(area.area_id);
    const data = getAreaData(area, this.hass, entities, this.config);

    // Cache the result
    this._areaDataCache.set(area.area_id, {
      data,
      timestamp: Date.now()
    });

    return data;
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
  private _confirmDiscardSettings(): boolean {
    if (this._selectedView !== 'settings' || !this._settingsDirty) return true;
    return window.confirm('Discard unsaved dashboard settings?');
  }

  private _clearSettingsEditState(): void {
    this._pendingSettingsConfig = undefined;
    this._settingsDirty = false;
    this._settingsSaveError = '';
    this._settingsSavePending = false;
    this._settingsEditorInitialized = false;
  }

  private _selectView(view: DwainsSelectedView) {
    if (view !== 'settings' && !this._confirmDiscardSettings()) return;
    this._closeMobileDomainMenu();
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
      this._settingsDirty = false;
      this._settingsSaveError = '';
      this._settingsEditorInitialized = false;
    }
    this._syncBottomNavAreaContext();
    this._closeMobileNav();
  }

  private _selectArea(areaId: string) {
    if (!this._confirmDiscardSettings()) return;
    this._closeMobileDomainMenu();
    this._resetAreaHeaderScrollState(true);
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
    this._mobileNavOpen = !this._mobileNavOpen;
  }

  private _handleAreaNavToggle = () => {
    if (!this._isMobile) return;
    this._toggleMobileNav();
  };

  private _handleOpenSettingsEvent = () => {
    this._openDashboardSettings();
  };

  private _handleOpenHomeEvent = () => {
    this._selectView('home');
  };

  private _openMobileAreaSwitcher = () => {
    if (!this._isMobile) return;
    if (!this._confirmDiscardSettings()) return;
    this._selectedView = 'home';
    this._selectedArea = null;
    this._resetAreaHeaderScrollState(false);
    this._editMode = false;
    this._rememberAreaEditMode(null);
    this._updateUrlArea(null);
    this._clearSettingsEditState();
    this._mobileNavOpen = true;
  };

  private _openMobileDeviceSwitcher = () => {
    if (!this._isMobile) return;

    this._navigateToDeviceDomain(null);

    [160, 360, 700].forEach((delay) => {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dwains-dashboard-next-toggle-devices-nav', {
          detail: { open: true },
        }));
      }, delay);
    });
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
    const url = new URL(window.location.href);
    url.pathname = `/${segment}/devices`;
    url.search = '';
    if (domain) url.searchParams.set('dd_device', domain);
    window.history.pushState(null, '', `${url.pathname}${url.search}`);
    const ev = new Event('location-changed', { bubbles: true, composed: true });
    (ev as any).detail = { replace: false };
    window.dispatchEvent(ev);
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
            (entityId) => this._renderFavoriteTile(entityId)
          )}
        </div>
      </div>
    `;
  }

  private _renderFavoriteTile(entityId: string) {
    const state = this.hass?.states[entityId];
    if (!state) return nothing;

    return html`
      <dwains-dashboard-next-tile-host class="favorite-tile-wrapper" .hass=${this.hass} entity="${entityId}"></dwains-dashboard-next-tile-host>
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
      void editor.setConfig(this.config);
    }
  }

  private _handleSettingsConfigChanged = (event: Event): void => {
    event.stopPropagation();
    const detail = (event as CustomEvent<{ config?: Partial<DwainsDashboardConfig> }>).detail;
    this._pendingSettingsConfig = detail?.config;
    this._settingsDirty = Boolean(this._pendingSettingsConfig);
    this._settingsSaveError = '';
  };

  private _closeSettingsPage = (): void => {
    if (!this._confirmDiscardSettings()) return;
    this._clearSettingsEditState();
    this._selectView('home');
  };

  private async _saveSettingsPage(): Promise<void> {
    if (!this._pendingSettingsConfig || this._settingsSavePending || !this.hass) return;
    if (!this._canManageDashboard()) return;

    this._settingsSavePending = true;
    this._settingsSaveError = '';

    try {
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
      this._pendingSettingsConfig = undefined;
      this._settingsDirty = false;
      this._settingsSaveError = '';
      this._settingsEditorInitialized = false;
      this.requestUpdate();
    } catch (err) {
      console.error('Failed to save Dwains Dashboard settings:', err);
      this._settingsSaveError = `Could not save dashboard settings: ${String(err)}`;
    } finally {
      this._settingsSavePending = false;
    }
  }

  private _renderSettingsView(): TemplateResult {
    const canSave = this._settingsDirty && !this._settingsSavePending;

    return html`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title="Back"
            aria-label="Back"
            @click=${this._closeSettingsPage}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>Dashboard settings</h1>
            <p>Configure Dwains Dashboard Next.</p>
          </div>
          <div class="settings-page-actions">
            <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
              Back
            </button>
            <button
              type="button"
              class="settings-primary"
              ?disabled=${!canSave}
              @click=${this._saveSettingsPage}
            >
              ${this._settingsSavePending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </header>
        ${this._settingsSaveError
          ? html`<div class="settings-save-error">${this._settingsSaveError}</div>`
          : nothing}
        <div class="settings-page-editor" @config-changed=${this._handleSettingsConfigChanged}>
          <dwains-dashboard-next-strategy-editor></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-page-bottom-actions">
          <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
            Back
          </button>
          <button
            type="button"
            class="settings-primary"
            ?disabled=${!canSave}
            @click=${this._saveSettingsPage}
          >
            ${this._settingsSavePending ? 'Saving...' : 'Save'}
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
    this._closeMobileDomainMenu();
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
        this._notificationsError = 'Could not load Home Assistant persistent notifications.';
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
      this._notificationsError = 'Could not dismiss this notification.';
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
      this._notificationsError = 'Could not dismiss all notifications.';
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
      viewAllLabel: 'View all',
      onViewAll: () => this._openDeviceDomain(this._statusDeviceDomainKey(domain)),
    });
  }

  private _statusDeviceDomainKey(domain: DomainCount): string {
    return domain.deviceClass ? `${domain.domain}.${domain.deviceClass}` : domain.domain;
  }

  private _showPersonEntities() {
    // TODO: Implement person entities dialog
    showDomainEntitiesDialog(this, {
      domain: 'person',
      config: this.config
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
    const area = this.config?.areas?.find(a => a.area_id === areaId);
    const areaName = area?.name || areaId;

    // Combine unavailable and unknown entities
    const allProblematicEntities = [
      ...unavailableEntities.unavailable,
      ...unavailableEntities.unknown
    ];

    // Create a fake dialog to show the unavailable entities
    showDomainEntitiesDialog(this, {
      domain: 'unavailable',
      areaId: areaId,
      config: this.config,
      customTitle: `Hidden Unavailable Entities - ${areaName}`,
      customEntities: allProblematicEntities,
      customDescription: `These entities are currently hidden because they have 'unavailable' or 'unknown' states. You can disable this filtering in the dashboard configuration.`
    });
  }

  private async _toggleAreaLights(areaId: string, confirmAction = true) {
    const entities = this._getFilteredAreaEntities(areaId);
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    if (lights.length === 0) return;

    if (confirmAction) {
      const confirmed = await this._showConfirmation(
        'Toggle Lights',
        'Are you sure you want to toggle all lights in this area?'
      );

      if (!confirmed) return;
    }

    const allOff = this._areAllEntitiesOff(lights, 'light');

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = lights.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, allOff ? 'on' : 'off');

    try {
      await this.hass.callService('light', service, {
        entity_id: entityIds
      });

      this._showToast(`All lights turned ${allOff ? 'on' : 'off'}`);
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle lights in area ${areaId}:`, err);
      this._showToast('Could not update lights');
    }
  }

  private async _toggleAreaSwitches(areaId: string, confirmAction = true) {
    const entities = this._getFilteredAreaEntities(areaId);
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    if (switches.length === 0) return;

    if (confirmAction) {
      const confirmed = await this._showConfirmation(
        'Toggle Switches',
        'Are you sure you want to toggle all switches in this area?'
      );

      if (!confirmed) return;
    }

    const allOff = this._areAllEntitiesOff(switches, 'switch');

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = switches.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, allOff ? 'on' : 'off');

    try {
      await this.hass.callService('switch', service, {
        entity_id: entityIds
      });

      this._showToast(`All switches turned ${allOff ? 'on' : 'off'}`);
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle switches in area ${areaId}:`, err);
      this._showToast('Could not update switches');
    }
  }

  private _hasOpenCovers(covers: EntityConfig[]): boolean {
    return covers.some(entity => {
      const state = this._getEffectiveEntityState(this.hass.states[entity.entity_id]);
      const value = String(state?.state || '').toLowerCase();
      return value === 'open' || value === 'opening';
    });
  }

  private async _toggleAreaCovers(areaId: string, confirmAction = false) {
    const entities = this._getFilteredAreaEntities(areaId);
    const covers = entities.filter(e => e.entity_id.startsWith('cover.'));
    if (covers.length === 0) return;

    const hasOpen = this._hasOpenCovers(covers);

    if (confirmAction) {
      const confirmed = await this._showConfirmation(
        'Toggle Covers',
        `Are you sure you want to ${hasOpen ? 'close' : 'open'} all covers in this area?`
      );

      if (!confirmed) return;
    }

    const service = hasOpen ? 'close_cover' : 'open_cover';
    const entityIds = covers.map(e => e.entity_id);

    this._setOptimisticEntityStates(entityIds, hasOpen ? 'closed' : 'open');

    try {
      await this.hass.callService('cover', service, {
        entity_id: entityIds
      });

      this._showToast(`All covers ${hasOpen ? 'closed' : 'opened'}`);
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to toggle covers in area ${areaId}:`, err);
      this._showToast('Could not update covers');
    }
  }

  private async _showConfirmation(title: string, message: string): Promise<boolean> {
    // TODO: Implement proper confirmation dialog
    return confirm(`${title}\n\n${message}`);
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
