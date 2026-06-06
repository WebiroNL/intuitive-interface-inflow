
-- 1) partners: protect privileged fields on self-update
CREATE OR REPLACE FUNCTION public.protect_partner_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service role (auth.uid() is null) and admins can change anything
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.total_revenue IS DISTINCT FROM OLD.total_revenue
     OR NEW.total_commission IS DISTINCT FROM OLD.total_commission
     OR NEW.total_paid IS DISTINCT FROM OLD.total_paid
     OR NEW.pending_balance IS DISTINCT FROM OLD.pending_balance
     OR NEW.available_balance IS DISTINCT FROM OLD.available_balance
     OR NEW.total_referrals IS DISTINCT FROM OLD.total_referrals
     OR NEW.total_conversions IS DISTINCT FROM OLD.total_conversions
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.discount_code IS DISTINCT FROM OLD.discount_code
     OR NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Not allowed: privileged partner fields can only be changed by an administrator';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_partner_fields_trg ON public.partners;
CREATE TRIGGER protect_partner_fields_trg
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.protect_partner_fields();

-- 2) proposal_decisions: lock down public write access
DROP POLICY IF EXISTS "Anyone can delete proposal decisions" ON public.proposal_decisions;
DROP POLICY IF EXISTS "Anyone can update proposal decisions" ON public.proposal_decisions;
DROP POLICY IF EXISTS "Anyone can insert proposal decisions" ON public.proposal_decisions;

-- keep public SELECT (already exists)
-- allow a fresh decision to be inserted only when no row exists yet for that slug
CREATE POLICY "Public can submit a new proposal decision"
ON public.proposal_decisions
FOR INSERT
TO public
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.proposal_decisions p WHERE p.slug = proposal_decisions.slug)
);

-- only admins can update or delete proposal decisions
CREATE POLICY "Admins manage proposal decisions update"
ON public.proposal_decisions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage proposal decisions delete"
ON public.proposal_decisions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) app_settings: hide updated_by from anon/authenticated reads
REVOKE SELECT ON public.app_settings FROM anon, authenticated;
GRANT SELECT (key, value, updated_at) ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;

-- 4) email helper functions: set fixed search_path
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
