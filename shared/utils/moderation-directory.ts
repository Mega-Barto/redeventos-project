import type { City, EventCategory, EventStatus, NeedType } from '../constants/domain'

export type ModerationVisibility = 'all' | 'active' | 'hidden' | 'disaffiliated'

export type ModerationProfileRow = {
  id: string
  displayName: string
  email: string
  slug: string
  city: City | null
  hidden: boolean
  disaffiliated: boolean
  contributionTypes: NeedType[]
}

export type ModerationEventRow = {
  id: string
  title: string
  status: EventStatus
  city: City
  category: EventCategory
  startsOn: string | null
  hidden: boolean
  organizerId: string
  organizerName: string
}

export type ModerationProfileFicha = ModerationProfileRow & {
  instagram: string | null
  website: string | null
  contributionDescription: string | null
  avatarPath: string | null
}

export type ModerationEventNeed = {
  id: string
  type: NeedType
  description: string
}

export type ModerationEventFicha = ModerationEventRow & {
  description: string
  audience: string
  placeName: string | null
  dateRangeLabel: string | null
  expectedAttendees: number
  rsvpUrl: string
  sponsorBenefit: string
  needs: ModerationEventNeed[]
}

export type ModerationProfileFilters = {
  query: string
  city: City | 'all'
  visibility: ModerationVisibility
  contributionType: NeedType | 'all'
}

export type ModerationEventFilters = {
  query: string
  city: City | 'all'
  status: EventStatus | 'all'
  hidden: 'all' | 'visible' | 'hidden'
}

function matchesQuery(haystack: string, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return haystack.toLowerCase().includes(needle)
}

export function mapModerationProfile(row: {
  id: string
  display_name: string
  email: string
  slug: string
  city: City | null
  hidden_at: string | null
  disaffiliated_at: string | null
  contribution_types: NeedType[] | null
}): ModerationProfileRow {
  return {
    id: row.id,
    displayName: row.display_name,
    email: row.email,
    slug: row.slug,
    city: row.city,
    hidden: Boolean(row.hidden_at),
    disaffiliated: Boolean(row.disaffiliated_at),
    contributionTypes: row.contribution_types ?? [],
  }
}

export function mapModerationEvent(
  row: {
    id: string
    title: string
    status: EventStatus
    city: City
    category: EventCategory
    starts_on: string | null
    hidden_at: string | null
    organizer_id: string
  },
  organizerName: string,
): ModerationEventRow {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    city: row.city,
    category: row.category,
    startsOn: row.starts_on,
    hidden: Boolean(row.hidden_at),
    organizerId: row.organizer_id,
    organizerName,
  }
}

export function mapModerationProfileFicha(row: {
  id: string
  display_name: string
  email: string
  slug: string
  city: City | null
  hidden_at: string | null
  disaffiliated_at: string | null
  contribution_types: NeedType[] | null
  instagram: string | null
  website: string | null
  contribution_description: string | null
  avatar_storage_path: string | null
}): ModerationProfileFicha {
  return {
    ...mapModerationProfile(row),
    instagram: row.instagram,
    website: row.website,
    contributionDescription: row.contribution_description,
    avatarPath: row.avatar_storage_path,
  }
}

export function mapModerationEventFicha(
  row: {
    id: string
    title: string
    status: EventStatus
    city: City
    category: EventCategory
    starts_on: string | null
    hidden_at: string | null
    organizer_id: string
    description: string
    audience: string
    place_name: string | null
    date_range_label: string | null
    expected_attendees: number
    rsvp_url: string
    sponsor_benefit: string
  },
  organizerName: string,
  needs: ModerationEventNeed[],
): ModerationEventFicha {
  return {
    ...mapModerationEvent(row, organizerName),
    description: row.description,
    audience: row.audience,
    placeName: row.place_name,
    dateRangeLabel: row.date_range_label,
    expectedAttendees: row.expected_attendees,
    rsvpUrl: row.rsvp_url,
    sponsorBenefit: row.sponsor_benefit,
    needs,
  }
}

export function profileVisibility(
  row: Pick<ModerationProfileRow, 'hidden' | 'disaffiliated'>,
): Exclude<ModerationVisibility, 'all'> {
  if (row.disaffiliated) return 'disaffiliated'
  if (row.hidden) return 'hidden'
  return 'active'
}

export function filterModerationProfiles(
  rows: ModerationProfileRow[],
  filters: ModerationProfileFilters,
): ModerationProfileRow[] {
  return rows.filter((row) => {
    const haystack = `${row.displayName} ${row.email} ${row.slug}`
    if (!matchesQuery(haystack, filters.query)) return false
    if (filters.city !== 'all' && row.city !== filters.city) return false
    if (filters.visibility !== 'all' && profileVisibility(row) !== filters.visibility) return false
    if (filters.contributionType !== 'all' && !row.contributionTypes.includes(filters.contributionType)) return false
    return true
  })
}

export function filterModerationEvents(
  rows: ModerationEventRow[],
  filters: ModerationEventFilters,
): ModerationEventRow[] {
  return rows.filter((row) => {
    const haystack = `${row.title} ${row.organizerName}`
    if (!matchesQuery(haystack, filters.query)) return false
    if (filters.city !== 'all' && row.city !== filters.city) return false
    if (filters.status !== 'all' && row.status !== filters.status) return false
    if (filters.hidden === 'visible' && row.hidden) return false
    if (filters.hidden === 'hidden' && !row.hidden) return false
    return true
  })
}
