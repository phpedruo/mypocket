# 💰 MyPocket

Sistema completo de controle financeiro pessoal com armazenamento local seguro, desenvolvido com Next.js 16, TypeScript, PostgreSQL e Prisma.

> **📢 Nota de Transparência**: Este é um projeto educacional/portfólio de código aberto. O schema do banco de dados e implementações estão expostos propositalmente para fins de aprendizado e demonstração técnica. Para uso em produção, recomenda-se revisar e adaptar as medidas de segurança conforme necessário.

## 📖 Sobre o Projeto

<<<<<<< HEAD
MyPocket é uma aplicação web moderna para gerenciamento de finanças pessoais que oferece **privacidade total** ao armazenar todos os dados localmente no seu computador. O sistema permite controlar receitas, despesas, categorias personalizadas e visualizar a evolução financeira através de gráficos interativos em tempo real.
=======
MyPocket é uma aplicação web moderna para gerenciamento de finanças pessoais que oferece privacidade total ao armazenar todos os dados localmente. O sistema permite controlar receitas, despesas, categorias personalizadas e visualizar a evolução financeira através de gráficos interativos. Atualmente, não deve funcionar bem em telas menores, como smartphones.
>>>>>>> ec4925142c7f8f8f044b9418716696312adcfb79

### ✨ Principais Funcionalidades

#### 💼 Para o Usuário
- 📊 **Dashboard Interativo**: Visualize saldo, receitas e despesas atualizadas instantaneamente
- 📈 **Gráficos Dinâmicos**: Acompanhe a evolução financeira com período personalizável (1, 3, 6 ou 12 meses)
- 🥧 **Análise por Categorias**: Gráfico de pizza mostrando distribuição de gastos
- 🔄 **Transações Recorrentes**: Configure pagamentos mensais/anuais automáticos
- 🏷️ **Categorias Personalizáveis**: Escolha entre 25+ categorias de despesas e 7+ fontes de renda
- 💰 **Formatação Brasileira**: Valores em Real (R$) com formatação automática
- 🗑️ **Confirmação de Exclusão**: Modal de segurança antes de deletar transações
- 🔐 **100% Privado**: Seus dados ficam apenas no seu computador, sem envio para nuvem
- 🎨 **Interface Moderna**: Design responsivo, intuitivo com ícones e cores
- 👋 **Saudação Personalizada**: Bom dia/tarde/noite com seu nome

#### 🛠️ Para o Desenvolvedor
- ⚡ **Full Stack TypeScript**: Type-safety em todo o projeto
- 🎯 **Next.js 16 App Router**: Server Components, API Routes e streaming
- 🗄️ **PostgreSQL 17 + Prisma 7**: ORM moderno com migrations e type generation
- 🔐 **Autenticação Segura**: iron-session + bcrypt + rate limiting
- 🛡️ **Proteções de Segurança**: 
- 📱 **Responsive Design**: Tailwind CSS com componentes reutilizáveis
- 📊 **Visualização de Dados**: Recharts para gráficos (Line + Pie)
- 🔄 **Real-time Updates**: Context API para atualização instantânea
- 🧪 **Código Limpo**: ESLint + TypeScript strict mode

## 🛠️ Stack Tecnológica

### Backend
- **PostgreSQL 17**: Banco de dados relacional rodando localmente
- **Prisma 7**: ORM com suporte a migrations e type-safe queries
- **Next.js 16 API Routes**: Endpoints REST para CRUD completo
- **iron-session**: Gerenciamento de sessões com cookies httpOnly + sameSite
- **bcryptjs**: Hashing de senhas com salt (12 rounds)
- **Zod**: Validação de schemas em runtime
- **Validator**: Validação de emails e strings
- **DOMPurify**: Sanitização contra XSS

