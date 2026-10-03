<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import { mediaContent } from '~~/shared/content/media'
import type { PendingEvidenceRow } from '~~/shared/utils/moderation-evidence'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const props = defineProps<{
  row: PendingEvidenceRow
  pending: boolean
  notes: Record<string, string>
  supabaseUrl: string
}>()

defineEmits<{
  decide: [id: string, decision: 'approved' | 'rejected']
}>()

const mediaUrls = computed(() =>
  props.row.media
    .map((item) => publicStorageUrl(props.supabaseUrl, 'evidence', item.storage_path))
    .filter((url): url is string => Boolean(url)),
)

const attendanceLabel = computed(
  () => `${props.row.attendanceCount} ${appModerationContent.evidencePeople}`,
)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <h2 class="text-highlighted font-semibold">{{ row.title }}</h2>
        <UBadge color="neutral" variant="subtle" icon="i-lucide-users">
          {{ appModerationContent.evidenceAttendance }} · {{ attendanceLabel }}
        </UBadge>
      </div>
    </template>
    <div class="flex w-full min-w-0 flex-col gap-5">
      <ModerationEvidenceReport :venue-note="row.venueNote" :contributions-note="row.contributionsNote" />
      <div class="w-full min-w-0">
        <MediaVenueGallery v-if="mediaUrls.length" :urls="mediaUrls" :name="row.title" />
        <p v-else class="text-sm text-muted">{{ mediaContent.caseEmpty }}</p>
      </div>
      <ModerationEvidenceContext :needs="row.needs" :venue="row.venue" :local-sponsors="row.localSponsors" />
      <USeparator />
      <UFormField :label="appModerationContent.evidenceNote">
        <UTextarea v-model="notes[row.id]" class="w-full" />
      </UFormField>
      <div class="flex flex-wrap gap-2">
        <UButton :label="appModerationContent.approve" :loading="pending" @click="$emit('decide', row.id, 'approved')" />
        <UButton
          :label="appModerationContent.reject"
          color="neutral"
          variant="soft"
          :loading="pending"
          @click="$emit('decide', row.id, 'rejected')"
        />
      </div>
    </div>
  </UCard>
</template>
