# CI/CD

How code gets from a branch to production, and what guards it along the way.

- **In scope:** `apps/web`, `apps/admin`, `packages/convex` + the shared packages they pull in.
- **Out of scope:** `apps/mobile` (Expo / EAS — its own release flow). Every CI task excludes it.
- **Two environments:** `staging` and `production`. Development is local only (`npm run dev`, `npx convex dev`); CI never touches it.

---

## What runs today

### PR gates — `.github/workflows/ci.yml`

Every PR into `main` (and every push to `main`) runs:

| Job | What it does |
|---|---|
| **Branch name** | PR head branch must be `<type>/<kebab-name>` — `feat` `fix` `chore` `docs` `refactor` `test` `ci` `perf` `build`. PR-only. |
| **Verify** | `./scripts/verify.sh` — `turbo run lint typecheck test build`, filtered to exclude `@repo/mobile`. |

Node comes from `.nvmrc` (22) via the `./.github/actions/setup` composite action, which also runs `npm ci` with npm's cache.

### `scripts/verify.sh` — the local mirror

`npm run verify` runs the **exact** command CI runs. If it's green locally, CI is green.

It exports **dummy** env values first, because two apps throw at import time without them:

| Var | Why | Dummy is fine because |
|---|---|---|
| `PAYLOAD_SECRET` | `apps/admin/src/payload.config.ts` throws if unset | not verified during `next build` |
| `DATABASE_URL` | same | Payload's Postgres adapter connects lazily — never during `next build` |
| `NEXT_PUBLIC_CONVEX_URL` | `apps/web` `ConvexClientProvider` throws if unset | client only connects in the browser |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk middleware / provider | no network at build |
| `NEXT_PUBLIC_ADMIN_URL` | web reads it for the admin API base | — |

**CI must never point these at real infrastructure.** Next.js does not override variables already set in the environment, so the dummies win even when real `.env.local` files are present.

---

## Deployment (current state)

Both Next apps are hosted on **Vercel** with **Git integration on**: a merge to `main` auto-deploys **production** for `codememo-app` (web) and `admin-codememo-app` (admin). This is the interim setup — it will move behind a `release/1` promotion + approval gate (see *Planned* below).

### Database schema — the deploy-time migrate step

`apps/admin` uses Payload's Postgres adapter, which **only auto-pushes schema in dev**. Production expects migrations in `apps/admin/src/migrations/` to have already been applied.

Until the deploy pipeline runs it automatically, apply migrations by hand after merging a schema change:

```bash
# against the target database's DIRECT (unpooled) endpoint
DATABASE_URL='<neon-direct-url>' npm run migrate -w @repo/admin
npm run migrate:status -w @repo/admin   # confirm "Ran: Yes"
```

Scripts: `migrate:create` (generate from schema changes), `migrate` (apply), `migrate:status` (check).

### Database — Neon

Payload's Postgres is **Neon** (provisioned via the Vercel Marketplace, linked to `admin-codememo-app`).

- **Pooled** endpoint (`...-pooler...neon.tech`) → the running app (`DATABASE_URL`).
- **Direct** endpoint (no `-pooler`) → migrations and bulk loads.
- `staging` is a Neon **branch** off `production` (copy-on-write) — its own pooled string feeds the staging environment.

> Convex (the app backend for web + mobile) and Clerk (auth) are separate and unaffected by the CI/CD flow. Postgres is only Payload's storage.

---

## Planned (not yet built)

1. **Staging** — separate Vercel projects (`codememo-app-staging`, `admin-codememo-app-staging`), a staging Convex project, and the Neon `staging` branch. Merge to `main` → deploy staging.
2. **Production cutover** — turn Vercel Git integration **off**; deploys driven from Actions (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`); production promoted via a long-lived `release/1` branch behind a GitHub Environment approval gate.
3. **Migrate-on-deploy** — the deploy workflow runs `npm run migrate -w @repo/admin` against the target DB before the admin deploy goes live.
4. **Turbo remote cache** — `TURBO_TOKEN` / `TURBO_TEAM` from Vercel, to share the build cache with CI.

See the full phased plan in the team's CI/CD planning notes.
