export const appHomeContent = {
  title: 'Tu lugar en la red',
  description: 'Publica lo que falta, o propone cómo cubrirlo. El match lo cierran las dos partes.',
  empty: 'Elige al menos un rol en tu perfil para publicar un evento, un espacio o un aporte.',
  profileCta: 'Completar perfil',
  entries: {
    organizer: {
      title: 'Organizador',
      description: 'Publica el evento, di qué necesitas y revisa las propuestas que te lleguen.',
      cta: 'Ver mis eventos',
      to: '/app/eventos',
      icon: 'i-lucide-calendar-plus',
    },
    venue_sponsor: {
      title: 'Venue sponsor',
      description: 'Publica el espacio y recibe propuestas de eventos que pueden encajar.',
      cta: 'Publicar espacio',
      to: '/app/espacio',
      icon: 'i-lucide-building',
    },
    local_sponsor: {
      title: 'Local sponsor',
      description: 'Mira necesidades abiertas y envía una propuesta con cantidad y fecha.',
      cta: 'Ver oportunidades',
      to: '/app/oportunidades',
      icon: 'i-lucide-hand-heart',
    },
    moderator: {
      title: 'Moderación',
      description: 'Revisa evidencias, reportes y desafiliaciones. No apruebas publicaciones ni matches.',
      cta: 'Abrir moderación',
      to: '/app/moderacion',
      icon: 'i-lucide-shield',
    },
  },
} as const

export const appProfileContent = {
  title: 'Perfil',
  description:
    'Correo, Instagram y web se ven en la red. WhatsApp y teléfono solo aparecen cuando las dos partes aceptan un match.',
} as const

export const appEventsContent = {
  title: 'Eventos',
  description:
    'Un borrador lo ves tú. Al publicarlo, lo ven los sponsors. La ficha pública pide fecha concreta y lugar.',
  createLabel: 'Nuevo evento',
  createTo: '/app/eventos/nuevo',
  empty: 'Todavía no has publicado un evento.',
  needRole: 'Necesitas el rol de organizador para crear eventos.',
} as const

export const appEventNewContent = {
  title: 'Nuevo evento',
  description:
    'El enlace de inscripción es obligatorio. La fecha puede ser un rango hasta que el espacio quede cerrado.',
} as const

export const appEventDetailContent = {
  publish: 'Publicar para sponsors',
  cancel: 'Cancelar evento',
  publicLink: 'Ver ficha pública',
  makePublicTitle: 'Abrir ficha pública',
  makePublicDescription: 'Hace falta una fecha concreta y un lugar.',
  evidenceTitle: 'Evidencia de realización',
  evidenceDescription: 'Cuéntanos la asistencia, el espacio y los aportes cumplidos. El moderador la aprueba.',
  offerTitle: 'Proponer a un espacio o aliado',
  missing: 'Evento no encontrado',
} as const

export const appVenueContent = {
  title: 'Tu espacio',
  description: 'La ficha es estática. El calendario público muestra solo días en negociación o comprometidos.',
  needRole: 'Necesitas el rol de venue sponsor para publicar un espacio.',
  saved: 'Espacio guardado.',
} as const

export const appOpportunitiesContent = {
  title: 'Oportunidades',
  description: 'Necesidades abiertas en Pereira y Dosquebradas. WhatsApp y teléfono no aparecen aquí.',
  empty: 'No hay necesidades abiertas con esos filtros.',
  needRole: 'Este listado es para venue sponsors y local sponsors.',
  detailMissing: 'Oportunidad no encontrada',
  offerTitle: 'Enviar propuesta',
  offerDescription: 'Indica cuánto puedes cubrir y en qué fecha.',
} as const

export const appOffersContent = {
  title: 'Propuestas',
  description: 'Al aceptar queda el compromiso: qué, cuánto y cuándo. Ahí se revelan WhatsApp y teléfono.',
  empty: 'No tienes propuestas pendientes ni cerradas.',
  incoming: 'Recibidas',
  outgoing: 'Enviadas',
  accept: 'Aceptar',
  reject: 'Rechazar',
  cancel: 'Cancelar propuesta',
  contacts: 'Contactos directos',
} as const

export const appModerationContent = {
  title: 'Moderación',
  description: 'Apruebas evidencias, ocultas lo reportado y desafilias. No apruebas eventos ni matches.',
  evidenceTitle: 'Evidencias',
  evidenceEmpty: 'No hay evidencias pendientes.',
  reportsTitle: 'Reportes',
  reportsEmpty: 'No hay reportes abiertos.',
  disaffiliateTitle: 'Desafiliar',
  disaffiliateDescription: 'Quien incumple el compromiso de registro o el de match deja de poder usar el sello.',
  approve: 'Aprobar',
  reject: 'Rechazar',
  hide: 'Ocultar',
  disaffiliate: 'Desafiliar',
} as const
