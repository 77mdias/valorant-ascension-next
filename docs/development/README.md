# 🛠️ Guia de Desenvolvimento

Este documento contém informações essenciais para desenvolvedores que desejam contribuir ou trabalhar no projeto **Valorant Ascension**.

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)

## 🚀 Configuração do Ambiente

### Pré-requisitos

- **Node.js**: 18+ (recomendado 20+)
- **pnpm**: 8+
- **PostgreSQL**: 14+ (ou acesso ao Neon Database)
- **Git**: Para controle de versão
- **Stripe CLI** (opcional): Para testes locais de webhooks

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/77mdias/valorant-ascension-next.git
cd valorant-ascension-next
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` (se existir) ou crie um `.env` com as seguintes variáveis:

```env
# Database (Development)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"

# Database (Production)
DATABASE_URL_PROD="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL_PROD="postgresql://user:password@host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-seguro-com-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_sua-chave"
STRIPE_WEBHOOK_SECRET_KEY="whsec_sua-chave"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sua-chave"
NEXT_PUBLIC_STRIPE_PRICE_BASICO="price_..."
NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO="price_..."
NEXT_PUBLIC_STRIPE_PRICE_AVANCADO="price_..."

# Email
EMAIL_USER="seu-email@exemplo.com"
EMAIL_PASSWORD="sua-senha-ou-app-password"

# Frontend
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# API Externa (HenrikDev - Valorant)
HENRIKDEV_BASE_URL="https://henrikdev.xyz/api"
HENRIKDEV_API_KEY="sua-chave-api"
```

4. **Configure o banco de dados**

```bash
# Gerar cliente Prisma
pnpm prisma:generate

# Aplicar migrações
pnpm prisma:migrate

# Popular banco com dados iniciais
pnpm prisma db seed
```

5. **Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

Acesse `http://localhost:3000` 🎉

## 📁 Estrutura do Projeto

```
valorant-ascension-next/
├── docs/                      # Documentação completa
│   ├── architecture/          # Diagramas e arquitetura
│   ├── guides/                # Guias de uso e recursos
│   ├── api/                   # Documentação de APIs
│   ├── development/           # Informações para desenvolvedores
│   │   ├── README.md          # Este arquivo
│   │   ├── CHANGELOG.md       # Histórico de mudanças
│   │   ├── ROADMAP.md         # Planejamento futuro
│   │   └── tasks/             # Tarefas e issues organizadas
│   └── notes/                 # Notas de desenvolvimento
├── prisma/                    # Schema e migrações do banco
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/                    # Arquivos estáticos
├── scripts/                   # Scripts auxiliares
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # Route handlers
│   │   ├── auth/              # Páginas de autenticação
│   │   ├── dashboard/         # Dashboard admin
│   │   └── ...
│   ├── components/            # Componentes React
│   ├── config/                # Configurações
│   ├── data/                  # Dados estáticos
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Bibliotecas e utilitários
│   ├── prisma/                # Cliente Prisma configurado
│   ├── providers/             # Context providers
│   ├── schemas/               # Schemas Zod de validação
│   ├── scss/                  # Estilos SCSS
│   ├── server/                # Server actions e services
│   ├── types/                 # TypeScript types
│   └── utils/                 # Funções utilitárias
└── ...
```

## 🔄 Workflow de Desenvolvimento

### Branches

- **`main`**: Branch principal de produção
- **`develop`**: Branch de desenvolvimento
- **`feature/*`**: Novas funcionalidades
- **`bugfix/*`**: Correções de bugs
- **`hotfix/*`**: Correções urgentes para produção

### Fluxo de Trabalho

