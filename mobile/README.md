# 🌳 App Tere Verde

Um aplicativo MVP mobile desenvolvido com React Native e Expo para guiar visitantes através de parques naturais, oferecendo informações detalhadas sobre localidades, eventos e experiências.

## 📱 Características

- **Guia de Parques**: Explore parques naturais com descrições detalhadas
- **Busca Inteligente**: Procure parques por nome, localidade ou descrição
- **Eventos**: Descubra eventos durante sua visita
- **Interface Responsiva**: Design otimizado para dispositivos iOS e Android
- **Navigation**: Navegação fluida e intuitiva

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Sistema de navegação
- **Expo Vector Icons** - Ícones vetoriais
- **React Hooks** - Estado e efeitos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (instalado globalmente)
- Um emulador Android/iOS ou celular com o app Expo Go

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/app-tere-verde.git
cd app-tere-verde
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

## 📱 Rodando o Aplicativo

### No Expo Go (Mais Rápido)
```bash
npm start
```
Escaneie o código QR com seu celular usando o app Expo Go.

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 📁 Estrutura do Projeto

```
app-tere-verde/
├── src/
│   ├── @types/              # Tipos TypeScript customizados
│   ├── assets/              # Imagens e recursos
│   ├── components/          # Componentes reutilizáveis
│   ├── data/
│   │   └── parques.ts       # Dados dos parques
│   ├── global/              # Configurações globais
│   └── pages/
│       └── guia-visitante/  # Página principal do guia
├── App.tsx                  # Componente raiz
├── app.json                 # Configurações do Expo
├── package.json             # Dependências
└── tsconfig.json            # Configuração TypeScript
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run android` - Executa no emulador/dispositivo Android
- `npm run ios` - Executa no emulador/dispositivo iOS
- `npm run web` - Executa na web

## 💻 Desenvolvimento

### Adicionar um Novo Parque

1. Edite o arquivo [src/data/parques.ts](src/data/parques.ts)
2. Adicione um novo objeto com as informações do parque
3. A busca será automaticamente atualizada

### Adicionar um Novo Componente

1. Crie um novo arquivo em `src/components/`
2. Implemente o componente em TypeScript
3. Exporte e use em suas páginas

## 📝 Dependências Principais

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| react | 19.2.0 | Biblioteca React |
| react-native | 0.83.2 | Framework mobile |
| expo | ~54.0.0 | Plataforma de desenvolvimento |
| typescript | ~5.9.2 | Linguagem tipada |
| @expo/vector-icons | ^15.0.3 | Ícones vetoriais |

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🎯 Roadmap

- [ ] Implementar autenticação de usuários
- [ ] Adicionar favoritos de parques
- [ ] Integração com mapas
- [ ] Sistema de avaliações e comentários
- [ ] Push notifications para eventos

---

