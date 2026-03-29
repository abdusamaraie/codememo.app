# CodeMemo — App Shell Design Spec
**Version**: 1.0.0  
**Status**: Ready for Frontend Implementation  
**Author**: Design System (Designer Agent)  
**Handoff target**: Frontend Engineer  
**Date**: 2025-07

---

## 0. Pre-Flight Checklist

Before implementing, verify:

- [ ] `data-accent="purple"` is on `<html>` in `apps/web/src/app/layout.tsx` ✅ (already set)
- [ ] `dark` class is on `<html>` ✅ (already set)
- [ ] `Nunito` and `JetBrains_Mono` fonts loaded ✅ (already set)
- [ ] `lucide-react` v0.511+ installed ✅
- [ ] shadcn/ui: `Button`, `Card`, `Progress`, `Badge`, `Tooltip` present ✅
- [ ] `(app)` route group does NOT exist yet — must be created
- [ ] `components/layout/` folder does NOT exist yet — must be created

---

## 1. Design Token Reference

All tokens resolve from the `[data-accent="purple"].dark` block in `globals.css`.
**Use semantic Tailwind class names** (via `@theme inline`) — do NOT hardcode hex values in components.

> **IMPORTANT — Tailwind v4:** This project uses `@import 'tailwindcss'` + `@theme inline`.
> All CSS variables declared in `@theme inline` are available as Tailwind utilities directly:
> `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-primary`, etc.
> Do NOT use `bg-[var(--background)]` — use `bg-background`. Use bracket syntax only for
> values that are not in `@theme inline` (e.g., pixel sizes like `w-[256px]`, `h-[50px]`).

| Semantic Class | CSS Variable | Resolved Hex | Usage |
|---|---|---|---|
| `bg-background` | `--background` | `#0B0E14` | Page background, sidebar bg |
| `bg-card` | `--card` | `#151A24` | Card backgrounds |
| `border-border` | `--border` | `#1E2636` | All borders, dividers |
| `text-foreground` | `--foreground` | `#E2E4EC` | Body text, headings |
| `text-primary` | `--primary` | `#7C6AF6` | Active states, highlights |
| `bg-primary` | `--primary` | `#7C6AF6` | Primary buttons, active pill |
| `bg-secondary` | `--secondary` | `#1A1F2B` | Hover backgrounds, active nav bg |
| `bg-muted` | `--muted` | `#12161F` | Subtle bg layers |
| `text-muted-foreground` | `--muted-foreground` | `#7B8199` | Inactive text, labels |
| `border-sidebar-border` | `--sidebar-border` | `#1E2636` | Sidebar borders |
| `text-sidebar-foreground` | `--sidebar-foreground` | `#E2E4EC` | Sidebar text |
| `bg-sidebar-accent` | `--sidebar-accent` | `#1A1F2B` | Sidebar hover/active bg |
| `text-sidebar-primary` | `--sidebar-primary` | `#7C6AF6` | Active sidebar item text/icon |

### Typography Tokens

| Usage | Font | Class |
|---|---|---|
| All UI text | Nunito | `font-sans` (default via `body`) |
| Code, shortcuts | JetBrains Mono | `font-mono` |
| Nav items | Nunito Medium 14px | `text-sm font-medium` |
| Logo | Nunito Bold 20px | `text-xl font-bold` |
| Stat numbers | Nunito Bold 24px | `text-2xl font-bold` |
| Card titles | Nunito SemiBold 16px | `text-base font-semibold` |
| Small labels | Nunito Regular 12px | `text-xs` |

### Border Radius

The `--radius` CSS variable resolves to `6px`. The shared tailwind config maps:
- `rounded-lg` → `var(--radius)` = 6px
- `rounded-xl` → `calc(var(--radius) + 4px)` = 10px
- `rounded-xxl` → 20px (from `@repo/theme`)

**Decision for this sprint:**
- Cards and panels: `rounded-xl` (10px)
- Buttons: `rounded-lg` (6px — as overridden in button.tsx with `rounded-[12px]`)
- Nav items: `rounded-lg` (6px)
- Language color dots: `rounded-full`

---

## 2. Layout Architecture

### 2.1 Viewport Grid

