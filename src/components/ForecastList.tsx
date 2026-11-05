import { useId } from 'react';
import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  const headingId = useId();
  const isPartial =
    forecast.length !== 5 ||
    forecast.some(
      (day) =>
        !Number.isFinite(day.minimumCelsius) ||
        !Number.isFinite(day.maximumCelsius) ||
        !Number.isFinite(day.weatherCode) ||
        !Number.isFinite(day.precipitationProbability),
    );

  return (
    <section aria-labelledby={headingId} className="text-white">
      <h2 id={headingId} className="mb-4 text-xl font-bold">
        Previsão de 5 dias
      </h2>
      {forecast.length === 0 ? (
        <p role="status" className="text-sm text-white/70">
          Previsão indisponível.
        </p>
      ) : (
        <>
          {isPartial && (
            <p role="status" className="mb-3 text-sm text-white/70">
              Previsão incompleta. Alguns dados estão indisponíveis.
            </p>
          )}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {forecast.map((day, index) => (
              <ForecastCard key={day.date} day={day} index={index} unit={unit} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
