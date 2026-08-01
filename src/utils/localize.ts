import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  type SupportedLanguage,
  type TranslationKey,
} from '../i18n';

/**
 * Resolve the Home Assistant locale to a supported dashboard language.
 * Regional variants progressively fall back, for example de-DE -> de.
 */
export function ddLang(hass: any): SupportedLanguage {
  const raw = String(hass?.locale?.language || hass?.language || 'en')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-');

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
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const localized = dict as Record<string, string>;
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
  const category = new Intl.PluralRules(ddLocale(hass)).select(count);
  return ddLocalize(hass, `${key}.${category === 'one' ? 'one' : 'other'}`, {
    count,
    ...vars,
  });
}

export function hasDdTranslation(key: string): key is TranslationKey {
  return Object.prototype.hasOwnProperty.call(TRANSLATIONS.en, key);
}
