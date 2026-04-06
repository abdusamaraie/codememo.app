# AGENTS.md

## Project Overview

This is a TypeScript monorepo (Turborepo) containing multiple web apps and a mobile app.
- **Mobile App**: Located in `apps/mobile`. Built with Expo/React Native.
- **Web Apps**: Next.js applications in `apps/web`, `apps/landing`, `apps/waitlist`, `apps/feedback`.
- **Admin CMS**: Next.js + Payload CMS in `apps/admin`.

## Documentation Resources

When working on this project, consult the official Expo documentation:
- https://docs.expo.dev/llms.txt
- https://docs.expo.dev/llms-full.txt
- https://docs.expo.dev/llms-eas.txt
- https://docs.expo.dev/llms-sdk.txt

## Essential Commands

### From root
```bash
npm run dev          # Start all dev servers
npm run lint         # Lint all packages
npm run build        # Build all packages
npm run typecheck    # TypeScript check
npm test             # Run all tests
```

### From apps/mobile
```bash
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
```

### Quality (run after every feature)
```bash
npm run lint
npm run typecheck
npm test
```

## Development Principles

- TypeScript First: strict mode everywhere
- Use `@/` alias for app-internal imports
- Use `@repo/*` for shared packages
- Never use deep relative paths
- Pure business logic in `@repo/domain`
- Platform code at the edges only
