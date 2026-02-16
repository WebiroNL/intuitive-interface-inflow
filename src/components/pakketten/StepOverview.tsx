import { Check } from "lucide-react";
import { packages, cmsOptions, hostingOptions, addOns } from "./data";
import { BriefingData } from "./types";

interface StepOverviewProps {
  selectedPackage: string | null;
  selectedCms: string | null;
  selectedHosting: string | null;
  selectedAddOns: string[];
  briefing: BriefingData;
}

export function StepOverview({ selectedPackage, selectedCms, selectedHosting, selectedAddOns, briefing }: StepOverviewProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const cms = cmsOptions.find((c) => c.id === selectedCms);
  const hosting = hostingOptions.find((h) => h.id === selectedHosting);
  const selectedAddOnItems = addOns.filter((a) => selectedAddOns.includes(a.id));

  const eenmalig =
    (typeof pkg?.price === "number" ? pkg.price : 0) +
    (cms?.price || 0) +
    selectedAddOnItems.filter((a) => a.period === "eenmalig").reduce((s, a) => s + a.price, 0);

  const maandelijks =
    (hosting?.price || 0) +
    selectedAddOnItems.filter((a) => a.period === "per maand").reduce((s, a) => s + a.price, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Jouw overzicht<span className="text-primary">.</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Controleer je selectie hieronder. Na het versturen nemen wij binnen 24 uur contact op.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        {/* Selectie */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-foreground mb-3">Website pakket</h3>
            {pkg ? (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{pkg.name}</span>
                <span className="font-bold text-foreground">
                  {typeof pkg.price === "number" ? `€${pkg.price}` : pkg.price}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Niet geselecteerd</span>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-foreground mb-3">CMS & Hosting</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{cms?.name || "Niet geselecteerd"}</span>
                {cms && <span className="font-bold text-foreground">{cms.price === 0 ? "Gratis" : `€${cms.price}`}</span>}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{hosting?.name || "Niet geselecteerd"}</span>
                {hosting && <span className="font-bold text-foreground">€{hosting.price}/mnd</span>}
              </div>
            </div>
          </div>

          {selectedAddOnItems.length > 0 && (
            <div className="p-5 rounded-2xl border border-border bg-card">
              <h3 className="font-bold text-foreground mb-3">Add-ons</h3>
              <div className="space-y-2">
                {selectedAddOnItems.map((a) => (
                  <div key={a.id} className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary" />
                      {a.name}
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      €{a.price}{a.period === "per maand" ? "/mnd" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Totaal + briefing */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border-2 border-primary bg-primary/5">
            <h3 className="font-bold text-foreground mb-4">Totaaloverzicht</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Eenmalig</span>
                <span className="text-xl font-bold text-foreground">€{eenmalig}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maandelijks</span>
                <span className="text-xl font-bold text-foreground">€{maandelijks}/mnd</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Alle prijzen zijn exclusief BTW</p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-foreground mb-3">Contactgegevens</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Bedrijf:</strong> {briefing.bedrijfsnaam || "—"}</p>
              <p><strong className="text-foreground">Contact:</strong> {briefing.contactpersoon || "—"}</p>
              <p><strong className="text-foreground">E-mail:</strong> {briefing.email || "—"}</p>
              <p><strong className="text-foreground">Telefoon:</strong> {briefing.telefoon || "—"}</p>
              {briefing.branche && <p><strong className="text-foreground">Branche:</strong> {briefing.branche}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
