from pydantic import BaseModel
from typing import Optional

class BiodiversidadeBase(BaseModel):
    especie: str
    tipo: Optional[str] = None
    descricao: Optional[str] = None
    parque_id: int

class BiodiversidadeCreate(BiodiversidadeBase):
    pass

class Biodiversidade(BiodiversidadeBase):
    id: int

    class Config:
        from_attributes = True  
