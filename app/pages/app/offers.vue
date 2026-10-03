<script setup lang="ts">
import { OFFER_STATUS_LABELS } from '~~/shared/constants/labels'
import { appOffersContent } from '~~/shared/content/app'
import { canAcceptOffer } from '~~/shared/domain/rules'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding'] })

useSeoMeta({ title: appOffersContent.title, description: appOffersContent.description })

const userId = useUserId()
const pending = ref(false)
const errorMessage = ref('')

const { data, refresh } = await useAsyncData(
  'my-offers',
  async () => (userId.value ? listMyOffers(userId.value) : { offers: [], error: null as string | null }),
  { watch: [userId] },
)

const incoming = computed(() => (data.value?.offers ?? []).filter((offer) => offer.recipient_id === userId.value))
const outgoing = computed(() => (data.value?.offers ?? []).filter((offer) => offer.proposer_id === userId.value))

async function run(action: () => Promise<{ error: string | null }>) {
  pending.value = true
  errorMessage.value = ''
  const result = await action()
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  await refresh()
}
</script>

<template>
  <AppPanel :title="appOffersContent.title" :description="appOffersContent.description">
    <UAlert v-if="errorMessage || data?.error" color="error" variant="subtle" :title="errorMessage || data?.error || ''" />
    <p v-if="!data?.offers.length" class="text-muted" role="status">{{ appOffersContent.empty }}</p>
    <section v-if="incoming.length" class="space-y-3">
      <h2 class="font-semibold">{{ appOffersContent.incoming }}</h2>
      <UCard v-for="offer in incoming" :key="offer.id" class="space-y-2">
        <p class="font-medium">{{ offer.eventTitle }}</p>
        <p class="text-sm text-muted">{{ OFFER_STATUS_LABELS[offer.status] }} · {{ offer.quantity }} · {{ offer.offer_on }}</p>
        <p>{{ offer.note }}</p>
        <p v-if="offer.commitment">
          Compromiso: {{ offer.commitment.what }} · {{ offer.commitment.quantity }} · {{ offer.commitment.when_on }}
        </p>
        <p v-if="offer.direct">
          {{ appOffersContent.contacts }}: {{ offer.direct.whatsapp || 'sin WhatsApp' }} · {{ offer.direct.phone || 'sin teléfono' }}
        </p>
        <div v-if="userId && canAcceptOffer({ status: offer.status, recipientId: offer.recipient_id, viewerId: userId })" class="flex gap-2">
          <UButton :label="appOffersContent.accept" :loading="pending" @click="run(() => acceptOffer(offer.id))" />
          <UButton :label="appOffersContent.reject" color="neutral" variant="soft" :loading="pending" @click="run(() => rejectOffer(offer.id))" />
        </div>
      </UCard>
    </section>
    <section v-if="outgoing.length" class="space-y-3">
      <h2 class="font-semibold">{{ appOffersContent.outgoing }}</h2>
      <UCard v-for="offer in outgoing" :key="offer.id" class="space-y-2">
        <p class="font-medium">{{ offer.eventTitle }}</p>
        <p class="text-sm text-muted">{{ OFFER_STATUS_LABELS[offer.status] }} · {{ offer.quantity }} · {{ offer.offer_on }}</p>
        <p>{{ offer.note }}</p>
        <p v-if="offer.commitment">
          Compromiso: {{ offer.commitment.what }} · {{ offer.commitment.quantity }} · {{ offer.commitment.when_on }}
        </p>
        <p v-if="offer.direct">
          {{ appOffersContent.contacts }}: {{ offer.direct.whatsapp || 'sin WhatsApp' }} · {{ offer.direct.phone || 'sin teléfono' }}
        </p>
        <UButton
          v-if="offer.status === 'pending'"
          :label="appOffersContent.cancel"
          color="neutral"
          variant="soft"
          :loading="pending"
          @click="run(() => cancelOffer(offer.id))"
        />
      </UCard>
    </section>
  </AppPanel>
</template>
