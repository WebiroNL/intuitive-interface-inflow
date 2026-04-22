
-- ============================================
-- PARTNER PROGRAM SCHEMA
-- ============================================

-- Enums
CREATE TYPE public.partner_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE public.partner_tier_name AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE public.partner_commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE public.partner_payout_status AS ENUM ('requested', 'approved', 'paid', 'rejected');
CREATE TYPE public.partner_product_type AS ENUM ('website_package', 'marketing_service', 'shop_product', 'addon', 'cms_hosting', 'other');
CREATE TYPE public.partner_conversion_source AS ENUM ('link', 'code', 'manual');

-- ============================================
-- PARTNER TIERS (config table, admin manages)
-- ============================================
CREATE TABLE public.partner_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier partner_tier_name NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  min_revenue NUMERIC NOT NULL DEFAULT 0,
  max_revenue NUMERIC,
  commission_website NUMERIC NOT NULL DEFAULT 10,
  commission_marketing NUMERIC NOT NULL DEFAULT 10,
  commission_shop NUMERIC NOT NULL DEFAULT 10,
  commission_addon NUMERIC NOT NULL DEFAULT 10,
  customer_discount NUMERIC NOT NULL DEFAULT 5,
  color TEXT NOT NULL DEFAULT '#CD7F32',
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default tiers
INSERT INTO public.partner_tiers (tier, display_name, description, min_revenue, max_revenue, commission_website, commission_marketing, commission_shop, commission_addon, customer_discount, color, sort_order, benefits) VALUES
('bronze', 'Bronze Partner', 'Startend partner — perfect om te beginnen', 0, 5000, 10, 8, 10, 8, 5, '#CD7F32', 1, '["Persoonlijke referral link", "Eigen kortingscode", "Maandelijks dashboard", "Marketing materialen"]'::jsonb),
('silver', 'Silver Partner', 'Bewezen partner — hogere commissies', 5000, 25000, 15, 12, 15, 12, 7, '#C0C0C0', 2, '["Alles van Bronze", "Hogere commissies", "Voorrangs support", "Co-branded materiaal"]'::jsonb),
('gold', 'Gold Partner', 'Top partner — maximale beloning', 25000, NULL, 20, 18, 20, 18, 10, '#FFD700', 3, '["Alles van Silver", "Maximale commissies", "Persoonlijke account manager", "Exclusieve leads", "Custom marketing"]'::jsonb);

-- ============================================
-- PARTNERS
-- ============================================
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  kvk_number TEXT,
  btw_number TEXT,
  iban TEXT,
  bank_name TEXT,
  address_street TEXT,
  address_city TEXT,
  address_postal TEXT,
  address_country TEXT DEFAULT 'NL',
  status partner_status NOT NULL DEFAULT 'pending',
  tier partner_tier_name NOT NULL DEFAULT 'bronze',
  referral_code TEXT NOT NULL UNIQUE,
  discount_code TEXT NOT NULL UNIQUE,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  total_commission NUMERIC NOT NULL DEFAULT 0,
  total_paid NUMERIC NOT NULL DEFAULT 0,
  pending_balance NUMERIC NOT NULL DEFAULT 0,
  available_balance NUMERIC NOT NULL DEFAULT 0,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  agreed_terms_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_user_id ON public.partners(user_id);
CREATE INDEX idx_partners_referral_code ON public.partners(referral_code);
CREATE INDEX idx_partners_discount_code ON public.partners(discount_code);
CREATE INDEX idx_partners_status ON public.partners(status);

-- ============================================
-- PARTNER REFERRALS (click tracking)
-- ============================================
CREATE TABLE public.partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  landing_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN NOT NULL DEFAULT false,
  converted_order_id UUID,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partner_referrals_partner ON public.partner_referrals(partner_id);
CREATE INDEX idx_partner_referrals_code ON public.partner_referrals(referral_code);
CREATE INDEX idx_partner_referrals_created ON public.partner_referrals(created_at DESC);

-- ============================================
-- PARTNER COMMISSIONS
-- ============================================
CREATE TABLE public.partner_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  order_id UUID,
  shopify_order_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  product_type partner_product_type NOT NULL,
  product_name TEXT NOT NULL,
  product_id TEXT,
  sale_amount NUMERIC NOT NULL DEFAULT 0,
  commission_percentage NUMERIC NOT NULL DEFAULT 0,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_months INTEGER,
  status partner_commission_status NOT NULL DEFAULT 'pending',
  conversion_source partner_conversion_source NOT NULL DEFAULT 'link',
  payout_id UUID,
  notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partner_commissions_partner ON public.partner_commissions(partner_id);
CREATE INDEX idx_partner_commissions_status ON public.partner_commissions(status);
CREATE INDEX idx_partner_commissions_order ON public.partner_commissions(order_id);

-- ============================================
-- PARTNER PAYOUTS
-- ============================================
CREATE TABLE public.partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  status partner_payout_status NOT NULL DEFAULT 'requested',
  iban TEXT,
  bank_reference TEXT,
  invoice_url TEXT,
  invoice_number TEXT,
  paid_at TIMESTAMPTZ,
  paid_by UUID,
  rejection_reason TEXT,
  admin_notes TEXT,
  partner_notes TEXT,
  commission_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partner_payouts_partner ON public.partner_payouts(partner_id);
