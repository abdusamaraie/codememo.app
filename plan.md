# CodeMemo.app — MVP Implementation Plan

## Context

CodeMemo.app is a syntax memorization tool for experienced developers ("Anki meets Duolingo for code syntax"). The PRD specifies Convex + PayloadCMS + Next.js + React Native. This plan adapts the PRD to work with the `app-bootstrap` skill, which scaffolds a Turborepo monorepo with Expo, Next.js, PayloadCMS, and 10 shared packages. Ref codememo-mvp-prompt-and-prd.md only if need more context.

**Key adaptation decisions:**
- **Mobile styling**: Keep `StyleSheet.create()` (bootstrap convention) — do NOT adopt NativeWind
- **Dual backend**: PayloadCMS for content authoring, Convex for user-facing runtime data
- **Convex as shared package**: `packages/convex/` consumed by both web and mobile
- **Theme**: Add custom `purple` accent palette + JetBrains Mono font to existing theme system
- **SM-2 algorithm**: Pure TypeScript in `@repo/domain` (zero deps, testable, shared)

---

## Phase 0: Scaffold Project

**Run app-bootstrap skill** with:
- Target: `~/Developer/codememo` (or user's preferred location)
- Apps: `mobile,web,admin` (skip landing, waitlist, feedback)
- shadcn components: `button,card,navigation-menu,input,textarea,badge,progress,tabs,dropdown-menu,dialog,tooltip`

Post-scaffold:
- Set up Convex project (`npx convex dev` to initialize)
- Copy `apps/admin/.env.example` → `.env.local`, configure `DATABASE_URL` + `PAYLOAD_SECRET`
- Add `NEXT_PUBLIC_CONVEX_URL` to `apps/web/.env.local`

---

## Phase 1: Theme & Domain Foundation

### 1A. Customize Theme for CodeMemo

**Files to modify (in scaffolded project):**

| File | Change |
|------|--------|
| `packages/theme/tokens/primitives.ts` | Add `purple` color scale (50-950) based on `#7C6AF6`. Update `fonts.family.mono` to `'JetBrains Mono, monospace'` |
| `packages/tailwind-config/tailwind.config.ts` | Add `purple` palette to color tokens |
| `apps/web/src/app/globals.css` | Add `[data-accent="purple"]` block. Override `.dark` bg to `#0B0E14`, surface to `#12161F`, card to `#151A24`, border to `#1E2636` |
| `apps/web/src/app/layout.tsx` | Set `data-accent="purple"`, add `class="dark"` default, import JetBrains Mono from `next/font/google` |

**CodeMemo dark palette:**
```
Background:     #0B0E14    Surface:        #12161F
Card:           #151A24    Elevated:       #1A1F2B
Border:         #1E2636    Border Light:   #2A3349
Primary:        #7C6AF6    Primary Hover:  #8D7EFF
Success:        #34D399    Error:          #F87171
Warning:        #FBBF24    Accent Blue:    #38BDF8
Text Primary:   #E2E4EC    Text Secondary: #7B8199
Code BG:        #1E1E2E
```

### 1B. Define Domain Types & SM-2 Logic

**`packages/domain/` — new files:**

```
types/
  language.ts          # Language, LanguageSlug
  section.ts           # Section, SectionStatus (locked/available/in_progress/completed/mastered)
  flashcard.ts         # Flashcard, FlashcardFace, QuestionType
  exercise.ts          # Exercise, ExerciseType (5 types), ExerciseAttempt
  quiz.ts              # QuizResult, QuizAnswer
  user.ts              # User, AuthProvider (anonymous/email/github)
  progress.ts          # CardProgress, SM2Params, QualityRating (forgot/hard/good/nailed → 1/3/4/5)
  streak.ts            # StreakData, DailyGoal
constants/
  sm2-defaults.ts      # Default ease factor (2.5), min ease (1.3), initial intervals
  difficulty-levels.ts # beginner/intermediate/advanced
logic/
  sm2.ts               # Pure SM-2: calculateNextReview(quality, params) → SM2Params
  streak.ts            # calculateStreak(lastDate, today) → { current, isActive }
  scoring.ts           # calculateQuizScore(answers) → { score, passed, breakdown }
```

---

## Phase 2: Convex Backend

### 2A. Create `packages/convex/`

```
packages/convex/
  package.json         # "@repo/convex", depends on "convex", "@repo/domain"
  convex/
    schema.ts          # Full schema (see below)
    auth.ts            # createAnonymousUser, upgradeToEmail, upgradeToGitHub
    users.ts           # getUser, updateSettings
    content.ts         # listLanguages, getSection, getFlashcards, getExercises
    progress.ts        # getUserProgress, updateSectionProgress
    flashcards.ts      # getStudySession (due cards + new cards), recordReview
    spacedRepetition.ts   # SM-2 mutations using @repo/domain/logic/sm2
    streaks.ts         # updateStreak, getStreakData, checkDailyGoal
    exercises.ts       # recordExerciseAttempt
    quizzes.ts         # startQuiz, submitQuizAnswer, completeQuiz
    sync.ts            # HTTP action: receive Payload webhook, upsert content
    crons.ts           # Daily: reset todayCompleted, check streaks
    ai.ts              # Claude API action: getHint, explainFurther
  tsconfig.json
  eslint.config.mjs
```

**Schema tables:** `users`, `languages`, `sections`, `flashcards`, `exercises`, `cardProgress` (SM-2), `sectionProgress`, `streaks`, `studySessions`, `quizAttempts`

Each content table has a `payloadId` field + index for sync upserts.

### 2B. Wire Convex into Apps

- `apps/web`: Add `ConvexClientProvider` wrapping root layout
- `apps/mobile`: Add `ConvexProvider` wrapping App.tsx
- `turbo.json`: Add `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOY_KEY`, `ANTHROPIC_API_KEY` to `globalEnv`

---

## Phase 3: PayloadCMS Content Collections

**`apps/admin/src/collections/` — new files:**

| Collection | Key Fields | Hooks |
|-----------|------------|-------|
| `Languages.ts` | name, slug, icon (upload), description, color, order, isPublished | afterChange → sync to Convex |
| `Sections.ts` | title, slug, language (relationship), description, order, isPublished | afterChange → sync to Convex |
| `Flashcards.ts` | section (rel), question, questionType, answer, answerCode, explanation, hint, commonMistakes[], difficulty, tags[], order | afterChange → sync to Convex |
| `Exercises.ts` | section (rel), type (select), prompt, codeTemplate, options (json), correctAnswer (json), explanation, order | afterChange → sync to Convex |

**Sync endpoint:** `apps/admin/src/endpoints/sync-to-convex.ts` — POST to Convex HTTP action with shared secret auth.

Register all in `apps/admin/src/payload.config.ts`.

---

## Phase 4: Web App — Dashboard & Navigation

**Route structure (`apps/web/src/app/`):**

```
(app)/
  layout.tsx                    # 3-column layout: sidebar + main + aside
  page.tsx                      # Dashboard (redirect or inline)
  dashboard/page.tsx            # Language cards grid, study calendar, greeting
  path/[language]/page.tsx      # Section list (vertical node path)
  study/[language]/[section]/page.tsx  # Flashcard study mode (full-screen overlay)
  practice/[language]/[section]/page.tsx  # Exercise practice
  quiz/[language]/[section]/page.tsx     # Section quiz
  assessment/[language]/page.tsx         # Final assessment
  settings/page.tsx             # User preferences
```

**Key components:**

```
components/
  layout/
    Sidebar.tsx                 # 220px fixed, nav items, Quick Study CTA
    RightAside.tsx              # 280px, streak/stats, daily goals, create account card
  dashboard/
    LanguagePathCard.tsx        # Color accent, progress bar, continue CTA
    StudyCalendar.tsx           # GitHub contribution graph style
    DailyGoals.tsx              # 3 progress bars
    StreakDisplay.tsx            # Flame icon + count
  flashcard/
    FlashcardDeck.tsx           # Card container, manages flip state + navigation
    FlashcardFront.tsx          # Prompt, code textarea, hint toggle, confidence buttons
    FlashcardBack.tsx           # Answer code block, user answer comparison, explanation, rating
    CardFlipAnimation.tsx       # 3D CSS rotateY(180deg), 0.65s cubic-bezier
    CodeTextarea.tsx            # Monospace, dark bg, tab→2 spaces, border glow
    ConfidenceRating.tsx        # Forgot/Hard/Good/Nailed buttons with color coding
    StudyProgressBar.tsx        # Slim gradient bar, card N of total
  path/
    SectionCard.tsx             # Status icon, mastery indicator, lock state
    SectionNodePath.tsx         # Vertical scrolling section list
```

---

## Phase 5: Flashcard Study Mode (Core)

This is the heart of the product — build and polish before anything else.

1. **FlashcardDeck** — Full-screen overlay, manages card index + flip state
2. **Front side** — PROMPT badge, question text, CodeTextarea for typing answer, hint toggle (yellow alert box), "Reveal answer" button, greyed confidence labels
3. **Back side** — ANSWER badge, syntax-highlighted correct answer (green border), user's answer (muted), explanation, full confidence rating buttons (Forgot=red, Hard=yellow, Good=blue, Nailed=green)
4. **3D flip animation** — `transform-style: preserve-3d`, `rotateY(180deg)`, `0.65s cubic-bezier(0.4, 0, 0.2, 1)`
5. **SM-2 integration** — On confidence rating: map to quality (1/3/4/5), call Convex mutation with `@repo/domain` SM-2 logic, auto-advance after 400ms
6. **Study session** — Interleave due review cards with new cards, track session in Convex

---

## Phase 6: Exercises & Quizzes

**Exercise components (`components/exercises/`):**

| Component | Type | Interaction |
|-----------|------|-------------|
| `FillBlank.tsx` | fill_blank | Inline input fields within code block |
| `MultipleChoice.tsx` | multiple_choice | Radio/checkbox with code options |
| `SpotError.tsx` | spot_error | Code display + textarea for corrected version |
| `ArrangeCode.tsx` | arrange_code | Drag-and-drop code lines (@dnd-kit) |
| `TranslateCode.tsx` | translate | Source code display + textarea for translation |

**Quiz flow:**
- 10-15 questions from section pool, mixed exercise types
- Optional timer (30s/60s/unlimited)
- No hints during quiz
- 80% pass threshold
- Results: score, breakdown, "Review Mistakes" button

---

## Phase 7: Streaks & Gamification

- **Streak tracking** — Convex mutation on each study action, cron job for daily reset
- **Study calendar** — GitHub contribution graph using study session data
- **Daily goals** — 3 configurable targets (cards, perfect recalls, minutes)
- **Streak freeze** — 1 free per week, stored in streaks table
- **Create Account nudge** — Shown in right aside for anonymous users, triggered after first section or 2nd day

---

## Phase 8: AI Integration (Claude API)

- **Convex action** `ai.ts` — Calls Claude API via Anthropic SDK
- **Progressive hints** — "Show Hint" → curated hint first, "AI Hint" → Claude generates contextual hint
- **Explain Further** — After card flip, Claude compares syntax across languages user knows
- **Error Analysis** — For spot-the-error exercises, Claude explains why user's fix is wrong
- **Rate limit** — 20 AI requests per user per day (tracked in Convex)

---

## Phase 9: Mobile Companion App

**Screens (`apps/mobile/src/screens/`):**

```
home/HomeScreen.tsx              # Dashboard: streak, daily goal, language cards
languages/LanguagesScreen.tsx    # Language picker
sections/SectionListScreen.tsx   # Section list for a language
study/FlashcardScreen.tsx        # Flashcard study with swipe gestures
profile/ProfileScreen.tsx        # Settings, preferences
```

**Mobile-specific:**
- Swipe left/right for card nav, swipe up to flip (react-native-gesture-handler)
- 3D flip via react-native-reanimated (`withTiming` + `rotateY` interpolation)
- Haptic feedback on flip + rating (expo-haptics)
- Push notifications (expo-notifications) for daily reminders
- Offline: cache current section's cards in expo-sqlite
- Bottom tab nav: Home | Study | Progress | Settings
- JetBrains Mono loaded via `useFonts` in App.tsx

**NOT in mobile MVP:** Quizzes, exercises, final assessments, account management.

---

## Phase 10: Content Seeding

1. **Python** — All 14 sections, ~150 flashcards, ~50 exercises (fully built out)
2. **JavaScript (ES6+)** — All sections, ~150 flashcards, ~50 exercises
3. Seed via PayloadCMS admin UI or bulk import script
4. Content syncs to Convex via webhook pipeline

---

## Verification Plan

1. **Unit tests** — SM-2 algorithm edge cases in `@repo/domain` (first review, failed after streak, ease floor)
2. **Convex function tests** — Review scheduling, streak calculation, quiz scoring
3. **Web E2E** — Dashboard loads < 1s, flashcard flip is 60fps, study session completes end-to-end
4. **Mobile** — Swipe gestures, offline flashcard review, push notification receipt
5. **Content sync** — Create flashcard in PayloadCMS → appears in web/mobile within seconds
6. **Auth flow** — Anonymous → study → prompted to sign up → progress merges correctly
7. **Run checks** — `npm run lint && npm run typecheck && npm test` passes across all packages

---

## Environment Variables Summary

```
# turbo.json globalEnv additions:
NEXT_PUBLIC_CONVEX_URL, CONVEX_DEPLOY_KEY, ANTHROPIC_API_KEY, CONVEX_SYNC_SECRET

# apps/web/.env.local
NEXT_PUBLIC_CONVEX_URL=

# apps/admin/.env.local
DATABASE_URL=
PAYLOAD_SECRET=
CONVEX_URL=
CONVEX_SYNC_SECRET=

# apps/mobile (app.config.js)
EXPO_PUBLIC_CONVEX_URL=
```