```
┌─────────────────────────────────────────────────────────────────┐
│  [Desktop lg+]                                                   │
│ ┌──────────┐ ┌─────────────────────────────┐ ┌───────────────┐  │
│ │ Sidebar  │ │      FeedWrapper            │ │  RightSidebar │  │
│ │  256px   │ │   flex-1 max-w-2xl          │ │    320px      │  │
│ │  fixed   │ │   scrollable                │ │  sticky       │  │
│ │  h-screen│ │   px-[16px] py-[24px]       │ │  xl+ only     │  │
│ └──────────┘ └─────────────────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [Mobile < lg]                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │  MobileHeader (sticky top, h-[50px])                        │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │                                                              │ │
│ │  Main content (scrollable)                                   │ │
│ │                                                              │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │  MobileBottomNav (fixed bottom, h-[60px])                   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 AppShell Layout (`apps/web/src/app/(app)/layout.tsx`)

**Purpose**: Root layout for all authenticated app routes.

```tsx
// Structure (not implementation):
<html> → <body> → <ConvexClientProvider>
  <div class="[AppShell]">
    <MobileHeader />          {/* visible mobile only */}
    <Sidebar />               {/* visible desktop only */}

    <main class="[MainArea]">
      {children}              {/* FeedWrapper + optional RightSidebar per page */}
    </main>

    <MobileBottomNav />       {/* visible mobile only */}
  </div>
```

**AppShell classes:**
```
className="relative flex min-h-screen flex-col bg-background lg:flex-row"
```

**MainArea classes** (the `<main>` element):
```
className="flex flex-1 flex-col lg:ml-[256px] lg:flex-row"
```

> `lg:ml-[256px]` offsets the main content to the right of the fixed sidebar (256px explicit pixel value).

---

## 3. Component Blueprints

---

### 3.1 `Sidebar.tsx` — Desktop Left Sidebar

**File**: `apps/web/src/components/layout/Sidebar.tsx`  
**Type**: Server Component (no interactivity at this level; `SidebarItem` is the client part)

#### Structure

```
┌──────────────────────────────┐  ← h-screen fixed left
│  ┌────────────────────────┐  │
│  │  ⌨ CodeMemo  [Logo]    │  │  ← top-0, px-[20px]
│  └────────────────────────┘  │
│  ─────────────────────────── │  ← border-b border-border
│                               │
│  ┌────────────────────────┐  │
│  │  ● Learn               │  │
│  │  ● Languages           │  │  ← nav items, flex-col gap-[4px]
│  │  ● Progress            │  │
│  │  ● Leaderboard         │  │
│  │  ● Quests              │  │
│  └────────────────────────┘  │
│                               │
│  [spacer: flex-1]             │
│                               │
│  ─────────────────────────── │  ← border-t border-border
│  ┌────────────────────────┐  │
│  │ 👤 User  🔥 42 days    │  │  ← bottom section p-[16px]
│  └────────────────────────┘  │
└──────────────────────────────┘
```

#### Tailwind Classes

**Outer container:**
```
className="hidden lg:flex lg:w-[256px] lg:fixed lg:inset-y-0 lg:left-0 lg:z-50
           flex-col bg-background border-r border-border overflow-y-auto"
```

**Logo section** (top):
```
className="flex h-[64px] items-center px-[20px] border-b border-border shrink-0"
```

**Logo link** (`<Link href="/learn">`):
```
className="flex items-center gap-[10px] text-xl font-bold text-foreground
           hover:text-primary transition-colors duration-150"
```

**Logo icon** (⌨ keyboard icon — use `Keyboard` from lucide-react):
```
className="size-6 text-primary"
```

**Logo text** (`<span>`):
```
className="text-xl font-bold tracking-tight"
```
> Text content: `"CodeMemo"` — the `C` in the same color as the rest (white), no gradient in v1.

**Nav section** (`<nav>`):
```
className="flex flex-col gap-[4px] px-[12px] py-[16px] flex-1"
```

**Bottom section:**
```
className="border-t border-border p-[16px] shrink-0"
```

**User + streak row** (inside bottom section):
```
className="flex items-center justify-between gap-[8px]"
```

**User button** (use shadcn `Button` variant `ghost`):
```
className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-lg text-sm
           font-medium text-muted-foreground hover:text-foreground
           hover:bg-secondary transition-colors w-full"
