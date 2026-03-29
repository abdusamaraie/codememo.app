# codememo-app - Project Context

This document defines the folder structure, development conventions, and scalability patterns for **codememo-app**: a monorepo-based application ecosystem built with **Turborepo**, supporting multiple web apps and a mobile app from a single codebase.

> **How to use this file:** Replace all `{{PLACEHOLDER}}` values with your project-specific details before starting development. Remove sections that don't apply yet — they can be re-added as the project grows.

---

## Table of Contents

1. [Quick Commands](#quick-commands)
2. [App Registry](#app-registry)
3. [Project Structure](#project-structure)
4. [App Definitions](#app-definitions)
5. [Shared Packages](#shared-packages)
6. [Mobile App Conventions](#mobile-app-conventions)
7. [Web App Conventions](#web-app-conventions)
8. [Key Patterns](#key-patterns)
9. [Domain Types](#domain-types)
10. [Important Files](#important-files)
11. [Development Notes](#development-notes)

---

## Quick Commands

```bash
# Root — all apps
npm run dev                       # Start all dev servers (Turbo)
npm run lint                      # Lint all packages
npm run build                     # Build all packages
npm run typecheck                 # TypeScript checking across monorepo
npm run test                      # Run all tests

# Mobile (from apps/mobile)
cd apps/mobile
npm start                         # Start Expo dev server
npm run ios                       # Run on iOS simulator
npm run android                   # Run on Android emulator

# Web apps (from apps/<app-name>)
cd apps/web                       # or apps/landing, apps/waitlist, etc.
npm run dev                       # Start Next.js dev server
npm run build                     # Production build

# Scoped Turbo (from root)
npx turbo run dev --filter=mobile
npx turbo run build --filter=web
npx turbo run lint --filter=@repo/ui

# Quality (run after each feature implementation)
npm run lint
npm run typecheck
npm test                          # Ensure test coverage thresholds are met
```

---

## App Registry

Every deployable app lives under `apps/`. Add new apps here as the product grows.

| App | Directory | Framework | Purpose | Status |
|-----|-----------|-----------|---------|--------|
| **Mobile** | `apps/mobile` | Expo + React Native | Primary mobile app | {{active/planned}} |
| **Web App** | `apps/web` | Next.js | Main web app (mirrors mobile features) | {{active/planned}} |
| **Landing Page** | `apps/landing` | Next.js | Marketing site + app download links | {{active/planned}} |
| **Waitlist** | `apps/waitlist` | Next.js | Pre-launch email collection | {{active/planned}} |
| **Feedback** | `apps/feedback` | Next.js | Public feedback/feature request board | {{active/planned}} |
| **Admin / CMS** | `apps/admin` | Next.js + Payload CMS | Content management dashboard | {{active/planned}} |

> **Adding a new app:** Copy the closest existing app as a template, update `package.json` name to `@apps/<name>`, wire it into `turbo.json`, and add it to this table.

---

## Project Structure

```
{{project-slug}}/
├── apps/
│   ├── mobile/                    # Expo React Native app
│   │   ├── src/
│   │   │   ├── screens/           # Screen-based feature folders
│   │   │   ├── shared/            # Shared mobile-only components
│   │   │   ├── components/ui/     # Simple UI primitives
│   │   │   ├── navigation/        # Tab & stack navigators
│   │   │   ├── db/                # SQLite & KV store integration
│   │   │   ├── i18n/              # Localization (i18next)
│   │   │   ├── hooks/             # Global hooks (3+ consumers)
│   │   │   ├── utils/             # Global utilities
│   │   │   ├── assets/            # Fonts, animations, images
│   │   │   └── theme.ts           # Local theme overrides
│   │   └── app.json
│   │
│   ├── web/                       # Main web app (feature parity with mobile)
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router
│   │   │   ├── components/        # Web-specific components
│   │   │   ├── lib/               # Web-specific utilities & API clients
│   │   │   └── styles/            # Global styles / Tailwind config
│   │   └── next.config.js
│   │
│   ├── landing/                   # Marketing / download landing page
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── content/           # Copy, images, feature lists
│   │   └── next.config.js
│   │
│   ├── waitlist/                  # Email collection micro-app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/               # Email provider integration
│   │   └── next.config.js
│   │
│   ├── feedback/                  # Feedback board app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/               # Voting, submission logic
│   │   └── next.config.js
│   │
│   └── admin/                     # CMS dashboard (Payload)
│       ├── src/
│       │   ├── collections/       # Payload collection schemas
│       │   ├── globals/           # Payload global configs
│       │   ├── components/        # Custom admin UI components
│       │   └── access/            # Access control policies
│       └── payload.config.ts
│
├── packages/
│   ├── domain/                    # Shared types & business logic
│   │   ├── types/                 # Entity types, enums, interfaces
│   │   ├── validators/            # Zod schemas / validation functions
│   │   ├── constants/             # Business constants, config enums
│   │   └── index.ts
│   │
│   ├── ui/                        # Cross-platform shared UI components
│   │   ├── src/
│   │   │   ├── primitives/        # Button, Text, Card, Input
│   │   │   ├── composites/        # Complex reusable components
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── theme/                     # Cross-platform design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── api-client/                # Shared API client (fetch wrapper, types)
│   │   ├── client.ts
│   │   ├── endpoints/
│   │   └── index.ts
│   │
│   ├── config/                    # Shared runtime config resolution
│   │   ├── env.ts                 # Typed env var access
│   │   └── index.ts
│   │
│   ├── i18n/                      # Shared translations & locale logic
│   │   ├── locales/
│   │   │   ├── en/
│   │   │   └── ar/                # (or other languages)
│   │   ├── config.ts
│   │   └── index.ts
│   │
│   ├── mock-data/                 # Localized mock/seed data
│   │   ├── en/
│   │   ├── ar/
│   │   └── index.ts
│   │
│   ├── eslint-config/             # Shared ESLint config
│   └── typescript-config/         # Shared TSConfig base
│
├── tooling/                       # (Optional) Generators, scripts, CI helpers
│   ├── generators/                # Plop/Hygen templates for new apps/components
│   └── scripts/                   # Deploy, seed, migration scripts
│
├── docs/                          # Design specs, architecture, PRD
├── turbo.json
├── package.json
└── tsconfig.json
```

---

## App Definitions

### Mobile App (`apps/mobile`)

The primary native experience. Built with **Expo (managed workflow)** and **React Native**.

**Owns:** native navigation, device APIs (camera, haptics, notifications), offline storage (SQLite), platform-specific UI.

**Delegates to packages:** domain types, theme tokens, shared UI, i18n strings, API client.

### Web App (`apps/web`)

The browser-based counterpart to the mobile app with feature parity. Built with **Next.js (App Router)**.

**Owns:** web-specific layouts, SSR/SSG pages, web auth flows, responsive breakpoints.

**Delegates to packages:** same as mobile — domain, theme, shared UI, i18n, API client.

### Landing Page (`apps/landing`)

A static/SSG marketing site. Links to app stores, showcases features, SEO-optimized.

**Owns:** marketing copy, download CTAs, feature showcase sections, analytics.

**Typical pages:** `/` (hero + features), `/pricing` (if applicable), `/about`.

### Waitlist (`apps/waitlist`)

A lightweight single-page app for pre-launch email collection.

**Owns:** email capture form, confirmation UI, email provider integration (Resend / Mailchimp / ConvertKit).

**Can be:** a standalone deploy or a route within `apps/landing` — start standalone, merge later if desired.

### Feedback Board (`apps/feedback`)

A public-facing board for users to submit and vote on feature requests.

**Owns:** submission form, voting system, status labels (planned / in progress / done), optional auth.

**Can use:** Payload CMS as the backend, or a lightweight DB (SQLite/Postgres).

### Admin / CMS (`apps/admin`)

A Payload CMS dashboard for managing content that powers the other apps.

**Owns:** collection schemas, content editing UI, media management, access control, API endpoints consumed by other apps.

**Example collections:** `{{ContentType}}` (e.g., Flashcards, Decks, Categories), Users, Feedback, WaitlistEntries.

---

## Shared Packages

### `packages/domain` — Types & Business Logic

The **single source of truth** for all entity types, enums, validation, and pure business logic shared across every app.

```typescript
// Example: packages/domain/types/index.ts

// Entity types — define your core domain here
export interface {{EntityName}} {
  id: string;
  // ... your fields
  createdAt: string;        // ISO timestamp
  updatedAt?: string;
}

// Enums / union types
export type {{StatusType}} = 'active' | 'archived' | 'draft';

// Validation (Zod recommended)
// export const {{EntityName}}Schema = z.object({ ... });
```

**Rules:**
- Zero platform dependencies (no React, no Expo, no Next.js imports)
- Pure TypeScript only — runs anywhere
- Zod schemas live here for shared validation between client and server
- Business logic functions (scoring, filtering, formatting) belong here

### `packages/ui` — Cross-Platform UI Components

Shared UI components that work in **both** React Native and Next.js (web).

**Strategy options (pick one per project):**
1. **React Native Web** — write components in RN, use `react-native-web` for browser
2. **Platform-split files** — `Button.tsx` (web) + `Button.native.tsx` (mobile)
3. **Headless logic + platform renderers** — shared hooks, platform-specific views

### `packages/theme` — Design Tokens

Platform-agnostic design tokens: colors, spacing, typography scales, border radii.

```typescript
// packages/theme/index.ts
export const colors = {
  primary: { 50: '#...', 100: '#...', /* ... */ 900: '#...' },
  neutral: { /* ... */ },
  semantic: { success: '#...', error: '#...', warning: '#...' },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { sm: 4, md: 8, lg: 16, full: 9999 } as const;
```

### `packages/api-client` — Shared API Layer

A typed fetch wrapper used by all client apps to talk to the CMS / backend.

```typescript
// packages/api-client/client.ts
export function createApiClient(baseUrl: string) {
  return {
    get: <T>(path: string) => fetch(`${baseUrl}${path}`).then(r => r.json() as Promise<T>),
    post: <T>(path: string, body: unknown) => /* ... */,
  };
}
```

### `packages/config` — Environment & Runtime Config

Typed environment variable access. Each app provides its own `.env`, this package provides the typed accessor.

```typescript
// packages/config/env.ts
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}
```

---

## Mobile App Conventions

### Screen-Based Folder Structure

```
apps/mobile/src/
  screens/
    [screenName]/
      [ScreenName]Screen.tsx          # Screen entry point
      constants.ts                    # Screen-level constants (optional)
      components/                     # Screen-specific components
        [ComponentName]/
          index.tsx                   # Main component (required)
          [SubComponent].tsx          # Sub-components (optional)
          use[Name].hook.ts           # Component-specific hooks (optional)
          [name].utils.ts             # Component utilities (optional)
          [ComponentName].styles.ts   # Styles (optional)
          [ComponentName].types.ts    # Types (optional)
          constants.ts                # Constants (optional)

  shared/                             # Mobile-only shared components (2+ consumers)
    [ComponentName]/
      index.tsx
      [SubComponent].tsx
      use[Name].hook.ts
      [name].utils.ts
      [ComponentName].styles.ts

  components/
    ui/                               # Simple UI primitives (can stay flat)
      Button.tsx
      Card.tsx
      Text.tsx
      index.ts                        # Barrel export

  hooks/                              # Global hooks (3+ unrelated consumers)
  utils/                              # Global utilities
  db/                                 # Database layer
  i18n/                               # Localization
  navigation/                         # Router configuration
```

### File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Main component | `index.tsx` | `VoiceNotePill/index.tsx` |
| Sub-component | `PascalCase.tsx` | `MoodEntryCard.tsx` |
| Hook | `use[Name].hook.ts` | `useAudioRecording.hook.ts` |
| Utilities | `[name].utils.ts` | `formatGreeting.utils.ts` |
| Styles | `[ComponentName].styles.ts` | `VoiceNotePill.styles.ts` |
| Types | `[ComponentName].types.ts` | `VoiceNotePill.types.ts` |
| Constants | `constants.ts` | `constants.ts` |
| Test | `[Name].test.tsx` | `VoiceNotePill.test.tsx` |

### Folder Structure Rules

1. **Component Folder Rule**: Create folder when component has 2+ related files
2. **Shared Component Rule**: Move to `src/shared/` when used by 2+ screens/components
3. **Screen Components Rule**: Stay in `screens/[screen]/components/`
4. **Global Hooks Rule**: Stay in `src/hooks/` when used by 3+ unrelated components
5. **UI Primitives Rule**: Simple primitives can stay flat in `components/ui/`
6. **Import Boundary Rule**: Components cannot import internal files from other component folders

### Responsive Scaling (Mobile)

All scaling is relative to a base device (e.g., iPhone 14 at 390x844).

| Function | Factor | Use Case |
|----------|--------|----------|
| `ms(size)` | 0.5 | Most spacing: padding, margins, gaps, dimensions |
| `fs(size)` | 0.3 | Font sizes: conservative scaling for readability |
| `rs(size)` | 0.25 | Border radius: minimal scaling for visual consistency |

**Pattern: Scale in constants, not inline.**

```typescript
// screens/home/constants.ts
import { ms, rs, fs } from '@/utils/scaling.utils';

const BASE = { cardPadding: 16, cardRadius: 12, titleSize: 18 } as const;

export const HOME_LAYOUT = {
  cardPadding: ms(BASE.cardPadding),
  cardRadius: rs(BASE.cardRadius),
  titleSize: fs(BASE.titleSize),
} as const;
```

---

## Web App Conventions

### Next.js App Structure

```
apps/<web-app>/src/
  app/
    layout.tsx                # Root layout (fonts, providers, metadata)
    page.tsx                  # Home page
    [route]/
      page.tsx
      loading.tsx             # (optional) route-level loading state
      error.tsx               # (optional) route-level error boundary
  components/
    [ComponentName]/
      index.tsx
      [ComponentName].types.ts
      [SubComponent].tsx
  lib/
    api.ts                    # App-specific API helpers
    auth.ts                   # Auth utilities (if applicable)
    utils.ts                  # App-specific utilities
  hooks/
    use[Name].ts
  styles/
    globals.css               # Tailwind base + custom properties
```

### Web Styling

- **Tailwind CSS** for all web apps
- Theme tokens from `@repo/theme` mapped to CSS custom properties or Tailwind config
- Consistent with mobile design language via shared theme package

### Web-Specific Rules

1. **Server Components by default** — use `'use client'` only when needed
2. **Metadata & SEO** — every page exports `metadata` for title, description, OG tags
3. **Loading & Error states** — provide `loading.tsx` and `error.tsx` per route group
4. **Environment variables** — access via `@repo/config`, never hardcode URLs or keys

---

## Key Patterns

### TypeScript
- Strict mode enabled across all packages and apps
- Shared types from `@repo/domain`
- All code must be `.ts` or `.tsx` — no `.js` files

### Imports

```typescript
// Mobile: always use @/ alias
import { MoodSelector } from '@/shared/components/MoodSelector';
import { formatDate } from '@/utils/date.utils';

// Web: always use @/ alias
import { Hero } from '@/components/Hero';

// Monorepo packages: use @repo/ prefix
import { type FlashCard } from '@repo/domain';
import { colors, spacing } from '@repo/theme';
import { createApiClient } from '@repo/api-client';
```

**Never use deep relative paths** like `../../../`. Always use `@/` within an app or `@repo/` for packages.

### State & Data
- **Mobile:** Local state with `useState` / `useReducer`. SQLite + KV Store for persistence (expo-sqlite). No Redux/Zustand.
- **Web apps:** React Server Components for data fetching. Client state with `useState` / `useReducer`. React Query / SWR for async state if needed.
- **Shared:** Business logic and state derivation in `@repo/domain` as pure functions.

### Localization (if applicable)
- i18next + react-i18next
- Translation strings in `packages/i18n/locales/{lang}/`
- RTL support for Arabic (or other RTL languages)
- Device language detection via expo-localization (mobile) or `Accept-Language` header (web)

### Styling
- **Mobile:** React Native StyleSheet (no CSS-in-JS). Centralized theme from `@repo/theme`.
- **Web:** Tailwind CSS. Theme tokens from `@repo/theme` integrated into `tailwind.config.ts`.

### Testing

- **Framework:** Jest (with `jest-expo` preset for mobile)
- **Component testing:** React Testing Library
- **Test location:** Centralized in `src/__tests__/` mirroring source folder structure
- **Run after every feature:** `npm run lint && npm run typecheck && npm test`

```
apps/mobile/src/__tests__/
  screens/
    home/
      components/
        HomeHeader.test.tsx
  shared/
    components/
      CardComponent.test.tsx
  hooks/
    useAuth.hook.test.ts
  utils/
    formatting.test.ts
```

### Reusability & Extraction Rules

These rules apply to **every file** across all apps and packages:

1. **Domain-first naming.** No product/app names in code (e.g., avoid `shuurCard`, `myAppButton`). Use generic domain terms.
2. **No hardcoded config.** Bundle IDs, project IDs, backend URLs, API keys, and feature flags must come from config or env vars — never inline.
3. **Pure core logic.** Business rules, formatting, validation, and state derivation must not import from Expo, React Native, or Next.js. Keep them in `@repo/domain` or as pure `.ts` utilities.
4. **Platform adapters at the edges.** Compute and decide in pure logic, then call Expo/RN/Next in a thin adapter layer.
5. **Extract early.** If 2+ apps use the same logic, move it to a shared package immediately. If a module can't move to `packages/*` without rewrites, it is too coupled — refactor.

### Adding a New Web App

```bash
# 1. Create from template (or copy closest existing app)
cp -r apps/landing apps/my-new-app

# 2. Update package.json
#    - name: "@apps/my-new-app"
#    - dependencies: add @repo/* packages as needed

# 3. Wire into turbo.json (usually automatic if package.json is correct)

# 4. Add to App Registry table in this document

# 5. Create .env.local with app-specific env vars

# 6. Start developing
cd apps/my-new-app && npm run dev
```

### Adding a New Shared Package

```bash
# 1. Create package directory
mkdir -p packages/my-package/src

# 2. Create package.json with name "@repo/my-package"

# 3. Create index.ts entry point

# 4. Add to consuming apps' package.json dependencies

# 5. Add to this document's Shared Packages section
```

---

## Domain Types

Define your core entities here. These live in `packages/domain/types/`.

```typescript
// {{Replace with your actual domain types}}

// Example for a flashcard app:
interface Deck {
  id: string;
  title: string;
  description?: string;
  language: string;
  category: string;
  cardCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface FlashCard {
  id: string;
  deckId: string;
  front: string;            // Question / syntax
  back: string;             // Answer / explanation
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
}

interface UserProgress {
  id: string;
  userId: string;
  cardId: string;
  score: number;            // 0-1 confidence
  lastReviewedAt: string;
  nextReviewAt: string;     // Spaced repetition
  reviewCount: number;
}

// Waitlist
interface WaitlistEntry {
  id: string;
  email: string;
  source?: string;          // utm_source or referral
  createdAt: string;
}

// Feedback
interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'planned' | 'in-progress' | 'done';
  votes: number;
  authorEmail?: string;
  createdAt: string;
}
```

---

## Important Files

| File | Purpose |
|------|---------|
| `turbo.json` | Monorepo task pipeline configuration |
| `apps/mobile/app.json` | Expo config (bundle ID, splash, permissions) |
| `apps/mobile/metro.config.js` | Metro bundler config for monorepo + SVG |
| `apps/*/next.config.js` | Next.js config per web app |
| `packages/theme/index.ts` | Cross-platform design tokens |
| `packages/domain/index.ts` | Shared entity types & business logic |
| `packages/ui/` | Cross-platform reusable UI components |
| `packages/api-client/` | Shared typed API client |
| `packages/config/env.ts` | Typed environment variable accessor |
| `packages/i18n/` | Shared translation strings |

---

## Development Notes

- **Node.js** >= 18, npm >= 10
- **Turborepo** handles task orchestration, caching, and dependency graph
- **Mobile fonts** must load before app renders (use `expo-splash-screen` to block)
- **Metro config** handles monorepo resolution to prevent duplicate React
- **Database** seeded on first launch (mobile: SQLite, web: CMS API)
- **Deployments:**
  - Mobile: EAS Build + EAS Submit
  - Web apps: Vercel (recommended) or any Node.js host
  - CMS: Self-hosted or Payload Cloud
- **CI/CD:** Run `lint → typecheck → test → build` in pipeline. Turbo caching makes this fast.
- **Environment variables:** Never commit `.env` files. Use `.env.example` as templates.
