### ⚡ Performance Audit Report

#### 🔍 Identified Issues
- **Broad Re-renders on State Change**: The `Header` component manages the `isMenuOpen` state. Any change to this state triggers a full re-render of the `Header` and all its children, including the `Desktop Navigation` and `MenuNavigation`.
- **Unnecessary Hook Instances**: `useRouter` is called in both `Header.tsx` and `MenuNavigation.tsx` but is never used. While `useRouter` is generally stable, it adds unnecessary overhead and potential subscription points.
- **Missing Memoization**: `MenuNavigation` is re-rendered whenever the parent `Header` re-renders, even though its props don't change (it currently takes no props).
- **Navigation Inefficiency (UX/Performance)**: Several links in `Header.tsx` (e.g., Instrutores, MMR, Comunidade, Preços, Dashboard) use the standard `<a>` tag instead of Next.js `<Link>`. This results in full page reloads, which is significantly slower than client-side transitions and clears the client-side state.
- **Inline Component Definition**: The mobile menu content is defined inline within the `Header` component, making the main component larger and harder to optimize individually.

#### 🛠️ Suggested Optimizations
- **Memoize Children**: Wrap `MenuNavigation` in `React.memo` to prevent re-renders when the parent `Header` toggles the mobile menu.
- **Component Decomposition**: Extract `DesktopNav` and `MobileMenu` into separate memoized components. This ensures that the desktop navigation (which is mostly static) isn't re-processed when the mobile menu is toggled.
- **Refactor `<a>` to `<Link>`**: Replace all standard anchor tags with Next.js `<Link>` components to enable client-side navigation and prefetching.
- **Remove Unused Hooks**: Remove the unused `useRouter` calls from both components.
- **Optimize State Colocation**: If possible, move the mobile menu state into a separate scope, although for small components like a Header, memoization is often sufficient.
- **Surgical Auth usage**: Consider if the entire `Header` needs to know about `isAuthenticated` or if only the navigation components should consume that context. Currently, both the `Header` and `MenuNavigation` consume `useAuth`, leading to redundant context subscriptions.

#### 💻 Improved Code

See `optimized-code.tsx` for the full implementation of these suggestions.
