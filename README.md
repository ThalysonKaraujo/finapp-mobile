# 📱 FinApp Mobile

> Aplicativo móvel para gestão financeira pessoal construído com **React Native**, **Expo** e **TypeScript Estrito**, projetado sobre a arquitetura **Feature-Sliced Design (FSD v2.1)** e uma identidade visual limpa inspirada em fintechs modernas (**White & Blue**).

![React Native](https://img.shields.io/badge/React_Native-0.74-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3_Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FSD](https://img.shields.io/badge/Architecture-FSD_v2.1-4C51BF?style=for-the-badge)
![Zustand](https://img.shields.io/badge/Zustand-4.5-443E38?style=for-the-badge&logo=react&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3.23-3068B7?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/Linter-Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)

---

## 🎯 Sobre o Projeto

O **FinApp Mobile** é a interface móvel oficial do ecossistema FinApp. Desenvolvido com foco em **experiência do usuário (UX fintech consistente)**, **alta performance** e **sustentabilidade de código**, o app elimina complexidades visuais desnecessárias em favor de cartões de alto contraste, tipografia calibrada, formulários fluidos com feedback em tempo real e máscaras dinâmicas de valores em Real (BRL).

A base de código segue à risca o padrão arquitetural **Feature-Sliced Design (FSD v2.1)**, garantindo desacoplamento estrutural, separação rigorosa de responsabilidades e escalabilidade contínua.

---

## 🚀 O Que Está Feito (Funcionalidades)

### 🔐 1. Autenticação & Sessão Segura (Better Auth)
- **Login e Registro de Contas:** Formulários tipados com validação de schemas em tempo de execução via **Zod**.
- **Restauração Automática de Sessão:** Hidratação transparente das credenciais no bootstrap do app durante a Splash Screen.
- **Interceptors HTTP Inteligentes:** Injeção automática de token Bearer em todas as requisições autenticadas via **Axios**, além de tratamento preventivo de expiração/logout.
- **Store Reativa com Zustand:** Estado de autenticação global e centralizado (`useAuthStore`).

### 📱 2. Navegação em Abas (Bottom Tab Navigator)
Estrutura de navegação intuitiva dividida em 3 abas principais integradas à Safe Area:
1. **Início (Feed de Transações):** Extrato financeiro, balanço consolidado e atalhos rápidos.
2. **Carteiras & Metas:** Gestão de contas bancárias/carteiras e objetivos financeiros (cofrinhos).
3. **Relatórios:** Visão analítica, métricas de economia e detalhamento de gastos mensais.

### 💳 3. Dashboard & Balanço em Tempo Real
- **Card de Balanço do Período:** Exibe saldo geral líquido consolidado, total de entradas (receitas) e total de saídas (despesas).
- **Modo Privacidade:** Alternância rápida para ocultar ou exibir valores monetários (ícone de olho com persistência de preferência).
- **Pílulas de Filtro Rápido:** Filtragem instantânea no extrato por **Todas**, **Receitas** ou **Despesas**.

### 📋 4. Gestão Completa de Transações
- **Feed Paginado:** Rolagem infinita com paginação e suporte a **Pull-to-Refresh**.
- **Cards de Transação Detalhados:** Indicador visual de tipo (direção e cor), badges para parcelamentos (ex: `1/12`), identificação de categoria, carteira e datas formatadas com termos relativos amigáveis (*"Hoje, 14:30"*, *"Ontem"*, etc.).
- **Criação Ágil de Transação:**
  - Seletor de tipo: **Receita** ou **Despesa**.
  - Componente `AmountInput` com máscara dinâmica em centavos padrão brasileiro (`R$ 0,00`).
  - Associação com Carteira de liquidação e Categoria.
  - Seleção de data via `DatePickerInput`.
  - Configuração opcional de **Parcelamento** (número de parcelas) ou **Recorrência**.
- **Edição de Transação:** Tela dedicada para alteração de valores, descrição, categoria, carteira e datas de transações já existentes.
- **Detalhes e Exclusão Segura:** Exibição completa de metadados com diálogo nativo de confirmação de exclusão.

### 🔄 5. Transferências entre Carteiras
- **Movimentação entre Contas:** Transferência direta de saldo entre duas carteiras cadastradas.
- **Validação de Regras de Negócio:** Bloqueio de transferências entre a mesma conta, validação de valor mínimo e conferência de saldo disponível.
- **Data e Descrição:** Registro transparente da data da transferência e memo explicativo.

### 💼 6. Gestão de Carteiras / Contas
- **Visualização Consolidada:** Listagem em cards com saldo individual, tipo de conta e identidade visual.
- **Criação de Carteiras:**
  - Definição de nome da conta (ex: *"Nubank"*, *"Carteira Física"*, *"Investimentos"*).
  - Tipos suportados: Conta Corrente (`CHECKING`), Poupança (`SAVINGS`), Investimentos (`INVESTMENT`), Dinheiro Físico (`CASH`).
  - Definição de saldo inicial com máscara BRL.
  - Seletor de cores personalizadas via `ColorPicker`.

### 🎯 7. Metas e Objetivos Financeiros (Cofrinhos)
- **Criação de Objetivos:**
  - Título da meta, valor alvo (`targetAmount`) e data limite planejada (`targetDate`).
  - Cor e ícone customizáveis.
- **Acompanhamento Visual:**
  - Barra de progresso percentual dinâmica (`ProgressBar`).
  - Comparativo entre valor acumulado e valor alvo formatado em Real.
  - Badges de status (**Em andamento** / **Concluído**).
- **Aportes e Resgates Dedicados:**
  - Modal para depósitos (`DEPOSIT`) e retiradas (`WITHDRAW`).
  - Débito/crédito sincronizado com a carteira de origem selecionada.
- **Exclusão de Metas:** Confirmação nativa para remoção de metas concluídas ou canceladas.

### 🏷️ 8. Gestão de Categorias
- **Criação de Categorias Personalizadas:**
  - Nome da categoria.
  - Tipo: Receita (`INCOME`) ou Despesa (`EXPENSE`).
  - Paleta de cores exclusiva via `ColorPicker` para organização visual de relatórios.

### 📊 9. Relatórios Financeiros & Analytics
- **Navegador Temporal:** Seletor ágil de mês e ano com controles anterior/próximo.
- **Balanço Consolidado do Mês:** Total de receitas, total de despesas e saldo líquido resultante (superávit ou déficit).
- **Gráfico Proporcional por Categoria:**
  - Cálculo percentual da representatividade de cada categoria sobre o gasto total.
  - Barras proporcionais coloridas com as cores de cada categoria.
  - Ordenação por volume financeiro para diagnóstico imediato de despesas.
- **Empty State:** Telas explicativas quando não houver movimentações no período selecionado.

### ⚡ 10. Storage Híbrido Condicional (MMKV + Fallback)
- **Nativo (iOS / Android):** Utiliza o motor ultrarrápido em C++ do **`react-native-mmkv`**.
- **Expo Go & Web:** Fallback automático e transparente em memória, permitindo rodar o projeto imediatamente sem pré-build nativo.

---

## 🏗️ Arquitetura (Feature-Sliced Design v2.1)

O código é estritamente desacoplado em camadas e fatias de negócio:

```text
src/
├── app/                              # Inicialização, Provedores e Roteamento
│   ├── providers/                    # SafeArea, Theme, Splash e Auth Bootstrap
│   ├── routes/                       # BottomTabNavigator, AppNavigator, AuthNavigator
│   └── index.ts
├── pages/                            # Telas Completas (Composição de Slices)
│   ├── create-category/              # Modal de criação de categoria
│   ├── create-objective/             # Modal de criação de meta/objetivo
│   ├── create-transaction/           # Modal de nova transação (BRL Mask)
│   ├── create-wallet/                # Modal de criação de carteira
│   ├── deposit-withdraw-objective/   # Modal de aportes/resgates em objetivos
│   ├── edit-transaction/             # Modal de edição de transação existente
│   ├── login/                        # Tela de autenticação com validação Zod
│   ├── register/                     # Tela de cadastro de novo usuário
│   ├── reports/                      # Tela de relatórios e métricas analíticas
│   ├── transaction-details/          # Detalhes completos e exclusão de transação
│   ├── transactions-feed/            # Feed principal com balanço e filtros
│   ├── transfer/                     # Modal de transferência entre carteiras
│   └── wallets-and-objectives/       # Gestão unificada de carteiras e metas
├── features/                         # Casos de Uso e Interações de Negócio
│   ├── auth/                         # useAuthStore (Zustand) + Schemas Zod de Auth
│   └── create-transaction/           # Hook useCreateTransaction + Validação Zod
├── entities/                         # Modelos de Domínio, APIs e Schemas
│   ├── category/                     # Schemas Zod, tipos e categoryApi
│   ├── objective/                    # Schemas Zod, tipos e objectiveApi
│   ├── report/                       # Schemas Zod, tipos e reportApi
│   ├── transaction/                  # Schemas Zod, tipos, transactionApi e transferApi
│   └── wallet/                       # Schemas Zod, tipos e walletApi
└── shared/                           # UI Kit Base, Utilitários e Infraestrutura
    ├── api/                          # Axios Client, Interceptors e Endpoints de Rede
    ├── auth/                         # Better Auth Client e Contratos de Sessão
    ├── lib/                          # Formatadores (BRL em centavos, datas pt-BR)
    ├── storage/                      # MMKV Adapter híbrido de alta performance
    ├── theme/                        # Paleta White & Blue, Tipografia, Sombras e Espaçamentos
    └── ui/                           # UI Kit Atômico Reutilizável
        ├── AmountInput/              # Input monetário com máscara BRL em centavos
        ├── Badge/                    # Tags de status, parcelas e direcionais
        ├── Button/                   # Botões com variantes, estados e loading
        ├── Card/                     # Containers de superfície com elevação/borda
        ├── ColorPicker/              # Seletor de cores em grade
        ├── DatePickerInput/          # Seletor nativo de datas
        ├── EmptyState/               # Ilustrações e mensagens de ausência de dados
        ├── Header/                   # Barra de navegação com ações e retorno
        ├── Input/                    # Campo de texto com rótulos e mensagens de erro
        ├── ProgressBar/              # Barra de progresso personalizável
        └── ScreenWrapper/            # Envoltório com Safe Area e suporte a rolagem
```

### 📜 Regra de Ouro do FSD:
`app → pages → features → entities → shared`
- Módulos só podem importar de camadas **estritamente inferiores**.
- Cada fatia expõe sua interface pública exclusivamente através de um `index.ts`.
- É estritamente proibido importar dados entre fatias do mesmo nível de forma cruzada.

---

## 🎨 UI Kit & Design System (White & Blue)

O design visual foi concebido para entregar uma experiência premium de fintech:
- **Cores Principais:** Azul Primário (`#0066FF`), Fundo Neutro Claro (`#F8FAFC`), Cards e Superfícies Brancas (`#FFFFFF`), Textos de Alta Legibilidade (`#0F172A`), Verde de Receita (`#16A34A`), Vermelho de Despesa (`#DC2626`).
- **Feedback Visual & Interação:** Loading states, botões com opacidade calibrada, mensagens de erro inline e alertas nativos para ações destrutivas.

---

## 🧪 Testes Automatizados & Qualidade de Código

O projeto conta com testes unitários e de integração de contratos com **Vitest**:
- **Formatadores:** Conversão de inteiros em centavos para moeda BRL (`formatCentsToBRL`) e parsing monetário (`parseBRLToCents`), datas relativas e absolutas em `pt-BR`.
- **Validação de Contratos (Zod):** Testes de validação para schemas de Autenticação, Transações, Transferências, Carteiras, Objetivos e Relatórios.
- **Linter & Formatter:** Integração com **Biome** para linting e formatação ultrarrápidos.
- **Git Hooks:** Integração com **Husky** para garantia de integridade de código antes de commits.

Para rodar a suíte de testes:
```bash
npm test
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
| :--- | :--- | :--- |
| **Expo** | `~51.0.28` | Plataforma e ferramental React Native |
| **React Native** | `0.74.5` | Framework base para desenvolvimento mobile nativo |
| **TypeScript** | `~5.3.3` | Tipagem estática rigorosa (`strict: true`) |
| **Zustand** | `^4.5.5` | Gerenciamento de estado global reativo |
| **Zod** | `^3.23.8` | Validação de schemas e contratos em tempo de execução |
| **react-native-mmkv** | `^2.12.2` | Armazenamento chave-valor de altíssima velocidade em C++ |
| **React Navigation** | `^6.x` | Navegação por Pilha (`Native Stack`) e Abas (`Bottom Tabs`) |
| **Axios** | `^1.7.7` | Cliente HTTP com interceptors para tokens de autenticação |
| **date-fns** | `^3.6.0` | Manipulação e formatação de datas em português |
| **lucide-react-native** | `^0.439.0` | Ícones vetoriais leves e consistentes |
| **Vitest** | `^4.1.11` | Suíte rápida de testes automatizados |
| **Biome** | `^2.5.11` | Linter e formatador de código de alta performance |

---

## 💻 Como Rodar o Projeto

### 1. Pré-requisitos
- **Node.js:** versão `20+`
- **Backend:** [FinApp Backend](../finapp-backend) em execução (porta padrão `3000`).
- **Dispositivo ou Emulador:** App **Expo Go** instalado no celular ou emulador iOS/Android configurado.

### 2. Instalação das Dependências
```bash
# Navegar até o diretório do mobile
cd finapp-mobile

# Instalar pacotes
npm install
```

### 3. Configuração de Conexão com a API
No arquivo `src/shared/api/endpoints.ts`, a URL base adapta-se ao ambiente:
- **Simulador iOS:** `http://localhost:3000/api`
- **Emulador Android:** `http://10.0.2.2:3000/api`
- **Aparelho Físico (Expo Go):** Substitua pelo IP local da sua máquina (ex: `http://192.168.1.50:3000/api`).

### 4. Executando o Aplicativo
```bash
# Iniciar o Metro Bundler do Expo
npm start

# Executar no simulador iOS
npm run ios

# Executar no emulador Android
npm run android

# Executar no navegador Web
npm run web
```

---

## 📜 Scripts do Projeto

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o servidor Metro do Expo |
| `npm test` | Executa todos os testes automatizados com Vitest |
| `npm run test:watch` | Executa os testes em modo observador (watch) |
| `npm run test:cov` | Gera relatório de cobertura de código com coverage |
| `npm run typecheck` | Executa a checagem de tipos estritos do TypeScript (`tsc --noEmit`) |
| `npm run lint` | Executa o linter do Biome na pasta `src` |
| `npm run lint:fix` | Corrige problemas identificados pelo linter automaticamente |
| `npm run format` | Formata todo o código fonte de acordo com o Biome |

---

*Desenvolvido com foco em excelência técnica, código limpo e arquitetura escalável.* 🚀
