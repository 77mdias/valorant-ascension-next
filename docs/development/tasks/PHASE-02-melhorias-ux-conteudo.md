# 🚀 Tasks - Fase 0.2.0: Melhorias de UX e Conteúdo

> **Como usar:** Este arquivo documenta todas as tarefas da fase v0.2.0. Atualize o status de cada tarefa conforme o progresso e mantenha a tabela de resumo sincronizada.

**Status:** 🟡 EM ANDAMENTO
**Última atualização:** 2025-11-15
**Sprint Atual:** Novembro-Dezembro 2025
**Status Geral:** 🟡 6% concluído (2/32 tarefas completas) – FASE ATIVA
**ETA:** 2025-12-01
**Pré-requisito:** v0.1.0 - MVP (✅ Concluído)

---

## 📊 Resumo de Progresso

| Categoria                     | Total | Concluído | Em Andamento | Pendente | Bloqueado |
| ----------------------------- | ----- | --------- | ------------ | -------- | --------- |
| Sistema de Vídeos Avançado    | 7     | 2         | 0            | 5        | 0         |
| Dashboard de Progresso        | 7     | 0         | 0            | 7        | 0         |
| Sistema de Conquistas         | 6     | 0         | 0            | 6        | 0         |
| Busca e Filtros               | 6     | 0         | 0            | 6        | 0         |
| Sistema de Comentários        | 6     | 0         | 0            | 6        | 0         |
| **TOTAL**                     | **32** | **2**    | **0**        | **30**   | **0**     |

### 🎯 Principais Indicadores
- ✅ v0.1.0 MVP concluído com sucesso
- 🎯 Meta: 100+ usuários ativos mensais
- 🎯 Meta: 10%+ taxa de conversão para assinatura
- 🎯 Meta: 15min+ tempo médio de sessão
- ⚠️ Prazo apertado: 16 dias para conclusão da fase

---

## 🎯 Objetivos da Fase

Esta fase tem como objetivo elevar a experiência do usuário e expandir o conteúdo da plataforma com funcionalidades que aumentem o engajamento e a retenção de alunos:

1. **Melhorar a experiência de consumo de vídeos** com player customizado e recursos avançados
2. **Criar dashboard de progresso individual** para alunos acompanharem sua evolução
3. **Implementar sistema de gamificação básico** com conquistas e notificações
4. **Facilitar a descoberta de conteúdo** com busca avançada e filtros inteligentes
5. **Fomentar engajamento comunitário** através de sistema de comentários e interações
6. **Aumentar métricas de retenção** (tempo de sessão, taxa de retorno, NPS)
7. **Estabelecer fundação técnica** para features de gamificação da v0.3.0

---

## 📦 Estrutura de Categorias

### 📦 VID - Sistema de Vídeos Avançado

#### Objetivo
Transformar o player de vídeo básico em uma experiência premium, com controles avançados, acessibilidade e recursos que facilitam o aprendizado (timestamps, velocidade ajustável, legendas).

#### VID.1 - Player Customizado e Controles ✅

- [x] **VID-001** - Implementar player de vídeo customizado ✅

  **Descrição curta:**
  - Substituir player nativo por solução customizada (react-player ou plyr)
  - Adicionar controles personalizados com design consistente da marca
  - Implementar teclado shortcuts (espaço = pause/play, setas = seek, etc.)

  **Implementação sugerida:**
  1. Instalar e configurar biblioteca de player (react-player recomendado)
  2. Criar componente `VideoPlayer` em `src/components/ui/VideoPlayer.tsx`
  3. Implementar controles customizados (play/pause, volume, fullscreen)
  4. Adicionar hotkeys usando hook `useKeyboardShortcuts`
  5. Criar módulo SCSS para estilização consistente

  **Arquivos/áreas afetadas:**
  - `src/components/ui/VideoPlayer.tsx` (novo)
  - `src/components/ui/VideoPlayer.module.scss` (novo)
  - `src/hooks/useKeyboardShortcuts.ts` (novo)
  - `src/app/cursos/[id]/page.tsx` (atualizar para usar novo player)
  - `package.json` (adicionar react-player)

  **Critérios de aceitação:**
  - [x] Player renderiza vídeos de URL externa (YouTube, Vimeo, direto)
  - [x] Controles responsivos funcionam em mobile e desktop
  - [x] Hotkeys funcionam quando player está focado
  - [x] Design consistente com design system da aplicação
  - [x] Sem erros de console ou warnings

  **Notas de validação (2025-11-15):**
  - `src/components/ui/VideoPlayer.tsx` usa `react-player@3.3.x` com estado controlado (`playing`, `volume`, `muted`) para carregar URLs externas de aulas e tratar buffering/erros.
  - Controles customizados (seek, volume, fullscreen e botões de navegação) e estilos responsivos residem em `src/components/ui/VideoPlayer.module.scss`, cobrindo tamanhos mobile/desktop.
  - Atalhos de teclado (espaço, setas, F) são habilitados via `src/hooks/useKeyboardShortcuts.ts`, limitado ao foco do container para obedecer acessibilidade.
  - O player substitui o componente antigo na rota `src/app/cursos/[slug]/page.tsx`, mantendo o visual neon/tailwind do design system e aplicação dos botões `gamingButton`.
  - A implementação evita warnings: eventos críticos são tratados (ex.: fallback do fullscreen) e não há logs extras além do `console.error` controlado em falhas reais.

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 8h
  **Dependências:** Nenhuma
  **Status:** 🟢 Concluído (2025-11-15) ✅

---

- [x] **VID-002** - Sistema de marcação de timestamps

  **Descrição curta:**
  - Permitir que administradores/profissionais marquem timestamps importantes em vídeos
  - Exibir lista de timestamps clicáveis para navegação rápida
  - Adicionar campo de texto descritivo para cada timestamp

  **Implementação sugerida:**
  1. Adicionar modelo `VideoTimestamp` ao schema Prisma:
     ```prisma
     model VideoTimestamp {
       id        String   @id @default(uuid())
       lessonId  String
       time      Int      // segundos
       label     String   // "Estratégia de ataque em Bind"
       createdAt DateTime @default(now())
       lesson    lessons  @relation(...)
     }
     ```
  2. Criar server action `createTimestamp`, `updateTimestamp`, `deleteTimestamp`
  3. Criar componente `TimestampList` para exibição lateral
  4. Adicionar UI de criação de timestamps no dashboard admin
  5. Implementar navegação ao clicar em timestamp

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar modelo)
  - `src/server/videoTimestampActions.ts` (novo)
  - `src/schemas/videoTimestamp.ts` (novo)
  - `src/components/VideoPlayer/TimestampList.tsx` (novo)
  - `src/app/dashboard/lessons/[id]/components/TimestampManager.tsx` (novo)

  **Critérios de aceitação:**
  - [x] Admins podem criar/editar/deletar timestamps em aulas
  - [x] Timestamps aparecem ordenados cronologicamente
  - [x] Clicar em timestamp navega para o momento correto do vídeo
  - [x] Validação impede timestamps negativos ou maiores que duração
  - [x] Migration aplicada sem erros

  **Notas de validação (2025-11-15):**
  - Prisma atualizado com o modelo `VideoTimestamp` (migration `20251115155616_vid_002_video_timestamps`) e relação com `lessons` em `prisma/schema.prisma`.
  - Schemas/server actions (`src/schemas/videoTimestamp.ts`, `src/server/videoTimestampActions.ts`) executam validações de duração e revalidam `/dashboard/lessons` e rotas públicas ao criar/editar/deletar.
  - Dashboard ganhou a rota `/dashboard/lessons/[id]` com `TimestampManager` (componentes em `src/app/dashboard/lessons/[id]/components/TimestampManager.tsx`) permitindo CRUD completo com feedback visual.
  - API `/api/categories/[slug]` agora entrega timestamps; o player (`src/components/ui/VideoPlayer.tsx`) usa `TimestampList` para exibição e navegação, consumido em `src/app/cursos/[slug]/page.tsx`.
  - A lista lateral dispara `seekTo` no ReactPlayer com validação preventiva de tempo, garantindo navegação sem ultrapassar a duração definida.

  **Prioridade:** 🟡 Alta
  **Estimativa:** 6h
  **Dependências:** VID-001
  **Status:** 🟢 Concluído (2025-11-15) ✅

