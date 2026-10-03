import type {
  City,
  EventCategory,
  EventStatus,
  NeedStatus,
  NeedType,
  OfferStatus,
  Role,
} from '~~/shared/constants/domain'
import { MAX_VENUE_GALLERY } from '~~/shared/constants/media'
import { suggestionRank } from '~~/shared/domain/rules'
import {
  type CreateEventInput,
  createEventSchema,
  createOfferSchema,
  disaffiliateSchema,
  evidenceSchema,
  makePublicSchema,
  type ProfileUpdateInput,
  profileUpdateSchema,
  reviewEvidenceSchema,
  type VenueInput,
  venueSchema,
} from '~~/shared/schemas/inputs'
import {
  avatarFilesSchema,
  evidenceFilesSchema,
  fileToMeta,
  venueCoverFilesSchema,
  venueGalleryFilesSchema,
} from '~~/shared/schemas/media'
import {
  type ModerationEventFicha,
  type ModerationEventRow,
  type ModerationProfileFicha,
  type ModerationProfileRow,
  mapModerationEvent,
  mapModerationEventFicha,
  mapModerationProfile,
  mapModerationProfileFicha,
} from '~~/shared/utils/moderation-directory'
import {
  type EvidenceParty,
  mapEvidenceNeed,
  mapPendingEvidence,
  type PendingEvidenceRow,
} from '~~/shared/utils/moderation-evidence'
import { imageExtension } from '~~/shared/utils/storage-url'

function firstIssue(error: { issues: Array<{ message: string }> }) {
  return error.issues[0]?.message ?? 'Revisa el formulario'
}

async function notify(path: string, body: { offerId?: string; evidenceId?: string }) {
  try {
    await $fetch(path, { method: 'POST', body })
  } catch {
    // El correo no bloquea el compromiso ni la revisión.
  }
}

export async function loadMyRoles(profileId: string) {
  const db = useDb()
  const { data, error } = await db.from('profile_roles').select('role').eq('profile_id', profileId)
  if (error) return [] as Role[]
  return (data ?? []).map((row) => row.role)
}

export async function loadProfileForm(profileId: string) {
  const db = useDb()
  const [{ data: profile, error }, { data: direct }, { data: roles }] = await Promise.all([
    db
      .from('profiles')
      .select(
        'display_name, instagram, website, city, contribution_types, contribution_description, avatar_storage_path',
      )
      .eq('id', profileId)
      .maybeSingle(),
    db.from('profile_direct_contacts').select('whatsapp, phone').eq('profile_id', profileId).maybeSingle(),
    db.from('profile_roles').select('role').eq('profile_id', profileId),
  ])
  if (error || !profile) return null
  const assignable = (roles ?? [])
    .map((row) => row.role)
    .filter((role): role is Exclude<Role, 'moderator'> => role !== 'moderator')
  return {
    displayName: profile.display_name,
    roles: assignable,
    instagram: profile.instagram ?? '',
    website: profile.website ?? '',
    city: (profile.city ?? '') as '' | City,
    whatsapp: direct?.whatsapp ?? '',
    phone: direct?.phone ?? '',
    contributionTypes: profile.contribution_types,
    contributionDescription: profile.contribution_description ?? '',
    avatarPath: profile.avatar_storage_path,
  }
}

export async function saveProfile(profileId: string, raw: unknown) {
  const parsed = profileUpdateSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const data: ProfileUpdateInput = parsed.data
  const profileResult = await db
    .from('profiles')
    .update({
      instagram: data.instagram,
      website: data.website,
      city: data.city,
      contribution_types: data.contributionTypes,
      contribution_description: data.contributionDescription,
    })
    .eq('id', profileId)
  if (profileResult.error) return { error: profileResult.error.message }
  const directResult = await db
    .from('profile_direct_contacts')
    .update({ whatsapp: data.whatsapp, phone: data.phone })
    .eq('profile_id', profileId)
  if (directResult.error) return { error: directResult.error.message }
  await db.from('profile_roles').delete().eq('profile_id', profileId).neq('role', 'moderator')
  const roleResult = await db.from('profile_roles').insert(
    data.roles.map((role) => ({
      profile_id: profileId,
      role,
    })),
  )
  if (roleResult.error) return { error: roleResult.error.message }
  return { error: null as string | null }
}

