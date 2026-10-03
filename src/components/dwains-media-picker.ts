import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../types/home-assistant';
import { ddLocalize, ddLocalizePlural } from '../utils/localize';
import {
  browseMedia,
  photoFolders,
  photoImages,
  type MediaItem,
} from '../utils/screensaver-media';

export interface MediaPickedDetail {
  id: string;
  /** Readable path, for example "My media / Photos". */
  name: string;
}

interface Crumb {
  /** Empty for the list of media sources. */
  id: string;
  title: string;
}

/**
 * dwains-dashboard-next-media-picker: browse the Home Assistant media sources
 * and pick a folder (`mode="folder"`) or one image (`mode="image"`).
 * Fires `dd-media-picked` with the media id and `dd-media-picker-closed`.
 */
@customElement('dwains-dashboard-next-media-picker')
export class DwainsMediaPicker extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public mode: 'folder' | 'image' = 'folder';

  @state() private _trail: Crumb[] = [{ id: '', title: '' }];
  @state() private _item?: MediaItem;
  @state() private _loading = false;
  @state() private _failed = false;
  private _request = 0;

  connectedCallback(): void {
    super.connectedCallback();
    void this._load();
  }

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, vars);
  }

  private _current(): Crumb {
    return this._trail[this._trail.length - 1]!;
  }

  private async _load(): Promise<void> {
    if (!this.hass) return;
    const request = ++this._request;
    const { id } = this._current();
    this._loading = true;
    this._failed = false;
    try {
      const item = await browseMedia(this.hass, id || undefined);
      if (request !== this._request) return;
      this._item = item;
    } catch {
      if (request !== this._request) return;
      this._item = undefined;
      this._failed = true;
    } finally {
      if (request === this._request) this._loading = false;
    }
  }

  private _open(folder: MediaItem): void {
    this._trail = [...this._trail, { id: folder.media_content_id, title: folder.title }];
    void this._load();
  }

  private _back = (): void => {
    if (this._trail.length <= 1) return;
    this._trail = this._trail.slice(0, -1);
    void this._load();
  };

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent('dd-media-picker-closed', { bubbles: true, composed: true }));
  };

  /** "My media / Photos" for the open folder, optionally with one more name. */
  private _pathName(extra?: string): string {
    const names = this._trail.slice(1).map((crumb) => crumb.title);
    if (extra) names.push(extra);
    return names.filter(Boolean).join(' / ');
  }

  private _pick(id: string, name: string): void {
    this.dispatchEvent(new CustomEvent<MediaPickedDetail>('dd-media-picked', {
      detail: { id, name },
      bubbles: true,
      composed: true,
    }));
  }

  private _useFolder = (): void => {
    const { id } = this._current();
    if (!id) return;
    this._pick(id, this._pathName());
  };

  protected render() {
    const atSources = this._trail.length <= 1;
    const title = atSources ? this._t('kiosk.media_title') : this._current().title;
    const folders = photoFolders(this._item);
    const images = photoImages(this._item);
    const isEmpty = !this._loading && !this._failed && !folders.length && !images.length;

    return html`
      <div class="picker" role="group" aria-label=${this._t('kiosk.media_title')}>
        <div class="picker-head">
          <button
            class="icon-button"
            type="button"
            title=${this._t('common.back')}
            aria-label=${this._t('common.back')}
            ?disabled=${atSources}
            @click=${this._back}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <strong class="picker-title" aria-live="polite">${title}</strong>
          <button
            class="icon-button"
            type="button"
            title=${this._t('common.close')}
            aria-label=${this._t('common.close')}
            @click=${this._close}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <div class="picker-list">
          ${this._loading ? html`<div class="picker-note">${this._t('common.loading')}</div>` : nothing}
          ${this._failed ? html`
            <div class="picker-note">
              <span>${this._t('kiosk.media_error')}</span>
              <button class="text-button" type="button" @click=${() => void this._load()}>${this._t('kiosk.media_retry')}</button>
            </div>
          ` : nothing}
          ${isEmpty ? html`<div class="picker-note">${this._t('kiosk.media_empty')}</div>` : nothing}
          ${!this._loading ? folders.map((folder) => html`
            <button class="picker-row" type="button" @click=${() => this._open(folder)}>
              <ha-icon class="row-icon" icon=${atSources ? 'mdi:folder-multiple-image' : 'mdi:folder'}></ha-icon>
              <span class="row-title">${folder.title}</span>
              <ha-icon class="row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>
          `) : nothing}
          ${!this._loading && this.mode === 'image' ? images.map((image) => html`
            <button
              class="picker-row"
              type="button"
              @click=${() => this._pick(image.media_content_id, this._pathName(image.title))}
            >
              ${image.thumbnail
                ? html`<img class="row-thumb" src=${image.thumbnail} alt="" loading="lazy" />`
                : html`<ha-icon class="row-icon" icon="mdi:image-outline"></ha-icon>`}
              <span class="row-title">${image.title}</span>
            </button>
          `) : nothing}
        </div>

        ${this.mode === 'folder' ? html`
          <div class="picker-foot">
            <span class="picker-count">
              ${atSources || this._loading || this._failed
                ? this._t('kiosk.media_open_folder')
                : ddLocalizePlural(this.hass, 'kiosk.media_images', images.length)}
            </span>
            <button
              class="primary-button"
              type="button"
              ?disabled=${atSources || this._loading || this._failed}
              @click=${this._useFolder}
            >${this._t('kiosk.media_use_folder')}</button>
          </div>
        ` : nothing}
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }

    button {
      font: inherit;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .picker {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: var(--card-background-color);
      overflow: hidden;
    }

    .picker-head {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .picker-title {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-button {
      width: 40px;
      height: 40px;
      padding: 0;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--primary-text-color);
    }

    .icon-button:hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }

    .icon-button:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .icon-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .picker-list {
      display: flex;
      flex-direction: column;
      max-height: min(46vh, 340px);
      padding: 6px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .picker-row {
      min-height: 48px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      text-align: left;
    }

    .picker-row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .row-icon {
      --mdc-icon-size: 22px;
      flex: 0 0 auto;
      color: var(--primary-color);
    }

    .row-thumb {
      width: 44px;
      height: 32px;
      flex: 0 0 auto;
      border-radius: 6px;
      object-fit: cover;
      background: var(--secondary-background-color);
    }

    .row-title {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .row-chevron {
      --mdc-icon-size: 20px;
      flex: 0 0 auto;
      color: var(--secondary-text-color);
    }

    .picker-note {
      padding: 14px 10px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 12px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
    }

    .text-button {
      padding: 0;
      border: 0;
      background: none;
      color: var(--primary-color);
      font-size: 13px;
      font-weight: 600;
    }

    .picker-foot {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px 12px;
      padding: 10px 12px;
      border-top: 1px solid var(--divider-color);
    }

    .picker-count {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .primary-button {
      min-height: 40px;
      padding: 0 18px;
      border: 0;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #ffffff);
      font-size: 14px;
      font-weight: 600;
    }

    .primary-button:disabled {
      opacity: 0.45;
      cursor: default;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-media-picker': DwainsMediaPicker;
  }
}
