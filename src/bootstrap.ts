import { DwainsDashboardStrategy } from './strategies/dashboard-strategy';
import { DwainsViewStrategy } from './strategies/view-strategy';

import { DD_NEXT_VERSION } from './version';

console.log('Dwains Dashboard Next - Loading...');
console.log(`%cDwains Dashboard Next ${DD_NEXT_VERSION}`, 'background:#3a7;color:#fff;padding:2px 8px;border-radius:6px;font-weight:bold');

const DASHBOARD_STRATEGY_TYPE = 'dwains-dashboard-next';
const VIEW_STRATEGY_TYPE = 'dwains-dashboard-next-view';
const DASHBOARD_STRATEGY_TAG = `ll-strategy-dashboard-${DASHBOARD_STRATEGY_TYPE}`;
const VIEW_STRATEGY_TAG = `ll-strategy-view-${VIEW_STRATEGY_TYPE}`;
const DASHBOARD_CARD_TYPE = 'dwains-dashboard-next-card';
let uiElementsReady: Promise<void> = Promise.resolve().then(() => loadUiElements());

// Safe element registration
const safeDefine = (name: string, constructor: CustomElementConstructor) => {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
    console.log(`✓ Registered: ${name}`);
  }
};

const createDashboardStrategyElement = () => class extends HTMLElement {
  static async generate(config: any, hass: any) {
    await uiElementsReady;
    const strategy = new DwainsDashboardStrategy();
    return strategy.generate(config, hass);
  }

  static async getConfigElement() {
    return DwainsDashboardStrategy.getConfigElement();
  }
};

const createViewStrategyElement = () => class extends HTMLElement {
  static async generate(config: any, hass: any) {
    await uiElementsReady;
    const strategy = new DwainsViewStrategy();
    return strategy.generate(config, hass);
  }
};

// Register strategies with Next-specific names so old Dwains Dashboard resources
// can run side by side without blocking the Add dashboard registration.
safeDefine(DASHBOARD_STRATEGY_TAG, createDashboardStrategyElement());
safeDefine(VIEW_STRATEGY_TAG, createViewStrategyElement());

// Backward-compatible aliases for early Next test installs. These are only
// defined when old Dwains Dashboard has not already claimed the same names.
safeDefine('ll-strategy-dashboard-dwains', createDashboardStrategyElement());
safeDefine('ll-strategy-view-dwains-view', createViewStrategyElement());

async function loadUiElements(): Promise<void> {
  try {
    // Only dashboard runtime elements are loaded up front. Editors and dialogs
    // stay in separate chunks and are loaded by the code path that opens them.
    const [
      { DwainsDashboardCard },
      { DwainsFlexboxCard },
      { DwainsHeadingCard },
    ] = await Promise.all([
      import('./components/dwains-dashboard-card'),
      import('./components/cards/dwains-flexbox-card'),
      import('./components/cards/dwains-heading-card'),
      import('./components/dwains-layout-card'),
      import('./components/dwains-page-card'),
      import('./components/dwains-devices-card'),
      import('./components/dwains-bottom-nav'),
    ]);

    safeDefine(DASHBOARD_CARD_TYPE, DwainsDashboardCard);
    safeDefine('dwains-flexbox-card', class extends DwainsFlexboxCard {});
    safeDefine('dwains-heading-card', DwainsHeadingCard);

    // Legacy card aliases for early Next configs when old DD is not installed.
    safeDefine('dwains-dashboard-card', class extends DwainsDashboardCard {});

    console.log('✓ Registered custom card: dwains-dashboard-next-card');
    console.log('Dwains Dashboard Next - Loaded successfully!');
  } catch (err) {
    console.error('Dwains Dashboard Next - Failed to load UI elements', err);
  }
}

// Global interface declaration
declare global {
  interface Window {
    __dwainsDashboardNextDefaultRedirectInstalled?: boolean;
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
    customStrategies?: Array<{
      type: string;
      strategyType: 'dashboard' | 'view';
      name: string;
      description?: string;
      documentationURL?: string;
    }>;
  }
}

function getHassFromDom(): any {
  const root = document.querySelector('home-assistant') as any;
  const main = document.querySelector('home-assistant-main') as any;
  return root?.hass || root?.__hass || main?.hass || (window as any).hass;
}

async function waitForHass(maxTries = 30): Promise<any | undefined> {
  for (let i = 0; i < maxTries; i += 1) {
    const hass = getHassFromDom();
    if (hass?.callWS) return hass;
    await new Promise((resolve) => window.setTimeout(resolve, i < 5 ? 100 : 250));
  }
  return undefined;
}

