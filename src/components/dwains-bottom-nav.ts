import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { DwainsDashboardSettings } from '../types/strategy';
import { ddLocalize } from '../utils/localize';
import { navigateHomeAssistant } from '../utils/navigation';
import {
  restrictNonAdminDashboardSettings,
  restrictNonAdminHaSidebar,
} from '../utils/security';
import { openDashboardSettings } from './dwains-dashboard-settings-dialog';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  action?: 'home' | 'devices' | 'pages' | 'menu';
}

interface PageItem {
  path: string;
  icon: string;
  label: string;
}

interface AreaContext {
  areaId: string | null;
  icon?: string;
  name?: string;
  view: 'home' | 'area';
}

interface DeviceContext {
  domain: string | null;
  icon?: string;
  label?: string;
}

const MENU_PATH = '__ha_menu__';
const PAGES_PATH = '__dd_pages__';
const MOBILE_NAV_QUERY = '(max-width: 768px)';
const MOBILE_NAV_ACTIVE_CLASS = 'dd-next-mobile-nav-active';
const HIDE_NATIVE_HEADER_STYLE_ID = 'dd-hide-header';
const HIDDEN_NATIVE_HEADER_ATTR = 'data-dd-next-native-header-hidden';
const HIDDEN_NATIVE_HEADER_OLD_STYLE_ATTR = 'data-dd-next-native-header-old-style';

/**
 * dwains-dashboard-next-bottom-nav — vaste navigatiebalk onderaan op mobiel (smart-home-app
 * gevoel), zoals Dwains Dashboard 3.x. Spiegelt de views die de strategy maakt
 * (Home, Devices, blueprint-pagina's, +) plus een knop voor het HA-hoofdmenu.
 *
 * De balk blijft permanent in document.body hangen (via `ensureBottomNav`) en
 * regelt z'n eigen zichtbaarheid op basis van de dashboard-URL — zo flikkert hij
 * niet bij het wisselen tussen views.
 */
@customElement('dwains-dashboard-next-bottom-nav')
export class DwainsBottomNav extends LitElement {
  private _hass?: any;
  /** Het URL-segment van ons dashboard (gezet door ensureBottomNav). */
  public dashSegment = '';
  @state() private _items: NavItem[] = [];
  @state() private _active = '';
  @state() private _visible = true;
  @state() private _areaContext: AreaContext = { areaId: null, view: 'home' };
  @state() private _deviceContext: DeviceContext = { domain: null };
  @state() private _pages: PageItem[] = [];
  @state() private _pagesOpen = false;
  @state() private _restrictedMenuOpen = false;
  private _settings?: DwainsDashboardSettings;

  set hass(hass: any) {
    const first = !this._hass;
    this._hass = hass;
    _applyHaSidebarRestriction(this._hass, this._settings, this.dashSegment);
    _syncHaShellForBottomNav(this.dashSegment);
    _injectSidebarSection(this._hass, this._settings, this.dashSegment);
    if (first) this._loadItems();
  }
  get hass() {
    return this._hass;
  }