---

- [ ] **VID-003** - Controle de velocidade de reprodução

  **Descrição curta:**
  - Adicionar seletor de velocidade (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
  - Persistir preferência de velocidade no localStorage
  - Exibir indicador visual de velocidade atual

  **Implementação sugerida:**
  1. Adicionar controle de velocidade ao componente `VideoPlayer`
  2. Criar hook `usePlaybackSpeed` para gerenciar estado e persistência
  3. Adicionar menu dropdown para seleção de velocidade
  4. Implementar feedback visual (badge com "1.5x" quando diferente de 1x)

  **Arquivos/áreas afetadas:**
  - `src/components/ui/VideoPlayer.tsx` (atualizar)
  - `src/hooks/usePlaybackSpeed.ts` (novo)
  - `src/components/VideoPlayer/SpeedControl.tsx` (novo)

  **Critérios de aceitação:**
  - [ ] Todas as velocidades funcionam corretamente
  - [ ] Preferência persiste entre sessões
  - [ ] UI acessível via teclado e mouse
  - [ ] Indicador visual claro da velocidade atual
  - [ ] Funciona em todos os navegadores suportados

  **Prioridade:** 🟢 Média
  **Estimativa:** 3h
  **Dependências:** VID-001
  **Status:** 🔴 Pendente

---

- [ ] **VID-004** - Qualidade de vídeo adaptativa

  **Descrição curta:**
  - Detectar qualidades disponíveis do vídeo
  - Permitir seleção manual de qualidade (480p, 720p, 1080p, Auto)
  - Implementar seleção automática baseada em velocidade de conexão

  **Implementação sugerida:**
  1. Configurar react-player para detectar qualidades disponíveis
  2. Criar componente `QualitySelector` com dropdown de opções
  3. Implementar lógica de detecção de bandwidth (Network Information API)
  4. Adicionar modo "Auto" que ajusta dinamicamente
  5. Persistir preferência em localStorage

  **Arquivos/áreas afetadas:**
  - `src/components/ui/VideoPlayer.tsx` (atualizar)
  - `src/components/VideoPlayer/QualitySelector.tsx` (novo)
  - `src/hooks/useNetworkSpeed.ts` (novo)

  **Critérios de aceitação:**
  - [ ] Seletor exibe apenas qualidades disponíveis para o vídeo
  - [ ] Modo "Auto" funciona corretamente
  - [ ] Transição entre qualidades é suave (sem interrupção)
  - [ ] Preferência persiste entre sessões
  - [ ] Fallback gracioso quando API não suportada

  **Prioridade:** 🔵 Baixa
  **Estimativa:** 5h
  **Dependências:** VID-001
  **Status:** 🔴 Pendente

---

- [ ] **VID-005** - Sistema de legendas/closed captions

  **Descrição curta:**
  - Suporte a arquivos .vtt (WebVTT) para legendas
  - CRUD de legendas no dashboard admin
  - Opção de ativar/desativar legendas no player
  - Suporte a múltiplos idiomas (PT-BR, EN inicialmente)

  **Implementação sugerida:**
  1. Adicionar modelo `VideoSubtitle` ao Prisma:
     ```prisma
     model VideoSubtitle {
       id        String   @id @default(uuid())
       lessonId  String
       language  String   // "pt-BR", "en"
       label     String   // "Português (Brasil)"
       fileUrl   String   // URL do arquivo .vtt
       isDefault Boolean  @default(false)
       lesson    lessons  @relation(...)
     }
     ```
  2. Criar server actions para CRUD de legendas
  3. Implementar upload de arquivos .vtt (validar formato)
  4. Adicionar controle de legendas ao player
  5. Criar UI de gerenciamento no dashboard

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar modelo)
  - `src/server/videoSubtitleActions.ts` (novo)
  - `src/schemas/videoSubtitle.ts` (novo)
  - `src/components/ui/VideoPlayer.tsx` (atualizar)
  - `src/app/dashboard/lessons/[id]/components/SubtitleManager.tsx` (novo)
  - `src/lib/fileUpload.ts` (novo - upload de .vtt)

  **Critérios de aceitação:**
  - [ ] Upload de arquivos .vtt com validação de formato
  - [ ] Player exibe legendas corretamente sincronizadas
  - [ ] Usuário pode alternar entre idiomas disponíveis
  - [ ] Preferência de legenda persiste (localStorage)
  - [ ] Acessibilidade: legendas visíveis e legíveis

  **Prioridade:** 🟡 Alta
  **Estimativa:** 8h
  **Dependências:** VID-001
  **Status:** 🔴 Pendente
  **Notas adicionais:**
  - Considerar integração futura com serviços de transcrição automática (OpenAI Whisper)
  - Ver `docs/accessibility/` para requisitos de acessibilidade

---

- [ ] **VID-006** - Registro de progresso de visualização

  **Descrição curta:**
  - Salvar timestamp atual do vídeo a cada 5 segundos
  - Retomar vídeo de onde parou quando usuário voltar
  - Marcar aula como "concluída" ao assistir 90%+

  **Implementação sugerida:**
  1. Adicionar modelo `LessonProgress` ao Prisma:
     ```prisma
     model LessonProgress {
       id              String   @id @default(uuid())
       userId          String
       lessonId        String
       lastPosition    Int      // segundos
       totalDuration   Int      // segundos
       completed       Boolean  @default(false)
       completedAt     DateTime?
       updatedAt       DateTime @updatedAt
       user            user     @relation(...)
       lesson          lessons  @relation(...)
       @@unique([userId, lessonId])
     }
     ```
  2. Criar server action `updateLessonProgress`
  3. Implementar hook `useVideoProgress` que salva periodicamente
  4. Adicionar lógica de auto-completar ao atingir 90%
  5. Exibir badge "Assistido" em aulas concluídas

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar modelo)
  - `src/server/lessonProgressActions.ts` (novo)
  - `src/schemas/lessonProgress.ts` (novo)
  - `src/hooks/useVideoProgress.ts` (novo)
  - `src/components/ui/VideoPlayer.tsx` (atualizar)
  - `src/app/cursos/[id]/page.tsx` (carregar progresso inicial)

  **Critérios de aceitação:**
  - [ ] Progresso salvo automaticamente a cada 5 segundos
  - [ ] Vídeo retoma de onde parou ao reabrir
  - [ ] Aula marcada como concluída automaticamente aos 90%
  - [ ] Sem race conditions ou perda de dados
  - [ ] Performance não impactada (debounce correto)

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 6h
  **Dependências:** VID-001
  **Status:** 🔴 Pendente
  **Notas adicionais:**
  - Esta tarefa é pré-requisito para PRG-001 (Dashboard de Progresso)

