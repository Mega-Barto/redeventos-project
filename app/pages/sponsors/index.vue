<script setup lang="ts">
import { sponsorPublicContent } from '~~/shared/content/sponsor'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

useSeoMeta({
  title: sponsorPublicContent.listTitle,
  description: sponsorPublicContent.listDescription,
})

const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()

type SponsorListRow = {
  id: string
  slug: string
  display_name: string
  city: 'pereira' | 'dosquebradas' | null
  avatar_storage_path: string | null
  venue_sponsor_photo_path: string | null
  local_sponsor_photo_path: string | null
  roles: Array<'venue_sponsor' | 'local_sponsor'>
}

const { data: sponsors, status, error } = await useAsyncData('public-sponsors', async () => {
  if (!configured.value) return [] as SponsorListRow[]
  const db = useDb()
  const { data: roles, error: rolesError } = await db
    .from('profile_roles')
    .select('profile_id, role')
    .in('role', ['venue_sponsor', 'local_sponsor'])
  if (rolesError) throw rolesError
  if (!roles?.length) return [] as SponsorListRow[]

  const rolesById = new Map<string, Array<'venue_sponsor' | 'local_sponsor'>>()
  for (const row of roles) {
    if (row.role !== 'venue_sponsor' && row.role !== 'local_sponsor') continue
    const current = rolesById.get(row.profile_id) ?? []
    if (!current.includes(row.role)) current.push(row.role)
    rolesById.set(row.profile_id, current)
  }

  const ids = [...rolesById.keys()]
  const { data: profiles, error: profilesError } = await db
    .from('profiles')
    .select(
      'id, slug, display_name, city, avatar_storage_path, venue_sponsor_photo_path, local_sponsor_photo_path',
    )
    .in('id', ids)
    .is('disaffiliated_at', null)
    .is('hidden_at', null)
  if (profilesError) throw profilesError

  return (profiles ?? []).map((profile) => ({
    ...profile,
    roles: rolesById.get(profile.id) ?? [],
  }))
})

function cardPhoto(row: SponsorListRow) {
  const path =
    (row.roles.includes('venue_sponsor') && row.venue_sponsor_photo_path) ||
    (row.roles.includes('local_sponsor') && row.local_sponsor_photo_path) ||
    row.venue_sponsor_photo_path ||
    row.local_sponsor_photo_path ||
    null
  return publicStorageUrl(supabaseUrl.value, 'profiles', path)
}
</script>

<template>
  <UPage>
    <UPageHeader :title="sponsorPublicContent.listTitle" :description="sponsorPublicContent.listDescription" />
    <UPageBody>
      <UContainer class="space-y-4">
        <div v-if="status === 'pending'" class="space-y-4" aria-busy="true" aria-live="polite">
          <USkeleton class="h-48 w-full" />
          <USkeleton class="h-48 w-full" />
        </div>
        <UAlert
          v-else-if="error"
          color="error"
          :title="sponsorPublicContent.listErrorTitle"
          :description="sponsorPublicContent.listErrorDescription"
        />
        <p v-else-if="!sponsors?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          {{ sponsorPublicContent.listEmpty }}
        </p>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <SponsorPublicCard
            v-for="sponsor in sponsors"
            :key="sponsor.id"
            :display-name="sponsor.display_name"
            :slug="sponsor.slug"
            :city="sponsor.city"
            :roles="sponsor.roles"
            :photo-src="cardPhoto(sponsor)"
            :avatar-src="publicStorageUrl(supabaseUrl, 'profiles', sponsor.avatar_storage_path)"
          />
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
