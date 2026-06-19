import { TRANSLATIONS, type Lang } from './translations';

/**
 * Bepaal de actieve taal op basis van de HA-taal. Engels is de standaard;
 * Nederlands wordt gekozen wanneer de HA-taal met "nl" begint.
 */
export function ddLang(hass: any): Lang {
  const raw = (hass?.language || hass?.locale?.language || 'en').toString().toLowerCase();
  return raw.startsWith('nl') ? 'nl' : 'en';
}

/**
 * Vertaal een sleutel naar de actieve taal. Onbekende sleutels vallen terug op
 * Engels en daarna op de sleutel zelf. Variabelen worden als {naam} vervangen.
 */
export function ddLocalize(
  hass: any,
  key: string,
  vars?: Record<string, string | number>
): string {
  const lang = ddLang(hass);
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.split(`{${k}}`).join(String(vars[k]));
    }
  }
  return str;
}
