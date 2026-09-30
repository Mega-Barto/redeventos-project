---
name: redeventos-business-model
description: Answers product, business model, and go-to-market questions for Redeventos (Pereira/Dosquebradas events marketplace). Use when the user discusses monetization, BMC/canvas, actors, value proposition, pilot scope, metrics, acquisition, sello de la red, or anything that is business/product rather than implementation code.
---

# Redeventos — modelo de negocio

## Fuente de verdad

Antes de proponer reglas de negocio, pricing o alcance, leer (o contrastar con) estos archivos del repo:

| Prioridad | Archivo | Contenido |
| --- | --- | --- |
| 1 | `docs/product/idea.md` | Especificación de producto del piloto; decisiones cerradas |
| 2 | `docs/business/modelo-canvas.md` | Business Model Canvas del piloto |
| 3 | `docs/architecture/stack.md` | Solo para acotar qué la arquitectura debe respetar (no inventar features fuera de `docs/product/idea.md`) |

Diagramas: `docs/diagrams/redeventos-modelo-canvas.drawio`, `docs/architecture/canvas-model.md` (vista técnica / dominio).

Si una idea de negocio contradice `idea.md`, marcarlo explícitamente y ofrecer actualizar el doc — no asumir que el piloto ya incluye pagos, chat, RSVP propio, etc.

## Qué es Redeventos (una frase)

Marketplace de **tres lados** (organizador, venue sponsor, local sponsor) para que eventos gratuitos o de bajo costo en **Pereira y Dosquebradas** consigan **espacio y aportes en especie** mediante propuestas y matches **sin operador en el medio**.

Frase rectora (usar cuando ordene la respuesta):

> La red hace posible el evento. La plataforma registra la necesidad, la propuesta y el compromiso. Las personas cierran el match solas.

## Actores y quién paga

| Actor | Rol en el negocio | ¿Cliente de pago en el piloto? |
| --- | --- | --- |
| Organizador | Publica evento y necesidades; busca espacio/apoyo | No |
| Venue sponsor | Ofrece espacio; recibe propuestas | No |
| Local sponsor | Ofrece productos, alimentación, equipos, servicios o difusión | No |
| Asistente | Descubre ficha pública; inscribe **fuera** de Redeventos | No (sin cuenta) |
| Moderador | Evidencias, reportes, desafiliaciones | No (gobernanza, no matchmaker) |

Una cuenta puede tener varios roles. **Sponsor** y **aliado local** son el mismo tipo de usuario; cambia el aporte.

## Propuesta de valor (resumen)

- **Organizador:** un lugar para declarar necesidades y cerrar compromisos con espacios y aliados.
- **Venue / local sponsor:** oportunidades filtradas; visibilidad y relación con comunidades.
- **Ecosistema:** más eventos realizados con compromisos registrados y evidencia.

**No es** una agenda genérica: responde **cómo** el evento consigue recursos para existir, no solo qué hay que hacer el fin de semana. Referencia cultural: Plan C Pereira (qué hacer) vs Redeventos (cómo producir el evento).

## Reglas de negocio del piloto (no negociables en código sin cambiar `idea.md`)

- Territorio: Pereira y Dosquebradas. Español, COP, `America/Bogota`.
- Aportes: espacio, productos, alimentación, equipos, servicios, difusión — **cantidad o descripción, sin montos en pesos**.
- **Sin pagos, comisión ni retención de dinero** en el piloto.
- Match bidireccional; al aceptar: compromiso de match + revelación de WhatsApp/teléfono.
- Contacto público en perfil: correo, Instagram, web.
- Ficha pública del evento solo con **fecha concreta y lugar**; RSVP siempre en enlace externo.
- Realización: evidencia del organizador → aprobación del moderador → `completed`.
- Moderador **no** aprueba publicaciones ni matches.
- Sello de la red (§12 `idea.md`): venue/local afiliado; niveles En la red / Aliado activo; QR y contacto público; **no** WhatsApp/teléfono en material impreso.

## Métrica y éxito del piloto

**Métrica principal:** eventos **facilitados** (realizados con evidencia aprobada).

Metas declaradas: 10 → 50 → 100 eventos. Pregunta clave: ¿la plataforma permitió que un evento con espacio y apoyo **ocurriera**?

Secundarias: publicados, necesidades cubiertas, propuestas, aceptadas, fichas públicas.

## Ingresos y costos

**Ingresos piloto:** $0. Validación, no monetización.

**Orden exploratorio post-piloto** (`idea.md` §20 — no vender como ya disponible):

1. Newsletter hacia sponsors  
2. Aportes en dinero + comisión sobre efectivo en patrocinio  
3. Precio/calendario para venues que alquilen  
4. Servicios de producción con comisión  
5. Suscripción premium organizadores/venues  
6. Otras ciudades  

Hipótesis futura: **entrar sin costo; cobrar cuando haya transacción**. No proponer comisión o suscripción como parte del MVP salvo que el usuario pida replantear el modelo documentado.

**Costos:** infra (Cloudflare, Supabase, Resend, analítica), dominio/CI, tiempo humano (dev, soporte, moderación). Ver tabla en `docs/business/modelo-canvas.md`.

## Go-to-market (piloto)

Software self-service; **la red inicial se construye en conversación**. Orden: **organizadores primero** (demanda) → venues → locales → matches → eventos → casos de éxito → más organizadores.

Primer mes (objetivos orientativos en `idea.md` §19): ~10 eventos publicados; 10–20 venues; propuestas concretas; 3–5 realizados con evidencia.

Miembros fundadores: reconocimiento early adopter; **no** sustituye compromisos de registro/match.

## Cómo responder al usuario

1. Clasificar la pregunta: **piloto actual** vs **visión/post-piloto** vs **cambio de modelo** (requiere editar `idea.md`).
2. Citar decisiones desde `idea.md` cuando haya conflicto con ideas nuevas (pagos, asistentes con cuenta, chat, etc.).
3. Separar **producto/negocio** de **implementación**: negocio aquí; detalle técnico en `stack.md`.
4. Idioma: español si el usuario escribe en español.
5. Si proponen features de negocio nuevas, indicar impacto en actores, métrica, ingresos futuros y si rompe decisiones cerradas.

### Plantilla breve (opcional)

```markdown
## Contexto
[Piloto / post-piloto / propuesta de cambio]

## Respuesta
[2–4 párrafos alineados con idea.md]

## Implicaciones
- Actores: …
- Métrica: …
- Ingresos (si aplica): …

## Documentación
[Qué sección de idea.md o modelo-canvas.md conviene actualizar, si aplica]
```

## Errores frecuentes a evitar

- Tratar Redeventos como ticketera, RSVP integrado o pasarela de pagos en el piloto.
- Poner al moderador como curador de matches o editor de eventos antes de publicar.
- Mezclar contacto del organizador en el sello del local (sello = venue/local sponsor).
- Generalizar a Colombia o ciudades fuera del piloto sin marcarlo como expansión futura.
- Inventar líneas de ingreso no listadas en §20 sin etiquetarlas como hipótesis nueva.

## Más detalle

Checklist y tablas extendidas: [reference.md](reference.md)
