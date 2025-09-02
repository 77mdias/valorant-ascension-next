#!/usr/bin/env tsx

// Script TypeScript para validar o Prisma com variáveis de ambiente carregadas
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Carrega o .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log("✅ Arquivo .env carregado");
  console.log(
    "📊 DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Definida" : "❌ Não definida",
  );
} else {
  console.error("❌ Arquivo .env não encontrado em:", envPath);
  process.exit(1);
}

// Valida o schema
try {
  console.log("🔍 Validando schema Prisma...");
  execSync("npx prisma validate", { stdio: "inherit" });
  console.log("✅ Schema validado com sucesso!");
} catch (error) {
  // Verificação de tipo para acessar a propriedade message
  if (error instanceof Error) {
    console.error("❌ Erro na validação:", error.message);
  } else {
    console.error("❌ Erro na validação:", String(error));
  }
  process.exit(1);
}
