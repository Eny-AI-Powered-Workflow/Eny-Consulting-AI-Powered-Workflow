# /home/obed/Documents/Eny_consulting/backend/app/schemas/auth.py
import uuid

from pydantic import BaseModel


class UserContext(BaseModel):
    user_id: uuid.UUID
    email: str | None = None
    roles: list[str] = []
    permissions: list[str] = []

class UserCheck():
    usr: uuid.getnode
    