from pydantic import BaseModel
from datetime import date

class EventoBase(BaseModel):
    nome: str
    descricao: str
    data: date
    parque_id: int

class EventoCreate(EventoBase):
    pass

class Evento(EventoBase):
    id: int

    class Config:
        from_attributes = True 
