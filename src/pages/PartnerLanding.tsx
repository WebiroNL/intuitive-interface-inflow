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
    setSeoTags({
      title: "Webiro Partner Programma — Verdien aan elke verwijzing",
      description:
        "Word Webiro partner. Verdien tot 20% commissie op websites, marketing en shop producten. Eigen referral link, kortingscode en dashboard.",
    });
    supabase
      .from("partner_tiers")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setTiers((data as Tier[]) ?? []));
  }, []);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-medium mb-6">
              <HugeiconsIcon icon={HandshakeIcon} size={14} />
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/partner/register">
                  Word partner
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/partner/login">Inloggen</Link>
              </Button>
            </div>
          </div>
        </div>
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
                icon: HandshakeIcon,
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

                <div className="space-y-2 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[40px] font-bold text-foreground">{t.commission_website}%</span>
                    <span className="text-[13px] text-muted-foreground">commissie websites</span>
                  </div>
                  <div className="text-[13px] text-muted-foreground">
                    Marketing {t.commission_marketing}% · Shop {t.commission_shop}% · Add-ons {t.commission_addon}%
                  </div>
                  <div className="text-[13px] text-muted-foreground">
                    Klant krijgt <strong className="text-foreground">{t.customer_discount}% korting</strong>
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
            <Button asChild size="lg" className="rounded-full">
              <Link to="/partner/register">
                Start aanmelding
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
