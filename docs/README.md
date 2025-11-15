# 📚 Documentação - Valorant Ascension

Bem-vindo à documentação completa do projeto **Valorant Ascension**!

Esta documentação está organizada em seções para facilitar a navegação e o entendimento do projeto.

---

## 📖 Índice Geral

### 🚀 [Início Rápido](../README.md)
Comece aqui! Instruções de instalação, configuração e primeiros passos com o projeto.

---

## 📁 Estrutura da Documentação

### 🏗️ [`/architecture`](./architecture/) - Arquitetura do Sistema

Documentação sobre a arquitetura, fluxos e diagramas do sistema.

**Arquivos:**
- **[Fluxo de Autenticação](./architecture/auth-flow-diagram.md)** - Diagrama e explicação do fluxo de autenticação e autorização (RBAC)

**Em breve:**
- Arquitetura geral do sistema
- Diagrama de banco de dados
- Fluxo de pagamentos Stripe
- Estrutura de componentes React

---

### 📘 [`/guides`](./guides/) - Guias e Tutoriais

Guias práticos para desenvolvedores e usuários do sistema.

**Arquivos:**

#### CRUD e Roles
- **[Guia Completo de CRUD e Roles](./guides/crud-roles-complete-guide.md)** - Guia definitivo sobre como criar, ler, atualizar e deletar recursos com controle de acesso por roles
- **[Guia de CRUD do Dashboard](./guides/crud-guide.md)** - Tutorial específico para operações CRUD no dashboard admin

#### Prisma
- **[Comandos Prisma](./guides/prisma-commands.md)** - Referência completa de comandos Prisma para desenvolvimento e produção
- **[Guia de Estudos Prisma](./guides/prisma-student-guide.md)** - Material de apoio para aprender Prisma ORM

#### Autenticação OAuth
- **[OAuth Google - Completo](./guides/oauth-google-complete.md)** - Documentação completa da implementação de OAuth com Google
- **[OAuth Google - Status](./guides/oauth-google-status.md)** - Status atual da implementação OAuth Google

**Em breve:**
- Guia de criação de componentes
- Guia de validação com Zod
- Guia de Server Actions
- Best practices de segurança

---

### 🔌 [`/api`](./api/) - Documentação de APIs

Documentação de APIs internas e integrações externas.

**Arquivos:**
- **[Integração MMR/Match](./api/mmr-match-integration.md)** - Documentação da integração com API HenrikDev para dados de partidas e MMR

**Em breve:**
- API Routes do Next.js
- Webhooks Stripe
- Server Actions disponíveis
- Endpoints de autenticação

---

### 🛠️ [`/development`](./development/) - Desenvolvimento

Informações essenciais para desenvolvedores que trabalham no projeto.

**Arquivos:**
- **[README de Desenvolvimento](./development/README.md)** - Guia completo para configurar ambiente, padrões de código, workflow Git, scripts disponíveis
- **[CHANGELOG](./development/CHANGELOG.md)** - Histórico detalhado de mudanças e versões do projeto
- **[ROADMAP](./development/ROADMAP.md)** - Planejamento de features futuras e roadmap do produto

**Subpasta:**
- **[`/tasks`](./development/tasks/)** - Organização de tarefas, issues e sprints de desenvolvimento

---

### 📝 [`/notes`](./notes/) - Notas Técnicas

Notas de desenvolvimento, decisões técnicas e documentação de implementações específicas.

**Arquivos:**
- **[2025-09-11: OAuth Google Implementation](./notes/2025-09-11-oauth-google-implementation.md)** - Decisões e processo de implementação do OAuth Google
- **[2025-09-10: Dashboard CRUD](./notes/2025-09-10-dashboard-crud.md)** - Notas sobre implementação do CRUD no dashboard

**Formato:**
- Arquivos nomeados com data: `YYYY-MM-DD-titulo-descritivo.md`
- Usado para documentar decisões técnicas, experimentos e implementações específicas

---

## 🔍 Busca Rápida

### Por Tópico

#### Autenticação e Segurança
- [Fluxo de Autenticação](./architecture/auth-flow-diagram.md)
- [OAuth Google - Completo](./guides/oauth-google-complete.md)
- [OAuth Google - Notas de Implementação](./notes/2025-09-11-oauth-google-implementation.md)
- [CRUD e Roles - Guia Completo](./guides/crud-roles-complete-guide.md)

