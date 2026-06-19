import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import './dwains-dashboard-strategy-editor';

export class DwainsDashboardCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config: any = {};
  @state() private _strategyEditor?: any;

  setConfig(config: any): void {
    this._config = config;

    // Pass config to strategy editor if it exists
    if (this._strategyEditor) {
      this._strategyEditor.setConfig(this._convertToStrategyConfig(config));
    }
  }

  /**
   * Convert card config to strategy config format
   */
  private _convertToStrategyConfig(cardConfig: any): any {
    // Remove the type field for strategy config
    const { type, ...strategyConfig } = cardConfig;
    return {
      type: "custom:dwains",
      ...strategyConfig
    };
  }

  /**
   * Convert strategy config back to card config format
   */
  private _convertToCardConfig(strategyConfig: any): any {
    const { type, ...cardConfig } = strategyConfig;
    return {
      type: "custom:dwains-dashboard-card",
      ...cardConfig
    };
  }

  protected async firstUpdated(): Promise<void> {
    // Create the strategy editor
    const editor = document.createElement('dwains-dashboard-strategy-editor') as any;
    this._strategyEditor = editor;

    // Set hass and config
    if (this.hass) {
      editor.hass = this.hass;
    }
    if (this._config) {
      editor.setConfig(this._convertToStrategyConfig(this._config));
    }

    // Listen for config changes from the strategy editor
    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      ev.stopPropagation();
      const strategyConfig = ev.detail.config;
      const cardConfig = this._convertToCardConfig(strategyConfig);
      this._fireConfigChanged(cardConfig);
    });

    // Force update to render the editor
    this.requestUpdate();
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    // Update hass on strategy editor when it changes
    if (changedProperties.has('hass') && this._strategyEditor && this.hass) {
      this._strategyEditor.hass = this.hass;
    }

    // Update config on strategy editor when it changes
    if (changedProperties.has('_config') && this._strategyEditor && this._config) {
      this._strategyEditor.setConfig(this._convertToStrategyConfig(this._config));
    }
  }

  private _fireConfigChanged(config: any): void {
    const event = new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    // Show loading state until strategy editor is loaded
    if (!this._strategyEditor) {
      return html`
        <div style="padding: 16px; text-align: center;">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <p style="margin-top: 16px;">Loading editor...</p>
        </div>
      `;
    }

    // Return the strategy editor element
    return html`${this._strategyEditor}`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
  }
}

// Register the editor
customElements.define("dwains-dashboard-card-editor", DwainsDashboardCardEditor);