  set dashboardSettings(settings: DwainsDashboardSettings | undefined) {
    this._settings = settings;
    if (!this._isHaMenuRestricted()) this._restrictedMenuOpen = false;
    _applyHaSidebarRestriction(this._hass, this._settings, this.dashSegment);
    _syncHaShellForBottomNav(this.dashSegment);
    _injectSidebarSection(this._hass, this._settings, this.dashSegment);
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._sync();
    window.addEventListener('location-changed', this._sync);
    window.addEventListener('popstate', this._sync);
    window.addEventListener('dwains-dashboard-next-area-context-changed', this._handleAreaContext as EventListener);
    window.addEventListener('dwains-dashboard-next-device-context-changed', this._handleDeviceContext as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('location-changed', this._sync);
    window.removeEventListener('popstate', this._sync);
    window.removeEventListener('dwains-dashboard-next-area-context-changed', this._handleAreaContext as EventListener);
    window.removeEventListener('dwains-dashboard-next-device-context-changed', this._handleDeviceContext as EventListener);
  }

  private _sync = () => {
    this._active = this._normalizeActivePath(this._currentPath());
    // Zichtbaar zolang we op ons eigen dashboard zitten.
    this._visible = !this.dashSegment || this._segment() === this.dashSegment;
    _applyHaSidebarRestriction(this._hass, this._settings, this.dashSegment);
    _syncHaShellForBottomNav(this.dashSegment);
    _injectSidebarSection(this._hass, this._settings, this.dashSegment);
    if (!this._visible) {
      this._pagesOpen = false;
      this._restrictedMenuOpen = false;
    }
    if (!this._isHaMenuRestricted()) this._restrictedMenuOpen = false;
  };

  private _segment(): string {
    const seg = window.location.pathname.split('/')[1];
    return seg && seg !== 'lovelace' ? seg : 'lovelace';
  }

  private _currentPath(): string {
    return window.location.pathname.split('/')[2] || 'home';
  }

  private _handleAreaContext = (event: CustomEvent<AreaContext>) => {
    this._areaContext = event.detail || { areaId: null, view: 'home' };
    if (this._isHomeRoute(this._currentPath())) {
      this._active = 'home';
    }
  };

  private _handleDeviceContext = (event: CustomEvent<DeviceContext>) => {
    this._deviceContext = event.detail || { domain: null };
    if (this._currentPath() === 'devices') {
      this._active = 'devices';
    }
  };

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

    this._pages = pages.map((p) => ({
      path: String(p.id),
      icon: p.icon || 'mdi:puzzle',
      label: String(p.name || p.id || ''),
    }));

    const pageNavItems: NavItem[] = this._pages.length > 1
      ? [{
          path: PAGES_PATH,
          icon: 'mdi:puzzle',
          label: 'Pages',
          action: 'pages',
        }]
      : this._pages.map((p) => ({ ...p }));

    this._items = [
      {
        path: 'home',
        icon: 'mdi:home',
        label: ddLocalize(this._hass, 'sidebar.home'),
        action: 'home',
      },
      {
        path: 'devices',
        icon: 'mdi:format-list-bulleted-type',
        label: ddLocalize(this._hass, 'devices.title'),
        action: 'devices',
      },
      ...pageNavItems,
      { path: MENU_PATH, icon: 'mdi:menu', label: 'Menu', action: 'menu' },
    ];
    this._sync();
  }

  private _onItem(item: NavItem): void {
    if (item.action === 'home') {
      this._openHomeAreas();
      return;
    }
    if (item.action === 'devices') {
      this._openDeviceTypes();
      return;
    }
    if (item.action === 'pages') {
      this._openPages();
      return;
    }
    if (item.action === 'menu') {
      this._pagesOpen = false;
      this._toggleHaMenu();
      return;
    }
    this._go(item.path);
  }

  private _openHomeAreas(): void {
    this._pagesOpen = false;
    const fire = () => {
      this._active = 'home';
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-toggle-area-nav'));
    };

    if (this._currentPath() !== 'home') {
      this._go('home');
      return;
    }

    fire();
  }

  private _openDeviceTypes(): void {
    this._pagesOpen = false;
    const fire = () => {
      this._active = 'devices';
      window.dispatchEvent(new CustomEvent('dwains-dashboard-next-toggle-devices-nav'));
    };

    if (this._currentPath() !== 'devices') {
      this._go('devices');
      return;
    }

    fire();
  }

  private _openPages(): void {
    const onlyPage = this._pages[0];
    if (this._pages.length === 1 && onlyPage) {
      this._go(onlyPage.path);
      return;
    }
    this._pagesOpen = !this._pagesOpen;
  }

  private _closePages = (): void => {
    this._pagesOpen = false;
  };

  private _isHaMenuRestricted(): boolean {
    return restrictNonAdminHaSidebar(this._hass, this._settings);
  }

  private _openRestrictedMenu(): void {
    this._pagesOpen = false;
    this._restrictedMenuOpen = !this._restrictedMenuOpen;
  }

  private _closeRestrictedMenu = (): void => {
    this._restrictedMenuOpen = false;
  };

  private _openProfileSettings = (): void => {
    this._restrictedMenuOpen = false;
    navigateHomeAssistant('/profile/general');
  };

