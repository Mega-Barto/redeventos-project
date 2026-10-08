import {
  defaultEmailEnabled,
  type NotificationEventKey,
  type PilotEmailEventKey,
} from '../constants/notification-events'

export function emailEnabledFromRow(
  eventKey: NotificationEventKey,
  row: { enabled: boolean } | null | undefined,
): boolean {
  if (row) return row.enabled
  return defaultEmailEnabled(eventKey)
}

export type DirectContact = { whatsapp: string | null; phone: string | null }

export type OfferAcceptedParty = {
  profileId: string
  email: string | null
}

/** Un payload por destinatario con el contacto de la contraparte. */
export function offerAcceptedRecipientPayloads(input: {
  organizer: OfferAcceptedParty
  sponsor: OfferAcceptedParty
  contacts: Record<string, DirectContact | undefined>
}): Array<{ to: string; profileId: string; whatsapp: string; phone: string }> {
  const pairs = [
    { recipient: input.organizer, otherId: input.sponsor.profileId },
    { recipient: input.sponsor, otherId: input.organizer.profileId },
  ]
  const payloads: Array<{ to: string; profileId: string; whatsapp: string; phone: string }> = []
  for (const pair of pairs) {
    if (!pair.recipient.email) continue
    const contact = input.contacts[pair.otherId]
    payloads.push({
      to: pair.recipient.email,
      profileId: pair.recipient.profileId,
      whatsapp: contact?.whatsapp ?? '',
      phone: contact?.phone ?? '',
    })
  }
  return payloads
}

export function uniqueModeratorEmails(
  rows: Array<{ profile_id: string; email: string | null }>,
): Array<{ profileId: string; email: string }> {
  const seen = new Set<string>()
  const list: Array<{ profileId: string; email: string }> = []
  for (const row of rows) {
    const email = row.email?.trim()
    if (!email) continue
    const key = email.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    list.push({ profileId: row.profile_id, email })
  }
  return list
}

export function filterRecipientsByEmailPref<T extends { profileId: string }>(
  eventKey: PilotEmailEventKey,
  recipients: T[],
  prefsByProfile: Record<string, { enabled: boolean } | undefined>,
): T[] {
  return recipients.filter((recipient) => emailEnabledFromRow(eventKey, prefsByProfile[recipient.profileId] ?? null))
}

export function evidenceSubmittedIdempotencyKey(evidenceId: string, updatedAt: string): string {
  return `evidence-submitted/${evidenceId}/${updatedAt}`
}
