import { css } from 'lit';

// Page header shared by the room pages (layout card) and the Devices page.
//
// Anatomy:
//   .dd-page-header
//     .dd-page-header-media              optional room picture
//     .dd-page-header-top                back, identity and actions
//     .dd-page-header-strip              optional room tiles and thermostat
//
// Desktop and tablet show the header as a card with everything on one row.
// Phones drop the card, put the back button and actions on the first row and
// the large title below them. Room tiles scroll sideways on phones.
export const pageHeaderStyles = css`
    .dd-page-header,
    .dd-room-compact {
      --ph-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
      --ph-text: var(--primary-text-color, #1c1f24);
      --ph-muted: color-mix(in srgb, var(--ph-text) 66%, transparent);
      --ph-control: color-mix(in srgb, var(--ph-text) 6%, transparent);
      --ph-control-hover: color-mix(in srgb, var(--ph-text) 11%, transparent);
      --ph-accent: var(--domain-color, var(--primary-color, #03a9f4));
      --ph-warning: var(--warning-color, #ff9800);
      --ph-pad-x: 20px;
      --ph-pad-y: 18px;
    }

    .dd-page-header {
      position: relative;
      isolation: isolate;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0 0 20px;
      padding: var(--ph-pad-y) var(--ph-pad-x);
      border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 75%, transparent);
      border-radius: 18px;
      background: var(--ph-surface);
      color: var(--ph-text);
      box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.04),
        0 12px 32px rgba(15, 23, 42, 0.06);
    }

    :host([data-theme-dark]) .dd-page-header {
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.28),
        0 12px 32px rgba(0, 0, 0, 0.24);
    }

    /* Top row */
    .dd-page-header-top {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .dd-page-header-identity {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .dd-page-header-icon {
      width: 48px;
      height: 48px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: color-mix(in srgb, var(--ph-accent) 14%, var(--ph-surface));
      color: var(--ph-accent);
    }

    .dd-page-header-icon ha-icon {
      --mdc-icon-size: 26px;
    }

    .dd-page-header-copy {
      min-width: 0;
    }

    .dd-page-header-title {
      margin: 0;
      color: inherit;
      font-size: clamp(22px, 1.1vw + 14px, 30px);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.012em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* The readings carry their own icon, so they need no separator and wrap
       cleanly on narrow screens. */
    .dd-page-header-subtitle {
      margin-top: 4px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 14px;
      color: var(--ph-muted);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.35;
    }

    .dd-page-header-reading {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--ph-text);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .dd-page-header-reading ha-icon {
      --mdc-icon-size: 17px;
      color: var(--reading-color);
    }

    .dd-page-header-reading.temperature {
      --reading-color: #7c67c7;
    }

    .dd-page-header-reading.humidity {
      --reading-color: #34a6d8;
    }

    /* Round buttons: back, camera, hidden entities, edit */
    .dd-page-header-actions {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .dd-page-header-button {
      position: relative;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      padding: 0;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: var(--ph-control);
      color: var(--ph-text);
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.12s ease;
    }

    .dd-page-header-button:hover {
      background: var(--ph-control-hover);
    }

    .dd-page-header-button:active {
      transform: scale(0.94);
    }

    .dd-page-header-button ha-icon,
    .dd-page-header-button .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .dd-page-header-button.is-active,
    .dd-page-header-button.is-active:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #ffffff);
    }

    .dd-page-header-button.is-warning {
      background: color-mix(in srgb, var(--ph-warning) 16%, transparent);
      color: color-mix(in srgb, var(--ph-warning) 78%, var(--ph-text));
    }

    .dd-page-header-button.is-warning:hover {
      background: color-mix(in srgb, var(--ph-warning) 24%, transparent);
    }

    .dd-page-header-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      box-sizing: border-box;
      min-width: 19px;
      height: 19px;
      padding: 0 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--ph-warning);
      color: #241600;
      font-size: 11px;
      font-weight: 750;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      box-shadow: 0 0 0 2px var(--ph-surface);
    }

    .dd-page-header-button:focus-visible,
    .dd-room-tile:focus-visible,
    .dd-room-tile-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* Room tiles and thermostat */
    .dd-page-header-strip {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 16px;
      min-width: 0;
    }

    /* The tiles take the free space, so the thermostat ends up on the right,
       or at the start of its own line when it wraps. */
    .dd-room-tiles {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }

    .dd-room-tile {
      --tile-color: var(--primary-color);
      --tile-on: #ffffff;
      box-sizing: border-box;
      min-width: 0;
      min-height: 52px;
      padding: 6px 12px 6px 6px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 0;
      border-radius: 14px;
      background: var(--ph-control);
      color: var(--ph-text);
      font: inherit;
      text-align: left;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        transform 0.12s ease;
    }

    button.dd-room-tile:hover {
      background: var(--ph-control-hover);
    }

    button.dd-room-tile:active {
      transform: scale(0.97);
    }

    .dd-room-tile.light {
      --tile-color: #e1a129;
      --tile-on: #2b1c00;
    }

    .dd-room-tile.switch {
      --tile-color: #2f6fd6;
    }

    .dd-room-tile.cover {
      --tile-color: #1494aa;
    }

    .dd-room-tile.fan {
      --tile-color: #2b8fcb;
    }

    .dd-room-tile.climate {
      --tile-color: #34a6d8;
    }

    .dd-room-tile-icon {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      background: color-mix(in srgb, var(--tile-color) 14%, transparent);
      color: var(--tile-color);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }

    .dd-room-tile-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .dd-room-tile-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .dd-room-tile-label {
      font-size: 14px;
      font-weight: 650;
      line-height: 1.2;
      white-space: nowrap;
    }

    .dd-room-tile-state {
      color: var(--ph-muted);
      font-size: 12.5px;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .dd-room-tile-switch {
      position: relative;
      width: 34px;
      height: 20px;
      flex: 0 0 auto;
      margin-left: 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--ph-text) 20%, transparent);
      transition: background-color 0.2s ease;
    }

    .dd-room-tile-switch::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .dd-room-tile.is-on {
      background: color-mix(in srgb, var(--tile-color) 15%, var(--ph-surface));
    }

    button.dd-room-tile.is-on:hover {
      background: color-mix(in srgb, var(--tile-color) 21%, var(--ph-surface));
    }

    .dd-room-tile.is-on .dd-room-tile-icon {
      background: var(--tile-color);
      color: var(--tile-on);
    }

    .dd-room-tile.is-on .dd-room-tile-switch {
      background: var(--tile-color);
    }

    .dd-room-tile.is-on .dd-room-tile-switch::after {
      transform: translateX(14px);
    }

    .dd-room-tile.has-actions {
      padding-right: 6px;
      cursor: default;
    }

    .dd-room-tile-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 6px;
    }

    .dd-room-tile-action {
      width: 36px;
      height: 36px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 10px;
      background: var(--ph-control);
      color: inherit;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition:
        background-color 0.18s ease,
        transform 0.12s ease;
    }

    .dd-room-tile-action:hover {
      background: var(--ph-control-hover);
    }

    .dd-room-tile-action:active {
      transform: scale(0.9);
    }

    .dd-room-tile-action ha-icon {
      --mdc-icon-size: 20px;
    }

    .dd-room-tile-chevron {
      --mdc-icon-size: 20px;
      margin-left: 2px;
      color: var(--ph-muted);
    }

    /* Room picture: the photo fills the card, the controls float on it. */
    .dd-page-header.has-picture {
      --ph-text: #ffffff;
      --ph-control: rgba(255, 255, 255, 0.16);
      --ph-control-hover: rgba(255, 255, 255, 0.26);
      --ph-muted: rgba(255, 255, 255, 0.8);
      border-color: transparent;
      background: #1b2422;
    }

    .dd-page-header.has-picture.text-dark {
      --ph-text: #10141a;
      --ph-control: rgba(255, 255, 255, 0.58);
      --ph-control-hover: rgba(255, 255, 255, 0.74);
      --ph-muted: rgba(16, 20, 26, 0.74);
      background: #e9eef0;
    }

    .dd-page-header-media {
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: inherit;
      background-position: center;
      background-size: cover;
    }

    .dd-page-header-media::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(0deg, rgba(8, 12, 18, 0.62) 0%, rgba(8, 12, 18, 0) 70%),
        linear-gradient(100deg, rgba(8, 12, 18, 0.66) 0%, rgba(8, 12, 18, 0.34) 60%, rgba(8, 12, 18, 0.2) 100%);
    }

    .dd-page-header.text-dark .dd-page-header-media::after {
      background:
        linear-gradient(0deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 70%),
        linear-gradient(100deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.46) 60%, rgba(255, 255, 255, 0.24) 100%);
    }

    .dd-page-header.has-picture .dd-page-header-top {
      flex-wrap: wrap;
      row-gap: 36px;
    }

    .dd-page-header.has-picture .dd-page-header-actions {
      order: 1;
      margin-left: auto;
    }

    .dd-page-header.has-picture .dd-page-header-identity {
      order: 2;
      flex-basis: 100%;
    }

    .dd-page-header.has-picture .dd-page-header-title {
      text-shadow: 0 1px 14px rgba(0, 0, 0, 0.28);
    }

    .dd-page-header.has-picture.text-dark .dd-page-header-title {
      text-shadow: none;
    }

    .dd-page-header.has-picture .dd-page-header-icon {
      background: var(--ph-control);
      color: var(--ph-text);
    }

    .dd-page-header.has-picture .dd-page-header-button,
    .dd-page-header.has-picture .dd-room-tile {
      -webkit-backdrop-filter: blur(16px) saturate(1.3);
      backdrop-filter: blur(16px) saturate(1.3);
    }

    .dd-page-header.has-picture .dd-page-header-badge {
      box-shadow: none;
    }

    .dd-page-header.has-picture .dd-page-header-reading ha-icon {
      color: inherit;
    }

    .dd-page-header.has-picture .dd-room-tile.is-on {
      --ph-text: #10141a;
      --ph-muted: rgba(16, 20, 26, 0.7);
      --ph-control: rgba(16, 20, 26, 0.07);
      --ph-control-hover: rgba(16, 20, 26, 0.12);
      background: rgba(255, 255, 255, 0.94);
    }

    .dd-page-header.has-picture .dd-room-tile:not(.is-on) .dd-room-tile-icon {
      background: var(--ph-control);
      color: var(--ph-text);
    }

    .dd-page-header.has-picture .dd-room-tile-switch {
      background: color-mix(in srgb, var(--ph-text) 30%, transparent);
    }

    .dd-page-header.has-picture .dd-room-tile.is-on .dd-room-tile-switch {
      background: var(--tile-color);
    }

    /* Compact room bar: slides in at the top of the screen once the large
       header has scrolled away on phones. It takes no space in the page, so
       the content never jumps. */
    .dd-room-compact {
      display: none;
    }

    @media (max-width: 768px) {
      .dd-page-header,
      .dd-room-compact {
        --ph-pad-x: 16px;
      }

      .dd-page-header {
        margin: 0 -10px 14px;
        padding: calc(10px + env(safe-area-inset-top, 0px)) var(--ph-pad-x) 14px;
        gap: 14px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      :host([data-theme-dark]) .dd-page-header {
        box-shadow: none;
      }

      .dd-page-header-top {
        flex-wrap: wrap;
        row-gap: 14px;
      }

      .dd-page-header-actions {
        order: 1;
        margin-left: auto;
      }

      .dd-page-header-identity {
        order: 2;
        flex-basis: 100%;
      }

      .dd-page-header-actions.is-content {
        order: 3;
        flex-basis: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: 0;
      }

      .dd-page-header-icon {
        display: none;
      }

      .dd-page-header-title {
        font-size: 28px;
        line-height: 1.1;
        white-space: normal;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .dd-page-header-strip {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .dd-room-tiles {
        flex: 0 0 auto;
        flex-wrap: nowrap;
        margin: 0 calc(var(--ph-pad-x) * -1);
        padding: 2px var(--ph-pad-x);
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-padding-inline: var(--ph-pad-x);
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .dd-room-tiles::-webkit-scrollbar {
        display: none;
      }

      .dd-room-tile {
        flex: 0 0 auto;
        scroll-snap-align: start;
      }

      .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
        width: 100%;
      }

      .dd-page-header.has-picture {
        padding-bottom: 16px;
        border-radius: 0 0 24px 24px;
      }

      .dd-page-header.has-picture .dd-page-header-top {
        row-gap: 72px;
      }

      .dd-room-compact {
        display: block;
        position: sticky;
        top: 0;
        z-index: 90;
        height: 0;
        color: var(--ph-text);
      }

      .dd-room-compact-panel {
        position: absolute;
        top: 0;
        left: -10px;
        right: -10px;
        box-sizing: border-box;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-bottom: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 70%, transparent);
        background: color-mix(in srgb, var(--ph-surface) 86%, transparent);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        opacity: 0;
        transform: translateY(-12px);
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 0.18s ease,
          transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
          visibility 0s linear 0.26s;
      }

      .dd-room-compact.is-visible .dd-room-compact-panel {
        opacity: 1;
        transform: none;
        visibility: visible;
        pointer-events: auto;
        transition:
          opacity 0.18s ease,
          transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
          visibility 0s;
      }

      .dd-room-compact-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 40px;
      }

      .dd-room-compact-title {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .dd-room-compact-title strong {
        overflow: hidden;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dd-room-compact-title span {
        overflow: hidden;
        color: var(--ph-muted);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .dd-room-compact .dd-page-header-button {
        width: 38px;
        height: 38px;
      }

      .dd-room-compact .dd-room-tiles {
        margin: 0 -12px;
        padding: 0 12px 2px;
        scroll-padding-inline: 12px;
      }

      .dd-room-compact .dd-room-tile {
        min-height: 44px;
        padding: 4px 10px 4px 4px;
        gap: 8px;
      }

      .dd-room-compact .dd-room-tile-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }

      .dd-room-compact .dd-room-tile-action {
        width: 32px;
        height: 32px;
      }
    }

    /* Touch screens: the cover buttons inside a tile get a 40px target. */
    @media (pointer: coarse) {
      .dd-room-tile-action,
      .dd-room-compact .dd-room-tile-action {
        width: 40px;
        height: 40px;
      }

      .dd-page-header-button,
      .dd-room-compact .dd-page-header-button {
        width: 42px;
        height: 42px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dd-page-header-button,
      .dd-room-tile,
      .dd-room-tile-icon,
      .dd-room-tile-switch,
      .dd-room-tile-switch::after,
      .dd-room-tile-action,
      .dd-room-compact-panel,
      .dd-room-compact.is-visible .dd-room-compact-panel {
        transition: none;
      }
    }
`;
