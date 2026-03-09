import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { updatePageMeta } from "@/utils/seo";
import { StepIndicator } from "@/components/pakketten/StepIndicator";
import { StepPackage } from "@/components/pakketten/StepPackage";
import { StepCmsHosting } from "@/components/pakketten/StepCmsHosting";
import { StepAddOns } from "@/components/pakketten/StepAddOns";
import { StepBriefing } from "@/components/pakketten/StepBriefing";
import { StepOverview } from "@/components/pakketten/StepOverview";
import { SelectionSidebar } from "@/components/pakketten/SelectionSidebar";
import { ComparisonTable } from "@/components/pakketten/ComparisonTable";
import { CTASection } from "@/components/CTASection";
import { BriefingData, ContractDuration } from "@/components/pakketten/types";

const emptyBriefing: BriefingData = {
  naam: "",
  bedrijfsnaam: "",
  kvkNummer: "",
  btwNummer: "",
  email: "",
  telefoon: "",
  website: "",
  doelWebsite: "",
  doelgroep: "",
  inspiratieWebsites: "",
  gewensteOpleverdatum: "",
  opmerkingen: "",
  kortingscode: "",
  emailUpdates: false,
  akkoord: false,
};

const Pakketten = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedCmsHosting, setSelectedCmsHosting] = useState<string | null>(null);
  const [contractDuration, setContractDuration] = useState<ContractDuration>("maandelijks");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [briefing, setBriefing] = useState<BriefingData>(emptyBriefing);

  useEffect(() => {
    updatePageMeta(
      "Pakketten - Website pakketten vanaf €449",
      "Bekijk onze website pakketten. Van basic websites tot uitgebreide e-commerce oplossingen. Transparante prijzen en geen verborgen kosten. Vanaf €449."
    );
  }, []);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    switch (step) {
      case 1: return !!selectedPackage;
      case 2: return !!selectedCmsHosting;
      case 3: return true;
      case 4: return !!(briefing.naam && briefing.email && briefing.telefoon && briefing.doelWebsite && briefing.doelgroep && briefing.akkoord);
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      window.location.href = "/contact";
      return;
    }
    setStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-background">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border bg-background pt-[100px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Nog geen website? Kies hieronder je pakket.
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.4rem, 4.8vw, 4rem)" }}
            >
              <span className="text-foreground">Kies jouw pakket</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed mb-6 max-w-[520px]">
              Van basis website tot complete webshop. Transparante prijzen, geen verborgen kosten.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>•</span>
              <Link to="/marketing" className="text-primary hover:underline inline-flex items-center gap-1">
                Al een website? Bekijk onze marketingdiensten <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CONFIGURATOR ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <StepIndicator currentStep={step} />

          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            <div>
              {step === 1 && (
                <StepPackage selected={selectedPackage} onSelect={setSelectedPackage} />
              )}
              {step === 2 && (
                <StepCmsHosting
                  selected={selectedCmsHosting}
                  onSelect={setSelectedCmsHosting}
                  contractDuration={contractDuration}
                  onContractChange={setContractDuration}
                />
              )}
              {step === 3 && (
                <StepAddOns
                  selected={selectedAddOns}
                  onToggle={toggleAddOn}
                  contractDuration={contractDuration}
                  onContractChange={setContractDuration}
                />
              )}
              {step === 4 && (
                <StepBriefing data={briefing} onChange={setBriefing} />
              )}
              {step === 5 && (
                <StepOverview
                  selectedPackage={selectedPackage}
                  selectedCmsHosting={selectedCmsHosting}
                  contractDuration={contractDuration}
                  selectedAddOns={selectedAddOns}
                  briefing={briefing}
                />
              )}
            </div>

            <div className="hidden lg:block">
              <SelectionSidebar
                step={step}
                selectedPackage={selectedPackage}
                selectedCmsHosting={selectedCmsHosting}
                contractDuration={contractDuration}
                selectedAddOns={selectedAddOns}
                onNext={handleNext}
                onPrev={handlePrev}
                canNext={canNext()}
              />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="lg:hidden mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 rounded-[6px] border border-input text-foreground font-semibold text-[14px]"
              >
                Vorige stap
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex-1 py-3 rounded-[6px] bg-primary text-primary-foreground font-semibold text-[14px] disabled:opacity-50"
            >
              {step === 5 ? "Versturen" : "Volgende stap"}
            </button>
          </div>
        </div>
      </section>

      <ComparisonTable />
      <CTASection />
    </main>
  );
};

export default Pakketten;
