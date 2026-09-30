import { describe, expect, it } from 'vitest';
import { formatClock, msUntilNextMinute, resolveClockTimeZone, usesTwelveHourClock } from '../src/utils/clock';

// 30 September 2026, 20:05 UTC: 22:05 in Amsterdam, 16:05 in New York.
const NOW = new Date(Date.UTC(2026, 8, 30, 20, 5, 30));

// Newer ICU versions put a narrow no-break space before AM and PM.
const plain = (text: string) => text.replace(/[\u00a0\u202f]/g, ' ');
// Month abbreviations differ between ICU versions, so dates are compared with Intl itself.
const dateIn = (date: Date, language: string, timeZone: string) =>
  new Intl.DateTimeFormat(language, { weekday: 'short', day: 'numeric', month: 'short', timeZone }).format(date);

describe('usesTwelveHourClock', () => {
  it('follows an explicit 12 or 24 hour setting', () => {
    expect(usesTwelveHourClock({ language: 'nl', time_format: '12' })).toBe(true);
    expect(usesTwelveHourClock({ language: 'en', time_format: '24' })).toBe(false);
  });

  it('uses the default of the language for the language setting', () => {
    expect(usesTwelveHourClock({ language: 'en', time_format: 'language' })).toBe(true);
    expect(usesTwelveHourClock({ language: 'nl', time_format: 'language' })).toBe(false);
    expect(usesTwelveHourClock({ language: 'en-GB', time_format: 'language' })).toBe(false);
  });

  it('uses the language default when Home Assistant has no time format setting', () => {
    expect(usesTwelveHourClock({ language: 'en' })).toBe(true);
    expect(usesTwelveHourClock({ language: 'de' })).toBe(false);
  });

  it('uses the browser default for the system setting', () => {
    const browserHourCycle = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions() as { hourCycle?: string };
    const expected = browserHourCycle.hourCycle === 'h12' || browserHourCycle.hourCycle === 'h11';
    expect(usesTwelveHourClock({ language: 'nl', time_format: 'system' })).toBe(expected);
  });
});

describe('resolveClockTimeZone', () => {
  it('uses the server time zone only for the server setting', () => {
    expect(resolveClockTimeZone('server', 'Europe/Amsterdam')).toBe('Europe/Amsterdam');
    expect(resolveClockTimeZone('local', 'Europe/Amsterdam')).toBeUndefined();
    expect(resolveClockTimeZone(undefined, 'Europe/Amsterdam')).toBeUndefined();
    expect(resolveClockTimeZone('server', undefined)).toBeUndefined();
  });
});

describe('formatClock', () => {
  it('shows a 24 hour time in the server time zone', () => {
    const clock = formatClock(NOW, { language: 'nl', time_format: '24', time_zone: 'server' }, 'Europe/Amsterdam');
    expect(clock.time).toBe('22:05');
    expect(clock.date).toBe(dateIn(NOW, 'nl', 'Europe/Amsterdam'));
  });

  it('shows a 12 hour time when the profile asks for it', () => {
    const clock = formatClock(NOW, { language: 'en', time_format: '12', time_zone: 'server' }, 'Europe/Amsterdam');
    expect(plain(clock.time)).toBe('10:05 PM');
  });

  it('follows the language for the language setting', () => {
    expect(plain(formatClock(NOW, { language: 'en', time_format: 'language', time_zone: 'server' }, 'America/New_York').time))
      .toBe('4:05 PM');
    expect(formatClock(NOW, { language: 'en-GB', time_format: 'language', time_zone: 'server' }, 'America/New_York').time)
      .toBe('16:05');
  });

  it('keeps the leading zero of 24 hour times', () => {
    const morning = new Date(Date.UTC(2026, 8, 30, 7, 5));
    expect(formatClock(morning, { language: 'en', time_format: '24', time_zone: 'server' }, 'UTC').time).toBe('07:05');
  });

  it('shows the date of the chosen time zone', () => {
    const lateEvening = new Date(Date.UTC(2026, 8, 30, 23, 30));
    const settings = { language: 'en-GB', time_format: '24', time_zone: 'server' };
    const amsterdam = formatClock(lateEvening, settings, 'Europe/Amsterdam').date;
    const newYork = formatClock(lateEvening, settings, 'America/New_York').date;
    expect(amsterdam).toBe(dateIn(lateEvening, 'en-GB', 'Europe/Amsterdam'));
    expect(newYork).toBe(dateIn(lateEvening, 'en-GB', 'America/New_York'));
    expect(amsterdam).toMatch(/^Thu 1 /);
    expect(newYork).toMatch(/^Wed 30 /);
  });

  it('uses the browser time zone for the local setting', () => {
    const expected = new Intl.DateTimeFormat('nl', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(NOW);
    expect(formatClock(NOW, { language: 'nl', time_format: '24', time_zone: 'local' }, 'Pacific/Auckland').time).toBe(expected);
  });

  it('falls back to the browser time zone for an unknown server time zone', () => {
    const expected = new Intl.DateTimeFormat('nl', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(NOW);
    expect(formatClock(NOW, { language: 'nl', time_format: '24', time_zone: 'server' }, 'Not/AZone').time).toBe(expected);
  });
});

describe('msUntilNextMinute', () => {
  it('counts down to the next whole minute', () => {
    expect(msUntilNextMinute(Date.UTC(2026, 8, 30, 20, 5, 30))).toBe(30_000);
    expect(msUntilNextMinute(Date.UTC(2026, 8, 30, 20, 5, 59, 900))).toBe(100);
    expect(msUntilNextMinute(Date.UTC(2026, 8, 30, 20, 6, 0))).toBe(60_000);
  });
});
