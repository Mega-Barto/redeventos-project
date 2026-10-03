<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { formatBogotaDate } from '~~/shared/domain/rules'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()

const { data: item } = await useAsyncData(
  () => `case-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const db = useDb()
    const [{ data }, { data: media }] = await Promise.all([
      db
        .from('public_cases')
        .select(
          'id, slug, title, category, city, starts_on, place_name, audience, sponsor_benefit, attendance_count, venue_note, contributions_note, cover_path',
        )
        .eq('slug', slug.value)
        .maybeSingle(),
      db.from('public_case_media').select('storage_path').eq('event_slug', slug.value).order('sort_order'),
    ])
    if (!data) return null
    return { ...data, media: media ?? [] }
  },
  { watch: [slug] },
)

const galleryUrls = computed(() =>
  (item.value?.media ?? [])
    .map((row) => publicStorageUrl(supabaseUrl.value, 'evidence', row.storage_path))
    .filter((url): url is string => Boolean(url)),
)
const coverSrc = computed(
  () => galleryUrls.value[0] ?? publicStorageUrl(supabaseUrl.value, 'evidence', item.value?.cover_path ?? null),
)

useSeoMeta({
  title: () => item.value?.title ?? 'Caso',
  description: () => item.value?.contributions_note ?? 'Caso de éxito de Redeventos',
  ogImage: () => coverSrc.value ?? undefined,
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="reading-surface max-w-3xl space-y-4 p-6 sm:p-8">
        <h1 v-if="!item" class="text-2xl font-semibold">Caso no encontrado</h1>
        <template v-else>
          <p class="text-sm text-muted">{{ item.category ? CATEGORY_LABELS[item.category] : '' }} · {{ item.city ? CITY_LABELS[item.city] : '' }}</p>
          <h1 class="text-3xl font-semibold">{{ item.title }}</h1>
          <p v-if="item.starts_on">{{ formatBogotaDate(item.starts_on) }}<span v-if="item.place_name"> · {{ item.place_name }}</span></p>
          <p>Asistieron {{ item.attendance_count }} personas, según la evidencia aprobada.</p>
          <MediaCaseGallery :urls="galleryUrls" :title="item.title" />
          <section>
            <h2 class="text-lg font-semibold">Espacio</h2>
            <p>{{ item.venue_note }}</p>
          </section>
          <section>
            <h2 class="text-lg font-semibold">Aportes</h2>
            <p>{{ item.contributions_note }}</p>
          </section>
          <p class="text-sm text-muted">Audiencia: {{ item.audience }}. A cambio, el evento ofreció: {{ item.sponsor_benefit }}.</p>
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
