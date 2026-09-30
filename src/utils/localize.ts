import {
  loadTranslations,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  type SupportedLanguage,
  type TranslationKey,
} from '../i18n';
import { getPluralRules } from './intl-cache';

// ddLocalize runs a few hundred times per render, so the resolved language is
// cached per raw Home Assistant language string.
const resolvedLanguages = new Map<string, SupportedLanguage>();

/**
 * Resolve the Home Assistant locale to a supported dashboard language.
 * Regional variants progressively fall back, for example de-DE -> de.
 */
export function ddLang(hass: any): SupportedLanguage {
  const input = hass?.locale?.language || hass?.language || 'en';
  if (typeof input !== 'string') return resolveLanguage(String(input));

  let lang = resolvedLanguages.get(input);
  if (!lang) {
    lang = resolveLanguage(input);
    resolvedLanguages.set(input, lang);
  }
  return lang;
}

function resolveLanguage(input: string): SupportedLanguage {
  const raw = input
    .trim()
    .toLowerCase()
    .replace(/_/g, '-');

  if (/^zh-(hant|tw|hk|mo)(-|$)/.test(raw) || raw === 'zh') return 'zh-hant';
  if (/^zh-(hans|cn|sg)(-|$)/.test(raw)) return 'zh-hans';

  const parts = raw.split('-');
  while (parts.length) {
    const candidate = parts.join('-') as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.includes(candidate)) return candidate;
    parts.pop();
  }

  return 'en';
}

export function ddLocale(hass: any): string {
  const raw = String(hass?.locale?.language || hass?.language || '').trim();
  return raw || ddLang(hass);
}

/**
 * Vertaal een sleutel naar de actieve taal. Onbekende sleutels vallen terug op
 * Engels en daarna op de sleutel zelf. Variabelen worden als {naam} vervangen.
 */
export function ddLocalize(
  hass: any,
  key: TranslationKey | string,
  vars?: Record<string, string | number>
): string {
  const lang = ddLang(hass);
  const dict = TRANSLATIONS[lang];
  // Not loaded yet: fall back to English and load it for the next render.
  if (!dict) void loadTranslations(lang);
  const localized = (dict || TRANSLATIONS.en) as Record<string, string>;
  const english = TRANSLATIONS.en as Record<string, string>;
  let str = localized[key] ?? english[key] ?? key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.split(`{${k}}`).join(String(vars[k]));
    }
  }
  return str;
}

export function ddLocalizePlural(
  hass: any,
  key: string,
  count: number,
  vars?: Record<string, string | number>
): string {
  const category = getPluralRules(ddLocale(hass)).select(count);
  return ddLocalize(hass, `${key}.${category === 'one' ? 'one' : 'other'}`, {
    count,
    ...vars,
  });
}

export function hasDdTranslation(key: string): key is TranslationKey {
  return Object.prototype.hasOwnProperty.call(TRANSLATIONS.en, key);
}
