#!/usr/bin/env node

// Script para validar o Prisma com variáveis de ambiente carregadas
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Obter o diretório atual em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Arquivo .env carregado');
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida');
} else {
  console.error('❌ Arquivo .env não encontrado em:', envPath);
  process.exit(1);
}

// Valida o schema
try {
  console.log('🔍 Validando schema Prisma...');
  execSync('npx prisma validate', { stdio: 'inherit' });
  console.log('✅ Schema validado com sucesso!');
} catch (error) {
  console.error('❌ Erro na validação:', error.message);
  process.exit(1);
}
