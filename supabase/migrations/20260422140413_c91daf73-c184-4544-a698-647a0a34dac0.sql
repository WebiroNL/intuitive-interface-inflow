-- Showcase items table for the homepage portfolio section
CREATE TABLE public.showcase_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  tint TEXT NOT NULL DEFAULT '234,82%,57%',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published showcase items"
  ON public.showcase_items FOR SELECT
  USING (published = true);

CREATE POLICY "Admins manage showcase items"
  ON public.showcase_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_showcase_items_updated_at
BEFORE UPDATE ON public.showcase_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with current showcase data
INSERT INTO public.showcase_items (title, category, url, description, services, tint, sort_order) VALUES
('Allround Training Center', 'Sport & Fitness', 'https://www.allroundtrainingcenter.nl', 'Custom gebouwde website met eigen backend, AI livechat en full SEO-pakket. Inclusief volledige Google Ads strategie.', ARRAY['Custom Website','Branding','AI Livechat','SEO','Google Ads'], '234,82%,57%', 10),
('Matrix City', 'Fitness', 'https://www.matrixcity.nl', 'Complete digitale transformatie: van logo tot advertentiecampagnes die elke maand nieuwe leden opleveren.', ARRAY['Branding','Website','Google Ads'], '16,85%,55%', 20),
('CKN Legal', 'Juridisch', 'https://www.cknlegal.com', 'Professionele huisstijl en website die vertrouwen uitstraalt voor een groeiend advocatenkantoor.', ARRAY['Branding','Website'], '215,55%,40%', 30),
('Elektroza', 'Techniek', 'https://www.elektroza.nl', 'Conversiegericht ontwerp met lokale SEO-strategie voor meer offerteaanvragen in de regio.', ARRAY['Website','SEO'], '44,90%,55%', 40),
('Coco De Rio', 'Fashion', 'https://cocoderio.com', 'Shopify webshop met Meta advertenties en geautomatiseerde e-mailflows voor hogere retentie.', ARRAY['Website','Meta Ads','E-mail'], '330,75%,60%', 50),
('Prokick Academie', 'Sport', 'https://www.prokickacademie.nl', 'Moderne website en Google Ads campagne die structureel nieuwe aanmeldingen genereren.', ARRAY['Website','Google Ads'], '0,75%,55%', 60);