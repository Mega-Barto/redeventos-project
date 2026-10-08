import type { City, EventCategory, NeedStatus, NeedType } from '../constants/domain'

export type SeekingEventRow = {
  id: string
  slug: string
  title: string
  category: EventCategory
  city: City
  starts_on: string | null
  date_range_label: string | null
  place_name: string | null
  status: 'published' | 'public'
}

export type SeekingNeedRow = {
  id: string
  event_id: string
  type: NeedType
  description: string
  status: NeedStatus
}

export type SeekingEventCard = SeekingEventRow & {
  openNeeds: Array<Pick<SeekingNeedRow, 'id' | 'type' | 'description' | 'status'>>
}

const OPEN_NEED_STATUSES: NeedStatus[] = ['open', 'partial']

/** Eventos published/public con al menos una necesidad abierta o parcial. */
export function buildSeekingEventCards(events: SeekingEventRow[], needs: SeekingNeedRow[]): SeekingEventCard[] {
  const needsByEvent = new Map<string, SeekingNeedRow[]>()
  for (const need of needs) {
    if (!OPEN_NEED_STATUSES.includes(need.status)) continue
    const list = needsByEvent.get(need.event_id) ?? []
    list.push(need)
    needsByEvent.set(need.event_id, list)
  }

  const cards: SeekingEventCard[] = []
  for (const event of events) {
    if (event.status !== 'published' && event.status !== 'public') continue
    const openNeeds = needsByEvent.get(event.id) ?? []
    if (openNeeds.length === 0) continue
    cards.push({
      ...event,
      openNeeds: openNeeds.map((need) => ({
        id: need.id,
        type: need.type,
        description: need.description,
        status: need.status,
      })),
    })
  }
  return cards
}

export function seekingWhenLabel(event: Pick<SeekingEventRow, 'starts_on' | 'date_range_label'>): string {
  return event.starts_on ?? event.date_range_label ?? 'Fecha por confirmar'
}
