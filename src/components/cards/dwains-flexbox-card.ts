import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * dwains-flexbox-card — 1-op-1 port van de DD3 flexbox grid card.
 *
 * Een container-kaart die child-kaarten in een flexbox-grid (flexboxgrid.com)
 * plaatst. Gebruikt door (oude) Dwains Dashboard blueprints. Volledig
 * client-side: child-kaarten worden via HA's loadCardHelpers() gemaakt zodat
 * ook custom: kaarten werken.
 *
 * Config:
 *   type: custom:dwains-flexbox-card
 *   items_classes: 'col-xs-12 col-sm-6'   # standaard klasse voor alle items
 *   padding: true|false
 *   css: 'extra inline css op de wrapper'
 *   cards: [ ... child card configs ... ]  # (entities werkt ook als alias)
 *   # per child mag item_classes meegegeven worden om items_classes te overrulen
 */
@customElement('dwains-dashboard-next-flexbox-card')
export class DwainsFlexboxCard extends LitElement {
  @state() private _config?: any;
  private _hass?: any;
  private _refCards?: HTMLElement[];

  set hass(hass: any) {
    this._hass = hass;
    if (!this._refCards && this._config) {
      this._renderChildCards();
    }
    if (this._refCards) {
      this._refCards.forEach((card: any) => {
        card.hass = hass;
      });
    }
  }

  get hass() {
    return this._hass;
  }

  setConfig(config: any) {
    if (!config || (!Array.isArray(config.cards) && !Array.isArray(config.entities))) {
      throw new Error('dwains-flexbox-card: "cards" (of "entities") moet een lijst zijn');
    }
    this._config = config;
    this._refCards = undefined;
    if (this._hass) {
      this._renderChildCards();
    }
  }

  private async _createCardElement(cardConfig: any): Promise<HTMLElement> {
    const helpers = await (window as any).loadCardHelpers?.();

    let element: any;
    if (helpers) {
      element = helpers.createCardElement(cardConfig);
    } else {
      // Fallback zonder helpers
      let tag = cardConfig.type as string;
      if (tag.startsWith('divider')) tag = 'hui-divider-row';
      else if (tag.startsWith('custom:')) tag = tag.substr('custom:'.length);
      else tag = `hui-${tag}-card`;
      element = document.createElement(tag);
      try {
        element.setConfig(cardConfig);
      } catch (err: any) {
        element = this._createErrorCard(err?.message, cardConfig, helpers);
      }
    }

    // Item-klassen toekennen (per-card override of de globale items_classes)
    const cls = cardConfig.item_classes || this._config?.items_classes;
    element.className = cls ? `item ${cls}` : 'item';

    element.hass = this._hass;

    element.addEventListener(
      'll-rebuild',
      (ev: Event) => {
        ev.stopPropagation();
        this._renderChildCards();
      },
      { once: true }
    );

    return element;
  }

  private _createErrorCard(error: string, config: any, helpers: any): HTMLElement {
    if (helpers?.createCardElement) {
      return helpers.createCardElement({ type: 'error', error, origConfig: config });
    }
    const el = document.createElement('hui-error-card') as any;
    try {
      el.setConfig({ type: 'error', error, origConfig: config });
    } catch {
      /* ignore */
    }
    return el;
  }

  private _renderChildCards() {
    const cards: any[] = this._config?.cards || this._config?.entities || [];
    const promises = cards.map((c) => this._createCardElement(c));
    Promise.all(promises).then((els) => {
      this._refCards = els;
      this.requestUpdate();
    });
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    return changed.has('_config') || !!this._refCards;
  }

