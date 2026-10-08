import { describe, expect, it } from 'vitest'
import { defaultEmailEnabled, isPilotEmailEvent } from '../../shared/constants/notification-events'
import { evidenceSubmittedEmail, offerAcceptedEmail, offerReceivedEmail } from '../../shared/content/emails'
import {
  emailEnabledFromRow,
  evidenceSubmittedIdempotencyKey,
  filterRecipientsByEmailPref,
  offerAcceptedRecipientPayloads,
  uniqueModeratorEmails,
} from '../../shared/utils/notifications'

describe('defaults de avisos (email)', () => {
  it('enciende A, B, E y F y apaga el resto', () => {
    expect(defaultEmailEnabled('offer_received')).toBe(true)
    expect(defaultEmailEnabled('offer_accepted')).toBe(true)
    expect(defaultEmailEnabled('evidence_submitted')).toBe(true)
    expect(defaultEmailEnabled('evidence_reviewed')).toBe(true)
    expect(defaultEmailEnabled('offer_rejected')).toBe(false)
    expect(defaultEmailEnabled('disaffiliated')).toBe(false)
    expect(isPilotEmailEvent('offer_received')).toBe(true)
    expect(isPilotEmailEvent('report_created')).toBe(false)
  })

  it('usa la fila del usuario cuando existe y el default si no hay fila', () => {
    expect(emailEnabledFromRow('offer_received', null)).toBe(true)
    expect(emailEnabledFromRow('offer_received', { enabled: false })).toBe(false)
    expect(emailEnabledFromRow('offer_rejected', null)).toBe(false)
    expect(emailEnabledFromRow('offer_rejected', { enabled: true })).toBe(true)
  })
})

describe('propuesta aceptada por destinatario', () => {
  it('envía a cada parte el WhatsApp y teléfono de la contraparte', () => {
    const payloads = offerAcceptedRecipientPayloads({
      organizer: { profileId: 'org', email: 'ana@local.test' },
      sponsor: { profileId: 'spo', email: 'leo@local.test' },
      contacts: {
        org: { whatsapp: '+573001111111', phone: '+576011111111' },
        spo: { whatsapp: '+573002222222', phone: '+576012222222' },
      },
    })

    expect(payloads).toEqual([
      {
        to: 'ana@local.test',
        profileId: 'org',
        whatsapp: '+573002222222',
        phone: '+576012222222',
      },
      {
        to: 'leo@local.test',
        profileId: 'spo',
        whatsapp: '+573001111111',
        phone: '+576011111111',
      },
    ])
  })

  it('omite a quien no tiene correo', () => {
    const payloads = offerAcceptedRecipientPayloads({
      organizer: { profileId: 'org', email: null },
      sponsor: { profileId: 'spo', email: 'leo@local.test' },
      contacts: {},
    })
    expect(payloads).toHaveLength(1)
    expect(payloads[0]?.to).toBe('leo@local.test')
  })
})

describe('evidencia enviada a moderadores', () => {
  it('deduplica correos de moderadores', () => {
    expect(
      uniqueModeratorEmails([
        { profile_id: 'm1', email: 'moda.red@local.test' },
        { profile_id: 'm2', email: 'Moda.Red@local.test' },
        { profile_id: 'm3', email: 'otra@local.test' },
        { profile_id: 'm4', email: null },
      ]),
    ).toEqual([
      { profileId: 'm1', email: 'moda.red@local.test' },
      { profileId: 'm3', email: 'otra@local.test' },
    ])
  })

  it('distingue reenvíos en la clave de idempotencia', () => {
    expect(evidenceSubmittedIdempotencyKey('ev-1', '2026-10-08T10:00:00Z')).not.toBe(
      evidenceSubmittedIdempotencyKey('ev-1', '2026-10-08T12:00:00Z'),
    )
  })
})

describe('plantillas de correo', () => {
  it('no incluye WhatsApp ni teléfono en la propuesta recibida', () => {
    const message = offerReceivedEmail({ eventTitle: 'Taller', note: 'Puedo aportar 20 refrigerios' })
    expect(message.html).not.toMatch(/\+57/)
    expect(message.html).toMatch(/\/app\/profile/)
  })

  it('incluye solo el contacto pasado como contraparte al aceptar', () => {
    const message = offerAcceptedEmail({
      eventTitle: 'Taller',
      what: 'refrigerios',
      quantity: '20',
      whenOn: '2026-10-18',
      whatsapp: '+573002222222',
      phone: '+576012222222',
    })
    expect(message.html).toContain('+573002222222')
    expect(message.html).not.toContain('+573001111111')
  })

  it('avisa a moderación cuando llega evidencia', () => {
    const message = evidenceSubmittedEmail({ eventTitle: 'Lectura en el centro' })
    expect(message.subject).toMatch(/Evidencia por revisar/)
    expect(message.html).toContain('Lectura en el centro')
  })
})

describe('preferencia OFF', () => {
  it('no incluye destinatarios con email desactivado', () => {
    const allowed = filterRecipientsByEmailPref(
      'offer_accepted',
      [
        { profileId: 'a', to: 'a@test' },
        { profileId: 'b', to: 'b@test' },
      ],
      {
        a: { enabled: false },
      },
    )
    expect(allowed.map((item) => item.profileId)).toEqual(['b'])
  })
})
