---
name: component-fragmentation
description: Redeventos — componentes fragmentados y copy editable sin tocar lógica
---

# Fragmentación de componentes y contenido (Redeventos)

**Regla fundamental del proyecto:** toda UI nueva debe estar **lo más fragmentada posible** para que cambiar textos, enlaces, listas y copy de marketing **no exija abrir páginas grandes ni mezclar contenido con lógica**.

Alineado con [`docs/architecture/stack.md`](../../../../docs/architecture/stack.md) §3.2 (componentes pequeños; evitar componentes gigantes).

## Objetivo

| Quién edita | Debe poder |
| --- | --- |
| Producto / copy | Cambiar títulos, párrafos, CTAs, bullets en pocos archivos claros |
| Desarrollo | Mantener páginas como **orquestación** (layout + datos + composición) |

## Capas

```text
pages/           → enruta, SEO meta, fetch; casi sin markup largo
components/      → secciones y piezas visuales (una responsabilidad cada una)
shared/content/  → copy estático reutilizable (app + server si aplica)
composables/     → lógica, estado, llamadas API (sin strings de UI salvo i18n futuro)
```

En Nuxt 4, `~` apunta a `app/`; contenido compartido con el servidor usa `~~/shared/content/…`.

## Reglas obligatorias para el agente

1. **Una sección de pantalla = un componente** (hero, lista de beneficios, pie de formulario, etc.). La página solo compone: `<HomeHero />`, `<HomeHowItWorks />`, …
2. **No bloques largos de texto en `<template>`** de páginas. El copy vive en:
   - `shared/content/<feature>.ts` (preferido para copy de producto/marketing), o
   - `<NombreSeccion>.content.ts` junto al componente si solo lo usa ese componente.
3. **Componentes presentacionales:** reciben copy por **props** o importan su módulo `.content.ts`; no llaman Supabase ni encierran reglas de negocio.
4. **Contenedores delgados:** si hace falta datos, un wrapper (`HomeHeroSection.vue`) hace fetch/composable y pasa props al presentacional (`HomeHero.vue`).
5. **Nombrado por carpeta de feature:** `app/components/home/HomeHero.vue`, `app/components/event/EventCard.vue` → auto-import `<HomeHero />`, `<EventCard />`.
6. **SEO:** títulos/descripciones pueden reutilizar el mismo objeto de contenido que la UI (una fuente de verdad por pantalla).

## Copy en `shared/content/`

Exportar objetos `as const` tipados; sin lógica.

```ts
// shared/content/home.ts
export const homeHeroContent = {
  title: 'La red hace posible el evento',
  description:
    'Redeventos ayuda a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo…',
  ctaLabel: 'Publicar evento',
} as const

export type HomeHeroContent = typeof homeHeroContent
```

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import { homeHeroContent } from '~~/shared/content/home'

useSeoMeta({
  title: homeHeroContent.title,
  description: homeHeroContent.description,
})
</script>

<template>
  <HomeHero v-bind="homeHeroContent" />
</template>
```

```vue
<!-- app/components/home/HomeHero.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  description: string
  ctaLabel?: string
}>()
</script>

<template>
  <UPageHero :title="title" :description="description" />
  <!-- CTA u otros hijos en subcomponentes si crece el bloque -->
</template>
```

## Cuándo fragmentar más

- Más de **~3–5 líneas** de copy en un solo `<template>` → extraer subcomponente o mover a `.content.ts`.
- Listas repetidas (pasos, FAQs, features) → array en `.content.ts` + componente de lista (`HomeSteps.vue` + `v-for`).
- Misma frase en **email (server)** y **web** → obligatorio en `shared/content/`, no duplicar en Vue y Nitro.

## Qué evitar

- Páginas de cientos de líneas con markup y copy mezclados.
- Strings de producto hardcodeados en composables o `server/api`.
- “Componente pantalla” que hace fetch, valida formulario y renderiza todo el copy inline.
- Props opcionales genéricas (`text1`, `text2`) en lugar de nombres de dominio (`title`, `commitmentLabel`).

## Checklist antes de cerrar un PR de UI

- [ ] ¿La página solo compone secciones?
- [ ] ¿El copy editable está en `shared/content/` o `*.content.ts`?
- [ ] ¿Cada sección tiene su componente?
- [ ] ¿Lógica de negocio fuera de componentes presentacionales?

## Referencias Nuxt relacionadas

- [features-components-autoimport](features-components-autoimport.md) — carpetas y nombres
- [core-directory-structure](core-directory-structure.md) — `app/` vs `shared/`
- UI base: skill **`nuxt-ui`** (átomos); este documento gobierna **composición y copy** en Redeventos.
