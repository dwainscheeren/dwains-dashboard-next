import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { HomeAssistant } from '../../types/home-assistant';
import type { DwainsDashboardConfig } from '../../types/strategy';
import { getDomainColor, getDomainIcon, getDeviceClassIcon } from '../../utils/icons';
import { formatEntityStateWithUnit, formatValueWithUnit } from '../../utils/unit-format';
import { findReplacementAssignment, resolveDeviceViewCardConfig } from '../../utils/blueprint-replacements';
import { stripAreaNameFromEntityName } from '../../utils/entity-names';
import '../utils/dd-card-host';
import '../dwains-person-tile';

/**
 * Render the same compact device tile in Devices and Home Information.
 * The caller owns navigation and service actions; the visual tree is shared.
 */
export function renderCompactDeviceTile(options: {
  name: string;
  status: string;
  icon: string;
  accent: string;
  active: boolean;
  unavailable: boolean;
  toggle: boolean;
  onOpen: () => void;
  onToggle: () => void;
  turnOnLabel: string;
  turnOffLabel: string;
}) {
  return html`
    <dd-next-compact-entity-tile
      variant="compact"
      .name=${options.name}
      .status=${options.status}
      .icon=${options.icon}
      .accent=${options.accent}
      .active=${options.active}
      .unavailable=${options.unavailable}
      @dd-open=${options.onOpen}
    >
      ${options.toggle ? html`
        <dd-next-entity-actions
          slot="actions"
          mode="toggle"
          .accent=${options.accent}
          .active=${options.active}
          .unavailable=${options.unavailable}
          .turnOnLabel=${options.turnOnLabel}
          .turnOffLabel=${options.turnOffLabel}
          @dd-action=${options.onToggle}
        ></dd-next-entity-actions>
      ` : nothing}
    </dd-next-compact-entity-tile>
  `;
}

