import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    name: 'Campinas',
    latitude: -22.9056,
    longitude: -47.0608,
    country: 'Brasil',
    countryCode: 'BR',
    admin1: 'São Paulo',
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureCelsius: 24.3,
    weatherCode: 1,
    relativeHumidityPercent: 68,
    windSpeedKmh: 13.4,
    precipitationMm: 0,
    surfacePressureHpa: 1014.3,
  },
  forecast: [
    {
      date: '2026-11-05',
      minimumCelsius: 17.1,
      maximumCelsius: 28.2,
      weatherCode: 1,
      precipitationProbability: 10,
    },
    {
      date: '2026-11-06',
      minimumCelsius: 18,
      maximumCelsius: 27.5,
      weatherCode: 2,
      precipitationProbability: 20,
    },
    {
      date: '2026-11-07',
      minimumCelsius: 17.4,
      maximumCelsius: 26.8,
      weatherCode: 3,
      precipitationProbability: 45,
    },
    {
      date: '2026-11-08',
      minimumCelsius: 16.9,
      maximumCelsius: 29,
      weatherCode: 1,
      precipitationProbability: 65,
    },
    {
      date: '2026-11-09',
      minimumCelsius: 17.2,
      maximumCelsius: 30.1,
      weatherCode: 0,
      precipitationProbability: 0,
    },
  ],
};
