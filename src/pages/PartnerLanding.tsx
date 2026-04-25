import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HandBag01Icon,
  Coins01Icon,
  ChartLineData01Icon,
  Award01Icon,
  Link01Icon,
  Tag01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { updatePageMeta } from "@/utils/seo";
import { PartnerHeroParticles } from "@/components/PartnerHeroParticles";

interface Tier {
  id: string;
  tier: "bronze" | "silver" | "gold";
  display_name: string;
  description: string;
  min_revenue: number;
  max_revenue: number | null;
  commission_website: number;
  commission_marketing: number;
  commission_shop: number;
  commission_addon: number;
  customer_discount: number;
  color: string;
  benefits: string[];
}

export default function PartnerLanding() {
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    updatePageMeta(
      "Webiro Partner Programma — Verdien aan elke verwijzing",
      "Word Webiro partner. Verdien tot 20% commissie op websites, marketing en shop producten.",
      "/partner",
    );
    supabase
      .from("partner_tiers" as never)
      .select("*")
      .order("sort_order")
      .then(({ data }) => setTiers((data as Tier[]) ?? []));
  }, []);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-card"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 80px), 0 100%)" }}
      >
        <PartnerHeroParticles />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-32 lg:pb-44 relative">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-medium mb-6">
                <HugeiconsIcon icon={HandBag01Icon} size={14} />
                Partner Programma
              </div>
              <h1 className="text-[44px] lg:text-[64px] leading-[1.05] font-semibold tracking-tight text-foreground">
                Verdien aan elke
                <br />
                <span className="text-primary">klant die je aanbrengt</span>
              </h1>
              <p className="mt-6 text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
                Sluit je aan bij het Webiro Partner Programma en verdien tot 20% commissie op websites,
                marketing diensten en shop producten. Persoonlijke referral link, eigen kortingscode en
                een transparant dashboard.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/partner/register"
                  className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
                >
                  Word partner <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </Link>
                <Link
                  to="/partner/login"
                  className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
                >
                  Inloggen
                </Link>
              </div>
            </div>

            {/* Recurring commissie tile inside hero (compact, Stripe-style) */}
            <div className="lg:col-span-4 lg:mt-16">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon icon={Coins01Icon} size={16} className="text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground">Recurring commissie</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground mb-4">
                  Verdien niet alleen aan de eerste verkoop. Ontvang ook maandelijkse commissie op
                  CMS, hosting en marketing abonnementen, zolang je klanten klant blijven.
                </p>
                <Link
                  to="/partner/register"
                  className="inline-flex items-center gap-1.5 text-primary text-[13px] font-semibold hover:gap-2 transition-all"
                >
                  Meer informatie <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative diagonal bars (just below the slanted hero edge) */}
      <section className="relative overflow-hidden h-[120px] lg:h-[160px] -mt-2">
        {/* Light blue diagonal bar (right, follows the hero slant) */}
        <div
          aria-hidden
          className="absolute right-0 top-[10px] lg:top-[20px] w-[80%] h-[50px] lg:h-[70px]"
          style={{
            background: "hsl(189 95% 75% / 0.55)",
            transform: "rotate(-6deg)",
            transformOrigin: "right center",
          }}
        />
        {/* Dark blue diagonal bar (left, behind purple) */}
        <div
          aria-hidden
          className="absolute left-0 top-[60px] lg:top-[80px] w-[28%] h-[22px] lg:h-[28px]"
          style={{
            background: "hsl(232 85% 52%)",
            transform: "rotate(-6deg)",
            transformOrigin: "left center",
          }}
        />
        {/* Purple diagonal bar (left, in front, offset down) */}
        <div
          aria-hidden
          className="absolute left-[20px] lg:left-[40px] top-[80px] lg:top-[105px] w-[26%] h-[28px] lg:h-[36px]"
          style={{
            background: "hsl(252 78% 65% / 0.9)",
            transform: "rotate(-6deg)",
            transformOrigin: "left center",
          }}
        />
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <h2 className="text-[28px] lg:text-[36px] font-semibold tracking-tight text-foreground mb-2">
            Zo werkt het
          </h2>
          <p className="text-muted-foreground mb-12">In drie stappen verdien je commissie.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: HandBag01Icon,
                title: "1. Meld je aan",
                desc: "Vul de aanmelding in. Na goedkeuring krijg je een persoonlijke referral link en kortingscode.",
              },
              {
                icon: Link01Icon,
                title: "2. Deel je link",
                desc: "Verwijs klanten via je link of kortingscode. Klanten krijgen korting, jij krijgt commissie.",
              },
              {
                icon: Coins01Icon,
                title: "3. Ontvang commissie",
                desc: "Volg je verdiensten realtime. Vraag uitbetaling aan zodra je saldo beschikbaar is.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-border p-6 bg-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={s.icon} size={20} />
                </div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <h2 className="text-[28px] lg:text-[36px] font-semibold tracking-tight text-foreground mb-2">
            Drie tiers, één doel: jouw groei
          </h2>
          <p className="text-muted-foreground mb-12">
            Hoe meer omzet je genereert, hoe hoger je commissie. Je groeit automatisch door.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-border p-8 bg-card relative overflow-hidden"
                style={{ borderTopWidth: 4, borderTopColor: t.color }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <HugeiconsIcon icon={Award01Icon} size={20} style={{ color: t.color }} />
                  <h3 className="text-[20px] font-semibold text-foreground">{t.display_name}</h3>
                </div>
                <p className="text-[13px] text-muted-foreground mb-6">{t.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[40px] font-bold text-foreground">{t.commission_website}%</span>
                    <span className="text-[13px] text-muted-foreground">gemiddelde commissie</span>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Websites</span>
                      <span className="font-medium text-foreground">{t.commission_website}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Marketing</span>
                      <span className="font-medium text-foreground">{t.commission_marketing}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-medium text-foreground">{t.commission_addon}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-muted-foreground">Shop producten</span>
                      <span className="font-medium text-foreground">{t.commission_shop}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] pt-1.5 border-t border-border/50">
                      <span className="text-muted-foreground">Klantkorting</span>
                      <span className="font-medium text-primary">{t.customer_discount}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-[12px] text-muted-foreground mb-4 pt-4 border-t border-border">
                  Vanaf €{t.min_revenue.toLocaleString("nl-NL")}
                  {t.max_revenue ? ` t/m €${t.max_revenue.toLocaleString("nl-NL")}` : "+"} omzet
                </div>

                <ul className="space-y-2">
                  {(t.benefits || []).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Producten */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <h2 className="text-[28px] lg:text-[36px] font-semibold tracking-tight text-foreground mb-2">
            Verdien op alles wat we aanbieden
          </h2>
          <p className="text-muted-foreground mb-12">Eén partnership, vier productlijnen.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ChartLineData01Icon, title: "Website pakketten", desc: "Eenmalige projecten + recurring CMS/hosting" },
              { icon: Tag01Icon, title: "Marketing diensten", desc: "Ads, automation, AI campagnes" },
              { icon: Coins01Icon, title: "Shop producten", desc: "NFC tools en hardware" },
              { icon: Award01Icon, title: "Add-ons", desc: "Extra modules en uitbreidingen" },
            ].map((p) => (
              <div key={p.title} className="rounded-xl border border-border p-5 bg-card">
                <HugeiconsIcon icon={p.icon} size={20} className="text-primary mb-3" />
                <h4 className="text-[15px] font-semibold text-foreground mb-1">{p.title}</h4>
                <p className="text-[12px] text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <h2 className="text-[28px] lg:text-[36px] font-semibold tracking-tight text-foreground mb-3">
              Klaar om partner te worden?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Aanmelden duurt 2 minuten. Na goedkeuring kun je direct beginnen met verdienen.
            </p>
            <Link
              to="/partner/register"
              className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
            >
              Start aanmelding <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
