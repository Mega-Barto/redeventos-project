# Política del agente — skills Redeventos

Mitigación activa desde septiembre 2026. Catálogo completo: [README.md](./README.md) · MCP: [STACK-SKILLS-AND-MCP.md](./STACK-SKILLS-AND-MCP.md).

## Antes de tocar código

1. Alcance de producto: [`docs/product/idea.md`](../../docs/product/idea.md) y skill `.cursor/skills/redeventos-business-model`.
2. Stack técnico: [`docs/architecture/stack.md`](../../docs/architecture/stack.md).

## Cuándo cargar qué skill (obligatorio)

| Tarea | Skill en `.agents/skills/` |
| --- | --- |
| Migraciones, tablas, **RLS**, índices, triggers, SQL complejo | **`supabase-postgres-best-practices`** (antes que `supabase` general) |
| Cliente Supabase, Auth, Storage | `supabase` |
| Páginas Nuxt, Nitro, routing, SSR | `nuxt` |
| Componentes Vue, composables | `vue`, `vue-best-practices` |
| Formularios, modales, tablas **Nuxt UI** | `nuxt-ui` |
| Metadata, fichas públicas, SEO | `nuxt-seo` |
| Schemas de entrada/salida, validación API | `zod` |
| Estilos Tailwind | `tailwind-css-patterns` |
| Deploy, `wrangler.toml`, dev local Workers | `wrangler`, `workers-best-practices`, `cloudflare` |
| Emails transaccionales (propuesta, match, evidencia) | `resend`, `email-best-practices` |
| Tests unitarios Nuxt/Vitest | `vitest`, `vue-testing-best-practices` |
| Tests E2E flujos de negocio | `playwright-best-practices` |
| GitHub Actions CI/CD | `github-actions-templates` |

## MCP (operaciones reales)

Usar MCP cuando haga falta **ejecutar** o **inspeccionar** (no solo escribir código):

- BD / migraciones → Supabase MCP (dev).
- Documentación CF → cloudflare-docs MCP.
- Navegador local → Playwright MCP.
- CI / PR → GitHub MCP (token configurado; ver [`.cursor/MCP-SETUP.md`](../../.cursor/MCP-SETUP.md)).

## Aún fuera de alcance (no improvisar)

PostHog, Sentry, pagos, RSVP propio, chat — ver `docs/product/idea.md` §17 y `STACK-SKILLS-AND-MCP.md` §4.
