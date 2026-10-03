<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { formatBogotaDate } from '~~/shared/domain/rules'

useSeoMeta({
  title: 'Eventos',
  description: 'Eventos públicos con fecha y lugar en Pereira y Dosquebradas.',
})

const configured = useSupabaseConfigured()
const { data: events, status, error } = await useAsyncData('public-events', async () => {
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
</script>

<template>
  <UPage>
    <UPageHeader title="Eventos" description="Fichas públicas: ya tienen fecha concreta y lugar. La inscripción sigue en el enlace del organizador." />
    <UPageBody>
      <UContainer class="space-y-4">
        <div v-if="status === 'pending'" class="space-y-4" aria-busy="true" aria-live="polite">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
        <UAlert
          v-else-if="error"
          color="error"
          title="No se pudo cargar el listado"
          description="Vuelve a intentar en un momento."
        />
        <p v-else-if="!events?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          Todavía no hay eventos públicos.
        </p>
        <UPageCard
          v-for="event in events"
          :key="event.id"
          :title="event.title"
          :to="`/events/${event.slug}`"
          :description="`${CATEGORY_LABELS[event.category]} · ${CITY_LABELS[event.city]}`"
        >
          <p class="text-sm text-muted">
            {{ event.starts_on ? formatBogotaDate(event.starts_on) : 'Fecha por confirmar' }}
            <span v-if="event.place_name"> · {{ event.place_name }}</span>
          </p>
        </UPageCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
