<script setup lang="ts">
import { CITIES, NEED_TYPES } from '~~/shared/constants/domain'
import { CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationProfileRow } from '~~/shared/utils/moderation-directory'
import { filterModerationProfiles } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  rows: ModerationProfileRow[]
  empty: string
  selfId: string | null
  showContributions?: boolean
}>()

defineEmits<{
  hide: [id: string]
  disaffiliate: [id: string]
}>()

const query = ref('')
const city = ref<(typeof CITIES)[number] | 'all'>('all')
const visibility = ref<'all' | 'active' | 'hidden' | 'disaffiliated'>('all')
const contributionType = ref<(typeof NEED_TYPES)[number] | 'all'>('all')

const filtered = computed(() =>
  filterModerationProfiles(props.rows, {
    query: query.value,
    city: city.value,
    visibility: visibility.value,
    contributionType: contributionType.value,
  }),
)

const cityItems = [
  { label: appModerationContent.cityAll, value: 'all' },
  ...CITIES.map((value) => ({ label: CITY_LABELS[value], value })),
]

const visibilityItems = [
  { label: appModerationContent.visibilityAll, value: 'all' },
  { label: appModerationContent.visibilityActive, value: 'active' },
  { label: appModerationContent.visibilityHidden, value: 'hidden' },
  { label: appModerationContent.visibilityDisaffiliated, value: 'disaffiliated' },
]

const contributionItems = [
  { label: appModerationContent.contributionAll, value: 'all' },
  ...NEED_TYPES.map((value) => ({ label: NEED_LABELS[value], value })),
]
</script>

<template>
  <div class="space-y-4">
    <ModerationDirectoryToolbar v-model:query="query" :search-label="appModerationContent.searchProfiles">
      <USelect v-model="city" :items="cityItems" class="md:w-48" :aria-label="appModerationContent.cityAll" />
      <USelect
        v-model="visibility"
        :items="visibilityItems"
        class="md:w-48"
        :aria-label="appModerationContent.visibilityAll"
      />
      <USelect
        v-if="showContributions"
        v-model="contributionType"
        :items="contributionItems"
        class="md:w-52"
        :aria-label="appModerationContent.contributionAll"
      />
    </ModerationDirectoryToolbar>
    <p v-if="!filtered.length" class="text-muted" role="status">{{ empty }}</p>
    <div v-else class="space-y-3">
      <ModerationProfileCard
        v-for="row in filtered"
        :key="row.id"
        :row="row"
        :self-id="selfId"
        :show-contributions="showContributions"
        @hide="$emit('hide', $event)"
        @disaffiliate="$emit('disaffiliate', $event)"
      />
    </div>
  </div>
</template>
