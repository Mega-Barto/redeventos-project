<script setup lang="ts">
import { IMAGE_MIME } from '~~/shared/constants/media'

defineProps<{
  label: string
  hint?: string
  multiple?: boolean
}>()

const model = defineModel<File | File[] | null>({ default: null })
</script>

<template>
  <UFormField :label="label" :hint="hint">
    <UFileUpload
      v-model="model"
      :accept="IMAGE_MIME.join(',')"
      :multiple="multiple"
      variant="area"
    />
  </UFormField>
</template>
