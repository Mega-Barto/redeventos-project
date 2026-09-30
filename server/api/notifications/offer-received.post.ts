import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { offerReceivedEmail } from '~~/shared/content/emails'
import { offerNoticeSchema } from '~~/shared/schemas/inputs'
import type { Database } from '~~/shared/types/database.types'

export default defineEventHandler(async (event) => {
  const parsed = offerNoticeSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const user = await serverSupabaseUser(event)
  const userId = user?.sub
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Debes entrar' })

  const client = await serverSupabaseClient<Database>(event)
  const { data: offer } = await client
    .from('offers')
    .select('id, proposer_id, recipient_id, note, event_id')
    .eq('id', parsed.data.offerId)
    .maybeSingle()
  if (!offer || offer.proposer_id !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'No puedes avisar esta propuesta' })
  }

  const [{ data: recipient }, { data: hosted }] = await Promise.all([
    client.from('profiles').select('email').eq('id', offer.recipient_id).maybeSingle(),
    client.from('events').select('title').eq('id', offer.event_id).maybeSingle(),
  ])
  if (!recipient?.email || !hosted) return { sent: false }

  const message = offerReceivedEmail({ eventTitle: hosted.title, note: offer.note })
  return sendTransactionalEmail({
    to: recipient.email,
    subject: message.subject,
    html: message.html,
    idempotencyKey: `offer-received/${offer.id}`,
  })
})
