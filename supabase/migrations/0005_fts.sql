-- ============================================================
-- 0005_fts.sql — Full-text search with pg_trgm + tsvector
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- 1. tsvector column + GIN index
-- ============================================================
-- unaccent() is STABLE not IMMUTABLE; cannot use it in a GENERATED column.
-- Search queries use plain tsvector here; unaccent applied at query time only.
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS search_tsv TSVECTOR
    GENERATED ALWAYS AS (
      to_tsvector(
        'english',
        coalesce(title, '') || ' ' ||
        coalesce(excerpt, '') || ' ' ||
        coalesce(body_text, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS posts_search_tsv_idx
  ON public.posts USING GIN (search_tsv);

-- Trigram index on title for fuzzy/partial-match prefix search
CREATE INDEX IF NOT EXISTS posts_title_trgm_idx
  ON public.posts USING GIN (title gin_trgm_ops);

-- ============================================================
-- 2. search_posts RPC
--    Returns ranked results with ts_headline snippet for highlighting
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_posts(
  q           TEXT,
  page_size   INTEGER DEFAULT 12,
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
  headline     TEXT,
  rank         FLOAT4
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH query AS (
    SELECT plainto_tsquery('english', q) AS tsq
  )
  SELECT
    p.id,
    p.author_id,
    p.title,
    p.slug,
    p.excerpt,
    p.status,
    p.view_count,
    p.published_at,
    p.created_at,
    ts_headline(
      'english',
      coalesce(p.excerpt, left(p.body_text, 300), ''),
      (SELECT tsq FROM query),
      'MaxFragments=1,MaxWords=30,MinWords=10,StartSel=<mark>,StopSel=</mark>'
    ) AS headline,
    ts_rank_cd(p.search_tsv, (SELECT tsq FROM query)) AS rank
  FROM public.posts p, query
  WHERE p.status = 'published'
    AND (
      p.search_tsv @@ query.tsq
      OR p.title ILIKE '%' || q || '%'
    )
  ORDER BY rank DESC, p.published_at DESC
  LIMIT  search_posts.page_size
  OFFSET search_posts.page_offset;
$$;

GRANT EXECUTE ON FUNCTION public.search_posts(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.search_posts(TEXT, INTEGER, INTEGER) TO authenticated;
