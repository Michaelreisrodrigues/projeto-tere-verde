from sqlalchemy.orm import Session
from app import models, schemas

def criar_evento(db: Session, evento: schemas.EventoCreate):
    db_evento = models.Evento(**evento.dict())
    db.add(db_evento)
    db.commit()
    db.refresh(db_evento)
    return db_evento

def listar_eventos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Evento).offset(skip).limit(limit).all()

def buscar_evento(db: Session, evento_id: int):
    return db.query(models.Evento).filter(models.Evento.id == evento_id).first()

def atualizar_evento(db: Session, evento_id: int, evento: schemas.EventoCreate):
    db_evento = db.query(models.Evento).filter(models.Evento.id == evento_id).first()
    if db_evento is None:
        return None
    for key, value in evento.dict().items():
        setattr(db_evento, key, value)
    db.commit()
    db.refresh(db_evento)
    return db_evento

def deletar_evento(db: Session, evento_id: int):
    db_evento = db.query(models.Evento).filter(models.Evento.id == evento_id).first()
    if db_evento is None:
        return None
    db.delete(db_evento)
    db.commit()
    return db_evento
