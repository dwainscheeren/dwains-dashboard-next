import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { getDomainName } from '../utils/domain-names';
import { getDeviceClassIcon, getDomainColor, getDomainIcon } from '../utils/icons';
import { ddLocale, ddLocalize, ddLocalizePlural } from '../utils/localize';
import { fireEvent } from './utils/fire-event';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../utils/unit-format';
import { stripAreaNameFromEntityName } from '../utils/entity-names';
import { sortAreas } from '../utils/area-entities';
import { findReplacementAssignment } from '../utils/blueprint-replacements';
import './utils/dd-card-host';
import './dwains-person-tile';
import './ui/dd-ui-primitives';
import { renderCompactDeviceTile } from './ui/dd-entity-tiles';

export interface DomainEntitiesDialogParams {
  domain: string;
  areaId?: string;
  config: DwainsDashboardConfig;
  filterByUnitOfMeasurement?: string;
  deviceClass?: string;
  entityIds?: string[];
  viewAllLabel?: string;
  onViewAll?: () => void;
  /** Home-information popup; room/device presentation is chosen per caller. */
  homeInformation?: boolean;
  homeInformationPresentation?: 'room' | 'devices';
  /** Concrete Devices-tab key used for matching header icon/color (e.g. cover_shading). */
  deviceViewKey?: string;
  customTitle?: string;
  customEntities?: string[];
  customDescription?: string;
}

interface GroupedEntities {
  [areaId: string]: {
    areaName: string;
    entities: EntityConfig[];
  };
}

type BulkDomainAction = 'turn_on' | 'turn_off' | 'open_cover' | 'close_cover' | 'lock' | 'unlock';
const OPTIMISTIC_ENTITY_STATE_TTL = 5000;

interface OptimisticEntityState {
  state: string;
  expiresAt: number;
}

