# Redeventos — referencia rápida de negocio

Complemento de [SKILL.md](SKILL.md). Leer [`docs/product/idea.md`](../../../docs/product/idea.md) completo cuando la decisión sea contractual, legal o de alcance MVP.

## Canvas (9 bloques) — piloto

| Bloque | Redeventos (piloto) |
| --- | --- |
| Segmentos | Organizador, venue sponsor, local sponsor, asistente (sin cuenta) |
| Propuesta de valor | Match de necesidades ↔ aportes; sin operador; evidencia y casos de éxito |
| Canales | Web, oportunidades para sponsors, fichas públicas, RSVP externo, relaciones locales |
| Relación | Self-service, dos compromisos (registro + match), contacto escalonado, moderación ligera |
| Ingresos | Ninguno |
| Recursos | App Nuxt/Supabase, marca Redeventos, reglas de comunidad, tiempo del responsable |
| Actividades | Onboarding, publicación, propuestas, descubrimiento determinista, evidencia |
| Socios | Comunidades, venues, negocios locales, infra SaaS, moderador |
| Costos | Cloud + tiempo operación/dev |

## Flujo de valor

```text
Organizador → necesidades → propuestas ↔ venue/local sponsor
        → match + contacto directo → evento public (fecha + lugar)
        → asistente inscribe fuera → evidencia → completed + caso de éxito
```

## Tipos de necesidad (piloto)

Espacio · Productos · Alimentación · Equipos · Servicios · Difusión

Cobertura parcial permitida por necesidad.

## Fuera del piloto (no vender como producto actual)

Pagos/comisión · RSVP propio · API Luma · chat · entradas/QR/check-in · calendario de precios del venue · newsletter · IA en sugerencias · app móvil · otras ciudades.

## Sello de la red (§12 idea.md)

| Nivel | Criterio |
| --- | --- |
| En la red | Perfil completo, sin desafiliación |
| Aliado activo | ≥1 evento `completed` vinculado al venue o aportes del local |

Kit: badge web + QR a ficha; activación después del flujo core de matches/fichas.

## Pitch corto (copiar con ajustes mínimos)

**Organizador:** Redeventos ayuda a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo. Publicas el evento, dices qué necesitas y espacios y aliados proponen cómo cubrirlo.

**Venue:** Organizadores buscan espacio. Publica el tuyo y recibe propuestas alineadas.

**Local sponsor:** Apoya con especie o difusión; ves oportunidades concretas y envías propuesta a cambio de visibilidad/activación.

## Cuándo editar documentación

| Cambio del usuario | Archivo principal |
| --- | --- |
| Regla de producto / piloto | `docs/product/idea.md` |
| Canvas / narrativa de negocio | `docs/business/modelo-canvas.md` + drawio en `docs/diagrams/` |
| Impacto técnico del alcance | `docs/architecture/stack.md` (sección alcance MVP) |
