#!/usr/bin/env bash
set -euo pipefail

HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:8765/api/health}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"

response="$(curl -fsS --max-time "${TIMEOUT_SECONDS}" "${HEALTH_URL}")"

if ! printf '%s' "${response}" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"'; then
  echo "Healthcheck respondeu, mas sem status ok: ${response}" >&2
  exit 2
fi

echo "OK ${HEALTH_URL} ${response}"
