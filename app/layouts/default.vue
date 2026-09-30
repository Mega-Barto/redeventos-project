<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { footerContent, headerActions, publicNav } from '~~/shared/content/nav'

const items = computed<NavigationMenuItem[]>(() => publicNav.map((item) => ({ label: item.label, to: item.to })))
</script>

<template>
  <div class="relative min-h-screen">
    <BrandAppLavaBackground />

    <div class="relative z-10 flex min-h-screen flex-col">
      <UHeader
        title="Redeventos"
        to="/"
        :ui="{
          root: 'bg-default/60 backdrop-blur-lg border-b border-muted/50',
        }"
      >
        <UNavigationMenu :items="items" />

        <template #right>
          <UButton :label="headerActions.signIn" to="/entrar" color="neutral" variant="ghost" />
          <UButton :label="headerActions.signUp" to="/registro" color="neutral" variant="soft" />
        </template>

        <template #body>
          <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
          <div class="mt-4 flex flex-col gap-2">
            <UButton :label="headerActions.signIn" to="/entrar" color="neutral" variant="ghost" block />
            <UButton :label="headerActions.signUp" to="/registro" block />
          </div>
        </template>
      </UHeader>

      <UMain class="flex-1">
        <slot />
      </UMain>

      <UFooter
        :ui="{
          root: 'bg-default/60 backdrop-blur-lg border-t border-muted/50',
        }"
      >
        <template #left>
          <p class="text-sm text-muted">{{ footerContent.territory }}</p>
        </template>
        <template #right>
          <UButton :to="footerContent.privacy.to" :label="footerContent.privacy.label" color="neutral" variant="ghost" />
          <UButton
            :to="footerContent.commitment.to"
            :label="footerContent.commitment.label"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UFooter>
    </div>
  </div>
</template>
