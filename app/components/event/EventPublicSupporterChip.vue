<script setup lang="ts">
import { NEED_LABELS } from '~~/shared/constants/labels'
import { eventPublicContent } from '~~/shared/content/event'
import {
  type EventSupporter,
  supportStatusTone,
} from '~~/shared/utils/event-supporters'

const props = defineProps<{
  supporter: EventSupporter
  hasEvidence: boolean
  evidenceHref?: string | null
}>()

const displayName = computed(
  () => props.supporter.partyName ?? eventPublicContent.seekingLabel,
)

const statusLabel = computed(() => eventPublicContent.status[props.supporter.supportStatus])
const tone = computed(() => supportStatusTone(props.supporter.supportStatus))

const metaLabel = computed(() => {
  if (props.supporter.partyKind === 'venue') return props.supporter.needDescription
  return `${NEED_LABELS[props.supporter.needType]} · ${props.supporter.needDescription}`
})
</script>

<template>
  <li class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
    <div class="min-w-0 space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <ULink
          v-if="supporter.partyHref"
          :to="supporter.partyHref"
          class="font-medium text-highlighted hover:text-primary"
        >
          {{ displayName }}
        </ULink>
        <span v-else class="font-medium text-highlighted">{{ displayName }}</span>
        <UBadge :color="tone" variant="subtle" size="sm">{{ statusLabel }}</UBadge>
        <UButton
          v-if="hasEvidence && evidenceHref"
          :to="evidenceHref"
          :label="eventPublicContent.evidenceLinkLabel"
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-images"
        />
      </div>
      <p class="text-sm text-muted">{{ metaLabel }}</p>
    </div>
  </li>
</template>