  render() {
    if (!this._config || !this._hass || !this._refCards) {
      return html``;
    }
    const padding = this._config.padding ? 'padding' : '';
    return html`
      <div style=${this._config.css || ''}>
        <div class="wrapper ${padding}">
          <div class="row">${this._refCards}</div>
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }
    .row {
      box-sizing: border-box;
      display: flex;
      flex: 0 1 auto;
      flex-direction: row;
      flex-wrap: wrap;
      margin-right: -0.25rem;
      margin-left: -0.25rem;
      overflow: hidden;
      width: auto;
    }
    .row.reverse {
      flex-direction: row-reverse;
    }
    .col-xs, [class*='col-xs-'],
    .col-sm, [class*='col-sm-'],
    .col-md, [class*='col-md-'],
    .col-lg, [class*='col-lg-'] {
      box-sizing: border-box;
      flex: 0 0 auto;
      padding-right: 0.25rem;
      padding-left: 0.25rem;
    }
    .col-xs { flex-grow: 1; flex-basis: 0; max-width: 100%; }
    .col-xs-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
    .col-xs-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
    .col-xs-3 { flex-basis: 25%; max-width: 25%; }
    .col-xs-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
    .col-xs-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
    .col-xs-6 { flex-basis: 50%; max-width: 50%; }
    .col-xs-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
    .col-xs-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
    .col-xs-9 { flex-basis: 75%; max-width: 75%; }
    .col-xs-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
    .col-xs-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
    .col-xs-12 { flex-basis: 100%; max-width: 100%; }
    .start-xs { justify-content: flex-start; text-align: start; }
    .center-xs { justify-content: center; text-align: center; }
    .end-xs { justify-content: flex-end; text-align: end; }
    .top-xs { align-items: flex-start; }
    .middle-xs { align-items: center; }
    .bottom-xs { align-items: flex-end; }
    .around-xs { justify-content: space-around; }
    .between-xs { justify-content: space-between; }
    .first-xs { order: -1; }
    .last-xs { order: 1; }

    @media only screen and (min-width: 48em) {
      .col-sm { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-sm-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-sm-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-sm-3 { flex-basis: 25%; max-width: 25%; }
      .col-sm-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-sm-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-sm-6 { flex-basis: 50%; max-width: 50%; }
      .col-sm-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-sm-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-sm-9 { flex-basis: 75%; max-width: 75%; }
      .col-sm-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-sm-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-sm-12 { flex-basis: 100%; max-width: 100%; }
    }
    @media only screen and (min-width: 64em) {
      .col-md { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-md-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-md-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-md-3 { flex-basis: 25%; max-width: 25%; }
      .col-md-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-md-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-md-6 { flex-basis: 50%; max-width: 50%; }
      .col-md-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-md-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-md-9 { flex-basis: 75%; max-width: 75%; }
      .col-md-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-md-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-md-12 { flex-basis: 100%; max-width: 100%; }
    }
    @media only screen and (min-width: 75em) {
      .col-lg { flex-grow: 1; flex-basis: 0; max-width: 100%; }
      .col-lg-1 { flex-basis: 8.33333333%; max-width: 8.33333333%; }
      .col-lg-2 { flex-basis: 16.66666667%; max-width: 16.66666667%; }
      .col-lg-3 { flex-basis: 25%; max-width: 25%; }
      .col-lg-4 { flex-basis: 33.33333333%; max-width: 33.33333333%; }
      .col-lg-5 { flex-basis: 41.66666667%; max-width: 41.66666667%; }
      .col-lg-6 { flex-basis: 50%; max-width: 50%; }
      .col-lg-7 { flex-basis: 58.33333333%; max-width: 58.33333333%; }
      .col-lg-8 { flex-basis: 66.66666667%; max-width: 66.66666667%; }
      .col-lg-9 { flex-basis: 75%; max-width: 75%; }
      .col-lg-10 { flex-basis: 83.33333333%; max-width: 83.33333333%; }
      .col-lg-11 { flex-basis: 91.66666667%; max-width: 91.66666667%; }
      .col-lg-12 { flex-basis: 100%; max-width: 100%; }
    }

    .item {
      margin-bottom: 0.5rem;
    }
    .wrapper {
      overflow: hidden;
      padding: 0;
    }
    .wrapper.padding {
      padding: 11px;
    }
    .d-none { display: none !important; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-flexbox-card': DwainsFlexboxCard;
  }
}
