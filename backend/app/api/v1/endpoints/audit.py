# /home/obed/Documents/Eny_consulting/backend/app/api/v1/endpoints/audit.py
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.schemas.auth import UserContext

router = APIRouter()


class AuditEntry(BaseModel):
    permission_scope: str
    granted: bool
    path: str
    created_at: datetime


@router.get("/me", response_model=list[AuditEntry])
def my_recent_activity(
    limit: int = Query(10, le=50),
    user: UserContext = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns the caller's own recent audit trail. Uses get_current_user
    rather than require_permission -- same precedent as /auth/me -- because
    seeing your own access history needs no extra permission scope. CEOs
    additionally see everyone's via the RLS policy in the Supabase
    migration; this endpoint only ever returns the caller's own rows.
    """
    rows = (
        db.execute(
            select(AuditLog)
            .where(AuditLog.user_id == user.user_id)
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
        )
        .scalars()
        .all()
    )
    return rows