# MCP — Redeventos (día 1)

Configuración en [`.cursor/mcp.json`](./mcp.json). Detalle en [`.agents/skills/STACK-SKILLS-AND-MCP.md`](../.agents/skills/STACK-SKILLS-AND-MCP.md).

## Activar en Cursor

1. Abre **Settings → MCP** y confirma que Cursor lee el `mcp.json` del proyecto (o copia los servidores al config global).
2. Reinicia MCP / recarga ventana si un servidor queda en error.

## Por servidor

| Servidor | Auth | Uso en Redeventos |
| --- | --- | --- |
| **supabase** | OAuth al conectar (proyecto **dev**) | Migraciones, SQL, tipos, logs |
| **cloudflare-docs** | Ninguna (docs) | Workers, Wrangler, despliegue Nuxt |
| **playwright** | Local | E2E, reproducir flujos match/evidencia |
| **github** | Token en variable de entorno | CI, PRs, issues |

## GitHub MCP

Requiere **Docker Desktop** en ejecución (`ghcr.io/github/github-mcp-server`). El paquete npm `@modelcontextprotocol/server-github` está deprecado; no usar.

1. Crea un PAT en GitHub con el mínimo necesario (p. ej. `repo`).
2. Variable de entorno de usuario (PowerShell):

```powershell
[System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_...", "User")
```

3. Reinicia Cursor. Si `${env:GITHUB_PERSONAL_ACCESS_TOKEN}` no se expande, define el mismo par en **Settings → MCP → github → env** (sin commitear el token).

**Sin Docker:** en `~/.cursor/mcp.json` (global, no repo) puedes usar el servidor remoto:

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": { "Authorization": "Bearer TU_PAT" }
}
```

Guía oficial: [install-cursor.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md).

## Seguridad (`docs/architecture/stack.md` §31)

- Supabase MCP → solo proyecto de desarrollo/staging.
- Toolsets read-only cuando solo analices CI o datos.
- Revisa acciones destructivas antes de aprobar.

## Fases posteriores

- PostHog: `https://mcp.posthog.com/mcp`
- Cloudflare API / observabilidad: ver `docs/architecture/stack.md` §29
