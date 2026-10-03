import { describe, expect, it } from 'vitest'
import {
  evidenceNeedIcon,
  evidenceNeedTone,
  formatEvidenceCoverage,
  mapEvidenceNeed,
  mapPendingEvidence,
} from '../../shared/utils/moderation-evidence'

describe('mapeo de evidencias para moderación', () => {
  it('incluye necesidades, espacio y aliados sin WhatsApp ni teléfono', () => {
    const mapped = mapPendingEvidence({
      id: 'evidence-1',
      event_id: '55555555-5555-4555-8555-555555555555',
      attendance_count: 36,
      venue_note: 'La lectura ocurrió en Casa de Leo.',
      contributions_note: 'El espacio lo cubrió Leo.',
      title: 'Lectura en el centro',
      media: [{ storage_path: 'evidence/a.webp' }],
      needs: [
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
      venue: { id: 'venue-1', name: 'Casa de Leo', detail: 'Leo Espacio' },
      localSponsors: [],
    })

    expect(mapped.needs).toHaveLength(2)
    expect(mapped.needs[0]?.status).toBe('covered')
    expect(mapped.venue?.name).toBe('Casa de Leo')
    expect(mapped.venue?.detail).toBe('Leo Espacio')
    expect(mapped.localSponsors).toEqual([])
    expect(JSON.stringify(mapped)).not.toMatch(/whatsapp|tel[eé]fono|phone/i)
  })

  it('asigna tono e icono según el estado y el tipo de necesidad', () => {
    expect(evidenceNeedTone('covered')).toBe('success')
    expect(evidenceNeedTone('open')).toBe('warning')
    expect(evidenceNeedTone('partial')).toBe('info')
    expect(evidenceNeedTone('cancelled')).toBe('neutral')
    expect(evidenceNeedIcon('venue')).toBe('i-lucide-building-2')
    expect(evidenceNeedIcon('food')).toBe('i-lucide-hand-heart')
    expect(formatEvidenceCoverage({ quantityCovered: 1, quantityRequested: 1, unit: 'espacio' }, 'de')).toBe(
      '1 de 1 espacio',
    )
    expect(formatEvidenceCoverage({ quantityCovered: 0, quantityRequested: null, unit: null }, 'de')).toBeNull()
  })
})
