# Marca — Redeventos

## Tipografía (cerrada)

- **Familia:** [Ubuntu Sans](https://fonts.google.com/specimen/Ubuntu+Sans) (Google Fonts).
- No sustituir por otra fuente sin decisión explícita de producto.

## Paleta elegida

Entre las cuatro exportaciones de Coolors en [`coolors.md`](./coolors.md), se adopta la **paleta Aguas (teal)**:

| Token | Hex | Rol |
| --- | --- | --- |
| **Agua claro** | `#02C3BD` | highlights, blobs de fondo, acentos suaves |
| **Agua vivo** | `#00B9AE` | primary, CTAs, enlaces activos |
| **Agua medio** | `#009F93` | hover, estados secundarios |
| **Agua profundo** | `#037171` | blobs de fondo, profundidad |
| **Agua noche** | `#03312E` / `#021A18` | base de página, texto sobre superficies |

**Por qué esta y no las otras opciones**

| Opción | Enlace Coolors | Motivo de descarte |
| --- | --- | --- |
| Aguas (teal) | `00b9ae-037171-03312e-02c3bd-009f93` | **Elegida** — contraste legible, sensación de red/comunidad, combina con fondo tipo lámpara de lava |
| Niebla azul | `4f6d7a-c0d6df-dbe9ee-4a6fa5-166088` | Más corporativa/fría; blobs de lava pierden vida |
| Grises crema | `fbfbf2-e5e6e4-cfd2cd-a6a2a2-847577` | Poca saturación para CTAs y animación de fondo |
| Carbón violeta | `000000-2f2e39-53515d-969bb0-c8c2cf` | Orientada a dark UI; no encaja con superficies claras del piloto |

Implementación técnica: escala `agua-*` en `app/assets/css/main.css` y `primary: 'agua'` en `app.config.ts`.

## Modo de color

- **Dark mode nativo:** la app arranca y vive en oscuro (`colorMode.preference` / `fallback`: `dark` en `nuxt.config.ts`).
- Usar tokens semánticos de Nuxt UI (`text-default`, `bg-elevated`, etc.); no diseñar flujos asumiendo light mode.
- Toggle claro/oscuro: solo si producto lo pide más adelante (`UColorModeButton`).

## Fondo de página

- **Efecto:** lámpara de lava difuminada sobre base `#021A18`, blobs en tonos agua con `mix-blend-screen`.
- **Animación:** leve pero **percibible** — ciclos ~15–19 s, trayectorias en 3 puntos, blobs desfasados (`animation-delay` negativo), blur ~64px.
- **Componente:** `app/components/brand/AppLavaBackground.vue` → auto-import `<BrandAppLavaBackground />` (colores en `shared/content/brand-lava.ts`).
- **Accesibilidad:** con `prefers-reduced-motion: reduce`, fondo estático (sin animación).
- El contenido (header, main, footer) va en capa superior semitransparente (`bg-default/60`, `backdrop-blur-lg`).

## Referencias

- Paletas alternativas (histórico): [`coolors.md`](./coolors.md)
