import { reviewEvidenceSchema } from '~~/shared/schemas/inputs'

export default defineEventHandler(async (event) => {
  const parsed = reviewEvidenceSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? 'Datos inválidos' })

  const { userId, client } = await requireUser(event)
  const { data: role } = await client
    .from('profile_roles')
    .select('role')
    .eq('profile_id', userId)
    .eq('role', 'moderator')
    .maybeSingle()
  if (!role) throw createError({ statusCode: 403, statusMessage: 'Solo el moderador revisa la evidencia' })

  const { error } = await client.rpc('review_evidence', {
    p_evidence_id: parsed.data.evidenceId,
    p_decision: parsed.data.decision,
    p_note: parsed.data.note,
  })
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  await notifyEvidenceReviewed(client, parsed.data.evidenceId)
  return { ok: true }
})
