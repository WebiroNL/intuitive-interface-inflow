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
}

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
  const [draft, setDraft] = useState<{ name: string; platforms: string[] }>({ name: "", platforms: [] });

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
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft({ name: "", platforms: [] });
    toast.success("Campagne toegevoegd");
    load();
  };

  const updateCampaign = async (c: AdsCampaign, patch: Partial<AdsCampaign>) => {
    setCampaigns((prev) => prev.map((x) => (x.id === c.id ? { ...x, ...patch } : x)));
  };

  const saveCampaign = async (c: AdsCampaign) => {
    const { error } = await supabase
      .from("ads_campaigns")
      .update({ name: c.name, platforms: c.platforms })
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
                <Label className="text-[12px] mb-2 block">Platforms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AD_PLATFORMS.map((p) => {
                    const checked = c.platforms.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? "border-primary/60 bg-primary/5"
                            : "border-border bg-background hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            togglePlatform(p.id, c.platforms, (v) => updateCampaign(c, { platforms: v }))
                          }
                        />
                        <img src={p.logo} alt="" className="w-5 h-5 object-contain" />
                        <span className="text-[12px] font-medium text-foreground">{p.label}</span>
                      </label>
                    );
                  })}
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
          <Label className="text-[12px] mb-2 block">Platforms</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AD_PLATFORMS.map((p) => {
              const checked = draft.platforms.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    checked
                      ? "border-primary/60 bg-primary/5"
                      : "border-border bg-background hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      togglePlatform(p.id, draft.platforms, (v) => setDraft({ ...draft, platforms: v }))
                    }
                  />
                  <img src={p.logo} alt="" className="w-5 h-5 object-contain" />
                  <span className="text-[12px] font-medium text-foreground">{p.label}</span>
                </label>
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