  private _toggleHaMenu(): void {
    if (this._isHaMenuRestricted()) {
      this._openRestrictedMenu();
      return;
    }
    // hass-toggle-menu wordt afgehandeld door <home-assistant-main>, dat in de
    // shadow-DOM van <home-assistant> zit. Het event moet dus DAAR (of dieper)
    // afgevuurd worden — van buitenaf bubblet het er niet in.
    _setDrawerPlacement(_isMobileNavActive(this.dashSegment) ? 'end' : 'start');
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
    this._pagesOpen = false;
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
      ${this._renderPagesSheet()}
      ${this._renderRestrictedMenuSheet()}
      <nav class="bar">
        ${this._items.map(
          (it) => {
            const display = this._displayItem(it);
            const active = this._isItemActive(it);
            return html`
            <button
              class="item ${active ? 'active' : ''} ${it.action === 'home' || it.action === 'devices' || it.action === 'pages' ? 'switcher' : ''}"
              @click=${() => this._onItem(it)}
              title=${display.label}
              aria-label=${display.label}
              aria-current=${active ? 'page' : nothing}
            >
              <ha-icon icon=${display.icon}></ha-icon>
              <span>${display.label}</span>
            </button>
          `;
          }
        )}
      </nav>
    `;
  }

  private _renderRestrictedMenuSheet() {
    if (!this._isHaMenuRestricted()) return nothing;
    return html`
      <button
        class="pages-backdrop ${this._restrictedMenuOpen ? 'open' : ''}"
        aria-label="Close menu"
        @click=${this._closeRestrictedMenu}
      ></button>
      <section class="pages-sheet ${this._restrictedMenuOpen ? 'open' : ''}" aria-hidden=${this._restrictedMenuOpen ? 'false' : 'true'}>
        <div class="pages-handle"></div>
        <div class="pages-heading">
          <ha-icon icon="mdi:account-circle"></ha-icon>
          <span>Menu</span>
        </div>
        <div class="pages-list">
          <button class="page-row" @click=${this._openProfileSettings}>
            <span class="page-icon"><ha-icon icon="mdi:account-cog"></ha-icon></span>
            <span class="page-copy">
              <span class="page-name">Profile settings</span>
              <span class="page-subtitle">Open your Home Assistant profile</span>
            </span>
            <ha-icon class="page-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
      </section>
    `;
  }

  private _renderPagesSheet() {
    if (this._pages.length <= 1) return nothing;
    return html`
      <button
        class="pages-backdrop ${this._pagesOpen ? 'open' : ''}"
        aria-label="Close pages"
        @click=${this._closePages}
      ></button>
      <section class="pages-sheet ${this._pagesOpen ? 'open' : ''}" aria-hidden=${this._pagesOpen ? 'false' : 'true'}>
        <div class="pages-handle"></div>
        <div class="pages-heading">
          <ha-icon icon="mdi:puzzle"></ha-icon>
          <span>Pages</span>
        </div>
        <div class="pages-list">
          ${this._pages.map((page) => {
            const active = this._active === page.path;
            return html`
              <button
                class="page-row ${active ? 'active' : ''}"
                @click=${() => this._go(page.path)}
                aria-current=${active ? 'page' : nothing}
              >
                <span class="page-icon"><ha-icon icon=${page.icon}></ha-icon></span>
                <span class="page-copy">
                  <span class="page-name">${page.label}</span>
                  <span class="page-subtitle">${active ? 'Current page' : 'Open page'}</span>
                </span>
                <ha-icon class="page-chevron" icon=${active ? 'mdi:check' : 'mdi:chevron-right'}></ha-icon>
              </button>
            `;
          })}
        </div>
      </section>
    `;
  }

  private _isItemActive(item: NavItem): boolean {
    if (item.action === 'pages') return this._pages.some((page) => page.path === this._active);
    return this._active === item.path;
  }

  private _isHomeRoute(path: string): boolean {
    return !path || path === 'home' || path === '0' || path === 'overview';
  }

  private _normalizeActivePath(path: string): string {
    if (this._isHomeRoute(path)) return 'home';
    return path;
  }

  private _activePage(): PageItem | undefined {
    return this._pages.find((page) => page.path === this._active);
  }

  private _displayItem(item: NavItem): Pick<NavItem, 'icon' | 'label'> {
    if (
      item.action === 'home' &&
      this._active === item.path &&
      this._areaContext.view === 'area' &&
      this._areaContext.areaId
    ) {
      return {
        icon: this._areaContext.icon || 'mdi:home',
        label: this._areaContext.name || ddLocalize(this._hass, 'sidebar.home'),
      };
    }

    if (
      item.action === 'devices' &&
      this._active === item.path &&
      this._deviceContext.domain
    ) {
      return {
        icon: this._deviceContext.icon || item.icon,
        label: this._deviceContext.label || item.label,
      };
    }

    if (item.action === 'pages') {
      const activePage = this._activePage();
      if (activePage) {
        return {
          icon: activePage.icon,
          label: activePage.label,
        };
      }
    }

    return {
      icon: item.icon,
      label: item.label,
    };
  }

  static override styles = css`
    :host {
      display: none;
      -webkit-tap-highlight-color: transparent;
    }
    @media (max-width: 768px) {
      :host {
        display: block;
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: calc(8px + env(safe-area-inset-bottom, 0px));
        z-index: 140;
        pointer-events: none;
      }
    }
    .bar {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: max-content;
      max-width: calc(100vw - 32px);
      margin: 0 auto;
      padding: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.44)),
        rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(255, 255, 255, 0.72);
      box-shadow:
        0 22px 50px rgba(15, 23, 42, 0.15),
        0 8px 20px rgba(255, 255, 255, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 0 rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(26px) saturate(180%);
      -webkit-backdrop-filter: blur(26px) saturate(180%);
      pointer-events: auto;
      transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        background-color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .bar::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.92),
          rgba(255, 255, 255, 0.38) 24%,
          rgba(255, 255, 255, 0.12) 100%);
      opacity: 0.92;
    }
    .bar::after {
      content: "";
      position: absolute;
      inset: auto 18% 4px;
      height: 1px;
      border-radius: 999px;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.82);
      opacity: 0.72;
    }
    .bar::-webkit-scrollbar {
      display: none;
    }
    .item {
      position: relative;
      z-index: 1;
      flex: 0 0 auto;
      min-width: 44px;
      height: 44px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 12px;
      border: none;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      color: rgba(15, 23, 42, 0.66);
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }
    .item ha-icon {
      --mdc-icon-size: 21px;
    }
    .item span {
      display: none;
      max-width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
    }
    .item:hover {
      transform: translateY(-1px);
      color: rgba(15, 23, 42, 0.9);
    }
    .item.active {
      min-width: 118px;
      justify-content: space-between;
      padding: 0 13px;
      background:
        linear-gradient(180deg,
          rgba(15, 23, 42, 0.14),
          rgba(15, 23, 42, 0.08) 52%,
          rgba(15, 23, 42, 0.12) 100%);
      color: rgba(15, 23, 42, 0.96);
      box-shadow:
        0 12px 24px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.48),
        inset 0 0 0 1px rgba(15, 23, 42, 0.06);
    }
    .item.active span {
      display: inline;
    }
    .item.active.switcher::after {
      content: "";
      width: 7px;
      height: 7px;
      border-right: 2px solid currentColor;
      border-top: 2px solid currentColor;
      transform: rotate(-45deg) translateY(2px);
      opacity: 0.72;
      flex: 0 0 auto;
    }

    .pages-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1;
      width: 100vw;
      height: 100vh;
      padding: 0;
      border: 0;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      background: rgba(8, 13, 24, 0.18);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      transition:
        opacity 0.22s ease,
        visibility 0.22s ease;
    }

    .pages-backdrop.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .pages-sheet {
      position: fixed;
      left: 18px;
      right: 18px;
      bottom: calc(94px + env(safe-area-inset-bottom, 0px));
      z-index: 2;
      max-height: min(54vh, 460px);
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 10px 12px;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.72);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82)),
        rgba(255, 255, 255, 0.86);
      box-shadow:
        0 24px 58px rgba(15, 23, 42, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(28px) saturate(170%);
      -webkit-backdrop-filter: blur(28px) saturate(170%);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(18px) scale(0.98);
      transform-origin: bottom center;
      transition:
        opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0.24s ease;
    }

    .pages-sheet.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .pages-handle {
      width: 42px;
      height: 4px;
      margin: 0 auto 1px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.14);
    }

    .pages-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 4px;
      color: rgba(15, 23, 42, 0.86);
      font-size: 15px;
      font-weight: 900;
      line-height: 1;
    }

    .pages-heading ha-icon {
      --mdc-icon-size: 20px;
      color: rgba(15, 23, 42, 0.78);
    }

    .pages-list {
      display: grid;
      gap: 8px;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: none;
    }

    .pages-list::-webkit-scrollbar {
      display: none;
    }

    .page-row {
      min-height: 60px;
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) 26px;
      align-items: center;
      gap: 11px;
      padding: 8px 10px;
      border: 0;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.68);
      color: rgba(15, 23, 42, 0.9);
      text-align: left;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.06),
        0 8px 18px rgba(15, 23, 42, 0.06);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .page-row.active {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 11%, rgba(255, 255, 255, 0.86));
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-color, #03a9f4) 28%, transparent),
        0 10px 22px rgba(15, 23, 42, 0.08);
    }

    .page-icon {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      color: var(--primary-color, #03a9f4);
    }

    .page-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .page-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .page-name,
    .page-subtitle {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .page-name {
      font-size: 14px;
      font-weight: 900;
      line-height: 1.05;
    }

    .page-subtitle {
      color: rgba(15, 23, 42, 0.48);
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
    }

    .page-chevron {
      --mdc-icon-size: 21px;
      color: rgba(15, 23, 42, 0.48);
    }

    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
      .bar {
        background: rgba(255, 255, 255, 0.94);
      }
      .pages-sheet {
        background: rgba(255, 255, 255, 0.96);
      }
    }

    @media (max-width: 380px) {
      :host {
        left: 8px;
        right: 8px;
      }
      .bar {
        gap: 6px;
        max-width: calc(100vw - 16px);
        padding: 6px;
      }
      .item {
        min-width: 42px;
        height: 42px;
        padding: 0 11px;
      }
      .item.active {
        min-width: 112px;
      }
      .item span {
        max-width: 78px;
        font-size: 13px;
      }
    }

    @media (prefers-color-scheme: dark) {
      .bar {
        background:
          linear-gradient(180deg, rgba(43, 47, 58, 0.78), rgba(12, 14, 20, 0.74)),
          rgba(14, 16, 22, 0.78);
        border-color: rgba(255, 255, 255, 0.13);
        box-shadow:
          0 24px 58px rgba(0, 0, 0, 0.58),
          0 0 0 1px rgba(255, 255, 255, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          inset 0 -1px 0 rgba(0, 0, 0, 0.34);
        backdrop-filter: blur(30px) saturate(160%);
        -webkit-backdrop-filter: blur(30px) saturate(160%);
      }
      .bar::before {
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.13),
            rgba(255, 255, 255, 0.055) 28%,
            rgba(255, 255, 255, 0.015) 100%);
        opacity: 0.86;
      }
      .bar::after {
        background: rgba(255, 255, 255, 0.2);
        opacity: 0.5;
      }
      .item {
        color: rgba(226, 232, 240, 0.72);
      }
      .item:hover {
        color: rgba(248, 250, 252, 0.96);
        background: rgba(255, 255, 255, 0.055);
      }
      .item.active {
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.115) 48%,
            rgba(255, 255, 255, 0.075) 100%);
        color: #f8fafc;
        box-shadow:
          0 12px 28px rgba(0, 0, 0, 0.38),
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          inset 0 0 0 1px rgba(255, 255, 255, 0.14);
      }
      .item.active ha-icon {
        color: #ffffff;
      }

      .pages-backdrop {
        background: rgba(0, 0, 0, 0.36);
      }

      .pages-sheet {
        border-color: rgba(255, 255, 255, 0.12);
        background:
          linear-gradient(180deg, rgba(38, 42, 52, 0.94), rgba(18, 20, 28, 0.9)),
          rgba(16, 18, 24, 0.92);
        box-shadow:
          0 28px 68px rgba(0, 0, 0, 0.62),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .pages-handle {
        background: rgba(255, 255, 255, 0.18);
      }

      .pages-heading,
      .pages-heading ha-icon {
        color: rgba(248, 250, 252, 0.92);
      }

      .page-row {
        background: rgba(255, 255, 255, 0.07);
        color: rgba(248, 250, 252, 0.94);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 10px 24px rgba(0, 0, 0, 0.18);
      }

      .page-row.active {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 18%, rgba(255, 255, 255, 0.08));
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color, #03a9f4) 42%, transparent),
          0 12px 28px rgba(0, 0, 0, 0.24);
      }

      .page-icon {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 20%, transparent);
      }

      .page-subtitle,
      .page-chevron {
        color: rgba(226, 232, 240, 0.54);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bar,
      .item,
      .pages-backdrop,
      .pages-sheet {
        transition-duration: 0.01ms !important;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-bottom-nav': DwainsBottomNav;
  }
}

