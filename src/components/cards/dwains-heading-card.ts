import { LitElement, css, html } from 'lit';

interface DwainsHeadingCardConfig {
  title: string;
}

/**
 * Compatibility card for headings used by Dwains Dashboard 3 blueprints.
 */
export class DwainsHeadingCard extends LitElement {
  private _config?: DwainsHeadingCardConfig;

  setConfig(config: DwainsHeadingCardConfig): void {
    if (!config?.title) {
      throw new Error('dwains-heading-card: "title" is required');
    }

    this._config = { ...config };
    this.requestUpdate();
  }

  getCardSize(): number {
    return 1;
  }

  protected render() {
    return html`<ha-card>${this._config?.title ?? ''}</ha-card>`;
  }

  static override styles = css`
    :host {
      display: block;
    }

    ha-card {
      box-shadow: none;
      background: none;
      padding: 0 16px 0 0;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 700;
    }
  `;
}
