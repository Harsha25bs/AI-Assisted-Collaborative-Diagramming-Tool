from fastapi import APIRouter
from app.api.v1.endpoints import auth, diagrams, websocket, ai

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(diagrams.router, prefix="/diagrams", tags=["diagrams"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