#### Banco de Dados
- [Comandos Prisma](./guides/prisma-commands.md)
- [Guia de Estudos Prisma](./guides/prisma-student-guide.md)

#### Dashboard e CRUD
- [Guia de CRUD do Dashboard](./guides/crud-guide.md)
- [CRUD e Roles - Guia Completo](./guides/crud-roles-complete-guide.md)
- [Notas: Dashboard CRUD](./notes/2025-09-10-dashboard-crud.md)

#### APIs e Integrações
- [Integração MMR/Match](./api/mmr-match-integration.md)

#### Desenvolvimento
- [README de Desenvolvimento](./development/README.md)
- [CHANGELOG](./development/CHANGELOG.md)
- [ROADMAP](./development/ROADMAP.md)

---

## 🎯 Para Iniciantes

Se você é novo no projeto, recomendamos seguir esta ordem:

1. **[README Principal](../README.md)** - Entenda o que é o projeto e como configurar
2. **[Guia de Desenvolvimento](./development/README.md)** - Configure seu ambiente e aprenda os padrões
3. **[Fluxo de Autenticação](./architecture/auth-flow-diagram.md)** - Compreenda como funciona a autenticação
4. **[Comandos Prisma](./guides/prisma-commands.md)** - Aprenda a trabalhar com o banco de dados
5. **[CRUD e Roles](./guides/crud-roles-complete-guide.md)** - Entenda como criar funcionalidades com controle de acesso

---

## 🤝 Contribuindo com a Documentação

A documentação é tão importante quanto o código! Se você encontrou algo confuso ou desatualizado:

1. **Crie uma issue** descrevendo o problema
2. **Ou melhor**: Faça um PR corrigindo/melhorando a documentação
3. **Adicione novas páginas** quando implementar features significativas

### Boas Práticas para Documentação

- ✅ Use linguagem clara e objetiva
- ✅ Inclua exemplos de código quando relevante
- ✅ Mantenha o índice atualizado
- ✅ Use emojis para facilitar escaneamento visual
- ✅ Adicione links internos entre documentos relacionados
- ✅ Documente o "porquê" das decisões, não apenas o "como"

---

## 📞 Precisa de Ajuda?

- **Issues**: Abra uma issue no GitHub com a tag `documentation`
- **Discussões**: Use GitHub Discussions para perguntas gerais
- **Email**: [contato@example.com]

---

## 🔄 Convenções

### Nomenclatura de Arquivos
- **Guias**: `nome-descritivo-do-guia.md`
- **Notas técnicas**: `YYYY-MM-DD-titulo-descritivo.md`
- **APIs**: `nome-da-api-integration.md`

### Estrutura de Markdown
```markdown
# Título Principal

Breve descrição do documento.

## Seção 1
Conteúdo...

### Subseção 1.1
Detalhes...

## Referências
Links relacionados...
```

### Emojis Recomendados
- 📚 Documentação geral
- 🚀 Início rápido / Deploy
- 🏗️ Arquitetura
- 📘 Guias
- 🔌 APIs
- 🛠️ Desenvolvimento
- 📝 Notas
- ✨ Features
- 🐛 Bugs
- 🔒 Segurança
- ⚡ Performance
- 💡 Dicas

---

## 📊 Status da Documentação

| Seção | Cobertura | Status |
|-------|-----------|--------|
| Architecture | 20% | 🟡 Em andamento |
| Guides | 60% | 🟢 Bom |
| API | 10% | 🔴 Incompleto |
| Development | 100% | 🟢 Completo |
| Notes | 100% | 🟢 Atualizado |

**Meta**: Atingir 80%+ de cobertura até v1.0.0

---

## 📜 Changelog da Documentação

### 2025-11-15
- ✨ Criação da estrutura completa de documentação
- ✨ Adicionado README principal (este arquivo)
- ✨ Criado `/development` com README, CHANGELOG e ROADMAP
- ✨ Reorganização de arquivos existentes em pastas apropriadas
- ✨ Criação de pasta `/tasks` para organização de tarefas

### Anteriormente
- Documentos criados conforme necessidade, sem estrutura definida

---

**Última atualização**: 2025-11-15
**Mantenedor**: Equipe Valorant Ascension
**Versão da documentação**: 1.0.0
