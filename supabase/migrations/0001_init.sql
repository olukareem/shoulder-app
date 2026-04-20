-- ============================================================
-- 0001_init.sql — Core tables, indexes, foreign keys
-- ============================================================

-- Enable citext for case-insensitive username
CREATE EXTENSION IF NOT EXISTS citext;

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username    CITEXT  NOT NULL,
  full_name   TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  location    TEXT,
  website     TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT profiles_username_unique UNIQUE (username),
  CONSTRAINT profiles_username_length CHECK (char_length(username) BETWEEN 2 AND 30),
  CONSTRAINT profiles_username_format CHECK (username ~ '^[a-zA-Z0-9]+$')
);

-- ============================================================
-- categories  (seeded, not user-created)
-- ============================================================
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT categories_slug_unique UNIQUE (slug),
  CONSTRAINT categories_name_unique UNIQUE (name)
);

-- ============================================================
-- posts
-- ============================================================
CREATE TABLE public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  excerpt      TEXT,
  body         JSONB NOT NULL DEFAULT '{}',
  body_text    TEXT,  -- denormalised plain text for FTS (updated by trigger)
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'published')),
  view_count   INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT posts_slug_unique       UNIQUE (slug),
  CONSTRAINT posts_title_length      CHECK (char_length(title) BETWEEN 4 AND 100),
  CONSTRAINT posts_excerpt_length    CHECK (excerpt IS NULL OR char_length(excerpt) BETWEEN 4 AND 300)
);

-- ============================================================
-- post_categories  (many-to-many join)
-- ============================================================
CREATE TABLE public.post_categories (
  post_id     UUID NOT NULL REFERENCES public.posts      (id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,

  PRIMARY KEY (post_id, category_id)
);

-- ============================================================
-- bookmarks
-- ============================================================
CREATE TABLE public.bookmarks (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  post_id    UUID NOT NULL REFERENCES public.posts    (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, post_id)
);

-- ============================================================
-- follows
-- ============================================================
CREATE TABLE public.follows (
  follower_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self_follow CHECK (follower_id <> following_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX posts_author_idx        ON public.posts (author_id);
CREATE INDEX posts_status_pub_idx    ON public.posts (status, published_at DESC)
  WHERE status = 'published';
CREATE INDEX posts_view_count_idx    ON public.posts (view_count DESC);
CREATE INDEX post_categories_cat_idx ON public.post_categories (category_id);
CREATE INDEX follows_following_idx   ON public.follows (following_id);
CREATE INDEX follows_follower_idx    ON public.follows (follower_id);
CREATE INDEX bookmarks_user_idx      ON public.bookmarks (user_id, created_at DESC);
