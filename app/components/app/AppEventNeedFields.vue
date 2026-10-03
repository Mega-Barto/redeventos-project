<script setup lang="ts">
import type { NeedType } from '~~/shared/constants/domain'
import { appEventNewContent } from '~~/shared/content/app'
import { hasNeedQuantity } from '~~/shared/utils/need-quantity'

defineProps<{
  index: number
  needItems: Array<{ label: string; value: NeedType }>
}>()

const type = defineModel<NeedType>('type', { required: true })
const description = defineModel<string>('description', { required: true })
const quantity = defineModel<number | null>('quantity', { required: true })
const unit = defineModel<string>('unit', { required: true })

const unitEnabled = computed(() => hasNeedQuantity(quantity.value))

watch(quantity, (value) => {
  if (!hasNeedQuantity(value)) unit.value = ''
})
</script>

<template>
  <div class="space-y-3">
    <UFormField :name="`needs.${index}.type`" label="Tipo">
      <USelect v-model="type" :items="needItems" class="w-full" />
    </UFormField>
    <UFormField :name="`needs.${index}.description`" label="Qué se pide" required>
      <UInput v-model="description" class="w-full" />
    </UFormField>
    <div class="grid gap-3 md:grid-cols-2">
      <UFormField :name="`needs.${index}.quantity`" label="Cantidad" :hint="appEventNewContent.quantityHint">
        <UInput v-model.nullable="quantity" type="number" min="1" class="w-full" />
      </UFormField>
      <UFormField
        :name="`needs.${index}.unit`"
        label="Unidad"
        :hint="appEventNewContent.unitHint"
        :required="unitEnabled"
      >
        <UInput v-model="unit" class="w-full" :disabled="!unitEnabled" />
      </UFormField>
    </div>
  </div>
</template>
