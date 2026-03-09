import { Check } from "lucide-react";
import { packages, cmsHostingTiers, addOns, contractDiscounts } from "./data";
import { BriefingData, ContractDuration } from "./types";

interface StepOverviewProps {
  selectedPackage: string | null;
  selectedCmsHosting: string | null;
  contractDuration: ContractDuration;
  selectedAddOns: string[];
  briefing: BriefingData;
}

export function StepOverview({ selectedPackage, selectedCmsHosting, contractDuration, selectedAddOns, briefing }: StepOverviewProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const cmsHosting = cmsHostingTiers.find((t) => t.id === selectedCmsHosting);
  const selectedAddOnItems = addOns.filter((a) => selectedAddOns.includes(a.id));
  const discount = contractDiscounts[contractDuration].discount;

  const eenmalig =
    (typeof pkg?.price === "number" ? pkg.price : 0) +
    selectedAddOnItems.filter((a) => a.period === "eenmalig" && typeof a.price === "number").reduce((s, a) => s + (a.price as number), 0);

  const cmsMonthly = typeof cmsHosting?.price === "number" ? Math.round(cmsHosting.price * (1 - discount)) : 0;
  const addonsMonthly = selectedAddOnItems
    .filter((a) => a.period === "per maand" && typeof a.price === "number")
    .reduce((s, a) => s + Math.round((a.price as number) * (1 - discount)), 0);
  const maandelijks = cmsMonthly + addonsMonthly;

  const eenmaligIncl = Math.round(eenmalig * 1.21);
  const maandelijksIncl = Math.round(maandelijks * 1.21);

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Jouw overzicht</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Controleer je selectie. Na het versturen nemen wij binnen 24 uur contact op.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {/* Selection overview */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-[13px] font-bold text-foreground mb-3">Website pakket</h3>
            {pkg ? (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-muted-foreground">{pkg.name}</span>
                <span className="font-bold text-foreground text-[14px]">
                  {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
                </span>
              </div>
            ) : (
              <span className="text-[13px] text-muted-foreground">Niet geselecteerd</span>
            )}
          </div>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-[13px] font-bold text-foreground mb-3">CMS & Hosting</h3>
            {cmsHosting ? (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-muted-foreground">{cmsHosting.name}</span>
                <span className="font-bold text-foreground text-[14px]">
                  {typeof cmsHosting.price === "number"
                    ? cmsHosting.price === 0 ? "Gratis" : `€${cmsMonthly}/mnd`
                    : cmsHosting.price}
                </span>
              </div>
            ) : (
              <span className="text-[13px] text-muted-foreground">Niet geselecteerd</span>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              Contract: {contractDiscounts[contractDuration].label}
            </p>
          </div>

          {selectedAddOnItems.length > 0 && (
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-[13px] font-bold text-foreground mb-3">Add-ons</h3>
              <div className="space-y-2">
                {selectedAddOnItems.map((a) => (
                  <div key={a.id} className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-primary" />
                      {a.name}
                    </span>
                    <span className="font-bold text-foreground text-[13px]">
                      {typeof a.price === "string" ? a.price : (
                        <>€{a.period === "per maand" ? Math.round((a.price as number) * (1 - discount)) : a.price}{a.period === "per maand" ? "/mnd" : ""}</>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Totals + contact */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border-2 border-primary bg-primary/[0.03]">
            <h3 className="text-[13px] font-bold text-foreground mb-4">Totaaloverzicht</h3>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-muted-foreground">Eenmalig (ex. BTW)</span>
                  <span className="text-[18px] font-bold text-foreground">€{eenmalig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">incl. 21% BTW</span>
                  <span className="text-[13px] text-muted-foreground">€{eenmaligIncl}</span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-[13px] text-muted-foreground">Maandelijks (ex. BTW)</span>
                  <span className="text-[18px] font-bold text-foreground">€{maandelijks}/mnd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">incl. 21% BTW</span>
                  <span className="text-[13px] text-muted-foreground">€{maandelijksIncl}/mnd</span>
                </div>
              </div>
            </div>
            {typeof cmsHosting?.price === "number" && cmsHosting.price > 0 && (
              <p className="text-[12px] text-primary font-medium">✅ Eerste maand CMS gratis</p>
            )}
          </div>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-[13px] font-bold text-foreground mb-3">Contactgegevens</h3>
            <div className="space-y-1 text-[12px] text-muted-foreground">
              <p><strong className="text-foreground">Naam:</strong> {briefing.naam || "—"}</p>
              <p><strong className="text-foreground">Bedrijf:</strong> {briefing.bedrijfsnaam || "—"}</p>
              <p><strong className="text-foreground">E-mail:</strong> {briefing.email || "—"}</p>
              <p><strong className="text-foreground">Telefoon:</strong> {briefing.telefoon || "—"}</p>
              {briefing.kvkNummer && <p><strong className="text-foreground">KVK:</strong> {briefing.kvkNummer}</p>}
              {briefing.btwNummer && <p><strong className="text-foreground">BTW:</strong> {briefing.btwNummer}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
