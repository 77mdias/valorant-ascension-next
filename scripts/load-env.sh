#!/bin/bash

# Script para carregar variáveis de ambiente do .env
# Compatível com zsh e bash

# Função para carregar .env
load_env() {
    if [ -f ".env" ]; then
        echo "🔧 Carregando variáveis de ambiente..."
        
        # Lê cada linha do .env, ignora comentários e linhas vazias
        while IFS= read -r line || [ -n "$line" ]; do
            # Remove espaços em branco
            line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            
            # Ignora linhas vazias e comentários
            if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
                # Exporta a variável
                export "$line"
                echo "✅ $line"
            fi
        done < ".env"
        
        echo "✅ Variáveis carregadas com sucesso!"
        echo "📊 DATABASE_URL: ${DATABASE_URL:0:50}..."
        
    else
        echo "❌ Arquivo .env não encontrado!"
        exit 1
    fi
}

# Carrega as variáveis
load_env

# Executa o comando Prisma
echo ""
echo "🔍 Executando Prisma validate..."
npx prisma validate

echo ""
echo "✅ Comando executado!"
