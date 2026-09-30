<script setup lang="ts">
import type { Candidate } from '~/composables/usePilot'
import { createOfferSchema } from '~~/shared/schemas/inputs'

const props = defineProps<{
  eventId: string
  eventNeedId: string
  candidates: Candidate[]
  pending?: boolean
  fixedRecipientId?: string
  fixedVenueId?: string | null
}>()

const emit = defineEmits<{
  submit: [
    {
      eventNeedId: string
      eventId: string
      recipientId: string
      venueId: string | null
      quantity: number
      offerOn: string
      note: string
    },
  ]
}>()

const state = reactive({
  recipientKey: props.candidates[0] ? `${props.candidates[0].recipientId}:${props.candidates[0].venueId ?? ''}` : '',
  quantity: 1,
  offerOn: '',
  note: '',
})

const items = computed(() =>
  props.candidates.map((candidate) => ({
    label: candidate.label,
    value: `${candidate.recipientId}:${candidate.venueId ?? ''}`,
  })),
)

const errorMessage = ref('')

function onSubmit() {
  errorMessage.value = ''
  const selected = props.candidates.find(
    (candidate) => `${candidate.recipientId}:${candidate.venueId ?? ''}` === state.recipientKey,
  )
  const recipientId = props.fixedRecipientId ?? selected?.recipientId ?? ''
  const venueId = props.fixedVenueId !== undefined ? props.fixedVenueId : (selected?.venueId ?? null)
  const parsed = createOfferSchema.safeParse({
    eventNeedId: props.eventNeedId,
    eventId: props.eventId,
    recipientId,
    venueId,
    quantity: state.quantity,
    offerOn: state.offerOn,
    note: state.note,
  })
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? 'Revisa la propuesta'
    return
  }
  emit('submit', parsed.data)
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <UAlert v-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
    <UFormField v-if="!fixedRecipientId" label="A quién propones" required>
      <USelect v-model="state.recipientKey" :items="items" placeholder="Elige un espacio o aliado" class="w-full" />
    </UFormField>
    <div class="grid gap-3 md:grid-cols-2">
      <UFormField label="Cantidad" required>
        <UInput v-model.number="state.quantity" type="number" min="1" class="w-full" />
      </UFormField>
      <UFormField label="Fecha del aporte" required>
        <UInput v-model="state.offerOn" type="date" class="w-full" />
      </UFormField>
    </div>
    <UFormField label="Nota" required>
      <UTextarea v-model="state.note" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Enviar propuesta" :loading="pending" />
  </form>
</template>
