import { ArrowRight } from "lucide-react";
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

  const nextLabel = step === totalSteps ? "Versturen" : "Volgende stap";

  return (
    <div className="sticky top-28 rounded-xl border border-border bg-card p-5">
      <h3 className="text-[14px] font-bold text-foreground mb-4">Jouw selectie</h3>

      {!selectedPackage && !selectedMarketing.length && flowType === "website" && step === 1 && (
        <p className="text-[13px] text-muted-foreground">Selecteer een pakket om te beginnen</p>
      )}

      {selectedMarketing.length === 0 && flowType === "marketing" && step === 1 && (
        <p className="text-[13px] text-muted-foreground">Selecteer minimaal één dienst</p>
      )}

      <div className="space-y-2 text-[13px]">
        {pkg && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pkg.name}</span>
            <span className="font-semibold text-foreground">
              {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
            </span>
          </div>
        )}
        {cmsHosting && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{cmsHosting.name}</span>
            <span className="font-semibold text-foreground">
              {typeof cmsHosting.price === "number"
                ? cmsHosting.price === 0 ? "Gratis" : `€${cmsMonthly}/mnd`
                : cmsHosting.price}
            </span>
          </div>
        )}
        {addOnItems.map((a) => (
          <div key={a.id} className="flex justify-between">
            <span className="text-muted-foreground">{a.name}</span>
            <span className="font-semibold text-foreground">
              {typeof a.price === "string" ? a.price : (
                <>€{a.period === "per maand" ? Math.round((a.price as number) * (1 - discount)) : a.price}{a.period === "per maand" ? "/mnd" : ""}</>
              )}
            </span>
          </div>
        ))}
        {marketingItems.map((m) => (
          <div key={m.id} className="flex justify-between">
            <span className="text-muted-foreground">{m.name}</span>
            <span className="font-semibold text-foreground">€{m.monthlyPrice}/mnd</span>
          </div>
        ))}
      </div>

      {(eenmalig > 0 || maandelijks > 0) && (
        <div className="mt-4 pt-4 border-t border-border space-y-1.5">
          {eenmalig > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">Eenmalig</span>
              <span className="font-bold text-foreground">€{eenmalig}</span>
            </div>
          )}
          {maandelijks > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">Maandelijks</span>
              <span className="font-bold text-foreground">€{maandelijks}/mnd</span>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">ex. btw</p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <button
          onClick={onNext}
          disabled={!canNext}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {nextLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
        {step > 1 && (
          <button
            onClick={onPrev}
            className="w-full px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
          >
            Vorige stap
          </button>
        )}
      </div>
    </div>
  );
}
