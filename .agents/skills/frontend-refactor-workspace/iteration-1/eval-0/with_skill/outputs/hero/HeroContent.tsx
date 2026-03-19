import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface HeroContentProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  className?: string;
}

export const HeroContent = ({ title, subtitle, className }: HeroContentProps) => {
  return (
    <div className={cn("mx-auto max-w-4xl text-center", className)}>
      <h1 className="mb-6 font-poppins text-5xl font-bold leading-tight md:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
        {subtitle}
      </p>

      <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="lg"
          asChild
          className="btn-gradient group rounded-full px-8 py-4 text-lg font-semibold"
        >
          <Link href="/login">
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
    </div>
  );
};
