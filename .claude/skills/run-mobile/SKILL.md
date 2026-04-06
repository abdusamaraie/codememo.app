---
name: run-mobile
description: Run the mobile app on iOS simulator, Android emulator, or start the Expo dev server. Use this skill when the user asks to run, start, or launch the mobile app.
---

# Run Mobile App

This skill helps run the mobile app in development mode.

## Pre-flight Check

**IMPORTANT:** Before running any command, first check the current working directory:

```bash
pwd
```

If you are NOT in the monorepo root, navigate there first or use the full path in commands.

## Commands

All commands below assume you are in the monorepo root directory.

The mobile workspace is `@repo/mobile` (defined in `apps/mobile/package.json`).

### Start Expo Dev Server (default)
```bash
npm run start:mobile
```
This starts the Expo development server with options to run on any platform. MCP support is enabled by default via `EXPO_UNSTABLE_MCP_SERVER=1`.

### Run on iOS Simulator
```bash
npm run start:mobile:ios
```
Builds and runs the app on the iOS simulator.

### Run on Android Emulator
```bash
npm run start:mobile:android
```
Builds and runs the app on the Android emulator.

### Direct workspace commands (alternative)
```bash
npm --workspace @repo/mobile start
npm --workspace @repo/mobile run ios
npm --workspace @repo/mobile run android
```

## Instructions

1. **Always check `pwd` first** to confirm you're in the monorepo root

2. When the user says "run the app", "start the app", or similar, ask which platform they want unless they specify:
   - iOS simulator
   - Android emulator
   - Expo dev server (to choose later via QR code or pressing i/a)
   - Expo dev server with MCP support

3. Use the root-level npm scripts (defined in root `package.json`) - never cd into `apps/mobile`

4. The command will run in the foreground - inform the user they can stop it with Ctrl+C

5. If there are build errors, help diagnose them based on the output
