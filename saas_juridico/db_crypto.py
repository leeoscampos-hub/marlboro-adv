import os
import hashlib
from pathlib import Path
from typing import Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


MAGIC = b"LFDB1"
SALT_LEN = 16
NONCE_LEN = 12
PBKDF2_ITERS = 200_000


def _derive_key(passphrase: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", passphrase.encode("utf-8"), salt, PBKDF2_ITERS, dklen=32)


def encrypt_file(input_path: str | Path, output_path: str | Path, passphrase: str) -> None:
    input_path = Path(input_path)
    output_path = Path(output_path)
    data = input_path.read_bytes()
    salt = os.urandom(SALT_LEN)
    key = _derive_key(passphrase, salt)
    aes = AESGCM(key)
    nonce = os.urandom(NONCE_LEN)
    ct = aes.encrypt(nonce, data, None)
    output_path.write_bytes(MAGIC + salt + nonce + ct)


def decrypt_file(input_path: str | Path, output_path: str | Path, passphrase: str) -> Optional[str]:
    inp = Path(input_path)
    data = inp.read_bytes()
    if not data.startswith(MAGIC):
        return "invalid format"
    offset = len(MAGIC)
    salt = data[offset : offset + SALT_LEN]
    offset += SALT_LEN
    nonce = data[offset : offset + NONCE_LEN]
    offset += NONCE_LEN
    ct = data[offset:]
    key = _derive_key(passphrase, salt)
    aes = AESGCM(key)
    try:
        pt = aes.decrypt(nonce, ct, None)
    except Exception as e:
        return str(e)
    Path(output_path).write_bytes(pt)
    return None