/** Zorg dat er precies één bottom-nav in de document body hangt en geef hem hass. */
export function ensureBottomNav(hass: any, settings?: DwainsDashboardSettings): void {
  if (!hass) return;
  let el = document.querySelector('dwains-dashboard-next-bottom-nav') as DwainsBottomNav | null;
  if (!el) {
    el = document.createElement('dwains-dashboard-next-bottom-nav') as DwainsBottomNav;
    document.body.appendChild(el);
  }
  // Onthoud het dashboard-segment waarop wij draaien (voor de zichtbaarheid).
  const seg = window.location.pathname.split('/')[1];
  el.dashSegment = seg && seg !== 'lovelace' ? seg : 'lovelace';
  _syncHaShellForBottomNav(el.dashSegment);
  el.dashboardSettings = settings;
  el.hass = hass;
  _injectSidebarSection(hass, settings, el.dashSegment);
}

/**
 * Verberg HA's eigen kopbalk op mobiel. HA bouwt die toolbar op verschillende
 * plekken afhankelijk van frontend-versie en dashboardtype, dus we injecteren
 * dezelfde style in meerdere shell shadow-roots in plaats van alleen hui-root.
 */
function _hideNativeHeaderOnMobile(attempt = 0): void {
  const roots = _nativeHeaderStyleRoots();
  const stillActive = document.documentElement.classList.contains(MOBILE_NAV_ACTIVE_CLASS) ||
    Boolean(document.body?.classList.contains(MOBILE_NAV_ACTIVE_CLASS));
  if (!stillActive) {
    _setNativeHeaderElementsHidden(false);
    return;
  }

  const css = `
    @media (max-width: 768px) {
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) app-header,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) app-toolbar,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) ha-menu-button,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) ha-icon-button,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) ha-tabs,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) ha-tab-group,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) [role="tablist"],
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .header,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .toolbar,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .main-toolbar,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .header-toolbar,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .view-header,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .toolbar-items,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .action-items,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) #toolbar,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) #tabs {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
      }
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) ha-app-layout,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) #view,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) .view,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) hui-view,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) hui-sections-view,
      :host-context(.${MOBILE_NAV_ACTIVE_CLASS}) hui-masonry-view {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
    }
  `;
  roots.forEach((root) => {
    const host = root instanceof Document ? root.head || root.documentElement : root;
    let style = root.querySelector(`#${HIDE_NATIVE_HEADER_STYLE_ID}`) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = HIDE_NATIVE_HEADER_STYLE_ID;
      host.appendChild(style);
    }
    style.textContent = css;
  });
  _setNativeHeaderElementsHidden(true);
  if (attempt < 14) {
    setTimeout(() => _hideNativeHeaderOnMobile(attempt + 1), attempt < 4 ? 80 : 250);
  }
}