```
> Shows user avatar (circular, 28px) + username. Use a placeholder `UserCircle` icon from lucide-react if no avatar.

**Streak badge** (a `<div>` — NOT a button):
```
className="flex items-center gap-[4px] text-sm font-semibold text-orange-400"
```
> Content: `🔥 <span>{streakDays}</span>` — hardcode `42` as prop default for now.

#### Props Interface
```ts
interface SidebarProps {
  streakDays?: number  // default: 0
}
```

#### Accessibility
- `<nav aria-label="Main navigation">`
- Logo link: `aria-label="CodeMemo home"`

---

### 3.2 `SidebarItem.tsx` — Individual Nav Item

**File**: `apps/web/src/components/layout/SidebarItem.tsx`  
**Type**: `"use client"` — uses `usePathname()` to determine active state.

#### Visual States

| State | Background | Text + Icon color | Left Border |
|---|---|---|---|
| **Active** | `bg-secondary` | `text-primary` | `border-l-[3px] border-l-primary` |
| **Inactive** | transparent | `text-muted-foreground` | none |
| **Hover (inactive)** | `hover:bg-muted` | `hover:text-foreground` | none |

#### Structure

```
<Link href={href} aria-label={label} aria-current={isActive ? "page" : undefined}>
  <div class="[item container]">
    <Icon class="[icon]" />
    <span class="[label]">{label}</span>
  </div>
</Link>
```

**Item container** (the visual pill):
```
// Active:
className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-lg
           border-l-[3px] border-l-primary bg-secondary text-primary
           font-medium text-sm transition-colors duration-150"

// Inactive:
className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-lg
           border-l-[3px] border-l-transparent text-muted-foreground
           font-medium text-sm hover:bg-muted hover:text-foreground
           transition-colors duration-150"
```

> **Implementation note**: Use `cn()` to merge. The `border-l-[3px] border-l-transparent`
> on inactive items reserves the 3px space so text doesn't shift on activation.

**Icon** (`LucideIcon` component):
```
className="size-5 shrink-0"
// Active: inherits text-primary from parent
// Inactive: inherits text-muted-foreground from parent
```

**Label** (`<span>`):
```
className="text-sm font-medium leading-none"
```

#### Props Interface
```ts
import { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  href: string
  label: string
  icon: LucideIcon
}
```

#### Nav Items Definition (pass from Sidebar.tsx)

```ts
import {
  BookOpen,
  Code2,
  BarChart2,
  Trophy,
  Flame,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/learn",       label: "Learn",       icon: BookOpen  },
  { href: "/languages",   label: "Languages",   icon: Code2     },
  { href: "/progress",    label: "Progress",    icon: BarChart2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy    },
  { href: "/quests",      label: "Quests",      icon: Flame     },
]
```

#### Active State Logic

```ts
// In SidebarItem:
const pathname = usePathname()
const isActive = pathname === href || pathname.startsWith(`${href}/`)
```

---

### 3.3 `MobileHeader.tsx` — Mobile Top Bar

**File**: `apps/web/src/components/layout/MobileHeader.tsx`  
**Type**: Client Component (needs state for drawer open/close)

#### Structure

```
┌──────────────────────────────────────────────────────────────────┐ ← h-[50px]
│  [⌨ CodeMemo]                              [☰ Menu button]      │
└──────────────────────────────────────────────────────────────────┘
```

**Outer container** (for MobileHeader):
```
className="flex lg:hidden sticky top-0 z-50 h-[50px] items-center
           justify-between px-[16px] bg-background border-b border-border"
```

**Logo link** (same as sidebar):
```
className="flex items-center gap-[8px] text-lg font-bold text-foreground"
```

**Logo icon** (`Keyboard` from lucide-react):
```
className="size-5 text-primary"
```

**Hamburger button** (shadcn `Button` variant `ghost`, size `icon`):
```
className="size-9 text-muted-foreground hover:text-foreground hover:bg-secondary"
```
> Use `Menu` icon from lucide-react (24px). `aria-label="Open navigation menu"`.

#### Drawer

The drawer is a full-height overlay from the left side.

**Drawer overlay** (when open):
```
className="fixed inset-0 z-50 bg-black/60 lg:hidden"
// onClick: close drawer
```

**Drawer panel:**
```
className="fixed inset-y-0 left-0 z-50 w-[256px] flex flex-col
           bg-background border-r border-border overflow-y-auto
           shadow-2xl"
```

**Drawer header** (inside panel):
```
className="flex h-[50px] items-center justify-between px-[16px]
           border-b border-border"
```

**Close button** (inside drawer header):
```
// shadcn Button ghost icon
// icon: X from lucide-react
// aria-label="Close navigation menu"
```

**Drawer nav** (same `SidebarItem` components):
```
className="flex flex-col gap-[4px] px-[12px] py-[16px]"
```

**Drawer bottom** (streak, same as Sidebar bottom):
```
className="mt-auto border-t border-border p-[16px]"
```

#### Accessibility
- `role="dialog"` on the drawer panel
- `aria-modal="true"`
- `aria-label="Navigation menu"`
- Trap focus inside drawer when open (use a `useEffect` or a headless library)
- `Escape` key closes drawer

---

### 3.4 `MobileBottomNav.tsx` — Mobile Bottom Tab Bar

**File**: `apps/web/src/components/layout/MobileBottomNav.tsx`  
**Type**: `"use client"` — uses `usePathname()`

#### Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  [📖 Learn]  [</> Lang]  [📊 Progress]  [🏆 Lead]  [🔥 Quests] │
│     label       label        label        label       label      │
└──────────────────────────────────────────────────────────────────┘
  ← fixed bottom, h-[60px], 5 columns
```

