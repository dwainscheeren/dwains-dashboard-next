import { de } from './locales/de';
import { en, type TranslationDictionary, type TranslationKey } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it } from './locales/it';
import { nl } from './locales/nl';
import { zhHans } from './locales/zh-Hans';
import { zhHant } from './locales/zh-Hant';
import { ru } from './locales/ru';

export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'it', 'zh-hans', 'zh-hant', 'ru'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  nl,
  de,
  fr,
  es,
  it,
  ru,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
};

export { type TranslationDictionary, type TranslationKey };
