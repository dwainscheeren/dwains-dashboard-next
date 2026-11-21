import type { DwainsDashboardSettings } from '../types/strategy';

// Entity names often repeat the room: "Living room Ceiling light" or
// "Ceiling light (Living room)". Pages and groups that already show the room
// drop that part, so the tile reads "Ceiling light".

/** Characters that may sit between an area name and the rest of a name. */
const SEPARATOR_CHARS = String.raw`\-_:|/·–—`;
/** A separator that is required: whitespace and/or punctuation. */
const SEPARATOR = String.raw`(?:\s*[${SEPARATOR_CHARS}]+\s*|\s+)`;
/** Next to a bracketed area name the separator may be left out. */
const OPTIONAL_SEPARATOR = String.raw`(?:\s*[${SEPARATOR_CHARS}]+\s*|\s*)`;

/**
 * Articles and prepositions in the supported languages. When one of these is
 * right in front of the area name at the end ("Lamp in the kitchen", "Licht
 * im Wohnzimmer"), the area name is part of the sentence and stays.
 */
const LINKING_WORDS = new Set([
  'a', 'an', 'at', 'by', 'for', 'in', 'into', 'of', 'on', 'the', 'to',
  'aan', 'bij', 'de', 'den', 'der', 'het', 'naar', 'op', 'van', 'voor',
  'am', 'an', 'auf', 'beim', 'das', 'dem', 'die', 'im', 'ins', 'vom', 'zum', 'zur',
  'au', 'aux', 'dans', 'des', 'du', 'la', 'le', 'les', 'sur', 'un', 'une',
  'al', 'con', 'del', 'el', 'en', 'las', 'los', 'para', 'por',
  'da', 'di', 'il', 'lo', 'nel', 'nella', 'per', 'sul', 'sulla',
  'do', 'dos', 'na', 'no', 'nos', 'o', 'os',
  'в', 'во', 'на', 'у',
]);

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function capitalizeFirstWord(name: string): string {
  const firstWord = name.split(/\s/, 1)[0] || '';
  // Keep brand style names like "iPhone" or "HomePod" untouched, like Home Assistant does.
  if (firstWord !== firstWord.toLowerCase()) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export interface StripAreaNameOptions {
  /** Also remove the area name at the end of the name. Default true. */
  atEnd?: boolean;
}

/**
 * Removes the area name from the start or the end of an entity name. Only the
 * whole area name is removed, as a separate word or between brackets: in the
 * area "Kitchen", "Kitchen Spots", "Spots - Kitchen" and "Spots (Kitchen)"
 * become "Spots", while "Kitchenette lamp" stays as it is. The match ignores
 * case and the result is never empty: a name that is only the area name is
 * returned unchanged.
 */
export function stripAreaNameFromEntityName(
  name: string,
  areaName?: string | null,
  options: StripAreaNameOptions = {}
): string {
  const original = String(name ?? '');
  const trimmed = original.trim();
  const area = String(areaName ?? '').trim();
  if (!trimmed || !area) return original;

  // Any run of whitespace in the area name matches any run in the entity name.
  const escapedArea = escapeRegExp(area).replace(/\s+/g, String.raw`\s+`);
  const bracketed = String.raw`(?:\(\s*${escapedArea}\s*\)|\[\s*${escapedArea}\s*\])`;
  const atStart = new RegExp(`^(?:${bracketed}${OPTIONAL_SEPARATOR}|${escapedArea}${SEPARATOR})`, 'iu');
  // At the end a bracket or punctuation always marks the area name; after a
  // plain space it only counts when no article or preposition comes first.
  const atEndMarked = new RegExp(`(?:${OPTIONAL_SEPARATOR}${bracketed}|\\s*[${SEPARATOR_CHARS}]+\\s*${escapedArea})$`, 'iu');
  const atEndPlain = new RegExp(`\\s+${escapedArea}$`, 'iu');

  let result = trimmed;
  const withoutStart = result.replace(atStart, '');
  const strippedStart = withoutStart !== result;
  result = withoutStart.trim();
  if (options.atEnd !== false && result) {
    if (atEndMarked.test(result)) {
      result = result.replace(atEndMarked, '').trim();
    } else if (atEndPlain.test(result)) {
      const rest = result.replace(atEndPlain, '').trim();
      const lastWord = rest.split(/\s+/).pop()?.toLocaleLowerCase() || '';
      if (!LINKING_WORDS.has(lastWord)) result = rest;
    }
  }

  if (!result) return original;
  return strippedStart ? capitalizeFirstWord(result) : result;
}

/**
 * Whether entity names drop the area name on pages that already show the
 * area. On by default, so the setting only stores an opt-out.
 */
export function hidesAreaNameInEntityNames(settings?: DwainsDashboardSettings | null): boolean {
  return settings?.hide_area_name_in_entity_names !== false;
}

/** The name to show for an entity inside its area, following the setting. */
export function areaEntityDisplayName(
  name: string,
  areaName: string | null | undefined,
  settings?: DwainsDashboardSettings | null
): string {
  return hidesAreaNameInEntityNames(settings) ? stripAreaNameFromEntityName(name, areaName) : name;
}

/** Prefer the user's entity-specific registry name over a composed friendly_name.
 * If Home Assistant exposes no independent entity name, preserve friendly_name.
 * Area-name stripping remains a separate, independently controlled step.
 */
export function registryEntityDisplayName(
  fullName: string,
  areaName: string | null | undefined,
  settings: DwainsDashboardSettings | null | undefined,
  registryName?: string | null,
): string {
  const specificName = typeof registryName === 'string' ? registryName.trim() : '';
  const selectedName = settings?.use_entity_name_only === true && specificName
    ? specificName : fullName;
  return areaEntityDisplayName(selectedName, areaName, settings);
}
