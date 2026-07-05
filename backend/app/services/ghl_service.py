# /home/obed/Documents/Eny_consulting/backend/app/services/ghl_service.py
import httpx

from app.core.config import settings

# Used only when GHL_API_KEY is unset, so the rest of the platform (RBAC,
# audit logging, dashboard rendering) can be tested end to end before
# Phase 2 wires the live integration. Never used once real keys are set.
MOCK_CONTACTS = {
    "contacts": [
        {"id": "mock-1", "name": "Amaka Obi", "email": "amaka@example.com", "tags": ["hot-lead"]},
        {"id": "mock-2", "name": "Chidi Eze", "email": "chidi@example.com", "tags": ["webinar-attendee"]},
        {"id": "mock-3", "name": "Grace Adeyemi", "email": "grace@example.com", "tags": ["cold-lead"]},
    ],
    "meta": {"mock": True},
}

MOCK_PIPELINE = {
    "stages": [
        {"name": "New Lead", "count": 12, "value": 0},
        {"name": "Contacted", "count": 7, "value": 0},
        {"name": "Proposal Sent", "count": 3, "value": 4500},
        {"name": "Closed Won", "count": 2, "value": 3200},
    ],
    "meta": {"mock": True},
}


class GHLClient:
    """Thin wrapper around the GoHighLevel (LeadConnector) API.
    GHL remains the system of record for contacts/pipeline -- this client
    only reads/writes through its API, it never duplicates its tables locally.
    """

    def __init__(self) -> None:
        self.base_url = settings.GHL_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {settings.GHL_API_KEY}",
            "Version": "2021-07-28",
        }

    async def get_contacts(self, limit: int = 20) -> dict:
        if not settings.GHL_API_KEY:
            return MOCK_CONTACTS

        async with httpx.AsyncClient(base_url=self.base_url, headers=self.headers) as client:
            resp = await client.get(
                "/contacts/",
                params={"locationId": settings.GHL_LOCATION_ID, "limit": limit},
            )
            resp.raise_for_status()
            return resp.json()

    async def tag_contact(self, contact_id: str, tags: list[str]) -> dict:
        if not settings.GHL_API_KEY:
            return {"contact_id": contact_id, "tags": tags, "meta": {"mock": True}}

        async with httpx.AsyncClient(base_url=self.base_url, headers=self.headers) as client:
            resp = await client.post(f"/contacts/{contact_id}/tags", json={"tags": tags})
            resp.raise_for_status()
            return resp.json()

    async def get_pipeline(self) -> dict:
        if not settings.GHL_API_KEY:
            return MOCK_PIPELINE

        async with httpx.AsyncClient(base_url=self.base_url, headers=self.headers) as client:
            resp = await client.get(
                "/opportunities/pipelines",
                params={"locationId": settings.GHL_LOCATION_ID},
            )
            resp.raise_for_status()
            return resp.json()


ghl_client = GHLClient()