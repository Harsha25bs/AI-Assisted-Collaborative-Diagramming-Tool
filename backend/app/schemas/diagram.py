from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class DiagramBase(BaseModel):
    title: str
    description: Optional[str] = None
    data: Dict[str, Any]  # Canvas data, shapes, connections
    is_public: bool = False

class DiagramCreate(DiagramBase):
    pass

class DiagramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None

class DiagramResponse(DiagramBase):
    id: int
    thumbnail: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

