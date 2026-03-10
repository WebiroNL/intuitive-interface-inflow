import { Check } from "lucide-react";
import { packages, cmsHostingTiers, addOns, contractDiscounts, marketingServices } from "./data";
import { BriefingData, ContractDuration } from "./types";
import { FlowType } from "./StepChoice";

interface StepOverviewProps {
  selectedPackage: string | null;
  selectedCmsHosting: string | null;
  contractDuration: ContractDuration;
  selectedAddOns: string[];
  selectedMarketing: string[];
  briefing: BriefingData;
  flowType: FlowType;
}

export function StepOverview({ selectedPackage, selectedCmsHosting, contractDuration, selectedAddOns, selectedMarketing, briefing, flowType }: StepOverviewProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const cmsHosting = cmsHostingTiers.find((t) => t.id === selectedCmsHosting);
  const selectedAddOnItems = addOns.filter((a) => selectedAddOns.includes(a.id));
  const marketingItems = marketingServices.filter((s) => selectedMarketing.includes(s.id));
  const discount = contractDiscounts[contractDuration].discount;

  const eenmalig =
    (typeof pkg?.price === "number" ? pkg.price : 0) +
    selectedAddOnItems.filter((a) => a.period === "eenmalig" && typeof a.price === "number").reduce((s, a) => s + (a.price as number), 0) +
    marketingItems.reduce((s, m) => s + (m.setupPrice || 0), 0);

  const cmsMonthly = typeof cmsHosting?.price === "number" ? Math.round(cmsHosting.price * (1 - discount)) : 0;
  const addonsMonthly = selectedAddOnItems
    .filter((a) => a.period === "per maand" && typeof a.price === "number")
    .reduce((s, a) => s + Math.round((a.price as number) * (1 - discount)), 0);
  const marketingMonthly = marketingItems.reduce((s, m) => s + m.monthlyPrice, 0);
  const maandelijks = cmsMonthly + addonsMonthly + marketingMonthly;

  const eenmaligIncl = Math.round(eenmalig * 1.21);
  const maandelijksIncl = Math.round(maandelijks * 1.21);

  return (
    <div>
      <div className="mb-10">
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          <span className="text-foreground">Jouw overzicht</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Controleer je selectie. Na het versturen nemen wij binnen 24 uur contact op.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {/* Selection overview */}
        <div className="space-y-4">
          {flowType === "website" && (
            <>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 bg-muted/30 border-b border-border">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">Website pakket</h3>
                </div>
                <div className="p-5">
                  {pkg ? (
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-foreground font-medium">{pkg.name}</span>
                      <span className="font-bold text-foreground text-[16px]">
                        {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">Niet geselecteerd</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 bg-muted/30 border-b border-border">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">CMS & Hosting</h3>
                </div>
                <div className="p-5">
                  {cmsHosting ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] text-foreground font-medium">{cmsHosting.name}</span>
                        <span className="font-bold text-foreground text-[16px]">
                          {typeof cmsHosting.price === "number"
                            ? cmsHosting.price === 0 ? "Gratis" : `€${cmsMonthly}/mnd`
                            : cmsHosting.price}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-1">
                        Contract: {contractDiscounts[contractDuration].label}
                      </p>
                    </>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">Niet geselecteerd</span>
                  )}
                </div>
              </div>

              {selectedAddOnItems.length > 0 && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 bg-muted/30 border-b border-border">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">Add-ons</h3>
                  </div>
                  <div className="p-5 space-y-2.5">
                    {selectedAddOnItems.map((a) => (
                      <div key={a.id} className="flex justify-between items-center">
                        <span className="text-[13px] text-foreground flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-primary" />
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
            </>
          )}

          {marketingItems.length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 bg-muted/30 border-b border-border">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">Marketing diensten</h3>
              </div>
              <div className="p-5 space-y-2.5">
                {marketingItems.map((m) => (
                  <div key={m.id} className="flex justify-between items-center">
                    <span className="text-[13px] text-foreground flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {m.name}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-foreground text-[13px]">€{m.monthlyPrice}/mnd</span>
                      {m.setupPrice && (
                        <p className="text-[11px] text-muted-foreground">+ €{m.setupPrice} setup</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Totals + contact */}
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-primary bg-primary/[0.03] overflow-hidden">
            <div className="px-5 py-3 bg-primary/[0.06] border-b border-primary/20">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">Totaaloverzicht</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {eenmalig > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-[13px] text-muted-foreground">Eenmalig (ex. BTW)</span>
                      <span className="text-[20px] font-bold text-foreground">€{eenmalig}</span>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[11px] text-muted-foreground">incl. 21% BTW</span>
                      <span className="text-[13px] text-muted-foreground">€{eenmaligIncl}</span>
                    </div>
                  </div>
                )}
                {maandelijks > 0 && (
                  <div className={eenmalig > 0 ? "border-t border-border pt-4" : ""}>
                    <div className="flex justify-between">
                      <span className="text-[13px] text-muted-foreground">Maandelijks (ex. BTW)</span>
                      <span className="text-[20px] font-bold text-foreground">€{maandelijks}/mnd</span>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[11px] text-muted-foreground">incl. 21% BTW</span>
                      <span className="text-[13px] text-muted-foreground">€{maandelijksIncl}/mnd</span>
                    </div>
                  </div>
                )}
              </div>
              {typeof cmsHosting?.price === "number" && cmsHosting.price > 0 && (
                <p className="text-[12px] text-primary font-medium flex items-center gap-1.5 mt-4">
                  <Check className="w-3.5 h-3.5" /> Eerste maand CMS gratis
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground">Contactgegevens</h3>
            </div>
            <div className="p-5 space-y-1.5 text-[13px]">
              <p><span className="font-medium text-foreground">Naam:</span> <span className="text-muted-foreground">{briefing.naam || "—"}</span></p>
              <p><span className="font-medium text-foreground">Bedrijf:</span> <span className="text-muted-foreground">{briefing.bedrijfsnaam || "—"}</span></p>
              <p><span className="font-medium text-foreground">E-mail:</span> <span className="text-muted-foreground">{briefing.email || "—"}</span></p>
              <p><span className="font-medium text-foreground">Telefoon:</span> <span className="text-muted-foreground">{briefing.telefoon || "—"}</span></p>
              {briefing.kvkNummer && <p><span className="font-medium text-foreground">KVK:</span> <span className="text-muted-foreground">{briefing.kvkNummer}</span></p>}
              {briefing.btwNummer && <p><span className="font-medium text-foreground">BTW:</span> <span className="text-muted-foreground">{briefing.btwNummer}</span></p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
