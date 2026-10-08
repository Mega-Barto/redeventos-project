export const NOTIFICATION_EVENT_KEYS = [
  'offer_received',
  'offer_accepted',
  'offer_rejected',
  'offer_cancelled',
  'evidence_submitted',
  'evidence_reviewed',
  'report_created',
  'content_hidden',
  'disaffiliated',
  'case_completed',
] as const

export type NotificationEventKey = (typeof NOTIFICATION_EVENT_KEYS)[number]

export const NOTIFICATION_CHANNELS = ['email', 'whatsapp'] as const
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]

/** Escenarios con correo en el piloto (A, B, E, F). */
export const PILOT_EMAIL_EVENT_KEYS = [
  'offer_received',
  'offer_accepted',
  'evidence_submitted',
  'evidence_reviewed',
] as const satisfies readonly NotificationEventKey[]

export type PilotEmailEventKey = (typeof PILOT_EMAIL_EVENT_KEYS)[number]

const PILOT_EMAIL_ON = new Set<NotificationEventKey>(PILOT_EMAIL_EVENT_KEYS)

export function defaultEmailEnabled(eventKey: NotificationEventKey): boolean {
  return PILOT_EMAIL_ON.has(eventKey)
}

export function isPilotEmailEvent(eventKey: NotificationEventKey): eventKey is PilotEmailEventKey {
  return PILOT_EMAIL_ON.has(eventKey)
}
