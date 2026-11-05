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
});
