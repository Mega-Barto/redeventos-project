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
  networkTitle: 'Quién lo hace posible',
  networkDescription: 'Espacio y aliados locales que ya se comprometieron con este evento.',
  networkEmpty: 'Todavía no hay aliados confirmados. Si puedes aportar, únete a la red.',
  venueRole: 'Espacio',
  localRole: 'Aliado local',
  evidenceTitle: 'Evidencias',
  evidenceDescription: 'Fotos aprobadas del encuentro.',
  evidenceLinkLabel: 'Ver evidencia',
  supportCta: 'Quiero apoyar',
  supportModalTitle: 'Apoya este evento',
  supportModalDescription:
    'Para enviar una propuesta necesitas una cuenta de espacio o aliado local. Inscribirte al evento no pide cuenta: usa el botón de inscribirme.',
  supportLoginLabel: 'Entrar',
  supportRegisterLabel: 'Crear cuenta',
} as const

export type EventPublicContent = typeof eventPublicContent
