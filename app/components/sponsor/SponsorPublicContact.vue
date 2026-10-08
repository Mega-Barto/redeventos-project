<script setup lang="ts">
import { sponsorPublicContent } from '~~/shared/content/sponsor'

defineProps<{
  email: string
  instagram?: string | null
  website?: string | null
}>()
</script>

<template>
  <section class="space-y-2">
    <h2 class="text-lg font-semibold">{{ sponsorPublicContent.contactHeading }}</h2>
    <div class="space-y-1 text-sm text-default">
      <p>{{ email }}</p>
      <p v-if="instagram">{{ instagram }}</p>
      <p v-if="website">
        <a :href="website" class="text-primary" rel="noopener noreferrer">{{ website }}</a>
      </p>
    </div>
  </section>
</template>
