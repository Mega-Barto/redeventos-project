<script setup lang="ts">
import { CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationProfileRow } from '~~/shared/utils/moderation-directory'

defineProps<{
  row: ModerationProfileRow
  selfId: string | null
  showContributions?: boolean
}>()

defineEmits<{
  hide: [id: string]
  disaffiliate: [id: string]
}>()
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div class="space-y-1">
        <p class="font-medium">{{ row.displayName }}</p>
        <p class="text-sm text-muted">{{ row.email }}</p>
        <p class="text-sm text-muted">{{ row.city ? CITY_LABELS[row.city] : '—' }} · {{ row.slug }}</p>
        <p v-if="showContributions && row.contributionTypes.length" class="text-sm text-muted">
          {{ row.contributionTypes.map((type) => NEED_LABELS[type]).join(', ') }}
        </p>
        <ModerationStatusBadges :hidden="row.hidden" :disaffiliated="row.disaffiliated" />
      </div>
      <div class="flex flex-wrap gap-2">
        <ModerationProfileFichaModal :profile-id="row.id" :show-contributions="showContributions" />
        <UButton
          v-if="!row.hidden && !row.disaffiliated"
          :label="appModerationContent.hide"
          color="neutral"
          variant="soft"
          :disabled="row.id === selfId"
          @click="$emit('hide', row.id)"
        />
        <UButton
          v-if="!row.disaffiliated"
          :label="appModerationContent.disaffiliate"
          color="error"
          variant="soft"
          :disabled="row.id === selfId"
          @click="$emit('disaffiliate', row.id)"
        />
      </div>
    </div>
  </UCard>
</template>
