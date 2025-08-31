from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.diagram import Diagram
from app.schemas.diagram import DiagramCreate, DiagramUpdate, DiagramResponse
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=DiagramResponse)
async def create_diagram(
    diagram_data: DiagramCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new diagram"""
    diagram = Diagram(
        title=diagram_data.title,
        description=diagram_data.description,
        data=diagram_data.data,
        owner_id=current_user.id,
        is_public=diagram_data.is_public
    )
    
    db.add(diagram)
    db.commit()
    db.refresh(diagram)
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        data=diagram.data,
        thumbnail=diagram.thumbnail,
        owner_id=diagram.owner_id,
        is_public=diagram.is_public,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.get("/", response_model=List[DiagramResponse])
async def get_diagrams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get user's diagrams and public diagrams"""
    diagrams = db.query(Diagram).filter(
        (Diagram.owner_id == current_user.id) | (Diagram.is_public == True)
    ).offset(skip).limit(limit).all()
    
    return [
        DiagramResponse(
            id=d.id,
            title=d.title,
            description=d.description,
            data=d.data,
            thumbnail=d.thumbnail,
            owner_id=d.owner_id,
            is_public=d.is_public,
            created_at=d.created_at,
            updated_at=d.updated_at
        ) for d in diagrams
    ]

@router.get("/{diagram_id}", response_model=DiagramResponse)
async def get_diagram(
    diagram_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific diagram by ID"""
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    
    if not diagram.is_public and diagram.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        data=diagram.data,
        thumbnail=diagram.thumbnail,
        owner_id=diagram.owner_id,
        is_public=diagram.is_public,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.put("/{diagram_id}", response_model=DiagramResponse)
async def update_diagram(
    diagram_id: int,
    diagram_data: DiagramUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a diagram"""
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    
    if diagram.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    for field, value in diagram_data.dict(exclude_unset=True).items():
        setattr(diagram, field, value)
    
    db.commit()
    db.refresh(diagram)
    
    return DiagramResponse(
        id=diagram.id,
        title=diagram.title,
        description=diagram.description,
        data=diagram.data,
        thumbnail=diagram.thumbnail,
        owner_id=diagram.owner_id,
        is_public=diagram.is_public,
        created_at=diagram.created_at,
        updated_at=diagram.updated_at
    )

@router.delete("/{diagram_id}")
async def delete_diagram(
    diagram_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a diagram"""
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    
    if diagram.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(diagram)
    db.commit()
    
    return {"message": "Diagram deleted successfully"}
