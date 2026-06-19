export class DwainsTileHost extends HTMLElement {
  private _hass: any | undefined;
  private _entityId: string | undefined;
  private _name: string | undefined;
  private _child: any | null = null;

  static get observedAttributes() {
    return ['entity', 'name'];
  }

  set hass(value: any) {
    this._hass = value;
    if (this._child) {
      this._child.hass = value;
    }
  }

  get hass() {
    return this._hass;
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === 'entity') this._entityId = value ?? undefined;
    if (name === 'name') this._name = value ?? undefined;
    this._ensureChild();
  }

  connectedCallback() {
    this.style.display = 'block';
    this._ensureChild();
  }

  disconnectedCallback() {
    this._child = null;
    this.innerHTML = '';
  }

  private async _ensureChild() {
    if (!this.isConnected || !this._entityId) return;

    // Avoid redundant work if already correct
    if (this._child && this.contains(this._child) && this._child.getAttribute('data-entity') === this._entityId) {
      if (this._hass) this._child.hass = this._hass;
      return;
    }

    if (!customElements.get('hui-tile-card')) {
      try {
        await customElements.whenDefined('hui-tile-card');
      } catch {
        return;
      }
    }

    if (!this._child || !this.contains(this._child)) {
      this._child = document.createElement('hui-tile-card');
      this._child.classList.add('favorite-tile');
      this._child.setAttribute('data-entity', this._entityId);
      // Replace any stray children to ensure stable structure
      this.innerHTML = '';
      this.appendChild(this._child);
    }

    try {
      if ('setConfig' in this._child) {
        const cfg: any = { entity: this._entityId };
        if (this._name) cfg.name = this._name;
        this._child.setConfig(cfg);
      }
      if (this._hass && this.contains(this._child)) {
        this._child.hass = this._hass;
      }
    } catch (e) {
      // Swallow errors to avoid breaking parent render
      // eslint-disable-next-line no-console
      console.warn('dd-tile-host: failed to configure tile', e);
    }
  }
}

customElements.define('dd-tile-host', DwainsTileHost);
