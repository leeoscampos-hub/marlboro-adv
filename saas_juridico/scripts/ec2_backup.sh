#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f ".env.ec2" ]]; then
  echo "Arquivo .env.ec2 nao encontrado."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.ec2
set +a

mkdir -p backups
timestamp="$(date +%Y%m%d-%H%M%S)"
file="backups/lexflow-${timestamp}.sql"

docker compose --env-file .env.ec2 -f docker-compose.ec2.yml exec -T db pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "${file}"

echo "Backup criado em ${file}"
