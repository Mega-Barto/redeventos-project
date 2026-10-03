<script setup lang="ts">
import { mediaContent } from '~~/shared/content/media'

defineProps<{
  urls: string[]
  title: string
}>()
</script>

<template>
  <section v-if="urls.length" class="space-y-3">
    <h2 class="text-lg font-semibold">{{ mediaContent.caseGalleryTitle }}</h2>
    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <li v-for="(url, index) in urls" :key="url">
        <MediaFigure
          :src="url"
          :alt="`${mediaContent.evidenceAlt} ${index + 1} de ${title}`"
          :priority="index === 0"
        />
      </li>
    </ul>
  </section>
  <p v-else class="text-sm text-muted" role="status">{{ mediaContent.caseEmpty }}</p>
</template>