CREATE INDEX idx_partner_payouts_status ON public.partner_payouts(status);

-- ============================================
-- PARTNER ASSETS (marketing materials)
-- ============================================
CREATE TABLE public.partner_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  asset_type TEXT NOT NULL DEFAULT 'document',
  category TEXT NOT NULL DEFAULT 'general',
  file_size INTEGER,
  mime_type TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  min_tier partner_tier_name NOT NULL DEFAULT 'bronze',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get partner ID for currently authenticated user
CREATE OR REPLACE FUNCTION public.get_my_partner_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.partners WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_partner_code(prefix TEXT DEFAULT 'WEB')
RETURNS TEXT
LANGUAGE plpgsql
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

-- Recalculate partner balances after commission/payout changes
CREATE OR REPLACE FUNCTION public.recalculate_partner_balance(p_partner_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_revenue NUMERIC;
  v_total_commission NUMERIC;
  v_pending NUMERIC;
  v_available NUMERIC;
  v_paid NUMERIC;
  v_referrals INTEGER;
  v_conversions INTEGER;
  v_new_tier partner_tier_name;
BEGIN
  SELECT COALESCE(SUM(sale_amount), 0), COALESCE(SUM(commission_amount), 0)
    INTO v_total_revenue, v_total_commission
  FROM public.partner_commissions
  WHERE partner_id = p_partner_id AND status IN ('approved', 'paid');

  SELECT COALESCE(SUM(commission_amount), 0) INTO v_pending
  FROM public.partner_commissions
  WHERE partner_id = p_partner_id AND status = 'pending';

  SELECT COALESCE(SUM(commission_amount), 0) INTO v_available
  FROM public.partner_commissions
  WHERE partner_id = p_partner_id AND status = 'approved';

  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM public.partner_payouts
  WHERE partner_id = p_partner_id AND status = 'paid';

  SELECT COUNT(*) INTO v_referrals FROM public.partner_referrals WHERE partner_id = p_partner_id;
  SELECT COUNT(*) INTO v_conversions FROM public.partner_referrals WHERE partner_id = p_partner_id AND converted = true;

  -- Auto upgrade tier based on total revenue
  SELECT tier INTO v_new_tier FROM public.partner_tiers
  WHERE min_revenue <= v_total_revenue AND (max_revenue IS NULL OR max_revenue > v_total_revenue)
  ORDER BY min_revenue DESC LIMIT 1;

  UPDATE public.partners
    SET total_revenue = v_total_revenue,
        total_commission = v_total_commission,
        pending_balance = v_pending,
        available_balance = v_available,
        total_paid = v_paid,
        total_referrals = v_referrals,
        total_conversions = v_conversions,
        tier = COALESCE(v_new_tier, tier),
        updated_at = now()
    WHERE id = p_partner_id;
END;
$$;

-- Trigger to recalc on commission changes
CREATE OR REPLACE FUNCTION public.trigger_recalc_partner_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_partner_balance(OLD.partner_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_partner_balance(NEW.partner_id);
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER trg_commission_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.partner_commissions
FOR EACH ROW EXECUTE FUNCTION public.trigger_recalc_partner_balance();

CREATE TRIGGER trg_payout_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.partner_payouts
FOR EACH ROW EXECUTE FUNCTION public.trigger_recalc_partner_balance();

-- updated_at triggers
CREATE TRIGGER trg_partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_partner_tiers_updated BEFORE UPDATE ON public.partner_tiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_partner_commissions_updated BEFORE UPDATE ON public.partner_commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_partner_payouts_updated BEFORE UPDATE ON public.partner_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_partner_assets_updated BEFORE UPDATE ON public.partner_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_assets ENABLE ROW LEVEL SECURITY;

-- Partners
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners view own record" ON public.partners FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Partners update own record" ON public.partners FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anyone can apply" ON public.partners FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND total_revenue = 0 AND total_commission = 0 AND total_paid = 0);

-- Tiers — public read, admin manage
CREATE POLICY "Anyone reads tiers" ON public.partner_tiers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage tiers" ON public.partner_tiers FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Referrals — anyone can insert (tracking), partners view own, admins manage
CREATE POLICY "Anyone can track referrals" ON public.partner_referrals FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Partners view own referrals" ON public.partner_referrals FOR SELECT TO authenticated
  USING (partner_id = get_my_partner_id());
CREATE POLICY "Admins manage referrals" ON public.partner_referrals FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Commissions
CREATE POLICY "Partners view own commissions" ON public.partner_commissions FOR SELECT TO authenticated
  USING (partner_id = get_my_partner_id());
CREATE POLICY "Admins manage commissions" ON public.partner_commissions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Payouts
CREATE POLICY "Partners view own payouts" ON public.partner_payouts FOR SELECT TO authenticated
  USING (partner_id = get_my_partner_id());
CREATE POLICY "Partners request own payouts" ON public.partner_payouts FOR INSERT TO authenticated
  WITH CHECK (partner_id = get_my_partner_id() AND status = 'requested');
CREATE POLICY "Admins manage payouts" ON public.partner_payouts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Assets — partners read active, admins manage
CREATE POLICY "Partners view active assets" ON public.partner_assets FOR SELECT TO authenticated
  USING (active = true AND get_my_partner_id() IS NOT NULL);
CREATE POLICY "Admins manage assets" ON public.partner_assets FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
