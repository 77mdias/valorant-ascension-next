<div align="center">
  <h1>🎯 Valorant Ascension</h1>
  <p>Plataforma de treinamento com assinaturas (Stripe) — Next.js + Prisma + Auth.js</p>
  
  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5.2-000000?logo=nextdotjs&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
    <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6.15.0-2D3748?logo=prisma&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white" />
  </p>

  <p>
    <em>🚀 Sistema completo de aulas e assinaturas, responsivo e otimizado para mobile.</em>
  </p>

<a href="#índice">Ir para o Índice ↓</a>

</div>

Aplicação full‑stack construída com Next.js (App Router) para oferecer conteúdo de treinamento de Valorant com planos de assinatura. O projeto inclui autenticação, gerenciamento de assinaturas via Stripe, sincronização de status por webhook/polling, e um conjunto completo de modelos (aulas, agentes, mapas, conquistas) com seed e validações.

## Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🧰 Tecnologias](#-tecnologias)
  - [Frontend](#frontend)
  - [Backend & Database](#backend--database)
  - [Formulários & Validação](#formulários--validação)
  - [UI/UX](#uiux)
- [🧱 Arquitetura](#-arquitetura)
  - [Padrões de Design](#padrões-de-design)
  - [Estrutura de Rotas](#estrutura-de-rotas)
  - [Banco de Dados — Modelo Relacional](#banco-de-dados--modelo-relacional)
- [🖥️ Interface](#️-interface)
  - [Design System](#design-system)
  - [Experiência Mobile](#experiência-mobile)
- [🚀 Como Executar](#-como-executar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
- [🗄️ Banco de Dados](#️-banco-de-dados)
  - [Modelos Principais](#modelos-principais)
- [🔐 Segurança e Boas Práticas](#-segurança-e-boas-práticas)
- [💳 Stripe](#-stripe)
- [🧪 Scripts](#-scripts)
- [🛠️ Troubleshooting](#️-troubleshooting)

## 🧰 Tecnologias

### Frontend

- Next.js (App Router, Server/Client Components)
- Tailwind CSS + SCSS Modules para casos avançados

### Backend & Database

- Prisma ORM (PostgreSQL)
- Route Handlers (API interna) + Server Actions

### Formulários & Validação

- React Hook Form + Zod

### UI/UX

- Padrões acessíveis, feedbacks visuais e responsividade

## ✨ Funcionalidades

- 🔑 Autenticação segura (signin/signup) com Auth.js (NextAuth.js)
- 🧾 Assinaturas Stripe (checkout, upgrade/downgrade, cancelamento agendado)
- 🔁 Sincronização por Webhook com fallback de Polling (resiliente a falhas)
- 🧭 Página de preços com feedback do plano atual e ações contextuais
- 🎬 Catálogo de Aulas com Categorias, Progresso e Conteúdo Relacionado
- 🧩 Componentes reutilizáveis (Status de Pagamento, Banner de Plano, Cards)
- 🧹 Tipagens fortes em TypeScript e validações com Zod

## 🧱 Arquitetura

### Padrões de Design

- Camada de integração externa isolada em `src/lib/`
- Configurações compartilhadas em `src/config/`
- Componentes puros e reutilizáveis em `src/components/`
- Hooks de domínio em `src/hooks/`

### Estrutura de Rotas

- API: `src/app/api/**` (ex.: `create-checkout-session`, `subscription`, `webhooks`)
- Páginas: `src/app/**` (ex.: `prices`, `auth/signin`, `auth/signup`)

### Banco de Dados — Modelo Relacional

Modelos principais (resumo): `user`, `subscription`, `lessonCategory`, `lessons`, `classes`, `agents`, `agentRoles`, `maps`, `achievements`.

Diagrama (Mermaid):

```mermaid
erDiagram
  user ||--o{ subscription : has
  user ||--o{ lessons : created
  lessons }o--|| lessonCategory : belongs_to
  classes ||--o{ lessons : includes
  agents }o--|| agentRoles : has
  maps ||--o{ mapSites : has
```

## 🚀 Como Executar

### Pré-requisitos

- Node 18+
- pnpm 8+
- Banco PostgreSQL acessível

### Instalação

1. Instale as dependências:

```bash
pnpm install
```

2. Configure as variáveis de ambiente (ver seção abaixo).

3. Migrações e seed:

```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

4. Rodar a aplicação:

```bash
pnpm dev
```

Acesse `http://localhost:3000`.

## 💳 Stripe

Crie um arquivo `.env` com as variáveis (exemplos):

```env
# Conexões com banco de dados (Neon PostgreSQL)
# Note: use aspas duplas nas variáveis para evitar problemas com caracteres especiais
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"

# Conexões com banco de dados de produção (Neon PostgreSQL)
DATABASE_URL_PROD="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"
DIRECT_URL_PROD="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui-use-um-valor-seguro-gerado"

# Stripe (Pagamentos)
STRIPE_SECRET_KEY="sk_test_sua-chave-aqui"
STRIPE_WEBHOOK_SECRET_KEY="whsec_sua-chave-aqui"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sua-chave-aqui"

# E-mail
EMAIL_USER="seu-email@exemplo.com"
EMAIL_PASSWORD="sua-senha-ou-app-password"

# URL base do frontend (sem barra no final)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# IDs de preços Stripe (sempre price_...)
NEXT_PUBLIC_STRIPE_PRICE_BASICO="price_seu_id_aqui"
NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO="price_seu_id_aqui"
NEXT_PUBLIC_STRIPE_PRICE_AVANCADO="price_seu_id_aqui"

# API Externa (HenrikDev - Valorant)
HENRIKDEV_BASE_URL="https://henrikdev.xyz/api"
HENRIKDEV_API_KEY="sua-chave-api-aqui"

NEXT_PUBLIC_STRIPE_PRICE_AVANCADO=price_...
```

Observações:

- Use sempre IDs `price_...` (e não `prod_...`).
- Webhook em `/api/webhooks` (Node.js runtime + raw body + `constructEventAsync`).
- Fallback resiliente: `/api/check-session` sincroniza pagamento quando webhook falhar.

## 🗄️ Banco de Dados

- Ajuste `DATABASE_URL` no `.env`.
- Para aplicar schema e seed:

```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

### Modelos Principais

- 👤 `user`: dados do usuário, roles e relações (aulas, sessões, assinaturas)
- 💳 `subscription`: vínculo com usuário e Stripe (status, período, cancelAtPeriodEnd)
- 📚 `lessonCategory` e `lessons`: categorias e aulas (vídeo, duração, autor)
- 🗺️ `maps`/`mapSites`, 👤 `agents`/`agentRoles`, 🏆 `achievements`, etc.

Seed completo em `prisma/seed.ts` com validações (admin, categorias, relacionamentos) e 20 aulas (4 por categoria).

Fluxo suportado:

- Criação de sessão de checkout (`/api/create-checkout-session`)
- Verificação de sessão e sincronização manual (`/api/check-session`)
- Mudança de plano (`/api/subscription/change-plan`)
- Cancelamento com `cancel_at_period_end` (`/api/subscription/cancel`)
- Webhooks em `/api/webhooks` (Node.js runtime e raw body); quando houver falhas de assinatura, o sistema usa polling/manual sync para consistência

Stripe CLI (opcional, local):

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

## 🧪 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "prisma:deploy": "prisma migrate deploy",
  "prisma:seed": "prisma db seed"
}
```

Use `pnpm prisma:studio` para abrir o Prisma Studio.

## 🖥️ Interface

### Design System

- Tokens em Tailwind (cores, espaçamentos, tipografia)
- Componentes consistentes (cards, botões, banners)

### Experiência Mobile

- Layout responsivo (grid/cards)
- Estados de carregamento e erro padronizados

## Build e Deploy

Build local:

```bash
pnpm build
pnpm start
```

Em produção (ex.: Vercel), lembre de:

- Definir todas as variáveis de ambiente
- Apontar o webhook do Stripe para `/api/webhooks` (opcional; polling cobre inconsistências)
- Garantir banco acessível e migrado (`prisma migrate deploy`)

## 🔐 Segurança e Boas Práticas

- Nunca exponha chaves secretas no cliente (use `process.env` no servidor)
- Cookies HTTP‑Only e SameSite estritos com Auth.js
- Sempre valide entradas com Zod nas rotas
- Use `cancel_at_period_end` para evitar cobranças indevidas em cancelamento
- Controle de acesso por função (role) no servidor

## 🛠️ Troubleshooting

**Stripe: `No signatures found matching the expected signature for payload`**

- Garanta raw body no webhook (runtime Node.js e `constructEventAsync`)
- Se persistir, utilize o fluxo de polling com `/api/check-session`

**`priceId` inválido no checkout**

- Use IDs `price_...` corretos no `.env`

**Erros no Prisma Studio ao apagar/editar**

- Rode `pnpm prisma:deploy` e verifique drift
- Use `prisma studio` somente após migrações aplicadas

**Seed falhou criando aulas**

- Verifique se o admin foi criado e se todas as categorias constam nos logs do seed

---

Feito com ❤️ usando Next.js, Prisma, Auth.js e Stripe — foco em qualidade de código, segurança e DX.
