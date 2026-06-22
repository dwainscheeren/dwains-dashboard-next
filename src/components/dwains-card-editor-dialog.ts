import { mdiClose, mdiArrowLeft } from "@mdi/js";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types/home-assistant";
import type { LovelaceCardConfig } from "../types/strategy";
import { fireEvent } from "./utils/fire-event";
import { ddLocalize } from "../utils/localize";

export interface CardEditorDialogParams {
  /** Bestaande kaart om te bewerken (leeg = nieuwe kaart) */
  card?: LovelaceCardConfig;
  /** Naam van de ruimte (voor de titel) */
  areaName?: string;
  /** Callback met de uiteindelijke kaart-config */
  onSave: (card: LovelaceCardConfig) => void;
}

interface CardType {
  /** Stabiele identifier voor i18n-sleutels (label/description) */
  id: string;
  labelKey: string;
  descKey: string;
  icon: string;
  config: LovelaceCardConfig;
  manual?: boolean; // opent direct de YAML-editor (vrije kaart)
}

// Kaarttypes voor de kiezer (grid)
const CARD_TYPES: CardType[] = [
  { id: "tile", labelKey: "card_type.tile.label", descKey: "card_type.tile.desc", icon: "mdi:view-grid", config: { type: "tile", entity: "" } },
  { id: "entities", labelKey: "card_type.entities.label", descKey: "card_type.entities.desc", icon: "mdi:format-list-bulleted", config: { type: "entities", entities: [] } },
  { id: "button", labelKey: "card_type.button.label", descKey: "card_type.button.desc", icon: "mdi:gesture-tap-button", config: { type: "button", entity: "" } },
  { id: "gauge", labelKey: "card_type.gauge.label", descKey: "card_type.gauge.desc", icon: "mdi:gauge", config: { type: "gauge", entity: "" } },
  { id: "history-graph", labelKey: "card_type.history.label", descKey: "card_type.history.desc", icon: "mdi:chart-line", config: { type: "history-graph", entities: [] } },
  { id: "sensor", labelKey: "card_type.sensor.label", descKey: "card_type.sensor.desc", icon: "mdi:eye", config: { type: "sensor", entity: "", graph: "line" } },
  { id: "thermostat", labelKey: "card_type.thermostat.label", descKey: "card_type.thermostat.desc", icon: "mdi:thermostat", config: { type: "thermostat", entity: "" } },
  { id: "weather-forecast", labelKey: "card_type.weather.label", descKey: "card_type.weather.desc", icon: "mdi:weather-partly-cloudy", config: { type: "weather-forecast", entity: "" } },
  { id: "markdown", labelKey: "card_type.markdown.label", descKey: "card_type.markdown.desc", icon: "mdi:language-markdown", config: { type: "markdown", content: "## Title\nText here" } },
  { id: "picture-entity", labelKey: "card_type.picture.label", descKey: "card_type.picture.desc", icon: "mdi:image", config: { type: "picture-entity", entity: "" } },
  { id: "glance", labelKey: "card_type.glance.label", descKey: "card_type.glance.desc", icon: "mdi:view-dashboard", config: { type: "glance", entities: [] } },
  { id: "media-control", labelKey: "card_type.media.label", descKey: "card_type.media.desc", icon: "mdi:play-circle", config: { type: "media-control", entity: "" } },
  { id: "manual", labelKey: "card_type.manual.label", descKey: "card_type.manual.desc", icon: "mdi:code-braces", config: { type: "" } as any, manual: true },
];

// Grafiek-/chart-kaarten geven onvangbare fouten bij een (incomplete) preview
// vanuit HA's chart-component — daarom renderen we daar geen preview voor.
const NO_PREVIEW_TYPES = new Set(["history-graph", "sensor", "statistics-graph"]);

