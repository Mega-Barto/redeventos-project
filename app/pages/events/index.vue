<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { eventsSeekingContent } from '~~/shared/content/events'
import { formatBogotaDate } from '~~/shared/domain/rules'
import {
  buildSeekingEventCards,
  type SeekingEventRow,
  type SeekingNeedRow,
  seekingWhenLabel,
} from '~~/shared/utils/seeking-events'

useSeoMeta({
  title: eventsSeekingContent.title,
  description: eventsSeekingContent.seoDescription,
})

const configured = useSupabaseConfigured()
const { data: events, status, error } = await useAsyncData('seeking-events', async () => {
  if (!configured.value) return []
  const db = useDb()
  const { data: rows, error: eventsError } = await db
    .from('events')
    .select('id, slug, title, category, city, starts_on, date_range_label, place_name, status')
    .in('status', ['published', 'public'])
    .is('hidden_at', null)
    .order('starts_on', { ascending: true, nullsFirst: false })
  if (eventsError) throw eventsError
  const list = (rows ?? []) as SeekingEventRow[]
  if (!list.length) return []

  const { data: needs, error: needsError } = await db
    .from('event_needs')
    .select('id, event_id, type, description, status')
    .in(
      'event_id',
      list.map((event) => event.id),
    )
    .in('status', ['open', 'partial'])
  if (needsError) throw needsError

  return buildSeekingEventCards(list, (needs ?? []) as SeekingNeedRow[])
})

function whenLine(event: { starts_on: string | null; date_range_label: string | null }) {
  const raw = seekingWhenLabel(event)
  if (event.starts_on) return formatBogotaDate(event.starts_on)
  return raw
}

function needsLine(openNeeds: Array<{ type: keyof typeof NEED_LABELS; description: string }>) {
  return openNeeds.map((need) => `${NEED_LABELS[need.type]} (${need.description})`).join(' · ')
}

function supportTo(eventId: string) {
  return `/login?redirect=${encodeURIComponent(`/app/opportunities/${eventId}`)}`
}
</script>

<template>
  <UPage>
    <UPageHeader :title="eventsSeekingContent.title" :description="eventsSeekingContent.description" />
    <UPageBody>
      <UContainer class="space-y-4">
        <p class="text-sm text-muted">
          {{ eventsSeekingContent.agendaHint }}
          <NuxtLink
            :to="eventsSeekingContent.agendaTo"
            class="text-primary underline-offset-2 hover:underline"
          >
            {{ eventsSeekingContent.agendaCta }}
          </NuxtLink>
        </p>
        <div v-if="status === 'pending'" class="space-y-4" aria-busy="true" aria-live="polite">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
        <UAlert
          v-else-if="error"
          color="error"
          :title="eventsSeekingContent.loadErrorTitle"
          :description="eventsSeekingContent.loadErrorDescription"
        />
        <p v-else-if="!events?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          {{ eventsSeekingContent.empty }}
        </p>
        <EventsSeekingCard
          v-for="event in events"
          :key="event.id"
          :title="event.title"
          :description="`${CATEGORY_LABELS[event.category]} · ${CITY_LABELS[event.city]}`"
          :when-line="whenLine(event)"
          :needs-label="eventsSeekingContent.needsLabel"
          :needs-line="needsLine(event.openNeeds)"
          :support-cta="eventsSeekingContent.supportCta"
          :support-to="supportTo(event.id)"
        />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
