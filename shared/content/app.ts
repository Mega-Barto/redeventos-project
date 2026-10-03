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
      to: '/app/events',
      icon: 'i-lucide-calendar-plus',
    },
    venue_sponsor: {
      title: 'Venue sponsor',
      description: 'Publica el espacio y recibe propuestas de eventos que pueden encajar.',
      cta: 'Publicar espacio',
      to: '/app/venue',
      icon: 'i-lucide-building',
    },
    local_sponsor: {
      title: 'Local sponsor',
      description: 'Mira necesidades abiertas y envía una propuesta con cantidad y fecha.',
      cta: 'Ver oportunidades',
      to: '/app/opportunities',
      icon: 'i-lucide-hand-heart',
    },
    moderator: {
      title: 'Moderación',
      description: 'Revisa evidencias, reportes y desafiliaciones. No apruebas publicaciones ni matches.',
      cta: 'Abrir moderación',
      to: '/app/moderation',
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
  createTo: '/app/events/new',
  empty: 'Todavía no has publicado un evento.',
  needRole: 'Necesitas el rol de organizador para crear eventos.',
} as const

export const appEventNewContent = {
  title: 'Nuevo evento',
  description:
    'El enlace de inscripción es obligatorio. La fecha puede ser un rango hasta que el espacio quede cerrado.',
  quantityHint: 'Opcional',
  unitHint: 'Solo si hay cantidad',
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
  description: 'Listas la red, apruebas evidencias, ocultas lo reportado y desafilias. No apruebas eventos ni matches.',
  tabs: {
    organizers: 'Organizadores',
    events: 'Eventos',
    sponsors: 'Aliados locales',
    evidence: 'Evidencias',
    reports: 'Reportes',
  },
  organizersEmpty: 'No hay organizadores con esos filtros.',
  sponsorsEmpty: 'No hay aliados locales con esos filtros.',
  eventsEmpty: 'No hay eventos con esos filtros.',
  evidenceTitle: 'Evidencias',
  evidenceEmpty: 'No hay evidencias pendientes.',
  evidenceAttendance: 'Asistencia',
  evidencePeople: 'personas',
  evidenceNote: 'Nota',
  evidenceReport: 'Lo que reportó el organizador',
  evidenceVenueNote: 'Sobre el espacio',
  evidenceContributionsNote: 'Sobre los aportes',
  evidenceContext: 'Contexto del evento',
  evidenceNeeds: 'Qué necesita el evento',
  evidenceVenue: 'Espacio',
  evidenceSponsors: 'Aliados locales',
  evidenceNeedsEmpty: 'Este evento no tiene necesidades registradas.',
  evidenceVenueEmpty: 'Aún no hay un espacio asociado.',
  evidenceSponsorsEmpty: 'Aún no hay aliados locales con match.',
  evidenceVenueSponsor: 'Venue sponsor',
  evidenceCoverageOf: 'de',
  reportsTitle: 'Reportes',
  reportsEmpty: 'No hay reportes abiertos.',
  searchProfiles: 'Buscar por nombre, correo o slug',
  searchEvents: 'Buscar por título u organizador',
  cityAll: 'Todas las ciudades',
  visibilityAll: 'Cualquier visibilidad',
  visibilityActive: 'Activos',
  visibilityHidden: 'Ocultos',
  visibilityDisaffiliated: 'Desafiliados',
  contributionAll: 'Cualquier aporte',
  statusAll: 'Cualquier estado',
  hiddenAll: 'Visibles y ocultos',
  hiddenOnlyVisible: 'Solo visibles',
  hiddenOnlyHidden: 'Solo ocultos',
  openProfile: 'Ver ficha',
  openEvent: 'Ver ficha',
  fichaLoading: 'Cargando ficha…',
  fichaMissing: 'No se pudo cargar la ficha.',
  fichaContact: 'Contacto público',
  fichaDate: 'Fecha',
  fichaPlace: 'Lugar',
  fichaAudience: 'Audiencia',
  fichaAttendees: 'Asistentes esperados',
  fichaNeeds: 'Qué necesita el evento',
  fichaBenefit: 'Qué recibe el aliado',
  hiddenBadge: 'Oculto',
  disaffiliatedBadge: 'Desafiliado',
  approve: 'Aprobar',
  reject: 'Rechazar',
  hide: 'Ocultar',
  disaffiliate: 'Desafiliar',
} as const
