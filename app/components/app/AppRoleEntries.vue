<script setup lang="ts">
defineProps<{
  entries: Array<{ title: string; description: string; cta: string; to: string; icon: string }>
}>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <UCard v-for="entry in entries" :key="entry.to">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <UIcon :name="entry.icon" class="size-5" />
          <h2 class="font-semibold">{{ entry.title }}</h2>
        </div>
        <p class="text-sm text-muted">{{ entry.description }}</p>
        <UButton :to="entry.to" :label="entry.cta" />
      </div>
    </UCard>
  </div>
</template>