@customElement('dd-next-device-entity-card')
export class DdNextDeviceEntityCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DwainsDashboardConfig;
  @property() public entityId = '';
  @property() public areaName = '';
  @property() public displayName = '';
  @property({ type: Boolean }) public popup = false;

  private _showMoreInfo = (): void => {
    this.dispatchEvent(new CustomEvent('dd-more-info', {
      detail: { entityId: this.entityId },
      bubbles: true,
      composed: true,
    }));
  };

  private _personKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._showMoreInfo();
  };

  protected override render() {
    const state = this.hass?.states?.[this.entityId];
    if (!state || !this.config) return nothing;

    const domain = this.entityId.split('.')[0] || 'unknown';
    const replacement = ['select', 'input_select'].includes(domain)
      ? findReplacementAssignment({ hass: this.hass, config: this.config, entity: this.entityId, surface: 'devices_cards' }) : undefined;
    if (['select', 'input_select'].includes(domain) && (!replacement || replacement.enabled === false)) {
      const rawName = this.displayName || state.attributes?.friendly_name || this.entityId;
      const name = this.config.settings?.hide_area_name_in_entity_names === true
        ? stripAreaNameFromEntityName(rawName, this.areaName) : rawName;
      const unavailable = ['unknown', 'unavailable'].includes(String(state.state).toLowerCase());
      const options = Array.isArray(state.attributes?.options) ? state.attributes.options.map(String) : [];
      if (!unavailable && !options.includes(state.state)) options.unshift(state.state);
      return html`
        <dd-next-compact-entity-tile
          .name=${name}
          .status=${formatEntityStateWithUnit(this.hass, state)}
          .icon=${getDomainIcon(domain)}
          .accent=${getDomainColor(domain)}
          .unavailable=${unavailable}
          .selectOptions=${options}
          .selectedOption=${String(state.state)}
          @dd-open=${this._showMoreInfo}
          @dd-select=${async (event: CustomEvent<{ option: string }>) => {
            try {
              await this.hass.callService(domain, 'select_option', { entity_id: this.entityId, option: event.detail.option });
            } catch (err) {
              console.warn(`Failed to select option for ${this.entityId}:`, err);
            }
          }}
        ></dd-next-compact-entity-tile>
      `;
    }
    if (domain === 'person') {
      const rawName = this.displayName ||
        state.attributes?.friendly_name ||
        this.hass.entities?.[this.entityId]?.name ||
        this.entityId;
      const name = this.config?.settings?.hide_area_name_in_entity_names === true
        ? stripAreaNameFromEntityName(rawName, this.areaName)
        : rawName;

      return html`
        <dwains-dashboard-next-person-tile
          .hass=${this.hass}
          .entityId=${this.entityId}
          .displayName=${name}
          .showMap=${!this.popup}
          role="button"
          tabindex="0"
          aria-label=${name}
          @click=${this._showMoreInfo}
          @keydown=${this._personKeydown}
        ></dwains-dashboard-next-person-tile>
      `;
    }

    if (['light', 'cover', 'climate'].includes(domain)) {
      const name = this.displayName || state.attributes?.friendly_name ||
        this.hass.entities?.[this.entityId]?.name || this.entityId;
      const displayName = this.config.settings?.hide_area_name_in_entity_names === true
        ? stripAreaNameFromEntityName(name, this.areaName) : name;
      const unavailable = ['unknown', 'unavailable'].includes(String(state.state).toLowerCase());
      const active = ['on', 'open', 'opening', 'heat', 'cool'].includes(String(state.state).toLowerCase());
      const features = Number(state.attributes?.supported_features || 0);
      const supports = (flag: number) => features <= 0 ? flag !== 8 : (features & flag) !== 0;
      const actionMode = domain === 'cover' ? 'cover' : domain === 'light' ? 'toggle' : 'none';
      let status = formatEntityStateWithUnit(this.hass, state);
      if (domain === 'light' && typeof state.attributes?.brightness === 'number' && state.state === 'on') {
        status += ' · ' + formatValueWithUnit(Math.round(state.attributes.brightness / 255 * 100), '%');
      }
      if (domain === 'cover' && typeof state.attributes?.current_position === 'number') {
        status += ' · ' + formatValueWithUnit(state.attributes.current_position, '%');
      }
      if (domain === 'climate') {
        const unit = this.hass.config?.unit_system?.temperature || '°C';
        const current = state.attributes?.current_temperature;
        const target = state.attributes?.temperature;
        if (current !== undefined) {
          status = formatValueWithUnit(current, unit);
          if (target !== undefined) status += ' · ' + formatValueWithUnit(target, unit);
        }
      }
      const accent = getDomainColor(domain, state.attributes?.device_class);
      const icon = this.hass.entities?.[this.entityId]?.icon || state.attributes?.icon ||
        getDeviceClassIcon(domain, state.attributes?.device_class) || getDomainIcon(domain);
      return html`
        <dd-next-compact-entity-tile
          variant="compact"
          .name=${displayName}
          .status=${status}
          .icon=${icon}
          .accent=${accent}
          .active=${active}
          .unavailable=${unavailable}
          @dd-open=${this._showMoreInfo}
        >
          ${actionMode !== 'none' ? html`
            <dd-next-entity-actions
              slot="actions"
              .mode=${actionMode}
              .accent=${accent}
              .active=${active}
              .unavailable=${unavailable}
              .state=${String(state.state)}
              .canOpen=${supports(1)}
              .canClose=${supports(2)}
              .canStop=${supports(8)}
              @dd-action=${(event: CustomEvent<{ action: string }>) => {
                const action = event.detail.action;
                if (domain === 'light') {
                  void this.hass.callService('light', action, { entity_id: this.entityId });
                } else if (domain === 'cover') {
                  const service = action === 'open' ? 'open_cover' :
                    action === 'stop' ? 'stop_cover' : 'close_cover';
                  void this.hass.callService('cover', service, { entity_id: this.entityId });
                }
              }}
            ></dd-next-entity-actions>
          ` : nothing}
        </dd-next-compact-entity-tile>
      `;
    }

    const coverStyle = domain === 'cover'
      ? `--primary-color: ${getDomainColor('cover')}; --state-cover-open-color: ${getDomainColor('cover')}; --state-cover-opening-color: ${getDomainColor('cover')}; --state-cover-active-color: ${getDomainColor('cover')};`
      : '';

    return html`
      <div class="card ${domain}-card">
        <dwains-dashboard-next-card-host
          framed
          ?eager=${this.popup}
          ?refresh-layout=${this.popup}
          style=${coverStyle}
          .hass=${this.hass}
          .config=${resolveDeviceViewCardConfig({
            hass: this.hass,
            config: this.config,
            entity: this.entityId,
            surface: 'devices_cards',
          })}
        ></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      position: relative;
    }

    .card,
    dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .climate-card {
      overflow: visible;
    }

    .climate-card > dwains-dashboard-next-card-host {
      width: calc(100% / .7);
      transform: scale(.7);
      transform-origin: top left;
    }

    @media (max-width: 768px) {
      .climate-card > dwains-dashboard-next-card-host {
        width: calc(100% / .7);
        transform: scale(.7);
        transform-origin: top left;
      }
    }
  `;
}

