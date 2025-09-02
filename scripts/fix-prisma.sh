#!/bin/bash

# Script para executar Prisma com variáveis de ambiente do .env
# Carrega o arquivo .env de forma segura

# Verifica se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📝 Crie um arquivo .env na raiz do projeto com:"
    echo "   DATABASE_URL=sua_url_aqui"
    echo "   DIRECT_URL=sua_url_direta_aqui"
    exit 1
fi

# Carrega as variáveis do .env
echo "🔧 Carregando variáveis de ambiente do .env..."
source .env

# Verifica se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não está definida no arquivo .env"
    exit 1
fi

echo "✅ Variáveis carregadas com sucesso!"
echo "📊 DATABASE_URL: ${DATABASE_URL:0:50}..." # Mostra apenas o início da URL
echo ""

echo "🔍 Executando Prisma validate..."
npx prisma validate

echo ""
echo "✅ Comando executado!"
