<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="title">
        <template #right>
          <slot name="actions" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
        <p v-if="description" class="text-muted">{{ description }}</p>
        <slot />
      </div>
    </template>
  </UDashboardPanel>
</template>
