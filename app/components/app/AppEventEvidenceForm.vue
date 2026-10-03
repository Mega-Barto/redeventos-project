<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { mediaContent } from '~~/shared/content/media'
import { type EvidenceInput, evidenceSchema } from '~~/shared/schemas/inputs'
import { asFileList } from '~~/shared/utils/public-media'

const emit = defineEmits<{ submit: [EvidenceInput, File[]] }>()
defineProps<{
  pending?: boolean
  existingUrls?: string[]
}>()

const state = reactive({
  attendanceCount: 1,
  venueNote: '',
  contributionsNote: '',
})
const files = ref<File | File[] | null>(null)

function onSubmit(event: FormSubmitEvent<EvidenceInput>) {
  emit('submit', event.data, asFileList(files.value))
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
    <div v-if="existingUrls?.length" class="space-y-2">
      <p class="text-sm font-medium">{{ mediaContent.pendingPhotos }}</p>
      <MediaVenueGallery :urls="existingUrls" :name="mediaContent.evidenceAlt" />
    </div>
    <AppMediaFileField v-model="files" multiple :label="mediaContent.evidenceLabel" :hint="mediaContent.evidenceHint" />
    <UButton type="submit" label="Enviar evidencia" :loading="pending" />
  </UForm>
</template>
