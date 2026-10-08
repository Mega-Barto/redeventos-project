<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationReportRow } from '~~/shared/utils/moderation-directory'

defineProps<{
  rows: ModerationReportRow[]
  pending: boolean
}>()

defineEmits<{
  hide: [type: string, id: string]
}>()
</script>

<template>
  <section class="space-y-3">
    <p v-if="!rows.length" class="text-muted" role="status">{{ appModerationContent.reportsEmpty }}</p>
    <ModerationReportCard
      v-for="report in rows"
      :key="report.id"
      :row="report"
      :pending="pending"
      @hide="(type, id) => $emit('hide', type, id)"
    />
  </section>
</template>
