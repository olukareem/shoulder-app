# shoulder

A blogging resource for help, advice, and services — a space where writers post on the things that matter: jobs, wellness, community, finance, mental health, and more.

---

## Features

- Rich-text post editor (Tiptap) with draft autosave every 30 seconds
- Publish / unpublish toggle from the author dashboard
- Category tagging across 23 curated topics
- Full-text search with highlighted snippets
- Follow authors — personalized feed of posts from people you follow
- Bookmark posts — saved privately to your account
- Per-post view counts (atomic, race-condition safe)
- Public author profiles with follower/following counts
- Magic link and email/password sign-in
- Dark/light/system theme
- Dynamic OG images for social sharing
- Auto-generated sitemap and robots.txt
- JSON-LD structured data on every post

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + @tailwindcss/typography |
| Editor | Tiptap |
| Database / Auth | Supabase (PostgreSQL + RLS + Auth) |
| Hosting | Vercel |

## Local setup

**Prerequisites:** Node 18+, Docker (for Supabase local stack)

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start the Supabase local stack (requires Docker)
npx supabase start

# 4. Apply migrations and seed categories
npx supabase db push

# 5. Generate TypeScript types from the schema
npx supabase gen types typescript --local > lib/types/database.ts

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never exposed to browser) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for OG images and sitemap (e.g. `https://shoulder.vercel.app`) |

## Deploy

**Supabase:** Create a project at [supabase.com](https://supabase.com), link it (`npx supabase link --project-ref <ref>`), then push migrations (`npx supabase db push`).

**Vercel:** Import the repo, set the four env vars above, deploy. No build config needed — Next.js is auto-detected.

## Database migrations

Migrations live in `supabase/migrations/` and run in order:

| File | Contents |
|---|---|
| `0001_init.sql` | Tables, foreign keys, indexes |
| `0002_rls.sql` | Row Level Security policies |
| `0003_triggers.sql` | Profile-on-signup trigger, updated_at, Tiptap text extraction |
| `0004_rpc.sql` | `increment_view_count`, `get_feed` RPCs |
| `0005_fts.sql` | pg_trgm + tsvector column + `search_posts` RPC |

`supabase/seed.sql` inserts the 23 canonical categories.
