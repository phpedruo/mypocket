# 💰 MyPocket

Sistema completo de controle financeiro pessoal com armazenamento local, desenvolvido com Next.js 16, TypeScript, PostgreSQL e Prisma.

## 📖 Sobre o Projeto

MyPocket é uma aplicação web moderna para gerenciamento de finanças pessoais que oferece privacidade total ao armazenar todos os dados localmente. O sistema permite controlar receitas, despesas, categorias personalizadas e visualizar a evolução financeira através de gráficos interativos.

### ✨ Principais Funcionalidades

#### Para o Usuário
- 📊 **Dashboard Interativo**: Visualize saldo, receitas e despesas em tempo real
- 📈 **Gráficos Dinâmicos**: Acompanhe a evolução financeira dos últimos 6 meses
- 🔄 **Transações Recorrentes**: Configure pagamentos mensais/anuais automáticos
- 🏷️ **Categorias Personalizáveis**: Crie e gerencie suas próprias categorias
- 💼 **Fontes de Renda**: Organize múltiplas fontes de receita
- 🔒 **100% Local**: Seus dados ficam na sua máquina, sem dependência de nuvem
- 🎨 **Interface Moderna**: Design responsivo e intuitivo

#### Para o Desenvolvedor
- ⚡ **Full Stack TypeScript**: Type-safety em todo o projeto
- 🎯 **Next.js 16 App Router**: Server Components e API Routes
- 🗄️ **PostgreSQL + Prisma**: ORM moderno com migrations
- 🔐 **Autenticação Segura**: iron-session com bcrypt
- 📱 **Responsive Design**: Tailwind CSS
- 📊 **Visualização de Dados**: Recharts para gráficos
- 🧪 **Código Limpo**: ESLint configurado

## 🛠️ Stack Tecnológica

### Backend
- **PostgreSQL 17**: Banco de dados relacional rodando localmente
- **Prisma 7**: ORM com suporte a Prisma Adapter e migrations
- **Next.js 16 API Routes**: Endpoints REST para CRUD
- **iron-session**: Gerenciamento de sessões com cookies seguros
- **bcryptjs**: Hashing de senhas (10 rounds)

### Frontend
- **Next.js 16**: Framework React com App Router
- **TypeScript**: Tipagem estática completa
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Recharts**: Gráficos interativos (LineChart, PieChart)
- **date-fns**: Manipulação de datas
- **Lucide React**: Biblioteca de ícones SVG

## 📁 Estrutura do Projeto

```
mypocket-web/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (backend)
│   │   ├── auth/                 # Endpoints de autenticação
│   │   │   ├── signup/           # Criar conta
│   │   │   ├── login/            # Login
│   │   │   ├── logout/           # Logout
│   │   │   └── me/               # Usuário atual
│   │   ├── transactions/         # CRUD de transações
│   │   ├── categories/           # CRUD de categorias
│   │   └── income-sources/       # CRUD de fontes de renda
│   ├── login/                    # Página de login/cadastro
│   ├── welcome/                  # Onboarding: nome do usuário
│   ├── categories/               # Onboarding: categorias
│   ├── income/                   # Onboarding: fontes de renda
│   └── dashboard/                # Dashboard principal
├── components/
│   └── DashboardClient.tsx       # Componente principal do dashboard
├── lib/
│   ├── prisma.ts                 # Cliente Prisma
│   ├── session.ts                # Configuração de sessões
│   └── hooks/
│       └── useTransactions.ts    # Custom hooks para API
├── prisma/
│   ├── schema.prisma             # Schema do banco de dados
│   └── migrations/               # Histórico de migrações
└── .env.local                    # Variáveis de ambiente
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL 17 rodando localmente
- npm, yarn, pnpm ou bun

### 1. Clone o repositório
```bash
git clone https://github.com/phpedruo/mypocket.git
cd mypocket-web
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mypocket"
SESSION_SECRET="sua-chave-secreta-aqui"
```

### 4. Execute as migrations do banco
```bash
npx prisma migrate dev
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 💾 Banco de Dados

### Schema Principal

#### **users**
- Informações de conta e autenticação
- Senha criptografada com bcrypt
- Timestamps de criação

#### **categories**
- Categorias personalizadas por usuário
- Tipo: receita ou despesa
- Cor e ícone customizáveis

#### **income_sources**
- Fontes de renda (salário, freelance, etc.)
- Vinculadas ao usuário

#### **transactions**
- Receitas e despesas
- Valores, datas e descrições
- Suporte a transações recorrentes
- Relacionamento com categorias

### Transações Recorrentes
Configure transações que se repetem automaticamente:
- 📅 **Mensais**: Aluguel, Netflix, salário
- 📆 **Anuais**: IPTU, seguros, assinaturas anuais

## 📊 Visualizações

### Dashboard Principal
- **Cards de Resumo**: Saldo total, receitas e despesas do mês
- **Gráfico de Evolução**: Linha temporal dos últimos 6 meses
- **Gráfico de Categorias**: Pizza com distribuição de gastos
- **Lista de Transações**: Histórico completo ordenado por data

### Filtros e Análises
- Visualização mensal/anual
- Agrupamento por categorias
- Cálculo automático de saldos

## 🔒 Segurança e Privacidade

- ✅ **Dados 100% Locais**: PostgreSQL rodando na sua máquina
- ✅ **Senhas Criptografadas**: bcrypt com 10 rounds
- ✅ **Sessões Seguras**: iron-session com cookies HTTP-only
- ✅ **Zero Dependências Externas**: Nenhum dado enviado para cloud
- ✅ **Privacidade Total**: Apenas você tem acesso aos seus dados

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Pedro](https://github.com/phpedruo)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
