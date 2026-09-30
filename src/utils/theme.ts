function parseCssColor(value: string): [number, number, number] | null {
  const color = value.trim();
  if (!color) return null;

  const rgbMatch = color.match(/^rgba?\(\s*([.\d]+)[,\s]+([.\d]+)[,\s]+([.\d]+)/i);
  if (rgbMatch) {
    return [
      Number(rgbMatch[1]),
      Number(rgbMatch[2]),
      Number(rgbMatch[3]),
    ];
  }

  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  const hexValue = hexMatch?.[1];
  if (hexValue) {
    const hex = hexValue.length === 3
      ? hexValue.split('').map((part) => part + part).join('')
      : hexValue;
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  return null;
}

function luminance([r, g, b]: [number, number, number]): number {
  return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

export function isHassDarkTheme(hass?: any, element?: Element | null): boolean {
  const explicit = [
    hass?.themes?.dark,
    hass?.themes?.darkMode,
    hass?.selectedTheme?.dark,
    hass?.selected_theme?.dark,
  ];

  for (const value of explicit) {
    if (value === true) return true;
  }

  const roots = [
    element,
    document.documentElement,
    document.body,
  ].filter(Boolean) as Element[];

  const variables = [
    '--primary-background-color',
    '--secondary-background-color',
    '--card-background-color',
    '--ha-card-background',
  ];

  for (const root of roots) {
    const style = getComputedStyle(root);
    for (const variable of variables) {
      const rgb = parseCssColor(style.getPropertyValue(variable));
      if (!rgb) continue;
      return luminance(rgb) < 150;
    }

    const background = parseCssColor(style.backgroundColor);
    if (background) {
      return luminance(background) < 150;
    }
  }

  return explicit.some((value) => value === false)
    ? false
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

interface DarkThemeState {
  themes: unknown;
  selectedTheme: unknown;
  selectedThemeLegacy: unknown;
  dark: boolean;
  recheck?: number;
}

const darkThemeStates = new WeakMap<Element, DarkThemeState>();

/**
 * Toggle `data-theme-dark` on an element. isHassDarkTheme() reads computed
 * styles, which can force a style recalculation, so it only runs again when
 * the theme inputs on hass change (or when `force` is set). Home Assistant can
 * apply the theme variables slightly after it updates hass, so every
 * recalculation is checked once more on the next animation frame.
 */
export function syncHassDarkThemeAttribute(element: Element, hass?: any, force = false): void {
  const previous = darkThemeStates.get(element);
  if (
    !force &&
    previous &&
    previous.themes === hass?.themes &&
    previous.selectedTheme === hass?.selectedTheme &&
    previous.selectedThemeLegacy === hass?.selected_theme
  ) {
    return;
  }

  const state: DarkThemeState = {
    themes: hass?.themes,
    selectedTheme: hass?.selectedTheme,
    selectedThemeLegacy: hass?.selected_theme,
    dark: isHassDarkTheme(hass, element),
  };
  if (previous?.recheck !== undefined) cancelAnimationFrame(previous.recheck);
  darkThemeStates.set(element, state);
  element.toggleAttribute('data-theme-dark', state.dark);

  if (typeof requestAnimationFrame !== 'function') return;
  state.recheck = requestAnimationFrame(() => {
    state.recheck = undefined;
    if (darkThemeStates.get(element) !== state) return;
    state.dark = isHassDarkTheme(hass, element);
    element.toggleAttribute('data-theme-dark', state.dark);
  });
}
