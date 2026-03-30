from sqlalchemy import Column, Integer, String, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Evento(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data = Column(Date)
    descricao = Column(String)
    imagens = Column(JSON, default=list)

    parque_id = Column(Integer, ForeignKey("parques.id"))
    parque = relationship("Parque", back_populates="eventos")
