from sqlalchemy.orm import Session
from app import models, schemas

def create_administrador(db: Session, administrador: schemas.AdministradorCreate):
    db_administrador = models.Administrador(**administrador.dict())
    db.add(db_administrador)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador

def get_administradores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Administrador).offset(skip).limit(limit).all()

def get_administrador_by_id(db: Session, administrador_id: int):
    return db.query(models.Administrador).filter(models.Administrador.id == administrador_id).first()

def update_administrador(db: Session, administrador_id: int, administrador: schemas.AdministradorCreate):
    db_administrador = db.query(models.Administrador).filter(models.Administrador.id == administrador_id).first()
    if db_administrador is None:
        return None
    for key, value in administrador.dict().items():
        setattr(db_administrador, key, value)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador

def delete_administrador(db: Session, administrador_id: int):
    db_administrador = db.query(models.Administrador).filter(models.Administrador.id == administrador_id).first()
    if db_administrador is None:
        return None
    db.delete(db_administrador)
    db.commit()
    return db_administrador