---

- [ ] **VID-007** - Testes e otimização de performance

  **Descrição curta:**
  - Criar testes unitários para componente VideoPlayer
  - Testar em diferentes navegadores e dispositivos
  - Otimizar lazy loading e preload de recursos
  - Garantir performance Lighthouse 90+ na página de aula

  **Implementação sugerida:**
  1. Criar suite de testes com Jest + React Testing Library
  2. Testar todos os controles e interações do player
  3. Implementar lazy loading do player (carregar só quando visível)
  4. Adicionar preconnect para CDNs de vídeo
  5. Medir e otimizar Core Web Vitals

  **Arquivos/áreas afetadas:**
  - `src/components/ui/__tests__/VideoPlayer.test.tsx` (novo)
  - `src/hooks/__tests__/useVideoProgress.test.ts` (novo)
  - `src/app/cursos/[id]/page.tsx` (otimizar)

  **Critérios de aceitação:**
  - [ ] Cobertura de testes >80% para componente VideoPlayer
  - [ ] Player funciona em Chrome, Firefox, Safari, Edge
  - [ ] Player responsivo funciona em iOS e Android
  - [ ] Lighthouse Performance score >90
  - [ ] Sem memory leaks detectados

  **Prioridade:** 🟡 Alta
  **Estimativa:** 5h
  **Dependências:** VID-001, VID-002, VID-003, VID-004, VID-005, VID-006
  **Status:** 🔴 Pendente

---

### 📦 PRG - Dashboard de Progresso do Aluno

#### Objetivo
Criar uma área dedicada onde alunos (role: CUSTOMER) possam visualizar sua evolução, estatísticas de estudo, conquistas desbloqueadas e metas, aumentando engajamento e motivação.

#### PRG.1 - Página "Meu Progresso"

- [ ] **PRG-001** - Criar página principal de progresso do aluno

  **Descrição curta:**
  - Nova rota `/progresso` acessível apenas para usuários autenticados
  - Layout com cards de estatísticas principais
  - Gráficos visuais de evolução temporal
  - Integração com dados de `LessonProgress` e futuros `Achievement`

  **Implementação sugerida:**
  1. Criar página `src/app/progresso/page.tsx`
  2. Implementar proteção de rota no middleware (require auth)
  3. Criar layout com grid responsivo (mobile-first)
  4. Adicionar cards de estatísticas gerais:
     - Total de horas estudadas
     - Aulas concluídas / total disponível
     - Streak atual (dias consecutivos)
     - Próxima conquista a desbloquear
  5. Implementar navegação no menu principal

  **Arquivos/áreas afetadas:**
  - `src/app/progresso/page.tsx` (novo)
  - `src/app/progresso/layout.tsx` (novo - layout específico)
  - `src/app/progresso/components/` (novos componentes)
  - `middleware.ts` (adicionar rota protegida)
  - `src/components/Header.tsx` (adicionar link "Meu Progresso")

  **Critérios de aceitação:**
  - [ ] Rota acessível apenas para usuários autenticados
  - [ ] Redirecionamento correto para login se não autenticado
  - [ ] Layout responsivo funciona em mobile e desktop
  - [ ] Cards renderizam dados reais do usuário logado
  - [ ] Performance: carregamento <2s

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 6h
  **Dependências:** VID-006 (LessonProgress model)
  **Status:** 🔴 Pendente

---

- [ ] **PRG-002** - Gráfico de tempo de estudo

  **Descrição curta:**
  - Gráfico de linhas/barras mostrando horas estudadas por dia/semana/mês
  - Filtros de período (7 dias, 30 dias, 3 meses, ano)
  - Biblioteca de charts (recharts ou chart.js)

  **Implementação sugerida:**
  1. Instalar biblioteca recharts (`pnpm add recharts`)
  2. Criar server action `getStudyTimeStats(userId, period)`
  3. Agregar dados de `LessonProgress.updatedAt` e `duration`
  4. Criar componente `StudyTimeChart` com recharts
  5. Adicionar filtros de período com tabs

  **Arquivos/áreas afetadas:**
  - `src/server/progressActions.ts` (novo)
  - `src/app/progresso/components/StudyTimeChart.tsx` (novo)
  - `package.json` (adicionar recharts)

  **Critérios de aceitação:**
  - [ ] Gráfico renderiza corretamente em todos os períodos
  - [ ] Dados agregados corretamente (sem duplicação)
  - [ ] Tooltip exibe informações detalhadas ao hover
  - [ ] Responsivo: adapta-se a diferentes tamanhos de tela
  - [ ] Sem erros de hidratação (SSR/CSR)

  **Prioridade:** 🟡 Alta
  **Estimativa:** 5h
  **Dependências:** PRG-001
  **Status:** 🔴 Pendente

---

- [ ] **PRG-003** - Lista de aulas concluídas vs. pendentes

  **Descrição curta:**
  - Duas listas/cards exibindo aulas concluídas e em andamento
  - Porcentagem visual de progresso em cada aula
  - Link direto para retomar aula de onde parou

  **Implementação sugerida:**
  1. Criar server action `getUserLessons(userId)` retornando:
     - Aulas em andamento (0% < progresso < 90%)
     - Aulas concluídas (progresso >= 90%)
     - Aulas não iniciadas (sem registro em LessonProgress)
  2. Criar componente `LessonProgressList`
  3. Adicionar barra de progresso visual (0-100%)
  4. Implementar ordenação (mais recente primeiro)

  **Arquivos/áreas afetadas:**
  - `src/server/progressActions.ts` (atualizar)
  - `src/app/progresso/components/LessonProgressList.tsx` (novo)
  - `src/components/ui/ProgressBar.tsx` (novo - reutilizável)

  **Critérios de aceitação:**
  - [ ] Listas exibem dados corretos e atualizados
  - [ ] Progresso visual preciso (corresponde aos dados)
  - [ ] Link "Continuar assistindo" retoma no timestamp correto
  - [ ] Paginação ou scroll infinito se muitas aulas
  - [ ] Performance: renderização otimizada (virtual scroll se necessário)

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** PRG-001
  **Status:** 🔴 Pendente

---

- [ ] **PRG-004** - Exibição de conquistas desbloqueadas

  **Descrição curta:**
  - Grid de conquistas do usuário (desbloqueadas e bloqueadas)
  - Visual diferenciado para conquistas bloqueadas (grayscale)
  - Modal com detalhes ao clicar em conquista

  **Implementação sugerida:**
  1. Criar componente `AchievementGrid`
  2. Buscar conquistas do usuário via server action
  3. Renderizar badges com ícones e raridade (cores diferentes)
  4. Implementar modal de detalhes com descrição e data de desbloqueio
  5. Adicionar tooltip com nome da conquista ao hover

  **Arquivos/áreas afetadas:**
  - `src/app/progresso/components/AchievementGrid.tsx` (novo)
  - `src/components/ui/AchievementBadge.tsx` (novo - reutilizável)
  - `src/components/ui/AchievementModal.tsx` (novo)

  **Critérios de aceitação:**
  - [ ] Grid responsivo (ajusta colunas conforme tela)
  - [ ] Conquistas bloqueadas claramente diferenciadas
  - [ ] Modal exibe todas as informações relevantes
  - [ ] Animação suave ao abrir/fechar modal
  - [ ] Acessível via teclado (tab, enter, escape)

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** PRG-001, ACH-001 (modelo de conquistas)
  **Status:** 🔴 Pendente

