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
