# /home/obed/Documents/Eny_consulting/backend/app/api/deps.py
import uuid

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_supabase_token
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.role import Role
from app.models.user_role import UserRole
from app.schemas.auth import UserContext

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserContext:
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing credentials")

    try:
        payload = decode_supabase_token(token)
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc

    user_id = uuid.UUID(payload["sub"])

    roles = (
        db.execute(
            select(Role)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user_id)
        )
        .scalars()
        .all()
    )

    permissions = sorted({p.scope for role in roles for p in role.permissions})

    return UserContext(
        user_id=user_id,
        email=payload.get("email"),
        roles=[r.name for r in roles],
        permissions=permissions,
    )


def require_permission(scope: str):
    """Route dependency: 403s and logs if the caller's role lacks `scope`."""

    def checker(
        request: Request,
        user: UserContext = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> UserContext:
        granted = scope in user.permissions

        db.add(
            AuditLog(
                user_id=user.user_id,
                permission_scope=scope,
                granted=granted,
                path=request.url.path,
            )
        )
        db.commit()

        if not granted:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Missing permission: {scope}")

        return user

    return checker
