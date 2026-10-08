# Modelo canvas — Redeventos (piloto MVP)

Documento de referencia visual del proyecto **Redeventos**: marketplace de tres lados para conectar organizadores, venue sponsors y local sponsors en Pereira y Dosquebradas.

- Especificación de producto: [`idea.md`](../product/idea.md)
- Stack y arquitectura técnica: [`stack.md`](../architecture/stack.md)
- Diagrama editable (local): [`redeventos-canvas.excalidraw`](../diagrams/redeventos-canvas.excalidraw)
- Diagrama en línea: [Excalidraw — Redeventos canvas](https://excalidraw.com/#json=TmbrhuyoGQNsIMETgDQzu,Av7x_Y6gNs9g2s385qiHBQ)

Última actualización: septiembre de 2026.

---

## Qué contiene el canvas

El lienzo Excalidraw agrupa cuatro vistas en un solo diagrama:

| Zona | Contenido |
| --- | --- |
| **Infraestructura** | Internet → Cloudflare (DNS, CDN, cache, WAF) → Nuxt 4 + Nitro en Workers → Supabase, Resend, PostHog/Sentry/CI |
| **Dominio y actores** | Organizador, venue sponsor, local sponsor, evento central, asistente (ficha pública), moderador (evidencia) |
| **Modelo de datos** | Tablas PostgreSQL del piloto y relaciones principales, con nota de RLS |
| **Flujos de estado** | Ciclo de vida del evento, flujo de match/propuesta, estados de necesidad, bloques de estructura Nuxt |

---

## 1. Infraestructura

Regla de arquitectura (desde `stack.md`):

> No añadir otro servicio mientras **Nuxt + Cloudflare + Supabase** resuelvan correctamente el problema.

```text
Internet
   |
   v
Cloudflare (DNS / CDN / Cache / WAF)
   |
   v
Nuxt 4 + Nitro (Cloudflare Workers)
   |
   +---> Supabase (PostgreSQL, Auth, Storage, RLS)
   +---> Resend (email transaccional)
   +---> PostHog, Sentry, GitHub Actions (observabilidad y CI)
```

La autorización no depende solo del frontend: las peticiones pasan por la Data API de Supabase y **RLS** en PostgreSQL.

---

## 2. Dominio y actores

| Actor | Rol en el piloto |
| --- | --- |
| **Organizador** | Crea el evento, necesidades y enlace de inscripción externo |
| **Venue sponsor** | Espacio e infraestructura; propone o recibe propuestas |
| **Local sponsor** | Productos, alimentación, equipos, servicios o difusión |
| **Asistente** | Sin cuenta; descubre la ficha pública e inscribe fuera de la plataforma |
| **Moderador** | Evidencias, contenido reportado, desafiliaciones (no aprueba matches ni publicaciones) |

Una misma cuenta puede ser organizador, venue sponsor y local sponsor (`profile_roles`).

Frase guía del producto:

> La red hace posible el evento. La plataforma registra la necesidad, la propuesta y el compromiso. Las personas cierran el match solas.

---

## 3. Modelo de datos (PostgreSQL)

Entidades iniciales del piloto:

| Tabla | Propósito |
| --- | --- |
| `profiles` | Persona y datos de contacto públicos |
| `profile_roles` | organizer, venue_sponsor, local_sponsor, moderator |
| `registration_commitments` | Compromiso de registro |
| `events` | Evento; incluye `rsvp_url` (inscripción externa) |
| `event_needs` | Necesidades por evento (espacio, productos, etc.) |
| `venues` | Ficha estática del espacio |
| `offers` | Aportes publicados por sponsors |
| `matches` | Propuesta aceptada entre necesidad y aporte |
| `match_commitments` | Compromiso concreto del match |
| `evidence` | Realización del evento (moderación) |
| `event_media` | Imágenes y medios del evento |

**Fuera del piloto:** `organizations`, `bookings`, `messages`, `event_attendees`, `venue_availability`.

Migraciones previstas (`stack.md`):

```text
0001_profiles_and_commitments.sql
0002_events_and_needs.sql
0003_venues.sql
0004_offers_and_matches.sql
0005_evidence.sql
```

---

## 4. Estados del evento

```text
draft → published → public → completed
              |         |
              +----+----+
                   v
               cancelled
```

| Estado | Significado |
| --- | --- |
| `draft` | Borrador del organizador |
| `published` | Listado público en `/events` (busca apoyo); aún sin ficha en agenda |
| `public` | Fecha concreta y lugar; ficha abierta a cualquiera |
| `completed` | Evidencia aprobada por moderador |
| `cancelled` | Desde `published` o `public` |

---

## 5. Necesidades y match

**Necesidad:** `open` → `partial` → `covered` (o `cancelled`). Puede cubrirse a medias.

**Match (bidireccional):**

```text
Propuesta (cantidad + fecha + necesidad)
        |
        v
   Pendiente ----> Rechazada
        |
        v
    Aceptada
        |
        v
Compromiso de match → WhatsApp y teléfono visibles para ambas partes
```

Contacto:

| Momento | Visible |
| --- | --- |
| Perfil y oportunidad | Correo, Instagram, web |
| Tras aceptar match | WhatsApp y teléfono |

---

## 6. Estructura de código (MVP)

Propuesta en `stack.md`:

```text
event-platform/
├── app/          # pages, components, composables, layouts
├── server/api/   # events, needs, venues, offers, matches, evidence
├── shared/       # types, constants, schemas (Zod)
├── supabase/     # migrations, seed
└── tests/        # Vitest + Playwright
```

---

## 7. Pantallas del piloto (mapa rápido)

- Landing, registro (privacidad + compromiso de registro)
- Vistas: organizador, venue sponsor, local sponsor, moderador
- Oportunidad del evento (sponsors autenticados)
- Fichas públicas: evento, venue, sponsor
- Caso de éxito (post-evidencia aprobada)

---

## Cómo editar el diagrama

1. Abrir [`redeventos-canvas.excalidraw`](../diagrams/redeventos-canvas.excalidraw) en [excalidraw.com](https://excalidraw.com) (Arrastrar archivo o *Open*).
2. O usar el [enlace compartido](https://excalidraw.com/#json=TmbrhuyoGQNsIMETgDQzu,Av7x_Y6gNs9g2s385qiHBQ).
3. Tras cambios importantes, exportar de nuevo y reemplazar el `.excalidraw` en el repo; actualizar el enlace si se genera uno nuevo.

---

## Métrica del piloto

Eventos **facilitados**: realizados con evidencia aprobada por el moderador.

Señal clave: ¿la plataforma permitió que un evento con espacio y apoyo se realizara?
