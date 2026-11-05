import { useReducer, useRef } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData, WeatherErrorCode } from '../types/weather';

export type WeatherHookStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface WeatherHookError extends Error {
  code?: WeatherErrorCode;
  status?: number;
}

interface WeatherHookState {
  status: WeatherHookStatus;
  data: WeatherData | null;
  cities: City[];
  error: WeatherHookError | null;
  query: string;
}

type WeatherHookAction =
  | { type: 'search-started'; query: string }
  | { type: 'cities-found'; cities: City[] }
  | { type: 'empty' }
  | { type: 'selection-started'; city: City }
  | { type: 'success'; data: WeatherData }
  | { type: 'failure'; error: WeatherHookError };

type RetryOperation = { type: 'search'; name: string } | { type: 'weather'; city: City };

const initialState: WeatherHookState = {
  status: 'idle',
  data: null,
  cities: [],
  error: null,
  query: '',
};

function weatherReducer(state: WeatherHookState, action: WeatherHookAction): WeatherHookState {
  switch (action.type) {
    case 'search-started':
      return {
        status: 'loading',
        data: null,
        cities: [],
        error: null,
        query: action.query,
      };
    case 'cities-found':
      return { ...state, cities: action.cities };
    case 'empty':
      return { ...state, status: 'empty', data: null, error: null };
    case 'selection-started':
      return {
        ...state,
        status: 'loading',
        data: null,
        error: null,
        query: action.city.name,
      };
    case 'success':
      return { ...state, status: 'success', data: action.data, error: null };
    case 'failure':
      return { ...state, status: 'error', data: null, error: action.error };
  }
}

function normalizeError(error: unknown): WeatherHookError {
  if (error instanceof Error) return error as WeatherHookError;

  return Object.assign(new Error('Ocorreu um erro inesperado.'), {
    code: 'invalid-response' as const,
  });
}

export default function useWeather() {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const requestIdRef = useRef(0);
  const retryOperationRef = useRef<RetryOperation | null>(null);

  async function search(name: string): Promise<void> {
    const requestId = ++requestIdRef.current;
    retryOperationRef.current = { type: 'search', name };
    dispatch({ type: 'search-started', query: name });

    try {
      const cities = await searchCities(name);
      if (requestId !== requestIdRef.current) return;

      if (cities.length === 0) {
        dispatch({ type: 'empty' });
        return;
      }

      dispatch({ type: 'cities-found', cities });

      const firstCity = cities[0];
      if (!firstCity) {
        dispatch({ type: 'empty' });
        return;
      }

      retryOperationRef.current = { type: 'weather', city: firstCity };
      const data = await getWeather(firstCity);
      if (requestId !== requestIdRef.current) return;

      dispatch({ type: 'success', data });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      dispatch({ type: 'failure', error: normalizeError(error) });
    }
  }

  async function selectCity(city: City): Promise<void> {
    const requestId = ++requestIdRef.current;
    retryOperationRef.current = { type: 'weather', city };
    dispatch({ type: 'selection-started', city });

    try {
      const data = await getWeather(city);
      if (requestId !== requestIdRef.current) return;

      dispatch({ type: 'success', data });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      dispatch({ type: 'failure', error: normalizeError(error) });
    }
  }

  async function retry(): Promise<void> {
    const operation = retryOperationRef.current;
    if (!operation) return;

    if (operation.type === 'search') {
      await search(operation.name);
      return;
    }

    await selectCity(operation.city);
  }

  return {
    ...state,
    search,
    selectCity,
    retry,
  };
}
