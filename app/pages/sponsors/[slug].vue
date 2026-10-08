<script setup lang="ts">
import { asLocalContributionTypes } from '~~/shared/constants/domain'
import { sponsorPublicContent } from '~~/shared/content/sponsor'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()

const { data: sponsor } = await useAsyncData(
  () => `sponsor-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const db = useDb()
    const { data } = await db
      .from('profiles')
      .select(
        'id, slug, display_name, email, instagram, website, city, contribution_types, contribution_description, disaffiliated_at, hidden_at, avatar_storage_path, venue_sponsor_photo_path, local_sponsor_photo_path',
      )
      .eq('slug', slug.value)
      .is('disaffiliated_at', null)
      .is('hidden_at', null)
      .maybeSingle()
    if (!data) return null
    const [{ data: roles }, { data: count }, { data: venues }] = await Promise.all([
      db.from('profile_roles').select('role').eq('profile_id', data.id),
      db.rpc('sponsor_completed_count', { p_profile_id: data.id }),
      db.from('venues').select('slug').eq('owner_id', data.id).limit(1),
    ])
    const sponsorRoles = (roles ?? [])
      .map((row) => row.role)
      .filter((role): role is 'venue_sponsor' | 'local_sponsor' => role === 'venue_sponsor' || role === 'local_sponsor')
    if (!sponsorRoles.length) return null
    return {
      ...data,
      contribution_types: asLocalContributionTypes(data.contribution_types),
      roles: sponsorRoles,
      completedEvents: count ?? 0,
      firstVenueSlug: venues?.[0]?.slug ?? null,
    }
  },
  { watch: [slug] },
)

const avatarSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', sponsor.value?.avatar_storage_path ?? null),
)
const venuePhotoSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', sponsor.value?.venue_sponsor_photo_path ?? null),
)
const localPhotoSrc = computed(() =>
  publicStorageUrl(supabaseUrl.value, 'profiles', sponsor.value?.local_sponsor_photo_path ?? null),
)
const venuesHref = computed(() =>
  sponsor.value?.firstVenueSlug ? `/venues/${sponsor.value.firstVenueSlug}` : '/venues',
)
const ogImage = computed(() => venuePhotoSrc.value ?? localPhotoSrc.value ?? avatarSrc.value ?? undefined)

useSeoMeta({
  title: () => sponsor.value?.display_name ?? 'Aliado',
  description: () =>
    sponsor.value?.contribution_description ??
    (sponsor.value?.roles.includes('venue_sponsor')
      ? sponsorPublicContent.venueSectionDescription
      : sponsorPublicContent.localSectionDescription),
  ogImage: () => ogImage.value,
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="reading-surface max-w-3xl space-y-8 p-6 sm:p-8">
        <h1 v-if="!sponsor" class="text-2xl font-semibold">{{ sponsorPublicContent.missing }}</h1>
        <template v-else>
          <SponsorPublicHero
            :display-name="sponsor.display_name"
            :city="sponsor.city"
            :avatar-src="avatarSrc"
            :completed-events="sponsor.completedEvents"
          />
          <SponsorPublicSupportSection
            v-if="sponsor.roles.includes('venue_sponsor')"
            kind="venue_sponsor"
            :display-name="sponsor.display_name"
            :photo-src="venuePhotoSrc"
            :venues-href="venuesHref"
          />
          <SponsorPublicSupportSection
            v-if="sponsor.roles.includes('local_sponsor')"
            kind="local_sponsor"
            :display-name="sponsor.display_name"
            :photo-src="localPhotoSrc"
            :contribution-types="sponsor.contribution_types"
            :contribution-description="sponsor.contribution_description"
          />
          <SponsorPublicContact
            :email="sponsor.email"
            :instagram="sponsor.instagram"
            :website="sponsor.website"
          />
          <ReportForm target-type="profile" :target-id="sponsor.id" />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
