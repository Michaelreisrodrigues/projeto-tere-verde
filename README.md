## 🌲 Projeto Tere Verde

O Tere Verde é um ecossistema digital completo projetado para o gerenciamento e exploração do ecoturismo e da biodiversidade na cidade de Teresópolis. O projeto integra uma API robusta, um painel administrativo para gestores e um aplicativo móvel para turistas e moradores.

Este é um projeto acadêmico desenvolvido para o curso de Análise e Desenvolvimento de Sistemas – UNIFESO.

## 📌 Índice

📖 Sobre o Projeto

👥 Equipe

🚀 Tecnologias Utilizadas

🧱 Arquitetura do Sistema

✅ Requisitos e Regras

📦 Instalação e Execução

🔐 Credenciais de Teste


## Sobre o Projeto

A plataforma centraliza dados ambientais de Teresópolis para promover o turismo sustentável e a preservação. O sistema permite:

Gestão Administrativa (Web): Cadastro e controle de parques, trilhas, biodiversidade e eventos.

Exploração Turística (Mobile): Guia de bolso para consulta de trilhas e agenda de ações.

Segurança: Acesso restrito via Token JWT para operações de escrita.

## 👥 Equipe

Michael Reis – Back-end & Segurança.

Matheus Menezes – Desenvolvimento Front-end Web.

Uillian da Silva – Desenvolvimento Mobile.

## 🚀 Tecnologias Utilizadas
Back-end
Python & FastAPI | SQLAlchemy (ORM) | SQLite | JWT & Bcrypt

Front-end & Mobile
React (Web) | React Native & Expo (Mobile) | Vite | Tailwind CSS

## 🧱 Arquitetura do Sistema
O projeto utiliza uma estrutura de Monorepo para manter a sincronia entre as plataformas:

Plaintext
📦 projeto-tere-verde/
├── 📁 back-end/          # API Python (FastAPI)
│   ├── 📁 app/
│   │   ├── 📁 auth/      # Segurança e Tokens JWT
│   │   ├── 📁 models/    # Modelos do Banco (SQLAlchemy)
│   │   ├── 📁 routers/   # Rotas da API (Endpoints)
│   │   ├── 📁 schemas/   # Validação de dados (Pydantic)
│   └── seed.py           # Script para popular o banco inicial
├── 📁 front-web/         # Painel Administrativo (React)
└── 📁 mobile/            # App do Visitante (React Native/Expo)


## ✅ Requisitos e Regras
Requisitos Funcionais (RF)
RF01: Listar e detalhar parques e trilhas.

RF02: Catalogar espécies da fauna e flora local.

RF03: Gerenciar agenda de eventos ambientais.

RF04: Login seguro e CRUD completo para administradores.

Requisitos Não Funcionais (RNF)
RNF01: Autenticação via Token JWT.

RNF02: Persistência em banco SQLite.

RNF03: Documentação automática via Swagger UI (/docs).

Regras de Negócio (RN)
RN01: Trilhas devem estar obrigatoriamente vinculadas a um parque.

RN02: Visitantes possuem acesso apenas de leitura.

RN03: Criptografia de senhas (Hash) para todos os administradores.


## 📦 Instalação e Execução

1. Back-end
PowerShell
cd back-end
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
python -m uvicorn app.main:app --reload
2. Front-web / Mobile
PowerShell
# Em suas respectivas pastas:
npm install
npm run dev # Para Web
npm start   # Para Mobile
🔐 Credenciais de Teste (Admin)
E-mail: admin@tereverde.com

Senha: admin123
