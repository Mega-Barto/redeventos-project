<script setup lang="ts">
import { homeHowContent } from '~~/shared/content/home'
</script>

<template>
  <UPageSection
    :id="homeHowContent.id"
    :headline="homeHowContent.headline"
    :title="homeHowContent.title"
    :description="homeHowContent.description"
    :features="[...homeHowContent.steps]"
  />
</template>
