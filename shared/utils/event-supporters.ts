import type { NeedType } from '../constants/domain'

export const SUPPORT_STATUSES = ['pending', 'requested', 'confirmed'] as const
export type SupportStatus = (typeof SUPPORT_STATUSES)[number]

export type EventSupporterPartyKind = 'venue' | 'local_sponsor'

export type EventSupporter = {
  eventId: string
  eventSlug: string
  needId: string | null
  needType: NeedType
  needDescription: string
  partyKind: EventSupporterPartyKind
  partyName: string | null
  partySlug: string | null
  partyHref: string | null
  personName: string | null
  supportStatus: SupportStatus
  sortRank: number
}

export type SupportStatusTone = 'warning' | 'info' | 'success'

export function supportStatusTone(status: SupportStatus): SupportStatusTone {
  if (status === 'confirmed') return 'success'
  if (status === 'requested') return 'info'
  return 'warning'
}

export function mapPublicEventSupporter(row: {
  event_id: string
  event_slug: string
  need_id: string | null
  need_type: NeedType
  need_description: string
  party_kind: string
  party_name: string | null
  party_slug: string | null
  party_href: string | null
  person_name: string | null
  support_status: string
  sort_rank: number
}): EventSupporter {
  const partyKind: EventSupporterPartyKind = row.party_kind === 'venue' ? 'venue' : 'local_sponsor'
  const supportStatus: SupportStatus = SUPPORT_STATUSES.includes(row.support_status as SupportStatus)
    ? (row.support_status as SupportStatus)
    : 'pending'
  return {
    eventId: row.event_id,
    eventSlug: row.event_slug,
    needId: row.need_id,
    needType: row.need_type,
    needDescription: row.need_description,
    partyKind,
    partyName: row.party_name,
    partySlug: row.party_slug,
    partyHref: row.party_href,
    personName: row.person_name,
    supportStatus,
    sortRank: Number(row.sort_rank),
  }
}
