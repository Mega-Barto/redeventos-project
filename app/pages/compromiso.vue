<script setup lang="ts">
import { commitmentContent } from '~~/shared/content/legal'

useSeoMeta({
  title: commitmentContent.title,
  description: commitmentContent.intro,
})
</script>

<template>
  <UPage>
    <UPageHeader :title="commitmentContent.title" :description="commitmentContent.intro" />
    <UPageBody>
      <UContainer class="max-w-3xl space-y-6">
        <p class="text-sm text-muted">Versión {{ commitmentContent.version }}</p>
        <ul class="list-disc space-y-3 pl-5 text-muted">
          <li v-for="rule in commitmentContent.rules" :key="rule">{{ rule }}</li>
        </ul>
        <p>{{ commitmentContent.closing }}</p>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
