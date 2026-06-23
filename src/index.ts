import { DwainsDashboardStrategy } from './strategies/dashboard-strategy';
import { DwainsViewStrategy } from './strategies/view-strategy';

import './components/dwains-layout-card';
import './components/dwains-domain-entities-dialog';
import './components/dwains-dashboard-strategy-editor';
import { DwainsFlexboxCard } from './components/cards/dwains-flexbox-card';
import './components/dwains-page-card';
import './components/dwains-devices-card';
import './components/dwains-bottom-nav';
import './components/dwains-dashboard-settings-dialog';
import './components/dwains-replacement-manager-dialog';
import { DwainsDashboardCard } from './components/dwains-dashboard-card';
import { DwainsDashboardCardEditor } from './components/dwains-dashboard-card-editor';

console.log('Dwains Dashboard Next - Loading...');
console.log('%cDwains Dashboard Next 1.1.3', 'background:#3a7;color:#fff;padding:2px 8px;border-radius:6px;font-weight:bold');

const DASHBOARD_STRATEGY_TYPE = 'dwains-dashboard-next';
const VIEW_STRATEGY_TYPE = 'dwains-dashboard-next-view';
const DASHBOARD_STRATEGY_TAG = `ll-strategy-dashboard-${DASHBOARD_STRATEGY_TYPE}`;
const VIEW_STRATEGY_TAG = `ll-strategy-view-${VIEW_STRATEGY_TYPE}`;
const DASHBOARD_CARD_TYPE = 'dwains-dashboard-next-card';

// Safe element registration
const safeDefine = (name: string, constructor: CustomElementConstructor) => {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
    console.log(`✓ Registered: ${name}`);
  }
};

const createDashboardStrategyElement = () => class extends HTMLElement {
  static async generate(config: any, hass: any) {
    const strategy = new DwainsDashboardStrategy();
    return strategy.generate(config, hass);
  }

  static async getConfigElement() {
    return DwainsDashboardStrategy.getConfigElement();
  }
};

const createViewStrategyElement = () => class extends HTMLElement {
  static async generate(config: any, hass: any) {
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

// Global interface declaration
declare global {
  interface Window {
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

// Register the dashboard strategy in Home Assistant's Add dashboard dialog.
// This appears under Community dashboards and requires HA 2026.5+.
window.customStrategies = window.customStrategies || [];
if (!window.customStrategies.some((s) => s?.type === DASHBOARD_STRATEGY_TYPE && s?.strategyType === 'dashboard')) {
  window.customStrategies.push({
    type: DASHBOARD_STRATEGY_TYPE,
    strategyType: 'dashboard',
    name: 'Dwains Dashboard Next',
    description: 'Automatic dashboard based on your areas, devices and entities.',
    documentationURL: 'https://github.com/dwainscheeren/dwains-dashboard-next',
  });
  console.log('Registered Dwains Dashboard Next in the Add dashboard dialog');
}

// Register custom card elements immediately
safeDefine(DASHBOARD_CARD_TYPE, DwainsDashboardCard);
safeDefine('dwains-dashboard-next-card-editor', DwainsDashboardCardEditor);
safeDefine('dwains-flexbox-card', class extends DwainsFlexboxCard {});

// Legacy card aliases for early Next configs when old DD is not installed.
safeDefine('dwains-dashboard-card', class extends DwainsDashboardCard {});
safeDefine('dwains-dashboard-card-editor', class extends DwainsDashboardCardEditor {});

// Register custom card in card picker
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card?.type === DASHBOARD_CARD_TYPE)) {
  window.customCards.push({
    type: DASHBOARD_CARD_TYPE,
    name: "Dwains Dashboard Next",
    preview: false,
    description: "A complete automatic building dashboard solution based on your HA Areas, Devices, Entities and Floors",
    documentationURL: "https://github.com/dwainscheeren/dwains-dashboard-next",
  });
}

console.log('✓ Registered custom card: dwains-dashboard-next-card');

console.log('Dwains Dashboard Next - Loaded successfully!');

// Export for external use if needed
export { DwainsDashboardStrategy, DwainsViewStrategy, DwainsDashboardCard, DwainsDashboardCardEditor };