export async function saveProfileAvatar(profileId: string, file: File) {
  const parsed = avatarFilesSchema.safeParse([fileToMeta(file)])
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const ext = imageExtension(file.type)
  if (!ext) return { error: 'Cada foto debe ser jpeg, png, webp o avif.' }
  const db = useDb()
  const current = await db.from('profiles').select('avatar_storage_path').eq('id', profileId).maybeSingle()
  if (current.error) return { error: current.error.message }
  const path = `${profileId}/avatar.${ext}`
  const { uploadImage, removeObject } = useMediaUpload()
  const uploaded = await uploadImage({ bucket: 'profiles', path, file, upsert: true })
  if (uploaded.error) return { error: uploaded.error }
  const updated = await db.from('profiles').update({ avatar_storage_path: path }).eq('id', profileId)
  if (updated.error) return { error: updated.error.message }
  const previous = current.data?.avatar_storage_path
  if (previous && previous !== path) await removeObject('profiles', previous)
  return { error: null as string | null, path }
}

export type OwnEvent = {
  id: string
  title: string
  slug: string
  status: EventStatus
  category: EventCategory
  city: City
  starts_on: string | null
  date_range_label: string | null
  place_name: string | null
  venue_id: string | null
  expected_attendees: number
  description: string
  audience: string
  sponsor_benefit: string
  rsvp_url: string
  organizer_id: string
}

export type EventNeedRow = {
  id: string
  event_id: string
  type: NeedType
  description: string
  quantity_requested: number | null
  quantity_covered: number
  unit: string | null
  status: NeedStatus
}

const eventColumns =
  'id, title, slug, status, category, city, starts_on, date_range_label, place_name, venue_id, expected_attendees, description, audience, sponsor_benefit, rsvp_url, organizer_id'

export async function listOwnEvents(organizerId: string) {
  const db = useDb()
  const { data, error } = await db
    .from('events')
    .select(eventColumns)
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false })
  if (error) return { events: [] as OwnEvent[], error: error.message }
  return { events: (data ?? []) as OwnEvent[], error: null as string | null }
}

export async function loadEventBundle(eventId: string) {
  const db = useDb()
  const { data: event, error } = await db.from('events').select(eventColumns).eq('id', eventId).maybeSingle()
  if (error || !event) return null
  const [{ data: needs }, { data: organizer }, { data: evidence }, { data: media }] = await Promise.all([
    db
      .from('event_needs')
      .select('id, event_id, type, description, quantity_requested, quantity_covered, unit, status')
      .eq('event_id', eventId),
    db.from('profiles').select('display_name, email, instagram, website').eq('id', event.organizer_id).maybeSingle(),
    db.from('evidence').select('id, status').eq('event_id', eventId).maybeSingle(),
    db
      .from('event_media')
      .select('id, storage_path, is_public, created_at')
      .eq('event_id', eventId)
      .order('created_at'),
  ])
  return {
    event: event as OwnEvent,
    needs: (needs ?? []) as EventNeedRow[],
    organizer,
    evidence,
    media: media ?? [],
  }
}

export async function createDraftEvent(organizerId: string, input: CreateEventInput) {
  const parsed = createEventSchema.safeParse(input)
  if (!parsed.success) return { id: null as string | null, error: firstIssue(parsed.error) }
  const db = useDb()
  const value = parsed.data
  const { data, error } = await db
    .from('events')
    .insert({
      organizer_id: organizerId,
      title: value.title,
      category: value.category,
      city: value.city,
      starts_on: value.dateMode === 'concrete' ? (value.startsOn ?? null) : null,
      date_range_label: value.dateMode === 'range' ? (value.dateRangeLabel ?? null) : null,
      expected_attendees: value.expectedAttendees,
      description: value.description,
      audience: value.audience,
      sponsor_benefit: value.sponsorBenefit,
      rsvp_url: value.rsvpUrl,
      slug: '',
      status: 'draft',
    })
    .select('id')
    .single()
  if (error || !data) return { id: null, error: error?.message ?? 'No se pudo crear el evento' }
  const needsResult = await db.from('event_needs').insert(
    value.needs.map((need) => ({
      event_id: data.id,
      type: need.type,
      description: need.description,
      quantity_requested: need.quantity,
      unit: need.unit,
    })),
  )
  if (needsResult.error) return { id: data.id, error: needsResult.error.message }
  return { id: data.id, error: null as string | null }
}

