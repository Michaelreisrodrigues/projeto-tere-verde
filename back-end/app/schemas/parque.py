from pydantic import BaseModel
from typing import List, Optional


class ParqueBase(BaseModel):
    nome: str
    localizacao: str
    descricao: Optional[str] = None
    imagens: Optional[List[str]] = None


class ParqueCreate(ParqueBase):
    pass


class Parque(ParqueBase):
    id: int

    class Config:
        from_attributes = True
