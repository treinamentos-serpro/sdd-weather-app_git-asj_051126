import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherInfo } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const weather = getWeatherInfo(day.weatherCode);
  const precipitation =
    day.precipitationProbability === null
      ? 'Indisponível'
      : `${Math.round(day.precipitationProbability)}%`;

  return (
    <li className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-white shadow-glass backdrop-blur-md sm:p-4">
      <h3 className="font-semibold">{getDayLabel(day.date, index)}</h3>
      <p className="text-xs text-white/60">{getShortDate(day.date)}</p>
      <span aria-hidden="true" className="text-3xl" title={weather.label}>
        {weather.icon}
      </span>
      <span className="sr-only">{weather.label}</span>
      <div className="flex min-w-0 flex-wrap items-baseline justify-center gap-x-2 text-sm">
        <span className="font-semibold">
          <span className="sr-only">Máxima: </span>
          {formatTemperature(day.maximumCelsius, unit)}
        </span>
        <span className="text-white/60">
          <span className="sr-only">Mínima: </span>
          {formatTemperature(day.minimumCelsius, unit)}
        </span>
      </div>
      <p className="text-xs text-accent-400">
        <span aria-hidden="true">💧 </span>
        <span className="sr-only">Probabilidade de chuva: </span>
        {precipitation}
      </p>
    </li>
  );
}
