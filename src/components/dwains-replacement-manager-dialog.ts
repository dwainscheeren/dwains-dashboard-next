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
import { ddLocalize } from '../utils/localize';

interface ReplacementManagerParams {
  config: DwainsDashboardConfig;
  onSave: (config: DwainsDashboardConfig) => void;
  initialDomain?: string;
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

@customElement('dwains-dashboard-next-replacement-manager-dialog')
export class DwainsReplacementManagerDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _params?: ReplacementManagerParams;
  @state() private _config?: DwainsDashboardConfig;
  @state() private _replacements: BlueprintReplacements = {};

  @state() private _domain = '';

  @state() private _gallery: GalleryItem[] = [];
  @state() private _galleryLoading = false;
  @state() private _galleryError = '';
  @state() private _search = '';
  @state() private _selected?: GalleryItem;
  @state() private _parsed?: ParsedBlueprint;
  @state() private _inputs: Record<string, any> = {};
  @state() private _loadingBlueprint = false;
  @state() private _error = '';

  private _t(key: string, replacements?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, replacements);
  }

  public showDialog(params: ReplacementManagerParams): void {
    this._params = params;
    this._config = params.config;
    this._replacements = cloneReplacements(params.config.blueprint_replacements || {});
    const options = this._domainOptions();
    this._domain = params.initialDomain && options.some((option) => option.value === params.initialDomain)
      ? params.initialDomain
      : '';
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
      <ha-dialog open @closed=${this.closeDialog} .heading=${this._t('replacement.assign')} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${mdiClose}
            .label=${this._t('common.close')}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <div slot="title" class="dialog-title">
            <span>${this._t('replacement.assign')}</span>
            <small>${this._t('replacement.builder_description')}</small>
          </div>
        </ha-dialog-header>

        <div class="content">
          ${this._renderBuilder()}
        </div>
      </ha-dialog>
    `;
  }

  private _renderBuilder() {
    const inputKeys = this._editableInputKeys();

    return html`
      <section class="builder">
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="builder-controls">
          <div class="control-block domain-control">
            <label>${this._t('replacement.domain')}</label>
            ${this._renderDomainControl()}
          </div>
          <div class="control-block search-control">
            <label>${this._t('replacement.search')}</label>
            <input
              class="search"
              type="search"
              placeholder=${this._t('replacement.search')}
              .value=${this._search}
              @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        ${this._galleryLoading ? html`<div class="loading toolbar-loading">${this._t('common.loading')}</div>` : nothing}
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

        ${this._selected && inputKeys.length ? html`
          <div class="input-grid">
            ${inputKeys.map((key) => this._renderInputField(key))}
          </div>
        ` : nothing}

        <div class="builder-footer">
          <span class="hint">${this._t('replacement.views_description')}</span>
          <ha-button
            appearance="accent"
            ?disabled=${this._loadingBlueprint || !this._canApply()}
            @click=${this._applyAssignment}
          >
            <ha-icon icon="mdi:check"></ha-icon>
            ${this._t('common.save')}
          </ha-button>
        </div>
        ${this._loadingBlueprint ? html`<div class="loading footer-loading">${this._t('replacement.loading_blueprint')}</div>` : nothing}
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
          this._selected = undefined;
          this._parsed = undefined;
          this._inputs = {};
          this._error = '';
          this._search = '';
        }}
      >
        ${options.map((option) => html`<option value=${option.value}>${option.label}</option>`)}
      </select>
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
      const options = this._domainOptions().filter((option) => option.value);
      if (this._domain && !options.some((option) => option.value === this._domain)) {
        this._domain = '';
        this._selected = undefined;
        this._parsed = undefined;
        this._inputs = {};
      }
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
      if (!this._domain && inferredDomain) {
        this._domain = inferredDomain;
      } else if (inferredDomain && inferredDomain !== this._domain) {
        this._error = this._t('replacement.domain_mismatch', {
          domain: getDomainName(this.hass, this._domain),
        });
        this._selected = undefined;
        this._parsed = undefined;
        this._inputs = {};
      }
    } catch (e: any) {
      this._error = this._t('replacement.load_failed', {
        name: item.name,
        error: String(e?.message || e),
      });
    } finally {
      this._loadingBlueprint = false;
    }
  }

  private _applyAssignment = (): void => {
    if (!this._selected || !this._parsed || !this._canApply()) return;
    const target = this._domain;
    const alreadyAssigned = REPLACEMENT_SURFACES.some(
      (surface) => Boolean(this._replacements[surface]?.by_domain?.[target])
    );
    if (alreadyAssigned && target !== this._params?.initialDomain) {
      this._error = this._t('replacement.already_assigned', { domain: getDomainName(this.hass, target) });
      return;
    }

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
    this.closeDialog();
  };

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

  private _domainOptions(): Array<{ value: string; label: string }> {
    const assigned = new Set<string>();
    for (const surface of REPLACEMENT_SURFACES) {
      Object.keys(this._replacements[surface]?.by_domain || {}).forEach((domain) => assigned.add(domain));
    }

    const available = new Set<string>();
    this._gallery.forEach((item) => {
      const domain = inferBlueprintDomain(item);
      if (domain) available.add(domain);
    });

    // Before the gallery arrives, use only known replacement domains instead of every HA domain.
    if (!available.size && this._galleryLoading) {
      DOMAIN_HINTS.forEach(([domain]) => available.add(domain));
    }

    const initialDomain = this._params?.initialDomain;
    if (initialDomain) available.add(initialDomain);

    const options = Array.from(available)
      .filter((domain) => !assigned.has(domain) || domain === initialDomain)
      .map((domain) => ({ value: domain, label: getDomainName(this.hass, domain) }))
      .sort((a, b) => a.label.localeCompare(b.label, this.hass?.language || undefined));

    return [
      { value: '', label: this._t('replacement.all_domains') },
      ...options,
    ];
  }

  private _canApply(): boolean {
    return !!this._parsed && !!this._selected && !!this._domain;
  }

  private _galleryForDomain(): GalleryItem[] {
    const target = this._domain.toLowerCase();
    return this._gallery
      .filter((item) => !target || inferBlueprintDomain(item) === target)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _filteredGallery(): GalleryItem[] {
    const q = this._search.trim().toLowerCase();
    return this._galleryForDomain().filter((item) => {
      if (!q) return true;
      const haystack = `${item.name} ${item.description || ''} ${(item.custom_cards || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
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
      --mdc-dialog-min-width: min(680px, 92vw);
      --mdc-dialog-max-width: min(760px, 96vw);
    }
    ha-dialog {
      --dialog-content-padding: 0;
    }
    .content {
      padding: 0 18px 20px;
      color: var(--primary-text-color);
    }
    .dialog-title {
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    .dialog-title > span {
      font-size: 20px;
      font-weight: 650;
      line-height: 1.2;
    }
    .dialog-title > small,
    .choice-desc,
    .hint,
    .input-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.35;
    }
    .dialog-title > small {
      white-space: normal;
    }
    .builder {
      margin-top: 14px;
    }
    .builder-controls {
      display: grid;
      grid-template-columns: minmax(180px, 240px) minmax(240px, 1fr);
      gap: 12px;
      align-items: end;
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
    .toolbar-loading {
      margin: 10px 0 0;
    }
    .gallery {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      max-height: 280px;
      overflow: auto;
      padding-right: 2px;
      margin-top: 12px;
    }
    .builder-controls + .gallery {
      margin-top: 12px;
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
    .choice-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }
    .choice-tags span {
      border-radius: 999px;
      padding: 2px 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      white-space: nowrap;
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
    .builder-footer {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .builder-footer .hint {
      margin: 0;
    }
    .builder-footer ha-button {
      flex: 0 0 auto;
    }
    .builder-footer ha-icon {
      --mdc-icon-size: 18px;
      margin-right: 5px;
    }
    .footer-loading {
      margin-top: 8px;
    }
    .error {
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.12);
      color: var(--error-color);
      margin-bottom: 10px;
    }
    @media (max-width: 760px) {
      :host {
        --mdc-dialog-min-width: 96vw;
      }
      .builder-controls,
      .gallery,
      .input-grid {
        grid-template-columns: 1fr;
      }
      .builder-footer {
        align-items: stretch;
        flex-direction: column;
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
  onSave: (config: DwainsDashboardConfig) => void,
  initialDomain?: string
): void {
  let dlg = document.querySelector(
    'dwains-dashboard-next-replacement-manager-dialog'
  ) as DwainsReplacementManagerDialog | null;
  if (!dlg) {
    dlg = document.createElement('dwains-dashboard-next-replacement-manager-dialog') as DwainsReplacementManagerDialog;
    document.body.appendChild(dlg);
  }
  dlg.hass = hass;
  dlg.showDialog({ config, onSave, initialDomain });
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-replacement-manager-dialog': DwainsReplacementManagerDialog;
  }
}