@customElement('dwains-dashboard-next-domain-entities-dialog')
export class DwainsDomainEntitiesDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _params?: DomainEntitiesDialogParams;
  @state() private _groupedEntities: GroupedEntities = {};
  @state() private _loading = true;
  @state() private _optimisticEntityStates: Record<string, OptimisticEntityState> = {};

  private _entityCards = new Map<string, HTMLElement>();
  private _updateInterval?: number;
  private _optimisticCleanupTimer?: number;

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, vars);
  }

  private _tp(key: string, count: number): string {
    return ddLocalizePlural(this.hass, key, count);
  }

  static override styles = css`
    :host {
      --mdc-dialog-min-width: 90vw;
      --mdc-dialog-max-width: 1200px;
      --mdc-dialog-max-height: 90vh;
      --mdc-dialog-z-index: 10;
      --dialog-backdrop-opacity: 0.4;
      -webkit-tap-highlight-color: transparent;
    }

    .content {
      padding: 16px 18px 22px !important;
      background: var(--primary-background-color);
    }

    .area-section {
      margin-bottom: 18px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      border-radius: 16px;
      overflow: hidden;
      box-shadow:
        0 14px 34px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .area-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 0;
      background: transparent;
      border-bottom: 0;
    }

    .area-header:has(.area-icon) {
      gap: 12px;
    }

    .area-header:not(:has(.area-icon)) {
      gap: 0;
    }

    .area-icon {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .area-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .area-name {
      font-size: 18px;
      font-weight: 850;
      flex: 1;
    }

    .entity-count {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 750;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(164px, 1fr));
      gap: 12px;
      padding: 16px;
    }

    .domain-todo-list-card {
      grid-column: 1 / -1;
      min-width: 0;
    }

    .domain-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .domain-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin: 0 0 16px;
    }

    .domain-action-button {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.07),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .domain-action-button:hover {
      transform: translateY(-1px);
      box-shadow:
        0 14px 26px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.07);
    }

    .domain-action-button:active {
      transform: scale(0.97);
    }

    .domain-action-button ha-icon {
      --mdc-icon-size: 18px;
      color: var(--domain-color, var(--primary-color));
    }

    .dialog-view-all {
      min-height: 40px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      font: inherit;
      font-size: 13px;
      font-weight: 850;
      cursor: pointer;
      transition: transform 0.18s ease, background 0.18s ease;
    }

    .dialog-view-all:hover {
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      transform: translateY(-1px);
    }

    .dialog-view-all:active {
      transform: scale(0.97);
    }

    .dialog-view-all ha-icon {
      --mdc-icon-size: 18px;
    }

    .domain-entity-toggle {
      width: 38px;
      height: 22px;
      justify-content: flex-start;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
    }

    .domain-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
    }

    .domain-entity-more,
    .domain-lock-action {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .domain-lock-action.is-unlocked {
      color: #ffffff;
      background: var(--entity-color);
      box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
    }

    .domain-entity-more ha-icon,
    .domain-lock-action ha-icon {
      --mdc-icon-size: 17px;
    }

    .domain-entity-meta {
      margin-bottom: 3px;
      color: color-mix(in srgb, var(--secondary-text-color) 78%, transparent);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      font-size: 16px;
      opacity: 0.6;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-state ha-icon {
      --mdc-icon-size: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .empty-state-text {
      font-size: 16px;
      opacity: 0.6;
    }

    .custom-description {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--warning-color);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .custom-description ha-icon {
      --mdc-icon-size: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .custom-description p {
      margin: 0;
      line-height: 1.5;
      font-size: 14px;
    }

    /* Responsive design */
    /* Shared Home-information dialog language, aligned with the power detail dialog. */
    :host {
      --mdc-dialog-max-width: 900px;
    }

    .content {
      padding: 14px 16px 18px !important;
      background: var(--primary-background-color);
    }

    .domain-actions {
      margin-bottom: 12px;
    }

    .dialog-view-all,
    .domain-action-button {
      min-height: 36px;
      border-radius: 999px;
      font-size: 12px;
    }

    .area-section {
      margin-bottom: 12px;
      border-radius: 11px;
      background: var(--card-background-color);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent),
        0 8px 22px rgba(15, 23, 42, 0.04);
    }

    .area-header {
      min-height: 48px;
      padding: 10px 12px 0;
    }

    .area-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
    }

    .area-icon ha-icon {
      --mdc-icon-size: 17px;
    }

    .area-name {
      font-size: 15px;
      font-weight: 850;
    }

    .entity-count {
      font-size: 11px;
    }

    .entities-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 9px;
      padding: 10px 12px 12px;
    }

    @media (max-width: 900px) and (min-width: 601px) {
      .entities-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    .dialog-header-destination {
      min-height: 30px;
      padding: 0 10px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
      font: inherit;
      font-size: 11px;
      font-weight: 850;
      cursor: pointer;
    }
    .dialog-header-destination:hover {
      background: color-mix(in srgb, var(--primary-color) 15%, var(--card-background-color));
    }
    .dialog-header-destination ha-icon { --mdc-icon-size: 16px; }

    .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }

    /* Final house-information dialog consistency pass. */
    :host {
      --mdc-dialog-max-width: 760px;
    }

    .dialog-header-destination {
      flex: 0 0 auto;
      min-height: 30px !important;
      padding: 0 10px !important;
      font-size: 11px !important;
      white-space: nowrap !important;
    }

    .content {
      padding: 14px 16px 18px !important;
    }

    .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }

    .domain-entity-name,
    .domain-entity-meta,
    .domain-entity-status {
      max-width: 100% !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }

    .domain-entity-meta {
      font-size: 10px !important;
    }


    .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .domain-entity-name,
    .domain-entity-meta,
    .domain-entity-status {
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }



    /* Room-header status dialogs use the same compact card language as room views. */
    .content.room-context {
      padding: 14px 16px 28px !important;
      overflow: auto !important;
    }

    .content.room-context .area-section {
      margin-bottom: 8px !important;
      overflow: visible !important;
      border-radius: 10px !important;
      background: var(--card-background-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
    }

    .content.room-context .area-header {
      min-height: 42px !important;
      padding: 7px 10px 0 !important;
      gap: 8px !important;
    }

    .content.room-context .area-icon {
      width: 30px !important;
      height: 30px !important;
      border-radius: 8px !important;
    }

    .content.room-context .area-name {
      font-size: 14px !important;
      font-weight: 850 !important;
    }

    .content.room-context .entities-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 8px !important;
      padding: 8px 10px 12px !important;
      overflow: visible !important;
    }

    .content.room-context.custom-entities-context .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }

    @media (max-width: 1000px) and (min-width: 601px) {
      .content.room-context .entities-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
    }


    .area-master-toggle {
      display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto;
      padding: 4px 7px; border: 1px solid var(--divider-color);
      border-radius: 999px; background: var(--card-background-color);
      color: var(--secondary-text-color); font: inherit; font-size: 12px;
      font-weight: 750; cursor: pointer;
    }
    .area-master-track {
      width: 31px; height: 18px; position: relative; display: inline-block;
      border-radius: 999px; background: color-mix(in srgb,var(--primary-text-color) 20%,transparent);
    }
    .area-master-track::after {
      content: ''; position:absolute; top:2px; left:2px; width:14px; height:14px;
      border-radius: 50%; background: #fff; transition:transform .18s;
    }
    .area-master-track.is-on { background: var(--entity-color); }
    .area-master-track.is-on::after { transform:translateX(13px); }

    /* Room-view alignment: shared layout language for room groups and entity rows. */
    .dialog-global-actions .domain-actions {
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 0 14px;
    }
    .area-section {
      border-radius: 14px !important;
      padding: 12px !important;
      background: var(--card-background-color) !important;
    }
    .area-header { padding: 0 0 10px !important; min-height: 40px !important; }
    .entities-grid {
      padding: 0 !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }
    @media (min-width: 601px) and (max-width: 1000px) {
      .entities-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
    }

    /* The modal grows with its actual content, not with the entire viewport. */
    .area-group-actions { padding: 8px 12px 0; }
    .area-group-actions .domain-actions { margin: 0; flex-wrap: wrap; }

    /* Shared room-style entity layout: desktop 2–3 columns, mobile one flat row per entity. */
    .entities-grid, .content.room-context .entities-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
    @media (max-width: 1000px) and (min-width: 601px) {
      .entities-grid, .content.room-context .entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
    }

    /* Home-information popups mirror the current room/device presentation.
       Desktop room tiles are compact horizontal rows; mobile room tiles use
       the same vertical card language as the mobile room view. */
    .content.home-information-context .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
      padding: 8px 10px 10px !important;
    }

    .content.home-information-context .area-section {
      padding: 0 !important;
      margin-bottom: 10px !important;
      border-radius: 12px !important;
    }

    .content.home-information-context .area-sections-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      align-items: start;
    }

    .content.home-information-context .area-sections-grid .area-section {
      grid-column: 1 / -1;
      margin-bottom: 0 !important;
      min-width: 0;
    }

    .content.home-information-context .area-sections-grid .area-section.half-room {
      grid-column: span 1;
    }

    .content.home-information-context .area-sections-grid .area-section.half-room .entities-grid {
      grid-template-columns: 1fr !important;
    }

    .content.home-information-context .area-header {
      min-height: 38px !important;
      padding: 7px 10px 0 !important;
      gap: 8px !important;
    }

    .content.home-information-context .area-icon {
      width: 28px !important;
      height: 28px !important;
      border-radius: 8px !important;
    }

    .content.home-information-context .area-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .content.home-information-context .area-name {
      font-size: 14px !important;
    }

    .content.home-information-context .area-master-toggle {
      min-height: 28px;
      padding: 3px 6px;
      font-size: 11px;
    }

    /* Persons and indoor/outdoor climate deliberately use the same Lovelace
       cards as their Devices view rather than room-view tiles. */
    .content.home-information-context.device-presentation-context .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: start !important;
      gap: 10px !important;
    }

    /* Match the Devices view's domain-specific grids instead of forcing all
       Home Information popups into one generic two-column layout. */
    .content.home-information-context.device-presentation-context.domain-cover .entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)) !important;
      gap: 12px !important;
    }

    .content.home-information-context.device-presentation-context.domain-climate .entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
      gap: 8px !important;
    }

    /* A single device in a half-width room needs the whole room width.
       Two narrow card columns collapse native climate and cover controls. */
    @media (min-width: 769px) {
      .content.home-information-context.device-presentation-context .shared-room-group.half-room .entities-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }
      .content.home-information-context.device-presentation-context .shared-room-group.full-room .entities-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
    }

    /* Same person tile as Geräte > Personen; the popup only changes the grid. */
    .content.home-information-context.device-presentation-context.domain-person .area-sections-grid {
      display: block !important;
    }

    .content.home-information-context.device-presentation-context.domain-person .area-section {
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .content.home-information-context.device-presentation-context.domain-person .entities-grid,
    .content.home-information-context.device-presentation-context.domain-person .area-sections-grid .area-section.half-room .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: start !important;
      gap: 8px !important;
      padding: 0 !important;
    }

    .content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile {
      --dd-person-tile-location-height: 248px;
      --dd-person-map-height: 186px;
    }


    /* Shared device-presentation structure. These selectors own layout only;
       the visual card/group rules live inside the shared primitives. */
    .content.home-information-context.device-presentation-context .area-sections-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: start;
    }

    .content.home-information-context.device-presentation-context .shared-room-group {
      min-width: 0;
      grid-column: 1 / -1;
    }

    .content.home-information-context.device-presentation-context .shared-room-group.half-room {
      grid-column: span 1;
    }

    .content.home-information-context.device-presentation-context .shared-room-group .entities-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      padding: 0 !important;
    }

    .content.home-information-context.device-presentation-context.domain-cover .shared-room-group .entities-grid,
    .content.home-information-context.device-presentation-context.domain-sensor .shared-room-group .entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    }

    .content.home-information-context.device-presentation-context.domain-person .area-sections-grid {
      display: block;
    }

    .content.home-information-context.device-presentation-context.domain-person .area-section {
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .content.home-information-context.device-presentation-context.domain-person .entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
      gap: 10px !important;
      padding: 0 !important;
    }

  

    /* Home Information device groups follow the Devices view: one room per
       row, with responsive columns for entity tiles. Keep the special
       person, room-climate and energy presentations unchanged. */
    @media (min-width: 769px) {
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .area-sections-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 12px !important;
      }
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .shared-room-group {
        grid-column: 1 / -1 !important;
        min-width: 0;
      }
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .shared-room-group .entities-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }
    }
    @media (min-width: 2000px) {
      dd-next-popup-shell.room-columns {
        --dd-popup-wide-width: 1280px;
      }
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .shared-room-group .entities-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
    }
    @media (max-width: 768px) {
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .area-sections-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .shared-room-group {
        grid-column: 1 / -1 !important;
      }
      .content.home-information-context.device-presentation-context:not(.domain-person):not(.domain-sensor) .shared-room-group .entities-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }
    }

    /* One mobile contract for all domain/entity dialogs.
       The shared popup shell owns viewport height, safe-area and scrolling. */
    @media (max-width: 600px) {
      .content {
        padding: 12px !important;
      }

      .dialog-header-destination {
        min-height: 28px !important;
        padding: 0 8px !important;
        max-width: 100%;
        font-size: 10px !important;
        white-space: nowrap;
      }

      .entities-grid,
      .content.room-context .entities-grid,
      .content.room-context.custom-entities-context .entities-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 10px;
      }

      .dialog-global-actions .domain-actions {
        justify-content: center;
      }

      /* Generic Home Information tiles keep the compact two-column card view. */
      .content.home-information-context:not(.device-presentation-context) .entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      /* Device-presentation Home Information uses the exact shared Devices components. */
      .content.home-information-context.device-presentation-context .area-sections-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .content.home-information-context.device-presentation-context .shared-room-group,
      .content.home-information-context.device-presentation-context .shared-room-group.half-room {
        grid-column: 1;
      }

      .content.home-information-context.device-presentation-context .shared-room-group .entities-grid,
      .content.home-information-context.device-presentation-context.domain-cover .shared-room-group .entities-grid,
      .content.home-information-context.device-presentation-context.domain-sensor .shared-room-group .entities-grid {
        grid-template-columns: 1fr !important;
        padding: 0 !important;
      }

      .content.home-information-context.device-presentation-context.domain-climate .shared-room-group .entities-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px !important;
      }

      .content.home-information-context.device-presentation-context.domain-person .entities-grid {
        grid-template-columns: 1fr !important;
        padding: 0 !important;
      }

      .content.home-information-context.device-presentation-context.domain-person .area-section,
      .content.home-information-context.device-presentation-context.domain-person .area-section.half-room,
      .content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile {
        width: 100% !important;
        max-width: none !important;
        min-width: 0;
      }

      .content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile {
        --dd-person-tile-location-height: 160px;
        --dd-person-map-height: 98px;
      }
    }
`;

  public async showDialog(params: DomainEntitiesDialogParams): Promise<void> {
    this._params = params;
    this._loading = true;
    await this._loadEntities();
  }

  public closeDialog(): void {
    this._params = undefined;
    this._groupedEntities = {};
    this._optimisticEntityStates = {};
    this._entityCards.clear();
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = undefined;
    }
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
    fireEvent(this, 'dialog-closed', { dialog: this.localName });
  }

  protected override updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.hass && this._params && !this._loading) {
      this._reconcileOptimisticEntityStates();
      this._updateEntityCards();
    }

  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._optimisticCleanupTimer !== undefined) {
      window.clearTimeout(this._optimisticCleanupTimer);
      this._optimisticCleanupTimer = undefined;
    }
  }

  private async _loadEntities(): Promise<void> {
    if (!this._params || !this.hass) return;

    const { domain, areaId, config, filterByUnitOfMeasurement, deviceClass, entityIds } = this._params;
    const grouped: GroupedEntities = {};
    const entityIdFilter = entityIds?.length ? new Set(entityIds) : undefined;

    // Get all areas
    const areas = config.areas || [];
    const areasMap = new Map(areas.map(area => [area.area_id, area]));

    // Get all Home Assistant entities instead of just configured ones
    const allHassEntities = Object.values(this.hass.states);

    // Filter entities from all HA entities
    const entities: EntityConfig[] = [];

    allHassEntities.forEach(entityState => {
      const entityId = entityState.entity_id;
      if (entityIdFilter && !entityIdFilter.has(entityId)) return;
      const registry = this.hass.entities?.[entityId];
      if (registry?.hidden_by) return;
      const entityDomain = entityId.split('.')[0];

      // Check domain
      if (entityDomain !== domain) return;

      // Check state availability
      if (!entityState || entityState.state === 'unavailable') return;

      // Find the area of this entity (same logic as original version)
      const entityReg = config.entities?.find(e => e.entity_id === entityId);
      const deviceReg = entityReg && entityReg.device_id ?
        config.devices?.find(d => d.device_id === entityReg.device_id) : null;
      const registryArea = this.hass?.entities?.[entityId]?.area_id;
      const registryDeviceId = this.hass?.entities?.[entityId]?.device_id;
      const registeredDeviceArea = registryDeviceId ? this.hass?.devices?.[registryDeviceId]?.area_id : undefined;
      const configuredDeviceArea = registryDeviceId
        ? config.devices?.find(device => device.device_id === registryDeviceId)?.area_id
        : undefined;
      const entityAreaId = registryArea || entityReg?.area_id || deviceReg?.area_id ||
        configuredDeviceArea || registeredDeviceArea || entityState.attributes?.area_id;

      // Persons are grouped by presence/location and therefore do not need
      // an HA area assignment. Area-based domains still require one.
      if (domain !== 'person' && !entityAreaId) return;

      // Check area filter if specified
      if (areaId && entityAreaId !== areaId) return;

      // Check if area exists for area-based domains.
      if (domain !== 'person' && (!entityAreaId || !areasMap.has(entityAreaId) || (config.areas_display?.hidden || []).includes(entityAreaId))) return;

      // Check if entity is hidden
      const groupKey = entityDomain;
      const hiddenEntities = entityAreaId
        ? config.areas_options?.[entityAreaId]?.groups_options?.[groupKey]?.hidden || []
        : [];
      if (hiddenEntities.includes(entityId)) return;

      // Apply unit_of_measurement filter if specified
      if (filterByUnitOfMeasurement) {
        if (entityState.attributes?.unit_of_measurement !== filterByUnitOfMeasurement) {
          return;
        }
      } else {
        // Device class filtering is still applied, but the dialog should show
        // all available entities so users can control off/closed items too.
        if (domain === 'binary_sensor' && deviceClass) {
          const entityDeviceClass = entityState.attributes?.device_class;
          if (entityDeviceClass !== deviceClass) return;
        }
      }

      // Create EntityConfig-like object
      entities.push({
        entity_id: entityId,
        ...(entityAreaId ? { area_id: entityAreaId } : {}),
        hidden: false
      });
    });

    // Group by area (or by status for persons)
    entities.forEach(entity => {
      if (domain === 'person') {
        const groupKey = 'people';
        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            areaName: this._t('home.people'),
            entities: []
          };
        }
        grouped[groupKey].entities.push(entity);
      } else {
        // For other domains, group by area as usual
        const areaId = entity.area_id!;
        const area = areasMap.get(areaId);
        if (!area) return;

        if (!grouped[areaId]) {
          grouped[areaId] = {
            areaName: area.name,
            entities: []
          };
        }
        grouped[areaId].entities.push(entity);
      }
    });

    this._groupedEntities = grouped;
    this._loading = false;

    // Start update interval for live updates
    if (!this._updateInterval) {
      this._updateInterval = window.setInterval(() => {
        this._checkForEntityChanges();
      }, 1000);
    }
  }

  private _checkForEntityChanges(): void {
    if (!this._params || !this.hass || this._loading) return;

    const { domain, filterByUnitOfMeasurement, deviceClass } = this._params;
    let needsReload = false;

    // Check if any entities need to be added or removed
    Object.entries(this._groupedEntities).forEach(([_areaId, group]) => {
      group.entities.forEach(entity => {
        const state = this.hass!.states[entity.entity_id];
        if (!state) {
          needsReload = true;
          return;
        }

        const shouldBeVisible = this._shouldEntityBeVisible(state, domain, filterByUnitOfMeasurement, deviceClass);
        if (!shouldBeVisible) {
          needsReload = true;
        }
      });
    });

    if (needsReload) {
      this._loadEntities();
    }
  }

  private _shouldEntityBeVisible(entityState: any, domain: string, filterByUnitOfMeasurement?: string, deviceClass?: string): boolean {
    if (entityState.state === 'unavailable') return false;

    // Check unit_of_measurement filter if specified
    if (filterByUnitOfMeasurement) {
      if (entityState.attributes?.unit_of_measurement !== filterByUnitOfMeasurement) {
        return false;
      }
      return true;
    }

    if (domain === 'binary_sensor' && deviceClass) {
      return entityState.attributes?.device_class === deviceClass;
    }

    return true;
  }

  private _updateEntityCards(): void {
    this._entityCards.forEach((card, _entityId) => {
      if (card && 'hass' in card) {
        card.hass = this.hass;
      }
    });
  }

  render() {
    if (!this._params) return nothing;

    const { domain, filterByUnitOfMeasurement, deviceClass, customTitle } = this._params;
    let domainTitle = customTitle || this._getLocalizedDomainTitle(domain);
    if (filterByUnitOfMeasurement === 'W') {
      domainTitle = this._t('dialog.power_sensors');
    } else if (deviceClass && !customTitle) {
      const deviceClassTitles: Record<string, string> = {
        motion: this._t('dialog.motion_sensors'),
        door: this._t('dialog.door_sensors'),
        window: this._t('dialog.window_sensors'),
        smoke: this._t('dialog.smoke_sensors'),
        gas: this._t('dialog.gas_sensors'),
        moisture: this._t('dialog.moisture_sensors'),
        occupancy: this._t('dialog.occupancy_sensors'),
        opening: this._t('dialog.opening_sensors'),
        presence: this._t('dialog.presence_sensors'),
        safety: this._t('dialog.safety_sensors'),
        tamper: this._t('dialog.tamper_sensors'),
        vibration: this._t('dialog.vibration_sensors')
      };
      domainTitle = deviceClassTitles[deviceClass] || this._getLocalizedDomainTitle(domain);
    }

    const deviceViewKey = this._params?.deviceViewKey;
    const headerIcon = filterByUnitOfMeasurement === 'W'
      ? 'mdi:flash'
      : deviceViewKey === 'cover_openings'
        ? 'mdi:door-open'
        : deviceViewKey === 'cover_shading'
          ? 'mdi:blinds-horizontal'
          : deviceViewKey === 'cover_gates'
            ? 'mdi:gate'
            : getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain);
    const headerColor = filterByUnitOfMeasurement === 'W'
      ? getDomainColor('wattage')
      : deviceViewKey && deviceViewKey.startsWith('cover_')
        ? getDomainColor('cover')
        : this._entityColor(domain, deviceClass);

    return html`
      <dd-next-popup-shell
        open
        wide
        class=${this._params?.homeInformation && this._params?.homeInformationPresentation === 'devices' && !['person', 'sensor'].includes(domain) ? 'room-columns' : ''}
        .titleText=${domainTitle}
        .icon=${headerIcon}
        .accent=${headerColor}
        .closeLabel=${this._t('common.close')}
        @dd-close=${() => this.closeDialog()}
      >
        ${this._params?.onViewAll ? html`
          <button slot="header-extra" class="dialog-header-destination" type="button" @click=${this._handleViewAll}>
            <span>${this._params.viewAllLabel || 'Open device view'}</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        ` : nothing}

        <div class="content ${this._params?.areaId ? 'room-context' : ''} ${this._params?.customEntities ? 'custom-entities-context' : ''} ${this._params?.homeInformation ? 'home-information-context' : ''} ${this._params?.homeInformationPresentation === 'devices' ? 'device-presentation-context' : ''} ${this._params?.domain ? `domain-${this._params.domain}` : ''}">
          ${this._loading
            ? html`<div class="loading">${this._t('common.loading')}</div>`
            : this._renderContent()
          }
        </div>
      </dd-next-popup-shell>
    `;
  }

  private _renderContent() {
    // Handle custom entities (for unavailable entities modal)
    if (this._params?.customEntities) {
      return this._renderCustomEntities();
    }

    const entities = this._allDialogEntities();
    const entityCount = entities.length;

    if (entityCount === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t('dialog.active_empty')}
          </div>
        </div>
      `;
    }

    return html`
      <div class="dialog-global-actions">${this._renderDomainActions(entities)}</div>
      <div class="area-sections-grid">
        ${repeat(
          this._orderedGroupedEntries(),
          ([areaId]) => areaId,
          ([areaId, group]) => this._renderAreaSection(areaId, group)
        )}
      </div>
    `;
  }

  private _orderedGroupedEntries(): Array<[string, GroupedEntities[string]]> {
    const entries = Object.entries(this._groupedEntities) as Array<[string, GroupedEntities[string]]>;
    if (!this._params?.homeInformation || this._params.domain === 'person') return entries;

    const config = this._params.config;
    const orderedAreas = sortAreas(config?.areas || [], config?.areas_display, ddLocale(this.hass));
    const areaOrder = new Map(orderedAreas.map((area, index) => [area.area_id, index]));

    return [...entries].sort(([aId, a], [bId, b]) => {
      const aOrder = areaOrder.get(aId) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = areaOrder.get(bId) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.areaName.localeCompare(b.areaName);
    });
  }

  private _handleViewAll = (): void => {
    const action = this._params?.onViewAll;
    this.closeDialog();
    // The HA dialog host tears down its overlay asynchronously. Navigate once
    // its close handlers have completed, otherwise the view can reset to Home.
    if (action) window.setTimeout(action, 0);
  };

  private _renderCustomEntities() {
    const { customEntities, customDescription } = this._params!;

    if (!customEntities || customEntities.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t('dialog.problem_empty')}
          </div>
        </div>
      `;
    }

    return html`
      ${customDescription ? html`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${customDescription}</p>
        </div>
      ` : nothing}

      <div class="entity-section">
        <div class="entities-grid">
          ${repeat(
            customEntities,
            entityId => entityId,
            entityId => this._renderEntityCard({ entity_id: entityId, hidden: false })
          )}
        </div>
      </div>
    `;
  }

  private _allDialogEntities(): EntityConfig[] {
    return Object.values(this._groupedEntities).flatMap(group => group.entities);
  }

  private _renderDomainActions(entities: EntityConfig[]) {
    const domain = this._params?.domain || '';
    const entityIds = entities
      .map(entity => entity.entity_id)
      .filter(entityId => this.hass.states[entityId]);

    if (!entityIds.length) return nothing;

    const color = this._entityColor(domain);
    const actionButton = (label: string, icon: string, action: BulkDomainAction) => html`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${color};`}
        @click=${() => this._runBulkDomainAction(entityIds, action, label)}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span>${label}</span>
      </button>
    `;

    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.turn_on_all'), 'mdi:power', 'turn_on')}
          ${actionButton(this._t('action.turn_off_all'), 'mdi:power-off', 'turn_off')}
        </div>
      `;
    }

    if (domain === 'cover') {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.open_all'), 'mdi:arrow-up', 'open_cover')}
          ${actionButton(this._t('action.close_all'), 'mdi:arrow-down', 'close_cover')}
        </div>
      `;
    }

    if (domain === 'lock') {
      return html`
        <div class="domain-actions">
          ${actionButton(this._t('action.unlock_all'), 'mdi:lock-open-variant-outline', 'unlock')}
          ${actionButton(this._t('action.lock_all'), 'mdi:lock-outline', 'lock')}
        </div>
      `;
    }

    return nothing;
  }

  private _renderAreaSection(_areaId: string, group: { areaName: string; entities: EntityConfig[] }) {
    let areaIcon = '';
    if (this._params?.config?.areas) {
      const area = this._params.config.areas.find(a => a.area_id === _areaId);
      if (area?.icon) areaIcon = area.icon;
    }

    const kind = this._params?.domain || '';
    const devicePresentation =
      this._params?.homeInformationPresentation === 'devices' &&
      this._params?.homeInformation === true;
    const showAreaHeader = kind !== 'person';
    const activeCount = group.entities.filter(entity => {
      const state = this.hass.states[entity.entity_id];
      return state && this._isEntityActiveForUi(state, kind);
    }).length;
    const allOn = activeCount === group.entities.length && group.entities.length > 0;
    const roomEntityIds = group.entities.map(entity => entity.entity_id);
    const compactRoom = group.entities.length <= 2;

    if (devicePresentation && showAreaHeader) {
      const domain = kind === 'cover' ? 'cover' : kind;
      const toggleDomain = ['light', 'switch', 'fan', 'input_boolean'].includes(domain);
      const segmentedItems = domain === 'cover'
        ? [
            { action: 'open_cover', label: this._t('action.open_all'), icon: 'mdi:arrow-up', active: activeCount > 0 },
            { action: 'close_cover', label: this._t('action.close_all'), icon: 'mdi:arrow-down', active: activeCount === 0 },
          ]
        : domain === 'lock'
          ? [
              { action: 'lock', label: this._t('action.lock_all'), icon: 'mdi:lock-outline', active: activeCount === 0 },
              { action: 'unlock', label: this._t('action.unlock_all'), icon: 'mdi:lock-open-variant-outline', active: activeCount > 0 },
            ]
          : [];

      return html`
        <dd-next-room-group
          class="shared-room-group ${compactRoom ? 'half-room' : 'full-room'}"
          data-entity-count=${Math.min(group.entities.length, 4)}
          .name=${group.areaName}
          icon="mdi:floor-plan"
          .accent=${this._entityColor(domain)}
          .compact=${compactRoom}
        >
          ${toggleDomain && group.entities.length > 1 ? html`
            <dd-next-room-actions
              slot="actions"
              mode="toggle"
              .accent=${this._entityColor(domain)}
              .activeCount=${activeCount}
              .totalCount=${group.entities.length}
              .toggleOnLabel=${this._t('action.turn_on_all')}
              .toggleOffLabel=${this._t('action.turn_off_all')}
              @dd-action=${(event: CustomEvent<{ action: string }>) => {
                const action = event.detail.action as BulkDomainAction;
                void this._runBulkDomainAction(
                  roomEntityIds,
                  action,
                  action === 'turn_off' ? this._t('action.turn_off_all') : this._t('action.turn_on_all'),
                  false
                );
              }}
            ></dd-next-room-actions>
          ` : segmentedItems.length ? html`
            <dd-next-room-actions
              slot="actions"
              mode="segmented"
              .accent=${this._entityColor(domain)}
              .items=${segmentedItems}
              @dd-action=${(event: CustomEvent<{ action: string }>) => {
                const action = event.detail.action as BulkDomainAction;
                const label = segmentedItems.find(item => item.action === action)?.label || action;
                void this._runBulkDomainAction(roomEntityIds, action, label, false);
              }}
            ></dd-next-room-actions>
          ` : nothing}
          <div class="entities-grid">
            ${repeat(
              group.entities,
              entity => entity.entity_id,
              entity => this._renderEntityCard(entity)
            )}
          </div>
        </dd-next-room-group>
      `;
    }

    const bulkToggle = ['light', 'switch', 'fan', 'input_boolean'].includes(kind);
    return html`
      <div class="area-section ${compactRoom ? 'half-room' : 'full-room'}">
        ${showAreaHeader ? html`<div class="area-header">
          ${areaIcon ? html`
            <div class="area-icon"><ha-icon icon="${areaIcon}"></ha-icon></div>
          ` : nothing}
          <div class="area-name">${group.areaName}</div>
          ${bulkToggle ? html`
            <button class="area-master-toggle" type="button"
              style=${`--entity-color: ${this._entityColor(kind)};`}
              title=${allOn ? this._t('action.turn_off_all') : this._t('action.turn_on_all')}
              @click=${(event: Event) => {
                event.stopPropagation();
                void this._runBulkDomainAction(
                  roomEntityIds,
                  allOn ? 'turn_off' : 'turn_on',
                  allOn ? this._t('action.turn_off_all') : this._t('action.turn_on_all'),
                  false
                );
              }}>
              <span>${activeCount}/${group.entities.length}</span>
              <span class="area-master-track ${allOn ? 'is-on' : ''}"></span>
            </button>
          ` : (this._params?.homeInformation && (kind === 'sensor' || kind === 'climate'))
            ? nothing
            : html`<div class="entity-count">${group.entities.length}</div>`}
        </div>` : nothing}
        <div class="entities-grid">
          ${repeat(
            group.entities,
            entity => entity.entity_id,
            entity => this._renderEntityCard(entity)
          )}
        </div>
      </div>
    `;
  }

  private _renderEntityCard(entity: EntityConfig) {
    const rawState = this.hass.states[entity.entity_id];
    if (!rawState) return nothing;

    const domain = entity.entity_id.split('.')[0] || 'unknown';

    if (this._params?.homeInformationPresentation === 'devices' &&
        !['person', 'light', 'cover', 'climate', 'sensor'].includes(domain)) {
      const state = this._getEffectiveEntityState(rawState);
      const deviceClass = state.attributes?.device_class;
      const rawName = state.attributes?.friendly_name ||
        this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
      const areaName = this._entityAreaName(entity);
      const name = this._params.config?.settings?.hide_area_name_in_entity_names === true
        ? stripAreaNameFromEntityName(rawName, areaName)
        : rawName;
      const active = this._isEntityActiveForUi(state, domain);
      const unavailable = this._isUnavailable(state);
      const canToggle = ['switch', 'fan', 'input_boolean'].includes(domain);
      return renderCompactDeviceTile({
        name,
        status: formatEntityStateWithUnit(this.hass, state),
        icon: this.hass.entities?.[entity.entity_id]?.icon || state.attributes?.icon ||
          getDeviceClassIcon(domain, deviceClass) || getDomainIcon(domain),
        accent: this._entityColor(domain, deviceClass),
        active,
        unavailable,
        toggle: canToggle,
        onOpen: () => this._showMoreInfo(entity.entity_id),
        onToggle: () => void this._runBulkDomainAction(
          [entity.entity_id],
          active ? 'turn_off' : 'turn_on',
          this._t(active ? 'action.turn_off' : 'action.turn_on'),
          false
        ),
        turnOnLabel: this._t('action.turn_on'),
        turnOffLabel: this._t('action.turn_off'),
      });
    }

    if (this._params?.homeInformationPresentation === 'devices') {
      const replacement = findReplacementAssignment({
        hass: this.hass,
        config: this._params.config,
        entity,
        surface: 'devices_cards',
      });
      // House Information renders the same Devices card host for supported domains.
      const sharedDeviceCard = ['person', 'light', 'cover', 'climate', 'sensor', 'switch', 'binary_sensor', 'fan', 'input_boolean', 'lock'].includes(domain) ||
        (replacement && replacement.enabled !== false);

      if (sharedDeviceCard) {
        const rawName = rawState.attributes?.friendly_name ||
          this.hass.entities?.[entity.entity_id]?.name ||
          entity.entity_id;
        return html`
          <dd-next-device-entity-card
            class="entity-card-wrapper ${domain}-entity-card"
            .hass=${this.hass}
            .config=${this._params.config}
            .entityId=${entity.entity_id}
            .popup=${true}
            .areaName=${this._entityAreaName(entity)}
            .displayName=${rawName}
            @dd-more-info=${(event: CustomEvent<{ entityId: string }>) => this._showMoreInfo(event.detail.entityId)}
          ></dd-next-device-entity-card>
        `;
      }
    }

    const state = this._getEffectiveEntityState(rawState);
    if (domain === 'todo') {
      return html`
        <div class="domain-todo-list-card" data-entity=${entity.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{ type: 'todo-list', entity: entity.entity_id }}
          ></dwains-dashboard-next-card-host>
        </div>
      `;
    }

    const deviceClass = state.attributes?.device_class;
    const icon = this.hass.entities?.[entity.entity_id]?.icon ||
      state.attributes?.icon ||
      getDeviceClassIcon(domain, deviceClass) ||
      getDomainIcon(domain);
    const entityPicture = domain === 'person' ? state.attributes?.entity_picture : undefined;
    const rawName = state.attributes?.friendly_name || this.hass.entities?.[entity.entity_id]?.name || entity.entity_id;
    const areaName = this._entityAreaName(entity);
    const name = stripAreaNameFromEntityName(rawName, areaName);
    const active = this._isEntityActiveForUi(state, domain);
    const unavailable = this._isUnavailable(state);
    const accent = this._entityColor(domain, deviceClass);

    if (domain === 'person') {
      return html`
        <dwains-dashboard-next-person-tile
          .hass=${this.hass}
          .entityId=${entity.entity_id}
          .displayName=${name}
          .showMap=${false}
          role="button"
          tabindex="0"
          aria-label=${name}
          @click=${() => this._showMoreInfo(entity.entity_id)}
          @keydown=${(event: KeyboardEvent) => this._handleEntityKeydown(event, entity.entity_id)}
        ></dwains-dashboard-next-person-tile>
      `;
    }

    const actionKind = this._entityActionKind(domain);
    const actionMode = actionKind === 'toggle'
      ? 'toggle'
      : actionKind === 'cover'
        ? 'cover'
        : actionKind === 'lock'
          ? 'lock'
          : 'none';
    const variant = this._params?.homeInformation ? 'card' : 'compact';

    return html`
      <dd-next-compact-entity-tile
        .variant=${variant}
        .name=${name}
        .status=${this._entityStatusText(state, domain)}
        .icon=${icon}
        .picture=${entityPicture || ''}
        .accent=${accent}
        .active=${active}
        .unavailable=${unavailable}
        @dd-open=${() => this._showMoreInfo(entity.entity_id)}
      >
        ${actionMode !== 'none' ? html`
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
            @dd-action=${(event: CustomEvent<{ action: string }>) => {
              if (actionKind === 'toggle') {
                void this._handleEntityToggle(event, state, domain);
              } else if (actionKind === 'cover') {
                void this._handleCoverAction(event, state, event.detail.action as 'open' | 'stop' | 'close');
              } else if (actionKind === 'lock') {
                void this._handleLockAction(event, state);
              }
            }}
          ></dd-next-entity-actions>
        ` : nothing}
      </dd-next-compact-entity-tile>
    `;
  }

  private async _runBulkDomainAction(entityIds: string[], action: BulkDomainAction, label: string, requireConfirmation = true): Promise<void> {
    const domain = this._params?.domain || '';
    const count = entityIds.length;
    const confirmed = !requireConfirmation || window.confirm(this._t('action.confirm_bulk', {
      action: label,
      entities: this._tp('common.entity', count),
    }));

    if (!confirmed) return;

    const optimisticState = action === 'turn_on'
      ? 'on'
      : action === 'turn_off'
        ? 'off'
        : action === 'open_cover'
          ? 'open'
          : action === 'close_cover'
            ? 'closed'
            : action === 'unlock'
              ? 'unlocked'
              : action === 'lock'
                ? 'locked'
                : undefined;
    if (optimisticState) this._setOptimisticEntityStates(entityIds, optimisticState);

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        await this.hass.callService(domain, action, { entity_id: entityIds });
        return;
      }

      if (domain === 'cover') {
        await this.hass.callService('cover', action, { entity_id: entityIds });
        return;
      }

      if (domain === 'lock') {
        await this.hass.callService('lock', action, { entity_id: entityIds });
      }
    } catch (err) {
      this._clearOptimisticEntityStates(entityIds);
      console.warn(`Failed to run ${action} for ${domain}:`, err);
    }
  }

  private _handleEntityKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private async _handleEntityToggle(event: Event, state: any, domain: string): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) {
        const turnOn = !this._isEntityActiveForUi(state, domain);
        this._setOptimisticEntityStates([entityId], turnOn ? 'on' : 'off');
        await this.hass.callService(domain, turnOn ? 'turn_on' : 'turn_off', { entity_id: entityId });
        return;
      }
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle entity ${entityId}:`, err);
      return;
    }

    this._showMoreInfo(entityId);
  }

  private async _handleCoverAction(event: Event, state: any, action: 'open' | 'stop' | 'close'): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    const service = action === 'open' ? 'open_cover' : action === 'close' ? 'close_cover' : 'stop_cover';
    const optimisticState = action === 'open' ? 'open' : action === 'close' ? 'closed' : undefined;
    if (optimisticState) this._setOptimisticEntityStates([entityId], optimisticState);

    try {
      await this.hass.callService('cover', service, { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to ${action} cover ${entityId}:`, err);
    }
  }

  private async _handleLockAction(event: Event, state: any): Promise<void> {
    event.stopPropagation();
    const entityId = state?.entity_id;
    if (!entityId) return;

    try {
      const unlocked = this._isEntityActiveForUi(state, 'lock');
      this._setOptimisticEntityStates([entityId], unlocked ? 'locked' : 'unlocked');
      await this.hass.callService('lock', unlocked ? 'lock' : 'unlock', { entity_id: entityId });
    } catch (err) {
      this._clearOptimisticEntityStates([entityId]);
      console.warn(`Failed to toggle lock ${entityId}:`, err);
    }
  }

  private _showMoreInfo(entityId: string): void {
    const homeAssistant = document.querySelector('home-assistant');
    if (homeAssistant) {
      fireEvent(homeAssistant, 'hass-more-info', { entityId });
      return;
    }

    fireEvent(window, 'hass-more-info', { entityId });
  }

  private _entityActionKind(domain: string): 'toggle' | 'cover' | 'lock' | 'more' {
    if (['light', 'switch', 'fan', 'input_boolean'].includes(domain)) return 'toggle';
    if (domain === 'cover') return 'cover';
    if (domain === 'lock') return 'lock';
    return 'more';
  }

  private _coverSupportsFeature(state: any, feature: number): boolean {
    const supported = Number(state?.attributes?.supported_features);
    if (!Number.isFinite(supported) || supported <= 0) {
      return feature === 1 || feature === 2;
    }

    return (supported & feature) !== 0;
  }

  private _entityStatusText(state: any, domain: string): string {
    if (!state) return '';
    const effectiveState = this._getEffectiveEntityState(state);
    const formatted = formatEntityStateWithUnit(this.hass, effectiveState);

    if (domain === 'light' && effectiveState.state === 'on' && typeof effectiveState.attributes?.brightness === 'number') {
      return this._t('entity.brightness', {
        value: Math.round((effectiveState.attributes.brightness / 255) * 100),
      });
    }

    if (domain === 'cover' && typeof effectiveState.attributes?.current_position === 'number') {
      return `${formatted} · ${formatValueWithUnit(effectiveState.attributes.current_position, '%')}`;
    }

    if (domain === 'climate') {
      const current = effectiveState.attributes?.current_temperature;
      const target = effectiveState.attributes?.temperature;
      const unit = this.hass?.config?.unit_system?.temperature || '°C';
      if (current !== undefined && target !== undefined) {
        return `${formatValueWithUnit(current, unit)} · ${this._t('entity.climate_set', { value: formatValueWithUnit(target, unit) })}`;
      }
      if (current !== undefined) return formatValueWithUnit(current, unit);
    }

    if (domain === 'media_player' && effectiveState.attributes?.media_title) {
      return `${formatted} · ${effectiveState.attributes.media_title}`;
    }

    return formatted;
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

  private _setOptimisticEntityStates(entityIds: string[], state: string): void {
    const uniqueEntityIds = [...new Set(entityIds.filter(Boolean))];
    if (!uniqueEntityIds.length) return;

    const expiresAt = Date.now() + OPTIMISTIC_ENTITY_STATE_TTL;
    const next = { ...this._optimisticEntityStates };
    uniqueEntityIds.forEach(entityId => {
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
    uniqueEntityIds.forEach(entityId => {
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

  private _isUnavailable(state: any): boolean {
    return ['unavailable', 'unknown'].includes(String(state?.state || '').toLowerCase());
  }

  private _isEntityActiveForUi(state: any, domain: string): boolean {
    if (!state || this._isUnavailable(state)) return false;

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

  private _entityColor(domain: string, deviceClass?: string): string {
    if (domain === 'sensor' && (deviceClass === 'temperature' || deviceClass === 'humidity')) {
      return getDomainColor(deviceClass, deviceClass);
    }
    return getDomainColor(domain, deviceClass);
  }

  private _entityAreaName(entity: EntityConfig): string | undefined {
    const config = this._params?.config;
    const entityReg = config?.entities?.find(e => e.entity_id === entity.entity_id);
    const deviceReg = entityReg?.device_id
      ? config?.devices?.find(device => device.device_id === entityReg.device_id)
      : undefined;
    const areaId = entity.area_id || entityReg?.area_id || deviceReg?.area_id || this.hass?.entities?.[entity.entity_id]?.area_id;

    return config?.areas?.find(area => area.area_id === areaId)?.name;
  }

  private _getLocalizedDomainTitle(domain: string): string {
    return getDomainName(this.hass, domain);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-domain-entities-dialog': DwainsDomainEntitiesDialog;
  }
}
