import { LitElement, html, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import memoizeOne from 'memoize-one';

import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, AreaConfig, EntityConfig, AreaData, AreaCustomCard, EntitiesDisplay, HomeCustomCard, HomeInformationCardKey, HomeSectionKey, MasterActionConfirmationDomain } from '../types/strategy';
import { getAreaData, clearAreaDataCache } from '../utils/area';
import { AreaEntityResolver } from '../utils/area-entity-resolver';
import { ManagedSubscription } from '../utils/managed-subscription';
import { updateStoredDashboardStrategy } from '../utils/dashboard-config-store';
import { formatClock, msUntilNextMinute } from '../utils/clock';
import { isHiddenAsUnavailable, splitHiddenUnavailableEntities } from '../utils/entity-availability';
import { getAreaConfigMap, getHiddenPersonIdSet, resolveStatusEntityAreaId } from '../utils/entity-lookups';
import { getDomainStates } from '../utils/state-index';
import {
  hasRelevantStateChange,
  hassChangedOutsideStates,
  isHomeRelevantStateChange,
  isUpdateEntityStateChange,
} from '../utils/state-relevance';
import { getAreaIcon, getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { getStatusDomains, type DomainCount as StatusDomainCount } from '../utils/header-status-domains';
import { getDeviceClassName, getDomainName } from '../utils/domain-names';
import { filterHiddenDeviceEntities } from '../utils/device-admission';
import { findReplacementAssignment, resolveEntityCardConfig } from '../utils/blueprint-replacements';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import { areaEntityDeviceLabel, sortAreas, stripAreaFromEntityName } from '../utils/area-entities';
import { navigateHomeAssistant } from '../utils/navigation';
import { syncHassDarkThemeAttribute } from '../utils/theme';
import { HOME_SECTION_META, normalizeHiddenHomeInformationCards, normalizeHiddenHomeSections, normalizeHomeSectionsOrder } from '../utils/home-sections';
import { buildHousePowerUsage } from '../utils/power-usage';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../utils/unit-format';
import { showDomainEntitiesDialog } from './utils/show-domain-entities-dialog';
import { showCardEditorDialog } from './utils/show-card-editor-dialog';
import { layoutCardStyles } from './styles/layout-card-styles';
import { TRANSLATIONS_LOADED_EVENT } from '../i18n';

// The settings editor is large and only needed on the settings page.
const loadStrategyEditor = () => import('./dwains-dashboard-strategy-editor');
import { ensureBottomNav } from './dwains-bottom-nav';
import './utils/dd-card-host';
import './utils/dd-tile-host';
import { fireEvent } from './utils/fire-event';
import { closeConfirmDialog, showConfirmDialog } from './utils/confirm-dialog';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import { getCollator, getRelativeTimeFormat } from '../utils/intl-cache';
import {
  masterActionConfirmationEnabled,
  normalizeMasterActionConfirmationDomain,
} from '../utils/master-action-confirmations';

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
// Update the clock just after the minute changes.
const CLOCK_TICK_MARGIN_MS = 50;
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
const ICON_ARROW_LEFT = 'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z';

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

@customElement('dwains-dashboard-next-layout-card')
export class DwainsLayoutCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DwainsDashboardConfig;

  private _waitingForHaMarkdown = false;

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  private _tp = (key: string, count: number, vars?: Record<string, string | number>) =>
    ddLocalizePlural(this.hass, key, count, vars);

  @state() private _selectedArea: string | null = null;
  @state() private _selectedView: DwainsSelectedView | null = null;
  @state() private _isMobile = false;
  @state() private _headerExpanded = false;
  @state() private _headerCompact = false;
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
  @state() private _settingsDirty = false;
  @state() private _settingsSavePending = false;
  @state() private _settingsSaveError = '';

  // Performance: Home Assistant sets `hass` on every state change of any
  // entity. Derived data is cached on the identity of its inputs, so it is
  // computed at most once per hass object and config.
  private _areaResolver = new AreaEntityResolver();
  private _hostedCards?: Element[];
  private _clockTimer?: number;
  private _resizeObserver?: ResizeObserver;
  private _persistentNotificationsSubscription = new ManagedSubscription();
  private _persistentNotificationsLoaded = false;
  private _homeSummariesLoaded = false;
  private _homeSummariesRefreshInterval?: number;
  private _favoriteSuggestionsLoaded = false;
  private _favoriteSuggestionsLoading = false;
  private _areaHeaderScrollRaf?: number;
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
      !isHiddenAsUnavailable(state) &&
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
    // A disconnected card loads and subscribes again when it is connected again.
    if (!this.isConnected) return;

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

  static override styles = layoutCardStyles;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(TRANSLATIONS_LOADED_EVENT, this._handleTranslationsLoaded);
    this._syncThemeAttribute(true);
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
    // After navigating away and back the card is connected again: subscribe
    // again without waiting for a hass update that needs a render.
    if (this.hass && this.config) {
      this._ensurePersistentNotificationsFeature();
      this._ensureHomeSummariesRefresh();
    }
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
      if (this._clockSettingsChanged(changedProps.get('hass') as HomeAssistant | undefined, this.hass)) {
        this._updateTime();
      }
      this._syncThemeAttribute();
      // Houd de mobiele onderbalk levend en up-to-date.
      ensureBottomNav(this.hass, this.config?.settings);
      this._syncBottomNavAreaContext();
      this._reconcileOptimisticEntityStates();
      if (!this._canManageDashboard() && this._editMode) {
        this._editMode = false;
        this._rememberAreaEditMode(null);
      }
    }
  }

  private _handleTranslationsLoaded = (): void => {
    this.requestUpdate();
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(TRANSLATIONS_LOADED_EVENT, this._handleTranslationsLoaded);
    window.removeEventListener('dwains-dashboard-next-toggle-area-nav', this._handleAreaNavToggle);
    window.removeEventListener('dwains-dashboard-next-open-settings', this._handleOpenSettingsEvent);
    window.removeEventListener('dwains-dashboard-next-open-home', this._handleOpenHomeEvent);
    window.removeEventListener('pointermove', this._handleSidebarResizeMove);
    window.removeEventListener('pointerup', this._handleSidebarResizeEnd);
    window.removeEventListener('pointercancel', this._handleSidebarResizeEnd);
    this._persistentNotificationsSubscription.stop();
    this._persistentNotificationsLoaded = false;
    this._cleanupEventListeners();
    this._cleanupObservers();
    this._stopTimeUpdate();
    this._stopHomeSummariesRefresh();
    if (this._areaHeaderScrollRaf) {
      cancelAnimationFrame(this._areaHeaderScrollRaf);
      this._areaHeaderScrollRaf = undefined;
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
    closeConfirmDialog(this);
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
    this._stopTimeUpdate();
    this._updateTime();
    this._scheduleNextTimeUpdate();
  }

  /** Ticks on the minute boundary, so the clock never lags up to a minute behind. */
  private _scheduleNextTimeUpdate(): void {
    this._clockTimer = window.setTimeout(() => {
      this._clockTimer = undefined;
      this._updateTime();
      this._scheduleNextTimeUpdate();
    }, msUntilNextMinute(Date.now()) + CLOCK_TICK_MARGIN_MS);
  }

  private _stopTimeUpdate(): void {
    if (this._clockTimer !== undefined) {
      window.clearTimeout(this._clockTimer);
      this._clockTimer = undefined;
    }
  }

  /** Time and date in the time format and time zone of the user profile. */
  private _updateTime() {
    const clock = formatClock(new Date(), {
      language: ddLocale(this.hass),
      time_format: this.hass?.locale?.time_format,
      time_zone: this.hass?.locale?.time_zone,
    }, this.hass?.config?.time_zone);
    this._currentTime = clock.time;
    this._currentDate = clock.date;
  }

  /** Whether the language, time format or time zone of the clock changed. */
  private _clockSettingsChanged(oldHass: HomeAssistant | undefined, newHass: HomeAssistant): boolean {
    return !oldHass ||
      oldHass.language !== newHass.language ||
      oldHass.locale !== newHass.locale ||
      oldHass.config?.time_zone !== newHass.config?.time_zone;
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

    // For hass updates, only update if something the current view shows changed
    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;

      // Another property changed in the same update: always render that.
      if (changedProps.size > 1) return true;

      if (this._isRelevantHassChange(oldHass, this.hass)) return true;

      this._handleSkippedHassUpdate();
      return false;
    }

    return true;
  }

  /**
   * Work that willUpdate() and updated() do for every hass update and that does
   * not need a render: keep the theme and the bottom navigation in sync and give
   * the hosted Home Assistant cards the new hass.
   */
  private _handleSkippedHassUpdate(): void {
    this._syncThemeAttribute();
    ensureBottomNav(this.hass, this.config?.settings);
    this._syncBottomNavAreaContext();
    this._forwardHassToHostedCards();

    if (Object.keys(this._optimisticEntityStates).length) {
      // Reactive properties can not be changed while shouldUpdate() runs.
      queueMicrotask(() => this._reconcileOptimisticEntityStates());
    }
  }

  private _forwardHassToHostedCards(): void {
    const root = this.renderRoot;
    if (!root) return;

    // Hosts only change when this card renders, so the lookup is kept until the next render.
    this._hostedCards ??= Array.from(
      root.querySelectorAll('dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host')
    );
    for (const card of this._hostedCards as Array<Element & { hass?: HomeAssistant }>) {
      if (card.hass !== this.hass) card.hass = this.hass;
    }
  }

  protected override updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    this._hostedCards = undefined;

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
      this._ensureHomeSummariesRefresh();
      this._ensureFavoriteSuggestionsFeature();
    }

    if (changedProps.has('config')) {
      if (this._showNotificationsUi()) {
        this._ensurePersistentNotificationsFeature();
      } else {
        this._notificationsOpen = false;
        this._persistentNotificationsSubscription.stop();
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

  private _syncThemeAttribute(force = false): void {
    syncHassDarkThemeAttribute(this, this.hass, force);
  }

  /** Whether a hass update can change what the current view shows. */
  private _isRelevantHassChange(oldHass: HomeAssistant, newHass: HomeAssistant): boolean {
    if (!this.config) return false;

    // Registries, user, language, themes, formatters and so on.
    if (hassChangedOutsideStates(oldHass, newHass)) return true;

    if (this._selectedView === 'settings') {
      return hasRelevantStateChange(oldHass.states, newHass.states, isUpdateEntityStateChange);
    }

    if (this._selectedView === 'area' && this._selectedArea) {
      const areaEntityIds = this._areaRelevantEntityIds(this._selectedArea);
      return hasRelevantStateChange(oldHass.states, newHass.states, (entityId, oldState, newState) =>
        !oldState ||
        !newState ||
        areaEntityIds.has(entityId) ||
        isUpdateEntityStateChange(entityId, oldState, newState)
      );
    }

    if (this._selectedView === 'home') {
      const explicitEntityIds = this._homeExplicitEntityIds(
        this.config,
        newHass.areas,
        this._suggestedFavoriteEntities
      );
      return hasRelevantStateChange(oldHass.states, newHass.states, (entityId, oldState, newState) =>
        isHomeRelevantStateChange(entityId, oldState, newState, explicitEntityIds)
      );
    }

    return true;
  }

  /** Entities of the selected area plus its temperature and humidity sensors. */
  private _areaRelevantEntityIds(areaId: string): ReadonlySet<string> {
    const area = getAreaConfigMap(this.config).get(areaId);
    const areaRegistry = this.hass?.areas?.[areaId] as any;
    return this._areaRelevantEntityIdSet(
      this._getAreaEntities(areaId),
      areaRegistry?.temperature_entity_id || area?.temperature_entity_id || '',
      areaRegistry?.humidity_entity_id || area?.humidity_entity_id || ''
    );
  }

  private _areaRelevantEntityIdSet = memoizeOne((
    entities: EntityConfig[],
    temperatureEntityId: string,
    humidityEntityId: string
  ): ReadonlySet<string> => {
    const ids = new Set(entities.map(entity => entity.entity_id));
    if (temperatureEntityId) ids.add(temperatureEntityId);
    if (humidityEntityId) ids.add(humidityEntityId);
    return ids;
  });

  /**
   * Entities the Home view shows directly, whatever their domain: favorites
   * (manual and suggested), the weather and alarm entities and the temperature
   * and humidity sensors of every area.
   */
  private _homeExplicitEntityIds = memoizeOne((
    config: DwainsDashboardConfig,
    areasRegistry: HomeAssistant['areas'] | undefined,
    suggestedFavorites: string[]
  ): ReadonlySet<string> => {
    const ids = new Set<string>([...(config.favorites || []), ...suggestedFavorites]);
    if (config.settings?.weather_entity_id) ids.add(config.settings.weather_entity_id);
    if (config.settings?.alarm_entity_id) ids.add(config.settings.alarm_entity_id);
    const addSensor = (entityId: unknown) => {
      if (typeof entityId === 'string' && entityId) ids.add(entityId);
    };
    (config.areas || []).forEach(area => {
      addSensor(area.temperature_entity_id);
      addSensor(area.humidity_entity_id);
    });
    Object.values(areasRegistry || {}).forEach((area: any) => {
      addSensor(area?.temperature_entity_id);
      addSensor(area?.humidity_entity_id);
    });
    return ids;
  });

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
              <span>${this._t('home.notifications')}</span>
            </div>
            <div class="notifications-subtitle">
              ${hasNotifications
                ? `${count} ${this._t(count === 1 ? 'home.notification' : 'home.notifications').toLocaleLowerCase()}`
                : this._t('home.notifications_description')}
            </div>
          </div>
          <div class="notifications-actions">
            ${hasNotifications ? html`
              <button
                class="notifications-icon-button"
                type="button"
                title=${this._t('common.dismiss_all')}
                @click=${this._dismissAllPersistentNotifications}
              >
                <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
              </button>
            ` : nothing}
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t('common.refresh')}
              @click=${() => this._loadPersistentNotifications(true)}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t('common.close')}
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
          <div class="notification-title">${notification.title || this._t('home.notification')}</div>
          <div class="notification-message">${this._renderNotificationMessage(notification.message)}</div>
          ${notification.created_at ? html`
            <div class="notification-date">${this._formatNotificationDate(notification.created_at)}</div>
          ` : nothing}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title=${this._t('common.dismiss')}
          @click=${() => this._dismissPersistentNotification(notification.notification_id)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </article>
    `;
  }

  /**
   * Notification messages are markdown (links like [text](url) are common).
   * Home Assistant's own <ha-markdown> renders and sanitizes them; it is not
   * always loaded yet, so fall back to plain text and re-render once it is.
   */
  private _renderNotificationMessage(message: string) {
    if (customElements.get('ha-markdown')) {
      return html`<ha-markdown class="notification-markdown" breaks .content=${message}></ha-markdown>`;
    }
    if (!this._waitingForHaMarkdown) {
      this._waitingForHaMarkdown = true;
      void customElements.whenDefined('ha-markdown').then(() => this.requestUpdate());
    }
    return message;
  }

  private _renderSidebar() {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen
    };
    const showNotifications = this._showNotificationsUi();
    const hasNotifications = showNotifications && this._persistentNotifications.length > 0;

    return html`
      <nav class=${classMap(classes)} @scroll=${this._handleSidebarScroll}>
        <div class="area-list">
          <div
            class="area-button home-button ${this._selectedView === 'home' ? 'selected' : ''} ${hasNotifications ? 'has-notifications' : ''}"
          >
            <button
              class="area-button-action"
              type="button"
              aria-label=${this._t('sidebar.home')}
              aria-current=${this._selectedView === 'home' ? 'page' : nothing}
              @click=${() => this._selectView('home')}
            ></button>
            <div class="area-icon" aria-hidden="true">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info" aria-hidden="true">
              <div class="area-name">${this._t('sidebar.home')}</div>
            </div>
            ${this._renderHomeNotificationShortcut()}
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
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

    const label = `${count} ${this._t(count === 1 ? 'home.notification' : 'home.notifications').toLocaleLowerCase()}`;
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

    // Use the sortAreas helper from the area-entities utils. The result is shared, do not mutate it.
    return this._visibleSortedAreas(this.config.areas, this.config.areas_display, ddLocale(this.hass));
  }

  private _visibleSortedAreas = memoizeOne((
    areas: AreaConfig[],
    areasDisplay: DwainsDashboardConfig['areas_display'],
    locale: string
  ): AreaConfig[] => sortAreas(areas, areasDisplay, locale));

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
    const floorCollator = getCollator(ddLocale(this.hass), { numeric: true, sensitivity: 'base' });
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

  private _renderAreaButton(area: any) {
    const areaData = this._getCachedAreaData(area);
    const isSelected = this._selectedArea === area.area_id;
    const hasPicture = area.picture ? true : false;
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';

    const sensors = [
      areaData.temperature,
      areaData.humidity,
      areaData.wattage
    ].filter(Boolean);
    const sensorsText = sensors.join(' • ');
    const lightsOn = areaData.domains.light?.on || 0;
    const lightToggleLabel = this._tp('sidebar.turn_off_area_lights', lightsOn, { area: area.name });

    // The area item is a container with a full-size select button and, as a
    // sibling, the light toggle; buttons are never nested.
        return html`
          <div
            class="area-button ${isSelected ? 'selected' : ''} ${hasPicture ? 'has-picture' : ''} ${pictureContrastClass}"
          >
            <button
              class="area-button-action"
              type="button"
              aria-label=${[area.name, ...sensors].join(', ')}
              aria-current=${this._selectedView === 'area' && isSelected ? 'page' : nothing}
              @click=${() => this._selectArea(area.area_id)}
            ></button>
            ${hasPicture ? html`
              <div class="area-background" style="background-image: url('${area.picture}');"></div>
            ` : nothing}

            <div class="area-content">
              <!-- Top section: Name and sensors -->
              <div class="area-top-section" aria-hidden="true">
              <div class="area-name">${area.name}</div>
              ${sensorsText ? html`
                <div class="area-sensors">${sensorsText}</div>
              ` : nothing}
            </div>

              <!-- Bottom section: Icon and badges -->
              <div class="area-bottom-section">
                <!-- Left: Main area icon -->
                <div class="area-main-icon" aria-hidden="true">
                  <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                </div>

                <!-- Right: Info badges -->
                <div class="area-info-badges">
                  ${lightsOn > 0 ? html`
                    <button
                      class="info-badge light clickable area-light-toggle"
                      type="button"
                      style=${this._domainBadgeStyle('light')}
                      title=${lightToggleLabel}
                      aria-label=${lightToggleLabel}
                      @click=${(e: Event) => this._handleLightToggle(e, area.area_id)}
                    >
                      <ha-icon icon=${getDomainIcon('light')}></ha-icon>
                      <span class="badge-count">${lightsOn}</span>
                    </button>
                  ` : nothing}

                  ${areaData.domains.switch && areaData.domains.switch.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge switch" style=${this._domainBadgeStyle('switch')}>
                      <ha-icon icon=${getDomainIcon('switch')}></ha-icon>
                      <span class="badge-count">${areaData.domains.switch.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.climate && areaData.domains.climate.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge climate" style=${this._domainBadgeStyle('climate')}>
                      <ha-icon icon=${getDomainIcon('climate')}></ha-icon>
                      <span class="badge-count">${areaData.domains.climate.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.media_player && areaData.domains.media_player.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge media_player" style=${this._domainBadgeStyle('media_player')}>
                      <ha-icon icon=${getDomainIcon('media_player')}></ha-icon>
                      <span class="badge-count">${areaData.domains.media_player.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.cover && areaData.domains.cover.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge cover" style=${this._domainBadgeStyle('cover')}>
                      <ha-icon icon=${getDomainIcon('cover')}></ha-icon>
                      <span class="badge-count">${areaData.domains.cover.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.fan && areaData.domains.fan.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge fan" style=${this._domainBadgeStyle('fan')}>
                      <ha-icon icon=${getDomainIcon('fan')}></ha-icon>
                      <span class="badge-count">${areaData.domains.fan.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.motion && areaData.domains.motion.on > 0 ? html`
                    <span aria-hidden="true" class="info-badge motion" style=${this._domainBadgeStyle('binary_sensor', 'motion')}>
                      <ha-icon icon=${getDeviceClassIcon('binary_sensor', 'motion')}></ha-icon>
                      <span class="badge-count">${areaData.domains.motion.on}</span>
                    </span>
                  ` : nothing}

            ${areaData.alerts.length > 0 ? html`
                    <span aria-hidden="true" class="info-badge alerts">
                      <ha-icon icon="mdi:alert-circle"></ha-icon>
                      <span class="badge-count">${areaData.alerts.length}</span>
                    </span>
            ` : nothing}
                </div>
              </div>
            </div>
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </div>
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
      <button
        class="weather-compact"
        type="button"
        title=${this._weatherTitle(weatherEntity)}
        aria-label=${this._weatherTitle(weatherEntity)}
        @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
      >
        <span class="weather-icon-compact">
          <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
        </span>
        <span class="weather-temp-compact">
          ${temperature}
        </span>
      </button>
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
                role="button"
                tabindex="0"
                @click=${() => this._handleStatusCardClick(domain)}
                @keydown=${(event: KeyboardEvent) => this._handleActivationKeydown(event, () => this._handleStatusCardClick(domain))}
                data-domain=${domain.domain}
                title=${this._statusCardTitle(domain)}
                aria-label=${this._statusCardAccessibleLabel(domain)}
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
        type="button"
        aria-expanded=${this._headerExpanded ? 'true' : 'false'}
        aria-label=${this._t(this._headerExpanded ? 'favorites.hide_header' : 'favorites.show_header')}
        title=${this._t(this._headerExpanded ? 'favorites.hide_header' : 'favorites.show_header')}
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
        return areaName ? `${activeLabel.singular} · ${areaName}` : activeLabel.singular;
      }
      return activeLabel.plural;
    }

    // Bij precies 1 actief: toon de ruimte ("Motion in Slaapkamer").
    if (domain.domain !== 'person' && domain.count === 1 && domain.entities?.length === 1) {
      const areaName = this._entityAreaName(domain.entities[0]!);
      if (areaName) return `${domain.name} · ${areaName}`;
    }
    return domain.name;
  }

  // The card title plus the value or count that is only shown visually.
  private _statusCardAccessibleLabel(domain: DomainCount): string {
    const title = this._statusCardTitle(domain);
    if (domain.value) return `${title}: ${domain.value}`;
    if (domain.count > 0) return `${title}: ${domain.count}`;
    return title;
  }

  private _statusLabel(key: string, count: number, plural = true): string {
    const localized = plural ? this._tp(key, count) : this._t(key, { count });
    const prefix = String(count);
    if (!localized.startsWith(prefix)) return localized;
    // "{count} lights on" becomes "Lights on"; the count is shown in its own badge.
    const label = localized.slice(prefix.length).trim();
    return label.charAt(0).toLocaleUpperCase() + label.slice(1);
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
    const areaId = resolveStatusEntityAreaId(this.hass, this.config, entityId);
    return areaId ? getAreaConfigMap(this.config).get(areaId)?.name : undefined;
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
      case 'todos':
        return this._renderHomeTodos();
      case 'custom_cards':
        return this._renderHomeCustomCards();
      case 'favorites':
        return this._renderFavorites();
      default:
        return nothing;
    }
  }

  /**
   * Mobile heading of a Home section: the section's own icon and title, with
   * the grid/carousel toggle and "See all" as small buttons at the end.
   */
  private _renderMobileSectionHeading(
    section: HomeSectionKey,
    title: string,
    options: {
      toggle?: { gridMode: boolean; title: string; label: string; onToggle: (event: Event) => void };
      onSeeAll?: (event: Event) => void;
    } = {}
  ) {
    const { toggle, onSeeAll } = options;
    return html`
      <div class="mobile-section-heading">
        <div class="mobile-section-title">
          <span class="mobile-section-icon" aria-hidden="true">
            <ha-icon icon=${HOME_SECTION_META[section].icon}></ha-icon>
          </span>
          <span class="mobile-section-title-label">${title}</span>
        </div>
        ${toggle || onSeeAll ? html`
          <div class="mobile-section-tools">
            ${toggle ? html`
              <button
                class="mobile-section-toggle"
                type="button"
                title=${toggle.title}
                aria-label=${toggle.label}
                @click=${toggle.onToggle}
              >
                <ha-icon icon=${toggle.gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
              </button>
            ` : nothing}
            ${onSeeAll ? html`
              <button class="mobile-section-action" type="button" @click=${onSeeAll}>
                <span>${this._t('common.see_all')}</span>
                <ha-icon icon="mdi:chevron-right"></ha-icon>
              </button>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
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
        ${this._renderMobileSectionHeading('summaries', this._t('home.summaries'))}
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
        ${this._renderMobileSectionHeading('todos', sectionTitle)}
        <div class="home-todos-grid">
          ${repeat(
            todoEntities,
            entityId => entityId,
            entityId => html`
              <div class="home-todo-card" data-entity=${entityId}>
                <dwains-dashboard-next-card-host
                  eager
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
        ${this._renderMobileSectionHeading('custom_cards', sectionTitle)}
        <div class="home-custom-cards-grid">
          ${repeat(
            cards,
            entry => entry.id,
            entry => html`
              <div class="home-custom-card">
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
    if (!this.hass) return [];
    return this._homeTodoEntities(this.hass.states, this.hass.entities, this.hass.language);
  }

  private _homeTodoEntities = memoizeOne((
    states: HomeAssistant['states'],
    registry: HomeAssistant['entities'],
    language: string
  ): string[] => {
    // Same order as `a.localeCompare(b, language)`.
    const collator = getCollator(language);
    return getDomainStates(states, 'todo')
      .map(state => state.entity_id)
      .filter(entityId => entityId.startsWith('todo.'))
      .filter(entityId => {
        const state = states[entityId];
        const entry = registry?.[entityId] as any;
        if (!state) return false;
        return !['unavailable', 'unknown'].includes(String(state.state).toLowerCase()) &&
          !entry?.hidden_by &&
          !entry?.disabled_by &&
          entry?.entity_category !== 'diagnostic' &&
          entry?.entity_category !== 'config';
      })
      .sort((left, right) => {
        const leftName = states[left]?.attributes?.friendly_name || registry?.[left]?.name || left;
        const rightName = states[right]?.attributes?.friendly_name || registry?.[right]?.name || right;
        return collator.compare(String(leftName), String(rightName));
      });
  });

  /**
   * Repairs, updates and discovered devices all open /config pages that only
   * administrators can use. Other users do not see them, and they do not count
   * towards the "items need attention" line in the greeting either.
   */
  private _getHomeSummaryCards(): HomeSummaryCard[] {
    if (!this.hass?.user?.is_admin) return [];

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
    const userInitials = this._userInitials(this.hass?.user?.name || '');
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
                  : userInitials
                    ? html`<span class="welcome-avatar-initials" aria-hidden="true">${userInitials}</span>`
                    : html`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy">
                <div class="welcome-text">
                  <span class="welcome-greeting">${greeting},</span>
                  <span class="welcome-name">${userName}</span>
                  <span class="welcome-title">${greeting}, ${userName}</span>
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
                  title=${this._t('home.notifications')}
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
                <button
                  class="welcome-weather"
                  type="button"
                  title=${this._weatherTitle(weatherEntity)}
                  aria-label=${this._weatherTitle(weatherEntity)}
                  @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
                >
                  <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
                  <span class="weather-temp">${weatherTemperature}</span>
                  <span class="weather-label">${this._t('home.outside')}</span>
                </button>
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
      this._homeInformationCardVisible('climate') ? this._renderHouseClimateStatusCard('indoor') : nothing,
      this._homeInformationCardVisible('outdoor_climate') ? this._renderHouseClimateStatusCard('outdoor') : nothing,
      this._homeInformationCardVisible('power') ? this._renderHousePowerStatusCard() : nothing,
      ...visibleDomains.map(domain => html`
        <div
          class="home-status-card ${domain.domain} ${domain.value ? 'has-value' : ''}"
          style=${this._domainStatusStyle(domain.domain, domain.deviceClass)}
          role="button"
          tabindex="0"
          @click=${() => this._handleStatusCardClick(domain)}
          @keydown=${(event: KeyboardEvent) => this._handleActivationKeydown(event, () => this._handleStatusCardClick(domain))}
          data-domain=${domain.domain}
          title=${this._statusCardTitle(domain)}
          aria-label=${this._statusCardAccessibleLabel(domain)}
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
          <span>${this._t('home.house_information')}</span>
        </div>
        ${this._renderMobileSectionHeading('devices', this._t('home.house_information'), {
          toggle: {
            gridMode,
            title: gridMode ? this._t('home.swipe_house_information') : this._t('home.show_all_house_information'),
            label: gridMode ? this._t('home.switch_house_information_swipe') : this._t('home.show_all_house_information'),
            onToggle: this._toggleMobileHomeDevicesLayout,
          },
          onSeeAll: this._openMobileDeviceSwitcher,
        })}
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
          <span>${this._t('home.cameras')}</span>
        </div>
        ${this._renderMobileSectionHeading('cameras', this._t('home.cameras'), {
          toggle: {
            gridMode,
            title: gridMode ? this._t('home.swipe_cameras') : this._t('home.show_all_cameras'),
            label: gridMode ? this._t('home.switch_cameras_swipe') : this._t('home.show_all_cameras'),
            onToggle: this._toggleMobileHomeCamerasLayout,
          },
        })}
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
        @click=${() => this._openDeviceDomain('energy')}
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
        class="home-status-card house-climate-card sensor ${scope}"
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
    this._handleActivationKeydown(event, () => this._openDeviceDomain('energy'));
  };

  private _handleHouseClimateKeydown(event: KeyboardEvent, scope: HouseClimateScope): void {
    this._handleActivationKeydown(event, () => this._showHouseClimateEntities(undefined, scope));
  }

  // Enter/Space activation for role="button" cards. Keys pressed on a nested
  // control (a real button inside the card) are left to that control.
  private _handleActivationKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    action();
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
      ? metrics[0]?.label || this._houseClimateTitle(scope)
      : this._houseClimateTitle(scope);

    showDomainEntitiesDialog(this, {
      domain: 'sensor',
      config: this.config,
      entityIds,
      customTitle: title,
      viewAllLabel: this._t('home.view_sensors'),
      onViewAll: () => this._openDeviceDomain('sensor'),
    });
  }

  private _renderHousePersonsStatusCard() {
    const personEntities = this._getVisiblePersonEntities();
    const subtitle = personEntities.length
      ? this._personPresenceSummary(personEntities) || this._t('person.no_location')
      : this._t('home.no_people');
    // People without location data go last, so the visible slots show useful states.
    const orderedPersons = [
      ...personEntities.filter(person => !this._isPersonLocationUnknown(person)),
      ...personEntities.filter(person => this._isPersonLocationUnknown(person)),
    ];
    // Four slots: with more people, show three and a "+N" chip in the last slot.
    const maxVisible = 4;
    const visiblePersons = orderedPersons.length > maxVisible
      ? orderedPersons.slice(0, maxVisible - 1)
      : orderedPersons;
    const hiddenCount = orderedPersons.length - visiblePersons.length;

    return html`
      <div
        class="home-status-card house-persons-card person"
        role="button"
        tabindex="0"
        aria-label=${`${this._t('home.people')}: ${subtitle}`}
        @click=${() => this._openDeviceDomain('person')}
        @keydown=${(event: KeyboardEvent) => this._handleActivationKeydown(event, () => this._openDeviceDomain('person'))}
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
              visiblePersons,
              person => person.entity_id,
              person => this._renderHousePersonMini(person)
            )}
            ${hiddenCount > 0 ? html`
              <button
                class="house-persons-more"
                type="button"
                title=${this._tp('home.more_people', hiddenCount)}
                aria-label=${this._tp('home.more_people', hiddenCount)}
                @click=${(event: Event) => {
                  event.stopPropagation();
                  this._openDeviceDomain('person');
                }}
              >+${hiddenCount}</button>
            ` : nothing}
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
    const presenceClass = this._isPersonLocationUnknown(person)
      ? 'is-unknown'
      : person.state === 'home'
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
    return this._visiblePersonEntities(this.hass.states, this.hass.entities, getHiddenPersonIdSet(this.config));
  }

  private _visiblePersonEntities = memoizeOne((
    states: HomeAssistant['states'],
    registry: HomeAssistant['entities'],
    hiddenPersons: ReadonlySet<string>
  ): HassEntity[] => getDomainStates(states, 'person').filter(
    entity =>
      entity.entity_id.startsWith('person.') &&
      !hiddenPersons.has(entity.entity_id) &&
      !registry?.[entity.entity_id]?.hidden_by
  ));

  /** A person without a (working) device tracker reports unknown or unavailable. */
  private _isPersonLocationUnknown(person: any): boolean {
    const state = String(person?.state ?? '').toLowerCase();
    return !state || state === 'unknown' || state === 'unavailable';
  }

  /**
   * "x/y home" where y only counts people with a known location. People
   * without location data are neither home nor away, so counting them would
   * make the house look emptier than it is. Returns '' when nobody has a
   * known location.
   */
  private _personPresenceSummary(personEntities: any[]): string {
    const known = personEntities.filter(person => !this._isPersonLocationUnknown(person));
    if (!known.length) return '';
    const homeCount = known.filter(person => person.state === 'home').length;
    return `${homeCount}/${known.length} ${this._t('person.home')}`;
  }

  private _formatPersonState(person: any): string {
    if (this._isPersonLocationUnknown(person)) return this._t('person.no_location');
    if (person.state === 'home') return this._t('person.home');
    if (person.state === 'not_home') return this._t('person.away');

    return String(person.state)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private _getHomeSnapshotText(weatherEntity?: any): string {
    const parts: string[] = [];
    const personEntities = this._getVisiblePersonEntities();

    const presence = this._personPresenceSummary(personEntities);
    if (presence) {
      parts.push(presence);
    }

    if (this._showNotificationsUi() && this._persistentNotifications.length) {
      const count = this._persistentNotifications.length;
      const notificationLabel = this._t(count === 1 ? 'home.notification' : 'home.notifications');
      const localizedNotification = notificationLabel
        ? notificationLabel.charAt(0).toLocaleLowerCase() + notificationLabel.slice(1)
        : notificationLabel;
      parts.push(`${count} ${localizedNotification}`);
    }

    const attentionCount = this._getHomeSummaryCards()
      .reduce((total, summary) => total + summary.count, 0);
    if (attentionCount) {
      parts.push(this._tp('home.attention', attentionCount));
    }

    const weatherText = this._formatWeatherSnapshot(weatherEntity);
    if (weatherText && parts.length < 3) {
      parts.push(weatherText);
    }

    return parts.slice(0, 3).join(' · ') || this._t('home.everything_calm');
  }

  private _formatWeatherSnapshot(weatherEntity?: any): string {
    const temperature = this._formatWeatherTemperature(weatherEntity);
    if (!temperature) return '';

    return `${temperature} ${this._t('home.outside').toLocaleLowerCase(ddLocale(this.hass))}`;
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
    const powerUsage = this._housePowerUsage(this.hass, this.config);
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
    // Outdoor areas never count for the indoor average. They are often hidden
    // from the dashboard, so the outdoor card looks at every area.
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
    // A single outdoor sensor is not an average.
    const averaged = scope === 'indoor' || values.length > 1;

    const average = values.reduce((total, item) => total + item.value, 0) / values.length;
    const unit = values[0]?.unit || (kind === 'temperature' ? '°C' : '%');
    const value = formatValueWithUnit(
      kind === 'temperature' ? average.toFixed(1) : Math.round(average),
      unit
    );

    return {
      kind,
      label: kind === 'temperature'
        ? this._t(averaged ? 'home.average_temperature' : 'home.temperature')
        : this._t(averaged ? 'home.average_humidity' : 'home.humidity'),
      value,
      count: values.length,
      icon: kind === 'temperature' ? getDeviceClassIcon('sensor', 'temperature') : getDeviceClassIcon('sensor', 'humidity'),
      color: kind === 'temperature' ? getDomainColor('sensor', 'temperature') : getDomainColor('sensor', 'humidity'),
      entityIds: [...new Set(values.flatMap(item => item.entityIds))],
    };
  }

  private _renderMobileHomeAreas() {
    const areas = this._getVisibleSortedAreas();
    if (!areas.length) {
      // Only when Home Assistant has no areas at all; areas hidden in the
      // dashboard settings are a choice, not something to fix.
      return this.config?.areas?.length ? nothing : this._renderNoAreasHint();
    }
    const desktopCollapsed = this._isDesktopAreaSidebarCollapsed();
    const layout = desktopCollapsed ? 'grid' : this._mobileHomeAreasLayout;
    const gridMode = layout === 'grid';
    const renderedAreas = this._isMobile && !this._renderAllMobileHomeAreas && areas.length > MOBILE_INITIAL_HOME_AREAS
      ? areas.slice(0, MOBILE_INITIAL_HOME_AREAS)
      : areas;

    return html`
      <section class="mobile-home-section mobile-home-areas layout-${layout}">
        ${this._renderMobileSectionHeading('areas', this._t('home.areas'), desktopCollapsed ? {} : {
          toggle: {
            gridMode,
            title: gridMode ? this._t('home.swipe_areas') : this._t('home.show_all_areas'),
            label: gridMode ? this._t('home.switch_areas_swipe') : this._t('home.show_all_areas'),
            onToggle: this._toggleMobileHomeAreasLayout,
          },
          onSeeAll: this._openMobileAreaSwitcher,
        })}
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

  private _renderNoAreasHint() {
    const isAdmin = Boolean(this.hass?.user?.is_admin);
    return html`
      <section class="home-no-areas">
        <div class="home-no-areas-icon" aria-hidden="true">
          <ha-icon icon="mdi:floor-plan"></ha-icon>
        </div>
        <div class="home-no-areas-copy">
          <div class="home-no-areas-title">${this._t('home.no_areas_title')}</div>
          <div class="home-no-areas-text">${this._t('home.no_areas_text')}</div>
        </div>
        ${isAdmin ? html`
          <button class="dd-empty-state-button" type="button" @click=${() => this._openHomeAssistantPage('/config/areas')}>
            <span>${this._t('home.set_up_areas')}</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        ` : nothing}
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
    const meta = sensorSummary || this._tp('common.device', deviceCount);
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

    const getAlarmIcon = () => {
      if (isArmed) return 'mdi:shield-check';
      if (isDisarmed) return 'mdi:shield-off';
      return 'mdi:shield-alert';
    };

    const getAlarmText = () => {
      if (isArmed) return this._t('home.alarm_armed');
      if (isDisarmed) return this._t('home.alarm_disarmed');
      return this._t('domain.alarm_control_panel');
    };

    const getAlarmClass = () => {
      if (isArmed) return 'alarm-armed';
      if (isDisarmed) return 'alarm-disarmed';
      return 'alarm-triggered';
    };

    return html`
      <button
        class="welcome-alarm ${getAlarmClass()}"
        type="button"
        @click=${() => this._showMoreInfo(alarm?.entity_id || '')}
      >
        <ha-icon icon=${getAlarmIcon()}></ha-icon>
        <span class="alarm-text">${getAlarmText()}</span>
      </button>
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
        ${this._renderMobileSectionHeading('favorites', this._t('favorites.title'), {
          toggle: {
            gridMode,
            title: gridMode ? this._t('favorites.swipe') : this._t('favorites.show_all'),
            label: gridMode ? this._t('favorites.switch_swipe') : this._t('favorites.show_all'),
            onToggle: this._toggleMobileHomeFavoritesLayout,
          },
        })}
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
            role=${ifDefined(this._isOnOffDomain(domain) ? 'switch' : undefined)}
            aria-checked=${ifDefined(this._isOnOffDomain(domain) ? String(this._isEntityActiveForUi(state, domain)) : undefined)}
            aria-label=${this._isOnOffDomain(domain)
              ? name
              : this._t('action.entity_action', { action: this._favoriteQuickTitle(state, domain), name })}
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
    this._handleActivationKeydown(event, () => this._showMoreInfo(entityId));
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

  private _isOnOffDomain(domain: string): boolean {
    return ['light', 'switch', 'fan', 'input_boolean'].includes(domain);
  }

  private _entityDisplayName(state: any): string {
    const entityId = String(state?.entity_id || '');
    return state?.attributes?.friendly_name || this.hass?.entities?.[entityId]?.name || entityId;
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



  private _renderAreaView() {
    if (!this._selectedArea) return nothing;

    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    if (!area) return this._renderAreaNotFound();

    const visibleAreaEntities = this._getFilteredAreaEntities(this._selectedArea);
    const areaEntities = this._editMode
      ? this._getEditableAreaEntities(this._selectedArea)
      : visibleAreaEntities;
    const areaData = this._getCachedAreaData(area);
    const hasPicture = area.picture ? true : false;
    const pictureContrastClass = hasPicture ? this._getPictureContrastClass(area.picture) : '';
    const deviceCount = this._getAreaDeviceCount(area.area_id, visibleAreaEntities);
    const hasHeaderMetrics = Boolean(areaData.temperature || areaData.humidity);
    const hasMobileQuickControls = visibleAreaEntities.some(entity =>
      entity.entity_id.startsWith('light.') ||
      entity.entity_id.startsWith('switch.') ||
      entity.entity_id.startsWith('cover.') ||
      entity.entity_id.startsWith('fan.') ||
      entity.entity_id.startsWith('climate.')
    );
    const deviceLabel = this._tp('common.device', deviceCount);
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
              title=${this._t('sidebar.home')}
              aria-label=${this._t('navigation.back_home')}
              @click=${() => this._selectView('home')}
            >
              ${this._renderStaticIcon(ICON_ARROW_LEFT)}
            </button>
              ${this._renderAreaMobileQuickControls(area.area_id, visibleAreaEntities)}
            <div class="area-mobile-actions">
              ${this._renderAreaMobileCameraAction(visibleAreaEntities)}
              ${this._renderUnavailableEntitiesIcon(area.area_id)}
              ${this._canManageDashboard() ? html`
                <button
                  class="area-mobile-round area-mobile-edit ${this._editMode ? 'active' : ''}"
                  title=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
                  @click=${this._toggleEditMode}
                >
                  <ha-icon icon=${this._editMode ? 'mdi:check' : 'mdi:pencil'}></ha-icon>
                </button>
              ` : nothing}
            </div>
          </div>
          <div class="area-header-content">
            ${this._isDesktopAreaSidebarCollapsed() ? html`
              <button
                class="area-desktop-back"
                type="button"
                title=${this._t('navigation.back_home')}
                aria-label=${this._t('navigation.back_home')}
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
        </div>

        ${this._renderCustomCardSlot(area.area_id, 'top', this._t('layout.custom_cards_top'))}
        ${this._renderMobileEntitiesSection(area, areaEntities)}
        ${this._renderCustomCardSlot(area.area_id, 'bottom', this._t('layout.custom_cards_bottom'))}
        ${!this._editMode && !areaEntities.length && !this._getAreaCustomCards(area.area_id).length
          ? this._renderAreaEmptyState(area)
          : nothing}
      </div>
    `;
  }

  private _renderEmptyState(icon: string, title: string, text: string, actions: unknown = nothing) {
    return html`
      <div class="dd-empty-state" role="status">
        <div class="dd-empty-state-icon" aria-hidden="true">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="dd-empty-state-title">${title}</div>
        <div class="dd-empty-state-text">${text}</div>
        ${actions !== nothing ? html`<div class="dd-empty-state-actions">${actions}</div>` : nothing}
      </div>
    `;
  }

  /** Unavailable/unknown entities the "hide unavailable" setting keeps off this area page. */
  private _hiddenUnavailableEntityCount(areaId: string): number {
    if (this.config?.settings?.hide_unavailable_entities === false) return 0;
    const hidden = this._getUnavailableAreaEntities(areaId);
    return hidden.unavailable.length + hidden.unknown.length;
  }

  private _renderAreaEmptyState(area: AreaConfig) {
    const hiddenCount = this._hiddenUnavailableEntityCount(area.area_id);
    const isAdmin = Boolean(this.hass?.user?.is_admin);
    const actions = hiddenCount || isAdmin ? html`
      ${hiddenCount ? html`
        <button
          class="dd-empty-state-button"
          type="button"
          @click=${() => this._showUnavailableEntitiesModal(area.area_id)}
        >
          <ha-icon icon="mdi:eye-outline"></ha-icon>
          <span>${this._t('settings.hidden_unavailable_count', { count: hiddenCount })}</span>
        </button>
      ` : nothing}
      ${isAdmin ? html`
        <button
          class="dd-empty-state-button"
          type="button"
          @click=${() => this._openHomeAssistantPage(`/config/areas/area/${encodeURIComponent(area.area_id)}`)}
        >
          <ha-icon icon="mdi:cog-outline"></ha-icon>
          <span>${this._t('layout.area_settings')}</span>
        </button>
      ` : nothing}
    ` : nothing;

    return this._renderEmptyState(
      'mdi:devices',
      this._t('layout.area_empty_title'),
      this._t('layout.area_empty_text'),
      actions
    );
  }

  private _renderAreaNotFound() {
    const isAdmin = Boolean(this.hass?.user?.is_admin);
    return html`
      <div class="area-view area-view-missing">
        ${this._renderEmptyState(
          'mdi:map-marker-question-outline',
          this._t('layout.area_not_found_title'),
          this._t('layout.area_not_found_text'),
          html`
            <button class="dd-empty-state-button primary" type="button" @click=${() => this._selectView('home')}>
              <ha-icon icon="mdi:home-outline"></ha-icon>
              <span>${this._t('navigation.back_home')}</span>
            </button>
            ${isAdmin ? html`
              <button class="dd-empty-state-button" type="button" @click=${() => this._openHomeAssistantPage('/config/areas')}>
                <ha-icon icon="mdi:cog-outline"></ha-icon>
                <span>${this._t('layout.manage_areas')}</span>
              </button>
            ` : nothing}
          `
        )}
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
      'dd-grid-full': entry.card?.grid_options?.columns === 'full',
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
          <button class="drag" type="button" title=${this._t('layout.drag_card')} aria-label=${this._t('layout.drag_card')}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button
            type="button"
            title=${this._t('common.edit')}
            aria-label=${this._t('common.edit')}
            @click=${() => this._editCard(areaId, entry.id)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button
            class="del"
            type="button"
            title=${this._t('common.delete')}
            aria-label=${this._t('common.delete')}
            @click=${() => this._deleteCard(areaId, entry.id)}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dwains-dashboard-next-card-host .hass=${this.hass} .config=${entry.card}></dwains-dashboard-next-card-host>
      </div>
    `;
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

  private _renderUngroupedCustomCardSlot(areaId: string, slotIndex: number) {
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
      ${this._editMode && canEdit ? html`
        <button
          class="dd-add-card dd-domain-add-card ${dragOver ? 'drag-over' : ''}"
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
  // geregistreerd is. Home Assistant's eigen dialog-manager maakt het element
  // aan, hangt het in <home-assistant> en koppelt het aan de terugknop.
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

  private async _deleteCard(areaId: string, cardId: string) {
    if (!this._canManageDashboard()) return;
    const confirmed = await this._showConfirmation(
      this._t('layout.delete_card_confirm'),
      this._t('layout.delete_card_message'),
      { confirmLabel: this._t('common.delete'), destructive: true }
    );
    if (!confirmed) return;
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

    const [card] = cards.splice(currentIndex, 1);
    if (!card) return;

    // Dropping a card on another card takes that card's position, in both
    // directions. Dropping on the end of a section clamps to the last slot.
    card.placement = placement;
    const insertAt = this._insertIndexForPlacement(cards, placement, placementIndex);
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
      // Queued behind other dashboard saves and applied to the latest stored config.
      await updateStoredDashboardStrategy(this.hass, this._getDashboardUrlPath(), (strat, lovelaceConfig) => {
        if (!strat) {
          console.warn('⚠️ No dashboard strategy found; area options were not saved', lovelaceConfig);
          return null;
        }
        const stratOptions = strat.areas_options || {};
        return {
          ...strat,
          areas_options: {
            ...stratOptions,
            [areaId]: { ...(stratOptions[areaId] || {}), ...patch },
          },
        };
      });
    } catch (e) {
      console.error('❌ Saving area options failed:', e);
      this._showToast(this._t('layout.save_card_failed', { error: String(e) }));
    }
  }

  private _renderAreaMobileQuickControls(areaId: string, entities: EntityConfig[]) {
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    const covers = entities.filter(e => e.entity_id.startsWith('cover.'));
    const fans = entities.filter(e => e.entity_id.startsWith('fan.'));
    const climates = entities.filter(e => e.entity_id.startsWith('climate.'));

    if (!lights.length && !switches.length && !covers.length && !fans.length && !climates.length) {
      return html`<div class="area-mobile-quick-controls empty"></div>`;
    }

    const activeLights = this._countActiveEntities(lights, 'light');
    const activeSwitches = this._countActiveEntities(switches, 'switch');
    const openCovers = this._countActiveEntities(covers, 'cover');
    const activeFans = this._countActiveEntities(fans, 'fan');
    const activeClimates = this._countActiveEntities(climates, 'climate');
    const lightsActive = activeLights > 0;
    const switchesActive = activeSwitches > 0;
    const coversOpen = openCovers > 0;
    const fansActive = activeFans > 0;
    const climatesActive = activeClimates > 0;
    const controlsCount = [lights.length, switches.length, covers.length, fans.length, climates.length].filter(Boolean).length;
    const singleClimateState = climates.length === 1 ? this.hass.states[climates[0]!.entity_id] : undefined;
    const currentTemperature = singleClimateState?.attributes?.current_temperature;
    const temperatureUnit = (this.hass.config as any)?.unit_system?.temperature || '°';
    const climateValue = currentTemperature !== undefined && currentTemperature !== null
      ? formatValueWithUnit(currentTemperature, temperatureUnit)
      : `${climates.length}`;

    return html`
      <div class="area-mobile-quick-controls count-${controlsCount}">
        ${lights.length ? html`
          <button
            class="area-quick-control light ${lightsActive ? 'active' : ''}"
            title=${this._t(lightsActive ? 'action.lights_off_summary' : 'action.lights_on_summary', { active: activeLights, total: lights.length })}
            aria-label=${this._t(lightsActive ? 'action.lights_off_summary' : 'action.lights_on_summary', { active: activeLights, total: lights.length })}
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
            title=${this._t(switchesActive ? 'action.switches_off_summary' : 'action.switches_on_summary', { active: activeSwitches, total: switches.length })}
            aria-label=${this._t(switchesActive ? 'action.switches_off_summary' : 'action.switches_on_summary', { active: activeSwitches, total: switches.length })}
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
          <div class="area-quick-control cover has-actions ${coversOpen ? 'active' : ''}">
            <span class="area-quick-main">
              <ha-icon icon=${coversOpen ? 'mdi:window-shutter-open' : 'mdi:window-shutter'}></ha-icon>
              <span class="area-quick-count">${openCovers}/${covers.length}</span>
            </span>
            <span class="area-quick-actions">
              <button
                class="area-quick-action"
                type="button"
                title=${this._t('action.open_all')}
                aria-label=${this._t('action.open_all')}
                @click=${(event: Event) => {
                  event.stopPropagation();
                  void this._setAreaCoverState(areaId, true);
                }}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="area-quick-action"
                type="button"
                title=${this._t('action.close_all')}
                aria-label=${this._t('action.close_all')}
                @click=${(event: Event) => {
                  event.stopPropagation();
                  void this._setAreaCoverState(areaId, false);
                }}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </span>
          </div>
        ` : nothing}
        ${fans.length ? html`
          <button
            class="area-quick-control fan ${fansActive ? 'active' : ''}"
            title=${this._t(fansActive ? 'action.fans_off_summary' : 'action.fans_on_summary', { active: activeFans, total: fans.length })}
            aria-label=${this._t(fansActive ? 'action.fans_off_summary' : 'action.fans_on_summary', { active: activeFans, total: fans.length })}
            @click=${() => this._toggleAreaFans(areaId)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${fansActive ? 'mdi:fan' : 'mdi:fan-off'}></ha-icon>
              <span class="area-quick-count">${activeFans}/${fans.length}</span>
            </span>
            <span class="area-quick-switch" aria-hidden="true"></span>
          </button>
        ` : nothing}
        ${climates.length ? html`
          <button
            class="area-quick-control climate ${climatesActive ? 'active' : ''}"
            title=${this._t('action.open_climate_controls')}
            aria-label=${this._t('action.open_climate_controls')}
            @click=${() => this._openAreaClimateControls(areaId, climates)}
          >
            <span class="area-quick-main">
              <ha-icon icon=${getDomainIcon('climate')}></ha-icon>
              <span class="area-quick-count">${climateValue}</span>
            </span>
            <span class="area-quick-direction" aria-hidden="true">
              <ha-icon icon="mdi:chevron-right"></ha-icon>
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
        title=${this._t('domain.camera')}
        aria-label=${this._t('action.open_camera')}
        @click=${() => this._showMoreInfo(camera.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `;
  }

  private _renderAreaHeaderMetrics(areaData: AreaData) {
    const metrics = [
      areaData.temperature ? this._renderMobileAreaMetric('temperature', this._t('home.temperature'), areaData.temperature, 0, 30, 'area-header-metric') : nothing,
      areaData.humidity ? this._renderMobileAreaMetric('humidity', this._t('home.humidity'), areaData.humidity, 20, 90, 'area-header-metric') : nothing,
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
        ${renderedGroups.map((group, groupIndex) => {
          const hasActions = this._mobileControllableEntities(group.entities).length > 0;
          const gridMode = this._mobileEntityLayout === 'grid';
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
              })}
              @dragover=${(event: DragEvent) => this._handleGeneratedGroupDragOver(event, area.area_id, group.key)}
              @drop=${(event: DragEvent) => this._handleGeneratedGroupDrop(
                event,
                area.area_id,
                group.key,
                groups.map(item => item.key)
              )}
            >
              <div class="mobile-domain-header">
                <div class="mobile-domain-title">
                  ${group.key === 'todo'
                    ? html`<span class="mobile-layout-toggle static"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`
                    : html`
                        <button
                          class="mobile-layout-toggle ${gridMode ? 'active' : ''}"
                          type="button"
                          title=${gridMode ? this._t('layout.swipe_cards') : this._t('layout.show_all_cards')}
                          aria-label=${gridMode ? this._t('layout.switch_swipe_cards') : this._t('layout.show_all_cards')}
                          @click=${this._toggleMobileEntityLayout}
                        >
                          <ha-icon icon=${gridMode ? 'mdi:view-carousel-outline' : 'mdi:view-grid-outline'}></ha-icon>
                        </button>
                      `}
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${group.name}</span>
                    ${group.entities.length > 0 ? html`
                      <span class="mobile-domain-count">(${this._tp('common.item', group.entities.length)})</span>
                    ` : nothing}
                  </span>
                </div>
                <div class="mobile-domain-header-actions">
                  ${this._editMode && this._canManageDashboard() ? html`
                    <button
                      class="mobile-domain-order-button"
                      type="button"
                      title=${this._t('settings.move_up')}
                      aria-label=${this._t('settings.move_up')}
                      ?disabled=${groupIndex === 0}
                      @click=${(event: Event) => this._moveGeneratedGroup(
                        event,
                        area.area_id,
                        groups.map(item => item.key),
                        groupIndex,
                        -1
                      )}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </button>
                    <button
                      class="mobile-domain-order-button"
                      type="button"
                      title=${this._t('settings.move_down')}
                      aria-label=${this._t('settings.move_down')}
                      ?disabled=${groupIndex === groups.length - 1}
                      @click=${(event: Event) => this._moveGeneratedGroup(
                        event,
                        area.area_id,
                        groups.map(item => item.key),
                        groupIndex,
                        1
                      )}
                    >
                      <ha-icon icon="mdi:arrow-down"></ha-icon>
                    </button>
                    <button
                      class="mobile-domain-drag-handle"
                      type="button"
                      draggable="true"
                      title=${this._t('layout.drag_group')}
                      aria-label=${this._t('layout.drag_group')}
                      @dragstart=${(event: DragEvent) => this._handleGeneratedGroupDragStart(
                        event,
                        area.area_id,
                        group.key
                      )}
                      @dragend=${this._clearGeneratedGroupDragState}
                      @click=${(event: Event) => event.stopPropagation()}
                    >
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </button>
                  ` : nothing}
                  ${hasActions ? this._renderMobileDomainMaster(group) : nothing}
                </div>
	              </div>
	              <div class="mobile-entity-rail">
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
            ${this._renderUngroupedCustomCardSlot(area.area_id, 0)}
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
                ${this._renderUngroupedCustomCardSlot(area.area_id, entityIndex + 1)}
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

    const order = ['light', 'switch', 'cover', 'climate', 'todo', 'scene', 'event', 'motion', 'binary_sensor', 'sensor', 'media_player', 'fan', 'lock', 'camera', 'vacuum'];

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

  private _sortAreaEntityGroups(areaId: string, groups: MobileEntityGroup[]): MobileEntityGroup[] {
    const configuredOrder = this.config?.areas_options?.[areaId]?.group_order || [];
    if (!configuredOrder.length) return groups;

    const directOrder = new Map(configuredOrder.map((groupKey, index) => [groupKey, index]));
    const strategyOrder: string[] = [];
    configuredOrder.forEach((groupKey) => {
      const strategyGroup = this._strategyGroupForMobileGroupKey(groupKey);
      if (!strategyOrder.includes(strategyGroup)) strategyOrder.push(strategyGroup);
    });
    const projectedOrder = new Map(strategyOrder.map((groupKey, index) => [groupKey, index]));
    const groupIndex = (groupKey: string): number | undefined => directOrder.get(groupKey) ??
      projectedOrder.get(this._strategyGroupForMobileGroupKey(groupKey));

    return groups
      .map((group, fallbackIndex) => ({ group, fallbackIndex }))
      .sort((a, b) => {
        const aIndex = groupIndex(a.group.key);
        const bIndex = groupIndex(b.group.key);
        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
        if (aIndex !== undefined) return -1;
        if (bIndex !== undefined) return 1;
        return a.fallbackIndex - b.fallbackIndex;
      })
      .map(({ group }) => group);
  }

  private _strategyGroupForMobileGroupKey(groupKey: string): string {
    if (groupKey === 'light' || groupKey === 'lights') return 'lights';
    if (['climate', 'humidifier', 'water_heater', 'fan'].includes(groupKey)) return 'climate';
    if (groupKey === 'cover' || groupKey === 'covers') return 'covers';
    if (groupKey === 'media_player' || groupKey === 'media_players') return 'media_players';
    if (['alarm_control_panel', 'lock', 'camera', 'binary_sensor', 'security'].includes(groupKey)) return 'security';
    if (groupKey === 'motion') return 'motion';
    if (['script', 'scene', 'automation', 'todo', 'event', 'actions'].includes(groupKey)) return 'actions';
    return 'others';
  }

  private _sortAreaEntities(areaId: string, entities: EntityConfig[]): EntityConfig[] {
    const areaOptions = this.config?.areas_options?.[areaId];
    // Same order as `a.localeCompare(b, locale)`.
    const nameCollator = getCollator(ddLocale(this.hass));
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
        const aMobileGroup = this._mobileEntityTypeKey(a.entity_id);
        const bMobileGroup = this._mobileEntityTypeKey(b.entity_id);
        if (aMobileGroup === bMobileGroup && aMobileGroup) {
          const mobileGroupOrder = areaOptions?.groups_options?.[aMobileGroup]?.order || [];
          const aMobileIndex = mobileGroupOrder.indexOf(a.entity_id);
          const bMobileIndex = mobileGroupOrder.indexOf(b.entity_id);
          if (aMobileIndex !== -1 && bMobileIndex !== -1) return aMobileIndex - bMobileIndex;
          if (aMobileIndex !== -1) return -1;
          if (bMobileIndex !== -1) return 1;
        }

        const aGroup = this._areaStrategyGroupKey(a.entity_id);
        const bGroup = this._areaStrategyGroupKey(b.entity_id);
        if (aGroup === bGroup && aGroup) {
          const groupOrder = areaOptions?.groups_options?.[aGroup]?.order || [];
          const aIndex = groupOrder.indexOf(a.entity_id);
          const bIndex = groupOrder.indexOf(b.entity_id);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
        }
      }

      const nameA = this.hass.states[a.entity_id]?.attributes?.friendly_name || a.entity_id;
      const nameB = this.hass.states[b.entity_id]?.attributes?.friendly_name || b.entity_id;
      return nameCollator.compare(nameA, nameB);
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
        <div class="dd-generated-card-toolbar">
          <button type="button" title=${this._t('layout.drag_card')} aria-label=${this._t('layout.drag_card')}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button
            type="button"
            title=${this._t(hidden ? 'common.show' : 'common.hide')}
            aria-label=${this._t(hidden ? 'common.show' : 'common.hide')}
            aria-pressed=${hidden ? 'true' : 'false'}
            @click=${(event: Event) => this._toggleGeneratedCardVisibility(event, area.area_id, entity.entity_id)}
          >
            <ha-icon icon=${hidden ? 'mdi:eye' : 'mdi:eye-off-outline'}></ha-icon>
          </button>
        </div>
        ${this._renderMobileEntityCard(area, entity)}
      </div>
    `;
  }

  private _handleGeneratedGroupDragStart(event: DragEvent, areaId: string, groupKey: string): void {
    if (!this._editMode || !this._canManageDashboard()) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
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
    void this._saveAreaOptionsPatch(areaId, { group_order: reordered });
    this._clearGeneratedGroupDragState();
  }

  private _moveGeneratedGroup(
    event: Event,
    areaId: string,
    orderedGroupKeys: string[],
    index: number,
    direction: -1 | 1
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedGroupKeys.length) return;

    const reordered = [...orderedGroupKeys];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(targetIndex, 0, moved);
    void this._saveAreaOptionsPatch(areaId, { group_order: reordered });
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
    const groupOptions = groupsOptions[storageGroup] || {};
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
    const domain = entityId.split('.')[0] || '';
    const deviceClass = String(this.hass.states[entityId]?.attributes?.device_class || '');

    if (domain === 'light') return 'lights';
    if (['climate', 'humidifier', 'water_heater', 'fan'].includes(domain)) return 'climate';
    if (domain === 'cover') return 'covers';
    if (domain === 'binary_sensor' && ['door', 'garage_door', 'window'].includes(deviceClass)) return 'covers';
    if (domain === 'media_player') return 'media_players';
    if (['alarm_control_panel', 'lock', 'camera'].includes(domain)) return 'security';
    if (domain === 'binary_sensor' && ['motion', 'occupancy', 'presence'].includes(deviceClass)) return 'motion';
    if (['script', 'scene', 'automation', 'todo'].includes(domain)) return 'actions';
    if (['switch', 'button', 'input_boolean', 'vacuum', 'lawn_mower', 'valve', 'select', 'number',
      'input_select', 'input_number', 'counter', 'timer', 'sensor'].includes(domain)) return 'others';
    return undefined;
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
    return getDomainName(this.hass, key);
  }

  private _mobileGroupIcon(key: string): string {
    if (key === 'motion') return 'mdi:motion-sensor';
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
          .hass=${this.hass}
          .config=${cardConfig}
        ></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  private _renderMobileEntityCard(area: AreaConfig, entity: EntityConfig) {
    const rawState = this.hass.states[entity.entity_id];
    if (!rawState) return nothing;

    const state = this._getEffectiveEntityState(rawState);
    const domain = entity.entity_id.split('.')[0] || 'unknown';
    if (domain === 'todo') return this._renderTodoListCard(entity);

    const deviceClass = state.attributes?.device_class;
    const replacementConfig = this._areaReplacementCardConfig(entity.entity_id);
    if (replacementConfig) {
      return this._renderAreaReplacementCard(entity.entity_id, replacementConfig);
    }

    const icon = this.hass.entities?.[entity.entity_id]?.icon || state.attributes?.icon || getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const fullName = state.attributes?.friendly_name || this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
    // The page already shows the room, so drop a leading area name from the tile
    // and use the second line for the device when that adds something.
    const name = stripAreaFromEntityName(fullName, area.name);
    const deviceLabel = areaEntityDeviceLabel(name, this._entityDeviceName(entity.entity_id), area.name);
    const active = this._isEntityActiveForUi(state, domain);
    const actionKind = this._mobileEntityActionKind(domain);
    const hasInlineSelect = this._mobileEntityHasInlineSelect(domain, state);
    const classes = [
      'mobile-entity-card',
      `mobile-entity-${domain}`,
      `action-${actionKind}`,
      active ? 'is-active' : 'is-off',
      hasInlineSelect ? 'has-inline-select' : '',
      isHiddenAsUnavailable(state) ? 'is-unavailable' : '',
    ].join(' ');

    return html`
      <article
        class=${classes}
        style=${`--entity-color: ${this._mobileEntityColor(domain, deviceClass)};`}
        role="button"
        tabindex="0"
        aria-label=${fullName}
        title=${fullName}
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
          ${deviceLabel ? html`<div class="mobile-entity-meta">${deviceLabel}</div>` : nothing}
          <div class="mobile-entity-name">${name}</div>
          <div class="mobile-entity-status">${this._mobileEntityStatusText(state, domain)}</div>
        </div>
        ${hasInlineSelect ? this._renderMobileEntitySelect(state, domain) : nothing}
      </article>
    `;
  }

  private _entityDeviceName(entityId: string): string | undefined {
    const deviceId = this.hass.entities?.[entityId]?.device_id;
    const device = deviceId ? this.hass.devices?.[deviceId] : undefined;
    return device ? device.name_by_user || device.name || undefined : undefined;
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
          aria-label=${this._t('common.select_option')}
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
    const name = this._entityDisplayName(state);
    const labelFor = (action: string) => this._t('action.entity_action', { action, name });

    if (actionKind === 'toggle') {
      return html`
        <button
          class="mobile-entity-action mobile-entity-toggle"
          type="button"
          role="switch"
          aria-checked=${active ? 'true' : 'false'}
          title=${active ? this._t('action.turn_off') : this._t('action.turn_on')}
          aria-label=${name}
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
          title=${unlocked ? this._t('action.lock') : this._t('action.unlock')}
          aria-label=${labelFor(unlocked ? this._t('action.lock') : this._t('action.unlock'))}
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
          title=${this._t('action.activate')}
          aria-label=${labelFor(this._t('action.activate'))}
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
        title=${this._t('action.more_info')}
        aria-label=${labelFor(this._t('action.more_info'))}
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
    const name = this._entityDisplayName(state);
    const labelFor = (action: string) => this._t('action.entity_action', { action, name });

    return html`
      <div class="mobile-cover-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${canOpen ? html`
          <button
            class="mobile-entity-action mobile-cover-action ${value === 'opening' ? 'active' : ''}"
            type="button"
            title=${this._t('action.open')}
            aria-label=${labelFor(this._t('action.open'))}
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
            title=${this._t('action.stop')}
            aria-label=${labelFor(this._t('action.stop'))}
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
            title=${this._t('action.close')}
            aria-label=${labelFor(this._t('action.close'))}
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
      this._showToast(this._t('entity.update_failed'));
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

    if (domain === 'light' && state.state === 'on' && typeof state.attributes?.brightness === 'number') {
      return this._t('entity.brightness', { value: Math.round((state.attributes.brightness / 255) * 100) });
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
      return getRelativeTimeFormat(language, { numeric: 'auto' }).format(value, unit);
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

  // Helper Methods

  private _getWeatherEntity() {
    if (this.config?.settings?.weather_entity_id) {
      const chosen = this.hass.states[this.config.settings.weather_entity_id];
      if (chosen && !this.hass.entities?.[chosen.entity_id]?.hidden_by) {
        return chosen;
      }
    }

    // Fallback to first visible weather entity
    return getDomainStates(this.hass.states, 'weather').find(state =>
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
    return this._statusDomains(this.hass, this.config);
  }

  // Computed once per hass object and config.
  private _statusDomains = memoizeOne((hass: HomeAssistant, config: DwainsDashboardConfig): DomainCount[] => {
    const result = getStatusDomains(hass, config);

    // Add wattage badge if available (same as getTotalWattage()).
    const powerUsage = this._housePowerUsage(hass, config);
    const totalWattage = powerUsage.sensorCount ? powerUsage.formattedTotal : undefined;
    if (totalWattage) {
      result.unshift({
        domain: 'wattage',
        count: 0,
        name: 'Power usage',
        value: totalWattage,
        icon: 'mdi:flash'
      });
    }

    return result;
  });

  private _housePowerUsage = memoizeOne(
    (hass: HomeAssistant, config: DwainsDashboardConfig) => buildHousePowerUsage(hass, config)
  );

  private _getHiddenStatusCount(): string {
    // TODO: Calculate hidden status cards count
    return '';
  }

  private _areaDeviceIds = memoizeOne((devices: DwainsDashboardConfig['devices']) => {
    const byArea = new Map<string, string[]>();
    devices?.forEach(device => {
      if (!device.area_id) return;
      const ids = byArea.get(device.area_id) || [];
      ids.push(device.device_id);
      byArea.set(device.area_id, ids);
    });
    return byArea;
  });

  private _getAreaDeviceCount(areaId: string, entities: EntityConfig[] = []): number {
    const deviceIds = new Set<string>(this._areaDeviceIds(this.config?.devices).get(areaId));

    entities.forEach(entity => {
      if (entity.device_id) {
        deviceIds.add(entity.device_id);
      }
    });

    return deviceIds.size;
  }

  private _getAreaEntities(areaId: string): EntityConfig[] {
    return this._areaResolver.areaEntities(areaId, this.hass, this.config);
  }

  private _getFilteredAreaEntities(areaId: string): EntityConfig[] {
    return this._areaResolver.filteredAreaEntities(areaId, this.hass, this.config);
  }

  private _getEditableAreaEntities(areaId: string): EntityConfig[] {
    let entities = this._getAreaEntities(areaId).filter(entity => {
      const registry = this.hass.entities?.[entity.entity_id];
      return Boolean(this.hass.states[entity.entity_id]) &&
        !(registry?.hidden_by ||
          (registry as any)?.disabled_by ||
          registry?.entity_category === 'diagnostic' ||
          registry?.entity_category === 'config');
    });

    // Area-hidden entities remain in edit mode so they can be enabled again in place.
    if (this.config?.settings?.hide_unavailable_entities !== false) {
      entities = entities.filter(entity => {
        const state = this.hass.states[entity.entity_id];
        return state && !isHiddenAsUnavailable(state);
      });
    }

    return filterHiddenDeviceEntities(this.hass, this.config, entities);
  }

  private _getUnavailableAreaEntities(areaId: string): { unavailable: string[], unknown: string[] } {
    let entities = this._getAreaEntities(areaId);

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

    return splitHiddenUnavailableEntities(entities.map(entity => entity.entity_id), this.hass.states);
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

    return html`
      <button
        class="unavailable-entities-icon"
        @click=${() => this._showUnavailableEntitiesModal(areaId)}
        title=${this._t('settings.hidden_unavailable_count', { count: totalUnavailable })}
      >
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span class="unavailable-count">${totalUnavailable}</span>
      </button>
    `;
  }

  private _getCachedAreaData(area: AreaConfig): AreaData {
    // getAreaData() reuses its result while the area's entities and their states are unchanged.
    return getAreaData(area, this.hass, this._getFilteredAreaEntities(area.area_id), this.config);
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
  // True when the settings page can be left right away. With unsaved settings
  // the user is asked first and retry() runs once they choose to discard them.
  private _canLeaveSettings(retry: () => void): boolean {
    if (this._selectedView !== 'settings' || !this._settingsDirty) return true;
    void this._showConfirmation(
      this._t('settings.discard_confirm'),
      this._t('settings.discard_message'),
      { confirmLabel: this._t('settings.discard'), destructive: true }
    ).then((confirmed) => {
      if (!confirmed) return;
      this._clearSettingsEditState();
      retry();
    });
    return false;
  }

  private _clearSettingsEditState(): void {
    this._pendingSettingsConfig = undefined;
    this._settingsDirty = false;
    this._settingsSaveError = '';
    this._settingsSavePending = false;
    this._settingsEditorInitialized = false;
  }

  private _selectView(view: DwainsSelectedView) {
    if (view !== 'settings' && !this._canLeaveSettings(() => this._selectView(view))) return;
    this._resetAreaHeaderScrollState(view === 'area');
    this._selectedView = view;
    if (view === 'home') {
      this._selectedArea = null;
      this._editMode = false;
      this._rememberAreaEditMode(null);
      this._updateUrlArea(null);
      this._clearSettingsEditState();
    } else if (view === 'settings') {
      void loadStrategyEditor().then(() => this.requestUpdate());
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
    if (!this._canLeaveSettings(() => this._selectArea(areaId))) return;
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
    if (!this._canLeaveSettings(() => this._openMobileAreaSwitcher())) return;
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

  /** Loads the Home summaries now and every five minutes while the card is connected. */
  private _ensureHomeSummariesRefresh(): void {
    if (this._homeSummariesLoaded || !this.hass || !this.isConnected) return;

    this._homeSummariesLoaded = true;
    void this._loadHomeAssistantSummaries();
    this._homeSummariesRefreshInterval = window.setInterval(
      () => void this._loadHomeAssistantSummaries(),
      5 * 60 * 1000
    );
  }

  private _stopHomeSummariesRefresh(): void {
    if (this._homeSummariesRefreshInterval) {
      clearInterval(this._homeSummariesRefreshInterval);
      this._homeSummariesRefreshInterval = undefined;
    }
    this._homeSummariesLoaded = false;
  }

  private async _loadHomeAssistantSummaries(): Promise<void> {
    // These endpoints are admin only; skip the failing calls for other users.
    if (!this.hass?.user?.is_admin) return;

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
    if (!this.hass?.states) return 0;
    return this._updateEntityCount(this.hass.states);
  }

  private _updateEntityCount = memoizeOne((states: HomeAssistant['states']): number =>
    getDomainStates(states, 'update').filter(entity =>
      entity.entity_id.startsWith('update.') &&
      entity.state === 'on'
    ).length
  );

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
    // Wait until the lazily loaded editor has upgraded.
    if (typeof editor.setConfig !== 'function') {
      void loadStrategyEditor().then(() => this.requestUpdate());
      return;
    }

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
    if (!this._canLeaveSettings(this._closeSettingsPage)) return;
    this._clearSettingsEditState();
    this._selectView('home');
  };

  private async _saveSettingsPage(): Promise<void> {
    if (!this._pendingSettingsConfig || this._settingsSavePending || !this.hass) return;
    if (!this._canManageDashboard()) return;

    this._settingsSavePending = true;
    this._settingsSaveError = '';
    // Save the settings as they were when Save was pressed.
    const pendingConfig = this._pendingSettingsConfig;

    try {
      // Queued behind other dashboard saves and applied to the latest stored config.
      await updateStoredDashboardStrategy(this.hass, this._getDashboardUrlPath(), (strategy) => ({
        ...(strategy || {}),
        ...pendingConfig,
      }));

      this.config = {
        ...this.config,
        ...pendingConfig,
      };
      this._settingsSaveError = '';
      // Keep edits made while the save was running.
      if (this._pendingSettingsConfig === pendingConfig) {
        this._pendingSettingsConfig = undefined;
        this._settingsDirty = false;
        this._settingsEditorInitialized = false;
      }
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

    return html`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title=${this._t('common.close')}
            aria-label=${this._t('common.close')}
            @click=${this._closeSettingsPage}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>${this._t('sidebar.dashboard_settings')}</h1>
            <p>${this._t('settings.subtitle')}</p>
          </div>
          <div class="settings-page-actions">
            <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
              ${this._t('common.back')}
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
        <div class="settings-page-editor" @config-changed=${this._handleSettingsConfigChanged}>
          <dwains-dashboard-next-strategy-editor></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-page-bottom-actions">
          <button type="button" class="settings-secondary" @click=${this._closeSettingsPage}>
            ${this._t('common.back')}
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
    if (!this.hass?.states) return undefined;
    return this._welcomeUserPicture(this.hass.states, this.hass.user?.id || '', userName);
  }

  /**
   * Only ever show the signed in user's own picture: a shared wall tablet must
   * not greet one person with the face of another. First the person linked to
   * this user, then a person with exactly the user's name, else no picture.
   */
  private _welcomeUserPicture = memoizeOne((
    states: HomeAssistant['states'],
    userId: string,
    userName: string
  ): string | undefined => {
    const personEntities = getDomainStates(states, 'person').filter(entity => entity.entity_id.startsWith('person.'));
    const linkedPerson = userId
      ? personEntities.find((entity: any) => entity.attributes?.user_id === userId)
      : undefined;
    if (linkedPerson) return linkedPerson.attributes?.entity_picture || undefined;

    const normalizedUserName = userName.trim().toLowerCase();
    if (!normalizedUserName) return undefined;
    const namedPerson = personEntities.find((entity: any) =>
      String(entity.attributes?.friendly_name || '').trim().toLowerCase() === normalizedUserName
    );
    return namedPerson?.attributes?.entity_picture || undefined;
  });

  private _userInitials(userName: string): string {
    const words = userName.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const firstLetter = (word: string | undefined) => Array.from(word || '')[0] || '';
    const first = firstLetter(words[0]);
    const last = words.length > 1 ? firstLetter(words[words.length - 1]) : '';
    return `${first}${last}`.toLocaleUpperCase(ddLocale(this.hass));
  }

  private _openDashboardSettings = () => {
    if (!this._canManageDashboard()) return;
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
        this._notificationsError = this._t('error.notifications_load');
      }
    } finally {
      this._notificationsLoading = false;
    }
  }

  private async _ensurePersistentNotificationsSubscription(): Promise<void> {
    if (!this._showNotificationsUi() || this._persistentNotificationsSubscription.active || !this.hass) return;
    if (!this.isConnected) return;

    const connection = (this.hass as any).connection;
    if (!connection?.subscribeMessage) return;

    try {
      // Stopping the subscription while this is pending unsubscribes as soon as it resolves.
      await this._persistentNotificationsSubscription.start(() => connection.subscribeMessage(
        (event: any) => this._handlePersistentNotificationEvent(event),
        { type: 'persistent_notification/subscribe' }
      ));
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
      viewAllLabel: this._t('common.view_all'),
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
    this._areaResolver.clear();
    // Clear the external area data cache in utils/area.ts
    clearAreaDataCache();
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

  private async _setAreaCoverState(areaId: string, open: boolean) {
    const entities = this._getFilteredAreaEntities(areaId);
    const covers = entities.filter(e => e.entity_id.startsWith('cover.'));
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

  private _showConfirmation(
    title: string,
    message: string,
    options: { confirmLabel?: string; destructive?: boolean } = {}
  ): Promise<boolean> {
    return showConfirmDialog(this, {
      hass: this.hass,
      title,
      message,
      confirmLabel: options.confirmLabel,
      destructive: options.destructive,
    });
  }

  // Show a short message in Home Assistant's own snackbar.
  private _showToast(message: string) {
    if (!message) return;
    fireEvent(this, 'hass-notification', { message });
  }


}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-layout-card': DwainsLayoutCard;
  }
}
