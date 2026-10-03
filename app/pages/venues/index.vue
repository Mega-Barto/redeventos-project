<script setup lang="ts">
import { CITY_LABELS, SUPPORT_LABELS } from '~~/shared/constants/labels'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

useSeoMeta({ title: 'Espacios', description: 'Espacios de la red en Pereira y Dosquebradas.' })

const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()
const { data: venues, status, error } = await useAsyncData('public-venues', async () => {
  if (!configured.value) return []
  const { data, error: queryError } = await useDb()
    .from('venues')
    .select('id, slug, name, city, zone, capacity, support_mode, cover_storage_path')
    .order('name')
  if (queryError) throw queryError
  return data ?? []
})
</script>

<template>
  <UPage>
    <UPageHeader title="Espacios" description="Fichas estáticas. El calendario público solo marca días en negociación o comprometidos." />
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
        <p v-else-if="!venues?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          Todavía no hay espacios publicados.
        </p>
        <UPageCard
          v-for="venue in venues"
          :key="venue.id"
          :title="venue.name"
          :to="`/venues/${venue.slug}`"
          :description="`${CITY_LABELS[venue.city]} · ${venue.zone} · ${venue.capacity} personas`"
        >
          <MediaVenueCover
            :src="publicStorageUrl(supabaseUrl, 'venues', venue.cover_storage_path)"
            :name="venue.name"
          />
          <p class="text-sm text-muted">{{ SUPPORT_LABELS[venue.support_mode] }}</p>
        </UPageCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
