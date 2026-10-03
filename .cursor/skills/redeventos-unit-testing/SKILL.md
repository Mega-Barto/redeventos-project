---
name: redeventos-unit-testing
description: Defines Redeventos unit-test policy for Vitest across frontend, backend, UI and UX with non-negotiable a11y, i18n, security, performance and privacy checks. Use when writing or reviewing unit tests, Vitest specs, test coverage for Vue/Nuxt/Nitro, or when the user asks for pruebas unitarias in this repo.
---

# Redeventos — pruebas unitarias

## Alcance

| Incluye | Excluye |
| --- | --- |
| Vitest en `tests/unit/**/*.test.ts` | Playwright E2E (`tests/e2e/`, `bun run test:e2e`) |
| Lógica frontend (composables, utils, componentes cuando haya entorno DOM) | Flujos completos registro → match → evidencia (E2E) |
| Handlers y utilidades Nitro en `server/` | Contratos reales con Supabase/RLS (integración o E2E) |
| Reglas de presentación UI/UX testeables sin navegador | Diseño visual pixel-perfect |

Runner: `bun run test`. Config: [`vitest.config.ts`](../../../vitest.config.ts) (hoy `environment: 'node'`).

Antes de implementar tests de componente Vue, cargar también `vitest` y `vue-testing-best-practices` en `.agents/skills/`.

## Fuente de verdad

1. [`docs/product/idea.md`](../../../docs/product/idea.md) — reglas de producto que los tests deben reflejar.
2. [`docs/architecture/stack.md`](../../../docs/architecture/stack.md) §17 — qué va en Vitest vs Playwright.
3. Skill [`redeventos-business-model`](../redeventos-business-model/SKILL.md) — actores, contacto escalonado, estados de evento.

## Capas obligatorias al escribir o revisar

Clasificar cada test en una capa principal. Si toca varias, el assert debe dejar claro cuál protege.

| Capa | Qué cubrir | Dónde suele vivir el código |
| --- | --- | --- |
| **Frontend** | Composables, utils, guards de ruta, transformaciones de datos para la UI | `app/` |
| **Backend** | Validación de entrada, mapeo de respuestas, reglas antes/después de persistencia | `server/` |
| **UI** | Render condicional, props/emits, roles ARIA en componentes, estados disabled/loading | `app/components/` |
| **UX** | Mensajes y etiquetas en español, estados vacío/error/éxito, flujos sin callejones (lógica) | `app/` + copy en tests |

Reglas de dominio compartidas (`shared/schemas`, `shared/constants`): testearlas como **frontend o backend** según quién las consume; no duplicar el mismo caso en tres archivos.

## Requisitos no funcionales (no negociables)

Todo archivo nuevo o revisión de tests debe pasar este filtro:

| NFR | Regla en tests |
| --- | --- |
| **Accesibilidad** | Preferir `getByRole`, `getByLabelText`; no basar asserts solo en clases CSS. Si el componente es interactivo, verificar nombre accesible o `aria-*` relevante. |
| **i18n** | Copy esperado en **español**; fechas/horas coherentes con `America/Bogota` y locale `es-CO` cuando aplique. No hardcodear inglés salvo identificadores técnicos. |
| **Seguridad** | Probar rechazo Zod/validación en entradas inválidas; no assertar secretos ni tokens completos; no asumir bypass de auth en unit (mockear sesión explícitamente si hace falta). |
| **Rendimiento** | Tests deterministas: sin `setTimeout` arbitrarios; mocks de reloj si hay tiempo; un caso = un comportamiento. |
| **Privacidad** | No WhatsApp/teléfono en fixtures salvo tests de **revelación post-match**; contacto público vs directo según `idea.md` §10; no PII real en datos de prueba. |

Detalle ampliado: [reference.md](reference.md).

## Política de qué testear

**Sí (unitario):**

- Transiciones de estado (evento, necesidad, match) — ver [`tests/unit/event-status.test.ts`](../../../tests/unit/event-status.test.ts).
- Schemas Zod: acepta válido, rechaza inválido, mensajes útiles.
- Funciones puras: cobertura parcial de necesidades, gates de ficha pública (fecha + lugar).
- Componentes: una responsabilidad por test; estados UX (cargando, error, vacío).

**No (delegar a E2E o integración):**

- SSR completo + cookies Supabase de punta a punta.
- RLS en Postgres (migración + policy tests o E2E con rol real).
- Emails Resend, webhooks, Wrangler en red real.

## Convenciones del repo

- Archivo: `tests/unit/<area>.test.ts` o `<feature>.test.ts`.
- Descripciones `it(...)` en español, orientadas al comportamiento del piloto.
- Imports desde `shared/` con rutas relativas estables; evitar acoplar tests a `.nuxt` generado.
- No añadir ESLint/Prettier para tests: Biome ya cubre el repo.
- No commitear `.env`, tokens ni dumps con PII en fixtures.

## Checklist del agente

```
- [ ] ¿Capa (frontend / backend / UI / UX) identificada?
- [ ] ¿Alineado con idea.md (sin pagos, RSVP propio, chat, etc.)?
- [ ] ¿NFR: a11y, i18n, seguridad, perf, privacidad revisados?
- [ ] ¿Un assert principal por test cuando sea posible?
- [ ] ¿No duplica un flujo que debe ser Playwright E2E?
- [ ] `bun run test` pasa localmente
```

## Errores frecuentes

- Testear implementación interna en lugar de comportamiento observable.
- Mockear Zod o reglas de negocio para “pasar” el test.
- Strings en inglés en UI/UX del piloto.
- Exponer teléfono/WhatsApp en oportunidades pre-match.
- Tests de componente sin entorno DOM cuando el config sigue en `node` (cambiar config o limitarse a lógica pura).