function _nativeHeaderStyleRoots(): (Document | ShadowRoot)[] {
  const roots = new Set<Document | ShadowRoot>([document]);
  [
    'home-assistant',
    'home-assistant-main',
    'partial-panel-resolver',
    'ha-panel-lovelace',
    'hui-root',
    'ha-app-layout',
  ].forEach((tag) => {
    _deepFindAll(tag).forEach((el) => {
      if (el.shadowRoot) roots.add(el.shadowRoot);
    });
  });
  return Array.from(roots);
}

function _nativeHeaderElementSelectors(): string {
  return [
    'app-header',
    'app-toolbar',
    'ha-menu-button',
    'ha-tabs',
    'ha-tab-group',
    '[role="tablist"]',
    '.header',
    '.toolbar',
    '.main-toolbar',
    '.header-toolbar',
    '.view-header',
    '.toolbar-items',
    '.action-items',
    '#toolbar',
    '#tabs',
  ].join(',');
}

function _setNativeHeaderElementsHidden(active: boolean): void {
  const selector = _nativeHeaderElementSelectors();
  const roots = _nativeHeaderStyleRoots();
  roots.forEach((root) => {
    root.querySelectorAll(selector).forEach((el) => {
      const element = el as HTMLElement;
      if (active) {
        if (!element.hasAttribute(HIDDEN_NATIVE_HEADER_ATTR)) {
          element.setAttribute(HIDDEN_NATIVE_HEADER_OLD_STYLE_ATTR, element.getAttribute('style') || '');
          element.setAttribute(HIDDEN_NATIVE_HEADER_ATTR, 'true');
        }
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('min-height', '0', 'important');
        element.style.setProperty('max-height', '0', 'important');
        element.style.setProperty('padding', '0', 'important');
        element.style.setProperty('margin', '0', 'important');
        element.style.setProperty('border', '0', 'important');
        element.style.setProperty('overflow', 'hidden', 'important');
        return;
      }

      if (!element.hasAttribute(HIDDEN_NATIVE_HEADER_ATTR)) return;
      const previousStyle = element.getAttribute(HIDDEN_NATIVE_HEADER_OLD_STYLE_ATTR) || '';
      if (previousStyle) {
        element.setAttribute('style', previousStyle);
      } else {
        element.removeAttribute('style');
      }
      element.removeAttribute(HIDDEN_NATIVE_HEADER_ATTR);
      element.removeAttribute(HIDDEN_NATIVE_HEADER_OLD_STYLE_ATTR);
    });
  });
}

