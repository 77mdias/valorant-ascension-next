### ⚡ Performance Audit Report

#### 🔍 Identified Issues
- **Unnecessary Re-renders in `CourseCard`**: Mapping objects (`levelColors`, `bgCardLevel`, `levelText`) are recreated on every render, and the component is not memoized despite being used in a list.
- **Redundant `TooltipProvider` instances**: Each `CourseCard` via `TruncatedText` renders its own `TooltipProvider`. This adds overhead and can cause context issues.
- **Below-the-fold heavy components**: `StatsSection`, `TestimonialCarousel`, and `ProjectInfoCompact` are client-side components with animations or state that are loaded during the initial page paint even though they are not visible.
- **Missing Image Optimization**: The Hero background image lacks the `priority` property, which can delay the Largest Contentful Paint (LCP).
- **Unused Hook**: `useRouter` is imported and initialized in `CourseCard` but never used.

#### 🛠️ Suggested Optimizations
- **Lazy Loading**: Use `next/dynamic` to load `StatsSection`, `TestimonialCarousel`, and `ProjectInfoCompact` only when needed (or at least split them from the main bundle).
- **Component Memoization**: Wrap `CourseCard` in `React.memo` and move static mapping objects outside the component.
- **Refactor `TruncatedText`**: Remove the internal `TooltipProvider` and move it to a higher-level component (like `layout.tsx` or `page.tsx`).
- **Simplify Logic**: Replace `useEffect` in `TruncatedText` with a simple constant for truncation check.
- **LCP Improvement**: Add `priority` to the hero background image.
