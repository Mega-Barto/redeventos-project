<script setup lang="ts">
import { mediaContent } from '~~/shared/content/media'

defineProps<{
  src?: string | null
  name: string
  kind: 'venue_sponsor' | 'local_sponsor'
  priority?: boolean
}>()
</script>

<template>
  <MediaFigure
    v-if="src"
    :src="src"
    :alt="`${kind === 'venue_sponsor' ? mediaContent.venueSponsorPhotoAlt : mediaContent.localSponsorPhotoAlt}: ${name}`"
    :priority="priority"
    ratio="video"
  />
</template>
