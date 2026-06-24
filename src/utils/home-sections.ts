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
    label: 'Summaries',
    icon: 'mdi:clipboard-list-outline',
    description: 'Repairs, updates and newly discovered devices from Home Assistant.',
  },
  cameras: {
    label: 'Cameras',
    icon: 'mdi:cctv',
    description: 'Area cameras on the home page.',
  },
  areas: {
    label: 'Areas',
    icon: 'mdi:floor-plan',
    description: 'Mobile and small-screen room cards; desktop uses the left area menu.',
  },
  devices: {
    label: 'House information',
    icon: 'mdi:view-dashboard-outline',
    description: 'People, indoor climate, power usage and device groups.',
  },
  favorites: {
    label: 'Favorites',
    icon: 'mdi:star',
    description: 'Pinned entities selected by you.',
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
    label: 'People',
    icon: 'mdi:account-group',
    description: 'Presence cards for the people in this home.',
  },
  climate: {
    label: 'Indoor climate',
    icon: 'mdi:home-thermometer-outline',
    description: 'Average temperature and humidity from room sensors.',
  },
  power: {
    label: 'House power usage',
    icon: 'mdi:flash',
    description: 'Current whole-house power usage and top rooms.',
  },
  device_groups: {
    label: 'Device groups',
    icon: 'mdi:view-grid-outline',
    description: 'Status cards such as lights, switches, covers and motion.',
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
