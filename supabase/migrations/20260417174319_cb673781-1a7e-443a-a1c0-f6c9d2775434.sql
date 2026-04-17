-- Deposit percentage on clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS deposit_percentage numeric DEFAULT 50;

-- Client services (contract lines)
CREATE TABLE IF NOT EXISTS public.client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_type text NOT NULL,        -- 'package' | 'cms' | 'addon' | 'marketing' | 'custom'
  service_id text,                    -- key from data.ts (e.g. 'groei', 'pro', 'webiro-care')
  service_name text NOT NULL,
  category text,
  one_time_price numeric DEFAULT 0,
  monthly_price numeric DEFAULT 0,
  quantity integer DEFAULT 1,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_services_client ON public.client_services(client_id);

ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage client_services" ON public.client_services;
CREATE POLICY "Admins manage client_services"
  ON public.client_services FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients view own services" ON public.client_services;
CREATE POLICY "Clients view own services"
  ON public.client_services FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());

DROP TRIGGER IF EXISTS set_client_services_updated_at ON public.client_services;
CREATE TRIGGER set_client_services_updated_at
  BEFORE UPDATE ON public.client_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Protect deposit_percentage from client self-edits
CREATE OR REPLACE FUNCTION public.protect_client_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.slug IS DISTINCT FROM OLD.slug
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.monthly_fee IS DISTINCT FROM OLD.monthly_fee
     OR NEW.active IS DISTINCT FROM OLD.active
     OR NEW.contract_duration IS DISTINCT FROM OLD.contract_duration
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.discount_months IS DISTINCT FROM OLD.discount_months
     OR NEW.discount_percentage IS DISTINCT FROM OLD.discount_percentage
     OR NEW.deposit_percentage IS DISTINCT FROM OLD.deposit_percentage THEN
    RAISE EXCEPTION 'Niet toegestaan: deze velden kunnen alleen door beheerders gewijzigd worden';
  END IF;

  RETURN NEW;
END;
$$;