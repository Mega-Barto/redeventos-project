<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS, EVENT_STATUS_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { appModerationContent } from '~~/shared/content/app'
import { formatBogotaDate } from '~~/shared/domain/rules'
import type { ModerationEventFicha } from '~~/shared/utils/moderation-directory'

defineProps<{
  ficha: ModerationEventFicha
}>()
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-1">
      <p class="text-sm text-muted">
        {{ EVENT_STATUS_LABELS[ficha.status] }} · {{ CATEGORY_LABELS[ficha.category] }} · {{ CITY_LABELS[ficha.city] }}
      </p>
      <p class="text-lg font-semibold">{{ ficha.title }}</p>
      <p class="text-sm text-muted">{{ ficha.organizerName }}</p>
      <ModerationStatusBadges :hidden="ficha.hidden" />
    </div>
    <p>{{ ficha.description }}</p>
    <dl class="grid gap-3 text-sm md:grid-cols-2">
      <div>
        <dt class="text-muted">{{ appModerationContent.fichaDate }}</dt>
        <dd>{{ ficha.startsOn ? formatBogotaDate(ficha.startsOn) : (ficha.dateRangeLabel ?? '—') }}</dd>
      </div>
      <div>
        <dt class="text-muted">{{ appModerationContent.fichaPlace }}</dt>
        <dd>{{ ficha.placeName ?? '—' }}</dd>
      </div>
      <div>
        <dt class="text-muted">{{ appModerationContent.fichaAudience }}</dt>
        <dd>{{ ficha.audience }}</dd>
      </div>
      <div>
        <dt class="text-muted">{{ appModerationContent.fichaAttendees }}</dt>
        <dd>{{ ficha.expectedAttendees }}</dd>
      </div>
    </dl>
    <p v-if="ficha.sponsorBenefit" class="text-sm">
      <span class="text-muted">{{ appModerationContent.fichaBenefit }}: </span>
      {{ ficha.sponsorBenefit }}
    </p>
    <section v-if="ficha.needs.length" class="space-y-2">
      <h3 class="font-semibold">{{ appModerationContent.fichaNeeds }}</h3>
      <ul class="space-y-1 text-sm text-muted">
        <li v-for="need in ficha.needs" :key="need.id">{{ NEED_LABELS[need.type] }}: {{ need.description }}</li>
      </ul>
    </section>
  </div>
</template>
