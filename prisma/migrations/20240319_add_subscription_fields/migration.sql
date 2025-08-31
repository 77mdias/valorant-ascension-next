-- Adiciona a coluna cancelAtPeriodEnd na tabela subscription
ALTER TABLE "subscription" ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;
