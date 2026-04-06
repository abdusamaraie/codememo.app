# CodeMemo.app — MVP Build Prompt & Product Requirements Document

---

## PART 1: AI AGENT BUILD PROMPT

---

### System Context

You are a senior full-stack engineer building the MVP for **CodeMemo.app** — a web and mobile application that helps experienced developers memorize programming language syntax through scientifically-backed learning techniques. This is NOT a "learn to code" platform. Users already know how to program. CodeMemo exists to drill syntax into long-term memory when switching between languages.

Think of it as **Anki meets Duolingo, but laser-focused on code syntax recall**.

---

### Product Vision

CodeMemo.app helps developers who work across multiple languages rapidly internalize the syntax of a new language. The core insight: experienced developers don't need to understand *what* a for-loop is — they need to stop Googling "python for loop syntax" vs "go for loop syntax" vs "rust for loop syntax" every time they switch contexts.

The app uses **spaced repetition** (SM-2 algorithm), **active recall via flashcards**, **varied exercise types**, and **structured learning paths** to move syntax from short-term to long-term memory.

**App Name:** CodeMemo.app
**Tagline:** "Stop Googling syntax. Start remembering it."

---

### Tech Stack (Non-Negotiable)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Web Frontend | **Next.js 14+ (App Router)** | Dashboard, learning UI, SSR/SSG |
| Styling | **Tailwind CSS** | Utility-first, clean minimal design |
| Backend / Database | **Convex** | Real-time backend, DB, serverless functions, scheduling |
| CMS | **PayloadCMS** | Curated flashcard/quiz content authoring |
| Mobile | **React Native + NativeWind** | Cross-platform iOS/Android companion |
| AI Layer | **Claude API (Anthropic)** | Hints, explanations, adaptive feedback |

---

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     PayloadCMS                          │
│  (Content authors create/edit flashcards, quizzes,      │
│   paths, and language curricula)                        │
└────────────────────┬────────────────────────────────────┘
                     │ Sync / Seed
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Convex Backend                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐    │
│  │ Users &  │ │ Content  │ │ Progress & Spaced    │    │
│  │ Sessions │ │ Store    │ │ Repetition Engine    │    │
│  └──────────┘ └──────────┘ └──────────────────────┘    │
│  ┌──────────┐ ┌──────────────────────────────────┐     │
│  │ Streaks  │ │ Cron Jobs (streak checks,        │     │
│  │ & Stats  │ │ reminders, SR scheduling)        │     │
│  └──────────┘ └──────────────────────────────────┘     │
└──────┬────────────────────────────────┬─────────────────┘
       │                                │
       ▼                                ▼
┌──────────────┐               ┌────────────────┐
│  Next.js Web │               │ React Native   │
│  (Dashboard, │               │ Mobile App     │
│   Learning   │               │ (NativeWind)   │
│   Interface) │               │                │
└──────────────┘               └────────────────┘
       │
       ▼
