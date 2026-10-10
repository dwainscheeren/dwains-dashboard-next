// Generieke host voor een willekeurige Lovelace-kaart-config. Maakt de echte
// kaart via Home Assistants card helpers en beheert die in de eigen light-DOM,
// zodat er nooit een rauw DOM-element in een Lit-template van de ouder belandt.
export class DwainsCardHost extends HTMLElement {
  private _hass: any | undefined;
  private _config: any | undefined;
  private _configKey = '';
  private _renderedConfigKey = '';
  private _child: any | null = null;
  private _observer?: IntersectionObserver;
  private _hasRendered = false;
  private _renderRequest = 0;
  private _frameObserver?: MutationObserver;
  private _frameStyle?: HTMLStyleElement;
  private _frameRequest = 0;
  private _layoutObserver?: ResizeObserver;
  private _layoutWidth = 0;

  static get observedAttributes() {
    return ['framed', 'strip-card-surface', 'refresh-layout'];
  }

  attributeChangedCallback() {
    this._applyFrame();
    if (this._child) {
      void this._frameChild(this._child);
      this._refreshChildLayout(this._child);
    }
  }

  set hass(value: any) {
    this._hass = value;
    if (this._child) this._child.hass = value;
  }
  get hass() {
    return this._hass;
  }

  set config(value: any) {
    this._config = value;
    this._configKey = this._getConfigKey(value);
    this._renderWhenVisible();
  }
  get config() {
    return this._config;
  }

  connectedCallback() {
    this.style.display = 'block';
    this.style.boxSizing = 'border-box';
    this.style.width = '100%';
    this.style.maxWidth = '100%';
    this.style.minWidth = '0';
    this._applyFrame();
    this.style.setProperty('content-visibility', this.hasAttribute('eager') ? 'visible' : 'auto');
    this.style.setProperty('contain-intrinsic-size', '120px');
    this._renderWhenVisible();
  }

  disconnectedCallback() {
    this._renderRequest += 1;
    this._clearFrameChild();
    this._layoutObserver?.disconnect();
    this._layoutObserver = undefined;
    this._layoutWidth = 0;
    this._observer?.disconnect();
    this._observer = undefined;
    this._hasRendered = false;
    this._renderedConfigKey = '';
    this._child = null;
    this.replaceChildren();
  }

  // Replacement blueprints provide the content; DD Next owns their outer tile.
  private _applyFrame() {
    const styles: Record<string, string> = {
      'box-sizing': 'border-box',
      'min-height': 'var(--dd-replacement-min-height, 60px)',
      padding: 'var(--dd-replacement-padding, 14px)',
      border: 'var(--dd-replacement-border, 1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent))',
      'border-radius': 'var(--dd-replacement-radius, 10px)',
      background: 'var(--card-background-color)',
      'box-shadow': '0 3px 9px rgba(15, 23, 42, 0.035)',
      '--ha-card-background': 'transparent',
      '--ha-card-border-width': '0px',
      '--ha-card-border-radius': '0px',
      '--ha-card-box-shadow': 'none',
    };
    for (const [property, value] of Object.entries(styles)) {
      if (this.hasAttribute('framed')) this.style.setProperty(property, value);
      else this.style.removeProperty(property);
    }
  }

  private _clearFrameChild() {
    this._frameRequest += 1;
    this._frameObserver?.disconnect();
    this._frameObserver = undefined;
    this._frameStyle?.remove();
    this._frameStyle = undefined;
  }

  private async _frameChild(child: any) {
    this._clearFrameChild();
    const request = this._frameRequest;
    if (!this.hasAttribute('framed') && !this.hasAttribute('strip-card-surface')) return;
    // Lit cards create their shadow content asynchronously after mounting.
    await child.updateComplete;
    if (
      request !== this._frameRequest ||
      this._child !== child ||
      !this.isConnected ||
      (!this.hasAttribute('framed') && !this.hasAttribute('strip-card-surface'))
    ) return;
    const root = child.shadowRoot as ShadowRoot | null;
    if (!root) return;
    const normalize = () => {
      const surface = root.querySelector('ha-card');
      if (!surface) return;
      surface.setAttribute('data-dd-replacement-surface', '');
      if (!this._frameStyle) {
        this._frameStyle = document.createElement('style');
        this._frameStyle.textContent = `
          ha-card[data-dd-replacement-surface] {
            background: transparent !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        `;
      }
      if (!root.contains(this._frameStyle)) root.appendChild(this._frameStyle);
    };
    this._frameObserver = new MutationObserver(normalize);
    this._frameObserver.observe(root, { childList: true, subtree: true });
    normalize();
  }

