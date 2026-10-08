<script setup lang="ts">
import type { EventSupporter } from '~~/shared/utils/event-supporters'

defineProps<{
  supporter: EventSupporter
}>()
</script>

<template>
  <li>
    <ULink
      v-if="supporter.partyHref"
      :to="supporter.partyHref"
      class="font-medium text-highlighted hover:text-primary"
    >
      {{ supporter.partyName }}
    </ULink>
    <span v-else class="font-medium text-highlighted">{{ supporter.partyName }}</span>
  </li>
</template>
