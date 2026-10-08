<script setup lang="ts">
import { defaultEmailEnabled, type PilotEmailEventKey } from '~~/shared/constants/notification-events'
import { appProfileContent } from '~~/shared/content/app'
import { mediaContent } from '~~/shared/content/media'
import { notificationPrefsContent } from '~~/shared/content/notifications'
import { asFileList } from '~~/shared/utils/public-media'
import { missingSponsorPhotoMessage, requiredSponsorPhotoKinds } from '~~/shared/utils/sponsor-photos'
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
const prefsSaved = ref(false)
const pending = ref(false)
const prefsPending = ref(false)
const prefsError = ref('')
const emailPrefs = ref<Record<PilotEmailEventKey, boolean>>({
  offer_received: defaultEmailEnabled('offer_received'),
  offer_accepted: defaultEmailEnabled('offer_accepted'),
  evidence_submitted: defaultEmailEnabled('evidence_submitted'),
  evidence_reviewed: defaultEmailEnabled('evidence_reviewed'),
})
const avatarFile = ref<File | File[] | null>(null)
const venueSponsorPhoto = ref<File | File[] | null>(null)
const localSponsorPhoto = ref<File | File[] | null>(null)

const { data: initial, refresh } = await useAsyncData(
  'app-profile',
  async () => (userId.value ? loadProfileForm(userId.value) : null),
  { watch: [userId] },
)

const { data: prefsData } = await useAsyncData(
  'app-notification-prefs',
  async () => (userId.value ? loadPilotEmailPrefs(userId.value) : null),
  { watch: [userId] },
)

if (prefsData.value?.prefs) emailPrefs.value = prefsData.value.prefs
watch(
  () => prefsData.value?.prefs,
  (next) => {
    if (next) emailPrefs.value = next
  },
)

const avatarSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', initial.value?.avatarPath ?? null),
)
const venuePhotoSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', initial.value?.venueSponsorPhotoPath ?? null),
)
const localPhotoSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', initial.value?.localSponsorPhotoPath ?? null),
)

async function onSubmit(state: {
  roles: Array<'organizer' | 'venue_sponsor' | 'local_sponsor'>
  instagram: string
  website: string
  city: '' | 'pereira' | 'dosquebradas'
  whatsapp: string
  phone: string
  contributionTypes: string[]
  contributionDescription: string
}) {
  if (!userId.value || !state) return
  errorMessage.value = ''
  saved.value = false

  for (const kind of requiredSponsorPhotoKinds(state.roles)) {
    const existing =
      kind === 'venue_sponsor' ? initial.value?.venueSponsorPhotoPath : initial.value?.localSponsorPhotoPath
    const file = asFileList(kind === 'venue_sponsor' ? venueSponsorPhoto.value : localSponsorPhoto.value)[0]
    if (!existing && !file) {
      errorMessage.value = missingSponsorPhotoMessage(kind)
      return
    }
  }

  pending.value = true
  const result = await saveProfile(userId.value, state)
  if (result.error) {
    pending.value = false
    errorMessage.value = result.error
    return
  }

  const venueFile = asFileList(venueSponsorPhoto.value)[0]
  if (state.roles.includes('venue_sponsor') && venueFile) {
    const photo = await saveVenueSponsorPhoto(userId.value, venueFile)
    if (photo.error) {
      pending.value = false
      errorMessage.value = photo.error
      return
    }
    venueSponsorPhoto.value = null
  }
  const localFile = asFileList(localSponsorPhoto.value)[0]
  if (state.roles.includes('local_sponsor') && localFile) {
    const photo = await saveLocalSponsorPhoto(userId.value, localFile)
    if (photo.error) {
      pending.value = false
      errorMessage.value = photo.error
      return
    }
    localSponsorPhoto.value = null
  }

  pending.value = false
  saved.value = true
  await refreshNuxtData('app-roles')
  await refresh()
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

async function onSavePrefs() {
  if (!userId.value) return
  prefsError.value = ''
  prefsSaved.value = false
  prefsPending.value = true
  const result = await savePilotEmailPrefs(userId.value, emailPrefs.value)
  prefsPending.value = false
  if (result.error) {
    prefsError.value = result.error
    return
  }
  prefsSaved.value = true
}
</script>

<template>
  <AppPanel :title="appProfileContent.title" :description="appProfileContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="saved" color="success" variant="subtle" title="Perfil guardado." />
    <UAlert v-if="prefsError || prefsData?.error" color="error" variant="subtle" :title="prefsError || prefsData?.error || notificationPrefsContent.loadError" />
    <UAlert v-else-if="prefsSaved" color="success" variant="subtle" :title="notificationPrefsContent.saved" />
    <section v-if="initial" class="space-y-3">
      <MediaProfileAvatar v-if="avatarSrc" :src="avatarSrc" :name="initial.displayName" />
      <p v-else class="text-sm text-muted" role="status">{{ mediaContent.avatarEmpty }}</p>
      <AppMediaFileField v-model="avatarFile" :label="mediaContent.avatarLabel" :hint="mediaContent.avatarHint" />
      <UButton :label="mediaContent.avatarSave" :loading="pending" :disabled="!asFileList(avatarFile).length" @click="onAvatar" />
    </section>
    <section v-if="initial" class="space-y-4">
      <div class="space-y-2">
        <MediaSponsorSupportPhoto
          v-if="venuePhotoSrc"
          :src="venuePhotoSrc"
          :name="initial.displayName"
          kind="venue_sponsor"
        />
        <p v-else class="text-sm text-muted" role="status">{{ mediaContent.venueSponsorPhotoEmpty }}</p>
        <AppMediaFileField
          v-model="venueSponsorPhoto"
          :label="mediaContent.venueSponsorPhotoLabel"
          :hint="mediaContent.venueSponsorPhotoHint"
        />
      </div>
      <div class="space-y-2">
        <MediaSponsorSupportPhoto
          v-if="localPhotoSrc"
          :src="localPhotoSrc"
          :name="initial.displayName"
          kind="local_sponsor"
        />
        <p v-else class="text-sm text-muted" role="status">{{ mediaContent.localSponsorPhotoEmpty }}</p>
        <AppMediaFileField
          v-model="localSponsorPhoto"
          :label="mediaContent.localSponsorPhotoLabel"
          :hint="mediaContent.localSponsorPhotoHint"
        />
      </div>
    </section>
    <AppProfileForm v-if="initial" :initial="initial" :pending="pending" @submit="onSubmit" />
    <AppNotificationPrefs v-model="emailPrefs" :pending="prefsPending" @save="onSavePrefs" />
  </AppPanel>
</template>
