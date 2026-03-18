from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.administrador import Administrador as AdminModel
from app.schemas.administrador import Administrador, AdministradorCreate
from app.auth import get_current_user

router = APIRouter(
    prefix="/administradores",
    tags=["Administradores"]
)

@router.post("/", response_model=Administrador)
def criar_administrador(
    admin: AdministradorCreate, 
    db: Session = Depends(get_db)
):
    db_admin = AdminModel(**admin.dict())
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

@router.get("/", response_model=list[Administrador])
def listar_administradores(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return db.query(AdminModel).all()

@router.get("/{admin_id}", response_model=Administrador)
def buscar_administrador(
    admin_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    admin = db.query(AdminModel).filter(AdminModel.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Administrador não encontrado")
    return admin

@router.put("/{admin_id}", response_model=Administrador)
def atualizar_administrador(
    admin_id: int, 
    admin: AdministradorCreate, 
    db: Session = Depends(get_db)
):
    db_admin = db.query(AdminModel).filter(AdminModel.id == admin_id).first()
    if not db_admin:
        raise HTTPException(status_code=404, detail="Administrador não encontrado")

    for key, value in admin.dict().items():
        setattr(db_admin, key, value)

    db.commit()
    db.refresh(db_admin)
    return db_admin

@router.delete("/{admin_id}")
def deletar_administrador(
    admin_id: int, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    db_admin = db.query(AdminModel).filter(AdminModel.id == admin_id).first()
    if not db_admin:
        raise HTTPException(status_code=404, detail="Administrador não encontrado")

    db.delete(db_admin)
    db.commit()
    return {"detail": "Administrador deletado com sucesso"}
