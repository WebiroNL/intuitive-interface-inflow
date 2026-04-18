import { TypewriterText } from '@/components/TypewriterText';
import { useEffect } from 'react';
import { updatePageMeta } from '@/utils/seo';

export function Cookiebeleid() {
  useEffect(() => {
    updatePageMeta(
      'Cookiebeleid - Webiro',
      'Lees hoe Webiro cookies gebruikt om de website te verbeteren, statistieken bij te houden en marketing te personaliseren.'
    );
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-background dark:from-[#1a1719] dark:to-background py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-foreground mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            <TypewriterText text="Cookiebeleid" speed={60} />
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Versie: november 2025
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mt-2 mb-4">1. Wat zijn cookies?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt. Ze helpen websites om jouw voorkeuren te onthouden en de gebruikerservaring te verbeteren.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Welke cookies gebruiken wij?</h2>
          <ul className="space-y-3 mb-6 text-muted-foreground">
            <li><strong className="text-foreground">Functionele cookies:</strong> nodig voor de basiswerking van de website (bijv. inlogsessies, winkelwagen).</li>
            <li><strong className="text-foreground">Analytische cookies:</strong> we gebruiken deze om bezoekersstatistieken te verzamelen en de website te verbeteren.</li>
            <li><strong className="text-foreground">Marketing cookies:</strong> via Meta Pixel en vergelijkbare tools meten we de effectiviteit van advertenties.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Cookies van derden</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Wij maken gebruik van diensten van derden zoals Google Analytics, Meta (Facebook), LinkedIn en YouTube. Deze partijen kunnen eigen cookies plaatsen via onze website.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Cookies beheren</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Je kunt cookies altijd beheren of verwijderen via de instellingen van je browser. Houd er rekening mee dat het uitschakelen van cookies invloed kan hebben op de werking van onze website.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Wijzigingen</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Webiro behoudt zich het recht voor dit cookiebeleid aan te passen. Wijzigingen worden op deze pagina gepubliceerd.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Contact</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Vragen? Mail ons via{' '}
            <a href="mailto:info@webiro.nl" className="text-primary hover:underline">info@webiro.nl</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Cookiebeleid;
