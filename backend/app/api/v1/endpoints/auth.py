# /home/obed/Documents/Eny_consulting/backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.auth import UserContext

router = APIRouter()


@router.get("/me", response_model=UserContext)
def read_current_user(user: UserContext = Depends(get_current_user)):
    """Returns the logged-in user's roles and permissions.
    The frontend uses this to decide which dashboard modules to render.
    """
    return user
