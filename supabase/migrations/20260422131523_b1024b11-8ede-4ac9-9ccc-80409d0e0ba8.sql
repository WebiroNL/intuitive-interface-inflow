
-- Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_partner_code(prefix TEXT DEFAULT 'WEB')
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    new_code := prefix || '-' || upper(substring(md5(random()::text || clock_timestamp()::text), 1, 6));
    done := NOT EXISTS (SELECT 1 FROM public.partners WHERE referral_code = new_code OR discount_code = new_code);
  END LOOP;
  RETURN new_code;
END;
$$;

-- Tighten "Anyone can apply" — applicants must not pre-set sensitive financial fields
DROP POLICY IF EXISTS "Anyone can apply" ON public.partners;
CREATE POLICY "Anyone can apply as partner" ON public.partners FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND total_revenue = 0
  AND total_commission = 0
  AND total_paid = 0
  AND pending_balance = 0
  AND available_balance = 0
  AND approved_at IS NULL
  AND approved_by IS NULL
  AND tier = 'bronze'
);

-- Tighten "Anyone can track referrals" — must reference an existing partner code
DROP POLICY IF EXISTS "Anyone can track referrals" ON public.partner_referrals;
CREATE POLICY "Anyone can track valid referrals" ON public.partner_referrals FOR INSERT TO anon, authenticated
WITH CHECK (
  converted = false
  AND converted_order_id IS NULL
  AND converted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.status = 'approved')
);
