import { describe, expect, it } from 'vitest';
import { loadTranslations, SUPPORTED_LANGUAGES } from '../src/i18n';
import { ddLang, ddLocale, ddLocalize, ddLocalizePlural, hasDdTranslation } from '../src/utils/localize';
import { getDomainName } from '../src/utils/domain-names';

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

  it('follows the plural rules of the locale', async () => {
    await Promise.all([loadTranslations('fr'), loadTranslations('ru')]);
    // French uses the singular for zero.
    const frZero = ddLocalizePlural(hass('fr'), 'common.device', 0);
    expect(frZero).toBe(ddLocalize(hass('fr'), 'common.device.one', { count: 0 }));
    expect(ddLocalizePlural(hass('ru'), 'common.device', 3)).toBe('3 устройства');
  });

  it.each([
    [0, '0 устройств'], [1, '1 устройство'], [2, '2 устройства'],
    [5, '5 устройств'], [11, '11 устройств'], [21, '21 устройство'],
    [22, '22 устройства'], [25, '25 устройств'], [101, '101 устройство'],
    [1.5, '1.5 устройства'],
  ])('uses the Russian category for %s devices', async (count, expected) => {
    await loadTranslations('ru');
    expect(ddLocalizePlural(hass('ru'), 'common.device', count)).toBe(expected);
  });

  it('uses Russian few for entities and adjective agreement in status labels', async () => {
    await loadTranslations('ru');
    expect(ddLocalizePlural(hass('ru'), 'common.entity', 3)).toBe('3 сущности');
    expect(ddLocalizePlural(hass('ru'), 'status.light_on', 2)).toBe('2 включённых светильника');
    expect(ddLocalizePlural(hass('ru'), 'status.light_on', 5)).toBe('5 включённых светильников');
  });

  it('passes extra variables along', () => {
    expect(ddLocalizePlural(hass('en'), 'common.device', 4, { count: 'four' })).toBe('four devices');
  });
});

describe('shared UI translations', () => {
  it.each(SUPPORTED_LANGUAGES)('localizes group titles and UI actions in %s', async language => {
    await loadTranslations(language);
    const user = hass(language, language === 'de' ? 'en' : 'de');
    for (const key of ['cover_openings', 'cover_shading', 'cover_gates', 'motion', 'safety']) {
      expect(getDomainName(user, key)).toBe(ddLocalize(user, `domain.${key}`));
      expect(getDomainName(user, key)).not.toBe(`domain.${key}`);
    }
    expect(ddLocalize(user, 'replacement.already_assigned', { domain: 'test' })).toContain('test');
    expect(ddLocalize(user, 'blueprint.select_entity_first', { name: 'test' })).toContain('test');
    expect(ddLocalize(user, 'devices.area_power_history', { area: 'test' })).toContain('test');
    if (language !== 'en') {
      expect(ddLocalize(user, 'navigation.open_devices')).not.toBe('Open device view');
    }
  });
});

describe('semantic state and action labels', () => {
  it.each([
    ['fr', 'status.light_on.other', '{count} lumières allumées'],
    ['fr', 'status.switch_on.other', '{count} interrupteurs activés'],
    ['es', 'status.switch_on.other', '{count} interruptores encendidos'],
    ['nl', 'status.switch_on.other', '{count} schakelaars aan'],
    ['nl', 'status.door_open.other', '{count} deuren open'],
    ['fr', 'common.on', 'Activé'], ['fr', 'common.open', 'Ouvert'],
    ['fr', 'person.home', 'À la maison'], ['fr', 'person.away', 'Absent'],
    ['es', 'common.show', 'Mostrar'], ['es', 'common.on', 'Encendido'],
    ['es', 'person.home', 'En casa'], ['es', 'person.away', 'Fuera de casa'],
    ['nl', 'common.show', 'Tonen'], ['nl', 'common.on', 'Aan'],
    ['nl', 'person.home', 'Thuis'], ['nl', 'person.away', 'Afwezig'],
    ['it', 'person.home', 'A casa'],
    ['zh-hans', 'common.on', '已开启'], ['zh-hans', 'common.off', '已关闭'],
    ['zh-hant', 'common.on', '已開啟'], ['zh-hant', 'common.off', '已關閉'],
  ])('uses the correct meaning for %s %s', async (language, key, expected) => {
    await loadTranslations(language as typeof SUPPORTED_LANGUAGES[number]);
    expect(ddLocalize(hass(language), key)).toBe(expected);
  });
});
