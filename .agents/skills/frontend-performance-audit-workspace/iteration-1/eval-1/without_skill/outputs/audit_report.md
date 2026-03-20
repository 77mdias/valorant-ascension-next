# Performance Audit Report: Main Courses Page (src/app/cursos/page.tsx)

## Summary
The main courses page is a Server Component, which is good for initial loading and SEO. However, it renders several heavy Client Components below the fold that can be lazy-loaded to improve the initial bundle size and First Contentful Paint (FCP).

## 1. Heavy Components & Lazy Loading Candidates

### StatsSection (src/components/StatsSection.tsx)
- **Status:** Client Component, below the fold.
- **Why:** Contains Lucide icons and an animation triggered on mount.
- **Impact:** Adds to the initial bundle size and hydration cost.
- **Recommendation:** Lazy load with `next/dynamic`.

### TestimonialCarousel (src/components/TestimonialCarousel.tsx)
- **Status:** Client Component, below the fold.
- **Why:** Contains carousel logic, testimonials, and multiple avatars.
- **Impact:** High hydration cost and larger bundle size due to carousel logic.
- **Recommendation:** Lazy load with `next/dynamic`.

### ProjectInfoCompact (src/components/ProjectInfoCompact.tsx)
- **Status:** Client Component, at the bottom of the page.
- **Why:** Contains many Lucide icons and technical details that aren't critical for initial rendering.
- **Impact:** Increases the bundle size unnecessarily for the first paint.
- **Recommendation:** Lazy load with `next/dynamic`.

## 2. Unnecessary Re-renders & Component Optimization

### CourseCard (src/components/CourseCard.tsx)
- **Status:** Client Component, used in a list.
- **Findings:**
    - Objects for styling (`levelColors`, `bgCardLevel`, `levelText`) are redefined on every render.
    - `useRouter` is imported and initialized but never used (the component uses `Link`).
- **Impact:** Small memory overhead per card and potential for unnecessary re-renders if the parent was a Client Component.
- **Recommendation:** 
    - Move styling objects outside the component to avoid recreation.
    - Remove unused `useRouter`.
    - Wrap the component in `React.memo` for future-proofing (e.g., if filtering/sorting is added to the list).

### TruncatedText (src/components/TruncatedText.tsx)
- **Status:** Client Component, inside every CourseCard.
- **Findings:** Uses Radix UI Tooltip for every card.
- **Impact:** Each tooltip adds DOM nodes and event listeners. If there are many courses (e.g., 20+), this can impact hydration performance and memory.
- **Recommendation:** Consider using CSS `line-clamp` for simple truncation. If the tooltip is essential, consider lazy-loading it or only showing it on interaction.

## 3. Image Optimization
- **Findings:** Hero background uses `next/image` correctly.
- **TestimonialCarousel:** Avatar images have empty `src` attributes in the code reviewed, which might lead to broken image requests if not handled properly by shadcn/ui.

## Suggested Code Changes
1. **src/app/cursos/page.tsx:** Implement `next/dynamic` for below-the-fold components.
2. **src/components/CourseCard.tsx:** Move static objects outside, remove unused hook, and wrap in `React.memo`.
