import type { HomeSectionKey } from '../types/strategy';

export const DEFAULT_HOME_SECTIONS_ORDER: HomeSectionKey[] = [
  'summaries',
  'cameras',
  'areas',
  'devices',
  'favorites',
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
    description: 'People, power usage and device groups.',
  },
  favorites: {
    label: 'Favorites',
    icon: 'mdi:star',
    description: 'Pinned entities selected by you.',
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
