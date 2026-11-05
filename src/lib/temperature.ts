import type { Unit } from '../types/weather';

export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? celsius * (9 / 5) + 32 : celsius;
}

export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatTemperature(celsius: number | null, unit: Unit): string {
  if (celsius === null || !Number.isFinite(celsius)) return 'Indisponível';

  const converted = convertTemperature(celsius, unit);
  const rounded = Math.sign(converted) * Math.round(Math.abs(converted));

  return `${rounded} ${unitLabel(unit)}`;
}
