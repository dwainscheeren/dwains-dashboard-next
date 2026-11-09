import { LitElement, css, html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import type { HomeAssistant } from '../../types/home-assistant';
import type { DwainsDashboardConfig } from '../../types/strategy';
import { TRANSLATIONS_LOADED_EVENT } from '../../i18n';
import { subscribeEnergyPowerConfig } from '../../utils/energy-prefs';
import {
  hasUntrackedPowerShare,
  pickPowerStatisticsEntities,
  powerSharePercentage,
  showsPowerMeasuredInAreas,
  wholeHousePowerGraphEntities,
  type StatisticsGraphEntity,
} from '../../utils/home-information';
import { getDomainColor } from '../../utils/icons';
import { ddLang, ddLocalize, ddLocalizePlural } from '../../utils/localize';
import {
  createHousePowerUsageMemo,
  formatPowerWatts,
  type HousePowerUsageSummary,
  type PowerAreaSummary,
  type PowerEntitySummary,
} from '../../utils/power-usage';
import { fireEvent } from '../utils/fire-event';
import '../utils/dd-card-host';

/** Graph lines in the whole house graph (without energy settings) and per room. */
const WHOLE_HOUSE_GRAPH_ENTITIES = 8;
const ROOM_GRAPH_ENTITIES = 6;

/**
 * House power usage for the panel, the header total and the Devices menu.
 * They all get the same hass and config, so they share one memo.
 */
export const sharedHousePowerUsage = createHousePowerUsageMemo();

/** Basis of the house total: the energy settings sensors or the number of room sensors. */
export function energyBasisLabel(hass: HomeAssistant | undefined, summary: HousePowerUsageSummary): string {
  if (summary.basis === 'energy') {
    const names = [...new Set(summary.sources.map((source) => source.name))];
    return ddLocalize(hass, 'devices.power_based_on', { sensors: names.join(', ') });
  }
  return ddLocalizePlural(hass, 'devices.live_power_sensor', summary.sensorCount);
}

/**
 * House power usage: the whole house with its graph, the room that uses the
 * most, then one card per room with its graph and power sensors. Used by
 * Devices > Energy and by the house power popup on Home.
 *
 * Home Assistant sets `hass` on every state change. The panel only renders
 * again when the power summary changed (see createHousePowerUsageMemo); the
 * graphs still get the new `hass`.
 *
 * Fires `dd-power-area-selected` ({ areaId }) when a room title is pressed
 * and `navigableAreas` is set.
 */
@customElement('dwains-dashboard-next-house-power-panel')
export class DwainsHousePowerPanel extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: DwainsDashboardConfig;
  /** Room titles are buttons that select the room. */
  @property({ type: Boolean, attribute: 'navigable-areas' }) public navigableAreas = false;

  private _summary?: HousePowerUsageSummary;
  private _renderedLanguage?: string;
  private _forceRender = false;
  private _energyUnsub?: () => void;

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, vars);
  }

  private _tp(key: string, count: number, vars?: Record<string, string | number>): string {
    return ddLocalizePlural(this.hass, key, count, vars);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(TRANSLATIONS_LOADED_EVENT, this._handleForcedUpdate);
    // The house total switches to the energy settings once they are loaded.
    this._energyUnsub = subscribeEnergyPowerConfig(this._handleForcedUpdate);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(TRANSLATIONS_LOADED_EVENT, this._handleForcedUpdate);
    this._energyUnsub?.();
    this._energyUnsub = undefined;
  }

  private _handleForcedUpdate = (): void => {
    this._forceRender = true;
    this.requestUpdate();
  };

  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    const summary = sharedHousePowerUsage(this.hass, this.config);
    const language = ddLang(this.hass);
    const onlyHass = [...changed.keys()].every((key) => key === 'hass');

    if (!this._forceRender && onlyHass && summary === this._summary && language === this._renderedLanguage) {
      // Nothing to show changed: hand the new hass to the graphs only.
      this.renderRoot?.querySelectorAll('dwains-dashboard-next-card-host').forEach((host) => {
        (host as unknown as { hass: HomeAssistant | undefined }).hass = this.hass;
      });
      return false;
    }

    this._forceRender = false;
    this._summary = summary;
    this._renderedLanguage = language;
    return true;
  }

  protected override render() {
    const summary = this._summary;
    if (!summary || !this.hass) return nothing;

    if (!summary.sensorCount) {
      return html`
        <div class="empty">
          <ha-icon icon="mdi:flash-off-outline"></ha-icon>
          <h2>${this._t('devices.no_power_title')}</h2>
          <p>${this._t('devices.no_power_description')}</p>
        </div>
      `;
    }

    const topArea = summary.areas[0];
    const wholeHouseGraph = wholeHousePowerGraphEntities(summary, this.hass?.states, WHOLE_HOUSE_GRAPH_ENTITIES);

    return html`
      <div class="overview-grid">
        <section class="card overview-card">
          <div class="overview-head">
            <span class="icon-badge large" aria-hidden="true">
              <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
            </span>
            <div class="overview-copy">
              <h2>${this._t('devices.whole_house')}</h2>
              <p>${energyBasisLabel(this.hass, summary)}</p>
              ${showsPowerMeasuredInAreas(summary)
                ? html`<p>${this._t('devices.power_measured_in_rooms', { value: formatPowerWatts(summary.roomTotalWatts) })}</p>`
                : nothing}
            </div>
            <strong class="overview-total">${summary.formattedTotal}</strong>
          </div>
          ${this._renderGraph(wholeHouseGraph, this._t('devices.whole_house_history'))}
        </section>

        ${topArea ? html`
          <section class="card overview-card">
            <div class="overview-head">
              <span class="icon-badge large" aria-hidden="true">
                <ha-icon icon=${topArea.icon}></ha-icon>
              </span>
              <div class="overview-copy">
                <h2>${this._t('devices.top_area')}</h2>
                <p>${topArea.name}</p>
              </div>
              <strong class="overview-total">${topArea.formattedTotal}</strong>
            </div>
            <div class="top-entities">
              ${topArea.entities.slice(0, 3).map((entity) => this._renderEntityMini(entity, topArea.totalWatts))}
            </div>
          </section>
        ` : nothing}
      </div>

      <div class="areas-grid">
        ${repeat(summary.areas, (area) => area.areaId, (area) => this._renderAreaCard(area))}
      </div>
    `;
  }

  private _renderAreaCard(area: PowerAreaSummary) {
    const canNavigate = this.navigableAreas && !area.areaId.startsWith('__');
    const title = html`
      <span class="icon-badge" aria-hidden="true">
        <ha-icon icon=${area.icon}></ha-icon>
      </span>
      <span class="area-title-copy">
        <strong>${area.name}</strong>
        <small>${this._tp('devices.power_entity', area.entities.length)}</small>
      </span>
    `;

    return html`
      <section class="card area-card">
        <header class="area-head">
          ${canNavigate
            ? html`<button class="area-title" type="button" @click=${() => this._selectArea(area.areaId)}>${title}</button>`
            : html`<div class="area-title">${title}</div>`}
          <div class="area-total">
            <span>${area.formattedTotal}</span>
            <small>${this._t('devices.total_now')}</small>
          </div>
        </header>

        ${this._renderGraph(
          pickPowerStatisticsEntities(area.entities, ROOM_GRAPH_ENTITIES),
          this._t('devices.area_power_history', { area: area.name })
        )}

        <div class="entity-list">
          ${repeat(area.entities, (entity) => entity.entityId, (entity) => this._renderEntityRow(entity, area.totalWatts))}
        </div>
      </section>
    `;
  }

  /** "Untracked part of 3.2 kW" for an upstream device, else nothing. */
  private _untrackedLabel(entity: PowerEntitySummary): string | undefined {
    return hasUntrackedPowerShare(entity)
      ? this._t('devices.power_untracked_of', { value: formatPowerWatts(entity.measuredWatts) })
      : undefined;
  }

  private _renderEntityMini(entity: PowerEntitySummary, areaTotalWatts: number) {
    const untracked = this._untrackedLabel(entity);
    return html`
      <button
        class="entity-mini"
        type="button"
        title=${untracked ? `${entity.name}: ${untracked}` : entity.name}
        aria-label=${untracked ? `${entity.name}, ${entity.formatted}, ${untracked}` : `${entity.name}, ${entity.formatted}`}
        style=${`--power-width: ${powerSharePercentage(entity.watts, areaTotalWatts)}%`}
        @click=${() => this._showMoreInfo(entity.entityId)}
      >
        <span>${entity.name}</span>
        <strong>${entity.formatted}</strong>
      </button>
    `;
  }

  private _renderEntityRow(entity: PowerEntitySummary, areaTotalWatts: number) {
    return html`
      <button
        class="entity-row"
        type="button"
        style=${`--power-width: ${powerSharePercentage(entity.watts, areaTotalWatts)}%`}
        @click=${() => this._showMoreInfo(entity.entityId)}
      >
        <span class="icon-badge small" aria-hidden="true">
          <ha-icon icon=${entity.icon}></ha-icon>
        </span>
        <span class="entity-copy">
          <strong>${entity.name}</strong>
          <small>${this._untrackedLabel(entity) ?? entity.areaName}</small>
          <span class="entity-bar" aria-hidden="true"><span></span></span>
        </span>
        <span class="entity-value">${entity.formatted}</span>
      </button>
    `;
  }

  /** Statistics graph of the last day; created when it scrolls into view. */
  private _renderGraph(entities: StatisticsGraphEntity[], label: string) {
    if (!entities.length) return nothing;

    return html`
      <dwains-dashboard-next-card-host
        class="statistics-card"
        role="img"
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

  private _selectArea(areaId: string): void {
    fireEvent(this, 'dd-power-area-selected', { areaId }, { bubbles: false, composed: false });
  }

  private _showMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  static override styles = css`
    :host {
      --power-color: var(--domain-color, ${unsafeCSS(getDomainColor('energy'))});
      display: block;
      container-type: inline-size;
    }

    h2,
    p {
      margin: 0;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    /* Without a top room the whole house card takes the full width. */
    .overview-grid > :only-child {
      grid-column: 1 / -1;
    }

    .card {
      min-width: 0;
      padding: 14px;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: var(--card-background-color);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
    }

    .icon-badge {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: var(--power-color);
      background: color-mix(in srgb, var(--power-color) 12%, transparent);
    }

    .icon-badge ha-icon {
      --mdc-icon-size: 22px;
    }

    .icon-badge.large {
      width: 42px;
      height: 42px;
    }

    .icon-badge.large ha-icon {
      --mdc-icon-size: 24px;
    }

    .icon-badge.small {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .icon-badge.small ha-icon {
      --mdc-icon-size: 20px;
    }

    .overview-head {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .overview-copy h2 {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .overview-copy p,
    .area-title-copy small,
    .area-total small,
    .entity-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    .overview-copy p {
      margin-top: 4px;
      overflow-wrap: anywhere;
    }

    .overview-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .statistics-card {
      display: block;
      min-height: 150px;
      margin-top: 12px;
      overflow: hidden;
      border-radius: 12px;
      background: color-mix(in srgb, var(--power-color) 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 12px;
    }

    .top-entities {
      margin-top: 12px;
      display: grid;
      gap: 7px;
    }

    .entity-mini {
      min-height: 32px;
      padding: 0 10px;
      border: 0;
      border-radius: 10px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      background:
        linear-gradient(90deg,
          color-mix(in srgb, var(--power-color) 16%, transparent) 0 var(--power-width),
          var(--secondary-background-color) var(--power-width) 100%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      font-weight: 800;
      text-align: left;
      cursor: pointer;
    }

    .entity-mini span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-mini strong {
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      gap: 12px;
    }

    .area-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .area-title {
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
    }

    button.area-title {
      cursor: pointer;
    }

    .area-title-copy {
      min-width: 0;
    }

    .area-title-copy strong {
      display: block;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.12;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .area-title-copy small {
      display: block;
      margin-top: 3px;
    }

    .area-total {
      display: grid;
      justify-items: end;
      gap: 2px;
    }

    .area-total span {
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .entity-list {
      margin-top: 12px;
      display: grid;
      gap: 8px;
    }

    .entity-row {
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        border-color 0.16s ease,
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .entity-row:hover {
      border-color: color-mix(in srgb, var(--power-color) 26%, var(--divider-color));
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .entity-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .entity-copy strong {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-bar {
      position: relative;
      height: 5px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--power-color) 10%, var(--secondary-background-color));
    }

    .entity-bar span {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--power-color), #f5c85b);
    }

    .entity-value {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .entity-mini:focus-visible,
    .entity-row:focus-visible,
    button.area-title:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .empty {
      min-height: 280px;
      padding: 32px;
      border: 1px dashed var(--divider-color);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .empty ha-icon {
      --mdc-icon-size: 34px;
      color: var(--power-color);
    }

    .empty h2 {
      margin-top: 4px;
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 850;
    }

    .empty p {
      max-width: 430px;
      font-size: 13px;
      line-height: 1.45;
    }

    @container (max-width: 640px) {
      .overview-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-head,
      .area-head {
        grid-template-columns: auto minmax(0, 1fr);
      }

      .overview-total,
      .area-total {
        grid-column: 1 / -1;
        justify-self: stretch;
        justify-items: start;
        margin-top: 4px;
      }

      .card {
        border-radius: 12px;
      }

      .entity-row {
        grid-template-columns: 36px minmax(0, 1fr);
      }

      .entity-value {
        grid-column: 2;
        justify-self: start;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .entity-row {
        transition: none;
      }

      .entity-row:hover {
        transform: none;
      }
    }
  `;
}

/**
 * The live house total for a page header: the total and what it is based on.
 * Renders again only when the power summary changed.
 */
@customElement('dwains-dashboard-next-house-power-total')
export class DwainsHousePowerTotal extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: DwainsDashboardConfig;

  private _summary?: HousePowerUsageSummary;
  private _renderedLanguage?: string;
  private _forceRender = false;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(TRANSLATIONS_LOADED_EVENT, this._handleForcedUpdate);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(TRANSLATIONS_LOADED_EVENT, this._handleForcedUpdate);
  }

  private _handleForcedUpdate = (): void => {
    this._forceRender = true;
    this.requestUpdate();
  };

  protected override shouldUpdate(): boolean {
    const summary = sharedHousePowerUsage(this.hass, this.config);
    const language = ddLang(this.hass);
    if (!this._forceRender && summary === this._summary && language === this._renderedLanguage) return false;
    this._forceRender = false;
    this._summary = summary;
    this._renderedLanguage = language;
    return true;
  }

  protected override render() {
    const summary = this._summary;
    if (!summary || !this.hass) return nothing;

    return html`
      <div class="total" title=${energyBasisLabel(this.hass, summary)}>
        <span>${summary.formattedTotal}</span>
        <small>${summary.basis === 'energy'
          ? ddLocalize(this.hass, 'devices.whole_house')
          : ddLocalizePlural(this.hass, 'devices.live_power_sensor', summary.sensorCount)}</small>
      </div>
    `;
  }

  static override styles = css`
    :host {
      --power-color: var(--domain-color, ${unsafeCSS(getDomainColor('energy'))});
      display: block;
    }

    .total {
      box-sizing: border-box;
      min-height: 52px;
      padding: 7px 14px;
      display: grid;
      align-content: center;
      justify-items: end;
      gap: 2px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--power-color) 13%, var(--card-background-color));
    }

    span {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 800;
      line-height: 1.05;
      font-variant-numeric: tabular-nums;
    }

    small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    @media (max-width: 768px) {
      .total {
        justify-items: start;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-house-power-panel': DwainsHousePowerPanel;
    'dwains-dashboard-next-house-power-total': DwainsHousePowerTotal;
  }
}
