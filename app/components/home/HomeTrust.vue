<script setup lang="ts">
import { homeTrustContent } from '~~/shared/content/home'
</script>

<template>
  <UPageSection
    :id="homeTrustContent.id"
    :headline="homeTrustContent.headline"
    :title="homeTrustContent.title"
    :features="[...homeTrustContent.items]"
  />
</template>
