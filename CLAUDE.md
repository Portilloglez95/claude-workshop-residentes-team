# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Condoo — frontend panel for condominium administration. This is the base
scaffold: React 19 + Vite + TypeScript, Tailwind CSS v4 + shadcn/ui, React
Router, TanStack Query, Zustand, React Hook Form + Zod.

## Commands

```bash
pnpm install          # install deps
pnpm dev              # dev server (Vite)
pnpm build            # typecheck (tsc -b) + production build
pnpm preview          # serve the production build locally
pnpm lint             # oxlint
pnpm typecheck        # tsc -b only, no build
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
```

There is no test runner configured yet. Requires Node (version pinned in
`.tool-versions`, use `asdf install`) and pnpm (version pinned in
`package.json` → `packageManager`).

Adding a shadcn/ui component:

```bash
pnpm dlx shadcn@latest add <component>
```

Note: in this registry, `shadcn add form` produces no files. Build forms
with `react-hook-form` + `zod` directly against `Input`/`Label` — see
`src/features/auth/pages/LoginPage.tsx` for the pattern.

## Architecture

The codebase is organized **by feature (business domain)**, not by file
type, specifically so multiple people can work in parallel with minimal
merge conflicts.

```
src/
  app/                 # bootstrap: providers, router, root App component
  pages/               # pages that don't belong to any feature (Dashboard, 404)
  features/<domain>/   # one folder per business domain
    api/                 # calls to that feature's backend endpoints
    components/          # components local to the feature
    hooks/                # hooks local to the feature (e.g. TanStack Query hooks)
    pages/                # route components for the feature
    types/                # TS types for the feature
  shared/              # everything used by more than one feature
    components/          # layout (Sidebar/Header/AppLayout), theme-toggle, etc.
    lib/                  # api-client.ts, query-client.ts
  components/ui/        # shadcn/ui components (generated — see components.json)
```

Placement rule: domain-specific code goes in `src/features/<domain>/`;
anything shared across features goes in `src/shared/`; changes to the
router, global providers, or app shell go in `src/app/` and are the highest
merge-conflict-risk files — coordinate before editing.

`src/features/residentes/` is a fully wired reference feature (mock API →
TanStack Query hook → table page with a status badge). New features should
follow that same api/hooks/pages/types split. `pagos`, `reservas`, `avisos`
currently only have a placeholder page (`PlaceholderPage` from
`src/shared/components/placeholder-page.tsx`); `auth` has the login page.

Routing lives in `src/app/router.tsx` (`createBrowserRouter`); nav entries
for the sidebar live in `src/shared/components/layout/nav-items.ts` — add a
line there when a new feature needs a menu entry. Global providers
(`QueryClientProvider`, `next-themes` `ThemeProvider`, sonner `Toaster`) are
composed once in `src/app/providers.tsx`.

Import alias `@/` maps to `src/` (configured in `tsconfig.app.json` /
`tsconfig.json` and mirrored in `vite.config.ts`).

`src/shared/lib/api-client.ts` is a thin fetch wrapper reading
`VITE_API_URL` (see `.env.example`); feature `api/` modules are expected to
call through it once a real backend exists (currently `residentes.api.ts`
uses in-memory mock data as a stand-in).

`tsconfig.app.json` has `erasableSyntaxOnly` enabled — do not use
TypeScript constructs that require actual JS emission (parameter
properties, enums, etc.), since the config assumes types are fully
erasable.

## Tooling notes

- Linting is oxlint (`.oxlintrc.json`), not ESLint.
- Husky's `pre-commit` hook runs `lint-staged` (oxlint --fix + prettier on
  staged `.ts/.tsx`, prettier on staged `.css/.md/.json`).
- Tailwind v4 is wired via the `@tailwindcss/vite` plugin (no
  `tailwind.config.js`); theme tokens and the `dark` variant live in
  `src/index.css`.
