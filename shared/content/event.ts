export const eventPublicContent = {
  missingTitle: 'Este evento no está público',
  missingDescription: 'La ficha aparece cuando hay fecha concreta y lugar. Si ya se realizó, búscalo en casos.',
  casesCta: 'Ver casos',
  dateLabel: 'Fecha',
  placeLabel: 'Lugar',
  audienceLabel: 'Audiencia',
  attendeesLabel: 'Asistentes esperados',
  datePending: 'Por confirmar',
  rsvpLabel: 'Inscribirme',
  networkTitle: 'Qué hizo posible el evento',
  networkDescription: 'Espacio y aliados locales que cubren o están resolviendo las necesidades.',
  venueRole: 'Espacio',
  localRole: 'Aliado local',
  seekingLabel: 'Buscando aliado',
  evidenceTitle: 'Evidencias',
  evidenceDescription: 'Fotos aprobadas del encuentro.',
  evidenceLinkLabel: 'Ver evidencia',
  status: {
    pending: 'Pendiente',
    requested: 'Solicitado',
    confirmed: 'Confirmado',
  },
} as const

export type EventPublicContent = typeof eventPublicContent
