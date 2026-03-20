// src/app/cursos/page.tsx (Suggested changes)

import dynamic from "next/dynamic";
// ... other imports

// Lazy load below the fold components
const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  ssr: false, // Optional: if hydration is problematic or it uses browser-only APIs
  loading: () => <div className="h-40 bg-muted animate-pulse rounded-lg m-8" />
});

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel"), {
  loading: () => <div className="h-60 bg-muted animate-pulse rounded-lg m-8" />
});

const ProjectInfoCompact = dynamic(() => import("@/components/ProjectInfoCompact"), {
  loading: () => <div className="h-40 bg-muted animate-pulse rounded-lg m-8" />
});

// Use them in the component as usual.

--------------------------------------------------------------------------------

// src/components/CourseCard.tsx (Suggested changes)

import React from "react";
// ... imports

// Move constants outside the component to avoid recreation on every render
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

// ... icons definition

const CourseCard = ({
  title,
  description,
  level,
  icon,
  categorySlug,
}: CourseCardProps) => {
  // Remove unused useRouter
  // const router = useRouter(); 

  // ... rest of the code
};

// Use React.memo to prevent unnecessary re-renders in lists
export default React.memo(CourseCard);
