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
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap',
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
    preset: 'cloudflare_module',
  },
})
