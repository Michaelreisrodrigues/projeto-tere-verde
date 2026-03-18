from sqlalchemy.orm import Session
from app import models, schemas

def criar_biodiversidade(db: Session, biodiv: schemas.BiodiversidadeCreate):
    db_biodiv = models.Biodiversidade(**biodiv.dict())
    db.add(db_biodiv)
    db.commit()
    db.refresh(db_biodiv)
    return db_biodiv

def listar_biodiversidades(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Biodiversidade).offset(skip).limit(limit).all()

def buscar_biodiversidade(db: Session, biodiv_id: int):
    return db.query(models.Biodiversidade).filter(models.Biodiversidade.id == biodiv_id).first()

def atualizar_biodiversidade(db: Session, biodiv_id: int, biodiv: schemas.BiodiversidadeCreate):
    db_biodiv = db.query(models.Biodiversidade).filter(models.Biodiversidade.id == biodiv_id).first()
    if db_biodiv:
        for key, value in biodiv.dict().items():
            setattr(db_biodiv, key, value)
        db.commit()
        db.refresh(db_biodiv)
    return db_biodiv

def deletar_biodiversidade(db: Session, biodiv_id: int):
    db_biodiv = db.query(models.Biodiversidade).filter(models.Biodiversidade.id == biodiv_id).first()
    if db_biodiv:
        db.delete(db_biodiv)
        db.commit()
    return db_biodiv
