<script setup lang="ts">
import type { Role } from '~~/shared/constants/domain'
import { EVENT_STATUS_LABELS } from '~~/shared/constants/labels'
import { appEventsContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appEventsContent.title, description: appEventsContent.description })

const userId = useUserId()
const { data } = await useAsyncData(
  'own-events',
  async () => {
    if (!userId.value) return { events: [], roles: [] as Role[], error: null as string | null }
    const [events, roles] = await Promise.all([listOwnEvents(userId.value), loadMyRoles(userId.value)])
    return { ...events, roles }
  },
  { watch: [userId] },
)

const isOrganizer = computed(() => data.value?.roles.includes('organizer') ?? false)
</script>

<template>
  <AppPanel :title="appEventsContent.title" :description="appEventsContent.description">
    <template #actions>
      <UButton v-if="isOrganizer" :to="appEventsContent.createTo" :label="appEventsContent.createLabel" />
    </template>
    <UAlert v-if="data?.error" color="error" variant="subtle" :title="data.error" />
    <p v-else-if="!isOrganizer" class="text-muted" role="status">{{ appEventsContent.needRole }}</p>
    <p v-else-if="!data?.events.length" class="text-muted" role="status">{{ appEventsContent.empty }}</p>
    <div v-else class="space-y-3">
      <UCard v-for="event in data.events" :key="event.id">
        <NuxtLink :to="`/app/eventos/${event.id}`" class="font-medium">{{ event.title }}</NuxtLink>
        <p class="text-sm text-muted">{{ EVENT_STATUS_LABELS[event.status] }}</p>
      </UCard>
    </div>
  </AppPanel>
</template>
