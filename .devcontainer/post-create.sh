#!/usr/bin/env bash
set -euo pipefail

sudo chown -R node:node node_modules "$HOME/.bun/install/cache"
git config --global --add safe.directory "$PWD"

if [ -f package.json ]; then
  bun install
  bunx playwright install --with-deps chromium
fi

echo "node     $(node --version)"
echo "bun      $(bun --version)"
echo "supabase $(supabase --version)"
echo "docker   $(docker --version)"
