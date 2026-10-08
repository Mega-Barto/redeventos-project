export const publicNav = [
  { label: 'Problema', to: '/#problema' },
  { label: 'Cómo funciona', to: '/#como-funciona' },
  { label: 'Perfiles', to: '/#perfiles' },
  { label: 'Eventos', to: '/events' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Espacios', to: '/venues' },
  { label: 'Aliados', to: '/sponsors' },
  { label: 'Casos', to: '/cases' },
] as const

export const headerActions = {
  signIn: 'Entrar',
  signUp: 'Crear cuenta',
} as const

export const footerContent = {
  territory: 'Pereira y Dosquebradas',
  privacy: { label: 'Aviso de privacidad', to: '/privacy' },
  commitment: { label: 'Compromiso de registro', to: '/commitment' },
} as const
