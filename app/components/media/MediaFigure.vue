<script setup lang="ts">
import { mediaFigureAttrs } from '~~/shared/utils/public-media'

const props = defineProps<{
  src: string
  alt: string
  priority?: boolean
  ratio?: 'square' | 'video'
}>()

const attrs = computed(() => mediaFigureAttrs({ alt: props.alt, priority: props.priority }))
</script>

<template>
  <figure
    class="w-full overflow-hidden rounded-lg bg-elevated"
    :class="ratio === 'square' ? 'aspect-square' : 'aspect-video'"
  >
    <img
      :src="src"
      :alt="attrs.alt"
      :loading="attrs.loading"
      :fetchpriority="attrs.fetchpriority"
      :decoding="attrs.decoding"
      class="size-full object-cover"
    >
  </figure>
</template>
