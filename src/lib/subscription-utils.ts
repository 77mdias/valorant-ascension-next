/**
 * Utilitários para assinaturas Stripe
 */

/**
 * Busca o plano de assinatura do usuário baseado no stripePriceId
 */
export function getSubscriptionPlanName(stripePriceId: string | null): string {
  if (!stripePriceId) return "Nenhum";

  const priceIds = {
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO || ""]: "Básico",
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO || ""]: "Intermediário",
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_AVANCADO || ""]: "Avançado",
  };

  return priceIds[stripePriceId] || "Desconhecido";
}

/**
 * Mapeia o status da assinatura para label em português
 */
export function getSubscriptionStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    active: "Ativa",
    canceled: "Cancelada",
    past_due: "Pagamento Atrasado",
    unpaid: "Não Paga",
    incomplete: "Incompleta",
    incomplete_expired: "Expirada",
    trialing: "Período de Teste",
  };

  return statusMap[status] || status;
}

/**
 * Retorna configuração de cor para o status da assinatura
 */
export function getSubscriptionStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: "bg-green-500/10 text-green-500 border-green-500/30",
    canceled: "bg-red-500/10 text-red-500 border-red-500/30",
    past_due: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    unpaid: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    incomplete: "bg-gray-500/10 text-gray-500 border-gray-500/30",
    incomplete_expired: "bg-gray-500/10 text-gray-500 border-gray-500/30",
    trialing: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  };

  return colorMap[status] || "bg-gray-500/10 text-gray-500 border-gray-500/30";
}
