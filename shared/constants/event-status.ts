import type { EventStatus } from './domain'

export const EVENT_TRANSITIONS: Readonly<Record<EventStatus, readonly EventStatus[]>> = {
  draft: ['published'],
  published: ['public', 'cancelled'],
  public: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export function canTransitionEvent(from: EventStatus, to: EventStatus): boolean {
  return EVENT_TRANSITIONS[from].includes(to)
}
