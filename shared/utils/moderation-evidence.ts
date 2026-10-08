import type { NeedStatus, NeedType } from '../constants/domain'

export type EvidenceNeedTone = 'success' | 'warning' | 'info' | 'neutral' | 'error'

const NEED_ICONS: Record<NeedType, string> = {
  venue: 'i-lucide-building-2',
  products: 'i-lucide-package',
  food: 'i-lucide-hand-heart',
  equipment: 'i-lucide-wrench',
  services: 'i-lucide-handshake',
  diffusion: 'i-lucide-megaphone',
}

export type EvidenceContributionNote = {
  needId: string
  note: string
}

export type EvidenceNeed = {
  id: string
  type: NeedType
  description: string
  quantityRequested: number | null
  quantityCovered: number
  unit: string | null
  status: NeedStatus
  organizerNote: string | null
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
  if (status === 'partial') return 'warning'
  if (status === 'open') return 'error'
  return 'neutral'
}

export function formatEvidenceCoverage(
  need: Pick<EvidenceNeed, 'quantityCovered' | 'quantityRequested' | 'unit'>,
  ofLabel: string,
): string | null {
  if (need.quantityRequested == null || !need.unit) return null
  return `${need.quantityCovered} ${ofLabel} ${need.quantityRequested} ${need.unit}`
}

export function joinContributionNotes(notes: Array<{ note: string }>, fallback = 'Sin aportes registrados.'): string {
  const text = notes
    .map((entry) => entry.note.trim())
    .filter(Boolean)
    .join(' ')
  if (text.length < 3) return fallback
  return text.slice(0, 2000)
}

export function toStoredContributionNotes(notes: EvidenceContributionNote[]): Array<{ need_id: string; note: string }> {
  return notes.map((entry) => ({ need_id: entry.needId, note: entry.note.trim() }))
}

export function parseContributionNotes(raw: unknown): EvidenceContributionNote[] {
  if (!Array.isArray(raw)) return []
  const notes: EvidenceContributionNote[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as { need_id?: unknown; needId?: unknown; note?: unknown }
    const needId = typeof row.need_id === 'string' ? row.need_id : typeof row.needId === 'string' ? row.needId : null
    const note = typeof row.note === 'string' ? row.note : null
    if (!needId || !note) continue
    notes.push({ needId, note })
  }
  return notes
}

export function mapEvidenceNeed(
  row: {
    id: string
    type: NeedType
    description: string
    quantity_requested: number | null
    quantity_covered: number
    unit: string | null
    status: NeedStatus
  },
  organizerNote: string | null = null,
): EvidenceNeed {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    quantityRequested: row.quantity_requested == null ? null : Number(row.quantity_requested),
    quantityCovered: Number(row.quantity_covered),
    unit: row.unit,
    status: row.status,
    organizerNote,
  }
}

export function attachOrganizerNotes(needs: EvidenceNeed[], notes: EvidenceContributionNote[]): EvidenceNeed[] {
  const byId = new Map(notes.map((entry) => [entry.needId, entry.note]))
  return needs.map((need) => ({
    ...need,
    organizerNote: byId.get(need.id) ?? need.organizerNote,
  }))
}

export function mapPendingEvidence(input: {
  id: string
  event_id: string
  attendance_count: number
  venue_note: string
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
    media: input.media,
    needs: input.needs,
    venue: input.venue,
    localSponsors: input.localSponsors,
  }
}
