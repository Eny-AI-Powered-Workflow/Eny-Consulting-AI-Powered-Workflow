# /home/obed/Documents/Eny_consulting/backend/app/api/v1/endpoints/agents.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import require_permission
from app.schemas.auth import UserContext
from app.services.n8n_service import n8n_client

router = APIRouter()


class TriggerPayload(BaseModel):
    data: dict = {}


@router.post("/trigger/{workflow_name}")
async def trigger_agent(
    workflow_name: str,
    payload: TriggerPayload,
    user: UserContext = Depends(require_permission("agents:trigger")),
):
    """Fires an n8n workflow by name. n8n owns the multi-step automation logic;
    this endpoint only checks whether the caller is allowed to run it.
    """
    result = await n8n_client.trigger_workflow(workflow_name, payload.data)
    return {"workflow": workflow_name, "triggered_by": str(user.user_id), "result": result}
