#!/bin/bash

# Script para comandos Prisma em DESENVOLVIMENTO
# Usa as variáveis DATABASE_URL e DIRECT_URL do .env

echo "🔧 Ambiente: DESENVOLVIMENTO"
echo "📊 Usando: DATABASE_URL e DIRECT_URL do .env"
echo ""

# Carrega variáveis do .env de forma segura
if [ -f ".env" ]; then
    echo "🔧 Carregando variáveis de ambiente..."
    
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
    
    echo "✅ Variáveis carregadas do .env"
    echo "📊 DATABASE_URL: ${DATABASE_URL:0:50}..."
    echo "📊 DIRECT_URL: ${DIRECT_URL:0:50}..."
else
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Executa o comando passado como parâmetro
case "$1" in
    "validate")
        echo "🔍 Validando schema..."
        npx prisma validate
        ;;
    "generate")
        echo "⚙️ Gerando cliente Prisma..."
        npx prisma generate
        ;;
    "studio")
        echo "🎨 Abrindo Prisma Studio..."
        npx prisma studio
        ;;
    "push")
        echo "📤 Sincronizando banco..."
        npx prisma db push
        ;;
    "migrate")
        echo "🔄 Executando migração..."
        npx prisma migrate dev
        ;;
    "status")
        echo "📊 Status das migrações..."
        npx prisma migrate status
        ;;
    *)
        echo "❓ Comando não reconhecido: $1"
        echo "📖 Comandos disponíveis: validate, generate, studio, push, migrate, status"
        exit 1
        ;;
esac

echo ""
echo "✅ Comando executado com sucesso!"
