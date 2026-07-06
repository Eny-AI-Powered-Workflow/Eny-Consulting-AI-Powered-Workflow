# /home/obed/Documents/Eny_consulting/backend/app/api/v1/endpoints/pipeline.py
from fastapi import APIRouter, Depends

from app.api.deps import require_permission
from app.services.ghl_service import ghl_client

router = APIRouter()


@router.get("")
async def read_pipeline(user=Depends(require_permission("pipeline:read"))):
    """Returns the current pipeline stages from GoHighLevel (or a mock fixture)."""
    return await ghl_client.get_pipeline()
