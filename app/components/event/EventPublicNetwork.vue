<script setup lang="ts">
import { eventPublicContent } from '~~/shared/content/event'
import type { EventSupporter } from '~~/shared/utils/event-supporters'

const props = defineProps<{
  supporters: EventSupporter[]
  hasEvidence: boolean
  evidenceHref?: string | null
}>()

const venues = computed(() => props.supporters.filter((item) => item.partyKind === 'venue'))
const locals = computed(() => props.supporters.filter((item) => item.partyKind === 'local_sponsor'))
</script>

<template>
  <section class="space-y-5">
    <div class="space-y-1">
      <h2 class="text-lg font-semibold text-highlighted">{{ eventPublicContent.networkTitle }}</h2>
      <p class="text-sm text-muted">{{ eventPublicContent.networkDescription }}</p>
    </div>

    <div v-if="venues.length" class="space-y-2">
      <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
        {{ eventPublicContent.venueRole }}
      </h3>
      <ul class="space-y-3">
        <EventPublicSupporterChip
          v-for="supporter in venues"
          :key="`venue-${supporter.needId ?? supporter.partySlug}`"
          :supporter="supporter"
          :has-evidence="hasEvidence && supporter.supportStatus === 'confirmed'"
          :evidence-href="evidenceHref"
        />
      </ul>
    </div>

    <div v-if="locals.length" class="space-y-2">
      <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
        {{ eventPublicContent.localRole }}
      </h3>
      <ul class="space-y-3">
        <EventPublicSupporterChip
          v-for="supporter in locals"
          :key="`local-${supporter.needId ?? supporter.partySlug ?? supporter.needType}`"
          :supporter="supporter"
          :has-evidence="hasEvidence && supporter.supportStatus === 'confirmed'"
          :evidence-href="evidenceHref"
        />
      </ul>
    </div>
  </section>
</template>
