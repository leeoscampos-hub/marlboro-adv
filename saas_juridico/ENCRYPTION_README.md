# Criptografia (File-level e Field-level)

Este documento descreve como usar as rotinas de criptografia adicionadas ao projeto.

1) Dependências

```powershell
cd saas_juridico
python -m pip install -r requirements.txt
```

2) Validação rápida (local)

```powershell
$env:ENCRYPTION_PASSPHRASE = "SUA_SENHA_FORTE"
python .\scripts\validate_encryption_and_field_crypto.py
# saída esperada: VALIDATION_OK
```

3) Fluxo completo (migração + encriptação automática)

```powershell
$env:ENCRYPTION_PASSPHRASE = "SUA_SENHA_FORTE"
$env:USE_DB_ENCRYPTION = "1"
pwsh .\scripts\run_full_local.ps1
```

Por padrão, se `lexflow.db.enc` já existir, os scripts **não** sobrescrevem o arquivo para evitar perda acidental. Para forçar sobrescrita, defina `FORCE_ENCRYPTION=1`.

4) Execução segura do servidor

Use `scripts/run_encrypted_server.py` para executar o servidor a partir de um arquivo `lexflow.db.enc` existente;
o runner descriptografa para um arquivo temporário, exporta `DECRYPTED_DB_PATH` e executa `server.py`.

```powershell
python .\scripts\run_encrypted_server.py --passphrase "SUA_SENHA"
```

5) Notas de segurança

- A criptografia de arquivo protege o banco em repouso; quando o servidor roda, um arquivo temporário descriptografado existe no disco. Para produção, prefira soluções de banco com encryption-at-rest gerenciado.
- A criptografia por campo é aplicada nas colunas listadas em `_SENSITIVE_COLUMNS` no `server.py`. Ajuste conforme sua política de dados.
