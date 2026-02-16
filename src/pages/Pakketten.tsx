import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from "@/utils/seo";
import { StepIndicator } from "@/components/pakketten/StepIndicator";
import { StepPackage } from "@/components/pakketten/StepPackage";
import { StepCmsHosting } from "@/components/pakketten/StepCmsHosting";
import { StepAddOns } from "@/components/pakketten/StepAddOns";
import { StepBriefing } from "@/components/pakketten/StepBriefing";
import { StepOverview } from "@/components/pakketten/StepOverview";
import { SelectionSidebar } from "@/components/pakketten/SelectionSidebar";
import { ComparisonTable } from "@/components/pakketten/ComparisonTable";
import { BriefingData } from "@/components/pakketten/types";

const emptyBriefing: BriefingData = {
  bedrijfsnaam: "",
  contactpersoon: "",
  email: "",
  telefoon: "",
  website: "",
  branche: "",
  doelgroep: "",
  doel: "",
  opmerkingen: "",
};

const Pakketten = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedCms, setSelectedCms] = useState<string | null>(null);
  const [selectedHosting, setSelectedHosting] = useState<string | null>(null);
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
      case 2: return !!selectedCms && !!selectedHosting;
      case 3: return true; // add-ons are optional
      case 4: return !!(briefing.bedrijfsnaam && briefing.email && briefing.contactpersoon && briefing.telefoon);
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      // Submit — for now navigate to contact
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
    <main>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-background to-background">
        <div className="container-webiro text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                Nog geen website? Kies hieronder je pakket.
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <span>•</span>
              <Link to="/marketing" className="text-primary hover:underline">
                Al een website? Bekijk onze marketingdiensten
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <TypewriterText text="Kies jouw pakket" speed={60} />
              <span className="text-primary">.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Van basis website tot complete webshop. Transparante prijzen, geen verborgen kosten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Configurator */}
      <section className="py-12 md:py-20">
        <div className="container-webiro">
          <StepIndicator currentStep={step} />

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              {step === 1 && (
                <StepPackage selected={selectedPackage} onSelect={setSelectedPackage} />
              )}
              {step === 2 && (
                <StepCmsHosting
                  selectedCms={selectedCms}
                  selectedHosting={selectedHosting}
                  onSelectCms={setSelectedCms}
                  onSelectHosting={setSelectedHosting}
                />
              )}
              {step === 3 && (
                <StepAddOns selected={selectedAddOns} onToggle={toggleAddOn} />
              )}
              {step === 4 && (
                <StepBriefing data={briefing} onChange={setBriefing} />
              )}
              {step === 5 && (
                <StepOverview
                  selectedPackage={selectedPackage}
                  selectedCms={selectedCms}
                  selectedHosting={selectedHosting}
                  selectedAddOns={selectedAddOns}
                  briefing={briefing}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <SelectionSidebar
                step={step}
                selectedPackage={selectedPackage}
                selectedCms={selectedCms}
                selectedHosting={selectedHosting}
                selectedAddOns={selectedAddOns}
                onNext={handleNext}
                onPrev={handlePrev}
                canNext={canNext()}
              />
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="lg:hidden mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-semibold"
              >
                Vorige stap
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
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
