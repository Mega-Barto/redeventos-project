# Redeventos

Nombre de trabajo de la plataforma que conecta organizadores, espacios y aliados locales para que un evento en Pereira o Dosquebradas pueda realizarse.

El branding definitivo se decide después. Este documento es la especificación de producto del piloto. La arquitectura técnica vive en [`stack.md`](../architecture/stack.md).

Decisiones cerradas: septiembre de 2026.

------------------------------------------------------------------------

## 1. Problema

En Pereira y otras ciudades intermedias cuesta organizar eventos de tecnología, literatura, cine, música, educación, emprendimiento, cultura, comunidades y networking.

Los organizadores se encuentran con tres dificultades.

### 1.1 Falta de venues

Encontrar un espacio adecuado es difícil cuando el evento es gratuito, tiene bajo presupuesto, espera pocos asistentes, necesita una infraestructura concreta o lo organiza una comunidad pequeña. Hay espacios disponibles y no existe un lugar único donde descubrirlos y proponerles el evento.

### 1.2 Dificultad para conseguir apoyo

Los eventos necesitan espacio, alimentación, equipos, premios, materiales, servicios y difusión. Los organizadores no siempre saben qué negocios locales querrían apoyarlos.

### 1.3 Empresas locales con pocas vías de llegada

Un negocio local puede querer darse a conocer, llegar a una comunidad, conseguir clientes, apoyar una iniciativa, hacer una activación o asociarse con un evento. Muchas veces no tiene un mecanismo simple para encontrar eventos relevantes para su público.

------------------------------------------------------------------------

## 2. Oportunidad

La plataforma conecta a quien tiene un evento con quien tiene un espacio o un aporte.

```text
Organizador
    |
    +---- necesita ----> Venue sponsor
    |
    +---- necesita ----> Local sponsor
    |
    v
  EVENTO
    |
    v
Ficha pública + enlace de inscripción
```

El asistente descubre el evento cuando ya tiene fecha y lugar. La inscripción ocurre fuera de Redeventos, en el enlace que el organizador indicó.

------------------------------------------------------------------------

## 3. Actores

| Actor | Tiene | Busca en el piloto |
| --- | --- | --- |
| Organizador | Evento, comunidad, audiencia | Espacio, productos, alimentación, equipos, servicios, difusión |
| Venue sponsor | Espacio e infraestructura | Eventos, ocupación, visibilidad |
| Local sponsor | Productos, alimentación, equipos, servicios o difusión | Visibilidad, clientes, relación con una comunidad |
| Asistente | Tiempo e interés | Enterarse del evento e inscribirse en el enlace externo |
| Moderador | Autoridad de la comunidad | Evidencias, contenido reportado, desafiliaciones |

Una misma cuenta puede ser organizador, venue sponsor y local sponsor a la vez. Cada rol tiene su propia vista. Sponsor y aliado son el mismo registro: cambia el tipo de aporte, no el tipo de usuario.

El moderador no arma matches ni aprueba publicaciones.

------------------------------------------------------------------------

## 4. Qué es el piloto

Redeventos, en el piloto, es un marketplace de tres lados que funciona sin un operador en el medio.

El organizador publica el evento y sus necesidades. El venue sponsor y el local sponsor publican lo que pueden aportar. Cualquiera de los dos lados envía una propuesta estructurada. La otra parte la acepta y queda un compromiso. El sistema revela entonces los contactos directos para que coordinen.

La frase que ordena el producto:

> La red hace posible el evento. La plataforma registra la necesidad, la propuesta y el compromiso. Las personas cierran el match solas.

------------------------------------------------------------------------

## 5. Decisiones cerradas

