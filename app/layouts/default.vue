<template>
  <div class="flex min-h-screen flex-col">
    <UHeader title="Redeventos" to="/" />

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">Pereira y Dosquebradas</p>
      </template>
    </UFooter>
  </div>
</template>
