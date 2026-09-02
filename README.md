# 📱 FinApp Mobile

> Aplicativo móvel para gestão financeira pessoal construído com **React Native**, **Expo** e **TypeScript Estrito**, projetado sobre a arquitetura **Feature-Sliced Design (FSD v2.1)** e uma identidade visual moderna em **Branco e Azul**.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

---

## 🎯 Sobre o Projeto

O **FinApp Mobile** é a interface móvel do ecossistema FinApp. Desenvolvido com foco em **experiência do usuário (UX fintech limpa)**, **performance** e **mantenibilidade**, o app elimina a estética genérica de IA em favor de cartões de alto contraste, tipografia com hierarquia calibrada, formulários com feedback instantâneo e máscaras de valores em Real (BRL).

A base de código segue rigorosamente o padrão arquitetural **Feature-Sliced Design (FSD v2.1)**, garantindo baixo acoplamento, alta coesão e isolamento claro entre regras de negócio, modelos de domínio e componentes visuais.

---

## 🚀 Funcionalidades Principais

- 🔐 **Autenticação Completa (Better Auth):**
  - Login e Cadastro integrados com validação de contratos em tempo de execução via **Zod**.
  - Restauração automática de sessão pré-carregada na inicialização do aplicativo (Splash integrado).
  - Interceptors no **Axios** que anexam automaticamente o token Bearer em todas as requisições autenticadas.
- ⚡ **Storage Híbrido Condicional (MMKV + Fallback):**
  - Utiliza o motor ultrarrápido em C++ do **`react-native-mmkv`** em builds nativas de desenvolvimento/produção.
  - Fallback automático e seguro para **Expo Go** e **Web**, garantindo que o app rode em qualquer ambiente sem necessidade de pré-build.
- 💳 **Dashboard & Balanço Financeiro:**
  - Card de saldo geral com métricas de entradas e saídas consolidadas do período.
  - Alternância de visibilidade do saldo (modo privacidade com ícone de olho).
- 📋 **Feed de Transações Paginado:**
  - Listagem com suporte a **Pull-to-Refresh** e rolagem infinita.
  - Pílulas de filtro dinâmico em tempo real (**Todas**, **Receitas**, **Despesas**).
  - Cards detalhados com identificadores direcionais, badges de parcelamento (ex: `1/12`) e datas relativas amigáveis (*"Hoje, 14:30"*, *"Ontem"*).
- ➕ **Criação Ágil de Transações:**
  - Seletor de tipo (**Receita** / **Despesa**).
  - Campo de valor monetário (`AmountInput`) com máscara dinâmica em centavos padrão brasileiro.
  - Suporte a parcelamentos e recorrências.
- 🗑️ **Detalhes e Exclusão:**
  - Visualização completa dos metadados da transação com diálogo nativo de confirmação de exclusão.

---

## 🏗️ Arquitetura (Feature-Sliced Design v2.1)

O projeto está estruturado em camadas verticais estritas:

```text
src/
├── app/                      # Camada de Inicialização e Roteamento
│   ├── providers/            # AppProviders (SafeArea, Splash e Zustand bootstrap)
│   ├── routes/               # AppNavigator, AuthNavigator, Root Navigation e Types
│   └── index.ts
├── pages/                    # Telas Completas (Route-level composition)
│   ├── login/                # Tela de Login com validação Zod
│   ├── register/             # Tela de Cadastro de Usuário
│   ├── transactions-feed/    # Feed de transações + Balanço + Filtros
│   ├── create-transaction/   # Formulário de Nova Transação (com BRL mask)
│   └── transaction-details/  # Visualização completa e exclusão
├── features/                 # Casos de Uso e Interações Reutilizáveis
│   ├── auth/                 # Zustand Auth Store + Zod Schemas de Login/Cadastro
│   └── create-transaction/   # Hook useCreateTransaction + Zod validation
├── entities/                 # Modelos de Domínio e Entidades
│   ├── transaction/          # Schemas Zod, tipos TypeScript e API client de transações
│   └── wallet/               # Schemas Zod, tipos TypeScript e API client de carteiras
└── shared/                   # Infraestrutura e UI Kit (Sem regras de negócio)
    ├── api/                  # Axios HTTP client, interceptors e endpoints
    ├── auth/                 # Tipos e chamadas de API Better Auth
    ├── storage/              # Wrapper adaptativo do react-native-mmkv
    ├── lib/                  # Formatadores (BRL em centavos, datas pt-BR)
    ├── theme/                # Paleta White & Blue, tipografia, sombras e espaçamentos
    └── ui/                   # Button, Input, Card, Badge, Header, AmountInput, EmptyState, ScreenWrapper
```

### 📜 Regras de Importação FSD:
`app → pages → features → entities → shared`
- Módulos só podem importar de camadas **estritamente inferiores**.
- Todo slice expõe sua API pública através de um `index.ts`.
- Proibidos imports cruzados entre fatias no mesmo nível.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Expo](https://expo.dev/) (SDK 51) + [React Native](https://reactnative.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (`strict: true`)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Validação de Schemas:** [Zod](https://zod.dev/)
- **Armazenamento:** [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- **Roteamento:** [@react-navigation/native-stack](https://reactnavigation.org/)
- **Ícones:** [lucide-react-native](https://lucide.dev/)
- **Datas:** [date-fns](https://date-fns.org/) (pt-BR)
- **HTTP:** [Axios](https://axios-http.com/)

---

## 💻 Como Rodar o Projeto

### 1. Pré-requisitos
- Node.js `20+`
- O backend [FinApp Backend](../finapp-backend) rodando (porta `3000`).
- App **Expo Go** instalado no seu celular (iOS ou Android) ou emulador configurado.

### 2. Instalação
```bash
# Navegar até a pasta mobile
cd finapp-mobile

# Instalar dependências
npm install
```

### 3. Configuração de Rede (Backend)
No arquivo `src/shared/api/endpoints.ts`:
- **Simulador iOS:** Conecta automaticamente em `http://localhost:3000/api`.
- **Emulador Android:** Conecta automaticamente via `http://10.0.2.2:3000/api`.
- **Dispositivo Físico (Expo Go):** Substitua pelo IP da sua máquina na rede local (ex: `http://192.168.1.50:3000/api`).

### 4. Iniciar o Aplicativo
```bash
# Iniciar o servidor de desenvolvimento Expo
npm start

# Executar diretamente no simulador iOS
npm run ios

# Executar diretamente no emulador Android
npm run android

# Executar na Web
npm run web
```

### 5. Verificação de Tipagem TypeScript
```bash
npm run typecheck
```

---

*Desenvolvido com excelência e arquitetura escalável para gestão financeira pessoal.* 🚀
