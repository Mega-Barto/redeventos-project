<script setup lang="ts">
import type { NeedType } from '~~/shared/constants/domain'
import { NEED_LABELS } from '~~/shared/constants/labels'
import { appEventDetailContent } from '~~/shared/content/app'

export type EvidenceNeedField = {
  id: string
  type: NeedType
  description: string
}

const props = defineProps<{
  needs: EvidenceNeedField[]
}>()

const notes = defineModel<Record<string, string>>({ required: true })

watch(
  () => props.needs.map((need) => need.id).join(','),
  () => {
    const next: Record<string, string> = {}
    for (const need of props.needs) {
      next[need.id] = notes.value[need.id] ?? ''
    }
    notes.value = next
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm font-medium">{{ appEventDetailContent.evidenceContributionsHeading }}</p>
    <p v-if="!needs.length" class="text-sm text-muted">{{ appEventDetailContent.evidenceContributionEmpty }}</p>
    <UFormField
      v-for="(need, index) in needs"
      :key="need.id"
      :name="`contributionNotes.${index}.note`"
      :label="`${NEED_LABELS[need.type]} · ${need.description}`"
      :hint="appEventDetailContent.evidenceContributionLabel"
      required
    >
      <UTextarea v-model="notes[need.id]" class="w-full" :rows="2" />
    </UFormField>
  </div>
</template>
