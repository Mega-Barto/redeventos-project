<script setup lang="ts">
import { appProfileContent } from '~~/shared/content/app'
import { mediaContent } from '~~/shared/content/media'
import { asFileList } from '~~/shared/utils/public-media'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({
  title: appProfileContent.title,
  description: appProfileContent.description,
})

const userId = useUserId()
const supabaseUrl = useSupabaseUrl()
const errorMessage = ref('')
const saved = ref(false)
const pending = ref(false)
const avatarFile = ref<File | File[] | null>(null)

const { data: initial, refresh } = await useAsyncData(
  'app-profile',
  async () => (userId.value ? loadProfileForm(userId.value) : null),
  { watch: [userId] },
)

const avatarSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', initial.value?.avatarPath ?? null),
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

async function onAvatar() {
  const file = asFileList(avatarFile.value)[0]
  if (!userId.value || !file) return
  errorMessage.value = ''
  pending.value = true
  const result = await saveProfileAvatar(userId.value, file)
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  avatarFile.value = null
  saved.value = true
  await refresh()
}
</script>

<template>
  <AppPanel :title="appProfileContent.title" :description="appProfileContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="saved" color="success" variant="subtle" title="Perfil guardado." />
    <section v-if="initial" class="space-y-3">
      <MediaProfileAvatar v-if="avatarSrc" :src="avatarSrc" :name="initial.displayName" />
      <p v-else class="text-sm text-muted" role="status">{{ mediaContent.avatarEmpty }}</p>
      <AppMediaFileField v-model="avatarFile" :label="mediaContent.avatarLabel" :hint="mediaContent.avatarHint" />
      <UButton :label="mediaContent.avatarSave" :loading="pending" :disabled="!asFileList(avatarFile).length" @click="onAvatar" />
    </section>
    <AppProfileForm v-if="initial" :initial="initial" :pending="pending" @submit="onSubmit" />
  </AppPanel>
</template>
