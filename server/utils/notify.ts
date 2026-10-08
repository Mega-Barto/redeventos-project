import type { SupabaseClient } from '@supabase/supabase-js'
import type { PilotEmailEventKey } from '~~/shared/constants/notification-events'
import {
  evidenceReviewedEmail,
  evidenceSubmittedEmail,
  offerAcceptedEmail,
  offerReceivedEmail,
} from '~~/shared/content/emails'
import type { Database } from '~~/shared/types/database.types'
import {
  emailEnabledFromRow,
  evidenceSubmittedIdempotencyKey,
  filterRecipientsByEmailPref,
  offerAcceptedRecipientPayloads,
  uniqueModeratorEmails,
} from '~~/shared/utils/notifications'

type Db = SupabaseClient<Database>

function logSendFailure(input: { eventKey: PilotEmailEventKey; to: string; reason: string }) {
  console.error(
    JSON.stringify({
      msg: 'notification_send_failed',
      eventKey: input.eventKey,
      to: input.to,
      reason: input.reason,
    }),
  )
}

async function emailPrefEnabled(client: Db, profileId: string, eventKey: PilotEmailEventKey) {
  const { data } = await client
    .from('notification_preferences')
    .select('enabled')
    .eq('profile_id', profileId)
    .eq('event_key', eventKey)
    .eq('channel', 'email')
    .maybeSingle()
  return emailEnabledFromRow(eventKey, data)
}

async function prefsByProfile(client: Db, profileIds: string[], eventKey: PilotEmailEventKey) {
  if (!profileIds.length) return {} as Record<string, { enabled: boolean } | undefined>
  const { data } = await client
    .from('notification_preferences')
    .select('profile_id, enabled')
    .eq('event_key', eventKey)
    .eq('channel', 'email')
    .in('profile_id', profileIds)
  const map: Record<string, { enabled: boolean } | undefined> = {}
  for (const row of data ?? []) map[row.profile_id] = { enabled: row.enabled }
  return map
}

async function sendMail(input: {
  eventKey: PilotEmailEventKey
  to: string
  subject: string
  html: string
  idempotencyKey: string
}) {
  const result = await sendTransactionalEmail({
    to: input.to,
    subject: input.subject,
    html: input.html,
    idempotencyKey: input.idempotencyKey,
  })
  if (!result.sent && result.reason !== 'skipped') {
    logSendFailure({ eventKey: input.eventKey, to: input.to, reason: result.reason })
  }
  return result
}

export async function notifyOfferReceived(client: Db, offerId: string) {
  const { data: offer } = await client
    .from('offers')
    .select('id, recipient_id, note, event_id')
    .eq('id', offerId)
    .maybeSingle()
  if (!offer) return { sent: false as const, reason: 'missing_offer' as const }

  const enabled = await emailPrefEnabled(client, offer.recipient_id, 'offer_received')
  if (!enabled) return { sent: false as const, reason: 'pref_off' as const }

  const [{ data: recipient }, { data: hosted }] = await Promise.all([
    client.from('profiles').select('email').eq('id', offer.recipient_id).maybeSingle(),
    client.from('events').select('title').eq('id', offer.event_id).maybeSingle(),
  ])
  if (!recipient?.email || !hosted) return { sent: false as const, reason: 'missing_profile' as const }

  const message = offerReceivedEmail({ eventTitle: hosted.title, note: offer.note })
  return sendMail({
    eventKey: 'offer_received',
    to: recipient.email,
    subject: message.subject,
    html: message.html,
    idempotencyKey: `offer-received/${offer.id}`,
  })
}