/**
 * HA's mobiele zijmenu is een Web Awesome <wa-drawer placement="start"> (links).
 * Binnen DD met de mobiele bottom-nav zetten we hem tijdelijk rechts. Buiten die
 * context herstellen we expliciet naar links, omdat HA het attribuut zelf niet
 * altijd terugzet bij dashboardwissels.
 */
function _setDrawerPlacement(placement: 'start' | 'end'): void {
  _deepFindAll('wa-drawer').forEach((wa) => {
    if (wa.getAttribute('placement') !== placement) {
      wa.setAttribute('placement', placement);
    }
  });
}

// ---- DD-sectie bovenin het HA-zijmenu -------------------------------------

let _sidebarObserver: MutationObserver | undefined;
let _sidebarSettings: DwainsDashboardSettings | undefined;
let _sidebarHass: any;
let _sidebarDashSegment: string | undefined;
let _sidebarMediaListenerAttached = false;

/** Navigeer (soft) naar een view-pad binnen het huidige dashboard. */
function _navigate(path: string): void {
  const seg = window.location.pathname.split('/')[1] || 'lovelace';
  window.history.pushState(null, '', `/${seg}/${path}`);
  const ev = new Event('location-changed', { bubbles: true, composed: true });
  (ev as any).detail = { replace: false };
  window.dispatchEvent(ev);
}

