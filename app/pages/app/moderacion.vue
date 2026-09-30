<script setup lang="ts">
import { appModerationContent } from '~~/shared/content/app'

definePageMeta({ layout: 'app', middleware: ['auth', 'onboarding', 'moderator'] })

useSeoMeta({ title: appModerationContent.title, description: appModerationContent.description })

const pending = ref(false)
const errorMessage = ref('')
const notes = reactive<Record<string, string>>({})
const profileId = ref('')

const { data, refresh } = await useAsyncData('moderation', async () => {
  const [evidence, reports] = await Promise.all([listPendingEvidence(), listOpenReports()])
  return { evidence, reports }
})

async function run(action: () => Promise<{ error: string | null }>) {
  pending.value = true
  errorMessage.value = ''
  const result = await action()
  pending.value = false
  if (result.error) {
    errorMessage.value = result.error
    return
  }
  await refresh()
}

function decide(evidenceId: string, decision: 'approved' | 'rejected') {
  return run(() => reviewEvidence({ evidenceId, decision, note: notes[evidenceId] ?? '' }))
}
</script>

<template>
  <AppPanel :title="appModerationContent.title" :description="appModerationContent.description">
    <UAlert v-if="errorMessage || data?.evidence.error || data?.reports.error" color="error" variant="subtle" :title="errorMessage || data?.evidence.error || data?.reports.error || ''" />
    <section class="space-y-3">
      <h2 class="font-semibold">{{ appModerationContent.evidenceTitle }}</h2>
      <p v-if="!data?.evidence.rows.length" class="text-muted" role="status">{{ appModerationContent.evidenceEmpty }}</p>
      <UCard v-for="row in data?.evidence.rows" :key="row.id" class="space-y-2">
        <p class="font-medium">{{ row.title }}</p>
        <p>Asistencia: {{ row.attendance_count }}</p>
        <p>{{ row.venue_note }}</p>
        <p>{{ row.contributions_note }}</p>
        <UFormField label="Nota">
          <UTextarea v-model="notes[row.id]" class="w-full" />
        </UFormField>
        <div class="flex gap-2">
          <UButton :label="appModerationContent.approve" :loading="pending" @click="decide(row.id, 'approved')" />
          <UButton :label="appModerationContent.reject" color="neutral" variant="soft" :loading="pending" @click="decide(row.id, 'rejected')" />
        </div>
      </UCard>
    </section>
    <section class="space-y-3">
      <h2 class="font-semibold">{{ appModerationContent.reportsTitle }}</h2>
      <p v-if="!data?.reports.rows.length" class="text-muted" role="status">{{ appModerationContent.reportsEmpty }}</p>
      <UCard v-for="report in data?.reports.rows" :key="report.id" class="space-y-2">
        <p class="text-sm text-muted">{{ report.target_type }} · {{ report.target_id }}</p>
        <p>{{ report.reason }}</p>
        <UButton
          :label="appModerationContent.hide"
          color="neutral"
          variant="soft"
          :loading="pending"
          @click="run(() => hideReportTarget(report.target_type, report.target_id))"
        />
      </UCard>
    </section>
    <section class="space-y-3">
      <h2 class="font-semibold">{{ appModerationContent.disaffiliateTitle }}</h2>
      <p class="text-sm text-muted">{{ appModerationContent.disaffiliateDescription }}</p>
      <UFormField label="Identificador del perfil">
        <UInput v-model="profileId" class="w-full" />
      </UFormField>
      <UButton :label="appModerationContent.disaffiliate" color="error" :loading="pending" @click="run(() => disaffiliate({ profileId }))" />
    </section>
  </AppPanel>
</template>
