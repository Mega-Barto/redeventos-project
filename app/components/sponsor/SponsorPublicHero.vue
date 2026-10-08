<script setup lang="ts">
import type { City } from '~~/shared/constants/domain'
import { CITY_LABELS } from '~~/shared/constants/labels'
import { sponsorPublicContent } from '~~/shared/content/sponsor'

defineProps<{
  displayName: string
  city: City | null
  avatarSrc?: string | null
  completedEvents: number
}>()
</script>

<template>
  <header class="space-y-4">
    <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ sponsorPublicContent.heroEyebrow }}</p>
    <div class="flex flex-wrap items-end gap-4">
      <MediaProfileAvatar v-if="avatarSrc" :src="avatarSrc" :name="displayName" />
      <div class="min-w-0 space-y-2">
        <h1 class="text-3xl font-semibold text-highlighted sm:text-4xl">{{ displayName }}</h1>
        <p v-if="city" class="text-sm text-muted">{{ CITY_LABELS[city] }}</p>
        <SealBadge
          :disaffiliated="false"
          :hidden="false"
          has-sponsor-role
          :profile-complete="Boolean(displayName)"
          :completed-events="completedEvents"
        />
      </div>
    </div>
  </header>
</template>
