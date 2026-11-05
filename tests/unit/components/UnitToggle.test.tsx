import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import UnitToggle from '../../../src/components/UnitToggle';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../../../src/types/weather';

const city: City = {
  name: 'Campinas',
  latitude: -22.9056,
  longitude: -47.0608,
  country: 'Brasil',
};

const current: CurrentWeatherData = {
  temperatureCelsius: 0,
  weatherCode: 0,
  relativeHumidityPercent: 50,
  windSpeedKmh: 10,
  precipitationMm: 0,
  surfacePressureHpa: 1013,
};

function UnitToggleWithWeather() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather city={city} current={current} unit={unit} />
    </>
  );
}

describe('UnitToggle with CurrentWeather', () => {
  it('updates the displayed temperature to Fahrenheit when °F is selected', async () => {
    const user = userEvent.setup();
    render(<UnitToggleWithWeather />);

    const toggle = screen.getByRole('group', { name: 'Unidade de temperatura' });
    await user.click(within(toggle).getByRole('button', { name: 'Fahrenheit' }));

    const currentWeather = screen.getByRole('region', { name: 'Clima atual' });
    expect(within(currentWeather).getByText('32 °F')).toBeInTheDocument();
  });
});