function shouldCorrectHomeFallback(pathname: string): boolean {
  return pathname === '/' ||
    pathname === '/home' ||
    pathname === '/home/' ||
    pathname === '/home/overview' ||
    pathname.startsWith('/home/overview/');
}

async function defaultPanelIsDwainsDashboardNext(hass: any, panel: string): Promise<boolean> {
  try {
    const dashboards = await hass.callWS({ type: 'lovelace/dashboards/list' });
    const dashboard = Array.isArray(dashboards)
      ? dashboards.find((entry: any) => entry?.url_path === panel)
      : undefined;
    if (!dashboard) return false;

    const config = await hass.callWS({ type: 'lovelace/config', url_path: panel });
    return config?.strategy?.type === `custom:${DASHBOARD_STRATEGY_TYPE}` ||
      config?.strategy?.type === 'custom:dwains';
  } catch {
    return false;
  }
}

function installDefaultDashboardRedirect(): void {
  if (window.__dwainsDashboardNextDefaultRedirectInstalled) return;
  window.__dwainsDashboardNextDefaultRedirectInstalled = true;

  let pending = false;
  const correct = async () => {
    const pathname = window.location.pathname || '/';
    if (!shouldCorrectHomeFallback(pathname)) return;
    if (pending) return;
    pending = true;

    try {
      const hass = await waitForHass();
      const defaultPanel = String(hass?.userData?.default_panel || '').trim();
      if (!hass || !defaultPanel || defaultPanel === 'home') return;
      if (!(await defaultPanelIsDwainsDashboardNext(hass, defaultPanel))) return;

      const target = `/${defaultPanel}/home${window.location.search || ''}${window.location.hash || ''}`;
      if (window.location.pathname === `/${defaultPanel}/home`) return;
      window.history.replaceState(window.history.state || null, '', target);
      window.dispatchEvent(new CustomEvent('location-changed', {
        bubbles: true,
        composed: true,
        detail: { replace: true },
      }));
    } finally {
      pending = false;
    }
  };

  correct();
  window.addEventListener('location-changed', correct);
  window.addEventListener('popstate', correct);
  window.setTimeout(correct, 750);
  window.setTimeout(correct, 1600);
}


