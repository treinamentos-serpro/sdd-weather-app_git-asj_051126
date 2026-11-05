import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, cities, error, query, search, selectCity, retry } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');
  const resultRef = useRef<HTMLElement>(null);
  const previousStatusRef = useRef(status);

  useEffect(() => {
    if (previousStatusRef.current === 'loading' && status !== 'loading') {
      resultRef.current?.focus();
    }

    previousStatusRef.current = status;
  }, [status]);

  function renderWeatherState() {
    switch (status) {
      case 'idle':
        return (
          <EmptyState
            title="Consulte o clima da sua cidade"
            hint="Digite o nome de uma cidade para começar."
          />
        );
      case 'loading':
        return <LoadingState />;
      case 'empty':
        return (
          <EmptyState
            title="Nenhuma cidade encontrada"
            hint={`Não encontramos resultados para “${query}”. Confira a grafia e tente novamente.`}
          />
        );
      case 'error':
        return (
          <ErrorState
            message={error?.message ?? 'Não foi possível carregar o clima.'}
            onRetry={retry}
          />
        );
      case 'success':
        if (!data) {
          return (
            <EmptyState
              title="Clima indisponível"
              hint="Faça uma nova busca para consultar as condições atuais."
            />
          );
        }

        return (
          <div className="flex flex-col gap-8">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen bg-night-900 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-accent-400">Weather</p>
            <h1 className="mt-1 text-2xl font-bold">Previsão do tempo</h1>
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </header>

        <SearchBar onSearch={search} />

        {cities.length > 0 && (
          <section aria-label="Cidades encontradas" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-white/70">Cidades encontradas</h2>
            <ul className="flex flex-wrap gap-2">
              {cities.map((city) => {
                const location = [city.admin1, city.country].filter(Boolean).join(', ');
                const isSelected =
                  data?.city.latitude === city.latitude &&
                  data.city.longitude === city.longitude &&
                  data.city.country === city.country;

                return (
                  <li key={`${city.name}-${city.latitude}-${city.longitude}-${city.country}`}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectCity(city)}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
                    >
                      <span className="block font-semibold">{city.name}</span>
                      <span className="block text-xs text-white/65">{location}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section
          ref={resultRef}
          aria-label="Resultado do clima"
          aria-busy={status === 'loading'}
          tabIndex={-1}
        >
          {renderWeatherState()}
        </section>
      </div>
    </main>
  );
}
