-- Allow clients to update their own company info (limited fields only)
CREATE POLICY "Clients update own record"
ON public.clients
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Trigger function: prevent clients from changing protected fields
CREATE OR REPLACE FUNCTION public.protect_client_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can change everything
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Non-admin clients: lock down sensitive fields
  IF NEW.slug IS DISTINCT FROM OLD.slug
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.monthly_fee IS DISTINCT FROM OLD.monthly_fee
     OR NEW.active IS DISTINCT FROM OLD.active
     OR NEW.contract_duration IS DISTINCT FROM OLD.contract_duration
     OR NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Niet toegestaan: deze velden kunnen alleen door beheerders gewijzigd worden';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_client_fields_trigger ON public.clients;
CREATE TRIGGER protect_client_fields_trigger
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.protect_client_fields();