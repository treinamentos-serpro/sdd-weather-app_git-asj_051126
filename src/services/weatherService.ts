import type {
  City,
  CurrentWeather,
  ForecastDay,
  WeatherData,
  WeatherErrorCode,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    readonly code: WeatherErrorCode,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

interface GeocodingResult {
  name: unknown;
  latitude: unknown;
  longitude: unknown;
  country: unknown;
  country_code?: unknown;
  admin1?: unknown;
  timezone?: unknown;
}

interface GeocodingResponse {
  results?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.', 'timeout');
    }
    throw new WeatherServiceError('Falha de rede.', 'network');
  } finally {
    clearTimeout(timeout);
  }
}

function mapCity(value: unknown): City {
  if (!isRecord(value)) {
    throw new WeatherServiceError('A resposta de busca de cidades é inválida.', 'invalid-response');
  }

  const result = value as unknown as GeocodingResult;
  if (
    typeof result.name !== 'string' ||
    typeof result.latitude !== 'number' ||
    !Number.isFinite(result.latitude) ||
    typeof result.longitude !== 'number' ||
    !Number.isFinite(result.longitude) ||
    typeof result.country !== 'string'
  ) {
    throw new WeatherServiceError('A resposta de busca de cidades é inválida.', 'invalid-response');
  }

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    ...(typeof result.country_code === 'string' ? { countryCode: result.country_code } : {}),
    ...(typeof result.admin1 === 'string' ? { admin1: result.admin1 } : {}),
    ...(typeof result.timezone === 'string' ? { timezone: result.timezone } : {}),
  };
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function dateForForecastDay(dates: unknown[], firstDate: string, index: number): string {
  const date = dates[index];
  if (isIsoDate(date)) return date;

  const generatedDate = new Date(`${firstDate}T00:00:00.000Z`);
  generatedDate.setUTCDate(generatedDate.getUTCDate() + index);
  return generatedDate.toISOString().slice(0, 10);
}

function mapCurrent(value: Record<string, unknown>): CurrentWeather {
  return {
    temperatureCelsius: numberOrNull(value.temperature_2m),
    weatherCode: numberOrNull(value.weather_code),
    relativeHumidityPercent: numberOrNull(value.relative_humidity_2m),
    windSpeedKmh: numberOrNull(value.wind_speed_10m),
    precipitationMm: numberOrNull(value.precipitation),
    surfacePressureHpa: numberOrNull(value.surface_pressure),
  };
}

function mapForecast(value: Record<string, unknown>): ForecastDay[] {
  const dates = Array.isArray(value.time) ? value.time : [];
  const firstDate = dates[0];

  if (!isIsoDate(firstDate)) {
    throw new WeatherServiceError('A resposta de previsão é inválida.', 'invalid-response');
  }

  const weatherCodes = Array.isArray(value.weather_code) ? value.weather_code : [];
  const minimums = Array.isArray(value.temperature_2m_min) ? value.temperature_2m_min : [];
  const maximums = Array.isArray(value.temperature_2m_max) ? value.temperature_2m_max : [];
  const precipitationProbabilities = Array.isArray(value.precipitation_probability_max)
    ? value.precipitation_probability_max
    : [];

  return Array.from({ length: 5 }, (_, index) => ({
    date: dateForForecastDay(dates, firstDate, index),
    weatherCode: numberOrNull(weatherCodes[index]),
    minimumCelsius: numberOrNull(minimums[index]),
    maximumCelsius: numberOrNull(maximums[index]),
    precipitationProbability: numberOrNull(precipitationProbabilities[index]),
  }));
}

export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades.', 'http', response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError('A resposta de busca de cidades é inválida.', 'invalid-response');
  }

  if (!isRecord(payload)) {
    throw new WeatherServiceError('A resposta de busca de cidades é inválida.', 'invalid-response');
  }

  const results = (payload as GeocodingResponse).results;
  if (results === null || (Array.isArray(results) && results.length === 0)) {
    return [];
  }
  if (!Array.isArray(results)) {
    throw new WeatherServiceError('A resposta de busca de cidades é inválida.', 'invalid-response');
  }

  return results.map(mapCity);
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
    temperature_unit: 'celsius',
  });
  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível carregar o clima.', 'http', response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError('A resposta de clima é inválida.', 'invalid-response');
  }

  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError('A resposta de clima está incompleta.', 'invalid-response');
  }

  if (typeof payload.timezone !== 'string') {
    throw new WeatherServiceError('A resposta de clima é inválida.', 'invalid-response');
  }

  return {
    city,
    timezone: payload.timezone,
    current: mapCurrent(payload.current),
    forecast: mapForecast(payload.daily),
  };
}
