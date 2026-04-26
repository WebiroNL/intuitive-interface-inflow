ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS show_onboarding_form boolean NOT NULL DEFAULT false;