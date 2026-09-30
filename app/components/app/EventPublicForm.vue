<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { makePublicSchema } from '~~/shared/schemas/inputs'

const emit = defineEmits<{ submit: [{ startsOn: string; placeName: string; venueId: string | null }] }>()
defineProps<{ pending?: boolean }>()

const state = reactive({
  startsOn: '',
  placeName: '',
  venueId: null as string | null,
})

function onSubmit(event: FormSubmitEvent<{ startsOn: string; placeName: string; venueId: string | null }>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm :schema="makePublicSchema" :state="state" class="space-y-3" @submit="onSubmit">
    <UFormField name="startsOn" label="Fecha concreta" required>
      <UInput v-model="state.startsOn" type="date" class="w-full" />
    </UFormField>
    <UFormField name="placeName" label="Lugar" required>
      <UInput v-model="state.placeName" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Publicar ficha" :loading="pending" />
  </UForm>
</template>
