# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### ✨ Adicionado

- PRG-001: Página "Meu Progresso" para alunos
  - Nova rota `app/progresso` protegida pelo middleware, carregando dados reais de `lessonProgress`
  - Cards de horas estudadas, conclusão de aulas, streak atual/melhor e próxima conquista (mapeada para conquistas seed)
  - Gráfico de evolução (14 dias) e listas de aulas em andamento/concluídas com links rápidos; import dinâmico do chart para carregamento <2s
  - Link "Meu Progresso" adicionado ao header/menu

- VID-007: Testes e otimização de performance
  - Suites de teste para `VideoPlayer` e `useVideoProgress`, cobrindo controles, seek, persistência e hidratação remota
  - Player aplica `preconnect`/`dns-prefetch` dinâmicos, `preload: metadata` e pré-carrega thumbnails para reduzir TTFMP
  - Rota `cursos/[slug]` agora carrega o player de forma lazy via `IntersectionObserver` + importação dinâmica, mantendo placeholder leve

- VID-004: Qualidade de vídeo adaptativa
  - Player agora detecta níveis HLS disponíveis (1080p/720p/480p/360p) via `hls.js` e permite troca manual ou automática preservando o tempo de reprodução
  - Modo Auto usa `useNetworkSpeed` para sugerir qualidade com fallback quando a Network Information API não está disponível
  - Preferência persiste em `localStorage` e o seletor exibe apenas opções realmente disponíveis
- VID-005: Sistema de legendas/closed captions
  - Novo modelo Prisma `VideoSubtitle` com idioma único por aula, flag de padrão e revalidação automática das rotas
  - Upload seguro de `.vtt` via `/api/uploads/subtitle` usando helper `saveSubtitleFile` (validação de extensão/MIME e limite de 2MB)
  - Dashboard `/dashboard/lessons/[id]` ganhou `SubtitleManager` para CRUD completo (upload, edição, definição de padrão, exclusão)
  - Player `VideoPlayer` agora suporta trilhas WebVTT com seletor de legendas, persistência de preferência em `localStorage` e modo OFF
  - API `/api/categories/[slug]` entrega legendas ordenadas para SSR/CSR sem warnings
- VID-006: Registro de progresso de visualização
  - `lessonProgress` agora armazena `lastPosition`, `totalDuration`, `progress` obrigatório e `completedAt` (migration `20260116190000_vid_006_lesson_progress`)
  - Rota autenticada `/api/lessons/[lessonId]/progress` (GET/PUT) com validação Zod, cálculo automático de conclusão ≥90% e upsert idempotente
  - Hook `useVideoProgress` + `VideoPlayer` salvam a cada 5s, forçam flush em pause/end, retomam posição e exibem badge de conclusão; `/api/categories/[slug]` e `LessonCard` exibem status real das aulas
