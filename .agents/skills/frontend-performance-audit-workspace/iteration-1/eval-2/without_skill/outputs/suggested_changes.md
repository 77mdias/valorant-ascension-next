### Suggested Code Changes

#### 1. src/components/Hero/HeroBackground.tsx
Optimized background image with `fill`, `sizes`, and `placeholder`.

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
        fill // Use fill for background images
        className="object-cover"
        priority // Correctly used for LCP
        sizes="100vw" // Crucial for performance
        placeholder="blur" // For static imports, improves perceived speed
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
};
```

#### 2. src/components/CourseCard.tsx (Proposed Addition of Images)
Adding image support with proper optimization and layout.

```tsx
// Proposed modification to CourseCardProps and implementation
import Image from "next/image";

interface CourseCardProps {
  title: string;
  description: string | null;
  level: LessonLevel;
  icon: keyof typeof icons | string;
  categorySlug: string;
  imageUrl?: string; // Add optional image
}

// Inside the component...
<div className={styles.card}>
  {imageUrl && (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )}
  {/* Rest of the content */}
</div>
```

#### 3. src/components/Courses.tsx (Reference Correction)
Fixing the `sizes` attribute for existing image implementation.

```tsx
<div className="relative">
  <Image
    src={course.thumbnail}
    alt={course.title}
    width={400}
    height={192}
    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add this
  />
```
