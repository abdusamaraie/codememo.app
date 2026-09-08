#!/usr/bin/env bash
#
# Local mirror of the CI "verify" job (.github/workflows/ci.yml).
# If this passes locally, CI passes. Run it before pushing:  npm run verify
#
# The gates deliberately run against DUMMY env values — CI must never reach
# real infrastructure. Two apps hard-fail at import time without env:
#   - apps/admin : src/payload.config.ts throws without PAYLOAD_SECRET + DATABASE_URL
#   - apps/web   : src/components/ConvexClientProvider.tsx throws without NEXT_PUBLIC_CONVEX_URL
# Next.js does not override variables already set in the environment, so these
# exports win even when real .env.local files are present.
#
# apps/mobile is out of scope for CI/CD and is excluded from every task.
#
set -euo pipefail
cd "$(dirname "$0")/.."

export PAYLOAD_SECRET="${PAYLOAD_SECRET:-ci_dummy_payload_secret_min_32_characters_ok}"
export DATABASE_URL="${DATABASE_URL:-postgres://ci:ci@127.0.0.1:5432/ci_placeholder}"
export NEXT_PUBLIC_CONVEX_URL="${NEXT_PUBLIC_CONVEX_URL:-https://ci-placeholder.convex.cloud}"
export NEXT_PUBLIC_ADMIN_URL="${NEXT_PUBLIC_ADMIN_URL:-https://admin.ci.invalid}"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-pk_test_Y2xlcmsuZXhhbXBsZS5jb20k}"
export CLERK_SECRET_KEY="${CLERK_SECRET_KEY:-sk_test_ci_dummy_secret_value_not_real_000000}"

# Two passes on purpose: running lint + typecheck + test + both Next builds in
# one turbo invocation peaks memory hard enough to crash jest/next workers on
# smaller machines (and CI runners). Static checks first, then the builds.
npx turbo run lint typecheck test --filter='!@repo/mobile'
npx turbo run build --filter='!@repo/mobile' --concurrency=1
