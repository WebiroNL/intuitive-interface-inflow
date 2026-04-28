CREATE TABLE public.ads_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  name text NOT NULL,
  platforms text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ads_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage ads_campaigns"
  ON public.ads_campaigns FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients view own ads_campaigns"
  ON public.ads_campaigns FOR SELECT
  TO authenticated
  USING (client_id = get_my_client_id());

CREATE TRIGGER update_ads_campaigns_updated_at
  BEFORE UPDATE ON public.ads_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_ads_campaigns_client ON public.ads_campaigns(client_id);