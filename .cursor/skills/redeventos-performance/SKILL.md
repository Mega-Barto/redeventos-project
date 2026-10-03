---
name: redeventos-performance
description: Analiza rendimiento (Lighthouse, LCP, INP, TTFB, bundle, caché, SSR, Supabase, Cloudflare Workers) y agent-readiness según isitagentready.com (robots, sitemap, bots de IA, descubrimiento MCP/OAuth). Usar cuando el usuario hable de lentitud, performance, Lighthouse, carga, Core Web Vitals, agent-ready, robots.txt, sitemap o preparación para agentes de IA en este repo.
---

# Redeventos — rendimiento y agent-readiness

Analizar antes de proponer un módulo o una reescritura. Separar lo que se siente en `nuxt dev` de lo que ve un usuario (o un agente) en producción.

Referencia externa de comprobaciones: [Is Your Site Agent-Ready?](https://isitagentready.com/) (Cloudflare). Priorizar las **easy wins** del escáner: `robots.txt` válido con reglas para bots de IA y directivas de sitemap, y metadatos o cabeceras de descubrimiento útiles en la home y fichas públicas.

## Alcance

| Incluye | Excluye |
| --- | --- |
| Páginas públicas, app autenticada, Worker Nitro, consultas Supabase | Recomendar `nuxt-booster` como plan de rendimiento |
| Indicadores medibles o trazables en el código | Inventar tiempos, scores o tamaños de bundle |
| Checklist agent-ready alineado a [isitagentready.com](https://isitagentready.com/) | Protocolos de comercio agentic (x402, MPP, UCP, ACP) — fuera del piloto en `idea.md` |
| El cambio más pequeño que mueve un indicador | Pagos, chat, RSVP propio u observabilidad que `idea.md` deja fuera |

Fuente de stack: [`docs/architecture/stack.md`](../../../docs/architecture/stack.md). Runtime: Nuxt 4, SSR, `nitro.preset: cloudflare_module`. Datos: Supabase con RLS. UI: Nuxt UI, Tailwind, modo oscuro, Ubuntu Sans.

Para cambios de robots, sitemap, OG o schema en producción, cargar también `.agents/skills/nuxt-seo/`.

## Cómo analizar (rendimiento)

1. Decir si la queja es el servidor de desarrollo o el sitio servido. El arranque frío de `nuxt dev` no es un indicador de Lighthouse.
2. Nombrar la superficie: página pública, ruta `/app`, Worker o Postgres.
3. Seguir el camino crítico: TTFB del HTML → CSS y fuente → JS de hidratación → consulta que bloquea la vista.
4. Marcar cada indicador como **observado** (con evidencia: archivo, ruta o medición) o **desconocido**. No rellenar huecos.
5. Ordenar por impacto en la vista, no por novedad de la herramienta.
6. Proponer un solo cambio por indicador. Si hace falta un índice o una policy, cargar antes `supabase-postgres-best-practices`.

Medir contra `nuxt build` y preview o el deploy, nunca contra `nuxt dev`.

## Cómo analizar (agent-readiness)

1. Elegir tipo de escaneo según [isitagentready.com](https://isitagentready.com/): **Content Site** (Redeventos piloto), no API pura salvo rutas Nitro explícitas.
2. Recorrer las cinco categorías del escáner; marcar cada ítem **presente**, **parcial**, **ausente** o **no aplica** con evidencia (`public/robots.txt`, `nuxt.config.ts`, cabeceras, DNS en Cloudflare).
3. No confundir MCP del **repo para desarrollo** (`.cursor/mcp.json`) con **MCP Server Card** expuesto al dominio público del producto.
4. Las rutas `/app/**` y datos tras login no son superficie agent-ready por defecto: RLS, privacidad y contacto escalonado (`idea.md` §10).
5. Un solo cambio por hueco; empezar por discoverability y bot access antes de OAuth/MCP en producción.

## Indicadores — rendimiento

### Frontend

| Indicador | Qué mirar en este repo | Señal de problema |
| --- | --- | --- |
| LCP | El texto grande de la landing y las fichas. La fuente sale de la hoja de Google en `nuxt.config.ts` (`fonts.googleapis.com`). | La hoja bloquea el primer pintado del texto. |
| INP | Hidratación de Nuxt UI y Supabase en páginas que solo leen. | JS de app autenticada en una ficha pública. |
| CLS | `font-display`, listas que pasan de vacío a datos, alturas que saltan. | El contenido empuja el layout al llegar la consulta. |
| Pintura | Degradado + blur en `app/assets/css/main.css`, layouts, `app.config.ts`. | Blur de viewport en móvil de gama baja. |
| Peso JS | Módulos globales `@nuxt/ui` y `@nuxtjs/supabase`. | La ruta pública no puede renderizar sin el cliente de auth. |

Casi no hay imágenes ni vídeo. No tratar el rendimiento como un problema de `<img>` o de reproductores.

### Backend

| Indicador | Qué mirar en este repo | Señal de problema |
| --- | --- | --- |
| TTFB | `useAsyncData` que espera a Supabase antes del HTML. | La lista pública no responde hasta que Postgres contesta. |
| Caché | `routeRules` en `nuxt.config.ts`. Hoy solo `/privacy` y `/commitment` tienen `prerender`. Cookies de sesión en HTML público. | Una ficha anónima no se puede cachear en el edge. |
| Consulta | Columnas seleccionadas, filtros, número de idas a la base en una misma página. | Un detalle público hace consultas en serie, o trae columnas que la vista no muestra. |
| RLS e índices | Policies y `WHERE` de listados públicos. | Un listado anónimo recorre la tabla. Confirmar con el plan, no suponerlo. |
| Worker | CPU y tiempo de la request en Cloudflare, no el proceso de `nuxt dev`. | El Worker espera E/S evitable (varias queries que podrían ir en paralelo o no hacer falta). |

## Indicadores — agent-readiness

Basado en las categorías de [isitagentready.com](https://isitagentready.com/). Estado inicial típico del repo: `public/robots.txt` mínimo (`Allow` global), sin `@nuxtjs/seo`, sin sitemap generado, sin reglas explícitas para crawlers de IA.

### Discoverability

| Check | Qué verificar | En Redeventos |
| --- | --- | --- |
| robots.txt | Válido, política clara, referencia a sitemap si existe | `public/robots.txt` |
| Sitemap | URL absoluta listada en robots; rutas públicas en inglés (`/events`, `/privacy`, …) | Falta salvo que se añada `@nuxtjs/seo` o equivalente |
| Link headers | `Link` en respuestas útiles (canonical, alternates) | Revisar SSR de home y fichas |
| DNS-AID | Registros DNS para descubrimiento por IA (Cloudflare) | Infra del dominio de producción, no el repo solo |

### Content accessibility

| Check | Qué verificar | En Redeventos |
| --- | --- | --- |
| Markdown negotiation | `Accept: text/markdown` o rutas `.md` para agentes | Opcional; prioridad baja frente a HTML semántico + SEO |
| HTML útil | Títulos, descripciones, `lang="es-CO"`, copy en `shared/content/` | Ya en layouts y `useSeoMeta` |

### Bot access control

| Check | Qué verificar | En Redeventos |
| --- | --- | --- |
| AI bot rules | Directivas en robots para bots de IA (permitir o restringir de forma explícita) | No definidas hoy |
| Content Signals | Señales de uso permitido del contenido | No aplicado |
| Web Bot Auth | Autenticación de bots | No aplicado; evaluar solo si producto lo pide |

### Protocol discovery (API / auth / MCP)

| Check | Qué verificar | En Redeventos |
| --- | --- | --- |
| API Catalog | Catálogo de APIs públicas | Supabase REST no es catálogo de producto; rutas Nitro propias si existen |
| OAuth discovery / Protected Resource / Auth.md | Metadatos OAuth para clientes | Auth es Supabase en `/login`; no exponer secretos en metadatos públicos |
| MCP Server Card / Agent Skills / WebMCP / ARD | Manifiestos para agentes en el **dominio del sitio** | Distinto de skills en `.cursor/skills/` — solo si hay decisión de producto |
| A2A Agent Card | Tarjeta agent-to-agent | No aplica al piloto salvo requisito explícito |

### Commerce

| Check | En Redeventos |
| --- | --- |
| x402, MPP, UCP, ACP | **No aplica** — sin pagos ni checkout agentic en el piloto |

### Prioridad sugerida (easy wins → avanzado)

1. **robots.txt** completo: reglas para bots de IA, `Sitemap:` apuntando a URL de producción, `Disallow` de `/app/` si no debe indexarse.
2. **Sitemap** de rutas públicas estáticas y fichas con slug (eventos, espacios, aliados, casos, legales).
3. **Metadatos de descubrimiento**: `useSeoMeta`, canonical, Open Graph en home y listados (skill `nuxt-seo`).
4. **Semántica y accesibilidad** ya alineadas con humanos (mejoran también lectura por agentes).
5. Protocolos MCP/OAuth/comercio en el dominio público solo con requisito de producto y revisión de privacidad.

## Restricciones

- El sitio no es un `nuxt generate` estático. Un módulo pensado para imágenes, iframes y vídeo por viewport no cubre este camino crítico.
- No añadir dependencias de rendimiento sin un indicador observado que esa dependencia mueva.
- No proponer Sentry, PostHog ni colas como arreglo de carga: están fuera del piloto.
- El blur y la fuente son decisiones de marca. Si se tocan, conservar contraste legible y la familia Ubuntu Sans.
- Agent-readiness no justifica indexar WhatsApp, teléfonos directos ni datos solo post-match.
- Las recomendaciones del escáner son orientativas; validar con criterio de producto y legal antes de implementar.

## Informe

```markdown
## Superficie
[pública | /app | Worker | Postgres] — [dev | build/preview | producción]

## Camino crítico (rendimiento)
1. …

## Indicadores de rendimiento
| Indicador | Estado | Evidencia | Efecto |
| --- | --- | --- | --- |
| … | observado \| desconocido | … | … |

## Agent-readiness ([isitagentready.com](https://isitagentready.com/))
| Categoría / check | Estado | Evidencia | Notas |
| --- | --- | --- | --- |
| Discoverability — robots.txt | presente \| parcial \| ausente \| n/a | … | … |
| … | … | … | … |

## Cambio propuesto
Un cambio. Qué indicador mueve. Qué no toca.
```

## Checklist

```
- [ ] ¿La queja es dev o el sitio servido?
- [ ] ¿Cada indicador de rendimiento tiene evidencia o está marcado desconocido?
- [ ] ¿Se recorrieron las 5 categorías agent-ready sin confundir MCP de Cursor con MCP público?
- [ ] ¿El cambio es el más pequeño que mueve ese indicador?
- [ ] ¿Hace falta nuxt-seo o supabase-postgres-best-practices antes de implementar?
```