**Outer container:**
```
className="flex lg:hidden fixed bottom-0 inset-x-0 z-50 h-[60px]
           items-center bg-background border-t border-border
           px-2"
```

**Tab grid:**
```
className="grid grid-cols-5 w-full"
```

**Each tab link** (`<Link>`):
```
// Active:
className="flex flex-col items-center justify-center gap-0.5 py-2
           text-primary"

// Inactive:
className="flex flex-col items-center justify-center gap-0.5 py-2
           text-muted-foreground hover:text-foreground transition-colors"
```

**Tab icon:**
```
className="size-5 shrink-0"
```

**Tab label** (`<span>`):
```
className="text-[10px] font-medium leading-none"
```
> Labels: "Learn", "Languages", "Progress", "Leaderboard", "Quests"  
> Use the same `NAV_ITEMS` array from `SidebarItem.tsx` (extract to a shared constant).

#### Shared Nav Constant
Extract `NAV_ITEMS` to `apps/web/src/components/layout/nav-items.ts` (no JSX, just data):
```ts
// nav-items.ts — pure data, importable by both Sidebar and MobileBottomNav
export const NAV_ITEMS = [...]
```

---

### 3.5 `FeedWrapper.tsx` — Center Content Area

**File**: `apps/web/src/components/layout/FeedWrapper.tsx`  
**Type**: Server Component (pure layout)

#### Structure

```
<div class="[FeedWrapper]">
  {children}
</div>
```

**FeedWrapper outer container:**
```
className="flex-1 min-w-0 w-full max-w-2xl px-[16px] py-[24px] lg:py-[32px]"
```

> **No overflow scroll here** — the `<main>` element in AppShell is the scroll container.
> Adding scroll here creates nested scroll contexts which breaks sticky elements.

**When used with RightSidebar** (on the same page):
The page layout wraps both in a flex row:
```
<div className="flex flex-1 gap-[24px] max-w-[1200px] mx-auto w-full
                px-[16px] lg:px-[24px] xl:px-[32px] py-[24px] lg:py-[32px]">
  <FeedWrapper>{children}</FeedWrapper>
  <StickyWrapper>
    <RightSidebar />
  </StickyWrapper>
</div>
```

#### Props Interface
```ts
interface FeedWrapperProps {
  children: React.ReactNode
}
```

---

### 3.6 `StickyWrapper.tsx` — Sticky Right Panel Wrapper

**File**: `apps/web/src/components/layout/StickyWrapper.tsx`  
**Type**: Server Component (pure layout)

**Outer container:**
```
className="hidden xl:flex flex-col w-[320px] shrink-0"
```

**Inner sticky div:**
```
className="sticky top-[24px] flex flex-col gap-[16px]"
```

#### Props Interface
```ts
interface StickyWrapperProps {
  children: React.ReactNode
}
```

---

### 3.7 `RightSidebar.tsx` — Right Panel Composition

**File**: `apps/web/src/components/layout/RightSidebar.tsx`  
**Type**: Server Component

**This component composes sub-components in vertical order:**

```
<div className="flex flex-col gap-[16px] w-full">
  <UserStats streakDays={42} xpToday={15} heartsRemaining={5} />
  <DailyGoal currentXP={15} goalXP={20} />
  <LanguagesCard />       {/* v2 — placeholder for now */}
  <AdBanner />
</div>
```

> `LanguagesCard` is a stub in v1. Place an empty component or omit. Spec'd for v2.

---

### 3.8 `UserStats.tsx` — Streak / XP / Hearts Row Card

**File**: `apps/web/src/components/layout/UserStats.tsx`  
**Type**: Server Component

#### Structure

```
┌─────────────────────────────────────────────────────┐
│  🔥           ⚡           ❤️                        │
│  42           15           5                         │
│  day streak   XP today     hearts                    │
└─────────────────────────────────────────────────────┘
```

**Card container** (NOT using shadcn `Card` — use a plain `div` for tighter control):
```
className="bg-card rounded-xl border border-border p-[16px]"
```

**Stats grid** (3 equal columns):
```
className="grid grid-cols-3 divide-x divide-border"
```