function installMobileMoreInfoDialogSizing(): void {
  const hostStyleId = 'dd-next-mobile-more-info-host-sizing';
  const dialogStyleId = 'dd-next-mobile-ha-dialog-sizing';
  const installedDialogs = new Set<HTMLElement>();

  const installMoreInfoHost = (element: Element): void => {
    const host = element as HTMLElement;
    const root = host.shadowRoot;
    if (!root || root.getElementById(hostStyleId)) return;

    const style = document.createElement('style');
    style.id = hostStyleId;
    style.textContent = `
      @media (max-width: 768px) {
        :host {
          --mdc-dialog-min-height: 0 !important;
          --ha-dialog-min-height: 0 !important;
          --mdc-dialog-max-height: 88dvh !important;
          --ha-dialog-max-height: 88dvh !important;
          --vertical-align-dialog: flex-end !important;
          --dialog-surface-margin-top: auto !important;
          --dialog-container-padding: 0 !important;
        }
      }
    `;
    root.appendChild(style);
  };

  const updateDialogViewport = (dialog: HTMLElement): void => {
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight;
    const bottom = Math.max(0, window.innerHeight - height - (viewport?.offsetTop || 0));
    // Update only geometry that changed; do not repeatedly resize an open dialog.
    for (const [name, value] of [
      ['--dd-native-dialog-viewport-height', `${height}px`],
      ['--dd-native-dialog-bottom', `${bottom}px`],
    ] as const) {
      if (dialog.style.getPropertyValue(name) !== value) dialog.style.setProperty(name, value);
    }
  };

  const installHaDialog = (element: Element): void => {
    const dialog = element as HTMLElement;
    installedDialogs.add(dialog);
    updateDialogViewport(dialog);

    const root = dialog.shadowRoot;
    if (!root || root.getElementById(dialogStyleId)) return;

    const style = document.createElement('style');
    style.id = dialogStyleId;
    style.textContent = `
      @media (max-width: 768px) {
        :host {
          --mdc-dialog-min-height: 0 !important;
          --ha-dialog-min-height: 0 !important;
          --mdc-dialog-max-height: calc(var(--dd-native-dialog-viewport-height, 100dvh) * .88) !important;
          --ha-dialog-max-height: calc(var(--dd-native-dialog-viewport-height, 100dvh) * .88) !important;
          --vertical-align-dialog: flex-end !important;
          --dialog-surface-margin-top: auto !important;
        }

        .mdc-dialog__container {
          align-items: flex-end !important;
          padding-top: max(env(safe-area-inset-top, 0px), 12px) !important;
          padding-bottom: var(--dd-native-dialog-bottom, 0px) !important;
          box-sizing: border-box !important;
        }

        .mdc-dialog__surface,
        wa-dialog::part(dialog) {
          height: auto !important;
          min-height: 0 !important;
          max-height: min(
            calc(var(--dd-native-dialog-viewport-height, 100dvh) * .88),
            calc(var(--dd-native-dialog-viewport-height, 100dvh) - max(env(safe-area-inset-top, 0px), 12px))
          ) !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          border-radius: 24px 24px 0 0 !important;
        }

        wa-dialog::part(dialog) {
          top: auto !important;
          bottom: var(--dd-native-dialog-bottom, 0px) !important;
          margin-top: auto !important;
          margin-bottom: 0 !important;
        }

        .mdc-dialog__content,
        .content,
        .body {
          min-height: 0 !important;
          overflow-y: auto !important;
          overscroll-behavior-y: contain !important;
        }
      }
    `;
    root.appendChild(style);
  };

  const scan = (root: Document | ShadowRoot): void => {
    root.querySelectorAll('ha-more-info-dialog').forEach(installMoreInfoHost);
    root.querySelectorAll('ha-dialog').forEach(installHaDialog);

    root.querySelectorAll('*').forEach((element) => {
      const shadowRoot = (element as HTMLElement).shadowRoot;
      if (shadowRoot) scan(shadowRoot);
    });
  };

  let scheduled = false;
  const scheduleScan = () => {
    if (scheduled || window.innerWidth > 768) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan(document);
    });
  };

  const rescanAfterOpen = () => {
    scheduleScan();
    [40, 120, 280, 600].forEach(delay => window.setTimeout(scheduleScan, delay));
  };

  window.addEventListener('hass-more-info', rescanAfterOpen, true);
  window.addEventListener('resize', scheduleScan);
  const updateInstalledViewports = () => {
    if (window.innerWidth > 768) return;
    installedDialogs.forEach(dialog => {
      if (dialog.isConnected) updateDialogViewport(dialog);
      else installedDialogs.delete(dialog);
    });
  };
  window.visualViewport?.addEventListener('resize', updateInstalledViewports);
  window.visualViewport?.addEventListener('scroll', updateInstalledViewports);
  scheduleScan();
}

installDefaultDashboardRedirect();
installMobileMoreInfoDialogSizing();

// Register the dashboard strategy in Home Assistant's Add dashboard dialog.
// This appears under Community dashboards and requires HA 2026.5+.
if (window.customStrategies == null) {
  window.customStrategies = [];
}

if (!Array.isArray(window.customStrategies)) {
  console.warn(
    'Dwains Dashboard Next - Skipped Add dashboard registration because window.customStrategies is not an array.',
    window.customStrategies,
  );
} else if (!window.customStrategies.some((s) =>
  s?.type === DASHBOARD_STRATEGY_TYPE && s?.strategyType === 'dashboard'
)) {
  window.customStrategies.push({
    type: DASHBOARD_STRATEGY_TYPE,
    strategyType: 'dashboard',
    name: 'Dwains Dashboard Next',
    description: 'Automatic dashboard based on your areas, devices and entities.',
    documentationURL: 'https://github.com/dwainscheeren/dwains-dashboard-next',
  });
  console.log('Registered Dwains Dashboard Next in the Add dashboard dialog');
}

// Register custom card in card picker
if (window.customCards == null) {
  window.customCards = [];
}

if (!Array.isArray(window.customCards)) {
  console.warn(
    'Dwains Dashboard Next - Skipped card picker registration because window.customCards is not an array.',
    window.customCards,
  );
} else if (!window.customCards.some((card) => card?.type === DASHBOARD_CARD_TYPE)) {
  window.customCards.push({
    type: DASHBOARD_CARD_TYPE,
    name: "Dwains Dashboard Next",
    preview: false,
    description: "A complete automatic building dashboard solution based on your HA Areas, Devices, Entities and Floors",
    documentationURL: "https://github.com/dwainscheeren/dwains-dashboard-next",
  });
}
