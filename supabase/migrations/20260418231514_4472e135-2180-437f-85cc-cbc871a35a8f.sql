-- Add category column
ALTER TABLE public.legal_pages
ADD COLUMN category TEXT NOT NULL DEFAULT 'legal';

-- Seed "Over ons" page
INSERT INTO public.legal_pages (slug, title, subtitle, content, sort_order, category) VALUES
('over-ons', 'Over ons', 'Wie is Webiro',
'<h2>Wij zijn Webiro</h2><p>Webiro is een digitaal bureau dat ondernemers helpt online verder te groeien. Met een combinatie van strakke websites, doordachte marketing en bewezen processen bouwen we aan duurzame digitale resultaten.</p><h2>Onze missie</h2><p>Wij geloven dat elke ondernemer toegang verdient tot een professionele online aanwezigheid. Daarom combineren we design, technologie en marketing in heldere pakketten zonder verborgen kosten.</p><h2>Wat we doen</h2><p><strong>Websites</strong> die laden in een fractie van een seconde, mobielvriendelijk zijn en converteren.</p><p><strong>Marketing</strong> via Google, Meta, LinkedIn en meer — datagedreven en transparant gerapporteerd.</p><p><strong>Strategie</strong> die past bij jouw bedrijf, doelgroep en groeiambitie.</p><h2>Waarom Webiro</h2><p>Korte lijnen, vaste contactpersonen en een dashboard waarin je altijd ziet wat we doen. Geen jargon, geen verrassingen — wel groei.</p>',
1, 'bedrijf');