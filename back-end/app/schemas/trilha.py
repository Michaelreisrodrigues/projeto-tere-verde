from pydantic import BaseModel
from typing import Optional, List


class TrilhaBase(BaseModel):
    nome: str
    dificuldade: Optional[str] = None
    distancia: Optional[float] = None
    parque_id: int
    imagens: Optional[List[str]] = None


class TrilhaCreate(TrilhaBase):
    pass


class Trilha(TrilhaBase):
    id: int

    class Config:
        from_attributes = True
