import { Card, CardContent } from "./ui/card";
import {
  Calendar,
  Video,
  Users,
  BarChart3,
  Target,
  Trophy,
} from "lucide-react";

const benefits = [
  {
    icon: Calendar,
    title: "Planos de Treino Semanais",
    description:
      "Rotinas focadas em mira, game sense e tomada de decisão adaptadas ao seu nível atual.",
    color: "text-primary",
  },
  {
    icon: Video,
    title: "Análise de Partidas",
    description:
      "Receba feedback objetivo e metas claras para evoluir rapidamente no jogo.",
    color: "text-secondary",
  },
  {
    icon: Users,
    title: "Aulas ao Vivo",
    description:
      "Sessões interativas com pros brasileiros, tire dúvidas em tempo real.",
    color: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Progresso",
    description:
      "Acompanhe sua evolução com métricas detalhadas e relatórios personalizados.",
    color: "text-ciano",
  },
  {
    icon: Target,
    title: "Metas Personalizadas",
    description:
      "Objetivos específicos baseados no seu perfil de jogador e aspirações competitivas.",
    color: "text-golden",
  },
  {
    icon: Trophy,
    title: "Comunidade BR",
    description:
      "Conecte-se com players brasileiros, forme squads e participe de campeonatos internos.",
    color: "text-primary",
  },
];

const Benefits = () => {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="font-poppins mb-6 text-4xl font-bold md:text-5xl">
          Por que escolher a
          <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
            {" "}
            Academy?
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          Nossa metodologia comprovada já ajudou centenas de players brasileiros
          a alcançarem seus objetivos no Valorant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card
              key={index}
              className="glass-card hover-card border-border/50 group p-8"
            >
              <CardContent className="p-0">
                <div
                  className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${
                    benefit.color === "text-primary"
                      ? "from-primary/20 to-primary/10"
                      : benefit.color === "text-secondary"
                        ? "from-secondary/20 to-secondary/10"
                        : benefit.color === "text-accent"
                          ? "from-accent/20 to-accent/10"
                          : benefit.color === "text-ciano"
                            ? "from-ciano/20 to-ciano/10"
                            : "from-golden/20 to-golden/10"
                  } mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-8 w-8 ${benefit.color}`} />
                </div>

                <h3 className="font-poppins text-foreground mb-4 text-xl font-semibold">
                  {benefit.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Benefits;
