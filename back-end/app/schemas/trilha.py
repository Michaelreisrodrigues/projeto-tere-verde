from pydantic import BaseModel
from typing import Optional


class TrilhaBase(BaseModel):
    nome: str
    dificuldade: Optional[str] = None
    distancia: Optional[float] = None
    parque_id: int


class TrilhaCreate(TrilhaBase):
    pass


class Trilha(TrilhaBase):
    id: int

    model_config = {
        "from_attributes": True
    }
