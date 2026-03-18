from sqlalchemy.orm import Session
from app import models, schemas

def criar_trilha(db: Session, trilha: schemas.TrilhaCreate):
    db_trilha = models.Trilha(**trilha.dict())
    db.add(db_trilha)
    db.commit()
    db.refresh(db_trilha)
    return db_trilha

def listar_trilhas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Trilha).offset(skip).limit(limit).all()

def buscar_trilha(db: Session, trilha_id: int):
    return db.query(models.Trilha).filter(models.Trilha.id == trilha_id).first()

def atualizar_trilha(db: Session, trilha_id: int, trilha: schemas.TrilhaCreate):
    db_trilha = db.query(models.Trilha).filter(models.Trilha.id == trilha_id).first()
    if db_trilha:
        for key, value in trilha.dict().items():
            setattr(db_trilha, key, value)
        db.commit()
        db.refresh(db_trilha)
    return db_trilha

def deletar_trilha(db: Session, trilha_id: int):
    db_trilha = db.query(models.Trilha).filter(models.Trilha.id == trilha_id).first()
    if db_trilha:
        db.delete(db_trilha)
        db.commit()
    return db_trilha
