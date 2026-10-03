#!/usr/bin/env bash
# Repuebla solo la base local. No usa --linked ni db push.
set -euo pipefail

status="$(supabase status -o env 2>/dev/null || true)"
api="$(printf '%s\n' "$status" | sed -n 's/^API_URL=//p' | tr -d '"')"

if [ "$api" != "http://127.0.0.1:54321" ]; then
  echo "db:seed:local solo corre contra la API local 127.0.0.1:54321 (ahora: ${api:-desconocida})." >&2
  exit 1
fi

supabase db reset
exec bun scripts/seed-local-media.ts
