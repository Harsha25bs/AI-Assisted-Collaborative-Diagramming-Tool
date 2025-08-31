from pydantic import BaseModel
from typing import Dict, Any, List

class AICleanRequest(BaseModel):
    diagram_id: int
    diagram_data: Dict[str, Any]
    cleaning_options: Dict[str, Any] = {}

class AICleanResponse(BaseModel):
    success: bool
    cleaned_data: Dict[str, Any]
    message: str
    processing_time_ms: int
    improvements: List[str] = []

