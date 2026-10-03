<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { EvidenceNeed } from '~~/shared/utils/moderation-evidence'

defineProps<{
  needs: EvidenceNeed[]
}>()
</script>

<template>
  <p v-if="!needs.length" class="text-sm text-muted">{{ appModerationContent.evidenceNeedsEmpty }}</p>
  <ul v-else class="space-y-2">
    <ModerationEvidenceNeedItem v-for="need in needs" :key="need.id" :need="need" />
  </ul>
</template>