  private _refreshChildLayout(child: any) {
    if (!this.hasAttribute('refresh-layout') || !child) return;

    const refresh = () => {
      if (!this.isConnected || this._child !== child) return;

      try {
        if (this._hass) child.hass = this._hass;
        child.requestUpdate?.();

        const roots: any[] = [child, child.shadowRoot].filter(Boolean);
        for (const root of roots) {
          const map = root?.querySelector?.('ha-map') as any;
          const mapCandidates = [
            map,
            map?.map,
            map?._map,
            (child as any).map,
            (child as any)._map,
          ].filter(Boolean);

          for (const candidate of mapCandidates) {
            candidate.invalidateSize?.();
          }

          map?.fitMap?.();
          map?._fitMap?.();
        }

        (child as any).fitMap?.();
        (child as any)._fitMap?.();
        window.dispatchEvent(new Event('resize'));
      } catch {
        // Layout refresh is best-effort for native HA cards.
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(refresh));
    window.setTimeout(refresh, 160);
    window.setTimeout(refresh, 500);

    // Native HA maps can initialize before the popup finishes sizing.
    // Refit only when the host actually changes width (not on map tile updates).
    if (!this._layoutObserver && typeof ResizeObserver !== 'undefined') {
      this._layoutObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (width <= 0 || Math.abs(width - this._layoutWidth) < 1) return;
        this._layoutWidth = width;
        requestAnimationFrame(refresh);
      });
      this._layoutObserver.observe(this);
    }
  }

  private _renderWhenVisible() {
    if (!this.isConnected || !this._config) return;

    if (this._child || this._hasRendered || this.hasAttribute('eager') || !('IntersectionObserver' in window)) {
      this._hasRendered = true;
      this._observer?.disconnect();
      this._observer = undefined;
      this._render();
      return;
    }

    if (this._observer) return;

    this._observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this._observer?.disconnect();
        this._observer = undefined;
        this._hasRendered = true;
        this._render();
      },
      { rootMargin: '700px 0px' }
    );
    this._observer.observe(this);
  }

  private _getConfigKey(config: any): string {
    try {
      return JSON.stringify(config) ?? '';
    } catch {
      return String(config?.type ?? '') + ':' + String(config?.entity ?? '');
    }
  }

  private async _render() {
    if (!this.isConnected || !this._config) return;

    if (
      this._child &&
      this.contains(this._child) &&
      this._renderedConfigKey === this._configKey
    ) {
      if (this._hass) this._child.hass = this._hass;
      return;
    }

    const request = ++this._renderRequest;
    const config = this._config;
    const configKey = this._configKey;

    try {
      const loadCardHelpers = (window as any).loadCardHelpers;
      if (typeof loadCardHelpers !== 'function') {
        throw new Error('Home Assistant card helpers are not available');
      }

      const helpers = await loadCardHelpers();
      if (
        request !== this._renderRequest ||
        !this.isConnected ||
        configKey !== this._configKey
      ) {
        return;
      }

      const child = helpers.createCardElement(config);
      if (!child) throw new Error('Home Assistant did not create a card element');

      // Keep native Lovelace cards constrained to the host width on narrow screens.
      // Some HA cards carry their own intrinsic/minimum width, so constraining only
      // the outer host is not enough.
      child.style.display = 'block';
      child.style.boxSizing = 'border-box';
      child.style.width = '100%';
      child.style.maxWidth = '100%';
      child.style.minWidth = '0';

      // Home Assistant configures the real card before returning it. We only
      // provide hass and mount it, avoiding hui-card's asynchronous setConfig race.
      if (this._hass) child.hass = this._hass;
      this._child = child;
      this._renderedConfigKey = configKey;
      this.replaceChildren(child);
      void this._frameChild(child);
      this._refreshChildLayout(child);
    } catch (e) {
      if (request !== this._renderRequest || !this.isConnected) return;
      // eslint-disable-next-line no-console
      console.warn('dwains-dashboard-next-card-host: failed to create card', e);
      this._child = null;
      this._renderedConfigKey = '';
      const error = document.createElement('div');
      error.className = 'dd-card-host-error';
      error.style.cssText =
        'padding:12px;color:var(--error-color);background:var(--card-background-color);border-radius:8px;';
      error.textContent = 'Card could not be loaded';
      this.replaceChildren(error);
    }
  }
}

if (!customElements.get('dwains-dashboard-next-card-host')) {
  customElements.define('dwains-dashboard-next-card-host', DwainsCardHost);
}
