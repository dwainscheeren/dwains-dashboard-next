import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import { ddLocalize } from '../utils/localize';
import {
  WALL_TABLET_CHANGED_EVENT,
  WALL_TABLET_DIM_OPTIONS,
  WALL_TABLET_MINUTE_OPTIONS,
  WALL_TABLET_URL_PARAM,
  dashboardSegmentFromPath,
  readWallTabletPrefs,
  updateWallTabletPrefs,
  type WallTabletPrefs,
} from '../utils/wall-tablet';

interface Choice {
  value: number;
  label: string;
}

/**
 * dwains-dashboard-next-wall-tablet-settings: the "Wall tablet" page of the
 * dashboard settings. These preferences belong to this device only: they are
 * stored in the browser and applied right away, never through the dashboard
 * config, so they do not mark the settings page as changed.
 */
@customElement('dwains-dashboard-next-wall-tablet-settings')
export class DwainsWallTabletSettings extends LitElement {
  private _hass?: HomeAssistant;
  private _segment = dashboardSegmentFromPath(window.location.pathname);
  @state() private _prefs: Readonly<WallTabletPrefs> = readWallTabletPrefs(this._segment);

  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    // Only the language matters here; skip the other hass updates.
    if (!old || old.language !== hass?.language || old.locale?.language !== hass?.locale?.language) {
      this.requestUpdate();
    }
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._segment = dashboardSegmentFromPath(window.location.pathname);
    this._prefs = readWallTabletPrefs(this._segment);
    window.addEventListener(WALL_TABLET_CHANGED_EVENT, this._handleChanged);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(WALL_TABLET_CHANGED_EVENT, this._handleChanged);
  }

  private _handleChanged = (): void => {
    this._prefs = readWallTabletPrefs(this._segment);
  };

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this._hass, key, vars);
  }

  private _update(patch: Partial<WallTabletPrefs>): void {
    this._prefs = updateWallTabletPrefs(this._segment, patch);
    // Saved right away on this device; let the settings page confirm it.
    this.dispatchEvent(new CustomEvent('dwains-dashboard-next-device-settings-saved', { bubbles: true, composed: true }));
  }

  private _toggleEnabled = (event: Event): void => {
    // Not a dashboard config change: keep it away from the settings page.
    event.stopPropagation();
    this._update({ enabled: Boolean((event.target as HTMLInputElement | null)?.checked) });
  };

  private _minuteChoices(): Choice[] {
    return WALL_TABLET_MINUTE_OPTIONS.map((value) => ({
      value,
      label: value === 0 ? this._t('kiosk.off') : this._t('kiosk.minutes', { count: value }),
    }));
  }

  private _exampleUrl(enable: boolean): string {
    return `${window.location.origin}/${this._segment}/home?${WALL_TABLET_URL_PARAM}=${enable ? 1 : 0}`;
  }

  protected render() {
    const prefs = this._prefs;
    const enabled = prefs.enabled;
    return html`
      <div class="wall-tablet-settings">
        <div class="row">
          <span class="row-copy">
            <strong id="wall-tablet-enable">${this._t('kiosk.enable')}</strong>
            <small>${this._t('kiosk.enable_description')}</small>
          </span>
          <ha-switch
            aria-labelledby="wall-tablet-enable"
            .checked=${enabled}
            @change=${this._toggleEnabled}
          ></ha-switch>
        </div>

        ${this._renderChoices(
          'return-home',
          this._t('kiosk.return_home'),
          this._t('kiosk.return_home_description'),
          this._minuteChoices(),
          prefs.returnHomeMinutes,
          (value) => this._update({ returnHomeMinutes: value }),
          !enabled
        )}

        ${this._renderChoices(
          'screensaver',
          this._t('kiosk.screensaver'),
          this._t('kiosk.screensaver_description'),
          this._minuteChoices(),
          prefs.screensaverMinutes,
          (value) => this._update({ screensaverMinutes: value }),
          !enabled
        )}

        ${this._renderChoices(
          'dim-level',
          this._t('kiosk.dim_level'),
          this._t('kiosk.dim_level_description'),
          WALL_TABLET_DIM_OPTIONS.map((value) => ({ value, label: `${value}%` })),
          prefs.dimLevel,
          (value) => this._update({ dimLevel: value }),
          !enabled || prefs.screensaverMinutes === 0
        )}

        <div class="note">
          <ha-icon icon="mdi:gesture-tap-hold"></ha-icon>
          <span class="note-copy">
            <strong>${this._t('kiosk.exit_title')}</strong>
            <span>${this._t('kiosk.exit_description')}</span>
          </span>
        </div>

        <div class="note">
          <ha-icon icon="mdi:link-variant"></ha-icon>
          <span class="note-copy">
            <strong>${this._t('kiosk.setup_title')}</strong>
            <span>${this._t('kiosk.setup_description', {
              param: `?${WALL_TABLET_URL_PARAM}=1`,
              param_off: `?${WALL_TABLET_URL_PARAM}=0`,
            })}</span>
            <code>${this._exampleUrl(true)}</code>
          </span>
        </div>
      </div>
    `;
  }

  private _renderChoices(
    id: string,
    title: string,
    description: string,
    choices: Choice[],
    selected: number,
    onSelect: (value: number) => void,
    disabled: boolean
  ) {
    const titleId = `wall-tablet-${id}`;
    return html`
      <div class="row choice-row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong id=${titleId}>${title}</strong>
          <small>${description}</small>
        </span>
        <div class="choices" role="radiogroup" aria-labelledby=${titleId} aria-disabled=${disabled ? 'true' : nothing}>
          ${choices.map((choice) => {
            const isSelected = choice.value === selected;
            return html`
              <button
                type="button"
                class="choice ${isSelected ? 'selected' : ''}"
                role="radio"
                aria-checked=${isSelected ? 'true' : 'false'}
                ?disabled=${disabled}
                @click=${() => onSelect(choice.value)}
              >${choice.label}</button>
            `;
          })}
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }

    .wall-tablet-settings {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .choice-row {
      flex-wrap: wrap;
    }

    .row-copy {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: min(100%, 240px);
      flex: 1 1 240px;
    }

    .row-copy strong {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .row-copy small {
      font-size: 13px;
      line-height: 1.4;
      color: var(--secondary-text-color);
    }

    ha-switch {
      flex: 0 0 auto;
    }

    .choices {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .choice {
      min-width: 52px;
      min-height: 36px;
      padding: 0 12px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
    }

    .choice:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }

    .choice:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .choice.selected {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
    }

    .choice:disabled {
      cursor: default;
    }

    .is-disabled .choices,
    .is-disabled .row-copy {
      opacity: 0.5;
    }

    .note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
      color: var(--primary-text-color);
    }

    .note + .note {
      margin-top: 8px;
    }

    .note ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
      flex: 0 0 auto;
      margin-top: 1px;
    }

    .note-copy {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      font-size: 13px;
      line-height: 1.45;
      color: var(--secondary-text-color);
    }

    .note-copy strong {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    code {
      display: block;
      margin-top: 4px;
      padding: 6px 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: 12px;
      overflow-wrap: anywhere;
      user-select: all;
      -webkit-user-select: all;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-wall-tablet-settings': DwainsWallTabletSettings;
  }
}
