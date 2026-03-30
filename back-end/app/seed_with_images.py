import requests
import base64
from io import BytesIO
from PIL import Image
from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal, engine
from app import models
from app.auth import gerar_hash_senha
import json

# URLs de imagens reais (usando Unsplash e outras fontes gratuitas)
IMAGENS = {
    # Parques
    "parque_serra_orgaos": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",  # Montanhas
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",  # Pico
    ],
    "parque_tres_picos": [
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800",  # Montanha
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800",  # Natureza
    ],
    "parque_montanhas_teresopolis": [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",  # Floresta
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",  # Lago
    ],
    
    # Trilhas - Serra dos Órgãos
    "pedra_sino": [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    ],
    "travessia_petropolis_teresopolis": [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    ],
    "trilha_suspensa": [
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    ],
    "cartao_postal": [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    ],
    
    # Trilhas - Três Picos
    "vale_deuses": [
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
    ],
    "torres_bonsucesso": [
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
    ],
    "pico_urubu": [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    ],
    "cabeca_dragao": [
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
        "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800",
    ],
    
    # Trilhas - Montanhas de Teresópolis
    "pedra_tartaruga": [
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
    ],
    "pedra_camelo": [
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    ],
    "pedra_alpina": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
    ],
    "trilha_jacu": [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    ],
    
    # Fauna
    "onca_parda": [
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800",
        "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800",
    ],
    "lobo_guara": [
        "https://images.unsplash.com/photo-1564166174579-284c61143a7c?w=800",
        "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800",
    ],
    "tucano": [
        "https://images.unsplash.com/photo-1552728089-57bdde30beb8?w=800",
        "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800",
    ],
    "muriqui": [
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800",
        "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800",
    ],
    "gaviao_pegamacaco": [
        "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800",
        "https://images.unsplash.com/photo-1549608276-5786777e6587?w=800",
    ],
    "caxinguele": [
        "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800",
        "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
    ],
    "ra_corredeira": [
        "https://images.unsplash.com/photo-1550948537-130a1ce83314?w=800",
    ],
    
    # Flora
    "palmito_jucara": [
        "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800",
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800",
    ],
    "orquidea_laelia": [
        "https://images.unsplash.com/photo-1566928404229-b7231894263a?w=800",
        "https://images.unsplash.com/photo-1555652699-1c47a495b1af?w=800",
    ],
    "araucaria": [
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
    ],
    "jequitiba_rosa": [
        "https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=800",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    ],
    "bromelia": [
        "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800",
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800",
    ],
}

