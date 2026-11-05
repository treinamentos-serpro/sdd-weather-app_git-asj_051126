import { expect, type Page, test } from '@playwright/test';

const geocodingResponse = {
  results: [
    {
      name: 'Campinas',
      latitude: -22.9056,
      longitude: -47.0608,
      country: 'Brasil',
      country_code: 'BR',
      admin1: 'São Paulo',
      timezone: 'America/Sao_Paulo',
    },
  ],
};

const forecastResponse = {
  timezone: 'America/Sao_Paulo',
  current: {
    temperature_2m: 20,
    relative_humidity_2m: 60,
    wind_speed_10m: 12,
    surface_pressure: 1013,
    precipitation: 0,
    weather_code: 1,
  },
  daily: {
    time: ['2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09'],
    weather_code: [1, 2, 3, 1, 0],
    temperature_2m_min: [10, 11, 12, 13, 14],
    temperature_2m_max: [30, 31, 32, 33, 34],
    precipitation_probability_max: [0, 10, 20, 30, 40],
  },
};

async function mockWeatherApi(
  page: Page,
  geocoding: typeof geocodingResponse | Record<string, never> = geocodingResponse,
  onForecastRequest?: () => void,
) {
  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: geocoding,
    });
  });

  await page.route('https://api.open-meteo.com/**', async (route) => {
    onForecastRequest?.();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: forecastResponse,
    });
  });
}

async function searchCampinas(page: Page) {
  await page.goto('/');
  await page.getByLabel('Cidade').fill('Campinas');
  await page.getByRole('button', { name: 'Buscar' }).click();
}

test('busca uma cidade, exibe a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  await mockWeatherApi(page);
  await searchCampinas(page);

  await expect(page.getByRole('heading', { name: 'Campinas', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Resultado do clima' })).toBeFocused();

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(page.getByText('68 °F', { exact: true })).toBeVisible();
});

test('mostra o estado vazio quando o geocoding não retorna results', async ({ page }) => {
  let forecastRequests = 0;
  await mockWeatherApi(page, {}, () => {
    forecastRequests += 1;
  });

  await searchCampinas(page);

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Resultado do clima' })).toBeFocused();
  expect(forecastRequests).toBe(0);
});

test('renderiza o clima atual no viewport mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockWeatherApi(page);
  await searchCampinas(page);

  await expect(page.getByRole('heading', { name: 'Campinas', exact: true })).toBeVisible();
  await expect(page.getByText('20 °C', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
