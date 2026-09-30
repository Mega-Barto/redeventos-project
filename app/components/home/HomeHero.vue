<script setup lang="ts">
import { homeHeroContent } from '~~/shared/content/home'

const links = [
  {
    label: homeHeroContent.primaryCta.label,
    to: homeHeroContent.primaryCta.to,
    icon: 'i-lucide-calendar-plus',
  },
  {
    label: homeHeroContent.secondaryCta.label,
    to: homeHeroContent.secondaryCta.to,
    color: 'neutral' as const,
    variant: 'subtle' as const,
    trailingIcon: 'i-lucide-arrow-right',
  },
]
</script>

<template>
  <UPageHero :title="homeHeroContent.title" :description="homeHeroContent.description" :links="links" />
</template>