| Tema | Regla del piloto |
| --- | --- |
| Nombre | Redeventos |
| Territorio | Pereira y Dosquebradas |
| Idioma, moneda, hora | Español, pesos colombianos, America/Bogota |
| Datos personales | Persona natural, con aviso de privacidad en el registro |
| Cuenta | Una persona, con uno o varios roles |
| Eventos que entran | Gratuitos o de bajo costo, en las categorías de la sección 1 |
| Eventos que quedan fuera | Masivos, fiestas privadas y corporativos cerrados |
| Aportes | Espacio, productos, alimentación, equipos, servicios, difusión |
| Dinero | Queda fuera. No hay montos, pagos ni comisión |
| Fecha | Puede ser un rango hasta que el espacio quede cerrado |
| RSVP | Enlace obligatorio al crear el evento. La lista de asistentes vive fuera |
| Ficha pública / agenda | Solo cuando hay fecha concreta y lugar (`/agenda`, `/events/[slug]`) |
| Visibilidad previa | Listado público en `/events` de eventos `published`/`public` con necesidades abiertas; propuestas y contacto directo siguen tras cuenta de sponsor |
| Match | Propuesta bidireccional con necesidad, cantidad y fecha |
| Cobertura | Varias necesidades abiertas. Cada una con su match. Se puede cubrir a medias |
| Contacto público | Correo, Instagram y web |
| Contacto directo | WhatsApp y teléfono, al aceptar el match |
| Compromiso de registro | Reglas de la comunidad y causales de desafiliación |
| Compromiso de match | El aporte concreto: qué, cuánto y cuándo |
| Realización | El organizador envía evidencia. El moderador la aprueba |
| Venue | Ficha estática. El calendario muestra solo días en negociación o comprometidos |
| Descubrimiento | Filtros y sugerencias deterministas |
| Sello de la red | Venue y local sponsor afiliados; dos niveles; contacto público y QR; sin WhatsApp ni teléfono en material impreso |
| Newsletter | Después del piloto |

------------------------------------------------------------------------

## 6. Diferencia frente a una agenda de eventos

Una agenda responde qué eventos existen. Redeventos responde cómo consiguen espacio y apoyo para poder existir.

```text
Organizador
    |
    v
Necesidades
    |
    +----> Venue sponsor
    |
    +----> Local sponsor
    |
    v
Compromisos
    |
    v
Evento con fecha y lugar
    |
    v
Ficha pública y enlace de inscripción
```

Plan C Pereira es una referencia del ecosistema cultural de la ciudad, una inspiración y un posible aliado. Su pregunta es qué hacer en Pereira. La de Redeventos es cómo producir ese evento.

------------------------------------------------------------------------

## 7. El evento

Campos al crear:

- Nombre
- Categoría
- Ciudad: Pereira o Dosquebradas
- Fecha o rango
- Asistentes esperados
- Descripción
- Descripción de la audiencia
- Qué recibe el sponsor a cambio: logo, mención, stand, redes u otra activación
- Enlace de inscripción
- Necesidades

El enlace de inscripción es obligatorio desde la creación. Puede ser Luma, un formulario u otra página. Redeventos no crea la lista de asistentes, no sincroniza inscripciones y no exige Luma Plus.

La fecha puede guardarse como rango, por ejemplo «segunda semana de octubre». Pasa a ser una fecha concreta cuando el espacio queda cerrado.

Estados del evento:

```text
draft
  |
  v
published --------+
  |               |
  v               |
public -----------+--> cancelled
  |
  v
completed
```

El organizador publica solo. `published` lo ven los sponsors y todavía no tiene ficha pública. `public` exige fecha concreta y lugar, y es la página que puede ver cualquiera. `completed` exige evidencia aprobada. `cancelled` puede salir de `published` o de `public`.

------------------------------------------------------------------------

## 8. Necesidades y aportes

Cada evento puede tener varias necesidades abiertas al mismo tiempo. Cada necesidad tiene su propio match. El evento sigue abierto hasta que todas queden cubiertas o se cancelen.

Tipos de necesidad en el piloto:

- Espacio
- Productos
- Alimentación
- Equipos
- Servicios
- Difusión

Cada necesidad registra qué se pide y en qué cantidad. Un aporte se anota como cantidad o descripción: «el auditorio», «100 refrigerios», «una publicación». El piloto no convierte esos aportes a pesos.

Una necesidad puede cubrirse a medias. Si se pidieron 100 refrigerios y una propuesta aceptada cubre 40, la necesidad sigue abierta por el resto.

Estados de una necesidad:

```text
open -> partial -> covered
  |        |
  +--------+----> cancelled
```

Para mostrarle una oportunidad a un sponsor hacen falta el nombre del evento, la categoría, la fecha o el rango, los asistentes esperados, la audiencia, la necesidad exacta, lo que el sponsor recibe a cambio y el nombre del organizador. El WhatsApp y el teléfono no aparecen en esa ficha.

------------------------------------------------------------------------

## 9. El match

La conexión es bidireccional.

- El organizador elige un venue sponsor o un local sponsor y propone cubrir una necesidad, con cantidad y fecha.
- El venue sponsor o el local sponsor elige una necesidad publicada y propone cubrirla, con cantidad y fecha.

