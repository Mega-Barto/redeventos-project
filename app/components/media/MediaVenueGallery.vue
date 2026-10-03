<script setup lang="ts">
import { mediaContent } from '~~/shared/content/media'

defineProps<{
  urls: string[]
  name: string
}>()
</script>

<template>
  <ul v-if="urls.length" class="grid w-full min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
    <li v-for="(url, index) in urls" :key="url">
      <MediaFigure :src="url" :alt="`${mediaContent.galleryLabel} ${index + 1} de ${name}`" />
    </li>
  </ul>
</template>
