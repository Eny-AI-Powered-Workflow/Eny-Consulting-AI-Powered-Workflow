# /home/obed/Documents/Eny_consulting/backend/app/api/v1/router.py
from fastapi import APIRouter

from app.api.v1.endpoints import agents, audit, auth, leads, pipeline

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(pipeline.router, prefix="/pipeline", tags=["pipeline"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])



# from fastapi import APIRouter

# # from app.api.v1.endpoints import agents, auth, leads

# # api_router = APIRouter()
# # api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# # api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
# # api_router.include_router(agents.router, prefix="/agents", tags=["agents"])

