// Generieke host voor een willekeurige Lovelace-kaart-config. Beheert een
// hui-card-element imperatief in de eigen light-DOM, zodat er nooit een rauw
// DOM-element in een Lit-template/repeat van de ouder belandt (voorkomt de
// 'nextSibling of null'-crash). Zelfde idee als dd-tile-host.
export class DwainsCardHost extends HTMLElement {
  private _hass: any | undefined;
  private _config: any | undefined;
  private _child: any | null = null;

  set hass(value: any) {
    this._hass = value;
    if (this._child) this._child.hass = value;
  }
  get hass() {
    return this._hass;
  }

  set config(value: any) {
    this._config = value;
    this._render();
  }
  get config() {
    return this._config;
  }

  connectedCallback() {
    this.style.display = 'block';
    this._render();
  }

  disconnectedCallback() {
    this._child = null;
    this.innerHTML = '';
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
      console.warn('dd-card-host: kaart configureren mislukt', e);
    }
  }
}

if (!customElements.get('dd-card-host')) {
  customElements.define('dd-card-host', DwainsCardHost);
}
