-- ============================================================
-- 0003_triggers.sql — Automation triggers
-- ============================================================

-- ============================================================
-- 1. Create profile row on new auth.users signup
--    SECURITY DEFINER so it can bypass profiles INSERT RLS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      -- fallback: derive from email prefix, strip non-alphanumeric
      regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9]', '', 'g')
    ),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (username) DO UPDATE
    -- If username already taken, append first 6 chars of uid
    SET username = EXCLUDED.username || substring(NEW.id::text, 1, 6);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. Auto-update updated_at on profiles and posts
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. Set published_at when a post transitions to 'published'
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status <> 'published' OR OLD.published_at IS NULL) THEN
    NEW.published_at = now();
  END IF;
  -- If unpublished, clear published_at so it doesn't appear in feeds
  IF NEW.status = 'draft' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER posts_set_published_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

-- ============================================================
-- 4. Sync body_text from Tiptap JSON body for full-text search
--    Recursively extracts all text nodes from the Tiptap doc tree
-- ============================================================
CREATE OR REPLACE FUNCTION public.extract_tiptap_text(doc JSONB)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT string_agg(t, ' ')
  FROM (
    SELECT jsonb_path_query(doc, '$.**.text') #>> '{}' AS t
  ) sub
  WHERE t IS NOT NULL AND t <> '';
$$;

CREATE OR REPLACE FUNCTION public.sync_body_text()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.body_text = public.extract_tiptap_text(NEW.body);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER posts_sync_body_text
  BEFORE INSERT OR UPDATE OF body ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.sync_body_text();
