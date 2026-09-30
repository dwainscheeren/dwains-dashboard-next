import type { HomeAssistant } from '../types/home-assistant';
import type { DwainsDashboardConfig, EntityConfig } from '../types/strategy';
import { isEntityFromHiddenDevice } from './device-admission';
import { getAreaConfigMap, getAreaHiddenEntityIdSet, getHiddenAreaIdSet } from './entity-lookups';
import { getEntityRegistry } from './entity-registry';

/**
 * The registry fields that decide whether an entity is shown. `getEntityRegistry(hass)`
 * holds either full registry entries (`hidden_by`, `disabled_by`, set by the
 * dashboard strategy) or the display entries of the Home Assistant frontend
 * (`hidden: true`), so both spellings are checked.
 */
export interface RegistryVisibilityFields {
  hidden_by?: string | null;
  hidden?: boolean;
  disabled_by?: string | null;
  entity_category?: string | null;
}

/**
 * True when Home Assistant would show the entity on a dashboard: it is not
 * hidden, not disabled and not a config or diagnostic entity. Room pages,
 * Home counts and the power totals all use this rule.
 */
export function isRegistryEntryVisible(entry: RegistryVisibilityFields | null | undefined): boolean {
  if (!entry) return true;
  return !(
    entry.hidden_by ||
    entry.hidden === true ||
    entry.disabled_by ||
    entry.entity_category === 'config' ||
    entry.entity_category === 'diagnostic'
  );
}

/**
 * True when the entity is shown on the room page of `areaId`: visible in the
 * registry, not part of a hidden device, and the area exists, is not hidden
 * and does not hide the entity in one of its groups.
 */
export function isEntityVisibleInArea(
  hass: HomeAssistant | undefined,
  config: DwainsDashboardConfig | null | undefined,
  entityId: string,
  areaId: string | null | undefined,
  entityConfig?: EntityConfig
): boolean {
  if (!isRegistryEntryVisible(getEntityRegistry(hass)[entityId])) return false;
  if (isEntityFromHiddenDevice(hass, config || undefined, entityConfig || entityId)) return false;
  if (!areaId) return false;
  if (!getAreaConfigMap(config).has(areaId)) return false;
  if (getHiddenAreaIdSet(config).has(areaId)) return false;
  if (getAreaHiddenEntityIdSet(config, areaId).has(entityId)) return false;
  return true;
}
