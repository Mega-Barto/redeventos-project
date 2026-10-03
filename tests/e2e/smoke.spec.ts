import { expect, test } from '@playwright/test'

test('landing muestra la propuesta y los tres perfiles', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-CO')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La red hace posible el evento')
  await expect(page.getByRole('link', { name: 'Publicar evento' }).first()).toHaveAttribute(
    'href',
    '/register?role=organizer',
  )
  await expect(page.getByRole('link', { name: 'Ofrecer espacio o apoyo' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'El evento se traba antes de existir' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'La plataforma registra. Las personas cierran el match.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Organizador' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Venue sponsor' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Local sponsor' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Aviso de privacidad' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Compromiso de registro' })).toBeVisible()
  await expect(page.getByText('eje cafetero')).toHaveCount(0)
})

test('el menú móvil incluye la navegación pública', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await expect(page.getByRole('link', { name: 'Cómo funciona' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Crear cuenta' })).toBeVisible()
})

test('el aviso de privacidad y el compromiso son páginas', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aviso de privacidad')
  await page.goto('/commitment')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Compromiso de registro')
})

test('la app privada pide entrar', async ({ page }) => {
  await page.goto('/app')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('el endpoint de salud responde', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBe(true)
  expect(await response.json()).toEqual({ status: 'ok' })
})
