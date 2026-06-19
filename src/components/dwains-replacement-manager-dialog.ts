import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { mdiClose } from '@mdi/js';
import type { HomeAssistant } from '../types/home-assistant';
import type {
  BlueprintReplacementAssignment,
  BlueprintReplacementGroup,
  BlueprintReplacementSurface,
  BlueprintReplacements,
  DwainsDashboardConfig,
} from '../types/strategy';
import { defaultValues, parseBlueprintYaml, type ParsedBlueprint } from '../utils/blueprints';
import { getDomainName } from '../utils/domain-names';

interface ReplacementManagerParams {
  config: DwainsDashboardConfig;
  onSave: (config: DwainsDashboardConfig) => void;
}

interface GalleryItem {
  name: string;
  description?: string;
  type?: string;
  version?: string;
  url: string;
  custom_cards?: string[];
}

const GALLERY_URL =
  'https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json';

const REPLACEMENT_SURFACES: BlueprintReplacementSurface[] = ['area_cards', 'devices_cards'];

const DOMAIN_HINTS: Array<[string, string[]]> = [
  ['alarm_control_panel', ['alarm-control-panel', 'alarm card', 'alarm_control_panel', 'alarm']],
  ['media_player', ['media-player', 'media player', 'mediaplayer']],
  ['binary_sensor', ['binary_sensor', 'binary sensor', 'motion sensor', 'window sensor', 'door sensor', 'motion/window/door']],
  ['cover', ['mushroom-cover', 'slider-button-cover', 'replace_slider_button_cover', 'cover card', 'cover']],
  ['climate', ['mushroom-climate', 'climate card', 'climate']],
  ['switch', ['slider-button-switch', 'replace_slider_button_switch', 'switch card', 'switch']],
  ['light', ['mushroom-light', 'slider-button-light', 'replace_slider_button_light', 'light card', 'light']],
  ['fan', ['mushroom-fan', 'slider-button-fan', 'replace_slider_button_fan', 'fan card', 'fan']],
  ['lock', ['mushroom-lock', 'lock card', 'lock']],
  ['person', ['mushroom-person', 'person card', 'person']],
  ['update', ['mushroom-update', 'update card', 'update']],
  ['vacuum', ['mushroom-vacuum', 'vacuum card', 'vacuum']],
  ['sensor', ['sensor card', 'sensor']],
];

const SYNTHETIC_INPUTS = new Set([
  'replace_with_input_entity',
  'replace_with_input_entity_id',
  'replace_with_input_name',
  'replace_with_input_domain',
  'replace_with_input_device_class',
  'replace_with_input_area',
]);

