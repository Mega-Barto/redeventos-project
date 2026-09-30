# Modelo Canvas de negocio — Redeventos

Business Model Canvas del piloto **Redeventos**, alineado con [`idea.md`](../product/idea.md) y [`stack.md`](../architecture/stack.md).

- **Diagrama editable:** [`redeventos-modelo-canvas.drawio`](../diagrams/redeventos-modelo-canvas.drawio) (abrir en [draw.io](https://app.diagrams.net/) o extensión Draw.io en VS Code/Cursor)
- **Post-piloto (costos e ingresos, hipótesis):** [`modelo-canvas-futuro.md`](modelo-canvas-futuro.md), [`futuro-ingresos.md`](futuro-ingresos.md) y [`redeventos-modelo-canvas-futuro.drawio`](../diagrams/redeventos-modelo-canvas-futuro.drawio)
- **Diagrama técnico / arquitectura:** [`canvas-model.md`](../architecture/canvas-model.md) y [`redeventos-canvas.excalidraw`](../diagrams/redeventos-canvas.excalidraw)

Última actualización: septiembre de 2026.

---

## Socios clave

¿Quién te puede ayudar?

- Organizadores de eventos y líderes de comunidades en Pereira y Dosquebradas
- Venues (espacios culturales, educativos, coworkings)
- Negocios locales dispuestos a patrocinar en especie
- Referentes del ecosistema cultural (inspiración / posibles aliados, ej. Plan C Pereira)
- Proveedores de infraestructura: Cloudflare, Supabase, Resend
- Moderador de la comunidad (evidencias, reportes, desafiliaciones)

---

## Actividades clave

¿Qué harás para cumplir la propuesta de valor?

- Onboarding con compromiso de registro y aviso de privacidad
- Publicación de eventos, necesidades (`event_needs`) y aportes (`offers`)
- Propuestas bidireccionales, aceptación y compromiso de match
- Descubrimiento para sponsors: filtros y sugerencias por reglas fijas
- Ficha pública del evento (fecha concreta + lugar) y enlace de inscripción externo
- Evidencia de realización y casos de éxito tras aprobación del moderador

---

## Recursos clave

¿Qué recursos necesitas para la propuesta de valor?

- Aplicación web full-stack: Nuxt 4 + Nitro en Cloudflare Workers
- Datos y auth: Supabase (PostgreSQL, Auth, Storage, RLS)
- Tipos y validación: TypeScript, Zod, tipos generados desde la BD
- Marca de trabajo **Redeventos** y confianza en la red local
- Tiempo del responsable del piloto (persona natural, tratamiento de datos)
- Reglas de comunidad, textos de compromiso y moderación ligera

---

## Propuesta de valor

¿Qué haces diferente de la competencia?

| Para | Valor |
| --- | --- |
| **Organizador** | Un solo lugar para declarar necesidades y cerrar espacio/apoyo con sponsors, sin depender de un operador |
| **Venue / local sponsor** | Oportunidades filtradas por categoría, necesidad, ciudad y fecha; visibilidad y relación con comunidades |
| **Ecosistema** | Más eventos realizados en ciudades intermedias, con registro de compromisos y evidencia |

Diferencia frente a una agenda: Redeventos responde **cómo** el evento consigue espacio y apoyo para existir, no solo **qué** eventos hay.

> La red hace posible el evento. La plataforma registra la necesidad, la propuesta y el compromiso. Las personas cierran el match solas.

---

## Relación con clientes

¿Cómo interactúas con los clientes?

- **Automatizada / self-service:** publicar, proponer, aceptar, ver oportunidades
- **Compromisos explícitos:** registro (reglas de comunidad) y match (qué, cuánto, cuándo)
- **Contacto escalonado:** correo, Instagram y web en perfil; WhatsApp y teléfono solo tras match aceptado
- **Sin chat in-app:** coordinación directa entre las partes después del match
- **Moderación:** evidencias, contenido reportado, desafiliación por incumplimiento

---

## Canales

¿Cómo llegas a los clientes?

- Sitio web (landing, registro, dashboards por rol)
- Listado de oportunidades para sponsors autenticados (antes de ficha pública)
- Fichas públicas: evento, venue, sponsor
- Enlace externo de RSVP (Luma, formulario, etc.) — la inscripción no vive en Redeventos
- Relaciones locales, comunidades existentes y boca a boca en el ecosistema

---

## Segmento de clientes

¿A quién ayudarás?

| Segmento | Necesidad principal |
| --- | --- |
| **Organizador** | Espacio, productos, alimentación, equipos, servicios, difusión |
| **Venue sponsor** | Eventos alineados con su espacio, ocupación, visibilidad |
| **Local sponsor** | Visibilidad, clientes, activación con comunidades |
| **Asistente** | Descubrir eventos con fecha y lugar; inscribirse fuera de la plataforma |

Territorio del piloto: **Pereira y Dosquebradas**. Eventos gratuitos o de bajo costo en categorías definidas en `idea.md`.

El **moderador** no es un segmento de cliente; es un rol de gobernanza.

---

## Estructura de costos

¿Cuánto te costará?

| Ítem | Notas |
| --- | --- |
| Cloudflare | Workers, DNS, CDN — validación en tier bajo |
| Supabase | PostgreSQL, Auth, Storage — escala con uso |
| Resend | Correo transaccional |
| PostHog / Sentry | Analítica y errores (cuando aplique) |
| Dominio y herramientas | GitHub, CI |
| Operación | Tiempo humano: desarrollo, soporte, moderación |

Principio de `stack.md`: no añadir servicios mientras Nuxt + Cloudflare + Supabase resuelvan el problema.

---

## Fuente de ingresos

¿Cuántos ingresos tendrás?

**En el piloto: ninguno.** Decisiones cerradas en `idea.md`:

- Sin montos en aportes, sin pagos, sin comisión
- Métrica de éxito: **eventos facilitados** (realizados con evidencia aprobada)

Posibles líneas futuras (exploración post-piloto, no comprometidas): ver [`modelo-canvas-futuro.md`](modelo-canvas-futuro.md). Orden en `idea.md` §20: newsletter → dinero + comisión → alquiler de venue → servicios de producción → premium → otras ciudades.

---

## Cómo editar el diagrama

1. Abrir [`redeventos-modelo-canvas.drawio`](../diagrams/redeventos-modelo-canvas.drawio) en draw.io.
2. Ajustar textos por bloque según validen el mercado.
3. Guardar el archivo en el repo junto con este `.md`.
