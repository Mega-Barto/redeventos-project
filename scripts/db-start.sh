#!/usr/bin/env bash
# Supabase local corre en el Docker del host. El CLI comprueba 127.0.0.1:54322
# dentro de este contenedor, así que nos unimos a su red y reenviamos el puerto.
set -euo pipefail

PROJECT_ID="${SUPABASE_PROJECT_ID:-redeventos}"
NETWORK="supabase_network_${PROJECT_ID}"
SELF="$(hostname)"
PID_FILE="${TMPDIR:-/tmp}/redeventos-supabase-proxy.pids"
touch "$PID_FILE"

port_listening() {
  python3 - "$1" <<'PY'
import socket, sys
s = socket.socket()
s.settimeout(0.2)
try:
    s.bind(("127.0.0.1", int(sys.argv[1])))
except OSError:
    sys.exit(0)
finally:
    s.close()
sys.exit(1)
PY
}

container_ip() {
  local name="$1"
  python3 - "$name" "$NETWORK" <<'PY'
import json, subprocess, sys
name, network = sys.argv[1], sys.argv[2]
try:
    data = json.loads(subprocess.check_output(["docker", "inspect", name], text=True))
    ip = data[0]["NetworkSettings"]["Networks"][network]["IPAddress"]
except Exception:
    sys.exit(1)
if not ip or ip.count(".") != 3:
    sys.exit(1)
print(ip)
PY
}

tcp_open() {
  python3 - "$1" "$2" <<'PY'
import socket, sys
s = socket.socket()
s.settimeout(0.3)
try:
    s.connect((sys.argv[1], int(sys.argv[2])))
except OSError:
    sys.exit(1)
finally:
    s.close()
PY
}

ensure_network() {
  docker network connect "$NETWORK" "$SELF" 2>/dev/null || true
}

start_proxy() {
  local port="$1"
  local ip="$2"
  local dest="$3"
  if port_listening "$port"; then
    return
  fi
  socat TCP-LISTEN:"${port}",bind=127.0.0.1,fork,reuseaddr TCP4:"${ip}:${dest}" &
  echo $! >> "$PID_FILE"
}

wait_proxy() {
  local port="$1"
  local name="$2"
  local dest="$3"
  local tries=0
  local ip=""
  while [ "$tries" -lt 400 ]; do
    if docker inspect "$name" >/dev/null 2>&1; then
      ensure_network
      if ip="$(container_ip "$name")" && tcp_open "$ip" "$dest"; then
        start_proxy "$port" "$ip" "$dest"
        return
      fi
    fi
    tries=$((tries + 1))
    sleep 0.15
  done
}

ensure_network

wait_proxy 54322 "supabase_db_${PROJECT_ID}" 5432 &
wait_proxy 54321 "supabase_kong_${PROJECT_ID}" 8000 &
wait_proxy 54323 "supabase_studio_${PROJECT_ID}" 3000 &
wait_proxy 54324 "supabase_inbucket_${PROJECT_ID}" 8025 &

exec supabase start "$@"
