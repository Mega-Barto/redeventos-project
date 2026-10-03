<script setup lang="ts">
import { appVenueContent } from '~~/shared/content/app'
import type { VenueInput } from '~~/shared/schemas/inputs'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appVenueContent.title, description: appVenueContent.description })

const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')
const saved = ref(false)

const { data, refresh } = await useAsyncData(
  'own-venue',
  async () => {
    if (!userId.value) return { venue: null, roles: [] as string[], error: null as string | null }
    const [venue, roles] = await Promise.all([loadOwnVenue(userId.value), loadMyRoles(userId.value)])
    return { ...venue, roles }
  },
  { watch: [userId] },
)

const isVenue = computed(() => data.value?.roles.includes('venue_sponsor') ?? false)

async function onSubmit(input: VenueInput) {
  if (!userId.value) return
  pending.value = true
  errorMessage.value = ''
  saved.value = false
  const result = await saveVenue(userId.value, input, data.value?.venue?.id ?? null)
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  saved.value = true
  await refresh()
}
</script>

<template>
  <AppPanel :title="appVenueContent.title" :description="appVenueContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="saved" color="success" variant="subtle" :title="appVenueContent.saved" />
    <p v-if="data && !isVenue" class="text-muted" role="status">{{ appVenueContent.needRole }}</p>
    <VenueForm v-else-if="data" :pending="pending" :initial="data.venue?.initial" @submit="onSubmit" />
  </AppPanel>
</template>
