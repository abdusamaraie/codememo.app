# codememo-app — Mobile App

Expo + React Native mobile app within the monorepo.

## Prerequisites

- Node.js >= 18
- npm (comes with Node)
- **iOS**: Xcode (latest stable) with iOS Simulator
- **Android**: Android Studio with an emulator configured
- Dependencies installed from the **monorepo root**: `npm install`

## Quick Start (Local Development Build)

The app uses `expo-dev-client`, which means you need a native development build before running the dev server. This is a one-time step (rebuild only when native dependencies change).

### iOS (requires macOS + Xcode)

```bash
# From monorepo root
npm run run:mobile:ios

# Or from apps/mobile
npm run build:ios:dev
```

This runs `expo run:ios`, which will:
1. Generate native iOS files (`ios/` directory) via prebuild
2. Compile the native project in Xcode
3. Install the dev build on the iOS Simulator
4. Start the Metro bundler

### Android (requires Android Studio)

```bash
# From monorepo root
npm run run:mobile:android

# Or from apps/mobile
npm run build:android:dev
```

This runs `expo run:android`, which will:
1. Generate native Android files (`android/` directory) via prebuild
2. Compile with Gradle
3. Install on the connected emulator/device
4. Start the Metro bundler

## Running After the First Build

Once the development build is installed, you only need the Metro dev server:

```bash
# From monorepo root
npm run start:mobile

# Or from apps/mobile
npm start
```

Press `i` for iOS or `a` for Android in the terminal to open the app.

## Using Expo Go (No Native Build Required)

If you don't need native modules and want a faster iteration loop:

```bash
# From apps/mobile
npm run start:go
```

This starts the dev server in Expo Go mode. Note: some native libraries (e.g., `expo-dev-client` features) won't be available in Expo Go.

## EAS Build (Cloud Builds)

For CI/CD or when you don't have Xcode/Android Studio locally.

### Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Link the project (first time only)
eas init
```

### Build Commands

```bash
# Development build for iOS Simulator
npm run build:ios:simulator
# Or: eas build --platform ios --profile development-simulator

# Development build for physical device
npm run build:eas:dev
# Or: eas build --profile development

# Production build
npm run build:ios
npm run build:android
```

After an EAS build completes, download and install the `.app`/`.apk` on your simulator/device, then run `npm start` to connect.

## Rebuilding

You need to rebuild the native project when:
- Adding/removing native dependencies (e.g., a new `expo-*` package with native code)
- Changing `app.json` native config (bundle ID, permissions, plugins)
- Updating Expo SDK version

```bash
# Clean rebuild (removes ios/ and android/ directories first)
npm run prebuild:clean

# Then build again
npm run build:ios:dev   # iOS
npm run build:android:dev  # Android
```

## All Scripts

| Script | Description |
|---|---|
| `npm start` | Start Metro dev server (requires existing dev build) |
| `npm run start:clean` | Start Metro with cleared cache |
| `npm run start:go` | Start in Expo Go mode (no dev build needed) |
| `npm run build:ios:dev` | Local iOS build + install on Simulator |
| `npm run build:android:dev` | Local Android build + install on emulator |
| `npm run build:ios:simulator` | EAS cloud build for iOS Simulator |
| `npm run build:ios` | EAS production build for iOS |
| `npm run build:android` | EAS production build for Android |
| `npm run build:eas:dev` | EAS development build (both platforms) |
| `npm run prebuild` | Generate native projects without building |
| `npm run prebuild:clean` | Clean + regenerate native projects |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run doctor` | Check for common issues |

## Troubleshooting

### "No development build" error
You haven't installed a dev build yet. Run `npm run build:ios:dev` (iOS) or `npm run build:android:dev` (Android).

### Metro bundler can't find modules
```bash
npm run start:clean
```

### Native build fails after adding a package
```bash
npm run prebuild:clean
npm run build:ios:dev  # or build:android:dev
```

### Monorepo resolution issues
```bash
# From monorepo root
npm install
# Then from apps/mobile
npm run doctor
```
