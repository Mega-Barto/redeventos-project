<template>
  <div class="relative min-h-screen">
    <BrandAppLavaBackground />
    <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-10">
      <UButton to="/" label="Redeventos" color="neutral" variant="ghost" class="mb-6 self-start" />
      <UPageCard>
        <slot />
      </UPageCard>
    </div>
  </div>
</template>
