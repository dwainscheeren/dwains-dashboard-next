import { css, unsafeCSS } from 'lit';
import { getDomainColor } from '../../utils/icons';

// Styles for dwains-dashboard-next-layout-card, kept apart from the component logic.
export const layoutCardStyles = css`
    :host {
      display: block;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .home-status-card,
    .status-card-compact,
    .mobile-area-card,
    .house-person-mini,
    .person-card,
    .favorite-card-wrapper,
    .favorite-quick-action,
    .mobile-domain-master,
    .mobile-layout-toggle,
    .mobile-entity-card,
    .mobile-entity-action,
    .mobile-cover-action,
    .mobile-entity-toggle,
    .dd-add-card,
    .dd-custom-card-wrap.editing {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    /* Visible keyboard focus for cards and chips that act as buttons. */
    .status-card-compact:focus-visible,
    .home-status-card:focus-visible,
    .weather-compact:focus-visible,
    .welcome-weather:focus-visible,
    .welcome-alarm:focus-visible,
    .area-light-toggle:focus-visible,
    .mobile-area-card:focus-visible,
    .mobile-entity-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .dd-static-icon {
      width: 20px;
      height: 20px;
      display: block;
      flex: 0 0 auto;
      fill: currentColor;
      pointer-events: none;
    }

    .mobile-area-card,
    .home-camera-card,
    .home-summary-card,
    .home-status-card,
    .favorite-card-wrapper {
      contain: layout style paint;
    }

    .mobile-home-section,
    .home-camera-section,
    .home-status-section,
    .home-todos-section,
    .home-custom-cards-section,
    .home-favorites-section,
    .home-summaries-section,
    .mobile-domain-group {
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    :host {
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container {
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
    .layout-container.sidebar-resizing * {
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar {
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content {
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar {
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar {
      transition: none;
    }

    .sidebar-resize-handle {
      flex: 0 0 10px;
      width: 10px;
      align-self: stretch;
      margin-left: -5px;
      margin-right: -5px;
      position: relative;
      z-index: 4;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    .sidebar-resize-handle::before {
      content: '';
      position: absolute;
      top: 14px;
      bottom: 14px;
      left: 4px;
      width: 2px;
      border-radius: 999px;
      background: transparent;
      transition: background 0.16s ease, box-shadow 0.16s ease;
    }

    .sidebar-resize-handle:hover::before,
    .sidebar-resize-handle:focus-visible::before,
    .layout-container.sidebar-resizing .sidebar-resize-handle::before {
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible {
      outline: none;
    }

    .sidebar-collapse-toggle {
      position: absolute;
      top: 50%;
      left: calc(var(--area-sidebar-width) - 17px);
      z-index: 6;
      width: 34px;
      height: 54px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      color: var(--primary-text-color);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        top 0.16s ease,
        left 0.16s ease,
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .sidebar-collapse-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed {
      left: 0;
      top: 50%;
      width: 34px;
      min-width: 34px;
      height: 54px;
      padding: 0;
      border-left: 0;
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, var(--card-background-color) 98%, transparent);
      transform: translateY(-50%);
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
    }

    .sidebar-collapse-label {
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label {
      display: inline;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header {
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact {
      padding: 8px 16px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date {
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 4px 12px;
      border: 0;
      background: var(--secondary-background-color);
      color: inherit;
      font: inherit;
      text-align: left;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon {
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact {
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section {
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar {
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 60px;
      position: relative;
    }

    .status-card-compact:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .status-card-title-compact {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('light'))}) 15%, transparent);
    }

    .status-card-compact.light ha-icon {
      color: var(--status-color, ${unsafeCSS(getDomainColor('light'))});
    }

    .status-card-compact.switch .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('switch'))}) 15%, transparent);
    }

    .status-card-compact.switch ha-icon {
      color: var(--status-color, ${unsafeCSS(getDomainColor('switch'))});
    }

    .status-card-compact.binary_sensor .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('sensor'))}) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon {
      color: var(--status-color, ${unsafeCSS(getDomainColor('sensor'))});
    }

    .status-card-compact.person .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('sensor'))}) 15%, transparent);
    }

    .status-card-compact.person ha-icon {
      color: var(--status-color, ${unsafeCSS(getDomainColor('sensor'))});
    }

    .status-card-compact.wattage .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${unsafeCSS(getDomainColor('energy'))}) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon {
      color: var(--status-color, ${unsafeCSS(getDomainColor('energy'))});
    }

    /* Header Expand Button */
    .header-expand-button {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }

    .header-expand-button:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after {
      content: attr(data-extra-count);
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    /* Area List */
    .area-list {
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section {
      margin-bottom: 16px;
    }

    .floor-header {
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      height: 125px;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      min-width: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button {
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture {
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark {
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .area-button.has-picture:hover .area-background {
      opacity: 0.8;
    }

    /* Sidebar items are a container with a full-size select button. Other
       controls in the item (light toggle, notification shortcut) are siblings
       of that button and are never nested inside it. */
    .area-button-action {
      position: absolute;
      inset: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: inherit;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .area-button-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -3px;
    }

    @supports selector(:has(*)) {
      .area-button-action:focus-visible {
        outline: none;
      }

      .area-button:has(> .area-button-action:focus-visible) {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .area-button.selected:has(> .area-button-action:focus-visible) {
        outline-color: var(--primary-text-color);
      }
    }

    /* Clicks on the item content fall through to the select button. */
    .area-button > :not(.area-button-action),
    .area-button::before,
    .area-button::after {
      pointer-events: none;
    }

    .area-button .area-light-toggle,
    .area-button .home-notification-shortcut {
      pointer-events: auto;
    }

    /* Area items used to be native buttons; keep the typography they had. */
    .area-button:not(.home-button) {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: normal;
    }

    .area-light-toggle {
      position: relative;
      margin: 0;
      font-family: inherit;
      line-height: inherit;
    }

    @media (pointer: coarse) {
      /* At least a 44px hit area around the small light badge on touch. */
      .area-light-toggle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        min-width: 44px;
        height: 44px;
        transform: translate(-50%, -50%);
      }
    }

    /* Area content structure */
    .area-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
    .area-button.has-picture .area-sensors {
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon {
      position: absolute;
      left: -25px;
      bottom: -25px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-main-icon {
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon {
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info {
      flex: 1;
    }

    .area-menu-chevron {
      display: none;
    }

    .home-notification-shortcut {
      box-sizing: border-box;
      position: relative;
      z-index: 2;
      min-width: 42px;
      height: 28px;
      margin-left: auto;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      cursor: pointer;
      color: #dc2626;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        inset 0 0 0 1px rgba(220, 38, 38, 0.08),
        0 6px 14px rgba(220, 38, 38, 0.1);
    }

    .home-notification-shortcut ha-icon {
      --mdc-icon-size: 15px;
    }

    .home-notification-count {
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e13f3f;
      color: #ffffff;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors {
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--error-color);
      color: var(--text-primary-color);
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      /* Set while the bottom navigation is shown on wide screens (wall tablet mode). */
      padding-bottom: var(--dd-next-bottom-nav-space, 16px);
    }

    .content-area.settings-content-area {
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view {
      /* Distance of the save bar from the bottom of the screen. */
      --dd-settings-bar-bottom: var(--dd-next-bottom-nav-space, 16px);
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 calc(24px + var(--dd-next-bottom-nav-space, 0px));
      box-sizing: border-box;
    }

    .settings-page-header {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 16px;
      margin: 0 0 16px;
      padding: 16px 18px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
          color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color)) 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
    }

    .settings-page-back,
    .settings-primary {
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-back ha-icon {
      --mdc-icon-size: 22px;
    }

    .settings-page-title {
      min-width: 0;
    }

    .settings-page-title h1 {
      margin: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }

    .settings-page-title p {
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-primary {
      min-height: 40px;
      padding: 0 22px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-page-editor {
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor {
      display: block;
    }

    .settings-save-bar {
      position: sticky;
      bottom: var(--dd-settings-bar-bottom);
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 14px 0 0;
      padding: 8px 8px 8px 16px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
      backdrop-filter: blur(18px) saturate(170%);
      -webkit-backdrop-filter: blur(18px) saturate(170%);
    }

    .settings-save-status {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
    }

    .settings-save-text {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .settings-save-dot {
      flex: 0 0 auto;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--success-color, #43a047);
    }

    .settings-save-bar.is-dirty .settings-save-status {
      color: var(--primary-text-color);
    }

    .settings-save-bar.is-dirty .settings-save-dot {
      background: var(--warning-color, #ff9800);
    }

    .settings-save-bar.is-saving .settings-save-dot {
      background: var(--primary-color);
      animation: dd-settings-saving 1s ease-in-out infinite;
    }

    .settings-save-bar.is-error {
      border-radius: 18px;
      border-color: color-mix(in srgb, var(--error-color) 40%, transparent);
    }

    .settings-save-bar.is-error .settings-save-status {
      color: var(--error-color);
    }

    .settings-save-bar.is-error .settings-save-dot {
      background: var(--error-color);
    }

    .settings-save-bar .settings-primary {
      flex: 0 0 auto;
    }

    @keyframes dd-settings-saving {
      50% { opacity: 0.3; }
    }

    @media (prefers-reduced-motion: reduce) {
      .settings-save-bar.is-saving .settings-save-dot {
        animation: none;
      }
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Wall tablet mode: press and hold these to open the wall tablet menu. */
    [data-dd-wall-tablet-hold] {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Home View */
    .home-view {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome {
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content {
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-user {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar {
      border: 0;
      padding: 0;
      display: inline-flex;
      width: 52px;
      height: 52px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      appearance: none;
      -webkit-appearance: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border-radius: 999px;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.1),
        0 0 0 3px rgba(255, 255, 255, 0.72);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .welcome-avatar:hover {
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon {
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-avatar-initials {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0;
    }

    .welcome-copy {
      min-width: 0;
    }

    .welcome-text {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .welcome-greeting {
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name {
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title {
      display: none;
    }

    .welcome-return {
      display: block;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action {
      position: relative;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .welcome-action:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-action ha-icon {
      --mdc-icon-size: 22px;
    }

    .welcome-action:active {
      transform: scale(0.96);
    }

    .welcome-action-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--error-color);
      color: #fff;
      font-size: 10px;
      font-weight: 850;
      line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .welcome-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time {
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 20px;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed {
      background: var(--error-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-disarmed {
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered {
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon {
      --mdc-icon-size: 18px;
    }

    .alarm-text {
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .welcome-weather {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 8px 16px;
      border: 0;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font: inherit;
      text-align: left;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon {
      --mdc-icon-size: 20px;
    }

    .weather-temp {
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label {
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome {
        text-align: left;
        margin: -10px -10px 16px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      }

      .welcome-content {
        padding: 0;
      }

      .welcome-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user {
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar {
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-avatar-initials {
        font-size: 14px;
      }

      .welcome-text {
        display: block;
      }

      .welcome-greeting,
      .welcome-name {
        display: none;
      }

      .welcome-title {
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return {
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section {
        display: none;
      }

      .welcome-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-subheader {
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar {
        display: none;
      }

      .welcome-alarm,
      .welcome-weather {
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
      .weather-temp {
        font-size: 15px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome {
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header {
        gap: 10px;
      }

      .welcome-avatar {
        width: 36px;
        height: 36px;
      }

      .welcome-title {
        font-size: 14px;
      }

      .welcome-return {
        font-size: 11px;
      }

      .welcome-action {
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
      .welcome-weather {
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
      .weather-temp {
        font-size: 14px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    /* Home Status Cards */
    .home-status-section {
      margin-bottom: 48px;
    }

    .home-status-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon {
      --mdc-icon-size: 20px;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-camera-section {
      --home-section-color: #ef4444;
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section {
      --home-section-color: #f59e0b;
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-todos-section {
      --home-section-color: #7c3aed;
      margin-bottom: 36px;
    }

    .home-todos-section .home-status-heading ha-icon {
      color: #7c3aed;
      background: color-mix(in srgb, #7c3aed 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #7c3aed 8%, transparent);
    }

    .home-todos-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-todo-card,
    .home-todo-card dwains-dashboard-next-card-host {
      display: block;
      min-width: 0;
    }

    .home-custom-cards-section {
      --home-section-color: #0ea5a8;
      margin-bottom: 36px;
    }

    .home-custom-cards-section .home-status-heading ha-icon {
      color: #0ea5a8;
      background: color-mix(in srgb, #0ea5a8 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #0ea5a8 20%, transparent);
    }

    .home-custom-cards-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-custom-card,
    .home-custom-card dwains-dashboard-next-card-host {
      display: block;
      min-width: 0;
    }

    /* Scenes & scripts: compact chips that run a scene or script on tap. */
    .home-scenes-section {
      --home-section-color: #db2777;
      position: relative;
      margin-bottom: 36px;
    }

    .home-scenes-section .home-status-heading ha-icon {
      color: var(--home-section-color);
      background: color-mix(in srgb, var(--home-section-color) 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--home-section-color) 8%, transparent);
    }

    .home-scenes-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .home-scene-chip {
      --scene-color: var(--home-section-color, var(--primary-color));
      appearance: none;
      box-sizing: border-box;
      min-width: 0;
      max-width: 280px;
      min-height: 56px;
      padding: 8px 16px 8px 8px;
      display: inline-flex;
      align-items: center;
      gap: 11px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 12px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-scene-chip:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--scene-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--scene-color) 13%, transparent);
    }

    .home-scene-chip:active:not(:disabled) {
      transform: scale(0.97);
    }

    .home-scene-chip:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--scene-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-scene-chip:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: none;
    }

    .home-scene-chip:disabled .home-scene-icon {
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    }

    .home-scene-chip.is-pending {
      cursor: progress;
    }

    .home-scene-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 9px;
      color: var(--scene-color);
      background: color-mix(in srgb, var(--scene-color) 14%, transparent);
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
    }

    .home-scene-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-scene-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-scene-name {
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-scene-meta {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .home-scene-meta-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Waiting for Home Assistant: the icon breathes. */
    .home-scene-chip.is-pending .home-scene-icon {
      animation: dd-scene-pending 0.9s ease-in-out infinite;
    }

    /* Done: a short green check. */
    .home-scene-chip.is-success {
      border-color: color-mix(in srgb, var(--success-color, #43a047) 45%, transparent);
    }

    .home-scene-chip.is-success .home-scene-icon {
      color: #ffffff;
      background: var(--success-color, #43a047);
      animation: dd-scene-done 0.3s ease-out;
    }

    .home-scene-chip.is-success .home-scene-meta {
      color: var(--success-color, #43a047);
    }

    /* A script that is still running. */
    .home-scene-chip.is-running .home-scene-icon {
      color: #ffffff;
      background: var(--scene-color);
    }

    .home-scene-chip.is-running .home-scene-meta {
      color: var(--scene-color);
    }

    .home-scene-running-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: currentColor;
      animation: dd-scene-running 1.2s ease-in-out infinite;
    }

    @keyframes dd-scene-pending {
      50% { transform: scale(0.88); opacity: 0.6; }
    }

    @keyframes dd-scene-done {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }

    @keyframes dd-scene-running {
      50% { opacity: 0.25; }
    }

    @media (prefers-reduced-motion: reduce) {
      .home-scene-chip.is-pending .home-scene-icon,
      .home-scene-chip.is-success .home-scene-icon,
      .home-scene-running-dot {
        animation: none;
      }

      .home-scene-chip.is-pending .home-scene-icon {
        opacity: 0.6;
      }

      .home-scene-chip:hover:not(:disabled),
      .home-scene-chip:active:not(:disabled) {
        transform: none;
      }
    }

    :host([data-theme-dark]) .home-scene-chip {
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
          color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 12px 26px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    :host([data-theme-dark]) .home-scene-chip:not(.is-running, .is-success, :disabled) .home-scene-icon {
      background: color-mix(in srgb, var(--scene-color) 20%, transparent);
    }

    .dd-visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    .home-summary-list {
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card {
      appearance: none;
      width: 100%;
      min-height: 68px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 13px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-summary-card:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active {
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      color: var(--summary-color);
      background: color-mix(in srgb, var(--summary-color) 14%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-summary-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card {
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      display: flex;
      align-items: stretch;
      padding: 0;
      background: color-mix(in srgb, var(--primary-text-color) 12%, var(--card-background-color));
      color: #ffffff;
      cursor: pointer;
      text-align: left;
      box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .home-camera-card:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
    .home-camera-placeholder {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon {
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background:
        linear-gradient(180deg,
          rgba(7, 11, 18, 0) 0%,
          rgba(7, 11, 18, 0.34) 42%,
          rgba(7, 11, 18, 0.84) 100%);
      pointer-events: none;
    }

    .home-camera-content {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
    .home-camera-count {
      min-width: 36px;
      height: 36px;
      border-radius: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      backdrop-filter: blur(12px);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }

    .home-camera-area-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-count {
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon {
      --mdc-icon-size: 14px;
    }

    .home-camera-copy {
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name {
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta {
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      font-weight: 720;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-home-section,
    .mobile-section-heading {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas {
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card {
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 156px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 14px 30px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .layout-container.sidebar-collapsed .mobile-area-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture {
      min-height: 176px;
      color: var(--mobile-area-picture-text-color, #ffffff);
      border-color: rgba(255, 255, 255, 0.16);
      background: #182044;
      --mobile-area-picture-text-color: #ffffff;
      --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --mobile-area-picture-overlay:
        linear-gradient(180deg, rgba(12, 18, 32, 0.02) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.84) 100%),
        linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
    }

    .layout-container.sidebar-collapsed .mobile-area-picture {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
    .layout-container.sidebar-collapsed .mobile-area-copy {
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .layout-container.sidebar-collapsed .mobile-area-icon {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 13%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon {
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon {
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge {
      min-width: 25px;
      height: 25px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 999px;
      color: var(--area-badge-color, var(--primary-color));
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
      font-size: 11px;
      font-weight: 850;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge {
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name {
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta {
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 56%, transparent);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,
    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section {
      margin-bottom: 32px;
    }

    .person-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card {
      --person-color: #8a94a6;
      --person-bg: color-mix(in srgb, var(--person-color) 8%, var(--card-background-color));
      position: relative;
      min-height: 98px;
      padding: 16px 18px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 18px;
      background:
        radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--person-color) 15%, transparent), transparent 42%),
        var(--person-bg);
      cursor: pointer;
      box-shadow:
        0 16px 34px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px rgba(255, 255, 255, 0.34);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
    }

    .person-card::after {
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: var(--person-color);
      opacity: 0.34;
    }

    .person-card.home {
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away {
      --person-color: ${unsafeCSS(getDomainColor('alarm_control_panel'))};
      --person-bg: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 9%, var(--card-background-color));
    }

    .person-card.unknown {
      --person-color: ${unsafeCSS(getDomainColor('sensor'))};
      --person-bg: color-mix(in srgb, ${unsafeCSS(getDomainColor('sensor'))} 8%, var(--card-background-color));
    }

    .person-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active {
      transform: scale(0.988);
    }

    .person-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar {
      width: 64px;
      height: 64px;
      border-radius: 22px;
      overflow: hidden;
      background: color-mix(in srgb, var(--person-color) 14%, var(--secondary-background-color));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid color-mix(in srgb, var(--person-color) 26%, rgba(255, 255, 255, 0.84));
      box-shadow: 0 12px 24px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon {
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator {
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 26px;
      height: 26px;
      background: var(--person-color);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-background-color);
      box-shadow: 0 8px 18px color-mix(in srgb, var(--person-color) 26%, transparent);
    }

    .person-home-indicator ha-icon {
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info {
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status {
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 6px;
      min-height: 27px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--person-color) 12%, transparent);
      color: var(--person-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status ha-icon {
      --mdc-icon-size: 15px;
    }

    .person-details {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 7px;
      align-items: flex-end;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-left: auto;
      max-width: 170px;
    }

    .person-battery,
    .person-distance {
      display: flex;
      align-items: center;
      gap: 5px;
      min-height: 28px;
      font-size: 12px;
      font-weight: 800;
      color: color-mix(in srgb, var(--primary-text-color) 72%, transparent);
      background: rgba(255, 255, 255, 0.62);
      padding: 0 9px;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .person-battery ha-icon,
    .person-distance ha-icon {
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon {
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"] {
      color: var(--error-color);
    }

    .person-distance ha-icon {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card {
        padding: 16px;
      }

      .person-avatar {
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon {
        --mdc-icon-size: 36px;
      }

      .person-name {
        font-size: 16px;
      }

      .person-status {
        font-size: 13px;
      }

      .person-details {
        gap: 8px;
      }

      .person-battery,
      .person-distance {
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card {
      background: var(--card-background-color);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
    }

    .home-status-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .home-status-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before {
      opacity: 1;
    }

    .home-status-card .status-card-icon {
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .home-status-card .status-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges {
      position: absolute;
      top: 5px;
      right: 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: calc(59% - 24px);
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;
    }

    .info-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .info-badge.light {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('light'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('light'))});
    }

    .info-badge.switch {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('switch'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('switch'))});
    }

    .info-badge.climate {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('climate'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('climate'))});
    }

    .info-badge.media_player {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('media_player'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('media_player'))});
    }

    .info-badge.cover {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('camera'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('camera'))});
    }

    .info-badge.fan {
      background: color-mix(in srgb, var(--badge-color, #2b8fcb) 10%, var(--card-background-color));
      color: var(--badge-color, #2b8fcb);
    }

    .info-badge.motion {
      background: color-mix(in srgb, var(--badge-color, ${unsafeCSS(getDomainColor('alarm_control_panel'))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${unsafeCSS(getDomainColor('alarm_control_panel'))});
    }

    .info-badge.alerts {
      background: color-mix(in srgb, var(--error-color) 10%, var(--card-background-color));
      color: var(--error-color);
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge {
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon {
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count {
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host {
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Entities Section */
    .entities-section {
      display: grid;
      gap: 16px;
    }

    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
    .light-entity-card,
    .motion-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    .mobile-area-overview,
    .mobile-entities-section {
      display: none;
    }

    .area-view .mobile-entities-section {
      display: grid;
      position: relative;
      z-index: 2;
    }

    .mobile-entities-section {
      gap: 22px;
    }

    .mobile-domain-group {
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group.group-editing {
      border-radius: 8px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, background-color 0.16s ease;
    }

    .mobile-domain-group.group-dragging {
      opacity: 0.46;
    }

    .mobile-domain-group.group-drag-over {
      outline: 2px solid var(--primary-color);
      outline-offset: 7px;
      background: color-mix(in srgb, var(--primary-color) 5%, transparent);
    }

    .mobile-domain-group:not(.menu-open) {
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open {
      z-index: 1200;
    }

    .mobile-domain-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-domain-header-actions {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
    }

    .mobile-domain-order-button,
    .mobile-domain-drag-handle {
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent);
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .mobile-domain-drag-handle {
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-drag-handle:active {
      cursor: grabbing;
    }

    .mobile-domain-order-button:disabled {
      opacity: 0.28;
      cursor: default;
    }

    .mobile-domain-order-button ha-icon,
    .mobile-domain-drag-handle ha-icon {
      --mdc-icon-size: 18px;
    }

    .mobile-layout-toggle {
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 72%, #ffffff);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-layout-toggle.active {
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active {
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-layout-toggle.static {
      cursor: default;
      pointer-events: none;
    }

    /* Home section headings: the section icon, then the tools at the end. */
    .mobile-section-icon {
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 999px;
      color: var(--home-section-color, var(--primary-color));
      background: color-mix(in srgb, var(--home-section-color, var(--primary-color)) 12%, transparent);
    }

    .mobile-section-icon ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-section-tools {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .mobile-section-toggle {
      appearance: none;
      width: 28px;
      height: 28px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-section-toggle:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      color: var(--primary-text-color);
    }

    .mobile-section-toggle:active {
      transform: scale(0.94);
    }

    .mobile-section-toggle:focus-visible,
    .mobile-section-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .mobile-section-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .mobile-domain-title-copy {
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-master {
      --mobile-domain-accent: var(--primary-color);
      min-width: 58px;
      height: 30px;
      padding: 0 5px 0 7px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-master.domain-light {
      --mobile-domain-accent: #e89a17;
    }

    .mobile-domain-master.domain-switch,
    .mobile-domain-master.domain-input_boolean {
      --mobile-domain-accent: #3275d6;
    }

    .mobile-domain-master.domain-cover {
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master.domain-fan {
      --mobile-domain-accent: #2d9d79;
    }

    .mobile-domain-master.domain-lock {
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master.active {
      border-color: color-mix(in srgb, var(--mobile-domain-accent) 42%, transparent);
      background: color-mix(in srgb, var(--mobile-domain-accent) 11%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master:active {
      transform: scale(0.94);
    }

    .mobile-domain-master ha-icon {
      --mdc-icon-size: 16px;
    }

    .mobile-domain-master-track {
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      transition: background-color 0.18s ease;
    }

    .mobile-domain-master-track::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .mobile-domain-master.active .mobile-domain-master-track {
      background: var(--mobile-domain-accent);
    }

    .mobile-domain-master.active .mobile-domain-master-track::after {
      transform: translateX(10px);
    }

    .mobile-domain-master-actions {
      --mobile-domain-accent: var(--primary-color);
      height: 30px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      z-index: 1202;
    }

    .mobile-domain-master-actions.domain-cover {
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master-actions.domain-lock {
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master-action {
      width: 34px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-domain-master-action + .mobile-domain-master-action {
      border-left: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .mobile-domain-master-action:hover,
    .mobile-domain-master-action.active {
      background: color-mix(in srgb, var(--mobile-domain-accent) 12%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master-action:active {
      transform: scale(0.88);
    }

    .mobile-domain-master-action ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-entity-rail {
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar {
      display: none;
    }

    .mobile-entities-section.layout-grid {
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      contain: layout style;
      flex: 0 0 164px;
      min-width: 0;
      min-height: 128px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      scroll-snap-align: start;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .mobile-entity-replacement-card {
      box-sizing: border-box;
      flex: 0 0 260px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-replacement-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-todo-list-card {
      box-sizing: border-box;
      flex: 0 0 min(100%, 520px);
      width: min(100%, 520px);
      min-width: min(100%, 320px);
      scroll-snap-align: start;
    }

    .mobile-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-entities-section.layout-grid .mobile-entity-replacement-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-todo-list-card {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-card:active {
      transform: scale(0.985);
      }

      .mobile-entity-card.is-active {
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
      }

      .mobile-entity-card.is-unavailable {
        opacity: 0.62;
      }

    .mobile-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .mobile-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

      .mobile-entity-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .mobile-entity-action {
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border: 0;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease,
          opacity 0.18s ease;
      }

      .mobile-entity-action:active {
        transform: scale(0.94);
      }

      .mobile-entity-action:disabled {
        opacity: 0.36;
        cursor: not-allowed;
      }

      .mobile-entity-toggle {
        width: 38px;
        height: 22px;
        justify-content: flex-start;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.07),
          0 4px 10px rgba(15, 23, 42, 0.08);
      }

    .mobile-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
      }

      .mobile-entity-card.is-active .mobile-entity-toggle {
        background: var(--entity-color);
      }

    .mobile-entity-card.is-active .mobile-entity-toggle::before {
      transform: translateX(16px);
    }

      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .mobile-lock-action.is-unlocked {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-entity-more ha-icon,
      .mobile-scene-action ha-icon,
      .mobile-lock-action ha-icon {
        --mdc-icon-size: 17px;
      }

      .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 6px 14px rgba(15, 23, 42, 0.08);
      }

      .mobile-cover-action {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        background: transparent;
      }

      .mobile-cover-action.active {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
      }

      .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 30px;
        padding: 3px;
        gap: 2px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 24px;
        height: 24px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 15px;
      }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-card {
          min-height: 138px;
          padding: 12px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top {
          gap: 6px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-icon {
          width: 34px;
          height: 34px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-actions {
          min-height: 28px;
          padding: 2px;
          gap: 1px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action {
          width: 23px;
          height: 23px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
          --mdc-icon-size: 14px;
        }
      }

    .mobile-entity-meta {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

      .mobile-entity-name {
        margin-top: 3px;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 900;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .mobile-entity-status {
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-content {
        min-width: 0;
      }

      .mobile-entity-card.has-inline-select {
        min-height: 170px;
        justify-content: flex-start;
        gap: 10px;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-content {
        margin-top: auto;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-status {
        display: none;
      }

      .mobile-entity-select {
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select {
        width: 100%;
        height: 34px;
        padding: 0 34px 0 12px;
        border: 0;
        border-radius: 999px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--entity-color) 10%, var(--secondary-background-color));
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        line-height: 34px;
        cursor: pointer;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 16%, transparent),
          0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .mobile-entity-select select:focus {
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider {
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page {
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .dd-add-page:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon { --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card { margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host { display: block; }

    /* Area custom card slots */
    .dd-custom-section {
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain {
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing {
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }

    .dd-custom-slot-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      container-type: inline-size;
    }

    .dd-custom-grid > .dd-custom-card-wrap,
    .dd-custom-grid > .dd-add-card {
      --dd-card-default-column: span 4;
      grid-column: var(--dd-card-grid-column, var(--dd-card-default-column));
      min-height: var(--dd-card-grid-min-height, 0);
    }

    .dd-custom-card-wrap {
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing {
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-generated-card-wrap {
      display: contents;
    }

    .dd-generated-card-wrap.editing {
      position: relative;
      display: block;
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
      cursor: grab;
      outline: 1px dashed color-mix(in srgb, var(--primary-color) 38%, var(--divider-color));
      outline-offset: 2px;
      border-radius: 12px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, transform 0.16s ease;
    }

    .dd-generated-card-wrap.editing > .mobile-entity-card,
    .dd-generated-card-wrap.editing > .mobile-entity-replacement-card,
    .dd-generated-card-wrap.editing > .mobile-todo-list-card {
      width: 100%;
      min-width: 0;
      pointer-events: none;
    }

    .dd-generated-card-wrap.editing.is-hidden > :not(.dd-generated-card-toolbar) {
      opacity: 0.38;
      filter: saturate(0.45);
    }

    .dd-generated-card-wrap.editing.dragging {
      opacity: 0.42;
      cursor: grabbing;
    }

    .dd-generated-card-wrap.editing.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 14%, transparent);
      transform: translateY(-2px);
    }

    .dd-generated-card-toolbar {
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 6;
      display: flex;
      gap: 4px;
      padding: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dd-generated-card-toolbar button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .dd-generated-card-toolbar button:first-child {
      color: var(--primary-color);
      cursor: grab;
    }

    .dd-generated-card-toolbar button:hover,
    .dd-generated-card-toolbar button:focus-visible {
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      outline: none;
    }

    .dd-generated-card-toolbar ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-entities-section.layout-grid .dd-generated-card-wrap.editing {
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .dd-custom-card-wrap.dragging {
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar {
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar { display: flex; }
    .dd-card-toolbar button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover { color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon { --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag {
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active {
      cursor: grabbing;
    }

    .dd-add-card-inline,
    .dd-add-card {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover {
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline {
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon {
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon { --mdc-icon-size: 22px; }

    .dd-domain-add-card {
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
    .dd-domain-add-card.drag-over {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
    .entities-grid .dd-domain-add-card {
      min-width: 0;
    }

    .entities-grid > .dd-custom-card-wrap.dd-grid-full,
    .mobile-entities-section.layout-grid .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      grid-column: 1 / -1;
      width: 100%;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entity-rail .dd-domain-add-card {
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      flex-basis: calc(100% - 20px);
    }

    .mobile-entity-rail .dd-domain-add-card {
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      min-height: 138px;
    }

    @container (max-width: 899px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 6;
      }
    }

    @container (max-width: 559px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 12;
      }
    }

    .entity-card-wrapper.loading {
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 280px;
        flex-basis: auto;
        height: 100%;
        transform: translateX(100%);
        z-index: 121;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar-resize-handle {
        display: none;
      }

      .sidebar-collapse-toggle {
        display: none;
      }

      .floor-areas {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button {
        margin-bottom: 8px;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .global-header {
        padding: 12px;
      }

      .header-time {
        font-size: 20px;
      }



      .entities-grid {
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after {
        right: -8px;
      }

      .mobile-home-section,
      .home-camera-section,
      .home-status-section,
      .home-todos-section,
      .home-custom-cards-section,
      .home-favorites-section,
      .home-summaries-section,
      .mobile-domain-group,
      .mobile-entities-section.layout-grid .mobile-entity-card {
        content-visibility: visible;
        contain-intrinsic-size: auto;
      }
    }

    /* Empty states: an area without entities, a removed area, no areas at all. */
    .dd-empty-state {
      max-width: 420px;
      margin: 32px auto;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    .area-view-missing {
      padding-top: 48px;
    }

    .dd-empty-state-icon {
      width: 56px;
      height: 56px;
      margin-bottom: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-empty-state-icon ha-icon {
      --mdc-icon-size: 28px;
    }

    .dd-empty-state-title {
      color: var(--primary-text-color);
      font-size: 17px;
      font-weight: 800;
      line-height: 1.25;
    }

    .dd-empty-state-text {
      font-size: 14px;
      line-height: 1.45;
    }

    .dd-empty-state-actions {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .dd-empty-state-button {
      appearance: none;
      min-height: 36px;
      padding: 0 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-color);
      font: inherit;
      font-size: 13px;
      font-weight: 750;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .dd-empty-state-button:hover {
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .dd-empty-state-button:active {
      transform: scale(0.97);
    }

    .dd-empty-state-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .dd-empty-state-button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #ffffff);
    }

    .dd-empty-state-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .home-no-areas {
      margin: 0 0 36px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
    }

    .home-no-areas-icon {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 13px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-no-areas-copy {
      min-width: 0;
      flex: 1 1 auto;
    }

    .home-no-areas-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 800;
      line-height: 1.2;
    }

    .home-no-areas-text {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
    }

    .home-no-areas .dd-empty-state-button {
      flex: 0 0 auto;
      padding: 0 10px 0 14px;
    }

    @media (max-width: 768px) {
      .home-no-areas {
        margin: 0 8px 18px;
        flex-wrap: wrap;
      }

      .home-no-areas-copy {
        flex: 1 1 180px;
      }

      .home-no-areas .dd-empty-state-button {
        margin-left: 56px;
      }
    }

    /* Favorites Section */
    .favorites-section {
      margin-bottom: 24px;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper {
      --favorite-color: var(--primary-color);
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 116px;
      padding: 14px 14px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 9px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper:hover {
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active {
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
    .favorite-quick-action:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
    .favorite-card-wrapper.is-idle {
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light {
      --favorite-color: ${unsafeCSS(getDomainColor('light'))};
    }

    .favorite-card-wrapper.favorite-switch {
      --favorite-color: ${unsafeCSS(getDomainColor('switch'))};
    }

    .favorite-card-wrapper.favorite-cover {
      --favorite-color: ${unsafeCSS(getDomainColor('camera'))};
    }

    .favorite-card-wrapper.favorite-binary_sensor,
    .favorite-card-wrapper.favorite-motion {
      --favorite-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .favorite-card-wrapper.favorite-climate,
    .favorite-card-wrapper.favorite-weather {
      --favorite-color: ${unsafeCSS(getDomainColor('climate'))};
    }

    .favorite-card-wrapper.favorite-media_player {
      --favorite-color: ${unsafeCSS(getDomainColor('media_player'))};
    }

    .favorite-card-wrapper.favorite-person {
      --favorite-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .favorite-card-wrapper.favorite-sun {
      --favorite-color: #2d7eea;
    }

    .favorite-top,
    .favorite-body {
      position: relative;
      z-index: 1;
    }

    .favorite-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action {
      --toggle-track: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      width: 38px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      color: transparent;
      background: var(--toggle-track);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
      font: inherit;
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-quick-action::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper.is-active .favorite-quick-action {
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before {
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action {
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before {
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon {
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon {
      display: none;
    }

    .favorite-quick-action:active {
      transform: scale(0.94);
    }

    .favorite-name {
      color: inherit;
      margin-top: 2px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .favorite-state {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([data-theme-dark]) {
      .favorite-card-wrapper {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 90%, #ffffff 4%),
            color-mix(in srgb, var(--card-background-color) 98%, #000000 3%));
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.045),
          inset 0 0 0 1px rgba(255, 255, 255, 0.045);
      }

      .favorite-card-wrapper:hover {
        box-shadow:
          0 18px 34px rgba(0, 0, 0, 0.36),
          inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 30%, transparent);
      }

      .favorite-quick-action {
        --toggle-track: rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 5px 12px rgba(0, 0, 0, 0.28);
      }

      .favorite-card-wrapper.info-only .favorite-quick-action {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(248, 250, 252, 0.82);
      }
    }


    /* Header Expanded Content Styling */
    .global-header.expanded {
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content {
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites {
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section {
      width: 100%;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper {
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile {
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      border: 1px dashed var(--divider-color);
    }

    .no-favorites ha-icon {
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p {
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-expand-button:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon {
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button {
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content {
        padding: 12px;
      }

      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button {
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon {
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
    .status-card-compact {
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
    .status-card-compact.cover {
      --status-color: ${unsafeCSS(getDomainColor('camera'))};
    }

    .home-status-card.binary_sensor,
    .home-status-card.motion,
    .status-card-compact.binary_sensor,
    .status-card-compact.motion {
      --status-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .home-status-card.light,
    .status-card-compact.light {
      --status-color: ${unsafeCSS(getDomainColor('light'))};
    }

    .home-status-card.switch,
    .status-card-compact.switch {
      --status-color: ${unsafeCSS(getDomainColor('switch'))};
    }

    .home-status-card.climate,
    .home-status-card.house-climate-card,
    .status-card-compact.climate {
      --status-color: ${unsafeCSS(getDomainColor('climate'))};
    }

    .home-status-card.person,
    .status-card-compact.person {
      --status-color: ${unsafeCSS(getDomainColor('sensor'))};
    }

    .home-status-card.media_player,
    .status-card-compact.media_player {
      --status-color: ${unsafeCSS(getDomainColor('media_player'))};
    }

    .home-status-card.fan,
    .status-card-compact.fan {
      --status-color: #2b8fcb;
    }

    .home-status-card.wattage,
    .home-status-card.house-power-card,
    .home-status-card.energy,
    .status-card-compact.wattage,
    .status-card-compact.energy {
      --status-color: ${unsafeCSS(getDomainColor('energy'))};
    }

    .home-status-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card {
      min-height: 134px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .home-status-card::before {
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before {
      opacity: 0.85;
    }

    .home-status-card .status-card-icon {
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: none;
    }

    .home-status-card .status-card-badge {
      top: -8px;
      right: -8px;
      width: auto;
      min-width: 24px;
      height: 24px;
      padding: 0 7px;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 5px 12px color-mix(in srgb, var(--status-color) 28%, transparent);
    }

    .home-status-card .status-card-title {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card {
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card {
      --status-color: ${unsafeCSS(getDomainColor('energy'))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card {
      --status-color: ${unsafeCSS(getDomainColor('climate'))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
    .home-status-card.house-climate-card .house-climate-icon,
    .home-status-card.house-power-card .house-power-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
    .house-climate-copy,
    .house-power-copy {
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
    .house-climate-title,
    .house-power-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
    .house-persons-empty,
    .house-climate-subtitle,
    .house-power-subtitle,
    .house-power-empty {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric {
      min-width: 0;
      min-height: 48px;
      padding: 8px 9px;
      border: 0;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      align-items: center;
      column-gap: 8px;
      background: color-mix(in srgb, var(--metric-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 14%, transparent);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .house-climate-metric:active {
      transform: scale(0.97);
    }

    .house-climate-metric-icon {
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
    .house-climate-metric-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value {
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label {
      font-size: 11px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list {
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon {
      width: 26px;
      height: 26px;
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-power-room-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
    .house-power-room-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar {
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, ${unsafeCSS(getDomainColor('energy'))}, #f4c34d);
    }

    .house-persons-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini {
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-background-color) 78%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .house-person-mini:active {
      transform: scale(0.97);
    }

    .house-person-mini.is-home {
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away {
      background: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 10%, var(--card-background-color));
    }

    .house-person-avatar {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
    .house-person-mini-state {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1.1;
    }

    /* No tracker: neutral, clearly not "home", "away" or "in a zone". */
    .house-person-mini.is-unknown .house-person-avatar {
      opacity: 0.6;
      filter: grayscale(1);
    }

    .house-person-mini.is-unknown .house-person-mini-state {
      color: var(--disabled-text-color, var(--secondary-text-color));
      font-style: italic;
    }

    .house-persons-more {
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 850;
      cursor: pointer;
      transition: transform 0.18s ease;
    }

    .house-persons-more:active {
      transform: scale(0.97);
    }

    .house-persons-more:focus-visible,
    .house-person-mini:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* Dark theme colors for the house cards, at every screen width. */
    :host([data-theme-dark]) {
      .home-status-card.house-persons-card {
        --status-color: #8ea8ff;
      }

      .home-status-card.house-power-card {
        --status-color: #f2b447;
      }

      .home-status-card.house-climate-card {
        --status-color: #64c8e8;
      }

      .house-person-mini {
        background: color-mix(in srgb, var(--card-background-color) 78%, #ffffff 5%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      .house-person-mini.is-home {
        background: color-mix(in srgb, #2f9b62 20%, var(--card-background-color));
      }

      .house-person-mini.is-away {
        background: color-mix(in srgb, ${unsafeCSS(getDomainColor('alarm_control_panel'))} 16%, var(--card-background-color));
      }

      .house-persons-more {
        background: color-mix(in srgb, var(--status-color) 16%, var(--card-background-color));
      }
    }

    .header-status-scroll {
      gap: 10px;
      padding: 2px 2px 4px;
    }

    .status-card-compact {
      flex: 0 0 auto;
      min-width: 92px;
      max-width: 150px;
      min-height: 70px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 7px 12px 9px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    }

    .status-card-compact:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact {
      top: -7px;
      right: -8px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--status-color) 26%, transparent);
    }

    .status-card-compact .status-card-title-compact {
      width: 100%;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
      opacity: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .status-card-compact.has-value .status-card-title-compact {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact {
      width: 100%;
      margin-top: 1px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .home-status-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin: 0;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-section {
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading {
        display: none;
      }

      .home-summaries-section {
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading {
        display: none;
      }

      .home-todos-section {
        margin: 0 -10px 18px;
      }

      .home-todos-section .home-status-heading {
        display: none;
      }

      .home-todos-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-custom-cards-section {
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-custom-cards-section .home-status-heading {
        display: none;
      }

      .home-custom-cards-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-scenes-section {
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-scenes-list {
        flex-wrap: nowrap;
        gap: 8px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-scenes-list::-webkit-scrollbar {
        display: none;
      }

      .home-scenes-section.layout-grid .home-scenes-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-scene-chip {
        flex: 0 0 auto;
        max-width: 220px;
        border-radius: 14px;
        scroll-snap-align: start;
      }

      .home-scenes-section.layout-grid .home-scene-chip {
        width: 100%;
        max-width: none;
        scroll-snap-align: none;
      }

      .home-summary-list {
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card {
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon {
        width: 36px;
        height: 36px;
      }

      .home-camera-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar {
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card {
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content {
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name {
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar {
        display: none;
      }

      .home-status-card {
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card {
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title {
        font-size: 15px;
      }

      .status-card-compact {
        min-width: 88px;
      }

      .home-view {
        max-width: none;
      }

      .person-cards-section {
        display: none;
      }

      .home-status-heading {
        display: none;
      }

      .mobile-home-section {
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label {
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action {
        appearance: none;
        min-width: 66px;
        height: 28px;
        padding: 0 10px 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 850;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          transform 0.18s ease;
      }

      .mobile-section-action ha-icon {
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active {
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail {
        display: flex;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar {
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card {
        appearance: none;
        position: relative;
        box-sizing: border-box;
        flex: 0 0 152px;
        min-width: 0;
        min-height: 130px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        font: inherit;
        box-shadow: 0 12px 28px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        text-align: left;
        scroll-snap-align: start;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .mobile-home-section.layout-grid .mobile-area-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail {
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active {
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture {
        min-height: 146px;
        color: var(--mobile-area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.16);
        background: #182044;
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-card.has-picture.text-dark {
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
      .mobile-area-copy {
        position: relative;
        z-index: 2;
      }

      .mobile-area-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }

      .mobile-area-icon {
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 13%, transparent);
      }

      .mobile-area-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge {
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 999px;
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
        font-size: 11px;
        font-weight: 850;
      }

      .mobile-area-card.has-picture .mobile-area-badge {
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light {
        --area-badge-color: ${unsafeCSS(getDomainColor('light'))};
      }

      .mobile-area-badge.cover {
        --area-badge-color: ${unsafeCSS(getDomainColor('camera'))};
      }

      .mobile-area-badge.motion {
        --area-badge-color: ${unsafeCSS(getDomainColor('alarm_control_panel'))};
      }

      .mobile-area-name {
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta {
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
      .mobile-area-card.has-picture .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
      .mobile-area-card.has-picture.text-dark .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section {
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
      .home-status-section.layout-grid .house-climate-card,
      .home-status-section.layout-grid .house-power-card {
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid {
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before {
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge {
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      :host([data-theme-dark]) {
        .home-welcome {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 7%) 0%,
              color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.34),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        .welcome-avatar {
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.34),
            0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        .welcome-action {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 84%, #ffffff 8%),
              color-mix(in srgb, var(--card-background-color) 94%, #000000 6%));
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .mobile-area-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mobile-area-card:not(.has-picture) .mobile-area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
        }

        .mobile-area-badge {
          background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 20%, transparent);
        }

        .house-climate-metric {
          background: color-mix(in srgb, var(--metric-color) 18%, var(--card-background-color));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        }

        .house-power-room-icon {
          background: color-mix(in srgb, var(--status-color) 20%, transparent);
        }

        .house-power-bar {
          background: color-mix(in srgb, var(--status-color) 13%, var(--card-background-color));
        }

        .home-summary-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .home-summary-icon {
          background: color-mix(in srgb, var(--summary-color) 20%, transparent);
        }
      }

      .home-favorites-section {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow-x: clip;
      }

      .home-favorites-section .favorites-header {
        display: none;
      }

      .home-favorites-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 0;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar {
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper {
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    @media (max-width: 768px) {
      :host {
        height: auto;
        max-height: none;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container {
        display: block;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content {
        display: block;
        min-height: 100dvh;
        overflow: visible;
      }

      .content-area {
        padding: 0;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
        overscroll-behavior: auto;
        -webkit-overflow-scrolling: auto;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area {
        padding-bottom: 0;
      }

      .content-area.area-content-area {
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area {
        padding: 0;
      }

      .home-view {
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view {
        /* Same clearance as the other sheets above the bottom navigation. */
        --dd-settings-bar-bottom: calc(82px + env(safe-area-inset-bottom, 0px));
        width: 100%;
        margin: 0;
        padding: 8px 10px calc(152px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-header {
        gap: 12px;
        margin: 0 0 12px;
        padding: 12px 14px;
        border-radius: 18px;
        border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
      }

      .settings-page-back {
        width: 42px;
        height: 42px;
      }

      .settings-page-title h1 {
        font-size: 21px;
      }

      .settings-page-title p {
        margin-top: 3px;
        font-size: 13px;
      }

      .settings-page-editor {
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .settings-save-bar {
        position: fixed;
        left: 10px;
        right: 10px;
        bottom: var(--dd-settings-bar-bottom);
        z-index: 110;
        margin: 0;
        padding: 6px 6px 6px 14px;
      }

      .global-header.mobile {
        margin: -10px -10px 0;
        padding: 12px 14px 22px;
        border-bottom: 0;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .header-content {
        display: block;
      }

      .global-header.mobile .header-status-section {
        width: 100%;
      }

      .global-header.mobile .header-status-scroll {
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact {
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact {
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact {
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button {
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-view .entities-section,
      .area-view .dd-custom-section {
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section {
        display: none;
      }

      .mobile-area-overview {
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section {
        display: grid;
        position: relative;
        z-index: 2;
      }

      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .sidebar .area-list {
        padding: 0;
      }

      .sidebar .floor-section {
        margin-bottom: 12px;
      }

      .sidebar .floor-header {
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3 {
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button {
        min-height: 64px;
        height: auto;
        margin-bottom: 8px;
        padding: 11px 12px 11px 56px;
        border-radius: 9px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 97%, #ffffff),
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)));
        box-shadow:
          0 10px 22px rgba(15, 23, 42, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .sidebar .area-button.home-button {
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 88%, #ffffff 10%),
            var(--primary-color));
        color: var(--text-primary-color);
        box-shadow:
          0 14px 28px color-mix(in srgb, var(--primary-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .sidebar .area-content {
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section {
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section {
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon {
        position: absolute;
        left: -44px;
        top: 50%;
        bottom: auto;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        transform: translateY(-50%);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        box-shadow: none;
      }

      .sidebar .area-main-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture {
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected {
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon {
        z-index: 1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 2;
        grid-row: 1 / span 2;
        max-width: 130px;
        justify-content: flex-end;
        align-self: center;
        gap: 5px;
      }

      .sidebar .area-name {
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge {
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon {
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count {
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
      .sidebar .area-button.selected .area-icon {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header {
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3 {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
      .sidebar .area-button.home-button {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto 22px;
        align-items: center;
        gap: 12px;
        min-height: 68px;
        height: auto;
        margin: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.34);
        background: rgba(255, 255, 255, 0.98);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.home-button .area-icon,
      .sidebar .area-icon,
      .sidebar .area-main-icon {
        position: relative;
        left: auto;
        top: auto;
        bottom: auto;
        grid-column: 1;
        grid-row: 1;
        width: 46px;
        height: 46px;
        border-radius: 8px;
        transform: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
        box-shadow: none;
      }

      .sidebar .area-button.home-button .area-icon {
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content {
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
      .sidebar .area-top-section {
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section {
        display: contents;
      }

      .sidebar .area-name {
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 3;
        grid-row: 1;
        max-width: 104px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        z-index: 1;
      }

      .sidebar .area-menu-chevron {
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut {
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron {
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture {
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
      .sidebar .area-button.has-picture .area-name,
      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after {
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name {
        width: fit-content;
        max-width: 100%;
        padding: 4px 8px;
        margin-left: -2px;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(8, 13, 24, 0.66), rgba(8, 13, 24, 0.28));
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
      }

      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron {
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
      .sidebar .area-button.has-picture.text-dark .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay {
        z-index: 120 !important;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
      }

      :host([data-theme-dark]) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar .floor-header h3 {
          color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        }

        .sidebar .area-button {
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
        }

        .sidebar .area-button.selected,
        .sidebar .area-button.home-button.selected {
          border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--primary-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.has-picture {
          border-color: rgba(255, 255, 255, 0.08);
          background: #17202b;
        }

        .sidebar .area-button.has-picture .area-background {
          opacity: 0.58;
        }

        .sidebar .area-button.has-picture:hover .area-background {
          opacity: 0.66;
        }

        .sidebar .area-main-icon,
        .sidebar .area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-button.selected .area-main-icon,
        .sidebar .area-button.selected .area-icon {
          background: color-mix(in srgb, var(--primary-color) 24%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-menu-chevron,
        .sidebar .area-button.selected .area-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .area-menu-chevron {
          color: var(--primary-color);
        }

        .sidebar .area-sensors,
        .sidebar .area-bottom-section {
          color: color-mix(in srgb, var(--primary-text-color) 68%, transparent);
        }

        .sidebar .info-badge {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .home-notification-shortcut {
          color: #ff9a9a;
          background: rgba(239, 68, 68, 0.16);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.18);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .home-view,
      .home-content-area {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section .favorites-grid {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper {
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }

    /* Touch screens: small controls get a target of at least 40x40px. Mouse
       and trackpad users (fine pointers) keep the compact desktop sizes. */
    @media (pointer: coarse) {
      /* Controls that can simply grow. */
      .dd-card-toolbar button,
      .dd-generated-card-toolbar button,
      .mobile-domain-order-button,
      .mobile-domain-drag-handle,
      .mobile-layout-toggle,
      .mobile-domain-master-action,
      .mobile-cover-action,
      .notifications-icon-button,
      .notification-dismiss,
      .header-expand-button {
        min-width: 40px;
        min-height: 40px;
      }

      .mobile-domain-master,
      .mobile-domain-master-actions {
        min-height: 40px;
      }

      /* Three 40px cover buttons do not fit next to the entity icon, so the
         cover buttons may wrap below it. */
      .mobile-entity-top {
        flex-wrap: wrap;
      }

      .mobile-cover-actions {
        margin-left: auto;
      }

      /* Switch-like and pill controls keep their look and get a larger,
         invisible hit area instead. */
      .mobile-entity-toggle,
      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action,
      .favorite-quick-action,
      .mobile-section-action,
      .mobile-section-toggle,
      .home-notification-shortcut {
        position: relative;
      }

      .mobile-entity-toggle::after,
      .mobile-entity-more::after,
      .mobile-scene-action::after,
      .mobile-lock-action::after,
      .favorite-quick-action::after,
      .mobile-section-action::after,
      .mobile-section-toggle::after,
      .home-notification-shortcut::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: max(100%, 44px);
        height: max(100%, 44px);
        transform: translate(-50%, -50%);
      }
    }

    /* Reduced motion: no looping or decorative animation (alarm pulse,
       loading shimmer) and near-instant transitions. */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }

      .welcome-alarm.alarm-triggered {
        animation: none;
      }
    }
`;

