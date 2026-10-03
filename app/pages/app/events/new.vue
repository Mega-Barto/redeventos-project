<script setup lang="ts">
import { appEventNewContent } from '~~/shared/content/app'
import type { CreateEventInput } from '~~/shared/schemas/inputs'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appEventNewContent.title, description: appEventNewContent.description })

const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')

async function onSubmit(input: CreateEventInput) {
  if (!userId.value) return
  pending.value = true
  errorMessage.value = ''
  const result = await createDraftEvent(userId.value, input)
  pending.value = false
  if (result.error || !result.id) {
    errorMessage.value = result.error ?? 'No se pudo crear el evento'
    return
  }
  await navigateTo(`/app/eventos/${result.id}`)
}
</script>

<template>
  <AppPanel :title="appEventNewContent.title" :description="appEventNewContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <EventForm :pending="pending" @submit="onSubmit" />
  </AppPanel>
</template>