┌──────────────┐
│  Claude API  │
│  (Hints,     │
│  explanations│
│  on-demand)  │
└──────────────┘
```

---

### Target User Profile

- **Who:** Experienced developers (2+ years) who already know at least one language
- **Problem:** They constantly context-switch between languages and waste time re-Googling syntax
- **Behavior:** They want fast, focused study sessions (5–15 minutes), not long tutorials
- **Expectation:** Clean UI, no hand-holding, code-first interface, dark mode by default

---

### Authentication & User Model

**MVP approach: Anonymous-first with optional sign-up.**

- On first visit, generate a local anonymous session. All progress is stored locally + synced to Convex with an anonymous user ID.
- Prompt to create an account (email or GitHub OAuth) when the user:
  - Completes their first concept section
  - Returns for a 2nd day (streak trigger)
  - Tries to access progress from another device
- On sign-up, merge anonymous progress into the authenticated account.
- Synced progress across web and mobile once authenticated.

---

### Monetization

**Free for MVP.** No paywalls, no gated content. All languages and features are accessible. Monetization will be layered in later (likely freemium with premium language packs or pro features). Build the data model to support future gating (add a `tier` field to language paths and a `subscription` field to user records) but do not implement any payment logic.

---

## Core Features — Detailed Specifications

---

### 1. Dashboard (Home Screen)

**Route:** `/dashboard`

The dashboard is the central hub. It must feel fast, clean, and motivating — like opening a well-designed dev tool, not a children's learning app.

**Layout: 3-Column (Left Nav + Main Content + Right Aside)**

Inspired by Coddy's layout pattern — a persistent sidebar, scrollable main content area, and a utility aside.

**Left Sidebar (220px fixed):**
- CodeMemo logo + wordmark at top
- Navigation items (vertical): Dashboard, Paths, Stats, Settings
- Active item: highlighted background with left accent border
- Bottom CTA: "Quick Study" button (gradient primary)
- Sidebar is persistent across all views

**Main Content (fluid center):**
- Grid of **Language Path Cards** (3-column grid on desktop)
- Each card shows:
  - Color accent line at top (language-specific color)
  - Language icon/logo (e.g., 🐍 Python, ⚡ JavaScript)
  - Language name
  - Progress bar with percentage
  - Sections completed count (e.g., "6 / 14 concepts")
  - "Continue →" or "Start →" CTA
- Below language cards: **Study Activity Calendar** (GitHub contribution graph style)
- Greeting header with due-card count: "You have 12 cards due for review today"

**Right Aside (280px fixed):**
- **Streak & Stats Row:** flame icon + streak count, gems, XP — top of aside
- **Create Account Card:** Since MVP is anonymous-first, this card says "Save your progress — Create a free account to sync progress across devices and keep your streak alive." with a "Create Account" button (outlined style, not filled — low pressure CTA)
- **Daily Goals Card:** 3 progress bars — "Complete 5 cards" / "Get 2 perfect recalls" / "Study for 10 min" with current/total counters
- **Leaderboard Teaser:** "Complete 10 cards to unlock leaderboards" (locked state)
- **Ad Placement (Reserved):** Dashed-border placeholder box labeled "Ad Placement — Reserved for future use". This is a visual placeholder only — no ad logic in MVP.

**Design principles:**
- Dark mode by default (with light mode toggle)
- Monospace font for code: `JetBrains Mono` or `Fira Code`
- Sans-serif for UI text: `Nunito` or similar (avoid Inter/Roboto)
- Card-based layout with subtle hover animations and color accent lines
- No unnecessary decoration — every element earns its pixel
- Background uses subtle radial gradients for depth (not flat black)

**MVP Languages (2–3):**
1. **Python** — fully built out
2. **JavaScript (ES6+)** — fully built out
3. **TypeScript** or **Go** — choose based on content readiness

---

### 2. Language Path (Learning Path View)

**Route:** `/path/[language]` (e.g., `/path/python`)

A structured, linear sequence of **concept sections** that the user works through. Each section focuses on one syntax topic.

**Concept Sections for Python (example curriculum):**

| Order | Section | Cards (approx.) |
|-------|---------|-----------------|
| 1 | Variables & Data Types | 12 |
| 2 | Strings & String Methods | 15 |
| 3 | Operators (arithmetic, comparison, logical) | 10 |
| 4 | Conditionals (if / elif / else) | 8 |
| 5 | Lists & Tuples | 14 |
| 6 | Dictionaries & Sets | 12 |
| 7 | For Loops | 10 |
| 8 | While Loops | 8 |
| 9 | Functions (def, args, kwargs, return) | 15 |
| 10 | List Comprehensions | 8 |
| 11 | Error Handling (try/except) | 10 |
| 12 | File I/O | 8 |
| 13 | Classes & OOP Basics | 15 |
| 14 | Modules & Imports | 8 |

**Path View UI:**
- Vertical scrolling list of section cards (Duolingo-style node path is acceptable but keep it clean)
- Each section card shows:
  - Section name
  - Icon representing topic
  - Status: Locked / Available / In Progress / Completed / Mastered
  - Mastery indicator (e.g., 3/5 stars or a ring fill)
- Sections unlock linearly (complete section N to unlock section N+1)
- After each section's flashcards are completed → **Section Quiz** unlocks
- After ALL sections are completed → **Final Assessment** unlocks

---

### 3. Flashcard Study Mode (Core Learning Engine)

**Route:** `/study/[language]/[section]`

This is the heart of the app. The flashcard experience must be smooth, satisfying, and optimized for rapid recall practice.

**Card Structure (Data Model):**

```typescript
interface Flashcard {
  id: string;
  languageId: string;
  sectionId: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";

  // Front of card
  question: string;           // e.g., "How do you define a function in Python?"
  questionType: "recall" | "syntax"; // What kind of answer expected
  concept: string;            // e.g., "functions"
  tags: string[];             // e.g., ["def", "arguments", "return"]

  // Back of card
  answer: string;             // The correct syntax, e.g., "def function_name(params):"
  answerCode: string;         // Formatted code block for display
  explanation: string;        // Brief explanation of WHY this syntax works this way

