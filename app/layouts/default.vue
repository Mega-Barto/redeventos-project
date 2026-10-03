<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { footerContent, headerActions, publicNav } from '~~/shared/content/nav'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() =>
  publicNav.map((item) => ({
    label: item.label,
    to: item.to,
    active: item.to.startsWith('/#')
      ? false
      : route.path === item.to || route.path.startsWith(`${item.to}/`),
  })),
)
</script>

<template>
  <div class="relative min-h-screen">
    <BrandAppLavaBackground />

    <div class="relative z-10 flex min-h-screen flex-col">
      <a
        href="#contenido"
        class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-default focus:px-3 focus:py-2 focus:text-highlighted"
      >
        Saltar al contenido
      </a>
      <UHeader
        title="Redeventos"
        to="/"
        :ui="{
          root: 'bg-default/60 backdrop-blur-lg border-b border-muted/50',
          container: 'px-4 sm:px-8 lg:px-12',
        }"
      >
        <UNavigationMenu :items="items" />

        <template #right>
          <UButton :label="headerActions.signIn" to="/login" color="neutral" variant="ghost" />
          <UButton :label="headerActions.signUp" to="/register" color="neutral" variant="soft" />
        </template>

        <template #body>
          <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
          <div class="mt-4 flex flex-col gap-2">
            <UButton :label="headerActions.signIn" to="/login" color="neutral" variant="ghost" block />
            <UButton :label="headerActions.signUp" to="/register" block />
          </div>
        </template>
      </UHeader>

      <UMain id="contenido" class="flex-1">
        <slot />
      </UMain>

      <UFooter
        :ui="{
          root: 'bg-default/60 backdrop-blur-lg border-t border-muted/50',
          container: 'px-4 sm:px-8 lg:px-12',
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
