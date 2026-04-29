import { ArrowRight, Check, Info } from "lucide-react";
import { packages, cmsHostingTiers, addOns, contractDiscounts, marketingServices } from "./data";
import { ContractDuration } from "./types";
import { FlowType } from "./StepChoice";

interface SelectionSidebarProps {
  step: number;
  totalSteps: number;
  flowType: FlowType;
  selectedPackage: string | null;
  selectedCmsHosting: string | null;
  contractDuration: ContractDuration;
  selectedAddOns: string[];
  selectedMarketing: string[];
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
}

export function SelectionSidebar({
  step,
  totalSteps,
  flowType,
  selectedPackage,
  selectedCmsHosting,
  contractDuration,
  selectedAddOns,
  selectedMarketing,
  onNext,
  onPrev,
  canNext,
}: SelectionSidebarProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const cmsHosting = cmsHostingTiers.find((t) => t.id === selectedCmsHosting);
  const addOnItems = addOns.filter((a) => selectedAddOns.includes(a.id));
  const marketingItems = marketingServices.filter((s) => selectedMarketing.includes(s.id));
  const discount = contractDiscounts[contractDuration].discount;

  // Eenmalig: package + eenmalige add-ons + marketing setup fees
  const eenmalig =
    (typeof pkg?.price === "number" ? pkg.price : 0) +
    addOnItems.filter((a) => a.period === "eenmalig" && typeof a.price === "number").reduce((s, a) => s + (a.price as number), 0) +
    marketingItems.reduce((s, m) => s + (m.setupPrice || 0), 0);

  // Maandelijks: CMS + monthly add-ons + marketing monthly
  const cmsMonthly = typeof cmsHosting?.price === "number" ? Math.round(cmsHosting.price * (1 - discount)) : 0;
  const addonsMonthly = addOnItems
    .filter((a) => a.period === "per maand" && typeof a.price === "number")
    .reduce((s, a) => s + Math.round((a.price as number) * (1 - discount)), 0);
  const marketingMonthly = marketingItems.reduce((s, m) => s + m.monthlyPrice, 0);
  const maandelijks = cmsMonthly + addonsMonthly + marketingMonthly;

  const eenmaligIncl = Math.round(eenmalig * 1.21);
  const maandelijksIncl = Math.round(maandelijks * 1.21);

  const nextLabel = step === totalSteps ? "Bestellen & afrekenen" : "Volgende stap";
  const hasSelection = !!pkg || !!cmsHosting || addOnItems.length > 0 || marketingItems.length > 0;

  return (
    <div className="sticky top-28">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <h3 className="text-[14px] font-bold text-foreground">Jouw selectie</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {contractDiscounts[contractDuration].label}
          </p>
        </div>

        <div className="p-5">
          {!hasSelection && (
            <p className="text-[13px] text-muted-foreground py-2">
              {flowType === "website" ? "Selecteer een pakket om te beginnen" : "Selecteer minimaal één dienst"}
            </p>
          )}

          <div className="space-y-2.5 text-[13px]">
            {pkg && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  {pkg.name}
                </span>
                <span className="font-bold text-foreground whitespace-nowrap">
                  {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
                </span>
              </div>
            )}
            {cmsHosting && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  {cmsHosting.name}
                </span>
                <span className="font-bold text-foreground whitespace-nowrap">
                  {typeof cmsHosting.price === "number"
                    ? cmsHosting.price === 0 ? "Gratis" : `€${cmsMonthly}/mnd`
                    : cmsHosting.price}
                </span>
              </div>
            )}
            {addOnItems.map((a) => (
              <div key={a.id} className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  {a.name}
                </span>
                <span className="font-bold text-foreground whitespace-nowrap">
                  {typeof a.price === "string" ? a.price : (
                    <>€{a.period === "per maand" ? Math.round((a.price as number) * (1 - discount)) : a.price}{a.period === "per maand" ? "/mnd" : ""}</>
                  )}
                </span>
              </div>
            ))}
            {marketingItems.map((m) => (
              <div key={m.id} className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  {m.name}
                </span>
                <span className="font-bold text-foreground whitespace-nowrap">€{m.monthlyPrice}/mnd</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          {(eenmalig > 0 || maandelijks > 0) && (
            <div className="mt-5 pt-5 border-t border-border space-y-3">
              {eenmalig > 0 && (
                <div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Eenmalig (ex. BTW)</span>
                    <span className="font-bold text-foreground text-[16px]">€{eenmalig}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
                    <span>incl. 21% BTW</span>
                    <span>€{eenmaligIncl}</span>
                  </div>
                </div>
              )}
              {maandelijks > 0 && (
                <div className={eenmalig > 0 ? "pt-2" : ""}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Maandelijks (ex. BTW)</span>
                    <span className="font-bold text-foreground text-[16px]">€{maandelijks}/mnd</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
                    <span>incl. 21% BTW</span>
                    <span>€{maandelijksIncl}/mnd</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* First month free notice */}
          {typeof cmsHosting?.price === "number" && cmsHosting.price > 0 && (
            <p className="text-[12px] text-primary font-medium flex items-center gap-1.5 mt-4">
              <Check className="w-3.5 h-3.5" /> Eerste maand CMS gratis
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 pt-0 space-y-2">
          <button
            onClick={onNext}
            disabled={!canNext}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-[14px] font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
          {step > 1 && (
            <button
              onClick={onPrev}
              className="w-full px-5 py-3 border border-border text-foreground text-[14px] font-medium rounded-lg hover:bg-muted/40 transition-colors"
            >
              Vorige stap
            </button>
          )}
        </div>
      </div>

      {/* Trust signals */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Check className="w-3 h-3 text-primary" />
          Verwachte levering binnen 7 dagen
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Check className="w-3 h-3 text-primary" />
          Altijd een aanpasbaar abonnement
        </div>
      </div>
    </div>
  );
}
