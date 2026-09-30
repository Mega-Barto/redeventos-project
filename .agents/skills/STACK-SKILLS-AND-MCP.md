# Stack Redeventos — skills del registry y MCP

Alineado con [`docs/architecture/stack.md`](../../docs/architecture/stack.md) (§26–34 Agent Skills / MCP). Registra la **selección acordada en producto** (cuestionario AskQuestion, septiembre 2026) y el **estado de instalación** en este repo.

---

## 1. Alcance del stack (recordatorio)

| Capa | Tecnología | Prioridad en `stack.md` |
| --- | --- | --- |
| App | Nuxt 4, Vue 3, TypeScript, Nitro | CRÍTICA |
| Runtime | Cloudflare Workers, Wrangler | CRÍTICA |
| Datos / auth | Supabase (PostgreSQL, Auth, Storage, **RLS**) | CRÍTICA |
| UI | Tailwind, **Nuxt UI** | ALTA |
| Validación | Zod | ALTA |
| Tests | Vitest, Playwright (flujos de negocio) | ALTA |
| CI/CD | GitHub, GitHub Actions | ALTA / CRÍTICA |
| Email | Resend | MEDIA |
| Analytics | PostHog | MEDIA (fase posterior) |
| Errores | Sentry | MEDIA (fase posterior) |

Regla de arquitectura: no añadir servicios mientras **Nuxt + Cloudflare + Supabase** resuelvan el problema.

---

## 2. Decisión de instalación

| Opción | Elección |
| --- | --- |
| Ubicación | **Solo proyecto** — `.agents/skills/` + `skills-lock.json` en la raíz del repo |
| Extras del registry | No: `incremental-implementation`, `ui-ux-pro-max` |
| Skill local de negocio | Sí: mantener `.cursor/skills/redeventos-business-model/` |
| Tras cerrar skills | **Guía MCP** (no sustituir GitHub/Supabase por skills sueltas) |

---

## 3. Skills instaladas (estado actual)

Instalación en proyecto: `npx skills add … -y` (sin `-g`). Lock: `skills-lock.json`.

| Skill (carpeta) | Comando install | Rol en Redeventos |
| --- | --- | --- |
| `supabase-postgres-best-practices` | `supabase/agent-skills@supabase-postgres-best-practices` | **RLS**, migraciones, índices (`stack.md` §27) |
| `supabase` | `supabase/agent-skills@supabase` | Auth, cliente, Storage |
| `cloudflare` | `cloudflare/skills@cloudflare` | Plataforma CF |
| `workers-best-practices` | `cloudflare/skills@workers-best-practices` | Patrones Workers |
| `wrangler` | `cloudflare/skills@wrangler` | Deploy, config local |
| `nuxt` | `onmax/nuxt-skills@nuxt` | Nuxt 4, Nitro, SSR |
| `vue` | `onmax/nuxt-skills@vue` | Composition API |
| `nuxt-ui` | `onmax/nuxt-skills@nuxt-ui` | Nuxt UI (`stack.md` §4) |
| `nuxt-seo` | `onmax/nuxt-skills@nuxt-seo` | Fichas públicas, SEO |
| `vitest` | `onmax/nuxt-skills@vitest` | Unit tests Nuxt |
| `zod` | `pproenca/dot-skills@zod` | Validación / DTOs |
| `vue-best-practices` | `vuejs-ai/skills@vue-best-practices` | Refuerzo Vue 3 |
| `playwright-best-practices` | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | E2E flujos de negocio |
| `vue-testing-best-practices` | `vuejs-ai/skills@vue-testing-best-practices` | Tests de componentes |
| `github-actions-templates` | `wshobson/agents@github-actions-templates` | CI/CD |
| `tailwind-css-patterns` | `giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns` | Tailwind |
| `resend` | `resend/resend-skills@resend` | Email transaccional |
| `email-best-practices` | `resend/email-best-practices@email-best-practices` | Deliverability, retries |

**Política de uso:** [AGENT-POLICY.md](./AGENT-POLICY.md) · **Regla Cursor:** `.cursor/rules/redeventos-agents.mdc`.

### Mitigación aplicada (sept. 2026)

Tras el cuestionario inicial se cerraron los huecos frente a `stack.md`:

- Instaladas: `supabase-postgres-best-practices`, `nuxt-ui`, `wrangler`, `zod`.
- MCP día 1 versionado: [`.cursor/mcp.json`](../../.cursor/mcp.json) + [`.cursor/MCP-SETUP.md`](../../.cursor/MCP-SETUP.md).

---

## 4. Omitido a propósito (sigue vigente)

| Skill / paquete | Motivo |
| --- | --- |
| `antfu/skills@vitest` | Cubierto por `onmax/nuxt-skills@vitest` |
| `posthog/…` | Fase analytics (`stack.md` §32) |
| `getsentry/…` sentry-cloudflare-sdk | Fase observabilidad |
| `supabase-audit-rls` (pentest) | Opcional; complemento de revisión |
| `incremental-implementation`, `ui-ux-pro-max` | Fuera del MVP acotado |
| `github/awesome-copilot@gh-cli` | **No existe** en el repo; usar **GitHub MCP** + `github-actions-templates` |

---

## 5. Huecos vs `stack.md`

**Estado:** mitigados para Supabase/Postgres, Nuxt UI, Wrangler y Zod. Quedan solo fases posteriores (PostHog, Sentry) y opcionales (audit RLS, skills UX genéricas).

---

## 6. Skills vs MCP

