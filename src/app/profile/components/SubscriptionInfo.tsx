import { Badge } from "@/components/ui/badge";
import { getSubscriptionPlanName } from "@/lib/subscription-utils";
import { Calendar, CreditCard, AlertCircle } from "lucide-react";

interface SubscriptionInfoProps {
  subscription: {
    id: string;
    stripePriceId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
}

export default function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const planName = getSubscriptionPlanName(subscription.stripePriceId);

  const statusConfig = {
    active: {
      label: "Ativa",
      color: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    canceled: {
      label: "Cancelada",
      color: "bg-red-500/10 text-red-500 border-red-500/30",
    },
    past_due: {
      label: "Pagamento Atrasado",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    },
  };

  const status = statusConfig[subscription.status as keyof typeof statusConfig] || {
    label: subscription.status,
    color: "bg-gray-500/10 text-gray-500 border-gray-500/30",
  };

  return (
    <div className="bg-[var(--card-product)] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Assinatura
        </h3>
        <Badge className={`${status.color} border`}>
          {status.label}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Plano */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Plano:</span>
          <span className="text-white font-semibold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {planName}
          </span>
        </div>

        {/* Período */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Período atual:
          </span>
          <span className="text-white text-sm">
            {new Date(subscription.currentPeriodStart).toLocaleDateString("pt-BR")} -{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
          </span>
        </div>

        {/* Próxima cobrança ou cancelamento */}
        {subscription.cancelAtPeriodEnd ? (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-500 font-medium text-sm">
                Assinatura será cancelada em
              </p>
              <p className="text-yellow-400 text-sm">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Próxima cobrança:</span>
            <span className="text-white font-medium">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
            </span>
          </div>
        )}

        {/* Link para gerenciar assinatura */}
        <div className="pt-4 border-t border-gray-700">
          <a
            href="/subscription/manage"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Gerenciar assinatura →
          </a>
        </div>
      </div>
    </div>
  );
}
