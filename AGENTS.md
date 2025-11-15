# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router layout lives under `src/app`, where each folder exports `page.tsx`, `layout.tsx`, and API handlers. UI primitives stay in `src/components`, contexts in `src/providers`, and feature logic or integrations in `src/server`, `src/lib`, and `src/utils`. Contracts live in `src/schemas`/`src/types`, shared styles rely on Tailwind config plus `src/scss`, Prisma owns the storage model (`prisma/schema.prisma`, `prisma/migrations`, `prisma/seed.ts`), static files sit in `public/`, and supportive notes or tooling belong to `docs/` and `scripts/`.

## Build, Test, and Development Commands
Run `npm install` to bootstrap (it also runs `prisma generate`). `npm run dev` starts the local server on port 3000, `npm run build` emits the production bundle, and `npm run start` serves `.next/`. Use `npm run lint`, `npm run type-check`, and `npm run test` as the minimum verification set; `npm run test:ci` or `npm run test:coverage` guard pipelines. Prefer the scripted Prisma helpers (`npm run prisma:migrate`, `npm run prisma:prod:deploy`) whenever the schema changes.

## Coding Style & Naming Conventions
Code is TypeScript-first with 2-space indentation, semicolons, and modern ES modules. Components use PascalCase filenames, hooks and helpers use camelCase, and App Router directories stay kebab-case (`agents-loadout/page.tsx`). ESLint extends `next/core-web-vitals`; keep the tree warning-free before opening a PR. Prettier plus `prettier-plugin-tailwindcss` enforces formatting and class ordering, so reformat after larger refactors.

## Testing Guidelines
Jest (configured in `jest.config.js`) runs with `jest-environment-jsdom` and setup hooks from `jest.setup.js`. Place specs adjacent to the code as `*.test.ts[x]` or `__tests__/file.spec.tsx`, and mock Prisma/Stripe calls with lightweight factories. `npm run test:coverage` gathers reports for most files under `src/`; keep smoke coverage for new server actions, hooks, and dashboards, and respect the 10s default timeout for async flows.

## Commit & Pull Request Guidelines
History shows a light Conventional Commit style (`feat:`, `fix:`, `ci:`). Keep subject lines imperative, bundle related work, and mention scope when it clarifies intent (`feat(dashboard): add status cards`). Pull requests should describe the change, link the issue, outline schema or env updates, attach screenshots for UI tweaks, and flag migrations so reviewers can run `npm run prisma:migrate`.

## Security & Configuration Tips
Secrets stay in `.env` and are validated through `env.mjs` using `@t3-oss/env-nextjs`; never commit raw keys. Always confirm `DATABASE_URL` before executing migrations or seeds, especially when switching between Neon and local Postgres. Dashboard and admin routes require RBAC checks in both `middleware.ts` and the server actions—mirror the existing guards when adding new entry points.
