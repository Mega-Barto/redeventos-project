# Redeventos

Plataforma que conecta organizadores, espacios y aliados locales para que eventos gratuitos o bajo costo en Pereira y Dosquebradas puedan realizarse.

- Documentación: [`docs/`](./docs/) (índice en [`docs/README.md`](./docs/README.md))
- Especificación del piloto: [`docs/product/idea.md`](./docs/product/idea.md)
- Stack técnico: [`docs/architecture/stack.md`](./docs/architecture/stack.md)
- Flujos del sistema: [`docs/diagrams/redeventos-flujos.drawio`](./docs/diagrams/redeventos-flujos.drawio)

## Entorno de desarrollo

Desarrollo recomendado con **Dev Containers** en Cursor (extensión **Dev Containers**). El runtime del proyecto es **Nuxt 4 + Bun**; Supabase local y contenedores auxiliares usan el **Docker del host** (no un motor Docker dentro del contenedor).

```text
Windows 11
  → WSL2 (Docker Desktop)
    → Dev Container (usuario `node`)
      → Bun + Nuxt + Supabase CLI
```

### Requisitos en el host (Windows)

| Requisito | Notas |
| --- | --- |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Motor WSL2; arranca Docker antes de abrir el contenedor |
| [Cursor](https://cursor.com/) + extensión Dev Containers | Comando: **Dev Containers: Reopen in Container** |
| Git | El repo y `.git` viven en el workspace montado |
| OpenSSH (cliente) | Viene con Windows; necesario para GitHub por SSH |

Opcional en el host: **Bun** y **Node** para tareas fuera del contenedor (versiones alineadas: Bun **1.2.17**, Node **22**).

### Qué incluye el Dev Container

Definido en [`.devcontainer/`](./.devcontainer/):

| Componente | Detalle |
| --- | --- |
| Imagen base | `mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm` (Node 22) |
| Bun | **1.2.17** (copiado desde imagen oficial `oven/bun`) |
| Supabase CLI | **2.119.0** (versión fijada, no `latest`) |
| Usuario | `node` (no root en el día a día) |
| Zona horaria | `America/Bogota` |
| Docker | Feature **docker-outside-of-docker**: el CLI del contenedor habla con Docker Desktop del host (menor RAM/CPU que Docker-in-Docker) |
| `postCreate` | [`post-create.sh`](./.devcontainer/post-create.sh): permisos en volúmenes, `safe.directory`, `bun install --frozen-lockfile` |

**Puertos reenviados:** `3000` (Nuxt), `8787` / `8976` (Wrangler), `54321`–`54324` (Supabase local).

**Extensiones en el contenedor:** Vue (Volar), Biome, Tailwind CSS, Vitest, Docker, GitHub Pull Requests.

### Optimizaciones de rendimiento y reproducibilidad

Estas decisiones evitan I/O lento entre Windows y Linux y reducen el peso del entorno:

1. **Volúmenes nombrados de Docker** (el código fuente sigue en el bind mount editable desde Cursor):
   - `redeventos-node_modules` → `node_modules`
   - `redeventos-nuxt` → `.nuxt`
   - `redeventos-bun-cache` → caché de instalación de Bun en `/home/node/.bun/install/cache`

2. **Sin Docker-in-Docker:** eliminado el volumen interno `/var/lib/docker` y un segundo motor; `bun run db:start` levanta contenedores Supabase en el host.

3. **Playwright bajo demanda:** el `postCreate` **no** instala Chromium ni dependencias de sistema por defecto. Para E2E, dentro del contenedor:
   ```bash
   INSTALL_PLAYWRIGHT=1 bash .devcontainer/post-create.sh
   # o, una vez:
   bunx playwright install --with-deps chromium
   ```

4. **Versiones fijadas** de Bun y Supabase CLI en el [`Dockerfile`](./.devcontainer/Dockerfile) para builds reproducibles.

5. **[`.dockerignore`](./.dockerignore):** excluye `node_modules`, `.nuxt`, `.env`, `.git`, etc., si construyes imágenes desde la raíz del repo.

6. **`.gitignore`:** además de `.env` y artefactos de Nuxt, ignora patrones de claves privadas (`id_rsa`, `id_ed25519`, `*.pem`).

Tras **destruir y recrear** el contenedor, el código y Git se conservan en el host; dependencias y `.nuxt` se repoblan con `bun install` (automático en `postCreate`).

### Ubicación del repo (Windows vs WSL2)

Si clonas en `C:\Users\...\Documentos\...`, el bind mount puede hacer más lento el hot reload de Vite/Nuxt. Los volúmenes de `node_modules` y `.nuxt` mitigan parte del coste, pero el **código fuente** sigue en NTFS.

**Recomendación opcional (mejor rendimiento):** clonar el repo en el filesystem de Ubuntu, por ejemplo `~/projects/events-app` dentro de WSL2, y abrir esa carpeta en Cursor. No muevas el proyecto encima de una copia en uso sin cerrar el Dev Container.

### Git y GitHub (SSH sin copiar la clave al contenedor)

La clave privada **permanece solo en el host** (`%USERPROFILE%\.ssh`). El contenedor no monta ni copia `~/.ssh`.

Flujo deseado:

```text
Host (~/.ssh/id_rsa u otra identidad)
  → OpenSSH Authentication Agent (ssh-agent)
  → reenvío del agente (Cursor / Dev Containers)
  → git / ssh dentro del contenedor
  → GitHub
```

**En Windows (una vez por sesión, o tras reiniciar):**

1. Servicios → **OpenSSH Authentication Agent** → inicio **Manual** o **Automático** → **Iniciar** (PowerShell como administrador la primera vez):
   ```powershell
   Set-Service -Name ssh-agent -StartupType Manual
   Start-Service ssh-agent
   ```
2. Cargar la clave que usa GitHub (comprueba con `ssh -T git@github.com` en el host):
   ```powershell
   ssh-add $env:USERPROFILE\.ssh\id_rsa
   ssh-add -l
   ```
3. Abrir el proyecto con **Reopen in Container**.
4. Dentro del contenedor:
   ```bash
   ssh -T git@github.com
   git status
   git pull   # cuando exista `origin`
   git push
   ```

Configura el remoto si falta:

```bash
git remote add origin git@github.com:<org>/events-app.git
```

**Identidad Git:** `user.name` y `user.email` en el host o una vez en el contenedor. Commits en la terminal del contenedor; mensajes: [Conventional Commits](https://www.conventionalcommits.org/) — ver [`.cursor/skills/redeventos-conventional-git/`](./.cursor/skills/redeventos-conventional-git/).

### Primer arranque dentro del contenedor

```bash
cp .env.example .env
bun run db:start      # Supabase local; copia claves de `supabase status` a .env
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

### Comandos habituales

| Comando | Qué hace |
| --- | --- |
| `bun run dev` | Nuxt en modo desarrollo |
| `bun run preview` | Build y `wrangler dev`, el runtime real de Workers, en http://localhost:8787 |
| `bun run lint` / `bun run lint:fix` | Biome: lint, formato e imports |
| `bun run typecheck` | Tipos de Vue y TypeScript |
| `bun run test` | Pruebas unitarias con Vitest |
| `bun run test:e2e` | Playwright contra `bun run preview` (8787). Requiere Chromium instalado (ver arriba) |
| `bun run db:start` / `db:stop` / `db:reset` | Supabase local |
| `bun run db:seed:local` | Reset local + seed + fotos de [Picsum](https://picsum.photos/) en Storage (`scripts/seed-local-media.ts`) |
| `bun run db:types` | Regenera `shared/types/database.types.ts` desde la base local |
| `bun run cf-typegen` | Regenera `worker-configuration.d.ts` tras cambiar `wrangler.jsonc` |

### Recursos (Docker Desktop)

Con **16 GB RAM** en el host, conviene no dejar muchos stacks Supabase ajenos en paralelo. Ajuste manual recomendado en Docker Desktop → **Settings → Resources**: ~**6–8 GB** RAM y ~**6 CPUs** para el VM de Docker, dejando margen a Windows y Cursor.

La limpieza de imágenes, build cache o volúmenes huérfanos es **manual** y opcional; evita `docker volume prune` si quieres conservar `redeventos-node_modules` y `redeventos-bun-cache` sin contenedor asociado.

### Comprobación rápida

| Dónde | Comando | Esperado |
| --- | --- | --- |
| Host | `docker version` | Cliente y servidor responden |
| Host | `ssh-add -l` | Huella de tu clave GitHub |
| Host | `ssh -T git@github.com` | Mensaje de autenticación GitHub |
| Contenedor | `bun --version` | `1.2.17` |
| Contenedor | `supabase --version` | `2.119.0` |
| Contenedor | `ssh -T git@github.com` | Misma cuenta que en el host |
| Contenedor | `bun run dev` | Nuxt en `:3000`; cambios en `.vue` con hot reload |

## Estructura

```text
app/            Vue: páginas, layouts, componentes y composables
server/         Nitro: rutas de API y lógica con secretos
shared/         Constantes, esquemas Zod y tipos que usan app y server
supabase/       Configuración local, migraciones y seed
tests/          unit/ con Vitest y e2e/ con Playwright
```