### Frontend
- **Next.js 16**: Framework React com App Router e Server Components
- **TypeScript**: Tipagem estática completa
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Recharts**: Gráficos interativos (LineChart, PieChart) com tooltip
- **date-fns**: Manipulação e formatação de datas
- **Lucide React**: Biblioteca de ícones SVG moderna
- **React Context API**: Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
mypocket-web/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (backend)
│   │   ├── auth/                 # Autenticação e sessões
│   │   ├── transactions/         # Gerenciamento de transações
│   │   ├── categories/           # Gerenciamento de categorias
│   │   └── income-sources/       # Gerenciamento de fontes de renda
│   ├── login/                    # Página de login/cadastro
│   ├── welcome/                  # Onboarding: bem-vindo
│   ├── categories/               # Onboarding: seleção de categorias
│   ├── income/                   # Onboarding: fontes de renda
│   ├── dashboard/                # Dashboard principal (protegido)
│   ├── layout.tsx                # Layout raiz (fontes Inter + DM Serif)
│   └── globals.css               # Estilos globais Tailwind
├── components/
│   └── DashboardClient.tsx       # Componente principal do dashboard
├── lib/
│   ├── prisma.ts                 # Cliente Prisma singleton
│   ├── session.ts                # Configuração iron-session
│   ├── validation.ts             # Schemas Zod para validação
│   ├── sanitize.ts               # Sanitização XSS com DOMPurify
│   ├── rateLimit.ts              # Rate limiting por IP
│   └── hooks/
│       └── useTransactions.tsx   # Context + hooks para transações
├── prisma/
│   ├── schema.prisma             # Schema do banco (User, Transaction, Category, IncomeSource)
│   └── migrations/               # Histórico de migrações SQL
├── public/                       # Arquivos estáticos (logo.svg)
├── .env.local                    # Variáveis de ambiente (NUNCA versionar!)
├── SECURITY.md                   # Documentação de segurança
└── README.md                     # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- **Node.js 18+** instalado ([Download](https://nodejs.org/))
- **PostgreSQL 17** rodando localmente ([Download](https://www.postgresql.org/download/))
- **npm**, yarn, pnpm ou bun (vem com Node.js)

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/phpedruo/mypocket.git
cd mypocket-web
```

### 2️⃣ Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3️⃣ Configure as variáveis de ambiente

**Crie o arquivo `.env.local`** na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/mypocket"
SESSION_SECRET="COLE_AQUI_O_SECRET_GERADO"
```

**📝 Preencha os valores:**

1. **DATABASE_URL**: Substitua `SUA_SENHA_AQUI` pela senha do seu PostgreSQL
   - Exemplo: `"postgresql://postgres:Senha123@localhost:5432/mypocket"`

2. **SESSION_SECRET**: Gere uma chave criptograficamente segura
   - Use um gerador de secrets forte (mínimo 32 caracteres)
   - Exemplo com Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Cole o resultado gerado no lugar de `COLE_AQUI_O_SECRET_GERADO`

⚠️ **IMPORTANTE:** Nunca compartilhe ou commite o arquivo `.env.local` (já está no `.gitignore`)!

### 4️⃣ Configure o banco de dados PostgreSQL

**Crie o banco de dados:**
```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE mypocket;

# Saia
\q
```

**Execute as migrations do Prisma:**
```bash
npx prisma migrate dev
```

Isso criará as tabelas: `users`, `categories`, `income_sources` e `transactions`.

### 5️⃣ Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** no navegador.

### 6️⃣ Primeiros Passos

1. **Crie sua conta** na tela de login
2. **Complete o onboarding**:
   - Escolha suas categorias de despesas
   - Selecione suas fontes de renda
3. **Comece a registrar** suas transações!

## 📊 Funcionalidades Detalhadas

### Dashboard Principal
- **Cards de Resumo**: 
  - 💰 Saldo total (receitas - despesas)
  - 📈 Total de receitas do período
  - 📉 Total de despesas do período
- **Gráfico de Tendência**: 
  - Linha temporal configurável (1, 3, 6 ou 12 meses)
  - Comparação visual receita vs despesa
  - Tooltip com valores formatados
- **Gráfico de Categorias**: 
  - Pizza com distribuição percentual
  - Legenda com valores em reais
  - Cores diferenciadas (sem verde para despesas)
- **Lista de Transações**: 
  - Últimas 10 transações
  - Ícone por tipo (💰 receita / 💳 despesa)
  - Botão de exclusão com confirmação
  - Data formatada (dd/MM/yyyy)

### Gerenciamento de Transações
- **Adicionar**: Modal com validação completa de campos
- **Editar**: (futuro) Edição inline
- **Excluir**: Confirmação antes de deletar
- **Validações**: Campos obrigatórios, limites de tamanho e sanitização contra XSS

### Transações Recorrentes
Configure transações que se repetem:
- 📅 **Mensais**: Aluguel, condomínio, Netflix, salário
- 📆 **Anuais**: IPTU, seguros, assinaturas anuais

### Categorias Disponíveis

**Despesas (27 categorias):**
- Fixas: Aluguel, Condomínio, IPTU, Veículo, Seguros, Mensalidades
- Variáveis: Água, Luz, Gás, Internet, Combustível
- Essenciais: Alimentação, Saúde, Transporte, Vestuário, Educação, Higiene
- Não Essenciais: Restaurantes, Entretenimento, Compras, Viagens, Hobbies, Luxos, Outros

**Receitas (7 fontes):**
- Salário CLT
- Freelance
- Negócios Próprios
- Investimentos
- Aluguel (renda)
- Pensão/Aposentadoria
- Outros

## 🔒 Segurança e Privacidade

### 🛡️ Proteções Implementadas

#### Autenticação
- ✅ Senhas com hash **bcrypt** forte
- ✅ Sessões **iron-session** com cookies httpOnly + sameSite
- ✅ **SESSION_SECRET** forte e validado no startup
- ✅ Senhas **nunca retornadas** nas respostas da API

#### Contra Ataques
- ✅ **SQL Injection**: Prisma ORM com queries parametrizadas
- ✅ **XSS (Cross-Site Scripting)**: DOMPurify sanitiza todos os inputs
- ✅ **Brute Force**: Rate limiting efetivo por IP
- ✅ **CSRF**: Cookies com sameSite protegido
- ✅ **DDoS**: Rate limiting global em todas as rotas críticas

#### Validações
- ✅ **Zod schemas**: Validação robusta de tipos em runtime
- ✅ **Email**: Formato validado adequadamente
- ✅ **Senhas fortes**: Requisitos de complexidade obrigatórios
- ✅ **Limites**: Proteção contra overflow e payloads maliciosos

### 🔐 Privacidade Total
- ✅ **Dados 100% Locais**: PostgreSQL roda na sua máquina
- ✅ **Zero Dependências Externas**: Nenhum dado enviado para cloud
- ✅ **Sem Analytics**: Sem rastreamento ou coleta de dados
- ✅ **Você é o Dono**: Backup e controle total dos seus dados

### 📋 Checklist de Segurança

**Antes de usar:**
- [ ] Gere um `SESSION_SECRET` forte (mínimo 64 caracteres)
- [ ] Use senha forte no PostgreSQL
- [ ] Mantenha o `.env.local` fora do Git
- [ ] Atualize dependências regularmente: `npm update`

**Recomendações:**
- 🔄 Rotacione o `SESSION_SECRET` periodicamente
- 🔒 Use senhas únicas para cada conta
- 💾 Faça backup regular do banco de dados
- 🔍 Revise os logs se suspeitar de acesso não autorizado

### 🐛 Reportar Vulnerabilidades

Se encontrar uma vulnerabilidade de segurança, **NÃO abra uma issue pública**.

## 🧰 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor dev (porta 3000)
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Verifica erros de lint
```

### Banco de Dados (Prisma)
```bash
npx prisma migrate dev       # Cria e aplica migration
npx prisma migrate reset     # Reseta banco (perde dados!)
npx prisma studio            # Interface visual do banco
npx prisma generate          # Gera Prisma Client
npx prisma db push           # Sincroniza schema sem migration
```

### Segurança
```bash
npm audit                    # Verifica vulnerabilidades
npm audit fix                # Corrige vulnerabilidades
npm update                   # Atualiza dependências

# Gerar novo SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🐛 Troubleshooting

### Erro: "SESSION_SECRET muito curto"
**Solução:** Gere um secret de 64 caracteres:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erro: "Can't reach database server"
**Solução:** Verifique se PostgreSQL está rodando:
```bash
# Windows (PowerShell)
Get-Service -Name postgresql*

# Linux/Mac
sudo service postgresql status
```

### Erro: "Muitas tentativas. Tente novamente em X minutos"
**Solução:** Rate limiting ativado. Aguarde ou limpe o cache (desenvolvimento):
```bash
# Reinicie o servidor dev
```

### Gráfico de despesas vazio
**Solução:** 
1. Adicione pelo menos uma despesa com categoria
2. Certifique-se de que selecionou categorias no onboarding
3. Verifique se a transação tem `categoryId` associado

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Você é livre para:
- ✅ Usar comercialmente
- ✅ Modificar
- ✅ Distribuir
- ✅ Usar em projetos privados

## 👨‍💻 Autor

Desenvolvido com 💚 por **[Pedro](https://github.com/phpedruo)**

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests
- ⭐ Dar uma estrela no repositório

## 🎨 Roadmap - Identidade Visual

### Próximas Melhorias
- [ ] **Paleta de Cores Própria**: Desenvolver sistema de cores único e profissional
- [ ] **Design System**: Criar componentes reutilizáveis com variantes consistentes
- [ ] **Ícones Personalizados**: Substituir emojis por ícones SVG customizados
- [ ] **Animações e Transições**: Micro-interações suaves e feedback visual
- [ ] **Dark Mode**: Implementar tema escuro alternável
- [ ] **Logo Profissional**: Criar logo vetorial com variações
- [ ] **Tipografia Aprimorada**: Hierarquia visual mais clara
- [ ] **Ilustrações**: Criar ilustrações customizadas para onboarding e estados vazios
- [ ] **Mobile-First**: Otimizar completamente para dispositivos móveis
- [ ] **Acessibilidade**: WCAG 2.1 compliance, navegação por teclado, contraste

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**

💡 **Dúvidas?** Abra uma [issue](https://github.com/phpedruo/mypocket/issues) ou entre em contato!

