# Saas Template — Migração SQLite → PostgreSQL

Este template contém os artefatos mínimos para automatizar a subida de um PostgreSQL via Docker, executar migração do SQLite local para o PostgreSQL e iniciar a aplicação.

Conteúdo
- `scripts/migrate_and_up.ps1` — script PowerShell (Windows)
- `scripts/migrate_and_up.sh` — script Bash (Linux/macOS)

Uso rápido
1. Copie o template para o seu projeto `saas_xxx` ou use diretamente os scripts no template.
2. Ajuste `docker-compose.yml` do projeto se necessário (nomes de serviços/portas).
3. Rode (PowerShell):

```powershell
.\saas_template\scripts\migrate_and_up.ps1
```

Ou (Linux/macOS):

```bash
bash ./saas_template/scripts/migrate_and_up.sh
```

Notas
- Revise os valores de `DATABASE_URL` antes de executar em produção.
- Os scripts criam um DB/usuário `lexflow` com senha `lexflow` por conveniência — altere conforme política de segurança.
