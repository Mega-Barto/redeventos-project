<script setup lang="ts">
import { lavaBlobs } from '~~/shared/content/brand-lava'
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden bg-[#021A18]" aria-hidden="true">
    <div
      v-for="blob in lavaBlobs"
      :key="blob.id"
      class="lava-blob absolute rounded-full mix-blend-screen blur-[64px]"
      :class="blob.motion"
      :style="{
        backgroundColor: blob.color,
        width: blob.size,
        height: blob.size,
        left: blob.left,
        top: blob.top,
        animationDuration: blob.duration,
        animationDelay: blob.delay,
      }"
    />
  </div>
</template>
