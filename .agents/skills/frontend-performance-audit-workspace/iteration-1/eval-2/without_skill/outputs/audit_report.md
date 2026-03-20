# Image Performance Audit Report

## 1. Hero.tsx (via HeroBackground.tsx)

### Current Implementation:
- Uses `next/image` component.
- Static import for the background image (`hero-valorant.jpg`).
- `priority` prop is correctly used for LCP (Largest Contentful Paint).
- `object-cover` and `h-full w-full` for responsive behavior.

### Critical Observations:
- **Missing `sizes` attribute**: Browser cannot pre-determine the correct image resolution to download before layout calculation.
- **Using `h-full w-full` instead of `fill`**: For a background image, `fill` is more idiomatic in Next.js and handles parent container constraints better when combined with `object-fit`.
- **Image Import**: Static imports are excellent for Next.js optimization (automatic width/height/format/blur placeholder).

### Recommended Optimizations:
1.  **Add `sizes="100vw"`**: This tells the browser the image will occupy the full width, allowing it to pick the most efficient source from the generated srcset.
2.  **Use `fill` prop**: Simplifies the layout and ensures the image always fills the `HeroBackground` container.
3.  **Add `placeholder="blur"`**: For static imports, Next.js can generate a blur placeholder automatically, improving perceived performance.

---

## 2. CourseCard.tsx

### Current Implementation:
- **No images used**: Currently relies exclusively on `lucide-react` icons.
- This is an optimization in itself for bundle size and LCP, but lacks visual impact compared to a thumbnail-based UI (like the one seen in `Courses.tsx`).

### Observations from `Courses.tsx` (Reference):
- `Courses.tsx` uses `next/image` for course thumbnails.
- It uses external Unsplash URLs without proper `sizes`, which defaults to downloading larger images than necessary on most screens.

### Recommended Optimizations (If adding images):
1.  **Introduce `Image` with `fill`**: Use a container with a fixed aspect ratio (e.g., `aspect-video`) and `next/image` with `fill` and `object-cover`.
2.  **Strict `sizes` attribute**: For a grid of cards (1 col mobile, 2 cols tablet, 3 cols desktop), use:
    `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
3.  **Loading strategy**: For cards below the fold, use `loading="lazy"` (default in `next/image`).

---

## 3. Bundle Management & Overall Strategy

- **Static Assets**: Backgrounds and logos should remain as static imports to benefit from build-time optimizations.
- **Dynamic Assets**: Course thumbnails (from DB/external) should be served via a CDN that supports optimization.
- **Icon Strategy**: `lucide-react` is good for small UI elements. For character/agent images (like those in `public/agents/`), `next/image` is mandatory to avoid serving high-res PNGs to mobile users.
