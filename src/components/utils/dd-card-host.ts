// Generieke host voor een willekeurige Lovelace-kaart-config. Beheert een
// hui-card-element imperatief in de eigen light-DOM, zodat er nooit een rauw
// DOM-element in een Lit-template/repeat van de ouder belandt (voorkomt de
// 'nextSibling of null'-crash). Zelfde idee als dwains-dashboard-next-tile-host.
export class DwainsCardHost extends HTMLElement {
  private _hass: any | undefined;
  private _config: any | undefined;
  private _child: any | null = null;
  private _observer?: IntersectionObserver;
  private _hasRendered = false;

  set hass(value: any) {
    this._hass = value;
    if (this._child) this._child.hass = value;
  }
  get hass() {
    return this._hass;
  }

  set config(value: any) {
    this._config = value;
    this._renderWhenVisible();
  }
  get config() {
    return this._config;
  }

  connectedCallback() {
    this.style.display = 'block';
    this.style.setProperty('content-visibility', 'auto');
    this.style.setProperty('contain-intrinsic-size', '120px');
    this._renderWhenVisible();
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = undefined;
    this._hasRendered = false;
    this._child = null;
    this.innerHTML = '';
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

  private _render() {
    if (!this.isConnected || !this._config) return;
    if (!this._child || !this.contains(this._child)) {
      this._child = document.createElement('hui-card');
      this.innerHTML = '';
      this.appendChild(this._child);
    }
    try {
      // hass VÓÓR config zodat charts thema-context hebben bij render
      if (this._hass) this._child.hass = this._hass;
      this._child.config = this._config;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('dwains-dashboard-next-card-host: kaart configureren mislukt', e);
    }
  }
}

if (!customElements.get('dwains-dashboard-next-card-host')) {
  customElements.define('dwains-dashboard-next-card-host', DwainsCardHost);
}
