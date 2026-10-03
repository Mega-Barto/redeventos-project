<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS, EVENT_STATUS_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import { formatBogotaDate } from '~~/shared/domain/rules'
import type { ModerationEventRow } from '~~/shared/utils/moderation-directory'

defineProps<{
  row: ModerationEventRow
}>()

defineEmits<{
  hide: [id: string]
}>()
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div class="space-y-1">
        <p class="font-medium">{{ row.title }}</p>
        <p class="text-sm text-muted">
          {{ EVENT_STATUS_LABELS[row.status] }} · {{ CATEGORY_LABELS[row.category] }} · {{ CITY_LABELS[row.city] }}
        </p>
        <p class="text-sm text-muted">{{ row.organizerName }}</p>
        <p v-if="row.startsOn" class="text-sm text-muted">{{ formatBogotaDate(row.startsOn) }}</p>
        <ModerationStatusBadges :hidden="row.hidden" />
      </div>
      <div class="flex flex-wrap gap-2">
        <ModerationEventFichaModal :event-id="row.id" />
        <UButton
          v-if="!row.hidden"
          :label="appModerationContent.hide"
          color="neutral"
          variant="soft"
          @click="$emit('hide', row.id)"
        />
      </div>
    </div>
  </UCard>
</template>
