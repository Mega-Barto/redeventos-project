<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'

useSeoMeta({ title: 'Casos', description: 'Eventos realizados con evidencia aprobada.' })

const configured = useSupabaseConfigured()
const { data: cases } = await useAsyncData('public-cases', async () => {
  if (!configured.value) return []
  const { data, error } = await useDb().from('public_cases').select('id, slug, title, category, city, attendance_count')
  if (error) return []
  return data ?? []
})
</script>

<template>
  <UPage>
    <UPageHeader title="Casos" description="Eventos que ocurrieron y cuya evidencia aprobó el moderador." />
    <UPageBody>
      <UContainer class="space-y-4">
        <p v-if="!cases?.length" class="text-muted" role="status">Todavía no hay casos de éxito.</p>
        <UPageCard
          v-for="item in cases"
          :key="item.id"
          :title="item.title"
          :to="`/casos/${item.slug}`"
          :description="`${CATEGORY_LABELS[item.category]} · ${CITY_LABELS[item.city]} · ${item.attendance_count} asistentes`"
        />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
