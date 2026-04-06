---
name: codememo-expert
description: Omnibus expert for the CodeMemo monorepo. Activates deep project context covering architecture, domain logic, all apps, and design system. Use before any task — feature work, bug fix, UI change, backend mutation, code review, or system design. Replaces the need to re-read the codebase each session.
---

# CodeMemo Expert

You are the all-in-one expert for the **CodeMemo** codebase — simultaneously acting as Product Manager, Backend Engineer, Frontend Engineer (Web + Mobile), System Design Engineer, UI/UX Designer, and Code Reviewer.

When this skill is active, you have full project context. You do NOT need to re-read files to understand the architecture. You reference this document first and only open files when you need live code for a specific edit.

---

## 1. Project Identity

**CodeMemo** — A spaced-repetition syntax memorisation platform for developers.

| Dimension | Detail |
|-----------|--------|
| Core loop | Study → Rate → SM-2 schedules next review → Streak maintained |
| Auth | Clerk (email, GitHub, anonymous → upgradeable) |
| Backend | Convex (serverless, real-time subscriptions) |
| Content | Payload CMS v3 (PostgreSQL) → syncs to Convex via HTTP webhook |
| Web | Next.js 16, React 19, App Router, Tailwind CSS |
| Mobile | Expo (React Native 0.81), React Navigation, Reanimated |
| Admin | Payload CMS v3 on Next.js (port 3001) |
| Monorepo | Turborepo, `apps/*` + `packages/*` |

---

## 2. Monorepo Map

```
apps/
  web/          → Next.js 16 (port 3000) — primary learning UI
  mobile/       → Expo/RN 0.81 — iOS & Android
  admin/        → Payload CMS v3 (port 3001) — content editing
  landing/      → Next.js — marketing
  waitlist/     → Next.js — email capture
  feedback/     → Next.js — public feedback board

packages/
  domain/       → Pure TS: types, SM-2, streak, scoring logic (ZERO deps)
  convex/       → Convex schema + all backend functions
  theme/        → Design tokens, CSS var factory, accent system
  ui/           → Cross-platform component library (in progress)
  api-client/   → Typed fetch wrapper for client apps
  config/       → Typed env var access
  i18n/         → Shared translation strings
  mock-data/    → Dev/seed data
  eslint-config/
  typescript-config/
```

**Import rules (enforced):**
- Inside any app → `@/` alias
- Cross-app packages → `@repo/domain`, `@repo/theme`, `@repo/ui`, etc.
- Never use relative `../../../` imports across package boundaries

---

## 3. Domain Layer (`packages/domain`)

Zero-dependency pure TypeScript. The single source of truth for types and business rules. If it imports React, Expo, or Next.js — it does not belong here.

### Key Types

```typescript
// user.ts
type User = { id, authProvider: 'anonymous'|'email'|'github', email?, githubId?,
  displayName?, avatarUrl?, themePreference: 'dark'|'light'|'system',
  accentPreference: string, createdAt: number, updatedAt: number }

// flashcard.ts
type Flashcard = { id, sectionId, question, questionType: QuestionType,
  answer, answerCode?, explanation?, hint?, commonMistakes: string[],
  difficulty: 'beginner'|'intermediate'|'advanced', tags: string[] }

// progress.ts — SM-2 state per card
type SM2Params = { interval: number, repetitions: number,
  easeFactor: number, nextReviewAt: number }
type CardProgress = { userId, flashcardId, sm2: SM2Params,
  lastReviewedAt, totalReviews, successfulReviews }

// streak.ts
type Streak = { userId, currentStreak, longestStreak,
  lastActiveDate: string, todayCompleted: boolean,
  freezesAvailable, cardsTarget, cardsCompletedToday, ... }
```

### Business Logic

| File | Function | Rule |
|------|----------|------|
| `logic/sm2.ts` | `calculateNextReview(quality, params, now)` | Quality 1=Forgot, 3=Hard, 4=Good, 5=Nailed. Failed(<3) resets reps, min ease 1.3, initial interval 1→6→n days |
| `logic/streak.ts` | `calculateStreak()`, `incrementStreak()` | Breaks on >1 day gap |
| `logic/scoring.ts` | XP per quality | 1→0, 3→5, 4→10, 5→15 XP |
| `constants/sm2-defaults.ts` | `SM2_DEFAULTS`, `NEW_CARD_SM2` | Initial ease 2.5 |

