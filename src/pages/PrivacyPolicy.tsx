import { TypewriterText } from '@/components/TypewriterText';
import { useEffect } from 'react';
import { updatePageMeta } from '@/utils/seo';

export function PrivacyPolicy() {
  useEffect(() => {
    updatePageMeta(
      'Privacy Policy - Privacyverklaring',
      'Webiro respecteert jouw privacy. Lees hier hoe wij omgaan met je persoonsgegevens volgens de AVG wetgeving.'
    );
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-background dark:from-[#1a1719] dark:to-background py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-foreground mb-6 text-4xl md:text-5xl lg:text-6xl font-bold transition-colors">
            <TypewriterText text="Privacy Policy" speed={60} />
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
              1. Inleiding
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro respecteert jouw privacy en gaat zorgvuldig om met persoonlijke gegevens.
              In dit beleid lees je welke gegevens we verzamelen, waarom, en hoe we deze beschermen.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              2. Welke gegevens we verzamelen
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-4 transition-colors">
              Wij verzamelen enkel gegevens die nodig zijn om onze diensten te leveren, zoals:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2 transition-colors">
              <li>Naam, e-mailadres en telefoonnummer</li>
              <li>Bedrijfsgegevens (zoals KvK en btw-nummer)</li>
              <li>Betaal- en factuurgegevens</li>
              <li>Technische gegevens (IP-adres, browser, tijdstip van bezoek)</li>
            </ul>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              3. Doeleinden van verwerking
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-4 transition-colors">
              We gebruiken deze gegevens voor:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-8 space-y-2 transition-colors">
              <li>Het uitvoeren van onze diensten en overeenkomsten</li>
              <li>Het versturen van offertes en facturen</li>
              <li>Klantcommunicatie en support</li>
              <li>Verbetering van onze website en dienstverlening</li>
              <li>Wettelijke administratieve verplichtingen</li>
            </ul>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              4. Bewaartermijn
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              We bewaren persoonsgegevens zolang dat nodig is voor de uitvoering van onze diensten of wettelijke verplichtingen (zoals belastingwetgeving).
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              5. Delen met derden
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro deelt gegevens uitsluitend met partijen die betrokken zijn bij de uitvoering van onze diensten, zoals hostingproviders of betaalpartners.
              Met deze partijen zijn verwerkersovereenkomsten gesloten om jouw gegevens te beschermen.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              6. Cookies
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Onze website gebruikt functionele en analytische cookies om de werking van de site te verbeteren.
              Je kunt cookies uitschakelen via je browserinstellingen.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              7. Beveiliging
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              We nemen passende technische en organisatorische maatregelen om jouw gegevens te beschermen tegen verlies, misbruik of ongeoorloofde toegang.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              8. Jouw rechten
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-4 transition-colors">
              Je hebt recht op inzage, correctie, verwijdering en overdraagbaarheid van jouw gegevens.
              Stuur hiervoor een verzoek naar info@webiro.nl.
              We reageren binnen 14 dagen.
            </p>

            <h2 className="text-foreground mb-4 text-3xl font-bold transition-colors">
              9. Wijzigingen
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground mb-8 transition-colors">
              Webiro behoudt zich het recht voor deze privacyverklaring te wijzigen.
              De meest recente versie is altijd te vinden op www.webiro.nl.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-primary-foreground mb-6 text-4xl md:text-5xl font-bold">
            <TypewriterText text="Vragen over privacy?" speed={60} delay={300} />
          </h2>
          <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
            Neem gerust contact met ons op als je vragen hebt over ons privacybeleid.
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

export default PrivacyPolicy;
