from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.trilha import Trilha as TrilhaModel
from app.models.parque import Parque as ParqueModel
from app.schemas import Trilha, TrilhaCreate
from app.auth import verificar_token


router = APIRouter(
    prefix="/trilhas",
    tags=["Trilhas"]
)


@router.post("/", response_model=Trilha)
def criar_trilha(trilha_dados: TrilhaCreate, db: Session = Depends(get_db)):
    parque = db.query(ParqueModel).filter(ParqueModel.id == trilha_dados.parque_id).first()
    if not parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")

    db_trilha = TrilhaModel(**trilha_dados.dict())
    db.add(db_trilha)
    db.commit()
    db.refresh(db_trilha)
    return db_trilha


@router.get("/", response_model=list[Trilha])
def listar_trilhas(db: Session = Depends(get_db)):
    return db.query(TrilhaModel).all()


@router.get("/{trilha_id}", response_model=Trilha)
def buscar_trilha(trilha_id: int, db: Session = Depends(get_db)):
    trilha = db.query(TrilhaModel).filter(TrilhaModel.id == trilha_id).first()
    if not trilha:
        raise HTTPException(status_code=404, detail="Trilha não encontrada")
    return trilha


@router.put("/{trilha_id}", response_model=Trilha)
def atualizar_trilha(trilha_id: int, trilha_dados: TrilhaCreate, db: Session = Depends(get_db)):
    db_trilha = db.query(TrilhaModel).filter(TrilhaModel.id == trilha_id).first()
    if not db_trilha:
        raise HTTPException(status_code=404, detail="Trilha não encontrada")

    for key, value in trilha_dados.dict().items():
        setattr(db_trilha, key, value)

    db.commit()
    db.refresh(db_trilha)
    return db_trilha


@router.delete("/{trilha_id}")
def deletar_trilha(trilha_id: int, db: Session = Depends(get_db)):
    db_trilha = db.query(TrilhaModel).filter(TrilhaModel.id == trilha_id).first()
    if not db_trilha:
        raise HTTPException(status_code=404, detail="Trilha não encontrada")

    db.delete(db_trilha)
    db.commit()
    return {"detail": "Trilha deletada com sucesso"}
