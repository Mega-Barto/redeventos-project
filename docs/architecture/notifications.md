# Notificaciones — Redeventos

Correo transaccional del piloto y catálogo de avisos. Alcance de producto: [`idea.md`](../product/idea.md). Stack: [`stack.md`](./stack.md) §19. Flujos de match y evidencia: [`redeventos-flujos.drawio`](../diagrams/redeventos-flujos.drawio) (propuesta aceptada y evidencia → email según preferencias).

------------------------------------------------------------------------

## Canales

| Canal | Piloto | Notas |
| --- | --- | --- |
| **Email (Resend)** | Sí | Canal absoluto del producto y único envío en el piloto |
| **WhatsApp Cloud API** | No | Documentado como post-piloto: plantillas Meta, opt-in y coste. WhatsApp/teléfono en el piloto siguen siendo **contactos revelados tras aceptar el match**, no un canal de la plataforma |
| Web Push, SMS, Telegram, newsletter, inbox in-app | No | Fuera de alcance |

Confirmación de cuenta y magic links: **Supabase Auth**, no Resend de la app.

------------------------------------------------------------------------

## Entrega (`server_after_business_ok`)

Las acciones que disparan correo (enviar propuesta, aceptar, enviar evidencia, revisar evidencia) pasan por **rutas Nitro** con el JWT del usuario. Tras el RPC/write exitoso, Nitro envía el correo **en el mismo request** (síncrono).

- El cliente **no** llama a `/api/notifications/*` (esas rutas no existen).
- Si Resend falla o no hay `RESEND_API_KEY`, el negocio **no se revierte**. Se registra un log estructurado.
- Sin cola, outbox ni `waitUntil` en el piloto.

```text
UI → Nitro (acción) → Supabase RPC/write OK → prefs + plantilla → Resend → respuesta de negocio
```

------------------------------------------------------------------------

## Escenarios

| Id | Clave (`event_key`) | Trigger | Destinatario | Piloto | Default email |
| --- | --- | --- | --- | --- | --- |
| A | `offer_received` | Propuesta enviada | Destinatario | Sí | ON |
| B | `offer_accepted` | Propuesta aceptada | Ambas partes (cuerpo **distinto**: contacto de la contraparte) | Sí | ON |
| C | `offer_rejected` | Propuesta rechazada | Proponente | Después | OFF |
| D | `offer_cancelled` | Propuesta cancelada | Destinatario | Después | OFF |
| E | `evidence_submitted` | Evidencia enviada o reenviada | Todos los moderadores con correo | Sí | ON |
| F | `evidence_reviewed` | Evidencia aprobada o rechazada | Organizador que envió | Sí | ON |
| G | `report_created` | Nuevo reporte | Moderadores | Después | OFF |
| H | `content_hidden` | Contenido ocultado | Dueño | Después | OFF |
| I | `disaffiliated` | Desafiliación | Perfil | Después | OFF |
| J | — | Confirmación / magic link | Usuario | Auth | n/a |
| K | `case_completed` | Caso de éxito | Partes del match | Después | OFF |

**E:** si no hay moderadores con email, no se envía; se deja constancia en log. Destinatarios deduplicados.

**B (privacidad):** el correo de aceptación incluye WhatsApp y teléfono **solo de la otra parte**. Antes de aceptar, A no incluye esos datos.

Cada correo incluye un pie: se pueden cambiar los avisos en `/app/profile`.

------------------------------------------------------------------------

## Preferencias

Tabla `notification_preferences` (`profile_id`, `event_key`, `channel`, `enabled`). Canal `whatsapp` reservado; la UI del piloto solo muestra **email**.

| Lectura al enviar | Sin fila → default de la función TS compartida. Con fila → `enabled` del usuario |
| Seed en UI | Al abrir la sección de avisos en el perfil, upsert de A/B/E/F (email) para que los toggles reflejen estado. Quien nunca abre el perfil sigue recibiendo según defaults |
| Toggles piloto | A, B, E, F. El resto no se muestra o queda como “próximamente” |

------------------------------------------------------------------------

## WhatsApp (post-piloto)

Cuando se implemente: Cloud API + plantillas aprobadas + opt-in explícito. No usar el número revelado post-match como canal de envío masivo. No poner WhatsApp en el sello ni en fichas públicas.

------------------------------------------------------------------------

## Fuera de este diseño

Cola/outbox, newsletter, push, SMS, chat, inbox de avisos, Auth vía Resend, triggers Postgres que envíen correo.
