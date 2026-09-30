<script setup lang="ts">
import { CITY_LABELS, SUPPORT_LABELS } from '~~/shared/constants/labels'

useSeoMeta({ title: 'Espacios', description: 'Espacios de la red en Pereira y Dosquebradas.' })

const configured = useSupabaseConfigured()
const { data: venues } = await useAsyncData('public-venues', async () => {
  if (!configured.value) return []
  const { data, error } = await useDb()
    .from('venues')
    .select('id, slug, name, city, zone, capacity, support_mode')
    .order('name')
  if (error) return []
  return data ?? []
})
</script>

<template>
  <UPage>
    <UPageHeader title="Espacios" description="Fichas estáticas. El calendario público solo marca días en negociación o comprometidos." />
    <UPageBody>
      <UContainer class="space-y-4">
        <p v-if="!venues?.length" class="text-muted" role="status">Todavía no hay espacios publicados.</p>
        <UPageCard
          v-for="venue in venues"
          :key="venue.id"
          :title="venue.name"
          :to="`/venues/${venue.slug}`"
          :description="`${CITY_LABELS[venue.city]} · ${venue.zone} · ${venue.capacity} personas`"
        >
          <p class="text-sm text-muted">{{ SUPPORT_LABELS[venue.support_mode] }}</p>
        </UPageCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
