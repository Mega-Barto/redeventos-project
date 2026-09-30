<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appOpportunitiesContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

const route = useRoute()
const eventId = computed(() => String(route.params.id))
const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')
const sent = ref(false)

const { data, refresh } = await useAsyncData(
  () => `opportunity-${eventId.value}`,
  async () => {
    const bundle = await loadEventBundle(eventId.value)
    if (!bundle) return null
    const viewer = userId.value ? await loadViewerMatchProfile(userId.value) : null
    return { ...bundle, viewer }
  },
  { watch: [eventId, userId] },
)

useSeoMeta({
  title: () => data.value?.event.title ?? appOpportunitiesContent.detailMissing,
  description: appOpportunitiesContent.offerDescription,
})

const openNeeds = computed(() => (data.value?.needs ?? []).filter((need) => need.status === 'open' || need.status === 'partial'))

async function propose(payload: {
  eventNeedId: string
  eventId: string
  recipientId: string
  venueId: string | null
  quantity: number
  offerOn: string
  note: string
}) {
  if (!userId.value) return
  pending.value = true
  errorMessage.value = ''
  sent.value = false
  const result = await sendOffer(userId.value, payload)
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  sent.value = true
  await refresh()
}
</script>

<template>
  <AppPanel :title="data?.event.title ?? appOpportunitiesContent.detailMissing" :description="appOpportunitiesContent.offerDescription">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="sent" color="success" variant="subtle" title="Propuesta enviada." />
    <p v-if="!data" class="text-muted" role="status">{{ appOpportunitiesContent.detailMissing }}</p>
    <template v-else>
      <p class="text-sm text-muted">
        {{ CATEGORY_LABELS[data.event.category] }} · {{ CITY_LABELS[data.event.city] }} ·
        {{ data.event.starts_on ?? data.event.date_range_label }}
      </p>
      <p>{{ data.event.audience }}</p>
      <p>{{ data.event.sponsor_benefit }}</p>
      <p v-if="data.organizer" class="text-sm">
        {{ data.organizer.display_name }}
        <span v-if="data.organizer.email"> · {{ data.organizer.email }}</span>
        <span v-if="data.organizer.instagram"> · {{ data.organizer.instagram }}</span>
        <span v-if="data.organizer.website"> · {{ data.organizer.website }}</span>
      </p>
      <section v-for="need in openNeeds" :key="need.id" class="space-y-3">
        <h2 class="font-medium">{{ NEED_LABELS[need.type] }}: {{ need.description }}</h2>
        <p class="text-sm text-muted">
          Faltan {{ Number(need.quantity_requested) - Number(need.quantity_covered) }} {{ need.unit }}
        </p>
        <OfferComposer
          v-if="userId && data.event.organizer_id !== userId"
          :event-id="data.event.id"
          :event-need-id="need.id"
          :candidates="[]"
          :fixed-recipient-id="data.event.organizer_id"
          :fixed-venue-id="need.type === 'venue' ? (data.viewer?.venueId ?? null) : null"
          :pending="pending"
          @submit="propose"
        />
      </section>
    </template>
  </AppPanel>
</template>
