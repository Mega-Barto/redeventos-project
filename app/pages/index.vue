<script setup lang="ts">
import { homeHeroContent } from '~~/shared/content/home'

useSeoMeta({
  title: homeHeroContent.title,
  description: homeHeroContent.description,
})
</script>

<template>
  <HomeHero />
  <HomeProblem />
  <HomeHowItWorks />
  <HomeProfiles />
  <HomeTrust />
  <HomeCta />
</template>
