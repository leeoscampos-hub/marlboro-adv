import base64
import hashlib
import os
from typing import Optional

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ModuleNotFoundError:
    AESGCM = None

SALT_LEN = 16
NONCE_LEN = 12
PBKDF2_ITERS = 200_000


def _derive_key(passphrase: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", passphrase.encode("utf-8"), salt, PBKDF2_ITERS, dklen=32)


def encrypt_str(plaintext: str, passphrase: Optional[str] = None) -> str:
    if plaintext is None:
        return None
    if AESGCM is None:
        return plaintext
    if passphrase is None:
        passphrase = os.environ.get("ENCRYPTION_PASSPHRASE")
    if not passphrase:
        return plaintext
    salt = os.urandom(SALT_LEN)
    key = _derive_key(passphrase, salt)
    aes = AESGCM(key)
    nonce = os.urandom(NONCE_LEN)
    ct = aes.encrypt(nonce, plaintext.encode("utf-8"), None)
    raw = salt + nonce + ct
    return base64.b64encode(raw).decode("ascii")


def decrypt_str(token: str, passphrase: Optional[str] = None) -> Optional[str]:
    if token is None:
        return None
    if AESGCM is None:
        return token
    if passphrase is None:
        passphrase = os.environ.get("ENCRYPTION_PASSPHRASE")
    if not passphrase:
        return token
    try:
        raw = base64.b64decode(token)
        salt = raw[:SALT_LEN]
        nonce = raw[SALT_LEN:SALT_LEN+NONCE_LEN]
        ct = raw[SALT_LEN+NONCE_LEN:]
        key = _derive_key(passphrase, salt)
        aes = AESGCM(key)
        pt = aes.decrypt(nonce, ct, None)
        return pt.decode("utf-8")
    except Exception:
        return token
