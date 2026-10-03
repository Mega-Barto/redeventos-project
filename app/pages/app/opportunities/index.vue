<script setup lang="ts">
import { CITIES, EVENT_CATEGORIES, NEED_TYPES } from '~~/shared/constants/domain'
import { CATEGORY_LABELS, CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appOpportunitiesContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appOpportunitiesContent.title, description: appOpportunitiesContent.description })

const userId = useUserId()
const nuxtApp = useNuxtApp()
const city = ref('all')
const category = ref('all')
const needType = ref('all')

const { data } = await useAsyncData(
  'opportunities',
  async () => {
    if (!userId.value) return { items: [], roles: [] as string[], error: null as string | null }
    const viewer = await loadViewerMatchProfile(userId.value)
    const list = await nuxtApp.runWithContext(() => listOpportunities(viewer))
    return { ...list, roles: viewer.roles }
  },
  { watch: [userId] },
)

const allowed = computed(
  () => data.value?.roles.includes('venue_sponsor') || data.value?.roles.includes('local_sponsor') || false,
)

const items = computed(() =>
  (data.value?.items ?? []).filter((item) => {
    if (city.value !== 'all' && item.city !== city.value) return false
    if (category.value !== 'all' && item.category !== category.value) return false
    if (needType.value !== 'all' && item.need.type !== needType.value) return false
    return true
  }),
)

const cityItems = [{ label: 'Todas', value: 'all' }, ...CITIES.map((item) => ({ label: CITY_LABELS[item], value: item }))]
const categoryItems = [
  { label: 'Todas', value: 'all' },
  ...EVENT_CATEGORIES.map((item) => ({ label: CATEGORY_LABELS[item], value: item })),
]
const needItems = [{ label: 'Todas', value: 'all' }, ...NEED_TYPES.map((item) => ({ label: NEED_LABELS[item], value: item }))]
</script>

<template>
  <AppPanel :title="appOpportunitiesContent.title" :description="appOpportunitiesContent.description">
    <UAlert v-if="data?.error" color="error" variant="subtle" :title="data.error" />
    <p v-else-if="data && !allowed" class="text-muted" role="status">{{ appOpportunitiesContent.needRole }}</p>
    <template v-else>
      <div class="grid gap-3 md:grid-cols-3">
        <UFormField label="Ciudad">
          <USelect v-model="city" :items="cityItems" class="w-full" />
        </UFormField>
        <UFormField label="Categoría">
          <USelect v-model="category" :items="categoryItems" class="w-full" />
        </UFormField>
        <UFormField label="Necesidad">
          <USelect v-model="needType" :items="needItems" class="w-full" />
        </UFormField>
      </div>
      <p v-if="!items.length" class="text-muted" role="status">{{ appOpportunitiesContent.empty }}</p>
      <div v-else class="space-y-3">
        <UCard v-for="item in items" :key="item.need.id">
          <NuxtLink :to="`/app/opportunities/${item.eventId}`" class="font-medium">{{ item.title }}</NuxtLink>
          <p class="text-sm text-muted">
            {{ CATEGORY_LABELS[item.category] }} · {{ CITY_LABELS[item.city] }} · {{ item.whenLabel }}
          </p>
          <p class="text-sm">{{ NEED_LABELS[item.need.type] }}: {{ item.need.description }}</p>
          <p class="text-sm text-muted">{{ item.organizerName }} · {{ item.expectedAttendees }} asistentes esperados</p>
        </UCard>
      </div>
    </template>
  </AppPanel>
</template>
