-- ============================================================
-- 0002_rls.sql — Row Level Security policies
-- ============================================================
-- RLS is Postgres-enforced authorization. Every table gets it.
-- This replaces the missing/broken Rails before_action checks.

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- profiles
-- ============================================================
-- Anyone can read any profile
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

-- Only the profile owner can update their own row
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Inserts are handled exclusively by the handle_new_user trigger (SECURITY DEFINER)
-- so we do NOT create an INSERT policy here. This blocks direct client inserts.

-- ============================================================
-- categories  (read-only from client; admin inserts via service role)
-- ============================================================
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

-- No INSERT / UPDATE / DELETE policy → only service role (migrations, seed) can write

-- ============================================================
-- posts
-- ============================================================
-- Published posts are visible to everyone; drafts only to their author
CREATE POLICY "posts_select_visible"
  ON public.posts FOR SELECT
  USING (
    status = 'published'
    OR (auth.uid() IS NOT NULL AND author_id = auth.uid())
  );

-- Authenticated user can create posts (author_id enforced to their own uid)
CREATE POLICY "posts_insert_own"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Author can edit their own post
CREATE POLICY "posts_update_own"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Author can delete their own post
CREATE POLICY "posts_delete_own"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================
-- post_categories
-- ============================================================
-- Visible if the associated post is visible
CREATE POLICY "post_categories_select_visible"
  ON public.post_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id
        AND (p.status = 'published' OR p.author_id = auth.uid())
    )
  );

-- Post author manages their own post's categories
CREATE POLICY "post_categories_insert_own"
  ON public.post_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "post_categories_delete_own"
  ON public.post_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id AND p.author_id = auth.uid()
    )
  );

-- ============================================================
-- bookmarks  (private to owner)
-- ============================================================
CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- follows  (counts are public; mutation is own follower_id only)
-- ============================================================
CREATE POLICY "follows_select_public"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "follows_insert_own"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete_own"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);
