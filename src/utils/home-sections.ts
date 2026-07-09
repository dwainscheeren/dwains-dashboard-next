import type { HomeInformationCardKey, HomeSectionKey } from '../types/strategy';

export const DEFAULT_HOME_SECTIONS_ORDER: HomeSectionKey[] = [
  'cameras',
  'areas',
  'devices',
  'favorites',
  'summaries',
];

export const HOME_SECTION_META: Record<HomeSectionKey, { label: string; icon: string; description: string }> = {
  summaries: {
    label: 'home_section.summaries.label',
    icon: 'mdi:clipboard-list-outline',
    description: 'home_section.summaries.desc',
  },
  cameras: {
    label: 'home_section.cameras.label',
    icon: 'mdi:cctv',
    description: 'home_section.cameras.desc',
  },
  areas: {
    label: 'home_section.areas.label',
    icon: 'mdi:floor-plan',
    description: 'home_section.areas.desc',
  },
  devices: {
    label: 'home_section.devices.label',
    icon: 'mdi:view-dashboard-outline',
    description: 'home_section.devices.desc',
  },
  favorites: {
    label: 'home_section.favorites.label',
    icon: 'mdi:star',
    description: 'home_section.favorites.desc',
  },
};

export const DEFAULT_HOME_INFORMATION_CARDS: HomeInformationCardKey[] = [
  'people',
  'climate',
  'power',
  'device_groups',
];

export const HOME_INFORMATION_CARD_META: Record<HomeInformationCardKey, { label: string; icon: string; description: string }> = {
  people: {
    label: 'home_info.people.label',
    icon: 'mdi:account-group',
    description: 'home_info.people.desc',
  },
  climate: {
    label: 'home_info.climate.label',
    icon: 'mdi:home-thermometer-outline',
    description: 'home_info.climate.desc',
  },
  power: {
    label: 'home_info.power.label',
    icon: 'mdi:flash',
    description: 'home_info.power.desc',
  },
  device_groups: {
    label: 'home_info.device_groups.label',
    icon: 'mdi:view-grid-outline',
    description: 'home_info.device_groups.desc',
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
