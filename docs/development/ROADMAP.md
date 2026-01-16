# 🗺️ Roadmap - Valorant Ascension

Este documento apresenta o planejamento de curto, médio e longo prazo para o projeto **Valorant Ascension**.

> **Status**: 🟢 Em desenvolvimento ativo
> **Última atualização**: 2025-11-15

---

## 📊 Visão Geral

### Objetivos Principais

1. **Plataforma de treinamento completa** para jogadores de Valorant
2. **Monetização sustentável** via assinaturas Stripe
3. **Experiência de usuário excepcional** (mobile-first, responsivo)
4. **Conteúdo de qualidade** (aulas, guias, análises)
5. **Comunidade engajada** (conquistas, rankings, interação)

---

## 🎯 Versões Planejadas

### ✅ v0.1.0 - MVP (Concluído)

**Status**: 🟢 Lançado (2025-11-15)

- [x] Sistema de autenticação (email/senha + OAuth Google)
- [x] RBAC (Customer, Admin, Professional)
- [x] Integração Stripe (checkout, webhooks, polling)
- [x] Dashboard admin (CRUD users, lessons, categories)
- [x] Catálogo de aulas com vídeos
- [x] Layout responsivo mobile-first
- [x] Seed inicial com 20 aulas
- [x] Páginas de erro customizadas

---

### 🚧 v0.2.0 - Melhorias de UX e Conteúdo

**Status**: 🟡 Em andamento
**Prazo**: 2025-12-01

#### Features Planejadas

##### 📹 Sistema de Vídeos Avançado

- [x] Player customizado com controles avançados
- [x] Marcação de timestamps importantes (VID-002)
- [x] Velocidade de reprodução ajustável
- [x] Qualidade de vídeo adaptativa
- [ ] Legendas/closed captions

##### 📊 Dashboard de Progresso do Aluno

- [ ] Página "Meu Progresso" para customers
- [ ] Gráficos de tempo de estudo
- [ ] Aulas concluídas vs. pendentes
- [ ] Conquistas desbloqueadas
- [ ] Streak de dias consecutivos estudando

##### 🏆 Sistema de Conquistas (Achievements)

- [ ] Desbloqueio automático baseado em ações
- [ ] Níveis de raridade (comum, raro, épico, lendário)
- [ ] Exibição em perfil do usuário
- [ ] Notificações de conquista desbloqueada

##### 🔍 Busca e Filtros

- [ ] Busca por título/descrição de aulas
- [ ] Filtros por categoria, duração, dificuldade
- [ ] Ordenação (mais recentes, mais populares, etc.)
- [ ] Histórico de buscas

##### 💬 Sistema de Comentários

- [ ] Comentários em aulas
- [ ] Respostas aninhadas
- [ ] Moderação (admin pode deletar/editar)
- [ ] Upvote/downvote de comentários

---

### 🔮 v0.3.0 - Gamificação e Comunidade

**Status**: ⚪ Planejado
**Prazo**: 2026-01-15

#### Features Planejadas

##### 🎮 Sistema de Pontos (XP)

- [ ] XP por aulas assistidas
- [ ] XP por conquistas desbloqueadas
- [ ] XP por streak diário
- [ ] Níveis e ranks (Bronze, Prata, Ouro, etc.)

##### 🏅 Ranking/Leaderboard

- [ ] Ranking global de XP
- [ ] Ranking semanal/mensal
- [ ] Filtro por categoria de aula
- [ ] Perfil público dos usuários

##### 👥 Sistema de Mentoria

- [ ] Profissionais podem oferecer mentoria
- [ ] Agendamento de sessões 1-on-1
- [ ] Pagamento via Stripe Connect
- [ ] Avaliações e reviews de mentores

##### 💬 Fórum/Comunidade

- [ ] Criação de tópicos
- [ ] Categorias (Dúvidas, Estratégias, Geral)
- [ ] Sistema de tags
- [ ] Moderação por admins

##### 🎁 Código de Referral

- [ ] Sistema de indicação de amigos
- [ ] Desconto para referidos
- [ ] Bônus para quem indica
- [ ] Dashboard de afiliados

---

### 🚀 v0.4.0 - Análise de Performance (MMR/Stats)

**Status**: ⚪ Planejado
**Prazo**: 2026-03-01

#### Features Planejadas

##### 📈 Integração com API Valorant

- [ ] Conexão com conta Riot Games
- [ ] Importação automática de MMR
- [ ] Histórico de partidas
- [ ] Estatísticas detalhadas (KDA, HS%, etc.)
- [ ] Análise de evolução ao longo do tempo

##### 🧠 Recomendações Personalizadas

- [ ] Sugestão de aulas baseada em performance
- [ ] Identificação de pontos fracos
- [ ] Planos de estudo customizados
- [ ] Metas personalizadas

##### 📊 Analytics Avançados

- [ ] Mapas mais jogados
- [ ] Agentes mais usados
- [ ] Comparação com média de rank
- [ ] Insights baseados em IA (futuro)

##### 🎯 Desafios Personalizados