export async function publishEvent(eventId: string) {
  const db = useDb()
  const { error } = await db.from('events').update({ status: 'published' }).eq('id', eventId)
  return { error: error?.message ?? null }
}

export async function cancelEvent(eventId: string) {
  const db = useDb()
  const { error } = await db.from('events').update({ status: 'cancelled' }).eq('id', eventId)
  return { error: error?.message ?? null }
}

export async function makeEventPublic(eventId: string, raw: unknown) {
  const parsed = makePublicSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const { error } = await db
    .from('events')
    .update({
      status: 'public',
      starts_on: parsed.data.startsOn,
      place_name: parsed.data.placeName || null,
      venue_id: parsed.data.venueId,
    })
    .eq('id', eventId)
  return { error: error?.message ?? null }
}

export async function submitEvidence(eventId: string, profileId: string, raw: unknown, files: File[]) {
  const parsed = evidenceSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const filesParsed = evidenceFilesSchema.safeParse(files.map(fileToMeta))
  if (!filesParsed.success) return { error: firstIssue(filesParsed.error) }
  const db = useDb()
  const { uploadMany, removeObject } = useMediaUpload()
  const payload = {
    attendance_count: parsed.data.attendanceCount,
    venue_note: parsed.data.venueNote,
    contributions_note: parsed.data.contributionsNote,
    status: 'submitted' as const,
  }
  const existing = await db.from('evidence').select('id, status').eq('event_id', eventId).maybeSingle()
  let evidenceId = existing.data?.id ?? null
  if (existing.data?.status === 'rejected') {
    const unpublished = await db
      .from('event_media')
      .select('storage_path')
      .eq('event_id', eventId)
      .eq('is_public', false)
    for (const row of unpublished.data ?? []) {
      await removeObject('evidence', row.storage_path)
    }
    const updated = await db.from('evidence').update(payload).eq('id', existing.data.id)
    if (updated.error) return { error: updated.error.message }
  } else if (!existing.data) {
    const inserted = await db
      .from('evidence')
      .insert({ ...payload, event_id: eventId, submitted_by: profileId })
      .select('id')
      .single()
    if (inserted.error || !inserted.data) return { error: inserted.error?.message ?? 'No se pudo enviar la evidencia' }
    evidenceId = inserted.data.id
  } else {
    return { error: 'Esa evidencia ya fue enviada.' }
  }
  const uploaded = await uploadMany({
    bucket: 'evidence',
    files,
    pathFor: () => `${eventId}/${crypto.randomUUID()}`,
  })
  for (const item of uploaded) {
    if (item.error) return { error: item.error, evidenceId }
    const media = await db.from('event_media').insert({
      event_id: eventId,
      storage_path: item.path,
      kind: 'evidence',
      is_public: false,
    })
    if (media.error) return { error: media.error.message, evidenceId }
  }
  return { error: null as string | null, evidenceId }
}

export async function loadOwnVenue(ownerId: string) {
  const db = useDb()
  const { data, error } = await db
    .from('venues')
    .select('id, name, city, zone, capacity, equipment, support_mode, description, cover_storage_path')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) return { venue: null, error: error.message }
  if (!data) return { venue: null, error: null as string | null }
  const { data: gallery } = await db
    .from('venue_media')
    .select('id, storage_path, sort_order')
    .eq('venue_id', data.id)
    .order('sort_order')
  const initial: VenueInput = {
    name: data.name,
    city: data.city,
    zone: data.zone,
    capacity: data.capacity,
    equipment: data.equipment,
    supportMode: data.support_mode,
    description: data.description,
  }
  return {
    venue: {
      id: data.id,
      initial,
      coverPath: data.cover_storage_path,
      gallery: gallery ?? [],
    },
    error: null as string | null,
  }
}

