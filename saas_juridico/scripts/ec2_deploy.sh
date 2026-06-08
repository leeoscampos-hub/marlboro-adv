#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f ".env.ec2" ]]; then
  echo "Arquivo .env.ec2 nao encontrado."
  echo "Crie com: cp .env.ec2.example .env.ec2"
  exit 1
fi

docker compose --env-file .env.ec2 -f docker-compose.ec2.yml config >/dev/null
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up --build -d
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml ps

echo
echo "Deploy EC2 concluido. Verifique /api/health no dominio configurado."
