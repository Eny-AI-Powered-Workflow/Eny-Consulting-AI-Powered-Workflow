# /home/obed/Documents/Eny_consulting/backend/app/core/security.py
from jose import jwt, JWTError

from app.core.config import settings


def decode_supabase_token(token: str) -> dict:
    """Verify and decode a Supabase-issued JWT (HS256)."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
    return payload
