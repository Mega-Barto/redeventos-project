export const publicNav = [
  { label: 'Problema', to: '/#problema' },
  { label: 'Cómo funciona', to: '/#como-funciona' },
  { label: 'Perfiles', to: '/#perfiles' },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Espacios', to: '/venues' },
  { label: 'Aliados', to: '/sponsors' },
] as const

export const headerActions = {
  signIn: 'Entrar',
  signUp: 'Crear cuenta',
} as const

export const footerContent = {
  territory: 'Pereira y Dosquebradas',
  privacy: { label: 'Aviso de privacidad', to: '/privacidad' },
  commitment: { label: 'Compromiso de registro', to: '/compromiso' },
} as const
