import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import heroImage from "../../public/hero-valorant.jpg";
import { Button } from "./ui/button";
import { HeroBackground } from "./Hero/HeroBackground";
import { HeroBadge } from "./Hero/HeroBadge";
import { HeroContent } from "./Hero/HeroContent";
import { HeroStats, type StatItemProps } from "./Hero/HeroStats";
import { HeroScrollIndicator } from "./Hero/HeroScrollIndicator";
import { HeroActions } from "./Hero/HeroActions";

const HERO_STATS: StatItemProps[] = [
  { label: "Alunos Ativos", value: "500+", colorClassName: "text-primary" },
  { label: "Taxa de Evolução", value: "95%", colorClassName: "text-secondary" },
  { label: "Horas de Conteúdo", value: "1000+", colorClassName: "text-accent" },
  { label: "Radiant Coaches", value: "50+", colorClassName: "text-ciano" },
];

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <HeroBackground image={heroImage} />

      <HeroContent>
        <HeroBadge>🇧🇷 Academia Brasileira #1 em Valorant</HeroBadge>

        <h1 className="mb-6 font-poppins text-5xl font-bold leading-tight md:text-7xl">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Domine o Valorant
          </span>
          <br />
          <span className="text-foreground">com os Melhores</span>
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Treinos práticos, aulas ao vivo e análises de partidas — do básico
          ao Imortal.
          <br />
          <span className="font-medium text-accent">
            Evolua seu gameplay com metodologia comprovada.
          </span>
        </p>

        <HeroActions>
          <Button
            size="lg"
            className="btn-gradient group rounded-full px-8 py-4 text-lg font-semibold"
            asChild
          >
            <Link href="/login" className="flex items-center">
              Academia
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-primary/30 px-8 py-4 text-lg font-semibold hover:border-primary hover:bg-primary/10"
          >
            <Play className="mr-2 h-5 w-5" />
            Ver Conteúdo
          </Button>
        </HeroActions>

        <HeroStats stats={HERO_STATS} />
      </HeroContent>

      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;