  // Metadata
  hint: string;               // Shown when user clicks "Show Hint"
  commonMistakes: string[];   // e.g., ["Forgetting the colon at the end"]
}
```

**User Progress Per Card (Spaced Repetition):**

```typescript
interface CardProgress {
  cardId: string;
  userId: string;
  easeFactor: number;        // SM-2 ease factor (default 2.5)
  interval: number;          // Days until next review
  repetitions: number;       // Number of successful recalls
  nextReviewDate: Date;
  lastReviewDate: Date;
  quality: number;           // Last self-rated quality (0-5)
  status: "new" | "learning" | "review" | "mastered";
}
```

**Flashcard UI — Study Flow (Full-Screen Overlay):**

The flashcard study mode takes over the full screen (not embedded in the 3-column layout). This creates focused, distraction-free study sessions.

**Top Bar (persistent during study):**
- ✕ Close button (left) — returns to path view
- Progress bar (center, full width) — slim gradient bar showing card N of total
- Section dropdown (right) — shows current section name (e.g., "VARIABLES") with dropdown to switch

1. **Card appears front-facing** centered on screen, with the following layout inside the card:
   - Top-right corner: "↻ Reset" and "Quiz Mode →" buttons
   - **"PROMPT" label** (small, uppercase, purple badge)
   - **Question text** — large, bold (20px), clear prompt (e.g., "Declare a constant named PI with value 3.14159.")
   - **"Type it from memory" label** with two icon buttons to the right:
     - 💬 Comment/notes icon
     - 💡 Hint icon — toggles hint display
   - **Hint display** (shown when hint icon clicked): yellow-tinted alert box with the hint text, animated in
   - **Code textarea** where the user types their answer from memory:
     - Monospace font (`JetBrains Mono`)
     - Dark background (code editor feel)
     - Tab key inserts 2 spaces (not focus change)
     - Placeholder: "Write your answer here..."
     - Subtle border glow on focus (purple tint)
   - **Bottom row of the card:**
     - Left: **"👁 Reveal answer"** button — flips the card with a 3D CSS animation
     - Right: **Confidence labels** (greyed out, subtle): "Forgot" / "Hard" / "Good" / "Nailed" — clicking any of these also flips the card AND records the self-rating

2. **Card flips with a smooth 3D CSS animation** (Y-axis rotation, ~0.65s cubic-bezier, preserve-3d).

3. **Back of card shows:**
   - **"ANSWER" label** (small, uppercase, green badge)
   - ✅ **Correct answer** — syntax-highlighted code block on dark background with green text and green border accent
   - 📝 **User's answer** — displayed in muted style for self-comparison (if they typed something)
   - 💬 **Explanation** — 1–2 sentence explanation with inline code styling
   - **"How well did you remember?"** — Confidence rating buttons (full-width, 4 columns):
     - 😞 Forgot (red) / 😐 Hard (yellow) / 🙂 Good (blue) / 😎 Nailed (green)
     - Selected state: colored border + tinted background
     - Clicking a rating auto-advances to next card after 400ms delay

4. **Bottom navigation bar (persistent):**
   - Left: **"← Prev"** button (text only, disabled on first card)
   - Center: **Concept label** in monospace, uppercase (e.g., "CONST-DECLARATION")
   - Right: **"Next →"** button (gradient primary, pill shape with shadow)

**Spaced Repetition Self-Assessment Mapping:**
- "Forgot" → quality: 1 — resets interval
- "Hard" → quality: 3 — shorter interval
- "Good" → quality: 4 — normal interval progression
- "Nailed" → quality: 5 — longer interval, accelerated mastery
- These map directly to SM-2 algorithm inputs

**Spaced Repetition Implementation (SM-2 Algorithm):**

```
After each review, calculate new interval:
- If quality < 3: reset repetitions to 0, interval to 1 day
- If quality >= 3:
  - If repetitions == 0: interval = 1
  - If repetitions == 1: interval = 6
  - Else: interval = previous_interval × easeFactor
- New easeFactor = old + (0.1 - (5 - quality) × (0.08 + (5 - quality) × 0.02))
- easeFactor minimum: 1.3
```

Cards due for review are prioritized. New cards are interleaved with review cards in a session.

---

### 4. Exercise Types (Varied Practice Modes)

**Route:** `/practice/[language]/[section]`

In addition to flashcards, each section includes varied exercise types inspired by Duolingo and evidence-based learning research. These appear mixed into study sessions and in quizzes.

**Exercise Type A: Fill in the Blanks**

```
Complete the code:

  for ___ in range(___):
      print(___)

Context: Print numbers 0 through 4
```

- User fills in each blank (inline input fields within a code block)
- Blanks are strategically placed to test syntax recall, not logic
- Immediate feedback on submit: correct blanks turn green, incorrect turn red with correct answer shown

**Exercise Type B: Multiple Choice / Select from List**

```
Which is the correct way to define a dictionary in Python?

  A) dict = [key: value]
  B) dict = {key: value}
  C) dict = (key: value)
  D) dict = <key: value>
```

- Single-select or multi-select depending on question
- Options should include plausible wrong syntax from other languages (this is key for the target audience — the confusion is cross-language)
- Correct answer highlights green, wrong answer shows red with explanation

**Exercise Type C: Spot the Error**

```
Find and fix the syntax error:

  def greet(name)
      return f"Hello, {name}!"
