<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationEventFicha } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  eventId: string
}>()

const open = ref(false)
const pending = ref(false)
const error = ref<string | null>(null)
const ficha = ref<ModerationEventFicha | null>(null)

watch(open, async (isOpen) => {
  if (!isOpen) return
  pending.value = true
  error.value = null
  const result = await loadModerationEventFicha(props.eventId)
  pending.value = false
  ficha.value = result.ficha
  error.value = result.error
})
</script>

<template>
  <UModal v-model:open="open" :title="ficha?.title ?? appModerationContent.openEvent" scrollable :ui="{ content: 'sm:max-w-2xl' }">
    <UButton variant="soft" color="neutral" :label="appModerationContent.openEvent" />
    <template #body>
      <p v-if="pending" class="text-muted" role="status">{{ appModerationContent.fichaLoading }}</p>
      <UAlert v-else-if="error" color="error" variant="subtle" :title="error" />
      <ModerationEventFicha v-else-if="ficha" :ficha="ficha" />
    </template>
  </UModal>
</template>
