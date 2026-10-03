import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import { ddLocalize, ddLocalizePlural } from '../utils/localize';
import { browseMedia, collectSlideshowImages, resolveImageUrl } from '../utils/screensaver-media';
import {
  WALL_TABLET_CHANGED_EVENT,
  WALL_TABLET_DIM_OPTIONS,
  WALL_TABLET_MINUTE_OPTIONS,
  WALL_TABLET_PHOTO_DIM_OPTIONS,
  WALL_TABLET_PREVIEW_EVENT,
  WALL_TABLET_SLIDE_SECONDS_OPTIONS,
  WALL_TABLET_URL_PARAM,
  dashboardSegmentFromPath,
  isMediaSourceId,
  readWallTabletPrefs,
  sanitizeImageLink,
  screensaverSource,
  updateWallTabletPrefs,
  type WallTabletPhotoFit,
  type WallTabletPrefs,
  type WallTabletScreensaverMode,
} from '../utils/wall-tablet';
import './dwains-media-picker';
import type { MediaPickedDetail } from './dwains-media-picker';

interface Choice<T extends string | number = number> {
  value: T;
  label: string;
}

/** What the settings page knows about the chosen image or folder. */
interface PhotoPreview {
  /** The image or folder this preview belongs to. */
  source: string;
  state: 'loading' | 'ready' | 'failed';
  /** Address of the image, or of the first photo of the folder. */
  url?: string;
  /** Number of photos found in the folder. */
  count?: number;
}

/**
 * dwains-dashboard-next-wall-tablet-settings: the "Wall tablet" page of the
 * dashboard settings. These preferences belong to this device only: they are
 * stored in the browser and applied right away, never through the dashboard
 * config, so they do not mark the settings page as changed.
 */
