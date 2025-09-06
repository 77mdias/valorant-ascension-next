// Preços dos planos (IDs do Stripe)
export const PLANOS = {
  BASICO: "price_1S1wNQCdbOQyaOyWziMobE8Y",
  INTERMEDIARIO: "price_1S1wOGCdbOQyaOyWlIZjIESx",
  AVANCADO: "price_1S1wOrCdbOQyaOyWNeAk9GBk",
} as const;

// Ordem dos planos
export const PLANO_ORDEM = ["BASICO", "INTERMEDIARIO", "AVANCADO"] as const;

// Nomes dos planos
export const PLANO_NOMES = {
  BASICO: "Básico",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
} as const;

// Tipos
export type PlanType = keyof typeof PLANOS;

// Funções auxiliares
export function getPlanName(planType: PlanType): string {
  return PLANO_NOMES[planType];
}

export function getPlanTypeFromPriceId(priceId: string): PlanType | null {
  const entry = Object.entries(PLANOS).find(([_, value]) => value === priceId);
  return entry ? (entry[0] as PlanType) : null;
}

export function canUpgradePlan(
  currentPlan: PlanType,
  targetPlan: PlanType,
): boolean {
  const currentIndex = PLANO_ORDEM.indexOf(currentPlan);
  const targetIndex = PLANO_ORDEM.indexOf(targetPlan);
  return targetIndex > currentIndex;
}

export function canDowngradePlan(
  currentPlan: PlanType,
  targetPlan: PlanType,
): boolean {
  const currentIndex = PLANO_ORDEM.indexOf(currentPlan);
  const targetIndex = PLANO_ORDEM.indexOf(targetPlan);
  return targetIndex < currentIndex;
}
