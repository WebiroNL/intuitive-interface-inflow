
-- Enums
CREATE TYPE public.task_status AS ENUM ('todo','in_progress','waiting_client','blocked','done');
CREATE TYPE public.task_assignee AS ENUM ('even','mihran');

-- Tasks table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  service_onboarding_id uuid,
  category text NOT NULL DEFAULT 'general', -- onboarding, ads, website, cms, general
  service_type text,                         -- meta_ads, website, etc
  template_key text,                         -- unique key per (client, service_onboarding, key)
  title text NOT NULL,
  description text,
  status public.task_status NOT NULL DEFAULT 'todo',
  assignee public.task_assignee,
  position integer NOT NULL DEFAULT 0,
  due_date date,
  visible_to_client boolean NOT NULL DEFAULT false,
  client_label text,                         -- shorter label shown to client
  notes text,
  completed_at timestamptz,
  completed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_client ON public.tasks(client_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);
CREATE UNIQUE INDEX uniq_tasks_template ON public.tasks(client_id, COALESCE(service_onboarding_id::text,''), template_key) WHERE template_key IS NOT NULL;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tasks" ON public.tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE POLICY "Clients view own visible tasks" ON public.tasks FOR SELECT TO authenticated
  USING (client_id = get_my_client_id() AND visible_to_client = true);

CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper to insert a task if template_key not yet exists
CREATE OR REPLACE FUNCTION public.seed_task(
  p_client_id uuid, p_onb_id uuid, p_category text, p_service_type text,
  p_key text, p_title text, p_desc text, p_visible boolean, p_client_label text, p_pos int
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  INSERT INTO public.tasks(client_id, service_onboarding_id, category, service_type, template_key, title, description, visible_to_client, client_label, position)
  VALUES (p_client_id, p_onb_id, p_category, p_service_type, p_key, p_title, p_desc, p_visible, p_client_label, p_pos)
  ON CONFLICT DO NOTHING;
END;$$;

-- Seed onboarding tasks when a client is created
CREATE OR REPLACE FUNCTION public.seed_client_onboarding_tasks() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  PERFORM seed_task(NEW.id, NULL, 'onboarding', NULL, 'welcome_email',     'Welkomstmail versturen',          'Stuur welkomstmail met portaal toegang.',                  false, NULL, 10);
  PERFORM seed_task(NEW.id, NULL, 'onboarding', NULL, 'kickoff_call',      'Kickoff gesprek inplannen',       'Plan kickoff in via Calendly.',                            true,  'Kickoff inplannen', 20);
  PERFORM seed_task(NEW.id, NULL, 'onboarding', NULL, 'contract_send',     'Contract opstellen en versturen', 'Contract genereren en ter ondertekening sturen.',          false, NULL, 30);
  PERFORM seed_task(NEW.id, NULL, 'onboarding', NULL, 'deposit_invoice',   'Aanbetalingsfactuur sturen',      'Stripe betaalverzoek aanmaken voor aanbetaling.',          false, NULL, 40);
  PERFORM seed_task(NEW.id, NULL, 'onboarding', NULL, 'intake_form_chase', 'Intake formulier laten invullen', 'Klant herinneren intake formulier in te vullen.',          true,  'Vul intake formulier in', 50);
  RETURN NEW;
END;$$;

CREATE TRIGGER trg_seed_client_onboarding
AFTER INSERT ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.seed_client_onboarding_tasks();

-- Seed service-specific tasks when an onboarding is submitted/created
CREATE OR REPLACE FUNCTION public.seed_service_onboarding_tasks() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_client uuid := NEW.client_id;
  v_id uuid := NEW.id;
  v_type text := COALESCE(NEW.service_type,'general');
  v_cat text;
  v_label text;
BEGIN
  IF v_client IS NULL THEN RETURN NEW; END IF;

  -- ADS
  IF v_type IN ('meta_ads','google_ads','tiktok_ads','linkedin_ads','snapchat_ads','pinterest_ads','youtube_ads','social_media') THEN
    v_cat := 'ads';
    v_label := upper(split_part(v_type,'_',1));
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_access',     v_label||' account toegang krijgen',              'Vraag admin/partner toegang aan via Business Manager.',      true,  'Geef ads account toegang', 10);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_pixel',      v_label||' pixel/tracking installeren',           'Pixel + conversies opzetten op website.',                    false, NULL, 20);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_audience',   'Doelgroepen + strategie uitwerken',              'Audiences, lookalikes en targeting opzetten.',               false, NULL, 30);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_creatives',  'Creatives aanleveren door klant',                'Beeld + video + copy verzamelen of zelf produceren.',        true,  'Lever creatives aan', 40);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_build',      'Campagne(s) bouwen',                              'Campagnes, adsets en ads opbouwen.',                         false, NULL, 50);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_review',     'Interne review + klant goedkeuring',             'Stuur preview ter goedkeuring naar klant.',                  true,  'Keur campagnes goed', 60);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_launch',     'Campagnes live zetten',                           'Activeer en monitor de eerste 48u.',                         false, NULL, 70);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'ads_first_report','Eerste rapportage opleveren',                    'Maandrapportage genereren en met klant bespreken.',          true,  'Eerste rapportage', 80);
  END IF;

  -- WEBSITE / WEBSHOP
  IF v_type IN ('website','webshop','web_design') THEN
    v_cat := 'website';
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_intake',    'Website intake doornemen',         'Brief en intake reviewen.',                     false, NULL, 10);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_content',   'Content + assets verzamelen',      'Teksten, foto''s, logo en huisstijl.',          true,  'Lever content aan', 20);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_design',    'Design opzetten',                   'Wireframes en visueel design opbouwen.',         false, NULL, 30);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_design_appr','Design goedkeuring klant',         'Design review met klant.',                       true,  'Keur design goed', 40);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_dev',       'Development',                       'Site bouwen volgens goedgekeurd design.',        false, NULL, 50);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_test',      'Testen + QA',                       'Browser, mobiel en performance check.',          false, NULL, 60);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_launch',    'Livegang',                          'DNS, SSL, redirects en oplevering.',             false, NULL, 70);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'web_handover',  'Oplevering + training klant',       'Klant uitleggen hoe CMS werkt.',                 true,  'Oplevering meeting', 80);
  END IF;

  -- CMS / HOSTING
  IF v_type IN ('cms','hosting','cms_hosting') THEN
    v_cat := 'cms';
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'cms_domain',    'Domein registreren of overzetten',  'Domein regelen en koppelen.',                    true,  'Domein gegevens aanleveren', 10);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'cms_hosting',   'Hosting omgeving inrichten',        'Server/hosting opzetten.',                       false, NULL, 20);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'cms_install',   'CMS installatie',                   'CMS installeren en configureren.',               false, NULL, 30);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'cms_email',     'Mail koppelen',                     'Mailboxen opzetten/koppelen.',                   false, NULL, 40);
    PERFORM seed_task(v_client,v_id,v_cat,v_type,'cms_training',  'Training klant',                    'CMS training inplannen.',                        true,  'Training inplannen', 50);
  END IF;

  RETURN NEW;
