export function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function offerReceivedEmail(input: { eventTitle: string; note: string }) {
  return {
    subject: `Nueva propuesta: ${input.eventTitle}`,
    html: `<p>Recibiste una propuesta en Redeventos para <strong>${escapeHtml(input.eventTitle)}</strong>.</p><p>${escapeHtml(input.note)}</p><p>Entra a la plataforma para aceptarla o rechazarla. Al aceptar se revelan WhatsApp y teléfono.</p>`,
  }
}

export function offerAcceptedEmail(input: {
  eventTitle: string
  what: string
  quantity: string
  whenOn: string
  whatsapp: string
  phone: string
}) {
  return {
    subject: `Propuesta aceptada: ${input.eventTitle}`,
    html: `<p>La propuesta quedó aceptada. El compromiso es: ${escapeHtml(input.what)}, cantidad ${escapeHtml(input.quantity)}, fecha ${escapeHtml(input.whenOn)}.</p><p>Contacto directo de la otra parte: WhatsApp ${escapeHtml(input.whatsapp || 'no indicado')}, teléfono ${escapeHtml(input.phone || 'no indicado')}.</p>`,
  }
}

export function evidenceReviewedEmail(input: { eventTitle: string; decision: 'approved' | 'rejected'; note: string }) {
  const decision = input.decision === 'approved' ? 'aprobada' : 'rechazada'
  return {
    subject: `Evidencia ${decision}: ${input.eventTitle}`,
    html: `<p>La evidencia de <strong>${escapeHtml(input.eventTitle)}</strong> fue ${decision}.</p><p>${escapeHtml(input.note)}</p>`,
  }
}
