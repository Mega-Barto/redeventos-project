<script setup lang="ts">
import type { City } from '~~/shared/constants/domain'
import { CITY_LABELS, ROLE_LABELS } from '~~/shared/constants/labels'
import { sponsorPublicContent } from '~~/shared/content/sponsor'

defineProps<{
  displayName: string
  slug: string
  city: City | null
  roles: Array<'venue_sponsor' | 'local_sponsor'>
  photoSrc?: string | null
  avatarSrc?: string | null
}>()
</script>

<template>
  <NuxtLink
    :to="`/sponsors/${slug}`"
    class="block overflow-hidden rounded-2xl bg-muted ring ring-muted transition hover:ring-default"
  >
    <div v-if="photoSrc" class="aspect-[16/9] overflow-hidden bg-default">
      <img :src="photoSrc" :alt="displayName" class="size-full object-cover" loading="lazy" />
    </div>
    <div class="flex items-start gap-3 p-4">
      <MediaProfileAvatar v-if="avatarSrc" :src="avatarSrc" :name="displayName" size="sm" />
      <div class="min-w-0 space-y-2">
        <h2 class="font-semibold text-highlighted">{{ displayName }}</h2>
        <p class="text-sm text-muted">{{ city ? CITY_LABELS[city] : sponsorPublicContent.listDescription }}</p>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="role in roles" :key="role" color="neutral" variant="subtle">
            {{ ROLE_LABELS[role] }}
          </UBadge>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
