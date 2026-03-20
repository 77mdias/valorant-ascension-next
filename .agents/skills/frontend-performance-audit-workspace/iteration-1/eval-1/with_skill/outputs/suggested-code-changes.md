### 💻 Suggested Code Changes

#### 1. Optimization in `src/app/cursos/page.tsx`
Added dynamic loading for below-the-fold components and `priority` to the hero image.

```tsx
import dynamic from "next/dynamic";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy loading below-the-fold heavy components
const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  ssr: true,
});
const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel"), {
  ssr: true,
});
const ProjectInfoCompact = dynamic(() => import("@/components/ProjectInfoCompact"), {
  ssr: true,
});

// Inside return (Hero Section)
<Image
  src={heroBg}
  alt="Hero Background"
  className="h-full w-full object-cover"
  priority // Add priority for LCP
/>

// Wrap the list in a single TooltipProvider
<TooltipProvider>
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {lessons.map((lesson) => (
      <CourseCard
        key={lesson.id}
        // ... props
      />
    ))}
  </div>
</TooltipProvider>
```

#### 2. Optimization in `src/components/CourseCard.tsx`
Moved constants outside, removed unused hook, and added `React.memo`.

```tsx
import React, { memo } from "react";
// ... other imports

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

const CourseCard = memo(({
  title,
  description,
  level,
  icon,
  categorySlug,
}: CourseCardProps) => {
  // Logic here (without unused useRouter)
  const IconComponent = icons[icon as keyof typeof icons] || Target;

  return (
    // Component content
  );
});

export default CourseCard;
```

#### 3. Optimization in `src/components/TruncatedText.tsx`
Removed internal `TooltipProvider` and redundant `useEffect`.

```tsx
const TruncatedText = ({
  text,
  maxLength,
  className = "",
}: TruncatedTextProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isTruncated = text.length > maxLength;
  const truncatedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <Tooltip open={showTooltip && isTruncated} onOpenChange={setShowTooltip}>
      <TooltipTrigger asChild>
        <p
          className={`cursor-default ${className}`}
          onMouseEnter={() => isTruncated && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {truncatedText}
        </p>
      </TooltipTrigger>
      {/* ... TooltipContent */}
    </Tooltip>
  );
};
```
