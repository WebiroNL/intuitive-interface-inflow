import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Add01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";

export const AD_PLATFORMS: { id: string; label: string; logo: string }[] = [
  { id: "google", label: "Google Ads", logo: "/images/tools/googleads.svg" },
  { id: "meta", label: "Meta (Facebook & Instagram)", logo: "/images/tools/meta.svg" },
  { id: "tiktok", label: "TikTok Ads", logo: "/images/tools/tiktok.svg" },
  { id: "linkedin", label: "LinkedIn Ads", logo: "/images/tools/linkedin.svg" },
  { id: "youtube", label: "YouTube Ads", logo: "/images/tools/youtube.svg" },
  { id: "snapchat", label: "Snapchat Ads", logo: "/images/tools/snapchat.svg" },
  { id: "pinterest", label: "Pinterest Ads", logo: "/images/tools/pinterest.svg" },
];

export interface AdsCampaign {
  id: string;
  client_id: string;
  name: string;
  platforms: string[];
  platform_costs?: Record<string, number>;
  contract_start_date?: string | null;
  contract_duration?: string | null;
  discount_months?: number | null;
  discount_percentage?: number | null;
  discount_start_date?: string | null;
  deposit_percentage?: number | null;
}

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n || 0);

export function PlatformBadge({ platformId, size = "md" }: { platformId: string; size?: "sm" | "md" }) {
  const p = AD_PLATFORMS.find((x) => x.id === platformId);
  if (!p) return null;
  const dims = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-background text-[12px] font-medium text-foreground"
      title={p.label}
    >
      <img src={p.logo} alt={p.label} className={`${dims} object-contain`} />
      {p.label.replace(/ Ads$/, "").replace(/ \(.*\)$/, "")}
    </span>
  );
}

