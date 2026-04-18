import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updatePageMeta } from "@/utils/seo";

interface Section {
  id: string;
  label: string;
  title: string;
  body: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "aan-de-slag",
    label: "01",
    title: "Aan de slag",
    body: (
      <>
        <p>
          Welkom bij Webiro. Na ondertekening van je offerte ontvang je per e-mail een uitnodiging om je account aan te maken op <Link to="/inloggen" className="text-primary font-medium underline-offset-4 hover:underline">webiro.nl/inloggen</Link>. Stel een wachtwoord in en je hebt direct toegang tot je persoonlijke klantportaal.
        </p>
        <p>
          In het portaal vind je alles bij elkaar: de status van je project, lopende campagnes, rapportages, contracten, facturen, bestanden en updates van ons team.
        </p>
        <p>
          <strong className="text-foreground">Tip:</strong> bewaar de inloglink in je browser-favorieten en stel desgewenst een two-factor authenticatie in via je accountinstellingen.
        </p>
      </>
    ),
  },
  {
    id: "account",
    label: "02",
    title: "Je account beheren",
    body: (
      <>
        <p>
          Onder <strong className="text-foreground">Account</strong> beheer je je persoonlijke gegevens, bedrijfsinformatie (KVK, BTW), contactpersoon en factuurgegevens. Wijzigingen worden direct verwerkt.
        </p>
        <p>
          Wachtwoord vergeten? Gebruik de "Wachtwoord vergeten" link op de inlogpagina. Je ontvangt binnen enkele minuten een herstellink op je geregistreerde e-mailadres.
        </p>
      </>
    ),
  },
  {
    id: "dashboard",
    label: "03",
    title: "Het dashboard",
    body: (
      <>
        <p>
          Het dashboard is je centrale werkplek. Hier zie je realtime de belangrijkste KPI's van je marketing, openstaande acties en de laatste updates van ons team.
        </p>
        <p>
          Aan de linkerzijde navigeer je tussen onderdelen: Dashboard, Campagnes, Rapportages, Contract, Financieel, Bestanden, Updates en Account. Welke menu's je ziet, hangt af van je pakket.
        </p>
        <p>
          Met de <strong className="text-foreground">maand-selector</strong> rechtsboven schakel je tussen perioden. Cijfers, grafieken en rapportages passen zich automatisch aan.
        </p>
      </>
    ),
  },
  {
    id: "intake",
    label: "04",
    title: "Intake formulieren",
    body: (
      <>
        <p>
          Bij de start van een nieuw project vragen we je een intake in te vullen. Er zijn twee varianten: een <strong className="text-foreground">website intake</strong> (voor design en ontwikkeling) en een <strong className="text-foreground">marketing intake</strong> (voor campagnes en strategie).
        </p>
        <p>
          De formulieren slaan automatisch je voortgang op — je kunt op elk moment stoppen en later verder gaan. Velden die we al kennen worden vooraf ingevuld. Lever waar mogelijk merkrichtlijnen, voorbeelden en toegangen aan, dan kunnen we sneller schakelen.
        </p>
      </>
    ),
  },
  {
    id: "campagnes",
    label: "05",
    title: "Campagnes",
    body: (
      <>
        <p>
          Onder <strong className="text-foreground">Campagnes</strong> zie je per maand de prestaties van Google Ads, Meta, LinkedIn, TikTok, Pinterest, YouTube en Snapchat — afhankelijk van welke kanalen we voor je inzetten. Cijfers worden automatisch ingeladen vanuit de bron.
        </p>
        <p>
          Per platform vind je impressies, bereik, kliks, CTR, CPC, conversies en CPA. Naast de absolute cijfers zie je ook benchmarks en de vergelijking met de vorige periode.
        </p>
        <p>
          Onderaan elke maandweergave staat een korte AI-samenvatting in begrijpelijke taal — handig om snel inzicht te krijgen zonder zelf alle cijfers te interpreteren.
        </p>
      </>
    ),
  },
  {
    id: "rapportages",
    label: "06",
    title: "Rapportages",
    body: (
      <>
        <p>
          Onder <strong className="text-foreground">Rapportages</strong> vind je per maand een complete analyse: prestaties, inzichten, aanbevelingen van ons team en de geplande acties voor de komende periode.
        </p>
        <p>
          Elke rapportage is downloadbaar als PDF. Handig om intern te delen of te bewaren in je eigen archief.
        </p>
      </>
    ),
  },
  {
    id: "contract",
    label: "07",
    title: "Contract & afspraken",
    body: (
      <p>
        Onder <strong className="text-foreground">Contract</strong> staan je actuele afspraken: contractduur, opzegtermijn, maandelijks tarief, eventuele kortingen en de scope van de samenwerking. Wijzigingen worden in overleg doorgevoerd en zijn direct zichtbaar.
      </p>
    ),
  },
  {
    id: "financieel",
    label: "08",
    title: "Financieel & facturen",
    body: (
      <>
        <p>
          Onder <strong className="text-foreground">Financieel</strong> vind je al je facturen. Status, vervaldatum en bedrag zijn direct zichtbaar. Openstaande facturen kun je in één klik online betalen via de meegestuurde betaallink.
        </p>
        <p>
          Elke factuur is downloadbaar als PDF voor je eigen administratie of accountant.
        </p>
      </>
    ),
  },
  {
    id: "bestanden",
    label: "09",
    title: "Bestanden",
    body: (
      <p>
        Onder <strong className="text-foreground">Bestanden</strong> staan documenten, ontwerpen, exports en andere assets die we delen. Je kunt ook zelf bestanden uploaden — sleep ze direct in het venster. Wij ontvangen automatisch een melding zodra er iets nieuws binnenkomt.
      </p>
    ),
  },
  {
    id: "updates",
    label: "10",
    title: "Updates van ons team",
    body: (
      <p>
        Onder <strong className="text-foreground">Updates</strong> zie je een tijdlijn van alles wat er rond jouw project gebeurt: opgeleverde mijlpalen, nieuwe campagnes, A/B-tests, optimalisaties en aankondigingen. Zo blijf je altijd op de hoogte zonder lange e-mailthreads.
      </p>
    ),
  },
  {
    id: "support",
    label: "11",
    title: "Support & contact",
    body: (
      <>
        <p>
          Vraag of probleem? Neem contact op via <Link to="/contact" className="text-primary font-medium underline-offset-4 hover:underline">/contact</Link>, mail naar <a href="mailto:info@webiro.nl" className="text-primary font-medium underline-offset-4 hover:underline">info@webiro.nl</a> of bel <a href="tel:+31850608521" className="text-primary font-medium underline-offset-4 hover:underline">085 060 8521</a>.
        </p>
        <p>
          Onze reactietijd is binnen <strong className="text-foreground">één werkdag</strong>. Voor urgente zaken (live-issues, advertentie-spend) bellen we je dezelfde dag terug.
        </p>
      </>
    ),
  },
];

