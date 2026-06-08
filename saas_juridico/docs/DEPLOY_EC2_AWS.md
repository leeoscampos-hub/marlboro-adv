# Deploy em AWS EC2

Este guia prepara o LexFlow IA Juridica para rodar em uma instancia EC2 com Docker Compose, PostgreSQL interno e HTTPS via Caddy.

## Arquitetura recomendada para MVP

- EC2 Ubuntu LTS.
- Docker Engine + Docker Compose plugin.
- Security Group liberando somente:
  - `22/tcp` para o seu IP administrativo.
  - `80/tcp` para `0.0.0.0/0` e `::/0`.
  - `443/tcp` para `0.0.0.0/0` e `::/0`.
- Elastic IP associado a EC2.
- DNS `A` apontando o dominio para o Elastic IP.
- Caddy como reverse proxy e emissor automatico de certificado HTTPS.
- PostgreSQL em volume Docker local para MVP.

Para etapa comercial maior, o proximo salto natural e trocar o PostgreSQL local por Amazon RDS, usar S3 para documentos/anexos e CloudWatch para logs/metricas.

## Arquivos usados

- `docker-compose.ec2.yml`: stack de producao EC2.
- `deploy/Caddyfile`: proxy HTTPS.
- `.env.ec2.example`: modelo de variaveis de producao.
- `scripts/ec2_deploy.sh`: sobe/atualiza a stack na EC2.
- `scripts/ec2_backup.sh`: gera backup do PostgreSQL.

## Preparar EC2

1. Crie uma EC2 Ubuntu LTS.
2. Associe um Elastic IP.
3. Configure o Security Group conforme acima.
4. Aponte o dominio para o Elastic IP.
5. Instale Docker Engine seguindo a documentacao oficial da Docker para Ubuntu.

Resumo operacional apos instalar Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

## Enviar o projeto para a EC2

Opcao por `scp`:

```bash
scp -r ./saas_juridico ubuntu@SEU_IP_EC2:/opt/lexflow
```

Opcao por Git:

```bash
sudo mkdir -p /opt/lexflow
sudo chown -R $USER:$USER /opt/lexflow
git clone SEU_REPOSITORIO_GIT /opt/lexflow
```

## Configurar variaveis

Na EC2:

```bash
cd /opt/lexflow
cp .env.ec2.example .env.ec2
nano .env.ec2
```

Obrigatorio ajustar:

```text
APP_DOMAIN=app.seudominio.com
ACME_EMAIL=seu-email@dominio.com
OPENAI_API_KEY=sua_chave
ENCRYPTION_PASSPHRASE=uma_chave_longa
POSTGRES_PASSWORD=uma_senha_longa
```

Gerar uma chave forte:

```bash
openssl rand -base64 32
```

Para teste sem dominio, use:

```text
APP_DOMAIN=:80
```

Nesse modo nao ha HTTPS automatico. Para WhatsApp/Instagram/Facebook webhooks e venda real, use dominio com HTTPS.

## Subir a aplicacao

```bash
cd /opt/lexflow
chmod +x scripts/ec2_deploy.sh scripts/ec2_backup.sh
./scripts/ec2_deploy.sh
```

Ou manualmente:

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up --build -d
```

## Validar

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml ps
curl -fsS https://app.seudominio.com/api/health
```

Retorno esperado:

```json
{"status":"ok","database":"postgres"}
```

Login demo inicial:

```text
admin@lexflow.local
admin123
```

Troque/crie usuarios reais antes de disponibilizar para clientes.

## Operacao

Logs:

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml logs -f app
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml logs -f caddy
```

Atualizar:

```bash
git pull
./scripts/ec2_deploy.sh
```

Parar:

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml down
```

Backup:

```bash
./scripts/ec2_backup.sh
```

Restore:

```bash
cat backups/lexflow-YYYYMMDD-HHMMSS.sql | docker compose --env-file .env.ec2 -f docker-compose.ec2.yml exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

## Checklist antes de liberar para cliente

- Dominio definitivo apontando para Elastic IP.
- HTTPS ativo e renovando pelo Caddy.
- Security Group sem portas `5432` e `8765` publicas.
- SSH restrito ao IP do administrador.
- `.env.ec2` com senhas fortes e fora do Git.
- `ENCRYPTION_PASSPHRASE` definido e guardado em local seguro.
- Backup testado com restore.
- Usuarios demo trocados/removidos.
- Politica de atualizacao e backup diario definida.
- Monitoramento basico de CPU, disco e memoria.
- LGPD: termo, politica de privacidade, retencao e exclusao de dados.

## Observacoes importantes

- Os webhooks da Meta devem apontar para HTTPS publico:
  - `https://app.seudominio.com/webhooks/meta/1/whatsapp`
  - `https://app.seudominio.com/webhooks/meta/1/instagram`
  - `https://app.seudominio.com/webhooks/meta/1/facebook`
- A integracao dos tribunais depende de credenciais, OAB e tokens/seed TOTP quando aplicavel.
- Para escala comercial, prefira RDS, backups gerenciados, secrets fora de arquivo e pipeline CI/CD.

## Referencias oficiais

- Docker Engine no Ubuntu: https://docs.docker.com/engine/install/ubuntu/
- Security groups da AWS EC2: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html
- HTTPS automatico do Caddy: https://caddyserver.com/docs/automatic-https
