# CI/CD Pipeline Guide

Este documento explica como funciona a pipeline de CI/CD do projeto Valorant Ascension.

## 📋 Visão Geral

A pipeline está dividida em 4 workflows principais:

1. **CI (Quality Checks)** - Qualidade de código e build
2. **Security** - Verificações de segurança
3. **CodeQL** - Análise estática de código (SAST)
4. **Dependabot** - Atualizações automáticas de dependências

## 🔄 Workflows

### 1. CI - Quality Checks (`.github/workflows/ci.yml`)

**Quando executa:**
- Em Pull Requests para `main` ou `dev`
- Em pushes para `main` ou `dev`
- Manualmente via workflow_dispatch

**O que faz:**
- ✅ Instala dependências (pnpm)
- ✅ Gera Prisma Client
- ✅ Valida schema do Prisma
- ✅ Type-checking com TypeScript
- ✅ Lint com ESLint
- ✅ Executa testes (Jest)
- ✅ Build da aplicação
- ✅ Valida integridade do lockfile
- ✅ Verifica formato de commits (Conventional Commits)

**Jobs:**
- `quality` - Verificações principais
- `dependencies` - Validação de dependências
- `commit-lint` - Validação de mensagens de commit
- `ci-success` - Status final consolidado

**Tempo estimado:** ~5-10 minutos

---

### 2. Security Checks (`.github/workflows/security.yml`)

**Quando executa:**
- Em Pull Requests para `main` ou `dev`
- Em pushes para `main` ou `dev`
- Semanalmente (toda segunda-feira às 9h UTC)
- Manualmente via workflow_dispatch

**O que faz:**
- 🔒 npm audit (vulnerabilidades em dependências)
- 🔍 TruffleHog (scan de secrets acidentalmente commitados)
- 📦 Dependency Review (análise de novas dependências em PRs)
- 🛡️ OSV Scanner (vulnerabilidades conhecidas)
- 🔐 Validação de arquivos .env

**Jobs:**
- `npm-audit` - Audit de segurança do npm
- `secrets-scan` - Scan de secrets com TruffleHog
- `dependency-review` - Review de dependências em PRs
- `osv-scanner` - Scanner de vulnerabilidades OSV
- `env-validation` - Validação de env vars
- `security-success` - Status final consolidado

**Tempo estimado:** ~3-7 minutos

---

### 3. CodeQL Analysis (`.github/workflows/codeql.yml`)

**Quando executa:**
- Em Pull Requests para `main` ou `dev`
- Em pushes para `main` ou `dev`
- Semanalmente (toda segunda-feira às 10h UTC)
- Manualmente via workflow_dispatch

**O que faz:**
- 🔬 Análise estática de código (SAST)
- 🐛 Detecção de vulnerabilidades de segurança
- ⚠️ Identificação de bugs potenciais
- 📊 Geração de relatórios SARIF

**Verificações específicas Next.js:**
- Uso de `dangerouslySetInnerHTML` (XSS risk)
- Uso de `eval()` (code injection risk)
- Secrets hardcoded no código
- Server Actions sem validação

**Linguagens analisadas:**
- JavaScript/TypeScript

**Queries executadas:**
- `security-extended`
- `security-and-quality`

**Tempo estimado:** ~10-15 minutos

---

### 4. Dependabot (`.github/dependabot.yml`)

**Quando executa:**
- npm packages: semanalmente (toda segunda-feira às 9h UTC)
- GitHub Actions: mensalmente

**O que faz:**
- 📦 Atualiza dependências automaticamente
- 🔄 Cria PRs com updates agrupados
- 🏷️ Adiciona labels apropriadas
- 📝 Segue Conventional Commits

**Grupos de updates:**
- `nextjs` - Next.js, React, React-DOM
- `radix-ui` - Componentes Radix UI
- `development-tools` - ESLint, Prettier, TypeScript
- `prisma` - Prisma ORM
- `stripe` - Stripe SDK

**Configurações:**
- Máximo 10 PRs abertos simultaneamente
- Ignora updates major (breaking changes)
- Versioning strategy: `increase`

---

## 🚀 Deploy (Vercel)

O deploy é gerenciado automaticamente pela Vercel:

**Preview Deploys:**
- Criados automaticamente para cada PR
- URL única de preview
- Ambiente isolado para testes

**Production Deploys:**
- Automático ao mergear em `main`
- Executa após passar em todos os checks
- Migrations do Prisma executadas automaticamente

