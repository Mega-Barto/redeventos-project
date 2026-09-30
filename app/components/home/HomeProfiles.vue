<script setup lang="ts">
import { homeProfilesContent } from '~~/shared/content/home'
</script>

<template>
  <UPageSection
    :id="homeProfilesContent.id"
    :headline="homeProfilesContent.headline"
    :title="homeProfilesContent.title"
    :description="homeProfilesContent.description"
  >
    <UPageGrid>
      <UPageCard
        v-for="profile in homeProfilesContent.profiles"
        :key="profile.title"
        :title="profile.title"
        :description="profile.description"
        :icon="profile.icon"
        :to="profile.to"
      >
        <template #footer>
          <span class="text-sm font-medium text-primary">{{ profile.cta }}</span>
        </template>
      </UPageCard>
    </UPageGrid>
  </UPageSection>
</template>
