# /home/obed/Documents/Eny_consulting/backend/app/models/permission.py
import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.role import role_permissions


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scope: Mapped[str] = mapped_column(String, unique=True, nullable=False)  # e.g. "leads:read"

    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
