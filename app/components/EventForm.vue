<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CITIES, EVENT_CATEGORIES, NEED_TYPES } from '~~/shared/constants/domain'
import { CATEGORY_LABELS, CITY_LABELS, NEED_LABELS } from '~~/shared/constants/labels'
import { type CreateEventInput, createEventSchema } from '~~/shared/schemas/inputs'

const emit = defineEmits<{ submit: [CreateEventInput] }>()
defineProps<{ pending?: boolean }>()

const state = reactive({
  title: '',
  category: undefined as CreateEventInput['category'] | undefined,
  city: undefined as CreateEventInput['city'] | undefined,
  dateMode: 'range' as 'range' | 'concrete',
  dateRangeLabel: '',
  startsOn: '',
  expectedAttendees: 20,
  description: '',
  audience: '',
  sponsorBenefit: '',
  rsvpUrl: '',
  needs: [{ type: 'venue' as CreateEventInput['needs'][number]['type'], description: '', quantity: 1, unit: 'unidad' }],
})

const categoryItems = EVENT_CATEGORIES.map((category) => ({ label: CATEGORY_LABELS[category], value: category }))
const cityItems = CITIES.map((city) => ({ label: CITY_LABELS[city], value: city }))
const needItems = NEED_TYPES.map((type) => ({ label: NEED_LABELS[type], value: type }))
const dateItems = [
  { label: 'Rango de fechas', value: 'range' },
  { label: 'Fecha concreta', value: 'concrete' },
]

function addNeed() {
  state.needs.push({ type: 'products', description: '', quantity: 1, unit: 'unidad' })
}

function onSubmit(event: FormSubmitEvent<CreateEventInput>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :schema="createEventSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="title" label="Nombre" required>
      <UInput v-model="state.title" class="w-full" />
    </UFormField>
    <div class="grid gap-4 md:grid-cols-2">
      <UFormField name="category" label="Categoría" required>
        <USelect v-model="state.category" :items="categoryItems" class="w-full" />
      </UFormField>
      <UFormField name="city" label="Ciudad" required>
        <USelect v-model="state.city" :items="cityItems" class="w-full" />
      </UFormField>
    </div>
    <UFormField name="dateMode" label="Fecha">
      <URadioGroup v-model="state.dateMode" :items="dateItems" />
    </UFormField>
    <UFormField v-if="state.dateMode === 'range'" name="dateRangeLabel" label="Rango" required>
      <UInput v-model="state.dateRangeLabel" placeholder="Segunda semana de octubre" class="w-full" />
    </UFormField>
    <UFormField v-else name="startsOn" label="Fecha concreta" required>
      <UInput v-model="state.startsOn" type="date" class="w-full" />
    </UFormField>
    <UFormField name="expectedAttendees" label="Asistentes esperados" required>
      <UInput v-model.number="state.expectedAttendees" type="number" min="1" class="w-full" />
    </UFormField>
    <UFormField name="description" label="Descripción" required>
      <UTextarea v-model="state.description" class="w-full" />
    </UFormField>
    <UFormField name="audience" label="Audiencia" required>
      <UTextarea v-model="state.audience" class="w-full" />
    </UFormField>
    <UFormField name="sponsorBenefit" label="Qué recibe el sponsor" required>
      <UTextarea v-model="state.sponsorBenefit" class="w-full" />
    </UFormField>
    <UFormField name="rsvpUrl" label="Enlace de inscripción" required>
      <UInput v-model="state.rsvpUrl" type="url" placeholder="https://" class="w-full" />
    </UFormField>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-medium">Necesidades</h2>
        <UButton type="button" label="Agregar" color="neutral" variant="soft" size="sm" @click="addNeed" />
      </div>
      <div v-for="(need, index) in state.needs" :key="index" class="space-y-3 rounded-lg border border-muted p-3">
        <UFormField :name="`needs.${index}.type`" label="Tipo">
          <USelect v-model="need.type" :items="needItems" class="w-full" />
        </UFormField>
        <UFormField :name="`needs.${index}.description`" label="Qué se pide" required>
          <UInput v-model="need.description" class="w-full" />
        </UFormField>
        <div class="grid gap-3 md:grid-cols-2">
          <UFormField :name="`needs.${index}.quantity`" label="Cantidad" required>
            <UInput v-model.number="need.quantity" type="number" min="1" class="w-full" />
          </UFormField>
          <UFormField :name="`needs.${index}.unit`" label="Unidad" required>
            <UInput v-model="need.unit" class="w-full" />
          </UFormField>
        </div>
      </div>
    </div>
    <UButton type="submit" label="Guardar borrador" :loading="pending" />
  </UForm>
</template>
