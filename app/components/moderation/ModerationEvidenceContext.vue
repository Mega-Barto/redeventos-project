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
  <UCollapsible class="w-full min-w-0 overflow-hidden rounded-lg bg-muted">
    <UButton
      class="group w-full justify-between px-4 py-3"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      :label="appModerationContent.evidenceContext"
      :ui="{ trailingIcon: 'transition-transform duration-200 group-data-[state=open]:rotate-180' }"
    />
    <template #content>
      <div class="flex w-full min-w-0 flex-col gap-4 border-t border-default px-4 py-4">
        <section class="space-y-2">
          <h3 class="text-xs font-medium uppercase tracking-wide text-muted">{{ appModerationContent.evidenceNeeds }}</h3>
          <ModerationEvidenceNeedList :needs="needs" />
        </section>
        <ModerationEvidenceParties :venue="venue" :local-sponsors="localSponsors" />
      </div>
    </template>
  </UCollapsible>
</template>
