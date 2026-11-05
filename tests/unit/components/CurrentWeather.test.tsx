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
});
