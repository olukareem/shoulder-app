# shoulder

A blogging platform for the things people actually need help with — jobs, housing, wellness, finance, community, mental health. Writers publish long-form posts organized by topic; readers follow authors, bookmark posts, and find what they need through full-text search.

**Live:** [shoulder-seven.vercel.app](https://shoulder-seven.vercel.app)

<!-- Add screenshots or a short GIF of the reading + editor flow here -->

---

## About this project

Shoulder began as a Rails 6 API + React CRA app in 2020. In 2026 it was rebuilt as a single TypeScript codebase on Next.js 16 and Supabase — same brand and product, rewritten from scratch to:

- consolidate two separate codebases (Ruby backend, JavaScript frontend) into one
- move authorization out of hand-written `before_action` guards and into Postgres Row Level Security
- ship features the original never had: drafts with autosave, full-text search, follows, bookmarks, per-post view counts, human-readable slugs, dark mode, SEO
- replace a manually-managed JWT + localStorage auth flow with Supabase's cookie-based SSR auth

The archived Rails/CRA history lives on an older tag; this repo is the rewrite.

---

## Features

**Reading**
- Full-text search (PostgreSQL `tsvector` + `pg_trgm` for typo tolerance) with highlighted snippets
- Browse by any of 23 curated topics: jobs, advice, housing, wellness, mental health, LGBTQIA, migrant, community, and more
- Personalized feed of posts from authors you follow
- Per-post view counts that stay accurate under concurrent traffic (atomic RPC, not client-side reads)

**Writing**
- Rich-text editor (Tiptap 3) storing structured JSON, not HTML strings
- Draft autosave every 30 seconds — no lost work
- Publish / unpublish toggle from the author dashboard
- Slugs auto-generated from titles, collision-safe

**Identity**
- Email / password and magic-link sign-in
- Public author profiles with follower / following counts
- Bookmarks, private to each user
- Dark, light, and system themes

**Platform**
- Dynamic Open Graph images per post (`next/og`)
- Auto-generated `sitemap.xml` and `robots.txt`
- JSON-LD `BlogPosting` structured data on every post
- Mobile-first layouts tested at 375px

---

## Architecture

```
app/                Next.js App Router — all routes, layouts, API handlers
  (auth)/             Public auth pages (sign-in, sign-up)
  (main)/             Authenticated shell with header + nav
  api/                Route handlers (autosave, increment-view, OG image)
  auth/callback       Supabase confirmation redirect target
components/         UI primitives, post components, editor, nav, SEO helpers
lib/
  supabase/           Client + server + proxy session helpers
  db/                 Typed query functions — the only place that talks to Supabase
  validation/         Zod schemas for post + user input
  types/database.ts   Generated from the live Supabase schema
supabase/
  migrations/         Schema, RLS, triggers, RPCs, full-text search (5 files)
  seed.sql            23 canonical categories
proxy.ts            Session refresh + route protection (Next 16 Proxy)
```

### Authorization

Every table has Row Level Security enabled. Policies are declarative SQL, not application code:

- `posts`: readers see published posts or their own drafts; only the author can edit or delete
- `bookmarks`, `follows`: users can only read and write their own rows
- `profiles`: public read, self-only update, no direct insert (profile rows are created by a `SECURITY DEFINER` trigger when a new `auth.users` row lands)
- `categories`: public read, no writes except by the service role during migrations

Bypassing the Next.js layer by calling the Supabase REST API with a stolen token still fails at the Postgres engine. No JavaScript required.

---

## Local setup

**Requires:** Node 20.9+, Docker (Supabase's local stack runs in containers).

```bash
npm install
cp .env.example .env.local       # fill in the Supabase + site values

npx supabase start               # boots Postgres, Auth, Storage locally
npx supabase db push             # applies migrations 0001–0005 + seed
npx supabase gen types typescript --local > lib/types/database.ts

npm run dev                      # http://localhost:3000
```

## Environment variables

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public, inlined at build) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key used by the browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin key; never exposed to the browser |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (e.g. `https://shoulder-seven.vercel.app`); used in OG tags, sitemap, and auth redirect URLs |

## Deploy

**Supabase.** Create a project at [supabase.com](https://supabase.com), then:

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```

In the dashboard, add your deployed URL to `Auth → URL Configuration → Redirect URLs` with a `/**` suffix so email-confirmation callbacks succeed.

**Vercel.** Import the repo, set the four environment variables above, and deploy. Next.js is auto-detected — no build config needed. Push to `master` and Vercel will rebuild.

---

## Database

| Migration | What it adds |
|---|---|
| `0001_init.sql` | Tables, foreign keys, indexes |
| `0002_rls.sql` | Row Level Security policies for every table |
| `0003_triggers.sql` | Profile-on-signup trigger, `updated_at`, Tiptap → plain-text extraction |
| `0004_rpc.sql` | `increment_view_count`, `get_feed` RPCs |
| `0005_fts.sql` | `pg_trgm` + `tsvector` generated column + `search_posts` RPC |

`supabase/seed.sql` inserts the 23 canonical categories used throughout the app.
