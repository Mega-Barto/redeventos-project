<script setup lang="ts">
const description =
  'Redeventos ayuda a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo. Publicas el evento, dices qué necesitas y los espacios y aliados te proponen cómo cubrirlo.'

useSeoMeta({
  title: 'La red hace posible el evento',
  description,
})
</script>

<template>
  <UPageHero title="La red hace posible el evento" :description="description" />
</template>
