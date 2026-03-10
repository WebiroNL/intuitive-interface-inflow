
-- Fix 1: Set search_path on generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'WEB-' || TO_CHAR(now(), 'YYMM') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Fix 2: Replace permissive anon insert policy with restricted fields
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT TO anon
  WITH CHECK (
    naam IS NOT NULL AND email IS NOT NULL AND status = 'nieuw'
  );
