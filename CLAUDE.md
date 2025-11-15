# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Valorant Ascension is a full-stack training platform for Valorant players with subscription-based access to courses. Built with Next.js (App Router), TypeScript, Prisma, and Stripe integration.

**Key Features:**
- Authentication with NextAuth.js (Credentials + OAuth Google)
- Role-based access control (RBAC): ADMIN, CUSTOMER, PROFESSIONAL
- Stripe subscription management with webhook + polling fallback
- Course/lesson catalog with progress tracking
- Admin dashboard for CRUD operations
- Responsive design optimized for mobile

## Development Commands

### Using Makefile (Recommended)

The project includes a comprehensive Makefile for easy command execution:

```bash
# Quick reference
make help                   # Show all available commands
make setup                  # Initial project setup
make dev                    # Start dev server
make ci                     # Simulate full CI pipeline locally

# Common workflows
make pre-commit             # Run before committing (quality + tests)
make pre-push               # Run before pushing (full CI)
make quality                # All quality checks (lint, type-check, format)
make security               # All security checks (audit, secrets scan)

# Aliases for speed
make d                      # = make dev
make t                      # = make test
make b                      # = make build
make ci                     # = Full CI simulation
```

**See:** `MAKEFILE_GUIDE.md` for complete Makefile reference

### Using pnpm Directly

```bash
# Development
pnpm dev                    # Start dev server at localhost:3000
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Prisma - Development Database
pnpm prisma:validate        # Validate schema
pnpm prisma:generate        # Generate Prisma client
pnpm prisma:studio          # Open Prisma Studio GUI
pnpm prisma:push            # Push schema changes (dev only)
pnpm prisma:migrate         # Create and apply migration
pnpm prisma:status          # Check migration status

# Prisma - Production Database
pnpm prisma:prod:validate   # Validate prod schema
pnpm prisma:prod:generate   # Generate client for prod
pnpm prisma:prod:studio     # Open Studio for prod DB
pnpm prisma:prod:deploy     # Deploy migrations to prod
pnpm prisma:prod:status     # Check prod migration status
pnpm prisma:prod:introspect # Introspect prod database

# Database Seeding
pnpm prisma db seed         # Run seed (prisma/seed.ts)

# Testing
pnpm test                   # Run tests with Jest
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Run tests with coverage report
pnpm test:ci                # Run tests in CI mode
pnpm type-check             # TypeScript type checking
```

**Note:** The project uses separate Prisma scripts (`./scripts/prisma-dev.sh` and `./scripts/prisma-prod.sh`) to manage development and production databases independently via `DATABASE_URL` and `DATABASE_URL_PROD` environment variables.

## CI/CD Pipeline

The project has a comprehensive CI/CD pipeline with automated quality checks and security scanning:

**Workflows:**
- **CI (Quality Checks)** - Runs on PRs and pushes to main/dev
  - Linting, type-checking, Prisma validation
  - Build testing
  - Unit tests (Jest)
  - Dependency validation
  - Commit message validation (Conventional Commits)

- **Security Checks** - Runs on PRs, pushes, and weekly schedule
  - npm audit (dependency vulnerabilities)
  - TruffleHog secrets scanning
  - Dependency review for PRs
  - OSV vulnerability scanner
  - Environment variables validation

- **CodeQL (SAST)** - Runs on PRs, pushes, and weekly schedule
  - Static application security testing
  - Security vulnerability detection
  - Next.js-specific security patterns
  - SARIF reports in GitHub Security tab

- **Dependabot** - Automated dependency updates
  - Weekly npm package updates
  - Monthly GitHub Actions updates
  - Grouped updates (Next.js, Radix UI, Prisma, Stripe, etc.)
  - Automatic security patches

**Deploy:** Vercel automatically handles deployments
- Preview deploys for every PR
- Production deploys on merge to main
- Development deploys on push to dev branch

**See:** `.github/CI_CD_GUIDE.md` for complete CI/CD documentation

## Architecture

### Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── create-checkout-session/  # Stripe checkout
│   │   ├── subscription/     # Subscription management
│   │   ├── webhooks/         # Stripe webhooks (Node.js runtime)
│   │   ├── check-session/    # Polling fallback for subscription sync
│   │   └── auth/             # NextAuth API routes
│   ├── auth/                 # Auth pages (signin, signup, verify, reset)
│   ├── dashboard/            # Admin dashboard (RBAC protected)
│   │   ├── users/
│   │   ├── lessons/
│   │   └── categories/
│   ├── cursos/               # Course catalog
│   ├── match/                # Match tracking (HenrikDev API integration)
│   └── community/            # Community pages
├── components/               # Global reusable components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Infrastructure & clients
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # Prisma client
│   ├── stripe.ts             # Stripe client
│   ├── email.ts              # Email service
│   ├── cache.ts              # Cache utilities
│   └── henrikdev-api.ts      # Valorant API integration
├── server/                   # Server actions
│   ├── userActions.ts
│   ├── lessonsActions.ts
│   └── lessonCategoryActions.ts
├── schemas/                  # Zod validation schemas
│   ├── userSchemas.ts
│   ├── lessons.ts
│   └── lessonCategory.ts
├── hooks/                    # React hooks
├── scss/                     # Global SCSS modules
└── types/                    # Global TypeScript types
```

### Tech Stack

- **Framework:** Next.js 15.5+ (App Router, Server Components, Server Actions)
- **Language:** TypeScript 5.9+ (strict mode enabled)
- **Database:** PostgreSQL (Neon) via Prisma ORM 6.16+
- **Auth:** NextAuth.js v4 with PrismaAdapter
  - Providers: Credentials, Google OAuth, GitHub OAuth
  - Session strategy: JWT (30-day expiry)
- **Payments:** Stripe (checkout, subscriptions, webhooks)
- **Styling:** Tailwind CSS + SCSS Modules for complex components
- **UI Components:** shadcn/ui + Radix UI primitives
- **Forms:** react-hook-form + zod validation
- **State:** Server Components first, React hooks for client state
- **Email:** Nodemailer
- **External APIs:** HenrikDev Valorant API

### Path Aliases

```typescript
@/*  →  ./src/*
```

Example: `import { db } from "@/lib/prisma"`

## Authentication & Authorization

### Authentication Flow

1. **Credentials Login:** Email/password → validate against `user.password` → check `isActive` flag → create JWT session
2. **Google OAuth:** OAuth consent → callback → PrismaAdapter auto-creates `user` + `account` → event sets `role=CUSTOMER` and `isActive=true` → JWT session
3. **Session:** JWT strategy (30-day max age, updates every 24h)

**Important Files:**
- `src/lib/auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection based on roles
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  CUSTOMER     // Default role for OAuth/signup
  PROFESSIONAL // Instructor role (can create lessons)
  ADMIN        // Full access to dashboard
}
```

**Protection Layers:**
1. **Middleware** (`middleware.ts`): Blocks unauthenticated/unauthorized access to `/dashboard/*`, `/admin/*`
2. **Page/Layout:** Server-side session checks via `getServerSession(authOptions)`
3. **Server Actions:** Validate role before mutations
4. **UI/Hooks:** Conditional rendering based on `session.user.role`

**Dashboard Access:** Only `ADMIN` role can access `/dashboard/*` routes

## Stripe Integration

### Subscription Flow

1. **Checkout:** `/api/create-checkout-session` creates Stripe session with `priceId`
2. **Webhook:** `/api/webhooks` receives events (`checkout.session.completed`, `customer.subscription.*`)
   - **Runtime:** Node.js (required for raw body parsing)
   - Uses `constructEventAsync` for signature verification
3. **Polling Fallback:** `/api/check-session` manually syncs subscription if webhook fails
4. **Subscription Changes:** `/api/subscription/change-plan` for upgrades/downgrades
5. **Cancellation:** `/api/subscription/cancel` sets `cancel_at_period_end=true`

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET_KEY=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (use price_... not prod_...)
NEXT_PUBLIC_STRIPE_PRICE_BASICO=price_...
NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO=price_...
NEXT_PUBLIC_STRIPE_PRICE_AVANCADO=price_...
```

**Data Model:**
```prisma
model subscription {
  stripeSubscriptionId  String   @unique
  stripePriceId         String
  status                String   // active, canceled, etc.
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean  @default(false)
  user                  user     @relation(...)
}
```

## Database

### Prisma Schema Key Models

```prisma
// Authentication
model user {
  email                    String   @unique
  password                 String?  // null for OAuth users
  role                     UserRole @default(CUSTOMER)
  isActive                 Boolean  @default(true)
  emailVerified            DateTime?
  accounts                 account[]  // OAuth accounts
  subscriptions            subscription[]
  lessons                  lessons[]  // created lessons
}

model account {
  provider          String  // google, github
  providerAccountId String
  refresh_token     String?
  access_token      String?
}

// Content
model lessonCategory {
  id          String    @id @default(uuid())
  name        String
  description String?
  lessons     lessons[]
}

model lessons {
  id           String          @id @default(uuid())
  title        String
  description  String
  videoUrl     String?
  duration     Int?
  categoryId   String
  authorId     String
  category     lessonCategory  @relation(...)
  author       user            @relation(...)
}
```

**Seeding:** `prisma/seed.ts` creates admin user, categories, and 20 sample lessons

### Database Scripts Behavior

- **Development scripts** (`pnpm prisma:*`) use `DATABASE_URL`
- **Production scripts** (`pnpm prisma:prod:*`) use `DATABASE_URL_PROD`
- Scripts located in `./scripts/` directory manage environment switching

## Code Style & Best Practices

### Component Organization

**Rule:** If a component is **only used by one page**, place it in `src/app/<route>/components/`. Otherwise, use `src/components/`.

**Example:**
```
src/app/dashboard/lessons/
  ├── components/
  │   └── LessonTable.tsx     # Dashboard-specific
  └── page.tsx

src/components/
  └── LessonCard.tsx          # Reusable across app
```

### Styling Approach

- **Tailwind CSS** for layouts, spacing, typography, responsive design
- **SCSS Modules** for complex/structured styles specific to components/pages
  - Named as `Component.module.scss`
  - Use `@use` and `@forward` for shared tokens
  - Place global SCSS in `src/scss/`, page-specific in `src/app/<route>/scss/`

### Server Actions Pattern

```typescript
// src/server/lessonsActions.ts
"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Zod schema for validation
const CreateLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  categoryId: z.string().uuid(),
  videoUrl: z.string().url().optional(),
});

export async function createLesson(data: z.infer<typeof CreateLessonSchema>) {
  // 1. Validate session + role
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "PROFESSIONAL"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  // 2. Validate input
  const validated = CreateLessonSchema.parse(data);

  // 3. Database operation
  const lesson = await db.lessons.create({
    data: {
      ...validated,
      authorId: session.user.id,
    },
  });

  // 4. Revalidate cache
  revalidatePath("/dashboard/lessons");
  revalidatePath("/cursos");

  return lesson;
}
```

### Form Validation Pattern

```typescript
// src/schemas/lessons.ts
import { z } from "zod";

export const lessonSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(10, "Description too short"),
  categoryId: z.string().uuid("Invalid category"),
  videoUrl: z.string().url("Invalid URL").optional(),
  duration: z.number().int().positive().optional(),
});

export type LessonInput = z.infer<typeof lessonSchema>;
```

Use with `react-hook-form`:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, type LessonInput } from "@/schemas/lessons";

const form = useForm<LessonInput>({
  resolver: zodResolver(lessonSchema),
});
```

## Project-Specific Context

### Vibe Coding Principles (from Cursor rules)

This project follows a **"vibe coding"** approach - prioritizing rapid LLM-assisted development while maintaining:
- Clean architecture with clear separation of concerns
- Component reusability (avoid copy-paste)
- Strong typing and validation at boundaries
- Comprehensive documentation

### Communication Style

- **Coach mode:** Explain trade-offs and decisions, not just code
- **Study notes:** After significant features, document in `/docs/notes/YYYY-MM-DD-<topic>.md`
  - Format: Problem → Solution → Patterns → Key terms → Next steps

### Debug Protocol (from Cursor rules)

When troubleshooting:
1. **Hypotheses:** List 5-7 possible causes, narrow to 1-2 most probable
2. **Instrumentation:** Add targeted logs (remove after with permission)
   - Check browser console, network tab, server logs, Stripe dashboard
3. **Analysis:** Trace data flow, check environment variables, verify external service status
4. **Fix & Confirm:** Apply minimal fix, test, document in study notes

## Common Development Tasks

### Adding a New CRUD Feature

1. **Schema:** Define Zod schema in `src/schemas/<feature>.ts`
2. **Server Action:** Create action in `src/server/<feature>Actions.ts` with role validation
3. **API Route (optional):** If external access needed, create in `src/app/api/<feature>/`
4. **Dashboard Page:** Add to `src/app/dashboard/<feature>/page.tsx` (protected by middleware)
5. **Form Component:** Create reusable form in `src/components/forms/<Feature>Form.tsx`
6. **Validation:** Validate on both client (form) and server (action/API)

### Managing Stripe Price IDs

- Always use `price_...` IDs (not `prod_...`)
- Store in environment variables with `NEXT_PUBLIC_STRIPE_PRICE_<PLAN>` naming
- Update in Stripe dashboard first, then sync to `.env`

### Handling OAuth Providers

- Configuration in `src/lib/auth.ts` → `authOptions.providers`
- Event handlers (e.g., `createUser`) set default `role` and `isActive`
- PrismaAdapter automatically manages `account` and `session` tables
- OAuth users have `password=null` in database

### Working with External APIs

- **HenrikDev Valorant API:** Client in `src/lib/henrikdev-api.ts`
- Store API keys in `.env` (never commit)
- Implement retry logic and error handling in client wrappers

## Important Files

- `middleware.ts` - Route protection, auth redirects
- `src/lib/auth.ts` - NextAuth configuration with providers
- `src/lib/prisma.ts` - Prisma client singleton
- `src/lib/stripe.ts` - Stripe client configuration
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Database seeding script
- `package.json` - All available npm scripts
- `.cursor/rules/cursor_project_rules_vibe_coding_jean.md` - Detailed development guidelines

## Testing & Deployment

- **Build:** `pnpm build` verifies TypeScript, runs ESLint
- **Migrations:** Run `pnpm prisma:prod:deploy` in production before deploying app
- **Environment:** Ensure all `.env` variables are set in deployment platform (Vercel)
- **Webhooks:** Configure Stripe webhook endpoint to point to `https://yourdomain.com/api/webhooks`

## Documentation

- **Main README:** Comprehensive project documentation with setup, features, architecture
- **OAuth Guide:** `/docs/oauth-google-complete.md`, `/docs/oauth-google-status.md`
- **CRUD Guide:** `/docs/crud-guide.md`, `/docs/crud-roles-complete-guide.md`
- **Study Notes:** `/docs/notes/` - Session-based learning documentation
