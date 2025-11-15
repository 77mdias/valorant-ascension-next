# Makefile para Valorant Ascension Next.js
# Automatiza comandos de desenvolvimento, testes, CI/CD e deploy

# ================================
# Configurações
# ================================

.PHONY: help
.DEFAULT_GOAL := help

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color
BOLD := \033[1m

# Package manager
PKG_MANAGER := pnpm

# Node version (mínima)
REQUIRED_NODE_VERSION := 18

# ================================
# Help & Documentation
# ================================

help: ## 📚 Mostrar este menu de ajuda
	@echo ""
	@echo "$(BOLD)$(BLUE)╔════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BOLD)$(BLUE)║  🎯 Valorant Ascension - Makefile Commands           ║$(NC)"
	@echo "$(BOLD)$(BLUE)╚════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(BOLD)Uso:$(NC) make [comando]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ================================
# Setup & Installation
# ================================

check-node: ## 🔍 Verificar versão do Node.js
	@echo "$(BLUE)→ Verificando Node.js...$(NC)"
	@node --version | grep -q "v$(REQUIRED_NODE_VERSION)" || \
		(echo "$(RED)✗ Node.js $(REQUIRED_NODE_VERSION)+ necessário$(NC)" && exit 1)
	@echo "$(GREEN)✓ Node.js OK$(NC)"

check-pnpm: ## 🔍 Verificar instalação do pnpm
	@echo "$(BLUE)→ Verificando pnpm...$(NC)"
	@command -v pnpm >/dev/null 2>&1 || \
		(echo "$(RED)✗ pnpm não encontrado. Instale com: npm install -g pnpm$(NC)" && exit 1)
	@echo "$(GREEN)✓ pnpm OK$(NC)"

install: check-pnpm ## 📦 Instalar dependências
	@echo "$(BLUE)→ Instalando dependências...$(NC)"
	@$(PKG_MANAGER) install
	@echo "$(GREEN)✓ Dependências instaladas$(NC)"

setup: check-node check-pnpm install db-generate ## 🚀 Setup inicial do projeto
	@echo "$(BLUE)→ Configurando projeto...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)⚠ .env não encontrado. Copie .env.example para .env$(NC)"; \
	fi
	@echo "$(GREEN)✓ Setup completo!$(NC)"
	@echo ""
	@echo "$(BOLD)Próximos passos:$(NC)"
	@echo "  1. Configure suas variáveis em .env"
	@echo "  2. Execute: make dev"

update: ## 🔄 Atualizar dependências
	@echo "$(BLUE)→ Atualizando dependências...$(NC)"
	@$(PKG_MANAGER) update
	@echo "$(GREEN)✓ Dependências atualizadas$(NC)"

# ================================
# Development
# ================================

dev: ## 🚀 Iniciar servidor de desenvolvimento
	@echo "$(BLUE)→ Iniciando dev server...$(NC)"
	@$(PKG_MANAGER) dev

build: ## 🏗️  Build para produção
	@echo "$(BLUE)→ Building aplicação...$(NC)"
	@$(PKG_MANAGER) build
	@echo "$(GREEN)✓ Build completo$(NC)"

start: ## ▶️  Iniciar servidor de produção
	@echo "$(BLUE)→ Iniciando produção...$(NC)"
	@$(PKG_MANAGER) start

clean: ## 🧹 Limpar builds e caches
	@echo "$(BLUE)→ Limpando arquivos...$(NC)"
	@rm -rf .next
	@rm -rf out
	@rm -rf build
	@rm -rf dist
	@rm -rf coverage
	@rm -rf node_modules/.cache
	@echo "$(GREEN)✓ Limpeza completa$(NC)"

clean-all: clean ## 🗑️  Limpar tudo (incluindo node_modules)
	@echo "$(YELLOW)⚠ Removendo node_modules...$(NC)"
	@rm -rf node_modules
	@echo "$(GREEN)✓ Tudo limpo. Execute 'make install' para reinstalar$(NC)"

# ================================
# Code Quality
# ================================

lint: ## 🔍 Executar ESLint
	@echo "$(BLUE)→ Executando ESLint...$(NC)"
	@$(PKG_MANAGER) lint

lint-fix: ## 🔧 Corrigir problemas do ESLint automaticamente
	@echo "$(BLUE)→ Corrigindo com ESLint...$(NC)"
	@$(PKG_MANAGER) lint --fix
	@echo "$(GREEN)✓ Correções aplicadas$(NC)"

type-check: ## 📝 Verificar tipos TypeScript
	@echo "$(BLUE)→ Verificando tipos...$(NC)"
	@$(PKG_MANAGER) type-check
	@echo "$(GREEN)✓ Type check passou$(NC)"

format: ## 🎨 Formatar código com Prettier
	@echo "$(BLUE)→ Formatando código...$(NC)"
	@npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"
	@echo "$(GREEN)✓ Código formatado$(NC)"

format-check: ## 🎨 Verificar formatação
	@echo "$(BLUE)→ Verificando formatação...$(NC)"
	@npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

quality: lint type-check format-check ## ✨ Executar todos os checks de qualidade
	@echo "$(GREEN)✓ Todos os checks de qualidade passaram!$(NC)"

# ================================
# Testing
# ================================

test: ## 🧪 Executar testes
	@echo "$(BLUE)→ Executando testes...$(NC)"
	@$(PKG_MANAGER) test

test-watch: ## 👀 Executar testes em watch mode
	@echo "$(BLUE)→ Iniciando testes em watch mode...$(NC)"
	@$(PKG_MANAGER) test:watch

test-coverage: ## 📊 Executar testes com coverage
	@echo "$(BLUE)→ Executando testes com coverage...$(NC)"
	@$(PKG_MANAGER) test:coverage
	@echo "$(GREEN)✓ Coverage report gerado em coverage/$(NC)"

test-ci: ## 🤖 Executar testes em modo CI
	@echo "$(BLUE)→ Executando testes CI...$(NC)"
	@$(PKG_MANAGER) test:ci

test-unit: ## 🎯 Executar apenas testes unitários
	@echo "$(BLUE)→ Executando testes unitários...$(NC)"
	@$(PKG_MANAGER) test --testPathPattern=".*\.test\.(ts|tsx)$$"

test-integration: ## 🔗 Executar testes de integração
	@echo "$(BLUE)→ Executando testes de integração...$(NC)"
	@$(PKG_MANAGER) test --testPathPattern=".*\.integration\.(ts|tsx)$$"

test-e2e: ## 🌐 Executar testes E2E
	@echo "$(YELLOW)⚠ Testes E2E ainda não configurados$(NC)"
	@echo "$(BLUE)→ Configure Playwright ou Cypress para E2E tests$(NC)"

# ================================
# Security
# ================================

audit: ## 🔒 Executar npm audit
	@echo "$(BLUE)→ Executando security audit...$(NC)"
	@$(PKG_MANAGER) audit --audit-level=moderate || true

audit-fix: ## 🔧 Corrigir vulnerabilidades automaticamente
	@echo "$(BLUE)→ Corrigindo vulnerabilidades...$(NC)"
	@$(PKG_MANAGER) audit fix
	@echo "$(GREEN)✓ Vulnerabilidades corrigidas$(NC)"

secrets-scan: ## 🔐 Scan de secrets no código
	@echo "$(BLUE)→ Verificando secrets no código...$(NC)"
	@if command -v trufflehog >/dev/null 2>&1; then \
		trufflehog filesystem . --only-verified --fail; \
	else \
		echo "$(YELLOW)⚠ TruffleHog não instalado. Executando scan básico...$(NC)"; \
		grep -rE "(api[_-]?key|api[_-]?secret|password|secret[_-]?key|access[_-]?token|auth[_-]?token).*=.*['\"][a-zA-Z0-9]{20,}['\"]" src/ || echo "$(GREEN)✓ Nenhum secret encontrado$(NC)"; \
	fi

deps-check: ## 📦 Verificar dependências desatualizadas
	@echo "$(BLUE)→ Verificando dependências desatualizadas...$(NC)"
	@$(PKG_MANAGER) outdated || true

security: audit secrets-scan ## 🛡️  Executar todos os checks de segurança
	@echo "$(GREEN)✓ Security checks completos$(NC)"

# ================================
# Database (Prisma)
# ================================

db-generate: ## 🔨 Gerar Prisma Client
	@echo "$(BLUE)→ Gerando Prisma Client...$(NC)"
	@$(PKG_MANAGER) prisma generate
	@echo "$(GREEN)✓ Prisma Client gerado$(NC)"

db-validate: ## ✅ Validar schema do Prisma
	@echo "$(BLUE)→ Validando schema...$(NC)"
	@$(PKG_MANAGER) prisma:validate
	@echo "$(GREEN)✓ Schema válido$(NC)"

db-migrate: ## 🔄 Criar e aplicar migration (dev)
	@echo "$(BLUE)→ Criando migration...$(NC)"
	@$(PKG_MANAGER) prisma:migrate

db-push: ## ⬆️  Push schema para DB (dev)
	@echo "$(BLUE)→ Pushing schema...$(NC)"
	@$(PKG_MANAGER) prisma:push

db-studio: ## 🎨 Abrir Prisma Studio (dev)
	@echo "$(BLUE)→ Abrindo Prisma Studio...$(NC)"
	@$(PKG_MANAGER) prisma:studio

db-seed: ## 🌱 Popular banco com dados
	@echo "$(BLUE)→ Seeding database...$(NC)"
	@$(PKG_MANAGER) prisma db seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

db-reset: ## ⚠️  Reset completo do banco (dev)
	@echo "$(YELLOW)⚠ ATENÇÃO: Isso vai apagar TODOS os dados!$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(PKG_MANAGER) prisma migrate reset --force; \
		echo "$(GREEN)✓ Database resetado$(NC)"; \
	else \
		echo "$(BLUE)→ Operação cancelada$(NC)"; \
	fi

db-prod-deploy: ## 🚀 Deploy migrations (production)
	@echo "$(BLUE)→ Deploying migrations para produção...$(NC)"
	@$(PKG_MANAGER) prisma:prod:deploy
	@echo "$(GREEN)✓ Migrations deployed$(NC)"

db-prod-studio: ## 🎨 Abrir Prisma Studio (production)
	@echo "$(YELLOW)⚠ Conectando ao banco de produção...$(NC)"
	@$(PKG_MANAGER) prisma:prod:studio

# ================================
# CI/CD Simulation
# ================================

ci-quality: lint type-check db-validate ## ✅ Simular checks de qualidade da CI
	@echo "$(BLUE)→ Executando build...$(NC)"
	@$(PKG_MANAGER) build
	@echo "$(GREEN)✓ CI Quality checks passaram!$(NC)"

ci-security: audit secrets-scan ## 🔒 Simular checks de segurança da CI
	@echo "$(GREEN)✓ CI Security checks completos!$(NC)"

ci-fast: lint type-check db-validate ## ⚡ CI rápido (sem build/testes)
	@echo "$(GREEN)✓ Fast CI checks completos!$(NC)"

ci: ci-quality test-ci ci-security ## 🤖 Simular pipeline CI completa
	@echo ""
	@echo "$(GREEN)$(BOLD)╔════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)$(BOLD)║     ✓ Pipeline CI completa executada com sucesso!    ║$(NC)"
	@echo "$(GREEN)$(BOLD)╚════════════════════════════════════════════════════════╝$(NC)"
	@echo ""

# ================================
# Validation & Verification
# ================================

validate-env: ## 🔍 Validar variáveis de ambiente
	@echo "$(BLUE)→ Validando .env...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(RED)✗ .env não encontrado!$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ .env existe$(NC)"
	@echo "$(BLUE)→ Verificando variáveis obrigatórias...$(NC)"
	@grep -q "DATABASE_URL=" .env || (echo "$(RED)✗ DATABASE_URL não encontrado$(NC)" && exit 1)
	@grep -q "NEXTAUTH_SECRET=" .env || (echo "$(RED)✗ NEXTAUTH_SECRET não encontrado$(NC)" && exit 1)
	@grep -q "NEXTAUTH_URL=" .env || (echo "$(RED)✗ NEXTAUTH_URL não encontrado$(NC)" && exit 1)
	@echo "$(GREEN)✓ Variáveis essenciais presentes$(NC)"

validate-all: validate-env db-validate quality ## ✅ Validar tudo
	@echo "$(GREEN)✓ Todas as validações passaram!$(NC)"

# ================================
# Performance & Analysis
# ================================

analyze: ## 📊 Analisar bundle
	@echo "$(BLUE)→ Analisando bundle...$(NC)"
	@ANALYZE=true $(PKG_MANAGER) build
	@echo "$(GREEN)✓ Análise completa$(NC)"

size: ## 📏 Verificar tamanho do bundle
	@echo "$(BLUE)→ Calculando tamanho do bundle...$(NC)"
	@du -sh .next 2>/dev/null || echo "$(YELLOW)⚠ Execute 'make build' primeiro$(NC)"

# ================================
# Git & Commits
# ================================

git-check: ## 🔍 Verificar status do git
	@echo "$(BLUE)→ Status do Git:$(NC)"
	@git status --short
	@echo ""
	@echo "$(BLUE)→ Branch atual:$(NC)"
	@git branch --show-current

pre-commit: quality test ## ✅ Checks antes de commit
	@echo "$(GREEN)✓ Pronto para commit!$(NC)"

pre-push: ci ## ✅ Checks antes de push
	@echo "$(GREEN)✓ Pronto para push!$(NC)"

# ================================
# Docker (Opcional)
# ================================

docker-build: ## 🐳 Build imagem Docker
	@echo "$(BLUE)→ Building Docker image...$(NC)"
	@docker build -t valorant-ascension .
	@echo "$(GREEN)✓ Docker image built$(NC)"

docker-up: ## 🐳 Subir containers Docker
	@echo "$(BLUE)→ Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Containers rodando$(NC)"

docker-down: ## 🐳 Parar containers Docker
	@echo "$(BLUE)→ Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Containers parados$(NC)"

docker-logs: ## 📋 Ver logs dos containers
	@docker-compose logs -f

# ================================
# Utilities
# ================================

info: ## ℹ️  Mostrar informações do projeto
	@echo ""
	@echo "$(BOLD)$(BLUE)📊 Informações do Projeto$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BOLD)Nome:$(NC)         Valorant Ascension"
	@echo "$(BOLD)Versão:$(NC)       $$(node -p "require('./package.json').version")"
	@echo "$(BOLD)Node:$(NC)         $$(node --version)"
	@echo "$(BOLD)pnpm:$(NC)         $$(pnpm --version)"
	@echo "$(BOLD)Next.js:$(NC)      $$(node -p "require('./package.json').dependencies.next")"
	@echo "$(BOLD)TypeScript:$(NC)   $$(node -p "require('./package.json').devDependencies.typescript")"
	@echo "$(BOLD)Prisma:$(NC)       $$(node -p "require('./package.json').dependencies.prisma")"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""

list-scripts: ## 📜 Listar todos os scripts do package.json
	@echo "$(BOLD)$(BLUE)📜 Scripts disponíveis:$(NC)"
	@node -p "Object.keys(require('./package.json').scripts).join('\n')" | sed 's/^/  - /'

# ================================
# Shortcuts (Aliases)
# ================================

t: test ## Alias para test
tc: test-coverage ## Alias para test-coverage
tw: test-watch ## Alias para test-watch
l: lint ## Alias para lint
lf: lint-fix ## Alias para lint-fix
b: build ## Alias para build
d: dev ## Alias para dev
c: clean ## Alias para clean
q: quality ## Alias para quality
s: security ## Alias para security

# ================================
# Advanced
# ================================

watch-ci: ## 👁️  Monitorar mudanças e executar CI
	@echo "$(BLUE)→ Monitorando mudanças...$(NC)"
	@while true; do \
		$(MAKE) ci-fast; \
		inotifywait -r -e modify src/ 2>/dev/null || sleep 2; \
	done

benchmark: ## ⏱️  Benchmark de build
	@echo "$(BLUE)→ Executando benchmark...$(NC)"
	@time $(PKG_MANAGER) build

all: clean install quality test build ## 🎯 Executar tudo (clean, install, quality, test, build)
	@echo "$(GREEN)$(BOLD)✓ Pipeline completa executada!$(NC)"
