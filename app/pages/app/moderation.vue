<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding', 'moderator'] })

useSeoMeta({ title: appModerationContent.title, description: appModerationContent.description })

const supabaseUrl = useSupabaseUrl()
const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')
const notes = reactive<Record<string, string>>({})
const tab = ref('organizers')

const { data, refresh } = await useAsyncData('moderation', async () => {
  const [organizers, sponsors, events, evidence, reports] = await Promise.all([
    listModerationProfiles('organizer'),
    listModerationSponsors(),
    listModerationEvents(),
    listPendingEvidence(),
    listOpenReports(),
  ])
  return { organizers, sponsors, events, evidence, reports }
})

const tabs = computed(() => [
  { label: appModerationContent.tabs.organizers, value: 'organizers', slot: 'organizers' as const },
  { label: appModerationContent.tabs.events, value: 'events', slot: 'events' as const },
  { label: appModerationContent.tabs.sponsors, value: 'sponsors', slot: 'sponsors' as const },
  { label: appModerationContent.tabs.evidence, value: 'evidence', slot: 'evidence' as const },
  { label: appModerationContent.tabs.reports, value: 'reports', slot: 'reports' as const },
])

const listError = computed(
  () =>
    data.value?.organizers.error ||
    data.value?.sponsors.error ||
    data.value?.events.error ||
    data.value?.evidence.error ||
    data.value?.reports.error ||
    '',
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

function hideProfile(id: string) {
  return run(() => hideReportTarget('profile', id))
}

function hideEvent(id: string) {
  return run(() => hideReportTarget('event', id))
}

function decide(id: string, decision: 'approved' | 'rejected') {
  return run(() => reviewEvidence({ evidenceId: id, decision, note: notes[id] ?? '' }))
}
</script>

<template>
  <AppPanel :title="appModerationContent.title" :description="appModerationContent.description">
    <UAlert v-if="errorMessage || listError" color="error" variant="subtle" :title="errorMessage || listError" />
    <UTabs v-model="tab" variant="link" :items="tabs" class="w-full">
      <template #organizers>
        <ModerationProfileDirectory
          :rows="data?.organizers.rows ?? []"
          :empty="appModerationContent.organizersEmpty"
          :self-id="userId"
          @hide="hideProfile"
          @disaffiliate="(id) => run(() => disaffiliate({ profileId: id }))"
        />
      </template>
      <template #events>
        <ModerationEventDirectory :rows="data?.events.rows ?? []" @hide="hideEvent" />
      </template>
      <template #sponsors>
        <ModerationProfileDirectory
          :rows="data?.sponsors.rows ?? []"
          :empty="appModerationContent.sponsorsEmpty"
          :self-id="userId"
          show-contributions
          show-sponsor-kind-filter
          @hide="hideProfile"
          @disaffiliate="(id) => run(() => disaffiliate({ profileId: id }))"
        />
      </template>
      <template #evidence>
        <ModerationEvidenceQueue
          :rows="data?.evidence.rows ?? []"
          :pending="pending"
          :notes="notes"
          :supabase-url="supabaseUrl"
          @decide="decide"
        />
      </template>
      <template #reports>
        <ModerationReportsQueue
          :rows="data?.reports.rows ?? []"
          :pending="pending"
          @hide="(type, id) => run(() => hideReportTarget(type, id))"
        />
      </template>
    </UTabs>
  </AppPanel>
</template>
