# codememo-app

TypeScript monorepo powered by [Turborepo](https://turbo.build/repo).

## Prerequisites

- Node.js >= 18
- npm (comes with Node)
- **Mobile development**: Xcode (iOS) and/or Android Studio (Android)

## Setup

```bash
# Install all dependencies
npm install

# Start all dev servers
npm run dev
```

## UI Components (shadcn/ui)

All Next.js web apps come pre-configured with [shadcn/ui](https://ui.shadcn.com) (`default` style, CSS variables, `lucide-react` icons). The following components are installed automatically during bootstrap: `button`, `card`, `navigation-menu`.

### Adding more components

Run from inside the target app directory:

```bash
cd apps/web   # or apps/landing, apps/waitlist, apps/feedback
npx shadcn@latest add dialog
npx shadcn@latest add input form table badge select
```

Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

### Using the `cn` utility

Every web app exports a `cn()` helper for merging Tailwind classes:

```ts
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Customizing component colors with the theme

Components use CSS variables defined in `src/app/globals.css`. To retheme the entire app, update the accent scale in `:root`:

```css
/* src/app/globals.css — swap these 12 values to rebrand */
:root {
  --accent-25:  #fdfcfb;   /* your lightest tint */
  --accent-500: #7c6f5c;   /* your mid tone      */
  --accent-900: #1c150e;   /* your darkest shade  */
  /* ... all 12 steps */
}
```

To override a single component token without touching the scale, target it directly:

```css
/* Make buttons use a custom brand blue instead of the accent scale */
:root {
  --primary:            #1447e6;
  --primary-foreground: #ffffff;
}
```

The full token hierarchy is:

```
--accent-*          → raw color scale (12 steps)
  └── --primary / --secondary / --muted / ...  → semantic roles
        └── component variants (button, card, input, etc.)
```

Changes to `--accent-*` cascade everywhere. Changes to semantic tokens (`--primary`, etc.) only affect that role.

## Project Structure

```
apps/
  mobile/          → Expo + React Native
  web/             → Next.js App Router (main web app)
  landing/         → Next.js (marketing / landing page)
  waitlist/        → Next.js (email collection)
  feedback/        → Next.js (feedback board)
  admin/           → Next.js + Payload CMS

packages/
  domain/          → Shared types, validators, business logic
  ui/              → Cross-platform UI components
  theme/           → Design tokens (colors, spacing, typography)
  api-client/      → Typed fetch wrapper
  config/          → Typed env var access
  i18n/            → Translation strings
  mock-data/       → Seed/mock data
  eslint-config/   → Shared ESLint rules
  typescript-config/ → Shared tsconfig
  tailwind-config/ → Shared Tailwind preset
```

## Running Apps

### Mobile (Expo + React Native)

The mobile app uses `expo-dev-client` and requires a native development build before running.

```bash
# First time: build and install on iOS Simulator (requires Xcode)
npm run run:mobile:ios

# First time: build and install on Android emulator (requires Android Studio)
npm run run:mobile:android

# After the first build, just start the dev server
npm run start:mobile
```

See [apps/mobile/README.md](apps/mobile/README.md) for detailed build instructions, EAS setup, and troubleshooting.

### Web Apps

```bash
# All web apps at once
npm run dev

# Individual apps
npm run dev:web          # Main web app
npm run dev:admin        # Admin / Payload CMS
npx turbo run dev --filter=landing
npx turbo run dev --filter=waitlist
npx turbo run dev --filter=feedback
```

### Admin (Payload CMS) Setup

The admin app requires a PostgreSQL database and environment variables before it can run.

```bash
# 1. Copy the example env file
cp apps/admin/.env.example apps/admin/.env.local

# 2. Edit apps/admin/.env.local and set:
#    DATABASE_URL    → your PostgreSQL connection string
#    PAYLOAD_SECRET  → a random string (run: openssl rand -base64 32)

# 3. Start the admin app
npm run dev:admin
```

The admin panel will be available at [http://localhost:3001/admin](http://localhost:3001/admin). On first run, Payload will create the database tables and prompt you to create an admin user.

## Commands

```bash
# Development
npm run dev                    # Start all dev servers
npm run start:mobile           # Expo dev server (after initial build)
npm run start:mobile:clean     # Expo dev server with cleared cache

# Building
npm run build                  # Build all apps
npm run build:web              # Build web app
npm run build:admin            # Build admin app
npm run run:mobile:ios         # Local iOS dev build
npm run run:mobile:android     # Local Android dev build

# Quality
npm run lint                   # Lint all packages
npm run typecheck              # TypeScript check all packages
npm test                       # Run all tests

# Mobile-specific
npm run prebuild:mobile        # Generate native projects
npm run prebuild:mobile:clean  # Clean + regenerate native projects
npm run doctor:mobile          # Check for common issues
npm run build:mobile:ios       # EAS production build (iOS)
npm run build:mobile:android   # EAS production build (Android)
```

## Environment Variables

Copy `.env.example` to `.env.local` in each app that needs it:

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

Never commit `.env` or `.env.local` files.

## Adding a New Web App

1. Copy the closest existing app in `apps/`
2. Update `package.json` name to `@apps/<name>`
3. Add `@repo/*` dependencies as needed
4. Create `.env.local` if needed
5. Turbo picks it up automatically

## Adding a Shared Package

1. Create `packages/<name>/` with `package.json` (name: `@repo/<name>`) and `index.ts`
2. Add to consuming apps' dependencies
3. Run `npm install` from root
