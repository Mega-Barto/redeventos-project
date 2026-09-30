# Ingresos futuros — decisiones e hipótesis

Registro de cómo se ataca el $0 del piloto **después** de validar eventos facilitados, y de las líneas que se descartan.

No cambia el producto actual. En `idea.md` el piloto no tiene montos, pagos ni comisión. Este archivo no autoriza cobrar.

- **Canvas futuro:** [`modelo-canvas-futuro.md`](modelo-canvas-futuro.md) y [`redeventos-modelo-canvas-futuro.drawio`](../diagrams/redeventos-modelo-canvas-futuro.drawio)
- **Líneas documentadas:** [`idea.md`](../product/idea.md) §20
- **Piloto:** [`idea.md`](../product/idea.md) §5, §14, §17

Última actualización: septiembre de 2026.

---

## Principio

> Entrar sin costo. Cobrar cuando exista una transacción.

El $0 del piloto no es un fallo a tapar con una tarifa improvisada. Es la fase de validación: la métrica es eventos realizados con evidencia aprobada. El cobro entra cuando esa métrica ya es cierta y hay dinero que pasa por un patrocinio, un alquiler o un servicio.

---

## Comisión por asistentes (a partir de 100)

**Estado: descartada** como factura al organizador. **No** se usa para cubrir el $0 del piloto.

### Qué se propuso

Una comisión (o cuota) cuando el evento alcanza 100 asistentes o más, para crear una fuente de ingreso que el piloto no tiene.

### Por qué no

| Criterio | Problema |
| --- | --- |
| Quién pagaría | El organizador de un evento gratuito o de bajo costo. Es el lado que Redeventos existe para ayudar. Cobrarle cuando el meetup llega a 120 personas castiga el resultado que el producto quiere. |
| Qué es la tarifa | No hay transacción. Es un impuesto al éxito (headcount), no un take rate sobre dinero que ya se mueve. Rompe el principio de cobro. |
| Cómo se mediría | La lista de asistentes vive **fuera** (`idea.md` §5 y §14). La asistencia entra por evidencia que declara el organizador y aprueba el moderador. Una tarifa desde 100 invita a reportar 99, no enviar evidencia o partir el evento. Eso rompe la métrica (`completed`) y convierte al moderador en auditor de taquilla. |
| Alcance | El piloto deja fuera eventos masivos. En Pereira y Dosquebradas, 100 asistentes ya es grande para el tipo de comunidad del piloto. La línea se dispararía poco, o justo en casos que el alcance actual no quiere operar. |
| El $0 del piloto | Sin RSVP propio, sin pasarela y sin dinero en el match, no hay de dónde retener la comisión. No ataca el $0; solo añade un cobro que el producto no puede ejecutar. |

### Implicaciones si se hubiera adoptado

- **Actores:** el organizador pasaría a cliente de pago por crecer; el incentivo sería esconder asistencia.
- **Métrica:** conflicto directo con eventos facilitados (evidencia honesta).
- **Ingresos:** no resolubles en el piloto; frágiles después sin RSVP de primer partido.
- **Documentación:** exigiría cambiar `idea.md` (RSVP, eventos que entran, dinero) y dejar de ser red de producción para parecer ticketera.

No reabrir esta línea salvo que cambien esas premisas en `idea.md`.

---

## Variante viable: asistencia como precio para el sponsor

**Estado: hipótesis nueva**, no está en `idea.md` §20. Queda ligada al paso 2 (patrocinio en efectivo), no como línea suelta ni como cobro al organizador.

Cuando un local sponsor o una marca paga un aporte en dinero, un evento de **100 o más asistentes** (esperados o evidenciados) vale más como activación. Ahí sí puede existir un piso o un paquete, por ejemplo «activación en evento de 100+», **pagado por el sponsor**.

Reglas:

- El organizador no paga por llegar a 100 personas.
- El umbral sirve para cotizar visibilidad, no para facturar headcount.
- La medición sigue siendo imperfecta mientras el RSVP viva fuera; el paquete se cotiza sobre asistencia esperada al cerrar el patrocinio, no sobre un conteo punitivo post-evento.
- No se abre en el piloto. No sustituye la comisión sobre el efectivo del patrocinio: es un modificador de precio de esa transacción.

Esto respeta: entrar sin costo; cobrar cuando hay transacción. Quien recibe audiencia paga; quien produce el evento gratis no.

---

## Otra hipótesis distinta: comisión sobre entradas

Si más adelante hay RSVP propio y **entradas de pago**, aparece otra línea: take rate sobre el ticket (modelo tipo ticketera).

Eso **no** es lo mismo que una cuota por asistente en eventos gratuitos. Exigiría producto que hoy está fuera (`idea.md` §17): lista de asistentes, cuentas de asistente, QR/check-in, pasarela. No se presenta como decisión ni como parche del $0 del piloto.

---

## Cómo sí se ataca el $0 (post-piloto)

Orden de `idea.md` §20; detalle de tarifas en [`modelo-canvas-futuro.md`](modelo-canvas-futuro.md).

1. Newsletter hacia sponsors (canal; después slot destacado)
2. Aportes en dinero y comisión sobre el efectivo del patrocinio — aquí puede vivir el paquete 100+
3. Precio y calendario para venues que alquilen
4. Servicios de producción con comisión
5. Suscripción premium
6. Otras ciudades

La asistencia, cuando exista, es **insumo de precio** para el paso 2. No es una cuenta al organizador.

---

## Cuándo editar este archivo

| Cambio | Acción |
| --- | --- |
| Reabrir comisión por asistente al organizador | Solo si `idea.md` cambia RSVP, alcance de eventos y regla de dinero |
| Adoptar el paquete sponsor 100+ | Marcarlo aquí como hipótesis aceptada y reflejarlo en el canvas futuro; no hace falta tocarlo en el piloto |
| Comisión sobre tickets pagos | Hipótesis nueva de ticketera; actualizar `idea.md` §17/§20 antes de venderla |
