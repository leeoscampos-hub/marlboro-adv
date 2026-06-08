#!/usr/bin/env python3
import os
import sys
import tempfile
from pathlib import Path

try:
    from db_crypto import encrypt_file, decrypt_file
    from field_crypto import encrypt_str, decrypt_str
except Exception:
    # when executed as module
    from saas_juridico.db_crypto import encrypt_file, decrypt_file
    from saas_juridico.field_crypto import encrypt_str, decrypt_str


def main():
    repo = Path(__file__).resolve().parent.parent
    src = repo / "lexflow.db"
    enc = repo / "lexflow.db.enc"
    if not src.exists():
        print("lexflow.db not found; cannot validate file encryption.")
        sys.exit(2)

    passphrase = os.environ.get("ENCRYPTION_PASSPHRASE") or "test-passphrase"

    # encrypt
    try:
        encrypt_file(src, enc, passphrase)
        print(f"Encrypted {src} -> {enc}")
    except Exception as e:
        print("Encryption failed:", e)
        sys.exit(3)

    # decrypt to tmp and compare
    tmpdir = tempfile.mkdtemp(prefix="lexflow_test_")
    tmpdb = Path(tmpdir) / "lexflow.db"
    err = decrypt_file(enc, tmpdb, passphrase)
    if err:
        print("Decryption failed:", err)
        sys.exit(4)
    # compare bytes
    a = src.read_bytes()
    b = tmpdb.read_bytes()
    if a == b:
        print("File roundtrip OK: decrypted file equals original")
    else:
        print("File roundtrip MISMATCH")
        sys.exit(5)

    # field crypto test
    sample = "Cliente: João da Silva, email: joao@example.com"
    token = encrypt_str(sample, passphrase)
    recovered = decrypt_str(token, passphrase)
    if recovered == sample:
        print("Field encrypt/decrypt OK")
    else:
        print("Field encrypt/decrypt MISMATCH")
        sys.exit(6)

    print("VALIDATION_OK")


if __name__ == '__main__':
    main()