export default function Documentatie() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  useEffect(() => {
    updatePageMeta(
      "Documentatie - Webiro",
      "Handleidingen en uitleg om Webiro optimaal te benutten: dashboard, campagnes, facturen en meer."
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  return (
    <div className="bg-background pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-16 pb-24 lg:pb-32">
        {/* Hero */}
        <div className="max-w-3xl mb-20 lg:mb-28">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-6 font-mono">
            Documentatie
          </p>
          <h1 className="text-[40px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] font-semibold text-foreground mb-6">
            Alles wat je moet weten<br />
            <span className="text-muted-foreground/80">om met Webiro te werken.</span>
          </h1>
          <p className="text-[17px] leading-[1.6] text-muted-foreground/90 max-w-2xl font-light">
            Praktische handleidingen voor je dashboard, campagnes, facturen en bestanden.
          </p>
        </div>

        {/* Two col: side nav + content */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-20">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-3 font-mono">
              Inhoud
            </p>
            <nav className="flex flex-col">
              {SECTIONS.map((s) => {
                const active = s.id === activeId;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => handleClick(e, s.id)}
                    className={`group relative -ml-px border-l py-[7px] pl-3 text-[13.5px] leading-snug transition-all ${
                      active
                        ? "border-primary text-foreground font-medium"
                        : "border-transparent text-muted-foreground/80 hover:text-foreground hover:border-border"
                    }`}
                  >
                    {s.title}
                  </a>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 max-w-[680px]">
            {SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className={`scroll-mt-28 ${i > 0 ? "mt-20 pt-14 border-t border-border/60" : ""}`}
              >
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-[11px] font-mono text-muted-foreground/50 tracking-tight">
                    {s.label}
                  </span>
                  <h2 className="text-[19px] lg:text-[21px] leading-[1.3] tracking-[-0.015em] font-semibold text-foreground">
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-7 text-[15px] leading-[1.78] text-muted-foreground">
                  {s.body}
                </div>
              </section>
            ))}

            {/* Footer CTA */}
            <div className="mt-24 pt-14 border-t border-border/60">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-4 font-mono">
                Hulp nodig?
              </p>
              <h3 className="text-[20px] leading-[1.3] tracking-[-0.015em] font-semibold text-foreground mb-3">
                Geen antwoord gevonden?
              </h3>
              <p className="text-[15px] leading-[1.7] text-muted-foreground mb-6 max-w-lg">
                Onze support staat klaar om je te helpen. Stuur een bericht en we reageren binnen één werkdag.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center text-[14px] font-medium text-primary-foreground bg-primary px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Neem contact op
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
