import type { City, EventStatus, EvidenceStatus, NeedStatus, NeedType, OfferStatus } from '../constants/domain'

export function canCancelNeed(status: NeedStatus): boolean {
  return status === 'open' || status === 'partial'
}

export function coverageAfterAccept(
  requested: number,
  covered: number,
  accepted: number,
): {
  covered: number
  status: Exclude<NeedStatus, 'cancelled'>
  remaining: number
} {
  if (accepted <= 0) {
    throw new Error('La cantidad aceptada debe ser mayor que cero')
  }
  const remainingBefore = requested - covered
  if (accepted > remainingBefore) {
    throw new Error('La cantidad supera lo que falta por cubrir')
  }
  const next = covered + accepted
  const status: Exclude<NeedStatus, 'cancelled'> = next <= 0 ? 'open' : next >= requested ? 'covered' : 'partial'
  return { covered: next, status, remaining: requested - next }
}

export function canMakePublic(event: {
  status: EventStatus
  startsOn: string | null
  placeName: string | null
  venueId: string | null
}): boolean {
  return event.status === 'published' && Boolean(event.startsOn) && Boolean(event.placeName || event.venueId)
}

export function canSeeDirectContact(input: {
  viewerId: string
  subjectId: string
  acceptedMatch: boolean
  isModerator: boolean
}): boolean {
  if (input.viewerId === input.subjectId) return true
  if (input.isModerator) return true
  return input.acceptedMatch
}

export type SealLevel = 'en_la_red' | 'aliado_activo'

export function sealLevel(input: {
  disaffiliated: boolean
  hidden: boolean
  hasSponsorRole: boolean
  profileComplete: boolean
  completedEvents: number
}): SealLevel | null {
  if (input.disaffiliated || input.hidden || !input.hasSponsorRole || !input.profileComplete) return null
  if (input.completedEvents >= 1) return 'aliado_activo'
  return 'en_la_red'
}

export function suggestionRank(input: {
  needType: NeedType
  city: City
  expectedAttendees: number
  sponsorCity: City | null
  contributionTypes: readonly NeedType[]
  capacity: number | null
}): number | null {
  if (input.needType === 'venue') {
    if (input.capacity == null || input.capacity < input.expectedAttendees) return null
  } else if (!input.contributionTypes.includes(input.needType)) {
    return null
  }
  let score = 1
  if (input.sponsorCity === input.city) score += 2
  if (input.needType === 'venue' && input.capacity != null) {
    score += Math.min(2, input.capacity / input.expectedAttendees)
  }
  return score
}

const OFFER_TRANSITIONS: Record<OfferStatus, readonly OfferStatus[]> = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: [],
  rejected: [],
  cancelled: [],
}

export function canTransitionOffer(from: OfferStatus, to: OfferStatus): boolean {
  return OFFER_TRANSITIONS[from].includes(to)
}

const EVIDENCE_TRANSITIONS: Record<EvidenceStatus, readonly EvidenceStatus[]> = {
  submitted: ['approved', 'rejected'],
  rejected: ['submitted'],
  approved: [],
}

export function canTransitionEvidence(from: EvidenceStatus, to: EvidenceStatus): boolean {
  return EVIDENCE_TRANSITIONS[from].includes(to)
}

export function canAcceptOffer(input: { status: OfferStatus; recipientId: string; viewerId: string }): boolean {
  return input.status === 'pending' && input.recipientId === input.viewerId
}

export function slugify(value: string): string {
  const translated = value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/ñ/g, 'n')
  const slug = translated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'perfil'
}

export function formatBogotaDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00-05:00`)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeZone: 'America/Bogota',
  }).format(date)
}
