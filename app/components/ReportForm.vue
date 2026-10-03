<script setup lang="ts">
import { reportSchema } from '~~/shared/schemas/inputs'

const props = defineProps<{
  targetType: 'event' | 'profile'
  targetId: string
}>()

const reason = ref('')
const message = ref('')
const pending = ref(false)

async function submit() {
  const userId = useUserId().value
  if (!userId) {
    await navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`)
    return
  }
  const parsed = reportSchema.safeParse({
    targetType: props.targetType,
    targetId: props.targetId,
    reason: reason.value,
  })
  if (!parsed.success) {
    message.value = parsed.error.issues[0]?.message ?? 'Revisa el reporte'
    return
  }
  pending.value = true
  const { error } = await useDb().from('reports').insert({
    reporter_id: userId,
    target_type: parsed.data.targetType,
    target_id: parsed.data.targetId,
    reason: parsed.data.reason,
  })
  pending.value = false
  message.value = error ? error.message : 'Reporte enviado. El moderador puede ocultar el contenido.'
  if (!error) reason.value = ''
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <UFormField label="Reportar contenido">
      <UTextarea v-model="reason" placeholder="Describe qué ocurre" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Enviar reporte" color="neutral" variant="soft" :loading="pending" />
    <p v-if="message" class="text-sm text-muted" role="status">{{ message }}</p>
  </form>
</template>
