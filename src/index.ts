import { DwainsDashboardStrategy } from './strategies/dashboard-strategy';
import { DwainsViewStrategy } from './strategies/view-strategy';

import './components/dwains-layout-card';
import './components/dwains-domain-entities-dialog';
import './components/dwains-dashboard-strategy-editor';
import './components/cards/dwains-flexbox-card';
import './components/dwains-page-card';
import './components/dwains-devices-card';
import './components/dwains-bottom-nav';
import './components/dwains-dashboard-settings-dialog';
import './components/dwains-replacement-manager-dialog';
import { DwainsDashboardCard } from './components/dwains-dashboard-card';
import { DwainsDashboardCardEditor } from './components/dwains-dashboard-card-editor';

console.log('Dwains Dashboard Next - Loading...');
console.log('%cDwains Dashboard Next 1.0.0', 'background:#3a7;color:#fff;padding:2px 8px;border-radius:6px;font-weight:bold');

// Safe element registration
const safeDefine = (name: string, constructor: CustomElementConstructor) => {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
    console.log(`✓ Registered: ${name}`);
  }
};

// Register strategies
safeDefine('ll-strategy-dashboard-dwains', class extends HTMLElement {
  static async generate(config: any, hass: any) {
    const strategy = new DwainsDashboardStrategy();
    return strategy.generate(config, hass);
  }

  static async getConfigElement() {
    return DwainsDashboardStrategy.getConfigElement();
  }
});

safeDefine('ll-strategy-view-dwains-view', class extends HTMLElement {
  static async generate(config: any, hass: any) {
    const strategy = new DwainsViewStrategy();
    return strategy.generate(config, hass);
  }
});

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
if (!window.customStrategies.some((s) => s?.type === 'dwains' && s?.strategyType === 'dashboard')) {
  window.customStrategies.push({
    type: 'dwains',
    strategyType: 'dashboard',
    name: 'Dwains Dashboard Next',
    description: 'Automatic dashboard based on your areas, devices and entities.',
    documentationURL: 'https://github.com/dwainscheeren/dwains-dashboard-next',
  });
  console.log('Registered Dwains Dashboard Next in the Add dashboard dialog');
}

// Register custom card elements immediately
safeDefine('dwains-dashboard-card', DwainsDashboardCard);
safeDefine('dwains-dashboard-card-editor', DwainsDashboardCardEditor);

// Register custom card in card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "dwains-dashboard-card",
  name: "Dwains Dashboard Next",
  preview: false,
  description: "A complete automatic building dashboard solution based on your HA Areas, Devices, Entities and Floors",
  documentationURL: "https://github.com/dwainscheeren/dwains-dashboard-next",
});

console.log('✓ Registered custom card: dwains-dashboard-card');

console.log('Dwains Dashboard Next - Loaded successfully!');

// Export for external use if needed
export { DwainsDashboardStrategy, DwainsViewStrategy, DwainsDashboardCard, DwainsDashboardCardEditor };
