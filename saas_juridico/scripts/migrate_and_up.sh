#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Subindo serviço Postgres via Docker Compose..."
docker compose up -d db

echo "Aguardando PostgreSQL ficar pronto (até 120s)..."
READY=false
for i in {1..60}; do
  if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 2
done
if [ "$READY" = false ]; then
  echo "Postgres não ficou pronto no tempo esperado." >&2
  exit 1
fi
echo "Postgres pronto."

echo "Criando database e usuário (se necessário)..."
docker compose exec -T db psql -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lexflow') THEN CREATE DATABASE lexflow; END IF; END\$\$;"
docker compose exec -T db psql -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lexflow') THEN CREATE USER lexflow WITH PASSWORD 'lexflow'; GRANT ALL PRIVILEGES ON DATABASE lexflow TO lexflow; END IF; END\$\$;"

DATABASE_URL="postgresql://lexflow:lexflow@127.0.0.1:5432/lexflow"

# Backup and update .env
ENV_FILE="$ROOT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_FILE.bak"
  if grep -q '^DATABASE_URL=' "$ENV_FILE"; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE"
  else
    echo "DATABASE_URL=$DATABASE_URL" >> "$ENV_FILE"
  fi
else
  echo "DATABASE_URL=$DATABASE_URL" > "$ENV_FILE"
fi

echo "Executando script de migração SQLite -> Postgres..."
python migrate_sqlite_to_postgres.py --sqlite lexflow.db --database-url "$DATABASE_URL"

echo "Migração concluída. Subindo a aplicação (se houver serviço 'app')..."
if docker compose ps --services | grep -q "^app$"; then
  docker compose up -d app
else
  echo "Serviço 'app' não encontrado no compose; inicie a aplicação localmente apontando .env para o novo DATABASE_URL"
fi

echo "Verificando /api/health até confirmar 'database: postgres' (até 60s)..."
for i in {1..30}; do
  if curl -sS http://127.0.0.1:8765/api/health | grep -iq '"database".*postgres'; then
    echo "Health ok: usando Postgres"
    exit 0
  fi
  sleep 2
done
echo "A aplicação não reportou Postgres no /api/health dentro do tempo esperado. Verifique logs do container/app." >&2
exit 1
