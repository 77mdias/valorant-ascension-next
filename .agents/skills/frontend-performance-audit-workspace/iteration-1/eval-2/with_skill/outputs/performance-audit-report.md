# ⚡ Performance Audit Report: Hero & CourseCard

## 🔍 Identified Issues

### 1. Missing `sizes` in `HeroBackground.tsx`
- **Issue**: The hero image in `HeroBackground.tsx` is using `next/image` with `priority` but is missing the `sizes` attribute.
- **Impact**: Without `sizes`, the browser assumes the image is `100vw` by default but might download a larger image than necessary or start the download later because it doesn't know the final dimensions until CSS is fully parsed. For a full-width background, explicit `100vw` is recommended to help the browser's preload scanner.

### 2. Inconsistent Image Handling in `CourseCard` Ecosystem
- **Issue**: `CourseCard.tsx` currently only supports icons, but its usage in `src/components/Courses.tsx` includes thumbnails from Unsplash without proper `sizes` and `priority`.
- **Impact**: Since `Courses.tsx` is used on the home page, the images in the course cards are important for visual weight but are currently not as optimized as they could be. Specifically, missing `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` means the browser might download a 400px image on a 1080p screen where it only needs a smaller version, or vice-versa.

### 3. Missing `priority` on `/cursos` Hero Image
- **Issue**: The hero image in `src/app/cursos/page.tsx` does not have the `priority` prop.
- **Impact**: This leads to a delayed Largest Contentful Paint (LCP) for the `/cursos` page, as the browser will not prioritize the image download during the initial load.

### 4. Bundle Management: Lucide-React Imports
- **Issue**: `CourseCard.tsx` imports multiple icons individually. While this is good for tree-shaking, it can still result in a larger initial bundle if many icons are used across many cards.
- **Impact**: Minimal impact, but as the app grows, consolidating these into a more efficient loading strategy (like SVGs or a custom icon sprite) could be beneficial.

## 🛠️ Suggested Optimizations

### 1. Optimize `HeroBackground.tsx`
- **Optimization**: Add `sizes="100vw"` to the `next/image` component to provide the browser with the necessary context for image selection.

### 2. Standardize `CourseCard.tsx` with Image Support
- **Optimization**: Extend `CourseCard.tsx` to include an optional `imageUrl` prop. Use `next/image` with `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` and `placeholder="blur"` (if using static imports) or a loading skeleton.
- **Benefit**: This allows removing the duplicated card logic in `src/components/Courses.tsx` and centralizing image optimization logic.

### 3. Fix LCP on `/cursos` Page
- **Optimization**: Add the `priority` prop to the hero `Image` in `src/app/cursos/page.tsx`.

### 4. Implement Dynamic Imports for Below-the-Fold Content
- **Optimization**: In `src/app/page.tsx`, use `next/dynamic` for `TestimonialCarousel`, `Instructors`, and `Benefits`.
- **Benefit**: Reduces the initial JavaScript bundle size, improving Time to Interactive (TTI).

## 💻 Improved Code Suggestions

### Optimized `src/components/Hero/HeroBackground.tsx`
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

### Optimized `src/components/CourseCard.tsx` (Adding Image Support)
```tsx
// ... imports
import Image from "next/image";

interface CourseCardProps {
  title: string;
  description: string | null;
  level: LessonLevel;
  icon?: keyof typeof icons | string;
  categorySlug: string;
  imageUrl?: string; // New optional prop
}

// ... logic

  return (
    <div className={`${styles.card} ...`}>
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
        </div>
      )}
      {/* Rest of the component */}
    </div>
  );
```