export async function saveVenue(ownerId: string, raw: unknown, existingId: string | null) {
  const parsed = venueSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const row = {
    name: parsed.data.name,
    city: parsed.data.city,
    zone: parsed.data.zone,
    capacity: parsed.data.capacity,
    equipment: parsed.data.equipment,
    support_mode: parsed.data.supportMode,
    description: parsed.data.description,
  }
  if (existingId) {
    const { error } = await db.from('venues').update(row).eq('id', existingId)
    return { id: existingId, error: error?.message ?? null }
  }
  const inserted = await db
    .from('venues')
    .insert({ ...row, owner_id: ownerId, slug: '' })
    .select('id')
    .single()
  return { id: inserted.data?.id ?? null, error: inserted.error?.message ?? null }
}

export async function saveVenueCover(venueId: string, file: File) {
  const parsed = venueCoverFilesSchema.safeParse([fileToMeta(file)])
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const ext = imageExtension(file.type)
  if (!ext) return { error: 'Cada foto debe ser jpeg, png, webp o avif.' }
  const db = useDb()
  const current = await db.from('venues').select('cover_storage_path').eq('id', venueId).maybeSingle()
  if (current.error) return { error: current.error.message }
  const path = `${venueId}/cover.${ext}`
  const { uploadImage, removeObject } = useMediaUpload()
  const uploaded = await uploadImage({ bucket: 'venues', path, file, upsert: true })
  if (uploaded.error) return { error: uploaded.error }
  const updated = await db.from('venues').update({ cover_storage_path: path }).eq('id', venueId)
  if (updated.error) return { error: updated.error.message }
  const previous = current.data?.cover_storage_path
  if (previous && previous !== path) await removeObject('venues', previous)
  return { error: null as string | null }
}

export async function addVenueGallery(venueId: string, files: File[]) {
  const parsed = venueGalleryFilesSchema.safeParse(files.map(fileToMeta))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const existing = await db.from('venue_media').select('id, sort_order').eq('venue_id', venueId)
  if (existing.error) return { error: existing.error.message }
  if ((existing.data?.length ?? 0) + files.length > MAX_VENUE_GALLERY) {
    return { error: `La galería admite hasta ${MAX_VENUE_GALLERY} fotos.` }
  }
  const start = Math.max(0, ...(existing.data ?? []).map((row) => row.sort_order)) + 1
  const { uploadMany } = useMediaUpload()
  const uploaded = await uploadMany({
    bucket: 'venues',
    files,
    pathFor: (file) => `${venueId}/gallery/${crypto.randomUUID()}.${imageExtension(file.type) ?? 'jpg'}`,
  })
  for (const [index, item] of uploaded.entries()) {
    if (item.error) return { error: item.error }
    const inserted = await db.from('venue_media').insert({
      venue_id: venueId,
      storage_path: item.path,
      sort_order: start + index,
    })
    if (inserted.error) return { error: inserted.error.message }
  }
  return { error: null as string | null }
}

export async function removeVenueGalleryItem(venueId: string, mediaId: string, storagePath: string) {
  const db = useDb()
  const { removeObject } = useMediaUpload()
  const deleted = await db.from('venue_media').delete().eq('id', mediaId).eq('venue_id', venueId)
  if (deleted.error) return { error: deleted.error.message }
  return removeObject('venues', storagePath)
}

export type Opportunity = {
  eventId: string
  title: string
  category: EventCategory
  city: City
  whenLabel: string
  expectedAttendees: number
  audience: string
  sponsorBenefit: string
  organizerName: string
  need: EventNeedRow
  score: number
}