@customElement('dwains-dashboard-next-wall-tablet-settings')
export class DwainsWallTabletSettings extends LitElement {
  private _hass?: HomeAssistant;
  private _segment = dashboardSegmentFromPath(window.location.pathname);
  @state() private _prefs: Readonly<WallTabletPrefs> = readWallTabletPrefs(this._segment);
  /** Which media picker is open below its row. */
  @state() private _picker: 'image' | 'folder' | null = null;
  @state() private _preview?: PhotoPreview;
  /** The link field rejected what was typed. */
  @state() private _linkInvalid = false;

  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    // Only the language matters here; skip the other hass updates.
    if (!old || old.language !== hass?.language || old.locale?.language !== hass?.locale?.language) {
      this.requestUpdate();
    }
    if (!old && hass) this._refreshPreview();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._segment = dashboardSegmentFromPath(window.location.pathname);
    this._prefs = readWallTabletPrefs(this._segment);
    window.addEventListener(WALL_TABLET_CHANGED_EVENT, this._handleChanged);
    this._refreshPreview();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(WALL_TABLET_CHANGED_EVENT, this._handleChanged);
  }

  private _handleChanged = (): void => {
    this._prefs = readWallTabletPrefs(this._segment);
    this._refreshPreview();
  };

  /**
   * Look up the chosen image, or count the photos of the chosen folder, so the
   * page can show what the screensaver is going to use.
   */
  private _refreshPreview(): void {
    const hass = this._hass;
    const source = screensaverSource(this._prefs);
    if (source.kind === 'clock' || !hass) {
      this._preview = undefined;
      return;
    }
    const key = source.kind === 'image' ? source.image : source.folder;
    if (this._preview?.source === key) return;
    this._preview = { source: key, state: 'loading' };

    const finish = (result: Partial<PhotoPreview> & { state: PhotoPreview['state'] }) => {
      // Another image or folder was chosen in the meantime.
      if (this._preview?.source !== key) return;
      this._preview = { source: key, ...result };
    };

    if (source.kind === 'image') {
      resolveImageUrl(hass, source.image)
        .then((url) => finish({ state: 'ready', url }))
        .catch(() => finish({ state: 'failed' }));
      return;
    }

    collectSlideshowImages((id) => browseMedia(hass, id), source.folder)
      .then(async (images) => {
        const first = images[0];
        const url = first ? await resolveImageUrl(hass, first).catch(() => undefined) : undefined;
        finish({ state: 'ready', count: images.length, url });
      })
      .catch(() => finish({ state: 'failed' }));
  }

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this._hass, key, vars);
  }

  private _update(patch: Partial<WallTabletPrefs>): void {
    this._prefs = updateWallTabletPrefs(this._segment, patch);
    // Saved right away on this device; let the settings page confirm it.
    this.dispatchEvent(new CustomEvent('dwains-dashboard-next-device-settings-saved', { bubbles: true, composed: true }));
  }

  private _toggleEnabled = (event: Event): void => {
    // Not a dashboard config change: keep it away from the settings page.
    event.stopPropagation();
    this._update({ enabled: Boolean((event.target as HTMLInputElement | null)?.checked) });
  };

  private _toggle(key: 'slideshowShuffle' | 'photoClock') {
    return (event: Event): void => {
      event.stopPropagation();
      this._update({ [key]: Boolean((event.target as HTMLInputElement | null)?.checked) });
    };
  }

  private _handleLinkChange = (event: Event): void => {
    // Not a dashboard config change: keep it away from the settings page.
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    const typed = input.value.trim();
    const link = sanitizeImageLink(typed);
    this._linkInvalid = Boolean(typed) && (!link || isMediaSourceId(link));
    if (this._linkInvalid) return;
    this._update({ screensaverImage: link, screensaverImageName: '' });
  };

  private _stopInput = (event: Event): void => {
    event.stopPropagation();
  };

  private _togglePicker(picker: 'image' | 'folder'): void {
    this._picker = this._picker === picker ? null : picker;
  }

  private _closePicker = (): void => {
    this._picker = null;
  };

  private _handlePicked = (event: CustomEvent<MediaPickedDetail>): void => {
    const { id, name } = event.detail;
    if (this._picker === 'image') {
      this._linkInvalid = false;
      this._update({ screensaverImage: id, screensaverImageName: name });
    } else {
      this._update({ slideshowFolder: id, slideshowFolderName: name });
    }
    this._picker = null;
  };

  private _clearImage = (): void => {
    this._linkInvalid = false;
    this._update({ screensaverImage: '', screensaverImageName: '' });
  };

  /** The small picture did not load: a link to an image that does not exist. */
  private _handleThumbError = (): void => {
    const preview = this._preview;
    if (preview?.state !== 'ready') return;
    this._preview = this._prefs.screensaverMode === 'image'
      ? { source: preview.source, state: 'failed' }
      : { ...preview, url: undefined };
  };

  private _showPreview = (): void => {
    window.dispatchEvent(new CustomEvent(WALL_TABLET_PREVIEW_EVENT));
  };

  private _slideChoices(): Choice[] {
    return WALL_TABLET_SLIDE_SECONDS_OPTIONS.map((value) => ({
      value,
      label: value < 60
        ? this._t('kiosk.seconds', { count: value })
        : this._t('kiosk.minutes', { count: value / 60 }),
    }));
  }

  private _minuteChoices(): Choice[] {
    return WALL_TABLET_MINUTE_OPTIONS.map((value) => ({
      value,
      label: value === 0 ? this._t('kiosk.off') : this._t('kiosk.minutes', { count: value }),
    }));
  }

  private _exampleUrl(enable: boolean): string {
    return `${window.location.origin}/${this._segment}/home?${WALL_TABLET_URL_PARAM}=${enable ? 1 : 0}`;
  }

  protected render() {
    const prefs = this._prefs;
    const enabled = prefs.enabled;
    const screensaverOff = !enabled || prefs.screensaverMinutes === 0;
    return html`
      <div class="wall-tablet-settings">
        <div class="row">
          <span class="row-copy">
            <strong id="wall-tablet-enable">${this._t('kiosk.enable')}</strong>
            <small>${this._t('kiosk.enable_description')}</small>
          </span>
          <ha-switch
            aria-labelledby="wall-tablet-enable"
            .checked=${enabled}
            @change=${this._toggleEnabled}
          ></ha-switch>
        </div>

        ${this._renderChoices(
          'return-home',
          this._t('kiosk.return_home'),
          this._t('kiosk.return_home_description'),
          this._minuteChoices(),
          prefs.returnHomeMinutes,
          (value) => this._update({ returnHomeMinutes: value }),
          !enabled
        )}

        ${this._renderChoices(
          'screensaver',
          this._t('kiosk.screensaver'),
          this._t('kiosk.screensaver_description'),
          this._minuteChoices(),
          prefs.screensaverMinutes,
          (value) => this._update({ screensaverMinutes: value }),
          !enabled
        )}

        ${this._renderChoices<WallTabletScreensaverMode>(
          'screensaver-mode',
          this._t('kiosk.screensaver_mode'),
          this._t('kiosk.screensaver_mode_description'),
          [
            { value: 'clock', label: this._t('kiosk.mode_clock') },
            { value: 'image', label: this._t('kiosk.mode_image') },
            { value: 'slideshow', label: this._t('kiosk.mode_slideshow') },
          ],
          prefs.screensaverMode,
          (value) => {
            this._picker = null;
            this._update({ screensaverMode: value });
          },
          screensaverOff
        )}

        ${prefs.screensaverMode === 'image' ? this._renderImageRow(screensaverOff) : nothing}
        ${prefs.screensaverMode === 'slideshow' ? this._renderSlideshowRows(screensaverOff) : nothing}
        ${prefs.screensaverMode === 'clock'
          ? this._renderChoices(
              'dim-level',
              this._t('kiosk.dim_level'),
              this._t('kiosk.dim_level_description'),
              WALL_TABLET_DIM_OPTIONS.map((value) => ({ value, label: `${value}%` })),
              prefs.dimLevel,
              (value) => this._update({ dimLevel: value }),
              screensaverOff
            )
          : this._renderPhotoRows(screensaverOff)}

        <div class="row">
          <span class="row-copy">
            <strong>${this._t('kiosk.preview')}</strong>
            <small>${this._t('kiosk.preview_description')}</small>
          </span>
          <button class="action" type="button" @click=${this._showPreview}>
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            <span>${this._t('kiosk.preview_action')}</span>
          </button>
        </div>

        <div class="note">
          <ha-icon icon="mdi:gesture-tap-hold"></ha-icon>
          <span class="note-copy">
            <strong>${this._t('kiosk.exit_title')}</strong>
            <span>${this._t('kiosk.exit_description')}</span>
          </span>
        </div>

        <div class="note">
          <ha-icon icon="mdi:link-variant"></ha-icon>
          <span class="note-copy">
            <strong>${this._t('kiosk.setup_title')}</strong>
            <span>${this._t('kiosk.setup_description', {
              param: `?${WALL_TABLET_URL_PARAM}=1`,
              param_off: `?${WALL_TABLET_URL_PARAM}=0`,
            })}</span>
            <code>${this._exampleUrl(true)}</code>
          </span>
        </div>
      </div>
    `;
  }

  private _renderImageRow(disabled: boolean) {
    const prefs = this._prefs;
    const fromMedia = isMediaSourceId(prefs.screensaverImage);
    return html`
      <div class="row field-row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong id="wall-tablet-image">${this._t('kiosk.image')}</strong>
          <small>${this._t('kiosk.image_description')}</small>
        </span>
        <div class="field">
          <input
            class="text-input ${this._linkInvalid ? 'is-invalid' : ''}"
            type="text"
            inputmode="url"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-labelledby="wall-tablet-image"
            aria-invalid=${this._linkInvalid ? 'true' : 'false'}
            placeholder="/local/photo.jpg"
            .value=${fromMedia ? '' : prefs.screensaverImage}
            ?disabled=${disabled}
            @input=${this._stopInput}
            @change=${this._handleLinkChange}
          />
          ${this._linkInvalid ? html`<small class="field-error" role="alert">${this._t('kiosk.image_invalid')}</small>` : nothing}
          <div class="field-actions">
            <button
              class="action"
              type="button"
              aria-expanded=${this._picker === 'image' ? 'true' : 'false'}
              ?disabled=${disabled}
              @click=${() => this._togglePicker('image')}
            >
              <ha-icon icon="mdi:folder-image"></ha-icon>
              <span>${this._t('kiosk.choose_image')}</span>
            </button>
            ${prefs.screensaverImage ? html`
              <button class="action quiet" type="button" ?disabled=${disabled} @click=${this._clearImage}>
                ${this._t('common.remove')}
              </button>
            ` : nothing}
          </div>
          ${this._renderChosen(
            fromMedia ? prefs.screensaverImageName || this._t('kiosk.mode_image') : prefs.screensaverImage,
            this._t('kiosk.image_none'),
            this._t('kiosk.image_failed')
          )}
        </div>
      </div>
      ${this._picker === 'image' && !disabled ? this._renderPicker('image') : nothing}
    `;
  }

  private _renderSlideshowRows(disabled: boolean) {
    const prefs = this._prefs;
    const preview = this._preview;
    const count = preview?.state === 'ready' && prefs.slideshowFolder ? preview.count ?? 0 : undefined;
    return html`
      <div class="row field-row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong>${this._t('kiosk.folder')}</strong>
          <small>${this._t('kiosk.folder_description')}</small>
        </span>
        <div class="field">
          <div class="field-actions">
            <button
              class="action"
              type="button"
              aria-expanded=${this._picker === 'folder' ? 'true' : 'false'}
              ?disabled=${disabled}
              @click=${() => this._togglePicker('folder')}
            >
              <ha-icon icon="mdi:folder-image"></ha-icon>
              <span>${this._t('kiosk.choose_folder')}</span>
            </button>
          </div>
          ${this._renderChosen(
            prefs.slideshowFolderName || prefs.slideshowFolder,
            this._t('kiosk.folder_none'),
            this._t('kiosk.folder_failed'),
            count === undefined
              ? undefined
              : count === 0
                ? this._t('kiosk.folder_empty')
                : ddLocalizePlural(this._hass, 'kiosk.photos_found', count)
          )}
        </div>
      </div>
      ${this._picker === 'folder' && !disabled ? this._renderPicker('folder') : nothing}

      ${this._renderChoices(
        'slide-seconds',
        this._t('kiosk.slide_seconds'),
        this._t('kiosk.slide_seconds_description'),
        this._slideChoices(),
        prefs.slideSeconds,
        (value) => this._update({ slideSeconds: value }),
        disabled
      )}

      <div class="row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong id="wall-tablet-shuffle">${this._t('kiosk.shuffle')}</strong>
          <small>${this._t('kiosk.shuffle_description')}</small>
        </span>
        <ha-switch
          aria-labelledby="wall-tablet-shuffle"
          .checked=${prefs.slideshowShuffle}
          ?disabled=${disabled}
          @change=${this._toggle('slideshowShuffle')}
        ></ha-switch>
      </div>
    `;
  }

  /** The settings that the image and the slideshow share. */
  private _renderPhotoRows(disabled: boolean) {
    const prefs = this._prefs;
    return html`
      ${this._renderChoices<WallTabletPhotoFit>(
        'photo-fit',
        this._t('kiosk.photo_fit'),
        this._t('kiosk.photo_fit_description'),
        [
          { value: 'cover', label: this._t('kiosk.fit_cover') },
          { value: 'contain', label: this._t('kiosk.fit_contain') },
        ],
        prefs.photoFit,
        (value) => this._update({ photoFit: value }),
        disabled
      )}

      <div class="row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong id="wall-tablet-photo-clock">${this._t('kiosk.photo_clock')}</strong>
          <small>${this._t('kiosk.photo_clock_description')}</small>
        </span>
        <ha-switch
          aria-labelledby="wall-tablet-photo-clock"
          .checked=${prefs.photoClock}
          ?disabled=${disabled}
          @change=${this._toggle('photoClock')}
        ></ha-switch>
      </div>

      ${this._renderChoices(
        'photo-dim',
        this._t('kiosk.photo_dim'),
        this._t('kiosk.photo_dim_description'),
        WALL_TABLET_PHOTO_DIM_OPTIONS.map((value) => ({ value, label: `${value}%` })),
        prefs.photoDimLevel,
        (value) => this._update({ photoDimLevel: value }),
        disabled
      )}
    `;
  }

  /** The chosen image or folder, with a small picture of it. */
  private _renderChosen(name: string, noneLabel: string, failedLabel: string, detail?: string) {
    if (!name) return html`<div class="chosen is-empty">${noneLabel}</div>`;
    const preview = this._preview;
    const failed = preview?.state === 'failed';
    return html`
      <div class="chosen ${failed ? 'is-failed' : ''}">
        ${preview?.state === 'ready' && preview.url
          ? html`<img class="chosen-thumb" src=${preview.url} alt="" @error=${this._handleThumbError} />`
          : html`<span class="chosen-thumb placeholder"><ha-icon icon=${failed ? 'mdi:image-off-outline' : 'mdi:image-outline'}></ha-icon></span>`}
        <span class="chosen-copy">
          <span class="chosen-name">${name}</span>
          ${failed
            ? html`<small role="alert">${failedLabel}</small>`
            : detail ? html`<small>${detail}</small>` : nothing}
        </span>
      </div>
    `;
  }

  private _renderPicker(mode: 'image' | 'folder') {
    return html`
      <dwains-dashboard-next-media-picker
        class="picker"
        .hass=${this._hass}
        .mode=${mode}
        @dd-media-picked=${this._handlePicked}
        @dd-media-picker-closed=${this._closePicker}
      ></dwains-dashboard-next-media-picker>
    `;
  }

  private _renderChoices<T extends string | number = number>(
    id: string,
    title: string,
    description: string,
    choices: Choice<T>[],
    selected: T,
    onSelect: (value: T) => void,
    disabled: boolean
  ) {
    const titleId = `wall-tablet-${id}`;
    return html`
      <div class="row choice-row ${disabled ? 'is-disabled' : ''}">
        <span class="row-copy">
          <strong id=${titleId}>${title}</strong>
          <small>${description}</small>
        </span>
        <div class="choices" role="radiogroup" aria-labelledby=${titleId} aria-disabled=${disabled ? 'true' : nothing}>
          ${choices.map((choice) => {
            const isSelected = choice.value === selected;
            return html`
              <button
                type="button"
                class="choice ${isSelected ? 'selected' : ''}"
                role="radio"
                aria-checked=${isSelected ? 'true' : 'false'}
                ?disabled=${disabled}
                @click=${() => onSelect(choice.value)}
              >${choice.label}</button>
            `;
          })}
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }

    .wall-tablet-settings {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .choice-row {
      flex-wrap: wrap;
    }

    .row-copy {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: min(100%, 240px);
      flex: 1 1 240px;
    }

    .row-copy strong {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .row-copy small {
      font-size: 13px;
      line-height: 1.4;
      color: var(--secondary-text-color);
    }

    ha-switch {
      flex: 0 0 auto;
    }

    .choices {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .choice {
      min-width: 52px;
      min-height: 36px;
      padding: 0 12px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
    }

    .choice:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }

    .choice:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .choice.selected {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
    }

    .choice:disabled {
      cursor: default;
    }

    .is-disabled .choices,
    .is-disabled .row-copy,
    .is-disabled .field {
      opacity: 0.5;
    }

    /* ---- Image link, media picker and chosen photo ---- */
    .field-row {
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .field {
      flex: 1 1 280px;
      min-width: min(100%, 240px);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .text-input {
      width: 100%;
      box-sizing: border-box;
      min-height: 44px;
      padding: 10px 14px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .text-input::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.8;
    }

    .text-input:focus {
      border-color: var(--primary-color);
    }

    .text-input.is-invalid {
      border-color: var(--error-color, #db4437);
    }

    .field-error {
      color: var(--error-color, #db4437);
      font-size: 13px;
      line-height: 1.4;
    }

    .field-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .action {
      min-height: 40px;
      padding: 0 16px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
    }

    .action ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-color);
    }

    .action:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }

    .action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .action:disabled {
      cursor: default;
    }

    .action.quiet {
      border-color: transparent;
      color: var(--secondary-text-color);
    }

    .chosen {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .chosen.is-empty {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .chosen-thumb {
      width: 72px;
      height: 46px;
      flex: 0 0 auto;
      border-radius: 8px;
      object-fit: cover;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    }

    .chosen-thumb.placeholder {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    .chosen-thumb.placeholder ha-icon {
      --mdc-icon-size: 22px;
    }

    .chosen-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .chosen-name {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chosen-copy small {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
    }

    .chosen.is-failed small {
      color: var(--error-color, #db4437);
    }

    .picker {
      margin: 12px 0 4px;
    }

    .note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
      color: var(--primary-text-color);
    }

    .note + .note {
      margin-top: 8px;
    }

    .note ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
      flex: 0 0 auto;
      margin-top: 1px;
    }

    .note-copy {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      font-size: 13px;
      line-height: 1.45;
      color: var(--secondary-text-color);
    }

    .note-copy strong {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    code {
      display: block;
      margin-top: 4px;
      padding: 6px 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: 12px;
      overflow-wrap: anywhere;
      user-select: all;
      -webkit-user-select: all;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-wall-tablet-settings': DwainsWallTabletSettings;
  }
}
