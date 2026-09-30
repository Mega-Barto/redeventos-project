import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { evidenceReviewedEmail } from '~~/shared/content/emails'
import { evidenceNoticeSchema } from '~~/shared/schemas/inputs'
import type { Database } from '~~/shared/types/database.types'

export default defineEventHandler(async (event) => {
  const parsed = evidenceNoticeSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const user = await serverSupabaseUser(event)
  const userId = user?.sub
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Debes entrar' })

  const client = await serverSupabaseClient<Database>(event)
  const { data: role } = await client
    .from('profile_roles')
    .select('role')
    .eq('profile_id', userId)
    .eq('role', 'moderator')
    .maybeSingle()
  if (!role) throw createError({ statusCode: 403, statusMessage: 'Solo el moderador avisa la revisión' })

  const { data: evidence } = await client
    .from('evidence')
    .select('id, event_id, status, review_note, submitted_by')
    .eq('id', parsed.data.evidenceId)
    .maybeSingle()
  if (!evidence || (evidence.status !== 'approved' && evidence.status !== 'rejected')) {
    throw createError({ statusCode: 404, statusMessage: 'Evidencia no revisada' })
  }

  const [{ data: hosted }, { data: organizer }] = await Promise.all([
    client.from('events').select('title').eq('id', evidence.event_id).maybeSingle(),
    client.from('profiles').select('email').eq('id', evidence.submitted_by).maybeSingle(),
  ])
  if (!hosted || !organizer?.email) return { sent: false }

  const message = evidenceReviewedEmail({
    eventTitle: hosted.title,
    decision: evidence.status,
    note: evidence.review_note ?? '',
  })
  return sendTransactionalEmail({
    to: organizer.email,
    subject: message.subject,
    html: message.html,
    idempotencyKey: `evidence-${evidence.status}/${evidence.id}`,
  })
})