@customElement('dwains-replacement-manager-dialog')
export class DwainsReplacementManagerDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _params?: ReplacementManagerParams;
  @state() private _config?: DwainsDashboardConfig;
  @state() private _replacements: BlueprintReplacements = {};

  @state() private _domain = 'light';

  @state() private _gallery: GalleryItem[] = [];
  @state() private _galleryLoading = false;
  @state() private _galleryError = '';
  @state() private _search = '';
  @state() private _selected?: GalleryItem;
  @state() private _parsed?: ParsedBlueprint;
  @state() private _inputs: Record<string, any> = {};
  @state() private _loadingBlueprint = false;
  @state() private _error = '';

  public showDialog(params: ReplacementManagerParams): void {
    this._params = params;
    this._config = params.config;
    this._replacements = cloneReplacements(params.config.blueprint_replacements || {});
    this._domain = this._domainOptions()[0]?.value || 'light';
    this._selected = undefined;
    this._parsed = undefined;
    this._inputs = {};
    this._error = '';
    this._open = true;
    void this._loadGallery();
  }

  public closeDialog(): void {
    this._open = false;
    this._params = undefined;
    this.remove();
  }

  protected render() {
    if (!this._open || !this._config) return nothing;
    return html`
      <ha-dialog open @closed=${this.closeDialog} .heading=${'Blueprint replacements'} hideActions>
        <ha-dialog-header slot="heading">
          <ha-icon-button
            slot="navigationIcon"
            .path=${mdiClose}
            .label=${'Close'}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <span slot="title">Blueprint replacements</span>
        </ha-dialog-header>

        <div class="content">
          <section class="overview">
            ${this._renderSummary()}
          </section>

          ${this._renderAssignments()}
          ${this._renderBuilder()}
        </div>
      </ha-dialog>
    `;
  }

  private _renderSummary() {
    const count = this._assignmentEntries().length;
    return html`
      <div class="surface-summary">
        <div>
          <div class="surface-title">Area view + Devices view</div>
          <div class="surface-desc">
            Domain replacements are applied to standard entity cards in both views, like DD3.
          </div>
        </div>
        <span class="count">${count}</span>
      </div>
    `;
  }

  private _renderAssignments() {
    const entries = this._assignmentEntries();
    return html`
      <section class="assignment-section">
        <div class="section-header">
          <ha-icon icon="mdi:shape-outline"></ha-icon>
          <h3>Domain replacements</h3>
        </div>
        ${entries.length
          ? html`
              <div class="assignment-list">
                ${repeat(
                  entries,
                  (entry) => entry.target,
                  (entry) => this._renderAssignment(entry.target, entry.assignment)
                )}
              </div>
            `
          : html`<div class="empty">No replacements configured.</div>`}
      </section>
    `;
  }

  private _renderAssignment(
    target: string,
    assignment: BlueprintReplacementAssignment
  ) {
    return html`
      <div class="assignment ${assignment.enabled === false ? 'disabled' : ''}">
        <div class="assignment-main">
          <div class="target-pill">Domain · ${getDomainName(this.hass, target)}</div>
          <div class="assignment-name">${assignment.name}</div>
          <div class="assignment-meta">
            ${assignment.version ? html`<span>v${assignment.version}</span>` : nothing}
            ${(assignment.custom_cards || []).map((card) => html`<span>${card}</span>`)}
          </div>
        </div>
        <div class="assignment-actions">
          <button
            class="icon-button"
            title=${assignment.enabled === false ? 'Enable' : 'Disable'}
            @click=${() => this._toggleAssignment(target)}
          >
            <ha-icon icon=${assignment.enabled === false ? 'mdi:eye-off' : 'mdi:eye'}></ha-icon>
          </button>
          <button
            class="icon-button danger"
            title="Remove"
            @click=${() => this._removeAssignment(target)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  private _renderBuilder() {
    return html`
      <section class="builder">
        <div class="section-header">
          <ha-icon icon="mdi:puzzle-edit-outline"></ha-icon>
          <h3>Assign replacement</h3>
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="builder-grid">
          <div class="control-block domain-control">
            <label>Domain</label>
            ${this._renderDomainControl()}
            <div class="hint">Applies to matching entities in both area and devices views.</div>
          </div>
        </div>

        <div class="gallery-toolbar">
          <input
            class="search"
            type="search"
            placeholder="Search replace-card blueprints"
            .value=${this._search}
            @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
          />
          ${this._galleryLoading ? html`<span class="loading">Loading…</span>` : nothing}
        </div>
        ${this._galleryError ? html`<div class="error">${this._galleryError}</div>` : nothing}

        <div class="gallery">
          ${repeat(
            this._filteredGallery(),
            (item) => item.url,
            (item) => html`
              <button
                class="blueprint-choice ${this._selected?.url === item.url ? 'selected' : ''}"
                @click=${() => this._selectBlueprint(item)}
              >
                <span class="choice-name">${item.name}</span>
                ${item.description ? html`<span class="choice-desc">${item.description}</span>` : nothing}
                <span class="choice-tags">
                  ${item.version ? html`<span>v${item.version}</span>` : nothing}
                  ${(item.custom_cards || []).slice(0, 3).map((card) => html`<span>${card}</span>`)}
                </span>
              </button>
            `
          )}
        </div>

        ${this._selected ? this._renderSelectedBlueprint() : nothing}
      </section>
    `;
  }

  private _renderDomainControl() {
    const options = this._domainOptions();
    return html`
      <select
        .value=${this._domain}
        @change=${(e: Event) => {
          this._domain = (e.target as HTMLSelectElement).value;
        }}
      >
        ${options.map((option) => html`<option value=${option.value}>${option.label}</option>`)}
      </select>
    `;
  }

  private _renderSelectedBlueprint() {
    const inputKeys = this._editableInputKeys();
    return html`
      <div class="selected-blueprint">
        <div class="selected-header">
          <div>
            <div class="selected-name">${this._selected!.name}</div>
            ${this._parsed?.meta.version ? html`<div class="selected-version">v${this._parsed.meta.version}</div>` : nothing}
          </div>
          <ha-button
            appearance="accent"
            ?disabled=${this._loadingBlueprint || !this._canApply()}
            @click=${this._applyAssignment}
          >
            <ha-icon icon="mdi:check"></ha-icon>
            Apply
          </ha-button>
        </div>

        ${this._loadingBlueprint ? html`<div class="loading">Loading blueprint…</div>` : nothing}
        <div class="hint">Will be applied to ${getDomainName(this.hass, this._domain)} entities in both views.</div>
        ${inputKeys.length
          ? html`
              <div class="input-grid">
                ${inputKeys.map((key) => this._renderInputField(key))}
              </div>
            `
          : html`<div class="hint">Entity and name are filled automatically per rendered entity.</div>`}
      </div>
    `;
  }

  private _renderInputField(key: string) {
    const input = this._parsed?.meta.input?.[key];
    return html`
      <label class="input-field">
        <span>${input?.name || key}</span>
        ${input?.description ? html`<small>${input.description}</small>` : nothing}
        <input
          type=${input?.type === 'number' ? 'number' : 'text'}
          .value=${this._inputs[key] ?? ''}
          @input=${(e: Event) =>
            (this._inputs = { ...this._inputs, [key]: (e.target as HTMLInputElement).value })}
        />
      </label>
    `;
  }

  private async _loadGallery(): Promise<void> {
    if (this._gallery.length || this._galleryLoading) return;
    this._galleryLoading = true;
    this._galleryError = '';
    try {
      const resp = await fetch(GALLERY_URL, { redirect: 'follow' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const list: any[] = Array.isArray(data) ? data : data?.blueprints || [];
      this._gallery = list
        .filter((item) => item?.url && item?.name && item?.type === 'replace-card' && !isPopupBlueprint(item))
        .map((item) => ({
          name: String(item.name),
          description: item.description ? String(item.description) : undefined,
          type: item.type ? String(item.type) : undefined,
          version: item.version != null ? String(item.version) : undefined,
          url: String(item.url),
          custom_cards: Array.isArray(item.custom_cards) ? item.custom_cards.map(String) : undefined,
        }));
    } catch (e: any) {
      this._galleryError = String(e?.message || e);
    } finally {
      this._galleryLoading = false;
    }
  }

  private async _selectBlueprint(item: GalleryItem): Promise<void> {
    this._selected = item;
    this._parsed = undefined;
    this._inputs = {};
    this._error = '';
    this._loadingBlueprint = true;
    try {
      const resp = await fetch(item.url, { redirect: 'follow' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const parsed = parseBlueprintYaml(text);
      this._parsed = parsed;
      this._inputs = defaultValues(parsed.meta);
      const inferredDomain = inferBlueprintDomain(item, parsed);
      if (inferredDomain && this._domainOptions().some((option) => option.value === inferredDomain)) {
        this._domain = inferredDomain;
      }
    } catch (e: any) {
      this._error = `Could not load ${item.name}: ${String(e?.message || e)}`;
    } finally {
      this._loadingBlueprint = false;
    }
  }

  private _applyAssignment = (): void => {
    if (!this._selected || !this._parsed || !this._canApply()) return;
    const target = this._domain;
    const assignment: BlueprintReplacementAssignment = {
      id: this._slug(`${this._selected.name}-${target}`),
      name: this._selected.name,
      source: this._selected.url,
      version: this._parsed.meta.version,
      blueprint: this._parsed.raw,
      inputs: this._stripSyntheticInputs(this._inputs),
      custom_cards: this._parsed.meta.custom_cards || this._selected.custom_cards || [],
      enabled: true,
    };

    let replacements = cloneReplacements(this._replacements);
    for (const surface of REPLACEMENT_SURFACES) {
      replacements = this._setDomainAssignment(replacements, surface, target, assignment);
    }
    this._commit(replacements);
  };

  private _toggleAssignment(target: string): void {
    const current = this._domainAssignment(target);
    if (!current) return;
    const next = { ...current, enabled: current.enabled === false };
    let replacements = cloneReplacements(this._replacements);
    for (const surface of REPLACEMENT_SURFACES) {
      replacements = this._setDomainAssignment(replacements, surface, target, next);
    }
    this._commit(replacements);
  }

  private _removeAssignment(target: string): void {
    const replacements = cloneReplacements(this._replacements);
    for (const surface of REPLACEMENT_SURFACES) {
      const bucket = replacements[surface]?.by_domain;
      if (bucket) delete bucket[target];
    }
    this._commit(replacements);
  }

  private _commit(replacements: BlueprintReplacements): void {
    this._replacements = replacements;
    const nextConfig = { ...this._config!, blueprint_replacements: replacements };
    this._config = nextConfig;
    this._params?.onSave(nextConfig);
  }

  private _setDomainAssignment(
    replacements: BlueprintReplacements,
    surface: BlueprintReplacementSurface,
    target: string,
    assignment: BlueprintReplacementAssignment
  ): BlueprintReplacements {
    const surfaceGroup = replacements[surface] || {};
    replacements[surface] = {
      ...surfaceGroup,
      by_domain: {
        ...(surfaceGroup.by_domain || {}),
        [target]: assignment,
      },
    };
    return replacements;
  }

  private _assignmentEntries(): Array<{ target: string; assignment: BlueprintReplacementAssignment }> {
    const targets = new Set<string>();
    REPLACEMENT_SURFACES.forEach((surface) => {
      Object.keys(this._replacements[surface]?.by_domain || {}).forEach((target) => targets.add(target));
    });
    return Array.from(targets)
      .sort((a, b) => getDomainName(this.hass, a).localeCompare(getDomainName(this.hass, b)))
      .map((target) => ({ target, assignment: this._domainAssignment(target)! }))
      .filter((entry) => !!entry.assignment);
  }

  private _domainAssignment(target: string): BlueprintReplacementAssignment | undefined {
    return (
      this._replacements.area_cards?.by_domain?.[target] ||
      this._replacements.devices_cards?.by_domain?.[target]
    );
  }

  private _domainOptions(): Array<{ value: string; label: string }> {
    const domains = new Set<string>();
    Object.keys(this.hass?.states || {}).forEach((entityId) => domains.add(entityId.split('.')[0] || ''));
    ['light', 'switch', 'climate', 'cover', 'fan', 'media_player', 'person', 'sensor', 'binary_sensor'].forEach(
      (domain) => domains.add(domain)
    );
    return Array.from(domains)
      .filter(Boolean)
      .sort()
      .map((domain) => ({ value: domain, label: getDomainName(this.hass, domain) }));
  }

  private _canApply(): boolean {
    return !!this._parsed && !!this._selected && !!this._domain;
  }

  private _filteredGallery(): GalleryItem[] {
    const q = this._search.trim().toLowerCase();
    const target = this._domain.toLowerCase();
    return this._gallery
      .filter((item) => {
        if (!q) return true;
        const haystack = `${item.name} ${item.description || ''} ${(item.custom_cards || []).join(' ')}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => scoreGallery(b, target) - scoreGallery(a, target) || a.name.localeCompare(b.name));
  }

  private _editableInputKeys(): string[] {
    return Object.keys(this._parsed?.meta.input || {}).filter((key) => !SYNTHETIC_INPUTS.has(key));
  }

  private _stripSyntheticInputs(inputs: Record<string, any>): Record<string, any> {
    const out: Record<string, any> = {};
    Object.entries(inputs).forEach(([key, value]) => {
      if (!SYNTHETIC_INPUTS.has(key) && value !== '') out[key] = value;
    });
    return out;
  }

  private _slug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  static override styles = css`
    :host {
      --mdc-dialog-min-width: min(960px, 92vw);
      --mdc-dialog-max-width: min(1040px, 96vw);
    }
    ha-dialog {
      --dialog-content-padding: 0;
    }
    .content {
      padding: 0 18px 20px;
      color: var(--primary-text-color);
    }
    .overview {
      margin-bottom: 14px;
    }
    .surface-summary,
    .assignment,
    .selected-blueprint {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
    }
    .surface-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
    }
    .surface-title,
    .assignment-name,
    .selected-name {
      font-weight: 600;
    }
    .surface-desc,
    .choice-desc,
    .selected-version,
    .hint,
    .empty,
    small {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .count,
    .target-pill,
    .choice-tags span,
    .assignment-meta span {
      border-radius: 999px;
      padding: 2px 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      white-space: nowrap;
    }
    .count {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      font-weight: 700;
    }
    .assignment-section,
    .builder {
      margin-top: 18px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .section-header h3 {
      margin: 0;
      font-size: 15px;
    }
    .section-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .assignment-list {
      display: grid;
      gap: 8px;
    }
    .assignment {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px;
    }
    .assignment.disabled {
      opacity: 0.58;
    }
    .assignment-main {
      min-width: 0;
    }
    .assignment-meta,
    .choice-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
    }
    .assignment-actions {
      display: flex;
      gap: 6px;
    }
    .icon-button {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
    }
    .icon-button:hover {
      color: var(--primary-color);
    }
    .icon-button.danger:hover {
      color: var(--error-color);
    }
    .builder {
      border-top: 1px solid var(--divider-color);
      padding-top: 16px;
    }
    .builder-grid {
      display: grid;
      grid-template-columns: minmax(220px, 360px);
      gap: 12px;
    }
    .control-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    select,
    .search,
    .input-field input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 10px 11px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .gallery-toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 14px 0 8px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      max-height: 280px;
      overflow: auto;
      padding-right: 2px;
    }
    .blueprint-choice {
      text-align: left;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .blueprint-choice:hover,
    .blueprint-choice.selected {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color) inset;
    }
    .choice-name {
      font-weight: 600;
    }
    .selected-blueprint {
      margin-top: 12px;
      padding: 12px;
    }
    .selected-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .selected-header ha-icon {
      --mdc-icon-size: 18px;
      margin-right: 5px;
    }
    .input-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .input-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .error {
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.12);
      color: var(--error-color);
      margin-bottom: 10px;
    }
    .empty {
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      padding: 12px;
    }
    @media (max-width: 760px) {
      :host {
        --mdc-dialog-min-width: 96vw;
      }
      .overview,
      .builder-grid,
      .gallery,
      .input-grid {
        grid-template-columns: 1fr;
      }
      .assignment,
      .selected-header {
        align-items: stretch;
        flex-direction: column;
      }
      .assignment-actions {
        justify-content: flex-end;
      }
    }
  `;
}