La otra parte acepta o rechaza. Al aceptar, las dos partes asumen el compromiso de match y se revelan WhatsApp y teléfono.

```text
Propuesta
cantidad + fecha + necesidad
        |
        v
Pendiente
        |
        +----> Rechazada
        |
        v
Aceptada
        |
        v
Compromiso de match
        |
        v
Contactos directos visibles para las dos partes
```

No hay un operador que presente a las partes ni que confirme el match. No hay chat dentro del producto: después del match, la coordinación sigue por los contactos directos.

------------------------------------------------------------------------

## 10. Contacto y compromisos

Hay dos compromisos distintos.

### Compromiso de registro

Se acepta al crear la cuenta, antes de publicar un evento, un espacio o un aporte. Contiene las reglas de la comunidad y las causales de desafiliación.

### Compromiso de match

Se acepta al cerrar una propuesta. Contiene el aporte concreto de esa propuesta: qué, cuánto y cuándo. Incumplir ese compromiso es causal para que el moderador desafilie a la parte que falló.

### Contacto

| Momento | Qué se ve |
| --- | --- |
| En el perfil y en la oportunidad | Correo, Instagram y web |
| Al aceptar el match | WhatsApp y teléfono de las dos partes |

------------------------------------------------------------------------

## 11. Venue

La ficha del espacio, en el piloto, es estática:

- Nombre
- Zona
- Capacidad
- Equipamiento
- Modo de apoyo: apoya gratis, depende del evento, o solo alquila

El calendario público no se mantiene a mano. Muestra únicamente los días que ya tienen una propuesta en negociación o un match comprometido. Los demás días se entienden libres. El precio y un calendario de disponibilidad editado por el venue entran cuando un espacio cobre de verdad.

------------------------------------------------------------------------

## 12. Sello de la red

Cada venue sponsor y cada local sponsor afiliado puede mostrar un **sello de Redeventos** que lo reconoce como parte de la red. El sello refuerza confianza en el local físico, enlaza con la ficha pública en la web y se alinea con la desafiliación: quien el moderador desafilie deja de poder usarlo.

La ficha pública del evento sigue siendo lo decisivo para el asistente (fecha, lugar, inscripción externa). El sello del local es complemento: señala que el espacio o el aliado pertenece a una red con reglas y compromisos, no sustituye el anuncio del evento.

### 12.1 Qué identifica el sello

El sello identifica al **venue sponsor** o al **local sponsor**, no mezcla contactos del organizador. Cada evento tiene su organizador; el local es estable. En material impreso o digital del negocio va la identidad del aliado y la marca Redeventos, no el teléfono de quien organice un evento concreto ese mes.

### 12.2 Qué datos lleva

| Elemento | Regla |
| --- | --- |
| Nombre comercial y ciudad | Sí |
| Correo, Instagram y web del perfil | Sí, son contacto público |
| QR a la ficha pública (`/venues/[slug]` o equivalente del sponsor) | Sí |
| Texto de pertenencia a Redeventos | Sí |
| WhatsApp y teléfono | No en el sello. Siguen revelándose solo al aceptar un match |
| Contacto del organizador | No en el sello del local |

### 12.3 Niveles

Dos niveles evitan que el sello pierda valor si cualquier registro lo recibe igual:

| Nivel | Criterio (piloto) | Mensaje orientativo |
| --- | --- | --- |
| **En la red** | Perfil completo, sin desafiliación | Parte de Redeventos |
| **Aliado activo** | Al menos un evento `completed` (evidencia aprobada) vinculado a ese venue o a aportes de ese local sponsor | Ha facilitado eventos en la red |

El nivel **Aliado activo** enlaza con la métrica del piloto: eventos facilitados con evidencia aprobada.

### 12.4 Formato y verificación

- **En la web:** badge visible en la ficha pública del venue y del sponsor, siempre actualizado según afiliación y nivel.
- **Fuera de la web:** PDF o sticker descargable con QR a la URL oficial del perfil. Un PNG suelto se copia con facilidad; el QR apunta al perfil vivo.
- **Validez:** mientras la cuenta no esté desafiliada. Opcional en letra pequeña: válido mientras figure en Redeventos.

### 12.5 Momento en el piloto

