<script setup lang="ts">
defineProps<{
  urls: string[]
  title: string
}>()
</script>

<template>
  <MediaCaseGallery v-if="urls.length" :urls="urls" :title="title" />
</template>