function cloneReplacements(replacements: BlueprintReplacements): BlueprintReplacements {
  return {
    area_cards: cloneGroup(replacements.area_cards),
    devices_cards: cloneGroup(replacements.devices_cards),
  };
}

function cloneGroup(group?: BlueprintReplacementGroup): BlueprintReplacementGroup {
  return {
    by_domain: { ...(group?.by_domain || {}) },
    by_device_class: { ...(group?.by_device_class || {}) },
    by_entity: { ...(group?.by_entity || {}) },
  };
}

function scoreGallery(item: GalleryItem, target: string): number {
  if (!target) return 0;
  const haystack = `${item.name} ${item.description || ''} ${(item.custom_cards || []).join(' ')}`.toLowerCase();
  if (inferBlueprintDomain(item) === target) return 8;
  const domain = target.split(':')[0] || target;
  if (haystack.includes(target)) return 4;
  if (haystack.includes(domain)) return 3;
  return 0;
}

function inferBlueprintDomain(item: GalleryItem, parsed?: ParsedBlueprint): string {
  const haystack = [
    item.name,
    item.description,
    item.url,
    ...(item.custom_cards || []),
    parsed?.meta.name,
    parsed?.meta.description,
    ...(parsed?.meta.custom_cards || []),
    stringifyCardType(parsed?.card),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return DOMAIN_HINTS.find(([, hints]) => hints.some((hint) => haystack.includes(hint)))?.[0] || '';
}

function stringifyCardType(card: any): string {
  if (!card) return '';
  if (typeof card?.type === 'string') return card.type;
  try {
    return JSON.stringify(card);
  } catch {
    return '';
  }
}

function isPopupBlueprint(item: any): boolean {
  const haystack = `${item?.name || ''} ${item?.description || ''} ${item?.url || ''}`.toLowerCase();
  return haystack.includes('popup');
}

export function openReplacementManager(
  hass: HomeAssistant,
  config: DwainsDashboardConfig,
  onSave: (config: DwainsDashboardConfig) => void
): void {
  let dlg = document.querySelector(
    'dwains-replacement-manager-dialog'
  ) as DwainsReplacementManagerDialog | null;
  if (!dlg) {
    dlg = document.createElement('dwains-replacement-manager-dialog') as DwainsReplacementManagerDialog;
    document.body.appendChild(dlg);
  }
  dlg.hass = hass;
  dlg.showDialog({ config, onSave });
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-replacement-manager-dialog': DwainsReplacementManagerDialog;
  }
}
