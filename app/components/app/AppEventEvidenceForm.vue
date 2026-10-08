<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { EvidenceNeedField } from '~/components/app/AppEventEvidenceContributionFields.vue'
import { appEventDetailContent } from '~~/shared/content/app'
import { mediaContent } from '~~/shared/content/media'
import { type EvidenceInput, evidenceSchemaForNeeds } from '~~/shared/schemas/inputs'
import { asFileList } from '~~/shared/utils/public-media'

const props = defineProps<{
  needs: EvidenceNeedField[]
  pending?: boolean
  existingUrls?: string[]
}>()

const emit = defineEmits<{ submit: [EvidenceInput, File[]] }>()

const contributionNotesByNeed = ref<Record<string, string>>({})
const state = reactive({
  attendanceCount: 1,
  venueNote: '',
  contributionNotes: [] as EvidenceInput['contributionNotes'],
})
const files = ref<File | File[] | null>(null)

const schema = computed(() => evidenceSchemaForNeeds(props.needs.map((need) => need.id)))

watch(
  [contributionNotesByNeed, () => props.needs],
  ([byNeed, needs]) => {
    state.contributionNotes = needs.map((need) => ({
      needId: need.id,
      note: byNeed[need.id] ?? '',
    }))
  },
  { deep: true, immediate: true },
)

function onSubmit(event: FormSubmitEvent<EvidenceInput>) {
  emit('submit', event.data, asFileList(files.value))
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
    <UFormField name="attendanceCount" label="Personas que asistieron" required>
      <UInput v-model.number="state.attendanceCount" type="number" min="1" class="w-full" />
    </UFormField>
    <UFormField name="venueNote" :label="appEventDetailContent.evidenceVenueLabel" required>
      <UTextarea v-model="state.venueNote" class="w-full" />
    </UFormField>
    <AppEventEvidenceContributionFields v-model="contributionNotesByNeed" :needs="needs" />
    <div v-if="existingUrls?.length" class="space-y-2">
      <p class="text-sm font-medium">{{ mediaContent.pendingPhotos }}</p>
      <MediaVenueGallery :urls="existingUrls" :name="mediaContent.evidenceAlt" />
    </div>
    <AppMediaFileField v-model="files" multiple :label="mediaContent.evidenceLabel" :hint="mediaContent.evidenceHint" />
    <UButton type="submit" label="Enviar evidencia" :loading="pending" />
  </UForm>
</template>
