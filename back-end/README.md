# 🌲 Projeto Tere Verde - MOBILE

Sistema integrado para gerenciamento de turismo sustentável e biodiversidade em Teresópolis-RJ. Este repositório centraliza o ecossistema desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas – UNIFESO.

---

## 📂 Estrutura do Monorepositório

Para facilitar a integração, o projeto está dividido em três grandes módulos:

* **/back-end**: API FastAPI (Python), Banco SQLite e lógica de autenticação.
* **/front-web**: Painel Administrativo para gestão de dados (React/HTML).
* **/app-mobile**: Aplicativo mobile para consulta de turistas (Expo/React Native).

---

## 📖 Sobre a API (Back-end)

A **API Tere Verde** centraliza o controle de:
- **Parques e Trilhas**: Inventário detalhado de acesso e dificuldades.
- **Biodiversidade**: Catálogo de fauna e flora local da Mata Atlântica.
- **Eventos**: Calendário de ações ambientais e lazer sustentável.
- **Segurança**: Gestão de administradores via tokens JWT.

---

## 🚀 Tecnologias Utilizadas

- 💡 **FastAPI** – Framework moderno de alta performance.
- 🐘 **SQLAlchemy & SQLite** – Persistência de dados robusta e leve.
- 🛡️ **Passlib (Bcrypt)** – Criptografia de senhas (Segurança de Dados).
- 🧪 **Swagger** – Documentação interativa automática.

---

## 🧱 Arquitetura do Back-end

📦 back-end/
├── 📁 app/
│   ├── 📁 auth/        # Lógica de segurança e JWT
│   ├── 📁 models/      # Tabelas do banco de dados (SQLAlchemy)
│   ├── 📁 routers/     # Endpoints da aplicação
│   ├── 📁 schemas/     # Validação de dados (Pydantic)
│   ├── database.py     # Conexão com o banco
│   ├── main.py         # Ponto de entrada da API
│   └── seed.py         # Script de carga inicial de dados
├── tereverde.db        # Base de dados SQLite
└── requirements.txt    # Dependências do projeto

---

## ✅ Requisitos do Sistema

### Funcionais (RF)
- **RF01-07**: Listagem e detalhes de parques, trilhas, eventos e biodiversidade.
- **RF08**: Login seguro para administradores.
- **RF09-12**: Operações de CRUD (Criar, Editar, Remover) exclusivas para admins.

### Regras de Negócio (RN)
- **RN01**: Trilhas devem estar obrigatoriamente vinculadas a um Parque.
- **RN02**: O nível de dificuldade deve seguir o padrão: Fácil, Leve, Moderada ou Pesada.
- **RN03**: Visitantes possuem apenas permissão de leitura (`GET`).

---

## 📦 Instalação e Execução

### 1. Preparar o Ambiente
```bash
# Entre na pasta do back-end
cd back-end

# Crie o ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows

#2. Instalar Dependências

pip install -r requirements.txt

# 3. Popular o Banco

python -m app.seed

# 4. Rodar a API

python -m uvicorn app.main:app --reload


📬 Acesso e Documentação
Swagger UI: http://localhost:8000/docs

Base URL: http://localhost:8000