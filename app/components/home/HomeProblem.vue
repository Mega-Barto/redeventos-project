<script setup lang="ts">
import { homeProblemContent } from '~~/shared/content/home'
</script>

<template>
  <UPageSection
    :id="homeProblemContent.id"
    :headline="homeProblemContent.headline"
    :title="homeProblemContent.title"
    :description="homeProblemContent.description"
    :features="[...homeProblemContent.items]"
  />
</template>
