#!/bin/bash

# Script para comandos Prisma em PRODUÇÃO
# ⚠️ ATENÇÃO: Este script modifica o banco de PRODUÇÃO
# Usa as variáveis DATABASE_URL_PROD e DIRECT_URL_PROD do .env

echo "🚨 AMBIENTE: PRODUÇÃO"
echo "⚠️  ATENÇÃO: Este script modifica o banco de PRODUÇÃO!"
echo ""

# Validação de segurança
read -p "🤔 Você tem certeza que quer executar comandos em PRODUÇÃO? (digite 'PRODUCAO' para confirmar): " confirm

if [ "$confirm" != "PRODUCAO" ]; then
    echo "❌ Operação cancelada por segurança"
    exit 1
fi

# Carrega variáveis do .env de forma segura, com fallback para env vars
if [ -f ".env" ]; then
    echo "🔧 Carregando variáveis de ambiente do arquivo .env..."

    # Lê cada linha do .env, ignora comentários e linhas vazias
    while IFS= read -r line || [ -n "$line" ]; do
        # Remove espaços em branco
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        # Ignora linhas vazias e comentários
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            # Exporta a variável de forma segura
            export "$line"
        fi
    done < ".env"

    echo "✅ Arquivo .env carregado com sucesso"
elif [ -n "$DATABASE_URL_PROD" ]; then
    echo "✅ Usando variáveis de ambiente já definidas (CI/CD mode)"
else
    echo "❌ Arquivo .env não encontrado e DATABASE_URL_PROD não está definida!"
    echo "💡 Crie um arquivo .env ou defina DATABASE_URL_PROD como variável de ambiente"
    exit 1
fi

# Exibir informações sobre as variáveis (se disponíveis)
if [ -n "$DATABASE_URL_PROD" ]; then
    echo "📊 DATABASE_URL_PROD: ✅ Definida"
fi
if [ -n "$DIRECT_URL_PROD" ]; then
    echo "📊 DIRECT_URL_PROD: ✅ Definida"
fi
echo ""

# Função para executar comando com retry para databases serverless (como Neon)
execute_with_retry() {
    local cmd=$1
    local max_retries=2
    local retry=0
    local exit_code=0
    
    while [ $retry -lt $max_retries ]; do
        if [ $retry -gt 0 ]; then
            echo "🔄 Tentativa $retry de $max_retries..."
            echo "⏳ Aguardando 3 segundos para o banco iniciar..."
            sleep 3
        fi
        
        eval "$cmd"
        exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            return 0
        fi
        
        retry=$((retry+1))
    done
    
    return $exit_code
}

# Define variáveis para produção
export DATABASE_URL="$DATABASE_URL_PROD"
export DIRECT_URL="$DIRECT_URL_PROD"

echo "🔒 Variáveis de PRODUÇÃO definidas"
echo ""

# Executa o comando passado como parâmetro
case "$1" in
    "validate")
        echo "🔍 Validando schema em PRODUÇÃO..."
        npx prisma validate
        ;;
    "generate")
        echo "⚙️ Gerando cliente Prisma para PRODUÇÃO..."
        npx prisma generate
        ;;
    "studio")
        echo "🎨 Abrindo Prisma Studio para PRODUÇÃO..."
        echo "⚠️  CUIDADO: Você está visualizando dados de PRODUÇÃO!"
        npx prisma studio
        ;;
    "deploy")
        echo "🚀 Deployando migrações em PRODUÇÃO..."
        npx prisma migrate deploy
        ;;
    "status")
        echo "📊 Status das migrações em PRODUÇÃO..."
        npx prisma migrate status
        ;;
    "introspect")
        echo "🔍 Introspectando banco de PRODUÇÃO..."
        npx prisma db pull
        ;;
    *)
        echo "❓ Comando não reconhecido: $1"
        echo "📖 Comandos disponíveis: validate, generate, studio, deploy, status, introspect"
        exit 1
        ;;
esac

echo ""
echo "✅ Comando executado com sucesso em PRODUÇÃO!"
echo "🔒 Lembre-se de limpar as variáveis após o uso"
