-- ============================================================
-- seed.sql — 23 canonical categories (ported from db/seeds.rb)
-- Run via: supabase db seed  OR  supabase db push --include-seed
-- ============================================================

INSERT INTO public.categories (name, slug, description) VALUES
  ('Help Needed',   'help-needed',   'Looking for practical help or assistance'),
  ('Advice',        'advice',        'Seeking guidance or life advice'),
  ('Jobs',          'jobs',          'Job opportunities and career listings'),
  ('Housing',       'housing',       'Roommates, sublets, and housing resources'),
  ('Education',     'education',     'Learning resources, tutoring, and study groups'),
  ('Wellness',      'wellness',      'Physical and mental wellness resources'),
  ('Services',      'services',      'Services offered or requested'),
  ('Journal',       'journal',       'Personal reflections and journaling'),
  ('Career',        'career',        'Career development and professional growth'),
  ('Mental Health', 'mental-health', 'Mental health support and discussion'),
  ('Romance',       'romance',       'Dating, relationships, and connection'),
  ('Self Love',     'self-love',     'Self-care and personal development'),
  ('Discussion',    'discussion',    'General community discussion'),
  ('Lifestyle',     'lifestyle',     'Daily life, habits, and routines'),
  ('Finance',       'finance',       'Personal finance and money management'),
  ('Donation',      'donation',      'Donation requests and giving back'),
  ('Events',        'events',        'Community events and gatherings'),
  ('Community',     'community',     'Community building and local connections'),
  ('POC',           'poc',           'Resources and discussion for people of colour'),
  ('LGBTQIA',       'lgbtqia',       'LGBTQIA+ support and community'),
  ('Youth',         'youth',         'Resources for young people'),
  ('Migrant',       'migrant',       'Resources and support for migrants'),
  ('Family',        'family',        'Family life and parenting')
ON CONFLICT (slug) DO NOTHING;
