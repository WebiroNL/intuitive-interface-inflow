-- Insert the documentation page as a legal_pages row so it can be edited via admin
INSERT INTO public.legal_pages (slug, title, subtitle, category, sort_order, published, content)
VALUES (
  'documentatie',
  'Alles wat je moet weten om met Webiro te werken',
  'Praktische handleidingen voor je dashboard, campagnes, facturen en bestanden.',
  'bedrijf',
  10,
  true,
  $html$
<h2>Aan de slag</h2>
<p>Welkom bij Webiro. Na ondertekening van je offerte ontvang je per e-mail een uitnodiging om je account aan te maken op <a href="/inloggen">webiro.nl/inloggen</a>. Stel een wachtwoord in en je hebt direct toegang tot je persoonlijke klantportaal.</p>
<p>In het portaal vind je alles bij elkaar: de status van je project, lopende campagnes, rapportages, contracten, facturen, bestanden en updates van ons team.</p>
<p><strong>Tip:</strong> bewaar de inloglink in je browser-favorieten en stel desgewenst een two-factor authenticatie in via je accountinstellingen.</p>

<h2>Je account beheren</h2>
<p>Onder <strong>Account</strong> beheer je je persoonlijke gegevens, bedrijfsinformatie (KVK, BTW), contactpersoon en factuurgegevens. Wijzigingen worden direct verwerkt.</p>
<p>Wachtwoord vergeten? Gebruik de "Wachtwoord vergeten" link op de inlogpagina. Je ontvangt binnen enkele minuten een herstellink op je geregistreerde e-mailadres.</p>

<h2>Het dashboard</h2>
<p>Het dashboard is je centrale werkplek. Hier zie je realtime de belangrijkste KPI's van je marketing, openstaande acties en de laatste updates van ons team.</p>
<p>Aan de linkerzijde navigeer je tussen onderdelen: Dashboard, Campagnes, Rapportages, Contract, Financieel, Bestanden, Updates en Account. Welke menu's je ziet, hangt af van je pakket.</p>
<p>Met de <strong>maand-selector</strong> rechtsboven schakel je tussen perioden. Cijfers, grafieken en rapportages passen zich automatisch aan.</p>

<h2>Intake formulieren</h2>
<p>Bij de start van een nieuw project vragen we je een intake in te vullen. Er zijn twee varianten: een <strong>website intake</strong> (voor design en ontwikkeling) en een <strong>marketing intake</strong> (voor campagnes en strategie).</p>
<p>De formulieren slaan automatisch je voortgang op. Je kunt op elk moment stoppen en later verder gaan. Velden die we al kennen worden vooraf ingevuld. Lever waar mogelijk merkrichtlijnen, voorbeelden en toegangen aan, dan kunnen we sneller schakelen.</p>

<h2>Campagnes</h2>
<p>Onder <strong>Campagnes</strong> zie je per maand de prestaties van Google Ads, Meta, LinkedIn, TikTok, Pinterest, YouTube en Snapchat, afhankelijk van welke kanalen we voor je inzetten. Cijfers worden automatisch ingeladen vanuit de bron.</p>
<p>Per platform vind je impressies, bereik, kliks, CTR, CPC, conversies en CPA. Naast de absolute cijfers zie je ook benchmarks en de vergelijking met de vorige periode.</p>
<p>Onderaan elke maandweergave staat een korte AI-samenvatting in begrijpelijke taal, handig om snel inzicht te krijgen zonder zelf alle cijfers te interpreteren.</p>

<h2>Rapportages</h2>
<p>Onder <strong>Rapportages</strong> vind je per maand een complete analyse: prestaties, inzichten, aanbevelingen van ons team en de geplande acties voor de komende periode.</p>
<p>Elke rapportage is downloadbaar als PDF. Handig om intern te delen of te bewaren in je eigen archief.</p>

<h2>Contract en afspraken</h2>
<p>Onder <strong>Contract</strong> staan je actuele afspraken: contractduur, opzegtermijn, maandelijks tarief, eventuele kortingen en de scope van de samenwerking. Wijzigingen worden in overleg doorgevoerd en zijn direct zichtbaar.</p>

<h2>Financieel en facturen</h2>
<p>Onder <strong>Financieel</strong> vind je al je facturen. Status, vervaldatum en bedrag zijn direct zichtbaar. Openstaande facturen kun je in één klik online betalen via de meegestuurde betaallink.</p>
<p>Elke factuur is downloadbaar als PDF voor je eigen administratie of accountant.</p>

<h2>Bestanden</h2>
<p>Onder <strong>Bestanden</strong> staan documenten, ontwerpen, exports en andere assets die we delen. Je kunt ook zelf bestanden uploaden, sleep ze direct in het venster. Wij ontvangen automatisch een melding zodra er iets nieuws binnenkomt.</p>

<h2>Updates van ons team</h2>
<p>Onder <strong>Updates</strong> zie je een tijdlijn van alles wat er rond jouw project gebeurt: opgeleverde mijlpalen, nieuwe campagnes, A/B-tests, optimalisaties en aankondigingen. Zo blijf je altijd op de hoogte zonder lange e-mailthreads.</p>

<h2>Support en contact</h2>
<p>Vraag of probleem? Neem contact op via <a href="/contact">/contact</a>, mail naar <a href="mailto:info@webiro.nl">info@webiro.nl</a> of bel <a href="tel:+31850608521">085 060 8521</a>.</p>
<p>Onze reactietijd is binnen <strong>één werkdag</strong>. Voor urgente zaken (live-issues, advertentie-spend) bellen we je dezelfde dag terug.</p>
$html$
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published,
  content = EXCLUDED.content;