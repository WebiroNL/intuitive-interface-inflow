ALTER TABLE public.ads_campaigns
  ADD COLUMN IF NOT EXISTS contract_start_date date,
  ADD COLUMN IF NOT EXISTS contract_duration text,
  ADD COLUMN IF NOT EXISTS discount_months integer,
  ADD COLUMN IF NOT EXISTS discount_percentage numeric,
  ADD COLUMN IF NOT EXISTS discount_start_date date,
  ADD COLUMN IF NOT EXISTS deposit_percentage numeric DEFAULT 50;