def download_and_convert_to_base64(url):
    """Download imagem e converte para base64"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            # Abrir imagem com PIL
            img = Image.open(BytesIO(response.content))
            
            # Converter para RGB se necessário
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Redimensionar para largura máxima de 800px
            max_width = 800
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
            
            # Salvar em buffer
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=70)
            buffer.seek(0)
            
            # Converter para base64
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/jpeg;base64,{img_base64}"
    except Exception as e:
        print(f"Erro ao baixar {url}: {e}")
        return None

def popular_banco_com_imagens():
    db = SessionLocal()
    try:
        print("🧹 Limpando dados antigos...")
        db.query(models.Trilha).delete()
        db.query(models.Evento).delete()
        db.query(models.Biodiversidade).delete()
        db.query(models.Parque).delete()
        db.query(models.Administrador).delete()
        db.commit()

        print("📥 Baixando imagens...")
        
        # 1. PARQUES
        print("🏞️  Criando parques...")
        p1_imagens = []
        for url in IMAGENS["parque_serra_orgaos"]:
            img = download_and_convert_to_base64(url)
            if img:
                p1_imagens.append(img)
        
        p2_imagens = []
        for url in IMAGENS["parque_tres_picos"]:
            img = download_and_convert_to_base64(url)
            if img:
                p2_imagens.append(img)
        
        p3_imagens = []
        for url in IMAGENS["parque_montanhas_teresopolis"]:
            img = download_and_convert_to_base64(url)
            if img:
                p3_imagens.append(img)
        
        p1 = models.Parque(
            nome="Parque Nacional da Serra dos Órgãos",
            localizacao="Soberbo",
            descricao="Sede Teresópolis",
            imagens=p1_imagens if p1_imagens else None
        )
        p2 = models.Parque(
            nome="Parque Estadual dos Três Picos",
            localizacao="Vale dos Deuses",
            descricao="Sede Salinas",
            imagens=p2_imagens if p2_imagens else None
        )
        p3 = models.Parque(
            nome="Parque Natural Municipal Montanhas de Teresópolis",
            localizacao="Santa Rita",
            descricao="Sede Tartaruga",
            imagens=p3_imagens if p3_imagens else None
        )
        
        db.add_all([p1, p2, p3])
        db.flush()
        
        # 2. TRILHAS
        print("🥾 Criando trilhas...")
        trilhas_data = [
            # Serra dos Órgãos
            ("Pedra do Sino", "Pesada", 22.0, p1.id, "pedra_sino"),
            ("Travessia Petrópolis-Teresópolis", "Pesada", 30.0, p1.id, "travessia_petropolis_teresopolis"),
            ("Trilha Suspensa", "Leve", 1.3, p1.id, "trilha_suspensa"),
            ("Cartão Postal", "Moderada", 1.2, p1.id, "cartao_postal"),
            # Três Picos
            ("Vale dos Deuses", "Leve", 2.0, p2.id, "vale_deuses"),
            ("Torres de Bonsucesso", "Pesada", 7.0, p2.id, "torres_bonsucesso"),
            ("Pico do Urubu", "Moderada", 5.0, p2.id, "pico_urubu"),
            ("Cabeça de Dragão", "Moderada", 12.0, p2.id, "cabeca_dragao"),
            # Montanhas de Teresópolis
            ("Pedra da Tartaruga", "Fácil", 0.65, p3.id, "pedra_tartaruga"),
            ("Pedra do Camelo", "Moderada", 1.5, p3.id, "pedra_camelo"),
            ("Trilha da Pedra Alpina", "Fácil", 1.2, p3.id, "pedra_alpina"),
            ("Trilha do Jacu", "Leve", 0.89, p3.id, "trilha_jacu"),
        ]
        
        trilhas = []
        for nome, dificuldade, distancia, parque_id, img_key in trilhas_data:
            imagens = []
            if img_key in IMAGENS:
                for url in IMAGENS[img_key]:
                    img = download_and_convert_to_base64(url)
                    if img:
                        imagens.append(img)
            
            trilha = models.Trilha(
                nome=nome,
                dificuldade=dificuldade,
                distancia=distancia,
                parque_id=parque_id,
                imagens=imagens if imagens else None
            )
            trilhas.append(trilha)
        
        db.add_all(trilhas)
        
        # 3. BIODIVERSIDADE
        print("🌿 Criando registros de biodiversidade...")
        biodiversidade_data = [
            # Fauna
            ("Onça-parda", "Fauna", "Topo da cadeia", p1.id, "onca_parda"),
            ("Muriqui-do-sul", "Fauna", "Maior primata das Américas, ameaçado.", p1.id, "muriqui"),
            ("Lobo-guará", "Fauna", "Áreas de transição", p2.id, "lobo_guara"),
            ("Gavião-pega-macaco", "Fauna", "Rapina majestosa de matas preservadas.", p2.id, "gaviao_pegamacaco"),
            ("Tucano", "Fauna", "Comum nas trilhas", p3.id, "tucano"),
            ("Caxinguelê", "Fauna", "Pequeno esquilo ágil das copas das árvores.", p3.id, "caxinguele"),
            ("Rã-de-corredeira", "Fauna", "Anfíbio típico de riachos limpos.", p3.id, "ra_corredeira"),
            # Flora
            ("Palmito-Juçara", "Flora", "Árvore nativa essencial para a fauna.", p1.id, "palmito_jucara"),
            ("Orquídea Laelia", "Flora", "Espécie de altitude dos campos rupestres.", p1.id, "orquidea_laelia"),
            ("Araucária", "Flora", "Pinheiro brasileiro de áreas elevadas.", p2.id, "araucaria"),
            ("Jequitibá-rosa", "Flora", "Árvore gigante secular da Mata Atlântica.", p2.id, "jequitiba_rosa"),
            ("Bromélia", "Flora", "Planta epífita que cria microecossistemas.", p3.id, "bromelia"),
        ]
        
        biodiversidades = []
        for especie, tipo, descricao, parque_id, img_key in biodiversidade_data:
            imagens = []
            if img_key in IMAGENS:
                for url in IMAGENS[img_key]:
                    img = download_and_convert_to_base64(url)
                    if img:
                        imagens.append(img)
            
            bio = models.Biodiversidade(
                especie=especie,
                tipo=tipo,
                descricao=descricao,
                parque_id=parque_id,
                imagens=imagens if imagens else None
            )
            biodiversidades.append(bio)
        
        db.add_all(biodiversidades)
        
        # 4. EVENTOS (sem imagens, conforme solicitado)
        print("📅 Criando eventos...")
        eventos = [
            models.Evento(nome="ATM 2026", data=date(2026, 5, 15), descricao="Abertura Temporada", parque_id=p1.id, imagens=None),
            models.Evento(nome="YVY Festival", data=date(2026, 5, 15), descricao="Cinema Ambiental", parque_id=p1.id, imagens=None),
            models.Evento(nome="Mutirão Salinas", data=date(2026, 5, 1), descricao="Manutenção", parque_id=p2.id, imagens=None),
            models.Evento(nome="Yoga na Montanha", data=date(2026, 3, 20), descricao="Prática Zen", parque_id=p3.id, imagens=None),
            models.Evento(nome="Curso de Educação Ambiental", data=date(2026, 3, 16), descricao="Foco em preservação da Mata Atlântica.", parque_id=p1.id, imagens=None),
            models.Evento(nome="Oficina de Mínimo Impacto", data=date(2026, 6, 1), descricao="Boas práticas e segurança na montanha.", parque_id=p1.id, imagens=None),
            models.Evento(nome="Workshop de Aves", data=date(2026, 4, 10), descricao="Saída guiada para registro de espécies.", parque_id=p2.id, imagens=None),
            models.Evento(nome="Encontro de Escaladores", data=date(2026, 6, 20), descricao="Evento técnico no Vale dos Deuses.", parque_id=p2.id, imagens=None),
            models.Evento(nome="Pedal nos Três Picos", data=date(2026, 7, 1), descricao="Roteiro de cicloturismo.", parque_id=p2.id, imagens=None),
            models.Evento(nome="Rapel na Tartaruga", data=date(2026, 3, 28), descricao="Atividade guiada técnica com foco em SST.", parque_id=p3.id, imagens=None),
            models.Evento(nome="Labirinto Verde", data=date(2026, 4, 12), descricao="Educação ambiental para famílias.", parque_id=p3.id, imagens=None),
            models.Evento(nome="Piquenique Ecológico", data=date(2026, 5, 1), descricao="Integração e lazer na natureza.", parque_id=p3.id, imagens=None),
        ]
        
        db.add_all(eventos)
        
        # 5. ADMINISTRADORES
        print("👤 Criando administradores...")
        admins = [
            models.Administrador(nome="Michael Admin", email="admin@tereverde.com", senha=gerar_hash_senha("admin123")),
            models.Administrador(nome="Ana Silva", email="ana@gmail.com", senha=gerar_hash_senha("senha123")),
            models.Administrador(nome="Carlos Souza", email="carlos@gmail.com", senha=gerar_hash_senha("senha456"))
        ]
        
        db.add_all(admins)
        
        db.commit()
        print("✅ SUCESSO TOTAL: Todos os dados foram salvos com imagens!")
        
    except Exception as e:
        print(f"❌ ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    popular_banco_com_imagens()
