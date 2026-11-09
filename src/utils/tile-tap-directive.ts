import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import { fireEvent } from '../components/utils/fire-event';
import { TileHoldGesture, isFromNestedControl } from './tile-tap';

export interface TileTapOptions {
  /** Runs on a tap, and on Enter or Space while the tile has focus. */
  tap: () => void;
  /**
   * When set, holding the tile runs this instead of the tap. A right click
   * and the menu key (or Shift+F10) run it too.
   */
  hold?: () => void;
}

/**
 * Tap and hold for a tile with role="button". Controls inside the tile, such
 * as its switch, keep working on their own.
 */
class TileTapDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _options?: TileTapOptions;
  private readonly _gesture = new TileHoldGesture(() => {
    // Home Assistant passes this on to the companion app, which vibrates.
    fireEvent(window, 'haptic', 'medium');
    this._options?.hold?.();
  });

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('tileTap can only be used on an element');
    }
  }

  render(_options: TileTapOptions) {
    return noChange;
  }

  override update(part: ElementPart, [options]: [TileTapOptions]) {
    this._options = options;
    if (!options.hold) this._gesture.cancel();
    if (this._element !== part.element) {
      this._element = part.element as HTMLElement;
      this._listen(this._element);
    }
    return noChange;
  }

  protected override disconnected(): void {
    this._gesture.cancel();
  }

  private _listen(element: HTMLElement): void {
    element.addEventListener('click', this._onClick);
    element.addEventListener('keydown', this._onKeyDown);
    element.addEventListener('pointerdown', this._onPointerDown);
    element.addEventListener('pointermove', this._onPointerMove, { passive: true });
    element.addEventListener('pointerup', this._onPointerEnd);
    element.addEventListener('pointercancel', this._onPointerEnd);
    element.addEventListener('pointerleave', this._onPointerEnd);
    element.addEventListener('contextmenu', this._onContextMenu);
  }

  private _onClick = (event: MouseEvent): void => {
    if (this._gesture.consumeClick()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this._options?.tap();
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    // Keys pressed on a control inside the tile belong to that control.
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this._options?.tap();
  };

  private _onPointerDown = (event: PointerEvent): void => {
    if (!this._options?.hold || !this._element) return;
    if (!event.isPrimary || event.button !== 0 || isFromNestedControl(event, this._element)) {
      this._gesture.cancel();
      return;
    }
    this._gesture.down(event.pointerId, event.clientX, event.clientY);
  };

  private _onPointerMove = (event: PointerEvent): void => {
    this._gesture.move(event.pointerId, event.clientX, event.clientY);
  };

  private _onPointerEnd = (): void => {
    this._gesture.cancel();
  };

  private _onContextMenu = (event: MouseEvent): void => {
    const hold = this._options?.hold;
    if (!hold || !this._element || isFromNestedControl(event, this._element)) return;
    event.preventDefault();
    if (this._gesture.contextMenu()) hold();
  };
}

export const tileTap = directive(TileTapDirective);