export async function notifyOfferAccepted(client: Db, offerId: string) {
  const { data: match } = await client
    .from('matches')
    .select('id, organizer_id, sponsor_id, event_id')
    .eq('offer_id', offerId)
    .maybeSingle()
  if (!match) return { sent: false as const, reason: 'missing_match' as const }

  const [{ data: hosted }, { data: commitment }, { data: profiles }, { data: directs }] = await Promise.all([
    client.from('events').select('title').eq('id', match.event_id).maybeSingle(),
    client.from('match_commitments').select('what, quantity, when_on').eq('match_id', match.id).maybeSingle(),
    client.from('profiles').select('id, email').in('id', [match.organizer_id, match.sponsor_id]),
    client
      .from('profile_direct_contacts')
      .select('profile_id, whatsapp, phone')
      .in('profile_id', [match.organizer_id, match.sponsor_id]),
  ])
  if (!hosted || !commitment) return { sent: false as const, reason: 'missing_commitment' as const }

  const emailById = Object.fromEntries((profiles ?? []).map((row) => [row.id, row.email]))
  const contacts = Object.fromEntries(
    (directs ?? []).map((row) => [row.profile_id, { whatsapp: row.whatsapp, phone: row.phone }]),
  )
  const payloads = offerAcceptedRecipientPayloads({
    organizer: { profileId: match.organizer_id, email: emailById[match.organizer_id] ?? null },
    sponsor: { profileId: match.sponsor_id, email: emailById[match.sponsor_id] ?? null },
    contacts,
  })
  const prefs = await prefsByProfile(
    client,
    payloads.map((item) => item.profileId),
    'offer_accepted',
  )
  const allowed = filterRecipientsByEmailPref('offer_accepted', payloads, prefs)
  const results = []
  for (const item of allowed) {
    const message = offerAcceptedEmail({
      eventTitle: hosted.title,
      what: commitment.what,
      quantity: String(commitment.quantity),
      whenOn: commitment.when_on,
      whatsapp: item.whatsapp,
      phone: item.phone,
    })
    results.push(
      await sendMail({
        eventKey: 'offer_accepted',
        to: item.to,
        subject: message.subject,
        html: message.html,
        idempotencyKey: `offer-accepted/${match.id}/${item.to}`,
      }),
    )
  }
  return { results }
}

export async function notifyEvidenceSubmitted(client: Db, evidenceId: string) {
  const { data: evidence } = await client
    .from('evidence')
    .select('id, event_id, status, updated_at')
    .eq('id', evidenceId)
    .maybeSingle()
  if (evidence?.status !== 'submitted') {
    return { sent: false as const, reason: 'not_submitted' as const }
  }

  const [{ data: hosted }, { data: roles }] = await Promise.all([
    client.from('events').select('title').eq('id', evidence.event_id).maybeSingle(),
    client.from('profile_roles').select('profile_id').eq('role', 'moderator'),
  ])
  if (!hosted) return { sent: false as const, reason: 'missing_event' as const }

  const moderatorIds = [...new Set((roles ?? []).map((row) => row.profile_id))]
  if (!moderatorIds.length) {
    console.error(JSON.stringify({ msg: 'notification_no_moderators', eventKey: 'evidence_submitted', evidenceId }))
    return { sent: false as const, reason: 'no_moderators' as const }
  }

  const { data: profiles } = await client.from('profiles').select('id, email').in('id', moderatorIds)
  const mods = uniqueModeratorEmails((profiles ?? []).map((row) => ({ profile_id: row.id, email: row.email })))
  if (!mods.length) {
    console.error(JSON.stringify({ msg: 'notification_no_moderators', eventKey: 'evidence_submitted', evidenceId }))
    return { sent: false as const, reason: 'no_moderators' as const }
  }

  const prefs = await prefsByProfile(
    client,
    mods.map((item) => item.profileId),
    'evidence_submitted',
  )
  const allowed = filterRecipientsByEmailPref('evidence_submitted', mods, prefs)
  const message = evidenceSubmittedEmail({ eventTitle: hosted.title })
  const results = []
  for (const item of allowed) {
    results.push(
      await sendMail({
        eventKey: 'evidence_submitted',
        to: item.email,
        subject: message.subject,
        html: message.html,
        idempotencyKey: evidenceSubmittedIdempotencyKey(evidence.id, evidence.updated_at),
      }),
    )
  }
  return { results }
}

export async function notifyEvidenceReviewed(client: Db, evidenceId: string) {
  const { data: evidence } = await client
    .from('evidence')
    .select('id, event_id, status, review_note, submitted_by')
    .eq('id', evidenceId)
    .maybeSingle()
  if (evidence?.status !== 'approved' && evidence?.status !== 'rejected') {
    return { sent: false as const, reason: 'not_reviewed' as const }
  }

  const enabled = await emailPrefEnabled(client, evidence.submitted_by, 'evidence_reviewed')
  if (!enabled) return { sent: false as const, reason: 'pref_off' as const }

  const [{ data: hosted }, { data: organizer }] = await Promise.all([
    client.from('events').select('title').eq('id', evidence.event_id).maybeSingle(),
    client.from('profiles').select('email').eq('id', evidence.submitted_by).maybeSingle(),
  ])
  if (!hosted || !organizer?.email) return { sent: false as const, reason: 'missing_profile' as const }

  const message = evidenceReviewedEmail({
    eventTitle: hosted.title,
    decision: evidence.status,
    note: evidence.review_note ?? '',
  })
  return sendMail({
    eventKey: 'evidence_reviewed',
    to: organizer.email,
    subject: message.subject,
    html: message.html,
    idempotencyKey: `evidence-${evidence.status}/${evidence.id}`,
  })
}
