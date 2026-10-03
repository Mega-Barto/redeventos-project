# Redeventos

Plataforma que conecta organizadores, espacios y aliados locales para que eventos gratuitos o de bajo costo en Pereira y Dosquebradas puedan realizarse.

- Documentación: [`docs/`](./docs/) (índice en [`docs/README.md`](./docs/README.md))
- Especificación del piloto: [`docs/product/idea.md`](./docs/product/idea.md)
- Stack técnico: [`docs/architecture/stack.md`](./docs/architecture/stack.md)
- Flujos del sistema: [`docs/diagrams/redeventos-flujos.drawio`](./docs/diagrams/redeventos-flujos.drawio)

## Entorno de desarrollo

El proyecto corre en un devcontainer (Node 22, Bun, Supabase CLI y Docker propio). En Cursor: **Dev Containers: Reopen in Container**.

Dentro del contenedor:

```bash
bun run db:start      # Supabase local; copia las claves de `supabase status` a .env
cp .env.example .env
bun run dev           # Nuxt en http://localhost:3000
```

Cuentas de prueba (tras `bun run db:seed:local`). Contraseña de las cuatro: **`piloto-local`**. Solo existen en la base local; no las uses en remoto.

| Correo | Rol | Para qué |
| --- | --- | --- |
| `ana.organizadora@local.redeventos.test` | organizer | Publicar evento, evidencia |
| `leo.espacio@local.redeventos.test` | venue_sponsor | Ficha de espacio |
| `luz.aliada@local.redeventos.test` | local_sponsor | Propuestas |
| `moda.red@local.redeventos.test` | moderator | Evidencias, reportes, desafiliación (`/app/moderation`) |

No hay rol `admin`. Entrar en `/login`.

**Git:** el repo montado incluye `.git`; haz commits en la terminal del contenedor como en el host (`git add`, `git commit`). Mensajes: [Conventional Commits](https://www.conventionalcommits.org/) — ver skill `.cursor/skills/redeventos-conventional-git/`. Configura `user.name` y `user.email` si aún no lo hiciste.

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Nuxt en modo desarrollo |
| `bun run preview` | Build y `wrangler dev`, el runtime real de Workers, en http://localhost:8787 |
| `bun run lint` / `bun run lint:fix` | Biome: lint, formato e imports |
| `bun run typecheck` | Tipos de Vue y TypeScript |
| `bun run test` | Pruebas unitarias con Vitest |
| `bun run test:e2e` | Pruebas E2E con Playwright contra `bun run preview` (puerto 8787). Primera vez: `bunx playwright install --with-deps chromium` |
| `bun run db:start` / `db:stop` / `db:reset` | Supabase local |
| `bun run db:seed:local` | Reset local + seed + fotos de [Picsum](https://picsum.photos/) en Storage (`scripts/seed-local-media.ts`) |
| `bun run db:types` | Regenera `shared/types/database.types.ts` desde la base local |
| `bun run cf-typegen` | Regenera `worker-configuration.d.ts` tras cambiar `wrangler.jsonc` |

## Estructura

```text
app/            Vue: páginas, layouts, componentes y composables
server/         Nitro: rutas de API y lógica con secretos
shared/         Constantes, esquemas Zod y tipos que usan app y server
supabase/       Configuración local, migraciones y seed
tests/          unit/ con Vitest y e2e/ con Playwright
```
