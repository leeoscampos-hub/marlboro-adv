# Produção inicial

Este projeto agora tem uma base de SaaS implantável com Docker e PostgreSQL.

## Subir com Docker

Na pasta `saas_juridico`:

```powershell
docker compose up --build
```

Ou:

```powershell
.\scripts\start_docker.ps1
```

Abra:

```text
http://127.0.0.1:8765
```

Credenciais demo:

```text
admin@lexflow.local
admin123
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
DATABASE_URL=postgresql://lexflow:lexflow@db:5432/lexflow
APP_HOST=0.0.0.0
APP_PORT=8765
```

No `docker-compose.yml`, o `DATABASE_URL` do app já aponta para o serviço `db`.

## Saúde da aplicação

```text
GET /api/health
```

Retorno esperado:

```json
{
  "status": "ok",
  "database": "postgres",
  "ai_provider": "openai"
}
```

## Smoke test

```powershell
.\scripts\smoke_test.ps1
```

## Backup

```powershell
.\scripts\backup_postgres.ps1
```

## Restore

```powershell
.\scripts\restore_postgres.ps1 -BackupFile .\backups\lexflow-YYYYMMDD-HHMMSS.sql
```

## Parar containers

```powershell
.\scripts\stop_docker.ps1
```

## Próximos itens antes de venda ampla

- Trocar credenciais demo por criação segura de usuário administrador.
- Usar senha forte para PostgreSQL em produção.
- Configurar domínio e HTTPS por proxy reverso, como Caddy, Nginx ou serviço gerenciado.
- Ativar backups automáticos fora do servidor.
- Criar política de retenção e exclusão de dados.
- Criar tela de gestão de usuários, planos e permissões.
- Integrar pagamento/assinatura.
- Rodar testes de carga e segurança.
