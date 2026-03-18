from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.biodiversidade import Biodiversidade as BioModel
from app.models.parque import Parque as ParqueModel
from app.schemas.biodiversidade import Biodiversidade, BiodiversidadeCreate
from app.auth import get_current_user

router = APIRouter(
    prefix="/biodiversidades",
    tags=["Biodiversidades"]
)

@router.post("/", response_model=Biodiversidade)
def criar_biodiversidade(
    bio: BiodiversidadeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    parque = db.query(ParqueModel).filter(ParqueModel.id == bio.parque_id).first()
    if not parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")

    db_bio = BioModel(**bio.dict())
    db.add(db_bio)
    db.commit()
    db.refresh(db_bio)
    return db_bio

@router.get("/", response_model=list[Biodiversidade])
def listar_biodiversidades(db: Session = Depends(get_db)):
    return db.query(BioModel).all()

@router.get("/{bio_id}", response_model=Biodiversidade)
def buscar_biodiversidade(bio_id: int, db: Session = Depends(get_db)):
    bio = db.query(BioModel).filter(BioModel.id == bio_id).first()
    if not bio:
        raise HTTPException(status_code=404, detail="Biodiversidade não encontrada")
    return bio

@router.put("/{bio_id}", response_model=Biodiversidade)
def atualizar_biodiversidade(
    bio_id: int,
    bio: BiodiversidadeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_bio = db.query(BioModel).filter(BioModel.id == bio_id).first()
    if not db_bio:
        raise HTTPException(status_code=404, detail="Biodiversidade não encontrada")

    for key, value in bio.dict().items():
        setattr(db_bio, key, value)

    db.commit()
    db.refresh(db_bio)
    return db_bio

@router.delete("/{bio_id}")
def deletar_biodiversidade(
    bio_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_bio = db.query(BioModel).filter(BioModel.id == bio_id).first()
    if not db_bio:
        raise HTTPException(status_code=404, detail="Biodiversidade não encontrada")

    db.delete(db_bio)
    db.commit()
    return {"detail": "Biodiversidade deletada com sucesso"}