- VID-003: Controle de velocidade de reprodução
  - Hook `usePlaybackSpeed` para gerenciar estado e persistência de velocidade no localStorage
  - Componente `SpeedControl` com dropdown interativo para seleção de velocidade (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
  - Badge visual no player quando velocidade diferente de 1x (normal)
  - Navegação completa por teclado (Tab, Enter, Esc, Setas) e mouse
  - Integração com ReactPlayer através da propriedade `playbackRate`
  - Estilos SCSS seguindo design system do projeto (cores primary/secondary, animações suaves)
- VID-002: Sistema de marcação de timestamps
  - Novo modelo Prisma `VideoTimestamp`, schemas Zod e server actions para criar/editar/excluir registros com validação de duração
  - Tela `/dashboard/lessons/[id]` com gerenciador completo de timestamps para administradores
  - Lista clicável de timestamps integrada ao `VideoPlayer`, permitindo navegar rapidamente pelo conteúdo

### 📚 Documentação

- Estrutura completa de documentação em `/docs`
  - `/docs/architecture` - Diagramas e arquitetura do sistema
  - `/docs/guides` - Guias de uso e recursos
  - `/docs/api` - Documentação de APIs
  - `/docs/development` - Informações para desenvolvedores
  - `/docs/notes` - Notas técnicas de desenvolvimento
- Criação de `CHANGELOG.md`, `ROADMAP.md` e guia de desenvolvimento

## [0.1.0] - 2025-11-15

### ✨ Adicionado

#### Autenticação

- ✅ Sistema completo de autenticação com Auth.js (NextAuth.js)
- ✅ OAuth Google funcional (login e cadastro automático)
- ✅ Sistema de RBAC com três roles: CUSTOMER, ADMIN, PROFESSIONAL
- ✅ Proteção de rotas em múltiplas camadas (Middleware, Layout, Server Actions, UI)
- ✅ Páginas de signin/signup com validação Zod

#### Assinaturas e Pagamentos

- ✅ Integração completa com Stripe
- ✅ Três planos de assinatura: Básico, Intermediário, Avançado
- ✅ Sistema de checkout com Stripe Checkout Session
- ✅ Webhooks para sincronização automática de status
- ✅ Fallback de polling resiliente quando webhooks falham
- ✅ Upgrade/downgrade de planos
- ✅ Cancelamento agendado (`cancel_at_period_end`)
- ✅ Página de preços com feedback contextual do plano atual

#### Dashboard Admin

- ✅ CRUD completo de usuários (criar, listar, editar, deletar)
- ✅ CRUD completo de aulas (criar, listar, editar, deletar)
- ✅ CRUD completo de categorias de aulas
- ✅ Validação de permissões por role em todas as operações
- ✅ Interface responsiva e otimizada para mobile

#### Conteúdo

- ✅ Sistema de aulas com vídeos (integração com React Player)
- ✅ Categorias de aulas (Iniciante, Intermediário, Avançado, Pro, Extras)
- ✅ Progresso de aulas (tracking de visualizações)
- ✅ Conteúdo relacionado e sugestões
- ✅ Seed com 20 aulas de exemplo (4 por categoria)

#### Banco de Dados

- ✅ Schema Prisma completo com modelos:
  - User (usuários e roles)
  - Subscription (assinaturas Stripe)
  - LessonCategory (categorias de aulas)
  - Lessons (aulas/conteúdo)
  - Classes (turmas)
  - Agents (agentes Valorant)
  - AgentRoles (funções de agentes)
  - Maps (mapas)
  - MapSites (sites dos mapas)
  - Achievements (conquistas)
- ✅ Scripts de migração e seed automatizados
- ✅ Scripts separados para dev e produção
- ✅ Suporte para PostgreSQL (Neon Database)

#### UI/UX

- ✅ Design system com Tailwind CSS
- ✅ Componentes reutilizáveis (Radix UI)
- ✅ Layout responsivo (mobile-first)
- ✅ Dark mode (next-themes)
- ✅ Loading states e error handling
- ✅ Toast notifications (Sonner)
- ✅ Cards, banners e status de pagamento
- ✅ Páginas de erro customizadas (404, 500)

#### Integração Externa

- ✅ API HenrikDev para dados de Valorant
- ✅ Sincronização de MMR e partidas (estrutura base)

#### DevOps e Qualidade

- ✅ ESLint configurado com TypeScript
- ✅ Prettier com plugin Tailwind
- ✅ Configuração do Prisma com dois ambientes (dev/prod)
- ✅ Validação de variáveis de ambiente com @t3-oss/env-nextjs
- ✅ Scripts automatizados para Prisma
- ✅ DeepSource para análise de código
- ✅ Qodana para qualidade de código

### 🔒 Segurança

- ✅ Cookies HTTP-Only e SameSite estritos
- ✅ Validação de entrada com Zod em todas as camadas
- ✅ Secrets nunca expostos no cliente
- ✅ RBAC aplicado em server actions
- ✅ Proteção contra CSRF com Auth.js
- ✅ Hashing de senhas com bcrypt

### 📚 Documentação

- ✅ README completo com instruções de setup
- ✅ Guia de CRUD e Roles (`docs/crud-roles-complete-guide.md`)
- ✅ Diagrama de fluxo de autenticação (`docs/auth-flow-diagram.md`)
- ✅ Guia de CRUD do Dashboard (`docs/crud-guide.md`)
- ✅ Documentação OAuth Google (`docs/oauth-google-complete.md`)
- ✅ Guia de comandos Prisma (`docs/prisma-commands.md`)
- ✅ Notas técnicas de implementação (`docs/notes/`)

### 🐛 Corrigido

- ✅ Problemas de sincronização de assinaturas (implementado fallback de polling)
- ✅ Erros de validação de priceId no checkout
- ✅ Problemas de CORS em webhooks Stripe
- ✅ Drift no schema Prisma entre dev e prod
- ✅ Erros de autenticação com OAuth Google
- ✅ Layout quebrado em mobile (ajustado responsividade)

### 🔄 Alterado

- ✅ Migração de Pages Router para App Router (Next.js 15)
- ✅ Atualização de dependências para versões estáveis
- ✅ Refatoração de componentes para Server Components
- ✅ Melhoria na estrutura de pastas do projeto
- ✅ Otimização de queries Prisma

### 🚀 Performance

- ✅ Server Components por padrão (reduz bundle JS)
- ✅ Lazy loading de componentes pesados
- ✅ Otimização de imagens com next/image
- ✅ Caching estratégico de dados

---

## Tipos de Mudanças

- `✨ Adicionado` para novas funcionalidades
- `🔄 Alterado` para mudanças em funcionalidades existentes
- `🐛 Corrigido` para correções de bugs
- `🔒 Segurança` para vulnerabilidades corrigidas
- `📚 Documentação` para mudanças na documentação
- `🚀 Performance` para melhorias de performance
- `⚠️ Deprecated` para funcionalidades que serão removidas
- `❌ Removido` para funcionalidades removidas

---

## Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

---

**Última atualização**: 2026-01-16
