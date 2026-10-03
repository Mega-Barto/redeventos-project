<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

defineProps<{
  rows: Array<{ id: string; target_type: string; target_id: string; reason: string }>
  pending: boolean
}>()

defineEmits<{
  hide: [type: string, id: string]
}>()
</script>

<template>
  <section class="space-y-3">
    <p v-if="!rows.length" class="text-muted" role="status">{{ appModerationContent.reportsEmpty }}</p>
    <UCard v-for="report in rows" :key="report.id" class="space-y-2">
      <p class="text-sm text-muted">{{ report.target_type }} · {{ report.target_id }}</p>
      <p>{{ report.reason }}</p>
      <UButton
        :label="appModerationContent.hide"
        color="neutral"
        variant="soft"
        :loading="pending"
        @click="$emit('hide', report.target_type, report.target_id)"
      />
    </UCard>
  </section>
</template>
