<script setup lang="ts">
import { eventPublicContent } from '~~/shared/content/event'
import { eventSupportAuthHrefs } from '~~/shared/utils/internal-path'

const props = defineProps<{
  eventId: string
}>()

const userId = useUserId()
const open = shallowRef(false)
const hrefs = computed(() => eventSupportAuthHrefs(props.eventId))

async function onSupport() {
  if (userId.value) {
    await navigateTo(hrefs.value.opportunityTo)
    return
  }
  open.value = true
}
</script>

<template>
  <div>
    <UButton
      :label="eventPublicContent.supportCta"
      color="primary"
      variant="soft"
      icon="i-lucide-hand-heart"
      @click="onSupport"
    />
    <UModal
      v-model:open="open"
      :title="eventPublicContent.supportModalTitle"
      :description="eventPublicContent.supportModalDescription"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer="{ close }">
        <UButton
          :label="eventPublicContent.supportLoginLabel"
          color="neutral"
          variant="outline"
          :to="hrefs.loginTo"
          @click="close()"
        />
        <UButton :label="eventPublicContent.supportRegisterLabel" :to="hrefs.registerTo" @click="close()" />
      </template>
    </UModal>
  </div>
</template>
