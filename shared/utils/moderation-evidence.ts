import type { NeedStatus, NeedType } from '../constants/domain'

export type EvidenceNeedTone = 'success' | 'warning' | 'info' | 'neutral'

const NEED_ICONS: Record<NeedType, string> = {
  venue: 'i-lucide-building-2',
  products: 'i-lucide-package',
  food: 'i-lucide-hand-heart',
  equipment: 'i-lucide-wrench',
  services: 'i-lucide-handshake',
  diffusion: 'i-lucide-megaphone',
}

export type EvidenceNeed = {
  id: string
  type: NeedType
  description: string
  quantityRequested: number | null
  quantityCovered: number
  unit: string | null
  status: NeedStatus
}

export type EvidenceParty = {
  id: string
  name: string
  detail: string | null
}

export type PendingEvidenceRow = {
  id: string
  eventId: string
  title: string
  attendanceCount: number
  venueNote: string
  contributionsNote: string
  media: Array<{ storage_path: string }>
  needs: EvidenceNeed[]
  venue: EvidenceParty | null
  localSponsors: EvidenceParty[]
}

export function evidenceNeedIcon(type: NeedType): string {
  return NEED_ICONS[type]
}

export function evidenceNeedTone(status: NeedStatus): EvidenceNeedTone {
  if (status === 'covered') return 'success'
  if (status === 'partial') return 'info'
  if (status === 'open') return 'warning'
  return 'neutral'
}

export function formatEvidenceCoverage(
  need: Pick<EvidenceNeed, 'quantityCovered' | 'quantityRequested' | 'unit'>,
  ofLabel: string,
): string | null {
  if (need.quantityRequested == null || !need.unit) return null
  return `${need.quantityCovered} ${ofLabel} ${need.quantityRequested} ${need.unit}`
}

export function mapEvidenceNeed(row: {
  id: string
  type: NeedType
  description: string
  quantity_requested: number | null
  quantity_covered: number
  unit: string | null
  status: NeedStatus
}): EvidenceNeed {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    quantityRequested: row.quantity_requested == null ? null : Number(row.quantity_requested),
    quantityCovered: Number(row.quantity_covered),
    unit: row.unit,
    status: row.status,
  }
}

export function mapPendingEvidence(input: {
  id: string
  event_id: string
  attendance_count: number
  venue_note: string
  contributions_note: string
  title: string
  media: Array<{ storage_path: string }>
  needs: EvidenceNeed[]
  venue: EvidenceParty | null
  localSponsors: EvidenceParty[]
}): PendingEvidenceRow {
  return {
    id: input.id,
    eventId: input.event_id,
    title: input.title,
    attendanceCount: input.attendance_count,
    venueNote: input.venue_note,
    contributionsNote: input.contributions_note,
    media: input.media,
    needs: input.needs,
    venue: input.venue,
    localSponsors: input.localSponsors,
  }
}
