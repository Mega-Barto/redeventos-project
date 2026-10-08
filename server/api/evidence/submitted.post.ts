import { evidenceNoticeSchema } from '~~/shared/schemas/inputs'

export default defineEventHandler(async (event) => {
  const parsed = evidenceNoticeSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const { userId, client } = await requireUser(event)
  const { data: evidence } = await client
    .from('evidence')
    .select('id, submitted_by, status')
    .eq('id', parsed.data.evidenceId)
    .maybeSingle()
  if (!evidence || evidence.submitted_by !== userId || evidence.status !== 'submitted') {
    throw createError({ statusCode: 403, statusMessage: 'No puedes avisar esta evidencia' })
  }

  await notifyEvidenceSubmitted(client, evidence.id)
  return { ok: true }
})
