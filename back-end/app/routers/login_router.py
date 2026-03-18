from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.auth.auth import criar_token_dados, autenticar_usuario
from app.database import get_db
from datetime import timedelta

router = APIRouter(
    prefix="/login",
    tags=["Login"]
)

@router.post("/token")
def login_para_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_expira = timedelta(minutes=60)
    token = criar_token_dados(
        data={"sub": usuario.email}, 
        expires_delta=token_expira
    )

    return {"access_token": token, "token_type": "bearer"}