```

- User identifies the error and types the corrected version
- Common errors: missing colons, wrong brackets, incorrect keywords, semicolons in Python, etc.
- Errors should reflect real cross-language confusion

**Exercise Type D: Arrange the Code (Drag and Drop)**

```
Arrange these lines to create a valid for loop:

  [ print(item) ]  [ for item in my_list: ]  [ my_list = [1, 2, 3] ]
```

- Drag-and-drop code lines into correct order
- Tests understanding of syntax structure and ordering rules

**Exercise Type E: Translate Between Languages (Advanced)**

```
Translate this JavaScript to Python:

  const numbers = [1, 2, 3];
  numbers.forEach(num => console.log(num));
```

- User writes the equivalent in the target language
- Not auto-graded (self-assessment like flashcards)
- Powerful for the target audience who already knows one language

---

### 5. Section Quiz

**Route:** `/quiz/[language]/[section]`

Triggered after completing all flashcards in a section. Tests retention of that specific concept.

**Structure:**
- 10–15 questions drawn from the section's flashcard pool
- Mixed exercise types (fill-in-the-blank, multiple choice, spot the error)
- Timer per question (optional, configurable: 30s / 60s / unlimited)
- No hints available during quiz
- Scoring: percentage correct
- Pass threshold: 80% to mark section as "Completed"
- Below 80%: section marked as "Needs Review," user prompted to re-study weak cards
- Results screen shows:
  - Score with visual feedback (confetti animation for 100%)
  - Breakdown of which cards were missed
  - "Review Mistakes" button → takes user back to just the missed cards in flashcard mode

---

### 6. Final Assessment (Path Completion Test)

**Route:** `/assessment/[language]`

Available after ALL sections in a language path are completed (quiz passed for each).

**Structure:**
- 30–50 questions covering all sections
- Weighted toward sections the user struggled with (using SR data)
- Mixed exercise types with higher difficulty
- Timed (configurable)
- Comprehensive results dashboard:
  - Overall score
  - Per-section breakdown
  - Weakest areas identified
  - "Mastery Certificate" visual (shareable, motivational)
  - Recommendations for continued review schedule

---

### 7. Streak & Motivation System

**Streak tracking:**
- A "day" counts if the user completes at least one study session (minimum 5 cards reviewed)
- Streak counter displayed prominently on dashboard
- Streak freeze: user gets 1 free freeze per week (miss a day without losing streak)
- Visual streak calendar (GitHub contribution graph style)

**Daily reminders:**
- Push notifications (mobile) and email reminders (optional)
- Configurable time of day
- Smart reminders: "You have 12 cards due for review today"
- Streak-at-risk notifications: "Don't lose your 15-day streak! Study 5 cards to keep it going."

**Progress tracking:**
- Cards mastered count
- Total review time
- Current longest streak
- Languages in progress
- Mastery percentage per language

---

### 8. AI-Powered Features (Claude API Integration)

Claude should enhance, not replace, the curated content. Use sparingly and intentionally.

**Hint Generation:**
- When user clicks "Show Hint," if the curated hint isn't sufficient, offer an AI-generated progressive hint
- Prompt pattern: "Give a brief, progressive hint for this Python syntax question without revealing the answer: [question]. The user is an experienced developer learning Python syntax."

**Explanation Enhancement:**
- After card flip, offer a "Explain Further" button
- Claude provides a contextual explanation comparing the syntax to other languages the user knows
- Example: "In Python, you use `def` to define functions, similar to `function` in JavaScript or `func` in Go."

**Error Analysis (for Spot the Error exercises):**
- If user's fix is wrong, Claude explains why their fix doesn't work and guides toward the correct syntax

**Do NOT use AI for:**
- Auto-grading free-text answers (too unreliable for syntax precision)
- Generating flashcard content on-the-fly (quality control issue)
- Any core learning path logic

---

## Data Model (Convex Schema)

```typescript
// schema.ts (Convex)

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Users ---
  users: defineTable({
    anonymousId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    authProvider: v.optional(v.union(
      v.literal("email"),
      v.literal("github")
    )),
    isAnonymous: v.boolean(),
    settings: v.object({
      darkMode: v.boolean(),
      dailyReminderTime: v.optional(v.string()),
      reminderEnabled: v.boolean(),
      sessionGoal: v.number(), // cards per session target
    }),
    tier: v.optional(v.string()), // future monetization
    createdAt: v.number(),
  }).index("by_anonymousId", ["anonymousId"])
    .index("by_email", ["email"]),

  // --- Languages ---
  languages: defineTable({
    slug: v.string(),              // "python", "javascript"
    name: v.string(),              // "Python"
    icon: v.string(),              // URL or icon identifier
    description: v.string(),
    totalSections: v.number(),
    totalCards: v.number(),
    order: v.number(),
    isActive: v.boolean(),
    tier: v.optional(v.string()),  // future gating
  }).index("by_slug", ["slug"]),

  // --- Sections ---
  sections: defineTable({
    languageId: v.id("languages"),
    slug: v.string(),
    name: v.string(),              // "Variables & Data Types"
    description: v.string(),
    order: v.number(),
    totalCards: v.number(),
    icon: v.optional(v.string()),
  }).index("by_language", ["languageId"])
    .index("by_language_order", ["languageId", "order"]),

  // --- Flashcards ---
  flashcards: defineTable({
    sectionId: v.id("sections"),
    languageId: v.id("languages"),
    order: v.number(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    question: v.string(),
    questionType: v.union(v.literal("recall"), v.literal("syntax")),
    concept: v.string(),
    tags: v.array(v.string()),
    answer: v.string(),
    answerCode: v.string(),
    explanation: v.string(),
    hint: v.string(),
    hintProgressive: v.optional(v.array(v.string())), // multiple hint levels
    commonMistakes: v.array(v.string()),
  }).index("by_section", ["sectionId"])
    .index("by_language", ["languageId"]),

  // --- Exercises (Non-Flashcard) ---
  exercises: defineTable({
    sectionId: v.id("sections"),
    languageId: v.id("languages"),
    type: v.union(
      v.literal("fill_blank"),
      v.literal("multiple_choice"),
      v.literal("spot_error"),
      v.literal("arrange_code"),
      v.literal("translate")
    ),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    prompt: v.string(),
    codeTemplate: v.optional(v.string()),  // for fill-in-blank
    blanks: v.optional(v.array(v.object({
      position: v.number(),
      answer: v.string(),
    }))),
    options: v.optional(v.array(v.object({ // for multiple choice
      text: v.string(),
      isCorrect: v.boolean(),
    }))),
    correctCode: v.optional(v.string()),    // for spot-error, arrange
    explanation: v.string(),
    order: v.number(),
  }).index("by_section", ["sectionId"]),

  // --- User Progress (Spaced Repetition) ---
  cardProgress: defineTable({
    userId: v.id("users"),
    cardId: v.id("flashcards"),
    easeFactor: v.number(),
    interval: v.number(),
    repetitions: v.number(),
    nextReviewDate: v.number(),
    lastReviewDate: v.number(),
    quality: v.number(),
    status: v.union(
      v.literal("new"),
      v.literal("learning"),
      v.literal("review"),
      v.literal("mastered")
    ),
  }).index("by_user", ["userId"])
    .index("by_user_card", ["userId", "cardId"])
    .index("by_user_next_review", ["userId", "nextReviewDate"]),

  // --- Section Progress ---
  sectionProgress: defineTable({
    userId: v.id("users"),
    sectionId: v.id("sections"),
    languageId: v.id("languages"),
    cardsCompleted: v.number(),
    cardsTotal: v.number(),
    quizScore: v.optional(v.number()),
    quizPassed: v.boolean(),
    status: v.union(
      v.literal("locked"),
      v.literal("available"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("mastered")
    ),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  }).index("by_user_language", ["userId", "languageId"])
    .index("by_user_section", ["userId", "sectionId"]),

  // --- Streaks ---
  streaks: defineTable({
    userId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastStudyDate: v.string(),     // ISO date string "2025-03-09"
    freezesRemaining: v.number(),
    freezeUsedThisWeek: v.boolean(),
    studyHistory: v.array(v.object({
      date: v.string(),
      cardsReviewed: v.number(),
      minutesStudied: v.number(),
    })),
  }).index("by_user", ["userId"]),

  // --- Quiz Attempts ---
  quizAttempts: defineTable({
    userId: v.id("users"),
    sectionId: v.optional(v.id("sections")),
    languageId: v.id("languages"),
    type: v.union(
      v.literal("section_quiz"),
      v.literal("final_assessment")
    ),
    score: v.number(),
    totalQuestions: v.number(),
    passed: v.boolean(),
    answers: v.array(v.object({
      questionId: v.string(),
      userAnswer: v.string(),
      correct: v.boolean(),
    })),
    completedAt: v.number(),
    durationSeconds: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_section", ["userId", "sectionId"]),
});
```

---

## UI/UX Specifications

### Design System

```
Colors (Dark Mode — Default):
  Background:        #0B0E14 (deep dark — not pure black)
  Surface:           #12161F (sidebar, aside backgrounds)
  Card:              #151A24 (card backgrounds)
  Elevated:          #1A1F2B (hover states, modals, inputs)
  Border:            #1E2636 (subtle borders)
  Border Light:      #2A3349 (interactive borders, card outlines)
  Primary:           #7C6AF6 (purple — main accent, buttons, badges)
  Primary Hover:     #8D7EFF
  Primary Muted:     rgba(124,106,246,0.12) (badges, active nav bg)
  Primary Glow:      rgba(124,106,246,0.25) (button shadows, current node)
  Success:           #34D399 (correct answers, completion, "Nailed")
  Error:             #F87171 (wrong answers, "Forgot")
  Warning:           #FBBF24 (hints, streaks, "Hard")
  Accent Blue:       #38BDF8 (Python accent, "Good")
  Accent Yellow:     #FACC15 (JavaScript accent)
  Accent Cyan:       #06B6D4 (TypeScript accent)
  Text Primary:      #E2E4EC
  Text Secondary:    #7B8199
  Text Muted:        #505672
  Code Background:   #1E1E2E (textarea, code blocks)

Colors (Light Mode):
  Background:        #F8F9FC
  Surface:           #FFFFFF
  Primary:           #5B4CD8
  Text Primary:      #1A1D27
  (derive remaining from dark mode inversions)

Typography:
  UI Font:    Nunito (300, 400, 500, 600, 700) — avoids generic Inter/Roboto
  Code Font:  JetBrains Mono (400, 500, 600)
  Sizes:      11px labels, 12px small text, 13px body, 14-15px card text, 18-20px headings, 24px page titles

Spacing:
  Base unit: 4px
  Component padding: 16px
  Card padding: 20-28px
  Section gaps: 32px
  Sidebar width: 220px
  Right aside width: 280px

Border Radius:
  Cards/panels: 12px
  Buttons/inputs: 8px
  Badges/pills: 20px
  Small elements: 6px

Animations:
  Card flip:       0.65s cubic-bezier(0.4, 0, 0.2, 1), 3D rotateY(180deg), preserve-3d
  Button hover:    0.15s ease, translateY(-1px) + box-shadow increase
  Page transitions: 0.4s ease, fadeIn (opacity + translateY)
  Slide in:        0.4s ease, slideInLeft (opacity + translateX)
  Progress bars:   0.6s ease, width transition
  Node float:      2.5s ease-in-out infinite, translateY(-3px) on current node
  Hint reveal:     0.2s ease fadeIn
  Pulse glow:      box-shadow animation on active/current elements
  Auto-advance:    400ms delay after confidence rating before next card

Background Effects:
  Subtle radial gradients on flashcard view for depth:
  - radial-gradient(ellipse at 20% 50%, primary 8% opacity, transparent)
  - radial-gradient(ellipse at 80% 80%, cyan 6% opacity, transparent)
```

### Key Screen Wireframes (Textual)

**Dashboard Layout (3-Column):**
```
┌──────────┬───────────────────────────────────────┬──────────────┐
│ 🔲 Code  │  Good evening 👋                      │ 🔥 15  💎 0  │
│   Memo   │  You have 12 cards due for review     │   ⚡ 84      │
│          │                                       │              │
│ ■ Dashbd │  YOUR LEARNING PATHS                  │ ┌──────────┐ │
│ ○ Paths  │  ┌────────┐ ┌────────┐ ┌────────┐   │ │ 👤 Save  │ │
│ ○ Stats  │  │🐍 Pyth │ │⚡ JS   │ │🔷 TS   │   │ │ progress │ │
│ ○ Settngs│  │████░░  │ │██░░░░  │ │🔒 Soon │   │ │[Create  ]│ │
│          │  │42% 6/14│ │15% 2/14│ │        │   │ └──────────┘ │
│          │  │Continu→│ │Continu→│ │        │   │              │
│          │  └────────┘ └────────┘ └────────┘   │ ┌──────────┐ │
│          │                                       │ │Daily Goals│ │
│          │  STUDY ACTIVITY                       │ │■■■░ 2/5  │ │
│          │  ┌───────────────────────────────┐   │ │■░░░ 0/2  │ │
│          │  │ ░▓░░▓▓░░▓░▓▓░▓░░░▓░▓▓░▓░▓▓ │   │ │■■░░ 3/10 │ │
│          │  │ ▓▓░▓░▓▓▓░▓░░▓▓░▓░▓▓▓░░▓░▓▓ │   │ └──────────┘ │
│          │  │ ░░▓▓░▓░▓▓▓░░▓▓░▓▓░▓░▓▓░░▓▓ │   │              │
│          │  └───────────────────────────────┘   │ ┌──────────┐ │
│          │                                       │ │Leaderboard│
│          │                                       │ │🏆 10 cards│ │
│          │                                       │ │to unlock  │ │
│          │                                       │ └──────────┘ │
│          │                                       │              │
│ ┌──────┐ │                                       │ ┌╌╌╌╌╌╌╌╌╌┐ │
│ │Quick │ │                                       │ ╎  AD      ╎ │
│ │Study │ │                                       │ ╎PLACEMENT ╎ │
│ └──────┘ │                                       │ └╌╌╌╌╌╌╌╌╌┘ │
└──────────┴───────────────────────────────────────┴──────────────┘
```

**Flashcard Study Screen (Full-Screen Overlay):**
```
┌─────────────────────────────────────────────────┐
│  ✕       ▓▓▓▓▓░░░░░░░░░░░░░░░  20%   VARIABLES │
├─────────────────────────────────────────────────┤
│                                                 │
│        ┌───────────────────────────────┐        │
│        │  ↻ Reset          Quiz Mode →  │        │
│        │                                 │        │
│        │  PROMPT                         │        │
│        │  Declare a constant named PI    │        │
│        │  with value 3.14159.            │        │
│        │                                 │        │
│        │  Type it from memory     💬 💡  │        │
│        │  ┌───────────────────────────┐  │        │
│        │  │ Write your answer here... │  │        │
│        │  │                           │  │        │
│        │  │                           │  │        │
│        │  └───────────────────────────┘  │        │
│        │                                 │        │
│        │  [👁 Reveal answer]             │        │
│        │              Forgot Hard Good Nailed     │
│        └───────────────────────────────┘        │
│                                                 │
├─────────────────────────────────────────────────┤
│  ← Prev       CONST-DECLARATION      [Next →]  │
└─────────────────────────────────────────────────┘
```

**Card Flipped (Answer Side):**
```
┌─────────────────────────────────────────────────┐
│  ✕       ▓▓▓▓▓░░░░░░░░░░░░░░░  20%   VARIABLES │
├─────────────────────────────────────────────────┤
│                                                 │
│        ┌───────────────────────────────┐        │
│        │  ANSWER                        │        │
│        │  ┌───────────────────────────┐  │        │
│        │  │ const PI = 3.14159;       │  │        │
│        │  └───────────────────────────┘  │        │
│        │                                 │        │
│        │  Your answer:                   │        │
│        │  ┌───────────────────────────┐  │        │
│        │  │ const PI = 3.14159        │  │        │
│        │  └───────────────────────────┘  │        │
│        │                                 │        │
│        │  The `const` keyword declares   │        │
│        │  a block-scoped variable that   │        │
│        │  cannot be reassigned.          │        │
│        │                                 │        │
│        │  How well did you remember?     │        │
│        │  [😞 Forgot][😐 Hard][🙂 Good][😎 Nailed] │
│        └───────────────────────────────┘        │
│                                                 │
├─────────────────────────────────────────────────┤
│  ← Prev       CONST-DECLARATION      [Next →]  │
└─────────────────────────────────────────────────┘
```

---

## Content Strategy (PayloadCMS)

### Content Authoring Workflow

1. **PayloadCMS collections** mirror the Convex schema: Languages, Sections, Flashcards, Exercises
2. Content authors create and edit cards in PayloadCMS's admin UI
3. A sync process pushes curated content from PayloadCMS → Convex
4. AI-generated hints/explanations are stored in Convex separately (never overwrite curated content)

### Content Quality Guidelines

Every flashcard must:
- Ask about ONE specific syntax pattern (not concepts or best practices)
- Have a question answerable in 1–5 lines of code
- Include the most common cross-language mistake in `commonMistakes`
- Have a hint that guides without revealing the answer
- Include an explanation that references how other languages handle the same thing

Example flashcard:

```json
{
  "question": "How do you create a list comprehension that filters even numbers from a list in Python?",
  "concept": "list_comprehensions",
  "tags": ["list", "comprehension", "filter"],
  "answer": "[x for x in numbers if x % 2 == 0]",
  "answerCode": "[x for x in numbers if x % 2 == 0]",
  "explanation": "Python list comprehensions use [expression for item in iterable if condition]. The filter comes at the end, unlike JS where you'd chain .filter().map().",
  "hint": "The structure is [value for value in list if ...]",
  "commonMistakes": [
    "Putting the if condition before the for (that's a ternary, not a filter)",
    "Using filter() instead — valid but not a comprehension"
  ]
}
```

---

## Mobile App (React Native + NativeWind) — MVP Scope

The mobile app is a **companion**, not a full replacement of the web app.

### MVP Mobile Features:
- Dashboard (view paths, progress, streaks)
- Flashcard study mode (full parity with web)
- Push notifications for daily reminders and streak alerts
- Offline support: cache current study session cards for offline review

### NOT in Mobile MVP:
- Quizzes (web only for MVP)
- Final assessments (web only)
- Account management (web only)
- Exercise types beyond flashcards (web only)

### Mobile-Specific UI Considerations:
- Swipe left/right for card navigation (in addition to buttons)
- Swipe up to flip card
- Haptic feedback on card flip and self-assessment
- Bottom tab navigation: Home | Study | Progress | Settings

---

## Learning Science Reference

The following techniques should be embedded into the product design:

1. **Spaced Repetition (SM-2):** Core algorithm for flashcard scheduling. Cards you struggle with appear more frequently; cards you know well space out to days/weeks.

2. **Active Recall:** The user must actively produce the answer from memory (typing it), not just recognize it. The textarea on the flashcard front enforces this.

3. **Interleaving:** Mix exercise types within a session. Don't do 10 flashcards then 10 fill-in-the-blank — interleave them.

4. **Desirable Difficulty:** Questions should be challenging enough to require effort but not so hard they cause frustration. The difficulty field on cards enables this calibration.

5. **Testing Effect:** Quizzes aren't just assessment — they're learning events. The act of being tested improves retention more than re-studying.

6. **Elaborative Encoding:** The explanation on each card connects new syntax to what the user already knows (other languages), creating richer memory traces.

7. **Minimum Effective Dose:** Sessions should be short (5–15 min). Don't require marathon study sessions. The streak system rewards consistency over volume.

---

## Implementation Priorities (MVP Build Order)

### Phase 1: Foundation (Week 1–2)
- [ ] Convex project setup with schema
- [ ] Next.js project with Tailwind, dark mode, Nunito + JetBrains Mono fonts
- [ ] Anonymous user creation and session management
- [ ] Dashboard page with static language cards
- [ ] PayloadCMS setup with Language, Section, and Flashcard collections

### Phase 2: Core Learning Engine (Week 3–4)
- [ ] Language path view with section list
- [ ] Flashcard study mode with flip animation
- [ ] Code textarea component (monospace, tab handling)
- [ ] SM-2 spaced repetition implementation
- [ ] Card progress tracking (Convex mutations)
- [ ] Hint display system

### Phase 3: Exercises & Quizzes (Week 5–6)
- [ ] Fill-in-the-blank exercise component
- [ ] Multiple choice exercise component
- [ ] Spot the error exercise component
- [ ] Section quiz system (question selection, scoring, pass/fail)
- [ ] Quiz results screen

### Phase 4: Gamification & Polish (Week 7–8)
- [ ] Streak tracking system
- [ ] Study calendar visualization
- [ ] Progress statistics
- [ ] Daily reminder system (Convex scheduled functions)
- [ ] Optional sign-up flow with progress merge
- [ ] Card flip animation polish
- [ ] Success/completion animations

### Phase 5: Content & AI (Week 8–9)
- [ ] Seed Python path content (all 14 sections, ~150 cards)
- [ ] Seed JavaScript path content
- [ ] Claude API integration for enhanced hints
- [ ] "Explain Further" button on card backs

### Phase 6: Mobile (Week 9–12)
- [ ] React Native project setup with NativeWind
- [ ] Shared Convex client
- [ ] Dashboard screen
- [ ] Flashcard study mode (with swipe gestures)
- [ ] Push notifications setup
- [ ] Offline caching for active study session

---

## Non-Functional Requirements

- **Performance:** Dashboard loads in < 1s. Card flip animation is 60fps. No jank.
- **Accessibility:** Keyboard navigable. Screen reader compatible. High contrast ratios.
- **Responsive:** Web app works on desktop, tablet, and mobile browsers.
- **Offline:** Mobile app caches active session. Web app works offline for in-progress flashcard sessions (via service worker).
- **Code quality:** TypeScript strict mode. ESLint + Prettier. Convex type safety throughout.

---

## Success Metrics (Post-Launch)

- Daily active users (DAU)
- Average session length
- Cards reviewed per session
- 7-day retention rate
- Streak length distribution
- Section completion rate
- Quiz pass rate on first attempt
- User conversion: anonymous → signed up

---

## PART 2: INSTRUCTIONS FOR THE AI AGENT

When you begin building this MVP, follow this exact order:

1. **Start with the Convex schema.** Get the data model right first. Validate by writing a few seed mutations.

2. **Build the flashcard component in isolation.** Get the flip animation, textarea, hint system, and self-assessment buttons working perfectly before integrating anything else. This is the core of the product — it must feel excellent.

3. **Implement SM-2 in a standalone Convex function.** Write unit tests for the algorithm. Edge cases matter (first review, failed review after long streak, etc.).

4. **Build pages outward from flashcards.** Study mode → Section view → Language path → Dashboard. Each layer wraps the previous one.

5. **Add exercises after flashcards are solid.** Fill-in-the-blank first (simplest), then multiple choice, then spot-the-error.

6. **PayloadCMS and content seeding come after the learning engine works.** Don't build the CMS integration until you have a working study flow with hardcoded test data.

7. **Mobile app is LAST.** The web app is the source of truth. Mobile is a companion.

**Code style expectations:**
- All components are functional React with hooks
- Use Convex's `useQuery` and `useMutation` hooks for all data access
- Tailwind only — no CSS-in-JS, no CSS modules
- File structure: features-based (e.g., `/features/flashcard/`, `/features/quiz/`)
- Shared components in `/components/ui/`
- Convex functions organized by domain: `/convex/users.ts`, `/convex/cards.ts`, `/convex/progress.ts`, `/convex/streaks.ts`

---

*End of CodeMemo.app MVP Prompt & PRD — v1.0*
