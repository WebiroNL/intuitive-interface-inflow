-- Nieuwe tabel voor Website Intake (zelfde structuur als marketing_intakes)
CREATE TABLE public.website_intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'concept',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.website_intakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage website_intakes"
  ON public.website_intakes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients view own website_intake"
  ON public.website_intakes FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());

CREATE POLICY "Clients insert own website_intake"
  ON public.website_intakes FOR INSERT TO authenticated
  WITH CHECK (client_id = get_my_client_id());

CREATE POLICY "Clients update own website_intake"
  ON public.website_intakes FOR UPDATE TO authenticated
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

CREATE TRIGGER update_website_intakes_updated_at
  BEFORE UPDATE ON public.website_intakes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extra kolommen op clients voor website-intake configuratie per klant
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS show_website_intake_form boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS website_intake_sections jsonb NOT NULL DEFAULT '["__all__"]'::jsonb,
  ADD COLUMN IF NOT EXISTS website_intake_labels jsonb NOT NULL DEFAULT '{}'::jsonb;