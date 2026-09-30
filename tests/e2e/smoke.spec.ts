import { expect, test } from '@playwright/test'

test('landing muestra la propuesta de Redeventos', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La red hace posible el evento')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-CO')
})

test('el endpoint de salud responde', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBe(true)
  expect(await response.json()).toEqual({ status: 'ok' })
})
