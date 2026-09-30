import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ddLocalize } from '../../utils/localize';

export interface ConfirmDialogOptions {
  hass?: any;
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
  /**
   * Node the dialog is rendered in. Defaults to the host's shadow root. Pass a
   * node inside the modal when the host renders one (for example an ha-dialog),
   * otherwise the confirmation ends up behind the modal and cannot be reached.
   */
  container?: Node;
}

const activeDialogs = new WeakMap<Element, DwainsConfirmDialog>();

function deepActiveElement(): HTMLElement | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement ? active : null;
}

/**
 * Small in-app confirmation (role="alertdialog") shared by the dashboard
 * components. Focus moves into the dialog when it opens, stays trapped while it
 * is open and returns to the element that opened it when it closes.
 */
@customElement('dwains-dashboard-next-confirm-dialog')
export class DwainsConfirmDialog extends LitElement {
  @property({ attribute: false }) public heading = '';
  @property({ attribute: false }) public message = '';
  @property({ attribute: false }) public confirmLabel = '';
  @property({ attribute: false }) public cancelLabel = '';
  @property({ attribute: false }) public destructive = false;

  private _resolve?: (confirmed: boolean) => void;
  private _returnFocus: HTMLElement | null = null;

  constructor() {
    super();
    this.addEventListener('keydown', this._handleKeydown);
  }

  public open(): Promise<boolean> {
    this._returnFocus = deepActiveElement();
    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
      void this.updateComplete.then(() => {
        const selector = this.destructive ? '.button.cancel' : '.button.confirm';
        this.renderRoot.querySelector<HTMLElement>(selector)?.focus();
      });
    });
  }

  public close(confirmed: boolean): void {
    const resolve = this._resolve;
    const returnFocus = this._returnFocus;
    this._resolve = undefined;
    this._returnFocus = null;
    this.remove();
    if (returnFocus?.isConnected) {
      returnFocus.focus({ preventScroll: true });
    }
    resolve?.(confirmed);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Removed from the page without an answer: treat it as cancelled.
    if (this._resolve) {
      const resolve = this._resolve;
      this._resolve = undefined;
      this._returnFocus = null;
      resolve(false);
    }
  }

  private _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(false);
      return;
    }
    if (event.key !== 'Tab') return;

    const buttons = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('button'));
    if (!buttons.length) return;
    const first = buttons[0]!;
    const last = buttons[buttons.length - 1]!;
    const active = (this.renderRoot as ShadowRoot).activeElement as HTMLElement | null;
    const inside = active ? buttons.includes(active) : false;

    if (event.shiftKey && (!inside || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!inside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  };

  protected override render() {
    return html`
      <div class="backdrop" @click=${() => this.close(false)}>
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="title"
          aria-describedby=${this.message ? 'message' : nothing}
          @click=${(event: Event) => event.stopPropagation()}
        >
          <h2 id="title" class="title">${this.heading}</h2>
          ${this.message ? html`<p id="message" class="message">${this.message}</p>` : nothing}
          <div class="actions">
            <button type="button" class="button cancel" @click=${() => this.close(false)}>
              ${this.cancelLabel}
            </button>
            <button
              type="button"
              class="button confirm ${this.destructive ? 'destructive' : ''}"
              @click=${() => this.close(true)}
            >
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: contents;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.48);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: dd-confirm-fade 0.16s ease-out;
    }

    .dialog {
      box-sizing: border-box;
      width: min(420px, calc(100vw - 32px));
      max-height: calc(100vh - 32px);
      overflow: auto;
      padding: 20px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
      text-align: left;
      animation: dd-confirm-scale 0.18s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.25;
    }

    .message {
      margin: 0 0 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-line;
    }

    .title + .actions {
      margin-top: 20px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
    }

    .button {
      min-height: 40px;
      padding: 9px 16px;
      border: none;
      border-radius: 8px;
      font: inherit;
      font-size: 14px;
      font-weight: 650;
      cursor: pointer;
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .button.cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .button.confirm {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .button.confirm.destructive {
      background: var(--error-color, #db4437);
      color: #fff;
    }

    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    @media (pointer: coarse) {
      .button {
        min-height: 44px;
      }
    }

    @keyframes dd-confirm-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes dd-confirm-scale {
      from { transform: scale(0.96); }
      to { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }

      .button {
        transition: none;
      }

      .button:hover {
        transform: none;
      }
    }
  `;
}

/**
 * Ask the user to confirm an action. Resolves with true when confirmed and
 * false when cancelled (Cancel, Escape, a click on the backdrop, or when the
 * dialog is removed). Only one confirmation per host is open at a time.
 */
export function showConfirmDialog(host: HTMLElement, options: ConfirmDialogOptions): Promise<boolean> {
  activeDialogs.get(host)?.close(false);

  const dialog = document.createElement('dwains-dashboard-next-confirm-dialog') as DwainsConfirmDialog;
  dialog.heading = options.title;
  dialog.message = options.message || '';
  dialog.confirmLabel = options.confirmLabel || options.title;
  dialog.cancelLabel = ddLocalize(options.hass, 'common.cancel');
  dialog.destructive = options.destructive === true;

  // Insert before any Lit-rendered content so a re-render of the host never
  // removes the dialog.
  const container = options.container || host.shadowRoot || host;
  const result = dialog.open();
  container.insertBefore(dialog, container.firstChild);
  activeDialogs.set(host, dialog);

  return result.finally(() => {
    if (activeDialogs.get(host) === dialog) activeDialogs.delete(host);
  });
}

/** Cancel the confirmation that is open for this host, if any. */
export function closeConfirmDialog(host: HTMLElement): void {
  activeDialogs.get(host)?.close(false);
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-confirm-dialog': DwainsConfirmDialog;
  }
}
