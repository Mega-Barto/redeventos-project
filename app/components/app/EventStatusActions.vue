<script setup lang="ts">
import type { EventStatus } from '~~/shared/constants/domain'

defineProps<{
  status: EventStatus
  publicTo: string | null
  pending?: boolean
}>()

const emit = defineEmits<{ publish: []; cancel: [] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UButton v-if="status === 'draft'" label="Publicar para sponsors" :loading="pending" @click="emit('publish')" />
    <UButton
      v-if="status === 'published' || status === 'public'"
      label="Cancelar evento"
      color="neutral"
      variant="soft"
      :loading="pending"
      @click="emit('cancel')"
    />
    <UButton v-if="publicTo" :to="publicTo" label="Ver ficha pública" color="neutral" variant="outline" />
  </div>
</template>