| | Agent Skills | MCP |
| --- | --- | --- |
| Función | Patrones, checklists, APIs documentadas en SKILL.md | Llamadas a servicios (BD, repo, browser, analytics) |
| Ejemplo Redeventos | `supabase` skill al escribir migraciones | Supabase MCP para ejecutar SQL / ver logs |
| Riesgo | Contenido de terceros en repo — revisar antes de confiar | Permisos reales (`stack.md` §31) |

Matriz resumida (`stack.md` §34):

| Sistema | Skill en repo | MCP |
| --- | --- | --- |
| Supabase | Sí (`supabase` + **postgres-best-practices**) | Sí — `.cursor/mcp.json` |
| Cloudflare | Sí (+ **wrangler**, workers-best-practices) | Sí — cloudflare-docs MCP |
| GitHub | Actions templates | Sí — GitHub MCP (token env) |
| Playwright | Sí (best practices) | Sí — `@playwright/mcp` |
| Zod / Nuxt UI | Sí | — |
| PostHog | No aún | Fase analytics |
| Resend | Sí | No imprescindible al inicio |
| Nuxt/Vue | Sí (onmax + vuejs-ai) | No imprescindible |

---

## 7. MCP recomendados (`stack.md` §32)

### Día 1 (configurado en repo)

Archivo: [`.cursor/mcp.json`](../../.cursor/mcp.json). Pasos de auth: [`.cursor/MCP-SETUP.md`](../../.cursor/MCP-SETUP.md).

Servidores incluidos: `supabase`, `cloudflare-docs`, `playwright`, `github`.

#### Supabase MCP

- Endpoint: `https://mcp.supabase.com/mcp`
- Auth: OAuth al proyecto de **desarrollo** (no producción por defecto).
- Uso: migraciones, SQL, tipos TypeScript, logs, ramas.
- Doc: [Supabase MCP](https://supabase.com/docs/guides/ai-tools/mcp)

#### Cloudflare MCP

- Documentación: `https://docs.mcp.cloudflare.com/mcp`
- API / bindings / builds / observabilidad: ver `stack.md` §29.
- Doc: [Cloudflare MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/)

#### Playwright MCP

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

- Repo: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- Uso: explorar UI local, reproducir bugs, validar formularios y navegación.

#### GitHub MCP

- Config en `.cursor/mcp.json`: imagen Docker `ghcr.io/github/github-mcp-server` + `GITHUB_PERSONAL_ACCESS_TOKEN` en entorno.
- Alternativa remota (global): `https://api.githubcopilot.com/mcp/` — ver [MCP-SETUP.md](../../.cursor/MCP-SETUP.md).
- Uso: fallos de CI, PRs, issues, Actions. Preferir toolsets **read-only** (`stack.md` §31).

### Cuando exista analytics (`stack.md` §32)

- PostHog MCP: `https://mcp.posthog.com/mcp`
- Eventos piloto en `stack.md` §20: `registration_completed`, `event_created`, `offer_accepted`, `evidence_approved`, etc.

### Cuando exista observabilidad real

- Cloudflare Observability MCP
- Sentry (cliente/MCP según integración estable)
- Skill opcional: `getsentry/sentry-for-ai@sentry-cloudflare-sdk`

---

## 8. Seguridad MCP (`stack.md` §31)

1. No conectar agentes a **producción** sin necesidad.
2. Preferir dev/staging.
3. OAuth cuando exista.
4. Limitar toolsets; read-only para diagnóstico.
5. Revisar operaciones destructivas.
6. Sin tokens en el repositorio.
7. Mantener **RLS** aunque el agente use Supabase MCP.
8. Credenciales dev/prod separadas.

---

## 9. Bundle de referencia (búsqueda inicial)

Búsqueda con `npx skills find` para el stack Nuxt + Supabase (sept. 2026). No todo se instaló; sirve para ampliar el catálogo.

| Query | Hallazgo útil |
| --- | --- |
| `supabase` | Oficial: `supabase`, `supabase-postgres-best-practices` |
| `cloudflare` | Oficial: `cloudflare`, `wrangler`, `workers-best-practices` |
| `nuxt` | `onmax/nuxt-skills` (nuxt, vue, nuxt-ui, nuxt-seo, vitest) |
| `playwright` | `playwright-best-practices`, MCP oficial |
| `vitest` | `antfu/skills@vitest`, `onmax/nuxt-skills@vitest` |
| `resend` | `resend/resend-skills@resend` |
| `posthog` | Instrumentación + MCP remoto |
| `nuxt supabase` | Sin paquete combinado en registry |

---

## 10. Mantenimiento

| Tarea | Comando / acción |
| --- | --- |
| Ver lockfile | `skills-lock.json` |
| Actualizar skills | `npx skills check` → `npx skills update` |
| Añadir una skill | `npx skills add owner/repo@skill -y` desde raíz del repo |
| Documentar cambio | Actualizar este archivo y tabla en [README.md](./README.md) |
| Alcance producto | No contradecir `docs/product/idea.md`; negocio en `.cursor/skills/redeventos-business-model/` |

---

## 11. Mapa mental

```text
docs/product/idea.md + docs/architecture/stack.md
        |
        +-- .cursor/skills/redeventos-business-model  (negocio)
        |
        +-- .agents/skills/*                          (18 skills + AGENT-POLICY)
        |
        +-- .cursor/mcp.json                          (Supabase, CF docs, Playwright, GitHub)
        |
        v
Código Nuxt en Workers + Supabase RLS + Resend + (PostHog/Sentry después)
```
