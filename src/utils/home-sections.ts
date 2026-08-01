import type { HomeInformationCardKey, HomeSectionKey } from '../types/strategy';
import type { TranslationKey } from '../i18n';

export const DEFAULT_HOME_SECTIONS_ORDER: HomeSectionKey[] = [
  'cameras',
  'areas',
  'devices',
  'favorites',
  'summaries',
];

interface LocalizedMeta {
  labelKey: TranslationKey;
  icon: string;
  descriptionKey: TranslationKey;
}

export const HOME_SECTION_META: Record<HomeSectionKey, LocalizedMeta> = {
  summaries: {
    labelKey: 'home_section.summaries.label',
    icon: 'mdi:clipboard-list-outline',
    descriptionKey: 'home_section.summaries.description',
  },
  cameras: {
    labelKey: 'home_section.cameras.label',
    icon: 'mdi:cctv',
    descriptionKey: 'home_section.cameras.description',
  },
  areas: {
    labelKey: 'home_section.areas.label',
    icon: 'mdi:floor-plan',
    descriptionKey: 'home_section.areas.description',
  },
  devices: {
    labelKey: 'home_section.devices.label',
    icon: 'mdi:view-dashboard-outline',
    descriptionKey: 'home_section.devices.description',
  },
  favorites: {
    labelKey: 'home_section.favorites.label',
    icon: 'mdi:star',
    descriptionKey: 'home_section.favorites.description',
  },
};

export const DEFAULT_HOME_INFORMATION_CARDS: HomeInformationCardKey[] = [
  'people',
  'climate',
  'power',
  'device_groups',
];

export const HOME_INFORMATION_CARD_META: Record<HomeInformationCardKey, LocalizedMeta> = {
  people: {
    labelKey: 'home_card.people.label',
    icon: 'mdi:account-group',
    descriptionKey: 'home_card.people.description',
  },
  climate: {
    labelKey: 'home_card.climate.label',
    icon: 'mdi:home-thermometer-outline',
    descriptionKey: 'home_card.climate.description',
  },
  power: {
    labelKey: 'home_card.power.label',
    icon: 'mdi:flash',
    descriptionKey: 'home_card.power.description',
  },
  device_groups: {
    labelKey: 'home_card.device_groups.label',
    icon: 'mdi:view-grid-outline',
    descriptionKey: 'home_card.device_groups.description',
  },
};

export function normalizeHomeSectionsOrder(order?: readonly unknown[]): HomeSectionKey[] {
  const validSections = new Set<HomeSectionKey>(DEFAULT_HOME_SECTIONS_ORDER);
  const normalized = (order || []).filter((section): section is HomeSectionKey =>
    typeof section === 'string' && validSections.has(section as HomeSectionKey)
  );
  const unique = normalized.filter((section, index, all) => all.indexOf(section) === index);
  const missing = DEFAULT_HOME_SECTIONS_ORDER.filter(section => !unique.includes(section));

  const merged = [...unique];
  missing.forEach(section => {
    const defaultIndex = DEFAULT_HOME_SECTIONS_ORDER.indexOf(section);
    const insertIndex = merged.findIndex(
      current => DEFAULT_HOME_SECTIONS_ORDER.indexOf(current) > defaultIndex
    );

    if (insertIndex === -1) {
      merged.push(section);
    } else {
      merged.splice(insertIndex, 0, section);
    }
  });

  return merged;
}

export function normalizeHiddenHomeSections(hidden?: readonly unknown[]): HomeSectionKey[] {
  const validSections = new Set<HomeSectionKey>(DEFAULT_HOME_SECTIONS_ORDER);
  const normalized = (hidden || []).filter((section): section is HomeSectionKey =>
    typeof section === 'string' && validSections.has(section as HomeSectionKey)
  );

  return normalized.filter((section, index, all) => all.indexOf(section) === index);
}

export function normalizeHiddenHomeInformationCards(hidden?: readonly unknown[]): HomeInformationCardKey[] {
  const validCards = new Set<HomeInformationCardKey>(DEFAULT_HOME_INFORMATION_CARDS);
  const normalized = (hidden || []).filter((card): card is HomeInformationCardKey =>
    typeof card === 'string' && validCards.has(card as HomeInformationCardKey)
  );

  return normalized.filter((card, index, all) => all.indexOf(card) === index);
}