export async function listOpportunities(viewer: {
  city: City | null
  contributionTypes: NeedType[]
  capacity: number | null
}) {
  const db = useDb()
  const { data: events, error } = await db
    .from('events')
    .select(
      'id, title, category, city, starts_on, date_range_label, expected_attendees, audience, sponsor_benefit, organizer_id, status',
    )
    .in('status', ['published', 'public'])
    .is('hidden_at', null)
  if (error) return { items: [] as Opportunity[], error: error.message }
  const ids = (events ?? []).map((event) => event.id)
  if (ids.length === 0) return { items: [] as Opportunity[], error: null as string | null }
  const { data: needs } = await db
    .from('event_needs')
    .select('id, event_id, type, description, quantity_requested, quantity_covered, unit, status')
    .in('event_id', ids)
    .in('status', ['open', 'partial'])
  const organizerIds = [...new Set((events ?? []).map((event) => event.organizer_id))]
  const { data: organizers } = await db.from('profiles').select('id, display_name').in('id', organizerIds)
  const items: Opportunity[] = []
  for (const need of (needs ?? []) as EventNeedRow[]) {
    const event = events?.find((item) => item.id === need.event_id)
    if (!event) continue
    const score = suggestionRank({
      needType: need.type,
      city: event.city,
      expectedAttendees: event.expected_attendees,
      sponsorCity: viewer.city,
      contributionTypes: viewer.contributionTypes,
      capacity: viewer.capacity,
    })
    items.push({
      eventId: event.id,
      title: event.title,
      category: event.category,
      city: event.city,
      whenLabel: event.starts_on ?? event.date_range_label ?? 'Fecha por confirmar',
      expectedAttendees: event.expected_attendees,
      audience: event.audience,
      sponsorBenefit: event.sponsor_benefit,
      organizerName: organizers?.find((profile) => profile.id === event.organizer_id)?.display_name ?? 'Organizador',
      need,
      score: score ?? 0,
    })
  }
  items.sort((a, b) => b.score - a.score)
  return { items, error: null as string | null }
}

export async function loadViewerMatchProfile(profileId: string) {
  const db = useDb()
  const [{ data: profile }, { data: venues }, { data: roles }] = await Promise.all([
    db.from('profiles').select('city, contribution_types').eq('id', profileId).maybeSingle(),
    db.from('venues').select('id, capacity').eq('owner_id', profileId),
    db.from('profile_roles').select('role').eq('profile_id', profileId),
  ])
  const roleList = (roles ?? []).map((row) => row.role)
  const capacity = (venues ?? []).reduce<number | null>((max, venue) => {
    if (max == null) return venue.capacity
    return Math.max(max, venue.capacity)
  }, null)
  const types = new Set<NeedType>(profile?.contribution_types ?? [])
  if (roleList.includes('venue_sponsor')) types.add('venue')
  return {
    city: profile?.city ?? null,
    contributionTypes: [...types],
    capacity,
    venueId: venues?.[0]?.id ?? null,
    roles: roleList,
  }
}

export type Candidate = {
  recipientId: string
  venueId: string | null
  label: string
  score: number | null
}

