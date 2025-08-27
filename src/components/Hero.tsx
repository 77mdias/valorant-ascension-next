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
        <div className="from-background/90 via-background/60 to-background/90 absolute inset-0 bg-gradient-to-r"></div>
        <div className="from-background/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="glass-card mb-8 inline-flex items-center rounded-full px-4 py-2">
            <span className="bg-primary mr-2 h-2 w-2 animate-pulse rounded-full"></span>
            <span className="text-sm font-medium">
              🇧🇷 Academia Brasileira #1 em Valorant
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-poppins mb-6 text-5xl leading-tight font-bold md:text-7xl">
            <span className="from-primary via-secondary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              Domine o Valorant
            </span>
            <br />
            <span className="text-foreground">com os Melhores</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Treinos práticos, aulas ao vivo e análises de partidas — do básico
            ao Imortal.
            <br />
            <span className="text-accent font-medium">
              Evolua seu gameplay com metodologia comprovada.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="btn-gradient group rounded-full px-8 py-4 text-lg font-semibold"
            >
              <Link href="/login">
                Entrar na Academia
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 rounded-full border-2 px-8 py-4 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Conteúdo
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-primary mb-2 text-3xl font-bold">500+</div>
              <div className="text-muted-foreground text-sm">Alunos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-secondary mb-2 text-3xl font-bold">95%</div>
              <div className="text-muted-foreground text-sm">
                Taxa de Evolução
              </div>
            </div>
            <div className="text-center">
              <div className="text-accent mb-2 text-3xl font-bold">1000+</div>
              <div className="text-muted-foreground text-sm">
                Horas de Conteúdo
              </div>
            </div>
            <div className="text-center">
              <div className="text-ciano mb-2 text-3xl font-bold">50+</div>
              <div className="text-muted-foreground text-sm">
                Radiant Coaches
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="border-primary/50 flex h-10 w-6 justify-center rounded-full border-2">
          <div className="bg-primary mt-2 h-3 w-1 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
