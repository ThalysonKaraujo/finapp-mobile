# 📱 FinApp Mobile

Aplicativo móvel do FinApp desenvolvido em **React Native** com **TypeScript estrito**, arquitetura **Feature-Sliced Design (FSD v2.1)** e identidade visual fintech moderna em tons de **branco e azul**.

---

## 🚀 Tecnologias & Bibliotecas

- **Framework:** [Expo](https://expo.dev/) + React Native
- **Tipagem Estrita:** TypeScript
- **Gerenciamento de Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Validação de Schemas:** [Zod](https://zod.dev/)
- **Armazenamento Seguro e Rápido:** [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- **Roteamento e Navegação:** [@react-navigation/native-stack](https://reactnavigation.org/)
- **Ícones:** [lucide-react-native](https://lucide.dev/)
- **Cliente HTTP:** Axios com interceptors de token Bearer

---

## 🧱 Arquitetura Feature-Sliced Design (FSD v2.1)

O código fonte está estruturado estritamente pelas camadas FSD:

```text
src/
├── app/                      # Providers globais, Roteamento e Inicialização
│   ├── providers/            # AppProviders (Zustand init, Splash, SafeArea)
│   ├── routes/               # AppNavigator, AuthNavigator, Navigation, types
│   └── index.ts
├── pages/                    # Telas completas (Route-level composition)
│   ├── login/                # Tela de Login com validação e feedback
│   ├── register/             # Tela de Cadastro de Usuário
│   ├── transactions-feed/    # Dashboard + Feed de transações + Balanço
│   ├── create-transaction/   # Tela/Modal de Criação de Transação
│   └── transaction-details/  # Detalhes e exclusão de transação
├── features/                 # Casos de uso e fluxos reutilizáveis
│   ├── auth/                 # Zustand Auth Store, Schemas Zod de Login/Cadastro
│   └── create-transaction/   # Hook useCreateTransaction com validação Zod
├── entities/                 # Modelos de domínio reutilizados
│   ├── transaction/          # Schemas Zod, tipos e API client de transações
│   └── wallet/               # Schemas Zod, tipos e API client de carteiras
└── shared/                   # Infraestrutura e UI Kit (sem regras de negócio)
    ├── api/                  # Axios HTTP client com interceptors de token
    ├── auth/                 # Contratos e chamadas de autenticação Better Auth
    ├── storage/              # Wrapper para react-native-mmkv
    ├── lib/                  # Formatadores de moeda BRL (centavos) e datas pt-BR
    ├── theme/                # Paleta White & Blue, tipografia, sombras e espaçamentos
    └── ui/                   # Componentes base (Button, Input, Card, Badge, Header, AmountInput, EmptyState, ScreenWrapper)
```

---

## ⚙️ Configuração do Ambiente & Execução

### 1. Instalação das dependências
```bash
npm install
```

### 2. Configurar o Endereço da API (Backend)
No arquivo `src/shared/api/endpoints.ts`:
- **iOS Simulator / Web:** Conecta automaticamente em `http://localhost:3000/api`.
- **Android Emulator:** Conecta automaticamente em `http://10.0.2.2:3000/api`.
- **Dispositivo Físico:** Substitua pelo IP da sua rede local (ex: `http://192.168.1.50:3000/api`).

### 3. Iniciar o projeto
```bash
# Iniciar o Metro Bundler / Expo
npm start

# Executar no iOS Simulator
npm run ios

# Executar no Android Emulator
npm run android

# Executar no navegador Web
npm run web
```

### 4. Checagem de Tipos
```bash
npm run typecheck
```