function _navigateProfile(): void {
  navigateHomeAssistant('/profile/general');
}

/** Sluit (toggle) het HA-zijmenu. */
function _closeSidebar(): void {
  const ev = new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true });
  (_deepFind('home-assistant-main') || document.querySelector('home-assistant'))?.dispatchEvent(ev);
}

function _currentDashboardSegment(): string {
  const segment = window.location.pathname.split('/')[1];
  return segment && segment !== 'lovelace' ? segment : 'lovelace';
}

function _isOnDashboard(dashSegment?: string): boolean {
  return Boolean(dashSegment && _currentDashboardSegment() === dashSegment);
}

function _isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_NAV_QUERY).matches;
}

function _isMobileNavActive(dashSegment?: string): boolean {
  return _isOnDashboard(dashSegment) && _isMobileViewport();
}

function _syncHaShellForBottomNav(dashSegment?: string): void {
  const active = _isMobileNavActive(dashSegment);
  document.documentElement.classList.toggle(MOBILE_NAV_ACTIVE_CLASS, active);
  document.body?.classList.toggle(MOBILE_NAV_ACTIVE_CLASS, active);
  if (active) {
    _hideNativeHeaderOnMobile();
  } else {
    _setNativeHeaderElementsHidden(false);
  }
  _setDrawerPlacement(active ? 'end' : 'start');
  if (!active) {
    _removeSidebarSection();
  }
}

function _removeSidebarSection(): void {
  const sidebar = _deepFind('ha-sidebar');
  sidebar?.shadowRoot?.querySelector('#dd-sidebar-section')?.remove();
}

/** (Her)bouw de DD-sectie en zet hem bovenaan de sidebar-shadow (alleen mobiel). */
function _buildSidebarSection(
  sidebar: Element,
  hass: any,
  settings?: DwainsDashboardSettings,
  dashSegment?: string
): void {
  const sr = sidebar.shadowRoot;
  if (!sr) return;
  const existing = sr.querySelector('#dd-sidebar-section');
  // Alleen wanneer de DD mobiele/tablet bottom-nav actief is. Op andere dashboards
  // en op desktop moet HA's sidebar volledig standaard blijven.
  if (!_isMobileNavActive(dashSegment)) {
    existing?.remove();
    return;
  }
  existing?.remove();

  const t = (k: string) => ddLocalize(hass, k);
  const haMenuRestricted = restrictNonAdminHaSidebar(hass, settings);
  const dashboardEditingRestricted = restrictNonAdminDashboardSettings(hass, settings);
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

  if (haMenuRestricted) {
    wrap.appendChild(
      mkItem('mdi:account-cog', 'Profile settings', () => {
        _closeSidebar();
        _navigateProfile();
      })
    );
    sr.insertBefore(wrap, sr.firstChild);
    return;
  }

  if (!dashboardEditingRestricted) {
    wrap.appendChild(
      mkItem('mdi:puzzle-plus-outline', t('sidebar.add_blueprint'), () => {
        _closeSidebar();
        _navigate('add-blueprint');
      })
    );
    wrap.appendChild(
      mkItem('mdi:cog', t('sidebar.dashboard_settings'), () => {
        _closeSidebar();
        openDashboardSettings(hass, settings);
      })
    );
  } else {
    wrap.appendChild(
      mkItem('mdi:account-cog', 'Profile settings', () => {
        _closeSidebar();
        _navigateProfile();
      })
    );
  }

  sr.insertBefore(wrap, sr.firstChild);
}

