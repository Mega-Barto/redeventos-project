<script setup lang="ts">
defineProps<{
  title: string
  to: string
  description: string
  whenLine: string
}>()
</script>

<template>
  <UPageCard :title="title" :to="to" :description="description">
    <p class="text-sm text-muted">
      {{ whenLine }}
    </p>
  </UPageCard>
</template>
