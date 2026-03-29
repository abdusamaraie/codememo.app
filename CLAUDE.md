# CLAUDE.md

This file is the entry point for Claude Code. It tells Claude how to work in this codebase.

## Project Overview

codememo-app is a TypeScript monorepo (Turborepo) containing multiple web apps and a mobile app. All apps share domain types, theme tokens, UI components, and utilities through internal packages.

## Monorepo Layout

```
apps/
  mobile/          → Expo + React Native (main mobile app)
  web/             → Next.js App Router (main web app)
  landing/         → Next.js (marketing / app download page)
  waitlist/        → Next.js (email collection micro-app)
  feedback/        → Next.js (public feedback board)
  admin/           → Next.js + Payload CMS (content management)

packages/
  domain/          → Shared types, validators, pure business logic (zero deps)
  ui/              → Cross-platform UI components
  theme/           → Design tokens (colors, spacing, typography)
  api-client/      → Typed fetch wrapper for all client apps
  config/          → Typed env var access
  i18n/            → Shared translation strings
  mock-data/       → Seed/mock data
  eslint-config/   → Shared ESLint rules
  typescript-config/ → Shared tsconfig base
```

## Commands

```bash
# From root
npm run dev                         # All dev servers
npm run lint                        # Lint everything
npm run build                       # Build everything
npm run typecheck                   # TS check everything
npm run test                        # All tests

# Scoped
npx turbo run dev --filter=mobile
npx turbo run build --filter=web

# From apps/mobile
npm start                           # Expo dev server
npm run ios
npm run android

# From any apps/<web-app>
npm run dev                         # Next.js dev
```

## Key Rules — Follow These Always

### After every feature or change
Run all three. Fix any failures before moving on:
```bash
npm run lint
npm run typecheck
npm test
```

### Imports
- Inside any app: use `@/` alias. Never use `../../../`.
- For shared packages: use `@repo/domain`, `@repo/theme`, `@repo/ui`, etc.
```typescript
// ✅ Good
import { FlashCard } from '@repo/domain';
import { colors } from '@repo/theme';
import { Hero } from '@/components/Hero';

// ❌ Bad
import { FlashCard } from '../../../packages/domain';
```

### No hardcoded config
Bundle IDs, API URLs, keys, feature flags → env vars via `@repo/config`. Never inline.

### Domain-first naming
No product-specific names in code. Use generic domain terms.
```typescript
// ✅ formatCardFront()
// ❌ formatMyAppCard()
```

### Pure business logic
Business rules, validation, formatting, state derivation → `@repo/domain` or pure `.ts` utils. No React/Expo/Next.js imports in these files.

### Platform code at the edges
Compute in pure logic → call Expo/RN/Next in thin adapters.

## Mobile Conventions (apps/mobile)

### Structure
- Screens in `src/screens/[screenName]/`
- Each screen has `[ScreenName]Screen.tsx` + `components/` folder
- Shared mobile components in `src/shared/` (2+ consumers)
- Simple primitives flat in `src/components/ui/`
- Global hooks in `src/hooks/` (3+ unrelated consumers)

### File naming
| Type | Pattern |
|------|---------|
| Component entry | `index.tsx` |
| Sub-component | `PascalCase.tsx` |
| Hook | `use[Name].hook.ts` |
| Utils | `[name].utils.ts` |
| Styles | `[Name].styles.ts` |
| Types | `[Name].types.ts` |
| Constants | `constants.ts` |

### Styling
- React Native `StyleSheet.create()` only. No CSS-in-JS.
- Theme from `@repo/theme`.
- Scale values in `constants.ts` using `ms()`, `fs()`, `rs()` — never inline in StyleSheet.

### State
- `useState` / `useReducer` for local state
- SQLite + KV Store (expo-sqlite) for persistence
- No Redux / Zustand

## Web Conventions (all Next.js apps)

### Structure
- App Router (`src/app/`)
- Components in `src/components/`
- Utilities in `src/lib/`
- Hooks in `src/hooks/`

### Rules
- Server Components by default. Add `'use client'` only when needed.
- Every page exports `metadata` (title, description, OG).
- Tailwind CSS for styling. Map `@repo/theme` tokens into `tailwind.config.ts`.

## Shared Package Rules

### packages/domain
- Zero platform dependencies. Pure TypeScript only.
- Entity types, enums, Zod validators, business logic functions.
- If it imports from React, Expo, or Next.js — it doesn't belong here.

### packages/ui
- Cross-platform components (React Native + Web).
- Strategy: react-native-web OR platform-split files (`.tsx` / `.native.tsx`).

### packages/theme
- Plain objects and `as const`. No framework imports.
- Colors, spacing, typography, radii.

### Extraction rule
If 2+ apps use the same code → move it to a `packages/*` package immediately. If a module can't move without rewrites, it's too coupled — refactor.

## Testing

- Jest + React Testing Library
- Mobile: `jest-expo` preset
- Tests in `src/__tests__/` mirroring source structure
- Test coverage thresholds must be met before merging

## Adding New Apps or Packages

### New web app
1. Copy closest existing app in `apps/`
2. Update `package.json` name to `@apps/<name>`
3. Add needed `@repo/*` dependencies
4. Create `.env.local`
5. Turbo picks it up automatically

### New shared package
1. Create `packages/<name>/` with `package.json` (name: `@repo/<name>`) and `index.ts`
2. Add to consuming apps' dependencies
3. Run `npm install` from root

## Common Gotchas

- Mobile fonts must load before render (expo-splash-screen blocks until ready)
- Metro config in `apps/mobile/metro.config.js` resolves monorepo deps — don't remove
- Never commit `.env` files. Use `.env.example` as templates.
- Locale changes may need app restart for RTL/LTR switch on mobile
- Payload CMS collections auto-generate REST + GraphQL endpoints

## Reference

Full architecture details, domain types, and scaling patterns: see `docs/PROJECT.md`
