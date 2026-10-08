# Stack técnico --- Redeventos

> Arquitectura del piloto de **Redeventos**, la plataforma que conecta
> organizadores, venue sponsors y local sponsors en Pereira y
> Dosquebradas.
>
> El alcance de producto está cerrado en [`idea.md`](../product/idea.md). Este documento dice
> cómo se construye ese alcance.
>
> **Stack elegido:** Nuxt 4 + Cloudflare Workers + Supabase.
>
> Última revisión: septiembre de 2026.

------------------------------------------------------------------------

## 1. Resumen ejecutivo

La plataforma se construirá como una aplicación web full-stack con:

-   **Nuxt 4 + Vue 3 + TypeScript** para frontend y SSR.
-   **Nitro** para server routes y lógica backend que deba ejecutarse en
    servidor.
-   **Cloudflare Workers** como runtime/deployment principal.
-   **Cloudflare DNS/CDN/Cache** para infraestructura perimetral.
-   **Supabase PostgreSQL** como base de datos principal.
-   **Supabase Auth** para autenticación.
-   **Supabase Storage** para archivos que inicialmente convenga
    mantener junto al backend.
-   **Supabase Row Level Security (RLS)** como capa fundamental de
    autorización.
-   **Resend** para correo transaccional.
-   **PostHog** para analítica de producto.
-   **Sentry** para observabilidad de errores, si/ cuando sea necesario.
-   **Biome** para lint y formato.
-   **Vitest** para pruebas unitarias.
-   **Playwright** para pruebas E2E.
-   **GitHub Actions** para CI/CD.
-   **Bun** como package manager/runtime local preferido.
-   **Cursor** como IDE/agente de desarrollo.
-   **Agent Skills + MCP** para que el agente tenga conocimiento
    actualizado y pueda interactuar con GitHub, Supabase, Cloudflare,
    Playwright y PostHog.

La decisión principal es mantener la infraestructura pequeña durante la
validación:

``` text
                         Internet
                            |
                            v
                    +---------------+
                    |   Cloudflare  |
                    | DNS / CDN /   |
                    | Cache / WAF   |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    |    Nuxt 4     |
                    |     Nitro     |
                    | Cloudflare    |
                    |    Workers    |
                    +-------+-------+
                            |
               +------------+------------+
               |                         |
               v                         v
        +--------------+          +-------------+
        |   Supabase   |          |   Resend    |
        | PostgreSQL   |          |   Email     |
        | Auth         |          +-------------+
        | Storage      |
        | RLS          |
        +--------------+
               |
               v
        Datos de negocio
```

La regla de arquitectura será:

> **No añadir otro servicio mientras Nuxt + Cloudflare + Supabase
> resuelvan correctamente el problema.**

------------------------------------------------------------------------

# 2. Objetivo del producto

La plataforma no debe comenzar como un simple calendario de eventos.

El problema que resuelve el piloto:

> Un organizador en Pereira o Dosquebradas tiene un evento gratuito o de
> bajo costo, y necesita espacio, productos, alimentación, equipos,
> servicios o difusión para realizarlo.

La unidad central es el **evento**. El match lo cierran las partes. El
producto no depende de un operador que las presente.

``` text
Organizador
    |
    +---- propuesta ----> Venue sponsor
    |
    +---- propuesta ----> Local sponsor
    |
    v
Compromiso
    |
    v
EVENTO con fecha y lugar
    |
    v
Ficha pública + enlace de inscripción
```

## 2.1 Alcance que la arquitectura debe respetar

Estas reglas vienen de `idea.md` y acotan el MVP. Una feature que las
rompa no entra en el piloto.

-   Territorio: Pereira y Dosquebradas.
-   Interfaz en español. Fechas en `America/Bogota`.
-   Una cuenta de persona puede ser organizador, venue sponsor y local
    sponsor a la vez. Cada rol tiene su vista.
-   El moderador aprueba evidencias, oculta contenido reportado y
    desafilia. No aprueba publicaciones ni matches.
-   Aportes del piloto: espacio, productos, alimentación, equipos,
    servicios y difusión. Cantidad o descripción. Sin montos.
-   Quedan fuera del piloto los pagos, la comisión, el RSVP propio, la
    API de Luma, el chat, las entradas y el calendario de precios.
-   El evento exige un enlace de inscripción externo.
-   La ficha pública existe solo con fecha concreta y lugar.
-   Antes de eso, el evento es visible para sponsors autenticados.
-   La propuesta lleva necesidad, cantidad y fecha. Puede iniciarla
    cualquiera de los dos lados. Aceptarla crea el compromiso de match
    y revela WhatsApp y teléfono.
-   Correo, Instagram y web son públicos desde el perfil.
-   Hay dos textos de compromiso distintos: el de registro y el de
    match.
-   El evento queda realizado cuando el moderador aprueba la evidencia.
-   El calendario del venue se deriva de propuestas y matches. No se
    edita como una grilla de disponibilidad.
-   Las sugerencias salen de reglas fijas: categoría, tipo de
    necesidad, asistentes, ciudad y fecha.
-   El aviso de privacidad se muestra en el registro. El responsable
    del tratamiento, en el piloto, es una persona natural.

------------------------------------------------------------------------

# 3. Stack definitivo

## 3.1 Frontend

### Nuxt 4

Responsabilidades:

-   SSR.
-   Routing.
-   SEO.
-   páginas públicas.
-   dashboard.
-   formularios.
-   server routes.
-   integración con Supabase.
-   composición de UI.
-   manejo de metadata.
-   generación de páginas dinámicas.

Documentación:

-   https://nuxt.com/docs
-   https://nuxt.com/deploy

Nuxt dispone de soporte oficial para despliegue en Cloudflare mediante
Nitro/Workers.

------------------------------------------------------------------------

## 3.2 Vue 3

Vue será la capa de UI.

Utilizar:

-   Composition API.
-   `<script setup>`.
-   composables.
-   componentes pequeños.
-   TypeScript.
-   fragmentación de UI y copy (páginas orquestadoras; textos en
    `shared/content/` o módulos `*.content.ts`; detalle para agentes en
    `.agents/skills/nuxt/references/best-practices-component-fragmentation.md`).

Evitar:

-   lógica de negocio compleja dentro de componentes.
-   acceso directo a múltiples servicios desde componentes.
-   componentes gigantes.
-   bloques largos de copy en templates de páginas.

------------------------------------------------------------------------

## 3.3 TypeScript

TypeScript será obligatorio.

Objetivos:

-   contratos explícitos.
-   tipos generados desde Supabase.
-   evitar `any`.
-   DTOs y tipos de dominio.
-   mayor precisión para agentes de código.

