"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import styles from "@/scss/components/CourseCard.module.scss";
import { LessonLevel } from "@prisma/client";
import { Icon, Target } from "lucide-react";
import { Brain, Flame, Users, Map, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TruncatedText from "./TruncatedText";

interface CourseCardProps {
  title: string;
  description: string | null;
  level: LessonLevel;
  icon: keyof typeof icons | string;
  categorySlug: string;
}

export const icons = {
  target: Target,
  brain: Brain,
  flame: Flame,
  users: Users,
  map: Map,
  shield: Shield,
  zap: Zap,
};

const CourseCard = ({
  title,
  description,
  level,
  icon,
  categorySlug,
}: CourseCardProps) => {
  const levelColors = {
    INICIANTE: `bg-cyan-400 text-white`,
    INTERMEDIARIO: `bg-purple-500 text-white`,
    AVANCADO: `bg-orange-400 text-white`,
    IMORTAL: `${styles.bgGradientPrimary} text-white`,
  };

  const bgCardLevel = {
    INICIANTE: `${styles.bgGradientPrimary}`,
    INTERMEDIARIO: `${styles.bgGradientSecondary}`,
    AVANCADO: `${styles.bgGradientAccent}`,
    IMORTAL: `${styles.bgGradientPrimary}`,
  };

  //TODO: TRANSLATE PARA PASCALCASE
  const levelText = {
    INICIANTE: "Iniciante",
    INTERMEDIARIO: "Intermediário",
    AVANCADO: "Avançado",
    IMORTAL: "Imortal",
  };

  const IconComponent = icons[icon as keyof typeof icons] || Target;

  const router = useRouter();

  return (
    <div
      className={`${styles.card} ${styles.bgCard} ${styles.hoverCard} border border-border hover:scale-[1.02]`}
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 ${bgCardLevel[level]} opacity-5 transition-opacity duration-500 group-hover:opacity-10`}
      ></div>

      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4 p-6">
        {/* CONTEÚDO SUPERIOR */}
        <div className="flex flex-col gap-2">
          {/* Icon */}
          <div
            className={`${styles.bgGradientPrimary} ${styles.shadowNeon} flex h-12 w-12 items-center justify-center rounded-lg p-2.5`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {/* Title and Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {title}
              </h3>
              <Badge className={`${levelColors[level]} text-xs font-semibold`}>
                {levelText[level]}
              </Badge>
            </div>
          </div>
        </div>

        {/* CONTEÚDO CENTRAL */}
        <TruncatedText
          text={description || "Não há descrição para este curso"}
          maxLength={120}
          className="text-sm leading-relaxed text-muted-foreground"
        />

        {/* CONTEÚDO INFERIOR BOTÃO SAIBA MAIS*/}
        <Link href={`/cursos/${categorySlug}`}>
          <Button
            variant="ghost"
            className="group/btn w-full transition-all duration-300 hover:bg-primary/10 hover:text-primary"
          >
            <span>Saiba Mais</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="bg-gradient-radial absolute inset-0"></div>
      </div>
    </div>
  );
};

export default CourseCard;
