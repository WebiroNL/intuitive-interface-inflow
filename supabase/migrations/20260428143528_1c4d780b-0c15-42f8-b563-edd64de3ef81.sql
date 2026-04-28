ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS contract_start_date date,
  ADD COLUMN IF NOT EXISTS discount_start_date date;