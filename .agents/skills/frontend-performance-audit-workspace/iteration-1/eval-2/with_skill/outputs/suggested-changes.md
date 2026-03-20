# 💻 Suggested Code Changes for Performance Optimization

## 1. `src/components/Hero/HeroBackground.tsx`
Added `sizes="100vw"` and `quality={85}` for better LCP and bandwidth efficiency.

```tsx
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface HeroBackgroundProps {
  image: string | StaticImageData;
  className?: string;
}

export const HeroBackground = ({ image, className }: HeroBackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <Image
        src={image}
        alt="Valorant Academy BR Training Facility"
        className="h-full w-full object-cover"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
};
```

## 2. `src/components/CourseCard.tsx` (Refactored for Image Support & Optimization)
Added `imageUrl` prop and implemented `next/image` with optimized `sizes`.

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import styles from "@/scss/components/CourseCard.module.scss";
import { LessonLevel } from "@prisma/client";
import { Target } from "lucide-react";
import { Brain, Flame, Users, Map, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Added next/image
import TruncatedText from "./TruncatedText";

interface CourseCardProps {
  title: string;
  description: string | null;
  level: LessonLevel;
  icon: keyof typeof icons | string;
  categorySlug: string;
  imageUrl?: string; // Added optional imageUrl prop
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
  imageUrl, // Destructure imageUrl
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

  const levelText = {
    INICIANTE: "Iniciante",
    INTERMEDIARIO: "Intermediário",
    AVANCADO: "Avançado",
    IMORTAL: "Imortal",
  };

  const IconComponent = icons[icon as keyof typeof icons] || Target;

  return (
    <div
      className={`${styles.card} ${styles.bgCard} ${styles.hoverCard} group overflow-hidden border border-border hover:scale-[1.02]`}
    >
      {/* Course Thumbnail with optimization */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 ${bgCardLevel[level]} opacity-5 transition-opacity duration-500 group-hover:opacity-10`}
      ></div>

      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4 p-6">
        {/* CONTEÚDO SUPERIOR */}
        <div className="flex flex-col gap-2">
          {/* Icon - only show if no imageUrl or as an overlay */}
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
```

## 3. LCP Fix for `src/app/cursos/page.tsx`
Added `priority` to the hero image.

```tsx
// src/app/cursos/page.tsx

<Image
  src={heroBg}
  alt="Hero Background"
  className="h-full w-full object-cover"
  priority // Added priority for faster LCP
  sizes="100vw" // Added sizes
/>
```