Regla:

``` text
No any salvo una excepción documentada.
```

------------------------------------------------------------------------

## 3.4 Biome

Biome será el linter y el formateador del proyecto.

Sustituye a ESLint y Prettier. No instalar ambos en paralelo.

Responsabilidades:

-   lint de JavaScript, TypeScript, JSON y Vue.
-   formato consistente.
-   organización de imports.
-   chequeo en desarrollo y en CI.

Usar:

-   `@biomejs/biome`.
-   `biome.json` en la raíz.
-   `biome check` como comando único de lint y formato.
-   reglas `recommended` como punto de partida.
-   la extensión de Biome en Cursor, con formato al guardar.

Evitar:

-   ESLint.
-   Prettier.
-   dos formatters compitiendo en el editor.
-   desactivar reglas para silenciar un error local sin documentarlo.

El soporte de Vue/SFC debe activarse según la documentación actual de
Biome. La configuración exacta no se congela aquí: seguir la guía
oficial en el momento de implementación.

Documentación:

-   https://biomejs.dev/guides/getting-started/
-   https://biomejs.dev/guides/integrate-in-ci/
-   https://biomejs.dev/internals/language-support/

------------------------------------------------------------------------

# 4. UI

## Tailwind CSS

Usarlo como sistema principal de estilos.

Ventajas:

-   rápido para prototipar.
-   consistente.
-   excelente integración con Nuxt.
-   fácil de modificar mediante Cursor.

------------------------------------------------------------------------

## Nuxt UI

Usar Nuxt UI para:

-   botones.
-   inputs.
-   formularios.
-   modales.
-   dropdowns.
-   tabs.
-   tablas.
-   cards.
-   navegación.
-   feedback visual.

Esto evita construir desde cero un design system completo durante el
MVP.

Documentación:

https://ui.nuxt.com/

------------------------------------------------------------------------

# 5. Backend

## Nitro

Nitro es el backend integrado de Nuxt.

Usarlo para:

-   server routes.
-   operaciones que requieren secretos.
-   webhooks.
-   integración con APIs externas.
-   lógica que no debe ejecutarse en navegador.
-   endpoints internos.
-   operaciones administrativas.

Ejemplo:

``` text
server/
  api/
    events/
      index.get.ts
      index.post.ts
      [id].get.ts
      [id].patch.ts
    needs/
    venues/
    offers/
    matches/
    evidence/
    webhooks/
```

No convertir Nitro en un backend monolítico innecesariamente grande.

------------------------------------------------------------------------

# 6. Cloudflare

## 6.1 Cloudflare Workers

Cloudflare Workers será el runtime de Nuxt.

Cloudflare documenta despliegues de Nuxt directamente sobre Workers y
Wrangler puede detectar un proyecto Nuxt y generar la configuración
necesaria.

Referencia:

https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/nuxt/

Configuración conceptual:

``` ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare'
  }
})
```

La configuración exacta debe seguir la versión actual de Nuxt/Nitro y el
adaptador oficial en el momento de implementación.

------------------------------------------------------------------------

## 6.2 Wrangler

Wrangler será la CLI de Cloudflare.

Responsabilidades:

-   desarrollo local.
-   configuración Workers.
-   deployment.
-   variables/bindings.
-   observabilidad.
-   integración CI/CD.

No escribir Workers manualmente salvo que exista una necesidad
específica.

Nuxt + Nitro será la abstracción principal.

------------------------------------------------------------------------

## 6.3 Cloudflare DNS

El dominio principal se administrará mediante Cloudflare DNS.

Ejemplo:

``` text
example.com
www.example.com
app.example.com
api.example.com
```

En principio no necesitamos un subdominio separado para API porque Nitro
puede servirlo desde el mismo proyecto.

------------------------------------------------------------------------

## 6.4 Cloudflare CDN / Cache

Las páginas públicas deberán aprovechar caching cuando sea posible.

Especialmente:

``` text
/events
/agenda
/events/[slug]
/venues/[slug]
/sponsors/[slug]
/cases/[slug]
```

`/agenda` y `/events/[slug]` solo aplican cuando el evento ya es `public`
(fecha concreta y lugar). `/events` lista eventos que buscan apoyo
(necesidades abiertas). El match y el contacto directo siguen en `/app`.

Mientras que:

``` text
/app
/app/events
/app/moderation
```

serán dinámicas.

Objetivo:

> Evitar que cada visita pública provoque consultas innecesarias contra
> Supabase.

------------------------------------------------------------------------

## 6.5 Cloudflare WAF / seguridad

A medida que el producto crezca se podrán añadir:

-   WAF.
-   rate limiting.
-   bot protection.
-   reglas específicas.
-   Turnstile.
-   Access para herramientas internas.

No añadir complejidad hasta que exista una necesidad real.

------------------------------------------------------------------------

# 7. Supabase

## 7.1 PostgreSQL

PostgreSQL será la fuente de verdad del negocio.

Entidades iniciales:

``` text
profiles
profile_roles
registration_commitments
events
event_needs
venues
offers
matches
match_commitments
evidence
event_media
```

No entran en el piloto `organizations`, `bookings`, `messages`,
`event_attendees` ni `venue_availability`. El calendario del venue se
calcula desde `offers` y `matches`. La inscripción vive en `events.rsvp_url`.

`profile_roles` permite que la misma persona sea `organizer`,
`venue_sponsor` y `local_sponsor`. El rol `moderator` es aparte y no se
autoasigna.

------------------------------------------------------------------------

# 8. Row Level Security

RLS es obligatorio.

Supabase recomienda configurar RLS para las tablas expuestas mediante la
Data API.

Referencia:

https://supabase.com/docs/guides/getting-started/quickstarts/nuxtjs

Principio:

``` text
Frontend
   |
   v
Supabase API
   |
   v
RLS
   |
   v
PostgreSQL
```

No confiar únicamente en:

``` text
if (user.isModerator)
```

en el frontend.

La autorización debe estar respaldada por PostgreSQL/RLS.

------------------------------------------------------------------------

# 9. Autenticación

Usar:

**Supabase Auth**

Posibles métodos iniciales:

-   email/password.
-   magic link.
-   OAuth cuando exista una necesidad real.

Roles de una misma cuenta:

``` text
organizer
venue_sponsor
local_sponsor
moderator
```

Una persona puede tener los tres primeros a la vez. El asistente no
tiene cuenta: llega a la ficha pública y sigue el enlace de inscripción.

`moderator` no se otorga en el registro público.

------------------------------------------------------------------------

# 10. SSR + Supabase Auth

La autenticación debe funcionar correctamente con SSR.