/**
 * Room-specific type-group and entity-card styling.
 *
 * This is the fork's former room styling, now scoped directly to the
 * existing area view instead of depending on the fork-only room-ui-v2
 * wrapper. The v1.11 page header is intentionally not styled here.
 */
export const roomAreaStyles = css`
.area-view .mobile-entity-replacement-card{
      --dd-replacement-min-height: 62px;
      --dd-replacement-padding: 8px 10px;
      --dd-replacement-radius: 8px;
    }

@media (min-width: 769px){
.area-view .mobile-entity-replacement-card{
        --dd-replacement-min-height: 72px;
        --dd-replacement-padding: 12px;
        --dd-replacement-radius: 10px;
      }

}

.area-view .mobile-entities-section{
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;
    }

.area-view .mobile-domain-group{
      min-width: 0;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
      contain: layout style;
    }

.area-view .mobile-domain-header{
      width: 100%;
      min-height: 38px;
      margin: 0;
      padding: 7px 9px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-radius: 7px 7px 0 0;
    }

.area-view .mobile-domain-group.is-collapsed .mobile-domain-header{
      margin-bottom: 0;
      border-radius: 7px;
    }

.area-view .mobile-domain-title{
      appearance: none;
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

.area-view .mobile-domain-title-copy{
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 5px;
    }

.area-view .mobile-domain-title-label{
      font-size: 15px;
      font-weight: 850;
    }

.area-view .mobile-domain-count{
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
    }

.area-view .mobile-domain-header-actions{
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-right: 2px;
    }

.area-view .mobile-domain-master{
      min-width: 76px;
      height: 28px;
    }

.area-view .mobile-domain-collapse-button{ display: none !important; }

.area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: stretch;
      gap: 8px;
      margin: 0;
      padding: 0 9px 9px;
      overflow: visible;
      scroll-padding: 0;
      scroll-snap-type: none;
    }

.area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
      width: 100% !important;
      min-width: 0 !important;
      min-height: 62px !important;
      height: auto !important;
      margin: 0 !important;
      padding: 8px 10px !important;
      box-sizing: border-box;
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 3px 9px rgba(15, 23, 42, 0.035);
      cursor: pointer;
      scroll-snap-align: none;
    }

.area-view .mobile-entity-card:hover{
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--primary-color) 14%, transparent);
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.055);
    }

.area-view .mobile-entity-main{
      width: 100%;
      min-width: 0;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 9px;
    }

.area-view .mobile-entity-main.editing-inline{
      grid-template-columns: 24px 36px minmax(0, 1fr) 34px;
      gap: 7px;
    }

.area-view .mobile-entity-icon{
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

.area-view .mobile-entity-icon ha-icon{ --mdc-icon-size: 20px; }

.area-view .mobile-entity-content{
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }

.area-view .mobile-entity-name{
      overflow: hidden;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.15;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

.area-view .mobile-entity-state{
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

.area-view .mobile-entity-state.active{
      color: var(--entity-color);
    }

.area-view .mobile-entity-right{
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
    }

.area-view .mobile-entity-status-pill{ display: none !important; }

.area-view .mobile-entity-brightness{
      width: calc(100% - 45px);
      margin: 6px 0 0 45px;
    }

.area-view .mobile-entity-brightness input[type="range"]{
      appearance: none;
      width: 100%;
      height: 4px;
      margin: 0;
      border-radius: 999px;
      outline: none;
      background: linear-gradient(
        90deg,
        var(--entity-color) 0%,
        var(--entity-color) var(--brightness),
        color-mix(in srgb, var(--primary-text-color) 13%, transparent) var(--brightness),
        color-mix(in srgb, var(--primary-text-color) 13%, transparent) 100%
      );
    }

.area-view .mobile-entity-brightness input[type="range"]::-webkit-slider-thumb{
      appearance: none;
      width: 14px;
      height: 14px;
      border: 2px solid var(--entity-color);
      border-radius: 50%;
      background: var(--card-background-color);
    }

.area-view .mobile-entity-brightness input[type="range"]::-moz-range-thumb{
      width: 12px;
      height: 12px;
      border: 2px solid var(--entity-color);
      border-radius: 50%;
      background: var(--card-background-color);
    }

.area-view .mobile-entity-more{ display: none !important; }

@media (max-width: 1180px) and (min-width: 769px){
.area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

}

@media (max-width: 768px){
.area-view .mobile-domain-group{
        padding: 0;
        border-radius: 9px;
      }

.area-view .mobile-domain-header{
        min-height: 36px;
        margin: 0;
        padding: 6px 7px;
      }

.area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: 1fr;
        gap: 6px;
        padding: 0 7px 7px;
      }

.area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
        min-height: 58px !important;
        padding: 7px 9px !important;
      }

.area-view .mobile-entity-main{
        grid-template-columns: 34px minmax(0, 1fr) auto;
        gap: 8px;
      }

.area-view .mobile-entity-main.editing-inline{
        grid-template-columns: 24px 34px minmax(0, 1fr) 34px;
        gap: 7px;
      }

.area-view .mobile-entity-icon{
        width: 34px;
        height: 34px;
      }

.area-view .mobile-entity-brightness{
        width: calc(100% - 42px);
        margin-left: 42px;
      }

}

.area-view > .room-favorites-block{
      width: 100%;
      box-sizing: border-box;
    }

.area-view .mobile-domain-header.expandable-header{
      position: relative;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      transition:
        background-color 0.15s ease,
        box-shadow 0.15s ease;
    }

.area-view .mobile-domain-header.expandable-header:hover{
      background: color-mix(in srgb, var(--primary-color) 6%, var(--card-background-color));
    }

.area-view .mobile-domain-header.expandable-header:active{
      background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
    }

.area-view .mobile-domain-header.expandable-header:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--primary-color) 55%, transparent);
      outline-offset: 2px;
    }

.area-view .mobile-domain-title{
      pointer-events: none;
    }

.area-view .mobile-domain-header-actions{
      position: relative;
      z-index: 2;
    }

consistent leading chevron. */
    .area-view .mobile-domain-header.expandable-header{
      min-height: 38px;
    }

.area-view .mobile-domain-title{
      min-height: 24px;
      align-items: center;
      gap: 6px;
      line-height: 1;
    }

.area-view .mobile-domain-title-copy{
      align-items: center;
      line-height: 1;
    }

.area-view .mobile-domain-title-label,
.area-view .mobile-domain-count{
      line-height: 1;
    }

/* Edit mode keeps exactly the same card footprint as the normal room view. */
    .area-view .dd-generated-card-wrap.editing{
      width: 100%;
      min-width: 0;
      min-height: 62px;
      height: auto;
      flex: none;
      border-radius: 8px;
    }

.area-view .dd-generated-card-wrap.editing > .mobile-entity-card{
      min-height: 62px !important;
      height: 100% !important;
    }

.area-view .mobile-entity-rail .dd-domain-add-card-final,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card-final{
      min-height: 62px !important;
      height: 62px;
      opacity: 0.72;
      border-radius: 8px;
    }

.area-view .dd-generated-card-toolbar{
      display: none !important;
    }

@media (max-width: 768px){
.area-view .mobile-domain-header.expandable-header{
        width: 100%;
        padding: 6px 7px;
      }

.area-view .dd-generated-card-wrap.editing,
.area-view .dd-generated-card-wrap.editing > .mobile-entity-card,
.area-view .mobile-entity-rail .dd-domain-add-card-final{
        min-height: 58px !important;
      }

.area-view .mobile-entity-rail .dd-domain-add-card-final{
        height: 58px;
      }

}

which also swallowed pointer events for the new handle. */
    .area-view .mobile-domain-group.group-editing .mobile-domain-title{
      pointer-events: auto;
    }

.area-view .mobile-domain-group.group-editing .mobile-domain-title-copy,
.area-view .mobile-domain-group.group-editing .room-domain-icon{
      pointer-events: none;
    }

.area-view .mobile-domain-leading-drag-handle{
      pointer-events: auto;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: element;
    }

.area-view .mobile-domain-header.room-favorites-header.expandable-header{
      min-height: 32px;
      padding: 3px 9px;
      border-radius: 7px;
    }

.area-view .room-favorites-title{
      min-height: 20px;
    }

.area-view .room-favorites-title .room-domain-icon{
      width: 19px;
      height: 19px;
    }

.area-view .room-favorites-title .room-domain-icon ha-icon{
      --mdc-icon-size: 16px;
    }

@media (min-width: 769px){
.area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

.area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
        min-height: 62px !important;
        padding: 8px 10px !important;
        justify-content: center !important;
        overflow: hidden !important;
      }

.area-view .mobile-entity-card.has-light-controls,
.area-view .mobile-entity-card.has-cover-position{
        min-height: 104px !important;
        justify-content: flex-start !important;
      }

.area-view .mobile-entity-main{
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        gap: 9px !important;
        align-items: center !important;
      }

.area-view .mobile-entity-content{
        min-width: 0 !important;
        height: 36px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 3px !important;
        overflow: hidden !important;
      }

.area-view .mobile-entity-name{
        min-width: 0 !important;
        width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 12px !important;
        line-height: 1.08 !important;
        letter-spacing: -0.1px !important;
      }

.area-view .mobile-entity-state{
        margin: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 10.5px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
      }

.area-view .mobile-entity-right{
        min-width: max-content !important;
        max-width: 86px !important;
        margin-left: 4px !important;
        align-self: center !important;
      }

.area-view .mobile-cover-actions{
        min-height: 30px !important;
        padding: 2px !important;
        gap: 2px !important;
      }

.area-view .mobile-cover-action{
        width: 25px !important;
        height: 25px !important;
      }

}

@media (min-width: 769px){
/* Light controls: only rendered while ON. Keep cards compact and place icons after slider. */
      .area-view .mobile-entity-card.has-light-controls,
.area-view .mobile-entity-card.has-cover-position{
        min-height: 94px !important;
        padding-bottom: 6px !important;
      }

}

@media (min-width: 769px){
/* Room entity cards: slightly larger content with symmetric 10px inner spacing. */
      .area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
        min-height: 60px !important;
        padding: 10px !important;
        box-sizing: border-box !important;
      }

.area-view .mobile-entity-main{
        min-height: 38px !important;
        align-items: center !important;
      }

.area-view .mobile-entity-icon{
        width: 38px !important;
        height: 38px !important;
      }

.area-view .mobile-entity-content{
        height: 38px !important;
      }

/* Expanded control cards: vertical spacing above and below the control row is equal. */
      .area-view .mobile-entity-card.has-light-controls,
.area-view .mobile-entity-card.has-cover-position{
        min-height: 0 !important;
        height: auto !important;
        padding: 8px 10px !important;
        justify-content: flex-start !important;
      }

.area-view .mobile-entity-card.has-light-controls .mobile-entity-main,
.area-view .mobile-entity-card.has-cover-position .mobile-entity-main{
        min-height: 38px !important;
      }

}

@media (min-width: 769px){
/* One tall entity must not stretch its siblings; all cards stay top-aligned. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        align-items: start !important;
      }

.area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
        align-self: start !important;
      }

}

@media (min-width: 769px){
/*
       * Slider geometry: use the original 5px track / 15px thumb geometry
       * used by the first light-control implementation. Do not change the
       * control layout here; only restore the slider proportions.
       */
      .area-view .mobile-light-control-slider,
.area-view .mobile-cover-position input[type="range"]{
        height: 5px !important;
      }

.area-view .mobile-light-control-slider::-webkit-slider-runnable-track,
.area-view .mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
        border-radius: 999px !important;
      }

.area-view .mobile-light-control-slider::-moz-range-track,
.area-view .mobile-cover-position input[type="range"]::-moz-range-track{
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
        border-radius: 999px !important;
      }

.area-view .mobile-light-control-slider::-moz-range-progress{
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
        border-radius: 999px !important;
      }

.area-view .mobile-light-control-slider::-webkit-slider-thumb,
.area-view .mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 15px !important;
        height: 15px !important;
      }

.area-view .mobile-light-control-slider::-moz-range-thumb,
.area-view .mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 13px !important;
        height: 13px !important;
      }

/*
       * A tall card must not define the height of its siblings.
       * Explicitly size grid rows to content and opt every entity card out
       * of the grid's default stretch behaviour.
       */
      .area-view .mobile-entity-rail,
      .area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        align-items: start !important;
        grid-auto-rows: max-content !important;
      }

.area-view .mobile-entity-rail > .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail > .mobile-entity-card{
        align-self: start !important;
        height: fit-content !important;
      }

.area-view .mobile-entity-card.has-light-controls,
.area-view .mobile-entity-card.has-cover-position{
        height: auto !important;
      }

}

@media (min-width: 769px){
.area-view .room-favorites-block:not(.is-collapsed) .room-favorites-header{
        margin-bottom: 0 !important;
      }

}

@media (min-width: 769px){
/* Keep four columns. The available desktop width is used for wider cards. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }

.area-view .mobile-entity-card,
.area-view .mobile-entities-section.layout-grid .mobile-entity-card{
        min-height: 62px !important;
        height: auto !important;
        padding: 8px 10px !important;
        border-radius: 10px !important;
        box-sizing: border-box !important;
        justify-content: center !important;
      }

.area-view .mobile-entity-main{
        min-height: 36px !important;
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        gap: 11px !important;
      }

.area-view .mobile-entity-main.editing-inline{
        grid-template-columns: 29px 46px minmax(0, 1fr) 42px !important;
        gap: 8px !important;
      }

.area-view .mobile-entity-icon{
        width: 36px !important;
        height: 36px !important;
        border-radius: 8px !important;
      }

.area-view .mobile-entity-icon ha-icon{
        --mdc-icon-size: 24px !important;
      }

.area-view .mobile-entity-content{
        height: 36px !important;
        gap: 2px !important;
      }

.area-view .mobile-entity-name{
        font-size: 12px !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }

.area-view .mobile-entity-state{
        font-size: 12.7px !important;
        line-height: 1.1 !important;
      }

.area-view .mobile-entity-right{
        gap: 5px !important;
        max-width: 104px !important;
      }

.area-view .mobile-entity-toggle{
        width: 46px !important;
        height: 27px !important;
      }

.area-view .mobile-entity-toggle::before{
        width: 21px !important;
        height: 21px !important;
        margin-left: 3px !important;
      }

.area-view .mobile-entity-card.is-active .mobile-entity-toggle::before{
        transform: translateX(19px) !important;
      }

.area-view .mobile-entity-card.has-light-controls,
.area-view .mobile-entity-card.has-cover-position{
        min-height: 112px !important;
        padding: 9px 12px !important;
      }

.area-view .mobile-entity-card.has-light-controls .mobile-entity-main,
.area-view .mobile-entity-card.has-cover-position .mobile-entity-main{
        min-height: 46px !important;
      }

.area-view .mobile-light-control-row{
        margin-top: 9px !important;
        min-height: 32px !important;
      }

.area-view .mobile-light-control-slider,
.area-view .mobile-cover-position input[type="range"]{
        height: 6px !important;
      }

.area-view .mobile-light-control-slider::-webkit-slider-runnable-track,
.area-view .mobile-cover-position input[type="range"]::-webkit-slider-runnable-track,
.area-view .mobile-light-control-slider::-moz-range-track,
.area-view .mobile-cover-position input[type="range"]::-moz-range-track,
.area-view .mobile-light-control-slider::-moz-range-progress{
        height: 6px !important;
      }

.area-view .mobile-light-control-slider::-webkit-slider-thumb,
.area-view .mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 18px !important;
        height: 18px !important;
      }

.area-view .mobile-light-control-slider::-moz-range-thumb,
.area-view .mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 16px !important;
        height: 16px !important;
      }

.area-view .mobile-light-mode-buttons{ gap: 5px !important; }

.area-view .mobile-light-mode-button{
        width: 34px !important;
        height: 34px !important;
        border-radius: 9px !important;
      }

.area-view .mobile-light-mode-button ha-icon{ --mdc-icon-size: 20px !important; }

.area-view .mobile-cover-actions{
        min-height: 36px !important;
        padding: 3px !important;
        gap: 3px !important;
      }

.area-view .mobile-cover-action{ width: 31px !important; height: 31px !important; }

.area-view .mobile-cover-action ha-icon{ --mdc-icon-size: 20px !important; }

/* Lower room sections must use exactly the same outer width as the room header/favorites. */
      .area-view .mobile-entities-section,
.area-view .mobile-domain-group{
        width: 100% !important;
        align-self: stretch !important;
        box-sizing: border-box !important;
      }

}

@media (min-width: 769px){
/* Keep the room content and global house-information row on the same
   desktop measure. This prevents both surfaces from becoming overly wide
   on very large displays while keeping their left/right edges aligned. */
      .area-view{
        width: 100% !important;
        max-width: 1400px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box !important;
      }

.area-view > .mobile-entities-section,
.area-view > .mobile-entities-section > .mobile-domain-group,
.area-view > .mobile-entities-section > .mobile-domain-group > .mobile-entity-rail{
        width: 100% !important;
        max-width: none !important;
        box-sizing: border-box !important;
      }

}

@media (min-width: 769px){
/* Exactly five entity columns in the desktop room view. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      }

}

@media (min-width: 769px){
/* Room entity cards: exactly five columns on desktop. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      }

}

@media (min-width: 769px){
/* Exactly five columns in the desktop room view. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      }

}

@media (min-width: 769px){
/* Four entity cards per row on every desktop width. */
      .area-view .mobile-entity-rail,
.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }

}

/* Select/input_select cards: one authoritative layout. The entity icon stays
   in the normal leading icon tile; only the select chevron is on the right. */
@media (min-width: 769px) {
  .area-view .mobile-entity-card.has-inline-select {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: 46px 42px !important;
    align-content: center !important;
    gap: 7px !important;
    min-height: 123px !important;
    height: auto !important;
    padding: 9px 12px !important;
    overflow: hidden !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-main {
    grid-column: 1 !important;
    grid-row: 1 !important;
    width: 100% !important;
    min-width: 0 !important;
    height: 46px !important;
    min-height: 46px !important;
    display: grid !important;
    grid-template-columns: 46px minmax(0, 1fr) !important;
    grid-template-areas: "icon content" !important;
    align-items: center !important;
    gap: 11px !important;
    direction: ltr !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-icon {
    grid-area: icon !important;
    position: static !important;
    inset: auto !important;
    width: 46px !important;
    min-width: 46px !important;
    height: 46px !important;
    min-height: 46px !important;
    margin: 0 !important;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    justify-self: start !important;
    align-self: center !important;
    transform: none !important;
  }

  .area-view .mobile-entity-card.has-inline-select
  .mobile-entity-icon > .mobile-entity-leading-select-icon {
    position: static !important;
    inset: auto !important;
    display: block !important;
    width: 24px !important;
    height: 24px !important;
    min-width: 24px !important;
    min-height: 24px !important;
    margin: 0 !important;
    padding: 0 !important;
    transform: none !important;
    --mdc-icon-size: 24px !important;
    pointer-events: none !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-content {
    grid-area: content !important;
    min-width: 0 !important;
    height: 46px !important;
    margin: 0 !important;
    align-self: center !important;
    justify-content: center !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-right {
    display: none !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-select {
    grid-column: 1 !important;
    grid-row: 2 !important;
    position: relative !important;
    width: 100% !important;
    height: 42px !important;
    min-height: 42px !important;
    margin: 0 !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-entity-select select {
    width: 100% !important;
    height: 42px !important;
    box-sizing: border-box !important;
    padding: 0 42px 0 15px !important;
    font-size: 14.4px !important;
    line-height: 42px !important;
  }

  .area-view .mobile-entity-card.has-inline-select .mobile-select-chevron {
    position: absolute !important;
    top: 50% !important;
    right: 12px !important;
    left: auto !important;
    bottom: auto !important;
    margin: 0 !important;
    transform: translateY(-50%) !important;
    --mdc-icon-size: 20px !important;
    pointer-events: none !important;
  }
}



/* Final mobile Home overrides.
   Keep these at the end of layoutCardStyles because this stylesheet is
   appended after the component-local styles and therefore owns the
   effective mobile Home presentation. */
@media (max-width: 768px) {
  /* Horizontal one-row sections need room for their card shadows. */
  .mobile-home-section:not(.layout-grid),
  .home-status-section:not(.layout-grid),
  .home-camera-section:not(.layout-grid) {
    overflow: visible !important;
  }

  .mobile-home-section:not(.layout-grid) .mobile-area-rail,
  .home-status-section:not(.layout-grid) .home-status-grid,
  .home-camera-section:not(.layout-grid) .home-camera-grid {
    padding-top: 3px !important;
    padding-bottom: 28px !important;
  }

  /* Native/custom HA cards stay within the mobile viewport. */
  .home-todos-grid,
  .home-custom-cards-grid,
  .home-todo-card,
  .home-custom-card,
  .home-todo-card dwains-dashboard-next-card-host,
  .home-custom-card dwains-dashboard-next-card-host {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  .home-todos-grid,
  .home-custom-cards-grid {
    grid-template-columns: minmax(0, 1fr) !important;
    overflow: visible !important;
  }

  /* Area cards: icon height roughly matches two stacked status badges. */
  .mobile-area-icon {
    width: 56px !important;
    height: 56px !important;
    flex: 0 0 56px !important;
    border-radius: 15px !important;
  }

  .mobile-area-icon ha-icon {
    --mdc-icon-size: 30px !important;
  }

  .mobile-area-card.has-picture .mobile-area-picture {
    opacity: 0.22 !important;
    filter: saturate(0.72) contrast(0.92) !important;
  }

  .mobile-area-card.has-picture {
    background: var(--card-background-color) !important;
    color: var(--primary-text-color) !important;
    --mobile-area-picture-text-color: var(--primary-text-color) !important;
    --mobile-area-picture-muted-text-color: var(--secondary-text-color) !important;
    --mobile-area-picture-text-shadow: none !important;
    --mobile-area-picture-overlay: linear-gradient(
      color-mix(in srgb, var(--card-background-color) 14%, transparent),
      color-mix(in srgb, var(--card-background-color) 14%, transparent)
    ) !important;
  }

  .mobile-area-card.has-picture .mobile-area-icon {
    color: var(--primary-color) !important;
    background: color-mix(in srgb, var(--primary-color) 13%, var(--card-background-color)) !important;
    backdrop-filter: none !important;
  }

  /* Favorites use exactly the same mobile content width as Areas. */
  .home-favorites-section {
    box-sizing: border-box !important;
    width: auto !important;
    max-width: none !important;
    margin: 0 -10px 30px !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  .home-favorites-section .favorites-grid {
    box-sizing: border-box !important;
    width: 100% !important;
    gap: 8px !important;
    padding: 3px 18px 32px !important;
  }

  /* One-line mode: horizontal rail with content-sized cards. */
  .home-favorites-section.layout-rail .favorites-grid {
    display: flex !important;
    flex-direction: row !important;
    align-items: stretch !important;
    overflow-x: auto !important;
    overflow-y: visible !important;
    scroll-padding-inline: 18px !important;
    scroll-snap-type: x proximity !important;
    scrollbar-width: none !important;
  }

  .home-favorites-section.layout-rail .favorites-grid::-webkit-scrollbar {
    display: none !important;
  }

  /* The former two-column mode is now a one-column full-width list. */
  .home-favorites-section.layout-grid .favorites-grid {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    overflow: visible !important;
    scroll-snap-type: none !important;
  }

  .home-favorites-section .favorite-card-wrapper {
    position: relative !important;
    isolation: isolate !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    grid-template-rows: 1fr !important;
    align-items: center !important;
    column-gap: 10px !important;
    height: 64px !important;
    min-height: 64px !important;
    padding: 8px 11px !important;
    overflow: hidden !important;
    border-radius: 14px !important;
  }

  .home-favorites-section.layout-grid .favorite-card-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: none !important;
    scroll-snap-align: none !important;
  }

  .home-favorites-section.layout-rail .favorite-card-wrapper {
    width: max-content !important;
    max-width: calc(100vw - 36px) !important;
    min-width: 0 !important;
    flex: 0 0 auto !important;
    scroll-snap-align: start !important;
  }

  .home-favorites-section .favorite-icon {
    position: absolute !important;
    left: 7px !important;
    top: 50% !important;
    z-index: 0 !important;
    width: 58px !important;
    height: 58px !important;
    margin: 0 !important;
    border-radius: 0 !important;
    transform: translateY(-50%) !important;
    background: transparent !important;
    color: var(--favorite-color) !important;
    opacity: 0.10 !important;
    pointer-events: none !important;
  }

  .home-favorites-section .favorite-icon ha-icon {
    --mdc-icon-size: 54px !important;
  }

  .home-favorites-section .favorite-body {
    grid-column: 1 !important;
    grid-row: 1 !important;
    position: relative !important;
    z-index: 1 !important;
    min-width: 0 !important;
    align-self: center !important;
    padding: 0 0 0 7px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  .home-favorites-section .favorite-end {
    grid-column: 2 !important;
    grid-row: 1 !important;
    position: relative !important;
    z-index: 1 !important;
    align-self: center !important;
    justify-self: end !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .home-favorites-section .favorite-name {
    margin: 0 !important;
    display: block !important;
    max-width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    -webkit-line-clamp: unset !important;
    font-size: 14px !important;
    line-height: 1.15 !important;
  }

  .home-favorites-section .favorite-meta {
    margin-top: 3px !important;
    line-height: 1.15 !important;
  }

  .home-favorites-section.layout-rail .favorite-body,
  .home-favorites-section.layout-rail .favorite-name {
    width: max-content !important;
    max-width: min(64vw, 430px) !important;
  }
}



/* 2026-10-08 Home/sidebar follow-up.
   Keep these overrides at the end of layoutCardStyles so they remain the
   authoritative rules for the current Home and room-navigation markup. */

/* Room list: the room icon always remains the foreground icon. If a room has
   a picture, that picture becomes a soft card background on both desktop and mobile. */
.sidebar .room-area-button {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.sidebar .room-area-button .area-list-picture {
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  background-position: center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  opacity: 0.13 !important;
  filter: saturate(0.72) contrast(0.94) !important;
  transform: scale(1.015) !important;
  pointer-events: none !important;
}

.sidebar .room-area-button.has-picture,
.sidebar .room-area-button.has-picture.selected {
  color: var(--primary-text-color) !important;
  background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)) !important;
  --area-picture-text-color: var(--primary-text-color) !important;
  --area-picture-muted-text-color: var(--secondary-text-color) !important;
  --area-picture-text-shadow: none !important;
}

.sidebar .room-area-button.has-picture::after {
  display: none !important;
}

.sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-content {
  position: relative !important;
  z-index: 1 !important;
}

.sidebar .room-area-button .area-media {
  background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color)) !important;
}

.sidebar .room-area-button .area-media-icon {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--primary-color) !important;
  background: color-mix(in srgb, var(--primary-color) 11%, var(--card-background-color)) !important;
  backdrop-filter: none !important;
}

.sidebar .room-area-button.has-picture .area-name,
.sidebar .room-area-button.has-picture .area-sensors {
  color: inherit !important;
  background: transparent !important;
  text-shadow: none !important;
  backdrop-filter: none !important;
}

@media (min-width: 769px) {
  /* Reserve one metadata line even when a room has neither climate nor power data,
     keeping room names and badge rows aligned between neighboring entries. */
  .sidebar .room-area-button .area-sensors {
    min-height: 12px !important;
  }

  .sidebar .room-area-button .area-sensors.is-empty {
    visibility: hidden !important;
  }

  /* House-information shadows need paint space below the last row. */
  .home-status-section {
    overflow: visible !important;
  }

  .home-status-primary-grid {
    overflow: visible !important;
    padding-bottom: 18px !important;
  }

  /* One to-do column spans exactly half of the six-column Home rhythm:
     three favorite-card widths plus the two internal gaps. */
  .home-todos-grid {
    width: calc(50% - 5px) !important;
    max-width: calc(50% - 5px) !important;
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .home-todo-card,
  .home-todo-card dwains-dashboard-next-card-host {
    width: 100% !important;
    max-width: 100% !important;
  }
}

@media (max-width: 768px) {
  .sidebar .room-area-button .area-list-picture {
    opacity: 0.16 !important;
  }

  .sidebar .room-area-button .area-sensors.is-empty {
    display: none !important;
  }

  /* Grid mode returns to the requested two-column mobile Favorites layout. */
  .home-favorites-section.layout-grid .favorites-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 8px !important;
  }

  .home-favorites-section.layout-grid .favorite-card-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  /* Make the decorative background icon a little easier to read. */
  .home-favorites-section .favorite-icon {
    opacity: 0.14 !important;
  }

  /* Touch taps get feedback only while the pointer is down. Do not retain the
     desktop hover/focus transform after a mobile tap. */
  .home-favorites-section .favorite-card-wrapper,
  .home-favorites-section .favorite-card-wrapper:hover,
  .home-favorites-section .favorite-card-wrapper:focus,
  .home-favorites-section .favorite-card-wrapper:focus-visible {
    outline: none !important;
  }

  .home-favorites-section .favorite-card-wrapper:hover:not(:active),
  .home-favorites-section .favorite-card-wrapper:focus:not(:active),
  .home-favorites-section .favorite-card-wrapper:focus-visible:not(:active) {
    transform: none !important;
    box-shadow:
      0 12px 26px rgba(15, 23, 42, 0.06),
      inset 0 0 0 1px rgba(15, 23, 42, 0.035) !important;
  }

  .home-favorites-section .favorite-card-wrapper:active {
    transform: scale(0.985) !important;
  }

  /* To-do stays full width on mobile. */
  .home-todos-grid {
    width: 100% !important;
    max-width: 100% !important;
  }
}



/* 2026-10-08 follow-up: Home/mobile width, scrolling and desktop room header. */
@media (max-width: 768px) {
  /* Match the exact two-column Areas geometry. */
  .home-view .home-favorites-section {
    width: calc(100% + 20px) !important;
    max-width: none !important;
    margin-left: -10px !important;
    margin-right: -10px !important;
    overflow-x: visible !important;
  }

  .home-favorites-section.layout-grid .favorites-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
    padding: 3px 18px 32px !important;
  }

  /* Decorative Favorite icon: smaller, low-right under the title area. */
  .home-favorites-section .favorite-icon {
    left: auto !important;
    right: 10px !important;
    top: auto !important;
    bottom: 7px !important;
    width: 34px !important;
    height: 34px !important;
    transform: none !important;
    opacity: 0.14 !important;
  }

  .home-favorites-section .favorite-icon ha-icon {
    --mdc-icon-size: 30px !important;
  }

  /* Avoid creating a second vertical scroll container on Home.
     overflow-x:hidden makes overflow-y compute to auto; clip does not. */
  .home-view,
  .home-content-area {
    overflow-x: clip !important;
    overflow-y: visible !important;
  }

  /* The framed native todo card should align with all other mobile card surfaces. */
  .home-todo-card {
    border-radius: 16px !important;
    overflow: hidden !important;
  }

  .home-todo-card dwains-dashboard-next-card-host[framed] {
    --dd-replacement-radius: 16px;
    --dd-replacement-border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --dd-replacement-padding: 0px;
  }
}

@media (min-width: 769px) {
  /* Native todo cards use DD's normal rounded card surface on desktop as well. */
  .home-todo-card {
    border-radius: 12px !important;
    overflow: hidden !important;
  }

  .home-todo-card dwains-dashboard-next-card-host[framed] {
    --dd-replacement-radius: 12px;
    --dd-replacement-border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --dd-replacement-padding: 0px;
  }

  /* Room header picture becomes a subtle full-card background; the room icon
     remains the foreground media tile, matching the sidebar treatment. */
  .room-header.has-room-background {
    position: relative !important;
    isolation: isolate !important;
    overflow: hidden !important;
    background: var(--card-background-color) !important;
  }

  .room-header .dd-page-header-room-background {
    position: absolute !important;
    inset: 0 !important;
    z-index: 0 !important;
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    opacity: 0.13 !important;
    filter: saturate(0.72) contrast(0.94) !important;
    transform: scale(1.01) !important;
    pointer-events: none !important;
  }

  .room-header .dd-page-header-with-media {
    position: relative !important;
    z-index: 1 !important;
  }

  .room-header.has-room-background .dd-page-header-media-tile {
    background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color)) !important;
  }

  .room-header.has-room-background .dd-page-header-room-icon {
    color: var(--primary-color) !important;
    background: color-mix(in srgb, var(--primary-color) 11%, var(--card-background-color)) !important;
  }

  /* When the quick controls need more than one row, balance them rather than
     allowing flex-wrap to leave a single orphan tile on the last line. */
  .room-header .dd-page-header-strip[data-control-count="4"],
  .room-header .dd-page-header-strip[data-control-count="5"],
  .room-header .dd-page-header-strip[data-control-count="6"],
  .room-header .dd-page-header-strip[data-control-count="7"],
  .room-header .dd-page-header-strip[data-control-count="8"] {
    display: grid !important;
    grid-template-columns: repeat(var(--dd-room-quick-columns), max-content) !important;
    justify-content: start !important;
    align-items: center !important;
    gap: 8px !important;
  }

  .room-header .dd-page-header-strip[data-control-count="4"] > *,
  .room-header .dd-page-header-strip[data-control-count="5"] > *,
  .room-header .dd-page-header-strip[data-control-count="6"] > *,
  .room-header .dd-page-header-strip[data-control-count="7"] > *,
  .room-header .dd-page-header-strip[data-control-count="8"] > * {
    min-width: 0 !important;
  }

  /* Sidebar Home entry uses the same visual scale and surface as room entries. */
  .sidebar .area-button.home-button {
    background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)) !important;
    border-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
  }

  .sidebar .area-button.home-button .area-name {
    font-size: 14px !important;
    font-weight: 850 !important;
  }

  .sidebar .area-button.home-button .area-icon {
    width: 46px !important;
    height: 46px !important;
    border-radius: 10px !important;
    background: color-mix(in srgb, var(--primary-color) 11%, var(--card-background-color)) !important;
    color: var(--primary-color) !important;
  }

  .sidebar .area-button.home-button .area-icon ha-icon {
    --mdc-icon-size: 34px !important;
  }
}



/* 2026-10-08 correction pass: exact room-picture behavior, balanced desktop
   quick controls, Sidebar Home parity and mobile Favorite leading icons. */
@media (max-width: 768px) {
  /* Favorites: use a small, fully colored foreground icon directly before the name. */
  .home-favorites-section .favorite-card-wrapper {
    display: grid !important;
    grid-template-columns: 22px minmax(0, 1fr) auto !important;
    grid-template-rows: 1fr !important;
    align-items: center !important;
    column-gap: 8px !important;
  }

  .home-favorites-section .favorite-icon {
    position: static !important;
    grid-column: 1 !important;
    grid-row: 1 !important;
    width: 22px !important;
    height: 22px !important;
    margin: 0 !important;
    transform: none !important;
    opacity: 1 !important;
    color: var(--favorite-color) !important;
    background: transparent !important;
    align-self: center !important;
    justify-self: start !important;
    pointer-events: none !important;
  }

  .home-favorites-section .favorite-icon ha-icon {
    --mdc-icon-size: 18px !important;
    color: var(--favorite-color) !important;
  }

  .home-favorites-section .favorite-body {
    grid-column: 2 !important;
    grid-row: 1 !important;
    padding-left: 0 !important;
  }

  .home-favorites-section .favorite-end {
    grid-column: 3 !important;
    grid-row: 1 !important;
  }
}

@media (min-width: 769px) {
  /* Flatten the tile wrapper into the parent grid so the individual group
     controls and thermostat can actually share two balanced rows. */
  .room-header .dd-page-header-strip[data-control-count="4"] .dd-room-tiles,
  .room-header .dd-page-header-strip[data-control-count="5"] .dd-room-tiles,
  .room-header .dd-page-header-strip[data-control-count="6"] .dd-room-tiles,
  .room-header .dd-page-header-strip[data-control-count="7"] .dd-room-tiles,
  .room-header .dd-page-header-strip[data-control-count="8"] .dd-room-tiles {
    display: contents !important;
  }

  .room-header .dd-page-header-strip[data-control-count="4"],
  .room-header .dd-page-header-strip[data-control-count="5"],
  .room-header .dd-page-header-strip[data-control-count="6"],
  .room-header .dd-page-header-strip[data-control-count="7"],
  .room-header .dd-page-header-strip[data-control-count="8"] {
    display: grid !important;
    grid-template-columns: repeat(var(--dd-room-quick-columns), max-content) !important;
    grid-auto-flow: row !important;
    justify-content: start !important;
    align-items: center !important;
    gap: 8px !important;
  }

  /* Home uses exactly the same visible text scale as room names. */
  .sidebar .area-button.home-button .area-info .area-name {
    font-size: 15px !important;
    font-weight: 850 !important;
    line-height: 1.1 !important;
  }
}



/* 2026-10-08 small consistency follow-up. */
.room-header .dd-page-header-title-row .dd-page-header-home,
.dd-room-compact .dd-page-header-home {
  color: var(--primary-color) !important;
  background: color-mix(in srgb, var(--primary-color) 11%, var(--card-background-color)) !important;
}

.room-header .dd-page-header-title-row .dd-page-header-home:hover,
.dd-room-compact .dd-page-header-home:hover {
  color: var(--primary-color) !important;
  background: color-mix(in srgb, var(--primary-color) 17%, var(--card-background-color)) !important;
}

@media (min-width: 769px) {
  /* One desktop camera tile matches one large House Information card:
     three equal columns across the same Home content width. */
  .home-camera-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 10px !important;
    width: 100% !important;
    max-width: none !important;
  }

  .home-camera-card {
    width: 100% !important;
    min-width: 0 !important;
  }
}

/* Room edit DnD handles intentionally match Settings > Areas. */
.area-view .mobile-domain-leading-drag-handle,
.area-view .dd-generated-card-leading-drag-handle {
  width: 22px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 4px;
  display: grid;
  place-items: center;
  flex: 0 0 22px;
  color: var(--secondary-text-color);
  background: transparent;
  cursor: grab;
}
.area-view .mobile-domain-leading-drag-handle:hover,
.area-view .dd-generated-card-leading-drag-handle:hover {
  background: var(--primary-background-color);
  color: var(--primary-color);
}
.area-view .mobile-domain-leading-drag-handle ha-icon,
.area-view .dd-generated-card-leading-drag-handle ha-icon {
  --mdc-icon-size: 20px;
}


`;