- [ ] Criação de desafios baseados em stats
- [ ] Desafios semanais
- [ ] Recompensas por conclusão
- [ ] Integração com sistema de conquistas

---

### 🌟 v0.5.0 - Conteúdo Premium e Eventos

**Status**: ⚪ Planejado
**Prazo**: 2026-05-01

#### Features Planejadas

##### 🎓 Cursos Estruturados

- [ ] Trilhas de aprendizado completas
- [ ] Certificados de conclusão
- [ ] Aulas ao vivo (webinars)
- [ ] Material de apoio (PDFs, imagens)

##### 🏆 Torneios e Eventos

- [ ] Criação de torneios internos
- [ ] Inscrição e gerenciamento de equipes
- [ ] Chaveamento automático
- [ ] Premiações (XP, conquistas, etc.)

##### 🎙️ Podcast/Blog

- [ ] Artigos sobre estratégias
- [ ] Entrevistas com pros
- [ ] Patch notes explicados
- [ ] Tier lists e meta análise

##### 📱 Aplicativo Mobile (PWA)

- [ ] Progressive Web App
- [ ] Notificações push
- [ ] Modo offline (conteúdo baixado)
- [ ] Instalação nativa

---

### 🔧 v1.0.0 - Lançamento Oficial

**Status**: ⚪ Planejado
**Prazo**: 2026-08-01

#### Critérios para v1.0

- [ ] Todos os recursos essenciais implementados
- [ ] Testes E2E completos
- [ ] Performance otimizada (Lighthouse 90+)
- [ ] Documentação completa para usuários
- [ ] Marketing e landing page profissional
- [ ] Suporte ao cliente estruturado
- [ ] Política de privacidade e termos de uso
- [ ] 100+ aulas ativas
- [ ] 500+ usuários ativos

---

## 🛠️ Melhorias Contínuas

### Performance

- [ ] Implementar cache Redis
- [ ] CDN para vídeos (Cloudflare/AWS)
- [ ] Otimização de queries Prisma
- [ ] Lazy loading agressivo
- [ ] Service Workers para PWA

### Segurança

- [ ] Autenticação de dois fatores (2FA)
- [ ] Rate limiting em APIs
- [ ] Logs de auditoria (admin actions)
- [ ] Backup automático do banco
- [ ] Testes de penetração

### DevOps

- [ ] CI/CD completo (GitHub Actions)
- [ ] Testes automatizados (unit, integration, E2E)
- [ ] Monitoramento (Sentry/DataDog)
- [ ] Alertas de uptime
- [ ] Deploy staging + production

### Acessibilidade

- [ ] ARIA labels completos
- [ ] Navegação por teclado
- [ ] Suporte a leitores de tela
- [ ] Contraste de cores (WCAG AA)
- [ ] Texto alternativo em imagens

---

## 📋 Backlog de Ideias

### Funcionalidades Futuras

- [ ] Integração com Discord (bot)
- [ ] Sistema de clipes (highlights de partidas)
- [ ] Análise de VODs com IA
- [ ] Marketplace de configs/crosshairs
- [ ] Modo de prática (aim trainer integrado)
- [ ] Planos corporativos (times/orgs)
- [ ] Tradução multi-idioma (i18n)
- [ ] Dark mode alternativo (cores customizáveis)

### Experimentos/Pesquisa

- [ ] IA para análise de gameplay
- [ ] Reconhecimento de voz em aulas
- [ ] Realidade virtual (treinos imersivos)
- [ ] Blockchain (NFTs de conquistas?)

---

## 📊 Métricas de Sucesso

### KPIs v0.2.0

- **Usuários ativos mensais**: 100+
- **Taxa de conversão para assinatura**: 10%+
- **Churn rate**: < 15%
- **Tempo médio de sessão**: 15min+
- **NPS**: 50+

### KPIs v1.0.0

- **Usuários ativos mensais**: 1000+
- **Taxa de conversão**: 15%+
- **Churn rate**: < 10%
- **Tempo médio de sessão**: 30min+
- **NPS**: 70+

---

## 🔄 Processo de Atualização

1. **Planejamento**: Definir features da próxima versão
2. **Design**: Protótipos e validação com usuários
3. **Desenvolvimento**: Implementação em sprints de 2 semanas
4. **Testes**: QA manual + automatizado
5. **Deploy**: Staging → Production
6. **Monitoramento**: Métricas e feedback dos usuários
7. **Iteração**: Ajustes e melhorias baseadas em dados

---

## 📞 Feedback e Sugestões

Sua opinião é importante! Compartilhe ideias:

- **Issues no GitHub**: [Link para issues]
- **Formulário de feedback**: [Link quando criado]
- **Email**: [contato@example.com]

---

## 📝 Notas

- Este roadmap é **flexível** e pode mudar baseado em feedback e prioridades
- Datas são **estimativas** e podem ser ajustadas
- Features podem ser movidas entre versões conforme necessidade
- Novas ideias são sempre bem-vindas!

---

**Última revisão**: 2025-11-15
**Responsável**: Equipe Valorant Ascension
**Status do projeto**: 🟢 Ativo
