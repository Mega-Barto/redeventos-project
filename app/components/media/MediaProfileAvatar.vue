<script setup lang="ts">
import { mediaContent } from '~~/shared/content/media'

defineProps<{
  src?: string | null
  name: string
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div v-if="src" :class="size === 'sm' ? 'w-12' : 'w-20'">
    <MediaFigure :src="src" :alt="`${mediaContent.avatarAlt} de ${name}`" ratio="square" />
  </div>
</template>
