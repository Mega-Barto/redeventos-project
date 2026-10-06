#!/usr/bin/env bash
set -euo pipefail

sudo chown -R node:node node_modules .nuxt "${HOME}/.bun/install/cache"

if ! git config --global --get-all safe.directory 2>/dev/null | grep -Fxq "${PWD}"; then
  git config --global --add safe.directory "${PWD}"
fi

if [ -f package.json ]; then
  bun install --frozen-lockfile
fi

if [ "${INSTALL_PLAYWRIGHT:-}" = "1" ]; then
  bunx playwright install --with-deps chromium
fi

echo "node     $(node --version)"
echo "bun      $(bun --version)"
echo "supabase $(supabase --version)"
if command -v docker >/dev/null 2>&1; then
  echo "docker   $(docker --version)"
fi

if [ -n "${SSH_AUTH_SOCK:-}" ]; then
  echo "ssh-agent: reenviado desde el host"
else
  echo "ssh-agent: sin reenvio. La clave privada no esta en el contenedor."
fi
