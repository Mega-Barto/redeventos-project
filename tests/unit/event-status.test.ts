import { describe, expect, it } from 'vitest'
import { EVENT_STATUSES } from '../../shared/constants/domain'
import { canTransitionEvent } from '../../shared/constants/event-status'

describe('canTransitionEvent', () => {
  it('el organizador publica un borrador para sponsors', () => {
    expect(canTransitionEvent('draft', 'published')).toBe(true)
  })

  it('un borrador no salta a la ficha pública', () => {
    expect(canTransitionEvent('draft', 'public')).toBe(false)
  })

  it('un borrador no se cancela', () => {
    expect(canTransitionEvent('draft', 'cancelled')).toBe(false)
  })

  it('la ficha pública solo se abre desde published', () => {
    const origins = EVENT_STATUSES.filter((from) => canTransitionEvent(from, 'public'))
    expect(origins).toEqual(['published'])
  })

  it('solo un evento public pasa a completed', () => {
    const origins = EVENT_STATUSES.filter((from) => canTransitionEvent(from, 'completed'))
    expect(origins).toEqual(['public'])
  })

  it('se cancela desde published o public', () => {
    const origins = EVENT_STATUSES.filter((from) => canTransitionEvent(from, 'cancelled'))
    expect(origins).toEqual(['published', 'public'])
  })

  it('completed y cancelled son finales', () => {
    for (const to of EVENT_STATUSES) {
      expect(canTransitionEvent('completed', to)).toBe(false)
      expect(canTransitionEvent('cancelled', to)).toBe(false)
    }
  })
})