---

- [ ] **PRG-005** - Sistema de streak (dias consecutivos)

  **Descrição curta:**
  - Calcular e exibir streak de dias consecutivos estudando
  - Considerar "dia válido" = assistir pelo menos 5 minutos de aula
  - Exibir histórico de streak (melhor streak, atual, etc.)
  - Notificação quando streak está em risco

  **Implementação sugerida:**
  1. Criar função de cálculo de streak em `src/lib/streakCalculator.ts`
  2. Agregar dados de `LessonProgress.updatedAt` por dia
  3. Implementar lógica de "dias consecutivos" considerando timezone
  4. Criar componente `StreakDisplay` com ícone de fogo/calendário
  5. Adicionar tooltip explicativo sobre como funciona

  **Arquivos/áreas afetadas:**
  - `src/lib/streakCalculator.ts` (novo)
  - `src/server/progressActions.ts` (adicionar `getUserStreak`)
  - `src/app/progresso/components/StreakDisplay.tsx` (novo)

  **Critérios de aceitação:**
  - [ ] Cálculo de streak preciso considerando timezone do usuário
  - [ ] Diferenciação clara entre "streak atual" e "melhor streak"
  - [ ] Exibição visual atrativa (gamificação)
  - [ ] Performance: cálculo otimizado (cachear resultado)
  - [ ] Testes unitários para lógica de streak

  **Prioridade:** 🟢 Média
  **Estimativa:** 5h
  **Dependências:** PRG-001
  **Status:** 🔴 Pendente
  **Notas adicionais:**
  - Considerar adicionar notificação push quando streak em risco (v0.3.0)

---

- [ ] **PRG-006** - Card de próximas metas/recomendações

  **Descrição curta:**
  - Sugerir próxima aula a assistir baseado em histórico
  - Exibir progresso em direção a próxima conquista
  - Recomendações de categorias pouco exploradas

  **Implementação sugerida:**
  1. Criar algoritmo de recomendação simples:
     - Priorizar aulas da mesma categoria das mais assistidas
     - Sugerir categorias não exploradas
     - Considerar nível de dificuldade (se implementado)
  2. Criar server action `getRecommendations(userId)`
  3. Criar componente `RecommendationCard`
  4. Adicionar seção "Sugerido para você" na página de progresso

  **Arquivos/áreas afetadas:**
  - `src/lib/recommendationEngine.ts` (novo)
  - `src/server/progressActions.ts` (adicionar `getRecommendations`)
  - `src/app/progresso/components/RecommendationCard.tsx` (novo)

  **Critérios de aceitação:**
  - [ ] Recomendações relevantes baseadas em histórico real
  - [ ] Variedade nas sugestões (não repetitivo)
  - [ ] Link direto para aula recomendada
  - [ ] Explicação breve do porquê da recomendação
  - [ ] Performance: cálculo em <500ms

  **Prioridade:** 🔵 Baixa
  **Estimativa:** 4h
  **Dependências:** PRG-001
  **Status:** 🔴 Pendente

---

- [ ] **PRG-007** - Testes e documentação

  **Descrição curta:**
  - Testes unitários para lógicas de agregação e cálculo
  - Testes de integração para server actions
  - Documentação de componentes no Storybook (opcional)
  - Validação de acessibilidade (ARIA labels, navegação por teclado)

  **Implementação sugerida:**
  1. Criar testes para `streakCalculator.ts`
  2. Criar testes para `recommendationEngine.ts`
  3. Testar server actions com dados mockados
  4. Validar acessibilidade com axe-core
  5. Documentar padrões de componentes

  **Arquivos/áreas afetadas:**
  - `src/lib/__tests__/streakCalculator.test.ts` (novo)
  - `src/lib/__tests__/recommendationEngine.test.ts` (novo)
  - `src/server/__tests__/progressActions.test.ts` (novo)

  **Critérios de aceitação:**
  - [ ] Cobertura de testes >80% para lógicas críticas
  - [ ] Testes de integração passando
  - [ ] Sem violações de acessibilidade detectadas
  - [ ] Documentação clara de componentes principais
  - [ ] Performance validada (Lighthouse 90+)

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** PRG-002, PRG-003, PRG-004, PRG-005, PRG-006
  **Status:** 🔴 Pendente

---

### 📦 ACH - Sistema de Conquistas (Achievements)

#### Objetivo
Implementar sistema de gamificação baseado em conquistas desbloqueáveis, com níveis de raridade e notificações, para aumentar engajamento e criar senso de progressão.

#### ACH.1 - Modelo de Dados e CRUD

- [ ] **ACH-001** - Criar modelo de dados de conquistas

  **Descrição curta:**
  - Modelo `Achievement` com tipos, raridade, condições
  - Modelo `UserAchievement` para relação muitos-para-muitos
  - CRUD completo no dashboard admin

  **Implementação sugerida:**
  1. Adicionar modelos ao Prisma:
     ```prisma
     enum AchievementRarity {
       COMMON
       RARE
       EPIC
       LEGENDARY
     }

     enum AchievementType {
       LESSON_COUNT        // "Assistir X aulas"
       CATEGORY_COMPLETE   // "Completar todas aulas de categoria X"
       STREAK_DAYS         // "Estudar X dias consecutivos"
       TIME_SPENT          // "Estudar por X horas"
       FIRST_LESSON        // "Assistir primeira aula"
       COMMENT_COUNT       // "Fazer X comentários"
     }

     model Achievement {
       id          String             @id @default(uuid())
       name        String
       description String
       icon        String             // emoji ou URL de imagem
       rarity      AchievementRarity
       type        AchievementType
       target      Int                // valor alvo (ex: 10 aulas)
       isActive    Boolean            @default(true)
       createdAt   DateTime           @default(now())
       users       UserAchievement[]
     }

     model UserAchievement {
       id            String      @id @default(uuid())
       userId        String
       achievementId String
       unlockedAt    DateTime    @default(now())
       progress      Int         @default(0) // progresso atual
       user          user        @relation(...)
       achievement   Achievement @relation(...)
       @@unique([userId, achievementId])
     }
     ```
  2. Criar migrations
  3. Criar server actions para CRUD de conquistas
  4. Criar página `/dashboard/achievements` para gerenciamento
  5. Criar seed com conquistas iniciais

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar modelos)
  - `src/server/achievementActions.ts` (novo)
  - `src/schemas/achievement.ts` (novo)
  - `src/app/dashboard/achievements/page.tsx` (novo)
  - `prisma/seed.ts` (adicionar conquistas padrão)

  **Critérios de aceitação:**
  - [ ] Migrations aplicadas sem erros
  - [ ] CRUD completo funcional no dashboard
  - [ ] Validação de dados (Zod schemas)
  - [ ] Seed cria pelo menos 10 conquistas variadas
  - [ ] Testes de integração para server actions

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 6h
  **Dependências:** Nenhuma
  **Status:** 🔴 Pendente

---

