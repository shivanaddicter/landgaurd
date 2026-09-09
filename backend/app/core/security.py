"""
Security and JWT Authentication Utility
"""
import hashlib
import hmac
import base64
import json
import time
from typing import Optional
from app.core.config import settings

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with salt."""
    salt = "slopeguard_salt_2026"
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return pwd_hash.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored hash."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta_seconds: Optional[int] = None) -> str:
    """Generate lightweight signed JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    now = int(time.time())
    exp = now + (expires_delta_seconds or (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60))
    payload.update({"iat": now, "exp": exp})
    
    encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signature_base = f"{encoded_header}.{encoded_payload}".encode()
    signature = hmac.new(settings.SECRET_KEY.encode(), signature_base, hashlib.sha256).digest()
    encoded_signature = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def decode_token(token: str) -> Optional[dict]:
    """Verify signature and decode JWT payload."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signature_base = f"{header_b64}.{payload_b64}".encode()
        expected_sig = hmac.new(settings.SECRET_KEY.encode(), signature_base, hashlib.sha256).digest()
        
        # Add padding back if necessary
        padding = "=" * (4 - (len(signature_b64) % 4)) if len(signature_b64) % 4 != 0 else ""
        actual_sig = base64.urlsafe_b64decode(f"{signature_b64}{padding}")
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_pad = "=" * (4 - (len(payload_b64) % 4)) if len(payload_b64) % 4 != 0 else ""
        payload_bytes = base64.urlsafe_b64decode(f"{payload_b64}{payload_pad}")
        payload = json.loads(payload_bytes.decode())
        
        if payload.get("exp", 0) < time.time():
            return None # Expired
            
        return payload
    except Exception:
        return None
