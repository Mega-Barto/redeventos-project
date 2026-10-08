<script setup lang="ts">
import { PILOT_EMAIL_EVENT_KEYS, type PilotEmailEventKey } from '~~/shared/constants/notification-events'
import { notificationPrefsContent } from '~~/shared/content/notifications'

const values = defineModel<Record<PilotEmailEventKey, boolean>>({ required: true })

defineProps<{
  pending?: boolean
}>()

const emit = defineEmits<{
  save: []
}>()

function onToggle(key: PilotEmailEventKey, enabled: boolean | 'indeterminate') {
  values.value = { ...values.value, [key]: Boolean(enabled) }
}
</script>

<template>
  <section class="space-y-4" aria-labelledby="notification-prefs-heading">
    <div>
      <h2 id="notification-prefs-heading" class="font-semibold">{{ notificationPrefsContent.title }}</h2>
      <p class="text-sm text-muted">{{ notificationPrefsContent.description }}</p>
    </div>
    <div v-for="key in PILOT_EMAIL_EVENT_KEYS" :key="key" class="space-y-1">
      <UCheckbox
        :model-value="values[key]"
        :label="notificationPrefsContent.events[key].label"
        @update:model-value="onToggle(key, $event)"
      />
      <p class="text-sm text-muted">{{ notificationPrefsContent.events[key].hint }}</p>
    </div>
    <UButton
      :label="notificationPrefsContent.save"
      :loading="pending"
      color="neutral"
      variant="soft"
      @click="emit('save')"
    />
  </section>
</template>
