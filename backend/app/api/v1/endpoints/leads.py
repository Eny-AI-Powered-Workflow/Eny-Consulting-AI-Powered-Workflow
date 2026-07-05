# /home/obed/Documents/Eny_consulting/backend/app/api/v1/endpoints/leads.py
from fastapi import APIRouter, Depends

from app.api.deps import require_permission
from app.schemas.auth import UserContext
from app.services.ghl_service import ghl_client

router = APIRouter()


@router.get("")
async def list_leads(user: UserContext = Depends(require_permission("leads:read"))):
    """Pulls contacts from GoHighLevel. This is a read-through proxy, not a
    local copy of GHL's data -- GHL stays the system of record.
    """
    return await ghl_client.get_contacts()
