ALTER TABLE public.monthly_data
  ADD COLUMN IF NOT EXISTS ai_reach_text text,
  ADD COLUMN IF NOT EXISTS ai_benchmark_text text,
  ADD COLUMN IF NOT EXISTS ai_plain_language jsonb DEFAULT '[]'::jsonb;