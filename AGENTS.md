# Guia Rápido Valorant Ascension Next

> **Como usar:** siga cada seção em ordem quando estiver trabalhando no repositório; ela resume regras, comandos e checklists obrigatórios para agentes de IA.

**Descrição curta:** Guia rápido para agentes de IA colaborarem no monorepo Next.js/Prisma do Valorant Ascension Next.  
**Docs detalhados:** [CLAUDE.md](./CLAUDE.md)

---

## 📚 Stack-Specific Guides (opcional)

> Lista outros guias relevantes ou “N/A” se este já for o guia específico.

- **N/A** – Este repositório concentra o stack completo (Next.js App Router + Prisma + Tailwind).

---

## 🚨 Critical Rules - READ FIRST

> Liste no mínimo 5 regras essenciais. Use subtítulos enumerados com blocos ❌/✅ para comparação.

### 1. Preserve a estrutura do App Router
```bash
❌ NEVER: criar rotas fora de src/app ou ignorar page.tsx/layout.tsx dedicados
✅ ALWAYS: adicionar rotas, loaders e handlers sob src/app/<route>/ com page.tsx, layout.tsx ou route.ts
```

### 2. Proteja segredos e validações de env
```bash
❌ NEVER: commitar .env ou chaves diretas em src/**
✅ ALWAYS: usar env.mjs + @t3-oss/env-nextjs e confirmar DATABASE_URL antes de migrar
```

### 3. Use scripts oficiais para Prisma
```bash
❌ NEVER: rodar prisma migrate dev manualmente sem script
✅ ALWAYS: npm run prisma:migrate / npm run prisma:prod:deploy quando alterar schema
```

### 4. Garantir lint/type-check/tests antes de PR
```typescript
❌ NEVER: abrir PR sem npm run lint && npm run type-check && npm run test
✅ ALWAYS: rodar npm run test:ci ou npm run test:coverage para validar pipelines
```

### 5. Respeitar RBAC em rotas protegidas
```bash
❌ NEVER: expor dashboards/actions sem checar middleware.ts e guards do servidor
✅ ALWAYS: espelhar verificações existentes (middleware + server actions) para novas entradas admin
```

### 6. Formatação guiada por Prettier + Tailwind
```bash
❌ NEVER: editar classes Tailwind fora da ordem padronizada
✅ ALWAYS: rodar Prettier (prettier-plugin-tailwindcss) após refactors maiores
```

---

## 📁 Project / Stack Structure

> Descreva o layout principal com um bloco de código `tree` comentado.

```
valorant-ascension-next/
├── src/app           # Next.js App Router (page/layout/route handlers)
├── src/components    # UI primitives e blocks reutilizáveis
├── src/providers     # React contexts e providers globais
├── src/server|lib|utils  # Server actions, integrações e helpers
├── src/schemas|types # Schemas/contracts compartilhados
├── src/scss          # Estilos adicionais ao Tailwind
├── prisma            # schema.prisma, migrations e seed.ts
├── public            # Ativos estáticos
├── docs | scripts    # Notas operacionais e tooling auxiliar
└── README.md         # Visão geral e comandos básicos
```

- **Padrões de organização:** feature-first dentro de `src/app` (cada rota com page/layout/api), componentes em PascalCase, helpers camelCase.
- **Arquivos sensíveis:** `.env*`, `env.mjs`, `prisma/.env`, dados de seed contendo credenciais.

---

## ⚡ Essential Commands

> Separe por contexto (Development, Database, Testing, etc.). Inclua make targets ou npm scripts.

### Development
```bash
npm install
npm run dev
npm run build && npm run start
```

### Database / Tooling
```bash
npm run prisma:migrate
npm run prisma:prod:deploy
prisma/seed.ts via npm run prisma:seed (se disponível)
```

### Testing & Quality
```bash
npm run lint
npm run type-check
npm run test
npm run test:ci
npm run test:coverage
```

---

## 📝 Coding Standards

### Naming
- **Services / helpers:** `userService`, `getLoadoutStats`
- **Components:** `AgentCard.tsx`, `LoadoutGrid.tsx`
- **DTOs/Interfaces:** `AgentLoadout`, `AgentFilters`

