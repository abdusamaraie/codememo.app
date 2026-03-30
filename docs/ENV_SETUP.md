# Environment Variable Setup

This guide covers all environment variables required to run the CodeMemo monorepo apps locally and in production.

## Prerequisites

1. **Convex account** — [convex.dev](https://convex.dev) (free tier works)
2. **Clerk account** — [clerk.com](https://clerk.com) (free tier works)
3. **Supabase (PostgreSQL)** — [supabase.com](https://supabase.com) for the admin CMS database
4. **Anthropic API key** (optional) — for AI hints feature in the study mode

---

## `apps/web` — Next.js Web App

Copy `.env.example` → `.env.local` and fill in:

| Variable | Description | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL (`https://....convex.cloud`) | Convex Dashboard → Settings → URL |
| `NEXT_PUBLIC_ADMIN_URL` | PayloadCMS admin URL (default: `http://localhost:3001`) | Local: keep default; Production: admin app domain |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_...`) | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key (`sk_test_...`) | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) | Clerk Dashboard → Webhooks → select endpoint |

**Clerk Webhook setup:**
1. In Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://<your-domain>/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy the Signing Secret into `CLERK_WEBHOOK_SECRET`

---

## `apps/admin` — PayloadCMS Admin

Copy `.env.example` → `.env` and fill in:

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Supabase: Settings → Database → Transaction pooler URI |
| `PAYLOAD_SECRET` | Min 32-char secret for JWT signing | `openssl rand -base64 32` |
| `RESEND_API_KEY` | Email sending API key | [resend.com/api-keys](https://resend.com/api-keys) |
| `CONVEX_HTTP_URL` | Convex HTTP actions URL (`https://....convex.site`) | Convex Dashboard → Settings → URL (`.convex.site` variant) |
| `CONVEX_SYNC_SECRET` | Shared secret for webhook auth | `openssl rand -base64 32` (must match Convex env var) |
| `CORS_ORIGINS` | Comma-separated production origins | `https://app.codememo.dev,https://codememo.dev` |

---

## `apps/mobile` — Expo Mobile App

Create `apps/mobile/.env` (not committed):

| Variable | Description | Where to get it |
|---|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | Same Convex URL as web | Convex Dashboard → Settings → URL |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same Clerk key as web | Clerk Dashboard → API Keys |

In `apps/mobile/app.json`, update the `extra` section:
```json
{
  "extra": {
    "convexUrl": "https://your-deployment.convex.cloud",
    "clerkPublishableKey": "pk_..."
  }
}
```

---

## Convex Backend

The Convex backend requires its own environment variables set via the Convex CLI or Dashboard:

```bash
npx convex env set ANTHROPIC_API_KEY sk-ant-...   # For AI hint generation
npx convex env set CONVEX_SYNC_SECRET your-secret  # Must match admin CONVEX_SYNC_SECRET
npx convex env set CLERK_SECRET_KEY sk_test_...    # For verifying Clerk tokens
```

Run the Convex dev server (generates `_generated/` types):
```bash
cd packages/convex && npx convex dev
```

---

## Quick Start (Local)

```bash
# 1. Clone and install
git clone https://github.com/your-org/codememo-app
npm install

# 2. Set up env files
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env
# Fill in the values above

# 3. Start all services
npm run dev

# 4. (Optional) Seed content
cd apps/admin && npx payload seed
```

---

## Production Checklist

- [ ] All `NEXT_PUBLIC_*` vars set in Vercel/hosting dashboard
- [ ] `CLERK_WEBHOOK_SECRET` points to production domain
- [ ] `DATABASE_URL` uses production Supabase (connection pooler)
- [ ] Convex deployment is set to `production` profile
- [ ] `CONVEX_SYNC_SECRET` is a strong random value and matches on both sides
- [ ] `PAYLOAD_SECRET` is at least 32 characters
- [ ] `RESEND_API_KEY` is a production key (not test)
