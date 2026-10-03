<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

defineProps<{
  hidden: boolean
  disaffiliated?: boolean
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UBadge v-if="hidden" color="neutral" variant="subtle">{{ appModerationContent.hiddenBadge }}</UBadge>
    <UBadge v-if="disaffiliated" color="error" variant="subtle">{{ appModerationContent.disaffiliatedBadge }}</UBadge>
  </div>
</template>
