from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.parque import Parque as ParqueModel
from app.schemas import Parque, ParqueCreate
from app.auth import verificar_token



from app.auth import verificar_token 

router = APIRouter(
    prefix="/parques",
    tags=["Parques"]
)


@router.post("/", response_model=Parque)
def criar_parque(parque: ParqueCreate, db: Session = Depends(get_db), usuario: str = Depends(verificar_token)):
    db_parque = ParqueModel(**parque.dict())
    db.add(db_parque)
    db.commit()
    db.refresh(db_parque)
    return db_parque


@router.get("/", response_model=list[Parque])
def listar_parques(db: Session = Depends(get_db)):
    return db.query(ParqueModel).all()


@router.get("/{parque_id}", response_model=Parque)
def buscar_parque(parque_id: int, db: Session = Depends(get_db)):
    parque = db.query(ParqueModel).filter(ParqueModel.id == parque_id).first()
    if not parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")
    return parque


@router.put("/{parque_id}", response_model=Parque)
def atualizar_parque(parque_id: int, parque: ParqueCreate, db: Session = Depends(get_db), usuario: str = Depends(verificar_token)):
    db_parque = db.query(ParqueModel).filter(ParqueModel.id == parque_id).first()
    if not db_parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")

    for key, value in parque.dict().items():
        setattr(db_parque, key, value)

    db.commit()
    db.refresh(db_parque)
    return db_parque


@router.delete("/{parque_id}")
def deletar_parque(parque_id: int, db: Session = Depends(get_db), usuario: str = Depends(verificar_token)):
    db_parque = db.query(ParqueModel).filter(ParqueModel.id == parque_id).first()
    if not db_parque:
        raise HTTPException(status_code=404, detail="Parque não encontrado")

    db.delete(db_parque)
    db.commit()
    return {"detail": "Parque deletado com sucesso"}
