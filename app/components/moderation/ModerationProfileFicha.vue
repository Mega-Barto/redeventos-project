<script setup lang="ts">
import { CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import type { ModerationProfileFicha } from '~~/shared/utils/moderation-directory'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const props = defineProps<{
  ficha: ModerationProfileFicha
  showContributions?: boolean
}>()

const supabaseUrl = useSupabaseUrl()
const avatarSrc = computed(() => publicStorageUrl(supabaseUrl.value, 'profiles', props.ficha.avatarPath))
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <MediaProfileAvatar :src="avatarSrc" :name="ficha.displayName" />
      <div class="space-y-1">
        <p class="text-lg font-semibold">{{ ficha.displayName }}</p>
        <p class="text-sm text-muted">{{ ficha.city ? CITY_LABELS[ficha.city] : '—' }} · {{ ficha.slug }}</p>
        <ModerationStatusBadges :hidden="ficha.hidden" :disaffiliated="ficha.disaffiliated" />
      </div>
    </div>
    <p v-if="ficha.contributionDescription">{{ ficha.contributionDescription }}</p>
    <ul v-if="showContributions && ficha.contributionTypes.length" class="flex flex-wrap gap-2">
      <li v-for="type in ficha.contributionTypes" :key="type">
        <UBadge color="neutral" variant="subtle">{{ NEED_LABELS[type] }}</UBadge>
      </li>
    </ul>
    <section class="space-y-1 text-sm">
      <h3 class="font-semibold">{{ appModerationContent.fichaContact }}</h3>
      <p>{{ ficha.email }}</p>
      <p v-if="ficha.instagram">{{ ficha.instagram }}</p>
      <p v-if="ficha.website">
        <a :href="ficha.website" class="text-primary" target="_blank" rel="noreferrer">{{ ficha.website }}</a>
      </p>
    </section>
  </div>
</template>
