import { Resend } from 'resend'

export async function sendTransactionalEmail(input: {
  to: string
  subject: string
  html: string
  idempotencyKey: string
}) {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey
  if (!apiKey) return { sent: false as const, reason: 'skipped' as const }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send(
    {
      from: config.resendFrom || 'Redeventos <onboarding@resend.dev>',
      to: [input.to],
      subject: input.subject,
      html: input.html,
    },
    { idempotencyKey: input.idempotencyKey },
  )
  if (error) return { sent: false as const, reason: error.message }
  return { sent: true as const, id: data?.id }
}