- [ ] **ACH-002** - Motor de desbloqueio automático

  **Descrição curta:**
  - Lógica de detecção automática de condições de desbloqueio
  - Executar verificações em eventos-chave (aula concluída, comentário criado, etc.)
  - Criar registro em `UserAchievement` ao desbloquear
  - Prevenir desbloqueios duplicados

  **Implementação sugerida:**
  1. Criar serviço `AchievementEngine` em `src/lib/achievementEngine.ts`
  2. Implementar função `checkAchievements(userId, eventType, context)`
  3. Adicionar hooks em server actions relevantes:
     - `updateLessonProgress` → verificar LESSON_COUNT, TIME_SPENT
     - `createComment` → verificar COMMENT_COUNT
     - Cron job diário → verificar STREAK_DAYS
  4. Implementar lógica de progressão (atualizar `progress` antes de desbloquear)
  5. Emitir evento de desbloqueio para sistema de notificações

  **Arquivos/áreas afetadas:**
  - `src/lib/achievementEngine.ts` (novo)
  - `src/server/lessonProgressActions.ts` (adicionar hook)
  - `src/server/commentActions.ts` (adicionar hook)
  - `src/lib/events.ts` (novo - sistema de eventos simples)

  **Critérios de aceitação:**
  - [ ] Conquistas desbloqueiam automaticamente ao atingir target
  - [ ] Sem desbloqueios duplicados (verificação idempotente)
  - [ ] Progresso atualizado corretamente antes de 100%
  - [ ] Performance: verificação em <200ms
  - [ ] Testes unitários completos para lógica de desbloqueio

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 8h
  **Dependências:** ACH-001
  **Status:** 🔴 Pendente
  **Notas adicionais:**
  - Ver `AIDEV-GAMIFICATION-001` para padrões de gamificação

---

- [ ] **ACH-003** - Interface de exibição no perfil

  **Descrição curta:**
  - Adicionar seção de conquistas na página de perfil do usuário
  - Grid visual com badges de conquistas
  - Conquistas bloqueadas exibidas em grayscale com dica de como desbloquear

  **Implementação sugerida:**
  1. Criar/atualizar página de perfil `/perfil` (ou `/meu-perfil`)
  2. Criar componente `ProfileAchievements` reutilizável
  3. Buscar todas as conquistas e marcar desbloqueadas
  4. Implementar design de badges com cores por raridade:
     - COMMON: cinza
     - RARE: azul
     - EPIC: roxo
     - LEGENDARY: dourado
  5. Adicionar tooltip com progresso e condição de desbloqueio

  **Arquivos/áreas afetadas:**
  - `src/app/perfil/page.tsx` (novo ou atualizar)
  - `src/app/perfil/components/ProfileAchievements.tsx` (novo)
  - `src/components/ui/AchievementBadge.tsx` (reutilizar de PRG-004)
  - `src/scss/achievements.module.scss` (novo)

  **Critérios de aceitação:**
  - [ ] Grid responsivo (2 cols mobile, 4 cols tablet, 6 cols desktop)
  - [ ] Cores de raridade claramente diferenciadas
  - [ ] Tooltip exibe progresso atual (ex: "7/10 aulas assistidas")
  - [ ] Animação suave ao hover
  - [ ] Acessível via teclado e screen readers

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** ACH-001
  **Status:** 🔴 Pendente

---

- [ ] **ACH-004** - Sistema de notificações de desbloqueio

  **Descrição curta:**
  - Toast/modal celebrando desbloqueio de conquista
  - Animação especial para conquistas LEGENDARY
  - Som de notificação (opcional, com toggle)
  - Lista de notificações não lidas

  **Implementação sugerida:**
  1. Criar componente `AchievementUnlockedToast` com animação
  2. Integrar com biblioteca de toast (react-hot-toast ou sonner)
  3. Adicionar sistema de notificações no header (ícone de sino)
  4. Criar modelo `Notification` para persistir notificações:
     ```prisma
     model Notification {
       id        String   @id @default(uuid())
       userId    String
       type      String   // "ACHIEVEMENT_UNLOCKED", etc.
       title     String
       message   String
       isRead    Boolean  @default(false)
       metadata  Json?    // { achievementId: "...", rarity: "LEGENDARY" }
       createdAt DateTime @default(now())
       user      user     @relation(...)
     }
     ```
  5. Implementar badge de contador de não lidas

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar Notification)
  - `src/components/ui/AchievementUnlockedToast.tsx` (novo)
  - `src/components/Header/NotificationBell.tsx` (novo)
  - `src/app/api/notifications/route.ts` (novo - buscar notificações)
  - `src/server/notificationActions.ts` (novo)
  - `package.json` (adicionar sonner ou react-hot-toast)

  **Critérios de aceitação:**
  - [ ] Toast aparece imediatamente ao desbloquear conquista
  - [ ] Animação especial para LEGENDARY (confetti ou similar)
  - [ ] Notificações persistem em banco de dados
  - [ ] Contador de não lidas no header
  - [ ] Som opcional com preferência persistida

  **Prioridade:** 🟡 Alta
  **Estimativa:** 6h
  **Dependências:** ACH-001, ACH-002
  **Status:** 🔴 Pendente

---

- [ ] **ACH-005** - Conquistas iniciais (seed)

  **Descrição curta:**
  - Criar conjunto de conquistas iniciais variadas
  - Cobrir todos os tipos de achievement
  - Balancear dificuldade (easy, medium, hard)

  **Implementação sugerida:**
  1. Adicionar conquistas ao `prisma/seed.ts`:
     - **Primeira Aula** (COMMON): Assistir primeira aula completa
     - **Maratonista** (RARE): Assistir 10 aulas
     - **Dedicado** (EPIC): Assistir 50 aulas
     - **Mestre** (LEGENDARY): Assistir 100 aulas
     - **Especialista em X** (RARE): Completar todas aulas de uma categoria
     - **Streak de 7 dias** (EPIC): Estudar 7 dias consecutivos
     - **Streak de 30 dias** (LEGENDARY): Estudar 30 dias consecutivos
     - **Comentarista** (COMMON): Fazer primeiro comentário
     - **Engajado** (RARE): Fazer 10 comentários
     - **Noturno** (RARE): Estudar após 22h
  2. Testar seed em ambiente de dev
  3. Documentar conquistas em `docs/gamification/achievements.md`

  **Arquivos/áreas afetadas:**
  - `prisma/seed.ts` (atualizar)
  - `docs/gamification/achievements.md` (novo)

  **Critérios de aceitação:**
  - [ ] Pelo menos 15 conquistas criadas no seed
  - [ ] Distribuição equilibrada de raridades
  - [ ] Todos os tipos (AchievementType) representados
  - [ ] Descrições claras e motivadoras
  - [ ] Ícones apropriados para cada conquista

  **Prioridade:** 🟢 Média
  **Estimativa:** 2h
  **Dependências:** ACH-001
  **Status:** 🔴 Pendente

---

