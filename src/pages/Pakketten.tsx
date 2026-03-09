import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { updatePageMeta } from "@/utils/seo";
import { StepChoice, FlowType } from "@/components/pakketten/StepChoice";
import { StepIndicator } from "@/components/pakketten/StepIndicator";
import { StepPackage } from "@/components/pakketten/StepPackage";
import { StepCmsHosting } from "@/components/pakketten/StepCmsHosting";
import { StepAddOns } from "@/components/pakketten/StepAddOns";
import { StepMarketing } from "@/components/pakketten/StepMarketing";
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

/*
  Flow "website":  0→Choice  1→Package  2→CMS  3→AddOns  4→Marketing  5→Briefing  6→Overview
  Flow "marketing": 0→Choice  1→Marketing  2→Briefing  3→Overview
*/

const websiteStepLabels = ["Keuze", "Website pakket", "CMS & Hosting", "Add-ons", "Marketing", "Briefing", "Overzicht"];
const marketingStepLabels = ["Keuze", "Marketing", "Briefing", "Overzicht"];

const Pakketten = () => {
  const [step, setStep] = useState(0);
  const [flowType, setFlowType] = useState<FlowType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedCmsHosting, setSelectedCmsHosting] = useState<string | null>(null);
  const [contractDuration, setContractDuration] = useState<ContractDuration>("maandelijks");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedMarketing, setSelectedMarketing] = useState<string[]>([]);
  const [briefing, setBriefing] = useState<BriefingData>(emptyBriefing);

  useEffect(() => {
    updatePageMeta(
      "Pakketten - Website & Marketing vanaf €449",
      "Bekijk onze website pakketten en marketing diensten. Van basic websites tot complete marketing automation. Transparante prijzen, geen verborgen kosten."
    );
  }, []);

  const totalSteps = flowType === "website" ? 6 : flowType === "marketing" ? 3 : 0;
  const stepLabels = flowType === "website" ? websiteStepLabels : marketingStepLabels;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleMarketing = (id: string) => {
    setSelectedMarketing((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (step === 0) return !!flowType;

    if (flowType === "website") {
      switch (step) {
        case 1: return !!selectedPackage;
        case 2: return !!selectedCmsHosting;
        case 3: return true; // add-ons optional
        case 4: return true; // marketing optional
        case 5: return !!(briefing.naam && briefing.email && briefing.telefoon && briefing.doelWebsite && briefing.doelgroep && briefing.akkoord);
        case 6: return true;
        default: return false;
      }
    }

    if (flowType === "marketing") {
      switch (step) {
        case 1: return selectedMarketing.length > 0;
        case 2: return !!(briefing.naam && briefing.email && briefing.telefoon && briefing.doelWebsite && briefing.doelgroep && briefing.akkoord);
        case 3: return true;
        default: return false;
      }
    }

    return false;
  };

  const handleNext = () => {
    if (step === totalSteps) {
      window.location.href = "/contact";
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (step === 1) {
      // Go back to choice, reset flow
      setStep(0);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFlowSelect = (flow: FlowType) => {
    setFlowType(flow);
  };

  // Render current step content
  const renderStep = () => {
    if (step === 0) {
      return <StepChoice selected={flowType} onSelect={handleFlowSelect} />;
    }

    if (flowType === "website") {
      switch (step) {
        case 1: return <StepPackage selected={selectedPackage} onSelect={setSelectedPackage} />;
        case 2: return <StepCmsHosting selected={selectedCmsHosting} onSelect={setSelectedCmsHosting} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 3: return <StepAddOns selected={selectedAddOns} onToggle={toggleAddOn} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 4: return <StepMarketing selected={selectedMarketing} onToggle={toggleMarketing} />;
        case 5: return <StepBriefing data={briefing} onChange={setBriefing} />;
        case 6: return <StepOverview selectedPackage={selectedPackage} selectedCmsHosting={selectedCmsHosting} contractDuration={contractDuration} selectedAddOns={selectedAddOns} selectedMarketing={selectedMarketing} briefing={briefing} flowType="website" />;
      }
    }

    if (flowType === "marketing") {
      switch (step) {
        case 1: return <StepMarketing selected={selectedMarketing} onToggle={toggleMarketing} />;
        case 2: return <StepBriefing data={briefing} onChange={setBriefing} />;
        case 3: return <StepOverview selectedPackage={null} selectedCmsHosting={null} contractDuration={contractDuration} selectedAddOns={[]} selectedMarketing={selectedMarketing} briefing={briefing} flowType="marketing" />;
      }
    }

    return null;
  };

  return (
    <main className="bg-background">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border bg-background pt-[100px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Website of marketing nodig? Configureer hieronder.
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.4rem, 4.8vw, 4rem)" }}
            >
              <span className="text-foreground">Kies jouw pakket</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed mb-6 max-w-[520px]">
              Van website bouw tot online marketing. Transparante prijzen, geen verborgen kosten.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ CONFIGURATOR ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          {step > 0 && flowType && (
            <StepIndicator
              currentStep={step}
              stepLabels={stepLabels.slice(1)}
              totalSteps={totalSteps}
            />
          )}

          <div className={step > 0 && flowType ? "grid lg:grid-cols-[1fr_340px] gap-10" : ""}>
            <div>{renderStep()}</div>

            {step > 0 && flowType && (
              <div className="hidden lg:block">
                <SelectionSidebar
                  step={step}
                  totalSteps={totalSteps}
                  flowType={flowType}
                  selectedPackage={selectedPackage}
                  selectedCmsHosting={selectedCmsHosting}
                  contractDuration={contractDuration}
                  selectedAddOns={selectedAddOns}
                  selectedMarketing={selectedMarketing}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  canNext={canNext()}
                />
              </div>
            )}
          </div>

          {/* Mobile nav */}
          <div className="lg:hidden mt-8 flex gap-3">
            {step > 0 && (
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
              {step === 0 ? "Volgende stap" : step === totalSteps ? "Versturen" : "Volgende stap"}
            </button>
          </div>
        </div>
      </section>

      {(!flowType || flowType === "website") && <ComparisonTable />}
      <CTASection />
    </main>
  );
};

export default Pakketten;
