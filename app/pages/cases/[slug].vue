<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { formatBogotaDate } from '~~/shared/domain/rules'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()

const { data: item } = await useAsyncData(
  () => `case-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const { data } = await useDb().from('public_cases').select('*').eq('slug', slug.value).maybeSingle()
    return data
  },
  { watch: [slug] },
)

useSeoMeta({
  title: () => item.value?.title ?? 'Caso',
  description: () => item.value?.contributions_note ?? 'Caso de éxito de Redeventos',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="max-w-3xl space-y-4">
        <h1 v-if="!item" class="text-2xl font-semibold">Caso no encontrado</h1>
        <template v-else>
          <p class="text-sm text-muted">{{ CATEGORY_LABELS[item.category] }} · {{ CITY_LABELS[item.city] }}</p>
          <h1 class="text-3xl font-semibold">{{ item.title }}</h1>
          <p v-if="item.starts_on">{{ formatBogotaDate(item.starts_on) }}<span v-if="item.place_name"> · {{ item.place_name }}</span></p>
          <p>Asistieron {{ item.attendance_count }} personas, según la evidencia aprobada.</p>
          <section>
            <h2 class="text-lg font-semibold">Espacio</h2>
            <p>{{ item.venue_note }}</p>
          </section>
          <section>
            <h2 class="text-lg font-semibold">Aportes</h2>
            <p>{{ item.contributions_note }}</p>
          </section>
          <p class="text-sm text-muted">Audiencia: {{ item.audience }}. A cambio, el evento ofreció: {{ item.sponsor_benefit }}.</p>
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
