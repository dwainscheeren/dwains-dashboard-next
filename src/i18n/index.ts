import { en, type TranslationDictionary, type TranslationKey } from './locales/en';

export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt-br', 'zh-hans', 'zh-hant', 'ru'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type LoadableLanguage = Exclude<SupportedLanguage, 'en'>;

// English is bundled as the fallback. Other languages are loaded on demand, so
// every user only downloads and parses the language they actually use.
const LOADERS: Record<LoadableLanguage, () => Promise<TranslationDictionary>> = {
  nl: () => import('./locales/nl').then((m) => m.nl),
  de: () => import('./locales/de').then((m) => m.de),
  fr: () => import('./locales/fr').then((m) => m.fr),
  es: () => import('./locales/es').then((m) => m.es),
  it: () => import('./locales/it').then((m) => m.it),
  'pt-br': () => import('./locales/pt-br').then((m) => m.ptBR),
  ru: () => import('./locales/ru').then((m) => m.ru),
  'zh-hans': () => import('./locales/zh-Hans').then((m) => m.zhHans),
  'zh-hant': () => import('./locales/zh-Hant').then((m) => m.zhHant),
};

export const TRANSLATIONS: { en: TranslationDictionary } & Partial<Record<SupportedLanguage, TranslationDictionary>> = {
  en,
};

/** Fired on window when a language finished loading, so components can re-render. */
export const TRANSLATIONS_LOADED_EVENT = 'dwains-dashboard-next-translations-loaded';

const pending = new Map<SupportedLanguage, Promise<void>>();

export function loadTranslations(lang: SupportedLanguage): Promise<void> {
  if (TRANSLATIONS[lang]) return Promise.resolve();
  const existing = pending.get(lang);
  if (existing) return existing;

  const promise = LOADERS[lang as LoadableLanguage]()
    .then((dictionary) => {
      TRANSLATIONS[lang] = dictionary;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(TRANSLATIONS_LOADED_EVENT, { detail: { lang } }));
      }
    })
    .catch((error) => {
      // Keep using English; a later call can try again.
      pending.delete(lang);
      console.warn(`Dwains Dashboard Next - Could not load the ${lang} translation`, error);
    });
  pending.set(lang, promise);
  return promise;
}

export { type TranslationDictionary, type TranslationKey };
