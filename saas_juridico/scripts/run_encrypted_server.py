#!/usr/bin/env python3
"""Decrypts the encrypted DB to a temp file, runs server.py, then re-encrypts on exit.

Usage: set ENCRYPTION_PASSPHRASE env var or pass --passphrase=... 
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from saas_juridico.db_crypto import decrypt_file, encrypt_file


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--passphrase", help="encryption passphrase", required=False)
    parser.add_argument("--encrypted-db", default="lexflow.db.enc")
    parser.add_argument("--encrypted-path", default=None)
    args = parser.parse_args()

    passphrase = args.passphrase or os.environ.get("ENCRYPTION_PASSPHRASE")
    if not passphrase:
        print("Provide passphrase via --passphrase or ENCRYPTION_PASSPHRASE env var")
        sys.exit(1)

    repo_root = Path(__file__).resolve().parent.parent
    enc_path = repo_root / (args.encrypted_db or "lexflow.db.enc")
    if args.encrypted_path:
        enc_path = Path(args.encrypted_path)

    if not enc_path.exists():
        print(f"Encrypted DB not found at {enc_path}. If you want to create a new encrypted DB, create a plain lexflow.db and run this script with --create (not implemented) or encrypt manually.")
        sys.exit(1)

    tmp_dir = tempfile.mkdtemp(prefix="lexflow_decrypted_")
    tmp_db = Path(tmp_dir) / "lexflow.db"
    print(f"Decrypting {enc_path} -> {tmp_db}")
    err = decrypt_file(enc_path, tmp_db, passphrase)
    if err:
        print("Decryption failed:", err)
        shutil.rmtree(tmp_dir)
        sys.exit(1)

    # Set env to point server to the decrypted DB
    env = os.environ.copy()
    env["DECRYPTED_DB_PATH"] = str(tmp_db)

    # Run server
    try:
        code = subprocess.call([sys.executable, str(repo_root / "server.py")], env=env)
    finally:
        # Do not overwrite existing encrypted file unless FORCE_ENCRYPTION is set
        try:
            if enc_path.exists() and not os.environ.get("FORCE_ENCRYPTION"):
                print(f"Encrypted file {enc_path} already exists; skipping re-encryption to avoid overwrite. Set FORCE_ENCRYPTION=1 to force overwrite.")
            else:
                print("Encrypting DB back to", enc_path)
                encrypt_file(tmp_db, enc_path, passphrase)
        except Exception as e:
            print("Error during re-encryption:", e)
        finally:
            shutil.rmtree(tmp_dir)
    sys.exit(code)


if __name__ == "__main__":
    main()
