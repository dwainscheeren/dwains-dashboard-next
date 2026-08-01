import { de } from './locales/de';
import { en, type TranslationDictionary, type TranslationKey } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { nl } from './locales/nl';

export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr', 'es'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  nl,
  de,
  fr,
  es,
};

export { type TranslationDictionary, type TranslationKey };

