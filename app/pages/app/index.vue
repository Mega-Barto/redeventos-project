<script setup lang="ts">
import type { Role } from '~~/shared/constants/domain'
import { appHomeContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({
  title: appHomeContent.title,
  description: appHomeContent.description,
})

const userId = useUserId()
const { data: roles } = await useAsyncData(
  'app-home-roles',
  async () => (userId.value ? loadMyRoles(userId.value) : []),
  { watch: [userId] },
)

const entries = computed(() => {
  const current = roles.value ?? []
  return (Object.keys(appHomeContent.entries) as Role[])
    .filter((role) => current.includes(role))
    .map((role) => appHomeContent.entries[role])
})
</script>

<template>
  <AppPanel :title="appHomeContent.title" :description="appHomeContent.description">
    <AppRoleEntries v-if="entries.length" :entries="entries" />
    <div v-else class="space-y-3">
      <p class="text-muted" role="status">{{ appHomeContent.empty }}</p>
      <UButton to="/app/perfil" :label="appHomeContent.profileCta" />
    </div>
  </AppPanel>
</template>
