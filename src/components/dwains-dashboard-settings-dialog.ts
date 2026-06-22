import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { mdiClose } from '@mdi/js';
import type { DwainsDashboardSettings } from '../types/strategy';
import { ddLocalize } from '../utils/localize';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import './dwains-dashboard-strategy-editor';

/**
 * dwains-dashboard-next-settings-dialog — toont de Dwains-strategy-editor (naam/icoon,
 * favorieten, area-instellingen, tijd & datum, sponsoring) in een eigen dialog.
 * Zo opent "Dashboard-instellingen" onze nette editor i.p.v. HA's YAML-editor.
 *
 * Belangrijk: bij opslaan behouden we strategy.pages (de blueprint-pagina's),
 * want de editor levert die niet mee in z'n config-changed payload.
 */
@customElement('dwains-dashboard-next-settings-dialog')
export class DwainsDashboardSettingsDialog extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @property({ attribute: false }) public dashboardSettings?: DwainsDashboardSettings;

  @state() private _open = false;
  @state() private _strategy?: any;
  private _pending?: any;
  private _editorInited = false;

  private _t = (key: string) => ddLocalize(this.hass, key);

  public async showDialog(): Promise<void> {
    this._editorInited = false;
    this._pending = undefined;
    try {
      const base = this._wsBase();
      const cfg: any = await this.hass.callWS({ type: 'lovelace/config', ...base });
      this._strategy = cfg?.strategy || { type: 'custom:dwains-dashboard-next' };
      this.dashboardSettings = this._strategy?.settings || this.dashboardSettings;
    } catch (e) {
      this._strategy = { type: 'custom:dwains-dashboard-next' };
      console.warn('Kon lovelace config niet ophalen voor instellingen', e);
    }
    if (restrictNonAdminDashboardSettings(this.hass, this.dashboardSettings)) {
      alert('You do not have permission to change Dwains Dashboard settings.');
      this.closeDialog();
      return;
    }
    this._open = true;
  }

  public closeDialog(): void {
    this._open = false;
    this._strategy = undefined;
    this.remove();
  }

  private _wsBase() {
    const seg = window.location.pathname.split('/')[1];
    return seg && seg !== 'lovelace' ? { url_path: seg } : {};
  }

  private _onConfigChanged = (e: any) => {
    e.stopPropagation();
    this._pending = e.detail?.config;
  };

  private async _save(): Promise<void> {
    if (this._pending) {
      try {
        const base = this._wsBase();
        const cfg: any = await this.hass.callWS({ type: 'lovelace/config', ...base });
        const strat = cfg?.strategy || {};
        // Merge: behoud bestaande velden (o.a. pages) en overschrijf met de wijzigingen.
        const newStrat = { ...strat, ...this._pending };
        await this.hass.callWS({
          type: 'lovelace/config/save',
          ...base,
          config: { ...cfg, strategy: newStrat },
        });
      } catch (e) {
        alert(this._t('strategy.save_name_failed').replace('{error}', String(e)));
        return;
      }
    }
    this.closeDialog();
  }

  protected updated(): void {
    // Geef de editor z'n hass + config zodra hij in de DOM staat.
    if (this._open && !this._editorInited) {
      const ed = this.renderRoot?.querySelector('dwains-dashboard-next-strategy-editor') as any;
      if (ed) {
        this._editorInited = true;
        ed.hass = this.hass;
        ed.setConfig(this._strategy);
      }
    }
  }

  protected render() {
    if (!this._open) return nothing;
    return html`
      <ha-dialog open @closed=${this.closeDialog} .heading=${this._t('sidebar.dashboard_settings')} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${mdiClose}
            .label=${this._t('common.close')}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${this._t('sidebar.dashboard_settings')}</span>
        </ha-dialog-header>

        <div class="content" @config-changed=${this._onConfigChanged}>
          <dwains-dashboard-next-strategy-editor></dwains-dashboard-next-strategy-editor>
        </div>

        <div class="actions">
          <ha-button appearance="plain" @click=${this.closeDialog}>
            ${this._t('common.back')}
          </ha-button>
          <ha-button appearance="accent" @click=${this._save}>
            ${this._t('common.save')}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static override styles = css`
    :host {
      --mdc-dialog-min-width: 90vw;
      --mdc-dialog-max-width: 720px;
    }
    ha-dialog {
      --dialog-content-padding: 0;
    }
    .content {
      padding: 0 8px;
    }
    .actions {
      position: sticky;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 16px;
      background: var(--card-background-color, #fff);
      border-top: 1px solid var(--divider-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-settings-dialog': DwainsDashboardSettingsDialog;
  }
}

/** Open (of hergebruik) de instellingen-dialog. */
export function openDashboardSettings(hass: any, settings?: DwainsDashboardSettings): void {
  if (!hass) return;
  if (restrictNonAdminDashboardSettings(hass, settings)) {
    alert('You do not have permission to change Dwains Dashboard settings.');
    return;
  }
  let dlg = document.querySelector(
    'dwains-dashboard-next-settings-dialog'
  ) as DwainsDashboardSettingsDialog | null;
  if (!dlg) {
    dlg = document.createElement('dwains-dashboard-next-settings-dialog') as DwainsDashboardSettingsDialog;
    document.body.appendChild(dlg);
  }
  dlg.hass = hass;
  dlg.dashboardSettings = settings;
  dlg.showDialog();
}
