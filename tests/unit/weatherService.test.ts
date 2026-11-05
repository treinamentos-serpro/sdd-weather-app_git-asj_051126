import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const city: City = {
  name: 'Campinas',
  latitude: -22.9056,
  longitude: -47.0608,
  country: 'Brasil',
};

const current = {
  time: '2026-11-05T12:00',
  temperature_2m: 24.3,
  relative_humidity_2m: 68,
  wind_speed_10m: 13.4,
  surface_pressure: 1014.3,
  precipitation: 0.2,
  weather_code: 1,
};

const daily = {
  time: ['2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09'],
  weather_code: [1, 2, 3, 1, 0],
  temperature_2m_min: [17.1, 18, 17.4, 16.9, 17.2],
  temperature_2m_max: [28.2, 27.5, 26.8, 29, 30.1],
  precipitation_probability_max: [null, 20, 45, 65, 0],
};

function stubFetch(payload: unknown, status = 200) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('searchCities', () => {
  it('returns an empty list for blank input without calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps geocoding results to City values', async () => {
    const fetchMock = stubFetch({
      results: [
        {
          name: 'Campinas',
          latitude: -22.9056,
          longitude: -47.0608,
          country: 'Brasil',
          country_code: 'BR',
          admin1: 'São Paulo',
          timezone: 'America/Sao_Paulo',
        },
      ],
    });

    await expect(searchCities('Campinas')).resolves.toEqual([
      {
        name: 'Campinas',
        latitude: -22.9056,
        longitude: -47.0608,
        country: 'Brasil',
        countryCode: 'BR',
        admin1: 'São Paulo',
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('encodes accents, hyphens, and apostrophes in the query', async () => {
    const fetchMock = stubFetch({ results: [] });
    const query = "São-Paulo d'Água";

    await searchCities(query);

    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(new URL(requestUrl).searchParams.get('name')).toBe(query);
    expect(requestUrl).toContain(encodeURIComponent(query));
  });

  it('returns an empty list when results is absent', async () => {
    stubFetch({});

    await expect(searchCities('Campinas')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    stubFetch({}, 503);

    await expect(searchCities('Campinas')).rejects.toBeInstanceOf(WeatherServiceError);
    await expect(searchCities('Campinas')).rejects.toMatchObject({
      code: 'http',
      status: 503,
    });
  });
});

describe('getWeather', () => {
  it('maps current and daily arrays to five forecast days', async () => {
    stubFetch({
      timezone: 'America/Sao_Paulo',
      current,
      daily,
    });

    const weather = await getWeather(city);

    expect(weather.city).toEqual(city);
    expect(weather.current).toEqual({
      temperatureCelsius: 24.3,
      weatherCode: 1,
      relativeHumidityPercent: 68,
      windSpeedKmh: 13.4,
      precipitationMm: 0.2,
      surfacePressureHpa: 1014.3,
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[0]).toEqual({
      date: '2026-11-05',
      weatherCode: 1,
      minimumCelsius: 17.1,
      maximumCelsius: 28.2,
      precipitationProbability: 0,
    });
    expect(weather.forecast[4]).toEqual({
      date: '2026-11-09',
      weatherCode: 0,
      minimumCelsius: 17.2,
      maximumCelsius: 30.1,
      precipitationProbability: 0,
    });
  });

  it('throws WeatherServiceError when current is missing', async () => {
    stubFetch({ timezone: 'America/Sao_Paulo', daily });

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('throws WeatherServiceError when daily is missing', async () => {
    stubFetch({ timezone: 'America/Sao_Paulo', current });

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('throws WeatherServiceError when the forecast response is not ok', async () => {
    stubFetch({}, 502);

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'http',
      status: 502,
    });
  });

  it('converts network failures to WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(new TypeError('offline')));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'network',
      message: 'Falha de rede.',
    });
  });

  it('converts a request timeout to WeatherServiceError', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true },
            );
          }),
      ),
    );

    const request = getWeather(city);
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'timeout',
      message: 'A requisição demorou demais.',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;
  });

  it('converts invalid forecast JSON to WeatherServiceError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('invalid JSON');
        },
      } as unknown as Response),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'invalid-response',
    });
  });

  it('keeps partial forecast values unavailable and normalizes to five days', async () => {
    stubFetch({
      timezone: 'America/Sao_Paulo',
      current: { temperature_2m: null, weather_code: null },
      daily: {
        time: ['2026-11-05', '2026-11-06'],
        weather_code: [1],
        temperature_2m_min: [null],
        temperature_2m_max: [28.2],
        precipitation_probability_max: [10],
      },
    });

    const weather = await getWeather(city);

    expect(weather.current.temperatureCelsius).toBeNull();
    expect(weather.current.weatherCode).toBeNull();
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[0]).toMatchObject({
      date: '2026-11-05',
      weatherCode: 1,
      minimumCelsius: null,
      maximumCelsius: 28.2,
      precipitationProbability: 10,
    });
    expect(weather.forecast[1]).toMatchObject({
      date: '2026-11-06',
      weatherCode: null,
      minimumCelsius: null,
      maximumCelsius: null,
      precipitationProbability: null,
    });
    expect(weather.forecast[4]?.date).toBe('2026-11-09');
  });
});
