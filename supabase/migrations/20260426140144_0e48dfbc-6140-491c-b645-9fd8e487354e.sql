-- Service onboarding submissions
CREATE TABLE public.service_onboardings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  submitted_by_user_id UUID,
  -- Algemene contactgegevens (voor publieke invul-flow zonder login)
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  -- Welke dienst betreft dit
  service_type TEXT NOT NULL,
  -- Antwoorden op de aanleverlijst voor die dienst
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Workflow
  status TEXT NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_onboardings_partner ON public.service_onboardings(partner_id);
CREATE INDEX idx_service_onboardings_client ON public.service_onboardings(client_id);
CREATE INDEX idx_service_onboardings_service ON public.service_onboardings(service_type);
CREATE INDEX idx_service_onboardings_status ON public.service_onboardings(status);

ALTER TABLE public.service_onboardings ENABLE ROW LEVEL SECURITY;

-- Admins manage everything
CREATE POLICY "Admins manage service_onboardings"
ON public.service_onboardings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone (incl. anonymous) can submit a new onboarding (public link)
CREATE POLICY "Anyone can submit onboarding"
ON public.service_onboardings FOR INSERT
TO anon, authenticated
WITH CHECK (
  status IN ('submitted', 'concept')
  AND admin_notes IS NULL
);

-- Partners view their own onboardings
CREATE POLICY "Partners view own onboardings"
ON public.service_onboardings FOR SELECT
TO authenticated
USING (partner_id = get_my_partner_id());

-- Partners update their own onboardings
CREATE POLICY "Partners update own onboardings"
ON public.service_onboardings FOR UPDATE
TO authenticated
USING (partner_id = get_my_partner_id())
WITH CHECK (partner_id = get_my_partner_id());

-- Clients view their own onboardings
CREATE POLICY "Clients view own onboardings"
ON public.service_onboardings FOR SELECT
TO authenticated
USING (client_id = get_my_client_id());

-- Clients update their own onboardings
CREATE POLICY "Clients update own onboardings"
ON public.service_onboardings FOR UPDATE
TO authenticated
USING (client_id = get_my_client_id())
WITH CHECK (client_id = get_my_client_id());

-- Trigger for updated_at
CREATE TRIGGER update_service_onboardings_updated_at
BEFORE UPDATE ON public.service_onboardings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();