# /home/obed/Documents/Eny_consulting/backend/app/services/n8n_service.py
import httpx

from app.core.config import settings


class N8NClient:
    """Calls n8n webhook-triggered workflows. n8n handles the multi-step
    automation; this client just fires the trigger and returns the result.
    """

    def __init__(self) -> None:
        self.base_url = settings.N8N_BASE_URL
        self.headers = {"Content-Type": "application/json"}
        if settings.N8N_API_KEY:
            self.headers["X-N8N-API-KEY"] = settings.N8N_API_KEY

    async def trigger_workflow(self, workflow_name: str, data: dict) -> dict:
        async with httpx.AsyncClient(base_url=self.base_url, headers=self.headers) as client:
            resp = await client.post(f"/webhook/{workflow_name}", json=data)
            resp.raise_for_status()
            return resp.json()


n8n_client = N8NClient()
