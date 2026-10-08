<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS } from '~~/shared/constants/labels'
import { eventPublicContent } from '~~/shared/content/event'
import { formatBogotaDate } from '~~/shared/domain/rules'
import { mapPublicEventSupporter, publicEventSupporters } from '~~/shared/utils/event-supporters'
import { publicStorageUrl } from '~~/shared/utils/storage-url'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()
const supabaseUrl = useSupabaseUrl()
const userId = useUserId()

const { data: event } = await useAsyncData(
  () => `public-event-${slug.value}`,
  async () => {
    if (!configured.value) return null
    const db = useDb()
    const { data } = await db
      .from('events')
      .select(
        'id, slug, title, category, city, starts_on, place_name, description, audience, sponsor_benefit, rsvp_url, expected_attendees, organizer_id',
      )
      .eq('slug', slug.value)
      .eq('status', 'public')
      .is('hidden_at', null)
      .maybeSingle()
    if (!data) return null

    const [{ data: organizer }, { data: supporters }, { data: media }] = await Promise.all([
      db.from('profiles').select('display_name, slug').eq('id', data.organizer_id).maybeSingle(),
      db
        .from('public_event_supporters')
        .select(
          'event_id, event_slug, need_id, need_type, need_description, party_kind, party_name, party_slug, party_href, person_name, support_status, sort_rank',
        )
        .eq('event_id', data.id)
        .eq('support_status', 'confirmed')
        .order('sort_rank'),
      db
        .from('public_case_media')
        .select('storage_path')
        .eq('event_slug', data.slug)
        .order('sort_order'),
    ])

    return {
      ...data,
      organizer,
      supporters: publicEventSupporters((supporters ?? []).map(mapPublicEventSupporter)),
      media: media ?? [],
    }
  },
  { watch: [slug] },
)

const dateLabel = computed(() =>
  event.value?.starts_on ? formatBogotaDate(event.value.starts_on) : eventPublicContent.datePending,
)

const evidenceUrls = computed(() =>
  (event.value?.media ?? [])
    .map((row) => publicStorageUrl(supabaseUrl.value, 'evidence', row.storage_path))
    .filter((url): url is string => Boolean(url)),
)

const hasEvidence = computed(() => evidenceUrls.value.length > 0)
const evidenceHref = computed(() => (hasEvidence.value ? `#event-evidence` : null))

useSeoMeta({
  title: () => event.value?.title ?? 'Evento',
  description: () => event.value?.description ?? 'Ficha pública de Redeventos',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="reading-surface max-w-3xl space-y-8 p-6 sm:p-8">
        <div v-if="!event" class="space-y-3">
          <h1 class="text-2xl font-semibold">{{ eventPublicContent.missingTitle }}</h1>
          <p class="text-muted">{{ eventPublicContent.missingDescription }}</p>
          <UButton to="/cases" :label="eventPublicContent.casesCta" color="neutral" variant="soft" />
        </div>
        <template v-else>
          <EventPublicHero
            :category-label="CATEGORY_LABELS[event.category]"
            :city-label="CITY_LABELS[event.city]"
            :title="event.title"
            :description="event.description"
          />
          <EventPublicFacts
            :date-label="dateLabel"
            :place-name="event.place_name"
            :audience="event.audience"
            :expected-attendees="event.expected_attendees"
          />
          <UButton :to="event.rsvp_url" :label="eventPublicContent.rsvpLabel" target="_blank" external />
          <EventPublicNetwork
            :supporters="event.supporters"
            :event-id="event.id"
            :show-support-cta="userId !== event.organizer_id"
            :has-evidence="hasEvidence"
            :evidence-href="evidenceHref"
          />
          <div id="event-evidence">
            <EventPublicEvidence :urls="evidenceUrls" :title="event.title" />
          </div>
          <ReportForm target-type="event" :target-id="event.id" />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
