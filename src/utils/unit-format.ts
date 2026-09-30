import type { HassEntity, HomeAssistant } from '../types/home-assistant';

export const NARROW_NBSP = '\u202F';

export function formatValueWithUnit(
  value: string | number,
  unit: string | null | undefined
): string {
  const formattedValue = String(value);
  const formattedUnit = String(unit || '').trim();
  return formattedUnit ? `${formattedValue} ${formattedUnit}` : formattedValue;
}

export function normalizeUnitSpacing(
  formattedState: string,
  unit: string | null | undefined
): string {
  const formattedUnit = String(unit || '').trim();
  if (!formattedState || !formattedUnit || !formattedState.endsWith(formattedUnit)) {
    return formattedState;
  }

  const value = formattedState.slice(0, -formattedUnit.length).trimEnd();
  return `${value} ${formattedUnit}`;
}

export function formatEntityStateWithUnit(
  hass: HomeAssistant,
  state: HassEntity
): string {
  try {
    return normalizeUnitSpacing(
      hass.formatEntityState(state),
      state.attributes?.unit_of_measurement
    );
  } catch {
    return String(state?.state || '');
  }
}
