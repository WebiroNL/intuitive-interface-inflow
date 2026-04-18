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
          Na oplevering ontvang je per e-mail een uitnodiging voor je persoonlijke dashboard. Klik op de link en kies een wachtwoord om toegang te krijgen tot al je projectinformatie.
        </p>
        <p>
          Vanuit je dashboard zie je in één oogopslag de status van je website, lopende campagnes, openstaande facturen en aangeleverde bestanden.
        </p>
      </>
    ),
  },
  {
    id: "dashboard",
    label: "02",
    title: "Het dashboard",
    body: (
      <>
        <p>
          Het dashboard is je centrale werkplek. Hier vind je realtime statistieken, contracten, facturen en de voortgang van je campagnes — automatisch bijgewerkt.
        </p>
        <p>
          Aan de linkerzijde navigeer je tussen de verschillende onderdelen. De maand-selector rechtsboven laat je terugkijken naar voorgaande perioden.
        </p>
      </>
    ),
  },
  {
    id: "campagnes",
    label: "03",
    title: "Campagnes",
    body: (
      <>
        <p>
          Onder <strong className="text-foreground">Campagnes</strong> zie je per maand de prestaties van Google Ads, Meta, LinkedIn en alle andere kanalen die we voor je beheren. Cijfers worden automatisch ingeladen vanuit de bron.
        </p>
        <p>
          Per platform zie je impressies, kliks, conversies en de kosten per resultaat — inclusief vergelijking met de vorige periode.
        </p>
      </>
    ),
  },
  {
    id: "facturen",
    label: "04",
    title: "Facturen",
    body: (
      <p>
        Alle facturen vind je terug onder <strong className="text-foreground">Financieel</strong>. Betaalde en openstaande facturen zijn duidelijk gemarkeerd. Je kunt elke factuur als PDF downloaden of direct online betalen.
      </p>
    ),
  },
  {
    id: "bestanden",
    label: "05",
    title: "Bestanden",
    body: (
      <p>
        Aangeleverde documenten, ontwerpen en exports staan onder <strong className="text-foreground">Bestanden</strong>. Sleep nieuwe bestanden direct in het venster om ze te uploaden — wij ontvangen automatisch een melding.
      </p>
    ),
  },
  {
    id: "contact",
    label: "06",
    title: "Vragen?",
    body: (
      <p>
        Heb je een vraag die hier niet beantwoord wordt? Neem contact op via <Link to="/contact" className="text-primary font-medium underline-offset-4 hover:underline">/contact</Link> of stuur een bericht naar <a href="mailto:info@webiro.nl" className="text-primary font-medium underline-offset-4 hover:underline">info@webiro.nl</a>. Je krijgt binnen één werkdag antwoord.
      </p>
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
