<script setup lang="ts">
import type { Candidate } from '~/composables/usePilot'
import { NEED_LABELS, NEED_STATUS_LABELS } from '~~/shared/constants/labels'
import { appEventDetailContent } from '~~/shared/content/app'
import type { EvidenceInput } from '~~/shared/schemas/inputs'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

const route = useRoute()
const eventId = computed(() => String(route.params.id))
const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')
const candidates = ref<Record<string, Candidate[]>>({})

const { data, refresh } = await useAsyncData(
  () => `app-event-${eventId.value}`,
  () => loadEventBundle(eventId.value),
  { watch: [eventId] },
)

useSeoMeta({
  title: () => data.value?.event.title ?? appEventDetailContent.missing,
  description: appEventDetailContent.makePublicDescription,
})

const supabaseUrl = useSupabaseUrl()
const isOwner = computed(() => data.value?.event.organizer_id === userId.value)
const publicTo = computed(() => {
  if (!data.value) return null
  if (data.value.event.status === 'completed') return `/cases/${data.value.event.slug}`
  if (data.value.event.status === 'public') return `/events/${data.value.event.slug}`
  return null
})
const canSendEvidence = computed(
  () =>
    isOwner.value &&
    data.value?.event.status === 'public' &&
    (!data.value.evidence || data.value.evidence.status === 'rejected'),
)
const evidencePending = computed(
  () => isOwner.value && data.value?.event.status === 'public' && data.value.evidence?.status === 'submitted',
)
const evidenceUrls = computed(() =>
  (data.value?.media ?? [])
    .map((item) => publicStorageUrl(supabaseUrl.value, 'evidence', item.storage_path))
    .filter((url): url is string => Boolean(url)),
)

watch(
  data,
  async (bundle) => {
    if (!bundle || !userId.value || bundle.event.organizer_id !== userId.value) return
    const next: Record<string, Candidate[]> = {}
    for (const need of bundle.needs) {
      if (need.status !== 'open' && need.status !== 'partial') continue
      next[need.id] = await loadCandidates({
        needType: need.type,
        city: bundle.event.city,
        expectedAttendees: bundle.event.expected_attendees,
        viewerId: userId.value,
      })
    }
    candidates.value = next
  },
  { immediate: true },
)

async function run(action: () => Promise<{ error: string | null }>) {
  pending.value = true
  errorMessage.value = ''
  const result = await action()
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  await refresh()
}

function publish() {
  return run(() => publishEvent(eventId.value))
}

function cancel() {
  return run(() => cancelEvent(eventId.value))
}

function makePublic(payload: { startsOn: string; placeName: string; venueId: string | null }) {
  return run(() => makeEventPublic(eventId.value, payload))
}

function sendEvidence(payload: EvidenceInput, files: File[]) {
  if (!userId.value) return
  return run(() => submitEvidence(eventId.value, userId.value as string, payload, files))
}

function propose(payload: {
  eventNeedId: string
  eventId: string
  recipientId: string
  venueId: string | null
  quantity: number
  offerOn: string
  note: string
}) {
  if (!userId.value) return
  return run(() => sendOffer(userId.value as string, payload))
}
</script>

<template>
  <AppPanel :title="data?.event.title ?? appEventDetailContent.missing">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <p v-if="!data" class="text-muted" role="status">{{ appEventDetailContent.missing }}</p>
    <template v-else>
      <EventStatusActions
        v-if="isOwner"
        :status="data.event.status"
        :public-to="publicTo"
        :pending="pending"
        @publish="publish"
        @cancel="cancel"
      />
      <UButton v-else-if="publicTo" :to="publicTo" :label="appEventDetailContent.publicLink" color="neutral" variant="outline" />
      <section v-for="need in data.needs" :key="need.id" class="space-y-3 rounded-lg border border-muted p-4">
        <h2 class="font-medium">{{ NEED_LABELS[need.type] }} · {{ NEED_STATUS_LABELS[need.status] }}</h2>
        <p>{{ need.description }}</p>
        <p v-if="need.quantity_requested != null && need.unit" class="text-sm text-muted">
          {{ need.quantity_covered }} / {{ need.quantity_requested }} {{ need.unit }}
        </p>
        <div v-if="isOwner && (need.status === 'open' || need.status === 'partial')">
          <h3 class="mb-2 text-sm font-medium">{{ appEventDetailContent.offerTitle }}</h3>
          <OfferComposer
            :event-id="data.event.id"
            :event-need-id="need.id"
            :candidates="candidates[need.id] ?? []"
            :pending="pending"
            @submit="propose"
          />
        </div>
      </section>
      <section v-if="isOwner && data.event.status === 'published'" class="space-y-3">
        <h2 class="font-semibold">{{ appEventDetailContent.makePublicTitle }}</h2>
        <p class="text-sm text-muted">{{ appEventDetailContent.makePublicDescription }}</p>
        <EventPublicForm :pending="pending" @submit="makePublic" />
      </section>
      <section v-if="canSendEvidence" class="space-y-3">
        <h2 class="font-semibold">{{ appEventDetailContent.evidenceTitle }}</h2>
        <p class="text-sm text-muted">{{ appEventDetailContent.evidenceDescription }}</p>
        <AppEventEvidenceForm
          :needs="data.needs"
          :pending="pending"
          :existing-urls="evidenceUrls"
          @submit="sendEvidence"
        />
      </section>
      <p v-else-if="evidencePending" class="text-muted" role="status">La evidencia está en revisión.</p>
    </template>
  </AppPanel>
</template>
