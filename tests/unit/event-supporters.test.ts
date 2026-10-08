import { describe, expect, it } from 'vitest'
import {
  type EventSupporter,
  mapPublicEventSupporter,
  publicEventSupporters,
  supportStatusTone,
} from '../../shared/utils/event-supporters'

function row(overrides: Partial<Parameters<typeof mapPublicEventSupporter>[0]> = {}) {
  return {
    event_id: '55555555-5555-4555-8555-555555555555',
    event_slug: 'lectura-en-el-centro',
    need_id: '77777777-7777-4777-8777-777777777777',
    need_type: 'venue' as const,
    need_description: 'Sala para cuarenta personas',
    party_kind: 'venue',
    party_name: 'Casa de Leo',
    party_slug: 'casa-de-leo',
    party_href: '/venues/casa-de-leo',
    person_name: 'Leo Espacio',
    support_status: 'confirmed',
    sort_rank: 10,
    ...overrides,
  }
}

describe('event supporters', () => {
  it('maps venue confirmed row', () => {
    const supporter = mapPublicEventSupporter(row())

    expect(supporter.partyKind).toBe('venue')
    expect(supporter.supportStatus).toBe('confirmed')
    expect(supportStatusTone(supporter.supportStatus)).toBe('success')
  })

  it('falls back unknown status to pending', () => {
    const supporter = mapPublicEventSupporter(
      row({
        need_id: '88888888-8888-4888-8888-888888888888',
        need_type: 'food',
        need_description: 'Refrigerio',
        party_kind: 'local_sponsor',
        party_name: 'Luz Aliada',
        party_slug: 'luz-aliada',
        party_href: '/sponsors/luz-aliada',
        person_name: 'Luz Aliada',
        support_status: 'weird',
        sort_rank: 30,
      }),
    )

    expect(supporter.supportStatus).toBe('pending')
    expect(supportStatusTone(supporter.supportStatus)).toBe('warning')
  })

  it('en la ficha pública deja solo confirmados con nombre, sin duplicar aliado', () => {
    const requested = mapPublicEventSupporter(
      row({
        need_id: '88888888-8888-4888-8888-888888888888',
        need_type: 'food',
        party_kind: 'local_sponsor',
        party_name: 'Luz Aliada',
        party_slug: 'luz-aliada',
        party_href: '/sponsors/luz-aliada',
        person_name: 'Luz Aliada',
        support_status: 'requested',
        sort_rank: 30,
      }),
    )
    const confirmedFood = mapPublicEventSupporter(
      row({
        need_id: '88888888-8888-4888-8888-888888888888',
        need_type: 'food',
        party_kind: 'local_sponsor',
        party_name: 'Luz Aliada',
        party_slug: 'luz-aliada',
        party_href: '/sponsors/luz-aliada',
        person_name: 'Luz Aliada',
        support_status: 'confirmed',
        sort_rank: 20,
      }),
    )
    const confirmedAgain = mapPublicEventSupporter(
      row({
        need_id: '99999999-9999-4999-8999-999999999999',
        need_type: 'equipment',
        party_kind: 'local_sponsor',
        party_name: 'Luz Aliada',
        party_slug: 'luz-aliada',
        party_href: '/sponsors/luz-aliada',
        person_name: 'Luz Aliada',
        support_status: 'confirmed',
        sort_rank: 21,
      }),
    )
    const venue = mapPublicEventSupporter(row())
    const pending: EventSupporter = {
      ...requested,
      supportStatus: 'pending',
      partyName: null,
      partySlug: null,
      partyHref: null,
    }

    const publicList = publicEventSupporters([requested, pending, confirmedFood, confirmedAgain, venue])

    expect(publicList.map((item) => `${item.partyKind}:${item.partyName}`)).toEqual([
      'local_sponsor:Luz Aliada',
      'venue:Casa de Leo',
    ])
  })
})