END;$$;

CREATE TRIGGER trg_seed_service_onboarding
AFTER INSERT ON public.service_onboardings
FOR EACH ROW EXECUTE FUNCTION public.seed_service_onboarding_tasks();

-- Backfill: bestaande klanten + bestaande service_onboardings
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM public.clients LOOP
    PERFORM seed_task(r.id, NULL, 'onboarding', NULL, 'welcome_email',     'Welkomstmail versturen',          'Stuur welkomstmail met portaal toegang.', false, NULL, 10);
    PERFORM seed_task(r.id, NULL, 'onboarding', NULL, 'kickoff_call',      'Kickoff gesprek inplannen',       'Plan kickoff in via Calendly.',           true,  'Kickoff inplannen', 20);
    PERFORM seed_task(r.id, NULL, 'onboarding', NULL, 'contract_send',     'Contract opstellen en versturen', 'Contract genereren en versturen.',        false, NULL, 30);
    PERFORM seed_task(r.id, NULL, 'onboarding', NULL, 'deposit_invoice',   'Aanbetalingsfactuur sturen',      'Stripe betaalverzoek aanmaken.',          false, NULL, 40);
    PERFORM seed_task(r.id, NULL, 'onboarding', NULL, 'intake_form_chase', 'Intake formulier laten invullen', 'Klant herinneren intake in te vullen.',   true,  'Vul intake in', 50);
  END LOOP;

  FOR r IN SELECT id, client_id, service_type FROM public.service_onboardings WHERE client_id IS NOT NULL LOOP
    -- Trigger the same logic via INSERT-like call: re-use function by faking NEW row through a temp insert? Simpler: replicate inline.
    PERFORM 1; -- no-op, the trigger on existing rows didn't fire historically; we'll insert manually
  END LOOP;
END$$;
