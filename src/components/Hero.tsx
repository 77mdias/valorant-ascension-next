import { Button } from "./ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/hero-valorant.jpg";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Valorant Academy BR Training Facility"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="glass-card mb-8 inline-flex items-center rounded-full px-4 py-2">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary"></span>
            <span className="text-sm font-medium">
              🇧🇷 Academia Brasileira #1 em Valorant
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 font-poppins text-5xl font-bold leading-tight md:text-7xl">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Domine o Valorant
            </span>
            <br />
            <span className="text-foreground">com os Melhores</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Treinos práticos, aulas ao vivo e análises de partidas — do básico
            ao Imortal.
            <br />
            <span className="font-medium text-accent">
              Evolua seu gameplay com metodologia comprovada.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="btn-gradient group rounded-full px-8 py-4 text-lg font-semibold"
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
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-secondary">95%</div>
              <div className="text-sm text-muted-foreground">
                Taxa de Evolução
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-accent">1000+</div>
              <div className="text-sm text-muted-foreground">
                Horas de Conteúdo
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-ciano">50+</div>
              <div className="text-sm text-muted-foreground">
                Radiant Coaches
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-primary/50">
          <div className="mt-2 h-3 w-1 rounded-full bg-primary"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
