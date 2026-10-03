<script setup lang="ts">
import { CITY_LABELS } from '~~/shared/constants/labels'
import type { Tables } from '~~/shared/types/database.types'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

useSeoMeta({ title: 'Aliados', description: 'Venue sponsors y local sponsors de Redeventos.' })

const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()

const { data: sponsors, status, error } = await useAsyncData('public-sponsors', async () => {
  if (!configured.value) return []
  const db = useDb()
  const { data: roles, error: rolesError } = await db
    .from('profile_roles')
    .select('profile_id, role')
    .in('role', ['venue_sponsor', 'local_sponsor'])
  if (rolesError) throw rolesError
  if (!roles?.length) return []
  const ids = [...new Set(roles.map((role) => role.profile_id))]
  const { data: profiles, error: profilesError } = await db
    .from('profiles')
    .select('id, slug, display_name, city, email, avatar_storage_path')
    .in('id', ids)
    .is('disaffiliated_at', null)
    .is('hidden_at', null)
  if (profilesError) throw profilesError
  return (profiles ?? []) as Pick<
    Tables<'profiles'>,
    'id' | 'slug' | 'display_name' | 'city' | 'email' | 'avatar_storage_path'
  >[]
})
</script>

<template>
  <UPage>
    <UPageHeader title="Aliados" description="Sponsor y aliado local son el mismo tipo de usuario. Cambia el aporte, no la cuenta." />
    <UPageBody>
      <UContainer class="space-y-4">
        <div v-if="status === 'pending'" class="space-y-4" aria-busy="true" aria-live="polite">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
        <UAlert
          v-else-if="error"
          color="error"
          title="No se pudo cargar el listado"
          description="Vuelve a intentar en un momento."
        />
        <p v-else-if="!sponsors?.length" class="reading-surface px-4 py-3 text-muted" role="status">
          Todavía no hay aliados publicados.
        </p>
        <UPageCard
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          :title="sponsor.display_name"
          :to="`/sponsors/${sponsor.slug}`"
          :description="sponsor.city ? CITY_LABELS[sponsor.city] : 'Pereira y Dosquebradas'"
        >
          <MediaProfileAvatar
            :src="publicStorageUrl(supabaseUrl, 'profiles', sponsor.avatar_storage_path)"
            :name="sponsor.display_name"
            size="sm"
          />
        </UPageCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