---

## 4. Backend Layer (`packages/convex`)

Convex serverless functions. All mutations require `requireAuth(ctx)` except webhooks and sync actions.

### Schema Tables

```
users            → auth, preferences
languages        → slug, name, color, order, isPublished
sections         → language(rel), title, slug, order, isPublished
flashcards       → section(rel), question, answer, difficulty, tags
exercises        → section(rel), type, prompt, options, correctAnswer
cheatSheetEntries→ language(rel), syntax snippets
cardProgress     → userId + flashcardId + SM2 state
sectionProgress  → userId + sectionId + status + counters
streaks          → userId + streak state + today counters
studySessions    → session tracking
exerciseAttempts → exercise history
quizAttempts     → quiz history
```

**Key indexes:** `by_user`, `by_user_card`, `by_section_order`, `by_language_order`, `by_user_due` (nextReviewAt for SM-2 scheduling)

### Function Map

| File | Key Functions |
|------|--------------|
| `auth.ts` | `requireAuth(ctx)`, `createAnonymousUser()`, `upgradeToEmail/GitHub()` |
| `users.ts` | `getUser()`, `getByClerkId()`, `updateSettings()`, `createFromWebhook()` |
| `content.ts` | `listLanguages()`, `getLanguage(slug)`, `listSections(languageId)`, `getFlashcards(sectionId)`, `getExercises(sectionId)` |
| `flashcards.ts` | `getStudySession(sectionId)` → due+new cards (max 10), `recordReview(flashcardId, quality)` |
| `progress.ts` | `getUserProgress()`, `getSectionProgress(sectionId)`, `updateSectionProgress()` |
| `streaks.ts` | `getStreak()`, `updateStreak(date)`, `useFreeze()` |
| `sync.ts` | HTTP action: POST `/sync` — validates `x-sync-secret`, routes to upsert mutations |
| `quizzes.ts` | Quiz attempt recording |
| `exercises.ts` | Exercise attempt recording |
| `ai.ts` | AI assist queries |
| `crons.ts` | Scheduled jobs |

### Data Flow: Content Publishing

```
Payload CMS (admin edit)
  → afterChange hook → syncToConvex(entityType, doc)
  → HTTP POST to Convex /sync (header: x-sync-secret)
  → Convex validates + routes to upsert mutations
  → Data available in Convex DB for all clients
```

### Data Flow: Study Session

```
User opens study screen
  → useQuery(api.flashcards.getStudySession, { sectionId })
  → Returns due cards + new cards (max 10 total)
  → User rates card (1/3/4/5)
  → useMutation(api.flashcards.recordReview, { flashcardId, quality })
  → Convex calculates SM-2 → updates cardProgress
  → Convex updates streak + sectionProgress
  → Real-time subscription updates UI
```

---

## 5. Web App (`apps/web`)

Next.js 16, React 19, App Router. Port 3000.

### Route Structure

```
src/app/
  layout.tsx                          → Root (Clerk + Convex providers)
  page.tsx                            → Redirects → /learn
  (app)/                              → Protected group (requires auth)
    layout.tsx                        → AppShell (Sidebar + MobileNav)
    learn/page.tsx                    → Dashboard: language cards
    languages/page.tsx                → Language explorer
    path/[language]/page.tsx          → Learning path for a language
    study/[language]/[section]/page.tsx   → Flashcard study mode
    practice/[language]/[section]/page.tsx → Exercise mode
    quiz/[language]/[section]/page.tsx    → Quiz mode
    progress/page.tsx                 → User progress dashboard
    quests/page.tsx                   → Daily quests/challenges
    settings/page.tsx                 → Preferences
    leaderboard/page.tsx              → Global leaderboard
  sign-in/[[...sign-in]]/             → Clerk UI
  sign-up/[[...sign-up]]/
  api/webhooks/clerk/route.ts         → User provisioning webhook
```

### Component Architecture

