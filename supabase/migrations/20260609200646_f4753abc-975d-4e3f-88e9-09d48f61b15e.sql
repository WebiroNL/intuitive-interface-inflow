
-- 1) Tighten anonymous onboarding insert
DROP POLICY IF EXISTS "Anyone can submit onboarding" ON public.service_onboardings;

CREATE POLICY "Anyone can submit onboarding"
ON public.service_onboardings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = ANY (ARRAY['submitted'::text, 'concept'::text])
  AND admin_notes IS NULL
  AND (
    -- Anonymous submissions: must not claim ownership
    (auth.uid() IS NULL AND client_id IS NULL AND partner_id IS NULL)
    OR
    -- Authenticated: may only set ids to their own
    (
      auth.uid() IS NOT NULL
      AND (client_id IS NULL OR client_id = public.get_my_client_id())
      AND (partner_id IS NULL OR partner_id = public.get_my_partner_id())
    )
  )
);

-- 2) Allow users to read their own role(s)
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3) Drop redundant always-true policies (service_role bypasses RLS)
DROP POLICY IF EXISTS "Service role manages payments" ON public.payments;
DROP POLICY IF EXISTS "Service role manages payment links" ON public.payment_links;
DROP POLICY IF EXISTS "Service role manages subscriptions" ON public.subscriptions;