**Development Deploys:**
- Automático em pushes para `dev`
- Ambiente de desenvolvimento compartilhado

---

## ✅ Branch Protection Rules

Configure as seguintes regras no GitHub (Settings > Branches > main):

**Status checks obrigatórios:**
- ✅ CI Success
- ✅ Security Success
- ✅ CodeQL Analysis

**Outras configurações recomendadas:**
- ✅ Require a pull request before merging
- ✅ Require approvals (1+)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ❌ Do not allow bypassing the above settings

---

## 🧪 Executando Localmente

### Testes
```bash
# Rodar todos os testes
pnpm test

# Watch mode (desenvolvimento)
pnpm test:watch

# Com coverage
pnpm test:coverage

# CI mode (como na pipeline)
pnpm test:ci
```

### Type-checking
```bash
pnpm type-check
```

### Lint
```bash
# Verificar problemas
pnpm lint

# Auto-fix
pnpm lint --fix
```

### Prisma
```bash
# Validar schema
pnpm prisma:validate

# Gerar client
pnpm prisma:generate
```

### Build
```bash
# Build completo
pnpm build

# Iniciar produção
pnpm start
```

### Security Checks
```bash
# npm audit
pnpm audit

# Corrigir vulnerabilidades (quando possível)
pnpm audit fix

# Audit com nível específico
pnpm audit --audit-level=moderate
```

---

## 📊 Monitoramento

### GitHub Actions
- Vá para **Actions** tab no GitHub
- Visualize status de workflows
- Baixe artefatos (coverage, logs, etc.)

### Security Alerts
- Vá para **Security** tab no GitHub
- **Dependabot alerts** - Vulnerabilidades em dependências
- **Code scanning alerts** - Problemas encontrados pelo CodeQL
- **Secret scanning alerts** - Secrets detectados

### Coverage Reports
- Gerados automaticamente no CI
- Salvos como artifacts
- Visualize em: `coverage/lcov-report/index.html`

---

## 🔧 Configuração Inicial

### 1. Habilitar GitHub Features

No repositório, vá em **Settings > Code security and analysis**:

- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Dependabot version updates
- ✅ Secret scanning
- ✅ Push protection (recomendado)

### 2. Configurar Secrets (se necessário)

**Settings > Secrets and variables > Actions**

Adicione secrets se necessário para deploy ou integrações:
```
VERCEL_TOKEN (se usar deploy manual)
CODECOV_TOKEN (se usar CodeCov)
```

**Nota:** A Vercel gerencia deploy automaticamente, não precisa de secrets adicionais.

### 3. Configurar Branch Protection

**Settings > Branches > Add rule** para `main`:

Nome do padrão: `main`

Marque:
- ✅ Require a pull request before merging
  - Required approvals: 1
- ✅ Require status checks to pass
  - Required checks:
    - CI Success
    - Security Success
    - CodeQL Analysis
- ✅ Require conversation resolution
- ✅ Do not allow bypassing

### 4. Instalar Dependências de Teste

As dependências já estão no `package.json`, mas se precisar adicionar mais:

```bash
# Testing Library (opcional, para testes de componentes)
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Jest environment
pnpm add -D jest jest-environment-jsdom
```

---

## 🐛 Troubleshooting

### CI falhando no type-check
```bash
# Rodar localmente para ver erros
pnpm type-check

# Corrigir erros de tipo
# Verificar tsconfig.json
```

### Build falhando
```bash
# Verificar env vars necessárias
# Ver .env.example

# Testar build localmente
pnpm build
```

### Testes falhando
```bash
# Rodar testes localmente
pnpm test

# Ver output detalhado
pnpm test --verbose

# Atualizar snapshots (se necessário)
pnpm test -u
```

### Dependabot PRs não mergeando
- Verifique se os status checks estão passando
- Verifique se não há conflitos
- Re-run workflows se necessário

### CodeQL demorando muito
- Normal para primeira execução (~15-20 min)
- Execuções subsequentes são mais rápidas (cache)
- Considere aumentar timeout se necessário

---

## 📚 Recursos Adicionais

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [Jest Documentation](https://jestjs.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🤝 Contribuindo

Ao criar um PR:

1. ✅ Garanta que todos os checks passam
2. ✅ Use Conventional Commits (`feat:`, `fix:`, etc.)
3. ✅ Adicione testes quando aplicável
4. ✅ Atualize documentação se necessário
5. ✅ Resolva conversas antes do merge

---

**Mantido por:** Equipe Valorant Ascension
**Última atualização:** 2025-11-15
