<script setup lang="ts">
defineProps<{
  title: string
  description: string
  whenLine: string
  needsLabel: string
  needsLine: string
  supportCta: string
  supportTo: string
}>()
</script>

<template>
  <UPageCard :title="title" :description="description">
    <p class="text-sm text-muted">
      {{ whenLine }}
    </p>
    <p class="mt-2 text-sm">
      <span class="text-muted">{{ needsLabel }}:</span>
      {{ needsLine }}
    </p>
    <div class="mt-4">
      <UButton :to="supportTo" color="primary" variant="soft" size="sm">
        {{ supportCta }}
      </UButton>
    </div>
  </UPageCard>
</template>
