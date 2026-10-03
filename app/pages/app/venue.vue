<script setup lang="ts">
import { appVenueContent } from '~~/shared/content/app'
import { mediaContent } from '~~/shared/content/media'
import type { VenueInput } from '~~/shared/schemas/inputs'
import { asFileList } from '~~/shared/utils/public-media'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appVenueContent.title, description: appVenueContent.description })

const userId = useUserId()
const supabaseUrl = useSupabaseUrl()
const pending = ref(false)
const errorMessage = ref('')
const saved = ref(false)
const coverFile = ref<File | File[] | null>(null)
const galleryFiles = ref<File | File[] | null>(null)

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
const coverSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'venues', data.value?.venue?.coverPath ?? null),
)
const galleryUrls = computed(() =>
  (data.value?.venue?.gallery ?? []).map((item) => ({
    ...item,
    url: publicStorageUrl(supabaseUrl.value, 'venues', item.storage_path),
  })),
)

async function run(action: () => Promise<{ error: string | null }>) {
  pending.value = true
  errorMessage.value = ''
  saved.value = false
  const result = await action()
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  saved.value = true
  await refresh()
}

function onSubmit(input: VenueInput) {
  if (!userId.value) return
  return run(async () => {
    const result = await saveVenue(userId.value as string, input, data.value?.venue?.id ?? null)
    return { error: result.error }
  })
}

function onCover() {
  const file = asFileList(coverFile.value)[0]
  const venueId = data.value?.venue?.id
  if (!file || !venueId) return
  return run(async () => {
    const result = await saveVenueCover(venueId, file)
    if (!result.error) coverFile.value = null
    return result
  })
}

function onGallery() {
  const files = asFileList(galleryFiles.value)
  const venueId = data.value?.venue?.id
  if (!files.length || !venueId) return
  return run(async () => {
    const result = await addVenueGallery(venueId, files)
    if (!result.error) galleryFiles.value = null
    return result
  })
}

function onRemove(mediaId: string, storagePath: string) {
  const venueId = data.value?.venue?.id
  if (!venueId) return
  return run(() => removeVenueGalleryItem(venueId, mediaId, storagePath))
}
</script>

<template>
  <AppPanel :title="appVenueContent.title" :description="appVenueContent.description">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UAlert v-else-if="saved" color="success" variant="subtle" :title="appVenueContent.saved" />
    <p v-if="data && !isVenue" class="text-muted" role="status">{{ appVenueContent.needRole }}</p>
    <template v-else-if="data">
      <VenueForm :pending="pending" :initial="data.venue?.initial" @submit="onSubmit" />
      <section v-if="data.venue" class="space-y-4">
        <MediaVenueCover v-if="coverSrc" :src="coverSrc" :name="data.venue.initial.name" />
        <AppMediaFileField v-model="coverFile" :label="mediaContent.coverLabel" :hint="mediaContent.coverHint" />
        <UButton :label="mediaContent.coverSave" :loading="pending" :disabled="!asFileList(coverFile).length" @click="onCover" />
        <MediaVenueGallery
          :urls="galleryUrls.map((item) => item.url).filter((url): url is string => Boolean(url))"
          :name="data.venue.initial.name"
        />
        <ul v-if="galleryUrls.length" class="space-y-2">
          <li v-for="item in galleryUrls" :key="item.id">
            <UButton
              :label="mediaContent.galleryRemove"
              color="neutral"
              variant="soft"
              size="sm"
              :loading="pending"
              @click="onRemove(item.id, item.storage_path)"
            />
          </li>
        </ul>
        <p v-else class="text-sm text-muted" role="status">{{ mediaContent.galleryEmpty }}</p>
        <AppMediaFileField v-model="galleryFiles" multiple :label="mediaContent.galleryLabel" :hint="mediaContent.galleryHint" />
        <UButton :label="mediaContent.gallerySave" :loading="pending" :disabled="!asFileList(galleryFiles).length" @click="onGallery" />
      </section>
    </template>
  </AppPanel>
</template>
