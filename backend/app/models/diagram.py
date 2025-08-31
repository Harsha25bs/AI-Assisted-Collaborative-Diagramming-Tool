from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Diagram(Base):
    __tablename__ = "diagrams"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    data = Column(JSON, nullable=False)  # Canvas data, shapes, connections
    thumbnail = Column(Text)  # Base64 encoded thumbnail
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="diagrams")
    collaboration_sessions = relationship("CollaborationSession", back_populates="diagram")
    
    def __repr__(self):
        return f"<Diagram(id={self.id}, title='{self.title}', owner_id={self.owner_id})>"
