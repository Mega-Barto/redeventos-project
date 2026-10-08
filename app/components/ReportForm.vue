<script setup lang="ts">
import { reportContent } from '~~/shared/content/report'
import { reportSchema } from '~~/shared/schemas/inputs'

const props = defineProps<{
  targetType: 'event' | 'profile'
  targetId: string
}>()

const open = ref(false)
const reason = ref('')
const message = ref('')
const pending = ref(false)

watch(open, (isOpen) => {
  if (isOpen) return
  message.value = ''
})

async function submit() {
  const userId = useUserId().value
  if (!userId) {
    open.value = false
    await navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`)
    return
  }
  const parsed = reportSchema.safeParse({
    targetType: props.targetType,
    targetId: props.targetId,
    reason: reason.value,
  })
  if (!parsed.success) {
    message.value = parsed.error.issues[0]?.message ?? reportContent.validationFallback
    return
  }
  pending.value = true
  const { error } = await useDb().from('reports').insert({
    reporter_id: userId,
    target_type: parsed.data.targetType,
    target_id: parsed.data.targetId,
    reason: parsed.data.reason,
  })
  pending.value = false
  if (error) {
    message.value = error.message
    return
  }
  message.value = reportContent.success
  reason.value = ''
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="reportContent.title"
    :description="reportContent.description"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton
      :label="reportContent.triggerLabel"
      :aria-label="reportContent.triggerAriaLabel"
      color="neutral"
      variant="ghost"
      size="sm"
      icon="i-lucide-circle-alert"
    />
    <template #body>
      <form id="report-form" class="space-y-3" @submit.prevent="submit">
        <UFormField :label="reportContent.reasonLabel" name="reason">
          <UTextarea v-model="reason" :placeholder="reportContent.placeholder" class="w-full" autoresize :rows="4" />
        </UFormField>
        <p v-if="message" class="text-sm text-muted" role="status">{{ message }}</p>
      </form>
    </template>
    <template #footer="{ close }">
      <UButton color="neutral" variant="outline" :label="reportContent.cancelLabel" @click="close()" />
      <UButton
        type="submit"
        form="report-form"
        :label="reportContent.submitLabel"
        color="neutral"
        :loading="pending"
      />
    </template>
  </UModal>
</template>
