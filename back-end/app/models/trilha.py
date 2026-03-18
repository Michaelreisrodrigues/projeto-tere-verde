from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Trilha(Base):
    __tablename__ = "trilhas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    dificuldade = Column(String)
    distancia = Column(Float)

    parque_id = Column(Integer, ForeignKey("parques.id"))
    parque = relationship("Parque", back_populates="trilhas")
