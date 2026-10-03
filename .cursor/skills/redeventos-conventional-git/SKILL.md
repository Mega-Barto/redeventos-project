---
name: redeventos-conventional-git
description: Applies Conventional Commits v1.0.0 for Redeventos (scopes, branch names, PR titles). Use when creating git commits, branches, or pull requests in this repo, when the user asks how to commit from the devcontainer, or when drafting commit messages after code changes.
---

# Redeventos — Conventional Git

Spec base: [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Complemento genérico: skill personal `conventional-git` si hace falta más detalle.

## Commits en el devcontainer

El workspace del contenedor **es el mismo repo** que en el host: la carpeta del proyecto (y `.git`) está montada. No hace falta un flujo distinto.

1. Abrir terminal integrado **dentro** del contenedor (bash).
2. Comprobar cambios: `git status`, `git diff`.
3. Stage selectivo: `git add <rutas>` — **nunca** `.env`, `.dev.vars`, claves ni `node_modules`.
4. Commit:
   ```bash
   git commit -m "type(scope): short imperative summary" -m "Optional body in English or Spanish."
   ```
5. Push cuando exista remoto: `git push -u origin <branch>`.

**Identidad Git:** `user.name` y `user.email` deben estar configurados (en el host o una vez en el contenedor). El agente **no** ejecuta `git config`.

**Herramientas en el devcontainer:** Git viene en la imagen; GitHub CLI (`gh`) está en [`.devcontainer/devcontainer.json`](../../../.devcontainer/devcontainer.json). `post-create.sh` añade `safe.directory` para este repo.

**Hooks:** no hay Husky en el repo hoy; el commit no pasa por pre-commit local salvo que lo añadas después.

## Formato del mensaje

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

| Type | Uso en Redeventos |
| --- | --- |
| `feat` | Funcionalidad de producto (piloto alineado a `docs/product/idea.md`) |
| `fix` | Corrección de bug |
| `docs` | Solo documentación (`docs/`, README, skills narrativas) |
| `test` | Tests (Vitest, Playwright) |
| `build` | Dependencias, Nuxt/Wrangler, assets `public/` |
| `ci` | GitHub Actions |
| `chore` | Mantenimiento (incl. `chore(dev):`, `chore(agent):`) |
| `refactor` | Sin cambio de comportamiento observable |
| `perf` | Rendimiento |

Breaking: `type(scope)!:` y/o footer `BREAKING CHANGE:`.

## Scopes usados en este repo

Preferir uno de estos; inventar otro solo si el cambio no encaja.

| Scope | Rutas / tema |
| --- | --- |
| `agent` | `.cursor/`, `.agents/skills/`, skills de proyecto |
| `dev` | `.devcontainer/`, `.vscode/` |
| `docs` | `docs/` |
| `api` | `server/api/` |
| `ui` | `app/components/`, páginas, layouts |
| `db` | `supabase/migrations/`, RLS, seed |
| `deps` | `package.json`, `bun.lock` |
| *(omitir)* | Cambios muy pequeños o transversales |

Ejemplos ya en `main`:

- `build: add redeventos nuxt stack scaffold`
- `chore(dev): add devcontainer and vscode workspace`
- `docs: add product, architecture and business docs`

**Descripción:** imperativo en **inglés** en la línea del subject (convención actual del repo). Cuerpo puede estar en español si aclara el porqué.

## Reglas del agente al commitear

1. `git status` + `git diff` antes de redactar.
2. Un cambio lógico por commit; no mezclar feat + docs no relacionados.
3. No commitear secretos ni artefactos ignorados (`.nuxt`, `test-results`, etc.).
4. No `git push --force` a `main` salvo petición explícita.
5. No modificar `git config`.
6. Si el usuario no pidió commit, **no** commitear.

## Ramas

Patrón: `<type>/<short-kebab-description>`.

Ejemplos: `feat/event-public-gate`, `fix/e2e-supabase-env`, `docs/canvas-futuro`.

Integración por defecto: **`main`**.

## Pull requests

Título = mismo estilo que un commit subject.

Cuerpo mínimo:

```markdown
## Summary
- …

## Test plan
- [ ] …
```

Usar `gh pr create` si el usuario pide PR y hay remoto configurado.

## Qué no va en el commit message

- Credenciales, URLs con tokens, contenido de `.env`.
- “WIP” en commits que se pretendan dejar en `main` (usar rama).

## Recursos

- Política de agente: [`.agents/skills/AGENT-POLICY.md`](../../../.agents/skills/AGENT-POLICY.md)
- Producto: [`docs/product/idea.md`](../../../docs/product/idea.md)
