<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationProfileFicha } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  profileId: string
  showContributions?: boolean
}>()

const open = ref(false)
const pending = ref(false)
const error = ref<string | null>(null)
const ficha = ref<ModerationProfileFicha | null>(null)

watch(open, async (isOpen) => {
  if (!isOpen) return
  pending.value = true
  error.value = null
  const result = await loadModerationProfileFicha(props.profileId)
  pending.value = false
  ficha.value = result.ficha
  error.value = result.error
})
</script>

<template>
  <UModal v-model:open="open" :title="ficha?.displayName ?? appModerationContent.openProfile" scrollable :ui="{ content: 'sm:max-w-2xl' }">
    <UButton variant="soft" color="neutral" :label="appModerationContent.openProfile" />
    <template #body>
      <p v-if="pending" class="text-muted" role="status">{{ appModerationContent.fichaLoading }}</p>
      <UAlert v-else-if="error" color="error" variant="subtle" :title="error" />
      <ModerationProfileFicha v-else-if="ficha" :ficha="ficha" :show-contributions="showContributions" />
    </template>
  </UModal>
</template>
