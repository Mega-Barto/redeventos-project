# Redeventos — referencia de pruebas unitarias

Complemento de [SKILL.md](SKILL.md). Cargar cuando el caso sea ambiguo o haya conflicto entre capas/NFR.

## Frontend

- Composables: estado inicial, transiciones, errores de `useFetch`/cliente mockeado.
- Utils: formateo de fechas Bogotá, slugs, filtros de oportunidades (deterministas).
- Middleware: redirección cuando no hay sesión vs rol incorrecto (mock de sesión, no Supabase real).
- No snapshot masivo de SFC; preferir asserts de texto/rol visible.

## Backend (Nitro)

- Handlers: 400 en body inválido, 401/403 cuando la auth falte (mock `event.context`).
- No llamar red externa; mock de cliente Supabase a nivel módulo si hace falta.
- Respuestas JSON: forma estable, sin filtrar campos restringidos por rol.

## UI (Nuxt UI / componentes)

- Botones deshabilitados durante submit async.
- Modales: foco trap no es obligatorio en unit, sí presencia de título/acciones accesibles.
- Tablas/listas: estado vacío con mensaje en español.
- Icon-only: `aria-label` o texto visible.

## UX

- Mensajes de error accionables (“qué falta”) no genéricos “Error 500”.
- Confirmaciones destructivas: copy que refleje compromiso de match/registro cuando aplique.
- Estados de progreso alineados al flujo idea.md (borrador → published → public → completed).

## NFR — casos concretos Redeventos

### Privacidad y contacto (`idea.md` §10)

| Escenario | Visible en test |
| --- | --- |
| Oportunidad para sponsor | correo, Instagram, web — **no** WhatsApp/teléfono |
| Match aceptado | ambos contactos directos |
| Ficha pública asistente | inscripción externa; sin cuenta asistente |

### Seguridad

- Entrada con SQL/XSS en strings: schema rechaza o escapa según capa (Zod + render).
- IDs UUID inválidos → 400, no 500.
- No loguear `NUXT_SUPABASE_SECRET_KEY` en tests ni stderr capturado.

### i18n

- `html[lang="es-CO"]` en layouts/páginas cuando se testee render.
- Moneda COP en copy; sin montos en aportes en especie (piloto).

### Accesibilidad

- Headings jerárquicos en formularios largos (registro, crear evento).
- Inputs con `<label>` o `aria-labelledby`.

### Rendimiento

- Evitar loops O(n²) en tests de listas grandes; usar fixtures pequeños.
- `@vitest` parallel safe: no mutar globals sin `beforeEach` reset.

## Matriz Vitest vs Playwright (mínima)

| Pregunta | Vitest | Playwright |
| --- | --- | --- |
| ¿Regla pura o schema? | Sí | No |
| ¿Un componente aislado? | Sí (con DOM) | No |
| ¿Varios roles y navegación? | No | Sí |
| ¿Health check / landing SSR? | API handler sí; landing completa E2E | Sí |

## Ejemplos de nombres de test (español)

- `rechaza publicar sin enlace de inscripción`
- `no revela teléfono en la oportunidad del evento`
- `muestra estado vacío cuando no hay propuestas`
