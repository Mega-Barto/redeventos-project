#!/usr/bin/env bash
set -euo pipefail

PID_FILE="${TMPDIR:-/tmp}/redeventos-supabase-proxy.pids"
if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    kill "$pid" 2>/dev/null || true
  done < "$PID_FILE"
  rm -f "$PID_FILE"
fi

exec supabase stop "$@"
