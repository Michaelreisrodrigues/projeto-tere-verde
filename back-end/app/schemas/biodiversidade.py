from pydantic import BaseModel
from typing import Optional, List


class BiodiversidadeBase(BaseModel):
    especie: str
    tipo: Optional[str] = None
    descricao: Optional[str] = None
    parque_id: int
    imagens: Optional[List[str]] = None


class BiodiversidadeCreate(BiodiversidadeBase):
    pass


class Biodiversidade(BiodiversidadeBase):
    id: int

    class Config:
        from_attributes = True
