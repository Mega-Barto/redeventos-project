# Modelo Canvas futuro — costos e ingresos

Propuesta inicial **post-piloto** de Redeventos. No cambia el piloto: en `idea.md` los ingresos siguen en $0 y no hay pagos ni comisión.

- **Diagrama:** [`redeventos-modelo-canvas-futuro.drawio`](../diagrams/redeventos-modelo-canvas-futuro.drawio) (hoja 1: canvas completo; hoja 2: costos e ingresos)
- **Decisiones de ingreso (descartes e hipótesis):** [`futuro-ingresos.md`](futuro-ingresos.md)
- **Piloto (sin monetizar):** [`modelo-canvas.md`](modelo-canvas.md) y [`redeventos-modelo-canvas.drawio`](../diagrams/redeventos-modelo-canvas.drawio)
- **Fuente de las líneas de ingreso:** `idea.md` §20. Los porcentajes y el mix son hipótesis, no tarifas publicadas.

Última actualización: septiembre de 2026.

---

## Contexto

El piloto demuestra que un evento con espacio y apoyo **ocurre** (evidencia aprobada). Cuando eso sea cierto, el modelo de dinero puede abrirse sin convertir Redeventos en ticketera ni en operador de matches.

La frase que ordena el cobro:

> Entrar sin costo. Cobrar cuando exista una transacción.

Quien publica, propone y cierra un aporte **en especie** no paga. La plataforma cobra cuando hay efectivo, alquiler o un servicio de producción contratado a través de ella.

---

## Estructura de costos

Tres capas. La que importa para que el negocio cierre es la del medio.

| Capa | Qué incluye | Cuándo aparece | Peso |
| --- | --- | --- | --- |
| **Plataforma** | Cloudflare Workers/DNS/CDN, Supabase (DB, Auth, Storage), Resend, PostHog/Sentry, dominio, CI | Desde el piloto; escala con uso y ciudades | Bajo |
| **Operación** | Desarrollo, moderación de evidencias y sello, adquisición (organizadores primero), soporte de matches y luego de pagos | Ya existe como tiempo del fundador; se vuelve costo explícito al crecer | **Dominante** |
| **Transacción** | Pasarela (~2,5–4 % + IVA en Colombia), conciliación, disputas, persona jurídica, facturación, habeas data | Solo al abrir aportes en dinero (`idea.md` §20.2) | Variable, ligado al GMV |

**Expansión a otra ciudad** no es un ítem de nube: es onboarding humano (comunidades, venues, locales). Se cubre con el take rate de esa ciudad, no copiando el software.

Orden de magnitud de plataforma (hipótesis, no presupuesto): decenas de USD/mes al salir de tiers free; cientos USD/mes si hay varias ciudades y newsletter con volumen. Ese monto no define si el modelo es viable; el tiempo de red sí.

---

## Fuente de ingresos

Dos familias. El núcleo es marketplace (take rate). Lo demás es apoyo, no el negocio.

### Núcleo — take rate (pasos 2, 3 y 4)

| Paso | Línea | Quién paga | Mecánica propuesta | Hipótesis de tarifa |
| --- | --- | --- | --- | --- |
| 2 | Patrocinio en efectivo | Local sponsor / marca | Comisión sobre el aporte en dinero que **pase por** la plataforma | 8–12 % |
| 3 | Alquiler de venue | Organizador (quien reserva) | Precio + calendario del venue; comisión sobre la reserva | 5–10 % |
| 4 | Servicios de producción | Organizador | Foto, video, sonido, catering y similares; el proveedor es el cuarto lado | 10–15 % |

Las tarifas tienen que quedar por encima de la pasarela. Si el take rate no cubre ~3 % de pasarela + operación, no se abre esa línea.

Los matches en especie **no** se convierten a pesos para cobrar. El piloto ya decidió no poner montos en refrigerios o difusión; el futuro no revierte eso: cobra solo el flujo de dinero real.

### Red — secundarios (pasos 1, 5 y 6)

| Paso | Línea | Rol | Nota |
| --- | --- | --- | --- |
| 1 | Newsletter a sponsors | Primero **canal** (oportunidades). Después, 1–2 slots destacados por edición | No es el ingreso principal |
| 5 | Suscripción premium | Cuota por herramientas extra (stats, multi-evento, calendario avanzado) | Entra **después** de haber transacción, no como SaaS-first |
| 6 | Otras ciudades | Réplica del mismo modelo | No es una línea nueva de ingreso |

Mix hipotético a madurez: **~75 % take rate**, **~15 % premium**, **~10 % visibilidad**.

Comisión por número de asistentes (p. ej. a partir de 100) facturada al organizador: **descartada**. La asistencia puede cotizar un paquete para el sponsor en el paso 2; ver [`futuro-ingresos.md`](futuro-ingresos.md).

---

## Qué sigue gratis (a propósito)

- Publicar evento, espacio o aporte en especie
- Propuestas, match y compromiso
- Ficha pública y descubrimiento del asistente
- Sello **En la red** (afiliación con reglas)
- Nivel **Aliado activo**: se gana con evento `completed`, no se compra

Eso protege la métrica del piloto (eventos facilitados) y la frase rectora: la red hace posible el evento; las personas cierran el match solas.

---

## Orden de apertura

No reordenar sin una razón explícita en `idea.md`:

1. Newsletter hacia sponsors (canal; ingreso opcional después)
2. Aportes en dinero y comisión sobre el efectivo del patrocinio
3. Precio y calendario para venues que alquilen
4. Servicios de producción con comisión
5. Suscripción premium
6. Otras ciudades

Condiciones:

- No abrir el paso 2 sin eventos facilitados de verdad.
- No vender premium como producto principal antes de haber take rate.
- No abrir otra ciudad para “buscar ingresos”: se replica un modelo que ya cobra en la primera.

---

## Implicaciones

- **Actores:** el organizador, el venue que dona y el local en especie siguen sin ser clientes de pago. Aparece cliente de pago cuando hay efectivo, alquiler o servicio. Los proveedores de producción entran como cuarto lado en el paso 4.
- **Métrica:** sigue siendo eventos facilitados; el GMV (dinero que pasa por la plataforma) es métrica de negocio **después**, no sustituye la evidencia.
- **Ingresos:** $0 en el piloto. Esta propuesta no autoriza pagos en el producto actual.
- **Producto:** pasarela, montos, calendario con precio y newsletter siguen **fuera del piloto** (`idea.md` §17 y §20).

---

## Cómo editar

1. Abrir [`redeventos-modelo-canvas-futuro.drawio`](../diagrams/redeventos-modelo-canvas-futuro.drawio).
2. Ajustar tarifas y mix cuando el piloto tenga datos (cuántos venues alquilarían, cuántos sponsors pagarían en efectivo).
3. Si una línea de ingreso nueva no está en `idea.md` §20, etiquetarla como hipótesis nueva aquí y en el diagrama; no presentarla como decisión cerrada.
