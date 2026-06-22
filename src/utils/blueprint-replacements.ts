import type {
  BlueprintReplacementAssignment,
  BlueprintReplacementGroup,
  BlueprintReplacementSurface,
  BlueprintReplacements,
  DwainsDashboardConfig,
  EntityConfig,
  LovelaceCardConfig,
} from '../types/strategy';
import type { HomeAssistant } from '../types/home-assistant';
import {
  defaultValues,
  parseBlueprintYaml,
  resolveBlueprintCard,
  type ParsedBlueprint,
} from './blueprints';

interface ResolveReplacementParams {
  hass: HomeAssistant;
  config?: DwainsDashboardConfig;
  entity: EntityConfig | string;
  surface: BlueprintReplacementSurface;
}

const parsedCache = new WeakMap<BlueprintReplacementAssignment, ParsedBlueprint>();

export function defaultEntityCardConfig(entityId: string, hass?: HomeAssistant): LovelaceCardConfig {
  const domain = entityId.split('.')[0] || '';
  if (domain === 'climate') return { type: 'thermostat', entity: entityId };
  if (domain === 'camera') return { type: 'picture-entity', entity: entityId, camera_view: 'live' };
  if (domain === 'media_player') return { type: 'media-control', entity: entityId };
  if (domain === 'light') return defaultLightCardConfig(entityId, hass);
  if (domain === 'cover') return defaultCoverCardConfig(entityId, hass);
  if (domain === 'sensor') return defaultSensorCardConfig(entityId, hass);
  if (domain === 'binary_sensor') return defaultBinarySensorCardConfig(entityId, hass);
  return { type: 'tile', entity: entityId };
}

function defaultLightCardConfig(entityId: string, hass?: HomeAssistant): LovelaceCardConfig {
  const state = hass?.states?.[entityId];
  const attrs = state?.attributes || {};
  const supportedModes = new Set((attrs.supported_color_modes || []).map(String));
  const colorMode = String(attrs.color_mode || '');
  const brightnessModes = ['brightness', 'color_temp', 'hs', 'xy', 'rgb', 'rgbw', 'rgbww', 'white'];
  const supportsBrightness =
    typeof attrs.brightness === 'number' ||
    brightnessModes.some((mode) => supportedModes.has(mode) || colorMode === mode);
  const supportsColorTemp =
    supportedModes.has('color_temp') ||
    colorMode === 'color_temp' ||
    attrs.color_temp_kelvin !== undefined ||
    attrs.min_color_temp_kelvin !== undefined;
  const features: LovelaceCardConfig[] = [];
  if (supportsBrightness) features.push({ type: 'light-brightness' });
  if (supportsColorTemp) features.push({ type: 'light-color-temp' });

  return {
    type: 'tile',
    entity: entityId,
    state_content: supportsBrightness ? ['state', 'brightness'] : 'state',
    tap_action: { action: 'toggle' },
    hold_action: { action: 'more-info' },
    ...(features.length ? {
      features_position: 'bottom',
      features,
    } : {}),
  };
}

function defaultCoverCardConfig(entityId: string, hass?: HomeAssistant): LovelaceCardConfig {
  const state = hass?.states?.[entityId];
  const supported = Number(state?.attributes?.supported_features);
  const supportsPosition =
    typeof state?.attributes?.current_position === 'number' ||
    (Number.isFinite(supported) && (supported & 4) !== 0);
  const features: LovelaceCardConfig[] = [{ type: 'cover-open-close' }];
  if (supportsPosition) features.push({ type: 'cover-position' });

  return {
    type: 'tile',
    entity: entityId,
    state_content: supportsPosition ? ['state', 'current_position'] : 'state',
    features_position: 'bottom',
    features,
  };
}

function defaultSensorCardConfig(entityId: string, hass?: HomeAssistant): LovelaceCardConfig {
  const state = hass?.states?.[entityId];
  const hasMeasurement = state?.attributes?.unit_of_measurement !== undefined;
  if (!hasMeasurement) return { type: 'tile', entity: entityId };

  return {
    type: 'sensor',
    entity: entityId,
    graph: 'line',
    hours_to_show: 24,
    detail: 1,
  };
}

function defaultBinarySensorCardConfig(entityId: string, hass?: HomeAssistant): LovelaceCardConfig {
  const state = hass?.states?.[entityId];
  const deviceClass = String(state?.attributes?.device_class || '');
  if (deviceClass !== 'motion' && deviceClass !== 'occupancy' && deviceClass !== 'presence') {
    return { type: 'tile', entity: entityId };
  }

  return {
    type: 'tile',
    entity: entityId,
    state_content: ['state', 'last_changed'],
  };
}

