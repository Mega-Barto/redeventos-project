<script setup lang="ts">
import { CATEGORY_LABELS, CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { formatBogotaDate } from '~~/shared/domain/rules'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const configured = useSupabaseConfigured()

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
    const [{ data: needs }, { data: organizer }] = await Promise.all([
      db.from('event_needs').select('id, type, description, status').eq('event_id', data.id),
      db.from('profiles').select('display_name, slug').eq('id', data.organizer_id).maybeSingle(),
    ])
    return { ...data, needs: needs ?? [], organizer }
  },
  { watch: [slug] },
)

useSeoMeta({
  title: () => event.value?.title ?? 'Evento',
  description: () => event.value?.description ?? 'Ficha pública de Redeventos',
})
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="max-w-3xl space-y-6">
        <div v-if="!event" class="space-y-3">
          <h1 class="text-2xl font-semibold">Este evento no está público</h1>
          <p class="text-muted">La ficha aparece cuando hay fecha concreta y lugar. Si ya se realizó, búscalo en casos.</p>
          <UButton to="/casos" label="Ver casos" color="neutral" variant="soft" />
        </div>
        <template v-else>
          <p class="text-sm text-muted">{{ CATEGORY_LABELS[event.category] }} · {{ CITY_LABELS[event.city] }}</p>
          <h1 class="text-3xl font-semibold">{{ event.title }}</h1>
          <p>{{ event.description }}</p>
          <dl class="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt class="text-muted">Fecha</dt>
              <dd>{{ event.starts_on ? formatBogotaDate(event.starts_on) : 'Por confirmar' }}</dd>
            </div>
            <div>
              <dt class="text-muted">Lugar</dt>
              <dd>{{ event.place_name }}</dd>
            </div>
            <div>
              <dt class="text-muted">Audiencia</dt>
              <dd>{{ event.audience }}</dd>
            </div>
            <div>
              <dt class="text-muted">Asistentes esperados</dt>
              <dd>{{ event.expected_attendees }}</dd>
            </div>
          </dl>
          <UButton :to="event.rsvp_url" label="Inscribirme" target="_blank" external />
          <section class="space-y-2">
            <h2 class="text-lg font-semibold">Qué hizo posible el evento</h2>
            <ul class="space-y-1 text-sm text-muted">
              <li v-for="need in event.needs" :key="need.id">{{ NEED_LABELS[need.type] }}: {{ need.description }}</li>
            </ul>
          </section>
          <ReportForm target-type="event" :target-id="event.id" />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
