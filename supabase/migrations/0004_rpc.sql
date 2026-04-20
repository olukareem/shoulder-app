-- ============================================================
-- 0004_rpc.sql — Remote procedure calls for complex queries
-- ============================================================

-- ============================================================
-- 1. increment_view_count
--    Atomic update — no client read-modify-write race condition.
--    SECURITY DEFINER so it can update view_count regardless of RLS.
--    (RLS does not cover UPDATE on author_id=viewer, so this is needed.)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_view_count(post_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE slug = post_slug
    AND status = 'published';
END;
$$;

-- Revoke direct execute from anon, allow authenticated and service_role
REVOKE ALL ON FUNCTION public.increment_view_count(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_view_count(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_view_count(TEXT) TO service_role;

-- ============================================================
-- 2. get_feed — personalised feed of posts from followed authors
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_feed(
  user_id    UUID,
  page_size  INTEGER DEFAULT 12,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id           UUID,
  author_id    UUID,
  title        TEXT,
  slug         TEXT,
  excerpt      TEXT,
  status       TEXT,
  view_count   INTEGER,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id, p.author_id, p.title, p.slug, p.excerpt,
    p.status, p.view_count, p.published_at, p.created_at, p.updated_at
  FROM public.posts p
  WHERE p.status = 'published'
    AND p.author_id IN (
      SELECT following_id
      FROM public.follows
      WHERE follower_id = get_feed.user_id
    )
  ORDER BY p.published_at DESC
  LIMIT  get_feed.page_size
  OFFSET get_feed.page_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(UUID, INTEGER, INTEGER) TO authenticated;