```
src/components/
  study/
    FlashcardDeck.tsx       → Orchestrates study session UI
    FlashcardCard.tsx       → Individual card with flip animation
    FlashcardFront.tsx      → Question side
    FlashcardBack.tsx       → Answer side
    StudyTopBar.tsx         → Progress bar + session info
    StudyBottomBar.tsx      → Rating buttons (1/3/4/5)
    CheatSheetPanel.tsx     → Slide-in reference panel
    SessionComplete.tsx     → End-of-session summary
    AiAssistPanel.tsx       → AI explanation panel
    CodeDiff.tsx            → Code comparison component

  layout/
    Sidebar.tsx             → Collapsible nav (SidebarContext)
    MobileHeader.tsx
    MobileBottomNav.tsx
    AppShell.tsx
    SidebarContext.tsx      → collapse state via React Context

  ui/                       → Radix UI primitives (Button, Card, Tabs,
                              Dialog, Dropdown, Tooltip, etc.)
  exercises/                → Exercise-specific components
```

### Key Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useStudySession` | `src/hooks/useStudySession.hook.ts` | Card state, SM-2 calc, XP tracking, ratings summary |
| `useGamificationStats` | `src/hooks/useGamificationStats.hook.ts` | Streak tracking, daily metrics |
| `useSidebar` | via `SidebarContext` | Sidebar collapse state |

### Data Fetching Patterns

- **RSC (Server Components):** Content from Payload CMS via `src/lib/api/payload.ts`. ISR revalidation: 60s.
- **Client hooks:** `useQuery` / `useMutation` from `convex/react` for user data and mutations.
- **Local progress:** `localStorage` for anonymous users. Convex DB for authenticated.
- **Provider:** `src/components/ConvexClientProvider.tsx` — wraps Convex + Clerk integration.

### Styling

- Tailwind CSS + CSS custom properties
- `--foreground`, `--background`, `--primary`, etc. mapped from `@repo/theme`
- `html[data-theme]` attribute for dark/light
- Accent switcher: `src/components/ui/accent-switcher.tsx` (changes CSS vars, no reload)
- Theme switcher: `src/components/ui/theme-switcher.tsx`

---

## 6. Mobile App (`apps/mobile`)

Expo + React Native 0.81. Port 8081.

### Navigation Tree

```
RootStackNavigator
  MainTabs (bottom tab bar)
    Home     → HomeScreen
    Learn    → LanguagesScreen
    Profile  → ProfileScreen
  Sections   → SectionListScreen
  Study      → FlashcardScreen (full-screen, no tabs)
```

### Screens

| Screen | File | Key Features |
|--------|------|-------------|
| HomeScreen | `src/screens/home/HomeScreen.tsx` | Greeting, streak, continue cards, daily goals |
| LanguagesScreen | `src/screens/languages/LanguagesScreen.tsx` | Language list with progress |
| SectionListScreen | `src/screens/sections/SectionListScreen.tsx` | Sections in a language |
| FlashcardScreen | `src/screens/study/FlashcardScreen.tsx` | Flip animation, swipe, rating buttons |
| ProfileScreen | `src/screens/profile/ProfileScreen.tsx` | Stats, preferences |

### Mobile Conventions

- Styling: `StyleSheet.create()` only — no CSS-in-JS
- Scale: `ms()`, `fs()`, `rs()` from constants, never inline in StyleSheet
- Animation: React Native Reanimated (shared values, flip + slide)
- Gestures: React Native Gesture Handler
- State: `useState` / `useReducer` — no Redux/Zustand
- Persistence: expo-sqlite (local) + Convex (when integrated)
- **Current status:** Mobile uses mock data (MOCK_CARDS). Convex integration pending.

### File Naming Conventions

| Type | Pattern |
|------|---------|
| Screen entry | `[ScreenName]Screen.tsx` |
| Sub-component | `PascalCase.tsx` in `components/` |
| Hook | `use[Name].hook.ts` |
| Utils | `[name].utils.ts` |
| Styles | `[Name].styles.ts` |
| Types | `[Name].types.ts` |
| Constants | `constants.ts` |

---

## 7. Admin / CMS (`apps/admin`)

Payload CMS v3 on Next.js. Port 3001. PostgreSQL.

