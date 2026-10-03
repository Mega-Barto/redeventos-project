<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

useSeoMeta({ title: 'Casos', description: 'Eventos realizados con evidencia aprobada.' })

const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()
const { data: cases, status, error } = await useAsyncData('public-cases', async () => {
  if (!configured.value) return []
  const { data, error: queryError } = await useDb()
    .from('public_cases')
    .select('id, slug, title, category, city, attendance_count, cover_path')
  if (queryError) throw queryError
  return data ?? []
})

function coverOf(path: string | null) {
  return publicStorageUrl(supabaseUrl.value, 'evidence', path)
}
</script>

<template>
  <UPage>
    <UPageHeader title="Casos" description="Eventos que ocurrieron y cuya evidencia aprobó el moderador." />
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
        <p v-else-if="!cases?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          Todavía no hay casos de éxito.
        </p>
        <UPageCard
          v-for="item in cases"
          :key="item.id ?? item.slug ?? ''"
          :title="item.title ?? 'Caso'"
          :to="`/cases/${item.slug ?? ''}`"
          :description="`${item.category ? CATEGORY_LABELS[item.category] : ''} · ${item.city ? CITY_LABELS[item.city] : ''} · ${item.attendance_count} asistentes`"
        >
          <MediaFigure v-if="coverOf(item.cover_path)" :src="coverOf(item.cover_path) ?? ''" :alt="item.title ?? 'Caso'" />
        </UPageCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
