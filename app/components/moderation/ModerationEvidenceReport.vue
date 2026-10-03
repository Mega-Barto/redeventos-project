<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

defineProps<{
  venueNote: string
  contributionsNote: string
}>()
</script>

<template>
  <section class="space-y-3">
    <h3 class="text-xs font-medium uppercase tracking-wide text-muted">{{ appModerationContent.evidenceReport }}</h3>
    <dl class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-lg bg-muted p-3">
        <dt class="text-xs text-muted">{{ appModerationContent.evidenceVenueNote }}</dt>
        <dd class="mt-1 text-sm text-default">{{ venueNote }}</dd>
      </div>
      <div class="rounded-lg bg-muted p-3">
        <dt class="text-xs text-muted">{{ appModerationContent.evidenceContributionsNote }}</dt>
        <dd class="mt-1 text-sm text-default">{{ contributionsNote }}</dd>
      </div>
    </dl>
  </section>
</template>
