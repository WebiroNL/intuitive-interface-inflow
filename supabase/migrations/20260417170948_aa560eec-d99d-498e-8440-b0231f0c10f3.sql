ALTER TABLE public.monthly_data
  -- Google
  ADD COLUMN IF NOT EXISTS google_impressions integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_reach integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_frequency numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_link_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_lpv integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS google_cpm numeric DEFAULT 0,
  -- Meta
  ADD COLUMN IF NOT EXISTS meta_impressions integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_reach integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_frequency numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_link_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_lpv integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meta_cpm numeric DEFAULT 0,
  -- TikTok
  ADD COLUMN IF NOT EXISTS tiktok_impressions integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_reach integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_frequency numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_link_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_lpv integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tiktok_cpm numeric DEFAULT 0,
  -- Social growth
  ADD COLUMN IF NOT EXISTS instagram_growth integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS facebook_growth integer DEFAULT 0,
  -- Benchmarks
  ADD COLUMN IF NOT EXISTS benchmark_lpv_cost numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS benchmark_ctr numeric DEFAULT 0,
  -- Bullet content
  ADD COLUMN IF NOT EXISTS summary_bullets jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS recommendation_bullets jsonb DEFAULT '[]'::jsonb;