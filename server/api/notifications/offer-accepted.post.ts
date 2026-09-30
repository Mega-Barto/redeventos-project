import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { offerAcceptedEmail } from '~~/shared/content/emails'
import { offerNoticeSchema } from '~~/shared/schemas/inputs'
import type { Database } from '~~/shared/types/database.types'

export default defineEventHandler(async (event) => {
  const parsed = offerNoticeSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const user = await serverSupabaseUser(event)
  const userId = user?.sub
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Debes entrar' })

  const client = await serverSupabaseClient<Database>(event)
  const { data: match } = await client
    .from('matches')
    .select('id, offer_id, organizer_id, sponsor_id, event_id')
    .eq('offer_id', parsed.data.offerId)
    .maybeSingle()
  if (!match || (match.organizer_id !== userId && match.sponsor_id !== userId)) {
    throw createError({ statusCode: 403, statusMessage: 'No puedes avisar este match' })
  }

  const otherId = match.organizer_id === userId ? match.sponsor_id : match.organizer_id
  const [{ data: hosted }, { data: commitment }, { data: otherProfile }, { data: direct }] = await Promise.all([
    client.from('events').select('title').eq('id', match.event_id).maybeSingle(),
    client.from('match_commitments').select('what, quantity, when_on').eq('match_id', match.id).maybeSingle(),
    client.from('profiles').select('email').eq('id', otherId).maybeSingle(),
    client.from('profile_direct_contacts').select('whatsapp, phone').eq('profile_id', otherId).maybeSingle(),
  ])
  if (!hosted || !commitment || !otherProfile?.email) return { sent: false }

  const message = offerAcceptedEmail({
    eventTitle: hosted.title,
    what: commitment.what,
    quantity: String(commitment.quantity),
    whenOn: commitment.when_on,
    whatsapp: direct?.whatsapp ?? '',
    phone: direct?.phone ?? '',
  })
  const { data: self } = await client.from('profiles').select('email').eq('id', userId).maybeSingle()
  const recipients = [otherProfile.email, self?.email].filter((email): email is string => Boolean(email))
  const results = []
  for (const to of recipients) {
    results.push(
      await sendTransactionalEmail({
        to,
        subject: message.subject,
        html: message.html,
        idempotencyKey: `offer-accepted/${match.id}/${to}`,
      }),
    )
  }
  return { results }
})
