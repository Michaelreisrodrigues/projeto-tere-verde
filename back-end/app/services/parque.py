from sqlalchemy.orm import Session
from app import models, schemas
from app.schemas import ParqueCreate, Parque


def criar_parque(db: Session, parque: schemas.ParqueCreate) -> models.Parque:
    db_parque = models.Parque(**parque.dict())
    db.add(db_parque)
    db.commit()
    db.refresh(db_parque)
    return db_parque

def listar_parques(db: Session, skip: int = 0, limit: int = 100) -> list[models.Parque]:
    return db.query(models.Parque).offset(skip).limit(limit).all()

def buscar_parque(db: Session, parque_id: int) -> models.Parque | None:
    return db.query(models.Parque).filter(models.Parque.id == parque_id).first()

def atualizar_parque(db: Session, parque_id: int, parque: schemas.ParqueCreate) -> models.Parque | None:
    db_parque = db.query(models.Parque).filter(models.Parque.id == parque_id).first()
    if db_parque:
        for key, value in parque.dict().items():
            setattr(db_parque, key, value)
        db.commit()
        db.refresh(db_parque)
    return db_parque

def deletar_parque(db: Session, parque_id: int) -> models.Parque | None:
    db_parque = db.query(models.Parque).filter(models.Parque.id == parque_id).first()
    if db_parque:
        db.delete(db_parque)
        db.commit()
    return db_parque
