# Documentación Redeventos

Índice de la carpeta `docs/`. Fuente de verdad del piloto: **producto** → **arquitectura** → **negocio** (post-piloto).

## Marca

| Archivo | Contenido |
| --- | --- |
| [brand/rules.md](./brand/rules.md) | Tipografía, paleta elegida, fondo lámpara de lava |
| [brand/coolors.md](./brand/coolors.md) | Paletas Coolors evaluadas |

## Producto

| Archivo | Contenido |
| --- | --- |
| [idea.md](./product/idea.md) | Especificación del piloto; decisiones cerradas |

## Arquitectura

| Archivo | Contenido |
| --- | --- |
| [stack.md](./architecture/stack.md) | Stack Nuxt + Cloudflare + Supabase |
| [database.md](./architecture/database.md) | Esquema PostgreSQL, Storage e imágenes |
| [canvas-model.md](./architecture/canvas-model.md) | Vista técnica: infra, dominio, datos y flujos |

## Negocio

| Archivo | Contenido |
| --- | --- |
| [modelo-canvas.md](./business/modelo-canvas.md) | Business Model Canvas (piloto, $0) |
| [modelo-canvas-futuro.md](./business/modelo-canvas-futuro.md) | Canvas post-piloto: costos e ingresos |
| [futuro-ingresos.md](./business/futuro-ingresos.md) | Hipótesis descartadas y viables (p. ej. comisión por asistentes) |

## Diagramas

Abrir en [draw.io](https://app.diagrams.net/) o Excalidraw según extensión.

| Archivo | Contenido |
| --- | --- |
| [redeventos-database-er.drawio](./diagrams/redeventos-database-er.drawio) | ER PostgreSQL + Storage (piloto) |
| [redeventos-flujos.drawio](./diagrams/redeventos-flujos.drawio) | Flujos del sistema |
| [redeventos-modelo-canvas.drawio](./diagrams/redeventos-modelo-canvas.drawio) | Canvas de negocio (piloto) |
| [redeventos-modelo-canvas-futuro.drawio](./diagrams/redeventos-modelo-canvas-futuro.drawio) | Canvas de negocio (futuro) |
| [redeventos-canvas.excalidraw](./diagrams/redeventos-canvas.excalidraw) | Diagrama técnico (Excalidraw) |

## Orden de lectura sugerido

1. [`product/idea.md`](./product/idea.md)
2. [`architecture/stack.md`](./architecture/stack.md)
3. [`business/modelo-canvas.md`](./business/modelo-canvas.md) + diagramas en [`diagrams/`](./diagrams/)

Para monetización futura (no es el piloto): [`business/futuro-ingresos.md`](./business/futuro-ingresos.md) y [`business/modelo-canvas-futuro.md`](./business/modelo-canvas-futuro.md).
