import { describe, expect, it } from 'vitest';
import { loadTranslations, SUPPORTED_LANGUAGES } from '../src/i18n';
import { ddLang, ddLocale, ddLocalize, ddLocalizePlural, hasDdTranslation } from '../src/utils/localize';

const hass = (language?: string, legacyLanguage?: string) => ({
  locale: language === undefined ? undefined : { language },
  language: legacyLanguage,
});

describe('ddLang', () => {
  it.each([
    ['pt-BR', 'pt-br'],
    ['pt-br', 'pt-br'],
    ['pt_BR', 'pt-br'],
    ['de-DE', 'de'],
    ['de-CH', 'de'],
    ['nl', 'nl'],
    ['nl-BE', 'nl'],
    ['en-GB', 'en'],
    ['fr-CA', 'fr'],
    ['ru', 'ru'],
    ['zh-TW', 'zh-hant'],
    ['zh-HK', 'zh-hant'],
    ['zh-Hant', 'zh-hant'],
    ['zh-CN', 'zh-hans'],
    ['zh-Hans', 'zh-hans'],
    ['zh_CN', 'zh-hans'],
    ['xx', 'en'],
    ['', 'en'],
  ])('maps %s to %s', (language, expected) => {
    expect(ddLang(hass(language))).toBe(expected);
  });

  it('only returns supported languages', () => {
    for (const language of ['pt', 'es-MX', 'it-IT', 'sv', 'zh']) {
      expect(SUPPORTED_LANGUAGES).toContain(ddLang(hass(language)));
    }
  });

  it('prefers the user locale over the server language', () => {
    expect(ddLang(hass('de', 'nl'))).toBe('de');
    expect(ddLang(hass(undefined, 'nl'))).toBe('nl');
  });

  it('falls back to English without hass', () => {
    expect(ddLang(undefined)).toBe('en');
    expect(ddLang({})).toBe('en');
  });
});

describe('ddLocale', () => {
  it('keeps the regional locale for number and plural formatting', () => {
    expect(ddLocale(hass('pt-BR'))).toBe('pt-BR');
    expect(ddLocale(undefined)).toBe('en');
  });
});

describe('ddLocalize', () => {
  it('falls back to English until a language is loaded', async () => {
    expect(ddLocalize(hass('fr'), 'devices.title')).toBe('Devices');
    await loadTranslations('fr');
    expect(ddLocalize(hass('fr'), 'devices.title')).toBe('Appareils');
  });

  it('translates into the active language', async () => {
    await Promise.all([loadTranslations('nl'), loadTranslations('de')]);
    expect(ddLocalize(hass('en'), 'devices.title')).toBe('Devices');
    expect(ddLocalize(hass('nl-NL'), 'devices.title')).toBe('Apparaten');
    expect(ddLocalize(hass('de'), 'devices.title')).toBe('Geräte');
  });

  it('returns the key for unknown keys', () => {
    expect(ddLocalize(hass('nl'), 'does.not.exist')).toBe('does.not.exist');
    expect(hasDdTranslation('does.not.exist')).toBe(false);
    expect(hasDdTranslation('devices.title')).toBe(true);
  });

  it('replaces every occurrence of a variable', () => {
    expect(ddLocalize(hass('en'), 'common.device.other', { count: 3 })).toBe('3 devices');
  });
});

describe('ddLocalizePlural', () => {
  it('picks the English singular only for one', () => {
    expect(ddLocalizePlural(hass('en'), 'common.device', 1)).toBe('1 device');
    expect(ddLocalizePlural(hass('en'), 'common.device', 0)).toBe('0 devices');
    expect(ddLocalizePlural(hass('en'), 'common.device', 2)).toBe('2 devices');
  });

  it('follows the plural rules of the locale', () => {
    // French uses the singular for zero.
    const frZero = ddLocalizePlural(hass('fr'), 'common.device', 0);
    expect(frZero).toBe(ddLocalize(hass('fr'), 'common.device.one', { count: 0 }));
    // Russian "few" and "many" fall back to the "other" string.
    expect(ddLocalizePlural(hass('ru'), 'common.device', 3)).toBe(
      ddLocalize(hass('ru'), 'common.device.other', { count: 3 })
    );
  });

  it('passes extra variables along', () => {
    expect(ddLocalizePlural(hass('en'), 'common.device', 4, { count: 'four' })).toBe('four devices');
  });
});
