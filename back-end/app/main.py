from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware # 1. Importação necessária
from .database import engine, Base
from app.routers import parque, evento, administrador, biodiversidade, trilha
from app.routers.login_router import router as login_router

app = FastAPI(title="API Tere Verde")

# 2. CONFIGURAÇÃO DE CORS (Essencial para o Mobile e Web funcionarem)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite acesso de qualquer IP (celular/browser)
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os verbos (GET, POST, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

# Garante a criação das tabelas no SQLite
Base.metadata.create_all(bind=engine)

# 3. AJUSTE DO TOKEN URL (Deve apontar para a rota real de login)
# Como seu prefixo no login_router é "/login" e a rota é "/token", fica:
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")

# Inclusão dos roteadores
app.include_router(login_router)  
app.include_router(parque.router)
app.include_router(trilha.router)
app.include_router(evento.router)
app.include_router(biodiversidade.router)
app.include_router(administrador.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API Tere Verde - O servidor está online!"}

@app.get("/token-test")
def token_test(token: str = Depends(oauth2_scheme)):
    return {"msg": "Token válido!", "token": token}