Matches, fichas y evidencia van primero. El kit de sello (badge digital + QR descargable) entra como **activación de red** cuando haya un grupo inicial de perfiles de venues y locales listos — por ejemplo, tras tener varios espacios publicados — no como bloqueante del MVP de propuestas y compromisos.

------------------------------------------------------------------------

## 13. Descubrimiento

Dentro de la plataforma, un sponsor encuentra oportunidades con filtros y con sugerencias construidas con reglas fijas: categoría, tipo de necesidad, asistentes esperados, ciudad y fecha o rango.

Esas sugerencias no usan un modelo de inteligencia artificial. El newsletter queda para después del piloto.

------------------------------------------------------------------------

## 14. RSVP y ficha pública

La ficha pública de un evento se publica cuando hay fecha concreta y lugar. Hasta ese momento el evento vive dentro de la plataforma, a la vista de los sponsors.

La ficha pública enlaza la inscripción. Redeventos no pide nombre ni WhatsApp del asistente y no abre una cuenta para él.

El caso de éxito es otra página. Se publica después de que el moderador aprueba la evidencia. Cuenta qué evento ocurrió, qué espacio lo recibió, qué aportes lo hicieron posible y cuántas personas asistieron, según la evidencia.

------------------------------------------------------------------------

## 15. Evidencia y moderación

El organizador marca el evento como realizado y adjunta la evidencia. Esa evidencia incluye, como mínimo, la asistencia, el venue y los aportes cumplidos.

El moderador puede:

- Aprobar o rechazar la evidencia.
- Ocultar un evento o un perfil reportado.
- Desafiliar a quien incumple el compromiso de registro o el de match.

El moderador no aprueba eventos antes de publicarlos y no aprueba matches.

El evento pasa a `completed` cuando la evidencia queda aprobada.

------------------------------------------------------------------------

## 16. Pantallas del piloto

- Landing
- Registro, con aviso de privacidad y compromiso de registro
- Vista del organizador
- Vista del venue sponsor
- Vista del local sponsor
- Vista del moderador
- Oportunidad del evento, visible para sponsors
- Ficha pública del evento, con fecha y lugar
- Ficha pública del venue, con badge de sello de la red
- Ficha pública del sponsor, con badge de sello de la red
- Descarga de kit de sello (QR + material para local), cuando aplique el nivel
- Caso de éxito

------------------------------------------------------------------------

## 17. Fuera del piloto

Quedan para después:

- Aportes en dinero, pagos y comisión
- RSVP propio, lista de asistentes y cuentas de asistente
- Integración con la API de Luma
- Chat
- Entradas, QR y check-in
- Calendario de disponibilidad con precio
- Newsletter
- Sugerencias por inteligencia artificial
- App móvil
- Operación en otras ciudades

------------------------------------------------------------------------

## 18. Métrica

La métrica del piloto es el número de eventos facilitados: eventos que se realizaron y cuya evidencia aprobó el moderador.

Se observan también eventos publicados, necesidades cubiertas, propuestas enviadas, propuestas aceptadas, evidencias aprobadas y eventos con ficha pública.

La señal que importa:

> ¿La plataforma consiguió que un evento con espacio y apoyo pudiera realizarse?

La primera meta sigue siendo conseguir que 10 eventos gratuitos o de bajo costo en Pereira y Dosquebradas ocurran con matches cerrados en Redeventos. Después, 50. Después, 100.

------------------------------------------------------------------------

## 19. Adquisición

El software no depende de un operador, y la red inicial sí se construye conversando con personas concretas. El orden de salida sigue siendo el organizador, porque trae la demanda.

```text
Organizadores con un evento real
        |
        v
Publican necesidades
        |
        +----> Venue sponsors publican espacios
        |
        +----> Local sponsors publican aportes
        |
        v
Propuestas y matches
        |
        v
Evento realizado
        |
        v
Caso de éxito
        |
        v
Más organizadores
```

### A quién buscar

Organizadores: comunidades tecnológicas y universitarias, grupos de lectura, clubes de cine, colectivos culturales, emprendedores, meetups, grupos deportivos, organizaciones estudiantiles, fundaciones y personas que quieren empezar una comunidad. La prioridad son quienes ya quieren hacer algo y se traban en la logística.

Venue sponsors: cafés, restaurantes, coworkings, hoteles, bibliotecas, universidades, auditorios, teatros, centros culturales, librerías, galerías y otros espacios con capacidad ociosa. La pregunta es si tienen un espacio que pueda usarse para un evento, incluso si no lo alquilan como negocio.