- [ ] **ACH-006** - Testes e validação

  **Descrição curta:**
  - Testes unitários para `AchievementEngine`
  - Testes de integração para desbloqueio automático
  - Validar performance com muitos usuários/conquistas
  - Testar edge cases (conquistas simultâneas, race conditions)

  **Implementação sugerida:**
  1. Criar suite de testes para `achievementEngine.ts`
  2. Testar cada tipo de conquista individualmente
  3. Testar cenários de edge case:
     - Desbloquear múltiplas conquistas ao mesmo tempo
     - Progresso revertido (ex: streak quebrado)
     - Conquista desativada após desbloqueio
  4. Testes de carga (simular 100+ verificações simultâneas)
  5. Validar notificações são criadas corretamente

  **Arquivos/áreas afetadas:**
  - `src/lib/__tests__/achievementEngine.test.ts` (novo)
  - `src/server/__tests__/achievementActions.test.ts` (novo)

  **Critérios de aceitação:**
  - [ ] Cobertura de testes >85% para achievement engine
  - [ ] Todos os edge cases cobertos
  - [ ] Performance: verificação de 100 conquistas em <1s
  - [ ] Sem race conditions detectadas
  - [ ] Documentação de casos de teste

  **Prioridade:** 🟡 Alta
  **Estimativa:** 5h
  **Dependências:** ACH-001, ACH-002, ACH-003, ACH-004
  **Status:** 🔴 Pendente

---

### 📦 SCH - Busca e Filtros

#### Objetivo
Implementar sistema de busca avançada e filtros para facilitar a descoberta de conteúdo, permitindo que usuários encontrem rapidamente aulas relevantes por título, categoria, duração e dificuldade.

#### SCH.1 - Busca e Filtros de Aulas

- [ ] **SCH-001** - Implementar busca full-text

  **Descrição curta:**
  - Busca por título e descrição de aulas
  - Debounce para evitar queries excessivas
  - Destacar termo buscado nos resultados (highlight)
  - Paginação de resultados

  **Implementação sugerida:**
  1. Criar API route `/api/search/lessons?q=termo&page=1`
  2. Implementar query Prisma com busca full-text:
     ```typescript
     await db.lessons.findMany({
       where: {
         OR: [
           { title: { contains: query, mode: 'insensitive' } },
           { description: { contains: query, mode: 'insensitive' } }
         ]
       },
       take: 20,
       skip: (page - 1) * 20,
       include: { category: true, author: true }
     })
     ```
  3. Criar componente `SearchBar` com debounce (500ms)
  4. Implementar highlight de termos buscados
  5. Adicionar paginação ou scroll infinito

  **Arquivos/áreas afetadas:**
  - `src/app/api/search/lessons/route.ts` (novo)
  - `src/components/Search/SearchBar.tsx` (novo)
  - `src/components/Search/SearchResults.tsx` (novo)
  - `src/hooks/useDebounce.ts` (novo ou reutilizar)
  - `src/app/cursos/page.tsx` (integrar busca)

  **Critérios de aceitação:**
  - [ ] Busca retorna resultados relevantes
  - [ ] Debounce funciona corretamente (não busca a cada tecla)
  - [ ] Termos buscados destacados visualmente
  - [ ] Paginação funcional
  - [ ] Performance: query <300ms para 1000+ aulas

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 5h
  **Dependências:** Nenhuma
  **Status:** 🔴 Pendente
  **Notas adicionais:**
  - Considerar migração futura para Algolia ou Meilisearch se escalar

---

- [ ] **SCH-002** - Filtros por categoria

  **Descrição curta:**
  - Dropdown ou sidebar com categorias disponíveis
  - Permitir seleção múltipla de categorias
  - Atualizar URL com query params (ex: ?cat=uuid1,uuid2)
  - Combinar com busca textual

  **Implementação sugerida:**
  1. Criar componente `CategoryFilter` com checkboxes
  2. Atualizar API de busca para aceitar `categoryIds[]`
  3. Implementar lógica de filtro no Prisma:
     ```typescript
     where: {
       AND: [
         categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {},
         searchQuery ? { title: { contains: searchQuery } } : {}
       ]
     }
     ```
  4. Sincronizar estado com URL (useSearchParams)
  5. Adicionar contador de resultados por categoria

  **Arquivos/áreas afetadas:**
  - `src/components/Search/CategoryFilter.tsx` (novo)
  - `src/app/api/search/lessons/route.ts` (atualizar)
  - `src/app/cursos/page.tsx` (integrar filtros)

  **Critérios de aceitação:**
  - [ ] Filtros múltiplos funcionam corretamente
  - [ ] URL reflete filtros ativos (permite compartilhamento)
  - [ ] Contador de resultados preciso
  - [ ] Botão "Limpar filtros" funcional
  - [ ] Estado persiste ao navegar para aula e voltar

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 4h
  **Dependências:** SCH-001
  **Status:** 🔴 Pendente

---

- [ ] **SCH-003** - Filtros por duração

  **Descrição curta:**
  - Range slider ou checkboxes para filtrar por duração
  - Opções: <10min, 10-30min, 30-60min, >60min
  - Combinar com outros filtros

  **Implementação sugerida:**
  1. Criar componente `DurationFilter` com checkboxes ou slider
  2. Atualizar API para aceitar `minDuration` e `maxDuration`
  3. Implementar query Prisma:
     ```typescript
     where: {
       duration: {
         gte: minDuration,
         lte: maxDuration
       }
     }
     ```
  4. Adicionar ao painel de filtros lateral

  **Arquivos/áreas afetadas:**
  - `src/components/Search/DurationFilter.tsx` (novo)
  - `src/app/api/search/lessons/route.ts` (atualizar)

  **Critérios de aceitação:**
  - [ ] Filtro funciona para todos os ranges
  - [ ] Combina corretamente com outros filtros
  - [ ] UI intuitiva e clara
  - [ ] Responsivo em mobile
  - [ ] Aulas sem duração definida tratadas corretamente

  **Prioridade:** 🟢 Média
  **Estimativa:** 3h
  **Dependências:** SCH-001
  **Status:** 🔴 Pendente

---

- [ ] **SCH-004** - Ordenação de resultados

  **Descrição curta:**
  - Dropdown de ordenação: Mais recentes, Mais populares, A-Z, Z-A
  - Persistir preferência em localStorage
  - Combinar com busca e filtros

  **Implementação sugerida:**
  1. Criar componente `SortDropdown`
  2. Atualizar API para aceitar parâmetro `sortBy`
  3. Implementar ordenações no Prisma:
     ```typescript
     orderBy: {
       createdAt: sortBy === 'newest' ? 'desc' : undefined,
       title: sortBy === 'a-z' ? 'asc' : sortBy === 'z-a' ? 'desc' : undefined,
       // views: sortBy === 'popular' ? 'desc' : undefined // futuro
     }
     ```
  4. Adicionar ao header da lista de resultados
  5. Persistir em localStorage

  **Arquivos/áreas afetadas:**
  - `src/components/Search/SortDropdown.tsx` (novo)
  - `src/app/api/search/lessons/route.ts` (atualizar)

  **Critérios de aceitação:**
  - [ ] Todas as ordenações funcionam corretamente
  - [ ] Preferência persiste entre sessões
  - [ ] Transição suave ao mudar ordenação
  - [ ] Dropdown acessível via teclado
  - [ ] Mobile-friendly

  **Prioridade:** 🟢 Média
  **Estimativa:** 2h
  **Dependências:** SCH-001
  **Status:** 🔴 Pendente

---

