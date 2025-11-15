import React from "react";
import {
  Users,
  MessageCircle,
  Trophy,
  Target,
  Gamepad2,
  Star,
  Crown,
  Zap,
  Shield,
  Flame,
} from "lucide-react";
import { BsDiscord, BsYoutube, BsTwitch } from "react-icons/bs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import globalStyles from "@/scss/components/CourseCard.module.scss";
import styles from "./page.module.scss";

// Mock data for community features
const communityFeatures = [
  {
    icon: MessageCircle,
    title: "Chat em Tempo Real",
    description:
      "Converse com outros jogadores, tire dúvidas e compartilhe estratégias 24/7 no nosso Discord.",
  },
  {
    icon: Users,
    title: "Grupos de Treino",
    description:
      "Participe de grupos organizados por rank e horário para treinar de forma consistente.",
  },
  {
    icon: Trophy,
    title: "Competições Semanais",
    description:
      "Disputas internas com prêmios exclusivos para os melhores desempenhos.",
  },
  {
    icon: Target,
    title: "Análise de Gameplay",
    description:
      "Receba feedback personalizado dos nossos coaches profissionais sobre suas partidas.",
  },
  {
    icon: Gamepad2,
    title: "Lobbies Personalizados",
    description:
      "Salas exclusivas para treinar estratégias específicas com a comunidade.",
  },
  {
    icon: Star,
    title: "Sistema de Rankings",
    description:
      "Acompanhe seu progresso e compare com outros membros da academia.",
  },
];

// Mock data for community stats
const communityStats = [
  { number: "2.5K+", label: "Membros Ativos" },
  { number: "150+", label: "Coaches Certificados" },
  { number: "500+", label: "Competições Realizadas" },
  { number: "98%", label: "Taxa de Melhoria" },
];

// Mock data for top instructors
const topInstructors = [
  {
    id: 1,
    name: "Carlos 'Phantom' Silva",
    role: "Head Coach",
    rank: "Radiante #1 BR",
    avatar: "CS",
    specialties: ["Aim Training", "Game Sense"],
  },
  {
    id: 2,
    name: "Ana 'Viper' Santos",
    role: "Estrategista",
    rank: "Imortal 3",
    avatar: "AS",
    specialties: ["Map Control", "Team Play"],
  },
  {
    id: 3,
    name: "Pedro 'Sage' Costa",
    role: "Mental Coach",
    rank: "Radiante",
    avatar: "PC",
    specialties: ["Psychology", "Consistency"],
  },
  {
    id: 4,
    name: "Júlia 'Jett' Lima",
    role: "Duelist Specialist",
    rank: "Imortal 3",
    avatar: "JL",
    specialties: ["Entry Fragging", "Mechanics"],
  },
  {
    id: 5,
    name: "Bruno 'Omen' Rodrigues",
    role: "Controller Expert",
    rank: "Radiante",
    avatar: "BR",
    specialties: ["Smokes", "Utility Usage"],
  },
  {
    id: 6,
    name: "Marina 'Killjoy' Alves",
    role: "Sentinel Coach",
    rank: "Imortal 2",
    avatar: "MA",
    specialties: ["Site Defense", "Utility"],
  },
];

const Community = () => {
  return (
    <div className={styles.communityContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1a1a1a/333333?text=Valorant+Training')] bg-cover bg-center opacity-30"></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span>Comunidade</span>
            <span className={styles.gradientText}> Valorant NeXT</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Conecte-se com milhares de jogadores, participe de treinos
            exclusivos e acelere seu crescimento no game.
          </p>
          <div className={styles.heroButtons}>
            <Button
              size="lg"
              className={`${globalStyles.bgGradientPrimary} ${globalStyles.buttonPrimary} min-w-[212px] px-8 text-primary-foreground transition-all duration-300`}
              asChild
            >
              <Link href="https://discord.gg/valorant-academy" target="_blank">
                <BsDiscord className="mr-2 h-5 w-5" />
                Entrar no Discord
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[212px] border-primary/30 px-8 transition-all duration-300 hover:border-primary hover:bg-primary/10"
              asChild
            >
              <Link href="/auth/register">Seja um Instrutor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            Por que nossa{" "}
            <span className={styles.gradientText}>comunidade</span> é especial?
          </h2>
          <p className={styles.sectionSubtitle}>
            Recursos exclusivos pensados para acelerar seu desenvolvimento no
            Valorant
          </p>

          <div className={styles.featuresGrid}>
            {communityFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className={styles.statsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            Números que{" "}
            <span className={styles.gradientText}>impressionam</span>
          </h2>

          <div className={styles.statsGrid}>
            {communityStats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className={styles.instructorsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>
            Nossos <span className={styles.gradientText}>Instrutores</span> Top
          </h2>
          <p className={styles.sectionSubtitle}>
            Aprenda com os melhores jogadores e coaches do cenário brasileiro
          </p>

          <div className={styles.instructorsGrid}>
            {topInstructors.map((instructor) => (
              <div key={instructor.id} className={styles.instructorCard}>
                <div className={styles.instructorAvatar}>
                  {instructor.avatar}
                </div>
                <h3 className={styles.instructorName}>{instructor.name}</h3>
                <div className={styles.instructorRole}>{instructor.role}</div>
                <div className={styles.instructorRank}>{instructor.rank}</div>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {instructor.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="border-purple-500/30 bg-purple-500/20 text-xs text-purple-300"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Pronto para <span className={styles.gradientText}>evoluir</span>{" "}
              no Valorant?
            </h2>
            <p className={styles.ctaDescription}>
              Junte-se à nossa comunidade hoje mesmo e comece sua jornada rumo
              ao próximo rank. Coaching profissional, treinos organizados e uma
              comunidade que vai te apoiar em cada partida.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className={`${globalStyles.bgGradientPrimary} ${globalStyles.buttonPrimary} px-8 text-lg ${styles.pulseAnimation}`}
                asChild
              >
                <Link
                  href="https://discord.gg/valorant-academy"
                  target="_blank"
                >
                  <BsDiscord className="mr-2 h-5 w-5" />
                  Entrar Agora no Discord
                </Link>
              </Button>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  asChild
                >
                  <Link
                    href="https://youtube.com/@valorantacademy"
                    target="_blank"
                  >
                    <BsYoutube className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  asChild
                >
                  <Link
                    href="https://twitch.tv/valorantacademy"
                    target="_blank"
                  >
                    <BsTwitch className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
