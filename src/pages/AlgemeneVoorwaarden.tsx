import { TypewriterText } from '../components/TypewriterText';
import { useEffect } from 'react';
import { updatePageMeta } from '../utils/seo';

export function AlgemeneVoorwaarden() {
  useEffect(() => {
    updatePageMeta(
      'Algemene Voorwaarden',
      'Lees de algemene voorwaarden van Webiro. Transparante afspraken over dienstverlening, betaling, intellectueel eigendom en aansprakelijkheid.'
    );
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-background dark:from-[#1a1719] dark:to-background py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-foreground mb-6 text-4xl md:text-5xl lg:text-6xl font-bold transition-colors">
            <TypewriterText text="Algemene Voorwaarden" speed={60} />
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto transition-colors">
            Versie: november 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-secondary dark:bg-[#1a1719] p-6 rounded-xl mb-8 transition-colors border border-primary/20">
              <p className="text-foreground mb-2 transition-colors">
                <strong className="text-foreground">KvK:</strong> 71179003
              </p>
              <p className="text-foreground mb-2 transition-colors">
                <strong className="text-foreground">E-mailadres:</strong> info@webiro.nl
              </p>
              <p className="text-foreground transition-colors">
                <strong className="text-foreground">Website:</strong> www.webiro.nl
              </p>
            </div>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              1. Toepasselijkheid
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Deze algemene voorwaarden zijn van toepassing op alle offertes, opdrachten en overeenkomsten tussen Webiro en haar klanten, tenzij schriftelijk anders is overeengekomen.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              2. Offertes en prijzen
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Alle offertes van Webiro zijn vrijblijvend en 14 dagen geldig, tenzij anders vermeld.
              Alle prijzen zijn exclusief btw. Webiro behoudt zich het recht voor prijzen te wijzigen, maar nooit voor reeds geaccepteerde offertes.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              3. Diensten
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro levert webdesign, onderhoud, en aanverwante digitale diensten zoals omschreven in de overeengekomen offerte of pakketomschrijving.
              Wij streven naar een hoogwaardige oplevering binnen de afgesproken termijn, maar kleine afwijkingen in planning of functionaliteit geven geen recht op schadevergoeding of ontbinding.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              4. Verantwoordelijkheden van de klant
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              De klant zorgt tijdig voor alle benodigde informatie, teksten, afbeeldingen en inloggegevens.
              Vertraging in aanlevering kan leiden tot verlenging van de oplevertermijn.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              5. Betaling
              <span className="text-primary">.</span>
            </h2>
            
            <h3 className="text-foreground mb-3 text-xl font-semibold transition-colors">
              5.1 Bestelling en akkoord
            </h3>
            <p className="text-muted-foreground mb-6 transition-colors">
              Door het invullen van het bestelformulier met het geselecteerde pakket en projectgegevens, gaat de klant akkoord met de bestelling tegen de op dat moment vermelde prijs en deze algemene voorwaarden.
            </p>

            <h3 className="text-foreground mb-3 text-xl font-semibold transition-colors">
              5.2 Facturering en vooruitbetaling
            </h3>
            <p className="text-muted-foreground mb-6 transition-colors">
              Na het invullen van het bestelformulier ontvangt de klant een factuur inclusief betaallink. Het gehele proces en alle werkzaamheden starten pas nadat de betaling volledig is voldaan.
            </p>

            <h3 className="text-foreground mb-3 text-xl font-semibold transition-colors">
              5.3 Betaaltermijn
            </h3>
            <p className="text-muted-foreground mb-6 transition-colors">
              Betaling dient te geschieden binnen 14 dagen na factuurdatum, tenzij anders overeengekomen. Bij te late betaling mag Webiro de start van de werkzaamheden uitstellen en wettelijke rente en incassokosten in rekening brengen.
            </p>

            <h3 className="text-foreground mb-3 text-xl font-semibold transition-colors">
              5.4 Oplevering en definitieve akkoord
            </h3>
            <p className="text-muted-foreground mb-6 transition-colors">
              Voor de definitieve oplevering krijgt de klant de gelegenheid om de website te controleren. Zodra de klant akkoord geeft dat alles naar wens is, vervalt het recht op terugbetaling.
            </p>

            <h3 className="text-foreground mb-3 text-xl font-semibold transition-colors">
              5.5 Geld-terug-garantie
            </h3>
            <p className="text-muted-foreground mb-8 transition-colors">
              Tot het moment van definitieve oplevering hanteert Webiro een tevredenheidsgarantie. De geld-terug-garantie vervalt na definitieve oplevering en akkoord.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              6. Intellectueel eigendom
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Alle ontwerpen, code, afbeeldingen en content blijven eigendom van Webiro tot volledige betaling van de factuur.
              Na betaling krijgt de klant het niet-exclusieve recht om de website te gebruiken voor eigen doeleinden.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              7. Aanpassingen en revisies
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Bij elk pakket is een vooraf vastgesteld aantal revisierondes inbegrepen. Extra aanpassingen worden gefactureerd tegen het op dat moment geldende uurtarief.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              8. Hosting en onderhoud
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Wanneer Webiro hosting of onderhoud levert, zal zij zich inspannen om continuïteit en veiligheid te waarborgen.
              Webiro is niet aansprakelijk voor downtime of dataverlies bij externe hostingproviders.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              9. Aansprakelijkheid
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro is niet aansprakelijk voor indirecte schade, winstderving of gevolgschade.
              De aansprakelijkheid is in alle gevallen beperkt tot het bedrag van de betreffende factuur.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              10. Beëindiging
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Beide partijen kunnen de overeenkomst schriftelijk beëindigen met een opzegtermijn van 30 dagen, tenzij anders overeengekomen.
              Bij voortijdige beëindiging worden de reeds uitgevoerde werkzaamheden naar rato gefactureerd.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              11. Overmacht
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro is niet aansprakelijk bij overmacht, waaronder storingen, ziekte, pandemieën, netwerkproblemen of vertraging door derden.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              12. Toepasselijk recht
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de rechtbank Midden-Nederland.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-primary-foreground mb-6 text-4xl md:text-5xl font-bold">
            <TypewriterText text="Vragen over onze voorwaarden?" speed={60} delay={300} />
          </h2>
          <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
            Neem gerust contact met ons op als je vragen hebt over onze algemene voorwaarden.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-background text-primary rounded-full hover:bg-webiro-yellow hover:text-foreground transition-all hover:shadow-xl font-semibold"
          >
            Neem contact op
          </a>
        </div>
      </section>
    </div>
  );
}

export default AlgemeneVoorwaarden;
