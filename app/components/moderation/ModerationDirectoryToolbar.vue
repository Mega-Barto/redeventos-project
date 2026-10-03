<script setup lang="ts">
const query = defineModel<string>('query', { required: true })

defineProps<{
  searchLabel: string
}>()
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:flex-wrap">
    <UInput
      v-model="query"
      icon="i-lucide-search"
      :aria-label="searchLabel"
      :placeholder="searchLabel"
      class="md:min-w-72"
    />
    <slot />
  </div>
</template>
