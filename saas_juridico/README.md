# LexFlow IA Juridica

SaaS local para escritorio de advocacia com CRM, atendimentos, agenda, processos, financeiro, publicacoes e automacoes.

## Como rodar

Opcao simples no Windows (porta 8765):

```powershell
.\run_server.bat
```

Parar servidor:

```powershell
.\stop_server.bat
```

Porta alternativa (8770):

```powershell
.\run_server_8770.bat
```

Parar porta alternativa:

```powershell
.\stop_server_8770.bat
```

Opcao manual:

```powershell
python .\server.py --host 127.0.0.1 --port 8765
```

URL:

```text
http://127.0.0.1:8765
```

## Credenciais demo

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@lexflow.local | admin123 |
| Advogado | advogada@lexflow.local | adv123 |
| Atendimento | atendimento@lexflow.local | at123 |

## Ativar IA real

1. Edite `.env`
2. Configure:

```text
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-5.4-mini
```

## Integracao com tribunais (TJMG / PJe / eProc / JPe)

Endpoints:

- `GET /api/tribunal-integrations/config`
- `POST /api/tribunal-integrations/config`
- `GET /api/tribunal-integrations/status`
- `POST /api/tribunal-integrations/sync`

Persistencia:

- `tribunal_connectors` (config por escritorio)
- `tribunal_sync_runs` (historico de sincronizacao)
- `case_movements` (publicacoes e movimentacoes importadas)

Modo padrao:

```text
TRIBUNAL_SYNC_MODE=homolog
```

Variaveis principais:

```text
TJMG_PJE_BASE_URL=
TJMG_PJE_TOKEN=
TJMG_EPROC_BASE_URL=
TJMG_EPROC_TOKEN=
TJMG_JPE_BASE_URL=
TJMG_JPE_TOKEN=
```

## Docker

```powershell
docker compose up --build
```

ou

```powershell
.\scripts\start_docker.ps1
```

Healthcheck:

```text
/api/health
```

## Deploy em AWS EC2

Para rodar em EC2 com PostgreSQL interno, Caddy e HTTPS:

```bash
cp .env.ec2.example .env.ec2
nano .env.ec2
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up --build -d
```

Guia completo:

```text
docs/DEPLOY_EC2_AWS.md
```

MigraÃ§Ã£o para PostgreSQL
-----------------------

O projeto tem scripts para automatizar a migraÃ§Ã£o SQLite â†’ PostgreSQL e subir o serviÃ§o:

- `scripts/migrate_and_up.ps1` â€” PowerShell (Windows)
- `scripts/migrate_and_up.sh` â€” Bash (Linux/macOS)
- `scripts/backup_postgres.ps1` / `scripts/restore_postgres.ps1` â€” backup/restore

Leia tambÃ©m: `README_POSTGRES_MIGRATION.md` para instruÃ§Ãµes detalhadas.

IntegraÃ§Ã£o ContÃ­nua
-------------------

Adicionamos um workflow de CI (`.github/workflows/ci.yml`) que:

- ConstrÃ³i as imagens com `docker compose build`
- Sobe os serviÃ§os com `docker compose up -d`
- Executa o `smoke_test.ps1` para validar endpoints bÃ¡sicos
- Faz teardown no final

