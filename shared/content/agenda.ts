export const agendaContent = {
  title: 'Agenda',
  description: 'Fichas públicas: ya tienen fecha concreta y lugar. La inscripción sigue en el enlace del organizador.',
  seoDescription: 'Agenda de eventos públicos con fecha y lugar en Pereira y Dosquebradas.',
  empty: 'Todavía no hay eventos en la agenda.',
  loadErrorTitle: 'No se pudo cargar el listado',
  loadErrorDescription: 'Vuelve a intentar en un momento.',
  seekingHint: '¿Quieres apoyar un evento que aún está armándose?',
  seekingCta: 'Ver eventos que buscan apoyo',
  seekingTo: '/events',
} as const

export type AgendaContent = typeof agendaContent
