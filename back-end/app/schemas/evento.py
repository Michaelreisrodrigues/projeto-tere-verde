from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class EventoBase(BaseModel):
    nome: str
    descricao: str
    data: date
    parque_id: int
    imagens: Optional[List[str]] = None


class EventoCreate(EventoBase):
    pass


class Evento(EventoBase):
    id: int

    class Config:
        from_attributes = True
