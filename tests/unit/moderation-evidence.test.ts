import { describe, expect, it } from 'vitest'
import { EVIDENCE_NEED_STATUS_LABELS, NEED_STATUS_LABELS } from '../../shared/constants/labels'
import { evidenceSchemaForNeeds } from '../../shared/schemas/inputs'
import {
  attachOrganizerNotes,
  evidenceNeedIcon,
  evidenceNeedTone,
  formatEvidenceCoverage,
  joinContributionNotes,
  mapEvidenceNeed,
  mapPendingEvidence,
  parseContributionNotes,
  toStoredContributionNotes,
} from '../../shared/utils/moderation-evidence'

describe('mapeo de evidencias para moderación', () => {
  it('incluye necesidades, espacio y aliados sin WhatsApp ni teléfono', () => {
    const mapped = mapPendingEvidence({
      id: 'evidence-1',
      event_id: '55555555-5555-4555-8555-555555555555',
      attendance_count: 36,
      venue_note: 'La lectura ocurrió en Casa de Leo.',
      title: 'Lectura en el centro',
      media: [{ storage_path: 'evidence/a.webp' }],
      needs: attachOrganizerNotes(
        [
          mapEvidenceNeed({
            id: 'need-venue',
            type: 'venue',
            description: 'Sala para cuarenta personas',
            quantity_requested: 1,
            quantity_covered: 1,
            unit: 'espacio',
            status: 'covered',
          }),
          mapEvidenceNeed({
            id: 'need-food',
            type: 'food',
            description: 'Refrigerio para quienes asistan',
            quantity_requested: 40,
            quantity_covered: 0,
            unit: 'porciones',
            status: 'open',
          }),
        ],
        [
          { needId: 'need-venue', note: 'El espacio lo cubrió Leo.' },
          { needId: 'need-food', note: 'El refrigerio sigue pendiente de confirmar.' },
        ],
      ),
      venue: { id: 'venue-1', name: 'Casa de Leo', detail: 'Leo Espacio' },
      localSponsors: [],
    })

    expect(mapped.needs).toHaveLength(2)
    expect(mapped.needs[0]?.status).toBe('covered')
    expect(mapped.needs[0]?.organizerNote).toBe('El espacio lo cubrió Leo.')
    expect(mapped.needs[1]?.organizerNote).toBe('El refrigerio sigue pendiente de confirmar.')
    expect(mapped.venue?.name).toBe('Casa de Leo')
    expect(mapped.venue?.detail).toBe('Leo Espacio')
    expect(mapped.localSponsors).toEqual([])
    expect(JSON.stringify(mapped)).not.toMatch(/whatsapp|tel[eé]fono|phone/i)
  })

  it('asigna tono e icono según el estado y el tipo de necesidad', () => {
    expect(evidenceNeedTone('covered')).toBe('success')
    expect(evidenceNeedTone('open')).toBe('error')
    expect(evidenceNeedTone('partial')).toBe('warning')
    expect(evidenceNeedTone('cancelled')).toBe('neutral')
    expect(evidenceNeedIcon('venue')).toBe('i-lucide-building-2')
    expect(evidenceNeedIcon('food')).toBe('i-lucide-hand-heart')
    expect(formatEvidenceCoverage({ quantityCovered: 1, quantityRequested: 1, unit: 'espacio' }, 'de')).toBe(
      '1 de 1 espacio',
    )
    expect(formatEvidenceCoverage({ quantityCovered: 0, quantityRequested: null, unit: null }, 'de')).toBeNull()
  })

  it('en evidencia post-evento etiqueta cobertura, no “abierta”', () => {
    expect(NEED_STATUS_LABELS.open).toBe('Abierta')
    expect(EVIDENCE_NEED_STATUS_LABELS.open).toBe('No cubierta')
    expect(EVIDENCE_NEED_STATUS_LABELS.covered).toBe('Cubierta')
    expect(EVIDENCE_NEED_STATUS_LABELS.partial).toBe('Cubierta a medias')
    expect(EVIDENCE_NEED_STATUS_LABELS.cancelled).toBe('Cancelada')
  })

  it('serializa y une comentarios por aporte para el resumen público', () => {
    const notes = [
      { needId: 'need-venue', note: 'El espacio lo cubrió Leo.' },
      { needId: 'need-food', note: 'El refrigerio sigue pendiente de confirmar.' },
    ]
    expect(toStoredContributionNotes(notes)).toEqual([
      { need_id: 'need-venue', note: 'El espacio lo cubrió Leo.' },
      { need_id: 'need-food', note: 'El refrigerio sigue pendiente de confirmar.' },
    ])
    expect(joinContributionNotes(notes)).toBe('El espacio lo cubrió Leo. El refrigerio sigue pendiente de confirmar.')
    expect(parseContributionNotes(toStoredContributionNotes(notes))).toEqual(notes)
  })
})

describe('validación de evidencia con comentario por aporte', () => {
  const needIds = ['77777777-7777-4777-8777-777777777777', '88888888-8888-4888-8888-888888888888']

  it('acepta un comentario por cada aporte del evento', () => {
    const parsed = evidenceSchemaForNeeds(needIds).safeParse({
      attendanceCount: 36,
      venueNote: 'La lectura ocurrió en Casa de Leo, en el centro.',
      contributionNotes: [
        { needId: needIds[0], note: 'El espacio lo cubrió Leo.' },
        { needId: needIds[1], note: 'El refrigerio sigue pendiente de confirmar.' },
      ],
    })
    expect(parsed.success).toBe(true)
  })

  it('rechaza si falta el comentario de un aporte', () => {
    const parsed = evidenceSchemaForNeeds(needIds).safeParse({
      attendanceCount: 36,
      venueNote: 'La lectura ocurrió en Casa de Leo, en el centro.',
      contributionNotes: [{ needId: needIds[0], note: 'El espacio lo cubrió Leo.' }],
    })
    expect(parsed.success).toBe(false)
  })
})
