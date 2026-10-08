export const notificationPrefsContent = {
  title: 'Avisos por correo',
  description:
    'Elige qué correos quieres recibir. WhatsApp y teléfono se revelan al aceptar un match; no se envían avisos por WhatsApp en el piloto.',
  save: 'Guardar avisos',
  saved: 'Avisos guardados.',
  loadError: 'No se pudieron cargar tus avisos.',
  saveError: 'No se pudieron guardar los avisos.',
  events: {
    offer_received: {
      label: 'Propuesta recibida',
      hint: 'Cuando alguien te envía una propuesta.',
    },
    offer_accepted: {
      label: 'Propuesta aceptada',
      hint: 'Cuando se cierra un match, con el contacto de la otra parte.',
    },
    evidence_submitted: {
      label: 'Evidencia en cola',
      hint: 'Para moderación: llega una evidencia nueva o reenviada.',
    },
    evidence_reviewed: {
      label: 'Evidencia revisada',
      hint: 'Cuando el moderador aprueba o rechaza tu evidencia.',
    },
  },
} as const

export type NotificationPrefsContent = typeof notificationPrefsContent