- [ ] **SCH-005** - Histórico de buscas

  **Descrição curta:**
  - Salvar últimas 10 buscas do usuário
  - Exibir dropdown ao focar no campo de busca
  - Permitir limpar histórico
  - Persistir em localStorage ou banco de dados

  **Implementação sugerida:**
  1. Criar hook `useSearchHistory` com localStorage
  2. Salvar termo ao executar busca (max 10 itens)
  3. Criar componente `SearchHistoryDropdown`
  4. Adicionar botão "Limpar histórico"
  5. Implementar navegação por teclado (setas + enter)

  **Arquivos/áreas afetadas:**
  - `src/hooks/useSearchHistory.ts` (novo)
  - `src/components/Search/SearchHistoryDropdown.tsx` (novo)
  - `src/components/Search/SearchBar.tsx` (atualizar)

  **Critérios de aceitação:**
  - [ ] Últimas 10 buscas exibidas corretamente
  - [ ] Clicar em item do histórico executa busca
  - [ ] Botão limpar funciona
  - [ ] Histórico persiste entre sessões
  - [ ] Acessível via teclado

  **Prioridade:** 🔵 Baixa
  **Estimativa:** 3h
  **Dependências:** SCH-001
  **Status:** 🔴 Pendente

---

- [ ] **SCH-006** - Testes e otimização

  **Descrição curta:**
  - Testes de integração para API de busca
  - Testes de performance com grandes volumes de dados
  - Otimização de queries (índices no banco)
  - Validação de acessibilidade

  **Implementação sugerida:**
  1. Criar testes para API route de busca
  2. Adicionar índices no Prisma:
     ```prisma
     model lessons {
       @@index([title])
       @@index([categoryId])
       @@index([createdAt])
     }
     ```
  3. Testar performance com 1000+ aulas
  4. Validar acessibilidade (ARIA labels, navegação)
  5. Documentar API em `docs/api/search.md`

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar índices)
  - `src/app/api/search/lessons/__tests__/route.test.ts` (novo)
  - `docs/api/search.md` (novo)

  **Critérios de aceitação:**
  - [ ] Testes de integração passando
  - [ ] Query <300ms com 1000+ aulas
  - [ ] Índices aplicados corretamente
  - [ ] Sem violações de acessibilidade
  - [ ] Documentação completa da API

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** SCH-001, SCH-002, SCH-003, SCH-004
  **Status:** 🔴 Pendente

---

### 📦 COM - Sistema de Comentários

#### Objetivo
Criar sistema de comentários em aulas para fomentar discussão, permitir dúvidas e aumentar engajamento comunitário, com moderação por admins e sistema de upvote/downvote.

#### COM.1 - Modelo de Dados e CRUD

- [ ] **COM-001** - Criar modelo de comentários

  **Descrição curta:**
  - Modelo `Comment` com suporte a respostas aninhadas
  - Sistema de upvote/downvote
  - Moderação (soft delete por admins)

  **Implementação sugerida:**
  1. Adicionar modelos ao Prisma:
     ```prisma
     model Comment {
       id          String    @id @default(uuid())
       lessonId    String
       authorId    String
       parentId    String?   // null = comentário raiz, uuid = resposta
       content     String    @db.Text
       upvotes     Int       @default(0)
       downvotes   Int       @default(0)
       isDeleted   Boolean   @default(false)
       deletedBy   String?   // userId do admin que deletou
       createdAt   DateTime  @default(now())
       updatedAt   DateTime  @updatedAt
       lesson      lessons   @relation(...)
       author      user      @relation(...)
       parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
       replies     Comment[] @relation("CommentReplies")
       votes       CommentVote[]
     }

     model CommentVote {
       id        String   @id @default(uuid())
       commentId String
       userId    String
       value     Int      // 1 = upvote, -1 = downvote
       createdAt DateTime @default(now())
       comment   Comment  @relation(...)
       user      user     @relation(...)
       @@unique([commentId, userId])
     }
     ```
  2. Criar migrations
  3. Criar server actions para CRUD
  4. Criar schemas Zod para validação

  **Arquivos/áreas afetadas:**
  - `prisma/schema.prisma` (adicionar modelos)
  - `src/server/commentActions.ts` (novo)
  - `src/schemas/comment.ts` (novo)

  **Critérios de aceitação:**
  - [ ] Migrations aplicadas sem erros
  - [ ] Relação de respostas aninhadas funcional
  - [ ] Validação de conteúdo (min 1 char, max 2000 chars)
  - [ ] Soft delete funciona corretamente
  - [ ] Índices apropriados criados

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 5h
  **Dependências:** Nenhuma
  **Status:** 🔴 Pendente

---

- [ ] **COM-002** - Interface de comentários na página de aula

  **Descrição curta:**
  - Seção de comentários abaixo do vídeo
  - Textarea para novo comentário (somente autenticados)
  - Lista de comentários com respostas aninhadas (max 2 níveis)
  - Botões de upvote/downvote

  **Implementação sugerida:**
  1. Criar componente `CommentSection` em `src/app/cursos/[id]/components/`
  2. Criar componente `CommentItem` recursivo para aninhamento
  3. Criar componente `CommentForm` para novo comentário/resposta
  4. Implementar loading states e otimistic updates
  5. Adicionar paginação (20 comentários por página)

  **Arquivos/áreas afetadas:**
  - `src/app/cursos/[id]/components/CommentSection.tsx` (novo)
  - `src/app/cursos/[id]/components/CommentItem.tsx` (novo)
  - `src/app/cursos/[id]/components/CommentForm.tsx` (novo)
  - `src/app/cursos/[id]/page.tsx` (adicionar seção)

  **Critérios de aceitação:**
  - [ ] Comentários carregam e renderizam corretamente
  - [ ] Aninhamento visual claro (indentação)
  - [ ] Formulário funcional para autenticados
  - [ ] Mensagem apropriada para não autenticados
  - [ ] Responsivo em mobile e desktop

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 6h
  **Dependências:** COM-001
  **Status:** 🔴 Pendente

---

- [ ] **COM-003** - Sistema de upvote/downvote

  **Descrição curta:**
  - Botões de upvote/downvote em cada comentário
  - Contadores visuais de votos
  - Um voto por usuário (trocar voto permitido)
  - Ordenação por votos (opcional)

  **Implementação sugerida:**
  1. Criar server action `voteComment(commentId, value)`
  2. Implementar lógica de upsert em `CommentVote`:
     ```typescript
     // Se já votou, atualizar valor ou deletar se mesmo voto
     // Se não votou, criar novo registro
     ```
  3. Atualizar contadores de upvotes/downvotes em `Comment`
  4. Criar componente `VoteButtons` com estados (voted/not voted)
  5. Adicionar feedback visual ao clicar

  **Arquivos/áreas afetadas:**
  - `src/server/commentActions.ts` (adicionar `voteComment`)
  - `src/app/cursos/[id]/components/VoteButtons.tsx` (novo)
  - `src/app/cursos/[id]/components/CommentItem.tsx` (integrar)

  **Critérios de aceitação:**
  - [ ] Voto registrado corretamente no banco
  - [ ] Usuário pode trocar voto (upvote → downvote)
  - [ ] Clicar novamente remove o voto
  - [ ] Contadores atualizados em tempo real (optimistic update)
  - [ ] Somente usuários autenticados podem votar

  **Prioridade:** 🟡 Alta
  **Estimativa:** 4h
  **Dependências:** COM-001, COM-002
  **Status:** 🔴 Pendente

---

