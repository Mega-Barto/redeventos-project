<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CITIES, VENUE_SUPPORT_MODES } from '~~/shared/constants/domain'
import { CITY_LABELS, SUPPORT_LABELS } from '~~/shared/constants/labels'
import { type VenueInput, venueSchema } from '~~/shared/schemas/inputs'

const emit = defineEmits<{ submit: [VenueInput] }>()
const props = defineProps<{ pending?: boolean; initial?: Partial<VenueInput> }>()

const state = reactive<VenueInput>({
  name: props.initial?.name ?? '',
  city: props.initial?.city ?? 'pereira',
  zone: props.initial?.zone ?? '',
  capacity: props.initial?.capacity ?? 30,
  equipment: props.initial?.equipment ?? '',
  supportMode: props.initial?.supportMode ?? 'depends',
  description: props.initial?.description ?? '',
})

const cityItems = CITIES.map((city) => ({ label: CITY_LABELS[city], value: city }))
const supportItems = VENUE_SUPPORT_MODES.map((mode) => ({ label: SUPPORT_LABELS[mode], value: mode }))

function onSubmit(event: FormSubmitEvent<VenueInput>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :schema="venueSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="name" label="Nombre del espacio" required>
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <div class="grid gap-4 md:grid-cols-2">
      <UFormField name="city" label="Ciudad" required>
        <USelect v-model="state.city" :items="cityItems" class="w-full" />
      </UFormField>
      <UFormField name="zone" label="Zona" required>
        <UInput v-model="state.zone" class="w-full" />
      </UFormField>
    </div>
    <UFormField name="capacity" label="Capacidad" required>
      <UInput v-model.number="state.capacity" type="number" min="1" class="w-full" />
    </UFormField>
    <UFormField name="equipment" label="Equipamiento" required>
      <UTextarea v-model="state.equipment" class="w-full" />
    </UFormField>
    <UFormField name="supportMode" label="Modo de apoyo" required>
      <USelect v-model="state.supportMode" :items="supportItems" class="w-full" />
    </UFormField>
    <UFormField name="description" label="Descripción" required>
      <UTextarea v-model="state.description" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Publicar espacio" :loading="pending" />
  </UForm>
</template>
