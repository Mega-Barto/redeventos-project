<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { EvidenceNeed, EvidenceParty } from '~~/shared/utils/moderation-evidence'

defineProps<{
  needs: EvidenceNeed[]
  venue: EvidenceParty | null
  localSponsors: EvidenceParty[]
}>()
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-4">
    <section class="space-y-2">
      <h3 class="text-xs font-medium uppercase tracking-wide text-muted">{{ appModerationContent.evidenceNeeds }}</h3>
      <ModerationEvidenceNeedList :needs="needs" />
    </section>
    <ModerationEvidenceParties :venue="venue" :local-sponsors="localSponsors" />
  </div>
</template>