**Each stat cell:**
```
className="flex flex-col items-center gap-[4px] py-[8px]"
```

**Stat emoji/icon line:**
```
className="text-xl leading-none"
```
> Use emoji directly: `🔥` (streak), `⚡` (XP), `❤️` (hearts)

**Stat number:**
```
className="text-2xl font-bold text-foreground leading-none"
```

**Stat label:**
```
className="text-xs text-muted-foreground leading-none text-center"
```
> Labels: `"day streak"`, `"XP today"`, `"hearts"`

**Vertical dividers** between cells: use CSS trick — `divide-x divide-border` on the grid, or add a `border-r border-border` on first two cells.

#### Props Interface
```ts
interface UserStatsProps {
  streakDays: number       // e.g. 42
  xpToday: number          // e.g. 15
  heartsRemaining: number  // e.g. 5, max 5
}
```

---

### 3.9 `DailyGoal.tsx` — XP Progress Card

**File**: `apps/web/src/components/layout/DailyGoal.tsx`  
**Type**: Server Component

#### Structure

```
┌─────────────────────────────────────────────────────┐
│  Daily Goal                       15 / 20 XP        │
│  ██████████████████░░░░░░░░  [progress bar]         │
│  Keep it up! ✨                                      │
└─────────────────────────────────────────────────────┘
```

**Card container:**
```
className="bg-card rounded-xl border border-border p-[16px] flex flex-col gap-[12px]"
```

**Header row:**
```
className="flex items-center justify-between"
```

**Title** (`<h3>`):
```
className="text-sm font-semibold text-foreground"
```
> Content: `"Daily Goal"`

**XP counter** (`<span>`):
```
className="text-sm font-medium text-muted-foreground"
```
> Content: `"{currentXP} / {goalXP} XP"` — e.g. `"15 / 20 XP"`

**Progress bar** (shadcn `Progress` component):
```
// Pass className to override height:
<Progress
  value={(currentXP / goalXP) * 100}
  className="h-3 rounded-full"
/>
```
> The shadcn `Progress` component uses `var(--secondary)` as track bg and `var(--primary)` as fill — both are correct for the purple theme.

**Motivational label** (`<p>`):
```
className="text-xs text-muted-foreground"
```
> Logic: if `currentXP >= goalXP`: `"Goal reached! 🎉"`, if `currentXP >= goalXP * 0.5`: `"Keep it up! ✨"`, else: `"You've got this! 💪"`

#### Props Interface
```ts
interface DailyGoalProps {
  currentXP: number  // e.g. 15
  goalXP: number     // e.g. 20 (default: 20)
}
```

---

### 3.10 `AdBanner.tsx` — Placeholder Ad / Upgrade Card

**File**: `apps/web/src/components/layout/AdBanner.tsx`  
**Type**: Server Component

#### Structure

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  Advertisement
│                                                          │
     🚀
│                                                          │
     Upgrade to Pro
│     Unlock unlimited hearts, offline mode, and more     │
│                                                          │
     [Get Pro — $9/mo]
│                                                          │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
  ↑ dashed border, min-h-[200px]
```

**Outer container:**
```
className="rounded-xl border border-dashed border-border
           bg-muted/40 min-h-[200px] flex flex-col p-[16px] gap-[12px]"
```

**"Advertisement" label** (top):
```
className="text-[10px] font-medium uppercase tracking-widest
           text-muted-foreground"
```

**Content area** (centered column):
```
className="flex flex-col items-center justify-center flex-1 gap-[8px] py-[8px]"
```

**Rocket emoji:**
```
className="text-3xl leading-none"
```
> Content: `"🚀"`

**Heading** (`<p>`):
```
className="text-sm font-semibold text-foreground text-center"
```
> Content: `"Upgrade to Pro"`

**Description** (`<p>`):
```
className="text-xs text-muted-foreground text-center leading-relaxed max-w-[200px]"
```
> Content: `"Unlock unlimited hearts, offline mode, and more."`

**CTA Button** (shadcn `Button`, variant `default`, size `sm`):
```
className="mt-1 w-full rounded-lg text-xs font-bold"
```
> Content: `"Get Pro — $9/mo"` (non-functional placeholder, no onClick needed)

---

## 4. Route Group: `(app)` Layout

### 4.1 Layout File

**File**: `apps/web/src/app/(app)/layout.tsx`

```
Structure:
  └── Does NOT render <html> or <body> — inherits from root layout
  └── Receives `children` and wraps in AppShell
