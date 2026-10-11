import { mdiClose, mdiArrowLeft } from "@mdi/js";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { HomeAssistant } from "../types/home-assistant";
import type { BlueprintPage } from "../types/strategy";
import { fireEvent } from "./utils/fire-event";
import { ddLocalize } from "../utils/localize";
import {
  parseBlueprintYaml,
  resolveBlueprintCard,
  collectCustomCardTypes,
  defaultValues,
  type ParsedBlueprint,
} from "../utils/blueprints";

export interface BlueprintDialogParams {
  /** Bestaande pagina om te bewerken (leeg = nieuwe blueprint importeren) */
  page?: BlueprintPage;
  /** Callback met de resulterende pagina */
  onSave: (page: BlueprintPage) => void;
}

/** Eén item uit de blueprints.json-galerij. */
interface GalleryItem {
  name: string;
  description?: string;
  type?: string;
  author?: string;
  version?: string;
  url: string;
  image?: string;
  custom_cards?: string[];
}

interface CheckUpdateOptions {
  silentIfCurrent?: boolean;
}

// Standaard-galerij (blueprints.json) op GitHub. Zet hier je eigen repo-URL.
const GALLERY_URL =
  "https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json";

@customElement("dwains-dashboard-next-blueprint-dialog")
export class DwainsBlueprintDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  private get _german(): boolean { return (this.hass?.locale?.language || this.hass?.language || 'en').toLowerCase().split('-')[0] === 'de'; }
  private _label(def: any, key: string): string { return (this._german ? def.name_de : undefined) || def.name || key; }
  private _desc(def: any): string { return (this._german ? def.description_de : undefined) || def.description || ''; }

  private _t = (key: string, vars?: Record<string, string | number>) =>
    ddLocalize(this.hass, key, vars);

  @state() private _params?: BlueprintDialogParams;
  @state() private _mode: "paste" | "url" | "gallery" = "paste";
  @state() private _gallery?: GalleryItem[];
  @state() private _galleryLoading = false;
  @state() private _galleryError = "";
  @state() private _gallerySearch = "";
  @state() private _yamlText = "";
  @state() private _url = "";
  @state() private _loadingUrl = false;
  @state() private _error = "";

  @state() private _parsed?: ParsedBlueprint;
  @state() private _values: Record<string, any> = {};
  @state() private _pageName = "";
  @state() private _pageIcon = "mdi:puzzle";

  // Bron-URL + bewerk-extra's
  @state() private _source = "";
  @state() private _editYaml = false;
  @state() private _checking = false;
  @state() private _updateMsg = "";
  @state() private _update?: ParsedBlueprint;

  public showDialog(params: BlueprintDialogParams): void {
    this._params = params;
    this._error = "";
    this._loadingUrl = false;
    this._editYaml = false;
    this._checking = false;
    this._updateMsg = "";
    this._update = undefined;
    if (params.page) {
      // Bewerken: parse de opgeslagen blueprint en vul de waarden in.
      this._source = params.page.source || "";
      try {
        const parsed = parseBlueprintYaml(params.page.blueprint);
        this._parsed = parsed;
        this._values = { ...defaultValues(parsed.meta), ...(params.page.inputs || {}), __language: this._german ? "de" : "en" };
        this._pageName = params.page.name;
        this._pageIcon = params.page.icon || "mdi:puzzle";
        this._yamlText = params.page.blueprint;
        this._queueUpdateCheck();
      } catch (e: any) {
        this._error = String(e?.message || e);
        this._parsed = undefined;
      }
    } else {
      this._mode = "gallery";
      this._yamlText = "";
      this._url = "";
      this._source = "";
      this._parsed = undefined;
      this._values = {};
      this._pageName = "";
      this._pageIcon = "mdi:puzzle";
      this._loadGallery();
    }
  }

  public closeDialog(): void {
    this._params = undefined;
    this._parsed = undefined;
    this._yamlText = "";
    this._url = "";
    this._error = "";
    this._values = {};
    fireEvent(this, "dialog-closed", { dialog: "dwains-dashboard-next-blueprint-dialog" });
  }

  // ---- Stap 1: bron inlezen -------------------------------------------------

  private _parseFromText(): void {
    this._error = "";
    try {
      const parsed = parseBlueprintYaml(this._yamlText);
      this._applyParsed(parsed);
    } catch (e: any) {
      this._error = String(e?.message || e);
    }
  }

  private _suggestInputValues(parsed: ParsedBlueprint): Record<string, any> {
    const suggestions: Record<string, any> = {};
    const states = this.hass?.states || {};
    for (const [key, def] of Object.entries(parsed.meta.input || {})) {
      if (def.type === 'entity-list') {
        if (def.suggest === 'coin') { suggestions[key] = this._coinSuggestions().filter(row => row.entity && row.price_entity && row.amount_entity); continue; }
        const matches = this._entitySuggestions(def);
        const preferred = def.suggest === 'coin'
          ? matches.filter(id => /^(?:sensor\\.)wallet_value_(?!total)/i.test(id))
          : matches;
        suggestions[key] = preferred.slice(0, 30).map(id => {
          const suffix = id.replace(/^sensor\.wallet_value_/, '');
          const price = 'sensor.cryptoinfo_' + suffix + '_eur';
          const amount = 'sensor.wallet_volume_' + suffix;
          return {
            entity: id,
            name: states[id]?.attributes?.friendly_name || (id.split('.')[1] || id).replace(/_/g, ' '),
            icon: '',
            ...(def.suggest === 'coin' ? {
              price_entity: states[price] ? price : '',
              amount_entity: states[amount] ? amount : '',
            } : {}),
          };
        });
        continue;
      }
      if (def.type !== 'entity-picker') continue;
      if (key === 'adguard_protection' || key === 'adguard_filtering') {
        const feature = key === 'adguard_protection' ? /protect|schutz|protection/i : /filter/i;
        const switchIds = Object.keys(states).filter(id =>
          id.startsWith('switch.') && feature.test(id + ' ' + (states[id]?.attributes?.friendly_name || '')) &&
          /ad.?guard/i.test(id + ' ' + (states[id]?.attributes?.friendly_name || ''))
        );
        const conventional = 'switch.adguard_' + (key === 'adguard_protection' ? 'protection' : 'filtering');
        if (states[conventional]) suggestions[key] = conventional;
        else if (switchIds.length === 1) suggestions[key] = switchIds[0];
        continue;
      }
      const candidate = def.suggest_entity;
      if (candidate && states[candidate]) { suggestions[key] = candidate; continue; }
      const domain = key.startsWith('switch_') ? 'switch' : key.startsWith('update_') ? 'update' : key.startsWith('binary_sensor_') ? 'binary_sensor' : 'sensor';
      const suffix = key.replace(/^(sensor|switch|update|binary_sensor)_/, '');
      const exact = domain + '.' + suffix;
      if (states[exact]) { suggestions[key] = exact; continue; }
      const matches = Object.keys(states).filter(id => id.startsWith(domain + '.') && ((id.split('.')[1] || '') === suffix || (id.split('.')[1] || '').endsWith('_' + suffix)));
      if (matches.length === 1) suggestions[key] = matches[0];
    }
    return suggestions;
  }

  private _applyParsed(parsed: ParsedBlueprint): void {
    this._parsed = parsed;
    this._values = { ...defaultValues(parsed.meta), ...this._suggestInputValues(parsed), __language: this._german ? "de" : "en" };
    this._pageName = (this._german && parsed.meta.name_de) || parsed.meta.name || this._t("blueprint.new_page");
    this._pageIcon = parsed.meta.icon || "mdi:puzzle";
  }

  // Behoud ingevulde waarden voor velden die in de nieuwe blueprint nog bestaan.
  private _mergeValues(newParsed: ParsedBlueprint): Record<string, any> {
    const merged: Record<string, any> = { ...defaultValues(newParsed.meta), __language: this._german ? "de" : "en" };
    const keys = Object.keys(newParsed.meta.input || {});
    for (const key of keys) {
      if (this._values[key] !== undefined && this._values[key] !== "") {
        merged[key] = this._values[key];
      }
    }
    return merged;
  }

  private _toggleYamlEdit(): void {
    this._error = "";
    this._editYaml = !this._editYaml;
  }

  // Pas de (handmatig bewerkte) YAML toe en herbouw het formulier.
  private _applyYamlEdit(): void {
    this._error = "";
    try {
      const parsed = parseBlueprintYaml(this._yamlText);
      this._values = this._mergeValues(parsed);
      this._parsed = parsed;
      this._editYaml = false;
      this._queueUpdateCheck();
    } catch (e: any) {
      this._error = String(e?.message || e);
    }
  }

  private _queueUpdateCheck(): void {
    if (!this._parsed) return;
    void this._checkUpdate({ silentIfCurrent: true });
  }

  // Haal de blueprint opnieuw op van de bron-URL en vergelijk de versie.
  private async _checkUpdate(options: CheckUpdateOptions = {}): Promise<void> {
    this._error = "";
    this._updateMsg = "";
    this._update = undefined;
    this._checking = true;
    try {
      const source = this._source || (await this._resolveSourceFromGallery());
      if (!source) {
        if (!options.silentIfCurrent) {
          this._updateMsg = this._t("blueprint.source_missing");
        }
        return;
      }
      const raw = this._toRawUrl(source);
      const resp = await fetch(raw, { redirect: "follow" });
      if (!resp.ok) throw new Error(this._t("blueprint.fetch_failed", { status: resp.status }));
      const text = await resp.text();
      if (source !== this._source) return;
      const parsed = parseBlueprintYaml(text);
      const newV = parsed.meta.version || "";
      const curV = this._parsed?.meta.version || "";
      if (newV && (!curV || this._compareVersions(newV, curV) > 0)) {
        this._update = parsed;
        this._updateMsg = this._t("blueprint.update_available", {
          new: newV,
          current: curV || "?",
        });
      } else if (!options.silentIfCurrent) {
        this._updateMsg = this._t("blueprint.up_to_date", { version: curV || newV || "?" });
      }
    } catch (e: any) {
      this._error = this._t("blueprint.load_failed", { error: String(e?.message || e) });
    } finally {
      this._checking = false;
    }
  }

  private async _resolveSourceFromGallery(): Promise<string> {
    if (!this._parsed) return "";
    await this._loadGallery();
    const match = this._matchGalleryItem();
    if (!match) return "";
    this._source = match.url;
    return match.url;
  }

  private _matchGalleryItem(): GalleryItem | undefined {
    if (!this._parsed || !this._gallery) return undefined;
    const blueprintName = this._normalizeBlueprintName(this._parsed.meta.name);
    const blueprintType = (this._parsed.meta.type || "page").toLowerCase();
    const sameName = this._gallery.filter(
      (item) => this._normalizeBlueprintName(item.name) === blueprintName
    );
    return (
      sameName.find((item) => (item.type || "page").toLowerCase() === blueprintType) ||
      sameName[0]
    );
  }

  private _normalizeBlueprintName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  private _compareVersions(a: string, b: string): number {
    const left = this._versionParts(a);
    const right = this._versionParts(b);
    const length = Math.max(left.length, right.length);
    for (let i = 0; i < length; i++) {
      const av = left[i] ?? 0;
      const bv = right[i] ?? 0;
      if (typeof av === "number" && typeof bv === "number") {
        if (av !== bv) return av > bv ? 1 : -1;
        continue;
      }
      const as = String(av);
      const bs = String(bv);
      if (as !== bs) return as > bs ? 1 : -1;
    }
    return 0;
  }

  private _versionParts(version: string): Array<number | string> {
    return version
      .trim()
      .split(/[^0-9A-Za-z]+/)
      .filter(Boolean)
      .map((part) => (/^\d+$/.test(part) ? Number(part) : part.toLowerCase()));
  }

  // Pas de opgehaalde nieuwere versie toe (met behoud van ingevulde waarden).
  private _applyUpdate(): void {
    if (!this._update) return;
    this._values = this._mergeValues(this._update);
    this._parsed = this._update;
    this._yamlText = this._update.raw;
    this._update = undefined;
    this._updateMsg = "";
  }

  /** Zet een github.com tree/blob-URL om naar de ruwe page.yaml. */
  private _toRawUrl(input: string): string {
    let u = input.trim();
    if (u.includes("github.com")) {
      if (u.includes("/blob/")) {
        u = u
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
      } else if (u.includes("/tree/")) {
        u = u
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/tree/", "/");
        if (!/\.ya?ml$/i.test(u)) {
          u = u.replace(/\/$/, "") + "/page.yaml";
        }
      }
    }
    return u;
  }

  private async _loadFromUrl(): Promise<void> {
    this._error = "";
    const raw = this._toRawUrl(this._url);
    if (!raw) {
      this._error = this._t("blueprint.invalid_url");
      return;
    }
    this._loadingUrl = true;
    try {
      const resp = await fetch(raw, { redirect: "follow" });
      if (!resp.ok) {
        throw new Error(this._t("blueprint.fetch_failed", { status: resp.status }));
      }
      const text = await resp.text();
      this._yamlText = text;
      this._source = this._url;
      const parsed = parseBlueprintYaml(text);
      this._applyParsed(parsed);
    } catch (e: any) {
      this._error = this._t("blueprint.load_failed", {
        error: String(e?.message || e),
      });
    } finally {
      this._loadingUrl = false;
    }
  }

  // ---- Galerij (blueprints.json) -------------------------------------------

  private async _loadGallery(): Promise<void> {
    if (this._gallery || this._galleryLoading) return;
    this._galleryLoading = true;
    this._galleryError = "";
    try {
      const resp = await fetch(GALLERY_URL, { redirect: "follow" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const list: any[] = Array.isArray(data) ? data : data?.blueprints || [];
      this._gallery = list
        .filter(
          (b) =>
            b &&
            b.url &&
            b.name &&
            String(b.type || "page").toLowerCase() === "page"
        )
        .map((b) => ({
          name: String(b.name),
          description: b.description ? String(b.description) : undefined,
          type: b.type ? String(b.type) : undefined,
          author: b.author ? String(b.author) : undefined,
          version: b.version != null ? String(b.version) : undefined,
          url: String(b.url),
          image: b.image ? String(b.image) : undefined,
          custom_cards: Array.isArray(b.custom_cards) ? b.custom_cards.map(String) : undefined,
        }));
    } catch (e: any) {
      this._galleryError = this._t("blueprint.gallery_failed", {
        error: String(e?.message || e),
      });
    } finally {
      this._galleryLoading = false;
    }
  }

  private _filteredGallery(): GalleryItem[] {
    const query = this._gallerySearch.trim().toLowerCase();
    if (!query) return this._gallery || [];

    return (this._gallery || []).filter((item) => {
      const haystack = [
        item.name,
        item.description,
        item.author,
        item.type,
        ...(item.custom_cards || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  private _pickGalleryItem(item: GalleryItem): void {
    this._url = item.url;
    this._loadFromUrl();
  }

  private _showGallery = (): void => {
    this._mode = "gallery";
    this._loadGallery();
  };

  private _renderGallery() {
    const items = this._filteredGallery();
    const searchLabel = this.hass?.localize?.("ui.common.search") || "Search";

    return html`
      <div class="gallery-search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          aria-label=${searchLabel}
          placeholder=${searchLabel}
          .value=${this._gallerySearch}
          @input=${(event: Event) => {
            this._gallerySearch = (event.target as HTMLInputElement).value;
          }}
        />
      </div>
      <p class="hint">${this._t("blueprint.gallery_hint")}</p>
      ${this._galleryError ? html`<div class="error">${this._galleryError}</div>` : nothing}
      ${this._galleryLoading
        ? html`<div class="hint">${this._t("blueprint.loading")}</div>`
        : nothing}
      ${this._gallery && items.length === 0 && !this._galleryError && !this._galleryLoading
        ? html`<div class="hint">${this._t("blueprint.gallery_empty")}</div>`
        : nothing}
      <div class="gallery">
        ${items.map(
          (item) => html`
            <button class="gallery-item" @click=${() => this._pickGalleryItem(item)}>
              ${item.image
                ? html`<img class="gallery-img" src=${item.image} alt="" loading="lazy" />`
                : html`<div class="gallery-img placeholder">
                    <ha-icon icon="mdi:puzzle"></ha-icon>
                  </div>`}
              <div class="gallery-info">
                <div class="gallery-name">${item.name}</div>
                ${item.description
                  ? html`<div class="gallery-desc">${item.description}</div>`
                  : nothing}
                <div class="gallery-tags">
                  ${item.version ? html`<span class="chip">v${item.version}</span>` : nothing}
                  ${item.type ? html`<span class="chip">${item.type}</span>` : nothing}
                  ${item.author ? html`<span class="chip">${item.author}</span>` : nothing}
                </div>
              </div>
            </button>
          `
        )}
      </div>
    `;
  }

  // ---- Stap 2: formulier + opslaan -----------------------------------------

  private _setValue(key: string, value: any): void {
    this._values = { ...this._values, [key]: value };
  }

  private _missingCustomCards(): string[] {
    if (!this._parsed) return [];
    const needed = new Set<string>([
      ...(this._parsed.meta.custom_cards || []),
      ...collectCustomCardTypes(this._parsed.card),
    ]);
    // dwains-flexbox-card leveren we zelf mee.
    needed.delete("dwains-flexbox-card");
    const missing: string[] = [];
    needed.forEach((name) => {
      const tag = name.startsWith("custom:") ? name.slice(7) : name;
      if (!customElements.get(tag)) missing.push(tag);
    });
    return missing;
  }

  private _slug(s: string): string {
    return (
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "pagina"
    );
  }

  private _save(): void {
    if (!this._parsed || !this._params) return;
    for (const [key, def] of Object.entries(this._parsed.meta.input || {})) {
      const value = this._values[key];
      if (def.type === 'entity-picker' && def.default === undefined && !value) {
        this._error = this._t('blueprint.select_entity_first', { name: this._label(def, key) });
        return;
      }
      if (def.type !== 'entity-list') continue;
      const entries = Array.isArray(value) ? value : [];
      if (!entries.length || entries.some((item: any) => !item.entity)) {
        this._error = this._t('blueprint.complete_entry_required');
        return;
      }
      if (def.suggest === 'coin' && new Set(entries.map((item: any) => item.entity)).size !== entries.length) {
        this._error = this._t('blueprint.duplicate_value_sensor');
        return;
      }
      if (def.suggest === 'coin' && entries.some((item: any) => !item.price_entity || !item.amount_entity)) {
        this._error = this._t('blueprint.coin_sensors_required');
        return;
      }
    }
    // Put the nearest upcoming collection first, independently of selection order.
    const cardValues = { ...this._values };
    if (Array.isArray(cardValues.waste_types)) {
      const nextDate = (entityId: string): number => {
        const state = this.hass?.states?.[entityId];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const candidates = [state?.state, ...Object.keys(state?.attributes || {}), ...Object.values(state?.attributes || {})];
        const valid = candidates.flatMap(raw => {
          if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return [];
          const dt = new Date(raw + 'T12:00:00');
          return Number.isFinite(dt.getTime()) && dt.getTime() >= today.getTime() ? [dt.getTime()] : [];
        });
        return valid.length ? Math.min(...valid) : Number.POSITIVE_INFINITY;
      };
      cardValues.waste_types = [...cardValues.waste_types].sort((a: any, b: any) =>
        nextDate(a.entity) - nextDate(b.entity));
    }
    if (Array.isArray(cardValues.coins)) {
      const coinValue = (item: any) => {
        const amount = Number(this.hass?.states?.[item.entity]?.state);
        return Number.isFinite(amount) ? amount : -Infinity;
      };
      cardValues.coins = [...cardValues.coins].sort((a: any, b: any) => coinValue(b) - coinValue(a));
    }
    let card: any;
    try {
      card = resolveBlueprintCard(this._parsed.card, this._parsed.meta, cardValues);
    } catch (e: any) {
      this._error = this._t("blueprint.fill_failed", {
        error: String(e?.message || e),
      });
      return;
    }
    const id =
      this._params.page?.id || `${this._slug(this._pageName)}-${Date.now().toString(36)}`;
    const page: BlueprintPage = {
      id,
      name: this._pageName.trim() || this._parsed.meta.name || this._t("blueprint.page_fallback"),
      icon: this._pageIcon || "mdi:puzzle",
      blueprint: this._parsed.raw,
      source: this._source || undefined,
      inputs: { ...this._values },
      card,
    };
    this._params.onSave(page);
    this.closeDialog();
  }

  // ---- Render ---------------------------------------------------------------

  protected render() {
    if (!this._params) return nothing;
    const editing = !!this._params.page;
    const title = this._parsed
      ? editing
        ? this._t("blueprint.title_edit")
        : this._t("blueprint.title_setup")
      : this._t("blueprint.title_add");
    const showBack = !!this._parsed && !editing;

    return html`
      <ha-dialog open @closed=${this.closeDialog} .heading=${title} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${showBack ? mdiArrowLeft : mdiClose}
            .label=${this._t("common.close")}
            @click=${showBack ? this._backToSource : this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${title}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          ${this._parsed ? this._renderForm() : this._renderSource()}
        </div>
      </ha-dialog>
    `;
  }

  private _backToSource = (): void => {
    this._parsed = undefined;
    this._error = "";
  };

  private _renderSource() {
    return html`
      <div class="tabs">
        <button
          class="tab ${this._mode === "gallery" ? "active" : ""}"
          @click=${this._showGallery}
        >
          <ha-icon icon="mdi:view-grid-outline"></ha-icon> ${this._t("blueprint.tab_gallery")}
        </button>
        <button
          class="tab ${this._mode === "url" ? "active" : ""}"
          @click=${() => (this._mode = "url")}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon> ${this._t("blueprint.tab_url")}
        </button>
        <button
          class="tab ${this._mode === "paste" ? "active" : ""}"
          @click=${() => (this._mode = "paste")}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon> ${this._t("blueprint.tab_paste")}
        </button>
      </div>

      ${this._mode === "gallery"
        ? this._renderGallery()
        : this._mode === "paste"
        ? html`
            <p class="hint">${this._t("blueprint.paste_hint")}</p>
            <textarea
              class="dd-yaml"
              spellcheck="false"
              placeholder="blueprint:&#10;  name: ...&#10;  type: page&#10;  input:&#10;    ...&#10;card:&#10;  type: ..."
              .value=${this._yamlText}
              @input=${(e: any) => (this._yamlText = e.target.value)}
            ></textarea>
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._yamlText.trim()}
                @click=${this._parseFromText}
                >${this._t("common.next")}</ha-button
              >
            </div>
          `
        : html`
            <p class="hint">${unsafeHTML(this._t("blueprint.url_hint_html"))}</p>
            <input
              class="dd-input"
              type="url"
              placeholder="https://github.com/.../page-blueprints/Birthdays"
              .value=${this._url}
              @input=${(e: any) => (this._url = e.target.value)}
            />
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._url.trim() || this._loadingUrl}
                @click=${this._loadFromUrl}
              >
                ${this._loadingUrl ? this._t("blueprint.loading") : this._t("blueprint.fetch")}
              </ha-button>
            </div>
          `}
    `;
  }

  private _renderForm() {
    const meta = this._parsed!.meta;
    const inputs = meta.input || {};
    const keys = Object.keys(inputs);
    const missing = this._missingCustomCards();

    return html`
      <div class="meta">
        <div class="meta-title">${(this._german && meta.name_de) || meta.name}</div>
        ${(meta.description || meta.description_de) ? html`<div class="meta-desc">${(this._german && meta.description_de) || meta.description}</div>` : nothing}
        <div class="meta-tags">
          ${meta.version ? html`<span class="chip">v${meta.version}</span>` : nothing}
          ${meta.author ? html`<span class="chip">${meta.author}</span>` : nothing}
          ${(meta.custom_cards || []).map(
            (c) => html`<span class="chip card">${c}</span>`
          )}
        </div>
      </div>

      ${missing.length
        ? html`
            <div class="warn">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${this._t("blueprint.missing_cards", { cards: missing.join(", ") })}
              </div>
            </div>
          `
        : nothing}

      ${this._params?.page || this._source ? this._renderEditTools() : nothing}
      ${this._renderUpdateBanner()}

      ${this._editYaml ? this._renderYamlEditor() : this._renderFields(keys, inputs)}
    `;
  }

  // Knoppenbalk bij het bewerken of wanneer een blueprint een bron-URL heeft.
  private _renderEditTools() {
    return html`
      <div class="edit-tools">
        ${this._params?.page
          ? html`
              <ha-button appearance="plain" size="s" @click=${this._toggleYamlEdit}>
                <ha-icon icon="mdi:code-braces"></ha-icon>
                ${this._editYaml ? this._t("blueprint.settings") : this._t("blueprint.edit_yaml")}
              </ha-button>
            `
          : nothing}
        ${this._parsed
          ? html`
              <ha-button
                appearance="plain"
                size="s"
                ?disabled=${this._checking}
                @click=${() => this._checkUpdate()}
              >
                <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                ${this._checking ? this._t("blueprint.checking") : this._t("blueprint.check_update")}
              </ha-button>
            `
          : nothing}
      </div>
    `;
  }

  private _renderUpdateBanner() {
    return html`
      ${this._updateMsg
        ? html`
            <div class="update-banner">
              <span>${this._updateMsg}</span>
              ${this._update
                ? html`<ha-button appearance="accent" size="s" @click=${this._applyUpdate}
                    >${this._t("blueprint.update")}</ha-button
                  >`
                : nothing}
            </div>
          `
        : nothing}
    `;
  }

  private _renderYamlEditor() {
    return html`
      <textarea
        class="dd-yaml"
        spellcheck="false"
        .value=${this._yamlText}
        @input=${(e: any) => (this._yamlText = e.target.value)}
      ></textarea>
      <div class="actions">
        <ha-button appearance="plain" @click=${this._toggleYamlEdit}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._applyYamlEdit}>${this._t("blueprint.apply")}</ha-button>
      </div>
    `;
  }

  private _renderFields(keys: string[], inputs: Record<string, any>) {
    return html`
      <div class="field">
        <label>${this._t("blueprint.page_name")}</label>
        <input
          class="dd-input"
          .value=${this._pageName}
          @input=${(e: any) => (this._pageName = e.target.value)}
        />
      </div>
      <div class="field">
        <label>${this._t("blueprint.sidebar_icon")}</label>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this._pageIcon}
          @value-changed=${(e: any) => (this._pageIcon = e.detail.value)}
        ></ha-icon-picker>
      </div>

      ${keys.length
        ? html`<div class="section-label">${this._t("blueprint.settings")}</div>`
        : html`<p class="hint">${this._t("blueprint.no_fields")}</p>`}
      ${keys.map((key) => this._renderField(key, inputs[key]))}

      <div class="actions">
        <ha-button appearance="plain" @click=${this._backToSource}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._save}>
          ${this._params?.page ? this._t("common.save") : this._t("common.add")}
        </ha-button>
      </div>
    `;
  }

  private _renderField(key: string, def: any) {
    const value = this._values[key];
    const label = this._label(def, key);
    const type = def.type || "text-field";

    let control;
    switch (type) {
      case "entity-list":
        control = this._renderEntityList(key, def);
        break;
      case "entity-picker":
        control = html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${value || ""}
            allow-custom-entity
            @value-changed=${(e: any) => this._setValue(key, e.detail.value)}
          ></ha-entity-picker>
        `;
        break;
      case "icon-picker":
        control = html`
          <ha-icon-picker
            .hass=${this.hass}
            .value=${value || ""}
            @value-changed=${(e: any) => this._setValue(key, e.detail.value)}
          ></ha-icon-picker>
        `;
        break;
      case "area-picker":
        control = html`
          <ha-area-picker
            .hass=${this.hass}
            .value=${value || ""}
            @value-changed=${(e: any) => this._setValue(key, e.detail.value)}
          ></ha-area-picker>
        `;
        break;
      case "boolean":
        control = html`
          <ha-switch
            .checked=${!!value}
            @change=${(e: any) => this._setValue(key, e.target.checked)}
          ></ha-switch>
        `;
        break;
      case "number":
        control = html`
          <input
            class="dd-input"
            type="number"
            .value=${value ?? ""}
            @input=${(e: any) => this._setValue(key, e.target.value)}
          />
        `;
        break;
      default:
        control = html`
          <input
            class="dd-input"
            .value=${value ?? ""}
            @input=${(e: any) => this._setValue(key, e.target.value)}
          />
        `;
    }

    return html`
      <div class="field">
        <label>${label}</label>
        ${this._desc(def) ? html`<div class="field-desc">${this._desc(def)}</div>` : nothing}
        ${control}
      </div>
    `;
  }

  private _coinSuggestions(): { name: string; entity: string; price_entity: string; amount_entity: string; icon: string }[] {
    const states = this.hass?.states || {};
    const ids = Object.keys(states);
    const values = ids.filter(id => /^sensor\.wallet_value_(?!total$)/i.test(id));
    const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const displayName = (id: string) => {
      const friendly = String(states[id]?.attributes?.friendly_name || '');
      return (friendly.replace(/^(?:wert|value|wallet|price|kurs|volume|volumen|bestand|holdings)\s*[:-]?\s*/i, '').trim() || id.replace(/^sensor\\.wallet_value_/, '').replace(/_/g, ' ')).trim();
    };
    return values.map(entity => {
      const suffix = entity.replace(/^sensor\.wallet_value_/, '');
      const name = displayName(entity).replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
      const possible = [suffix, name].map(normalized);
      const priceMatches = ids.filter(id => id.startsWith('sensor.') && (/cryptoinfo|(?:^|_)price_|(?:^|_)kurs_/.test(id) || id.includes('price')) && possible.some(word => word && normalized(id).includes(word)));
      const amountMatches = ids.filter(id => id.startsWith('sensor.') && /wallet_volume_|wallet_amount_|holdings_|balance_/.test(id) && possible.some(word => word && normalized(id).includes(word)));
      const price = 'sensor.cryptoinfo_' + suffix + '_eur';
      const amount = 'sensor.wallet_volume_' + suffix;
      return {
        name,
        entity,
        price_entity: states[price] ? price : priceMatches.length === 1 ? (priceMatches[0] || '') : '',
        amount_entity: states[amount] ? amount : amountMatches.length === 1 ? (amountMatches[0] || '') : '',
        icon: '',
      };
    }).sort((a,b)=>a.name.localeCompare(b.name)).filter((row,index,rows)=>rows.findIndex(other=>other.entity===row.entity)===index);
  }

  private _entitySuggestions(def: any): string[] {
    const rx = def.suggest === 'waste'
      ? /waste|garbage|rubbish|trash|refuse|recycl|papier|paper|bio(?:m[uü]ll)?|rest(?:m[uü]ll)?|abfall|gelber.?sack|altglas|muell|mull|collection|pickup|tonne/i
      : /wallet|crypto|bitcoin|ethereum|cardano|coin|token|asset|portfolio|balance|cryptoinfo|wallet_value/i;
    return Object.keys(this.hass?.states || {}).filter(id =>
      id.startsWith((def.entity_domain || 'sensor') + '.') &&
      rx.test(id + ' ' + (this.hass.states[id]?.attributes?.friendly_name || ''))
    );
  }

  private _renderEntityList(key: string, def: any) {
    const items = Array.isArray(this._values[key]) ? this._values[key] : [];
    const update = (index: number, prop: 'name' | 'icon' | 'image' | 'entity' | 'price_entity' | 'amount_entity', value: string) => {
      const next = items.map((item: any) => ({ ...item }));
      next[index][prop] = value;
      if (prop === 'entity' && value && !next[index].name) next[index].name = this.hass.states[value]?.attributes?.friendly_name || value.split('.').pop()?.replace(/_/g, ' ') || '';
      this._setValue(key, next);
    };
    const suggestions = def.suggest === 'coin'
      ? this._coinSuggestions().filter(row => !items.some((x: any) => x.entity === row.entity))
      : this._entitySuggestions(def).filter(id => !items.some((x: any) => x.entity === id));
    return html`<div class="entity-list">
      ${items.map((item: any, index: number) => html`<div class="entity-list-row">
        <div class="entity-list-header">
          <input class="dd-input entity-name-input" aria-label=${this._t('strategy.name')} placeholder=${this._t('strategy.name')} .value=${item.name || ''} @input=${(e: any) => update(index, 'name', e.target.value)} />
          <ha-button appearance="plain" size="s" @click=${() => this._setValue(key, items.filter((_: any, i: number) => i !== index))}>${this._t('common.remove')}</ha-button>
        </div>
        <div class="field"><label>${this._t(def.suggest === 'coin' ? 'blueprint.value_sensor' : 'blueprint.entity')}</label><div class="field-desc">${this._t('common.example', { value: def.suggest === 'coin' ? 'sensor.wallet_value_bitcoin' : 'sensor.waste_paper' })}</div><ha-entity-picker .hass=${this.hass} .value=${item.entity || ''} @value-changed=${(e: any) => update(index, 'entity', e.detail.value)}></ha-entity-picker></div>
        ${def.suggest === 'coin' ? html`<div class="field"><label>${this._t('blueprint.price_sensor')}</label><div class="field-desc">${this._t('common.example', { value: 'sensor.cryptoinfo_bitcoin_eur' })}</div><ha-entity-picker .hass=${this.hass} .value=${item.price_entity || ''} @value-changed=${(e: any) => update(index, 'price_entity', e.detail.value)}></ha-entity-picker></div><div class="field"><label>${this._t('blueprint.holdings_sensor')}</label><div class="field-desc">${this._t('common.example', { value: 'sensor.wallet_volume_bitcoin' })}</div><ha-entity-picker .hass=${this.hass} .value=${item.amount_entity || ''} @value-changed=${(e: any) => update(index, 'amount_entity', e.detail.value)}></ha-entity-picker></div>` : nothing}
        ${def.suggest === 'waste' ? html`<div class="field"><label>${this._t('common.image')} <span style="font-size:12px;color:var(--secondary-text-color)">(${this._t('settings.optional')})</span></label><div class="field-desc">${this._t('common.example', { value: '/local/waste/paper.png' })}</div><input class="dd-input" placeholder="/local/waste/paper.png" .value=${item.image || ''} @input=${(e: any) => update(index, 'image', e.target.value)} />${item.image && /^(\/local\/|\/media\/|https?:\/\/)/.test(item.image) ? html`<img src=${item.image} alt=${item.name || ''} style="height:88px;max-width:100%;object-fit:contain;align-self:start;border-radius:8px" @error=${(e:any)=>{ e.target.style.display='none'; }} />` : nothing}</div>` : nothing}
        <div class="field"><label>${this._t('common.icon')} <span style="font-size:12px;color:var(--secondary-text-color);font-weight:400">(${this._t('settings.optional')})</span></label><ha-icon-picker .hass=${this.hass} .value=${item.icon || ''} @value-changed=${(e: any) => update(index, 'icon', e.detail.value)}></ha-icon-picker></div>
      </div>`)}
      <ha-button appearance="outlined" @click=${() => this._setValue(key, [...items, { name: '', icon: '', entity: '' }])}>${this._t(def.suggest === 'waste' ? 'blueprint.add_waste' : 'blueprint.add_coin')}</ha-button>
      ${suggestions.length ? html`<div class="field-desc">${this._t('blueprint.suggestions')}</div>
        <div class="entity-list-suggestions">${suggestions.slice(0, 32).map(entry => { const item = typeof entry === 'string' ? { entity: entry, name: this.hass.states[entry]?.attributes?.friendly_name || (entry.split('.')[1] || entry).replace(/_/g, ' '), icon: '' } : entry; return html`<ha-button appearance="plain" size="s" @click=${() => this._setValue(key, [...items, item])}>${item.name}</ha-button>`; })}</div>` : nothing}
    </div>`;
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
        padding: 8px 24px 20px;
      }
      .error {
        background: rgba(var(--rgb-error-color, 244, 67, 54), 0.12);
        color: var(--error-color, #f44336);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
        font-size: 14px;
        white-space: pre-wrap;
      }
      .warn {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
        color: var(--warning-color, #ff9800);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
        font-size: 13px;
      }
      .warn ha-icon {
        flex: 0 0 auto;
      }
      .tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .tab {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px;
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 14px;
      }
      .tab.active {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
      }
      .tab ha-icon {
        --mdc-icon-size: 18px;
      }
      .hint {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin: 4px 0 10px;
      }
      .dd-yaml {
        width: 100%;
        min-height: 240px;
        box-sizing: border-box;
        resize: vertical;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        line-height: 1.5;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid var(--divider-color);
        background: var(--code-editor-background-color, var(--card-background-color));
        color: var(--primary-text-color);
      }
      .dd-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }
      .dd-input:focus,
      .dd-yaml:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      .meta {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px 14px;
        margin-bottom: 14px;
      }
      .meta-title {
        font-size: 17px;
        font-weight: 600;
      }
      .meta-desc {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
      .meta-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      .chip {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }
      .chip.card {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-color);
      }
      .section-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        margin: 14px 0 8px;
      }
      .entity-list-row { border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; margin-bottom: 10px; display: grid; gap: 9px; }
      .entity-list-header { display: flex; align-items: center; gap: 12px; justify-content: space-between; }
      .entity-name-input { flex: 1; min-width: 0; font-weight: 600; }
      .entity-list-suggestions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
      .entity-list > ha-button { margin-top: 5px; }
      .field {
        margin-bottom: 14px;
      }
      .field label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      .field-desc {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 6px;
      }
      ha-entity-picker,
      ha-icon-picker,
      ha-area-picker {
        display: block;
        width: 100%;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
      .edit-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 4px 0 12px;
      }
      .edit-tools ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 4px;
      }
      .update-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-text-color);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 12px;
        font-size: 13px;
      }
      .gallery-search {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 12px;
        padding: 0 12px;
        min-height: 46px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
      }
      .gallery-search:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
      }
      .gallery-search ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        flex: 0 0 auto;
      }
      .gallery-search input {
        width: 100%;
        min-width: 0;
        height: 44px;
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
      }
      .gallery-search input::placeholder {
        color: var(--secondary-text-color);
      }
      .gallery {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }
      @media (min-width: 560px) {
        .gallery {
          grid-template-columns: 1fr 1fr;
        }
      }
      .gallery-item {
        display: flex;
        flex-direction: column;
        text-align: left;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        overflow: hidden;
        padding: 0;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .gallery-item:hover {
        border-color: var(--primary-color);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
      }
      .gallery-img {
        width: 100%;
        height: 110px;
        object-fit: cover;
        background: var(--secondary-background-color);
      }
      .gallery-img.placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gallery-img.placeholder ha-icon {
        --mdc-icon-size: 40px;
        color: var(--secondary-text-color);
      }
      .gallery-info {
        padding: 10px 12px;
      }
      .gallery-name {
        font-size: 15px;
        font-weight: 600;
      }
      .gallery-desc {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .gallery-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      code {
        background: var(--secondary-background-color);
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dwains-dashboard-next-blueprint-dialog": DwainsBlueprintDialog;
  }
}