@customElement('dd-next-compact-entity-tile')
export class DdNextCompactEntityTile extends LitElement {
  @property() public name = '';
  @property() public status = '';
  @property() public icon = 'mdi:shape-outline';
  @property() public picture = '';
  @property() public accent = 'var(--primary-color)';
  @property() public variant: 'compact' | 'card' = 'compact';
  @property({ type: Boolean, reflect: true }) public active = false;
  @property({ type: Boolean, reflect: true }) public unavailable = false;
  @property({ type: Boolean, reflect: true }) public editing = false;
  @property({ attribute: false }) public selectOptions?: string[];
  @property() public selectedOption = '';

  private _open = (): void => {
    this.dispatchEvent(new CustomEvent('dd-open', { bubbles: true, composed: true }));
  };

  private _keydown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('button, select, input, textarea, a')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._open();
  };

  protected override render() {
    const selecting = this.selectOptions !== undefined && !this.editing;
    return html`
      <article
        class="tile ${this.variant}"
        style=${`--dd-entity-accent: ${this.accent};`}
        role="button"
        tabindex="0"
        aria-label=${this.name}
        @click=${this._open}
        @keydown=${this._keydown}
      >
        <div class="main">
          <slot name="leading"></slot>
          <span class="icon ${this.picture ? 'has-picture' : ''}">
            ${this.picture
              ? html`<img src=${this.picture} alt=${this.name}>`
              : html`<ha-icon icon=${this.icon}></ha-icon>`}
          </span>
          <div class="copy">
            <div class="name" title=${this.name}>${this.name}</div>
            ${this.status ? html`<div class="state" title=${this.status}>${this.status}</div>` : nothing}
          </div>
          <div class="actions">
            ${selecting ? html`
              <span class="select-action">
                <ha-icon class="select-chevron" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
                <select
                  class="select-control"
                  aria-label=${this.name}
                  .value=${this.selectedOption}
                  ?disabled=${this.unavailable || !this.selectOptions?.length}
                  @click=${(event: Event) => event.stopPropagation()}
                  @keydown=${(event: Event) => event.stopPropagation()}
                  @change=${(event: Event) => {
                    event.stopPropagation();
                    this.dispatchEvent(new CustomEvent('dd-select', {
                      detail: { option: (event.currentTarget as HTMLSelectElement).value }, bubbles: true, composed: true,
                    }));
                  }}
                >
                  ${this.selectOptions?.map(option => html`<option value=${option} ?selected=${option === this.selectedOption}>${option}</option>`)}
                </select>
              </span>
            ` : nothing}
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="footer"><slot></slot></div>
      </article>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      width: 100%;
      --dd-entity-accent: var(--primary-color);
    }

    .tile {
      position: relative;
      width: 100%;
      min-width: 0;
      margin: 0;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
    }

    .tile.compact {
      min-height: 62px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 9px rgba(15, 23, 42, .035);
    }

    .tile.card {
      min-height: 128px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      box-shadow:
        0 12px 26px rgba(15, 23, 42, .06),
        inset 0 0 0 1px rgba(15, 23, 42, .035);
    }

    :host([active]) .tile {
      box-shadow:
        0 8px 18px rgba(15, 23, 42, .06),
        inset 0 0 0 1px color-mix(in srgb, var(--dd-entity-accent) 18%, transparent);
    }

    :host([unavailable]) .tile {
      opacity: .62;
    }

    .tile:active:not(:has(.select-control:active)) {
      transform: scale(.985);
    }

    .main {
      width: 100%;
      min-width: 0;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 9px;
    }

    :host([editing]) .main {
      grid-template-columns: auto 36px minmax(0, 1fr) auto;
    }

    ::slotted([slot="leading"]) {
      grid-column: 1;
    }

    .icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--dd-entity-accent);
      background: color-mix(in srgb, var(--dd-entity-accent) 13%, transparent);
    }

    .card .icon {
      border-radius: 11px;
    }

    .icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .icon.has-picture {
      overflow: hidden;
      padding: 0;
      background: var(--secondary-background-color);
    }

    .icon img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }

    .name {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.15;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card .name {
      margin-top: 3px;
      font-size: 15px;
      font-weight: 900;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .state {
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([active]) .state {
      color: var(--dd-entity-accent);
    }

    .actions {
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
    }

    .select-chevron {
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }

    .select-action {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
    }

    .select-control {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      font: inherit;
    }

    .tile:has(.select-control:focus-visible) {
      outline: 2px solid var(--dd-entity-accent);
      outline-offset: -2px;
    }

    .footer:empty {
      display: none;
    }

    .footer {
      min-width: 0;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .tile.compact {
        min-height: 58px;
        padding: 7px 9px;
      }

      .tile.compact .main {
        grid-template-columns: 34px minmax(0, 1fr) auto;
        gap: 8px;
      }

      :host([editing]) .tile.compact .main {
        grid-template-columns: auto 34px minmax(0, 1fr) auto;
      }

      .tile.compact .icon {
        width: 34px;
        height: 34px;
      }
    }
  `;
}

