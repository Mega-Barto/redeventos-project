<script setup lang="ts">
import { eventPublicContent } from '~~/shared/content/event'
import type { EventSupporter } from '~~/shared/utils/event-supporters'
import EventPublicSupportCta from './EventPublicSupportCta.vue'
import EventPublicSupporter from './EventPublicSupporter.vue'

const props = defineProps<{
  supporters: EventSupporter[]
  eventId: string
  showSupportCta: boolean
  hasEvidence: boolean
  evidenceHref?: string | null
}>()

const venues = computed(() => props.supporters.filter((item) => item.partyKind === 'venue'))
const locals = computed(() => props.supporters.filter((item) => item.partyKind === 'local_sponsor'))
const hasConfirmed = computed(() => venues.value.length > 0 || locals.value.length > 0)
</script>

<template>
  <section class="space-y-5">
    <div class="space-y-1">
      <h2 class="text-lg font-semibold text-highlighted">{{ eventPublicContent.networkTitle }}</h2>
      <p class="text-sm text-muted">{{ eventPublicContent.networkDescription }}</p>
    </div>

    <p v-if="!hasConfirmed" class="text-sm text-muted" role="status">
      {{ eventPublicContent.networkEmpty }}
    </p>

    <div v-if="venues.length" class="space-y-2">
      <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
        {{ eventPublicContent.venueRole }}
      </h3>
      <ul class="space-y-2">
        <EventPublicSupporter
          v-for="supporter in venues"
          :key="`venue-${supporter.partySlug ?? supporter.partyName}`"
          :supporter="supporter"
        />
      </ul>
    </div>

    <div v-if="locals.length" class="space-y-2">
      <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
        {{ eventPublicContent.localRole }}
      </h3>
      <ul class="space-y-2">
        <EventPublicSupporter
          v-for="supporter in locals"
          :key="`local-${supporter.partySlug ?? supporter.partyName}`"
          :supporter="supporter"
        />
      </ul>
    </div>

    <UButton
      v-if="hasEvidence && evidenceHref"
      :to="evidenceHref"
      :label="eventPublicContent.evidenceLinkLabel"
      color="neutral"
      variant="ghost"
      size="xs"
      icon="i-lucide-images"
    />

    <EventPublicSupportCta v-if="showSupportCta" :event-id="eventId" />
  </section>
</template>