function _applyHaSidebarRestriction(
  hass: any,
  settings?: DwainsDashboardSettings,
  dashSegment?: string
): void {
  const currentSegment = window.location.pathname.split('/')[1] || 'lovelace';
  const onDashboard = !dashSegment || currentSegment === dashSegment;
  const active = onDashboard && restrictNonAdminHaSidebar(hass, settings);
  const drawerVars = `
    --app-drawer-width: 0px !important;
    --mdc-drawer-width: 0px !important;
    --drawer-width: 0px !important;
    --ha-sidebar-width: 0px !important;
    --sidebar-width: 0px !important;
  `;
  const documentCss = `
    html.dd-ha-sidebar-restricted,
    body.dd-ha-sidebar-restricted,
    body.dd-ha-sidebar-restricted home-assistant,
    body.dd-ha-sidebar-restricted home-assistant-main {
      ${drawerVars}
    }

    body.dd-ha-sidebar-restricted ha-sidebar,
    body.dd-ha-sidebar-restricted app-drawer,
    body.dd-ha-sidebar-restricted #drawer,
    body.dd-ha-sidebar-restricted .drawer {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      flex: 0 0 0 !important;
    }

    body.dd-ha-sidebar-restricted app-drawer-layout,
    body.dd-ha-sidebar-restricted home-assistant-main {
      margin-left: 0 !important;
      padding-left: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      max-width: none !important;
    }
  `;
  const shadowCss = `
    :host {
      ${drawerVars}
    }

    ha-sidebar,
    app-drawer,
    #drawer,
    .drawer {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      flex: 0 0 0 !important;
    }

    app-drawer-layout,
    #layout,
    #main,
    main,
    .content,
    .main,
    .panel,
    [main],
    [slot="main"],
    partial-panel-resolver,
    ha-panel-lovelace {
      ${drawerVars}
      margin-left: 0 !important;
      padding-left: 0 !important;
      left: 0 !important;
      width: 100% !important;
      max-width: none !important;
    }
  `;

  document.documentElement.classList.toggle('dd-ha-sidebar-restricted', active);
  document.body?.classList.toggle('dd-ha-sidebar-restricted', active);

  const apply = (root: Document | ShadowRoot, cssText: string) => {
    let style = root.querySelector('#dd-restrict-ha-sidebar') as HTMLStyleElement | null;
    const styleHost = root instanceof Document ? root.head || root.documentElement : root;
    if (!active) {
      style?.remove();
      return;
    }
    if (!style) {
      style = document.createElement('style');
      style.id = 'dd-restrict-ha-sidebar';
      styleHost.appendChild(style);
    }
    style.textContent = cssText;
  };

  apply(document, documentCss);
  const homeAssistant = document.querySelector('home-assistant') as HTMLElement | null;
  const main = _deepFind('home-assistant-main');
  const drawerLayout = _deepFind('app-drawer-layout');
  const roots = new Set<ShadowRoot>();
  [homeAssistant?.shadowRoot, main?.shadowRoot, drawerLayout?.shadowRoot].forEach((root) => {
    if (root) roots.add(root);
  });
  roots.forEach((root) => apply(root, shadowCss));
}

/**
 * Injecteer de DD-sectie bovenin het HA-zijmenu (ha-sidebar). Een
 * MutationObserver herstelt de sectie als HA bij een re-render z'n shadow
 * opnieuw opbouwt. Best-effort: lukt het niet, dan blijft de sidebar standaard.
 */
function _injectSidebarSection(
  hass: any,
  settings?: DwainsDashboardSettings,
  dashSegment?: string,
  attempt = 0
): void {
  _sidebarHass = hass;
  _sidebarSettings = settings;
  _sidebarDashSegment = dashSegment;
  if (!_isMobileNavActive(dashSegment)) {
    _removeSidebarSection();
    return;
  }

  const sidebar = _deepFind('ha-sidebar');
  if (!sidebar || !sidebar.shadowRoot) {
    if (attempt < 25) setTimeout(() => _injectSidebarSection(hass, settings, dashSegment, attempt + 1), 300);
    return;
  }
  _buildSidebarSection(sidebar, hass, settings, dashSegment);
  if (!_sidebarObserver) {
    _sidebarObserver = new MutationObserver(() => {
      const sb = _deepFind('ha-sidebar');
      if (sb?.shadowRoot && !sb.shadowRoot.querySelector('#dd-sidebar-section')) {
        _buildSidebarSection(sb, _sidebarHass, _sidebarSettings, _sidebarDashSegment);
      }
    });
    _sidebarObserver.observe(sidebar.shadowRoot, { childList: true });
  }

  if (!_sidebarMediaListenerAttached) {
    _sidebarMediaListenerAttached = true;
    // Bij wisselen mobiel/desktop opnieuw evalueren (toevoegen of verwijderen).
    window.matchMedia(MOBILE_NAV_QUERY).addEventListener('change', () => {
      _syncHaShellForBottomNav(_sidebarDashSegment);
      const sb = _deepFind('ha-sidebar');
      if (sb) _buildSidebarSection(sb, _sidebarHass, _sidebarSettings, _sidebarDashSegment);
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

/** Zoek alle elementen met de gegeven tag, dwars door shadow-roots heen. */
function _deepFindAll(tag: string): Element[] {
  const found: Element[] = [];
  const seen = new Set<Element>();
  const queue: (Document | ShadowRoot)[] = [document];
  while (queue.length) {
    const root = queue.shift()!;
    root.querySelectorAll(tag).forEach((el) => found.push(el));
    root.querySelectorAll('*').forEach((el) => {
      const sr = (el as Element).shadowRoot;
      if (sr && !seen.has(el)) {
        seen.add(el);
        queue.push(sr);
      }
    });
  }
  return found;
}
