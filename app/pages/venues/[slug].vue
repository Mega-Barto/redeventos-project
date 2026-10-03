<script setup lang="ts">
import { CITY_LABELS, SUPPORT_LABELS } from '~~/shared/constants/labels'
import { formatBogotaDate } from '~~/shared/domain/rules'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()

const { data: venue } = await useAsyncData(
  () => `venue-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const db = useDb()
    const { data } = await db
      .from('venues')
      .select('id, owner_id, slug, name, city, zone, capacity, equipment, support_mode, description, cover_storage_path')
      .eq('slug', slug.value)
      .maybeSingle()
    if (!data) return null
    const [{ data: owner }, { data: days }, { data: count }, { data: gallery }] = await Promise.all([
      db.from('profiles').select('display_name, email, instagram, website, disaffiliated_at, hidden_at').eq('id', data.owner_id).maybeSingle(),
      db.from('venue_calendar_days').select('day, kind').eq('venue_id', data.id),
      db.rpc('sponsor_completed_count', { p_profile_id: data.owner_id }),
      db.from('venue_media').select('storage_path').eq('venue_id', data.id).order('sort_order'),
    ])
    return { ...data, owner, days: days ?? [], completedEvents: count ?? 0, gallery: gallery ?? [] }
  },
  { watch: [slug] },
)

const coverSrc = computed(() => publicStorageUrl(supabaseUrl.value, 'venues', venue.value?.cover_storage_path ?? null))
const galleryUrls = computed(() =>
  (venue.value?.gallery ?? [])
    .map((item) => publicStorageUrl(supabaseUrl.value, 'venues', item.storage_path))
    .filter((url): url is string => Boolean(url)),
)

useSeoMeta({
  title: () => venue.value?.name ?? 'Espacio',
  description: () => venue.value?.description ?? 'Espacio de la red Redeventos',
  ogImage: () => coverSrc.value ?? undefined,
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="reading-surface max-w-3xl space-y-6 p-6 sm:p-8">
        <div v-if="!venue">
          <h1 class="text-2xl font-semibold">Espacio no encontrado</h1>
        </div>
        <template v-else>
          <MediaVenueCover :src="coverSrc" :name="venue.name" priority />
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-semibold">{{ venue.name }}</h1>
            <SealBadge
              :disaffiliated="Boolean(venue.owner?.disaffiliated_at)"
              :hidden="Boolean(venue.owner?.hidden_at)"
              :has-sponsor-role="true"
              :profile-complete="Boolean(venue.owner?.display_name && venue.owner?.email)"
              :completed-events="venue.completedEvents"
            />
          </div>
          <p class="text-sm text-muted">{{ CITY_LABELS[venue.city] }} · {{ venue.zone }} · {{ SUPPORT_LABELS[venue.support_mode] }}</p>
          <p>{{ venue.description }}</p>
          <MediaVenueGallery :urls="galleryUrls" :name="venue.name" />
          <p class="text-sm">Capacidad: {{ venue.capacity }}. Equipamiento: {{ venue.equipment }}</p>
          <section class="space-y-2">
            <h2 class="text-lg font-semibold">Días ocupados</h2>
            <p class="text-sm text-muted">Si un día no aparece, se entiende libre. No hay un calendario de precios.</p>
            <p v-if="!venue.days.length" class="text-sm" role="status">No hay días en negociación ni comprometidos.</p>
            <ul class="space-y-1 text-sm">
              <li v-for="day in venue.days" :key="`${day.day}-${day.kind}`">
                {{ day.day ? formatBogotaDate(day.day) : day.day }} · {{ day.kind === 'committed' ? 'Comprometido' : 'En negociación' }}
              </li>
            </ul>
          </section>
          <section v-if="venue.owner" class="space-y-1 text-sm">
            <h2 class="text-lg font-semibold">Contacto público</h2>
            <p>{{ venue.owner.display_name }}</p>
            <p>{{ venue.owner.email }}</p>
            <p v-if="venue.owner.instagram">{{ venue.owner.instagram }}</p>
            <p v-if="venue.owner.website">
              <a :href="venue.owner.website" class="text-primary">{{ venue.owner.website }}</a>
            </p>
          </section>
          <ReportForm target-type="profile" :target-id="venue.owner_id" />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
