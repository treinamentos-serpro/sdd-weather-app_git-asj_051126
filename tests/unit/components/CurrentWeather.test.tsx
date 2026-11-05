import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../../src/types/weather';

const city: City = {
  name: 'Campinas',
  latitude: -22.9056,
  longitude: -47.0608,
  country: 'Brasil',
};

const partialCurrent: CurrentWeatherData = {
  temperatureCelsius: null,
  weatherCode: null,
  relativeHumidityPercent: null,
  windSpeedKmh: null,
  precipitationMm: null,
  surfacePressureHpa: null,
};

describe('CurrentWeather partial data', () => {
  it('marks missing current conditions and metrics as unavailable', () => {
    render(<CurrentWeather city={city} current={partialCurrent} unit="celsius" />);

    const currentWeather = screen.getByRole('region', { name: 'Clima atual' });
    expect(within(currentWeather).getAllByText('Indisponível')).toHaveLength(6);
  });

  it('does not render non-finite measurements as NaN or Infinity', () => {
    const invalidCurrent: CurrentWeatherData = {
      temperatureCelsius: Number.NaN,
      weatherCode: Number.NaN,
      relativeHumidityPercent: Number.NaN,
      windSpeedKmh: Number.POSITIVE_INFINITY,
      precipitationMm: Number.NaN,
      surfacePressureHpa: Number.NEGATIVE_INFINITY,
    };

    render(<CurrentWeather city={city} current={invalidCurrent} unit="celsius" />);

    const currentWeather = screen.getByRole('region', { name: 'Clima atual' });
    expect(within(currentWeather).getAllByText('Indisponível')).toHaveLength(6);
    expect(currentWeather).not.toHaveTextContent(/NaN|Infinity|undefined/);
  });
});
