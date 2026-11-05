import { describe, expect, it } from 'vitest';
import { getDayLabel, getShortDate } from '../../src/lib/format';

describe('format', () => {
  it('labels the first two forecast days as today and tomorrow', () => {
    expect(getDayLabel('2026-11-05', 0)).toBe('Hoje');
    expect(getDayLabel('2026-11-06', 1)).toBe('Amanhã');
  });

  it('uses the weekday abbreviation for later forecast days', () => {
    expect(getDayLabel('2026-11-07', 2)).toBe('Sáb');
    expect(getDayLabel('2026-11-09', 4)).toBe('Seg');
  });

  it('formats the date with the abbreviated month in Portuguese', () => {
    expect(getShortDate('2026-11-05')).toBe('5 Nov');
  });

  it('returns an unavailable label for an invalid date', () => {
    expect(getShortDate('2026-02-30')).toBe('Data indisponível');
  });
});