### Collections

| Collection | Key Fields | Sync |
|-----------|-----------|------|
| Languages | name, slug (select), color, order, isPublished | Yes → Convex |
| Sections | language(rel), title, slug, order, isPublished | Yes → Convex |
| Flashcards | section(rel), question, questionType, front/back, tags, difficulty, order | Yes → Convex |
| Exercises | section(rel), type, prompt, options, correctAnswer, explanation | Yes → Convex |
| CheatSheetEntries | language(rel), syntax snippets | Yes → Convex |
| SiteSettings | global config (appDataSource: real/mock) | — |

### Sync Mechanism

`src/endpoints/syncToConvex.ts` — called from `afterChange` hooks.
- HTTP POST to Convex `/sync` with `x-sync-secret` header
- Fire-and-forget (errors logged, never thrown)
- Body: `{ collection, operation, data }`

---

## 8. Theme & Design System (`packages/theme`)

### Token Hierarchy

```
Primitives (colors, spacing, radius, shadows, typography)
  → Semantics (foreground, background, primary, muted, accent, etc.)
    → Components (Button variants, Card, Modal, Input, Tabs, Avatar, Badge, Toast)
      → CSS Custom Properties (generated for web via generateCssVars())
```

### Key Exports

| Export | Purpose |
|--------|---------|
| `createSemantics(accent)` | Build semantic color map from accent hue |
| `createComponents(semantics)` | Build component tokens |
| `generateCssVars(accent, options)` | CSS custom properties for Next.js |
| `createBaseTheme()`, `extendTheme()` | Theme composition |
| `getPencilVars()` | Figma Pencil design system sync |

### Accent Palette

Predefined accents: `purple`, `sky`, `amber`, `rose`, `emerald`, + more.

### Accessibility Utils

`getContrastRatio()`, `meetsContrastAA()`, `getReadableTextColor()` — always use when adding new color pairs.

---

## 9. Environment Variables

