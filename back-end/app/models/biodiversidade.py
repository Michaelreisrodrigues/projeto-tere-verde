from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Biodiversidade(Base):
    __tablename__ = "biodiversidades"

    id = Column(Integer, primary_key=True, index=True)
    especie = Column(String, nullable=False)
    tipo = Column(String)  # flora, fauna
    descricao = Column(String)

    parque_id = Column(Integer, ForeignKey("parques.id"))
    parque = relationship("Parque", back_populates="biodiversidades")
