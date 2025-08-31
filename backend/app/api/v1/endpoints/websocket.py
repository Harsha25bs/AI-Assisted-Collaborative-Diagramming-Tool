from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Dict, List
import json
import logging
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_connections: Dict[WebSocket, Dict] = {}

    async def connect(self, websocket: WebSocket, diagram_id: str, user: User):
        await websocket.accept()
        
        if diagram_id not in self.active_connections:
            self.active_connections[diagram_id] = []
        
        self.active_connections[diagram_id].append(websocket)
        self.user_connections[websocket] = {
            "user_id": user.id,
            "username": user.username,
            "diagram_id": diagram_id
        }
        
        # Notify others that user joined
        await self.broadcast_to_diagram(
            diagram_id,
            {
                "type": "user_joined",
                "user_id": user.id,
                "username": user.username
            },
            exclude_websocket=websocket
        )
        
        # Send current users in the diagram
        users_in_diagram = [
            {
                "user_id": conn["user_id"],
                "username": conn["username"]
            }
            for conn in self.user_connections.values()
            if conn["diagram_id"] == diagram_id
        ]
        
        await websocket.send_text(json.dumps({
            "type": "diagram_state",
            "users": users_in_diagram
        }))
        
        logger.info(f"User {user.username} joined diagram {diagram_id}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.user_connections:
            user_info = self.user_connections[websocket]
            diagram_id = user_info["diagram_id"]
            
            # Remove from active connections
            if diagram_id in self.active_connections:
                self.active_connections[diagram_id].remove(websocket)
                if not self.active_connections[diagram_id]:
                    del self.active_connections[diagram_id]
            
            # Notify others that user left
            self.broadcast_to_diagram_sync(
                diagram_id,
                {
                    "type": "user_left",
                    "user_id": user_info["user_id"],
                    "username": user_info["username"]
                },
                exclude_websocket=websocket
            )
            
            del self.user_connections[websocket]
            logger.info(f"User {user_info['username']} left diagram {diagram_id}")

    async def broadcast_to_diagram(self, diagram_id: str, message: dict, exclude_websocket: WebSocket = None):
        if diagram_id in self.active_connections:
            for connection in self.active_connections[diagram_id]:
                if connection != exclude_websocket:
                    try:
                        await connection.send_text(json.dumps(message))
                    except:
                        # Remove broken connection
                        self.disconnect(connection)

    def broadcast_to_diagram_sync(self, diagram_id: str, message: dict, exclude_websocket: WebSocket = None):
        if diagram_id in self.active_connections:
            for connection in self.active_connections[diagram_id]:
                if connection != exclude_websocket:
                    try:
                        connection.send_text(json.dumps(message))
                    except:
                        # Remove broken connection
                        self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/{diagram_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    diagram_id: str,
    token: str = None
):
    try:
        # Basic token validation (you can enhance this)
        if not token:
            await websocket.close(code=4001, reason="Token required")
            return
        
        # For now, accept all connections (implement proper auth later)
        user = {"id": 1, "username": "Anonymous"}  # Placeholder
        
        await manager.connect(websocket, diagram_id, user)
        
        try:
            while True:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message["type"] == "drawing_update":
                    # Broadcast drawing updates to other users
                    await manager.broadcast_to_diagram(
                        diagram_id,
                        {
                            "type": "drawing_update",
                            "data": message["data"],
                            "user_id": user["id"],
                            "username": user["username"]
                        },
                        exclude_websocket=websocket
                    )
                
                elif message["type"] == "cursor_move":
                    # Broadcast cursor position
                    await manager.broadcast_to_diagram(
                        diagram_id,
                        {
                            "type": "cursor_move",
                            "position": message["position"],
                            "user_id": user["id"],
                            "username": user["username"]
                        },
                        exclude_websocket=websocket
                    )
                
                elif message["type"] == "ping":
                    # Respond to ping
                    await websocket.send_text(json.dumps({"type": "pong"}))
                
        except WebSocketDisconnect:
            manager.disconnect(websocket)
            
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close(code=4000, reason="Internal error")
