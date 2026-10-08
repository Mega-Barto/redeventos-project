<script setup lang="ts">
import { eventPublicContent } from '~~/shared/content/event'

defineProps<{
  dateLabel: string
  placeName: string | null
  audience: string
  expectedAttendees: number
}>()
</script>

<template>
  <dl class="grid gap-4 text-sm sm:grid-cols-2">
    <div class="space-y-1">
      <dt class="text-muted">{{ eventPublicContent.dateLabel }}</dt>
      <dd class="font-medium text-highlighted">{{ dateLabel }}</dd>
    </div>
    <div class="space-y-1">
      <dt class="text-muted">{{ eventPublicContent.placeLabel }}</dt>
      <dd class="font-medium text-highlighted">{{ placeName }}</dd>
    </div>
    <div class="space-y-1">
      <dt class="text-muted">{{ eventPublicContent.audienceLabel }}</dt>
      <dd class="text-default">{{ audience }}</dd>
    </div>
    <div class="space-y-1">
      <dt class="text-muted">{{ eventPublicContent.attendeesLabel }}</dt>
      <dd class="font-medium text-highlighted">{{ expectedAttendees }}</dd>
    </div>
  </dl>
</template>
