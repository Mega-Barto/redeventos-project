<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { agendaContent } from '~~/shared/content/agenda'
import { formatBogotaDate } from '~~/shared/domain/rules'

useSeoMeta({
  title: agendaContent.title,
  description: agendaContent.seoDescription,
})

const configured = useSupabaseConfigured()
const { data: events, status, error } = await useAsyncData('agenda-events', async () => {
  if (!configured.value) return []
  const { data, error: queryError } = await useDb()
    .from('events')
    .select('id, slug, title, category, city, starts_on, place_name')
    .eq('status', 'public')
    .is('hidden_at', null)
    .order('starts_on', { ascending: true })
  if (queryError) throw queryError
  return data ?? []
})

function whenLine(event: { starts_on: string | null; place_name: string | null }) {
  const date = event.starts_on ? formatBogotaDate(event.starts_on) : 'Fecha por confirmar'
  return event.place_name ? `${date} · ${event.place_name}` : date
}
</script>

<template>
  <UPage>
    <UPageHeader :title="agendaContent.title" :description="agendaContent.description" />
    <UPageBody>
      <UContainer class="space-y-4">
        <p class="text-sm text-muted">
          {{ agendaContent.seekingHint }}
          <NuxtLink :to="agendaContent.seekingTo" class="text-primary underline-offset-2 hover:underline">
            {{ agendaContent.seekingCta }}
          </NuxtLink>
        </p>
        <div v-if="status === 'pending'" class="space-y-4" aria-busy="true" aria-live="polite">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
        <UAlert
          v-else-if="error"
          color="error"
          :title="agendaContent.loadErrorTitle"
          :description="agendaContent.loadErrorDescription"
        />
        <p v-else-if="!events?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          {{ agendaContent.empty }}
        </p>
        <AgendaEventCard
          v-for="event in events"
          :key="event.id"
          :title="event.title"
          :to="`/events/${event.slug}`"
          :description="`${CATEGORY_LABELS[event.category]} · ${CITY_LABELS[event.city]}`"
          :when-line="whenLine(event)"
        />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
