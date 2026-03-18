from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Parque(Base):
    __tablename__ = "parques"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True, nullable=False)
    localizacao = Column(String, nullable=False)
    descricao = Column(String)

    trilhas = relationship("Trilha", back_populates="parque")
    eventos = relationship("Evento", back_populates="parque")
    biodiversidades = relationship("Biodiversidade", back_populates="parque")
