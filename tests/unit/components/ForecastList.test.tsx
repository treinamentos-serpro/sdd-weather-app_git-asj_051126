import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../../src/components/ForecastList';
import type { ForecastDay } from '../../../src/types/weather';

describe('ForecastList partial data', () => {
  it('marks missing temperatures and precipitation as unavailable', () => {
    const forecast: ForecastDay[] = [
      {
        date: '2026-11-05',
        minimumCelsius: null,
        maximumCelsius: null,
        weatherCode: 1,
        precipitationProbability: null,
      },
    ];

    render(<ForecastList forecast={forecast} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');
    expect(screen.getAllByText('Indisponível')).toHaveLength(3);
  });

  it('marks non-finite forecast values unavailable without rendering NaN', () => {
    const forecast: ForecastDay[] = Array.from({ length: 5 }, (_, index) => ({
      date: `2026-11-0${index + 5}`,
      minimumCelsius: index === 0 ? Number.NaN : 10,
      maximumCelsius: 20,
      weatherCode: 1,
      precipitationProbability: index === 0 ? Number.POSITIVE_INFINITY : 0,
    }));

    render(<ForecastList forecast={forecast} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');
    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
    expect(screen.getByRole('list')).not.toHaveTextContent(/NaN|Infinity|undefined/);
  });
});
