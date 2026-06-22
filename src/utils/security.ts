import type { DwainsDashboardSettings } from '../types/strategy';

export function isNonAdminUser(hass: any): boolean {
  return hass?.user?.is_admin === false;
}

export function restrictNonAdminHaSidebar(
  hass: any,
  settings?: DwainsDashboardSettings
): boolean {
  return settings?.restrict_non_admin_ha_sidebar === true && isNonAdminUser(hass);
}

export function restrictNonAdminDashboardSettings(
  hass: any,
  settings?: DwainsDashboardSettings
): boolean {
  return settings?.restrict_non_admin_dashboard_settings === true && isNonAdminUser(hass);
}