1. **Crie uma branch a partir de `develop`**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
```

2. **Desenvolva sua funcionalidade**
   - Faça commits atômicos e descritivos
   - Siga os padrões de código do projeto
   - Adicione testes quando necessário

3. **Commit com mensagens descritivas**

```bash
git add .
git commit -m "🧸 feat: adiciona funcionalidade X"
```

**Convenção de commits:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Tarefas de build, configs, etc

4. **Push e Pull Request**

```bash
git push origin feature/nome-da-feature
```

Crie um Pull Request no GitHub para `develop`.

## 📝 Padrões de Código

### TypeScript

- **Use tipos explícitos** sempre que possível
- **Evite `any`**: Prefira `unknown` ou tipos específicos
- **Interfaces vs Types**: Use `interface` para objetos, `type` para unions/intersections

### React

- **Componentes funcionais** com hooks
- **Server Components** por padrão (Next.js 15)
- **Client Components** apenas quando necessário (`use client`)
- **Nomenclatura**: PascalCase para componentes

### Validação

- **Zod schemas** em `src/schemas/`
- **Validação dupla**: Client + Server
- **Mensagens de erro** claras e em português

### Styling

- **Tailwind CSS** como padrão
- **SCSS Modules** para estilos complexos
- **Nomenclatura**: kebab-case para classes CSS

### Prisma

- **Use os scripts personalizados** para ambiente:
  - Dev: `pnpm prisma:validate`, `pnpm prisma:migrate`, etc
  - Prod: `pnpm prisma:prod:deploy`, `pnpm prisma:prod:status`, etc

### Segurança

- **RBAC**: Sempre valide roles em Server Actions
- **Environment Variables**: Nunca exponha secrets no cliente
- **Validação**: Zod em todas as entradas de dados
- **Auth.js**: Use sessão para autenticação

## 🧪 Testes

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Testes em modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

- Manter cobertura alta para `VideoPlayer` e hooks críticos (`useVideoProgress`), meta ≥80% usando `pnpm test:coverage`
- Player de cursos é carregado de forma lazy (importação dinâmica + IntersectionObserver); preserve a estratégia para garantir métricas de performance (Lighthouse >90)
- Utilize `preconnect`/`dns-prefetch` e `preload: metadata` ao adicionar novas fontes de vídeo para evitar regressões de TTFMP

### Tipos de Testes

- **Unitários**: Funções e utilitários
- **Integração**: Server Actions e API Routes
- **E2E**: Fluxos críticos (em desenvolvimento)

## 📚 Documentação

### Onde Documentar

- **Features novas**: Adicione em `/docs/guides/`
- **Mudanças de arquitetura**: Atualize `/docs/architecture/`
- **APIs**: Documente em `/docs/api/`
- **Notas técnicas**: Use `/docs/notes/` com data (YYYY-MM-DD)

### Mantenha Atualizado

- **CHANGELOG.md**: Registre mudanças significativas
- **ROADMAP.md**: Atualize conforme features são implementadas
- **README.md (raiz)**: Mantenha sincronizado com funcionalidades

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                      # Inicia servidor de desenvolvimento
pnpm build                    # Build para produção
pnpm start                    # Inicia servidor de produção
pnpm lint                     # Executa ESLint

# Prisma (Development)
pnpm prisma:validate          # Valida schema
pnpm prisma:generate          # Gera cliente Prisma
pnpm prisma:studio            # Abre Prisma Studio
pnpm prisma:push              # Push schema para DB (sem migration)
pnpm prisma:migrate           # Cria e aplica migration
pnpm prisma:status            # Status das migrations

# Prisma (Production)
pnpm prisma:prod:validate     # Valida schema de produção
pnpm prisma:prod:generate     # Gera cliente para produção
pnpm prisma:prod:studio       # Studio conectado à produção
pnpm prisma:prod:deploy       # Aplica migrations em produção
pnpm prisma:prod:status       # Status de produção
pnpm prisma:prod:introspect   # Introspect DB de produção
```

## 🐛 Debugging

### Prisma Studio

```bash
pnpm prisma:studio
```

Acesse `http://localhost:5555` para visualizar e editar dados.

### Logs

- **Next.js**: Verifique o console do terminal
- **Stripe Webhooks**: Use `stripe listen --forward-to localhost:3000/api/webhooks`
- **Database**: Ative logs no Prisma (veja `prisma.config.ts`)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m '🧸 feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/77mdias/valorant-ascension-next/issues)
- **Documentação**: Veja `/docs/` para guias detalhados
- **Email**: [Seu email de contato]

---

**Feito com ❤️ pela equipe Valorant Ascension**
