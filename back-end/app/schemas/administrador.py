from pydantic import BaseModel, EmailStr


class AdministradorBase(BaseModel):
    nome: str
    email: EmailStr


class AdministradorCreate(AdministradorBase):
    senha: str


class Administrador(AdministradorBase):
    id: int

    model_config = {
        "from_attributes": True
    }
