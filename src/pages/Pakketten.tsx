import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { updatePageMeta } from "@/utils/seo";
import { PakkettenHero } from "@/components/pakketten/HeroMockups";
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
import { packages, cmsHostingTiers, addOns, contractDiscounts, marketingServices } from "@/components/pakketten/data";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  wachtwoord: "",
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

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
        case 3: return true;
        case 4: return true;
        case 5: return !!(briefing.naam && briefing.email && briefing.telefoon && briefing.doelWebsite && briefing.doelgroep && briefing.wachtwoord && briefing.wachtwoord.length >= 6 && briefing.akkoord);
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

  const handleNext = async () => {
    if (step === totalSteps) {
      // Submit order + create account
      setSubmitting(true);
      try {
        // 1. Create account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: briefing.email,
          password: briefing.wachtwoord,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: briefing.naam },
          },
        });
        if (authError) throw new Error(authError.message);

        const userId = authData.user?.id || null;

        // 2. Calculate totals
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

        const btw = Math.round(eenmalig * 0.21);
        const totaal = eenmalig + btw;

        // 3. Create lead
        const { data: lead } = await supabase
          .from("leads")
          .insert({
            naam: briefing.naam,
            email: briefing.email,
            telefoon: briefing.telefoon || null,
            bedrijfsnaam: briefing.bedrijfsnaam || null,
            website: briefing.website || null,
            bron: flowType === "website" ? "pakketten-website" : "pakketten-marketing",
            bericht: `Pakket: ${pkg?.name || "Marketing"} | Doel: ${briefing.doelWebsite}`,
          } as any)
          .select("id")
          .single();

        // 4. Create order
        await supabase
          .from("orders")
          .insert({
            user_id: userId,
            lead_id: (lead as any)?.id || null,
            pakket: pkg?.name || null,
            cms_hosting: cmsHosting?.name || null,
            contract_duur: contractDuration,
            add_ons: selectedAddOnItems.map((a) => ({ id: a.id, name: a.name, price: a.price, period: a.period })),
            marketing_services: marketingItems.map((m) => ({ id: m.id, name: m.name, monthly: m.monthlyPrice, setup: m.setupPrice })),
            briefing: briefing as any,
            subtotaal: eenmalig,
            btw,
            totaal,
            maandelijks,
            status: "nieuw",
          } as any);

        setSubmitted(true);
        toast.success("Bestelling succesvol geplaatst!");
      } catch (e: any) {
        toast.error(e.message || "Er ging iets mis. Probeer het opnieuw.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (step === 1) {
      setStep(0);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFlowSelect = (flow: FlowType) => {
    setFlowType(flow);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStep = () => {
    if (step === 0) {
      return <StepChoice selected={flowType} onSelect={handleFlowSelect} />;
    }

    if (flowType === "website") {
      switch (step) {
        case 1: return <StepPackage selected={selectedPackage} onSelect={setSelectedPackage} />;
        case 2: return <StepCmsHosting selected={selectedCmsHosting} onSelect={setSelectedCmsHosting} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 3: return <StepAddOns selected={selectedAddOns} onToggle={toggleAddOn} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 4: return <StepMarketing selected={selectedMarketing} onToggle={toggleMarketing} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 5: return <StepBriefing data={briefing} onChange={setBriefing} />;
        case 6: return <StepOverview selectedPackage={selectedPackage} selectedCmsHosting={selectedCmsHosting} contractDuration={contractDuration} selectedAddOns={selectedAddOns} selectedMarketing={selectedMarketing} briefing={briefing} flowType="website" />;
      }
    }

    if (flowType === "marketing") {
      switch (step) {
        case 1: return <StepMarketing selected={selectedMarketing} onToggle={toggleMarketing} contractDuration={contractDuration} onContractChange={setContractDuration} />;
        case 2: return <StepBriefing data={briefing} onChange={setBriefing} />;
        case 3: return <StepOverview selectedPackage={null} selectedCmsHosting={null} contractDuration={contractDuration} selectedAddOns={[]} selectedMarketing={selectedMarketing} briefing={briefing} flowType="marketing" />;
      }
    }

    return null;
  };

  return (
    <main className="bg-background">
      {/* Hero */}
      <PakkettenHero />

      {/* Configurator */}
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
          {step > 0 && (
            <div className="lg:hidden mt-10 flex gap-3">
              <button
                onClick={handlePrev}
                className="flex-1 py-3.5 rounded-lg border border-border text-foreground font-semibold text-[14px] hover:bg-muted/40 transition-colors"
              >
                Vorige stap
              </button>
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[14px] disabled:opacity-40"
              >
                {step === totalSteps ? "Versturen" : "Volgende stap"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 0 && (
            <div className="lg:hidden mt-8">
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[14px] disabled:opacity-40"
              >
                Volgende stap
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {(!flowType || flowType === "website") && <ComparisonTable />}
      <CTASection />
    </main>
  );
};

export default Pakketten;
