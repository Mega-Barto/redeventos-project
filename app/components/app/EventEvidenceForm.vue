<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { type EvidenceInput, evidenceSchema } from '~~/shared/schemas/inputs'

const emit = defineEmits<{ submit: [EvidenceInput, File[]] }>()
defineProps<{ pending?: boolean }>()

const state = reactive({
  attendanceCount: 1,
  venueNote: '',
  contributionsNote: '',
})
const files = ref<File[]>([])

function onFiles(event: Event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  files.value = [...(input.files ?? [])]
}

function onSubmit(event: FormSubmitEvent<EvidenceInput>) {
  emit('submit', event.data, files.value)
}
</script>

<template>
  <UForm :schema="evidenceSchema" :state="state" class="space-y-3" @submit="onSubmit">
    <UFormField name="attendanceCount" label="Personas que asistieron" required>
      <UInput v-model.number="state.attendanceCount" type="number" min="1" class="w-full" />
    </UFormField>
    <UFormField name="venueNote" label="Espacio que recibió el evento" required>
      <UTextarea v-model="state.venueNote" class="w-full" />
    </UFormField>
    <UFormField name="contributionsNote" label="Aportes cumplidos" required>
      <UTextarea v-model="state.contributionsNote" class="w-full" />
    </UFormField>
    <UFormField label="Fotos" hint="Opcional. jpeg, png, webp o avif, hasta 5 MB.">
      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple @change="onFiles" />
    </UFormField>
    <UButton type="submit" label="Enviar evidencia" :loading="pending" />
  </UForm>
</template>
