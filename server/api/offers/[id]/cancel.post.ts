export default defineEventHandler(async (event) => {
  const offerId = getRouterParam(event, 'id')
  if (!offerId) throw createError({ statusCode: 400, statusMessage: 'Falta la propuesta' })

  const { client } = await requireUser(event)
  const { error } = await client.rpc('cancel_offer', { p_offer_id: offerId })
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return { ok: true }
})
