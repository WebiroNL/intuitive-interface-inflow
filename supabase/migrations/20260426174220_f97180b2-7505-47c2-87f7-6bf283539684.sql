CREATE OR REPLACE FUNCTION public.protect_client_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Service role (edge functions) en admins mogen alle velden wijzigen.
  -- auth.uid() is NULL wanneer de service role wordt gebruikt.
  IF auth.uid() IS NULL OR has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- De klant zelf (via portaal) mag bepaalde admin-velden niet aanpassen.
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
$function$;