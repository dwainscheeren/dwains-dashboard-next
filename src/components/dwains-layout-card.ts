import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, AreaConfig, EntityConfig, AreaData } from '../types/strategy';
import { getAreaData, clearAreaDataCache } from '../utils/area';
import { getAreaIcon, getDomainIcon } from '../utils/icons';
import { getStatusDomains, getTotalWattage, type DomainCount as StatusDomainCount } from '../utils/header-status-domains';
import { getDomainName } from '../utils/domain-names';
import { resolveEntityCardConfig } from '../utils/blueprint-replacements';
import { filterHiddenDeviceEntities } from '../utils/device-admission';
import { sortAreas } from '../utils/area-entities';
import { showDomainEntitiesDialog } from './utils/show-domain-entities-dialog';
import { showCardEditorDialog } from './utils/show-card-editor-dialog';
import { ensureBottomNav } from './dwains-bottom-nav';
import { makeDialogManager } from './utils/make-dialog-manager';
import './utils/dd-card-host';
import { fireEvent } from './utils/fire-event';
import { ddLocalize } from '../utils/localize';

// Use DomainCount from header-status-domains utility
type DomainCount = StatusDomainCount;

interface CachedAreaData {
  data: AreaData;
  timestamp: number;
}

@customElement('dwains-layout-card')
export class DwainsLayoutCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DwainsDashboardConfig;

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  @state() private _selectedArea: string | null = null;
  @state() private _selectedView: 'home' | 'area' | null = null;
  @state() private _isMobile = false;
  @state() private _headerExpanded = false;
  @state() private _headerCompact = false;
  private _favoritesRenderVersion = 0;
  @state() private _currentTime = '';
  @state() private _currentDate = '';
  @state() private _mobileNavOpen = false;
  @state() private _hasRelevantStateChanges = false;
  @state() private _editMode = false;

  // Performance optimizations
  private _areaEntitiesCache = new Map<string, { entities: EntityConfig[], timestamp: number }>();
  private _areaDataCache = new Map<string, CachedAreaData>();
  private _entityCardsCache = new Map<string, TemplateResult>();
  private _domainCountsCache = new Map<string, DomainCount[]>();

  private _CACHE_DURATION = 5000; // 5 seconds
  private _timeInterval?: number;
  private _cardObserver?: IntersectionObserver;
  private _resizeObserver?: ResizeObserver;

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

  static getStubConfig() {
    return {
      type: 'custom:dwains-layout-card',
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
      height: 100vh;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container {
      display: flex;
      height: 100vh;
      position: relative;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 250px;
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 1;
      overflow-y: auto;
    }

    /* Main Content */
    .main-content {
      flex: 1;
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
      background: color-mix(in srgb, var(--warning-color) 15%, transparent);
    }

    .status-card-compact.light ha-icon {
      color: var(--warning-color);
    }

    .status-card-compact.switch .status-card-icon-compact {
      background: color-mix(in srgb, var(--info-color) 15%, transparent);
    }

    .status-card-compact.switch ha-icon {
      color: var(--info-color);
    }

    .status-card-compact.binary_sensor .status-card-icon-compact {
      background: color-mix(in srgb, var(--error-color) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon {
      color: var(--error-color);
    }

    .status-card-compact.person .status-card-icon-compact {
      background: color-mix(in srgb, var(--success-color) 15%, transparent);
    }

    .status-card-compact.person ha-icon {
      color: var(--success-color);
    }

    .status-card-compact.wattage .status-card-icon-compact {
      background: color-mix(in srgb, var(--warning-color) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon {
      color: var(--warning-color);
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
      display: flex;
      flex-direction: column;
    }

    .area-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 8px;
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
      text-shadow: 0 1px 3px rgba(0,0,0,0.7);
      color: var(--text-primary-color);
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
      overflow-y: auto;
      padding: 16px;
    }
    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
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
      text-align: center;
      margin-bottom: 28px;
      padding: 20px 0;
      background: linear-gradient(135deg, var(--card-background-color) 0%, var(--primary-background-color) 100%);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .welcome-content {
      margin: 0 auto;
      padding: 0 24px;
    }

    .welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .welcome-text {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .welcome-greeting {
      font-size: 24px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name {
      font-size: 32px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .welcome-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 1.1;
    }

    .welcome-time {
      font-size: 36px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date {
      font-size: 16px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    .welcome-subheader {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome {
        margin-bottom: 32px;
        padding: 24px 0;
        border-radius: 16px;
      }

      .welcome-content {
        padding: 0 16px;
      }

      .welcome-header {
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
      }

      .welcome-text {
        align-items: center;
        gap: 4px;
      }

      .welcome-greeting {
        font-size: 20px;
      }

      .welcome-name {
        font-size: 28px;
      }

      .welcome-time-section {
        display: none;
      }

      .welcome-subheader {
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }

      .welcome-alarm,
      .welcome-weather {
        padding: 10px 20px;
        min-width: 140px;
        justify-content: center;
      }

      .alarm-text,
      .weather-temp {
        font-size: 15px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome {
        padding: 20px 0;
        margin-bottom: 24px;
      }

      .welcome-content {
        padding: 0 12px;
      }

      .welcome-greeting {
      font-size: 18px;
      }

      .welcome-name {
        font-size: 24px;
      }

      .welcome-time {
        font-size: 28px;
      }

      .welcome-date {
        font-size: 13px;
      }

      .welcome-alarm,
      .welcome-weather {
        padding: 8px 16px;
        min-width: 120px;
        font-size: 14px;
      }

      .alarm-text,
      .weather-temp {
        font-size: 14px;
      }
    }

    /* Home Status Cards */
    .home-status-section {
      margin-bottom: 48px;
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
      background: var(--card-background-color);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }

    .person-card.home {
      border-color: var(--success-color);
      background: linear-gradient(135deg,
        var(--card-background-color) 0%,
        color-mix(in srgb, var(--success-color) 10%, transparent) 100%);
    }

    .person-card.away {
      border-color: var(--secondary-text-color);
      opacity: 0.8;
    }

    .person-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .person-avatar-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .person-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--divider-color);
    }

    .person-card.home .person-avatar {
      border-color: var(--success-color);
    }

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon {
      --mdc-icon-size: 36px;
      color: var(--secondary-text-color);
    }

    .person-home-indicator {
      position: absolute;
      bottom: -3px;
      right: -3px;
      width: 20px;
      height: 20px;
      background: var(--success-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--card-background-color);
    }

    .person-home-indicator ha-icon {
      --mdc-icon-size: 12px;
      color: var(--text-primary-color);
    }

    .person-info {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .person-status {
      font-size: 14px;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    .person-card.home .person-status {
      color: var(--success-color);
    }

    .person-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-end;
      flex-shrink: 0;
      margin-left: auto;
    }

    .person-battery,
    .person-distance {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 6px;
      border-radius: 8px;
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
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      color: var(--warning-color);
    }

    .info-badge.switch {
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      color: var(--info-color);
    }

    .info-badge.climate {
      background: color-mix(in srgb, var(--success-color) 10%, var(--card-background-color));
      color: var(--success-color);
    }

    .info-badge.media_player {
      background: color-mix(in srgb, var(--accent-color) 10%, var(--card-background-color));
      color: var(--accent-color);
    }

    .info-badge.cover {
      background: color-mix(in srgb, var(--purple-color) 10%, var(--card-background-color));
      color: var(--purple-color);
    }

    .info-badge.fan {
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
    }

    .info-badge.motion {
      background: color-mix(in srgb, var(--orange-color) 10%, var(--card-background-color));
      color: var(--orange-color);
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

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
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
    .dd-page-card dd-card-host { display: block; }

    /* Eigen kaarten sectie */
    .dd-custom-section { margin-top: 16px; }
    .dd-custom-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .dd-custom-card-wrap { position: relative; min-width: 0; }
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
    .dd-add-card ha-icon { --mdc-icon-size: 22px; }

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
        height: 100%;
        transform: translateX(100%);
        z-index: 100;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      /* Mobile FAB */
      .mobile-fab {
        position: fixed;
        bottom: calc(84px + env(safe-area-inset-bottom, 0px));
        right: 24px;
        height: 56px;
        padding: 0 20px 0 16px;
        border-radius: 28px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 98;
        transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      }

      .mobile-fab:hover {
        background: var(--primary-color);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .mobile-fab:active {
        transform: scale(0.96);
      }

      .mobile-fab.hidden {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.8);
      }

      .mobile-fab ha-icon {
        --mdc-icon-size: 24px;
      }

      .mobile-fab .fab-label {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
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
      background: color-mix(in srgb, var(--amber-color) 10%, var(--card-background-color));
      color: var(--amber-color);
      border-color: color-mix(in srgb, var(--amber-color) 20%, transparent);
    }

    .area-badge.switch {
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
      border-color: color-mix(in srgb, var(--blue-color) 20%, transparent);
    }

    .area-badge.climate {
      background: color-mix(in srgb, var(--orange-color) 10%, var(--card-background-color));
      color: var(--orange-color);
      border-color: color-mix(in srgb, var(--orange-color) 20%, transparent);
    }

    .area-badge.motion.active {
      background: color-mix(in srgb, var(--red-color) 10%, var(--card-background-color));
      color: var(--red-color);
      border-color: color-mix(in srgb, var(--red-color) 20%, transparent);
    }

    .area-badge.cover {
      background: color-mix(in srgb, var(--purple-color) 10%, var(--card-background-color));
      color: var(--purple-color);
      border-color: color-mix(in srgb, var(--purple-color) 20%, transparent);
    }

    .area-badge.media_player {
      background: color-mix(in srgb, var(--green-color) 10%, var(--card-background-color));
      color: var(--green-color);
      border-color: color-mix(in srgb, var(--green-color) 20%, transparent);
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
  `;

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    this._setupEventListeners();
    this._startTimeUpdate();
    this._initializeObservers();
    makeDialogManager(this);
  }

  protected override willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);

    // Handle hass updates for live entity state changes
    if (changedProps.has('hass') && this.hass) {
      // Houd de mobiele onderbalk levend en up-to-date.
      ensureBottomNav(this.hass);

      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass && this._shouldUpdateEntities(oldHass, this.hass)) {
        // Clear caches to force fresh data in render
        this._clearEntityCardsCache();
        // Mark component for re-render to show live updates
        this._hasRelevantStateChanges = true;
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupEventListeners();
    this._cleanupObservers();
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
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
    this._checkMobile();
  };

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

  private _initializeObservers() {
    // Intersection Observer for lazy loading
    this._cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const wrapper = entry.target as HTMLElement;

            // Safety check: ensure wrapper exists and is connected
            if (!wrapper || !wrapper.isConnected) {
              return;
            }

            const entityId = wrapper.dataset.entityId;
            if (entityId && !wrapper.dataset.loaded) {
              wrapper.dataset.loaded = 'true';
              this._loadEntityCard(wrapper, entityId);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Resize Observer for responsive updates
    this._resizeObserver = new ResizeObserver(() => {
      this._debouncedUpdate();
    });

    if (this.shadowRoot) {
      this._resizeObserver.observe(this.shadowRoot.host);
    }
  }

  private _cleanupObservers() {
    if (this._cardObserver) {
      this._cardObserver.disconnect();
    }
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
        this._updateAreaDataCache();
      }

      // Update favorite tile cards when hass changes
      if (this._headerExpanded) {
        this._renderFavoriteTileCards();
      }
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

    // Render home favorite cards when home view is selected
    if (changedProps.has('_selectedView') && this._selectedView === 'home' && this.hass) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        this._renderHomeFavoriteCards();
      }, 0);
    }

    // Re-observe entity card wrappers after update
    if (this._cardObserver && this.shadowRoot) {
      try {
        this.shadowRoot.querySelectorAll('.entity-card-wrapper[data-entity-id]:not([data-loaded])')
        .forEach(wrapper => {
            // Safety check: ensure wrapper is a valid element before observing
            if (wrapper && wrapper instanceof HTMLElement && wrapper.isConnected) {
          this._cardObserver!.observe(wrapper);
            }
        });
      } catch (error) {
        console.warn('Error re-observing entity card wrappers:', error);
      }
    }
  }

  private _getRelevantEntities(): string[] {
    if (!this.config) return [];

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

    return html`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar()}
        <div class="main-content">
          ${this._selectedView !== 'home' ? this._renderGlobalHeader() : nothing}
          <div class="content-area">
            ${this._selectedView === 'home'
              ? this._renderHomeView()
              : this._selectedView === 'area' && this._selectedArea
                ? this._renderAreaView()
                : nothing}
          </div>
        </div>
      </div>
      ${this._renderMobileFAB()}
      ${this._renderToast()}
      ${this._renderConfirmationDialog()}
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

  private _renderMobileFAB() {
    if (!this._isMobile) return nothing;

    return html`
      <button
        class="mobile-fab ${this._mobileNavOpen ? 'hidden' : ''}"
        @click=${this._toggleMobileNav}
        title=${this._t('sidebar.areas')}
      >
        <ha-icon icon="mdi:floor-plan"></ha-icon>
        <span class="fab-label">${this._t('sidebar.areas')}</span>
      </button>
    `;
  }

  private _renderSidebar() {
    const classes = {
      sidebar: true,
      open: this._isMobile && this._mobileNavOpen
    };

    return html`
      <nav class=${classMap(classes)}>
        <div class="area-list">
          <button
            class="area-button home-button ${this._selectedView === 'home' ? 'selected' : ''}"
            @click=${() => this._selectView('home')}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t('sidebar.home')}</div>
            </div>
          </button>

          ${this._renderAreaButtons()}
        </div>
      </nav>
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

        return html`
          <button
            class="area-button ${isSelected ? 'selected' : ''} ${hasPicture ? 'has-picture' : ''}"
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
                ${area.icon ? html`
                  <div class="area-main-icon">
                    <ha-icon icon=${getAreaIcon(area)}></ha-icon>
                  </div>
                ` : nothing}

                <!-- Right: Info badges -->
                <div class="area-info-badges">
                  ${areaData.domains.light && areaData.domains.light.on > 0 ? html`
                    <span class="info-badge light clickable"
                          @click=${(e: Event) => this._handleLightToggle(e, area.area_id)}>
                      <ha-icon icon="mdi:lightbulb"></ha-icon>
                      <span class="badge-count">${areaData.domains.light.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.switch && areaData.domains.switch.on > 0 ? html`
                    <span class="info-badge switch">
                      <ha-icon icon="mdi:flash"></ha-icon>
                      <span class="badge-count">${areaData.domains.switch.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.climate && areaData.domains.climate.on > 0 ? html`
                    <span class="info-badge climate">
                      <ha-icon icon="mdi:thermostat"></ha-icon>
                      <span class="badge-count">${areaData.domains.climate.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.media_player && areaData.domains.media_player.on > 0 ? html`
                    <span class="info-badge media_player">
                      <ha-icon icon="mdi:play-circle"></ha-icon>
                      <span class="badge-count">${areaData.domains.media_player.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.cover && areaData.domains.cover.on > 0 ? html`
                    <span class="info-badge cover">
                      <ha-icon icon="mdi:garage-open"></ha-icon>
                      <span class="badge-count">${areaData.domains.cover.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.fan && areaData.domains.fan.on > 0 ? html`
                    <span class="info-badge fan">
                      <ha-icon icon="mdi:fan"></ha-icon>
                      <span class="badge-count">${areaData.domains.fan.on}</span>
                    </span>
                  ` : nothing}

                  ${areaData.domains.motion && areaData.domains.motion.on > 0 ? html`
                    <span class="info-badge motion">
                      <ha-icon icon="mdi:motion-sensor"></ha-icon>
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
    if (this.config?.settings?.show_weather === false) return nothing;

    const weatherEntity = this._getWeatherEntity();
    if (!weatherEntity) return nothing;

    return html`
      <div
        class="weather-compact"
        @click=${() => this._showMoreInfo(weatherEntity.entity_id)}
      >
        <div class="weather-icon-compact">
          <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
        </div>
        <div class="weather-temp-compact">
          ${weatherEntity.attributes.temperature}${weatherEntity.attributes.temperature_unit}
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
            d => d.domain,
            domain => html`
              <div
                class="status-card-compact ${domain.domain} header-card"
                @click=${() => this._handleStatusCardClick(domain)}
                data-domain=${domain.domain}
              >
                <div class="status-card-icon-compact">
                  <ha-icon icon=${domain.icon}></ha-icon>
                  ${domain.count > 0 ? html`
                    <div class="status-card-badge-compact">${domain.count}</div>
                  ` : nothing}
                </div>
                <div class="status-card-title-compact">${this._statusCardTitle(domain)}</div>
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

  private _statusCardTitle(domain: DomainCount): string {
    // Bij precies 1 actief: toon de ruimte ("Motion in Slaapkamer").
    if (domain.domain !== 'person' && domain.count === 1 && domain.entities?.length === 1) {
      const areaName = this._entityAreaName(domain.entities[0]!);
      if (areaName) return `${domain.name} in ${areaName}`;
    }
    return domain.name;
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
    return html`
      <div class="home-view">
        ${this._renderHomeWelcome()}
        ${this._renderHomeStatusCards()}
        ${this._renderFavorites()}
        </div>
    `;
  }

  private _renderHomeWelcome() {
    const userName = this.hass?.user?.name || 'User';
    const greeting = this._getGreeting();
    const weatherEntity = this._getWeatherEntity();

    return html`
      <div class="home-welcome">
        <div class="welcome-content">
          <div class="welcome-header">
            <div class="welcome-text">
              <span class="welcome-greeting">${greeting}</span>
              <span class="welcome-name">, ${userName}!</span>
            </div>
            <div class="welcome-time-section">
              <div class="welcome-time">${this._currentTime}</div>
              <div class="welcome-date">${this._currentDate}</div>
            </div>
          </div>
          <div class="welcome-subheader">
            ${this._renderHomeAlarm()}
            ${weatherEntity ? html`
              <div class="welcome-weather" @click=${() => this._showMoreInfo(weatherEntity.entity_id)}>
                <ha-icon icon=${weatherEntity.attributes.icon || 'mdi:weather-cloudy'}></ha-icon>
                <span class="weather-temp">${weatherEntity.attributes.temperature}${weatherEntity.attributes.temperature_unit}</span>
              </div>
            ` : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _renderHomeStatusCards() {
    const domains = this._getStatusDomains();

    return html`
      <div class="home-status-section">
        ${this._renderPersonCards()}
        <div class="home-status-grid">
          ${repeat(
            domains.filter(d => d.domain !== 'person'), // Filter out person domain
            d => d.domain,
            domain => html`
              <div
                class="home-status-card ${domain.domain}"
                @click=${() => this._handleStatusCardClick(domain)}
                data-domain=${domain.domain}
              >
                <div class="status-card-icon">
                  <ha-icon icon=${domain.icon}></ha-icon>
                  ${domain.count > 0 ? html`
                    <div class="status-card-badge">${domain.count}</div>
                  ` : nothing}
                </div>
                <div class="status-card-title">${this._statusCardTitle(domain)}</div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private _getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  private _renderPersonCards() {
    if (!this.hass || !this.config) return nothing;

    // Get all person entities and filter out hidden ones
    const hiddenPersons = new Set(this.config.settings?.hidden_persons || []);
    const personEntities = Object.values(this.hass.states).filter(
      entity =>
        entity.entity_id.startsWith('person.') &&
        !hiddenPersons.has(entity.entity_id) &&
        !this.hass.entities?.[entity.entity_id]?.hidden_by
    );

    if (personEntities.length === 0) return nothing;

    return html`
      <div class="person-cards-section">
        <div class="person-cards-grid">
          ${repeat(
            personEntities,
            person => person.entity_id,
            person => this._renderPersonCard(person)
          )}
        </div>
      </div>
    `;
  }

  private _renderPersonCard(person: any) {
    const isHome = person.state === 'home';
    const name = person.attributes.friendly_name || person.entity_id.split('.')[1];
    const picture = person.attributes.entity_picture;

    // Get device tracker for battery and GPS info
    const deviceTracker = this._getPersonDeviceTracker(person);
    const battery = deviceTracker?.attributes?.battery_level;
    const distance = this._getDistanceFromHome(deviceTracker);

    return html`
      <div class="person-card ${isHome ? 'home' : 'away'}" @click=${() => this._showMoreInfo(person.entity_id)}>
        <div class="person-avatar-wrapper">
          <div class="person-avatar">
            ${picture ? html`
              <img src="${picture}" alt="${name}">
            ` : html`
              <ha-icon icon="mdi:account"></ha-icon>
            `}
          </div>
          ${isHome ? html`
            <div class="person-home-indicator">
              <ha-icon icon="mdi:home"></ha-icon>
              </div>
            ` : nothing}
          </div>
        <div class="person-info">
          <div class="person-name">${name}</div>
          <div class="person-status">${isHome ? this._t('person.home') : person.state === 'not_home' ? this._t('person.away') : person.state}</div>

        </div>
        <div class="person-details">
            ${battery !== undefined ? html`
              <div class="person-battery">
                <ha-icon icon="mdi:battery${battery > 90 ? '' : battery > 60 ? '-70' : battery > 30 ? '-40' : battery > 10 ? '-20' : '-alert'}"></ha-icon>
                <span>${battery}%</span>
              </div>
            ` : nothing}
            ${distance && !isHome ? html`
              <div class="person-distance">
                <ha-icon icon="mdi:map-marker-distance"></ha-icon>
                <span>${distance}</span>
              </div>
            ` : nothing}
          </div>
      </div>
    `;
  }

  private _getPersonDeviceTracker(person: any): any {
    // Try to find associated device tracker
    const deviceTrackers = person.attributes.device_trackers || [];
    if (deviceTrackers.length > 0) {
      // Return the first device tracker that has battery info
      for (const trackerId of deviceTrackers) {
        const tracker = this.hass.states[trackerId];
        if (tracker?.attributes?.battery_level !== undefined) {
          return tracker;
        }
      }
      // If none have battery, return the first one
      return this.hass.states[deviceTrackers[0]];
    }
    return null;
  }

  private _getDistanceFromHome(deviceTracker: any): string | null {
    if (!deviceTracker || !deviceTracker.attributes.latitude || !deviceTracker.attributes.longitude) {
      return null;
    }

    // Get home location from Home Assistant config
    const homeLatitude = this.hass.config.latitude;
    const homeLongitude = this.hass.config.longitude;

    if (!homeLatitude || !homeLongitude) {
      return null;
    }

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = (deviceTracker.attributes.latitude - homeLatitude) * Math.PI / 180;
    const dLon = (deviceTracker.attributes.longitude - homeLongitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(homeLatitude * Math.PI / 180) * Math.cos(deviceTracker.attributes.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Format distance
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    } else {
      return `${distance.toFixed(1)} km`;
    }
  }

  private _renderHomeAlarm() {
    const alarmEntities = Object.values(this.hass.states).filter(
      entity =>
        entity.entity_id.startsWith('alarm_control_panel.') &&
        !this.hass.entities?.[entity.entity_id]?.hidden_by
    );

    if (alarmEntities.length === 0) return nothing;

    const alarm = alarmEntities[0];
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
    const favorites = this.config?.favorites || [];
    // Alleen beschikbare favorieten; geen balk als er niets te tonen is
    const available = favorites.filter(entityId => {
      const state = this.hass?.states[entityId];
      const registry = this.hass?.entities?.[entityId];
      return state && state.state !== 'unavailable' && state.state !== 'unknown' && !registry?.hidden_by;
    });
    if (available.length === 0) return nothing;

    return html`
      <div class="favorites-section">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <span>${this._t('favorites.title')}</span>
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
    const state = this.hass.states[entityId];
    const registry = this.hass.entities?.[entityId];
    if (!state || registry?.hidden_by) return nothing;

    return html`
      <div class="favorite-card-wrapper" data-entity="${entityId}">
        <!-- Card will be rendered here programmatically -->
      </div>
    `;
  }



  private _renderAreaView() {
    if (!this._selectedArea) return nothing;

    const area = this.config?.areas?.find(a => a.area_id === this._selectedArea);
    if (!area) return nothing;

    const areaEntities = this._getFilteredAreaEntities(this._selectedArea);
    const areaData = this._getCachedAreaData(area);

    return html`
      <div class="area-view">
        <div class="area-header">
          <h1 class="area-title">${area.name}</h1>
          ${this._renderUnavailableEntitiesIcon(area.area_id)}
          <button
            class="dd-edit-toggle ${this._editMode ? 'active' : ''}"
            title=${this._editMode ? this._t('layout.done_editing') : this._t('layout.edit_custom_cards')}
            @click=${this._toggleEditMode}
          >
            <ha-icon icon=${this._editMode ? 'mdi:check' : 'mdi:pencil'}></ha-icon>
          </button>
        </div>

        ${this._renderAreaBadges(area, areaEntities, areaData)}
        ${this._renderEntitiesSection(areaEntities)}
        ${this._renderCustomCards(area)}
      </div>
    `;
  }

  private _toggleEditMode = () => {
    this._editMode = !this._editMode;
  };

  // Eigen kaarten van de gebruiker per ruimte (read + edit affordances)
  private _renderCustomCards(area: AreaConfig) {
    const cards = this.config?.areas_options?.[area.area_id]?.cards || [];
    if (cards.length === 0 && !this._editMode) return nothing;

    return html`
      <div class="dd-custom-section">
        ${cards.length
          ? html`
              <div class="domain-header">
                <ha-icon icon="mdi:cards-outline"></ha-icon>
                <span>${this._t('layout.custom_cards')}</span>
              </div>
            `
          : nothing}
        <div class="dd-custom-grid">
          ${cards.map((card, i) => this._renderCustomCard(area.area_id, card, i))}
          ${this._editMode
            ? html`
                <button class="dd-add-card" @click=${() => this._addCard(area.area_id)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                  <span>${this._t('layout.add_card')}</span>
                </button>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderCustomCard(areaId: string, card: any, index: number) {
    // dd-card-host is een normaal custom element dat de hui-card imperatief in
    // z'n eigen light-DOM beheert → géén rauw element in Lit's repeat → geen crash.
    return html`
      <div class="dd-custom-card-wrap ${this._editMode ? 'editing' : ''}">
        <div class="dd-card-toolbar">
          <button title=${this._t('common.edit')} @click=${() => this._editCard(areaId, index)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button class="del" title=${this._t('common.delete')} @click=${() => this._deleteCard(areaId, index)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dd-card-host .hass=${this.hass} .config=${card}></dd-card-host>
      </div>
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

  private _addCard(areaId: string) {
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
            const cards = [...(this.config?.areas_options?.[areaId]?.cards || [])];
            cards.push(added);
            this._saveAreaCards(areaId, cards);
          }
        },
      });
    } else {
      this._addCardYaml(areaId);
    }
  }

  private _editCard(areaId: string, index: number) {
    const existing = this.config?.areas_options?.[areaId]?.cards?.[index];
    if (!existing) return;

    // Probeer HA's eigen visuele kaart-editor (formulier + code-toggle).
    if (customElements.get('hui-dialog-edit-card')) {
      this._fireNativeDialog('hui-dialog-edit-card', {
        lovelaceConfig: { views: [{ title: 'Dwains', cards: [existing] }] },
        path: [0, 0],
        saveConfig: (newConfig: any) => {
          const newCard = newConfig?.views?.[0]?.cards?.[0];
          if (newCard) {
            const cards = [...(this.config?.areas_options?.[areaId]?.cards || [])];
            cards[index] = newCard;
            this._saveAreaCards(areaId, cards);
          }
        },
      });
    } else {
      this._editCardYaml(areaId, index);
    }
  }

  private _addCardYaml(areaId: string) {
    showCardEditorDialog(this, {
      areaName: this.config?.areas?.find(a => a.area_id === areaId)?.name,
      onSave: (card) => {
        const cards = [...(this.config?.areas_options?.[areaId]?.cards || [])];
        cards.push(card);
        this._saveAreaCards(areaId, cards);
      },
    });
  }

  private _editCardYaml(areaId: string, index: number) {
    const existing = this.config?.areas_options?.[areaId]?.cards?.[index];
    if (!existing) return;
    showCardEditorDialog(this, {
      card: existing,
      areaName: this.config?.areas?.find(a => a.area_id === areaId)?.name,
      onSave: (card) => {
        const cards = [...(this.config?.areas_options?.[areaId]?.cards || [])];
        cards[index] = card;
        this._saveAreaCards(areaId, cards);
      },
    });
  }

  private _deleteCard(areaId: string, index: number) {
    if (!confirm(this._t('layout.delete_card_confirm'))) return;
    const cards = [...(this.config?.areas_options?.[areaId]?.cards || [])];
    if (index < 0 || index >= cards.length) return;
    cards.splice(index, 1);
    this._saveAreaCards(areaId, cards);
  }

  private _getDashboardUrlPath(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    if (!seg || seg === 'lovelace') return undefined;
    return seg;
  }

  private async _saveAreaCards(areaId: string, cards: any[]): Promise<void> {
    // Lokale config immutabel bijwerken (HA bevriest config-objecten)
    const prevOptions: any = this.config.areas_options || {};
    this.config = {
      ...this.config,
      areas_options: {
        ...prevOptions,
        [areaId]: { ...(prevOptions[areaId] || {}), cards },
      },
    };
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
              [areaId]: { ...(stratOptions[areaId] || {}), cards },
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
        <div class="area-badge light">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
          <span>${areaData.domains.light.on} on</span>
        </div>
      `);
    }

    // Switches count badge
    if (areaData.domains.switch && areaData.domains.switch.on > 0) {
      badges.push(html`
        <div class="area-badge switch">
          <ha-icon icon="mdi:flash"></ha-icon>
          <span>${areaData.domains.switch.on} on</span>
        </div>
      `);
    }

    // Climate count badge
    if (areaData.domains.climate && areaData.domains.climate.on > 0) {
      badges.push(html`
        <div class="area-badge climate">
          <ha-icon icon="mdi:thermostat"></ha-icon>
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
        <div class="area-badge motion active">
          <ha-icon icon="mdi:motion-sensor"></ha-icon>
                            <span>${motionEntities.length} active</span>
        </div>
      `);
    }

    // Covers count badge
    if (areaData.domains.cover && areaData.domains.cover.on > 0) {
      badges.push(html`
        <div class="area-badge cover">
          <ha-icon icon="mdi:garage-open"></ha-icon>
          <span>${areaData.domains.cover.on} open</span>
        </div>
      `);
    }

    // Media players count badge
    if (areaData.domains.media_player && areaData.domains.media_player.on > 0) {
      badges.push(html`
        <div class="area-badge media_player">
          <ha-icon icon="mdi:play-circle"></ha-icon>
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

  private _renderEntitiesSection(entities: EntityConfig[]) {
    if (entities.length === 0) return nothing;

    // Group entities by domain and device class for binary sensors
    const grouped = entities.reduce((acc, entity) => {
      const domain = entity.entity_id.split('.')[0];

      if (domain === 'binary_sensor') {
        // For binary sensors, group by device class
        const state = this.hass.states[entity.entity_id];
        const deviceClass = state?.attributes?.device_class || 'generic';

        // Special handling for motion sensors
        if (deviceClass === 'motion') {
          if (!acc['motion']) acc['motion'] = [];
          acc['motion'].push(entity);
        } else {
          // Other binary sensors stay in binary_sensor group
          if (!acc['binary_sensor']) acc['binary_sensor'] = [];
          acc['binary_sensor'].push(entity);
        }
      } else {
        // All other domains work as before
        if (domain && !acc[domain]) acc[domain] = [];
        if (domain && acc[domain]) acc[domain].push(entity);
      }
      return acc;
    }, {} as Record<string, EntityConfig[]>);

    return html`
      <div class="entities-section">
        ${Object.entries(grouped).map(([groupKey, domainEntities]) => {
          // Determine display name and icon based on group key
          let displayName: string;
          let displayIcon: string;

          if (groupKey === 'motion') {
            displayName = 'Motion';
            displayIcon = 'mdi:motion-sensor';
          } else {
            displayName = getDomainName(this.hass, groupKey);
            displayIcon = getDomainIcon(groupKey);
          }

          return html`
          <div class="domain-group">
            <div class="domain-header">
                <ha-icon icon=${displayIcon}></ha-icon>
                <span>${displayName}</span>
            </div>
            <div class="entities-grid">
              ${repeat(
                domainEntities,
                e => e.entity_id,
                entity => this._renderEntityCard(entity)
              )}
            </div>
          </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEntityCard(entity: EntityConfig) {
    const state = this.hass.states[entity.entity_id];
    if (!state) return nothing;

    // Via dd-card-host (eigen light-DOM) i.p.v. een rauw element + observer die
    // de Lit-beheerde wrapper direct manipuleert → geen 'nextSibling'-crash.
    return html`
      <div class="entity-card-wrapper">
        <dd-card-host
          .hass=${this.hass}
          .config=${this._entityCardConfig(entity.entity_id)}
        ></dd-card-host>
      </div>
    `;
  }

  private _entityCardConfig(entityId: string): any {
    return resolveEntityCardConfig({
      hass: this.hass,
      config: this.config,
      entity: entityId,
      surface: 'area_cards',
    });
  }

  private _loadEntityCard(wrapper: HTMLElement, entityId: string) {
    // Safety check: ensure wrapper still exists and is connected to DOM
    if (!wrapper || !wrapper.isConnected || !wrapper.parentNode) {
      return;
    }

    const state = this.hass.states[entityId];
    if (!state) return;

    const cardConfig = this._entityCardConfig(entityId);

    try {
    const card = document.createElement('hui-card') as any;
    card.hass = this.hass;
    card.config = cardConfig;

    // Cache the rendered card
    this._entityCardsCache.set(entityId, html`${card}`);

      // Safety check before DOM manipulation
      if (wrapper && wrapper.isConnected) {
    // Replace skeleton with actual card
    wrapper.innerHTML = '';
    wrapper.appendChild(card);
      }
    } catch (error) {
      console.warn(`Error loading entity card for ${entityId}:`, error);
    }
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
        name: totalWattage,
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
          if (registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') {
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
        if (registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config') {
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
      return !(registry?.hidden_by || registry?.entity_category === 'diagnostic' || registry?.entity_category === 'config');
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
    const entities = this._getAreaEntities(areaId);
    const unavailable: string[] = [];
    const unknown: string[] = [];

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

  // Note: getDomainTitle is now handled by the header-status-domains utility

  private _areAllEntitiesOff(entities: EntityConfig[], _domain: string): boolean {
    return entities.every(entity => {
      const state = this.hass.states[entity.entity_id];
      return !state || state.state === 'off' || state.state === 'unavailable';
    });
  }

  // Event Handlers
  private _selectView(view: 'home' | 'area') {
    this._selectedView = view;
    if (view === 'home') {
      this._selectedArea = null;
      this._editMode = false;
      this._updateUrlArea(null);
    }
    this._closeMobileNav();
  }

  private _selectArea(areaId: string) {
    this._selectedArea = areaId;
    this._selectedView = 'area';
    this._editMode = false;
    this._closeMobileNav();
    this._updateUrlArea(areaId);
  }

  private _toggleHeader() {
    this._headerExpanded = !this._headerExpanded;
  }

  private _toggleMobileNav() {
    this._mobileNavOpen = !this._mobileNavOpen;
  }

  private _renderFavoritesSection() {
    const favorites = this.config?.favorites || [];

    if (favorites.length === 0) {
      return nothing;
    }

    // Filter only available favorites
    const availableFavorites = favorites.filter(entityId => {
      const state = this.hass?.states[entityId];
      const registry = this.hass?.entities?.[entityId];
      return state && state.state !== 'unavailable' && state.state !== 'unknown' && !registry?.hidden_by;
    });

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
      <dd-tile-host class="favorite-tile-wrapper" .hass=${this.hass} entity="${entityId}"></dd-tile-host>
    `;
  }

  private async _renderFavoriteTileCards(): Promise<void> {
    if (!this.shadowRoot || !this.hass) return;
    if (!this._headerExpanded) return;
    const version = ++this._favoritesRenderVersion;

    const wrappers = this.shadowRoot?.querySelectorAll('dd-tile-host.favorite-tile-wrapper');
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

      // Hand off to dd-tile-host which safely manages lifecycle
      (wrapper as any).hass = this.hass;
    });
  }

  private async _renderHomeFavoriteCards(): Promise<void> {
    if (!this.shadowRoot || !this.hass) return;

    const wrappers = this.shadowRoot?.querySelectorAll('.favorite-card-wrapper');
    if (!wrappers) return;

    wrappers.forEach((wrapper: Element) => {
      // Safety check: ensure wrapper exists and is connected
      if (!wrapper || !wrapper.isConnected) {
        return;
      }

      const entityId = (wrapper as HTMLElement).dataset.entity;

      if (!entityId) return;

      // Only create card if it doesn't exist yet
      if (wrapper.querySelector('hui-tile-card')) {
        // Card already exists, just update its hass
        const existingCard = wrapper.querySelector('hui-tile-card') as any;
        if (existingCard && existingCard.hass !== undefined) {
          existingCard.hass = this.hass;
        }
        return;
      }

      const state = this.hass?.states[entityId];
      if (!state) return;

      try {
        // Create new tile card optimistically
        const card = document.createElement('hui-tile-card') as any;
        const friendlyName = state.attributes.friendly_name || entityId;
        const config = { entity: entityId, name: friendlyName };
        if ('setConfig' in card) {
          card.setConfig(config);
          card.hass = this.hass;
        } else {
          customElements.whenDefined('hui-tile-card').then(() => {
            try {
              if ('setConfig' in card) {
                card.setConfig(config);
                card.hass = this.hass;
              }
            } catch (e) {
              console.warn('Failed to finalize tile-card after upgrade:', e);
            }
          });
        }
        card.classList.add('favorite-tile');

        // Add click handler for more-info
        card.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          this._showMoreInfo(entityId);
        });

        // Safety check before DOM manipulation
        if (wrapper && wrapper.isConnected) {
          wrapper.appendChild(card);

          // Force update after appending
          requestAnimationFrame(() => {
            if (card.requestUpdate) {
              card.requestUpdate();
            }
          });
        }
      } catch (err) {
        console.error(`Error creating home favorite tile card for ${entityId}:`, err);
      }
    });
  }

  private _closeMobileNav() {
    this._mobileNavOpen = false;
  }

  private _showMoreInfo(entityId: string) {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private _handleStatusCardClick(domain: DomainCount) {
    if (domain.domain === 'person') {
      this._showPersonEntities();
    } else if (domain.domain === 'wattage') {
      this._showWattageEntities();
    } else if (domain.deviceClass) {
      this._showDeviceClassEntities(domain.deviceClass);
    } else {
      this._showDomainEntities(domain.domain);
    }
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

  private _showDeviceClassEntities(deviceClass: string) {
    showDomainEntitiesDialog(this, {
      domain: 'binary_sensor',
      config: this.config,
      deviceClass: deviceClass
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

    // Update all Home Assistant elements in the shadow DOM
    this.shadowRoot.querySelectorAll('*').forEach((el: any) => {
      if (el.hass !== undefined && el.hass !== newHass) {
        el.hass = newHass;
      }
    });

    // Update any hui-card elements specifically
    this.shadowRoot.querySelectorAll('hui-card, hui-tile-card, hui-entity-card, hui-thermostat-card, hui-picture-entity-card, hui-media-control-card').forEach((card: any) => {
      if (card.hass !== newHass) {
        card.hass = newHass;
      }
    });
  }

  private _clearEntityCardsCache(): void {
    // Clear the entity cards cache to force re-rendering with new data
    this._entityCardsCache.clear();
    this._areaDataCache.clear();
    // Also clear domain counts cache to prevent stale data
    this._domainCountsCache.clear();
    // Clear the external area data cache in utils/area.ts
    clearAreaDataCache();
  }

  private _updateAreaDataCache(): void {
    // Clear area data cache to ensure fresh calculations
    this._areaDataCache.clear();
    // Also clear the external area data cache
    clearAreaDataCache();
  }

  private _showDomainEntities(domain: string) {
    showDomainEntitiesDialog(this, {
      domain,
      config: this.config
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

  private async _toggleAreaLights(areaId: string) {
    const confirmed = await this._showConfirmation(
      'Toggle Lights',
      'Are you sure you want to toggle all lights in this area?'
    );

    if (!confirmed) return;

    const entities = this._getFilteredAreaEntities(areaId);
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));
    const allOff = this._areAllEntitiesOff(lights, 'light');

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = lights.map(e => e.entity_id);

    await this.hass.callService('light', service, {
      entity_id: entityIds
    });

    this._showToast(`All lights turned ${allOff ? 'on' : 'off'}`);
  }

  private async _toggleAreaSwitches(areaId: string) {
    const confirmed = await this._showConfirmation(
      'Toggle Switches',
      'Are you sure you want to toggle all switches in this area?'
    );

    if (!confirmed) return;

    const entities = this._getFilteredAreaEntities(areaId);
    const switches = entities.filter(e => e.entity_id.startsWith('switch.'));
    const allOff = this._areAllEntitiesOff(switches, 'switch');

    const service = allOff ? 'turn_on' : 'turn_off';
    const entityIds = switches.map(e => e.entity_id);

    await this.hass.callService('switch', service, {
      entity_id: entityIds
    });

    this._showToast(`All switches turned ${allOff ? 'on' : 'off'}`);
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
    'dwains-layout-card': DwainsLayoutCard;
  }
}