```

**Outer div (AppShell):**
```
className="relative flex min-h-screen flex-col bg-background lg:flex-row"
```

**Main content area** (`<main>`):
```
className="flex flex-1 flex-col lg:ml-[256px] overflow-y-auto
           pb-[60px] lg:pb-0"
```
> `pb-[60px]` on mobile gives space above the fixed bottom nav (60px height).

**Full structure:**
```
<AppShell>                           ← outer div
  <MobileHeader />                   ← flex lg:hidden sticky top
  <Sidebar />                        ← hidden lg:flex fixed left
  <main>
    {children}                       ← FeedWrapper + RightSidebar per page
  </main>
  <MobileBottomNav />                ← flex lg:hidden fixed bottom
</AppShell>
```

### 4.2 Page Route: `/learn`

**File**: `apps/web/src/app/(app)/learn/page.tsx`

This page demonstrates the 3-column layout in action.

**Page structure:**
```
<div className="flex flex-1 gap-[24px] max-w-[1200px] mx-auto w-full
                px-[16px] lg:px-[24px] xl:px-[32px] py-[24px] lg:py-[32px] items-start">
  <FeedWrapper>
    <LearnPageContent />
  </FeedWrapper>
  <StickyWrapper>
    <RightSidebar streakDays={42} xpToday={15} heartsRemaining={5} currentXP={15} goalXP={20} />
  </StickyWrapper>
</div>
```

**LearnPageContent** (inline in `page.tsx` for now, extract later):

```
[Section Heading]
"Choose a Language"   ← text-2xl font-bold text-foreground mb-[8px]
"Pick a language to start your memorization journey."  ← text-sm text-muted-foreground mb-[24px]

[Language Cards Grid]
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-[16px]"

[3 cards: Python, TypeScript, JavaScript]
```

**Individual Language Card** (use shadcn `Card`):

```
className="bg-card rounded-xl border border-border hover:border-primary/50
           transition-colors cursor-pointer group"
```

**Card inner layout:**
```
className="p-[20px] flex flex-col gap-[12px]"
```

**Card top row** (icon + name):
```
className="flex items-center gap-[12px]"
```

**Language color dot** (inline circle):
```
className="size-10 rounded-xl flex items-center justify-center
           text-xl shrink-0"
```
> Python: `bg-blue-500/20 text-blue-400` + Python snake emoji 🐍  
> TypeScript: `bg-blue-700/20 text-blue-300` + TS badge 🔷  
> JavaScript: `bg-yellow-500/20 text-yellow-400` + JS badge 🟡

**Language name** (`<h3>`):
```
className="text-base font-semibold text-foreground"
```

**Language description** (`<p>`):
```
className="text-sm text-muted-foreground leading-relaxed"
```
> Python: `"Master Python's concise syntax, list comprehensions, and decorators."`  
> TypeScript: `"Build confidence with types, generics, and advanced TS patterns."`  
> JavaScript: `"Lock in arrow functions, closures, and async/await patterns."`

**Snippet count badge** (shadcn `Badge`):
```
// No custom styles — use default Badge
// Content: "124 snippets" / "98 snippets" / "143 snippets"
```

**Start button** (shadcn `Button` variant `default`, size `sm`):
```
className="w-full rounded-lg mt-[4px]"
```
> Content: `"Start Learning"` — non-functional in v1 (no onClick).

#### Language Card Data
```ts
const LANGUAGES = [
  {
    id: "python",
    name: "Python",
    emoji: "🐍",
    colorClasses: "bg-blue-500/20 text-blue-400",
    description: "Master Python's concise syntax, list comprehensions, and decorators.",
    snippetCount: 124,
  },
  {
    id: "typescript",
    name: "TypeScript",
    emoji: "🔷",
    colorClasses: "bg-blue-700/20 text-blue-300",
    description: "Build confidence with types, generics, and advanced TS patterns.",
    snippetCount: 98,
  },
  {
    id: "javascript",
    name: "JavaScript",
    emoji: "🟡",
    colorClasses: "bg-yellow-500/20 text-yellow-400",
    description: "Lock in arrow functions, closures, and async/await patterns.",
    snippetCount: 143,
  },
]
```

---

## 5. Component Inventory & File Structure

```
apps/web/src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              ← AppShell: wraps all (app) routes
│   │   └── learn/
│   │       └── page.tsx            ← Demo learn page with language cards
│   ├── globals.css                 ← UNCHANGED (tokens already correct)
│   ├── layout.tsx                  ← UNCHANGED (root HTML layout)
│   └── page.tsx                    ← UNCHANGED (marketing/landing page)
│
└── components/
    ├── layout/                     ← NEW FOLDER
    │   ├── Sidebar.tsx             ← Desktop left sidebar (Server)
    │   ├── SidebarItem.tsx         ← Nav item with active state (Client)
    │   ├── MobileHeader.tsx        ← Mobile top bar + drawer (Client)
    │   ├── MobileBottomNav.tsx     ← Mobile bottom tabs (Client)
    │   ├── FeedWrapper.tsx         ← Center content area (Server)
    │   ├── RightSidebar.tsx        ← Right panel composition (Server)
    │   ├── StickyWrapper.tsx       ← Sticky wrapper div (Server)
    │   ├── UserStats.tsx           ← Streak/XP/Hearts card (Server)
    │   ├── DailyGoal.tsx           ← XP progress card (Server)
    │   ├── AdBanner.tsx            ← Pro upgrade placeholder (Server)
    │   ├── nav-items.ts            ← Shared NAV_ITEMS constant (data only)
    │   └── index.ts                ← Re-export all
    │
    ├── ConvexClientProvider.tsx    ← UNCHANGED
    ├── index.ts                    ← UNCHANGED
    └── ui/                         ← UNCHANGED (shadcn components)