Supabase documenta la compatibilidad de Auth con aplicaciones SSR y
recomienda el uso de cookies/sesiones apropiadas para el flujo.

Referencia:

https://supabase.com/docs/guides/auth/server-side

La sesión no debe depender exclusivamente de `localStorage`.

------------------------------------------------------------------------

# 11. Supabase Storage

Storage se utilizará inicialmente para:

-   logos.
-   portadas.
-   imágenes de eventos.
-   imágenes de venues.
-   evidencia de realización.
-   documentos pequeños del compromiso, cuando haga falta.

Regla:

> Comprimir y transformar imágenes antes de almacenarlas siempre que sea
> posible.

Restricciones recomendadas para MVP:

``` text
Logo:
1 MB máximo

Portada:
2 MB máximo

Galería:
5 imágenes/evento inicialmente

Formato:
WebP / AVIF cuando sea viable
```

No permitir que un usuario suba fotografías originales de 15--30 MB sin
procesamiento.

------------------------------------------------------------------------

# 12. Base de datos y migraciones

Las modificaciones de esquema deben realizarse mediante migraciones.

Estructura:

``` text
supabase/
  migrations/
    0001_profiles_and_commitments.sql
    0002_events_and_needs.sql
    0003_venues.sql
    0004_offers_and_matches.sql
    0005_evidence.sql
```

No hacer cambios manuales en producción que no queden representados en
el repositorio.

Flujo:

``` text
Local
  |
  v
Migration
  |
  v
Review
  |
  v
CI
  |
  v
Staging
  |
  v
Production
```

------------------------------------------------------------------------

# 13. Tipos TypeScript

Los tipos de PostgreSQL/Supabase deben generarse y versionarse.

Objetivo:

``` text
PostgreSQL
     |
     v
Supabase generated types
     |
     v
TypeScript
     |
     v
Nuxt
```

Esto reduce discrepancias entre:

-   DB.
-   API.
-   frontend.

------------------------------------------------------------------------

# 14. Estructura recomendada del proyecto

Para el MVP no necesitamos un monorepo.

Propuesta:

``` text
event-platform/
├── app/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   └── utils/
│
├── server/
│   ├── api/
│   │   ├── events/
│   │   ├── needs/
│   │   ├── venues/
│   │   ├── offers/
│   │   ├── matches/
│   │   ├── evidence/
│   │   └── webhooks/
│   ├── middleware/
│   └── utils/
│
├── shared/
│   ├── types/
│   ├── constants/
│   └── schemas/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── public/
│
├── .cursor/
│   └── rules/
│
├── .github/
│   └── workflows/
│
├── nuxt.config.ts
├── wrangler.jsonc
├── biome.json
├── package.json
├── tsconfig.json
└── README.md
```

La estructura puede evolucionar; no convertirla en una arquitectura
rígida antes de que el dominio esté validado.

------------------------------------------------------------------------

# 15. Validación

## Zod

Usar Zod para validar:

-   formularios.
-   payloads.
-   parámetros.
-   endpoints.
-   datos externos.

Ejemplo conceptual:

``` ts
const createEventSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(5000),
  startsAt: z.coerce.date(),
  expectedAttendees: z.number().int().positive()
})
```

La validación debe existir tanto donde sea necesaria para UX como en el
servidor.

Nunca confiar exclusivamente en la validación del navegador.

------------------------------------------------------------------------

# 16. Formularios

Usar Vue/Nuxt forms con:

-   Zod.
-   validación server-side.
-   estados loading/error/success.
-   feedback accesible.

No crear un sistema de formularios propio durante el MVP.

------------------------------------------------------------------------

# 17. Testing

## Vitest

Para:

-   reglas de negocio.
-   funciones puras.
-   validaciones.
-   transformaciones.
-   utilidades.
-   casos de dominio.

Ejemplos:

``` text
event status transitions
need coverage, incluida la cobertura parcial
offer acceptance
contact reveal al aceptar
public page gate: fecha concreta y lugar
evidence approval
registration and match commitments
permissions
validation
```

------------------------------------------------------------------------

## Playwright

Para E2E.

Flujos iniciales:

``` text
Registro con aviso de privacidad y compromiso
Login
Crear evento con necesidades y enlace de inscripción
Publicar evento para sponsors
Crear venue
Enviar propuesta desde cada lado
Aceptar propuesta y revelar contactos directos
Enviar evidencia
Moderador aprueba evidencia
Ficha pública solo con fecha y lugar
```

El objetivo no es probar todos los componentes.

El objetivo es proteger los flujos de negocio.

------------------------------------------------------------------------

# 18. Playwright MCP

El Playwright MCP oficial permite que un agente controle un navegador
mediante MCP utilizando snapshots del árbol de accesibilidad.

Es especialmente útil para:

-   explorar el producto.
-   reproducir bugs.
-   probar flujos.
-   inspeccionar formularios.
-   validar navegación.
-   interactuar con entornos locales.

Referencia oficial:

https://github.com/microsoft/playwright-mcp

Configuración conceptual:

``` json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Para Cursor, se puede configurar desde sus ajustes de MCP.

------------------------------------------------------------------------

# 19. Email

Modelo completo: [`notifications.md`](./notifications.md).

## Resend

Canal **absoluto** del piloto para avisos transaccionales de la app.
Confirmación de registro y magic links siguen en **Supabase Auth**.

En el piloto se envían (si la preferencia de email está ON):

-   propuesta recibida (A).
-   propuesta aceptada, con el contacto directo **de la contraparte** (B).
-   evidencia enviada o reenviada, a todos los moderadores (E).
-   evidencia aprobada o rechazada, al organizador (F).

El envío ocurre en rutas **Nitro de negocio** tras el RPC/write
(`server_after_business_ok`): síncrono, sin cola. El cliente no dispara
un `POST /api/notifications/*` aparte. Si Resend falla, el negocio no
se revierte.

Preferencias marcables en `/app/profile`. WhatsApp Cloud API, push, SMS
e inbox propio quedan fuera del piloto.

Free actual consultado:

-   3.000 emails/mes.
-   100 emails/día.

Referencia:

https://resend.com/pricing

No convertir el email en una plataforma de notificaciones (cola, inbox,
multi-canal) durante el MVP.

------------------------------------------------------------------------

# 20. Analytics

## PostHog

PostHog será opcional pero recomendable desde las primeras validaciones.

Eventos iniciales:

``` text
registration_completed
event_created
event_published
event_made_public
venue_created
offer_sent
offer_accepted
evidence_submitted
evidence_approved
event_viewed
```

El primer millón de eventos mensuales de Product Analytics es gratuito
según la documentación actual.

Referencia:

https://posthog.com/product-analytics

------------------------------------------------------------------------

# 21. PostHog MCP

PostHog dispone de MCP remoto para interactuar con:

-   analytics.
-   feature flags.
-   investigaciones.
-   datos del producto.

Endpoint actual:

``` text
https://mcp.posthog.com/mcp
```

Referencia:

https://posthog.com/docs/model-context-protocol/cursor

Esto permitiría preguntas como:

``` text
"¿Cuántos eventos publicados tuvieron al menos una visita esta semana?"

"¿Dónde están abandonando el formulario de creación de evento?"

"Compara el funnel de organizadores registrados vs eventos publicados."
```

Debe revisarse cuidadosamente cada operación del agente antes de
ejecutarla.

------------------------------------------------------------------------

# 22. Observabilidad

## Sentry

Sentry puede añadirse cuando exista tráfico suficiente o cuando el MVP
empiece a tener usuarios reales.

Usarlo para:

-   errores frontend.
-   errores server-side.
-   stack traces.
-   performance.
-   releases.

Durante las primeras pruebas puede ser suficiente Cloudflare + logs +
herramientas de desarrollo.

------------------------------------------------------------------------

# 23. GitHub

GitHub será:

-   repositorio.
-   pull requests.
-   issues.
-   GitHub Actions.
-   releases.
-   documentación técnica.

Branching inicial:

``` text
main
  |
  +-- feature/*
  +-- fix/*
  +-- chore/*
```

No necesitamos GitFlow completo.

------------------------------------------------------------------------

# 24. GitHub Actions

Pipeline inicial:

``` text
push / pull request
        |
        v
Install dependencies
        |
        v
Biome
        |
        v
Typecheck
        |
        v
Unit tests
        |
        v
Build
        |
        v
E2E
        |
        v
Deploy
```

En producción:

``` text
main
  |
  v
GitHub Actions
  |
  v
Cloudflare Workers
```

Las migraciones de Supabase deben tener un proceso controlado y separado
del deployment de frontend.

------------------------------------------------------------------------

# 25. GitHub MCP

GitHub mantiene un MCP oficial que permite a agentes trabajar con:

-   repositorios.
-   archivos.
-   issues.
-   pull requests.
-   GitHub Actions.
-   análisis de código.
-   seguridad.
-   Dependabot.

Referencia:

https://github.com/github/github-mcp-server

Para este proyecto sería especialmente útil para:

``` text
"Revisa los últimos fallos de CI."

"Analiza este PR."

"Busca dónde se usa esta función."

"Resume los issues abiertos de la funcionalidad de venues."

"Revisa los resultados de GitHub Actions."
```

Recomendación:

> Inicialmente habilitar el menor conjunto de toolsets necesario y
> preferir read-only para tareas de análisis.

------------------------------------------------------------------------

# 26. Agent Skills

Los MCP permiten que el agente interactúe con sistemas.

Las **Agent Skills** tienen otra función:

> Enseñarle al agente cómo realizar correctamente una clase de trabajo.

Para este proyecto son especialmente importantes.

------------------------------------------------------------------------

# 27. Supabase Agent Skills

Supabase mantiene un repositorio oficial de Agent Skills.

Instalación:

``` bash
npx skills add supabase/agent-skills
```

Skill principal:

``` bash
npx skills add supabase/agent-skills --skill supabase
```

Skill de PostgreSQL:

``` bash
npx skills add supabase/agent-skills \
  --skill supabase-postgres-best-practices
```

Referencia:

https://supabase.com/docs/guides/ai-tools/ai-skills

La skill `supabase-postgres-best-practices` debe cargarse antes de
modificar:

-   tablas.
-   columnas.
-   índices.
-   migraciones.
-   RLS.
-   triggers.
-   funciones.
-   queues.
-   consultas complejas.

Esto es especialmente importante para nuestro proyecto porque gran parte
de la lógica del marketplace estará en PostgreSQL.

------------------------------------------------------------------------

# 28. Cloudflare Agent Skills

Cloudflare mantiene un repositorio oficial de Agent Skills para:

-   Workers.
-   Wrangler.
-   almacenamiento.
-   seguridad.
-   Agents SDK.
-   plataforma Cloudflare.

Repositorio:

https://github.com/cloudflare/skills

Para Cursor se puede instalar desde el marketplace o como Remote
Rule/skill.

También existe un plugin de Cloudflare que combina Skills + MCP.

------------------------------------------------------------------------

# 29. Cloudflare MCP

Cloudflare mantiene MCPs oficiales.

Especialmente interesantes:

``` text
Cloudflare API MCP
Cloudflare Documentation MCP
Workers Bindings MCP
Workers Builds MCP
Observability MCP
```

Endpoints documentados por Cloudflare:

``` text
https://mcp.cloudflare.com/mcp
https://docs.mcp.cloudflare.com/mcp
https://bindings.mcp.cloudflare.com/mcp
https://builds.mcp.cloudflare.com/mcp
https://observability.mcp.cloudflare.com/mcp
```

Referencia:

https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/

Esto permite que el agente:

-   consulte documentación actual.
-   inspeccione configuración.
-   diagnostique Workers.
-   revise observabilidad.
-   trabaje con bindings.
-   ayude con deployments.

------------------------------------------------------------------------

# 30. Supabase MCP

Supabase tiene un MCP oficial remoto.

Endpoint:

``` text
https://mcp.supabase.com/mcp
```

Permite al agente trabajar con:

-   proyectos.
-   tablas.
-   migraciones.
-   SQL.
-   configuración.
-   logs.
-   ramas.
-   tipos TypeScript.
-   Edge Functions.

Referencia:

https://supabase.com/docs/guides/ai-tools/mcp

Supabase permite autenticar mediante OAuth y recomienda limitar el
acceso del MCP al proyecto necesario.

------------------------------------------------------------------------

# 31. Seguridad del MCP

Los MCP tendrán acceso a infraestructura real.

Por tanto:

``` text
MCP ≠ solo autocomplete
```

Un MCP puede tener permisos para:

``` text
leer
crear
modificar
eliminar
desplegar
```

Reglas:

1.  No conectar agentes directamente a producción sin necesidad.
2.  Preferir entornos de desarrollo/staging.
3.  Usar OAuth cuando esté disponible.
4.  Limitar toolsets.
5.  Preferir read-only para diagnóstico.
6.  Revisar operaciones destructivas.
7.  No colocar tokens en el repositorio.
8.  No permitir que datos externos dicten acciones administrativas sin
    revisión humana.
9.  Mantener RLS incluso cuando un agente interactúe con Supabase.
10. Separar credenciales de desarrollo y producción.

------------------------------------------------------------------------

# 32. MCP recomendado por etapa

## Día 1

Instalar:

``` text
Supabase Agent Skills
Supabase MCP
Cloudflare Skills
Cloudflare Documentation MCP
Playwright MCP
GitHub MCP
```

Esto cubre prácticamente todo el ciclo:

``` text
Código
  +
Base de datos
  +
Infraestructura
  +
Git
  +
Browser testing
```

------------------------------------------------------------------------

## Cuando exista analytics

Añadir:

``` text
PostHog MCP
```

------------------------------------------------------------------------

## Cuando exista observabilidad real

Añadir:

``` text
Cloudflare Observability MCP
Sentry MCP
```

si el proveedor/cliente utilizado ofrece una integración MCP estable
para el flujo que necesitemos.

------------------------------------------------------------------------

# 33. Matriz de herramientas

  Herramienta          Tipo             Uso               Prioridad
  -------------------- ---------------- ----------------- -----------
  Nuxt                 Framework        Aplicación        CRÍTICA
  Vue                  UI               Frontend          CRÍTICA
  TypeScript           Lenguaje         Tipado            CRÍTICA
  Nitro                Backend          Server routes     CRÍTICA
  Cloudflare Workers   Infra            Runtime           CRÍTICA
  Wrangler             CLI              Deployment        CRÍTICA
  Supabase             Backend          DB/Auth/Storage   CRÍTICA
  PostgreSQL           DB               Datos             CRÍTICA
  RLS                  Seguridad        Autorización      CRÍTICA
  Tailwind             CSS              UI                ALTA
  Nuxt UI              UI kit           Componentes       ALTA
  Zod                  Validación       Contratos         ALTA
  Biome                Tooling          Lint/formato      ALTA
  Vitest               Testing          Unit              ALTA
  Playwright           Testing          E2E               ALTA
  GitHub               SCM              Código/PR         CRÍTICA
  GitHub Actions       CI/CD            Automatización    ALTA
  Resend               Email            Transaccional     MEDIA
  PostHog              Analytics        Producto          MEDIA
  Sentry               Observabilidad   Errores           MEDIA
  Bun                  Tooling          Package manager   ALTA
  Cursor               AI IDE           Desarrollo        ALTA

------------------------------------------------------------------------

# 34. Matriz Agent Skills / MCP

  Sistema                               Skill                         MCP Uso principal
  ------------ ------------------------------ --------------------------- ----------------------------
  Supabase                                 Sí                          Sí DB/Auth/RLS/migrations
  PostgreSQL                               Sí      Indirecto vía Supabase Schema/query/performance
  Cloudflare                               Sí                          Sí Workers/DNS/observabilidad
  GitHub                                  ---                          Sí Repo/PR/Actions
  Playwright                              ---                          Sí Browser/E2E
  PostHog                                 ---                          Sí Analytics/flags
  Nuxt           Skills comunitarias posibles           No imprescindible Framework
  Vue            Skills comunitarias posibles           No imprescindible UI
  Resend                                  ---   No necesario inicialmente Email
  Sentry                                  ---                    Opcional Observabilidad

------------------------------------------------------------------------

# 35. Qué NO añadir inicialmente

No añadir:

-   Redis.
-   Kafka.
-   Kubernetes.
-   Docker para producción.
-   microservicios.
-   API Gateway separado.
-   backend NestJS.
-   backend FastAPI.
-   Elasticsearch.
-   MongoDB.
-   GraphQL.
-   sistema de pagos.
-   chat.
-   RSVP propio o sincronización con Luma.
-   recomendaciones mediante IA.
-   vector database.
-   event bus.
-   CDN de imágenes externo sin necesidad.
-   inbox de notificaciones, cola/outbox o WhatsApp Cloud API en el piloto
    (el correo transaccional Resend sí forma parte del stack; ver
    [`notifications.md`](./notifications.md)).
-   ESLint ni Prettier: el lint y el formato son responsabilidad de
    Biome.

La arquitectura inicial debe ser deliberadamente aburrida.

------------------------------------------------------------------------

# 36. Cuándo introducir servicios adicionales

## Redis

Solo si necesitamos:

-   cache fuera de Cloudflare.
-   rate limiting avanzado.
-   jobs.
-   locks.
-   procesamiento asíncrono.

------------------------------------------------------------------------

## Queue

Introducir cuando existan tareas como:

``` text
enviar 10.000 emails
procesar imágenes
generar documentos
importar eventos
calcular matches
```

No ejecutar trabajos pesados dentro de una request normal.

------------------------------------------------------------------------

## R2

Considerar Cloudflare R2 si:

-   Storage de Supabase empieza a ser costoso.
-   necesitamos muchas imágenes.
-   necesitamos archivos grandes.
-   queremos almacenamiento estrechamente integrado con Cloudflare.

No migrar a R2 solo por "es más escalable".

------------------------------------------------------------------------

## Cloudflare Queues / Workflows

Considerarlos para:

-   procesos largos.
-   tareas asíncronas.
-   workflows con varios pasos.
-   notificaciones.
-   sincronizaciones.

Cloudflare Workflows tiene un modelo de ejecución durable y puede
resultar útil cuando aparezcan procesos que no deben depender de una
única request.

------------------------------------------------------------------------

# 37. Estrategia de costes

Objetivo inicial:

``` text
$0–25 USD/mes
```

El stack gratuito debe utilizarse mientras validamos.

Supabase Free actualmente incluye:

-   500 MB DB/proyecto.
-   5 GB egress.
-   1 GB Storage.
-   50.000 MAU.
-   500.000 Edge Function invocations.
-   2 millones de mensajes Realtime.

Referencia:

https://supabase.com/docs/guides/platform/billing-on-supabase

Cloudflare Workers Free actualmente tiene:

-   100.000 requests/día.
-   10 ms CPU por invocation.
-   128 MB memoria.

Referencia:

https://developers.cloudflare.com/workers/platform/limits/

Resend Free:

-   hasta 3.000 emails/mes.

PostHog:

-   primer 1.000.000 de eventos/mes gratis para Product Analytics.

Esto hace posible validar el producto con una infraestructura muy
barata.

------------------------------------------------------------------------

# 38. Primer punto de upgrade

El primer upgrade probablemente será:

``` text
Supabase Pro
```

No necesariamente porque el número de usuarios sea enorme, sino porque
una aplicación productiva necesita:

-   backups.
-   menor riesgo operativo.
-   mayor DB.
-   mayor egress.
-   mayor Storage.
-   ausencia de pausas por inactividad.

El plan Pro actual parte de aproximadamente:

``` text
$25/mes
```

Referencia:

https://supabase.com/pricing

------------------------------------------------------------------------

# 39. Cloudflare Paid

Cloudflare Workers Free tiene un límite de:

``` text
100.000 requests/día
```

Cuando el tráfico lo justifique se puede pasar a Workers Paid.

La arquitectura no necesita cambiar.

Ese es un punto importante:

``` text
Free
  |
  v
Paid
```

sin:

``` text
migración de arquitectura
```

------------------------------------------------------------------------

# 40. Proyección simplificada

  --------------------------------------------------------------------------
  Fase                Usuarios activos Arquitectura        Coste orientativo
  --------------- -------------------- ---------------- --------------------
  MVP                            \<500 Free                            \~\$0

  Validación                500--2.000 Free                            \~\$0

  Tracción local         2.000--10.000 Free/Pro                    \~\$0--25
                                       selectivo        

  Regional              10.000--50.000 Supabase Pro +            \~\$25--60+
                                       Workers Paid     
                                       según tráfico    

  Nacional             50.000--250.000 Optimización +           \~\$60--200+
                                       servicios        
                                       adicionales      

  Escala grande               250.000+ Arquitectura                 Variable
                                       especializada    
  --------------------------------------------------------------------------

Son estimaciones de arquitectura, no garantías de precio.

El consumo real dependerá de:

-   requests.
-   CPU.
-   egress.
-   almacenamiento.
-   tamaño DB.
-   emails.
-   analytics.
-   archivos.
-   conexiones concurrentes.

------------------------------------------------------------------------

# 41. Principio de caching

Las páginas públicas deben diseñarse para ser cacheables.

Ejemplo:

``` text
GET /events/python-pereira
```

puede tener:

``` text
Cloudflare Cache
      |
      +-- HIT → respuesta inmediata
      |
      +-- MISS
            |
            v
          Nuxt
            |
            v
         Supabase
```

Esto reduce:

-   CPU.
-   requests al Worker.
-   queries.
-   latencia.
-   coste.

------------------------------------------------------------------------

# 42. Seguridad

Checklist mínimo:

``` text
[ ] RLS en todas las tablas expuestas
[ ] Validación server-side
[ ] Secrets fuera del repositorio
[ ] Publishable key solamente en cliente
[ ] Secret/service-role key solamente servidor
[ ] CORS revisado
[ ] Rate limiting para endpoints sensibles
[ ] Protección contra abuso de formularios
[ ] Upload validation
[ ] MIME validation
[ ] Tamaño máximo de archivos
[ ] Sanitización de contenido
[ ] Logs sin secretos
[ ] Backups antes de producción
[ ] Staging separado
```

------------------------------------------------------------------------

# 43. Separación de entornos

Usar como mínimo:

``` text
local
staging
production
```

Idealmente:

``` text
Supabase local
Supabase staging
Supabase production
```

y:

``` text
Cloudflare preview
Cloudflare staging
Cloudflare production
```

Nunca usar la base de datos de producción para desarrollo diario.

------------------------------------------------------------------------

# 44. Variables de entorno

Ejemplo conceptual:

``` env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=

RESEND_API_KEY=

POSTHOG_KEY=
POSTHOG_HOST=

SENTRY_DSN=
```

Secretos:

``` text
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
SENTRY_AUTH_TOKEN
CLOUDFLARE_API_TOKEN
```

no deben aparecer:

-   en código.
-   en Git.
-   en logs.
-   en prompts.
-   en documentación pública.

------------------------------------------------------------------------

# 45. Cursor

Cursor será el principal entorno de desarrollo asistido por IA.

El repositorio debe tener reglas explícitas.

Propuesta:

``` text
.cursor/
  rules/
    architecture.mdc
    typescript.mdc
    supabase.mdc
    security.mdc
    testing.mdc
    biome.mdc
    cloudflare.mdc
```

------------------------------------------------------------------------

# 46. Reglas esenciales para Cursor

## architecture.mdc

El agente debe:

-   respetar Nuxt 4.
-   usar TypeScript.
-   usar Biome para lint y formato.
-   usar Nitro para server logic.
-   usar Supabase para persistencia.
-   evitar servicios nuevos sin justificación.
-   separar UI de dominio.
-   evitar lógica de negocio dentro de componentes.

------------------------------------------------------------------------

## supabase.mdc

El agente debe:

-   utilizar migraciones.
-   crear RLS.
-   respetar tipos.
-   evitar service role en cliente.
-   consultar la documentación actual.
-   usar Supabase Agent Skills.
-   revisar índices.
-   evitar queries N+1.

------------------------------------------------------------------------

## testing.mdc

El agente debe:

-   crear tests para reglas de negocio.
-   proteger flujos críticos.
-   usar Vitest para unit tests.
-   usar Playwright para E2E.
-   ejecutar tests relevantes antes de considerar una tarea terminada.

------------------------------------------------------------------------

## biome.mdc

El agente debe:

-   usar Biome para lint y formato.
-   no añadir ESLint ni Prettier.
-   no desactivar reglas para silenciar un error local.
-   dejar el código pasando `biome check` antes de considerar una
    tarea terminada.

------------------------------------------------------------------------

# 47. Bun

El proyecto usará Bun como herramienta preferida.

Ejemplo:

``` bash
bun install
bun add zod
bun add -d @biomejs/biome
bun add -d vitest
```

Para herramientas que tengan instaladores oficiales específicos de
Node/npm, usar el método oficial cuando sea necesario.

No forzar Bun cuando una herramienta no sea compatible.

------------------------------------------------------------------------

# 48. Inicialización

El método exacto debe seguir las versiones actuales de Nuxt/Cloudflare.

Como referencia, Cloudflare proporciona `create-cloudflare` para crear
proyectos Nuxt compatibles con Workers.

Conceptualmente:

``` bash
bunx create-cloudflare@latest
```

y seleccionar Nuxt.

Después:

``` bash
bun install
bunx @biomejs/biome init
bun run dev
```

Si el scaffolding de Nuxt trae ESLint, retirarlo y dejar Biome como
única fuente de lint y formato.

Antes del deployment definitivo, revisar la configuración generada por
Wrangler/Nitro.

------------------------------------------------------------------------

# 49. Primera versión funcional

El MVP implementa el piloto descrito en `idea.md`.

### Cuenta

``` text
Registro
    |
    v
Aviso de privacidad
    |
    v
Compromiso de registro
    |
    v
Perfil
    |
    +---- organizer
    +---- venue_sponsor
    +---- local_sponsor
```

Contactos públicos del perfil: correo, Instagram y web. Contactos
directos, guardados y ocultos hasta un match aceptado: WhatsApp y
teléfono.

### Organizador

``` text
Crear evento
    |
    +---- necesidades
    +---- enlace de inscripción
    +---- fecha o rango
    |
    v
Publicar para sponsors
    |
    v
Enviar o recibir propuestas
    |
    v
Cerrar fecha y lugar
    |
    v
Ficha pública
    |
    v
Enviar evidencia
```

### Venue sponsor

``` text
Publicar espacio
    |
    v
Capacidad, zona, equipamiento, modo de apoyo
    |
    v
Ver necesidades de espacio
    |
    v
Enviar o recibir propuestas
```

El modo de apoyo es `free`, `depends` o `rental_only`. En el piloto no
hay precio.

### Local sponsor

``` text
Declarar qué puede aportar
    |
    v
Filtrar oportunidades
    |
    v
Enviar o recibir propuestas
```

### Match

``` text
Propuesta
necesidad + cantidad + fecha
        |
        v
La otra parte acepta
        |
        v
Compromiso de match
        |
        v
Se revelan WhatsApp y teléfono
```

La propuesta puede nacer del organizador o del sponsor. Una cantidad
menor que la pedida deja la necesidad en `partial`.

### Moderador

``` text
Revisar evidencia
    |
    +---- aprobar -> evento completed y caso de éxito
    +---- rechazar
    |
Ocultar evento o perfil reportado
    |
Desafiliar por incumplimiento
```

------------------------------------------------------------------------

# 50. Modelo de dominio inicial

``` text
User
 |
 +---- Profile
 |
 +---- Roles
 |      organizer | venue_sponsor | local_sponsor | moderator
 |
 +---- Registration commitment

Profile
 |
 +---- Event          si es organizer
 |
 +---- Venue          si es venue_sponsor
 |
 +---- Offer          desde cualquiera de los dos lados

Event
 |
 +---- rsvp_url
 |
 +---- Event Need
 |
 +---- Event Media
 |
 +---- Offer
 |
 +---- Match
 |
 +---- Evidence

Venue
 |
 +---- datos estáticos
 |
 +---- calendario derivado de offers y matches

Match
 |
 +---- Event Need
 |
 +---- las dos partes
 |
 +---- Match commitment
 |
 +---- Status
```

Campos que el piloto exige en el evento: nombre, categoría, ciudad
(`pereira` o `dosquebradas`), fecha o rango, asistentes esperados,
descripción, audiencia, qué recibe el sponsor a cambio y `rsvp_url`.

Tipos de necesidad: `venue`, `products`, `food`, `equipment`,
`services`, `diffusion`.

La necesidad guarda lo pedido y lo ya cubierto. La propuesta guarda la
cantidad ofrecida y la fecha. El compromiso de match guarda la copia
aceptada de qué, cuánto y cuándo.

------------------------------------------------------------------------

# 51. Estados

Eventos:

``` text
draft
published
public
completed
cancelled
```

`published` lo ven los sponsors autenticados. `public` exige fecha
concreta y lugar, y es la única versión que puede ir a caché y a SEO.
`completed` exige evidencia aprobada. `cancelled` puede salir de
`published` o de `public`.

Necesidades:

``` text
open
partial
covered
cancelled
```

Propuestas:

``` text
pending
accepted
rejected
cancelled
```

Matches:

``` text
accepted
completed
breached
cancelled
```

Evidencia:

``` text
submitted
approved
rejected
```

Los estados deben tener transiciones explícitas y testeadas. Aceptar
una propuesta es la transición que crea el match, guarda el compromiso
y habilita la lectura de los contactos directos para esas dos partes.

------------------------------------------------------------------------

# 52. SEO

Nuxt + SSR se utilizará para páginas públicas.

URLs deseables:

``` text
/events
/agenda
/events/[slug]

/venues
/venues/[slug]

/sponsors
/sponsors/[slug]

/cases/[slug]

/categories/[slug]
```

`/events` es el listado de eventos que buscan apoyo. `/agenda` y
`/events/[slug]` responden cuando el evento está en `public`. El
caso de éxito vive en `/cases/[slug]` y aparece después de aprobar la
evidencia. Pereira y Dosquebradas son un filtro, no dos sitios.

Cada página pública debería tener:

-   title.
-   description.
-   canonical.
-   Open Graph.
-   Twitter/X metadata.
-   structured data cuando corresponda.

------------------------------------------------------------------------

# 53. Performance

Objetivos iniciales:

-   páginas públicas cacheables.
-   imágenes optimizadas.
-   consultas PostgreSQL indexadas.
-   payloads pequeños.
-   lazy loading cuando corresponda.
-   evitar JS innecesario.
-   SSR donde aporte valor.
-   client-side interactivity solo donde sea necesaria.

No optimizar prematuramente.

Medir primero.

------------------------------------------------------------------------

# 54. Estrategia de búsqueda

Inicialmente:

``` text
PostgreSQL
+
índices
+
ILIKE / full-text search
```

No introducir Elasticsearch/Meilisearch inmediatamente.

Cuando el volumen o la calidad de búsqueda lo justifique:

``` text
PostgreSQL FTS
        ↓
evaluación
        ↓
servicio especializado
```

------------------------------------------------------------------------

# 55. Matching

En el piloto el match no lo calcula un operador ni un modelo. Lo cierra
la aceptación de una propuesta.

Las sugerencias que ven los sponsors sí son reglas fijas:

``` text
categoría
+
tipo de necesidad
+
asistentes esperados
+
ciudad
+
fecha o rango
```

Esas reglas ordenan y filtran. No aceptan nada por su cuenta.

Para una necesidad de espacio, la capacidad del venue tiene que alcanzar
a los asistentes esperados. El modo de apoyo (`free`, `depends`,
`rental_only`) se muestra; no descarta solo.

La IA queda fuera de este flujo. Cuando existan matches reales se puede
evaluar ranking, scoring u otros métodos. El producto tiene que seguir
funcionando sin ellos.

------------------------------------------------------------------------

# 56. IA futura

La IA puede incorporarse posteriormente para:

-   sugerir venues.
-   sugerir sponsors.
-   generar propuestas de sponsorship.
-   clasificar eventos.
-   extraer necesidades.
-   redactar emails.
-   resumir oportunidades.
-   recomendar activaciones.

Pero:

> La IA no debe ser una dependencia de la arquitectura base.

El producto debe funcionar sin IA.

------------------------------------------------------------------------

# 57. MCP de la aplicación

En el futuro podemos crear un MCP propio para la plataforma.

Ejemplo:

``` text
create_event
search_venues
search_sponsors
list_open_needs
send_offer
get_event
```

Esto permitiría que otros agentes interactúen con la plataforma.

No construirlo ahora.

Primero validar el marketplace.

------------------------------------------------------------------------

# 58. Roadmap técnico

## Fase 0 --- Setup

``` text
[ ] GitHub repo
[ ] Nuxt 4
[ ] Cloudflare Workers
[ ] Supabase
[ ] Bun
[ ] Biome
[ ] Cursor rules
[ ] Supabase Agent Skills
[ ] Supabase MCP
[ ] Cloudflare Skills
[ ] Playwright
```

------------------------------------------------------------------------

## Fase 1 --- Foundation

``` text
[ ] Layout en español
[ ] Design system
[ ] Auth
[ ] Aviso de privacidad
[ ] Compromiso de registro
[ ] Profiles y roles
[ ] Contactos públicos y directos
[ ] RLS
[ ] Migrations
[ ] CI
```

------------------------------------------------------------------------

## Fase 2 --- Events

``` text
[ ] Create event
[ ] Necesidades y enlace de inscripción
[ ] Fecha o rango
[ ] Edit event
[ ] Publish para sponsors
[ ] Ficha pública al cerrar fecha y lugar
```

------------------------------------------------------------------------

## Fase 3 --- Venues

``` text
[ ] Venue profile
[ ] Capacity
[ ] Equipment
[ ] Zona
[ ] Modo de apoyo
[ ] Calendario derivado
```

------------------------------------------------------------------------

## Fase 4 --- Propuestas

``` text
[ ] Perfil de local sponsor
[ ] Filtros y sugerencias
[ ] Propuesta en los dos sentidos
[ ] Aceptación
[ ] Compromiso de match
[ ] Revelado de contactos directos
[ ] Cobertura parcial
```

------------------------------------------------------------------------

## Fase 5 --- Evidencia y piloto

``` text
[ ] Envío de evidencia
[ ] Cola del moderador
[ ] Aprobar, ocultar y desafiliar
[ ] Caso de éxito
[ ] Medir eventos con evidencia aprobada
```

------------------------------------------------------------------------

# 59. Métricas técnicas

No medir solamente:

``` text
users
pageviews
```

También:

``` text
events_created
events_published
events_made_public
events_completed

needs_opened
needs_partial
needs_covered

venues_registered
sponsors_registered

offers_sent
offers_accepted

evidence_submitted
evidence_approved
```

La métrica principal del MVP:

> **Eventos con evidencia aprobada.**

------------------------------------------------------------------------

# 60. Checklist antes de producción

## Infraestructura

``` text
[ ] Custom domain
[ ] Cloudflare DNS
[ ] Workers production
[ ] Supabase production
[ ] Secrets
[ ] Backups
[ ] Monitoring
```

## Seguridad

``` text
[ ] RLS audit
[ ] Auth flows
[ ] Aviso de privacidad
[ ] Contactos directos solo tras el match aceptado
[ ] Rol moderator no autoasignable
[ ] Upload restrictions
[ ] Rate limiting
[ ] Permisos del moderador
[ ] Secret audit
```

## Calidad

``` text
[ ] Unit tests
[ ] E2E tests
[ ] Typecheck
[ ] Biome
[ ] Build
[ ] Accessibility review
[ ] Mobile review
```

## SEO

``` text
[ ] sitemap
[ ] robots.txt
[ ] metadata
[ ] canonical
[ ] OG images
[ ] structured data
```

------------------------------------------------------------------------

# 61. Decisiones arquitectónicas

  Decisión            Elección
  ------------------- -------------------------------
  Framework           Nuxt 4
  UI                  Vue 3
  Language            TypeScript
  Backend             Nitro
  Runtime             Cloudflare Workers
  Edge/CDN            Cloudflare
  DB                  PostgreSQL
  Backend platform    Supabase
  Auth                Supabase Auth
  Authorization       PostgreSQL RLS
  Storage             Supabase Storage inicialmente
  Validation          Zod
  UI                  Tailwind + Nuxt UI
  Lint/format         Biome
  Unit testing        Vitest
  E2E                 Playwright
  Email               Resend
  Analytics           PostHog
  Error tracking      Sentry, posteriormente
  CI/CD               GitHub Actions
  Package manager     Bun
  IDE/Agent           Cursor
  DB Agent Skill      Supabase Agent Skills
  Infra Agent Skill   Cloudflare Skills
  DB MCP              Supabase MCP
  Infra MCP           Cloudflare MCP
  SCM MCP             GitHub MCP
  Browser MCP         Playwright MCP
  Analytics MCP       PostHog MCP

------------------------------------------------------------------------

# 62. Principio final

La arquitectura debe optimizar para:

``` text
VALIDAR
    ↓
APRENDER
    ↓
FACTURAR
    ↓
ESCALAR
```

No:

``` text
ARQUITECTAR
    ↓
SOBREINGENIERÍA
    ↓
ESPERAR USUARIOS
```

El stack **Nuxt + Cloudflare + Supabase** permite mantener el MVP
sencillo, económico y suficientemente robusto para crecer.

La prioridad técnica debe ser construir una infraestructura que permita
comprobar rápidamente si el marketplace realmente consigue:

``` text
Organizador
      |
Venue sponsor / Local sponsor
      |
Propuesta aceptada
      |
Evento con fecha y lugar
      |
Evidencia aprobada
```

Cuando ese flujo tenga tracción, la arquitectura puede evolucionar con
datos reales en lugar de anticipar problemas hipotéticos.

------------------------------------------------------------------------

## Fuentes oficiales principales

-   Nuxt: https://nuxt.com/docs
-   Nuxt deployment: https://nuxt.com/deploy
-   Cloudflare + Nuxt:
    https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/nuxt/
-   Cloudflare Workers limits:
    https://developers.cloudflare.com/workers/platform/limits/
-   Supabase + Nuxt:
    https://supabase.com/docs/guides/getting-started/quickstarts/nuxtjs
-   Supabase SSR/Auth: https://supabase.com/docs/guides/auth/server-side
-   Supabase pricing/billing: https://supabase.com/pricing
-   Supabase Agent Skills:
    https://supabase.com/docs/guides/ai-tools/ai-skills
-   Supabase MCP: https://supabase.com/docs/guides/ai-tools/mcp
-   Cloudflare Skills: https://github.com/cloudflare/skills
-   Cloudflare MCP:
    https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/
-   GitHub MCP: https://github.com/github/github-mcp-server
-   Playwright MCP: https://github.com/microsoft/playwright-mcp
-   Biome: https://biomejs.dev/guides/getting-started/
-   Biome CI: https://biomejs.dev/guides/integrate-in-ci/
-   PostHog MCP: https://posthog.com/docs/model-context-protocol/cursor
-   PostHog Product Analytics: https://posthog.com/product-analytics
-   Resend: https://resend.com/
