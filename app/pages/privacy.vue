<script setup lang="ts">
import { privacyContent } from '~~/shared/content/legal'

useSeoMeta({
  title: privacyContent.title,
  description: privacyContent.intro,
})
</script>

<template>
  <UPage>
    <UPageHeader :title="privacyContent.title" :description="privacyContent.intro" />
    <UPageBody>
      <UContainer>
        <div class="reading-surface max-w-3xl space-y-8 p-6 sm:p-8">
          <p class="text-sm text-muted">Versión {{ privacyContent.version }}</p>
          <section v-for="section in privacyContent.sections" :key="section.title" class="space-y-2">
            <h2 class="text-lg font-semibold">{{ section.title }}</h2>
            <p class="text-muted">{{ section.body }}</p>
          </section>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
