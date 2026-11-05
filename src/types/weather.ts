export type Unit = 'celsius' | 'fahrenheit';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'partial' | 'error';

export type WeatherErrorCode = 'network' | 'timeout' | 'http' | 'invalid-response';

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperatureCelsius: number | null;
  weatherCode: number | null;
  relativeHumidityPercent: number | null;
  windSpeedKmh: number | null;
  precipitationMm: number | null;
  surfacePressureHpa: number | null;
}

export interface ForecastDay {
  date: string;
  minimumCelsius: number | null;
  maximumCelsius: number | null;
  weatherCode: number | null;
  precipitationProbability: number | null;
}

export interface WeatherData {
  city: City;
  timezone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface WeatherViewState {
  query: string;
  searchStatus: SearchStatus;
  searchResults: City[];
  selectedCity: City | null;
  weatherStatus: WeatherStatus;
  weather: WeatherData | null;
  unit: Unit;
  errorCode: WeatherErrorCode | null;
  errorMessage: string | null;
}
