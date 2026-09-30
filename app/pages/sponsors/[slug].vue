<script setup lang="ts">
import { CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()

const { data: sponsor } = await useAsyncData(
  () => `sponsor-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const db = useDb()
    const { data } = await db
      .from('profiles')
      .select(
        'id, slug, display_name, email, instagram, website, city, contribution_types, contribution_description, disaffiliated_at, hidden_at',
      )
      .eq('slug', slug.value)
      .is('disaffiliated_at', null)
      .is('hidden_at', null)
      .maybeSingle()
    if (!data) return null
    const [{ data: roles }, { data: count }] = await Promise.all([
      db.from('profile_roles').select('role').eq('profile_id', data.id),
      db.rpc('sponsor_completed_count', { p_profile_id: data.id }),
    ])
    const sponsorRoles = (roles ?? []).filter((role) => role.role === 'venue_sponsor' || role.role === 'local_sponsor')
    if (sponsorRoles.length === 0) return null
    return { ...data, completedEvents: count ?? 0 }
  },
  { watch: [slug] },
)

useSeoMeta({
  title: () => sponsor.value?.display_name ?? 'Aliado',
  description: () => sponsor.value?.contribution_description ?? 'Aliado de Redeventos',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="max-w-3xl space-y-4">
        <h1 v-if="!sponsor" class="text-2xl font-semibold">Aliado no encontrado</h1>
        <template v-else>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-semibold">{{ sponsor.display_name }}</h1>
            <SealBadge
              :disaffiliated="false"
              :hidden="false"
              has-sponsor-role
              :profile-complete="Boolean(sponsor.display_name && sponsor.email)"
              :completed-events="sponsor.completedEvents"
            />
          </div>
          <p v-if="sponsor.city" class="text-sm text-muted">{{ CITY_LABELS[sponsor.city] }}</p>
          <p v-if="sponsor.contribution_description">{{ sponsor.contribution_description }}</p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="type in sponsor.contribution_types" :key="type">
              <UBadge color="neutral" variant="subtle">{{ NEED_LABELS[type] }}</UBadge>
            </li>
          </ul>
          <section class="space-y-1 text-sm">
            <h2 class="text-lg font-semibold">Contacto público</h2>
            <p>{{ sponsor.email }}</p>
            <p v-if="sponsor.instagram">{{ sponsor.instagram }}</p>
            <p v-if="sponsor.website">
              <a :href="sponsor.website" class="text-primary">{{ sponsor.website }}</a>
            </p>
          </section>
          <ReportForm target-type="profile" :target-id="sponsor.id" />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