```

### `index.ts` Re-exports
```ts
// apps/web/src/components/layout/index.ts
export { default as Sidebar } from "./Sidebar"
export { default as SidebarItem } from "./SidebarItem"
export { default as MobileHeader } from "./MobileHeader"
export { default as MobileBottomNav } from "./MobileBottomNav"
export { default as FeedWrapper } from "./FeedWrapper"
export { default as RightSidebar } from "./RightSidebar"
export { default as StickyWrapper } from "./StickyWrapper"
export { default as UserStats } from "./UserStats"
export { default as DailyGoal } from "./DailyGoal"
export { default as AdBanner } from "./AdBanner"
export { NAV_ITEMS } from "./nav-items"
```

---

## 6. Accessibility (A11y) Specifications

### Focus Styles
All interactive elements (links, buttons) inherit the global ring from the design system:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```
> `--ring` resolves to `#7C6AF6` in the purple dark theme. Do not override this.

### ARIA Requirements

| Component | ARIA |
|---|---|
| `<Sidebar>` | `<nav aria-label="Main navigation">` |
| `<SidebarItem>` (active) | `aria-current="page"` on `<Link>` |
| `<SidebarItem>` | `aria-label={label}` on `<Link>` |
| `<MobileHeader>` | Hamburger: `aria-label="Open navigation menu"` |
| `<MobileHeader>` drawer | `role="dialog" aria-modal="true" aria-label="Navigation menu"` |
| `<MobileHeader>` close | `aria-label="Close navigation menu"` |
| `<MobileBottomNav>` | `<nav aria-label="Mobile navigation">` |
| `<MobileBottomNav>` tab | `aria-label={label}` on `<Link>`, `aria-current="page"` when active |
| `<Progress>` | The shadcn primitive provides `role="progressbar"` + `aria-valuenow` |
| `<AdBanner>` CTA | `aria-label="Upgrade to Pro subscription"` |
| Language cards | `role="link"` if `<div>` used, prefer `<Link>` directly |

### Skip Link
Add a skip-to-content link in the AppShell layout (before `<Sidebar>`):
```
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-[16px] focus:left-[16px]
             focus:z-[100] focus:bg-primary focus:text-primary-foreground
             focus:px-[16px] focus:py-[8px] focus:rounded-lg focus:text-sm focus:font-medium"
>
  Skip to main content
</a>
```
Add `id="main-content"` to the `<main>` element.

---

## 7. Responsive Breakpoint Behavior

| Breakpoint | Sidebar | RightSidebar | MobileHeader | MobileBottomNav |
|---|---|---|---|---|
| `< lg` (< 1024px) | Hidden | Hidden | Visible | Visible |
| `lg` (1024–1279px) | Visible (fixed) | Hidden | Hidden | Hidden |
| `xl+` (≥ 1280px) | Visible (fixed) | Visible | Hidden | Hidden |

> The `xl:flex` on `StickyWrapper` (which contains `RightSidebar`) handles the right sidebar breakpoint.

---

## 8. Spacing System — CRITICAL: Custom Scale (NOT Standard Tailwind)

> ⚠️ **BREAKING DIFFERENCE from standard Tailwind**: This project uses a custom spacing scale
> from `@repo/theme` where **the key equals the pixel value directly**.
> `spacing.scale[4] = 4` → `p-4` = **4px** (NOT 16px as in standard Tailwind).
> `spacing.scale[64] = 64` → `w-64` = **64px** (NOT 256px as in standard Tailwind).

