ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS kvk_number text,
  ADD COLUMN IF NOT EXISTS btw_number text,
  ADD COLUMN IF NOT EXISTS discount_months integer,
  ADD COLUMN IF NOT EXISTS discount_percentage numeric;

-- Update protect_client_fields trigger function so klanten deze nieuwe gevoelige velden niet zelf kunnen wijzigen
CREATE OR REPLACE FUNCTION public.protect_client_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
     OR NEW.discount_percentage IS DISTINCT FROM OLD.discount_percentage THEN
    RAISE EXCEPTION 'Niet toegestaan: deze velden kunnen alleen door beheerders gewijzigd worden';
  END IF;

  RETURN NEW;
END;
$function$;