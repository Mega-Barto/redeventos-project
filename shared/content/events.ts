export const eventsSeekingContent = {
  title: 'Eventos',
  description:
    'Eventos de Pereira y Dosquebradas que aún buscan espacio o aliados locales. Si puedes aportar, entra y envía una propuesta.',
  seoDescription: 'Eventos que buscan apoyo en Pereira y Dosquebradas.',
  empty: 'Por ahora no hay eventos buscando apoyo.',
  loadErrorTitle: 'No se pudo cargar el listado',
  loadErrorDescription: 'Vuelve a intentar en un momento.',
  supportCta: 'Quiero apoyar',
  needsLabel: 'Necesita',
  agendaHint: 'Si buscas qué hacer con fecha y lugar confirmados, ve a la agenda.',
  agendaCta: 'Ver agenda',
  agendaTo: '/agenda',
} as const

export type EventsSeekingContent = typeof eventsSeekingContent
