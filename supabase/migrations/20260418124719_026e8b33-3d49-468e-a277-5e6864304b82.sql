ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS intake_labels jsonb NOT NULL DEFAULT '{}'::jsonb;