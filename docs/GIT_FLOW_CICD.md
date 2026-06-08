# Fluxo Git e CI/CD

Repositório alvo: `leeoscampos-hub/marlboro-adv`

## Branches

- `main`: produção. Só recebe código aprovado via pull request.
- `dev`: desenvolvimento. Todas as novas implementações entram primeiro aqui.

## Fluxo de trabalho

1. Criar ou atualizar a branch `dev`.
2. Fazer novas implementações em branches curtas a partir da `dev`, por exemplo `feature/agenda-ajustes`.
3. Abrir pull request da branch de feature para `dev`, quando desejar revisão interna.
4. Abrir pull request de `dev` para `main` para aprovação de produção.
5. O merge na `main` dispara o deploy para EC2 pelo workflow `CD - Production EC2`.

## CI

O workflow `CI - LexFlow` roda em:

- push para `dev`;
- push para `main`;
- pull request para `main`.

Ele valida:

- dependências Python;
- compilação do backend;
- helpers de criptografia;
- configuração Docker Compose;
- build e subida da stack;
- `/api/health`;
- login admin;
- endpoints principais.

## CD em produção

O workflow `CD - Production EC2` roda em:

- push/merge na `main`;
- execução manual pelo GitHub Actions.

Secrets necessários no GitHub:

- `EC2_HOST`: IP ou DNS da EC2.
- `EC2_USER`: usuário SSH, por exemplo `ubuntu`.
- `EC2_SSH_KEY`: chave privada SSH autorizada na EC2.

Variables recomendadas no GitHub:

- `EC2_APP_DIR`: caminho do projeto na EC2. Padrão usado pelo workflow: `/opt/lexflow/saas_juridico`.
- `PRODUCTION_URL`: URL pública, por exemplo `https://app.seudominio.com`.

Na EC2, o diretório precisa conter o repositório clonado e o arquivo `.env.ec2` real preenchido.

## Criar branches no GitHub

Opção 1: pelo GitHub Actions.

1. Publique estes arquivos na branch padrão do repositório.
2. Abra `Actions`.
3. Rode manualmente o workflow `Bootstrap Branches`.
4. Ele cria a branch `dev` a partir da `main`, se ela ainda não existir.

Opção 2: com Git instalado e autenticado:

```bash
git clone https://github.com/leeoscampos-hub/marlboro-adv.git
cd marlboro-adv
git checkout -B main
git push -u origin main
git checkout -B dev
git push -u origin dev
```

Depois, no GitHub, configure `main` como branch protegida exigindo pull request e status checks antes do merge.

## Proteção recomendada da `main`

No GitHub:

1. Settings.
2. Branches.
3. Add branch protection rule.
4. Branch name pattern: `main`.
5. Ativar:
   - Require a pull request before merging.
   - Require status checks to pass before merging.
   - Require branches to be up to date before merging.
   - Restrict who can push to matching branches, se desejar.
