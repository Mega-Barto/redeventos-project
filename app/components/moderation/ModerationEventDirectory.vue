<script setup lang="ts">
import { CITIES, EVENT_STATUSES } from '~~/shared/constants/domain'
import { CITY_LABELS, EVENT_STATUS_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationEventRow } from '~~/shared/utils/moderation-directory'
import { filterModerationEvents } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  rows: ModerationEventRow[]
}>()

defineEmits<{
  hide: [id: string]
}>()

const query = ref('')
const city = ref<(typeof CITIES)[number] | 'all'>('all')
const status = ref<(typeof EVENT_STATUSES)[number] | 'all'>('all')
const hidden = ref<'all' | 'visible' | 'hidden'>('all')

const filtered = computed(() =>
  filterModerationEvents(props.rows, {
    query: query.value,
    city: city.value,
    status: status.value,
    hidden: hidden.value,
  }),
)

const cityItems = [
  { label: appModerationContent.cityAll, value: 'all' },
  ...CITIES.map((value) => ({ label: CITY_LABELS[value], value })),
]

const statusItems = [
  { label: appModerationContent.statusAll, value: 'all' },
  ...EVENT_STATUSES.map((value) => ({ label: EVENT_STATUS_LABELS[value], value })),
]

const hiddenItems = [
  { label: appModerationContent.hiddenAll, value: 'all' },
  { label: appModerationContent.hiddenOnlyVisible, value: 'visible' },
  { label: appModerationContent.hiddenOnlyHidden, value: 'hidden' },
]
</script>

<template>
  <div class="space-y-4">
    <ModerationDirectoryToolbar v-model:query="query" :search-label="appModerationContent.searchEvents">
      <USelect v-model="city" :items="cityItems" class="md:w-48" :aria-label="appModerationContent.cityAll" />
      <USelect
        v-model="status"
        :items="statusItems"
        class="md:w-52"
        :aria-label="appModerationContent.statusAll"
      />
      <USelect v-model="hidden" :items="hiddenItems" class="md:w-48" :aria-label="appModerationContent.hiddenAll" />
    </ModerationDirectoryToolbar>
    <p v-if="!filtered.length" class="text-muted" role="status">{{ appModerationContent.eventsEmpty }}</p>
    <div v-else class="space-y-3">
      <ModerationEventCard v-for="row in filtered" :key="row.id" :row="row" @hide="$emit('hide', $event)" />
    </div>
  </div>
</template>
