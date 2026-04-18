import { useEffect } from "react";
import { Link } from "react-router-dom";
import { updatePageMeta } from "@/utils/seo";

export default function OverOns() {
  useEffect(() => {
    updatePageMeta(
      "Over ons - Webiro",
      "Webiro is een digitaal bureau dat ondernemers helpt online te groeien met websites, marketing en strategie."
    );
  }, []);

  return (
    <div className="bg-background pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-20 pb-24 lg:pb-32">
        {/* Hero */}
        <div className="max-w-3xl">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-6 font-mono">
            Over Webiro
          </p>
          <h1 className="text-[44px] lg:text-[64px] leading-[1.02] tracking-[-0.03em] font-semibold text-foreground mb-8">
            Een digitaal bureau<br />
            <span className="text-muted-foreground/80">gebouwd op resultaat.</span>
          </h1>
          <p className="text-[17px] lg:text-[19px] leading-[1.6] text-muted-foreground/90 max-w-2xl font-light">
            Webiro helpt ondernemers verder te groeien met strakke websites, doordachte marketing en een proces dat altijd transparant blijft.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden">
          {[
            { value: "120+", label: "Projecten gelanceerd" },
            { value: "8 jr", label: "Ervaring online" },
            { value: "98%", label: "Klanttevredenheid" },
            { value: "24/7", label: "Dashboard inzicht" },
          ].map((s) => (
            <div key={s.label} className="bg-background p-8 lg:p-10">
              <div className="text-[32px] lg:text-[40px] leading-none font-semibold tracking-[-0.02em] text-foreground mb-3">
                {s.value}
              </div>
              <div className="text-[12px] uppercase tracking-[0.14em] font-mono text-muted-foreground/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column story */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 font-mono lg:pt-2">
            Onze missie
          </p>
          <div className="max-w-2xl">
            <h2 className="text-[24px] lg:text-[28px] leading-[1.25] tracking-[-0.02em] font-semibold text-foreground mb-6">
              Elke ondernemer verdient toegang tot een professionele online aanwezigheid.
            </h2>
            <p className="text-[15.5px] leading-[1.78] text-muted-foreground mb-5">
              Daarom combineren we design, technologie en marketing in heldere pakketten zonder verborgen kosten. Geen jargon, geen verrassingen — wel groei.
            </p>
            <p className="text-[15.5px] leading-[1.78] text-muted-foreground">
              We werken met korte lijnen, vaste contactpersonen en een dashboard waarin je altijd ziet wat we doen, wat het oplevert en waar we aan werken.
            </p>
          </div>
        </div>

        {/* What we do */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 font-mono lg:pt-2">
            Wat we doen
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden max-w-4xl">
            {[
              {
                title: "Websites",
                body: "Razendsnel, mobielvriendelijk en gebouwd om te converteren. Van landingspagina tot complete webshop.",
              },
              {
                title: "Marketing",
                body: "Datagedreven campagnes via Google, Meta en LinkedIn. Transparant gerapporteerd in je eigen dashboard.",
              },
              {
                title: "Strategie",
                body: "Een plan dat past bij jouw bedrijf, doelgroep en groeiambitie — niet bij ons portfolio.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-background p-8">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 font-mono">
                  {c.title}
                </div>
                <p className="text-[14.5px] leading-[1.7] text-muted-foreground">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 lg:mt-32 border-t border-border/60 pt-14 lg:pt-20 max-w-3xl">
          <h2 className="text-[26px] lg:text-[32px] leading-[1.2] tracking-[-0.02em] font-semibold text-foreground mb-4">
            Benieuwd wat we voor jou kunnen betekenen?
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground mb-8 max-w-xl">
            Plan een vrijblijvende kennismaking en ontdek hoe we jouw online groei kunnen versnellen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center text-[14px] font-medium text-primary-foreground bg-primary px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Plan een kennismaking
            </Link>
            <Link
              to="/pakketten"
              className="inline-flex items-center text-[14px] font-medium text-foreground border border-border px-5 py-2.5 rounded-full hover:bg-muted/40 transition-colors"
            >
              Bekijk pakketten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
