<script setup lang="ts">
import { CITY_LABELS } from '~~/shared/constants/labels'
import type { Tables } from '~~/shared/types/database.types'

useSeoMeta({ title: 'Aliados', description: 'Venue sponsors y local sponsors de Redeventos.' })

const configured = useSupabaseConfigured()

const { data: sponsors } = await useAsyncData('public-sponsors', async () => {
  if (!configured.value) return []
  const db = useDb()
  const { data: roles, error } = await db
    .from('profile_roles')
    .select('profile_id, role')
    .in('role', ['venue_sponsor', 'local_sponsor'])
  if (error || !roles?.length) return []
  const ids = [...new Set(roles.map((role) => role.profile_id))]
  const { data: profiles } = await db
    .from('profiles')
    .select('id, slug, display_name, city, email')
    .in('id', ids)
    .is('disaffiliated_at', null)
    .is('hidden_at', null)
  return (profiles ?? []) as Pick<Tables<'profiles'>, 'id' | 'slug' | 'display_name' | 'city' | 'email'>[]
})
</script>

<template>
  <UPage>
    <UPageHeader title="Aliados" description="Sponsor y aliado local son el mismo tipo de usuario. Cambia el aporte, no la cuenta." />
    <UPageBody>
      <UContainer class="space-y-4">
        <p v-if="!sponsors?.length" class="text-muted" role="status">Todavía no hay aliados publicados.</p>
        <UPageCard
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          :title="sponsor.display_name"
          :to="`/sponsors/${sponsor.slug}`"
          :description="sponsor.city ? CITY_LABELS[sponsor.city] : 'Pereira y Dosquebradas'"
        />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
