import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyPartner } from "@/hooks/usePartner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle01Icon, Coins01Icon, Link01Icon, UserGroup02Icon, Award01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  tab?: "referrals" | "commissions" | "payouts" | "assets" | "profile";
}

export default function PartnerDashboard({ tab }: Props) {
  const { partner } = useMyPartner();
  const [copied, setCopied] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    if (!partner) return;
    supabase.from("partner_referrals" as never).select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(50).then(({ data }) => setReferrals((data as any[]) ?? []));
    supabase.from("partner_commissions" as never).select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(50).then(({ data }) => setCommissions((data as any[]) ?? []));
    supabase.from("partner_payouts" as never).select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(50).then(({ data }) => setPayouts((data as any[]) ?? []));
  }, [partner?.id]);

  if (!partner) return null;

  const refUrl = `${window.location.origin}/?ref=${partner.referral_code}`;
  const copy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    toast.success("Gekopieerd");
    setTimeout(() => setCopied(null), 1500);
  };

  const requestPayout = async () => {
    if (partner.available_balance <= 0) {
      toast.error("Geen beschikbaar saldo");
      return;
    }
    const { error } = await supabase.from("partner_payouts" as never).insert({
      partner_id: partner.id,
      amount: partner.available_balance,
      iban: partner.iban,
      status: "requested",
    } as never);
    if (error) toast.error(error.message);
    else {
      toast.success("Uitbetaling aangevraagd");
      const { data } = await supabase.from("partner_payouts" as never).select("*").eq("partner_id", partner.id).order("created_at", { ascending: false });
      setPayouts((data as any[]) ?? []);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {!tab && (
        <>
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Welkom, {partner.contact_person}</h1>
            <p className="text-muted-foreground mt-1 text-[14px] capitalize">
              <HugeiconsIcon icon={Award01Icon} size={14} className="inline mr-1" /> {partner.tier} partner
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Totale omzet", value: `€${partner.total_revenue.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`, icon: Coins01Icon },
              { label: "Beschikbaar saldo", value: `€${partner.available_balance.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`, icon: Coins01Icon },
              { label: "Referrals", value: partner.total_referrals, icon: UserGroup02Icon },
              { label: "Conversies", value: partner.total_conversions, icon: CheckmarkCircle01Icon },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                <HugeiconsIcon icon={s.icon} size={18} className="text-primary mb-3" />
                <p className="text-[12px] text-muted-foreground">{s.label}</p>
                <p className="text-[22px] font-semibold text-foreground mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon icon={Link01Icon} size={16} className="text-primary" />
                <h3 className="text-[14px] font-semibold text-foreground">Jouw referral link</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">Klanten krijgen automatisch korting via deze link.</p>
              <div className="flex gap-2">
                <input readOnly value={refUrl} className="flex-1 text-[13px] px-3 py-2 rounded-md border border-border bg-background text-foreground font-mono" />
                <Button size="sm" variant="outline" onClick={() => copy("ref", refUrl)}>
                  <HugeiconsIcon icon={copied === "ref" ? CheckmarkCircle01Icon : Copy01Icon} size={14} />
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon icon={Coins01Icon} size={16} className="text-primary" />
                <h3 className="text-[14px] font-semibold text-foreground">Jouw kortingscode</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">Klanten kunnen deze code gebruiken bij checkout.</p>
              <div className="flex gap-2">
                <input readOnly value={partner.discount_code} className="flex-1 text-[13px] px-3 py-2 rounded-md border border-border bg-background text-foreground font-mono uppercase" />
                <Button size="sm" variant="outline" onClick={() => copy("disc", partner.discount_code)}>
                  <HugeiconsIcon icon={copied === "disc" ? CheckmarkCircle01Icon : Copy01Icon} size={14} />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-foreground">Recente commissies</h3>
              <Button size="sm" onClick={requestPayout} disabled={partner.available_balance <= 0}>
                Uitbetaling aanvragen
              </Button>
            </div>
            {commissions.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Nog geen commissies. Deel je link of code om te starten.</p>
            ) : (
              <div className="space-y-2">
                {commissions.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-[13px] py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-foreground font-medium">{c.product_name}</p>
                      <p className="text-muted-foreground text-[12px]">{new Date(c.created_at).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">€{Number(c.commission_amount).toFixed(2)}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{c.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === "referrals" && (
        <div>
          <h2 className="text-[22px] font-semibold text-foreground mb-4">Referrals</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead className="bg-muted/30 text-muted-foreground"><tr><th className="text-left px-4 py-2 whitespace-nowrap">Datum</th><th className="text-left px-4 py-2 whitespace-nowrap">Landing page</th><th className="text-left px-4 py-2 whitespace-nowrap">Status</th></tr></thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-t border-border"><td className="px-4 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("nl-NL")}</td><td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{r.landing_page}</td><td className="px-4 py-2 whitespace-nowrap">{r.converted ? "Geconverteerd" : "Bezoek"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "commissions" && (
        <div>
          <h2 className="text-[22px] font-semibold text-foreground mb-4">Commissies</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-[13px]">
                <thead className="bg-muted/30 text-muted-foreground"><tr><th className="text-left px-4 py-2 whitespace-nowrap">Product</th><th className="text-left px-4 py-2 whitespace-nowrap">Bedrag</th><th className="text-left px-4 py-2 whitespace-nowrap">Commissie</th><th className="text-left px-4 py-2 whitespace-nowrap">Status</th></tr></thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-t border-border"><td className="px-4 py-2 whitespace-nowrap">{c.product_name}</td><td className="px-4 py-2 whitespace-nowrap">€{Number(c.sale_amount).toFixed(2)}</td><td className="px-4 py-2 font-semibold whitespace-nowrap">€{Number(c.commission_amount).toFixed(2)}</td><td className="px-4 py-2 capitalize whitespace-nowrap">{c.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "payouts" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-semibold text-foreground">Uitbetalingen</h2>
            <Button onClick={requestPayout} disabled={partner.available_balance <= 0}>Uitbetaling aanvragen</Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-muted/30 text-muted-foreground"><tr><th className="text-left px-4 py-2">Datum</th><th className="text-left px-4 py-2">Bedrag</th><th className="text-left px-4 py-2">Status</th></tr></thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-t border-border"><td className="px-4 py-2">{new Date(p.created_at).toLocaleDateString("nl-NL")}</td><td className="px-4 py-2 font-semibold">€{Number(p.amount).toFixed(2)}</td><td className="px-4 py-2 capitalize">{p.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "assets" && (
        <div>
          <h2 className="text-[22px] font-semibold text-foreground mb-4">Marketing materiaal</h2>
          <p className="text-muted-foreground text-[13px]">Materiaal komt binnenkort beschikbaar.</p>
        </div>
      )}

      {tab === "profile" && (
        <div>
          <h2 className="text-[22px] font-semibold text-foreground mb-4">Profiel</h2>
          <div className="rounded-xl border border-border bg-card p-6 space-y-2 text-[13px]">
            <p><strong>Bedrijf:</strong> {partner.company_name}</p>
            <p><strong>Contact:</strong> {partner.contact_person}</p>
            <p><strong>E-mail:</strong> {partner.email}</p>
            <p><strong>IBAN:</strong> {partner.iban || "—"}</p>
            <p><strong>Tier:</strong> <span className="capitalize">{partner.tier}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
