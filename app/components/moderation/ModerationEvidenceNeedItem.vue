<script setup lang="ts">
import { EVIDENCE_NEED_STATUS_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import { type EvidenceNeed, evidenceNeedIcon, evidenceNeedTone, formatEvidenceCoverage } from '~~/shared/utils/moderation-evidence'

const props = defineProps<{
  need: EvidenceNeed
}>()

const tone = computed(() => evidenceNeedTone(props.need.status))
const coverage = computed(() => formatEvidenceCoverage(props.need, appModerationContent.evidenceCoverageOf))
const coverageMax = computed(() => Math.max(props.need.quantityRequested ?? 0, 1))
</script>

<template>
  <li class="rounded-lg bg-default p-3 ring ring-muted">
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-start gap-2">
        <UIcon :name="evidenceNeedIcon(need.type)" class="mt-0.5 size-4 shrink-0 text-muted" />
        <div class="min-w-0 space-y-0.5">
          <p class="font-medium text-highlighted">{{ NEED_LABELS[need.type] }}</p>
          <p class="text-sm text-muted">{{ need.description }}</p>
        </div>
      </div>
      <UBadge :color="tone" variant="subtle" class="shrink-0">{{ EVIDENCE_NEED_STATUS_LABELS[need.status] }}</UBadge>
    </div>
    <div v-if="coverage" class="mt-3 flex items-center gap-3">
      <UProgress :model-value="need.quantityCovered" :max="coverageMax" :color="tone" size="xs" class="min-w-0 flex-1" />
      <p class="shrink-0 text-xs text-muted">{{ coverage }}</p>
    </div>
    <div v-if="need.organizerNote" class="mt-3 space-y-1 border-t border-default pt-3">
      <p class="text-xs font-medium text-muted">{{ appModerationContent.evidenceOrganizerNote }}</p>
      <p class="text-sm text-default">{{ need.organizerNote }}</p>
    </div>
  </li>
</template>
