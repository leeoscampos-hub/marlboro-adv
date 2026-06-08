# Fluxo Git e CI/CD

Repositorio alvo: `leeoscampos-hub/marlboro-adv`

## Estado atual

- `main` publicada e protegida no GitHub.
- `dev` publicada para novas implementacoes.
- Pull request obrigatorio para levar alteracoes para `main`.
- Checks obrigatorios na `main`: `Build, API and smoke tests` e `validate`.
- Deploy EC2 configurado, mas condicionado aos secrets de producao.

## Branches

- `main`: producao. Deve receber somente codigo aprovado.
- `dev`: desenvolvimento. Novas implementacoes entram primeiro aqui.

## Fluxo de trabalho

1. Trabalhar na branch `dev` ou em branches curtas a partir dela.
2. Abrir pull request para revisao.
3. Aprovar e fazer merge para `main`.
4. A pipeline de CI valida backend, Docker, criptografia e endpoints.
5. Quando os secrets de producao estiverem configurados, o merge na `main` dispara o deploy EC2.

## CI

O workflow `CI - LexFlow` roda em:

- push para `dev`;
- push para `main`;
- pull request para `main`.

Ele valida:

- dependencias Python;
- compilacao do backend;
- helpers de criptografia;
- configuracao Docker Compose;
- build e subida da stack;
- `/api/health`;
- login admin;
- endpoints principais.

## Protecao da main

A branch `main` foi configurada com:

- pull request antes do merge;
- 1 aprovacao obrigatoria;
- checks obrigatorios antes do merge;
- branch atualizada antes do merge;
- historico linear;
- resolucao obrigatoria de conversas;
- bloqueio de force push;
- bloqueio de delete.

## CD em producao

O workflow `CD - Production EC2` roda em:

- push/merge na `main`;
- execucao manual pelo GitHub Actions.

O deploy real so executa se os secrets obrigatorios existirem:

- `EC2_HOST`: IP ou DNS da EC2.
- `EC2_USER`: usuario SSH, por exemplo `ubuntu`.
- `EC2_SSH_KEY`: chave privada SSH autorizada na EC2.

Variables recomendadas no GitHub:

- `EC2_APP_DIR`: caminho do projeto na EC2. Padrao: `/opt/lexflow/saas_juridico`.
- `PRODUCTION_URL`: URL publica, por exemplo `https://app.seudominio.com`.

Enquanto esses secrets nao estiverem configurados, o workflow registra que o deploy foi pulado e encerra sem falhar a pipeline.

## Preparacao da EC2

Na EC2, o diretorio de aplicacao deve conter:

- repositorio clonado;
- Docker e Docker Compose instalados;
- arquivo `.env.ec2` real preenchido;
- acesso SSH pela chave cadastrada em `EC2_SSH_KEY`;
- porta HTTP/HTTPS liberada no security group;
- dominio apontando para o IP da instancia, quando houver dominio.

Comandos base na EC2:

```bash
sudo mkdir -p /opt/lexflow
sudo chown -R "$USER":"$USER" /opt/lexflow
cd /opt/lexflow
git clone https://github.com/leeoscampos-hub/marlboro-adv.git .
cd saas_juridico
cp .env.ec2.example .env.ec2
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up --build -d
```

## Proximos passos para producao

1. Criar a EC2.
2. Configurar DNS/dominio.
3. Preencher `.env.ec2`.
4. Cadastrar secrets e variables no GitHub.
5. Rodar o workflow `CD - Production EC2`.
6. Validar login, agenda, publicacoes, CRM, financeiro, backups e monitoramento.
