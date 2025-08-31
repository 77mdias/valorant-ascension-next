// prisma.config.ts
import { defineConfig } from "@prisma/config";
import "dotenv/config";
import path from "node:path";

export default defineConfig({
  experimental: {
    externalTables: true,
    studio: true,
  },
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
});
