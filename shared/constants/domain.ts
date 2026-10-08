export const TIMEZONE = 'America/Bogota'
export const LOCALE = 'es-CO'
export const PRIVACY_VERSION = '2026-09'
export const COMMITMENT_VERSION = '2026-09'

export const CITIES = ['pereira', 'dosquebradas'] as const
export type City = (typeof CITIES)[number]

export const EVENT_CATEGORIES = [
  'tecnologia',
  'literatura',
  'cine',
  'musica',
  'educacion',
  'emprendimiento',
  'cultura',
  'comunidades',
  'networking',
] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const ROLES = ['organizer', 'venue_sponsor', 'local_sponsor', 'moderator'] as const
export type Role = (typeof ROLES)[number]

export const SELF_ASSIGNABLE_ROLES = ['organizer', 'venue_sponsor', 'local_sponsor'] as const satisfies readonly Role[]

export const NEED_TYPES = ['venue', 'products', 'food', 'equipment', 'services', 'diffusion'] as const
export type NeedType = (typeof NEED_TYPES)[number]

/** Aportes de local sponsor: el espacio va por rol venue_sponsor, no por contribution_types. */
export const LOCAL_CONTRIBUTION_TYPES = ['products', 'food', 'equipment', 'services', 'diffusion'] as const
export type LocalContributionType = (typeof LOCAL_CONTRIBUTION_TYPES)[number]

export function asLocalContributionTypes(types: readonly NeedType[] | null | undefined): LocalContributionType[] {
  const allowed = new Set<string>(LOCAL_CONTRIBUTION_TYPES)
  return (types ?? []).filter((type): type is LocalContributionType => allowed.has(type))
}

export const VENUE_SUPPORT_MODES = ['free', 'depends', 'rental_only'] as const
export type VenueSupportMode = (typeof VENUE_SUPPORT_MODES)[number]

export const EVENT_STATUSES = ['draft', 'published', 'public', 'completed', 'cancelled'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const NEED_STATUSES = ['open', 'partial', 'covered', 'cancelled'] as const
export type NeedStatus = (typeof NEED_STATUSES)[number]

export const OFFER_STATUSES = ['pending', 'accepted', 'rejected', 'cancelled'] as const
export type OfferStatus = (typeof OFFER_STATUSES)[number]

export const MATCH_STATUSES = ['accepted', 'completed', 'breached', 'cancelled'] as const
export type MatchStatus = (typeof MATCH_STATUSES)[number]

export const EVIDENCE_STATUSES = ['submitted', 'approved', 'rejected'] as const
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number]
