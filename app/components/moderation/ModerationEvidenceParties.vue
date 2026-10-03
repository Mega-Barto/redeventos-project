<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { EvidenceParty } from '~~/shared/utils/moderation-evidence'

defineProps<{
  venue: EvidenceParty | null
  localSponsors: EvidenceParty[]
}>()
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2">
    <section class="rounded-lg bg-default p-3 ring ring-muted">
      <h4 class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        <UIcon name="i-lucide-building" class="size-3.5" />
        {{ appModerationContent.evidenceVenue }}
      </h4>
      <p v-if="!venue" class="mt-2 text-sm text-muted">{{ appModerationContent.evidenceVenueEmpty }}</p>
      <div v-else class="mt-2 space-y-1">
        <p class="font-medium text-highlighted">{{ venue.name }}</p>
        <p v-if="venue.detail" class="text-sm text-muted">{{ appModerationContent.evidenceVenueSponsor }} · {{ venue.detail }}</p>
      </div>
    </section>
    <section class="rounded-lg bg-default p-3 ring ring-muted">
      <h4 class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        <UIcon name="i-lucide-store" class="size-3.5" />
        {{ appModerationContent.evidenceSponsors }}
      </h4>
      <p v-if="!localSponsors.length" class="mt-2 text-sm text-muted">{{ appModerationContent.evidenceSponsorsEmpty }}</p>
      <ul v-else class="mt-2 space-y-1">
        <li v-for="sponsor in localSponsors" :key="sponsor.id" class="text-sm">
          <p class="font-medium text-highlighted">{{ sponsor.name }}</p>
          <p v-if="sponsor.detail" class="text-muted">{{ sponsor.detail }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