export async function loadCandidates(input: {
  needType: NeedType
  city: City
  expectedAttendees: number
  viewerId: string
}) {
  const db = useDb()
  if (input.needType === 'venue') {
    const { data: venues } = await db.from('venues').select('id, name, owner_id, capacity, city')
    const ownerIds = [...new Set((venues ?? []).map((venue) => venue.owner_id))].filter((id) => id !== input.viewerId)
    if (ownerIds.length === 0) return [] as Candidate[]
    const { data: profiles } = await db.from('profiles').select('id, display_name').in('id', ownerIds)
    return (venues ?? [])
      .filter((venue) => venue.owner_id !== input.viewerId)
      .map((venue) => ({
        recipientId: venue.owner_id,
        venueId: venue.id,
        label: `${venue.name} · ${profiles?.find((profile) => profile.id === venue.owner_id)?.display_name ?? 'Espacio'}`,
        score: suggestionRank({
          needType: 'venue',
          city: input.city,
          expectedAttendees: input.expectedAttendees,
          sponsorCity: venue.city,
          contributionTypes: ['venue'],
          capacity: venue.capacity,
        }),
      }))
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  }
  const { data: roleRows } = await db.from('profile_roles').select('profile_id').eq('role', 'local_sponsor')
  const ids = (roleRows ?? []).map((row) => row.profile_id).filter((id) => id !== input.viewerId)
  if (ids.length === 0) return [] as Candidate[]
  const { data: profiles } = await db
    .from('profiles')
    .select('id, display_name, city, contribution_types')
    .in('id', ids)
  return (profiles ?? [])
    .map((profile) => ({
      recipientId: profile.id,
      venueId: null,
      label: profile.display_name,
      score: suggestionRank({
        needType: input.needType,
        city: input.city,
        expectedAttendees: input.expectedAttendees,
        sponsorCity: profile.city,
        contributionTypes: profile.contribution_types,
        capacity: null,
      }),
    }))
    .filter((item) => item.score != null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}

export async function sendOffer(proposerId: string, raw: unknown) {
  const parsed = createOfferSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const { data: need } = await db
    .from('event_needs')
    .select('quantity_requested, quantity_covered, status')
    .eq('id', parsed.data.eventNeedId)
    .maybeSingle()
  if (!need || (need.status !== 'open' && need.status !== 'partial')) {
    return { error: 'Esa necesidad ya no está abierta' }
  }
  if (
    need.quantity_requested != null &&
    parsed.data.quantity > Number(need.quantity_requested) - Number(need.quantity_covered)
  ) {
    return { error: 'La cantidad supera lo que falta por cubrir' }
  }
  const { data, error } = await db
    .from('offers')
    .insert({
      event_need_id: parsed.data.eventNeedId,
      event_id: parsed.data.eventId,
      proposer_id: proposerId,
      recipient_id: parsed.data.recipientId,
      venue_id: parsed.data.venueId,
      quantity: parsed.data.quantity,
      offer_on: parsed.data.offerOn,
      note: parsed.data.note,
      status: 'pending',
    })
    .select('id')
    .single()
  if (error || !data) return { error: error?.message ?? 'No se pudo enviar la propuesta' }
  await notify('/api/notifications/offer-received', { offerId: data.id })
  return { error: null as string | null }
}

export type OfferListItem = {
  id: string
  status: OfferStatus
  quantity: number
  offer_on: string
  note: string
  proposer_id: string
  recipient_id: string
  event_id: string
  eventTitle: string
  commitment: { what: string; quantity: number; when_on: string } | null
  direct: { whatsapp: string | null; phone: string | null } | null
}

export async function listMyOffers(profileId: string) {
  const db = useDb()
  const { data, error } = await db
    .from('offers')
    .select('id, status, quantity, offer_on, note, proposer_id, recipient_id, event_id')
    .or(`proposer_id.eq.${profileId},recipient_id.eq.${profileId}`)
    .order('created_at', { ascending: false })
  if (error) return { offers: [] as OfferListItem[], error: error.message }
  const rows = data ?? []
  const eventIds = [...new Set(rows.map((row) => row.event_id))]
  const offerIds = rows.map((row) => row.id)
  const [{ data: events }, { data: matches }] = await Promise.all([
    eventIds.length
      ? db.from('events').select('id, title').in('id', eventIds)
      : Promise.resolve({ data: [] as Array<{ id: string; title: string }> }),
    offerIds.length
      ? db.from('matches').select('id, offer_id, organizer_id, sponsor_id').in('offer_id', offerIds)
      : Promise.resolve({
          data: [] as Array<{ id: string; offer_id: string; organizer_id: string; sponsor_id: string }>,
        }),
  ])
  const matchIds = (matches ?? []).map((match) => match.id)
  const { data: commitments } = matchIds.length
    ? await db.from('match_commitments').select('match_id, what, quantity, when_on').in('match_id', matchIds)
    : { data: [] as Array<{ match_id: string; what: string; quantity: number; when_on: string }> }
  const otherIds = [
    ...new Set(
      (matches ?? []).map((match) => (match.organizer_id === profileId ? match.sponsor_id : match.organizer_id)),
    ),
  ]
  const { data: directs } = otherIds.length
    ? await db.from('profile_direct_contacts').select('profile_id, whatsapp, phone').in('profile_id', otherIds)
    : { data: [] as Array<{ profile_id: string; whatsapp: string | null; phone: string | null }> }
  const offers: OfferListItem[] = rows.map((row) => {
    const match = matches?.find((item) => item.offer_id === row.id)
    const commitment = commitments?.find((item) => item.match_id === match?.id) ?? null
    const otherId = match ? (match.organizer_id === profileId ? match.sponsor_id : match.organizer_id) : null
    const direct = directs?.find((item) => item.profile_id === otherId) ?? null
    return {
      ...row,
      status: row.status,
      eventTitle: events?.find((event) => event.id === row.event_id)?.title ?? 'Evento',
      commitment: commitment
        ? { what: commitment.what, quantity: Number(commitment.quantity), when_on: commitment.when_on }
        : null,
      direct: direct ? { whatsapp: direct.whatsapp, phone: direct.phone } : null,
    }
  })
  return { offers, error: null as string | null }
}

export async function acceptOffer(offerId: string) {
  const db = useDb()
  const { error } = await db.rpc('accept_offer', { p_offer_id: offerId })
  if (error) return { error: error.message }
  await notify('/api/notifications/offer-accepted', { offerId })
  return { error: null as string | null }
}

export async function rejectOffer(offerId: string) {
  const db = useDb()
  const { error } = await db.rpc('reject_offer', { p_offer_id: offerId })
  return { error: error?.message ?? null }
}

export async function cancelOffer(offerId: string) {
  const db = useDb()
  const { error } = await db.rpc('cancel_offer', { p_offer_id: offerId })
  return { error: error?.message ?? null }
}

export async function listModerationProfiles(role: 'organizer' | 'local_sponsor') {
  const db = useDb()
  const { data: roleRows, error: roleError } = await db.from('profile_roles').select('profile_id').eq('role', role)
  if (roleError) return { rows: [] as ModerationProfileRow[], error: roleError.message }
  const ids = [...new Set((roleRows ?? []).map((row) => row.profile_id))]
  if (!ids.length) return { rows: [] as ModerationProfileRow[], error: null as string | null }
  const { data, error } = await db
    .from('profiles')
    .select('id, display_name, email, slug, city, hidden_at, disaffiliated_at, contribution_types')
    .in('id', ids)
    .order('display_name')
  if (error) return { rows: [] as ModerationProfileRow[], error: error.message }
  return { rows: (data ?? []).map(mapModerationProfile), error: null as string | null }
}

export async function listModerationEvents() {
  const db = useDb()
  const { data, error } = await db
    .from('events')
    .select('id, title, status, city, category, starts_on, hidden_at, organizer_id')
    .order('created_at', { ascending: false })
  if (error) return { rows: [] as ModerationEventRow[], error: error.message }
  const organizerIds = [...new Set((data ?? []).map((row) => row.organizer_id))]
  const { data: organizers } = organizerIds.length
    ? await db.from('profiles').select('id, display_name').in('id', organizerIds)
    : { data: [] as Array<{ id: string; display_name: string }> }
  const names = new Map((organizers ?? []).map((row) => [row.id, row.display_name]))
  return {
    rows: (data ?? []).map((row) => mapModerationEvent(row, names.get(row.organizer_id) ?? 'Organizador')),
    error: null as string | null,
  }
}

export async function loadModerationProfileFicha(id: string) {
  const db = useDb()
  const { data, error } = await db
    .from('profiles')
    .select(
      'id, display_name, email, slug, city, hidden_at, disaffiliated_at, contribution_types, instagram, website, contribution_description, avatar_storage_path',
    )
    .eq('id', id)
    .maybeSingle()
  if (error) return { ficha: null as ModerationProfileFicha | null, error: error.message }
  if (!data) return { ficha: null as ModerationProfileFicha | null, error: 'No se pudo cargar la ficha.' }
  return { ficha: mapModerationProfileFicha(data), error: null as string | null }
}

export async function loadModerationEventFicha(id: string) {
  const db = useDb()
  const { data, error } = await db
    .from('events')
    .select(
      'id, title, status, city, category, starts_on, hidden_at, organizer_id, description, audience, place_name, date_range_label, expected_attendees, rsvp_url, sponsor_benefit',
    )
    .eq('id', id)
    .maybeSingle()
  if (error) return { ficha: null as ModerationEventFicha | null, error: error.message }
  if (!data) return { ficha: null as ModerationEventFicha | null, error: 'No se pudo cargar la ficha.' }
  const [{ data: needs }, { data: organizer }] = await Promise.all([
    db.from('event_needs').select('id, type, description').eq('event_id', id),
    db.from('profiles').select('display_name').eq('id', data.organizer_id).maybeSingle(),
  ])
  return {
    ficha: mapModerationEventFicha(data, organizer?.display_name ?? 'Organizador', needs ?? []),
    error: null as string | null,
  }
}

export async function listPendingEvidence() {
  const db = useDb()
  const { data, error } = await db
    .from('evidence')
    .select('id, event_id, attendance_count, venue_note, contributions_note, status')
    .eq('status', 'submitted')
  if (error) return { rows: [] as PendingEvidenceRow[], error: error.message }
  const ids = (data ?? []).map((row) => row.event_id)
  if (!ids.length) return { rows: [] as PendingEvidenceRow[], error: null as string | null }

  const [{ data: events }, { data: media }, { data: needs }, { data: matches }] = await Promise.all([
    db.from('events').select('id, title, venue_id, place_name').in('id', ids),
    db.from('event_media').select('event_id, storage_path').in('event_id', ids),
    db
      .from('event_needs')
      .select('id, event_id, type, description, quantity_requested, quantity_covered, unit, status')
      .in('event_id', ids),
    db.from('matches').select('event_id, sponsor_id').in('event_id', ids).in('status', ['accepted', 'completed']),
  ])

  const venueIds = [...new Set((events ?? []).map((event) => event.venue_id).filter((id): id is string => Boolean(id)))]
  const { data: venues } = venueIds.length
    ? await db.from('venues').select('id, name, owner_id').in('id', venueIds)
    : { data: [] as Array<{ id: string; name: string; owner_id: string }> }

  const ownerIds = [...new Set((venues ?? []).map((venue) => venue.owner_id))]
  const sponsorIds = [...new Set((matches ?? []).map((match) => match.sponsor_id))]
  const profileIds = [...new Set([...ownerIds, ...sponsorIds])]
  const [{ data: profiles }, { data: localRoles }] = await Promise.all([
    profileIds.length
      ? db.from('profiles').select('id, display_name').in('id', profileIds)
      : Promise.resolve({ data: [] as Array<{ id: string; display_name: string }> }),
    sponsorIds.length
      ? db.from('profile_roles').select('profile_id').in('profile_id', sponsorIds).eq('role', 'local_sponsor')
      : Promise.resolve({ data: [] as Array<{ profile_id: string }> }),
  ])

  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name]))
  const localSponsorIds = new Set((localRoles ?? []).map((row) => row.profile_id))

  return {
    rows: (data ?? []).map((row) => {
      const event = events?.find((item) => item.id === row.event_id)
      const venueRow = event?.venue_id ? venues?.find((item) => item.id === event.venue_id) : null
      const venue: EvidenceParty | null = venueRow
        ? { id: venueRow.id, name: venueRow.name, detail: names.get(venueRow.owner_id) ?? null }
        : event?.place_name
          ? { id: event.id, name: event.place_name, detail: null }
          : null
      const localSponsors: EvidenceParty[] = (matches ?? [])
        .filter((match) => match.event_id === row.event_id && localSponsorIds.has(match.sponsor_id))
        .map((match) => ({
          id: match.sponsor_id,
          name: names.get(match.sponsor_id) ?? 'Aliado local',
          detail: null,
        }))
      return mapPendingEvidence({
        ...row,
        title: event?.title ?? 'Evento',
        media: (media ?? []).filter((item) => item.event_id === row.event_id),
        needs: (needs ?? []).filter((need) => need.event_id === row.event_id).map((need) => mapEvidenceNeed(need)),
        venue,
        localSponsors,
      })
    }),
    error: null as string | null,
  }
}

export async function reviewEvidence(raw: unknown) {
  const parsed = reviewEvidenceSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const { error } = await db.rpc('review_evidence', {
    p_evidence_id: parsed.data.evidenceId,
    p_decision: parsed.data.decision,
    p_note: parsed.data.note,
  })
  if (error) return { error: error.message }
  await notify('/api/notifications/evidence-reviewed', { evidenceId: parsed.data.evidenceId })
  return { error: null as string | null }
}

export async function listOpenReports() {
  const db = useDb()
  const { data, error } = await db
    .from('reports')
    .select('id, target_type, target_id, reason')
    .is('resolved_at', null)
    .order('created_at', { ascending: false })
  if (error) return { rows: [], error: error.message }
  return { rows: data ?? [], error: null as string | null }
}

export async function hideReportTarget(targetType: string, targetId: string) {
  const db = useDb()
  const { error } = await db.rpc('hide_target', { p_type: targetType, p_id: targetId })
  return { error: error?.message ?? null }
}

export async function disaffiliate(raw: unknown) {
  const parsed = disaffiliateSchema.safeParse(raw)
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const db = useDb()
  const { error } = await db.rpc('disaffiliate_profile', { p_profile_id: parsed.data.profileId })
  return { error: error?.message ?? null }
}