### Verified scale (`packages/theme/tokens.ts`):

```
scale[0] = 0px    scale[1] = 1px    scale[2] = 2px    scale[4] = 4px
scale[6] = 6px    scale[8] = 8px    scale[10] = 10px  scale[12] = 12px
scale[14] = 14px  scale[16] = 16px  scale[20] = 20px  scale[24] = 24px
scale[28] = 28px  scale[32] = 32px  scale[40] = 40px  scale[48] = 48px
scale[56] = 56px  scale[64] = 64px  scale[80] = 80px  scale[96] = 96px
```

### Corrected layout-critical values

Since `w-64` = 64px (not 256px), use **explicit bracket notation** for all layout measurements:

| Intent | ❌ DO NOT USE | ✅ USE THIS |
|---|---|---|
| Sidebar width 256px | `w-64` | `w-[256px]` |
| Main content offset | `ml-64` | `ml-[256px]` |
| Mobile header height | `h-12` (= 12px!) | `h-[50px]` |
| Mobile bottom nav height | — | `h-[60px]` |
| Right sidebar width | — | `w-[320px]` |
| Fixed sidebar position | `lg:w-64` | `lg:w-[256px]` |

### Padding / Gap Equivalents

Since the scale is 1:1 with pixels, these are the correct class → pixel mappings:

| Class | Pixels | Use for |
|---|---|---|
| `p-4` | 4px | Tight inner padding (badges) |
| `p-6` | 6px | Small inner padding |
| `p-8` | 8px | Icon button padding |
| `p-12` | 12px | Card padding (small) |
| `p-16` | 16px | Card padding (standard) |
| `p-20` | 20px | Card padding (comfortable) |
| `p-24` | 24px | Section padding |
| `gap-4` | 4px | Tight gap |
| `gap-6` | 6px | Icon-text gap |
| `gap-8` | 8px | Small gap |
| `gap-12` | 12px | Standard gap |
| `gap-16` | 16px | Medium gap |
| `gap-24` | 24px | Section gap |
| `px-16` | 16px | Horizontal card padding |
| `py-8` | 8px | Vertical tight padding |
| `py-10` | 10px | Nav item vertical padding |
| `py-16` | 16px | Section vertical padding |

### Updated Component Classes (spacing corrected)

The class strings in sections 3.1–3.10 above use this revised scale. When you see `px-6` in those sections, it means **6px** — adjust if that's too tight for the visual. Use bracket notation (e.g. `px-[20px]`) if a specific pixel value is needed that isn't in the scale.

**Recommended comfortable defaults for this project:**
- Card internal padding: `p-[20px]` or `p-20` (both = 20px)
- Section padding horizontal: `px-[16px]` or `px-16` (= 16px)
- Nav item padding: `px-[12px] py-[10px]` or `px-12 py-10`
- Logo area padding: `px-[20px]` or `px-20` (= 20px)
- Gap between nav items: `gap-[4px]` or `gap-4` (= 4px)
- Gap between sidebar sections: `gap-[16px]` or `gap-16` (= 16px)

---

## 9. What This Spec Does NOT Cover (Deferred)

| Feature | Sprint |
|---|---|
| Framer Motion animations | v2 |
| User authentication (real user data in sidebar) | v2 |
| `LanguagesCard` in RightSidebar (real language list) | v2 |
| Convex data fetching for streak/XP | v2 |
| Dark/light mode toggle | v2 |
| Keyboard shortcut hints in sidebar | v3 |
| Collapsed sidebar (icon-only mode) | v3 |

---

## 10. Implementation Order (Suggested)

The Frontend engineer should implement in this order to minimize blocking:

1. `nav-items.ts` — data constant (no JSX)
2. `StickyWrapper.tsx` — trivial layout wrapper
3. `FeedWrapper.tsx` — trivial layout wrapper
4. `SidebarItem.tsx` — client component (needed by Sidebar + MobileHeader)
5. `Sidebar.tsx` — desktop sidebar
6. `MobileBottomNav.tsx` — mobile bottom nav
7. `MobileHeader.tsx` — mobile header + drawer
8. `UserStats.tsx` — stats card
9. `DailyGoal.tsx` — progress card
10. `AdBanner.tsx` — placeholder card
11. `RightSidebar.tsx` — compose right panel
12. `index.ts` — re-exports
13. `(app)/layout.tsx` — wire AppShell
14. `(app)/learn/page.tsx` — demo page with language cards

---

*End of Design Spec v1.0.0 — CodeMemo App Shell*
