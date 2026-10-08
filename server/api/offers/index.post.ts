import { createOfferSchema } from '~~/shared/schemas/inputs'

export default defineEventHandler(async (event) => {
  const parsed = createOfferSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const { userId, client } = await requireUser(event)
  const { data: need } = await client
    .from('event_needs')
    .select('quantity_requested, quantity_covered, status')
    .eq('id', parsed.data.eventNeedId)
    .maybeSingle()
  if (!need || (need.status !== 'open' && need.status !== 'partial')) {
    throw createError({ statusCode: 400, statusMessage: 'Esa necesidad ya no está abierta' })
  }
  if (
    need.quantity_requested != null &&
    parsed.data.quantity > Number(need.quantity_requested) - Number(need.quantity_covered)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'La cantidad supera lo que falta por cubrir' })
  }

  const { data, error } = await client
    .from('offers')
    .insert({
      event_need_id: parsed.data.eventNeedId,
      event_id: parsed.data.eventId,
      proposer_id: userId,
      recipient_id: parsed.data.recipientId,
      venue_id: parsed.data.venueId,
      quantity: parsed.data.quantity,
      offer_on: parsed.data.offerOn,
      note: parsed.data.note,
      status: 'pending',
    })
    .select('id')
    .single()
  if (error || !data) {
    throw createError({ statusCode: 400, statusMessage: error?.message ?? 'No se pudo enviar la propuesta' })
  }

  await notifyOfferReceived(client, data.id)
  return { id: data.id }
})
