from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class CollaborationSession(Base):
    __tablename__ = "collaboration_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    diagram_id = Column(Integer, ForeignKey("diagrams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True))
    
    # Relationships
    diagram = relationship("Diagram", back_populates="collaboration_sessions")
    user = relationship("User", back_populates="collaboration_sessions")
    
    def __repr__(self):
        return f"<CollaborationSession(id={self.id}, session_id='{self.session_id}', user_id={self.user_id})>"
