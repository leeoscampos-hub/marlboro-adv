This PR adds file-level AES-GCM encryption for the SQLite database (`db_crypto.py`),
application-level field encryption helpers (`field_crypto.py`) and integrates
transparent per-column encryption/decryption in `server.py` when `ENCRYPTION_PASSPHRASE`
is set.

It also includes:

- Runner script to execute the server against a decrypted temporary DB and re-encrypt on exit: `scripts/run_encrypted_server.py`
- Migration orchestration updates to optionally produce `lexflow.db.enc` after migration: `scripts/migrate_and_up.ps1`
- A validation script for file/field encryption: `scripts/validate_encryption_and_field_crypto.py`
- CI workflow to validate encryption and run a smoke server test: `.github/workflows/validate_encryption.yml`
- Docs: `saas_juridico/ENCRYPTION_README.md`
- Helper to create this PR: `scripts/create_pr.ps1`

Notes:
- By default the scripts will not overwrite an existing `lexflow.db.enc` unless `FORCE_ENCRYPTION=1` is set.
- For production, prefer database-level encryption (managed Postgres, disk encryption) and secret management.

Testing instructions are in `saas_juridico/ENCRYPTION_README.md`.