@customElement('dd-next-entity-actions')
export class DdNextEntityActions extends LitElement {
  @property() public mode: 'none' | 'toggle' | 'cover' | 'lock' | 'scene' = 'none';
  @property() public accent = 'var(--primary-color)';
  @property({ type: Boolean }) public active = false;
  @property({ type: Boolean }) public unavailable = false;
  @property() public state = '';
  @property({ type: Boolean }) public canOpen = true;
  @property({ type: Boolean }) public canStop = true;
  @property({ type: Boolean }) public canClose = true;
  @property() public turnOnLabel = 'Turn on';
  @property() public turnOffLabel = 'Turn off';
  @property() public openLabel = 'Open';
  @property() public stopLabel = 'Stop';
  @property() public closeLabel = 'Close';
  @property() public lockLabel = 'Lock';
  @property() public unlockLabel = 'Unlock';
  @property() public activateLabel = 'Activate';

  private _emit(event: Event, action: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('dd-action', {
      detail: { action },
      bubbles: true,
      composed: true,
    }));
  }

  protected override render() {
    if (this.mode === 'none') return nothing;

    if (this.mode === 'toggle') {
      const label = this.active ? this.turnOffLabel : this.turnOnLabel;
      return html`
        <button
          class="action toggle ${this.active ? 'active' : ''}"
          type="button"
          style=${`--dd-action-accent: ${this.accent};`}
          title=${label}
          aria-label=${label}
          ?disabled=${this.unavailable}
          @click=${(event: Event) => this._emit(event, this.active ? 'turn_off' : 'turn_on')}
        ></button>
      `;
    }

    if (this.mode === 'cover') {
      const coverState = String(this.state || '').toLowerCase();
      const moving = coverState === 'opening' || coverState === 'closing';
      return html`
        <div class="cover" style=${`--dd-action-accent: ${this.accent};`}>
          ${this.canOpen ? html`
            <button class="action round ${coverState === 'opening' ? 'active' : ''}" type="button" title=${this.openLabel} aria-label=${this.openLabel}
              ?disabled=${this.unavailable} @click=${(event: Event) => this._emit(event, 'open')}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>` : nothing}
          ${this.canStop ? html`
            <button class="action round ${moving ? 'active' : ''}" type="button" title=${this.stopLabel} aria-label=${this.stopLabel}
              ?disabled=${this.unavailable} @click=${(event: Event) => this._emit(event, 'stop')}>
              <ha-icon icon="mdi:stop"></ha-icon>
            </button>` : nothing}
          ${this.canClose ? html`
            <button class="action round ${coverState === 'closing' ? 'active' : ''}" type="button" title=${this.closeLabel} aria-label=${this.closeLabel}
              ?disabled=${this.unavailable} @click=${(event: Event) => this._emit(event, 'close')}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>` : nothing}
        </div>
      `;
    }

    if (this.mode === 'lock') {
      const label = this.active ? this.lockLabel : this.unlockLabel;
      return html`
        <button class="action round" type="button" style=${`--dd-action-accent: ${this.accent};`}
          title=${label} aria-label=${label} ?disabled=${this.unavailable}
          @click=${(event: Event) => this._emit(event, this.active ? 'lock' : 'unlock')}>
          <ha-icon icon=${this.active ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline'}></ha-icon>
        </button>
      `;
    }

    return html`
      <button class="action round" type="button" style=${`--dd-action-accent: ${this.accent};`}
        title=${this.activateLabel} aria-label=${this.activateLabel}
        @click=${(event: Event) => this._emit(event, 'activate')}>
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
    `;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      --dd-action-accent: var(--primary-color);
    }

    button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .action {
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      cursor: pointer;
      transition: background-color .18s ease, color .18s ease, transform .18s ease, opacity .18s ease;
    }

    .action:active {
      transform: scale(.94);
    }

    .action:disabled {
      opacity: .36;
      cursor: not-allowed;
    }

    .toggle {
      width: 38px;
      height: 22px;
      justify-content: flex-start;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, .07),
        0 4px 10px rgba(15, 23, 42, .08);
    }

    .toggle::before {
      content: '';
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, .2);
      transition: transform .18s ease;
    }

    .toggle.active {
      background: var(--dd-action-accent);
    }

    .toggle.active::before {
      transform: translateX(16px);
    }

    .round {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, .05);
    }

    .round:hover,
    .round.active {
      color: var(--dd-action-accent);
      background: color-mix(in srgb, var(--dd-action-accent) 10%, var(--card-background-color));
    }

    .round ha-icon {
      --mdc-icon-size: 17px;
    }

    .cover {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  `;
}

export interface DdRoomActionItem {
  action: string;
  label: string;
  icon: string;
  active?: boolean;
}

@customElement('dd-next-room-actions')
export class DdNextRoomActions extends LitElement {
  @property() public mode: 'toggle' | 'segmented' = 'segmented';
  @property() public accent = 'var(--primary-color)';
  @property({ type: Number }) public activeCount = 0;
  @property({ type: Number }) public totalCount = 0;
  @property() public toggleOnLabel = '';
  @property() public toggleOffLabel = '';
  @property({ attribute: false }) public items: DdRoomActionItem[] = [];

  private _emit(action: string): void {
    this.dispatchEvent(new CustomEvent('dd-action', {
      detail: { action },
      bubbles: true,
      composed: true,
    }));
  }

  protected override render() {
    const allOn = this.totalCount > 0 && this.activeCount === this.totalCount;
    if (this.mode === 'toggle') {
      const action = allOn ? 'turn_off' : 'turn_on';
      const label = allOn ? this.toggleOffLabel : this.toggleOnLabel;
      return html`
        <button
          class="toggle"
          type="button"
          style=${`--dd-action-accent: ${this.accent};`}
          title=${label}
          aria-label=${label}
          @click=${(event: Event) => {
            event.stopPropagation();
            this._emit(action);
          }}
        >
          <span>${this.activeCount}/${this.totalCount}</span>
          <span class="track ${allOn ? 'is-on' : ''}"></span>
        </button>
      `;
    }

    if (!this.items.length) return nothing;
    return html`
      <div class="segmented" style=${`--dd-action-accent: ${this.accent};`} role="group">
        ${this.items.map(item => html`
          <button
            class="segment ${item.active ? 'active' : ''}"
            type="button"
            title=${item.label}
            aria-label=${item.label}
            @click=${(event: Event) => {
              event.stopPropagation();
              this._emit(item.action);
            }}
          ><ha-icon icon=${item.icon}></ha-icon></button>
        `)}
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
    }

    button {
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .toggle {
      min-height: 30px;
      padding: 4px 7px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--secondary-text-color);
      background: var(--card-background-color);
      font-size: 12px;
      font-weight: 750;
    }

    .track {
      width: 31px;
      height: 18px;
      position: relative;
      display: inline-block;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }

    .track::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      transition: transform .18s ease;
    }

    .track.is-on {
      background: var(--dd-action-accent);
    }

    .track.is-on::after {
      transform: translateX(13px);
    }

    .segmented {
      height: 30px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
    }

    .segment {
      width: 34px;
      height: 30px;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      background: transparent;
    }

    .segment + .segment {
      border-left: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .segment:hover,
    .segment.active {
      color: var(--dd-action-accent);
      background: color-mix(in srgb, var(--dd-action-accent) 12%, var(--card-background-color));
    }

    .segment ha-icon {
      --mdc-icon-size: 17px;
    }

    @media (max-width: 768px) {
      .toggle {
        min-height: 28px;
        font-size: 11px;
      }
    }
  `;
}

@customElement('dd-next-room-group')
export class DdNextRoomGroup extends LitElement {
  @property() public name = '';
  @property() public icon = 'mdi:floor-plan';
  @property() public accent = 'var(--primary-color)';
  @property({ type: Boolean, reflect: true }) public compact = false;

  protected override render() {
    return html`
      <section class="group" style=${`--dd-room-accent: ${this.accent};`}>
        <header class="header">
          <div class="title">
            <ha-icon icon=${this.icon}></ha-icon>
            <span>${this.name}</span>
          </div>
          <div class="actions"><slot name="actions"></slot></div>
        </header>
        <div class="content"><slot></slot></div>
      </section>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .group {
      min-width: 0;
      padding: 14px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 12px;
      background: var(--card-background-color);
      box-shadow: 0 5px 14px rgba(15, 23, 42, .035);
    }

    .header {
      min-height: 30px;
      margin: 0 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .title {
      min-width: 0;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.15;
      text-align: left;
    }

    .title ha-icon {
      flex: 0 0 auto;
      color: var(--primary-color);
      --mdc-icon-size: 20px;
    }

    .title span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
    }

    .content {
      min-width: 0;
    }

    @media (max-width: 768px) {
      .group {
        padding: 10px;
      }

      .header {
        margin-bottom: 10px;
      }

      .title {
        font-size: 14px;
        font-weight: 850;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dd-next-device-entity-card': DdNextDeviceEntityCard;
    'dd-next-compact-entity-tile': DdNextCompactEntityTile;
    'dd-next-entity-actions': DdNextEntityActions;
    'dd-next-room-group': DdNextRoomGroup;
    'dd-next-room-actions': DdNextRoomActions;
  }
}
