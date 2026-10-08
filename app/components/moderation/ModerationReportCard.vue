<script setup lang="ts">
import type { EventStatus } from '~~/shared/constants/domain'
import { EVENT_STATUS_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationReportRow } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  row: ModerationReportRow
  pending: boolean
}>()

defineEmits<{
  hide: [type: string, id: string]
}>()

const typeLabel = computed(() =>
  props.row.targetType === 'event'
    ? appModerationContent.reportsTargetEvent
    : appModerationContent.reportsTargetProfile,
)

const detailLabel = computed(() => {
  if (!props.row.targetDetail) return null
  if (props.row.targetType !== 'event') return props.row.targetDetail
  const [slug, status] = props.row.targetDetail.split(' · ')
  const statusLabel =
    status && status in EVENT_STATUS_LABELS ? EVENT_STATUS_LABELS[status as EventStatus] : status
  return [slug, statusLabel].filter(Boolean).join(' · ')
})
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <UBadge color="warning" variant="subtle">{{ typeLabel }}</UBadge>
            <h3 class="font-medium text-highlighted">{{ row.targetTitle }}</h3>
          </div>
          <p v-if="detailLabel" class="text-sm text-muted">{{ detailLabel }}</p>
        </div>
      </div>
      <div class="space-y-1 rounded-lg bg-muted p-3">
        <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ appModerationContent.reportsReason }}</p>
        <p class="text-sm text-default">{{ row.reason }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UButton
          :label="appModerationContent.hide"
          color="neutral"
          variant="soft"
          :loading="pending"
          @click="$emit('hide', row.targetType, row.targetId)"
        />
        <p class="text-xs text-muted">{{ appModerationContent.reportsHideHint }}</p>
      </div>
    </div>
  </UCard>
</template>
