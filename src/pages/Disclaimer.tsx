import { TypewriterText } from '@/components/TypewriterText';
import { useEffect } from 'react';
import { updatePageMeta } from '@/utils/seo';

export function Disclaimer() {
  useEffect(() => {
    updatePageMeta(
      'Disclaimer - Webiro',
      'Lees de disclaimer van Webiro over het gebruik van deze website, aansprakelijkheid en intellectueel eigendom.'
    );
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-background dark:from-[#1a1719] dark:to-background py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-foreground mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            <TypewriterText text="Disclaimer" speed={60} />
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Versie: november 2025
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl prose prose-neutral dark:prose-invert">
          <h2 className="text-2xl font-bold text-foreground mt-2 mb-4">1. Algemeen</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            De informatie op deze website (webiro.nl) wordt door Webiro met zorg samengesteld. Desondanks kunnen er geen rechten worden ontleend aan de informatie op deze website. Webiro aanvaardt geen aansprakelijkheid voor onjuistheden of onvolledigheden.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Aansprakelijkheid</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Webiro is niet aansprakelijk voor enige directe of indirecte schade die zou kunnen ontstaan door het gebruik van de op deze website aangeboden informatie of diensten.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Intellectueel eigendom</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Alle teksten, afbeeldingen, logo's en andere materialen op deze website zijn eigendom van Webiro of haar licentiegevers. Het is niet toegestaan deze zonder schriftelijke toestemming te kopiëren, verspreiden of openbaar te maken.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Externe links</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Deze website kan links bevatten naar externe websites. Webiro is niet verantwoordelijk voor de inhoud of het privacybeleid van deze externe websites.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Wijzigingen</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Webiro behoudt zich het recht voor om de inhoud van deze disclaimer te allen tijde aan te passen. Raadpleeg deze pagina daarom regelmatig voor de meest actuele versie.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Contact</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Vragen over deze disclaimer? Neem contact op via{' '}
            <a href="mailto:info@webiro.nl" className="text-primary hover:underline">info@webiro.nl</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Disclaimer;
