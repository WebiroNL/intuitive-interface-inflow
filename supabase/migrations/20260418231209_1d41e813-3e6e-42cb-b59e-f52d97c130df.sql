-- Create legal_pages table
CREATE TABLE public.legal_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read published pages
CREATE POLICY "Anyone can read published legal pages"
ON public.legal_pages
FOR SELECT
USING (published = true);

-- Admins can do everything
CREATE POLICY "Admins manage legal pages"
ON public.legal_pages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_legal_pages_updated_at
BEFORE UPDATE ON public.legal_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed bestaande pagina's
INSERT INTO public.legal_pages (slug, title, subtitle, content, sort_order) VALUES
('algemene-voorwaarden', 'Algemene Voorwaarden', 'Versie: november 2025',
'<h2>1. Toepasselijkheid</h2><p>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, overeenkomsten en leveringen van Webiro.</p><h2>2. Offertes</h2><p>Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders aangegeven.</p><h2>3. Betaling</h2><p>Facturen dienen binnen 14 dagen na factuurdatum betaald te worden.</p><h2>4. Levering</h2><p>Levertijden zijn indicatief. Webiro spant zich in om afgesproken termijnen te halen.</p><h2>5. Aansprakelijkheid</h2><p>Webiro is niet aansprakelijk voor indirecte schade. De aansprakelijkheid is beperkt tot het factuurbedrag.</p><h2>6. Intellectueel eigendom</h2><p>Alle rechten op geleverde werken blijven bij Webiro tot volledige betaling heeft plaatsgevonden.</p><h2>7. Toepasselijk recht</h2><p>Op alle overeenkomsten is Nederlands recht van toepassing.</p>',
1),
('privacy-policy', 'Privacy Policy', 'Versie: november 2025',
'<h2>1. Wie zijn wij</h2><p>Webiro is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring.</p><h2>2. Welke gegevens verzamelen wij</h2><p>Wij verwerken naam, e-mailadres, telefoonnummer, bedrijfsgegevens en gegevens over jouw gebruik van onze website.</p><h2>3. Doel van de verwerking</h2><p>Wij gebruiken deze gegevens om contact met je op te nemen, onze diensten te leveren en de website te verbeteren.</p><h2>4. Delen met derden</h2><p>Wij delen gegevens alleen met derden als dit nodig is voor de uitvoering van onze diensten of als de wet dit vereist.</p><h2>5. Beveiliging</h2><p>Wij nemen passende maatregelen om jouw gegevens te beschermen tegen verlies of onrechtmatig gebruik.</p><h2>6. Jouw rechten</h2><p>Je hebt recht op inzage, correctie en verwijdering van je gegevens. Stuur een verzoek naar info@webiro.nl.</p><h2>7. Bewaartermijn</h2><p>Wij bewaren persoonsgegevens niet langer dan noodzakelijk.</p>',
2),
('disclaimer', 'Disclaimer', 'Versie: november 2025',
'<h2>1. Algemeen</h2><p>De informatie op deze website wordt door Webiro met zorg samengesteld. Desondanks kunnen er geen rechten worden ontleend aan de informatie op deze website.</p><h2>2. Aansprakelijkheid</h2><p>Webiro is niet aansprakelijk voor enige directe of indirecte schade die zou kunnen ontstaan door het gebruik van de op deze website aangeboden informatie of diensten.</p><h2>3. Intellectueel eigendom</h2><p>Alle teksten, afbeeldingen, logo''s en andere materialen op deze website zijn eigendom van Webiro of haar licentiegevers.</p><h2>4. Externe links</h2><p>Deze website kan links bevatten naar externe websites. Webiro is niet verantwoordelijk voor de inhoud of het privacybeleid van deze externe websites.</p><h2>5. Wijzigingen</h2><p>Webiro behoudt zich het recht voor om de inhoud van deze disclaimer te allen tijde aan te passen.</p>',
3),
('cookiebeleid', 'Cookiebeleid', 'Versie: november 2025',
'<h2>1. Wat zijn cookies?</h2><p>Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt.</p><h2>2. Welke cookies gebruiken wij?</h2><p><strong>Functionele cookies:</strong> nodig voor de basiswerking van de website.</p><p><strong>Analytische cookies:</strong> we verzamelen bezoekersstatistieken.</p><p><strong>Marketing cookies:</strong> via Meta Pixel en vergelijkbare tools meten we de effectiviteit van advertenties.</p><h2>3. Cookies van derden</h2><p>Wij maken gebruik van diensten van derden zoals Google Analytics, Meta, LinkedIn en YouTube.</p><h2>4. Cookies beheren</h2><p>Je kunt cookies altijd beheren of verwijderen via de instellingen van je browser.</p><h2>5. Wijzigingen</h2><p>Webiro behoudt zich het recht voor dit cookiebeleid aan te passen.</p>',
4);