export function AdsCampaignsTab({ clientId }: { clientId: string }) {
  const [campaigns, setCampaigns] = useState<AdsCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const emptyDraft = {
    name: "",
    platforms: [] as string[],
    platform_costs: {} as Record<string, number>,
    contract_start_date: new Date().toISOString().slice(0, 10),
    contract_duration: "",
    discount_months: "",
    discount_percentage: "",
    discount_start_date: "",
    deposit_percentage: "50",
  };
  const [draft, setDraft] = useState(emptyDraft);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ads_campaigns")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true });
    setCampaigns((data as AdsCampaign[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [clientId]);

  const togglePlatform = (id: string, current: string[], set: (v: string[]) => void) => {
    set(current.includes(id) ? current.filter((p) => p !== id) : [...current, id]);
  };

  const addCampaign = async () => {
    if (!draft.name.trim()) {
      toast.error("Geef de campagne een naam");
      return;
    }
    if (draft.platforms.length === 0) {
      toast.error("Selecteer minstens één platform");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("ads_campaigns").insert({
      client_id: clientId,
      name: draft.name.trim(),
      platforms: draft.platforms,
      platform_costs: draft.platform_costs,
      contract_start_date: draft.contract_start_date || null,
      contract_duration: draft.contract_duration || null,
      discount_months: draft.discount_months !== "" ? Number(draft.discount_months) : null,
      discount_percentage: draft.discount_percentage !== "" ? Number(draft.discount_percentage) : null,
      discount_start_date: draft.discount_start_date || draft.contract_start_date || null,
      deposit_percentage: draft.deposit_percentage !== "" ? Number(draft.deposit_percentage) : null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft(emptyDraft);
    toast.success("Campagne toegevoegd");
    load();
  };

  const updateCampaign = async (c: AdsCampaign, patch: Partial<AdsCampaign>) => {
    setCampaigns((prev) => prev.map((x) => (x.id === c.id ? { ...x, ...patch } : x)));
  };

  const saveCampaign = async (c: AdsCampaign) => {
    const { error } = await supabase
      .from("ads_campaigns")
      .update({
        name: c.name,
        platforms: c.platforms,
        platform_costs: c.platform_costs ?? {},
        contract_start_date: c.contract_start_date || null,
        contract_duration: c.contract_duration || null,
        discount_months: c.discount_months ?? null,
        discount_percentage: c.discount_percentage ?? null,
        discount_start_date: c.discount_start_date || c.contract_start_date || null,
        deposit_percentage: c.deposit_percentage ?? null,
      })
      .eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Opgeslagen");
  };

  const removeCampaign = async (id: string) => {
    if (!confirm("Campagne verwijderen?")) return;
    const { error } = await supabase.from("ads_campaigns").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verwijderd");
    load();
  };

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Ads campagnes</h3>
        <p className="text-[12px] text-muted-foreground">
          Voeg per campagne toe op welke platforms de klant adverteert. Deze worden getoond in het ads contract.
        </p>
      </div>

      {/* Bestaande campagnes */}
      {loading ? (
        <div className="h-16 bg-muted/40 rounded-lg animate-pulse" />
      ) : campaigns.length === 0 ? (
        <div className="text-[12px] text-muted-foreground italic">Nog geen campagnes toegevoegd.</div>
      ) : (
        <ul className="space-y-3">
          {campaigns.map((c) => (
            <li key={c.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-[12px]">Campagne naam</Label>
                  <Input
                    value={c.name}
                    onChange={(e) => updateCampaign(c, { name: e.target.value })}
                    placeholder="bv. Voorjaarscampagne"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <Button type="button" size="sm" variant="outline" onClick={() => saveCampaign(c)}>
                    <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> Opslaan
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeCampaign(c.id)}>
                    <HugeiconsIcon icon={Delete02Icon} size={14} /> Verwijderen
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-[12px] mb-2 block">Platforms & kosten</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {AD_PLATFORMS.map((p) => {
                    const checked = c.platforms.includes(p.id);
                    const cost = c.platform_costs?.[p.id] ?? 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          checked
                            ? "border-primary/60 bg-primary/5"
                            : "border-border bg-background"
                        }`}
                      >
                        <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => {
                              const newPlatforms = checked
                                ? c.platforms.filter((x) => x !== p.id)
                                : [...c.platforms, p.id];
                              const newCosts = { ...(c.platform_costs ?? {}) };
                              if (!checked && newCosts[p.id] === undefined) newCosts[p.id] = 0;
                              if (checked) delete newCosts[p.id];
                              updateCampaign(c, { platforms: newPlatforms, platform_costs: newCosts });
                            }}
                          />
                          <img src={p.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-[12px] font-medium text-foreground truncate">{p.label}</span>
                        </label>
                        {checked && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[12px] text-muted-foreground">€</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={cost}
                              onChange={(e) =>
                                updateCampaign(c, {
                                  platform_costs: {
                                    ...(c.platform_costs ?? {}),
                                    [p.id]: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="h-8 w-24 text-[12px]"
                              placeholder="0,00"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {c.platforms.length > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Totaal: <span className="font-semibold text-foreground">{fmtEUR(
                      c.platforms.reduce((sum, pid) => sum + (c.platform_costs?.[pid] ?? 0), 0)
                    )}</span>
                  </p>
                )}
              </div>

              {/* Contractgegevens per campagne */}
              <div className="pt-3 border-t border-border space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Contractgegevens</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[12px]">Startdatum contract</Label>
                    <Input
                      type="date"
                      value={c.contract_start_date ?? ""}
                      onChange={(e) => updateCampaign(c, { contract_start_date: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label className="text-[12px]">Contractduur</Label>
                    <Input
                      value={c.contract_duration ?? ""}
                      onChange={(e) => updateCampaign(c, { contract_duration: e.target.value })}
                      placeholder="bv. 12 maanden"
                    />
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground pt-1">Korting (optioneel)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[12px]">Aantal maanden korting</Label>
                    <Input
                      type="number"
                      min="0"
                      value={c.discount_months ?? ""}
                      onChange={(e) =>
                        updateCampaign(c, {
                          discount_months: e.target.value !== "" ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="bv. 3"
                    />
                  </div>
                  <div>
                    <Label className="text-[12px]">Kortingspercentage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={c.discount_percentage ?? ""}
                      onChange={(e) =>
                        updateCampaign(c, {
                          discount_percentage: e.target.value !== "" ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="bv. 20"
                    />
                  </div>
                  <div>
                    <Label className="text-[12px]">Startdatum korting</Label>
                    <Input
                      type="date"
                      value={c.discount_start_date ?? ""}
                      onChange={(e) =>
                        updateCampaign(c, { discount_start_date: e.target.value || null })
                      }
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Leeg = gelijk aan contractstart.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[12px]">Aanbetaling (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={c.deposit_percentage ?? ""}
                      onChange={(e) =>
                        updateCampaign(c, {
                          deposit_percentage: e.target.value !== "" ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="bv. 50"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Nieuwe campagne toevoegen */}
      <div className="border border-dashed border-border rounded-lg p-4 space-y-3 bg-muted/20">
        <h4 className="text-[13px] font-semibold text-foreground">Nieuwe campagne</h4>
        <div className="space-y-2">
          <Label className="text-[12px]">Campagne naam</Label>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="bv. Zomeractie 2026"
          />
        </div>
        <div>
          <Label className="text-[12px] mb-2 block">Platforms & kosten</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {AD_PLATFORMS.map((p) => {
              const checked = draft.platforms.includes(p.id);
              const cost = draft.platform_costs[p.id] ?? 0;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    checked
                      ? "border-primary/60 bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => {
                        const newPlatforms = checked
                          ? draft.platforms.filter((x) => x !== p.id)
                          : [...draft.platforms, p.id];
                        const newCosts = { ...draft.platform_costs };
                        if (!checked && newCosts[p.id] === undefined) newCosts[p.id] = 0;
                        if (checked) delete newCosts[p.id];
                        setDraft({ ...draft, platforms: newPlatforms, platform_costs: newCosts });
                      }}
                    />
                    <img src={p.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
                    <span className="text-[12px] font-medium text-foreground truncate">{p.label}</span>
                  </label>
                  {checked && (
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[12px] text-muted-foreground">€</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cost}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            platform_costs: {
                              ...draft.platform_costs,
                              [p.id]: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="h-8 w-24 text-[12px]"
                        placeholder="0,00"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Button type="button" onClick={addCampaign} disabled={saving} size="sm">
          <HugeiconsIcon icon={Add01Icon} size={14} />
          {saving ? "Bezig..." : "Campagne toevoegen"}
        </Button>
      </div>
    </div>
  );
}
