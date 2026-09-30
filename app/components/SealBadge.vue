<script setup lang="ts">
import { SEAL_LABELS } from '~~/shared/constants/labels'
import { type SealLevel, sealLevel } from '~~/shared/domain/rules'

const props = defineProps<{
  disaffiliated: boolean
  hidden: boolean
  hasSponsorRole: boolean
  profileComplete: boolean
  completedEvents: number
}>()

const level = computed<SealLevel | null>(() => sealLevel(props))
</script>

<template>
  <UBadge v-if="level" color="primary" variant="subtle">{{ SEAL_LABELS[level] }}</UBadge>
</template>
