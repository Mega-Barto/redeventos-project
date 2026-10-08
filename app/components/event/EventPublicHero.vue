<script setup lang="ts">
defineProps<{
  categoryLabel: string
  cityLabel: string
  title: string
  description: string
}>()
</script>

<template>
  <header class="space-y-3">
    <p class="text-sm text-muted">{{ categoryLabel }} · {{ cityLabel }}</p>
    <h1 class="text-3xl font-semibold text-highlighted">{{ title }}</h1>
    <p class="text-default">{{ description }}</p>
  </header>
</template>
