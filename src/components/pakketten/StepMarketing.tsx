import { Check, ChevronDown, ChevronUp, Megaphone, Settings, Bot, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { marketingServices } from "./data";
import { ContractDuration } from "./types";

interface StepMarketingProps {
  selected: string[];
  onToggle: (id: string) => void;
  contractDuration?: ContractDuration;
  onContractChange?: (d: ContractDuration) => void;
}

const categoryLabels: Record<string, string> = {
  ads: "Advertenties",
  automation: "Marketing Automation",
  ai: "AI & Support",
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ads: Megaphone,
  automation: Settings,
  ai: Bot,
};

const includedFeatures = [
  "Volledige strategie & opzet",
  "Wekelijkse campagne optimalisatie",
  "Maandelijkse rapportage & analytics",
  "Direct contact met je marketeer",
  "A/B testing & conversion tracking",
];

const contractDeals: Record<string, { label: string; description: string }> = {
  maandelijks: { label: "Maandelijks", description: "€500/mnd per platform, geen contract" },
  jaarlijks: { label: "12 maanden", description: "1 maand gratis + 2 maanden €250/mnd" },
  "2jaar": { label: "24 maanden", description: "2 maanden gratis + 3 maanden €250/mnd" },
};

export function StepMarketing({ selected, onToggle, contractDuration = "maandelijks", onContractChange }: StepMarketingProps) {
  const categories = [...new Set(marketingServices.map((s) => s.category))];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-10">
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          <span className="text-foreground">Marketing diensten</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
          Selecteer de diensten waarmee je meer klanten wilt bereiken. Per platform €500/mnd (ex. BTW, excl. advertentiebudget).
        </p>
      </div>

      {/* Contract duration for marketing */}
      {onContractChange && (
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground mb-3">Looptijd</p>
          <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-muted/60 border border-border">
            {Object.entries(contractDeals).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => onContractChange(key as ContractDuration)}
                className={`px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  contractDuration === key
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-primary font-medium mt-2.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {contractDeals[contractDuration].description}
          </p>
        </div>
      )}

      {/* What's included box */}
      <div className="rounded-xl border border-border bg-muted/20 p-5 mb-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground mb-3">
          Wat is inbegrepen per platform
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {includedFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => {
          const CatIcon = categoryIcons[cat] || Megaphone;
          return (
            <div key={cat}>
              <h3 className="text-[14px] font-bold text-foreground mb-4 border-b border-border pb-3 flex items-center gap-2">
                <CatIcon className="w-4 h-4 text-primary" />
                {categoryLabels[cat] || cat}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {marketingServices
                  .filter((s) => s.category === cat)
                  .map((service, i) => {
                    const isSelected = selected.includes(service.id);

                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.35 }}
                        onClick={() => onToggle(service.id)}
                        className={`group rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/[0.03] shadow-md shadow-primary/5"
                            : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                }`}
                              >
                                {isSelected ? <Check className="w-4 h-4" /> : <CatIcon className="w-4 h-4" />}
                              </div>
                              <span className="font-semibold text-foreground text-[14px] tracking-[-0.01em]">{service.name}</span>
                            </div>
                          </div>

                          <p className="text-[12px] text-muted-foreground mt-1.5 mb-3 ml-[42px]">{service.description}</p>

                          <div className="flex flex-wrap gap-2 text-[12px] mb-3 ml-[42px]">
                            {service.setupPrice && (
                              <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                                Setup: €{service.setupPrice}
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-bold">
                              €{service.monthlyPrice}/mnd
                            </span>
                          </div>

                          {service.features.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(expandedId === service.id ? null : service.id);
                              }}
                              className="text-[12px] text-primary font-medium flex items-center gap-0.5 hover:underline ml-[42px]"
                            >
                              {expandedId === service.id ? "Minder" : "Details"}
                              {expandedId === service.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}

                          <AnimatePresence>
                            {expandedId === service.id && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 space-y-1.5 ml-[42px] overflow-hidden"
                              >
                                {service.features.map((f) => (
                                  <li key={f} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                    {f}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[12px] text-muted-foreground mt-8">
        Alle prijzen ex. BTW. Advertentiebudget niet inbegrepen.
      </p>
    </div>
  );
}
