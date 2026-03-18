from app.database import engine, Base
from app.models import parque, trilha, evento, biodiversidade, administrador

print("Criando o banco de dados...")

Base.metadata.create_all(bind=engine)

print("Banco de dados criado com sucesso!")
