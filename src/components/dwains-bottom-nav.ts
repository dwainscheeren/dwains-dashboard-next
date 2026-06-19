import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ddLocalize } from '../utils/localize';
import { openDashboardSettings } from './dwains-dashboard-settings-dialog';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  action?: 'menu';
}

const MENU_PATH = '__ha_menu__';

/**
 * dwains-bottom-nav — vaste navigatiebalk onderaan op mobiel (smart-home-app
 * gevoel), zoals Dwains Dashboard 3.x. Spiegelt de views die de strategy maakt
 * (Home, Devices, blueprint-pagina's, +) plus een knop voor het HA-hoofdmenu.
 *
 * De balk blijft permanent in document.body hangen (via `ensureBottomNav`) en
 * regelt z'n eigen zichtbaarheid op basis van de dashboard-URL — zo flikkert hij
 * niet bij het wisselen tussen views.
 */
@customElement('dwains-bottom-nav')
export class DwainsBottomNav extends LitElement {
  private _hass?: any;
  /** Het URL-segment van ons dashboard (gezet door ensureBottomNav). */
  public dashSegment = '';
  @state() private _items: NavItem[] = [];
  @state() private _active = '';
  @state() private _visible = true;

  set hass(hass: any) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._loadItems();
  }
  get hass() {
    return this._hass;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._sync();
    window.addEventListener('location-changed', this._sync);
    window.addEventListener('popstate', this._sync);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('location-changed', this._sync);
    window.removeEventListener('popstate', this._sync);
  }

  private _sync = () => {
    this._active = this._currentPath();
    // Zichtbaar zolang we op ons eigen dashboard zitten.
    this._visible = !this.dashSegment || this._segment() === this.dashSegment;
  };

  private _segment(): string {
    const seg = window.location.pathname.split('/')[1];
    return seg && seg !== 'lovelace' ? seg : 'lovelace';
  }

  private _currentPath(): string {
    return window.location.pathname.split('/')[2] || 'home';
  }

  private async _loadItems(): Promise<void> {
    let pages: any[] = [];
    try {
      const seg = this._segment();
      const base = seg !== 'lovelace' ? { url_path: seg } : {};
      const cfg: any = await this._hass.callWS({ type: 'lovelace/config', ...base });
      pages = Array.isArray(cfg?.strategy?.pages) ? cfg.strategy.pages : [];
    } catch {
      /* negeer — toon dan alleen de vaste items */
    }

    this._items = [
      { path: 'home', icon: 'mdi:home', label: ddLocalize(this._hass, 'sidebar.home') },
      {
        path: 'devices',
        icon: 'mdi:format-list-bulleted-type',
        label: ddLocalize(this._hass, 'devices.title'),
      },
      ...pages.map((p) => ({
        path: String(p.id),
        icon: p.icon || 'mdi:puzzle',
        label: String(p.name || ''),
      })),
      { path: MENU_PATH, icon: 'mdi:menu', label: 'Menu', action: 'menu' },
    ];
  }

  private _onItem(item: NavItem): void {
    if (item.action === 'menu') {
      this._toggleHaMenu();
      return;
    }
    this._go(item.path);
  }

  private _toggleHaMenu(): void {
    // hass-toggle-menu wordt afgehandeld door <home-assistant-main>, dat in de
    // shadow-DOM van <home-assistant> zit. Het event moet dus DAAR (of dieper)
    // afgevuurd worden — van buitenaf bubblet het er niet in.
    // Zorg dat het zijmenu aan de rechterkant staat vóór we het openen.
    _forceDrawerRight();
    const makeEv = () =>
      new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true });
    const main = _deepFind('home-assistant-main');
    if (main) {
      main.dispatchEvent(makeEv());
      return;
    }
    document.querySelector('home-assistant')?.dispatchEvent(makeEv());
  }

  private _go(path: string): void {
    const url = `/${this._segment()}/${path}`;
    window.history.pushState(null, '', url);
    const ev = new Event('location-changed', { bubbles: true, composed: true });
    (ev as any).detail = { replace: false };
    window.dispatchEvent(ev);
    this._active = path;
  }

  protected render() {
    if (!this._visible || !this._items.length) return nothing;
    return html`
      <nav class="bar">
        ${this._items.map(
          (it) => html`
            <button
              class="item ${this._active === it.path ? 'active' : ''}"
              @click=${() => this._onItem(it)}
              title=${it.label}
            >
              <ha-icon icon=${it.icon}></ha-icon>
              <span>${it.label}</span>
            </button>
          `
        )}
      </nav>
    `;
  }

  static override styles = css`
    :host {
      display: none;
    }
    @media (max-width: 768px) {
      :host {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 6;
      }
    }
    .bar {
      display: flex;
      align-items: stretch;
      justify-content: space-around;
      background: var(--card-background-color, #fff);
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-bottom: env(safe-area-inset-bottom, 0px);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
    }
    .item {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 8px 2px 6px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #727272);
      transition: color 0.15s ease;
    }
    .item ha-icon {
      --mdc-icon-size: 24px;
    }
    .item span {
      font-size: 11px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item.active {
      color: var(--primary-color, #03a9f4);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-bottom-nav': DwainsBottomNav;
  }
}

/** Zorg dat er precies één bottom-nav in de document body hangt en geef hem hass. */
export function ensureBottomNav(hass: any): void {
  if (!hass) return;
  let el = document.querySelector('dwains-bottom-nav') as DwainsBottomNav | null;
  if (!el) {
    el = document.createElement('dwains-bottom-nav') as DwainsBottomNav;
    document.body.appendChild(el);
    _hideNativeHeaderOnMobile();
    _injectSidebarSection(hass);
  }
  // Zet HA's mobiele zijmenu (wa-drawer) op de rechterkant.
  _forceDrawerRight();
  // Onthoud het dashboard-segment waarop wij draaien (voor de zichtbaarheid).
  const seg = window.location.pathname.split('/')[1];
  el.dashSegment = seg && seg !== 'lovelace' ? seg : 'lovelace';
  el.hass = hass;
}

/**
 * Verberg HA's eigen kopbalk (toolbar + tabs) op mobiel, zodat onze onderbalk de
 * navigatie wordt en het geheel als een app voelt. Best-effort: zoekt hui-root
 * in de shadow-DOM en injecteert daar een style. Faalt het, dan blijft de
 * bovenbalk gewoon staan.
 */
function _hideNativeHeaderOnMobile(attempt = 0): void {
  const huiRoot = _deepFind('hui-root');
  if (huiRoot && huiRoot.shadowRoot) {
    if (!huiRoot.shadowRoot.querySelector('#dd-hide-header')) {
      const style = document.createElement('style');
      style.id = 'dd-hide-header';
      style.textContent = `
        @media (max-width: 768px) {
          .header,
          .toolbar,
          ha-tab-group,
          [role="tablist"] { display: none !important; }
          #view, .view, hui-view, hui-sections-view, hui-masonry-view {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
        }
      `;
      huiRoot.shadowRoot.appendChild(style);
    }
    return;
  }
  if (attempt < 25) {
    setTimeout(() => _hideNativeHeaderOnMobile(attempt + 1), 300);
  }
}

/**
 * HA's mobiele zijmenu is een Web Awesome <wa-drawer placement="start"> (links).
 * Door placement op "end" te zetten schuift het van rechts open. Het attribuut
 * staat statisch in HA's template en wordt bij re-renders niet teruggezet, maar
 * we passen het bij elke ensureBottomNav opnieuw toe voor het geval het element
 * opnieuw is aangemaakt (bv. na resize). Bestaat het (nog) niet, dan no-op.
 */
function _forceDrawerRight(): void {
  const wa = _deepFind('wa-drawer');
  if (wa && wa.getAttribute('placement') !== 'end') {
    wa.setAttribute('placement', 'end');
  }
}

// ---- DD-sectie bovenin het HA-zijmenu -------------------------------------

let _sidebarObserver: MutationObserver | undefined;

/** Navigeer (soft) naar een view-pad binnen het huidige dashboard. */
function _navigate(path: string): void {
  const seg = window.location.pathname.split('/')[1] || 'lovelace';
  window.history.pushState(null, '', `/${seg}/${path}`);
  const ev = new Event('location-changed', { bubbles: true, composed: true });
  (ev as any).detail = { replace: false };
  window.dispatchEvent(ev);
}

/** Sluit (toggle) het HA-zijmenu. */
function _closeSidebar(): void {
  const ev = new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true });
  (_deepFind('home-assistant-main') || document.querySelector('home-assistant'))?.dispatchEvent(ev);
}

function _isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

/** (Her)bouw de DD-sectie en zet hem bovenaan de sidebar-shadow (alleen mobiel). */
function _buildSidebarSection(sidebar: Element, hass: any): void {
  const sr = sidebar.shadowRoot;
  if (!sr) return;
  const existing = sr.querySelector('#dd-sidebar-section');
  // Op desktop willen we de DD-sectie NIET (daar zijn de toptabs zichtbaar).
  if (!_isMobileViewport()) {
    existing?.remove();
    return;
  }
  if (existing) return;

  const t = (k: string) => ddLocalize(hass, k);
  const wrap = document.createElement('div');
  wrap.id = 'dd-sidebar-section';

  const style = document.createElement('style');
  style.textContent = `
    #dd-sidebar-section {
      padding: 8px 8px 6px;
      border-bottom: 1px solid var(--divider-color);
    }
    #dd-sidebar-section .dd-h {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--secondary-text-color);
      padding: 6px 12px 2px;
    }
    #dd-sidebar-section .dd-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--sidebar-text-color, var(--primary-text-color));
    }
    #dd-sidebar-section .dd-item:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), .12);
    }
    #dd-sidebar-section .dd-item ha-icon {
      color: var(--sidebar-icon-color, var(--primary-text-color));
      --mdc-icon-size: 24px;
    }
    #dd-sidebar-section .dd-item span {
      font-size: 14px;
      font-weight: 500;
    }
  `;
  wrap.appendChild(style);

  const heading = document.createElement('div');
  heading.className = 'dd-h';
  heading.textContent = t('sidebar.section_title');
  wrap.appendChild(heading);

  const mkItem = (icon: string, label: string, onClick: () => void) => {
    const item = document.createElement('div');
    item.className = 'dd-item';
    item.setAttribute('role', 'button');
    const ic = document.createElement('ha-icon');
    ic.setAttribute('icon', icon);
    item.appendChild(ic);
    const sp = document.createElement('span');
    sp.textContent = label;
    item.appendChild(sp);
    item.addEventListener('click', onClick);
    return item;
  };

  wrap.appendChild(
    mkItem('mdi:puzzle-plus-outline', t('sidebar.add_blueprint'), () => {
      _closeSidebar();
      _navigate('add-blueprint');
    })
  );
  wrap.appendChild(
    mkItem('mdi:cog', t('sidebar.dashboard_settings'), () => {
      _closeSidebar();
      openDashboardSettings(hass);
    })
  );

  sr.insertBefore(wrap, sr.firstChild);
}

/**
 * Injecteer de DD-sectie bovenin het HA-zijmenu (ha-sidebar). Een
 * MutationObserver herstelt de sectie als HA bij een re-render z'n shadow
 * opnieuw opbouwt. Best-effort: lukt het niet, dan blijft de sidebar standaard.
 */
function _injectSidebarSection(hass: any, attempt = 0): void {
  const sidebar = _deepFind('ha-sidebar');
  if (!sidebar || !sidebar.shadowRoot) {
    if (attempt < 25) setTimeout(() => _injectSidebarSection(hass, attempt + 1), 300);
    return;
  }
  _buildSidebarSection(sidebar, hass);
  if (!_sidebarObserver) {
    _sidebarObserver = new MutationObserver(() => {
      const sb = _deepFind('ha-sidebar');
      if (sb?.shadowRoot && !sb.shadowRoot.querySelector('#dd-sidebar-section')) {
        _buildSidebarSection(sb, hass);
      }
    });
    _sidebarObserver.observe(sidebar.shadowRoot, { childList: true });

    // Bij wisselen mobiel/desktop opnieuw evalueren (toevoegen of verwijderen).
    window.matchMedia('(max-width: 768px)').addEventListener('change', () => {
      const sb = _deepFind('ha-sidebar');
      if (sb) _buildSidebarSection(sb, hass);
    });
  }
}

/** Zoek het eerste element met de gegeven tag, dwars door shadow-roots heen. */
function _deepFind(tag: string): Element | null {
  const seen = new Set<Element>();
  const queue: (Document | ShadowRoot)[] = [document];
  while (queue.length) {
    const root = queue.shift()!;
    const direct = root.querySelector(tag);
    if (direct) return direct;
    root.querySelectorAll('*').forEach((el) => {
      const sr = (el as Element).shadowRoot;
      if (sr && !seen.has(el)) {
        seen.add(el);
        queue.push(sr);
      }
    });
  }
  return null;
}
