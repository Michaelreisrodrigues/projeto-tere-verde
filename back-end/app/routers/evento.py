from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.evento import Evento as EventoModel
from app.models.parque import Parque as ParqueModel
from app.schemas import Evento, EventoCreate
from app.auth import verificar_token  # seu dependency para auth

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"]
)


@router.post("/", response_model=Evento)
def criar_evento(
    evento: EventoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verificar_token),
):
    parque = db.query(ParqueModel).filter(ParqueModel.id == evento.parque_id).first()
    if not parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")

    db_evento = EventoModel(**evento.dict())
    db.add(db_evento)
    db.commit()
    db.refresh(db_evento)
    return db_evento


@router.get("/", response_model=List[Evento])
def listar_eventos(db: Session = Depends(get_db)):
    return db.query(EventoModel).all()


@router.get("/{evento_id}", response_model=Evento)
def buscar_evento(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(EventoModel).filter(EventoModel.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return evento


@router.put("/{evento_id}", response_model=Evento)
def atualizar_evento(
    evento_id: int,
    evento: EventoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verificar_token),
):
    db_evento = db.query(EventoModel).filter(EventoModel.id == evento_id).first()
    if not db_evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    for key, value in evento.dict().items():
        setattr(db_evento, key, value)

    db.commit()
    db.refresh(db_evento)
    return db_evento


@router.delete("/{evento_id}")
def deletar_evento(
    evento_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verificar_token),
):
    db_evento = db.query(EventoModel).filter(EventoModel.id == evento_id).first()
    if not db_evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    db.delete(db_evento)
    db.commit()
    return {"detail": "Evento deletado com sucesso"}
