import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { BlueprintPage, DwainsDashboardSettings } from '../types/strategy';
import { ddLocalize } from '../utils/localize';
import { restrictNonAdminDashboardSettings } from '../utils/security';
import { showBlueprintDialog } from './utils/show-blueprint-dialog';
import { ensureBottomNav } from './dwains-bottom-nav';
import './utils/dd-card-host';

/**
 * dwains-dashboard-next-page-card — wrapper-kaart die in een eigen HA-view (tab) staat.
 *
 * Twee modi:
 *  - page-modus: toont een beheer-balk (naam + bewerken/verwijderen) en daaronder
 *    de ingevulde blueprint-kaart.
 *  - add-modus: een "+"-tab met een knop om een nieuwe blueprint toe te voegen.
 *
 * Beheer (toevoegen/bewerken/verwijderen) schrijft naar strategy.pages via de
 * websocket en navigeert daarna naar de juiste tab.
 */
@customElement('dwains-dashboard-next-page-card')
export class DwainsPageCard extends LitElement {
  private _hass?: any;
  @state() private _page?: BlueprintPage;
  @state() private _add = false;
  private _settings?: DwainsDashboardSettings;

  set hass(hass: any) {
    this._hass = hass;
    ensureBottomNav(hass, this._settings);
    const host = this.renderRoot?.querySelector('dwains-dashboard-next-card-host') as any;
    if (host) host.hass = hass;
  }
  get hass() {
    return this._hass;
  }

  setConfig(config: any) {
    this._add = !!config?.add;
    this._page = config?.page;
    this._settings = config?.settings || {};
    if (this._hass) ensureBottomNav(this._hass, this._settings);
  }

  getCardSize() {
    return 10;
  }

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this._hass, key, vars);

  private _canManageDashboard(): boolean {
    return !restrictNonAdminDashboardSettings(this._hass, this._settings);
  }

  // ---- Navigatie ------------------------------------------------------------

  private _dashSegment(): string | undefined {
    const seg = window.location.pathname.split('/')[1];
    return !seg || seg === 'lovelace' ? undefined : seg;
  }

  private _go(viewPath: string) {
    const seg = this._dashSegment();
    window.location.href = `/${seg || 'lovelace'}/${viewPath}`;
  }

  // ---- Opslaan (strategy.pages) --------------------------------------------

  private async _mutatePages(
    fn: (pages: BlueprintPage[]) => BlueprintPage[]
  ): Promise<boolean> {
    if (!this._canManageDashboard()) return false;
    try {
      const seg = this._dashSegment();
      const base = seg ? { url_path: seg } : {};
      const cfg: any = await this._hass.callWS({ type: 'lovelace/config', ...base });
      if (!cfg || !cfg.strategy) {
        console.warn('⚠️ Geen strategy in lovelace config — opslaan overgeslagen', cfg);
        return false;
      }
      const pages = fn([...((cfg.strategy.pages as BlueprintPage[]) || [])]);
      const newConfig = { ...cfg, strategy: { ...cfg.strategy, pages } };
      await this._hass.callWS({ type: 'lovelace/config/save', ...base, config: newConfig });
      return true;
    } catch (e) {
      console.error('❌ Opslaan pagina mislukt:', e);
      alert(this._t('layout.save_page_failed', { error: String(e) }));
      return false;
    }
  }

  // ---- Acties ---------------------------------------------------------------

  private _addBlueprint = () => {
    if (!this._canManageDashboard()) return;
    showBlueprintDialog(this, {
      onSave: async (page: BlueprintPage) => {
        const ok = await this._mutatePages((pages) => [
          ...pages.filter((p) => p.id !== page.id),
          page,
        ]);
        if (ok) this._go(page.id);
      },
    });
  };

  private _editPage = () => {
    if (!this._canManageDashboard()) return;
    if (!this._page) return;
    const current = this._page;
    showBlueprintDialog(this, {
      page: current,
      onSave: async (updated: BlueprintPage) => {
        const ok = await this._mutatePages((pages) =>
          pages.map((p) => (p.id === updated.id ? updated : p))
        );
        if (ok) {
          if (updated.id === current.id) window.location.reload();
          else this._go(updated.id);
        }
      },
    });
  };

  private _deletePage = async () => {
    if (!this._canManageDashboard()) return;
    if (!this._page) return;
    const page = this._page;
    if (!confirm(this._t('layout.delete_page_confirm', { name: page.name }))) return;
    const ok = await this._mutatePages((pages) => pages.filter((p) => p.id !== page.id));
    if (ok) this._go('home');
  };

  // ---- Render ---------------------------------------------------------------

  protected render() {
    if (this._add) return this._renderAdd();
    if (this._page) return this._renderPage();
    return nothing;
  }

  private _renderAdd() {
    if (!this._canManageDashboard()) return nothing;
    return html`
      <div class="add-wrap">
        <ha-card>
          <div class="add-inner">
            <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
            <div class="add-title">${this._t('page.add_title')}</div>
            <div class="add-desc">${this._t('page.add_desc')}</div>
            <ha-button appearance="accent" @click=${this._addBlueprint}>
              ${this._t('sidebar.add_blueprint')}
            </ha-button>
          </div>
        </ha-card>
      </div>
    `;
  }

  private _renderPage() {
    const page = this._page!;
    return html`
      <div class="page-wrap">
        <div class="page-toolbar">
          <div class="page-title">
            <ha-icon icon=${page.icon || 'mdi:puzzle'}></ha-icon>
            <span>${page.name}</span>
          </div>
          <div class="page-actions">
            ${this._canManageDashboard() ? html`
              <button title=${this._t('common.edit')} @click=${this._editPage}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
              <button class="danger" title=${this._t('common.delete')} @click=${this._deletePage}>
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            ` : nothing}
          </div>
        </div>
        <dwains-dashboard-next-card-host .hass=${this._hass} .config=${page.card}></dwains-dashboard-next-card-host>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }
    .page-wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 8px 12px 24px;
    }
    .page-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }
    .page-title ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color);
    }
    .page-actions {
      margin-left: auto;
      display: flex;
      gap: 6px;
    }
    .page-actions button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .page-actions button:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }
    .page-actions button.danger:hover {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.16);
      color: var(--error-color, #f44336);
    }
    .page-actions ha-icon {
      --mdc-icon-size: 20px;
    }
    dwains-dashboard-next-card-host {
      display: block;
    }
    .add-wrap {
      max-width: 520px;
      margin: 40px auto;
      padding: 0 16px;
    }
    .add-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      padding: 32px 24px;
    }
    .add-inner ha-icon {
      --mdc-icon-size: 48px;
      color: var(--primary-color);
    }
    .add-title {
      font-size: 20px;
      font-weight: 600;
    }
    .add-desc {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .page-wrap {
        padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-page-card': DwainsPageCard;
  }
}
