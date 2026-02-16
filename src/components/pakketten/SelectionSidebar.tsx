import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages, cmsOptions, hostingOptions, addOns } from "./data";

interface SelectionSidebarProps {
  step: number;
  selectedPackage: string | null;
  selectedCms: string | null;
  selectedHosting: string | null;
  selectedAddOns: string[];
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
}

export function SelectionSidebar({
  step,
  selectedPackage,
  selectedCms,
  selectedHosting,
  selectedAddOns,
  onNext,
  onPrev,
  canNext,
}: SelectionSidebarProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const cms = cmsOptions.find((c) => c.id === selectedCms);
  const hosting = hostingOptions.find((h) => h.id === selectedHosting);
  const addOnItems = addOns.filter((a) => selectedAddOns.includes(a.id));

  const eenmalig =
    (typeof pkg?.price === "number" ? pkg.price : 0) +
    (cms?.price || 0) +
    addOnItems.filter((a) => a.period === "eenmalig").reduce((s, a) => s + a.price, 0);

  const maandelijks =
    (hosting?.price || 0) +
    addOnItems.filter((a) => a.period === "per maand").reduce((s, a) => s + a.price, 0);

  const stepLabels = ["", "Naar CMS & Hosting", "Naar Add-ons", "Naar Briefing", "Naar Overzicht", "Versturen"];

  return (
    <div className="sticky top-28 p-5 rounded-2xl border-2 border-border bg-card">
      <h3 className="font-bold text-foreground mb-4">Jouw selectie</h3>

      {!selectedPackage && step === 1 && (
        <p className="text-sm text-muted-foreground">Selecteer een pakket om te beginnen</p>
      )}

      <div className="space-y-2 text-sm">
        {pkg && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pkg.name}</span>
            <span className="font-semibold text-foreground">
              {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
            </span>
          </div>
        )}
        {cms && cms.price > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{cms.name}</span>
            <span className="font-semibold text-foreground">€{cms.price}</span>
          </div>
        )}
        {hosting && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{hosting.name}</span>
            <span className="font-semibold text-foreground">€{hosting.price}/mnd</span>
          </div>
        )}
        {addOnItems.map((a) => (
          <div key={a.id} className="flex justify-between">
            <span className="text-muted-foreground">{a.name}</span>
            <span className="font-semibold text-foreground">
              €{a.price}{a.period === "per maand" ? "/mnd" : ""}
            </span>
          </div>
        ))}
      </div>

      {(eenmalig > 0 || maandelijks > 0) && (
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          {eenmalig > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Eenmalig</span>
              <span className="font-bold text-foreground">€{eenmalig}</span>
            </div>
          )}
          {maandelijks > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maandelijks</span>
              <span className="font-bold text-foreground">€{maandelijks}/mnd</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">ex. btw</p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <Button
          className="w-full"
          onClick={onNext}
          disabled={!canNext}
        >
          {stepLabels[step]}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {step > 1 && (
          <Button variant="outline" className="w-full" onClick={onPrev}>
            Vorige stap
          </Button>
        )}
      </div>
    </div>
  );
}
