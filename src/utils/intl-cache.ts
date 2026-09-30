// Creating Intl formatters is expensive compared to using them, and the
// dashboard renders on every state change. Formatters are immutable, so one
// instance per locale and option set can be shared.

const collators = new Map<string, Intl.Collator>();
const pluralRules = new Map<string, Intl.PluralRules>();
const relativeTimeFormats = new Map<string, Intl.RelativeTimeFormat>();

function cacheKey(locale: string | undefined, options?: object): string {
  return `${locale === undefined ? '\u0000' : locale}|${options ? JSON.stringify(options) : ''}`;
}

/** Same result as `new Intl.Collator(locale, options)`, and `a.localeCompare(b, locale, options)`. */
export function getCollator(locale?: string, options?: Intl.CollatorOptions): Intl.Collator {
  const key = cacheKey(locale, options);
  let collator = collators.get(key);
  if (!collator) {
    collator = new Intl.Collator(locale, options);
    collators.set(key, collator);
  }
  return collator;
}

/** Same result as `new Intl.PluralRules(locale, options)`. */
export function getPluralRules(locale?: string, options?: Intl.PluralRulesOptions): Intl.PluralRules {
  const key = cacheKey(locale, options);
  let rules = pluralRules.get(key);
  if (!rules) {
    rules = new Intl.PluralRules(locale, options);
    pluralRules.set(key, rules);
  }
  return rules;
}

/** Same result as `new Intl.RelativeTimeFormat(locale, options)`. */
export function getRelativeTimeFormat(
  locale?: string,
  options?: Intl.RelativeTimeFormatOptions
): Intl.RelativeTimeFormat {
  const key = cacheKey(locale, options);
  let format = relativeTimeFormats.get(key);
  if (!format) {
    format = new Intl.RelativeTimeFormat(locale, options);
    relativeTimeFormats.set(key, format);
  }
  return format;
}
