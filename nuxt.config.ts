// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-29',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'redeventos-color-mode',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es-CO' },
      titleTemplate: '%s · Redeventos',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu+Sans:wght@400;500;700&display=swap',
        },
      ],
    },
  },
  supabase: {
    types: '~~/shared/types/database.types.ts',
    // Las fichas públicas no exigen sesión; las rutas privadas se protegen con middleware propio.
    redirect: false,
  },
  runtimeConfig: {
    resendApiKey: '',
    resendFrom: 'Redeventos <onboarding@resend.dev>',
  },
  nitro: {
    preset: process.env.NITRO_PRESET === 'node' ? 'node' : 'cloudflare_module',
  },
  // WSL 9p mounts often miss native fs events; polling keeps Vite HMR reliable in the container.
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  },
  routeRules: {
    '/registro': { redirect: '/register' },
    '/entrar': { redirect: '/login' },
    '/privacidad': { redirect: '/privacy' },
    '/compromiso': { redirect: '/commitment' },
    '/eventos': { redirect: '/events' },
    '/eventos/**': { redirect: '/events/**' },
    '/calendario': { redirect: '/agenda' },
    '/casos': { redirect: '/cases' },
    '/casos/**': { redirect: '/cases/**' },
    '/app/eventos/nuevo': { redirect: '/app/events/new' },
    '/app/eventos/**': { redirect: '/app/events/**' },
    '/app/espacio': { redirect: '/app/venue' },
    '/app/oportunidades/**': { redirect: '/app/opportunities/**' },
    '/app/oportunidades': { redirect: '/app/opportunities' },
    '/app/propuestas': { redirect: '/app/offers' },
    '/app/moderacion': { redirect: '/app/moderation' },
    '/app/perfil': { redirect: '/app/profile' },
    '/privacy': { prerender: true },
    '/commitment': { prerender: true },
  },
})