- [ ] **COM-004** - Moderação de comentários (Admin)

  **Descrição curta:**
  - Botão "Deletar" visível apenas para admins
  - Soft delete (comentário permanece mas conteúdo oculto)
  - Mensagem "[Comentário removido por moderação]"
  - Log de ação no banco (quem deletou)

  **Implementação sugerida:**
  1. Criar server action `deleteComment(commentId)` com validação de role
  2. Implementar soft delete (isDeleted = true, deletedBy = userId)
  3. Atualizar renderização para ocultar conteúdo deletado
  4. Adicionar botão de deletar apenas para admins
  5. Manter estrutura de respostas (não quebrar thread)

  **Arquivos/áreas afetadas:**
  - `src/server/commentActions.ts` (adicionar `deleteComment`)
  - `src/app/cursos/[id]/components/CommentItem.tsx` (atualizar)

  **Critérios de aceitação:**
  - [ ] Apenas admins veem botão de deletar
  - [ ] Soft delete preserva estrutura de respostas
  - [ ] Mensagem de moderação clara
  - [ ] Log de quem deletou registrado
  - [ ] Ação auditada (pode ser revertida se necessário)

  **Prioridade:** 🟡 Alta
  **Estimativa:** 3h
  **Dependências:** COM-001, COM-002
  **Status:** 🔴 Pendente

---

- [ ] **COM-005** - Notificações de resposta

  **Descrição curta:**
  - Notificar autor de comentário quando alguém responder
  - Integrar com sistema de notificações (ACH-004)
  - Link direto para o comentário na aula

  **Implementação sugerida:**
  1. Adicionar hook em `createComment` quando `parentId` existe
  2. Criar notificação do tipo "COMMENT_REPLY":
     ```typescript
     await createNotification({
       userId: parentComment.authorId,
       type: 'COMMENT_REPLY',
       title: 'Nova resposta ao seu comentário',
       message: `${replier.name} respondeu: "${content.slice(0, 50)}..."`,
       metadata: { lessonId, commentId }
     })
     ```
  3. Implementar link direto para comentário com scroll automático
  4. Adicionar preferência de notificações no perfil

  **Arquivos/áreas afetadas:**
  - `src/server/commentActions.ts` (adicionar hook)
  - `src/server/notificationActions.ts` (reutilizar de ACH-004)
  - `src/app/cursos/[id]/page.tsx` (scroll to comment se hash na URL)

  **Critérios de aceitação:**
  - [ ] Notificação criada ao responder comentário
  - [ ] Link navega e foca no comentário correto
  - [ ] Não notificar se usuário responde próprio comentário
  - [ ] Preferência de opt-out funcional
  - [ ] Performance não impactada

  **Prioridade:** 🟢 Média
  **Estimativa:** 4h
  **Dependências:** COM-001, COM-002, ACH-004
  **Status:** 🔴 Pendente

---

- [ ] **COM-006** - Testes e proteções

  **Descrição curta:**
  - Testes de integração para CRUD de comentários
  - Proteção contra spam (rate limiting)
  - Validação de conteúdo (XSS, SQL injection)
  - Testes de moderação

  **Implementação sugerida:**
  1. Criar testes para server actions de comentários
  2. Implementar rate limiting (max 5 comentários/minuto por usuário)
  3. Sanitização de HTML no conteúdo (DOMPurify ou similar)
  4. Testar edge cases (deletar comentário com respostas, etc.)
  5. Validar permissões de moderação

  **Arquivos/áreas afetadas:**
  - `src/server/__tests__/commentActions.test.ts` (novo)
  - `src/lib/rateLimiter.ts` (novo ou reutilizar)
  - `src/lib/sanitize.ts` (novo)
  - `src/server/commentActions.ts` (adicionar proteções)

  **Critérios de aceitação:**
  - [ ] Cobertura de testes >80%
  - [ ] Rate limiting funcional (retorna erro apropriado)
  - [ ] Conteúdo HTML escapado corretamente
  - [ ] Testes de segurança passando (sem XSS/SQL injection)
  - [ ] Performance: criar comentário em <500ms

  **Prioridade:** 🔴 Crítica
  **Estimativa:** 5h
  **Dependências:** COM-001, COM-002, COM-003, COM-004
  **Status:** 🔴 Pendente

---

## 🧪 Testes e Validações

### Suites Necessárias
- **Jest (Unit Tests):** Componentes, hooks, utils, server actions
- **Jest (Integration Tests):** API routes, database operations
- **Playwright/Cypress (E2E):** Fluxos críticos (assistir aula, comentar, desbloquear conquista)

### Cobertura Alvo
- **Global:** >75% branches
- **Lógicas críticas** (achievement engine, streak calculator): >85%
- **Server actions:** >80%
- **Components:** >70%

### Comandos de Verificação
```bash
# Testes unitários e integração
make test
pnpm test

# Testes em modo watch
pnpm test:watch

# Cobertura
pnpm test:coverage

# E2E (quando implementado)
pnpm test:e2e

# Validação completa (lint + type-check + test)
make pre-commit

# CI completo
make ci
```

### Estado Atual
⚠️ Suites de teste precisam ser criadas junto com implementação das features

---

## 📚 Documentação e Comunicação

### Arquivos a Atualizar

1. **TASKS.md** (este arquivo)
   - Marcar tarefas como concluídas conforme progresso
   - Atualizar tabela de resumo
   - Adicionar notas de implementação relevantes

2. **CHANGELOG.md**
   - Documentar todas as features sob `[Unreleased]`
   - Formato: `### Added`, `### Changed`, `### Fixed`
   - Incluir breaking changes se houver

3. **README.md**
   - Atualizar seção de features com novos recursos
   - Adicionar screenshots/GIFs das novas funcionalidades
   - Atualizar instruções de setup se necessário

4. **Database Schema**
   - Documentar novos modelos em `docs/database/schema.md`
   - Incluir diagramas ER atualizados
   - Documentar índices e otimizações

5. **API Documentation**
   - Criar `docs/api/search.md` para API de busca
   - Documentar endpoints de comentários
   - Incluir exemplos de request/response

6. **User Guide**
   - Criar/atualizar `docs/user-guide/` com guias de uso
   - Documentar sistema de conquistas
   - Explicar sistema de progresso

---

## ✅ Checklist de Encerramento da Fase

- [ ] Todas as 32 tarefas marcadas como concluídas (32/32)
- [ ] Migrations aplicadas e committed (`make prisma-migrate` ou `pnpm prisma:migrate`)
- [ ] Testes backend executados e passando (`make test`, `pnpm test`)
- [ ] Testes E2E críticos passando (se implementados)
- [ ] Lighthouse Performance score >90 nas páginas principais
- [ ] Documentação atualizada:
  - [ ] TASKS.md marcado como FASE CONCLUÍDA
  - [ ] CHANGELOG.md com todas as features documentadas
  - [ ] README.md atualizado com novas features
  - [ ] Docs técnicas criadas (API, database schema)
- [ ] Code review completo realizado
- [ ] Deploy em staging e validação de QA
- [ ] Métricas de sucesso medidas:
  - [ ] Tempo médio de sessão aumentou
  - [ ] Taxa de retorno melhorou
  - [ ] Usuários engajando com comentários/conquistas
- [ ] Aprovação final registrada (issue/PR)
- [ ] Comunicação de lançamento preparada (changelog user-facing)

**Critérios de Transição para v0.3.0:**
- Todas as features de v0.2.0 estáveis em produção
- Feedback inicial coletado de usuários
- Bugs críticos corrigidos
- Métricas validadas (15min+ tempo de sessão, 10%+ conversão)

---

**Última atualização:** 2025-11-15
**Responsável:** Equipe Valorant Ascension
**Status:** 🟡 FASE ATIVA - Iniciando implementação
