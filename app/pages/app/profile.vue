<script setup lang="ts">
import { appProfileContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({
  title: appProfileContent.title,
  description: appProfileContent.description,
})

const userId = useUserId()
const errorMessage = ref('')
const saved = ref(false)
const pending = ref(false)

const { data: initial } = await useAsyncData(
  'app-profile',
  async () => (userId.value ? loadProfileForm(userId.value) : null),
  { watch: [userId] },
)

async function onSubmit(state: unknown) {
  if (!userId.value || !state) return
  errorMessage.value = ''
  saved.value = false
  pending.value = true
  const result = await saveProfile(userId.value, state)
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  saved.value = true
  await refreshNuxtData('app-roles')
}
</script>

<template>
  <AppPanel :title="appProfileContent.title" :description="appProfileContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="saved" color="success" variant="subtle" title="Perfil guardado." />
    <AppProfileForm v-if="initial" :initial="initial" :pending="pending" @submit="onSubmit" />
  </AppPanel>
</template>
