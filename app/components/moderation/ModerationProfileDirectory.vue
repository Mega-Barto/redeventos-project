<script setup lang="ts">
import { CITIES, LOCAL_CONTRIBUTION_TYPES, type LocalContributionType } from '~~/shared/constants/domain'
import { CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationProfileRow, ModerationSponsorKind } from '~~/shared/utils/moderation-directory'
import { filterModerationProfiles } from '~~/shared/utils/moderation-directory'

const props = defineProps<{
  rows: ModerationProfileRow[]
  empty: string
  selfId: string | null
  showContributions?: boolean
  showSponsorKindFilter?: boolean
}>()

defineEmits<{
  hide: [id: string]
  disaffiliate: [id: string]
}>()

const query = ref('')
const city = ref<(typeof CITIES)[number] | 'all'>('all')
const visibility = ref<'all' | 'active' | 'hidden' | 'disaffiliated'>('all')
const contributionType = ref<LocalContributionType | 'all'>('all')
const sponsorKind = ref<ModerationSponsorKind | 'all'>('all')

const filtered = computed(() =>
  filterModerationProfiles(props.rows, {
    query: query.value,
    city: city.value,
    visibility: visibility.value,
    contributionType: contributionType.value,
    sponsorKind: props.showSponsorKindFilter ? sponsorKind.value : 'all',
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
  ...LOCAL_CONTRIBUTION_TYPES.map((value) => ({ label: NEED_LABELS[value], value })),
]

const sponsorKindItems = [
  { label: appModerationContent.sponsorKindAll, value: 'all' },
  { label: appModerationContent.sponsorKindVenue, value: 'venue' },
  { label: appModerationContent.sponsorKindLocal, value: 'local' },
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
        v-if="showSponsorKindFilter"
        v-model="sponsorKind"
        :items="sponsorKindItems"
        class="md:w-48"
        :aria-label="appModerationContent.sponsorKindAll"
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
        :show-sponsor-kinds="showSponsorKindFilter"
        @hide="$emit('hide', $event)"
        @disaffiliate="$emit('disaffiliate', $event)"
      />
    </div>
  </div>
</template>
