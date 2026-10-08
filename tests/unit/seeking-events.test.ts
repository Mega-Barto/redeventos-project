import { describe, expect, it } from 'vitest'
import { buildSeekingEventCards, seekingWhenLabel } from '../../shared/utils/seeking-events'

const baseEvent = {
  id: 'e1',
  slug: 'taller',
  title: 'Taller de cuento',
  category: 'literatura' as const,
  city: 'pereira' as const,
  starts_on: null as string | null,
  date_range_label: 'segunda semana de octubre' as string | null,
  place_name: null as string | null,
  status: 'published' as const,
}

describe('buildSeekingEventCards', () => {
  it('incluye solo eventos published o public con necesidades abiertas o parciales', () => {
    const cards = buildSeekingEventCards(
      [
        baseEvent,
        { ...baseEvent, id: 'e2', slug: 'lectura', status: 'public', starts_on: '2026-10-04' },
        { ...baseEvent, id: 'e3', slug: 'sin-necesidad', status: 'published' },
      ],
      [
        {
          id: 'n1',
          event_id: 'e1',
          type: 'venue',
          description: 'sala para 40',
          status: 'open',
        },
        {
          id: 'n2',
          event_id: 'e2',
          type: 'food',
          description: '20 refrigerios',
          status: 'partial',
        },
        {
          id: 'n3',
          event_id: 'e3',
          type: 'diffusion',
          description: 'historia en Instagram',
          status: 'covered',
        },
      ],
    )

    expect(cards.map((card) => card.id)).toEqual(['e1', 'e2'])
    expect(cards[0]?.openNeeds).toHaveLength(1)
    expect(cards[1]?.openNeeds[0]?.type).toBe('food')
  })

  it('omite necesidades cubiertas o canceladas', () => {
    const cards = buildSeekingEventCards(
      [baseEvent],
      [
        {
          id: 'n1',
          event_id: 'e1',
          type: 'venue',
          description: 'sala',
          status: 'covered',
        },
        {
          id: 'n2',
          event_id: 'e1',
          type: 'food',
          description: 'snacks',
          status: 'cancelled',
        },
      ],
    )
    expect(cards).toEqual([])
  })
})

describe('seekingWhenLabel', () => {
  it('prioriza fecha concreta y cae a rango o pendiente en español', () => {
    expect(seekingWhenLabel({ starts_on: '2026-10-18', date_range_label: 'octubre' })).toBe('2026-10-18')
    expect(seekingWhenLabel({ starts_on: null, date_range_label: 'segunda semana de octubre' })).toBe(
      'segunda semana de octubre',
    )
    expect(seekingWhenLabel({ starts_on: null, date_range_label: null })).toBe('Fecha por confirmar')
  })
})