@customElement("dwains-card-editor-dialog")
export class DwainsCardEditorDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  @state() private _params?: CardEditorDialogParams;
  @state() private _card?: LovelaceCardConfig;
  @state() private _valid = true;
  @state() private _search = "";
  @state() private _picked = false;
  @state() private _useYaml = false;
  @state() private _editorReady = false;

  private _configEl?: any; // HA's eigen visuele editor-element
  private _loadingEditor = false;
  private _previewEl?: HTMLElement;

  public showDialog(params: CardEditorDialogParams): void {
    this._params = params;
    this._card = params.card ? { ...params.card } : undefined;
    this._picked = !!params.card;
    this._valid = !!this._card;
    this._search = "";
    this._useYaml = false;
    this._editorReady = false;
    this._configEl = undefined;
    this._previewEl = undefined;
  }

  public closeDialog(): void {
    this._params = undefined;
    this._card = undefined;
    this._configEl = undefined;
    this._previewEl = undefined;
    this._picked = false;
    this._editorReady = false;
    fireEvent(this, "dialog-closed", { dialog: "dwains-card-editor-dialog" });
  }

  private _pick(type: CardType): void {
    this._card = { ...type.config };
    this._picked = true;
    this._useYaml = !!type.manual;
    this._editorReady = !!type.manual; // handmatig → geen native editor laden
    this._valid = !type.manual && !!type.config.type;
    this._configEl = undefined;
    this._previewEl = undefined;
  }

  private _back = (): void => {
    if (this._params?.card) {
      this.closeDialog();
      return;
    }
    this._picked = false;
    this._card = undefined;
    this._configEl = undefined;
    this._editorReady = false;
    this._previewEl = undefined;
  };

  // Laad HA's eigen visuele editor voor het huidige kaarttype (getConfigElement).
  private async _loadNativeEditor(): Promise<void> {
    if (this._loadingEditor || !this._card) return;
    this._loadingEditor = true;
    try {
      const type = String(this._card.type || "");
      const tag = "hui-" + type.replace(/^custom:/, "") + "-card";

      // 1) Trigger de lazy-load van de card-class met een GELDIGE config
      //    (auto-ingevulde entiteiten) zodat setConfig niet gooit. Het element
      //    wordt niet in de DOM gehangen, dus rendert ook niets.
      try {
        const helpers = await (window as any).loadCardHelpers?.();
        const t = CARD_TYPES.find((x) => x.config.type === type);
        // Domein-passende config (climate voor thermostat, etc.) → geen setConfig-fout
        const loadCfg: any = (t && this._previewConfigFor(t)) || { type };
        helpers?.createCardElement(loadCfg);
      } catch {
        /* negeer */
      }

      // 2) Wacht tot de echte card-class geregistreerd is.
      await Promise.race([
        customElements.whenDefined(tag),
        new Promise((r) => setTimeout(r, 4000)),
      ]);

      const ctor: any = customElements.get(tag);
      if (ctor && typeof ctor.getConfigElement === "function") {
        const editor = await ctor.getConfigElement();
        if (editor) {
          editor.hass = this.hass;
          editor.addEventListener("config-changed", (ev: any) => {
            ev.stopPropagation();
            if (ev.detail?.config) {
              this._card = ev.detail.config;
              this._valid = true;
              this._updatePreview();
            }
          });
          // De EDITOR accepteert (anders dan de kaart) wél een incomplete config.
          try {
            editor.setConfig(this._card);
          } catch {
            /* editor toont zelf validatie */
          }
          this._configEl = editor;
          this._editorReady = true;
          this.requestUpdate();
          return;
        }
      }

      // Geen native editor beschikbaar → YAML
      this._useYaml = true;
      this._editorReady = true;
    } catch (e) {
        console.warn("Native editor failed, falling back to YAML:", e);
      this._useYaml = true;
      this._editorReady = true;
    } finally {
      this._loadingEditor = false;
    }
  }

  private _onYamlChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail?.value;
    const isValid = ev.detail?.isValid !== false;
    this._valid = isValid && value && typeof value === "object" && !!value.type;
    if (this._valid) {
      this._card = value;
      this._updatePreview();
    }
  }

  private _updatePreview(): void {
    const container = this.renderRoot?.querySelector(".preview") as HTMLElement | null;
    if (!container || !this._card) return;
    container.replaceChildren();
    // Nog geen (geldig) type → geen preview
    if (!this._card.type) {
      this._previewEl = undefined;
      return;
    }
    if (NO_PREVIEW_TYPES.has(String(this._card.type))) {
      container.textContent = this._t("card_editor.no_preview");
      this._previewEl = container; // markeer als 'gevuld' zodat updated() niet blijft herhalen
      return;
    }
    try {
      const el = document.createElement("hui-card") as any;
      el.hass = this.hass;
      el.config = this._card;
      this._previewEl = el;
      container.appendChild(el);
    } catch (e) {
      container.textContent = "Preview error: " + e;
    }
  }

  private _toggleYaml = (): void => {
    this._useYaml = !this._useYaml;
    // bij terug naar visueel: editor opnieuw initialiseren
    if (!this._useYaml) {
      this._editorReady = false;
      this._configEl = undefined;
    }
  };

  private _save = (): void => {
    if (!this._card || !this._valid || !this._params) return;
    this._params.onSave(this._card);
    this.closeDialog();
  };

  protected updated(): void {
    if (!this._params) return;

    // Kiezer-scherm: live previews per kaarttype mounten
    if (!this._picked) {
      this._mountPreviews();
      return;
    }
    if (!this._card) return;

    // Native editor laden zodra we in de editor-stap zitten (en geen YAML)
    if (!this._useYaml && !this._editorReady && !this._loadingEditor) {
      this._loadNativeEditor();
    }

    // Native editor-element imperatief in de host hangen
    if (!this._useYaml && this._configEl) {
      const host = this.renderRoot?.querySelector(".native-editor-host") as HTMLElement | null;
      if (host && this._configEl.parentElement !== host) {
        host.replaceChildren(this._configEl);
      }
      if (this._configEl) this._configEl.hass = this.hass;
    }

    // Preview
    if (!this._previewEl) this._updatePreview();
  }

  protected render() {
    if (!this._params) return nothing;
    const subtitle = this._params.areaName ? ` — ${this._params.areaName}` : "";
    const title = this._picked
      ? this._params.card
        ? this._t("card_editor.title_edit")
        : this._t("card_editor.title_setup")
      : this._t("card_editor.title_add");

    return html`
      <ha-dialog open @closed=${this.closeDialog} .heading=${title} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${this._picked && !this._params.card ? mdiArrowLeft : mdiClose}
            .label=${this.hass.localize("ui.common.close")}
            @click=${this._picked && !this._params.card ? this._back : this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${title}</span>
        </ha-dialog-header>

        <div class="content">
          <div class="dialog-title">${title}${subtitle}</div>
          ${this._picked ? this._renderEditor() : this._renderPicker()}
        </div>
      </ha-dialog>
    `;
  }

  private _firstEntity(...domains: string[]): string | undefined {
    const states = this.hass?.states || {};
    for (const d of domains) {
      const e = Object.keys(states).find((id) => id.startsWith(d + "."));
      if (e) return e;
    }
    return undefined;
  }

  private _numericSensor(): string | undefined {
    const states = this.hass?.states || {};
    return Object.keys(states).find(
      (id) => id.startsWith("sensor.") && !isNaN(parseFloat(states[id]?.state ?? ""))
    );
  }

  // Bouw een preview-config met passende, geldige entiteiten. null = geen
  // zinvolle preview mogelijk → toon alleen het icoon (geen foutkaart).
  private _previewConfigFor(t: CardType): any | null {
    if ((t as any).manual) return null;
    const type = t.config.type;
    const c: any = { ...t.config };

    if (type === "gauge") {
      const e = this._numericSensor();
      if (!e) return null;
      c.entity = e;
      return c;
    }
    if (type === "button") {
      // Knop: een schakelbare entiteit (anders 'entiteit niet gevonden')
      const e = this._firstEntity("light", "switch", "input_boolean", "fan");
      if (!e) return null;
      c.entity = e;
      return c;
    }
    if (type === "tile") {
      const e = this._firstEntity("light", "switch", "sensor", "binary_sensor");
      if (!e) return null;
      c.entity = e;
      return c;
    }
    if (type === "thermostat") {
      const e = this._firstEntity("climate");
      if (!e) return null;
      c.entity = e;
      return c;
    }
    if (type === "weather-forecast") {
      const e = this._firstEntity("weather");
      if (!e) return null;
      c.entity = e;
      return c;
    }
    if (type === "media-control") {
      const e = this._firstEntity("media_player");
      if (!e) return null;
      c.entity = e;
      return c;
    }
    // Afbeelding heeft een image-bron nodig → geen zinvolle auto-preview
    if (type === "picture-entity") return null;

    if ("entities" in c) {
      const states = this.hass?.states || {};
      const es = Object.keys(states)
        .filter((id) => id.startsWith("light.") || id.startsWith("sensor.") || id.startsWith("switch."))
        .slice(0, 3);
      if (es.length === 0) return null;
      c.entities = es;
      return c;
    }

    return c; // markdown e.d.
  }

  private _renderPicker() {
    const q = this._search.trim().toLowerCase();
    const types = q
      ? CARD_TYPES.filter(
          (t) =>
            this._t(t.labelKey).toLowerCase().includes(q) ||
            t.config.type.includes(q)
        )
      : CARD_TYPES;

    return html`
      <ha-textfield
        class="search"
        .label=${this._t("card_editor.search")}
        .value=${this._search}
        @input=${(e: any) => (this._search = e.target.value)}
      ></ha-textfield>

      <div class="grid">
        ${types.map(
          (t) => html`
            <button class="type-card" @click=${() => this._pick(t)}>
              <div class="type-head">
                <ha-icon icon=${t.icon}></ha-icon>
                <div class="type-name">${this._t(t.labelKey)}</div>
              </div>
              <div class="dd-preview-host" data-card-type=${t.config.type}></div>
            </button>
          `
        )}
      </div>
    `;
  }

  private _mountPreviews(): void {
    const hosts = this.renderRoot?.querySelectorAll(".dd-preview-host");
    if (!hosts) return;
    hosts.forEach((hostEl) => {
      const host = hostEl as HTMLElement;
      const type = host.getAttribute("data-card-type") || "";
      // Al gevuld met het juiste type? overslaan.
      if (host.childElementCount > 0 && host.dataset.mountedType === type) return;
      const t = CARD_TYPES.find((x) => x.config.type === type);
      host.replaceChildren();
      host.dataset.mountedType = type;
      if (!t || NO_PREVIEW_TYPES.has(type)) return;
      const cfg = this._previewConfigFor(t);
      if (!cfg) return;
      try {
        const el = document.createElement("hui-card") as any;
        el.hass = this.hass;
        el.config = cfg;
        el.setAttribute("preview", "");
        host.appendChild(el);
      } catch {
        /* preview niet mogelijk → laat leeg */
      }
    });
  }

  private _renderEditor() {
    return html`
      <div class="editor-toolbar">
        <ha-button appearance="plain" size="s" @click=${this._toggleYaml}>
          ${this._useYaml ? this._t("card_editor.visual_editor") : this._t("card_editor.code_editor")}
        </ha-button>
      </div>

      ${this._useYaml
        ? html`
            <ha-yaml-editor
              .hass=${this.hass}
              .defaultValue=${this._card}
              @value-changed=${this._onYamlChanged}
            ></ha-yaml-editor>
          `
        : this._editorReady
        ? html`<div class="native-editor-host"></div>`
        : html`<div class="loading">${this._t("card_editor.loading")}</div>`}

      <div class="editor-label">${this._t("card_editor.preview")}</div>
      <div class="preview"></div>

      <div class="actions">
        <ha-button appearance="plain" @click=${this._back}>${this._t("common.back")}</ha-button>
        <ha-button
          appearance="accent"
          ?disabled=${!this._valid}
          @click=${this._save}
        >${this._t("common.save")}</ha-button>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --mdc-dialog-min-width: 90vw;
        --mdc-dialog-max-width: 720px;
      }
      ha-dialog {
        --dialog-content-padding: 0;
      }
      .content {
        padding: 0 24px 20px;
      }
      .dialog-title {
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--primary-text-color);
        padding: 4px 0 16px;
      }
      .search {
        width: 100%;
        margin-bottom: 16px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
      }
      .type-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        text-align: left;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
      }
      .type-card:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }
      .type-head {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }
      .type-card ha-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-color);
      }
      .type-name {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--primary-text-color);
      }
      .dd-preview-host {
        width: 100%;
        pointer-events: none;
        overflow: hidden;
        max-height: 160px;
      }
      .dd-preview-host:empty {
        display: none;
      }
      .editor-toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
      .native-editor-host {
        display: block;
      }
      .loading {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
      }
      .editor-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--secondary-text-color);
        margin: 16px 0 6px;
      }
      .preview {
        border: 1px dashed var(--divider-color);
        border-radius: 12px;
        padding: 12px;
        min-height: 60px;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }
      /* Tekstknop in primaire kleur (zoals HA's "Annuleren") */
      .actions .cancel {
        --mdc-theme-primary: var(--primary-color);
      }
      /* Gevulde pill-knop (zoals HA's "Opslaan") */
      .actions .save {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-primary-color, #fff);
        --mdc-shape-small: 20px;
        --mdc-button-horizontal-padding: 24px;
        --mdc-button-height: 40px;
      }
    `;
  }
}
