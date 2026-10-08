<script setup lang="ts">
import type { LocalContributionType } from '~~/shared/constants/domain'
import { NEED_LABELS } from '~~/shared/constants/labels'
import { sponsorPublicContent } from '~~/shared/content/sponsor'

defineProps<{
  kind: 'venue_sponsor' | 'local_sponsor'
  displayName: string
  photoSrc?: string | null
  contributionTypes?: LocalContributionType[]
  contributionDescription?: string | null
  venuesHref?: string | null
}>()
</script>

<template>
  <section class="overflow-hidden rounded-2xl bg-muted">
    <div class="space-y-4 p-4 sm:p-5">
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-highlighted">
          {{ kind === 'venue_sponsor' ? sponsorPublicContent.venueSectionTitle : sponsorPublicContent.localSectionTitle }}
        </h2>
        <p class="text-sm text-muted">
          {{
            kind === 'venue_sponsor'
              ? sponsorPublicContent.venueSectionDescription
              : sponsorPublicContent.localSectionDescription
          }}
        </p>
      </div>
      <MediaSponsorSupportPhoto v-if="photoSrc" :src="photoSrc" :name="displayName" :kind="kind" priority />
      <p v-else class="text-sm text-muted" role="status">
        {{ kind === 'venue_sponsor' ? sponsorPublicContent.venuePhotoEmpty : sponsorPublicContent.localPhotoEmpty }}
      </p>
      <template v-if="kind === 'local_sponsor'">
        <div v-if="contributionTypes?.length" class="space-y-2">
          <h3 class="text-sm font-medium">{{ sponsorPublicContent.contributionsHeading }}</h3>
          <ul class="flex flex-wrap gap-2">
            <li v-for="type in contributionTypes" :key="type">
              <UBadge color="neutral" variant="subtle">{{ NEED_LABELS[type] }}</UBadge>
            </li>
          </ul>
        </div>
        <p v-if="contributionDescription" class="text-sm text-default">{{ contributionDescription }}</p>
      </template>
      <UButton
        v-if="kind === 'venue_sponsor' && venuesHref"
        :to="venuesHref"
        :label="sponsorPublicContent.venueCta"
        color="neutral"
        variant="soft"
      />
    </div>
  </section>
</template>
