<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

defineProps<{
  venueNote: string
}>()
</script>

<template>
  <section class="space-y-2">
    <h3 class="text-xs font-medium uppercase tracking-wide text-muted">{{ appModerationContent.evidenceVenueNote }}</h3>
    <p class="rounded-lg bg-default p-3 text-sm text-default ring ring-muted">{{ venueNote }}</p>
  </section>
</template>
