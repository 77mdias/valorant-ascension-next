# Dashboard Feature: Architectural Proposal

Based on the existing structure of the `valorant-ascension-next` project (Next.js App Router, Radix UI, Recharts, and SCSS/Tailwind), I recommend the following organization for the Dashboard feature.

## 1. Folder & Component Organization

### Dashboard Components (`src/components/dashboard`)
Organize dashboard-specific components into sub-folders for better maintainability:

```text
src/components/dashboard/
├── layout/
│   ├── Sidebar.tsx           # Main navigation sidebar
│   ├── SidebarItem.tsx       # Individual nav link component
│   └── DashboardHeader.tsx   # Top header with search and user actions
├── charts/
│   ├── ChartContainer.tsx    # Wrapper for consistent styling, loading states, and error handling
│   ├── StatsLineChart.tsx    # Implementation using Recharts
│   ├── UsageBarChart.tsx     # Implementation using Recharts
│   └── index.ts              # Central export for all charts
├── settings/
│   ├── UserSettingsModal.tsx # The modal container (using @radix-ui/react-dialog)
│   └── ProfileForm.tsx       # Form logic inside the settings modal
└── index.ts                  # Main dashboard-specific exports
```

### Dashboard Pages & Layout (`src/app/dashboard`)
Utilize the App Router's layout system to keep the sidebar and header persistent:

```text
src/app/dashboard/
├── layout.tsx                # Integrates Sidebar and DashboardHeader; manages auth checks
├── page.tsx                  # Main dashboard overview using Chart components
├── settings/
│   └── page.tsx              # Optional: Dedicated settings page (or handles modal state via URL)
└── scss/
    └── Dashboard.module.scss # Dashboard-specific styling (already exists)
```

## 2. Shared UI Components (`src/components/ui`)
Leverage and extend existing Radix UI-based components:
- **Modal**: Reuse `src/components/ui/modal.tsx` or `dialog.tsx` for the User Settings.
- **Card**: Use `src/components/ui/card.tsx` for chart containers and stat widgets.
- **Button/Input**: Use existing atomic components for forms.

## 3. Supporting Logic (`src/hooks` & `src/types`)
Separate data-fetching and business logic from UI components:

```text
src/hooks/
├── use-dashboard-stats.ts    # Custom hook for fetching chart data (SWR/React Query)
└── use-user-settings.ts      # Logic for handling user profile updates

src/types/
└── dashboard.d.ts            # Interfaces for Chart data, Sidebar navigation, and Dashboard state
```

## 4. Key Implementation Details
1. **Sidebar State**: For mobile responsiveness, move the sidebar state (open/closed) to a client component wrapper or a state management hook.
2. **Chart Abstraction**: `ChartContainer.tsx` should handle the common layout (title, description, tooltips) while specific chart components handle the Recharts-specific configuration.
3. **Settings Modal**: Use a URL query parameter (e.g., `?settings=true`) to trigger the User Settings Modal, allowing for shareable links and better deep-linking.
