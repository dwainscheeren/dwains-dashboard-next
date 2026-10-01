// The header clock follows the time settings of the Home Assistant user
// profile, the same way the Home Assistant frontend formats times:
// - time_format: '12', '24', 'language' (the default of the language) or
//   'system' (the default of the browser);
// - time_zone: 'local' (the browser time zone) or 'server' (the time zone of
//   the Home Assistant server).

export interface ClockSettings {
  /** Language of the user profile, `hass.locale.language`. */
  language?: string;
  /** `hass.locale.time_format`. */
  time_format?: string;
  /** `hass.locale.time_zone`. */
  time_zone?: string;
}

export interface ClockText {
  time: string;
  date: string;
}

const MINUTE_MS = 60_000;

function defaultHourCycle(language: string | undefined): string | undefined {
  try {
    const resolved = new Intl.DateTimeFormat(language, { hour: 'numeric' }).resolvedOptions();
    return (resolved as { hourCycle?: string }).hourCycle;
  } catch {
    return undefined;
  }
}

/** Whether times use a 12 hour clock with AM and PM. */
export function usesTwelveHourClock(settings: ClockSettings | undefined): boolean {
  const format = settings?.time_format;
  if (format === '12') return true;
  if (format === '24') return false;

  // 'language', 'system', or a Home Assistant version without the setting.
  const language = format === 'system' ? undefined : settings?.language || undefined;
  const hourCycle = defaultHourCycle(language);
  if (hourCycle) return hourCycle === 'h11' || hourCycle === 'h12';
  // The check Home Assistant itself uses, for browsers without `hourCycle`.
  return new Date(2023, 0, 1, 22).toLocaleString(language).includes('10');
}

/** Time zone to show times in; `undefined` means the browser time zone. */
export function resolveClockTimeZone(
  timeZoneSetting: string | undefined,
  serverTimeZone: string | undefined
): string | undefined {
  return timeZoneSetting === 'server' && serverTimeZone ? serverTimeZone : undefined;
}

function dateTimeFormat(
  language: string | undefined,
  options: Intl.DateTimeFormatOptions,
  timeZone: string | undefined
): Intl.DateTimeFormat {
  // Fall back step by step for an unknown time zone or language tag.
  const attempts: Array<[string | undefined, Intl.DateTimeFormatOptions]> = [
    [language, { ...options, timeZone }],
    [language, options],
    [undefined, options],
  ];
  for (const [locale, attemptOptions] of attempts) {
    try {
      return new Intl.DateTimeFormat(locale, attemptOptions);
    } catch {
      // Try the next one.
    }
  }
  return new Intl.DateTimeFormat();
}

/** Time and date line of the header clock. */
export function formatClock(now: Date, settings: ClockSettings, serverTimeZone?: string): ClockText {
  const language = settings.language || undefined;
  const twelveHour = usesTwelveHourClock(settings);
  const timeZone = resolveClockTimeZone(settings.time_zone, serverTimeZone);

  const time = dateTimeFormat(language, {
    // 24 hour times keep their leading zero (09:05) as before, 12 hour times read 9:05 PM.
    hour: twelveHour ? 'numeric' : '2-digit',
    minute: '2-digit',
    hourCycle: twelveHour ? 'h12' : 'h23',
  }, timeZone).format(now);
  const date = dateTimeFormat(language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }, timeZone).format(now);

  return { time, date };
}

/** Long date line, for example of the wall tablet screensaver: "Wednesday 30 September". */
export function formatLongDate(now: Date, settings: ClockSettings, serverTimeZone?: string): string {
  const timeZone = resolveClockTimeZone(settings.time_zone, serverTimeZone);
  return dateTimeFormat(settings.language || undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }, timeZone).format(now);
}

/** Milliseconds until the next whole minute, between 1 and 60000. */
export function msUntilNextMinute(nowMs: number): number {
  const intoMinute = ((nowMs % MINUTE_MS) + MINUTE_MS) % MINUTE_MS;
  return MINUTE_MS - intoMinute;
}
