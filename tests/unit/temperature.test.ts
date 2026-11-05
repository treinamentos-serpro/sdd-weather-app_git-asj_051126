import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('temperature', () => {
  it('converts Celsius to Fahrenheit for reference temperatures', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
  });

  it('convertTemperature respects the requested unit', () => {
    expect(convertTemperature(20, 'celsius')).toBe(20);
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
  });

  it('formats rounded values with the selected unit symbol', () => {
    expect(formatTemperature(20.4, 'celsius')).toBe('20 °C');
    expect(formatTemperature(20.5, 'celsius')).toBe('21 °C');
    expect(formatTemperature(-20.5, 'celsius')).toBe('-21 °C');
    expect(formatTemperature(0, 'fahrenheit')).toBe('32 °F');
  });

  it('returns the unit label', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });

  it('keeps missing temperatures unavailable', () => {
    expect(formatTemperature(null, 'celsius')).toBe('Indisponível');
  });
});
