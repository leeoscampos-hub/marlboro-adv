# Validação de prontidão comercial

Data da validação: 08/06/2026

## Resultado executivo

O LexFlow IA está funcional no ambiente local em Docker, com API, banco PostgreSQL e principais fluxos de cadastro operando. A aplicação está pronta para iniciar deploy em EC2, mas ainda não deve ser considerada 100% pronta para venda em produção até concluir as pendências externas: domínio, EC2 real, variáveis reais, monitoramento externo, credenciais Meta, OAB/credenciais dos tribunais e painel administrativo de plataforma/superusuário.

## Validações aprovadas

- Docker local com `lexflow_app` e `lexflow_db` saudáveis.
- `/api/health` retornando `status=ok` e `database=postgres`.
- Login administrativo em `/api/login`.
- Sessão autenticada em `/api/me`.
- Catálogo de 32 endpoints disponível em `/api/endpoints`.
- Dashboard/overview disponível.
- CRUD testado com registros temporários para:
  - clientes;
  - etiquetas;
  - processos com etiqueta;
  - filtro de processos por etiqueta;
  - atendimentos;
  - tarefas;
  - eventos/audiências;
  - conclusão de tarefa;
  - conclusão de evento;
  - limpeza dos registros temporários.
- Financeiro listando registros.
- Usuários e configurações acessíveis ao administrador do cliente.
- Auditoria registrando eventos.
- Central omnichannel com canais WhatsApp, Instagram e Facebook cadastrados como pendentes de configuração.
- TJMG/DataJud em modo homologação com última sincronização retornando `ok`.
- Compose de produção EC2 validado com `.env.ec2.example`.

## Correção aplicada durante a validação

Foi corrigido o conversor de placeholders SQLite/PostgreSQL para escapar `%` literais em consultas SQL. Antes disso, a listagem de processos quebrava no PostgreSQL ao usar `LIKE 'concl%'`.

Arquivo corrigido:

- `server.py`

## Integrações com tribunais

Status atual:

- DataJud/CNJ: pronto em modo homologação para TJMG e conectores nacionais.
- DJEN/Comunica: conector existe, mas depende de nome do advogado ou OAB/UF para monitoramento automático.
- PJe: conector existe, mas depende de OAB/UF e pode exigir endpoint/credencial específica conforme tribunal.
- eProc: desabilitado até existir endpoint/credencial do tribunal.
- JPe: desabilitado até existir endpoint/credencial do tribunal.
- TOTP/seed: campo existe nos conectores, mas ainda depende da configuração real do tribunal.

Conclusão: as integrações não estão 100% em produção. Elas estão estruturalmente implementadas e parcialmente homologadas, mas precisam de credenciais reais e validação externa por tribunal.

## Painéis administrativos

Painel administrativo do cliente:

- Existe via usuário `admin`.
- Permite usuários, configurações, auditoria, integrações e operação da organização.

Painel administrativo da plataforma/superusuário:

- Ainda não existe como painel separado multi-tenant para gestão comercial da plataforma.
- O sistema possui organização e usuários, mas falta um painel de operador SaaS para administrar todos os clientes, planos, cobranças, tenants, suporte e status global.

## Deploy EC2

Pronto para iniciar quando houver:

- EC2 Ubuntu criada;
- Elastic IP;
- domínio apontando para o IP;
- `.env.ec2` preenchido;
- `POSTGRES_PASSWORD` forte;
- `ENCRYPTION_PASSPHRASE` forte;
- `OPENAI_API_KEY` real, se IA real for usada;
- OAB/credenciais dos tribunais;
- credenciais Meta para WhatsApp, Instagram e Facebook.

Comando na EC2:

```bash
./scripts/ec2_deploy.sh
```

## Monitoramento

Scripts adicionados:

- `scripts/monitor_health.sh`
- `scripts/monitor_health.ps1`

Exemplo na EC2:

```bash
HEALTH_URL=https://app.seudominio.com/api/health ./scripts/monitor_health.sh
```

O monitoramento comercial deve ser complementado com:

- uptime externo;
- alerta por e-mail/WhatsApp/Slack;
- logs persistentes;
- backup diário testado;
- métrica de CPU, memória e disco;
- monitoramento do PostgreSQL.

## Pendências para venda

- Subir em EC2 real.
- Testar HTTPS real com domínio.
- Validar webhooks Meta em HTTPS.
- Configurar OAB, nome do advogado e credenciais reais dos tribunais.
- Validar publicação real vinda do DJEN/DataJud.
- Criar painel de superusuário da plataforma.
- Configurar monitoramento externo e rotina de backup.
- Remover/trocar usuários demo antes de vender.
- Revisar LGPD, termos de uso, política de privacidade e contratos comerciais.
