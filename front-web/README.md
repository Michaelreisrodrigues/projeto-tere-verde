# Tere Verde - Painel Administrativo

Frontend administrativo para o projeto Tere Verde, desenvolvido com React, TypeScript, Tailwind CSS e Vite.

## Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento da aplicação
- **Axios** - Cliente HTTP para comunicação com a API
- **Lucide React** - Biblioteca de ícones
- **React Hot Toast** - Notificações toast

## Funcionalidades

### Autenticação
- Login com JWT
- Proteção de rotas privadas
- Logout seguro

### Gerenciamento de Parques
- Listar todos os parques
- Criar novo parque
- Editar parque existente
- Excluir parque
- Busca por nome ou localização

### Gerenciamento de Trilhas
- Listar todas as trilhas
- Criar nova trilha
- Editar trilha existente
- Excluir trilha
- Busca por nome ou dificuldade
- Vinculação com parques

## Estrutura do Projeto

```
front-web/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Layout.tsx   # Layout principal com sidebar
│   │   └── PrivateRoute.tsx  # Proteção de rotas
│   ├── contexts/        # Contextos React
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   ├── pages/           # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Parques.tsx
│   │   ├── ParqueForm.tsx
│   │   ├── Trilhas.tsx
│   │   └── TrilhaForm.tsx
│   ├── services/        # Serviços de API
│   │   └── api.ts       # Configuração do Axios e serviços
│   ├── types/           # Tipagens TypeScript
│   │   └── index.ts
│   ├── App.tsx          # Componente principal com rotas
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## Instalação

1. **Instale as dependências:**
```bash
cd front-web
npm install
```

2. **Configure a URL da API:**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:8000
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
Abra o navegador em `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Conexão com a API

O frontend se conecta com a API FastAPI rodando no backend. Certifique-se de que:

1. O backend está rodando (veja o README na pasta `back-end/`)
2. A URL da API está configurada corretamente
3. O CORS está habilitado no backend (já configurado por padrão)

## Endpoints Utilizados

### Autenticação
- `POST /login/token` - Login (retorna JWT)

### Parques
- `GET /parques` - Listar todos
- `GET /parques/{id}` - Buscar por ID
- `POST /parques` - Criar (requer autenticação)
- `PUT /parques/{id}` - Atualizar (requer autenticação)
- `DELETE /parques/{id}` - Excluir (requer autenticação)

### Trilhas
- `GET /trilhas` - Listar todos
- `GET /trilhas/{id}` - Buscar por ID
- `POST /trilhas` - Criar (requer autenticação)
- `PUT /trilhas/{id}` - Atualizar (requer autenticação)
- `DELETE /trilhas/{id}` - Excluir (requer autenticação)

## Design Responsivo

O painel administrativo é totalmente responsivo:
- **Desktop:** Sidebar fixa à esquerda
- **Tablet/Mobile:** Sidebar colapsável com menu hambúrguer
- **Cards e formulários:** Adaptam-se a diferentes tamanhos de tela

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Executa ESLint
- `npm run preview` - Preview do build de produção

## Próximos Passos

Possíveis melhorias para o projeto:
- [ ] Adicionar dashboard com gráficos
- [ ] Implementar paginação nas listas
- [ ] Adicionar filtros avançados
- [ ] Upload de imagens para parques e trilhas
- [ ] Modo escuro (dark mode)
- [ ] Testes automatizados