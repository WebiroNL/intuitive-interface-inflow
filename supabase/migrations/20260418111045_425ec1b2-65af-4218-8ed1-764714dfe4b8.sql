-- 1. Toggle op clients
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS show_intake_form boolean NOT NULL DEFAULT false;

-- 2. Marketing intakes tabel
CREATE TABLE IF NOT EXISTS public.marketing_intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'concept',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_intakes_client ON public.marketing_intakes(client_id);

ALTER TABLE public.marketing_intakes ENABLE ROW LEVEL SECURITY;

-- Admins beheren alles
CREATE POLICY "Admins manage marketing_intakes"
ON public.marketing_intakes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Klanten lezen eigen intake
CREATE POLICY "Clients view own intake"
ON public.marketing_intakes
FOR SELECT
TO authenticated
USING (client_id = get_my_client_id());

-- Klanten maken eigen intake
CREATE POLICY "Clients insert own intake"
ON public.marketing_intakes
FOR INSERT
TO authenticated
WITH CHECK (client_id = get_my_client_id());

-- Klanten updaten eigen intake
CREATE POLICY "Clients update own intake"
ON public.marketing_intakes
FOR UPDATE
TO authenticated
USING (client_id = get_my_client_id())
WITH CHECK (client_id = get_my_client_id());

-- Updated_at trigger
CREATE TRIGGER update_marketing_intakes_updated_at
BEFORE UPDATE ON public.marketing_intakes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();