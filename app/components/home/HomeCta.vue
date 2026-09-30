<script setup lang="ts">
import { homeCtaContent } from '~~/shared/content/home'

const links = [
  { label: homeCtaContent.primaryCta.label, to: homeCtaContent.primaryCta.to },
  {
    label: homeCtaContent.secondaryCta.label,
    to: homeCtaContent.secondaryCta.to,
    color: 'neutral' as const,
    variant: 'subtle' as const,
  },
]
</script>

<template>
  <UPageCTA :title="homeCtaContent.title" :description="homeCtaContent.description" :links="links" />
</template>
