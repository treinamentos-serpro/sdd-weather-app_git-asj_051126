import { describe, expect, it } from 'vitest';
import { getWeatherIcon, getWeatherInfo, getWeatherLabel } from '../../src/lib/weatherCodes';

describe('weatherCodes', () => {
  it('returns the label and icon for a known weather code', () => {
    expect(getWeatherInfo(0)).toEqual({ label: 'Céu limpo', icon: '☀️' });
    expect(getWeatherLabel(1)).toBe('Predomínio de sol');
    expect(getWeatherIcon(1)).toBe('🌤️');
  });

  it('returns the fallback for an unknown weather code', () => {
    expect(getWeatherInfo(999)).toEqual({
      label: 'Condição desconhecida',
      icon: '🌡️',
    });
  });

  it('returns the fallback when the weather code is missing', () => {
    expect(getWeatherInfo(null)).toEqual({
      label: 'Condição desconhecida',
      icon: '🌡️',
    });
  });
});
