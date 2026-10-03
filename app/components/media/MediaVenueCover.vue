<script setup lang="ts">
import { mediaContent } from '~~/shared/content/media'

defineProps<{
  src?: string | null
  name: string
  priority?: boolean
}>()
</script>

<template>
  <MediaFigure
    v-if="src"
    :src="src"
    :alt="`${mediaContent.coverAlt}: ${name}`"
    :priority="priority"
  />
</template>
