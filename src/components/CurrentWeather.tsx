import { formatTemperature } from '../lib/temperature';
import { getWeatherInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  icon: string;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <span aria-hidden="true" className="text-xl">
        {icon}
      </span>
      <div>
        <dt className="text-xs text-white/60">{label}</dt>
        <dd className="break-words text-sm font-semibold text-white">{value}</dd>
      </div>
    </div>
  );
}

function formatMetric(value: number | null, unit: string, maximumFractionDigits = 0): string {
  if (value === null) return 'Indisponível';

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits,
  }).format(value);
  const separator = unit === '%' ? '' : ' ';

  return `${formattedValue}${separator}${unit}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weather = getWeatherInfo(current.weatherCode);
  const location = [city.admin1, city.country].filter(Boolean).join(', ');
  const temperatureClassName =
    current.temperatureCelsius === null
      ? 'text-lg font-semibold'
      : 'text-5xl font-light tabular-nums sm:text-6xl md:text-7xl';

  return (
    <section
      aria-label="Clima atual"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-glass backdrop-blur-md md:p-8"
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)] md:items-center">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">{city.name}</h2>
          {location && <p className="mt-1 text-white/60">{location}</p>}

          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="text-6xl">
              {weather.icon}
            </span>
            <p className={temperatureClassName}>
              {formatTemperature(current.temperatureCelsius, unit)}
            </p>
          </div>
          <p className="mt-3 text-lg text-white/75">{weather.label}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <Metric
            icon="💧"
            label="Umidade"
            value={formatMetric(current.relativeHumidityPercent, '%')}
          />
          <Metric icon="💨" label="Vento" value={formatMetric(current.windSpeedKmh, 'km/h')} />
          <Metric
            icon="🌧️"
            label="Precipitação"
            value={formatMetric(current.precipitationMm, 'mm', 1)}
          />
          <Metric
            icon="📊"
            label="Pressão"
            value={formatMetric(current.surfacePressureHpa, 'hPa')}
          />
        </dl>
      </div>
    </section>
  );
}
