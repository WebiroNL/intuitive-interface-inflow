
-- Auto-create client when a service_onboarding is submitted by a logged in user without a client record
CREATE OR REPLACE FUNCTION public.auto_link_or_create_client_for_onboarding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_client_id uuid;
  v_email text;
  v_name text;
  v_company text;
  v_phone text;
  v_slug text;
BEGIN
  IF NEW.client_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.submitted_by_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Try existing client linked to this user
  SELECT id INTO v_client_id FROM public.clients WHERE user_id = NEW.submitted_by_user_id LIMIT 1;

  IF v_client_id IS NULL THEN
    -- Pull profile info
    SELECT p.email, p.full_name INTO v_email, v_name
    FROM public.profiles p WHERE p.id = NEW.submitted_by_user_id;

    v_email := COALESCE(NEW.email, v_email, 'unknown@unknown.local');
    v_company := COALESCE(NULLIF(NEW.company_name,''), NULLIF(v_name,''), split_part(v_email,'@',1));
    v_phone := NEW.phone;

    v_slug := lower(regexp_replace(unaccent(coalesce(v_company,'klant')), '[^a-zA-Z0-9]+', '-', 'g'));
    v_slug := trim(both '-' from v_slug);
    IF v_slug = '' THEN v_slug := 'klant-' || substr(NEW.submitted_by_user_id::text,1,8); END IF;
    -- Ensure unique slug
    WHILE EXISTS (SELECT 1 FROM public.clients WHERE slug = v_slug) LOOP
      v_slug := v_slug || '-' || substr(md5(random()::text),1,4);
    END LOOP;

    INSERT INTO public.clients (user_id, slug, company_name, email, phone, contact_person, active, visible_menus, show_intake_form, show_website_intake_form, show_onboarding_form)
    VALUES (NEW.submitted_by_user_id, v_slug, v_company, v_email, v_phone, NULLIF(NEW.contact_person,''), true, '["dashboard"]'::jsonb, false, false, false)
    RETURNING id INTO v_client_id;
  END IF;

  NEW.client_id := v_client_id;
  RETURN NEW;
END;
$$;

-- unaccent might not exist; fall back gracefully
CREATE EXTENSION IF NOT EXISTS unaccent;

DROP TRIGGER IF EXISTS trg_auto_link_client_onboarding ON public.service_onboardings;
CREATE TRIGGER trg_auto_link_client_onboarding
  BEFORE INSERT ON public.service_onboardings
  FOR EACH ROW EXECUTE FUNCTION public.auto_link_or_create_client_for_onboarding();

-- Backfill: create clients for existing orphan submitted_by_user_id rows
DO $$
DECLARE
  r record;
  v_client_id uuid;
  v_email text;
  v_name text;
  v_company text;
  v_slug text;
BEGIN
  FOR r IN
    SELECT DISTINCT submitted_by_user_id
    FROM public.service_onboardings
    WHERE client_id IS NULL AND submitted_by_user_id IS NOT NULL
  LOOP
    SELECT id INTO v_client_id FROM public.clients WHERE user_id = r.submitted_by_user_id LIMIT 1;
    IF v_client_id IS NULL THEN
      SELECT email, full_name INTO v_email, v_name FROM public.profiles WHERE id = r.submitted_by_user_id;
      v_email := COALESCE(v_email,'unknown@unknown.local');
      v_company := COALESCE(NULLIF(v_name,''), split_part(v_email,'@',1));
      v_slug := lower(regexp_replace(v_company, '[^a-zA-Z0-9]+', '-', 'g'));
      v_slug := trim(both '-' from v_slug);
      IF v_slug = '' THEN v_slug := 'klant-' || substr(r.submitted_by_user_id::text,1,8); END IF;
      WHILE EXISTS (SELECT 1 FROM public.clients WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || substr(md5(random()::text),1,4);
      END LOOP;
      INSERT INTO public.clients (user_id, slug, company_name, email, active, visible_menus)
      VALUES (r.submitted_by_user_id, v_slug, v_company, v_email, true, '["dashboard"]'::jsonb)
      RETURNING id INTO v_client_id;
    END IF;
    UPDATE public.service_onboardings SET client_id = v_client_id
      WHERE submitted_by_user_id = r.submitted_by_user_id AND client_id IS NULL;
  END LOOP;
END $$;