| App | Key Vars |
|-----|---------|
| `apps/web` | `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_ADMIN_URL` |
| `apps/mobile` | `EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| `apps/admin` | `PAYLOAD_SECRET`, `DATABASE_URL`, `CONVEX_HTTP_URL`, `CONVEX_SYNC_SECRET`, `CORS_ORIGINS` |
| Convex | `CONVEX_SYNC_SECRET` |

---

## 10. Testing Mandate

TDD: write tests first, implement second. No PR without tests for new logic.

| Layer | Location | Runner |
|-------|----------|--------|
| Domain logic | `packages/domain/__tests__/*.test.ts` | Jest (vanilla) — 100% coverage |
| Convex functions | Use `convex-test` utilities | — |
| Web components | `apps/web/src/__tests__/*.test.tsx` | jest + React Testing Library |
| Mobile screens | `apps/mobile/src/__tests__/*.test.tsx` | jest-expo |
| Admin/Payload | `apps/admin/src/__tests__/*.test.ts` | Jest (vanilla) |

After every feature: `npm run lint && npm run typecheck && npx turbo run test`

---

## 11. Role-Based Expertise Modes

When the user's request implies a specific discipline, adopt that lens while retaining full project context.

### As Product Manager
- Frame features against the core loop: Study → Rate → Schedule → Streak
- Validate scope: Does this belong in web, mobile, or both?
- Check: Is there a mock data flag (`appDataSource`) to gate the feature?
- Flag missing tests or documentation before implementation

### As System Design Engineer
- Data changes → update Convex schema in `packages/convex/convex/schema.ts`
- New content types → new Payload collection + sync endpoint + Convex upsert mutation
- Always think about Convex index strategy for new query patterns
- Content flows: Payload → sync → Convex → clients (never directly from clients to Payload)

### As Backend Engineer (Convex)
- Every new mutation: `requireAuth(ctx)` first
- Use `by_user` + `by_user_card` index patterns consistently
- SM-2 logic lives in `@repo/domain/logic/sm2.ts` — never re-implement in Convex
- Sync mutations: idempotent upserts using `patch()` not `insert()`
- HTTP sync actions: validate secret before processing

### As Frontend Engineer — Web
- Server Components by default. `'use client'` only when needed (interactivity, hooks)
- Every page exports `metadata` (title, description, OG)
- Content fetched in RSC via `src/lib/api/payload.ts`
- User data via `useQuery(api.*)` in client components
- Tailwind + CSS vars from `@repo/theme` — never raw hex/rgb values
- Sidebar state via `useSidebar()` from `SidebarContext`

### As Frontend Engineer — Mobile
- Screens in `src/screens/[screenName]/[ScreenName]Screen.tsx`
- Shared components (2+ consumers) → `src/shared/`
- Global hooks (3+ unrelated consumers) → `src/hooks/`
- Styling: `StyleSheet.create()` + scale utils only
- Animations: Reanimated shared values (not Animated API)

### As UI/UX Designer
- Use the accent system from `@repo/theme` — do not introduce new raw colors
- Dark/light must both work — test with `html[data-theme=dark]`
- Mobile tap targets: minimum 44×44pt
- Accessibility: contrast ratio AA minimum (`meetsContrastAA()`)
- Design tokens are the contract — theme package is the source of truth
- Figma sync available via `getPencilVars()` from `@repo/theme`

### As Code Reviewer
Apply all rules above. Flag:
- `any` types without justification
- Raw values instead of theme tokens
- Hardcoded strings instead of i18n keys
- Business logic inside components (belongs in domain or hooks)
- Missing `requireAuth` on Convex mutations
- Missing tests for new logic
- Relative `../../../` imports instead of `@/` or `@repo/*`
- `useEffect` doing data fetching (use Convex queries instead)

---

## 12. Common Task Playbooks

### Add a new web page
1. Create `src/app/(app)/[route]/page.tsx` — Server Component with `export const metadata`
2. Fetch content via `src/lib/api/payload.ts` if CMS-backed
3. Add `'use client'` child components for interactivity
4. Add route to Sidebar nav if user-facing
5. Write test in `apps/web/src/__tests__/`

### Add a new Convex mutation
1. Define in appropriate file under `packages/convex/convex/`
2. Start with `const user = await requireAuth(ctx)`
3. Add/verify index in `schema.ts` for new query patterns
4. Export from `packages/convex/index.ts` if needed by clients
5. Write test with `convex-test`

### Add a new content type
1. Create Payload collection in `apps/admin/src/collections/`
2. Add `afterChange` hook calling `syncToConvex()`
3. Add upsert mutation in `packages/convex/convex/sync.ts`
4. Add table to `packages/convex/convex/schema.ts`
5. Add domain types in `packages/domain/types/`
6. Add query in `packages/convex/convex/content.ts`

### Add a new domain type or logic function
1. Define type in `packages/domain/types/`
2. Export from `packages/domain/index.ts`
3. Write unit test in `packages/domain/__tests__/`
4. Run `cd packages/domain && npm test`

### Enhance UI on web
1. Check `@repo/theme` for existing tokens before adding new values
2. Check `src/components/ui/` for existing primitives (Radix-based)
3. Use Tailwind utilities mapped to CSS vars (`bg-background`, `text-foreground`, etc.)
4. Test dark + light modes + all accent variants
5. Add `testId` props for automation

### Add a mobile screen
1. Create `src/screens/[name]/[Name]Screen.tsx`
2. Add `components/` subfolder for screen-local components
3. Register route in `src/navigation/AppNavigator.tsx`
4. Type the route in `src/navigation/routes.ts`
5. Use `StyleSheet.create()` with scale utils from `constants.ts`

---

## 13. Hard Rules (Never Violate)

1. Never commit `.env` files
2. Never use raw hex/rgb in Tailwind or StyleSheet — use theme tokens
3. Never import React/Expo/Next.js in `packages/domain`
4. Never skip `requireAuth` on user-facing Convex mutations
5. Never hardcode API URLs or keys — use `@repo/config` env vars
6. Never use `any` without a comment explaining why
7. Never write business logic (SM-2, scoring, streak) outside `@repo/domain`
8. Never block on Payload→Convex sync errors (fire-and-forget)
9. Never use Redux or Zustand — Convex + local state only
10. Always run lint + typecheck + test before marking a feature complete
