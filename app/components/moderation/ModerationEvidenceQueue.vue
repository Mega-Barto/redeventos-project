<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'
import type { PendingEvidenceRow } from '~~/shared/utils/moderation-evidence'

defineProps<{
  rows: PendingEvidenceRow[]
  pending: boolean
  notes: Record<string, string>
  supabaseUrl: string
}>()

defineEmits<{
  decide: [id: string, decision: 'approved' | 'rejected']
}>()
</script>

<template>
  <section class="space-y-3">
    <p v-if="!rows.length" class="text-muted" role="status">{{ appModerationContent.evidenceEmpty }}</p>
    <ModerationEvidenceCard
      v-for="row in rows"
      :key="row.id"
      :row="row"
      :pending="pending"
      :notes="notes"
      :supabase-url="supabaseUrl"
      @decide="(id, decision) => $emit('decide', id, decision)"
    />
  </section>
</template>
