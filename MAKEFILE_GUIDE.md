# Makefile Quick Reference Guide

Guia rápido de comandos do Makefile para o projeto Valorant Ascension.

## 🚀 Quick Start

```bash
# Ver todos os comandos disponíveis
make help

# Setup inicial do projeto
make setup

# Desenvolvimento
make dev
```

---

## 📋 Comandos Mais Usados

### Desenvolvimento Diário

```bash
make dev              # Iniciar servidor de desenvolvimento
make build            # Build para produção
make clean            # Limpar caches e builds
```

### Antes de Commit

```bash
make pre-commit       # Executar quality + tests
make lint-fix         # Corrigir problemas de lint
make format           # Formatar código
```

### Antes de Push/PR

```bash
make ci               # Simular pipeline CI completa
make pre-push         # Executar todos os checks
```

---

## 📚 Comandos por Categoria

### 🔧 Setup & Installation

| Comando | Descrição |
|---------|-----------|
| `make setup` | Setup inicial completo do projeto |
| `make install` | Instalar dependências |
| `make update` | Atualizar dependências |
| `make check-node` | Verificar versão do Node.js |
| `make check-pnpm` | Verificar instalação do pnpm |

### 💻 Development

| Comando | Descrição |
|---------|-----------|
| `make dev` | Iniciar servidor de desenvolvimento |
| `make build` | Build para produção |
| `make start` | Iniciar servidor de produção |
| `make clean` | Limpar builds e caches |
| `make clean-all` | Limpar tudo (incluindo node_modules) |

### ✨ Code Quality

| Comando | Descrição |
|---------|-----------|
| `make quality` | Executar todos os checks de qualidade |
| `make lint` | Executar ESLint |
| `make lint-fix` | Corrigir problemas automaticamente |
| `make type-check` | Verificar tipos TypeScript |
| `make format` | Formatar código com Prettier |
| `make format-check` | Verificar formatação sem alterar |

### 🧪 Testing

| Comando | Descrição |
|---------|-----------|
| `make test` | Executar testes |
| `make test-watch` | Testes em watch mode |
| `make test-coverage` | Testes com coverage report |
| `make test-ci` | Testes em modo CI |
| `make test-unit` | Apenas testes unitários |
| `make test-integration` | Testes de integração |
| `make test-e2e` | Testes E2E |

### 🔒 Security

| Comando | Descrição |
|---------|-----------|
| `make security` | Executar todos os checks de segurança |
| `make audit` | npm audit (vulnerabilidades) |
| `make audit-fix` | Corrigir vulnerabilidades automaticamente |
| `make secrets-scan` | Scan de secrets no código |
| `make deps-check` | Verificar deps desatualizadas |

### 🗄️ Database (Prisma)

| Comando | Descrição |
|---------|-----------|
| `make db-generate` | Gerar Prisma Client |
| `make db-validate` | Validar schema |
| `make db-migrate` | Criar migration (dev) |
| `make db-push` | Push schema para DB (dev) |
| `make db-studio` | Abrir Prisma Studio (dev) |
| `make db-seed` | Popular banco com dados |
| `make db-reset` | Reset completo (dev) ⚠️ |
| `make db-prod-deploy` | Deploy migrations (prod) |
| `make db-prod-studio` | Prisma Studio (prod) |

### 🤖 CI/CD Simulation

| Comando | Descrição |
|---------|-----------|
| `make ci` | **Simular pipeline CI completa** |
| `make ci-quality` | Apenas checks de qualidade |
| `make ci-security` | Apenas checks de segurança |
| `make ci-fast` | CI rápido (sem build/testes) |

### ✅ Validation

| Comando | Descrição |
|---------|-----------|
| `make validate-env` | Validar variáveis de ambiente |
| `make validate-all` | Validar tudo (env, db, quality) |

### 📊 Performance & Analysis

| Comando | Descrição |
|---------|-----------|
| `make analyze` | Analisar bundle |
| `make size` | Verificar tamanho do bundle |
| `make benchmark` | Benchmark de build |

### 🐳 Docker (Opcional)

| Comando | Descrição |
|---------|-----------|
| `make docker-build` | Build imagem Docker |
| `make docker-up` | Subir containers |
| `make docker-down` | Parar containers |
| `make docker-logs` | Ver logs |

### ℹ️ Utilities

| Comando | Descrição |
|---------|-----------|
| `make info` | Mostrar informações do projeto |
| `make list-scripts` | Listar scripts do package.json |
| `make git-check` | Verificar status do git |

---

## ⚡ Aliases (Shortcuts)

Para comandos mais rápidos:

```bash
make t      # = make test
make tc     # = make test-coverage
make tw     # = make test-watch
make l      # = make lint
make lf     # = make lint-fix
make b      # = make build
make d      # = make dev
make c      # = make clean
make q      # = make quality
make s      # = make security
```

---

## 🔄 Workflows Comuns

### 1. Começar a trabalhar no projeto

```bash
git pull
make install
make dev
```

### 2. Antes de commitar

```bash
make lint-fix          # Corrigir lint
make format            # Formatar código
make pre-commit        # Verificar tudo
git add .
git commit -m "feat: sua mensagem"
```

### 3. Antes de criar PR

```bash
make ci                # Simular CI completa
git push
```

### 4. Trabalhar com banco de dados

```bash
# Desenvolvimento
make db-migrate        # Criar migration
make db-studio         # Visualizar dados
make db-seed           # Popular com dados

# Produção
make db-prod-deploy    # Deploy migrations
```

### 5. Debugar problemas

```bash
make clean             # Limpar caches
make install           # Reinstalar deps
make db-generate       # Regenerar Prisma
make build             # Testar build
```

### 6. Verificar segurança

```bash
make security          # Todos os checks
make audit             # Vulnerabilidades
make secrets-scan      # Secrets no código
```

---

## 🎯 Comandos Avançados

### Pipeline Completa Local

```bash
make all
```

Executa em sequência:
1. `clean` - Limpa tudo
2. `install` - Instala deps
3. `quality` - Checks de qualidade
4. `test` - Testes
5. `build` - Build

### Monitorar mudanças (Watch CI)

```bash
make watch-ci
```

Executa CI automaticamente quando arquivos mudam.

### Benchmark de Performance

```bash
make benchmark
```

Mede tempo de build para otimizações.

---

## 💡 Dicas

1. **Use `make help`** para ver todos os comandos disponíveis
2. **Use aliases** (`make d` em vez de `make dev`) para velocidade
3. **Execute `make ci` antes de push** para evitar falhas no GitHub Actions
4. **Use `make db-reset`** com cuidado - apaga todos os dados!
5. **Configure pre-commit hooks** para executar checks automaticamente:
   ```bash
   # Em .git/hooks/pre-commit
   #!/bin/sh
   make pre-commit
   ```

---

## 🐛 Troubleshooting

### Comando não funciona

```bash
# Verificar se Make está instalado
make --version

# Se não estiver, instalar (Ubuntu/Debian)
sudo apt install make

# macOS
brew install make
```

### Erro "pnpm not found"

```bash
npm install -g pnpm
```

### Erro "Node version"

```bash
# Instalar Node 18+
nvm install 18
nvm use 18
```

### Clean não resolve

```bash
make clean-all    # Remove node_modules também
make setup        # Reinstala tudo
```

---

## 📖 Referências

- [Makefile Documentation](https://www.gnu.org/software/make/manual/)
- [pnpm Documentation](https://pnpm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Dica:** Adicione este arquivo aos seus favoritos para consulta rápida!

Para ver comandos atualizados, sempre execute:
```bash
make help
```