### Formatting
- Indentação: 2 spaces
- Quotes: prefer default Prettier (normalmente double no TSX)
- Semicolons: required
- Lint/format command: `npm run lint` + `prettier --write .` (Prettier com `prettier-plugin-tailwindcss`)

### Style Guides (opcional)
- Next.js App Router conventions, Prisma schema best practices, Tailwind utility-first com classes ordenadas automaticamente.

---

## 🧪 Testing Rules

### Frontend / Fullstack Next.js
- **Locais dos testes:** arquivos adjacentes `*.test.ts[x]` ou `__tests__/file.spec.tsx`
- **Ferramentas:** Jest + `jest-environment-jsdom`, `jest.setup.js` para utilidades globais
- **Cobertura alvo:** smoke coverage para server actions/hooks/dashboards (acompanhar relatório do `npm run test:coverage`)

### Mandatory Commands Before Push
```bash
npm run lint
npm run type-check
npm run test
```

---

## 📋 Commit & PR Guidelines

### Commit Format
```
<type>(<scope>): <subject>
```

- **Tipos válidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
- **Regras:** tempo imperativo, cite escopo quando ajuda (`feat(dashboard): ...`), agrupe alterações relacionadas.

### PR Checklist
1. **Título:** `[ISSUE-ID] Resumo breve`
2. **Descrição:** detalhe mudanças, links, migrations ou env updates
3. **Testes:** anexar resultados dos comandos obrigatórios
4. **Screenshots:** incluir quando houver impacto visual
5. **Migrations:** destacar e instruir reviewers a rodar `npm run prisma:migrate`

---

## 🎯 AIDEV Anchors

```typescript
// AIDEV-NOTE: contexto adicional para futuras manutenções
// AIDEV-TODO: itens pendentes que não cabem no PR atual
// AIDEV-QUESTION: dúvidas abertas para o revisor/time
// AIDEV-CRITICAL: proteger lógicas sensíveis (pagamento, auth, RBAC)
// AIDEV-GOTCHA: armadilhas, race conditions, pitfalls
```

- **Antes de alterar módulos críticos:** `rg "AIDEV-" -n src prisma`
- **Quando adicionar:** integrações externas, trechos de segurança, fluxos complexos, lógica contábil ou migrações delicadas.

---

## 🔄 Workflow & Checklist

1. Revisar tarefas em `docs/` ou tickets associados e confirmar requisitos/flags.
2. Validar dependências, migrations pendentes e variáveis de ambiente (`DATABASE_URL`, Stripe, etc.).
3. Implementar seguindo padrões de módulo (App Router + providers + componentes).
4. Atualizar ou criar anchors `AIDEV-*` quando especializar lógica crítica.
5. Rodar `npm run lint`, `npm run type-check`, `npm run test` e verificações adicionais (coverage/CI).
6. Atualizar documentação relevante (`README.md`, `docs/*`, notas de mudança) antes de abrir PR.

### ✅ Pre-push Checklist

- [ ] `npm run lint` + `npm run type-check`
- [ ] `npm run test` (e `npm run test:coverage` quando aplicável)
- [ ] `npm run prisma:migrate` (se alterou schema) e versionar `prisma/migrations`
- [ ] Secrets e env revisados (`.env`, `env.mjs`)
- [ ] Documentação e screenshots atualizados
- [ ] `npm run build` opcional para validar produção se houver mudanças profundas

---

## 📚 Quick Documentation Lookup

| Necessidade | Documento |
| ----------- | --------- |
| Visão geral e comandos | `README.md`
| Configuração de ambiente/env | `env.mjs`, `.env.example` (se disponível) |
| Prisma schema/migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| Tooling / scripts | `scripts/`, `docs/` |
| Regras detalhadas para agentes | `CLAUDE.md` |

---

> **Nota final:** Ambiente local roda via `npm run dev` na porta 3000; confirme `DATABASE_URL` antes de executar `npm run prisma:migrate` para não afetar ambientes compartilhados.