Local sponsors: negocios con interés directo en una audiencia local. Software, academias, universidades, cafeterías, librerías, tiendas y servicios profesionales. La pregunta es qué tipo de evento les sirve y qué estarían dispuestos a aportar, en especie o en difusión.

### Cómo se dice

A un organizador:

> Estamos creando Redeventos para ayudar a comunidades de Pereira y Dosquebradas a realizar eventos gratuitos o de bajo costo. Publicas el evento, dices qué necesitas y los espacios y aliados te proponen cómo cubrirlo.

A un venue sponsor:

> Hay organizadores buscando espacio. Publica el tuyo, con su capacidad y sus condiciones, y recibe propuestas de eventos que pueden encajar.

A un local sponsor:

> Puedes apoyar un evento con productos, alimentación, equipos, servicios o difusión. A cambio, el evento ofrece visibilidad y activación. En Redeventos ves oportunidades concretas y envías una propuesta.

### Ritmo del primer mes

Semana 1. Contacto personal con organizadores. Objetivo: 10 eventos publicados, con necesidades reales.

Semana 2. Espacios que puedan cubrir esos eventos. Objetivo: 10 a 20 venues publicados.

Semana 3. Aliados locales frente a necesidades ya publicadas. Objetivo: propuestas sobre eventos concretos.

Semana 4. Matches aceptados y eventos en marcha. Objetivo: 3 a 5 eventos realizados, con evidencia.

El primer caso de éxito se publica con el espacio, los aportes y la asistencia. Esa página es la invitación para el siguiente organizador.

Los primeros participantes pueden reconocerse como miembros fundadores de la red: acceso temprano, prioridad de escucha y visibilidad. Ese reconocimiento no reemplaza el compromiso de registro ni el de match.

El sello de la red (sección 12) es otra forma de visibilidad para venues y locales afiliados: sticker o QR en el mostrador, enlace a la ficha pública y distinción **En la red** / **Aliado activo** cuando corresponda.

------------------------------------------------------------------------

## 20. Después del piloto

Cuando existan eventos facilitados de verdad, se puede abrir, en este orden:

1. Newsletter hacia sponsors.
2. Aportes en dinero y, solo entonces, una comisión sobre el efectivo que pase por un patrocinio.
3. Precio y calendario de disponibilidad para venues que alquilen.
4. Servicios de producción: foto, video, sonido, catering y otros, con comisión por transacción.
5. Suscripción para organizadores o venues que necesiten herramientas por encima del piloto.
6. Otras ciudades.

La hipótesis de cobro, cuando llegue ese momento, sigue siendo entrar sin costo y cobrar cuando exista una transacción. En el piloto no se cobra y no se retiene dinero.

------------------------------------------------------------------------

## 21. Idioma y datos personales

La interfaz, los correos y los compromisos están en español. Las fechas se muestran en hora de Bogotá. La moneda de referencia es el peso colombiano; el piloto no registra montos.

El responsable del tratamiento, en el piloto, es una persona natural. El registro muestra un aviso de privacidad simple antes de recoger nombre, correo y datos de contacto. WhatsApp y teléfono se piden como contacto directo y se muestran a la otra parte solo después de aceptar un match.

------------------------------------------------------------------------

## 22. Visión

La visión de largo plazo es la infraestructura digital para crear, apoyar, promocionar y descubrir eventos locales.

```text
IDEA
 |
 v
ORGANIZADOR
 |
 +----> VENUE SPONSOR
 |
 +----> LOCAL SPONSOR
 |
 +----> SERVICIOS
 |
 v
EVENTO
 |
 v
ASISTENTES
 |
 v
CASOS Y NUEVAS OPORTUNIDADES
```

El piloto demuestra una versión pequeña de ese flujo: necesidades reales, propuestas entre las partes, compromisos cumplidos y eventos que sí ocurrieron.

------------------------------------------------------------------------

## 23. Hipótesis

En Pereira y Dosquebradas hay comunidades que quieren hacer eventos gratuitos o de bajo costo y se traban al buscar espacio, apoyo y difusión. Hay espacios y negocios locales que podrían cubrir esas necesidades y no tienen una forma clara de encontrarlas.

Una plataforma donde esas partes publican, proponen y aceptan por su cuenta puede reducir esa fricción. La hipótesis queda probada cuando la evidencia aprobada muestre que esos eventos se realizaron.
