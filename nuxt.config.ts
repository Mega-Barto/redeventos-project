// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-29',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es-CO' },
      titleTemplate: '%s · Redeventos',
    },
  },
  supabase: {
    types: '~~/shared/types/database.types.ts',
    // Las fichas públicas no exigen sesión; las rutas privadas se protegen con middleware propio.
    redirect: false,
  },
  nitro: {
    preset: 'cloudflare_module',
  },
})
