import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PartnerProgramNav } from "@/components/admin/PartnerProgramNav";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Tier {
  id: string;
  tier: "bronze" | "silver" | "gold";
  display_name: string;
  description: string | null;
  color: string;
  min_revenue: number;
  max_revenue: number | null;
  customer_discount: number;
  commission_website: number;
  commission_marketing: number;
  commission_shop: number;
  commission_addon: number;
  benefits: any;
  sort_order: number;
}

export default function AdminPartnerTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("partner_tiers").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setTiers((data as Tier[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (t: Tier) => {
    const { error } = await supabase.from("partner_tiers").update({
      display_name: t.display_name,
      description: t.description,
      color: t.color,
      min_revenue: t.min_revenue,
      max_revenue: t.max_revenue,
      customer_discount: t.customer_discount,
      commission_website: t.commission_website,
      commission_marketing: t.commission_marketing,
      commission_shop: t.commission_shop,
      commission_addon: t.commission_addon,
      benefits: t.benefits,
    } as any).eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success(`${t.display_name} opgeslagen`);
  };

  const update = (id: string, patch: Partial<Tier>) => {
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));
  };

  return (
    <div className="space-y-6">
      <PartnerProgramNav />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Laden...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: t.color }} />
                <div>
                  <h3 className="font-semibold text-foreground capitalize">{t.tier}</h3>
                  <p className="text-xs text-muted-foreground">{t.display_name}</p>
                </div>
              </div>

              <Input label="Naam" value={t.display_name} onChange={(v) => update(t.id, { display_name: v })} />
              <Input label="Beschrijving" value={t.description || ""} onChange={(v) => update(t.id, { description: v })} />
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Kleur</span>
                <div className="mt-1 flex items-center gap-2">
                  <label className="relative w-9 h-9 rounded-md border border-border flex-shrink-0 cursor-pointer overflow-hidden" style={{ backgroundColor: t.color }}>
                    <input
                      type="color"
                      value={t.color}
                      onChange={(e) => update(t.id, { color: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  <input
                    type="text"
                    value={t.color}
                    onChange={(e) => update(t.id, { color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 h-9 px-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input label="Min omzet €" type="number" value={String(t.min_revenue)} onChange={(v) => update(t.id, { min_revenue: Number(v) })} />
                <Input label="Max omzet €" type="number" value={t.max_revenue == null ? "" : String(t.max_revenue)} onChange={(v) => update(t.id, { max_revenue: v ? Number(v) : null })} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input label="% Website" type="number" value={String(t.commission_website)} onChange={(v) => update(t.id, { commission_website: Number(v) })} />
                <Input label="% Marketing" type="number" value={String(t.commission_marketing)} onChange={(v) => update(t.id, { commission_marketing: Number(v) })} />
                <Input label="% Shop" type="number" value={String(t.commission_shop)} onChange={(v) => update(t.id, { commission_shop: Number(v) })} />
                <Input label="% Add-on" type="number" value={String(t.commission_addon)} onChange={(v) => update(t.id, { commission_addon: Number(v) })} />
              </div>

              <Input label="Klantkorting %" type="number" value={String(t.customer_discount)} onChange={(v) => update(t.id, { customer_discount: Number(v) })} />

              <button onClick={() => save(t)} className="w-full h-9 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                Opslaan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-9 px-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
