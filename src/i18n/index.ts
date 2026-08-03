import { de } from './locales/de';
import { en, type TranslationDictionary, type TranslationKey } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { nl } from './locales/nl';
import { zhHans } from './locales/zh-Hans';
import { zhHant } from './locales/zh-Hant';

export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'zh-hans', 'zh-hant'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  nl,
  de,
  fr,
  es,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
};

export { type TranslationDictionary, type TranslationKey };
