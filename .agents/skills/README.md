# Agent Skills — Redeventos (`events-app`)



Documentación del **catálogo de skills** instaladas en este repo y cómo se relacionan con [`docs/architecture/stack.md`](../../docs/architecture/stack.md) y [`docs/product/idea.md`](../../docs/product/idea.md).



| Documento | Contenido |

| --- | --- |

| [AGENT-POLICY.md](./AGENT-POLICY.md) | **Cuándo** cargar cada skill (mitigación activa) |

| [STACK-SKILLS-AND-MCP.md](./STACK-SKILLS-AND-MCP.md) | Historial de decisiones, MCP, mantenimiento |

| [`skills-lock.json`](../../skills-lock.json) | Lockfile generado por `npx skills` |

| [`.cursor/MCP-SETUP.md`](../../.cursor/MCP-SETUP.md) | Activar MCP + token GitHub |



**Skill de negocio:** [`.cursor/skills/redeventos-business-model/`](../../.cursor/skills/redeventos-business-model/)



**Regla Cursor:** [`.cursor/rules/redeventos-agents.mdc`](../../.cursor/rules/redeventos-agents.mdc)



**Última actualización:** septiembre de 2026 (mitigación de huecos stack aplicada).



---



## Skills instaladas (18 del registry)



| Carpeta | Paquete `npx skills add` |

| --- | --- |

| `supabase` | `supabase/agent-skills@supabase` |

| `supabase-postgres-best-practices` | `supabase/agent-skills@supabase-postgres-best-practices` |

| `cloudflare` | `cloudflare/skills@cloudflare` |

| `workers-best-practices` | `cloudflare/skills@workers-best-practices` |

| `wrangler` | `cloudflare/skills@wrangler` |

| `nuxt`, `vue`, `nuxt-seo`, `nuxt-ui`, `vitest` | `onmax/nuxt-skills@…` |

| `vue-best-practices` | `vuejs-ai/skills@vue-best-practices` |

| `vue-testing-best-practices` | `vuejs-ai/skills@vue-testing-best-practices` |

| `playwright-best-practices` | `currents-dev/playwright-best-practices-skill@playwright-best-practices` |

| `github-actions-templates` | `wshobson/agents@github-actions-templates` |

| `tailwind-css-patterns` | `giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns` |

| `zod` | `pproenca/dot-skills@zod` |

| `resend`, `email-best-practices` | `resend/resend-skills@resend`, `resend/email-best-practices@email-best-practices` |



Instalación en proyecto (desde la raíz):



```bash

npx skills add <owner/repo@skill> -y

npx skills check && npx skills update

```



---



## Regla rápida



- **Skills** → cómo escribir código (ver [AGENT-POLICY.md](./AGENT-POLICY.md)).

- **MCP** → `.cursor/mcp.json` + [MCP-SETUP.md](../../.cursor/MCP-SETUP.md).



Pendiente de fase (sin skill/MCP obligatorio aún): PostHog, Sentry.


