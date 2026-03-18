from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal, engine
from app import models
from app.auth import gerar_hash_senha

# Inicializa as tabelas
models.Base.metadata.create_all(bind=engine)

def popular_banco():
    db: Session = SessionLocal()
    try:
        print("🧹 Limpando dados antigos...")
        db.query(models.Trilha).delete()
        db.query(models.Evento).delete()
        db.query(models.Biodiversidade).delete()
        db.query(models.Parque).delete()
        db.query(models.Administrador).delete()
        db.commit()

        # 1. PARQUES (Mantidos conforme solicitado)
        p1 = models.Parque(nome="Parque Nacional da Serra dos Órgãos", localizacao="Soberbo", descricao="Sede Teresópolis")
        p2 = models.Parque(nome="Parque Estadual dos Três Picos", localizacao="Vale dos Deuses", descricao="Sede Salinas")
        p3 = models.Parque(nome="Parque Natural Municipal Montanhas de Teresópolis", localizacao="Santa Rita", descricao="Sede Tartaruga")
        
        db.add_all([p1, p2, p3])
        db.flush() 

        # 2. EVENTOS (Atualizado com os faltantes)
        eventos = [
            # Originais
            models.Evento(nome="ATM 2026", data=date(2026, 5, 15), descricao="Abertura Temporada", parque_id=p1.id),
            models.Evento(nome="YVY Festival", data=date(2026, 5, 15), descricao="Cinema Ambiental", parque_id=p1.id),
            models.Evento(nome="Mutirão Salinas", data=date(2026, 5, 1), descricao="Manutenção", parque_id=p2.id),
            models.Evento(nome="Yoga na Montanha", data=date(2026, 3, 20), descricao="Prática Zen", parque_id=p3.id),
            # Novos Faltantes
            models.Evento(nome="Curso de Educação Ambiental", data=date(2026, 3, 16), descricao="Foco em preservação da Mata Atlântica.", parque_id=p1.id),
            models.Evento(nome="Oficina de Mínimo Impacto", data=date(2026, 6, 1), descricao="Boas práticas e segurança na montanha.", parque_id=p1.id),
            models.Evento(nome="Workshop de Aves", data=date(2026, 4, 10), descricao="Saída guiada para registro de espécies.", parque_id=p2.id),
            models.Evento(nome="Encontro de Escaladores", data=date(2026, 6, 20), descricao="Evento técnico no Vale dos Deuses.", parque_id=p2.id),
            models.Evento(nome="Pedal nos Três Picos", data=date(2026, 7, 1), descricao="Roteiro de cicloturismo.", parque_id=p2.id),
            models.Evento(nome="Rapel na Tartaruga", data=date(2026, 3, 28), descricao="Atividade guiada técnica com foco em SST.", parque_id=p3.id),
            models.Evento(nome="Labirinto Verde", data=date(2026, 4, 12), descricao="Educação ambiental para famílias.", parque_id=p3.id),
            models.Evento(nome="Piquenique Ecológico", data=date(2026, 5, 1), descricao="Integração e lazer na natureza.", parque_id=p3.id),
        ]

        # 3. BIODIVERSIDADE (Atualizado com os faltantes)
        bios = [
            # Originais
            models.Biodiversidade(especie="Onça-parda", tipo="Fauna", descricao="Topo da cadeia", parque_id=p1.id),
            models.Biodiversidade(especie="Lobo-guará", tipo="Fauna", descricao="Áreas de transição", parque_id=p2.id),
            models.Biodiversidade(especie="Tucano", tipo="Fauna", descricao="Comum nas trilhas", parque_id=p3.id),
            # Novos Faltantes
            models.Biodiversidade(especie="Muriqui-do-sul", tipo="Fauna", descricao="Maior primata das Américas, ameaçado.", parque_id=p1.id),
            models.Biodiversidade(especie="Palmito-Juçara", tipo="Flora", descricao="Árvore nativa essencial para a fauna.", parque_id=p1.id),
            models.Biodiversidade(especie="Orquídea Laelia", tipo="Flora", descricao="Espécie de altitude dos campos rupestres.", parque_id=p1.id),
            models.Biodiversidade(especie="Gavião-pega-macaco", tipo="Fauna", descricao="Rapina majestosa de matas preservadas.", parque_id=p2.id),
            models.Biodiversidade(especie="Araucária", tipo="Flora", descricao="Pinheiro brasileiro de áreas elevadas.", parque_id=p2.id),
            models.Biodiversidade(especie="Jequitibá-rosa", tipo="Flora", descricao="Árvore gigante secular da Mata Atlântica.", parque_id=p2.id),
            models.Biodiversidade(especie="Caxinguelê", tipo="Fauna", descricao="Pequeno esquilo ágil das copas das árvores.", parque_id=p3.id),
            models.Biodiversidade(especie="Bromélia", tipo="Flora", descricao="Planta epífita que cria microecossistemas.", parque_id=p3.id),
            models.Biodiversidade(especie="Rã-de-corredeira", tipo="Fauna", descricao="Anfíbio típico de riachos limpos.", parque_id=p3.id),
        ]

        # 4. TRILHAS (Atualizado com os faltantes)
        trilhas = [
            # Originais
            models.Trilha(nome="Pedra do Sino", dificuldade="Pesada", distancia=22.0, parque_id=p1.id),
            models.Trilha(nome="Vale dos Deuses", dificuldade="Leve", distancia=2.0, parque_id=p2.id),
            models.Trilha(nome="Pedra da Tartaruga", dificuldade="Fácil", distancia=0.65, parque_id=p3.id),
            # Novos Faltantes
            models.Trilha(nome="Travessia Petrópolis-Teresópolis", dificuldade="Pesada", distancia=30.0, parque_id=p1.id),
            models.Trilha(nome="Trilha Suspensa", dificuldade="Leve", distancia=1.3, parque_id=p1.id),
            models.Trilha(nome="Cartão Postal", dificuldade="Moderada", distancia=1.2, parque_id=p1.id),
            models.Trilha(nome="Torres de Bonsucesso", dificuldade="Pesada", distancia=7.0, parque_id=p2.id),
            models.Trilha(nome="Pico do Urubu", dificuldade="Moderada", distancia=5.0, parque_id=p2.id),
            models.Trilha(nome="Cabeça de Dragão", dificuldade="Moderada", distancia=12.0, parque_id=p2.id),
            models.Trilha(nome="Pedra do Camelo", dificuldade="Moderada", distancia=1.5, parque_id=p3.id),
            models.Trilha(nome="Trilha da Pedra Alpina", dificuldade="Fácil", distancia=1.2, parque_id=p3.id),
            models.Trilha(nome="Trilha do Jacu", dificuldade="Leve", distancia=0.89, parque_id=p3.id),
        ]

        # 5. ADMINISTRADORES
        admins = [
            models.Administrador(nome="Michael Admin", email="admin@tereverde.com", senha=gerar_hash_senha("admin123")),
            models.Administrador(nome="Ana Silva", email="ana@gmail.com", senha=gerar_hash_senha("senha123")),
            models.Administrador(nome="Carlos Souza", email="carlos@gmail.com", senha=gerar_hash_senha("senha456"))
        ]

        # Adicionando TUDO ao banco
        db.add_all(eventos + bios + trilhas + admins)
        
        db.commit() 
        print("✅ SUCESSO TOTAL: Todos os novos dados e administradores foram salvos!")

    except Exception as e:
        print(f"❌ ERRO CRÍTICO: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    popular_banco()