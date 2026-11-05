import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useWeather from '../../src/hooks/useWeather';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const mockedSearchCities = vi.mocked(searchCities);
const mockedGetWeather = vi.mocked(getWeather);

const city: City = {
  name: 'Campinas',
  latitude: -22.9056,
  longitude: -47.0608,
  country: 'Brasil',
};

const weather: WeatherData = {
  city,
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureCelsius: 20,
    weatherCode: 1,
    relativeHumidityPercent: 60,
    windSpeedKmh: 12,
    precipitationMm: 0,
    surfacePressureHpa: 1013,
  },
  forecast: [],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useWeather retry', () => {
  it('retries the city search after an offline failure', async () => {
    const offlineError = Object.assign(new Error('Falha de rede.'), { code: 'network' as const });
    mockedSearchCities.mockRejectedValueOnce(offlineError).mockResolvedValueOnce([city]);
    mockedGetWeather.mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Campinas');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(offlineError);
    expect(result.current.error?.code).toBe('network');

    await act(async () => {
      await result.current.retry();
    });

    expect(mockedSearchCities).toHaveBeenCalledTimes(2);
    expect(mockedGetWeather).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
  });

  it('retries only the forecast after an offline failure', async () => {
    mockedSearchCities.mockResolvedValue([city]);
    const offlineError = Object.assign(new Error('Falha de rede.'), { code: 'network' as const });
    mockedGetWeather.mockRejectedValueOnce(offlineError).mockResolvedValueOnce(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Campinas');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(offlineError);
    expect(result.current.error?.code).toBe('network');

    await act(async () => {
      await result.current.retry();
    });

    expect(mockedSearchCities).toHaveBeenCalledTimes(1);
    expect(mockedGetWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
  });
});
