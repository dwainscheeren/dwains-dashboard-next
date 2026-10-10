import { LitElement, css, html, nothing } from 'lit';
import { customElement, eventOptions, property } from 'lit/decorators.js';

@customElement('dd-next-popup-shell')
export class DdNextPopupShell extends LitElement {
  @property({ type: Boolean, reflect: true }) public open = false;
  @property() public titleText = '';
  @property() public subtitle = '';
  @property() public icon = 'mdi:information-outline';
  @property() public accent = 'var(--primary-color)';
  @property() public closeLabel = 'Close';
  @property({ type: Boolean }) public wide = false;

  private _touch?: { x: number; y: number; offset: number };
  private _ignoreClickUntil = 0;

  protected override updated(): void {
    const modal = this.renderRoot.querySelector<HTMLDialogElement>('.modal');
    if (this.open && modal && !modal.open) modal.showModal();
  }

  private _scrimPointerDown = (event: PointerEvent): void => {
    // Keep the scrim in place through pointerup/click and prevent focus changes.
    event.preventDefault();
    event.stopPropagation();
  };

  private _scrimClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this._close();
  };

  private _panelClick = (event: Event): void => {
    if (Date.now() < this._ignoreClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  private _touchStart = (event: TouchEvent): void => {
    this._touch = undefined;
    if (!window.matchMedia('(max-width: 768px)').matches || event.touches.length !== 1) return;
    const path = event.composedPath();
    const panel = event.currentTarget as HTMLElement;
    for (const node of path) {
      if (node === panel) break;
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches('button, input, select, textarea, a, [role="button"], [contenteditable="true"]') || node.scrollTop > 0) return;
    }
    const touch = event.touches[0]!;
    this._touch = { x: touch.clientX, y: touch.clientY, offset: 0 };
  };

  @eventOptions({ passive: false })
  private _touchMove(event: TouchEvent): void {
    if (!this._touch) return;
    if (event.touches.length !== 1) {
      this._touchEnd(event);
      return;
    }
    const touch = event.touches[0]!;
    const dy = touch.clientY - this._touch.y;
    const dx = Math.abs(touch.clientX - this._touch.x);
    if (!this._touch.offset && (dy < -8 || dx > 8 && dx > dy)) {
      this._touch = undefined;
      return;
    }
    if (!this._touch.offset && dy <= 8) return;
    event.preventDefault();
    event.stopPropagation();
    this._touch.offset = Math.max(0, dy);
    (event.currentTarget as HTMLElement).style.setProperty('--dd-popup-drag-y', `${this._touch.offset}px`);
  }

  private _touchEnd = (event: TouchEvent): void => {
    const panel = event.currentTarget as HTMLElement;
    const offset = this._touch?.offset || 0;
    this._touch = undefined;
    panel.style.removeProperty('--dd-popup-drag-y');
    if (!offset) return;
    event.preventDefault();
    event.stopPropagation();
    this._ignoreClickUntil = Date.now() + 400;
    if (event.type === 'touchend' && offset >= Math.min(120, panel.clientHeight * .25)) this._close();
  };

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent('dd-close', { bubbles: true, composed: true }));
  };

  private _keydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this._close();
  };

  protected override render() {
    if (!this.open) return nothing;

    return html`
      <dialog class="modal" aria-label=${this.titleText}
        @click=${(event: Event) => event.stopPropagation()}
        @cancel=${(event: Event) => { event.preventDefault(); this._close(); }}>
      <div class="scrim" @pointerdown=${this._scrimPointerDown} @click=${this._scrimClick}></div>
      <section
        class="panel ${this.wide ? 'wide' : ''}"
        role="dialog"
        aria-modal="true"
        aria-label=${this.titleText}
        tabindex="0"
        style=${`--dd-popup-accent: ${this.accent};`}
        @click=${{ handleEvent: this._panelClick, capture: true }}
        @keydown=${this._keydown}
        @touchstart=${this._touchStart}
        @touchmove=${this._touchMove}
        @touchend=${this._touchEnd}
        @touchcancel=${this._touchEnd}
      >
        <div class="drag-grip" aria-hidden="true"><span></span></div>
        <header class="header">
          <div class="heading">
            <span class="icon-tile" aria-hidden="true">
              <ha-icon icon=${this.icon}></ha-icon>
            </span>
            <div class="copy">
              <div class="title">${this.titleText}</div>
              ${this.subtitle ? html`<div class="subtitle">${this.subtitle}</div>` : nothing}
              <slot name="header-extra"></slot>
            </div>
          </div>
          <div class="actions">
            <slot name="actions"></slot>
            <button
              class="icon-button close"
              type="button"
              title=${this.closeLabel}
              aria-label=${this.closeLabel}
              @click=${this._close}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        </header>
        <div class="body"><slot></slot></div>
      </section>
      </dialog>
    `;
  }

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1040;
      display: block;
      pointer-events: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([open]) {
      pointer-events: auto;
    }

    .modal {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      overflow: hidden;
      overscroll-behavior: contain;
    }

    .modal::backdrop { background: transparent; }
    .drag-grip { display: none; }

    .scrim {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, .38);
      backdrop-filter: blur(2px);
      touch-action: none;
    }

    .panel {
      position: absolute;
      left: 50%;
      top: 50%;
      width: min(760px, calc(100vw - 32px));
      max-height: min(86dvh, 760px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translate(-50%, -50%);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 14px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 24px 64px rgba(8, 13, 24, .24);
      outline: none;
    }

    .panel.wide {
      width: min(var(--dd-popup-wide-width, 900px), calc(100vw - 32px));
    }

    .header {
      min-height: 72px;
      padding: 12px 18px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex: 0 0 auto;
      background: var(--card-background-color);
      box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--divider-color) 65%, transparent);
    }

    .heading {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .icon-tile {
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      color: var(--dd-popup-accent);
      background: color-mix(in srgb, var(--dd-popup-accent) 11%, var(--card-background-color));
    }

    .icon-tile ha-icon {
      --mdc-icon-size: 24px;
    }

    .copy {
      min-width: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .title {
      max-width: 100%;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 900;
      line-height: 1.08;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .subtitle {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 650;
      line-height: 1.2;
    }

    .actions {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    ::slotted([slot="header-extra"]) {
      max-width: 100%;
    }

    ::slotted([slot="actions"]) {
      display: inline-flex;
      align-items: center;
    }

    .icon-button {
      width: 38px;
      height: 38px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      background: transparent;
      -webkit-tap-highlight-color: transparent;
    }

    .icon-button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }

    .icon-button ha-icon {
      --mdc-icon-size: 20px;
    }

    .body {
      min-height: 0;
      flex: 1 1 auto;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      background: var(--primary-background-color);
    }

    @media (max-width: 768px) {
      .panel,
      .panel.wide {
        left: 0;
        right: 0;
        top: auto;
        bottom: 0;
        width: 100vw;
        max-width: 100vw;
        max-height: 88dvh;
        transform: translateY(var(--dd-popup-drag-y, 0px));
        border-width: 0;
        border-radius: 24px 24px 0 0;
      }

      .drag-grip {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        flex: 0 0 20px;
        touch-action: none;
      }

      .drag-grip span {
        width: 40px;
        height: 4px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-text-color) 45%, transparent);
      }

      .header {
        min-height: 74px;
        padding: 14px 14px 12px;
      }

      .icon-tile {
        width: 48px;
        height: 48px;
        flex-basis: 48px;
        border-radius: 12px;
      }

      .icon-tile ha-icon {
        --mdc-icon-size: 25px;
      }

      .title {
        font-size: 20px;
      }

      .copy {
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
      }

      .body {
        max-height: calc(88dvh - 94px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
    }
  `;
}

@customElement('dd-next-page-header')
export class DdNextPageHeader extends LitElement {
  @property() public titleText = '';
  @property() public subtitle = '';
  @property() public parentTitle = '';
  @property() public icon = 'mdi:view-dashboard-outline';
  @property() public accent = 'var(--primary-color)';
  @property({ type: Boolean }) public back = false;
  @property() public backLabel = 'Back';
  @property() public backIcon = 'mdi:arrow-left';

  private _back = (): void => {
    this.dispatchEvent(new CustomEvent('dd-back', { bubbles: true, composed: true }));
  };

  protected override render() {
    return html`
      <header class="header" style=${`--dd-page-accent: ${this.accent};`}>
        ${this.back ? html`
          <button class="back" type="button" title=${this.backLabel} aria-label=${this.backLabel} @click=${this._back}>
            <ha-icon icon=${this.backIcon}></ha-icon>
          </button>
        ` : nothing}
        <div class="main">
          <span class="icon"><ha-icon icon=${this.icon}></ha-icon></span>
          <div class="copy">
            <h1>
              ${this.parentTitle ? html`
                <span class="parent-title">${this.parentTitle}</span>
                <ha-icon class="breadcrumb" icon="mdi:chevron-right"></ha-icon>
              ` : nothing}
              <span class="current-title">${this.titleText}</span>
            </h1>
            ${this.subtitle ? html`<p>${this.subtitle}</p>` : nothing}
          </div>
        </div>
        <div class="actions"><slot name="actions"></slot></div>
      </header>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      margin-bottom: 14px;
    }

    .header {
      min-height: 86px;
      padding: 12px 16px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      border-radius: 8px;
      background: linear-gradient(135deg,
        color-mix(in srgb, var(--card-background-color) 97%, var(--dd-page-accent) 3%),
        var(--card-background-color));
      box-shadow: 0 8px 22px rgba(15, 23, 42, .05);
    }

    .back {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      box-shadow: 0 6px 16px rgba(15, 23, 42, .12);
    }

    .back ha-icon {
      --mdc-icon-size: 21px;
    }

    .main {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .icon {
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--dd-page-accent);
      background: color-mix(in srgb, var(--dd-page-accent) 12%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dd-page-accent) 14%, transparent);
    }

    .icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .copy {
      min-width: 0;
    }

    h1 {
      margin: 0;
      min-width: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--primary-text-color);
      font-size: clamp(22px, 2vw, 30px);
      font-weight: 900;
      line-height: 1.05;
      white-space: nowrap;
    }

    .parent-title {
      min-width: 0;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-weight: 700;
      text-overflow: ellipsis;
    }

    .current-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .breadcrumb {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }

    p {
      margin: 3px 0 0;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.2;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }

    @media (max-width: 768px) {
      :host {
        margin: -10px -10px 14px;
      }

      .header {
        min-height: 82px;
        padding: 12px 14px 14px;
        border-radius: 0 0 8px 8px;
        background: linear-gradient(180deg,
          color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
          color-mix(in srgb, var(--card-background-color) 90%, var(--dd-page-accent) 4%) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, .08);
      }

      .back {
        width: 38px;
        height: 38px;
      }

      .main {
        gap: 9px;
      }

      .icon {
        width: 38px;
        height: 38px;
        flex-basis: 38px;
      }

      .icon ha-icon {
        --mdc-icon-size: 21px;
      }

      h1 {
        font-size: 22px;
      }

      .actions {
        gap: 6px;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dd-next-popup-shell': DdNextPopupShell;
    'dd-next-page-header': DdNextPageHeader;
  }
}