export function resolveEntityCardConfig(params: ResolveReplacementParams): LovelaceCardConfig {
  const entityId = typeof params.entity === 'string' ? params.entity : params.entity.entity_id;
  const assignment = findReplacementAssignment(params);
  if (!assignment || assignment.enabled === false) return defaultEntityCardConfig(entityId, params.hass);

  try {
    const parsed = parsedAssignment(assignment);
    const values = {
      ...defaultValues(parsed.meta),
      ...(assignment.inputs || {}),
      ...syntheticValues(params.hass, params.config, entityId),
    };
    return resolveBlueprintCard(parsed.card, parsed.meta, values);
  } catch (e) {
    console.warn('Dwains replacement blueprint failed; using default card.', assignment.name, e);
    return defaultEntityCardConfig(entityId, params.hass);
  }
}

export function findReplacementAssignment(
  params: ResolveReplacementParams
): BlueprintReplacementAssignment | undefined {
  const entityId = typeof params.entity === 'string' ? params.entity : params.entity.entity_id;
  const group = params.config?.blueprint_replacements?.[params.surface];
  const fallbackGroup =
    params.config?.blueprint_replacements?.[
      params.surface === 'area_cards' ? 'devices_cards' : 'area_cards'
    ];

  const domain = entityId.split('.')[0] || '';
  const deviceClass = deviceClassFor(params.hass, entityId);
  const deviceClassKey = deviceClass ? `${domain}:${deviceClass}` : '';

  return matchReplacementGroup(group, entityId, domain, deviceClassKey) ||
    matchReplacementGroup(fallbackGroup, entityId, domain, deviceClassKey);
}

function matchReplacementGroup(
  group: BlueprintReplacementGroup | undefined,
  entityId: string,
  domain: string,
  deviceClassKey: string
): BlueprintReplacementAssignment | undefined {
  if (!group) return undefined;
  return (
    group.by_entity?.[entityId] ||
    (deviceClassKey ? group.by_device_class?.[deviceClassKey] : undefined) ||
    group.by_domain?.[domain]
  );
}

export function countReplacementAssignments(group?: BlueprintReplacementGroup): number {
  if (!group) return 0;
  return (
    Object.keys(group.by_domain || {}).length +
    Object.keys(group.by_device_class || {}).length +
    Object.keys(group.by_entity || {}).length
  );
}

export function countReplacementRules(replacements?: BlueprintReplacements): number {
  if (!replacements) return 0;
  const keys = new Set<string>();
  const addGroup = (group?: BlueprintReplacementGroup) => {
    (['by_domain', 'by_device_class', 'by_entity'] as const).forEach((kind) => {
      Object.keys(group?.[kind] || {}).forEach((target) => keys.add(`${kind}:${target}`));
    });
  };
  addGroup(replacements.area_cards);
  addGroup(replacements.devices_cards);
  return keys.size;
}

export function friendlyEntityName(hass: HomeAssistant, entityId: string): string {
  const state = hass.states?.[entityId];
  return state?.attributes?.friendly_name || entityId;
}

export function deviceClassFor(hass: HomeAssistant, entityId: string): string {
  const state = hass.states?.[entityId];
  return String(state?.attributes?.device_class || '');
}

function parsedAssignment(assignment: BlueprintReplacementAssignment): ParsedBlueprint {
  const cached = parsedCache.get(assignment);
  if (cached) return cached;
  const parsed = parseBlueprintYaml(assignment.blueprint);
  parsedCache.set(assignment, parsed);
  return parsed;
}

function syntheticValues(
  hass: HomeAssistant,
  config: DwainsDashboardConfig | undefined,
  entityId: string
): Record<string, string> {
  const domain = entityId.split('.')[0] || '';
  const deviceClass = deviceClassFor(hass, entityId);
  const areaName = areaNameFor(hass, config, entityId);
  return {
    replace_with_input_entity: entityId,
    replace_with_input_entity_id: entityId,
    replace_with_input_name: friendlyEntityName(hass, entityId),
    replace_with_input_domain: domain,
    replace_with_input_device_class: deviceClass,
    replace_with_input_area: areaName,
  };
}

function areaNameFor(
  hass: HomeAssistant,
  config: DwainsDashboardConfig | undefined,
  entityId: string
): string {
  const registryEntity = config?.entities?.find((entity) => entity.entity_id === entityId);
  const registryDevice = registryEntity?.device_id
    ? config?.devices?.find((device) => device.device_id === registryEntity.device_id)
    : undefined;
  const areaId =
    registryEntity?.area_id ||
    registryDevice?.area_id ||
    (hass.entities as any)?.[entityId]?.area_id ||
    '';
  return config?.areas?.find((area) => area.area_id === areaId)?.name || areaId || '';
}
